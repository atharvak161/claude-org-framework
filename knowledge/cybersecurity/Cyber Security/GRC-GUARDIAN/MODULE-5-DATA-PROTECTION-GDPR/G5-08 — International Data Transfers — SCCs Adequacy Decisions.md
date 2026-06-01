---
tags: [guardian, grc, module-5, gdpr, international-transfers, sccs, adequacy, standard-contractual-clauses, data-transfers]
module: 5
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G5-02 — GDPR Structure Principles Lawful Basis", "G5-04 — Data Controller vs Data Processor", "G5-09 — GDPR and ISO 27001", "G5-10 — UK GDPR vs EU GDPR"]
---

# G5-08 — International Data Transfers — SCCs, Adequacy Decisions

> [!abstract] What This Note Covers
> By the end of this note, you will understand GDPR's regime for international transfers of personal data — why it exists, what transfer mechanisms are available, how Standard Contractual Clauses work, what adequacy decisions mean, and how the post-Schrems II landscape shapes practical compliance today.

---

## Why This Exists

In October 2015, the Court of Justice of the European Union (CJEU) invalidated the EU-US Safe Harbor framework in the *Schrems v Data Protection Commissioner* case (Schrems I). Safe Harbor had allowed EU-US data transfers for 15 years based on US companies' self-certification of data protection adequacy. The CJEU found that US surveillance laws rendered Safe Harbor protection inadequate — EU personal data sent to the US was accessible to US intelligence agencies without the protections required by EU law.

In July 2020, the CJEU delivered Schrems II — invalidating the successor Privacy Shield framework on the same grounds. This left thousands of organisations with no legal basis for their EU-US data transfers, in a state of legal uncertainty that persists to varying degrees today.

The Schrems cases illustrate the fundamental tension at the heart of international transfer law: the EU's view that personal data processed within the EU is protected by GDPR, and the reality that when that data leaves the EU, it enters legal environments that may not provide equivalent protection. The international transfer regime is GDPR's mechanism for maintaining protection for EU personal data regardless of where it travels.

---

## Why International Transfers Are Restricted

The general principle: personal data that has been collected and processed in accordance with GDPR should not be stripped of its protections simply by being sent to a country with weaker data protection laws.

If there were no restrictions on international transfers, the protections of GDPR could be circumvented by simply routing processing through a country with lax data protection — collecting data in France, immediately sending it to a data-haven jurisdiction, and processing it there without any GDPR-equivalent obligation.

GDPR Chapter V (Articles 44–49) establishes the international transfer regime: transfers of personal data to third countries (countries outside the EU/EEA) are only permitted where appropriate safeguards are in place, or where a specific derogation applies.

---

## What Counts as an International Transfer?

A **transfer** occurs when personal data is sent from a controller or processor in the EU/EEA to a recipient in a third country. This includes:
- Emailing data to an entity in the US
- Uploading data to a cloud service with servers in the US
- Accessing EU data remotely from outside the EEA (including by an employee working abroad)
- Disclosing EU personal data to a US parent company
- Sharing EU customer data with a US-based analytics partner

**The "transit" question**: Data merely routed through a third country (e.g. internet packets passing through a US server en route to another EU server) without access or storage is generally not considered a transfer for GDPR purposes. However, this must be assessed on the facts.

---

## The Transfer Hierarchy: Mechanisms in Order of Preference

### Mechanism 1: Adequacy Decisions (Article 45)

The European Commission (EU GDPR) or the UK Government (UK GDPR) may determine that a third country provides an "adequate level of protection" for personal data — equivalent to the EU/UK standard. Where an adequacy decision is in place, data can flow freely to the adequacy country without additional safeguards.

**EU adequacy decisions (as of 2024):** Andorra, Argentina, Canada (commercial organisations), Faroe Islands, Guernsey, Israel, Isle of Man, Japan, Jersey, New Zealand, Republic of Korea, Switzerland, UK (for EU→UK transfers), Uruguay.

