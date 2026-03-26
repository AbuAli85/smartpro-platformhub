# Audit Logging Pattern

## Purpose
Defines how SmartPRO records privileged and sensitive system actions.

## Required For
- role assignments and removals
- approvals and rejections
- workflow state changes
- financial confirmations and refunds
- cross-tenant privileged actions
- critical configuration changes

## Event Shape
Each audit event should capture:
- actor user id if available
- actor type
- company scope if applicable
- action
- entity type
- entity id
- before state where relevant
- after state where relevant
- metadata
- timestamp

## Standard Flow
1. protected action passes auth and permission checks
2. business write succeeds
3. audit event is persisted
4. structured result is returned

## Rules
- privileged route handlers must not silently skip audit writes
- audit persistence is handled through audit service/repository
- action names should be stable and machine-readable
- metadata should support investigation without becoming a dumping ground

## Initial Action Naming Examples
- user_role.assigned
- user_role.removed
- case.approved
- case.rejected
- document.verified
- payment.confirmed
- payment.refunded
