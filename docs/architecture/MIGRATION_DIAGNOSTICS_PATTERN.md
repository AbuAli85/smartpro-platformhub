# Migration Diagnostics Pattern

## Purpose
Defines how SmartPRO reports migration execution outcomes clearly and consistently.

## Diagnostic Goals
- identify whether lock acquisition failed
- identify which migration file failed
- distinguish SQL execution failure from applied-state recording failure
- summarize applied and skipped counts

## Standard Summary Fields
- total files
- applied count
- skipped count
- failed file if any
- failure type if any

## Failure Types
- LOCK_UNAVAILABLE
- SQL_EXECUTION_FAILED
- STATE_RECORD_FAILED
- UNKNOWN

## Rules
- migration failures must be explicit in logs
- lock failures must be distinguishable from SQL failures
- summary output should be stable for both humans and CI logs
