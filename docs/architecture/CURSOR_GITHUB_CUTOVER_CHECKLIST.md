# Cursor + GitHub cutover checklist

Canonical **one-time rollout** to move from manual chat → Cursor relay to **GitHub-driven execution** with Cursor Cloud Agents/Automations as workers and **GitHub Actions Verify** as the only completion authority.

**Rule that must not change:** agent or human *says* done is not completion. **Green `verify.yml` / `verify:ci` is completion.**

See also: `docs/architecture/AI_EXECUTION_LOOP.md` (labels, webhook workflow, starter automation prompt).

---

## Prerequisites on default branch

Before cutover, **`main`** (or your production default branch) must contain:

- `.github/workflows/cursor-ready-for-ai-webhook.yml` — POSTs to Cursor when `ai-state:ready-for-ai` is applied or an issue opens with that label
- `.github/workflows/verify.yml` — authoritative gate (`verify:ci`)
- `scripts/sync-github-labels.ts` and `npm run orchestration:sync-github-labels`
- Execution-loop and factory docs (at minimum `AI_EXECUTION_LOOP.md`)

Merge the integration branch/PR that adds these if they are not already on default.

---

## Ordered steps (execute in this order)

### 1. Merge integration PR to default branch

Merge the PR that contains the bridge, label sync, and this checklist (e.g. **PR #12**) into **`main`** (or your production default branch).

Until this lands, the automation is not **live** for the rest of the org—only “prepared” on a branch.

### 2. Freeze labels in GitHub

On a machine with [GitHub CLI](https://cli.github.com/) authenticated (`gh auth login`), from the repo root (checked out to **default**):

```bash
npm run orchestration:sync-github-labels
```

This upserts `ai-state:*` and `ai-role:*` so the documented state machine exists in GitHub.

### 3. Cursor GitHub integration

In Cursor, install/configure the **GitHub** integration for this repository so cloud agents/automations can access issues and PRs (permissions per [Cursor GitHub docs](https://cursor.com/docs/integrations/github)).

### 4. Create the Cursor Automation

In [Cursor Automations](https://cursor.com/automations):

- Add a **Webhook** trigger (GitHub does not expose “issue labeled” to Cursor natively; this repo bridges via Actions).
- Attach **this repository** and the **default branch**.
- Enable **Open pull request** (or equivalent).
- Enable **environment / dependency install** if the worker must run `npm run verify` or tests in cloud.
- Save the automation and copy the **webhook URL** (and **API key** if Cursor shows one).

Use the starter prompt in `AI_EXECUTION_LOOP.md` (section *Cursor Cloud Agent / Automation hook*) or adapt it for your team.

### 5. GitHub Actions secrets

Repository → **Settings** → **Secrets and variables** → **Actions**:

| Secret | Required |
|--------|----------|
| `CURSOR_AUTOMATION_WEBHOOK_URL` | Yes, for the bridge to call Cursor |
| `CURSOR_AUTOMATION_WEBHOOK_KEY` | Only if Cursor documents a secret; workflow sends `Authorization: Bearer …` when set |

If `CURSOR_AUTOMATION_WEBHOOK_URL` is unset, `.github/workflows/cursor-ready-for-ai-webhook.yml` **skips** without failing (safe for forks).

### 6. Docs-only dry run

Trigger the bridge with a **low-risk** issue:

- Create a GitHub issue (small docs/governance change), **or** publish from a docs draft.
- Set labels: **`ai-state:ready-for-ai`**, **`ai-role:docs`** (and remove conflicting `ai-state:*` if you use one-label-at-a-time).

Validate the run with the **strict acceptance checklist** below. **Do not skip it.**

### 7. Confirm the gate is authoritative

After the dry run:

- **Verify red** → not complete; fix or mark blocked; do not treat agent narrative as done.
- **Verify green** → complete for that slice; update issue labels / draft `Status:` per your factory rules.

### 8. Cut over operating habits

After one successful dry run:

- **Stop** using chat as the task relay (copy/paste instructions into Cursor for routine work).
- **Start** all routine execution from **GitHub** (issue body, labels, links to repo docs).
- Reserve chat/human discussion for **strategy**, **architecture**, **blockers**, and **exceptions**.

---

## Go-live dry run — strict acceptance checklist

Use this after step 6. **Every item must pass** before you treat the cutover as proven. If any item fails, fix **that layer** before the next issue or before promoting backend work.

### A. Preconditions (before triggering the issue)

- [ ] Default branch contains `.github/workflows/cursor-ready-for-ai-webhook.yml`.
- [ ] Default branch contains `.github/workflows/verify.yml`.
- [ ] `CURSOR_AUTOMATION_WEBHOOK_URL` is set in repo Actions secrets (and key secret only if required).
- [ ] Labels `ai-state:ready-for-ai` and `ai-role:docs` exist on the repo (from step 2).
- [ ] Test issue body is **docs-only** scope (no migrations, no payment/auth behavior changes).

### B. GitHub → bridge

- [ ] Applying **`ai-state:ready-for-ai`** (or opening the issue with that label) triggers workflow **Cursor ready-for-AI webhook**.
- [ ] The workflow run **succeeds** (green), not “skipped” because the URL secret is missing.
- [ ] The workflow log shows a successful **POST** to the webhook (no 4xx/5xx from your side; if Cursor returns an error, fix URL/key/automation before continuing).

### C. Cursor

- [ ] Cursor shows an automation/agent **run started** for this trigger (dashboard or email—whatever your team uses).
- [ ] The agent used **issue/PR/repo context**, not ad-hoc chat paste, to do the work.

### D. Code change

- [ ] A **branch** and/or **PR** exists with the docs change (visible on GitHub).

### E. Authoritative gate (non-negotiable)

- [ ] **Verify** (`verify.yml` / `verify:ci`) **ran** on that PR (or on the pushed branch if your policy runs Verify on PR only—then the PR must exist).
- [ ] Verify is **green**. **If Verify is red or did not run, the dry run failed** — agent text and “PR opened” do not count.

### F. After green Verify only

- [ ] Update GitHub labels / issue state per your factory (e.g. done/blocked/in-progress).
- [ ] Optionally align `docs/issues/*.md` draft `Status:` if you mirror GitHub.

### G. Next issue (do not skip the queue)

- [ ] First **production-style** automation issue = next **`READY_FOR_AI`** in the issue tree (e.g. Module 1 slice #4 when drafts/labels say so), **or** one more docs issue if you want extra safety.
- [ ] Do not start risky backend work until **B–E** have passed at least once on a docs dry run.

---

## Operating model after cutover

| Layer | Owns |
|--------|------|
| **GitHub** | Queue, labels, issue text, PRs, CI status |
| **Cursor** (cloud agents / automations) | Implementation, tests, docs updates, PR generation |
| **GitHub Actions** (`verify.yml`) | Authoritative pass/fail for merge-ready work |
| **You** | Priorities, approvals, business decisions, exceptions |
| **Ad-hoc chat** | Strategy, hard debugging, architecture — not the work queue |

---

## First production-style issue after dry run

Use a **governed backend slice** only when the **issue tree** and labels say it is **`READY_FOR_AI`** (or equivalent). Do not skip dependencies documented in `docs/architecture/MODULE_01_ISSUE_EXECUTION_TREE.md` and related drafts.

---

## Quick reference commands

```bash
npm run orchestration:sync-github-labels   # labels in GitHub
npm run verify                             # local gate (needs DATABASE_URL + Postgres)
```

CI equivalent: `npm run verify:ci` (as in `.github/workflows/verify.yml`).
