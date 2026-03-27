/**
 * Likely protected-handler candidates for onboarding review.
 * Each candidate must appear in `INVENTORIED_PROTECTED_HANDLERS` or `EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES`.
 */
export const PROTECTED_HANDLER_CANDIDATES = [
  "getCaseByIdHandler",
  "updateDocumentStatusHandler",
  "assignUserRoleTransactionalHandler",
] as const;

/** Candidates intentionally not governed; must not overlap inventory. */
export const EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES: readonly string[] = [];
