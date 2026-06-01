---
tags: [guardian, grc, module-8, operational-resilience, regulatory, fca, pra, dora, impact-tolerance]
module: 8
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: advanced
date: 2026-04-19
guardian-refs: ["G8-01 — What is Business Continuity Management", "G8-02 — Business Impact Analysis", "G8-04 — ISO 22301", "G5-02 — GDPR Structure", "G7-04 — SOC 2"]
---

# G8-06 — Operational Resilience and Regulatory Expectations

> [!abstract] What This Note Covers
> By the end of this note, you will understand what operational resilience means in a regulatory context, the UK FCA/PRA operational resilience framework, DORA (Digital Operational Resilience Act) for EU financial services, NIS2 resilience requirements, and how regulators' expectations are converging around a common resilience model that goes beyond traditional BCM.

---

## Why This Exists

Traditional BCM — the discipline covered in G8-01 through G8-05 — has historically been an internal governance activity. Organisations implemented BCPs, conducted exercises, and reported to their own boards. Regulators observed from a distance.

That era is over. In the UK, the FCA and PRA have established mandatory operational resilience requirements for financial services firms — with specific impact tolerances, public commitments, and testing obligations. In the EU, DORA has created legally binding digital operational resilience requirements for financial entities. NIS2 has extended resilience obligations to critical infrastructure operators across the EU.

The regulatory shift is driven by a recognition that the disruption of a single large financial institution or critical infrastructure operator can cause systemic harm to the broader economy and society — harm that falls on individuals and businesses who had no direct relationship with the organisation that failed. Regulators are no longer willing to leave resilience entirely to organisational discretion.

For GRC professionals in financial services and critical infrastructure, understanding these regulatory frameworks is not optional.

---

## What Operational Resilience Means

**Operational resilience** is the ability of an organisation to prevent, adapt to, respond to, recover from, and learn from operational disruptions. It is a broader concept than business continuity — it encompasses the organisation's ability to:

- **Prevent**: Reduce the likelihood and severity of disruptions through risk management, security, and robust design
- **Adapt**: Adjust operations dynamically in response to changing conditions before a formal disruption occurs
- **Respond**: React effectively when disruption occurs — minimising impact through coordinated response
- **Recover**: Restore normal operations within an acceptable timeframe
- **Learn**: Improve future resilience based on incidents, near-misses, and exercises

**The regulatory focus**: Regulators are less interested in whether an organisation has a BCP document and more interested in whether the organisation can actually continue to deliver important services within acceptable limits when disruption occurs. The evidence of resilience is operational capability, not documentation.

**The distinction from BCM**: Traditional BCM asks "how do we recover?" Operational resilience asks "what can we tolerate — and can we prove it?" The regulatory frameworks define explicit tolerance thresholds that organisations must demonstrate they can remain within.

---

## UK Operational Resilience Framework: FCA and PRA

### Background

In March 2021, the Bank of England, Prudential Regulation Authority (PRA), and Financial Conduct Authority (FCA) jointly published final rules on operational resilience for UK financial services firms. These came into effect on 31 March 2022, with a transition period for full self-assessment of impact tolerances running to 31 March 2025.

**Who it applies to**: UK-regulated financial services firms including banks, building societies, investment firms, insurers, FMIs (financial market infrastructures), payment system operators, and e-money institutions — both as directly regulated entities and, in some cases, through their critical third parties.

### The Three Core Requirements

**1. Identify Important Business Services (IBS)**

Firms must identify the services they provide that, if disrupted, could cause intolerable harm to consumers, market integrity, or financial stability.

**Important Business Services are defined by impact, not by type.** A firm must ask: if this service is disrupted, does it:
- Cause harm to consumers (financial loss, inability to access money, loss of critical service)?
- Threaten market integrity (inability to trade, settle, or access markets)?
- Create systemic risk (knock-on effects to other firms or the broader financial system)?

**Examples of IBS**: Current account operations (for a retail bank); payment processing; mortgage arrears management; trading platform access; custody services; insurance claims processing.

