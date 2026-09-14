# Organisation Workflow Protocol
# Owner: Chief of Staff
# Last updated: 2026-06-01
# Mandatory reading for every agent before starting any task

---

## The core principle

No agent works in isolation. Every task produces multiple independent 
perspectives before a decision is made. Every output is reviewed before it 
moves up the chain. No work reaches Atharva without passing through the 
full review chain.

---

## Phase 1 — Intake (Chief of Staff)

**gstack for this phase:** `/office-hours` on any new product idea before the MEP
is written — it reframes the request and writes a design doc every downstream skill
reads. `/spec` when the ask is vague and needs to become executable. Run these
BEFORE producing the MEP; their output is MEP input, not a substitute for it.


When Atharva assigns a task:

1. Chief of Staff restates the task in their own words and confirms understanding
2. Chief of Staff produces a Master Execution Plan (MEP) covering:
   - Interpreted goal
   - Departments involved
   - Risks and failure modes
   - Success criteria (measurable)
   - Definition of done
   - Timeline estimate
   - Parallel workstreams
   - Dependencies
   - Escalation triggers
3. Chief of Staff spawns Senior Project Manager with the MEP
4. Chief of Staff spawns Guide & Explainer to monitor throughout
5. Chief of Staff does NOT start execution until the MEP is confirmed

**Chief of Staff collaborates with Guide & Explainer throughout** — they 
align on interpretation before presenting anything to Atharva.

---

## Phase 2 — Planning (Senior Project Manager + Department Directors)

**gstack for this phase:** `/autoplan` is the default. One command runs CEO →
design → DX → eng review over the plan, eng always last so the shipping gate sees
the final amended plan. Run the individual `/plan-*-review` skills only when you
need one lens rather than all four.


Senior PM receives the MEP and:

1. Breaks the MEP into department-level task briefs
2. Assigns each brief to the relevant department director
3. Identifies cross-department dependencies and schedules them
4. Sets a timeline with milestones
5. Writes the project plan to org/STATUS.md

Each department director receives their brief and:
1. Reviews it against their team's capacity
2. Decomposes into agent-level tasks
3. Identifies which sub-agents to involve (minimum 2 per significant decision)

---

## Phase 3 — Multi-perspective consultation (MANDATORY for every decision)

**gstack satisfies this phase.** `/plan-ceo-review`, `/plan-eng-review`,
`/plan-design-review` and `/plan-devex-review` ARE the independent perspectives this
protocol demands — CEO, engineering, design and developer-experience, each with its
own forcing questions. A decision that has been through `/autoplan` has met the
minimum-two-perspectives requirement. Record the consultation record as normal; the
skill output is its evidence, not a replacement for the record.


This is the most important phase. **No significant decision is made by one 
agent alone.**

### The consultation process

When a department receives a task that requires a decision or recommendation:

**Step 1 — Director assigns the problem to 2 or more agents**
Each agent receives the same problem brief but is asked to approach it 
from their specific angle. Examples:
- Engineering: Backend Developer AND Solution Architect each propose an approach
- Security: Security Architect AND SAST/DAST Engineer each assess the risk independently
- Marketing: Content Strategist AND Growth Hacker each propose a campaign angle

**Step 2 — Each agent produces an independent proposal**
Each proposal must include:
- Their recommended approach
- Why they recommend it over alternatives
- What risks or trade-offs exist
- What resources or time it requires
- What success looks like

Agents do NOT see each other's proposals before writing their own. 
Independence is the point.

**Step 3 — Director conducts the consultation**
The director reads all proposals and produces a CONSULTATION_RECORD.md:
```
# Consultation record — [task name] — [date]
## Problem statement
## Proposals received
### Agent 1: [name] — [approach summary]
### Agent 2: [name] — [approach summary]
### Agent N: [name] — [approach summary]
## Points of agreement
## Points of disagreement
## Director's decision
## Rationale
## Dissenting view (if any)
```

**Step 4 — Director documents the decision in org/DECISIONS.md**
Format:
```
[DATE] [DIRECTOR_ROLE] DECISION: [what was decided] — 
RATIONALE: [why this over alternatives] — 
ALTERNATIVES_CONSIDERED: [what else was proposed]
```

**Step 5 — Director communicates the decision to all agents who contributed**
Every agent who submitted a proposal receives the final decision and rationale. 
No agent is left wondering what happened to their proposal.

