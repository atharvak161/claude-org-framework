# WORKSPACE.md — read this before every task

This is the master workspace reference for the organisation.
Every agent must read this file before starting any task.
Every path below is relative to /Users/atharva/Downloads/organisation/

## Your first three actions before any task
1. Read this file
2. Read org/DECISIONS.md to know what has already been decided
3. Read org/STATUS.md to know where the project currently stands

## Directory ownership — where each agent writes

### Source code
src/backend/              — Backend Developer
src/backend/routes/       — route definitions
src/backend/controllers/  — request handlers
src/backend/services/     — business logic
src/backend/middleware/   — middleware functions
src/backend/models/       — data models
src/frontend/src/         — Frontend Developer
src/mobile/src/           — Mobile Developer
src/db/migrations/        — DB Engineer (files: 001_description.sql)
src/db/seeds/             — DB Engineer
src/integrations/         — Integration Engineer
src/shared/               — any developer, notify Dev Team Lead
src/projects/             — cloned external repos for review and analysis

### Tests
tests/unit/backend/       — Backend Developer + Test Automation Engineer
tests/unit/frontend/      — Frontend Developer + Test Automation Engineer
tests/unit/mobile/        — Mobile Developer + Test Automation Engineer
tests/integration/        — Test Automation Engineer
tests/e2e/                — Test Automation Engineer
tests/performance/        — Performance Tester
tests/security/           — SAST/DAST Engineer + Penetration Tester
org/bugs/                 — Full Stack Tester files bugs here

### Documentation
docs/architecture/        — Solution Architect
docs/adr/                 — Solution Architect (ADR-001-title.md format)
docs/api/                 — Solution Architect + Backend Developer
docs/requirements/        — Requirements Analyst
docs/design/              — UX Designer + UI Designer
docs/security/            — Security Architect + Penetration Tester
docs/runbooks/            — SRE + Technical Writer
docs/data/                — DB Engineer
docs/integrations/        — Integration Engineer
docs/guides/              — Technical Writer
docs/sre/                 — SRE

### Infrastructure
infra/terraform/          — Infrastructure Engineer
infra/k8s/                — Container Engineer
infra/helm/               — Container Engineer
infra/monitoring/         — Monitoring Engineer

### CI/CD
ci/                       — CI/CD Engineer
.github/workflows/        — CI/CD Engineer

### Organisation (internal — not committed to git)
org/COMPANY_LOG.md        — Chief of Staff
org/DECISIONS.md          — ALL agents append every decision here
org/RISKS.md              — Risk Manager
org/STATUS.md             — Senior Project Manager
org/BLOCKERS.md           — any blocked agent writes here
org/ACTIVITY.md           — ALL agents log every file created here
org/AGENT_REGISTRY.md     — HR Manager
org/bugs/                 — Full Stack Tester

### Review staging (Atharva's area — do not modify unless authorised)
review/READY_FOR_REVIEW.md    — Delivery Manager writes
review/DELIVERY_SUMMARY.md    — Guide and Explainer writes
review/CHANGELOG.md           — Delivery Manager writes
review/SIGN_OFFS.md           — Delivery Manager collects all sign-offs here
review/APPROVAL.md            — ATHARVA writes APPROVED or REJECTED here

### Knowledge base
knowledge/                — Knowledge Manager owns entire directory

## Workflow protocol (mandatory)
Read this before every task:
knowledge/protocols/WORKFLOW_PROTOCOL.md

Key rules:
- Every significant decision requires 2+ independent agent proposals before the manager decides
- Every decision is documented in org/DECISIONS.md before implementation begins
- All inter-agent communication is written to shared files — never assumed
- Every output passes through the full review chain before reaching Atharva

## Inter-agent communication protocol (mandatory for cross-department work)
When your task requires requesting work from, or delivering work to, another department, follow the structured formats defined here:
knowledge/protocols/INTER_AGENT_COMMUNICATION.md

This protocol covers: how to write a cross-department request, how to deliver a response, the three-level escalation path (peer → director → Chief of Staff), consultation record format, shared file locations (docs/requests/, docs/consultations/), and response time standards. Agents must not route routine cross-department messages through the Chief of Staff — use this protocol instead.

