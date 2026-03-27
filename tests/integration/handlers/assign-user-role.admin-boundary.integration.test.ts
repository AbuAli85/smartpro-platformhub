import { beforeEach, describe, expect, it } from "vitest";
import { PERMISSIONS } from "../../../packages/auth/permissions";
import { createPostgresPool, getPostgresConfigFromEnv } from "../../../packages/data/postgres-config";
import { PostgresAdapter } from "../../../packages/data/postgres-adapter";
import { assignUserRoleTransactionalHandler } from "../../../packages/server/admin/assign-user-role.handler";
import {
  createAuthContext,
  withActiveMembership,
  withPlatformPermissions,
} from "../helpers/auth-context";
import { getAuditEventsByAction, getUserRolesByUserId } from "../helpers/assert-db-state";
import { seedCompany, seedRole, seedUser } from "../helpers/seed-fixtures";
import { testDb } from "../helpers/test-db";

describe("assignUserRole admin boundary", () => {
  beforeEach(async () => {
    await testDb.resetKnownTables();
  });

  it("returns 401 when unauthenticated", async () => {
    const pool = createPostgresPool(getPostgresConfigFromEnv());
    const db = new PostgresAdapter(pool);

    try {
      const result = await assignUserRoleTransactionalHandler(
        { auth: null, db },
        {
          targetUserId: "00000000-0000-4000-8000-000000000011",
          roleId: "00000000-0000-4000-8000-000000000022",
          companyId: null,
        },
      );

      expect(result.status).toBe(401);
      if (result.status !== 200) {
        expect(result.error?.code).toBe("UNAUTHENTICATED");
      }
    } finally {
      await pool.end();
    }
  });

  it("returns 403 when missing platform roles:manage permission", async () => {
    const actor = await seedUser();
    const target = await seedUser();
    const company = await seedCompany();
    const companyRole = await seedRole({
      name: `ab_perm_${actor.id.slice(0, 8)}`,
      scopeType: "company",
    });

    const pool = createPostgresPool(getPostgresConfigFromEnv());
    const db = new PostgresAdapter(pool);

    try {
      const auth = withActiveMembership(
        createAuthContext({ userId: actor.id }),
        company.id,
        [PERMISSIONS.CASES_READ],
      );

      const result = await assignUserRoleTransactionalHandler(
        { auth, db },
        {
          targetUserId: target.id,
          roleId: companyRole.id,
          companyId: company.id,
        },
      );

      expect(result.status).toBe(403);
      if (result.status !== 200) {
        expect(result.error?.code).toBe("FORBIDDEN");
      }

      expect(await getUserRolesByUserId(target.id)).toHaveLength(0);
      expect(await getAuditEventsByAction("user_role.assigned")).toHaveLength(0);
    } finally {
      await pool.end();
    }
  });

  it("returns 403 when caller only has company-scoped roles:manage", async () => {
    const actor = await seedUser();
    const target = await seedUser();
    const company = await seedCompany();
    const companyRole = await seedRole({
      name: `ab_co_${actor.id.slice(0, 8)}`,
      scopeType: "company",
    });

    const pool = createPostgresPool(getPostgresConfigFromEnv());
    const db = new PostgresAdapter(pool);

    try {
      const auth = withActiveMembership(
        createAuthContext({ userId: actor.id }),
        company.id,
        [PERMISSIONS.ROLES_MANAGE],
      );

      const result = await assignUserRoleTransactionalHandler(
        { auth, db },
        {
          targetUserId: target.id,
          roleId: companyRole.id,
          companyId: company.id,
        },
      );

      expect(result.status).toBe(403);
      if (result.status !== 200) {
        expect(result.error?.code).toBe("FORBIDDEN");
      }

      expect(await getUserRolesByUserId(target.id)).toHaveLength(0);
      expect(await getAuditEventsByAction("user_role.assigned")).toHaveLength(0);
    } finally {
      await pool.end();
    }
  });

  it("rejects assigning company-scoped role without companyId", async () => {
    const actor = await seedUser();
    const target = await seedUser();
    const companyRole = await seedRole({
      name: `ab_nocomp_${actor.id.slice(0, 8)}`,
      scopeType: "company",
    });

    const pool = createPostgresPool(getPostgresConfigFromEnv());
    const db = new PostgresAdapter(pool);

    try {
      const auth = withPlatformPermissions(createAuthContext({ userId: actor.id }), [
        PERMISSIONS.ROLES_MANAGE,
      ]);

      const result = await assignUserRoleTransactionalHandler(
        { auth, db },
        {
          targetUserId: target.id,
          roleId: companyRole.id,
          companyId: null,
        },
      );

      expect(result.status).toBe(400);
      if (result.status !== 200) {
        expect(result.error?.code).toBe("INVALID_ROLE_SCOPE");
      }

      expect(await getUserRolesByUserId(target.id)).toHaveLength(0);
      expect(await getAuditEventsByAction("user_role.assigned")).toHaveLength(0);
    } finally {
      await pool.end();
    }
  });

  it("rejects assigning platform-scoped role with companyId", async () => {
    const actor = await seedUser();
    const target = await seedUser();
    const company = await seedCompany();
    const platformRole = await seedRole({
      name: `ab_plat_${actor.id.slice(0, 8)}`,
      scopeType: "platform",
    });

    const pool = createPostgresPool(getPostgresConfigFromEnv());
    const db = new PostgresAdapter(pool);

    try {
      const auth = withPlatformPermissions(createAuthContext({ userId: actor.id }), [
        PERMISSIONS.ROLES_MANAGE,
      ]);

      const result = await assignUserRoleTransactionalHandler(
        { auth, db },
        {
          targetUserId: target.id,
          roleId: platformRole.id,
          companyId: company.id,
        },
      );

      expect(result.status).toBe(400);
      if (result.status !== 200) {
        expect(result.error?.code).toBe("INVALID_ROLE_SCOPE");
      }

      expect(await getUserRolesByUserId(target.id)).toHaveLength(0);
      expect(await getAuditEventsByAction("user_role.assigned")).toHaveLength(0);
    } finally {
      await pool.end();
    }
  });

  it("writes audit event on successful role assignment", async () => {
    const actor = await seedUser();
    const target = await seedUser();
    const company = await seedCompany();
    const companyRole = await seedRole({
      name: `ab_ok_${actor.id.slice(0, 8)}`,
      scopeType: "company",
    });

    const pool = createPostgresPool(getPostgresConfigFromEnv());
    const db = new PostgresAdapter(pool);

    try {
      const auth = withPlatformPermissions(createAuthContext({ userId: actor.id }), [
        PERMISSIONS.ROLES_MANAGE,
      ]);

      const result = await assignUserRoleTransactionalHandler(
        { auth, db },
        {
          targetUserId: target.id,
          roleId: companyRole.id,
          companyId: company.id,
        },
      );

      expect(result.status).toBe(200);
      if (result.status !== 200 || !result.data) {
        throw new Error("expected successful role assignment with data");
      }

      const createdId = result.data.id;

      const roles = await getUserRolesByUserId(target.id);
      expect(roles).toHaveLength(1);
      expect(roles[0].role_id).toBe(companyRole.id);

      const audits = await getAuditEventsByAction("user_role.assigned");
      expect(audits).toHaveLength(1);
      expect(audits[0].action).toBe("user_role.assigned");
      expect(audits[0].entity_type).toBe("user_role");
      expect(audits[0].entity_id).toBe(createdId);
      expect(audits[0].actor_user_id).toBe(actor.id);
    } finally {
      await pool.end();
    }
  });
});
