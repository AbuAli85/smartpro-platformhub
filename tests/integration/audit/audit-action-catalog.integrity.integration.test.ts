import { beforeEach, describe, expect, it } from "vitest";
import type { AuthContext } from "../../../packages/auth/auth-context";
import { PERMISSIONS } from "../../../packages/auth/permissions";
import { createPostgresPool, getPostgresConfigFromEnv } from "../../../packages/data/postgres-config";
import { PostgresAdapter } from "../../../packages/data/postgres-adapter";
import { assignUserRoleTransactional } from "../../../packages/server/admin/assign-user-role.transactional";
import {
  CRITICAL_RUNTIME_AUDIT_ACTIONS,
  DOCUMENTED_AUDIT_ACTIONS,
  FORBIDDEN_AUDIT_ACTION_ALIASES,
} from "../helpers/audit-action-expectations";
import { getAuditEventsByAction } from "../helpers/assert-db-state";
import { seedCompany, seedRole, seedUser } from "../helpers/seed-fixtures";
import { testDb } from "../helpers/test-db";

describe("audit action catalog integrity", () => {
  beforeEach(async () => {
    await testDb.resetKnownTables();
  });

  it("has unique documented audit action names", () => {
    expect(new Set(DOCUMENTED_AUDIT_ACTIONS).size).toBe(
      DOCUMENTED_AUDIT_ACTIONS.length,
    );
  });

  it("matches critical runtime audit action names to documented expectations", () => {
    const documented = new Set<string>(DOCUMENTED_AUDIT_ACTIONS);
    expect(
      documented.has(CRITICAL_RUNTIME_AUDIT_ACTIONS.assignUserRole),
    ).toBe(true);
  });

  it("persists expected audit action for role assignment", async () => {
    const actor = await seedUser();
    const target = await seedUser();
    const company = await seedCompany();
    const companyRole = await seedRole({
      name: `audit_cat_${actor.id.slice(0, 8)}`,
      scopeType: "company",
    });

    const auth: AuthContext = {
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

      const auditEvents = await getAuditEventsByAction(
        CRITICAL_RUNTIME_AUDIT_ACTIONS.assignUserRole,
      );

      expect(auditEvents).toHaveLength(1);
      expect(auditEvents[0].action).toBe(
        CRITICAL_RUNTIME_AUDIT_ACTIONS.assignUserRole,
      );
      expect(auditEvents[0].entity_type).toBe("user_role");
      expect(auditEvents[0].entity_id).toBe(created.id);
      expect(auditEvents[0].actor_user_id).toBe(actor.id);

      const forbidden = await testDb.pool.query<{ c: string }>(
        `
        select count(*)::text as c
        from public.audit_events
        where action = any($1::text[])
        `,
        [FORBIDDEN_AUDIT_ACTION_ALIASES],
      );
      expect(Number(forbidden.rows[0]?.c)).toBe(0);
    } finally {
      await pool.end();
    }
  });
});
