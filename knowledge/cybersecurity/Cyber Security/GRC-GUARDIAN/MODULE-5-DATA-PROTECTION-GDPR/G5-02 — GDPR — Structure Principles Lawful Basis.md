---
tags: [guardian, grc, module-5, gdpr, structure, principles, lawful-basis, article-5, article-6]
module: 5
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G5-01 — Why Data Protection Law Exists", "G5-03 — Data Subject Rights", "G5-04 — Data Controller vs Data Processor", "G5-05 — DPIA", "G5-09 — GDPR and ISO 27001"]
---

# G5-02 — GDPR — Structure, Principles, Lawful Basis

> [!abstract] What This Note Covers
> By the end of this note, you will understand the architecture of GDPR — its 99 Articles, its 7 data protection principles, and its 6 lawful bases for processing — and be able to apply these foundations to real-world compliance decisions.

---

## Why This Exists

GDPR is not a single requirement — it is a comprehensive legal framework of 99 Articles and 173 recitals covering everything from the definition of personal data to the powers of supervisory authorities. Understanding how the regulation is structured, which principles govern all processing, and what makes processing lawful is the foundation on which every other GDPR obligation rests.

The 7 principles (Article 5) and the 6 lawful bases (Article 6) are the two most important elements of GDPR for GRC professionals. They appear in virtually every GDPR compliance activity — from DPIAs to breach assessment, from policy development to supplier contracts. Every other GDPR obligation can be traced back to these foundations.

---

## The Structure of GDPR

GDPR contains **99 Articles** organised into 11 Chapters:

| Chapter | Content | Key articles |
|---|---|---|
| I — General Provisions | Scope, definitions | Art. 1–4 |
| II — Principles | Data protection principles; lawful basis | Art. 5–11 |
| III — Rights of the Data Subject | All 8 data subject rights | Art. 12–23 |
| IV — Controller and Processor | Obligations on controllers and processors; DPO; DPIA; codes of conduct | Art. 24–43 |
| V — Transfers to Third Countries | International data transfer rules | Art. 44–49 |
| VI — Independent Supervisory Authorities | Structure and powers of national DPAs | Art. 51–59 |
| VII — Cooperation and Consistency | One-stop-shop mechanism; consistency mechanism | Art. 60–76 |
| VIII — Remedies, Liability and Penalties | Data subject remedies; fines | Art. 77–84 |
| IX — Provisions for Specific Situations | Special processing contexts (journalism, research, employment) | Art. 85–91 |
| X — Delegated and Implementing Acts | Commission powers | Art. 92–93 |
| XI — Final Provisions | Entry into force; repeal of 1995 Directive | Art. 94–99 |

The **Recitals** (173 of them) are not legally binding in themselves but provide interpretive guidance on the Articles. Recitals explain the legislative intent behind specific provisions and are heavily referenced by supervisory authorities and courts when interpreting the regulation.

### Key Definitions (Article 4)

Understanding GDPR requires understanding its definitions precisely. The most important:

**Personal data**: "Any information relating to an identified or identifiable natural person ('data subject'). An identifiable natural person is one who can be identified, directly or indirectly, in particular by reference to an identifier such as a name, an identification number, location data, an online identifier or to one or more factors specific to the physical, physiological, genetic, mental, economic, cultural or social identity of that natural person."

Key implications:
- "Any information" is extraordinarily broad — includes obvious identifiers (name, address) and less obvious ones (IP address, cookie ID, device fingerprint, location history)
- "Indirectly" is critical — pseudonymised data (where re-identification is possible) is still personal data under GDPR
- True anonymisation (where re-identification is not reasonably possible) removes data from GDPR scope — but genuinely anonymised data is rare
- GDPR applies to natural persons only — data about companies is not personal data (though data about sole traders or individuals within companies may be)

**Special category personal data** (Article 9): A subset of personal data warranting heightened protection:
- Racial or ethnic origin
- Political opinions
- Religious or philosophical beliefs
- Trade union membership
- Genetic data
- Biometric data (where processed to uniquely identify a person)
- Health data
- Sex life or sexual orientation

