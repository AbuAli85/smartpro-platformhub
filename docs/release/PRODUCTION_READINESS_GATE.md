# Production readiness gate

**Use:** before calling a **module** or **release** “production ready.” Check every box that applies; document exceptions with owner sign-off.

---

## 1. Architecture and product

- [ ] Module scope aligned with `docs/core/PRODUCT_CONSTITUTION.md` and domain model.
- [ ] No undocumented **parallel** status or permission model.
- [ ] Dependencies on other modules explicit (failure modes known).

---

## 2. Security and authority

- [ ] **Server-side** RBAC (and tenant isolation where required) on every protected path.
- [ ] Schema validation (e.g. Zod) on **mutations** touching this module.
- [ ] Rate limits or abuse controls on sensitive endpoints (if exposed to internet).
- [ ] Secrets only via secret manager; env vars in schema.

---

## 3. Workflow and audit

- [ ] State transitions match canonical workflow docs; forbidden transitions rejected.
- [ ] **Audit events** emitted for privileged and financial actions per `AUDIT_LOGGING_PATTERN.md`.
- [ ] Human-touch **level** (1–4 per blueprint) documented for sensitive actions in this module.

---

## 4. Async and side effects

- [ ] Long-running or retriable work **queued** (not only in-request); failures visible in dashboard or ledger.
- [ ] **Idempotency** for webhooks and payment-adjacent operations.
- [ ] Notification paths logged (`notification_deliveries` or equivalent when available).

---

## 5. Observability and operations

- [ ] Structured logs with **correlation id** on critical paths.
- [ ] Error tracking (e.g. Sentry) configured for this surface.
- [ ] Runbook exists or updated: `FAILED_JOBS_AND_RETRY`, `WEBHOOK_FAILURES`, and/or `PAYMENT_RECONCILIATION` as applicable.
- [ ] On-call knows how to **rollback** or **disable** this module (feature flag or config).

---

## 6. Testing

- [ ] Unit coverage for pure rules (permissions, transitions, money formatting).
- [ ] Integration tests for API / DB flows for this module.
- [ ] Security tests: unauthorized and **wrong-tenant** denied.
- [ ] Critical user journey covered in E2E **or** explicitly deferred with ticket + date.

---

## 7. Release mechanics

- [ ] Migrations reviewed and tested in staging; rollback or forward-fix documented (`DEPLOYMENT_AND_RELEASE.md`).
- [ ] `docs/testing/ENFORCEMENT_MATRIX.md` updated for new checks introduced.
- [ ] **Manual ops burden** assessed acceptable (runbooks + dashboards sufficient).

---

## Sign-off

| Role | Name | Date |
|------|------|------|
| Accountable (product/platform) | | |
| Backend lead | | |
| Security (if sensitive) | | |

---

## Related

- `docs/runbooks/DEPLOYMENT_AND_RELEASE.md`
- `docs/operations/RACI.md`
- `docs/architecture/SMARTPRO_PLATFORM_MASTER_BLUEPRINT.md`
