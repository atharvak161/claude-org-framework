---
tags: [guardian, grc, module-6, pci-dss, qsa, qualified-security-assessor, roc, assessment, audit]
module: 6
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-19
guardian-refs: ["G6-01 — What is PCI DSS and Who Must Comply", "G6-02 — The 12 PCI DSS Requirements", "G6-03 — Merchant Levels and SAQ Types", "G6-04 — Cardholder Data Environment — CDE Scoping", "G6-05 — Network Segmentation and Scope Reduction"]
---

# G6-06 — The QSA — Qualified Security Assessor

> [!abstract] What This Note Covers
> By the end of this note, you will understand what a Qualified Security Assessor is, how QSAs are qualified and governed, what the QSA assessment process involves, what a Report on Compliance contains, how to select and work with a QSA effectively, and how the QSA role differs from the ISO 27001 Lead Auditor role.

---

## Why This Exists

The Qualified Security Assessor is the primary independent assessor in the PCI DSS ecosystem — the equivalent of the certification body auditor in ISO 27001. For Level 1 merchants and Level 1 service providers, a QSA assessment is mandatory. The ROC (Report on Compliance) the QSA produces is the compliance evidence submitted to the acquirer and card brands.

Unlike ISO 27001, where the certification body issues a formal certificate, PCI DSS does not produce a "PCI DSS certificate." The AOC (Attestation of Compliance) signed by the QSA and the organisation's executive is the equivalent compliance document. Understanding the QSA's role, obligations, and assessment methodology is essential for any organisation preparing for a Level 1 assessment — and for GRC professionals who may need to select, manage, or be assessed by a QSA.

---

## What a QSA Is

**Qualified Security Assessors (QSAs)** are companies and individuals that have been qualified by the PCI Security Standards Council to conduct PCI DSS on-site assessments and produce Reports on Compliance.

The PCI SSC maintains two registers:
- **QSA Companies**: Organisations qualified to employ QSA Employees and conduct PCI DSS assessments
- **QSA Employees**: Individuals within QSA Companies who have passed the QSA qualification requirements

**What QSAs can do**:
- Conduct on-site assessments of merchants and service providers
- Produce Reports on Compliance (ROC)
- Sign Attestations of Compliance (AOC) for Level 1 assessments
- Conduct gap assessments and readiness assessments
- Provide consulting and advisory services on PCI DSS compliance

**What QSAs cannot do**:
- Certify an organisation as "PCI DSS certified" — there is no such certification
- Guarantee that a compliant organisation will not be breached
- Assess compliance for card brands or acquirers — they report to the assessed entity
- Override card brand requirements or acquirer requirements

---

## QSA Qualification Requirements

### QSA Company Requirements

To become a QSA Company, an organisation must:
- Have a minimum number of QSA Employees (typically 3+)
- Demonstrate experience in information security and payment security
- Carry professional liability (errors and omissions) insurance
- Have no conflicts of interest that would compromise assessment independence
- Pass a PCI SSC qualification process including review of business practices and quality assurance procedures
- Agree to the PCI SSC QSA Agreement
- Undergo annual re-qualification

### QSA Employee Requirements

To become a QSA Employee, an individual must:
- Work for a qualified QSA Company
- Have relevant professional certifications (CISSP, CISA, CISM, CEH, or equivalent — at least one active security certification required)
- Pass the PCI SSC QSA Qualification training course
- Pass the QSA qualification exam administered by the PCI SSC
- Maintain qualifications through annual retraining and re-examination
- Have experience in information security and network security assessment

**Annual re-qualification**: QSA Employees must pass an annual retraining and re-examination to maintain their qualification. This ensures QSAs stay current with new versions of PCI DSS, emerging threats, and updated assessment methodologies.

### Independence Requirements

