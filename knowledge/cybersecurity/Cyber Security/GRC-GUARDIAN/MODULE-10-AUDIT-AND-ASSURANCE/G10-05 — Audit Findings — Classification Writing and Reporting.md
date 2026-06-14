---
tags: [guardian, grc, module-10, audit-findings, nonconformity, finding-statements, audit-report]
module: 10
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-25
guardian-refs: ["G10-01 — What is an Audit", "G10-03 — Audit Evidence", "G10-04 — Conducting the Audit", "G10-06 — Audit Report Writing", "G3-15 — Nonconformities — Major Minor Observations"]
---

# G10-05 — Audit Findings — Classification, Writing, and Reporting

> [!abstract] What This Note Covers
> By the end of this note, you will understand the complete methodology for classifying audit findings, writing professional finding statements, producing positive findings and observations, and structuring findings for inclusion in the audit report — with worked examples for each finding type.

---

## Why This Exists

The finding is the audit's primary output. Everything else — the planning, the evidence collection, the interviews, the working papers — exists to produce findings that are accurate, specific, classified correctly, and actionable. A well-written finding tells the auditee exactly what is wrong, exactly what evidence supports that conclusion, exactly which requirement is not being met, and what the urgency of remediation is. A poorly written finding tells them none of these things.

Finding quality is also the primary criterion by which auditor competence is evaluated. In the ISO 27001 Lead Auditor examination, the candidate's ability to classify findings correctly and write them professionally accounts for a large proportion of the marks. In professional practice, findings that cannot withstand challenge damage the auditor's credibility and the audit programme's value.

This note provides the complete classification and writing framework, with worked examples that can be used as templates.

---

## The Finding Classification Framework

All audit findings fall into one of four categories. The classification is not subjective — it follows from the evidence against the criteria.

### Category 1: Major Nonconformity

**Definition**: The absence of a required element, or a systemic failure of a required process, that raises significant doubt about the management system's ability to achieve its intended outcomes.

**Classification triggers — any of the following:**
- The required element is completely absent (no BIA exists; no internal audit has ever been conducted; no risk register exists)
- The failure is systemic — the same type of failure occurs across multiple instances, indicating a process failure rather than an isolated exception
- Multiple related minor nonconformities collectively demonstrate a systemic failure
- The failure directly undermines a fundamental requirement of the standard (risk assessment not conducted in scope; SoA not produced)
- The failure creates an unmanaged significant risk (CDE systems accessible from the corporate network without any segmentation controls)

**Effect on certification**:
- External certification audit: Major NCs typically prevent certification until closed; at surveillance they may result in certificate suspension
- Internal audit: Requires immediate escalation to CISO/management and priority corrective action

---

### Category 2: Minor Nonconformity

**Definition**: An isolated or partial failure to fulfil a requirement that does not fundamentally undermine the management system's ability to achieve its intended outcomes.

**Classification triggers — all of the following:**
- The failure is isolated — occurring in one or few instances, not systematically across the process
- The requirement is partially met — the control exists and generally operates; the gap is in specific instances
- The failure is of limited impact — it does not immediately expose the organisation to significant unmanaged risk
- The failure is correctable — a specific corrective action can address it

**Classification rule**: When uncertain between major and minor, apply the systemic test: does this failure indicate a process-level breakdown, or is it an exception in an otherwise functioning process?

---

### Category 3: Observation (Opportunity for Improvement)

**Definition**: A statement of fact or a recommendation arising from the audit that is not a nonconformity but represents a situation that, if unaddressed, could develop into a future nonconformity, or an area where the management system could be improved.

**Classification triggers:**
- The standard requirement is currently met
- But the current approach is heading toward non-compliance (a practice that is currently compliant but deteriorating)
- Or a better practice exists that would strengthen the control
- Or a risk was identified that is not yet a standard violation but is worth managing

**Important**: Observations are not findings against standard requirements — they do not require corrective action as a compliance matter. However, a responsible organisation treats observations seriously; ignored observations frequently become nonconformities at the next audit.

---

### Category 4: Positive Finding / Strength

**Definition**: A control or process area that is operating particularly effectively, demonstrating maturity above what the standard requires or above what is commonly seen.

