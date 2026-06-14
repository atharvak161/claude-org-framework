---
tags: [guardian, grc, module-6, pci-dss, merchant-levels, saq, self-assessment, compliance-levels]
module: 6
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G6-01 — What is PCI DSS and Who Must Comply", "G6-02 — The 12 PCI DSS Requirements", "G6-04 — Cardholder Data Environment", "G6-06 — The QSA"]
---

# G6-03 — Merchant Levels and SAQ Types

> [!abstract] What This Note Covers
> By the end of this note, you will understand the merchant and service provider compliance levels, what each level requires in terms of assessment type, and how to select the correct SAQ type for a given payment environment — including the key distinctions between SAQ types and the conditions for each.

---

## Why This Exists

One of the most consequential decisions in any PCI DSS compliance programme is: which assessment type applies, and which SAQ type is correct for this payment environment? Getting this wrong — completing SAQ A when SAQ D actually applies, or underestimating merchant level — creates a false sense of compliance and potentially significant liability exposure.

The compliance level and SAQ type determine the scope of compliance requirements. SAQ A has fewer requirements than SAQ D. A merchant completing the wrong (simpler) SAQ may be satisfying the compliance questionnaire without actually meeting all the requirements that apply to their environment.

This note provides the complete guide to making the correct determination.

---

## Merchant Compliance Levels

Card brands define merchant compliance levels based primarily on annual transaction volume. The definitions vary slightly between Visa, Mastercard, and other card brands — the figures below reflect the most widely applied (Visa/Mastercard) definitions:

### Level 1 Merchants

**Volume**: More than 6 million total combined Visa/Mastercard transactions per year across all channels; OR any merchant that has suffered a breach that resulted in compromise of account data; OR any merchant identified by a card brand as Level 1 for risk-related reasons.

**Assessment requirements**:
- Annual Report on Compliance (ROC) by a Qualified Security Assessor (QSA) OR an internal auditor who has achieved ISA (Internal Security Assessor) designation
- Quarterly external network vulnerability scans by an Approved Scanning Vendor (ASV)
- Attestation of Compliance (AOC) form

**Who this applies to**: Large retailers, major e-commerce platforms, large hotel chains, major airlines, large restaurant chains. Any organisation that processes payment volumes at this scale.

### Level 2 Merchants

**Volume**: 1 million to 6 million total combined Visa/Mastercard transactions per year across all channels.

**Assessment requirements**:
- Annual Self-Assessment Questionnaire (SAQ) completed by the merchant (specific SAQ type depends on payment environment — see below)
- Quarterly external network vulnerability scans by an ASV
- Attestation of Compliance form

**Note**: Some acquirers and card brands may require Level 2 merchants to complete a QSA-conducted ROC rather than a SAQ, particularly for more complex environments. Always confirm requirements with your acquirer.

### Level 3 Merchants

**Volume**: 20,000 to 1 million total e-commerce transactions per year.

**Assessment requirements**:
- Annual SAQ
- Quarterly external ASV scans
- Attestation of Compliance form

### Level 4 Merchants

**Volume**: Fewer than 20,000 e-commerce transactions per year AND all other merchants processing up to 1 million Visa transactions per year.

**Assessment requirements**:
- Annual SAQ (recommended; may be required by acquirer)
- Quarterly external ASV scans (recommended; may be required by acquirer)
- Attestation of Compliance form (if required by acquirer)

**Practical note**: Level 4 is the most common level — it covers the vast majority of small and medium-sized businesses that accept card payments. While assessment requirements are described as "recommended," most acquirers require SAQ completion as a condition of maintaining the merchant relationship.

---

## Service Provider Compliance Levels

Service providers are assessed on a separate tier system:

### Level 1 Service Providers

**Volume**: Storing, processing, or transmitting more than 300,000 Visa transactions annually; OR any service provider identified by Visa as Level 1 for risk-related reasons.

**Assessment requirements**:
- Annual on-site security assessment by a QSA
- Quarterly external ASV scans
- Attestation of Compliance form
- Penetration testing (internal and external)

### Level 2 Service Providers

**Volume**: Storing, processing, or transmitting fewer than 300,000 Visa transactions annually.

**Assessment requirements**:
- Annual SAQ (SAQ D for Service Providers)
- Quarterly external ASV scans
- Attestation of Compliance form

---

## Self-Assessment Questionnaire Types

The SAQ type is determined by the payment environment — specifically how cardholder data flows through the merchant's systems. Selecting the correct SAQ is one of the most critical compliance decisions.

### SAQ A — Card-Not-Present, Fully Outsourced

