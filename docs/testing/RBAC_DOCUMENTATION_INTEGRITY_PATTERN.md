# RBAC Documentation Integrity Pattern

## Purpose
Defines how SmartPRO verifies that RBAC documentation stays aligned with seeded roles, scopes, and critical documented mappings.

## Required Coverage
1. documented role names match seeded role names
2. documented role scopes match seeded scopes
3. documented critical role-permission expectations match seeded mappings

## Principles
- RBAC documentation is part of the operating contract
- documentation drift must fail verification
- critical mappings should remain explicit and reviewable
- tests should use controlled documented expectations rather than fragile markdown parsing in the first stage

## Implementation
- Expectations live in `tests/integration/helpers/rbac-doc-expectations.ts` and should stay in sync with `docs/architecture/RBAC_MODEL.md`.
- `tests/integration/rbac/rbac-documentation.integrity.integration.test.ts` compares those expectations to `public.roles` and `role_permissions` after `database/seeds/rbac_seed.sql`.
