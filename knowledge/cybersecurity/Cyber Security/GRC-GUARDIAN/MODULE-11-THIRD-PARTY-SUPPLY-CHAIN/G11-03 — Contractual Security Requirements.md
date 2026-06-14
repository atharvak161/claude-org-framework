---
tags: [guardian, grc, module-11, contracts, security-clauses, dpa, supplier-agreements, gdpr-article-28]
module: 11
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-25
guardian-refs: ["G11-01 — Third-Party Risk Management Framework", "G11-02 — Due Diligence and Supplier Security Assessment", "G5-04 — Data Controller vs Data Processor", "G4-01 — A.5.20 Supplier Agreements", "G6-02 — PCI DSS Req 12.9"]
---

# G11-03 — Contractual Security Requirements

> [!abstract] What This Note Covers
> By the end of this note, you will understand what security requirements must appear in supplier contracts, how to structure security clauses for different tiers and relationship types, what the GDPR Article 28 DPA must contain, what PCI DSS and DORA require in contracts with third parties, and how to negotiate and enforce contractual security obligations.

---

## Why This Exists

Assessment identifies risks. Contracts allocate obligations. A supplier assessed as having inadequate controls is still engaged — the risk is accepted — but contractual obligations define what the supplier must do to address gaps and what consequences follow if they fail. A supplier with excellent controls but no contractual obligation to maintain them is free to change their security posture after contract signature.

The contract is also the organisation's primary legal instrument for managing supplier failure. When a supplier breach causes harm, the contract determines: what was the supplier obligated to do? Did they meet that obligation? What remedies are available?

This note covers the full spectrum of contractual security requirements — from the GDPR-mandatory DPA through to sector-specific requirements under PCI DSS and DORA.

---

## The Security Clause Minimum Set

Every supplier contract where the supplier has access to the organisation's data or systems should include, at minimum, the following security provisions. Scale and specificity up with tier criticality.

### 1. Confidentiality and Data Protection

**Non-disclosure obligations**: The supplier must keep all organisational information confidential — not just personally identifiable information, but all information received in the course of the relationship. This obligation should survive contract termination for a defined period (typically 3–5 years; perpetually for trade secrets).

**Data protection compliance**: The supplier must comply with applicable data protection law (UK GDPR, EU GDPR as applicable) in connection with any personal data processed under the contract.

**Purpose limitation**: The supplier may only use the organisation's data for the specific purposes of the contract — not for the supplier's own analytics, model training, product development, or marketing.

**Example clause:**
> "The Supplier shall maintain the confidentiality of all Confidential Information received from the Customer in connection with this Agreement. The Supplier shall not use such information for any purpose other than performance of its obligations under this Agreement, and shall not disclose it to any third party without the Customer's prior written consent."

### 2. Security Controls — Standards and Obligations

**Compliance with security policy**: The supplier must comply with the organisation's information security policy (by reference — attach or provide a URL) to the extent it applies to the supplier's activities.

**Minimum security standard**: The supplier must maintain information security measures that are at least as protective as required by applicable law and that meet the organisation's minimum requirements.

**Specific control requirements** (for Critical tier): Enumerate specific required controls:
- Encryption at rest and in transit (standards specified)
- Access controls (least privilege; MFA for access to customer data)
- Patch management (SLA for critical patches)
- Vulnerability management (regular scanning; defined remediation timelines)
- Security awareness training for staff with access to customer data
- Background checks for staff with access to customer data

**Example clause (Critical tier):**
> "The Supplier shall implement and maintain technical and organisational security measures including, without limitation: (a) encryption of Customer Data at rest using AES-256 or equivalent; (b) encryption of Customer Data in transit using TLS 1.2 or higher; (c) multi-factor authentication for all access to systems processing Customer Data; (d) application of critical security patches within 14 days of availability; and (e) quarterly access reviews for accounts with access to Customer Data."

### 3. Security Incident Notification

**Notification obligation**: The supplier must notify the organisation of any actual or suspected security incident that affects (or may affect) the organisation's data or systems.

