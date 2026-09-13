# Claude Organisation Framework

A production-grade multi-agent operating system built on top of Claude Code. Run a full engineering organisation — Chief of Staff, VP Engineering, Product, QA, Security, DevOps, Design, Finance, HR, Legal, Marketing and more — all coordinated through a single intelligent command layer.

Clone it, customise it, and have your own AI-powered organisation running in under 10 minutes.

---

## What this is

Every "agent" is a `CLAUDE.md` file that turns Claude Code into a specific role. The Chief of Staff coordinates everything. You give it a goal in plain English — it breaks it down, spawns the right agents, manages dependencies, enforces quality gates, and delivers back to you.

```
You → Chief of Staff → Senior PM → [VP Eng → Frontend Dev → Backend Dev → QA → DevOps]
                                  ↘ Director Security ↗
```

The live monitor (`monitor.html`) shows every agent working in real time.

---

## Quick start

```bash
# 1. Clone
git clone https://github.com/atharvak161/claude-org-framework.git
cd claude-org-framework

# 2. Set your workspace path
# Open WORKSPACE.md — replace the example path with your absolute path to this folder

# 3. Create the operational logs (they are gitignored, so a fresh clone has none)
bash bin/bootstrap-org

# 4. Open Claude Code inside the chief_of_staff directory
cd agents/chief_of_staff
claude

# 5. Give it a goal
# "Build me a landing page for a SaaS product"
# "Set up a REST API with JWT authentication"
# "Review and fix all bugs in the auth module"
# "Design a full design system for a fintech app"
```

---

## Live Monitor

Open `monitor.html` in any browser (no server needed — just double-click it). It polls `org/` every 2 seconds and shows every agent action live.

To enable full file-level activity tracking, run this in a separate terminal:
```bash
bash org/watch_poll.sh
```

---

## Agent roster — 89 agents across 21 departments

### Command
| Agent | Role |
|---|---|
| `agents/chief_of_staff` | Programme director. Coordinates everything. **Start here.** |
| `agents/guide_explainer` | Translates technical output to plain English for the Owner |

### Engineering
| Agent | Role |
|---|---|
| `agents/engineering/vp_engineering` | Engineering leadership and strategy |
| `agents/engineering/frontend_developer` | UI/UX implementation + motion design (GSAP, Three.js, React) |
| `agents/engineering/backend_developer` | APIs, services, data models |
| `agents/engineering/mobile_developer` | iOS/Android — React Native / Expo |
| `agents/engineering/solution_architect` | System design, ADRs |
| `agents/engineering/dev_team_lead` | Sprint planning, code ownership |
| `agents/engineering/code_reviewer` | Code quality gate before merge |
| `agents/engineering/technical_writer` | Docs, READMEs, changelogs |
| `agents/engineering/db_engineer` | Schema, migrations, query optimisation |
| `agents/engineering/integration_engineer` | Third-party APIs, webhooks, OAuth |

### Product
| Agent | Role |
|---|---|
| `agents/product/product_manager` | Requirements, roadmap, prioritisation |
| `agents/product/ui_designer` | Design system, tokens, components, visual QA |
| `agents/product/ux_designer` | User flows, wireframes, usability |
| `agents/product/business_analyst` | Requirements analysis, user stories |

### QA
| Agent | Role |
|---|---|
| `agents/qa/director_qa` | QA strategy, sign-off gate |
| `agents/qa/full_stack_tester` | End-to-end testing |
| `agents/qa/test_automation_engineer` | CI test suites, automation frameworks |
| `agents/qa/performance_tester` | Load testing, Core Web Vitals |

### Security
| Agent | Role |
|---|---|
| `agents/security/director_security` | Security posture, mandatory sign-off |
| `agents/security/penetration_tester` | Vulnerability discovery |
| `agents/security/security_architect` | Threat modelling, secure design review |
| `agents/security/sast_dast_engineer` | Static and dynamic analysis tooling |
| `agents/security/compliance_auditor` | Controls, evidence, audit readiness |

### DevOps
| Agent | Role |
|---|---|
| `agents/devops/director_devops` | Infrastructure strategy |
| `agents/devops/cicd_engineer` | Pipelines, GitHub Actions |
| `agents/devops/infra_engineer` | Cloud, IaC (Terraform, CDK) |
| `agents/devops/container_engineer` | Docker, Kubernetes |
| `agents/devops/sre` | Reliability, SLOs, incident response |
| `agents/devops/monitoring_engineer` | Observability, alerting, dashboards |

### More departments
`agents/finance/` · `agents/design/` · `agents/hr/` · `agents/legal/` · `agents/marketing/` · `agents/sales/` · `agents/strategy/` · `agents/data/` · `agents/career/` · `agents/operations/` · `agents/pm/` · `agents/pr/` · `agents/research/` · `agents/support/` · `agents/guide_explainer/`

---

## Install Claude Skills (optional — strongly recommended)

These skills auto-activate when doing UI/frontend work. Install once, improve every session:

```bash
mkdir -p ~/.claude/skills

# Anthropic frontend-design (prevents generic AI-slop output)
git clone --depth=1 https://github.com/anthropics/skills.git /tmp/a-skills
cp -r /tmp/a-skills/skills/frontend-design ~/.claude/skills/

# Vercel bundle: web guidelines + React best practices + composition patterns
git clone --depth=1 https://github.com/vercel-labs/agent-skills.git /tmp/v-skills
cp -r /tmp/v-skills/skills/web-design-guidelines ~/.claude/skills/
cp -r /tmp/v-skills/skills/react-best-practices ~/.claude/skills/
cp -r /tmp/v-skills/skills/composition-patterns ~/.claude/skills/

# UI/UX Pro Max: 50 styles, 97 palettes, 57 font pairings, 99 UX guidelines
git clone --depth=1 https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git /tmp/uxpro
cp -r /tmp/uxpro/.claude/skills/ui-ux-pro-max ~/.claude/skills/

# Bencium innovative UX designer: 28,000-char UX reference document
git clone --depth=1 https://github.com/bencium/bencium-claude-code-design-skill.git /tmp/ben
cp -r /tmp/ben/bencium-innovative-ux-designer ~/.claude/skills/
```

