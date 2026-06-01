---
tags: [guardian, grc, module-9, policy, standards, procedures, guidelines, documentation-hierarchy]
module: 9
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-19
guardian-refs: ["G1-02 — Governance Explained", "G3-06 — ISO 27001 Clause 7 — Support", "G4-01 — Organisational Controls — A.5.1 Policies", "G9-02 — Writing Effective Security Policies", "G9-03 — Standards and Baselines"]
---

# G9-01 — The Policy Hierarchy — Policies, Standards, Procedures, and Guidelines

> [!abstract] What This Note Covers
> By the end of this note, you will understand the four-tier information security documentation hierarchy — policies, standards, procedures, and guidelines — what each tier does, how they relate to each other, and how to build a coherent documentation framework that satisfies ISO 27001, regulators, and operational teams.

---

## Why This Exists

Every ISO 27001 implementation produces a stack of documents. But the quality of those documents — their clarity, their usability, their governance — varies enormously. Some organisations produce comprehensive, well-structured policy frameworks that genuinely direct behaviour and withstand auditor scrutiny. Others produce a mass of loosely connected documents that nobody reads, that contradict each other, and that bear little relationship to operational reality.

The difference is usually architecture. Organisations that build their documentation on a clear hierarchy — understanding what each tier does, what it contains, who writes it, who approves it, and how the tiers relate — produce documentation that works. Organisations that treat "policy" as a generic word for any written document produce a governance mess.

This note establishes the architecture.

---

## The Four-Tier Documentation Hierarchy

### Tier 1: Policy

**What it is**: A high-level statement of management intent, direction, and principles on a specific subject. Policies express the organisation's commitment to a particular approach and set the boundaries within which all related activities must occur.

**Characteristics:**
- Written at a high level of abstraction — no procedural detail
- Technology-agnostic — a password policy does not name specific password managers
- Approved by the highest appropriate level of management (the Information Security Policy itself is approved by the CEO/Board; topic-specific policies by the CISO or equivalent)
- Rarely changes — should remain current for 1–3 years without revision (major revision triggers a full approval cycle)
- Applies to the entire organisation (or the defined scope)
- Answers: **What** must be done and **Why**

**Examples of information security policies:**
- Information Security Policy (overarching)
- Access Control Policy
- Acceptable Use Policy
- Cryptography Policy
- Data Classification Policy
- Incident Management Policy
- Supplier Security Policy
- Remote Working Policy
- Clear Desk and Screen Policy
- Business Continuity Policy

**What a policy does NOT contain:**
- Specific technical settings (those go in Standards)
- Step-by-step instructions (those go in Procedures)
- Vendor-specific configurations (those go in Technical Baselines)
- "How to" guidance (that goes in Guidelines)

**Policy failure mode**: A policy that tries to contain too much detail — specifying that "passwords must be minimum 12 characters, contain uppercase, lowercase, number, and special character, must not contain the user's name, must not repeat the last 12 passwords, and must be changed every 90 days" is not a policy — it is a technical standard embedded in a policy document. When the technical standard needs to change (because NCSC guidance has moved away from mandatory rotation), the policy must go through a full approval cycle.

### Tier 2: Standard

**What it is**: A specific, mandatory requirement derived from and consistent with a policy. Standards translate policy intent into measurable, enforceable requirements.

**Characteristics:**
- More specific than policies — include quantitative requirements and technical specifications
- Mandatory — "must" language
- Technology-aware but not necessarily technology-specific
- Approved by the CISO or security programme owner (not necessarily board-level approval)
- Updated more frequently than policies as technology and threat landscape evolve
- May apply to specific roles, systems, or environments
- Answers: **What specifically** must be done (the measurable requirement)

**Examples of information security standards:**
- Password Standard (minimum length 12, no expiry with MFA enabled, MFA required for CDE systems)
- Encryption Standard (AES-256 for data at rest; TLS 1.2+ for data in transit; no MD5, SHA-1, DES)
- Patch Management Standard (critical patches within 14 days; high within 30 days; medium within 90 days)
- Vulnerability Scanning Standard (weekly external scan; monthly internal scan; quarterly web application scan)
- Network Security Standard (DMZ architecture; default deny; 6-monthly firewall rule review)
- Logging Standard (what events must be logged; minimum 12-month retention; 3 months immediately accessible)
- Asset Classification Standard (three tiers: Public, Internal, Restricted; labelling requirements for each)

**Standard vs Policy distinction example:**

