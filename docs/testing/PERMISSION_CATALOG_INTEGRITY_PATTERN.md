# Permission Catalog Integrity Pattern

## Purpose
Defines how SmartPRO verifies that permission constants and seeded permission data remain aligned.

## Integrity Goals
- every runtime permission constant exists in seeded DB permissions
- every seeded DB permission is represented in runtime constants
- permission identifiers remain unique
- authorization drift fails verification early

## Required Coverage
1. constants-to-seed equality
2. no orphan seeded permissions
3. no duplicate permission constants
4. no missing critical permissions (enforced by full catalog equality)

## Principles
- permission names are part of the authorization contract
- drift between code and seed data must fail verification
- permission changes should be intentional and reviewable

## Implementation
- `tests/integration/rbac/permission-catalog.integrity.integration.test.ts` compares `Object.values(PERMISSIONS)` to `public.permissions` after `database/seeds/rbac_seed.sql`.
- Source of truth in code: `packages/auth/permissions.ts`
- Source of truth in data: `database/seeds/rbac_seed.sql` (must stay in lockstep)
