---
tags: [guardian, grc, module-4, iso27002, technological-controls, access-control, cryptography, logging, vulnerability-management, network-security, secure-development]
module: 4
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G3-10 — Annex A Controls — Complete Reference 2022", "G4-01 — Organisational Controls", "G4-02 — People Controls", "G4-03 — Physical Controls", "G4-05 — Control Selection and Justification"]
---

# G4-04 — Technological Controls — Access, Cryptography, Logging

> [!abstract] What This Note Covers
> By the end of this note, you will understand the 34 technological controls in ISO 27002:2022 Category 8 in depth — covering access management, authentication, cryptography, vulnerability management, logging and monitoring, network security, secure development, and the 6 new 2022 controls — including implementation requirements, evidence standards, and the most common audit failures.

---

## Why This Exists

Category 8 is the largest category in ISO 27002:2022 — 34 controls covering the technical execution of information security. These are the controls that implement the organisational governance (Category 5), the human safeguards (Category 6), and the physical protections (Category 7) at the system, network, and application level.

Technical controls are where most ISMS investment is concentrated — endpoint protection, firewalls, SIEM, vulnerability scanners, DLP tools. But technical controls are only as effective as the governance that directs them, the people who operate them, and the processes that manage them. A perfectly configured SIEM that generates alerts nobody reviews is not a security control — it is expensive noise.

This note provides implementation depth for all 34 technological controls, focusing on the evidence standards that auditors apply and the operational failures that most commonly undermine technical control effectiveness.

---

## Group 1: Access and Identity Controls (A.8.1–A.8.5)

### A.8.1 — User Endpoint Devices

**Purpose**: Protect information on, and accessible via, user endpoints (laptops, desktops, mobile phones, tablets).

**Implementation requirements:**
- Full disk encryption mandatory (BitLocker for Windows, FileVault for macOS, device encryption for iOS/Android)
- Endpoint protection deployed and current (AV/EDR — traditional AV is insufficient; EDR with behavioural detection is the current standard)
- Automatic screen lock (5–15 minutes inactivity for desktop/laptop; 1–5 minutes for mobile)
- Mobile Device Management (MDM) enrollment for all organisational devices and BYOD accessing work data
- Remote wipe capability enabled and tested
- Automatic OS and application patching
- Prohibition on rooting/jailbreaking (MDM can enforce and report)
- Separation of personal and work data on BYOD (containerisation)

**Evidence required:**
- MDM platform compliance reports (encryption status, patch status, EDR installation, screen lock configuration)
- EDR management console showing all enrolled devices and protection status
- MDM policy configuration screenshots
- Remote wipe test records

**Common failure**: BYOD devices accessing corporate email and SharePoint with no MDM enrollment, no encryption requirement, and no ability to remotely wipe. When the device is lost, the data is lost with it.

---

### A.8.2 — Privileged Access Rights

**Purpose**: Restrict and manage the allocation and use of privileged access to reduce the risk of privilege abuse.

**What privileged access means**: Any access above standard user level — system administrator rights, database administrator rights, network administrator rights, security tool administration, cloud IAM administrator roles.

**Implementation requirements:**
- Minimum number of privileged accounts — only those whose role genuinely requires it
- Named individual accounts for privileged access (no shared admin accounts — "admin/admin123" is a single point of compromise)
- Privileged Access Workstations (PAWs) for administration of critical systems — dedicated devices used only for admin tasks, not for email or browsing
- Just-In-Time (JIT) privileged access — administrators request elevated access for specific tasks, which is granted temporarily and revoked automatically
- MFA mandatory for all privileged access (higher bar than standard user MFA — hardware tokens or authenticator app, not SMS)
- Session recording for privileged sessions (all admin actions logged and recorded)
- Privileged access reviews more frequently than standard user reviews (quarterly minimum)
- Separate admin accounts from user accounts (the domain admin should not use their admin account for email)

**Privileged Access Management (PAM) tools**: For mature organisations, a PAM solution (CyberArk, BeyondTrust, HashiCorp Vault) automates JIT access, session recording, credential vaulting, and privileged account discovery. Required for large organisations; recommended for medium-sized organisations with significant privileged access surface.

**Evidence required:**
- Privileged account inventory (complete list of all privileged accounts)
- Access review records for privileged accounts (quarterly)
- MFA configuration evidence for privileged accounts
- Session recording configuration (where implemented)
- PAM tool configuration (where implemented)

**Common failure**: Domain administrator accounts used for daily computing tasks — email, browsing, document editing. When the admin's account is compromised (phishing, credential theft), the attacker immediately has domain administrator access.

---

### A.8.3 — Information Access Restriction

**Purpose**: Restrict access to information and application functions based on business requirements and the principle of least privilege.

**Access control models:**
- **Role-Based Access Control (RBAC)**: Access granted based on job role — the most common model. Define roles, assign permissions to roles, assign users to roles.
- **Attribute-Based Access Control (ABAC)**: More granular — access based on multiple attributes (user attributes, resource attributes, environmental conditions). More flexible but more complex.
- **Mandatory Access Control (MAC)**: Classification-based — access granted based on security clearance matching information classification. Used in high-security government environments.

**Least privilege principle in practice:**
- Users have access only to the data and systems they need for their current role
- Access is granted by exception (request + approval), not by default
- Access rights are reviewed when roles change — promotion, lateral move, or expansion of responsibilities does not automatically grant expanded access; new access must be requested and approved

