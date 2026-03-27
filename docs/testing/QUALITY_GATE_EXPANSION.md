# Quality Gate Expansion

## Purpose
Documents the expanded SmartPRO local verification gate.

## Current Gate
1. lint
2. typecheck
3. migrate
4. reset test database
5. run integration tests

## Why this expansion matters
- lint catches structural issues and obvious anti-patterns
- typecheck catches contract drift
- migrations validate schema sequence
- test DB reset keeps runs deterministic
- integration tests verify real behavior

## Standard Command
- `npm run verify`

## Expected Output
The gate should print stage-by-stage progress and fail fast on the first failing step.
