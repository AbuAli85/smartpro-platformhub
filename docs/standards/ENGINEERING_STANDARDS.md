# Engineering Standards

## Purpose
Defines the delivery, coding, testing, security, and documentation standards for SmartPRO.

## Standards
- server-authoritative business logic
- thin API handlers
- centralized validation
- centralized permission checks
- auditable critical actions
- migrations required for schema changes
- tests required for behavior changes
- docs updated when rules change

## Required Checks
- lint
- typecheck
- unit tests
- integration tests where applicable
- permission tests for protected logic

## Forbidden Patterns
- frontend business authority
- scattered permission strings
- duplicate status maps
- undocumented schema changes
- untested critical mutations
