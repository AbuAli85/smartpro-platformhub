Status: READY_FOR_AI
Priority: P0

# Add migration locking and concurrent-run safety

## Objective
Protect SmartPRO migrations from concurrent execution by introducing a migration lock strategy, lock timeout behavior, and clearer failure semantics for local and CI runs.

## Scope
- advisory lock strategy for migration runner
- lock acquisition and release behavior
- lock timeout / fail-fast behavior
- docs for concurrent-run safety
- CI safety notes for migration execution

## Acceptance Criteria
- migration runner acquires a lock before applying migrations
- concurrent runners cannot apply migrations at the same time
- lock is released safely after run completion or failure
- docs created:
  - docs/architecture/MIGRATION_LOCKING_PATTERN.md
  - docs/testing/MIGRATION_CONCURRENCY_RULES.md
