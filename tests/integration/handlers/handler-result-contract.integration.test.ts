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
import { seedCase, seedCompany, seedDocument, seedRole, seedUser } from "../helpers/seed-fixtures";
import { testDb } from "../helpers/test-db";

describe("protected handler result contract", () => {
  beforeEach(async () => {
    await testDb.resetKnownTables();
  });

  it("returns { status, data } on successful case read", async () => {
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
    expect("error" in result).toBe(false);
    expect("data" in result).toBe(true);
  });

  it("returns { status, error } on unauthorized case read", async () => {
    const company = await seedCompany();
    const casesRepository = createCasesRepositoryImpl(testDb.adapter);

    const result = await getCaseByIdHandler(
      { auth: null, casesRepository },
      { companyId: company.id, caseId: "00000000-0000-4000-8000-000000000099" },
    );

    expect(result.status).toBe(401);
    expect(result.error).toBeDefined();
    expect(result.error?.code).toBeDefined();
    expect(result.error?.message).toBeDefined();
    expect("data" in result).toBe(false);
    expect("error" in result).toBe(true);
  });

  it("returns { status, data } on successful document update", async () => {
    const company = await seedCompany();
    const doc = await seedDocument({
      companyId: company.id,
      status: "pending_review",
      storagePath: "/contract/doc",
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
    expect("error" in result).toBe(false);
    expect("data" in result).toBe(true);
  });

  it("returns { status, error } on forbidden document update", async () => {
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
    expect(result.error?.code).toBeDefined();
    expect(result.error?.message).toBeDefined();
    expect("data" in result).toBe(false);
    expect("error" in result).toBe(true);
  });

  it("returns { status, data } on successful role assignment", async () => {
    const actor = await seedUser();
    const target = await seedUser();
    const company = await seedCompany();
    const companyRole = await seedRole({
      name: `hr_contract_${actor.id.slice(0, 8)}`,
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
      expect("error" in result).toBe(false);
      expect("data" in result).toBe(true);
    } finally {
      await pool.end();
    }
  });

  it("returns { status, error } on unauthenticated role assignment", async () => {
    const pool = createPostgresPool(getPostgresConfigFromEnv());
    const db = new PostgresAdapter(pool);

    try {
      const result = await assignUserRoleTransactionalHandler(
        { auth: null, db },
        {
          targetUserId: "00000000-0000-4000-8000-000000000011",
          roleId: "00000000-0000-4000-8000-000000000022",
          companyId: null,
        },
      );

      expect(result.status).toBe(401);
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBeDefined();
      expect(result.error?.message).toBeDefined();
      expect("data" in result).toBe(false);
      expect("error" in result).toBe(true);
    } finally {
      await pool.end();
    }
  });
});
