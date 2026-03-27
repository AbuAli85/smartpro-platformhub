# Protected Handler Discovery Rules

## Purpose
Defines how SmartPRO identifies likely protected-handler candidates for onboarding review.

## A handler is a protected-handler candidate if it likely:
- reads tenant-scoped data
- mutates tenant-scoped data
- performs privileged admin actions
- depends on auth, permissions, tenant scope, or invariants
- exposes a stable response boundary that clients or AI agents depend on

## Strategy
Use an explicit candidate list first.
Each candidate must be:
- inventoried as protected, or
- explicitly excluded from governance for a documented reason

## Why
This keeps protected-handler growth visible without introducing heavy discovery tooling too early.

## Rules
- candidate growth should be intentional
- unexplained new candidates should fail review
- explicit exclusion should be rare and reviewable

## Implementation
- `tests/integration/helpers/protected-handler-candidates.ts`
- `tests/integration/handlers/protected-handler-discovery.integrity.test.ts`
