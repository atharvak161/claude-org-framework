---
tags: [guardian, grc, module-9, iso27001, compliance, documentation-alignment, regulatory-mapping]
module: 9
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-25
guardian-refs: ["G9-01 — The Policy Hierarchy", "G9-02 — Writing Effective Security Policies", "G9-03 — Standards and Baselines", "G9-04 — Procedures and SOPs", "G9-05 — Policy Lifecycle", "G3-06 — ISO 27001 Clause 7", "G5-02 — GDPR Principles", "G6-02 — PCI DSS Requirements"]
---

# G9-06 — Aligning Documentation to ISO 27001 and Regulatory Requirements

> [!abstract] What This Note Covers
> By the end of this note, you will understand how to map your policy and standards framework to ISO 27001 requirements, GDPR obligations, PCI DSS requirements, and other applicable frameworks — enabling a single, integrated documentation framework that satisfies multiple compliance obligations without unnecessary duplication.

---

## Why This Exists

Most organisations subject to multiple compliance frameworks — ISO 27001, GDPR, PCI DSS, Cyber Essentials — discover that the same policies and standards can serve multiple frameworks simultaneously. A data classification policy satisfies both ISO 27001 Annex A control A.5.12 and GDPR's data minimisation and storage limitation principles. An encryption standard satisfies ISO 27001 A.8.24, GDPR Article 32, and PCI DSS Requirement 4 simultaneously.

The alternative — building separate documentation for each framework — creates duplication, inconsistency, and an unmanageable maintenance burden. When a requirement changes in one framework, multiple disconnected documents must be updated, creating risk of inconsistency between them.

This note provides the mapping infrastructure to build one documentation framework that satisfies many compliance obligations.

---

## ISO 27001 Documented Information Requirements

ISO 27001 Clause 7.5 requires the organisation to maintain "documented information" — a term that encompasses both documents (planned and controlled information) and records (evidence that activities occurred). ISO 27001 specifies both mandatory documented information (what must be documented) and allows organisations to determine additional documented information they need.

### Mandatory Documented Information: ISO 27001

The standard explicitly requires the following documented information:

**Scope of the ISMS** (Clause 4.3): The document defining what is within the ISMS.

**Information security policy** (Clause 5.2): The overarching IS policy.

**Risk assessment process** (Clause 6.1.2): The methodology for conducting risk assessments.

**Risk acceptance criteria** (Clause 6.1.2): The thresholds for accepting residual risk.

**Results of risk assessments** (Clause 8.2): The risk register (completed assessments).

**Risk treatment plan** (Clause 6.1.3e): The documented treatment decisions and actions.

**Statement of Applicability** (Clause 6.1.3d): All 93 controls — applicable/not applicable and justification.

**Information security objectives** (Clause 6.2): Documented objectives with owners, timelines, and measures.

**Competence evidence** (Clause 7.2): Training records, CVs, certifications for ISMS roles.

**Communication evidence** (Clause 7.4): Evidence of internal/external communication about the ISMS.

**Operational planning results** (Clause 8.1): Evidence that processes have been planned and implemented.

**Monitoring, measurement, analysis, and evaluation results** (Clause 9.1): KPI records, measurement outputs.

**Internal audit programme and results** (Clause 9.2): Audit schedule, audit reports.

**Management review evidence** (Clause 9.3): Management review records/minutes.

**Nonconformities and corrective actions** (Clause 10.1): Corrective action records.

### Policy Documents Corresponding to ISO 27001 Annex A

Beyond the mandatory documented information, each applicable Annex A control should be supported by appropriate policies, standards, or procedures. The mapping:

