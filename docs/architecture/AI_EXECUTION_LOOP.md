# AI Execution Loop

## Purpose

This document defines the **autonomous execution loop** for SmartPRO: how work moves from **selected module → issue → role → implementation → verification → next issue** with minimal human involvement.

It sits on top of:

- `docs/architecture/AI_SOFTWARE_FACTORY_OPERATING_MODEL.md` — roles, handoffs, completion rules
- `docs/architecture/SMARTPRO_MODULE_BUILD_ROADMAP.md` — module order and completion definition
- `docs/architecture/PROTECTED_HANDLER_GOVERNANCE_ARCHITECTURE.md` — contract and exception governance
- `docs/AI_EXECUTION_RULES.md` — baseline rules for AI execution from `docs/issues/`

---

## 1. Mission

Turn the repo from **“human defines → AI executes → human nudges next”** into **“system defines → AI executes → system verifies → system queues next”**, with humans reserved for strategy, ambiguity, and external constraints.

Humans are **not** removed from engineering judgment where it matters; they are removed from **repetitive sequencing** when the path is already governed.

---

## 2. Execution loop

1. **Select** the active module (from `SMARTPRO_MODULE_BUILD_ROADMAP.md` or a human-prioritized override).
2. **Select** the next work item: a `READY_FOR_AI` issue (repo draft and/or GitHub issue, depending on phase).
3. **Assign** a primary role (Architect, Backend, Frontend, QA, Docs, DevOps) using routing rules below.
4. **Implement** the change in-repo following `AI_SOFTWARE_FACTORY_OPERATING_MODEL.md`.
5. **Run verification:** `npm run verify` (or CI equivalent).
6. **If verify passes:**
   - mark the issue **COMPLETE**
   - apply **autogeneration rules** (`docs/architecture/ISSUE_AUTOGENERATION_RULES.md`) to enqueue follow-up issues if needed
   - select the **next** ready issue for the module
7. **If verify fails:**
   - keep issue **IN_PROGRESS** (or move to **VERIFYING** then back)
   - default **QA / Backend** fix loop until green
8. **Repeat** until the module’s agreed MVP slice meets the roadmap completion definition.

---

## 3. Issue state machine

Use the **same states** in draft markdown (`docs/issues/*.md`) and on **GitHub** (labels + optional Project column) so humans and automation share one model.

| State | Meaning |
|--------|---------|
| **DRAFT** | Issue text incomplete; not executable. |
| **READY_FOR_AI** | Executable: acceptance criteria and priority set; may be picked by orchestrator or human. |
| **IN_PROGRESS** | An agent is actively implementing. |
| **VERIFYING** | Implementation claimed done; `verify` (or CI) running or being triaged. |
| **COMPLETE** | Acceptance satisfied; `verify` passed; artifacts updated per completion rules. |
| **BLOCKED** | Waiting on human decision, external system, or unresolved conflict—not a simple test fix. |

**Transitions (normative)**

- `DRAFT → READY_FOR_AI` — Architect (or human) declares issue executable.
- `READY_FOR_AI → IN_PROGRESS` — assignee starts work.
- `IN_PROGRESS → VERIFYING` — PR or local claim ready for verification.
- `VERIFYING → COMPLETE` — all completion criteria met including `npm run verify`.
- `VERIFYING → IN_PROGRESS` — verify failed; fix required.
- `* → BLOCKED` — ambiguity, policy conflict, or external dependency.
- `BLOCKED → READY_FOR_AI` or `IN_PROGRESS` — after resolution.

### Operational slice rule (trustworthy factory)

For **implementation issues** in `docs/issues/`, treat slice progress as follows:

| Repo `Status:` | Meaning |
|----------------|--------|
| **DRAFT** | Not yet eligible to execute (dependencies unmet or scope not final). |
| **READY_FOR_AI** | Eligible to pick up; dependencies satisfied. |
| **IN_PROGRESS** | Work underway **or** code has landed **but** full verification is not yet proven in a real environment. |
| **DONE** | **`npm run verify` passed** (with a valid Postgres `DATABASE_URL` where applicable), and docs/registry alignment required by the issue is satisfied. |

