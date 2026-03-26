import type { AuthContext } from "../../auth/auth-context";
import { requireAuth, requireCompanyAccess, requirePermission } from "../../auth/guards";
import { PERMISSIONS } from "../../auth/permissions";
import { assertTenantRecordExists } from "../../data/tenant-scope";

interface UpdateDocumentStatusInput {
  companyId: string;
  documentId: string;
  status: string;
}

interface DocumentRecord {
  id: string;
  companyId: string;
  caseId: string | null;
  status: string;
  storagePath: string;
}

interface DocumentRepository {
  updateStatusInCompany(params: {
    companyId: string;
    documentId: string;
    status: string;
  }): Promise<DocumentRecord | null>;
}

interface UpdateDocumentStatusDeps {
  auth: AuthContext | null | undefined;
  documentRepository: DocumentRepository;
}

export async function updateDocumentStatusExample(
  deps: UpdateDocumentStatusDeps,
  input: UpdateDocumentStatusInput,
): Promise<DocumentRecord> {
  const auth = requireAuth(deps.auth);
  requireCompanyAccess(auth, input.companyId);
  requirePermission(auth, PERMISSIONS.DOCUMENTS_VERIFY, input.companyId);

  const updated = await deps.documentRepository.updateStatusInCompany({
    companyId: input.companyId,
    documentId: input.documentId,
    status: input.status,
  });

  return assertTenantRecordExists(updated, "Document");
}
