import { describe, expect, it } from "vitest";
import {
  getProtectedHandlerGovernanceHealth,
} from "../helpers/protected-handler-governance-health";

describe("protected handler governance health", () => {
  it("returns a valid health summary structure", () => {
    const health = getProtectedHandlerGovernanceHealth();

    expect(typeof health.governedHandlers).toBe("number");
    expect(typeof health.excludedHandlers).toBe("number");
    expect(typeof health.nearDueExclusions).toBe("number");
    expect(typeof health.overdueExclusions).toBe("number");
  });

  it("never returns negative values", () => {
    const health = getProtectedHandlerGovernanceHealth();

    expect(health.governedHandlers).toBeGreaterThanOrEqual(0);
    expect(health.excludedHandlers).toBeGreaterThanOrEqual(0);
    expect(health.nearDueExclusions).toBeGreaterThanOrEqual(0);
    expect(health.overdueExclusions).toBeGreaterThanOrEqual(0);
  });
});
