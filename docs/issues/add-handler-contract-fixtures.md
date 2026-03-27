Status: READY_FOR_AI
Priority: P0

# Add stable handler contract fixtures and boundary snapshot-style verification

## Objective
Lock the SmartPRO handler boundary contract more tightly by introducing stable contract fixtures for representative success and failure responses without relying on brittle full-output snapshots.

## Scope
- stable contract fixtures for protected handlers
- fixture-style verification for success responses
- fixture-style verification for failure responses
- contract-locking rules documentation

## Acceptance Criteria
- tests verify representative handler responses against stable boundary fixtures
- fixtures cover both success and failure shapes
- fixtures stay explicit and reviewable
- docs created:
  - docs/testing/HANDLER_CONTRACT_FIXTURE_PATTERN.md
