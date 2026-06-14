---
tags: [guardian, grc, module-7, itil, itsm, service-management, incident-management, change-management]
module: 7
cert-coverage: [cism, crisc, cissp, iso27001-la]
difficulty: intermediate
date: 2026-04-19
guardian-refs: ["G1-08 — GRC Frameworks Overview", "G7-01 — COBIT", "G7-02 — NIST CSF 2.0", "G3-10 — Annex A Controls — A.8.32 Change Management", "G3-10 — Annex A Controls — A.5.24 Incident Management"]
---

# G7-06 — ITIL — IT Service Management and Its GRC Relevance

> [!abstract] What This Note Covers
> By the end of this note, you will understand what ITIL is, how ITIL 4 is structured, the key ITIL practices most relevant to GRC, how ITIL and ISO 27001 interact, and why GRC professionals benefit from understanding ITIL even if they are not IT service managers.

---

## Why This Exists

ITIL (IT Infrastructure Library) is the world's most widely adopted IT service management framework. It defines how organisations should design, deliver, manage, and improve IT services. Over 3 million ITIL certifications have been issued globally.

For GRC professionals, ITIL matters for two reasons. First, many of the controls that ISO 27001, NIST CSF, and COBIT require — change management, incident management, problem management, service continuity — are implemented through ITIL practices. Understanding how ITIL defines these practices helps GRC professionals evaluate whether controls are genuinely operating or merely documented.

Second, the GRC function in most organisations interfaces directly with IT service management teams. Security incident response, change management security reviews, vulnerability management, and business continuity — all involve coordination between security/GRC functions and IT service management. A GRC professional who understands ITIL can work more effectively with IT operations teams and can better assess whether ITSM processes are adequate to support security objectives.

---

## What ITIL Is

**ITIL** (originally "IT Infrastructure Library") is a set of best practices for IT service management (ITSM). It was originally developed by the UK Central Computer and Telecommunications Agency (CCTA) in the 1980s to standardise IT service delivery across UK government. It evolved through commercial publication by The Stationery Office (TSO) and is now owned and maintained by **Axelos** (a joint venture between Capita and the UK Cabinet Office) and more recently by **PeopleCert** following acquisition in 2021.

**ITIL 4** is the current version, published in 2019. It builds on ITIL v3 (2011 edition) while modernising the framework for agile, DevOps, and cloud-native delivery environments.

**What ITIL is not:**
- It is not a standard like ISO 27001 — there is no ITIL certification for organisations (only individual certifications)
- It is not a prescriptive specification — it is a framework of best practice guidance
- It is not solely focused on security — security is one practice among many

**ITIL certifications** are individual qualifications at four levels:
- ITIL 4 Foundation (entry level — broad overview)
- ITIL 4 Managing Professional (specialist practitioner tracks)
- ITIL 4 Strategic Leader
- ITIL 4 Master (highest level)

---

## ITIL 4 Architecture

### The Service Value System (SVS)

ITIL 4's overarching model is the **Service Value System (SVS)** — a representation of how all components and activities in an organisation work together to create value through IT-enabled services.

**SVS components:**
- **Guiding principles**: Seven principles that guide organisational decisions
- **Governance**: The means by which the organisation directs and controls its activities
- **Service value chain**: The set of interconnected activities an organisation performs to create and deliver IT services
- **Practices**: Sets of organisational resources designed for performing work
- **Continual improvement**: Ongoing activity to align IT services with changing needs

### The Seven Guiding Principles

ITIL 4's guiding principles are universal recommendations applicable in any situation:

1. **Focus on value**: Everything must link back to value for stakeholders
2. **Start where you are**: Don't start from scratch — assess existing capabilities and build from them
3. **Progress iteratively with feedback**: Work in manageable chunks; use feedback to improve
4. **Collaborate and promote visibility**: Involve the right people; make work and decisions visible
5. **Think and work holistically**: No service or practice works in isolation; consider the whole system
6. **Keep it simple and practical**: Eliminate waste; use the minimum number of steps to achieve an outcome
7. **Optimise and automate**: Use technology to eliminate manual, repetitive work where possible

These principles resonate strongly with GRC professionals — particularly "focus on value," "start where you are," and "keep it simple and practical." They are equally applicable to building an ISMS or a PCI DSS compliance programme as to building an IT service catalogue.

### The Service Value Chain

The service value chain defines six activities through which value is created:

