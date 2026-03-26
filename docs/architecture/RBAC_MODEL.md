# RBAC Model

## 1. Purpose
This document defines the role-based access control model for SmartPRO. It establishes how identities, tenant membership, roles, and permissions are assigned and enforced across the platform.

The RBAC system must support:
- platform-wide administrative roles
- company-scoped roles
- strict tenant isolation
- centralized permission enforcement
- auditable privileged operations
- future extensibility without hardcoded access logic

---

## 2. Design Principles

1. **Server-side enforcement only**
   - Permissions are enforced on the backend.
   - Frontend visibility may reflect permission state, but must never be trusted as authorization.

2. **Least privilege**
   - Users receive only the permissions needed for their role.

3. **Tenant-aware authorization**
   - Access to tenant-scoped records requires both:
     - the necessary permission
     - valid membership or explicitly authorized cross-tenant scope

4. **Centralized permission ownership**
   - Permission names are defined in one system and reused consistently.

5. **Auditability**
   - Role assignments, permission-sensitive actions, and elevated access must be auditable.

6. **Composable permissions**
   - Roles are collections of permissions.
   - Business logic checks permissions, not role names, except where explicitly intended.

---

## 3. Scope Types

SmartPRO uses two authorization scopes:

### Platform Scope
Applies across the whole platform and is not limited to one company.

Examples:
- platform administration
- global review operations
- support supervision
- configuration management

### Company Scope
Applies within a single tenant/company boundary.

Examples:
- company operations
- case handling within one company
- internal staff permissions
- tenant-level service usage

---

## 4. Role Model

## Platform Roles
These roles apply globally.

### `super_admin`
Highest-privilege internal role.
May manage platform-wide configuration, roles, permissions, and operational oversight.

### `platform_admin`
Administrative platform operator with broad management permissions, but typically more constrained than `super_admin`.

### `reviewer`
Platform-level reviewer role for approval/review operations where centralized review is required.

### `support`
Platform-level support role for operational assistance, subject to strict audit for sensitive access.

### `finance_admin`
Platform-level finance role for reconciliation, billing oversight, refunds, and financial review where applicable.

---

## Company Roles
These roles apply within a specific company.

### `owner`
Highest privilege within a tenant/company.

### `company_admin`
Administrative role within a company, able to manage team operations and many company-scoped actions.

### `manager`
Operational manager role with broad workflow and case management permissions.

### `staff`
General operational user within a company.

### `provider`
Service provider role where provider-specific actions are needed.

### `client`
External client/customer role for service consumption and limited self-service access.

---

## 5. Permission Naming Convention

Permissions use this format:

`resource:action`

Optional extended format:

`resource:action:scope`

Examples:
- `users:read`
- `users:manage`
- `companies:read`
- `companies:update`
- `memberships:manage`
- `services:read`
- `services:manage`
- `service_requests:create`
- `service_requests:read`
- `service_requests:update`
- `cases:create`
- `cases:read`
- `cases:update`
- `cases:assign`
- `cases:approve`
- `cases:reject`
- `documents:upload`
- `documents:read`
- `documents:verify`
- `documents:delete`
- `workflows:read`
- `workflows:manage`
- `billing:read`
- `billing:manage`
- `payments:create`
- `payments:confirm`
- `payments:refund`
- `notifications:read`
- `notifications:send`
- `reports:read`
- `audit:read`
- `roles:read`
- `roles:manage`
- `permissions:read`
- `admin:access`

Rules:
- Use lowercase snake_case for multi-word resources.
- Prefer stable names.
- Do not encode UI labels into permissions.
- Avoid using role names in permission identifiers.

---

## 6. Authorization Decision Model

For tenant-scoped operations, access is granted only if all required checks pass:

1. user is authenticated
2. user has required permission
3. user has valid company membership or authorized platform-level override
4. requested record belongs to the permitted tenant scope
5. any extra business guard passes

Authorization formula:

`Allow = Authenticated AND PermissionGranted AND ScopeGranted AND BusinessGuardPassed`

---

## 7. Data Model

Recommended core tables:

### `roles`
Defines role records.

Fields:
- `id`
- `name`
- `scope_type` (`platform` or `company`)
- `description`
- `is_system_role`
- `created_at`
- `updated_at`

### `permissions`
Defines permission records.

Fields:
- `id`
- `name`
- `description`
- `created_at`
- `updated_at`

### `role_permissions`
Maps roles to permissions.

Fields:
- `role_id`
- `permission_id`
- `created_at`

Constraints:
- unique (`role_id`, `permission_id`)

### `user_roles`
Assigns a role to a user, optionally within a company scope.

