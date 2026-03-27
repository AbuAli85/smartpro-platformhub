import type {
  AuthContext,
  CompanyMembershipContext,
} from "../../../packages/auth/auth-context";
import type { Permission } from "../../../packages/auth/permissions";

export function createAuthContext(
  overrides?: Partial<AuthContext>,
): AuthContext {
  return {
    userId: "00000000-0000-4000-8000-000000000001",
    platformRoles: [],
    platformPermissions: [],
    memberships: [],
    ...overrides,
  };
}

export function withPlatformPermissions(
  ctx: AuthContext,
  permissions: Permission[],
): AuthContext {
  return { ...ctx, platformPermissions: [...permissions] };
}

export function withActiveMembership(
  ctx: AuthContext,
  companyId: string,
  permissions: Permission[],
  roles: CompanyMembershipContext["roles"] = ["staff"],
): AuthContext {
  return {
    ...ctx,
    memberships: [
      ...ctx.memberships.filter((m) => m.companyId !== companyId),
      {
        companyId,
        status: "active",
        roles,
        permissions,
      },
    ],
  };
}

/** Auth that only belongs to `companyId` — use to assert isolation from another company's resources. */
export function withDifferentTenant(
  ctx: AuthContext,
  companyId: string,
  permissions: Permission[],
): AuthContext {
  return {
    ...ctx,
    memberships: [
      {
        companyId,
        status: "active",
        roles: ["staff"],
        permissions,
      },
    ],
  };
}
