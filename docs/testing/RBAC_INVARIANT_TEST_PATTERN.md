# RBAC Invariant Test Pattern

## Purpose
Defines how SmartPRO verifies that RBAC seed data remains aligned with the documented authorization model.

## Required Coverage
1. required system roles exist
2. required critical permissions exist
3. expected role scopes are correct
4. critical role-permission mappings are present
5. lower-privilege roles do not receive forbidden high-privilege permissions

## Principles
- invariant tests validate the authorization foundation, not only runtime behavior
- tests should run against seeded RBAC state
- critical permissions and mappings should be explicit and reviewable
- seed drift must fail verification

## Setup
- Truncate known tables (including `roles`, `permissions`, `role_permissions`), then apply `database/seeds/rbac_seed.sql` via `tests/integration/helpers/seed-rbac.ts`.

## See also
- `database/seeds/rbac_seed.sql` — source of truth for role/permission mappings
- `docs/architecture/RBAC_MODEL.md` — documented authorization model
