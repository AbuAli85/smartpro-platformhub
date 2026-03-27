Status: READY_FOR_AI
Priority: P0

# Add protected API handler integration tests with auth, RBAC, and tenant enforcement

## Objective
Extend the integration test suite to cover protected server handlers with full auth, RBAC, and tenant isolation enforcement.

## Scope
- handler-level integration tests (not just repositories)
- auth enforcement (401)
- permission enforcement (403)
- tenant isolation (404 vs forbidden)
- success path validation for protected handlers
- shared test helpers for auth contexts
- docs for protected handler testing pattern

## Acceptance Criteria
- protected handlers are tested end-to-end
- tests assert:
  - unauthorized access → 401
  - missing permission → 403
  - cross-tenant access → 404 (or enforced rule)
  - valid access → success result
- reusable auth context test helpers exist
- docs created:
  - docs/testing/PROTECTED_HANDLER_TEST_PATTERN.md
