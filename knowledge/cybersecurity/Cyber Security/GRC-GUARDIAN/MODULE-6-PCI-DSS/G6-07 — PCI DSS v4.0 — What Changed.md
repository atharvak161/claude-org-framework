---
tags: [guardian, grc, module-6, pci-dss, v4, changes, customised-approach, mfa, authentication]
module: 6
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-19
guardian-refs: ["G6-01 — What is PCI DSS and Who Must Comply", "G6-02 — The 12 PCI DSS Requirements", "G6-06 — The QSA", "G6-08 — PCI DSS and ISO 27001"]
---

# G6-07 — PCI DSS v4.0 — What Changed

> [!abstract] What This Note Covers
> By the end of this note, you will understand the key changes introduced in PCI DSS v4.0 compared to v3.2.1 — the structural changes, the new requirements, the expanded requirements, the Customised Approach, and what these changes mean for organisations maintaining compliance.

---

## Why This Exists

PCI DSS v4.0 was published in March 2022 — the most significant revision since PCI DSS was created. It replaced v3.2.1 (which retired in March 2024). The transition was not just a documentation update; v4.0 introduced genuinely new requirements, expanded existing ones, and changed the fundamental compliance philosophy with the introduction of the Customised Approach.

Organisations that completed their last assessment against v3.2.1 and are now facing their first v4.0 assessment need to understand what has changed — both to prepare their programmes and to prioritise the new requirements that may require significant programme investment.

GRC professionals must understand v4.0 changes because they affect control selection, programme design, and assessment preparation for any organisation that processes payment cards.

---

## The Four Goals of the v4.0 Revision

The PCI SSC articulated four primary goals for the v4.0 revision:

1. **Continue to meet the security needs of the payment industry**: Update requirements to address current threats and attack vectors not adequately addressed in v3.2.1.

2. **Promote security as a continuous process**: Shift from point-in-time compliance to ongoing security management by introducing targeted risk analysis and continuous monitoring requirements.

3. **Increase flexibility for organisations using different methods to achieve security objectives**: Introduce the Customised Approach to allow mature organisations to implement equivalent controls through different means.

4. **Enhance validation methods and procedures**: Improve the clarity and consistency of assessment procedures.

---

## Structural Changes

### Terminology

**"Firewalls" → "Network Security Controls (NSCs)"**
Requirement 1 now refers to Network Security Controls rather than firewalls. This reflects the reality that modern network security includes cloud security groups, software-defined networking, zero trust access controls, and other technologies that achieve the same objective as traditional firewalls. The security objective (controlling access to the CDE) remains unchanged; the term is broadened to encompass modern implementations.

**"Application Development" → "Bespoke and Custom Software"**
Requirements covering software development now specify "bespoke and custom software" to distinguish from commercial off-the-shelf (COTS) software. Requirements apply to software developed internally or by third parties on behalf of the assessed entity.

### Defined Approach vs Customised Approach

The most significant structural change in v4.0 is the formalisation of two compliance paths:

**Defined Approach**: The traditional PCI DSS compliance path. Organisations implement the specific controls defined in the standard's requirements. Testing procedures are prescriptive. The vast majority of organisations use the Defined Approach.

**Customised Approach**: A new path for mature organisations. Organisations implement controls that achieve the stated objective of each requirement through different means. The organisation must document the customised control, its rationale, and evidence of effectiveness. QSAs validate whether the customised control achieves the stated objective.

**When to use the Customised Approach**: Only appropriate for organisations with highly mature security programmes that have strong justifications for deviating from prescribed controls. It requires significantly more documentation and QSA engagement. It is not a shortcut — it typically involves more work than the Defined Approach.

### Targeted Risk Analysis (TRA)

A significant philosophy shift in v4.0: several requirements that previously specified fixed frequencies (e.g. "review access rights at least every 6 months") now require a **Targeted Risk Analysis (TRA)** to determine the appropriate frequency based on the organisation's specific risk environment.

**What a TRA involves**: The organisation formally assesses the risk associated with a specific activity and uses that assessment to determine how frequently the activity should be performed. The TRA must be documented and reviewed annually.

**Requirements requiring TRA for frequency determination** (examples):
- Frequency of log review (Requirement 10.4.1.1)
- Frequency of vulnerability scans for internal systems (Requirement 11.3.1.1)
- Frequency of access reviews for service provider accounts (Requirement 8.6.1)
- Frequency of phishing testing (Requirement 5.4.1)

