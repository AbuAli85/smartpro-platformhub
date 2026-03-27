import { beforeEach, describe, expect, it } from "vitest";
import { seedRbac } from "../helpers/seed-rbac";
import { testDb } from "../helpers/test-db";

const PLATFORM_ROLE_NAMES = [
  "super_admin",
  "platform_admin",
  "reviewer",
  "support",
  "finance_admin",
] as const;

const COMPANY_ROLE_NAMES = [
  "owner",
  "company_admin",
  "manager",
  "staff",
  "provider",
  "client",
] as const;

const CRITICAL_PERMISSIONS = [
  "roles:manage",
  "users:manage",
  "cases:read",
  "cases:approve",
  "documents:verify",
  "billing:manage",
  "payments:confirm",
  "audit:read",
] as const;

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

describe("RBAC seed invariants", () => {
  beforeEach(async () => {
    await testDb.resetKnownTables();
    await seedRbac();
  });

  it("contains required system roles with expected scope", async () => {
    const result = await testDb.pool.query<{
      name: string;
      scope_type: string;
    }>(
      `
      select name, scope_type
      from public.roles
      where name = any($1::text[])
      order by name
      `,
      [[...PLATFORM_ROLE_NAMES, ...COMPANY_ROLE_NAMES]],
    );

    expect(result.rows.length).toBe(
      PLATFORM_ROLE_NAMES.length + COMPANY_ROLE_NAMES.length,
    );

    const byName = new Map(result.rows.map((r) => [r.name, r.scope_type]));

    for (const name of PLATFORM_ROLE_NAMES) {
      expect(byName.get(name)).toBe("platform");
    }
    for (const name of COMPANY_ROLE_NAMES) {
      expect(byName.get(name)).toBe("company");
    }
  });

  it("contains critical permissions", async () => {
    const result = await testDb.pool.query<{ name: string }>(
      `
      select name
      from public.permissions
      where name = any($1::text[])
      `,
      [CRITICAL_PERMISSIONS],
    );

    const names = new Set(result.rows.map((r) => r.name));
    for (const p of CRITICAL_PERMISSIONS) {
      expect(names.has(p)).toBe(true);
    }
  });

  it("maps critical platform role permissions correctly", async () => {
    expect(await roleHasPermission("platform_admin", "roles:manage")).toBe(
      true,
    );
    expect(await roleHasPermission("reviewer", "cases:approve")).toBe(true);
    expect(await roleHasPermission("reviewer", "documents:verify")).toBe(
      true,
    );
    expect(await roleHasPermission("finance_admin", "payments:confirm")).toBe(
      true,
    );
  });

  it("maps critical company role permissions correctly", async () => {
    expect(await roleHasPermission("owner", "cases:assign")).toBe(true);
  });

  it("does not grant forbidden high-privilege permissions to lower roles", async () => {
    expect(await roleHasPermission("staff", "roles:manage")).toBe(false);
  });

  it("super_admin has every permission in the catalog", async () => {
    const result = await testDb.pool.query<{ c: string; t: string }>(
      `
      select
        (select count(*)::text from public.permissions) as c,
        (
          select count(distinct p.id)::text
          from public.role_permissions rp
          join public.roles r on r.id = rp.role_id
          join public.permissions p on p.id = rp.permission_id
          where r.name = 'super_admin'
        ) as t
      `,
    );

    expect(result.rows[0]?.c).toBe(result.rows[0]?.t);
  });
});