**Application-level access controls:**
- Application menus and functions restricted based on role
- Field-level security for particularly sensitive data (e.g. salary fields visible only to HR and Finance)
- API access controls — APIs must authenticate and authorise, not just authenticate

**Evidence required:**
- Access control policy
- Role definitions with associated permissions
- User-role assignment records
- Access request and approval records
- Access review records

---

### A.8.4 — Access to Source Code

**Purpose**: Prevent unauthorised access to, or modification of, source code, which could introduce vulnerabilities or backdoors.

**Implementation requirements:**
- Source code repositories (GitHub, GitLab, Bitbucket, Azure DevOps) must have access controls
- Only developers working on a project should have read access to that project's code
- Only authorised developers/release managers should have write access to protected branches (main, production)
- No shared accounts for source code repositories
- MFA mandatory for source code repository access
- Branch protection rules: pull request reviews required before merging to production branches
- Separation of development and production: developers should not have direct write access to production systems (CI/CD pipelines, not direct deployment)
- Audit logging for all access to source code repositories

**Common failure**: A single GitHub repository with all developers having write access to the main branch. Any developer can push directly to production without review. A compromised developer account allows an attacker to inject malicious code into the production codebase.

---

### A.8.5 — Secure Authentication

**Purpose**: Ensure that secure authentication mechanisms are implemented to prevent unauthorised access.

**Authentication strength hierarchy (weakest to strongest):**
1. Username and password only — inadequate for any sensitive system
2. Password + SMS OTP — better, but SMS is vulnerable to SIM swapping attacks
3. Password + authenticator app OTP (TOTP) — good; resistant to SIM swap
4. Password + push notification authentication — good; phishing-resistant if the app confirms the source
5. Password + hardware token (FIDO2/WebAuthn, YubiKey) — excellent; phishing-resistant, not replayable
6. Biometric + hardware token — highest available authentication strength

**MFA implementation requirements (minimum standard for ISO 27001):**
- All remote access (VPN, RDP, remote desktop services) requires MFA — no exceptions
- All cloud service access requires MFA — no exceptions (M365, Google Workspace, AWS console, Azure portal)
- All privileged access requires MFA — higher bar than standard user MFA
- All access to sensitive systems (HR, financial systems, customer databases) requires MFA

**Password policy (aligned with NCSC guidance):**
- Minimum length: 12 characters (NCSC recommends longer passphrases over complex shorter passwords)
- Complexity: Not mandatory if length is adequate (NCSC has moved away from mandatory complexity requirements that lead to predictable patterns like "Password1!")
- No sharing of passwords
- No default/vendor credentials in production
- Password managers encouraged (enable long, unique passwords for all accounts)
- Breached password checking: Check new passwords against known-breached lists (Have I Been Pwned API)
- Account lockout: After 5–10 failed attempts, lockout or progressive delay

**MFA fatigue attacks**: A relatively new attack technique where the attacker repeatedly sends MFA push notifications until the exhausted user approves one. Mitigations: number matching (user must confirm the number shown on their screen matches the number in the app), additional context in push notifications (shows location/device of login attempt).

**Evidence required:**
- MFA configuration screenshots for all critical systems
- MFA coverage report (% of users enrolled in MFA)
- Password policy configuration (from Active Directory, Azure AD, etc.)
- Access log samples showing MFA events

---

## Group 2: Operational Controls (A.8.6–A.8.8)

### A.8.6 — Capacity Management

**Purpose**: Monitor resource utilisation and manage capacity to ensure system availability.

**What to monitor:**
- CPU, memory, disk utilisation for servers
- Network bandwidth utilisation
- Database capacity and growth rates
- Cloud service quotas and consumption
- Storage capacity and growth projections

**Capacity management process:**
- Define capacity thresholds (alert at 70% utilisation; critical at 85%)
- Monitor continuously with automated alerting
- Forecast future demand based on growth trends
- Plan capacity upgrades before thresholds are reached (not after they are hit)
- Cloud-specific: right-sizing (not paying for unused capacity) and scaling policies

---

### A.8.7 — Protection Against Malware

**Purpose**: Protect systems from malware infection.

**Modern anti-malware approach:**
- Traditional AV (signature-based) is insufficient against modern threats — 30–50% of malware evades signature detection
- **Endpoint Detection and Response (EDR)**: Behavioural analysis, threat hunting capability, incident response features. Current standard (CrowdStrike Falcon, SentinelOne, Microsoft Defender for Endpoint)
- **Anti-phishing**: Email gateway filtering, sandbox analysis of attachments, URL scanning
- **Application control / allowlisting**: Only approved applications can execute (blocks unknown malware automatically)
- **Browser isolation**: Remote browser isolation for high-risk browsing

**Malware protection configuration requirements:**
- Real-time scanning enabled on all endpoints
- Automatic definition/signature updates (or behavioural engine updates for EDR)
- Scanning of removable media on insertion
- Email attachment scanning
- Web content filtering (blocks access to known malicious URLs)
- Scheduled full system scans
- Alerts for detected malware with defined response process

---

### A.8.8 — Management of Technical Vulnerabilities

**Purpose**: Identify and remediate technical vulnerabilities before they can be exploited.

**Vulnerability management lifecycle:**

**1. Discovery**: Maintain a complete asset inventory (A.5.9) — you cannot scan what you don't know about. Automated discovery tools identify assets that may not be in the official inventory (shadow IT, rogue devices).

