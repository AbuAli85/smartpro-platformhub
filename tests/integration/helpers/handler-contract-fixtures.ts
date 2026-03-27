/**
 * Stable boundary contract fixtures for protected handlers.
 * Key sets only — dynamic values (ids, timestamps) are not snapshotted.
 */
export const HANDLER_CONTRACT_FIXTURES = {
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
} as const;
