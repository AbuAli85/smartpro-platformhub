# Environment Contract

## Required Variables
- DATABASE_URL

## Rules
- must point to a non-production database
- must allow full reset (truncate + cascade)
- must match migration target schema

## Tooling Requirements
- Node.js
- npm
- Postgres
- tsx (via npx)
- Vitest
- ESLint

## Failure Rule
Verification must fail early if environment is invalid.
