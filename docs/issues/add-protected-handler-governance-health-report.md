Status: READY_FOR_AI
Priority: P0

# Add CLI governance health report for protected-handler governance

## Objective
Provide a lightweight operator command that prints the current protected-handler governance health snapshot so maintainers can inspect governance status without opening helper files directly.

## Scope
- governance health CLI script
- package script for local operator use
- docs for governance health reporting workflow
- issue draft for governance health command

## Acceptance Criteria
- script prints deterministic governance health output
- script uses the existing governance health helper
- package script exists for running the report
- docs created:
  - docs/testing/PROTECTED_HANDLER_GOVERNANCE_HEALTH_REPORT_WORKFLOW.md
  - docs/testing/PROTECTED_HANDLER_GOVERNANCE_LOCAL_COMMANDS.md
