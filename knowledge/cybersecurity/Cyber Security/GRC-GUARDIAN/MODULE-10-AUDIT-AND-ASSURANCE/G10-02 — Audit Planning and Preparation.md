---
tags: [guardian, grc, module-10, audit-planning, audit-programme, audit-scope, audit-criteria, preparation]
module: 10
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-25
guardian-refs: ["G10-01 — What is an Audit", "G10-03 — Audit Evidence", "G10-04 — Conducting the Audit", "G3-14 — Internal Audit", "G6-06 — The QSA"]
---

# G10-02 — Audit Planning and Preparation

> [!abstract] What This Note Covers
> By the end of this note, you will understand how to plan a security audit from initial scope definition through to the day the fieldwork begins — covering audit programme management, individual audit planning, scope and criteria definition, resource planning, pre-audit evidence preparation, and the documents an auditor produces before touching a single system.

---

## Why This Exists

Audits that are poorly planned produce poor results. A scope that is too narrow misses critical risks. A scope that is too broad wastes everyone's time on low-risk areas. Poorly defined criteria create disputes about what compliance means. Inadequate resource allocation means the auditor cannot complete the work thoroughly. Insufficient pre-audit preparation produces a fieldwork phase dominated by hunting for evidence that could have been organised in advance.

Good planning is the difference between an audit that finds what matters and an audit that finds what was easy to find. For ISO 27001 Lead Auditor candidates, audit planning methodology is one of the most heavily examined topics — the planning phase is where auditor competence is most visible.

---

## The Audit Programme

Before any individual audit, an organisation (for internal audits) or a certification body (for external audits) must have an **audit programme** — a planned schedule of audit activities designed to achieve specific assurance objectives over a defined period.

### What the Audit Programme Must Cover

ISO 19011 requires the audit programme to include:

**Objectives**: What must the audit programme achieve? For ISO 27001 internal audits, the objective is to provide management with assurance that the ISMS conforms to ISO 27001 requirements and is effectively implemented. For a PCI DSS internal audit programme, the objective is to maintain continuous assurance of compliance with applicable PCI DSS requirements.

**Scope**: Which management systems, processes, activities, or areas will be audited during the programme period? The programme must ensure that all ISMS requirements are audited over the programme cycle.

**Schedule**: When will each audit activity occur? How does the schedule align with business cycles, risk periods, and external audit milestones (e.g. internal audit before the annual surveillance audit)?

**Methods**: What audit methods will be used for each scheduled activity? (Document review, interviews, technical testing, sampling)

**Resource allocation**: Who will conduct each audit? What qualifications are required? How much time is allocated?

**Criteria and reference documents**: Against what criteria will each audit activity assess compliance?

**Risk-based prioritisation**: Higher-risk areas must receive more frequent and more intensive audit attention. A risk-based audit programme allocates resources proportionate to risk — not equally distributed across all ISMS processes.

### A Sample Annual Internal Audit Programme (ISO 27001)

| Quarter | Audit activity | Scope | Method | Duration | Auditor |
|---|---|---|---|---|---|
| Q1 | Access management process | User account lifecycle, access reviews, privileged access | Document review, sampling, interviews | 3 days | Internal auditor (independent of IT) |
| Q2 | Supplier security management | TPSP list, DPAs, supplier assessments, monitoring records | Document review, interviews | 2 days | Internal auditor |
| Q3 | Vulnerability management and patch compliance | Scan frequency, patch SLA compliance, exception register | Document review, technical sampling | 2 days | Internal auditor + IT security specialist |
| Q3 | Incident management | Incident log, GDPR breach register, post-incident reviews | Document review, sampling | 1.5 days | Internal auditor |
| Q4 | Full ISMS audit (pre-surveillance) | All clauses 4–10 and applicable Annex A controls | Full audit programme | 5 days | Lead internal auditor + support |

**Notes on programme design:**
- The full pre-surveillance audit (Q4) covers everything; quarterly targeted audits maintain continuous assurance
- Access management is scheduled early (Q1) as it is high-risk and frequently changing
- Q4 full audit is timed to complete 6–8 weeks before the annual surveillance audit, allowing time to address any findings

---

## Planning an Individual Audit

Once a specific audit is scheduled in the programme, detailed planning for that audit begins. ISO 19011 identifies the planning activities required before fieldwork begins.

### Step 1: Define Audit Objectives

What specific questions must this audit answer?

**For an access management audit:**
- Are access rights granted only based on documented business need?
- Are access reviews conducted at the required frequency for all systems?
- Are accounts deprovisioned within the required timeframe on departure?
- Are privileged accounts subject to more frequent review?
- Are MFA requirements being enforced across all in-scope systems?

Specific objectives direct the evidence collection strategy. An audit with vague objectives ("check that access management is OK") produces vague findings.

