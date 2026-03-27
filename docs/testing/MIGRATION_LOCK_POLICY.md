# Migration Lock Policy

## Purpose
Defines how SmartPRO migration locking behaves in local and CI contexts.

## Supported Modes

### fail_fast
- default
- runner fails immediately if lock is unavailable

### wait
- runner retries advisory lock acquisition until timeout
- useful for controlled automation scenarios

## Environment Variables
- `MIGRATION_LOCK_MODE`
- `MIGRATION_LOCK_TIMEOUT_MS`

## Default Behavior
- mode: `fail_fast`
- timeout: `10000`

## Rules
- local verification may prefer fail_fast for faster feedback
- CI may optionally use wait mode in environments where short overlap is possible
- lock policy must remain explicit and visible in docs