**2. Assessment**: Regular vulnerability scanning:
- **External attack surface**: Scan externally exposed systems weekly or continuously (Shodan, Censys show what attackers can see)
- **Internal network**: Full network scan monthly minimum
- **Web applications**: Web application scanner (OWASP ZAP, Burp Suite, Invicti) — at least quarterly, or after every significant code change
- **Cloud infrastructure**: Cloud Security Posture Management (CSPM) tools scan cloud configurations continuously

**3. Prioritisation**: Not all vulnerabilities are equal. Prioritise based on:
- CVSS score (Critical 9.0+, High 7.0–8.9, Medium 4.0–6.9, Low 0.1–3.9)
- Exploitability (is there a public exploit? Is it being actively exploited in the wild?)
- Asset criticality (same vulnerability on a public-facing web server vs an internal dev machine)
- Business context (does this vulnerability affect systems processing sensitive data?)

CISA KEV (Known Exploited Vulnerabilities) catalogue is the most authoritative source for vulnerabilities being actively exploited — patch KEV entries immediately regardless of CVSS score.

**4. Remediation (Patch management)**:
- **Critical/High on internet-facing systems**: Within 24–48 hours if actively exploited (CISA KEV); within 7 days if publicly known exploit; within 30 days if no public exploit
- **Critical/High on internal systems**: Within 30 days
- **Medium**: Within 90 days
- **Low**: Risk-based decision; may be accepted or deferred

**5. Exception management**: When a patch cannot be applied (legacy system, compatibility issue, operational constraint), the exception must be documented with:
- Risk assessment of the unpatched vulnerability
- Compensating controls in place
- Approved exception (risk owner sign-off)
- Review date (when will this exception be reconsidered?)

**6. Verification**: After patching, re-scan to confirm the vulnerability is closed. Do not assume the patch worked — verify it.

**Evidence required:**
- Vulnerability scan reports (showing scan date, scope, findings)
- Patch management records (showing when patches were deployed relative to vulnerability discovery)
- Exception register with risk owner sign-off
- Penetration test reports (annual minimum for external-facing systems)

**Common failures:**
- Vulnerability scanning of only a subset of assets (known assets, forgetting shadow IT)
- CVSS-based prioritisation only (high-CVSS vulnerabilities with no public exploit treated as higher priority than low-CVSS KEV entries actively exploited in the wild)
- Patches applied but not verified (vulnerability scanner still shows the CVE as open)
- Exception register full of "permanent" exceptions with no review date

---

## Group 3: New 2022 Controls and Configuration (A.8.9–A.8.12)

### A.8.9 — Configuration Management *(NEW in 2022)*

**Purpose**: Establish, document, implement, monitor, and review secure configurations for all hardware, software, services, and networks.

**Secure configuration baseline:**
- For each technology in use (Windows, Linux, cloud services, network devices, applications), define a secure baseline configuration aligned with industry benchmarks:
  - CIS Benchmarks (Center for Internet Security) — the most widely used reference
  - NCSC configuration guidance
  - Vendor hardening guides
  - DISA STIGs (US government, but widely referenced)

**Configuration management process:**
- New systems deployed to baseline configuration, not default vendor configuration
- Changes to configuration must go through change management (A.8.32)
- Configuration compliance scanning continuously compares live configuration against the baseline
- Drift detected → remediation or approved exception
- Baseline reviewed at least annually and when significant threats or guidance changes

**Cloud configuration management:**
- Cloud environments are particularly prone to misconfiguration (exposed S3 buckets, overly permissive IAM policies, disabled logging)
- Cloud Security Posture Management (CSPM) tools (AWS Security Hub, Azure Defender for Cloud, Prisma Cloud) continuously scan cloud configurations against best-practice baselines

**Evidence required:**
- Documented secure configuration baselines
- Configuration compliance scan reports (showing compliant vs non-compliant systems)
- Change records for configuration changes
- Evidence of remediation for identified deviations

---

### A.8.10 — Information Deletion *(NEW in 2022)*

**Purpose**: Ensure information that is no longer required is deleted securely and permanently.

**Deletion requirements:**
- Define retention periods for all data categories (aligned with GDPR data minimisation and retention limitation principles, and with legal/contractual requirements)
- Implement automated deletion where possible (retention policies in document management systems, email archiving tools, database purge processes)
- Verify deletion actually occurred (logs showing data was deleted; certificate of destruction for physical media)
- Deletion must be secure — not just "delete" (which moves to recycle bin) but cryptographic erasure or secure overwriting

