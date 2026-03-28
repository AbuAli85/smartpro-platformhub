# Issue drafts (`docs/issues/`)

Markdown drafts for GitHub issues. Each file should:

- Start with `Status:` matching the [issue state machine](../architecture/AI_EXECUTION_LOOP.md#issue-state-machine) and [operational slice rule](../architecture/AI_EXECUTION_LOOP.md#operational-slice-rule-trustworthy-factory), e.g. `DRAFT`, `READY_FOR_AI`, `IN_PROGRESS`, `DONE`, `BLOCKED` (use **`DONE`** only after `npm run verify` passes with Postgres where required)
- Include `Priority: P0` | `P1` | `P2` as needed
- Use a single `# Title` line for the issue title (used by `scripts/publish-issues.ts`)

List drafts that are `READY_FOR_AI`:

```bash
npm run orchestration:list-ready
```

## Publish to GitHub

From the repo root, with [GitHub CLI](https://cli.github.com/) authenticated (`gh auth login`):

```bash
npm run publish-issues
```

**Caution:** This creates one GitHub issue per `.md` file every run. Use for an initial import or extend the script to avoid duplicates.

## Publishing and Verification

Before publishing implementation issues, make sure:
- the issue has `Status: READY_FOR_AI`
- the issue has `Priority`
- local verification scripts are available where relevant

Suggested local workflow before or after implementation:
- `npm run migrate`
- `npm run reset-test-db`
- `npm run verify`

## Quality Gate Expectation

For implementation-heavy backend issues, expected local verification is:

- `npm run verify`

This should apply migrations, reset the test DB, and run integration tests through one standard command.

## Strict Completion Gate

For implementation-heavy backend issues, the expected local verification command is:

- `npm run verify`

A backend task should not be treated as complete if the full verification gate fails.

## Verification Modes

- Local: `npm run verify`
- CI: `npm run verify:ci`

Both must pass for backend work to be considered complete.

See also `docs/AI_EXECUTION_RULES.md`.