### Step 2: Define Audit Scope

What is in scope and what is explicitly excluded?

**Scope dimensions:**
- **Organisational scope**: Which business units, teams, or functions are included?
- **System scope**: Which systems, platforms, or applications are covered?
- **Process scope**: Which specific processes are being audited?
- **Temporal scope**: What time period does the audit cover? (Current state for design; a defined period for operating effectiveness)
- **Geographic scope**: Which sites or locations are included?

**Explicit exclusions**: If something that could reasonably be expected to be in scope is excluded, state why. "The development environment is excluded from this audit — a dedicated development security audit is scheduled separately in Q3."

### Step 3: Define Audit Criteria

Against what requirements will the audit assess compliance?

For an ISO 27001 internal audit, criteria typically include:
- Relevant ISO 27001 clauses (e.g. for access management: Clauses 5.3, 7.2, 8.1, and Annex A controls A.5.15–A.5.18, A.8.2–A.8.5)
- The organisation's own documented policies and standards (Access Control Policy, Password Standard, MFA Standard)
- Any contractual or regulatory requirements applicable to the area (PCI DSS Requirement 7 and 8 if the area includes CDE systems; GDPR Article 32 if personal data access is involved)

**Why criteria matter**: Findings must be expressed as deviations from criteria. "MFA is not enforced for CDE access" is a finding against PCI DSS Requirement 8.4.2 AND the organisation's own MFA Standard. The criteria tell the auditor what "compliance" looks like and enable objective comparison between actual state and required state.

### Step 4: Assess Auditee Risk (Risk-Based Scoping)

Before planning the evidence collection, assess the risk level of the area being audited:

**Higher-risk indicators** (warrant more intensive audit effort):
- Previous audit findings in this area (unresolved or recently resolved)
- Significant changes since the last audit (new system, new process, new personnel)
- High-criticality area (access management for privileged accounts; CDE systems)
- Known industry threats relevant to this area (sector-specific attack campaigns)
- Low maturity indicators (immature process; inconsistent compliance in past assessments)

**Lower-risk indicators** (warrant proportionate but lighter effort):
- Clean previous audit results in this area
- No significant changes
- Low-criticality area
- High maturity indicators

Risk assessment informs: sample sizes (larger samples for higher-risk areas); depth of technical testing; interview depth; and time allocation.

### Step 5: Determine Audit Methods

Select the audit methods appropriate to each area:

**Document review**: Review policies, standards, procedures, and records against the defined criteria. Most efficient for assessing documentation completeness and design.

**Interviews**: Structured conversations with process owners and operators to understand how processes actually work — comparing described practice against documented procedures. Critical for identifying design vs reality gaps.

**Observation**: Directly observe processes in operation — physical security walkthroughs, system demonstrations, operational activities. Most reliable for physical controls and process adherence.

**Technical testing**: Direct configuration review, log sampling, automated scanning. Most reliable for technical control effectiveness.

**Sampling**: Statistical sampling of populations (user accounts, change records, access reviews) to test consistent control operation. Essential for any control applied to large populations.

**Correlation testing**: Comparing outputs from multiple evidence sources to verify consistency. If the provisioning procedure says MFA is set up during account creation, but the MFA report shows 15% of accounts without MFA, these two data sources are inconsistent — the discrepancy warrants investigation.

### Step 6: Develop the Audit Plan

The **audit plan** is the formal document that communicates the planned audit to the auditee and the audit team. It typically includes:

**Basic information:**
- Audit reference number and title
- Audit dates (fieldwork start and end; reporting deadline)
- Lead auditor name; team members (if applicable)
- Auditee (organisation, department, or function being audited)
- Audit sponsor (who authorised this audit)

**Scope, objectives, and criteria**: As defined in steps 1–3.

**Audit schedule**: A day-by-day (or half-day) schedule of activities:

| Date/Time | Activity | Participants |
|---|---|---|
| Day 1, 09:00 | Opening meeting | Lead auditor, auditee, IT Manager |
| Day 1, 10:00–12:00 | Document review: Access Control Policy, MFA Standard, Access Review Procedure | Lead auditor |
| Day 1, 13:00–15:00 | System demonstration: Account provisioning in Azure AD; MFA enrollment process | Lead auditor + IT Operations |
| Day 1, 15:00–16:30 | Interview: IT Operations Manager (account lifecycle management) | Lead auditor + IT Operations Manager |
| Day 2, 09:00–12:00 | Evidence sampling: 30 user accounts — verify MFA status, role assignments, access review completion | Lead auditor + read-only access to Azure AD |
| Day 2, 13:00–14:30 | Evidence sampling: Last 20 departures — verify deprovisioning timestamps vs departure dates | Lead auditor + HR records access |
| Day 2, 14:30–16:00 | Working paper review and finding consolidation | Lead auditor |
| Day 3, 09:00–11:00 | Closing meeting preparation; draft findings | Lead auditor |
| Day 3, 11:00–12:00 | Closing meeting | Lead auditor, auditee, IT Manager, CISO |

