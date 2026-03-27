# Checksum Mismatch Remediation

## Purpose
Defines the required response when SmartPRO detects that an already-applied migration file no longer matches its recorded checksum.

## Meaning
A checksum mismatch means:
- the migration file was modified after being applied, or
- a different copy of the migration file exists than the one originally applied

This is an integrity problem, not a normal migration failure.

## Hard Rules
- do not edit historical applied migrations further
- do not overwrite stored checksums to “make it pass”
- do not ignore the mismatch in CI or shared environments

## Safe Response Flow
1. identify the mismatched file
2. determine where and why the file changed
3. restore the original file content if possible
4. if schema correction is still needed, create a new migration file
5. rerun verification only after integrity is restored

## Local Disposable Environment Guidance
If the environment is fully disposable and no shared history matters:
- reset the local test/dev database if appropriate
- restore migration file set to the intended source-of-truth
- rerun migrations from a clean state

## Shared Environment Guidance
If the environment is shared or important:
- stop immediately
- do not mutate migration history
- restore the correct file version from source control
- create a corrective migration if schema change is still needed
- communicate the incident clearly to the team
