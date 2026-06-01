---
tags: [guardian, grc, module-7, soc2, aicpa, trust-services, service-organisation, audit]
module: 7
cert-coverage: [cism, crisc, cissp, iso27001-la]
difficulty: intermediate
date: 2026-04-19
guardian-refs: ["G1-04 — Compliance Explained", "G1-08 — GRC Frameworks Overview", "G7-01 — COBIT", "G7-02 — NIST CSF 2.0", "G7-07 — Framework Decision Guide"]
---

# G7-04 — SOC 2 — Service Organisation Controls

> [!abstract] What This Note Covers
> By the end of this note, you will understand what SOC 2 is, the five Trust Services Criteria, the difference between Type I and Type II reports, how SOC 2 relates to ISO 27001, when organisations need it, and what the audit process involves.

---

## Why This Exists

In 2019, a major US software company discovered that one of its SaaS vendors had suffered a data breach affecting customer data. The vendor had no SOC 2 report. The company's security team had no independent assurance that the vendor's security controls were operating effectively. The vendor's security questionnaire responses, it turned out, overstated the maturity of their controls.

This scenario repeats constantly in the technology industry. As cloud adoption accelerates and organisations increasingly depend on third-party SaaS platforms for critical functions — HR, finance, CRM, communication, development — the question of how to obtain reliable assurance about those vendors' security is a pressing practical challenge.

SOC 2 (System and Organisation Controls 2) is the most widely adopted assurance mechanism for US technology companies. It provides an independent auditor's opinion on whether a service organisation's controls relevant to security, availability, processing integrity, confidentiality, and privacy are suitably designed and operating effectively.

For GRC professionals in the UK, SOC 2 matters because: UK enterprise clients increasingly have US parents or US investors who require their UK vendors to hold SOC 2 reports; UK technology companies selling to US enterprise customers are routinely required to produce SOC 2 reports as a condition of doing business; and UK companies using US SaaS vendors should understand what SOC 2 reports mean and how to evaluate them.

---

## What SOC 2 Is

**SOC 2** is an auditing standard developed by the **American Institute of Certified Public Accountants (AICPA)**. It applies to **service organisations** — companies that provide services to other organisations (not direct consumers) where those services involve the processing, transmission, or storage of customer data.

**Who SOC 2 is for**: Cloud service providers (SaaS, IaaS, PaaS), managed service providers, data centres, payroll processors, healthcare IT vendors, financial technology companies, and any technology company that stores or processes customer data as part of its service.

**Who relies on SOC 2 reports**: Organisations that use service providers — particularly enterprise customers with security and compliance programmes — rely on SOC 2 reports as vendor assurance evidence. Without a SOC 2 report, the customer must rely on self-reported questionnaire responses or conduct their own audit of the vendor.

**The auditor**: SOC 2 audits are conducted by licensed CPA (Certified Public Accountant) firms — not security-specific firms, though many SOC 2 auditors also have security expertise. The audit is an attestation engagement under AICPA AT-C Section 205.

**The governing standard**: SOC 2 is based on the AICPA's **Trust Services Criteria (TSC)** — a set of control criteria across five categories. The TSC replaced the earlier SAS 70 and SSAE 16 standards.

---

## The Five Trust Services Criteria (TSC)

The Trust Services Criteria define the control areas assessed in a SOC 2 audit. Each criterion is associated with a set of **points of focus** — specific practices that demonstrate the criterion is met.

### 1. Security (CC — Common Criteria)

**Always required** — Security is the mandatory TSC category. All SOC 2 reports must cover Security; the other four are optional.

**What it covers**: Protection of the system from unauthorised access, unauthorised disclosure, and damage. The Security criteria are the most extensive — divided into Common Criteria (CC) numbered CC1 through CC9.

**CC1 — Control Environment**: The foundation of internal control — values and ethics, governance structures, human resources practices.

**CC2 — Communication and Information**: Managing and communicating information to support control objectives.

