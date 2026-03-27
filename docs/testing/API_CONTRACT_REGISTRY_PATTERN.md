# API Contract Registry Pattern

## Purpose
Defines how SmartPRO tracks which handlers are contract-governed at the boundary level.

## Registry Contents
Each registered handler should declare:
- handler name
- linked contract fixture
- success payload coverage
- error semantics coverage
- result-shape coverage
- response hygiene coverage

## Why
The registry provides a lightweight source of truth for:
- which handlers are boundary-locked
- what verification is required
- whether a new handler has completed contract onboarding

## Rules
- protected handlers should be added to the registry once their boundary is considered stable
- registry entries should remain explicit and reviewable
- missing required coverage should fail verification for registered handlers

## Implementation
- `tests/integration/helpers/api-contract-registry.ts` — `API_CONTRACT_REGISTRY`
- `tests/integration/handlers/api-contract-registry.integrity.test.ts` — linkage and coverage flags

## Related tests (by concern)
| Concern | Test file |
|--------|-----------|
| Contract key fixtures | `handler-contract-fixtures.integration.test.ts` |
| Success payload fields | `handler-success-payload.integration.test.ts` |
| Error status/code | `handler-error-semantics.integration.test.ts` |
| `{ status, data \| error }` | `handler-result-contract.integration.test.ts` |
| Non-leakage | `response-boundary-hygiene.integration.test.ts` |
