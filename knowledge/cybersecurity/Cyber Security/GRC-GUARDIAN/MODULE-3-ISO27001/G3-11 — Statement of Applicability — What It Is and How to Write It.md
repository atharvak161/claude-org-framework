---
tags: [guardian, grc, module-3, iso27001, soa, statement-of-applicability, controls, risk-treatment]
module: 3
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G3-05 — ISO 27001 Clause 6 — Planning", "G3-10 — Annex A Controls — Complete Reference 2022", "G3-12 — Gap Assessment", "G3-13 — The Certification Journey", "G3-15 — Nonconformities"]
---

# G3-11 — Statement of Applicability — What It Is and How to Write It

> [!abstract] What This Note Covers
> By the end of this note, you will understand exactly what the Statement of Applicability is, why it is mandatory, what every column must contain, how to construct it from a risk assessment, how to justify exclusions credibly, and what auditors look for when they review it.

---

## Why This Exists

The Statement of Applicability (SoA) is one of the most audited and most misunderstood documents in ISO 27001. Every organisation seeking certification must produce one. Many produce one that satisfies the form of the requirement while failing its substance.

The SoA is not a compliance checklist. It is not a spreadsheet where you tick 93 boxes. It is the formal record of the organisation's risk-based control selection decisions — the document that answers: given our specific risks, our specific context, and our specific obligations, which of the 93 Annex A controls do we need, which are we implementing, and why are we excluding the others?

Done well, the SoA is the backbone of the ISMS — the document that connects risk assessment to control implementation, control implementation to audit evidence, and the entire risk management programme to the standard's requirements. Auditors use it as the primary navigation tool for the Stage 2 audit: they will trace every control to a risk, test every claimed implementation, and probe every exclusion.

Done poorly, the SoA is a template with 93 rows filled in by someone who never read the risk register.

This note teaches you to do it well.

---

## What the SoA Is and Why It Is Mandatory

### Definition

The **Statement of Applicability** is a mandatory document required by ISO 27001 Clause 6.1.3(d). It must contain:

> *"the necessary controls (see 6.1.3(b) and 6.1.3(c)); justification for inclusions, whether the controls are implemented or not; and justification for exclusions of Annex A controls."*

In plain language, the SoA is a document that, for each of the 93 Annex A controls, states:
1. Is this control applicable to the organisation? (Yes or No)
2. Why is it applicable (or not)?
3. Is it currently implemented?
4. If not yet implemented, when will it be?

### Why It Exists

The SoA serves three interconnected purposes:

**Purpose 1 — Traceability**: It creates a traceable link between the risk assessment (which identifies risks and determines treatment) and the control implementation (which executes that treatment). The chain: risk → treatment decision → control → SoA entry → evidence of implementation.

**Purpose 2 — Completeness check**: Clause 6.1.3(c) requires the organisation to compare its selected controls against Annex A to verify that no necessary controls have been omitted. The SoA is the mechanism for this check — by requiring the organisation to explicitly address all 93 controls, it prevents important controls from being overlooked.

**Purpose 3 — Accountability**: The SoA is a formal record of conscious decisions. Every inclusion is justified. Every exclusion is justified. This prevents the casual omission of controls that are difficult to implement, and creates an auditable record of the organisation's control selection rationale.

---

## The SoA Structure: Every Column Explained

A complete SoA has the following columns for each of the 93 Annex A controls (plus any additional controls beyond Annex A):

### Column 1: Control Reference
The ISO 27001:2022 Annex A control number: A.5.1 through A.8.34. Must be current — if transitioning from ISO 27001:2013, the control references have changed significantly.

### Column 2: Control Name
The name of the control exactly as stated in ISO 27001:2022 Annex A. Do not paraphrase or abbreviate — the exact name enables unambiguous mapping.

### Column 3: Applicable? (Yes/No)
A binary decision: is this control relevant to the organisation's ISMS?

