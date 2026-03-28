import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // Single shared Postgres + global TRUNCATE: no parallel workers or files.
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: true,
        minThreads: 1,
        maxThreads: 1,
      },
    },
    fileParallelism: false,
    maxWorkers: 1,
    minWorkers: 1,
  },
});
