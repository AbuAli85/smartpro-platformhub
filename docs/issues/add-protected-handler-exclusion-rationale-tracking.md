Status: READY_FOR_AI
Priority: P0

# Add explicit exclusion rationale tracking for ungoverned handler candidates

## Objective
Prevent the explicit exclusion list for protected-handler candidates from becoming a dumping ground by requiring every ungoverned candidate to carry a clear, reviewable rationale.

## Scope
- exclusion rationale helper
- exclusion integrity test
- rationale completeness checks
- docs for exclusion governance

## Acceptance Criteria
- excluded handler candidates must have an explicit rationale
- rationale keys align with excluded handler names
- tests verify no excluded handler lacks a rationale
- docs created:
  - docs/testing/PROTECTED_HANDLER_EXCLUSION_POLICY.md
  - docs/testing/PROTECTED_HANDLER_EXCLUSION_INTEGRITY_PATTERN.md
