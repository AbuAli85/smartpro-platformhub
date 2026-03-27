# Contract Drift Classification

## Purpose
Defines how SmartPRO distinguishes accidental contract drift from intentional boundary change.

## Accidental Drift
A change is accidental drift if:
- tests fail unexpectedly after unrelated work
- fixture expectations no longer match implementation with no planned contract change
- registry coverage becomes stale
- a governed handler starts leaking new fields or semantics unintentionally

## Intentional Boundary Change
A change is intentional only if:
- the boundary change is deliberate
- related fixtures/tests are updated together
- docs are updated where meaning changes
- the change is reviewed explicitly as a boundary change

## Rule
If a governed handler changes but contract assets were not updated intentionally, treat it as drift and block merge.

## Related
- `MERGE_BLOCKING_CONTRACT_GOVERNANCE.md`
- `INTENTIONAL_BOUNDARY_CHANGE_WORKFLOW.md`
- `REGISTRY_TO_TEST_COVERAGE_PATTERN.md`
