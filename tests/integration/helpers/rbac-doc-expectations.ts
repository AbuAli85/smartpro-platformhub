/**
 * Controlled expectations that mirror `docs/architecture/RBAC_MODEL.md` (Role Model section).
 * Update this file when the documented model changes; `rbac-documentation.integrity.integration.test`
 * compares these values to seeded RBAC data.
 */

export const DOCUMENTED_PLATFORM_ROLES = [
  "super_admin",
  "platform_admin",
  "reviewer",
  "support",
  "finance_admin",
] as const;

export const DOCUMENTED_COMPANY_ROLES = [
  "owner",
  "company_admin",
  "manager",
  "staff",
  "provider",
  "client",
] as const;

/** Critical mappings called out for documentation integrity (subset of full seed). */
export const DOCUMENTED_CRITICAL_ROLE_PERMISSIONS = {
  platform_admin: ["roles:manage"],
  reviewer: ["cases:approve", "documents:verify"],
  finance_admin: ["payments:confirm"],
  owner: ["cases:assign"],
} as const;
