# Transactional Flow Test Matrix

## Assign User Role + Audit Event

### Success
1. authenticated caller with roles:manage assigns role
2. user_role row is created
3. audit_event row is created
4. transaction commits

### Failure: audit write fails
1. authenticated caller with roles:manage attempts role assignment
2. role insert succeeds initially
3. audit insert fails
4. transaction rolls back
5. no user_role row remains
6. no audit_event row remains

### Failure: role write fails
1. authenticated caller with roles:manage attempts invalid role assignment
2. role insert fails
3. audit write is not persisted
4. transaction rolls back

### Authorization failures
1. unauthenticated caller -> 401, no writes
2. caller without roles:manage -> 403, no writes
