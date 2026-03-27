import fs from "node:fs";
import path from "node:path";

const issuesDir = path.resolve("docs/issues");

function extractTitle(content: string): string | undefined {
  const heading = content.split("\n").find((line) => line.startsWith("# "));
  return heading?.replace(/^#\s*/, "").trim();
}

function getStatusLine(content: string): string | undefined {
  const line = content.split("\n").find((l) => l.startsWith("Status:"));
  return line?.replace(/^Status:\s*/i, "").trim();
}

function main(): void {
  if (!fs.existsSync(issuesDir)) {
    console.error(`Missing issues directory: ${issuesDir}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(issuesDir)
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .sort((a, b) => a.localeCompare(b));

  const ready: { file: string; title: string; status: string }[] = [];

  for (const file of files) {
    const fullPath = path.join(issuesDir, file);
    const content = fs.readFileSync(fullPath, "utf-8");
    const status = getStatusLine(content);
    if (status !== "READY_FOR_AI") {
      continue;
    }
    const title = extractTitle(content) ?? "(no title)";
    ready.push({ file, title, status });
  }

  if (ready.length === 0) {
    console.log("No docs/issues/*.md files with Status: READY_FOR_AI (excluding README.md).");
    return;
  }

  console.log("READY_FOR_AI issue drafts (docs/issues):\n");
  for (const row of ready) {
    console.log(`- ${row.file}`);
    console.log(`  Title: ${row.title}`);
  }
}

main();
