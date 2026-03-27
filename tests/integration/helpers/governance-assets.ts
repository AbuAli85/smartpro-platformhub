/**
 * Canonical governed-handler identifiers and required governance documentation.
 * Keep aligned with `API_CONTRACT_REGISTRY` and policy docs.
 */
export const GOVERNED_HANDLER_NAMES = [
  "getCaseByIdHandler",
  "updateDocumentStatusHandler",
  "assignUserRoleTransactionalHandler",
] as const;

export const REQUIRED_CONTRACT_GOVERNANCE_DOCS = [
  "docs/testing/API_CONTRACT_REGISTRY_PATTERN.md",
  "docs/testing/BOUNDARY_CHANGE_GOVERNANCE.md",
  "docs/testing/PROTECTED_HANDLER_ONBOARDING_CHECKLIST.md",
  "docs/testing/PROTECTED_HANDLER_MERGE_READINESS.md",
  "docs/testing/MERGE_BLOCKING_CONTRACT_GOVERNANCE.md",
  "docs/testing/INTENTIONAL_BOUNDARY_CHANGE_WORKFLOW.md",
  "docs/testing/CONTRACT_DRIFT_CLASSIFICATION.md",
] as const;
