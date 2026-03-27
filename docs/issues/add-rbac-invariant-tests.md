Status: READY_FOR_AI
Priority: P0

# Add RBAC invariant tests and seed validation checks

## Objective
Verify that SmartPRO’s RBAC seed data, permission catalog, role scope definitions, and role-permission mappings remain aligned with the documented authorization model.

## Scope
- RBAC invariant integration tests
- seed validation checks
- permission catalog consistency checks
- role scope mapping verification
- docs for RBAC invariant testing pattern

## Acceptance Criteria
- tests verify expected system roles exist
- tests verify expected permissions exist
- tests verify platform vs company role scopes
- tests verify critical role-permission mappings
- docs created:
  - docs/testing/RBAC_INVARIANT_TEST_PATTERN.md
