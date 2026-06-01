---
tags: [guardian, grc, module-1, foundations, frameworks, iso27001, nist, cobit, pci-dss, gdpr, cyber-essentials]
module: 1
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: beginner
date: 2026-04-15
guardian-refs: ["G1-01 — What is GRC and Why It Exists", "G1-04 — Compliance Explained", "G1-06 — Information Security vs Cybersecurity vs GRC", "G3-01 — What is ISO 27001", "G7-01 — COBIT", "G7-02 — NIST Cybersecurity Framework", "G7-05 — Cyber Essentials"]
---

# G1-08 — GRC Frameworks Overview — The Landscape

> [!abstract] What This Note Covers
> By the end of this note, you will have a clear map of the major GRC and information security frameworks — what each one is, what problem it solves, who uses it, and how they relate to each other. You will be able to navigate the framework landscape and explain why an organisation might choose one over another.

---

## Why This Exists

Walk into any GRC conversation and within five minutes you will hear a cascade of acronyms: ISO 27001, NIST CSF, COBIT, PCI DSS, SOC 2, GDPR, Cyber Essentials, ITIL, ISO 31000, DORA, NIS2. It can feel like the industry has invented an impenetrable wall of frameworks specifically designed to confuse outsiders.

In reality, each framework exists because a specific group of people — regulators, standards bodies, industry consortia — identified a specific problem that was not being adequately addressed. Each one reflects a particular perspective on what "good" looks like: a regulator's minimum standard, an industry's best practice, or an international consensus on what security management should include.

The confusion arises because frameworks overlap. ISO 27001 and NIST CSF both address information security management. PCI DSS and ISO 27001 share dozens of control requirements. GDPR and ISO 27001 both require data breach response procedures. This overlap is not a bug — it reflects the fact that good security practice is good security practice, regardless of which framework you are working within.

Your job as a GRC professional is not to master every framework in isolation. It is to understand the landscape well enough to:
1. Know which frameworks apply to a given organisation
2. Understand how they relate to each other
3. Build an integrated programme that satisfies multiple obligations without duplicating effort
4. Advise stakeholders on which certifications provide the most business value

---

## The Framework Landscape: A Map

Before diving into individual frameworks, here is a high-level map of how they relate:

```
GOVERNANCE FRAMEWORKS          RISK FRAMEWORKS          COMPLIANCE / REGULATORY
(How to manage security)       (How to manage risk)     (What you must do / prove)

ISO 27001 ─────────────────── ISO 31000 ─────────────── GDPR / UK GDPR
NIST CSF 2.0 ──────────────── NIST RMF ────────────────── PCI DSS
COBIT 2019 ─────────────────── COSO ERM ───────────────── NIS2 / NIS Regulations
                                CRISC Framework ─────────── FCA SYSC Rules
                                                            HIPAA (US)
                                                            DORA (EU Financial)

CERTIFICATION SCHEMES          SECTOR-SPECIFIC           AUDIT / ASSURANCE
(External verification)        FRAMEWORKS                FRAMEWORKS

ISO 27001 Certification ─────── NIST SP 800-53 (US Gov) ── ISO 19011 (Audit)
Cyber Essentials / CE+ ──────── SWIFT CSCF (Banking) ───── SOC 2 Type I / II
SOC 2 Reports ───────────────── CAF (UK CNI) ────────────── ISA/IEC 62443 (OT)
```

---

## The Major Frameworks: One by One

### ISO 27001 — Information Security Management System

**What it is:** The international standard for Information Security Management Systems (ISMS). Published by the International Organization for Standardization (ISO) and the International Electrotechnical Commission (IEC). Current version: ISO/IEC 27001:2022.

**What problem it solves:** Organisations needed a comprehensive, internationally recognised framework for *managing* information security — not just implementing technical controls, but governing the entire security programme. ISO 27001 provides that structure, covering everything from leadership and risk assessment to control implementation and continuous improvement.

**Structure:**
- **Clauses 4–10**: The management system requirements — governance, risk, policy, support, operations, performance, improvement (the "shall" requirements — all mandatory)
- **Annex A**: 93 controls across four categories (Organisational, People, Physical, Technological) — organisations select controls based on their risk assessment

**Who uses it:** Virtually every sector — technology companies, financial services, healthcare, government, retail, manufacturing. Particularly strong in the UK and Europe. Frequently required for government contracts and enterprise sales.

**How you prove it:** External certification by an accredited certification body (e.g. BSI, Bureau Veritas, LRQA). Three-year certification cycle with annual surveillance audits.

