---
tags: [guardian, grc, module-9, policy-lifecycle, governance, document-control, review-cycle]
module: 9
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-25
guardian-refs: ["G9-01 — The Policy Hierarchy", "G9-02 — Writing Effective Security Policies", "G9-03 — Standards and Baselines", "G9-04 — Procedures and SOPs", "G3-06 — ISO 27001 Clause 7 — Support"]
---

# G9-05 — Policy Lifecycle — Review, Approval, and Governance

> [!abstract] What This Note Covers
> By the end of this note, you will understand the complete lifecycle of a security policy from creation through retirement, the governance processes that maintain a living, effective policy framework, and how to build the infrastructure that keeps documentation current, accessible, and organisationally embedded.

---

## Why This Exists

A policy written, approved, and then forgotten is not a governance asset — it is a liability. It creates the appearance of governance while providing none. When the policy is outdated, it may actively mislead staff about current requirements, contradict actual practice, and undermine credibility when audited.

Policy governance — the systematic management of the policy framework throughout each document's lifecycle — is what distinguishes a mature governance programme from a collection of documents. This note covers every phase of that lifecycle: initiation, drafting, review, approval, publication, communication, periodic review, triggered update, and retirement.

---

## The Policy Lifecycle: Six Phases

### Phase 1: Initiation

A new policy, standard, or procedure is initiated when:
- A gap is identified (risk assessment, audit finding, regulatory change, incident)
- A new regulatory or contractual obligation requires documentation
- An existing control area lacks documented governance
- An existing document is splitting into more granular, focused documents

**Initiation artefacts:**
- A brief proposal (1 page) stating: what document is needed; why it is needed; who the audience is; what the primary requirements will address; who will own and author it
- CISO or programme sponsor approval to proceed
- Assignment of an author and an owner (may be the same person)

**Who can initiate**: Any security team member, risk owner, or business unit manager — but the CISO decides whether to proceed.

### Phase 2: Drafting

The document is researched and written by the assigned author, following the structure and language guidance in G9-02 (for policies) or the templates established in G9-04 (for procedures).

**Drafting checklist:**
- Review existing documents for overlap and consistency (the new document should not contradict existing approved documents)
- Review relevant regulatory requirements (GDPR, ISO 27001, PCI DSS, Cyber Essentials) to ensure coverage
- Review relevant industry benchmarks (CIS, NCSC, NIST) for technical standards
- Draft using the appropriate template
- Apply mandatory language ("must" for requirements; "should" for recommendations)
- Include all required sections (purpose, scope, requirements, roles, exceptions, consequences)
- Version as Draft v0.1 during drafting phase

