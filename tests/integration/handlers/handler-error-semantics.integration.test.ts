import { beforeEach, describe, expect, it } from "vitest";
import { PERMISSIONS } from "../../../packages/auth/permissions";
import { createCasesRepositoryImpl } from "../../../packages/data/cases-repository.impl";
import { createDocumentsRepositoryImpl } from "../../../packages/data/documents-repository.impl";
import { createServiceRequestsRepositoryImpl } from "../../../packages/data/service-requests-repository.impl";
import { createPostgresPool, getPostgresConfigFromEnv } from "../../../packages/data/postgres-config";
import { PostgresAdapter } from "../../../packages/data/postgres-adapter";
import { assignUserRoleTransactionalHandler } from "../../../packages/server/admin/assign-user-role.handler";
import { getCaseByIdHandler } from "../../../packages/server/cases/get-case-by-id.handler";
import { updateDocumentStatusHandler } from "../../../packages/server/documents/update-document-status.handler";
import { updateServiceRequestStatusHandler } from "../../../packages/server/service-requests/update-service-request-status.handler";
import {
  createAuthContext,
  withActiveMembership,
  withDifferentTenant,
  withPlatformPermissions,
} from "../helpers/auth-context";
import {
  seedCase,
  seedCompany,
  seedRole,
  seedServiceRequest,
  seedUser,
} from "../helpers/seed-fixtures";
import { testDb } from "../helpers/test-db";

describe("protected handler error semantics", () => {
  beforeEach(async () => {
    await testDb.resetKnownTables();
  });

  it("maps unauthenticated access to 401 / UNAUTHENTICATED", async () => {
    const company = await seedCompany();
    const casesRepository = createCasesRepositoryImpl(testDb.adapter);

    const result = await getCaseByIdHandler(
      { auth: null, casesRepository },
      { companyId: company.id, caseId: "00000000-0000-4000-8000-000000000099" },
    );

    expect(result.status).toBe(401);
    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe("UNAUTHENTICATED");
    expect(result.error?.message).toBeDefined();
  });

  it("maps missing permission to 403 / FORBIDDEN", async () => {
    const company = await seedCompany();
    const documentsRepository = createDocumentsRepositoryImpl(testDb.adapter);
    const auth = withActiveMembership(createAuthContext(), company.id, []);

    const result = await updateDocumentStatusHandler(
      { auth, documentsRepository },
      {
        companyId: company.id,
        documentId: "00000000-0000-4000-8000-0000000000dd",
        status: "valid",
      },
    );

    expect(result.status).toBe(403);
    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe("FORBIDDEN");
    expect(result.error?.message).toBeDefined();
  });

  it("maps company scope denial to 403 / COMPANY_SCOPE_DENIED", async () => {
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
    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe("COMPANY_SCOPE_DENIED");
    expect(result.error?.message).toBeDefined();
  });

  it("maps missing in-scope record to 404 / RECORD_NOT_FOUND", async () => {
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
    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe("RECORD_NOT_FOUND");
    expect(result.error?.message).toBeDefined();
  });

  it("maps invalid role scope to 400 / INVALID_ROLE_SCOPE", async () => {
    const actor = await seedUser();
    const target = await seedUser();
    const companyRole = await seedRole({
      name: `semantics_${actor.id.slice(0, 8)}`,
      scopeType: "company",
    });

    const pool = createPostgresPool(getPostgresConfigFromEnv());
    const db = new PostgresAdapter(pool);

    try {
      const result = await assignUserRoleTransactionalHandler(
        {
          auth: withPlatformPermissions(createAuthContext({ userId: actor.id }), [
            PERMISSIONS.ROLES_MANAGE,
          ]),
          db,
        },
        {
          targetUserId: target.id,
          roleId: companyRole.id,
          companyId: null,
        },
      );

      expect(result.status).toBe(400);
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe("INVALID_ROLE_SCOPE");
      expect(result.error?.message).toBeDefined();
    } finally {
      await pool.end();
    }
  });

  it("maps invalid service request transition to 400 / INVALID_SERVICE_REQUEST_TRANSITION", async () => {
    const company = await seedCompany();
    const user = await seedUser();
    const row = await seedServiceRequest({
      companyId: company.id,
      serviceId: "svc-sem",
      requestedByUserId: user.id,
      status: "draft",
    });
    const repo = createServiceRequestsRepositoryImpl(testDb.adapter);
    const auth = withActiveMembership(
      createAuthContext({ userId: user.id }),
      company.id,
      [PERMISSIONS.SERVICE_REQUESTS_UPDATE],
    );

    const result = await updateServiceRequestStatusHandler(
      { auth, serviceRequestsRepository: repo },
      {
        companyId: company.id,
        serviceRequestId: row.id,
        status: "withdrawn",
      },
    );

    expect(result.status).toBe(400);
    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe("INVALID_SERVICE_REQUEST_TRANSITION");
    expect(result.error?.message).toBeDefined();
  });
});
