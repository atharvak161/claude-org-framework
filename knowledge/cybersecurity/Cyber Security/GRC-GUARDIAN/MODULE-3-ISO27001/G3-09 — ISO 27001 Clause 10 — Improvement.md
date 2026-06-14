---
tags: [guardian, grc, module-3, iso27001, clause-10, improvement, nonconformity, corrective-action, continual-improvement]
module: 3
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G3-08 — ISO 27001 Clause 9 — Performance Evaluation", "G3-15 — Nonconformities — Major Minor Observations", "G3-16 — Management Review", "G3-17 — Surveillance Audits and Recertification", "G10-07 — Corrective Action and Follow-Up"]
---

# G3-09 — ISO 27001 Clause 10 — Improvement

> [!abstract] What This Note Covers
> By the end of this note, you will understand every requirement of ISO 27001 Clause 10 — nonconformity and corrective action, and continual improvement — including how nonconformities are classified, what a complete corrective action response looks like, and how the improvement process connects the entire PDCA cycle.

---

## Why This Exists

Clause 10 is the "Act" in the Plan-Do-Check-Act cycle. It is the mechanism by which the ISMS responds to what it finds — through monitoring, audit, incident review, and management review — and converts those findings into genuine improvement.

Without Clause 10, the ISMS is a closed loop without a feedback mechanism. You could identify every nonconformity, collect every metric, conduct every audit — and then do nothing with the results. Clause 10 makes improvement mandatory: when something goes wrong, the organisation must understand why, fix it, and prevent recurrence. When opportunities emerge, the organisation must actively pursue them.

Clause 10 is also, from an auditor's perspective, one of the most revealing clauses in the standard. The corrective action process tells you more about an organisation's attitude toward the ISMS than almost anything else. An organisation that investigates nonconformities thoroughly, identifies genuine root causes, implements effective corrective actions, and verifies their effectiveness is one that takes the ISMS seriously. An organisation that treats corrective actions as checkbox items — documenting a superficial response and closing the action without verifying effectiveness — is one that is managing paperwork, not managing risk.

---

## Clause 10 Overview: Two Requirements

| Sub-clause | Title | Core question |
|---|---|---|
| **10.1** | Nonconformity and corrective action | When something goes wrong, how do we respond, fix it, and prevent recurrence? |
| **10.2** | Continual improvement | How do we systematically and proactively make the ISMS better over time? |

---

## Clause 10.1 — Nonconformity and Corrective Action

### The Requirement

> *"When a nonconformity occurs, the organisation shall: a) react to the nonconformity, and as applicable: 1) take action to control and correct it; 2) deal with the consequences; b) evaluate the need for action to eliminate the cause(s) of the nonconformity, in order that it does not recur or occur elsewhere, by: 1) reviewing the nonconformity; 2) determining the causes of the nonconformity; 3) determining if similar nonconformities exist, or could potentially occur; c) implement any action needed; d) review the effectiveness of any corrective action taken; and e) make changes to the information security management system, if necessary. Corrective actions shall be appropriate to the effects of the nonconformities encountered. The organisation shall retain documented information as evidence of: f) the nature of the nonconformities and any subsequent actions taken; g) the results of any corrective action."*

### What Is a Nonconformity?

A **nonconformity** is the non-fulfilment of a requirement — either a requirement of ISO 27001 itself, or a requirement the organisation has set for itself (its own policies, procedures, or ISMS design).

**Sources of nonconformities:**

| Source | Examples |
|---|---|
| **Internal audit** | A process is not operating as documented; mandatory documented information is missing; a control is not implemented as the SoA claims |
| **External audit (certification body)** | Major or minor nonconformities raised by the certification body during Stage 2 or surveillance audits |
| **Security incidents** | An incident reveals a control failure (e.g. a phishing attack succeeds because email filtering was not configured correctly) |
| **Management review findings** | A metric persistently below target revealing a systematic control weakness |
| **Self-identification** | The CISO or security team identifies a gap proactively |
| **Supplier assessment** | A supplier assessment reveals a gap in the supplier security requirements process |
| **Staff reports** | A staff member identifies a control failure or policy violation |

Nonconformities are **not** the same as risks. A risk is something that might happen. A nonconformity is a confirmed gap — something that *is* happening (or not happening when it should be). Most nonconformities, if unaddressed, will eventually become risks materialising.

