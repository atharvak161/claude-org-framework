---
tags: [guardian, grc, module-5, gdpr, dpia, data-protection-impact-assessment, privacy-by-design, high-risk-processing]
module: 5
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G5-02 — GDPR Structure Principles Lawful Basis", "G5-04 — Data Controller vs Data Processor", "G5-06 — The Role of the DPO", "G5-09 — GDPR and ISO 27001", "G2-03 — Risk Assessment Methodologies"]
---

# G5-05 — Data Protection Impact Assessment — DPIA

> [!abstract] What This Note Covers
> By the end of this note, you will understand what a DPIA is, when it is mandatory, how to conduct one step by step, what it must contain, how it connects to GDPR's accountability principle, and how it relates to ISO 27001 risk assessment.

---

## Why This Exists

In 2018, the year GDPR came into force, a large UK retailer implemented a new facial recognition system in its stores — scanning shoppers' faces, building biometric profiles, and using them to identify individuals who had previously committed shoplifting. The system processed biometric data (a special category under Article 9) of millions of innocent shoppers without their knowledge or consent.

A DPIA was required before this processing began. It was not conducted. The Information Commissioner's Office (ICO) investigated and issued enforcement action. The system was discontinued.

A DPIA is not just a bureaucratic requirement. It is a systematic mechanism for thinking through the privacy risks of new processing activities *before* they create harm — when changes can be made, when alternatives can be considered, when safeguards can be designed in rather than bolted on. It is the operationalisation of "privacy by design," the principle that privacy must be built into systems from the start, not fixed later.

For high-risk processing, a DPIA is mandatory. For any significant processing activity, it is best practice. And as a documented assessment, it is one of the most powerful demonstrations of accountability the regulation requires.

---

## What a DPIA Is

**Data Protection Impact Assessment (DPIA)** is a process for identifying and minimising the privacy risks of a new project, system, or processing activity. It is:

- A **risk assessment** — identifying what could go wrong for data subjects
- A **compliance check** — assessing whether the processing meets GDPR requirements
- A **design tool** — informing the design of the system to build in appropriate safeguards
- An **accountability document** — demonstrating that the controller considered and addressed privacy risks

GDPR Article 35 requires a DPIA before commencing processing that is "likely to result in a high risk to the rights and freedoms of natural persons."

### Privacy by Design: The Philosophy Behind DPIA

Before examining the DPIA requirement in detail, understand its philosophical foundation: **privacy by design** (Article 25).

Privacy by design means:
- Privacy considerations are incorporated at the design stage — before a system is built, not after
- Data protection measures are built in as part of the system architecture, not added as an afterthought
- Privacy is the default — not a setting that users must actively enable
- The system processes the minimum data needed, retains it only as long as necessary, and protects it throughout its lifecycle

A DPIA is the mechanism through which privacy by design is operationalised. By requiring a systematic assessment before high-risk processing begins, GDPR forces organisations to think about privacy *before* the code is written, before the contracts are signed, before the infrastructure is built.

The cost of discovering and fixing privacy problems at design time is typically 10–100x lower than fixing them after deployment. DPIA is the tool that catches problems early.

---

## When a DPIA is Mandatory — Article 35

### The General Rule

A DPIA is required prior to processing where the processing is "likely to result in a high risk to the rights and freedoms of natural persons."

Article 35(3) identifies three specific types of processing that **always** require a DPIA:

**(a) Systematic and extensive evaluation of personal aspects of individuals, including profiling, where decisions with legal or similarly significant effects are based thereon.**
Example: Credit scoring systems; automated recruitment filtering; social scoring systems.

**(b) Processing on a large scale of special category data (Article 9) or criminal conviction/offence data (Article 10).**
Example: A hospital's patient health records system; a criminal background check service; a genetic testing service.

**(c) Systematic monitoring of a publicly accessible area on a large scale.**
Example: Large-scale CCTV systems; smart city monitoring; tracking of individuals' movements in public spaces.

