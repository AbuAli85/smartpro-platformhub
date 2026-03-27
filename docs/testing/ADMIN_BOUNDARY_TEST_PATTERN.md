# Admin Boundary Test Pattern

## Purpose
Defines how SmartPRO tests privileged admin actions for boundary safety, scope invariants, and audit integrity.

## Required Coverage
1. unauthenticated caller rejected
2. missing required platform permission rejected
3. company-scoped permission does not satisfy platform-only admin action
4. invalid role scope combinations rejected
5. successful privileged action persists audit event

## Principles
- admin tests must verify both authorization and invariants
- transactional admin flows must leave no partial writes on failure
- successful admin actions must verify audit persistence
- platform vs company scope distinctions must be tested explicitly

## Role assignment specifics
- `assignUserRoleTransactional` requires **platform** `roles:manage` (membership-only `roles:manage` is not sufficient).
- Company-scoped roles require a non-null `company_id`; platform-scoped roles require a null `company_id` (enforced before insert and aligned with the database trigger).

## Implementation notes
- Invalid scope combinations return **`400`** with code **`INVALID_ROLE_SCOPE`** via `RoleScopeInvariantError` mapping.
- Failed attempts must show **no** `user_roles` row and **no** `user_role.assigned` audit event for the attempted operation.
