Status: READY_FOR_AI
Priority: P0

# Add lint and typecheck to the quality gate and define the first strict completion gate

## Objective
Strengthen SmartPRO's local quality gate by adding lint and typecheck steps before database and integration verification, and document the first strict completion gate for implementation work.

## Scope
- lint script
- typecheck script
- quality gate runner update
- package script normalization
- strict completion gate documentation
- verification workflow update
- issue README update if needed

## Acceptance Criteria
- package scripts exist for lint and typecheck
- verify runs lint, typecheck, migrate, reset-test-db, and integration tests
- quality gate runner prints stage-by-stage status
- docs created:
  - docs/testing/STRICT_COMPLETION_GATE.md
  - docs/testing/QUALITY_GATE_EXPANSION.md
