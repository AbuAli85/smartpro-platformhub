# Module 1 — Issue execution tree

## Purpose

Ordered **AI-ready work** for Module 1 (booking / service request lifecycle), with **primary role** routing compatible with `AI_EXECUTION_LOOP.md` (use GitHub labels `ai-role:*` when issues are published).

**Architecture reference:** `docs/architecture/MODULE_01_BOOKING_SERVICE_REQUEST_LIFECYCLE.md`

---

## Execution order

| # | Issue file (draft) | Primary role | Initial Status | Dependency |
|---|-------------------|---------------|----------------|------------|
| 1 | `module-01-add-service-requests-table-and-repository.md` | Backend | **DONE** (closed with PR #12 Verify run `23683511138`) | none |
| 2 | `module-01-docs-align-service-request-lifecycle.md` | Docs | **DONE** (same verify run as #1) | none (can parallel #1) |
| 3 | `module-01-protected-handlers-service-requests.md` | Backend | **READY_FOR_AI** | after #1 + #2 verified (met) |
| 4 | `module-01-link-cases-to-service-requests.md` | Backend | DRAFT | after #1; coordinates with #3 |
| 5 | `module-01-integration-tests-service-request-flows.md` | QA | DRAFT | after #3 (expand as handlers land) |

**Promotion rule:** Slice *n* is **operationally complete** only when **`npm run verify` passes** (not merely when code is pushed). Then set slice *n+1* from **DRAFT** to **READY_FOR_AI** in `docs/issues/` (or update GitHub labels). **Implementation without a green verify is not a closed slice.**

**Authoritative gate:** Prefer **GitHub Actions** `.github/workflows/verify.yml` (`verify:ci`) as the shared proof when available. Local `npm run verify` with a Postgres-backed `DATABASE_URL` is equivalent.

**Slices #1 and #2 together:** Backend slice **#1** and docs slice **#2** may both move to **`DONE`** after the **same** green verify run, when docs are already aligned and no docs-only failure applies—one gate, one transition decision for both, then promote **#3** to **`READY_FOR_AI`**.

---

## Autogeneration hints

After **#3** merges:

- Spawn or enable contract-test / registry issues per `ISSUE_AUTOGENERATION_RULES.md` if not already covered inside #3 acceptance criteria.

After **#4** merges:

- Migration checksum discipline applies; update any operator docs if recovery behavior changes.

---

## Frontend (deferred)

When a frontend package exists, add issues:

- `ai-role:frontend` — list/create/detail screens for ServiceRequest; loading/empty/error states.
- `ai-role:qa` — E2E or API consumer tests as appropriate.

---

## Module completion checkpoint (MVP)

Module 1 MVP for the factory is met when:

- Service requests are persisted and exposed through **protected** handlers with **contract governance**.
- At least one **convert-to-case** path exists **or** is explicitly deferred with Architect approval (prefer implement #4 for alignment with `DOMAIN_MODEL.md`).
- `npm run verify` passes and domain/architecture docs match behavior.

Architect may tighten or relax the checkpoint in a published decision.
