---
tags: [guardian, grc, module-6, pci-dss, payment-card, compliance, cardholder-data, scope]
module: 6
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G1-04 — Compliance Explained", "G1-08 — GRC Frameworks Overview", "G6-02 — The 12 PCI DSS Requirements", "G6-03 — Merchant Levels and SAQ Types", "G6-04 — Cardholder Data Environment", "G6-08 — PCI DSS and ISO 27001"]
---

# G6-01 — What is PCI DSS and Who Must Comply

> [!abstract] What This Note Covers
> By the end of this note, you will understand what PCI DSS is, who created it and why, who must comply, what the consequences of non-compliance are, and how compliance is assessed and demonstrated.

---

## Why This Exists

In 2007, TJX Companies — owner of TK Maxx in the UK and TJ Maxx in the US — disclosed the largest data breach in history at that time: over 45 million payment card records stolen by hackers who had been lurking in the company's network for 18 months. The breach enabled fraudulent card transactions worldwide. The cost to TJX exceeded $256 million in settlements, legal costs, and remediation. Card issuers spent hundreds of millions more reissuing compromised cards.

The TJX breach was not the first large-scale payment card fraud — it followed a pattern of increasingly sophisticated attacks on payment systems through the early 2000s. And it occurred despite the existence of multiple, competing security standards that card brands had individually developed and mandated.

Visa had its own programme (Cardholder Information Security Programme — CISP). Mastercard had the Site Data Protection (SDP) programme. American Express, Discover, and JCB had their own. Each required different things. Merchants and processors managing relationships with multiple card brands faced a compliance patchwork.

In 2004, the five major card brands — Visa, Mastercard, American Express, Discover, and JCB — consolidated their standards into a single framework: the **Payment Card Industry Data Security Standard (PCI DSS)**. They established the **PCI Security Standards Council (PCI SSC)** in 2006 to maintain the standard. The goal: a single, unified security standard for every organisation that touches payment card data.

PCI DSS is not government legislation — it is a contractual requirement imposed by card brands through the merchant agreements that businesses sign to accept card payments. But its enforcement mechanisms — financial penalties, increased transaction fees, and ultimately loss of the right to accept card payments — make non-compliance existential for payment-dependent businesses.

---

## What PCI DSS Is

**PCI DSS** (Payment Card Industry Data Security Standard) is a set of security requirements for organisations that store, process, or transmit **cardholder data** (CHD) or **sensitive authentication data** (SAD).

**Current version**: PCI DSS v4.0, published March 2022. Transition deadline to v4.0 was March 2024 (v3.2.1 retired). PCI DSS v4.0.1 (minor clarification release) published June 2024.

**The PCI SSC**: The PCI Security Standards Council is the body that maintains PCI DSS. Its member organisations include card brands, banks, acquirers, merchants, processors, vendors, and other stakeholders. The SSC publishes the standard, supporting guidance, and related standards (PA-DSS for payment applications, P2PE for point-to-point encryption, PTS for hardware security). Compliance is enforced by individual card brands and acquirers — not the SSC itself.

### What PCI DSS Protects

PCI DSS is designed to protect two categories of data:

**Cardholder Data (CHD)**:
- Primary Account Number (PAN) — the card number itself. This is the most critical element — protections apply whenever the PAN is stored, processed, or transmitted.
- Cardholder name
- Expiration date
- Service code

**Sensitive Authentication Data (SAD)** — additional data that must NEVER be stored after authorisation:
- Full magnetic stripe data (or equivalent chip data)
- CAV2/CVC2/CVV2/CID (the 3–4 digit card verification code)
- PINs and PIN blocks

**Critical rule**: SAD must never be stored after transaction authorisation — even in encrypted form. This is absolute. The CVV2, full track data, and PINs must be permanently deleted immediately after the authorisation response is received.

---

## Who Must Comply

PCI DSS applies to **any organisation that stores, processes, or transmits cardholder data** — regardless of size, location, or industry. If you accept payment cards (Visa, Mastercard, Amex, Discover, JCB), you must comply.

**Who this includes:**

**Merchants**: Any organisation that accepts payment cards for goods or services. This includes:
- Physical retailers with point-of-sale terminals
- E-commerce businesses with online payment pages
- Mail order / telephone order businesses
- Restaurants, hotels, healthcare providers, utilities, government agencies — any entity that accepts card payments