### When multi-perspective consultation is NOT required
- Purely mechanical tasks with no meaningful choice (e.g. "run the tests")
- Tasks where the approach is already fully specified in the MEP
- Urgent incident response where speed matters more than deliberation

Even in these cases, the executing agent must log what they did and why.

---

## Phase 4 — Execution

**gstack for this phase:** `/investigate` before ANY bug fix — no fix without a
root cause, stop after 3 failed hypotheses. `/freeze` to lock edits to one directory
so scope cannot creep while debugging. `/guard` for anything production-adjacent.
`/browse` for all web interaction. `/health` to check repo quality as you go.


Each agent executes their assigned work and:
1. Logs every file created to org/ACTIVITY.md
2. Logs every significant decision to org/DECISIONS.md
3. If blocked: logs to org/BLOCKERS.md immediately and stops
4. Does not proceed past a blocker by guessing

**Every agent contributes at full capacity:**
- They do not hold back opinions that differ from their manager
- They flag risks even if nobody asked about risks
- They note adjacent problems they spotted even if outside their brief
- They make their best professional recommendation, not the one they think the manager wants to hear

---

## Phase 5 — Review chain (every output passes through every gate)

**gstack for this phase:** `/review` (staff-engineer pass, auto-fixes the obvious,
flags completeness gaps), `/codex` for an independent cross-model second opinion,
`/cso` for the security gate (OWASP Top 10 + STRIDE, exploit scenario per finding),
`/qa` or `/qa-only` for the QA gate, `/design-review` for anything with a UI,
`/benchmark` for performance, `/devex-review` for anything developers consume.

`/review` and `/cso` are both MANDATORY before any push. Skill output is evidence
for a reviewer's verdict, never the verdict itself.


```
Sub-agent produces output
        ↓
Manager reviews:
  - Does it meet the requirement?
  - Is it the right quality?
  - Are there gaps or risks?
  If fail → return to sub-agent with specific feedback
  If pass → consolidate and pass up
        ↓
Department Director reviews:
  - Does the consolidated output meet the brief?
  - Are all perspectives represented?
  - Is the decision documented?
  If fail → return to manager with specific feedback
  If pass → produce sign-off and pass to Chief of Staff
        ↓
Chief of Staff reviews all department outputs:
  - Do all departments agree on the approach?
  - Are there cross-department conflicts?
  - Does the combined output meet the MEP success criteria?
  If fail → return to relevant director
  If pass → pass to Guide & Explainer
        ↓
Guide & Explainer:
  - Synthesises all outputs into plain English for Atharva
  - Confirms all sign-offs are in place
  - Produces DELIVERY_SUMMARY.md
        ↓
Chief of Staff + Guide & Explainer align:
  - Both review the delivery summary
  - Both must agree before it reaches Atharva
        ↓
Atharva receives the delivery
```

---

## Validate-or-bounce gate (mandatory at every review point in Phase 5)

Reviewing is not passive. Every parent agent in the Phase 5 review chain
(manager, Director, VP, Chief of Staff) actively validates the deliverable
against the acceptance criteria it was commissioned against — it does not
wave work through and it does not silently rework it themselves.

**The gate:**

1. **Validate.** Check the deliverable against its stated acceptance
   criteria (the brief it was given, the MEP success criteria, or the
   relevant spec).
2. **If it fails:** the reviewing agent explicitly **rejects it in
   writing** — in org/DECISIONS.md or the relevant request thread — with
   **specific, actionable feedback**: what failed, against which
   criterion, and what must change. A rejection without a specific reason
   is not a valid bounce.
3. **Redelegate** the work back to the originating agent with that
   feedback attached. This is one "bounce."
