# First End-to-End Flow Test Matrix

## Case Read Handler
1. authenticated user with company access and cases:read -> 200
2. authenticated user without cases:read -> 403
3. authenticated user without company access -> 403
4. authenticated user with company access but wrong company case id -> 404
5. unauthenticated request -> 401

## Document Status Update Handler
1. authenticated user with company access and documents:verify -> 200
2. authenticated user without documents:verify -> 403
3. authenticated user without company access -> 403
4. authenticated user with company access but wrong company document id -> 404
5. unauthenticated request -> 401

## Repository/Schema Checks
1. case query filters by company_id
2. document update filters by company_id
3. status constraints reject invalid values
4. tenant indexes support scoped lookups