Processing special category data is prohibited by default. Specific conditions (Article 9(2)) must be met — including explicit consent, vital interests, or specific legal permissions. Special category data requires heightened security measures and a DPIA is typically required before processing begins.

**Criminal offence data**: Data about criminal convictions and offences (Article 10). Treated with similar care to special category data — processing requires specific legal authority.

**Processing**: "Any operation or set of operations which is performed on personal data, whether or not by automated means, such as collection, recording, organisation, structuring, storage, adaptation or alteration, retrieval, consultation, use, disclosure by transmission, dissemination or otherwise making available, alignment or combination, restriction, erasure or destruction."

Key implication: "Processing" covers the entire data lifecycle from collection to destruction. If you are doing anything with personal data, you are processing it and GDPR applies.

**Controller**: "The natural or legal person, public authority, agency or other body which, alone or jointly with others, determines the purposes and means of the processing of personal data."

The controller decides *why* and *how* personal data is processed. They bear primary accountability under GDPR.

**Processor**: "A natural or legal person, public authority, agency or other body which processes personal data on behalf of the controller."

The processor acts on the controller's instructions. They have specific obligations under GDPR but less accountability than controllers. (Covered in depth in G5-04.)

---

## The 7 Data Protection Principles (Article 5)

Article 5 states the 7 core principles that govern all processing of personal data. Every GDPR obligation flows from these principles. They are not optional — they apply to every act of processing by every controller.

### Principle 1: Lawfulness, Fairness, and Transparency

**Lawfulness**: Processing must have a legal basis (one of the six in Article 6, or the conditions in Articles 9–10 for special category/criminal data).

**Fairness**: Processing must not be harmful, deceptive, or unjustifiably adverse to data subjects. Fairness requires that processing aligns with reasonable expectations — people should not be surprised by how their data is used.

**Transparency**: Data subjects must be informed about the processing. This is operationalised through the information requirements in Articles 13 and 14 (privacy notices) and Article 12 (how information is communicated — in clear, plain language).

**In practice**: This principle means having a lawful basis, providing a clear privacy notice, and not using data in ways that would surprise or harm the people it belongs to.

### Principle 2: Purpose Limitation

Personal data "collected for specified, explicit and legitimate purposes" must not be "further processed in a manner that is incompatible with those purposes."

**What this means**:
- State the purpose clearly at the time of collection (in the privacy notice)
- Do not use data for a different purpose later without reassessment
- "Further processing for archiving purposes in the public interest, scientific or historical research purposes or statistical purposes" is an exception if appropriate safeguards are in place

**Compatibility test** (for re-use): When considering using data for a new purpose, assess:
- Is there a link between the original and new purpose?
- What is the context and reasonable expectations of data subjects?
- What is the nature of the data (more sensitivity = less flexibility)?
- What are the consequences for data subjects?
- Are there appropriate safeguards?

**In practice**: A marketing database cannot be re-used for recruitment screening without reassessment. Customer order data collected to fulfil purchases cannot be used for targeted advertising without a compatible purpose or new lawful basis.

### Principle 3: Data Minimisation

Personal data must be "adequate, relevant and limited to what is necessary in relation to the purposes for which they are processed."

**What this means**:
- Collect only what is needed for the stated purpose — no more
- Do not retain data for longer than necessary
- Review data holdings periodically and delete what is no longer required

**In practice**: A newsletter sign-up form that asks for date of birth, phone number, and postal address (none of which are needed for a newsletter) violates data minimisation. An HR system that retains employees' personal data for 10 years after departure when legal requirements only demand 6 years violates data minimisation.

**The ICO's view**: The ICO has been clear that organisations should ask themselves: "Would using less data allow us to achieve the same purpose?" If yes, they should use less.

### Principle 4: Accuracy

Personal data must be "accurate and, where necessary, kept up to date; every reasonable step must be taken to ensure that personal data that are inaccurate, having regard to the purposes for which they are processed, are erased or rectified without delay."

**What this means**:
- Implement processes to maintain accuracy (regular data quality checks, mechanisms for data subjects to correct inaccurate data)
- Address inaccuracy promptly when identified

