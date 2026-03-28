# RACI — SmartPRO platform and product

**R**esponsible / **A**ccountable / **C**onsulted / **I**nformed for major control-plane areas.

Replace role names (`Platform Lead`, `Security`, etc.) with **actual people or groups** in your org.

| Area | Accountable (A) | Responsible (R) | Consulted (C) | Informed (I) |
|------|-----------------|-----------------|---------------|--------------|
| **Workflow definitions** (canonical states/transitions) | Product + Platform | Platform eng | Legal (if contractual SLAs) | Support |
| **RBAC / permissions model** | Security | Platform eng | Product | All eng |
| **Audit logging** | Security | Platform eng | Compliance | On-call |
| **Async jobs / queues** | Platform | Backend eng | SRE | Product |
| **External integrations** | Platform | Backend eng | Security (secrets) | Product |
| **Notifications** | Product | Backend eng | Platform | Marketing (if user-facing copy) |
| **Billing / payments** | Finance owner | Backend eng | Security, Legal | Product |
| **Incident response** | On-call lead | On-call engineer | Security, Comms | Leadership |
| **Release approval (prod)** | Eng manager / delegate | Release captain | Security (risky changes) | Stakeholders |
| **Migrations (prod)** | Platform | DBA / backend | Product (breaking) | On-call |
| **Workflow engine code** (core transitions) | Platform | Backend eng | Product | — |
| **Auth / session** | Security | Backend eng | Platform | — |
| **Automation policy** (CI, bots, Cursor) | Platform | DevEx | Security | Eng |
| **Governance docs** (this repo) | Platform | Tech writer / lead | Product, Security | Eng |

**Release authority (who must approve merges to sensitive areas):**

| Change type | Approvers (minimum) |
|-------------|---------------------|
| Schema migrations (prod) | Accountable for Platform + Responsible backend |
| RBAC / permission map | Security (A) sign-off on material changes |
| Billing / payment logic | Finance owner + backend |
| Auth / session core | Security + backend |
| Integration credentials | Security + Platform |
| Workflow **canonical** state/transition changes | Product + Platform |
| Automation / branch protection rules | Platform + Security |

Document **CODEOWNERS** in the implementation repo to mirror this table.

---

## Related

- `docs/operations/OWNERSHIP_MAP.md`
- `docs/release/PRODUCTION_READINESS_GATE.md`
- `docs/architecture/SMARTPRO_PLATFORM_MASTER_BLUEPRINT.md`
