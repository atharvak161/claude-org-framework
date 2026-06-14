---
tags: [guardian, grc, module-3, iso27001, nonconformity, major-nc, minor-nc, observation, corrective-action]
module: 3
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G3-09 — ISO 27001 Clause 10 — Improvement", "G3-13 — The Certification Journey", "G3-14 — Internal Audit", "G3-16 — Management Review", "G10-05 — Audit Findings", "G10-07 — Corrective Action and Follow-Up"]
---

# G3-15 — Nonconformities — Major, Minor, Observations

> [!abstract] What This Note Covers
> By the end of this note, you will understand the precise definitions of major nonconformity, minor nonconformity, and observation — how they differ, how to classify them correctly, what response each requires, how they affect certification, and how to write them professionally.

---

## Why This Exists

The classification of audit findings is one of the most consequential decisions an auditor makes. A major nonconformity can halt certification or jeopardise an existing certificate. A minor nonconformity requires a documented corrective action. An observation is a recommendation. Getting the classification wrong — in either direction — has real consequences.

Overclassifying findings (calling a minor NC a major NC when it should not be) creates unnecessary alarm, triggers disproportionate corrective action, and damages the auditor's credibility. Underclassifying findings (recording a major NC as a minor NC or observation when the systemic failure warrants the higher classification) provides false assurance and leaves a genuine weakness unaddressed.

This note provides the precise classification criteria, multiple worked examples, and the professional writing standards for audit findings — both for internal auditors conducting ISO 27001 internal audits and for the Lead Auditor examination, which tests finding classification extensively through case study exercises.

---

## The Three Categories of Audit Finding

### 1. Major Nonconformity

**Definition**: The absence or total breakdown of a requirement of ISO 27001, or a situation that raises significant doubt about the ISMS's ability to achieve its intended outcomes.

ISO/IEC 17021-1 (requirements for certification bodies) defines a major nonconformity as: *"a nonconformity that affects the capability of the management system to achieve the intended results."*

**Classification criteria — any of the following indicate a major NC:**

| Indicator | Example |
|---|---|
| Complete absence of a required ISMS element | No risk assessment has ever been conducted; no internal audit programme exists; no management review has been held in the certification period |
| Systematic failure across multiple instances | 15 of 20 sampled critical CVEs unpatched beyond the 30-day SLA — not isolated, systemic |
| Multiple related minor NCs indicating systemic failure | Separate minor NCs in access management, incident reporting, and supplier assessment that all stem from the same root cause (no management oversight of ISMS processes) |
| Failure that directly enables a significant risk | MFA is absent for all administrative accounts (not just a sample) on internet-facing systems |
| Failure of a fundamental ISMS requirement | Risk assessment methodology not documented; SoA not produced; scope not defined |
| Deliberate circumvention or misrepresentation | Evidence produced for the audit that does not reflect actual practice |

**Effect on certification:**
- At Stage 2: major NCs typically prevent certification until closed. The CB will not issue a certificate while a major NC is outstanding.
- At surveillance/recertification audit: major NCs may result in suspension or withdrawal of the certificate if not addressed within the timeframe agreed with the CB.
- At internal audit: major NCs trigger mandatory escalation to senior management and urgent corrective action.

---

### 2. Minor Nonconformity

**Definition**: A nonconformity that does not affect the overall capability of the ISMS to achieve its intended results. An isolated or partial failure to fulfil a requirement.

**Classification criteria — all of the following apply for a minor NC:**

| Indicator | Explanation |
|---|---|
| Isolated, not systemic | One or a few instances of failure; not a pattern across multiple instances |
| Partial, not total | The requirement is met in most respects; one element is deficient or incomplete |
| Limited impact | The failure does not fundamentally undermine the ISMS's ability to manage risk effectively |
| No direct creation of significant risk | The gap is real but does not immediately expose the organisation to significant unmanaged risk |

**Effect on certification:**
- At Stage 2: minor NCs do not prevent certification. The CB may issue the certificate with a condition that minor NCs are closed and evidence provided within a defined timeframe (typically 30–60 days), verified at the first surveillance audit.
- At surveillance audit: multiple unaddressed minor NCs from a prior audit period may be elevated to a major NC if they collectively indicate systemic failure.
- At internal audit: minor NCs trigger standard corrective action (root cause analysis + corrective action plan + effectiveness verification).

---

### 3. Observation (Opportunity for Improvement)

