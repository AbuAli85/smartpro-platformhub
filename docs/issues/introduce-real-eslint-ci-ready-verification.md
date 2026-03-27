Status: READY_FOR_AI
Priority: P0

# Introduce real ESLint and CI-ready verification layout

## Objective
Replace the temporary lint placeholder with real ESLint, and define a CI-ready verification contract so SmartPRO's local quality gate can transition cleanly into automated pipelines.

## Scope
- ESLint config and dependencies
- ESLint ignore rules
- update lint script to use ESLint
- introduce verify:ci script
- docs for CI-ready verification and environment contract
- update issues README with local vs CI guidance

## Acceptance Criteria
- ESLint is installed and configured
- lint script runs ESLint (not tsc)
- verify:ci script exists and matches gate steps
- docs created:
  - docs/testing/CI_READY_VERIFICATION_LAYOUT.md
  - docs/testing/ENVIRONMENT_CONTRACT.md
