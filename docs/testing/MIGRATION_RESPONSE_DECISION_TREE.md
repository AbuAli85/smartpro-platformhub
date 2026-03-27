# Migration Response Decision Tree

## Purpose
Defines the high-level decision path for SmartPRO migration failures.

## Decision Tree

### Step 1: Is the environment disposable local?
- Yes → reset may be allowed if integrity can be restored safely
- No → treat as shared/persistent and preserve history

### Step 2: What is the failure type?

#### LOCK_UNAVAILABLE
- wait or retry after confirming no active conflicting runner
- no schema repair action yet

#### SQL_EXECUTION_FAILED
- inspect migration SQL and DB state
- if migration logic must change, create a new corrective migration
- do not rewrite applied history

#### STATE_RECORD_FAILED
- inspect whether schema change succeeded
- inspect uniqueness/state issues in `schema_migrations`
- repair state carefully, then rerun

#### CHECKSUM_MISMATCH
- stop immediately
- restore file integrity from source control if possible
- if schema correction is still needed, create a new migration
- do not overwrite checksum to bypass failure

#### UNKNOWN
- collect evidence
- stop repeated retries
- escalate for review

## Core Rule
When uncertain, prefer preserving history and creating a new migration over mutating existing migration history.
