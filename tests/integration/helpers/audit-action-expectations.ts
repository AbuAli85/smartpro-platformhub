/**
 * Documented audit action names aligned with `docs/architecture/AUDIT_LOGGING_PATTERN.md`
 * (Initial Action Naming Examples). Update when docs or runtime contract changes.
 */

export const DOCUMENTED_AUDIT_ACTIONS = [
  "user_role.assigned",
  "user_role.removed",
  "case.approved",
  "case.rejected",
  "document.verified",
  "payment.confirmed",
  "payment.refunded",
] as const;

/** Critical flows: canonical action string expected at runtime and in persisted audit. */
export const CRITICAL_RUNTIME_AUDIT_ACTIONS = {
  assignUserRole: "user_role.assigned",
} as const;

/** Legacy or wrong aliases that must not appear in persisted audit for covered flows. */
export const FORBIDDEN_AUDIT_ACTION_ALIASES = [
  "role.assigned",
  "user_role.added",
] as const;
