# Runbook: incident response

**Scope:** responding to production degradation, security events, or data integrity issues affecting SmartPRO (implementation repo services).

**Owners:** see `docs/operations/RACI.md`.

---

## Severity (suggested)

| Level | Meaning | Examples | Response target |
|-------|---------|----------|-----------------|
| **SEV1** | Major outage or active exploit | Auth broken, data leak, payment double-charge | Immediate on-call |
| **SEV2** | Significant feature broken | Core workflow stuck, webhook storm | Same business day |
| **SEV3** | Minor / isolated | Single tenant UI glitch | Next sprint |

Calibrate with your org; document **who is on-call** in `OWNERSHIP_MAP.md`.

---

## Initial triage (first 15 minutes)

1. **Acknowledge** — incident channel / ticket updated with owner and time.
2. **Stabilize** — stop bleeding: disable feature flag, scale up, block abusive IP, pause job consumer if safe.
3. **Correlate** — recent deploys, migrations, config changes, third-party outages; collect **correlation IDs** from logs.
4. **Scope** — which tenants, regions, endpoints; estimate blast radius.

---

## Communication

- **Internal:** single thread (Slack/Teams) with timeline, hypotheses, actions.
- **External:** only after facts; use approved templates; assign comms owner (not the primary debugger).

---

## Technical playbook

- **Deploy-related:** see `DEPLOYMENT_AND_RELEASE.md` rollback section.
- **Jobs stuck / failing:** `FAILED_JOBS_AND_RETRY.md`.
- **Webhooks:** `WEBHOOK_FAILURES.md`.
- **Payments:** `PAYMENT_RECONCILIATION.md`.
- **Tenant / auth abuse:** `TENANT_ACCESS_SECURITY_EVENT.md`.

---

## Post-incident

- [ ] **Root cause** documented (five whys or equivalent).
- [ ] **Action items:** monitoring gap, runbook update, test addition — link to `ENFORCEMENT_MATRIX.md` when adding checks.
- [ ] **Audit review** for privileged actions during the window.

---

## Related

- `docs/runbooks/DEPLOYMENT_AND_RELEASE.md`
- `docs/architecture/AUDIT_LOGGING_PATTERN.md` (implementation path)
- `docs/architecture/SMARTPRO_PLATFORM_MASTER_BLUEPRINT.md`
