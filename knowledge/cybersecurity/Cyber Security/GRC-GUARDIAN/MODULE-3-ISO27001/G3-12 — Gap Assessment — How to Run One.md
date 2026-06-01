---
tags: [guardian, grc, module-3, iso27001, gap-assessment, gap-analysis, readiness, implementation]
module: 3
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G3-01 — What is ISO 27001", "G3-02 — The ISMS", "G3-05 — ISO 27001 Clause 6 — Planning", "G3-10 — Annex A Controls — Complete Reference 2022", "G3-11 — Statement of Applicability", "G3-13 — The Certification Journey"]
---

# G3-12 — Gap Assessment — How to Run One

> [!abstract] What This Note Covers
> By the end of this note, you will understand what a gap assessment is, when and why it is conducted, how to plan and execute one systematically, how to document and present its findings, and how gap assessment outputs drive the ISMS implementation roadmap and the certification timeline.

---

## Why This Exists

Before an organisation begins building an ISMS — or before it seeks recertification or transitions to ISO 27001:2022 — it needs to understand where it currently stands. How much of what ISO 27001 requires does the organisation already have in place? Where are the significant gaps? What will it take to reach certification readiness, and in what sequence should the work be done?

The gap assessment answers these questions. It is the structured analysis of current state versus required state — a systematic review of everything ISO 27001 requires, measured against what the organisation currently has.

Without a gap assessment, ISMS implementations are blind. Organisations either over-invest in areas already compliant and neglect areas with significant gaps, or they underestimate the work required and miss certification deadlines. A well-executed gap assessment produces a clear implementation roadmap, a realistic resource estimate, and a prioritised action plan that sequences work from the most critical gaps to the least.

Gap assessments are also routinely used for:
- Organisations transitioning from ISO 27001:2013 to ISO 27001:2022
- Organisations preparing for a surveillance or recertification audit
- New CISOs assessing the security programme they have inherited
- Organisations that have experienced significant change and want to assess ISMS currency
- Due diligence during M&A — assessing a target's security maturity against ISO 27001 as a benchmark

---

## What a Gap Assessment Is

A **gap assessment** (also called a **gap analysis** or **readiness assessment**) is a structured review that compares the organisation's current information security posture against the requirements of ISO 27001:2022 and identifies the gaps — areas where requirements are not yet met.

The output is a gap report that, for each requirement, records:
- Current state: what is in place today
- Required state: what ISO 27001 requires
- Gap: the difference between current and required state
- Severity: how significant is the gap (Critical / Major / Minor / None)
- Actions required: what needs to be done to close the gap
- Estimated effort: rough estimate of time and resources required

The gap report is then used to:
1. Build the ISMS implementation project plan (sequencing and resourcing closure actions)
2. Develop the certification timeline (working backward from target certification date)
3. Identify quick wins (low-effort gaps that can be closed immediately)
4. Identify high-effort items requiring early start (long lead time actions)
5. Brief leadership on the investment required to achieve certification

---

## When to Conduct a Gap Assessment

### Scenario 1: Pre-Implementation (Starting from Scratch)

The most common scenario. The organisation has decided to pursue ISO 27001 certification and wants to understand the current state before building the ISMS.

**Timing**: Conduct as the first activity of the ISMS implementation programme. The gap assessment output defines the implementation scope and drives the project plan.

### Scenario 2: Transition from ISO 27001:2013 to ISO 27001:2022

Certified organisations had until 31 October 2025 to transition. Even post-transition, organisations need to understand which new 2022 requirements (particularly the 11 new Annex A controls) are not yet addressed.

**Focus**: New requirements in 2022 — Clause 6.3 (planned changes), the 11 new controls, updated control descriptions, and the new control attribute framework.

### Scenario 3: Pre-Surveillance or Pre-Recertification Audit

A targeted gap assessment conducted 2–3 months before an external audit to identify any gaps that need to be closed before the auditor arrives. This is sometimes called a "mock audit" or "readiness review."

**Focus**: Requirements known to be at risk (from previous audit findings, monitoring data, or operational awareness) plus a systematic check across all clauses.

### Scenario 4: Post-Significant Change

A major organisational change — cloud migration, acquisition, significant headcount growth, new product launch, office relocation — may have introduced gaps into a previously compliant ISMS.

