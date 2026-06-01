---
tags: [guardian, grc, module-5, gdpr, breach-notification, 72-hours, article-33, article-34, incident-response]
module: 5
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G5-02 — GDPR Structure Principles Lawful Basis", "G5-04 — Data Controller vs Data Processor", "G5-06 — The Role of the DPO", "G4-01 — Organisational Controls — Incident Management", "G3-10 — Annex A Controls A.5.24–A.5.28"]
---

# G5-07 — Breach Notification — 72 Hours and What It Means

> [!abstract] What This Note Covers
> By the end of this note, you will understand GDPR's breach notification obligations in full — the 72-hour rule, what constitutes a notifiable breach, what the notification must contain, when data subjects must be informed, and how to build an incident response process that meets these requirements.

---

## Why This Exists

On 7 June 2021, LinkedIn experienced a data scraping incident affecting 700 million users. The company's response — arguing that aggregated publicly available data was not a "breach" — became a case study in how organisations interpret breach notification obligations to their advantage.

On 28 June 2021, the Irish DPC confirmed it was examining whether the incident constituted a personal data breach. The definitional question — what is a breach? when must it be notified? — is not academic. It determines whether a regulator investigates, whether regulatory sanctions follow, whether data subjects must be warned, and whether the organisation is seen as transparent or evasive.

GDPR's breach notification regime was a watershed moment. Before GDPR, notification of data breaches to individuals was rare and voluntary in most EU jurisdictions. GDPR created mandatory notification timelines — 72 hours to the supervisory authority, without undue delay to data subjects in high-risk cases — and a comprehensive definition of what constitutes a notifiable breach. Getting this wrong is expensive: late notification, failure to notify, or inadequate notification content are all grounds for regulatory action.

---

## What Is a Personal Data Breach? (Article 4(12))

GDPR defines a personal data breach as: *"a breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to, personal data transmitted, stored or otherwise processed."*

The three types of breach:

**Confidentiality breach**: Unauthorised or accidental disclosure of, or access to, personal data. The data is exposed to parties who should not have it.
Examples: Sending an email containing personal data to the wrong recipient; a hacker accessing a database of customer records; a staff member sharing customer data with an unauthorised party; a stolen unencrypted laptop.

**Integrity breach**: Unauthorised or accidental alteration of personal data.
Examples: A system error corrupting records; an attacker modifying stored data; accidental overwriting of data.

**Availability breach**: Unauthorised or accidental loss of access to, or destruction of, personal data.
Examples: A ransomware attack encrypting all data (even if no exfiltration occurs); accidental deletion of a database without backup; a flood destroying physical records.

**Critical insight**: A breach does not require a malicious actor or a sophisticated attack. A lost paper file, an misdirected email, a misconfigured cloud bucket, an internal error — all may constitute personal data breaches if personal data is affected.

**The encryption factor**: If lost or stolen data is fully encrypted (with a strong key that has not been compromised), the confidentiality breach may not be notifiable — the data is not actually accessible to the unauthorised party. This is why full disk encryption on laptops is not just a security control but also a GDPR risk mitigation. However, the ICO will scrutinise claims that encryption adequately protected the data — the encryption must be robust and the keys must not be compromised.

---

## The Three-Stage Notification Decision

Not every breach must be notified to the ICO, and not every notifiable breach requires data subject notification. The decision follows a three-stage analysis:

### Stage 1: Is this a personal data breach?

Apply the Article 4(12) definition. Has there been accidental or unlawful destruction, loss, alteration, or unauthorised disclosure of or access to personal data?

If no personal data is involved → not a breach under GDPR (may still be an information security incident requiring internal management).

If yes → proceed to Stage 2.

### Stage 2: Does the breach need to be notified to the ICO? (Article 33)

Article 33(1): The controller must notify the supervisory authority unless the breach "is unlikely to result in a risk to the rights and freedoms of natural persons."

The test is a **risk to data subjects** test. Factors to consider:

