---
tags: [guardian, grc, module-9, policy-writing, security-policy, documentation, communication]
module: 9
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-19
guardian-refs: ["G9-01 — The Policy Hierarchy", "G9-03 — Standards and Baselines", "G3-06 — ISO 27001 Clause 7 — Support", "G4-01 — Organisational Controls — A.5.1 Policies"]
---

# G9-02 — Writing Effective Security Policies

> [!abstract] What This Note Covers
> By the end of this note, you will understand how to write security policies that are clear, enforceable, appropriate to their audience, and durable — including structure, language, common failure modes, and a practical framework for drafting any security policy.

---

## Why This Exists

Most security policies are bad. Not technically wrong — just unreadable, unusable, and ultimately ignored. They are too long. They use technical jargon accessible only to IT professionals. They bury critical requirements in paragraphs of background. They use hedging language that makes compliance optional. They are written to satisfy auditors, not to guide staff.

An ineffective policy is worse than no policy — because it creates the illusion of governance while providing none. An auditor sees a 40-page policy document and marks the control as "in place." The staff who should follow it have never read past page 3. The requirements they should understand are buried in section 7.4.2.

This note teaches policy writing as a communication craft — producing documents that are read, understood, and actually govern behaviour.

---

## The Fundamental Question: Who Is This Policy For?

Before writing a single word, answer this question: **who must read and follow this policy?**

The answer determines everything — vocabulary, complexity, assumed knowledge, length, format, and level of detail.

**All staff policies** (Acceptable Use, Clear Desk, Data Classification):
- Written for the entire workforce — including non-technical staff
- No technical jargon
- Short, direct sentences
- Practical examples
- Explicit consequences of non-compliance
- Maximum 2–4 pages

**Technical staff policies** (Secure Development Policy, Network Security Policy):
- Written for IT professionals, developers, or security engineers
- Technical terminology is appropriate
- More complex requirements are acceptable
- Can reference technical standards
- 4–8 pages is typical

**Management policies** (Supplier Security Policy, Risk Management Policy):
- Written for senior managers, procurement, and legal teams
- Governance-focused
- Explains accountability and decision-making frameworks
- Business language rather than technical language
- 3–6 pages

**The common mistake**: Writing a single policy for "all staff" that actually reads at a technical level appropriate only to IT professionals. The result: IT staff think it is too basic; non-IT staff cannot understand it; nobody finds it useful.

---

## Core Principles of Effective Policy Writing

### Principle 1: Say What You Mean, Mean What You Say

Policy language must be unambiguous. If a requirement is mandatory, it must use mandatory language. If it is recommended, it must use recommendation language.

**Mandatory requirements**: "must", "shall", "is required to", "is prohibited from"

**Recommendations**: "should", "is encouraged to", "is recommended"

**Permission**: "may", "is permitted to"

**The weasel word problem**: Policies that say "staff should endeavour to protect confidential information" are not requirements — they are aspirations. A staff member who "endeavoured" but failed has technically complied. If protection of confidential information is required, say: "Staff must protect confidential information from unauthorised disclosure."

**Every "should" is an invitation to argue**: When something is written as "should," it can be debated. When something is written as "must," it cannot. Reserve "should" for genuine recommendations; use "must" for requirements.

### Principle 2: Be Specific Enough to Be Enforceable

A policy requirement must be specific enough that:
1. Compliance can be objectively assessed
2. Non-compliance can be identified and acted upon

**Unenforceable**: "Staff should use strong passwords."

What is a strong password? Who decides? How is it tested?

**Enforceable**: "All user accounts must have passwords that comply with the Password Standard, currently requiring a minimum of 12 characters."

Now compliance can be tested against the Password Standard.

**The specificity gradient**: Policies should be more specific than the overarching information security policy but less specific than standards. The policy establishes the requirement; the standard specifies the measurable threshold.

### Principle 3: Write for the Reader, Not the Auditor

The primary purpose of a policy is to direct behaviour. The secondary purpose is to satisfy auditors and regulators. Policies written primarily for the second purpose frequently fail the first.

**Signs a policy is written for auditors, not readers:**
- Uses regulatory or standards language verbatim ("the organisation shall ensure that information assets are protected in accordance with their classification level and applicable legal, regulatory, and contractual requirements")
- Contains extensive background sections before any actual requirements
- Uses passive voice throughout ("information shall be protected" rather than "staff must protect information")
- Has no examples or illustrations
- Cannot be summarised in plain English by a non-expert

**Write for the reader:**
- Use active voice ("you must" rather than "staff are required to")
- Put the requirements first — background after
- Use examples to illustrate requirements
- Include a "what this means in practice" section for complex policies
- Write so that a new employee on their first day would understand what is expected of them

