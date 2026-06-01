---
tags: [guardian, grc, module-7, nist-csf, cybersecurity-framework, nist, risk-management]
module: 7
cert-coverage: [cism, crisc, cissp, iso27001-la]
difficulty: intermediate
date: 2026-04-19
guardian-refs: ["G1-08 — GRC Frameworks Overview", "G7-01 — COBIT", "G7-03 — NIST SP 800-53", "G7-07 — Framework Decision Guide", "G3-01 — What is ISO 27001"]
---

# G7-02 — NIST CSF 2.0 — The Cybersecurity Framework

> [!abstract] What This Note Covers
> By the end of this note, you will understand NIST CSF 2.0 in full — its origin, its six functions, its tiers and profiles, how it differs from v1.1, how it relates to ISO 27001 and other frameworks, and when and why to use it.

---

## Why This Exists

In February 2013, US President Obama signed Executive Order 13636 — "Improving Critical Infrastructure Cybersecurity." The order directed NIST to work with industry to develop a voluntary cybersecurity framework for critical infrastructure. What emerged was far more widely adopted than anyone anticipated: the NIST Cybersecurity Framework became the de facto standard cybersecurity governance framework for US organisations and gained significant international adoption.

NIST CSF 2.0, released in February 2024, represents the most significant update in the framework's decade-long history. It added a sixth function (Govern), expanded its intended audience beyond critical infrastructure to all organisations, and significantly updated its content to reflect the current threat landscape and lessons from a decade of CSF adoption.

For GRC professionals, CSF 2.0 is essential knowledge — particularly those working with US federal contractors, critical infrastructure organisations, and any UK or EU organisations with US parent companies or US regulatory obligations. It is also the most accessible and widely implemented entry point into structured cybersecurity governance for organisations without existing compliance frameworks.

---

## Origins and Context

**What is NIST?** The National Institute of Standards and Technology is a US government agency within the Department of Commerce. NIST develops standards, guidelines, and reference data to support US industry, science, and technology. In cybersecurity, NIST publishes the most widely referenced standards in the world — including NIST SP 800-53 (security controls for federal systems), NIST SP 800-37 (risk management framework), and the Cybersecurity Framework.

**Who uses CSF?**
- US federal agencies and contractors (de facto requirement in many contexts)
- US critical infrastructure sectors (energy, finance, healthcare, transportation, water)
- US state and local governments
- Global organisations with US operations or customers
- Any organisation seeking a structured but flexible cybersecurity governance approach

**Voluntary vs mandatory**: CSF was designed as a voluntary framework. However, for US federal contractors and regulated entities in certain sectors, it is effectively mandatory — regulators and contract requirements reference it. NIST SP 800-171 (protecting controlled unclassified information) and the Cybersecurity Maturity Model Certification (CMMC) for US defence contractors both build on CSF.

---

## CSF 2.0: The Six Functions

The most fundamental change from v1.1 to v2.0 is the addition of a sixth function: **GOVERN**. The original five functions (IDENTIFY, PROTECT, DETECT, RESPOND, RECOVER) are retained and updated.

The six functions represent the complete cybersecurity lifecycle — from governance through detection and recovery:

```
        GOVERN
           │
    ┌──────┼──────┐
    │      │      │
IDENTIFY  PROTECT DETECT
    │      │      │
    └──────┼──────┘
           │
      ┌────┴────┐
   RESPOND   RECOVER
```

### Function 1: GOVERN (GV) — NEW in v2.0

**Purpose**: Establish, communicate, and monitor the organisation's cybersecurity risk management strategy, expectations, and policy.

**What it covers**:
- Organisational context — understanding the mission, legal obligations, stakeholder expectations, and risk tolerance that inform cybersecurity decisions
- Risk management strategy — establishing risk appetite and tolerance, and how risk decisions are made
- Cybersecurity supply chain risk management — governing third-party and supply chain cybersecurity risk
- Roles and responsibilities — ensuring accountability for cybersecurity is clearly assigned
- Policies, processes, and procedures — the governance infrastructure that directs all other functions
- Oversight — how cybersecurity risk is monitored and how accountability is maintained

**Why it was added**: The original CSF's five functions focused on operational cybersecurity activities. A decade of implementation showed that organisations could implement the five functions operationally without the governance foundation that makes them effective. Adding GOVERN acknowledges that cybersecurity is a governance imperative, not just a technical activity. The CISO must engage the board; the board must set risk appetite; accountability must be clear.

**GOVERN categories (selected):**
- GV.OC — Organisational Context
- GV.RM — Risk Management Strategy
- GV.RR — Roles, Responsibilities, and Authorities
- GV.PO — Policy
- GV.OV — Oversight
- GV.SC — Cybersecurity Supply Chain Risk Management

