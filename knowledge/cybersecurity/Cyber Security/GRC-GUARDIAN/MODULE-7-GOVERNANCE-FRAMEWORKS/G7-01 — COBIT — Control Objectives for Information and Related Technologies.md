---
tags: [guardian, grc, module-7, cobit, governance, it-governance, control-objectives]
module: 7
cert-coverage: [cism, crisc, cissp, iso27001-la]
difficulty: intermediate
date: 2026-04-19
guardian-refs: ["G1-01 — What is GRC and Why It Exists", "G1-02 — Governance Explained", "G1-08 — GRC Frameworks Overview", "G7-02 — NIST CSF 2.0", "G7-07 — Framework Decision Guide"]
---

# G7-01 — COBIT — Control Objectives for Information and Related Technologies

> [!abstract] What This Note Covers
> By the end of this note, you will understand what COBIT is, how it evolved to COBIT 2019, how it structures IT governance and management, its core components, and how it complements ISO 27001 and other GRC frameworks.

---

## Why This Exists

In 1996, the Information Systems Audit and Control Association (ISACA) published the first version of COBIT — Control Objectives for Information and Related Technologies. It was created to fill a specific gap: auditors and governance professionals needed a structured framework for understanding how IT should be governed, controlled, and aligned with business objectives.

Twenty-five years and six versions later, COBIT remains the dominant framework for IT governance and IT audit — particularly in financial services, banking, government, and heavily regulated sectors. CISM, CRISC, and CISA certifications are all built around COBIT concepts. Understanding COBIT is not optional for GRC professionals in these sectors.

COBIT addresses a question that ISO 27001 does not: how should IT be governed overall — not just secured? While ISO 27001 focuses on information security management, COBIT addresses the broader challenge of ensuring that IT delivers value to the organisation, that IT-related risks are appropriately managed, and that IT resources are used responsibly. Security is one component of COBIT, but COBIT's scope extends to IT strategy, IT investment management, service delivery, and organisational capability.

---

## COBIT's Evolution

| Version | Year | Key development |
|---|---|---|
| COBIT 1 | 1996 | Original control objectives for IT audit |
| COBIT 2 | 1998 | Expanded with audit guidelines |
| COBIT 3 | 2000 | Added management guidelines; maturity models introduced |
| COBIT 4.0/4.1 | 2005/2007 | Process-based model; widely adopted in SOX compliance |
| COBIT 5 | 2012 | Integrated governance and management; 37 processes; separation of governance from management |
| COBIT 2019 | 2018 | Flexible, customisable design factors; performance management; updated process model |

**COBIT 5** represented the largest conceptual leap — introducing the formal separation between IT governance (board/executive level) and IT management (operational level), which remains the foundation of COBIT 2019.

**COBIT 2019** is the current version, published in 2018/2019 by ISACA. It builds on COBIT 5 with:
- A more flexible, tailorable design using Design Factors
- Updated process model aligned with modern IT delivery
- Performance management integrated into the framework
- Focus on practical implementation

---

## The COBIT 2019 Framework: Core Concepts

### The Governance vs Management Distinction

The most important conceptual contribution of COBIT (from v5 onward) is the formal distinction between governance and management:

**Governance**: Evaluates, directs, and monitors. Performed by the board or governing body. Concerned with: Are IT objectives aligned with organisational objectives? Are IT risks within tolerance? Are IT resources being used responsibly? The governance body evaluates the situation, sets direction, and monitors performance.

**Management**: Plans, builds, runs, and monitors. Performed by management (CIO, IT leadership, operational teams). Concerned with: How do we plan and execute IT activities to achieve the governance direction? How do we deliver services reliably and securely?

This distinction is critical for understanding COBIT's governance objectives:

**EDM (Evaluate, Direct, Monitor)** — the five governance objectives — are the board's domain.
**APO, BAI, DSS, MEA** — the 35 management objectives — are management's domain.

### The Six Principles of COBIT 2019

COBIT 2019 is built on six principles for a governance system:

1. **Provide stakeholder value**: The governance system must support the creation of value for stakeholders by achieving benefits while optimising risk and resource use.

