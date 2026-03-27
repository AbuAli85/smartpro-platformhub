# Migration Failure Response Checklist

## Purpose
Step-by-step checklist for responding to SmartPRO migration failures.

## Checklist

### A. Immediate Triage
- [ ] identify the environment (local disposable / shared / CI / staging)
- [ ] record the failing command
- [ ] record the failure type
- [ ] record the failing migration filename if present
- [ ] stop repeated reruns until cause is understood

### B. Evidence Collection
- [ ] capture terminal output
- [ ] capture migration summary output
- [ ] inspect `schema_migrations` state
- [ ] confirm current migration file contents from source control
- [ ] note whether another migration runner may be active

### C. Recovery Decision
- [ ] decide whether reset is allowed
- [ ] decide whether integrity must be restored from source control
- [ ] decide whether a corrective migration is required
- [ ] confirm no historical migration edit is being proposed

### D. Before Retrying
- [ ] root cause is understood
- [ ] recovery action is documented
- [ ] migration files are in the intended state
- [ ] environment is safe to rerun

### E. After Retrying
- [ ] rerun completed successfully
- [ ] migration state is consistent
- [ ] verification gate passes
- [ ] incident notes are recorded if environment is shared
