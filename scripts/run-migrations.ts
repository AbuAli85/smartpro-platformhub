import fs from "fs";
import path from "path";
import {
  createPostgresPool,
  getPostgresConfigFromEnv,
} from "../packages/data/postgres-config";

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

  const migrationsDir = path.resolve("database/migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file: string) => file.endsWith(".sql"))
    .sort();

  try {
    for (const file of files) {
      const alreadyApplied = await pool.query(
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

      const client = await pool.connect();
      try {
        await client.query(sql);
        await client.query(
          `
          insert into public.schema_migrations (filename)
          values ($1)
          `,
          [file],
        );
      } catch (error) {
        throw error;
      } finally {
        client.release();
      }
    }

    console.log("All pending migrations applied successfully.");
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Migration run failed.");
  console.error(error);
  process.exit(1);
});