**Partial adequacy — the EU-US Data Privacy Framework (DPF)**: Following Schrems II, the EU and US negotiated a new framework — the **EU-US Data Privacy Framework** — adopted by adequacy decision in July 2023. US companies that self-certify under the DPF can receive EU personal data. The DPF includes enhanced safeguards for EU citizens' data, including an independent redress mechanism (the Data Protection Review Court). However, the framework faces legal challenge from Schrems and others — future invalidation is possible.

**UK adequacy decisions**: Following Brexit, the EU granted the UK an adequacy decision (effective June 2021), allowing EU→UK transfers without additional safeguards. This decision expires in June 2025 and must be renewed. The UK has its own adequacy framework for UK→third country transfers, having adopted most EU adequacy decisions and adding new ones (including the UK-US Data Bridge for UK→US transfers).

**The adequacy risk**: Adequacy decisions can be invalidated (Schrems I and II demonstrated this with Safe Harbor and Privacy Shield). Organisations should not rely solely on adequacy without contingency planning — maintaining SCCs as a backup mechanism is prudent where adequacy decisions may be at risk.

### Mechanism 2: Standard Contractual Clauses (Article 46(2)(c)) — The Primary Practical Mechanism

**Standard Contractual Clauses (SCCs)** are contractual terms approved by the European Commission (EU GDPR) or UK ICO (UK GDPR) as providing adequate safeguards for international transfers. By including approved SCCs in contracts with recipients in third countries, the controller or processor ensures a level of protection for the transferred data.

**EU SCCs — the 2021 Modular Version**: In June 2021, the European Commission issued a new set of SCCs replacing the previous 2001/2004 versions. The 2021 SCCs are modular — different modules apply depending on the relationship:

| Module | Transfer scenario |
|---|---|
| **Module 1** | Controller (EU) → Controller (third country) |
| **Module 2** | Controller (EU) → Processor (third country) |
| **Module 3** | Processor (EU) → Processor (third country) (sub-processing) |
| **Module 4** | Processor (EU) → Controller (third country) |

**What SCCs contain:**
- Obligations on the data exporter and importer mirroring GDPR requirements
- Data subject rights provisions (allowing data subjects to enforce the clauses as third-party beneficiaries)
- Cooperation obligations with supervisory authorities
- Security requirements
- Conditions for sub-processing
- Liability allocation between parties
- Termination provisions where the importer cannot comply

**The Transfer Impact Assessment (TIA):** Post-Schrems II, SCCs alone are not necessarily sufficient — the EDPB requires exporters to conduct a **Transfer Impact Assessment** before relying on SCCs:

1. **Map the transfer**: Identify the personal data, the purpose, the recipient, the legal basis, and the destination country
2. **Assess the third country's law**: Is there legislation in the third country that could undermine the SCCs' protections? (e.g. surveillance laws requiring disclosure to intelligence agencies, laws overriding contractual obligations)
3. **Evaluate whether SCCs provide effective protection**: Given the third country's legal environment, do the SCCs actually protect EU personal data in practice?
4. **Implement supplementary measures if needed**: If SCCs alone are insufficient (particularly for US transfers given US surveillance law), supplementary technical, contractual, or organisational measures are required

**Supplementary measures (EDPB guidance):**
- Technical: end-to-end encryption where the exporter holds the keys (US authority cannot access encrypted data it cannot decrypt); pseudonymisation; data minimisation
- Contractual: additional provisions requiring the importer to notify of government access requests; commitments to challenge government access requests
- Organisational: policies on responding to government access requests; internal procedures

**UK IDTA (International Data Transfer Agreement)**: The UK equivalent of SCCs is the **International Data Transfer Agreement (IDTA)**, published by the ICO in 2022. UK→third country transfers must use the IDTA (or the UK Addendum to EU SCCs, where EU SCCs are used in contracts also covering UK transfers).

