Status: READY_FOR_AI
Priority: P0

# Add migration recovery guidance and checksum mismatch remediation flow

## Objective
Define how SmartPRO should recover safely when migration integrity problems occur, especially checksum mismatches, and document the correct remediation flow for local, CI, and shared environments.

## Scope
- checksum mismatch recovery guidance
- local reset policy
- shared-environment caution rules
- corrective migration rule set
- migration failure remediation doc
- migration operator runbook section

## Acceptance Criteria
- docs created:
  - docs/testing/MIGRATION_RECOVERY_GUIDE.md
  - docs/testing/CHECKSUM_MISMATCH_REMEDIATION.md
  - docs/testing/SHARED_ENVIRONMENT_MIGRATION_RULES.md
- recovery guidance distinguishes local vs shared environments
- docs clearly prohibit editing applied historical migrations
- corrective migration strategy is documented
