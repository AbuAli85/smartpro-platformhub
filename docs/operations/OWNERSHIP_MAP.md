# Ownership map

**Purpose:** every **control-plane concern** has a named owner. Without ownership, low-touch systems degrade.

Update this file when headcount or roles change.

---

## Platform governance repo (`smartpro-platformhub`)

| Concern | Primary owner | Backup | Artifacts |
|---------|---------------|--------|-----------|
| Master blueprint & cross-links | *assign* | *assign* | `SMARTPRO_PLATFORM_MASTER_BLUEPRINT.md` |
| Product constitution | *assign* | *assign* | `docs/core/PRODUCT_CONSTITUTION.md` |
| Domain model | *assign* | *assign* | `docs/core/DOMAIN_MODEL.md` |
| Architecture standards | *assign* | *assign* | `docs/core/ARCHITECTURE.md`, `docs/architecture/*` |
| RBAC documentation | *assign* | *assign* | `docs/architecture/RBAC_MODEL.md` |
| Audit patterns | *assign* | *assign* | `docs/architecture/AUDIT_LOGGING_PATTERN.md` |
| AI execution / labels / webhooks | *assign* | *assign* | `AI_EXECUTION_LOOP.md`, workflows |
| Testing / enforcement specs | *assign* | *assign* | `docs/testing/ENFORCEMENT_MATRIX.md` |
| Runbooks | *assign* | *assign* | `docs/runbooks/*` |
| Release gates | *assign* | *assign* | `docs/release/PRODUCTION_READINESS_GATE.md` |
| Agent policy | *assign* | *assign* | `docs/ai/AGENT_RESPONSIBILITY_MATRIX.md` |

---

## Implementation repo (application)

**Binding checklist:** `GOVERNED_EXECUTION_BINDING.md` (CODEOWNERS template, branch protection, required checks).

| Concern | Primary owner | Backup | Notes |
|---------|---------------|--------|-------|
| CI / merge gates | *assign* | *assign* | Must satisfy `ENFORCEMENT_MATRIX.md` |
| Migrations | *assign* | *assign* | Forward/rollback per `DEPLOYMENT_AND_RELEASE.md` |
| Production deploy | *assign* | *assign* | |
| On-call rotation | *assign* | *assign* | Link to PagerDuty/Opsgenie |
| Observability (Sentry, logs) | *assign* | *assign* | |
| Secrets management | *assign* | *assign* | No secrets in git |

---

## Escalation

1. **Owner** (primary) — first response within SLA.
2. **Backup** — if primary unavailable.
3. **Accountable role** from `RACI.md` — for policy or approval decisions.
4. **Incident commander** — for SEV1 per `INCIDENT_RESPONSE.md`.

---

## Related

- `docs/operations/RACI.md`
- `docs/runbooks/INCIDENT_RESPONSE.md`
