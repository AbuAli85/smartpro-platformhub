# Tenant Isolation Model

## 1. Purpose
This document defines how SmartPRO enforces tenant/company isolation across data, APIs, services, files, administrative access, and audit systems.

Tenant isolation is a core security and data-integrity requirement. Company-scoped records must remain isolated by default, and any permitted cross-tenant access must be explicit, minimal, and auditable.

---

## 2. Core Principle
SmartPRO is a multi-tenant platform.

The company is the primary tenant boundary for operational data.  
Unless explicitly stated otherwise, a user operating within one company must not be able to read, modify, approve, or manage records belonging to another company.

Default rule:

`No tenant boundary crossing without explicit authorization and audit.`

---

## 3. Tenant Boundary Definition

A tenant-scoped record is any record that belongs to a specific company, directly or indirectly.

Examples of tenant-scoped records:
- memberships
- service requests
- cases
- documents
- invoices
- payments
- notifications
- tasks
- workflow runs
- most operational audit events

Examples of platform-scoped records:
- system roles
- permissions
- global configuration
- platform-managed service templates where intentionally global
- platform-wide audit and administrative metadata

---

## 4. Isolation Principles

1. **Company ownership**
   - Tenant-scoped operational records must belong to one company.

2. **Membership-gated access**
   - Access to tenant-scoped records requires valid company membership unless a platform-scoped override explicitly applies.

3. **Permission + scope**
   - Authorization requires both:
     - the required permission
     - valid scope to the target company

4. **Server-side enforcement**
   - Tenant isolation is enforced on the backend, not trusted to the frontend.

5. **Query filtering by default**
   - Tenant-scoped queries must filter by company scope by default.

6. **Explicit cross-tenant exceptions**
   - Cross-tenant access must be rare, documented, role-limited, and auditable.

---

## 5. Company Membership Model

Company membership is the baseline mechanism that links a user to a tenant.

### Membership Requirements
A membership should include at minimum:
- `user_id`
- `company_id`
- `status`
- `created_at`
- `updated_at`

Optional additions may include:
- membership type
- invitation state
- suspension state

### Membership Rules
- A user must have valid membership to access company-scoped records for that company.
- Suspended or inactive membership must not grant company access.
- Role assignment within a company does not replace membership requirements unless explicitly designed otherwise.

---

## 6. Tenant-Scoped Authorization Model

For any company-scoped request, access is granted only if all of the following are true:

1. the user is authenticated
2. the user has the required permission
3. the user has valid scope to the target company
4. the record belongs to the same permitted company
5. additional business rules pass

Authorization formula:

`Allow = Authenticated AND PermissionGranted AND CompanyScopeGranted AND RecordMatchesTenant AND BusinessGuardPassed`

---

## 7. Data Modeling Rules

### Required Pattern
Tenant-scoped tables should include `company_id` directly whenever practical.

Examples:
- `service_requests.company_id`
- `cases.company_id`
- `documents.company_id`
- `invoices.company_id`
- `notifications.company_id`

### Why
Direct tenant keys simplify:
- query filtering
- policy enforcement
- debugging
- indexing
- audit consistency

### Indirect Scope
If a record inherits tenant scope indirectly, that inheritance must be explicit and consistent.

Example:
- a `payment` may inherit scope from `invoice`
- a `workflow_run` may inherit scope from `case`

Where practical, denormalized `company_id` may still be preferred for safer enforcement and performance.

---

## 8. Query and API Enforcement

### Query Rules
- All tenant-scoped reads must filter by company scope.
- All tenant-scoped writes must validate target company scope.
- Bulk operations must validate scope for all affected records.

### API Rules
Tenant-sensitive endpoints should:
1. authenticate the caller
2. resolve target company scope
3. verify membership or approved override
4. verify permission
5. verify record-company match before performing action

### Anti-Patterns
The following are prohibited:
- fetching a record by ID and trusting it without tenant check
- frontend-only company filtering
- assuming a role implies unlimited tenant scope
- mixing tenant data in shared result sets without explicit authorization

---

## 9. Service Layer Enforcement

The service/domain layer must preserve tenant invariants even if route-level guards exist.