QSAs must be independent of the organisations they assess:
- A QSA cannot assess an organisation for which they provided significant consulting services that determined how the controls were implemented (a conflict of interest — you cannot assess what you built)
- The same individual QSA Employee should not assess the same organisation in consecutive years (rotation promotes fresh perspective)
- QSA Companies must have quality assurance processes to ensure assessment quality and independence

**The consulting-assessment tension**: Many QSA Companies provide both consulting services (helping organisations prepare for assessment) and assessment services. This is permitted if managed appropriately — the individual QSA conducting the final assessment should not be the same person who provided consulting that determined control design. Some organisations separate these services entirely, using one firm for consulting and a different QSA for the formal assessment.

---

## The ISA: Internal Security Assessor

For Level 1 merchants (specifically), the card brands allow an alternative to a QSA-conducted ROC: an assessment led by an **Internal Security Assessor (ISA)**.

**What ISAs are**: Employees of a Level 1 merchant who have been trained and certified by the PCI SSC to conduct internal PCI DSS assessments.

**ISA qualification**: Similar to QSA Employee requirements — active security certification, PCI SSC training, and annual exam.

**ISA scope**: ISAs conduct internal assessments and may produce a ROC for their employer. Unlike QSAs, they can only assess their own employer — they are not independent third parties.

**Card brand requirements for ISA-led assessments**: Not all card brands accept ISA-led assessments equally. Visa and Mastercard allow ISA-led ROCs for their own Level 1 merchant programme; other card brands may still require a QSA. Always confirm with the acquirer whether an ISA-led assessment will satisfy their requirements before proceeding.

**The independence challenge**: An ISA assessing their own organisation faces inherent independence limitations — they are an employee assessing their employer. The PCI SSC addresses this through requirements for an independent QSA review of the ISA-produced ROC (in some card brand programmes), and through the ISA's obligation to report accurately regardless of organisational pressure.

---

## The QSA Assessment Process

### Phase 1: Pre-Assessment (Scoping and Planning)

Before fieldwork begins, the QSA and the assessed organisation must agree on:

**Scope definition**: Which systems, networks, and processes are in scope for the assessment? The QSA reviews the organisation's network diagrams, data flow diagrams, and CDE scope documentation to confirm scope. Scope disagreements are resolved in this phase — it is significantly more disruptive to discover scope disagreements mid-assessment.

**Evidence requirements**: The QSA provides a list of documentation, records, and evidence they will request. Organising this evidence before the assessment begins saves significant time during fieldwork.

**Assessment schedule**: The timeline for interviews, walkthroughs, and evidence review. For complex assessments, this may span weeks.

**Assessment methodology**: The PCI SSC publishes a Reporting Template for PCI DSS assessments that defines the specific testing procedures QSAs must follow for each requirement. The QSA must follow this methodology — they cannot substitute their own approach.

**Rules of Engagement**: Unlike penetration testing (which has explicit ROE), QSA assessments have defined methodologies. However, agreements about access, interview scheduling, system demonstrations, and on-site logistics should be established in advance.

### Phase 2: Fieldwork — Evidence Collection and Testing

The QSA collects evidence and tests controls using the PCI DSS Testing Procedures defined in the standard for each requirement.

**Testing methods used by QSAs:**

**Document review**: Reviewing policies, procedures, configurations, and records.
- Information security policy
- Network diagrams and data flow diagrams
- System configurations (firewall rules, server hardening configurations)
- Access control lists and user access reviews
- Training records and awareness programme documentation
- Change management records
- Incident response plan and test records
- Vendor agreements and compliance documentation

**Interviews**: Structured interviews with personnel responsible for each requirement area.
- CISO or security lead — overall security programme
- IT operations — system management, patching, access management
- Network engineers — firewall management, network architecture
- Application developers — secure development practices
- HR — screening, training, onboarding/offboarding
- Finance/management — executive awareness, risk management

**Observation**: The QSA observes processes in operation.
- Physical access controls (door entry, visitor management)
- Clear desk compliance
- Point-of-interaction device security (checking for tampering)
- Security awareness behaviours during office walkthrough

