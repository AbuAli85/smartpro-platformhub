# CI-Ready Verification Layout

## Purpose
Align local verification with future CI execution.

## Local Command
- `npm run verify`

Readable, staged, fail-fast output.

## CI Command
- `npm run verify:ci`

Deterministic, no formatting assumptions.

## Shared Gate Steps
1. lint
2. typecheck
3. migrate
4. reset test database
5. integration tests

## Rule
Both commands must validate the same behavior.
