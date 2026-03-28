Status: DRAFT
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

## Dependencies

- `module-01-add-service-requests-table-and-repository.md`
- Prefer coordination with `module-01-protected-handlers-service-requests.md` for where conversion is triggered.

## Acceptance Criteria

- Schema and repositories consistent; existing tests updated.
- Illegal conversions rejected with stable error semantics.
- `npm run verify` passes.

## References

- `docs/core/DOMAIN_MODEL.md` (Case.serviceRequestId, ServiceRequest `converted_to_case`)
- `docs/architecture/MODULE_01_BOOKING_SERVICE_REQUEST_LIFECYCLE.md`
