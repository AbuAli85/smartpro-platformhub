import { beforeEach, describe, expect, it } from "vitest";
import { PERMISSIONS } from "../../../packages/auth/permissions";
import { createCasesRepositoryImpl } from "../../../packages/data/cases-repository.impl";
import { createDocumentsRepositoryImpl } from "../../../packages/data/documents-repository.impl";
import { createServiceRequestsRepositoryImpl } from "../../../packages/data/service-requests-repository.impl";
import { assignUserRoleTransactionalHandler } from "../../../packages/server/admin/assign-user-role.handler";
import { getCaseByIdHandler } from "../../../packages/server/cases/get-case-by-id.handler";
import { updateDocumentStatusHandler } from "../../../packages/server/documents/update-document-status.handler";
import { createServiceRequestDraftHandler } from "../../../packages/server/service-requests/create-service-request-draft.handler";
import {
  createAuthContext,
  withActiveMembership,
  withPlatformPermissions,
} from "../helpers/auth-context";
import { seedCase, seedCompany, seedDocument, seedRole, seedUser } from "../helpers/seed-fixtures";
import { testDb } from "../helpers/test-db";

const FORBIDDEN_SUCCESS_PAYLOAD_KEYS = [
  "beforeJson",
  "afterJson",
  "metadataJson",
  "actorUserId",
  "actorType",
  "entityType",
  "entityId",
  "stack",
  "sql",
  "trace",
  "debug",
  "internal",
  "raw",
  "migrationFailureType",
] as const;

const FORBIDDEN_TOP_LEVEL_KEYS = [
  "debug",
  "internal",
  "raw",
  "sql",
  "trace",
  "migrationFailureType",
] as const;

const FORBIDDEN_ERROR_OBJECT_KEYS = [
  "stack",
  "sql",
  "trace",
  "debug",
  "internal",
  "raw",
  "beforeJson",
  "afterJson",
  "metadataJson",
  "cause",
] as const;

const ALLOWED_MAPPED_ERROR_KEYS = ["code", "message", "status"];

function expectNoForbiddenKeys(
  obj: object,
  forbidden: readonly string[],
): void {
  for (const key of forbidden) {
    expect(obj).not.toHaveProperty(key);
  }
}

function expectCleanTopLevelResponse(result: object): void {
  expectNoForbiddenKeys(result, FORBIDDEN_TOP_LEVEL_KEYS);
}

function expectCleanSuccessPayload(data: object): void {
  expectNoForbiddenKeys(data, FORBIDDEN_SUCCESS_PAYLOAD_KEYS);
}

function expectCleanMappedError(error: object): void {
  expectNoForbiddenKeys(error, FORBIDDEN_ERROR_OBJECT_KEYS);
  expect(Object.keys(error).sort()).toEqual(
    [...ALLOWED_MAPPED_ERROR_KEYS].sort(),
  );
}

describe("response boundary hygiene", () => {
  beforeEach(async () => {
    await testDb.resetKnownTables();
  });

  it("does not leak internal metadata in successful case responses", async () => {
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
    if (result.status !== 200 || !result.data) {
      throw new Error("expected success");
    }

    expectCleanTopLevelResponse(result);
    expectCleanSuccessPayload(result.data);
  });

  it("does not leak internal metadata in successful document responses", async () => {
    const company = await seedCompany();
    const doc = await seedDocument({
      companyId: company.id,
      status: "pending_review",
      storagePath: "/hygiene/doc",
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
    if (result.status !== 200 || !result.data) {
      throw new Error("expected success");
    }

    expectCleanTopLevelResponse(result);
    expectCleanSuccessPayload(result.data);
  });

  it("does not leak internal metadata in successful admin responses", async () => {
    const actor = await seedUser();
    const target = await seedUser();
    const company = await seedCompany();
    const companyRole = await seedRole({
      name: `hygiene_${actor.id.slice(0, 8)}`,
      scopeType: "company",
    });

    const result = await assignUserRoleTransactionalHandler(
      {
        auth: withPlatformPermissions(createAuthContext({ userId: actor.id }), [
          PERMISSIONS.ROLES_MANAGE,
        ]),
        db: testDb.adapter,
      },
      {
        targetUserId: target.id,
        roleId: companyRole.id,
        companyId: company.id,
      },
    );

    expect(result.status).toBe(200);
    if (result.status !== 200 || !result.data) {
      throw new Error("expected success");
    }

    expectCleanTopLevelResponse(result);
    expectCleanSuccessPayload(result.data);
  });

  it("does not leak internal implementation details in failure responses", async () => {
    const company = await seedCompany();
    const casesRepository = createCasesRepositoryImpl(testDb.adapter);

    const result = await getCaseByIdHandler(
      { auth: null, casesRepository },
      { companyId: company.id, caseId: "00000000-0000-4000-8000-000000000099" },
    );

    expect(result.status).toBe(401);
    if (result.status === 200 || !result.error) {
      throw new Error("expected failure");
    }

    expectCleanTopLevelResponse(result);
    expectCleanMappedError(result.error);
  });

  it("does not leak internal metadata in successful service request responses", async () => {
    const company = await seedCompany();
    const user = await seedUser();
    const repo = createServiceRequestsRepositoryImpl(testDb.adapter);
    const auth = withActiveMembership(
      createAuthContext({ userId: user.id }),
      company.id,
      [PERMISSIONS.SERVICE_REQUESTS_CREATE],
    );

    const result = await createServiceRequestDraftHandler(
      { auth, serviceRequestsRepository: repo },
      { companyId: company.id, serviceId: "svc-hygiene" },
    );

    expect(result.status).toBe(200);
    if (result.status !== 200 || !result.data) {
      throw new Error("expected success");
    }

    expectCleanTopLevelResponse(result);
    expectCleanSuccessPayload(result.data);
  });
});
