# Protected API Pattern

## Purpose
Defines the standard protection sequence for SmartPRO backend routes and procedures.

## Platform Admin Pattern
1. authenticate
2. require platform permission
3. execute service/repository action
4. emit audit event if privileged
5. return structured result

## Tenant Read Pattern
1. authenticate
2. require company access
3. require tenant-scoped permission
4. query within company scope
5. if not found, return not found in permitted scope
6. return record

## Tenant Mutation Pattern
1. authenticate
2. require company access
3. require tenant-scoped permission
4. mutate within company scope
5. if not found, return not found in permitted scope
6. emit audit event if privileged
7. return record

## 404 vs 403
- use 403 when permission to perform the action is missing
- use 404 for tenant-owned record lookups that are missing or out of permitted scope

## Anti-Patterns
- permission checks only in frontend
- getById without tenant-scoped query for tenant records
- mutation by id only for tenant-owned entities
- raw role assignment logic in route handlers without audit
