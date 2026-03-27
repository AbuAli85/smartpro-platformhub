Status: READY_FOR_AI
Priority: P0

# Add permission catalog drift detection and authorization model integrity checks

## Objective
Detect drift between SmartPRO permission constants, RBAC seed data, and documented authorization expectations so permission changes cannot silently diverge across code, database, and docs.

## Scope
- constants-to-seed consistency checks
- orphan permission detection
- duplicate permission detection
- missing permission detection
- docs for authorization model integrity

## Acceptance Criteria
- tests verify permission constants align with seeded permissions
- tests detect missing seeded permissions
- tests detect orphan seeded permissions not present in constants
- docs created:
  - docs/testing/PERMISSION_CATALOG_INTEGRITY_PATTERN.md
