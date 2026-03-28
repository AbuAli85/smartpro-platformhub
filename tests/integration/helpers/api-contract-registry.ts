/**
 * Lightweight registry of protected handlers that are boundary-contract governed.
 * Keep in sync with handler tests and `HANDLER_CONTRACT_FIXTURES`.
 */
export const API_CONTRACT_REGISTRY = [
  {
    handler: "assignUserRoleTransactionalHandler",
    contractFixture: "assignUserRoleTransactional",
    successPayloadCovered: true,
    errorSemanticsCovered: true,
    resultShapeCovered: true,
    responseHygieneCovered: true,
  },
  {
    handler: "createServiceRequestDraftHandler",
    contractFixture: "createServiceRequestDraft",
    successPayloadCovered: true,
    errorSemanticsCovered: true,
    resultShapeCovered: true,
    responseHygieneCovered: true,
  },
  {
    handler: "getCaseByIdHandler",
    contractFixture: "getCaseById",
    successPayloadCovered: true,
    errorSemanticsCovered: true,
    resultShapeCovered: true,
    responseHygieneCovered: true,
  },
  {
    handler: "getServiceRequestByIdHandler",
    contractFixture: "getServiceRequestById",
    successPayloadCovered: true,
    errorSemanticsCovered: true,
    resultShapeCovered: true,
    responseHygieneCovered: true,
  },
  {
    handler: "listServiceRequestsByCompanyHandler",
    contractFixture: "listServiceRequestsByCompany",
    successPayloadCovered: true,
    errorSemanticsCovered: true,
    resultShapeCovered: true,
    responseHygieneCovered: true,
  },
  {
    handler: "updateDocumentStatusHandler",
    contractFixture: "updateDocumentStatus",
    successPayloadCovered: true,
    errorSemanticsCovered: true,
    resultShapeCovered: true,
    responseHygieneCovered: true,
  },
  {
    handler: "updateServiceRequestStatusHandler",
    contractFixture: "updateServiceRequestStatus",
    successPayloadCovered: true,
    errorSemanticsCovered: true,
    resultShapeCovered: true,
    responseHygieneCovered: true,
  },
] as const;