### The EDPB/ICO List

Beyond Article 35(3), supervisory authorities publish lists of processing types that require a DPIA. The ICO's list includes:

- Innovative technology (new technologies applied to personal data processing)
- Denial of service (automated decisions denying individuals access to a service)
- Large-scale profiling
- Biometric data processing
- Genetic data processing
- Children's data (particularly where data is processed on a large scale or involves profiling)
- Data that could result in physical harm to the data subject
- Systematic monitoring of employees

### The "Two Criteria" Threshold (EDPB Guidelines)

The European Data Protection Board (EDPB) has published guidance suggesting that a DPIA is likely required when processing meets **two or more** of the following criteria:

1. Evaluation or scoring (including profiling)
2. Automated decision-making with legal or similarly significant effects
3. Systematic monitoring of data subjects
4. Sensitive data or data of a highly personal nature
5. Data processed on a large scale
6. Matching or combining datasets
7. Data concerning vulnerable data subjects (children, employees, patients)
8. Innovative use or application of new technological or organisational solutions
9. Processing that prevents data subjects from exercising a right or using a service

**When in doubt, conduct a DPIA.** The ICO's position is clear: conducting a DPIA when one is not strictly required causes no harm. Failing to conduct one when it is required is a GDPR violation.

### Screening: Determining Whether a DPIA is Required

Before conducting a full DPIA, a **screening assessment** determines whether one is needed:

1. Describe the proposed processing activity
2. Check against Article 35(3) — does it fall into one of the three mandatory categories?
3. Check against the ICO's mandatory list
4. Apply the EDPB's two-criteria threshold
5. If any trigger is met: DPIA required
6. If no trigger is met: document the screening decision (accountability) and proceed without DPIA — but consider whether voluntary DPIA would be beneficial

The screening decision must be documented — the accountability principle requires evidence that the controller considered whether a DPIA was required.

---

## The DPIA Process: Step by Step

The ICO publishes a DPIA template and guidance that provides a practical framework. The process has seven key steps:

### Step 1: Describe the Processing

**What needs to be documented:**
- The nature, scope, context, and purposes of the processing
- What data will be collected, from whom, and how
- What will be done with the data (stored, shared, analysed, automated decision-making)
- Who will have access
- How long data will be retained
- Whether data will be shared with third parties (and who)
- Whether data will be transferred internationally

**The objective**: A clear, specific description that allows the risks to be identified and assessed. A vague description produces a vague DPIA — and real risks go unidentified.

**Connection to RoPA**: The DPIA description should be consistent with (and may eventually feed into) the RoPA entry for this processing activity.

### Step 2: Assess Necessity and Proportionality

Assess whether the processing is lawful and proportionate to the objectives:

- **Lawful basis**: Is there a valid Article 6 lawful basis for the processing? (And Article 9 condition if special category data?)
- **Purpose limitation**: Is the purpose specified, explicit, and legitimate?
- **Data minimisation**: Is the minimum data being collected for the stated purpose?
- **Proportionality**: Are the privacy costs proportionate to the benefits?
- **Transparency**: Will data subjects be appropriately informed?
- **Data subject rights**: How will data subject rights be facilitated?
- **Retention**: Is the retention period defined and justified?
- **Accountability**: What records and governance will demonstrate compliance?

If the processing fails any of these assessments, the DPIA must identify what changes are needed before proceeding.

### Step 3: Identify and Assess Privacy Risks

This is the risk assessment at the heart of the DPIA. Identify:

**Risks to data subjects** (not risks to the organisation): The DPIA focuses on risks to individuals' rights and freedoms — not operational or financial risks to the controller.

**Risk categories to consider:**