- **Plan**: Ensuring shared understanding of direction and current state
- **Improve**: Continual improvement across all value chain activities
- **Engage**: Understanding stakeholder needs and ensuring transparency
- **Design and transition**: Creating and changing services to meet specifications
- **Obtain/build**: Ensuring service components are available
- **Deliver and support**: Ensuring services are delivered as agreed

### The 34 ITIL 4 Practices

ITIL 4 defines 34 management practices — organised into three categories:

**General management practices (14)**: Strategy management, portfolio management, architecture management, service financial management, workforce and talent management, continual improvement, measurement and reporting, risk management, information security management, knowledge management, organisational change management, project management, relationship management, supplier management.

**Service management practices (17)**: Business analysis, service catalogue management, service design, service level management, availability management, capacity and performance management, service continuity management, monitoring and event management, service desk, incident management, service request management, problem management, release management, change enablement, service validation and testing, service configuration management, IT asset management.

**Technical management practices (3)**: Deployment management, infrastructure and platform management, software development and management.

---

## Key ITIL Practices for GRC Professionals

### Information Security Management (ISM)

**What it is**: The practice of protecting information needed by the organisation to conduct its business. ITIL 4's ISM practice covers: defining the information security policy, ensuring security is embedded in service management, and managing security incidents.

**Relationship to ISO 27001**: ITIL's ISM practice is specifically designed to work alongside ISO 27001. ITIL provides the operational service management context; ISO 27001 provides the information security management system. The ISM practice ensures that security requirements are integrated into service design, change management, and incident management rather than being a separate, disconnected activity.

**GRC relevance**: The ISM practice is where the security team (GRC) and IT service management intersect most directly. Security requirements from the ISMS (access control standards, encryption requirements, logging requirements) are translated into service requirements through the ISM practice. Security incidents detected by monitoring feed into both the incident management practice (operational response) and the ISMS incident log (governance and reporting).

### Incident Management

**What it is**: The practice of minimising the negative impact of incidents by restoring normal service operation as quickly as possible.

**ITIL incident lifecycle:**
1. **Incident logging**: Every incident recorded in the service management tool
2. **Classification and prioritisation**: Assigning impact, urgency, and priority to direct response
3. **Initial diagnosis**: Attempting to resolve the incident quickly
4. **Escalation**: Routing to the appropriate team if initial diagnosis is insufficient
5. **Investigation and diagnosis**: Detailed investigation by the appropriate team
6. **Resolution and recovery**: Implementing the fix
7. **Closure**: Confirming resolution and documenting the outcome

**Priority matrix**: ITIL uses a Priority matrix based on Impact (how broad is the effect?) and Urgency (how quickly must it be resolved?):

| | Low Urgency | High Urgency |
|---|---|---|
| **High Impact** | Priority 2 — Major | Priority 1 — Critical |
| **Low Impact** | Priority 4 — Low | Priority 3 — Significant |

**GRC relevance**: Every security incident is also an ITIL incident. Effective security incident response requires integration with the ITIL incident management process — because the operational response (restoring service) and the security response (containing the threat, preserving evidence, notifying regulators) must be coordinated. A security incident handled entirely within the security team, without coordination with the ITIL incident management process, may restore service faster than it is safe to do so, or may fail to capture evidence needed for forensic investigation.

**Relationship to ISO 27001**: ISO 27001 Annex A control A.5.24–A.5.27 (incident management) defines what must happen for information security incidents; ITIL's incident management practice defines how the operational IT response works. Both must be aligned.

**Relationship to GDPR**: Security incidents involving personal data are potential GDPR breaches requiring notification within 72 hours. The ITIL incident management process must include a trigger to assess whether a security incident involves personal data and, if so, to activate the GDPR breach notification process.

### Change Enablement (Change Management)

**What it is**: The practice of maximising the number of successful service and product changes by ensuring that risks have been properly assessed, authorising changes to proceed, and managing the change schedule.

**Change types in ITIL 4:**

**Standard changes**: Pre-approved, low-risk, well-understood changes that follow a documented procedure. No additional approval required. Example: adding a user to an approved software distribution list; routine OS patch deployment.

**Normal changes**: Require risk assessment and authorisation before implementation. May be pre-authorised by the Change Advisory Board (CAB) model or assessed individually. Example: deploying a new application; modifying firewall rules; upgrading a critical system.

**Emergency changes**: Changes needed to restore service or prevent serious harm with minimum delay. Abbreviated authorisation process; full documentation follows after implementation. Example: emergency patch deployment following active exploitation.

