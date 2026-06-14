---
tags: [guardian, grc, module-6, pci-dss, requirements, controls, security-controls, compliance]
module: 6
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G6-01 — What is PCI DSS and Who Must Comply", "G6-03 — Merchant Levels and SAQ Types", "G6-04 — Cardholder Data Environment", "G6-07 — PCI DSS v4.0 Changes", "G6-08 — PCI DSS and ISO 27001"]
---

# G6-02 — The 12 PCI DSS Requirements — Complete Reference

> [!abstract] What This Note Covers
> By the end of this note, you will understand all 12 PCI DSS requirements — what each requires, why it exists, what the key sub-requirements are in v4.0, and what good evidence of compliance looks like.

---

## Why This Exists

PCI DSS v4.0 is organised around 12 high-level requirements grouped into 6 goals. Understanding the 12 requirements in depth — not just their titles but what they actually demand, why they exist, and what compliance evidence looks like — is the foundation for any PCI DSS compliance programme.

Each requirement exists because it addresses a known attack vector or a recurring failure mode in payment security. The TJX breach involved inadequate wireless security (Requirement 1). The Target breach involved a compromised HVAC vendor with network access (Requirement 12, supply chain). Virtually every major payment card breach can be traced to failure of one or more of these 12 requirements.

---

## The 6 Goals and 12 Requirements

### Goal 1: Build and Maintain a Secure Network and Systems

#### Requirement 1: Install and Maintain Network Security Controls

**What it requires**: Network security controls (NSCs) — firewalls, routers, and other network devices — must be installed, configured, and maintained to restrict network access to the Cardholder Data Environment (CDE).

**Key sub-requirements in v4.0:**
- **1.1**: Processes and mechanisms for installing and maintaining NSCs are defined and understood
- **1.2**: NSC configurations are managed and kept current (approved configuration standards)
- **1.3**: Network access to and from the CDE is restricted appropriately — inbound and outbound traffic controlled
- **1.4**: NSCs are installed between trusted and untrusted networks, and between any wireless networks and the CDE
- **1.5**: Risks from computing devices that are able to connect to both untrusted internet and the CDE (dual-connected devices — e.g. employee laptops) are mitigated

**Why it exists**: Attackers must first reach the systems holding cardholder data. Network security controls create the perimeter that separates the CDE from the internet and from other internal network zones. Without them, any compromised system can directly communicate with card data storage.

**Evidence of compliance:**
- Firewall configuration documentation
- Approved network diagrams showing CDE boundaries
- Firewall rule review records (at least every 6 months)
- Documented process for approving and testing firewall rule changes
- ASV scan results showing no critical vulnerabilities on internet-facing systems

**v4.0 key change**: "Firewall" replaced by broader "Network Security Controls" (NSCs) to accommodate modern software-defined networking, cloud-based security controls, and zero-trust architectures. The principle — controlling access to the CDE — remains unchanged.

---

#### Requirement 2: Apply Secure Configurations to All System Components

**What it requires**: All system components must be protected from known vulnerabilities by applying secure configurations. Vendor-supplied defaults — default usernames, passwords, and settings — must be changed before systems are deployed.

**Key sub-requirements:**
- **2.1**: Processes for applying secure configurations to all system components are defined
- **2.2**: System components are configured and managed securely — approved configuration standards exist for each type of system component
- **2.3**: Wireless environments are configured and managed securely — default settings changed, strong cryptography used

**Why it exists**: Many major breaches have been enabled by default credentials and configurations. A network device still using admin/admin, a database exposing itself on the default port with the default password, a Wi-Fi network using WEP encryption — these are trivial to exploit. Requirement 2 mandates that every system component is hardened before deployment.

**Evidence of compliance:**
- Documented configuration standards for each technology type (referencing CIS Benchmarks or equivalent)
- Evidence that systems are configured to the standards (configuration reviews, automated compliance scanning)
- Vendor-supplied default change records (demonstrating defaults were changed before deployment)
- Inventory of all wireless access points

