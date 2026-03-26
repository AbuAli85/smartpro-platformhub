export interface DocumentRecord {
  id: string;
  companyId: string;
  caseId: string | null;
  status: string;
  storagePath: string;
}

export interface DocumentRepository {
  getByIdInCompany(params: {
    documentId: string;
    companyId: string;
  }): Promise<DocumentRecord | null>;

  listByCaseInCompany(params: {
    caseId: string;
    companyId: string;
  }): Promise<DocumentRecord[]>;

  updateStatusInCompany(params: {
    documentId: string;
    companyId: string;
    status: string;
  }): Promise<DocumentRecord | null>;
}
