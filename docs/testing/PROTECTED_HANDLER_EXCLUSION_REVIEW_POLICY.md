# Protected Handler Exclusion Review Policy

## Purpose
Defines how SmartPRO prevents explicit protected-handler exclusions from becoming unmanaged permanent exceptions.

## Rule
Every excluded protected-handler candidate must carry review metadata:
- rationale
- owner
- review-by date

## Review Cadence
Excluded handlers should be revisited on or before the recorded review date.

## Preferred Outcome
At review time, prefer one of:
1. onboard the handler into governed inventory
2. keep the exclusion with refreshed rationale and review metadata
3. remove the handler if it no longer qualifies as a candidate

## Principles
- exclusions are exceptions, not permanent hiding places
- every exception should have an owner
- every exception should have a review date

## Implementation
- `tests/integration/helpers/protected-handler-exclusion-review-metadata.ts`