### The Three-Stage Corrective Action Response

Clause 10.1 requires three distinct stages of response to a nonconformity:

**Stage 1 — React (Clause 10.1(a)): Fix the immediate problem**

Correct the nonconformity (stop the bleeding) and deal with the consequences (manage the impact of what already happened).

This is the immediate response:
- A control failure is identified: implement an emergency fix to restore the control
- A policy violation has occurred: remediate the specific instance
- A documentation gap is found: create the missing document

**This is not enough on its own.** Fixing the immediate symptom without investigating the cause will result in the same nonconformity recurring. Clause 10.1(a) is necessary but insufficient.

**Stage 2 — Evaluate and determine root cause (Clause 10.1(b)): Find out why it happened**

This is root cause analysis — the systematic investigation of why the nonconformity occurred. Clause 10.1(b) requires:

*Reviewing the nonconformity*: What exactly is the gap? What is the full extent of it? Is it isolated or systemic?

*Determining the causes*: Why did this gap occur? Root cause analysis tools include:
- **5 Whys**: Ask "why?" five times, each time applying the question to the previous answer, drilling down to the root cause
- **Fishbone diagram (Ishikawa)**: Identify potential causes across categories (process, people, technology, management, environment)
- **Fault tree analysis**: Systematically map the causal chain from the nonconformity back to its origins

*Determining if similar nonconformities exist or could occur elsewhere*: If the root cause is a training gap, could that same gap affect other processes? If the cause is a process design failure, could other processes have the same design flaw?

**Root cause examples:**

| Nonconformity | Superficial cause | Root cause |
|---|---|---|
| MFA not enabled for 12 user accounts | IT technician forgot to enable MFA during provisioning | No automated check in the provisioning process to verify MFA enrolment before account activation |
| Supplier security assessment overdue for 3 critical suppliers | Risk manager did not schedule assessments | No calendar-based reminder system; no escalation process when assessments are overdue; no management visibility of supplier assessment status |
| Risk register not updated after significant cloud migration | Nobody flagged the migration as a trigger for risk assessment | Change management process does not include ISMS impact assessment; no security review gate in the change management process |

The corrective action must address the root cause — not just the symptom. A corrective action that re-trains the IT technician (addressing the symptom) without also implementing automated MFA verification (addressing the root cause) will see the same nonconformity recur when the next technician makes the same mistake.

**Stage 3 — Implement, review effectiveness, and update the ISMS (Clause 10.1(c), (d), (e))**

*Implement the corrective action*: Execute the planned response. Assign an owner, set a deadline, and track completion.

*Review effectiveness*: After implementing the corrective action, verify that it has actually resolved the nonconformity. This is not a tick-box — it is a genuine test. Examples:
- Automated MFA verification: run the provisioning process for new accounts and confirm MFA is verified before activation
- Supplier assessment calendar: verify that the system generated reminders and that a test assessment was scheduled appropriately
- Change management ISMS gate: run a mock change through the process and verify that the ISMS impact assessment step is triggered

*Make changes to the ISMS if necessary*: If the root cause analysis reveals that the nonconformity arose because the ISMS process was poorly designed, the process must be updated. The corrective action is incomplete if the ISMS documentation still describes the old (flawed) process.

### The Corrective Action Record

Clause 10.1(f) and (g) require documented information recording the nonconformity and corrective action. A complete corrective action record contains:

| Field | Content |
|---|---|
| **NC Reference** | Unique ID (e.g. CA-2024-017) |
| **Date identified** | When the nonconformity was found |
| **Source** | Internal audit / external audit / incident / self-identified |
| **ISO 27001 clause(s) affected** | Which clause requirement(s) are not met |
| **Description of nonconformity** | What exactly is the gap — specific, factual, evidence-based |
| **Immediate action taken** | What was done to fix the immediate problem |
| **Root cause analysis** | The methodology used (5 Whys, fishbone, etc.) and the root cause identified |
| **Corrective action planned** | The specific action(s) planned to address the root cause |
| **Owner** | Named individual responsible for implementing the corrective action |
| **Target completion date** | When the corrective action will be implemented |
| **Actual completion date** | When it was actually implemented |
| **Effectiveness review** | How effectiveness was verified and the result |
| **ISMS changes required** | Any updates to ISMS documentation resulting from the corrective action |
| **Status** | Open / In Progress / Closed (verified effective) |

