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
| Publish drafts (bulk) | `npm run publish-issues` (use with care) |

---

## 12. Summary

The **AI execution loop** is the control plane for continuous, governed delivery: explicit states, role routing, strict completion, verify-gated progress, and human escalation only where judgment cannot be encoded. **Automatic follow-up issues** are specified in `docs/architecture/ISSUE_AUTOGENERATION_RULES.md`.
