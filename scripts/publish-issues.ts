import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const issuesDir = path.resolve("docs/issues");

function getIssueFiles(): string[] {
  return fs.readdirSync(issuesDir).filter((f: string) => f.endsWith(".md"));
}

function extractTitle(content: string): string {
  const firstHeading = content.split("\n").find((line) => line.startsWith("# "));
  if (!firstHeading) {
    throw new Error("No markdown title (# ...) found in issue file");
  }
  return firstHeading.replace(/^#\s*/, "").trim();
}

function publishIssue(file: string): void {
  const fullPath = path.join(issuesDir, file);
  const content = fs.readFileSync(fullPath, "utf-8");
  const title = extractTitle(content);

  console.log(`Publishing: ${title}`);

  execSync(`gh issue create --title ${JSON.stringify(title)} --body-file ${JSON.stringify(fullPath)}`, {
    stdio: "inherit",
  });
}

function main(): void {
  const files = getIssueFiles();

  for (const file of files) {
    publishIssue(file);
  }
}

main();
