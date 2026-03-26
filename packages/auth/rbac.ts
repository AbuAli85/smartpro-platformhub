/**
 * Legacy entry: prefer importing from `./auth-context`, `./guards`, and `./auth-context-resolver`.
 */

export type {
  AuthContext,
  CompanyMembershipContext,
  CompanyRole,
  PlatformRole,
} from "./auth-context";
export {
  getCompanyMembership,
  hasPlatformPermission,
  hasPlatformRole,
} from "./auth-context";
export { buildAuthContextForUser, type AuthContextResolverDeps } from "./auth-context-resolver";
export {
  assertRecordInCompanyScope,
  AuthError,
  canOverrideCompanyScope,
  hasPermission,
  requireAuth,
  requireCompanyAccess,
  requirePermission,
} from "./guards";
