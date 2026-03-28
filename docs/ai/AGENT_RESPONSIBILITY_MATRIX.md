# Agent responsibility matrix

**Scope:** AI and automation (Cursor cloud agents, future bots) that modify or propose changes to SmartPRO.

**Principle:** default **least privilege**; **forbidden zones** unless human escalation and approval.

---

## Capability levels

| Level | Meaning |
|-------|---------|
| **R0 — Read only** | Browse repo, docs, logs; no commits |
| **R1 — Propose** | Draft patches, comments, issues; no merge |
| **R2 — Implement** | Branch + PR with tests; no merge without human |
| **R3 — Execute** | Run tests locally/CI; still no unreviewed merge |
| **R4 — Trusted path** | Merge only where branch protection + required checks + human approval already enforced |

Agents operate at **R2** by default; production merge is always **human + CI** unless explicitly automated for non-prod.

---

## By domain (max allowed level without escalation)

| Domain | Max level | Notes |
|--------|-----------|-------|
| General app code (UI, internal tools) | R2 | Tests required for behavior change |
| **Docs** (governance repo) | R2 | Factual accuracy reviewed by owner |
| **Tests** (unit/integration) | R3 | Must follow patterns in `docs/testing/*` |
| **Migrations** | R1 propose → **human required** | Never auto-apply prod |
| **Auth / session / JWT** | R1 | Security owner review mandatory |
| **RBAC / permission checks** | R1 | Security + platform review |
| **Billing / payments** | R1 | Finance + backend review |
| **Workflow core** (canonical transitions) | R1 | Product + platform review |
| **Secrets / env** | **Forbidden** | Never commit; use secret manager |
| **Dependency major bumps** | R1 | Supply-chain review if critical path |
| **Branch protection / Actions** | R1 | Platform only |

---

## Forbidden zones (without written exception)

- Rotating or reading **production** credentials in agent context.
- Disabling **lint, tests, or typecheck** to “get green.”
- Introducing **parallel** status enums or permission maps not reflected in `RBAC_MODEL` / workflow docs.
- **Client-only** authorization for protected operations.
- **Direct SQL** outside approved data-access layer (when implementation adopts that rule).

---

## Escalation

1. Agent stops at boundary → **issue comment** or **draft PR** with `@mention` to owner from `OWNERSHIP_MAP.md`.
2. **Security-sensitive** → Security role per `RACI.md`.
3. **Ambiguous product behavior** → Product accountable.

---

## Cursor / GitHub specifics

- Issues labeled per `AI_EXECUTION_LOOP.md`; webhook only **signals** readiness — humans retain merge authority.
- Agents follow `docs/standards/ENGINEERING_STANDARDS.md` and `DEFINITION_OF_DONE.md`.

---

## Related

- `docs/architecture/AI_EXECUTION_LOOP.md`
- `docs/operations/RACI.md`
- `docs/testing/ENFORCEMENT_MATRIX.md`
