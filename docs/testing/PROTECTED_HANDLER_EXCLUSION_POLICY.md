# Protected Handler Exclusion Policy

## Purpose
Defines when a protected-handler candidate may remain outside the governed inventory and what documentation is required.

## Rule
Every explicitly ungoverned protected-handler candidate must have a clear, reviewable rationale.

## Allowed Reasons
Examples:
- internal-only helper boundary
- non-stable surface by design
- not tenant- or privilege-sensitive
- temporary exception pending redesign

## Disallowed Pattern
Do not exclude a handler simply to avoid onboarding or contract governance work.

## Preferred Outcome
If a handler looks boundary-critical, prefer onboarding into the governed inventory rather than exclusion.

## Implementation
- `tests/integration/helpers/protected-handler-exclusion-rationales.ts` — `PROTECTED_HANDLER_EXCLUSION_RATIONALES`
