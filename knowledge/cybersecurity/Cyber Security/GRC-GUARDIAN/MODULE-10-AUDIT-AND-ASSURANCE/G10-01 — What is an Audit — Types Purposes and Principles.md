---
tags: [guardian, grc, module-10, audit, types-of-audit, audit-principles, iso-19011, assurance]
module: 10
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-25
guardian-refs: ["G1-04 — Compliance Explained", "G3-14 — Internal Audit", "G3-15 — Nonconformities", "G10-02 — Audit Planning", "G10-03 — Audit Evidence", "G10-08 — The Auditor Mindset"]
---

# G10-01 — What is an Audit — Types, Purposes, and Principles

> [!abstract] What This Note Covers
> By the end of this note, you will understand the full landscape of audit activity in the GRC context — what an audit is, the different types of audit, the purposes each serves, the seven principles that define professional audit conduct, and how audits fit into the broader assurance ecosystem.

---

## Why This Exists

"Audit" is one of the most overloaded words in GRC. An ISO 27001 internal audit, a PCI DSS QSA assessment, a SOC 2 attestation engagement, an HMRC tax audit, and a penetration test are all called "audits" in some contexts — but they are fundamentally different activities with different purposes, methodologies, and outputs.

Understanding what type of audit is being discussed — and what it can and cannot tell you — is foundational for any GRC professional. Confusing a self-assessment questionnaire with an independent third-party audit, or treating an internal audit as equivalent to a certification body assessment, leads to miscommunication with management, misrepresentation to customers, and unrealistic expectations about assurance levels.

This note establishes the taxonomy of audit activity and the principles that govern all of it.

---

## What Is an Audit?

**ISO 19011:2018** (Guidelines for auditing management systems) defines an audit as:

> *"A systematic, independent, and documented process for obtaining audit evidence and evaluating it objectively to determine the extent to which audit criteria are fulfilled."*

Four words in this definition carry significant weight:

**Systematic**: An audit follows a defined methodology — it is not random or ad hoc. The scope, criteria, evidence collection approach, and reporting format are planned in advance.

**Independent**: The auditor must be free from bias and conflict of interest. An auditor cannot meaningfully audit their own work — independence is the foundation of audit credibility.

**Documented**: Every audit must produce documented evidence of what was examined and what was found. Undocumented audit conclusions have no evidentiary value.

**Objective**: Audit conclusions must be based on evidence, not impression, opinion, or assumption. "It seemed secure" is not an audit conclusion. "Firewall rules were reviewed and found to restrict inbound traffic to defined permitted ports, with all other traffic blocked by a default deny policy" is an audit conclusion.

---

## Audit Types: A Taxonomy

### By Party

**First-Party Audit (Internal Audit)**

An audit conducted by the organisation on itself — the organisation auditing its own management system, processes, or controls.

**Purpose**: Provide the organisation with independent internal assurance about its own compliance, effectiveness, and improvement opportunities. Required by ISO 27001 (Clause 9.2) and ISO 22301 (Clause 9.2).

**Characteristics**: The auditor is an employee or contracted specialist who is independent of the area being audited (but employed by the organisation). The output is an internal audit report for management. The findings drive corrective action and improvement.

**ISO 19011 reference**: The primary use case ISO 19011 was developed to support.

**Example**: The CISO instructs a member of the internal audit function (or a contracted specialist) to audit the access management process against ISO 27001 requirements and the organisation's own access control policy.

---

**Second-Party Audit**

An audit conducted by one organisation on another — typically a customer auditing a supplier.

**Purpose**: Provide the auditing organisation with assurance about a specific supplier's compliance, security posture, or operational practices. Driven by contractual obligations, due diligence requirements, or specific risk concerns.

**Characteristics**: The auditor is an employee or agent of the auditing organisation. The output is a report for the auditing organisation (not the audited organisation). The audited organisation may negotiate scope and has a commercial relationship with the auditor.

**Example**: A bank auditing one of its third-party payment processors to verify that PCI DSS controls are in place. A large enterprise auditing a key software vendor's security practices as part of supplier risk management.

**The right to audit clause**: Second-party audits require a contractual right to audit — the supplier's agreement must include provisions allowing the customer to conduct (or commission) security audits. This is one of the requirements in ISO 27001 A.5.22, GDPR Article 28, and PCI DSS Requirement 12.8.

---

**Third-Party Audit**

An audit conducted by an independent body — neither the organisation itself nor a customer.