**The Right to Rectification (Article 16)** operationalises this principle — data subjects can require correction of inaccurate data.

**In practice**: A credit reference agency holding incorrect adverse credit information about an individual causes material harm — inaccuracy in financial data can be extremely damaging. Accuracy requirements are particularly stringent where decisions affecting data subjects are made based on personal data.

### Principle 5: Storage Limitation

Personal data must be "kept in a form which permits identification of data subjects for no longer than is necessary for the purposes for which the personal data are processed."

**Exceptions**: Data may be retained longer for archiving in the public interest, scientific research, historical research, or statistical purposes, with appropriate safeguards.

**What this means**:
- Define retention periods for all categories of personal data
- Implement processes to delete or anonymise data at the end of its retention period
- Document the rationale for each retention period

**Retention period determination**:
- Legal minimum retention (some data must be kept for defined periods — employment records, financial records)
- Legal maximum retention (no unlimited retention without ongoing justification)
- Contractual requirements
- Business purpose (how long is the data genuinely needed?)

**In practice**: A data retention schedule (or records retention schedule) is the primary tool for operationalising storage limitation. It must be implemented — not just documented. An organisation with a retention schedule that nobody follows is not compliant.

### Principle 6: Integrity and Confidentiality (Security)

Personal data must be "processed in a manner that ensures appropriate security of the personal data, including protection against unauthorised or unlawful processing and against accidental loss, destruction or damage, using appropriate technical or organisational measures."

**What this means**: This is the security principle — the bridge between data protection law and information security. It requires appropriate security measures, proportionate to the risk.

**Article 32** operationalises this principle, specifying that appropriate measures may include:
- Encryption of personal data
- Ability to ensure ongoing confidentiality, integrity, availability, and resilience of processing systems
- Ability to restore availability and access to data in a timely manner in the event of a physical or technical incident
- A process for regularly testing, assessing, and evaluating the effectiveness of technical and organisational measures

**ISO 27001 connection**: ISO 27001 certification is widely accepted as evidence of "appropriate technical and organisational measures" under Article 32/Principle 6. (See G5-09 for full treatment.)

### Principle 7: Accountability

The controller "shall be responsible for, and be able to demonstrate compliance with" the previous six principles.

**What this means**:
- Compliance must be demonstrated, not just claimed
- Documentation is essential (Records of Processing Activities, DPIAs, policies, training records, audit trails)
- Appropriate governance structures must be in place (DPO where required, data protection policies, staff training)
- Compliance must be ongoing — not a one-time event

**This principle fundamentally changed the compliance burden**: Under the 1995 Directive, organisations could claim compliance and regulators had to prove non-compliance. Under GDPR's accountability principle, organisations must proactively demonstrate compliance. The burden of proof has shifted.

**Accountability in practice**:
- Records of Processing Activities (RoPA) — mandatory for most organisations (Article 30)
- Data Protection Impact Assessments (DPIAs) — required for high-risk processing (Article 35)
- DPO appointment — required for certain organisations (Article 37)
- Privacy by design and default (Article 25)
- Staff training and awareness
- Security measures appropriate to the risk (Article 32)
- Data breach notification procedures (Articles 33–34)

---

## The 6 Lawful Bases for Processing (Article 6)

Every act of processing personal data must have a **lawful basis** — one of the six specified in Article 6(1). Processing without a lawful basis violates GDPR's first principle (lawfulness) and is unlawful, regardless of any other compliance measures.

The six lawful bases:

### Basis 1: Consent (Article 6(1)(a))

The data subject has given **freely given, specific, informed, and unambiguous** consent to the processing of their personal data for one or more specific purposes.

**Conditions for valid consent:**
- **Freely given**: No power imbalance that coerces consent; consent must be able to be refused without detriment; employees cannot freely consent to employer processing in most circumstances
- **Specific**: Given for a specific purpose, not a blanket consent to "use your data for any purpose"
- **Informed**: The data subject must understand what they are consenting to — clear language, not legalese
- **Unambiguous**: Positive opt-in required — no pre-ticked boxes, no "by continuing to use this website you consent"
- **Withdrawable**: Data subjects must be able to withdraw consent as easily as they gave it; processing must stop when consent is withdrawn