### Corrective Action Proportionality

Clause 10.1 requires that corrective actions "shall be appropriate to the effects of the nonconformities encountered." This means the response must match the severity of the finding:

- A **major nonconformity** (systemic failure of a required ISMS element) requires a comprehensive corrective action response — root cause analysis, significant process redesign, and evidence of effectiveness
- A **minor nonconformity** (isolated lapse or partial non-fulfilment) requires a targeted but still documented corrective action
- An **observation** (potential improvement, not yet a nonconformity) may be addressed through the continual improvement process (Clause 10.2) rather than formal corrective action

Over-engineering corrective actions for minor observations wastes resources. Under-engineering them for major nonconformities leaves the root cause unaddressed.

---

## Clause 10.2 — Continual Improvement

### The Requirement

> *"The organisation shall continually improve the suitability, adequacy and effectiveness of the information security management system."*

### What Continual Improvement Means

Continual improvement is broader than corrective action. Corrective action is reactive — it responds to identified nonconformities and failures. Continual improvement is proactive — it actively seeks opportunities to make the ISMS better, even when no specific failure has occurred.

**Three dimensions of ISMS improvement:**

**Suitability**: Is the ISMS appropriate for the organisation? As the organisation changes (grows, changes business model, adopts new technology, enters new markets), the ISMS must evolve to remain relevant. An ISMS designed for a 50-person on-premise operation is not suitable for a 500-person cloud-first organisation.

**Adequacy**: Is the ISMS complete? Are all relevant risks covered? Are all required controls in place? Adequacy is about coverage — ensuring there are no significant gaps.

**Effectiveness**: Is the ISMS working? Are controls reducing risk as intended? Are objectives being achieved? Effectiveness is about outcomes — the ISMS exists to manage information security risk, and effectiveness measures whether it is achieving that purpose.

### Sources of Improvement Opportunities

Continual improvement opportunities emerge from every part of the ISMS:

**From monitoring and measurement (Clause 9.1)**: Metrics that are consistently below target indicate areas where the ISMS needs to improve. Trends that are deteriorating signal emerging weaknesses.

**From internal audit (Clause 9.2)**: Observations and opportunities for improvement identified by internal auditors that are not yet nonconformities — areas where current performance is adequate but could be better.

**From management review (Clause 9.3)**: Strategic improvement priorities identified by top management — investment in new capabilities, strengthening of specific control areas, expansion of scope.

**From incident review**: Post-incident reviews routinely identify improvements to controls, processes, and response procedures that go beyond corrective action for the specific nonconformity.

**From threat intelligence**: New threats or attack techniques may require proactive control improvements even before a specific risk has materialised.

**From benchmarking**: Understanding how peer organisations approach information security management, what frameworks they are adopting, and what improvements they have made can identify opportunities the organisation has not yet considered.

**From staff suggestions**: A culture where staff identify and report security improvement opportunities — not just security incidents — generates a continuous stream of operational-level improvement ideas.

### Documenting Improvement

The standard does not require a separate "improvement register" — but most mature ISMSs maintain one. An improvement log captures:

- Opportunity identified (description, source, date)
- Assessment (is this a priority? what is the potential benefit? what is the cost?)
- Decision (pursue / defer / decline, with rationale)
- If pursuing: owner, target date, success criteria
- Outcome: what was implemented and what was the result

Improvement opportunities that are approved and actioned feed back into the ISMS through updated risk registers, revised policies, new or enhanced controls, and updated SoAs.

---

## The Corrective Action Process in Practice: A Worked Example

**Scenario**: A surveillance audit finds that the organisation's internal audit programme has not covered Clause 8.2 (operational risk assessment) in the current certification period. The audit programme covers all clauses over 3 years, but Clause 8.2 was scheduled for Year 2 and was skipped due to resource pressures. The certification body raises this as a minor nonconformity.

**Stage 1 — Immediate action:**
Schedule a Clause 8.2 internal audit for the following month. Assign an independent internal auditor.

**Stage 2 — Root cause analysis (5 Whys):**
- Why was Clause 8.2 skipped? → The auditor responsible was on extended leave.
- Why was it not rescheduled? → No backup auditor was identified and no process existed to reschedule skipped audits.
- Why was there no backup auditor? → The internal audit programme assigns each clause to one auditor with no coverage plan.
- Why was there no coverage plan? → The audit programme was designed without considering absence scenarios.
- Root cause: The internal audit programme design does not include resource resilience or coverage planning, creating a single point of failure.

