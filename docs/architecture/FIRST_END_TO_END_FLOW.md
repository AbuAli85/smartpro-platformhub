# First End-to-End Flow

## Purpose
Defines the first true protected backend flows in SmartPRO backed by real schema and real repositories.

## Flows
- case read by id within company scope
- document status update within company scope

## Flow Sequence: Case Read
1. authenticate caller
2. resolve auth context
3. require company access
4. require cases:read permission
5. repository queries `cases` within `company_id`
6. if not found, return resource not found in permitted scope
7. return case record

## Flow Sequence: Document Status Update
1. authenticate caller
2. resolve auth context
3. require company access
4. require documents:verify permission
5. repository updates `documents` within `company_id`
6. if not found, return resource not found in permitted scope
7. return updated document record

## Rules
- handlers map auth and tenant errors consistently
- repository methods remain tenant-scoped
- route/handler code does not embed raw SQL
- permission strings come from centralized constants
