---
tags: [guardian, grc, module-5, gdpr, data-subject-rights, access, erasure, portability, objection, rectification]
module: 5
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G5-02 — GDPR Structure Principles Lawful Basis", "G5-04 — Data Controller vs Data Processor", "G5-06 — The Role of the DPO", "G5-07 — Breach Notification"]
---

# G5-03 — Data Subject Rights — All Eight Explained

> [!abstract] What This Note Covers
> By the end of this note, you will understand all eight data subject rights under GDPR — what each right covers, when it applies, what exceptions exist, how to respond to requests, and how to build the operational processes needed to exercise these rights effectively.

---

## Why This Exists

Data subject rights are the mechanism by which individuals exercise control over their personal data. They are not aspirational provisions — they are legally enforceable rights that must be operationalised. When a data subject submits a request, the organisation has a defined timeframe to respond, a defined scope of obligation, and specific consequences for failure.

The ICO has issued significant fines for failures to respond to data subject access requests (DSARs). Individuals can complain to the ICO and, in some jurisdictions, bring direct legal claims. Organisations that treat data subject rights as a low-priority administrative function discover — sometimes expensively — that regulators do not share that assessment.

Building an effective rights-response process is a legal obligation and a practical necessity. This note covers every right in depth.

---

## The Eight Data Subject Rights

### Right 1: The Right to be Informed (Articles 13–14)

**What it is**: Data subjects have the right to be informed about the collection and use of their personal data. This is the transparency obligation — it is fulfilled primarily through privacy notices.

**Two articles, two situations:**
- **Article 13**: Information provided when data is collected directly from the data subject (a form, a signup, a transaction)
- **Article 14**: Information provided when data is obtained from a third party (data purchased, data obtained from public sources, data received from another controller)

**Required information (Article 13/14 — the "privacy notice" content):**
- Identity and contact details of the controller (and DPO if applicable)
- Purposes and lawful basis for processing
- Legitimate interests pursued (where that is the lawful basis)
- Recipients or categories of recipients
- International transfer details and safeguards (where applicable)
- Retention periods (or criteria used to determine them)
- Data subject rights available
- Right to withdraw consent (where processing is based on consent)
- Right to lodge a complaint with the ICO
- Whether provision of data is a statutory or contractual requirement, and consequences of not providing it
- Details of any automated decision-making including profiling, logic involved, and significance

**The transparency standard (Article 12)**: Privacy notices must be provided "in a concise, transparent, intelligible and easily accessible form, using clear and plain language, in particular for any information addressed specifically to a child."

**Layered notices**: Best practice is a layered approach — a short, accessible summary at the point of collection linking to a fuller privacy notice. The summary must include the most important information; the full notice provides complete detail.

**Timing**:
- Article 13 (direct collection): At the time of collection
- Article 14 (indirect collection): Within a reasonable period of obtaining the data, and no later than one month; or at the time of first communication with the data subject; or at the time of disclosure to another recipient — whichever is earlier

**Right to be Informed is not a request right**: Unlike other data subject rights, the right to be informed is fulfilled proactively — the organisation provides the information; the data subject does not have to ask for it. Failure to provide a privacy notice is a violation regardless of whether a data subject complains.

---

### Right 2: The Right of Access (Article 15) — Subject Access Request (SAR/DSAR)

**What it is**: Data subjects have the right to obtain confirmation of whether their personal data is being processed, and if so, to receive a copy of that data along with supplementary information.

**What a SAR response must include:**
- Confirmation that personal data is (or is not) processed
- A copy of the personal data being processed
- The purposes of processing
- The categories of personal data
- Recipients or categories of recipients
- Retention periods (or criteria)
- Information about data subject rights (rectification, erasure, restriction, objection)
- Right to lodge a complaint with the ICO
- Information about the source of the data (where not collected from the data subject)
- Details of any automated decision-making
- Safeguards for international transfers

**Timeframe**: One calendar month from receipt of the request. Extendable by a further two months (three months total) for complex or numerous requests — but the data subject must be informed of the extension within the first month.

**Format**: The information must be provided in a commonly used electronic format where the request was made electronically, unless the data subject requests otherwise.

