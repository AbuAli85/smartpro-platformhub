# Merge-Blocking Contract Governance

## Purpose
Defines when changes to contract-governed handlers must be treated as merge-blocking unless all related contract assets are updated together.

## Applies To
Any handler registered in the API contract registry.

## Merge-Blocking Boundary Changes
A change is merge-blocking if it modifies any of the following:
- success payload field set
- failure status/code mapping
- result-shape contract
- response hygiene expectations
- contract fixture linkage
- registry coverage truthfulness

## Required Companion Updates
When a governed handler changes at the boundary, the following must be updated together as applicable:
- handler implementation
- contract fixture tests
- result-shape tests
- error-semantics tests
- success payload tests
- response hygiene tests
- registry entry
- boundary/governance docs if meaning changes

## Rule
A governed boundary change is not merge-ready unless the related contract assets move together and `npm run verify` passes.

## Related
- `BOUNDARY_CHANGE_GOVERNANCE.md`
- `PROTECTED_HANDLER_MERGE_READINESS.md`
- `API_CONTRACT_REGISTRY_PATTERN.md`
