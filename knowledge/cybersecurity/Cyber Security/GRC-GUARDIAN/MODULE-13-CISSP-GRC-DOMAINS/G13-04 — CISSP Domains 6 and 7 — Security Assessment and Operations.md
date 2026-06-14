---
tags: [guardian, grc, module-13, cissp, domain-6, domain-7, security-assessment, security-operations, audit, incident-response]
module: 13
cert-coverage: [cissp]
difficulty: intermediate
date: 2026-04-28
guardian-refs: ["G13-01 — CISSP Overview", "G13-02 — Domain 1", "G10-01 through G10-08 — Audit Module", "G8-01 through G8-06 — BCM Module", "G12-05 — Incident Management"]
---

# G13-04 — CISSP Domains 6 and 7: Security Assessment and Security Operations

> [!abstract] What This Note Covers
> Domains 6 (Security Assessment and Testing, 12%) and 7 (Security Operations, 13%) are the highest GRC-relevance domains after Domain 1. Domain 6 directly maps to Module 10 (Audit and Assurance). Domain 7 covers incident management, BCM, and security operations — mapping to Modules 8 and 12. This note provides CISSP-specific coverage with exam application.

---

## Domain 6: Security Assessment and Testing

### What Domain 6 Tests

Domain 6 tests your ability to assess, test, and verify the security of systems and controls. For GRC professionals, this domain overlaps heavily with internal audit, vulnerability assessment, and compliance testing. Questions assess:

- Audit strategy and methodology (types, planning, evidence)
- Vulnerability scanning and penetration testing
- Software testing methods (security testing in development)
- Log review and security information management
- Management reviews and reporting

**GUARDIAN curriculum foundation**: Module 10 (Audit and Assurance — all 8 notes) covers the audit methodology components of Domain 6 comprehensively.

---

### 6.1 Audit Strategy and Types

**First, second, and third-party audits** (covered in G10-01): The classification of audit types by independence level. CISSP tests the same framework as ISO 19011.

**Internal vs external audit**: Internal audits provide continuous monitoring and improvement input; external audits (certification bodies, regulators, QSAs) provide independent assurance to external stakeholders.

**Audit frequency**: Risk-based — higher-risk areas audited more frequently. CISSP questions that ask about audit frequency should be answered with reference to risk, not arbitrary schedules.

---

### 6.2 Vulnerability Assessments vs Penetration Testing

CISSP specifically distinguishes these two assessment types — a very commonly tested distinction:

**Vulnerability assessment:**
- Identifies and quantifies security vulnerabilities in a system
- Automated scanning tools (Nessus, Qualys, OpenVAS) scan for known vulnerabilities
- Produces a list of vulnerabilities with severity ratings
- Does NOT exploit vulnerabilities — only identifies them
- Less disruptive; can be conducted frequently
- Output: Vulnerability report with remediation recommendations

**Penetration testing:**
- Attempts to actively exploit vulnerabilities to assess real-world impact
- Conducted by skilled security professionals (or automated tools for specific tests)
- Tests whether vulnerabilities are actually exploitable (some vulnerabilities exist but cannot be practically exploited)
- More disruptive — active exploitation may affect system stability
- Provides evidence of what an actual attacker could achieve
- Output: Penetration test report with exploited vulnerabilities and evidence of impact

**The key distinction**: Vulnerability assessment = find the holes. Penetration testing = prove you can get through the holes.

**Penetration test types:**

*Black box*: Tester has no prior knowledge of the target — simulates an external attacker with no inside information.

*White box*: Tester has complete knowledge of the target (source code, architecture diagrams, credentials) — most thorough; identifies the most vulnerabilities.

*Grey box*: Tester has partial knowledge — simulates a partially informed attacker (e.g. a supplier with some network access; an employee with limited credentials).

**CISSP exam pattern**: "Which assessment type simulates an attacker with no prior knowledge of the target?" → Black box penetration test. "What is the difference between a vulnerability scan and a penetration test?" → Scan identifies vulnerabilities; pen test exploits them.

---

### 6.3 Testing Methodologies

**OWASP Top 10**: The Open Web Application Security Project's list of the most critical web application security risks. CISSP tests awareness of key vulnerabilities:

- Injection (SQL injection; command injection; LDAP injection)
- Broken Authentication
- Sensitive Data Exposure
- XML External Entities (XXE)
- Broken Access Control
- Security Misconfiguration
- Cross-Site Scripting (XSS)
- Insecure Deserialization
- Using Components with Known Vulnerabilities
- Insufficient Logging and Monitoring

**Code review types:**

