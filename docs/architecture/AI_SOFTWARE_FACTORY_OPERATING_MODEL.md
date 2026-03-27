# AI Software Factory Operating Model

## Purpose

This document defines how SmartPRO is built using **specialized AI roles**, **issue-driven work**, and **repo-native governance** so implementation can proceed safely with minimal day-to-day human steering.

It complements:

- `docs/architecture/PROTECTED_HANDLER_GOVERNANCE_ARCHITECTURE.md` — protected-handler contract and exception governance
- `docs/testing/PROTECTED_HANDLER_GOVERNANCE_INDEX.md` — navigation for testing and governance docs
- `docs/architecture/SMARTPRO_MODULE_BUILD_ROADMAP.md` — ordered build plan for product modules

---

## 1. Mission

**Build SmartPRO through specialized AI agents with minimal human intervention.**

Humans focus on priorities, business rules, major direction, and external reality. Agents focus on structured implementation inside explicit boundaries, with verification and governance as non-negotiable gates.

---

## 2. What this factory is (and is not)

### What it is

- An **engineering operating system** layered on the GitHub repo: issues, rules, architecture docs, contracts, tests, and scripts.
- A way to **repeat** implementation safely: same gates, same handoffs, same completion definition.

### What it is not

- A replacement for human judgment on product strategy, compliance posture, or commercial commitments.
- A promise that any single prompt completes a module; work stays **decomposed** into AI-ready issues with acceptance criteria.

---

## 3. Repo layers (where rules live)

| Layer | Location | Role |
|--------|-----------|------|
| Architecture | `docs/architecture/` | Boundaries, patterns, operating model |
| Testing / governance | `docs/testing/` | Contracts, quality, protected-handler policy |
| Work orchestration | `docs/issues/` | `READY_FOR_AI` drafts, publish flow |
| Runtime code | `packages/` | Domain logic, handlers, data access |
| Automation | `scripts/` | Migrations, quality gate, visibility CLIs |
| Database | `database/` (and related) | Schema, migrations |
| Verification | `tests/` | Integration and integrity suites |

---

## 4. Agent roles

Roles are **logical**. One session may combine roles; the important part is that **each type of change has a clear owner and checklist**.

### 4.1 Principal Architect AI

**Owns**

- Module and service boundaries
- Decomposition of objectives into issues with acceptance criteria
- Alignment with existing architecture docs
- Escalation when a change crosses multiple subsystems

**Typical touch areas**

- `docs/architecture/`
- `docs/issues/` (issue bodies, acceptance criteria)
- High-level pointers in `docs/testing/` when new governance is required

### 4.2 Backend AI

**Owns**

- Handlers, services, repositories
- Migrations and schema evolution (with locking/checksum discipline)
- RBAC enforcement, tenant scope, audit integration for changed boundaries
- Contract tests and fixtures when protected handlers change

**Typical touch areas**

- `packages/`
- `database/` / migration assets as used by the repo
- `tests/integration/` (handler and DB tests)
- `tests/integration/helpers/` (registry, fixtures, governance helpers when applicable)

### 4.3 Frontend AI

**Owns**

- Pages, flows, forms, tables, dashboards
- Loading, empty, and error states
- Client-side validation and API usage consistent with contracts

**Typical touch areas**

- Frontend package(s) when present in the monorepo
- Shared types or API client layers if the repo defines them
- E2E or UI tests if/when introduced

*Note: If the repo has not yet added a dedicated frontend tree, this role still applies as soon as UI code lands; until then, Backend and QA may own API-only surfaces.*

### 4.4 QA / Contract AI

**Owns**

- Integration and integrity tests
- Fixture and contract coverage for governed handlers
- Diagnosis and fixes for `npm run verify` failures related to tests or governance assets
- Ensuring governance tripwires stay green when behavior changes

**Typical touch areas**

- `tests/`
- `tests/integration/helpers/` (contract registry, fixtures, governance helpers)
- Related `docs/testing/` updates when test policy changes

### 4.5 Docs / Governance AI

**Owns**

- Issue drafts and governance doc updates
- Index and changelog-style evolution docs when policy or visibility changes
- Cross-links so agents can navigate without tribal knowledge

**Typical touch areas**

- `docs/testing/`
- `docs/architecture/`
- `docs/issues/`

### 4.6 DevOps / Release AI

**Owns**

- CI configuration, quality gate scripts, operational scripts
- Environment and migration runbooks where they affect automation
- Release-oriented documentation

**Typical touch areas**

- `scripts/`
- CI config files (e.g. `.github/workflows/` if used)
- `docs/testing/` for CI and environment contracts

