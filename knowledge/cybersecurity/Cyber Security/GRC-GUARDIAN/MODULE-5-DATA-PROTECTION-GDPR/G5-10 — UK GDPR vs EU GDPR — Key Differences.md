---
tags: [guardian, grc, module-5, gdpr, uk-gdpr, brexit, dpa-2018, ico, adequacy]
module: 5
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G5-01 — Why Data Protection Law Exists", "G5-02 — GDPR Structure Principles Lawful Basis", "G5-08 — International Data Transfers", "G5-09 — GDPR and ISO 27001"]
---

# G5-10 — UK GDPR vs EU GDPR — Key Differences

> [!abstract] What This Note Covers
> By the end of this note, you will understand how UK GDPR differs from EU GDPR following Brexit, what the Data Protection Act 2018 adds, how the two frameworks interact for UK organisations with EU operations, and what the current state of UK-EU data transfer arrangements is.

---

## Why This Exists

On 31 January 2020, the United Kingdom left the European Union. From an information governance perspective, this created an immediate and complex question: what happens to the data protection framework that had been built on EU law?

The answer, in the short term, was retention. The European Union (Withdrawal) Act 2018 incorporated EU GDPR directly into UK law as "UK GDPR" — a version of GDPR that the UK Parliament could subsequently amend independently of the EU. The Data Protection Act 2018 (DPA 2018), already enacted to implement GDPR in UK law, continued to apply alongside UK GDPR, supplementing it with UK-specific provisions.

The practical result: immediately post-Brexit, UK GDPR and EU GDPR were essentially identical. Over time, divergence has begun — the UK government has indicated its intention to take a more "innovation-friendly" approach to data protection, while the EU has continued to develop GDPR through enforcement decisions, EDPB guidance, and legislative supplements (DORA, NIS2, AI Act).

For GRC professionals, understanding the two frameworks — their alignment and their divergence — is essential for any UK organisation with EU operations, any EU organisation with UK operations, and any professional advising on cross-border data management.

---

## The Legal Architecture Post-Brexit

### UK GDPR

**UK GDPR** is the version of EU GDPR retained in UK law by the European Union (Withdrawal) Act 2018. As of the day after the transition period ended (1 January 2021), it became the primary UK data protection law for most processing activities.

UK GDPR is substantively aligned with EU GDPR — the structure (Chapters, Articles), the principles (Article 5), the lawful bases (Article 6), the data subject rights (Chapter III), and the controller/processor framework (Chapter IV) are all retained. References to "supervisory authority" in EU GDPR translate to the ICO in UK GDPR; references to "Union law" and "Member State law" translate to "UK law."

### The Data Protection Act 2018 (DPA 2018)

The DPA 2018 supplements UK GDPR, providing:
- The legal basis for the ICO's existence, powers, and enforcement
- UK-specific derogations (exemptions and modifications to the general GDPR requirements permitted by Article 23 and equivalent provisions)
- The law enforcement processing regime (Part 3 of DPA 2018 — implementing the Law Enforcement Directive for processing by competent authorities)
- The intelligence services processing regime (Part 4)
- Specific provisions for research, journalism, and other public interest processing
- Criminal offences for unlawful obtaining of personal data

### What Applies to What

For most UK organisations processing personal data of UK residents:
- **UK GDPR + DPA 2018** apply

For UK organisations processing personal data of EU residents:
- **EU GDPR** also applies (extraterritorial scope under Article 3)
- The organisation must comply with both regimes for the relevant processing

For EU organisations processing personal data of UK residents:
- **UK GDPR** applies (extraterritorial scope mirroring EU GDPR Article 3)
- The organisation must designate a UK representative unless it has an establishment in the UK (UK GDPR Article 27 equivalent)

---

## Key Differences: UK GDPR vs EU GDPR

The two frameworks are substantively similar. The key differences fall into five categories:

### 1. Supervisory Authority

**EU GDPR**: Supervised by national supervisory authorities in each EU member state. The "one-stop-shop" mechanism (Article 56) means an organisation with a main establishment in one EU country is primarily regulated by that country's authority (e.g. Irish DPC for Meta, Google, Apple; Luxembourg CNPD for Amazon).

