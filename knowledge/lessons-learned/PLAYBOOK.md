# PLAYBOOK — Hard-won operating rules
# Owner: Chief of Staff (curates) · All agents read before every task
# Purpose: Durable lessons that prevent repeat mistakes. Read alongside WORKSPACE.md.

## Working with live / production systems
- **Always pull the live source before editing.** The local clone may be stale — fetch `origin/main` and verify your base equals `origin/main` first. (We nearly overwrote a newer live portfolio with an older local copy.)
- **Additive-only to anything live.** Never push rejected, experimental, or half-built work to a production branch. Keep a pristine backup (e.g. `index.original.html`) before large changes.
- **Preview, then ship.** Serve at localhost and get an explicit "ship it" from Atharva before any push to a public site.

## File safety
- **Single writer per file.** For large or shared files, exactly one agent edits at a time — no parallel edits to the same file.
- **Never delete locally without explicit request.** Use `git rm --cached` to untrack; never `rm` a working file unless Atharva asks.
- **Don't overwrite pristine backups** (`*.original.html`, `*.bak.html`).

## Irreversible / outward-facing actions
- **Confirm before anything irreversible or public** (pushes, deploys, deletions, sending external messages). Approval in one context does not extend to the next.
- **Verify before reporting done.** If tests fail, say so with the output. State plainly what was skipped.

## Cost discipline
- **Right-size the model.** Mechanical work (search, logging, file moves, formatting) → Haiku; standard build/doc/test work → Sonnet; architecture, security, complex debugging, final review → Opus. See WORKSPACE.md "Model routing policy".

## Quality gates
- **Validate-or-bounce, capped at 2.** Reviewing is active, not passive — a parent agent that finds a deliverable failing its acceptance criteria must reject it in writing with specific, actionable feedback and redelegate, rather than wave it through or quietly fix it themselves. After 2 failed bounce attempts on the same deliverable, escalate per the existing 2-iteration rule instead of attempting a 3rd. Full procedure: knowledge/protocols/WORKFLOW_PROTOCOL.md, "Validate-or-bounce gate".
- **A sign-off is only valid with all required fields.** review/SIGN_OFFS.md now defines a required-fields schema (role, deliverable, timestamp, verdict, reason-if-rejected) — a checkbox or a bare "approved" no longer satisfies the release gate. See review/SIGN_OFFS.md, "Required fields for a valid sign-off".

## Toolchain — gstack (installed 2026-09-03)
- **Check the skill before hand-rolling.** gstack is at `~/.claude/skills/gstack`. Full catalogue and phase mapping: knowledge/protocols/GSTACK_PROTOCOL.md. Hand-rolling a workflow a skill already encodes is a defect, not initiative.
- **`/investigate` before any fix.** No root cause, no fix. Stop after 3 failed hypotheses and escalate.
- **`/review` AND `/cso` before any push.** Both, every time. Skill output is evidence for a sign-off, never the sign-off.
- **`/browse` for all web interaction** — never the `mcp__claude-in-chrome__*` tools.
- **`/ship`, `/land-and-deploy`, `/canary` and every push are Chief of Staff only.** Agents stop at the diff.
- **Strip `Co-Authored-By: Claude` from every commit.** `/ship` emits it (`ship/SKILL.md` ~line 888, `hosts/claude.ts`). Our no-self-attribution rule outranks the skill. Re-verify after every `/gstack-upgrade` — upgrades overwrite the vendored tree, which is exactly why our overrides live in GSTACK_PROTOCOL.md and not as patches to it.
- **A gate still stops you.** `/careful` and `/guard` add warnings; they never replace a permission gate. Never route a blocked command around one.

## Deferred — revisit on trigger
- **Strict output schemas per department (MetaGPT-style)** — revisit when prose reports start causing real misunderstandings/rework between departments.
- **Typed/structured STATUS.md and BLOCKERS.md fields (LangGraph-supervisor style)** — revisit when 3+ concurrent active projects make freeform status hard to parse.
- **Explicit handoff-vs-tool-call codification in org/AGENT_REGISTRY.md (OpenAI Agents SDK style)** — revisit on first real incident caused by ambiguity over which department owns a task.
