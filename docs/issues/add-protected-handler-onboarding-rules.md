Status: READY_FOR_AI
Priority: P0

# Add protected handler onboarding rules and merge-readiness checklist

## Objective
Define the minimum implementation, testing, documentation, and registry requirements that every new protected handler must satisfy before it is considered merge-ready.

## Scope
- protected handler onboarding checklist
- minimum boundary test requirements
- contract registry enrollment rules
- merge-readiness checklist for new protected handlers
- docs for onboarding and readiness governance

## Acceptance Criteria
- docs created:
  - docs/testing/PROTECTED_HANDLER_ONBOARDING_CHECKLIST.md
  - docs/testing/PROTECTED_HANDLER_MERGE_READINESS.md
- onboarding rules reference:
  - auth enforcement
  - permission enforcement
  - tenant enforcement when applicable
  - result-shape tests
  - error-semantics tests
  - success payload tests
  - response hygiene tests
  - contract fixture registration