**How many IBS?** Most large banks identify 5–15 IBS; smaller firms typically 2–8. The number reflects the breadth and systemic significance of the firm's services.

**2. Set Impact Tolerances**

For each IBS, the firm must set an **Impact Tolerance** — the maximum tolerable disruption before the disruption causes intolerable harm.

**Impact tolerances are expressed as time limits**: The maximum period within which the IBS must be restored to avoid causing intolerable harm. For example:
- "Current account access must be restored within 24 hours"
- "Payment processing must be restored within 6 hours"
- "Mortgage arrears management must be restored within 2 business days"

**Impact tolerances must be realistic and challenging**: The regulators have been explicit that impact tolerances should not simply reflect current system recovery capabilities. They should reflect the maximum harm that could be tolerated — which may be significantly faster than current recovery capabilities.

**Setting the impact tolerance**: The firm must consider:
- The harm to consumers and markets if the IBS is unavailable for various durations
- The cumulative harm if multiple firms simultaneously lose the same service
- The point at which consumers and markets cannot absorb further disruption
- Regulatory and contractual obligations (payment deadlines; regulatory reporting windows)

**3. Demonstrate the Ability to Remain Within Impact Tolerances**

Firms must test and demonstrate — to themselves and to regulators — that they can remain within their impact tolerances in severe but plausible disruption scenarios.

**Testing requirements:**
- **Scenario testing**: Use realistic, severe scenarios (not the minimum plausible disruption) to assess whether the impact tolerance can be maintained
- **End-to-end testing**: Test the complete service delivery chain — not just individual systems — to identify dependencies and vulnerabilities
- **Third-party dependency testing**: Include critical third parties in scenario analysis
- **Self-assessment**: Firms must self-assess against the policy requirements and maintain a documented self-assessment

**The self-assessment document**: A formal document (submitted to regulators if requested) that:
- Lists each IBS and its impact tolerance
- Describes the firm's current capability to remain within the tolerance
- Identifies vulnerabilities (where the firm cannot currently meet the tolerance)
- Documents the remediation programme for vulnerabilities
- Describes the testing programme

**Regulatory expectations on testing**: By March 2025, firms must be able to operate within their impact tolerances and demonstrate this through testing. Firms that cannot meet their own impact tolerances must have credible remediation plans.

### The Role of Critical Third Parties (CTPs)

The UK regulators have extended operational resilience scrutiny to **critical third parties** — providers of services so critical to UK financial stability that their disruption could cause systemic harm. From December 2024, the FCA and PRA have powers to:
- Designate specific third parties as Critical Third Parties
- Set resilience standards for CTPs directly
- Conduct oversight of CTPs (testing, information gathering)

**CTPs currently designated or under consideration**: Major cloud providers (AWS, Microsoft Azure, Google Cloud) providing infrastructure to UK financial services; core messaging and settlement infrastructure providers.

The CTP regime is a recognition that financial firms' resilience is inseparable from the resilience of their critical technology providers.

---

## DORA: Digital Operational Resilience Act

### Background

**DORA** (Digital Operational Resilience Act) is EU Regulation (EU) 2022/2554, applying directly across all EU member states from **17 January 2025**. It applies to a broad range of financial entities and their ICT third-party service providers.

**Why DORA was needed**: EU financial services had diverse and inconsistent resilience frameworks across member states. Different national regulators had different requirements; cross-border financial groups faced a patchwork of obligations. DORA harmonises digital operational resilience requirements across the EU.

### Who DORA Applies To

**Financial entities**: Credit institutions, payment institutions, e-money institutions, investment firms, insurance and reinsurance undertakings, central counterparties, trading venues, trade repositories, UCITS management companies, AIFMs, crypto-asset service providers, and more.

**ICT third-party service providers**: Cloud providers, data analytics providers, payment processors — any ICT provider whose services are critical to financial entity operations. Critically designated third parties face direct oversight by EU supervisory authorities.

