/**
 * Explicit inventory of protected handlers that participate in contract governance.
 * Update when adding a new protected handler so onboarding and registry stay intentional.
 */
export const INVENTORIED_PROTECTED_HANDLERS = [
  "assignUserRoleTransactionalHandler",
  "createServiceRequestDraftHandler",
  "getCaseByIdHandler",
  "getServiceRequestByIdHandler",
  "listServiceRequestsByCompanyHandler",
  "updateDocumentStatusHandler",
  "updateServiceRequestStatusHandler",
] as const;
