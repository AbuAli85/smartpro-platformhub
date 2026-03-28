Status: IN_PROGRESS
Priority: P0

# Protected handlers for service requests — CRUD and status transitions (Module 1)

ai-role: backend

## Promotion

**Unblocked:** `module-01-add-service-requests-table-and-repository.md` is **`DONE`** (Verify on PR #12, run `23683511138`). This issue is **`READY_FOR_AI`** for execution.

## Objective

Expose **ServiceRequest** through protected API handlers with auth, RBAC (`service_requests:create|read|update`), tenant scope, and stable `{ status, data | error }` contracts.

## Scope

- Handlers (names to align with existing handler layout): e.g. create draft, get by id, list for company, update status with **allowed transition matrix** (start minimal: draft→submitted; submitted→withdrawn/cancelled; block invalid jumps).
- Use existing guard helpers and error mapping patterns from current protected handlers.
- Enroll new handlers in contract governance: `API_CONTRACT_REGISTRY`, fixtures, integrity tests per `PROTECTED_HANDLER_GOVERNANCE_ARCHITECTURE.md`.

## Dependencies

- Repository + migration from `module-01-add-service-requests-table-and-repository.md` — **satisfied** (issue **`DONE`**, Verify green on PR #12).

## Acceptance Criteria

- All new mutating paths permission-checked and company-scoped.
- Contract tests + registry coverage for each published handler.
- `npm run verify` passes.

## References

- `docs/architecture/MODULE_01_BOOKING_SERVICE_REQUEST_LIFECYCLE.md`
- `docs/testing/PROTECTED_HANDLER_GOVERNANCE_INDEX.md`

## Likely touch points (execution prep)

Mirror existing protected handlers under `packages/server/cases/` and `packages/server/documents/`:

- **Handlers + core logic:** new `packages/server/service-requests/*.ts` (e.g. create draft, get by id, list by company, update status) using `createServiceRequestsRepositoryImpl` / `ServiceRequestsRepository` from `packages/data/`.
- **Permissions:** `packages/auth/permissions.ts` — `service_requests:create|read|update` (already defined; wire in guards like other handlers).
- **Contract governance (update together):**
  - `tests/integration/helpers/api-contract-registry.ts`
  - `tests/integration/helpers/handler-contract-fixtures.ts`
  - `tests/integration/helpers/protected-handler-inventory.ts`, `governance-assets.ts`, `governed-handler-doc-expectations.ts`, `protected-handler-candidates.ts`, `governance-policy-expectations.ts` (per existing patterns for governed handlers)
  - New `tests/integration/handlers/*.service-request*.integration.test.ts` files following `get-case-by-id.handler.integration.test.ts` and the contract suites (`handler-result-contract`, `handler-error-semantics`, `handler-success-payload`, `response-boundary-hygiene`, `handler-contract-fixtures`).
- **Examples (if repo uses them):** `packages/server/examples/` — add parity examples for new handlers.
