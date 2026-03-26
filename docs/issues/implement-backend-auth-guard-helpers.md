# Implement backend auth and permission guard helpers

**Status:** Ready for AI

## Objective

Implement backend authorization primitives for SmartPRO so APIs can enforce authentication, permissions, company scope, and consistent error handling.

## Scope

- auth context shape
- auth context resolver
- permission guard helpers
- company scope guard helpers
- platform-role override rules
- consistent auth error semantics
- audit hook points for role-sensitive actions

## Acceptance Criteria

- auth context is resolved in one place
- permission checks are centralized
- company scope checks are centralized
- platform override behavior is explicit
- protected route/procedure pattern is documented
- role assignment actions expose audit hook integration points

## Output

- `packages/auth/auth-context.ts`
- `packages/auth/guards.ts`
- `docs/architecture/AUTHORIZATION_FLOW.md`
- optional server helper example for tRPC or route handlers

## Review checklist

- auth context is built centrally
- permission checks are not duplicated ad hoc
- company scope checks are reusable
- record scope verification exists for tenant records
- platform override is explicit, not hidden
- errors are typed and consistent
- privileged actions have audit hook points

## Follow-up issue (after this)

**Implement tenant-scoped repository and API protection pattern** — standardize safe queries for cases, documents, and service requests.