**Change Advisory Board (CAB)**: A committee that reviews and authorises normal changes. Typically includes: IT operations, security, business representatives, and technical teams. Security representation on the CAB is essential for ensuring security implications of changes are assessed.

**GRC relevance**: Change management is a critical control in both ISO 27001 (A.8.32) and PCI DSS (Requirement 6.5). Every change to an in-scope system must go through change management with security review. The GRC/security team participates in the CAB to ensure changes do not compromise security controls or expand scope without appropriate assessment.

**Key GRC questions in change review:**
- Does this change affect any in-scope system (ISMS scope / CDE scope)?
- Does this change affect any security control?
- Does this change introduce any new vulnerability or risk?
- Does this change require a DPIA (if personal data processing changes)?
- Are compensating controls in place during the change window?

### Problem Management

**What it is**: The practice of reducing the likelihood and impact of incidents by identifying actual and potential causes of incidents and managing workarounds and known errors.

**Reactive vs proactive problem management:**
- **Reactive**: Investigating causes of incidents after they occur — identifying root causes and implementing fixes to prevent recurrence
- **Proactive**: Identifying potential problems before incidents occur — through trend analysis, vulnerability intelligence, infrastructure review

**Problem vs incident distinction**: An incident is an unplanned interruption to service. A problem is the underlying cause of one or more incidents. Incident management restores service; problem management eliminates the cause.

**GRC relevance**: Many security incidents are recurrences of the same underlying problem. If the security team investigates incidents but does not feed findings into problem management (root cause analysis, permanent fix implementation), the same types of incidents will recur. Integration of security incident investigation with ITIL problem management ensures that security root causes are addressed systematically, not just reactively.

**Relationship to ISO 27001**: A.5.27 (Learning from information security incidents) requires that lessons learned from incidents be incorporated into security improvement. ITIL problem management is the operational process through which this happens.

### Service Continuity Management

**What it is**: The practice of ensuring that the availability and performance of a service is maintained at sufficient levels in the event of a disaster.

**Relationship to ISO 27001**: A.5.29–A.5.30 (information security during disruption; ICT readiness for business continuity) require that security controls continue to operate during disruptions. ITIL service continuity management defines how services are maintained; ISO 27001 requires that security is maintained within those continuity plans.

**Relationship to ISO 22301**: ISO 22301 (Business Continuity Management Systems) is the international standard for business continuity. ITIL service continuity management is the IT service-specific practice that operates within the broader ISO 22301 BCM system.

**GRC relevance**: GRC professionals involved in business continuity planning must understand ITIL service continuity management — because IT service recovery plans are a core component of business continuity. Recovery Time Objectives (RTOs) and Recovery Point Objectives (RPOs) for critical IT services must be defined, documented, and tested.

### Risk Management (ITIL Practice)

**What it is**: ITIL 4 includes a risk management practice that aligns with ISO 31000 and other risk frameworks.

**How it relates to GRC risk management**: ITIL's risk management practice addresses operational IT service risks — risks to service availability, reliability, and performance. GRC's risk management addresses information security risks (CIA), compliance risks, and business risks. The two must be coordinated — an operational IT risk (server failure) is also an information security risk (availability breach) and may have compliance implications (SLA breach, regulatory notification).

**GRC relevance**: The risk register maintained for the ISMS should include operational IT risks where they have information security implications. ITIL's risk management practice and the ISMS risk assessment should use consistent methodology and a shared escalation process.

---

## ITIL and COBIT: Complementary Frameworks

COBIT defines *what* needs to be governed and managed in IT. ITIL defines *how* IT services are managed operationally. They are designed to complement each other:

| COBIT (What) | ITIL (How) |
|---|---|
| BAI09 — Managed Assets | ITIL IT Asset Management |
| BAI10 — Managed Configuration | ITIL Service Configuration Management |
| DSS02 — Managed Service Requests and Incidents | ITIL Incident Management + Service Request Management |
| DSS03 — Managed Problems | ITIL Problem Management |
| DSS04 — Managed Continuity | ITIL Service Continuity Management |
| BAI06 — Managed IT Changes | ITIL Change Enablement |
| APO13 — Managed Security | ITIL Information Security Management |

An organisation that implements COBIT governance objectives with ITIL operational practices has a well-integrated governance-operations stack. GRC professionals working in such organisations should understand both layers.

---

## ITIL and ISO 27001: Direct Overlaps