Fields:
- `id`
- `user_id`
- `role_id`
- `company_id` nullable
- `assigned_by_user_id`
- `created_at`

Rules:
- platform roles should have `company_id = null`
- company roles should have `company_id` populated
- assignment must be auditable

### `memberships`
Defines user-company membership.

Fields:
- `id`
- `user_id`
- `company_id`
- `status`
- `created_at`
- `updated_at`

Note:
- membership and role assignment are related but not identical
- a user may be a company member without all roles
- authorization can require both membership and role assignment

---

## 8. Baseline Role-to-Permission Mapping

Initial baseline only; can evolve later.

### `super_admin`
- all platform management permissions
- all role and permission management permissions
- all audit read permissions
- all configuration permissions

### `platform_admin`
- `admin:access`
- `users:read`
- `users:manage`
- `companies:read`
- `companies:update`
- `roles:read`
- `roles:manage`
- `permissions:read`
- `services:manage`
- `workflows:manage`
- `reports:read`
- `audit:read`

### `reviewer`
- `admin:access`
- `cases:read`
- `cases:approve`
- `cases:reject`
- `documents:read`
- `documents:verify`
- `reports:read`

### `finance_admin`
- `billing:read`
- `billing:manage`
- `payments:create`
- `payments:confirm`
- `payments:refund`
- `reports:read`
- `audit:read`

### `owner`
- `companies:read`
- `companies:update`
- `memberships:manage`
- `users:read`
- `services:read`
- `service_requests:create`
- `service_requests:read`
- `service_requests:update`
- `cases:create`
- `cases:read`
- `cases:update`
- `cases:assign`
- `documents:upload`
- `documents:read`
- `billing:read`
- `reports:read`

### `company_admin`
Similar to `owner`, but potentially without the most sensitive company governance actions.

### `manager`
- `service_requests:read`
- `cases:read`
- `cases:update`
- `cases:assign`
- `documents:read`
- `documents:upload`
- `reports:read`

### `staff`
- `service_requests:create`
- `service_requests:read`
- `cases:read`
- `documents:upload`
- `documents:read`

### `provider`
Provider-specific permissions as needed, typically limited to assigned/owned records.

### `client`
- `service_requests:create`
- `service_requests:read`
- `documents:upload`
- `documents:read`
- read access limited to own records only

---

## 9. Enforcement Strategy

## Backend Enforcement
All protected actions must pass through authorization guards.

Preferred enforcement layers:
1. authentication middleware
2. permission guard
3. tenant-scope guard
4. resource ownership/business rule checks

Examples:
- `requireAuth()`
- `requirePermission("cases:read")`
- `requireCompanyAccess(companyId)`

## Service Layer Rule
Business services should not trust the caller implicitly.
Even after route-level guards, critical service actions should preserve invariant checks.

---

## 10. Frontend Behavior

Frontend may:
- hide unavailable actions
- render role-aware navigation
- disable actions the user likely cannot perform

Frontend must not:
- be relied on for actual authorization
- define access rules independently from backend

---

## 11. Tenant Isolation Rules

1. Company-scoped records must not be readable across tenants by default.
2. Platform roles with cross-tenant access must be explicitly defined.
3. Sensitive cross-tenant reads should be auditable.
4. Company roles must not operate outside their assigned company.
5. Query filters and service-layer checks must align.

---

## 12. Auditing Requirements

The following actions must create audit records:
- assigning or removing roles
- changing permissions or role mappings
- privileged cross-tenant access
- approval/rejection actions
- financial confirmation/refund actions
- workflow configuration changes

Audit fields should capture:
- actor
- action
- target entity
- target scope/company
- before/after where relevant
- timestamp
- metadata

---

## 13. Initial Non-Goals

To keep initial implementation controlled, the first version does not require:
- custom per-user permission overrides
- arbitrary policy builder UI
- hierarchical org-unit permissions
- temporary delegated approvals unless explicitly designed later

---

## 14. Open Decisions for Later
These may be added later if needed:
- permission conditions by record attributes
- time-limited elevated access
- support impersonation model
- approval delegation
- finer provider/client record scoping

---

## 15. Implementation Guidance

Initial implementation sequence:
1. create schema for roles, permissions, role_permissions, user_roles
2. seed system roles and permissions
3. add backend guard helpers
4. add company-scope guard
5. protect admin and tenant APIs
6. add audit events for role assignment changes
7. add permission-aware frontend rendering only after backend enforcement exists

---

## 16. Success Criteria

RBAC is considered correctly established when:
- roles are centrally defined
- permissions are centrally defined
- backend authorization uses permissions, not scattered role checks
- tenant isolation is consistently enforced
- role assignments are auditable
- frontend reflects but does not enforce authority
