import {
  createPostgresPool,
  getPostgresConfigFromEnv,
} from "../packages/data/postgres-config";

async function main() {
  const config = getPostgresConfigFromEnv();
  const pool = createPostgresPool(config);

  const tables = [
    "public.audit_events",
    "public.documents",
    "public.cases",
    "public.service_requests",
    "public.user_roles",
    "public.role_permissions",
    "public.permissions",
    "public.roles",
    "public.memberships",
    "public.companies",
    "public.users",
  ];

  try {
    console.log("Resetting test database...");
    await pool.query(
      `truncate table ${tables.join(", ")} restart identity cascade;`,
    );
    console.log("Test database reset complete.");
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Test DB reset failed.");
  console.error(error);
  process.exit(1);
});