**Definition**: A statement of fact or a recommendation arising from the audit that is not a nonconformity but represents a situation that, if not addressed, could result in a future nonconformity, or an area where the ISMS could be improved.

Observations are sometimes called:
- Opportunities for Improvement (OFI)
- Recommendations
- Areas of Concern (pre-nonconformity state)

**Classification criteria:**

| Indicator | Explanation |
|---|---|
| Requirement currently met | The standard requirement is being satisfied |
| But approaching threshold | Continued at current trajectory, it will become a nonconformity |
| Or sub-optimal practice | The requirement is met but could be done more effectively |
| Or good practice recommendation | Something the auditor has observed in more mature ISMSs that would benefit this organisation |

**Effect on certification:**
Observations do not affect certification and do not require formal corrective action. However, a responsible auditee takes observations seriously — an observation from an internal audit that is ignored and later becomes a nonconformity will reflect poorly on the ISMS management.

---

## The Classification Decision Framework

When a finding is identified, apply this decision tree:

```
Is there evidence that a specific ISO 27001 "shall" requirement 
is not being met?
    │
    NO → Is there a risk of future non-compliance or an 
         area for improvement?
              │
              YES → OBSERVATION
              NO  → CONFORMANCE (no finding)
    │
    YES → Is the failure:
    │      - Complete absence of a required element?
    │      - Systemic across multiple instances?
    │      - Combination of related minor failures?
    │      - Directly causing significant unmanaged risk?
    │      - Affecting the ISMS's ability to achieve its intended outcomes?
    │              │
    │             YES → MAJOR NONCONFORMITY
    │              │
    │              NO → Is the failure:
    │                   - Isolated (one or few instances)?
    │                   - Partial (requirement mostly met)?
    │                   - Limited in impact?
    │                           │
    │                          YES → MINOR NONCONFORMITY
    │
    └── (If borderline: default to the more conservative classification)
```

