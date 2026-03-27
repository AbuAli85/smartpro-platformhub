export interface UserRoleRecord {
  id: string;
  userId: string;
  roleId: string;
  companyId: string | null;
  assignedByUserId: string | null;
  createdAt: string;
}

export interface AssignUserRoleParams {
  targetUserId: string;
  roleId: string;
  companyId?: string | null;
  assignedByUserId: string;
}

export interface UserRolesRepository {
  assignRole(params: AssignUserRoleParams): Promise<UserRoleRecord>;
}