| ISO 27001 Annex A Control | ITIL Practice |
|---|---|
| A.5.24–A.5.27 (Incident management) | Incident Management practice |
| A.8.32 (Change management) | Change Enablement practice |
| A.8.8 (Vulnerability management) | Problem Management (proactive) |
| A.8.13 (Backup) | Service Continuity Management |
| A.8.14 (Redundancy) | Availability Management |
| A.8.15–A.8.16 (Logging and monitoring) | Monitoring and Event Management |
| A.5.19–A.5.22 (Supplier management) | Supplier Management practice |
| A.5.12 (Classification) | Information Security Management |

For ISO 27001 auditors assessing organisations with mature ITIL practices, the ITIL processes often provide the operational evidence required for these controls. An ITIL change management process — with security review built in — satisfies A.8.32's requirement for controlled change management. The ITIL incident management log satisfies A.5.24's requirement for an incident register.

---

## Common Mistakes and Failures

**1. Security team operating independently of ITIL processes.**
A security team that manages security incidents through a separate security ticketing system, without integration with the ITIL incident management process, creates two parallel streams that do not communicate effectively. Critical information about the extent of a security incident may be siloed in the security team while IT operations works on service restoration with incomplete information.

**2. No security representation on the CAB.**
The Change Advisory Board approves changes without a security reviewer. Changes that introduce vulnerabilities, expand the ISMS scope, or affect security controls go through without security assessment. This is a common finding in both ISO 27001 audits (A.8.32) and PCI DSS assessments (Requirement 6.5).

**3. Emergency changes not reviewed post-implementation.**
Emergency changes bypass normal CAB approval. But post-implementation review of emergency changes is still required — to document what was done, verify no unintended security impact, and capture the change in the CMDB. Security teams that implement emergency security patches without any change management documentation create an audit trail gap.

**4. Problem management not used for security incident root cause.**
Security incidents are resolved (service restored, malware removed) but root cause analysis is not conducted and no problem record is created. The same type of attack succeeds again six months later. ITIL problem management should be the mandatory next step after every significant security incident.

**5. Service continuity plans not including security controls.**
Business continuity plans define how to restore services after a major incident. But they don't include provisions for maintaining security controls during the recovery period. A recovery environment stood up under pressure may lack the encryption, access controls, and monitoring that the production environment has. Security continuity must be part of service continuity.

---

## Exam Angle

**CISM:**
- Domain 3 (Security Programme) — ITIL incident management, change management, and problem management are foundational to the operational security programme. CISM candidates should understand how ITIL practices support information security programme delivery.

**CRISC:**
- Domain 4 (Risk and Control Monitoring) — ITIL monitoring and event management, incident management, and problem management are the operational processes through which IT risks are monitored and responded to.

**CISSP:**
- Domain 7 (Security Operations) — ITIL's incident management, change management, and problem management practices are core to security operations. Know the ITIL incident lifecycle, the change types (standard, normal, emergency), and the relationship between problem management and root cause analysis.

**ISO 27001 Lead Auditor:**
- Auditors assessing organisations with ITIL-based ITSM should understand how to evaluate ITIL processes as evidence for ISO 27001 controls. An ITIL change management process satisfies A.8.32; ITIL incident management satisfies A.5.24–A.5.27; ITIL service continuity satisfies A.5.29–A.5.30.

---

## GUARDIAN's Take

ITIL is the framework that GRC professionals often underestimate — because it feels like "someone else's domain," belonging to IT operations rather than security and governance. This is a mistake.

The most common failure mode in security programme operations is not inadequate control design — it is inadequate control execution. And control execution in IT organisations happens through ITIL processes. Change management is the process that should catch security-impacting changes before they are implemented. Incident management is the process that should capture, prioritise, and coordinate response to security incidents. Problem management is the process that should eliminate the root causes that let incidents recur.

If GRC professionals do not understand how these processes work, and do not actively integrate security requirements into them, then the best-designed ISMS in the world will be undermined by an operational environment that does not embed security into its daily work.

The CISO who sits on the Change Advisory Board — who reviews changes for security impact before they are implemented — is exercising security governance at the operational level where it has the most impact. The GRC professional who bridges the ISO 27001 incident response requirements with the ITIL incident management process is ensuring that security incidents are handled both effectively (restored quickly) and responsibly (evidence preserved, regulators notified, root cause addressed).

Know ITIL. Not as a certification (though the Foundation is worth having), but as a framework for understanding how IT service delivery works and where security requirements must be embedded to be effective.

---
*Module: Module 7 — Governance Frameworks | Guardian Curriculum*
