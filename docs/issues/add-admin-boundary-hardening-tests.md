Status: READY_FOR_AI
Priority: P0

# Add admin boundary hardening and privilege escalation prevention tests

## Objective
Harden SmartPRO admin boundaries by testing role-assignment abuse paths, invalid scope combinations, privilege escalation attempts, and audit persistence expectations for protected admin actions.

## Scope
- admin boundary integration tests
- invalid company/platform role assignment attempts
- permission escalation prevention tests
- role scope invariant tests
- audit event verification for successful admin actions
- docs for admin boundary testing pattern

## Acceptance Criteria
- admin role assignment abuse paths are tested
- invalid scope combinations are rejected
- unauthorized privilege escalation attempts are rejected
- successful admin action writes audit event
- docs created:
  - docs/testing/ADMIN_BOUNDARY_TEST_PATTERN.md
