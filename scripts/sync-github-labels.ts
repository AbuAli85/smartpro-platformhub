import { spawnSync } from "node:child_process";

/**
 * Canonical AI/orchestration labels — keep in sync with
 * docs/architecture/AI_EXECUTION_LOOP.md (state + role tables).
 */
const LABELS: { name: string; color: string; description: string }[] = [
  {
    name: "ai-state:draft",
    color: "6A737D",
    description: "Issue text incomplete; not executable (maps to DRAFT).",
  },
  {
    name: "ai-state:ready-for-ai",
    color: "0E8A16",
    description: "Executable; eligible for cloud agent pickup (READY_FOR_AI).",
  },
  {
    name: "ai-state:in-progress",
    color: "FBCA04",
    description: "Agent or human actively implementing (IN_PROGRESS).",
  },
  {
    name: "ai-state:verifying",
    color: "1D76DB",
    description: "Implementation done; verify/CI in flight (VERIFYING).",
  },
  {
    name: "ai-state:complete",
    color: "006B75",
    description: "Acceptance met and verify passed (COMPLETE).",
  },
  {
    name: "ai-state:blocked",
    color: "D73A4A",
    description: "Waiting on human, external system, or conflict (BLOCKED).",
  },
  {
    name: "ai-role:architect",
    color: "5319E7",
    description: "Primary role: architecture / boundaries / epic split.",
  },
  {
    name: "ai-role:backend",
    color: "0052CC",
    description: "Primary role: backend, handlers, repositories, migrations.",
  },
  {
    name: "ai-role:frontend",
    color: "C2E0C6",
    description: "Primary role: frontend, UI, UX.",
  },
  {
    name: "ai-role:qa",
    color: "FEF2C0",
    description: "Primary role: tests, contracts, verify triage.",
  },
  {
    name: "ai-role:docs",
    color: "BFDADC",
    description: "Primary role: docs and governance assets.",
  },
  {
    name: "ai-role:devops",
    color: "D4C5F9",
    description: "Primary role: CI, environments, release.",
  },
];

function ghLabelUpsert(name: string, color: string, description: string): void {
  const result = spawnSync(
    "gh",
    ["label", "create", name, "--color", color, "--description", description, "--force"],
    { stdio: "inherit" },
  );
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function main(): void {
  for (const label of LABELS) {
    console.log(`Syncing label: ${label.name}`);
    ghLabelUpsert(label.name, label.color, label.description);
  }
  console.log(`Done. Synced ${LABELS.length} labels.`);
}

main();
