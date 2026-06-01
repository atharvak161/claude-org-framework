---
tags: [guardian, grc, module-8, iso-22301, bcms, business-continuity-standard, certification]
module: 8
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-19
guardian-refs: ["G8-01 — What is Business Continuity Management", "G8-02 — Business Impact Analysis", "G8-03 — Recovery Strategies and BCPs", "G3-01 — What is ISO 27001", "G3-13 — The Certification Journey"]
---

# G8-04 — ISO 22301 — Business Continuity Management Systems

> [!abstract] What This Note Covers
> By the end of this note, you will understand ISO 22301:2019 in full — its structure, its specific requirements, how it compares to ISO 27001, what certification involves, and how to integrate a BCMS with an existing ISMS.

---

## Why This Exists

ISO 22301 is to business continuity what ISO 27001 is to information security — the international management system standard that provides both a framework for implementation and a basis for third-party certification. Understanding ISO 22301's structure, its specific requirements, and how it relates to ISO 27001 is essential for GRC professionals who advise organisations on resilience, who manage integrated management systems, or who are preparing for ISO 22301 certification.

---

## What ISO 22301 Is

**ISO 22301:2019** — *Security and resilience — Business continuity management systems — Requirements* — is the international standard specifying requirements for implementing, maintaining, and improving a Business Continuity Management System (BCMS).

**Published by**: ISO/IEC (International Organization for Standardization).
**Current version**: ISO 22301:2019 (second edition, replacing ISO 22301:2012).
**Certification**: Third-party certification by accredited certification bodies (same CBs that provide ISO 27001 certification, such as BSI, Bureau Veritas, LRQA).

**Who should be certified:**
- Financial services organisations with regulatory resilience requirements
- Critical infrastructure operators (utilities, healthcare, transport)
- Organisations that supply resilience-critical services
- Organisations where customers require formal BCM assurance
- Organisations already ISO 27001 certified who want to extend to BCM

**Who benefits from ISO 22301 without certifying:**
- Any organisation that wants to implement a structured BCM programme
- Organisations that cannot justify the cost of third-party certification but want the framework discipline

---

## ISO 22301 Structure: The High-Level Structure (HLS)

Like ISO 27001, ISO 22301:2019 follows the **High-Level Structure (HLS)** — the common framework that all modern ISO management system standards share. This is the basis for easy integration between ISO management systems.

**Clauses 4–10 (requirements):**

| Clause | Title | What it requires |
|---|---|---|
| 4 | Context of the organisation | Understanding the organisation, interested parties, and scope of the BCMS |
| 5 | Leadership | Top management commitment, BCM policy, roles and responsibilities |
| 6 | Planning | Risk assessment and BIA; opportunities and threats; BCMS objectives |
| 7 | Support | Resources, competence, awareness, communication, documented information |
| 8 | Operation | The BCM-specific operational requirements — the core of the standard |
| 9 | Performance evaluation | Monitoring, internal audit, management review |
| 10 | Improvement | Nonconformity, corrective action, continual improvement |

The structure mirrors ISO 27001 almost exactly — making integrated implementation and management efficient.

---

## Clause 4: Context of the Organisation

### 4.1 — Understanding the Organisation and Its Context

The organisation must determine external and internal issues relevant to its purpose that affect its ability to achieve the intended outcomes of the BCMS.

**External issues**: Political, economic, social, technological, environmental, legal. Regulatory environment; supply chain landscape; threat landscape; natural hazard exposure.

**Internal issues**: Organisational structure; culture; capabilities; financial situation; IT infrastructure; key dependencies.

**Key question**: What factors in the organisation's environment could affect its ability to implement an effective BCMS or to respond effectively to a disruption?

### 4.2 — Understanding the Needs and Expectations of Interested Parties

Identify interested parties and their requirements:
- Customers and clients (service continuity expectations; contractual SLAs)
- Regulators (compliance requirements; mandatory reporting obligations)
- Shareholders/owners (financial resilience expectations)
- Staff (welfare; employment obligations)
- Suppliers and partners (mutual resilience expectations)
- Society and community (essential service continuity)

For financial services, regulators (FCA, PRA, Bank of England) are a critical interested party — their operational resilience requirements directly shape BCMS scope and objectives.

### 4.3 — Determining the Scope of the BCMS

The scope defines the boundaries of the BCMS — which products, services, activities, and locations are included.

**Scope considerations:**
- Which products and services does the BCMS cover? (All or a defined subset?)
- Which sites and locations are included?
- Which organisational units are included?
- What are the boundaries with external parties (suppliers, partners)?

