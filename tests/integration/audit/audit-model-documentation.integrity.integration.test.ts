import { beforeEach, describe, expect, it } from "vitest";
import { AUDIT_ACTOR_TYPE_VALUES } from "../../../packages/audit/types";
import type { AuthContext } from "../../../packages/auth/auth-context";
import { PERMISSIONS } from "../../../packages/auth/permissions";
import { createPostgresPool, getPostgresConfigFromEnv } from "../../../packages/data/postgres-config";
import { PostgresAdapter } from "../../../packages/data/postgres-adapter";
import { assignUserRoleTransactional } from "../../../packages/server/admin/assign-user-role.transactional";
import {
  DOCUMENTED_AUDIT_ACTOR_TYPES,
  DOCUMENTED_AUDIT_ENTITY_TYPES,
  DOCUMENTED_CRITICAL_AUDITED_FLOWS,
} from "../helpers/audit-model-expectations";
import { seedCompany, seedRole, seedUser } from "../helpers/seed-fixtures";
import { testDb } from "../helpers/test-db";

function sortedStrings(values: readonly string[]): string[] {
  return [...values].sort((a, b) => a.localeCompare(b));
}

describe("audit model documentation integrity", () => {
  beforeEach(async () => {
    await testDb.resetKnownTables();
  });

  it("matches documented actor types to runtime expectations", () => {
    expect(sortedStrings(DOCUMENTED_AUDIT_ACTOR_TYPES)).toEqual(
      sortedStrings([...AUDIT_ACTOR_TYPE_VALUES]),
    );
  });

  it("matches documented critical audited flow metadata to persisted role assignment audit row", async () => {
    const expected = DOCUMENTED_CRITICAL_AUDITED_FLOWS.assignUserRole;

    const actor = await seedUser();
    const target = await seedUser();
    const company = await seedCompany();
    const companyRole = await seedRole({
      name: `audit_model_${actor.id.slice(0, 8)}`,
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

      const result = await testDb.pool.query<{
        action: string;
        actor_type: string;
        entity_type: string;
        entity_id: string;
      }>(
        `
        select action, actor_type, entity_type, entity_id
        from public.audit_events
        where action = $1
        order by created_at desc
        limit 1
        `,
        [expected.action],
      );

      expect(result.rows).toHaveLength(1);
      const row = result.rows[0];
      expect(row?.action).toBe(expected.action);
      expect(row?.actor_type).toBe(expected.actorType);
      expect(row?.entity_type).toBe(expected.entityType);
      expect(row?.entity_id).toBe(created.id);
    } finally {
      await pool.end();
    }
  });

  it("matches documented entity type expectations for implemented audited flows", async () => {
    const entityTypes = new Set<string>(DOCUMENTED_AUDIT_ENTITY_TYPES);

    const actor = await seedUser();
    const target = await seedUser();
    const company = await seedCompany();
    const companyRole = await seedRole({
      name: `audit_ent_${actor.id.slice(0, 8)}`,
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
      await assignUserRoleTransactional(
        { auth, db },
        {
          targetUserId: target.id,
          roleId: companyRole.id,
          companyId: company.id,
        },
      );

      const result = await testDb.pool.query<{ entity_type: string }>(
        `
        select entity_type
        from public.audit_events
        where action = $1
        order by created_at desc
        limit 1
        `,
        [DOCUMENTED_CRITICAL_AUDITED_FLOWS.assignUserRole.action],
      );

      expect(result.rows).toHaveLength(1);
      const entityType = result.rows[0]?.entity_type;
      expect(entityType).toBeDefined();
      expect(entityTypes.has(entityType!)).toBe(true);
    } finally {
      await pool.end();
    }
  });
});
