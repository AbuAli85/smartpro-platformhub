export class TenantScopeError extends Error {
  code:
    | "MISSING_COMPANY_SCOPE"
    | "RECORD_NOT_FOUND"
    | "RECORD_SCOPE_MISMATCH"
    | "BULK_SCOPE_VIOLATION";

  constructor(
    code:
      | "MISSING_COMPANY_SCOPE"
      | "RECORD_NOT_FOUND"
      | "RECORD_SCOPE_MISMATCH"
      | "BULK_SCOPE_VIOLATION",
    message: string,
  ) {
    super(message);
    this.name = "TenantScopeError";
    this.code = code;
  }
}

export interface TenantScopedIdParams {
  companyId: string;
  id: string;
}

export interface TenantOwnedRecord {
  id: string;
  companyId: string;
}

export function requireCompanyId(companyId: string | null | undefined): string {
  if (!companyId) {
    throw new TenantScopeError(
      "MISSING_COMPANY_SCOPE",
      "Company scope is required",
    );
  }
  return companyId;
}

export function assertTenantRecordExists<T>(
  record: T | null | undefined,
  entityName = "Record",
): T {
  if (!record) {
    throw new TenantScopeError(
      "RECORD_NOT_FOUND",
      `${entityName} not found in permitted company scope`,
    );
  }
  return record;
}

export function assertTenantOwnership(
  record: TenantOwnedRecord,
  companyId: string,
  entityName = "Record",
): void {
  if (record.companyId !== companyId) {
    throw new TenantScopeError(
      "RECORD_SCOPE_MISMATCH",
      `${entityName} does not belong to the permitted company scope`,
    );
  }
}

export function assertBulkTenantOwnership(
  records: TenantOwnedRecord[],
  companyId: string,
  entityName = "Records",
): void {
  const outOfScope = records.find((record) => record.companyId !== companyId);

  if (outOfScope) {
    throw new TenantScopeError(
      "BULK_SCOPE_VIOLATION",
      `${entityName} include one or more records outside the permitted company scope`,
    );
  }
}
