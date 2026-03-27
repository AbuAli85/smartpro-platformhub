# Protected Handler Report Parity Pattern

## Purpose
Defines how SmartPRO verifies that human-readable and machine-readable exclusion reports remain aligned.

## Required Coverage
1. summary rows remain deterministic
2. empty-state human output remains explicit
3. machine-readable output preserves the same row count as the summary model
4. human-readable output is derived from the same summary rows

## Principles
- human and machine report modes must not diverge
- both report modes must reuse the same summary helper
- report parity drift should fail verification early
