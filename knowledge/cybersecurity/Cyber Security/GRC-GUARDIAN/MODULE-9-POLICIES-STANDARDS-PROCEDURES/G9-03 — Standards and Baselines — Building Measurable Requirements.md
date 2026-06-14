---
tags: [guardian, grc, module-9, standards, baselines, cis-benchmarks, technical-controls, measurable-requirements]
module: 9
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-25
guardian-refs: ["G9-01 — The Policy Hierarchy", "G9-02 — Writing Effective Security Policies", "G4-04 — Technological Controls — A.8.9 Configuration Management", "G3-10 — Annex A Controls"]
---

# G9-03 — Standards and Baselines — Building Measurable Requirements

> [!abstract] What This Note Covers
> By the end of this note, you will understand how to build the standards and baselines tier of your documentation framework — what makes a good security standard, how to use industry benchmarks (CIS, NCSC, NIST) as foundations, how to structure technical baselines, and how standards connect policy intent to auditable technical controls.

---

## Why This Exists

The gap between policy and operational reality is bridged by standards. A policy says "passwords must be strong." That statement governs nothing until a standard specifies what "strong" means — minimum length, complexity requirements, MFA status, rotation rules. A policy says "systems must be securely configured." That statement governs nothing until a baseline specifies which settings must be enabled, which services disabled, which ports closed.

Standards are where security becomes measurable. And measurability is what enables testing, auditing, compliance monitoring, and improvement. You cannot verify compliance with "strong passwords" — you can verify compliance with "minimum 12 characters, MFA enrolled within 48 hours of account creation, no reuse of last 12 passwords."

This note covers how to build that measurability into your documentation framework.

---

## What Makes a Good Security Standard

A security standard must satisfy five criteria:

**1. Specific**: The requirement is precise enough that a person reading it knows exactly what is required without interpretation. "Strong encryption" is not specific. "AES-256 for data at rest; TLS 1.2 minimum (TLS 1.3 preferred) for data in transit" is specific.

**2. Measurable**: The requirement can be objectively tested — either by configuration review, automated scanning, or manual verification. "Appropriate access controls" is not measurable. "MFA must be enrolled for all accounts accessing the CDE within 48 hours of account creation" is measurable.

**3. Achievable**: The requirement is technically and operationally feasible in the organisation's environment. A standard requiring daily manual review of 10,000 log entries per system is not achievable for most security teams. A standard requiring automated SIEM alerting for defined event types is achievable.

**4. Relevant**: The requirement addresses a genuine security risk identified in the risk assessment or derived from a known threat. Standards that specify requirements not linked to identified risks waste implementation effort and create compliance burden without security benefit.

**5. Time-bound**: Where the requirement involves an activity that must occur at a defined frequency (patch application, access review, log retention), the timeframe must be explicit. "Promptly" is not time-bound. "Critical patches must be applied within 14 days of publication" is.

---

## Using Industry Benchmarks as Standards Foundations

Writing security standards from scratch is unnecessary — excellent reference documents exist that can be adopted, adapted, and supplemented for the organisation's specific context.

### CIS Benchmarks

The **Center for Internet Security (CIS) Benchmarks** are the most widely used technical security configuration standards globally. They provide detailed, prescriptive guidance for hardening:
- Operating systems (Windows Server, Ubuntu, RHEL, macOS)
- Applications (Microsoft 365, Google Workspace, Kubernetes, Docker)
- Network devices (Cisco, Juniper, Palo Alto)
- Cloud platforms (AWS, Azure, GCP)
- Databases (MySQL, PostgreSQL, Microsoft SQL Server)
- Web browsers, middleware, and many other technologies

**CIS Benchmark structure**: Each benchmark contains hundreds of specific controls, each with:
- Control title and description
- Rationale (why this setting matters)
- Impact assessment (what enabling/disabling this setting affects)
- Assessment procedure (how to check compliance)
- Remediation procedure (how to achieve compliance)
- CIS Control mapping (which CIS Control the benchmark satisfies)

**Two implementation levels:**
- **Level 1**: Foundational security — applicable to all environments; minimal operational impact
- **Level 2**: Additional hardening for higher-security environments; may affect functionality

**Using CIS Benchmarks in standards**: The organisation's secure configuration standard references the CIS Benchmark for each technology, specifying which level applies and any exceptions. For example:
> "Windows Server systems must be configured to CIS Benchmark Level 1 for Windows Server 2022 (version 3.0 or later). Exceptions must be documented in the exception register with risk owner approval."

