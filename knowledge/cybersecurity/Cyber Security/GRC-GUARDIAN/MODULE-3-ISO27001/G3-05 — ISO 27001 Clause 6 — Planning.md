---
tags: [guardian, grc, module-3, iso27001, clause-6, planning, risk-assessment, risk-treatment, soa, objectives]
module: 3
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G2-03 — Risk Assessment Methodologies", "G2-06 — Risk Treatment", "G3-03 — ISO 27001 Clause 4", "G3-04 — ISO 27001 Clause 5", "G3-06 — ISO 27001 Clause 7", "G3-11 — Statement of Applicability"]
---

# G3-05 — ISO 27001 Clause 6 — Planning

> [!abstract] What This Note Covers
> By the end of this note, you will understand every requirement of ISO 27001 Clause 6 in detail — the risk assessment and treatment process, the Statement of Applicability, information security objectives, and the new Clause 6.3 requirement for planned changes — including the exact evidence auditors look for and the common failures that produce nonconformities.

---

## Why This Exists

Clause 6 is the intellectual engine of ISO 27001. If Clause 4 establishes the context and Clause 5 establishes the governance, Clause 6 is where the organisation does the hard thinking: what are our risks, what are we going to do about them, and what are we trying to achieve?

The risk assessment and treatment process in Clause 6 is the activity that distinguishes ISO 27001 from a prescriptive compliance standard. Unlike PCI DSS, which tells you exactly which controls to implement, ISO 27001 says: *you decide which controls you need, based on your own risk assessment*. That flexibility is both the standard's greatest strength and the source of its most common failures.

When Clause 6 is executed well — with a genuine, methodology-driven risk assessment, a thoughtful treatment plan, and a Statement of Applicability that traces every control to a risk — the ISMS is genuinely risk-based. When it is executed poorly — with a template risk register full of generic risks, controls selected from a checklist rather than from the assessment, and an SoA that is disconnected from any risk — the ISMS is compliance theatre.

Auditors spend more time on Clause 6 than on any other single clause. The risk register, the risk treatment plan, and the SoA are the most scrutinised artefacts in any ISO 27001 audit. This note equips you to understand what auditors are testing and why.

---

## Clause 6 Overview: The Three Requirements

| Sub-clause | Title | Core question |
|---|---|---|
| **6.1** | Actions to address risks and opportunities | How do we assess and treat our information security risks? |
| **6.2** | Information security objectives and planning to achieve them | What specific outcomes is the ISMS trying to achieve? |
| **6.3** | Planning of changes | How do we manage planned changes to the ISMS? (New in 2022) |

---

## Clause 6.1 — Actions to Address Risks and Opportunities

Clause 6.1 has three sub-clauses: 6.1.1 (general), 6.1.2 (information security risk assessment), and 6.1.3 (information security risk treatment).

### Clause 6.1.1 — General

The organisation must plan actions to address risks and opportunities identified through the Clause 4 context analysis and interested party requirements. These actions must be integrated into the ISMS processes and evaluated for effectiveness.

"Risks and opportunities" in this context means: risks that could prevent the ISMS from achieving its intended outcomes, and opportunities to improve the ISMS. This is broader than just information security risks — it includes risks to the ISMS programme itself (e.g. the risk that the ISMS is not properly resourced).

---

### Clause 6.1.2 — Information Security Risk Assessment

This is the most detailed and most audited sub-clause in the entire standard. It defines the requirements for the risk assessment process.

#### The Requirement in Full

The organisation shall define and apply an information security risk assessment process that:

**a) Establishes and maintains information security risk criteria including:**
- **i) the risk acceptance criteria** — at what residual risk level will the organisation formally accept a risk without further treatment?
- **ii) criteria for performing information security risk assessments** — what methodology will be used? What scales? What scoring method?

**b) Ensures that repeated risk assessments produce consistent, valid and comparable results**

This is the repeatability requirement. The methodology must be defined well enough that:
- The same assessor applying it twice produces the same (or very similar) results
- Different assessors applying it produce comparable results
- Results from this year's assessment can be meaningfully compared to last year's

**c) Identifies the information security risks:**
- **i) applies the risk assessment process** to identify risks associated with the loss of confidentiality, integrity, and availability of information within the ISMS scope
- **ii) identifies risk owners** — named individuals accountable for each risk

