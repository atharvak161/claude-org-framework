# GSTACK PROTOCOL — the organisation's standard toolchain
# Owner: Chief of Staff · SSOT for gstack usage across every department
# Mandatory reading for every agent, alongside WORKSPACE.md and WORKFLOW_PROTOCOL.md

gstack (github.com/garrytan/gstack, MIT) is installed at `~/.claude/skills/gstack`.
It is not optional tooling. It is the organisation's default way of working.

**The standing order from Atharva (2026-09-03):**
> "Always make use of this when I ask you to do anything — all skills relevant
> for the task, native root-level integration in the organisation."

This means: for any task, before you hand-roll an approach, you check this file
for the gstack skill that already does it, and you invoke it. Hand-rolling a
workflow that a skill already encodes is a defect, not initiative.

---

## 1. The sprint — how work moves through this organisation

gstack is a process, not a toolbox. Skills chain: each writes an artefact the
next one reads. Our org phases now map onto it one-to-one.

```
Think ──────► Plan ──────► Build ──────► Review ──────► Test ──────► Ship ──────► Reflect
/office-hours  /autoplan     (implement)   /review        /qa          /ship        /retro
/spec          /plan-*-review              /codex         /browse      /land-and-   /learn
                                           /cso           /benchmark    deploy      /document-
                                                          /design-review /canary     release
```

| Org phase (WORKFLOW_PROTOCOL) | gstack skill that runs it |
|---|---|
| Phase 1 — Intake (Chief of Staff) | `/office-hours`, then `/spec` for anything vague |
| Phase 2 — Planning (Senior PM + directors) | `/autoplan` (runs CEO → design → DX → eng in order) |
| Phase 3 — Multi-perspective consultation | `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`, `/plan-devex-review` — these ARE the independent perspectives the protocol demands |
| Phase 4 — Build | role work + `/investigate` for any bug, `/freeze` to stay in scope |
| Phase 5 — Review | `/review`, `/codex` (second opinion), `/health` |
| Phase 6 — Security gate | `/cso` (OWASP Top 10 + STRIDE) — mandatory before any push |
| Phase 7 — QA gate | `/qa` / `/qa-only`, `/browse`, `/benchmark`, `/design-review` |
| Phase 8 — Release | `/ship` then `/land-and-deploy` then `/canary` — **Chief of Staff only** |
| Phase 9 — Documentation | `/document-release`, `/document-generate`, `/make-pdf`, `/diagram` |
| Phase 10 — Reflect | `/retro`, `/learn` |

**The multi-perspective rule is satisfied by the plan-review skills.** A decision
that has been through `/autoplan` has had CEO, design, DX and eng perspectives
applied. That counts as the minimum-two-agents consultation the protocol requires.

---

## 2. House overrides — where our rules beat gstack's defaults

gstack is upstream software. These overrides are ours and they win. They are
written here (not patched into `~/.claude/skills/gstack`) deliberately, so that
`/gstack-upgrade` cannot silently wipe them.

**OVERRIDE 1 — No AI self-attribution on commits. Ever.**
`~/.claude/skills/gstack/ship/SKILL.md` line ~888 and `hosts/claude.ts`
(`coAuthorTrailer`) emit `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>`.
**Strip it.** Never commit it, never let it into a PR body, never let it reach
any GitHub remote. Atharva's standing rule outranks the skill. Re-verify this
after every `/gstack-upgrade`.

**OVERRIDE 2 — Agents build, the Chief ships.**
`/ship`, `/land-and-deploy`, `/canary` and any `git push` are **Chief of Staff
only**. Every other agent may run everything up to the push, then STOP and hand
the diff back. An agent that invokes `/ship` has violated the operating model.

**OVERRIDE 3 — Permission gates outrank every skill.**
If a gstack skill's step hits a safety, approval or permission gate: STOP,
surface it, do not route around it — not via git plumbing, an alternate path,
a sub-agent, or any side channel. `/careful` and `/guard` add warnings; they
never replace the gate. This rule is absolute and predates gstack.