**Similar nonconformities**: Three other audit clauses also have single-auditor assignments. The same risk exists for all of them.

**Stage 3 — Corrective action:**
- Redesign the audit programme to assign primary and backup auditors for each clause
- Implement a monthly audit programme review to identify any scheduling slippage
- Add a quarterly check to the Security Committee agenda: "Is the internal audit programme on track?"
- Owner: CISO; Target: 45 days

**Effectiveness review**: 3 months after implementation, verify that:
- All audit clauses have both primary and backup auditors assigned
- The monthly review has been conducted for 3 consecutive months
- No audit activities are overdue

**ISMS update**: Update the internal audit procedure to document the backup auditor requirement and the monthly review process.

---

## The Details That Matter

### Major vs Minor Nonconformity vs Observation

These classifications matter significantly — they drive different response requirements and have different implications for certification:

**Major nonconformity**: Systematic failure to fulfil a requirement that significantly impacts the ISMS's ability to achieve its intended outcomes. A major nonconformity at a Stage 2 audit prevents certification until it is resolved. At a surveillance audit, it may jeopardise the certificate.

Examples:
- No risk assessment has been conducted (Clause 6.1.2 entirely absent)
- No management review has been conducted in the certification period (Clause 9.3 entirely absent)
- The SoA excludes a significant control category with no justification (Clause 6.1.3(d) incomplete)

**Minor nonconformity**: An isolated or partial failure to fulfil a requirement that does not fundamentally undermine the ISMS. Corrective action is required but does not prevent certification — the certification body will verify closure at the next audit.

Examples:
- One risk in the register has no named risk owner (isolated failure of Clause 6.1.2(c)(ii))
- The management review was conducted 14 months after the previous one (interval exceeded by 2 months)
- Two Annex A control exclusions lack documented justification

**Observation (Opportunity for Improvement)**: Not a nonconformity — the requirement is being met, but there is an opportunity to do it better. Addressed through Clause 10.2 (continual improvement) rather than Clause 10.1 (corrective action).

Examples:
- The risk assessment methodology would benefit from incorporating threat intelligence to improve realism
- The management review agenda covers all required inputs but the discussion time is short — deeper engagement would improve outcomes
- Security awareness training covers required content but is delivered in a format that staff find disengaging

### The Corrective Action Register

The corrective action register (or log) is the operational tool for tracking all nonconformities and their corrective actions. It should be:

- **Maintained actively**: Not just created at audit time and abandoned between audits
- **Reviewed regularly**: At Security Committee or management review to track progress
- **Linked to the audit programme**: Internal audit findings are the primary input
- **Used for trend analysis**: Recurring nonconformity types reveal systemic weaknesses

The register is mandatory documented information (Clause 10.1(f) and (g)) and is reviewed by external auditors as a standard surveillance audit activity.

### Corrective Action and the Certification Body

When a certification body raises a nonconformity at a Stage 2 or surveillance audit, the corrective action process is the mechanism for closing it.

For a major nonconformity: the organisation must submit a corrective action plan (with root cause analysis) to the certification body within a defined timeframe (typically 30–60 days). The certification body will verify the corrective action before proceeding with or maintaining certification.

For a minor nonconformity: the organisation submits the corrective action plan and the certification body reviews evidence of closure at the next scheduled audit.

The quality of the corrective action submission — depth of root cause analysis, specificity of proposed actions, credibility of the effectiveness verification plan — directly influences the certification body's confidence in the ISMS.

---

## Common Mistakes and Failures

**1. Corrective action that addresses the symptom, not the root cause.**
The most common Clause 10.1 failure. The nonconformity is "patched" immediately (the document is created, the control is deployed, the training is delivered) but no root cause analysis is conducted. Six months later, the same nonconformity appears again — or a variant of it in a different area — because the underlying cause was never addressed.

**2. Corrective action effectiveness not verified.**
Actions are marked "complete" when implemented, without verifying that the implementation actually resolved the nonconformity. The control is deployed but not tested. The process is redesigned but not validated. Effectiveness verification is the step that closes the loop — without it, the corrective action may have failed without anyone knowing.

