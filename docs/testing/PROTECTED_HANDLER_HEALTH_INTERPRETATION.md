# Protected Handler Health Interpretation

## Purpose
Helps interpret the governance health summary.

## Interpretation

### governedHandlers
- higher = broader governance coverage
- sudden drops should be investigated

### excludedHandlers
- should remain low
- growth indicates governance avoidance risk

### nearDueExclusions
- indicates upcoming review workload
- should be monitored but not necessarily critical

### overdueExclusions
- should always be zero
- any non-zero value indicates governance failure

## Rule
A healthy system:
- has zero overdue exclusions
- has controlled exclusion count
- has predictable near-due review flow
