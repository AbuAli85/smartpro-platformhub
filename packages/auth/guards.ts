import type { Permission } from "./permissions";
import {
  getCompanyMembership,
  hasPlatformPermission,
  hasPlatformRole,
  type AuthContext,
} from "./auth-context";

export class AuthError extends Error {
  code:
    | "UNAUTHENTICATED"
    | "FORBIDDEN"
    | "COMPANY_SCOPE_DENIED"
    | "RECORD_SCOPE_DENIED";

  constructor(
    code:
      | "UNAUTHENTICATED"
      | "FORBIDDEN"
      | "COMPANY_SCOPE_DENIED"
      | "RECORD_SCOPE_DENIED",
    message: string,
  ) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

export function requireAuth(auth: AuthContext | null | undefined): AuthContext {
  if (!auth?.userId) {
    throw new AuthError("UNAUTHENTICATED", "Authentication required");
  }
  return auth;
}

export function hasPermission(
  auth: AuthContext,
  permission: Permission,
  companyId?: string,
): boolean {
  if (hasPlatformPermission(auth, permission)) {
    return true;
  }

  if (!companyId) {
    return false;
  }

  const membership = getCompanyMembership(auth, companyId);
  if (!membership || membership.status !== "active") {
    return false;
  }

  return membership.permissions.includes(permission);
}

export function requirePermission(
  auth: AuthContext,
  permission: Permission,
  companyId?: string,
): void {
  if (!hasPermission(auth, permission, companyId)) {
    throw new AuthError(
      "FORBIDDEN",
      `Missing permission: ${permission}`,
    );
  }
}

export function canOverrideCompanyScope(auth: AuthContext): boolean {
  return (
    hasPlatformRole(auth, "super_admin") ||
    hasPlatformRole(auth, "platform_admin") ||
    hasPlatformRole(auth, "reviewer") ||
    hasPlatformRole(auth, "support") ||
    hasPlatformRole(auth, "finance_admin")
  );
}

export function requireCompanyAccess(
  auth: AuthContext,
  companyId: string,
): void {
  const membership = getCompanyMembership(auth, companyId);

  if (membership?.status === "active") {
    return;
  }

  if (canOverrideCompanyScope(auth)) {
    return;
  }

  throw new AuthError(
    "COMPANY_SCOPE_DENIED",
    "You do not have access to this company scope",
  );
}

export function assertRecordInCompanyScope(
  recordCompanyId: string,
  expectedCompanyId: string,
): void {
  if (recordCompanyId !== expectedCompanyId) {
    throw new AuthError(
      "RECORD_SCOPE_DENIED",
      "Record does not belong to the permitted company scope",
    );
  }
}
