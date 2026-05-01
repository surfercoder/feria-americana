---
description: Run react-doctor + checks, then commit and push to main
---

Prepare the current branch for shipping by running quality gates and pushing. This is a solo project — commit directly to the current branch (typically `main`) and push.

## Steps

1. **react-doctor must score 100/100.**
   - Run `npx react-doctor` and read the full output.
   - For every issue reported, fix it in the source code (do not silence rules or edit the report). Re-run `npx react-doctor` after each round of fixes.
   - Loop until the score is exactly **100/100**. Do not proceed otherwise.

2. **`npm run checks` must pass cleanly.**
   - Run `npm run checks` (this runs `eslint . && tsc --noEmit && next build`).
   - Fix every error and every lint warning until the command exits 0 with no warnings and the Next.js build completes successfully.
   - Do not skip, ignore, or `eslint-disable` to make it pass — fix the underlying cause.
   - If react-doctor fixes introduced new issues, loop back to step 1 after fixing them.

3. **Commit and push.**
   - Show `git status` and `git diff` so the user can see what's about to be committed.
   - Stage only the files that are part of this work (do not blanket `git add -A` — avoid pulling in unrelated changes or secrets).
   - Write a concise commit message that explains *why*, following the style of recent commits (`git log --oneline -5`).
   - End the message with the standard `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` trailer (use a HEREDOC).
   - Push to the current branch's upstream with `git push`. If no upstream is set, use `git push -u origin <current-branch>`.
   - Confirm the push succeeded by checking `git status` shows the branch up to date with the remote.

## Rules

- Never use `--no-verify`, `--no-gpg-sign`, or any flag that bypasses hooks/signing.
- Never amend or force-push.
- If any step fails in a way you can't resolve, stop and report what's blocking — do not push partial work.
- Report the final commit SHA and a one-line summary at the end.
