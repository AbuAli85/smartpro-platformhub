# Transaction Pattern

## Purpose
Defines when SmartPRO must use database transactions for multi-write operations.

## Use Transactions When
- a business write and audit write must succeed or fail together
- a workflow action updates multiple records
- a financial action updates payment, invoice, and audit state
- a permission-sensitive admin action changes durable state and audit state

## Initial Transactional Flow
- assign user role
- persist audit event

## Rules
- transaction boundaries belong in service/action layer
- repositories should accept a DB executor so they can run inside or outside a transaction
- route handlers should not manually orchestrate raw SQL transactions
- partial success is not acceptable for privileged multi-write flows

## Anti-Patterns
- write business record first and "best effort" audit later
- transaction logic scattered across route handlers
- repositories opening nested transactions implicitly
