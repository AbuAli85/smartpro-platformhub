import { EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES } from "./protected-handler-candidates";

export interface ProtectedHandlerExclusionReviewMetadata {
  rationale: string;
  /** ISO date, e.g. 2026-06-30 */
  reviewBy: string;
  owner: string;
}

export const PROTECTED_HANDLER_EXCLUSION_REVIEW_METADATA: Record<
  string,
  ProtectedHandlerExclusionReviewMetadata
> = {
  // Example:
  // someUngovernedHandler: {
  //   rationale: "Internal-only helper boundary; not contract-governed by design.",
  //   reviewBy: "2026-06-30",
  //   owner: "platform-architecture",
  // },
};

export function getExcludedHandlerNames(): readonly string[] {
  return EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES;
}