The scope must be documented and communicated. Certification bodies will verify that the scope accurately reflects the extent of BCMS implementation during Stage 1 audit.

**Scope exclusion**: As with ISO 27001, requirements may be excluded only where they cannot apply due to the nature of the organisation — not because they are inconvenient or resource-intensive. Exclusions must be documented with justification.

---

## Clause 5: Leadership

### 5.1 — Leadership and Commitment

Top management must demonstrate commitment to the BCMS through:
- Ensuring BCM objectives align with organisational strategy
- Integrating BCMS requirements into business processes
- Providing resources for the BCMS
- Communicating the importance of BCM and BCMS conformance
- Directing and supporting the BCMS

**The critical requirement**: BCM must be a top management responsibility, not delegated entirely to a BCM Manager or IT team. In ISO 22301, as in ISO 27001, there is no substitute for genuine senior management engagement.

### 5.2 — BCM Policy

Top management must establish a documented BCM policy that:
- Is appropriate to the purpose and context of the organisation
- Provides a framework for setting BCM objectives
- Includes a commitment to satisfy applicable requirements
- Includes a commitment to continual improvement
- Is communicated within the organisation and available to interested parties

### 5.3 — Roles, Responsibilities, and Authorities

Top management must assign and communicate responsibilities for:
- Ensuring the BCMS conforms to ISO 22301 requirements
- Reporting on BCMS performance to top management

In practice, a **Business Continuity Manager (BCM Manager)** role is typically defined — the individual responsible for maintaining the BCMS, coordinating BIA and plan development, and reporting BCM performance to management.

---

## Clause 6: Planning

### 6.1 — Actions to Address Risks and Opportunities

The organisation must identify risks and opportunities that could affect the BCMS's ability to achieve its intended outcomes, and plan actions to address them.

**Distinction**: This is not the BIA or the operational risk assessment — it is a risk assessment of the BCMS itself. What risks threaten the BCMS programme? (Key person dependency in the BCM Manager role; lack of management engagement; inadequate exercise programme; outdated plans.)

### 6.2 — BCMS Objectives and Plans to Achieve Them

The organisation must establish BCM objectives — measurable targets that demonstrate BCM performance:

**Example objectives:**
- Achieve ISO 22301 certification by Q4 2026
- Achieve RTO ≤ 4 hours for all Tier 1 processes by year-end
- Exercise all BCPs annually (100% coverage)
- Complete BIA review within 30 days of any significant organisational change
- Achieve a BCM awareness training completion rate of 100% annually

Objectives must be: specific, measurable, owned by a named individual, with a target date. SMART criteria apply.

---

## Clause 7: Support

### 7.1 — Resources

The organisation must determine and provide resources for the BCMS:
- Personnel (BCM Manager, exercise participants, plan owners)
- Financial resources (alternate sites, IT DR infrastructure, testing budget)
- Time (management review, exercise time, training time)
- External expertise (where internal expertise is insufficient)

### 7.2 — Competence

Personnel performing BCM roles must be competent — based on appropriate education, training, or experience.

**BCM competence requirements by role:**
- BCM Manager: ISO 22301 knowledge, BIA methodology, plan writing, exercise facilitation
- Crisis Management Team members: Crisis decision-making, crisis communications, leadership under pressure
- BCP plan owners: Knowledge of their specific plan, recovery procedures, escalation process
- All staff: Awareness of BCM, knowledge of what to do and who to contact in a disruption

**Evidence of competence**: Training records, professional certifications (Business Continuity Institute CBCI, ISO 22301 Lead Implementer/Auditor), exercise participation records.

### 7.3 — Awareness

All personnel must be aware of:
- The BCM policy
- Their contribution to BCMS effectiveness
- The implications of not conforming with BCMS requirements
- What to do in an emergency / disruption relevant to their role

**BCM awareness programme elements:**
- Induction training covering BCM basics and individual responsibilities
- Annual refresher (e-learning or in-person)
- Exercise participation
- Communication of BCM updates (new plans, changed contacts, exercise outcomes)

### 7.4 — Communication

The organisation must determine: what must be communicated about BCM; to whom; when; how. This includes:
- Internal communication: BCM programme updates, plan changes, exercise schedules, incident notifications
- External communication: Regulatory reporting requirements; customer notification during incidents; media communication

A communications plan for BCM events is a key artefact — covering what messages go to which audiences, through which channels, with what approval process.

### 7.5 — Documented Information

