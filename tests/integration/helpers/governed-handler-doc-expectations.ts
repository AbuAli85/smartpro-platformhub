/**
 * Documented governed-handler set for policy docs (API contract registry scope).
 * Keep aligned with `GOVERNED_HANDLER_NAMES` in `governance-assets.ts` and governance documentation.
 */
export const DOCUMENTED_GOVERNED_HANDLERS = [
  "getCaseByIdHandler",
  "updateDocumentStatusHandler",
  "assignUserRoleTransactionalHandler",
] as const;