**Technical testing**: The QSA technically validates controls.
- Reviewing firewall rule sets and validating against documented rules
- Confirming TLS configuration on payment-facing systems
- Verifying anti-malware is deployed and current
- Reviewing log configurations and confirming logs are being collected
- Confirming account configurations (unique IDs, password settings, MFA)

**Sampling**: For requirements covering large populations (users, systems), QSAs sample a representative subset.
- Sample of user accounts: verify MFA enrollment, unique IDs, appropriate access levels
- Sample of system components: verify secure configuration, patch status, anti-malware
- Sample of access reviews: verify reviews were conducted on schedule with documented outcomes
- Sample of change records: verify security review included in change process

### Phase 3: Finding Classification and Report Production

As evidence is collected, the QSA classifies findings:

**In Place**: The requirement is met with adequate evidence.

**Not In Place**: The requirement is not met — a clear compliance gap.

**Not Applicable**: The requirement does not apply to this environment (with documented justification).

**Not Tested**: The requirement was not assessed in this assessment cycle (used in multi-year rolling assessment programmes).

**Compensating Controls**: Where the exact requirement cannot be met due to legitimate technical or business constraints, a compensating control may be accepted if it provides an equivalent level of protection. Compensating controls require additional documentation and QSA assessment — they are not shortcuts.

The QSA documents all findings in the **Report on Compliance (ROC)**.

### Phase 4: The Report on Compliance (ROC)

The ROC is the formal output of the QSA assessment. It is a comprehensive document — typically hundreds of pages for complex environments — that documents:

**Executive Summary**: High-level summary of the assessment, scope, and overall compliance status.

**Assessment Information**: QSA company details, assessed organisation details, assessment dates, scope description.

**For each PCI DSS requirement and sub-requirement**:
- The specific requirement text
- The testing procedures followed
- The QSA's finding (In Place / Not In Place / Not Applicable)
- Evidence supporting the finding
- Compensating controls (where applicable)

**Compensating Control Worksheets**: Detailed documentation of any compensating controls accepted, including the constraint preventing the standard requirement from being met, the compensating control implemented, and the QSA's assessment of equivalence.

**Executive Attestation**: A signed statement from the assessed organisation's executive confirming the accuracy of the ROC.

**QSA Attestation**: A signed statement from the QSA Employee confirming the accuracy and completeness of the assessment.

### Phase 5: Attestation of Compliance (AOC)

The AOC is a separate, shorter document that is the formal compliance attestation. It is the document most frequently requested by acquirers, card brands, and business partners.

**AOC contents**:
- Organisation details
- Assessment scope summary
- Overall compliance status (Compliant / Non-Compliant)
- QSA company and employee details
- Signed attestations from both the organisation and the QSA

**The AOC for non-compliant organisations**: If the assessment finds gaps, the AOC reflects the non-compliant status. The organisation and QSA must document the specific gaps and the remediation plan.

---

## The Customised Approach (PCI DSS v4.0)

PCI DSS v4.0 introduced a significant innovation: the **Customised Approach**. Under this approach, an organisation can implement controls that achieve the same security objective as a defined requirement through different means — as long as the approach is rigorously documented and independently validated.

**When the Customised Approach applies**: Mature organisations with sophisticated security programmes that may not align precisely with prescriptive PCI requirements. For example, an organisation with a zero-trust network architecture may not implement traditional network segmentation as described in Requirement 1 — but may achieve the same objective through identity-based access controls.

**QSA's role in Customised Approach assessments**: The QSA must assess whether the customised control achieves the stated objective of the relevant requirement. This requires significant QSA judgment and expertise — and significantly more documentation from the organisation.

**Customised Approach Controls Documentation**: The organisation must produce a Controls Matrix documenting: the objective of the PCI DSS requirement, the customised control implemented, how it achieves the objective, evidence of effectiveness, and QSA validation.

