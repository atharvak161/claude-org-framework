---
tags: [guardian, grc, module-7, cyber-essentials, uk-government, ncsc, certification, sme]
module: 7
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: beginner
date: 2026-04-19
guardian-refs: ["G1-04 — Compliance Explained", "G1-08 — GRC Frameworks Overview", "G3-01 — What is ISO 27001", "G7-07 — Framework Decision Guide"]
---

# G7-05 — Cyber Essentials — UK Government Scheme

> [!abstract] What This Note Covers
> By the end of this note, you will understand what Cyber Essentials is, the five technical controls it requires, the difference between Cyber Essentials and Cyber Essentials Plus, who must hold it, how it relates to ISO 27001, and when it is the right starting point for an organisation's security journey.

---

## Why This Exists

In 2013, the UK government published a report revealing that 80% of cyber attacks could be prevented by implementing five basic technical controls. In 2014, in response to the frequency and impact of cyber incidents affecting UK businesses, the UK government launched Cyber Essentials — a government-backed scheme designed to protect organisations against the most common forms of cyber attack.

Today, Cyber Essentials is:
- Mandatory for organisations supplying certain UK government contracts (particularly those involving handling of sensitive government information)
- Recommended by the NCSC for all UK organisations as a security baseline
- A prerequisite for many UK public sector supply chain relationships
- Increasingly required by UK enterprise customers in their supplier questionnaires

For GRC professionals working in the UK, understanding Cyber Essentials is essential — both as a framework requirement that affects clients and employers, and as a practical baseline security standard that protects against the most prevalent threats.

---

## What Cyber Essentials Is

**Cyber Essentials** is a UK government-backed certification scheme, operated under the auspices of the **National Cyber Security Centre (NCSC)**. It was developed jointly by the UK government and industry through the Information Assurance for Small and Medium Enterprises (IASME) Consortium.

**Purpose**: To provide protection against the most common cyber threats by implementing five fundamental technical controls.

**Governing body**: The NCSC sets the technical requirements. The IASME Consortium manages the scheme. Certification Bodies (CBs) accredited by IASME deliver Cyber Essentials and Cyber Essentials Plus certifications.

**Two levels:**
1. **Cyber Essentials**: Self-assessment questionnaire verified by an accredited certification body
2. **Cyber Essentials Plus**: On-site technical verification by an accredited certification body

**Scope**: The certification covers the organisation's IT infrastructure — the boundary for certification can be the whole organisation or a defined subset (e.g. a specific office, a specific business unit). Most organisations certify their entire estate.

---

## Who Needs Cyber Essentials

### Mandatory for UK Government Contracts

Since October 2014, Cyber Essentials certification has been mandatory for organisations bidding for certain UK government contracts — specifically those involving:
- Handling personal information about UK citizens
- Processing information assessed as OFFICIAL or above (under the Government Security Classification scheme)
- Provision of certain technical products and services

The Cabinet Office's supplier security requirements mandate Cyber Essentials. Many government departments have extended this requirement across all their supply chains — not just central contracts.

### Public Sector Supply Chains

NHS trusts, local authorities, schools, universities, and other public sector bodies increasingly require Cyber Essentials from their suppliers. This is driven by NCSC guidance and by the Department for Health and Social Care's (DHSC) data security standards.

### UK Enterprise Procurement

UK enterprise customers — particularly in financial services, healthcare, and professional services — are increasingly including Cyber Essentials in their supplier security questionnaires. While not universally required, holding Cyber Essentials demonstrates a baseline level of security that many procurement teams expect.

### Insurance

Some UK cyber insurance providers offer premium reductions for Cyber Essentials-certified organisations, recognising that the five controls reduce the most common attack vectors.

---

## The Five Cyber Essentials Controls

Cyber Essentials is built around five fundamental security controls. These controls are deliberately basic — they address the most prevalent attack vectors, not the most sophisticated threats.

### Control 1: Firewalls

**What it requires**: Boundary firewalls and internet gateways must be in place to protect the organisation's network boundary. All devices that connect to the internet must be protected.

**Specific requirements:**
- A firewall (or equivalent boundary device) must be in place between the internet and internal devices
- Default login credentials on firewalls must be changed from vendor defaults
- Firewall rules must be documented and reviewed
- Unapproved services must not be exposed to the internet
- Personal firewalls must be enabled on devices that may connect to untrusted networks (particularly laptops used outside the office)
- Administrative interfaces of firewalls must not be accessible from the internet

