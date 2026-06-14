---
tags: [guardian, grc, module-4, iso27002, control-testing, evidence-collection, audit-evidence, control-effectiveness]
module: 4
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G3-08 — ISO 27001 Clause 9 — Performance Evaluation", "G3-14 — Internal Audit", "G3-15 — Nonconformities", "G4-04 — Technological Controls", "G4-05 — Control Selection and Justification", "G2-07 — Residual Risk and Risk Acceptance"]
---

# G4-06 — Control Testing and Evidence Collection

> [!abstract] What This Note Covers
> By the end of this note, you will understand how to test controls rigorously, what constitutes adequate evidence of control operation, how to structure an evidence programme that supports both ongoing monitoring and external audit, and the difference between a control that appears implemented and a control that genuinely works.

---

## Why This Exists

A control listed as "implemented" in the SoA is not the same as a control that is effectively protecting the organisation. The gap between these two states — between nominal implementation and actual effectiveness — is one of the most significant sources of false assurance in information security.

Capital One had a Web Application Firewall. It was "implemented." It was misconfigured in a way that made it ineffective against the specific attack used. The ISMS risk assessment likely showed the WAF as an existing control reducing residual risk. The actual residual risk was significantly higher because the control was not working as assumed.

Control testing is the discipline that closes this gap. It is the ongoing, systematic verification that controls are operating as designed, achieving their intended security outcomes, and continuing to provide the protection the risk assessment assumed they would. Without control testing, the ISMS operates on the assumption that controls work — an assumption that erodes over time as configurations drift, staff change, technology evolves, and threats develop.

Evidence collection is the documentation dimension of control testing — the organised body of proof that controls are operating, available for internal review, management reporting, and external audit. Without good evidence collection, even genuinely effective controls cannot be demonstrated to auditors, which undermines certification and creates false confidence about audit readiness.

---

## The Purpose of Control Testing

Control testing serves four distinct purposes:

**1. Assurance**: Confirming that controls are working as intended and that the residual risk assessment remains valid. If the residual risk was assessed on the assumption that MFA is fully implemented, control testing verifies that MFA is indeed fully implemented — not 85% implemented with 15% exceptions.

**2. Detection**: Identifying control failures before they are exploited. A control that has silently degraded — logging disabled during a system migration, access control exceptions not cleaned up, backup jobs silently failing — is a risk that the risk register does not reflect. Testing finds these before an attacker does.

**3. Improvement**: Generating data that drives control refinement. If phishing simulation results show a 20% click rate despite annual awareness training, the training frequency or format needs to change. Testing without feedback loops is observation; testing with feedback loops is management.

**4. Evidence**: Producing the documentary proof required for ISO 27001 certification, regulatory compliance demonstration, and management assurance. The evidence produced by control testing is the substance behind every "Yes — Implemented" entry in the SoA.

---

## Control Testing Methods

### Method 1: Configuration Review

**What it tests**: Whether technical controls are configured correctly — not whether they were configured correctly at deployment, but whether they remain correctly configured now.

**How it works**: Compare the current system configuration against the defined secure baseline (A.8.9) or the configuration specification in the ISMS documentation.

**Examples:**
- Verify that MFA is enforced for all users in Azure AD (not just enabled as an option — *enforced*)
- Verify that TLS 1.0 and 1.1 are disabled on all web servers
- Verify that S3 buckets are not publicly accessible
- Verify that password complexity settings match the password policy
- Verify that logging is enabled and configured to capture required events

**Evidence produced**: Configuration screenshots, exported configuration files, compliance scan outputs

**Limitations**: Configuration review confirms the control is set up correctly. It does not confirm the control is *working* — a correctly configured firewall rule can still be bypassed if there is an undiscovered path around it.

---

### Method 2: Sampling and Record Review

**What it tests**: Whether process controls are being executed consistently — not just whether the process is defined, but whether it is being followed.

**How it works**: Select a representative sample from a population of control execution instances. For each sampled instance, verify that the control was applied correctly.

