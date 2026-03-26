export interface CaseRecord {
  id: string;
  companyId: string;
  serviceId: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetCaseByIdInCompanyParams {
  caseId: string;
  companyId: string;
}

export interface ListCasesByCompanyParams {
  companyId: string;
  limit?: number;
}

export interface UpdateCaseStatusInCompanyParams {
  caseId: string;
  companyId: string;
  status: string;
}

export interface CasesRepository {
  getByIdInCompany(
    params: GetCaseByIdInCompanyParams,
  ): Promise<CaseRecord | null>;

  listByCompany(
    params: ListCasesByCompanyParams,
  ): Promise<CaseRecord[]>;

  updateStatusInCompany(
    params: UpdateCaseStatusInCompanyParams,
  ): Promise<CaseRecord | null>;
}

/**
 * Replace this with the actual database adapter implementation.
 * Keep tenant scoping explicit in every method.
 */
export function createCasesRepository(): CasesRepository {
  return {
    async getByIdInCompany() {
      throw new Error("Not implemented");
    },

    async listByCompany() {
      throw new Error("Not implemented");
    },

    async updateStatusInCompany() {
      throw new Error("Not implemented");
    },
  };
}