**UK impact**: Although DORA is EU law, UK financial firms operating in the EU must comply for their EU operations. UK-based ICT providers with EU financial entity customers may be designated as critical ICT third-party service providers subject to direct EU supervisory oversight.

### DORA's Five Pillars

**Pillar 1: ICT Risk Management**

Financial entities must have a robust ICT risk management framework:
- Governance and organisation (board responsibility for ICT risk)
- ICT risk identification and assessment
- ICT systems protection and prevention (secure configuration, patch management, access control)
- Detection (monitoring and anomaly detection)
- Response and recovery (incident response and BCM)
- Backup and recovery (RPOs, RTOs, restoration testing)
- Communication (internal and external communication during ICT disruptions)
- Learning (post-incident analysis and improvement)

DORA's ICT risk management framework is substantively similar to ISO 27001's requirements — many ISO 27001-certified organisations will find significant overlap.

**Pillar 2: ICT-Related Incident Management**

Financial entities must have formal ICT incident management processes:
- Detection and classification of ICT incidents (by impact on services, data, and financial operations)
- Major incident reporting to regulators:
  - Initial notification: Within 4 hours of classification as major (or within 24 hours of discovery)
  - Intermediate report: No later than 72 hours after initial notification
  - Final report: Within 1 month of root cause analysis completion
- Aggregated reporting of minor incidents (statistical data, quarterly)

**The reporting threshold: "major incident"**: DORA defines criteria for classifying incidents as major — based on clients affected, geographic spread, duration, data loss, service unavailability, and financial impact. Regulators provide guidance on classification thresholds.

**Connection to GDPR**: ICT incidents involving personal data trigger both DORA's incident reporting obligations and GDPR's breach notification requirements. The 72-hour GDPR window and the DORA initial notification window may overlap or conflict — firms must manage both obligations simultaneously.

**Pillar 3: Digital Operational Resilience Testing**

Financial entities must have a comprehensive testing programme:

**Basic testing** (all entities): Annual tests of ICT systems and tools, including: vulnerability assessments, network security assessments, physical security reviews, review of source code where possible, application security assessments.

**Advanced testing — TLPT** (significant entities): Threat-Led Penetration Testing (TLPT) must be conducted at least every 3 years by critical or significant financial entities. TLPT is structured adversarial testing based on real threat intelligence, conducted by certified external testers using the TIBER-EU (Threat Intelligence-Based Ethical Red-Teaming) methodology.

**TIBER-EU**: The European Central Bank's framework for intelligence-led red team testing of financial institutions. TIBER-EU tests are conducted by certified threat intelligence providers (TI providers) and red team providers (RT providers), with the financial regulator receiving a copy of the test results. The UK equivalent is CBEST.

**Pillar 4: ICT Third-Party Risk Management**

