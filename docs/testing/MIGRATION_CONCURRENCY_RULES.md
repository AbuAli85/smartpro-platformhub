# Migration Concurrency Rules

## Purpose
Defines expected SmartPRO behavior when more than one migration runner tries to execute at the same time.

## Expected Behavior
- one runner acquires the migration lock
- other concurrent runners fail fast
- only the lock owner applies migrations
- migration state remains consistent

## Rules
- do not run multiple migration processes against the same database intentionally
- CI and local runs must rely on lock protection if overlap occurs
- failed lock acquisition should be explicit and visible in logs

## Anti-Patterns
- assuming migration state tracking alone prevents race conditions
- allowing concurrent runners to compete on schema changes
- hiding lock acquisition failures
