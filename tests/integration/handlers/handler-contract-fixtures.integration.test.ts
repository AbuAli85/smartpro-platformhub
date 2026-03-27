import { beforeEach, describe, expect, it } from "vitest";
import { PERMISSIONS } from "../../../packages/auth/permissions";
import { createCasesRepositoryImpl } from "../../../packages/data/cases-repository.impl";
import { createDocumentsRepositoryImpl } from "../../../packages/data/documents-repository.impl";
import { createPostgresPool, getPostgresConfigFromEnv } from "../../../packages/data/postgres-config";
import { PostgresAdapter } from "../../../packages/data/postgres-adapter";
import { assignUserRoleTransactionalHandler } from "../../../packages/server/admin/assign-user-role.handler";
import { getCaseByIdHandler } from "../../../packages/server/cases/get-case-by-id.handler";
import { updateDocumentStatusHandler } from "../../../packages/server/documents/update-document-status.handler";
import {
  createAuthContext,
  withActiveMembership,
  withPlatformPermissions,
} from "../helpers/auth-context";
import { HANDLER_CONTRACT_FIXTURES } from "../helpers/handler-contract-fixtures";
import { seedCase, seedCompany, seedDocument, seedRole, seedUser } from "../helpers/seed-fixtures";
import { testDb } from "../helpers/test-db";

describe("handler contract fixtures", () => {
  beforeEach(async () => {
    await testDb.resetKnownTables();
  });

  it("matches getCaseById success contract fixture", async () => {
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
    expect(result.data).toBeDefined();
    if (result.status !== 200 || !result.data) {
      return;
    }
    expect(Object.keys(result.data).sort()).toEqual(
      HANDLER_CONTRACT_FIXTURES.getCaseById.successKeys,
    );
  });

  it("matches getCaseById failure contract fixture", async () => {
    const company = await seedCompany();
    const casesRepository = createCasesRepositoryImpl(testDb.adapter);

    const result = await getCaseByIdHandler(
      { auth: null, casesRepository },
      { companyId: company.id, caseId: "00000000-0000-4000-8000-000000000099" },
    );

    expect(result.status).toBe(401);
    expect(result.error).toBeDefined();
    if (result.status === 200 || !result.error) {
      return;
    }
    expect(Object.keys(result.error).sort()).toEqual(
      HANDLER_CONTRACT_FIXTURES.getCaseById.failureKeys,
    );
  });

  it("matches updateDocumentStatus success contract fixture", async () => {
    const company = await seedCompany();
    const doc = await seedDocument({
      companyId: company.id,
      status: "pending_review",
      storagePath: "/fixture/doc",
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
    expect(result.data).toBeDefined();
    if (result.status !== 200 || !result.data) {
      return;
    }
    expect(Object.keys(result.data).sort()).toEqual(
      HANDLER_CONTRACT_FIXTURES.updateDocumentStatus.successKeys,
    );
  });

  it("matches updateDocumentStatus failure contract fixture", async () => {
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
    if (result.status === 200 || !result.error) {
      return;
    }
    expect(Object.keys(result.error).sort()).toEqual(
      HANDLER_CONTRACT_FIXTURES.updateDocumentStatus.failureKeys,
    );
  });

  it("matches assignUserRoleTransactional success contract fixture", async () => {
    const actor = await seedUser();
    const target = await seedUser();
    const company = await seedCompany();
    const companyRole = await seedRole({
      name: `fixture_${actor.id.slice(0, 8)}`,
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
      expect(result.data).toBeDefined();
      if (result.status !== 200 || !result.data) {
        return;
      }
      expect(Object.keys(result.data).sort()).toEqual(
        HANDLER_CONTRACT_FIXTURES.assignUserRoleTransactional.successKeys,
      );
    } finally {
      await pool.end();
    }
  });

  it("matches assignUserRoleTransactional failure contract fixture", async () => {
    const actor = await seedUser();
    const target = await seedUser();
    const companyRole = await seedRole({
      name: `fixture_fail_${actor.id.slice(0, 8)}`,
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
      if (result.status === 200 || !result.error) {
        return;
      }
      expect(Object.keys(result.error).sort()).toEqual(
        HANDLER_CONTRACT_FIXTURES.assignUserRoleTransactional.failureKeys,
      );
    } finally {
      await pool.end();
    }
  });
});