ISO 22301 requires maintaining documented information (documents and records) as evidence of BCMS operation. Key documented information items:

| Document/Record | Clause requirement |
|---|---|
| BCMS scope | 4.3 |
| BCM policy | 5.2 |
| Risk assessment (BCMS) | 6.1 |
| BCM objectives | 6.2 |
| BIA records | 8.2.2 |
| Risk assessment (operational) | 8.2.3 |
| Business continuity strategy documentation | 8.3 |
| Business Continuity Plans | 8.4 |
| Exercise programme and results | 8.5 |
| Internal audit reports | 9.2 |
| Management review records | 9.3 |
| Nonconformity and corrective action records | 10.1 |

---

## Clause 8: Operation — The BCM-Specific Requirements

Clause 8 is the most BCM-specific clause — it contains the operational requirements that distinguish ISO 22301 from a generic management system standard.

### 8.1 — Operational Planning and Control

The organisation must plan, implement, control, and review processes needed to meet BCMS requirements. Changes to processes must be controlled; unintended changes addressed.

### 8.2 — Business Impact Analysis and Risk Assessment

#### 8.2.2 — Business Impact Analysis

ISO 22301 requires a formal BIA process. The BIA must:
- Identify and prioritise business activities with their impact of disruption
- Determine RTO, RPO, and MTPD for each critical activity
- Identify resources required for critical activities

**ISO 22301 is specific**: The BIA must consider impacts over time — the standard explicitly requires assessing the impact of disruption at increasing time intervals. This is the escalating impact analysis described in G8-02.

**BIA review frequency**: The BIA must be reviewed at planned intervals and following significant organisational changes. Annual review at minimum; triggered review when significant changes occur (new products, new systems, acquisitions, major organisational restructuring).

#### 8.2.3 — Risk Assessment

In addition to the BCMS-level risk assessment (Clause 6.1), Clause 8.2.3 requires an operational risk assessment — identifying scenarios that could cause disruptions to critical activities and assessing their likelihood and potential impact.

**Risk assessment outputs:**
- Risk register of disruption scenarios
- Risk ratings (likelihood × impact)
- Risk treatment decisions (accept, mitigate, transfer, avoid)
- Risk mitigation actions tracked in treatment plan

### 8.3 — Business Continuity Strategy

ISO 22301 requires documented business continuity strategies — specifically addressing how the organisation will:
- Protect prioritised activities
- Stabilise, continue, resume, and recover activities
- Mitigate, respond to, and manage impacts
- Restore normal operations

**Strategy documentation must cover:**
- Resource requirements for each critical activity (people, premises, technology, data, suppliers)
- Recovery priorities and sequence
- Recovery time commitments (RTOs)
- Assumptions underlying the strategies

### 8.4 — Business Continuity Plans and Procedures

ISO 22301 requires documented business continuity plans. The standard specifies that plans must include:

**(a)** Defined purpose and scope
**(b)** How they will be invoked and by whom
**(c)** Communication procedures (internal and external)
**(d)** How the organisation will manage the impacts of a disruption
**(e)** How to restore or resume normal operations
**(f)** Dependencies and interaction with other processes

**Additional requirements:**
- Plans must be updated following exercises and real incidents
- Plans must be reviewed at planned intervals
- Plans must be available when needed — including when primary systems are unavailable

**Roles and responsibilities in plans must be defined**: Named individuals for critical roles; alternates identified; contact information current.

### 8.5 — Exercise Programme

ISO 22301 explicitly requires an exercise programme — not just a single annual exercise. The programme must:
- Exercise BCPs and procedures at planned intervals
- Ensure exercises are realistic and test the actual plans
- Identify gaps and improvements
- Result in documented outcomes and lessons learned

**Types of exercises that satisfy ISO 22301**: Tabletop exercises, simulation exercises, functional exercises, full interruption tests. The standard does not mandate specific exercise types — it requires that exercises are sufficient to demonstrate that plans are effective.

**Exercise frequency**: The standard requires exercises at planned intervals — the frequency must be defined and justified. Most organisations exercise major BCPs annually (full tabletop) with more frequent targeted exercises for critical functions.

**Post-exercise actions**: Exercise outcomes must be documented. Identified gaps must be addressed through a formal corrective action process. The next BCP review must incorporate lessons learned.

---

## Clause 9: Performance Evaluation

### 9.1 — Monitoring, Measurement, Analysis, and Evaluation

The organisation must monitor and measure BCM performance:
- BCM objective achievement (RTO achievement in exercises; exercise completion rates; plan currency)
- BCMS conformance (are requirements being met?)
- Key performance indicators (KPIs) reported to management

