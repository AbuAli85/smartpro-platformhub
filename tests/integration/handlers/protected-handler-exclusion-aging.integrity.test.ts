import { describe, expect, it } from "vitest";
import {
  PROTECTED_HANDLER_EXCLUSION_NEAR_DUE_DAYS,
  isNearDue,
  startOfUtcToday,
} from "../helpers/protected-handler-exclusion-aging";
import { PROTECTED_HANDLER_EXCLUSION_REVIEW_METADATA } from "../helpers/protected-handler-exclusion-review-metadata";

describe("protected handler exclusion aging integrity", () => {
  it("ensures no exclusion review date is already in the past", () => {
    const today = new Date().toISOString().slice(0, 10);

    for (const metadata of Object.values(PROTECTED_HANDLER_EXCLUSION_REVIEW_METADATA)) {
      expect(metadata.reviewBy >= today).toBe(true);
    }
  });

  it("can identify near-due exclusions within the configured threshold", () => {
    for (const metadata of Object.values(PROTECTED_HANDLER_EXCLUSION_REVIEW_METADATA)) {
      const nearDue = isNearDue(
        metadata.reviewBy,
        PROTECTED_HANDLER_EXCLUSION_NEAR_DUE_DAYS,
      );

      expect(typeof nearDue).toBe("boolean");
    }
  });

  it("treats a review date within the threshold as near-due", () => {
    const today = startOfUtcToday();
    const ahead = new Date(today);
    ahead.setUTCDate(ahead.getUTCDate() + 5);
    const iso = ahead.toISOString().slice(0, 10);
    expect(isNearDue(iso, PROTECTED_HANDLER_EXCLUSION_NEAR_DUE_DAYS)).toBe(true);
  });

  it("does not treat a far-future review date as near-due", () => {
    const today = startOfUtcToday();
    const ahead = new Date(today);
    ahead.setUTCDate(ahead.getUTCDate() + 100);
    const iso = ahead.toISOString().slice(0, 10);
    expect(isNearDue(iso, PROTECTED_HANDLER_EXCLUSION_NEAR_DUE_DAYS)).toBe(false);
  });

  it("does not treat a past review date as near-due", () => {
    expect(isNearDue("2020-01-01", PROTECTED_HANDLER_EXCLUSION_NEAR_DUE_DAYS)).toBe(
      false,
    );
  });
});