**d) Analyses the information security risks:**
- **i) assesses the potential consequences** if the risk were to materialise (impact)
- **ii) assesses the realistic likelihood** of the risk occurring (likelihood)
- **iii) determines the levels of risk** — combining likelihood and impact to produce a risk score

**e) Evaluates the information security risks:**
- **i) compares the results of risk analysis with the risk criteria** — is the risk within appetite?
- **ii) prioritises the analysed risks for risk treatment** — which risks require treatment?

**f) Retains documented information about the risk assessment process** — the risk assessment must be documented and records retained.

#### What Clause 6.1.2 Does NOT Require

The standard does not prescribe:
- A specific methodology (ISO 27005, OCTAVE, or custom — all acceptable)
- Qualitative vs quantitative approach
- A specific risk matrix or scoring scale
- Asset-based vs scenario-based approach
- Any particular tool or format

The organisation has complete flexibility in these choices — but *whatever* is chosen must be documented, applied consistently, and produce the required outputs.

#### The Risk Assessment Methodology Document

Because the methodology must produce consistent, valid, and comparable results, it must be documented. A risk assessment methodology document should cover:

1. **Scope**: What is assessed (aligned with ISMS scope)
2. **Risk identification approach**: Asset-based, scenario-based, or hybrid; sources used (workshops, threat intelligence, vulnerability scans, etc.)
3. **Likelihood scale**: Definitions for each point on the scale (1–5, qualitative labels)
4. **Impact scale**: Definitions for each point on the scale, across relevant dimensions (financial, operational, reputational, regulatory)
5. **Risk scoring method**: How likelihood and impact combine to produce a risk score (matrix or multiplication)
6. **Risk banding**: How scores map to risk ratings (Low, Medium, High, Critical)
7. **Risk acceptance criteria**: The maximum residual risk rating the organisation will accept without escalation
8. **Risk owner assignment**: Criteria for identifying who should own each risk
9. **Review triggers**: What events prompt an out-of-cycle risk assessment

This document is mandatory (required as documented information under Clause 6.1.2) and is reviewed by auditors during the Stage 1 audit.

#### Risk Acceptance Criteria: A Critical Detail

Risk acceptance criteria (Clause 6.1.2(a)(i)) define the threshold below which residual risks are accepted without further treatment. This is the operationalisation of the risk appetite set by top management (Clause 5.1).

**Example risk acceptance criteria:**
> "Risks with a residual risk score of 1–9 (Low or Medium on the organisation's 5×5 risk matrix) may be accepted by the Risk Owner without further treatment, subject to documentation and annual review. Risks scoring 10–14 (Medium-High) require CISO sign-off for acceptance. Risks scoring 15 or above (High or Critical) may not be accepted without formal board-level sign-off and must have an active treatment plan."

Auditors will test whether these criteria are actually applied in the risk register — whether risks above the acceptance threshold have treatment plans, and whether risks below the threshold are appropriately documented as accepted.

---

### Clause 6.1.3 — Information Security Risk Treatment

#### The Requirement

The organisation shall define and apply an information security risk treatment process that:

**a) Selects appropriate information security risk treatment options** (mitigate, transfer, avoid, accept) taking account of the risk assessment results.

**b) Determines all controls that are necessary to implement the chosen treatment options.**

The controls can come from any source — Annex A, other frameworks (NIST SP 800-53, CIS Controls), or the organisation's own control design. There is no restriction to Annex A controls only.

**c) Compares the controls determined in (b) with those in Annex A and verifies that no necessary controls have been omitted.**

This is the Annex A comparison requirement. The organisation must check whether any of the 93 Annex A controls should be included in the treatment plan that has not already been identified through the risk assessment. This is a safety net — ensuring that the risk-based approach has not overlooked controls that are broadly accepted as necessary.

**d) Produces a Statement of Applicability that contains:**
- The controls determined as necessary (from 6.1.3(b))
- Justification for their inclusion
- Whether the controls are implemented or not
- Justification for the exclusion of any Annex A controls

**e) Formulates an information security risk treatment plan.**

The risk treatment plan documents: for each risk above the acceptance threshold, the chosen treatment option, the specific controls or actions to be implemented, the owner of each action, the timeline, and the expected residual risk after treatment.

