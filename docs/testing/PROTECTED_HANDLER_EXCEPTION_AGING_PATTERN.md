# Protected Handler Exception Aging Pattern

## Purpose
Defines how SmartPRO keeps explicit protected-handler exclusions visible as they approach review.

## Goals
- no exclusion silently ages out
- overdue exclusions fail integrity checks
- near-due exclusions can be identified consistently

## Current Strategy
- review dates are required
- stale dates are invalid
- near-due review windows are computed with a small explicit threshold

## Principles
- exception governance should be proactive, not only reactive
- aging checks should remain lightweight and deterministic
- empty exclusion state should remain valid

## Implementation
- `tests/integration/helpers/protected-handler-exclusion-aging.ts`
- `tests/integration/handlers/protected-handler-exclusion-aging.integrity.test.ts`
