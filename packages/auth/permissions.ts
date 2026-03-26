export const PERMISSIONS = {
  ADMIN_ACCESS: "admin:access",

  USERS_READ: "users:read",
  USERS_MANAGE: "users:manage",

  COMPANIES_READ: "companies:read",
  COMPANIES_UPDATE: "companies:update",

  MEMBERSHIPS_MANAGE: "memberships:manage",

  ROLES_READ: "roles:read",
  ROLES_MANAGE: "roles:manage",
  PERMISSIONS_READ: "permissions:read",

  SERVICES_READ: "services:read",
  SERVICES_MANAGE: "services:manage",

  SERVICE_REQUESTS_CREATE: "service_requests:create",
  SERVICE_REQUESTS_READ: "service_requests:read",
  SERVICE_REQUESTS_UPDATE: "service_requests:update",

  CASES_CREATE: "cases:create",
  CASES_READ: "cases:read",
  CASES_UPDATE: "cases:update",
  CASES_ASSIGN: "cases:assign",
  CASES_APPROVE: "cases:approve",
  CASES_REJECT: "cases:reject",

  DOCUMENTS_UPLOAD: "documents:upload",
  DOCUMENTS_READ: "documents:read",
  DOCUMENTS_VERIFY: "documents:verify",
  DOCUMENTS_DELETE: "documents:delete",

  WORKFLOWS_READ: "workflows:read",
  WORKFLOWS_MANAGE: "workflows:manage",

  BILLING_READ: "billing:read",
  BILLING_MANAGE: "billing:manage",

  PAYMENTS_CREATE: "payments:create",
  PAYMENTS_CONFIRM: "payments:confirm",
  PAYMENTS_REFUND: "payments:refund",

  NOTIFICATIONS_READ: "notifications:read",
  NOTIFICATIONS_SEND: "notifications:send",

  REPORTS_READ: "reports:read",
  AUDIT_READ: "audit:read",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
