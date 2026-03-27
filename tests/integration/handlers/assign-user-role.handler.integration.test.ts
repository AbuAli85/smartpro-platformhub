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
import { seedCompany, seedRole, seedUser } from "../helpers/seed-fixtures";
import { testDb } from "../helpers/test-db";

describe("assignUserRoleTransactional handler", () => {
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

  it("returns 403 when missing roles:manage permission", async () => {
    const actor = await seedUser();
    const target = await seedUser();
    const company = await seedCompany();
    const companyRole = await seedRole({
      name: `role_no_perm_${actor.id.slice(0, 8)}`,
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
    } finally {
      await pool.end();
    }
  });

  it("returns 403 when roles:manage exists only on company membership, not platform", async () => {
    const actor = await seedUser();
    const target = await seedUser();
    const company = await seedCompany();
    const companyRole = await seedRole({
      name: `role_membership_${actor.id.slice(0, 8)}`,
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
    } finally {
      await pool.end();
    }
  });

  it("assigns role when platform roles:manage is granted", async () => {
    const actor = await seedUser();
    const target = await seedUser();
    const company = await seedCompany();
    const companyRole = await seedRole({
      name: `role_ok_${actor.id.slice(0, 8)}`,
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
      if (result.status === 200) {
        expect(result.data?.userId).toBe(target.id);
        expect(result.data?.roleId).toBe(companyRole.id);
      }
    } finally {
      await pool.end();
    }
  });
});
