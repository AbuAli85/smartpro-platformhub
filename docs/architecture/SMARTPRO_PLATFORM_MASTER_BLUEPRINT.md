# SmartPRO platform master blueprint

This document is the **control-plane index** for building SmartPRO toward **minimal human touch** without losing consistency. It encodes six cooperating systems, the **two-repo split**, and what must be **enforced** (not only documented).

**Operating principle:** humans own **policy and exceptions**; the platform owns **execution, consistency, and follow-up**.

---

## 1. Six systems (control layer between them)

| # | System | Role | Primary home |
|---|--------|------|----------------|
| 1 | **Product** | Scope, journeys, definition of done, module boundaries | Constitution + domain docs; product issues |
| 2 | **Platform / architecture** | Boundaries, data model, integration contracts | `docs/core`, `docs/architecture` |
| 3 | **Automation** | CI, agents, webhooks, scheduled work, orchestration | GitHub Actions, Cursor automations, future job runner |
| 4 | **Security / compliance** | AuthZ, tenant isolation, audit, secret hygiene | RBAC + audit patterns + security tests |
| 5 | **Delivery / operations** | Deploy, migrate, observe, recover | Runbooks (to grow), monitoring, incident response |
| 6 | **AI engineering control** | How AI may change code safely | Issue labels, execution loop, merge gates, governance tests |

**Gap to close first:** automated **enforcement** of the rules in (2)(4)(6) so new work cannot drift the platform.

---

## 2. Two-repo model (keep this split)

### A. Implementation repo (product codebase)

Example name: **`business-services-hub`** (adjust to your actual repo).

Contains: app code, DB migrations, integrations, jobs, tests, deployment config.

### B. Platform governance repo (this repo: `smartpro-platformhub`)

Contains: constitution, domain model, architecture and RBAC, workflow contracts, API/UI/testing standards, AI execution loop, CI governance patterns, issue trees.

**Rule:** this repo holds **one source of truth for written standards**; the implementation repo must **satisfy** those standards via CI and reviews.

---

## 3. Single sources of truth (non-negotiable)

| Concern | Source of truth | Enforcement lever |
|---------|-------------------|---------------------|
| Product rules | `docs/core/PRODUCT_CONSTITUTION.md` | Human + issue workflow; link in PR template |
| Domain language | `docs/core/DOMAIN_MODEL.md` | Doc drift checks where they exist; reviews |
| Architecture | `docs/core/ARCHITECTURE.md` + `docs/architecture/*` | ADRs for material changes; CI architecture tests as you add them |
| Permissions | `docs/architecture/RBAC_MODEL.md` | Server-side guards + **RBAC / tenant tests** (see `docs/testing/RBAC_*`) |
| Protected API behavior | Handler contracts + registry patterns | `npm run verify:ci` and contract suites in implementation repo |
| Audit expectations | `docs/architecture/AUDIT_LOGGING_PATTERN.md` + test matrices | `docs/testing/AUDIT_*` patterns |
| Async / notifications (design) | `docs/architecture/NOTIFICATION_ARCHITECTURE.md` | Implementation + future job ledger |
| AI-driven work | `docs/architecture/AI_EXECUTION_LOOP.md`, cutover checklist | Labels, webhook workflow, required checks |

Until each row has a **machine check**, treat documentation as **necessary but not sufficient**.

---

## 4. Enforcement layer (highest leverage)

Add or extend **automated** checks so the platform cannot silently diverge:

- **CI:** typecheck, lint, unit/integration suites, migration safety — already oriented via `docs/testing/*` and `verify.yml`.
- **Contract governance:** protected handler registry, result/error/success-payload tests — see `docs/testing/MERGE_BLOCKING_CONTRACT_GOVERNANCE.md`, `API_CONTRACT_REGISTRY_PATTERN.md`.
- **Security posture:** tenant isolation tests, unauthorized paths, webhook replay/idempotency tests — expand over time from matrices in `docs/testing/`.
- **Forbidden patterns:** ESLint / custom scripts for raw DB outside approved layers, client-side authority, missing validation on mutations — phase in per module.

