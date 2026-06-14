---
tags: [guardian, grc, module-6, pci-dss, iso27001, mapping, overlap, integration]
module: 6
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-19
guardian-refs: ["G6-01 — What is PCI DSS and Who Must Comply", "G6-02 — The 12 PCI DSS Requirements", "G5-09 — GDPR and ISO 27001 — How They Overlap", "G3-10 — Annex A Controls — Complete Reference 2022", "G4-04 — Technological Controls"]
---

# G6-08 — PCI DSS and ISO 27001 — Mapping and Overlap

> [!abstract] What This Note Covers
> By the end of this note, you will understand how PCI DSS and ISO 27001 relate to each other — where they overlap, where they diverge, how an integrated programme serves both, and the precise mapping between PCI DSS requirements and ISO 27001 Annex A controls.

---

## Why This Exists

Organisations that process payment card data frequently hold both ISO 27001 certification and PCI DSS compliance obligations. Without an integrated approach, these become two parallel compliance programmes — duplicating risk assessments, policies, controls, and audit activity. This duplication is expensive, creates inconsistencies, and produces a fragmented security programme.

The relationship between PCI DSS and ISO 27001 is one of the most useful alignments in the compliance landscape because the two frameworks are genuinely complementary — they address similar security objectives through different approaches. ISO 27001's risk-based, management-system approach and PCI DSS's prescriptive, control-specific approach together produce a more complete, more defensible security programme than either alone.

Understanding the precise mapping — and the genuine gaps — enables organisations to build a single, integrated programme that satisfies both frameworks efficiently.

---

## The Fundamental Difference in Philosophy

**ISO 27001** is a risk-based management system framework. It requires organisations to identify their specific risks and implement controls proportionate to those risks. The controls in Annex A are a reference set — not all 93 are mandatory. The organisation selects controls based on its risk assessment and documents why controls are or are not applicable in the SoA.

**PCI DSS** is a prescriptive compliance framework. Its 12 requirements and their sub-requirements are specific, mandatory controls for all organisations in scope. There is no risk-based selection — if you process Visa payments, Requirement 1 (network security controls) applies, regardless of your risk assessment.

**The integrated value**: PCI DSS prescriptiveness fills a gap in ISO 27001 — it mandates specific controls for cardholder data environments that ISO 27001's risk-based approach might or might not select. ISO 27001's management system discipline fills a gap in PCI DSS — it provides the governance, continual improvement, and management review structures that PCI DSS requires but doesn't define as comprehensively.

Together: PCI DSS tells you what controls to implement for card data. ISO 27001 tells you how to manage and improve the overall security programme. Both are needed for a complete programme.

---

## The Detailed Mapping: PCI DSS Requirements to ISO 27001 Annex A

### PCI DSS Requirement 1 — Network Security Controls

**Maps to:**
- A.8.20 (Networks security) — primary alignment
- A.8.21 (Security of network services)
- A.8.22 (Segregation of networks) — firewall/segmentation
- A.5.37 (Documented operating procedures) — firewall management procedures

**Key overlap**: Both frameworks require network access controls, documented configuration standards, and periodic review of firewall/NSC rules. ISO 27001 Clause 8 (Operation) drives implementation; PCI DSS Requirement 1.3 specifies what must be controlled.

**Gap**: PCI DSS requires specific 6-monthly firewall rule reviews — ISO 27001 does not specify a frequency. ISO 27001's risk-based approach might determine a different review frequency; PCI DSS mandates at minimum 6 months.

---

### PCI DSS Requirement 2 — Secure Configurations

**Maps to:**
- A.8.9 (Configuration management) — primary alignment (new in ISO 27002:2022)
- A.8.19 (Installation of software on operational systems)
- A.5.37 (Documented operating procedures)

**Key overlap**: Both require documented secure configuration baselines and evidence that systems are configured to those baselines. A.8.9's configuration management requirement aligns closely with PCI DSS Requirement 2's secure configuration standards.

**Gap**: PCI DSS specifically prohibits vendor-supplied defaults — this is explicit in a way that A.8.9's general configuration management is not. An ISO 27001 ISMS that does not specifically address vendor defaults may miss this PCI DSS requirement.

---

### PCI DSS Requirement 3 — Protect Stored Account Data

**Maps to:**
- A.8.24 (Use of cryptography) — encryption of stored CHD
- A.8.10 (Information deletion) — data minimisation and retention
- A.5.12 (Classification of information) — identifying CHD as sensitive

