---
tags: [guardian, grc, module-13, cissp, domain-2, asset-security, data-classification, privacy]
module: 13
cert-coverage: [cissp]
difficulty: intermediate
date: 2026-04-28
guardian-refs: ["G13-01 — CISSP Overview", "G13-02 — Domain 1", "G4-01 — A.5.12 Information Classification", "G5-02 — GDPR Principles", "G9-01 — Policy Hierarchy"]
---

# G13-03 — CISSP Domain 2: Asset Security

> [!abstract] What This Note Covers
> Domain 2 accounts for 10% of the CISSP exam. It covers the identification, classification, handling, and protection of information assets throughout their lifecycle. This note provides Domain 2 coverage with CISSP exam application, building on the data classification and GDPR foundations from earlier modules.

---

## What Domain 2 Tests

Domain 2 tests your understanding of how organisations manage information as an asset — from classification through retention, handling, and secure disposal. Questions assess whether you can:

- Classify information appropriately by sensitivity and handling requirements
- Apply appropriate handling requirements to each classification level
- Manage data throughout its lifecycle (collection → processing → storage → disposal)
- Apply privacy principles to personal data handling
- Understand data ownership, custodianship, and stewardship roles

**GUARDIAN curriculum foundation**: G4-01 (ISO 27001 Annex A.5.12 — classification), Module 5 (GDPR — data principles, data subject rights, lawful basis), and G9-03 (data classification standard) provide the core Domain 2 foundation.

---

## 2.1 Data Classification

### Classification Schemes

**Government classification (US):**
| Level | Description |
|---|---|
| Top Secret | Damage to national security would be exceptionally grave |
| Secret | Damage to national security would be serious |
| Confidential | Damage to national security would be expected |
| Sensitive but Unclassified (SBU) | Sensitive but not formally classified |
| Unclassified | No sensitivity |

**Commercial classification (common scheme):**
| Level | Description |
|---|---|
| Confidential / Restricted | Highest sensitivity; limited distribution; significant harm if disclosed |
| Internal / Private | Internal use; not for public disclosure; moderate harm if disclosed |
| Public | Approved for public release; no harm from disclosure |

**UK Government Security Classification:**
| Level | Description |
|---|---|
| TOP SECRET | Exceptionally grave damage to national security |
| SECRET | Serious damage to national security |
| OFFICIAL | Majority of government information; routine business |
| OFFICIAL-SENSITIVE | OFFICIAL requiring special handling attention |

**CISSP exam principle**: Classification schemes vary by organisation and jurisdiction. The key principle is that classification must reflect: sensitivity (potential impact if disclosed); handling requirements (who may access it; how it must be stored and transmitted); and retention requirements (how long it must be kept; how it must be disposed of).

### Classification Criteria

Information is classified based on its **value** to the organisation and the **impact of unauthorised disclosure**:

- **Confidentiality**: How harmful would disclosure be?
- **Integrity**: How harmful would modification be?
- **Availability**: How harmful would unavailability be?

Higher sensitivity → more protective handling requirements → higher cost of protection.

### Classification Responsibilities

**Data owner**: The executive or senior manager responsible for the information asset — makes classification decisions and approves handling requirements. Accountable for the data.

**Data custodian**: The IT or operations team responsible for implementing and maintaining the technical controls protecting the data. Responsible for backup, access control implementation, and security controls.

**Data user**: The individual who accesses and uses the information in their work. Responsible for following handling procedures.

**Data steward**: In some organisations, a business role that manages data quality, ensures classification is current, and enforces handling procedures.

**CISSP exam pattern**: "Who is responsible for determining the classification level of data?" → **Data owner** (the business executive accountable for the data). "Who implements the backup controls for classified data?" → **Data custodian** (the IT/operations team).

---

## 2.2 Data Handling Requirements

Different classification levels require different handling controls. The classification scheme must define handling requirements for each level:

**Storage controls**: Encryption at rest for confidential data; access controls limiting who can read the file; physical security for physical media.

**Transmission controls**: Encryption in transit; approved transmission channels; prohibition on sending to personal email or consumer cloud storage.

**Access controls**: Need-to-know principle; authentication requirements; access review frequency.

**Reproduction controls**: Who may copy the data; whether copies must be tracked; watermarking for sensitive documents.

**Disposal controls**: How data must be destroyed at end of life (data destruction standards — covered in 2.4 below).

**Labelling**: How must classified data be marked — document headers/footers; email subject line indicators; file naming conventions.

---

## 2.3 Data Lifecycle Management

**Data has a lifecycle** — from creation through active use to archiving and eventual disposal. Security must be applied consistently throughout:

**Collection/Creation**: Data is created or collected. Classification is assigned at or near creation. Consent or lawful basis established (for personal data under GDPR).