**Example KPIs:**
- Percentage of BCPs exercised in the last 12 months
- Percentage of BCPs reviewed/updated in the last 12 months
- Exercise pass/fail rate
- Time to complete BIA review following significant change
- Number of outstanding corrective actions from exercises

### 9.2 — Internal Audit

The organisation must conduct internal audits at planned intervals to assess whether the BCMS conforms to ISO 22301 requirements and is effectively implemented.

Internal audits follow the same principles as ISO 27001 internal audits (independence, evidence-based, systematic) — see G3-14 for detailed internal audit methodology.

**BCM-specific audit focus areas:**
- BIA currency and completeness
- BCP completeness and currency
- Exercise programme execution and follow-up
- Management engagement and review
- Resource adequacy
- Corrective action closure

### 9.3 — Management Review

Top management must review the BCMS at planned intervals (at minimum annually). Inputs must include:
- Status of actions from previous reviews
- Changes in context, interested parties, risks, and opportunities
- BCM performance (KPIs, exercise results, incident performance)
- Internal audit results
- Corrective action status
- Opportunities for continual improvement

Management review outputs must include decisions on BCMS changes and resource allocations.

---

## Clause 10: Improvement

### 10.1 — Nonconformity and Corrective Action

When a nonconformity occurs (exercise reveals a plan gap; an incident exposes a strategy failure; an audit identifies a process not being followed), the organisation must:
1. React to the nonconformity and control it
2. Evaluate the need for corrective action (root cause analysis)
3. Implement corrective action
4. Review effectiveness of corrective action

The corrective action process is identical in principle to ISO 27001 — see G3-15 for nonconformity classification and G3-09 for the improvement process.

### 10.2 — Continual Improvement

The organisation must continually improve the suitability, adequacy, and effectiveness of the BCMS. This is demonstrated through:
- Improvements following exercises
- Incorporation of lessons learned from real incidents
- Response to changing organisational context
- Enhancement of BCM capabilities over time

---

## ISO 22301 Certification Process

The certification process mirrors ISO 27001 certification:

**Stage 1 (Documentation Review)**: The auditor reviews BCMS documentation — scope, policy, BIA records, risk assessment, strategies, plans, exercise records. Assesses readiness for Stage 2.

**Stage 2 (On-site Assessment)**: The auditor conducts a full assessment — interviewing management and staff, reviewing evidence, testing that plans are documented and exercisable, assessing that the BIA is current and credible.

**Ongoing: Surveillance Audits**: Annual surveillance audits verify continued conformance.

**Recertification**: Full reassessment every 3 years.

**Key Stage 2 audit focus areas for ISO 22301:**
- Is the BIA credible and current? (Not generic; reflects actual business processes)
- Are BCPs specific and actionable? (Could an unfamiliar person execute them?)
- Has the exercise programme been executed as planned?
- Were exercise findings addressed through corrective action?
- Is management genuinely engaged? (Not just formally involved)
- Are plans accessible when needed? (Not just on primary IT systems)

---

## Integrating ISO 22301 with ISO 27001

For organisations already holding ISO 27001 certification, ISO 22301 integration is highly efficient. The frameworks share the same management system structure and many operational process requirements.

**Shared elements (implement once):**
- Context analysis (Clause 4.1) — relevant to both ISMS and BCMS scope
- Policy framework — BCM policy sits alongside information security policy
- Risk assessment methodology — consistent approach for both
- Competence and training management — single training records system
- Internal audit programme — single audit programme covers both standards
- Management review — single review covers both ISMS and BCMS performance
- Document control — single documented information management system
- Corrective action process — single corrective action register

**BCMS-specific elements:**
- BIA (not required by ISO 27001, required by ISO 22301)
- Business continuity strategies (specific to ISO 22301)
- BCPs and DRPs (referenced in ISO 27001 but defined and detailed in ISO 22301)
- Exercise programme (referenced in ISO 27001 A.5.29 but required in depth by ISO 22301 8.5)
- Crisis management plan (not required by ISO 27001; required by ISO 22301)

**ISMS-specific elements:**
- Information security risk assessment (broader than BCM risk assessment)
- Statement of Applicability (specific to ISO 27001)
- Full Annex A control implementation (93 controls)
- Security monitoring and logging
- Vulnerability management

**Integrated management system certificate**: Organisations can hold a single integrated management system certificate covering both ISO 27001 and ISO 22301 — audited by the same CB using a combined audit programme. This reduces cost and administrative burden while demonstrating both standards.

