/**
 * Contract for privileged / role-sensitive audit events.
 * Wire `log` to your audit service when it exists; routes should not write audit rows ad hoc.
 */

export interface AuditLogParams {
  actorUserId: string;
  action: string;
  entityType: string;
  entityId: string;
  companyId?: string | null;
  before?: unknown;
  after?: unknown;
  metadata?: Record<string, unknown>;
}

/** Suggested action strings for role lifecycle; use consistently in services. */
export const ROLE_AUDIT_ACTIONS = {
  USER_ROLE_ASSIGNED: "user_role.assigned",
  USER_ROLE_REMOVED: "user_role.removed",
  MEMBERSHIP_STATUS_CHANGED: "membership.status_changed",
} as const;

export type RoleAuditSink = {
  log(params: AuditLogParams): Promise<void> | void;
};

/**
 * Integration point for role assignment flows. Call from the service layer after
 * persisting the assignment, not from raw route handlers.
 */
export async function emitUserRoleAssigned(
  sink: RoleAuditSink | undefined,
  params: {
    actorUserId: string;
    userRoleId: string;
    userId: string;
    roleId: string;
    companyId?: string | null;
    after: Record<string, unknown>;
  },
): Promise<void> {
  if (!sink) return;
  await sink.log({
    actorUserId: params.actorUserId,
    action: ROLE_AUDIT_ACTIONS.USER_ROLE_ASSIGNED,
    entityType: "user_role",
    entityId: params.userRoleId,
    companyId: params.companyId,
    after: params.after,
    metadata: { userId: params.userId, roleId: params.roleId },
  });
}

export async function emitUserRoleRemoved(
  sink: RoleAuditSink | undefined,
  params: {
    actorUserId: string;
    userRoleId: string;
    userId: string;
    roleId: string;
    companyId?: string | null;
    before: Record<string, unknown>;
  },
): Promise<void> {
  if (!sink) return;
  await sink.log({
    actorUserId: params.actorUserId,
    action: ROLE_AUDIT_ACTIONS.USER_ROLE_REMOVED,
    entityType: "user_role",
    entityId: params.userRoleId,
    companyId: params.companyId,
    before: params.before,
    metadata: { userId: params.userId, roleId: params.roleId },
  });
}
