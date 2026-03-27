import { testDb } from "./test-db";

export async function countRows(tableName: string): Promise<number> {
  const result = await testDb.pool.query(
    `select count(*)::int as count from ${tableName}`,
  );
  return result.rows[0].count;
}

export async function getAuditEventsByAction(action: string) {
  const result = await testDb.pool.query(
    `
    select *
    from public.audit_events
    where action = $1
    order by created_at desc
    `,
    [action],
  );
  return result.rows;
}

export async function getUserRolesByUserId(userId: string) {
  const result = await testDb.pool.query(
    `
    select *
    from public.user_roles
    where user_id = $1
    order by created_at desc
    `,
    [userId],
  );
  return result.rows;
}
