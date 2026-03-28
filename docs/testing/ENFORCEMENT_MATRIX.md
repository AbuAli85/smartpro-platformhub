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

## Implementation traceability (populate with real paths)

**Rule:** each row must be true in `business-services-hub` (adjust paths). Until paths are filled, mark **TBD** and assign an owner to complete.

| Module / domain | Governance doc (this repo) | Implementation area (path in app repo) | Key tests | Runbook | Owner |
|-----------------|----------------------------|----------------------------------------|-----------|---------|-------|
| Auth / session | `docs/architecture/RBAC_MODEL.md`, `AUDIT_LOGGING_PATTERN.md` | *TBD e.g. `src/server/auth/*`* | *TBD `*.integration.test.ts`* | `TENANT_ACCESS_SECURITY_EVENT.md` | *assign* |
| RBAC / roles | `RBAC_MODEL.md` | *TBD* | *TBD RBAC / tenant tests* | same | *assign* |
| Bookings / workflow / service requests | `MODULE_01_BOOKING_SERVICE_REQUEST_LIFECYCLE.md` | *TBD* | *TBD workflow / handler contracts* | `FAILED_JOBS_AND_RETRY.md` | *assign* |
| Payments / billing / PSP webhooks | `AUDIT_LOGGING_PATTERN.md`, constitution | *TBD* | *TBD payment + webhook idempotency* | `PAYMENT_RECONCILIATION.md`, `WEBHOOK_FAILURES.md` | *assign* |
| Notifications | `NOTIFICATION_ARCHITECTURE.md` | *TBD* | *TBD delivery / fan-out* | `FAILED_JOBS_AND_RETRY.md` | *assign* |
| Documents / verification | domain + module docs | *TBD* | *TBD upload / access* | *TBD* | *assign* |
| Admin / tenant controls | `RBAC_MODEL.md`, `TENANT_ISOLATION_MODEL.md` | *TBD* | *TBD admin boundary tests* | `TENANT_ACCESS_SECURITY_EVENT.md` | *assign* |

Add rows for new modules; remove TBD as the implementation repo is wired.

---

## Related

- `docs/operations/GOVERNED_EXECUTION_BINDING.md`
- `docs/release/PRODUCTION_READINESS_GATE.md`
- `docs/testing/MERGE_BLOCKING_CONTRACT_GOVERNANCE.md`
- `docs/architecture/SMARTPRO_PLATFORM_MASTER_BLUEPRINT.md`