**Why positive findings matter**: Audit reports that contain only problems create a misleading picture. Identifying and reporting genuine strengths provides a balanced view, acknowledges effort, and helps organisations understand what good looks like in their own context. They also serve as reference points for improving other areas.

**Examples**: "The access review process demonstrates quarterly execution with business owner participation, documented change outcomes, and same-day implementation of access modifications — exceeding the standard's requirements and representing a best-practice model."

---

## The Classification Decision Tree

```
Is there a "shall" (mandatory) requirement being tested?
    │
    NO → Is there a recommendation or risk of future non-compliance?
            YES → Observation
            NO → Conformance (no finding)
    │
    YES → Is the requirement being met?
    │
    YES → Is there an opportunity for improvement?
            YES → Observation
            NO → Conformance (no finding)
    │
    NO → Is the failure:
        ├── Complete absence of the required element?        → Major NC
        ├── Systemic across multiple instances?              → Major NC
        ├── Multiple related failures at the same root?      → Major NC
        ├── Undermines the system's intended outcomes?       → Major NC
        └── Isolated, partial, limited impact?              → Minor NC

When borderline major/minor: Default to major if the failure
relates to core system requirements (Clauses 6-8 of ISO 27001)
or if severity is genuinely uncertain.
```

---

## Writing Professional Finding Statements

A professional finding statement must satisfy five criteria:

1. **Specific**: Names the exact requirement, the exact evidence, the exact gap
2. **Factual**: Describes only what was observed — no opinion, inference, or editorial
3. **Evidence-referenced**: Every assertion is traceable to specific evidence in working papers
4. **Criterion-referenced**: States exactly which requirement is not being met
5. **Actionable**: Clear enough that the auditee knows precisely what must change

### The Finding Statement Template

```
FINDING REFERENCE: [Unique ID, e.g. INT-2026-004]
CLASSIFICATION: [Major NC / Minor NC / Observation]
CRITERION: [Specific standard clause, Annex A control, policy section, or regulation]

STATEMENT:
[Specific, factual description of the gap. Include:
 - What is required (from the criterion)
 - What was found (the specific evidence)
 - The gap between required and actual
 Include specific numbers, dates, account IDs, system names as appropriate]

EVIDENCE:
[Specific list of evidence reviewed that supports this finding:
 - Document name, version, date
 - System query and date run
 - Interview subject and date
 - Observation date and context]

CLASSIFICATION RATIONALE:
[Brief explanation of why this is classified as Major/Minor/Observation:
 - Why it is systemic/isolated
 - Why it does/does not undermine the system's intended outcomes]
```

---

## Worked Examples: Finding Statements

### Example 1 — Major Nonconformity

```
FINDING REFERENCE: INT-2026-001
CLASSIFICATION: Major Nonconformity
CRITERION: ISO 27001:2022 Clause 8.2 — Information security risk assessment;
           ISO 27001:2022 Clause 6.1.2 — risk assessment methodology

STATEMENT:
The organisation's ISMS risk assessment methodology (Risk Assessment Procedure 
v2.1, Section 4.3) requires the risk register to be reviewed and updated within 
30 days of any significant change to the IT environment.

The following significant changes have occurred since the last risk assessment 
update (dated 2024-11-15):
a) Full migration of production infrastructure to Microsoft Azure, completed 
   June 2025
b) Implementation of Microsoft 365 Copilot across all business units, 
   completed September 2025  
c) Acquisition of DataSec Ltd (15 staff; integrated IT network), completed 
   November 2025

The current risk register (v7.2, dated 2024-11-15) contains no entries 
addressing:
- Cloud misconfiguration risks for Azure infrastructure
- AI data processing risks associated with M365 Copilot
- Risks introduced by the DataSec Ltd integration

As a result, the ISMS is managing risks for an IT environment that has materially 
changed and 3 of the 93 SoA controls (A.5.23 Cloud services; A.8.11 Data masking; 
A.5.7 Threat intelligence for AI threats) are listed as "not yet assessed" for the 
current environment.

This constitutes a systemic failure of the risk assessment process across multiple 
change events and raises significant doubt about the ISMS's ability to achieve its 
intended outcome of managing current information security risks.

EVIDENCE:
1. Risk Assessment Procedure v2.1 (Section 4.3 — change-triggered review requirement)
2. Risk Register v7.2 dated 2024-11-15 (most current version; confirmed by CISO 
   interview 2026-04-22)
3. Azure migration project completion record dated 2025-06-30 (provided by IT Director)
4. M365 Copilot deployment record dated 2025-09-18 (provided by IT Director)
5. DataSec Ltd acquisition completion notice dated 2025-11-03 (provided by CISO)
6. SoA v5.4 dated 2024-11-15 (showing "not yet assessed" status for A.5.23, A.8.11)
7. Interview: CISO (A. Thompson), 2026-04-22 — confirmed no risk assessment update
   had been conducted following any of the three changes

CLASSIFICATION RATIONALE:
This is a major nonconformity because:
a) The failure is systemic — three separate change events each required a risk 
   assessment update; none triggered one
b) The requirement is one of the fundamental purposes of the ISMS (managing current 
   risks); a risk register that does not reflect the current environment cannot 
   serve this purpose
c) The failure affects multiple SoA control decisions that have not been reviewed
   for the current environment
```