| Annex A Control Category | Documentation Required |
|---|---|
| A.5.1 — Policies for information security | Overarching IS Policy + topic-specific policies |
| A.5.9 — Asset inventory | Asset management policy; asset register |
| A.5.10 — Acceptable use | Acceptable Use Policy |
| A.5.12 — Information classification | Information Classification Policy; Data Classification Standard |
| A.5.14 — Information transfer | Information Transfer Policy; secure email and file sharing procedures |
| A.5.15 — Access control | Access Control Policy |
| A.5.17 — Authentication | Password Standard; MFA Standard |
| A.5.18 — Access rights | Access Review Procedure; user provisioning/deprovisioning procedures |
| A.5.19 — Supplier security | Supplier Security Policy; supplier assessment procedure |
| A.5.20 — Supplier agreements | Supplier security clauses template; DPA template |
| A.5.24 — Incident management | Incident Management Policy; incident reporting procedure |
| A.5.29 — Information security during disruption | BCM Policy; BCPs for critical functions |
| A.5.34 — Privacy and PII | Data Protection Policy; DPIA procedure; RoPA |
| A.5.37 — Documented operating procedures | All procedures! (A.5.37 requires operational procedures to be documented) |
| A.6.3 — Awareness training | Security awareness training programme |
| A.7.7 — Clear desk and screen | Clear Desk and Screen Policy |
| A.8.8 — Vulnerability management | Patch Management Standard; vulnerability scan procedure |
| A.8.9 — Configuration management | Secure Configuration Standard; technical baselines |
| A.8.13 — Backup | Backup Standard; backup verification procedure |
| A.8.15 — Logging | Logging Standard |
| A.8.24 — Cryptography | Encryption/Cryptography Standard |
| A.8.25 — Secure development | Secure Development Policy; Secure Coding Standard |
| A.8.32 — Change management | Change Management Policy; firewall rule change procedure |

---

## Multi-Framework Documentation Mapping

The following table maps key policy/standard types to the multiple frameworks they can simultaneously satisfy:

### Information Security Policy

| Framework | Requirement | How the IS Policy satisfies it |
|---|---|---|
| ISO 27001 | Clause 5.2 — mandatory | Overarching policy is the primary deliverable |
| GDPR | Article 5(2) — accountability principle | Documents management commitment to data protection |
| PCI DSS | Requirement 12.1 — IS policy | Satisfies PCI DSS IS policy requirement |
| Cyber Essentials | Implicit governance requirement | Demonstrates management commitment |
| NIS2 | Article 21 — security policies required | Demonstrates security policy governance |

**One document, five frameworks.**

### Acceptable Use Policy

| Framework | Requirement | How the AUP satisfies it |
|---|---|---|
| ISO 27001 | A.5.10 — acceptable use of assets | Primary control evidence |
| PCI DSS | Requirement 12.2 — acceptable use policies | Satisfies PCI DSS AUP requirement |
| GDPR | Article 32 — appropriate TOMs | Demonstrates technical and organisational measures for staff data handling |
| FCA operational resilience | SYSC requirements — staff obligations | Documents staff obligations for system use |

### Encryption / Cryptography Standard

| Framework | Requirement | How the Encryption Standard satisfies it |
|---|---|---|
| ISO 27001 | A.8.24 — use of cryptography | Primary control documentation |
| GDPR | Article 32(1)(a) — encryption of personal data | Specifies encryption requirements for personal data |
| PCI DSS | Requirements 3 and 4 — CHD protection and transmission | Specifies approved algorithms and TLS requirements |
| Cyber Essentials Plus | Technical requirements — encryption | Confirms encryption standards for devices |
| NIS2 | Article 21(2)(h) — cryptography | Demonstrates cryptographic security measures |

### Patch Management Standard

| Framework | Requirement | How the Patch Management Standard satisfies it |
|---|---|---|
| ISO 27001 | A.8.8 — management of technical vulnerabilities | Primary control documentation |
| PCI DSS | Requirement 6.3 — address security vulnerabilities | Specifies patch SLAs (including 1-month critical patch requirement) |
| Cyber Essentials | Control 3 — security update management | 14-day patch window aligns with CE requirement |
| DORA | ICT risk management — vulnerability monitoring | Demonstrates vulnerability management capability |
| NIS2 | Article 21(2)(e) — security in acquisition and maintenance | Demonstrates patch management processes |

### Supplier Security Policy

