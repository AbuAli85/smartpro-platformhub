export interface CaseRecord {
  id: string;
  companyId: string;
  serviceId: string;
  status: string;
}

export interface CaseRepository {
  getByIdInCompany(params: {
    caseId: string;
    companyId: string;
  }): Promise<CaseRecord | null>;

  listByCompany(params: {
    companyId: string;
    limit?: number;
  }): Promise<CaseRecord[]>;

  updateStatusInCompany(params: {
    caseId: string;
    companyId: string;
    status: string;
  }): Promise<CaseRecord | null>;
}
