import { describe, expect, it } from "vitest";
import { INVENTORIED_PROTECTED_HANDLERS } from "../helpers/protected-handler-inventory";
import {
  EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES,
  PROTECTED_HANDLER_CANDIDATES,
} from "../helpers/protected-handler-candidates";

function sorted(values: readonly string[]): string[] {
  return [...values].sort((a, b) => a.localeCompare(b));
}

describe("protected handler discovery integrity", () => {
  it("ensures every protected-handler candidate is either inventoried or explicitly excluded", () => {
    const inventoried = new Set(INVENTORIED_PROTECTED_HANDLERS);
    const excluded = new Set(EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES);

    for (const candidate of PROTECTED_HANDLER_CANDIDATES) {
      expect(inventoried.has(candidate) || excluded.has(candidate)).toBe(true);
    }
  });

  it("ensures protected-handler candidates remain unique", () => {
    expect(new Set(PROTECTED_HANDLER_CANDIDATES).size).toBe(
      PROTECTED_HANDLER_CANDIDATES.length,
    );
  });

  it("ensures explicitly ungoverned candidates remain unique", () => {
    expect(new Set(EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES).size).toBe(
      EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES.length,
    );
  });

  it("ensures no candidate is both inventoried and explicitly excluded", () => {
    const inventoried = new Set<string>(INVENTORIED_PROTECTED_HANDLERS);

    for (const candidate of EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES) {
      expect(inventoried.has(candidate)).toBe(false);
    }
  });

  it("keeps inventoried protected handlers within the candidate set unless separately justified", () => {
    expect(sorted(INVENTORIED_PROTECTED_HANDLERS)).toEqual(
      sorted(PROTECTED_HANDLER_CANDIDATES),
    );
  });
});