*Static analysis (SAST — Static Application Security Testing)*: Analysing source code, bytecode, or binary without executing the program. Finds vulnerabilities in code before execution. Tools: Checkmarx, Fortify, SonarQube.

*Dynamic analysis (DAST — Dynamic Application Security Testing)*: Testing the running application by providing inputs and observing behaviour. Finds vulnerabilities in the executing system. Tools: Burp Suite, OWASP ZAP.

*Interactive analysis (IAST)*: Combines static and dynamic; instrumentation inside the running application observes execution in real time.

**Synthetic transactions**: Simulated transactions used to test application functionality and performance under controlled conditions — not real user data but scripted inputs designed to test specific functions.

---

### 6.4 Log Review and Security Monitoring

**Log management**: Collecting, storing, and analysing event logs from systems and applications. Covered in detail in G9-03 (Logging Standard) and G12-04 (Security Monitoring Programme).

**CISSP Domain 6 emphasis**:

*SIEM (Security Information and Event Management)*: Centralised log collection, correlation, and alerting. SIEM is the primary tool for security monitoring — aggregating events from multiple sources, applying correlation rules, and generating alerts for investigation.

*Key log sources for security monitoring*:
- Authentication logs (login success/failure; MFA events)
- Firewall and network logs (allowed/denied traffic; connection attempts)
- Application logs (application errors; unusual transactions)
- System logs (service start/stop; privilege use)
- Audit logs (administrative actions; configuration changes)

*Log retention*: Logs must be retained for an appropriate period to support incident investigation and regulatory compliance. CISSP: minimum 12 months for most security logs; 3 months immediately accessible.

*Log integrity*: Logs must be protected from modification. Write-once storage; separate log management infrastructure from systems being monitored; time synchronisation (NTP) to ensure accurate timestamps.

---

### 6.5 Security Review and Metrics

**Key performance indicators (KPIs) for security testing:**

- Vulnerability remediation rate by severity (% of critical vulnerabilities remediated within SLA)
- Mean time to patch (average days between vulnerability disclosure and remediation)
- Penetration test finding remediation rate
- Code review coverage (% of code reviewed by SAST/DAST before deployment)
- Log coverage (% of in-scope systems sending logs to SIEM)

**CISSP exam pattern**: "Which metric BEST demonstrates the effectiveness of the vulnerability management programme?" → Remediation rate within defined SLAs — an outcome metric showing whether identified vulnerabilities are being addressed. Not: number of vulnerabilities discovered (this is an activity metric, not an effectiveness metric).

---

## Domain 7: Security Operations

### What Domain 7 Tests

Domain 7 covers the operational security functions — incident management, business continuity, disaster recovery, physical security, and security operations management. It is the most operationally intensive CISSP domain for GRC professionals. Questions assess:

- Incident management (lifecycle; forensics; regulatory response)
- BCP and DRP (recovery sites; testing; BIA at strategic level)
- Physical security (perimeter; access controls; environmental)
- Security operations concepts (need-to-know; least privilege; job rotation)
- Identity and access management in operations
- Vulnerability and patch management in operations

**GUARDIAN curriculum foundation**: Module 8 (Business Continuity — all 6 notes), G12-05 (Incident Management — CISM Domain 4), and G10-07 (Corrective Action) cover significant Domain 7 content.

---

### 7.1 Incident Management in CISSP

**NIST SP 800-61 Incident Response Lifecycle** (the CISSP-aligned framework):

1. **Preparation**: Establishing incident response capability before incidents occur
2. **Detection and Analysis**: Identifying and characterising incidents
3. **Containment, Eradication, and Recovery**: Limiting damage; removing threats; restoring operations
4. **Post-Incident Activity**: Lessons learned; evidence handling; reporting

**CISSP vs CISM on incident management:**

CISM Domain 4 (covered in G12-05) focuses on executive management of incidents. CISSP Domain 7 adds:
- Forensic evidence collection and preservation (chain of custody)
- Specific legal considerations during incidents
- SIEM and monitoring integration with incident detection
- Physical security during incidents

**Forensic evidence handling:**

*Order of volatility*: When collecting forensic evidence, capture the most volatile (easily lost) data first:
1. CPU registers and cache
2. Memory (RAM)
3. Network state (connections; routing tables)
4. Running processes and open files
5. Disk storage
6. Log files (may be on external systems)
7. Archived media (backup tapes)

**Chain of custody**: The documented record of who had access to evidence, when, and what was done with it. Required for evidence to be admissible in legal proceedings.

