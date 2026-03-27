import {
  buildProtectedHandlerExclusionSummary,
  formatProtectedHandlerExclusionSummary,
} from "../tests/integration/helpers/protected-handler-exclusion-review-summary";

function main() {
  const rows = buildProtectedHandlerExclusionSummary();
  const output = formatProtectedHandlerExclusionSummary(rows);

  console.log(output);
}

main();