**Covered in depth:** Module 3 (ISO 27001) and Module 4 (ISO 27002 Controls)

---

### ISO 27002 — Code of Practice for Information Security Controls

**What it is:** The companion to ISO 27001. Where ISO 27001 tells you *that* you need controls (based on your risk assessment), ISO 27002 tells you *how* to implement them. It is guidance, not a certifiable standard.

**What problem it solves:** Organisations selecting controls from ISO 27001 Annex A need implementation guidance. ISO 27002 provides detailed guidance on each of the 93 controls — what they mean, why they exist, and how to implement them.

**Key point:** You cannot be certified against ISO 27002. Certification is against ISO 27001 only. But ISO 27002 is the essential reference document for anyone implementing ISO 27001 controls.

---

### ISO 31000 — Risk Management

**What it is:** The international standard for risk management principles and guidelines. Not specific to information security — applies to any type of risk across any type of organisation.

**What problem it solves:** Organisations needed a common language and approach to risk management that could be applied consistently across the enterprise — financial risk, operational risk, IT risk, environmental risk — without treating each as a silo.

**Structure:** Principles → Framework → Process (the three-tier model that all good risk programmes follow)

**Relationship to ISO 27001:** ISO 27001 Clause 6 (risk assessment) is informed by ISO 31000 principles. Many organisations use ISO 31000 as the meta-framework within which their ISO 27001 risk process sits.

---

### NIST Cybersecurity Framework (CSF) 2.0

**What it is:** A voluntary framework developed by the US National Institute of Standards and Technology (NIST), originally at the request of the US President following a series of critical infrastructure attacks. Current version: CSF 2.0 (2024).

**What problem it solves:** US critical infrastructure organisations needed a flexible, risk-based framework for managing cybersecurity risk that could be adopted regardless of sector, size, or existing security maturity. CSF was designed to be a common language across sectors.

**Structure — The Six Functions (CSF 2.0):**

| Function | What it covers |
|---|---|
| **Govern** (new in 2.0) | Organisational context, risk management strategy, supply chain risk, roles and responsibilities |
| **Identify** | Asset management, risk assessment, business environment |
| **Protect** | Access control, awareness, data security, protective technology |
| **Detect** | Anomalies and events, continuous monitoring, detection processes |
| **Respond** | Response planning, communications, analysis, mitigation |
| **Recover** | Recovery planning, improvements, communications |

**Who uses it:** Primarily US organisations and US government contractors, but increasingly adopted globally as a risk-based security framework. Widely used in critical infrastructure sectors (energy, healthcare, finance).

**Relationship to ISO 27001:** NIST CSF and ISO 27001 are highly complementary. NIST provides the "what" at a functional level; ISO 27001 provides the management system structure and certifiable standard. Many organisations map between the two. NIST has published official mappings between CSF and ISO 27001.

**Covered in depth:** G7-02

---

### NIST SP 800-53 — Security and Privacy Controls

**What it is:** NIST Special Publication 800-53 is a comprehensive catalogue of security and privacy controls for US federal information systems. Current version: Revision 5 (2020).

**What problem it solves:** US federal agencies and their contractors needed a detailed, prescriptive control catalogue to satisfy the Federal Information Security Management Act (FISMA). SP 800-53 provides that catalogue — over 1,000 individual controls and control enhancements across 20 control families.

**Who uses it:** US federal agencies (mandatory), US government contractors (often mandatory), and private sector organisations that want a comprehensive control baseline (voluntary). Less common outside the US but valuable as a reference for control depth.

**Relationship to ISO 27001:** SP 800-53 is much more granular and prescriptive than ISO 27001 Annex A. Many organisations use SP 800-53 as the detailed implementation reference behind ISO 27001's risk-based control selection.

**Covered in depth:** G7-03

---

### COBIT — Control Objectives for Information and Related Technologies

**What it is:** A framework for IT governance and management, published by ISACA (the same body behind CISM, CRISC, and CISA certifications). Current version: COBIT 2019.

**What problem it solves:** Organisations needed a framework specifically for *IT governance* — how the board and management direct, evaluate, and monitor IT activities. Where ISO 27001 focuses on information security management, COBIT focuses on the governance of all IT, of which security is one component.

**Structure:** COBIT distinguishes between:
- **Governance** (EDM — Evaluate, Direct, Monitor): what the board does
- **Management** (APO, BAI, DSS, MEA — Plan, Build, Run, Monitor): what management does

**Who uses it:** Financial services, large enterprises, and organisations where IT governance is under regulatory scrutiny. Heavily used in conjunction with CRISC and CISA certifications.

