import type { AuthContext } from "../../auth/auth-context";
import { requireAuth, requireCompanyAccess, requirePermission } from "../../auth/guards";
import { PERMISSIONS } from "../../auth/permissions";
import type {
  ServiceRequestRecord,
  ServiceRequestStatus,
  ServiceRequestsRepository,
} from "../../data/service-requests-repository";
import { assertTenantRecordExists } from "../../data/tenant-scope";
import { assertAllowedServiceRequestTransition } from "./service-request-status-transitions";

export interface UpdateServiceRequestStatusInput {
  companyId: string;
  serviceRequestId: string;
  status: ServiceRequestStatus;
}

export interface UpdateServiceRequestStatusDeps {
  auth: AuthContext | null | undefined;
  serviceRequestsRepository: ServiceRequestsRepository;
}

export async function updateServiceRequestStatus(
  deps: UpdateServiceRequestStatusDeps,
  input: UpdateServiceRequestStatusInput,
): Promise<ServiceRequestRecord> {
  const auth = requireAuth(deps.auth);
  requireCompanyAccess(auth, input.companyId);
  requirePermission(
    auth,
    PERMISSIONS.SERVICE_REQUESTS_UPDATE,
    input.companyId,
  );

  const current = assertTenantRecordExists(
    await deps.serviceRequestsRepository.getByIdInCompany({
      companyId: input.companyId,
      serviceRequestId: input.serviceRequestId,
    }),
    "ServiceRequest",
  );

  assertAllowedServiceRequestTransition(current.status, input.status);

  const updated = await deps.serviceRequestsRepository.updateStatusInCompany({
    companyId: input.companyId,
    serviceRequestId: input.serviceRequestId,
    status: input.status,
  });

  return assertTenantRecordExists(updated, "ServiceRequest");
}
