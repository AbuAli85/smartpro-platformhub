# Migration Immutability Rules

## Purpose
Defines SmartPRO rules for historical migration files once they have been applied.

## Rules
- applied migration files must not be edited
- fixes and schema changes must use new migration files
- checksum mismatch must fail verification
- local and CI runners must enforce the same integrity behavior

## Allowed
- adding a new migration file
- documenting a migration
- creating corrective follow-up migrations

## Disallowed
- editing SQL inside an already-applied migration
- changing historical migration semantics silently
- bypassing checksum failures manually without explicit recovery steps
