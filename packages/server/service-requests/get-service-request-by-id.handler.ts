import type { AuthContext } from "../../auth/auth-context";
import type { ServiceRequestsRepository } from "../../data/service-requests-repository";
import { mapAuthRelatedError } from "../errors/map-auth-errors";
import { getServiceRequestById } from "./get-service-request-by-id";

export interface GetServiceRequestByIdHandlerDeps {
  auth: AuthContext | null | undefined;
  serviceRequestsRepository: ServiceRequestsRepository;
}

export async function getServiceRequestByIdHandler(
  deps: GetServiceRequestByIdHandlerDeps,
  input: { companyId: string; serviceRequestId: string },
) {
  try {
    const data = await getServiceRequestById(
      {
        auth: deps.auth,
        serviceRequestsRepository: deps.serviceRequestsRepository,
      },
      input,
    );

    return {
      status: 200,
      data,
    };
  } catch (error) {
    const mapped = mapAuthRelatedError(error);
    return {
      status: mapped.status,
      error: mapped,
    };
  }
}
