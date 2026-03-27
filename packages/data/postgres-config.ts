import { Pool } from "pg";

export interface PostgresConfig {
  connectionString: string;
}

export function getPostgresConfigFromEnv(): PostgresConfig {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required");
  }

  return { connectionString };
}

export function createPostgresPool(config: PostgresConfig): Pool {
  return new Pool({
    connectionString: config.connectionString,
  });
}
