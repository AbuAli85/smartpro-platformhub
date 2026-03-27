# CI Pipeline Design

## Purpose
Defines the first verification-only CI pipeline for SmartPRO.

## Initial Goal
The first CI pipeline is for verification only. It must not deploy, mutate production systems, or hide environment assumptions.

## Initial Workflow
1. checkout repository
2. install dependencies
3. provision Postgres service
4. set DATABASE_URL for CI test database
5. run `npm run verify:ci`

## Verification Scope
- lint
- typecheck
- migrations
- test DB reset
- integration tests

## Rules
- CI verification must stay aligned with local verification intent
- CI must use a dedicated disposable database
- verification and deployment are separate concerns
- failing verification blocks merge readiness