**Free download**: CIS Benchmarks are freely available at cisecurity.org for registered users.

### NCSC Guidance

The **National Cyber Security Centre (NCSC)** publishes practical security guidance specifically calibrated for UK organisations. Key resources relevant to standards development:

**Cyber Essentials technical requirements**: The five Cyber Essentials controls (firewalls, secure configuration, patch management, access control, malware protection) provide a UK government-endorsed baseline.

**Password guidance (NCSC 2021)**: NCSC's password guidance — "Use long, random passwords. Use a password manager. Enable 2-step verification." — diverges from older complexity-focused approaches. NCSC specifically recommends against mandatory regular password rotation, recommending rotation only when compromise is suspected. UK organisations should align their password standards with NCSC guidance rather than older NIST or PCI DSS requirements that mandated rotation.

**Configuration guidance**: NCSC publishes specific configuration guidance for cloud platforms (Azure Active Directory, Microsoft 365) and end-user device policies.

**End User Device (EUD) Security Guidance**: Platform-specific guidance for macOS, Windows, iOS, and Android — defining security requirements for organisational device deployments.

### NIST Guidelines

**NIST SP 800-63B** (Digital Identity Guidelines — Authentication and Lifecycle Management): The authoritative US reference for password and authentication requirements. Key guidance:
- Minimum 8 characters; 64 characters maximum supported
- No mandatory composition rules (no "must contain uppercase, number, special character")
- No mandatory periodic rotation
- Check against known-breached password lists
- MFA recommended for all accounts

**NIST SP 800-53 control specifications**: For organisations with US federal obligations, SP 800-53 controls provide the standards-level requirements in each control family.

**NIST SP 800-123** (Guide to General Server Security): Server configuration baseline guidance.

**NIST SP 800-41** (Guidelines on Firewalls and Firewall Policy): Firewall configuration and management guidance.

### ISO 27002:2022

ISO 27002 provides implementation guidance for each of the 93 ISO 27001 Annex A controls — including specific technical requirements. For each relevant Annex A control, ISO 27002's implementation guidance provides a foundation for the corresponding standard.

---

## Standard Types in an Information Security Programme

### Password and Authentication Standard

The most universally required security standard. Key requirements to address:

**Password requirements:**
```
1.1 All user accounts must have a unique password known only to the account holder.
1.2 Passwords must be a minimum of 12 characters in length.
1.3 Passwords must not be reused within the last 12 passwords.
1.4 Passwords must not be the same as the account username.
1.5 Passwords must be checked against known-breached password lists at creation 
    (using the Have I Been Pwned API or equivalent).
1.6 Accounts must lock after 10 consecutive failed authentication attempts, 
    requiring manual unlock or a time-based delay.
1.7 Passwords must not be stored in reversible or plaintext form. Approved 
    hashing algorithms: bcrypt (cost factor ≥ 10), Argon2id, scrypt.
1.8 Mandatory password rotation applies only when: 
    (a) credentials are suspected or confirmed compromised; 
    (b) the account is being transferred to a new holder.
```

**MFA requirements:**
```
2.1 Multi-factor authentication is mandatory for:
    a) All remote access (VPN, RDP, remote desktop)
    b) All cloud service administration
    c) All access to systems within the Cardholder Data Environment
    d) All privileged account access
    e) All email accounts accessible from outside the corporate network
2.2 Acceptable MFA methods (in order of preference):
    FIDO2/WebAuthn hardware tokens > Authenticator app (TOTP) > Push notification > 
    SMS (acceptable only where no other method is feasible)
2.3 SMS-based MFA is prohibited for access to financial systems or systems 
    containing special category personal data.
2.4 MFA must be enrolled within 48 hours of account creation.
```

### Patch Management Standard

