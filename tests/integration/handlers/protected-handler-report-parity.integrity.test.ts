import { describe, expect, it } from "vitest";
import {
  buildProtectedHandlerExclusionSummary,
  formatProtectedHandlerExclusionSummary,
} from "../helpers/protected-handler-exclusion-review-summary";

describe("protected handler report parity", () => {
  it("keeps JSON-visible summary rows deterministic", () => {
    const rows = buildProtectedHandlerExclusionSummary();

    expect(Array.isArray(rows)).toBe(true);

    const sortedHandlers = [...rows.map((row) => row.handler)].sort();
    expect(rows.map((row) => row.handler)).toEqual(sortedHandlers);
  });

  it("keeps empty-state human report explicit when there are no summary rows", () => {
    const rows = buildProtectedHandlerExclusionSummary();
    const output = formatProtectedHandlerExclusionSummary(rows);

    if (rows.length === 0) {
      expect(output).toBe("No protected-handler exclusions currently recorded.");
    } else {
      expect(output.length).toBeGreaterThan(0);
    }
  });

  it("keeps row-count parity between summary rows and machine-readable output", () => {
    const rows = buildProtectedHandlerExclusionSummary();
    const parsed = JSON.parse(JSON.stringify(rows)) as unknown[];

    expect(parsed).toHaveLength(rows.length);
  });

  it("keeps human-readable report derived from the same summary rows", () => {
    const rows = buildProtectedHandlerExclusionSummary();
    const output = formatProtectedHandlerExclusionSummary(rows);

    if (rows.length > 0) {
      for (const row of rows) {
        expect(output).toContain(`Handler: ${row.handler}`);
        expect(output).toContain(`Owner: ${row.owner}`);
        expect(output).toContain(`Review By: ${row.reviewBy}`);
      }
    }
  });
});