| Risk category | Examples |
|---|---|
| **Unauthorised access** | Data breach exposing personal data to unauthorised parties |
| **Unauthorised modification** | Data altered without authorisation, affecting accuracy |
| **Loss of data** | Data deleted or destroyed, affecting availability |
| **Identity theft or fraud** | Data used to impersonate or defraud data subjects |
| **Discrimination** | Data used to make discriminatory decisions |
| **Reputational damage** | Exposure of data causing embarrassment or professional harm |
| **Financial harm** | Data used to cause financial loss to data subjects |
| **Physical harm** | Data enabling harm to data subjects (e.g. location data enabling stalking) |
| **Loss of control** | Data subjects unable to exercise rights over their data |
| **Chilling effects** | Awareness of monitoring changes data subjects' behaviour |
| **Exclusion from services** | Automated decisions wrongly denying data subjects access |

**For each risk:**
- **Source**: What causes this risk? (Technical failure, inadequate security, insider threat, third-party breach, processing error)
- **Likelihood**: How probable is this risk materialising?
- **Severity**: If it materialises, how serious is the impact on data subjects?
- **Risk level**: Combination of likelihood and severity

**Risk assessment method**: The DPIA risk assessment does not need to follow ISO 27005 or any specific formal methodology — but it must be systematic and documented. Using the same risk scoring approach as the ISMS risk assessment (likelihood × severity on a defined scale) is consistent and efficient.

### Step 4: Identify Measures to Mitigate Risks

For each identified risk, identify measures that reduce likelihood or severity:

**Technical measures:**
- Encryption (at rest and in transit)
- Pseudonymisation or anonymisation
- Access controls and authentication (MFA for data access)
- Data minimisation (collect less; retain less)
- Automated deletion
- Monitoring and alerting
- Penetration testing and security assessment

**Organisational measures:**
- Privacy notices and transparency
- Staff training on data handling
- Data Processing Agreements with processors
- Data breach response procedures
- Privacy by design principles in system development
- DPO involvement and oversight
- Access controls and need-to-know restrictions
- Auditing and monitoring of data access

**For each measure:**
- Assess the residual risk after the measure is applied
- Determine whether the residual risk is acceptable
- Document who is responsible for implementing the measure and when

### Step 5: Record Outcomes and Decisions

The DPIA must be documented — it is a mandatory documented information requirement under the accountability principle.

**DPIA record must include:**
- Description of the processing (Step 1)
- Assessment of necessity and proportionality (Step 2)
- Risks identified and their assessment (Step 3)
- Measures to mitigate risks (Step 4)
- Conclusions — is the processing acceptable, with what conditions?
- Decision on whether to consult the ICO (Step 6)
- DPO advice and how it was taken into account (where DPO is appointed)
- Sign-off from the relevant decision-maker

**Review and update**: The DPIA must be reviewed when the processing changes and whenever a reassessment is needed (e.g. if a new risk is identified, if the technology changes, if the purpose expands).

### Step 6: Consult the ICO if Residual Risk Remains High (Prior Consultation — Article 36)

If, after identifying and applying mitigations, **high risks to data subjects remain**, the controller must consult the ICO before commencing processing. This is "prior consultation" under Article 36.

**The prior consultation process:**
- Submit the DPIA to the ICO
- The ICO has 8 weeks to respond (extendable by a further 6 weeks for complex consultations)
- The ICO may advise, issue a warning, issue a ban, or exercise other corrective powers

**What the ICO may do after consultation:**
- Provide written advice on measures to reduce risk
- Advise that the processing should not proceed
- Exercise corrective powers (if the controller proceeds regardless)

**Practical significance**: Very few DPIAs result in prior consultation — the vast majority of high-risk processing can be made acceptable through appropriate mitigations. Prior consultation is a last resort for processing where substantial risks cannot be adequately mitigated.

### Step 7: Integrate DPIA Outcomes Into the Project

The DPIA is only valuable if its outcomes are acted upon. The mitigations identified must be incorporated into:
- The system/process design
- The project plan (with owners and timelines for each measure)
- The budget (resources for implementing mitigations)
- The contracts with processors
- The staff training programme
- The monitoring and review arrangements

