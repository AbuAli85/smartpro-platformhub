# Migration Recovery Guide

## Purpose
Defines how SmartPRO should recover from migration failures safely without corrupting schema history or applied-state integrity.

## Failure Categories
- lock unavailable
- SQL execution failure
- migration state recording failure
- checksum mismatch

## General Recovery Rules
1. do not edit already-applied migration files
2. do not delete migration state records casually
3. do not manually “fix” checksum mismatches by overwriting stored checksums
4. prefer corrective follow-up migrations over mutation of history
5. treat shared environments more strictly than disposable local environments

## Recommended Recovery by Failure Type

### LOCK_UNAVAILABLE
- ensure another runner is not active
- retry once the lock holder completes
- in CI, inspect overlapping jobs before rerun

### SQL_EXECUTION_FAILED
- inspect the failing migration file
- fix the issue with a new migration if history must remain immutable
- rerun only after root cause is understood

### STATE_RECORD_FAILED
- inspect database health and uniqueness/state issues
- confirm migration SQL did or did not apply
- resolve the state issue carefully before rerun

### CHECKSUM_MISMATCH
- stop immediately
- treat as migration integrity failure
- determine whether the file was changed after apply
- do not continue with normal migration execution until resolved