**Applicable**: The organisation has identified risks, obligations, or requirements that this control addresses. The vast majority of controls will be applicable for most organisations.

**Not applicable**: The organisation can demonstrate that no identified risk, regulatory obligation, contractual requirement, or business need requires this control. Exclusions must be the exception, not the rule.

### Column 4: Justification for Inclusion
For each applicable control: *why* is it applicable? The justification must connect the control to:
- A specific risk in the risk register (reference the risk ID), OR
- A regulatory or contractual obligation (reference the specific requirement), OR
- Both

**Poor justification**: "Information security best practice."
This is not a justification — it does not explain why *this* organisation needs *this* control.

**Good justification**: "Required to address RISK-017 (External attacker exploiting absence of MFA to compromise user accounts) and RISK-023 (Credential stuffing attack on customer portal). Also required for PCI DSS Requirement 8.4."

The justification column is what separates a genuine risk-based SoA from a compliance template. If every control has the same generic justification, the SoA is not risk-based.

### Column 5: Justification for Exclusion
For each non-applicable control: *why* is the organisation excluding it?

Valid exclusion justifications fall into four categories:

**Category A — No relevant risk exists**: The threat addressed by this control does not apply to the organisation's context. Example: "A.7.4 (Physical security monitoring) — excluded because the organisation has no physical premises; all operations are conducted from rented serviced office space with security provided by the building owner under contract."

**Category B — Activity does not exist**: The control applies to an activity the organisation does not perform. Example: "A.8.25 (Secure development life cycle) — excluded because the organisation does not develop software; all applications are procured from third-party vendors."

**Category C — Risk fully addressed by other means**: The control's objective is achieved by a different control or approach. Example: "A.8.23 (Web filtering) — while web filtering is not implemented as a standalone tool, outbound traffic is controlled through the firewall policy (A.8.20) which restricts access to known-malicious categories. Combined with the malware protection control (A.8.7) and security awareness training (A.6.3), the risk is adequately managed."

**Category D — Contractually excluded**: The control is addressed by a supplier under a documented contractual arrangement, and the organisation has verified the supplier's implementation. This must be carefully justified — regulatory accountability cannot be fully transferred.

**Invalid exclusion justifications:**
- "We don't have the budget for this" — cost is not a valid exclusion reason; it is a risk acceptance justification
- "This is too complex to implement" — complexity is not a valid exclusion reason
- "We haven't got around to it yet" — this is a control not yet implemented, not an excluded control; it should appear as "Not Applicable: No" but remain in the SoA with an implementation timeline
- "It's covered by our IT team" — this is not a justification for exclusion; the control may still be applicable

### Column 6: Implemented? (Yes/Partially/No)
The current implementation status:

**Yes**: The control is fully implemented and operating as intended. Evidence is available.

**Partially**: The control is implemented but not yet complete — for example, MFA is deployed for staff accounts but not yet for service accounts; the implementation is in progress.

**No**: The control has not yet been implemented. If the control is applicable, a "No" entry must be accompanied by a planned implementation date (and ideally a reference to the treatment plan action that will implement it).

A "No" against an applicable control is not automatically a nonconformity — it is acceptable at the start of an ISMS programme if there is an active treatment plan with a realistic timeline. However, persistent "No" entries against applicable controls at surveillance audits, without treatment progress, will become nonconformities.

### Column 7: Implementation Evidence Reference
Where can evidence of implementation be found? This might be:
- A specific policy document (with version number)
- A system configuration location (e.g. "Azure AD MFA settings — screenshot in evidence folder")
- A specific procedure document
- A report (e.g. "Monthly vulnerability scan report — stored in /ISMS/Evidence/Vulnerability/")
- An external certification (e.g. "ISO 27001 certificate from cloud provider [Company Name]")

This column is the bridge between the SoA and the evidence base. Auditors use it to navigate directly to the evidence for each control.

