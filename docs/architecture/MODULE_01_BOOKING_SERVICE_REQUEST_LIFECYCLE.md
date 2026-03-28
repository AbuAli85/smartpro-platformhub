# Module 1 — Booking / Service Request Lifecycle

## Purpose

This document is the **architecture breakdown** for the first product module in `SMARTPRO_MODULE_BUILD_ROADMAP.md`: the path from **intent to book a service** through **structured request state** and into the existing **case** delivery record.

It aligns product language (“booking”, “service request”) with the canonical domain in `docs/core/DOMAIN_MODEL.md`.

---

## 1. Relationship to the domain model

| Concept | Domain entity | Notes |
|---------|----------------|--------|
| User submits interest in a service | **ServiceRequest** | Pre-case workflow; permissions already exist (`service_requests:*` in RBAC seed). |
| Operational delivery record | **Case** | Already persisted (`public.cases`); status machine matches case lifecycle. |
| Link between them | `Case.serviceRequestId` (domain) | **Not yet in schema** — add after `service_requests` exists. |

Today’s repo:

- **Cases** and **documents** are real tables and repositories; **ServiceRequest** is specified in the domain doc but **not** yet a table.
- RBAC already anticipates service requests; implementation should close that gap.

---

## 2. MVP scope (Module 1, first vertical)

**In scope for the first slices**

1. **Persist ServiceRequest** — `service_requests` table, tenant-scoped indexes, repository in `packages/data`, integration tests.
2. **Protected handlers** — create (draft), read by id, list by company, update status (e.g. draft → submitted, submitted → withdrawn/cancelled as allowed by rules).
3. **Permission enforcement** — use existing `service_requests:create|read|update` names; align with `docs/architecture/RBAC_MODEL.md`.
4. **Transition validation** — server-side allowed transitions only (start with a small explicit matrix; expand later).
5. **Case linkage (follow-up slice)** — nullable `service_request_id` on `cases` (or equivalent) and “convert to case” transition when product approves.

**Explicitly later (not blocking first vertical)**

- Provider assignment, SLA timers, workflow templates (`WorkflowTemplate` / `WorkflowRun` in domain doc).
- Payments (Module 5).
- Full frontend app (add issues when a UI package exists); until then, API-first is sufficient for factory proof.

---

## 3. Status model (ServiceRequest)

Aligned with `DOMAIN_MODEL.md` **candidate** statuses:

- `draft`
- `submitted`
- `withdrawn`
- `converted_to_case`
- `cancelled`

Implement with a **CHECK** constraint in SQL and mirrored validation in handlers.

---

## 4. Security and governance

- Every query and mutation must scope by **company_id** (tenant), consistent with `TENANT_ISOLATION_MODEL.md`.
- Mutating handlers are **protected**: auth guards, permission checks, contract tests, registry entries per `PROTECTED_HANDLER_GOVERNANCE_ARCHITECTURE.md`.
- Material transitions should emit **audit events** once the pattern for this entity is agreed (may be a dedicated slice after CRUD exists).

---

## 5. Slicing strategy (vertical)

| Slice | Outcome |
|-------|---------|
| A | Table + repository + DB tests |
| B | Handlers + RBAC + contract/registry |
| C | Case FK + convert-to-case transition |
| D | Audit on transitions |
| E | Docs + domain doc alignment |

Execute **A → B** before **C** unless Architect approves parallel doc work.

---

## 6. Verification

Each merged slice must leave **`npm run verify`** green. New handlers must follow autogeneration expectations in `ISSUE_AUTOGENERATION_RULES.md` (tests, registry, docs).

---

## 7. Issue queue

The sequenced **issue tree and role tags** live in:

- `docs/architecture/MODULE_01_ISSUE_EXECUTION_TREE.md`

Draft files under `docs/issues/module-01-*.md` match that tree.

---

## 8. Summary

Module 1 grounds “booking” in **ServiceRequest** persistence and APIs, then links to **Case** for delivery. The factory executes it slice by slice with the same verification and protected-handler governance already in the repo.
