import { describe, expect, it } from "vitest";
import { EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES } from "../helpers/protected-handler-candidates";
import { PROTECTED_HANDLER_EXCLUSION_RATIONALES } from "../helpers/protected-handler-exclusion-rationales";
import { PROTECTED_HANDLER_EXCLUSION_REVIEW_METADATA } from "../helpers/protected-handler-exclusion-review-metadata";

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function todayIsoUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

describe("protected handler exclusion review integrity", () => {
  it("ensures every excluded handler has review metadata", () => {
    for (const handler of EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES) {
      expect(PROTECTED_HANDLER_EXCLUSION_REVIEW_METADATA[handler]).toBeTruthy();
    }
  });

  it("ensures review metadata keys do not reference handlers outside the exclusion list", () => {
    const excluded = new Set<string>(EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES);

    for (const handler of Object.keys(PROTECTED_HANDLER_EXCLUSION_REVIEW_METADATA)) {
      expect(excluded.has(handler)).toBe(true);
    }
  });

  it("ensures exclusion review metadata is structurally complete", () => {
    for (const handler of EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES) {
      const metadata = PROTECTED_HANDLER_EXCLUSION_REVIEW_METADATA[handler];
      expect(metadata).toBeTruthy();
      expect(metadata.rationale.trim().length).toBeGreaterThan(0);
      expect(metadata.owner.trim().length).toBeGreaterThan(0);
      expect(isIsoDate(metadata.reviewBy)).toBe(true);
    }
  });

  it("ensures review metadata rationale matches PROTECTED_HANDLER_EXCLUSION_RATIONALES", () => {
    for (const handler of EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES) {
      const metadata = PROTECTED_HANDLER_EXCLUSION_REVIEW_METADATA[handler];
      const rationale = PROTECTED_HANDLER_EXCLUSION_RATIONALES[handler];
      expect(rationale).toBeTruthy();
      expect(metadata.rationale).toBe(rationale);
    }
  });

  it("ensures review-by date is not before today (stale exclusion)", () => {
    const today = todayIsoUtc();
    for (const handler of EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES) {
      const metadata = PROTECTED_HANDLER_EXCLUSION_REVIEW_METADATA[handler];
      expect(metadata.reviewBy >= today).toBe(true);
    }
  });
});
