import type { AuditRepository } from "./audit-repository";
import type { AuditEventInput, AuditEventRecord } from "./types";

export interface AuditService {
  log(input: AuditEventInput): Promise<AuditEventRecord>;
}

export function createAuditService(
  auditRepository: AuditRepository,
): AuditService {
  return {
    async log(input: AuditEventInput): Promise<AuditEventRecord> {
      return auditRepository.createEvent({
        actorUserId: input.actorUserId ?? null,
        actorType: input.actorType,
        companyId: input.companyId ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        before: input.before ?? null,
        after: input.after ?? null,
        metadata: input.metadata ?? null,
      });
    },
  };
}