**Consultation during drafting**: The author should consult with:
- Subject matter experts (IT Operations, Legal, HR, Finance — depending on the policy's subject)
- Staff who will be affected by the policy (do requirements create operational problems?)
- The DPO (if the policy covers personal data processing)
- Relevant risk owners

### Phase 3: Stakeholder Review

Before formal approval, the draft is reviewed by stakeholders who will be affected by or responsible for the policy.

**Review distribution:**
- Send the draft to identified stakeholders with a defined review deadline (typically 10–15 business days)
- Request written feedback (email or document commenting) — verbal feedback is not tracked
- Consolidate feedback: categorise as: adopted (change made), partially adopted (compromise reached), rejected (with documented rationale)
- Produce version 0.2+ incorporating adopted feedback

**The CISO decision on disagreements**: Where stakeholders disagree with requirements, the CISO makes the final determination. Business unit managers may argue for weaker requirements; the CISO must balance operational feasibility with security need. All decisions must be documented.

**Legal review**: Policies with significant legal implications (acceptable use, data protection, employee monitoring) should be reviewed by legal counsel before approval.

### Phase 4: Approval

The approved version is authorised by the appropriate authority at the level required for the document type:

| Document type | Approver |
|---|---|
| Overarching Information Security Policy | CEO / Board |
| Topic-specific security policies | CISO (or equivalent) |
| Security standards | CISO or delegated security manager |
| Security procedures | IT Operations Manager or process owner |
| Security guidelines | Security team lead |

**Approval process:**
1. Final draft (version 0.X) presented to the approver with a summary of key requirements and any unresolved stakeholder concerns
2. Approver may: approve as submitted; approve with conditions (minor changes before publication); send back for further revision; reject
3. If approved: the document is version-numbered (1.0 for a new document; 2.0 for a major revision; 1.1 for a minor revision)
4. Approval evidence is recorded: signed approval form, email confirmation, or meeting minutes

**Approval evidence for auditors**: The approved document should show: the approver's name, their role, and the approval date. This may be in the document footer, a signature page, or a separate approval record that is retained with the document.

### Phase 5: Publication and Communication

An approved policy that is not communicated serves no purpose. Publication is the process of making the document accessible; communication is the process of ensuring the intended audience knows about it and understands it.

**Publication:**
- Document is published to the authoritative document repository (SharePoint, Confluence, document management system)
- Previous version is archived (not deleted) in the version archive
- Document is assigned a stable URL or document reference number that does not change when the document is updated
- Access control applied: who can read, who can edit (typically: all staff can read; only owner can edit)

**Communication — for new policies:**
- Announcement to all affected staff (email or intranet post) explaining: what the new policy covers; what the key requirements are; when it takes effect; where to find the full document; where to direct questions
- Where staff acknowledgement is required (AUP, IS Policy): distribute acknowledgement mechanism (e-signature, LMS click-through, signed form)
- Briefings for specific groups where the policy has significant operational impact (IT team briefing on a new network security standard; HR briefing on a new screening procedure)

**Communication — for updated policies:**
- Announcement of what changed and why (not just "policy updated" — be specific: "The Password Standard has been updated to align with NCSC 2024 guidance. Key change: mandatory 90-day rotation has been removed. MFA is now required for all CDE access, not just remote access.")
- Highlighting significant changes for staff who previously acknowledged the previous version

**The effective date**: A new or updated policy should have a defined effective date — typically 2–4 weeks after publication, giving staff time to read and understand the requirements before they are expected to comply. Immediate effective dates are appropriate only for emergency policies responding to active threats.

### Phase 6: Periodic Review and Triggered Update

The document is maintained through a combination of scheduled reviews and event-triggered reviews.

**Annual review (scheduled):**
The owner conducts an annual review of the document, assessing:
- Are all requirements still current and appropriate?
- Have regulatory requirements changed?
- Have technology changes made specific requirements obsolete or insufficient?
- Have incidents or audit findings revealed gaps?
- Are the role references still current?
- Are the referenced documents still valid?

**Annual review outcomes:**
- **No changes required**: Document confirmed as current; review date updated; review record filed. This is the minimum acceptable outcome — "no changes required" must be based on genuine review, not default.
- **Minor revision** (version 1.1 → 1.2): Small corrections, updated references, minor clarifications. May not require full approval cycle depending on the nature of changes — owner discretion or delegated approval is often sufficient.
- **Major revision** (version 1.2 → 2.0): Significant new requirements, scope changes, structural changes. Full approval cycle required.

**Triggered review events:**

| Trigger | Document types affected | Action |
|---|---|---|
| Significant regulatory change | All policies in the affected area | Immediate review; update within 30 days if affected |
| Significant security incident | Policy/procedure directly related to the incident | Immediate post-incident review; update within 30 days |
| New or changed technology | Standards and procedures for the affected technology | Update within 30 days of change |
| Internal audit finding | Policy/procedure with the identified gap | Update as part of corrective action (per audit finding timeline) |
| Organisational change (new business unit, M&A) | All policies that reference scope or roles | Review within 60 days; update as needed |
| Framework update (new ISO 27001 version, NCSC guidance update) | All policies referencing the framework | Review within 90 days |

**Review evidence**: Every scheduled or triggered review must produce a documented review record — even if no changes were made. The record confirms: who reviewed the document, when, what they assessed, what the outcome was. Auditors specifically look for evidence of genuine review, not just an updated "last reviewed" date on the document.

### Phase 7: Retirement

Documents that are no longer needed (superseded by a newer document, scope no longer relevant, organisation has exited the relevant business) must be formally retired.

**Retirement process:**
1. Owner identifies that the document should be retired
2. Approval from CISO (same approval level as the original document)
3. Document is marked as "Superseded" or "Retired" with the retirement date
4. Document is moved to the archive (not deleted — historical records are needed for audit purposes)
5. All references to the retired document in other documents are updated
6. Staff communication explaining that the document is retired and (if applicable) what replaces it

**Why archives matter**: Auditors reviewing findings from a prior period need to see the policy that was in effect at that time. A document that was retired 18 months ago may still be relevant for an investigation of an incident that occurred during its validity period. Never delete retired documents.

---

## Document Control Infrastructure

### The Document Register

Every organisation with a formal policy framework should maintain a document register — a master inventory of all GRC documentation.

**Document register fields:**

| Field | Content |
|---|---|
| Document ID | Unique reference number (e.g. ISEC-POL-001) |
| Title | Full document title |
| Type | Policy / Standard / Procedure / Guideline |
| Version | Current version number |
| Status | Active / Under Review / Superseded / Retired |
| Owner | Named individual responsible for maintenance |
| Approver | Named role (or individual) who approved |
| Approval date | Date of current version approval |
| Effective date | Date current version came into effect |
| Review date | Date of next scheduled review |
| Location | URL or file path to the document |
| Scope | Who/what the document applies to |
| Related documents | Cross-references to related documents |

The document register is reviewed at management review (Clause 9.3 of ISO 27001) — it provides a consolidated view of documentation currency and upcoming reviews.

### Version Control

Every document update produces a new version. Version numbers follow a consistent convention:
- **Major revision** (1.0, 2.0, 3.0): Significant structural or content changes; requires full approval cycle
- **Minor revision** (1.1, 1.2, 2.1): Small corrections, updates, clarifications; may use delegated approval
- **Draft** (0.1, 0.2, 0.9): Pre-approval working versions; not published to staff

**Version history table** (included in every document or in the document management system):

| Version | Date | Author | Summary of changes | Approver |
|---|---|---|---|---|
| 1.0 | 2023-03-15 | A. Chen | Initial version | CISO (J. Kumar) |
| 1.1 | 2024-01-10 | A. Chen | Updated MFA requirements to align with v4.0 PCI DSS; added FIDO2 to approved MFA list | IT Security Manager |
| 2.0 | 2025-02-28 | A. Chen | Full revision: added cloud access requirements; expanded privileged access section; restructured to align with updated IS Policy | CISO (J. Kumar) |

### Document Repository Requirements

The repository where policies are stored must:
- Be accessible to all staff who need to read policies (typically all staff for policies; IT team for standards and procedures)
- Have version control capability (preventing accidental overwriting of current versions)
- Have access-controlled editing (only document owners can modify)
- Allow document locking (to prevent simultaneous editing conflicts)
- Provide search capability (staff can find policies by keyword or topic)
- Support version history (previous versions accessible; current version clearly marked)
- Be accessible from all work environments (office, remote, mobile)
- Have backup and disaster recovery (policy documents are critical — their loss during an incident would be damaging)

**Common platforms**: Microsoft SharePoint (widely used; good versioning; integration with Microsoft 365 access controls); Confluence (popular with development-oriented organisations); dedicated GRC platforms (ServiceNow GRC, Vanta, Drata, Sprinto — integrate policy management with compliance evidence collection).

---

## Policy Exceptions Governance

Exceptions to policies and standards are normal and necessary in complex organisations. The exceptions governance process is a critical governance mechanism — without it, non-compliance is hidden rather than managed.

### Exception Register

All approved exceptions must be recorded in the exception register:

| Field | Content |
|---|---|
| Exception ID | Unique reference |
| Document | Policy or standard with exception |
| Requirement | Specific requirement(s) excepted |
| Scope | System, location, or activity covered by the exception |
| Reason | Why compliance is not currently achievable |
| Compensating controls | What risk mitigations are in place |
| Risk assessment | Risk level with exception and compensating controls |
| Approver | Who approved the exception |
| Approval date | Date exception was approved |
| Expiry date | When the exception expires (maximum 12 months) |
| Review date | Next scheduled review of the exception |
| Remediation plan | How/when the exception will be resolved |

### Exception Lifecycle

1. **Request**: Document owner or system owner submits exception request
2. **Risk assessment**: Security team assesses the risk of the exception; confirms compensating controls are adequate
3. **Approval**: CISO approves (or rejects, with feedback for re-submission)
4. **Registration**: Exception added to the exception register
5. **Monitoring**: Exception reviewed monthly or quarterly (depending on risk level)
6. **Renewal**: Exceptions approaching expiry must be renewed with updated risk assessment; exceptions that persist beyond 12 months without resolution require escalation to management review
7. **Closure**: When compliance is achieved, exception is closed and the register updated

**Exception audit**: Internal audits should specifically review the exception register — how many exceptions are open, how long they have been open, whether compensating controls are adequate, whether the remediation plans are progressing. A large number of long-standing exceptions with no remediation progress indicates that the standards are not achievable in the current environment and should be reviewed.

---

## Policy Acknowledgement and Training

### Staff Acknowledgement

For the most critical policies (Acceptable Use Policy, Information Security Policy), organisations should maintain records of staff acknowledgement — evidence that each staff member has read and agreed to the policy.

**Acknowledgement mechanisms:**
- LMS (Learning Management System) click-through: staff complete a training module covering the policy and must click to acknowledge they have read and understood it. Completion is tracked automatically.
- E-signature: staff sign an electronic version of the policy (DocuSign, Adobe Sign, or equivalent)
- Physical signature: paper form collected at induction; scanned and filed in HR records
- Policy portal: dedicated intranet portal where staff log in and confirm acknowledgement; timestamped by the system

**Acknowledgement record requirements:**
- Employee name and ID
- Policy name and version
- Date of acknowledgement
- Method of acknowledgement

**When to collect acknowledgements:**
- At induction (all key policies)
- When a policy is significantly revised (not minor updates — major revisions that change key requirements)
- Annually for the highest-risk policies (AUP is the most common annual acknowledgement)

**Chasing non-completers**: Acknowledgement programmes must include a process for chasing staff who have not completed acknowledgement. An acknowledgement programme where 20% of staff have not acknowledged the AUP after 6 months is not effective governance.

### Security Awareness Training Integration

Policies should be embedded in the security awareness training programme — not just referenced as separate documents. Key policies (IS Policy, AUP, data classification, incident reporting) should be covered in annual security awareness training, with specific emphasis on:
- What the policy requires
- What staff specifically must do
- What the consequences of non-compliance are
- How to report concerns or ask questions

Training should include scenario-based questions that test understanding (not just completion). A staff member who completed the training module but answers 3 of 5 scenario questions incorrectly has not demonstrated understanding.

---

## Metrics for Policy Governance

Effective policy governance is measurable. Key metrics to track and report:

**Policy currency:**
- Percentage of policies with review dates in the future (target: 100%)
- Percentage of policies reviewed in the last 12 months (target: 100%)
- Average age of documents (older documents warrant scrutiny)

**Exception management:**
- Number of open exceptions (trend over time)
- Average age of open exceptions (exceptions older than 6 months are a concern)
- Percentage of exceptions with remediation plans and target dates (target: 100%)

**Acknowledgement:**
- Staff AUP acknowledgement completion rate (target: 100% within defined timeframe)
- Outstanding acknowledgements count

**Awareness training:**
- Security awareness training completion rate (target: 100%)
- Average quiz scores post-training
- Phishing simulation click rates (trend)

These metrics should be reported at the quarterly security management meeting and at the annual management review.

---

## Common Mistakes and Failures

**1. The annual review that never happens.**
Review dates exist in every document. Nobody monitors them. In the annual management review, the CISO reports "all policies current" — without having verified that any reviews were actually conducted. A document with a review date of March 2024 and no review record is not "current" — it is overdue.

**2. Approval authority not appropriate to the document level.**
An Acceptable Use Policy that applies to all 2,000 employees of an organisation, approved by the IT Manager rather than the CEO or CISO. When auditors ask "who approved this policy?", the answer determines whether the governance structure is appropriate. An IT Manager approving an organisation-wide policy that includes disciplinary consequences lacks the authority for those consequences.

**3. Exceptions never expire.**
The exception register has 15 open exceptions, 8 of which are more than 2 years old. "Permanent" exceptions that were supposed to be temporary have become permanent by inertia. Exceptions without expiry dates are vulnerabilities in the governance framework.

**4. Policy changes not communicated.**
The password standard is updated to remove mandatory 90-day rotation. The change is made in the document repository. No communication goes to staff. Staff continue rotating passwords every 90 days because that is what the previous version required and nobody told them the requirement changed. Communication of changes is not optional.

**5. The policy graveyard.**
Policies that should have been retired years ago are still in the document repository, marked as active. Staff who search for the relevant policy find two conflicting documents — the old policy and the new one. Neither has been marked as superseding the other. Retirement is as important as creation.

**6. Single-point ownership.**
One person owns all 23 policies, standards, and procedures. When they leave, nobody knows where the documents are, what the review schedule is, or who the stakeholders are for each document. Distribute ownership across the team.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Documented information management is a key Clause 7.5 requirement. Auditors specifically look for: version control evidence; approval records; review history; accessibility to relevant personnel; control over modifications; retention of obsolete versions. Common findings include missing approval dates, lack of version history, and documents accessible only in primary systems (inaccessible during incidents).

**CISM:**
- Domain 1 (Governance) — policy governance is the operational mechanism through which the governance framework is maintained. CISMs must understand the complete lifecycle and how to build sustainable governance infrastructure.

**CRISC:**
- Domain 4 (Monitoring) — policy governance is a control monitoring activity. Policy currency, exception status, and acknowledgement rates are risk indicators that CRISC candidates should understand as inputs to the ongoing risk monitoring programme.

---

## GUARDIAN's Take

Policy governance is the maintenance programme for the governance infrastructure. It is unglamorous — maintaining version numbers, chasing review dates, tracking acknowledgements — but without it, even the best-designed policy framework deteriorates into an outdated mess within a couple of years.

The organisations I have seen maintain genuinely effective policy frameworks over time share two habits: they assign specific ownership for every document (not team ownership — individual ownership), and they track compliance with the framework itself (review dates, exception counts, acknowledgement rates) as governance metrics reported to management.

When the management review includes a slide showing "Policy framework status: 97% of documents reviewed within schedule; 3 open exceptions, none older than 6 months; AUP acknowledgement at 99% completion" — that is a healthy programme. When the management review has nothing to say about the policy framework — that is a programme that has become documentation rather than governance.

Build the infrastructure: the document register, the review calendar, the exception register, the acknowledgement tracking. Make the metrics visible. Hold owners accountable. The policy framework that is actively maintained is the one that actually governs behaviour.

---
*Module: Module 9 — Policies, Standards, Procedures | Guardian Curriculum*