### Principle 4: Make Non-Compliance Consequences Explicit

Policies without consequences are suggestions. Every policy should include a statement of the consequences of non-compliance — not necessarily detailed disciplinary procedures, but a clear statement that violations have consequences.

**Template**: "Failure to comply with this policy may result in disciplinary action in accordance with the organisation's disciplinary procedure, up to and including termination of employment or contract."

**For specific high-risk violations, be more explicit**: "Deliberate unauthorised disclosure of Restricted information is a serious disciplinary offence and may result in immediate termination of employment and/or legal action."

### Principle 5: Keep It as Short as Possible (But Not Shorter)

Length is a compliance barrier. A 40-page policy will be skimmed or ignored. A 3-page policy will be read.

**Techniques for reducing length:**
- Separate standard-level requirements into a referenced standards document
- Move procedural detail into referenced procedures
- Remove background and history (relevant to the author; irrelevant to the reader)
- Remove definitions of terms that are in a glossary document
- Remove repetition (don't say the same thing three different ways)
- Use tables for lists of requirements rather than prose paragraphs

**The one-page test**: Can the core requirements of this policy be summarised in one page? If the full policy exceeds four times that length, it probably contains material that belongs in standards or procedures.

---

## Policy Structure: A Working Template

A well-structured security policy follows a consistent format. The following structure works for most information security policies:

```
[POLICY TITLE]
Version [X.X] | Effective Date: [DD MMM YYYY] | Review Date: [DD MMM YYYY]
Owner: [Name/Role] | Approver: [Name/Role]

1. PURPOSE
   One or two sentences stating why this policy exists and what it protects.
   
2. SCOPE
   Who and what this policy applies to. Be specific about inclusions and exclusions.
   
3. POLICY STATEMENTS
   The mandatory requirements — using "must" language.
   Number each requirement for easy reference.
   Group related requirements into subsections.
   
4. ROLES AND RESPONSIBILITIES
   Who is responsible for what. Named roles (not named individuals).
   
5. EXCEPTIONS
   How to request an exception if compliance is not possible.
   Who approves exceptions.
   How exceptions are documented.
   
6. NON-COMPLIANCE
   Consequences of policy violation.
   
7. RELATED DOCUMENTS
   References to supporting standards, procedures, guidelines.
   
8. DEFINITIONS
   Technical terms that require definition. (Or: reference the glossary.)
   
9. REVIEW AND MAINTENANCE
   Who reviews this policy and when.
```

---

## Writing Each Section: Practical Guidance

### Section 1: Purpose

**Purpose**: One or two sentences. Not a history lesson. Not background on threats. Why does this policy exist, and what does it protect?

**Poor example**: "In response to the increasing sophistication of cyber threats targeting organisations in the financial services sector, and in light of regulatory requirements including the General Data Protection Regulation (EU) 2016/679 (GDPR) as implemented in UK law through the Data Protection Act 2018, and the requirements of ISO/IEC 27001:2022, this organisation has determined that it is necessary to establish a comprehensive access control policy..."

**Good example**: "This policy establishes the requirements for controlling access to information systems and data, ensuring that access is granted based on business need and revoked promptly when no longer required."

### Section 2: Scope

State clearly: who this policy applies to; what systems or assets it covers; what is explicitly excluded.

**Template:**
> "This policy applies to all employees, contractors, agency workers, and third parties who have access to [Organisation]'s information systems, networks, and data. It applies to all information assets owned or managed by [Organisation], including cloud-hosted services used for business purposes.
>
> This policy does not apply to personal devices used exclusively for personal purposes that do not access organisational systems."

**Scope failure mode**: "This policy applies to all users." What is a "user"? All employees? Contractors? Board members? Customers?

### Section 3: Policy Statements

The requirements — the substance of the policy. Numbered for reference. Grouped into logical subsections.

**Format for each requirement:**

Option A (short, direct):
> "3.1 All user accounts must be authenticated using multi-factor authentication for access to organisational systems."

Option B (requirement + clarification):
> "3.4 Users must not share their authentication credentials with any other person.
>
> This includes passwords, MFA codes, access cards, and biometric data. If a user believes their credentials may have been compromised, they must immediately report this to the IT Service Desk and change their password."

**Grouping requirements:**
- 3.1–3.4: Account management
- 3.5–3.8: Password requirements
- 3.9–3.11: Privileged access
- 3.12–3.14: Remote access

**Avoid:**
- Combining multiple requirements in one statement: "Users must use strong passwords and must not share them and must change them when compromised and must..." → split into separate numbered requirements
- "As appropriate" or "where applicable" qualifiers that make requirements optional without specifying when they apply
- Future tense ("The organisation will implement...") — use present tense for requirements ("The organisation must implement...")

### Section 4: Roles and Responsibilities

A table mapping responsibilities to roles works well here:

| Role | Responsibilities |
|---|---|
| All staff | Follow this policy; report suspected violations; attend mandatory training |
| IT Operations | Implement technical access controls; conduct access reviews; manage account lifecycle |
| CISO / Security Manager | Maintain this policy; monitor compliance; report on policy effectiveness |
| Line Managers | Authorise access requests for their team members; notify IT of role changes; participate in access reviews |
| HR | Trigger offboarding processes on staff departure; notify IT of contractual changes |

**Name roles, not individuals**: "IT Operations" not "James Chen." When James leaves, the policy is still current.

### Section 5: Exceptions

Every policy needs an exceptions process — because compliance is sometimes genuinely not possible (legacy systems, business constraints, technical limitations). Without a formal exceptions process, people either comply dishonestly (claiming compliance when they can't achieve it) or non-comply without documentation.

**Template:**
> "Exceptions to this policy may be requested where technical or business constraints prevent full compliance.
>
> All exceptions must be:
> a) Documented using the Policy Exception Request form
> b) Approved by the CISO
> c) Time-limited (maximum 12 months, subject to review)
> d) Accompanied by compensating controls that mitigate the identified risk
>
> Exceptions are recorded in the Policy Exception Register and reviewed quarterly."