Financial entities must manage ICT third-party risk throughout the relationship lifecycle:
- Pre-contractual due diligence (risk assessment before engaging new ICT providers)
- Contractual requirements (specific clauses required in contracts with ICT providers — exit strategies, audit rights, incident notification, service level commitments, data location, security standards)
- Ongoing monitoring (regular reassessment of critical providers' performance and resilience)
- Concentration risk (assessing over-reliance on a single provider or a small group)
- Exit planning (documented exit strategies for all critical ICT providers)

**The DORA contract requirements** are specific and extensive — including requirements for:
- Data security standards
- ICT incident notification obligations
- Audit rights (including penetration testing of provider)
- Service continuity commitments
- Data portability and exit support
- Subcontracting restrictions and transparency

**Pillar 5: Information Sharing**

Financial entities are encouraged (not required) to participate in information sharing arrangements about cyber threats, vulnerabilities, and attack patterns with other financial entities and competent authorities.

---

## NIS2 Directive

**NIS2** (Network and Information Systems Directive 2, EU Directive 2022/2555) replaced NIS1 from October 2024. It extends cybersecurity and resilience requirements to a significantly broader range of sectors and entities.

**Sectors covered (essential and important entities):**
- Energy (electricity, gas, hydrogen, oil)
- Transport (air, rail, water, road)
- Banking and financial market infrastructure
- Health sector
- Drinking water and wastewater
- Digital infrastructure (IXPs, DNS, TLD registries, cloud providers, datacentres, CDNs)
- ICT service management (managed security service providers, managed service providers)
- Public administration
- Space (ground-based infrastructure for space services)

**And "important entities" in additional sectors:**
- Postal services
- Waste management
- Manufacturing (medical devices, pharmaceuticals, electronics)
- Food production
- Research organisations
- Digital providers (online marketplaces, online search engines, social networking platforms)

**NIS2 resilience requirements:**

Entities must implement security measures appropriate to the risk, including:
- Risk analysis and information system security policies
- Incident handling (detection, response, reporting)
- Business continuity (backup management, disaster recovery, crisis management)
- Supply chain security (including assessments of direct suppliers and service providers)
- Security in network and information systems acquisition, development, and maintenance
- Policies and procedures for assessing security measures effectiveness
- Cybersecurity hygiene practices (vulnerability management, patch management, access control)
- Use of cryptography and encryption

**NIS2 incident reporting**: Significant incidents must be reported to the national competent authority:
- Early warning: Within 24 hours of becoming aware
- Incident notification: Within 72 hours (similar to GDPR)
- Final report: Within 1 month

**NIS2 enforcement**: Significant administrative fines (up to €10M or 2% of global turnover for essential entities; €7M or 1.4% for important entities).

**UK equivalent**: The Network and Information Security (NIS) Regulations 2018 apply in the UK. The UK government has indicated it will update these regulations to reflect NIS2 developments, but the UK is no longer bound by EU directives post-Brexit.

---

## The Convergence of Resilience Frameworks

Looking across the UK FCA/PRA operational resilience framework, DORA, and NIS2, a common model emerges:

| Element | UK FCA/PRA | DORA | NIS2 |
|---|---|---|---|
| **Important services** | Important Business Services | Critical/significant entity status | Essential/important entity status |
| **Impact tolerance** | Explicit (time-based tolerance per IBS) | Implicit (RTOs/RPOs; incident reporting thresholds) | Risk-proportionate |
| **Risk management** | Operational risk framework | ICT risk management framework | Security policies and risk analysis |
| **Incident reporting** | Supervisor notifications | 4h/72h/1m reporting chain | 24h/72h/1m reporting chain |
| **Testing** | Scenario-based; end-to-end testing | Basic annual + TLPT every 3 years | Proportionate testing |
| **Third-party oversight** | Critical Third Parties regime | ICT TPSP DORA requirements | Supply chain security requirements |
| **Accountability** | Board and senior management | Board and senior management | Management body responsibility |

**The common model**: Identify important services → Set tolerances → Demonstrate capability → Test → Report incidents → Manage third parties → Learn and improve.

This convergence means that organisations subject to multiple regulatory frameworks (e.g. UK banks with EU operations) face structurally similar requirements — creating opportunities for integrated programme management rather than parallel compliance silos.

---

## Implications for GRC Professionals

### In Financial Services

**If you are at a UK financial services firm:**
- ISO 22301 BCMS provides the management system framework — but the FCA/PRA framework adds IBS identification, impact tolerance setting, and regulatory self-assessment obligations that go beyond ISO 22301's requirements
- Impact tolerances must be set and documented for each IBS — this is a board-level commitment, not a technical parameter
- Scenario testing must be severe and realistic — regulators will scrutinise whether testing is genuinely challenging the firm's resilience or confirming what the firm already knows it can achieve
- Third-party dependency must be mapped for each IBS — the firm cannot meet its impact tolerances if a critical third party fails and no alternative exists

**If you are at an EU financial entity (or UK firm with EU operations):**
- DORA compliance requires a formal ICT risk management framework, incident reporting processes, testing programme, and third-party risk management
- DORA's contract requirements must be incorporated into all new and renewed ICT provider contracts
- TLPT (Threat-Led Penetration Testing) may be required — significant entities should assess whether they meet TLPT thresholds and plan accordingly

### In Critical Infrastructure

NIS2 (or UK NIS regulations) may apply depending on sector and size. Key actions:
- Determine whether the organisation is an "essential" or "important" entity under NIS2/UK NIS
- Implement the required security measures (risk analysis, incident management, BCM, supply chain security)
- Establish the incident reporting capability (24-hour early warning; 72-hour notification)
- Engage with the national competent authority

---

## Common Mistakes and Failures

**1. Confusing operational resilience with BCM.**
Operational resilience is broader than BCM — it includes prevention and adaptation (which BCM often does not address) and is defined by external tolerance thresholds (which BCM defines internally). A firm with a mature BCM programme may still have significant operational resilience gaps in how it sets and validates impact tolerances.

**2. Setting impact tolerances that match current capabilities, not what can be tolerated.**
The FCA/PRA have been clear: impact tolerances should reflect the maximum tolerable disruption to consumers and markets — not the organisation's current recovery capability. Setting an impact tolerance of "72 hours" because that is what the current DR infrastructure delivers, when the actual tolerable disruption is 8 hours, understates the gap and misleads regulators.

**3. Not mapping end-to-end service delivery chains.**
Testing a system in isolation but not the full service delivery chain — including the third-party dependencies, the customer-facing channels, the payment systems, and the operational processes that together deliver the IBS. Regulators expect end-to-end testing.

**4. DORA contract requirements not embedded.**
ICT provider contracts signed or renewed after January 2025 must include DORA-mandated clauses. Procurement teams and legal functions that are not aware of DORA contract requirements may fail to include them in new contracts.

**5. Treating DORA and GDPR incident reporting as separate processes.**
A cyber incident affecting personal data triggers both DORA's reporting chain (4h/72h/1m) and GDPR's 72-hour notification to the supervisory authority. These processes must be coordinated — with a single incident management team making coordinated notifications to multiple regulators rather than two separate teams making uncoordinated notifications.

---

## Exam Angle

**CISM:**
- Domain 4 (Incident Management) — regulatory incident reporting obligations (DORA, NIS2, GDPR) are an increasingly important component of incident management for financial services and critical infrastructure GRC professionals.

**CRISC:**
- Domain 3 (Risk Response) — operational resilience regulation imposes specific risk response requirements on regulated entities. The impact tolerance concept is a risk-proportionate response to operational disruption risk.

**CISSP:**
- Domain 1 (Security and Risk Management) — regulatory compliance is a core domain. Understanding DORA and NIS2 as they apply to information security management is increasingly relevant globally.

**ISO 27001 Lead Auditor:**
- Auditors working with financial services clients must understand how ISO 27001 relates to the FCA/PRA operational resilience framework and DORA. ISO 27001 provides evidence for many DORA ICT risk management requirements but does not fully substitute for DORA compliance (e.g. DORA-specific contract clauses, TLPT, incident reporting).

---

## GUARDIAN's Take

Operational resilience regulation represents the maturation of regulatory expectations around continuity — from "show us your BCP" to "prove you can continue to deliver important services within limits that protect the people who depend on you."

The shift is profound. Impact tolerances set by UK financial regulators are, in effect, service level commitments to society — public statements by financial institutions that they will not disrupt critical financial services for more than a defined period. They are tested, monitored, and enforced. When a firm cannot meet its impact tolerances, that is a regulatory finding — not just an internal management issue.

DORA extends this model across the EU and brings it to the ICT providers that underpin financial services. Cloud providers, payment processors, and data providers whose services are critical to financial stability now face direct regulatory oversight of their resilience capabilities. This is a seismic change in the governance landscape for technology companies that serve the financial sector.

For GRC professionals, the message is clear: resilience is no longer a programme you run for internal assurance. It is a capability you demonstrate to external stakeholders — customers, investors, and regulators — who have legitimate interests in whether you can actually deliver when disruption comes.

Build the capability. Set honest tolerances. Test rigorously. Report transparently. That is the operational resilience standard regulators and society expect.

---
*Module: Module 8 — Business Continuity | Guardian Curriculum*
