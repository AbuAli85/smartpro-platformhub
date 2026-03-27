Status: READY_FOR_AI
Priority: P0

# Add lightweight policy drift detection across governance docs

## Objective
Detect drift across SmartPRO governance documentation by verifying that the governed-handler set and core contract-governance assumptions stay consistent across policy docs, expectation helpers, and registry-linked assets.

## Scope
- cross-doc governed-handler consistency checks
- governance policy expectation helper
- lightweight policy drift detection tests
- docs for governance-doc integrity

## Acceptance Criteria
- tests verify governed-handler expectations stay aligned across governance helpers
- tests verify policy-level governed-handler assumptions remain consistent
- docs created:
  - docs/testing/GOVERNANCE_DOC_INTEGRITY_PATTERN.md
