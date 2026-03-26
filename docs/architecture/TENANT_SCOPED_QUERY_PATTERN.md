# Tenant Scoped Query Pattern

## Purpose
Defines the required repository and API pattern for tenant-owned records in SmartPRO.

## Rules
- tenant-owned queries must be scoped by company_id
- fetch-by-id methods must have tenant-scoped variants
- update and delete operations must include company scope in the write query where practical
- bulk operations must validate all records belong to the permitted tenant
- route guards alone are insufficient without scoped data access

## Standard Sequence
1. authenticate
2. authorize permission
3. authorize company access
4. query within tenant scope
5. verify result exists
6. perform business action
7. emit audit event where needed

## Anti-Patterns
- getById without tenant filter for tenant-owned entities
- update by id only on tenant-owned records
- frontend filtering used as tenant protection
- trusting caller-provided record ownership
