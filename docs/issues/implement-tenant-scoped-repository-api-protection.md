Status: READY_FOR_AI
Priority: P0

# Implement tenant-scoped repository and API protection pattern

## Objective

Standardize how SmartPRO reads and mutates tenant-scoped records so every repository and API path enforces company boundaries safely and consistently.

## Scope

- tenant-scoped repository query helpers
- required company filters for tenant records
- safe fetch-by-id patterns
- record-company verification helpers
- bulk operation scope checks
- first protected examples for cases and documents
- documentation for repository and API protection pattern

## Acceptance Criteria

- tenant-scoped repository helpers exist
- fetch-by-id patterns do not bypass company checks
- record scope verification is standardized
- bulk operations validate all target records belong to scope
- at least one case example and one document example are protected
- file created:
  - packages/data/tenant-scope.ts
  - docs/architecture/TENANT_SCOPED_QUERY_PATTERN.md
