# Governance Automation Lite Pattern

## Purpose
Defines SmartPRO’s lightweight automated checks for contract-governed handler governance.

## Goals
- ensure governed handlers remain registered
- ensure core governance docs remain present
- detect simple governance drift early

## Why Lightweight
The first stage of governance automation should remain:
- explicit
- readable
- easy to maintain
- low-friction

## Required Checks
1. governed handlers are listed in the API contract registry
2. required governance docs exist
3. governed handler identifiers remain unique

## Non-Goals
- AST scanning
- PR bot automation
- codeowner enforcement
- fully generated governance inventories

## Implementation
- `tests/integration/helpers/governance-assets.ts`
- `tests/integration/handlers/governance-automation-lite.integrity.test.ts`
