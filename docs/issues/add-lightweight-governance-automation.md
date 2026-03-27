Status: READY_FOR_AI
Priority: P0

# Add lightweight governance automation for governed handlers

## Objective
Introduce lightweight automated checks that detect governance drift for contract-governed handlers by verifying registry, documentation, and required policy assets stay aligned.

## Scope
- governed-handler governance integrity test
- registry-to-doc consistency checks
- required governance-doc presence checks
- docs for lightweight governance automation

## Acceptance Criteria
- tests verify every governed handler remains represented in the API contract registry
- tests verify governance docs referenced by the contract system remain present
- tests verify core contract-governance assets stay aligned
- docs created:
  - docs/testing/GOVERNANCE_AUTOMATION_LITE_PATTERN.md