**v4.0 key change**: Configuration standards must now cover all system components including cloud infrastructure (not just traditional servers and network devices).

---

### Goal 2: Protect Account Data

#### Requirement 3: Protect Stored Account Data

**What it requires**: Cardholder data that must be stored is protected using strong cryptography. Sensitive Authentication Data (SAD) must NEVER be stored after authorisation.

**Key sub-requirements:**
- **3.1**: Processes for protecting stored account data are defined
- **3.2**: Account data storage is kept to a minimum — data is retained only for the business or legal reason required, for the minimum time needed
- **3.3**: Sensitive Authentication Data (SAD) is not retained after authorisation — this is absolute
- **3.4**: The Primary Account Number (PAN) is protected wherever stored — truncation, tokenisation, or strong cryptography (AES-256 or equivalent)
- **3.5**: The PAN is secured wherever it is accessible — including in logs, databases, and backups
- **3.6**: Cryptographic keys used to protect stored account data are secured — key management practices, secure storage, rotation, destruction

**Why it exists**: If stored cardholder data is compromised, it can be used for fraudulent transactions. Encryption ensures that stolen data is unusable without the encryption key. The prohibition on storing SAD is because this data (full magnetic stripe, CVV, PINs) enables card cloning — storing it at all creates an unacceptable risk.

**Evidence of compliance:**
- Data retention and disposal policy with defined retention periods for cardholder data
- Evidence that SAD is not stored (database scans, log reviews)
- Evidence that PAN is protected wherever stored (encryption configuration, truncation/tokenisation implementation)
- Key management documentation (key custodian procedures, key rotation records)
- Data discovery scan results showing cardholder data is only in expected locations

**Critical absolute requirement**: **No SAD after authorisation — ever.** This includes PAN with full magnetic stripe data, CVV2/CVC2/CID codes, and PINs. This is non-negotiable and frequently violated — particularly by organisations that log everything "for debugging purposes" and fail to strip SAD from logs.

---

#### Requirement 4: Protect Cardholder Data with Strong Cryptography During Transmission Over Open, Public Networks

**What it requires**: All PAN transmitted over open, public networks must be protected with strong cryptography. The PAN must never be transmitted in clear text.

**Key sub-requirements:**
- **4.1**: Processes and mechanisms for protecting cardholder data with strong cryptography during transmission are defined
- **4.2**: PAN is protected with strong cryptography during transmission — TLS 1.2 minimum (TLS 1.3 preferred); deprecated protocols (SSL, early TLS) are prohibited
- **4.2.1**: Strong cryptography is implemented and operational at all transmission points — including wireless

**Why it exists**: Data transmitted over public networks (internet, public Wi-Fi) can be intercepted. Without encryption, an attacker with network access (man-in-the-middle attack, network sniffing) can capture cardholder data in transit. TLS encrypts the transmission, making intercepted data useless.

**Evidence of compliance:**
- SSL/TLS configuration documentation
- Certificate management records
- Evidence that deprecated protocols (SSL, TLS 1.0, TLS 1.1) are disabled on all systems transmitting CHD
- Network scan or configuration review confirming TLS 1.2+ is the minimum supported version
- Evidence of valid, current certificates on all public-facing systems processing CHD

**v4.0 key change**: More explicit requirements around TLS configuration and the prohibition of weak cipher suites.

---

### Goal 3: Maintain a Vulnerability Management Programme

#### Requirement 5: Protect All Systems and Networks from Malicious Software

**What it requires**: Anti-malware solutions must be deployed on all system components — protecting against all types of malware. These solutions must be kept current and actively running.

**Key sub-requirements:**
- **5.1**: Processes for protecting against malicious software are defined
- **5.2**: Malicious software is prevented, detected, and addressed — anti-malware solutions installed on all applicable systems, kept current
- **5.3**: Anti-malware mechanisms and processes are active, maintained, and monitored
- **5.4**: Phishing attacks are addressed — anti-phishing mechanisms implemented for users

