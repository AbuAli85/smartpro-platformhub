# Runbook: deployment and release

**Scope:** shipping the **implementation repo** (application) to production-like environments. This governance repo does not deploy app binaries; it defines **what must be true** before and after a release.

**Owners:** see `docs/operations/RACI.md` and `docs/operations/OWNERSHIP_MAP.md`.

---

## Preconditions

- [ ] **Production readiness:** `docs/release/PRODUCTION_READINESS_GATE.md` satisfied for the modules in this release.
- [ ] **CI green** on the merge commit (implementation repo): typecheck, lint, unit/integration, migration checks per `docs/testing/ENFORCEMENT_MATRIX.md`.
- [ ] **Migrations reviewed:** schema changes approved per release authority in `docs/operations/RACI.md`.
- [ ] **Rollback path:** previous release artifact or image tagged; migration down or forward-fix plan documented for this change set.
- [ ] **Secrets / env:** no undeclared variables; env validated per implementation env schema.

---

## Standard release flow (implementation repo)

1. **Freeze scope** — merged PRs on default branch only; no drive-by commits during cut.
2. **Changelog / release notes** — user-visible changes, breaking API changes, migration notes.
3. **Database** — run migrations in **staging** first; verify app health; then production in a **maintenance window** if required.
4. **Application** — deploy application revision that matches the tested commit SHA.
5. **Smoke** — health checks, auth, one critical read path, one critical write path (non-destructive).
6. **Monitor** — error rate, latency, job queue depth, webhook success rate for 30–60 minutes.

Adjust step names to your host (e.g. Vercel, Fly, Kubernetes); keep the **order** and **gates**.

---

## Post-deploy

- [ ] Confirm **monitoring** and **alerting** show expected baselines.
- [ ] Spot-check **audit_events** (or equivalent) for the first privileged actions after deploy.
- [ ] If feature flags exist, ramp per plan; document flag state in release notes.

---

## Rollback

1. **App:** redeploy previous known-good revision (same SHA as last good deploy).
2. **DB:** only if migration is backward-compatible or a documented down migration exists; otherwise apply **forward fix** — never leave prod schema and code mismatched without an explicit incident.
3. **Communicate** — status page or internal channel per `INCIDENT_RESPONSE.md` if users were impacted.

---

## Related

- `docs/release/PRODUCTION_READINESS_GATE.md`
- `docs/runbooks/INCIDENT_RESPONSE.md`
- `docs/runbooks/FAILED_JOBS_AND_RETRY.md`
- `docs/architecture/SMARTPRO_PLATFORM_MASTER_BLUEPRINT.md`
