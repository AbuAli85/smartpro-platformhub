# Executable Integration Suite

## Purpose
Defines the first real executable integration suite for SmartPRO.

## Current Coverage
- audit repository persistence
- tenant-scoped case reads
- tenant-scoped document updates
- transactional role assignment

## Execution Flow
1. ensure test DB is configured
2. run migrations
3. reset test DB
4. run integration tests
5. inspect failures before proceeding

## Rules
- tests must assert DB outcomes, not only in-memory returns
- rollback paths must be verified where transactions are involved
- tenant scope must be present in seeded scenarios for tenant-owned flows