### Function 2: IDENTIFY (ID)

**Purpose**: Develop an organisational understanding to manage cybersecurity risk to systems, people, assets, data, and capabilities.

**What it covers**:
- Asset management — identifying what systems, data, and resources exist and their relative criticality
- Business environment — understanding the organisation's role, mission, dependencies, and stakeholders
- Risk assessment — understanding cybersecurity risks and how they affect organisational objectives
- Improvement — identifying improvement activities from assessments

**IDENTIFY categories:**
- ID.AM — Asset Management (inventory of hardware, software, data, users, external systems)
- ID.RA — Risk Assessment (identifying, prioritising, and managing cybersecurity risks)
- ID.IM — Improvement (processes for continuous improvement)

**Connection to ISO 27001**: IDENTIFY maps closely to ISO 27001 Clauses 4 (context), 5 (leadership/roles), and 6 (planning/risk assessment). Asset inventory (ID.AM) maps to A.5.9; risk assessment (ID.RA) maps to Clause 6.1.2.

### Function 3: PROTECT (PR)

**Purpose**: Develop and implement appropriate safeguards to ensure delivery of critical services.

**What it covers**:
- Identity management, authentication, and access control
- Awareness and training
- Data security
- Platform security (secure configuration, vulnerability management)
- Technology infrastructure resilience

**PROTECT categories:**
- PR.AA — Identity Management, Authentication, and Access Control
- PR.AT — Awareness and Training
- PR.DS — Data Security
- PR.PS — Platform Security
- PR.IR — Technology Infrastructure Resilience

**Connection to ISO 27001**: PROTECT maps extensively to ISO 27001 Annex A Categories 5–8. PR.AA maps to A.5.15–A.5.18 and A.8.2–A.8.5; PR.DS maps to A.5.12, A.8.24; PR.PS maps to A.8.8–A.8.9.

### Function 4: DETECT (DE)

**Purpose**: Develop and implement appropriate activities to identify the occurrence of a cybersecurity event.

**What it covers**:
- Continuous monitoring — monitoring systems, networks, and applications for anomalous activity
- Adverse event analysis — identifying and analysing anomalies that may indicate cybersecurity events

**DETECT categories:**
- DE.CM — Continuous Monitoring
- DE.AE — Adverse Event Analysis

**Connection to ISO 27001**: DETECT maps to A.8.15 (logging), A.8.16 (monitoring activities), and A.5.24 (incident management planning). The emphasis on continuous monitoring in CSF's DETECT function aligns with ISO 27001's monitoring and measurement requirements.

### Function 5: RESPOND (RS)

**Purpose**: Develop and implement appropriate activities to take action regarding a detected cybersecurity incident.

**What it covers**:
- Incident management — managing the incident response lifecycle
- Incident analysis — analysing incidents to understand their nature and impact
- Incident response reporting and communication — communicating with stakeholders about incidents
- Incident mitigation — containing and mitigating incident impacts
- Improvements — identifying lessons learned and implementing improvements

**RESPOND categories:**
- RS.MA — Incident Management
- RS.AN — Incident Analysis
- RS.CO — Incident Response Reporting and Communication
- RS.MI — Incident Mitigation
- RS.IM — Improvements

**Connection to ISO 27001**: RESPOND maps to A.5.24–A.5.27 (incident management, response, and learning). GDPR breach notification obligations also connect here — the 72-hour notification requirement requires the incident response process to include regulatory notification within RESPOND.

### Function 6: RECOVER (RC)

**Purpose**: Develop and implement appropriate activities to maintain plans for resilience and to restore any capabilities or services that were impaired due to a cybersecurity incident.

**What it covers**:
- Incident recovery plan execution — implementing recovery plans after a cybersecurity incident
- Incident recovery communication — communicating recovery activities with stakeholders

**RECOVER categories:**
- RC.RP — Incident Recovery Plan Execution
- RC.CO — Incident Recovery Communication

**Connection to ISO 27001**: RECOVER maps to A.8.13 (backup), A.8.14 (redundancy), and A.5.29–A.5.30 (business continuity). ISO 22301 (Business Continuity Management) provides the detailed management system framework that CSF's RECOVER function references.

---

## CSF 2.0 Tiers

CSF uses four **Tiers** to describe the sophistication of an organisation's cybersecurity risk management practices — a rough maturity model:

| Tier | Name | Description |
|---|---|---|
| **Tier 1** | Partial | Cybersecurity risk management is not formalised. Practices are ad hoc, reactive, and applied irregularly. Risk awareness may exist but is not systematically applied. |
| **Tier 2** | Risk Informed | Risk management practices are approved by management but not consistently applied across the organisation. Awareness exists at management level; sharing of cybersecurity information is informal. |
| **Tier 3** | Repeatable | Formally defined and approved risk management practices that are consistently applied. The organisation understands its dependencies and partners and considers cybersecurity in risk management. |
| **Tier 4** | Adaptive | Continuously improves cybersecurity based on lessons learned and predictive indicators. Active participation in cybersecurity information sharing. Cybersecurity risk management is fully integrated with organisational risk management. |

**Important note**: CSF Tiers are not a prescriptive maturity target — not every organisation needs to reach Tier 4. The appropriate tier depends on the organisation's risk environment, regulatory requirements, and resources. A small organisation in a low-risk sector may be well-positioned at Tier 2. A large financial institution handling critical national infrastructure data should be at Tier 4.

Tiers are distinct from the NIST SP 800-53 maturity model and from ISO 27001 capability levels — they describe the overall approach to cybersecurity governance, not the maturity of specific controls.

---

## CSF 2.0 Profiles

A **Profile** represents the alignment of the CSF Functions, Categories, and Subcategories with the organisation's business requirements, risk tolerance, and resources.

**Two profile types:**

**Current Profile**: Describes the outcomes currently being achieved — the cybersecurity posture the organisation has right now.

**Target Profile**: Describes the desired outcomes — the cybersecurity posture the organisation wants to achieve.

**The gap between Current and Target**: The difference between the two profiles identifies the priorities for cybersecurity improvement — the areas where the organisation falls short of its desired state. This gap analysis drives the cybersecurity improvement roadmap.

**Community Profiles**: NIST and industry groups publish pre-built Community Profiles for specific sectors (financial services, healthcare, manufacturing). These provide sector-specific Target Profiles that organisations can adopt or adapt — reducing the effort of defining target outcomes from scratch.

**Profiles in practice**: An organisation might define a Target Profile based on its risk appetite and regulatory requirements, then conduct an assessment to establish the Current Profile. The gap drives the programme priorities. At the next annual assessment, the Current Profile is reassessed — progress toward the Target Profile is measurable and reportable to the board.

---

## Key Differences Between CSF 1.1 and CSF 2.0

| Dimension | CSF 1.1 | CSF 2.0 |
|---|---|---|
| **Functions** | 5 (IDENTIFY, PROTECT, DETECT, RESPOND, RECOVER) | 6 (+ GOVERN) |
| **Audience** | Critical infrastructure primarily | All organisations (explicitly) |
| **Supply chain** | Limited coverage | Dedicated GOVERN category (GV.SC) |
| **Privacy** | Separate Privacy Framework | Integrated within CSF 2.0 |
| **Organisational profiles** | Present but limited guidance | Significantly expanded; Community Profiles |
| **Implementation guidance** | Informative references (other frameworks) | Quick-Start Guides; implementation examples |
| **Measurement** | Limited | Enhanced measurement and performance guidance |

---

## CSF 2.0 and ISO 27001: The Relationship

CSF 2.0 and ISO 27001 address the same fundamental challenge — managing cybersecurity risk — through different approaches. Understanding the relationship enables integrated programme management.

**CSF as an outcomes framework; ISO 27001 as a management system**: CSF defines what outcomes an organisation should achieve (identify risks, protect systems, detect incidents, respond effectively, recover, govern appropriately). ISO 27001 defines a management system for achieving and continuously improving those outcomes. CSF tells you what; ISO 27001 tells you how to manage the process of achieving it.

**Practical alignment**: Many organisations use CSF to structure their cybersecurity programme communications (particularly with US stakeholders) while using ISO 27001 as the underlying management system. The ISMS implements the controls; CSF provides the common language for reporting to the board and to US partners.

**NIST's mapping guidance**: NIST publishes informative references that map CSF subcategories to specific controls in other frameworks — including ISO 27001. For example:
- DE.CM-01 (Networks and network services are monitored) → maps to ISO 27001 A.8.16 (Monitoring activities)
- PR.AA-02 (Identities are proofed and bound to credentials) → maps to A.5.16 (Identity management)
- GV.RM-01 (Risk management objectives are established) → maps to ISO 27001 Clause 6.1.1

This mapping enables organisations to demonstrate how their ISO 27001 ISMS satisfies CSF requirements — without building a separate compliance programme.

---

## When to Use NIST CSF

