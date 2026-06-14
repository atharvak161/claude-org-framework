---
tags: [guardian, grc, module-5, gdpr, iso27001, overlap, article-32, isms, privacy]
module: 5
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G3-01 — What is ISO 27001", "G3-05 — ISO 27001 Clause 6 — Planning", "G3-10 — Annex A Controls", "G5-02 — GDPR Structure Principles Lawful Basis", "G5-05 — DPIA", "G5-10 — UK GDPR vs EU GDPR"]
---

# G5-09 — GDPR and ISO 27001 — How They Overlap

> [!abstract] What This Note Covers
> By the end of this note, you will understand precisely how GDPR and ISO 27001 relate to each other — where they overlap, where they diverge, how ISO 27001 certification provides evidence of GDPR Article 32 compliance, and how to build an integrated privacy and security programme that satisfies both frameworks without duplicating effort.

---

## Why This Exists

The most common misunderstanding about GDPR and ISO 27001: organisations assume that achieving ISO 27001 certification means they are GDPR compliant. This is wrong. Equally common: organisations implement separate, disconnected GDPR and ISO 27001 programmes — duplicating risk assessments, policies, and controls across two independent streams. This is inefficient and produces inconsistencies.

The truth is more nuanced and more useful: ISO 27001 and GDPR are complementary frameworks with significant overlap in some areas and completely distinct requirements in others. Understanding exactly where they converge and where they diverge is the foundation for building a single, integrated privacy and security programme that satisfies both efficiently.

---

## The Fundamental Difference

**ISO 27001** is an information security management framework. Its primary concern is the **CIA triad** — protecting the confidentiality, integrity, and availability of **the organisation's information assets**. The risk subject is the organisation.

**GDPR** is a data protection regulation. Its primary concern is protecting the **rights and freedoms of individuals** whose personal data is processed. The risk subject is the data subject — the individual person.

