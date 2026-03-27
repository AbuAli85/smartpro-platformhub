import {
  getProtectedHandlerGovernanceHealth,
} from "../tests/integration/helpers/protected-handler-governance-health";

function main() {
  const health = getProtectedHandlerGovernanceHealth();

  console.log("Protected Handler Governance Health");
  console.log(`Governed Handlers: ${health.governedHandlers}`);
  console.log(`Excluded Handlers: ${health.excludedHandlers}`);
  console.log(`Near-Due Exclusions: ${health.nearDueExclusions}`);
  console.log(`Overdue Exclusions: ${health.overdueExclusions}`);
}

main();
