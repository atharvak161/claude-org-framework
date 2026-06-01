---
tags: [guardian, grc, module-1, foundations, compliance]
module: 1
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: beginner
date: 2026-04-15
guardian-refs: ["G1-01 — What is GRC and Why It Exists", "G1-02 — Governance Explained", "G1-03 — Risk Explained", "G1-08 — GRC Frameworks Overview", "G3-01 — What is ISO 27001", "G5-02 — GDPR Structure Principles Lawful Basis", "G6-01 — What is PCI DSS"]
---

# G1-04 — Compliance Explained

> [!abstract] What This Note Covers
> By the end of this note, you will understand what compliance means in an information security context, why it exists, the difference between regulatory and contractual compliance, how compliance programmes work in practice, and — critically — why compliance is not the same as security.

---

## Why This Exists

On 25 May 2018, the General Data Protection Regulation — **GDPR** — came into force across the European Union. Organisations had been given two years to prepare. Many did not take it seriously until the last few months. Suddenly, thousands of companies were scrambling to appoint Data Protection Officers, rewrite privacy notices, review consent mechanisms, and audit their data flows.

In January 2019, less than eight months after GDPR came into force, Google was fined €50 million by the French data protection authority (CNIL) for failing to properly inform users about how their data was being used for advertising. In July 2019, British Airways was issued a notice of intent for a £183 million fine following a breach affecting 500,000 customers. Marriott faced a £99 million notice for a breach affecting 339 million guest records.

These fines were not primarily the result of a technical failure being discovered. They were the result of organisations being unable to *demonstrate* that they had appropriate controls in place, that they had processed data lawfully, and that they had followed the rules.

This is what compliance is about. It is not just doing the right thing — it is being able to *prove* you are doing the right thing, to a standard defined by an external authority, in a way that can be verified by an auditor or regulator.

The stakes are enormous. And they are growing.

---

## What It Is

**Compliance** is the state of conforming to applicable laws, regulations, standards, contractual obligations, and internal policies. In information security, compliance means demonstrating that the organisation:

1. Knows which rules apply to it
2. Has implemented the controls required by those rules
3. Can prove it — through documentation, evidence, and audit

Compliance is the "accountability" component of GRC. Where governance says "here is our intent" and risk says "here is what could go wrong," compliance says "here is proof that we are doing what we said we would."

There are three broad categories of compliance obligation:

### 1. Regulatory Compliance
Laws and regulations that organisations must follow — with legal consequences for failure. These are non-negotiable. Examples:

| Regulation | Scope | Who it applies to |
|---|---|---|
| **GDPR / UK GDPR** | Data protection and privacy | Any organisation processing personal data of EU/UK individuals |
| **PCI DSS** | Payment card security | Any organisation that stores, processes, or transmits card data |
| **NIS2 Directive** | Network and information security | Critical infrastructure and essential service operators (EU) |
| **FCA Rules** | Financial services conduct | UK-regulated financial firms |
| **HIPAA** | Healthcare data (US) | US healthcare providers and their business associates |
| **DORA** | Digital operational resilience (EU) | Financial sector entities |

Failure to comply with regulations can result in fines, enforcement notices, prohibition orders, criminal prosecution, and reputational damage.

### 2. Standards-Based Compliance
Voluntary standards that organisations choose to adopt — often because customers, partners, or the market require it. Certification provides external assurance. Examples:

| Standard | What it covers | Who benefits from certification |
|---|---|---|
| **ISO 27001** | Information Security Management System | Any sector — often required for government contracts and enterprise sales |
| **ISO 22301** | Business Continuity Management | Organisations where downtime would be catastrophic |
| **SOC 2** | Security controls for service organisations (US) | SaaS companies selling to US enterprise customers |
| **Cyber Essentials / CE+** | Baseline UK cybersecurity controls | Required for UK government contracts |

Standards are not laws — but failing to hold a certification your customer requires can cost you the contract. The compliance pressure is real even if the legal mechanism differs.

### 3. Contractual Compliance
Obligations embedded in commercial agreements. When you sign a contract with a customer or supplier, you may be agreeing to specific security requirements. Examples:
- A Data Processing Agreement (DPA) requiring annual penetration testing
- A Master Services Agreement requiring ISO 27001 certification
- A cloud hosting contract requiring 99.9% uptime SLAs with specific security controls

Failure to meet contractual compliance obligations can result in breach of contract, financial penalties, and loss of the relationship.

---

## How It Works in Practice

### The Compliance Programme

A compliance programme is the organised system an organisation uses to identify its obligations, implement them, and demonstrate conformance. It typically includes:

**1. Compliance Inventory (Obligation Register)**
Before you can comply, you must know what you need to comply with. A compliance inventory (sometimes called an obligation register) lists every applicable law, regulation, standard, and contractual requirement — along with who owns each obligation, what controls satisfy it, and when it must be evidenced.

This sounds simple. In reality, a mid-sized UK financial services company might have obligations under: UK GDPR, FCA rules, PCI DSS, ISO 27001, NIS regulations, Cyber Essentials, individual customer contracts, and their own internal policies. Mapping all of these is a significant undertaking.

