# Fixture and Seeding Pattern

## Purpose
Defines how SmartPRO integration tests seed the minimum required data for real DB-backed verification.

## Rules
- seed only what the test needs
- prefer helper functions over large SQL dumps
- use real schema constraints
- use real permission strings for real action paths
- keep tenant boundaries explicit in fixtures

## Standard Fixture Types
- users
- companies
- roles
- permissions
- role_permissions
- memberships
- user_roles
- cases
- documents

## Anti-Patterns
- oversized global fixtures
- fake permission aliases that do not match runtime constants
- skipping tenant data where scope behavior is under test