**Relationship to ISO 27001:** COBIT provides the IT governance meta-framework; ISO 27001 provides the information security management system within that framework. Organisations often use COBIT for overall IT governance and ISO 27001 for information security specifically.

**Covered in depth:** G7-01

---

### PCI DSS — Payment Card Industry Data Security Standard

**What it is:** A security standard for organisations that store, process, or transmit payment card data. Maintained by the PCI Security Standards Council (PCI SSC), a body established by the major card brands (Visa, Mastercard, Amex, Discover, JCB). Current version: PCI DSS v4.0 (2022).

**What problem it solves:** Payment card fraud was costing the industry billions annually, and card issuers needed a common security baseline across all merchants and payment processors. PCI DSS established that baseline — if you want to accept card payments, you must meet these requirements.

**Structure:** 12 requirements covering network security, cardholder data protection, vulnerability management, access control, monitoring, and security policy.

**Who uses it:** Any organisation that accepts, processes, stores, or transmits cardholder data — retailers, e-commerce companies, payment processors, banks. Scope is determined by cardholder data flows, not just by industry.

**How you prove it:** Depends on transaction volume (Merchant Level 1–4). Level 1 merchants require an annual on-site assessment by a Qualified Security Assessor (QSA). Lower levels may self-assess using a Self-Assessment Questionnaire (SAQ).

**Covered in depth:** Module 6

---

### GDPR / UK GDPR — General Data Protection Regulation

**What it is:** A regulation (not a standard — compliance is legally mandatory) governing the processing of personal data of individuals in the EU (GDPR) and UK (UK GDPR, post-Brexit). Came into force May 2018.

**What problem it solves:** The digital economy had created unprecedented capability for organisations to collect, process, and monetise personal data — with individuals having little awareness, control, or recourse. GDPR re-established individual rights over personal data and imposed obligations on organisations that process it.

**Structure:** 99 Articles covering: lawful basis for processing, data subject rights, controller and processor obligations, DPO requirements, DPIA requirements, breach notification, international transfers, and enforcement.

**Who uses it:** Any organisation that processes personal data of EU or UK individuals — regardless of where the organisation is based. A US company processing EU customer data must comply with GDPR.

**Enforcement:** Supervisory authorities in each EU member state (e.g. ICO in the UK, CNIL in France, BfDI in Germany). Maximum fines: €20M or 4% of global annual turnover (whichever is higher).

**Relationship to ISO 27001:** Significant overlap. ISO 27001 Annex A controls on access management, incident response, supplier management, and data handling all contribute to GDPR compliance. ISO 27001 certification is not sufficient for GDPR compliance (GDPR includes rights and lawfulness requirements beyond technical security) but it is strong evidence of appropriate technical and organisational measures under GDPR Article 32.

**Covered in depth:** Module 5

---

### Cyber Essentials / Cyber Essentials Plus — UK Government Scheme

**What it is:** A UK government-backed certification scheme that defines a baseline set of technical controls to protect against the most common cyber threats. Two levels: Cyber Essentials (self-assessment) and Cyber Essentials Plus (independent technical verification).

**What problem it solves:** Most cyberattacks exploit basic, preventable vulnerabilities — unpatched systems, weak passwords, no MFA, misconfigured firewalls. Cyber Essentials targets exactly these basic hygiene failures.

**The Five Controls:**
1. Firewalls and internet gateways
2. Secure configuration
3. User access control
4. Malware protection
5. Patch management

**Who uses it:** Mandatory for UK central government contracts involving handling personal data or providing certain technical products/services. Increasingly required across the supply chain. Recommended baseline for all UK organisations regardless of sector.

**Relationship to ISO 27001:** Cyber Essentials is a subset — it covers a narrow set of technical controls. ISO 27001 is far broader and deeper. Cyber Essentials is an excellent first step; ISO 27001 is the mature destination.

**Covered in depth:** G7-05

---

### SOC 2 — Service Organisation Control Reports

**What it is:** A framework and reporting standard for service organisations (particularly cloud/SaaS companies) to demonstrate the security, availability, processing integrity, confidentiality, and privacy of their systems. Developed by the AICPA (American Institute of Certified Public Accountants).

**What problem it solves:** US enterprise customers needed a way to assess the security of their cloud and SaaS vendors without conducting individual audits. SOC 2 provides a standardised report that a service organisation can share with customers to demonstrate control effectiveness.

**Two types:**
- **SOC 2 Type I**: Point-in-time assessment — do the controls exist and are they designed appropriately?
- **SOC 2 Type II**: Period-of-time assessment (typically 6–12 months) — did the controls operate effectively over that period?

