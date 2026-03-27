# Migration State Pattern

## Purpose
Defines how SmartPRO tracks applied database migrations and makes migration execution rerun-safe.

## Tracking Table
- `public.schema_migrations`

## Stored Data
- migration filename
- applied timestamp

## Runner Rules
1. ensure migration state table exists (bootstrap before first tracked run)
2. read migration files in lexical order
3. skip files already recorded as applied
4. execute each unapplied migration file (each file uses its own `begin`/`commit` where defined)
5. insert into `schema_migrations` only after that file’s SQL succeeds (failed migrations are not recorded)

## Implementation note
Migration files in this repo wrap DDL in their own transactions. The runner does not add an outer transaction around the file plus the insert, so nested `begin`/`commit` inside the same client session is avoided.

## Rules
- migration filenames must remain unique
- migration order must be deterministic
- failed migrations must not be marked as applied
- migration tracking is part of verification safety
