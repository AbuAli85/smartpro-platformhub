import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { API_CONTRACT_REGISTRY } from "../helpers/api-contract-registry";
import { DOCUMENTED_GOVERNED_HANDLERS } from "../helpers/governed-handler-doc-expectations";
import { GOVERNED_HANDLER_NAMES } from "../helpers/governance-assets";
import {
  POLICY_GOVERNED_HANDLERS,
  REQUIRED_GOVERNANCE_POLICIES,
} from "../helpers/governance-policy-expectations";

function sorted(values: readonly string[]): string[] {
  return [...values].sort((a, b) => a.localeCompare(b));
}

describe("governance doc integrity", () => {
  it("keeps governed-handler expectations aligned across governance helpers", () => {
    const registryHandlers = API_CONTRACT_REGISTRY.map((entry) => entry.handler);

    expect(sorted(registryHandlers)).toEqual(sorted(GOVERNED_HANDLER_NAMES));
    expect(sorted(registryHandlers)).toEqual(sorted(DOCUMENTED_GOVERNED_HANDLERS));
    expect(sorted(registryHandlers)).toEqual(sorted(POLICY_GOVERNED_HANDLERS));
  });

  it("keeps policy governed-handler names unique", () => {
    expect(new Set(POLICY_GOVERNED_HANDLERS).size).toBe(
      POLICY_GOVERNED_HANDLERS.length,
    );
  });

  it("ensures required governance policy docs exist", () => {
    for (const filePath of REQUIRED_GOVERNANCE_POLICIES) {
      expect(fs.existsSync(path.resolve(process.cwd(), filePath))).toBe(true);
    }
  });
});