**SmartPRO already has substantial testing/governance *patterns* in `docs/testing/`; the ongoing work is wiring *more* of them into the implementation repo CI and keeping them green.**

---

## 5. Core platform modules (backbone)

For **minimal human touch**, these capability areas must be **explicit and testable** in the product (implementation repo), with docs here tracking intent:

1. Identity and access (auth, roles, tenant membership, permission evaluator) — `RBAC_MODEL.md`, tenant isolation docs.
2. Service catalog (services, packages, pricing, requirements).
3. Booking / order / case engine (intake, assignment, milestones, transitions, payment rules, closure).
4. Workflow engine (canonical states, transitions, automation, escalation) — align with `MODULE_01_BOOKING_SERVICE_REQUEST_LIFECYCLE.md` and related docs.
5. Documents (upload, metadata, versioning, verification, retention, secure access).
6. Billing / payments (invoices, attempts, reconciliation, refunds, webhooks).
7. Notifications (channels, triggers, retries, delivery logging) — `NOTIFICATION_ARCHITECTURE.md`.
8. Admin / ops (failed jobs, blocked workflows, approvals, tenant admin, audit search).
9. Audit / compliance (actor, action, target, before/after, reason, correlation id).
10. Reporting / analytics (ops, financial, workflow aging, quality).

Any module that is **partial** forces manual intervention; prioritize **closing loops** (state + audit + notifications + recovery) over new surface area.

---

## 6. Async jobs and orchestration (largest technical gap for autonomy)

Request/response alone cannot run the platform at low human load.

**Target capabilities:** webhooks, reminders, SLA checks, retries, reconciliation, stale detection, notification fanout, reporting snapshots, safe idempotency.

**Suggested stack (when you adopt):** Trigger.dev or Inngest for orchestration; Redis for queue/cache/rate limits where needed; Postgres (e.g. Supabase) remains system of record.

**Canonical ledgers (operational backbone):** implement and retain (names may match your schema):

| Ledger | Purpose |
|--------|---------|
| `audit_events` | Who did what, when, to what, with before/after |
| `integration_events` | Inbound/outbound partner payloads, delivery status |
| `notification_deliveries` | Channel, template, status, retries |
| `workflow_runs` | Long-lived business process instances |
| `job_runs` | Async worker executions |
| `idempotency_keys` | Dedup for webhooks and mutations |

See runbooks for operations on top of these.

---

## 7. Security and reliability (operationalize, then prove)

**Required practices:** server-side RBAC on protected actions, tenant isolation on query paths, schema validation on mutations, rate limits on sensitive surfaces, verified webhooks, secure file access, secret scanning, env validation at boot, audit on privileged changes, error tracking, dependency scanning, backup/restore discipline.

**Proof:** tests for tenant isolation, unauthorized access, workflow misuse, webhook replay, idempotency — not only checklists.

---

## 8. AI engineering control (safe autonomy)

**In this repo:** coding standards (`docs/standards/ENGINEERING_STANDARDS.md`), definition of done (`docs/standards/DEFINITION_OF_DONE.md`), execution loop (`AI_EXECUTION_LOOP.md`), GitHub ↔ Cursor cutover (`CURSOR_GITHUB_CUTOVER_CHECKLIST.md`).

**In process:** branch protection, required status checks, no merge on red CI, behavior changes backed by tests, no parallel “shadow” status or permission models without updating canonical docs.

---

## 9. Exception and human-touch model (four levels)

Classify every sensitive action so automation does not overreach:

1. **Fully automatic:** reminders, retries, recalculation, reconciliation checks, stale detection.  
2. **Rule-based with override:** auto-assign, auto-close inactive, auto-flag anomalies.  
3. **Human approval:** financial/legal exceptions, sensitive permissions, irreversible actions.  
4. **Admin emergency:** state override, integration disable, job replay, audited support access.

Document **which level** each sensitive action uses in implementation specs; implement **audit** for levels 3–4.

**Release authority** (who approves risky merges): see `docs/operations/RACI.md` § release authority.

---

## 10. Phased roadmap (order of attack)

### Phase 1 — Foundations (non-negotiable)