**f) Obtains risk owners' approval of the risk treatment plan and acceptance of residual information security risks.**

Risk owners must formally approve the treatment plan for their risks and formally accept the residual risk. This sign-off is mandatory documented information.

#### The Traceability Requirement

Clause 6.1.3 establishes what auditors call the **traceability chain** — the thread that connects every element of the risk management process:

```
Context (Clause 4)
    ↓
Risk identification (Clause 6.1.2(c))
    ↓
Risk analysis and evaluation (Clause 6.1.2(d) and (e))
    ↓
Treatment option selection (Clause 6.1.3(a))
    ↓
Control determination (Clause 6.1.3(b))
    ↓
Annex A comparison (Clause 6.1.3(c))
    ↓
Statement of Applicability (Clause 6.1.3(d))
    ↓
Risk treatment plan (Clause 6.1.3(e))
    ↓
Risk owner approval (Clause 6.1.3(f))
    ↓
Control implementation (Clause 8)
    ↓
Monitoring and audit evidence (Clause 9)
```

Auditors will trace this chain from end to end. If any link is missing — if controls in the SoA cannot be traced to risks in the risk register, or if risks in the risk register have no corresponding controls in the SoA — there is a traceability gap that is typically a nonconformity.

---

### The Statement of Applicability (SoA) in Depth

The SoA is mandatory, required by Clause 6.1.3(d), and is one of the most important documents in the ISMS. It serves multiple purposes:

**For the organisation**: A comprehensive inventory of all controls relevant to their ISMS, with implementation status. Enables tracking of control implementation progress.

**For the auditor**: The primary document for assessing whether the risk treatment process is complete. The auditor will check every entry — applicability decisions, implementation claims, and exclusion justifications.

**For customers and third parties**: Evidence of what controls the organisation has implemented. Many customers request the SoA as part of supplier due diligence.

#### SoA Structure

A complete SoA has a row for each of the 93 Annex A controls, with columns for:

| Column | Content |
|---|---|
| **Control reference** | ISO 27001:2022 Annex A control number (e.g. A.5.1) |
| **Control name** | Name of the control (e.g. "Policies for information security") |
| **Applicable?** | Yes / No |
| **Justification for inclusion** | Why is this control applicable? Link to risk(s) it addresses |
| **Justification for exclusion** | If not applicable: why not? (Only valid if no risk exists requiring the control) |
| **Implemented?** | Yes / Partially / No (with planned implementation date if No or Partial) |
| **Implementation evidence reference** | Where can evidence of implementation be found? |
| **Additional controls** | Any controls beyond Annex A that the organisation has implemented |

#### SoA Exclusions: Common Audit Scrutiny Points

Controls are commonly and legitimately excluded when no relevant risk exists. Examples:

- **A.6.7 Remote working** — excluded if the organisation has no remote workers (unlikely post-2020, but possible in specific manufacturing contexts)
- **A.8.21 Security of network services** — excluded if the organisation has no network services beyond a basic internet connection with no managed network security
- **A.7.1 Physical security perimeters** — excluded if the organisation is entirely cloud-based with no physical premises of its own

Auditors scrutinise exclusions carefully. An exclusion is only valid if the justification is credible — i.e. there genuinely is no risk that the excluded control would address. An exclusion of A.8.5 (Secure authentication) is almost never justifiable. An exclusion of A.7.4 (Physical security monitoring) may be justifiable for a cloud-only company with no data centre.

---

## Clause 6.2 — Information Security Objectives and Planning to Achieve Them

### The Requirement

The organisation shall establish information security objectives at relevant functions and levels that:

**a) are consistent with the information security policy**
**b) are measurable (if practicable)**
**c) take into account applicable information security requirements, and results from risk assessment and risk treatment**
**d) are monitored**
**e) are communicated**
**f) are updated as appropriate**

The organisation shall retain documented information on the information security objectives and shall determine: who will be responsible; what will be done; what resources will be required; when it will be completed; and how the results will be evaluated.

### What Good Objectives Look Like

Information security objectives translate the high-level commitments of the information security policy into specific, measurable, time-bound targets that the ISMS is trying to achieve.

**Poor objectives (too vague to be useful):**
- "Improve information security"
- "Maintain ISO 27001 certification"
- "Reduce security incidents"

**Good objectives (specific, measurable, achievable, relevant, time-bound):**

