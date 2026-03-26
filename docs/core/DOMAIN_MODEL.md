# Domain Model

## 1. Purpose
This document defines the core business entities of the SmartPRO platform, their relationships, lifecycle rules, and invariants.

---

## 2. Core Entities

## User
Represents an authenticated person using the platform.

### Fields
- `id`
- `email`
- `fullName`
- `status`
- `createdAt`
- `updatedAt`

### Notes
- A user may belong to one or more companies depending on the access model.
- A user may hold one or more roles depending on the RBAC design.

---

## Company
Represents a tenant or business entity operating within the platform.

### Fields
- `id`
- `name`
- `legalName`
- `registrationNumber`
- `status`
- `createdAt`
- `updatedAt`

### Notes
- Company is a primary tenant boundary.
- Most operational records belong to a company.

---

## Membership
Represents the relationship between a user and a company.

### Fields
- `id`
- `userId`
- `companyId`
- `role`
- `status`
- `createdAt`

### Rules
- A membership must reference exactly one user and one company.
- Membership governs tenant-scoped access.

---

## Service
Represents a business service offered through the platform.

### Fields
- `id`
- `code`
- `name`
- `category`
- `description`
- `status`
- `isActive`
- `createdAt`
- `updatedAt`

### Notes
- Service definitions should be configurable.
- A service may define required documents, pricing rules, SLA rules, and workflow templates.

---

## ServiceRequest
Represents an initial request submitted for a service.

### Fields
- `id`
- `companyId`
- `serviceId`
- `requestedByUserId`
- `status`
- `submittedAt`
- `createdAt`
- `updatedAt`

### Candidate Statuses
- `draft`
- `submitted`
- `withdrawn`
- `converted_to_case`
- `cancelled`

### Rules
- A submitted request must belong to a company and a service.
- A request may later generate a case.

---

## Case
Represents an operational business record that tracks delivery of a service.

### Fields
- `id`
- `companyId`
- `serviceId`
- `serviceRequestId`
- `assignedToUserId`
- `status`
- `priority`
- `openedAt`
- `closedAt`
- `createdAt`
- `updatedAt`

### Candidate Statuses
- `draft`
- `submitted`
- `under_review`
- `awaiting_documents`
- `in_progress`
- `pending_external`
- `approved`
- `rejected`
- `completed`
- `cancelled`
- `escalated`

### Rules
- A case must belong to a company.
- A case must reference a service.
- Case transitions must be validated server-side.
- Critical status changes must create audit events.

---

## Document
Represents a file or document submitted or generated within a case or service flow.

### Fields
- `id`
- `companyId`
- `caseId`
- `documentType`
- `storagePath`
- `fileName`
- `mimeType`
- `status`
- `expiresAt`
- `uploadedByUserId`
- `createdAt`
- `updatedAt`

### Candidate Statuses
- `uploaded`
- `pending_review`
- `valid`
- `invalid`
- `expired`
- `replaced`
- `rejected`

### Rules
- A document must belong to a company.
- Sensitive document access must be permission-controlled.
- Review decisions must be auditable.

---

## WorkflowTemplate
Represents a reusable workflow definition associated with a service.

### Fields
- `id`
- `serviceId`
- `name`
- `version`
- `status`
- `definitionJson`
- `createdAt`
- `updatedAt`

### Notes
- Templates define stages, requirements, transitions, and automations.

---

## WorkflowRun
Represents an executed workflow instance for a specific case.

### Fields
- `id`
- `caseId`
- `workflowTemplateId`
- `currentStep`
- `status`
- `startedAt`
- `completedAt`
- `createdAt`
- `updatedAt`

### Rules
- A workflow run must belong to a case.
- State changes must align with permitted workflow logic.

---

## ApprovalDecision
Represents a formal approval or rejection event.

### Fields
- `id`
- `caseId`
- `decisionType`
- `decision`
- `reason`
- `decidedByUserId`
- `decidedAt`
- `createdAt`

### Rules
- Approval decisions must record actor and timestamp.
- Rejections should include structured reasons where applicable.

---

## Invoice
Represents a billing record.

### Fields
- `id`
- `companyId`
- `caseId`
- `invoiceNumber`
- `status`
- `currency`
- `subtotal`
- `taxAmount`
- `totalAmount`
- `issuedAt`
- `dueAt`
- `createdAt`
- `updatedAt`

### Candidate Statuses
- `draft`
- `issued`
- `partially_paid`
- `paid`
- `overdue`
- `cancelled`
- `void`

---

## Payment
Represents a payment event linked to an invoice.

### Fields
- `id`
- `invoiceId`
- `provider`
- `providerReference`
- `status`
- `amount`
- `paidAt`
- `createdAt`
- `updatedAt`

### Candidate Statuses
- `pending`
- `authorized`
- `paid`
- `failed`
- `refunded`
- `cancelled`

### Rules
- A payment must belong to an invoice.
- Provider callbacks must be verified before status updates.

---

## Notification
Represents an outbound or in-app notification.

### Fields
- `id`
- `companyId`
- `userId`
- `channel`
- `templateCode`
- `status`
- `subject`
- `body`
- `sentAt`
- `createdAt`

### Candidate Statuses
- `queued`
- `sent`
- `delivered`
- `failed`
- `cancelled`

---

## AuditEvent
Represents an immutable trace of an important system action.

### Fields
- `id`
- `actorType`
- `actorUserId`
- `companyId`
- `entityType`
- `entityId`
- `action`
- `beforeJson`
- `afterJson`
- `metadataJson`
- `createdAt`

### Rules
- Critical operations must create audit events.
- Audit events should not be silently modified or deleted.

---

## Task
Represents an operational or workflow task assigned internally.

### Fields
- `id`
- `caseId`
- `assignedToUserId`
- `title`
- `status`
- `dueAt`
- `createdAt`
- `updatedAt`

### Candidate Statuses
- `open`
- `in_progress`
- `blocked`
- `done`
- `cancelled`

---

## 3. Relationship Summary

- Company has many Memberships
- User has many Memberships
- Company has many ServiceRequests
- Company has many Cases
- Service has many ServiceRequests
- Service has many Cases
- Case has many Documents
- Case has many WorkflowRuns
- Case has many ApprovalDecisions
- Case may have many Tasks
- Case may have many Invoices
- Invoice has many Payments
- Company may have many Notifications
- Company may have many AuditEvents

---

## 4. Domain Invariants

1. Every tenant-scoped operational record must belong to a company.
2. Every case must reference a valid service.
3. Every payment must reference an invoice.
4. Every critical status change must be auditable.
5. A document must not be treated as valid without a valid server-side review state when review is required.
6. Workflow transitions must not bypass defined rules.
7. Cross-tenant record access is forbidden unless explicitly authorized and audited.

---

## 5. Modeling Notes
This model is the baseline. It may evolve, but:
- new entities must be added intentionally
- lifecycle states must be documented
- breaking changes require schema and architecture review