**Five Trust Service Criteria (TSC):** Security (mandatory), Availability, Processing Integrity, Confidentiality, Privacy (optional — selected based on customer requirements)

**Who uses it:** SaaS companies, cloud service providers, data centres, and managed service providers — particularly those selling to US enterprise customers who require it as a condition of contract.

**Relationship to ISO 27001:** SOC 2 is the US equivalent of ISO 27001 in terms of market recognition. Many companies pursue both — ISO 27001 for European customers, SOC 2 for US customers. The controls overlap significantly but the frameworks are structured differently.

**Covered in depth:** G7-04

---

### ISO 22301 — Business Continuity Management

**What it is:** The international standard for Business Continuity Management Systems (BCMS). Provides a framework for planning, implementing, and maintaining business continuity — the ability to continue operating during and after a disruptive incident.

**Relationship to ISO 27001:** ISO 27001 Annex A includes controls on business continuity (A.5.29–A.5.30). ISO 22301 goes much deeper — it is the dedicated standard for organisations where continuity management is a major concern (banks, hospitals, utilities, logistics).

**Covered in depth:** Module 8

---

### NIS / NIS2 — Network and Information Security Directive (EU)

**What it is:** EU legislation requiring operators of essential services and digital service providers to implement appropriate security measures and report significant incidents. NIS2 (2022) significantly expanded scope and increased penalties.

**Who it applies to:** Essential service operators (energy, transport, banking, health, water, digital infrastructure) and important entities (postal services, waste management, manufacturing, food, digital providers) across the EU. UK has its own NIS Regulations post-Brexit.

**Relationship to ISO 27001:** ISO 27001 certification is widely accepted as evidence of compliance with NIS/NIS2 security requirements. Many EU member state regulators explicitly reference ISO 27001 in their NIS2 guidance.

---

## Choosing the Right Framework: A Decision Guide

| Situation | Primary Framework | Why |
|---|---|---|
| UK SME wanting baseline security | Cyber Essentials Plus | Government-backed, market-recognised, achievable |
| UK/EU company needing to demonstrate security maturity | ISO 27001 | International standard, certifiable, widely required |
| US SaaS company selling to enterprise | SOC 2 Type II | US market expectation; customer-driven demand |
| Organisation processing payment cards | PCI DSS | Legally required by card brands |
| Any organisation processing EU/UK personal data | UK GDPR / GDPR | Legally required regardless of sector |
| US federal contractor | NIST SP 800-53 / FedRAMP | Federally mandated |
| Organisation wanting risk-based security framework | NIST CSF 2.0 | Flexible, sector-agnostic, widely adopted |
| Large enterprise needing IT governance | COBIT | Specifically designed for IT governance |
| Healthcare organisation (US) | HIPAA | Legally required |
| EU financial services firm | DORA + NIS2 | Legally required from 2025 |

In practice, most organisations operate under *multiple* frameworks simultaneously. The skill of GRC is building an integrated control framework that satisfies all of them — implementing a control once and mapping it to multiple requirements — rather than running separate compliance programmes for each.

---

## The Details That Matter

### Framework vs Standard vs Regulation: Important Distinctions

| Type | Definition | Compliance | Examples |
|---|---|---|---|
| **Regulation** | Law passed by a government or regulator. Mandatory. | Required by law. Non-compliance = fines, prosecution. | GDPR, PCI DSS contractual obligations, NIS2, HIPAA |
| **Standard** | Consensus document from a standards body. Voluntary adoption. | Required only if you seek certification or if a contract demands it. | ISO 27001, ISO 22301, NIST SP 800-53 |
| **Framework** | Guidance structure without formal certification or legal teeth. | Voluntary. Adopted for its value, not its mandate. | NIST CSF, COBIT, CIS Controls |
| **Scheme** | Government or industry certification programme. | Mandatory for certain contracts/markets. | Cyber Essentials (UK gov contracts), FedRAMP (US gov cloud) |

### Control Mapping: Working Across Frameworks

One of the most valuable skills in GRC is mapping controls across frameworks — identifying where a single control satisfies requirements from multiple sources. Example:

**Control: Multi-Factor Authentication (MFA) for all privileged access**

| Framework | Where it appears |
|---|---|
| ISO 27001 Annex A | A.8.5 (Secure authentication) |
| NIST CSF | PR.AA-03 (Identities are proofed and bound to credentials) |
| PCI DSS v4.0 | Requirement 8.4 (MFA implemented for all access into the CDE) |
| GDPR | Article 32 (appropriate technical measures for security of processing) |
| Cyber Essentials | User access control (MFA for cloud services) |
| NIST SP 800-53 | IA-2 (Identification and Authentication) |

