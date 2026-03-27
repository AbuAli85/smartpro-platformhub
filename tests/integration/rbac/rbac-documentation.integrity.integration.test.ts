import { beforeEach, describe, expect, it } from "vitest";
import {
  DOCUMENTED_COMPANY_ROLES,
  DOCUMENTED_CRITICAL_ROLE_PERMISSIONS,
  DOCUMENTED_PLATFORM_ROLES,
} from "../helpers/rbac-doc-expectations";
import { seedRbac } from "../helpers/seed-rbac";
import { testDb } from "../helpers/test-db";

async function roleHasPermission(
  roleName: string,
  permissionName: string,
): Promise<boolean> {
  const result = await testDb.pool.query<{ ok: boolean }>(
    `
    select exists(
      select 1
      from public.role_permissions rp
      join public.roles r on r.id = rp.role_id
      join public.permissions p on p.id = rp.permission_id
      where r.name = $1 and p.name = $2
    ) as ok
    `,
    [roleName, permissionName],
  );
  return Boolean(result.rows[0]?.ok);
}

describe("RBAC documentation integrity", () => {
  beforeEach(async () => {
    await testDb.resetKnownTables();
    await seedRbac();
  });

  it("matches documented roles to seeded roles", async () => {
    const result = await testDb.pool.query<{ name: string; scope_type: string }>(
      `select name, scope_type from public.roles`,
    );
    const byName = new Map(
      result.rows.map((r) => [r.name, r.scope_type] as const),
    );

    for (const name of DOCUMENTED_PLATFORM_ROLES) {
      expect(byName.has(name)).toBe(true);
    }
    for (const name of DOCUMENTED_COMPANY_ROLES) {
      expect(byName.has(name)).toBe(true);
    }
  });

  it("matches documented role scopes to seeded role scopes", async () => {
    const result = await testDb.pool.query<{ name: string; scope_type: string }>(
      `select name, scope_type from public.roles`,
    );
    const byName = new Map(
      result.rows.map((r) => [r.name, r.scope_type] as const),
    );

    for (const name of DOCUMENTED_PLATFORM_ROLES) {
      expect(byName.get(name)).toBe("platform");
    }
    for (const name of DOCUMENTED_COMPANY_ROLES) {
      expect(byName.get(name)).toBe("company");
    }
  });

  it("matches documented critical role-permission mappings to seeded mappings", async () => {
    const critical = DOCUMENTED_CRITICAL_ROLE_PERMISSIONS;
    for (const roleName of Object.keys(critical) as Array<
      keyof typeof critical
    >) {
      for (const permissionName of critical[roleName]) {
        expect(
          await roleHasPermission(roleName, permissionName),
        ).toBe(true);
      }
    }
  });
});
