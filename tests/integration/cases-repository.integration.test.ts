import { beforeEach, describe, expect, it } from "vitest";
import { createCasesRepositoryImpl } from "../../packages/data/cases-repository.impl";
import { seedCase, seedCompany } from "./helpers/seed-fixtures";
import { testDb } from "./helpers/test-db";

describe("cases repository integration", () => {
  beforeEach(async () => {
    await testDb.resetKnownTables();
  });

  it("returns a case only within matching company scope", async () => {
    const repo = createCasesRepositoryImpl(testDb.adapter);

    const companyA = await seedCompany();
    const companyB = await seedCompany();

    const seededCase = await seedCase({
      companyId: companyA.id,
      serviceId: "svc-1",
      status: "submitted",
    });

    const inScope = await repo.getByIdInCompany({
      caseId: seededCase.id,
      companyId: companyA.id,
    });

    const outOfScope = await repo.getByIdInCompany({
      caseId: seededCase.id,
      companyId: companyB.id,
    });

    expect(inScope?.id).toBe(seededCase.id);
    expect(outOfScope).toBeNull();
  });
});