| Objective | Measure | Target | Timeline | Owner |
|---|---|---|---|---|
| Achieve ISO 27001:2022 certification | External certification audit passed with zero major NCs | Certification achieved | Q3 2026 | CISO |
| Reduce phishing susceptibility | Monthly phishing simulation click rate | <5% click rate sustained | By end of FY2026 | CISO / Security Awareness Lead |
| Improve patch compliance | % of critical CVEs patched within 30 days | >95% monthly | Continuous from Q2 2026 | Head of IT Operations |
| Ensure all staff complete annual security training | % completion of mandatory security awareness training | 100% completion within 30 days of annual renewal | Annual | CISO / HR |
| Reduce time to detect and respond to incidents | Mean time to detect (MTTD) and mean time to respond (MTTR) | MTTD <4 hours; MTTR <24 hours for high-severity | By Q4 2026 | SOC Lead |

Objectives must be communicated — staff and management must know what the ISMS is trying to achieve. They must be monitored — progress tracked and reported to management review. And they must be updated when circumstances change.

---

## Clause 6.3 — Planning of Changes

### The Requirement (New in ISO 27001:2022)

> *"When the organisation determines the need to make changes to the information security management system, the changes shall be carried out in a planned manner."*

Clause 6.3 is new to the 2022 version. It recognises that ISMSs change — new controls are added, scope is extended, processes are updated — and requires that these changes are managed in a controlled, planned way rather than ad hoc.

### What Counts as an ISMS Change

An ISMS change is any modification to:
- The ISMS scope
- The risk assessment methodology
- The information security policy or supporting policies
- The control set (adding new controls, removing controls, significantly modifying controls)
- Roles and responsibilities
- ISMS processes (risk assessment cycle, management review process, internal audit programme)

Routine operational activities (patching, access reviews, incident handling) are not ISMS changes — they are the normal operation of existing ISMS processes.

### What "Planned Manner" Requires

A planned change must consider:
- The purpose of the change and its potential consequences
- The integrity of the ISMS (does this change undermine any ISMS requirement?)
- Resource availability to implement the change
- Allocation of responsibilities for the change
- Impact on the risk assessment and risk register (does the change create new risks or affect existing ones?)

This requirement prevents the ISMS from being changed casually — a scope reduction agreed informally in a meeting without updating the SoA, the risk register, or any other ISMS documentation.

---

## The Details That Matter

### Risk Assessment Frequency

Clause 6.1.2 does not specify how often risk assessments must be conducted. The organisation must define its own review schedule (in the risk assessment methodology document) and stick to it.

**Best practice:**
- Full risk assessment: annually (as a minimum), aligned with the management review cycle
- High/Critical risk reviews: quarterly
- Out-of-cycle assessments: triggered by significant changes (new system, incident, regulatory change, threat intelligence)

Auditors will check that risk assessments have been conducted at the frequency defined in the methodology. If the methodology says "annually" and the last assessment was 18 months ago, that is a nonconformity.

### Risk Owner Approval: A Critical Audit Point

Clause 6.1.3(f) requires that risk owners approve the risk treatment plan and accept residual risks. This approval must be documented — a named individual's signature (or equivalent digital approval) on a specific date.

Common failures:
- Risk treatment plans that exist but have no evidence of risk owner approval
- Risk owners who are listed but have not actually reviewed or approved their risks
- Blanket approval by the CISO on behalf of all risk owners (defeats the purpose of distributed risk ownership)

Auditors will request evidence of risk owner approval — approval records, signed documents, or equivalent. If this evidence does not exist, Clause 6.1.3(f) is not satisfied.

### The SoA Version Control

The SoA is a living document — it changes as controls are implemented, risks change, and scope evolves. It must be version-controlled with a clear version history. Auditors will check:
- Is the current version dated and approved?
- Is there a record of previous versions?
- Has the SoA been updated to reflect the transition to ISO 27001:2022 (for organisations transitioning from 2013)?

---

## Common Mistakes and Failures

**1. Risk register with generic risks that could apply to any organisation.**
"Risk of cyberattack — High." This is not a risk assessment entry — it is a category heading. Every risk entry must contain specific threat, vulnerability, asset, and impact components, as required by Clause 6.1.2(c)(i).