| Framework | Requirement | How the Supplier Security Policy satisfies it |
|---|---|---|
| ISO 27001 | A.5.19–A.5.22 — supplier security | Primary control documentation for supplier management |
| GDPR | Article 28 — controller-processor relationship | Establishes the governance for DPA requirements |
| PCI DSS | Requirement 12.8 — TPSP management | Documents the TPSP programme |
| DORA | ICT third-party risk management | Demonstrates third-party oversight programme |
| NIS2 | Article 21(2)(d) — supply chain security | Documents supply chain security governance |

### Incident Management Policy

| Framework | Requirement | How the Incident Management Policy satisfies it |
|---|---|---|
| ISO 27001 | A.5.24–A.5.27 — incident management | Primary control documentation |
| GDPR | Articles 33–34 — breach notification | Policy must include breach notification requirements |
| PCI DSS | Requirement 12.10 — incident response | Satisfies PCI DSS IRP requirement |
| DORA | Pillar 2 — ICT incident management | Policy framework for DORA incident classification and reporting |
| NIS2 | Article 21(2)(b) — incident handling | Documents incident handling capability |

---

## Building the Cross-Framework Documentation Matrix

To manage multi-framework documentation efficiently, build a cross-framework documentation matrix — a register that maps each document to the framework requirements it satisfies.

**Matrix structure:**

| Document | ISO 27001 | GDPR | PCI DSS | Cyber Essentials | DORA | NIS2 |
|---|---|---|---|---|---|---|
| IS Policy | Clause 5.2, A.5.1 | Art. 5(2) | Req. 12.1 | ✓ | Art. 5 | Art. 21 |
| AUP | A.5.10 | Art. 32 | Req. 12.2 | ✓ | — | — |
| Encryption Standard | A.8.24 | Art. 32(1)(a) | Req. 3, 4 | CE+ | Art. 6 | Art. 21(h) |
| Patch Management Standard | A.8.8 | — | Req. 6.3 | Control 3 | Art. 6 | Art. 21(e) |
| Access Control Policy | A.5.15, A.5.18 | Art. 32 | Req. 7, 8 | Control 4 | Art. 6 | Art. 21 |
| Incident Management Policy | A.5.24–27 | Art. 33–34 | Req. 12.10 | — | Pillar 2 | Art. 21(b) |
| Data Classification Policy | A.5.12 | Art. 5(1)(c) | — | — | — | — |
| Supplier Security Policy | A.5.19–22 | Art. 28 | Req. 12.8 | — | Pillar 4 | Art. 21(d) |
| Logging Standard | A.8.15 | Art. 32 | Req. 10 | — | Art. 6 | Art. 21 |
| BCM Policy | A.5.29–30 | — | — | — | Pillar 3 | Art. 21(c) |

**How to use the matrix:**
- When a framework changes (new guidance, new regulation), identify which documents are affected
- When an audit covers multiple frameworks, provide documents with their framework coverage demonstrated
- When a new document is drafted, verify it covers all applicable framework requirements before approval
- When retiring or replacing a document, verify that all framework requirements it satisfied are covered by other documents

---

## GDPR-Specific Documentation Requirements

GDPR has its own documentation requirements, separate from and in addition to ISO 27001. A complete GDPR documentation framework includes:

**Records of Processing Activities (RoPA)** (Article 30): A register of all data processing activities, including purpose, legal basis, data categories, recipients, and retention periods. Not a policy — an operational register that must be maintained.

**Data Protection Policy**: Overarching commitment to data protection, aligned with the IS Policy.

**Privacy Notices** (Articles 13–14): For each data collection context, a notice provided to data subjects. Not a policy — a public-facing communication document.

**Data Processing Agreements (DPAs)** (Article 28): Contracts with each processor. Not a policy — legal agreements with named processors.

**Data Protection Impact Assessment (DPIA) Records** (Article 35): For high-risk processing activities, a documented DPIA. Not a policy — a project-specific record.

**Breach Register**: Record of all personal data breaches (notified and non-notified) with notification decisions. Not a policy — an operational incident register.

**Consent Records**: Where consent is the lawful basis, records of consent given, including what was consented to and when. Not a policy — evidence records.

