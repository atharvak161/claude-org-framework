---
tags: [guardian, grc, module-13, cissp, domain-1, security-risk-management, ethics, legal]
module: 13
cert-coverage: [cissp]
difficulty: intermediate
date: 2026-04-28
guardian-refs: ["G13-01 — CISSP Overview", "G12-02 — CISM Domain 1", "G12-03 — CISM Domain 2", "G2-01 through G2-12 — Risk Management", "G5-02 — GDPR"]
---

# G13-02 — CISSP Domain 1: Security and Risk Management

> [!abstract] What This Note Covers
> Domain 1 is the largest CISSP domain at 16% of the exam. It covers security governance, compliance, legal and regulatory requirements, risk management, personnel security, and ethics. This note focuses on Domain 1 topics not already covered in the CISM modules, with specific CISSP exam application.

---

## Domain 1 at a Glance

Domain 1 tests foundational security governance and risk management knowledge — the strategic and legal framework within which security programmes operate. For GRC-background candidates, this is the domain most directly covered by CISM and the GUARDIAN curriculum.

**Key topics:**
- Security governance principles and frameworks
- Legal, regulatory, and compliance considerations
- Professional ethics (ISC2 Code of Ethics)
- Security policies, standards, and frameworks
- Risk management concepts and methodologies
- Business continuity planning at strategic level
- Personnel security
- Security education, training, and awareness

**GUARDIAN curriculum coverage**: Modules 1, 2, 5, 6, 7, 9 cover Domain 1 comprehensively. This note focuses on the CISSP-specific angles and topics not covered elsewhere.

---

## 1.1 ISC2 Code of Ethics

**The ISC2 Code of Ethics** is specifically testable on the CISSP exam. Candidates must know the four mandatory canons and their priority order.

**The four canons (in priority order):**

1. **Protect society, the common good, necessary public trust and confidence, and the infrastructure**
2. **Act honourably, honestly, justly, responsibly, and legally**
3. **Provide diligent and competent service to principals**
4. **Advance and protect the profession**

**The priority principle**: When canons conflict, the higher-numbered canon (lower priority) yields to the lower-numbered canon (higher priority). Society comes before personal clients; personal ethics come before professional service.

**CISSP exam application:**

*Scenario*: A security professional discovers that their client is involved in illegal activity during an engagement. What should they do?

*Answer*: The professional should act in accordance with Canon 2 (act honestly and legally) and Canon 1 (protect society). The client obligation (Canon 3) is subordinate. The professional should terminate the engagement and, depending on jurisdiction and circumstances, may be required to report the illegal activity.

*Scenario*: A security professional is asked by their employer to omit a significant finding from an audit report. What should they do?

*Answer*: This violates Canon 2 (act honestly) and ultimately Canon 1 (protect society through accurate security assurance). The professional should refuse and, if necessary, escalate or resign. The employer obligation (Canon 3) does not override honesty (Canon 2).

---

## 1.2 Legal and Regulatory Environment

### Computer Crime and Intellectual Property

**Key US laws** (CISSP tests from a US-centric perspective but includes international awareness):

*Computer Fraud and Abuse Act (CFAA)*: Prohibits unauthorised access to computers. Key for CISSP — the primary US federal computer crime law.

*Electronic Communications Privacy Act (ECPA)*: Extends wire-tap protections to electronic communications; addresses lawful interception standards.

*Digital Millennium Copyright Act (DMCA)*: Prohibits circumvention of copy-protection technology; limits ISP liability for user copyright infringement.

*Gramm-Leach-Bliley Act (GLBA)*: Financial services — requires protection of customer financial information; security programme requirements for financial institutions.

*HIPAA (Health Insurance Portability and Accountability Act)*: Healthcare — security and privacy requirements for protected health information (PHI); security rule defines administrative, physical, and technical safeguards.

*Sarbanes-Oxley Act (SOX)*: Financial — requires accurate financial reporting; Section 404 mandates assessment of internal controls over financial reporting (IT general controls).