**Sample selection principles:**
- Random sampling preferred (prevents cherry-picking of favourable examples)
- Sample size proportionate to population and risk level (larger samples for high-risk controls; 20–30 is typically sufficient for populations up to a few hundred)
- Bias toward higher-risk instances (new joiners, privileged users, external-facing systems) within a random framework
- Document the sampling methodology so the sample can be reproduced or challenged

**Examples:**
- Sample 25 user accounts → verify each has MFA enrolled and access rights match current role
- Sample 10 new joiners from last quarter → verify each received security training within their first 30 days
- Sample 5 supplier contracts → verify each contains the required security clauses
- Sample 15 critical CVEs from last quarter → verify each was patched within the defined SLA
- Sample 8 access review records → verify each review was completed on schedule and changes actioned

**Evidence produced**: Sampling record (which instances were selected, the criterion used), testing results (for each sampled instance, what was found), exception documentation (where instances failed the test), summary conclusion (pass/fail rate, finding classification)

---

### Method 3: Functional Testing

**What it tests**: Whether controls function correctly when triggered — not just whether they are configured, but whether they actually work in the way they are supposed to.

**How it works**: Deliberately trigger the control scenario and observe the outcome.

**Examples:**
- **MFA functional test**: Attempt to log in to a remote system without MFA — confirm access is denied. Log in with valid credentials and MFA — confirm access is granted. (This tests that MFA is actually enforced, not just enrolled.)
- **Backup restoration test**: Select a system or dataset; restore from the most recent backup; verify that data is complete and the system functions correctly; measure time to restoration against RTO. (This tests that backups actually work, not just that they complete.)
- **Firewall test**: Attempt to connect to a port that should be blocked by the firewall — confirm the connection is rejected. (This tests that the firewall rule is actually enforced, not just configured.)
- **Incident reporting test**: Submit a test security incident report through the defined reporting channel — confirm it is received, acknowledged, and triaged within the defined SLA.
- **Phishing simulation**: Send a simulated phishing email to a sample of staff — measure click rate, credential submission rate, and reporting rate. (This tests whether security awareness training has produced the intended behaviour change.)
- **Physical access test**: Attempt to tailgate through a secure door — observe whether staff challenge the attempt or allow it. (This tests whether physical access training has changed behaviour.)

**Evidence produced**: Test design documentation (what was tested, under what conditions, what outcome was expected), test execution records (who performed the test, when, what the outcome was), any findings requiring remediation

---

### Method 4: Penetration Testing

**What it tests**: Whether technical controls can be bypassed by a skilled adversary using realistic attack techniques.

**Why it differs from configuration review and functional testing**: Configuration review confirms the control is set up correctly. Functional testing confirms the control works as designed. Penetration testing challenges the design itself — asking "can a skilled attacker bypass this control even when it is correctly configured and functioning?"

**Types:**

**External penetration test**: Simulates an external attacker targeting internet-facing systems. Tests: external attack surface, web application vulnerabilities, authentication weaknesses, SSL/TLS configuration, exposed services.

**Internal penetration test**: Simulates an attacker who has gained an initial foothold inside the network (e.g. after a phishing attack). Tests: lateral movement, privilege escalation, network segmentation effectiveness, internal system vulnerabilities.

**Web application penetration test**: Focused assessment of specific web applications. Tests: OWASP Top 10 vulnerabilities (injection, broken access control, cryptographic failures, etc.).

**Social engineering test**: Simulates phishing, vishing, or physical social engineering attacks. Tests: staff susceptibility, process vulnerabilities, physical security.

**Red team exercise**: Extended, multi-vector adversarial simulation. Tests: the entire security programme holistically, from initial access through to objective achievement. Finds attack paths that individual control tests miss.

**Frequency:**
- External penetration test: annually minimum; after significant infrastructure changes
- Internal penetration test: annually; after major network changes
- Web application test: annually; after significant code releases
- Red team exercise: biannually or annually for mature organisations

**Evidence produced**: Penetration test report (scope, methodology, findings, risk ratings, recommendations). This is one of the most important evidence artefacts in an ISMS — auditors and regulators regard it as strong evidence of genuine control testing.

