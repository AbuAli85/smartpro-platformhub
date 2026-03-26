import type { AuthContext } from "../../auth/auth-context";
import type { CasesRepository } from "../../data/cases-repository";
import { mapAuthRelatedError } from "../errors/map-auth-errors";
import { getCaseById } from "./get-case-by-id";

export interface GetCaseByIdHandlerDeps {
  auth: AuthContext | null | undefined;
  casesRepository: CasesRepository;
}

export async function getCaseByIdHandler(
  deps: GetCaseByIdHandlerDeps,
  input: { companyId: string; caseId: string },
) {
  try {
    const data = await getCaseById(
      {
        auth: deps.auth,
        casesRepository: deps.casesRepository,
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
