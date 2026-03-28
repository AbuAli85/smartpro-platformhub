# Protected Handler Governance Architecture

## Purpose
This document summarizes the protected-handler governance system in SmartPRO.

It explains:
- what the system governs
- which layers exist
- how those layers fit together
- how maintainers, operators, and AI agents should use the system

---

## 1. What is a protected handler

A protected handler is any backend boundary that:
- reads or mutates tenant-scoped data
- performs privileged admin actions
- depends on auth, permissions, tenant scope, or invariants
- exposes a stable response contract that clients or AI agents depend on

Examples in the current system:
- `getCaseByIdHandler`
- `updateDocumentStatusHandler`
- `assignUserRoleTransactionalHandler`
- `createServiceRequestDraftHandler`, `getServiceRequestByIdHandler`, `listServiceRequestsByCompanyHandler`, `updateServiceRequestStatusHandler` (Module 1 service requests)

---

## 2. Governance goals

The protected-handler governance system exists to ensure that protected backend boundaries are:

- secure
- contract-stable
- test-governed
- documented
- reviewable
- operationally visible

This prevents silent drift in:
- auth behavior
- permission behavior
- tenant enforcement
- payload shape
- error semantics
- response hygiene
- governance policy

---

## 3. Governance layers

### A. Core boundary enforcement
Protected handlers rely on:
- centralized auth enforcement
- centralized permission checks
- tenant-scope checks where applicable
- role-scope and business invariants where applicable

### B. Contract layer
Protected handlers are governed through:
- result-shape tests
- error-semantics tests
- success-payload integrity tests
- response-boundary hygiene tests
- explicit contract fixtures

### C. Registry layer
Governed handlers are enrolled in:
- API contract registry
- governed-handler documentation expectations
- protected-handler inventory

### D. Governance policy layer
Governed handlers are controlled through:
- onboarding checklist
- merge-readiness rules
- merge-blocking governance rules
- intentional boundary change workflow
- contract drift classification

### E. Exception layer
Handlers not yet governed but considered candidates are controlled through:
- candidate inventory
- explicit exclusion list
- rationale requirements
- owner and review metadata
- stale and near-due review checks

### F. Visibility layer
Governance visibility is provided through:
- human-readable exclusion report
- JSON exclusion report
- governance health snapshot
- governance index
- changelog
- milestone markers

---

## 4. Integrity and verification layers

### Code/data/model integrity
The system verifies:
- RBAC seed integrity
- permission catalog integrity
- RBAC documentation integrity
- audit action catalog integrity
- audit model documentation integrity

### Boundary integrity
The system verifies:
- auth enforcement
- permission enforcement
- tenant denial behavior
- role-scope invariant behavior
- success payload normalization
- error status/code mappings
- non-leakage of internal metadata

### Governance integrity
The system verifies:
- registry integrity
- registry-to-fixture linkage
- docs-to-registry alignment
- governance-doc alignment
- protected-handler growth alignment
- exclusion rationale integrity
- exclusion review metadata integrity
- exclusion aging integrity
- human/JSON report parity

### Verification commands
Primary verification:
- `npm run verify`

Protected-handler visibility:
- `npm run review:protected-handlers`
- `npm run review:protected-handlers:json`
- `npm run review:governance-health`

---

## 5. Key governance assets

### Core docs
- `docs/testing/PROTECTED_HANDLER_GOVERNANCE_INDEX.md`
- `docs/testing/PROTECTED_HANDLER_ONBOARDING_CHECKLIST.md`
- `docs/testing/PROTECTED_HANDLER_MERGE_READINESS.md`
- `docs/testing/BOUNDARY_CHANGE_GOVERNANCE.md`
- `docs/testing/MERGE_BLOCKING_CONTRACT_GOVERNANCE.md`

