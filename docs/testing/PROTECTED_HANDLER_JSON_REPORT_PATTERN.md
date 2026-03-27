# Protected Handler JSON Report Pattern

## Purpose
Defines the machine-readable exclusion visibility output for SmartPRO protected-handler governance.

## Command
- `npm run review:protected-handlers:json`

## Output
- deterministic JSON array
- one object per exclusion
- fields:
  - handler
  - owner
  - rationale
  - reviewBy
  - isNearDue
  - isOverdue

## Principles
- JSON output should reuse the same summary model as the human-readable report
- machine-readable visibility should not introduce a second exclusion truth source
