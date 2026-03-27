Status: READY_FOR_AI
Priority: P0

# Add lightweight protected-handler discovery rules and candidate tripwires

## Objective
Define lightweight discovery rules that identify likely protected-handler candidates and surface them for onboarding review without introducing heavy auto-discovery or AST tooling.

## Scope
- protected-handler candidate definition
- candidate inventory helper
- discovery integrity test
- onboarding escalation rules
- docs for protected-handler discovery policy

## Acceptance Criteria
- candidate-handler expectation source exists
- tests verify candidate handlers are either inventoried or explicitly excluded
- docs created:
  - docs/testing/PROTECTED_HANDLER_DISCOVERY_RULES.md
  - docs/testing/PROTECTED_HANDLER_ONBOARDING_ESCALATION.md