**Why it exists**: Malware is the primary vector for cardholder data theft. Keyloggers capture card data entered at point of sale. RAM scrapers extract card data from memory during processing. Ransomware encrypts cardholder data systems for extortion. Anti-malware provides a critical line of defence.

**Evidence of compliance:**
- Anti-malware solution deployment records (all applicable systems enrolled)
- Current signature/engine update evidence
- Anti-malware scan records and alert history
- Evidence of remediation for any malware detections
- Phishing awareness training records and simulations (v4.0 addition)

**v4.0 key change**: Explicit requirement for phishing protection mechanisms (anti-phishing email controls, security awareness that includes phishing simulation).

---

#### Requirement 6: Develop and Maintain Secure Systems and Software

**What it requires**: Security vulnerabilities must be identified and addressed throughout the lifecycle of all system components. Software must be developed securely, and vulnerabilities must be patched promptly.

**Key sub-requirements:**
- **6.1**: Processes for identifying security vulnerabilities and patching system components are defined
- **6.2**: Bespoke and custom software is developed securely — secure coding practices, code reviews, testing
- **6.3**: Security vulnerabilities are identified and addressed — vulnerability management programme, patch management
- **6.4**: Public-facing web applications are protected — WAF or vulnerability assessment for all public-facing web applications accepting CHD
- **6.5**: Changes to all system components are managed securely — change management including security review

**Why it exists**: New vulnerabilities are discovered continuously. Unpatched systems and poorly written code are among the most common attack vectors. Requirement 6 mandates both patching (addressing known vulnerabilities) and secure development (preventing new vulnerabilities from being introduced).

**Evidence of compliance:**
- Vulnerability management policy with patch SLAs (critical patches within 1 month)
- Vulnerability scan results
- Patch deployment records
- Secure development policy and training records
- Code review records
- WAF configuration or web application vulnerability assessment results
- Change management records including security review

**Critical requirement**: Critical patches must be applied within 1 month. This is a prescriptive SLA that many organisations struggle to meet for legacy systems.

---

### Goal 4: Implement Strong Access Control Measures

#### Requirement 7: Restrict Access to System Components and Cardholder Data by Business Need to Know

**What it requires**: Access to system components and cardholder data is restricted to only those individuals whose job requires such access. Access control is defined, implemented, and enforced.

**Key sub-requirements:**
- **7.1**: Processes for restricting access to system components and cardholder data are defined
- **7.2**: Access to system components and cardholder data is appropriate to individuals' roles — role-based access control
- **7.3**: Access to system components and cardholder data is managed via an access control system

**Why it exists**: The principle of least privilege limits the damage an attacker can do with a compromised credential. If a developer's account has access only to development systems, a compromised developer account cannot directly access production cardholder data. Role-based access control is the primary mechanism for enforcing need-to-know.

**Evidence of compliance:**
- Access control policy with documented roles and their permitted access levels
- User access review records (at least every 6 months)
- Evidence that access is role-based and aligned to job function
- Evidence of prompt access removal on role change or departure

---

#### Requirement 8: Identify Users and Authenticate Access to System Components

**What it requires**: All users must be identified with a unique ID before allowing access to system components or cardholder data. Authentication mechanisms must be strong.

**Key sub-requirements in v4.0:**
- **8.1**: Processes for identifying and authenticating access to system components are defined
- **8.2**: User identification and related accounts are managed — unique IDs, no shared accounts
- **8.3**: User identification and authentication is managed throughout the user lifecycle
- **8.4**: MFA is implemented to secure access into the CDE — all personnel accessing the CDE (v4.0: expanded from administrative/remote to ALL access into the CDE)
- **8.5**: MFA systems are implemented securely — replay-resistant, cannot be bypassed
- **8.6**: System/application accounts are managed and protected — service accounts with strong authentication