A DPIA that identifies risks and recommends mitigations that are then ignored is worse than no DPIA — it demonstrates awareness of risks that were not addressed.

---

## The DPIA and the DPO

Where an organisation has a DPO (mandatory or voluntary), Article 35(2) requires the controller to **seek the advice of the DPO** when conducting a DPIA. The DPO must:

- Be consulted during the DPIA process (not after it is complete)
- Record the advice given
- Have their advice reflected in the DPIA record

The DPO's advice must be documented and taken into account. If the controller decides not to follow the DPO's recommendations, the reasons must be recorded.

This is not merely procedural — it is a meaningful governance requirement. The DPO's independence and expertise is the value-add in the DPIA process. A DPIA conducted without genuine DPO involvement is a compliance failure in organisations with a DPO.

---

## DPIA and ISO 27001 Risk Assessment: The Relationship

The DPIA and ISO 27001 information security risk assessment are related but distinct processes:

| Dimension | DPIA | ISO 27001 Risk Assessment |
|---|---|---|
| **Focus** | Risks to data subjects (individuals) | Risks to the organisation's information assets (CIA) |
| **Trigger** | New/changed processing activity (particularly high-risk) | Annual (or when significant changes occur) |
| **Scope** | Specific processing activity | All information assets within ISMS scope |
| **Risk subject** | The data subject (their rights and freedoms) | The organisation (its assets, operations, reputation) |
| **Output** | DPIA record with mitigations and decisions | Risk register entry with treatment plan |
| **Mandatory for** | Controllers with high-risk processing | All ISO 27001-certified organisations |
| **Legal basis** | GDPR Article 35 | ISO 27001 Clause 6.1.2 |

**The integration opportunity**: Many organisations run DPIA and ISMS risk assessment as parallel, disconnected processes — a missed opportunity. The risks identified in a DPIA often feed directly into the ISMS risk register. A DPIA for a new healthcare data processing system should produce risk register entries covering the security risks identified, with controls selected to address both the GDPR risk (harm to data subjects) and the information security risk (breach of CIA). The mitigations identified in the DPIA become controls in the SoA.

A mature privacy and security programme treats DPIA as a specialised risk assessment within the broader ISMS risk framework — using consistent methodology, feeding outputs into the risk register, and using the SoA and control framework to implement mitigations.

---

## Practical DPIA Template

A DPIA does not need to be long or complex. A structured, concise DPIA is more effective than a lengthy one that buries key risks. The ICO's template provides a practical structure:

```
DATA PROTECTION IMPACT ASSESSMENT

Project/System name: [Name]
Date: [Date]
Controller: [Organisation name]
DPO consulted: [Name] on [Date]
Prepared by: [Name/role]

PART 1: PROCESSING DESCRIPTION

1. What personal data will be processed?
   [Types of data, sensitivity, volume, data subjects affected]

2. What is the purpose of the processing?
   [Specific, explicit purpose]

3. What is the lawful basis?
   [Article 6 basis + Article 9 condition if special category]

4. Who will have access to the data?
   [Internal roles + external parties]

5. Will data be shared with third parties? If yes, who and on what basis?
   [Processors, joint controllers, international transfers]

6. How long will data be retained?
   [Retention period and rationale]

PART 2: NECESSITY AND PROPORTIONALITY ASSESSMENT

[For each data protection principle, assess whether processing is compliant]

PART 3: RISK ASSESSMENT

[For each identified risk to data subjects:]
Risk: [Description]
Source: [What causes this risk]
Likelihood: [1-5] Impact on data subjects: [1-5] Risk level: [Low/Medium/High/Critical]
Current controls: [What is in place]
Residual risk: [After current controls]
Additional measures needed: [What more needs to be done]
Responsible: [Who] By when: [Date]

PART 4: DPO ADVICE

[DPO recommendations]
[How advice was taken into account]

PART 5: OUTCOME AND DECISION

□ Processing can proceed as described
□ Processing can proceed with the following additional measures: [list]
□ Processing should be referred to ICO for prior consultation
□ Processing should not proceed

Approved by: [Name/role]
Date: [Date]

REVIEW DATE: [Date]
```

