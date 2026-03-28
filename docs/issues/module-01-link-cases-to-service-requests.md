Status: READY_FOR_AI
Priority: P0

# Link cases to service requests and support convert-to-case (Module 1)

ai-role: backend

## Objective

Align the database and domain with `DOMAIN_MODEL.md`: a **Case** may reference a **ServiceRequest** (`serviceRequestId`), and a controlled transition marks the request `converted_to_case` when a case is created from it.

## Scope

- Migration: add nullable `service_request_id uuid` to `public.cases` referencing `public.service_requests(id)` (or equivalent FK strategy); unique partial index if one case per request is required.
- Update `CaseRecord`, repositories, and existing case handlers/tests only as needed for backward compatibility (null FK for existing rows).
- Implement “create case from service request” flow (or minimal transition + case insert) with validation: request must be in an eligible status, same `company_id`, same `service_id` where applicable.
- Update audit strategy if case creation from request is considered material (may coordinate with a separate audit-focused issue).

## Implementation decisions (tight prep — execute in this slice)

- **FK:** `public.cases.service_request_id` → `public.service_requests(id)`. Prefer **`ON DELETE RESTRICT`** so a service request row cannot be removed while a case still references it. Keep **`NULL`** for all existing and manually created cases.
- **One conversion per request:** Add a **partial unique index** on `cases(service_request_id)` **WHERE service_request_id IS NOT NULL** so at most one case may claim a given request.
- **Eligible request status:** Only **`submitted`** requests may convert (aligns with “intake complete” before delivery record). After success: set request **`converted_to_case`** in the **same transaction** as case insert (or fail both).
- **Consistency checks:** `cases.company_id` = `service_requests.company_id`; `cases.service_id` = `service_requests.service_id` for the convert path.
- **Permissions:** Protected entry point should require **`cases:create`** and **`service_requests:update`** for the company (or a single handler that enforces both explicitly).
- **Audit:** If persistence exists for case creation in-repo, emit or extend an audit event for “case created from service request”; otherwise add a **TODO** pointer to `design-implement-audit-event-persistence` / Module 1 audit slice — do not silently skip if the repo already audits case mutations.
- **Error semantics:** Reuse stable patterns (`RECORD_NOT_FOUND`, `INVALID_*` or domain-specific code) for: wrong status, already converted, FK/unique violation, tenant mismatch — map via `mapAuthRelatedError` / existing helpers.

## Dependencies

- `module-01-add-service-requests-table-and-repository.md` — **DONE**
- `module-01-protected-handlers-service-requests.md` — **DONE** (Verify run **`23683896247`**). Conversion may be a **new** protected handler or an extension of case-creation logic; keep governance/registry in sync if a new boundary is published.

## Acceptance Criteria

- Schema and repositories consistent; existing tests updated.
- Illegal conversions rejected with stable error semantics.
- `npm run verify` passes.

## References

- `docs/core/DOMAIN_MODEL.md` (Case.serviceRequestId, ServiceRequest `converted_to_case`)
- `docs/architecture/MODULE_01_BOOKING_SERVICE_REQUEST_LIFECYCLE.md`
