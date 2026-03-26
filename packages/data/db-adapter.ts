export interface QueryResultRow {
  [key: string]: unknown;
}

export interface QueryResult<T extends QueryResultRow = QueryResultRow> {
  rows: T[];
}

export interface DbAdapter {
  query<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params?: unknown[],
  ): Promise<QueryResult<T>>;
}