| Factor | Lower risk | Higher risk |
|---|---|---|
| **Nature of the data** | Non-sensitive (names, addresses) | Special category (health, biometric, financial) |
| **Volume** | Few individuals affected | Large number of individuals affected |
| **Ease of identification** | Data does not easily identify individuals | Data easily identifies specific individuals |
| **Severity of consequences** | Unlikely to cause harm | Could enable fraud, discrimination, physical harm |
| **Nature of breach** | Accidental internal; data recovered | Malicious; data exfiltrated; distributed |
| **Vulnerability of data subjects** | General population | Children, vulnerable adults, employees |
| **Encryption** | Data fully encrypted; key not compromised | Data unencrypted or encryption compromised |

**The default is to notify**: The ICO's guidance is that when in doubt, notify. Failure to notify when notification was required is a more serious compliance failure than notifying when notification may not have been strictly necessary.

**The narrow exception**: The only basis for not notifying is confidence that the breach is "unlikely to result in a risk." This is a low threshold — any realistic possibility of risk triggers the notification obligation.

If notification is required → proceed to Stage 3.
If notification is not required → document the decision and reasoning (accountability).

### Stage 3: Does the breach require notification to data subjects? (Article 34)

Article 34(1): The controller must communicate the breach to data subjects when it "is likely to result in a **high** risk to the rights and freedoms of natural persons."

This is a higher threshold than Article 33 (which requires notification to the ICO when there is any risk). Data subjects only need to be notified where the risk is specifically *high*.

Factors indicating high risk to data subjects:
- Special category data involved (health, financial, biometric)
- Risk of identity theft or fraud is realistic and significant
- Data enables physical harm to data subjects (e.g. location data exposing domestic abuse survivors)
- Large volume of sensitive data exfiltrated
- Vulnerable data subjects affected (children, patients, employees)

**Exceptions to data subject notification (Article 34(3))** — notification not required if:
- The controller has implemented appropriate technical and organisational measures (e.g. encryption) that render the data unintelligible to any person not authorised to access it
- The controller has taken subsequent measures to ensure the high risk is no longer likely to materialise
- Notification would involve disproportionate effort — in which case the controller must make a public communication or equivalent (this is a narrow exception)

---

## The 72-Hour Rule (Article 33)

**The requirement**: The controller must notify the competent supervisory authority (the ICO in the UK) of a notifiable breach "without undue delay and, where feasible, not later than 72 hours after having become aware of it."

### When Does the 72-Hour Clock Start?

The clock starts when the controller "becomes aware" of the breach — not when the breach occurred.

**"Becomes aware"** — the EDPB has provided guidance on this concept:
- The controller has a reasonable degree of certainty that a security event has occurred that has led to the compromise of personal data
- A data subject reporting that they received an unusual email is not necessarily "awareness" — it may trigger investigation, but awareness requires reasonable certainty of a breach
- A processor notifying the controller of a breach triggers the controller's awareness at that point

**Practical implication**: The 72-hour window often starts before the full scope of the breach is known. Article 33(4) explicitly addresses this — notification can be made in phases when all information is not available at once.

### When 72 Hours Is Exceeded

If notification is made after 72 hours, the controller must provide reasons for the delay with the notification. The ICO may take a less favourable view of delayed notification — particularly if the delay appears designed to avoid or minimise regulatory scrutiny rather than reflecting genuine operational constraints.

Valid reasons for delay:
- Ongoing investigation to confirm the breach occurred and assess scope
- Time needed to gather technical details for the notification
- Multiple breaches being assessed simultaneously

Invalid reasons for delay:
- Waiting for legal advice on whether to notify (this does not pause the clock)
- Hoping the breach would "sort itself out"
- Business concerns about reputational impact

### The Processor's Role in the 72-Hour Clock

Where a processor experiences a breach affecting the controller's data:
- The processor must notify the controller "without undue delay" (Article 33(2))
- The controller's 72-hour clock runs from the processor's notification to the controller
- The processor cannot notify the supervisory authority directly on behalf of the controller (unless explicitly authorised)
- DPAs should specify the processor's notification obligations and timelines