### Mechanism 3: Binding Corporate Rules (Article 46(2)(b))

**Binding Corporate Rules (BCRs)** are legally binding codes of conduct approved by supervisory authorities for intra-group international transfers within a multinational organisation.

**When BCRs are useful:**
- Large multinational corporations with frequent data flows between group entities
- Provides a comprehensive, once-approved framework for all intra-group transfers
- Eliminates the need for SCCs between every pair of group entities

**BCR approval process:**
- Extensive application to the lead supervisory authority (typically where the company has its EU headquarters)
- The authority circulates the application to other relevant EEA supervisory authorities
- Approval process takes 18–24 months in practice
- The BCRs must be legally binding and enforceable within the group

**BCR types:**
- BCRs for controllers (Article 47): for companies acting as controllers transferring data across group entities
- BCRs for processors (Article 47): for processor groups (e.g. cloud service providers) transferring data processed on behalf of multiple controllers

**Practical limitation**: BCRs take a long time and significant resource to obtain. They are typically only pursued by large multinationals with consistent, high-volume intra-group transfer needs.

### Mechanism 4: Article 49 Derogations (Last Resort)

Where no other mechanism is available, Article 49 provides limited derogations for specific circumstances:

| Derogation | When applicable |
|---|---|
| **Explicit consent** | Data subject has explicitly consented to the transfer, after being informed of the risks |
| **Contract performance** | Transfer necessary for the performance of a contract with the data subject |
| **Public interest** | Transfer necessary for important reasons of public interest |
| **Legal claims** | Transfer necessary for the establishment, exercise, or defence of legal claims |
| **Vital interests** | Transfer necessary to protect vital interests of the data subject or others |
| **Public register** | Transfer from a register that under EU/member state law is open to public consultation |

**The "compelling legitimate interests" exception (Article 49(1))**: In extremely limited circumstances — where no other mechanism is available, the transfer is not repetitive, concerns limited data subjects, is necessary for compelling legitimate interests, and appropriate safeguards are implemented — a transfer may be possible. This exception is very narrow and the ICO emphasises it should not be used as a workaround for transfers that should use SCCs.

**Derogations are not a routine compliance mechanism**: The EDPB is clear that Article 49 derogations are for occasional, specific circumstances. They cannot substitute for a proper transfer mechanism for systematic, repetitive transfers.

---

## The Post-Schrems II Practical Landscape

The 2020 Schrems II judgment created significant operational complexity. The key challenge: for transfers to the US and other countries with extensive surveillance powers, SCCs alone may not provide adequate protection. The TIA requirement adds a layer of analysis to every transfer.

### Practical Implications for Common Transfers

**EU→US transfers via major cloud providers (AWS, Microsoft Azure, Google Cloud)**:
- All three provide SCCs as part of their DPA
- All three have submitted Transfer Impact Assessments (TIAs) that purport to demonstrate their ability to challenge government access requests
- The EU-US Data Privacy Framework provides an adequacy basis for transfers to DPF-certified companies (AWS, Microsoft, Google are all certified)
- Prudent organisations maintain SCCs as a backup mechanism given the risk of future DPF invalidation

**EU→UK transfers:**
- Covered by the EU's adequacy decision for the UK (renewable June 2025)
- UK→EU transfers: the UK has adopted the EU's adequacy framework; EU→UK is covered as above; no additional mechanism needed currently

**UK→US transfers:**
- Covered by the UK-US Data Bridge (for Data Bridge-certified US companies, including AWS, Microsoft, Google)
- IDTA as backup mechanism

**Intra-group transfers:**
- SCCs (or IDTA for UK transfers) between every pair of entities in different countries, OR
- BCRs (for large multinationals with the resource for the approval process)

---

## Records of International Transfers

Under the accountability principle, controllers must document international transfers. The RoPA (Article 30) must include: transfers to third countries and the transfer mechanism used.

