import type { Permission } from "./permissions";
import type {
  AuthContext,
  CompanyMembershipContext,
  PlatformRole,
} from "./auth-context";

/**
 * Implement these in your data layer (single place per deployment).
 * Load platform roles from `user_roles` where role scope is platform;
 * resolve permissions via `role_permissions`; build one row per company membership
 * with aggregated company roles and effective permissions.
 */
export interface AuthContextResolverDeps {
  getPlatformRolesForUser(userId: string): Promise<PlatformRole[]>;
  getPlatformPermissionsForRoles(
    roles: PlatformRole[],
  ): Promise<Permission[]>;
  getActiveMembershipsWithRolesAndPermissions(
    userId: string,
  ): Promise<CompanyMembershipContext[]>;
}

/**
 * Resolves {@link AuthContext} from persistence. Call once per request after
 * authenticating the user; attach the result to request context for handlers.
 */
export async function buildAuthContextForUser(
  userId: string,
  deps: AuthContextResolverDeps,
): Promise<AuthContext> {
  const platformRoles = await deps.getPlatformRolesForUser(userId);
  const platformPermissions = await deps.getPlatformPermissionsForRoles(
    platformRoles,
  );
  const memberships =
    await deps.getActiveMembershipsWithRolesAndPermissions(userId);

  return {
    userId,
    platformRoles,
    platformPermissions,
    memberships,
  };
}
