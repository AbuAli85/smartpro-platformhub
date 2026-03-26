import type { AuthContext } from "../../auth/auth-context";
import { requireAuth, requireCompanyAccess, requirePermission } from "../../auth/guards";
import { PERMISSIONS } from "../../auth/permissions";
import type { CaseRecord, CasesRepository } from "../../data/cases-repository";
import { assertTenantRecordExists } from "../../data/tenant-scope";

export interface GetCaseByIdInput {
  companyId: string;
  caseId: string;
}

export interface GetCaseByIdDeps {
  auth: AuthContext | null | undefined;
  casesRepository: CasesRepository;
}

export async function getCaseById(
  deps: GetCaseByIdDeps,
  input: GetCaseByIdInput,
): Promise<CaseRecord> {
  const auth = requireAuth(deps.auth);
  requireCompanyAccess(auth, input.companyId);
  requirePermission(auth, PERMISSIONS.CASES_READ, input.companyId);

  const record = await deps.casesRepository.getByIdInCompany({
    companyId: input.companyId,
    caseId: input.caseId,
  });

  return assertTenantRecordExists(record, "Case");
}
