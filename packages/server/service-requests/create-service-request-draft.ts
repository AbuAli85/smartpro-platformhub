import type { AuthContext } from "../../auth/auth-context";
import { requireAuth, requireCompanyAccess, requirePermission } from "../../auth/guards";
import { PERMISSIONS } from "../../auth/permissions";
import type {
  ServiceRequestRecord,
  ServiceRequestsRepository,
} from "../../data/service-requests-repository";

export interface CreateServiceRequestDraftInput {
  companyId: string;
  serviceId: string;
}

export interface CreateServiceRequestDraftDeps {
  auth: AuthContext | null | undefined;
  serviceRequestsRepository: ServiceRequestsRepository;
}

export async function createServiceRequestDraft(
  deps: CreateServiceRequestDraftDeps,
  input: CreateServiceRequestDraftInput,
): Promise<ServiceRequestRecord> {
  const auth = requireAuth(deps.auth);
  requireCompanyAccess(auth, input.companyId);
  requirePermission(
    auth,
    PERMISSIONS.SERVICE_REQUESTS_CREATE,
    input.companyId,
  );

  return deps.serviceRequestsRepository.insertInCompany({
    companyId: input.companyId,
    serviceId: input.serviceId,
    requestedByUserId: auth.userId,
    status: "draft",
  });
}