## New departments — directories
docs/marketing/             — Director of Marketing
docs/sales/                 — Sales Director
docs/finance/               — Finance Director
docs/legal/                 — General Counsel
docs/data/                  — Head of Data
docs/design/                — Creative Director
docs/support/               — Head of Support
docs/research/              — Research Director
docs/operations/            — COO
docs/pr/                    — PR Director
docs/strategy/              — Chief Strategy Officer

## Rules every agent must follow — no exceptions

### Rule 1 — directory creation
Before writing any file, run mkdir -p on the parent directory.
Never fail because a directory is missing — create it.

### Rule 2 — write only in your designated area
If your task requires creating a file in another agent's area,
write it there AND log it in org/DECISIONS.md explaining why.

### Rule 3 — log every file you create
Immediately after creating or modifying any file, append to org/ACTIVITY.md:
[DATE] [YOUR_ROLE] — CREATED — [full relative file path] — [one line reason]

### Rule 4 — log every decision
When you make any significant decision, append to org/DECISIONS.md:
[DATE] [YOUR_ROLE] DECISION: [what was decided] — RATIONALE: [why]

### Rule 5 — log every blocker
If you cannot proceed, append to org/BLOCKERS.md immediately:
[DATE] [YOUR_ROLE] BLOCKER: [what is blocking you] — NEEDS: [what is needed]
Then stop and wait. Do not guess or proceed on an unresolved blocker.

### Rule 6 — never touch review/ unless you are authorised
Only Delivery Manager writes to review/
Only Guide and Explainer writes review/DELIVERY_SUMMARY.md
Only Atharva writes review/APPROVAL.md

### Rule 7 — never delete another agent's files
If a file should be deleted, write a proposal to org/DECISIONS.md
and escalate to your parent agent. Never delete unilaterally.

### Rule 8 — no hardcoded secrets ever
No passwords, API keys, tokens, or credentials in any file.
All secrets via environment variables or secrets manager.

## File naming conventions

| Type | Convention | Example |
|------|-----------|---------|
| Documentation | SCREAMING_SNAKE_CASE.md | ARCHITECTURE.md |
| ADRs | ADR-NNN-kebab-title.md | ADR-001-use-postgresql.md |
| DB migrations | NNN_snake_description.sql | 001_create_users.sql |
| Bug reports | BUG-NNN-short-title.md | BUG-001-login-crash.md |
| Security findings | FIND-NNN-short-title.md | FIND-001-sql-injection.md |
| Pentest reports | PENTEST_REPORT.md | in docs/security/ |
| Source files | match language convention | user.service.ts |
| Test files | [name].test.ts or test_[name].py | user.service.test.ts |

## How a task flows through this organisation

1. Atharva tells Chief of Staff the goal in plain English
2. Chief of Staff reads this WORKSPACE.md, produces Master Execution Plan
3. Chief of Staff spawns Senior PM and Guide and Explainer
4. Senior PM decomposes into tasks, spawns agents with full context
5. Each agent reads WORKSPACE.md, reads their task brief, does their work
6. Each agent writes output to their designated directory
7. Each agent logs to org/ACTIVITY.md
8. Parent agent reviews output against acceptance criteria
9. If fail: parent re-prompts agent with specific feedback
10. If pass: parent marks task complete, updates org/STATUS.md
11. When all tasks complete: Delivery Manager collects sign-offs
12. Delivery Manager writes review/READY_FOR_REVIEW.md
13. Guide writes review/DELIVERY_SUMMARY.md in plain English
14. Atharva reads review/DELIVERY_SUMMARY.md
15. Atharva writes APPROVED or REJECTED in review/APPROVAL.md
16. If approved: Atharva runs git add . && git commit && git push
17. GitHub receives push, CI/CD pipeline runs automatically

## The review directory is your staging area, Atharva

Everything in review/ is written for you to read before you push.
Start with review/DELIVERY_SUMMARY.md — it is in plain English.
Everything else is detail if you want to go deeper.