One control. Six framework requirements. Implement it once, document it properly, and map it to all six. This is integrated GRC in practice.

---

## Common Mistakes and Failures

**1. Framework collection without integration.**
Organisations pursue ISO 27001, PCI DSS, SOC 2, and Cyber Essentials as separate programmes, with separate teams, separate control sets, and separate evidence repositories. Enormous duplicated effort and inconsistent outcomes. Fix: build one integrated control framework and map to all obligations.

**2. Confusing a framework with a regulation.**
"We have to comply with ISO 27001." No — you do not have to comply with ISO 27001 (unless a contract requires it). You might *choose* to certify. GDPR, by contrast, is a regulation. You must comply. The distinction matters because it changes the risk calculation and the urgency of implementation.

**3. Choosing a framework for the wrong reason.**
Pursuing ISO 27001 because a competitor has it, without understanding whether it is the right fit for your organisation's maturity, sector, and customer base. Framework selection should be driven by business need, customer requirements, and regulatory obligation — not peer pressure.

**4. Treating framework adoption as the goal.**
"We are implementing ISO 27001" is not a security goal. It is a means. The goal is to genuinely improve the security posture and reduce risk to an acceptable level. The certification is the proof, not the purpose.

**5. Ignoring framework updates.**
ISO 27001 was updated in 2022. NIST CSF moved to version 2.0 in 2024. PCI DSS moved to v4.0 in 2022. Organisations sometimes certify against an older version and fail to transition. Stay current — frameworks evolve to address new threats and close old gaps.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Know the structure of ISO 27001 (Clauses 4–10 + Annex A) deeply — this is what the qualification tests.
- Understand how ISO 27001 relates to ISO 27002 (implementation guidance), ISO 27005 (risk management), and ISO 19011 (audit guidelines).
- Know what ISO 27001 certification proves and what it does not — it proves you have a functioning ISMS, not that you are impenetrable.

**CISM:**
- CISM tests awareness of the full framework landscape at a strategic level. Candidates must be able to advise a board on which frameworks are relevant and why.
- Domain 1 (Governance) requires understanding how frameworks support governance structures.

**CRISC:**
- CRISC references COBIT, ISO 31000, and NIST RMF as risk frameworks. Know how risk frameworks fit within the broader GRC landscape.

**CISSP:**
- Domain 1 covers security governance principles and frameworks. Candidates must understand the purpose of major frameworks and how they relate to each other.
- CISSP candidates are expected to select appropriate frameworks for given scenarios — not just name them, but explain *why* a specific framework is appropriate for a specific context.

---

## GUARDIAN's Take

The framework landscape is both the GRC professional's greatest asset and their greatest trap.

The asset: every framework represents decades of collective learning, hard-won through incidents, regulatory failures, and organisational disasters. ISO 27001 is not an arbitrary set of rules — it is the distilled wisdom of what well-run security programmes actually do. NIST CSF reflects the US critical infrastructure community's hard lessons from nation-state attacks. PCI DSS exists because card fraud was destroying trust in the payment system. Use these frameworks. They are standing on the shoulders of giants.

The trap: the framework becomes the goal. The organisation measures success by which certificates it holds and which audits it passes, rather than by whether it is genuinely more secure and resilient than it was before. This is the tick-box mindset, and it is endemic.

My advice for navigating the landscape:

**Start with regulatory requirements.** If you process EU personal data, GDPR applies — no choice. If you take card payments, PCI DSS applies. These are non-negotiable. Satisfy them first.

**Then choose a management framework that fits your context.** ISO 27001 if you are UK/Europe-focused and need market recognition. NIST CSF if you are US-focused or in critical infrastructure. Cyber Essentials first if you are a small UK organisation just starting out.

**Then use the framework as a vehicle, not a destination.** The ISMS you build to achieve ISO 27001 certification should be genuinely managing your risks — not a compliance artefact that exists only to satisfy the auditor. If your ISMS is not actually making your organisation more secure, you have built it wrong.

The best GRC programmes I have seen treat frameworks as useful maps, not as sacred texts. They use them for structure and as a check that nothing important has been missed. But they always ask: given *our* assets, *our* threats, and *our* risk appetite, what actually matters here? The answer to that question — not the framework checklist — is where real security lives.

---
*Module: Module 1 — Foundations | Guardian Curriculum*