**When consent is appropriate**:
- Marketing activities (where legitimate interests cannot be justified)
- Non-essential cookies (ePrivacy Directive requirement)
- Processing of special category data (Article 9(2)(a)) — requires explicit consent
- Activities outside the reasonable expectations of the data subject

**When consent is NOT appropriate**:
- Employment context (typically — employees cannot freely refuse consent from an employer in most situations)
- Where there is a genuine alternative lawful basis (using consent to "cover" processing that should rely on legitimate interests creates unnecessary obligations and may be disingenuous)
- Public authority processing (typically should rely on legal obligation or public task)

**Record-keeping requirement**: Controllers must demonstrate consent was obtained validly — maintain records of when consent was given, what it covered, and any subsequent withdrawals.

### Basis 2: Contract (Article 6(1)(b))

Processing is necessary for the **performance of a contract** to which the data subject is party, or in order to take steps at the request of the data subject **prior to entering into a contract**.

**Key word: "necessary"**: The processing must be genuinely necessary for the contract, not merely convenient. A delivery company processing a customer's address to deliver their order: contract basis. That same company processing browsing history to improve its recommendation algorithm: not contract basis (not necessary for the delivery contract).

**Pre-contractual processing**: Processing data to produce a quote, to verify eligibility for a service, or to conduct due diligence before a contract is formed.

**When contract is appropriate**:
- Customer order fulfilment (delivery address, payment processing)
- HR processing for employment (payroll, tax, contractual obligations)
- Professional service delivery to clients
- Online service accounts where processing is necessary to provide the service

### Basis 3: Legal Obligation (Article 6(1)(c))

Processing is necessary for compliance with a **legal obligation** to which the controller is subject.

**Examples**:
- Employer processing employee data for PAYE tax purposes (legal obligation to HMRC)
- Financial institution processing KYC (Know Your Customer) data for anti-money laundering obligations
- Medical organisation retaining patient records for the minimum retention period required by NHS/CQC
- Processing data to respond to a court order or regulatory investigation

**Key requirement**: There must be an actual legal obligation in EU or member state law — not just a business policy or contractual obligation. "We have to" must mean a specific legal or regulatory requirement, not organisational preference.

### Basis 4: Vital Interests (Article 6(1)(d))

Processing is necessary to protect the **vital interests** of the data subject or another natural person.

**Scope**: This is a narrow, emergency basis — it applies where processing is necessary to protect someone's life. The ICO is clear that this is not a general basis for health-related processing — specific conditions in Article 9 govern health data.

**Examples**:
- Processing location data to find and assist an unconscious accident victim
- Emergency medical treatment where the patient cannot consent
- Processing data to assess someone's welfare in a safeguarding situation

**"Last resort" nature**: Vital interests should only be relied upon when another basis (particularly consent) cannot reasonably be used. If the person is conscious and can consent, they should consent — vital interests is for emergency situations where consent cannot be obtained.

### Basis 5: Public Task (Article 6(1)(e))

Processing is necessary for the performance of a **task carried out in the public interest** or in the exercise of **official authority** vested in the controller.

**Who can use this**:
- Government departments and public authorities
- Public bodies with statutory functions
- Private organisations exercising a public function (e.g. an NHS-commissioned provider delivering NHS services)

**The public interest test**: The processing must be necessary to deliver the public task or exercise official authority. The task must have a clear basis in law.

**Private sector relevance**: Limited. Private companies generally cannot use public task as a lawful basis — they lack the official authority required. However, private companies delivering public functions under contract to government may be able to rely on it for that specific function.

### Basis 6: Legitimate Interests (Article 6(1)(f))

Processing is necessary for the purposes of **legitimate interests** pursued by the controller or by a third party, except where such interests are overridden by the interests or fundamental rights and freedoms of the data subject — in particular where the data subject is a child.

**The most flexible basis** — and the most abused. It requires a three-part test:

