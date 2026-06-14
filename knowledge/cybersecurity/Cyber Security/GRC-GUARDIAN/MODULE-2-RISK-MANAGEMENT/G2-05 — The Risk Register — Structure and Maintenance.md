---
tags: [guardian, grc, module-2, risk-management, risk-register, risk-owner, documentation]
module: 2
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-15
guardian-refs: ["G2-01 — What is Risk", "G2-02 — Risk Appetite and Risk Tolerance", "G2-03 — Risk Assessment Methodologies", "G2-04 — Qualitative vs Quantitative Risk Analysis", "G2-06 — Risk Treatment", "G2-07 — Residual Risk and Risk Acceptance"]
---

# G2-05 — The Risk Register — Structure and Maintenance

> [!abstract] What This Note Covers
> By the end of this note, you will understand what a risk register is, every field it should contain, how to structure it for maximum usefulness, what makes a risk register live vs dead, and how to maintain it as a genuine management tool rather than a compliance artefact.

---

## Why This Exists

In 2013, the UK's National Audit Office reviewed the government's approach to risk management across central departments. One of its core findings: risk registers existed in virtually every department, but in many cases they were "static documents" — updated once a year, owned by a single individual, and never referenced in actual decision-making. Ministers and senior officials were making decisions without any awareness of what the formal risk register said. The risk registers existed to satisfy governance requirements, not to manage risk.

This is the central failure of risk registers everywhere, in every sector, at every size of organisation. The register is built. It is approved. It sits in a SharePoint folder. And then nobody looks at it until the next audit.

The risk register is the most important operational document in an information security programme. It is the living record of everything the organisation knows about its risks — what they are, how severe they are, what is being done about them, and who is accountable. When it works, it is the engine of the entire GRC programme. When it is a static document, the GRC programme is theatre.

This note is about building one that actually works.

---

## What It Is

A **risk register** (also called a risk log, risk ledger, or risk inventory) is a structured document or database that records all identified information security risks — along with the information needed to assess, treat, monitor, and report on each risk.

It is the central output of the risk assessment process and the primary input to the risk treatment process. Every risk identified through any method — threat assessment, penetration testing, audit finding, incident review, supplier assessment — should ultimately be captured in the risk register.

The risk register is:
- **A record**: of all identified risks and their current status
- **A management tool**: for prioritising treatment actions and tracking progress
- **A reporting instrument**: for communicating risk posture to the CISO, Security Committee, and board
- **An audit artefact**: evidence that a risk assessment has been conducted and is maintained (required by ISO 27001 Clause 6.1.2)

It is not:
- A to-do list for the security team
- A compliance checkbox
- A document that belongs to one person
- Something that is updated annually and ignored in between

---

## The Anatomy of a Risk Register Entry

A well-structured risk register entry contains the following fields. Not all need to be in a single spreadsheet row — a database or GRC tool can present them more elegantly — but all should be captured.

### Field 1: Risk ID
A unique identifier for the risk. Enables cross-referencing in reports, treatment plans, and audit findings.

Format examples: `RISK-2024-001`, `IS-R-042`, `GRC-INFOSEC-012`

Consistent numbering is critical — risk IDs should never be reused, even for closed/retired risks (archive the entry; do not delete it).

### Field 2: Risk Title
A short, descriptive name for the risk. Used in executive summaries and dashboards where the full risk statement is too long.

Example: `Ransomware — Production Database`, `Insider Exfiltration — Customer Data`, `Third-Party Breach — HR Payroll Supplier`

### Field 3: Risk Statement (Full)
The complete, formal risk statement using the template from G2-01:

> *"There is a risk that [THREAT SOURCE] will [THREAT ACTION] by exploiting [VULNERABILITY] in/of [ASSET], resulting in [IMPACT]."*

This is the most important field. Everything else in the entry flows from it. A vague risk statement produces a vague risk assessment and an ineffective treatment plan.

### Field 4: Risk Category
Classification of the risk by type, enabling filtering, aggregation, and reporting by category.

Common categories:
- Access Control
- Data Protection / Privacy
- Third Party / Supply Chain
- Physical Security
- Availability / Business Continuity
- Insider Threat
- Application Security
- Infrastructure / Technology
- Regulatory / Compliance
- People / HR Security

### Field 5: Asset(s) Affected
The specific assets to which this risk relates. Links to the asset register. Multiple assets can be associated with a single risk.

