---
tags: [guardian, grc, module-7, nist-sp-800-53, security-controls, privacy-controls, federal, risk-management-framework]
module: 7
cert-coverage: [cism, crisc, cissp, iso27001-la]
difficulty: advanced
date: 2026-04-19
guardian-refs: ["G7-02 — NIST CSF 2.0", "G7-01 — COBIT", "G3-10 — Annex A Controls", "G4-04 — Technological Controls", "G1-08 — GRC Frameworks Overview"]
---

# G7-03 — NIST SP 800-53 — Security and Privacy Controls

> [!abstract] What This Note Covers
> By the end of this note, you will understand NIST SP 800-53 — what it is, who uses it, how its control families are organised, how it relates to the Risk Management Framework (RMF), how it maps to ISO 27001, and when it is the right framework to implement.

---

## Why This Exists

NIST Special Publication 800-53 is the most comprehensive and detailed security and privacy control catalogue in existence. Initially developed to protect US federal government information systems, it has become the primary reference for any organisation operating in or with the US federal government space — defence contractors, intelligence community suppliers, healthcare systems receiving federal funding, and any entity subject to US federal information security law (FISMA).

For GRC professionals, understanding 800-53 is essential if you work with US government clients, US defence, or global organisations with US federal contracts. It is also the most granular security control reference available — more detailed than ISO 27001 Annex A, more prescriptive than NIST CSF. As a control catalogue, it is unmatched in depth.

---

## What NIST SP 800-53 Is

**NIST Special Publication 800-53** — *Security and Privacy Controls for Information Systems and Organizations* — is a catalogue of security and privacy controls for protecting federal information systems and organisations.

**Current version**: NIST SP 800-53 Revision 5 (Rev 5), published September 2020, with updates through 2022.

**Produced by**: National Institute of Standards and Technology (NIST), US Department of Commerce.

**Mandatory for**: All US federal agencies and their contractors handling federal information under FISMA (Federal Information Security Modernization Act). Also referenced by:
- FedRAMP (cloud services used by federal agencies)
- CMMC (Cybersecurity Maturity Model Certification) for US defence contractors
- HIPAA security rule guidance for healthcare
- US state government agencies (many adopt 800-53 voluntarily)

**Voluntary for**: Non-federal organisations, though many adopt it as their primary control framework when working extensively with US government clients.

---

## The Structure of SP 800-53 Rev 5

### 20 Control Families

SP 800-53 Rev 5 organises 1,000+ controls into 20 families. Each family addresses a specific security or privacy domain:

| ID | Family | Description |
|---|---|---|
| **AC** | Access Control | Controlling who can access what |
| **AT** | Awareness and Training | Security awareness and training programmes |
| **AU** | Audit and Accountability | Logging, monitoring, and audit trail management |
| **CA** | Assessment, Authorization, and Monitoring | Security assessments, authorisation, continuous monitoring |
| **CM** | Configuration Management | Secure baseline configurations, change management |
| **CP** | Contingency Planning | Business continuity and disaster recovery |
| **IA** | Identification and Authentication | Identity management and authentication |
| **IR** | Incident Response | Incident planning, detection, response, and recovery |
| **MA** | Maintenance | System maintenance security |
| **MP** | Media Protection | Protecting storage media containing sensitive information |
| **PE** | Physical and Environmental Protection | Physical access controls and environmental protections |
| **PL** | Planning | Security planning documentation |
| **PM** | Program Management | Enterprise-level security programme management |
| **PS** | Personnel Security | HR security — screening, access, termination |
| **PT** | PII Processing and Transparency | Privacy controls for personally identifiable information |
| **RA** | Risk Assessment | Risk assessments, vulnerability monitoring |
| **SA** | System and Services Acquisition | Security in procurement and development |
| **SC** | System and Communications Protection | Network protection, cryptography, boundary protection |
| **SI** | System and Information Integrity | Malware protection, monitoring, incident handling |
| **SR** | Supply Chain Risk Management | Managing supply chain security risks (new in Rev 5) |

