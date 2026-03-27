# Handler Result Contract Pattern

## Purpose
Defines the stable boundary contract for SmartPRO protected handlers.

## Success Shape
Handlers return:
- `status`
- `data`

Handlers should not include `error` on success.

## Failure Shape
Handlers return:
- `status`
- `error`

Handlers should not include `data` on failure.

## Error object
On failure, `error` includes at least `code` and `message` (see `mapAuthRelatedError`).

## Principles
- handler boundary shape is part of the API contract
- result shape must remain stable for both humans and AI agents
- authorization behavior and result-shape behavior are both required verification layers
- shape drift should fail tests early

## Implementation
- `tests/integration/handlers/handler-result-contract.integration.test.ts` locks the contract for representative handlers.