**UK/EU laws** (increasingly tested as CISSP is a global certification):

*UK GDPR / EU GDPR*: Data protection law — covered comprehensively in Module 5.

*Computer Misuse Act (UK)*: Three offences: unauthorised access; unauthorised access with further criminal intent; unauthorised modification of computer material.

*Network and Information Systems (NIS) Regulations*: UK implementation of NIS Directive — critical infrastructure security requirements.

### Intellectual Property

**CISSP tests four types of intellectual property protection:**

*Patents*: Protect inventions; typically 20-year protection. Must be registered; must be novel and non-obvious.

*Trademarks*: Protect brands, logos, and product names; can be perpetual with continued use and renewal. Indicated by ™ (unregistered) or ® (registered).

*Copyrights*: Protect creative works (software, documents, art, music); automatic on creation; typically author's life + 70 years. No registration required.

*Trade secrets*: Protect confidential business information; no registration; protection lasts as long as the secret is maintained. Examples: formulae, algorithms, customer lists.

**CISSP exam pattern**: "Which IP protection is most appropriate for proprietary software?" → Copyright (protects the expression of the code) AND potentially trade secret (protects the algorithm if not published). Not patent (difficult to obtain; requires disclosure) unless the specific algorithm is patentable.

### Import/Export Controls

**Cryptographic export controls**: Strong cryptographic algorithms are subject to export controls in many jurisdictions (primarily US Export Administration Regulations). Security professionals must be aware of these controls when deploying cryptographic solutions internationally.

---

## 1.3 Security Governance Frameworks

While frameworks are covered in Module 7, CISSP Domain 1 tests specific framework concepts:

**ISO 27001/27002**: The international ISMS standard (covered in depth in Module 3). CISSP tests at the conceptual level — purpose, structure, key requirements.

**NIST Cybersecurity Framework (CSF)**: Five functions (Identify, Protect, Detect, Respond, Recover) + the new Govern function in CSF 2.0. CISSP tests the framework structure and its voluntary, risk-based nature.

**NIST SP 800-53**: The detailed US federal control catalogue. CISSP tests at a conceptual level — purpose, audience (federal systems), and relationship to the Risk Management Framework.

**COBIT**: IT governance framework from ISACA. CISSP tests the governance/management layer distinction and COBIT's role in aligning IT to business.

**ITIL**: IT service management. CISSP connects ITIL to security operations (change management, incident management, problem management).

**CISSP exam principle**: Know what each framework is FOR and WHO it serves — not the technical detail of each control. Framework selection questions are answered based on the organisation's context, regulatory environment, and industry.

---

## 1.4 Risk Management: CISSP-Specific Angles

The GUARDIAN curriculum (Module 2) provides comprehensive risk management coverage. Domain 1 CISSP questions add specific angles:

### Due Care vs Due Diligence

**Due diligence**: The investigation and assessment conducted to identify risks before making a decision. "Doing your homework" — understanding what risks exist before acting.

**Due care**: The standard of care taken to implement appropriate protections once risks are identified. "Doing the right thing" — acting reasonably based on what you know.

**CISSP exam pattern**: A company conducts security assessments before acquiring a target company → due diligence. A company implements security controls once risks are identified → due care. Failure to exercise due care may result in negligence liability.

### Prudent Person Rule

A **prudent person** (or prudent expert in security) is expected to act in a manner that a reasonable, careful person with equivalent expertise would in similar circumstances. This standard is applied in determining whether an organisation has exercised due care in its security programme.

### Total Risk vs Residual Risk

**Total risk** = Threats × Vulnerabilities × Asset Value (the inherent risk before any controls)

**Residual risk** = Total risk × (1 − Control effectiveness) = the risk remaining after controls are applied

**CISSP formula context**: These are conceptual formulas — not used for calculation in the exam, but the distinction between total and residual risk is tested.

### Quantitative Risk Analysis Formulas

CISSP specifically tests the quantitative risk analysis formulas (review Module 2 notes):