**CC3 — Risk Assessment**: Identifying, assessing, and managing risks — including fraud risk.

**CC4 — Monitoring of Controls**: Continuous monitoring to evaluate control effectiveness.

**CC5 — Control Activities**: Selecting and developing control activities to mitigate risks.

**CC6 — Logical and Physical Access Controls**: Managing logical access (authentication, authorisation, access revocation) and physical access to systems and data.

**CC7 — System Operations**: Operating systems to meet the entity's objectives — detecting anomalies, security incidents, and vulnerability management.

**CC8 — Change Management**: Implementing changes that meet the entity's objectives — including security review of changes.

**CC9 — Risk Mitigation**: Identifying and selecting risk mitigation controls, including vendor and business partner management.

**ISO 27001 mapping**: The Security TSC maps comprehensively to ISO 27001 Annex A. CC6 maps to A.5.15–A.5.18 (access control) and A.8.2–A.8.5 (authentication). CC7 maps to A.8.7–A.8.8 (malware, vulnerability management) and A.8.15–A.8.16 (logging, monitoring). CC8 maps to A.8.32 (change management). CC9 maps to A.5.19–A.5.22 (supplier security).

### 2. Availability (A)

**Optional** — Included when the service's availability commitments are relevant to users.

**What it covers**: The system is available for operation and use as committed or agreed. Availability criteria address: performance monitoring, environmental controls, backup, disaster recovery, and capacity management.

**When to include**: Almost always included by cloud and SaaS providers, where system availability is a core service commitment. SLAs for uptime are supported by Availability TSC evidence.

**ISO 27001 mapping**: A.8.13 (backup), A.8.14 (redundancy), A.5.29–A.5.30 (business continuity and ICT readiness).

### 3. Processing Integrity (PI)

**Optional** — Included when complete and accurate processing is relevant to users.

**What it covers**: System processing is complete, valid, accurate, timely, and authorised. Processing integrity addresses: processing controls, output monitoring, and error handling.

**When to include**: Relevant for payment processors, financial data services, healthcare billing systems, and other services where data processing accuracy is critical.

### 4. Confidentiality (C)

**Optional** — Included when the service involves confidential information.

**What it covers**: Information designated as confidential is protected as committed or agreed. Confidentiality criteria address: how confidential information is identified, how it is protected during processing and storage, and how it is disposed of.

**When to include**: Almost always relevant for enterprise SaaS companies — customers' business data is typically confidential.

**ISO 27001 mapping**: A.5.12 (classification), A.8.10 (information deletion), A.8.24 (cryptography).

### 5. Privacy (P)

**Optional** — Included when the service involves personal information.

**What it covers**: Personal information is collected, used, retained, disclosed, and disposed of in conformity with the commitments in the entity's privacy notice and with criteria set forth in AICPA's privacy framework (aligned with Generally Accepted Privacy Principles).

**When to include**: Services that process personal information — relevant for many SaaS applications. Note: The Privacy TSC addresses privacy from a US perspective; it is not equivalent to GDPR compliance, though there is substantial overlap.

**GDPR connection**: SOC 2 Privacy criteria and GDPR requirements overlap significantly but are not identical. SOC 2 Privacy addresses notice, choice, collection, use, retention, disclosure, and protection — similar to GDPR principles. However, GDPR has additional requirements (legal basis, data subject rights, DPO, etc.) not fully addressed by the Privacy TSC.

---

## SOC 2 Type I vs Type II

The most important distinction in SOC 2 is the report type:

### SOC 2 Type I

**What it assesses**: Whether the service organisation's controls are **suitably designed** to meet the Trust Services Criteria **as of a specific point in time**.

**Period**: A single date (e.g. "as of 31 December 2025").

**Auditor's opinion**: The controls are (or are not) suitably designed to achieve the stated criteria.

**What it demonstrates**: The organisation has appropriate controls in place at the date of the report. It does not demonstrate that those controls have been operating effectively over time.

