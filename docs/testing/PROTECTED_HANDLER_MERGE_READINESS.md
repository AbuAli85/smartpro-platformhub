# Protected Handler Merge Readiness

## Purpose
Defines when a new or changed protected handler is considered ready to merge in SmartPRO.

## Merge-Ready Conditions
A protected handler is merge-ready only if all of the following are true:

1. implementation is complete
2. auth and permission enforcement are correct
3. tenant scope enforcement is correct where applicable
4. invariants are enforced where applicable
5. boundary tests exist
6. contract fixtures exist or are updated
7. response hygiene is verified
8. API contract registry is updated if the handler is boundary-governed
9. `npm run verify` passes

## Boundary Review Rule
If the handler changes:
- success payload fields
- error status/code mapping
- exposed response shape
- registry contract fixture

then it must be reviewed explicitly as a boundary change.

## Non-Merge-Ready Conditions
A protected handler is not merge-ready if:
- it lacks auth tests
- it lacks failure-path coverage
- it exposes raw DB field names
- it leaks internal metadata
- it is missing registry enrollment after becoming stable
- the strict verification gate fails

## Related references
- `PROTECTED_HANDLER_ONBOARDING_CHECKLIST.md`
- `BOUNDARY_CHANGE_GOVERNANCE.md`
- `API_CONTRACT_REGISTRY_PATTERN.md`
