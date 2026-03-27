import { describe, expect, it } from "vitest";
import {
  buildProtectedHandlerExclusionSummary,
  formatProtectedHandlerExclusionSummary,
} from "../helpers/protected-handler-exclusion-review-summary";
import {
  PROTECTED_HANDLER_EXCLUSION_REVIEW_METADATA,
} from "../helpers/protected-handler-exclusion-review-metadata";

describe("protected handler exclusion review summary", () => {
  it("builds a deterministic summary for current exclusions", () => {
    const rows = buildProtectedHandlerExclusionSummary();

    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBe(
      Object.keys(PROTECTED_HANDLER_EXCLUSION_REVIEW_METADATA).length,
    );

    const sortedHandlers = [...rows.map((row) => row.handler)].sort();
    expect(rows.map((row) => row.handler)).toEqual(sortedHandlers);
  });

  it("formats an empty exclusion summary clearly", () => {
    const output = formatProtectedHandlerExclusionSummary([]);
    expect(output).toBe("No protected-handler exclusions currently recorded.");
  });

  it("formats populated summary rows deterministically", () => {
    const rows = buildProtectedHandlerExclusionSummary();
    const output = formatProtectedHandlerExclusionSummary(rows);

    expect(typeof output).toBe("string");

    if (rows.length > 0) {
      for (const row of rows) {
        expect(output).toContain(`Handler: ${row.handler}`);
        expect(output).toContain(`Owner: ${row.owner}`);
        expect(output).toContain(`Review By: ${row.reviewBy}`);
      }
    }
  });
});
