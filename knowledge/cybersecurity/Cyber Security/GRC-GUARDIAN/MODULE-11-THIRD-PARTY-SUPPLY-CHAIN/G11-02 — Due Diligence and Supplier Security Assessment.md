---
tags: [guardian, grc, module-11, due-diligence, supplier-assessment, security-questionnaire, vendor-risk]
module: 11
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-25
guardian-refs: ["G11-01 — Third-Party Risk Management Framework", "G11-03 — Contractual Security Requirements", "G7-04 — SOC 2", "G3-13 — The Certification Journey", "G6-06 — The QSA"]
---

# G11-02 — Due Diligence and Supplier Security Assessment

> [!abstract] What This Note Covers
> By the end of this note, you will understand how to conduct effective supplier security due diligence — what assessment methods are available, how to design and use security questionnaires, how to evaluate third-party certification evidence (SOC 2, ISO 27001, PCI DSS AOC), how to conduct supplier interviews and on-site assessments, and how to reach a defensible risk decision from assessment findings.

---

## Why This Exists

The security questionnaire is the most common due diligence tool — and one of the least reliable. A questionnaire answered by a supplier's sales team produces responses optimised for winning business, not for accuracy. A questionnaire reviewed superficially by a buyer's team produces false assurance from responses nobody critically evaluated. Two organisations, each going through the motion of questionnaire exchange, have conducted process compliance rather than risk management.

Effective due diligence requires method — understanding what each assessment approach can and cannot tell you, combining multiple approaches to triangulate reality, and critically evaluating all evidence before reaching a risk conclusion.

---

## Assessment Method Selection

The appropriate assessment method depends on the supplier's tier, the nature of the relationship, and the resources available. Methods range from self-assessment questionnaires (lowest effort, lowest reliability) to on-site audits (highest effort, highest reliability).

### Method 1: Security Questionnaire

**What it is**: A structured set of questions sent to the supplier, completed by the supplier, and reviewed by the assessing organisation.

**Reliability**: Low-medium. Self-reported; completion quality varies enormously; responses may be optimistic or inaccurate.

**When appropriate**: All tiers (as a starting point); low-tier suppliers (as the primary assessment); high-tier suppliers (as one input among several).

**Questionnaire frameworks:**

*Shared Assessments SIG (Standardised Information Gathering)*: The most comprehensive industry-standard questionnaire framework. Available in full form (hundreds of questions across 18 domains) and lite form (abbreviated). Widely recognised; suppliers may have pre-completed responses available.

*CAIQ (Cloud Security Alliance Consensus Assessment Initiative Questionnaire)*: Specifically designed for cloud service providers. Covers cloud-specific security domains. Many cloud providers maintain current CAIQ responses on the CSA STAR registry (publicly accessible).

*VSAQ (Vendor Security Assessment Questionnaire)*: Shorter, risk-focused questionnaire. Good for lower-tier suppliers and initial screening.

*Custom questionnaire*: Designed for the specific relationship and risk profile. Most relevant but requires development and maintenance effort. Best approach for Critical tier suppliers where the generic questionnaires don't cover the specific risks of the relationship.

**Questionnaire design principles:**

*Scope to the relationship*: Only ask about controls relevant to the specific data, systems, or services involved. A questionnaire asking a payroll processor about physical data centre security is relevant; asking them about secure coding practices may not be (unless they also develop software used by the organisation).

*Binary questions are insufficient for critical controls*: "Do you have a patch management process? Yes/No" tells you nothing about whether patches are applied on time. "What is your SLA for applying critical patches?" followed by "How do you track and verify patch compliance?" provides substantive information.

*Ask for evidence references*: "Where is this control documented?" and "What evidence demonstrates this control is operating?" train the supplier to substantiate responses.

*Progressive depth*: Start with screening questions; follow up with detailed questions for areas where screening responses indicate risk.

**Questionnaire review discipline:**

*Don't accept "yes" without follow-up*: "Yes" responses to critical controls should be followed up: "You've confirmed you conduct quarterly access reviews — please provide the most recent completed access review report for the system you will manage for us."

*Look for inconsistencies*: "All data is encrypted at rest" + "We do not maintain an encryption key management process" → inconsistency; follow up.