**OVERRIDE 4 — Sign-off stays ours.**
gstack's Completion Status Protocol (`DONE` / `DONE_WITH_CONCERNS` / `BLOCKED` /
`NEEDS_CONTEXT`) is adopted as our standard agent report format. It does **not**
constitute sign-off. Release sign-off is recorded by a human-designated role in
`review/SIGN_OFFS.md` with the full required-fields schema. No agent
self-certifies, and `/cso` output is evidence for Security's sign-off, not the
sign-off itself.

**OVERRIDE 5 — Model routing still applies.**
Invoking a skill does not suspend cost discipline. Haiku for mechanical work,
Sonnet for standard build/doc/test, Opus for architecture, security, complex
debugging and final review. See WORKSPACE.md.

**OVERRIDE 6 — Activity logging still mandatory.**
Every skill invocation is an action. Log it to `org/ACTIVITY.md` in the standard
format, naming the skill:
`[YYYY-MM-DD HH:MM:SS] [ROLE] — SKILL /review — [target] — [reason]`

**OVERRIDE 7 — Nothing local gets deleted without an explicit request.**
`/careful` hard-denies root/home recursive deletes; our rule is stricter — no
`rm` of a working file at all unless Atharva asks. `git rm --cached` is the safe
form.

---

## 3. Full skill catalogue (53 skills, as installed)

### Think & plan
| Skill | Use it for |
|---|---|
| `/office-hours` | Start every new product idea here. Six forcing questions, reframes the request, writes a design doc every downstream skill reads. |
| `/spec` | Turn vague intent into an executable spec in five phases. Use when the ask is fuzzy. |
| `/autoplan` | One command, fully reviewed plan: CEO → design → DX → eng, eng always last. |
| `/plan-ceo-review` | Rethink the problem. Find the 10-star product inside the request. |
| `/plan-eng-review` | Lock architecture, data flow, diagrams, edge cases, test matrix. |
| `/plan-design-review` | Rate each design dimension 0-10, edit the plan to reach 10. AI-slop detection. |
| `/plan-devex-review` | DX review for anything developers consume: API, CLI, SDK, docs. |

### Build & debug
| Skill | Use it for |
|---|---|
| `/investigate` | **Before any fix.** Systematic root cause. Iron law: no fixes without investigation. Stops after 3 failed hypotheses. |
| `/health` | Code quality dashboard for the repo. |
| `/learn` | Review, search, prune project learnings so they compound across sessions. |
| `/context-save` / `/context-restore` | Preserve working context across session boundaries. |
| `/freeze` / `/unfreeze` | Lock edits to one directory. Use while debugging so scope cannot creep. |
| `/careful` | Warn before destructive commands. |
| `/guard` | `/careful` + `/freeze`. **Default posture for any production-adjacent work.** |

### Review & security
| Skill | Use it for |
|---|---|
| `/review` | Pre-landing review. Finds bugs that pass CI and blow up in production. Auto-fixes the obvious. |
| `/codex` | Independent second opinion from OpenAI Codex CLI. Cross-model check. |
| `/cso` | OWASP Top 10 + STRIDE threat model, 8/10 confidence gate, exploit scenario per finding. **Mandatory before any push.** |

### Test & measure
| Skill | Use it for |
|---|---|
| `/qa` | Test the app, find bugs, fix with atomic commits, re-verify, auto-generate regression tests. |
| `/qa-only` | Same methodology, report only, no code changes. Use when QA must stay independent of the fix. |
| `/browse` | Real headless Chromium. Real clicks, real screenshots, ~100ms/command. **Use this for all web browsing — not the `mcp__claude-in-chrome__*` tools.** |
| `/scrape` | Pull structured data from a page. |
| `/skillify` | Turn a successful `/scrape` flow into a permanent reusable browser skill. |
| `/benchmark` | Baseline load times, Core Web Vitals, resource sizes. Compare before/after on every PR. |
| `/design-review` | Live designer's-eye audit: spacing, hierarchy, inconsistency, AI slop. Fixes what it finds. |
| `/devex-review` | Live DX audit: actually walks the onboarding, times TTHW, screenshots errors. |
| `/setup-browser-cookies` | Import real-browser cookies to test authenticated pages. |
| `/open-gstack-browser` / `/connect-chrome` / `/pair-agent` | Headed browser, Chrome attach, multi-agent browser sharing. |