```
PATCH MANAGEMENT STANDARD

1. SCOPE
   This standard applies to all operating systems, applications, and 
   firmware within the ISMS scope and CDE.

2. CLASSIFICATION AND TIMELINES
   2.1 Critical vulnerabilities (CVSS ≥ 9.0 or CISA KEV listed):
       Patch within 7 days of patch availability; 
       or within 24 hours if actively exploited in the wild (CISA KEV with 
       evidence of active exploitation).
   2.2 High severity (CVSS 7.0–8.9):
       Patch within 14 days of patch availability.
   2.3 Medium severity (CVSS 4.0–6.9):
       Patch within 30 days of patch availability.
   2.4 Low severity (CVSS < 4.0):
       Patch within 90 days or at next scheduled maintenance window.

3. END-OF-LIFE SOFTWARE
   3.1 Software or systems that no longer receive vendor security patches 
       must not be used within the ISMS scope unless:
       (a) An approved exception is in place (maximum 12-month duration)
       (b) Compensating controls are documented and approved by the CISO
       (c) A remediation plan exists with a defined replacement date

4. EXCEPTIONS
   Where a patch cannot be applied within the required timeline (e.g. due 
   to compatibility issues or business continuity risk), an exception must be:
   (a) Documented in the patch exception register
   (b) Approved by the CISO
   (c) Accompanied by documented compensating controls
   (d) Reviewed monthly until remediated

5. VERIFICATION
   Patches must be verified applied through re-scanning within 7 days 
   of the patch deployment window closing.
```

### Encryption Standard

```
ENCRYPTION STANDARD

1. APPROVED ALGORITHMS

   1.1 Symmetric encryption (data at rest and in transit):
       Approved: AES-128, AES-256
       Prohibited: DES, 3DES, RC4, RC2, Blowfish (deprecated)
   
   1.2 Asymmetric encryption (key exchange, digital signatures):
       Approved: RSA-2048 (minimum), RSA-4096 (preferred for new implementations),
                 ECDSA P-256, ECDSA P-384, Ed25519
       Prohibited: RSA < 1024-bit, DSA < 2048-bit
   
   1.3 Hashing (integrity, digital signatures):
       Approved: SHA-256, SHA-384, SHA-512, SHA-3
       Prohibited: MD5, SHA-1 (for cryptographic purposes)
   
   1.4 TLS (network encryption):
       Approved: TLS 1.2, TLS 1.3
       Prohibited: SSL 2.0, SSL 3.0, TLS 1.0, TLS 1.1

2. DATA AT REST

   2.1 Devices: Full disk encryption is mandatory on all laptops, mobile 
       devices, and portable storage media.
       Windows: BitLocker (256-bit AES-XTS mode)
       macOS: FileVault 2
       Mobile: Device encryption enabled (enforced via MDM)
   
   2.2 Databases containing Restricted or Confidential data must use 
       database-level or column-level encryption with keys managed through 
       an approved key management system.
   
   2.3 Backup data: All backup data containing Confidential or Restricted 
       information must be encrypted before transmission to backup storage.

3. DATA IN TRANSIT

   3.1 All transmission of Confidential or Restricted information over 
       public networks (internet) must use TLS 1.2 or TLS 1.3.
   
   3.2 Internal network transmission of Restricted information must use 
       TLS 1.2 or TLS 1.3.

4. KEY MANAGEMENT

   4.1 Encryption keys must be stored separately from the data they protect.
   4.2 Key rotation schedule:
       - Data encryption keys: Rotate annually or when compromise is suspected
       - Key encrypting keys: Rotate every 3 years or when a key custodian departs
   4.3 Key custodians must be named for all production encryption keys.
   4.4 Key destruction procedures must be documented.
```

### Logging and Monitoring Standard

```
LOGGING AND MONITORING STANDARD

1. EVENTS THAT MUST BE LOGGED
   All systems within the ISMS scope must log the following events:

   1.1 Authentication events:
       - Successful and failed login attempts
       - Account lockouts
       - Password changes
       - MFA enrollment and changes
   
   1.2 Privileged account activity:
       - All commands executed under privileged accounts
       - Privilege escalation events
       - Sudo/RunAs usage
   
   1.3 Account management:
       - Account creation, modification, and deletion
       - Role and permission changes
       - Group membership changes
   
   1.4 System events:
       - System start-up and shutdown
       - Service start and stop
       - Security software events (AV detections, firewall blocks)
   
   1.5 Access to sensitive data:
       - Access to Restricted data (where technically feasible)
       - Export or download of Restricted data

2. LOG RETENTION
   2.1 Logs from systems within the ISMS scope: 12 months total retention;
       3 months must be immediately accessible for investigation.
   2.2 Logs from systems within the CDE: 12 months total; 3 months 
       immediately available (PCI DSS Requirement 10.5).
   2.3 Security event logs from SIEM: Minimum 12 months.

3. LOG INTEGRITY
   3.1 Log data must be protected from modification or deletion by 
       the individuals or systems that generated it.
   3.2 Logs must be transmitted to a centralised logging system 
       (SIEM) from which production system administrators cannot 
       delete log entries.
   3.3 Time synchronisation: All logging systems must use NTP 
       synchronised to an authoritative time source.

4. LOG REVIEW
   4.1 SIEM alerts must be triaged within 24 hours of generation.
   4.2 Critical and High severity alerts must be investigated and 
       resolved within 4 hours of triage.
   4.3 Log review completeness must be reported monthly to the CISO.
```