**Who should use the Customised Approach**: Organisations with genuinely mature security programmes that have strong reasons to deviate from the defined approach. It is not a shortcut — it is typically more work than the defined approach because of the additional documentation and validation requirements.

---

## Selecting a QSA: Practical Guidance

Not all QSA Companies are equal in expertise, methodology, and sector experience. Selecting the right QSA is as important as selecting the right certification body for ISO 27001.

**Key selection criteria:**

**Sector experience**: Has the QSA assessed organisations in your sector (retail, hospitality, healthcare, e-commerce, financial services)? Payment environments vary significantly by sector — a QSA experienced in your sector understands the specific technologies and risks you face.

**Technical depth**: Does the QSA have employees with genuine technical depth in network security, application security, and cloud security? PCI DSS assessments require technical expertise, not just familiarity with the questionnaire.

**Methodology transparency**: Can the QSA explain how they conduct assessments, what testing they perform, how they sample, and how they document findings? Opaque methodology is a warning sign.

**References and reputation**: Can the QSA provide references from assessed organisations? Is their reputation in the industry positive? The PCI SSC does not maintain public ratings of QSAs — industry reputation matters.

**Report quality**: Ask to see a redacted sample ROC from a previous assessment. The report should be specific, evidenced, and substantive — not generic text that could apply to any organisation.

**Independence**: Has the QSA provided consulting services that would create a conflict with the assessment? If so, how is that conflict managed?

**Relationship approach**: Is the QSA adversarial ("we're here to find problems") or collaborative ("we're here to assess compliance accurately")? The best QSAs are rigorous but constructive — identifying genuine gaps clearly while helping organisations understand how to address them.

---

## Working with a QSA: Making the Assessment Effective

**Before the assessment:**
- Complete a gap assessment or readiness review (can be conducted by a different firm or internally by an ISA)
- Address known gaps before the formal assessment where possible
- Organise evidence according to the requirements structure
- Ensure key personnel are available for interviews on the scheduled dates
- Provide accurate scope documentation (network diagrams, data flow diagrams)

**During the assessment:**
- Be transparent and cooperative — withholding information from a QSA is counterproductive and potentially creates liability if a breach later reveals gaps that were not disclosed
- Provide accurate, complete evidence — do not fabricate or manipulate records
- If the QSA identifies a finding, understand exactly what the gap is before concluding the assessment — ambiguous findings are harder to remediate
- Keep a record of all evidence provided (what was provided, to whom, on what date)

**After the assessment:**
- Address all findings promptly — if you receive a non-compliant ROC, a remediation plan is required
- Confirm that the ROC and AOC are filed with your acquirer within the required timeframe
- Use the ROC findings to drive genuine security improvement, not just compliance paperwork

---

## How the QSA Role Differs from the ISO 27001 Lead Auditor

| Dimension | QSA | ISO 27001 Lead Auditor |
|---|---|---|
| **Standard** | PCI DSS v4.0 (prescriptive requirements) | ISO/IEC 27001:2022 (risk-based framework) |
| **Certification** | No formal certificate — AOC is the output | Certificate issued by the CB, 3-year validity |
| **Assessment output** | Report on Compliance (ROC) + Attestation of Compliance (AOC) | Audit report + Certificate (if no major NCs) |
| **Finding classification** | In Place / Not In Place / Not Applicable / Compensating Control | Major NC / Minor NC / Observation |
| **Assessment methodology** | Defined Testing Procedures published by PCI SSC — must be followed | ISO 19011 principles; auditor designs their methodology within the framework |
| **Risk-based approach** | Prescriptive — specific requirements that must be met | Risk-based — controls selected based on risk assessment |
| **QSA qualification** | PCI SSC qualification + annual re-exam | ISO 27001 Lead Auditor qualification (PECB, BSI, etc.) |
| **Scope** | CDE — systems that store, process, or transmit CHD | ISMS scope — defined by the organisation |
| **Independence** | Required — QSA cannot assess what they built | Required — Clause 9.2 independence principle |
| **Frequency** | Annual (+ quarterly scans) | Annual (surveillance) + 3-year recertification cycle |