2. **Holistic approach**: Governance requires a complete set of components — processes, structures, culture and behaviour, information, services and infrastructure, people and skills — not just policies or technology.

3. **Dynamic governance system**: Governance must adapt continuously to changes in the enterprise environment and respond to significant changes quickly.

4. **Governance distinct from management**: The roles and responsibilities of governance and management are different, though they must be integrated.

5. **Tailored to enterprise needs**: The governance system must be tailored to the specific context of the enterprise — using design factors to customise the framework appropriately.

6. **End-to-end governance system**: Governance covers all functions and processes in the enterprise related to IT — not just IT's own internal operations.

---

## COBIT 2019 Components

### Governance and Management Objectives (40 total)

COBIT 2019 organises 40 governance and management objectives across five domains:

**EDM — Evaluate, Direct, Monitor (5 objectives — Governance Domain):**
- EDM01: Ensure governance framework setting and maintenance
- EDM02: Ensure benefits delivery
- EDM03: Ensure risk optimisation
- EDM04: Ensure resource optimisation
- EDM05: Ensure stakeholder engagement

**APO — Align, Plan, Organise (14 objectives — Management Domain):**
APO01 through APO14 cover: IT management framework, strategy, enterprise architecture, innovation, portfolio management, budget and costs, HR, relationships, service agreements, vendors, quality, risk management, security, data management.

**BAI — Build, Acquire, Implement (11 objectives — Management Domain):**
BAI01 through BAI11 cover: programme management, requirements definition, solutions identification and build, availability and capacity, asset management, change, change acceptance, knowledge, asset configuration, projects.

**DSS — Deliver, Service and Support (6 objectives — Management Domain):**
DSS01 through DSS06 cover: operations, service requests and incidents, problems, continuity, security services, business process controls.

**MEA — Monitor, Evaluate, Assess (4 objectives — Management Domain):**
MEA01 through MEA04 cover: performance and conformance monitoring, system of internal control, compliance with external requirements, assurance.

### The Seven Components of a Governance System

Each governance/management objective is supported by seven components:

1. **Processes**: The set of practices and activities in the objective
2. **Organisational structures**: Key roles and responsibilities
3. **Principles, policies, and frameworks**: Behavioural guidance
4. **Information**: Inputs and outputs of processes
5. **Culture, ethics, and behaviour**: Individual and organisational behaviours
6. **People, skills, and competencies**: Human requirements
7. **Services, infrastructure, and applications**: Technology requirements

This multi-component view ensures that governance objectives are addressed holistically — not just through process documentation but through all the enablers that make processes effective.

### Focus Areas

COBIT 2019 introduces **Focus Areas** — targeted use cases that show how COBIT applies to specific topics:
- IT governance implementation
- Information security
- DevOps
- Cloud computing
- Privacy
- Digital transformation
- Cybersecurity

The Information Security focus area is particularly relevant for GRC professionals — it maps COBIT 2019 objectives to security-specific practices.

---

## Design Factors: Tailoring COBIT to the Enterprise

One of the most significant improvements in COBIT 2019 is the Design Factor model — a structured approach to tailoring the framework to the enterprise's specific context rather than applying it uniformly to all organisations.

**The 11 Design Factors:**

| Factor | Description | Examples |
|---|---|---|
| Enterprise strategy | What is the organisation's strategic orientation? | Growth/acquisition; innovation; cost leadership; client service |
| Enterprise goals | What goals does the enterprise pursue? | Revenue growth; operational excellence; regulatory compliance |
| Risk profile | What types of IT-related risk does the enterprise face? | Investment risk; operational risk; regulatory risk |
| IT-related issues | What current IT problems exist? | Unreliable IT services; data breaches; compliance failures |
| Threat landscape | What threats are most relevant? | External attack; insider threat; natural disaster |
| Compliance requirements | What regulations and standards apply? | GDPR, PCI DSS, SOX, sector-specific |
| Role of IT | How central is IT to the enterprise's operations? | IT as support; IT as factory; IT as strategic differentiator |
| Sourcing model | How does the enterprise source IT services? | Internal; outsourced; cloud; hybrid |
| IT implementation methods | How does the enterprise deliver IT? | Traditional; agile; DevOps |
| Technology adoption strategy | How quickly does the enterprise adopt new technology? | First mover; follower; slow adopter |
| Enterprise size | What is the size of the enterprise? | Small; medium; large; global |