**2. Gap Assessment**
Once you know your obligations, you assess your current state against them. Where are you meeting the requirement? Where are you not? A gap assessment produces a list of gaps — things you need to do to reach compliance.

Think of it like an MOT pre-check. Before you take the car to the garage, you walk round it and check the tyres, lights, and wipers yourself. You want to find the problems before the official examiner does.

**3. Remediation**
Address the gaps. This might mean implementing new technical controls, writing new policies, training staff, appointing new roles, or changing processes. Remediation is where compliance and risk management overlap — you are treating the compliance gap as a risk to be mitigated.

**4. Evidence Collection**
Compliance must be provable. Evidence might include:
- Policy documents with approval dates and version history
- Training completion records
- Audit logs and system configuration screenshots
- Penetration test reports
- Vulnerability scan results
- Meeting minutes from management reviews
- Supplier due diligence records

Evidence must be current, relevant, and sufficient. An auditor will test whether controls are working, not just whether policies exist.

**5. Audit and Assurance**
Internal audits check compliance from within the organisation. External audits (by certification bodies, QSAs, or regulators) provide independent assurance to third parties. Audit findings generate actions, which close gaps, which improve the compliance posture.

**6. Continuous Monitoring**
Compliance is not a point-in-time state. Regulations change. The organisation changes. Controls degrade. A mature compliance programme continuously monitors the control environment — using automated tools, regular reviews, and exception reporting — to catch drift before it becomes a finding.

---

### A Real Compliance Journey: ISO 27001

To make this concrete, here is what a typical ISO 27001 compliance journey looks like for a 150-person technology company:

**Month 1–2: Scope and Gap Assessment**
The CISO defines the scope of the ISMS (what systems, locations, and processes are included). A gap assessment compares current state against ISO 27001 requirements. Result: a list of 40+ gaps.

**Month 3–6: Remediation**
Policies are written. A risk assessment is conducted. Controls are implemented. Staff are trained. Suppliers are assessed. The risk register is built. The Statement of Applicability is drafted.

**Month 7–8: Internal Audit**
The organisation audits itself against ISO 27001 requirements. Findings are documented and addressed.

**Month 9: Stage 1 Audit (Certification Body)**
The external auditor reviews the ISMS documentation. Are the policies complete? Is the scope appropriate? Is the risk assessment methodology sound? Any major gaps are flagged — the Stage 2 audit cannot proceed until they are addressed.

**Month 10–11: Stage 2 Audit**
The external auditor visits (or connects remotely) and tests whether the controls actually work. They will interview staff, review evidence, inspect systems, and look for nonconformities.

**Month 12: Certification**
Provided there are no major nonconformities, the certification body issues an ISO 27001 certificate. Valid for three years, with annual surveillance audits.

**Ongoing: Maintain and Improve**
Monthly security metrics. Quarterly risk register reviews. Annual internal audit. Annual management review. Continuous improvement. The cycle continues.

---

## The Details That Matter

### Compliance vs Security: The Critical Distinction

This is one of the most important concepts in all of GRC, and one of the most commonly misunderstood.

**Compliance is a floor, not a ceiling.**

Meeting a compliance standard means you have implemented the minimum controls required by that standard. It says nothing about whether those controls are actually effective against real-world threats. It says nothing about whether the organisation is genuinely secure.

Consider:
- An organisation can be fully PCI DSS compliant and still suffer a breach — because the attacker used a technique not covered by the standard, or because a compliant control was poorly implemented in practice.
- An organisation can have an ISO 27001 certificate and still have a terrible security culture — because the certification was pursued as a sales tool, not as a genuine improvement programme.
- An organisation can comply with GDPR's breach notification requirement (72 hours to report to the ICO) and still have failed catastrophically to protect the data in the first place.

The Target breach in 2013 — where 40 million payment card records were stolen — occurred at a company that was PCI DSS compliant. Compliance did not prevent the breach. What was missing was genuine security.

The lesson: compliance tells you that you have passed the test. It does not tell you that you are safe. True security requires going beyond compliance — using it as a foundation, not a destination.

### The Relationship Between Compliance and Risk

Compliance and risk management are deeply intertwined, but they operate differently:

| Dimension | Compliance | Risk Management |
|---|---|---|
| Starting point | External requirements (laws, standards) | Internal analysis (what could go wrong?) |
| Driven by | Regulators, certification bodies, customers | Business objectives, threat landscape |
| Success measure | Pass the audit / get the certificate | Residual risk within appetite |
| Horizon | Point in time (audit cycle) | Continuous |
| Flexibility | Low — you must meet the requirement | High — you choose how to treat each risk |

Compliance is prescriptive: "You must implement multi-factor authentication for all remote access." Risk management is analytical: "Given our threat model and asset criticality, how should we protect remote access?" Often the answers align. Sometimes compliance requires controls that the risk assessment would not have prioritised — and vice versa.

A mature GRC function integrates both, using the risk assessment to go beyond compliance requirements where the risk justifies it, and using compliance requirements as a structured starting point for the risk programme.

