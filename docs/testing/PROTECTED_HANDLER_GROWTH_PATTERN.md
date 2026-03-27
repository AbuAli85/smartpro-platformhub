# Protected Handler Growth Pattern

## Purpose
Defines how SmartPRO keeps growth of the protected-handler surface intentional and reviewable.

## Strategy
Maintain an explicit protected-handler inventory and require it to stay aligned with:
- governed handler expectations
- API contract registry entries

## Why
A new protected handler should not appear silently without:
- onboarding consideration
- contract-governance consideration
- merge-readiness consideration

## Required Coverage
1. inventoried protected handlers remain aligned with governed handlers
2. inventoried protected handlers remain aligned with registry handlers
3. inventoried protected handlers remain unique

## Principles
- protected-handler growth should be explicit
- lightweight explicit inventories are preferred over heavy discovery in the first stage
- drift should fail verification early

## Implementation
- `tests/integration/helpers/protected-handler-inventory.ts` — `INVENTORIED_PROTECTED_HANDLERS`
- `tests/integration/handlers/protected-handler-growth.integrity.test.ts`
