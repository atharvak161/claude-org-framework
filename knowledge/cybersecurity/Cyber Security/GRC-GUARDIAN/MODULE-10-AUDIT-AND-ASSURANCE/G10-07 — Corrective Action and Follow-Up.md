---
tags: [guardian, grc, module-10, corrective-action, root-cause-analysis, rca, follow-up, improvement]
module: 10
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-25
guardian-refs: ["G10-05 — Audit Findings", "G10-06 — Audit Report Writing", "G3-09 — ISO 27001 Clause 10 — Improvement", "G3-15 — Nonconformities"]
---

# G10-07 — Corrective Action and Follow-Up

> [!abstract] What This Note Covers
> By the end of this note, you will understand the complete corrective action process — from root cause analysis through to verified closure — including how to write a corrective action plan, how to conduct root cause analysis effectively, how auditors verify that corrective actions are genuine, and how the corrective action process connects to continual improvement.

---

## Why This Exists

A finding without a corrective action is a documented problem that stays a problem. The corrective action process is where audit value is converted into security improvement — where identified gaps are investigated, understood, and resolved.

Most organisations treat corrective action as an administrative exercise: a box to tick, a form to fill in, an entry to make in a register. The corrective action plan is produced, submitted, filed, and forgotten. The same finding appears at the next audit.

Genuine corrective action requires something harder: honest root cause analysis that identifies why the gap occurred (not just that it occurred); corrective actions that address the root cause (not just the symptom); and verification that the corrective action was effective (not just implemented). This note covers each stage in depth.

---

## The Corrective Action Process: Six Stages

### Stage 1: Acknowledge and Contain

Immediately upon receiving a finding, the auditee must:

**Acknowledge** the finding without defensiveness. The finding describes a gap in the management system — acknowledging it is the first step to addressing it.

**Contain immediate risk** where necessary. If the finding represents an active risk (an account without MFA enrolled in the CDE; a data breach that has not been reported), the containment action is immediate — independent of the root cause analysis and corrective action planning that follows.

Example:
- Finding: Two accounts in the CDE without MFA enrolled
- Immediate containment: Revoke access or immediately enroll MFA for those two accounts (same day)
- Corrective action: Fix the provisioning procedure that allowed this to occur

Containment addresses the immediate risk. Corrective action addresses the systemic cause. Both are required; they are sequential, not interchangeable.

### Stage 2: Root Cause Analysis

Root cause analysis (RCA) is the process of identifying *why* a gap occurred — not just that it occurred. This is the most commonly mishandled stage.

**The RCA failure mode**: Identifying the symptom as the root cause.

"The access review was not completed." → Is this the root cause? No — it describes what happened. *Why* was it not completed?

"The access review was not on the quarterly review schedule." → Is this the root cause? No. *Why* was it not on the schedule?

"When we integrated the platform after the acquisition, we rebuilt the review schedule and missed this system." → Getting closer. *Why* was it missed?

"The system onboarding process has no step to add new systems to the access review schedule." → **Root cause.** This is a process gap, not an individual failure.

**The 5 Whys technique:**

Ask "why?" repeatedly — typically 3–6 iterations — until the fundamental systemic cause is revealed. Each "why" moves from symptom to contributing factor to root cause.

**Fishbone (Ishikawa) diagram**: A visual tool for exploring multiple potential root causes across categories: People, Process, Technology, Environment, Management. Useful when the root cause is genuinely unclear and multiple contributing factors are suspected.

**The root cause test**: "If we implement the proposed corrective action, will this finding recur?" If yes, the root cause has not been correctly identified — the corrective action addresses a symptom, not the cause.

### Stage 3: Corrective Action Planning

The corrective action plan (CAP) is produced by the auditee in response to the audit finding. Submitted within the timeframe defined in the audit report — typically 30 days for major NCs; 60 days for minor NCs in internal audits.

**CAP content for each finding:**

**Finding reference**: Links to the finding in the audit report.

**Root cause statement**: Specific, honest description of the fundamental cause — not the symptom, not the immediate trigger, but the underlying process or system failure.

**Corrective actions**: Specific actions addressing the root cause. For each:
- What will be done
- Who is responsible (named individual)
- Target completion date
- What evidence will be produced to demonstrate completion

**Immediate containment** (if applicable): What was done to address the immediate risk while the corrective action is implemented.

**Verification approach**: How effectiveness will be confirmed.