**Rev 5 addition**: The SR (Supply Chain Risk Management) family and PT (PII Processing and Transparency) are the most significant additions in Rev 5, reflecting the SolarWinds supply chain attack's impact on US government security thinking and the integration of privacy into the security control framework.

### Control Structure

Each control in SP 800-53 has a standard structure:

**Control identifier**: e.g. AC-2 (Access Control family, control 2 — Account Management)

**Control name**: Descriptive title

**Control statement**: What the organisation must do

**Control enhancements**: Additional requirements that can be applied to strengthen the baseline control (numbered with the base control, e.g. AC-2(1), AC-2(2))

**Discussion**: Implementation guidance and additional context

**Related controls**: Cross-references to other controls that address related objectives

**References**: External standards and guidance documents

**Example — AC-2: Account Management**

```
AC-2 ACCOUNT MANAGEMENT

Control: The organization:
a. Identifies and selects the following types of information system accounts to 
   support organizational missions/business functions: [Assignment: organization-
   defined account types];
b. Assigns account managers for information system accounts;
c. Establishes conditions for group and role membership;
d. Specifies authorized users of the information system, group and role membership, 
   and access authorizations...
   [continues through k]

Control Enhancements:
AC-2(1) AUTOMATED SYSTEM ACCOUNT MANAGEMENT
AC-2(2) REMOVAL OF TEMPORARY AND EMERGENCY ACCOUNTS
AC-2(3) DISABLE INACTIVE ACCOUNTS
AC-2(4) AUTOMATED AUDIT ACTIONS
[...continues to AC-2(13)]
```

---

## Control Baselines: LOW, MODERATE, and HIGH

A critical feature of SP 800-53 is the **baseline** concept. Not all 1,000+ controls apply to every system. NIST SP 800-53B (Control Baselines) defines three impact-based baselines:

### FIPS 199 Impact Levels

Before applying baselines, the organisation determines the system's impact level using FIPS 199 — Federal Information Processing Standard 199. Impact is assessed for three security objectives (confidentiality, integrity, availability) across three levels:

| Impact | Definition |
|---|---|
| **LOW** | The loss of confidentiality, integrity, or availability could be expected to have a limited adverse effect on operations, assets, or individuals |
| **MODERATE** | Could be expected to have a serious adverse effect |
| **HIGH** | Could be expected to have a severe or catastrophic adverse effect |

The overall system impact level is determined by the highest impact level across all three objectives (the "high-water mark" principle).

### The Three Baselines

**LOW Baseline**: Applies to LOW impact systems — systems where a breach would have limited impact. Approximately 125 controls. Used for publicly available information systems, systems with minimal PII.

**MODERATE Baseline**: Applies to MODERATE impact systems — the most common federal baseline. Approximately 325 controls. Covers most government information systems.

**HIGH Baseline**: Applies to HIGH impact systems — national security systems, systems with critical infrastructure information, systems where breach would have severe national impact. Approximately 425 controls. Includes all MODERATE controls plus additional requirements.

**Tailoring**: Baselines are starting points — organisations apply tailoring to add controls (overlays) based on specific threats or requirements, or remove controls where they are not applicable or are addressed by compensating controls. The result is the organisation's specific security plan.

---

## The Risk Management Framework (RMF)

SP 800-53 does not stand alone — it is a component of NIST's broader **Risk Management Framework (RMF)**, defined in NIST SP 800-37. The RMF is the process through which federal agencies implement and assess 800-53 controls.

**The 7 RMF Steps:**