**CISSP exam pattern**: "During an incident investigation, what should be captured FIRST?" → Memory (RAM) — it is the most volatile; it is lost when the system is powered off. "What is required to ensure forensic evidence is admissible in court?" → Chain of custody documentation.

---

### 7.2 Business Continuity and Disaster Recovery

Module 8 covers BCM comprehensively. CISSP Domain 7 tests the same concepts from an operational perspective with emphasis on:

**Recovery site types** (covered in G13-02 Domain 1 section):
- Hot site / Warm site / Cold site / Mirrored site / Mobile site / Reciprocal agreement

**Backup types:**

*Full backup*: Complete copy of all data. Slow to create; fast to restore (single tape/volume).

*Incremental backup*: Copies only data changed since the LAST backup (full or incremental). Fast to create; slow to restore (must restore full + all incrementals in sequence).

*Differential backup*: Copies only data changed since the LAST FULL backup. Faster to create than full; faster to restore than incremental (restore full + most recent differential only).

**CISSP exam pattern**: "Which backup type provides the fastest restoration?" → Full backup (restore from single backup set). "Which provides the fastest backup creation?" → Incremental (only changed data since last backup — smallest set).

**Recovery testing:**

Types of recovery tests (also in G8-05):
- Read-through/checklist review
- Structured walkthrough/tabletop
- Simulation exercise
- Parallel testing (activate DR while production continues — dual operation)
- Full interruption test (cut over to DR; production stops)

**Parallel vs full interruption**: Parallel testing activates the DR environment alongside production — lower risk; confirms DR capability without disrupting production. Full interruption completely switches to DR — highest confidence in recovery capability; highest risk (production is offline during the test).

**CISSP exam pattern**: "Which BCP test type provides the MOST confidence that recovery will succeed but carries the HIGHEST risk?" → Full interruption test. "Which test type is LEAST disruptive?" → Checklist review / tabletop.

---

### 7.3 Physical Security (Domain 7 Component)

CISSP Domain 7 includes physical security — access controls, environmental controls, and physical threats. Key concepts:

**Physical access control layers (defence in depth):**
- Perimeter (fencing, gates, lighting, CCTV)
- Building exterior (reinforced doors, access control systems)
- Internal areas (badge readers, mantrap/airlocks for data centres)
- Restricted areas (two-person integrity for sensitive operations)
- Equipment (server rack locks; tamper-evident seals)

**Mantrap (airlock)**: A physical security control using two doors where the first must close and authenticate before the second opens. Prevents tailgating. Used for data centre and secure area access.

**Environmental controls:**
- Temperature and humidity: Servers operate within defined ranges; HVAC systems maintain conditions
- Fire suppression: Dry pipe or pre-action suppression preferred in data centres (avoids water damage); halon replacement gases (FM-200, Novec 1230) for electrical areas
- Power: UPS (Uninterruptible Power Supply) for short-term outages; generator for sustained outages; PDU (Power Distribution Unit) management

**CISSP exam pattern**: "Which fire suppression system is MOST appropriate for a data centre?" → Clean agent (FM-200, Novec 1230) — suppresses fire without water or residue that would damage equipment. Not: sprinkler (water damage); not: dry chemical (residue damage).

---

### 7.4 Security Operations Concepts

**Need-to-know**: Information is accessible only to those who need it to perform their job function. Not everyone with clearance necessarily needs access to all information at that classification level — clearance is a prerequisite; need-to-know is the operational restriction.

**Least privilege**: Every user, process, and system operates with the minimum permissions required to perform its function. Reduces the blast radius of compromise.

**Separation of duties (SoD)**: Divides critical functions between multiple people so no single person can complete a sensitive transaction alone. Prevents fraud and error.

*Examples*:
- Finance: Different people approve, process, and reconcile payments
- IT: Different people write code, test code, and deploy code
- Security: Different people implement controls and audit their effectiveness

**Two-person integrity**: Critical operations require two authorised individuals to be present. Prevents insider threats for the most sensitive operations (data centre access; key management ceremonies; backup handling).

**Job rotation**: Regularly moving employees between roles. Benefits:
- Detects fraud (fraudulent schemes require continuous presence)
- Builds cross-functional knowledge
- Reduces key-person dependency

**Mandatory vacation**: Requiring all staff to take vacation. Benefits:
- Requires a temporary replacement — exposes any fraud requiring continuous manipulation
- Provides recovery from work-related stress

**CISSP exam pattern**: "Which control MOST effectively detects ongoing employee fraud?" → Mandatory vacation (requires replacement who may discover anomalies) + job rotation. "Which control prevents any single person from committing fraud alone?" → Separation of duties.

---

