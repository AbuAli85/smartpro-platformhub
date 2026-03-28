# Runbook: webhook failures

**Scope:** **inbound** webhooks to SmartPRO (payments, identity, messaging) and **outbound** bridges (e.g. GitHub Actions → Cursor automation).

**Owners:** integrations + platform — `docs/operations/OWNERSHIP_MAP.md`.

---

## Inbound webhooks (implementation repo)

### Verify first

- **Signature** — HMAC or provider scheme; reject on mismatch (400); log **verification failures** without logging secrets.
- **Timestamp / replay** — reject stale or duplicate `event_id` per `idempotency_keys` or provider id table.
- **Payload** — schema-validated; malformed → 400 with safe body.

### Triage

| Symptom | Likely cause | Action |
|--------|----------------|--------|
| Spike in 401/403 | Rotated signing secret | Update secret; replay if provider supports |
| Spike in 400 | Schema drift or bad client | Compare sample payload to Zod/schema version |
| 5xx from app | Downstream DB or bug | Incident path; scale or rollback |
| Silent no processing | Consumer lag | Queue depth; `integration_events` stuck |

### Operational steps

1. Confirm **endpoint URL** and **environment** (prod vs staging).
2. Pull **last N deliveries** from provider dashboard; correlate with `integration_events`.
3. **Replay** only idempotent events after fix; document in audit if manual.

---

## Outbound example: Cursor automation webhook (this repo)

Workflow: `.github/workflows/cursor-ready-for-ai-webhook.yml`.

- **401/400 from Cursor** — see workflow log body; auth vs `failed_precondition` (capacity) vs payload.
- **GitHub Actions re-run** — re-runs old commits; use **Run workflow** on latest `main` for current YAML.

Details: `docs/architecture/CURSOR_GITHUB_CUTOVER_CHECKLIST.md`.

---

## Related

- `docs/runbooks/PAYMENT_RECONCILIATION.md`
- `docs/runbooks/INCIDENT_RESPONSE.md`
- `docs/testing/ENFORCEMENT_MATRIX.md`
