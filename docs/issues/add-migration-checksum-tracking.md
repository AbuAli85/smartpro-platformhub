Status: READY_FOR_AI
Priority: P0

# Add migration checksum tracking and immutable migration verification

## Objective
Protect SmartPRO from modified historical migration files by recording migration checksums and verifying that already-applied migrations have not changed.

## Scope
- checksum column for migration state
- checksum calculation in migration runner
- verification of applied migration file integrity
- failure on checksum mismatch
- docs for immutable migration rules and checksum behavior

## Acceptance Criteria
- schema_migrations stores checksum
- migration runner calculates checksum for each file
- applied migrations are verified against stored checksum
- checksum mismatch fails clearly
- docs created:
  - docs/architecture/MIGRATION_CHECKSUM_PATTERN.md
  - docs/testing/MIGRATION_IMMUTABILITY_RULES.md
