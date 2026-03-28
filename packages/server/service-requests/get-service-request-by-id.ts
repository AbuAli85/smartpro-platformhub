import type { AuthContext } from "../../auth/auth-context";
import { requireAuth, requireCompanyAccess, requirePermission } from "../../auth/guards";
import { PERMISSIONS } from "../../auth/permissions";
import type {
  ServiceRequestRecord,
  ServiceRequestsRepository,
} from "../../data/service-requests-repository";
import { assertTenantRecordExists } from "../../data/tenant-scope";

export interface GetServiceRequestByIdInput {
  companyId: string;
  serviceRequestId: string;
}

export interface GetServiceRequestByIdDeps {
  auth: AuthContext | null | undefined;
  serviceRequestsRepository: ServiceRequestsRepository;
}

export async function getServiceRequestById(
  deps: GetServiceRequestByIdDeps,
  input: GetServiceRequestByIdInput,
): Promise<ServiceRequestRecord> {
  const auth = requireAuth(deps.auth);
  requireCompanyAccess(auth, input.companyId);
  requirePermission(auth, PERMISSIONS.SERVICE_REQUESTS_READ, input.companyId);

  const record = await deps.serviceRequestsRepository.getByIdInCompany({
    companyId: input.companyId,
    serviceRequestId: input.serviceRequestId,
  });

  return assertTenantRecordExists(record, "ServiceRequest");
}
