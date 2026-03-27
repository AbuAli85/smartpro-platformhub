import crypto from "crypto";
import fs from "fs";
import path from "path";
import type { PoolClient } from "pg";
import {
  createPostgresPool,
  getPostgresConfigFromEnv,
} from "../packages/data/postgres-config";

const MIGRATION_LOCK_KEY = 90420260327;

type MigrationFailureType =
  | "LOCK_UNAVAILABLE"
  | "SQL_EXECUTION_FAILED"
  | "STATE_RECORD_FAILED"
  | "CHECKSUM_MISMATCH"
  | "UNKNOWN";

interface MigrationRunSummary {
  totalFiles: number;
  appliedCount: number;
  skippedCount: number;
  failedFile?: string;
  failureType?: MigrationFailureType;
}

function calculateChecksum(content: string): string {
  return crypto.createHash("sha256").update(content, "utf8").digest("hex");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function classifyMigrationError(error: unknown): MigrationFailureType {
  if (
    typeof error === "object" &&
    error !== null &&
    "migrationFailureType" in error &&
    typeof (error as { migrationFailureType?: unknown }).migrationFailureType ===
      "string"
  ) {
    return (error as { migrationFailureType: MigrationFailureType })
      .migrationFailureType;
  }

  return "UNKNOWN";
}

function printMigrationSummary(summary: MigrationRunSummary): void {
  console.log("\nMigration summary:");
  console.log(`- total files: ${summary.totalFiles}`);
  console.log(`- applied: ${summary.appliedCount}`);
  console.log(`- skipped: ${summary.skippedCount}`);
  if (summary.failedFile) {
    console.log(`- failed file: ${summary.failedFile}`);
  } else {
    console.log(`- failed: none`);
  }
  if (summary.failureType) {
    console.log(`- failure type: ${summary.failureType}`);
  }
}

async function acquireMigrationLock(
  client: PoolClient,
  lockKey: number,
): Promise<void> {
  const mode = process.env.MIGRATION_LOCK_MODE ?? "fail_fast";
  const timeoutMs = Number(process.env.MIGRATION_LOCK_TIMEOUT_MS ?? "10000");

  if (mode === "fail_fast") {
    const result = await client.query<{ locked: boolean }>(
      `select pg_try_advisory_lock($1) as locked`,
      [lockKey],
    );

    if (!result.rows[0]?.locked) {
      const error = new Error(
        "Could not acquire migration lock. Another migration runner may already be active.",
      );
      (
        error as Error & { migrationFailureType?: MigrationFailureType }
      ).migrationFailureType = "LOCK_UNAVAILABLE";
      throw error;
    }

    return;
  }

  if (mode !== "wait") {
    throw new Error(
      `Invalid MIGRATION_LOCK_MODE "${mode}". Use "fail_fast" or "wait".`,
    );
  }

  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const result = await client.query<{ locked: boolean }>(
      `select pg_try_advisory_lock($1) as locked`,
      [lockKey],
    );

    if (result.rows[0]?.locked) {
      return;
    }

    await sleep(500);
  }

  const error = new Error(
    `Could not acquire migration lock within ${timeoutMs}ms.`,
  );
  (
    error as Error & { migrationFailureType?: MigrationFailureType }
  ).migrationFailureType = "LOCK_UNAVAILABLE";
  throw error;
}

async function ensureMigrationStateTable(): Promise<void> {
  const config = getPostgresConfigFromEnv();
  const pool = createPostgresPool(config);

  try {
    await pool.query(`
      create table if not exists public.schema_migrations (
        id uuid primary key default gen_random_uuid(),
        filename text not null unique,
        checksum text,
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

  const summary: MigrationRunSummary = {
    totalFiles: files.length,
    appliedCount: 0,
    skippedCount: 0,
  };

  try {
    await acquireMigrationLock(client, MIGRATION_LOCK_KEY);

    for (const file of files) {
      const fullPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(fullPath, "utf-8");
      const checksum = calculateChecksum(sql);

      const existing = await client.query<{
        filename: string;
        checksum: string | null;
      }>(
        `
        select filename, checksum
        from public.schema_migrations
        where filename = $1
        limit 1
        `,
        [file],
      );

      if (existing.rows[0]) {
        const storedChecksum = existing.rows[0].checksum;

        if (storedChecksum === null || storedChecksum === "") {
          await client.query(
            `
            update public.schema_migrations
            set checksum = $1
            where filename = $2
            `,
            [checksum, file],
          );
          console.log(
            `Backfilled checksum for previously applied migration: ${file}`,
          );
          summary.skippedCount += 1;
          continue;
        }

        if (storedChecksum !== checksum) {
          const error = new Error(
            `Checksum mismatch for applied migration: ${file}. The migration file was changed after it was applied; historical migrations must be immutable.`,
          );
          (
            error as Error & { migrationFailureType?: MigrationFailureType }
          ).migrationFailureType = "CHECKSUM_MISMATCH";
          summary.failedFile = file;
          summary.failureType = "CHECKSUM_MISMATCH";
          throw error;
        }

        console.log(`Skipping already applied migration: ${file}`);
        summary.skippedCount += 1;
        continue;
      }

      console.log(`Applying migration: ${file}`);

      try {
        await client.query(sql);
      } catch (error) {
        (
          error as Error & { migrationFailureType?: MigrationFailureType }
        ).migrationFailureType = "SQL_EXECUTION_FAILED";
        summary.failedFile = file;
        summary.failureType = "SQL_EXECUTION_FAILED";
        throw error;
      }

      try {
        await client.query(
          `
          insert into public.schema_migrations (filename, checksum)
          values ($1, $2)
          `,
          [file, checksum],
        );
      } catch (error) {
        (
          error as Error & { migrationFailureType?: MigrationFailureType }
        ).migrationFailureType = "STATE_RECORD_FAILED";
        summary.failedFile = file;
        summary.failureType = "STATE_RECORD_FAILED";
        throw error;
      }

      summary.appliedCount += 1;
    }

    console.log("All pending migrations applied successfully.");
    printMigrationSummary(summary);
  } catch (error) {
    if (!summary.failureType) {
      summary.failureType = classifyMigrationError(error);
    }
    printMigrationSummary(summary);
    if (
      summary.failureType === "CHECKSUM_MISMATCH" &&
      summary.failedFile
    ) {
      console.error(
        "\nIntegrity failure: an applied migration file no longer matches the recorded checksum.",
      );
      console.error(
        `File: ${summary.failedFile} — failure type: CHECKSUM_MISMATCH`,
      );
    }
    throw error;
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
