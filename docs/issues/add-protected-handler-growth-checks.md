Status: READY_FOR_AI
Priority: P0

# Add onboarding automation-lite checks for new protected handlers

## Objective
Introduce lightweight checks that make growth of the protected-handler surface more intentional by requiring explicit onboarding consideration whenever new protected handlers are added.

## Scope
- protected-handler inventory helper
- onboarding automation-lite integrity test
- registry consideration checks for protected handlers
- docs for intentional protected-handler growth

## Acceptance Criteria
- tests verify inventoried protected handlers align with governed-handler expectations
- tests make untracked protected-handler growth visible
- docs created:
  - docs/testing/PROTECTED_HANDLER_GROWTH_PATTERN.md
