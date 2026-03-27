# Protected Handler Test Pattern

## Purpose
Defines how SmartPRO tests protected server handlers with auth, RBAC, and tenant enforcement.

## Handler contract
Server handlers in `packages/server/**` catch domain errors and return a **result object** (they do not throw for auth/tenant failures):

- `status: 200` and `data` on success
- `status` 4xx/5xx and `error` (`code`, `message`, …) on failure

Integration tests should assert `result.status` and `result.error?.code`, not `expect().rejects`.

## Auth context shape
Use `tests/integration/helpers/auth-context.ts` with the real `AuthContext` type (`userId`, `platformRoles`, `platformPermissions`, `memberships`). Company-scoped permissions live under `memberships[].permissions` for an active `companyId`.

## Required test cases (tenant-scoped handlers)

For handlers that use `requireCompanyAccess` and tenant-scoped repositories (e.g. cases, documents), cover:

1. **Unauthorized** → `401` / `UNAUTHENTICATED`
2. **Missing permission** → `403` / `FORBIDDEN`
3. **Cross-company scope** → `403` / `COMPANY_SCOPE_DENIED` when the caller has no access to the target `companyId` (current `mapAuthRelatedError` mapping)
4. **Missing record in tenant** → `404` / `RECORD_NOT_FOUND` when the id is not valid for that company scope
5. **Valid request** → `200` and expected `data`

Prefer **404** for “wrong tenant” *record* outcomes when the stack maps `TenantScopeError` to 404. **Company scope denial** without membership is currently **`403`** in this codebase—tests should match production mapping, not mock guards.

## Admin / platform-scoped handlers

Some handlers (e.g. `assignUserRoleTransactional`) call `requirePermission` **without** a `companyId`, so **only platform permissions** satisfy the check. Cover:

1. `401` when unauthenticated
2. `403` when platform permission is missing (including when the permission exists only on a company membership—still `403` today)
3. `200` when the required platform permission is present and the DB operation succeeds

## Principles

- Handlers must not trust client input; tests exercise real guards.
- Tenant isolation is enforced in domain code and repositories; tests use **real** database state.
- Do **not** mock `requireAuth`, `requirePermission`, or `requireCompanyAccess`.

## Why
Repository tests verify data correctness. Handler tests verify security enforcement and HTTP-oriented error mapping at the server boundary. Both are required for production-grade systems.
