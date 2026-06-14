---
tags: [guardian, grc, module-8, business-continuity, bcm, iso-22301, resilience, bcp]
module: 8
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-19
guardian-refs: ["G1-08 — GRC Frameworks Overview", "G3-10 — Annex A Controls — A.5.29–A.5.30", "G7-06 — ITIL — Service Continuity Management", "G8-02 — BIA", "G8-03 — Recovery Strategies", "G8-04 — ISO 22301"]
---

# G8-01 — What is Business Continuity Management

> [!abstract] What This Note Covers
> By the end of this note, you will understand what Business Continuity Management is, why it exists, how it relates to information security, the key terminology, the BCM lifecycle, and how ISO 22301 provides the management system framework for BCM.

---

## Why This Exists

On 19 July 2024, a faulty content configuration update to CrowdStrike's Falcon sensor caused approximately 8.5 million Windows devices worldwide to enter a boot loop — displaying the Blue Screen of Death. Airlines cancelled thousands of flights. Hospitals reverted to paper records. Banks, broadcasters, and emergency services were disrupted. The incident had no malicious actor — it was a software quality failure — but its impact rivalled the most significant cyberattacks in history.

Organisations that had invested in business continuity planning — with tested fallback procedures, manual workarounds, and clear escalation plans — recovered faster and with less disruption. Organisations that relied entirely on their IT systems, with no documented alternative procedures, faced complete operational paralysis.

Business Continuity Management is not about preventing disruptions — it is about ensuring that when disruptions occur (and they will occur), the organisation can continue to operate its critical functions, protect its stakeholders, and recover to normal operations within an acceptable timeframe.

---

## What Business Continuity Management Is

**Business Continuity Management (BCM)** is a holistic management process that identifies potential threats to an organisation and the impacts those threats — if realised — might have on business operations. BCM provides a framework for building organisational resilience with the capability for an effective response that safeguards the interests of key stakeholders, reputation, brand, and value-creating activities.

**The defining characteristic of BCM** is its focus on continuity — ensuring that the organisation can continue to deliver its critical products and services even when normal operations are severely disrupted. BCM is not primarily about IT recovery (though IT recovery is often a component); it is about business operational recovery.

**ISO 22301:2019** — *Security and resilience — Business continuity management systems — Requirements* — is the international standard for BCM. It provides a management system framework (parallel to ISO 27001 for information security) that organisations implement and can be certified against.

---

## Why BCM Exists: The Threat Landscape

BCM exists because organisations face disruptions from many sources:

**Technology failures**: Hardware failures, software bugs (CrowdStrike 2024), data centre outages, network failures, power supply failures.

**Cyber incidents**: Ransomware (encrypting critical systems), DDoS attacks, supply chain compromises, major data breaches requiring system shutdown.

**Natural events**: Flooding (UK flooding events), extreme weather (storms, heat events), fire, pandemic (COVID-19 demonstrated the impact of a global pandemic on business operations).

**Human factors**: Staff absence at scale (strikes, pandemic), key personnel loss (resignation, accident), human error causing critical system failure.

**Supply chain disruption**: Critical supplier failure, logistics disruption, raw material shortage.

**External events**: Power grid failure, telecommunications infrastructure failure, civil unrest, regulatory enforcement action requiring operational change.

**The common thread**: All of these events can disrupt the organisation's ability to deliver its critical products and services. BCM provides the capability to continue delivery despite the disruption — or to resume delivery within an acceptable timeframe.

---

## Key BCM Terminology

**Business Continuity**: The capability of an organisation to continue the delivery of products and services within acceptable time frames at predefined capacity during a disruption. (ISO 22301 definition)

**Business Continuity Plan (BCP)**: Documented information (procedures, contacts, recovery steps) that guides an organisation's response to a disruption affecting specific business functions.

**Business Impact Analysis (BIA)**: The process of analysing the impact of a disruption on the organisation — identifying the time-sensitivity of each business process, the consequences of disruption, and the minimum resources needed to maintain operations. (Covered in G8-02)

**Recovery Time Objective (RTO)**: The maximum acceptable time within which a business process must be restored following a disruption. If the RTO for a critical process is 4 hours, the process must be operational again within 4 hours of a disruptive event.

