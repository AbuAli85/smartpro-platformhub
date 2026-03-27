# Migration Rerun Rules

## Purpose
Defines the expected behavior when SmartPRO migrations are executed multiple times.

## Expected Behavior
- already-applied migrations are skipped
- unapplied migrations are executed in lexical order
- failed migrations stop the run
- failed migrations are not recorded as applied

## Verification Expectations
- running migrations twice should not duplicate schema objects
- rerun safety should work in local and CI verification
- migration state table should reflect applied files accurately

## Anti-Patterns
- blindly reapplying all SQL files every run
- recording a migration before it succeeds
- relying on manual operator memory for applied state