**What attacks it prevents**: Opportunistic attacks scanning the internet for exposed services; exploitation of unprotected services; remote access to administrative interfaces.

**Common failure**: Routers and firewalls with admin interfaces accessible from the internet, still using vendor default credentials. This was the attack vector in many SME breaches — automated scanning tools find exposed admin interfaces and attempt default credentials.

### Control 2: Secure Configuration

**What it requires**: Computers and network devices must be configured to reduce vulnerabilities. Unnecessary software, services, and features must be removed or disabled.

**Specific requirements:**
- Remove or disable unnecessary software, services, and ports that are not needed for business purposes
- Change all default passwords before deployment
- Auto-run features must be disabled (preventing automatic execution of code from removable media)
- Password requirements must be in place — accounts must have strong passwords and be locked after repeated failed attempts
- Screen lock must be enabled after inactivity

**What attacks it prevents**: Exploitation of unnecessary exposed services; use of default credentials; malware spread via removable media; account compromise through weak passwords.

**Alignment with ISO 27001**: Maps to A.8.9 (Configuration management) and A.8.19 (Installation of software on operational systems).

### Control 3: Security Update Management (Patching)

**What it requires**: Software and operating systems must be kept up to date with security patches. Devices running out-of-date software must be removed from the estate.

**Specific requirements:**
- Operating systems must be supported by the vendor (no end-of-life OS in scope)
- Software must be updated within 14 days of a security patch being released for a high or critical vulnerability
- Software that can no longer be patched must be removed from scope or protected by compensating controls
- Auto-update must be enabled where available

**The 14-day window**: This is a more aggressive patch SLA than PCI DSS (30 days for critical) or many organisational policies. The NCSC's view: the 14-day window reflects the speed with which attackers exploit newly published vulnerabilities. For the most common attack vectors (known vulnerability exploitation), this window is critical.

**What attacks it prevents**: Exploitation of known, patched vulnerabilities in operating systems and applications — the most common attack vector in commodity attacks.

**Alignment with ISO 27001**: Maps to A.8.8 (Management of technical vulnerabilities).

### Control 4: User Access Control

**What it requires**: User accounts must be managed appropriately. Users must only have the access they need, and privileged accounts must be used only for privileged tasks.

**Specific requirements:**
- All user accounts must be authorised
- Administrative privileges must be restricted to users who require them for specific tasks
- Administrative accounts must not be used for non-administrative activities (email, web browsing)
- Separate accounts must be used for admin vs standard use (not running email and browser as domain admin)
- Privileged access to cloud management interfaces must be controlled
- Accounts must be disabled or removed promptly when no longer needed

**What attacks it prevents**: Privilege escalation; lateral movement using compromised admin credentials; persistence through dormant accounts; impact reduction when a standard user account is compromised.

**Alignment with ISO 27001**: Maps to A.5.15 (Access control), A.5.18 (Access rights), A.8.2 (Privileged access rights).

### Control 5: Malware Protection

**What it requires**: Malware protection must be in place on all devices that can be infected by malware.

**Three acceptable approaches** (organisation selects the most appropriate):

**a) Application allowlisting**: Only approved, trusted applications can execute. This is the most secure approach — any unknown application is blocked. Appropriate for high-security environments and managed devices.

**b) Malware protection software (traditional/next-gen AV/EDR)**: Anti-malware software with up-to-date signatures/definitions must be installed and active. Scheduled scans must be enabled. Suspicious or malicious software must be blocked.

**c) Sandboxing**: Running applications in a segregated, restricted environment that limits their access to other resources. Less common as a primary control.

**What attacks it prevents**: Malware execution; ransomware; keyloggers; trojans; spyware.

**Alignment with ISO 27001**: Maps to A.8.7 (Protection against malware).

---

## The Cyber Essentials Assessment Process

### Cyber Essentials (Self-Assessment)

1. **Select a certification body**: Choose an IASME-accredited Cyber Essentials certification body
2. **Complete the online questionnaire**: The Cyber Essentials questionnaire (currently hosted on the IASME platform) asks detailed questions about the five control areas
3. **Submit for review**: The completed questionnaire is reviewed by the certification body
4. **Verification**: The CB may ask clarifying questions; if the questionnaire demonstrates compliance, the certificate is issued
5. **Certificate issued**: Cyber Essentials certificate valid for 12 months