### Field 6: Threat Source
The threat actor or threat event identified in the risk statement. Enables threat-based filtering and reporting.

Examples: `External Attacker`, `Malicious Insider`, `Accidental Staff Error`, `Ransomware Operator`, `Nation-State Actor`, `Natural Disaster`

### Field 7: Vulnerability
The specific weakness being exploited. Enables vulnerability-based analysis and links to remediation tracking.

Examples: `Absence of MFA on VPN`, `Unpatched Apache Struts`, `No clean-desk policy enforcement`, `Inadequate supplier security assessment`

### Field 8: Inherent Likelihood (Pre-Control)
The likelihood score before any controls are applied. Scored on the organisation's defined scale (e.g. 1–5).

This field is often skipped — organisations go straight to residual. This is a mistake. Inherent risk documents what the world would look like without controls, enabling demonstration of control value and identification of controls providing little benefit.

### Field 9: Inherent Impact (Pre-Control)
The impact score before any controls are applied.

### Field 10: Inherent Risk Score
`Inherent Likelihood × Inherent Impact`

### Field 11: Existing Controls
A description (or list) of controls currently in place that address this risk. Be specific — not "we have security controls" but "MFA enforced on all remote access via Duo Security; VPN access logs monitored in Splunk SIEM; quarterly access reviews conducted."

Links to the Statement of Applicability (SoA) and control library where applicable.

### Field 12: Control Effectiveness Rating
An assessment of how well the existing controls reduce the risk. Options: Effective / Partially Effective / Ineffective / Not Tested.

This is a critical field that most risk registers omit. A control listed as "existing" may not actually be working. Requiring a control effectiveness rating forces honest assessment and highlights gaps between controls on paper and controls in practice.

### Field 13: Residual Likelihood (Post-Control)
The likelihood score after existing controls are applied.

### Field 14: Residual Impact (Post-Control)
The impact score after existing controls are applied.

### Field 15: Residual Risk Score
`Residual Likelihood × Residual Impact`

