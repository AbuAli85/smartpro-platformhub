import type { AuthContext } from "../../auth/auth-context";
import { emitUserRoleAssigned, type RoleAuditSink } from "../../auth/audit-hooks";
import { requireAuth, requirePermission } from "../../auth/guards";
import { PERMISSIONS } from "../../auth/permissions";

interface AssignUserRoleInput {
  targetUserId: string;
  roleId: string;
  companyId?: string | null;
}

interface UserRoleRecord {
  id: string;
  userId: string;
  roleId: string;
  companyId: string | null;
}

interface UserRoleRepository {
  assignRole(
    input: AssignUserRoleInput & { assignedByUserId: string },
  ): Promise<UserRoleRecord>;
}

interface AssignUserRoleDeps {
  auth: AuthContext | null | undefined;
  userRoleRepository: UserRoleRepository;
  auditSink: RoleAuditSink;
}

export async function assignUserRoleExample(
  deps: AssignUserRoleDeps,
  input: AssignUserRoleInput,
): Promise<UserRoleRecord> {
  const auth = requireAuth(deps.auth);
  requirePermission(auth, PERMISSIONS.ROLES_MANAGE);

  const created = await deps.userRoleRepository.assignRole({
    ...input,
    assignedByUserId: auth.userId,
  });

  await emitUserRoleAssigned(deps.auditSink, {
    actorUserId: auth.userId,
    userRoleId: created.id,
    userId: created.userId,
    roleId: created.roleId,
    companyId: created.companyId,
    after: {
      userId: created.userId,
      roleId: created.roleId,
      companyId: created.companyId,
    },
  });

  return created;
}
