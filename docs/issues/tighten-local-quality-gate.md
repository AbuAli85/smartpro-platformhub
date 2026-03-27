Status: READY_FOR_AI
Priority: P0

# Tighten local quality gate and add failure injection plus verification reporting

## Objective
Strengthen SmartPRO's local verification loop by formalizing failure injection for transactional tests, adding a single quality-gate runner, and producing clearer pass/fail reporting for migrations and integration tests.

## Scope
- quality gate runner script
- failure injection helper for transactional tests
- verification summary output
- package script cleanup
- docs for quality gate behavior and failure modes
- issue publishing guidance update if needed

## Acceptance Criteria
- quality gate runner exists
- transactional failure injection is reusable
- verify output is summarized clearly
- package scripts are simplified around one primary verification command
- docs created:
  - docs/testing/QUALITY_GATE_PATTERN.md
  - docs/testing/FAILURE_INJECTION_PATTERN.md
