Status: READY_FOR_AI
Priority: P0

# Add audit action catalog integrity checks

## Objective
Verify that SmartPRO’s documented audit action names, runtime audit action usage, and persisted audit expectations remain aligned so audit logging stays stable and machine-readable.

## Scope
- documented audit action expectation source
- audit action integrity tests
- runtime action name consistency checks
- persisted audit expectation checks for critical admin flows
- docs for audit action catalog integrity

## Acceptance Criteria
- tests verify documented audit action names align with runtime expectations
- tests verify critical admin/runtime flows use expected action names
- tests verify persisted audit rows use expected action names where applicable
- docs created:
  - docs/testing/AUDIT_ACTION_CATALOG_INTEGRITY_PATTERN.md