### Column 8: Risk Register Reference
The risk ID(s) from the risk register that this control addresses. Creates the traceability chain from control to risk.

**Example**: "RISK-017, RISK-023, RISK-031"

This column is sometimes omitted from SoA templates — this is a mistake. Without explicit risk register references, the traceability between risk assessment and control selection cannot be demonstrated.

### Column 9: Additional Controls (Beyond Annex A)
The SoA must also list any controls the organisation has implemented that are not in Annex A — controls identified through the risk assessment that go beyond the standard reference set.

Examples of additional controls beyond Annex A:
- Cloud-specific security controls (cloud configuration management tools, cloud security posture management)
- Sector-specific controls (PCI DSS-required controls beyond Annex A coverage)
- Organisation-specific controls (proprietary security tooling, bespoke processes)

These additional controls must also be included in the SoA with inclusion justification and implementation status.

---

## How to Write the SoA: Step-by-Step

### Step 1: Complete the Risk Assessment First

The SoA cannot be written without a completed risk assessment. The risk assessment identifies risks; the treatment process selects controls to address those risks; the SoA records those control selection decisions. Attempting to write the SoA before the risk assessment is complete inverts the process.

### Step 2: Build the Control-to-Risk Mapping

For each identified risk with a "Mitigate" treatment decision, list the specific controls that will address it. One risk may require multiple controls. One control may address multiple risks.

**Example mapping:**

| Risk ID | Risk description | Controls selected |
|---|---|---|
| RISK-017 | External attacker exploits absence of MFA on VPN | A.5.15, A.5.17, A.8.2, A.8.5 |
| RISK-023 | Credential stuffing on customer portal | A.8.5, A.8.16, A.8.20 |
| RISK-031 | Insider exfiltration of customer data | A.5.3, A.5.15, A.8.12, A.8.15 |

### Step 3: Work Through All 93 Annex A Controls

For each control, answer three questions:
1. Does any identified risk require this control?
2. Does any regulatory or contractual obligation require this control?
3. Is there any other business reason this control is needed?

If yes to any: the control is applicable. Document the justification with specific references.
If no to all: the control may be excluded. Document the exclusion justification.

### Step 4: Check for Additional Controls

Review the risk treatment plan for any controls identified that are not in Annex A. Add these to the SoA.

### Step 5: Document Implementation Status

For each applicable control, record the current implementation status and the evidence reference (or planned implementation date).

### Step 6: Get SoA Approved

The SoA is a formal ISMS document. It must be:
- Version-controlled (v1.0, v1.1, etc.)
- Approved by the CISO (or equivalent)
- Reviewed at least annually and when significant changes occur

### Step 7: Keep It Updated

The SoA is not a one-time document. It must be updated:
- When new risks are identified that require new controls
- When existing controls are implemented (status changes from No to Yes)
- When controls are removed or replaced
- When the scope changes
- When transitioning between standard versions (2013 to 2022)

---

## The SoA and the Stage 1 Audit

During the Stage 1 audit, the certification body auditor reviews the SoA in detail. They are looking for:

**Completeness**: All 93 Annex A controls addressed (plus any additional controls).

**Consistency with risk register**: Do the inclusion justifications reference actual risks in the risk register? Are the control references coherent with the risk assessment findings?

**Credible exclusion justifications**: Are exclusions genuinely justified, or do they appear convenient? The auditor will challenge exclusions that seem designed to avoid difficult implementations.

**Implementation realism**: Are controls marked "implemented" genuinely implemented? Are controls marked "not implemented" covered by realistic treatment plan actions?

**Document quality**: Is the SoA version-controlled, dated, and approved?

**Common Stage 1 SoA findings:**
- Inclusion justifications that are generic ("good practice") rather than risk-specific (minor nonconformity)
- Controls excluded without justification (minor nonconformity)
- SoA not updated following a scope change (minor nonconformity)
- SoA references 2013 control numbers after transition to 2022 (minor nonconformity, potentially major if not addressed)
- Controls marked "implemented" without any evidence reference (flag for Stage 2 investigation)

