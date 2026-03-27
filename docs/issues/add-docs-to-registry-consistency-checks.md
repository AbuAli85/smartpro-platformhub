Status: READY_FOR_AI
Priority: P0

# Add docs-to-registry consistency checks for governed handlers

## Objective
Verify that SmartPRO governance documentation and the API contract registry stay aligned so governed-handler policy docs cannot silently drift away from actual registered handler coverage.

## Scope
- governed-handler documentation expectation source
- docs-to-registry consistency tests
- registry-to-documented-handler checks
- docs for governed-handler documentation alignment

## Acceptance Criteria
- tests verify documented governed handlers align with API contract registry entries
- tests verify documented governed handlers remain unique
- docs created:
  - docs/testing/GOVERNED_HANDLER_DOCUMENTATION_ALIGNMENT_PATTERN.md
