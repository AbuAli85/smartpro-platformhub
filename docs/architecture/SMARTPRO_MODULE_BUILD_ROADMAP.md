# SmartPRO Module Build Roadmap

## Purpose

This document orders **major SmartPRO product modules** for implementation under the **AI Software Factory** model.

It answers:

- which business capabilities come next
- why that order reduces risk
- what “module complete” should mean in governance terms

It works together with:

- `docs/architecture/AI_SOFTWARE_FACTORY_OPERATING_MODEL.md` — roles, handoffs, completion rules
- `docs/architecture/AI_EXECUTION_LOOP.md` — autonomous loop, issue states, verify gate
- `docs/architecture/ISSUE_AUTOGENERATION_RULES.md` — follow-up issues after closed work
- `docs/architecture/PROTECTED_HANDLER_GOVERNANCE_ARCHITECTURE.md` — protected-handler and contract governance
- `docs/testing/PROTECTED_HANDLER_GOVERNANCE_INDEX.md` — detailed governance navigation

---

## 1. Principles

1. **Governance first is done.** New work should **use** the existing verification and contract stack, not extend governance theory unless a gap appears.
2. **Vertical slices** beat horizontal layers: each module should deliver observable product value with tests and contracts.
3. **Tenant scope, RBAC, and audit** are assumed cross-cutting requirements for every module that touches regulated data or money.
4. Each module is decomposed into **AI-ready issues** with acceptance criteria and a green **`npm run verify`**.

---

## 2. Definition of module completion

A module is **complete** for factory purposes when:

- End-to-end flows required for the module MVP are implemented (API and UI where applicable).
- **Protected** boundaries are enrolled in contract governance (registry, fixtures, tests) per `PROTECTED_HANDLER_GOVERNANCE_ARCHITECTURE.md`.
- Migrations, repositories, and handlers respect **tenant isolation** and **authorization** models.
- **Audit** and transactional rules are satisfied where the module mutates sensitive state.
- **Tests** and **docs** reflect the module’s behavior and operator expectations.
- **`npm run verify`** passes.

“Complete” does not mean every future enhancement; it means the **agreed MVP slice** is shipped and governed.

---

## 3. Recommended module sequence

### Module 1 — Booking / service request lifecycle

**Why first**

- Ties together tenants, providers, statuses, timelines, and often payments and documents.
- Proves the factory can deliver a **core orchestration** domain, not only isolated handlers.

**Typical scope (MVP-oriented)**

- Request creation and lifecycle states (draft, submitted, in progress, completed, cancelled, etc., as defined by product).
- Assignment or routing to providers where applicable.
- Basic validation, permissions, and audit on state transitions.

**Governance focus**

- New protected handlers for transitions and reads; contract tests for stable client/AI consumption.
- Clear tenant boundaries on all queries and updates.

---

### Module 2 — Document and compliance workflow

**Why second**

- Central to GovTech-style operating models (evidence, review, retention).
- Builds on patterns established in Module 1 (status, assignments, audit).

**Typical scope**

- Document upload/metadata, review states, and compliance-oriented transitions.
- Integration points with cases or requests as defined by product.

**Governance focus**

- Audit events for material document actions; permission checks aligned with RBAC docs.
- Contract stability for any handler exposed to automation or external consumers.

---

### Module 3 — Contract lifecycle

**Why third**

- Strategic for B2B and regulated relationships; often long-lived entities with amendments.

**Typical scope**

- Contract entities, versions or amendments as required, linkage to parties and possibly requests/documents.

**Governance focus**

- Strong invariant tests for who can create, sign, or terminate contracts.
- Clear error semantics for illegal transitions.

---

### Module 4 — Admin control surfaces

**Why fourth**

- Admin capabilities **manage** the other modules; they are safer once core domain flows exist.

**Typical scope**

- Operational tools: user/role support, tenant configuration, overrides where allowed by policy, support read paths.

**Governance focus**

- **Admin boundary** patterns already in the repo; extend deliberately with explicit permission names and tests.
- Avoid leaking cross-tenant data in list or search handlers.

---

### Module 5 — Payments and financial events

**Why fifth**

- Highest need for **transaction discipline**, idempotency, reconciliation, and audit.

**Typical scope**

- Payment intents, captures/refunds as applicable, ledger or event log as designed by product.
- Explicit failure and retry semantics.

**Governance focus**

- Transactional tests (rollback, concurrency where relevant).
- Immutable audit trail for financial events; strict RBAC and tenant rules.

---

## 4. Dependencies (high level)

```text
Module 1 (booking / requests)
    ├── Module 2 (documents) — often attaches to cases/requests
    ├── Module 3 (contracts) — may reference parties and requests
    └── Module 4 (admin) — operates across modules 1–3+

Module 5 (payments) — integrates with Module 1 (and possibly 3); requires mature audit and admin visibility
```

Exact dependencies should be refined by **Principal Architect AI** per issue, but **booking/request** remains the recommended **first full vertical** proof of the factory.

---

## 5. Using this roadmap with the operating model

For each module:

1. **Architect** breaks the module into epics and `READY_FOR_AI`-style issues.
2. **Backend / Frontend / QA** rotate implementation per `AI_SOFTWARE_FACTORY_OPERATING_MODEL.md`.
3. **Completion** is judged by the criteria in section 2 of this document.

---

## 6. What is explicitly out of scope here

- Detailed user stories and Oman-specific regulatory text (belong in product issues and human-approved specs).
- Technology choices already settled by the repo (e.g. Postgres, existing package layout) unless Architect opens an ADR.

---

## 7. Summary

The next phase of SmartPRO is **product module delivery** under a **defined AI operating model**, starting with **booking / service request lifecycle** as the primary proof that governed, repeatable implementation produces real business value.
