import { beforeEach, describe, expect, it } from "vitest";
import { PERMISSIONS } from "../../../packages/auth/permissions";
import { seedRbac } from "../helpers/seed-rbac";
import { testDb } from "../helpers/test-db";

function sortedStrings(values: Iterable<string>): string[] {
  return [...values].sort((a, b) => a.localeCompare(b));
}

describe("permission catalog integrity", () => {
  beforeEach(async () => {
    await testDb.resetKnownTables();
    await seedRbac();
  });

  it("has no duplicate permission constant values", () => {
    const values = Object.values(PERMISSIONS);
    expect(new Set(values).size).toBe(values.length);
  });

  it("matches permission constants to seeded permissions", async () => {
    const permissionConstants = Object.values(PERMISSIONS);

    const result = await testDb.pool.query<{ name: string }>(
      `select name from public.permissions order by name`,
    );

    const dbPermissions = result.rows.map((row) => row.name);

    expect(dbPermissions.length).toBe(new Set(dbPermissions).size);

    expect(sortedStrings(dbPermissions)).toEqual(
      sortedStrings(permissionConstants),
    );
  });

  it("has no orphan seeded permissions outside permission constants", async () => {
    const constantSet = new Set<string>(Object.values(PERMISSIONS));

    const result = await testDb.pool.query<{ name: string }>(
      `select name from public.permissions`,
    );

    for (const row of result.rows) {
      expect(constantSet.has(row.name)).toBe(true);
    }
  });

  it("has no seeded permissions missing from permission constants", async () => {
    const result = await testDb.pool.query<{ name: string }>(
      `select name from public.permissions`,
    );
    const dbSet = new Set(result.rows.map((r) => r.name));

    for (const permission of Object.values(PERMISSIONS)) {
      expect(dbSet.has(permission)).toBe(true);
    }
  });
});