**When it is used**: Typically for organisations obtaining their first SOC 2 report — useful for demonstrating control design maturity before the organisation has sufficient operational history for a Type II report. Also used as a preliminary step before a Type II.

**Limitation**: Type I is less valuable than Type II to sophisticated enterprise customers because it does not demonstrate that controls work in practice over time. A control can be suitably designed but poorly implemented, inconsistently operated, or recently put in place specifically for the audit.

### SOC 2 Type II

**What it assesses**: Whether the service organisation's controls are **suitably designed AND operating effectively** to meet the Trust Services Criteria **over a specified period**.

**Period**: Typically 6–12 months (annual reports are most common). The first Type II report is often 6 months; subsequent reports are typically 12 months.

**Auditor's opinion**: The controls are (or are not) suitably designed AND were operating effectively throughout the period.

**What it demonstrates**: The organisation had appropriate controls in place AND those controls actually worked consistently throughout the audit period. This is a much stronger assurance than Type I.

**What enterprise customers want**: Almost universally, enterprise customers want Type II reports — specifically annual Type II reports covering the most recent 12 months. A Type I report is frequently insufficient for vendor due diligence purposes.

**The operational evidence requirement**: Type II testing requires the auditor to sample evidence from throughout the audit period — not just at the end. For a 12-month Type II, the auditor might sample:
- Access reviews conducted quarterly — samples from each quarter
- Background checks for new hires — samples from throughout the year
- Security training completion — evidence from throughout the year
- Vulnerability scans — evidence from throughout the year
- Incident response records — all incidents during the period

This sampling approach means that controls that were implemented immediately before the audit period ended are not reflected in a Type II report — they will appear in the next period.

---

## The SOC 2 Audit Process

### Phase 1: Scoping and System Description

The service organisation prepares a **System Description** — a narrative document describing:
- The services provided
- The principal service commitments and system requirements
- The system components (infrastructure, software, people, data, procedures)
- The boundaries of the system (what is in scope)
- How the system addresses the Trust Services Criteria
- Complementary User Entity Controls (CUECs) — controls that users of the service must implement to achieve the stated criteria

**CUECs** are an important concept: SOC 2 reports for many services include controls that the service organisation cannot implement — because they depend on how the customer configures the service. For example, a SaaS platform may provide MFA capability, but whether MFA is enforced for the customer's users depends on the customer's configuration. The CUEC notes that the customer must enable MFA to achieve the security criteria. Customers reviewing SOC 2 reports should carefully review CUECs to understand what their own responsibilities are.

### Phase 2: Readiness Assessment

Before the formal audit begins, many organisations conduct a **readiness assessment** — either internally or with a third-party advisor. The readiness assessment:
- Identifies gaps between current controls and the Trust Services Criteria
- Provides time to address gaps before the formal audit period begins
- Reduces the risk of significant findings in the formal report

**The readiness vs formal audit distinction**: The readiness assessment is not the SOC 2 audit — it does not produce a SOC 2 report. It is preparation. The formal audit begins when the audit period starts.

### Phase 3: Formal Audit — Evidence Collection

During the audit period (for Type II) or at the audit date (for Type I), the auditor collects evidence:

**Inquiry**: Interviews with management and personnel responsible for controls.

**Observation**: Observing controls in operation (physical security walkthrough, observing security monitoring operations).

**Inspection**: Reviewing documentation — policies, procedures, configurations, records.

**Re-performance**: The auditor independently re-executes a control to verify it operates as described (e.g. re-running an access review to verify its completeness).

**Sampling**: For Type II, the auditor tests a sample of control instances throughout the period.

### Phase 4: Report Production

The auditor produces the SOC 2 report, which contains:

**Management's description of the system**: The system description prepared by management.

**Management's assertion**: A written representation by management that the system description is fairly presented and controls are suitably designed (Type I) or operating effectively (Type II).

**Auditor's report**: The auditor's independent opinion on whether management's assertion is fairly stated.

