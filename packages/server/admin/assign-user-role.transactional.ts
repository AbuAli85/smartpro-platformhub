import type { AuthContext } from "../../auth/auth-context";
import { requireAuth, requirePermission } from "../../auth/guards";
import { PERMISSIONS } from "../../auth/permissions";
import { createAuditRepositoryImpl } from "../../audit/audit-repository.impl";
import { createAuditService } from "../../audit/audit-service";
import type { DbAdapter, DbTransaction } from "../../data/db-adapter";
import { createUserRolesRepository } from "../../data/user-roles-repository.impl";
import type { UserRoleRecord } from "../../data/user-roles-repository";
import { RoleScopeInvariantError } from "../errors/role-scope-invariant-error";

export interface AssignUserRoleTransactionalInput {
  targetUserId: string;
  roleId: string;
  companyId?: string | null;
}

export interface AssignUserRoleTransactionalDeps {
  auth: AuthContext | null | undefined;
  db: DbAdapter;
}

export async function assignUserRoleTransactional(
  deps: AssignUserRoleTransactionalDeps,
  input: AssignUserRoleTransactionalInput,
): Promise<UserRoleRecord> {
  const auth = requireAuth(deps.auth);
  requirePermission(auth, PERMISSIONS.ROLES_MANAGE);

  return deps.db.transaction(async (tx) => {
    await assertRoleAssignmentMatchesScope(tx, input);

    const userRolesRepository = createUserRolesRepository(tx);
    const auditRepository = createAuditRepositoryImpl(tx);
    const auditService = createAuditService(auditRepository);

    const created = await userRolesRepository.assignRole({
      targetUserId: input.targetUserId,
      roleId: input.roleId,
      companyId: input.companyId ?? null,
      assignedByUserId: auth.userId,
    });

    await auditService.log({
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
  });
}

async function assertRoleAssignmentMatchesScope(
  tx: DbTransaction,
  input: AssignUserRoleTransactionalInput,
): Promise<void> {
  const result = await tx.query<{ scope_type: string }>(
    `
    select scope_type
    from public.roles
    where id = $1
    limit 1
    `,
    [input.roleId],
  );

  const scopeType = result.rows[0]?.scope_type;
  if (!scopeType) {
    throw new RoleScopeInvariantError("Role not found");
  }

  const companyId = input.companyId ?? null;

  if (scopeType === "company" && !companyId) {
    throw new RoleScopeInvariantError("Company role requires company_id");
  }

  if (scopeType === "platform" && companyId !== null) {
    throw new RoleScopeInvariantError(
      "Platform role cannot be assigned with company_id",
    );
  }
}
