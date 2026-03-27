import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { API_CONTRACT_REGISTRY } from "../helpers/api-contract-registry";
import {
  GOVERNED_HANDLER_NAMES,
  REQUIRED_CONTRACT_GOVERNANCE_DOCS,
} from "../helpers/governance-assets";

function resolveFromRepoRoot(relativePath: string): string {
  return path.resolve(process.cwd(), relativePath);
}

describe("governance automation lite integrity", () => {
  it("ensures all governed handlers are represented in the API contract registry", () => {
    const registered = new Set(
      API_CONTRACT_REGISTRY.map((entry) => entry.handler),
    );

    for (const handler of GOVERNED_HANDLER_NAMES) {
      expect(registered.has(handler)).toBe(true);
    }
  });

  it("ensures required contract governance docs exist", () => {
    for (const filePath of REQUIRED_CONTRACT_GOVERNANCE_DOCS) {
      expect(fs.existsSync(resolveFromRepoRoot(filePath))).toBe(true);
    }
  });

  it("ensures governed handler list stays unique", () => {
    expect(new Set(GOVERNED_HANDLER_NAMES).size).toBe(
      GOVERNED_HANDLER_NAMES.length,
    );
  });
});
