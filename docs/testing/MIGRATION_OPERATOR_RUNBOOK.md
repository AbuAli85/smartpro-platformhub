# Migration Operator Runbook

## Purpose
Provides the operator-facing procedure for responding to SmartPRO migration failures consistently and safely.

## Applies To
- local verification failures
- CI migration failures
- shared development database migration failures
- staging or other persistent environment failures

## First Response Rules
1. stop further migration attempts until the failure type is understood
2. do not edit historical applied migrations
3. do not overwrite checksum state to force success
4. determine whether the environment is disposable local or shared/persistent
5. collect evidence before attempting recovery

## Failure Categories
- LOCK_UNAVAILABLE
- SQL_EXECUTION_FAILED
- STATE_RECORD_FAILED
- CHECKSUM_MISMATCH
- UNKNOWN

## Operator Flow
1. identify environment type
2. identify failing migration file
3. identify failure type
4. collect logs and migration state evidence
5. choose recovery path:
   - retry later
   - restore integrity
   - reset disposable environment
   - create corrective migration
6. rerun verification only after the recovery path is chosen and documented

## Environment Rules

### Local Disposable Environment
- reset may be acceptable
- restoring from source-of-truth migration files is preferred
- full rebuild is often the safest path

### Shared / Persistent Environment
- preserve history
- do not rewrite migration history
- restore file integrity from source control if needed
- use corrective migrations for schema fixes
- document incident and actions taken
