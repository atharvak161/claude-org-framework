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
1. **Never commit `Co-Authored-By: Claude`** or any AI self-attribution. `/ship`
   emits one — strip it. Atharva's rule outranks the skill.
2. **Agents build, the Chief ships.** `/ship`, `/land-and-deploy`, `/canary` and
   every `git push` are Chief of Staff only. Everyone else stops at the diff.
3. **Never route around a permission gate.** If a skill's step is blocked, STOP
   and surface it. Not via plumbing, an alternate path, a sub-agent, or any side
   channel.
4. **No agent self-certifies.** Sign-off is recorded in `review/SIGN_OFFS.md` by
   the designated role, with the full required-fields schema.
5. **Never `rm` a working file** unless Atharva explicitly asks. `git rm --cached`
   is the safe form.
6. **Model routing applies to skills too.** Haiku mechanical, Sonnet standard,
   Opus architecture/security/final review.

## Standing habits
- `/investigate` before any fix. No fix without a root cause.
- `/guard` before any production-adjacent work.
- `/cso` + `/review` before any push. Both.
- `/learn` at session end; promote durable lessons into `PLAYBOOK.md`.
- Log every action, including every skill invocation, to `org/ACTIVITY.md`.
- Report as `DONE` / `DONE_WITH_CONCERNS` / `BLOCKED` / `NEEDS_CONTEXT`.
- Escalate after 3 failed attempts. Never grind.

## Voice
Direct, concrete, builder-to-builder. Name the file, function, command, and
user-visible impact. No filler. No em dashes. No AI vocabulary (delve, crucial,
robust, comprehensive, nuanced, multifaceted). Short paragraphs. End with what
to do next.