**Service Providers**: Any organisation that provides services to merchants or other parties that involve storing, processing, or transmitting cardholder data on behalf of others. This includes:
- Payment processors and acquirers
- Payment gateways
- Cloud providers hosting cardholder data environments
- Managed security service providers with access to cardholder systems
- Web hosting providers for e-commerce merchants

**Issuing banks and acquiring banks**: Subject to their own card brand programmes rather than PCI DSS directly — though PCI DSS principles apply.

**The key test**: Does your systems, networks, or processes come into contact with cardholder data — either by storing it, processing transactions, transmitting it, or by being connected to systems that do?

If yes → PCI DSS applies.

### What "Storing, Processing, or Transmitting" Means

**Storing**: Any cardholder data retained in any format — databases, flat files, paper records, encrypted storage, backup tapes.

**Processing**: Any operation performed on cardholder data — authorisation, clearing, settlement, refunds.

**Transmitting**: Any cardholder data sent across a network — point-of-sale terminal to payment processor, API calls to payment gateway, card data in email or web forms.

**Connected systems**: Systems that do not directly handle cardholder data but are connected to systems that do may also be in scope — this is the concept of the **Cardholder Data Environment (CDE)** and scope management (covered in G6-04).

---

## Compliance Levels: Merchants and Service Providers

PCI DSS compliance requirements differ based on transaction volume. There are separate tier systems for merchants and service providers.

### Merchant Levels

The card brands (particularly Visa and Mastercard) define merchant compliance levels based on annual transaction volume:

| Level | Transaction volume (Visa) | Assessment type |
|---|---|---|
| **Level 1** | >6 million Visa transactions per year; or any merchant that has suffered a breach | Annual on-site assessment by a QSA or internal auditor; quarterly network scan by ASV |
| **Level 2** | 1–6 million Visa transactions per year | Annual self-assessment questionnaire (SAQ); quarterly network scan by ASV |
| **Level 3** | 20,000–1 million e-commerce Visa transactions per year | Annual SAQ; quarterly network scan by ASV |
| **Level 4** | <20,000 e-commerce Visa transactions; all other merchants processing up to 1 million Visa transactions | Annual SAQ; quarterly network scan by ASV recommended |

*Note: Exact thresholds and requirements vary slightly between card brands — Mastercard, Amex, etc. have their own level definitions. Most merchants follow the Visa/Mastercard definitions.*

### Service Provider Levels

| Level | Transaction volume | Assessment type |
|---|---|---|
| **Level 1** | >300,000 transactions per year (Visa); or any service provider that poses significant risk | Annual on-site assessment by QSA; quarterly network scan by ASV |
| **Level 2** | <300,000 transactions per year (Visa) | Annual SAQ; quarterly network scan by ASV |

---

## How Compliance is Assessed and Demonstrated

Three types of assessors and three types of assessment:

### Qualified Security Assessors (QSAs)

**QSAs** are organisations and individuals certified by the PCI SSC to conduct PCI DSS on-site assessments for Level 1 merchants and Level 1 service providers. They must:
- Be certified by the PCI SSC
- Pass annual re-certification
- Have staff who pass individual QSA qualification
- Be independent of the organisation being assessed

The QSA conducts the assessment, reviews evidence, tests controls, and produces a **Report on Compliance (ROC)** documenting findings. The ROC is submitted to the merchant's acquirer or the card brand.

**Internal Security Assessors (ISAs)**: Companies that process or store cardholder data can certify employees as ISAs to conduct internal assessments. ISAs can lead the annual assessment for Level 1 merchants (as an alternative to QSA for the on-site assessment, depending on card brand requirements).

### Approved Scanning Vendors (ASVs)

**ASVs** are organisations certified by the PCI SSC to conduct external network vulnerability scans. Quarterly external scans by an ASV are required for all compliance levels. ASV scans identify vulnerabilities in internet-facing systems — exposed ports, unpatched services, web application vulnerabilities.

### Self-Assessment Questionnaires (SAQs)

For merchants below Level 1, **SAQs** (Self-Assessment Questionnaires) are available as a self-certification mechanism. Different SAQ types apply to different payment processing environments:

