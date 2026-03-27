Status: READY_FOR_AI
Priority: P0

# Add migration state tracking and make migration runner rerun-safe

## Objective
Introduce migration state tracking so SmartPRO can safely record which migrations were applied, skip already-applied migrations, and make the migration runner rerun-safe for local and CI verification.

## Scope
- migration state table
- migration runner update
- applied-migration recording
- skip logic for previously applied migrations
- deterministic failure behavior
- docs for migration state and rerun rules

## Acceptance Criteria
- migration state table exists
- runner creates/uses migration tracking state
- already-applied migrations are skipped
- failed migrations do not get recorded as applied
- docs created:
  - docs/architecture/MIGRATION_STATE_PATTERN.md
  - docs/testing/MIGRATION_RERUN_RULES.md
