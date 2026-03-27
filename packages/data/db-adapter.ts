export interface QueryResultRow {
  [key: string]: unknown;
}

export interface QueryResult<T extends QueryResultRow = QueryResultRow> {
  rows: T[];
}

export interface DbExecutor {
  query<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params?: unknown[],
  ): Promise<QueryResult<T>>;
}

export interface DbTransaction extends DbExecutor {}

export interface DbAdapter extends DbExecutor {
  transaction<T>(
    run: (tx: DbTransaction) => Promise<T>,
  ): Promise<T>;
}