**Step 1 — Purpose test**: Is there a legitimate interest?
- Must be a real, genuine interest (not pretextual)
- Legitimate interests include: fraud prevention, network security, direct marketing (in some contexts), intra-group transfers for HR purposes, employee monitoring (within limits), research, journalism
- The interest must not be illegal or contrary to public policy

**Step 2 — Necessity test**: Is the processing necessary?
- Is it the minimum processing needed to achieve the legitimate interest?
- Is there a less privacy-intrusive way to achieve the same goal?

**Step 3 — Balancing test**: Do the legitimate interests override data subjects' interests?
- Consider: nature of the data (more sensitive = harder to justify), reasonable expectations of data subjects, impact on data subjects, any safeguards in place
- If the balance tips in favour of data subjects, legitimate interests cannot be used

**When legitimate interests is appropriate**:
- Direct marketing to existing customers (Recital 47 explicitly mentions this)
- Fraud prevention and security monitoring
- Employee monitoring (within proportionality limits)
- Intra-group data transfers for administrative purposes
- Research and analytics (with appropriate safeguards)

**When legitimate interests is NOT available**:
- Public authorities performing public tasks (should use public task basis)
- Processing that requires consent of the data subject (particularly for special category data)
- When the data subjects' interests clearly override — children's data; highly sensitive data; unexpected or harmful processing

**Legitimate Interest Assessment (LIA)**: A documented analysis of the three-step test, demonstrating that legitimate interests has been properly assessed. Best practice is to complete an LIA before relying on this basis and to retain it as evidence of accountability.

---

## Choosing the Right Lawful Basis

Choosing the correct lawful basis is critical — and not just for compliance. The lawful basis affects data subjects' rights (e.g. the right to object applies to legitimate interests processing; the right to data portability applies to consent and contract processing), the transparency obligations, and the ability to process the data lawfully in the first place.

**Decision framework:**

```
Is there a specific legal obligation requiring this processing?
→ YES: Legal obligation (6(1)(c))

Is the processing necessary to deliver a contract or pre-contract steps?
→ YES: Contract (6(1)(b))

Is this a public authority or official public function?
→ YES: Public task (6(1)(e))

Is this a genuine emergency protecting someone's life?
→ YES: Vital interests (6(1)(d))

Does the organisation have a legitimate interest, and does it
clearly outweigh data subjects' interests?
→ YES: Legitimate interests (6(1)(f))

Is there no other appropriate basis, and can genuinely free,
specific, informed consent be obtained?
→ YES: Consent (6(1)(a))
```

**Key principle**: Choose the lawful basis that genuinely applies — not the one that seems most convenient. Consent is not a "safe" default — it creates ongoing obligations (managing withdrawal, demonstrating valid consent) and may not be genuinely appropriate where power imbalances exist.

---

## Special Category Data: Additional Conditions

For special category data, having a Article 6 lawful basis is necessary but not sufficient. A separate condition from Article 9(2) is also required:

| Article 9(2) condition | Description |
|---|---|
| (a) Explicit consent | The data subject has given explicit consent to processing for specified purposes |
| (b) Employment/social security | Processing necessary in the context of employment or social security law |
| (c) Vital interests | Protecting vital interests of the data subject or others |
| (d) Non-profit body processing | By a foundation, association, or other non-profit body with political, philosophical, religious, or trade-union aims |
| (e) Made public by data subject | Data clearly made public by the data subject themselves |
| (f) Legal claims | Establishing, exercising, or defending legal claims |
| (g) Substantial public interest | Processing necessary for reasons of substantial public interest (must have basis in law) |
| (h) Health and social care | By health professionals, subject to professional secrecy obligations |
| (i) Public health | Processing necessary for public health purposes |
| (j) Archiving/research/statistics | With appropriate safeguards |

**In practice**: A healthcare provider processing patient health data requires both a Article 6 basis (typically public task or contract) AND an Article 9(2) condition (typically (h) — health care by a health professional, or (g) — substantial public interest in public health).

---

## The Records of Processing Activities (RoPA) — Article 30

