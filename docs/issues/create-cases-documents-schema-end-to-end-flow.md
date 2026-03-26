Status: READY_FOR_AI
Priority: P0

# Create cases and documents schema and wire first end-to-end protected flow

## Objective

Create the first real cases and documents tables, then wire one true end-to-end protected flow using the new repositories, guards, tenant-scope rules, and error mapping.

## Scope

- cases table migration
- documents table migration
- indexes for tenant-scoped access
- basic status constraints
- first end-to-end protected case read flow
- first end-to-end protected document status update flow
- route/procedure integration using repository implementations
- initial end-to-end flow test matrix

## Acceptance Criteria

- cases schema exists
- documents schema exists
- tenant-scoped indexes exist
- repository implementations can operate against real tables
- one real case read path is wired end to end
- one real document status update path is wired end to end
- docs created:
  - docs/architecture/FIRST_END_TO_END_FLOW.md
  - docs/testing/FIRST_END_TO_END_FLOW_TEST_MATRIX.md