**Why it exists**: Without unique identification, it is impossible to determine who performed which actions on cardholder systems — making forensic investigation of breaches impossible. Without strong authentication, compromised credentials provide attackers with full access. MFA ensures that a stolen password alone is insufficient for access.

**Evidence of compliance:**
- All users with unique IDs (no shared accounts)
- Password policy configuration (12+ characters minimum in v4.0 without MFA; 8+ with MFA)
- MFA implementation records for all CDE access
- Service account inventory with access restrictions
- User access review records

**v4.0 key change**: MFA now required for ALL access into the CDE — not just remote/administrative. This is the most impactful new v4.0 requirement for many organisations.

---

#### Requirement 9: Restrict Physical Access to Cardholder Data

**What it requires**: Physical access to systems containing cardholder data, and the cardholder data itself in physical form, must be restricted to authorised individuals.

**Key sub-requirements:**
- **9.1**: Processes for restricting physical access to cardholder data are defined
- **9.2**: Physical access controls for sensitive areas are implemented — entry controls, visitor management
- **9.3**: Physical access for personnel and visitors is authorised and managed
- **9.4**: Media with cardholder data is secured — physical media controls, classification
- **9.5**: Point of Interaction (POI) devices — card terminals — are protected from tampering and substitution

**Why it exists**: Physical access to cardholder systems or terminals can enable direct data theft (copying hard drives, stealing tapes) or device compromise (installing hardware keyloggers on ATMs or POS terminals — "card skimming"). Physical security is not separate from information security — it is integral to it.

**Evidence of compliance:**
- Physical access control logs for secure areas
- Visitor management records
- Media inventory and destruction records
- POI device inspection logs (periodic inspection for evidence of tampering)
- Surveillance records for areas containing CDE systems

**High-risk requirement**: POI device tampering (card skimming) is a significant real-world threat. Physical inspection of terminals — particularly for unmanned or less-supervised terminals — is a practical and important control.

---

### Goal 5: Regularly Monitor and Test Networks

#### Requirement 10: Log and Monitor All Access to System Components and Cardholder Data

**What it requires**: Logging mechanisms must be in place for all access to CDE components. Logs must be reviewed promptly to identify suspicious activity.

**Key sub-requirements:**
- **10.1**: Processes for logging and monitoring all access to system components and cardholder data are defined
- **10.2**: Audit logs are implemented to support detection of anomalies and suspicious activity — logging of all access, privilege changes, authentication events, log access and modification
- **10.3**: Audit logs are protected from destruction and unauthorised modifications
- **10.4**: Audit logs are reviewed to identify anomalies or suspicious activity — daily review of critical events; targeted risk analysis to define appropriate review frequency for other events
- **10.5**: Audit log history is retained — at least 12 months, with 3 months immediately available
- **10.6**: Time synchronisation mechanisms support consistent time stamps in logs

**Why it exists**: Without logs, it is impossible to detect an ongoing breach, investigate a past breach, or prove that controls were operating. The Target breach, TJX breach, and most major card breaches were only discovered through log analysis — often long after the breach began. Requirement 10 mandates the logging that makes detection and investigation possible.

**Evidence of compliance:**
- Logging configuration documentation (what events are logged, from which systems)
- Log retention configuration (12 months total; 3 months immediately accessible)
- Log review records — evidence that logs are reviewed daily for critical events
- Time synchronisation configuration records
- Log integrity controls (write-once storage, log integrity monitoring)

**v4.0 key change**: Targeted risk analysis to determine the frequency of log review for various log types — replacing the blanket "daily review" requirement with a risk-informed approach. Automated log analysis is now explicitly referenced as an acceptable approach.

---

#### Requirement 11: Test Security of Systems and Networks Regularly

**What it requires**: Security of systems and networks must be tested regularly to ensure controls are effective and vulnerabilities are detected before attackers exploit them.

