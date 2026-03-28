import type { DbExecutor } from "./db-adapter";
import type {
  GetServiceRequestByIdInCompanyParams,
  InsertServiceRequestInCompanyParams,
  ListServiceRequestsByCompanyParams,
  ServiceRequestRecord,
  ServiceRequestStatus,
  ServiceRequestsRepository,
  UpdateServiceRequestStatusInCompanyParams,
} from "./service-requests-repository";

interface ServiceRequestRow {
  id: string;
  company_id: string;
  service_id: string;
  requested_by_user_id: string;
  status: string;
  submitted_at: string | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

function mapRow(row: ServiceRequestRow): ServiceRequestRecord {
  return {
    id: row.id,
    companyId: row.company_id,
    serviceId: row.service_id,
    requestedByUserId: row.requested_by_user_id,
    status: row.status as ServiceRequestStatus,
    submittedAt: row.submitted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createServiceRequestsRepositoryImpl(
  db: DbExecutor,
): ServiceRequestsRepository {
  return {
    async insertInCompany(
      params: InsertServiceRequestInCompanyParams,
    ): Promise<ServiceRequestRecord> {
      const status = params.status ?? "draft";
      const result = await db.query<ServiceRequestRow>(
        `
        insert into public.service_requests (
          company_id,
          service_id,
          requested_by_user_id,
          status,
          submitted_at
        )
        values ($1, $2, $3, $4, $5)
        returning
          id,
          company_id,
          service_id,
          requested_by_user_id,
          status,
          submitted_at,
          created_at,
          updated_at
        `,
        [
          params.companyId,
          params.serviceId,
          params.requestedByUserId,
          status,
          status === "submitted" ? new Date().toISOString() : null,
        ],
      );

      const row = result.rows[0];
      if (!row) {
        throw new Error("Insert service_request returned no row");
      }
      return mapRow(row);
    },

    async getByIdInCompany(
      params: GetServiceRequestByIdInCompanyParams,
    ): Promise<ServiceRequestRecord | null> {
      const result = await db.query<ServiceRequestRow>(
        `
        select
          id,
          company_id,
          service_id,
          requested_by_user_id,
          status,
          submitted_at,
          created_at,
          updated_at
        from public.service_requests
        where id = $1
          and company_id = $2
        limit 1
        `,
        [params.serviceRequestId, params.companyId],
      );

      return result.rows[0] ? mapRow(result.rows[0]) : null;
    },

    async listByCompany(
      params: ListServiceRequestsByCompanyParams,
    ): Promise<ServiceRequestRecord[]> {
      const result = await db.query<ServiceRequestRow>(
        `
        select
          id,
          company_id,
          service_id,
          requested_by_user_id,
          status,
          submitted_at,
          created_at,
          updated_at
        from public.service_requests
        where company_id = $1
        order by created_at desc
        limit $2
        `,
        [params.companyId, params.limit ?? 50],
      );

      return result.rows.map(mapRow);
    },

    async updateStatusInCompany(
      params: UpdateServiceRequestStatusInCompanyParams,
    ): Promise<ServiceRequestRecord | null> {
      const result = await db.query<ServiceRequestRow>(
        `
        update public.service_requests sr
        set
          status = $3,
          submitted_at = case
            when $3 = 'submitted' and sr.submitted_at is null
            then now()
            else sr.submitted_at
          end,
          updated_at = now()
        where sr.id = $1
          and sr.company_id = $2
        returning
          sr.id,
          sr.company_id,
          sr.service_id,
          sr.requested_by_user_id,
          sr.status,
          sr.submitted_at,
          sr.created_at,
          sr.updated_at
        `,
        [params.serviceRequestId, params.companyId, params.status],
      );

      return result.rows[0] ? mapRow(result.rows[0]) : null;
    },
  };
}
