# Registry-to-Test Coverage Pattern

## Purpose
Defines how SmartPRO verifies that registered protected handlers remain backed by real contract fixtures and declared coverage.

## Required Coverage
1. every registry entry references an existing contract fixture
2. fixture identifiers remain unique
3. coverage flags remain complete for governed handlers

## Principles
- the API contract registry is only useful if it stays connected to real test assets
- registry drift must fail verification early
- coverage declarations must stay explicit and truthful
- lightweight integrity checks are preferred over heavy automation in the first stage

## Implementation
- `tests/integration/handlers/registry-to-test-coverage.integrity.test.ts`
- Related: `api-contract-registry.integrity.test.ts` (registry ↔ fixture linkage and flags)
