import { afterAll, beforeAll } from "vitest";
import {
  createPostgresPool,
  getPostgresConfigFromEnv,
} from "../../../packages/data/postgres-config";
import { PostgresAdapter } from "../../../packages/data/postgres-adapter";

/** Serialize TRUNCATE across any stray parallel runners (must match Vitest single-thread policy). */
const RESET_KNOWN_TABLES_ADVISORY_LOCK_KEY = 425_001;

export const testDb = (() => {
  const pool = createPostgresPool(getPostgresConfigFromEnv());
  const adapter = new PostgresAdapter(pool);

  return {
    pool,
    adapter,
    async resetKnownTables() {
      const client = await pool.connect();
      try {
        await client.query(
          "select pg_advisory_lock($1::bigint)",
          [RESET_KNOWN_TABLES_ADVISORY_LOCK_KEY],
        );
        await client.query(`
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
      } finally {
        await client.query(
          "select pg_advisory_unlock($1::bigint)",
          [RESET_KNOWN_TABLES_ADVISORY_LOCK_KEY],
        );
        client.release();
      }
    },
  };
})();

beforeAll(async () => {
  // database should already be migrated before tests run
});

afterAll(async () => {
  await testDb.pool.end();
});