**Resource requirements:**
- What access does the auditor need? (Systems, records, personnel)
- What documentation should the auditee prepare in advance?

**Confidentiality statement**: How will audit evidence and findings be protected?

**Report delivery timeline**: When will the final report be delivered?

### Step 7: Pre-Audit Communication

The audit plan is shared with the auditee before the audit begins. Pre-audit communication serves several purposes:

**Preparation**: The auditee knows what documents and evidence to have ready. This reduces fieldwork time spent waiting for evidence and improves the quality of evidence reviewed.

**Access**: IT, HR, and system owners are notified to provide access as required. Nothing is more disruptive than arriving at an audit with no access to the systems needed.

**Logistics**: Interview scheduling, room booking, travel arrangements.

**Scope confirmation**: The auditee confirms scope is accurately described or flags any clarifications needed.

**The transparency principle**: Good audits are not surprise inspections (for planned management system audits). The auditee should know what is being examined, what criteria apply, and what evidence will be requested. Transparency does not undermine the audit — it enables better preparation and more productive fieldwork.

---

## Pre-Audit Evidence Preparation (Auditee Side)

From the auditee's perspective, effective preparation for an audit significantly reduces stress and produces better outcomes. A well-prepared organisation is more likely to receive accurate findings (fewer false positives from missing evidence that actually exists) and to engage more productively with the auditor.

### Organising Evidence

**Map evidence to audit criteria**: For each criterion in the audit scope, identify what evidence demonstrates compliance. Organise this evidence in a structured folder or SharePoint site that mirrors the audit criteria.

**Example structure for access management audit:**
```
/Audit-Evidence/Access-Management-2026-Q1/
├── A.5.15-Access-Control/
│   ├── Access-Control-Policy-v2.3.pdf
│   └── Access-Control-Policy-Review-Record-2025-12.pdf
├── A.5.16-Identity-Management/
│   ├── Account-Inventory-Export-2026-03-15.xlsx
│   └── Identity-Provider-Configuration-Screenshot.png
├── A.5.17-Authentication/
│   ├── Password-Standard-v1.4.pdf
│   └── MFA-Enrollment-Report-2026-03-15.pdf
├── A.5.18-Access-Rights/
│   ├── Access-Review-Q1-2026-Finance.xlsx
│   ├── Access-Review-Q1-2026-IT.xlsx
│   ├── Access-Review-Q4-2025-Finance.xlsx
│   └── Offboarding-Log-Q4-2025-Q1-2026.xlsx
└── A.8.2-Privileged-Access/
    ├── Privileged-Account-List-2026-03.xlsx
    └── PAM-Configuration-Evidence.pdf
```

**Evidence currency**: Evidence must be current. A policy document that was last reviewed 18 months ago and shows that date on the cover will be flagged by the auditor. Ensure all evidence reflects the current period.

**Evidence completeness**: For population-based evidence (access reviews, training completion), ensure the complete population is covered — not just the easy examples. Partial evidence creates adverse inferences.

**Evidence authenticity**: Evidence should be system-generated where possible (reports from the identity provider, not manually prepared spreadsheets). System-generated evidence is harder to fabricate and carries implicit timestamps.

### Preparing Staff for Interviews

Staff who will be interviewed should:
- Know that an audit is happening (not be surprised)
- Understand their role in the process
- Be able to describe what they actually do — not recite policy text
- Know that honest answers are required and expected
- Know who to refer to if they are asked something they cannot answer

**The coaching trap**: Some organisations "coach" staff to give specific answers during audit interviews. Experienced auditors detect scripted answers — they ask follow-up questions that the script does not cover; they ask the same question in different ways; they compare interview responses across multiple interviewees. Inconsistencies between coached answers are a significant finding. Train staff to be honest, not to give rehearsed responses.

---

## The Opening Meeting

Every formal audit begins with an opening meeting — a structured introduction that sets the tone and establishes shared understanding.

**Opening meeting agenda:**
1. Introductions (auditor and audit team; key auditee representatives)
2. Confirmation of audit scope, objectives, and criteria
3. Audit schedule overview
4. Logistics (access required; interview schedule; working space)
5. Confidentiality — how findings will be handled before the report is issued
6. Communication during the audit — how questions and issues will be raised
7. Closing meeting schedule — when and how findings will be presented
8. Questions from the auditee

**The opening meeting tone**: The opening meeting establishes whether the audit will be a collaborative process or an adversarial one. Skilled auditors set a professional, respectful tone — communicating that the purpose is accurate assessment, not fault-finding for its own sake, and that the auditee's knowledge and cooperation are valued.