**How Design Factors work**: After assessing each design factor, COBIT 2019 provides guidance on which objectives are more or less important for that enterprise configuration. A small enterprise with IT-as-support and a low threat profile will implement a lighter-weight COBIT than a large global financial institution with IT-as-strategic-differentiator and a high regulatory burden.

---

## COBIT's Maturity Model: Capability Levels

COBIT 2019 uses a capability/maturity model to assess the current state of governance and management objectives and plan improvement.

**Capability levels (0–5):**

| Level | Name | Description |
|---|---|---|
| 0 | Incomplete | The process is not implemented or fails to achieve its purpose |
| 1 | Initial | The process is implemented and achieves its purpose in an ad hoc, undisciplined manner |
| 2 | Managed | The process is planned, monitored, and adjusted |
| 3 | Defined | The process is tailored from a standard process |
| 4 | Quantitatively Managed | The process is controlled using statistical and other quantitative techniques |
| 5 | Optimising | The process is continuously improved to meet relevant goals |

**Target capability levels**: Not all objectives need to be at level 5. COBIT uses Design Factors to determine appropriate target levels — a non-critical supporting process may be adequately managed at level 2; a critical risk management process in a regulated financial institution may need level 4 or 5.

**Gap analysis**: Comparing current capability levels to target levels identifies the improvement priority areas — the foundation for a COBIT-based governance improvement programme.

---

## COBIT and Information Security: APO13 and DSS05

Two COBIT 2019 objectives are most directly relevant to information security:

**APO13 — Managed Security**: Defines and operates an information security management system — directly aligning with ISO 27001. APO13 requires: defining security strategy, policies, and standards; conducting risk assessments; implementing and operating security controls; monitoring security effectiveness; improving the security programme. ISACA published a mapping between APO13 and ISO 27001, making integration straightforward.

**DSS05 — Managed Security Services**: Operates and maintains security services. Covers: access control, network protection, endpoint protection, user identity management, sensitive document protection, and security incident handling.

Together, APO13 (the security management system) and DSS05 (security operations) cover the management of information security within COBIT's broader governance and management structure.

---

## COBIT and Other Frameworks

COBIT does not exist in isolation — it is designed to complement other frameworks:

**COBIT and ISO 27001**: APO13 maps closely to ISO 27001. An ISO 27001 ISMS implemented within a COBIT governance structure gains the broader IT governance context that ISO 27001 alone doesn't provide. COBIT provides the board-level governance; ISO 27001 provides the operational security management system.

**COBIT and ITIL**: COBIT focuses on governance — what needs to be done. ITIL (IT Infrastructure Library) focuses on IT service management — how to do it. They are highly complementary — COBIT's DSS objectives align with ITIL service operation; COBIT's BAI objectives align with ITIL service design and transition.

**COBIT and COSO**: COSO (Committee of Sponsoring Organizations) provides the enterprise risk management and internal control frameworks. COBIT and COSO are aligned — COBIT's MEA objectives (Monitor, Evaluate, Assess) address the internal control monitoring that COSO requires.

**COBIT and NIST CSF**: NIST CSF (covered in G7-02) focuses on cybersecurity. COBIT's security objectives (APO13, DSS05) can be mapped to NIST CSF, enabling organisations to use COBIT's governance structure with NIST CSF's security-specific practices.

---

## COBIT in Audit and Compliance Contexts

COBIT's original purpose was IT audit support, and it remains the primary framework for IT auditors. ISACA's CISA (Certified Information Systems Auditor) certification is built around COBIT concepts.

**Using COBIT in internal audit**: Internal auditors use COBIT to assess the maturity and effectiveness of IT governance and management. COBIT's process definitions, performance indicators, and capability model provide auditors with structured criteria for evaluating IT governance.

