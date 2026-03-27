# Local Verification Workflow

## Purpose
Defines the minimum repeatable local quality gate for SmartPRO.

## Standard Flow
1. ensure DATABASE_URL points to a safe local or test database
2. run migrations
3. reset test database
4. run integration tests
5. review failures before continuing

## Commands
- `npm run migrate`
- `npm run reset-test-db`
- `npm run verify`

## Rules
- never run reset against production
- use a dedicated test database for reset workflows
- verify migrations before running repository or transactional tests
- treat failing integration tests as blocking for protected backend work

## Current Coverage Focus
- audit persistence
- tenant-scoped repository behavior
- transactional role assignment
- protected end-to-end flow scaffolds