---

## File structure

```
├── agents/                   All agent CLAUDE.md files — the org itself
│   ├── chief_of_staff/       Start here
│   ├── engineering/  product/  qa/  security/  devops/
│   ├── finance/  design/  hr/  legal/  marketing/  sales/
│   └── ... (21 departments, 89 agents)
├── knowledge/                Protocols, standards and durable lessons
│   ├── protocols/            WORKFLOW_PROTOCOL.md, GSTACK_PROTOCOL.md — read before any task
│   ├── lessons-learned/      PLAYBOOK.md — mistakes the org does not repeat
│   └── standards/  onboarding/  decisions/  plans/
├── bin/
│   ├── bootstrap-org         Recreates the logs and arms the guard hooks
│   └── repo-status           State of every repo: branch, drift, dirty, sync
├── .githooks/                Guard hooks — armed by bootstrap-org
│   ├── pre-commit            Blocks private paths, logs, keys, stray scaffolding
│   └── commit-msg            Blocks AI self-attribution trailers
├── org/                      Shared state — agents write here, monitor reads here
│   ├── templates/            Sources bootstrap-org copies from
│   ├── ACTIVITY.md           Real-time agent action log
│   ├── DECISIONS.md          Every decision recorded before implementation
│   ├── STATUS.md  BLOCKERS.md  LIVE.md  COMPANY_LOG.md
│   ├── AGENT_REGISTRY.md     Per-role model tier defaults
│   └── watch_poll.sh         File activity watcher (run to power the monitor)
├── review/                   Delivery gates
│   └── SIGN_OFFS.md          Security + QA sign-offs required before release
├── monitor.html              Live dashboard — open in browser, no server needed
├── WORKSPACE.md              Master path reference + directory ownership map
└── README.md                 This file
```

---

## Safety rails

The framework assumes it will be run against real repositories with real
private material in them, so the rules are enforced mechanically rather than
written down and hoped for.

`bin/bootstrap-org` sets `core.hooksPath` to `.githooks/`, which installs two
hooks:

**`pre-commit`** refuses a commit that stages anything under `local/`, any
operational log, key material by filename or content, files reappearing under
`src/`, `tests/`, `ci/` or `infra/` at the framework root, or content matching a
private pattern listed in `local/guard-patterns.txt`.

**`commit-msg`** refuses any commit message carrying an AI self-attribution
trailer.

The private-pattern list lives in `local/guard-patterns.txt`, outside the
repository, because writing those strings into a public repo's hook script
would publish exactly what the hook exists to protect.

A hook firing is a stop, not an obstacle. `ORG_GUARD=off` exists for the case
where a hook is genuinely wrong; reaching for it quietly is the failure mode the
hooks were built to prevent.

**`bin/repo-status`** shows every repo the org works on — branch, ahead/behind,
uncommitted, missing README — reading the clone list live so a new clone appears
without editing anything. Run it with `--fetch` before starting work: a clone
that is behind and gets pushed reverts whatever landed upstream.

---

## How the Chief of Staff works

**1. You give a goal in plain English:**
```
Build a full-stack task management app with authentication
```

**2. Chief of Staff produces a Master Execution Plan (MEP):**
- Departments involved
- Risks and failure modes identified upfront
- Success criteria that are measurable
- Definition of done (not just working — tested, secured, documented, deployed)
- Timeline estimate
- Parallel workstreams mapped

**3. You approve the MEP. Work begins.**

Agents coordinate via shared files in `org/`. All decisions go to `org/DECISIONS.md` before implementation. All activity is logged to `org/ACTIVITY.md` immediately.

**4. Quality gates before anything reaches you:**
- Security sign-off (`review/SIGN_OFFS.md`)
- QA sign-off
- DevOps confirms deployment stable
- Technical Writer confirms docs complete

**5. You receive a plain-English delivery report in `review/DELIVERY_SUMMARY.md`.**

---

## Customisation

| What | How |
|---|---|
| Your name | Replace `Atharva` / `Owner` in `agents/chief_of_staff/CLAUDE.md` |
| Workspace path | Update the path in `WORKSPACE.md` to your absolute path |
| Add an agent | Copy any folder under `agents/`, update `CLAUDE.md`, add to Chief of Staff's reporting chain |
| Remove an agent | Delete the folder, remove from `chief_of_staff/CLAUDE.md` direct reports |
| Add a department | Create `agents/[dept]/[role]/CLAUDE.md` — model it on an existing agent |

---

## Principles

- **Every agent is a CLAUDE.md** — readable, editable, version-controlled, no black boxes
- **All coordination is written** — nothing assumed, everything logged in `org/`
- **Agents build, the Chief ships** — agents edit and smoke-test, then hand back a diff; only the Chief of Staff reviews the real diff, runs the gate, commits and pushes. An agent cannot dodge a push gate it never touches.
- **Quality gates are mandatory** — Security + QA + DevOps sign-off before anything ships
- **The monitor shows everything** — open `monitor.html`, see exactly what every agent is doing in real time

---

*Built with [Claude Code](https://claude.ai/code). Clone it. Ship things.*
