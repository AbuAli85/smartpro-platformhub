import { beforeEach, describe, expect, it } from "vitest";
import { createDocumentsRepositoryImpl } from "../../packages/data/documents-repository.impl";
import { seedCompany, seedDocument } from "./helpers/seed-fixtures";
import { testDb } from "./helpers/test-db";

describe("documents repository integration", () => {
  beforeEach(async () => {
    await testDb.resetKnownTables();
  });

  it("updates document status only within matching company scope", async () => {
    const repo = createDocumentsRepositoryImpl(testDb.adapter);

    const companyA = await seedCompany();
    const companyB = await seedCompany();

    const seededDocument = await seedDocument({
      companyId: companyA.id,
      status: "uploaded",
      storagePath: "companies/a/documents/1",
    });

    const updated = await repo.updateStatusInCompany({
      documentId: seededDocument.id,
      companyId: companyA.id,
      status: "valid",
    });

    const blocked = await repo.updateStatusInCompany({
      documentId: seededDocument.id,
      companyId: companyB.id,
      status: "invalid",
    });

    expect(updated?.status).toBe("valid");
    expect(blocked).toBeNull();
  });
});
