import { readFileSync } from "fs";
import path from "path";
import { testDb } from "./test-db";

/**
 * Applies `database/seeds/rbac_seed.sql` (expects cwd = repo root, as in `npm run test:integration`).
 */
export async function seedRbac(): Promise<void> {
  const seedPath = path.resolve(process.cwd(), "database/seeds/rbac_seed.sql");
  const sql = readFileSync(seedPath, "utf-8");
  await testDb.pool.query(sql);
}
