# Issue Autogeneration Rules

## Purpose

Defines **when and what follow-up issues** should be generated automatically (or by convention immediately after closing a parent issue) so the **AI execution loop** does not stall waiting for a human to invent the next task.

Works with:

- `docs/architecture/AI_EXECUTION_LOOP.md` — states, verify gate, routing
- `docs/architecture/AI_SOFTWARE_FACTORY_OPERATING_MODEL.md` — roles and completion rules

---

## 1. Principles

1. **Autogeneration is conservative:** only spawn issues that are **predictable** from repo rules (contracts, registry, docs alignment).
2. **Each generated issue** must have **acceptance criteria** and a **primary role** label (or explicit line in the body).
3. **No duplicate spam:** before creating a follow-up, check for an **existing open issue** with the same scope.
4. **Human can merge or cancel** generated issues; the rules describe **intent**, not irreversible automation.

---

## 2. After a new or materially changed protected handler (Backend complete)

When a protected handler is added or its boundary meaning changes:

**Auto-generate (or immediately queue):**

| Follow-up | Role | Intent |
|-----------|------|--------|
| Contract / integration tests aligned with registry | `ai-role:qa` | Coverage for result shape, errors, payloads, hygiene as applicable |
| `API_CONTRACT_REGISTRY` + fixture linkage | `ai-role:qa` or `ai-role:backend` | Registry and `HANDLER_CONTRACT_FIXTURES` stay in sync |
| Governed-handler documentation expectations | `ai-role:docs` | Doc alignment helpers and integrity tests if policy requires |
| Governance index / architecture doc touch | `ai-role:docs` | Only if new doc paths or new command surfaces were introduced |

**Acceptance criteria pattern**

- `npm run verify` passes
- Registry and tests reference the same handler name and fixture keys
- Any new CLI or doc is linked from `docs/testing/PROTECTED_HANDLER_GOVERNANCE_INDEX.md` when relevant

---

## 3. After migration or schema change (Backend complete)

**Auto-generate:**

| Follow-up | Role | Intent |
|-----------|------|--------|
| Integration tests for affected repositories / flows | `ai-role:qa` | Prove up/down migrations and transactional behavior |
| Migration recovery / operator note | `ai-role:docs` | If behavior or recovery steps changed |
| CI / verify script update | `ai-role:devops` | If new steps are required for the quality gate |

---

## 4. After RBAC or permission change (Backend complete)

**Auto-generate:**

| Follow-up | Role | Intent |
|-----------|------|--------|
| RBAC invariant / catalog integrity | `ai-role:qa` | Existing drift-detection patterns stay green |
| Documentation alignment (RBAC / permissions docs) | `ai-role:docs` | If catalog or doc expectations changed |
| Admin boundary tests | `ai-role:qa` | If admin-only paths touched |

---

## 5. After module MVP slice (Architect + verify green)

When a module slice meets `SMARTPRO_MODULE_BUILD_ROADMAP.md` completion for that slice:

**Auto-generate:**

| Follow-up | Role | Intent |
|-----------|------|--------|
| Next vertical slice for same module | `ai-role:architect` | Pre-written acceptance criteria from roadmap |
| Cross-cutting hardening (audit, performance, edge cases) | `ai-role:architect` | Optional backlog items, prioritized |
| Start next module | `ai-role:architect` | Only after explicit module completion checkpoint |

---

## 6. After verify failure (QA triage)

Not autogeneration of **new** scope—transition handling:

- Keep issue open; add comment with failing command output summary.
- If failure is **missing test**, spawn **one** child issue: “Add tests for X” with `ai-role:qa` **or** expand current issue if small.

---

## 7. Issue body template for generated issues

Generated issues should include:

```text
Status: READY_FOR_AI
Priority: P0|P1|P2
ai-role: <one primary role>

## Generated from
- Parent issue: #<n> or <file>
- Rule: ISSUE_AUTOGENERATION_RULES.md §<section>

## Objective
<one paragraph>

## Acceptance criteria
- [ ] ...
- [ ] npm run verify passes
```

For GitHub: set labels `ai-state:ready-for-ai` and `ai-role:*` instead of or in addition to the body lines.

---

## 8. Automation phases

| Phase | Mechanism |
|-------|-----------|
| **Manual** | Human creates follow-ups from this checklist |
| **Scripted** | Script emits markdown under `docs/issues/` from templates |
| **Integrated** | Worker uses GitHub API to create issues with labels |

This repo can start at **manual or scripted** without a long-running service.

---

## 9. Summary

Autogeneration rules connect **closed work** to **next governed work**: contracts after handlers, tests after migrations, docs after policy changes, and the next slice after module milestones—always under the same **verify** and **completion** bar as `AI_EXECUTION_LOOP.md`.
