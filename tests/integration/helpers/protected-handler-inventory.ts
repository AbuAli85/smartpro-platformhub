/**
 * Explicit inventory of protected handlers that participate in contract governance.
 * Update when adding a new protected handler so onboarding and registry stay intentional.
 */
export const INVENTORIED_PROTECTED_HANDLERS = [
  "getCaseByIdHandler",
  "updateDocumentStatusHandler",
  "assignUserRoleTransactionalHandler",
] as const;
