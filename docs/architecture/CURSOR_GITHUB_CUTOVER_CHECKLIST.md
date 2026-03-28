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

### 1. Freeze labels in GitHub

On a machine with [GitHub CLI](https://cli.github.com/) authenticated (`gh auth login`), from the repo root:

```bash
npm run orchestration:sync-github-labels
```

This upserts `ai-state:*` and `ai-role:*` so the documented state machine exists in GitHub.

### 2. Cursor GitHub integration

In Cursor, install/configure the **GitHub** integration for this repository so cloud agents/automations can access issues and PRs (permissions per [Cursor GitHub docs](https://cursor.com/docs/integrations/github)).

### 3. Create the Cursor Automation

In [Cursor Automations](https://cursor.com/automations):

- Add a **Webhook** trigger (GitHub does not expose “issue labeled” to Cursor natively; this repo bridges via Actions).
- Attach **this repository** and the **default branch**.
- Enable **Open pull request** (or equivalent).
- Enable **environment / dependency install** if the worker must run `npm run verify` or tests in cloud.
- Save the automation and copy the **webhook URL** (and **API key** if Cursor shows one).

Use the starter prompt in `AI_EXECUTION_LOOP.md` (section *Cursor Cloud Agent / Automation hook*) or adapt it for your team.

### 4. GitHub Actions secrets

Repository → **Settings** → **Secrets and variables** → **Actions**:

| Secret | Required |
|--------|----------|
| `CURSOR_AUTOMATION_WEBHOOK_URL` | Yes, for the bridge to call Cursor |
| `CURSOR_AUTOMATION_WEBHOOK_KEY` | Only if Cursor documents a secret; workflow sends `Authorization: Bearer …` when set |

If `CURSOR_AUTOMATION_WEBHOOK_URL` is unset, `.github/workflows/cursor-ready-for-ai-webhook.yml` **skips** without failing (safe for forks).

### 5. Docs-only dry run

Trigger the bridge with a **low-risk** issue:

- Create a GitHub issue (small docs/governance change), **or** publish from a docs draft.
- Set labels: **`ai-state:ready-for-ai`**, **`ai-role:docs`** (and remove conflicting `ai-state:*` if you use one-label-at-a-time).

**Success criteria:**

- GitHub Actions workflow **Cursor ready-for-AI webhook** runs and POSTs.
- Cursor automation starts from the webhook.
- Agent produces a **branch / PR** (or equivalent visible work).
- **Verify** runs on the PR; treat work as **not done** until Verify is **green**.

### 6. Confirm the gate is authoritative

After the dry run:

- **Verify red** → not complete; fix or mark blocked; do not treat agent narrative as done.
- **Verify green** → complete for that slice; update issue labels / draft `Status:` per your factory rules.

### 7. Cut over operating habits

After one successful dry run:

- **Stop** using chat as the task relay (copy/paste instructions into Cursor for routine work).
- **Start** all routine execution from **GitHub** (issue body, labels, links to repo docs).
- Reserve chat/human discussion for **strategy**, **architecture**, **blockers**, and **exceptions**.

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
