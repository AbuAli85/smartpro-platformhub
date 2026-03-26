# Product Constitution

## 1. Purpose
SmartPRO is an AI-executable business services platform designed to manage end-to-end business, compliance, document, operational, and service workflows. The platform is intended to support multi-role, multi-tenant operations with strong administrative control, auditability, and extensibility.

Its primary purpose is to enable structured delivery of business services such as service requests, compliance handling, document management, approvals, workflow execution, billing events, and operational reporting.

---

## 2. Product Principles
The following principles are mandatory and non-negotiable:

1. **Server-authoritative system**
   - The backend is the single source of truth for business status, approvals, readiness, workflow transitions, and permissions.
   - The frontend must never be the final authority for business decisions.

2. **Explicit workflow execution**
   - All important workflows must follow defined states and transitions.
   - Silent or ad hoc status changes are not allowed.

3. **Audit-first design**
   - Any action affecting compliance, approvals, workflow state, permissions, financial records, or sensitive business data must be auditable.

4. **Multi-tenant isolation**
   - Tenant data must remain isolated by default.
   - Cross-tenant access is prohibited unless explicitly authorized and fully audited.

5. **Permission-based operations**
   - All privileged actions must be protected by centralized RBAC or policy enforcement.
   - Permissions must not be enforced only in the frontend.

6. **Configuration over hardcoding**
   - Service definitions, workflows, SLAs, required documents, and operational rules should be configurable where practical.

7. **Fail-safe behavior**
   - Invalid, incomplete, or unauthorized actions must fail safely and clearly.
   - Critical actions must not proceed on ambiguous or partially valid data.

8. **AI-operable architecture**
   - The system must be documented and structured so AI agents can safely inspect, reason about, and extend it without inventing business rules.

---

## 3. Core Platform Scope
The platform may include, but is not limited to, the following domains:

- identity and access management
- companies and tenant membership
- service catalog management
- service request intake
- case and workflow management
- document upload, validation, and review
- approvals and rejections
- notifications and communication
- invoicing and payment events
- admin operations and audit logs
- reporting and analytics

---

## 4. Roles
Initial platform roles may include:

- `platform_admin`
- `company_owner`
- `company_admin`
- `manager`
- `staff`
- `provider`
- `client`
- `reviewer`
- `finance`
- `support`

Notes:
- Roles may evolve, but all role additions must be documented.
- Role permissions must be centrally defined and version-controlled.

---

## 5. Global Rules
The following global rules apply across the platform:

1. Every primary business object must have a canonical status or lifecycle state.
2. Every approval or rejection must capture actor, timestamp, and reason where applicable.
3. Every workflow transition must be validated server-side.
4. Every uploaded document must have a defined document status.
5. Every important system action must be attributable to a user, admin, or automation actor.
6. Every financial event must be traceable and reconcilable.
7. Every API mutation must validate input before performing business logic.
8. Every tenant-scoped record must enforce tenant boundaries.
9. Every automation that changes business state must create an audit event.
10. Every module must define loading, empty, success, and error behavior.

---

## 6. Forbidden Patterns
The following are prohibited:

- business logic in frontend presentation components
- frontend-only authorization for protected operations
- direct database access from frontend clients
- scattered permission strings without central ownership
- duplicate status systems for the same domain
- hidden workflow side effects without audit
- uncontrolled schema changes without migrations
- creating business-critical states without defined transitions
- hardcoded production secrets in source control
- bypassing validation for convenience

---

## 7. Definition of Critical Actions
The following actions are considered critical and must be audited:

- login and privileged access escalation
- role or permission changes
- service definition changes
- workflow rule changes
- status changes on cases or approvals
- document validation decisions
- billing, payment, refund, or reconciliation actions
- cross-tenant administrative access
- bulk operations affecting business records

---

## 8. AI Agent Operating Constraints
AI agents working on this repository must follow these rules:

1. Read relevant core docs before implementing major changes.
2. Do not invent business rules when documentation is absent; propose or isolate assumptions instead.
3. Prefer minimal correct changes over broad uncontrolled rewrites.
4. Preserve server-authoritative logic.
5. Add or update tests when behavior changes.
6. Update documentation when introducing new rules, modules, or patterns.
7. Do not weaken security, auditability, or tenant isolation.

---

## 9. Success Criteria
The platform is considered structurally healthy when:

- roles and permissions are centralized
- workflows are explicit
- statuses are canonical
- audit coverage exists for critical actions
- services are configurable
- tenant isolation is enforced
- AI agents can extend the platform from repo-native documentation