**Key overlap**: A.8.24 requires appropriate cryptography for sensitive data; PCI DSS Requirement 3 specifies the cryptographic standards for cardholder data. A.8.10 addresses information deletion — aligning with PCI DSS's data minimisation requirement.

**Gap**: PCI DSS's absolute prohibition on storing SAD (Requirement 3.3) has no direct ISO 27001 equivalent — ISO 27001's classification and handling policies might address this, but only if the policy specifically identifies SAD as prohibited from storage. The PCI DSS requirement is categorical; ISO 27001 requires the organisation to derive this conclusion from its risk assessment and policy.

---

### PCI DSS Requirement 4 — Protect Cardholder Data in Transmission

**Maps to:**
- A.8.24 (Use of cryptography) — TLS for data in transit
- A.5.14 (Information transfer) — secure transfer requirements

**Key overlap**: Both frameworks require encryption for sensitive data in transit. A.5.14's information transfer policy and A.8.24's cryptography use requirements together cover the PCI DSS Requirement 4 obligations.

**Gap**: PCI DSS explicitly prohibits specific deprecated protocols (SSL, early TLS, TLS 1.0/1.1). ISO 27001's cryptography policy would need to specifically address these to be equivalent — a risk-based assessment might conclude that TLS 1.0 is acceptable for some internal communications, whereas PCI DSS prohibits it for any CHD transmission.

---

### PCI DSS Requirement 5 — Protect Against Malware

**Maps to:**
- A.8.7 (Protection against malware) — primary alignment
- A.6.3 (Information security awareness, education and training) — phishing protection (v4.0)

**Key overlap**: A.8.7 directly maps to PCI DSS Requirement 5 — both require anti-malware solutions on applicable systems, kept current and actively running. v4.0's phishing protection requirement maps to awareness training and technical anti-phishing controls.

**Gap**: PCI DSS specifies that anti-malware must be evaluated for all system components (not just workstations — servers, network devices) and must specifically address the types of malware prevalent in the payment industry. ISO 27001's risk-based approach may not reach the same coverage if the risk assessment underestimates malware risk.

---

### PCI DSS Requirement 6 — Secure Development and Vulnerability Management

**Maps to:**
- A.8.8 (Management of technical vulnerabilities) — vulnerability and patch management
- A.8.25 (Secure development life cycle)
- A.8.28 (Secure coding) — new in 2022
- A.8.29 (Security testing in development and acceptance)
- A.8.32 (Change management)

**Key overlap**: Strong alignment across secure development (A.8.25, A.8.28, A.8.29) and vulnerability management (A.8.8) with PCI DSS Requirement 6. Change management (A.8.32) maps to PCI DSS Requirement 6.5 (change management including security review).

**Gap**: PCI DSS specifies that critical patches must be applied within 1 month and high-severity patches within a defined timeframe. ISO 27001 requires vulnerability management but does not specify mandatory patch SLAs — the organisation's risk assessment determines the SLA. A risk assessment might produce a longer SLA than PCI DSS requires for some categories.

---

### PCI DSS Requirement 7 — Restrict Access by Need to Know

**Maps to:**
- A.5.15 (Access control) — overall access control policy
- A.5.18 (Access rights) — access provisioning, review, and revocation

**Key overlap**: Both frameworks require role-based access control, access reviews, and the principle of least privilege. A.5.15 and A.5.18 together cover the core of PCI DSS Requirement 7.

**Gap**: PCI DSS specifies that access reviews for CHD systems must be conducted at least every 6 months. ISO 27001 does not mandate a specific review frequency — the frequency is determined by the risk assessment. The ISO 27001 programme might determine annual reviews are acceptable for some access types; PCI DSS requires at minimum 6-monthly for CDE access.

---

### PCI DSS Requirement 8 — Identify Users and Authenticate Access

**Maps to:**
- A.5.16 (Identity management)
- A.5.17 (Authentication information)
- A.8.5 (Secure authentication) — MFA
- A.5.18 (Access rights)

**Key overlap**: Strong alignment between PCI DSS Requirement 8 and ISO 27001's identity and authentication controls. A.8.5's secure authentication requirement directly maps to PCI DSS's MFA requirements. A.5.16 and A.5.17 map to unique IDs, credential management, and password policy.

**Gap**: PCI DSS v4.0 requires MFA for ALL access into the CDE — this is more prescriptive than ISO 27001's risk-based MFA requirement. ISO 27001 might determine MFA is only required for remote or privileged access; PCI DSS now requires it for all CDE access. PCI DSS also specifies a minimum 12-character password (without MFA) — ISO 27001 does not mandate a specific length.

---