**Storage**: Data is stored in classified systems with appropriate access controls and encryption. Backup copies maintained with equivalent controls.

**Processing**: Data is used, analysed, or transformed. Access limited to authorised users. Processing purposes limited (purpose limitation principle — GDPR relevance).

**Sharing**: Data is shared internally or externally. Sharing agreements (DPAs for processors); need-to-know principle enforced; transmission encryption applied.

**Archiving**: Data no longer actively used but must be retained (regulatory requirements; litigation holds). Access restricted; encryption maintained; retrieval capability preserved.

**Disposal**: Data reaches the end of its retention period and must be destroyed. Secure disposal methods applied (see 2.4).

**CISSP exam principle**: The data lifecycle concept is important because security and privacy obligations persist through all phases. Data that reaches end-of-life must be disposed of securely — not simply deleted (deletion does not necessarily remove data).

---

## 2.4 Data Disposal and Destruction

**The destruction problem**: Simply deleting a file does not remove it — it removes the reference to the file in the file system's table, but the data remains on the storage medium until overwritten. Recovery tools can retrieve "deleted" data.

**Disposal methods (from least to most secure):**

**Clearing (overwriting)**: Writing random data over existing data; sufficient for reuse within the same organisation. Not sufficient for disposal when the media will leave organisational control.

**Purging**: More thorough overwriting (multiple passes); degaussing (magnetic fields destroy data on magnetic media). Appropriate for media being repurposed or donated.

**Destruction**: Physical destruction of the storage medium — shredding, incineration, disintegration. The only approach that provides certainty for media leaving organisational control. Required for classified media disposal.

**Specific methods:**

*Degaussing*: Exposing magnetic media (hard drives; tapes) to a strong magnetic field that randomises the magnetic properties, destroying stored data. Not effective for solid-state drives (SSDs) — these are not magnetic.

*Overwriting*: Writing patterns over existing data. NIST SP 800-88 specifies overwriting methods. A single overwrite pass is sufficient for modern drives (ATA Secure Erase); older guidance required multiple passes (DoD 5220.22-M).

*Physical shredding*: Industrial-grade shredders that reduce drives to small fragments. Effective for all media types.

*Incineration*: Burning; appropriate for highly classified media. Requires certified disposal facilities.

**CISSP exam pattern**: "What is the MOST secure method for disposing of a hard drive containing Top Secret data?" → Physical destruction (shredding or incineration). "What method should be used to clear a hard drive before donating it to a charity?" → Degaussing or purging (overwriting).

**Certificates of destruction**: When third-party disposal services are used, organisations should obtain certificates of destruction confirming the method and completeness of data destruction.

---

## 2.5 Privacy Principles

Privacy is embedded in Domain 2 as a data protection requirement alongside security. CISSP tests privacy from a framework and principles perspective:

### GDPR Privacy Principles (from Module 5)

- Lawful basis for processing
- Purpose limitation (data used only for specified purposes)
- Data minimisation (collect only what is necessary)
- Accuracy (data kept accurate and current)
- Storage limitation (not kept longer than necessary)
- Integrity and confidentiality (appropriate security)
- Accountability (demonstrate compliance)

### Privacy by Design (PbD) — Ann Cavoukian

**Seven foundational principles:**

1. **Proactive not reactive** — build privacy in from the start; don't react to problems
2. **Privacy as the default** — systems should require action to reduce privacy; not action to enable it
3. **Privacy embedded into design** — privacy is not an add-on; it is integral to system design
4. **Full functionality — positive-sum** — privacy and security are not zero-sum; both can be achieved
5. **End-to-end security** — security throughout the lifecycle; not just at specific points
6. **Visibility and transparency** — openly communicate what is done with data
7. **Respect for user privacy** — keep it user-centric; protect individual privacy

**CISSP exam application**: Privacy by Design principles are tested as the framework for incorporating privacy into system and application design. "Which principle requires that privacy is considered from the beginning of design, not added later?" → Proactive not reactive / Privacy embedded into design.

### Generally Accepted Privacy Principles (GAPP)

AICPA/CICA framework — 10 principles for privacy management. Less tested than GDPR or Privacy by Design, but candidates should be aware:

1. Management (governance of privacy)
2. Notice (inform data subjects)
3. Choice and consent
4. Collection (collect only what is needed)
5. Use, retention, and disposal
6. Access
7. Disclosure to third parties
8. Security
9. Quality (accuracy)
10. Monitoring and enforcement

---

## 2.6 Asset Valuation

**Why asset valuation matters**: Risk assessment requires understanding asset value — both to prioritise protection and to justify the cost of controls (ALE calculations from Domain 1 require asset value).

**Methods for valuing information assets:**

*Cost of replacement*: What would it cost to recreate the information if lost? (Research data that took years to develop; customer databases; proprietary algorithms)

