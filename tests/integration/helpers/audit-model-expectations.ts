/**
 * Documented audit model expectations aligned with `docs/architecture/AUDIT_LOGGING_PATTERN.md`
 * and runtime usage. Update when docs or implemented audited flows change.
 */

export const DOCUMENTED_AUDIT_ACTOR_TYPES = [
  "user",
  "system",
  "automation",
  "support_override",
] as const;

export const DOCUMENTED_AUDIT_ENTITY_TYPES = ["user_role"] as const;

export const DOCUMENTED_CRITICAL_AUDITED_FLOWS = {
  assignUserRole: {
    action: "user_role.assigned",
    actorType: "user",
    entityType: "user_role",
  },
} as const;