**Recovery Point Objective (RPO)**: The maximum acceptable period of data loss following a disruption. If the RPO for a system is 2 hours, the organisation can tolerate losing up to 2 hours of data — but no more.

**Maximum Tolerable Period of Disruption (MTPD)**: The maximum duration of time during which a product or service can be unavailable before the disruption causes unacceptable consequences (regulatory breach, irreversible customer loss, financial failure, reputational collapse).

**Minimum Business Continuity Objective (MBCO)**: The minimum level of services and/or products that is acceptable to the organisation to achieve its business objectives during a disruption.

**Crisis Management**: The overall management of a crisis event — coordinating the organisation's response, decision-making, and communication. Crisis management is broader than BCP execution; it includes the strategic decisions and communications required to manage a major disruption.

**Disaster Recovery (DR)**: The process of restoring IT systems and data after a disruption. DR is a subset of BCM — it addresses the IT recovery component. BCM addresses the broader business recovery, of which DR is one element.

**Business Continuity Strategy**: The approach selected to resume business operations following a disruption. Strategies may include: manual workarounds, alternate sites, third-party service providers, cross-training staff, data replication.

**Exercise and Test**: The process of validating that BCM plans and strategies work as intended. Types: walkthrough (table-top discussion), simulation (realistic scenario exercise), full interruption (actual activation of the BCP).

---

## The BCM Lifecycle

BCM is not a one-time project — it is an ongoing management cycle. ISO 22301 structures BCM as a management system (Plan-Do-Check-Act), but the BCM-specific activities follow a lifecycle:

### Stage 1: BCM Programme Management

Establishing the governance structure, scope, and policy for BCM:
- Board-level commitment and sponsorship
- Defining BCM scope (which products, services, and activities are covered)
- Appointing a BCM Manager or Programme Director
- BCM policy statement
- Resource allocation (budget, personnel)
- Integration with enterprise risk management

### Stage 2: Understanding the Organisation

The analytical foundation of BCM — understanding what the organisation does and what matters most:

**Business Impact Analysis (BIA)**: Identifying critical business processes, their dependencies, the impact of disruption at various time intervals, and the minimum resource requirements.

**Risk Assessment**: Identifying the scenarios that could disrupt critical processes and assessing their likelihood and potential impact.

The BIA determines RTOs, RPOs, and MTPDs for each critical process. These drive the strategy and plan development stages.

### Stage 3: Determining the Business Continuity Strategy

Based on BIA findings, selecting recovery strategies for each critical process:
- Which functions need to continue during a disruption? (MBCO)
- How will they continue? (People, premises, technology, suppliers, data)
- What is the cost of the strategy vs the cost of non-recovery?

Strategies may include: alternate workplace locations, remote working capabilities, manual workarounds, cross-trained staff, alternative suppliers, data replication, cloud-based recovery environments.

### Stage 4: Developing and Implementing Business Continuity Plans

Translating the strategies into documented, actionable plans:
- Business Continuity Plans (BCPs) for each critical function
- IT Disaster Recovery Plans (DRPs) for critical systems
- Crisis Management Plan (CMP) for overall incident coordination
- Crisis Communications Plan (for stakeholder communication)

BCPs must be specific — naming individuals, identifying resources, providing step-by-step instructions. Generic BCPs that could apply to any organisation provide no operational value.

### Stage 5: Exercising and Testing

Validating that plans work and identifying gaps:

**Walkthrough/table-top exercise**: Participants discuss how they would respond to a hypothetical scenario. No actual systems are affected. Useful for identifying procedural gaps and training participants.

**Simulation exercise**: A more realistic scenario exercise, potentially involving simulated disruptions. Participants practice their roles with greater fidelity.

**Functional exercise**: Testing specific aspects of the BCP — for example, testing the remote working capabilities during a simulated office unavailability.

**Full interruption test**: Actually activating the BCP — switching to the alternate site, activating the DR environment, processing real transactions through the fallback system. The most rigorous test; the highest risk (if the fallback fails, real operations are disrupted).

ISO 22301 requires exercises to be conducted at planned intervals and after significant changes to the organisation or its plans. Annual exercises at minimum; more frequently for critical plans.

