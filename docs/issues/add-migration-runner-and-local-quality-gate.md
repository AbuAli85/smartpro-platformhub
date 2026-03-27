Status: READY_FOR_AI
Priority: P0

# Add migration runner, test database reset workflow, and repeatable local quality gate

## Objective
Create a repeatable local verification workflow for SmartPRO that applies migrations in order, prepares a test database, and runs the first quality gate consistently.

## Scope
- migration runner script
- test database reset script
- migration order convention
- local verification command chain
- package.json scripts for dev verification
- docs for migration and test execution workflow
- issue publishing guidance update if needed

## Acceptance Criteria
- migration runner script exists
- test DB reset script exists
- package scripts exist for migrate, reset-test-db, and verify
- migration order is explicit and deterministic
- docs created:
  - docs/architecture/MIGRATION_RUNNER_PATTERN.md
  - docs/testing/LOCAL_VERIFICATION_WORKFLOW.md
