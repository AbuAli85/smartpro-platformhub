import { describe, expect, it } from "vitest";
import { API_CONTRACT_REGISTRY } from "../helpers/api-contract-registry";
import { HANDLER_CONTRACT_FIXTURES } from "../helpers/handler-contract-fixtures";

describe("registry-to-test coverage integrity", () => {
  it("ensures every registered handler references an existing contract fixture", () => {
    const fixtureNames = new Set(
      Object.keys(HANDLER_CONTRACT_FIXTURES) as Array<
        keyof typeof HANDLER_CONTRACT_FIXTURES
      >,
    );

    for (const entry of API_CONTRACT_REGISTRY) {
      expect(fixtureNames.has(entry.contractFixture)).toBe(true);
    }
  });

  it("ensures registered handler names are unique", () => {
    const names = API_CONTRACT_REGISTRY.map((entry) => entry.handler);
    expect(new Set(names).size).toBe(names.length);
  });

  it("ensures fixture keys are unique", () => {
    const fixtureKeys = Object.keys(HANDLER_CONTRACT_FIXTURES);
    expect(new Set(fixtureKeys).size).toBe(fixtureKeys.length);
  });

  it("ensures all registry coverage flags remain complete", () => {
    for (const entry of API_CONTRACT_REGISTRY) {
      expect(entry.successPayloadCovered).toBe(true);
      expect(entry.errorSemanticsCovered).toBe(true);
      expect(entry.resultShapeCovered).toBe(true);
      expect(entry.responseHygieneCovered).toBe(true);
    }
  });
});
