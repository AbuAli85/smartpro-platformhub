# Postgres Adapter Pattern

## Purpose
Defines how SmartPRO connects repository implementations to a real Postgres database.

## Rules
- repositories depend on DbExecutor, not directly on pg Pool
- transaction entrypoint belongs in DbAdapter
- repositories must work with both normal and transactional executors
- SQL remains explicit and reviewable
- adapter handles begin/commit/rollback lifecycle

## Structure
- postgres-config.ts builds config and pool
- postgres-adapter.ts implements DbAdapter
- repositories consume DbExecutor
- services/actions initiate transactions where needed

## Anti-Patterns
- passing raw pool clients through route handlers
- repositories opening their own transaction boundaries
- hidden ORM magic that obscures tenant constraints