### Field 16: Risk Rating / Band
The qualitative band derived from the residual risk score: Low / Medium / High / Critical (using the organisation's banding criteria).

### Field 17: Risk Appetite Status
Is the residual risk within or outside the organisation's risk appetite? Options: Within Appetite / Approaching Threshold / Exceeds Threshold / Exceeds Tolerance.

This is the field that connects the risk register to governance. It makes the appetite operationally visible.

### Field 18: Risk Owner
The named individual accountable for this risk — typically a business unit manager or senior leader, not the risk manager or CISO. The risk owner is responsible for ensuring treatment actions are implemented and for formally accepting residual risk if appropriate.

This must be a specific named person, not a team or department.

### Field 19: Treatment Decision
The chosen treatment option: **Mitigate / Transfer / Avoid / Accept**. (Covered in full in G2-06.)

### Field 20: Treatment Plan / Actions
Specific, actionable steps to implement the chosen treatment. Each action should have:
- A description of what will be done
- A named owner (who will do it)
- A target completion date
- A current status (Not Started / In Progress / Complete / Overdue)

### Field 21: Target Residual Risk Score
The expected residual risk score *after* the treatment plan is fully implemented. This is the target state — it should be within risk appetite.

### Field 22: Review Date
When this risk entry will next be reviewed. High/Critical risks: at least quarterly. Medium risks: at least twice per year. Low risks: annually.

Review date is not the same as treatment completion date. Even if treatment is complete, the risk must still be reviewed to confirm the treatment has been effective and circumstances have not changed.

### Field 23: Date Identified / Date Last Updated
Audit trail fields. When was this risk first added to the register? When was it last reviewed/updated?

### Field 24: Risk Source / Trigger
How was this risk identified? Options: Risk Assessment / Penetration Test / Internal Audit / External Audit / Incident Review / Threat Intelligence / Management Review / Regulatory Change / New System / Staff Report

This enables analysis of which identification methods are most productive and ensures findings from various sources are all captured in the register.

### Field 25: Status
Current status of the risk: **Open / Treatment In Progress / Treatment Complete / Accepted / Transferred / Closed / Retired**

---

## The Complete Risk Register: A Worked Example

Here is a complete risk register entry — every field populated for a realistic risk:

| Field | Content |
|---|---|
| **Risk ID** | RISK-2024-017 |
| **Risk Title** | Ransomware — ERP Production Database |
| **Risk Statement** | There is a risk that a ransomware operator will exploit unpatched vulnerabilities in the organisation's internet-facing Windows servers to deploy encryption malware, rendering the ERP system and customer order database unavailable, resulting in an estimated 5–10 day operational outage, inability to process orders or fulfil customer commitments, potential GDPR breach notification if customer data is exfiltrated, and estimated recovery costs of £500K–£2M. |
| **Risk Category** | Availability / Business Continuity; Data Protection |
| **Assets Affected** | ERP System (SAP S/4HANA); Customer Order Database; Windows Server Infrastructure |
| **Threat Source** | External Ransomware Operator (financially motivated) |
| **Vulnerability** | 14 critical CVEs unpatched on internet-facing Windows servers; patching cycle exceeds 90 days for production systems |
| **Inherent Likelihood** | 4 — Likely (ransomware targeting retail/logistics sector is frequent; 30%+ probability per year without controls) |
| **Inherent Impact** | 5 — Catastrophic (full ERP outage would halt operations; estimated £2–5M total impact) |
| **Inherent Risk Score** | 20 — Critical |
| **Existing Controls** | Perimeter firewall (Palo Alto); Endpoint protection (CrowdStrike Falcon); Weekly differential backups to NAS (untested for 18 months); Security awareness training (annual, completion rate 72%) |
| **Control Effectiveness** | Partially Effective — Endpoint protection is effective; backup strategy is present but restoration has not been tested; patching process is the primary vulnerability and remains unaddressed |
| **Residual Likelihood** | 3 — Possible (controls reduce probability but critical patch gap remains) |
| **Residual Impact** | 5 — Catastrophic (backups not tested; full recovery unconfirmed) |
| **Residual Risk Score** | 15 — High |
| **Risk Rating** | HIGH |
| **Risk Appetite Status** | Exceeds Threshold (appetite: residual ≤ Medium/9) |
| **Risk Owner** | Head of IT Operations — James Chen |
| **Treatment Decision** | Mitigate |
| **Treatment Actions** | 1. Implement emergency patching programme for internet-facing servers — James Chen — Due: 30 days — IN PROGRESS. 2. Conduct full backup restoration test — James Chen — Due: 45 days — NOT STARTED. 3. Implement immutable offsite backup solution — James Chen / CFO approval required — Due: 90 days — NOT STARTED. 4. Increase patching cadence policy from 90 days to 30 days for critical CVEs — Risk Manager — Due: 60 days — NOT STARTED. |
| **Target Residual Score** | 6 — Medium (Likely: 2, Impact: 3, post-treatment) |
| **Review Date** | 30 days (given Critical→High status and active treatment) |
| **Date Identified** | 2024-11-01 |
| **Last Updated** | 2024-11-15 |
| **Risk Source** | Penetration Test — External (October 2024) |
| **Status** | Treatment In Progress |

---

## Risk Register Structure and Format

### Format Options

| Format | Pros | Cons | Best for |
|---|---|---|---|
| **Spreadsheet (Excel/Sheets)** | Familiar, flexible, no additional cost | Limited workflow, version control issues, no real-time collaboration | Small organisations, early-stage programmes |
| **Dedicated GRC Tool** (ServiceNow GRC, RSA Archer, LogicGate, 6clicks) | Workflow automation, dashboards, integration, audit trails | Cost, implementation complexity | Large enterprises, regulated sectors |
| **ITSM Platform** (Jira, Monday, Asana — adapted) | Familiar tooling, action tracking | Not designed for GRC; workarounds required | Mid-size orgs already using these tools |
| **SharePoint / Confluence** (structured pages or lists) | Integrated with Microsoft/Atlassian stack | Limited risk-specific functionality | Organisations with strong existing use of these platforms |

Whatever format is chosen, the register must support:
- Version control (who changed what, when)
- Access control (risk owners can view/edit their risks; executives can view all)
- Filter and sort by category, rating, owner, status
- Export for reporting

### Organising the Risk Register

Large risk registers benefit from structure:

**Option 1: Single flat register**
All risks in one list, filtered by category, owner, or rating. Simple for small programmes. Can become unwieldy at scale.

**Option 2: Hierarchical (strategic → tactical → operational)**
Strategic risks (board-level): major threats to business objectives
Tactical risks (CISO/security committee level): significant operational risks
Operational risks (first-line level): day-to-day control gaps

**Option 3: Domain-based**
Separate registers (or tabs) for: Technical Risk / People Risk / Physical Risk / Third Party Risk / Regulatory Risk — consolidated at the top level for reporting.

Most organisations with more than 50 risk entries benefit from some form of hierarchical or domain-based structure.

---

## Making the Risk Register Live: The Maintenance Programme

### What "Live" Means

A live risk register is one that:
- Reflects the current reality of the organisation's risk landscape
- Is updated promptly when circumstances change
- Is actively used in treatment decisions and management reporting
- Is genuinely owned by named risk owners, not centrally owned by the risk manager
- Generates action — treatment plans are tracked, completed actions are recorded, overdue actions are escalated

A dead risk register is one that:
- Was last updated at the annual risk assessment
- Contains risks with "target completion dates" that passed six months ago marked "In Progress"
- Is owned entirely by the security team with no business unit involvement
- Is produced for auditors, not for management

### The Maintenance Calendar

| Activity | Frequency | Owner |
|---|---|---|
| Review Critical/High risks — status check on treatment actions | Monthly | Risk Manager + Risk Owners |
| Review Medium risks | Quarterly | Risk Owners (with Risk Manager oversight) |
| Review Low risks | Annually | Risk Owner (light-touch) |
| Full risk reassessment (all risks re-scored from inherent) | Annually | Risk Manager + all Risk Owners |
| Out-of-cycle review triggers (new system, incident, regulation change, major org change) | As triggered | Risk Manager |
| Risk register reporting to Security Committee | Quarterly | CISO / Risk Manager |
| Top risk summary to Board | Annually (minimum) / Quarterly (mature) | CISO |
| Audit of risk register (internal audit) | Annually | Internal Audit |

### Treatment Action Tracking

Treatment actions age badly. A treatment plan recorded in January with a March completion date, updated to "In Progress" in March, June, and September, with no completion in sight, is a governance failure — and a red flag for auditors.

Best practice for treatment tracking:
- Every action has a named owner and a hard deadline
- Overdue actions are escalated automatically (or manually, weekly) to the risk owner's manager
- Actions that slip beyond 30 days trigger a risk owner review: is the treatment still appropriate? Is the deadline realistic? Does the residual risk need to be escalated?
- Completed actions are verified — not just self-reported — through evidence (configuration screenshots, test results, policy approval records)

### Risk Register Reporting

The risk register is the source data. Reporting translates it into formats for different audiences:

**For the Security Committee (quarterly):**
- Top 10 risks by residual score
- Risks exceeding appetite threshold
- Treatment action status summary (% on track, overdue, completed)
- New risks added since last review
- Risks closed or downgraded since last review
- Emerging threats requiring new risk entries

**For the Board (annually, or quarterly for mature programmes):**
- Strategic risk summary (top 5–7 risks in business language)
- Current risk posture vs risk appetite (are we within appetite?)
- Investment required to treat risks exceeding appetite
- Regulatory risk exposure summary
- Year-on-year trend (are we improving?)

**For the CISO (operational, ongoing):**
- Full register access
- Treatment action dashboard
- Overdue action alerts
- New risk triggers

---

## The Details That Matter

### Risk Register vs Issue Log: An Important Distinction

A risk is something that *might* happen. An issue is something that *has* happened or is happening now.

When a risk materialises (an incident occurs), it moves from the risk register to the incident log. The risk register entry should be updated to note the materialisation event, the actual impact, and any new residual risk posture after the incident.

Conversely, an audit finding (a confirmed control gap) is an *issue*, not a risk — it is something confirmed to exist now. However, the confirmed gap may create or elevate a risk, which should then be captured (or updated) in the risk register.

Keeping these distinct prevents the risk register from becoming a muddle of hypothetical risks and confirmed problems.

### Risk Register and the Statement of Applicability (SoA)

For ISO 27001, the risk register directly informs the Statement of Applicability (SoA). The SoA lists all ISO 27001 Annex A controls and records whether each is applicable, implemented, and why. The justification for selecting (or excluding) controls comes from the risk register: "Control A.8.5 (Secure Authentication) is applicable because RISK-2024-017 and RISK-2024-023 both identify authentication weaknesses as a key vulnerability."

Auditors will trace: Risk Register → SoA → Control evidence. If the risk register does not support the SoA, or the SoA controls are not evidenced, both are nonconformities.

### Risk Register Access and Confidentiality

The risk register contains sensitive information — it describes the organisation's known vulnerabilities in detail. Access must be controlled:

- Full register: CISO, Risk Manager, Internal Audit
- Own risk entries: Risk Owners (their assets and risks)
- Summary view: Security Committee, Board (aggregated, top-tier risks)
- External parties: Never in full; only relevant extracts under NDA for specific purposes (e.g., sharing relevant risks with a certification body auditor for context)

If the risk register is leaked to an attacker, it provides a roadmap of exploitable weaknesses. Handle it accordingly.

---

## Common Mistakes and Failures

**1. Risk statements that are too vague to be actionable.**
"Cybersecurity risk" as a full risk entry. No threat, no vulnerability, no asset, no impact. Cannot be scored, cannot be treated, cannot be reported. Every entry must contain all four components.

**2. Risk register owned by one person.**
When one person "owns" the entire register and updates it themselves, risk ownership has not been distributed to the business. The business units have no skin in the game. When a risk materialises, the risk manager is blamed for "missing it" rather than the business unit that failed to treat it.

**3. No control effectiveness assessment.**
Listing controls without assessing whether they are working. Controls listed as "existing" that have never been tested or verified. The register shows a lower residual risk than actually exists.

**4. Treatment plans with no deadlines or owners.**
"Implement MFA" with no named person and no date. Nobody acts. Nothing changes. The risk stays on the register indefinitely.

**5. Register never triggers escalation.**
Risks rated Critical with no escalation to the CISO or board. The risk register is consulted but never drives an urgent conversation. The threshold framework (see G2-02) exists precisely to prevent this.

**6. Closed risks deleted rather than archived.**
Deleting closed risks removes the historical record. Auditors may ask "what happened to this risk identified in the previous assessment?" Archive, do not delete. Status: Closed/Retired.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- The risk register is primary audit evidence for Clauses 6.1.2 (risk assessment), 6.1.3 (risk treatment), and 8.2/8.3 (operational risk assessment and treatment). Auditors will review it in detail during Stage 2.
- They will check: is every asset in scope represented? Are risk statements specific? Is inherent and residual risk documented? Are risk owners named? Are treatment plans current and being progressed?
- Common major nonconformity: the risk register has not been updated since the initial certification audit — no evidence of ongoing maintenance (breaches Clause 8.2 and 9.1).

**CRISC:**
- CRISC Domain 1 (IT Risk Identification) and Domain 4 (Risk and Control Monitoring) both test risk register management in depth.
- Know: what makes a good risk entry, how the register connects to treatment and reporting, and how risk owners relate to the register.

**CISM:**
- Domain 2 (Information Risk Management) tests how the CISO designs and maintains the risk management programme, of which the risk register is the central artefact.
- CISM scenarios often involve interpreting risk register data to make management decisions — which risks to escalate, how to present risk posture to the board, how to prioritise the treatment programme.

**CISSP:**
- Domain 1 tests risk management concepts at programme design level. Understanding the risk register's role within the broader risk management lifecycle is expected.

---

## GUARDIAN's Take

The risk register is where GRC either becomes real or collapses into paperwork. I have seen risk registers that are works of administrative art — beautifully formatted, colour-coded, with every field populated — that have no connection whatsoever to how the organisation actually manages risk. And I have seen simple spreadsheets that are genuinely used, genuinely owned, and genuinely driving better decisions.

The difference is not format. The difference is **ownership and consequence**.

Ownership means that every risk has a named business person who genuinely understands that they are accountable — not the security team, not the risk manager, but the person whose department creates the exposure. When something goes wrong, they are the ones explaining to the board why their treatment plan was not implemented.

Consequence means that the risk register is actually used. That Critical risks trigger board conversations. That overdue treatment actions trigger escalations. That the register informs budget decisions, procurement decisions, and technology decisions — not just audit responses.

If you are building a risk register for the first time, I have one piece of advice above all others: get the risk owners in the room. Sit with them. Explain the risks in their domain in language they understand. Make them co-authors of their risk entries, not recipients of a document someone else wrote. When they understand it, they own it. When they own it, they act on it.

That is how a risk register becomes a risk management programme.

---
*Module: Module 2 — Risk Management | Guardian Curriculum*
