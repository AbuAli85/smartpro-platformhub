Status: READY_FOR_AI
Priority: P0

# Add API contract registry rules and boundary change governance

## Objective
Create a lightweight contract registry and governance rules so SmartPRO knows which handlers are boundary-locked, how new handlers join the contract suite, and how boundary changes must be reviewed.

## Scope
- API contract registry file
- registry validation rules
- handler onboarding rules
- boundary change governance doc
- review requirements for contract changes

## Acceptance Criteria
- contract registry exists for current protected handlers
- docs created:
  - docs/testing/API_CONTRACT_REGISTRY_PATTERN.md
  - docs/testing/BOUNDARY_CHANGE_GOVERNANCE.md
- registry includes:
  - handler name
  - contract fixture coverage
  - error semantics coverage
  - success payload coverage