**The borderline principle**: When genuinely uncertain between major and minor, classify as major if the finding relates to:
- Clause 6 (risk assessment and treatment — the core of the ISMS)
- Clause 9 (performance evaluation — the organisation's self-awareness mechanism)
- Any finding that, if unaddressed, would leave the organisation unable to demonstrate ISMS effectiveness

When uncertain between minor and observation, classify as minor if there is clear evidence of a specific requirement not being met (even partially).

---

## Writing Professional Finding Statements

Every finding — whether major NC, minor NC, or observation — must be written in a professional, factual, evidence-based format. The finding statement is a legal-quality record of what was found and why.

### The Finding Statement Structure

A complete finding statement contains five elements:

**1. Finding reference**: Unique identifier (e.g. INT-2026-007; CB-2026-NC-002)

**2. Classification**: Major NC / Minor NC / Observation

**3. Clause/control reference**: Which specific ISO 27001 clause or Annex A control requirement is not met

**4. Statement of nonconformity**: The specific gap, described factually with evidence

**5. Evidence reviewed**: The specific documents, records, or observations that support the finding

---

### Finding Statement Examples

#### Example 1 — Major Nonconformity

```
FINDING REFERENCE: INT-2026-001
CLASSIFICATION: Major Nonconformity
CLAUSE REFERENCE: ISO 27001:2022 Clause 8.2 — Information security 
risk assessment

STATEMENT OF NONCONFORMITY:
The organisation's risk assessment methodology requires the risk register 
to be reviewed and updated following significant changes to the IT 
environment. The organisation completed a migration of all production 
infrastructure to Microsoft Azure between March and June 2025. No risk 
assessment update has been conducted since January 2025, predating the 
migration. 

As a result, the risk register does not reflect:
- 47 production systems now hosted in Azure (previously on-premise)
- Cloud-specific risks including misconfiguration, shared responsibility 
  model, and identity federation
- 12 new Annex A controls applicable to cloud services (A.5.23) that 
  were not included in the SoA prior to cloud adoption

The ISMS is currently managing risks for an IT environment that no 
longer exists. This constitutes a systemic failure of Clause 8.2 and 
raises significant doubt about the ISMS's ability to achieve its 
intended outcomes.

EVIDENCE REVIEWED:
- Risk assessment methodology v2.0 (Section 4.3: "A risk assessment 
  update shall be conducted within 30 days of any significant change 
  to the IT environment")
- Risk register dated 2025-01-15 (most recent version; references 
  on-premise infrastructure throughout)
- Azure migration project completion record dated 2025-06-30
- SoA v3.1 dated 2024-12-01 (A.5.23 listed as "Not applicable — 
  no cloud services used"; not updated post-migration)
```

#### Example 2 — Minor Nonconformity

```
FINDING REFERENCE: INT-2026-004
CLASSIFICATION: Minor Nonconformity
CLAUSE REFERENCE: ISO 27001:2022 Clause 7.2 — Competence / 
Annex A.6.3 — Information security awareness, education, and training

STATEMENT OF NONCONFORMITY:
The organisation's security awareness training programme requires all 
staff to complete annual security awareness training by 31 December 
each year. Of 25 staff members who joined the organisation in the 
period June–December 2025, training records show that 4 (16%) had not 
completed the annual training by the audit date of 2026-04-17, now 
more than 4 months past the required completion date.

The remaining 21 new joiners (84%) completed training within the 
required period. This is an isolated partial failure; the training 
programme itself is functioning effectively for the majority of staff.

EVIDENCE REVIEWED:
- Security awareness training policy v1.3 (Section 3: "All staff 
  shall complete annual security awareness training by 31 December 
  each year")
- LMS completion report dated 2026-04-15 (showing 4 outstanding 
  completions from the June–December 2025 intake)
- Training records for 21 staff who completed (provided and verified)
```

#### Example 3 — Observation

```
FINDING REFERENCE: INT-2026-009
CLASSIFICATION: Observation (Opportunity for Improvement)
CLAUSE REFERENCE: ISO 27001:2022 Clause 7.3 — Awareness

STATEMENT OF OBSERVATION:
The organisation conducts annual security awareness training with a 
completion rate of 97% (confirmed via LMS records). The training 
programme covers the required elements: the information security policy, 
staff contributions to ISMS effectiveness, and consequences of 
non-compliance.

However, the training content has not been updated since 2023 and does 
not reflect threat intelligence from 2024–2025, including the significant 
increase in AI-generated phishing attacks targeting the financial services 
sector (NCSC Threat Report 2025). The current training may not adequately 
prepare staff for the current phishing threat landscape.

Additionally, phishing simulation results show a click rate of 11% in Q4 
2025, which is above the organisation's own target of 5%. While not yet 
a nonconformity, the combination of outdated training content and a 
declining phishing simulation performance suggests that training 
effectiveness should be reviewed before it falls into non-compliance 
with Clause 7.3's requirement that training be appropriate to staff 
roles and current threats.

RECOMMENDATION: 
Update security awareness training content to reflect current threat 
intelligence, with particular focus on AI-generated phishing. Consider 
increasing phishing simulation frequency from quarterly to monthly until 
click rate falls below the 5% target.
```

#### Example 4 — Positive Observation (Good Practice)

```
FINDING REFERENCE: INT-2026-012
CLASSIFICATION: Positive Observation
CLAUSE REFERENCE: ISO 27001:2022 Annex A.5.7 — Threat intelligence

STATEMENT OF POSITIVE OBSERVATION:
The organisation maintains subscriptions to NCSC early warning alerts, 
a commercial threat intelligence feed (Recorded Future), and participates 
in the FS-ISAC (Financial Services Information Sharing and Analysis Center). 
Threat intelligence outputs are formally reviewed weekly by the security 
team and summarised in a monthly threat brief presented to the Security 
Committee.

During the audit period, the organisation identified a sector-specific 
threat campaign targeting financial services firms via a supply chain 
vulnerability in a widely-used HR platform. Intelligence was received 
4 days before public disclosure; an out-of-cycle security assessment of 
the organisation's HR supplier was conducted within 24 hours; a 
temporary mitigation was applied pending the vendor's patch release.

This represents a mature and genuinely operational implementation of 
A.5.7 (Threat intelligence) that exceeds what is typically observed in 
organisations at this certification stage. This approach is commended.
```

---

## How Nonconformities Affect the Certification Process

### At Initial Certification (Stage 2)

| Finding | Effect on certification |
|---|---|
| No findings | Certificate issued promptly |
| Observations only | Certificate issued; observations documented for management |
| Minor NCs only | Certificate issued; corrective action plans required; evidence of closure checked at first surveillance audit |
| Minor + major NCs | Certificate held until major NCs are closed; corrective action plan submitted within 30 days; closure evidence reviewed by CB; certificate issued on acceptance |
| Multiple major NCs | Stage 2 may be deemed incomplete; extended corrective action period; possible need for additional audit time (at extra cost) |

### At Surveillance Audit (Year 1 or 2)

| Finding | Effect |
|---|---|
| No findings | Continued certification confirmed |
| Observations | Noted; management informed; no formal action required |
| Minor NCs | Corrective action required; followed up at next surveillance or via documentary review |
| Major NCs | Certificate suspended pending corrective action; if not closed within agreed timeframe (typically 6 months), certificate withdrawn |
| Multiple unaddressed minor NCs from prior audit | May be elevated to major NC if collectively indicating systemic failure |

### At Recertification Audit (Year 3)

The recertification audit is a full reassessment, similar in scope to the Stage 2 audit. The same NC classification and effect rules apply as at Stage 2.

---

## The Corrective Action Response Requirements by NC Type

### For Major Nonconformities

Required within 30 days of finding:
1. **Root cause analysis**: Formal analysis (5 Whys, fishbone, or equivalent) identifying the underlying cause — not just the symptom
2. **Corrective action plan**: Specific actions addressing the root cause, with owners and deadlines
3. **Implementation timeline**: Realistic schedule for completing all actions (typically 60–90 days)
4. **Interim measures**: If the full corrective action takes time, what interim controls address the immediate risk?

Required for closure:
- Evidence that all planned actions have been completed
- Evidence that effectiveness has been verified (re-testing of the control, follow-up sampling, or equivalent)
- Updated ISMS documentation if process changes were required

The CB reviews the corrective action plan and closure evidence. If the root cause analysis is superficial, the corrective actions address symptoms only, or the closure evidence is inadequate, the CB will reject the submission and require revision.

### For Minor Nonconformities

Required within 60 days of finding (or as agreed with the CB/internal audit):
1. **Corrective action plan**: Actions to address the specific gap (may be lighter-touch than a major NC, but root cause should still be considered)
2. **Implementation**: Execute the planned actions
3. **Closure evidence**: Evidence of implementation

For internal minor NCs, closure evidence is reviewed by the internal auditor or a designated reviewer. For CB minor NCs, closure evidence is reviewed at the next scheduled audit or via documentary review.

### For Observations

No mandatory corrective action required. Best practice:
- Management acknowledges the observation
- A decision is made: pursue, defer, or decline
- If pursued: informal improvement action tracked
- If declined: documented rationale for not acting on the recommendation

---

## Multiple Nonconformities: The Escalation Principle

A series of related minor NCs in the same process area can constitute evidence of a systemic failure — which should be classified as a major NC, not a collection of minor NCs.

**Example: Three related minor NCs**

NC-1 (Minor): The access review for the Finance system was missed in Q3 2025.
NC-2 (Minor): The access review for the HR system was missed in Q2 2025.
NC-3 (Minor): Two terminated employees retained active access to the CRM system for 47 days post-departure.

Individually, each could be classified as a minor NC. Together, they indicate a systemic failure of the access management process — inadequate oversight, no escalation mechanism for missed reviews, and no automated deprovisioning trigger. Collectively, this warrants escalation to a major NC: *"The organisation's access management process is failing systematically across multiple systems and review cycles, creating persistent access control risk and indicating fundamental inadequacy in the access review programme."*

The classification principle: when multiple related findings point to the same systemic root cause, classify at the level that accurately reflects the systemic nature of the failure.

---

## The Details That Matter

### "Shall" vs "Should" in ISO 27001

ISO 27001 uses precise language:
- **"Shall"**: Mandatory requirement. Non-fulfilment is a nonconformity.
- **"Should"**: Recommendation. Non-fulfilment may be an observation but is not a nonconformity.
- **"May"**: Permission. No requirement at all.

Findings must only be raised against "shall" requirements. Auditors who raise nonconformities against "should" statements are making classification errors. This distinction is heavily tested in the Lead Auditor examination.

Example: ISO 27001 Annex A.5.7 (Threat intelligence) is a control the organisation *selects* based on risk assessment — it is not a "shall" requirement in the main clauses. If A.5.7 is in the SoA as applicable and implemented, the implementation is assessed. If it is excluded with valid justification, there is no requirement to implement it. The "shall" that drives this is Clause 6.1.3(b) (controls must be determined) and 6.1.3(d) (SoA must justify inclusions and exclusions) — not the control itself.

### Findings Based on Evidence, Not Opinion

Every finding must be supported by specific evidence. A finding statement that says "the organisation does not appear to take patch management seriously" is an opinion — it is unprofessional and unacceptable. A finding statement that says "of 20 sampled critical CVEs published in Q4 2025, 8 (40%) were not patched within the organisation's own 30-day SLA" is a factual, evidence-based finding.

Auditors must be able to defend every finding by pointing to specific evidence. If challenged, the auditor must be able to produce the evidence — not just assert that it exists.

### Audit Finding vs Risk

An audit finding identifies a gap in the ISMS — a control that is not in place, a process that is not operating, a requirement that is not met. A risk is a potential future harm. These are different:

- Finding: "MFA is not enrolled for 8 of 30 sampled user accounts" — this is a confirmed control gap
- Risk: "Credential-based attack succeeding because MFA is absent" — this is the risk the control gap creates

The finding drives the corrective action. The risk drives the treatment decision (implementing MFA). Both are captured — the finding in the corrective action register; the risk in the risk register.

---

## Common Mistakes and Failures

**1. Classifying a systemic failure as multiple minor NCs.**
Five related minor NCs in the same process area that collectively indicate a complete failure of the process. Individually classified as minor, they produce a manageable (but inaccurate) picture. The appropriate classification is major NC — systemic failure.

**2. Raising nonconformities against "should" statements.**
"The organisation should implement automated user deprovisioning" — this is a recommendation, not a "shall" requirement. Raising a nonconformity against a "should" statement is a classification error. It should be an observation.

**3. Finding statements without evidence references.**
"The risk register is outdated" — with no reference to how old it is, what changes occurred, or what evidence demonstrates the failure. Unusable as a professional finding.

**4. Conflating the finding with the corrective action.**
"The organisation must implement MFA for all user accounts" — this is a corrective action recommendation, not a finding. The finding is: "MFA is not enrolled for 8 of 30 sampled user accounts despite the access control policy requiring MFA for all accounts." The finding describes what is wrong; the corrective action describes what to do about it.

**5. Major NC for first-time audit at a new organisation.**
A newly established ISMS that does not yet have 12 months of monitoring data. Some internal auditors classify the absence of 12 months of records as a major NC on first audit. The standard does not require historical records to exist before certification — it requires the processes to be in place and operating. An organisation seeking certification for the first time may have fewer records than a mature ISMS; this is expected, not a nonconformity.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Finding classification is one of the most heavily tested areas in the Lead Auditor exam. Candidates are given case studies and must classify findings, write finding statements, and justify their classification.
- Key classification principles:
  - Systemic vs isolated → major vs minor
  - Absence vs partial failure → major vs minor
  - "Shall" vs "should" → nonconformity vs observation
  - Multiple related minor NCs → potential major NC
- Common exam traps:
  - A finding that sounds major but is actually isolated (minor)
  - A finding that sounds minor but is actually systemic (major)
  - A finding raised against a "should" statement (observation, not NC)
  - A corrective action embedded in the finding statement (findings describe the gap; corrective actions address it)

**CISM:** Domain 3 (Security Programme) — understanding audit findings and their management

**CRISC:** Domain 4 (Risk and Control Monitoring) — audit findings as inputs to risk and control monitoring

---

## GUARDIAN's Take

Finding classification is where auditor judgment is most clearly visible — and most consequential. Two auditors looking at the same evidence can reasonably disagree on whether a finding is major or minor. What they should not disagree on is whether the finding is nonconformity or observation (that is a factual question about whether a "shall" requirement is met) or whether the finding is based on adequate evidence (that is a professional standard).

The most common classification error I see from less experienced auditors is the reluctance to raise major NCs. Partly this is conflict aversion — raising a major NC creates a difficult conversation and delays certification. Partly it is uncertainty — the line between major and minor is genuinely sometimes blurry.

But the classification must reflect the facts. A systemic failure of risk assessment that leaves the organisation managing risks for an environment that no longer exists is a major NC — regardless of how uncomfortable that conversation is to have. An ISMS without management review for the entire certification period is a major NC — regardless of how apologetic and cooperative the CISO is. The auditor's job is to find and classify accurately, not to manage the certification body's relationship with the auditee.

The corrective action process exists precisely because major NCs happen. They are not failures of the organisation — they are findings that help the organisation improve. An auditor who underclassifies major NCs to avoid difficult conversations is failing in their professional duty, and is producing false assurance that serves nobody.

Classify accurately. Write clearly. Evidence everything. That is the professional standard — and it serves the organisation better than comfortable fiction.

---
*Module: Module 3 — ISO 27001 | Guardian Curriculum*
