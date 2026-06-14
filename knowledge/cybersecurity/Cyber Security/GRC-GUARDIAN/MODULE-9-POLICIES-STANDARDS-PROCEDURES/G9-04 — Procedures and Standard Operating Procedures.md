---
tags: [guardian, grc, module-9, procedures, sops, operational, documentation, runbooks]
module: 9
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-25
guardian-refs: ["G9-01 — The Policy Hierarchy", "G9-02 — Writing Effective Security Policies", "G9-03 — Standards and Baselines", "G4-01 — A.5.37 Documented Operating Procedures"]
---

# G9-04 — Procedures and Standard Operating Procedures

> [!abstract] What This Note Covers
> By the end of this note, you will understand what makes a good security procedure, how to write Standard Operating Procedures (SOPs) that people actually follow, which procedures are most critical for an ISO 27001 ISMS, and how procedures connect standards to operational execution.

---

## Why This Exists

A standard defines what must be achieved. A procedure defines how to achieve it. Without procedures, standards remain aspirational — staff know that passwords must be 12 characters but have no consistent process for resetting them; IT teams know that new user accounts must be provisioned correctly but have no step-by-step guide, leading to inconsistent execution and missed security steps.

Procedures are the operational instructions that make security controls reliable and repeatable. They ensure that critical security activities are executed correctly regardless of who performs them, reducing dependence on individual knowledge and creating the consistency that enables auditing and improvement.

ISO 27001 Annex A control A.5.37 (Documented operating procedures) requires procedures to be documented, maintained, and made available to personnel who need them. But the real value of procedures is not compliance — it is operational consistency, reduced error rates, and faster onboarding of new staff.

---

## What Makes a Good Security Procedure

A procedure must satisfy a single fundamental test: **a competent but unfamiliar person can execute it correctly, without additional help, under operational conditions**.

This test reveals the most common procedure failure: documents written by experts for experts, filled with assumed knowledge, missing steps that "everyone knows," and using system-specific terminology without definition. These documents are useless to anyone who wasn't involved in writing them.

### The Seven Characteristics of an Effective Procedure

**1. Completeness**: Every step is present. There are no assumed steps, no "you know the rest," no "as usual, do X." If the step must be done, it must be written.

**2. Specificity**: Each step names the specific system, menu, field, or action required. Not "configure the firewall" but "In the Palo Alto Panorama console, navigate to Policies → Security → Add Rule."

**3. Sequencing**: Steps are numbered and in the correct order. Dependencies between steps are explicit ("complete step 3 before proceeding to step 4 — the account will not be active until step 3 is confirmed").

**4. Decision points**: Where the procedure has conditional branches ("if X, do Y; if Z, do W"), these are explicit. Procedures that assume a single path fail when reality diverges.

**5. Verification**: After critical steps, the procedure specifies how to verify the step completed correctly. Not just "apply the patch" but "apply the patch, then verify using [command] that the system reports version [X.Y.Z]."

**6. Failure handling**: What to do if a step fails. "If the account creation returns an error, do not proceed — escalate to the IT Security team at [contact]."

**7. Who and where**: The procedure states who performs it (role, not name) and where it is performed (which system, which location, which environment).

---

## Procedure Structure: A Working Template

```
[PROCEDURE TITLE]
Procedure ID: [PROC-SEC-XXX]
Version: [X.X]
Effective Date: [DD MMM YYYY]
Owner: [Role/Name]
Last Reviewed: [DD MMM YYYY]

PURPOSE
What this procedure achieves and when it should be used.

SCOPE
Which systems, environments, or situations this procedure applies to.
Any explicit exclusions.

PREREQUISITES
What must be in place before this procedure can be executed:
- Required access/permissions
- Required tools or systems
- Any preconditions that must be confirmed

ROLES
Who performs each section:
- Primary executor: [Role]
- Approver (if required): [Role]
- Reviewer/verifier: [Role]

PROCEDURE

Step 1: [Action title]
[Detailed description of the step, including specific system navigation, 
field values, commands, or settings]

Expected result: [What the system/environment should show after this step]
If this step fails: [What to do if the expected result is not observed]

Step 2: [Action title]
...

VERIFICATION
How to confirm the procedure has been completed successfully.
[Specific checks, commands, or evidence to verify completion]

RECORD-KEEPING
What must be documented following completion:
- What to record (e.g. ticket number, date, user ID, system)
- Where to record it (e.g. ServiceNow; the access review spreadsheet; the SIEM)
- Who is responsible for the record

ESCALATION
When to escalate and to whom:
- [Condition requiring escalation] → [Contact/role to escalate to]

RELATED DOCUMENTS
- [Standard this procedure implements]
- [Policy this procedure supports]
- [Related procedures]

CHANGE HISTORY
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Date] | [Name] | Initial version |
| 1.1 | [Date] | [Name] | [Change description] |
```