---

### Example 2 — Minor Nonconformity

```
FINDING REFERENCE: INT-2026-003
CLASSIFICATION: Minor Nonconformity
CRITERION: ISO 27001:2022 Annex A 5.18 — Access rights;
           Access Control Policy v2.3 Section 3.7 (access reviews for standard 
           user accounts: quarterly minimum)

STATEMENT:
The Access Control Policy v2.3 requires quarterly access reviews for all standard 
user accounts. A sample of access review records for Q1 2026 (January–March 2026) 
was requested. Review records were provided for 6 of 8 business systems that 
contain standard user accounts:

Systems with Q1 2026 review evidence:
- Finance ERP (reviewed 2026-02-14)
- HR System (reviewed 2026-01-28)
- CRM (reviewed 2026-02-01)
- Email distribution groups (reviewed 2026-03-12)
- SharePoint access groups (reviewed 2026-02-08)
- Customer portal (reviewed 2026-01-15)

Systems without Q1 2026 review evidence:
- Project management platform (most recent review: 2025-07-14; 9 months ago)
- IT service desk system (most recent review: 2025-09-02; 7 months ago)

The project management platform and IT service desk system have not had access 
reviews conducted within the required quarterly interval. Combined, these systems 
have 47 user accounts that have not been reviewed in over 6 months.

The remaining 6 systems show consistent quarterly review activity; this is an 
isolated failure affecting 2 of 8 systems rather than a systemic breakdown of 
the access review programme.

EVIDENCE:
1. Access Control Policy v2.3 Section 3.7
2. Access review records for Q1 2026 — Finance, HR, CRM, Email, SharePoint, 
   Customer portal (all confirmed as reviewed within Q1 2026)
3. Project management platform access log — last review record dated 2025-07-14
   (accessed directly by auditor using read-only admin credentials 2026-04-22)
4. IT service desk system admin panel — last access review timestamp 2025-09-02
   (confirmed by system administrator, G. Patel, 2026-04-22)
5. Interview: IT Operations Manager (K. Sharma, 2026-04-22) — confirmed the two 
   systems were inherited from a subsidiary integration and "fell through the cracks 
   when we rebuilt the review schedule after the integration"

CLASSIFICATION RATIONALE:
Minor nonconformity because:
a) The failure is isolated to 2 of 8 systems (25%) — the remaining 75% demonstrate 
   consistent quarterly execution
b) The other 6 systems provide evidence that the access review process is 
   operationally functional
c) The root cause (systems missed when review schedule was rebuilt post-integration) 
   is specific and correctable
d) The 47 unreviewed accounts represent a risk but not an immediate critical exposure 
   — the systems are internal; no privileged accounts are involved
```

---

### Example 3 — Observation