**Purpose**: Provide external, independent assurance to multiple stakeholders simultaneously. Because the auditor has no commercial relationship with either the audited organisation or its customers, the assurance is more credible than first or second-party assurance.

**Characteristics**: The auditor is a qualified, accredited professional or organisation independent of the audited entity. The output is a formal report or certificate that can be shared with multiple relying parties. The auditor must meet specific qualification and independence requirements.

**Examples**:
- ISO 27001 certification audit by a UKAS-accredited certification body
- PCI DSS QSA assessment producing a Report on Compliance
- SOC 2 attestation by a licensed CPA firm
- Cyber Essentials Plus technical verification

---

### By Subject Matter

**Information Security Audit**: Assesses the design and effectiveness of information security controls — access management, vulnerability management, incident response, data protection, physical security. The ISO 27001 internal audit is the most common form.

**Financial Audit**: Assesses the accuracy and completeness of financial statements and the effectiveness of internal controls over financial reporting. SOX IT general controls audits sit at the intersection of financial and IT audit.

**Operational Audit**: Assesses the efficiency and effectiveness of operational processes — not just compliance, but whether processes are achieving their intended outcomes at appropriate cost.

**Compliance Audit**: Assesses conformance with specific regulatory requirements, standards, or contractual obligations. PCI DSS assessment, GDPR compliance review, and Cyber Essentials assessment are all compliance audits.

**Performance Audit**: Assesses whether the organisation is achieving its stated objectives — measuring outcomes against targets.

**Forensic Audit**: Conducted in response to suspected fraud, legal proceedings, or regulatory investigations. Applies forensic evidence standards — chain of custody, evidence integrity, admissibility.

**IT General Controls (ITGC) Audit**: Assesses the IT controls that underpin financial reporting systems — access management, change management, operations, backup and recovery. Conducted in the context of SOX Section 404 compliance and financial statement audits.

---

### By Objective

**Compliance audit**: Is the organisation doing what the standard, regulation, or policy requires?

**Effectiveness audit**: Is the control actually working — producing the intended security outcome?

**Maturity assessment**: How mature is the organisation's security capability relative to a defined model (CMMI, COBIT maturity levels, ISO 27001 capability levels)?

**Readiness assessment**: Is the organisation ready for a certification audit, regulatory inspection, or specific compliance deadline?

**Gap assessment**: Where does the current state fall short of the target state, and what must change to close the gap?

---

## The Seven Principles of Auditing (ISO 19011)

ISO 19011:2018 defines seven principles that govern professional audit conduct. These principles are the ethical and methodological foundation of every type of audit.

### Principle 1: Integrity

**Definition**: The foundation of professionalism in auditing — auditors conduct their work with honesty, diligence, and responsibility.

**What this means:**
- Auditors report what they find, not what they (or the auditee) want to find
- Auditors do not yield to pressure to soften or suppress findings
- Auditors acknowledge their own limitations and competence boundaries
- Auditors are transparent about their methodology and approach

