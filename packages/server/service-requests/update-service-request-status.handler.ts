import type { AuthContext } from "../../auth/auth-context";
import type {
  ServiceRequestStatus,
  ServiceRequestsRepository,
} from "../../data/service-requests-repository";
import { mapAuthRelatedError } from "../errors/map-auth-errors";
import { updateServiceRequestStatus } from "./update-service-request-status";

export interface UpdateServiceRequestStatusHandlerDeps {
  auth: AuthContext | null | undefined;
  serviceRequestsRepository: ServiceRequestsRepository;
}

export async function updateServiceRequestStatusHandler(
  deps: UpdateServiceRequestStatusHandlerDeps,
  input: {
    companyId: string;
    serviceRequestId: string;
    status: ServiceRequestStatus;
  },
) {
  try {
    const data = await updateServiceRequestStatus(
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
