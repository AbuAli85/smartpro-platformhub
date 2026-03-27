# Failure Injection Pattern

## Purpose
Defines how SmartPRO tests failure paths intentionally, especially for transactional and privileged flows.

## Initial Use Case
- audit write failure during transactional role assignment

## Rules
- failure injection should use reusable helpers
- failure paths should prove rollback or safe abort behavior
- tests should verify no partial durable state remains
- injected failures should be explicit and readable

## Good Patterns
- failing repository implementation
- failing adapter wrapper
- deterministic exception injection

## Anti-Patterns
- hidden monkey-patching inside unrelated tests
- relying on random DB failures
- asserting only thrown errors without checking DB state
