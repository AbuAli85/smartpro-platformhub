# Migration Checksum Pattern

## Purpose
Defines how SmartPRO verifies that applied migration files have not been modified after execution.

## Strategy
Each applied migration stores:
- filename
- checksum
- applied timestamp

The migration runner calculates the current checksum of each migration file and compares it to the stored checksum before skipping an already-applied migration.

## Rules
1. applied migrations must be immutable
2. checksum mismatch is a hard failure
3. migration runner must not silently skip changed historical files
4. new schema changes require new migration files, not edits to applied files

## Failure Type
- CHECKSUM_MISMATCH

## Why
Migration state tracking confirms that a file ran.
Checksum tracking confirms that the file still means the same thing.