### PCI DSS Requirement 9 — Physical Security

**Maps to:**
- A.7.1 (Physical security perimeters)
- A.7.2 (Physical entry)
- A.7.4 (Physical security monitoring)
- A.7.10 (Storage media)
- A.7.14 (Secure disposal or re-use of equipment)

**Key overlap**: Strong alignment between PCI DSS Requirement 9 and ISO 27001 Category 7 physical controls. Both require access controls, visitor management, media security, and secure disposal.

**Gap**: PCI DSS Requirement 9.5 specifically addresses Point of Interaction (POI) device security — protecting card terminals from tampering and skimming. ISO 27001 has no equivalent specific control for payment terminals. This must be addressed in the ISMS if the organisation uses POI devices.

---

### PCI DSS Requirement 10 — Log and Monitor

**Maps to:**
- A.8.15 (Logging) — primary alignment
- A.8.16 (Monitoring activities) — primary alignment
- A.8.17 (Clock synchronisation)

**Key overlap**: Very strong alignment between PCI DSS Requirement 10 and ISO 27001's logging and monitoring controls. A.8.15 maps to the logging requirements; A.8.16 maps to the monitoring and review requirements; A.8.17 maps to time synchronisation.

**Gap**: PCI DSS specifies that logs must be retained for at least 12 months with at least 3 months immediately available. ISO 27001 does not mandate a specific retention period — the risk assessment and applicable regulations determine retention. PCI DSS also specifies exactly what events must be logged (authentication events, privilege changes, access to CHD, etc.) — ISO 27001 leaves this to the risk assessment.

---

### PCI DSS Requirement 11 — Test Security

**Maps to:**
- A.8.8 (Management of technical vulnerabilities) — vulnerability scanning
- A.5.35 (Independent review of information security) — penetration testing
- A.8.20 (Networks security) — network monitoring/IDS

**Key overlap**: Both frameworks require vulnerability scanning, penetration testing, and security monitoring. PCI DSS Requirement 11 specifies frequencies and scope; ISO 27001 requires these activities based on risk assessment.

**Gap**: PCI DSS mandates quarterly ASV scans, annual penetration tests, and — for e-commerce — payment page integrity monitoring (Requirement 11.6.1). ISO 27001 does not mandate specific testing frequencies or the specific payment page monitoring requirement. An ISO 27001 risk assessment for an e-commerce merchant might not identify the need for payment page monitoring if it did not specifically consider Magecart-style attacks.

---

### PCI DSS Requirement 12 — Information Security Policy and Programme

**Maps to:**
- A.5.1 (Policies for information security) — IS policy
- A.5.2 (Information security roles and responsibilities)
- A.6.3 (Information security awareness, education and training)
- A.6.1 (Screening) — background checks
- A.5.19–A.5.22 (Supplier security) — TPSP management
- A.5.24–A.5.28 (Incident management)
- A.2-A.3 (Risk management) — annual risk assessment

**Key overlap**: Very strong alignment between PCI DSS Requirement 12 and ISO 27001's governance, HR, supplier, and incident management controls. The policy, training, TPSP management, and incident response requirements in PCI DSS 12 directly correspond to ISO 27001 Annex A controls.

**Gap**: PCI DSS Requirement 12 requires an annual review of the overall PCI DSS compliance programme and scope confirmation. ISO 27001's management review (Clause 9.3) serves a similar function but is not specifically scoped to cardholder data environment scope validation. The ISMS management review must be extended to explicitly cover CDE scope confirmation and PCI DSS compliance status for organisations with both obligations.

---

## Summary Mapping Table

| PCI DSS Requirement | Primary ISO 27001 Annex A Alignment | Key Gap |
|---|---|---|
| Req 1 — Network Security Controls | A.8.20, A.8.22 | Specific 6-monthly rule review frequency |
| Req 2 — Secure Configurations | A.8.9 | Explicit vendor default prohibition |
| Req 3 — Protect Stored Data | A.8.24, A.8.10 | Absolute SAD prohibition |
| Req 4 — Transmission Encryption | A.8.24, A.5.14 | Specific protocol prohibitions (SSL, early TLS) |
| Req 5 — Anti-Malware | A.8.7 | Phishing-specific controls (v4.0) |
| Req 6 — Secure Development / Patches | A.8.8, A.8.25, A.8.28, A.8.29 | Mandatory 1-month critical patch SLA |
| Req 7 — Need-to-Know Access | A.5.15, A.5.18 | 6-monthly access review minimum |
| Req 8 — Authentication | A.5.16, A.5.17, A.8.5 | MFA for ALL CDE access; 12-char password |
| Req 9 — Physical Security | A.7.1, A.7.2, A.7.4, A.7.10, A.7.14 | POI device-specific tamper protection |
| Req 10 — Logging and Monitoring | A.8.15, A.8.16, A.8.17 | 12-month retention; specific events logged |
| Req 11 — Security Testing | A.8.8, A.5.35 | Quarterly ASV; payment page monitoring |
| Req 12 — Policy and Programme | A.5.1, A.6.3, A.5.19–22, A.5.24–28 | CDE scope validation; TPSP compliance tracking |