**Description of tests and results** (Type II only): For each control tested, the test performed and the result — including any exceptions found.

**Exceptions**: Where a control did not operate as described during the period (a sample showed the control failed), this is documented as an exception. Exceptions are normal in Type II reports; the key question is whether they are material and whether management has addressed them.

### Evaluating a SOC 2 Report

When evaluating a vendor's SOC 2 report, sophisticated customers should assess:

**Report period**: Is the report current? A SOC 2 report from 18 months ago provides limited assurance about current controls.

**Scope**: Which TSC categories are included? A report covering only Security (without Availability or Confidentiality) may not cover the controls most relevant to the customer's risk.

**Exceptions**: What exceptions were noted? Were they isolated or systemic? Did management address them?

**CUECs**: What user entity controls (customer responsibilities) are required? Has the customer implemented them?

**Subservice organisations**: What third-party providers does the service organisation use? Are those providers covered in the report or excluded (carve-out method)?

**Auditor quality**: Is the auditor a reputable CPA firm with SOC 2 expertise?

---

## SOC 2 and ISO 27001: The Relationship

SOC 2 and ISO 27001 are the two most common security assurance frameworks for technology companies — and they are frequently confused or compared. Understanding their relationship enables organisations to choose the right framework and, where both are needed, to implement them efficiently.

| Dimension | SOC 2 | ISO 27001 |
|---|---|---|
| **Origin** | AICPA (US accounting standard) | ISO/IEC (international standard) |
| **Primary market** | US technology companies and their customers | Global — particularly EU, UK, Asia-Pacific |
| **Output** | Audit report (Type I or Type II) | Certificate (3-year validity) |
| **Certification** | No — attestation report by auditor | Yes — certificate issued by certification body |
| **Control framework** | Trust Services Criteria (5 categories) | ISO 27001 Annex A (93 controls, risk-based) |
| **Risk-based approach** | Limited — criteria are defined; implementation is auditor-assessed | Core — risk assessment drives control selection |
| **Audit frequency** | Annual (Type II) | Annual surveillance + 3-year recertification |
| **Auditor type** | Licensed CPA firm | Accredited certification body (CB) |
| **Customer-facing use** | Primary use — sharing with enterprise customers as vendor assurance | Secondary — shared with customers as security evidence |
| **EU/UK market recognition** | Growing but less established than ISO 27001 | Dominant — widely required by EU/UK enterprise |

**When SOC 2 alone is sufficient**: US market primarily, where customers are familiar with SOC 2 and understand its structure. US enterprise customers routinely accept SOC 2 Type II as vendor security evidence.

**When ISO 27001 alone is sufficient**: UK and EU markets, where ISO 27001 is the primary recognised security certification. UK and EU enterprise customers typically request ISO 27001 certification rather than SOC 2 reports.

**When both are needed**: Global technology companies selling to both US and EU/UK enterprise markets. Many UK SaaS companies with US customers find themselves needing both — ISO 27001 for EU/UK clients and SOC 2 for US clients.

**Integrated implementation**: The controls required by SOC 2 (particularly the Security TSC) and ISO 27001 Annex A overlap extensively. An integrated programme — single risk assessment, single control set, single policy framework, single audit programme — can produce evidence for both SOC 2 and ISO 27001 assessments without duplicating effort.

---

## SOC 1 and SOC 3: Context

**SOC 1**: Report on controls relevant to user entities' financial reporting. Used by service organisations whose services affect their customers' financial statements — payroll processors, fund administrators, loan servicers. SOC 1 is an assurance report for financial auditors, not a security report.

