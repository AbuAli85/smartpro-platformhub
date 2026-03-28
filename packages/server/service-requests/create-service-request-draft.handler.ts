import type { AuthContext } from "../../auth/auth-context";
import type { ServiceRequestsRepository } from "../../data/service-requests-repository";
import { mapAuthRelatedError } from "../errors/map-auth-errors";
import { createServiceRequestDraft } from "./create-service-request-draft";

export interface CreateServiceRequestDraftHandlerDeps {
  auth: AuthContext | null | undefined;
  serviceRequestsRepository: ServiceRequestsRepository;
}

export async function createServiceRequestDraftHandler(
  deps: CreateServiceRequestDraftHandlerDeps,
  input: { companyId: string; serviceId: string },
) {
  try {
    const data = await createServiceRequestDraft(
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
