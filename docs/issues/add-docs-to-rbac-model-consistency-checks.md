Status: READY_FOR_AI
Priority: P0

# Add docs-to-RBAC-model consistency checks

## Objective
Verify that SmartPRO’s RBAC documentation stays aligned with seeded roles, role scopes, and critical documented role-permission expectations.

## Scope
- RBAC model doc parsing or controlled expectation extraction
- role-name consistency checks
- role-scope consistency checks
- documented critical mapping checks
- docs integrity pattern doc

## Acceptance Criteria
- tests verify documented role names align with seeded roles
- tests verify documented role scopes align with seeded scopes
- tests verify documented critical mappings align with seeded mappings
- docs created:
  - docs/testing/RBAC_DOCUMENTATION_INTEGRITY_PATTERN.md
