Status: READY_FOR_AI
Priority: P0

# Add registry-to-test coverage integrity checks for protected handlers

## Objective
Detect drift between the API contract registry and the actual handler contract assets so every registered protected handler is backed by the expected fixture and governance coverage.

## Scope
- registry-to-fixture consistency checks
- registry coverage flag validation
- missing asset detection
- docs for contract-governance integrity automation-lite

## Acceptance Criteria
- tests verify every registered handler points to an existing contract fixture
- tests verify fixture entries remain unique
- tests verify registry coverage flags remain truthful and complete
- docs created:
  - docs/testing/REGISTRY_TO_TEST_COVERAGE_PATTERN.md
