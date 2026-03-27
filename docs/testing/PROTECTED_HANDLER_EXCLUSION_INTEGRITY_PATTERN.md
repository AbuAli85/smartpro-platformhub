# Protected Handler Exclusion Integrity Pattern

## Purpose
Defines how SmartPRO verifies that explicit exclusions for protected-handler candidates remain reviewable and justified.

## Required Coverage
1. every excluded handler has a rationale
2. rationale entries correspond only to excluded handlers
3. exclusion identifiers remain unique

## Principles
- exclusions are exceptions, not a secondary inventory
- exclusions should remain rare
- unexplained exclusions should fail verification

## Implementation
- `tests/integration/handlers/protected-handler-exclusion.integrity.test.ts`
