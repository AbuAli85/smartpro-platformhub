# Quality Gate Pattern

## Purpose
Defines the minimum repeatable local verification gate for SmartPRO.

## Standard Gate
1. apply migrations
2. reset test database
3. run integration tests
4. fail fast on any error

## Rules
- `verify` is the primary local quality gate
- protected backend work should not be considered complete if `verify` fails
- migration, reset, and test steps should remain explicit in output
- quality gate behavior should be stable for both humans and AI agents

## Anti-Patterns
- manually running partial verification and assuming success
- skipping reset before DB-backed tests
- letting verification output become opaque or inconsistent
