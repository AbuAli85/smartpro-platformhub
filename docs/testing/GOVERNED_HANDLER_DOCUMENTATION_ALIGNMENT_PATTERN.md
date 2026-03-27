# Governed Handler Documentation Alignment Pattern

## Purpose
Defines how SmartPRO verifies that governed-handler documentation remains aligned with the API contract registry.

## Required Coverage
1. documented governed handler names match registered governed handler names
2. documented governed handler names remain unique

## Principles
- governed-handler documentation is part of the contract-governance system
- documentation drift must fail verification
- controlled documented expectations are preferred over fragile parsing in the first stage
- registry and documentation should represent the same governed set

## Implementation
- Expectations: `tests/integration/helpers/governed-handler-doc-expectations.ts`
- Must stay aligned with: `tests/integration/helpers/governance-assets.ts` (`GOVERNED_HANDLER_NAMES`)
- Tests: `tests/integration/handlers/governed-handler-documentation.integrity.test.ts`
