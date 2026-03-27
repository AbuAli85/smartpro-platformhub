import fs from "fs";
import path from "path";
import {
  createPostgresPool,
  getPostgresConfigFromEnv,
} from "../packages/data/postgres-config";

const MIGRATION_LOCK_KEY = 90420260327;

async function ensureMigrationStateTable() {
  const config = getPostgresConfigFromEnv();
  const pool = createPostgresPool(config);

  try {
    await pool.query(`
      create table if not exists public.schema_migrations (
        id uuid primary key default gen_random_uuid(),
        filename text not null unique,
        applied_at timestamptz not null default now()
      );
    `);
  } finally {
    await pool.end();
  }
}

async function main() {
  await ensureMigrationStateTable();

  const config = getPostgresConfigFromEnv();
  const pool = createPostgresPool(config);
  const client = await pool.connect();

  const migrationsDir = path.resolve("database/migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file: string) => file.endsWith(".sql"))
    .sort();

  try {
    const lockResult = await client.query<{ locked: boolean }>(
      `select pg_try_advisory_lock($1) as locked`,
      [MIGRATION_LOCK_KEY],
    );

    if (!lockResult.rows[0]?.locked) {
      throw new Error(
        "Could not acquire migration lock. Another migration runner may already be active.",
      );
    }

    for (const file of files) {
      const alreadyApplied = await client.query(
        `
        select 1
        from public.schema_migrations
        where filename = $1
        limit 1
        `,
        [file],
      );

      if (alreadyApplied.rows[0]) {
        console.log(`Skipping already applied migration: ${file}`);
        continue;
      }

      const fullPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(fullPath, "utf-8");

      console.log(`Applying migration: ${file}`);

      await client.query(sql);

      await client.query(
        `
        insert into public.schema_migrations (filename)
        values ($1)
        `,
        [file],
      );
    }

    console.log("All pending migrations applied successfully.");
  } finally {
    try {
      await client.query(`select pg_advisory_unlock($1)`, [MIGRATION_LOCK_KEY]);
    } catch {
      // best effort unlock
    }
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Migration run failed.");
  console.error(error);
  process.exit(1);
});