The accountability principle requires controllers and processors to maintain a **Record of Processing Activities (RoPA)**. This is essentially a register of all processing activities — the living documentation of what personal data is processed, for what purpose, on what lawful basis, for how long, and with what protections.

**Mandatory content for controller RoPA:**
- Name and contact details of the controller (and DPO if applicable)
- Purposes of the processing
- Description of categories of data subjects
- Description of categories of personal data
- Recipients of personal data
- Transfers to third countries (and safeguards)
- Retention periods
- Description of technical and organisational security measures (where possible)

**Who must maintain a RoPA**: All controllers must maintain a RoPA except organisations with fewer than 250 employees — unless the processing is not occasional, or the processing is likely to result in risk to data subjects, or the processing includes special category data or criminal offence data. In practice, almost all commercial organisations need a RoPA.

**Format**: The regulation does not specify format. Common approaches: spreadsheet, dedicated GRC tool, or privacy management platform. The ICO provides template formats.

---

## Common Mistakes and Failures

**1. Relying on consent as a default basis without genuinely needing it.**
Consent requires active management (withdrawal handling, documentation), and in many contexts (employment, public authority) is not freely given. Many organisations use consent where legitimate interests or contract would be more appropriate — creating unnecessary compliance overhead.

**2. Pre-ticked boxes or "implied consent."**
Not valid under GDPR. Consent must be unambiguous — an active, positive opt-in. A user visiting a website is not giving consent to tracking.

**3. A single lawful basis for all processing activities.**
One business may process personal data for payroll (legal obligation), marketing (legitimate interests), and customer service (contract). Each processing activity needs its own lawful basis assessment.

**4. Not documenting the lawful basis decision.**
Under the accountability principle, organisations must be able to demonstrate the basis they have chosen and why. An undocumented basis is a compliance risk — if challenged by the ICO or a data subject, there is no evidence to rely on.

**5. Changing lawful basis mid-stream.**
Once a lawful basis is chosen, it is very difficult to switch. "We used consent but it's getting complicated, so we'll switch to legitimate interests" — this does not work. The purpose and basis must be established at the outset.

**6. Treating the RoPA as a one-time exercise.**
The RoPA must be maintained and updated when processing activities change. A static RoPA is compliance theatre — it does not reflect the actual data flows of the organisation.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- GDPR principles, particularly Principle 6 (security) and Principle 7 (accountability), are directly relevant to ISO 27001. Auditors must understand how the two frameworks interact and overlap.
- The security principle (Article 5(1)(f) + Article 32) is the primary GDPR basis for information security requirements — this is where ISO 27001 provides compliance evidence.

**CISM:**
- Domain 1 (Governance) requires understanding of legal and regulatory frameworks including GDPR's principles, lawful bases, and accountability requirements.

**CISSP:**
- Domain 1 (Security and Risk Management) covers data privacy laws including GDPR. Know the principles, the lawful bases, and the data subject rights (covered in G5-03).

**CRISC:**
- GDPR compliance risk (breach of principles, inadequate lawful basis) is a regulatory risk category that CRISC candidates must understand and be able to assess and treat.

---

## GUARDIAN's Take

The seven principles and six lawful bases are not bureaucratic rules invented by regulators. They are the legal expression of common ethical standards for handling information about people — standards that most reasonable people would endorse independently of any legal requirement.

Don't collect more than you need. Don't keep it longer than you need it. Don't use it for purposes people wouldn't expect. Keep it accurate. Keep it secure. Be transparent about what you're doing and why. Be accountable.

Every one of these is something a trustworthy organisation would do regardless of the law. GDPR doesn't require organisations to be trustworthy — it requires them to behave as if they were, and to prove it.

The organisations that struggle with GDPR compliance are almost always the ones that approach it as "what must we do?" — looking for minimum compliance. The organisations that find it manageable approach it as "what should we be doing with people's information?" — and find that genuine compliance with the principles comes naturally from treating data subjects with respect.

Know the principles. Know the lawful bases. Apply them with judgment, not just technically. That is the standard GDPR demands.

---
*Module: Module 5 — Data Protection / GDPR | Guardian Curriculum*
