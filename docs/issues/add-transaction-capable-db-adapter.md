Status: READY_FOR_AI
Priority: P0

# Add transaction-capable DB adapter and make role assignment plus audit persistence atomic

## Objective
Introduce transaction support into the database adapter and use it to make role assignment plus audit event persistence succeed or fail together.

## Scope
- extend DB adapter with transaction support
- define transaction client contract
- implement transactional user role repository contract
- implement transactional audit repository usage
- add atomic admin role assignment flow
- document transaction rules
- define transaction integration test matrix

## Acceptance Criteria
- DB adapter supports transactions
- role assignment + audit write run in one transaction
- partial success is not possible
- transaction boundaries are explicit in service/action layer
- docs created:
  - docs/architecture/TRANSACTION_PATTERN.md
  - docs/testing/TRANSACTIONAL_FLOW_TEST_MATRIX.md
