# Protected Handler Review Visibility

## Purpose
Defines how SmartPRO makes exclusion reviews operationally visible before they become stale.

## Current Visibility Rule
- excluded handlers must have review metadata
- review dates in the past fail integrity checks
- near-due review dates can be detected within the configured threshold

## Threshold
- `PROTECTED_HANDLER_EXCLUSION_NEAR_DUE_DAYS` (see `protected-handler-exclusion-aging.ts`)

## Why
This gives the team time to:
- onboard the handler
- refresh the exclusion with justification
- remove the candidate if no longer applicable