---

## 5. Allowed responsibilities (who edits what)

These are **defaults**. Architect may adjust per issue; anything stricter than default wins.

| Area | Primary | Must consult |
|------|---------|----------------|
| Product boundary / epic split | Architect | Human (priorities) |
| Handler + DB implementation | Backend | QA if contracts change |
| Protected-handler registry + fixtures | Backend + QA | Docs if policy docs change |
| RBAC / tenant / audit behavior | Backend | Security-sensitive: Architect + human |
| Frontend UX and flows | Frontend | Architect for API assumptions |
| New integrity tests / fixtures | QA | Backend for semantics |
| Governance-only doc updates | Docs | Architect if scope changes |
| `verify` / CI / scripts | DevOps | QA for test wiring |

**Rule:** Avoid silent cross-cutting edits. If a change touches registry, fixtures, and docs, plan explicit handoffs or a single coordinated pass with a checklist.

---

## 6. Handoff rules

Typical flow for a **governed backend feature**:

1. **Architect** defines objective, issue text, acceptance criteria, and affected modules.
2. **Backend** implements code and migrations; updates handlers and repositories.
3. **QA** extends or updates integration tests, contract fixtures, and registry entries where required.
4. **Docs** updates architecture or testing docs if operator behavior or governance rules changed.
5. **DevOps** updates CI/scripts only if gates or environments need to change.

**Handoff artifacts**

- Issue with `Status: READY_FOR_AI` (or published equivalent) and explicit acceptance criteria.
- Short note in the issue or PR description: what changed, what was verified, what remains.

**Protected handlers**

- Any new or materially changed protected boundary must move **code, tests, registry, and docs** together. See `docs/architecture/PROTECTED_HANDLER_GOVERNANCE_ARCHITECTURE.md`.

---

## 7. Work item lifecycle (issue-driven)

1. **Identify** module objective (see `SMARTPRO_MODULE_BUILD_ROADMAP.md`).
2. **Break** into AI-ready issues: small enough to verify, each with acceptance criteria.
3. **Implement** in-repo following role boundaries.
4. **Run** local verification (`npm run verify` or the repo’s documented gate).
5. **Update** docs, registries, fixtures, and governance assets when obligations changed.
6. **Publish** or queue the next issue when using the issues pipeline.

This is the intended **autonomous build loop**, bounded by gates rather than by ad hoc judgment.

---

## 8. Completion rules

A task is **not complete** until:

- **Code** implements the agreed behavior and respects tenant, RBAC, and audit rules where applicable.
- **Tests** cover new or changed behavior at the appropriate level (integration/contract/integrity as defined by the repo).
- **Docs** reflect material behavior or policy changes (architecture, testing, or operator workflow).
- **Registry / governance** assets are updated when protected handlers, exclusions, or contract coverage change.
- **`npm run verify`** (or the documented CI-equivalent) **passes**.

Optional visibility (not a substitute for verify):

- `npm run review:protected-handlers`
- `npm run review:protected-handlers:json`
- `npm run review:governance-health`

---

## 9. Quality gates

| Gate | Command / mechanism | Meaning |
|------|---------------------|--------|
| Lint / types | Part of `verify` (see `package.json`) | Static safety and style |
| Migrations | Migration runner + tests as configured | Schema discipline |
| Integration tests | DB-backed suite as configured | Runtime behavior |
| Governance integrity | Protected-handler and related tests | Contract and policy tripwires |

Treat **`verify` as authoritative** for “mergeable and consistent with repo law.”

---

## 10. Module roadmap

The **sequence and rationale** for product modules live in:

- `docs/architecture/SMARTPRO_MODULE_BUILD_ROADMAP.md`

The operating model does not duplicate that list; it defines **how** modules are built, not **which** comes first in detail.

---

## 11. Human role

Humans should:

- Set **priorities** and **business rules** (especially compliance and commercial constraints).
- **Approve** major architectural or cross-cutting direction changes.
- Resolve **ambiguity** that agents cannot safely infer from docs and code.

Humans should **not** need to restate standard repo procedure every time: that belongs in issues, rules, and this document.

---

## 12. Design stance

- **Explicit** over implicit (registries, checklists, issues).
- **Small batches** with verification over large unverified drops.
- **Governance by tripwire** over assumption (integrity tests, contract tests).
- **Specialization** with clear handoffs over undifferentiated “do everything” prompts.

---

## 13. Summary

SmartPRO is built as an **AI-operated engineering system**: specialized roles, issue-driven work, repo-native governance, and a single high bar for completion. The next phase is to apply this model to **full product modules** while keeping the foundation already in place.