**Example CAP entry:**

```
FINDING: INT-2026-003
Access reviews for the project management platform and IT service desk 
system not completed within the required quarterly interval.

ROOT CAUSE:
When systems are onboarded through our integration process, there is no 
step that adds new systems to the quarterly access review schedule. The 
onboarding checklist was created before the quarterly access review 
requirement was formalised in the Access Control Policy v2.0 (March 2023) 
and has not been updated to include it.

IMMEDIATE CONTAINMENT (completed 2026-04-25):
Both overdue access reviews completed; 14 accounts removed; 3 accounts 
modified. Evidence available on request.

CORRECTIVE ACTIONS:

1. Update system onboarding checklist to include mandatory access review 
   schedule registration as a required step
   Owner: K. Sharma (IT Operations Manager)
   Due: 2026-05-09
   Evidence: Updated checklist version; change record

2. Reconcile access review schedule against current system inventory to 
   identify any other systems missed
   Owner: K. Sharma (IT Operations Manager)
   Due: 2026-05-09
   Evidence: Reconciliation report confirming all systems are on schedule

3. Update quarterly access review procedure to include a completeness 
   check confirming full system coverage before each quarterly cycle
   Owner: M. Jones (IT Security Lead)
   Due: 2026-05-23
   Evidence: Updated procedure version

VERIFICATION:
Q2 2026 access review (due 2026-06-30) will include the previously missed 
systems. Evidence of completion and updated checklist will be submitted as 
closure evidence.

Responsible: K. Sharma (IT Operations Manager)
```

### Stage 4: Auditor Review of the CAP

The auditor reviews the CAP for adequacy before accepting it as a commitment to close the finding.

**CAP review criteria:**

*Is the root cause genuinely identified?* If the proposed corrective actions would not prevent recurrence, the root cause is wrong.

*Are the corrective actions sufficient?* Do they address the root cause? Are they specific enough to be verifiable?

*Is the timeline realistic?* Overly optimistic timelines that slip create additional findings.

*Is the closure evidence appropriate?* "We will fix it" is not closure evidence. Specific, verifiable outputs are.

*Is the owner empowered to act?* The named owner must have authority to implement the action.

**Outcomes:**
- **Accept**: Adequately addresses root cause. Finding remains open until closure evidence reviewed.
- **Conditionally accept**: Adequate but requires modification. Accept with documented conditions.
- **Reject**: Insufficient. Return with specific feedback for revision.

### Stage 5: Implementation Monitoring

Between CAP acceptance and closure, corrective actions are monitored.

**Internal audit programme:**
- Corrective action register reviewed monthly for major NCs; quarterly for minor NCs
- Slipping actions escalated: action owner → owner's manager → CISO → management review

**External certification audits:**
- CB sets closure deadlines in the audit report
- Major NCs: CB reviews closure evidence before issuing certificate or lifting suspension
- Minor NCs: Closure evidence reviewed at next surveillance audit

**Escalation triggers:**
- Due date passed without closure evidence submitted
- Action owner reports inability to complete within timeline
- Related incident occurs (the gap has already caused harm)

### Stage 6: Closure Verification

The finding is closed when:
1. Corrective actions have been implemented
2. Closure evidence submitted and reviewed
3. Auditor satisfied that root cause has been addressed and recurrence is unlikely

**Closure evidence standards:**
- Specific to the corrective action (not reused from before the finding)
- Current (post-implementation)
- Demonstrates both that the action was implemented AND that it is working

**Effectiveness verification**: For major NCs, best practice is a follow-up mini-audit specifically testing whether the corrective action resolved the issue — not just confirming the action was taken.

---

## The Corrective Action Register

All findings and corrective actions tracked in a live register:

| Field | Content |
|---|---|
| Finding ID | From the audit report |
| Source | Internal audit / external audit / incident |
| Finding summary | Brief description |
| Classification | Major NC / Minor NC / Observation |
| Root cause | Identified root cause |
| Corrective actions | Actions with owners and due dates |
| CAP status | Draft / Accepted / In progress / Overdue / Closed |
| Closure evidence | Description of evidence submitted |
| Closure date | Date formally closed |
| Recurrence | Has this finding recurred? |

**Register review frequency:**
- Monthly: CISO reviews for overdue actions
- Quarterly: Security management meeting reviews overall status
- Annually: Management review considers register as performance input

---

## Corrective Action vs Preventive Action

