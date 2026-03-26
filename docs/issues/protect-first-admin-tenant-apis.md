# Protect first admin and tenant APIs with auth, permission, and tenant-scope guards

**Status:** Ready for AI

## Objective

Apply the new authorization and tenant-scope patterns to the first real backend surfaces so SmartPRO has protected examples for both platform-admin and tenant-scoped operations.

## Scope

- one platform-admin example
- one tenant-scoped case read example
- one tenant-scoped document status update example
- consistent 404 vs 403 behavior
- audit hook wiring for the admin action
- documentation for protected route/procedure pattern

## Acceptance Criteria

- protected admin endpoint/procedure exists
- protected tenant case read endpoint/procedure exists
- protected tenant document mutation endpoint/procedure exists
- company scope is enforced in tenant paths
- permission checks are centralized
- admin action includes audit hook integration
- file created:
  - docs/architecture/PROTECTED_API_PATTERN.md