**Focus**: Clauses and controls most affected by the specific change (e.g. a cloud migration primarily affects Clause 4 scope, A.5.23 cloud services, A.8.9 configuration management).

### Scenario 5: Inherited ISMS Assessment

A new CISO or ISMS Manager wants to understand the state of the programme they have inherited before deciding what to prioritise.

**Focus**: Full assessment, producing a current-state baseline that informs the new CISO's first-year priorities.

---

## How to Plan a Gap Assessment

### Define the Assessment Scope

Before beginning, define exactly what will be assessed:
- Which clauses of ISO 27001 (typically all of Clauses 4–10 plus Annex A)
- Which organisational units (aligned with the proposed ISMS scope)
- Which locations
- Which external factors (regulatory requirements, customer obligations)

For a transition assessment or pre-surveillance assessment, the scope may be narrower — focused on specific clauses or a subset of controls.

### Assemble the Assessment Team

A gap assessment is not a solo activity. The team typically includes:
- **Lead assessor**: CISO, ISMS Manager, or external consultant with deep ISO 27001 knowledge
- **Subject matter experts**: IT Manager (for technical controls), HR Manager (for people controls), Facilities Manager (for physical controls), Legal/Compliance (for regulatory requirements)
- **Process owners**: People who can describe how current processes actually operate (not just how they are documented)

External assessors bring objectivity and deep ISO 27001 experience but require time to understand the organisation. Internal assessors know the organisation but may lack objectivity. Most effective approach: internal lead with external advisor support.

### Develop the Assessment Framework

The assessment framework is the structured questionnaire or checklist used to conduct the assessment. It maps every ISO 27001 requirement to specific assessment questions:

**Example framework structure:**

For each clause or control, define:
- **Assessment criterion**: The specific ISO 27001 requirement being assessed
- **Assessment questions**: What to ask, what to look for, what evidence to request
- **Evidence required**: What documentation, records, or demonstrations would confirm compliance
- **Rating scale**: How to score the current state (typically: Compliant / Partially Compliant / Non-Compliant / Not Applicable)

### Schedule Assessment Activities

A gap assessment uses multiple methods to gather information:
- **Document review**: Reviewing existing policies, procedures, risk registers, training records, audit reports
- **Interviews**: Structured conversations with process owners and subject matter experts
- **Observations**: Watching processes operate in real time (physical security walkthroughs, system demonstrations)
- **Technical testing**: Sampling — checking a selection of user accounts, reviewing patch compliance reports, testing backup restoration
- **Workshops**: Facilitated group sessions to assess current practices collectively

Typical timeline for a comprehensive gap assessment:
- Small organisation (<50 staff, narrow scope): 3–5 days
- Medium organisation (50–500 staff): 1–3 weeks
- Large organisation (500+ staff, complex scope): 3–6 weeks

---

## How to Execute the Gap Assessment: Clause by Clause

### Clause 4: Context of the Organisation

**What to assess:**
- Is there a documented context analysis (internal and external issues)?
- Are interested parties identified with their requirements documented?
- Is the ISMS scope defined, documented, and appropriate?

**Questions to ask:**
- "What document captures your understanding of the organisation's internal and external context?"
- "Who are your most important interested parties? What do they require from your security programme?"
- "What is the scope of your ISMS? What is excluded and why?"

**Evidence to request:** Context analysis document; interested party register; scope statement

**Common gaps:** No documented context analysis (or a generic template); interested parties not formally identified; scope not formally documented; interfaces with out-of-scope functions not addressed

### Clause 5: Leadership

**What to assess:**
- Is the information security policy approved by top management and current?
- Are roles and responsibilities defined and communicated?
- Is there evidence of top management engagement with the ISMS?

**Questions to ask:**
- "Who approved the information security policy? When was it last reviewed?"
- "Who owns specific risks in the business? Do they know they are risk owners?"
- "When did the board or executive team last discuss information security risk?"

**Evidence to request:** Policy document with approval; role definitions; management review records; Security Committee minutes

**Common gaps:** Policy approved by IT Director rather than CEO/MD; roles defined but not communicated; management engagement limited to signing the policy document

### Clause 6: Planning

**What to assess:**
- Is there a documented risk assessment methodology that produces consistent results?
- Has a risk assessment been conducted?
- Is there a risk treatment plan?
- Does the SoA exist and is it complete?
- Are information security objectives defined and measurable?