*Cost of harm from disclosure*: What is the financial impact of unauthorised disclosure? (Competitive intelligence; personal data breach regulatory exposure; IP theft)

*Regulatory value*: What are the regulatory consequences of losing this data? (GDPR fines for personal data breach; PCI DSS fines for cardholder data loss)

*Opportunity cost*: What business opportunities are enabled by this information? (Customer database enabling marketing; market research enabling product development)

**CISSP principle**: Asset valuation is the foundation of risk-based security decision-making. Protecting a £10M database with £1M of security investment is justified. Protecting a £50K marketing brochure database with £1M of security investment is not.

---

## 2.7 Information Security Roles in Data Governance

**Chief Privacy Officer (CPO)**: Executive responsible for the organisation's privacy programme — ensuring compliance with privacy laws; overseeing privacy by design implementation; managing data subject rights requests.

**Data Protection Officer (DPO)**: GDPR-mandated role for certain organisations (public bodies; organisations processing personal data at scale). Independent advisory role — advises the organisation on GDPR compliance; monitors compliance; acts as contact for the supervisory authority.

**Records Manager**: Manages the organisation's records retention programme — defining retention schedules; ensuring records are retained as required and disposed of appropriately.

---

## Domain 2 CISSP Practice Questions

**Q6.** Who is responsible for determining the classification level of an information asset?

A) The data custodian (IT operations team)
B) The security manager
C) The data owner (business executive accountable for the data)
D) The data user (individual who accesses the data)

**Answer: C** — Classification is a business decision made by the data owner — the executive accountable for the information asset. The custodian implements the controls; the security manager provides guidance; the user follows procedures. Classification requires understanding business value and impact of disclosure — a business judgment, not a technical one.

---

**Q7.** An organisation is decommissioning servers that contained customer financial data (classified as Confidential). The servers will be sold to a third party. What is the MOST appropriate disposal method?

A) Format the drives using standard operating system deletion
B) Overwrite each drive with random data (single pass)
C) Degauss the drives and verify with a read-back test
D) Physically shred or destroy the drives before releasing the servers

**Answer: D** — For Confidential data on media leaving organisational control (sold to third party), physical destruction provides the highest assurance. Standard deletion (A) is easily recoverable. Single-pass overwriting (B) may be sufficient per NIST SP 800-88 but physical destruction provides certainty. Degaussing (C) is effective for magnetic HDDs but not for SSDs; and verification may not be possible for all drive types.

---

**Q8.** Which Privacy by Design principle requires that privacy protection be considered at the beginning of a project, not as an afterthought?

A) Privacy as the default
B) Privacy embedded into design
C) Proactive not reactive
D) End-to-end security

**Answer: C** — "Proactive not reactive" specifically addresses the principle of anticipating and preventing privacy problems before they occur — building privacy in from the start rather than responding to violations after the fact. "Privacy embedded into design" (B) addresses integration into system design. "Privacy as the default" (A) addresses the default settings orientation.

---

**Q9.** A company's Human Resources department stores sensitive employee records. Who has primary accountability for the security of this information?

A) The IT security team, as the implementors of security controls
B) The CISO, as the senior security executive
C) The HR Director, as the business owner of the HR function
D) The DPO, as the data protection specialist

**Answer: C** — The HR Director is the data owner — the business executive accountable for the information asset. They determine classification, approve handling requirements, and bear accountability for the data. The IT security team (A) is the custodian — implementing controls specified by the owner. The CISO (B) governs the security programme. The DPO (D) advises on privacy compliance but is not accountable for the data.

---

## Domain 2 Key Exam Summary

| Topic | Key exam point |
|---|---|
| Data owner | Business executive; determines classification; accountable |
| Data custodian | IT team; implements controls; responsible |
| Data classification | Based on sensitivity and impact of disclosure/modification/unavailability |
| Clearing | Overwriting; sufficient for same-org reuse |
| Purging | Degaussing/overwriting; for media leaving organisation |
| Destruction | Physical; for media with highly sensitive data leaving org |
| Privacy by Design | 7 principles; proactive; embedded; privacy as default |
| Data lifecycle | Security throughout all phases: collection → disposal |

---

## GUARDIAN's Take

Domain 2 is the data governance domain — and it maps directly onto the data classification standards, GDPR data principles, and data handling requirements covered in this curriculum. For GRC-background candidates, Domain 2 should be one of the higher-performing domains.

The specific CISSP angles to lock in: the data owner/custodian distinction (a very common exam question); the disposal method hierarchy (clearing → purging → destruction); and Privacy by Design (seven principles, particularly "proactive not reactive" and "privacy as the default").

Domain 2 is relatively straightforward once the classification and lifecycle framework is understood. Practice questions will quickly reveal whether the concepts are solid.

---
*Module: Module 13 — CISSP GRC Domains | Guardian Curriculum*
