Status: DRAFT
Priority: P0

# Protected handlers for service requests — CRUD and status transitions (Module 1)

ai-role: backend

## Objective

Expose **ServiceRequest** through protected API handlers with auth, RBAC (`service_requests:create|read|update`), tenant scope, and stable `{ status, data | error }` contracts.

## Scope

- Handlers (names to align with existing handler layout): e.g. create draft, get by id, list for company, update status with **allowed transition matrix** (start minimal: draft→submitted; submitted→withdrawn/cancelled; block invalid jumps).
- Use existing guard helpers and error mapping patterns from current protected handlers.
- Enroll new handlers in contract governance: `API_CONTRACT_REGISTRY`, fixtures, integrity tests per `PROTECTED_HANDLER_GOVERNANCE_ARCHITECTURE.md`.

## Dependencies

- Complete `module-01-add-service-requests-table-and-repository.md` first.

## Acceptance Criteria

- All new mutating paths permission-checked and company-scoped.
- Contract tests + registry coverage for each published handler.
- `npm run verify` passes.

## References

- `docs/architecture/MODULE_01_BOOKING_SERVICE_REQUEST_LIFECYCLE.md`
- `docs/testing/PROTECTED_HANDLER_GOVERNANCE_INDEX.md`