- **AV** (Asset Value): The value of the asset
- **EF** (Exposure Factor): Percentage of asset value lost per incident (0–1)
- **SLE** = AV × EF (Single Loss Expectancy)
- **ARO** (Annual Rate of Occurrence): Frequency per year
- **ALE** = SLE × ARO (Annual Loss Expectancy)
- **Safeguard value** = ALE (before) − ALE (after) − Annual cost of safeguard

**CISSP exam pattern**: Calculate the value of implementing a specific control, demonstrating cost-benefit of security investment.

---

## 1.5 Business Continuity Planning (Domain 1 Scope)

CISSP Domain 1 covers BCP at a strategic level; Domain 7 covers operational DR. Key Domain 1 BCP concepts:

**Project initiation and scoping**: BCP begins with scope definition — what functions, systems, and locations are included. Senior management commitment and sponsor are required.

**Business Impact Analysis (BIA)**: Identifies critical business functions and determines MTD (Maximum Tolerable Downtime), RTO, and RPO for each. The BIA drives all subsequent BCP decisions.

**Recovery strategies**: Backup sites and their types:

| Site type | Readiness | Time to activate | Cost |
|---|---|---|---|
| Hot site | Fully operational; real-time data | Minutes to hours | Highest |
| Warm site | Equipment installed; data not current | Hours to days | Medium |
| Cold site | Space and power only | Days to weeks | Lowest |
| Mobile site | Transportable facility | Variable | Variable |
| Mirrored site | Real-time; fully redundant | Immediate | Very high |
| Reciprocal agreement | Another organisation shares space | Variable | Low (risk: simultaneous use) |

**CISSP exam pattern**: "Which backup site type provides the fastest recovery time?" → Hot site (or mirrored site). "Which is most cost-effective for a non-critical function?" → Cold site.

---

## 1.6 Personnel Security

**Pre-employment:**
- Background checks (criminal history; credit; employment verification; education verification)
- Reference checks
- Non-disclosure agreements (NDAs)
- Employment contracts specifying security obligations

**During employment:**
- Security awareness training
- Job rotation (reduces fraud risk; no single person controls critical processes indefinitely)
- Mandatory vacation (requires temporary replacement; fraud schemes require continuous presence)
- Least privilege (access aligned to role requirements)
- Separation of duties (incompatible functions assigned to different people)

**Termination:**
- Immediate account deactivation for involuntary terminations
- Exit interviews
- Return of assets
- Access revocation — all systems, physical access, cloud accounts

**CISSP exam pattern**: Which personnel control MOST reduces the risk of insider fraud? → **Separation of duties** (prevents any single person from completing a fraudulent transaction end-to-end) and **mandatory vacation** (requires someone else to perform the role temporarily, exposing any ongoing fraud).

---

## 1.7 Security Awareness, Training, and Education

Three distinct levels — CISSP tests the distinction:

**Awareness**: Creating recognition and sensitivity to security — "what security is" and why it matters. Target audience: all staff. Methods: posters, emails, screen savers, brief videos. Low depth; high breadth.

**Training**: Developing skills for a specific role or function — "how to do X securely." Target audience: staff in specific roles (developers, IT operations, HR). Methods: workshops, courses, hands-on exercises. Medium depth; targeted breadth.

**Education**: Deep understanding of security concepts and principles — preparing security professionals. Target audience: security professionals pursuing careers in security. Methods: degree programmes, advanced certifications (CISSP, CISM). High depth; security-specific.

**CISSP exam pattern**: "Which approach is MOST appropriate for teaching all employees to identify phishing attempts?" → **Awareness** (all employees; recognition-level knowledge needed). "Which approach for training developers to write secure code?" → **Training** (specific role; skill development needed).

---

## Domain 1 CISSP Practice Questions

**Q1.** A security professional discovers during a penetration test that the client is operating a server containing stolen credit card data. The client's authorisation for the penetration test explicitly covered this server. What should the security professional do?