| Policy (Access Control Policy) | Standard (Password Standard) |
|---|---|
| "The organisation shall implement access controls based on the principle of least privilege to protect information assets." | "User accounts must have a minimum password length of 12 characters. Multi-factor authentication is mandatory for all access to the Cardholder Data Environment. Shared accounts are prohibited." |
| Technology-neutral; high-level | Specific; measurable; enforceable |

### Tier 3: Procedure

**What it is**: A step-by-step description of how to implement a standard or policy requirement in a specific operational context. Procedures are the operational instructions that tell someone exactly what to do.

**Characteristics:**
- Highly specific and operational — step by step
- Often tool-specific or system-specific
- Written for the person who must execute the task (not management)
- Approved by the process owner or operational manager
- Changes frequently as systems and tools change
- Answers: **How** to do it (step by step)

**Examples of information security procedures:**
- New User Account Provisioning Procedure (steps for creating an account in Active Directory, assigning roles, setting up MFA, issuing equipment)
- Vulnerability Scan Execution Procedure (steps for running a scan using Qualys/Nessus: login, configure target, run scan, export report)
- Security Incident Reporting Procedure (how to submit a security incident ticket: which system, what information to include, who to call)
- Firewall Rule Change Procedure (steps for requesting, approving, implementing, and documenting a firewall rule change)
- Data Backup Verification Procedure (steps for verifying backup completion, testing restoration, documenting results)
- Offboarding Security Checklist (step-by-step account deprovisioning, asset return, badge deactivation)

**Procedure failure mode**: Procedures that are too high-level ("1. Identify the incident. 2. Respond to the incident. 3. Document the incident.") provide no operational guidance. A procedure must be specific enough that a competent but unfamiliar person can execute it correctly without additional guidance.

### Tier 4: Guideline

**What it is**: Recommended (non-mandatory) guidance that supports the implementation of policies, standards, and procedures. Guidelines provide advice, best practices, and illustrative examples.

**Characteristics:**
- Non-mandatory — "should" or "recommended" language, not "must"
- Provides context and explanation for policy/standard requirements
- May include examples, templates, and illustrative scenarios
- Can be more opinionated and specific than policies
- Approved by the policy owner or security team
- Answers: **How best** to approach something (advisory)

**Examples of information security guidelines:**
- Secure Email Handling Guidelines (recommended practices for identifying phishing; what to do when suspicious email received)
- Working From Home Security Guidelines (recommended practices for home network security, physical security, screen sharing)
- Social Engineering Awareness Guidelines (examples of social engineering attempts; how to verify identity before sharing information)
- Cloud Service Selection Guidelines (recommended security assessment process for evaluating new cloud services before adoption)
- Secure Coding Guidelines (recommended secure coding practices for developers — OWASP alignment)

**Guidelines failure mode**: Writing everything as a guideline (non-mandatory) to avoid accountability. If a security practice is genuinely necessary to protect the organisation, it should be in a standard (mandatory), not a guideline (advisory).

---

## The Four Tiers: How They Relate

The four tiers form a hierarchy — each tier derives its authority from the tier above:

```
TIER 1: POLICY
"The organisation shall implement access controls
based on least privilege."
    ↓ Authority; direction; "what and why"
    
TIER 2: STANDARD
"Passwords must be minimum 12 characters.
MFA is mandatory for CDE access."
    ↓ Specific requirement; "what exactly"
    
TIER 3: PROCEDURE
"To create a new user account:
1. Open Active Directory Users and Computers
2. Right-click the appropriate OU
3. Create new user..."
    ↓ Operational instructions; "how to"
    
TIER 4: GUIDELINE
"When creating passwords for personal accounts,
consider using a passphrase of 4+ random words.
Use a password manager to track unique passwords."
    ↓ Advisory; "how best to approach"
```

**The authority chain**: A procedure cannot contradict a standard; a standard cannot contradict a policy; all must serve the policy's intent. When there is a conflict, the higher tier takes precedence.

**The update cycle**: Policies change rarely (major revision triggers board-level approval). Standards change as technology evolves (CISO approval). Procedures change frequently as systems and tools change (operational manager approval). Guidelines are updated as best practices evolve (security team).

**The audience**:
- Policies: Board, executive team, all staff (awareness)
- Standards: IT teams, security team, compliance team, auditors
- Procedures: The specific staff who execute the task
- Guidelines: Anyone who wants additional guidance

---

## The Overarching Information Security Policy

ISO 27001 Clause 5.2 requires a documented information security policy. This is a Tier 1 document — the apex of the information security documentation hierarchy.