---

### Method 5: Automated Continuous Monitoring

**What it tests**: Whether controls remain in their required state over time — addressing configuration drift, new vulnerabilities, and emerging exceptions.

**How it works**: Automated tools continuously compare the current state of controls against the defined baseline or policy, generating alerts when deviations are detected.

**Examples:**
- **Vulnerability scanning** (weekly/continuous): Identifies unpatched vulnerabilities as they emerge — does not wait for the annual assessment
- **Configuration compliance scanning** (continuous): Detects when system configurations drift from the secure baseline (A.8.9)
- **DLP alerts** (continuous): Detects policy violations in email, endpoint, and cloud usage in real time
- **SIEM alerts** (continuous): Detects anomalous behaviour indicating control failures or active attacks
- **Cloud Security Posture Management (CSPM)** (continuous): Scans cloud configurations for deviations from security best practice (publicly accessible resources, overly permissive IAM policies, disabled logging)
- **Privileged access monitoring** (continuous): Alerts on anomalous privileged account activity

**Evidence produced**: Continuous monitoring dashboard and reports, alert records, evidence of alerts investigated and actioned, trend data over time

**Advantage over periodic testing**: Continuous monitoring catches control failures between periodic tests. A misconfiguration introduced during a Tuesday morning change is detected by Wednesday morning — not at the next quarterly scan.

---

## Evidence Collection: Building an Audit-Ready Evidence Base

### The Evidence Framework

An evidence framework is the systematic structure for collecting, organising, and maintaining evidence of control operation. It answers: for each applicable control in the SoA, what evidence exists, where is it stored, how current is it, and who is responsible for maintaining it?

**Evidence framework structure:**

| Control | Evidence type | Source | Storage location | Review frequency | Owner |
|---|---|---|---|---|---|
| A.8.5 (Secure authentication / MFA) | MFA coverage report | Azure AD > MFA status export | /ISMS/Evidence/A.8.5/ | Monthly | IT Operations |
| A.8.5 | MFA functional test record | IT Security test records | /ISMS/Evidence/A.8.5/ | Quarterly | IT Security |
| A.8.8 (Vulnerability management) | Vulnerability scan report | Qualys/Nessus/Tenable console | /ISMS/Evidence/A.8.8/ | Weekly (auto-generated) | IT Operations |
| A.8.8 | Patch compliance report | WSUS/SCCM/Intune report | /ISMS/Evidence/A.8.8/ | Monthly | IT Operations |
| A.8.13 (Backup) | Backup completion logs | Backup tool console | /ISMS/Evidence/A.8.13/ | Monthly | IT Operations |
| A.8.13 | Restoration test record | IT Security test records | /ISMS/Evidence/A.8.13/ | Quarterly | IT Operations |
| A.6.3 (Awareness training) | Training completion report | LMS export | /ISMS/Evidence/A.6.3/ | Monthly | HR |
| A.6.3 | Phishing simulation results | Simulation platform report | /ISMS/Evidence/A.6.3/ | Quarterly | IT Security |

### Evidence Quality Standards

Not all evidence is equal. Evidence must be:

**Current**: Evidence that demonstrates a control was operating 18 months ago provides no assurance about the current state. Evidence must be recent — ideally within the last review period (monthly for high-frequency controls; quarterly for periodic controls).

**Specific**: "Security is good" is not evidence. "MFA coverage report dated 2026-04-15 shows 98.7% of user accounts enrolled in MFA (297 of 301 accounts). The 4 exceptions are service accounts documented in the exception register with risk owner sign-off" is evidence.

**Sufficient**: A single data point is rarely sufficient to demonstrate consistent operation. Trend data (three consecutive months of phishing simulation results; 12 months of patch compliance reports) demonstrates sustained operation, not a one-time event.

**Reliable**: Evidence from system-generated sources (automated reports, audit logs, configuration exports) is more reliable than manually prepared documents. System-generated evidence is harder to fabricate and has an implicit timestamp from the system that produced it.

