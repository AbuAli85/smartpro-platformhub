# Migration Locking Pattern

## Purpose
Defines how SmartPRO prevents concurrent migration runners from applying schema changes at the same time.

## Strategy
Use a PostgreSQL advisory lock acquired by the migration runner before migration execution begins.

## Rules
1. runner must acquire migration lock before checking pending migrations
2. if lock cannot be acquired, the run fails fast
3. migration files are applied only while the lock is held
4. applied-state recording happens while the same runner holds the lock
5. lock must be released on completion or failure

## Why
Migration state tracking alone prevents rerun duplication, but does not prevent concurrent runners from racing before applied state is recorded.

## Current Scope
- local runner safety
- CI runner safety
- single database migration ownership during execution
