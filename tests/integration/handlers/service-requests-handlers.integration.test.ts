import { beforeEach, describe, expect, it } from "vitest";
import { PERMISSIONS } from "../../../packages/auth/permissions";
import { createServiceRequestsRepositoryImpl } from "../../../packages/data/service-requests-repository.impl";
import { createServiceRequestDraftHandler } from "../../../packages/server/service-requests/create-service-request-draft.handler";
import { getServiceRequestByIdHandler } from "../../../packages/server/service-requests/get-service-request-by-id.handler";
import { listServiceRequestsByCompanyHandler } from "../../../packages/server/service-requests/list-service-requests-by-company.handler";
import { updateServiceRequestStatusHandler } from "../../../packages/server/service-requests/update-service-request-status.handler";
import {
  createAuthContext,
  withActiveMembership,
  withDifferentTenant,
} from "../helpers/auth-context";
import { seedCompany, seedServiceRequest, seedUser } from "../helpers/seed-fixtures";
import { testDb } from "../helpers/test-db";

describe("service request protected handlers", () => {
  beforeEach(async () => {
    await testDb.resetKnownTables();
  });

  describe("createServiceRequestDraftHandler", () => {
    it("returns 401 when unauthenticated", async () => {
      const company = await seedCompany();
      const repo = createServiceRequestsRepositoryImpl(testDb.adapter);

      const result = await createServiceRequestDraftHandler(
        { auth: null, serviceRequestsRepository: repo },
        { companyId: company.id, serviceId: "svc-1" },
      );

      expect(result.status).toBe(401);
      if (result.status !== 200) {
        expect(result.error?.code).toBe("UNAUTHENTICATED");
      }
    });

    it("returns 403 when missing service_requests:create", async () => {
      const company = await seedCompany();
      const repo = createServiceRequestsRepositoryImpl(testDb.adapter);
      const auth = withActiveMembership(createAuthContext(), company.id, []);

      const result = await createServiceRequestDraftHandler(
        { auth, serviceRequestsRepository: repo },
        { companyId: company.id, serviceId: "svc-1" },
      );

      expect(result.status).toBe(403);
      if (result.status !== 200) {
        expect(result.error?.code).toBe("FORBIDDEN");
      }
    });

    it("returns 403 when company scope denied", async () => {
      const companyA = await seedCompany();
      const companyB = await seedCompany();
      const user = await seedUser();
      const repo = createServiceRequestsRepositoryImpl(testDb.adapter);
      const auth = withDifferentTenant(
        createAuthContext({ userId: user.id }),
        companyB.id,
        [PERMISSIONS.SERVICE_REQUESTS_CREATE],
      );

      const result = await createServiceRequestDraftHandler(
        { auth, serviceRequestsRepository: repo },
        { companyId: companyA.id, serviceId: "svc-1" },
      );

      expect(result.status).toBe(403);
      if (result.status !== 200) {
        expect(result.error?.code).toBe("COMPANY_SCOPE_DENIED");
      }
    });

    it("creates draft when authorized", async () => {
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
        { companyId: company.id, serviceId: "svc-1" },
      );

      expect(result.status).toBe(200);
      if (result.status === 200 && result.data) {
        expect(result.data.status).toBe("draft");
        expect(result.data.companyId).toBe(company.id);
        expect(result.data.serviceId).toBe("svc-1");
        expect(result.data.requestedByUserId).toBe(user.id);
      }
    });
  });

  describe("getServiceRequestByIdHandler", () => {
    it("returns 404 when not found", async () => {
      const company = await seedCompany();
      const user = await seedUser();
      const repo = createServiceRequestsRepositoryImpl(testDb.adapter);
      const auth = withActiveMembership(
        createAuthContext({ userId: user.id }),
        company.id,
        [PERMISSIONS.SERVICE_REQUESTS_READ],
      );

      const result = await getServiceRequestByIdHandler(
        { auth, serviceRequestsRepository: repo },
        {
          companyId: company.id,
          serviceRequestId: "00000000-0000-4000-8000-0000000000aa",
        },
      );

      expect(result.status).toBe(404);
      if (result.status !== 200) {
        expect(result.error?.code).toBe("RECORD_NOT_FOUND");
      }
    });

    it("returns row when authorized", async () => {
      const company = await seedCompany();
      const user = await seedUser();
      const row = await seedServiceRequest({
        companyId: company.id,
        serviceId: "svc-x",
        requestedByUserId: user.id,
        status: "draft",
      });
      const repo = createServiceRequestsRepositoryImpl(testDb.adapter);
      const auth = withActiveMembership(
        createAuthContext({ userId: user.id }),
        company.id,
        [PERMISSIONS.SERVICE_REQUESTS_READ],
      );

      const result = await getServiceRequestByIdHandler(
        { auth, serviceRequestsRepository: repo },
        { companyId: company.id, serviceRequestId: row.id },
      );

      expect(result.status).toBe(200);
      if (result.status === 200 && result.data) {
        expect(result.data.id).toBe(row.id);
        expect(result.data.status).toBe("draft");
      }
    });
  });

  describe("listServiceRequestsByCompanyHandler", () => {
    it("returns 403 without read permission", async () => {
      const company = await seedCompany();
      const user = await seedUser();
      const repo = createServiceRequestsRepositoryImpl(testDb.adapter);
      const auth = withActiveMembership(
        createAuthContext({ userId: user.id }),
        company.id,
        [],
      );

      const result = await listServiceRequestsByCompanyHandler(
        { auth, serviceRequestsRepository: repo },
        { companyId: company.id },
      );

      expect(result.status).toBe(403);
    });

    it("lists only in-scope company rows", async () => {
      const company = await seedCompany();
      const other = await seedCompany();
      const user = await seedUser();
      await seedServiceRequest({
        companyId: company.id,
        serviceId: "a",
        requestedByUserId: user.id,
        status: "draft",
      });
      await seedServiceRequest({
        companyId: other.id,
        serviceId: "b",
        requestedByUserId: user.id,
        status: "draft",
      });

      const repo = createServiceRequestsRepositoryImpl(testDb.adapter);
      const auth = withActiveMembership(
        createAuthContext({ userId: user.id }),
        company.id,
        [PERMISSIONS.SERVICE_REQUESTS_READ],
      );

      const result = await listServiceRequestsByCompanyHandler(
        { auth, serviceRequestsRepository: repo },
        { companyId: company.id, limit: 10 },
      );

      expect(result.status).toBe(200);
      if (result.status === 200 && result.data) {
        expect(result.data.serviceRequests.length).toBe(1);
        expect(result.data.serviceRequests[0]?.companyId).toBe(company.id);
      }
    });
  });

  describe("updateServiceRequestStatusHandler", () => {
    it("allows draft → submitted", async () => {
      const company = await seedCompany();
      const user = await seedUser();
      const row = await seedServiceRequest({
        companyId: company.id,
        serviceId: "svc",
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
          status: "submitted",
        },
      );

      expect(result.status).toBe(200);
      if (result.status === 200 && result.data) {
        expect(result.data.status).toBe("submitted");
        expect(result.data.submittedAt).toBeTruthy();
      }
    });

    it("allows submitted → withdrawn", async () => {
      const company = await seedCompany();
      const user = await seedUser();
      const row = await seedServiceRequest({
        companyId: company.id,
        serviceId: "svc",
        requestedByUserId: user.id,
        status: "submitted",
        submittedAt: new Date().toISOString(),
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

      expect(result.status).toBe(200);
      if (result.status === 200 && result.data) {
        expect(result.data.status).toBe("withdrawn");
      }
    });

    it("returns 400 on invalid transition", async () => {
      const company = await seedCompany();
      const user = await seedUser();
      const row = await seedServiceRequest({
        companyId: company.id,
        serviceId: "svc",
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
          status: "cancelled",
        },
      );

      expect(result.status).toBe(400);
      if (result.status !== 200) {
        expect(result.error?.code).toBe("INVALID_SERVICE_REQUEST_TRANSITION");
      }
    });
  });
});