**Who qualifies**:
- Card-not-present merchants (e-commerce, mail order, telephone order)
- All cardholder data functions are completely outsourced to PCI DSS compliant third-party service providers
- The merchant does NOT store, process, or transmit any cardholder data on their systems or premises
- The merchant has confirmed that all third parties handling their cardholder data are PCI DSS compliant

**Payment environment**: E-commerce merchant using an external, PCI-compliant hosted payment page (redirect-based checkout where the customer is taken directly to the payment provider's page — e.g. PayPal, Stripe Checkout, Sage Pay hosted page). The merchant's website does not collect or transmit card data.

**Number of requirements assessed**: Approximately 22 — significantly fewer than other SAQ types. Only the requirements directly applicable to merchant's limited scope are assessed.

**Key requirements applicable**: Physical security of systems, security awareness training, information security policy, third-party service provider management.

**NOT applicable**: Firewall, antivirus, encryption of stored data (no data stored), logging and monitoring of card systems — these do not apply because the merchant has no cardholder data environment.

**Common misconception**: Some merchants believe they qualify for SAQ A simply because they "use PayPal" or "use Stripe." This is only correct if the entire payment experience takes place on the third party's page — if the merchant's website contains any payment form fields (even if the data is sent directly to the processor via JavaScript), SAQ A does not apply. See SAQ A-EP below.

---

### SAQ A-EP — E-commerce, Partially Outsourced

**Who qualifies**:
- E-commerce merchants who have outsourced all payment processing to a PCI DSS compliant third party
- BUT the merchant's own website directly causes cardholder data to be transmitted to a payment processor (e.g. via a JavaScript-based payment form embedded in the merchant's page)
- The merchant does not store cardholder data electronically, but their website does handle it (even briefly, in transit)

**Payment environment**: E-commerce merchant using a JavaScript-based payment form (e.g. Stripe Elements, Braintree Hosted Fields) that loads card input fields from the processor's servers but is embedded within the merchant's website. The merchant's server does not process card data, but the merchant's website is the point where the customer enters their card details.

**Number of requirements assessed**: More than SAQ A — approximately 191 sub-requirements. Includes requirements for website security, web application protection, vulnerability management, patch management, malware protection on systems that could affect the payment page.

**Key distinction from SAQ A**: The merchant's website is in scope because a compromise of the website could affect the payment experience or introduce card-skimming scripts. The merchant must protect their web server and ensure the integrity of the payment page.

**v4.0 addition**: Requirement 11.6 (payment page integrity monitoring) is particularly relevant to SAQ A-EP merchants — they must monitor their payment pages for unauthorised script changes (protection against Magecart-style attacks).

---

### SAQ B — Imprint Machines or Standalone Dial-Up Terminals

**Who qualifies**:
- Merchants using only imprint machines (knuckle-busters) with no electronic cardholder data storage; OR
- Merchants using only standalone, dial-up (PSTN) point-of-interaction terminals not connected to any other systems or the internet

**Payment environment**: Small physical retailers or service businesses using old-style imprint machines (a manual process producing a physical card imprint) or standalone terminals that connect to the processor only via a direct phone line (not IP-connected, not part of a network).

**Number of requirements assessed**: Small — approximately 41 sub-requirements. Applicable requirements focus on physical security of the terminal, cardholder data disposal, and organisational policies.

**Not applicable**: Network security controls (no network), vulnerability management for connected systems (no connected systems), most technological controls.

**Practical note**: SAQ B is increasingly uncommon as dial-up infrastructure is retired. Most modern card terminals are IP-connected, which may change the applicable SAQ type.

---

### SAQ B-IP — Standalone IP-Connected POI Terminals

**Who qualifies**:
- Merchants using only standalone payment terminals that are IP-connected
- The terminals are approved Point-of-Interaction (POI) devices certified under the PCI PTS standard
- The terminals do not connect to any other systems on the merchant's network
- Cardholder data is not electronically stored after authorisation

**Payment environment**: Restaurants, small retailers using IP-connected card terminals that connect to the payment processor but are isolated from the rest of the merchant's network. The terminal handles card data; the merchant's other systems do not.

**Number of requirements assessed**: Moderate — approximately 75 sub-requirements.

**Key requirement**: The POI devices must be PCI PTS approved. The terminal must be isolated — not connected to the merchant's POS system, not sharing a network segment with other business systems.

---

### SAQ C — Payment Application Connected to Internet (No CHD Storage)

**Who qualifies**:
- Merchants with a payment application system connected to the internet
- The system does not store electronic cardholder data after authorisation