**The integrity test**: If a finding would be uncomfortable for the auditee (or for the auditor's continuing relationship with the auditee), an auditor with integrity reports it anyway. An auditor who softens findings to preserve a client relationship has failed the integrity principle.

### Principle 2: Fair Presentation

**Definition**: Audit findings, conclusions, and reports are reported truthfully and accurately.

**What this means:**
- Significant findings are not buried, minimised, or omitted from the report
- Positive findings (controls that work well) are also reported — audits are not purely fault-finding exercises
- The report represents the full picture of what was found
- Audit conclusions are supported by the evidence examined

**The fair presentation test**: Could someone reading the audit report form an accurate understanding of the organisation's security posture? If the report presents a rosier picture than the evidence supports (or a harsher one), it fails fair presentation.

### Principle 3: Due Professional Care

**Definition**: Auditors apply the care and judgment expected of a competent professional in similar circumstances.

**What this means:**
- Auditors are competent to audit the subject matter (cannot audit cryptographic implementation without cryptographic expertise)
- Auditors apply appropriate rigour to evidence collection and evaluation
- Auditors recognise when additional expertise is needed and seek it
- Auditors document their work to professional standards

### Principle 4: Confidentiality

**Definition**: Auditors handle information obtained during the audit with discretion and do not use it for personal advantage or disclose it inappropriately.

**What this means:**
- Audit evidence (which may include sensitive system configurations, vulnerability details, personnel records) is handled securely
- Audit findings are shared only with authorised parties
- Audit working papers are protected from unauthorised access
- The auditor does not use information from the audit for personal benefit (trading on information learned during a financial audit; using vulnerability details to attack the auditee)

### Principle 5: Independence

**Definition**: Audit conclusions are objective and unbiased — the auditor is free from conflicts of interest that could compromise impartiality.

**What independence requires:**
- The auditor has not recently been responsible for the area being audited
- The auditor has no financial interest in the audit outcome
- The auditor is not subject to management pressure from the auditee
- The auditor's remuneration is not contingent on the audit outcome

**The audit independence challenge in ISO 27001**: Internal auditors must be independent of the area they audit — but "internal independence" is inherently limited. An employee who audits their own organisation must navigate the inherent pressure of an employment relationship. ISO 22301 and ISO 27001 both require objectivity and impartiality — which requires at minimum that internal auditors do not audit their own work.

### Principle 6: Evidence-Based Approach

**Definition**: Audit evidence must be verifiable, sufficient, and appropriate before it can form the basis of audit conclusions.

**Evidence criteria:**
- **Verifiable**: Evidence can be independently confirmed — it is not simply the auditee's assertion
- **Sufficient**: Enough evidence has been collected to support the conclusion with confidence
- **Appropriate**: The evidence is relevant to the specific audit criteria being assessed

**What is NOT audit evidence:**
- The auditee saying "yes, we do X" without supporting documentation
- A policy document as evidence of compliance (the policy says what should happen, not that it does happen)
- A single data point as evidence of consistent operation

**What IS audit evidence:**
- System-generated reports showing consistent access log retention for 12 months
- A sample of user accounts with MFA status verified by the auditor through direct system access
- Firewall configurations reviewed in situ by the auditor (not a screenshot provided by the auditee)

### Principle 7: Risk-Based Approach

**Definition**: Audit activities are planned and prioritised based on risk — focusing audit effort where failures would have the greatest impact.

**What this means in practice:**
- Higher-risk areas receive more audit attention (more time, larger samples, more rigorous testing)
- Lower-risk areas receive proportionate attention (smaller samples, lighter touch)
- The audit programme for the year allocates resources based on risk, not tradition or convenience
- Sampling sizes are increased where preliminary evidence suggests control weakness

---

## The Assurance Landscape: How Audits Fit In

Audits are one component of an organisation's assurance ecosystem. Understanding how they relate to other assurance activities clarifies their role:

**The Three Lines Model** (updated 2020, Institute of Internal Auditors):

**First Line**: Management controls — the operational controls and management activities that prevent or detect risk. Access controls, monitoring, vulnerability management. Management is responsible for operating these.

**Second Line**: Risk and compliance functions — the oversight functions that monitor first-line controls, provide guidance, and challenge management. The CISO function, the risk management team, the compliance function. Not independent of management but provides oversight.

**Third Line**: Internal audit — the independent assurance function that evaluates the governance, risk management, and control environment. Reports to the board or audit committee; independent of both first and second lines.

**External audit** (certification bodies, QSAs, CPA firms): Independent of the organisation entirely. Provides assurance to external stakeholders (customers, regulators, investors) that the organisation's management system or financial statements meet specified criteria.

The assurance landscape for a mature organisation:

| Assurance source | Independence | Audience | Output |
|---|---|---|---|
| Management self-assessment | Low (self-reported) | Internal | Management assertion |
| Second-line (CISO/compliance review) | Medium (part of management) | Board, management | Internal management report |
| Third-line (internal audit) | High (independent of management) | Board / audit committee | Internal audit report |
| External certification body (ISO 27001 CB) | Very high (independent organisation) | Customers, regulators | Certificate + audit report |
| QSA (PCI DSS) | Very high (independent organisation) | Card brands, acquirers | ROC + AOC |
| SOC 2 auditor (CPA firm) | Very high (licensed independent) | Enterprise customers | Type I or Type II report |

Each source of assurance is valuable for different purposes and to different audiences. A management self-assessment is the fastest and cheapest; an ISO 27001 certification audit is the most credible for external stakeholders.

---

## Audit vs Assessment vs Review: Terminology

These terms are used inconsistently in the industry. For clarity:

**Audit**: Formal, structured, evidence-based assessment against defined criteria (standard, regulation, policy). Produces a documented finding. ISO 27001 internal audit is an audit; PCI DSS QSA is an audit.

**Assessment**: Systematic evaluation that may or may not be against defined criteria. May be risk-based (risk assessment), maturity-based (maturity assessment), or gap-based (gap assessment). May not produce formal findings in the audit sense. A penetration test is sometimes called an assessment.

**Review**: Less formal evaluation — typically involving a read-through and judgment of a specific document, process, or activity. A policy review is a review; a code review is a review. Reviews do not typically follow the full audit methodology.

**The overlap**: "Security assessment" is sometimes used as a synonym for "security audit." In formal contexts (ISO 19011, ISO 27001, PCI DSS), "audit" has the specific meaning described above. In less formal contexts, "assessment" and "audit" are often used interchangeably.

---

## Audit Quality Indicators

Not all audits are equal in quality. Indicators of a high-quality audit:

**Clear scope**: What is being audited, against what criteria, covering what time period?

**Independent auditor**: No conflicts of interest; appropriate competence for the subject matter.

**Adequate evidence**: Findings are supported by specific, verifiable evidence — not assertions.

**Proportionate depth**: Significant risk areas received more intensive testing.

**Accurate finding classification**: Findings are classified correctly (major/minor/observation) without inflation or deflation.

**Actionable findings**: Findings are specific enough that the auditee knows exactly what must be remediated.

**Fair representation**: The report presents both strengths and weaknesses — not a cherry-picked positive narrative, nor an unnecessarily harsh assessment.

**Timely delivery**: The audit report is delivered while findings are still current and actionable.

---

## Common Mistakes and Failures

**1. Treating self-assessment as independent audit.**
An organisation completes a PCI DSS SAQ and presents this to enterprise customers as evidence of "PCI DSS audit compliance." A self-assessment questionnaire is a self-reported compliance assertion — not an independent audit. The distinction matters for assurance reliance.

**2. Internal auditor auditing their own work.**
The IT Manager who implemented the access control system conducting the internal audit of the access control process. The findings will be systematically less rigorous — consciously or unconsciously, people are less likely to find fault with their own work.

**3. Audit scope so narrow it misses systemic issues.**
An audit of the firewall configuration that confirms the rules are correct, without examining whether the segmentation those rules create is adequate for the scope claimed in the SoA. A technically correct audit that misses the broader context.

**4. Findings without evidence.**
"Access reviews are not being conducted" — without specifying which access reviews, for what period, and what evidence of non-execution was examined. Unsupported findings are challenged; findings with evidence are hard to dispute.

**5. Confusing compliance with security.**
An audit that confirms compliance with ISO 27001 requirements but does not assess whether the controls actually provide adequate security. Compliance with the standard is necessary but not sufficient for genuine security. The most important internal audits challenge both.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- The entire Lead Auditor qualification is built on understanding audit types, purposes, and principles. The seven ISO 19011 principles are specifically examinable — know each principle, what it means in practice, and how it affects audit conduct. Classification of audit types (first/second/third party) is frequently tested.

**CISM:**
- Domain 3 (Security Programme) includes audit and assurance as key programme elements. CISMs must understand the role of internal audit, external certification, and second-party supplier audits within the security assurance framework.

**CRISC:**
- Domain 4 (Risk and Control Monitoring) — audit is one of the primary mechanisms for verifying that controls are operating effectively. CRISC candidates must understand how audit results feed back into the risk register and control effectiveness assessments.

**CISSP:**
- Domain 6 (Security Assessment and Testing) covers audit types and testing methodologies. Know the party classification (first/second/third), the evidence criteria (sufficient/appropriate/verifiable), and the audit principles.

---

## GUARDIAN's Take

The word "audit" carries authority — the suggestion that something has been independently verified and can be relied upon. That authority is only earned when the audit meets the criteria that make it credible: independence, evidence-based conclusions, systematic methodology, professional competence.

An audit that lacks independence is an opinion disguised as assurance. An audit that lacks evidence is an assertion with a formal wrapper. An audit that lacks professional competence in the subject matter is a checklist exercise that misses what matters.

The seven principles exist precisely because audit authority can be — and frequently is — abused or misused. The ISO 27001 Lead Auditor qualification exists to ensure that the auditors who assess compliance against the standard actually have the competence and discipline to apply those principles.

For GRC professionals who are not auditors: understanding audit principles makes you a better recipient of audit findings, a better preparer for audits, and a better evaluator of the audit reports you receive from third parties. When you read a SOC 2 report, understanding the principles helps you assess whether the auditor actually looked at what matters or just confirmed what the organisation told them. When you read a QSA's ROC, it helps you distinguish a rigorous assessment from a superficial one.

Audit is a professional discipline. Take its principles seriously.

---
*Module: Module 10 — Audit and Assurance | Guardian Curriculum*
