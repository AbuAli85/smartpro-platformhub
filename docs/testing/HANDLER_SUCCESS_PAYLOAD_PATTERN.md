# Handler Success Payload Pattern

## Purpose
Defines how SmartPRO verifies that protected handler success payloads expose only the intended boundary fields.

## Required Coverage
- expected fields are present
- raw DB column names are absent
- unintended internal fields are absent
- payload shape remains stable across handler refactors

## Principles
- success payloads are part of the API boundary contract
- handlers should return normalized application-facing field names
- tests should fail if raw persistence shapes leak into handler responses

## Implementation
- Repository records (`CaseRecord`, `DocumentRecord`, `UserRoleRecord`) define the normalized shape.
- `tests/integration/handlers/handler-success-payload.integration.test.ts` asserts exact key sets and rejects common snake_case leaks.