**Key sub-requirements:**
- **11.1**: Processes for regularly testing security of systems and networks are defined
- **11.2**: Wireless access points are identified and monitored — quarterly wireless scans to detect unauthorised wireless access points
- **11.3**: External and internal vulnerabilities are regularly identified, prioritised, and addressed — quarterly external ASV scans; quarterly internal vulnerability scans
- **11.4**: External and internal penetration testing is regularly performed — annual penetration test of the CDE; 6-monthly after significant infrastructure or application changes
- **11.5**: Network intrusions and unexpected file changes are detected and responded to — intrusion detection systems; file integrity monitoring for critical system files
- **11.6**: Unauthorised changes on payment pages are detected and alerted — content security policy and/or integrity monitoring for payment page scripts (e-commerce)

**Why it exists**: Controls degrade over time. New vulnerabilities emerge. Attackers find new paths. Regular testing ensures that the controls that were in place at the last assessment continue to protect the CDE — and that new vulnerabilities are identified and addressed before attackers find them.

**Evidence of compliance:**
- Quarterly ASV external scan reports (passing scans, or remediation evidence for failed scans)
- Quarterly internal vulnerability scan reports
- Annual penetration test report
- Wireless scan records (quarterly)
- IDS/IPS configuration and alert review records
- File integrity monitoring records
- Payment page integrity monitoring records (for e-commerce — v4.0 addition)

**v4.0 key change**: Explicit requirement for monitoring of payment page scripts to detect e-commerce card skimming (Magecart-style attacks). This addresses the specific attack vector where malicious JavaScript is injected into payment pages to capture card data.

---

### Goal 6: Maintain an Information Security Policy

#### Requirement 12: Support Information Security with Organisational Policies and Programmes

**What it requires**: An information security policy must exist, be maintained, communicated, and enforced. Staff must be trained. Vendors and third parties with access to the CDE must be managed.

**Key sub-requirements:**
- **12.1**: A comprehensive information security policy is established, published, maintained, and disseminated
- **12.2**: Acceptable use policies for end-user technologies are defined and implemented
- **12.3**: Risks to the CDE are formally identified, evaluated, and managed — annual risk assessment (Targeted Risk Analysis for v4.0 specific activities)
- **12.4**: PCI DSS compliance is managed — (service providers only) executive management establishes responsibility for security; quarterly reviews of compliance status
- **12.5**: PCI DSS scope is documented and validated — scope confirmed at least annually; PAN discovery scans quarterly
- **12.6**: Security awareness education is ongoing — annual security training for all personnel; training includes security awareness specific to cardholder data handling
- **12.7**: Personnel are screened to reduce risks from insider threats — background checks prior to hiring for roles with CDE access
- **12.8**: Third-party service providers (TPSPs) with access to the CDE are managed — due diligence, contracts with acknowledgement of PCI DSS responsibility, monitoring of TPSP compliance status
- **12.9**: Service providers must acknowledge their responsibility for security of cardholder data they process/store/transmit
- **12.10**: Suspected and confirmed security incidents are responded to immediately — documented incident response plan

**Why it exists**: Technology controls are only as effective as the people, processes, and policies that govern them. Requirement 12 is the governance requirement — ensuring that PCI DSS compliance is managed as a programme, not just as a set of technical controls. The Target breach began with a compromised HVAC vendor (12.8 — third-party management). Most insider fraud involves inadequate background checking (12.7) or lack of security awareness (12.6).

**Evidence of compliance:**
- Information security policy document (current, approved)
- Acceptable use policies
- Annual risk assessment record
- Annual scope confirmation documentation
- Quarterly PAN discovery scan results
- Annual security awareness training completion records
- Staff background check records for CDE-access roles
- TPSP list with due diligence records and contract compliance acknowledgements
- Incident response plan and test/exercise records

---

## PCI DSS v4.0 Control Requirements Summary