---

## Critical Security Procedures for an ISO 27001 ISMS

The following procedures are most frequently referenced in ISO 27001 audits and are most critical for consistent security programme operation:

### 1. User Account Provisioning Procedure

**Why critical**: Incorrect provisioning creates access control failures. Missing steps (MFA enrollment, group membership, access review scheduling) leave security gaps that persist for the life of the account.

**Key steps:**
1. Receive and verify approved access request (confirm business justification, approver identity, requested access scope)
2. Create the user account in the identity provider (AD, Azure AD, Okta)
3. Assign role-based group memberships (only approved roles — no ad hoc access)
4. Configure password (temporary; must be changed on first login)
5. Enroll MFA (mandatory within 48 hours; procedure specifies how to trigger enrollment)
6. Grant application access as specified in the approved request
7. Send welcome communication with security requirements to the new user
8. Add account to the next scheduled access review cycle
9. Update the access register
10. Close the provisioning ticket with evidence of completion

**Record-keeping**: Provisioning ticket closed with: account name, access granted, groups assigned, MFA status, date, and provisioner ID.

### 2. User Account Deprovision Procedure

**Why critical**: Failure to deprovision promptly is one of the most common ISO 27001 findings and a significant access control risk. Former employees and contractors retaining access is both a security gap and a compliance violation.

**Key steps:**
1. Receive departure notification (from HR, line manager, or self-service)
2. **Immediately** (same business day) disable the account (not delete — disable, to preserve audit trail)
3. Remove MFA enrollment
4. Disable all VPN, remote access, and cloud access
5. Revoke all application access
6. Suspend or redirect email (per business requirements)
7. Confirm asset return with HR/line manager
8. Add to the offboarding audit trail
9. Schedule account deletion after 90-day retention period (preserves email for investigation if needed; complies with most data retention requirements)
10. Update the access register

**Time-critical step**: Step 2 (account disable) must occur on the same business day as notification for voluntary departures, and simultaneously with or immediately before the departure conversation for involuntary departures (dismissal, redundancy, suspected fraud).

**Evidence**: Timestamp of account disable logged in the identity provider audit log — must be ≤ 24 hours from confirmed departure date (preferably same-day).

### 3. Access Review Procedure

**Why critical**: Access reviews are required by ISO 27001 (A.5.18), PCI DSS (Requirement 7), and SOC 2 (CC6.3). Poorly executed reviews — tick-box exercises without genuine review — provide no security value.

**Key steps:**
1. Generate access report from the identity provider (show all accounts, their group memberships, their last login date)
2. Distribute to business unit managers (the people who know whether access is still required)
3. Managers review and mark each account: Confirm (access appropriate) / Modify (access needs changing) / Revoke (user no longer needs access)
4. Collect completed reviews within the defined deadline (typically 5 business days)
5. Chase non-responders (escalate to their manager if no response after 3 business days)
6. Process changes: remove access for Revoke decisions; modify access for Modify decisions
7. Escalate unreviewed accounts that cannot be reached for review — apply the precautionary principle (revoke access if the business owner cannot confirm it is required)
8. Document the review outcome: total accounts reviewed, changes made, any exceptions
9. File the completed review record in the evidence repository
10. Report completion to the CISO

**Common failure**: Managers who click "confirm all" without genuinely reviewing each account. The procedure should require managers to attest that they have genuinely reviewed each account — not just submitted the form.

### 4. Security Incident Reporting Procedure (Staff-Facing)

**Why critical**: A security incident that is not reported cannot be investigated, contained, or used for improvement. The reporting procedure must be so simple that there is no reason not to use it.

**Keep this procedure extremely brief** — complexity is the enemy of reporting culture.

**Steps for all staff:**
1. If you suspect or observe a security incident, report it immediately through the security incident reporting channel: [specific email address / helpdesk ticket category / phone number]
2. Include in your report:
   - What you observed (describe what happened)
   - When it happened (approximate time)
   - Which systems or data were involved (if known)
   - Your contact details (for follow-up)
3. Do not: attempt to investigate yourself; discuss the incident with colleagues before reporting; delete or modify anything that may be evidence
4. You will receive an acknowledgement within [X hours]
5. If you need urgent assistance (active attack, system actively compromised), call [24/7 security number] immediately