**The practical problem**: "Without undue delay" for processor-to-controller notification is not defined. The EDPB guidance suggests this should be faster than 72 hours — the processor's notification should give the controller time to investigate and notify within the 72-hour window. 24 hours processor-to-controller is a reasonable target; anything beyond 48 hours creates serious timeline pressure.

---

## What the ICO Notification Must Contain (Article 33(3))

The notification to the ICO must include, at minimum:

**(a) A description of the nature of the personal data breach** including, where possible:
- The categories of data involved (what type of data?)
- Approximate number of data subjects concerned
- Approximate number of personal data records concerned

**(b) The name and contact details of the DPO** or other contact point (where more information can be obtained)

**(c) A description of the likely consequences of the personal data breach**

**(d) A description of the measures taken or proposed to be taken** by the controller to address the breach, including where appropriate measures to mitigate its possible adverse effects

**The phased approach (Article 33(4))**: Where all information is not available within 72 hours, the controller can notify with the information available and provide further information in phases. The initial notification should contain what is known; further details can be submitted as the investigation progresses.

### ICO Self-Report Portal

In the UK, breach notifications are made to the ICO through its online self-reporting tool at **ico.org.uk**. The form follows the Article 33(3) structure. Notifications should be as detailed as possible — vague notifications generate follow-up inquiries from the ICO.

---

## What the Data Subject Notification Must Contain (Article 34)

When data subjects must be notified, the communication must include:

**(a) A description of the nature of the breach** in clear and plain language — not technical jargon

**(b) The name and contact details of the DPO** or other contact point

**(c) A description of the likely consequences of the breach**

**(d) A description of measures taken or proposed** to address the breach and mitigate adverse effects

**Format and delivery**: The communication must be direct — not buried in a general announcement, not via a press release, not via a website update unless other methods are impossible. Direct email, letter, SMS, or equivalent — whatever channel reaches the data subjects effectively.

**Timing**: "Without undue delay" — there is no specific number of hours, but the ICO expects prompt notification once the decision to notify data subjects is made. Unnecessary delay in notifying data subjects exposes them to ongoing risk and is viewed unfavourably.

**Plain language requirement**: Data subject notifications must be written in language data subjects can understand — not legal boilerplate. The ICO has published guidance on what "plain language" looks like in breach notifications. Notifications that confuse or obscure should be avoided — they defeat the purpose of notification.

---

## Documenting All Breaches (Article 33(5))

Even where a breach does not require notification to the ICO or data subjects, the controller must document it. Article 33(5) requires:

*"The controller shall document any personal data breaches, comprising the facts relating to the personal data breach, its effects and the remedial action taken."*

This creates a **breach register** — a record of all breaches, whether notified or not, including:
- Date and time of discovery
- Date and time of breach (where known)
- Nature of the breach (confidentiality/integrity/availability)
- Data involved (categories, volume)
- Number of data subjects affected
- Cause of the breach
- Assessment of risk (and decision on whether to notify)
- Notification decisions (to ICO and/or data subjects, or not, with reasons)
- Remedial actions taken
- Outcome

The breach register is mandatory documented information under GDPR. The ICO can request it at any time — during an investigation or as part of a proactive audit. It is also an accountability document demonstrating that breaches are taken seriously and managed systematically.

---

## Building the Breach Response Process

### The Incident Response Plan (GDPR-specific elements)

An ISO 27001-compliant incident response plan (A.5.24–A.5.27) addresses information security incidents broadly. For GDPR compliance, the plan must also specifically address:

1. **Breach identification**: How is a breach recognised and distinguished from other security incidents?
2. **Initial assessment**: Who performs the initial risk assessment to determine notification requirements?
3. **DPO notification**: When and how is the DPO informed?
4. **72-hour clock activation**: Who starts the clock? How is the timeline tracked?
5. **ICO notification**: Who prepares and submits the notification? Which ICO reporting channel?
6. **Data subject notification**: If required, who prepares the communication, how is it delivered, who approves it?
7. **Breach register update**: Who maintains the register? What is the entry format?
8. **Post-incident review**: How is the breach reviewed and lessons learned incorporated?