Service methods operating on tenant-scoped records should:
- accept explicit scope context
- verify record tenancy before mutation
- reject mismatched tenant operations
- avoid hidden cross-tenant side effects

Critical service rule:

`No service should mutate a tenant-scoped record unless the caller’s scope has been validated for that tenant.`

---

## 10. Database Enforcement Strategy

The platform should use a defense-in-depth approach.

### Recommended Layers
1. backend auth and scope guards
2. query filtering by company
3. schema constraints where appropriate
4. row-level security if adopted in the data layer
5. audit logging for privileged access

### RLS
If PostgreSQL Row Level Security is used:
- policies must align with application tenant rules
- platform-admin exceptions must be explicit
- policy behavior must be tested

RLS is helpful, but does not replace correct application-level authorization.

---

## 11. Cross-Tenant Access Rules

Cross-tenant access is not allowed by default.

### Allowed only when:
- explicitly granted to a platform-scoped role
- required for platform administration, support, review, or finance operations
- documented in role and permission definitions
- fully auditable when sensitive

### Examples of possible permitted cross-tenant actors
- `super_admin`
- `platform_admin`
- `reviewer` for centralized review functions
- `finance_admin` for platform finance operations
- `support` where operational access is intentionally designed

### Restrictions
- cross-tenant access must not be implicit
- broad read access should be minimized
- write access across tenants should be tightly limited
- impersonation or support override flows require separate policy if introduced later

---

## 12. Elevated Access and Overrides

Any override that bypasses normal tenant scope must satisfy all of the following:
- explicit role authorization
- clear business justification
- narrow action scope
- audit trail with actor, target company, reason, and timestamp

If “support access” or “impersonation” is introduced later, it must be separately designed and not assumed by this baseline model.

---

## 13. File and Document Isolation

Files must respect the same tenant boundary as their associated records.

### Rules
- file metadata must map to tenant/company scope
- file retrieval must validate authorization before issuing access
- signed URLs must only be generated after scope validation
- users must not access another company’s files by guessing paths or identifiers

### Storage Guidance
Prefer storage organization that preserves tenant traceability, for example:
- by company
- by case
- by document type

Example path pattern:
`companies/{companyId}/cases/{caseId}/documents/{documentId}`

---

## 14. Audit Requirements

The following tenant-sensitive actions must be auditable:
- cross-tenant reads where sensitive
- cross-tenant writes
- elevated support/admin access
- role assignments affecting tenant access
- tenant-boundary failures on privileged attempts
- approval/rejection actions on tenant records by platform roles

Audit entries should capture:
- actor
- actor role
- target company
- entity type
- entity id
- action
- result
- timestamp
- relevant metadata

---

## 15. Error Handling and Security Posture

### Response Behavior
When appropriate, the system should avoid leaking whether out-of-scope records exist.

Depending on endpoint sensitivity, prefer one of:
- `404 Not Found`
- `403 Forbidden`

For highly sensitive tenant boundaries, `404` is often preferable when the user should not learn the record exists.

### Logging
Security-relevant tenant scope failures should be logged safely for operational review.

---

## 16. Testing Requirements

Tenant isolation is not complete without tests.

The test plan should include:
- same-tenant allowed reads
- same-tenant allowed writes
- cross-tenant read denial
- cross-tenant write denial
- platform override allowed flows where defined
- RLS behavior if used
- file access scope enforcement
- bulk operation scope enforcement

---

## 17. Non-Goals for Initial Version

The initial tenant model does not require:
- hierarchical sub-tenant structures
- department-level segmentation
- delegated external tenant federation
- dynamic sharing between companies

These may be introduced later only through explicit design.

---

## 18. Implementation Guidance

Recommended implementation order:
1. ensure tenant-scoped tables carry `company_id` where practical
2. define membership and scope guard helpers
3. enforce company filters in backend queries
4. protect APIs with auth + permission + company scope checks
5. align storage access with tenant scope
6. add audit events for elevated tenant access
7. add integration and permission tests

---

## 19. Success Criteria

Tenant isolation is considered correctly established when:
- tenant-scoped records are consistently tied to companies
- company membership is required for normal company access
- backend queries enforce tenant boundaries
- cross-tenant access is explicit and auditable
- file access respects tenant scope
- tests prove same-tenant allow and cross-tenant deny behavior