**Independently verifiable**: Ideally, evidence can be independently verified by the auditor — by rerunning the query, by checking the system configuration directly, by reviewing the audit log. Evidence that requires trusting the assertions of the same team responsible for operating the control is less reliable.

**Tamper-evident**: Evidence stored in a location where it can be modified after the fact (a shared folder, a personal laptop) is less reliable than evidence in a write-protected repository, a log management system with integrity controls, or a third-party system the ISMS team does not administer.

### Evidence Storage and Organisation

The evidence base must be organised so that auditors — both internal and external — can navigate it efficiently. Recommended structure:

```
/ISMS/Evidence/
├── Category-5-Organisational/
│   ├── A.5.1-Policies/
│   │   ├── Information-Security-Policy-v3.2-2026-01-15.pdf
│   │   ├── Policy-Review-Record-2026-01-15.docx
│   │   └── Policy-Communication-Evidence-2026-01-15.pdf
│   ├── A.5.18-Access-Rights/
│   │   ├── Access-Review-Q1-2026-Finance.xlsx
│   │   ├── Access-Review-Q1-2026-IT.xlsx
│   │   └── Access-Review-Action-Log-Q1-2026.xlsx
│   └── ...
├── Category-6-People/
│   ├── A.6.3-Awareness/
│   │   ├── Training-Completion-Report-2026-03.pdf
│   │   ├── Phishing-Simulation-Q1-2026.pdf
│   │   └── Training-Content-2026-version.pdf
│   └── ...
├── Category-7-Physical/
│   └── ...
├── Category-8-Technological/
│   ├── A.8.5-MFA/
│   │   ├── MFA-Coverage-Report-2026-04-15.pdf
│   │   └── MFA-Functional-Test-Q1-2026.docx
│   ├── A.8.8-Vulnerabilities/
│   │   ├── Vulnerability-Scan-2026-04-12.pdf
│   │   ├── Patch-Compliance-Report-Q1-2026.xlsx
│   │   └── Penetration-Test-Report-2025-12.pdf
│   └── ...
└── ISMS-Core/
    ├── Risk-Register-v7.1-2026-04-01.xlsx
    ├── SoA-v5.3-2026-04-01.xlsx
    ├── Risk-Treatment-Plan-v4.2-2026-04-01.xlsx
    ├── Internal-Audit-Report-2026-02.pdf
    ├── Management-Review-Minutes-2026-03.docx
    └── ...
```

Each control has its own folder. Each piece of evidence is clearly named with the date. Old evidence is archived (not deleted) — auditors may ask for historical evidence to verify that a control has been operating consistently.

---

## Evidence for the Most Audited Controls

The following controls are most frequently tested in depth during Stage 2 and surveillance audits. Evidence requirements for each:

### A.8.5 — Secure Authentication (MFA)

**Evidence required:**
- MFA coverage report (from identity provider) showing percentage of users enrolled and enforced — not just enabled as an option
- For exceptions: exception register with risk owner sign-off for each account not enrolled in MFA
- Configuration evidence: screenshot of conditional access policy (Azure AD) or equivalent showing MFA is enforced (not optional)
- Functional test record: documented test showing that access is denied without MFA

**Common gap**: MFA "enabled" vs MFA "enforced." If users can choose to skip MFA, MFA is not a control — it is an option. The evidence must show enforcement, not just availability.

---

### A.8.8 — Management of Technical Vulnerabilities

**Evidence required:**
- Vulnerability scan reports (regular cadence, covering all in-scope systems)
- Patch deployment records showing dates of patch application relative to CVE publication/scan detection
- Patch compliance metric (% of systems patched within defined SLA)
- Exception register for vulnerabilities not yet remediated (with risk owner sign-off and review dates)
- Penetration test report (annual minimum)

**Common gap**: Scan reports exist but there is no evidence of action on findings. A vulnerability scan report showing 47 critical CVEs, followed by no patch records and another scan report 30 days later showing the same 47 CVEs, demonstrates that the control is not operating.

---

### A.8.13 — Information Backup