| SAQ type | Who uses it | Environment |
|---|---|---|
| **SAQ A** | Card-not-present merchants who have fully outsourced all cardholder data functions to PCI-compliant third parties | E-commerce, mail order — no CHD stored, processed, or transmitted on merchant systems |
| **SAQ A-EP** | E-commerce merchants with partially outsourced payment functions | E-commerce — payment page hosted by merchant but not storing CHD |
| **SAQ B** | Merchants using imprint machines or standalone dial-up terminals; no electronic storage of CHD | Physical retail — standalone terminals not connected to internet |
| **SAQ B-IP** | Merchants using standalone, IP-connected point-of-interaction (POI) terminals | Physical retail — IP-connected terminals from a PTS-approved device |
| **SAQ C** | Merchants with payment applications connected to internet; no electronic CHD storage | Retail/restaurant — connected POS systems |
| **SAQ C-VT** | Merchants using web-based virtual terminals; no electronic CHD storage | Small merchants using a browser-based virtual terminal |
| **SAQ D (Merchants)** | All merchants not eligible for SAQ A, A-EP, B, B-IP, C, or C-VT | Any environment storing, processing, or transmitting CHD |
| **SAQ D (Service Providers)** | All service providers eligible to complete an SAQ | Service providers not at Level 1 |
| **SAQ P2PE** | Merchants using a validated point-to-point encryption solution | Physical retail using hardware-based P2PE |

---

## Consequences of Non-Compliance

PCI DSS non-compliance consequences are contractual, financial, and operational:

### Financial Penalties

Card brands impose monthly fines on acquirers for non-compliant merchants. Acquirers pass these fines to merchants. Fines vary by card brand and merchant level — typically ranging from $5,000 to $100,000 per month for significant non-compliance.

### Increased Transaction Fees

Acquirers may impose higher interchange fees on non-compliant merchants as a risk-based surcharge.

### Liability for Card Fraud

If a non-compliant merchant suffers a breach resulting in card fraud, the merchant bears liability for:
- Fraud losses on compromised cards
- Cost of card reissuance by card issuers
- Forensic investigation costs
- Fines imposed by card brands

This liability can be catastrophic. The TJX breach settlements exceeded $256 million. For small merchants, even a modest breach can be existential.

### Loss of Card Processing Rights

In extreme cases, card brands can withdraw a merchant's right to accept card payments. A retailer or e-commerce business that cannot accept Visa and Mastercard effectively cannot operate. This is the ultimate enforcement lever — rarely exercised but entirely within card brand authority.

### Reputational Damage

A publicly disclosed breach at a non-compliant merchant creates significant reputational harm. Post-breach, customers, press, and regulators all examine the compliance status. "We were not PCI DSS compliant" is a deeply damaging admission.

---

## PCI DSS and the Law

PCI DSS is not a law. It is a contractual requirement — compliance is enforced through merchant agreements and acquirer relationships.

However, PCI DSS intersects with law in several ways:

**GDPR intersection**: Payment card data includes names, transaction histories, and other personal data. Processing cardholder data involves processing personal data — GDPR applies. A PCI DSS breach may simultaneously be a GDPR notifiable breach. Security measures required by PCI DSS Requirement 12 and elsewhere contribute to GDPR Article 32 compliance.

**Data breach notification laws**: In the UK and EU, a breach of cardholder data is likely a personal data breach under GDPR requiring ICO notification within 72 hours. In the US, state breach notification laws apply.

**Regulatory interest**: While PCI DSS itself is not regulated by government, regulators (FCA in the UK, FTC in the US) take an interest in payment security. A major breach can attract regulatory scrutiny beyond the card brand enforcement mechanism.

---

## PCI DSS v4.0: Key Changes from v3.2.1

The 2022 release of PCI DSS v4.0 introduced significant changes:

**Customised approach**: v4.0 introduces a new compliance path — the Customised Approach — alongside the traditional Defined Approach. The Customised Approach allows organisations to implement controls that achieve the same security objective through different means, with the approach documented and independently validated. This is significant for mature organisations with sophisticated security programmes that may not align exactly with prescriptive PCI requirements.

**Enhanced multi-factor authentication**: MFA is now required for all access into the CDE, not just administrative access from outside the network (Requirement 8.4). This is a significant expansion.

**Password requirements**: Minimum password length increased to 12 characters (from 7 in v3.2.1) for systems not using MFA (Requirement 8.3).

**Targeted risk analysis**: v4.0 requires a targeted risk analysis to inform the frequency of certain activities (e.g. log review frequency, security awareness training frequency). Rather than prescribing specific frequencies, v4.0 allows organisations to determine appropriate frequency based on their specific risk environment.

