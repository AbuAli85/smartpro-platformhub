# Handler Contract Fixture Pattern

## Purpose
Defines how SmartPRO locks handler boundary contracts using explicit, reviewable fixtures instead of brittle full-output snapshots.

## Why
- UUIDs and timestamps make raw snapshots noisy
- explicit fixtures make diffs easier to review
- boundary contracts should stay stable without overfitting to dynamic values

## Required Coverage
- success payload key set
- failure error key set
- representative protected handlers
- explicit fixture source in test helpers

## Principles
- contract fixtures should be stable and human-readable
- fixtures should focus on boundary shape, not transient values
- contract drift should fail tests early

## Implementation
- `tests/integration/helpers/handler-contract-fixtures.ts` — `HANDLER_CONTRACT_FIXTURES`
- `tests/integration/handlers/handler-contract-fixtures.integration.test.ts`
