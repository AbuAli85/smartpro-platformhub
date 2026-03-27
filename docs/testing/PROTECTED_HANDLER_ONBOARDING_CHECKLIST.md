# Protected Handler Onboarding Checklist

## Purpose
Defines the minimum requirements for introducing a new protected handler into SmartPRO.

## A handler is considered protected if it:
- reads or mutates tenant-scoped data
- performs privileged admin actions
- relies on auth, permissions, tenant scope, or invariants
- exposes a stable boundary contract that clients or AI agents depend on

## Required Implementation Checks
- [ ] handler uses centralized auth enforcement
- [ ] handler uses centralized permission enforcement
- [ ] tenant scope is enforced when applicable
- [ ] role-scope or business invariants are enforced when applicable
- [ ] repository access uses tenant-scoped methods where applicable
- [ ] handler returns stable `{ status, data }` or `{ status, error }` shape

## Required Test Layers
- [ ] protected handler authorization scenarios covered
- [ ] result-shape contract covered
- [ ] error-semantics contract covered
- [ ] success payload integrity covered
- [ ] response hygiene covered
- [ ] contract fixture key sets covered (`HANDLER_CONTRACT_FIXTURES` + fixture integration test)

## Registry Requirement
- [ ] handler is added to API contract registry once boundary is stable
- [ ] fixture name is linked to registry entry
- [ ] coverage flags are set truthfully

## Documentation Requirement
- [ ] boundary change documented if contract differs from existing patterns
- [ ] handler added to relevant architecture/testing docs if it introduces a new pattern

## Related references
- `HANDLER_RESULT_CONTRACT_PATTERN.md`
- `HANDLER_ERROR_SEMANTICS_PATTERN.md`
- `HANDLER_SUCCESS_PAYLOAD_PATTERN.md`
- `RESPONSE_BOUNDARY_HYGIENE_PATTERN.md`
- `HANDLER_CONTRACT_FIXTURE_PATTERN.md`
- `API_CONTRACT_REGISTRY_PATTERN.md`
- `BOUNDARY_CHANGE_GOVERNANCE.md`
