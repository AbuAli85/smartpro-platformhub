import {
  buildProtectedHandlerExclusionSummary,
} from "../tests/integration/helpers/protected-handler-exclusion-review-summary";

function main() {
  const rows = buildProtectedHandlerExclusionSummary();
  console.log(JSON.stringify(rows, null, 2));
}

main();
