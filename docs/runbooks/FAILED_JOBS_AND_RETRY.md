# Runbook: failed jobs and retry

**Scope:** durable **async work** (queues, schedulers, workflow runners). Applies once the implementation repo operates Trigger.dev, Inngest, Bull, or equivalent.

**Owners:** async / platform — `docs/operations/OWNERSHIP_MAP.md`.

---

## Observability

- **Dashboard:** job runner UI, queue depth, failure rate, oldest pending job age.
- **Data:** `job_runs` / `workflow_runs` ledgers (when implemented) — see blueprint § canonical ledgers.
- **Logs:** structured logs with **job id**, **correlation id**, **tenant id** (if applicable).

---

## Triage checklist

1. **Classify** — transient (timeouts, 429 from vendor) vs logic bug vs poison message.
2. **Idempotency** — safe to retry? If not, **do not** bulk replay; fix code or mark dead-letter.
3. **Blast radius** — one tenant vs global; pause tenant-specific fan-out if needed.
4. **Dependencies** — DB down, Redis full, external API degraded.

---

## Safe retry

- **Single job:** use runner’s “retry” with same **idempotency key**; verify downstream side effects are deduped.
- **Batch:** only after root cause fixed; prefer **time-bounded replay** (e.g. last 1h failed) over full replay.
- **Never** retry payment-capture or irreversible external calls without explicit reconciliation — see `PAYMENT_RECONCILIATION.md`.

---

## Dead-letter handling

1. Move failed messages to DLQ or mark `failed_permanent` in ledger.
2. **Ticket** with payload redacted (PII removed).
3. **Fix** code or data; optional **manual completion** with audit entry.

---

## Prevention

- Alert on **error rate** and **queue age** SLOs.
- Add **integration tests** for job handlers per `docs/testing/ENFORCEMENT_MATRIX.md`.

---

## Related

- `docs/runbooks/INCIDENT_RESPONSE.md`
- `docs/architecture/NOTIFICATION_ARCHITECTURE.md`
- `docs/architecture/SMARTPRO_PLATFORM_MASTER_BLUEPRINT.md`
