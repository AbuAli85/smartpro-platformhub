Status: READY_FOR_AI
Priority: P0

# Add exclusion review cadence and stale-exception rules

## Objective
Prevent explicit protected-handler exclusions from becoming permanent unmanaged exceptions by defining review cadence, stale-exception rules, and lightweight exception lifecycle governance.

## Scope
- exclusion review metadata helper
- stale-exception integrity test
- review cadence rules
- stale-exception policy docs

## Acceptance Criteria
- excluded handlers support review metadata
- tests verify every excluded handler has review metadata
- tests verify stale or incomplete exclusions fail integrity checks
- docs created:
  - docs/testing/PROTECTED_HANDLER_EXCLUSION_REVIEW_POLICY.md
  - docs/testing/PROTECTED_HANDLER_EXCEPTION_LIFECYCLE_PATTERN.md
