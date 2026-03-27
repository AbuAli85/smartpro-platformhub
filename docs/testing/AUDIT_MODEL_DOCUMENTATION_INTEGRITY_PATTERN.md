# Audit Model Documentation Integrity Pattern

## Purpose
Defines how SmartPRO verifies that audit documentation remains aligned with runtime and persisted audit behavior beyond action names alone.

## Required Coverage
1. documented actor types align with runtime expectations
2. documented entity types align with implemented persisted audit behavior
3. documented critical audited flows align with actual action, actor type, and entity type usage

## Principles
- audit documentation is part of the operational contract
- action names alone are insufficient for audit-model integrity
- actor type, entity type, and critical audited flow expectations must remain stable
- controlled documented expectations are preferred over fragile markdown parsing in the first stage

## Implementation
- Expectations: `tests/integration/helpers/audit-model-expectations.ts`
- Runtime actor union list: `AUDIT_ACTOR_TYPE_VALUES` in `packages/audit/types.ts`
- Tests: `tests/integration/audit/audit-model-documentation.integrity.integration.test.ts`
