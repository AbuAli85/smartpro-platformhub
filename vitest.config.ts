import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // Shared DB + TRUNCATE in beforeEach: parallel files deadlock on Postgres.
    fileParallelism: false,
    maxWorkers: 1,
  },
});