**Timeline**: Critical tier: within 24 hours of discovery or reasonable belief of a breach. High tier: within 48 hours. Standard tier: within 72 hours (aligning with GDPR Article 33's 72-hour notification window, since late processor notification reduces the controller's ability to meet this deadline).

**Content of notification**: The notification must include:
- Nature and scope of the incident
- Categories and approximate volume of data affected
- Likely consequences of the incident
- Measures taken or proposed to address the incident
- Contact details for follow-up

**Cooperation obligation**: The supplier must cooperate fully with the organisation's incident investigation and response — providing access to logs, systems, and personnel as required.

**Example clause:**
> "In the event of an actual or reasonably suspected security incident affecting Customer Data or Customer Systems, Supplier shall: (a) notify Customer without undue delay and in any event within 24 hours of becoming aware; (b) provide Customer with sufficient information to enable Customer to assess the incident and comply with its own obligations to regulators and data subjects; and (c) take all reasonable steps to contain and mitigate the incident at Supplier's cost."

### 4. Subcontractors and Sub-processors

**Approval requirement**: The supplier must not sub-contract the services to a third party without the organisation's prior written consent (specific approval) OR must provide a list of approved sub-contractors and notify of additions (general authorisation with notification).

**Flow-down obligations**: The supplier must ensure that any approved sub-contractors are bound by equivalent security and confidentiality obligations.

**Liability**: The supplier remains liable for the acts and omissions of its sub-contractors as if they were the supplier's own.

**Example clause:**
> "Supplier shall not sub-contract any of its obligations under this Agreement without Customer's prior written consent. Where sub-contracting is permitted, Supplier shall: (a) ensure that sub-contractors are bound by security and confidentiality obligations at least as protective as those in this Agreement; and (b) remain responsible for the acts and omissions of any sub-contractor as though they were the acts and omissions of Supplier."

### 5. Audit Rights

**Right to audit**: The organisation reserves the right to audit, inspect, or assess the supplier's security controls — either directly by the organisation or through an independent third party appointed by the organisation.

**Audit frequency**: Typically once per year for Critical tier; every two years for High tier; on-demand following a security incident or material change.

**Audit cooperation**: The supplier must cooperate fully with audits — providing access to facilities, systems, documentation, and personnel.

**Audit costs**: Who bears the audit cost? Common arrangements: costs borne by the auditing party for routine assessments; costs borne by the supplier where an audit is triggered by a supplier-caused incident or material security concern.

**Example clause:**
> "Customer (or its authorised representatives) may, upon reasonable notice of not less than 10 business days, audit Supplier's compliance with its security obligations under this Agreement not more than once per calendar year. Supplier shall provide reasonable access to its facilities, systems, documentation, and personnel to facilitate such audit. Where an audit is triggered by a confirmed or reasonably suspected security incident caused by Supplier, Supplier shall bear the reasonable costs of the audit."

### 6. Data Return and Deletion on Termination

**Data return**: On termination or expiry of the contract, the supplier must return all organisational data in a format usable by the organisation, within a defined period (typically 30–60 days).

**Data deletion**: Following return (or where return is not requested), the supplier must securely delete all copies of organisational data — including backups and copies held by sub-processors.

**Certificate of deletion**: The supplier must provide a certificate or written confirmation that deletion has been completed.

**Example clause:**
> "Upon termination or expiry of this Agreement for any reason, Supplier shall: (a) within 30 days, return to Customer all Customer Data in a commonly used, machine-readable format; and (b) within 60 days, securely destroy or permanently erase all remaining copies of Customer Data in Supplier's possession (including sub-processor data), and provide Customer with written certification of such deletion."

### 7. Business Continuity

**BCP requirement**: The supplier must maintain a business continuity plan covering the services it provides and must exercise that plan at defined intervals.

**RTOs/RPOs**: For Critical tier, specify the Recovery Time Objective and Recovery Point Objective the supplier must meet.

**Notification**: The supplier must notify the organisation immediately if the services are disrupted and must provide regular updates during any disruption.

---

## The GDPR Data Processing Agreement (DPA)

