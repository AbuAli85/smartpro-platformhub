import type { AuthContext } from "../../auth/auth-context";
import { requireAuth, requireCompanyAccess, requirePermission } from "../../auth/guards";
import { PERMISSIONS } from "../../auth/permissions";
import type {
  ServiceRequestRecord,
  ServiceRequestsRepository,
} from "../../data/service-requests-repository";
import { assertBulkTenantOwnership } from "../../data/tenant-scope";

export interface ListServiceRequestsByCompanyInput {
  companyId: string;
  limit?: number;
}

export interface ListServiceRequestsByCompanyDeps {
  auth: AuthContext | null | undefined;
  serviceRequestsRepository: ServiceRequestsRepository;
}

const MAX_LIMIT = 100;

export async function listServiceRequestsByCompany(
  deps: ListServiceRequestsByCompanyDeps,
  input: ListServiceRequestsByCompanyInput,
): Promise<ServiceRequestRecord[]> {
  const auth = requireAuth(deps.auth);
  requireCompanyAccess(auth, input.companyId);
  requirePermission(auth, PERMISSIONS.SERVICE_REQUESTS_READ, input.companyId);

  const rawLimit = input.limit ?? 50;
  const limit = Math.min(Math.max(1, rawLimit), MAX_LIMIT);

  const rows = await deps.serviceRequestsRepository.listByCompany({
    companyId: input.companyId,
    limit,
  });

  assertBulkTenantOwnership(rows, input.companyId, "ServiceRequests");

  return rows;
}
