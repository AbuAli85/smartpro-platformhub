import { randomUUID } from "crypto";
import { testDb } from "./test-db";

export async function seedUser(params?: { id?: string }) {
  const id = params?.id ?? randomUUID();
  await testDb.pool.query(`insert into public.users (id) values ($1)`, [id]);
  return { id };
}

export async function seedCompany(params?: { id?: string }) {
  const id = params?.id ?? randomUUID();
  await testDb.pool.query(`insert into public.companies (id) values ($1)`, [id]);
  return { id };
}

export async function seedRole(params: {
  name: string;
  scopeType: "platform" | "company";
}) {
  const result = await testDb.pool.query(
    `
    insert into public.roles (name, scope_type, is_system_role)
    values ($1, $2, true)
    returning id, name, scope_type
    `,
    [params.name, params.scopeType],
  );

  return result.rows[0];
}

export async function seedPermission(name: string) {
  const result = await testDb.pool.query(
    `
    insert into public.permissions (name)
    values ($1)
    returning id, name
    `,
    [name],
  );

  return result.rows[0];
}

export async function seedRolePermission(params: {
  roleId: string;
  permissionId: string;
}) {
  await testDb.pool.query(
    `
    insert into public.role_permissions (role_id, permission_id)
    values ($1, $2)
    `,
    [params.roleId, params.permissionId],
  );
}

export async function seedMembership(params: {
  userId: string;
  companyId: string;
  status?: "active" | "inactive" | "suspended" | "invited";
}) {
  const result = await testDb.pool.query(
    `
    insert into public.memberships (user_id, company_id, status)
    values ($1, $2, $3)
    returning id, user_id, company_id, status
    `,
    [params.userId, params.companyId, params.status ?? "active"],
  );

  return result.rows[0];
}

export async function seedUserRole(params: {
  userId: string;
  roleId: string;
  companyId?: string | null;
  assignedByUserId?: string | null;
}) {
  const result = await testDb.pool.query(
    `
    insert into public.user_roles (user_id, role_id, company_id, assigned_by_user_id)
    values ($1, $2, $3, $4)
    returning id, user_id, role_id, company_id, assigned_by_user_id, created_at
    `,
    [
      params.userId,
      params.roleId,
      params.companyId ?? null,
      params.assignedByUserId ?? null,
    ],
  );

  return result.rows[0];
}

export async function seedServiceRequest(params: {
  companyId: string;
  serviceId: string;
  requestedByUserId: string;
  status: string;
  submittedAt?: string | null;
}) {
  const result = await testDb.pool.query(
    `
    insert into public.service_requests (
      company_id,
      service_id,
      requested_by_user_id,
      status,
      submitted_at
    )
    values ($1, $2, $3, $4, $5)
    returning id, company_id, service_id, requested_by_user_id, status, submitted_at
    `,
    [
      params.companyId,
      params.serviceId,
      params.requestedByUserId,
      params.status,
      params.submittedAt ?? null,
    ],
  );

  return result.rows[0];
}

export async function seedCase(params: {
  companyId?: string;
  serviceId: string;
  status: string;
}) {
  const companyId = params.companyId ?? (await seedCompany()).id;

  const result = await testDb.pool.query(
    `
    insert into public.cases (company_id, service_id, status)
    values ($1, $2, $3)
    returning id, company_id, service_id, status
    `,
    [companyId, params.serviceId, params.status],
  );

  return result.rows[0];
}

export async function seedDocument(params: {
  companyId?: string;
  caseId?: string | null;
  status: string;
  storagePath: string;
}) {
  const companyId = params.companyId ?? (await seedCompany()).id;

  const result = await testDb.pool.query(
    `
    insert into public.documents (company_id, case_id, status, storage_path)
    values ($1, $2, $3, $4)
    returning id, company_id, case_id, status, storage_path
    `,
    [companyId, params.caseId ?? null, params.status, params.storagePath],
  );

  return result.rows[0];
}
