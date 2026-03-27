Status: READY_FOR_AI
Priority: P0

# Implement real Postgres adapter and first DB-backed integration tests

## Objective
Implement a real Postgres-backed DB adapter for SmartPRO and use it to run the first repository and transactional integration tests against an actual database.

## Scope
- Postgres adapter implementation
- transaction implementation
- database config/loading pattern
- test database setup guidance
- first integration tests for audit, cases, documents, and transactional role assignment
- migration runner strategy doc
- test execution doc

## Acceptance Criteria
- real Postgres adapter exists
- adapter supports query and transaction
- repositories can run against the adapter
- first DB-backed integration test files exist
- transactional role assignment flow is testable against real DB
- docs created:
  - docs/architecture/POSTGRES_ADAPTER_PATTERN.md
  - docs/testing/DB_INTEGRATION_TEST_SETUP.md