**Using COBIT in external audit**: External auditors (particularly for SOX compliance in publicly listed companies) use COBIT to assess IT general controls — the IT controls that underpin financial reporting systems. SOX Section 404 compliance requires assessment of internal controls over financial reporting; COBIT provides the IT control framework most commonly used for this purpose.

**COBIT and SOX**: The Sarbanes-Oxley Act (2002) requires listed companies to assess and certify the effectiveness of internal controls over financial reporting. IT general controls — access management, change management, operations management, backup and recovery — are assessed against COBIT's framework by many SOX auditors and organisations.

---

## Common Mistakes and Failures

**1. Implementing all 40 COBIT objectives at maximum maturity.**
COBIT is designed to be tailored. Attempting to implement every objective at the highest capability level is resource-intensive and produces diminishing returns. Use Design Factors to determine which objectives matter most and what target capability levels are appropriate.

**2. Treating COBIT as a replacement for ISO 27001 or NIST CSF.**
COBIT addresses IT governance broadly. It is not a substitute for a security-specific framework. COBIT and ISO 27001 are complementary — COBIT for governance, ISO 27001 for security management.

**3. Implementing COBIT as a documentation exercise.**
COBIT's value comes from genuinely improving governance capabilities — not from producing policy documents that satisfy a framework checklist. Real improvement requires changing how the board engages with IT risk, how management decisions are made, and how performance is measured.

**4. Not using Design Factors to tailor the framework.**
Applying COBIT uniformly without assessing Design Factors produces a compliance posture that is either over-engineered (applying large-enterprise governance to a small business) or under-engineered (applying a minimal framework to a complex, regulated enterprise).

**5. Confusing COBIT capability assessment with ISO 27001 audit.**
COBIT capability assessment and ISO 27001 internal audit serve different purposes. COBIT assessment measures governance maturity across a broad set of objectives; ISO 27001 audit assesses conformance with specific security management requirements. Both are valuable; they are not interchangeable.

---

## Exam Angle

**CISM:**
- CISM Domain 1 (Information Security Governance) is heavily influenced by COBIT concepts — particularly the governance vs management distinction, the role of the board in setting risk tolerance, and the alignment of security with business objectives. CISM candidates should understand COBIT's EDM objectives and how they relate to security governance.

**CRISC:**
- CRISC Domain 1 (IT Risk Identification) and Domain 4 (Risk and Control Monitoring and Reporting) align with COBIT's risk-related objectives (EDM03, APO12) and monitoring objectives (MEA01–MEA04). CRISC candidates should understand how COBIT structures IT risk governance.

**CISSP:**
- Domain 1 (Security and Risk Management) covers governance frameworks including COBIT. Know what COBIT is, its governance vs management distinction, its primary domains (EDM, APO, BAI, DSS, MEA), and how it relates to other frameworks.

**ISO 27001 Lead Auditor:**
- COBIT is relevant as context for organisations with strong IT governance programmes. Understanding how APO13 maps to ISO 27001 enables auditors to assess whether the ISMS is positioned within an appropriate IT governance structure.

---

## GUARDIAN's Take

COBIT is the framework that most GRC professionals encounter most often without fully understanding — because it appears in job descriptions ("COBIT knowledge required"), in framework comparisons, and in audit contexts — but it is rarely implemented comprehensively by the organisations that reference it.

The reason is scale. COBIT 2019's 40 governance and management objectives, with seven components each, is an enormous framework. No organisation implements all of it. The value is not in implementing the framework comprehensively but in using it intelligently — applying it where it adds value, tailored to the organisation's context using Design Factors.

For information security professionals specifically, COBIT's most valuable contribution is the governance vs management distinction. When the CISO faces the board, they are engaging with the EDM layer — the governance layer that evaluates, directs, and monitors. The CISO's job in that context is not to explain technical security operations but to give the board what they need to fulfil their governance role: an honest assessment of the risk posture, a clear strategic direction, and meaningful performance indicators.

COBIT gives the GRC professional the language and structure to make that board engagement productive. Understand EDM03 (ensure risk optimisation) deeply — that is the governance objective most directly relevant to information security governance, and it is the conversation the CISO must be able to have with the board.

---
*Module: Module 7 — Governance Frameworks | Guardian Curriculum*
