import { beforeEach, describe, expect, it } from "vitest";
import { PERMISSIONS } from "../../../packages/auth/permissions";
import { createCasesRepositoryImpl } from "../../../packages/data/cases-repository.impl";
import { getCaseByIdHandler } from "../../../packages/server/cases/get-case-by-id.handler";
import {
  createAuthContext,
  withActiveMembership,
  withDifferentTenant,
} from "../helpers/auth-context";
import { seedCase, seedCompany } from "../helpers/seed-fixtures";
import { testDb } from "../helpers/test-db";

describe("getCaseById handler", () => {
  beforeEach(async () => {
    await testDb.resetKnownTables();
  });

  it("returns 401 when unauthenticated", async () => {
    const company = await seedCompany();
    const casesRepository = createCasesRepositoryImpl(testDb.adapter);

    const result = await getCaseByIdHandler(
      { auth: null, casesRepository },
      { companyId: company.id, caseId: "00000000-0000-4000-8000-000000000099" },
    );

    expect(result.status).toBe(401);
    if (result.status !== 200) {
      expect(result.error?.code).toBe("UNAUTHENTICATED");
    }
  });

  it("returns 403 when missing cases:read permission", async () => {
    const company = await seedCompany();
    const casesRepository = createCasesRepositoryImpl(testDb.adapter);
    const auth = withActiveMembership(createAuthContext(), company.id, []);

    const result = await getCaseByIdHandler(
      { auth, casesRepository },
      { companyId: company.id, caseId: "00000000-0000-4000-8000-000000000099" },
    );

    expect(result.status).toBe(403);
    if (result.status !== 200) {
      expect(result.error?.code).toBe("FORBIDDEN");
    }
  });

  it("returns 403 when requesting another company scope without access", async () => {
    const companyA = await seedCompany();
    const companyB = await seedCompany();
    const seededCase = await seedCase({
      companyId: companyA.id,
      serviceId: "svc-1",
      status: "submitted",
    });

    const casesRepository = createCasesRepositoryImpl(testDb.adapter);
    const auth = withDifferentTenant(
      createAuthContext(),
      companyB.id,
      [PERMISSIONS.CASES_READ],
    );

    const result = await getCaseByIdHandler(
      { auth, casesRepository },
      { companyId: companyA.id, caseId: seededCase.id },
    );

    expect(result.status).toBe(403);
    if (result.status !== 200) {
      expect(result.error?.code).toBe("COMPANY_SCOPE_DENIED");
    }
  });

  it("returns 404 when case does not exist in the requested company scope", async () => {
    const company = await seedCompany();
    const casesRepository = createCasesRepositoryImpl(testDb.adapter);
    const auth = withActiveMembership(createAuthContext(), company.id, [
      PERMISSIONS.CASES_READ,
    ]);

    const result = await getCaseByIdHandler(
      { auth, casesRepository },
      {
        companyId: company.id,
        caseId: "00000000-0000-4000-8000-0000000000aa",
      },
    );

    expect(result.status).toBe(404);
    if (result.status !== 200) {
      expect(result.error?.code).toBe("RECORD_NOT_FOUND");
    }
  });

  it("returns case when authorized", async () => {
    const company = await seedCompany();
    const seededCase = await seedCase({
      companyId: company.id,
      serviceId: "svc-1",
      status: "submitted",
    });

    const casesRepository = createCasesRepositoryImpl(testDb.adapter);
    const auth = withActiveMembership(createAuthContext(), company.id, [
      PERMISSIONS.CASES_READ,
    ]);

    const result = await getCaseByIdHandler(
      { auth, casesRepository },
      { companyId: company.id, caseId: seededCase.id },
    );

    expect(result.status).toBe(200);
    if (result.status === 200) {
      expect(result.data?.id).toBe(seededCase.id);
      expect(result.data?.companyId).toBe(company.id);
    }
  });
});