**CSF is the right choice when:**
- The organisation is US-based or has significant US federal government or US defence contractor relationships
- The organisation needs a widely recognised, vendor-neutral framework for communicating cybersecurity posture to US stakeholders
- The organisation is building a cybersecurity programme from scratch and wants a structured but flexible starting point
- The organisation needs to satisfy CMMC, US federal contractor requirements, or sector-specific US regulatory requirements that reference CSF

**CSF complements ISO 27001 when:**
- An ISO 27001-certified organisation needs to demonstrate CSF compliance to US partners or regulators
- The organisation wants to use CSF's GOVERN function to strengthen board-level cybersecurity governance
- The organisation is building a global programme that needs both ISO 27001 (for EU/UK stakeholders) and CSF (for US stakeholders)

**CSF is less appropriate when:**
- The organisation operates exclusively in the EU/UK market with no US regulatory exposure — ISO 27001 is typically the preferred framework in European markets
- The organisation needs a management system framework with third-party certification — CSF does not have a certification programme (though ISO 27001 does)

---

## Common Mistakes and Failures

**1. Treating CSF as a compliance checklist.**
CSF is an outcomes framework — it describes what to achieve, not exactly how. Treating it as a checkbox compliance exercise produces documentation of desired outcomes without the implementation that achieves them.

**2. Confusing CSF Tiers with maturity targets.**
Not every organisation needs Tier 4. The appropriate tier depends on risk profile, regulatory requirements, and resources. An organisation that drives toward Tier 4 without the resources to sustain it creates compliance theatre, not genuine capability.

**3. Building a CSF programme separate from ISO 27001.**
For organisations with both obligations, building separate programmes is wasteful. Map CSF outcomes to existing ISO 27001 controls; demonstrate CSF compliance through the ISMS rather than a parallel programme.

**4. Ignoring the GOVERN function because it was not in v1.1.**
The GOVERN function is the most significant addition in v2.0 and addresses the most common failure mode in cybersecurity programmes — the absence of governance and accountability. Implementing all five original functions without GOVERN produces an operationally active but strategically ungoverned cybersecurity programme.

**5. Not using Community Profiles.**
Starting a CSF programme from scratch when a Community Profile for the organisation's sector already exists. Community Profiles represent collective industry wisdom about what a Target Profile should look like — they are a significant shortcut.

---

## Exam Angle

**CISM:**
- Domain 1 (Information Security Governance) — CSF's GOVERN function maps directly to CISM's governance domain. CISM candidates should understand CSF's governance structures and how they relate to CISM's governance requirements.

**CRISC:**
- Domain 1 (IT Risk Identification) and Domain 3 (Risk Response) — CSF's IDENTIFY and PROTECT functions cover risk identification and treatment. The tiered approach (Tier 1–4) provides a maturity model for risk management capabilities.

**CISSP:**
- Domain 1 (Security and Risk Management) — CSF is a frequently referenced framework in CISSP. Know the six functions, the tier model, and the relationship to other standards.

**ISO 27001 Lead Auditor:**
- CSF is an informative reference in the broader GRC landscape. Auditors working with US organisations or global organisations should understand how CSF maps to ISO 27001 and how both frameworks can be satisfied through a single ISMS.

---

## GUARDIAN's Take

NIST CSF 2.0's most important addition is also its most conceptually simple: GOVERN. The original five functions described what to do operationally — identify assets, protect systems, detect incidents, respond, recover. They said nothing about how cybersecurity should be governed — who is accountable, what the risk tolerance is, how the board stays informed.

A decade of CSF implementation taught NIST that organisations could become proficient at all five operational functions while still having inadequate governance — no board engagement, no defined risk appetite, no clear accountability for cybersecurity outcomes. The GOVERN function corrects this by putting governance at the centre of the framework.

For GRC professionals, this is a validation of something we have known: the technical security programme is only as effective as the governance that directs it. MFA, vulnerability management, logging — all valuable. But without a board that understands the risk posture, a defined risk appetite that drives prioritisation, and clear accountability for security outcomes — those technical controls are implemented without strategic direction and improved without strategic intent.

CSF 2.0's GOVERN function is not a new idea. ISO 27001 has always required management commitment, risk appetite definition, and management review. COBIT's EDM domain has always addressed governance. What CSF 2.0 does is bring this governance imperative into a framework that millions of US organisations use as their primary cybersecurity reference. That is significant — because it means that governance language will now be more natural in conversations with US CISOs and boards than it was before v2.0.

Use CSF 2.0's GOVERN function as the conversation starter with your board. Its simple six-function model is accessible to non-technical executives. The Current Profile / Target Profile gap analysis is a board-level conversation tool. Start there — then build the governance that makes everything else work.

---
*Module: Module 7 — Governance Frameworks | Guardian Curriculum*