### Stage 6: Maintaining and Reviewing BCM

Keeping plans current as the organisation changes:
- BCPs reviewed at defined intervals (annually minimum)
- Plans updated following changes to processes, personnel, systems, or locations
- BIA reviewed to reflect changes in criticality
- Lessons learned from exercises and actual incidents incorporated
- BCM integrated with the organisation's change management process (so changes that affect critical functions automatically trigger BCP review)

---

## BCM and Information Security: The Relationship

BCM and information security are distinct disciplines that must be closely coordinated:

**ISO 27001 requirements for BCM:**
- A.5.29: Information security continuity — controls for maintaining information security during a disruption (security must continue during BCP activation)
- A.5.30: ICT readiness for business continuity — ICT systems must have defined RTOs, RPOs, and tested recovery capabilities
- A.8.13: Backup — data backup as a BCM-enabling control
- A.8.14: Redundancy of information processing facilities — systems redundancy to support availability

**The coordination points:**

**Incident classification**: A cybersecurity incident (ransomware) may become a business continuity incident (systems unavailable, operations cannot continue). The handoff between security incident response (contain, eradicate) and business continuity response (activate BCP, maintain operations through alternative means) must be clearly defined.

**Recovery environment security**: When DR systems are activated, they must implement the same security controls as production systems. Recovering to an insecure environment creates new risks even as it restores operations.

**BIA inputs from security**: Security assessments of information assets inform the BIA's understanding of which systems are most critical and what the impact of their loss would be.

**RTO/RPO alignment**: RTOs and RPOs defined in the BIA must be achievable given the security controls in place. A highly secure system with extensive access controls may be difficult to recover quickly — security and continuity objectives must be balanced.

---

## ISO 22301: The BCM Standard

**ISO 22301:2019** is structured as a management system standard — parallel to ISO 27001, using the same Plan-Do-Check-Act approach and the same high-level structure (Annex SL).

**ISO 22301 requirements (Clauses 4–10):**

**Clause 4 — Context**: Understanding the organisation's context, interested parties, and scope of the BCMS.

**Clause 5 — Leadership**: Top management commitment, BCM policy, roles and responsibilities.

**Clause 6 — Planning**: Risk assessment and business impact analysis; strategies for achieving continuity; setting objectives.

**Clause 7 — Support**: Resources (personnel, facilities, technology), competence, awareness, communication, documented information.

**Clause 8 — Operation**: This is the most BCM-specific clause:
- Business Impact Analysis and Risk Assessment (formalised requirements)
- Business continuity strategy and solutions
- Documented business continuity plans and procedures
- Exercise programme
- Plan for post-disruptive recovery

**Clause 9 — Performance evaluation**: Internal audit, management review, monitoring and measurement.

**Clause 10 — Improvement**: Nonconformity management, corrective action, continual improvement.

**ISO 22301 certification**: Like ISO 27001, ISO 22301 is a certifiable standard. Organisations can achieve third-party certification through accredited certification bodies. ISO 22301 certification demonstrates that the BCMS is well-designed, effectively implemented, and continuously improved.

**ISO 22301 and ISO 27001 integration**: Many organisations implement ISO 22301 alongside ISO 27001 — sharing the management system infrastructure (policy framework, risk assessment, internal audit, management review) while maintaining distinct ISMS and BCMS operational processes. Integrated management systems reduce duplication and improve coherence.

---

## Regulatory and Contractual BCM Requirements

BCM is increasingly mandated by regulation and contract:

**UK Financial Services**: The Bank of England and FCA's Operational Resilience Policy (March 2022) requires UK financial services firms to identify important business services, set Impact Tolerances (analogous to MTPs), and demonstrate that they can remain within these tolerances by March 2025. This is effectively a BCM regulatory requirement for UK financial services.

**DORA (Digital Operational Resilience Act)**: EU regulation effective January 2025. Requires EU financial entities to implement ICT-related incident management, business continuity, and disaster recovery capabilities. Significantly elevates BCM requirements for EU financial services.

**NIS2 Directive**: EU regulation covering critical infrastructure and essential service operators. Requires business continuity measures as part of cybersecurity risk management.

**NHS Data Security and Protection Toolkit**: Requires NHS organisations and their suppliers to have business continuity plans covering critical systems.

