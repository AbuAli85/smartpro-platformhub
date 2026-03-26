# Create first real repositories and protected endpoints for cases and documents

**Status:** Ready for AI

## Objective

Replace example-only protection patterns with real repository scaffolds and first protected backend surfaces for cases and documents.

## Scope

- real case repository scaffold
- real document repository scaffold
- first protected case read endpoint/procedure
- first protected document status update endpoint/procedure
- consistent error mapping for auth and tenant-scope failures
- initial integration test matrix for these surfaces

## Acceptance Criteria

- repository files exist for cases and documents
- repositories expose tenant-scoped methods
- one protected case read surface exists
- one protected document status update surface exists
- auth and tenant errors map consistently
- initial integration test plan is documented
- files created:
  - packages/data/cases-repository.ts
  - packages/data/documents-repository.ts
  - packages/server/cases/
  - packages/server/documents/
  - docs/testing/FIRST_PROTECTED_API_TEST_MATRIX.md