---

## Common Mistakes and Failures

**1. Conducting the DPIA after the system is built.**
A DPIA conducted after the system is live is a compliance exercise, not a risk management tool. Changes identified are expensive or impossible to implement. The value of DPIA is at design time — when changes are cheap and the privacy risks can be designed away.

**2. Focusing on organisational risk rather than data subject risk.**
A DPIA that assesses "reputational risk to the company" or "regulatory risk to the organisation" rather than "risk to the rights and freedoms of the data subjects" is not a GDPR-compliant DPIA. The risk subject is the individual, not the company.

**3. No DPO consultation where a DPO is appointed.**
The DPO must be consulted during the DPIA process. Presenting a completed DPIA to the DPO for sign-off is not consultation — it is an information exercise. The DPO must have the opportunity to influence the assessment.

**4. Identifying risks without identifying measures.**
A DPIA that lists 8 risks with no corresponding mitigations, or where all mitigations are "TBD," provides no protection and demonstrates no accountability. Every identified risk must be addressed.

**5. DPIA not reviewed when processing changes.**
The DPIA is conducted for the system as designed. Two years later, the system has been expanded (new data types, new purposes, new recipients). The DPIA has never been reviewed. The current processing is not covered by any DPIA. This is a common failure in organisations that treat DPIA as a one-time project activity.

**6. Failing to conduct a DPIA because the processing "isn't that sensitive."**
DPIA is required based on the risk of the processing to data subjects, not on how sensitive the controller believes the data to be. Large-scale processing of apparently non-sensitive data (location data, web browsing) can create serious privacy risks — the scale and combination potential may create significant risks even where individual data points appear innocuous.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- DPIA is not an ISO 27001 requirement per se — but where the ISMS scope includes processing personal data, the GDPR obligation to conduct DPIAs is a legal compliance requirement that falls under ISO 27001 Clause 4.2 (stakeholder requirements — the ICO is an interested party) and A.5.34 (privacy and protection of PII).
- Auditors may ask: "For new systems that process personal data, how does your organisation determine whether a DPIA is required?" A mature answer describes a screening process and documented DPIA records.

**CISM:**
- Domain 2 (Information Risk Management) includes privacy risk assessment as part of the overall risk programme. DPIA is the GDPR-specific mechanism for privacy risk assessment.

**CISSP:**
- Domain 1 (Security and Risk Management) covers privacy risk assessment including DPIA concepts. The CISSP candidate must understand when a DPIA is required and what it must contain.

---

## GUARDIAN's Take

The DPIA is one of the most powerful tools GDPR provides — and one of the most underutilised. Conducted properly, at the right time, it prevents privacy problems from being built into systems that then cost enormous amounts to fix, or that cause real harm to real people.

The failure mode I see most often is timing. The DPIA is commissioned in response to a question in the project sign-off checklist: "Has a DPIA been conducted?" The system is six months from launch. The architecture is finalised. The processors are contracted. The DPIA is conducted, identifies significant risks, recommends mitigations that would require architectural changes — and those recommendations are shelved as too expensive to implement at this stage. The DPIA has been done; none of it mattered.

The DPIA that actually changes outcomes is the one commissioned at the start — when the project sponsor can still be told "this processing creates unacceptable risks; here are three alternative approaches that achieve the same business objective with significantly lower privacy impact." That conversation saves money, protects data subjects, and demonstrates genuine accountability.

Build DPIA into the project governance framework. Make it a gate condition — not a box to tick at the end, but a process that must be completed before architecture decisions are finalised. Integrate it with the security risk assessment so that privacy and security risks are identified together and mitigations are designed holistically.

That is privacy by design in practice. And it is both the legally required and operationally most effective approach to DPIA.

---
*Module: Module 5 — Data Protection / GDPR | Guardian Curriculum*
