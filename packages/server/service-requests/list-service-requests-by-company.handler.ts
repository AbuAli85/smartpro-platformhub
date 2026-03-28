import type { AuthContext } from "../../auth/auth-context";
import type { ServiceRequestsRepository } from "../../data/service-requests-repository";
import { mapAuthRelatedError } from "../errors/map-auth-errors";
import { listServiceRequestsByCompany } from "./list-service-requests-by-company";

export interface ListServiceRequestsByCompanyHandlerDeps {
  auth: AuthContext | null | undefined;
  serviceRequestsRepository: ServiceRequestsRepository;
}

export async function listServiceRequestsByCompanyHandler(
  deps: ListServiceRequestsByCompanyHandlerDeps,
  input: { companyId: string; limit?: number },
) {
  try {
    const serviceRequests = await listServiceRequestsByCompany(
      {
        auth: deps.auth,
        serviceRequestsRepository: deps.serviceRequestsRepository,
      },
      input,
    );

    return {
      status: 200,
      data: { serviceRequests },
    };
  } catch (error) {
    const mapped = mapAuthRelatedError(error);
    return {
      status: mapped.status,
      error: mapped,
    };
  }
}