**Cost**: Typically £300–500 for the self-assessment certification.

**Time**: Self-assessment typically takes 1–3 days to complete; certification body review takes 1–3 weeks.

### Cyber Essentials Plus (Technical Verification)

Cyber Essentials Plus builds on the self-assessment with independent technical verification:

1. **Cyber Essentials self-assessment must be current**: CE+ requires a current Cyber Essentials certificate (typically within the same year)
2. **On-site/remote technical testing**: The certification body conducts technical testing to verify the controls are in place:
   - **Vulnerability scanning**: External vulnerability scan of internet-facing IP addresses
   - **Authenticated internal scan**: Scan of internal systems to verify patch levels and configurations
   - **User device testing**: Testing a sample of end-user devices for compliance with the five controls
   - **Multi-factor authentication**: Verification of MFA implementation on email and cloud services
3. **Evidence review**: Review of documentation supporting the five controls
4. **Certificate issued**: If testing passes, Cyber Essentials Plus certificate issued (12-month validity)

**Cost**: Typically £1,500–4,000+ depending on organisation size.

**Why CE+ is more valuable**: CE+ provides independent technical verification rather than self-attestation. For government contract procurement and high-assurance supply chain requirements, CE+ is increasingly the required standard rather than CE.

---

## Cyber Essentials and ISO 27001: The Relationship

Cyber Essentials and ISO 27001 are not alternatives — they serve different purposes and different markets. Understanding their relationship is important for UK organisations considering which framework to pursue.

| Dimension | Cyber Essentials | ISO 27001 |
|---|---|---|
| **Scope** | Five specific technical controls | Comprehensive ISMS covering all information security risks |
| **Depth** | Shallow — minimum viable security baseline | Deep — risk-based management system |
| **Audience** | UK SMEs; UK supply chain requirements | Global enterprise; UK and EU compliance requirements |
| **Cost** | Low (£300–4,000) | Significant (£5,000–50,000+ depending on size) |
| **Time to achieve** | Weeks | Typically 6–18 months |
| **Certification** | Annual | Annual surveillance; 3-year certification cycle |
| **Risk-based** | No — prescriptive five controls | Yes — risk assessment drives control selection |
| **Legal standing** | UK government contract requirement | Global industry standard; EU/UK regulatory reference |

**The maturity journey**: For many UK organisations, Cyber Essentials is the entry point — a quick, achievable baseline that demonstrates minimum security hygiene. ISO 27001 is the destination — a comprehensive security management system appropriate for organisations with more complex security requirements and enterprise customer obligations.

**Not a substitute**: Achieving Cyber Essentials does not mean the organisation is "done" with security. ISO 27001 requirements go far beyond the five Cyber Essentials controls. An organisation pursuing ISO 27001 certification must satisfy all applicable Annex A controls, not just the five CE controls.

**For ISO 27001-certified organisations**: Cyber Essentials certification is straightforward and low-cost. An ISO 27001-certified organisation almost certainly satisfies the five Cyber Essentials controls — the investment is primarily in completing the questionnaire and paying the certification fee, not in implementing new controls.

---

## Cyber Essentials in the Context of Common Threats

The five controls directly address the most prevalent attack vectors documented in NCSC threat intelligence:

| Attack vector | Cyber Essentials control |
|---|---|
| Exploitation of internet-facing services | Firewalls (Control 1) |
| Default credentials on internet-facing devices | Firewalls + Secure Configuration (Controls 1, 2) |
| Known vulnerability exploitation (unpatched systems) | Security Update Management (Control 3) |
| Malware execution via web or email | Malware Protection (Control 5) |
| Credential theft and lateral movement | User Access Control (Control 4) |
| Phishing leading to ransomware | Malware Protection + Secure Configuration (Controls 2, 5) |
| Supply chain compromise of outdated software | Security Update Management (Control 3) |

The NCSC's position is that implementing these five controls would have prevented the majority of the cyber incidents reported to them by UK businesses. This is the empirical basis for the scheme — not comprehensive security, but maximum impact per unit of effort for the most common threats.

---

## IASME Consortium and Related Standards

**IASME** (Information Assurance for Small and Medium Enterprises) is the organisation that manages the Cyber Essentials scheme under licence from the NCSC. IASME also offers:

**IASME Cyber Assurance**: A broader assessment standard for SMEs that goes beyond the five CE controls to include governance, risk management, incident response, and business continuity. IASME Cyber Assurance is positioned as a stepping stone between Cyber Essentials and ISO 27001.

**IASME Gold**: The IASME governance framework assessed against ISO 27001-aligned requirements. An IASME Gold assessment can be combined with Cyber Essentials Plus in a single audit.

**The IASME ecosystem** provides a useful progression for UK SMEs:
1. Cyber Essentials — the foundation (five technical controls)
2. Cyber Essentials Plus — technical verification of the foundation
3. IASME Cyber Assurance — governance and process controls added
4. IASME Gold / ISO 27001 — full management system and certification

---

## Common Mistakes and Failures

**1. Treating Cyber Essentials as comprehensive security.**
Cyber Essentials covers five controls. A fully CE-certified organisation can still be vulnerable to phishing (no email security training requirement), insider threats (no HR security requirements), physical security failures (no physical control requirements), and many other risks. CE is a baseline, not a ceiling.

**2. Scoping out too much.**
Some organisations scope their Cyber Essentials certification to a small subset of their estate to make certification easier — then hold the certificate as evidence of organisation-wide security. This is misleading. If the certification only covers one office, it should not be presented as whole-organisation certification.

**3. Not renewing annually.**
Cyber Essentials certificates expire after 12 months. An expired certificate provides no current assurance. Many supply chain and procurement requirements specify that CE must be current.

**4. Achieving CE but not maintaining the controls.**
Achieving Cyber Essentials certification by implementing the five controls, then allowing them to lapse between annual assessments. Patching falls behind (Control 3); software goes end-of-life (Controls 2, 3); admin accounts accumulate (Control 4). The certificate reflects a point-in-time assessment — ongoing compliance requires ongoing management.

**5. Confusing CE with CE+.**
For UK government contract requirements and high-assurance supply chain programmes, CE+ may be required rather than CE. Submitting a CE self-assessment certificate when CE+ is required does not satisfy the requirement.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Cyber Essentials is a UK-specific baseline standard frequently referenced in the context of ISO 27001 implementation. Auditors working with UK SMEs should understand how CE relates to ISO 27001, and how an ISO 27001-certified organisation satisfies CE requirements. The five CE controls map directly to specific ISO 27001 Annex A controls and are a useful discussion frame for UK clients starting their security journey.

**CISM:**
- Domain 1 (Governance) — Cyber Essentials is a UK regulatory and contractual compliance requirement that CISOs at UK organisations must understand and manage. Domain 3 (Security Programme) — CE implementation is a baseline security programme activity.

**CRISC:**
- Domain 3 (Risk Response) — Cyber Essentials represents a minimum risk mitigation baseline for UK organisations. CRISC candidates should understand when CE is sufficient risk mitigation and when more comprehensive frameworks are needed.

---

## GUARDIAN's Take

Cyber Essentials is one of the most practically impactful security initiatives the UK government has launched. Not because it is technically sophisticated — it isn't — but because it is achievable, affordable, and focused on the controls that genuinely matter most for the majority of cyber incidents.

The five controls — firewalls, secure configuration, patch management, access control, malware protection — are not exotic or advanced. They are hygiene. But they are the hygiene that a surprising proportion of UK businesses still lack. A business whose equipment is still running Windows 10 21H2 with unpatched critical vulnerabilities, with admin accounts used for email browsing, with no endpoint protection — that business will be compromised. The Cyber Essentials controls prevent that.

For GRC professionals advising UK SMEs, Cyber Essentials is the non-negotiable starting point. It is achievable in weeks, costs under £500, and satisfies the basic government contract and supply chain requirements. From there, the maturity journey leads to IASME Cyber Assurance, then ISO 27001 — but starting with Cyber Essentials is faster and more impactful than trying to leap directly to a full management system.

For larger UK organisations, Cyber Essentials is simultaneously trivial (your ISO 27001 controls far exceed it) and practically important (it is a contractual and procurement requirement that must be maintained and renewed annually). Treat it as a compliance obligation to be managed efficiently, not as a security initiative requiring significant effort.

And for any GRC professional building a UK security market profile: know Cyber Essentials well. It comes up in client conversations, in procurement discussions, and in public sector engagements constantly. It is the baseline from which most UK security conversations start.

---
*Module: Module 7 — Governance Frameworks | Guardian Curriculum*