*Assess response quality*: Vague responses ("we have appropriate security measures") vs specific responses ("we use AES-256 for data at rest; keys are managed in AWS KMS with quarterly rotation; we have not had any key management incidents in the past 24 months") — the latter is far more useful.

---

### Method 2: Third-Party Certification Evidence

**What it is**: Independent assurance documents produced by a third-party assessor — ISO 27001 certificate, SOC 2 Type I/II report, PCI DSS ROC/AOC, Cyber Essentials Plus certificate.

**Reliability**: Medium-high. More reliable than self-reported questionnaire responses because produced by an independent assessor. Reliability varies by assessment rigour and currency.

**When appropriate**: Critical and High tier suppliers; supplements questionnaire for medium-tier suppliers.

#### Evaluating an ISO 27001 Certificate

**Verify validity:**
- Check the certificate against the certification body's public register (UKAS for UK CBs; national accreditation bodies for other countries)
- Confirm the CB is accredited (not just claiming to issue ISO 27001 certificates)
- Confirm the certificate has not expired
- Check the certificate number and organisation name match

**Evaluate the scope:**
- The certificate specifies what is in scope. "ISO 27001 certified" for a specific office or service line may not cover the systems or services you are purchasing.
- If the supplier's data centre in Ireland is certified but the service you are purchasing is delivered from a data centre in India (not in scope), the certificate provides no assurance for your relationship.

**Ask about surveillance audits:**
- When was the last surveillance audit? Were there any significant findings?
- When is the next surveillance or recertification audit?

**Limitation**: ISO 27001 certification confirms a management system is in place; it does not confirm that specific controls (particularly technical controls) are implemented correctly or that specific vulnerabilities have been addressed.

#### Evaluating a SOC 2 Report

**Report type:**
- SOC 2 Type I: Point-in-time design assessment only. Limited assurance of operational effectiveness.
- SOC 2 Type II: Period-of-time design and operating effectiveness. Substantially stronger assurance.
- For vendor assurance, always request Type II.

**Report period:**
- How old is the report? A report covering the period ending December 2024 reviewed in April 2026 is 16 months old. Significant changes may have occurred. Request current-period reports.

**Scope coverage:**
- Which Trust Services Criteria are included? Security only? Security + Availability + Confidentiality?
- Is the scope of systems covered by the report the same as the systems providing your service?

**Exceptions:**
- Read the "Description of Tests and Results" section for each control. Any exceptions (instances where the control did not operate as described) are documented here.
- Assess the materiality and nature of exceptions: isolated minor exceptions vs systemic control failures.

**CUECs (Complementary User Entity Controls):**
- The report may specify controls the customer must implement for the stated criteria to be met.
- Verify that your organisation implements all CUECs.

**Subservice organisations:**
- The report may use the "carve-out method" for certain subservice organisations (e.g. the cloud infrastructure provider is excluded from scope). For those excluded subservice organisations, you must obtain separate assurance.

#### Evaluating a PCI DSS AOC

**What it confirms**: The supplier achieved PCI DSS compliance for the systems and processes covered in the assessment.

**Verify:**
- AOC is signed by a QSA (not self-assessed, for Level 1 service providers)
- AOC is current (within 12 months for annual compliance)
- The scope of the AOC covers the services relevant to your relationship
- The compliance status is "Compliant" (not "Non-compliant" or "In remediation")

**Request the AOC directly**: Some suppliers provide only a letter confirming they are PCI compliant. For Critical tier suppliers, request the actual AOC document.

---

### Method 3: Supplier Interviews

**What they are**: Structured conversations with the supplier's security team, operations team, or management — to probe specific risk areas, clarify questionnaire responses, and assess the maturity and sophistication of the supplier's security programme.

**Reliability**: Medium. More reliable than unanswered questionnaire responses; less reliable than documented evidence. Provides qualitative insight into security culture and management commitment that questionnaires and certifications cannot capture.

**When appropriate**: Critical tier; when questionnaire responses raise specific concerns; when the relationship involves unique or complex risk.

**Interview approach:**

*Prepare question areas based on the questionnaire review*: The interview should follow up on areas where questionnaire responses were vague, inconsistent, or concerning — not repeat the questionnaire questions.