```
FINDING REFERENCE: INT-2026-005
CLASSIFICATION: Observation (Opportunity for Improvement)
CRITERION: ISO 27001:2022 Annex A 6.3 — Information security awareness, 
           education and training (requirement currently met)

STATEMENT:
Security awareness training completion for 2025 was confirmed at 98.7% 
(all but 4 staff, who have been placed on a re-training plan). The training 
programme covers the required elements: IS policy, staff responsibilities, 
key threats, and incident reporting.

However, the current training module was last updated in October 2023 
(version 4.1, confirmed by HR Training Manager K. Patel, 2026-04-22). 
The training content does not address:
- AI-generated phishing (documented as a growing threat in the NCSC Annual 
  Review 2025, referenced in the threat intelligence register)
- Social engineering techniques targeting remote workers (significant 
  increase in UK incidents per NCSC Q4 2025 report)

Phishing simulation results for Q1 2026 show a 13% click rate — above 
the programme's own target of <5% and above the Q4 2025 rate of 9%, 
suggesting that current training content may not be preparing staff 
adequately for the current threat landscape.

While the training programme currently meets ISO 27001 Annex A 6.3 
requirements (content covers required topics; completion rate is high), 
the combination of outdated content and a deteriorating phishing simulation 
metric suggests that training effectiveness may be declining.

RECOMMENDATION:
Update training content to reflect current NCSC threat intelligence, with 
specific focus on AI-generated phishing and remote worker social engineering. 
Increase phishing simulation frequency from quarterly to monthly until the 
click rate falls below the 5% target. Consider adding a post-training 
assessment to measure understanding, not just completion.

EVIDENCE:
1. Security awareness training completion report 2025 (HR LMS export, 
   dated 2026-01-08) — 98.7% completion
2. Training module version 4.1 (last updated October 2023, confirmed by 
   K. Patel, HR, 2026-04-22)
3. Phishing simulation reports Q1–Q4 2025 and Q1 2026 (click rates: Q1 
   2025: 18%; Q2 2025: 14%; Q3 2025: 11%; Q4 2025: 9%; Q1 2026: 13%)
4. Threat intelligence register entry 2025-11-12 — NCSC report on 
   AI-generated phishing increase
```

---

### Example 4 — Positive Finding

```
FINDING REFERENCE: INT-2026-008
CLASSIFICATION: Positive Finding (Strength)
CRITERION: ISO 27001:2022 Annex A 5.19–5.22 — Supplier security management

STATEMENT:
The supplier security programme demonstrates a level of operational maturity 
that significantly exceeds what is commonly observed in organisations at 
this ISMS certification stage.

The programme includes:
a) A comprehensive supplier register of 94 active suppliers, tiered by risk 
   (Critical: 12; High: 23; Standard: 59), with named security leads for each
b) Annual security questionnaire assessments for all Critical and High-risk 
   suppliers, with evidence of completion for 34 of 35 suppliers due for 
   assessment in 2025 (97.1% completion)
c) On-site security assessment capability — two Critical suppliers were assessed 
   on-site in 2025, with documented findings and remediation tracking
d) ISO 27001 certificate verification for all Critical suppliers, with 
   certificate expiry dates tracked and renewal confirmed
e) Security incident notification SLA (24 hours) embedded in all Critical 
   and High-risk supplier contracts reviewed, with evidence of 3 supplier 
   notifications received and processed within the SLA in 2025

The programme directly supports A.5.19 (supplier relationships), A.5.20 
(supplier agreements), A.5.21 (ICT supply chain), and A.5.22 (monitoring 
and change management) and represents a best-practice implementation that 
could serve as a model for other programme areas.

EVIDENCE:
1. Supplier register (v3.2, dated 2026-03-01) — 94 suppliers; tiering confirmed
2. 2025 supplier assessment completion report — 34/35 completed
3. On-site assessment reports for Critical suppliers A and B (2025)
4. Sample of 5 Critical supplier contracts — all include 24-hour notification SLA
3. Supplier incident notification records for 2025 — 3 notifications received; 
   all actioned within 24 hours
```

---

## Common Finding Writing Errors

### Error 1: Combining the finding with the corrective action

**Wrong**: "The access reviews for the project management platform have not been completed. The IT team must immediately review all accounts on this system and remove inappropriate access."