**Payment environment**: Restaurant POS systems, retail POS systems that are connected to the internet for authorisation but do not store card data. The POS application communicates with the processor over the internet.

**Number of requirements assessed**: Approximately 160 sub-requirements.

**Key requirements applicable**: Network security controls, secure configuration, vulnerability management, access control, logging, physical security, security policy.

**Critical scope consideration**: The merchant's systems that the payment application connects to are also in scope. A restaurant using a POS system connected to the same network as the office Wi-Fi, management systems, and back-office computers has a significantly larger scope than a restaurant with the POS system on a completely isolated network.

---

### SAQ C-VT — Web-Based Virtual Terminals

**Who qualifies**:
- Merchants processing cardholder data only through an isolated virtual terminal on a PC connected to the internet
- The virtual terminal is provided by a PCI DSS compliant service provider
- The PC is not connected to other systems within the merchant's environment
- Cardholder data is entered only through the keyboard into the virtual terminal

**Payment environment**: Small businesses (e.g. dental practices, veterinary surgeries, small service businesses) that take card payments by manually typing card details into a web-based virtual terminal provided by their payment processor. The PC used for the virtual terminal is dedicated to this purpose.

**Number of requirements assessed**: Approximately 124 sub-requirements.

**Key requirement**: The PC used for the virtual terminal must not be used for any other purposes that could introduce risk — no email, no browsing unrelated to the virtual terminal, no other software.

---

### SAQ D — All Other Merchants; All Service Providers (SAQ-eligible)

**Who qualifies**:
- All merchants who do not qualify for SAQ A, A-EP, B, B-IP, C, or C-VT; OR
- Any merchant that stores cardholder data electronically; OR
- Service providers completing a SAQ

**Payment environment**: Merchants with complex payment environments — integrated POS systems, e-commerce with server-side processing, environments where card data is stored (even temporarily), any environment that does not fit the narrow criteria of the other SAQ types.

**Number of requirements assessed**: All 12 requirements in full — the most comprehensive SAQ type, equivalent in scope to a QSA ROC. Approximately 300+ sub-requirements.

**This is the default SAQ**: If there is any doubt about which SAQ type applies, SAQ D is the safe choice. It is better to satisfy all requirements than to complete a simpler SAQ type that does not apply to the actual environment.

---

### SAQ P2PE — Point-to-Point Encryption Solution

**Who qualifies**:
- Merchants using a validated PCI P2PE solution
- Cardholder data is encrypted immediately upon capture at the POI device and not decryptable within the merchant's environment
- The merchant has no ability to decrypt cardholder data

**Payment environment**: Merchants using hardware-based, validated P2PE solutions (e.g. Verifone's P2PE solution, Ingenico's P2PE solution — certified P2PE solutions listed on the PCI SSC website).

**Number of requirements assessed**: Very small — approximately 35 sub-requirements. The P2PE solution operator handles most security requirements; the merchant only needs to address their limited remaining responsibilities.

**The P2PE advantage**: By using a validated P2PE solution, merchants dramatically reduce their PCI DSS scope. Card data never exists in the clear within the merchant's environment — the encryption key is held by the P2PE solution operator, not the merchant. This is one of the most effective scope reduction strategies available.

**Important**: Only validated P2PE solutions qualify for this reduced scope. A merchant that encrypts cardholder data themselves, or uses a payment gateway that is not a validated P2PE solution, does not qualify. The solution must appear on the PCI SSC's list of validated P2PE solutions.

---

## SAQ Selection Decision Tree

```
Is the merchant card-not-present (e-commerce, MOTO)?
    │
    YES → Are all cardholder data functions fully outsourced to PCI-compliant
          third parties, with the merchant having NO cardholder data on their
          systems or website?
                │
               YES → Does the merchant's website contain any payment form
                     fields (even JS-based)?
                          │
                         NO → SAQ A
                          │
                         YES → SAQ A-EP
                │
               NO → Merchant has cardholder data involvement → SAQ D
    │
    NO → Is the merchant physical (card-present)?
    │
    YES → What type of terminal does the merchant use?
               │
               ├── Imprint only, or standalone dial-up → SAQ B
               │
               ├── Standalone IP-connected PTS-approved terminal,
               │   isolated from other network systems → SAQ B-IP
               │
               ├── PCI-validated P2PE solution → SAQ P2PE
               │
               ├── Web-based virtual terminal on dedicated PC,
               │   not connected to other systems → SAQ C-VT
               │
               ├── Payment application connected to internet,
               │   no CHD storage → SAQ C
               │
               └── Any other environment, or CHD stored → SAQ D
```

---

## The Attestation of Compliance (AOC)