For any supplier processing personal data on the organisation's behalf (as a processor under GDPR), a **Data Processing Agreement is legally mandatory** under GDPR Article 28. This is not optional; it is not replaceable by other contractual provisions; and processing without a DPA in place is a GDPR violation.

### Mandatory DPA Content (Article 28(3))

The DPA must stipulate that the processor:

**(a) Processes data only on documented instructions from the controller**, including instructions about international transfers.

Practical clause:
> "Processor shall process Customer Personal Data only on the documented instructions of Customer, unless required to do so by applicable law. In such a case, Processor shall inform Customer of that legal requirement before processing, unless that law prohibits such information on important grounds of public interest."

**(b) Ensures that authorised persons are bound by confidentiality obligations.**

Practical clause:
> "Processor shall ensure that persons authorised to process the Customer Personal Data have committed themselves to confidentiality or are under an appropriate statutory obligation of confidentiality."

**(c) Implements appropriate technical and organisational measures (Article 32).**

Practical clause:
> "Taking into account the state of the art, the costs of implementation and the nature, scope, context and purposes of processing as well as the risk of varying likelihood and severity for the rights and freedoms of natural persons, Processor shall implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk..."

**(d) Respects conditions for engaging sub-processors.**

The DPA must specify either:
- Specific authorisation (each sub-processor named and approved), OR
- General authorisation (any sub-processor, subject to notification to the controller and opportunity to object)

Practical clause (general authorisation):
> "Customer grants Processor a general authorisation to engage sub-processors. Processor shall maintain an up-to-date list of sub-processors and shall notify Customer of any intended additions or replacements, giving Customer at least 30 days to object."

**(e) Assists the controller with data subject rights obligations.**

Processor must support the controller in fulfilling data subject rights (access, erasure, rectification, portability, objection, etc.) — by providing relevant personal data, enabling data subject access to their data in the processor's systems, and acting promptly on controller instructions.

**(f) Assists with security, breach notification, DPIA, and prior consultation.**

The processor must support the controller in meeting its security obligations (Article 32), breach notification obligations (Articles 33–34), DPIA obligations (Article 35), and prior consultation obligations (Article 36).

**(g) At controller's choice, deletes or returns data at the end of services.**

**(h) Makes available all information necessary to demonstrate compliance and allows for audits.**

The processor must provide information demonstrating compliance and must cooperate with audits commissioned by the controller.

### Standard Contractual Clauses (SCCs) as DPA

The European Commission publishes Standard Contractual Clauses (SCCs) that can be used as the DPA for controller-processor relationships. Many suppliers (particularly major cloud providers) provide DPAs based on these SCCs. For UK→third country transfers, the IDTA (International Data Transfer Agreement) and UK DPA clauses apply.

**GDPR Module 2 SCCs** (Controller → Processor): Cover all the Article 28(3) requirements and include data transfer mechanisms for international transfers in one document. Widely used for EU-based controllers engaging non-EU processors.

---

## PCI DSS Contractual Requirements

For suppliers who provide services that affect the Cardholder Data Environment (CDE), PCI DSS Requirement 12.8 and 12.9 impose specific contractual obligations:

**Requirement 12.8.2**: Written agreements with all TPSPs that include an acknowledgment that TPSPs are responsible for the security of cardholder data they possess or otherwise store, process, or transmit on the entity's behalf, or to the extent that they could impact the security of the entity's cardholder data environment.

**Requirement 12.8.3**: Due diligence of TPSPs before engagement and at least annually.

**Requirement 12.8.4**: Program to monitor TPSPs' PCI DSS compliance status at least annually.

**Requirement 12.8.5**: Information maintained about which PCI DSS requirements are managed by each TPSP and which are managed by the entity.

**Requirement 12.9.1**: TPSPs must provide written agreements acknowledging their responsibility for the security of cardholder data.

**PCI DSS contract clause template:**
> "Service Provider acknowledges and agrees that: (a) it is responsible for maintaining the security of cardholder data in its possession or under its control; (b) it will maintain full compliance with all applicable PCI DSS requirements for the services it provides to Customer; and (c) it will provide Customer, upon request and no less than annually, with evidence of its current PCI DSS compliance status."

