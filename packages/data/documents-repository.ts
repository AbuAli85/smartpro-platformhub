export interface DocumentRecord {
  id: string;
  companyId: string;
  caseId: string | null;
  status: string;
  storagePath: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetDocumentByIdInCompanyParams {
  documentId: string;
  companyId: string;
}

export interface ListDocumentsByCaseInCompanyParams {
  caseId: string;
  companyId: string;
}

export interface UpdateDocumentStatusInCompanyParams {
  documentId: string;
  companyId: string;
  status: string;
}

export interface DocumentsRepository {
  getByIdInCompany(
    params: GetDocumentByIdInCompanyParams,
  ): Promise<DocumentRecord | null>;

  listByCaseInCompany(
    params: ListDocumentsByCaseInCompanyParams,
  ): Promise<DocumentRecord[]>;

  updateStatusInCompany(
    params: UpdateDocumentStatusInCompanyParams,
  ): Promise<DocumentRecord | null>;
}

export function createDocumentsRepository(): DocumentsRepository {
  return {
    async getByIdInCompany() {
      throw new Error("Not implemented");
    },

    async listByCaseInCompany() {
      throw new Error("Not implemented");
    },

    async updateStatusInCompany() {
      throw new Error("Not implemented");
    },
  };
}
