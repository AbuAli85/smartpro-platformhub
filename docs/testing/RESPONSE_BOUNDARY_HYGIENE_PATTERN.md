# Response Boundary Hygiene Pattern

## Purpose
Defines how SmartPRO verifies that protected handler responses expose only intended boundary data and do not leak internal implementation details.

## Required Coverage
- success responses exclude audit/internal metadata
- error responses exclude stack traces and implementation internals
- top-level response shape excludes debug/internal fields

## Principles
- handler responses are part of the public application contract
- internal persistence and audit details must not leak unintentionally
- response hygiene should fail fast in tests if boundary drift occurs

## Mapped API errors
Failures mapped through `mapAuthRelatedError` should surface only `status`, `code`, and `message` on the nested `error` object (no `stack`, raw SQL, or debug fields).

## Implementation
- `tests/integration/handlers/response-boundary-hygiene.integration.test.ts`