---

## DORA Contractual Requirements

For EU financial entities engaging ICT service providers, **DORA Articles 28–30** impose mandatory contractual requirements. Key DORA contract provisions:

**Performance and availability**: SLAs for performance and availability; response times for incidents.

**Security requirements**: Specific security measures, encryption standards, access controls.

**Incident notification**: Notification requirements for ICT incidents affecting the financial entity.

**Exit and portability**: Contractual provisions enabling the financial entity to exit the relationship and migrate data/services to an alternative provider. This must be exercisable — not just in theory.

**Audit and access rights**: Right to inspect the ICT provider's systems and documentation.

**Sub-outsourcing transparency**: All material sub-outsourcing must be disclosed; the financial entity must have visibility into the sub-outsourcing chain.

**Data location**: Where data is stored and processed; controls on data location changes.

**Business continuity**: ICT provider's business continuity and DR obligations.

**Specific DORA additions** (compared to standard security clauses):
- Exit strategy: Not just data return/deletion — a practical exit plan including how the financial entity can migrate operations to an alternative provider
- Concentration risk disclosure: Whether the ICT provider is providing equivalent services to other financial entities (concentration risk exposure)
- Regulatory cooperation: ICT provider must cooperate with the financial entity's national competent authority (ESA supervisors)

---

## Negotiating Security Clauses

Security requirements in supplier contracts are frequently subject to negotiation — particularly with large suppliers who have standard terms that they resist modifying. Practical approaches:

### Leverage Points

**Pre-contract leverage**: Security requirements are most negotiable before the contract is signed. Post-signature, the supplier has less incentive to agree to additional obligations. Raise security requirements at the procurement stage, not after.

**Competitive tension**: Where there are competing suppliers, security requirements can be part of the selection criteria. A supplier that refuses reasonable security obligations can be disadvantaged in the selection.

**Regulatory requirement framing**: "This clause is required by GDPR Article 28" (for DPA clauses) or "This clause is required by PCI DSS Requirement 12.8" is more persuasive than "we'd like this for security reasons." Regulatory mandates are harder for suppliers to refuse.

**Risk-calibrated requirements**: Starting with requirements calibrated to the actual risk of the relationship (not maximum conceivable requirements) makes negotiation more productive. A Critical tier requirement applied to a Standard tier supplier invites pushback; requirements proportionate to the tier are more defensible.

### When Suppliers Resist

**Standard terms objection**: "Our standard DPA covers this." → Review their standard DPA against GDPR Article 28 requirements. Many supplier standard DPAs omit specific required elements. If their standard DPA is compliant, accept it; if not, specify what must be added.

**Legal review objection**: "Our legal team needs to review this." → Provide maximum 30-day review windows in the procurement timeline. Unlimited legal review delays are a commercial tactics to reduce security obligations.

**"We're ISO 27001 certified, we don't need these specific clauses"**: ISO 27001 certification is evidence of a management system; it does not substitute for contractual obligations. The DPA is a legal requirement regardless of certification status.

**"We're too large to customise contracts"**: Major cloud providers and SaaS vendors have relatively non-negotiable terms. In these cases: review their standard terms carefully; ensure the DPA meets GDPR requirements; use their published acceptable use policies and SLAs as the baseline; accept the remaining risk as residual (documented) or escalate.

### When to Walk Away

Some security requirements are non-negotiable regardless of supplier resistance:
- GDPR DPA (legally mandatory — processing without one is illegal)
- PCI DSS TPSP acknowledgment (compliance obligation)
- Breach notification provision (required to meet GDPR Article 33 timeline)
- Data deletion on termination (required for GDPR storage limitation)

Where a supplier refuses these requirements, the organisation must either: not engage the supplier; escalate to board level for acceptance of the associated regulatory risk; or structure the relationship so these requirements do not apply (e.g. ensure the supplier cannot access personal data, removing the DPA requirement).

---

## Contract Lifecycle Management

Security clauses must be maintained throughout the contract lifecycle — not just at signature.