**Questions to ask:**
- "Show me your risk assessment methodology. How does it define likelihood and impact scales?"
- "Walk me through a specific risk. How was it identified, assessed, and treated?"
- "Is your SoA complete? Can you trace each applicable control to a specific risk?"
- "What are your current information security objectives? How are they measured?"

**Evidence to request:** Risk assessment methodology; risk register; risk treatment plan; SoA; objectives documentation

**Common gaps:** No documented methodology; risk register exists but is generic/undifferentiated; SoA exists but controls not linked to risks; objectives defined but not measurable

### Clause 7: Support

**What to assess:**
- Is the security budget adequate?
- Do key security roles have required competence (qualifications, experience)?
- Are all staff trained on security awareness?
- Is documented information controlled (version management, approval, review)?

**Questions to ask:**
- "What training have you completed in information security? When did you last attend security awareness training?"
- "Show me the version history of your information security policy. When was it last reviewed and approved?"
- "What is your security budget? Is it adequate for the ISMS programme?"

**Evidence to request:** Competence records; training records; phishing simulation results; document version histories; budget information

**Common gaps:** Training records exist but no evidence of competence evaluation; documentation without version control; policy not reviewed in 12+ months

### Clause 8: Operation

**What to assess:**
- Are ISMS processes actually operating (not just documented)?
- Is evidence of process operation retained?
- Are changes managed in a controlled way?
- Are externally provided services (cloud, managed services) controlled?

**Questions to ask:**
- "Show me evidence that your patch management process ran last month. What patch compliance rate did you achieve?"
- "When was the last time you reviewed access rights for your systems? Show me the access review records."
- "How do you assess security risk for new IT projects? Walk me through the last project that went through this process."

**Evidence to request:** Operational records (access reviews, vulnerability scans, patch reports, backup logs); change management records; supplier assessment records

**Common gaps:** Processes documented but evidence not retained; access reviews not conducted; change management without security consideration; supplier security not assessed

### Clause 9: Performance Evaluation

**What to assess:**
- Is the organisation monitoring security metrics?
- Has an internal audit been conducted?
- Has a management review been conducted?

**Questions to ask:**
- "What security metrics do you track? Show me a recent metrics report."
- "When was your last internal audit? Show me the audit report and subsequent corrective actions."
- "When was your last management review? Show me the minutes. What decisions were made?"

**Evidence to request:** Metrics reports; internal audit programme; audit reports; corrective action logs; management review minutes

**Common gaps:** No monitoring programme; no internal audit conducted; management review conducted but minimal evidence of substantive engagement; corrective actions from audit not tracked

### Clause 10: Improvement

**What to assess:**
- Is there a corrective action process?
- Are nonconformities tracked and addressed?
- Is there evidence of continual improvement?

**Questions to ask:**
- "Show me your corrective action register. What nonconformities have been identified in the last 12 months? What was done about them?"
- "Give me an example of something the ISMS improved in the last year. What triggered the improvement?"

**Evidence to request:** Corrective action register; nonconformity records; evidence of root cause analysis; evidence of effectiveness verification

**Common gaps:** No corrective action process; nonconformities raised but not tracked to closure; no evidence of root cause analysis; improvement is ad hoc rather than systematic

### Annex A Controls

For the Annex A assessment, work through all 93 controls using the assessment framework. For each control:

**Rate implementation:**
- **Compliant**: Control is implemented, operating, and evidenced
- **Partially Compliant**: Control is partially implemented or implementation cannot be fully evidenced
- **Non-Compliant**: Control is required (applicable) but not implemented
- **Not Applicable**: Control is not applicable — with justification

**Identify gaps:** For each non-compliant or partially compliant control, describe specifically what is missing.

**Prioritise by risk**: Controls addressing Critical/High risks are higher priority gaps than those addressing Low risks.

---

## Documenting and Presenting Gap Assessment Findings

### The Gap Report Structure

A gap report typically contains:

**Executive Summary** (1–2 pages):
- Overall compliance posture (percentage of requirements met, partially met, not met)
- Top 5 critical gaps requiring immediate attention
- Estimated effort and cost to reach certification readiness
- Recommended timeline to certification

**Findings by Clause** (detailed):
- For each clause: current state, gap description, severity rating, recommended actions

**Annex A Control Assessment** (matrix format):
- All 93 controls with current implementation status and gap description where applicable

