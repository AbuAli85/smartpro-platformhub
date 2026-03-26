import { AuthError } from "../../auth/guards";
import { TenantScopeError } from "../../data/tenant-scope";

export interface MappedApiError {
  status: number;
  code: string;
  message: string;
}

export function mapAuthRelatedError(error: unknown): MappedApiError {
  if (error instanceof AuthError) {
    switch (error.code) {
      case "UNAUTHENTICATED":
        return {
          status: 401,
          code: error.code,
          message: "Authentication required",
        };
      case "FORBIDDEN":
        return {
          status: 403,
          code: error.code,
          message: "You do not have permission to perform this action",
        };
      case "COMPANY_SCOPE_DENIED":
        return {
          status: 403,
          code: error.code,
          message: "You do not have access to this company scope",
        };
      case "RECORD_SCOPE_DENIED":
        return {
          status: 404,
          code: error.code,
          message: "Resource not found",
        };
    }
  }

  if (error instanceof TenantScopeError) {
    switch (error.code) {
      case "MISSING_COMPANY_SCOPE":
        return {
          status: 400,
          code: error.code,
          message: "Company scope is required",
        };
      case "RECORD_NOT_FOUND":
      case "RECORD_SCOPE_MISMATCH":
      case "BULK_SCOPE_VIOLATION":
        return {
          status: 404,
          code: error.code,
          message: "Resource not found",
        };
    }
  }

  return {
    status: 500,
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
  };
}