### Section 6: Non-Compliance

Brief and direct. Point to the disciplinary procedure rather than reproducing it.

**Template:**
> "Failure to comply with this policy may result in disciplinary action in accordance with the [Organisation] Disciplinary Procedure. The nature and severity of any disciplinary action will be proportionate to the nature and severity of the violation.
>
> Certain violations — including deliberate unauthorised disclosure of confidential information or fraudulent use of access credentials — may result in summary dismissal and/or referral to law enforcement authorities."

### Section 7: Related Documents

A list of documents that support this policy:

> "This policy is supported by:
> - Password Standard (defines technical requirements for passwords)
> - MFA Standard (defines technical requirements for multi-factor authentication)
> - User Account Provisioning Procedure (describes the process for creating and managing user accounts)
> - Access Review Procedure (describes the process for reviewing and updating user access rights)
> - Acceptable Use Policy (defines acceptable use of information systems)"

---

## Common Policy Types: Key Requirements

### Acceptable Use Policy (AUP)

**Audience**: All staff.

**Key requirements to include:**
- Permitted and prohibited uses of IT systems and information
- Email and internet use (personal use limits; prohibited content)
- Social media (what may and may not be shared publicly)
- Removable media (permitted or prohibited; encryption requirements)
- Software installation (approved/prohibited; process for requesting new software)
- Mobile device use (personal and organisational devices)
- Remote working security requirements
- Password and credentials management
- Obligation to report security incidents
- Consequences of AUP violation

### Access Control Policy

**Audience**: IT staff, all staff (for general access requirements).

**Key requirements to include:**
- Least privilege principle (access based on business need, not seniority)
- Unique user IDs (no shared accounts)
- MFA requirements
- Privileged access controls
- Access review frequency
- Account lifecycle (provisioning, modification, deprovisioning)
- Remote access requirements
- Third-party access requirements

### Incident Management Policy

**Audience**: All staff (for reporting); IT and security (for response).

**Key requirements to include:**
- Definition of a security incident
- Obligation to report suspected incidents (and how)
- Roles and responsibilities in incident response
- Escalation criteria
- Evidence preservation requirements
- Communication requirements (internal and regulatory)
- Post-incident review obligation

### Supplier Security Policy

**Audience**: Procurement, legal, vendor managers.

**Key requirements to include:**
- Risk assessment before engaging suppliers
- Security requirements in supplier contracts
- DPA requirements for suppliers processing personal data
- Ongoing monitoring requirements
- Incident notification requirements from suppliers
- Right to audit suppliers
- Exit requirements (data return/destruction)

---

## Policy Approval and Communication

### Approval Process

The approval level must be appropriate to the policy's scope and impact:

| Policy type | Minimum approver |
|---|---|
| Overarching Information Security Policy | CEO / Board |
| Topic-specific policies | CISO / equivalent |
| Standards | CISO or delegated security manager |
| Procedures | Process owner / IT Manager |
| Guidelines | Security team |

**Approval evidence**: The policy document itself (footer showing approver name, role, and date) AND an approval record (email confirmation, meeting minutes, or formal approval form). Auditors will look for both.

### Communication

Approval is necessary but not sufficient. Policies must be communicated:

**At induction**: New staff must receive, read, and acknowledge key policies (at minimum: AUP, Information Security Policy, Clear Desk Policy) as part of induction.