```
STEP 1: PREPARE
    Establish context, define roles, identify key risk management activities
    
    ↓
    
STEP 2: CATEGORIZE
    Categorize the system based on impact (FIPS 199/FIPS 200)
    Determine LOW / MODERATE / HIGH impact level
    
    ↓
    
STEP 3: SELECT
    Select baseline controls from SP 800-53
    Apply tailoring based on risk assessment and organisational requirements
    
    ↓
    
STEP 4: IMPLEMENT
    Implement selected controls in the information system
    Document implementation in security plans
    
    ↓
    
STEP 5: ASSESS
    Assess controls to determine if they are implemented correctly
    and operating as intended (SP 800-53A Assessment Procedures)
    
    ↓
    
STEP 6: AUTHORIZE
    Senior official reviews risk to operations and assets
    Grants Authorization to Operate (ATO) if risk is acceptable
    
    ↓
    
STEP 7: MONITOR
    Continuously monitor controls and risk posture
    Report security status to authorizing officials
    Update security plan as changes occur
```

**The Authorization to Operate (ATO)**: A critical concept in the federal security world. The ATO is a formal decision by a designated official that a system's risk posture is acceptable, allowing the system to operate. Systems without an ATO cannot process federal information. This creates a formal accountability mechanism — a named official accepts the residual risk.

**FedRAMP**: The Federal Risk and Authorization Management Program applies the RMF to cloud services used by federal agencies. Cloud providers seeking to offer services to federal agencies must achieve FedRAMP authorisation — implementing SP 800-53 controls in their cloud environments, assessed by an independent Third Party Assessment Organisation (3PAO), and authorised by a federal agency.

---

## SP 800-53 Rev 5 Key Changes from Rev 4

**Integration of privacy controls**: Rev 5 integrates privacy controls (the PT family) directly into 800-53, previously they were in a separate document (SP 800-53A). This reflects the convergence of security and privacy as inseparable concerns.

**New Supply Chain Risk Management (SR) family**: Following SolarWinds and other supply chain attacks, Rev 5 added a dedicated SR family with controls for managing supply chain security risks — vetting suppliers, protecting supply chain integrity, and responding to supply chain compromises.

**Outcome-based control statements**: Rev 5 shifted control statements from organisation-centred to outcome-centred language, making controls applicable to any type of entity (not just federal organisations).

**Separation of control selection from control specification**: Rev 5 moved baselines to SP 800-53B, enabling the control catalogue (800-53) to be used independently of the federal baseline selection process. This makes 800-53 more accessible as a general-purpose control catalogue.

**Control objectives clarified**: Each control now has clearer statements of its security and privacy objectives, enabling better assessment and cross-mapping.

---

## Selected High-Importance Controls in Detail

### AC-2: Account Management (Access Control family)

**What it requires**: Identifying authorised users and managing their accounts through their lifecycle — creation, modification, monitoring, and removal.

**Key requirements**: Maintaining an account inventory; defining account types; establishing conditions for role membership; disabling/removing accounts when no longer needed; monitoring account usage for unusual activity.

**Enhancements (key)**: AC-2(1) automated account management; AC-2(3) automatic disable of inactive accounts; AC-2(12) account monitoring for atypical usage.

**ISO 27001 mapping**: A.5.16 (Identity management), A.5.18 (Access rights), A.6.5 (Responsibilities after termination)

### AU-2: Event Logging (Audit and Accountability family)

**What it requires**: Identifying events that the system must be capable of logging, coordinating the event list with other organisations, and reviewing and updating the events list.

**ISO 27001 mapping**: A.8.15 (Logging)

### CM-6: Configuration Settings (Configuration Management family)

**What it requires**: Establishing and documenting configuration settings for IT products employed within the system; implementing the configuration settings; identifying and documenting deviations; monitoring and controlling changes to configuration settings.

**ISO 27001 mapping**: A.8.9 (Configuration management)

### IR-4: Incident Handling (Incident Response family)

**What it requires**: Implementing an incident handling capability for security incidents including preparation, detection, analysis, containment, eradication, and recovery; coordinating with contingency planning.

**ISO 27001 mapping**: A.5.24–A.5.27 (incident management lifecycle)

### RA-5: Vulnerability Monitoring and Scanning (Risk Assessment family)

**What it requires**: Monitoring and scanning for vulnerabilities in the system; employing vulnerability scanning tools; analysing vulnerability scan reports; remediating vulnerabilities based on risk; sharing information from the vulnerability scanning process with designated personnel.

