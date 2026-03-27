Status: READY_FOR_AI
Priority: P0

# Add lightweight stale-review detection and near-due exception visibility

## Objective
Make protected-handler exclusions operationally visible by detecting overdue review dates and flagging near-due exceptions before they become stale.

## Scope
- near-due review threshold helper
- stale/near-due integrity test
- docs for exception aging visibility
- issue draft for exception review hygiene

## Acceptance Criteria
- tests fail when an exclusion review date is in the past
- tests can identify near-due exclusions within a defined threshold
- docs created:
  - docs/testing/PROTECTED_HANDLER_EXCEPTION_AGING_PATTERN.md
  - docs/testing/PROTECTED_HANDLER_REVIEW_VISIBILITY.md
