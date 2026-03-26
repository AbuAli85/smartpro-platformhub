# First Protected API Test Matrix

## Scope
Initial protected backend surfaces:
- get case by id
- update document status
- admin role assignment

## Case Read
1. authenticated company user with permission and matching company -> success
2. authenticated company user without permission -> 403
3. authenticated user without company access -> 403
4. authenticated user with company access but case not in company -> 404
5. unauthenticated caller -> 401

## Document Status Update
1. authenticated company user with verify permission and matching company -> success
2. authenticated company user without verify permission -> 403
3. authenticated user without company access -> 403
4. authenticated user with company access but document not in company -> 404
5. unauthenticated caller -> 401

## Admin Role Assignment
1. authenticated platform admin with roles:manage -> success
2. authenticated user without roles:manage -> 403
3. unauthenticated caller -> 401

## Additional Checks
- audit hook fires for admin role assignment
- tenant-owned queries include company scope
- auth and tenant errors map consistently