### Breach Response Team

Clearly define who is involved in breach response:

| Role | Responsibility |
|---|---|
| **Incident Commander** (typically CISO or IT Manager) | Technical response; containment; investigation |
| **DPO** | Risk assessment; notification decision; regulatory liaison; data subject communication |
| **Legal** | Legal liability assessment; privilege considerations; litigation risk |
| **Communications** | Media relations; customer communication; public statement |
| **Senior Management** | Decision-making authority; regulatory escalation; resourcing |

### Decision Flowchart: Breach Notification

```
BREACH DISCOVERED / REPORTED
           │
           ▼
Is personal data involved?
    │                │
   NO              YES
    │                │
Not a GDPR          ▼
breach          Notify DPO and start
                breach assessment
                           │
                           ▼
              Does the breach pose any risk
              to data subjects' rights and freedoms?
                    │                   │
                  LOW RISK          ANY RISK
                    │                   │
              Document only        NOTIFY ICO
              (breach register)    within 72 hours
                                        │
                                        ▼
                          Does the breach pose HIGH RISK
                          to data subjects?
                               │              │
                             NO HIGH        HIGH RISK
                              RISK              │
                               │          NOTIFY DATA
                          No data         SUBJECTS
                          subject         without undue
                          notification    delay
                               │              │
                               └──────────────┘
                                        │
                                        ▼
                               Update breach register
                               Conduct post-incident review
                               Implement remedial actions
```

### The Processor Notification Obligation

Where a processor discovers a breach:

1. Immediately investigate and contain
2. Notify the controller without undue delay (target: within 24 hours of discovery)
3. Provide the controller with: nature of the breach, data involved, preliminary risk assessment, actions taken
4. Continue to provide updates as the investigation progresses
5. Do NOT notify the ICO directly (unless instructed by the controller)
6. Document the breach in the processor's own breach records

---

## Common Enforcement Examples

The ICO and EDPB have taken enforcement action in breach notification cases. Key lessons:

**British Airways (2019)**: ICO issued notice of intent for £183.39M fine following a 2018 breach affecting 500,000 customers. Among the issues: delay in detecting and reporting the breach, inadequate security measures. (Final fine: £20M due to COVID-19 economic conditions.)

**Marriott International (2018)**: £18.4M fine (reduced from £99M) for a breach affecting 339 million guests that went undetected for approximately 4 years. The delay in detection extended the breach's impact and delayed notification.

**Key ICO enforcement patterns**:
- Late notification (beyond 72 hours without adequate reason)
- Failure to notify when notification was required
- Inadequate notification content
- No breach register maintained
- Inadequate breach response procedures (including processor oversight failures)

---

## The Details That Matter

### The "Accidental" Breach

Many organisations focus on malicious breaches (cyberattacks, hacks) and overlook accidental breaches, which are significantly more common. The ICO's own breach statistics consistently show that accidental disclosure (e.g. misdirected emails, incorrect postage, faxing to wrong numbers) is among the most frequent breach types reported.

Every misdirected email containing personal data is a potential GDPR breach. Organisations need to build awareness that "it was just a mistake" does not exempt a breach from GDPR notification assessment.

### Processor Breaches: Controller's Obligation

When a processor suffers a breach affecting the controller's data, the controller's 72-hour clock starts when the processor notifies the controller — not from when the breach occurred at the processor. This is why prompt processor-to-controller notification is critical.

However, where a controller learns of a processor breach through other means (press reports, data subjects contacting them, independent discovery), the clock may start from that earlier awareness point. Controllers cannot deliberately avoid awareness by not checking on their processors.

### The ICO's Assessment Following Notification

After a notification, the ICO may:
- Acknowledge receipt and take no further action
- Request additional information or clarification
- Open a formal investigation
- Issue enforcement action (reprimand, enforcement notice, or fine)