These are different perspectives. An information security breach (a DDOS attack causing system unavailability) may be critical for the organisation but irrelevant to GDPR if no personal data is affected. A GDPR breach (misdirected email containing one person's personal data) may be significant for GDPR but trivial from an information security perspective.

This difference in perspective means the two frameworks, despite overlapping significantly in practice, can never be fully substituted for each other.

---

## Where ISO 27001 and GDPR Overlap

### 1. Security of Processing — Article 32 and ISO 27001

The most direct overlap is between GDPR Article 32 and ISO 27001 Annex A Category 8 (Technological Controls) and Category 7 (Physical Controls).

**Article 32** requires controllers and processors to implement "appropriate technical and organisational measures" to ensure security appropriate to the risk, including (where appropriate):
- Pseudonymisation and encryption of personal data
- Ability to ensure ongoing confidentiality, integrity, availability, and resilience of processing systems
- Ability to restore availability and access in timely manner following an incident
- Process for regularly testing, assessing, and evaluating effectiveness of security measures

This maps almost directly to what ISO 27001 requires — a risk-based information security management system implementing appropriate technical and organisational controls.

**ISO 27001 certification as GDPR Article 32 evidence**: The ICO's guidance and multiple supervisory authority positions confirm that ISO 27001 certification is strong evidence of compliance with GDPR Article 32. It demonstrates that the organisation has:
- Conducted a systematic risk assessment
- Selected and implemented appropriate controls
- Maintained and improved those controls
- Had the programme independently verified

However — and this is critical — ISO 27001 certification is not sufficient for Article 32 compliance on its own. Article 32 requires that security is "appropriate to the risk" — specifically the risk to data subjects from processing personal data. ISO 27001's risk assessment focuses on information security risks to the organisation. These overlap significantly but are not identical.

**What the ICO actually looks for**: An ICO investigation following a breach will assess:
- Were appropriate security measures in place?
- Were they proportionate to the sensitivity and volume of personal data?
- Were they tested and maintained?
- Were data subject-specific risks considered?

ISO 27001 certification helps answer all of these questions positively — but the organisation must also be able to show that personal data-specific risks were considered, not just generic information security risks.

### 2. Risk Assessment Alignment

Both frameworks require systematic risk assessment, but with different scopes:

| Dimension | ISO 27001 Risk Assessment (Clause 6.1.2) | GDPR Risk Assessment (DPIA — Article 35) |
|---|---|---|
| **Risk subject** | Organisation's information assets | Data subjects (individuals) |
| **When conducted** | Annually and when significant changes occur | Before high-risk processing activities |
| **Scope** | All information assets within ISMS scope | Specific processing activity |
| **Focus** | CIA (confidentiality, integrity, availability) | Risks to rights and freedoms of individuals |
| **Output** | Risk register, treatment plan, SoA | DPIA record with mitigations |
| **Mandatory for** | All ISO 27001-certified organisations | Controllers with high-risk processing |

**The integration opportunity**: The risk assessment for a new system or process should simultaneously assess: (a) information security risks (for ISO 27001) and (b) privacy risks to data subjects (for GDPR DPIA). A combined Privacy and Security Impact Assessment — conducting both assessments together for new projects — eliminates duplication and ensures the two perspectives inform each other.

Practically: when assessing a new healthcare data platform, the IS risk assessment identifies risks to the confidentiality of health records (severity: High for the organisation). The DPIA identifies the same risk from a different perspective: risk of health data breach causing discrimination or harm to data subjects (severity: High for individuals). Both assessments point to the same controls — encryption, access control, monitoring — which are then implemented once and documented in both the ISMS SoA and the DPIA record.

### 3. Incident Management and Breach Notification

ISO 27001 requires an incident management process (A.5.24–A.5.28). GDPR requires breach notification (Articles 33–34). These are not the same process, but they must be coordinated:

| Step | ISO 27001 (Incident Management) | GDPR (Breach Notification) |
|---|---|---|
| Detection | Identify security incident | Determine if personal data is affected |
| Assessment | Classify incident severity (P1/P2/P3) | Assess risk to data subjects |
| Response | Contain, eradicate, recover | Determine notification requirement (ICO within 72 hours?) |
| Communication | Internal notification per incident response plan | Data subject notification if high risk |
| Documentation | Incident log and post-incident review | Breach register (mandatory even if not notified) |
| Improvement | Lessons learned into ISMS improvement | Mitigations implemented to prevent recurrence |

The incident response plan must incorporate both dimensions. An incident that causes a GDPR-notifiable breach triggers both the ISMS incident response process (technical response) and the GDPR breach notification process (regulatory notification). Both run in parallel, with the DPO coordinating the GDPR dimension and the CISO/IT team leading the technical dimension.

**The 72-hour challenge**: The GDPR breach notification clock (72 hours from awareness to ICO notification) creates time pressure that the ISMS incident response process must accommodate. The process for quickly determining whether an incident involves personal data and assessing the risk to data subjects must be built into the incident response plan — not discovered for the first time mid-incident.

### 4. Supplier Management

ISO 27001 requires supplier security management (A.5.19–A.5.22). GDPR requires Data Processing Agreements with processors (Article 28). Both apply when engaging third parties who handle the organisation's data.

**The integration**: A single supplier assessment process that evaluates:
- Information security posture (ISO 27001 requirement — does the supplier have appropriate controls?)
- GDPR compliance posture (GDPR requirement — can the supplier satisfy DPA requirements? Do they have ISO 27001 themselves?)
- DPA/security clause inclusion in contracts (satisfies both A.5.20 and GDPR Article 28)

For processors: the DPA required by GDPR (Article 28) should also incorporate the security requirements of A.5.20 and A.5.22. A well-drafted DPA satisfies both requirements simultaneously.

### 5. Accountability and Documentation

**GDPR's accountability principle** (Article 5(1)(f)) requires controllers to document their compliance — RoPA, DPIAs, DPO appointment, privacy notices, consent records, breach records.

**ISO 27001's documented information requirements** (Clause 7.5) require documented policies, procedures, risk assessments, SoA, and operational records.

Both frameworks value comprehensive, current documentation as evidence of a functioning programme. The same documentation discipline — version control, approval processes, review cycles — serves both.

---

## Where ISO 27001 and GDPR Diverge

### 1. Lawfulness of Processing

ISO 27001 has no concept of the lawfulness of processing. It does not require organisations to identify a legal basis for processing data, ensure purpose limitation, or manage consent. An ISMS could be perfectly designed to protect personal data while the processing itself is entirely unlawful (wrong lawful basis, wrong purpose, wrong retention).

GDPR's Chapters II and III (principles, lawful bases, data subject rights) have no ISO 27001 equivalent. These must be addressed separately through GDPR-specific governance.

### 2. Data Subject Rights

ISO 27001 does not address the rights of data subjects to access, correct, erase, or restrict their personal data. Building the operational capability to respond to SARs, erasure requests, and objections is a GDPR-specific compliance requirement with no ISO 27001 parallel.

The closest ISO 27001 touch point: A.8.10 (Information deletion, new in 2022) addresses secure deletion — which is relevant to erasure requests. But ISO 27001 does not require a process for receiving and responding to data subject rights requests.

### 3. Privacy Notices and Transparency

GDPR Articles 13–14 require specific information to be provided to data subjects at the time of collection. ISO 27001 has no equivalent — it does not require the organisation to inform data subjects about how their data is used.

### 4. Data Protection Impact Assessments

DPIAs (Article 35) are a GDPR-specific requirement focused on risks to data subjects. ISO 27001 requires risk assessments focused on information security risks to the organisation. While similar in methodology and partly overlapping in scope (a new system creates both kinds of risk), the DPIA has specific legal requirements (DPO consultation, prior consultation with ICO) that have no ISO 27001 equivalent.

### 5. DPO Appointment

The mandatory appointment of a DPO for certain categories of organisation (Article 37) has no equivalent in ISO 27001. The standard requires defined roles and responsibilities (Clause 5.3) but does not specify the DPO role.

### 6. International Transfer Regime

ISO 27001 addresses transfer of information through security controls (A.5.14 — information transfer) but has no concept of adequacy decisions, SCCs, BCRs, or IDTA. The entire GDPR Chapter V international transfer regime is entirely absent from ISO 27001.

### 7. Children's Data and Special Category Data

GDPR imposes enhanced obligations on processing children's data and special category data. ISO 27001 has no equivalent — it does not distinguish categories of personal data for enhanced protection requirements.

---

## Building an Integrated Privacy and Security Programme

Given the overlaps and divergences, the most efficient approach is an integrated programme that uses a common infrastructure for both frameworks, with GDPR-specific additions layered on top.

### Shared Infrastructure

**Risk assessment**: Single risk methodology, single risk register. ISO 27001 risks focus on CIA threats to information assets. GDPR privacy risks (from DPIAs) are incorporated as additional risk entries targeting data subjects. Both use the same likelihood/impact scales and risk appetite framework.

**Policy framework**: A single policy hierarchy. The Information Security Policy (ISO 27001) incorporates a data protection/privacy commitment. Topic-specific policies include both security and privacy requirements where relevant (e.g. data retention policy addresses both storage limitation principle (GDPR) and backup security (ISO 27001)).

**Incident management**: Single incident response process, extended to cover GDPR breach notification decision tree. The incident log doubles as the starting point for the breach register.

**Supplier management**: Single supplier assessment process, extended to include DPA execution and processor compliance requirements. Supplier risk classification covers both information security risk and GDPR risk (does the supplier process personal data? is a DPA required?).

**Internal audit**: Single audit programme covering both ISO 27001 requirements and GDPR compliance. The audit findings feed into a single corrective action register.

**Management review**: Single management review agenda covering both ISMS performance (ISO 27001 Clause 9.3 inputs) and GDPR compliance status. The board receives a unified picture of privacy and security posture.

### GDPR-Specific Additions

Layered onto the shared infrastructure, GDPR requires specific elements that ISO 27001 does not:

- **Records of Processing Activities (RoPA)**: Maintained by the DPO or privacy team. Updated when processing activities change. Reviewed at least annually.
- **Privacy notices**: Maintained for all processing activities. Reviewed when processing changes.
- **DPIA process**: Built into project governance. Screening assessment for all new projects. Full DPIA where required.
- **Data subject rights process**: Defined response process with tracked deadlines. Integrated with customer service and IT systems.
- **DPO function**: Independent advisory role. Involved in all GDPR-relevant decisions. Consulted on DPIAs.
- **Breach register**: Separate from the incident log but linked. Documents all personal data breaches and the notification decisions.
- **Consent management**: Where consent is the lawful basis, a system for recording, managing, and honouring withdrawals.
- **International transfer documentation**: TIAs, executed SCCs/IDTA, adequacy decision monitoring.

---

## A Practical Mapping: ISO 27001 Controls and GDPR Requirements

The following table shows the most significant alignments between ISO 27001 Annex A controls and GDPR requirements:

| ISO 27001 Control | GDPR Requirement | How they align |
|---|---|---|
| A.5.1 (Policies) | Accountability principle (Art. 5(2)) | Privacy policy addresses processing principles; IS policy demonstrates governance |
| A.5.9 (Asset inventory) | RoPA (Art. 30) | Asset register identifies systems processing personal data; RoPA documents the processing |
| A.5.12 (Classification) | Special category data (Art. 9) | Data classification scheme identifies personal data, special category data, and required protections |
| A.5.19–A.5.22 (Supplier security) | Article 28 (DPA requirement) | Supplier assessment includes DPA; security clauses address both ISMS and GDPR requirements |
| A.5.23 (Cloud services) | Art. 28 + International transfers | Cloud DPA + SCC/IDTA + TIA for cloud providers in third countries |
| A.5.24–A.5.28 (Incident management) | Art. 33–34 (Breach notification) | Incident response plan extended to include breach notification decision |
| A.5.34 (Privacy and PII) | Data protection principles (Art. 5) | Explicitly addresses GDPR compliance within the ISMS |
| A.6.3 (Awareness training) | Accountability (Art. 5(2)) | Training covers both security and GDPR obligations |
| A.8.5 (Secure authentication) | Art. 32 (Security measures) | MFA protects personal data against unauthorised access |
| A.8.8 (Vulnerability management) | Art. 32 (Security measures) | Patching reduces exploitation risk for systems processing personal data |
| A.8.10 (Information deletion) | Storage limitation (Art. 5(1)(e)) | Secure deletion implements GDPR retention/deletion requirements |
| A.8.11 (Data masking) | Data minimisation (Art. 5(1)(c)) | Pseudonymisation/masking reduces personal data exposure |
| A.8.12 (DLP) | Art. 32 (Security measures) | DLP prevents unauthorised disclosure of personal data |
| A.8.13 (Backup) | Art. 32 (Resilience/availability) | Backup enables recovery of personal data after incident |
| A.8.15 (Logging) | Accountability (Art. 5(2)) | Audit logs demonstrate lawful processing; support breach investigation |
| A.8.24 (Cryptography) | Art. 32 (Encryption) | Encryption of personal data at rest and in transit |

---

## Common Mistakes and Failures

**1. Treating ISO 27001 certification as GDPR compliance.**
"We're ISO 27001 certified, so we're GDPR compliant." This is wrong. ISO 27001 provides strong evidence for Article 32 compliance but does not address lawful basis, data subject rights, transparency, DPO appointment, or international transfers. Both frameworks must be addressed.

**2. Running parallel, disconnected programmes.**
A GDPR compliance team and an ISO 27001 ISMS team that never communicate. Separate risk assessments (with different methodologies, scales, and registers). Separate policy sets. Separate supplier assessment processes. Duplicated effort, inconsistent outcomes, and gaps at the boundaries.

**3. Ignoring GDPR in the ISMS risk assessment.**
The ISMS risk assessment identifies risks to the organisation's information assets. It does not consider what happens to data subjects when a breach occurs. A GDPR-aware ISMS risk assessment adds data subject impact dimensions to each risk — recognising that the same breach can be both an information security incident and a GDPR event.

**4. DPIA not connected to the ISMS.**
DPIAs are conducted as standalone exercises by the privacy team. The security controls recommended in the DPIA are not added to the SoA or the risk treatment plan. The security team implements controls without knowing the DPIA's privacy risk rationale. Privacy and security design are disconnected.

**5. The ISMS incident response plan doesn't mention GDPR.**
A security incident involving personal data triggers the ISMS incident response plan — which has no provision for the GDPR breach notification assessment. The DPO learns about the incident three days later. The 72-hour notification window has passed.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Auditors must understand the relationship between ISO 27001 and GDPR — both the overlaps (security controls, incident management, supplier management) and the divergences (lawful basis, data subject rights, DPO, international transfers).
- A finding that the organisation's incident response plan does not include GDPR breach notification assessment is typically an observation or minor NC in the context of A.5.24/A.5.26.
- A.5.34 (Privacy and protection of PII) explicitly requires the ISMS to address privacy obligations. Auditors will look for evidence that GDPR obligations are incorporated into the ISMS, not just that ISO 27001 controls are implemented independently of GDPR.

**CISM:**
- Domain 1 (Governance) and Domain 3 (Security Programme) both require understanding of how privacy law (particularly GDPR) integrates with information security governance and programme management.

**CISSP:**
- Domain 1 (Security and Risk Management) covers both frameworks. The CISSP candidate is expected to understand how privacy and security requirements interact and overlap.

---

## GUARDIAN's Take

The relationship between GDPR and ISO 27001 is one of the most practically important areas for any GRC professional working in the UK or EU context — and it is consistently misunderstood in both directions.

The underestimation: "We're ISO 27001 certified, we've done the security bit, GDPR is just a privacy thing." ISO 27001 certification demonstrates that security is being managed systematically — but it says nothing about whether the data is being processed lawfully, whether data subjects have been informed, whether rights can be exercised, or whether international transfers are compliant.

The overcomplication: Running two entirely separate programmes with two teams, two risk registers, two policy sets, and two supplier assessment processes. This creates enormous duplication of effort and — paradoxically — more gaps at the boundaries between the two programmes.

The right approach is integration with differentiation. Build a single risk management framework. Build a single supplier assessment process. Build a single incident response plan. Build a single internal audit programme. Then layer GDPR-specific elements — the RoPA, the privacy notices, the DPIA process, the data subject rights process, the DPO function — on top of the shared infrastructure.

This is not a shortcut. Both frameworks must be genuinely satisfied. But the shared infrastructure means the work done for one framework benefits the other. The risk assessment that identifies a high risk of health data breach is simultaneously an ISO 27001 risk register entry and a DPIA risk finding. The DPA executed with a cloud provider simultaneously satisfies A.5.20 and GDPR Article 28. The incident response plan that includes a GDPR breach notification decision tree satisfies both A.5.24 and Article 33.

Build integrated programmes. They are more efficient, more coherent, and — perhaps most importantly — they reflect the reality that privacy and security are not separate domains. They are two dimensions of the same fundamental obligation: to handle information about people with the care, competence, and accountability that people deserve.

---
*Module: Module 5 — Data Protection / GDPR | Guardian Curriculum*
