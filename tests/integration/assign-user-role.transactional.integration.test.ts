import { beforeEach, describe, expect, it } from "vitest";
import { createAuditService } from "../../packages/audit/audit-service";
import { PERMISSIONS } from "../../packages/auth/permissions";
import { createPostgresPool, getPostgresConfigFromEnv } from "../../packages/data/postgres-config";
import { PostgresAdapter } from "../../packages/data/postgres-adapter";
import { createUserRolesRepository } from "../../packages/data/user-roles-repository.impl";
import { assignUserRoleTransactional } from "../../packages/server/admin/assign-user-role.transactional";
import { getAuditEventsByAction, getUserRolesByUserId } from "./helpers/assert-db-state";
import { createFailingAuditRepository } from "./helpers/failure-injection";
import { seedCompany, seedRole, seedUser } from "./helpers/seed-fixtures";
import { testDb } from "./helpers/test-db";

describe("assign user role transactional flow", () => {
  beforeEach(async () => {
    await testDb.resetKnownTables();
  });

  it("commits role assignment and audit event together", async () => {
    const actor = await seedUser();
    const target = await seedUser();
    const company = await seedCompany();

    const companyRole = await seedRole({
      name: `manager_test_${actor.id.slice(0, 8)}`,
      scopeType: "company",
    });

    const auth = {
      userId: actor.id,
      platformRoles: ["platform_admin"],
      platformPermissions: [PERMISSIONS.ROLES_MANAGE],
      memberships: [],
    };

    const pool = createPostgresPool(getPostgresConfigFromEnv());
    const db = new PostgresAdapter(pool);

    try {
      const created = await assignUserRoleTransactional(
        { auth, db },
        {
          targetUserId: target.id,
          roleId: companyRole.id,
          companyId: company.id,
        },
      );

      const userRoles = await getUserRolesByUserId(target.id);
      const auditEvents = await getAuditEventsByAction("user_role.assigned");

      expect(created.id).toBeTruthy();
      expect(userRoles).toHaveLength(1);
      expect(auditEvents).toHaveLength(1);
      expect(auditEvents[0].entity_id).toBe(created.id);
    } finally {
      await pool.end();
    }
  });

  it("rolls back role assignment when audit write fails", async () => {
    const actor = await seedUser();
    const target = await seedUser();
    const company = await seedCompany();
    const companyRole = await seedRole({
      name: `manager_test_rb_${actor.id.slice(0, 8)}`,
      scopeType: "company",
    });

    const pool = createPostgresPool(getPostgresConfigFromEnv());
    const db = new PostgresAdapter(pool);

    try {
      await expect(
        db.transaction(async (tx) => {
          const userRolesRepository = createUserRolesRepository(tx);
          const auditService = createAuditService(
            createFailingAuditRepository("Injected audit failure"),
          );

          const created = await userRolesRepository.assignRole({
            targetUserId: target.id,
            roleId: companyRole.id,
            companyId: company.id,
            assignedByUserId: actor.id,
          });

          await auditService.log({
            actorUserId: actor.id,
            actorType: "user",
            action: "user_role.assigned",
            entityType: "user_role",
            entityId: created.id,
          });
        }),
      ).rejects.toThrow("Injected audit failure");

      const userRoles = await getUserRolesByUserId(target.id);
      const auditEvents = await getAuditEventsByAction("user_role.assigned");

      expect(userRoles).toHaveLength(0);
      expect(auditEvents).toHaveLength(0);
    } finally {
      await pool.end();
    }
  });
});