**Critical invariant:** **Code merged or present in the workspace is not a closed slice.** A slice is operationally complete only after the **quality gate** succeeds in an environment that can run migrations and integration tests. Until then, keep **`IN_PROGRESS`** and do not promote dependent issues from **DRAFT** to **READY_FOR_AI**.

`DONE` in a draft file is equivalent to **COMPLETE** in the table above (GitHub may still use `ai-state:complete`).

---

## 4. GitHub labels (recommended)

Create labels so issues are machine-filterable and human-readable. Prefix keeps them grouped in the UI.

### State labels

| Label | Maps to state |
|--------|----------------|
| `ai-state:draft` | DRAFT |
| `ai-state:ready-for-ai` | READY_FOR_AI |
| `ai-state:in-progress` | IN_PROGRESS |
| `ai-state:verifying` | VERIFYING |
| `ai-state:complete` | COMPLETE |
| `ai-state:blocked` | BLOCKED |

**Convention:** exactly one `ai-state:*` label active per issue at a time.

### Role labels (intent for routing)

| Label | Primary role |
|--------|----------------|
| `ai-role:architect` | Principal Architect AI |
| `ai-role:backend` | Backend AI |
| `ai-role:frontend` | Frontend AI |
| `ai-role:qa` | QA / Contract AI |
| `ai-role:docs` | Docs / Governance AI |
| `ai-role:devops` | DevOps / Release AI |

### Module labels (optional but useful)

Examples: `module:booking`, `module:documents`, `module:contracts`, `module:admin`, `module:payments`.

### Creating labels in GitHub

Use the repository **Labels** settings or `gh label create` (see GitHub CLI docs). Keep names stable so scripts and docs do not drift.

**Idempotent sync (recommended):** from the repo root with GitHub CLI authenticated (`gh auth login`):

```bash
npm run orchestration:sync-github-labels
```

This runs `scripts/sync-github-labels.ts`, which upserts every `ai-state:*` and `ai-role:*` label from the tables above (`gh label create … --force`).

### Cursor Cloud Agent / Automation hook (READY_FOR_AI)

GitHub is the control plane; **Cursor Automations** can run cloud agents on schedules or triggers. Native GitHub automation triggers in Cursor cover PR and push events, not “issue labeled,” so this repo wires **issue readiness** through GitHub Actions:

