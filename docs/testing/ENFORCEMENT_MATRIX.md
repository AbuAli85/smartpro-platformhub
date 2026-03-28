# Enforcement matrix

**Purpose:** map **rules** to **mechanisms** so the blueprint is executable. Update this when you add a rule or a check.

Legend: **Y** = required for production module, **P** = planned, **—** = not applicable yet.

---

## Platform integrity

| Rule | Lint / static | CI script | Unit | Integration | E2E | Branch protection | Code owners | Runtime |
|------|---------------|-----------|------|---------------|-----|-------------------|-------------|---------|
| No protected mutation without server auth guard | P (ESLint) | P | Y | Y | P | Y | Y | — |
| No workflow state mutation without audit event | — | P | P | Y | P | Y | backend | assert in handler |
| No new canonical status without doc + registry update | — | P | — | P | — | Y | platform | — |
| Env var referenced only if declared in env schema | P | Y | — | — | — | Y | — | boot validate |
| Webhook handler verifies signature + idempotency | — | — | Y | Y | P | Y | backend | middleware |
| No raw DB outside approved data layer | P | P | — | Y | — | Y | backend | — |
| Tenant id required on tenant-scoped queries | P | — | Y | Y | P | Y | backend | RLS + app guard |
| Client cannot authorize privileged actions alone | P | — | — | Y | Y | Y | — | — |

---

## Documentation alignment

| Rule | Mechanism |
|------|-----------|
| RBAC doc matches permission catalog | `RBAC_DOCUMENTATION_INTEGRITY_PATTERN.md`, CI when wired |
| Audit actions catalog current | `AUDIT_ACTION_CATALOG_INTEGRITY_PATTERN.md` |
| Protected handlers in registry | `API_CONTRACT_REGISTRY_PATTERN.md`, merge-blocking governance |

---

## Release / merge

| Rule | Mechanism |
|------|-----------|
| Default branch requires green `verify` (or equivalent) | GitHub required status checks |
| Behavior change includes tests | PR template + reviewer checklist |
| Migration in release has rollback note | `DEPLOYMENT_AND_RELEASE.md` + PR |

---

## Implementation traceability (fill per module)

When a **module** is declared “in progress” or “done,” add a row:

| Module / domain | Governance doc | Implementation area (repo path) | Key tests | Runbook | Owner |
|-----------------|----------------|-----------------------------------|-----------|---------|-------|
| *example: service requests* | `MODULE_01_*` | `src/...` | `*.integration.test.ts` | *TBD* | *name* |
| | | | | | |

---

## Related

- `docs/release/PRODUCTION_READINESS_GATE.md`
- `docs/testing/MERGE_BLOCKING_CONTRACT_GOVERNANCE.md`
- `docs/architecture/SMARTPRO_PLATFORM_MASTER_BLUEPRINT.md`