**Minimum frequencies still apply**: TRA does not allow organisations to simply reduce frequencies arbitrarily. The TRA must be based on genuine risk factors, and the PCI SSC guidance suggests that TRA-based frequencies will typically align with or exceed the previous fixed minimums for most risk environments.

---

## New Requirements in v4.0

### Requirement 3.3.2 — SAD Not Retained by Issuers After Authorisation

**New requirement**: Issuers and companies that support issuing services may store SAD before authorisation — but must protect it using encryption with AES-128 or higher, and must ensure it is stored only in specified systems with defined access controls.

**Why it's new**: Previous versions prohibited SAD storage after authorisation for all entities. v4.0 recognises that card issuers have a legitimate business need to store SAD before authorisation (for fraud detection and dispute resolution) while maintaining strict controls.

### Requirement 4.2.1.1 — Inventory of Certificates

**New requirement**: An inventory of certificates used to protect PAN in transit must be maintained, including the certificate issuer, public key, expiration date, and the devices/systems using the certificate.

**Why it's important**: Certificate management failures — expired certificates, certificates using deprecated algorithms, rogue certificates — have been vectors for payment data interception. Maintaining a complete inventory enables proactive management of the certificate lifecycle.

### Requirement 6.4.3 — Payment Page Script Management

**New requirement**: All scripts on payment pages must be managed — authorised, integrity protected, and inventoried. An inventory of all scripts must be maintained, each script must be justified for its purpose, and methods must exist to confirm each script is authorised and has not been tampered with.

**Why it's important**: Magecart attacks inject malicious JavaScript into payment pages to capture card data at the moment of entry. Requirement 6.4.3 directly addresses this threat by requiring that organisations know what scripts are on their payment pages and can detect unauthorised changes.

**Implementation approaches**: Content Security Policy (CSP) headers restrict which scripts can execute on a page; sub-resource integrity (SRI) attributes ensure scripts have not been tampered with; script monitoring solutions continuously scan payment pages for new or changed scripts.

### Requirement 10.7.2 and 10.7.3 — Automated Controls Failure Detection

**New requirements**: Failures of critical security controls must be detected and reported promptly. For service providers specifically (10.7.3), failures of critical security controls must be responded to promptly.

**What counts as "critical security controls"**: Network security controls (firewalls), IDS/IPS, change detection mechanisms, anti-malware, access controls, audit logging, segmentation controls, audit log review mechanisms, and automated testing tools.

**Why it's important**: Control failures that go undetected leave the CDE unprotected. The requirement mandates that monitoring exists to detect when controls stop functioning — not just when attacks occur.

### Requirement 11.3.1.1 — Targeted Risk Analysis for Internal Scans

**New requirement**: A targeted risk analysis must determine the frequency of internal vulnerability scans. The analysis must be performed annually and documented. Scans must be performed at the frequency determined by the TRA (minimum quarterly per the Defined Approach unless TRA justifies less frequent).

### Requirement 11.6.1 — Payment Page Integrity Monitoring

**New requirement**: A change and tamper detection mechanism must detect unauthorised modifications to HTTP headers and the contents of payment pages as received by the consumer browser.

**Why it's important**: Client-side skimming attacks (Magecart) modify what the consumer's browser receives — not necessarily what the merchant's server stores. Traditional server-side integrity monitoring would miss these attacks. This requirement mandates monitoring from the consumer's perspective.

**Implementation**: Commercial payment page monitoring services (e.g. Jscrambler, Featurespace, RiskIQ) continuously check payment pages for unauthorised changes. Content Security Policy and sub-resource integrity are technical controls that complement monitoring.

### Requirement 12.3.2 — Targeted Risk Analysis for PCI DSS Requirements

**New requirement**: A targeted risk analysis must be documented for all PCI DSS requirements where the Customised Approach is being used, and for requirements that specify a TRA-based frequency determination.

### Requirement 12.3.4 — Hardware and Software Technology Review

**New requirement**: Hardware and software technologies in use must be reviewed at least once every 12 months to confirm they continue to receive security fixes from vendors and remain adequately protected against known vulnerabilities.

**Why it's important**: Technologies that have reached end-of-life (no longer receiving security patches) present ongoing vulnerability risks. This requirement mandates that organisations proactively identify and plan for technology end-of-life situations.

---

## Significantly Expanded Requirements in v4.0

### Requirement 8.4 — MFA Expanded to ALL CDE Access

**v3.2.1**: MFA required for all remote network access originating from outside the entity's network; MFA required for all administrator access to the CDE.