*Ask about real scenarios*: "Can you describe the last significant security incident you experienced? What happened? How did you respond? What changed as a result?" A supplier that has experienced and learned from incidents demonstrates more maturity than one with no incident history (which may indicate poor detection, not no incidents).

*Ask about their TPRM:* "How do you assess your own critical suppliers? What are your most critical sub-processors and what assurance do you have about their security?" A mature supplier has their own TPRM programme.

*Assess the security culture*: Who participates in the interview? A company that sends only its sales team to a security interview is less mature than one that sends its CISO and security operations lead.

---

### Method 4: On-Site or Remote Technical Assessment

**What it is**: A direct assessment of the supplier's environment — reviewing actual configurations, observing processes, interviewing operational staff, and testing specific controls.

**Reliability**: Very high. The closest equivalent to a first-party audit of the supplier.

**When appropriate**: Critical tier suppliers; suppliers where questionnaire responses or certification evidence indicate significant concerns; new critical relationships where assurance is particularly important; periodic reassessment for the highest-risk relationships.

**Right-to-audit clause**: On-site assessments require a contractual right to audit. This must be included in the contract before the assessment is required — not added after a concern is raised.

**Assessment scope for a supplier technical assessment:**

*System configuration review*: Review configurations of systems used to process or store your data against the supplier's documented standards or applicable CIS benchmarks.

*Access management review*: Who has access to the systems holding your data? Are access reviews conducted? Are privileges appropriate and minimal?

*Network architecture review*: Is your data logically separated from other customers' data? What network controls protect it?

*Incident response review*: Does the supplier have an IR process? Has it been tested? Are they able to detect and contain incidents within reasonable timeframes?

*Physical security review*: For on-premise assessments: access controls to the data centre; physical security of equipment; environmental controls.

*Backup and recovery review*: Is your data backed up? With what frequency? Have backups been tested? What are the RTOs and RPOs?

---

## The Due Diligence Risk Decision

After completing the due diligence assessment, a risk decision must be made: is the supplier's security posture acceptable for this relationship?

### Risk Decision Framework

**Step 1: Identify the key risks for this relationship**
Based on the data accessed, systems connected to, and services provided — what are the most significant risks? (Data breach; operational disruption; regulatory non-compliance; financial fraud)

**Step 2: Assess the supplier's controls against those risks**
For each key risk: does the supplier have adequate controls? Are those controls documented and operating? Is there independent evidence of their effectiveness?

**Step 3: Identify residual risks**
Where the supplier's controls are absent, inadequate, or unverified — these are residual risks that must be treated.

**Step 4: Determine the risk decision**

*Accept*: Supplier's controls are adequate; residual risks are within tolerance; proceed with the relationship as assessed.

*Accept with conditions*: Supplier's controls are substantially adequate but specific gaps exist; proceed with the relationship subject to: specific contractual requirements to address gaps; a timeline for the supplier to remediate findings; enhanced monitoring; and/or compensating controls on the buyer's side.

*Escalate*: Residual risks exceed the assessor's authority to accept; escalate the risk decision to appropriate management level (CISO, risk committee, board) with a clear risk summary.

*Reject*: Supplier's security posture is fundamentally inadequate for the nature of the relationship and the risk cannot be adequately mitigated. The relationship should not proceed as proposed — either the scope must change (reduce access; change the service delivery model) or a different supplier must be selected.

**Document the decision**: Record the risk decision, the assessment inputs, the identified risks, and the rationale. This is evidence for ISO 27001 A.5.19 compliance and for the accountability principle under GDPR.

---

## Assessment Red Flags

Signals during due diligence that warrant deeper scrutiny or may indicate the relationship should be reconsidered:

**Process red flags:**
- Supplier is resistant to completing assessments or providing evidence
- Only sales staff available for security discussions (no access to security team)
- Long delays in questionnaire responses suggesting internal disorganisation
- Refusal to provide contractual right-to-audit

**Questionnaire response red flags:**
- "Yes" answers to all questions without substantive explanation
- Unable to provide evidence for specific critical controls
- Major inconsistencies between responses to related questions
- "N/A" responses for controls that are clearly applicable to the service