### Contract docs
- `docs/testing/API_CONTRACT_REGISTRY_PATTERN.md`
- `docs/testing/HANDLER_CONTRACT_FIXTURE_PATTERN.md`
- `docs/testing/HANDLER_RESULT_CONTRACT_PATTERN.md`
- `docs/testing/HANDLER_ERROR_SEMANTICS_PATTERN.md`
- `docs/testing/HANDLER_SUCCESS_PAYLOAD_PATTERN.md`
- `docs/testing/RESPONSE_BOUNDARY_HYGIENE_PATTERN.md`

### Exception and visibility docs
- `docs/testing/PROTECTED_HANDLER_EXCLUSION_POLICY.md`
- `docs/testing/PROTECTED_HANDLER_EXCLUSION_REVIEW_POLICY.md`
- `docs/testing/PROTECTED_HANDLER_EXCEPTION_LIFECYCLE_PATTERN.md`
- `docs/testing/PROTECTED_HANDLER_REVIEW_REPORT_WORKFLOW.md`
- `docs/testing/PROTECTED_HANDLER_JSON_REPORT_PATTERN.md`
- `docs/testing/PROTECTED_HANDLER_GOVERNANCE_HEALTH_REPORT_WORKFLOW.md`

---

## 6. Operator workflow

For operators and maintainers who need visibility:

### Check current exclusion state
- run `npm run review:protected-handlers`

### Check machine-readable exclusion state
- run `npm run review:protected-handlers:json`

### Check governance health
- run `npm run review:governance-health`

### Run full verification gate
- run `npm run verify`

If an exclusion exists:
- inspect owner
- inspect review date
- inspect rationale
- check whether it is near-due or overdue

---

## 7. Maintainer workflow

When adding or changing a protected handler:

1. determine whether the handler is protected
2. apply auth, permission, tenant, and invariant enforcement
3. add or update:
   - result-shape tests
   - error-semantics tests
   - success-payload tests
   - hygiene tests
   - contract fixture tests
4. update registry and inventory if the handler is governed
5. update docs if the boundary meaning changes
6. run `npm run verify`

If the boundary changes intentionally:
- treat it as a boundary change
- update companion contract assets together
- review the change explicitly

---

## 8. AI-agent workflow

AI agents working in this repo should:

1. identify whether a handler is protected or a protected-handler candidate
2. check the governance index first
3. use the onboarding checklist when adding a new protected handler
4. use the merge-readiness and boundary governance docs when modifying governed handlers
5. update fixtures, registry, and docs together when boundary changes are intentional
6. use visibility commands for current governance state
7. run `npm run verify` before treating protected backend work as complete

AI agents should not:
- silently introduce protected handlers without onboarding consideration
- change governed handler boundaries without fixture/test/doc updates
- add exclusions without rationale, owner, and review metadata
- bypass governance checks because the change “seems small”

---

## 9. Current maturity state

The protected-handler governance system has established:

- onboarding baseline
- contract registry baseline
- exclusion lifecycle baseline
- visibility/reporting baseline
- governance health visibility baseline

This means the system is ready for disciplined protected-backend growth without relying on ad hoc memory or informal review only.

---

## 10. Design principles

The system intentionally favors:

- explicit over implicit
- lightweight over overengineered
- deterministic over clever
- reviewable over magical
- governance by tripwire over governance by assumption

This is why the current design uses:
- explicit helpers
- explicit registries
- explicit candidate sets
- explicit exclusion metadata
- explicit docs and test assets

instead of:
- AST tooling
- bot-driven governance
- heavy discovery systems
- generated policy layers

Those heavier systems can come later if needed.

---

## 11. Source of truth navigation

Start here:
- `docs/testing/PROTECTED_HANDLER_GOVERNANCE_INDEX.md`

Then use:
- visibility commands for current state
- policy docs for workflow rules
- helper files for explicit governed/candidate/exception sets
- integrity tests for contract and governance tripwires

---

## 12. Final rule

Protected-handler governance is part of the architecture, not optional process overhead.

If a protected handler changes, the boundary, tests, registry, and governance assets must move together.