**v4.0**: MFA required for ALL access into the CDE — not just remote or administrative access. Any access by personnel into the CDE requires MFA, regardless of whether the access originates from inside or outside the network perimeter.

**Impact**: This is the most operationally impactful requirement change for many organisations. Organisations that had implemented MFA for remote access and admin accounts but not for all internal users accessing CDE systems must now expand MFA to cover all CDE access — potentially requiring MDM infrastructure, MFA solution expansion, and staff change management.

**Practical scope**: This means that a call centre agent at a terminal in the office who accesses the payment processing system must use MFA — not just the IT administrator who SSHs into the server or the remote worker who VPNs in.

### Requirement 8.3.9 — Password Length Increase

**v3.2.1**: Minimum 7 characters for passwords.

**v4.0**: Minimum 12 characters for passwords where MFA is not implemented. If MFA is implemented for a system, a minimum of 8 characters is still required.

**Context**: NIST and NCSC have moved away from complex-but-short passwords toward longer passphrases. The 12-character minimum reflects this — length provides more entropy than complexity for equivalent password strength.

### Requirement 6.2.4 — Secure Coding for All Bespoke Software

**v3.2.1**: Secure coding requirements primarily focused on web-facing applications.

**v4.0**: Secure coding requirements apply to ALL bespoke and custom software — not just web-facing applications. Internal tools, batch processes, APIs, and any software developed specifically for the organisation must be developed using secure coding practices.

### Requirement 5.4.1 — Phishing-Resistant Mechanisms

**v3.2.1**: Anti-phishing mechanisms not specifically required beyond general security awareness training.

**v4.0**: Explicit requirement for phishing protection mechanisms — defined by TRA frequency — including both technical controls (email filtering, anti-phishing solutions) and regular phishing simulations with defined frequency based on TRA.

### Requirement 12.8 — Enhanced Third-Party Service Provider (TPSP) Requirements

**v4.0**: More explicit requirements for managing TPSPs including:
- A comprehensive list of all TPSPs must be maintained
- Each TPSP must have written agreements acknowledging their responsibility for PCI DSS compliance
- Compliance status of TPSPs must be monitored at least annually
- Information about the PCI DSS requirements applicable to each TPSP must be documented

---

## Future-Dated Requirements (Best Practice Until 31 March 2025)

PCI DSS v4.0 introduced a number of requirements as "best practice" during the transition period, which became mandatory on 31 March 2025. By the time of this note (April 2026), all of these are now mandatory:

| Requirement | Description |
|---|---|
| 5.3.3 | Anti-malware solution performs scan upon media access or program execution |
| 6.3.3 | All software components (including APIs, third-party software) are protected from known vulnerabilities |
| 6.4.2 | Web application firewall (WAF) deployment for public-facing web applications |
| 7.2.5 | All application and system accounts and their access reviewed at least once every 6 months |
| 8.4.2 | MFA for ALL access into the CDE (expanded MFA requirement) |
| 8.5.1 | MFA systems are resilient — cannot be bypassed or circumvented |
| 8.6.1 | System and application accounts with interactive login capabilities reviewed at least once every 6 months |
| 10.4.1.1 | Automated mechanisms used to perform log reviews (where applicable, per TRA) |
| 10.7.2 | Failures of critical security controls are detected and reported promptly |
| 11.3.1.1 | Internal vulnerability scans via authenticated scanning |
| 11.6.1 | Change and tamper detection mechanism for payment pages |
| 12.3.4 | Hardware/software technology review annually |

**Organisations that have not yet implemented these requirements are now non-compliant.** As of March 2025, all v4.0 requirements are mandatory.

---

## What v4.0 Changes Mean for Compliance Programmes

### Priority Actions for Organisations Transitioning to v4.0

**1. MFA expansion audit**: Conduct a gap analysis of current MFA coverage against the v4.0 requirement that MFA applies to ALL CDE access. Identify any systems or users accessing the CDE without MFA.

**2. Password policy update**: Update password policy to require 12 characters minimum (for accounts without MFA) and confirm this is technically enforced.

**3. Payment page monitoring implementation**: For e-commerce organisations, implement content integrity monitoring for payment pages (Requirement 11.6.1). Select and configure a monitoring solution.

**4. Script inventory for payment pages**: Build an inventory of all scripts on payment pages (Requirement 6.4.3). Document the business purpose of each script.

**5. Certificate inventory**: Create and maintain an inventory of all certificates used to protect PAN in transit (Requirement 4.2.1.1).

