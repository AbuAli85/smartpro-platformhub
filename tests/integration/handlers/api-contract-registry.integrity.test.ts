import { describe, expect, it } from "vitest";
import { API_CONTRACT_REGISTRY } from "../helpers/api-contract-registry";
import { HANDLER_CONTRACT_FIXTURES } from "../helpers/handler-contract-fixtures";

describe("API contract registry integrity", () => {
  it("has unique handler names", () => {
    const names = API_CONTRACT_REGISTRY.map((entry) => entry.handler);
    expect(new Set(names).size).toBe(names.length);
  });

  it("references known contract fixtures", () => {
    const fixtureNames = new Set(
      Object.keys(HANDLER_CONTRACT_FIXTURES) as Array<
        keyof typeof HANDLER_CONTRACT_FIXTURES
      >,
    );

    for (const entry of API_CONTRACT_REGISTRY) {
      expect(fixtureNames.has(entry.contractFixture)).toBe(true);
    }
  });

  it("requires core coverage flags for all registered handlers", () => {
    for (const entry of API_CONTRACT_REGISTRY) {
      expect(entry.successPayloadCovered).toBe(true);
      expect(entry.errorSemanticsCovered).toBe(true);
      expect(entry.resultShapeCovered).toBe(true);
      expect(entry.responseHygieneCovered).toBe(true);
    }
  });
});
