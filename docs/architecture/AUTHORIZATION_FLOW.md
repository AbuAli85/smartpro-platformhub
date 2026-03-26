# Authorization Flow

SmartPRO APIs should enforce authentication, permissions, company scope, and record-level tenant checks in a consistent order. Platform operators may bypass company membership only where explicitly allowed; those paths remain subject to audit expectations.

## Sequence

1. Authenticate caller (session, JWT, or equivalent).
2. Build **auth context** once per request via `buildAuthContextForUser` in `packages/auth/auth-context-resolver.ts` (implement `AuthContextResolverDeps` against your database).
3. Validate input (schema, IDs).
4. Enforce **permission** with `requirePermission` (platform permissions or company-scoped permission when `companyId` is provided).
5. For tenant-scoped operations, enforce **company access** with `requireCompanyAccess`.
6. Fetch the record from persistence.
7. **Assert record tenant** with `assertRecordInCompanyScope(record.companyId, expectedCompanyId)` before trusting or mutating the row.
8. Execute service-layer business logic (not in the route handler).
9. Emit an **audit event** for privileged or cross-tenant actions (role changes, platform overrides on sensitive data).
10. Return a structured response; map `AuthError` to HTTP or tRPC codes consistently.

## Rules

- No protected route skips auth context resolution.
- No tenant-scoped route skips company access check (unless an explicit platform override is intended and audited).
- No record mutation happens before record scope verification.
- Platform override access must be auditable where sensitive; `canOverrideCompanyScope` answers *access only*, not audit.
- Do not scatter permission or membership resolution inside handlers—use `buildAuthContextForUser` and guards.

## Primitives

| Primitive | Role |
|-----------|------|
| `requireAuth` | Caller must have `userId` (authenticated identity). |
| `requirePermission` | Caller has platform permission, or active membership in `companyId` with that permission. |
| `requireCompanyAccess` | Active membership for `companyId`, or platform role that may override (see `canOverrideCompanyScope`). |
| `assertRecordInCompanyScope` | Loaded row’s `companyId` matches the intended tenant. |

## Tenant-scoped read

```ts
const auth = requireAuth(ctx.auth);
requireCompanyAccess(auth, input.companyId);
requirePermission(auth, PERMISSIONS.CASES_READ, input.companyId);

const record = await caseRepo.getById(input.caseId);
assertRecordInCompanyScope(record.companyId, input.companyId);

return record;
```

## Tenant-scoped mutation

```ts
const auth = requireAuth(ctx.auth);
requireCompanyAccess(auth, input.companyId);
requirePermission(auth, PERMISSIONS.CASES_UPDATE, input.companyId);

const record = await caseRepo.getById(input.caseId);
assertRecordInCompanyScope(record.companyId, input.companyId);

const updated = await caseService.updateCase({
  actorUserId: auth.userId,
  caseId: input.caseId,
  companyId: input.companyId,
  patch: input.patch,
});

return updated;
```

## Platform admin operation (no tenant in input)

```ts
const auth = requireAuth(ctx.auth);
requirePermission(auth, PERMISSIONS.ROLES_MANAGE);

const result = await adminService.assignRole({ /* ... */ });
```

For cross-tenant or sensitive platform actions, the service should also call the audit sink (see `packages/auth/audit-hooks.ts`).

## Resolver

Implement `AuthContextResolverDeps` once:

- Load platform roles and effective platform permissions from RBAC tables.
- Load memberships with status, company roles, and effective company permissions per company.

Pass the resulting `AuthContext` on your request / tRPC context.

## Errors

Use `AuthError` from `packages/auth/guards.ts` with codes `UNAUTHENTICATED`, `FORBIDDEN`, `COMPANY_SCOPE_DENIED`, `RECORD_SCOPE_DENIED`. Map them to `401` / `403` (or tRPC `UNAUTHORIZED` / `FORBIDDEN`) at the server boundary.

## Audit hook points

Role assignment and removal should go through a service that calls `emitUserRoleAssigned` / `emitUserRoleRemoved` (or `RoleAuditSink.log` directly) so audit integration stays centralized. See `packages/auth/audit-hooks.ts`.
