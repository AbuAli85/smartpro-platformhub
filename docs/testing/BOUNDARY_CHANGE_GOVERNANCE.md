# Boundary Change Governance

## Purpose
Defines how SmartPRO reviews and governs changes to protected handler boundaries.

## A boundary change includes
- success payload field changes
- error status/code mapping changes
- result-shape changes
- addition or removal of exposed fields
- handler contract fixture updates

## Required actions for boundary changes
1. update contract fixture if intentional (`handler-contract-fixtures.ts` and related tests)
2. update related handler boundary tests (result shape, error semantics, success payload, hygiene, fixtures)
3. update registry coverage when adding a new governed handler (`api-contract-registry.ts`)
4. update documentation when the contract meaning changes (`HANDLER_*_PATTERN.md`, `map-auth-errors`, etc.)
5. review the change explicitly as an API boundary change

## Rules
- accidental boundary drift must fail tests
- intentional boundary changes must be documented and reviewed
- protected handlers should not change exposed contract shape casually

## Registry
See `API_CONTRACT_REGISTRY_PATTERN.md` and `tests/integration/helpers/api-contract-registry.ts`.
