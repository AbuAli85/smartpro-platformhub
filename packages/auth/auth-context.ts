import type { Permission } from "./permissions";

export type PlatformRole =
  | "super_admin"
  | "platform_admin"
  | "reviewer"
  | "support"
  | "finance_admin";

export type CompanyRole =
  | "owner"
  | "company_admin"
  | "manager"
  | "staff"
  | "provider"
  | "client";

export interface CompanyMembershipContext {
  companyId: string;
  status: "active" | "inactive" | "suspended" | "invited";
  roles: CompanyRole[];
  permissions: Permission[];
}

export interface AuthContext {
  userId: string;
  platformRoles: PlatformRole[];
  platformPermissions: Permission[];
  memberships: CompanyMembershipContext[];
}

export function getCompanyMembership(
  auth: AuthContext,
  companyId: string,
): CompanyMembershipContext | undefined {
  return auth.memberships.find((m) => m.companyId === companyId);
}

export function hasPlatformRole(
  auth: AuthContext,
  role: PlatformRole,
): boolean {
  return auth.platformRoles.includes(role);
}

export function hasPlatformPermission(
  auth: AuthContext,
  permission: Permission,
): boolean {
  return auth.platformPermissions.includes(permission);
}