**PCI DSS**: Requires business continuity planning for payment systems (Requirement 12.10 covers incident response which includes business continuity elements).

**Cyber insurance**: Increasingly, cyber insurance policies require evidence of BCM capabilities — BIA completion, documented BCPs, and regular exercises — as a condition of coverage or for premium calculation.

---

## Common Mistakes and Failures

**1. BCPs that are never tested.**
The most dangerous form of false assurance: a documented BCP that has never been exercised. The plan may reference systems that no longer exist, people who have left, locations that are no longer available, or procedures that were never operationally viable. Testing reveals these gaps; not testing perpetuates them.

**2. IT disaster recovery plans treated as BCPs.**
IT DR is one component of BCM. A BCP that is actually a DRP addresses only the technology recovery — not the business processes that depend on that technology, the alternative manual procedures that can operate without IT, or the human and premises aspects of the recovery.

**3. BCPs that are too high-level to be actionable.**
Generic plans that describe categories of action ("restore IT systems"; "communicate with customers") without naming responsible individuals, specific steps, contact details, or resource locations. During a real disruption, under stress, generic plans provide no guidance. Specific, actionable plans do.

**4. RTOs/RPOs that are aspirational rather than achievable.**
BIA workshops often produce RTOs based on what business managers want ("we need everything back within 1 hour") rather than what recovery infrastructure can deliver. RTOs must be validated against recovery capabilities — an RTO of 1 hour for a system that requires 4 hours to restore from backup is unrealistic and creates false assurance.

**5. BCM not integrated with change management.**
Significant organisational changes — new systems, office moves, key staff changes, new suppliers, new products — all affect the BCP. If BCM is not integrated with the change management process, BCPs become outdated immediately after changes occur.

**6. No crisis management capability.**
BCPs address the recovery of specific functions. But who is in charge during a major disruption? Who authorises significant decisions? Who communicates with the board, regulators, customers, and press? Without a crisis management structure, BCP execution is uncoordinated and inconsistent.

---

## Exam Angle

**CISM:**
- Domain 4 (Incident Management) includes business continuity as a critical component. CISM candidates must understand BCM terminology (RTO, RPO, MTPD, BIA), the BCM lifecycle, and the relationship between incident management and business continuity.

**CRISC:**
- Domain 3 (Risk Response) — business continuity is a risk treatment strategy (continuity/resilience) for operational disruption risks. CRISC candidates should understand how BIA drives continuity strategy selection and how RTOs/RPOs relate to risk tolerance.

**CISSP:**
- Domain 7 (Security Operations) includes business continuity and disaster recovery. Domain 1 covers BCM governance. Know the key terminology (RTO, RPO, MTPD, BIA, MBCO), the BCM lifecycle, and the difference between BCM and DR.

**ISO 27001 Lead Auditor:**
- ISO 27001 Clauses 5, 6, and Annex A controls A.5.29–A.5.30 require ICT continuity planning. Auditors must understand BCM sufficiently to assess whether continuity requirements are adequately addressed within the ISMS scope.

---

## GUARDIAN's Take

The CrowdStrike incident of July 2024 was, in many ways, the BCM exercise that most organisations hadn't planned for: a global technology failure affecting millions of systems simultaneously, with no patch available for hours and manual recovery required for each affected device individually. Organisations with tested BCPs and manual workarounds fared significantly better than those who had assumed their IT would always be available.

BCM is about the honest acknowledgement that disruption is inevitable — and the organisational investment in being able to function when it happens. Not "if" but "when." The question BCM answers is: when disruption occurs, how quickly can we continue to deliver what our customers depend on us for? The answer to that question is the product of the BIA, the strategy selection, the plan quality, and the exercise programme.

Too many organisations treat BCM as a governance requirement — producing plans that satisfy auditors but would fail catastrophically in a real disruption. The BCM programme that matters is the one where the crisis management team has actually run exercises, where BCPs include the mobile numbers of everyone responsible, where the IT DR has been tested with a real restoration from backup, where staff know what to do when IT is unavailable.

Build the programme that works — not the one that looks good on paper. The difference will matter when you need it.

---
*Module: Module 8 — Business Continuity | Guardian Curriculum*