The ICO's response depends on: severity of the breach, adequacy of the response, prior compliance history, transparency and cooperation of the controller. A well-prepared notification that demonstrates competent response and genuine accountability is received very differently to a vague notification that appears defensive.

---

## Common Mistakes and Failures

**1. Failing to start the 72-hour clock promptly.**
The breach is reported by an employee. It is added to the IT helpdesk queue. Three days later, someone realises it should have been escalated. The clock was running from the original report; the 72-hour window has passed. Establish a clear triage process that identifies potential breaches and starts the clock immediately.

**2. Assuming every breach needs ICO notification.**
Some controllers notify the ICO for every incident — including those that clearly present no risk to data subjects (an encrypted laptop recovered immediately, an internal error corrected before any data was accessed). This generates regulatory correspondence and may draw scrutiny to the organisation. Assess each breach on its merits.

**3. Assuming no breach needs ICO notification.**
The opposite problem. Controllers who never notify — arguing that breaches are always "low risk" — are almost certainly under-notifying. The ICO's guidance is that when in doubt, notify.

**4. No breach register maintained.**
The ICO can request the breach register at any time. An organisation without a register — or with a register that captures only notified breaches and not internal ones — is failing the Article 33(5) documentation obligation.

**5. Data subject notifications that obscure rather than inform.**
Lengthy legal disclaimers, vague language about "potential data exposure," buried in a generic security announcement — these fail the transparency requirement. Data subject notifications must be direct, clear, and specific about what happened and what data subjects should do.

**6. Processor not included in incident response.**
The incident response plan is designed for the controller's own systems. When a processor breach occurs, nobody knows how to invoke the DPA's notification provisions. Include processor breach scenarios in the incident response plan and test them.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Breach notification is operationalised through the incident management controls (A.5.24–A.5.28). Auditors assess: does the incident response plan include GDPR breach notification procedures? Is there a breach register? Is there evidence of breach notifications being made appropriately?
- A finding that the organisation has experienced security incidents involving personal data but has no breach assessment process is a significant concern — both an ISO 27001 finding (inadequate incident response) and a GDPR compliance concern.

**CISM:**
- Domain 4 (Incident Management) covers breach notification as part of the incident response lifecycle. CISM candidates must understand the regulatory notification obligations that arise from security incidents involving personal data.

**CISSP:**
- Domain 1 (Security and Risk Management) covers legal notification requirements. Know the 72-hour rule, the Article 33/34 distinction, and the documentation requirements.

---

## GUARDIAN's Take

The 72-hour rule is simultaneously one of GDPR's most important provisions and its most misunderstood.

The most important thing: the clock starts when you become aware, not when you have all the answers. This catches organisations out because the natural instinct is to investigate fully before deciding whether to notify. By the time the investigation is complete, the window may have closed.

The 72-hour rule is designed to be uncomfortable. It forces organisations to notify on the basis of incomplete information — and to continue providing information as the investigation progresses. This feels wrong to lawyers and communications teams who want the full picture before communicating anything. But it reflects a deliberate regulatory choice: data subjects and regulators have a right to early awareness so they can take protective action, even if the full picture is not yet clear.

The practical lesson: build a breach response process that can notify the ICO within 72 hours based on what you know at that moment. Make clear in the notification that the investigation is ongoing and further information will follow. Then follow it up.

The second lesson: the breach register is your accountability record. Every breach — notified or not — should be documented with the assessment that led to the notification decision. When the ICO asks "how many breaches have you had in the last two years, and what did you do about them?" your breach register is the answer. An organisation with a meticulous breach register — that identified breaches accurately, assessed them thoughtfully, notified appropriately, and remediated effectively — demonstrates exactly the accountability GDPR requires.

Build the register. Build the process. Test both before you need them. Because the breach that tests your process is coming — the question is whether your process is ready.

---
*Module: Module 5 — Data Protection / GDPR | Guardian Curriculum*