For each international transfer, organisations should maintain:
- The destination country
- The transfer mechanism used (adequacy decision, SCCs, BCRs, IDTA, derogation)
- Where SCCs are used: the signed SCCs and the TIA
- Where adequacy is relied upon: confirmation of the current adequacy status
- Any supplementary measures applied

---

## Common Mistakes and Failures

**1. Assuming cloud services are automatically compliant.**
Using AWS, Azure, or Google Cloud does not automatically make international transfers compliant. The controller must execute a DPA with the cloud provider that includes SCCs (or the IDTA for UK), and must conduct a TIA if relying on SCCs.

**2. Using old/invalidated SCCs.**
The 2001/2004 EU SCCs are no longer valid for new transfers (organisations had until December 2022 to transition to the 2021 SCCs). Using invalidated SCCs provides no transfer protection.

**3. No TIA conducted.**
Relying on SCCs without a Transfer Impact Assessment (for transfers to countries with potentially inadequate protection, particularly the US) does not satisfy post-Schrems II requirements. The EDPB and ICO both require a TIA.

**4. Treating EU SCCs as valid for UK→third country transfers.**
UK GDPR has its own transfer regime. For UK→third country transfers, the IDTA or UK Addendum must be used — EU SCCs alone do not satisfy UK GDPR requirements.

**5. Relying on derogations for routine transfers.**
Article 49 derogations (consent, contract, vital interests) are not appropriate for systematic, repetitive commercial data transfers. Using consent as a transfer mechanism for routine employee data sharing between group entities is not sustainable.

**6. Not monitoring changes in adequacy status.**
Adequacy decisions can be renewed, withdrawn, or invalidated. Organisations relying on adequacy must monitor ICO and European Commission announcements. When an adequacy decision is withdrawn or not renewed, alternative mechanisms must be in place promptly.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- International transfers are covered by A.5.14 (Information transfer) and A.5.20 (Supplier agreements). Where the ISMS scope includes international data flows, auditors may check: are appropriate transfer mechanisms in place? Are SCCs/IDTA executed with processors in third countries?

**CISM:**
- Domain 1 (Governance) includes legal and regulatory compliance. International transfer rules are a key element of GDPR compliance that CISOs must be aware of, particularly as cloud adoption creates automatic international transfer scenarios.

**CISSP:**
- Domain 1 (Security and Risk Management) covers cross-border data transfer requirements. Know the mechanisms (adequacy, SCCs, BCRs) and the key cases (Schrems I, Schrems II) that shape the current landscape.

---

## GUARDIAN's Take

International transfer law is one of the most practically challenging areas of GDPR compliance — and one of the least understood by organisations that haven't specifically focused on it.

The practical reality for most UK and EU organisations: they are constantly transferring personal data internationally. Every cloud service, every SaaS tool, every analytics platform potentially involves an international transfer. The question is not whether transfers occur, but whether they are legally compliant.

The Schrems II aftermath was chaotic because organisations had relied for years on Privacy Shield without conducting the deeper analysis of whether US law provided adequate protection. The CJEU's decision that it did not was not a surprise to lawyers who had followed the area — it was a predictable consequence of the mismatch between EU privacy standards and US surveillance law.

The lesson: international transfer compliance requires genuine legal analysis, not just contractual box-ticking. SCCs are a necessary but not sufficient mechanism for transfers to countries with potentially conflicting surveillance laws. The TIA is the mechanism through which this analysis is conducted and documented.

For most organisations, the practical path is:
1. Map all international transfers (build this into the RoPA)
2. Identify the mechanism for each transfer (adequacy or SCCs/IDTA)
3. For SCCs/IDTA: conduct and document a TIA
4. Implement supplementary measures where needed
5. Monitor changes in adequacy status and legal frameworks

This is not optional or aspirational — it is what GDPR requires. And for organisations that get it wrong, the ICO has demonstrated it will act.

---
*Module: Module 5 — Data Protection / GDPR | Guardian Curriculum*