**Key principle**: Zero friction. The simpler the procedure, the more incidents get reported. Every barrier to reporting increases the proportion of incidents that go unreported.

### 5. Vulnerability Management Procedure

**Why critical**: Vulnerability management is only effective if the scanning, prioritisation, and remediation steps are consistently executed. Ad hoc vulnerability management produces inconsistent results and missed critical patches.

**Key steps:**

**Weekly external scan:**
1. Log into [scanner] and initiate scheduled external scan (or confirm automated scan completed)
2. Export scan results report
3. Review Critical and High findings against the exception register (filter out approved exceptions)
4. Create remediation tickets for any new Critical/High findings (Priority 1 for Critical; Priority 2 for High)
5. Assign tickets to system owners based on the asset inventory
6. Record scan completion and finding counts in the vulnerability tracker

**Remediation verification:**
1. When a remediation ticket is marked complete by the system owner, trigger a re-scan of the affected system
2. Confirm the vulnerability is closed in the re-scan results
3. Update the vulnerability tracker with closure date and verification evidence
4. If re-scan shows vulnerability still present: re-open the ticket with escalation flag

**Monthly internal scan:**
(Similar structure for internal scan cadence)

**Exception process:**
1. System owner submits exception request: system, CVE, reason for delay, compensating controls, proposed closure date
2. CISO reviews and approves (or requires additional compensating controls)
3. Exception recorded in the vulnerability exception register
4. Exception reviewed monthly for progress

### 6. Firewall Rule Change Procedure

**Why critical**: Unauthorised or undocumented firewall rule changes are a common source of security degradation. An effective change procedure ensures every rule change is reviewed, approved, implemented correctly, and documented.

**Steps:**
1. Requestor submits firewall rule change request via [change management system] including: source, destination, port/protocol, business justification, duration (permanent or temporary)
2. Security team reviews the request: is the rule necessary? is the scope minimal (no broader than required)? are there existing rules that already cover this? does this introduce risk?
3. If approved: change is scheduled in the maintenance window and communicated to affected parties
4. If rejected: requestor notified with reason; may escalate to CISO
5. Implementation: Network team implements the rule using [specific CLI/GUI process]; documents the rule with reference to the change request
6. Post-implementation verification: test that the permitted traffic flows; test that unauthorised traffic is still blocked
7. Documentation: update the firewall rule register with: rule number, rule details, business justification, change request reference, implementation date, next review date
8. Change request closed with implementation evidence

**Critical**: Every firewall rule must have a business justification. Rules with no justification are candidates for removal at the next firewall rule review.

### 7. Backup Verification and Restoration Test Procedure

**Why critical**: Backups that have never been tested may be unusable. This procedure ensures that backup data is valid and can be restored within the required RTO.

**Monthly backup verification:**
1. Log into the backup management console
2. Review the backup job summary for the previous month: confirm all scheduled jobs completed; identify any failed jobs
3. For failed jobs: investigate cause; initiate manual backup or ticket for remediation
4. Export the monthly backup completion report and file in the evidence repository