### The Cost of Non-Compliance

It is worth being explicit about what non-compliance costs, because this is what makes the business case for compliance investment:

| Consequence | Example |
|---|---|
| Regulatory fines | GDPR: up to €20M or 4% of global annual turnover |
| Loss of right to operate | PCI DSS: losing the ability to process card payments |
| Criminal prosecution | GDPR: senior officers can face personal liability in some jurisdictions |
| Contract termination | Customer terminates contract for failure to maintain ISO 27001 |
| Reputational damage | Public disclosure of non-compliance or a breach |
| Increased insurance premiums | Post-breach, cyber insurance becomes significantly more expensive |
| Investor and shareholder impact | Listed companies face share price impact from major compliance failures |

The investment in a compliance programme is almost always less than the cost of a significant compliance failure.

---

## Common Mistakes and Failures

**1. Compliance as a one-time project.**
"We got certified, job done." Compliance is a continuous programme. Standards are updated. The organisation changes. Annual surveillance audits will find drift if the programme is not maintained.

**2. Compliance without understanding.**
Implementing controls because the standard says so, without understanding why. This leads to controls that satisfy the auditor but fail in practice. Staff follow the procedure without understanding its purpose and work around it when it is inconvenient.

**3. Siloed compliance.**
The compliance team works on GDPR. The IT team works on PCI DSS. The security team works on ISO 27001. Nobody is talking to each other. The result is duplicated effort, inconsistent controls, and gaps at the boundaries. Integrated GRC programmes map overlapping requirements and implement controls once that satisfy multiple obligations.

**4. Evidence collected only at audit time.**
Organisations scramble to collect evidence in the weeks before an audit. If the evidence does not exist — because the control was not actually operating — they either cannot provide it or fabricate it. Both outcomes are bad. Evidence should be collected continuously as controls operate.

**5. Treating the auditor as the enemy.**
Some organisations go into audits adversarially — hiding problems, preparing staff to give minimal answers. This is counterproductive. A good auditor is trying to help the organisation identify weaknesses. The findings are an opportunity to improve. Treat the audit as a diagnostic, not an interrogation.

**6. Scope creep management failure.**
For standards like ISO 27001 and PCI DSS, the *scope* of what is assessed is critical. Organisations sometimes define scope too narrowly (excluding systems that should be included) or fail to manage scope changes when the organisation grows. Both create compliance gaps that auditors will find.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- The entire Lead Auditor qualification is about how to assess compliance with ISO 27001. Every clause of the standard is a compliance requirement. Auditors must know: what does compliance look like, what does non-compliance look like, and how do you determine which is which from evidence?
- Key terms: *conformity*, *nonconformity* (major and minor), *observation*, *audit evidence*, *audit criteria*, *audit scope*.
- Exam scenarios often test: what constitutes a major nonconformity (a systemic failure or absence of a required element) vs a minor nonconformity (an isolated failure or partial absence).

**CISM:**
- Domain 1 includes legal and regulatory compliance as a governance responsibility.
- Domain 4 (Incident Management) includes compliance with breach notification requirements.
- CISM tests the managerial view: how does a CISO build a compliance programme, prioritise compliance investments, and report compliance posture to the board?

**CRISC:**
- Compliance requirements are a source of risk — failing to comply is a risk that must be assessed and treated. CRISC candidates must understand how regulatory risk sits within the broader risk framework.

**CISSP:**
- Domain 1 covers legal and regulatory requirements across multiple jurisdictions. CISSP candidates are expected to understand the *types* of compliance obligations (regulatory, contractual, standards-based) and how they interact.
- Domain 2 (Asset Security) includes data classification and retention requirements that directly drive compliance with GDPR and similar regulations.

---

## GUARDIAN's Take

The dirty secret of compliance is this: it is entirely possible to pass every audit, hold every certificate, and still be fundamentally insecure. I have seen it. Organisations that spend enormous sums on compliance programmes but cannot detect an attacker who has been in their network for six months. Organisations that can produce a perfectly formatted risk register but have never actually fixed a high-rated risk.

Compliance done poorly is theatre. It is expensive theatre that gives false confidence to the board, false assurance to customers, and false security to the organisation. And the auditors — especially certification body auditors operating on tight timeframes — will not always catch it. Their job is to check whether you have the required controls. It is not always possible, in a two-day Stage 2 audit, to verify whether those controls are truly effective.

The way I think about compliance, after twenty years:

**Compliance tells you what you must do. Risk management tells you what you should do. Security culture is what actually protects you.**

Your job, as a GRC professional, is to integrate all three. Use compliance requirements as your minimum bar. Use risk management to go further where the threat warrants it. And use governance — leadership, culture, accountability — to make sure the controls you implement are actually followed, actually tested, and actually effective.

The organisations I am most proud to have worked with are the ones where compliance almost became irrelevant — not because they ignored it, but because the security culture was so strong that they were *already* doing what the standards required, and more. Compliance was just the formal recognition of what they were already doing.

That is the destination. Build toward it.

---
*Module: Module 1 — Foundations | Guardian Curriculum*
