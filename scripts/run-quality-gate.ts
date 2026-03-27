import { execSync } from "child_process";

function runStep(name: string, command: string) {
  console.log(`\n=== ${name} ===`);
  execSync(command, { stdio: "inherit" });
  console.log(`✓ ${name} passed`);
}

function main() {
  try {
    runStep("Lint", "npm run lint");
    runStep("Typecheck", "npm run typecheck");
    runStep("Apply migrations", "npm run migrate");
    runStep("Reset test database", "npm run reset-test-db");
    runStep("Run integration tests", "npm run test:integration");

    console.log("\n✅ Quality gate passed");
  } catch (_error) {
    console.error("\n❌ Quality gate failed");
    process.exit(1);
  }
}

main();
