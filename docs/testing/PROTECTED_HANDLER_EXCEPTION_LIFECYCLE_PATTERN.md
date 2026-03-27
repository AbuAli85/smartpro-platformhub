# Protected Handler Exception Lifecycle Pattern

## Purpose
Defines the lifecycle expectations for explicit protected-handler exclusions.

## Lifecycle
1. candidate identified
2. temporary exclusion recorded with rationale
3. owner assigned
4. review date assigned
5. review performed
6. handler either:
   - onboarded into governed inventory
   - kept excluded with refreshed metadata
   - removed from candidate set if no longer applicable

## Integrity Goals
- no exclusion without rationale
- no exclusion without owner
- no exclusion without review date
- no orphan metadata
- no silent permanent exceptions

## Implementation
- `tests/integration/handlers/protected-handler-exclusion-review.integrity.test.ts`
- Rationale must stay aligned with `PROTECTED_HANDLER_EXCLUSION_RATIONALES`
- `reviewBy` must be today or future (UTC date) to avoid stale exclusions
