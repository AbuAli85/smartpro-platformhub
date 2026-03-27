Status: READY_FOR_AI
Priority: P0

# Add first GitHub Actions verification workflow stub and CI pipeline design doc

## Objective
Create the first CI-ready verification workflow stub for SmartPRO and document the pipeline design, database assumptions, and local/CI parity rules.

## Scope
- GitHub Actions workflow stub
- CI verification step order
- Postgres service assumptions
- environment variable expectations
- migration and reset flow in CI
- pipeline design doc
- parity rules between local verify and CI verify

## Acceptance Criteria
- workflow file exists
- workflow runs verify:ci or equivalent steps
- docs created:
  - docs/testing/CI_PIPELINE_DESIGN.md
  - docs/testing/LOCAL_CI_PARITY_RULES.md
- workflow clearly separates verification from deployment