- Canonical RBAC + workflow/status models documented and **referenced in implementation**.  
- Audit event model + tests for critical mutations.  
- Env schema validation and centralized server guards in the app.  
- Idempotent mutation pattern + correlation IDs on requests/jobs.

### Phase 2 — Automation core

- Durable job runner + failed-job visibility + retries + schedules.  
- Notification and integration **ledgers** (delivery + external events).

### Phase 3 — Release hardening

- Security and tenant suites expanded; workflow transition tests; critical E2E.  
- Runbooks and **production readiness gate** in active use (`docs/runbooks/*`, `docs/release/PRODUCTION_READINESS_GATE.md`).

### Phase 4 — Human-touch minimization

- Rules for auto decisions; ops exception dashboard; stale/anomaly detection; escalations.

---

## 11. Definition of success

The platform is “ready” when:

- Important actions are **server-authoritative**.  
- Important changes are **audited**.  
- Important async work is **queued and observable**.  
- Important permissions are **enforced and tested**.  
- Major journeys have **E2E** coverage.  
- Deployments are **gated**.  
- Failures have **documented recovery**.  
- Remaining manual work is **either automated or explicitly justified**.

---

## 12. Control plane index (operational + enforcement)

### Runbooks (`docs/runbooks/`)

| Document | Use |
|----------|-----|
| `DEPLOYMENT_AND_RELEASE.md` | Cut, migrate, deploy, smoke, rollback |
| `INCIDENT_RESPONSE.md` | Severity, triage, comms, post-incident |
| `FAILED_JOBS_AND_RETRY.md` | Queues, retries, dead letters |
| `PAYMENT_RECONCILIATION.md` | Money integrity, webhooks, mismatches |
| `WEBHOOK_FAILURES.md` | Inbound/outbound webhook debugging |
| `TENANT_ACCESS_SECURITY_EVENT.md` | Cross-tenant, abuse, credential incidents |

### Operations (`docs/operations/`)

| Document | Use |
|----------|-----|
| `RACI.md` | Accountable/responsible roles; **release authority** |
| `OWNERSHIP_MAP.md` | Named owners per concern; escalation |

### AI control (`docs/ai/`)

| Document | Use |
|----------|-----|
| `AGENT_RESPONSIBILITY_MATRIX.md` | What agents may do; forbidden zones; escalation |

### Enforcement and release

| Document | Use |
|----------|-----|
| `docs/testing/ENFORCEMENT_MATRIX.md` | Rule → lint / CI / test / owners |
| `docs/release/PRODUCTION_READINESS_GATE.md` | Formal module / release checklist |

---

## 13. Implementation traceability

Maintain the **table template** inside `ENFORCEMENT_MATRIX.md`: each domain row links **governance doc → code area → tests → runbook → owner**. That completes the control plane for the implementation repo.

---

## 14. Core and architecture docs (design reference)

**Core:** `docs/core/PRODUCT_CONSTITUTION.md`, `docs/core/DOMAIN_MODEL.md`, `docs/core/ARCHITECTURE.md`  

**Architecture:** `docs/architecture/RBAC_MODEL.md`, `docs/architecture/AUDIT_LOGGING_PATTERN.md`, `docs/architecture/NOTIFICATION_ARCHITECTURE.md`, `docs/architecture/AI_EXECUTION_LOOP.md`, `docs/architecture/CURSOR_GITHUB_CUTOVER_CHECKLIST.md`, `SMARTPRO_PLATFORM_MASTER_BLUEPRINT.md` (this file)  

**Standards:** `docs/standards/ENGINEERING_STANDARDS.md`, `docs/standards/DEFINITION_OF_DONE.md`  

**Pattern library:** `docs/testing/MERGE_BLOCKING_CONTRACT_GOVERNANCE.md`, `docs/testing/QUALITY_GATE_PATTERN.md`, `docs/testing/CI_PIPELINE_DESIGN.md`, and `PROTECTED_HANDLER_*` / `RBAC_*` / `AUDIT_*` docs.

---

*This file is the index; detailed procedures live in the linked paths above. Align the implementation repo against the enforcement matrix and readiness gate next.*