4. **Cap: 2 bounce attempts per deliverable.** If the deliverable still
   fails review after the 2nd bounce, do not attempt a 3rd. Escalate
   immediately per the existing 2-iteration rule (CLAUDE.md: "If any
   department is blocked for more than 2 iterations → escalate to
   Atharva"). The reviewing agent escalates with the deliverable history
   and a proposed path forward — never escalates a bare problem.

This applies at every level of the review chain in Phase 5, not just the
Chief of Staff's final check — a Senior PM bouncing a department's output
back to a Director follows the same rule as the Chief of Staff bouncing
a department's output back to a director.

---

## Portfolio: refresh TryHackMe figures on every visit (mandatory)

The portfolio hard-codes TryHackMe statistics — rank, points, streak, rarity
percentages on each badge. Those numbers move every week, and a portfolio that
advertises a stale rank to a recruiter is worse than one that omits it.

**The rule: any time work touches `local/repos/atharvak161-github-io/`, for any
reason, fetch the live figures from TryHackMe first and update them.** Not only
when the task is about badges. A CSS fix is still a visit, and the numbers still
went stale since the last one.

Fetch from the live TryHackMe profile (`tryhackme.com/p/AtharvaK911`) and update
every figure that changed: rank, total points, streak, and the per-badge rarity
percentages in `SITE.badges`. The badge rarity tags in particular drift
constantly, because rarity falls as more people earn a badge.

### New badges — always ask, never decide alone

If TryHackMe shows badges not present in `SITE.badges`, **list them for Atharva
and ask whether each should be added or skipped.** Never add one silently and
never skip one silently.

There is a deliberate curation rule, documented in `index.html` above
`SITE.badges`: only high-signal badges ship — exam and certification badges,
League first-place wins, offensive-box and tooling badges, and the top streak.
Beginner module badges are deliberately omitted. A new badge may be high-signal
or may be noise, and that judgement is Atharva's, not mine.

Note the hero badge strip is a separate hand-picked favourites list in static
HTML, deliberately NOT driven by `SITE.badges`. Adding a badge to the SSOT
updates the Badges section and the terminal, never the hero. If a new badge
deserves hero placement, that is a second question to ask.

### Report it either way

State the result in the completion report, always:

```
THM figures: checked, rank 1,042 → 987, points 88,510 → 91,204, 2 rarity tags updated
THM figures: checked, no change since last visit
THM badges: 1 new badge found (Advent of Cyber) — asked Atharva, awaiting decision
```

Silence reads as not-checked, and the work is incomplete.

## Nothing is ever deleted — it is moved to quarantine

Atharva's rule, and the highest-priority instruction in this workspace: *"delete
means not actually delete — transfer it, move it to a folder in downloads outside
the organisation where I can look and delete what is not needed."*

```bash
bin/safe-delete <path> "why it is being removed"
```

That moves the target to `~/Downloads/_QUARANTINE - safe to delete/`, in a
timestamped folder with a `MANIFEST.txt` recording what it was, its original
path, the file count and size, the reason, and the one-line command to restore
it. Atharva is the only person who empties that folder.

`safe-delete` refuses to act when:

- the path is outside `~/Downloads/organisation/`
- the path is anywhere in iCloud Drive
- the name collides case-insensitively with a sibling, or the filesystem holds a
  different case than the one asked for — the exact condition that destroyed
  1,040 files
- the path contains a glob character
- the target is the workspace root or `.git`

**Never run `rm`, `rm -rf`, `rmdir` or `find -delete` on anything in this
workspace.** Not scratch files, not test fixtures, not something created thirty
seconds ago. There is no size or importance threshold below which destroying is
acceptable, because the failure on 2026-09-13 began as a two-byte test fixture.

### Testing never touches real data

Every test fixture, scratch file and probe goes in `$CLAUDE_JOB_DIR/tmp`, never
inside the workspace, and never with a name that could collide with something
real. Do not point a destructive command at a live directory to observe the
result, and do not create a fixture beside the thing it is named after.

The incident was exactly this: a fixture named `Local`, created next to `local`,
then cleaned up. Two of those three choices were avoidable and the third was the
kill shot.

When verifying `safe-delete` or any guard, build the fixture outside the
workspace and point the guard at that. A guard that can only be tested by
risking real data is a guard that will eventually cost you real data.

Everything in the pre-delete procedure below still applies — ask first, resolve
the absolute path, read the contents, count the files, check for case collisions.
`safe-delete` enforces those checks, and doing them yourself first is how you
notice when something is wrong before a script has to catch it.

## Pre-delete procedure (mandatory, no exceptions, no shortcuts)

On 2026-09-13 a single `rm -rf Local` destroyed 1,040 files in this workspace:
7 project clones, the offline practice exam, client work, every local backup,
and the git bundles holding rescued unpushed work. macOS is case-insensitive, so
`Local` and `local` are the same directory. There was no Time Machine
destination and `rm` bypasses the Trash, so only the GitHub-backed clones came
back. Everything else is gone permanently.

The command looked harmless. That is the whole problem. So deletion is no longer
something done from judgement in the moment — it follows a procedure.

### Every step, in order, every time

**1. Ask Atharva and get a clear yes.** Name the exact paths and say what they
contain. No standing authorisation carries over from an earlier task or session.
If the task only *implies* cleanup, ask rather than infer.

**2. Resolve the path and look at what is actually there.**

```bash
ls -la -- "/absolute/path/to/target"
```

Absolute path, and `--` before it so a leading dash cannot be read as a flag.
If what comes back is not exactly what you expected, stop.

**3. Read the contents before removing them.** For a file, `cat` or `head` it.
For a directory, list what is inside and count it:

```bash
find "/absolute/path" -type f | wc -l
```

A directory you believed was a throwaway fixture holding 1,040 files is the
signal to stop. Never delete something you have not looked inside.

**4. Check for a case-insensitive collision.** Before removing any path, ask
whether its name differs only by case from something real:

```bash
ls -d -- /parent/* | grep -i "^/parent/name$"
```

More than one result, or a result that is not your target, means the filesystem
is about to resolve your delete onto something else.

**5. Confirm the target is the only match.** Never use a wildcard, a glob, or a
variable that has not been echoed and read first. `rm -rf $DIR` where `DIR` is
empty deletes the working directory.

**6. Confirm the location is allowed.** Never outside `~/Downloads/organisation/`
without explicit permission for that exact path. **Never** anything in iCloud
Drive — those deletes propagate to every device Atharva owns.

**7. Prefer not deleting at all.** `git rm --cached` for git cleanup. Scratch
files in `$CLAUDE_JOB_DIR/tmp`, never in a working tree, so no cleanup delete is
ever needed. Name fixtures distinctly (`guard-fixture-7x`), never a case variant
of anything real. A delete you never have to run cannot go wrong.

### Think like someone who will have to explain it

Before pressing return on any destructive command, read it back and ask what it
would do if one assumption were wrong — if the path resolved elsewhere, if the
variable were empty, if the filesystem folded case. Today's mistake passed every
test except that one.

## Workspace hygiene (runs with every development cycle)

The workspace rots quietly. Stale clones revert live work when pushed, dead
directories invite agents to write into the wrong place, and operational logs
accumulate real client names inside a public repository. None of that announces
itself, so hygiene is not an occasional tidy-up. It runs on every cycle.

### Two roots, and never confuse them

**Framework root** — `/Users/atharva/Downloads/organisation/`
Agent definitions, protocols, the operational logs. Public, pushed to
`claude-org-framework`. No project code has ever belonged here.

**Project root** — `local/repos/<project>/`
Every line of project code and every project artifact. A real clone with a real
`origin`. `local/` is gitignored wholesale, so nothing here reaches the public
repo.

A path like `src/`, `tests/`, `ci/` or `infra/` in any agent file means the
**project** root. Those directories do not exist at the framework root, and
recreating them there is a defect the pre-commit hook now blocks.

### Before a cycle — prove local matches live

```bash
bin/repo-status --fetch
```

Every repo must read `clean, in sync` before work starts. A clone that is
`BEHIND LIVE` and gets pushed reverts whatever landed upstream in the meantime,
which is the single most expensive mistake available in this workspace.

- `BEHIND LIVE` → pull before touching anything.
- `uncommitted` → resolve it; never start new work on top of a dirty tree.
- `unpushed` → find out what it is before adding to it.

### During a cycle

Work inside the project clone. Agents build and smoke-test, then stop and hand
back a diff. The Chief reads the real `git diff`, runs the gate, and ships. No
agent commits, pushes, or touches a remote.

### After a push — both repos, not just one

A cycle is not finished when the project repo is pushed. Anything learned goes
back into the framework repo in the same session, or it is lost:

1. Verify the project push: `HEAD == origin/<branch>`, diff is exactly what was
   intended and nothing else.
2. Update the framework repo with what the cycle produced — a durable lesson in
   `PLAYBOOK.md`, a protocol change, a corrected agent instruction, the
   `README: checked` line.
3. Push the framework repo too, and verify `HEAD == origin/main`.
4. `bin/repo-status` reads clean.

Step 2 is the one that gets skipped, and skipping it is why the same mistake
gets made twice.

**Then run `bin/daily-sync`.** Atharva's rule: it runs every time anything in
the organisation changes, not on a schedule. It publishes only the explicit
framework path list, goes through a PR because `main` is protected, and stops
rather than overriding the pre-commit guard if it fires. Safe to run when
nothing changed — it says so and exits. What it cannot carry is the
operational logs, which hold client names and stay local; that gap is
deliberate.

### Cleanup triggers

Run the checklist below whenever any of these is true. Do not wait for things
to feel untidy — by then agents have been writing to the wrong paths for weeks.

- A directory at the framework root that no longer has a purpose.
- A path referenced in agent files that no longer exists.
- A clone that is stale, duplicated, or no longer worked on.
- Tracked files that should be ignored, or ignored files that should be tracked.
- Loose files sitting in the repository root with no home.
- Any cycle where `bin/repo-status` flags something that is not new work.

### Cleanup checklist

1. `bin/repo-status --fetch` — nothing proceeds while a repo is behind or dirty.
2. Back up before removing: `tar czf local/backups/<what>-$(date +%Y%m%d-%H%M%S).tar.gz <paths>`
3. Find what references the thing you are removing, across every file type:
   `grep -rn "<path>" agents knowledge bin *.md *.html` — note that restricting
   the search to `*.md` has already hidden stale references sitting in `.json`
   settings files. Search everything.
4. Remove tracked files with `git rm`. Never `rm` something Atharva has not
   agreed to remove; `git rm --cached` is the safe form when in doubt.
5. Repoint every reference found in step 3. A deleted directory whose
   references survive is worse than leaving it — agents recreate it.
6. Regenerate the marker-delimited blocks so all 89 agents stay consistent:
   `python3 knowledge/protocols/workspace_paths_block.py`
7. Verify nothing stale survives, then check the README of every repo touched.
8. Commit, push, and confirm `HEAD == origin/main`.

### The guard hooks

`.githooks/pre-commit` and `.githooks/commit-msg` enforce mechanically what was
previously prose. They block: staged paths under `local/`; staged operational
logs; files reappearing under `src/`, `tests/`, `ci/` or `infra/` at the
framework root; key material by filename or content; staged content matching a
private pattern from `local/guard-patterns.txt`; and any AI self-attribution
trailer in a commit message.

`bin/bootstrap-org` arms them, so a fresh clone is protected without anyone
remembering to do it.

**A block is a stop, not an obstacle.** `ORG_GUARD=off` exists for the case
where the hook is genuinely wrong, and using it without saying so first is the
gate-dodging this protocol exists to prevent. If a hook fires, fix the staged
set or surface it to Atharva. Never route around it.

The blocklist lives in `local/guard-patterns.txt`, outside the repository,
because writing client names into a public repo's hook script would publish
exactly what the hook exists to protect.

## README currency gate (mandatory, every repo, every change)

A repo's README is part of that repo's surface. It goes stale silently, and a
stale README is worse than no README: it sends people to configure things that
no longer exist. JobScope shipped a README advertising a job source deleted
three PRs earlier, with an API key to go request for it.

**The rule.** Any change to a repo, however small, includes a check of that
repo's README before the work is called done. Not a rewrite. A check, and an
update only where the README no longer matches reality.

**This applies to the smallest changes too.** "Too small to affect the README"
is how drift happens. A one-line change that removes an env var, renames a
flag, or drops a dependency affects the README more than a large refactor that
changes nothing user-facing.

### What to check, in order

1. **Does the README claim anything the code no longer does?** Removed sources,
   adapters, endpoints, commands, flags, features. This is the failure mode that
   costs someone real time.
2. **Does the code do anything the README does not mention?** New env vars, new
   commands, new setup steps. Cross-check `.env.example` against the env table
   line by line — they drift apart fastest.
3. **Do the setup instructions still work from a clean clone?** Clone paths,
   install commands, required versions, first-run steps.
4. **Are the links alive?** Internal paths that moved, external docs that died.
5. **Does the architecture section still describe the real architecture?**

### Recording it

State the result in the completion report, always, as one line:

```
README: checked, no update needed — nothing user-facing changed
README: checked, updated — dropped Jooble (removed in #33), added JSEARCH_API_KEY
```

Silence on the README is not "it was fine". It reads as "not checked", and the
work is incomplete. `DONE` is not available until that line exists.

### Who

Whoever made the change checks it. It is not a separate ticket, not a job for
the Technical Writer later, and not something to batch up for a cleanup pass —
batching is what lets it rot. The Chief of Staff confirms the line is present
before the ship gate; a missing line bounces the work back.

### When the README change is bigger than the code change

That is normal and not a reason to skip it or split it out. Ship them together
so the repo is never in a state where the docs describe a version that does not
exist.

## Phase 6 — Sign-offs (required before any delivery)

**gstack for this phase:** `/ship`, `/land-and-deploy` and `/canary` run here and
are **Chief of Staff only**. Every other agent stops at the diff.

Two hard rules: strip the `Co-Authored-By: Claude` trailer `/ship` emits — it must
never reach a remote. And gstack's DONE / DONE_WITH_CONCERNS / BLOCKED /
NEEDS_CONTEXT status is an agent report format, NOT a sign-off. Sign-off is recorded
in review/SIGN_OFFS.md by the designated role with the full required-fields schema.

After delivery: `/document-release` to update docs, `/retro` and `/learn` to close
the loop.


Before any work reaches Atharva, these sign-offs must be collected in 
review/SIGN_OFFS.md:

| Sign-off | Who provides it | Required for |
|---|---|---|
| Technical sign-off | VP Engineering | Any engineering work |
| Security sign-off | Director Security | Any system, code, or data work |
| QA sign-off | Director QA | Any feature or product change |
| Deployment sign-off | Director DevOps | Any deployment |
| Legal sign-off | General Counsel | Any contract, policy, or public statement |
| Financial sign-off | Finance Director | Any spend or financial commitment |

---

## Cross-department collaboration rules

When two departments must work together:

1. **The requesting department writes the brief** — they define what they need
2. **The responding department writes the response** — they define how they will do it
3. **Both department directors must agree** before work begins
4. **All cross-department decisions go into org/DECISIONS.md**
5. **If departments disagree** → escalate to Chief of Staff, who decides and documents

### Common cross-department touchpoints

| Requesting | Responding | What triggers it |
|---|---|---|
| Product Manager | VP Engineering | New feature requirements |
| VP Engineering | Director Security | Architecture needs security review |
| VP Engineering | Director QA | Features ready for testing |
| VP Engineering | Director DevOps | Build ready for deployment |
| Director Security | Any dept | Security requirement imposed |
| Research Director | Product Manager | Market research completed |
| Sales Director | Product Manager | Customer feedback, feature gap identified |
| Finance Director | Any dept | Budget approval needed |
| General Counsel | Any dept | Legal review needed |
| PR Director | Director Marketing | PR and marketing messaging must align |
| Head of Data | Any dept | Analytics or insights request |

---

## Communication standards

### All inter-agent communication is written
- Never assume another agent knows something unless it is written in a shared file
- Verbal (unlogged) communication does not count
- All decisions are in org/DECISIONS.md before implementation begins

### Response time expectations
- Urgent (blocker flagged in BLOCKERS.md): same session
- High priority (director request): within 2 iterations
- Standard: within the timeline set in the project plan

### How to flag a disagreement
If an agent disagrees with a decision made above them:
1. Write their disagreement in their output with clear reasoning
2. The manager must acknowledge it in the CONSULTATION_RECORD
3. The manager makes the final call — but the dissent is logged
4. Agents do NOT silently comply when they believe something is wrong

---

## Contribution standard

Every agent must ask themselves before submitting output:
1. Have I given my honest professional recommendation?
2. Have I flagged every risk I can see, even ones outside my brief?
3. Have I given enough detail for the next person in the chain to act on this?
4. Have I documented my reasoning so it can be reviewed later?
5. Is this the best I can produce given the time available?

If the answer to any of these is no: revise before submitting.

---

## File paths for consultation records

```
docs/[department]/consultations/CONSULTATION_[PROJECT]-[DATE].md
```

Example:
```
docs/engineering/consultations/CONSULTATION_API_DESIGN-2026-06-01.md
docs/security/consultations/CONSULTATION_AUTH_REVIEW-2026-06-01.md
```
