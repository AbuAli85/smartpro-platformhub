Status: READY_FOR_AI
Priority: P0

# Add migration diagnostics, failure classification, and lock timeout policy

## Objective
Improve the SmartPRO migration runner with clearer diagnostics, explicit failure classification, and a configurable lock wait policy so migration failures are easier to understand and troubleshoot locally and in CI.

## Scope
- migration diagnostics output
- failure classification for lock, state, and SQL execution failures
- configurable lock wait vs fail-fast policy
- migration summary reporting
- docs for migration diagnostics and lock policy

## Acceptance Criteria
- migration runner prints a clear summary
- lock failure is classified distinctly
- migration SQL failure is classified distinctly
- configurable lock wait policy exists
- docs created:
  - docs/architecture/MIGRATION_DIAGNOSTICS_PATTERN.md
  - docs/testing/MIGRATION_LOCK_POLICY.md