| Req | Title | Assessment frequency | High priority in v4.0 |
|---|---|---|---|
| 1 | Network Security Controls | Continuous + 6-monthly review | Cloud NSC coverage |
| 2 | Secure Configurations | Continuous | Cloud configuration standards |
| 3 | Protect Stored Account Data | Continuous | Encryption key management |
| 4 | Protect Transmission | Continuous | TLS 1.2+ enforcement |
| 5 | Anti-Malware | Continuous | Phishing-specific controls |
| 6 | Secure Development and Vulnerability Management | Monthly (patches); annual (dev review) | WAF; web app scanning |
| 7 | Access Restriction | 6-monthly review | RBAC enforcement |
| 8 | Identification and Authentication | Continuous | MFA for ALL CDE access |
| 9 | Physical Security | Ongoing | POI device inspection |
| 10 | Logging and Monitoring | Daily (critical events) | Automated log review |
| 11 | Security Testing | Quarterly (scans); annual (pentest) | Payment page monitoring |
| 12 | Security Policy and Programme | Annual | Targeted risk analysis; TPSP management |

---

## Common Audit Findings Across the 12 Requirements

| Requirement | Most common finding |
|---|---|
| Req 1 | Firewall rules not reviewed in 6+ months; overly permissive rules allowing broad internet access to CDE |
| Req 2 | Default credentials still in use on legacy devices; no documented configuration standards |
| Req 3 | SAD stored in logs after authorisation; PAN stored in clear text in databases or flat files |
| Req 4 | TLS 1.0/1.1 not disabled; expired certificates on payment pages |
| Req 5 | Anti-malware signatures outdated; not deployed on all CDE systems |
| Req 6 | Critical patches applied beyond 1-month SLA; no WAF or web application testing |
| Req 7 | Access reviews not conducted on schedule; excessive access retained after role change |
| Req 8 | MFA not implemented for all CDE access (particularly v4.0 expansion); shared accounts in use |
| Req 9 | No POI device inspection programme; visitor logs not maintained |
| Req 10 | Logs not reviewed regularly; log retention less than 12 months; logs deletable by admins |
| Req 11 | ASV scan failures not remediated within 30 days; penetration test not conducted annually; no payment page monitoring |
| Req 12 | TPSP list not maintained; no written acknowledgements from TPSPs; incident response plan not tested |

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- The 12 PCI DSS requirements map extensively to ISO 27001 Annex A controls. Organisations implementing both find significant overlap — particularly in access control (Req 7/8 ↔ A.5.15–A.5.18), logging (Req 10 ↔ A.8.15), vulnerability management (Req 6/11 ↔ A.8.8), and incident response (Req 12 ↔ A.5.24–A.5.27). See G6-08 for full mapping.

**CISM:**
- Domain 3 (Security Programme) — PCI DSS is a compliance programme that drives specific technical and governance controls. CISM candidates should understand the programme management aspects of maintaining PCI DSS compliance.

**CISSP:**
- Domain 1 (Security and Risk Management) covers PCI DSS as a compliance framework. Know the 12 requirements at a summary level and understand how they relate to security management principles.

---

## GUARDIAN's Take

The 12 requirements of PCI DSS are not arbitrary — each one exists because of documented failures in the payment security ecosystem. Requirement 3's prohibition on storing SAD exists because organisations repeatedly stored CVV codes and full magnetic stripe data, enabling card cloning. Requirement 10's logging requirements exist because breaches were going undetected for months or years. Requirement 11's penetration testing requirement exists because organisations were not finding their own vulnerabilities.

Reading the 12 requirements through the lens of real-world breaches makes them far more meaningful than reading them as a compliance checklist. The questions to ask for each requirement are: what attack does this prevent? what breach would have been avoided if this control had been in place? how would I know if this control was working?

Those questions are what drive genuine PCI DSS compliance — not the mechanical satisfaction of each sub-requirement, but the security outcomes those requirements are designed to achieve.

---
*Module: Module 6 — PCI DSS | Guardian Curriculum*