**UK GDPR**: Supervised exclusively by the **ICO (Information Commissioner's Office)**. Post-Brexit, the one-stop-shop mechanism no longer applies in the UK — UK organisations are regulated by the ICO; there is no cross-border consistency mechanism with EU authorities.

**Practical implication for UK organisations with EU operations**: A UK-headquartered organisation that processes EU residents' data must comply with EU GDPR. It may need to appoint a lead supervisory authority in the EU (typically where it has its EU main establishment). It will be subject to both the ICO (for UK operations) and the relevant EU authority (for EU operations) — a dual regulatory relationship.

### 2. International Data Transfers

**EU GDPR**: Transfers from EU to third countries require: adequacy decision (Article 45), or appropriate safeguards (SCCs, BCRs, Article 46 mechanisms), or derogations (Article 49).

**UK GDPR**: Transfers from UK to third countries require: **UK adequacy regulations**, or **IDTA (International Data Transfer Agreement)** or **UK Addendum to EU SCCs**, or BCRs (UK-approved), or derogations.

**The UK has its own adequacy framework**: The UK Secretary of State can grant adequacy status to third countries under UK GDPR. The UK has adopted most of the EU's existing adequacy decisions (Andorra, Argentina, Canada, Faroe Islands, Guernsey, Israel, Isle of Man, Japan, Jersey, New Zealand, Switzerland, Uruguay) plus its own additions.

**UK-US Data Bridge**: The UK entered into a UK-US Data Bridge arrangement (September 2023), allowing transfers to certified US organisations. This is the UK equivalent of the EU-US Data Privacy Framework.

**EU→UK transfers**: The EU granted the UK an adequacy decision in June 2021, valid for four years with renewal review. This allows EU→UK transfers without additional mechanisms. However, this adequacy decision expires in June 2025 and must be reviewed/renewed — uncertainty exists about whether renewal will be straightforward, particularly given the UK government's stated intention to diverge from GDPR in some areas.

**UK→EU transfers**: The UK treats EU/EEA member states as adequate (having adopted this position from the EU framework). EU→UK flows require EU adequacy; UK→EU flows are treated as low-risk by the UK ICO.

### 3. The ICO's Powers and Approach

**EU GDPR enforcement**: Conducted by national supervisory authorities with maximum fines of €20 million or 4% of global annual turnover. Enforcement varies significantly by authority — the Irish DPC has been criticised for slow enforcement of Big Tech; the CNIL and Hamburg DPA have been more aggressive.

**UK GDPR enforcement (ICO)**: Maximum fines of £17.5 million or 4% of global annual turnover — the UK government set the fine cap in GBP terms at the time GDPR was incorporated, roughly equivalent to €20 million at that exchange rate.

**ICO enforcement approach**: The ICO has historically been more pragmatic and less aggressive than some EU counterparts — emphasising guidance, engagement, and improvement over punitive fines in the first instance. However, the ICO has demonstrated willingness to fine substantially (British Airways £20M; Marriott £18.4M, though both reduced from initial proposed fines due to mitigating factors including COVID-19 economic impact).

**The Commissioner**: The UK Information Commissioner is appointed by the Crown on the advice of the Secretary of State. The Commissioner is independent of government but operationally funded by fees paid by registered data controllers. John Edwards has been Information Commissioner since January 2022.

### 4. UK-Specific Derogations in the DPA 2018

GDPR (both EU and UK) permits member states (or in the UK's case, the UK Parliament) to provide derogations and exemptions in certain areas. The DPA 2018 includes several UK-specific provisions:

**Data subject rights exemptions** (Schedule 2):
- **Crime, law enforcement, and taxation**: Processing for crime prevention, detection, and prosecution may be exempt from certain data subject rights (particularly access) where disclosure would prejudice those purposes
- **Legal professional privilege**: Information subject to LPP is exempt from the right of access
- **Management forecasts**: Certain business information (management forecasts, negotiations) may be exempt from access if premature disclosure would prejudice the organisation
- **Research, archiving, and statistics**: Research processing that complies with the DPA 2018's research provisions has some exemptions from data subject rights
- **Journalism and public interest**: Exemptions from certain provisions for processing for journalistic, academic, artistic, or literary purposes in the public interest

**Special category data**: Additional conditions for processing special category data in UK law (Schedule 1 of DPA 2018) including conditions for employment law purposes, preventive or occupational medicine, and equality of opportunity monitoring.

**Children's online privacy**: The DPA 2018 introduces provisions for children's online privacy, including the Age Appropriate Design Code (Children's Code) — a statutory code of practice for online services likely to be accessed by children.

### 5. Potential Future Divergence

The UK government has signalled its intention to take a more "innovation-friendly" approach to data protection post-Brexit. Key developments:

**DPDI Act (Data Protection and Digital Information Act)**: Legislation that was progressing through Parliament in 2023–2024 that proposed reforms to UK GDPR including:
- Simplification of legitimate interests (removing the balancing test requirement in some cases)
- Reform of cookie consent requirements
- Changes to DPIA requirements
- Modifications to automated decision-making provisions
- Changes to PECR (Privacy and Electronic Communications Regulations)

As of mid-2024, the DPDI Act had been dropped following the general election and change of government. The new Labour government indicated it would revisit data protection reform but with a different emphasis. The final position on UK GDPR reform remains uncertain as of this note's date.

**The EU adequacy risk**: The EU Commission's adequacy decision for the UK is subject to the condition that UK law remains "essentially equivalent" to EU GDPR. If the UK significantly diverges from GDPR — either through legislative reform or divergent enforcement practice — the EU may withdraw adequacy, requiring UK organisations to implement SCCs for EU→UK transfers. This risk must be monitored.

---

## The Dual Compliance Challenge for UK Organisations with EU Operations

A UK organisation that:
- Has an EU establishment (office, subsidiary)
- Markets goods or services to EU residents
- Monitors the behaviour of EU residents

...must comply with **both UK GDPR and EU GDPR** for the respective processing activities.

**What this means in practice:**

| Processing | Applicable law | Supervisory authority |
|---|---|---|
| Processing UK residents' data | UK GDPR | ICO |
| Processing EU residents' data | EU GDPR | Relevant EU supervisory authority |
| Processing both | Both UK GDPR and EU GDPR | ICO (UK data) + EU authority (EU data) |

**The practical challenge**: Most operational systems don't distinguish between UK and EU data subjects. A CRM system contains both UK and EU customer records processed through the same pipeline with the same policies. The organisation must ensure the programme satisfies both GDPR versions.

**Where the frameworks diverge**: Where UK GDPR and EU GDPR requirements differ (currently limited but potentially growing), the organisation must satisfy the stricter requirement for shared processing, or maintain separate processes for UK and EU data subjects.

**EU representative**: UK organisations processing EU residents' data without an EU establishment must designate a **representative in the EU** (EU GDPR Article 27). This is a named person or company in the EU who acts as the contact point for EU supervisory authorities and data subjects.

**UK representative**: EU organisations processing UK residents' data without a UK establishment must designate a **representative in the UK** (UK GDPR Article 27 equivalent).

---

## The ICO and EU Supervisory Authorities: Post-Brexit Cooperation

Before Brexit, the ICO was fully integrated into the EU supervisory authority cooperation mechanism — participating in the European Data Protection Board (EDPB), the one-stop-shop mechanism, and the consistency mechanism.

After Brexit, the ICO is no longer part of the EDPB. It has no formal role in EU enforcement decisions. This creates:

**For UK organisations**: No longer benefit from one-stop-shop for EU operations. Must engage with each relevant EU supervisory authority independently for processing in different EU member states.

**For the ICO**: Publishes its own guidance, which may diverge over time from EDPB guidance. The ICO participates in some international cooperation forums but has no formal decision-making role in EU data protection governance.

**ICO-EDPB relationship**: The ICO and EDPB maintain cooperative relationships — sharing information, participating in each other's events, and working together on matters of common interest. But the formal governance relationship that existed when the UK was an EU member no longer exists.

---

## Compliance Framework for Organisations Operating in Both Jurisdictions

For organisations that must comply with both UK GDPR and EU GDPR, the recommended approach:

**1. Common compliance base**: Both frameworks share the same fundamental architecture. A compliance programme built on GDPR principles satisfies both, with only incremental additions for jurisdiction-specific requirements.

**2. Identify the divergences**: Monitor ICO and EDPB guidance for emerging divergences. Where they exist, apply the stricter standard or maintain separate processes.

**3. Dual notification capability**: Where a breach affects both UK and EU residents, separate notifications may be required — to the ICO (within 72 hours, UK GDPR) and to the relevant EU supervisory authority (within 72 hours, EU GDPR). These are separate notifications to separate authorities.

**4. Separate representatives**: If required, appoint both an EU representative (for EU GDPR compliance) and a UK representative (for UK GDPR compliance). These can be the same provider if they operate in both jurisdictions.

**5. Transfer mechanism clarity**: Understand the transfer regime for all directions of data flow: EU→UK (EU adequacy decision), UK→EU (UK recognises EU as adequate), EU→US (EU SCCs or DPF), UK→US (IDTA or Data Bridge).

**6. Monitor adequacy status**: The EU adequacy decision for the UK is not permanent. Monitor ICO and European Commission announcements. Maintain SCCs as a contingency mechanism for EU→UK flows in case adequacy is not renewed.

---

## Common Mistakes and Failures

**1. Assuming UK GDPR and EU GDPR are identical.**
They are substantially similar but not identical. The supervisory authority, enforcement regime, derogations, and transfer mechanisms differ. UK-only compliance programmes may not satisfy EU GDPR requirements.

**2. Not monitoring changes in UK data protection law.**
The UK government has indicated intent to reform UK GDPR. Changes may reduce UK-EU adequacy compatibility. Organisations must monitor legislative developments and assess their impact on compliance programmes.

**3. Ignoring EU GDPR for UK-based organisations with EU customers.**
"We're a UK company, so we just follow UK GDPR." If EU residents' data is processed, EU GDPR applies. This is the same extraterritorial principle as the original GDPR — it applies based on where data subjects are located, not where the organisation is based.

**4. Not appointing an EU representative.**
UK organisations processing EU residents' data without an EU establishment must appoint an EU GDPR Article 27 representative. Many small and medium-sized UK organisations are unaware of this requirement.

**5. Relying on EU adequacy without contingency planning.**
The EU adequacy decision for the UK may not be renewed. Organisations that have no backup mechanism for EU→UK transfers (e.g. SCCs) could face disruption if adequacy lapses.

**6. Using EU SCCs for UK→third country transfers without IDTA.**
EU SCCs satisfy EU GDPR requirements for EU→third country transfers. They do not automatically satisfy UK GDPR requirements for UK→third country transfers. The IDTA (or UK Addendum to EU SCCs) is required for UK transfers.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- For audits of UK organisations processing EU data: the ISMS must address both UK GDPR and EU GDPR requirements where applicable. The auditor should understand that the organisation may face dual compliance obligations.
- For audits of EU organisations with UK operations: UK GDPR creates separate obligations that must be reflected in the ISMS scope.

**CISM:**
- Domain 1 (Governance) includes understanding of the applicable legal and regulatory framework. For UK organisations, this means understanding both UK GDPR and EU GDPR where applicable, and the ongoing risk of regulatory divergence.

**CISSP:**
- Domain 1 (Security and Risk Management) covers privacy law. UK GDPR and its relationship to EU GDPR is directly relevant for CISSP candidates working in the UK or advising UK organisations.

---

## GUARDIAN's Take

Brexit created a genuinely complex data protection landscape — not because the law changed radically on day one, but because it created two parallel legal frameworks that began aligned and may gradually diverge, in an environment where organisations often have operations, customers, and data flows spanning both jurisdictions.

The practical advice for GRC professionals: don't assume the frameworks are interchangeable, but don't create unnecessarily complex parallel compliance programmes. Start from the shared foundation — the GDPR architecture is the same in both frameworks. Build your compliance programme on that shared foundation. Then identify and address the specific divergences: the supervisory authority, the transfer mechanisms, the derogations.

Monitor the UK legislative landscape carefully. The government's stated intention to reform UK GDPR represents both an opportunity (simplified compliance in some areas) and a risk (potential loss of EU adequacy). The regulatory uncertainty is itself a compliance risk that should appear in your risk register and your DPIA screening assessments.

And if you are advising a UK organisation with EU operations, or an EU organisation with UK customers: you are operating in a dual-jurisdiction environment. Both regulators are watching. Both sets of rules apply. Build a programme that satisfies both, and maintain the flexibility to adapt as the two frameworks continue to evolve.

---
*Module: Module 5 — Data Protection / GDPR | Guardian Curriculum*
