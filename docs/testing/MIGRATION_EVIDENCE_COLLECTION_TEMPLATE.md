# Migration Evidence Collection Template

## Purpose
Defines the minimum evidence to collect for SmartPRO migration failures.

## Incident Record

### 1. Environment
- environment type:
- database target:
- local or shared:
- runner context (local / CI):

### 2. Failure Details
- timestamp:
- failing command:
- failure type:
- failing migration file:
- summary output:

### 3. Migration State
- relevant rows from `schema_migrations`:
- was migration already recorded:
- checksum present:
- checksum mismatch detected:

### 4. File Integrity
- current file path:
- source control revision checked:
- file modified unexpectedly:
- original content restored:

### 5. Recovery Decision
- retry only:
- local reset:
- restore file from source control:
- create corrective migration:
- escalate for review:

### 6. Outcome
- final action taken:
- rerun result:
- follow-up required:
