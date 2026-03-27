# Strict Completion Gate

## Purpose
Defines the first strict local completion gate for SmartPRO implementation work.

## A task is not complete unless all of the following pass
1. lint
2. typecheck
3. migrations apply successfully
4. test database reset succeeds
5. integration tests pass

## Applies to
- backend implementation tasks
- repository changes
- auth and RBAC changes
- tenant-scope changes
- audit and transaction changes
- schema and migration changes

## Rules
- passing only one or two steps is insufficient
- protected backend work should not be marked complete if `npm run verify` fails
- AI-generated implementation is subject to the same gate