**Opening meeting evidence**: The opening meeting should be documented — date, attendees, topics covered. This is part of the audit record.

---

## Sample Sizes and Statistical Validity

For any control applied to a population (user accounts, transactions, access reviews, change records), the auditor must select a sample. Sample selection methodology affects the reliability of conclusions.

### Sample Size Guidance

ISO 19011 does not specify mandatory sample sizes — auditors use professional judgment. Practical guidance:

| Population size | Minimum sample (representative; no anomalies) | Expanded sample (if anomalies found) |
|---|---|---|
| < 10 | 100% (test all) | N/A |
| 10–50 | 10–20 | 25–40 |
| 51–250 | 20–30 | 40–60 |
| 251–1000 | 25–40 | 50–75 |
| > 1000 | 40–60 | 75–100 |

**The anomaly expansion rule**: If the initial sample reveals anomalies (exceptions to the expected control operation), expand the sample to assess whether the exception is isolated or systemic. A 5% exception rate in an initial sample of 20 may be isolated; in an expanded sample of 60, a sustained 5% exception rate indicates a systemic control failure.

### Random vs Directed Sampling

**Random sampling**: Selecting items from the population without bias — typically using a random number generator or systematic selection (every 10th item). Produces the most statistically representative sample.

**Risk-directed sampling**: Biasing the sample toward higher-risk items within the population (e.g. privileged users, recently joined accounts, accounts with unusual access patterns). Appropriate for assessing specific risk hypotheses but not for drawing population-wide conclusions.

**The "cherry-pick" trap**: Allowing the auditee to select which samples the auditor reviews. The auditor must select samples independently — not from a list provided by the auditee. Auditee-selected samples will systematically exclude the exceptions.

---

## Common Mistakes and Failures in Audit Planning

**1. Undefined or vague criteria.**
"We'll audit whether security is in place" — no specific criteria, no defined requirements against which to measure. The audit produces subjective observations rather than findings against criteria.

**2. No risk-based prioritisation.**
Equal time allocated to a critical access management process and a low-risk clear desk policy. The audit finds everything fine at the clear desk checks but misses significant access management failures because insufficient time was allocated.

**3. Audit plan not shared with auditee.**
The auditor arrives and requests documents and access that the auditee has not prepared. Fieldwork is delayed; critical evidence is unavailable; the audit produces an incomplete picture.

**4. Sample selection delegated to the auditee.**
"Please provide examples of your access reviews from the last quarter." The auditee provides the three best-executed reviews from the quarter. The six poorly executed reviews (including one that was 3 months late) are not seen by the auditor.

**5. Audit programme not risk-based.**
All ISMS areas are audited once per year regardless of risk. The access management process (highest risk, most change) gets the same annual audit as the physical security process (low change, low risk). Higher-risk areas need more frequent attention.

**6. Audit scope not confirmed with key stakeholders.**
The auditor assumes that "all systems within the ISMS scope" covers the cloud infrastructure. The CISO assumed cloud was excluded because a "cloud security audit" was planned separately. The fieldwork reveals the misunderstanding — at significant cost to both parties.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Audit planning is one of the most heavily examined areas in the Lead Auditor qualification. The exam tests: audit programme requirements (ISO 19011 Clause 5); audit plan components; scope and criteria definition; sample size judgment; and opening meeting conduct.
- Common exam scenario: "The auditee has offered to select the sample of user accounts for the auditor to review. What should the auditor do?" Answer: The auditor must select their own sample independently — allowing the auditee to select samples compromises the evidence-based approach principle.

**CISM:**
- Domain 3 (Security Programme) — understanding the audit programme design and its role in the ISMS management cycle.

**CISSP:**
- Domain 6 (Security Assessment and Testing) — audit planning methodology, sample selection, and the distinction between planned audits and surprise inspections.

---

## GUARDIAN's Take

Audit planning is where the audit's value is determined — before a single document is reviewed or a single interview conducted. The scope defines what can be found; the criteria determine what "finding" means; the sample sizes determine how confidently conclusions can be drawn; the risk assessment determines whether effort goes where it matters most.

I have seen organisations spend enormous resources on formal audits that found nothing meaningful — because the scope was too narrow, the criteria too vague, and the time too limited to examine anything in depth. And I have seen lean, focused audits of a single process area that produced more actionable insight than a full-scope assessment three times their size — because the planning was sharp, the criteria precise, and the method matched to the specific risk.

Invest in the planning. A well-planned audit is efficient in fieldwork, credible in findings, and actionable in outcomes. An unplanned audit is expensive in time, vague in findings, and frustrating for everyone involved.

The opening meeting sets the tone. The plan determines the value. Get both right.

---
*Module: Module 10 — Audit and Assurance | Guardian Curriculum*
