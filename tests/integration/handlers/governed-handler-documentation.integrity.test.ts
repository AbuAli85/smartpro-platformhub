import { describe, expect, it } from "vitest";
import { API_CONTRACT_REGISTRY } from "../helpers/api-contract-registry";
import { DOCUMENTED_GOVERNED_HANDLERS } from "../helpers/governed-handler-doc-expectations";
import { GOVERNED_HANDLER_NAMES } from "../helpers/governance-assets";

function sorted(values: readonly string[]): string[] {
  return [...values].sort((a, b) => a.localeCompare(b));
}

describe("governed handler documentation integrity", () => {
  it("matches documented governed handlers to API contract registry handlers", () => {
    const registeredHandlers = API_CONTRACT_REGISTRY.map((entry) => entry.handler);

    expect(sorted(registeredHandlers)).toEqual(
      sorted(DOCUMENTED_GOVERNED_HANDLERS),
    );
  });

  it("ensures documented governed handlers are unique", () => {
    expect(new Set(DOCUMENTED_GOVERNED_HANDLERS).size).toBe(
      DOCUMENTED_GOVERNED_HANDLERS.length,
    );
  });

  it("matches documented expectations to governance-assets canonical list", () => {
    expect(sorted(DOCUMENTED_GOVERNED_HANDLERS)).toEqual(
      sorted(GOVERNED_HANDLER_NAMES),
    );
  });
});
