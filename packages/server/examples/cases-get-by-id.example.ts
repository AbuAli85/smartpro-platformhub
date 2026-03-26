import type { AuthContext } from "../../auth/auth-context";
import { requireAuth, requireCompanyAccess, requirePermission } from "../../auth/guards";
import { PERMISSIONS } from "../../auth/permissions";
import { assertTenantRecordExists } from "../../data/tenant-scope";

interface GetCaseByIdInput {
  companyId: string;
  caseId: string;
}

interface CaseRecord {
  id: string;
  companyId: string;
  serviceId: string;
  status: string;
}

interface CaseRepository {
  getByIdInCompany(params: {
    companyId: string;
    caseId: string;
  }): Promise<CaseRecord | null>;
}

interface GetCaseByIdDeps {
  auth: AuthContext | null | undefined;
  caseRepository: CaseRepository;
}

export async function getCaseByIdExample(
  deps: GetCaseByIdDeps,
  input: GetCaseByIdInput,
): Promise<CaseRecord> {
  const auth = requireAuth(deps.auth);
  requireCompanyAccess(auth, input.companyId);
  requirePermission(auth, PERMISSIONS.CASES_READ, input.companyId);

  const record = await deps.caseRepository.getByIdInCompany({
    companyId: input.companyId,
    caseId: input.caseId,
  });

  return assertTenantRecordExists(record, "Case");
}