---

## The SoA and the Stage 2 Audit

During Stage 2, the auditor uses the SoA as their navigation tool. For each control marked "applicable and implemented," they will request evidence. The evidence reference column tells them where to look — and if evidence cannot be found or is inadequate, the control's implementation status is challenged.

**Typical Stage 2 SoA testing approach:**
1. Select a sample of applicable controls (typically 20–30 of 93)
2. For each sampled control: request the evidence referenced in Column 7
3. Assess whether the evidence demonstrates that the control is genuinely implemented and operating
4. Where evidence is insufficient: raise as a finding (observation, minor NC, or major NC depending on severity)
5. Trace specific controls back to their risk justifications (Column 8) to verify the traceability chain

**Controls most commonly challenged in Stage 2:**

| Control | What auditors typically test |
|---|---|
| A.6.3 (Awareness, education, training) | Training records + effectiveness (phishing simulation results) |
| A.8.5 (Secure authentication) | MFA enrolment rate + configuration evidence |
| A.8.8 (Technical vulnerability management) | Vulnerability scan reports + patch compliance rate |
| A.8.13 (Information backup) | Backup logs + restoration test records |
| A.5.20 (Supplier agreements) | Sample of supplier contracts + security clause content |
| A.5.22 (Supplier monitoring) | Supplier reassessment records |
| A.5.24 (Incident management planning) | Incident response plan + test exercise records |
| A.9.3 (Management review) | Management review minutes |

---

## SoA vs Risk Register: The Two Must Align

The most important quality check for an SoA is alignment with the risk register. Auditors will cross-reference:

**Every applicable control should trace to at least one risk**: If a control appears in the SoA with no risk register reference, it cannot be justified through the risk-based process. It may be justified through regulatory obligation — but that must be explicitly documented.

**Every risk with a Mitigate treatment should trace to at least one control**: If a risk has been treated through mitigation, the mitigating controls must appear in the SoA. A risk with a treatment plan but no corresponding SoA entries is a traceability gap.

**Controls marked as implemented should be evidenced**: If a control appears as "implemented" in the SoA but there is no evidence of its operation, either the SoA is wrong or the evidence has not been collected.

---

## SoA Template: A Practical Structure

A working SoA might look like this (showing 3 example rows):

| Ref | Control Name | Applicable | Inclusion Justification | Exclusion Justification | Implemented | Evidence Reference | Risk Register Refs |
|---|---|---|---|---|---|---|---|
| A.5.7 | Threat intelligence | Yes | RISK-012 (advanced persistent threat targeting sector); NCSC advisory compliance | — | Partially | NCSC feeds subscribed (evidence: subscription confirmation); formal analysis process under development — target: Q2 2026 | RISK-012 |
| A.7.4 | Physical security monitoring | No | — | Organisation operates from serviced offices managed by building owner. Building security (CCTV, access control) is provided by the landlord under the lease agreement. No organisation-owned physical premises. | N/A | — | — |
| A.8.5 | Secure authentication | Yes | RISK-017 (credential-based attack on VPN); RISK-023 (credential stuffing on portal); PCI DSS Req 8.4 | — | Yes | Azure AD MFA configuration — screenshot in /ISMS/Evidence/A.8.5/; MFA coverage report (99.2% enrolment) dated 2026-04-01 | RISK-017, RISK-023 |

---

## Common Mistakes and Failures

**1. Generic inclusion justifications for every control.**
"Required by ISO 27001" or "Information security best practice" applied to all 93 controls. Not risk-based. Will fail Stage 1 audit scrutiny on traceability.

**2. Mass exclusions to reduce implementation scope.**
Excluding 20+ controls to make the certification scope appear more manageable. Auditors will challenge exclusions that reduce scope beyond what is genuinely justified. If the exclusions are not credible, the certificate scope becomes misleading.

