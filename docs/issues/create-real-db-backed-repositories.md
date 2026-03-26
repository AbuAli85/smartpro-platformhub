# Create real database-backed repository implementations for cases, documents, and audit events

**Status:** Ready for AI

## Objective

Replace repository stubs with real database-backed implementations for cases, documents, and audit events, and define the adapter pattern SmartPRO will use for data access.

## Scope

- DB adapter interface
- real audit repository implementation
- real cases repository implementation
- real documents repository implementation
- row-to-domain mapping
- transaction guidance for protected flows
- repository implementation architecture doc
- repository integration test matrix

## Acceptance Criteria

- repository adapter contract exists
- audit repository can persist audit_events
- cases repository supports tenant-scoped read/update methods
- documents repository supports tenant-scoped read/update methods
- DB-to-domain mapping is explicit
- docs created:
  - docs/architecture/REPOSITORY_IMPLEMENTATION_PATTERN.md
  - docs/testing/REPOSITORY_INTEGRATION_TEST_MATRIX.md

## Note

Role assignment plus audit persistence should become transactional once the real DB adapter supports transactions.

Implementations assume `public.cases` and `public.documents` exist; add migrations in a follow-up if those tables are not yet in the database.
