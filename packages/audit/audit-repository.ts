import type { AuditEventInput, AuditEventRecord } from "./types";

export interface AuditRepository {
  createEvent(input: AuditEventInput): Promise<AuditEventRecord>;
}

/**
 * Replace with actual DB adapter implementation.
 */
export function createAuditRepository(): AuditRepository {
  return {
    async createEvent() {
      throw new Error("Not implemented");
    },
  };
}