A) Document the finding in the penetration test report and continue the engagement
B) Immediately stop the engagement and report the finding to law enforcement
C) Consult with the ISC2 Code of Ethics and legal counsel; likely stop and report
D) Inform the client's senior management and allow them to determine next steps

**Answer: C** — The professional is obligated under Canon 1 (protect society) and Canon 2 (act legally and honestly) to address illegal activity. This requires consulting legal counsel given the complexity; in most jurisdictions, knowingly participating in or facilitating the storage of stolen credit card data creates legal liability. Simply documenting (A) or deferring to management (D) is insufficient given the ethical and legal obligations.

---

**Q2.** An organisation's asset has a value of £2,000,000. A threat has a 40% exposure factor and is expected to occur 0.5 times per year. What is the Annual Loss Expectancy?

A) £400,000
B) £800,000
C) £1,600,000
D) £40,000

**Answer: A**

SLE = AV × EF = £2,000,000 × 0.4 = £800,000
ALE = SLE × ARO = £800,000 × 0.5 = **£400,000**

---

**Q3.** Which of the following BEST demonstrates the principle of due care?

A) Investigating a vendor's security practices before entering a contractual relationship
B) Implementing security controls recommended by a risk assessment
C) Performing a risk assessment before deploying a new system
D) Reviewing industry standards before developing a security policy

**Answer: B** — Due care is taking appropriate action once risks are identified. Implementing controls recommended by a risk assessment is the application of due care — acting reasonably based on known risks. Options A, C, and D describe due diligence — investigating and understanding risks before acting.

---

**Q4.** Which intellectual property protection applies automatically upon creation of a software application and requires no registration?

A) Patent
B) Trademark
C) Trade secret
D) Copyright

**Answer: D** — Copyright is automatic upon creation of an original work (including software). Patents require registration. Trademarks may be registered or unregistered (common law trademark). Trade secrets are protected through maintaining confidentiality, not registration.

---

**Q5.** An organisation needs a recovery site that can be activated within hours. Budget is a significant constraint. Which backup site type is MOST appropriate?

A) Hot site
B) Warm site
C) Cold site
D) Mirrored site

**Answer: B** — A warm site provides activation within hours and is significantly less expensive than a hot site (fully operational) or mirrored site (real-time redundancy). A cold site (days to weeks) does not meet the hours requirement.

---

## Domain 1 CISSP vs CISM: Key Differences

For candidates who have studied CISM before CISSP, the Domain 1 angles differ in emphasis:

| Topic | CISM emphasis | CISSP Domain 1 emphasis |
|---|---|---|
| Risk | Management decisions; risk owner; risk appetite | Quantitative formulas (ALE, SLE, ARO); due care/diligence |
| Legal | Regulatory compliance as governance requirement | Specific laws (CFAA, HIPAA, SOX, GLBA); legal liability |
| Ethics | Not specifically tested | ISC2 Code of Ethics — four canons; priority order |
| Personnel | Awareness programme management | Job rotation; mandatory vacation; separation of duties; termination |
| BCP | Programme management; governance | Recovery site types; BIA; MTD/RTO/RPO |
| Frameworks | Strategic framework selection | Framework purpose and audience |

---

## GUARDIAN's Take

Domain 1 is where your GRC foundation converts directly to CISSP marks. The risk management methodology, governance frameworks, legal landscape, and compliance principles from Modules 1–7 of this curriculum map comprehensively to Domain 1 content.

The additive CISSP-specific knowledge is: the ISC2 Code of Ethics (four canons; priority order); the specific US and international laws (CFAA, HIPAA, SOX, GLBA, GDPR at framework level); the due care/diligence distinction; and the quantitative risk formulas (ALE, SLE, ARO) used as calculation questions.

Domain 1 should be the highest-performing domain for GRC-background candidates. If your practice question accuracy in Domain 1 is below 75%, revisit Module 2 (risk management) and this note before sitting the exam.

---
*Module: Module 13 — CISSP GRC Domains | Guardian Curriculum*