**Evidence required:**
- Backup schedule documentation (what is backed up, how frequently, retention period)
- Backup completion logs (showing backups ran as scheduled and completed successfully)
- Backup failure alerts and responses (any backup failures, what happened when they occurred)
- Restoration test records (date, systems tested, data restored, time taken, outcome, comparison to RTO)
- Evidence of offsite storage (confirmation from cloud backup service, or documentation of offsite media management)
- Encryption evidence (backups are encrypted — configuration record or certificate from backup service)

**Critical requirement**: The restoration test must demonstrate actual restoration, not just backup completion. A backup that cannot be restored provides no protection.

---

### A.6.3 — Information Security Awareness, Education, and Training

**Evidence required:**
- Training completion report showing all staff have completed annual training (100% completion required by most policies, with follow-up records for non-completers)
- Assessment scores (not just completion — evidence of demonstrated understanding)
- Phishing simulation reports (at least quarterly): click rate, reporting rate, trend over time
- Training content sample (showing the content is current and covers required topics — the policy, staff responsibilities, current threats, how to report)
- Role-specific training evidence (developers: secure coding; finance: fraud; HR: data protection)

**Common gap**: 100% completion but 25% phishing click rate. Completion is not effectiveness. Auditors will look for both.

---

### A.5.18 — Access Rights Review

**Evidence required:**
- Access review records showing all user access reviewed within the defined schedule (quarterly for privileged; semi-annual or annual for standard)
- Business owner sign-off on review outcomes (proving that business owners — not just IT — reviewed the access)
- Change records showing access removed or modified following review
- Evidence that access was removed promptly for changes identified in the review

**Common gap**: Access review records exist but show no changes. Either every single person's access was appropriate (unlikely in a dynamic organisation) or the review was not genuinely conducted. Auditors expect to see some access modifications resulting from reviews — zero changes consistently is suspicious.

---

### A.5.20 — Addressing Information Security Within Supplier Agreements

**Evidence required:**
- A sample of supplier contracts (5–10 from the critical supplier list)
- For each contract: evidence of security clauses (data protection, incident notification, right to audit, access controls, data return/deletion)
- DPA (Data Processing Agreement) for all suppliers processing personal data
- Supplier security assessment records
- Contract review records

**Common gap**: Generic confidentiality clause in contracts but no specific information security requirements (no incident notification obligation, no access control requirements, no data return/destruction on termination). A confidentiality clause does not constitute supplier information security management.

---

## Control Testing Calendar

A well-managed evidence programme operates to a defined testing calendar. Sample annual calendar:

| Month | Testing activities |
|---|---|
| January | Access review — all systems (Q1). Phishing simulation. Backup restoration test (Q1). |
| February | Configuration compliance review (selected controls). Supplier assessment (batch 1 of critical suppliers). |
| March | Management review preparation — collect all Q1 metrics. |
| April | Internal audit (targeted: access management, vulnerability management). |
| May | Access review (Q2). Phishing simulation. Backup restoration test (Q2). |
| June | External penetration test (annual). |
| July | Review of penetration test findings; remediation tracking. |
| August | Access review (Q3). Phishing simulation. Backup restoration test (Q3). |
| September | Internal audit (full scope — preparation for surveillance audit). |
| October | Surveillance audit. Management review. |
| November | Access review (Q4). Phishing simulation. Backup restoration test (Q4). |
| December | Annual risk assessment. SoA review. Annual training cycle completion. |

---

## The Evidence Review Process

Collecting evidence is only the first step. Evidence must also be reviewed — assessed to determine whether it demonstrates adequate control operation or reveals a control failure.

**Evidence review questions for each control:**
- Is the evidence current? (Within the defined review period)
- Does it demonstrate that the control operated consistently? (Not just a one-time snapshot)
- Does it show the expected outcome? (If MFA coverage should be >99%, is the evidence showing >99%?)
- Are exceptions documented and managed? (Exceptions without documentation are uncontrolled risks)
- Does the evidence align with the residual risk score? (If the risk score assumed full MFA enforcement but evidence shows 85% coverage, the residual risk score needs updating)

When evidence review reveals a gap — a control not operating as assumed — this triggers either a risk register update (if the residual risk has increased) or a corrective action (if the control can be restored to full operation).

