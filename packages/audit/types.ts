export type AuditActorType =
  | "user"
  | "system"
  | "automation"
  | "support_override";

export interface AuditEventInput {
  actorUserId?: string | null;
  actorType: AuditActorType;
  companyId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
  metadata?: Record<string, unknown> | null;
}

export interface AuditEventRecord {
  id: string;
  actorUserId: string | null;
  actorType: AuditActorType;
  companyId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  beforeJson: unknown | null;
  afterJson: unknown | null;
  metadataJson: unknown | null;
  createdAt: string;
}
