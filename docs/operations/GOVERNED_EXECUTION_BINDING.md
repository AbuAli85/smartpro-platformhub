# Governed execution binding (governance → implementation)

**Goal:** move from **governance design** to **governed execution** by wiring the **implementation repo** (`business-services-hub` or your actual name) to this control plane.

This file lives in **smartpro-platformhub**; actions below are performed **in the implementation repo** and in **GitHub org/repo settings**.

---

## Step 1 — CODEOWNERS + branch protection + required checks

### 1a. Install CODEOWNERS

1. Copy `docs/operations/templates/business-services-hub-CODEOWNERS` to the implementation repo as **`.github/CODEOWNERS`** (or merge with an existing file).
2. Replace every `@YOUR_ORG/...` placeholder with real GitHub usernames or teams.
3. Adjust **path patterns** to match your tree (Next.js app router, `src/server`, `packages/api`, etc.).

**Rule:** paths that match **release authority** in `RACI.md` (auth, RBAC, billing, workflow core, migrations, infra) must have **owners who can enforce** the matrix, not only the author.

### 1b. Branch protection (default branch)

Configure in GitHub: **Settings → Branches → Branch protection rule** (for `main` or equivalent):

| Setting | Value |
|---------|--------|
| Require pull request | On |
| Required approvals | ≥ 1 (raise for high-risk repos) |
| Dismiss stale approvals | On (recommended) |
| Require review from Code Owners | **On** for protected paths |
| Require status checks | **On** — list every check that must pass before merge |
| Require branches up to date | On (recommended) |
| Restrict who can push | On for production branch |
| Allow force pushes | Off |
| Allow deletions | Off |

### 1c. Required status checks (map to enforcement)

Add checks that mirror `docs/testing/ENFORCEMENT_MATRIX.md` and your CI name (e.g. `Verify` from `verify.yml`):

| Check (example name) | Role |
|----------------------|------|
| `Verify` (or `CI` / `test`) | Typecheck, lint, unit/integration gate |
| Migration / schema check (if split) | DB safety |
| E2E (if required for release train) | Critical journeys |

**Do not merge on red CI.** Optional: separate **required** vs **informational** workflows; only merge when **required** set is green.

### 1d. Map to RACI

| Risky change | Code owners path | Approver expectation |
|--------------|------------------|----------------------|
| Auth / session | `CODEOWNERS` auth\* | Security + backend (see `RACI.md`) |
| RBAC / permissions | rbac / authorization paths | Security + platform |
| Billing / payments | payments / billing / invoices | Finance owner + backend |
| Workflow core | workflow / state machine / bookings core | Product + platform |
| Migrations | `**/migrations/**` or `supabase/migrations` | Platform + DBA |
| GitHub Actions / deploy | `.github/workflows`, infra | Platform |

---

## Step 2 — Populate implementation traceability

Edit **`docs/testing/ENFORCEMENT_MATRIX.md`** in **this repo**: the table **Implementation traceability** must gain **real paths** for each module as it exists in `business-services-hub`.

Until rows are filled, governance is structurally sound but not operationally closed-loop.

---

## Step 3 — Async stack decision (implementation contract)

Record a **decision** in the implementation repo (recommended: `docs/adr/NNNN-async-orchestration.md`) or a short `ARCHITECTURE.md` section. Cover:

- Orchestration engine (e.g. Trigger.dev vs Inngest) and **why**
- Redis (or not): queue vs cache vs rate limit
- Which **ledgers** live in Postgres (`job_runs`, `integration_events`, etc.)
- **Retry** policy and **DLQ** behavior
- **Idempotency** key scope (webhooks vs internal jobs)
- **Observability**: dashboards, alerts, correlation IDs

Link that ADR from `SMARTPRO_PLATFORM_MASTER_BLUEPRINT.md` §6 once filed.

---

## Step 4 — Production readiness as a real gate

- Use `docs/release/PRODUCTION_READINESS_GATE.md` as the **checklist** before tagging / shipping a module.
- In implementation: add a **release** or **deploy** checklist issue template or PR template section that links to or copies the gate.
- Optional: GitHub **environment** protection rules for `production` (required reviewers = release authority from `RACI.md`).

---

## Runtime enforcement (implementation repo checklist)

Track in implementation backlog; align rows in `ENFORCEMENT_MATRIX.md` from **P** to **Y** as each lands:

- [ ] Env schema validation at boot
- [ ] Centralized auth guard on protected routes/handlers
- [ ] Audit on privileged mutations (test-enforced)
- [ ] Webhook signature verification + idempotency store
- [ ] Tenant isolation integration tests
- [ ] Lint or tests forbidding client-only authority for protected operations

---

## Related (this repo)

- `docs/operations/RACI.md` — release authority
- `docs/operations/OWNERSHIP_MAP.md` — name owners
- `docs/testing/ENFORCEMENT_MATRIX.md` — rules + traceability table
- `docs/runbooks/DEPLOYMENT_AND_RELEASE.md`
- `docs/architecture/SMARTPRO_PLATFORM_MASTER_BLUEPRINT.md`