**Implementation Roadmap**:
- Prioritised action list with estimated effort, owner, and target date
- Phased implementation plan (Phase 1: critical gaps; Phase 2: major gaps; Phase 3: minor gaps)
- Milestone timeline to certification

**Resource Estimate**:
- Estimated internal effort (person-days)
- Estimated external cost (consultancy, tooling, training)
- Estimated certification body fees (Stage 1 + Stage 2 audit)

### Gap Severity Rating Scale

| Severity | Definition | Certification implication |
|---|---|---|
| **Critical** | A required ISMS element is entirely absent (e.g. no risk assessment has ever been conducted; no management review has occurred) | Would likely result in a major nonconformity at audit; must be addressed before Stage 2 |
| **Major** | A significant requirement is partially met or significantly deficient (e.g. risk assessment conducted but methodology undocumented; SoA exists but controls not linked to risks) | Would likely result in a minor nonconformity at audit; should be addressed before Stage 2 |
| **Minor** | A requirement is met but with minor deficiencies (e.g. policy reviewed 14 months ago against 12-month schedule; training records complete but no effectiveness evaluation) | May result in an observation at audit; should be addressed before Stage 2 if feasible |
| **None** | Requirement is fully met with adequate evidence | No action required |

### The Implementation Roadmap

The roadmap sequences the actions needed to close all gaps, prioritised by:
1. Severity (Critical first)
2. Dependency (some actions must precede others — scope must be defined before risk assessment; risk assessment must precede SoA)
3. Effort (quick wins first, within each severity band — these build momentum)
4. Lead time (long-lead items — hiring, tooling procurement, training certification — start early)

**Example high-level roadmap:**

| Phase | Timeframe | Focus |
|---|---|---|
| **Phase 0 — Foundation** | Weeks 1–2 | ISMS scope definition; context analysis; interested party requirements; top management briefing and commitment |
| **Phase 1 — Risk** | Weeks 3–6 | Risk assessment methodology documentation; risk assessment workshops; risk register completion; risk treatment plan |
| **Phase 2 — Controls** | Weeks 7–16 | SoA completion; control implementation (prioritised by risk); evidence collection |
| **Phase 3 — Support** | Weeks 8–14 (parallel) | Policy suite completion; competence and awareness programme; documented information management |
| **Phase 4 — Check** | Weeks 15–20 | Monitoring metrics programme; internal audit; management review |
| **Phase 5 — Certification Readiness** | Weeks 18–22 | Internal readiness review; corrective action closure; Stage 1 submission preparation |
| **Stage 1 Audit** | Week 22–24 | Certification body documentation review |
| **Stage 1 findings closure** | Weeks 24–26 | Address any Stage 1 findings |
| **Stage 2 Audit** | Weeks 26–30 | Certification body on-site/remote assessment |

For a well-prepared organisation starting from a moderate base, 6–9 months from gap assessment to certification is typical. For organisations starting from scratch, 9–18 months is more realistic.

---

## Gap Assessment vs Internal Audit: The Key Distinction

| Dimension | Gap Assessment | Internal Audit |
|---|---|---|
| **Purpose** | Understand current state; plan ISMS implementation | Provide assurance that ISMS conforms to requirements |
| **When conducted** | Before or during ISMS implementation; at transition; periodically | After ISMS is established; as part of the ongoing ISMS programme (Clause 9.2) |
| **Output** | Gap report; implementation roadmap | Audit report; nonconformities; corrective actions |
| **Tone** | Collaborative and diagnostic | Independent and assurance-focused |
| **ISMS maturity required** | None — can be conducted before ISMS exists | The ISMS must exist and be operational to audit |
| **ISO 27001 requirement** | Not required by the standard (but essential in practice) | Required by Clause 9.2 |

---

## The Details That Matter

### The Pre-Certification Internal Audit vs the Gap Assessment

Many organisations confuse these two. The gap assessment is diagnostic — it identifies what is needed. The pre-certification internal audit is assurance — it verifies that the ISMS built since the gap assessment actually meets requirements.

Best practice: conduct the gap assessment at the start, use it to build the ISMS, then conduct a formal internal audit 2–3 months before the Stage 1 audit to verify that all gaps have been closed.

### Quantifying the Gap

