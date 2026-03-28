export type ServiceRequestStatus =
  | "draft"
  | "submitted"
  | "withdrawn"
  | "converted_to_case"
  | "cancelled";

export interface ServiceRequestRecord {
  id: string;
  companyId: string;
  serviceId: string;
  requestedByUserId: string;
  status: ServiceRequestStatus;
  submittedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface InsertServiceRequestInCompanyParams {
  companyId: string;
  serviceId: string;
  requestedByUserId: string;
  status?: ServiceRequestStatus;
}

export interface GetServiceRequestByIdInCompanyParams {
  serviceRequestId: string;
  companyId: string;
}

export interface ListServiceRequestsByCompanyParams {
  companyId: string;
  limit?: number;
}

export interface UpdateServiceRequestStatusInCompanyParams {
  serviceRequestId: string;
  companyId: string;
  status: ServiceRequestStatus;
}

export interface ServiceRequestsRepository {
  insertInCompany(
    params: InsertServiceRequestInCompanyParams,
  ): Promise<ServiceRequestRecord>;

  getByIdInCompany(
    params: GetServiceRequestByIdInCompanyParams,
  ): Promise<ServiceRequestRecord | null>;

  listByCompany(
    params: ListServiceRequestsByCompanyParams,
  ): Promise<ServiceRequestRecord[]>;

  updateStatusInCompany(
    params: UpdateServiceRequestStatusInCompanyParams,
  ): Promise<ServiceRequestRecord | null>;
}

/**
 * Replace this with the actual database adapter implementation.
 * Keep tenant scoping explicit in every method.
 */
export function createServiceRequestsRepository(): ServiceRequestsRepository {
  return {
    async insertInCompany() {
      throw new Error("Not implemented");
    },

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
