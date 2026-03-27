Status: READY_FOR_AI
Priority: P0

# Turn integration test scaffolds into real seeded executable tests

## Objective
Replace the current placeholder integration tests with real database-backed tests that seed fixtures, execute repository and transactional flows, and assert actual outcomes.

## Scope
- test fixture helpers
- seed helpers for users, companies, roles, permissions, user_roles, cases, documents, audit_events
- real audit repository integration test
- real cases repository integration test
- real documents repository integration test
- real transactional role assignment integration test
- rollback verification for transaction failure
- docs for fixture and seeding pattern

## Acceptance Criteria
- integration tests no longer use placeholder assertions
- tests seed only the minimum required records
- tests assert DB state directly
- transactional rollback test proves no partial writes remain
- docs created:
  - docs/testing/FIXTURE_AND_SEEDING_PATTERN.md
  - docs/testing/EXECUTABLE_INTEGRATION_SUITE.md
