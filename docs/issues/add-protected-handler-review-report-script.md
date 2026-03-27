Status: READY_FOR_AI
Priority: P0

# Add CLI review report script for protected-handler exclusion visibility

## Objective
Provide a lightweight operator command that prints the current protected-handler exclusion review summary from the repo state so maintainers can inspect exclusions without opening test helpers manually.

## Scope
- exclusion review report script
- package script for local operator use
- docs for exclusion visibility workflow
- issue draft for review reporting command

## Acceptance Criteria
- script prints deterministic exclusion summary output
- script uses the existing summary helper
- package script exists for running the report
- docs created:
  - docs/testing/PROTECTED_HANDLER_REVIEW_REPORT_WORKFLOW.md
  - docs/testing/PROTECTED_HANDLER_LOCAL_VISIBILITY_COMMANDS.md