**Contract review triggers:**
- Supplier's security posture changes significantly (breach; new certification; loss of certification)
- Regulatory requirements change (new GDPR guidance; new PCI DSS version)
- The relationship scope changes (supplier gains access to additional systems or data)
- Contract renewal (use renewal as an opportunity to update security terms to current standards)

**Contract register**: Maintain a register of all supplier contracts with security clauses, including: contract reference; supplier; expiry/renewal date; security clause summary; last security review date; DPA status.

**Renewals as leverage**: Contract renewals are a primary opportunity to strengthen security terms. When a contract comes up for renewal, use the due diligence assessment findings and any incident history as the basis for requiring enhanced security obligations.

---

## Common Mistakes and Failures

**1. No DPA with processors.**
The most common GDPR TPRM failure. Many organisations have dozens of processors with no DPA. The discovery of this gap typically requires a significant programme of work to remediate — executing DPAs with every processor, which takes months.

**2. Security clauses in SoW, not the master agreement.**
Security obligations are included in a statement of work or service schedule that can be varied without the same governance as the master agreement. Security requirements must be in the master agreement or otherwise made unilateral to vary.

**3. Right to audit that is never exercised.**
The contract includes a right to audit. The organisation has never exercised it. The supplier knows this. The audit right provides no deterrent and no assurance.

**4. Generic confidentiality clause substituting for security requirements.**
"The supplier will keep all information confidential" is a confidentiality obligation, not a security obligation. It does not require the supplier to encrypt data, control access, apply patches, or notify of breaches. Specific security requirements must be explicitly stated.

**5. Notification timeline not specified.**
"The supplier must notify us of security incidents promptly." What is "promptly"? 24 hours? 72 hours? Without a specific timeline, the obligation is unenforceable. And without a timeline shorter than 72 hours for processors handling personal data, the organisation cannot reliably meet its own GDPR Article 33 notification window.

**6. Exit provisions that are impractical.**
"The supplier must return all data on termination." But the data is in a proprietary format that cannot be read without the supplier's software. Or the return timeline is 180 days (too long for operational continuity). Effective exit provisions specify format, timeline, and verification.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- A.5.20 requires documented agreements with suppliers that include security requirements. Auditors request a sample of supplier contracts and verify: security clauses are present; DPA is in place where personal data is processed; notification obligations are specified with timelines; audit rights are included.
- Common finding: standard confidentiality clauses with no specific security requirements; DPA absent for processors; notification timelines absent or vague.

**CISM:**
- Domain 3 (Security Programme) — contractual security requirements are a key programme control. CISMs must understand what obligations must appear in contracts and how to negotiate and enforce them.

**CRISC:**
- Domain 3 (Risk Response) — contracts are a risk treatment mechanism that transfers, allocates, and mitigates supplier risk. Inadequate contracts create unmanaged residual risk.

**CISSP:**
- Domain 1 (Security and Risk Management) — legal requirements and contractual obligations in supplier relationships are examinable. Know GDPR Article 28 DPA requirements and the key elements of security supplier contracts.

---

## GUARDIAN's Take

The DPA is the document that GRC professionals most frequently discover is missing when they first engage seriously with an organisation's TPRM programme. Dozens of processors; no DPAs. Technically a GDPR violation for every processor relationship. Remediating this takes months — not because the DPAs are complicated, but because identifying all the processors, reaching their legal teams, and executing the agreements is a substantial operational undertaking.

The solution is prevention, not remediation: build the DPA requirement into the procurement gate. No personal data flows to a new supplier until a DPA is in place. This takes the DPA from a retrospective remediation exercise to a standard part of the procurement process — the same as a signed master agreement or completed due diligence.

The same principle applies to all security clauses: build them into procurement, not bolted on afterwards. A contract executed without security requirements is a contract where the organisation has no enforceable recourse when the supplier fails. A contract with specific, detailed, enforceable security requirements — notification timelines, audit rights, exit obligations — is a contract where the organisation has both deterrence (supplier knows the obligations) and remedies (supplier failed to meet them).

Contracts are the last line of legal defence in a supplier relationship. Make them count.

---
*Module: Module 11 — Third Party and Supply Chain | Guardian Curriculum*