**Data Subject Rights Procedures**: Procedures for handling SARs, erasure requests, objections, and portability requests within the required timeframes.

These documents sit alongside the IS policy framework but are GDPR-specific operational records rather than security governance documents.

---

## PCI DSS Documentation Requirements

PCI DSS Requirement 12 specifically requires documentation across all 12 requirements. Key documentation requirements:

**Requirement 12.1**: Information security policy — annually reviewed, communicated to all staff.

**Requirement 12.2**: Acceptable use policies — for end-user technologies.

**Requirement 12.3.1**: Targeted risk analysis — for activities where TRA determines frequency.

**Requirement 12.5.1**: Annual CDE scope confirmation — documented annually.

**Requirement 12.6**: Security awareness programme — training records maintained.

**Requirement 12.7**: Personnel screening records — for CDE-access roles.

**Requirement 12.8**: TPSP list — comprehensive list of all TPSPs with their compliance status.

**Requirement 12.10**: Incident response plan — documented, tested, covering all 6 incident response elements.

**Each of Requirements 1–11 has specific documentation elements:**
- Network diagrams (Req. 1)
- Secure configuration standards (Req. 2)
- Data retention schedule (Req. 3)
- Encryption configuration documentation (Req. 4)
- Anti-malware configuration records (Req. 5)
- Patch management records (Req. 6)
- Access control matrix (Req. 7)
- MFA configuration evidence (Req. 8)
- Physical access control records (Req. 9)
- Log review records (Req. 10)
- Vulnerability scan reports and pen test results (Req. 11)

A PCI-compliant documentation framework maps each of these requirements to specific policy, standard, procedure, or evidence documents.

---

## Practical Integration: Building the Unified Framework

### Step 1: Identify All Applicable Frameworks

List every framework that applies to the organisation:
- ISO 27001 (if certifying or aspiring to certify)
- GDPR / UK GDPR (if processing personal data — almost universal)
- PCI DSS (if accepting payment cards)
- Cyber Essentials / CE+ (UK government supply chain)
- DORA (EU financial entities)
- NIS2 / UK NIS (critical infrastructure / essential services)
- Sector-specific (NHS DSP Toolkit, FCA SYSC, CMMC, FedRAMP)

### Step 2: Create the Requirements Register

For each applicable framework, list its documentation requirements. This becomes the master list of documentation the organisation must produce.

**Example (simplified):**
- ISO 27001 Clause 5.2 → IS Policy
- GDPR Article 5(2) → Data Protection commitment (can be in IS Policy or standalone DP Policy)
- PCI DSS Req. 12.1 → IS Policy reviewed annually
- Cyber Essentials → Governance commitment (documented in IS Policy)

Consolidate: these four requirements are all satisfied by a single well-drafted Information Security Policy — one document, four framework requirements.

### Step 3: Build the Document Framework

Create the minimum set of documents that satisfies all identified requirements, using the cross-framework matrix to ensure each requirement is covered. Avoid creating separate documents for each framework where one document can serve multiple.

**Result for a typical UK financial services company:**

| Document | Frameworks covered |
|---|---|
| Information Security Policy | ISO 27001, GDPR, PCI DSS, Cyber Essentials, FCA SYSC |
| Acceptable Use Policy | ISO 27001, PCI DSS |
| Data Classification Policy | ISO 27001, GDPR |
| Access Control Policy | ISO 27001, PCI DSS, GDPR, Cyber Essentials |
| Password Standard | ISO 27001, PCI DSS, Cyber Essentials |
| Encryption Standard | ISO 27001, GDPR, PCI DSS |
| Patch Management Standard | ISO 27001, PCI DSS, Cyber Essentials |
| Supplier Security Policy | ISO 27001, GDPR (DPA requirement), PCI DSS |
| Incident Management Policy | ISO 27001, GDPR, PCI DSS |
| BCM Policy | ISO 27001, FCA Operational Resilience |
| Data Protection Policy | GDPR |
| RoPA | GDPR (Article 30 requirement) |
| DPA template | GDPR (Article 28 requirement) |
| DPIA process document | GDPR (Article 35 requirement) |
| Breach register | GDPR (Article 33 requirement) |