**Mandatory content (ISO 27001 Clause 5.2):**
- Appropriate to the purpose of the organisation
- Includes information security objectives or provides a framework for setting them
- Includes a commitment to satisfy applicable information security requirements
- Includes a commitment to continual improvement of the ISMS

**Additional recommended content:**
- Statement of management commitment and support
- Brief description of the scope of the ISMS
- Reference to topic-specific policies
- Consequences of non-compliance

**What the overarching policy does NOT contain:**
- Specific technical requirements (those are in standards)
- Procedural detail (those are in procedures)
- A list of every system or control (too much operational detail for a board-level document)

**Length**: Typically 1–4 pages. If the information security policy is 30 pages long, it has incorporated content that belongs in standards or procedures.

**Approval**: The highest level of management — CEO, Managing Director, or equivalent. In listed companies, sometimes the board.

**Review cycle**: Annually and when significant changes occur.

---

## Topic-Specific Policies

ISO 27002:2022 recommends topic-specific policies for each major information security subject area. These are Tier 1 documents (policies), but they provide more detail than the overarching information security policy on their specific topics.

**Recommended topic-specific policies (ISO 27002:2022):**

| Topic | Policy title | Primary ISO 27001 reference |
|---|---|---|
| Access control | Access Control Policy | A.5.15 |
| Physical security | Physical Security Policy | A.7.1–A.7.3 |
| Asset management | Asset Management Policy | A.5.9–A.5.11 |
| Information classification | Information Classification Policy | A.5.12 |
| Acceptable use | Acceptable Use Policy | A.5.10 |
| Cryptography | Cryptography Policy | A.8.24 |
| Information transfer | Information Transfer Policy | A.5.14 |
| Secure development | Secure Development Policy | A.8.25 |
| Supplier security | Supplier Security Policy | A.5.19 |
| Incident management | Incident Management Policy | A.5.24 |
| Business continuity | Business Continuity Policy | A.5.29 |
| Remote working | Remote Working Policy | A.6.7 |
| Clear desk and screen | Clear Desk and Screen Policy | A.7.7 |

**Topic-specific policy vs overarching policy**: The overarching information security policy commits the organisation to information security. Topic-specific policies direct behaviour in specific domains. Both are necessary; neither substitutes for the other.

---

## Standards: The Bridge Between Policy and Operation

Standards are the most operationally consequential tier — they contain the measurable requirements that can be tested and audited. A standard that says "passwords must be minimum 12 characters" creates a concrete, testable requirement. A policy that says "the organisation shall manage user authentication appropriately" is unauditable without a supporting standard.

**Building standards:**
- Derive each standard requirement from a specific policy statement
- Make each requirement specific and measurable
- Use authoritative references (NCSC guidance, CIS Benchmarks, NIST guidelines, vendor security baselines)
- Define exceptions process (not all requirements can be met in all circumstances)
- Version-control standards and record changes

**Standards library structure:**

```
Standards Library/
├── Identity and Access Management/
│   ├── Password Standard v2.3
│   ├── MFA Standard v1.4
│   └── Privileged Access Standard v1.1
├── Endpoint Security/
│   ├── Workstation Configuration Standard v3.1
│   ├── Mobile Device Standard v2.0
│   └── Patch Management Standard v2.4
├── Network Security/
│   ├── Network Architecture Standard v1.3
│   ├── Firewall Management Standard v2.1
│   └── Encryption in Transit Standard v2.0
├── Data Security/
│   ├── Encryption at Rest Standard v2.2
│   ├── Data Classification Standard v1.5
│   └── Data Retention Standard v2.0
└── Development/
    ├── Secure Coding Standard v1.2
    └── SDLC Security Standard v1.0
```

---

## Procedures: The Operational Layer

Procedures are the most granular tier — they provide step-by-step operational instructions. Every security control that requires human action to execute has an associated procedure (or should).

**Key procedures for an ISO 27001 ISMS:**

- User account lifecycle procedures (provisioning, modification, deprovision)
- Access review procedures (how to conduct quarterly access reviews)
- Vulnerability scanning procedures (how to run and interpret scans)
- Patch deployment procedures (how to deploy patches to different system tiers)
- Firewall rule change procedures (request, approval, implementation, documentation)
- Security incident reporting and initial response procedures
- Backup execution and verification procedures
- Data restoration procedures
- Physical visitor management procedures
- Clear desk check procedures
- Security awareness training delivery procedures
- BCP activation procedures (per function)

