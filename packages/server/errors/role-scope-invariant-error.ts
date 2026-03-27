export class RoleScopeInvariantError extends Error {
  readonly code = "INVALID_ROLE_SCOPE" as const;

  constructor(message: string) {
    super(message);
    this.name = "RoleScopeInvariantError";
  }
}
