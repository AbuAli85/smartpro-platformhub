/**
 * Stable boundary contract fixtures for protected handlers.
 * Key sets only — dynamic values (ids, timestamps) are not snapshotted.
 */
const serviceRequestRecordSuccessKeys = [
  "companyId",
  "createdAt",
  "id",
  "requestedByUserId",
  "serviceId",
  "status",
  "submittedAt",
  "updatedAt",
].sort();

export const HANDLER_CONTRACT_FIXTURES = {
  assignUserRoleTransactional: {
    successKeys: [
      "assignedByUserId",
      "companyId",
      "createdAt",
      "id",
      "roleId",
      "userId",
    ].sort(),
    failureKeys: ["code", "message", "status"].sort(),
  },

  createServiceRequestDraft: {
    successKeys: serviceRequestRecordSuccessKeys,
    failureKeys: ["code", "message", "status"].sort(),
  },

  getCaseById: {
    successKeys: [
      "companyId",
      "createdAt",
      "id",
      "serviceId",
      "status",
      "updatedAt",
    ].sort(),
    failureKeys: ["code", "message", "status"].sort(),
  },

  getServiceRequestById: {
    successKeys: serviceRequestRecordSuccessKeys,
    failureKeys: ["code", "message", "status"].sort(),
  },

  listServiceRequestsByCompany: {
    successKeys: ["serviceRequests"].sort(),
    failureKeys: ["code", "message", "status"].sort(),
  },

  updateDocumentStatus: {
    successKeys: [
      "caseId",
      "companyId",
      "createdAt",
      "id",
      "status",
      "storagePath",
      "updatedAt",
    ].sort(),
    failureKeys: ["code", "message", "status"].sort(),
  },

  updateServiceRequestStatus: {
    successKeys: serviceRequestRecordSuccessKeys,
    failureKeys: ["code", "message", "status"].sort(),
  },
} as const;