---

## Common Mistakes and Failures

**1. Evidence collected only at audit time.**
The ISMS team collects evidence in the weeks before the audit. Evidence is manufactured for the audit, not collected from ongoing operations. Auditors recognise this pattern — the evidence is suspiciously consistent, suspiciously recent, and doesn't reflect historical operation.

**2. Configuration as the only evidence.**
Control evidence consists entirely of configuration screenshots. "MFA is configured" is not the same as "MFA is enforced and operating." Functional evidence (restoration tests, penetration test results, phishing simulation results) is essential alongside configuration evidence.

**3. Evidence stored in insecure, inconsistent locations.**
Evidence in personal folders, on shared drives with no access control, or spread across multiple systems with no index. Auditors cannot find it efficiently; the evidence base cannot be maintained consistently; historical evidence cannot be located when needed.

**4. No trend data.**
A single phishing simulation report showing 8% click rate is a data point. Four quarterly reports showing 20%, 15%, 11%, 8% is a trend — demonstrating that the awareness programme is working. Evidence without trend context tells only part of the story.

**5. Exception registers that are not maintained.**
Controls have exceptions — users without MFA, systems without patches, suppliers without security clauses in legacy contracts. Exceptions are legitimate if they are documented and managed. Exceptions that are not in the exception register are uncontrolled risks that the risk register does not reflect.

**6. Restoration tests not conducted.**
The most common critical backup control failure. The backup runs every night. Nobody has ever tested restoration. The auditor asks for a restoration test record. There isn't one. This is a minor NC at best — potentially major if no restoration has ever been attempted.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Evidence evaluation is the core skill of Stage 2 auditing. The auditor receives evidence and must assess: is it sufficient? Is it appropriate? Is it reliable? Does it demonstrate effective control operation?
- Key audit questions: "Show me the last three months of phishing simulation results." "Show me the restoration test record for your backup system." "Show me the access review record for privileged users from last quarter." "This vulnerability was identified in December — show me when it was patched."
- Common finding: evidence submitted is insufficient — configuration screenshot exists but no functional test; backup logs exist but no restoration test; training completion records exist but no effectiveness measurement.

**CISM:**
- Domain 3 (Security Programme) covers the management of control testing as part of the IS programme — designing the testing calendar, interpreting results, driving improvements.

**CRISC:**
- Domain 4 (Risk and Control Monitoring) is directly about control testing and evidence collection as the mechanism for verifying that residual risk remains within appetite.

**CISSP:**
- Domain 6 (Security Assessment and Testing) covers testing methodologies, penetration testing, and the use of results for programme improvement.

---

## GUARDIAN's Take

Evidence collection is where the ISMS demonstrates its integrity — or exposes its fragility.

The ISMS that exists to pass audits produces evidence in the weeks before the audit. The ISMS that exists to manage risk produces evidence continuously, as a byproduct of genuinely operating its controls. An auditor with experience can feel the difference within the first hour of a Stage 2 audit — the evidence that was assembled for the audit has a different quality to evidence that was produced operationally and simply organised for presentation.

The most robust evidence programmes I have seen share one characteristic: they are owned by the people who operate the controls, not by the CISO or ISMS Manager alone. The IT Operations Manager owns the patch compliance reports because they are a measure of their team's performance. The HR Manager owns the training completion records because they manage the training programme. The Risk Manager owns the supplier assessment records because they manage the supplier risk programme.

When evidence ownership is distributed to the people who are responsible for the controls, two things happen. First, the evidence is more likely to be current and accurate — people who are accountable for their own area maintain their evidence more diligently than people who are collecting evidence for someone else's audit. Second, control failures surface faster — because the evidence review reveals them to the person with both the responsibility and the authority to fix them.

Build the evidence programme into the control operation, not alongside it. Make evidence a natural output of normal control activity, not an extraordinary preparation for audit. When you do that, the audit becomes confirmation of what you already know — not a discovery of what you have been failing to see.

---
*Module: Module 4 — ISO 27002 Controls | Guardian Curriculum*