When presenting to leadership, quantify the gap in business terms — not just "27 non-compliant controls" but:
- "To reach certification, we estimate 45 days of internal effort over 6 months"
- "External costs will include: consultant support (£15,000), awareness training platform (£5,000 per year), vulnerability scanning tool (£8,000 per year), penetration test (£12,000), and Stage 1+2 certification audit (£8,000)"
- "Total estimated investment: £48,000 + 45 days internal effort"

This framing makes the gap report a business case document as well as a technical assessment — which is exactly what leadership needs to make an informed investment decision.

### Gap Assessment for the 2022 Transition

For organisations transitioning from ISO 27001:2013 to ISO 27001:2022, the gap assessment focuses specifically on:

**New Clause 6.3** (Planning of changes): Does the organisation have a process for managing planned ISMS changes?

**The 11 new Annex A controls**: Are any of these already in place (perhaps under a different name)? Which need to be implemented?

**Control consolidation**: Some 2013 controls were consolidated or renamed in 2022. The SoA must be updated to reflect the new control references.

**Control attribute mapping**: The 2022 Annex A includes attributes for each control. While not mandatory to implement the attribute framework, the SoA should reference the 2022 control structure.

---

## Common Mistakes and Failures

**1. Gap assessment conducted by the CISO alone.**
A solo assessment misses operational reality. The CISO knows what should be happening; the operational teams know what is actually happening. Combining both perspectives produces an accurate gap picture. A CISO-only assessment typically underestimates gaps in operational processes.

**2. Assessment based on documentation review only.**
Documents say all staff received security training last year. In practice, the training was conducted only for the original 50 staff; the 30 who joined in the second half of the year never received it. Document review alone would not catch this. Interviews and sampling are essential.

**3. Gap report that lists gaps without prioritising them.**
A report with 45 gaps listed alphabetically by control number. Leadership cannot use this to make prioritisation decisions. Gaps must be prioritised by severity and sequenced in a logical implementation order.

**4. Implementation roadmap without realistic resource estimates.**
A gap report that recommends closing all gaps within 3 months, without acknowledging that this would require 5 people working full-time on ISMS implementation. Roadmaps that ignore resource constraints are not usable.

**5. Gap assessment treated as a one-time activity.**
The pre-certification gap assessment is treated as the only gap assessment ever needed. The ISMS grows and changes but is never re-assessed against the standard between surveillance audits. Gaps accumulate silently.

**6. Assessment methodology not documented.**
The gap assessment methodology is not documented, so when the next assessment is conducted (pre-recertification), there is no basis for comparing current state to the previous assessment. Gap assessments should produce comparable results over time.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Lead Auditors are often expected to conduct or oversee gap assessments as pre-implementation consultancy. Understanding the gap assessment methodology is essential.
- The gap assessment is the precursor to the internal audit — both evaluate compliance with ISO 27001, but at different stages of ISMS maturity.
- Exam scenarios: "An organisation is starting an ISO 27001 implementation. What should be the first activity?" (Answer: gap assessment / context analysis — scope cannot be defined without understanding current state and organisational context.)

**CISM:**
- Domain 3 (Security Programme) includes programme assessment and maturity evaluation — directly mapping to gap assessment methodology.

**CRISC:**
- Domain 1 (IT Risk Identification) includes assessment of the current control environment — a gap assessment provides this baseline.

---

## GUARDIAN's Take

The gap assessment is the most underrated activity in ISO 27001 implementation. Organisations are often eager to skip it and get straight to building controls — partly because there is a misconception that the gap assessment is overhead rather than value-add.

It is not overhead. It is the foundation.

Without a gap assessment, ISMS implementations waste effort on areas that are already compliant, underinvest in areas with significant gaps, and consistently underestimate the time and resources required for certification. I have seen organisations begin implementation without a gap assessment, confident they are 80% of the way there, and discover through the Stage 1 audit that they are closer to 40% — with a certification timeline that slips by six months and a budget that doubles.

The gap assessment converts uncertainty into a plan. It replaces assumptions with evidence. It gives leadership the information they need to make a real investment decision — with realistic cost, realistic timeline, and realistic expectations of what achieving and maintaining certification actually requires.

Done well, a gap assessment typically takes 1–3 weeks and produces the clearest possible picture of where the organisation stands and what it will take to get to certification. That investment in clarity pays for itself immediately in avoided misdirection and wasted effort.

Do the gap assessment first. Always.

---
*Module: Module 3 — ISO 27001 | Guardian Curriculum*
