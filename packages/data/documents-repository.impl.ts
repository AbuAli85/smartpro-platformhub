import type { DbExecutor } from "./db-adapter";
import type {
  DocumentRecord,
  DocumentsRepository,
  GetDocumentByIdInCompanyParams,
  ListDocumentsByCaseInCompanyParams,
  UpdateDocumentStatusInCompanyParams,
} from "./documents-repository";

interface DocumentRow {
  id: string;
  company_id: string;
  case_id: string | null;
  status: string;
  storage_path: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

function mapDocumentRow(row: DocumentRow): DocumentRecord {
  return {
    id: row.id,
    companyId: row.company_id,
    caseId: row.case_id,
    status: row.status,
    storagePath: row.storage_path,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createDocumentsRepositoryImpl(
  db: DbExecutor,
): DocumentsRepository {
  return {
    async getByIdInCompany(
      params: GetDocumentByIdInCompanyParams,
    ): Promise<DocumentRecord | null> {
      const result = await db.query<DocumentRow>(
        `
        select id, company_id, case_id, status, storage_path, created_at, updated_at
        from public.documents
        where id = $1
          and company_id = $2
        limit 1
        `,
        [params.documentId, params.companyId],
      );

      return result.rows[0] ? mapDocumentRow(result.rows[0]) : null;
    },

    async listByCaseInCompany(
      params: ListDocumentsByCaseInCompanyParams,
    ): Promise<DocumentRecord[]> {
      const result = await db.query<DocumentRow>(
        `
        select id, company_id, case_id, status, storage_path, created_at, updated_at
        from public.documents
        where case_id = $1
          and company_id = $2
        order by created_at desc
        `,
        [params.caseId, params.companyId],
      );

      return result.rows.map(mapDocumentRow);
    },

    async updateStatusInCompany(
      params: UpdateDocumentStatusInCompanyParams,
    ): Promise<DocumentRecord | null> {
      const result = await db.query<DocumentRow>(
        `
        update public.documents
        set status = $3,
            updated_at = now()
        where id = $1
          and company_id = $2
        returning id, company_id, case_id, status, storage_path, created_at, updated_at
        `,
        [params.documentId, params.companyId, params.status],
      );

      return result.rows[0] ? mapDocumentRow(result.rows[0]) : null;
    },
  };
}