**ISO 27001 mapping**: A.8.8 (Management of technical vulnerabilities)

### SC-8: Transmission Confidentiality and Integrity (System and Communications Protection family)

**What it requires**: Implementing cryptographic mechanisms to prevent unauthorised disclosure or modification of information during transmission.

**ISO 27001 mapping**: A.8.24 (Use of cryptography), A.5.14 (Information transfer)

### SR-3: Supply Chain Controls and Plans (Supply Chain Risk Management family — new in Rev 5)

**What it requires**: Developing a plan for managing supply chain risks; implementing supply chain-related controls; including supply chain-related requirements in acquisition strategies.

**ISO 27001 mapping**: A.5.19–A.5.22 (supplier security), A.5.21 (ICT supply chain)

---

## SP 800-53 and ISO 27001: The Relationship

SP 800-53 and ISO 27001 serve similar purposes — providing security control frameworks — but through different mechanisms and with different governance structures.

| Dimension | SP 800-53 | ISO 27001 |
|---|---|---|
| **Origin** | US federal government (NIST) | International standard (ISO/IEC) |
| **Control approach** | Prescriptive — specific controls in 20 families | Risk-based — select controls from Annex A based on risk |
| **Scope** | ~1,000+ controls across three baselines | 93 controls in four categories |
| **Depth** | Very detailed — specific implementation requirements | Higher-level — implementation guidance in ISO 27002 |
| **Certification** | No certification — ATO for federal systems | Third-party certification available |
| **Audience** | US federal agencies and contractors primarily | International — widely adopted globally |
| **Privacy** | Integrated PT family (Rev 5) | Separate privacy obligation (GDPR, etc.) |
| **Supply chain** | Dedicated SR family (Rev 5) | A.5.19–A.5.22 (less detailed) |

**NIST's mapping documentation**: NIST publishes cross-references between SP 800-53 and ISO 27001. The mapping shows that most ISO 27001 Annex A controls correspond to one or more SP 800-53 controls, though 800-53 is significantly more granular. An ISO 27001-compliant organisation typically satisfies the intent of many 800-53 controls but may need to address specific 800-53 requirements not explicitly covered by the ISO framework.

**For global organisations with US federal contracts**: Implement ISO 27001 as the management system framework; use SP 800-53 to verify control completeness and depth for US federal work. The ISO 27001 ISMS provides the governance; SP 800-53 provides the control catalogue detail needed for federal compliance.

---

## SP 800-53A: Assessment Procedures

SP 800-53A is the companion document — *Assessing Security and Privacy Controls in Federal Information Systems and Organizations*. Where 800-53 specifies what controls must be implemented, 800-53A specifies how to assess whether they are implemented correctly.

For each control, 800-53A provides:
- **Examination**: Review documentation, inspect configurations, observe processes
- **Interview**: Interview personnel responsible for implementing or overseeing the control
- **Test**: Test the control's operation directly

This structured assessment methodology is used by:
- Security Assessment Organisations (SAOs) conducting FISMA assessments
- 3PAOs conducting FedRAMP assessments
- Internal auditors assessing federal information systems

For non-federal organisations, 800-53A's assessment procedures are useful as a detailed control testing guide — the examination, interview, and test procedures for each control provide a rigorous assessment methodology.

---

## SP 800-171: Protecting Controlled Unclassified Information (CUI)

SP 800-171 is a related but distinct standard — *Protecting Controlled Unclassified Information in Nonfederal Systems and Organizations*. It applies to contractors handling Controlled Unclassified Information (CUI) — sensitive government information that is not classified but requires protection.

SP 800-171 contains 110 requirements derived from SP 800-53 — a subset of 800-53 MODERATE baseline controls tailored for nonfederal organisations. It is the primary standard for US defence contractors and is the foundation of CMMC.

