import { describe, expect, it } from "vitest";
import { API_CONTRACT_REGISTRY } from "../helpers/api-contract-registry";
import { GOVERNED_HANDLER_NAMES } from "../helpers/governance-assets";
import { INVENTORIED_PROTECTED_HANDLERS } from "../helpers/protected-handler-inventory";

function sorted(values: readonly string[]): string[] {
  return [...values].sort((a, b) => a.localeCompare(b));
}

describe("protected handler growth integrity", () => {
  it("keeps inventoried protected handlers aligned with governed handlers", () => {
    expect(sorted(INVENTORIED_PROTECTED_HANDLERS)).toEqual(
      sorted(GOVERNED_HANDLER_NAMES),
    );
  });

  it("keeps inventoried protected handlers aligned with API contract registry handlers", () => {
    const registryHandlers = API_CONTRACT_REGISTRY.map((entry) => entry.handler);

    expect(sorted(INVENTORIED_PROTECTED_HANDLERS)).toEqual(
      sorted(registryHandlers),
    );
  });

  it("keeps inventoried protected handlers unique", () => {
    expect(new Set(INVENTORIED_PROTECTED_HANDLERS).size).toBe(
      INVENTORIED_PROTECTED_HANDLERS.length,
    );
  });
});
