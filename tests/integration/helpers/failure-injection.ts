import type { AuditRepository } from "../../../packages/audit/audit-repository";
import type {
  AuditEventInput,
  AuditEventRecord,
} from "../../../packages/audit/types";

export function createFailingAuditRepository(
  message = "Injected audit failure",
): AuditRepository {
  return {
    async createEvent(_input: AuditEventInput): Promise<AuditEventRecord> {
      throw new Error(message);
    },
  };
}