### Design
| Skill | Use it for |
|---|---|
| `/design-consultation` | Build a complete design system from scratch. Researches landscape, proposes creative risk. |
| `/design-shotgun` | "Show me options." 4-6 mockup variants on a comparison board, learns taste over time. |
| `/design-html` | Mockup → production HTML with computed layout. Zero deps, shippable. |

### Ship — Chief of Staff only
| Skill | Use it for |
|---|---|
| `/ship` | Sync main, run tests, audit coverage, push, open PR. **Strip the co-author trailer.** |
| `/land-and-deploy` | Merge, wait for CI + deploy, verify production health. |
| `/canary` | Post-deploy monitoring loop: console errors, perf regressions, page failures. |
| `/setup-deploy` | One-time deploy configuration. |
| `/landing-report` | Read-only queue dashboard for ship state. |

### Document & reflect
| Skill | Use it for |
|---|---|
| `/document-release` | Update all docs to match what shipped. Catches stale READMEs. Diataxis coverage map. |
| `/document-generate` | Write missing docs from scratch: reference / how-to / tutorial / explanation. |
| `/make-pdf` | Markdown → publication-quality PDF (or HTML/docx). Renders mermaid and excalidraw offline. |
| `/diagram` | English → diagram triplet: mermaid source + editable `.excalidraw` + rendered SVG/PNG. |
| `/retro` | Weekly retrospective. Per-person breakdowns, shipping streaks, test-health trends. |

### iOS (dormant until we own an iOS app)
`/ios-qa`, `/ios-fix`, `/ios-design-review`, `/ios-clean`, `/ios-sync`

### Maintenance
`/gstack-upgrade` (Chief only — re-verify OVERRIDE 1 after every run),
`/setup-gbrain`, `/sync-gbrain`, `/benchmark-models`, `/plan-tune`.

---

## 4. Universal rules for every agent

1. **Check this file before choosing an approach.** If a skill covers the task,
   invoke it. Do not hand-roll.
2. **`/investigate` before any fix.** No exceptions. A fix without an
   investigation is a guess.
3. **`/guard` before touching anything production-adjacent.**
4. **`/browse` for all web interaction.** Never `mcp__claude-in-chrome__*`.
5. **`/learn` at the end of any session that produced a durable lesson** — then
   promote the genuinely durable ones into `knowledge/lessons-learned/PLAYBOOK.md`.
6. **Report in gstack's status format**: `DONE` / `DONE_WITH_CONCERNS` /
   `BLOCKED` / `NEEDS_CONTEXT`, with `REASON`, `ATTEMPTED`, `RECOMMENDATION`.
7. **Escalate after 3 failed attempts.** Do not grind.
8. **Voice**: direct, concrete, builder-to-builder. Name the file, function,
   command and user-visible impact. No filler, no em dashes, no AI vocabulary
   (delve, crucial, robust, comprehensive, nuanced, multifaceted).

---

## 5. Maintenance of this file

This file is the single source of truth for gstack in this organisation. Every
agent's `CLAUDE.md` carries a thin pointer to it, not a copy of the catalogue —
so when gstack changes, one file changes, not ninety.

After any `/gstack-upgrade`:
1. Re-check OVERRIDE 1 (the co-author trailer) against `ship/SKILL.md`.
2. Re-enumerate the skill list:
   `for d in ~/.claude/skills/gstack/*/; do grep -m1 '^name:' "$d/SKILL.md"; done`
3. Update section 3 if skills were added or removed.
4. Log the upgrade to `org/DECISIONS.md`.
