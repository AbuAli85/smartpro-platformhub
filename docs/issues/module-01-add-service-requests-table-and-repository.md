Status: IN_PROGRESS
Priority: P0

# Add service_requests table and tenant-scoped repository (Module 1)

ai-role: backend

## Objective

Introduce persistent **ServiceRequest** storage aligned with `docs/core/DOMAIN_MODEL.md`, closing the gap where RBAC already defines `service_requests:*` permissions but no table exists.

## Scope

- New migration under `database/migrations/` (e.g. follow-on after `20260327_005_*`) creating `public.service_requests` with:
  - `company_id` → `public.companies(id)`
  - `service_id` `text not null` (consistent with `public.cases.service_id`)
  - `requested_by_user_id` → `public.users(id)`
  - `status` with CHECK constraint: `draft`, `submitted`, `withdrawn`, `converted_to_case`, `cancelled`
  - `submitted_at timestamptz` nullable
  - `created_at`, `updated_at` with `set_updated_at` trigger pattern used by `cases` / `documents`
  - indexes: `company_id`, `(company_id, status)`, `created_at desc`
- New `packages/data` types: `ServiceRequestRecord`, repository interface, and **Postgres implementation** mirroring `cases-repository` / `cases-repository.impl.ts` patterns (explicit `companyId` on every method).
- Wire factory in the same style as existing repositories (follow how `createCasesRepositoryImpl` is used in handlers/tests).

## Acceptance Criteria

- Migration applies cleanly via existing migration runner.
- Repository methods (minimum): `insert`, `getByIdInCompany`, `listByCompany` (bounded limit), `updateStatusInCompany` (or equivalent atomic status update) — all tenant-scoped.
- Integration tests prove tenant isolation (cannot read another company’s row by id).
- `npm run verify` passes.

## References

- `docs/architecture/MODULE_01_BOOKING_SERVICE_REQUEST_LIFECYCLE.md`
- `docs/architecture/MODULE_01_ISSUE_EXECUTION_TREE.md`
- `docs/core/DOMAIN_MODEL.md` (ServiceRequest)

## Implementation status (repo)

Landed in workspace:

- `database/migrations/20260327_006_service_requests.sql`
- `packages/data/service-requests-repository.ts`
- `packages/data/service-requests-repository.impl.ts`
- `tests/integration/service-requests-repository.integration.test.ts`
- `tests/integration/helpers/seed-fixtures.ts` (`seedServiceRequest`)
- `tests/integration/helpers/test-db.ts` and `scripts/reset-test-db.ts` (truncate `service_requests`)

**Formal completion:** set `Status: DONE` after `npm run verify` passes with `DATABASE_URL` configured (migration + integration tests).
