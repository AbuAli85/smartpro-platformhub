# Local and CI Parity Rules

## Purpose
Defines how SmartPRO keeps local verification and CI verification aligned.

## Commands
- Local: `npm run verify`
- CI: `npm run verify:ci`

## Parity Rule
Both commands must validate the same underlying quality gate:
1. lint
2. typecheck
3. migrate
4. reset test DB
5. integration tests

## Allowed Difference
- local verification may have more readable staged output
- CI verification may use a simpler chained command

## Disallowed Difference
- CI must not skip checks that local verification expects for completion
- local verification must not rely on hidden manual steps absent from CI
