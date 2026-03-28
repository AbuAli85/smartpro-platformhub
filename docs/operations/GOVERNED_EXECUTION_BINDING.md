# Governed execution binding (governance → implementation)

**Goal:** move from **governance design** to **governed execution** by wiring the **implementation repo** (`business-services-hub` or your actual name) to this control plane.

This file lives in **smartpro-platformhub**; actions below are performed **in the implementation repo** and in **GitHub org/repo settings**.

---

## Two-pass rollout (recommended)

Do **not** block Pass 1 on a perfect file map. Use two passes:

### Pass 1 — Governance-to-app bootstrap (do immediately)

In the implementation repo only:

- Add **`.github/CODEOWNERS`** — for Next.js + Supabase, start from **`templates/business-services-hub-CODEOWNERS.nextjs-supabase`** (merge in domain lines from **`business-services-hub-CODEOWNERS`** if useful).
- **Delete** globs that obviously do not exist; replace `@YOUR_ORG/...` with real teams/users.
- Enable **branch protection** (§1b) and require **one** CI check first (e.g. `Verify` — name must match the workflow job as GitHub shows it).
- Open the **async ADR** file (`docs/adr/NNNN-async-orchestration.md` — §Step 3).
- Create **backlog issues** for runtime enforcement (see §Runtime enforcement — use titles below).

This starts governed execution without waiting for a full tree audit.

### Pass 2 — Repo-accurate hardening (when layout is known)

- Remove **dead** `CODEOWNERS` paths; align patterns with **real** risk areas only.
- Populate **`ENFORCEMENT_MATRIX.md`** (in **this** repo) with exact paths, tests, owners, runbooks.
- Split **required checks** into **core merge** vs **release-level** (add E2E, migrations, security suites as needed).
- Revisit `CODEOWNERS` splits if modules moved (e.g. new `packages/*`).

---

## Step 1 — CODEOWNERS + branch protection + required checks

### 1a. Install CODEOWNERS

1. **Pass 1:** Prefer **`templates/business-services-hub-CODEOWNERS.nextjs-supabase`** for a Next.js + Supabase app; optionally merge lines from **`business-services-hub-CODEOWNERS`** for extra domain coverage.
2. Copy the result to **`.github/CODEOWNERS`** in the implementation repo.
3. Replace every `@YOUR_ORG/...` placeholder with real GitHub usernames or teams.
4. **Delete** patterns that do not match a real path (wrong coverage weakens review; empty dirs are harmless but noisy).
5. **Pass 2:** Prune and tighten once the repo tree is confirmed (see appendix).

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

**Pass 1:** TBD rows are acceptable. **Pass 2:** replace every TBD with concrete paths, test globs, owners, and runbook links.

Until rows are filled, governance is structurally sound but not operationally closed-loop.

---

## Step 3 — Async stack decision (implementation contract)

Record a **decision** in the implementation repo (recommended: `docs/adr/NNNN-async-orchestration.md`) or a short `ARCHITECTURE.md` section. Cover:

- Orchestration engine and **why**
- Redis (or not): queue vs cache vs rate limit
- Which **ledgers** live in Postgres (`job_runs`, `integration_events`, etc.)
- **Retry** policy and **DLQ** behavior
- **Idempotency** key scope (webhooks vs internal jobs)
- **Observability**: dashboards, alerts, correlation IDs

**Product guidance (SmartPRO):**

- **Trigger.dev** — favor when flows are **long-running, multi-step, operationally visible**, with retries, summaries, escalations, or human-adjacent checkpoints.
- **Inngest** — favor for a **lighter event-driven** layer and **incremental** adoption.

Default recommendation for SmartPRO’s operational shape: **Trigger.dev**, unless the team explicitly wants minimal orchestration surface.

Link that ADR from `SMARTPRO_PLATFORM_MASTER_BLUEPRINT.md` §6 once filed.

---

## Step 4 — Production readiness as a real gate

- Use `docs/release/PRODUCTION_READINESS_GATE.md` as the **checklist** before tagging / shipping a module.
- In implementation: add a **release** or **deploy** checklist issue template or PR template section that links to or copies the gate.
- Optional: GitHub **environment** protection rules for `production` (required reviewers = release authority from `RACI.md`).

---

## Runtime enforcement (implementation repo checklist)

Track in implementation backlog; align rows in `ENFORCEMENT_MATRIX.md` from **P** to **Y** as each lands.

**Suggested issue titles** (Pass 1 backlog):

1. `Runtime: validate environment with schema at application boot`
2. `Runtime: centralized server auth guard for protected handlers/routes`
3. `Runtime: enforce audit events on privileged mutations (with tests)`
4. `Runtime: verify inbound webhooks (signature) + idempotency store`
5. `Tests: tenant isolation integration suite for tenant-scoped APIs`
6. `Lint/tests: block client-only authorization for protected operations`

---

## Appendix — inputs for a path-perfect CODEOWNERS

Paste into a chat or ticket (or open the app repo in the IDE) so globs can be merged with **no dead paths**:

- Top-level folders (e.g. `apps/`, `packages/`, `src/`)
- `app/` **or** `src/app/` (API routes, layouts)
- `supabase/` (migrations, functions, config)
- `.github/workflows/` (job names for required checks)
- Any `lib/`, `server/`, or `packages/*` used for auth, billing, workflows

---

## Related (this repo)

- `docs/operations/RACI.md` — release authority
- `docs/operations/OWNERSHIP_MAP.md` — name owners
- `docs/testing/ENFORCEMENT_MATRIX.md` — rules + traceability table
- `docs/runbooks/DEPLOYMENT_AND_RELEASE.md`
- `docs/architecture/SMARTPRO_PLATFORM_MASTER_BLUEPRINT.md`