**Phishing resistance**: Enhanced requirements for phishing-resistant authentication mechanisms.

**Security awareness**: Enhanced security awareness requirements including phishing simulations.

**Penetration testing**: Refined penetration testing requirements, now referencing industry-accepted penetration testing methodologies.

**Vendor-supplied defaults**: Reinforced requirements to change all vendor-supplied defaults before systems are installed in production.

---

## Common Mistakes and Failures

**1. Assuming PCI DSS doesn't apply because "we outsource payments."**
Outsourcing payment processing to a third party (Stripe, PayPal, Square) reduces your PCI DSS scope significantly — but does not eliminate your obligation. You are still a merchant; you must still complete the appropriate SAQ; your checkout page, network, and business practices are still subject to applicable requirements.

**2. Not understanding your scope.**
Assuming only the systems that directly process card data are in scope. Systems connected to those systems may also be in scope. Scope creep is one of the most common PCI DSS compliance failures — organisations discover mid-assessment that many more systems are in scope than they assumed.

**3. Treating compliance as a point-in-time event.**
PCI DSS compliance must be maintained year-round — not achieved for the annual assessment and then allowed to lapse. Continuous monitoring, quarterly scans, and ongoing security practices are all required.

**4. Not updating for v4.0.**
Organisations that have been certified against v3.2.1 and have not transitioned to v4.0. The new requirements — particularly expanded MFA and enhanced authentication — require genuine programme investment, not just documentation updates.

**5. SAQ type mismatch.**
Completing the wrong SAQ type for your payment environment. Each SAQ type applies to a specific environment. Completing SAQ A when you actually fall into SAQ D (because of connected systems or stored card data) provides false assurance and leaves significant vulnerabilities unaddressed.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- PCI DSS is a key interested party requirement for organisations that process payment cards. ISO 27001 Clause 4.2 requires understanding of interested party requirements — card brand compliance obligations are a significant interested party requirement for retail, hospitality, and financial services organisations.
- Many ISO 27001 Annex A controls align with PCI DSS requirements — auditors in relevant sectors should understand the relationship. (See G6-08 for full mapping.)

**CISM:**
- Domain 1 (Governance) requires understanding of relevant regulatory and contractual compliance frameworks. PCI DSS is one of the most widely applicable compliance frameworks for commercial organisations.

**CRISC:**
- PCI DSS non-compliance is a significant regulatory and financial risk. CRISC candidates must be able to assess and manage PCI DSS compliance risk as part of the IT risk portfolio.

**CISSP:**
- Domain 1 (Security and Risk Management) covers industry compliance frameworks. Know PCI DSS's scope, structure, compliance levels, and the consequences of non-compliance.

---

## GUARDIAN's Take

PCI DSS occupies a unique position in the compliance landscape: it is contractual, not legislative, yet its enforcement mechanisms are more immediately consequential for many businesses than regulatory fines. A retailer that loses its right to accept Visa and Mastercard does not survive.

The evolution from multiple competing card brand standards to a unified PCI DSS was the right move — it gave the industry a common security baseline and reduced the compliance burden for organisations managing multiple card brand relationships. But the standard's prescriptive nature has always been both its strength and its weakness.

Its strength: prescriptive requirements create clear, testable expectations. Auditors, merchants, and processors know exactly what is required. There is less room for interpretation games — either you meet the requirement or you don't.

Its weakness: prescriptive requirements can become compliance targets rather than security outcomes. An organisation can satisfy every requirement in every SAQ and still be fundamentally insecure — if the controls are implemented to satisfy the letter of the requirement without achieving its spirit.

PCI DSS v4.0's introduction of the Customised Approach attempts to address this — allowing mature organisations to demonstrate security outcomes rather than prescriptive control compliance. This is a significant evolution and one that the most sophisticated compliance programmes should seriously consider.

But for the majority of merchants — particularly SMEs completing SAQ A or SAQ C — the prescriptive approach remains entirely appropriate and genuinely valuable. The requirements are not arbitrary; they represent the accumulated knowledge of what controls reduce payment card fraud. Following them properly makes organisations meaningfully more secure.

Take PCI DSS seriously. Not just as a compliance obligation, but as a security baseline that protects your customers, your business, and the integrity of the payment system that everyone depends on.

---
*Module: Module 6 — PCI DSS | Guardian Curriculum*
