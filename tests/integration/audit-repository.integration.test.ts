import { beforeEach, describe, expect, it } from "vitest";
import { createAuditRepositoryImpl } from "../../packages/audit/audit-repository.impl";
import { testDb } from "./helpers/test-db";

describe("audit repository integration", () => {
  beforeEach(async () => {
    await testDb.resetKnownTables();
  });

  it("persists an audit event", async () => {
    const repo = createAuditRepositoryImpl(testDb.adapter);

    const created = await repo.createEvent({
      actorType: "system",
      action: "test.audit.created",
      entityType: "test_entity",
      entityId: "entity-1",
      metadata: { source: "integration-test" },
    });

    expect(created.id).toBeTruthy();
    expect(created.action).toBe("test.audit.created");
    expect(created.entityType).toBe("test_entity");
    expect(created.entityId).toBe("entity-1");
    expect(created.metadataJson).toEqual({ source: "integration-test" });
  });
});