**3. No evidence references.**
Column 7 (evidence reference) left blank or filled with "TBD." The SoA cannot be used for audit navigation without evidence references. Controls with no evidence reference will be challenged in Stage 2.

**4. Implementation status not updated as controls are deployed.**
The SoA was written with 15 controls marked "Not Implemented" at the start of the programme. 12 months later, 12 of those controls have been deployed — but the SoA still shows "Not Implemented." The SoA does not reflect reality.

**5. No risk register references.**
Controls listed without linking back to specific risks. The traceability chain is broken. Auditors cannot verify that the control addresses a genuine identified risk.

**6. SoA not updated after transitioning to ISO 27001:2022.**
The control references still use the 2013 numbering (14 domains, 114 controls). The organisation has not mapped its controls to the 2022 structure. At surveillance audit, the SoA does not align with the current version of the standard.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- The SoA is the primary audit navigation document. Auditors must know what it must contain (Clause 6.1.3(d)), how to use it to trace risk to control to evidence, and what constitutes a valid vs invalid exclusion justification.
- Exam scenario types:
  - "An organisation's SoA shows A.8.25 (Secure development) as not applicable because 'we outsource development.' Is this a valid exclusion?" (Answer: Not automatically — if the organisation manages outsourced development, A.8.25 still applies to their oversight of that development. A.8.30 is the more specific control for outsourced development. Both may be applicable.)
  - "The SoA shows A.5.7 (Threat intelligence) as not applicable with no justification. Is this a nonconformity?" (Answer: Yes — all Annex A controls require either inclusion justification or exclusion justification. No justification is a nonconformity.)
  - "An auditor finds that a control is marked 'Implemented' in the SoA but no evidence can be produced. How should this be classified?" (Answer: This is a nonconformity against Clause 8.1 or the specific control requirement — the SoA claims implementation but implementation cannot be verified.)

**CISM:** Domain 3 (Security Programme) — understanding of control selection and documentation
**CRISC:** Domain 3 (Risk Response) — control selection and documentation maps to CRISC risk treatment
**CISSP:** Domain 1 — risk-based control selection principles

---

## GUARDIAN's Take

The SoA is the document that either proves or disproves that an ISMS is genuinely risk-based.

I have reviewed hundreds of SoAs over my career. The difference between a genuine one and a template one is immediately apparent — and it takes less than ten minutes to see which one you are looking at.

A genuine SoA has inclusion justifications that are specific and varied. RISK-017 requires A.8.5. RISK-023 requires A.8.16. The GDPR Article 32 obligation requires A.5.34. The PCI DSS Requirement 8.4 requires A.8.5. Each control has a reason that is specific to this organisation, this risk assessment, this regulatory environment.

A template SoA has identical justifications for most controls — "information security best practice," "required by ISO 27001," "management decision." The controls were selected by working through the Annex A list, not by working through the risk register.

The exclusion section tells an even clearer story. A genuine SoA has exclusions that are credible and specific. "A.8.25 is excluded because we are a pure-play consulting firm with no software development." "A.7.1 is excluded because all operations are cloud-based with no organisation-owned physical premises." These are specific, verifiable, and coherent with the rest of the ISMS.

A template SoA has either no exclusions (everything marked applicable whether or not it makes sense) or blanket exclusions of difficult controls with vague justifications.

Build the genuine one. It takes more time. It requires a completed risk assessment first. It requires thought about why each control is relevant to your specific situation. But the result is a document that actually guides the audit, actually demonstrates the risk-based process, and actually adds value to the ISMS.

And when the Stage 2 auditor sits down to trace controls to risks to evidence, they will be able to follow the thread — because you built a document that was designed to be followed, not designed to be approved.

---
*Module: Module 3 — ISO 27001 | Guardian Curriculum*
