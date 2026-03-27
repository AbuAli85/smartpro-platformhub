import { EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES } from "./protected-handler-candidates";

/**
 * Reviewable rationale for each explicitly ungoverned protected-handler candidate.
 * Keys must match `EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES` exactly; no orphan keys.
 */
export const PROTECTED_HANDLER_EXCLUSION_RATIONALES: Record<string, string> = {
  // Example when exclusions exist:
  // someNonGovernedHandler: "Internal-only helper boundary; not contract-governed by design.",
};

export function getExcludedHandlerNames(): readonly string[] {
  return EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES;
}