---

## Common Mistakes and Failures

**1. Not engaging the QSA early enough.**
Selecting a QSA two weeks before the assessment deadline. The QSA needs time to review scope, plan the assessment, and communicate evidence requirements. Engage the QSA at least 8–12 weeks before the planned assessment start date.

**2. Fabricating or manipulating evidence.**
Providing the QSA with evidence that has been created specifically for the assessment rather than generated from genuine operational processes. QSAs are experienced at identifying evidence that does not reflect operational reality — timestamps, metadata, inconsistencies in process records.

**3. Not disclosing known gaps.**
Hoping the QSA will not find a known compliance gap. If the gap is found, the assessment is non-compliant. If the gap is not found but later contributes to a breach, the concealment significantly worsens the organisation's legal and regulatory position.

**4. Treating the QSA as an adversary.**
The QSA is an independent assessor, not an adversary. An adversarial approach to the assessment — withholding access, providing minimal information, challenging every finding — produces a more difficult and less useful assessment. Transparency and cooperation produce a more accurate, more useful assessment.

**5. Selecting the cheapest QSA without assessing quality.**
QSA fees vary significantly. The cheapest QSA may use a superficial assessment methodology that misses real gaps — providing the form of compliance without the substance. The most expensive QSA may not provide proportionate value. Assess quality, not just price.

**6. Not addressing findings before submitting the AOC.**
The AOC represents the current compliance status. If findings are identified during the assessment, they must be remediated before a compliant AOC can be signed. A compliant AOC with known unaddressed gaps is a false attestation — with contractual and potentially legal consequences.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- The QSA role and the Lead Auditor role share common principles (independence, evidence-based assessment, finding documentation) but have distinct methodologies and outputs. Understanding both is valuable for GRC professionals working in environments with dual compliance requirements.
- The ROC and AOC are PCI DSS-specific outputs that have no direct ISO 27001 equivalent — the ISO 27001 equivalent is the certification audit report and the certificate.

**CISM:**
- Domain 3 (Security Programme) — managing the QSA relationship and the annual PCI DSS assessment is a programme management activity. CISOs at merchant organisations must understand the QSA process sufficiently to prepare the organisation effectively.

**CISSP:**
- Domain 6 (Security Assessment and Testing) covers third-party assessment methodologies. The QSA assessment is the primary third-party assessment mechanism in the payment card security space.

---

## GUARDIAN's Take

The QSA relationship, when it works well, is one of the most valuable independent assurance mechanisms available to a payment organisation. A skilled, experienced QSA doesn't just assess compliance — they bring perspective from dozens of similar assessments, identifying patterns of weakness, sharing what other organisations are doing well, and providing insight that an internal programme cannot generate for itself.

The organisations that get the most value from their QSA relationship are the ones that treat the assessment as a genuine assurance mechanism — not a compliance hurdle. They engage the QSA openly, disclose concerns honestly, and use the findings to drive genuine improvement. They ask the QSA "what do you see in other organisations at our maturity level that we should consider?" rather than "what's the minimum we need to do to get the AOC signed?"

The organisations that get the least value are the ones that treat the QSA as an auditor to be managed — providing minimum information, challenging every finding, and treating compliance as the goal rather than security as the goal. These organisations may achieve a compliant AOC while remaining fundamentally insecure — because their compliance programme is optimised to satisfy a QSA, not to protect cardholder data.

Choose your QSA carefully. Engage them honestly. Use their findings to improve. That is how the QSA assessment provides its full value — not just compliance documentation, but genuine assurance that the security programme is working.

---
*Module: Module 6 — PCI DSS | Guardian Curriculum*
