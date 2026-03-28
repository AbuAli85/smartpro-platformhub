import { afterAll, beforeAll } from "vitest";
import {
  createPostgresPool,
  getPostgresConfigFromEnv,
} from "../../../packages/data/postgres-config";
import { PostgresAdapter } from "../../../packages/data/postgres-adapter";

export const testDb = (() => {
  const pool = createPostgresPool(getPostgresConfigFromEnv());
  const adapter = new PostgresAdapter(pool);

  return {
    pool,
    adapter,
    async resetKnownTables() {
      await pool.query(`
        truncate table
          public.audit_events,
          public.documents,
          public.cases,
          public.service_requests,
          public.user_roles,
          public.role_permissions,
          public.permissions,
          public.roles,
          public.memberships,
          public.companies,
          public.users
        restart identity cascade;
      `);
    },
  };
})();

beforeAll(async () => {
  // database should already be migrated before tests run
});

afterAll(async () => {
  await testDb.pool.end();
});
