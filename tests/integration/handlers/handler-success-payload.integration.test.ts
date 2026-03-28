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
import { createServiceRequestDraftHandler } from "../../../packages/server/service-requests/create-service-request-draft.handler";
import {
  createAuthContext,
  withActiveMembership,
  withPlatformPermissions,
} from "../helpers/auth-context";
import { seedCase, seedCompany, seedDocument, seedRole, seedUser } from "../helpers/seed-fixtures";
import { testDb } from "../helpers/test-db";

const SNAKE_CASE_LEAK_KEYS = [
  "company_id",
  "service_id",
  "user_id",
  "role_id",
  "case_id",
  "storage_path",
  "assigned_by_user_id",
  "requested_by_user_id",
  "submitted_at",
  "created_at",
  "updated_at",
] as const;

function expectNoSnakeCaseLeakage(obj: object): void {
  for (const key of SNAKE_CASE_LEAK_KEYS) {
    expect(obj).not.toHaveProperty(key);
  }
}

function sortedKeys(obj: object): string[] {
  return Object.keys(obj).sort();
}

describe("protected handler success payload integrity", () => {
  beforeEach(async () => {
    await testDb.resetKnownTables();
  });

  it("returns the expected case payload fields without raw DB field leakage", async () => {
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
      throw new Error("expected case success payload");
    }

    expect(sortedKeys(result.data)).toEqual(
      ["companyId", "createdAt", "id", "serviceId", "status", "updatedAt"].sort(),
    );
    expect(result.data.id).toBe(seededCase.id);
    expect(result.data.companyId).toBe(company.id);
    expect(result.data.serviceId).toBe("svc-1");
    expect(result.data.status).toBe("submitted");
    expectNoSnakeCaseLeakage(result.data);
  });

  it("returns the expected document payload fields without raw DB field leakage", async () => {
    const company = await seedCompany();
    const doc = await seedDocument({
      companyId: company.id,
      status: "pending_review",
      storagePath: "/payload/doc",
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
      throw new Error("expected document success payload");
    }

    expect(sortedKeys(result.data)).toEqual(
      [
        "caseId",
        "companyId",
        "createdAt",
        "id",
        "status",
        "storagePath",
        "updatedAt",
      ].sort(),
    );
    expect(result.data.id).toBe(doc.id);
    expect(result.data.companyId).toBe(company.id);
    expect(result.data.status).toBe("valid");
    expect(result.data.storagePath).toBe("/payload/doc");
    expectNoSnakeCaseLeakage(result.data);
  });

  it("returns the expected role assignment payload fields without raw DB field leakage", async () => {
    const actor = await seedUser();
    const target = await seedUser();
    const company = await seedCompany();
    const companyRole = await seedRole({
      name: `payload_${actor.id.slice(0, 8)}`,
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
          companyId: company.id,
        },
      );

      expect(result.status).toBe(200);
      if (result.status !== 200 || !result.data) {
        throw new Error("expected role assignment success payload");
      }

      expect(sortedKeys(result.data)).toEqual(
        [
          "assignedByUserId",
          "companyId",
          "createdAt",
          "id",
          "roleId",
          "userId",
        ].sort(),
      );
      expect(result.data.userId).toBe(target.id);
      expect(result.data.roleId).toBe(companyRole.id);
      expect(result.data.companyId).toBe(company.id);
      expect(result.data.assignedByUserId).toBe(actor.id);
      expectNoSnakeCaseLeakage(result.data);
    } finally {
      await pool.end();
    }
  });

  it("returns the expected service request payload fields without raw DB field leakage", async () => {
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
      { companyId: company.id, serviceId: "svc-payload" },
    );

    expect(result.status).toBe(200);
    if (result.status !== 200 || !result.data) {
      throw new Error("expected service request success payload");
    }

    expect(sortedKeys(result.data)).toEqual(
      [
        "companyId",
        "createdAt",
        "id",
        "requestedByUserId",
        "serviceId",
        "status",
        "submittedAt",
        "updatedAt",
      ].sort(),
    );
    expect(result.data.companyId).toBe(company.id);
    expect(result.data.serviceId).toBe("svc-payload");
    expect(result.data.status).toBe("draft");
    expect(result.data.requestedByUserId).toBe(user.id);
    expectNoSnakeCaseLeakage(result.data);
  });
});