**SOC 3**: A general use report based on the same Trust Services Criteria as SOC 2, but with much less detail — no description of tests and results, no exceptions. SOC 3 reports can be published publicly (on the service organisation's website). SOC 3 is used for marketing and general assurance; SOC 2 is used for detailed vendor due diligence.

**ISAE 3402**: The international equivalent of SOC 1 — an assurance standard for service organisations developed by the International Auditing and Assurance Standards Board (IAASB). Used in the UK and internationally where SOC 1 is not appropriate.

---

## Common Mistakes and Failures

**1. Treating SOC 2 as equivalent to ISO 27001.**
They are different in approach, governance, and market recognition. A SOC 2 Type II report does not satisfy an ISO 27001 requirement and vice versa. Know which framework your market requires.

**2. Sharing a Type I report as vendor security evidence.**
Enterprise customers typically require Type II reports. Sharing a Type I report as evidence of operational security effectiveness is misleading — Type I only demonstrates design adequacy at a point in time.

**3. Not reviewing CUECs.**
Customers that accept a vendor's SOC 2 report without reviewing the Complementary User Entity Controls may be relying on assurance that depends on controls the customer has not implemented.

**4. Not addressing exceptions.**
A SOC 2 Type II report with multiple exceptions in critical controls is a red flag. Customers should ask vendors directly: what caused the exceptions? What has been done to address them? Will they recur?

**5. Using an annual Type II report that is 18 months old.**
SOC 2 reports become stale. An annual report covers a 12-month period. If a vendor's most recent SOC 2 covers the period ending December 2024 and it is April 2026, there is a gap of 16 months with no assurance. Enterprise procurement programmes should track vendor SOC 2 renewal dates.

**6. Not including relevant TSC categories.**
A SaaS company that processes personal information and provides a Security-only SOC 2 report may be omitting the Privacy and Confidentiality criteria most relevant to its customers' risk concerns. Scope the report to cover all criteria relevant to the service provided.

---

## Exam Angle

**CISM:**
- Domain 3 (Security Programme) — SOC 2 is relevant to vendor risk management (requiring SOC 2 from vendors) and to security programme assurance (obtaining SOC 2 as a service provider).

**CRISC:**
- Domain 3 (Risk Response) — SOC 2 reports are a key tool for managing third-party risk. Understanding how to evaluate a SOC 2 report — what exceptions mean, what CUECs require, how to identify gaps — is essential for CRISC risk management.

**CISSP:**
- Domain 1 (Security and Risk Management) — Know what SOC 2 is, the difference between Type I and II, the five Trust Services Criteria, and the relationship to ISO 27001.

**ISO 27001 Lead Auditor:**
- Understanding SOC 2 enables auditors to assist organisations in demonstrating how their ISO 27001 ISMS relates to SOC 2 requirements and to advise on integrated programme management.

---

## GUARDIAN's Take

SOC 2 has become the de facto security assurance currency for the US technology industry — and increasingly for the global SaaS market. Understanding it is no longer optional for GRC professionals working with technology companies.

The most practically important distinction: the difference between a SOC 2 Type II report and security questionnaire responses. A Type II report represents an independent auditor's opinion — based on evidence collected over a 12-month period — that controls were operating effectively. A security questionnaire is self-reported and uncorroborated. For enterprise vendor risk management, these are fundamentally different levels of assurance. Organisations that have disciplined vendor risk management programmes require SOC 2 Type II for significant vendors rather than relying on questionnaires.

For UK technology companies: if you are selling to US enterprise customers, you will be asked for a SOC 2 report. If you already have ISO 27001, you have built most of the control infrastructure SOC 2 requires — the Security TSC and ISO 27001 Annex A overlap extensively. The incremental investment to also produce a SOC 2 report is significant but manageable for an ISO 27001-certified organisation.

And for any GRC professional evaluating vendors: when you receive a SOC 2 Type II report, read it. Specifically: read the exceptions section, read the CUECs, check the period, check the scope. A clean SOC 2 Type II with broad scope (Security + Availability + Confidentiality + Privacy) covering the most recent 12 months, from a reputable auditor, with no material exceptions, and with CUECs that your organisation has implemented — that is meaningful assurance. Anything less deserves careful scrutiny.

---
*Module: Module 7 — Governance Frameworks | Guardian Curriculum*