**6. Technology lifecycle review**: Conduct a review of all hardware and software in the CDE for end-of-life status (Requirement 12.3.4). Create a remediation plan for any end-of-life technologies.

**7. Targeted Risk Analyses**: For requirements requiring TRA-based frequency determination, conduct and document TRAs. These are now mandatory, not optional.

**8. TPSP programme enhancement**: Review and update the TPSP management programme (Requirement 12.8) — ensure TPSP list is complete, written acknowledgements are in place, and annual compliance monitoring is documented.

**9. Anti-phishing programme**: Implement phishing simulations and technical anti-phishing controls (Requirement 5.4.1) at TRA-defined frequencies.

**10. Critical control failure detection**: Implement or verify monitoring that detects failures of critical security controls (Requirement 10.7.2).

---

## Common Mistakes and Failures in v4.0 Transition

**1. Treating the transition as documentation-only.**
"We're already compliant with v3.2.1 — we just need to update our policies for v4.0." This is incorrect for many requirements. The MFA expansion (Requirement 8.4.2), payment page monitoring (11.6.1), and script management (6.4.3) require genuine technical implementation, not just policy updates.

**2. Not completing Targeted Risk Analyses.**
TRAs are now mandatory for requirements that specify them. Organisations that assume previous fixed frequencies still apply without completing a TRA are technically non-compliant — even if their operational frequency matches what a TRA would likely determine.

**3. Misunderstanding the Customised Approach.**
Using the Customised Approach as a way to avoid implementing required controls. The Customised Approach requires an equivalent or better control than the defined requirement — it is not a waiver or an exemption.

**4. Assuming future-dated requirements are still "best practice."**
All future-dated requirements from v4.0 became mandatory on 31 March 2025. As of April 2026, organisations that have not implemented these requirements are non-compliant.

**5. Not updating the scope definition for new requirements.**
Some v4.0 requirements expand scope — particularly the expanded MFA requirement and the payment page monitoring requirement (which affects e-commerce merchants who may not previously have had significant scope in their web server environment). The scope definition must be updated to reflect these expansions.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- PCI DSS v4.0 requirements — particularly the enhanced monitoring, MFA expansion, and technology lifecycle review — have strong parallels with ISO 27001 controls. Auditors working with payment organisations should understand v4.0 to assess whether the ISMS adequately supports PCI DSS compliance obligations.

**CISM:**
- Domain 3 (Security Programme) — understanding the v4.0 changes is essential for CISOs at payment organisations managing the programme transition. The MFA expansion and payment page monitoring requirements are programme management priorities.

**CRISC:**
- The v4.0 changes (particularly MFA expansion, technology end-of-life management, and TPSP monitoring) represent new risk factors that must be assessed and managed. CRISC candidates should understand the compliance risk created by the mandatory deadline for future-dated requirements.

---

## GUARDIAN's Take

PCI DSS v4.0 represents the PCI SSC's attempt to address the threat landscape of the 2020s — an era of client-side skimming, credential stuffing, supply chain compromise, and sophisticated social engineering. The Magecart threat alone, responsible for thousands of payment page compromises, is specifically addressed in Requirements 6.4.3 and 11.6.1.

The most strategically significant change is the Customised Approach. For the first time in PCI DSS history, mature organisations can formally justify implementing controls that achieve the same security objective through different means. This reflects a maturity in the PCI SSC's understanding that security is about outcomes, not just checklist compliance. Whether organisations use this wisely — implementing genuinely equivalent or superior controls — or abuse it as a compliance shortcut will determine its long-term value.

The MFA expansion is operationally significant for many organisations. Moving from MFA-for-remote-and-admin to MFA-for-all-CDE-access requires infrastructure, process change, and user training. Organisations that have not yet implemented this should treat it as an urgent programme priority — it is now mandatory, and it addresses one of the most critical attack vectors in the current threat landscape.

The message of v4.0 overall is clear: PCI DSS is moving from a point-in-time compliance model toward a continuous security programme model. The Targeted Risk Analysis requirements, the control failure detection requirements, and the ongoing monitoring requirements all reflect this philosophy. Organisations that manage PCI DSS compliance as an annual event — a burst of activity before the QSA arrives, followed by nine months of inactivity — will find v4.0 increasingly difficult to satisfy. Organisations that manage it as a continuous programme will find the additional requirements align naturally with what they are already doing.

---
*Module: Module 6 — PCI DSS | Guardian Curriculum*