---

## Technical Security Baselines

Security baselines are the most granular form of standard — they specify the precise configuration of a specific technology. Baselines derive their requirements from CIS Benchmarks, NCSC guidance, and vendor security recommendations.

### Baseline Structure

A technical baseline document typically contains:

**Header information:**
- Technology name and version
- Baseline version
- Baseline level (CIS Level 1 / Level 2 / custom)
- Owner and approver
- Date and next review

**Scope:**
- Which systems and environments this baseline applies to
- Environments explicitly excluded (e.g. "This baseline does not apply to development environments — see the Development Environment Baseline")

**Configuration controls table:**

| Control ID | Category | Requirement | Rationale | CIS Ref | Assessment method |
|---|---|---|---|---|---|
| W-01 | Account Policies | Minimum password length: 14 characters | Increases password entropy; reduces brute force risk | CIS 1.1.1 | Group Policy: Computer Config → Windows Settings → Security Settings → Account Policies |
| W-02 | Account Policies | Account lockout threshold: 5 invalid attempts | Limits brute force attempts | CIS 1.2.1 | Group Policy: Computer Config → Security Settings → Account Policies → Account Lockout Policy |
| W-03 | Local Policies | Audit logon events: Success and Failure | Enables detection of unauthorised access attempts | CIS 2.2.1 | Group Policy: Computer Config → Security Settings → Local Policies → Audit Policy |
| W-04 | Windows Firewall | Windows Defender Firewall: Enabled for all profiles | Provides host-based network protection | CIS 9.1.1 | gpedit.msc → Computer Config → Admin Templates → Network → Windows Firewall |
| W-05 | Security Options | Do not store LAN Manager hash: Enabled | Prevents weak credential storage | CIS 2.3.11.3 | HKLM\SYSTEM\CurrentControlSet\Control\Lsa\NoLMHash = 1 |

**Exception documentation:**
- List of controls from the baseline that are not applied in this environment
- Reason for each exception
- Compensating control in place
- Risk owner approval

### Automated Baseline Verification

Manual baseline verification is not scalable. Automated tools verify baseline compliance continuously:

**Endpoint:**
- Microsoft Intune compliance policies (enforce and report Windows/macOS/mobile baseline compliance)
- Microsoft Defender for Endpoint (security configuration score)
- CIS-CAT Pro (CIS Benchmark automated scanning)
- Qualys Policy Compliance
- Tenable.sc

**Cloud:**
- AWS Security Hub (AWS Security Best Practices, CIS AWS Foundations Benchmark)
- Microsoft Defender for Cloud (Azure Security Benchmark)
- GCP Security Command Center
- Prisma Cloud (multi-cloud)

**Network devices:**
- Cisco SecureX
- Panorama (Palo Alto)
- Custom scripts against device APIs

**Automation benefit**: Continuous compliance monitoring rather than point-in-time manual review. Deviations from baseline detected immediately; automated alerting to the responsible team; trend reporting for management.

---

## Standards Governance

### Ownership

Every standard must have a named owner — an individual responsible for:
- Keeping the standard current
- Monitoring compliance
- Managing exceptions
- Coordinating with policy owner when policy changes affect the standard

**Avoid shared ownership**: "IT Security Team" is not an owner — it is a group. Name an individual.

### Exception Management

The exceptions process for standards is the most operationally critical governance mechanism. Without a working exceptions process, non-compliance is hidden (nobody requests an exception; the non-compliance is just not documented) rather than managed.

