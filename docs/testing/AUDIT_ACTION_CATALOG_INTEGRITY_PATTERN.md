# Audit Action Catalog Integrity Pattern

## Purpose
Defines how SmartPRO verifies that documented audit action names, runtime usage, and persisted audit expectations remain aligned.

## Required Coverage
1. documented audit actions are unique
2. critical runtime flows use expected action names
3. persisted audit rows match expected action names for tested flows

## Principles
- audit action names are part of the machine-readable operational contract
- action names must remain stable once introduced
- drift between docs and runtime action names must fail verification
- controlled documented expectations are preferred over fragile markdown parsing in the first stage

## Implementation
- Expectations: `tests/integration/helpers/audit-action-expectations.ts` (aligned with `docs/architecture/AUDIT_LOGGING_PATTERN.md`).
- Tests: `tests/integration/audit/audit-action-catalog.integrity.integration.test.ts`.
