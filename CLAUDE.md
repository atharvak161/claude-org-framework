# Organisation — root instructions
# Applies to every agent, every department, every task in this workspace.
# Owner: Chief of Staff

## Before any task
1. Read `WORKSPACE.md`
2. Read `knowledge/protocols/GSTACK_PROTOCOL.md` — the toolchain you work with
3. Read `knowledge/protocols/WORKFLOW_PROTOCOL.md` — how work moves
4. Read `knowledge/lessons-learned/PLAYBOOK.md` — mistakes we do not repeat
5. Log your start line to `org/ACTIVITY.md`

## gstack
gstack is installed at `~/.claude/skills/gstack` and is this organisation's
**default toolchain**. It is not optional. Atharva's standing order: always use
the skills relevant to the task, natively, without being asked.

**Before hand-rolling any approach, check `knowledge/protocols/GSTACK_PROTOCOL.md`
for the skill that already does it.** Hand-rolling a workflow a skill encodes is
a defect.

**Use the `/browse` skill for all web browsing. Never use `mcp__claude-in-chrome__*`
tools.**

Available skills:
`/office-hours`, `/spec`, `/autoplan`, `/plan-ceo-review`, `/plan-eng-review`,
`/plan-design-review`, `/plan-devex-review`, `/design-consultation`,
`/design-shotgun`, `/design-html`, `/design-review`, `/devex-review`,
`/investigate`, `/review`, `/codex`, `/cso`, `/health`, `/qa`, `/qa-only`,
`/browse`, `/scrape`, `/skillify`, `/benchmark`, `/setup-browser-cookies`,
`/open-gstack-browser`, `/connect-chrome`, `/pair-agent`, `/ship`,
`/land-and-deploy`, `/canary`, `/setup-deploy`, `/landing-report`,
`/document-release`, `/document-generate`, `/make-pdf`, `/diagram`, `/retro`,
`/learn`, `/context-save`, `/context-restore`, `/careful`, `/freeze`,
`/unfreeze`, `/guard`, `/gstack-upgrade`, `/setup-gbrain`, `/sync-gbrain`,
`/benchmark-models`, `/plan-tune`, `/ios-qa`, `/ios-fix`, `/ios-design-review`,
`/ios-clean`, `/ios-sync`

Full catalogue, phase mapping and house overrides: `knowledge/protocols/GSTACK_PROTOCOL.md`

## Where things live

This repo is **public**. `local/` is ignored wholesale and holds everything
machine-only — working clones of the GitHub repos (`local/repos/<name>/`, each
with its own `_local/` scratch), the offline practice exam, client work, local
tools, backups and rescued state. Operational logs in `org/` and
`review/SIGN_OFFS.md` are untracked for the same reason: they carry real client
names.

Before touching any project clone, fetch first — a stale clone that gets pushed
reverts live work:

```bash
cd local/repos/<name> && git fetch origin && git status
```

Full map: `local/README.md`, `WORKSPACE.md`, and the paths block in every
agent's own `CLAUDE.md`.

## House overrides that beat any skill default

1. **NOTHING IS EVER DELETED. Deleting means moving it out, not destroying it.**
   Atharva's rule, and the highest-priority instruction in this workspace:
   *"delete means not actually delete — transfer it, move it to a folder in
   downloads outside the organisation where I can look and delete what is not
   needed."*

   Use `bin/safe-delete <path> "reason"`. It moves the target to
   `~/Downloads/_QUARANTINE - safe to delete/` with a manifest saying what it
   was, where it came from, why, and the command to restore it. Atharva is the
   only one who empties that folder.

   **Never run `rm`, `rm -rf`, `rmdir`, `find -delete`, or any other destroying
   command on anything in this workspace.** Not on scratch files, not on test
   fixtures, not on something you created yourself thirty seconds ago. There is
   no size or importance threshold — `safe-delete` is the only route.

   Before removing anything, still: ask and get a clear yes, `ls -la --` the
   absolute path, read what is inside, count the files, and check no
   case-variant collides. `safe-delete` enforces those checks and refuses
   outside the workspace or anywhere in iCloud, but the checks are yours too.

   **Testing never touches real data.** Every test fixture, scratch file and
   probe goes in `$CLAUDE_JOB_DIR/tmp`, never in the workspace — and never
   anywhere a name could collide with something real. Do not test a destructive
   command against a live directory to see what happens, and do not create a
   fixture next to the thing it is named after. The incident was a test fixture
   named `Local` sitting beside `local`.

   **Why this is rule one:** on 2026-09-13 `rm -rf Local` destroyed 1,040 files
   — 7 project clones, the offline practice exam, private client deliverables,
   every local backup, and git bundles of rescued unpushed work. macOS is
   case-insensitive, so `Local` and `local` were the same directory. No Time
   Machine destination exists on this Mac and `rm` bypasses the Trash. Only the
   GitHub-backed clones came back. The command looked harmless, which is exactly
   why the rule is mechanical rather than a matter of judgement.

2. **Never commit `Co-Authored-By: Claude`** or any AI self-attribution. `/ship`
   emits one — strip it. Atharva's rule outranks the skill. `.githooks/commit-msg`
   blocks it mechanically.
3. **Agents build, the Chief ships.** `/ship`, `/land-and-deploy`, `/canary` and
   every `git push` are Chief of Staff only. Everyone else stops at the diff.
4. **Never route around a permission gate.** If a skill's step is blocked, STOP
   and surface it. Not via plumbing, an alternate path, a sub-agent, or any side
   channel.
5. **No agent self-certifies.** Sign-off is recorded in `review/SIGN_OFFS.md` by
   the designated role, with the full required-fields schema.
6. **Model routing applies to skills too.** Haiku mechanical, Sonnet standard,
   Opus architecture/security/final review.

## Standing habits
- `bin/repo-status --fetch` before starting a cycle. Nothing begins on a repo that is behind live or dirty.
- Project code goes in `local/repos/<project>/`, never at the framework root. `src/`, `tests/`, `ci/`, `infra/` at the root are blocked by the pre-commit hook.
- Finish a cycle in both repos: push the project, then push what the cycle taught back into the framework repo.
- `/investigate` before any fix. No fix without a root cause.
- `/guard` before any production-adjacent work.
- `/cso` + `/review` before any push. Both.
- Check the repo's README on every change, however small. Report `README: checked, ...` — no line, not done.
- Touching the portfolio repo? Refresh the live TryHackMe figures first, and ask Atharva about any new badge. Report `THM figures: checked, ...`.
- `/learn` at session end; promote durable lessons into `PLAYBOOK.md`.
- Log every action, including every skill invocation, to `org/ACTIVITY.md`.
- Report as `DONE` / `DONE_WITH_CONCERNS` / `BLOCKED` / `NEEDS_CONTEXT`.
- Escalate after 3 failed attempts. Never grind.

## Voice
Direct, concrete, builder-to-builder. Name the file, function, command, and
user-visible impact. No filler. No em dashes. No AI vocabulary (delve, crucial,
robust, comprehensive, nuanced, multifaceted). Short paragraphs. End with what
to do next.
