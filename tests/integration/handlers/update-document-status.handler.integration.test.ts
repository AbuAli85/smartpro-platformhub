import { beforeEach, describe, expect, it } from "vitest";
import { PERMISSIONS } from "../../../packages/auth/permissions";
import { createDocumentsRepositoryImpl } from "../../../packages/data/documents-repository.impl";
import { updateDocumentStatusHandler } from "../../../packages/server/documents/update-document-status.handler";
import {
  createAuthContext,
  withActiveMembership,
  withDifferentTenant,
} from "../helpers/auth-context";
import { seedCompany, seedDocument } from "../helpers/seed-fixtures";
import { testDb } from "../helpers/test-db";

describe("updateDocumentStatus handler", () => {
  beforeEach(async () => {
    await testDb.resetKnownTables();
  });

  it("returns 401 when unauthenticated", async () => {
    const company = await seedCompany();
    const documentsRepository = createDocumentsRepositoryImpl(testDb.adapter);

    const result = await updateDocumentStatusHandler(
      { auth: null, documentsRepository },
      {
        companyId: company.id,
        documentId: "00000000-0000-4000-8000-000000000099",
        status: "valid",
      },
    );

    expect(result.status).toBe(401);
    if (result.status !== 200) {
      expect(result.error?.code).toBe("UNAUTHENTICATED");
    }
  });

  it("returns 403 when missing documents:verify permission", async () => {
    const company = await seedCompany();
    const documentsRepository = createDocumentsRepositoryImpl(testDb.adapter);
    const auth = withActiveMembership(createAuthContext(), company.id, []);

    const result = await updateDocumentStatusHandler(
      { auth, documentsRepository },
      {
        companyId: company.id,
        documentId: "00000000-0000-4000-8000-000000000099",
        status: "valid",
      },
    );

    expect(result.status).toBe(403);
    if (result.status !== 200) {
      expect(result.error?.code).toBe("FORBIDDEN");
    }
  });

  it("returns 403 when requesting another company scope without access", async () => {
    const companyA = await seedCompany();
    const companyB = await seedCompany();
    const doc = await seedDocument({
      companyId: companyA.id,
      status: "pending_review",
      storagePath: "/a/b",
    });

    const documentsRepository = createDocumentsRepositoryImpl(testDb.adapter);
    const auth = withDifferentTenant(
      createAuthContext(),
      companyB.id,
      [PERMISSIONS.DOCUMENTS_VERIFY],
    );

    const result = await updateDocumentStatusHandler(
      { auth, documentsRepository },
      {
        companyId: companyA.id,
        documentId: doc.id,
        status: "valid",
      },
    );

    expect(result.status).toBe(403);
    if (result.status !== 200) {
      expect(result.error?.code).toBe("COMPANY_SCOPE_DENIED");
    }
  });

  it("returns 404 when document does not exist in the requested company scope", async () => {
    const company = await seedCompany();
    const documentsRepository = createDocumentsRepositoryImpl(testDb.adapter);
    const auth = withActiveMembership(createAuthContext(), company.id, [
      PERMISSIONS.DOCUMENTS_VERIFY,
    ]);

    const result = await updateDocumentStatusHandler(
      { auth, documentsRepository },
      {
        companyId: company.id,
        documentId: "00000000-0000-4000-8000-0000000000bb",
        status: "valid",
      },
    );

    expect(result.status).toBe(404);
    if (result.status !== 200) {
      expect(result.error?.code).toBe("RECORD_NOT_FOUND");
    }
  });

  it("returns updated document when authorized", async () => {
    const company = await seedCompany();
    const doc = await seedDocument({
      companyId: company.id,
      status: "pending_review",
      storagePath: "/x/y",
    });

    const documentsRepository = createDocumentsRepositoryImpl(testDb.adapter);
    const auth = withActiveMembership(createAuthContext(), company.id, [
      PERMISSIONS.DOCUMENTS_VERIFY,
    ]);

    const result = await updateDocumentStatusHandler(
      { auth, documentsRepository },
      {
        companyId: company.id,
        documentId: doc.id,
        status: "valid",
      },
    );

    expect(result.status).toBe(200);
    if (result.status === 200) {
      expect(result.data?.id).toBe(doc.id);
      expect(result.data?.status).toBe("valid");
    }
  });
});
