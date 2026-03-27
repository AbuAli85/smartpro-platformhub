# Protected Handler Review Report Workflow

## Purpose
Defines how SmartPRO operators and maintainers inspect current protected-handler exclusions from the repo state.

## Command
- `npm run review:protected-handlers`

## Expected Output
- explicit empty-state message when no exclusions exist
- one deterministic line per exclusion when exclusions exist
- owner, review date, status, and rationale visible in the output

## When to Use
- before reviewing exclusion changes
- before governance cleanup work
- when checking near-due or overdue exclusions
- when validating exception ownership and review timing
