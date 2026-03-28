# Runbook: payment reconciliation

**Scope:** money movement integrity — gateway webhooks, internal ledger, invoices, refunds. **Implementation repo** owns code; this runbook defines operational discipline.

**Owners:** billing + platform — `docs/operations/RACI.md`.

---

## Principles

- **Never** infer paid status from UI alone; **server** state + gateway truth must align.
- All payment-affecting paths require **audit** and **idempotency keys** (see `ENFORCEMENT_MATRIX.md`).
- **Webhook-first** where the gateway supports it; polling is a backup.

---

## Daily / periodic checks

- [ ] Unmatched webhooks: events in `integration_events` (or gateway dashboard) without corresponding internal payment rows.
- [ ] Stuck states: `authorized` but not captured beyond SLA; `processing` beyond threshold.
- [ ] Refund parity: gateway refunds vs internal records.

---

## When numbers disagree

1. **Freeze** bulk retries for the affected window.
2. **Export** gateway event list and internal `payment_attempts` / invoices for the time range (redact PII in tickets).
3. **Classify:** duplicate webhook, missed webhook, clock skew, partial failure, fraud flag.
4. **Correct** via **forward adjustment** (preferred) with audit; document in incident if SEV2+.

---

## Retry rules

- **Idempotent** capture/void only with same idempotency key as original intent.
- **Never** double-capture; if uncertain, **manual review** (human approval level per blueprint § exception model).

---

## Related

- `docs/runbooks/WEBHOOK_FAILURES.md`
- `docs/runbooks/INCIDENT_RESPONSE.md`
- `docs/architecture/AUDIT_LOGGING_PATTERN.md`