**2. Controls in the SoA not traceable to risks in the risk register.**
The SoA lists 78 controls as applicable and implemented, but when auditors trace each control to a risk register entry, 20 of them have no corresponding risk. The controls exist but cannot be justified through the risk-based process. This is a traceability failure — typically a minor nonconformity, but potentially major if systemic.

**3. Risk acceptance criteria defined but not applied.**
The methodology states that risks above a score of 12 must have an active treatment plan. The risk register contains several risks scored 14–18 with no treatment plan and no documented acceptance by an appropriate authority. The acceptance criteria exist on paper but are not enforced.

**4. SoA exclusions with no justification.**
Annex A controls marked "not applicable" with no explanation of why. The auditor has no basis to assess whether the exclusion is legitimate. Typically a minor nonconformity — but if the excluded control clearly addresses a significant identified risk, potentially major.

**5. Information security objectives that are never monitored.**
Objectives are set at the start of the ISMS programme and never reviewed. The management review has no data on whether objectives are being achieved. Objectives are updated at the next certification cycle, not because they were achieved but because everyone forgot about them.

**6. Risk treatment plan with completion dates that have all passed.**
The risk treatment plan from the initial certification has 15 actions with completion dates ranging from 3 to 12 months ago. None are marked complete. Nobody has updated the plan. The ISMS has not progressed beyond its initial state.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Clause 6 is the most heavily tested clause in the Lead Auditor examination. Every element is examinable, with particular focus on the traceability chain (risk → treatment → SoA → implementation → evidence).
- Stage 1 audit focuses on: is the risk assessment methodology documented and appropriate? Is the SoA complete and consistent? Are objectives defined and measurable?
- Stage 2 audit focuses on: have the risks been genuinely assessed? Are controls implemented as the SoA claims? Are treatment plans current and being progressed? Are risk owners genuinely engaged?

**Key auditor questions for Clause 6:**
- "Show me your risk assessment methodology. How does it produce consistent and comparable results?"
- "Take me through a specific risk. Show me how it was identified, assessed, and treated. Show me where its control appears in the SoA."
- "Why is control A.8.12 (Data leakage prevention) excluded from your SoA? What risk assessment finding supports that exclusion?"
- "Your risk treatment plan shows 8 overdue actions. What is the current residual risk for the risks these actions were meant to treat?"
- "How were your information security objectives set? How are they monitored? What progress have you made against them?"

**CRISC:**
- Clause 6.1.2 and 6.1.3 directly implement CRISC's risk assessment and risk response domains. CRISC candidates must understand both as operationalised in the ISO 27001 context.

**CISM:**
- Domain 2 (Information Risk Management) maps directly to Clause 6. The CISM candidate must be able to design and oversee the risk assessment and treatment process that Clause 6 requires.

---

## GUARDIAN's Take

Clause 6 is where an ISO 27001 implementation either becomes genuinely valuable or collapses into compliance theatre. The pivot point is always the same question: is the risk assessment *genuine*?

A genuine risk assessment means sitting with the people who run the business — not just the IT team — and asking: what do we actually rely on? What would hurt us if it failed? What are the realistic threats to our specific environment? What are we actually doing about those threats, and does it work?

A template risk assessment means downloading a generic risk register from the internet, adding the organisation's name at the top, assigning scores that seem reasonable without much analysis, and connecting it to an SoA that was populated by working through the Annex A checklist.

The outputs of these two processes look similar in a folder. They are completely different in their value. The genuine assessment produces a risk register that drives real decisions — where to invest, what to prioritise, what to accept, what to escalate. The template assessment produces a document that satisfies an auditor's checklist without influencing a single business decision.

An experienced Lead Auditor will find the difference in about 20 minutes of questioning. The tell is always traceability. "Show me how this control addresses that specific risk." If the answer is a coherent, specific explanation — "control A.8.5 addresses risk RISK-017 by requiring MFA on all remote access, which reduces the likelihood score for that risk from 4 to 2" — you are looking at a genuine assessment. If the answer is vague hand-waving — "well, access control is generally important for security" — you are looking at a template.

Build the genuine article. The extra effort required to do a real risk assessment is the difference between an ISMS that improves your security and one that simply produces a certificate. The certificate has the same value either way. The security outcome is completely different.

---
*Module: Module 3 — ISO 27001 | Guardian Curriculum*