**GDPR connection**: Data minimisation (only collect what you need) and storage limitation (don't keep it longer than needed) are GDPR principles directly supported by A.8.10. A data retention policy combined with automated deletion processes is evidence of GDPR compliance as well as ISO 27001 conformance.

**Evidence required:**
- Data retention schedule (what data, how long, who is responsible for deletion)
- Automated deletion policy configuration (retention policies in M365, Google Workspace, etc.)
- Deletion logs or confirmation records
- Certificates of destruction for physical media (A.7.14 overlap)

---

### A.8.11 — Data Masking *(NEW in 2022)*

**Purpose**: Limit exposure of sensitive data through masking, pseudonymisation, or anonymisation.

**Masking techniques:**
- **Data masking**: Replacing real data with realistic but fictitious data (e.g. replacing real credit card numbers with fake ones that pass Luhn algorithm validation) — used for non-production environments
- **Tokenisation**: Replacing sensitive data with non-sensitive tokens; the mapping is stored separately and securely — used for payment card data
- **Pseudonymisation**: Replacing identifying information with pseudonyms; the mapping is kept separately — used for GDPR-compliant data processing
- **Anonymisation**: Irreversibly removing all identifying information — cannot be re-identified; no longer personal data under GDPR

**Primary use cases:**
- **Test and development environments**: Production data should never be used in test/dev environments unless masked. A developer working on a copy of the customer database has access to all customer data — this is a significant data exposure risk.
- **Analytics and reporting**: Business intelligence and analytics queries often don't need full identifying data. Masked or aggregated data serves the analytical purpose without the exposure.
- **Third-party data sharing**: When sharing data with partners or vendors who don't need full identifying information.

**Evidence required:**
- Data masking policy defining where masking is required
- Evidence that test environments use masked data (not production data)
- Technical evidence of masking implementation (tool configuration, sample of masked data)

---

### A.8.12 — Data Leakage Prevention *(NEW in 2022)*

**Purpose**: Detect and prevent unauthorised exfiltration or exposure of sensitive information.

**DLP coverage areas:**
- **Email DLP**: Scanning outbound email for sensitive content (credit card numbers, personal data patterns, confidential document classifications); blocking or quarantining policy violations
- **Endpoint DLP**: Monitoring and controlling data movement on endpoints (copying to USB, printing, uploading to personal cloud, screen capture of sensitive data)
- **Network DLP**: Inspecting network traffic for sensitive data patterns (in-line DLP appliance or proxy)
- **Cloud DLP**: Scanning cloud storage (SharePoint, OneDrive, Google Drive, Box) for sensitive data and enforcing classification-based sharing controls

**DLP implementation realities:**
- DLP is notoriously noisy if not tuned — high false positive rates lead to alert fatigue and policy bypass
- DLP must be tuned to the organisation's data landscape — start with the most sensitive data categories, tune rules before deploying in blocking mode
- DLP generates significant operational overhead — someone must review alerts and respond to false positives

**Minimum implementation:**
- Email DLP rules for payment card data (PCI DSS) and personal data (GDPR) — block or quarantine outbound email containing unencrypted sensitive data
- Endpoint DLP logging of sensitive data movement to removable media

**Evidence required:**
- DLP policy configuration (what content is monitored, what actions are taken)
- DLP alert review records
- Evidence of DLP incidents detected and acted upon

---

## Group 4: Logging and Monitoring (A.8.13–A.8.17)

### A.8.13 — Information Backup

**Purpose**: Ensure information can be recovered from backup when needed, protecting against data loss from system failures, ransomware, or accidental deletion.

**The 3-2-1 backup rule** (minimum standard):
- **3** copies of data
- **2** on different storage media types
- **1** offsite (physically separate from primary)

**Immutable backups**: Standard backups can be encrypted by ransomware if the backup system is connected to the network. **Immutable backups** (air-gapped, write-once, ransomware-protected) are now considered essential for critical data — the backup cannot be modified or deleted even by an administrator.

**Backup requirements:**
- Recovery Point Objective (RPO): How much data loss is acceptable? (e.g. last 4 hours of transactions) — determines backup frequency
- Recovery Time Objective (RTO): How quickly must systems be restored? — determines recovery infrastructure
- Backup coverage: All critical data must be covered; identify what is backed up and what is not
- Encryption: Backups must be encrypted (both in transit and at rest) — unencrypted backup tapes are a data breach risk
- Offsite storage: Backup copies must be stored in a physically separate location (ideally a different city) — a fire that destroys the primary data centre must not also destroy the backup

**Restoration testing** — the most commonly neglected backup requirement:
A backup that has never been tested may not be restorable. Reasons include: corrupted backup files, media degradation, software version incompatibility, configuration changes since the backup was taken.

Restoration testing must:
- Test actual restoration from backup (not just verify that backup completed)
- Test on a periodic schedule (at minimum quarterly for critical systems)
- Measure RTO (how long did restoration actually take?) against the defined objective
- Document results (evidence that the test was conducted and what the outcome was)

**Evidence required:**
- Backup schedule and coverage documentation
- Backup completion logs (showing backups are running as scheduled)
- Restoration test records (dates, systems tested, time taken, outcome)
- Offsite storage confirmation

**Common failure**: Backups running successfully for 18 months. Nobody has ever tested restoration. Ransomware hits. Restoration attempted. Backup files are corrupt or incompatible with current software version. Data is unrecoverable. £3M ransom paid.

---

### A.8.14 — Redundancy of Information Processing Facilities

**Purpose**: Ensure availability of information processing through redundant infrastructure.

**Redundancy patterns:**
- **Active-active**: Two systems running simultaneously; load balanced; instant failover
- **Active-passive**: One system active; second system on standby; failover takes minutes
- **Geographic redundancy**: Primary and secondary sites in different locations (protects against site-level disaster)
- **N+1 redundancy**: N systems needed to operate at full capacity; 1 additional available in case of failure

**Cloud redundancy**:
- Multi-AZ (Availability Zone) deployment — primary and backup in different data centres within the same region
- Multi-region deployment — primary and backup in different geographic regions (more expensive but protects against regional disasters)
- Cloud provider SLAs: Understand what uptime is guaranteed and under what conditions

**Testing redundancy:**
- Failover must be tested before it is needed
- Tabletop exercises are insufficient — the actual failover must be executed
- Chaos engineering: Deliberately introducing failures to verify redundancy works (Netflix's Chaos Monkey model)

---

### A.8.15 — Logging

**Purpose**: Produce logs of activities, exceptions, faults, and events, which are used for security monitoring, incident investigation, and forensic analysis.

**What must be logged:**
- Authentication events (successful and failed logins)
- Privileged access events (admin actions, use of privileged accounts)
- Access to sensitive data (who accessed what data, when)
- System administration activities (configuration changes, account creation/deletion)
- Security events (firewall blocks, IDS/IPS alerts, malware detections)
- Application errors and exceptions
- Network traffic (particularly ingress and egress to/from the internet)

**Log integrity:**
- Logs must be protected from modification (write-once log stores, cryptographic signing)
- Administrators must not be able to modify or delete their own activity logs (separation of duties between administration and log management)
- Logs should be centralised in a SIEM to prevent individual system log tampering

**Log retention:**
- Retain logs for a period sufficient for incident investigation and regulatory requirements
- GDPR breaches require the ability to investigate — logs must be retained long enough to support investigation
- PCI DSS requires 12 months of audit log retention (3 months immediately available)
- NCSC recommends 6–12 months minimum for security logging

**SIEM (Security Information and Event Management):**
- Aggregates logs from multiple sources
- Correlates events to detect patterns that individual log sources would miss
- Generates alerts for suspicious activity
- Provides investigation capability (search, timeline, relationship mapping)
- Examples: Microsoft Sentinel, Splunk, IBM QRadar, Elastic SIEM

---

### A.8.16 — Monitoring Activities *(NEW in 2022)*

**Purpose**: Monitor networks, systems, and applications for anomalous behaviour that may indicate a security incident.

**What must be monitored:**
- Network traffic patterns (unusual volume, unusual destinations, unusual protocols)
- User behaviour (access outside normal hours, access to unusual resources, excessive data access)
- System behaviour (unusual process execution, unusual network connections from endpoints)
- Cloud activity (unusual API calls, unusual resource creation, unusual geographic access)
- Application behaviour (unusual query patterns, elevated error rates, authentication anomalies)

**Monitoring approaches:**
- **SIEM-based detection**: Rules and correlation logic detect known attack patterns (known indicators of compromise, known attack techniques from MITRE ATT&CK)
- **UEBA (User and Entity Behaviour Analytics)**: Machine learning baselines normal behaviour; detects deviations (insider threat, compromised accounts)
- **Network Detection and Response (NDR)**: Analyses network traffic for anomalous patterns
- **Endpoint Detection and Response (EDR)**: Monitors endpoint behaviour for suspicious process activity

**Alert review process:**
- Every alert must be reviewed — a SIEM that generates alerts nobody reviews provides no security value
- Triage process: classify alerts (true positive/false positive/benign)
- Investigation process: for true positives, investigate to determine scope and impact
- Escalation process: significant incidents escalate to the incident response process

---

### A.8.17 — Clock Synchronisation

**Purpose**: Ensure all information processing systems use a consistent, accurate time source.

**Why it matters**: Log timestamps are used for incident investigation, security correlation, and forensic analysis. If systems have inconsistent time, correlating events across systems is impossible and forensic evidence may be inadmissible.

**Implementation**:
- All systems synchronised to a reliable NTP (Network Time Protocol) source
- For highest accuracy: GPS-based NTP servers or stratum-1 NTP servers
- For most organisations: Active Directory infrastructure provides NTP to domain-joined systems; verify that AD syncs to a reliable external source
- Cloud services typically provide accurate time automatically

---

## Group 5: Network and Infrastructure Controls (A.8.18–A.8.23)

### A.8.18 — Use of Privileged Utility Programs

**Purpose**: Control access to system utilities that can override or bypass security controls.

**Examples of privileged utilities**: Password crackers, network scanners (Nmap), packet capture tools (Wireshark), registry editors, disk utilities, remote administration tools, debugging tools.

**Controls:**
- Maintain an approved list of privileged utilities permitted for legitimate operational use
- Restrict installation of unapproved utilities (application control)
- Log all use of privileged utilities
- Require justification and approval for use
- Remove or disable utilities that are not needed for operational purposes (reduce the attack surface)

---

### A.8.19 — Installation of Software on Operational Systems

**Purpose**: Prevent unauthorised or insecure software from being installed on production systems.

**Implementation:**
- Software installation on servers requires change management approval
- Workstation software installation restricted (standard users cannot install software; admin rights required, and admin rights are not held by standard users)
- Application allowlisting for critical systems (only approved software can execute)
- Approved software catalogue — users can request software from a pre-approved list
- Vulnerability assessment of new software before deployment

---

### A.8.20 — Networks Security

**Purpose**: Protect networks and network devices from attacks and prevent unauthorised access.

**Network security controls:**
- **Firewalls**: Stateful inspection firewalls at network perimeter; next-generation firewalls (NGFW) with application awareness, IPS, and deep packet inspection for higher-security environments
- **Intrusion Detection/Prevention Systems (IDS/IPS)**: Detect and block known attack signatures and anomalous traffic patterns
- **Network Access Control (NAC)**: Verify that devices meet security requirements before allowing network access
- **DMZ (Demilitarised Zone)**: Separate network zone for internet-facing services, isolated from internal networks
- **VPN**: Secure remote access; all traffic encrypted in transit
- **Network monitoring**: Continuous monitoring of network traffic for anomalies (A.8.16 overlap)

**Firewall rule management:**
- Firewall rules must be documented and justified
- Rules must be reviewed periodically (at least annually) for continued necessity
- Default-deny policy (block all traffic not explicitly permitted)
- Unused or overly permissive rules must be removed or tightened
- Change management for firewall rule changes

---

### A.8.21 — Security of Network Services

**Purpose**: Ensure the security of network services used by the organisation, whether internal or outsourced.

**For internal services**: Document security requirements for each network service; assess security controls in place; monitor service performance against requirements.

**For outsourced network services**: Define security requirements in contracts (SLAs, security controls, incident notification); assess provider compliance; monitor ongoing performance.

---

### A.8.22 — Segregation of Networks

**Purpose**: Separate groups of services, users, and systems in the network to reduce the scope of security incidents and limit the spread of breaches.

**Network segmentation approaches:**
- **VLANs (Virtual LANs)**: Logical separation of network traffic at Layer 2. Different departments or security zones on different VLANs.
- **Subnets**: Layer 3 separation, with routed boundaries between segments
- **Firewalls between segments**: Traffic between segments passes through a firewall, applying access control rules
- **Micro-segmentation**: Software-defined networking approach allowing very granular isolation of individual workloads

**Key segments to implement:**
- DMZ (internet-facing services)
- Internal corporate network
- Server/data centre network (separated from user desktops)
- PCI DSS Cardholder Data Environment (required by PCI DSS — complete isolation of card data systems)
- OT/ICS networks (operational technology, industrial control systems — physically or logically isolated from IT networks)
- Guest wireless (completely isolated from corporate network)
- BYOD network (segregated from sensitive corporate systems)

**Why it matters**: Without segmentation, a ransomware infection on one workstation can spread to all workstations and servers on the flat network. With proper segmentation, the infection is contained within a VLAN or subnet, limiting blast radius.

---

### A.8.23 — Web Filtering *(NEW in 2022)*

**Purpose**: Control access to external websites to reduce risk from malicious content and enforce acceptable use.

**Implementation approaches:**
- **DNS-based filtering**: Block DNS resolution for known-malicious domains (Cisco Umbrella, Cloudflare Gateway, Pi-hole)
- **Proxy-based filtering**: Route all web traffic through a proxy that inspects and filters URLs
- **Endpoint-based filtering**: Software agents on each endpoint apply filtering locally (useful for remote workers)

**Categories to consider blocking:**
- Malware and phishing sites (mandatory)
- Command and control (C2) callback sites (mandatory)
- Anonymisers/VPN services (reduces ability to bypass controls)
- High-risk categories (depending on business context): adult content, gambling, file sharing

**Remote worker consideration**: Traditional proxy-based filtering doesn't apply to remote workers connecting directly to the internet (not through corporate proxy). DNS-based filtering or endpoint agents extend filtering to remote workers.

---

## Group 6: Cryptography (A.8.24)

### A.8.24 — Use of Cryptography

**Purpose**: Ensure proper and effective use of cryptography to protect the confidentiality, authenticity, and integrity of information.

**Cryptography policy requirements:**
- Define which data must be encrypted (at minimum: personal data, financial data, authentication credentials, encryption keys)
- Define approved encryption algorithms and key lengths (avoid deprecated algorithms: MD5, SHA-1, DES, 3DES, RC4)
- Define key management requirements

**Approved algorithms (current standards):**

| Use case | Recommended algorithm | Key length |
|---|---|---|
| Symmetric encryption (bulk data) | AES | 128-bit minimum; 256-bit preferred |
| Asymmetric encryption (key exchange, digital signatures) | RSA, ECC (ECDSA/ECDH) | RSA: 2048-bit minimum; 4096-bit preferred. ECC: 256-bit |
| Hashing (integrity, password storage) | SHA-256 or SHA-3 (NOT MD5 or SHA-1) | N/A |
| Password hashing | bcrypt, scrypt, Argon2 | With appropriate work factor |
| TLS (web/API encryption) | TLS 1.2 minimum; TLS 1.3 preferred | (Protocol version controls cipher suite) |

**Deprecated and prohibited:**
- MD5: Cryptographically broken — do not use for security purposes
- SHA-1: Vulnerable to collision attacks — do not use for digital signatures or certificates
- DES/3DES: Insufficient key length — do not use
- RC4: Multiple vulnerabilities — do not use
- TLS 1.0 and 1.1: Deprecated by all major standards bodies — disable and replace with TLS 1.2/1.3

**Key management requirements:**
- Encryption keys are as sensitive as the data they protect — if the key is compromised, the encryption provides no security
- Key generation: Use cryptographically secure random number generation
- Key storage: Hardware Security Modules (HSMs) for highest-value keys; encrypted key stores for others — never in plaintext
- Key rotation: Define rotation schedules; rotate keys promptly if compromise is suspected
- Key backup: Encrypted backup of keys; tested restoration procedure
- Key destruction: Cryptographic erasure of old keys when no longer needed

**Encryption in practice:**
- **Data in transit**: TLS for all network communications; HTTPS for all web services (no HTTP without redirect); certificate management (valid certificates, certificate rotation, pinning for high-value applications)
- **Data at rest**: Full disk encryption for all devices (A.7.9 overlap); database encryption; file-level encryption for particularly sensitive data; encrypted backups (A.8.13 overlap)
- **End-to-end encryption**: For highest-sensitivity communications — email encryption (S/MIME), secure messaging applications

---

## Group 7: Secure Development (A.8.25–A.8.31)

### A.8.25 — Secure Development Life Cycle

**Purpose**: Ensure security is integrated into the software development process from requirements to decommission.

**Security gates in the SDLC:**

| Stage | Security activity |
|---|---|
| Requirements | Security requirements defined; threat modelling initiated |
| Design | Threat modelling completed; security architecture reviewed |
| Development | Secure coding standards applied; SAST scanning during coding |
| Testing | DAST scanning; penetration testing for significant releases; security test cases executed |
| Deployment | Security configuration review; change management approval; deployment to secure baseline |
| Operation | Vulnerability management; monitoring; patch management |
| Decommission | Secure data deletion; credential rotation; dependency removal |

**Developer security education**: Developers must understand secure coding — not as an afterthought, but as a core professional competence. Training on OWASP Top 10, language-specific vulnerabilities, and the organisation's secure coding standards is mandatory for all developers.

---

### A.8.26 — Application Security Requirements

**Purpose**: Ensure security requirements are defined, specified, and approved as part of application development or acquisition.

**Security requirements sources:**
- Business risk assessment (what would a breach of this application cost?)
- Regulatory requirements (GDPR, PCI DSS, FCA rules)
- CIA requirements (what are the confidentiality, integrity, and availability requirements?)
- Authentication and authorisation requirements
- Audit and logging requirements
- Data handling and encryption requirements

**For acquired software:**
- Security requirements must be in the procurement specification
- Vendor security practices must be assessed (their SDLC, vulnerability disclosure programme, patch cadence)
- Software Bill of Materials (SBOM) increasingly required to identify open-source component risks

---

### A.8.27 — Secure System Architecture and Engineering Principles

**Purpose**: Apply security engineering principles throughout the design and implementation of information systems.

**Core security design principles:**
- **Defence in depth**: Multiple layers of security controls; no single control failure leads to complete compromise
- **Least privilege**: Every component has the minimum access necessary for its function
- **Fail secure**: When a system fails, it fails to a secure state (deny access) rather than an insecure state (allow access)
- **Separation of duties**: Critical functions separated between different components or individuals
- **Economy of mechanism**: Simple designs are easier to secure and verify than complex ones
- **Open design**: Security does not rely on obscurity; the security mechanism can be published without compromising security (Kerckhoffs's principle)
- **Complete mediation**: Every access is checked, every time — no caching of access decisions

**Zero Trust architecture**: The modern security architecture paradigm — "never trust, always verify." No network location is trusted by default; every user and device must be authenticated and authorised for every resource access, regardless of whether they are on the corporate network or remote. Implemented through: identity-centric access control, micro-segmentation, continuous verification.

---

### A.8.28 — Secure Coding *(NEW in 2022)*

**Purpose**: Apply secure coding principles in software development to prevent vulnerabilities.

**Secure coding requirements:**
- Documented secure coding standards for all languages in use
- Developer training on secure coding (OWASP Top 10 minimum; language-specific guidance)
- Static Application Security Testing (SAST) integrated into the development pipeline (code scanning during commit/build)
- Code review with security focus — at least one reviewer must assess security implications
- No hardcoded credentials in source code (detected by tools like GitLeaks, TruffleHog)

**OWASP Top 10 (2021 edition) — critical vulnerabilities to address in secure coding:**

| Rank | Category | Description |
|---|---|---|
| A01 | Broken Access Control | Failure to enforce what authenticated users can do |
| A02 | Cryptographic Failures | Weak/absent encryption, deprecated algorithms |
| A03 | Injection | SQL injection, command injection, LDAP injection |
| A04 | Insecure Design | Security not designed in from the start |
| A05 | Security Misconfiguration | Default credentials, unnecessary features, verbose errors |
| A06 | Vulnerable Components | Using outdated or vulnerable libraries and frameworks |
| A07 | Authentication Failures | Weak authentication, broken session management |
| A08 | Software and Data Integrity Failures | Insecure update mechanisms, unsigned code |
| A09 | Security Logging Failures | Insufficient logging for incident detection/investigation |
| A10 | SSRF (Server-Side Request Forgery) | Server making requests to unintended locations (Capital One breach vector) |

---

### A.8.29 — Security Testing in Development and Acceptance

**Purpose**: Verify that security requirements are met through testing before deployment.

**Testing types:**
- **SAST (Static Application Security Testing)**: Analyses source code for vulnerabilities without executing the application. Tools: SonarQube, Checkmarx, Veracode, Semgrep.
- **DAST (Dynamic Application Security Testing)**: Tests a running application from the outside, simulating attacker behaviour. Tools: OWASP ZAP, Burp Suite (automated scan mode), Invicti.
- **IAST (Interactive Application Security Testing)**: Combines SAST and DAST — instruments the running application to detect vulnerabilities during functional testing.
- **SCA (Software Composition Analysis)**: Identifies vulnerable open-source libraries and components. Tools: Snyk, OWASP Dependency-Check, WhiteSource.
- **Penetration testing**: Manual adversarial testing by skilled testers — finds complex vulnerabilities that automated tools miss.

**Security testing in CI/CD pipelines:**
- SAST runs on every code commit (fast; immediate feedback to developers)
- SCA runs on every build (checks dependency vulnerabilities)
- DAST runs on staging environment (before production deployment)
- Manual penetration testing at least annually, and after major changes

---

### A.8.30 — Outsourced Development

**Purpose**: Manage security risks in software developed by external parties.

**Requirements for outsourced development:**
- Security requirements in the contract (secure coding standards, testing requirements, vulnerability disclosure)
- Right to audit the supplier's development environment and code
- Code review or independent security testing before delivery
- IP ownership and confidentiality clearly defined
- SBOM (Software Bill of Materials) from the supplier
- Ongoing management of the supplier relationship (A.5.22)

---

### A.8.31 — Separation of Development, Test, and Production Environments

**Purpose**: Prevent accidental or unauthorised changes to production systems, and prevent sensitive production data from reaching development and test environments.

**Environment separation requirements:**
- Development, test/staging, and production are logically (or physically) separate environments
- Developers do not have write access to production (CI/CD pipelines deploy to production — not developers directly)
- Production data is not used in development or test environments (A.8.11 data masking overlap)
- Credentials differ between environments (production credentials never in dev/test code)
- Changes promoted from dev → test → production through a controlled pipeline (not copied manually)

---

## Group 8: Change and Audit Management (A.8.32–A.8.34)

### A.8.32 — Change Management

**Purpose**: Ensure changes to information processing facilities and systems are managed in a controlled manner.

**Change management process:**
1. **Request**: Change request submitted with description, justification, and risk assessment
2. **Assessment**: Impact and risk assessed (security implications must be specifically considered)
3. **Approval**: Authorised by appropriate level based on risk/impact
4. **Testing**: Change tested in non-production environment
5. **Implementation**: Controlled deployment with rollback plan available
6. **Review**: Post-implementation review confirming success and no unintended consequences
7. **Documentation**: All steps documented with evidence

**Emergency changes**: A faster process for urgent changes (security patching, incident response) — still requires documentation and post-implementation review, even if approval is expedited.

**Security sign-off**: Changes above a defined threshold (affecting security controls, changing access rights, modifying firewalls) require security team approval before implementation.

---

### A.8.33 — Test Information

**Purpose**: Ensure test data is appropriately selected, protected, and managed.

- Production personal data must not be used in test environments without masking (A.8.11 overlap)
- Test data must be protected with the same level of security as its sensitivity requires
- Test data lifecycle: created, used, deleted — not retained indefinitely in test environments
- If production data is used in testing (with authorisation), same access controls as production apply

---

### A.8.34 — Protection of Information Systems During Audit Testing

**Purpose**: Ensure that audit and testing activities do not disrupt operational systems or create security risks.

- Penetration testing and other security assessments must be formally authorised before commencement (Rules of Engagement)
- Scope, methods, and timing must be agreed with system owners and IT operations before testing begins
- Testing teams must not access live production data unless absolutely necessary and authorised
- Aggressive testing (DDoS simulation, destructive testing) must be conducted in isolated environments
- Results must be securely transmitted to the commissioning organisation — not left in cloud storage or emailed unencrypted

---

## Common Audit Findings in Category 8

| Control | Most common finding |
|---|---|
| A.8.2 | Shared admin accounts; no privileged access review |
| A.8.5 | MFA not enforced for remote access; SMS MFA only |
| A.8.8 | Vulnerability scan results not actioned; no patch SLA defined or enforced |
| A.8.13 | Backup restoration never tested; no immutable backup for critical data |
| A.8.15 | Logging enabled but not reviewed; log retention too short |
| A.8.20 | Firewall rules not reviewed in 2+ years; default rules left in place |
| A.8.22 | Flat network — no segmentation between user workstations and servers |
| A.8.24 | Deprecated TLS versions in use; encryption keys not rotated |
| A.8.28 | No SAST in development pipeline; no secure coding training for developers |
| A.8.31 | Production credentials in development code; production data in test environments |

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Category 8 controls are tested through technical evidence requests and demonstrations: "Show me the last vulnerability scan report." "Show me your patch compliance report for the last quarter." "Demonstrate your backup restoration process."
- The most frequently tested controls: A.8.5 (MFA), A.8.8 (vulnerability management), A.8.13 (backup with restoration test), A.8.15 (logging), A.8.22 (network segmentation)
- New 2022 controls (A.8.9 configuration management, A.8.12 DLP, A.8.16 monitoring, A.8.28 secure coding) are being actively examined as organisations transition to 2022

**CISM:** Domain 3 covers technical control management at programme level; CISM candidates should understand the controls and their business justification

**CISSP:** Domain 3 (Security Architecture), Domain 4 (Communication and Network Security), Domain 6 (Security Assessment), and Domain 8 (Software Development Security) all map directly to Category 8 controls

**CRISC:** Controls in Category 8 represent the risk mitigation actions for most IT risks — the connection between risk assessment and control selection is central to CRISC

---

## GUARDIAN's Take

Category 8 is where most security budget is spent and where most security performance is measured. Patch compliance rates, phishing click rates, MFA coverage — these are the metrics that appear in board security reports. They are important.

But the failure mode I see most often in technically sophisticated organisations is not in the controls themselves — it is in the gap between control deployment and control operation. The SIEM is configured; nobody reviews the alerts. The vulnerability scanner runs every week; the findings sit in a report nobody acts on. The backup runs nightly; nobody has ever tested whether the backup can actually be restored.

Every technical control in Category 8 has a usage dimension that the deployment decision often ignores. The question is not "do we have a SIEM?" but "does our SIEM alert review process catch real incidents before they escalate?" Not "do we have backups?" but "have we demonstrated that we can restore from backup within our RTO?"

The most operationally mature security programmes I have seen treat their technical controls as products to be measured, not assets to be deployed. They track not just coverage (what percentage of endpoints have EDR?) but effectiveness (what percentage of simulated attacks was detected and blocked?). They don't just run vulnerability scans — they track the time from vulnerability discovery to remediation, and they challenge exceptions rather than accepting them.

Deploy the controls. But then measure whether they are actually working. That measurement — that honest, ongoing evaluation of control effectiveness — is what separates a technical security programme that actually improves security from one that simply increases the line item in the IT budget.

---
*Module: Module 4 — ISO 27002 Controls | Guardian Curriculum*
