# Audit Event Test Matrix

## Scope
Initial persisted audit coverage for:
- admin role assignment

## Role Assignment
1. authenticated user with roles:manage assigns role -> action succeeds and audit row is created
2. authenticated user without roles:manage -> action denied and no audit row is created
3. unauthenticated caller -> action denied and no audit row is created

## Audit Row Expectations
Each created row should include:
- actor_user_id
- actor_type = user
- action = user_role.assigned
- entity_type = user_role
- entity_id = created user role id
- company_id matching assigned role scope if present
- after_json populated
- metadata_json populated

## Additional Checks
- audit event is written after successful business write
- audit event is not written for failed authorization
- audit event action names are stable
