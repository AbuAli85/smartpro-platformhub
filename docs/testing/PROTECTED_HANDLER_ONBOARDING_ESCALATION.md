# Protected Handler Onboarding Escalation

## Purpose
Defines how SmartPRO escalates likely protected-handler candidates into onboarding review.

## Escalation Rule
If a handler is added to the protected-handler candidate list, it must be reviewed for one of two outcomes:
1. add it to the protected-handler inventory and begin governance onboarding
2. add it to the explicit exclusion list with a clear reason

## Preferred Outcome
Prefer onboarding into the protected-handler inventory when the handler:
- touches tenant or privileged data
- has stable boundary semantics
- should be governed like other protected handlers

## Exception Rule
Explicit exclusion is allowed only when:
- the handler is transient or non-governed by design
- the handler is not actually boundary-critical
- the reason is documented and reviewable

## Related
- `PROTECTED_HANDLER_DISCOVERY_RULES.md`
- `PROTECTED_HANDLER_ONBOARDING_CHECKLIST.md`
- `PROTECTED_HANDLER_GROWTH_PATTERN.md`
