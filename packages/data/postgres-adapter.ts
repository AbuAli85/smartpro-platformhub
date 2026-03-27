import type { Pool, PoolClient, QueryResult } from "pg";
import type {
  DbAdapter,
  DbExecutor,
  DbTransaction,
  QueryResultRow,
} from "./db-adapter";

type PgQueryable = Pick<Pool, "query" | "connect"> | Pick<PoolClient, "query">;

class PostgresExecutor implements DbExecutor {
  constructor(private readonly db: PgQueryable) {}

  async query<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params: unknown[] = [],
  ): Promise<{ rows: T[] }> {
    const result = (await this.db.query(sql, params)) as QueryResult<T>;
    return { rows: result.rows };
  }
}

class PostgresTransaction extends PostgresExecutor implements DbTransaction {}

export class PostgresAdapter extends PostgresExecutor implements DbAdapter {
  constructor(private readonly pool: Pool) {
    super(pool);
  }

  async transaction<T>(
    run: (tx: DbTransaction) => Promise<T>,
  ): Promise<T> {
    const client = await this.pool.connect();

    try {
      await client.query("begin");
      const tx = new PostgresTransaction(client);
      const result = await run(tx);
      await client.query("commit");
      return result;
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  }
}