---

## Where ISO 27001 Covers Things PCI DSS Does Not

ISO 27001 provides governance and management infrastructure that PCI DSS requires but does not specify:

**Management system**: ISO 27001's management system requirements (Clauses 4–10) provide the governance structure that PCI DSS assumes but doesn't define. The ISMS context analysis, management review, continual improvement, and corrective action processes apply to PCI DSS compliance — but PCI DSS doesn't define how to implement them.

**Risk assessment methodology**: ISO 27001 Clause 6.1.2 requires a systematic risk assessment. PCI DSS requires a targeted risk analysis for specific frequency determinations (v4.0) but does not define the overall risk management methodology. ISO 27001's risk assessment framework provides the methodology that PCI DSS TRAs can use.

**Broader asset and information protection**: ISO 27001 covers the organisation's complete information asset portfolio — not just cardholder data. Email security, HR data protection, intellectual property protection, business continuity — all within ISO 27001 scope but outside PCI DSS.

**Supplier security for non-CHD suppliers**: PCI DSS Requirement 12.8 covers TPSPs with CHD access. ISO 27001's supplier security controls (A.5.19–A.5.22) cover all suppliers — including those without CHD access. The broader supplier programme in ISO 27001 complements PCI DSS's narrower TPSP focus.

**Continual improvement discipline**: ISO 27001's Clause 10 corrective action and improvement process provides the systematic improvement mechanism that PCI DSS compliance generates needs for but doesn't define. When a QSA finding identifies a control gap, the ISO 27001 corrective action process provides the formal mechanism for addressing it.

---

## Building the Integrated Programme

### Single Policy Framework

One information security policy that addresses both frameworks — explicitly referencing cardholder data protection obligations and GDPR obligations alongside general information security requirements. Topic-specific policies (access control, cryptography, incident response) address both ISO 27001 and PCI DSS requirements, noting where PCI DSS mandates specific standards (e.g. TLS 1.2 minimum, 12-character passwords for CDE systems without MFA).

### Single Risk Assessment

The ISMS risk assessment includes cardholder data environment risks as a specific risk category. The risk register includes risks such as:
- Unauthorised access to stored PAN (addresses PCI DSS Req 3 + ISO 27001 CIA)
- Network breach enabling access to CDE (addresses PCI DSS Req 1/10 + ISO 27001 CIA)
- Malware infection of POS system (addresses PCI DSS Req 5/11 + ISO 27001 CIA)

PCI DSS Targeted Risk Analyses feed into the overall ISMS risk register — consistent methodology, shared documentation.

### Single Internal Audit Programme

The internal audit programme covers both ISO 27001 requirements and PCI DSS requirements. The annual full-scope internal audit assesses ISO 27001 conformance; quarterly or semi-annual targeted audits assess specific PCI DSS requirements (particularly those with defined review frequencies: firewall rules, access reviews, log reviews).

### Single Incident Response Process

The incident response plan addresses information security incidents, GDPR breach notification, and PCI DSS incident response (Requirement 12.10) in a single document. The process for determining whether an incident involves CHD — and what that triggers (QSA notification, card brand notification, forensic investigation) — is explicitly included.

### Single Supplier Management Programme

Supplier assessment covers:
- Information security assessment (ISO 27001 A.5.19)
- DPA execution where CHD is processed (GDPR Article 28)
- PCI DSS TPSP acknowledgement where CHD access exists (PCI DSS Requirement 12.8–12.9)

One supplier record captures all three dimensions.

### The Annual Assessment Calendar

