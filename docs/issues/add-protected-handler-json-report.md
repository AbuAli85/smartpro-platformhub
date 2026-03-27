Status: READY_FOR_AI
Priority: P0

# Add JSON report output for protected-handler exclusion visibility

## Objective
Provide a machine-readable exclusion visibility report so SmartPRO can support lightweight automation and tooling without changing the existing review summary model.

## Scope
- JSON report helper
- JSON CLI report script
- package script for machine-readable output
- docs for human vs machine report modes
- issue draft for JSON visibility reporting

## Acceptance Criteria
- JSON output is deterministic
- JSON output uses the existing exclusion summary helper
- package script exists for running the JSON report
- docs created:
  - docs/testing/PROTECTED_HANDLER_JSON_REPORT_PATTERN.md
  - docs/testing/PROTECTED_HANDLER_HUMAN_VS_MACHINE_REPORTS.md