**3. No corrective action for internal audit findings.**
Internal audit finds nonconformities. They are documented in the audit report. No corrective actions are raised. No owners are assigned. No due dates are set. At the next internal audit, the same findings appear. This is a systemic failure of Clause 10.1 and a red flag for external auditors.

**4. Continual improvement confused with corrective action.**
Every improvement opportunity is treated as a corrective action (triggering the full CA process for a minor improvement suggestion). Or conversely, genuine nonconformities are handled only through the improvement process without the full corrective action response (root cause analysis, effectiveness verification). The two processes are distinct and should be applied appropriately.

**5. Improvement programme that is aspirational but not actioned.**
A long list of improvement opportunities identified in management review. None are assigned owners or due dates. None are tracked. The same opportunities appear at the next management review. Improvement is treated as a wish list rather than a programme.

**6. ISMS not updated after corrective action.**
The corrective action identified that a process needed to be redesigned. The process was redesigned in practice. But the ISMS documentation (procedure, policy, risk register) was not updated to reflect the new process. The ISMS describes the old (flawed) process. New staff following the documented process will repeat the original failure.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Clause 10.1 is tested through review of the corrective action register, audit reports, and follow-up evidence. Auditors test:
  - "Show me your corrective action register. Walk me through the most significant nonconformity from the last 12 months."
  - "What root cause analysis method was used? Show me the output."
  - "How was the effectiveness of the corrective action verified?"
  - "Were any ISMS documents updated as a result of this corrective action?"

- Common major nonconformity: no corrective action for previously raised nonconformities — systematic failure to engage with the improvement cycle
- Common minor nonconformity: corrective actions raised but effectiveness not reviewed; nonconformity descriptions too vague to enable root cause analysis

**Exam scenario types:**
- *Given a description of a corrective action, identify what is missing*: Most commonly — root cause analysis has not been conducted, or effectiveness has not been verified
- *Given a nonconformity description, classify it*: Major (systemic absence of required ISMS element) vs minor (isolated/partial failure) vs observation (improvement opportunity)
- *Given a scenario, identify what corrective action should include*: The examiner is testing whether candidates know the full Clause 10.1 process (react → root cause → implement → verify effectiveness → update ISMS)

**CISM:**
- Domain 3 (Information Security Programme) includes the improvement cycle. CISM candidates must understand how to design and operate a continual improvement programme for the IS programme.

**CRISC:**
- Risk and control monitoring (Domain 4) feeds directly into improvement — when monitoring identifies control failure or risk increase, the corrective action and improvement processes are the mechanism for response.

---

## GUARDIAN's Take

Clause 10 is the most revealing clause in the standard, and it is the one that separates organisations that are genuinely improving from those that are maintaining a static compliance programme.

The corrective action process is where the ISMS proves it can learn. When a nonconformity occurs — whether found by an internal auditor, an external auditor, or a security incident — the question is not "how do we close this finding?" It is "why did this happen, and what do we need to change so it never happens again?"

That distinction — between closing a finding and preventing recurrence — is the entire value of Clause 10.1. And it requires honesty. Honest root cause analysis means being willing to conclude that the problem is not an individual's error but a process design failure, a resource constraint, a governance gap, or a cultural issue. Those conclusions require harder corrective actions — redesigning processes, escalating resource requests, changing governance structures, shifting culture.

Most organisations prefer the comfortable corrective action: retrain the individual, update the document, close the finding. It satisfies the auditor's immediate requirement and avoids the difficult conversation about root causes. And then the same nonconformity appears at the next audit. And the one after that.

The organisations that do Clause 10 properly — that investigate root causes with genuine rigour, implement corrective actions that address those causes, verify their effectiveness, and update the ISMS accordingly — are the organisations where nonconformities genuinely decline over time. Where the ISMS gets better with each cycle. Where the surveillance audits become progressively cleaner not because the organisation got better at preparing for audits but because the programme genuinely improved.

Clause 10 is not a compliance mechanism. It is the learning mechanism of the ISMS. Use it properly, and the ISMS will continuously get better. Use it as a box-ticking exercise, and the ISMS will remain exactly as it was on certification day — just more expensively maintained.

Build the learning organisation. That is what Clause 10 is for.

---
*Module: Module 3 — ISO 27001 | Guardian Curriculum*
