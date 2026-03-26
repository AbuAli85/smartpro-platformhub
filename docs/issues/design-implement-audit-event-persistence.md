Status: READY_FOR_AI
Priority: P0

# Design and implement audit event persistence

## Objective

Create the first real audit persistence layer for SmartPRO so privileged and sensitive actions are stored durably and can be queried consistently.

## Scope

- audit_events table migration
- audit repository contract
- audit service implementation
- role assignment audit persistence
- protected admin action integration
- initial audit integration test matrix
- architecture doc for audit logging pattern

## Acceptance Criteria

- audit_events schema exists
- audit repository exists
- audit service persists records
- admin role assignment writes audit event
- audit payload supports actor, action, entity, scope, before/after, metadata
- docs created:
  - docs/architecture/AUDIT_LOGGING_PATTERN.md
  - docs/testing/AUDIT_EVENT_TEST_MATRIX.md
