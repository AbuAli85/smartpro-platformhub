# Governance Doc Integrity Pattern

## Purpose
Defines how SmartPRO detects drift across governance documentation and expectation helpers for contract-governed handlers.

## Required Coverage
1. governed-handler sets remain aligned across registry-linked helpers
2. governance policy expectation sources remain unique and explicit
3. required governance policy docs remain present

## Principles
- governance documentation is part of the operating contract
- drift across policy helpers should fail verification early
- lightweight explicit expectation sources are preferred over heavy parsing in the first stage
- registry, docs, and governance helpers should describe the same governed set

## Implementation
- `tests/integration/helpers/governance-policy-expectations.ts`
- `tests/integration/handlers/governance-doc-integrity.integration.test.ts`
