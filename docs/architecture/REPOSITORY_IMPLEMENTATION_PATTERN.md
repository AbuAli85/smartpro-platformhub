# Repository Implementation Pattern

## Purpose
Defines how SmartPRO repositories should be implemented against the database.

## Rules
- repository contracts stay separate from implementations
- DB-backed implementations receive an explicit db adapter
- tenant-owned entities must expose tenant-scoped methods
- row-to-domain mapping must be explicit
- write queries for tenant-owned entities should include company_id in the mutation where practical
- repositories should not contain permission logic

## Recommended Structure
- contract/interface file
- implementation file
- mapping helpers near implementation
- service layer consumes repositories
- route/procedure layer consumes services

## Anti-Patterns
- direct DB queries in route handlers
- hidden tenant scoping magic
- returning raw DB row shapes to business layers
- permission checks inside repositories

## Transactions

Use a transaction when:

- business record write and audit write must succeed together
- role assignment and audit write happen in one protected flow
- future approval/rejection flows change multiple records
- payment confirmation updates invoice/payment/audit in one operation

Do not force transactions yet for:

- single-row read operations
- isolated read-only queries
- pure list operations

Role assignment plus audit persistence should become transactional once the real `DbAdapter` supports transactions (e.g. `withTransaction` or client-bound queries).