**Why it's wrong**: The finding describes the gap; the corrective action is the auditee's responsibility, not the auditor's. Prescribing the corrective action in the finding is inappropriate.

**Right**: "The access reviews for the project management platform have not been completed within the required quarterly interval..." [The corrective action plan is completed separately by the auditee.]

### Error 2: Finding without criterion

**Wrong**: "MFA is not configured correctly."

**Why it's wrong**: "Correctly" according to what? Which requirement? What specifically is wrong?

**Right**: "MFA is not enforced for access to the Cardholder Data Environment, contrary to PCI DSS v4.0 Requirement 8.4.2 and the MFA Standard v1.4 Section 2.1..."

### Error 3: Opinion disguised as finding

**Wrong**: "The IT team does not take security seriously. Staff were observed using weak passwords and sharing credentials."

**Why it's wrong**: "Does not take security seriously" is an opinion. "Weak passwords" is unquantified. "Sharing credentials" requires specific evidence.

**Right**: "During the audit walkthrough (2026-04-22), two employees were observed with passwords written on sticky notes affixed to their monitors (Finance department, workstations 4 and 7). This is contrary to the Acceptable Use Policy v3.1 Section 4.2 which prohibits storing passwords in written, visible form."

### Error 4: Vague evidence reference

**Wrong**: "Review of access records showed that some accounts had not been properly reviewed."

**Why it's wrong**: Which records? What time period? How many accounts? What does "properly reviewed" mean?

**Right**: "A sample of 30 user accounts drawn from the active account list (dated 2026-04-22) showed that 4 accounts (13.3%) had last been reviewed more than 6 months ago (latest review dates: 2025-07-12, 2025-08-03, 2025-09-15, 2025-09-22), exceeding the quarterly review requirement in the Access Control Policy v2.3 Section 3.7."

### Error 5: Finding that cannot be tested for closure

**Wrong**: "The organisation does not have adequate security awareness."

**Why it's wrong**: What does "adequate" mean? How would the organisation demonstrate it has been remediated? There is no specific requirement against which to measure.

**Right**: "Annual security awareness training completion for 2025 was 72% (215 of 299 employees) as at the audit date of 2026-04-22, below the target of 100% completion by 31 December each year stated in the Security Awareness Training Procedure v1.2 Section 3.1."

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Finding classification and writing are among the most heavily tested skills in the Lead Auditor examination. Exam scenarios present evidence descriptions and ask candidates to: classify the finding (major/minor/observation); write the finding statement; justify the classification.
- Common exam traps: classifying a systemic failure as multiple minor NCs instead of one major NC; raising a nonconformity against a "should" statement (creating an observation instead); writing a finding that contains the corrective action; omitting the criterion reference.

**CISM:**
- Domain 3 (Security Programme) — understanding what audit findings mean, how they are classified, and how to respond to them appropriately.

**CISSP:**
- Domain 6 (Security Assessment and Testing) — audit finding types, classification criteria, and the content of audit reports.

---

## GUARDIAN's Take

The finding statement is the most important document an auditor produces. Everything else — the planning, the evidence collection, the working papers — serves the finding. The finding must be able to stand alone: someone who was not present for the audit should read it and understand exactly what was found, why it matters, and what must change.

The discipline that produces great findings is specificity. Not "passwords are weak" but "Account ID [X] was found using the password 'Welcome1!' which does not meet the 12-character minimum in the Password Standard v1.4 Section 1.2." Not "access reviews are overdue" but "the project management platform has not had an access review since 2025-07-14 — 9 months beyond the quarterly requirement."

Specificity is not pedantry. It is the professional obligation to tell the truth precisely enough that it cannot be misunderstood, disputed on the basis of vagueness, or used to justify inadequate corrective action. A vague finding produces a vague corrective action. A specific finding produces a specific corrective action. And specific corrective actions are what improve security.

Write every finding as if it will be challenged. Write it so that when challenged, the evidence is incontrovertible, the criterion is unambiguous, and the conclusion is the only reasonable interpretation of the facts.

---
*Module: Module 10 — Audit and Assurance | Guardian Curriculum*
