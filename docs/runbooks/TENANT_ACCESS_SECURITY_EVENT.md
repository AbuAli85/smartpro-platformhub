# Runbook: tenant access and security events

**Scope:** suspected **cross-tenant access**, **privilege escalation**, **credential leak**, or **abuse** of SmartPRO APIs.

**Owners:** security + platform — `docs/operations/RACI.md`. **Legal/compliance** if PII breach suspected.

---

## Immediate actions

1. **Contain** — revoke suspect sessions or API keys; rotate leaked credentials; block abusive IPs if applicable.
2. **Preserve** — snapshot relevant **audit_events**, access logs, and WAF logs (immutable store if available).
3. **Scope** — identify tenants and user accounts affected; time window of exposure.

---

## Investigation

- Trace **correlation id** from user report through API logs and audit trail.
- Reproduce with **least-privilege** test account in staging; never use prod user data without approval.
- Verify **RBAC** and **tenant filters** on every layer touched (`docs/architecture/RBAC_MODEL.md`, `docs/architecture/TENANT_ISOLATION_MODEL.md`).

---

## Response

- **False alarm:** document finding; tune alert if noisy.
- **Confirmed issue:** execute incident process (`INCIDENT_RESPONSE.md`); open security fix; add **regression test** per `ENFORCEMENT_MATRIX.md`.
- **Data breach:** follow legal **notification** obligations; restrict detail in public channels.

---

## Post-event

- [ ] **Audit** all admin actions during response window.
- [ ] **Test:** tenant isolation + unauthorized path tests extended if gap found.
- [ ] **Review** `AGENT_RESPONSIBILITY_MATRIX.md` if AI tooling was involved.

---

## Related

- `docs/architecture/RBAC_MODEL.md`
- `docs/architecture/TENANT_ISOLATION_MODEL.md` (if present)
- `docs/runbooks/INCIDENT_RESPONSE.md`
