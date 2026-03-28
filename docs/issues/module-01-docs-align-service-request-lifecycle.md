Status: DONE
Priority: P0

# Align domain and architecture docs for ServiceRequest lifecycle (Module 1)

ai-role: docs

## Objective

Make **ServiceRequest** and Module 1 slices discoverable from existing architecture and domain documentation so Backend/QA agents do not rely on chat context.

## Scope

- Update `docs/core/DOMAIN_MODEL.md` only if needed to match **implemented** statuses and fields after table design (or add a short “Implementation status” note pointing to Module 1 arch doc until code lands).
- Confirm `docs/architecture/SMARTPRO_MODULE_BUILD_ROADMAP.md` Module 1 links to the execution pack (add or adjust if anything drifted).
- Optionally add a one-line pointer in `docs/architecture/TENANT_ISOLATION_MODEL.md` if `service_requests` tenant rules should be listed alongside cases (only if consistent with actual schema).

## Acceptance Criteria

- Module 1 is reachable from the roadmap without hunting.
- Domain doc does not contradict the migration + repository issue once both exist (coordinate wording with `module-01-add-service-requests-table-and-repository.md` if merged first).
- `npm run verify` passes (doc-only changes should still pass).

## References

- `docs/architecture/MODULE_01_BOOKING_SERVICE_REQUEST_LIFECYCLE.md`
- `docs/architecture/MODULE_01_ISSUE_EXECUTION_TREE.md`

## Verification note

Same authoritative gate as slice #1: GitHub Actions Verify on PR #12 (run `23683511138`) — `verify:ci` green with Postgres; docs slice closed jointly per `MODULE_01_ISSUE_EXECUTION_TREE.md`.
