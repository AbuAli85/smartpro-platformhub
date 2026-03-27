# Handler Error Semantics Pattern

## Purpose
Defines the stable error semantics contract for SmartPRO protected handlers.

## Required Mappings
- unauthenticated → `401` / `UNAUTHENTICATED`
- missing permission → `403` / `FORBIDDEN`
- company scope denied → `403` / `COMPANY_SCOPE_DENIED`
- record not found in permitted scope → `404` / `RECORD_NOT_FOUND`
- invalid role scope → `400` / `INVALID_ROLE_SCOPE`

## Principles
- handler error semantics are part of the API boundary contract
- status/code mappings must remain stable
- tests should verify both status and machine-readable code
- behavior should match the implemented codebase, not abstract preference

## Implementation
- `mapAuthRelatedError` and `RoleScopeInvariantError` mapping in `packages/server/errors/map-auth-errors.ts`
- `tests/integration/handlers/handler-error-semantics.integration.test.ts` locks the mappings for representative handlers
