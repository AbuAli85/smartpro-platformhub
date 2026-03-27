Status: READY_FOR_AI
Priority: P0

# Add migration operator runbook and failure-response checklist

## Objective
Create an operator-facing runbook for SmartPRO migration incidents so failures can be handled consistently, with clear triage steps, evidence collection, and recovery decision rules.

## Scope
- migration operator runbook
- failure-response checklist
- evidence collection template
- decision tree for reset vs restore vs corrective migration
- local vs shared environment response flow
- docs for migration incident handling

## Acceptance Criteria
- docs created:
  - docs/testing/MIGRATION_OPERATOR_RUNBOOK.md
  - docs/testing/MIGRATION_FAILURE_RESPONSE_CHECKLIST.md
  - docs/testing/MIGRATION_EVIDENCE_COLLECTION_TEMPLATE.md
  - docs/testing/MIGRATION_RESPONSE_DECISION_TREE.md
- runbook distinguishes local disposable vs shared environments
- checklist is step-by-step and operator usable
- evidence template is concrete and repeatable
