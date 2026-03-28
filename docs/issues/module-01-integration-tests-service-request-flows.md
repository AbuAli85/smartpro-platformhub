Status: DRAFT
Priority: P1

# Integration tests for service request lifecycle flows (Module 1)

ai-role: qa

## Objective

Prove **ServiceRequest** lifecycle behavior end-to-end against Postgres: happy paths, tenant isolation, and invalid transition rejection, including **convert-to-case** once implemented.

## Scope

- Add or extend DB-backed integration tests (follow patterns in `tests/integration/handlers/` and transactional tests).
- Cover at minimum: create draft → submit → cannot read cross-tenant; invalid status transition returns governed error shape.
- After case linkage exists: request → case conversion preserves tenant scope and sets request status correctly.

## Dependencies

- Backend handlers from `module-01-protected-handlers-service-requests.md`
- Case linkage from `module-01-link-cases-to-service-requests.md` for conversion scenarios

## Acceptance Criteria

- Tests are deterministic and use existing test DB helpers.
- `npm run verify` passes.

## References

- `docs/architecture/MODULE_01_ISSUE_EXECUTION_TREE.md`
- `docs/testing/DB_INTEGRATION_TEST_SETUP.md` (if applicable)
