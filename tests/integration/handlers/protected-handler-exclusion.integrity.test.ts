import { describe, expect, it } from "vitest";
import { EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES } from "../helpers/protected-handler-candidates";
import { PROTECTED_HANDLER_EXCLUSION_RATIONALES } from "../helpers/protected-handler-exclusion-rationales";

describe("protected handler exclusion integrity", () => {
  it("ensures every excluded handler has an explicit rationale", () => {
    for (const handler of EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES) {
      const rationale = PROTECTED_HANDLER_EXCLUSION_RATIONALES[handler];
      expect(rationale).toBeTruthy();
      expect(String(rationale).trim().length).toBeGreaterThan(0);
    }
  });

  it("ensures rationale keys do not reference handlers outside the exclusion list", () => {
    const excluded = new Set<string>(EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES);

    for (const handler of Object.keys(PROTECTED_HANDLER_EXCLUSION_RATIONALES)) {
      expect(excluded.has(handler)).toBe(true);
    }
  });

  it("ensures excluded handlers remain unique", () => {
    expect(new Set(EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES).size).toBe(
      EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES.length,
    );
  });
});