**Quarterly restoration test:**
1. Select a test candidate from the Tier 1 and Tier 2 system list (rotating monthly coverage across the year)
2. Notify the system owner of the planned restoration test
3. Initiate restoration to the test environment (do not restore to production for a test)
4. Record start time of restoration
5. Verify the restored system: confirm data integrity (compare key records against the source); confirm system functions correctly in the test environment
6. Record completion time (compare against the system's RTO)
7. Document the restoration test: system tested, backup date used, test environment, start time, completion time, success/failure, any anomalies
8. File the restoration test record in the evidence repository
9. Report results to the CISO: include actual restoration time vs RTO

---

## Procedure Maintenance

### Who Maintains Procedures

Procedures must have a named owner responsible for keeping them current. The owner is typically the person responsible for the process the procedure describes:
- Access provisioning procedure: IT Operations Manager
- Incident reporting procedure: Security Manager / CISO
- Vulnerability management procedure: IT Security Engineer
- Firewall rule change procedure: Network Team Lead

### When to Update

Procedures must be reviewed and updated when:
- The system or tool described changes (new version, new interface, migration to a new platform)
- The process changes (new step required, step removed, escalation path changed)
- The related standard changes (new requirement that affects how the procedure must be executed)
- A procedure fails during operational execution (evidence that a step was missing or unclear)
- A procedure is found to be non-compliant during internal audit

**The system change trigger**: This is the most commonly missed trigger. Organisations update their systems and forget to update their procedures. Staff then follow procedures that reference systems that no longer exist, menus that have moved, or commands that are no longer valid. The change management process should include a procedure update step: "Review and update any procedures that reference this system/process."

### Procedure Testing

Procedures should be tested before being finalised:
- Have someone unfamiliar with the procedure (but competent in the relevant area) execute it
- Document any points where they had to ask questions, guess at steps, or encounter errors
- Update the procedure to address every identified gap

For critical procedures (account provisioning, incident response, disaster recovery), conduct annual walk-throughs or tabletop exercises to verify that the procedure remains current and effective.

---

## Runbooks vs Procedures

In technology operations, **runbooks** are a common format for operational procedures. A runbook is typically a detailed procedure document for a specific operational task — often more technical than a general security procedure.

**Runbook characteristics:**
- Technical and detailed — specific commands, screenshots, error codes
- Often system-specific (an AWS runbook; a SQL Server runbook)
- May include decision trees for complex conditional scenarios
- Often living documents updated frequently as systems change

**When to use runbooks instead of procedures**: For complex, system-specific technical tasks (data centre failover; database corruption recovery; cloud security group hardening) where the level of technical detail required exceeds what a standard procedure format can accommodate.

**Runbooks and ISO 27001**: Runbooks satisfy A.5.37 (Documented operating procedures) when they cover the key security operations. The same governance (versioning, review, access control) applies to runbooks as to procedures.

---

## Common Mistakes and Failures

**1. Procedures written by system administrators, for system administrators.**
The procedure assumes the reader knows the system. Non-obvious steps are skipped. Error handling is absent. A new team member following the procedure makes mistakes that a veteran would not.

**2. Procedures referencing systems that no longer exist.**
"Log into the old firewall management interface at [IP address]" — the firewall was replaced 18 months ago. The procedure is useless and potentially harmful (staff try to follow it and fail, then improvise without documentation).

**3. Procedure says what to do, not how to verify it was done.**
Each step describes an action but not the expected result. Staff complete steps without confirming they worked, leading to errors propagating through the procedure.

**4. Critical steps buried in paragraphs.**
The most important step — "before proceeding, confirm that MFA is enrolled" — is in the middle of a paragraph, not a numbered step. It is missed consistently.

**5. Procedures not accessible when needed.**
The disaster recovery procedure is stored on the primary SharePoint site. When the SharePoint site is unavailable (because this is a disaster recovery scenario), nobody can access the procedure. Critical procedures must be accessible through multiple channels.

**6. No record-keeping guidance.**
The procedure describes how to perform the task but not what evidence to capture. When the auditor asks for evidence that the access review was completed on schedule, there is nothing to provide.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- A.5.37 requires documented operating procedures. Auditors will request key procedures during Stage 2 and assess them for completeness, currency, and accessibility. Common finding: procedures exist for some activities but not others; or procedures exist but are outdated and no longer reflect current systems.
- Evidence of procedure execution is also assessed — not just that procedures exist, but that they are followed. Access provisioning tickets, vulnerability tracking records, and firewall change requests are all evidence of procedure execution.

**CISM:**
- Domain 3 (Security Programme) — documented procedures are part of the security programme infrastructure. CISMs must understand what procedures are required, who owns them, and how they are governed.

**CISSP:**
- Domain 7 (Security Operations) — SOPs for key security operations are specifically tested. Know what good procedures look like and which procedures are most critical for an information security programme.

---

## GUARDIAN's Take

Procedures are the most undervalued tier of the documentation hierarchy — because they are the most operational, the most specific, and the most quickly outdated. They require ongoing maintenance that policies rarely do. They are the first to break when systems change and the last to be updated when they do.

But they are also the tier that most directly determines whether security controls work in practice. A technically perfect access control policy and standard produce nothing if the provisioning procedure is incomplete and MFA enrollment is routinely missed. A vulnerability management standard with aggressive patch SLAs produces nothing if the scanning procedure is unclear and the remediation tracking is inconsistent.

Write procedures for the person who will execute them under operational conditions — not the person who designed the system, not the auditor reviewing the document, but the IT engineer at 2am handling an incident response or the new security analyst processing their first access request.

That person needs complete steps, clear verification checks, explicit failure handling, and immediate access to the right escalation contact. Give them that, and your security controls will execute reliably. Give them a policy document and expect them to improvise the rest, and you will have compliance documentation and security theatre.

---
*Module: Module 9 — Policies, Standards, Procedures | Guardian Curriculum*
