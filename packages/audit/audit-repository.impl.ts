import type { DbExecutor } from "../data/db-adapter";
import type { AuditRepository } from "./audit-repository";
import type { AuditEventInput, AuditEventRecord } from "./types";

interface AuditEventRow {
  id: string;
  actor_user_id: string | null;
  actor_type: AuditEventRecord["actorType"];
  company_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  before_json: unknown | null;
  after_json: unknown | null;
  metadata_json: unknown | null;
  created_at: string;
  [key: string]: unknown;
}

function mapAuditEventRow(row: AuditEventRow): AuditEventRecord {
  return {
    id: row.id,
    actorUserId: row.actor_user_id,
    actorType: row.actor_type,
    companyId: row.company_id,
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id,
    beforeJson: row.before_json,
    afterJson: row.after_json,
    metadataJson: row.metadata_json,
    createdAt: row.created_at,
  };
}

export function createAuditRepositoryImpl(db: DbExecutor): AuditRepository {
  return {
    async createEvent(input: AuditEventInput): Promise<AuditEventRecord> {
      const result = await db.query<AuditEventRow>(
        `
        insert into public.audit_events (
          actor_user_id,
          actor_type,
          company_id,
          action,
          entity_type,
          entity_id,
          before_json,
          after_json,
          metadata_json
        )
        values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        returning
          id,
          actor_user_id,
          actor_type,
          company_id,
          action,
          entity_type,
          entity_id,
          before_json,
          after_json,
          metadata_json,
          created_at
        `,
        [
          input.actorUserId ?? null,
          input.actorType,
          input.companyId ?? null,
          input.action,
          input.entityType,
          input.entityId,
          input.before ?? null,
          input.after ?? null,
          input.metadata ?? null,
        ],
      );

      if (!result.rows[0]) {
        throw new Error("Audit insert returned no row");
      }

      return mapAuditEventRow(result.rows[0]);
    },
  };
}
