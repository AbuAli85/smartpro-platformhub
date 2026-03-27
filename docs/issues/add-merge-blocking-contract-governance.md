Status: READY_FOR_AI
Priority: P0

# Add merge-blocking governance rules for contract-governed handlers

## Objective
Define the rules that make boundary changes to contract-governed handlers explicit, reviewable, and merge-blocking unless the related contract assets are updated together.

## Scope
- merge-blocking governance rules
- intentional boundary change workflow
- contract drift classification
- required companion updates for governed handlers
- docs for contract-governance enforcement policy

## Acceptance Criteria
- docs created:
  - docs/testing/MERGE_BLOCKING_CONTRACT_GOVERNANCE.md
  - docs/testing/INTENTIONAL_BOUNDARY_CHANGE_WORKFLOW.md
  - docs/testing/CONTRACT_DRIFT_CLASSIFICATION.md
- rules define what must be updated together when a governed handler changes
- rules distinguish intentional boundary change vs accidental drift