After completing an SAQ, merchants must complete an **Attestation of Compliance (AOC)** — a signed document confirming that the SAQ has been completed accurately and that the merchant meets all applicable PCI DSS requirements.

The AOC is submitted to the acquirer (and in some cases to the card brand). It is the formal compliance evidence that the acquirer uses to maintain compliance records.

**Key points about the AOC:**
- It must be signed by an authorised officer of the merchant organisation (not just the IT team)
- Signing a false AOC has legal consequences — it is a contractual representation
- The AOC must be resubmitted annually
- If the payment environment changes significantly, the AOC may need to be resubmitted with an updated SAQ

---

## Quarterly ASV Scans

All merchants (except those using SAQ B with no internet connectivity) must complete quarterly external vulnerability scans by an Approved Scanning Vendor (ASV).

**What ASV scans cover**: All internet-facing IP addresses and domains within the merchant's cardholder data environment — including web servers, firewalls, load balancers, and any other systems with external IP addresses that are in scope.

**Passing vs failing scans**: A scan "passes" when it identifies no vulnerabilities above a certain threshold. Failing scans must be remediated and re-scanned. The requirement is to have four passing quarterly scans on record — not just to complete four scans.

**The scan cycle**: Completing a quarterly scan is not sufficient if it fails. The cycle is: scan → review findings → remediate → rescan → confirm pass → document.

**ASV approval**: Not all scanning vendors are approved by the PCI SSC. The ASV must be listed on the PCI SSC's website. Using a non-approved vendor's scans does not satisfy the requirement.

---

## Common Mistakes and Failures

**1. Completing SAQ A when SAQ A-EP or SAQ D applies.**
The most common SAQ selection error. Merchants using JavaScript-based payment forms (Stripe Elements, Braintree Hosted Fields) are not SAQ A eligible — they are SAQ A-EP. Merchants who have any cardholder data processing on their own servers must complete SAQ D.

**2. Not confirming acquirer requirements.**
Acquirers may impose requirements beyond the card brand minimum. Some acquirers require Level 2 merchants to complete a QSA ROC rather than a SAQ. Always confirm what your acquirer requires.

**3. Completing SAQ without understanding the questions.**
SAQ questions require specific knowledge of the payment environment. Answering "Yes" to "is MFA implemented for all access to the CDE?" without verifying this is accurate creates a false AOC — and real liability if a breach occurs.

**4. Not renewing the AOC annually.**
Compliance must be demonstrated annually. An AOC signed 18 months ago is not current compliance evidence. Acquirers will chase non-renewing merchants.

**5. Not completing quarterly ASV scans.**
Scan frequency is quarterly — not annual, not "when we remember." Failing to complete quarterly scans is a compliance gap regardless of the SAQ result.

**6. Scope not properly assessed before selecting SAQ type.**
The correct SAQ type depends on the accurate scope of cardholder data flows. Without a proper scope assessment (see G6-04), merchants may select the wrong SAQ type — typically one that is simpler than their actual environment warrants.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Auditors working with payment organisations must understand PCI DSS compliance levels and SAQ types as part of the interested party requirements (Clause 4.2). The acquirer's PCI DSS compliance requirements are a significant external requirement driving ISMS scope and control selection.

**CISM:**
- Domain 1 (Governance) — compliance level determination and SAQ selection are programme governance decisions. CISOs at merchant organisations must ensure the correct compliance level is identified and the appropriate assessment type completed.

**CRISC:**
- Incorrect SAQ selection is a compliance risk that CRISC candidates must be able to identify — the risk of completing a simpler SAQ than the environment warrants creates unacknowledged compliance gaps and breach liability.

---

## GUARDIAN's Take

The SAQ type decision is more consequential than most merchants realise. A merchant that completes SAQ A — with its minimal requirements — when their actual environment requires SAQ D has not demonstrated PCI DSS compliance. They have completed a questionnaire that does not apply to them. If a breach occurs, the card brands will conduct a forensic investigation; if the environment is found to be more complex than SAQ A, the merchant faces both the breach consequences and the finding that they were not actually compliant.

The right starting point is always the payment environment — not the compliance paperwork. Map the cardholder data flows precisely: where does card data enter, where does it go, what systems does it touch, where is it transmitted, is it stored anywhere? From that map, the correct SAQ type follows logically.

If there is any uncertainty about which SAQ applies, the safest choice is the more comprehensive one. Completing SAQ D when SAQ C might have been technically sufficient does no harm. Completing SAQ A when SAQ D was required can be catastrophic.

---
*Module: Module 6 — PCI DSS | Guardian Curriculum*
