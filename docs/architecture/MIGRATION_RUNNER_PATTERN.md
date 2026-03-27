# Migration Runner Pattern

## Purpose
Defines how SmartPRO applies database migrations in a deterministic and repeatable order.

## Rules
- migrations live in `database/migrations`
- migration filenames must sort chronologically
- migrations are applied in ascending filename order
- migrations must be idempotent where practical
- schema assumptions must be explicit across migration sequence

## Current Ordering Strategy
- `20260327_001_rbac_schema.sql`
- `20260327_002_audit_events.sql`
- `20260327_003_cases_documents.sql`

## Runner Rules
- migration runner reads all `.sql` files
- sorts them lexically
- applies them in order
- fails fast on first error

## Anti-Patterns
- applying migrations manually in random order
- hidden migration dependencies not reflected in filenames
- mixing unrelated ad hoc SQL outside migration files