| Activity | Framework | Timing |
|---|---|---|
| Internal audit (full scope) | ISO 27001 | 3 months before surveillance |
| Management review | ISO 27001 | Annually + quarterly (committee) |
| Risk assessment review | ISO 27001 / PCI DSS | Annually |
| CDE scope confirmation | PCI DSS Req 12.5 | Annually |
| PAN discovery scans | PCI DSS Req 12.5.2 | Quarterly |
| Firewall rule review | PCI DSS Req 1 | 6-monthly |
| Access reviews (CDE) | PCI DSS Req 7/8 | 6-monthly minimum |
| External ASV scans | PCI DSS Req 11 | Quarterly |
| Penetration test | PCI DSS Req 11.4 | Annual + post-significant-change |
| QSA assessment | PCI DSS (Level 1) | Annual |
| ISO 27001 surveillance | ISO 27001 | Annual |

---

## Common Mistakes and Failures

**1. Running parallel, disconnected compliance programmes.**
A PCI DSS team and an ISO 27001 team with separate risk registers, separate policies, separate audit programmes, and separate supplier assessments. This creates duplication, inconsistency, and significant unnecessary cost.

**2. Assuming ISO 27001 certification satisfies PCI DSS.**
ISO 27001 certification demonstrates security programme maturity but does not satisfy PCI DSS. The specific prescriptive controls (quarterly ASV scans, 6-monthly firewall rule reviews, mandatory patch SLAs, MFA for all CDE access) are PCI DSS-specific and must be implemented regardless of ISO 27001 status.

**3. Not extending ISO 27001 Annex A controls to cover PCI DSS gaps.**
The SoA may include all relevant controls — but if the implementation of A.8.8 (vulnerability management) does not meet PCI DSS's mandatory 1-month critical patch SLA, the ISO 27001 control is insufficient for PCI DSS purposes. Controls must be implemented to the more demanding standard where the two frameworks diverge.

**4. Not including PCI DSS requirements in the ISMS internal audit.**
The internal audit programme assesses ISO 27001 conformance but does not include PCI DSS-specific requirements. Pre-QSA assessment internal audits are conducted separately. The gap: PCI DSS findings may not feed into the ISO 27001 corrective action process, and ISO 27001 internal audits may miss PCI DSS compliance gaps.

**5. Different risk methodologies for ISMS and PCI DSS TRA.**
The ISMS uses a 5×5 likelihood/impact matrix. PCI DSS Targeted Risk Analyses use a different format and scoring approach. Inconsistent methodology produces inconsistent risk conclusions and makes demonstrating integrated programme management harder.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Auditors working with payment organisations must understand where PCI DSS requirements are stricter than ISO 27001 controls — these represent compliance gaps even for ISO 27001-certified organisations. Particularly: MFA scope, patch SLAs, log retention, access review frequencies, and specific testing requirements.
- A.5.37 (Documented operating procedures) and A.8.32 (Change management) are areas where PCI DSS and ISO 27001 align closely — auditors should assess both frameworks' requirements simultaneously.

**CISM:**
- Domain 3 (Security Programme) — integrated compliance programme management is a CISO-level capability. CISM candidates should understand how to design a programme that satisfies multiple compliance frameworks without unnecessary duplication.

**CRISC:**
- Compliance risk management across multiple frameworks (ISO 27001, PCI DSS, GDPR) is a complex risk management challenge. CRISC candidates must understand how to assess and manage cross-framework compliance risk efficiently.

---

## GUARDIAN's Take

The PCI DSS / ISO 27001 relationship is, in my view, one of the most practically useful alignments in the compliance landscape. They were not designed to complement each other — PCI DSS predates ISO 27001's current form — but they do complement each other remarkably well.

ISO 27001 provides what PCI DSS lacks: a systematic, risk-based management framework that creates governance discipline, drives continual improvement, and ensures the security programme evolves with the threat landscape. PCI DSS provides what ISO 27001 often underspecifies: concrete, testable controls for cardholder data that must be implemented regardless of what the risk assessment might otherwise conclude.

The integrated programme is more than the sum of its parts. An organisation with ISO 27001 certification and PCI DSS compliance has demonstrated something that neither certification alone demonstrates: a mature security programme that combines risk-based governance with prescriptive control discipline. That combination is what sophisticated enterprise customers, regulators, and business partners are increasingly demanding.

Build the integrated programme from the start. Don't let two separate compliance teams build two separate programmes that you then have to reconcile. Map the frameworks, identify the gaps, implement to the more demanding standard, and audit both simultaneously. The cost savings are significant; the security outcome is better; the compliance posture is stronger.

And when you stand in front of your board to report on security — you can report on a single, coherent programme that addresses the organisation's risks comprehensively, satisfies your contractual obligations to the card brands, meets your regulatory obligations under GDPR, and provides independent assurance through two respected certification frameworks. That is the value of integrated GRC programme management.

---
*Module: Module 6 — PCI DSS | Guardian Curriculum*