### Step 4: Maintain the Cross-Framework Matrix

Keep the matrix current as frameworks evolve. When:
- A new regulation applies (e.g. DORA comes into force) → assess which existing documents satisfy its requirements; identify gaps; update documents as needed
- A regulation updates (e.g. new NCSC guidance) → assess which documents need updating
- The organisation adds a new compliance obligation → assess existing framework coverage; create only what is genuinely needed

---

## Common Mistakes and Failures

**1. Creating separate documentation for each framework.**
An ISO 27001 password policy, a PCI DSS password standard, and a GDPR authentication guidance document — all covering slightly different requirements for the same subject. When NCSC updates its password guidance, three separate documents must be updated. Consolidate into one authoritative document.

**2. Documentation that covers the framework requirement but not the operational need.**
A policy that satisfies the ISO 27001 auditor's question ("do you have a policy on X?") but does not actually govern the operational activity (because it is too vague, too technical for the audience, or not communicated). Framework compliance and operational effectiveness are both required.

**3. No traceability from control to documentation.**
ISO 27001 Annex A control A.8.8 is in the SoA as "applicable and implemented" — but there is no corresponding standard or procedure. The auditor asks "where is the vulnerability management standard?" The answer is "we have a policy that mentions vulnerabilities" — which is insufficient evidence of A.8.8 implementation.

**4. Documentation that contradicts itself across frameworks.**
The PCI DSS version of the IS Policy (produced for the QSA) requires 90-day password rotation. The ISO 27001 version (produced for the CB) follows NCSC guidance and does not require rotation. Same organisation; two contradictory policies. Both cannot be true; at least one is misleading.

**5. Over-documenting to satisfy auditors.**
Producing 50 separate policies, standards, and procedures because "more documentation looks more comprehensive." The result is an unmanageable library that nobody uses and that will be hopelessly outdated within 18 months. The right documentation framework is the minimum sufficient set — one policy per major subject area, supported by specific standards and key procedures.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Documentation alignment is tested through Stage 1 (does the documentation cover the required elements?) and Stage 2 (does the documentation match operational reality?). Auditors should be able to trace from an ISO 27001 requirement to the specific policy/standard that satisfies it and from there to evidence of implementation. Missing documentation for specific Annex A controls is a common Stage 1 finding.

**CISM:**
- Domain 1 (Governance) — the CISO must ensure the documentation framework satisfies all applicable regulatory and contractual requirements. Understanding how to build an integrated, multi-framework documentation set is a core CISM governance competency.

**CRISC:**
- Domain 1 (IT Risk Identification) — regulatory documentation requirements are a compliance risk category. Missing required documentation is a regulatory risk; contradictory documentation across frameworks creates inconsistency risk. CRISC candidates should understand how documentation supports risk control verification.

**CISSP:**
- Domain 1 (Security and Risk Management) — regulatory compliance documentation is tested. Know which frameworks require specific documentation, how frameworks overlap, and how to build an integrated documentation framework.

---

## GUARDIAN's Take

Multi-framework compliance documentation is one of the most practically challenging tasks in GRC — and one of the most rewarding to do well. When the framework is built correctly, an audit covering three different frameworks produces evidence from the same set of documents. When it is built badly, three separate audits each require building evidence from scratch, with different documents that gradually diverge from each other.

The principle is simple: every framework requirement should be traceable to a specific document, and every document should justify its existence by satisfying at least one framework requirement. Documents that satisfy multiple requirements are architectural triumphs — they reduce maintenance burden, eliminate inconsistency, and demonstrate the coherence of the governance programme.

The cross-framework matrix is the tool that makes this visible. Maintain it. Use it when frameworks change. Use it when new documents are proposed ("which requirement does this new document satisfy? Is it already covered?"). Use it in audits ("here is the document that satisfies requirements A, B, and C across three frameworks").

This is what mature GRC documentation looks like: not a pile of documents, but a designed framework — minimal, coherent, current, and provably sufficient.

---
*Module: Module 9 — Policies, Standards, Procedures | Guardian Curriculum*