1. **Labels:** apply `ai-state:ready-for-ai` when an issue is executable (exactly one `ai-state:*` at a time per your convention).
2. **Automation:** in [Cursor Automations](https://cursor.com/automations), create an automation with a **Webhook** trigger, select this repository and default branch, enable **Open pull request** (and environment install if the agent must run `npm run verify`), and paste the prompt below (adapt as needed).
3. **Repository secrets** (GitHub → Settings → Secrets and variables → Actions):
   - `CURSOR_AUTOMATION_WEBHOOK_URL` — webhook URL shown after you save the automation.
   - `CURSOR_AUTOMATION_WEBHOOK_KEY` — optional; if Cursor shows an API key for the webhook, store it here (the workflow sends `Authorization: Bearer …` when set).
4. **Workflow:** `.github/workflows/cursor-ready-for-ai-webhook.yml` POSTs a JSON payload when an issue is **opened** already carrying `ai-state:ready-for-ai`, or when that label is **added**. If `CURSOR_AUTOMATION_WEBHOOK_URL` is unset, the job skips so forks and local testing are unaffected.

**Suggested automation prompt (starter):**

You are triggered when GitHub signals an issue labeled `ai-state:ready-for-ai`. The webhook body includes `issue.number`, `issue.title`, `issue.html_url`, `issue.body`, and `issue.labels`.

1. Open the GitHub issue from `issue.html_url`. If it also has `ai-role:*`, treat that as the primary role per `docs/architecture/AI_EXECUTION_LOOP.md`.
2. If the issue is not clearly executable (missing acceptance criteria, conflicting labels, or not actually ready), add a short GitHub comment explaining why and do not open a PR.
3. Otherwise implement the change on a new branch, run `npm run verify` (or `npm run verify:ci` if that matches the environment), and open a PR that references the issue. Do not merge; **GitHub Actions** `verify.yml` is the merge gate.
4. If verify fails after a reasonable fix attempt, comment on the issue with the failure summary and suggest `ai-state:blocked` or keep `ai-state:in-progress` per team practice.

Completion remains gated by **`.github/workflows/verify.yml`** on pull requests; the automation prepares work, CI proves it.

**Full cutover sequence (merge → labels → Cursor → secrets → dry run → habits):** `docs/architecture/CURSOR_GITHUB_CUTOVER_CHECKLIST.md`.

---

## 5. Role routing rules

Route from issue metadata (GitHub labels and/or front matter in draft markdown—see `docs/issues/README.md` for evolution).

**Default mapping**

| Issue type / label | Primary role |
|--------------------|--------------|
| architecture, boundaries, epic split | Architect |
| backend, handler, repository, migration, RBAC, audit | Backend |
| frontend, UI, UX | Frontend |
| tests, fixtures, contract coverage, verify failures | QA |
| docs, governance registry, issue drafts | Docs |
| CI, scripts, environments, release | DevOps |

If multiple roles apply, the issue should **split** or list **explicit primary** + **secondary** in the body. Automation should pick the **primary** only.

---

## 6. Completion enforcement

An issue is **COMPLETE** only if:

- **Code** exists and matches acceptance criteria.
- **Tests** exist or are updated for changed behavior (integration/contract/integrity as applicable).
- **Docs** are updated when behavior or policy materially changed.
- **Registry / governance** assets are updated when protected handlers, exclusions, or contract coverage changed.
- **`npm run verify`** passes (no waivers unless human-approved and recorded).

**No exceptions** for “small” changes: either the bar applies or the issue scope was wrong and should be rewritten.

---

## 7. Failure handling

If `verify` fails:

- Do not mark **COMPLETE**.
- Prefer transition **VERIFYING → IN_PROGRESS**.
- **QA** role owns triage of test/governance failures; **Backend** owns production code fixes unless the failure is test-only.
- Loop until **verify** passes or issue is **BLOCKED** with a recorded reason.

---

## 8. Human intervention rules

Humans are **required** when:

- **Architecture conflict** — two modules or patterns cannot both hold without a decision.
- **Business ambiguity** — acceptance criteria cannot be inferred safely from product/architecture docs.
- **External integration** — credentials, third-party contracts, or environments humans control.
- **Legal / compliance** — obligations that are not fully encoded in repo rules.

Everything else should stay in the **autonomous loop** bounded by verify and governance tests.

---

## 9. Repo drafts vs GitHub issues

**Today**

- Source drafts live in `docs/issues/` with `Status: ...` in the body.
- `scripts/publish-issues.ts` can create GitHub issues from drafts (use carefully to avoid duplicates).

**Target**

- **GitHub issues** (or Projects) are the **runtime queue** for the loop.
- **Drafts** remain templates or backlog; orchestration prefers **live issue state** + labels.

The minimal script `scripts/list-ready-for-ai-issues.ts` supports the **draft folder** phase of the loop. Extend later to call `gh issue list` with label filters.

---

## 10. Optional: dedicated orchestrator service

A future `services/ai-orchestrator/` (or external worker) can:

- poll for `ai-state:ready-for-ai`
- assign role and prompt template
- apply patch / open PR
- run `verify`
- transition labels and spawn follow-ups per `ISSUE_AUTOGENERATION_RULES.md`

That is **not required** to adopt this document; labels + verify + autogeneration rules already define the **behavioral** contract for such a service.

---

## 11. Related commands

| Action | Command / location |
|--------|---------------------|
| Local verify | `npm run verify` |
| List draft issues ready for AI | `npm run orchestration:list-ready` |
| Sync GitHub `ai-state:*` / `ai-role:*` labels | `npm run orchestration:sync-github-labels` |
| GitHub ↔ Cursor automation cutover (ordered checklist) | `docs/architecture/CURSOR_GITHUB_CUTOVER_CHECKLIST.md` |
| Publish drafts (bulk) | `npm run publish-issues` (use with care) |

---

## 12. Summary

The **AI execution loop** is the control plane for continuous, governed delivery: explicit states, role routing, strict completion, verify-gated progress, and human escalation only where judgment cannot be encoded. **Automatic follow-up issues** are specified in `docs/architecture/ISSUE_AUTOGENERATION_RULES.md`.