---

## Key Differences Between ISO 22301 and ISO 27001

| Dimension | ISO 22301 | ISO 27001 |
|---|---|---|
| **Focus** | Business continuity — maintaining operations during disruption | Information security — protecting CIA of information |
| **Core analytical process** | Business Impact Analysis (BIA) | Information security risk assessment |
| **Primary output** | BCPs, DRPs, Crisis Management Plan | SoA, Risk Register, Risk Treatment Plan |
| **Control framework** | No Annex A — strategy and plan requirements defined in Clause 8 | Annex A — 93 controls to be selected based on risk assessment |
| **Exercise requirement** | Explicit exercise programme requirement (Clause 8.5) | General testing requirement (A.5.29; A.8.13) |
| **Scope** | Business processes and the resources supporting them | Information assets and their security |
| **Incident focus** | Any disruption to business operations (fire, flood, pandemic, IT failure) | Information security incidents (breach, cyberattack) |

---

## Common Mistakes and Failures

**1. BCMS scope too narrow.**
The BCMS covers only IT systems — not the people, premises, or suppliers that business processes depend on. A BIA that maps only IT systems misses the most common cause of business disruption (people availability) and the most impactful (premises unavailability).

**2. BIA not updated after organisational changes.**
A BIA from two years ago still referenced a critical team of 12 people who operated from a specific office. That team has grown to 40, moved to a different office, and adopted new systems. The BIA is useless for recovery planning for the current organisation.

**3. Exercises conducted but findings not acted upon.**
Exercise reports document gaps. No corrective actions are created. At the next exercise, the same gaps appear. ISO 22301 requires not just exercises but the follow-through that makes them useful.

**4. Crisis Management Team not exercised.**
BCPs are exercised. IT DR is tested. But the Crisis Management Team — the senior leaders who must coordinate the overall response — has never practiced together under pressure. The first time the CMT coordinates in a real crisis is the worst time to discover that decision-making is unclear and communication is dysfunctional.

**5. BCPs stored in inaccessible locations.**
Plans stored on a SharePoint site that requires VPN access. When VPN is unavailable (because the incident is an IT outage), nobody can access the plans. BCPs must be accessible through multiple means — printed copies, cloud storage accessible via personal devices, offline copies distributed to key staff.

---

## Exam Angle

**CISM:**
- Domain 4 (Incident Management) — ISO 22301 is the definitive BCM standard. CISM candidates should understand its structure, key clauses, and relationship to incident management.

**CRISC:**
- Domain 3 (Risk Response) — ISO 22301 represents a risk response framework for operational disruption risks. The BIA and continuity strategy selection align directly with CRISC risk response methodology.

**CISSP:**
- Domain 7 (Security Operations) — ISO 22301 is the BCM standard referenced in CISSP study materials. Know its structure, key requirements (BIA, BCPs, exercise programme), and relationship to ISO 27001.

**ISO 27001 Lead Auditor:**
- Understanding ISO 22301 enables auditors to assess A.5.29–A.5.30 (ICT continuity) in the context of a formal BCM standard. Auditors working with organisations holding both certificates should understand the integration opportunities and common audit approach.

---

## GUARDIAN's Take

ISO 22301 provides the most rigorous framework for business continuity management available — but its value is only realised when it is implemented with genuine business engagement, credible BIAs, specific BCPs, and honest exercise programmes.

The certification journey for ISO 22301 is, in my view, slightly more demanding than ISO 27001 — not because the clauses are more complex, but because the auditor can verify operational reality more directly. An auditor reviewing BCPs can immediately tell whether they are specific and actionable or generic and aspirational. An auditor asking the Crisis Management Team to walk through a scenario can immediately assess whether they have genuinely prepared or merely appointed themselves to the role.

The organisations that derive the most value from ISO 22301 are those that treat it as a journey of genuine resilience building, not a certification target. They use the BIA to discover critical dependencies they didn't know they had. They use the exercise programme to find gaps in their plans before those gaps cause real harm. They use the management review to engage their board in honest conversations about the organisation's resilience posture.

For organisations already certified to ISO 27001, ISO 22301 is the natural next step — using the same management system infrastructure, adding the BCM-specific analytical and planning rigour that ISO 27001 references but does not fully specify. The integrated certificate demonstrates comprehensive management of both security and resilience — a powerful proposition for customers, regulators, and investors who depend on the organisation's ability to continue delivering under any conditions.

---
*Module: Module 8 — Business Continuity | Guardian Curriculum*
