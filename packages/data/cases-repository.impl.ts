import type { DbExecutor } from "./db-adapter";
import type {
  CaseRecord,
  CasesRepository,
  GetCaseByIdInCompanyParams,
  ListCasesByCompanyParams,
  UpdateCaseStatusInCompanyParams,
} from "./cases-repository";

interface CaseRow {
  id: string;
  company_id: string;
  service_id: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

function mapCaseRow(row: CaseRow): CaseRecord {
  return {
    id: row.id,
    companyId: row.company_id,
    serviceId: row.service_id,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createCasesRepositoryImpl(db: DbExecutor): CasesRepository {
  return {
    async getByIdInCompany(
      params: GetCaseByIdInCompanyParams,
    ): Promise<CaseRecord | null> {
      const result = await db.query<CaseRow>(
        `
        select id, company_id, service_id, status, created_at, updated_at
        from public.cases
        where id = $1
          and company_id = $2
        limit 1
        `,
        [params.caseId, params.companyId],
      );

      return result.rows[0] ? mapCaseRow(result.rows[0]) : null;
    },

    async listByCompany(
      params: ListCasesByCompanyParams,
    ): Promise<CaseRecord[]> {
      const result = await db.query<CaseRow>(
        `
        select id, company_id, service_id, status, created_at, updated_at
        from public.cases
        where company_id = $1
        order by created_at desc
        limit $2
        `,
        [params.companyId, params.limit ?? 50],
      );

      return result.rows.map(mapCaseRow);
    },

    async updateStatusInCompany(
      params: UpdateCaseStatusInCompanyParams,
    ): Promise<CaseRecord | null> {
      const result = await db.query<CaseRow>(
        `
        update public.cases
        set status = $3,
            updated_at = now()
        where id = $1
          and company_id = $2
        returning id, company_id, service_id, status, created_at, updated_at
        `,
        [params.caseId, params.companyId, params.status],
      );

      return result.rows[0] ? mapCaseRow(result.rows[0]) : null;
    },
  };
}