**Effective exceptions process:**
1. Exception request submitted (standard form: what the exception covers, why compliance is not achievable, proposed compensating controls, requested duration)
2. Risk assessment by the standard owner
3. Approval by the CISO (or delegated authority for lower-risk exceptions)
4. Exception recorded in the exceptions register with: exception ID, system/scope, control(s), reason, compensating controls, approved duration, approver, review date
5. Exceptions reviewed at defined intervals (monthly or quarterly depending on risk level)
6. Exceptions closed when compliance is achieved; extensions require re-approval

**Exception register**: A live document tracking all active exceptions. Reviewed at management review and during internal audits.

### Standards Review Cycle

Standards must be reviewed:
- **Annually**: Full review against current threat landscape and technology
- **When the underlying technology changes**: A Windows 10 baseline must be updated when the environment moves to Windows 11
- **When referenced industry benchmarks are updated**: CIS Benchmarks are updated regularly; the standard should reference the benchmark version and be updated when a new major version is published
- **When a significant vulnerability is discovered**: A new category of attack may require strengthening specific controls
- **When an exception becomes systemic**: If 30% of systems have an exception for a specific control, the control may need revision rather than persistent exception

---

## Common Mistakes and Failures

**1. Standards that reference outdated benchmarks.**
"Systems must be configured to CIS Benchmark Level 1" — but the benchmark version referenced is 3 years old. New vulnerabilities may have added controls not in the old version. Standards should reference the latest benchmark version and be updated when major versions are released.

**2. Standards with no exceptions process.**
Organisations that cannot comply with a standard and have no exceptions process either:
(a) Lie about compliance in attestation documents
(b) Are silently non-compliant with no risk assessment or compensating controls

Neither is acceptable. The exceptions process is not a weakness — it is the governance mechanism that makes standards workable in complex real-world environments.

**3. Baselines written but never verified.**
A detailed Windows hardening baseline exists. It has never been applied to production systems. It has never been audited against production systems. It is governance theatre.

**4. Different standards for different teams without rationale.**
The finance team's workstations have stricter password standards than IT operations. The rationale — that finance staff handle more sensitive data — is legitimate. But if the reason is political rather than risk-based ("finance department pushed back on MFA"), the standard is compromised.

**5. Standards not updated after technology changes.**
The organisation migrated from on-premises Active Directory to Azure AD. The password standard still references Group Policy settings that no longer apply. The standard is technically correct for the old environment; non-applicable for the current one.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Standards are the mechanism through which ISO 27001 Annex A controls are operationalised. Auditors should ask: does the organisation have a Password Standard? A Patch Management Standard? An Encryption Standard? And — critically — are these standards actually implemented? Configuration review and sampling of user accounts validates implementation.
- A.8.9 (Configuration management) requires documented secure configuration standards. The auditor will request the standard and evidence of compliance.

**CISM:**
- Domain 3 (Security Programme) — standards are the technical backbone of the security programme. CISMs must understand how to build and maintain a standards framework aligned to policy intent and risk assessment.

**CRISC:**
- Domain 3 (Risk Response) — standards are a risk treatment mechanism. The patch management standard addresses vulnerability exploitation risk; the encryption standard addresses data exposure risk. CRISC candidates should understand how standard requirements are derived from risk assessment findings.

**CISSP:**
- Domain 3 (Security Architecture and Engineering) — configuration baselines and secure configuration standards are core engineering concepts. Know the role of CIS Benchmarks, how baselines are applied, and how exceptions are managed.

---

## GUARDIAN's Take

Standards are where the security programme becomes testable — and testability is where it becomes real.

An organisation with a password policy but no password standard can claim it has "strong password requirements" and be technically truthful, while having no enforceable mechanism to achieve it. An organisation with a password standard — minimum 12 characters, MFA required for CDE access, no shared accounts — can be tested against those requirements. Compliance or non-compliance is objective. The gap between actual state and required state is measurable and actionable.

That measurability is the most important contribution standards make to security governance. It transforms security from an aspiration into an engineering requirement. It allows the CISO to tell the board: "Our encryption standard requires AES-256 for all data at rest. Our last automated compliance scan shows 97.3% of systems compliant. Here are the 12 systems with exceptions and their remediation timeline." That is governance — honest, specific, improving over time.

Write standards that are specific. Reference reputable benchmarks. Build automated verification. Manage exceptions rigorously. The standards tier is where policy intent becomes security practice — invest in it accordingly.

---
*Module: Module 9 — Policies, Standards, Procedures | Guardian Curriculum*
