import type { AuthContext } from "../../auth/auth-context";
import { requireAuth, requireCompanyAccess, requirePermission } from "../../auth/guards";
import { PERMISSIONS } from "../../auth/permissions";
import type {
  DocumentRecord,
  DocumentsRepository,
} from "../../data/documents-repository";
import { assertTenantRecordExists } from "../../data/tenant-scope";

export interface UpdateDocumentStatusInput {
  companyId: string;
  documentId: string;
  status: string;
}

export interface UpdateDocumentStatusDeps {
  auth: AuthContext | null | undefined;
  documentsRepository: DocumentsRepository;
}

export async function updateDocumentStatus(
  deps: UpdateDocumentStatusDeps,
  input: UpdateDocumentStatusInput,
): Promise<DocumentRecord> {
  const auth = requireAuth(deps.auth);
  requireCompanyAccess(auth, input.companyId);
  requirePermission(auth, PERMISSIONS.DOCUMENTS_VERIFY, input.companyId);

  const updated = await deps.documentsRepository.updateStatusInCompany({
    companyId: input.companyId,
    documentId: input.documentId,
    status: input.status,
  });

  return assertTenantRecordExists(updated, "Document");
}
