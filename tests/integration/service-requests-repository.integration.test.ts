import { beforeEach, describe, expect, it } from "vitest";
import { createServiceRequestsRepositoryImpl } from "../../packages/data/service-requests-repository.impl";
import { seedCompany, seedUser } from "./helpers/seed-fixtures";
import { testDb } from "./helpers/test-db";

describe("service requests repository integration", () => {
  beforeEach(async () => {
    await testDb.resetKnownTables();
  });

  it("returns a service request only within matching company scope", async () => {
    const repo = createServiceRequestsRepositoryImpl(testDb.adapter);

    const companyA = await seedCompany();
    const companyB = await seedCompany();
    const user = await seedUser();

    const inserted = await repo.insertInCompany({
      companyId: companyA.id,
      serviceId: "svc-1",
      requestedByUserId: user.id,
      status: "draft",
    });

    const inScope = await repo.getByIdInCompany({
      serviceRequestId: inserted.id,
      companyId: companyA.id,
    });

    const outOfScope = await repo.getByIdInCompany({
      serviceRequestId: inserted.id,
      companyId: companyB.id,
    });

    expect(inScope?.id).toBe(inserted.id);
    expect(outOfScope).toBeNull();
  });

  it("lists service requests only for the requested company", async () => {
    const repo = createServiceRequestsRepositoryImpl(testDb.adapter);

    const companyA = await seedCompany();
    const companyB = await seedCompany();
    const user = await seedUser();

    await repo.insertInCompany({
      companyId: companyA.id,
      serviceId: "svc-a",
      requestedByUserId: user.id,
    });
    await repo.insertInCompany({
      companyId: companyB.id,
      serviceId: "svc-b",
      requestedByUserId: user.id,
    });

    const listA = await repo.listByCompany({ companyId: companyA.id });
    expect(listA).toHaveLength(1);
    expect(listA[0]?.serviceId).toBe("svc-a");
  });

  it("sets submitted_at when inserting with submitted status", async () => {
    const repo = createServiceRequestsRepositoryImpl(testDb.adapter);
    const company = await seedCompany();
    const user = await seedUser();

    const row = await repo.insertInCompany({
      companyId: company.id,
      serviceId: "svc-1",
      requestedByUserId: user.id,
      status: "submitted",
    });

    expect(row.status).toBe("submitted");
    expect(row.submittedAt).toBeTruthy();
  });

  it("sets submitted_at on status transition to submitted", async () => {
    const repo = createServiceRequestsRepositoryImpl(testDb.adapter);
    const company = await seedCompany();
    const user = await seedUser();

    const draft = await repo.insertInCompany({
      companyId: company.id,
      serviceId: "svc-1",
      requestedByUserId: user.id,
      status: "draft",
    });

    expect(draft.submittedAt).toBeNull();

    const submitted = await repo.updateStatusInCompany({
      serviceRequestId: draft.id,
      companyId: company.id,
      status: "submitted",
    });

    expect(submitted?.status).toBe("submitted");
    expect(submitted?.submittedAt).toBeTruthy();
  });

  it("does not update status for another company", async () => {
    const repo = createServiceRequestsRepositoryImpl(testDb.adapter);
    const companyA = await seedCompany();
    const companyB = await seedCompany();
    const user = await seedUser();

    const row = await repo.insertInCompany({
      companyId: companyA.id,
      serviceId: "svc-1",
      requestedByUserId: user.id,
    });

    const updated = await repo.updateStatusInCompany({
      serviceRequestId: row.id,
      companyId: companyB.id,
      status: "submitted",
    });

    expect(updated).toBeNull();

    const unchanged = await repo.getByIdInCompany({
      serviceRequestId: row.id,
      companyId: companyA.id,
    });
    expect(unchanged?.status).toBe("draft");
  });
});
