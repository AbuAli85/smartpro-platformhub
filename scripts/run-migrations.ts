import fs from "fs";
import path from "path";
import {
  createPostgresPool,
  getPostgresConfigFromEnv,
} from "../packages/data/postgres-config";

async function main() {
  const config = getPostgresConfigFromEnv();
  const pool = createPostgresPool(config);

  const migrationsDir = path.resolve("database/migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file: string) => file.endsWith(".sql"))
    .sort();

  try {
    for (const file of files) {
      const fullPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(fullPath, "utf-8");

      console.log(`Applying migration: ${file}`);
      await pool.query(sql);
    }

    console.log("All migrations applied successfully.");
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Migration run failed.");
  console.error(error);
  process.exit(1);
});
