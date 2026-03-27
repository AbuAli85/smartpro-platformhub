import type { DbExecutor } from "./db-adapter";
import type {
  AssignUserRoleParams,
  UserRoleRecord,
  UserRolesRepository,
} from "./user-roles-repository";

interface UserRoleRow {
  id: string;
  user_id: string;
  role_id: string;
  company_id: string | null;
  assigned_by_user_id: string | null;
  created_at: string;
}

function mapUserRoleRow(row: UserRoleRow): UserRoleRecord {
  return {
    id: row.id,
    userId: row.user_id,
    roleId: row.role_id,
    companyId: row.company_id,
    assignedByUserId: row.assigned_by_user_id,
    createdAt: row.created_at,
  };
}

export function createUserRolesRepository(
  db: DbExecutor,
): UserRolesRepository {
  return {
    async assignRole(params: AssignUserRoleParams): Promise<UserRoleRecord> {
      const result = await db.query<UserRoleRow>(
        `
        insert into public.user_roles (
          user_id,
          role_id,
          company_id,
          assigned_by_user_id
        )
        values ($1, $2, $3, $4)
        returning
          id,
          user_id,
          role_id,
          company_id,
          assigned_by_user_id,
          created_at
        `,
        [
          params.targetUserId,
          params.roleId,
          params.companyId ?? null,
          params.assignedByUserId,
        ],
      );

      if (!result.rows[0]) {
        throw new Error("Failed to assign user role");
      }

      return mapUserRoleRow(result.rows[0]);
    },
  };
}
