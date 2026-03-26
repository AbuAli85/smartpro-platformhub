# Issue drafts (`docs/issues/`)

Markdown drafts for GitHub issues. Each file should:

- Start with `Status: READY_FOR_AI` (or `IN_PROGRESS` / `DONE` when you adopt that workflow)
- Include `Priority: P0` | `P1` | `P2` as needed
- Use a single `# Title` line for the issue title (used by `scripts/publish-issues.ts`)

## Publish to GitHub

From the repo root, with [GitHub CLI](https://cli.github.com/) authenticated (`gh auth login`):

```bash
npm install
npm run publish-issues
```

**Caution:** This creates one GitHub issue per `.md` file every run. Use for an initial import or extend the script to avoid duplicates.

See also `docs/AI_EXECUTION_RULES.md`.