## Domains 6 and 7 Practice Questions

**Q10.** During an incident investigation, a forensic analyst needs to preserve volatile evidence from a running server. What should be captured FIRST?

A) Hard drive contents
B) Network logs
C) System RAM (memory)
D) Firewall logs

**Answer: C** — Memory (RAM) is the most volatile — it is lost when the system is powered off or rebooted. Hard drive contents (A) persist after shutdown. Logs (B, D) are typically written to disk or external systems. Memory must be captured before any shutdown or significant system interaction that would clear it.

---

**Q11.** A company wants to test its disaster recovery plan with the highest confidence that recovery will succeed, but is willing to accept temporary service disruption during the test. Which test type is MOST appropriate?

A) Tabletop exercise
B) Parallel test
C) Full interruption test
D) Simulation exercise

**Answer: C** — The full interruption test provides the highest confidence (production switches to DR; recovery is actually performed) and accepts temporary disruption (production is offline). Tabletop (A) and simulation (D) are discussion-based; they don't test actual recovery. Parallel test (B) provides high confidence with lower disruption (DR activated alongside production) but doesn't confirm complete failover.

---

**Q12.** Which backup type requires restoring the full backup plus ONLY the most recent incremental-type backup to achieve full recovery?

A) Full backup only
B) Full backup + incremental chain
C) Full backup + most recent differential backup
D) Differential backups only

**Answer: C** — Differential backups contain all changes since the last full backup. Recovery requires only: full backup + most recent differential. Incremental backups (B) contain only changes since the last backup (any type) — recovery requires: full backup + every incremental since the full. Full backup alone (A) is incomplete unless no changes have occurred. Differential alone (D) doesn't include the original baseline.

---

**Q13.** A company requires that no single employee can approve AND process a financial transaction. This control is an example of:

A) Need-to-know
B) Least privilege
C) Job rotation
D) Separation of duties

**Answer: D** — Separation of duties divides a critical function (financial transaction) into parts performed by different people — approval and processing by different employees ensures no single person can complete the transaction alone. Need-to-know (A) limits information access; least privilege (B) limits permission scope; job rotation (C) moves employees between roles.

---

**Q14.** Which type of security assessment identifies vulnerabilities in a system but does NOT attempt to exploit them?

A) Penetration test (black box)
B) Penetration test (white box)
C) Vulnerability assessment
D) Red team exercise

**Answer: C** — A vulnerability assessment identifies and quantifies vulnerabilities using automated scanning tools, but does not attempt exploitation. Penetration tests (A, B) and red team exercises (D) all involve active exploitation. The distinction is: assessment = find; penetration test = prove you can exploit.

---

## Domains 6 and 7 Key Exam Summary

| Topic | Key exam point |
|---|---|
| Vulnerability assessment | Identifies vulnerabilities; does NOT exploit |
| Penetration test | Actively exploits vulnerabilities; proves real-world impact |
| Black/white/grey box | Knowledge level given to tester before engagement |
| Order of volatility | RAM first; then processes; then disk; then logs |
| Chain of custody | Required for legal admissibility of forensic evidence |
| Backup types | Full (slowest create, fastest restore); Incremental (fastest create, slowest restore); Differential (middle) |
| Recovery sites | Hot (minutes); Warm (hours); Cold (days); Mirrored (immediate) |
| Full interruption test | Highest confidence; highest risk |
| Parallel test | High confidence; production continues |
| Separation of duties | No single person completes critical transaction alone |
| Mandatory vacation | Detects fraud requiring continuous presence |

---

## GUARDIAN's Take

Domains 6 and 7 represent the operational execution layer of security — where governance decisions become assessment methodologies and where security operations translate into incident response, business continuity, and forensic capability.

For GRC candidates, these domains are the most practical — they describe what organisations must actually do to maintain security assurance (Domain 6) and what happens when things go wrong (Domain 7). The audit methodology from Module 10 maps directly to Domain 6; the BCM and incident management from Modules 8 and 12 map directly to Domain 7.

The CISSP-specific additions: the forensic order of volatility and chain of custody (Domain 7); the vulnerability assessment vs penetration test distinction and test types (Domain 6); and the backup type tradeoffs (Domain 7). These are frequently tested and definitively answerable once the framework is learned.

With Domains 1, 2, 6, and 7 well covered by this curriculum, your CISSP preparation effort can concentrate on Domains 3 (Architecture), 4 (Network Security), 5 (IAM), and 8 (Software Development) — the technical domains that benefit most from dedicated study.

---
*Module: Module 13 — CISSP GRC Domains | Guardian Curriculum*
