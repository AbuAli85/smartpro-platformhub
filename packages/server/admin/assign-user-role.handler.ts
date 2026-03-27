import type { AuthContext } from "../../auth/auth-context";
import type { DbAdapter } from "../../data/db-adapter";
import { mapAuthRelatedError } from "../errors/map-auth-errors";
import {
  assignUserRoleTransactional,
  type AssignUserRoleTransactionalInput,
} from "./assign-user-role.transactional";

export interface AssignUserRoleTransactionalHandlerDeps {
  auth: AuthContext | null | undefined;
  db: DbAdapter;
}

export async function assignUserRoleTransactionalHandler(
  deps: AssignUserRoleTransactionalHandlerDeps,
  input: AssignUserRoleTransactionalInput,
) {
  try {
    const data = await assignUserRoleTransactional(deps, input);
    return {
      status: 200,
      data,
    };
  } catch (error) {
    const mapped = mapAuthRelatedError(error);
    return {
      status: mapped.status,
      error: mapped,
    };
  }
}
