# Intentional Boundary Change Workflow

## Purpose
Defines the required workflow for making an intentional change to a contract-governed handler boundary.

## Workflow
1. identify that the handler is contract-governed
2. determine what boundary surface is changing
3. update implementation intentionally
4. update related contract tests and fixtures
5. update registry entry if coverage or fixture linkage changes
6. update docs if contract meaning changes
7. run `npm run verify`
8. review the change explicitly as a boundary change

## Boundary Surfaces
- success payload keys
- error status/code behavior
- result shape
- response hygiene expectations

## Rule
Boundary changes must never appear as incidental side effects of unrelated refactors.

## Related
- `MERGE_BLOCKING_CONTRACT_GOVERNANCE.md`
- `CONTRACT_DRIFT_CLASSIFICATION.md`
- `PROTECTED_HANDLER_ONBOARDING_CHECKLIST.md`
