# Protected Handler Governance Index

## Purpose
Provides a single navigation point for SmartPRO’s protected-handler governance system.

## Core Governance
- `docs/testing/PROTECTED_HANDLER_ONBOARDING_CHECKLIST.md`
- `docs/testing/PROTECTED_HANDLER_MERGE_READINESS.md`
- `docs/testing/BOUNDARY_CHANGE_GOVERNANCE.md`
- `docs/testing/MERGE_BLOCKING_CONTRACT_GOVERNANCE.md`
- `docs/testing/INTENTIONAL_BOUNDARY_CHANGE_WORKFLOW.md`
- `docs/testing/CONTRACT_DRIFT_CLASSIFICATION.md`

## Contract System
- `docs/testing/API_CONTRACT_REGISTRY_PATTERN.md`
- `docs/testing/HANDLER_CONTRACT_FIXTURE_PATTERN.md`
- `docs/testing/HANDLER_RESULT_CONTRACT_PATTERN.md`
- `docs/testing/HANDLER_ERROR_SEMANTICS_PATTERN.md`
- `docs/testing/HANDLER_SUCCESS_PAYLOAD_PATTERN.md`
- `docs/testing/RESPONSE_BOUNDARY_HYGIENE_PATTERN.md`

## Growth and Discovery
- `docs/testing/PROTECTED_HANDLER_GROWTH_PATTERN.md`
- `docs/testing/PROTECTED_HANDLER_DISCOVERY_RULES.md`
- `docs/testing/PROTECTED_HANDLER_ONBOARDING_ESCALATION.md`

## Exclusions and Review Lifecycle
- `docs/testing/PROTECTED_HANDLER_EXCLUSION_POLICY.md`
- `docs/testing/PROTECTED_HANDLER_EXCLUSION_INTEGRITY_PATTERN.md`
- `docs/testing/PROTECTED_HANDLER_EXCLUSION_REVIEW_POLICY.md`
- `docs/testing/PROTECTED_HANDLER_EXCEPTION_LIFECYCLE_PATTERN.md`
- `docs/testing/PROTECTED_HANDLER_EXCEPTION_AGING_PATTERN.md`
- `docs/testing/PROTECTED_HANDLER_REVIEW_VISIBILITY.md`
- `docs/testing/PROTECTED_HANDLER_REVIEW_SUMMARY_PATTERN.md`
- `docs/testing/PROTECTED_HANDLER_OPERATOR_VISIBILITY.md`
- `docs/testing/PROTECTED_HANDLER_JSON_REPORT_PATTERN.md`
- `docs/testing/PROTECTED_HANDLER_HUMAN_VS_MACHINE_REPORTS.md`
- `docs/testing/PROTECTED_HANDLER_REPORT_PARITY_PATTERN.md`

## Documentation and Governance Integrity
- `docs/testing/GOVERNED_HANDLER_DOCUMENTATION_ALIGNMENT_PATTERN.md`
- `docs/testing/GOVERNANCE_AUTOMATION_LITE_PATTERN.md`
- `docs/testing/GOVERNANCE_DOC_INTEGRITY_PATTERN.md`
- `docs/testing/REGISTRY_TO_TEST_COVERAGE_PATTERN.md`

## Key Helpers
- `tests/integration/helpers/api-contract-registry.ts`
- `tests/integration/helpers/handler-contract-fixtures.ts`
- `tests/integration/helpers/governance-assets.ts`
- `tests/integration/helpers/governed-handler-doc-expectations.ts`
- `tests/integration/helpers/protected-handler-inventory.ts`
- `tests/integration/helpers/protected-handler-candidates.ts`
- `tests/integration/helpers/protected-handler-exclusion-rationales.ts`
- `tests/integration/helpers/protected-handler-exclusion-review-metadata.ts`
- `tests/integration/helpers/protected-handler-exclusion-aging.ts`
- `tests/integration/helpers/protected-handler-exclusion-review-summary.ts`

## Key Integrity Tests
- `tests/integration/handlers/api-contract-registry.integrity.test.ts`
- `tests/integration/handlers/registry-to-test-coverage.integrity.test.ts`
- `tests/integration/handlers/governance-automation-lite.integrity.test.ts`
- `tests/integration/handlers/governed-handler-documentation.integrity.test.ts`
- `tests/integration/handlers/governance-doc-integrity.integration.test.ts`
- `tests/integration/handlers/protected-handler-growth.integrity.test.ts`
- `tests/integration/handlers/protected-handler-discovery.integrity.test.ts`
- `tests/integration/handlers/protected-handler-exclusion.integrity.test.ts`
- `tests/integration/handlers/protected-handler-exclusion-review.integrity.test.ts`
- `tests/integration/handlers/protected-handler-exclusion-aging.integrity.test.ts`
- `tests/integration/handlers/protected-handler-exclusion-review-summary.integrity.test.ts`
- `tests/integration/handlers/protected-handler-report-parity.integrity.test.ts`

## Local Visibility Commands
- `npm run verify`
- `npm run review:protected-handlers`
- `npm run review:protected-handlers:json`

## How to Use This Index
- start with onboarding and merge-readiness for new handlers
- use contract docs for boundary expectations
- use exclusion docs when a handler is not governed
- use visibility commands to inspect current exclusions
- use integrity tests and helpers when updating governance assets