**CMMC**: The Cybersecurity Maturity Model Certification (CMMC) is the DoD's certification programme for defence contractors. CMMC Level 1 (17 practices) is based on 800-171. CMMC Level 2 (110 practices) is identical to 800-171. CMMC Level 3 (additional practices from 800-172) is for the most sensitive DoD programmes.

---

## Common Mistakes and Failures

**1. Attempting to implement all 1,000+ controls regardless of impact level.**
SP 800-53 is a comprehensive catalogue — most organisations implement a baseline (LOW, MODERATE, or HIGH) with tailoring, not the entire catalogue. Starting with the appropriate baseline and tailoring is the correct approach.

**2. Confusing SP 800-53 with NIST CSF.**
800-53 is a detailed control catalogue; CSF is a high-level governance framework. They are complementary — CSF provides the organisational framework; 800-53 provides the detailed control specifications. Many organisations use CSF for governance communication and 800-53 for technical control implementation.

**3. Treating the ATO as a one-time event.**
Federal system authorisation (ATO) must be maintained through continuous monitoring (RMF Step 7). An ATO granted two years ago without subsequent control assessment may no longer reflect the current risk posture — particularly after significant system changes.

**4. Not tailoring the baseline.**
Implementing the MODERATE baseline verbatim without assessing whether specific controls are applicable, whether compensating controls are in place, or whether additional controls are needed for the specific threat environment. Tailoring is not optional — it is a required RMF step.

**5. Ignoring the PT and SR families (Rev 5 additions).**
Organisations that assessed compliance against Rev 4 and have not updated their programmes to include privacy (PT) and supply chain (SR) controls are no longer complete against Rev 5. These are genuinely new requirements with significant implementation implications.

---

## Exam Angle

**CISM:**
- Domain 1 (Governance) — SP 800-53's PM (Program Management) and PL (Planning) families address enterprise-level security programme management that aligns with CISM governance requirements. The ATO concept and the RMF's governance structure are relevant CISM context.

**CRISC:**
- Domain 2 (IT Risk Assessment) — SP 800-53's RA (Risk Assessment) family and the FIPS 199 impact categorisation process directly address CRISC risk assessment methodology. The three-tier baseline structure is a form of risk-proportionate control selection.

**CISSP:**
- Domain 1 (Security and Risk Management) — Know the structure of SP 800-53 (20 families, three baselines), the RMF process, and how 800-53 relates to CSF and ISO 27001.
- Domain 2 (Asset Security) — The CUI framework and SP 800-171 are relevant to asset classification and data protection.

**ISO 27001 Lead Auditor:**
- Understanding SP 800-53 enables auditors to assist global organisations in demonstrating how their ISO 27001 ISMS satisfies US federal control requirements — particularly relevant for cloud providers seeking FedRAMP authorisation who also hold ISO 27001 certification.

---

## GUARDIAN's Take

SP 800-53 is the framework that most GRC professionals know they should understand and many find intimidating to engage with — because of its sheer scale. A thousand-plus controls across 20 families is an enormous body of specification.

The key to making sense of it: think of 800-53 not as a list of a thousand things to implement, but as the most comprehensive security control reference in existence. It is a library. You don't read every book in a library — you find the books relevant to your specific question. Similarly, you don't implement every 800-53 control — you implement the baseline appropriate to your impact level, tailored to your specific context.

The frameworks to understand in relation: CSF tells you what governance outcomes to achieve. 800-53 tells you the specific controls through which those outcomes are achieved. ISO 27001 provides the management system for selecting, implementing, and continually improving those controls. The three work together — governance framework, control catalogue, management system — as a complete and integrated approach to federal cybersecurity compliance.

For UK-based GRC professionals: 800-53 is not your primary framework, but understanding it positions you to work with US clients and US government suppliers. As global supply chains increasingly require US federal compliance evidence — particularly through CMMC for defence contractors — knowledge of 800-53 becomes a genuine market differentiator for GRC professionals in the UK.

---
*Module: Module 7 — Governance Frameworks | Guardian Curriculum*
