import type { AuthContext } from "../../auth/auth-context";
import { requireAuth, requirePermission } from "../../auth/guards";
import { PERMISSIONS } from "../../auth/permissions";
import type { AuditService } from "../../audit/audit-service";

export interface AssignUserRoleInput {
  targetUserId: string;
  roleId: string;
  companyId?: string | null;
}

export interface UserRoleRecord {
  id: string;
  userId: string;
  roleId: string;
  companyId: string | null;
}

export interface UserRoleRepository {
  assignRole(input: {
    targetUserId: string;
    roleId: string;
    companyId?: string | null;
    assignedByUserId: string;
  }): Promise<UserRoleRecord>;
}

export interface AssignUserRoleDeps {
  auth: AuthContext | null | undefined;
  userRoleRepository: UserRoleRepository;
  auditService: AuditService;
}

export async function assignUserRole(
  deps: AssignUserRoleDeps,
  input: AssignUserRoleInput,
): Promise<UserRoleRecord> {
  const auth = requireAuth(deps.auth);
  requirePermission(auth, PERMISSIONS.ROLES_MANAGE);

  const created = await deps.userRoleRepository.assignRole({
    targetUserId: input.targetUserId,
    roleId: input.roleId,
    companyId: input.companyId ?? null,
    assignedByUserId: auth.userId,
  });

  await deps.auditService.log({
    actorUserId: auth.userId,
    actorType: "user",
    companyId: created.companyId,
    action: "user_role.assigned",
    entityType: "user_role",
    entityId: created.id,
    after: {
      userId: created.userId,
      roleId: created.roleId,
      companyId: created.companyId,
    },
    metadata: {
      targetUserId: created.userId,
      assignedByUserId: auth.userId,
    },
  });

  return created;
}