**Corrective action** (ISO 27001 Clause 10.1): Actions taken to eliminate the cause of a detected nonconformity and prevent recurrence. Responds to something that has already gone wrong.

**Preventive action**: ISO 27001:2022 (HLS structure) does not include preventive action as a separate explicit requirement — the risk assessment process (Clause 6.1) serves this function. When the risk assessment identifies a potential problem and implements controls, that is the equivalent of preventive action.

**The risk register connection**: When root cause analysis reveals a risk not previously on the risk register (a process gap that could affect other areas), this should be added to the register — activating the risk treatment process as a form of preventive action.

---

## The Connection to Continual Improvement

ISO 27001 Clause 10.2 requires continual improvement of the ISMS. Corrective action is the primary mechanism — but it must produce genuine improvement:

**Improvement that is real:**
- Root cause correctly identified
- Actions address root cause (not symptom)
- Effectiveness verified (finding does not recur)
- Improvement incorporated into management system (procedures updated; training updated)

**Improvement that is cosmetic:**
- Symptom addressed without fixing root cause
- CAP describes planned actions; nobody implements them
- Finding marked "closed" before effectiveness verified
- Same finding appears at next audit

**The management review as improvement driver**: Management review receives the corrective action register as an input — providing a consolidated view of where the ISMS has failed and what is being done. Management decisions that respond to corrective action patterns ("we have had four access management findings in two years — we need a PAM solution") are the highest-value output of the corrective action process.

---

## Common Mistakes and Failures

**1. Root cause identified as the symptom.**
"The access review was not completed" is the finding, not the root cause. "The onboarding process has no step to register systems in the review schedule" is the root cause. Corrective actions addressing symptoms will not prevent recurrence.

**2. Corrective actions too vague.**
"We will improve our access review process." → By doing what? Who? When? What evidence demonstrates completion? Vague actions produce vague closure evidence and no real improvement.

**3. Immediate containment submitted as sole closure evidence.**
"We completed the two overdue access reviews." → This addresses the symptom. The process gap that allowed the reviews to be missed must also be addressed.

**4. No effectiveness verification.**
The action is implemented; the finding is closed; the same finding appears next audit. Effectiveness must be verified before closure.

**5. Register not maintained.**
12 findings all showing "In progress" at management review — even those completed months ago. An unmanaged register provides no governance value.

**6. Ownership distributed to "the team."**
No named individual; no personal accountability; no clear escalation point. Every corrective action must have a named owner.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Corrective action management is a key Clause 10.1 requirement. Auditors specifically look for: root cause documented; actions addressing root cause (not symptom); implementation evidence; effectiveness verification.
- Exam scenario: "The auditee submits a CAP stating 'the access reviews have been completed.' Is this adequate?" Answer: No — it addresses the immediate gap but does not identify the root cause or actions to prevent recurrence.

**CISM:**
- Domain 3 (Security Programme) — corrective action management is part of the security programme improvement cycle. CISMs must ensure findings drive genuine improvement.

**CRISC:**
- Domain 4 (Risk and Control Monitoring) — corrective action tracking feeds into the ongoing risk and control monitoring programme.

**CISSP:**
- Domain 6 (Security Assessment and Testing) — corrective action processes and their role in the security assessment and improvement lifecycle.

---

## GUARDIAN's Take

Corrective action is where the audit investment is realised — or lost. The most rigorous audit in the world produces no security improvement if the findings produce cosmetic corrective actions that address symptoms without fixing root causes.

The 5 Whys technique is simple but transformative when applied honestly. The discipline of asking "why?" until you reach a systemic cause — rather than accepting the first convenient explanation — is what separates corrective action that prevents recurrence from corrective action that just delays it.

I have seen the same finding appear in successive annual audit reports, for four or five consecutive years. Each year, the same access review is overdue; each year, a corrective action plan is produced completing the review; each year, the finding is closed; each year, the review falls behind schedule again. The review completion was the symptom; the process gap was the cause; the cause was never addressed; the symptom recurred.

The corrective action register that shows a finding closed in year one that has not recurred in years two, three, and four — that is the sign of genuine corrective action. The register that shows the same finding recur year after year is a governance failure that management review should be surfacing and resolving.

Root cause. Genuine action. Verified effectiveness. That is the corrective action standard that produces a genuinely improving management system.

---
*Module: Module 10 — Audit and Assurance | Guardian Curriculum*
