# DB Integration Test Setup

## Purpose
Defines how SmartPRO runs integration tests against a real Postgres database.

## Requirements
- test database separate from development database
- migrations applied before tests
- test data isolated and resettable
- DATABASE_URL configured for test execution

## Initial Strategy
1. provision test database
2. apply migrations in order
3. seed minimum required records
4. run integration tests
5. clean test data between runs

## Recommended Coverage
- audit repository persistence
- tenant-scoped case reads
- tenant-scoped document updates
- transactional role assignment + audit persistence

## Rules
- integration tests must not run against production
- test fixtures should be explicit
- tenant boundary checks must be included in seeded scenarios
