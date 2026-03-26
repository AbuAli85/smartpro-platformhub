# Architecture

## 1. Purpose
This document defines the technical architecture of the SmartPRO platform and the placement of responsibility across layers.

---

## 2. High-Level System Shape

### Frontend
- Next.js application(s)
- TypeScript
- Tailwind CSS
- component system for reusable UI
- server-authoritative data rendering

### Backend
- TypeScript backend
- internal application APIs via tRPC or equivalent
- external integration and webhook endpoints via REST
- centralized business logic services

### Data
- PostgreSQL as primary relational database
- controlled migrations
- object storage for files and documents
- Redis or equivalent for queue and caching where needed

### Async and Automation
- job/queue system for notifications, retries, reminders, scheduled checks, and workflow side effects

### Observability
- structured logs
- error tracking
- audit events
- CI validation

---

## 3. Core Layers

## API / Transport Layer
### Responsibilities
- receive requests
- authenticate callers
- validate inputs
- call service layer
- return structured responses

### Rules
- thin layer only
- no heavy business logic
- no raw business rules duplicated here
- mutation endpoints must validate input before execution

---

## Validation Layer
### Responsibilities
- input schemas
- coercion and normalization
- safe parsing
- output constraints where required

### Rules
- all API mutations must pass through validation
- validation must be centralized and reusable where practical

---

## Authorization Layer
### Responsibilities
- verify identity
- evaluate permissions
- enforce tenant boundaries
- protect elevated operations

### Rules
- authorization must be enforced server-side
- frontend-only permission enforcement is insufficient
- sensitive admin actions must be audited

---

## Service / Domain Layer
### Responsibilities
- business rules
- workflow transitions
- approvals
- status updates
- operational orchestration
- financial logic
- audit triggering
- notification triggering

### Rules
- this is the primary location for business logic
- services must not depend on frontend assumptions
- workflow transitions must be explicit and validated

---

## Persistence / Data Access Layer
### Responsibilities
- database reads and writes
- transactions
- query composition
- indexing strategy support
- views or reporting helpers where appropriate

### Rules
- data access should be predictable and testable
- critical mutations should use transactions where necessary
- uncontrolled ad hoc query sprawl should be avoided

---

## Async / Job Layer
### Responsibilities
- delayed processing
- retries
- scheduled jobs
- notifications
- external sync
- expiry checks
- escalation triggers

### Rules
- side effects that do not need to block the user should be handled asynchronously
- job execution must be idempotent where possible
- failures must be traceable

---

## Audit Layer
### Responsibilities
- record critical actions
- capture actors, targets, changes, and metadata
- support operational traceability

### Rules
- approvals, rejections, permission changes, workflow changes, and financial changes must be auditable
- audit logs must not be silently bypassed

---

## 4. Frontend Rules

1. Frontend is not the source of truth for business decisions.
2. Frontend may compute presentation state, but not business authority.
3. Protected actions must be backed by server-side permission checks.
4. UI must handle loading, empty, success, and error states.
5. Shared UI systems must be reused instead of creating inconsistent one-off patterns.

---

## 5. Backend Rules

1. Business rules belong in the service/domain layer.
2. API handlers remain thin.
3. Validation is mandatory.
4. Authorization is mandatory for protected operations.
5. Critical changes must create audit records.
6. Financial and workflow operations must be deterministic and traceable.
7. Tenant isolation must be enforced consistently.

---

## 6. API Strategy

### Internal APIs
- typed internal APIs for app-facing operations
- optimized for controlled platform development

### External APIs
- REST endpoints for webhook receivers and external integrations
- explicit contracts and verification for third-party callbacks

### API Design Rules
- canonical naming
- structured request and response shapes
- clear error semantics
- no undocumented mutation side effects
- version carefully when external contracts are introduced

---

## 7. Data Strategy

1. PostgreSQL is the primary operational data store.
2. Migrations are required for schema changes.
3. Constraints should enforce important integrity rules.
4. Reporting may use derived views or materialized views where appropriate.
5. File metadata belongs in the database; files belong in object storage.

---

## 8. Security Baseline

1. Authentication required for protected access.
2. Authorization required for privileged operations.
3. Tenant isolation enforced by design.
4. Sensitive file access must use secure retrieval mechanisms.
5. Secrets must not be committed to source control.
6. Webhook signatures must be verified where supported.
7. Rate limiting and abuse protections should exist on sensitive surfaces.
8. Security-sensitive changes require careful review.

---

## 9. Testing Strategy Baseline

The system should include:
- unit tests for utilities and domain helpers
- integration tests for API and service flows
- permission tests for protected routes and actions
- workflow transition tests
- end-to-end tests for major user journeys

Behavior-changing work is not complete without appropriate test coverage.

---

## 10. AI Development Constraints

AI agents working in this repo must:

1. inspect existing patterns before creating new ones
2. read core documentation before major implementation
3. preserve architectural boundaries
4. avoid introducing duplicate status systems or permission maps
5. prefer minimal correct changes
6. update tests and docs when behavior changes
7. surface assumptions when documentation is incomplete

---

## 11. Initial Recommended Repo Shape

```text
docs/
  core/
  architecture/
  workflows/
  standards/
apps/
packages/
database/
tests/
scripts/
.github/
