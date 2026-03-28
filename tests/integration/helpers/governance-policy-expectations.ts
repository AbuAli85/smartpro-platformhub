/**
 * Policy-level governed-handler set and required governance policy docs.
 * Intentionally overlaps other helpers so drift across layers is caught in tests.
 */
export const POLICY_GOVERNED_HANDLERS = [
  "assignUserRoleTransactionalHandler",
  "createServiceRequestDraftHandler",
  "getCaseByIdHandler",
  "getServiceRequestByIdHandler",
  "listServiceRequestsByCompanyHandler",
  "updateDocumentStatusHandler",
  "updateServiceRequestStatusHandler",
] as const;

export const REQUIRED_GOVERNANCE_POLICIES = [
  "docs/testing/API_CONTRACT_REGISTRY_PATTERN.md",
  "docs/testing/BOUNDARY_CHANGE_GOVERNANCE.md",
  "docs/testing/PROTECTED_HANDLER_ONBOARDING_CHECKLIST.md",
  "docs/testing/PROTECTED_HANDLER_MERGE_READINESS.md",
  "docs/testing/MERGE_BLOCKING_CONTRACT_GOVERNANCE.md",
  "docs/testing/INTENTIONAL_BOUNDARY_CHANGE_WORKFLOW.md",
  "docs/testing/CONTRACT_DRIFT_CLASSIFICATION.md",
  "docs/testing/GOVERNED_HANDLER_DOCUMENTATION_ALIGNMENT_PATTERN.md",
] as const;
