# AI Execution Rules

## Source of Truth
- All tasks originate from `docs/issues/`
- Only tasks marked `Status: READY_FOR_AI` can be executed

## Execution Flow
1. Read issue
2. Create or modify code
3. Validate against acceptance criteria
4. Update status to DONE

## Rules
- Do not modify unrelated files
- Do not bypass RBAC or tenant-scope rules
- Follow repository and audit patterns
- Keep implementations minimal and correct

## Completion Definition
- All files in acceptance criteria exist
- Code compiles
- Patterns are followed
- No security regression introduced

## Publishing drafts to GitHub

Requires [GitHub CLI](https://cli.github.com/) (`gh auth login`).

Run from the repository root (Node 22+ with `--experimental-strip-types`, or use `npx tsx scripts/publish-issues.ts`):

```bash
npx tsx scripts/publish-issues.ts
```

**Warning:** Running the publisher against every file will create a new GitHub issue per file each time. Use for initial bulk publish or extend the script to track published files / skip existing issues.
