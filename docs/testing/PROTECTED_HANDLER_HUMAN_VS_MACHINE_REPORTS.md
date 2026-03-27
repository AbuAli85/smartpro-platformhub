# Protected Handler Human vs Machine Reports

## Purpose
Defines the two supported visibility modes for protected-handler exclusion reporting.

## Human-readable
- `npm run review:protected-handlers`

Use when:
- reviewing exclusions manually
- checking owners and review dates quickly
- inspecting near-due or overdue status in plain text

## Machine-readable
- `npm run review:protected-handlers:json`

Use when:
- feeding lightweight tooling
- validating structured exclusion output
- preparing future automation without changing the summary model

## Rule
Both report modes must derive from the same underlying exclusion summary helper.
