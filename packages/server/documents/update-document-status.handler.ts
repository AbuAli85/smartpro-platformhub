import type { AuthContext } from "../../auth/auth-context";
import type { DocumentsRepository } from "../../data/documents-repository";
import { mapAuthRelatedError } from "../errors/map-auth-errors";
import { updateDocumentStatus } from "./update-document-status";

export interface UpdateDocumentStatusHandlerDeps {
  auth: AuthContext | null | undefined;
  documentsRepository: DocumentsRepository;
}

export async function updateDocumentStatusHandler(
  deps: UpdateDocumentStatusHandlerDeps,
  input: { companyId: string; documentId: string; status: string },
) {
  try {
    const data = await updateDocumentStatus(
      {
        auth: deps.auth,
        documentsRepository: deps.documentsRepository,
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