**Procedure writing discipline:**
- Number every step
- Use active voice and imperative mood ("Click the button" not "The button should be clicked")
- Reference specific system names, menu paths, and field names
- Include screenshots where helpful
- Include what to do if a step fails
- Include who to escalate to if the procedure cannot be completed

---

## Documentation Governance

A policy framework without governance becomes outdated, contradictory, and unreliable. Effective documentation governance requires:

**Document control:**
- Version numbering (major.minor — v2.1)
- Effective date
- Review date
- Owner (named individual responsible for keeping it current)
- Approver (named individual or role that approved the current version)
- Change history (record of what changed between versions)
- Distribution and access control (who can see and modify each document)

**Review cycle:**
- Policies: Annual review; triggered review following significant changes
- Standards: Annual review; triggered review following technology changes or new threats
- Procedures: Review when the systems or processes they describe change; annual confirmation of currency
- Guidelines: Annual review; updated when best practices evolve

**Document repository:**
- Single, authoritative repository for all policy documents
- All staff can access policies and their relevant procedures
- Previous versions archived (not deleted) — needed for audit purposes
- Access-controlled editing (only owners can modify; all staff can read)

**Lifecycle management:**
- New documents: Drafted → reviewed by stakeholders → approved → published
- Updated documents: Owner proposes changes → reviewed → approved → previous version archived → new version published
- Retired documents: Explicitly marked as superseded or retired; archived; cross-references updated

---

## Common Mistakes and Failures

**1. Everything written as a "policy."**
The organisation has one giant document called the "Information Security Policy" that contains policies, standards, procedures, and guidelines all in one 80-page document. When the password requirements change, the entire document must go through board-level approval. When a procedure changes, the policy version number changes, creating a false impression of policy revision.

**2. Policies written by IT, for IT.**
Policies that use technical language and reference specific technologies — accessible only to IT staff, inaccessible to other business units. Policies must be readable by all staff within the scope.

**3. Procedures that are too vague.**
"Respond to the incident appropriately" is not a procedure. Procedures must be specific enough for execution by a competent but unfamiliar person.

**4. Policies with no review date.**
"Review date: TBD." Documents without review dates are never reviewed. Set explicit review dates at approval.

**5. No exceptions process.**
Standards with no defined exceptions process create compliance problems when a legitimate technical constraint prevents implementation. Every standard should include an exceptions process: how to request an exception, who approves it, what compensating controls are required, how the exception is documented.

**6. Documents approved in the abstract, never communicated.**
A beautifully approved policy framework that sits in a SharePoint site nobody visits. Policies must be actively communicated — induction training, annual refresher, prominent accessibility on the intranet.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Stage 1 auditors review documented information — they assess whether the policy framework is complete (does the organisation have required policies?), current (have they been reviewed within their defined cycle?), and appropriate (are they specific enough to be useful without being too prescriptive?).
- A.5.1 requires an information security policy. Auditors will look for the overarching policy AND topic-specific policies. Finding that the organisation has only an overarching policy without topic-specific policies for major areas (access control, cryptography, incident management) is a common Stage 1 finding.

**CISM:**
- Domain 1 (Governance) — the policy hierarchy is a core governance concept. CISMs must understand the structure, content, and governance of the policy framework.

**CRISC:**
- Domain 1 (IT Risk Identification) — policies and standards establish the baseline against which risk deviations are assessed. Understanding the policy hierarchy helps CRISC professionals assess compliance risk.

**CISSP:**
- Domain 1 (Security and Risk Management) — policies, standards, procedures, and guidelines are specifically tested. Know the four tiers, their characteristics, and examples of each.

---

## GUARDIAN's Take

The documentation hierarchy is one of the most undervalued concepts in information security governance — because it seems administrative rather than technical, and because the consequences of getting it wrong are diffuse rather than immediate.

But the organisations that get it wrong pay a persistent tax: their policies are ignored because they are too long and too technical; their standards are unenforced because nobody knows what they say; their procedures are not followed because they are too vague or too outdated; their guidelines are confused with requirements. The documentation framework becomes compliance theatre — documents that satisfy auditors but direct nobody.

The organisations that get it right build something more valuable: a governance infrastructure that actually directs behaviour. Staff know what is expected of them. Security teams can test compliance against specific, measurable standards. Auditors can follow the logic from policy intent to operational execution. Changes can be made at the right tier with the right governance process.

Write policies for management. Write standards for security teams. Write procedures for the people who execute them. Write guidelines for anyone who wants to do it better. Keep them separate, keep them current, keep them maintained. That is the documentation framework that works.

---
*Module: Module 9 — Policies, Standards, Procedures | Guardian Curriculum*