**Annual refresher**: All staff should receive annual confirmation of policy requirements — through awareness training or a formal acknowledgement process.

**Policy change communication**: When a policy is updated, affected staff must be informed of the change, not just directed to the updated document.

**Accessibility**: Policies must be accessible to all relevant staff at all times — intranet, employee handbook, SharePoint. Not buried in a document management system that most staff cannot navigate.

**Acknowledgement records**: For the most critical policies (AUP, IS Policy), maintain records of staff acknowledgement — signed forms or LMS completion records. These are evidence of communication and are reviewed in audits.

---

## Reviewing and Maintaining Policies

### Annual Review

Every policy must be reviewed at its defined review date. The review must assess:
- Is the policy still relevant to the current business context?
- Have regulatory or legal requirements changed that affect this policy?
- Have technology changes made specific requirements obsolete or insufficient?
- Have incidents or near-misses revealed that the policy needs strengthening?
- Are there any internal audit findings or nonconformities related to this policy?

**Review evidence**: A documented record of the review — who conducted it, when, what was assessed, and whether changes were made (and if not, why not). "Policy reviewed — no changes required" is acceptable only if there is evidence of genuine review.

### Triggered Review

Beyond the annual cycle, reviews should be triggered by:
- Significant organisational change (new business unit, new product, new technology)
- Significant regulatory change (new legislation, new guidance)
- Significant incident (breach, near-miss revealing a policy gap)
- Merger or acquisition
- New or revised framework adoption (e.g. ISO 27001 update, DORA implementation)

### Version Control

Every policy change must be:
- Version-numbered (major changes: 1.0 → 2.0; minor changes: 2.0 → 2.1)
- Dated
- Recorded in the change history
- Communicated to affected staff

Previous versions must be archived — not deleted. Auditors may ask for the version in force during a specific period; historical versions provide this evidence.

---

## Common Mistakes and Failures

**1. Writing policies that cannot be followed.**
A policy that requires all staff to use password managers — but the organisation hasn't procured or approved a password manager. Policies must be realistic; they must be supported by the infrastructure, tools, and guidance needed to comply.

**2. "Kitchen sink" policies.**
One document containing everything related to information security — 60 pages of policies, standards, procedures, and guidelines all mixed together. Nobody reads them; nobody can find specific requirements; updating one section requires reviewing the whole document.

**3. Passive voice throughout.**
"Information shall be protected." By whom? How? Active voice ("Staff must protect information by...") is clearer and assigns accountability.

**4. Policy written, never communicated.**
Staff were never told the policy exists. It appears in a SharePoint folder. The audit confirms the policy is documented; staff behaviour confirms nobody has read it.

**5. Exceptions never granted, exceptions never tracked.**
Either the exceptions process is so onerous that nobody bothers, and non-compliance is hidden — or exceptions are granted informally with no documentation. Both undermine governance.

**6. Requirements that cannot be measured.**
"The organisation shall endeavour to use appropriate security measures." What is "appropriate"? How is "endeavouring" measured? Every policy requirement must be testable.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Policy quality is assessed in Stage 1 and Stage 2. Auditors look for: correct approval level; appropriate scope; clear mandatory language; review date present and current; communication evidence; staff acknowledgement records. Common finding: policies exist but use "should" language for what should be mandatory requirements.

**CISM:**
- Domain 1 (Governance) — policy development is a core governance activity. CISM candidates must understand what makes policies effective from a governance perspective: clarity, enforceability, communication, and maintenance.

**CISSP:**
- Domain 1 (Security and Risk Management) — policy writing principles are specifically tested. Know the difference between policy/standard/procedure/guideline, the characteristics of effective policies, and the approval and communication requirements.

---

## GUARDIAN's Take

I have reviewed hundreds of security policies over two decades. The best ones are short, clear, and read like they were written for real people rather than for a compliance database. They make requirements unambiguous. They explain why requirements exist — briefly, but enough to make compliance feel purposeful rather than arbitrary. They acknowledge that not everything is black and white and provide an exceptions process for grey areas.

The worst ones are long, passive, hedged, and technical. They satisfy the audit because they contain the right sections. They satisfy nobody else because nobody can find the actual requirements, understand them, or follow them in practice.

When writing a policy, ask yourself: could a new employee on their first day, after reading this policy, tell me what they are required to do and why? If yes, it is a good policy. If no, it needs to be rewritten.

That test — can the intended reader actually use this document? — is the most useful quality check for any security policy. Pass that test, and you have written something that governs behaviour. Fail it, and you have produced documentation for auditors that does nothing to improve security.

---
*Module: Module 9 — Policies, Standards, Procedures | Guardian Curriculum*
