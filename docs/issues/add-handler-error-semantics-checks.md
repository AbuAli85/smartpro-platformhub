Status: READY_FOR_AI
Priority: P0

# Add protected handler error-code consistency checks

## Objective
Verify that SmartPRO protected handlers keep stable error semantics, including status/code mappings for authentication, authorization, tenant scope, missing records, and role-scope invariant failures.

## Scope
- handler error-code integration tests
- 401 / 403 / 404 / 400 mapping checks
- code-to-status consistency checks
- docs for protected handler error semantics

## Acceptance Criteria
- tests verify unauthenticated errors map to 401 with expected code
- tests verify missing-permission errors map to 403 with expected code
- tests verify tenant-scope denial behavior remains stable
- tests verify missing-record behavior remains stable
- tests verify invalid role-scope behavior maps to 400 with expected code
- docs created:
  - docs/testing/HANDLER_ERROR_SEMANTICS_PATTERN.md
