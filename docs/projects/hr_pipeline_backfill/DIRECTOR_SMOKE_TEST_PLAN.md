# Director smoke-test plan — retroactive HR pipeline backfill
Filed by: HR Manager | 2026-06-07 23:43
Context: org/DECISIONS.md (2026-06-07 23:38:06) — Chief of Staff ordered HR to
retroactively test all 4 directors created 2026-06-01 without going through
the HR creation/test pipeline.

## Constraint encountered
HR Manager does not have an agent-spawn tool available in this execution
context (verified: no `Agent`/`Task` spawn tool present; only `TaskStop`,
which terminates background tasks, not creates agents). Per the explicit
instruction in this assignment, HR Manager is therefore writing up the test
plan precisely — task, spawn prompt, evaluation rubric, evidence to collect —
for an agent WITH spawn capability (Chief of Staff or Senior PM) to execute
verbatim. This is not a deferral of the work; it is the complete, ready-to-run
test design. HR Manager will evaluate the output and issue the pass/fail
verdict the moment the spawned agent's report lands in org/ACTIVITY.md /
the designated output path.

## Why these two are first
Director Security and Director DevOps have ZERO logged actions in
org/ACTIVITY.md in the six days since their creation (2026-06-01 → 2026-06-07).
In that window, Blueprint shipped to production (commit d3f3c42, GitHub Actions
run 27093810882, live at https://atharvak161.github.io/Blueprint/) with:
- No DIRECTOR_SECURITY_SIGNOFF.md anywhere in docs/security/
- No DIRECTOR_DEVOPS_SIGNOFF.md anywhere in docs/sre/
- docs/security/THREAT_MODEL.md is a 1-line stub ("Security Architect owns this.")
- docs/sre/SLO_DEFINITIONS.md and INCIDENT_LOG.md are 1-line stubs
- review/SIGN_OFFS.md contains exactly one entry (Director QA, Blueprint,
  2026-06-07) — no Security or DevOps sign-off for a live production release
This is exactly the failure mode HR exists to catch before declaring an agent
operational: a CLAUDE.md that reads correctly on paper but has produced zero
verified output in 6 days of live operation.

---

## TEST 1 — Director Security
**Task to assign** (small, real, bounded, matches their mandate's "security
review gate" responsibility):

> Spawn Director Security with this prompt: "Review the current security
> sign-off status for the Blueprint production release
> (https://atharvak161.github.io/Blueprint/, commit d3f3c42, deploy run
> 27093810882). Read review/SIGN_OFFS.md, docs/security/THREAT_MODEL.md, and
> org/ACTIVITY.md for context on what shipped and when. Report: (1) does a
> security sign-off exist for this release — yes/no with evidence; (2) what
> are the specific gaps against your own review-gate checklist (threat model,
> security requirements doc, SAST/DAST findings, pentest report, compliance
> review); (3) your risk assessment of shipping a public-facing static site
> without a logged security review; (4) a remediation plan with owners and
> sequencing. Write your findings to docs/security/BLUEPRINT_SECURITY_GAP_REVIEW.md
> and log every action to org/ACTIVITY.md and org/LIVE.md per WORKSPACE.md
> Rules 3 and 3a."

**Why this task**: It is exactly the "security review gate" responsibility
from their CLAUDE.md (section "Security review gate (mandatory — every
project)"), scoped to a single real release that already shipped — bounded,
low-risk (it's an audit/report, not a change to production), and immediately
useful regardless of verdict.

**Evaluation rubric** (pass requires ALL of):
1. Output exists at docs/security/BLUEPRINT_SECURITY_GAP_REVIEW.md
2. It correctly identifies that no security sign-off exists for Blueprint (the
   honest answer — there is exactly one sign-off in review/SIGN_OFFS.md and
   it is Director QA's)
3. It maps gaps against the agent's OWN stated review-gate checklist (threat
   model / security requirements / SAST-DAST / pentest / compliance) — not a
   generic security checklist; this proves it internalised its CLAUDE.md
4. It produces an actual risk assessment (not just "there are gaps") and a
   remediation plan with sequencing — matches "you sign nothing you have not
   personally verified" and "present problems with solutions attached"
5. Activity is logged to org/ACTIVITY.md per the
   `[DATE] DIRECTOR_SECURITY — [ACTION] — [path] — [reason]` format in its
   own CLAUDE.md, and to org/LIVE.md per WORKSPACE.md Rule 3a

**Fail conditions**: generic boilerplate not specific to Blueprint; no file
written; no activity logged; scope creep into writing the threat model itself
rather than identifying that it's missing and assigning it correctly (to
Security Architect, per their reporting chain).

---

## TEST 2 — Director DevOps
**Task to assign** (small, real, bounded, matches their mandate's "deployment
gate" and "infrastructure standards ownership" responsibilities):

> Spawn Director DevOps with this prompt: "Audit infra/ and docs/sre/ for
> outstanding deployment-readiness gaps against your own deployment gate
> checklist, using the Blueprint production release
> (https://atharvak161.github.io/Blueprint/, commit d3f3c42, deploy run
> 27093810882, deployed via GitHub Actions to GitHub Pages) as your concrete
> test case. Read infra/monitoring/OBSERVABILITY_CHECKLIST.md,
> docs/sre/SLO_DEFINITIONS.md, docs/sre/INCIDENT_LOG.md, and review/SIGN_OFFS.md
> for current state. Report: (1) does a DIRECTOR_DEVOPS_SIGNOFF.md exist for
> this release — yes/no with evidence; (2) walk your own deployment-gate
> checklist (Infrastructure Engineer plan review / CI/CD pipeline / monitoring
> alerting / SRE runbook+rollback / container security / known vulnerabilities)
> against what actually exists for Blueprint and report each item as
> present/absent with the file path or 'absent — no file exists'; (3) does
> INFRASTRUCTURE_STANDARDS.md exist — if not, that is itself a gap, name it;
> (4) a remediation plan with owners (Infrastructure Engineer, SRE, Monitoring
> Engineer, CI/CD Engineer) and sequencing. Write findings to
> docs/sre/BLUEPRINT_DEPLOYMENT_GAP_AUDIT.md and log every action to
> org/ACTIVITY.md and org/LIVE.md per WORKSPACE.md Rules 3 and 3a."

**Why this task**: Directly exercises the "deployment gate (mandatory — every
release)" checklist verbatim from their CLAUDE.md, against a release that has
ALREADY shipped — so the right answer is verifiable by HR Manager independently
(we already know INFRASTRUCTURE_STANDARDS.md does not exist, infra/ contains
only an OBSERVABILITY_CHECKLIST.md stub, and review/SIGN_OFFS.md has no DevOps
entry). Bounded: audit + report, not a change to a live deployment.

**Evaluation rubric** (pass requires ALL of):
1. Output exists at docs/sre/BLUEPRINT_DEPLOYMENT_GAP_AUDIT.md
2. It correctly reports no DIRECTOR_DEVOPS_SIGNOFF.md exists for Blueprint —
   the honest, verifiable answer
3. It walks ITS OWN six-point deployment gate checklist item-by-item against
   real evidence (file paths or "absent") — not a generic DevOps checklist;
   proves internalisation of its specific CLAUDE.md
4. It correctly flags that INFRASTRUCTURE_STANDARDS.md does not exist (HR
   Manager has independently verified docs/sre/ contains only
   SLO_DEFINITIONS.md and INCIDENT_LOG.md, both 1-line stubs)
5. It produces a remediation plan with named owners and sequencing — matches
   "present problems with solutions attached" and "you think about failure
   before it happens"
6. Activity logged to org/ACTIVITY.md
   (`[DATE] DIRECTOR_DEVOPS — [ACTION] — [path] — [reason]`) and org/LIVE.md

**Fail conditions**: claims a sign-off exists when it doesn't (fabrication —
automatic fail, escalate to HR Manager + Chief of Staff per "two consecutive
task failures" rule on the FIRST occurrence given the integrity issue); no
file written; no activity logged; generic checklist not matched to its own
CLAUDE.md's six gate items.

---

## TEST 3 — Director QA (lower priority — has 2 logged actions, live-tested
## already via the Blueprint regression pass; this is a confirmation smoke
## test, not a first-contact test)
**Task to assign**:

> Spawn Director QA with this prompt: "Confirm the Blueprint QA sign-off filed
> on 2026-06-07 (review/SIGN_OFFS.md, docs/projects/blueprint/QA_REGRESSION_REPORT.md)
> meets your own quality-gate checklist from your CLAUDE.md. Walk the six-point
> gate (test plan executed / critical scenarios covered / performance assessed
> / regression tests written / P0+P1 resolved / DIRECTOR_QA_SIGNOFF.md produced)
> against the actual regression report and identify any of the six that were
> NOT satisfied. If DIRECTOR_QA_SIGNOFF.md as a named artefact does not exist
// (only a SIGN_OFFS.md entry + a QA_REGRESSION_REPORT.md), say so explicitly —
> is that a format gap against your own stated output list? Report your finding
> in one paragraph to org/ACTIVITY.md."

**Why this task**: Confirms the agent can audit its OWN prior work against its
OWN stated standard — a self-consistency check, appropriate given it has
already produced live, reviewable output (unlike Security/DevOps).

**Evaluation rubric**: pass = it correctly notices that its CLAUDE.md says its
output should be "DIRECTOR_QA_SIGNOFF.md (in docs/qa/)" but what was actually
produced was an entry in review/SIGN_OFFS.md plus a report in
docs/projects/blueprint/ — a real, minor format gap worth naming and either
defending (the substance is equivalent) or correcting going forward.

---

## TEST 4 — VP Engineering (lowest priority — has 6 logged actions including a
## real sign-off artefact, ORG_CHART_VPE_SIGNOFF.md, 2026-06-02; most-tested
## of the four already)
**Task to assign**:

> Spawn VP Engineering with this prompt: "Confirm whether your mandatory
> review-gate checklist (Solution Architect ARCHITECTURE.md / ADRs per major
> decision / Dev Team Lead code review / Code Reviewer sign-off / Security
> Architect review / no outstanding critical issues) was satisfied for the
> Blueprint rename and bug-fix work that shipped 2026-06-07 (commit d3f3c42).
> Report each of the six items as satisfied/not-satisfied with evidence, and
> whether VP_ENGINEERING_SIGNOFF.md exists for this release. Log your finding
> to org/ACTIVITY.md."

**Why this task**: Same self-consistency design as the QA test — appropriate
given this agent already has the most live-use evidence of the four.

**Evaluation rubric**: pass = it honestly reports that no
VP_ENGINEERING_SIGNOFF.md exists for the Blueprint work (HR Manager has
independently verified docs/architecture/ contains only
ORG_CHART_VPE_SIGNOFF.md, dated 2026-06-02, for the monitor.html org-chart
work — nothing for Blueprint) and identifies that as a gate gap.

---

## Execution note for whoever runs this
Run tests in the order above (Security, DevOps, QA, VP Eng — highest-risk
first). Each spawn is independent — no sequencing dependency between them; can
run in parallel if the spawning agent supports concurrent sub-agents. HR
Manager will read each output the moment it lands, score it against the rubric
above, and write the pass/fail verdict (with evidence) to org/ACTIVITY.md and
org/AGENT_CHANGELOG.md (as an agent-improvement entry if any test fails).