**Verification**: The organisation may verify the identity of the requestor before responding — particularly where the information requested is sensitive. However, verification requests must be proportionate — asking for excessive verification creates obstacles to a legitimate right.

**No fee**: Access requests must be fulfilled without charge in normal circumstances. A "reasonable fee" may be charged for requests that are "manifestly unfounded or excessive, particularly because of their repetitive character."

**Exemptions**: Some information may be exempt from disclosure:
- Information about third parties (the SAR response should not disclose another person's data without their consent, unless the third party consents or it is reasonable to disclose without consent)
- Legal professional privilege
- Information that would prejudice crime prevention, detection, or prosecution
- Certain regulatory functions
- Other specific exemptions in the DPA 2018

**Operationalising SAR responses**:
- Define who receives and co-ordinates SARs (DPO, legal, or dedicated SAR team)
- Define the process for searching all relevant data stores (email, CRM, HR systems, paper records, cloud storage, backup)
- The search must be thorough — failure to find and disclose data that exists is a violation
- Redaction of third-party personal data before disclosure
- Quality check before sending (nothing exempt; nothing missing)
- Log all SARs and responses (evidence of compliance)

**Why SARs are operationally complex**: A large organisation may have personal data about one individual spread across dozens of systems — email, CRM, HR, payroll, helpdesk, marketing platforms, physical files. A complete SAR response requires searching all of them. This is why mature organisations invest in data mapping and a RoPA — without knowing where data lives, finding it all in one month is extremely difficult.

---

### Right 3: The Right to Rectification (Article 16)

**What it is**: Data subjects have the right to have inaccurate personal data corrected, and to have incomplete data completed.

**Timeframe**: One month from receipt of the request (extendable by two months for complex requests, with notification within the first month).

**Scope**: The controller must correct or complete personal data without undue delay. Where data has been shared with third parties, the controller must inform those parties of the rectification unless this is impossible or involves disproportionate effort. The data subject may request to be informed who those third parties are.

**Operationalising**:
- Any staff member receiving a rectification request must route it to the appropriate team
- The organisation must have the ability to update data across all relevant systems
- Where third-party disclosure occurred, a process for notifying those parties must exist
- Record the request, the rectification made, and any third-party notifications

**When can rectification be refused**: The organisation may refuse if the data is accurate. The burden of demonstrating inaccuracy lies with the data subject, though the organisation should not be obstructive in considering claims of inaccuracy — particularly for data that may be outdated.

---

### Right 4: The Right to Erasure ('Right to be Forgotten') (Article 17)

**What it is**: Data subjects have the right to request the deletion or removal of personal data in certain circumstances. This is the most widely misunderstood data subject right — it is not an absolute right to demand deletion of any data at any time.

**Circumstances where erasure must be granted:**
1. The personal data is no longer necessary for the purpose it was collected
2. The data subject withdraws consent and there is no other lawful basis
3. The data subject objects to processing under Article 21 and there are no overriding legitimate grounds
4. The personal data has been unlawfully processed
5. The personal data must be erased for compliance with a legal obligation
6. The personal data was collected in the context of offering information society services to a child

**Circumstances where erasure does NOT apply (exemptions):**
- Freedom of expression and information
- Compliance with a legal obligation (e.g. must retain records for legal/tax purposes)
- Reasons of public interest in public health
- Archiving in the public interest, scientific research, historical research, or statistical purposes
- Establishment, exercise, or defence of legal claims

**Timeframe**: One month (extendable by two months for complex requests).

**Third-party notification**: Where data has been shared and made public, the controller must take "reasonable steps" to inform other controllers processing that data that erasure has been requested. This is the practical foundation of the "right to be forgotten" concept from the 2014 Google Spain case.

**Operationalising erasure**:
- Verify whether any exemption applies before granting erasure
- If granted: delete or anonymise the data across all systems (the challenge is the same as SAR — finding it all)
- Update backups where technically feasible — note that data in backup systems may be beyond "active" erasure; consider whether backup restoration would restore deleted data
- Inform third parties where data has been shared
- Log the request, decision, and actions taken

**The tension with retention**: If data must be retained for legal purposes (financial records for 7 years, employee records for defined periods), the legal obligation exemption applies — erasure can be refused for that data. However, data beyond its retention period should be deleted regardless of whether an erasure request has been made (storage limitation principle).

---

### Right 5: The Right to Restriction of Processing (Article 18)

**What it is**: Data subjects have the right to request that the controller marks data as restricted — limiting further processing while a dispute is resolved or the data subject exercises other rights.

**Circumstances when restriction applies:**
1. The accuracy of the data is contested — restricts processing while accuracy is verified
2. The processing is unlawful and the data subject prefers restriction to erasure
3. The controller no longer needs the data, but the data subject needs it for legal claims
4. The data subject has objected under Article 21 — restricts processing while the controller determines whether legitimate grounds override

**Effect of restriction**: When data is restricted, it may only be processed with the data subject's consent, for legal claims, for the protection of another person's rights, or for reasons of important public interest. It may be stored but not actively used.

**Technical implementation**: The controller must implement a mechanism to mark data as "restricted" and ensure that restricted data is not processed further except in the permitted circumstances. This requires technical controls — most systems do not natively support "restricted" status; organisations may need to move restricted data to a separate, access-controlled store.

**Third-party notification**: Where data has been shared, the controller must inform recipients of the restriction (unless impossible or disproportionate).

**Lifting restriction**: Before lifting a restriction, the data subject must be informed.

**Timeframe**: One month (extendable by two months).

---

### Right 6: The Right to Data Portability (Article 20)

**What it is**: Data subjects have the right to receive their personal data in a structured, commonly used, machine-readable format, and to transmit that data to another controller, where technically feasible.

**Scope — only applies where:**
- The processing is based on consent or contract (NOT legitimate interests, legal obligation, public task, or vital interests)
- The processing is carried out by automated means

**What must be provided**: The personal data provided by the data subject — not all data held about them (that is the SAR). Specifically, data "provided" by the data subject includes both actively provided data (form entries, uploads) and observed data (usage data, transaction history, activity data).

**Format**: Structured, commonly used, machine-readable — typically JSON, CSV, or XML. PDF is generally not considered machine-readable in this context.

**Direct transfer**: Where technically feasible, the data subject can request that data is transmitted directly from one controller to another (e.g. from one bank to another, or from one social media platform to another). The controller must comply if technically feasible — but is not required to invest in new technical infrastructure to enable this.

**Relationship to SAR**: Portability provides a subset of data in a machine-readable format; SAR provides all personal data in any intelligible format. A data subject may use both rights simultaneously.

**Timeframe**: One month (extendable by two months).

**Operationalising portability**:
- Identify which data is subject to portability (consent/contract basis; automated processing)
- Implement export functionality for that data (CSV/JSON export from systems)
- Process: verify identity, verify the lawful basis applies, generate the export, deliver securely to the data subject or directly to the recipient controller

---

### Right 7: The Right to Object (Article 21)

**What it is**: Data subjects have the right to object to processing of their personal data in certain circumstances — and the controller must stop processing unless it can demonstrate compelling legitimate grounds that override the data subject's interests.

**Two categories of objection:**

**Category A — Objection to processing based on legitimate interests or public task (Article 21(1)):**
The data subject objects on grounds relating to their particular situation. The controller must stop processing UNLESS it can demonstrate compelling legitimate grounds for processing that override the interests, rights, and freedoms of the data subject, or the processing is for the establishment, exercise, or defence of legal claims.

The "compelling grounds" bar is high — the controller must demonstrate why its interests specifically override this data subject's specific objection. Generic assertions that legitimate interests are compelling are not sufficient.

**Category B — Objection to direct marketing (Article 21(2)):**
The data subject objects to processing for direct marketing purposes. The controller must stop processing for that purpose IMMEDIATELY — no exceptions, no balancing test. This is an absolute right. The right extends to profiling for direct marketing purposes.

**Timeframe**: The right to object to direct marketing must be respected immediately. For other objections under 21(1), the controller must respond within one month.

**Operationalising the right to object**:
- All marketing systems must include a mechanism to record and honour objections (opt-out/unsubscribe)
- "Unsubscribe" must be as easy as "subscribe"
- Objections must be actioned promptly — suppression lists must be maintained and respected
- For non-marketing objections: assess whether compelling grounds exist; document the assessment; if grounds do not override, cease processing

**Profiling note**: Profiling is defined in Article 4(4) as "any form of automated processing of personal data consisting of the use of personal data to evaluate certain personal aspects relating to a natural person." Profiling for marketing purposes is subject to Article 21(2) — data subjects can object to it absolutely.

---

### Right 8: Rights in Relation to Automated Decision-Making and Profiling (Article 22)

**What it is**: Data subjects have the right not to be subject to a decision based solely on automated processing (including profiling) which produces legal effects or similarly significant effects on them — unless specific conditions apply.

**What counts as "solely automated"**: The decision must involve no meaningful human involvement. If a human reviews the automated decision before it takes effect, it is not "solely automated" — though the ICO requires that review to be genuine, not a rubber stamp.

**"Legal or similarly significant effects"**: The threshold for this right is high:
- **Legal effects**: Changes legal status, rights, or obligations (e.g. determining benefit eligibility, determining visa applications)
- **Similarly significant effects**: Has comparable impact on the individual (e.g. automatic rejection of a credit application, automatic dismissal from employment, automatic denial of insurance, discriminatory targeting based on profiling)

**Exceptions — automated decisions ARE permitted if:**
1. Necessary for entering into or performing a contract between the data subject and controller
2. Authorised by EU or member state law with suitable safeguards
3. Based on explicit consent

**Safeguards required for permitted automated decisions (Article 22(3)):**
- The right to obtain human intervention
- The right to express the data subject's point of view
- The right to contest the decision

**Profiling and Article 22**: Article 22 applies to profiling that forms the sole basis of a legally or similarly significant decision. Profiling that does not lead to such decisions is not subject to Article 22 but may still be subject to Article 21 objection rights.

**Operationalising Article 22**:
- Identify all automated decision-making processes
- Determine whether any produce legal or similarly significant effects
- If they do: ensure a valid exception applies and implement the required safeguards
- Provide information about automated decision-making in privacy notices
- Document the logic involved in automated decision-making

---

## Responding to Data Subject Rights Requests: Operational Framework

### Receiving and Routing Requests

Requests can come through any channel — email, phone, social media, in-person, letter. The organisation must have a process for identifying requests regardless of channel and routing them to the appropriate team.

**Key operational question**: Does the request need to be in a specific format? GDPR says no — a verbal request is a valid request. The organisation can ask for clarification, but must not require the use of a specific form as a precondition to processing the request.

### Identity Verification

The organisation may verify identity before responding. Verification must be:
- Proportionate to the sensitivity of the information requested
- Not excessive or obstructive
- Completed within the overall one-month timeframe

For routine SARs: asking for name, date of birth, and one piece of identifying information (account number, reference number) is proportionate. Requiring notarised ID documents is disproportionate in most commercial contexts.

If the organisation cannot reasonably verify identity, it should inform the data subject and ask for additional information — but cannot simply refuse the request on that basis without making reasonable efforts.

### The One-Month Clock

The one-month period runs from the day the request is received — not from when the organisation's review period begins, not from when identity verification is complete, not from when the right team receives it. Day 0 is the day of receipt.

**Extension**: If the request is complex or there are numerous requests, the one-month period can be extended by a further two months. The data subject must be informed within the first month that an extension is being applied and the reasons for it.

**What happens if the deadline is missed**: The organisation is in breach of GDPR. The data subject can complain to the ICO. The ICO can investigate and take enforcement action. Missing deadlines is one of the most common GDPR enforcement areas.

### Refusing a Request

When a request is refused (either entirely or partially):
- Inform the data subject within one month
- Explain the reasons for refusal
- Inform the data subject of their right to complain to the ICO and to seek judicial remedy

Blanket refusals without explanation are a violation. Even where an exemption applies, the data subject must be told that a response cannot be provided and which exemption is being relied upon.

### Costs

Responding to data subject rights requests is generally free of charge. A "reasonable fee" may be charged, or a request refused, only where requests are manifestly unfounded or excessive — particularly where repetitive. The burden of demonstrating that a request is manifestly unfounded or excessive falls on the controller.

---

## Summary Table: All Eight Rights

| Right | Article | Timeframe | Key conditions | Absolute? |
|---|---|---|---|---|
| Right to be Informed | 13–14 | At collection / within 1 month | All processing | Yes (proactive obligation) |
| Right of Access | 15 | 1 month | All processing | Yes (with exemptions) |
| Right to Rectification | 16 | 1 month | Inaccurate/incomplete data | Yes |
| Right to Erasure | 17 | 1 month | Specified circumstances | No (exemptions apply) |
| Right to Restriction | 18 | 1 month | Specified circumstances | Yes when circumstances met |
| Right to Portability | 20 | 1 month | Consent/contract + automated | Qualified |
| Right to Object | 21 | Immediate (marketing); 1 month (other) | Legitimate interests/public task; always for marketing | Absolute for marketing |
| Rights re Automated Decisions | 22 | 1 month | Legal/significant effects | Qualified (exceptions apply) |

---

## Common Mistakes and Failures

**1. Treating SARs as an IT function.**
Searching email systems and CRM is just part of a SAR response. Personal data may also be in: paper files, helpdesk systems, call recordings, HR systems, financial systems, physical notebooks, WhatsApp messages on work phones, Slack channels. A thorough SAR requires a comprehensive search across all locations.

**2. Missing the one-month deadline.**
Common in organisations without a defined SAR process. The request arrives in a shared mailbox; nobody realises it's a formal SAR; weeks pass before anyone acts. Establish a dedicated SAR inbox, a tracking register, and automatic deadline alerts.

**3. Charging for SAR responses routinely.**
GDPR makes SARs free by default. Some organisations apply a charge to deter SARs — this is not permitted unless the request is genuinely manifestly unfounded or excessive. Routinely charging for SARs is a breach of Article 12.

**4. Refusing erasure requests without considering the applicable exemption.**
"We can't delete your data because we need it" is not an adequate response. The specific exemption that applies must be identified and communicated. If no exemption applies, the erasure must be granted.

**5. Not respecting marketing objections immediately.**
A data subject who opts out of marketing must be removed from marketing lists promptly — ideally within 24–48 hours, not at the next monthly list cleanse. Continued marketing after an objection is a clear breach.

**6. Privacy notices that are unreadable.**
Lengthy, legalistic privacy notices that nobody reads are not compliant with the transparency and plain language requirements of GDPR. The right to be informed requires intelligible, accessible information — not a legal document designed to satisfy lawyers rather than inform data subjects.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Data subject rights operationalisation is part of the ISMS scope where the organisation processes personal data. The auditor may check: does the organisation have a process for handling SARs? Is it documented? Is there evidence that requests have been processed within the required timeframe?
- The security principle (Article 5(1)(f)) and the right of access (Article 15) together create requirements for the ISMS: personal data must be findable (for SAR response) and securely held (security principle).

**CISM:**
- Domain 4 (Incident Management) includes data subject rights in the context of breach notification — breached data subjects have the right to be informed (Articles 33–34). Domain 1 includes regulatory compliance obligations including data subject rights management.

**CISSP:**
- Domain 1 (Security and Risk Management) covers individual privacy rights globally. Know the eight GDPR rights and their operational requirements.

---

## GUARDIAN's Take

Data subject rights are where GDPR becomes personal — where abstract principles become real obligations with real deadlines and real consequences.

The right that generates the most operational difficulty — and the most regulatory action — is the right of access. Not because it is the most complex right in theory, but because operationalising it requires something most organisations have not done: know where all their personal data is.

A SAR forces the question: where is this person's data? It might be in the CRM, in email, in the HR system, in a helpdesk ticket, in a physical file, in a Slack message, in a call recording, in a backup, in a spreadsheet someone built on their laptop, in a WhatsApp group. Answering a SAR properly requires finding it all — and the organisation that doesn't know where its data lives cannot answer that question.

This is why data mapping and the RoPA are not bureaucratic exercises. They are the operational foundation for being able to respond to data subject rights in the time GDPR allows. An organisation without a data map that receives a SAR is starting from scratch with 30 days on the clock.

Build the data map. Maintain the RoPA. Establish the process before the first SAR arrives. Because the first SAR that arrives without a process in place will be the most expensive one you receive.

---
*Module: Module 5 — Data Protection / GDPR | Guardian Curriculum*