**Certification/evidence red flags:**
- ISO 27001 certificate from an unaccredited certification body
- SOC 2 report with multiple significant exceptions in critical controls
- SOC 2 Type I only (no Type II ever produced)
- Certificate/report scope does not cover the relevant systems or services
- Certificate expired; no evidence of current assessment

**Interview red flags:**
- Unable to describe what a recent security incident looked like and how it was handled
- Security is clearly not a board-level priority (CISO has no board access; no security budget transparency)
- No awareness of regulatory requirements relevant to their service
- Evidence of a "box-ticking" compliance culture rather than genuine security management

**History red flags:**
- Previous known data breaches that were not disclosed proactively
- Regulatory enforcement actions related to security or privacy
- History of failing PCI DSS assessments or losing certification

---

## Common Mistakes and Failures

**1. Accepting questionnaire responses without follow-up.**
"Do you encrypt data at rest? Yes." → Accepted without verification. The supplier's database is unencrypted; the "Yes" referred to laptop encryption only. Critical questionnaire responses must be substantiated with evidence.

**2. Reviewing outdated certifications.**
The ISO 27001 certificate shown was valid until March 2024. It is now April 2026. The organisation is not currently certified. Always verify certificate currency against the CB's public register.

**3. Accepting the wrong scope of certification.**
The supplier is ISO 27001 certified — for their UK operations. The service you are purchasing is delivered entirely from their Indian operations (not in scope). The certificate provides no assurance for your relationship.

**4. No decision documentation.**
Assessments conducted; decision made verbally; no record of what was found, what risks were accepted, and why. When the supplier later suffers a breach, there is no evidence that appropriate due diligence was conducted.

**5. Due diligence conducted after contract signing.**
The commercial relationship is in place; data is already flowing; the assessment identifies significant concerns that would have been deal-breakers. The organisation now has leverage over the supplier (the contract exists) but no leverage to require remediation (the supplier is already engaged and has little incentive to invest).

**6. Ignoring sub-processors.**
The supplier's assessment is clean. But the supplier sub-contracts data processing to a third party who sub-contracts to another. The data flows through three parties before it reaches the system actually processing it. Assessment of the prime supplier without visibility of sub-processors leaves a significant blind spot.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Supplier assessment is assessed through Annex A controls A.5.19–A.5.20. Auditors request completed assessments and ask: what assessment method was used? Was independent evidence sought? Was the scope of certifications verified? How was the risk decision documented?

**CISM:**
- Domain 3 (Security Programme) — supplier assessment is a core programme activity. CISMs must be able to design, execute, and manage supplier due diligence processes.

**CRISC:**
- Domain 1 (IT Risk Identification) — supplier assessment is a risk identification mechanism. Domain 2 (IT Risk Assessment) — risk decisions from supplier assessment must be documented and tracked.

**CISSP:**
- Domain 1 (Security and Risk Management) — vendor risk assessment methods, evaluation of third-party certifications, and due diligence processes are examinable.

---

## GUARDIAN's Take

Every organisation that has implemented a serious TPRM programme has discovered the same uncomfortable truth: the gap between what suppliers claim and what they actually do is frequently significant. Not always malicious — often genuinely believing their controls are adequate — but significant in ways that materially affect the risk of the relationship.

The questionnaire exchange without verification creates a false impression of assurance. Two organisations exchanging questions and answers about their security programmes, each believing the other is more secure than they actually are, have conducted compliance theatre rather than risk management.

The discipline that makes due diligence real is the follow-up: "You say you encrypt data at rest. Show me." "You say you conduct quarterly access reviews. Send me the last completed review." "You say you have ISO 27001 certification. What's your certificate number? What's the scope? Is it current on the UKAS register?"

That follow-up discipline converts self-reported compliance claims into evidenced risk assessments. It is the difference between knowing that the supplier filled in the questionnaire and knowing whether the supplier's security is adequate for the risk of the relationship.

The 30 minutes spent verifying a critical supplier's certification currency has prevented data breaches. The assumption that "they said they're certified, so they must be" has enabled them.

Verify. Always.

---
*Module: Module 11 — Third Party and Supply Chain | Guardian Curriculum*
