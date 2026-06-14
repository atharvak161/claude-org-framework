---
tags: [guardian, grc, module-11, third-party-risk, tprm, supply-chain, vendor-risk, due-diligence]
module: 11
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-25
guardian-refs: ["G1-08 — GRC Frameworks Overview", "G4-01 — Organisational Controls A.5.19–A.5.22", "G5-04 — Data Controller vs Data Processor", "G6-01 — PCI DSS Req 12.8", "G7-04 — SOC 2", "G11-02 — Due Diligence and Supplier Assessment", "G11-03 — Contractual Security Requirements"]
---

# G11-01 — Third-Party Risk Management Framework

> [!abstract] What This Note Covers
> By the end of this note, you will understand what third-party risk management is, why supply chain risk has become one of the most significant areas of GRC practice, how to build a TPRM programme from initial inventory through tiering, assessment, monitoring, and exit, and how TPRM connects to ISO 27001, GDPR, PCI DSS, and DORA requirements.

---

## Why This Exists

On 8 December 2020, SolarWinds disclosed that its Orion software update mechanism had been compromised — malicious code inserted into software updates distributed to approximately 18,000 customers, including US government agencies, major corporations, and critical infrastructure operators. The attack persisted for months before discovery. The attackers were inside the networks of the US Treasury, Homeland Security, and dozens of Fortune 500 companies — all through a single trusted software supplier.

The SolarWinds breach was not an isolated event. It was a demonstration of a principle that GRC professionals must internalise: **an organisation's security posture is only as strong as its weakest supplier**. When a supplier with privileged access to critical systems is compromised, the attacker inherits all of that access without having to overcome the organisation's own defences.

Third-party risk management (TPRM) — the systematic identification, assessment, and management of risks arising from relationships with external parties — has become one of the most important and most demanding areas of GRC practice. This module covers the complete TPRM lifecycle.

---

## What Is Third-Party Risk?

Third-party risk is risk arising from the organisation's relationships with external parties — suppliers, service providers, contractors, partners, and any other entities that have access to the organisation's data, systems, or facilities, or that provide services the organisation depends on.

**Why third-party risk is distinct from other risks:**

*The access problem*: Third parties are often granted the same or greater access to critical systems as the organisation's own employees — but without the same governance, oversight, and accountability. An HVAC contractor with network access has comparable access to the CDE as a privileged IT administrator.

*The control problem*: The organisation cannot directly control how a supplier operates. It cannot enforce its own security policies on the supplier's employees. It relies on the supplier's own controls — which may be inadequate, poorly implemented, or inconsistently applied.

*The opacity problem*: The organisation rarely has complete visibility into the supplier's security posture. Security questionnaire responses are self-reported. SOC 2 reports cover only the period they describe. ISO 27001 certificates confirm a management system exists but not its effectiveness for every specific control.

*The concentration problem*: When many organisations use the same critical supplier (cloud providers, payment processors, software vendors), a single supplier compromise can affect thousands of customers simultaneously — the supply chain attack multiplier effect.

**Categories of third-party risk:**

*Technology risk*: The supplier provides technology (software, cloud infrastructure, SaaS platforms) that the organisation depends on. Vulnerability in the supplier's systems can create vulnerabilities in the organisation's environment.

*Data risk*: The supplier processes, stores, or transmits the organisation's data (including personal data under GDPR). A breach at the supplier exposes the organisation's data.

*Operational risk*: The organisation depends on the supplier for critical operational functions. Supplier unavailability disrupts operations. (Business continuity and operational resilience — covered in Module 8.)

*Compliance risk*: The supplier's behaviour creates compliance risk for the organisation — a payment processor that does not maintain PCI DSS compliance creates compliance risk for the merchant.

*Concentration risk*: Over-reliance on a single supplier creates vulnerability to that supplier's failure — no alternative, no fallback.

*Sub-processor risk*: The supplier's own suppliers may have access to the organisation's data. A cloud provider's data centre contractor may have physical access to servers holding sensitive data.

---

## The TPRM Lifecycle

A mature TPRM programme manages third-party risk through a continuous lifecycle — not a one-time assessment at onboarding.

### Phase 1: Inventory — Know Your Suppliers

**The foundation**: You cannot manage what you cannot see. The first step in TPRM is building a complete inventory of all third-party relationships.

**Supplier inventory components:**
- Supplier name and primary contact
- Service or product provided
- Access type (network access; data access; physical access; no direct access)
- Data types accessed (personal data; cardholder data; sensitive business data; non-sensitive)
- Systems accessed (list of specific systems or environments)
- Business criticality (what happens if this supplier is unavailable?)
- Contractual relationship (contract in place; expiry date; renewal cycle)

**The shadow IT problem**: The formal supplier inventory maintained by Procurement and IT often misses suppliers onboarded by business units without formal procurement — SaaS tools adopted by marketing, analytics platforms used by finance, collaboration tools adopted during the pandemic. A complete TPRM inventory requires active discovery, not just reviewing the approved vendor list.

**Discovery approaches:**
- Review expense claims and subscriptions for software/service purchases
- Network traffic analysis to identify external services the organisation communicates with
- Business unit interviews to identify tools and services used outside central IT procurement
- Review of credit card purchases for cloud services and SaaS subscriptions

### Phase 2: Tiering — Risk-Based Prioritisation

Not all suppliers warrant the same level of scrutiny. Tiering allocates TPRM resources proportionate to risk.

**Tiering criteria — assess each supplier against:**

| Criterion | High-risk indicators | Low-risk indicators |
|---|---|---|
| Data access | Personal data, financial data, sensitive IP | No data access |
| System access | Direct network access to production systems, CDE, or sensitive infrastructure | No system access |
| Business criticality | Critical to operations; no alternative; long recovery | Non-critical; easily replaced; quick recovery |
| Volume of data | Large volumes of personal data or sensitive data | Minimal data |
| Regulatory sensitivity | Processes data subject to GDPR, PCI DSS, sector regulation | No regulated data |
| Sub-contractor use | Extensive sub-contracting chain | Direct delivery; no sub-contractors |
| Geographic risk | Processes data in jurisdictions with high surveillance risk | EU/UK/US/equivalent |

**Typical tier definitions:**

**Critical (Tier 1)**: Direct network access to production systems OR processes large volumes of sensitive/personal data OR single-source critical operational dependency. These suppliers warrant the most rigorous due diligence, contractual requirements, and ongoing monitoring. Examples: cloud infrastructure providers, payment processors, core managed security services, business-critical SaaS platforms.

**High (Tier 2)**: Access to sensitive data or systems but not critical infrastructure OR significant business dependency but with alternatives available. Annual assessment; security clauses in contracts; monitoring at defined frequency.

**Standard (Tier 3)**: Limited or no data/system access; low business criticality. Baseline assessment at onboarding; periodic review; standard contractual terms.

**Out of scope**: No access to data or systems; purely commercial relationship (e.g. a stationery supplier). No specific security assessment required; standard commercial contract terms sufficient.

**Tiering reviews**: Supplier tiers must be reviewed when the relationship changes — the supplier gains new access, the volume of data processed increases, the supplier becomes more critical to operations. A Standard supplier that gains access to the CDE following a new integration must be re-tiered to Critical.

### Phase 3: Due Diligence — Pre-Engagement Assessment

Before engaging a new supplier (or at defined intervals for existing suppliers), conduct a due diligence assessment proportionate to the tier.

**Assessment scope by tier:**

**Critical tier:**
- Full security questionnaire (detailed, covering all relevant control domains)
- Review of third-party certification evidence (ISO 27001 certificate; SOC 2 Type II report; PCI DSS AOC where relevant)
- Penetration test results (if available)
- References from existing customers
- On-site or remote audit (for the most critical suppliers)
- Sub-processor assessment (who are their critical sub-contractors?)
- Business continuity capability assessment (RTOs; tested BCPs)
- Financial health assessment (insolvency risk; ability to invest in security)

**High tier:**
- Abridged security questionnaire
- Third-party certification evidence requested and reviewed
- Sub-processor disclosure requested
- BCP capability confirmed

**Standard tier:**
- Basic security questionnaire or self-assessment
- Certification evidence requested (not mandatory)

**Assessment methods:**

*Security questionnaire*: A structured set of questions covering the security domains relevant to the relationship. Standard frameworks include: Shared Assessments SIG (Standardised Information Gathering questionnaire); CAIQ (Cloud Security Alliance Consensus Assessment Initiative Questionnaire); VSAQ (Vendor Security Assessment Questionnaire). For most organisations, a custom questionnaire tailored to the specific risks of the relationship is most effective.

*Third-party evidence*: ISO 27001 certificates, SOC 2 reports, PCI DSS AOCs, and penetration test reports provide independent assurance beyond self-reported questionnaire responses. Always verify certificate validity (check the certification body's register) and currency (not expired).

*On-site/remote assessment*: For critical suppliers, a direct assessment by the organisation or a specialist third party — reviewing evidence, interviewing staff, observing controls. This is the most reliable assurance mechanism but also the most resource-intensive.

### Phase 4: Contractual Controls — Setting Obligations

Assessment identifies risks. Contracts allocate obligations. Every supplier relationship must have contractual security requirements proportionate to the tier and the risk.

(Full coverage in G11-03 — Contractual Security Requirements.)

**Minimum contractual requirements for all tiers with data access:**
- Confidentiality/non-disclosure obligations
- Compliance with the organisation's security policies (by reference)
- Incident notification obligations (what, how, when)
- Right to audit the supplier's security practices
- Data return and deletion on contract termination

**Additional requirements for Critical tier:**
- Specific security control requirements (encryption standards; access control; logging)
- Sub-processor approval and transparency requirements
- SLA for breach notification (24 hours for significant incidents)
- Regular compliance confirmation (annual certification evidence submission)
- Penetration testing obligations
- Business continuity and DR requirements
- Data Processing Agreement (where personal data is processed — GDPR Article 28 mandatory)

### Phase 5: Ongoing Monitoring — Continuous Risk Management

Supplier security is not static. A supplier assessed as compliant at onboarding may deteriorate over the following months or years. Ongoing monitoring maintains awareness of changes in supplier risk posture.

**Monitoring activities by tier:**

**Critical tier (continuous and annual):**
- Annual security questionnaire refresh or formal reassessment
- Annual third-party certification evidence review (new SOC 2 report; renewed ISO 27001 certificate)
- Continuous monitoring of publicly available threat intelligence (supplier data breaches; CVEs in supplier's products; regulatory enforcement action against the supplier)
- Incident notification tracking (are the supplier's notifications timely and adequate?)
- Commercial monitoring (financial health; ownership changes; M&A that affects the relationship)
- Sub-processor change notifications reviewed and assessed

**High tier (annual):**
- Annual questionnaire refresh
- Certification evidence review
- Incident notification tracking

**Standard tier (biennial or event-triggered):**
- Review every 2 years or when significant changes occur

**Continuous monitoring tools:**
- UpGuard, SecurityScorecard, RiskRecon: Automated continuous monitoring of supplier's internet-facing security posture — exposed vulnerabilities, SSL/TLS configuration, email security, patching cadence. Provides early warning of deteriorating supplier security.
- OSINT monitoring: News monitoring for supplier data breaches, regulatory enforcement, or major incidents
- Dark web monitoring: Whether supplier credentials or data have appeared in breach databases

**The monitoring limitation**: External monitoring tools assess the supplier's visible attack surface — their internet-exposed systems. They do not assess the security of the internal environment where most data processing occurs. External monitoring supplements but does not replace periodic formal reassessment.

### Phase 6: Incident Response — When Things Go Wrong

**Supplier breach notification**: The organisation must have a process for receiving, assessing, and acting on breach notifications from suppliers.

When a Critical or High tier supplier notifies the organisation of a security incident:
1. Assess whether organisational data or systems were affected
2. Determine whether GDPR breach notification obligations are triggered (if personal data affected: 72-hour clock starts when the controller (the organisation) becomes aware)
3. Determine whether PCI DSS incident response obligations are triggered (if card data may be affected: notify acquirer; engage forensic investigation)
4. Assess whether operational impact requires BCP activation
5. Engage with the supplier to understand the full scope and timeline of the incident
6. Document the notification, assessment, and response

**The processor notification gap**: GDPR requires processors to notify controllers "without undue delay." The DPA must specify a concrete timeline (typically 24–48 hours). Many breaches at processors are discovered by the media or by security researchers before the processor has notified its customers. Having clear DPA notification requirements and a monitoring programme for supplier public disclosures reduces this gap.

### Phase 7: Exit — Ending Supplier Relationships Securely

**Why exit management is critical**: When a supplier relationship ends, the supplier still holds — or had access to — organisational data. Without effective exit management, data persists at the former supplier indefinitely, former suppliers retain system access they no longer need, and IP or confidential information remains exposed.

**Exit requirements:**
- Immediate revocation of all network access and credentials
- Data return: Supplier returns all organisational data in a usable format
- Data deletion: Supplier permanently and verifiably deletes all organisational data (certificate of deletion or equivalent)
- Confirmation of sub-processor data deletion (the supplier's own suppliers must also delete)
- Recovery of all organisational assets (hardware, access tokens, physical media)
- Final audit of access logs to confirm all activity has been reviewed
- Off-boarding from all organisational systems and identity providers
- Final account reconciliation and invoice settlement

**Exit evidence**: Maintain evidence of exit activities — access revocation timestamps, data deletion certificates, confirmation emails. This is evidence both for GDPR compliance (demonstrating data has been deleted at the end of the relationship as required by the DPA) and for security (demonstrating former suppliers cannot access systems).

---

## TPRM and Regulatory Frameworks

### ISO 27001 (Annex A Controls A.5.19–A.5.22)

**A.5.19 — Information security in supplier relationships**: Establishes requirements for assessing and managing supplier security risk before, during, and after supplier relationships.

**A.5.20 — Addressing information security within supplier agreements**: Requires security requirements in all supplier contracts where the supplier has access to information or systems.

**A.5.21 — Managing information security in the ICT supply chain**: Addresses supply chain-specific risks — compromised software components, insecure APIs, vulnerable third-party libraries.

**A.5.22 — Monitoring, review and change management of supplier services**: Requires periodic reassessment of critical suppliers and management of supplier changes.

**ISO 27001 audit focus**: Auditors will request the supplier register, examples of completed supplier assessments, evidence of security clauses in contracts, and records of ongoing monitoring.

### GDPR (Article 28 — Controller-Processor Requirements)

All suppliers processing personal data on the organisation's behalf require a **Data Processing Agreement (DPA)**. This is a mandatory legal requirement — not a best practice. Processing without a DPA in place violates GDPR.

GDPR Article 28 specifies mandatory DPA content — covering: processing only on controller instructions; confidentiality obligations; security measures; sub-processor restrictions; data subject rights assistance; breach notification; audit rights; data deletion/return.

**DPA is both a TPRM control and a legal requirement**: The DPA creates contractual obligations on the processor that support risk management; it also satisfies the GDPR accountability principle requirement to demonstrate that appropriate safeguards are in place.

### PCI DSS (Requirement 12.8 — TPSP Management)

PCI DSS requires a formal TPSP (Third-Party Service Provider) programme for all suppliers with access to cardholder data or systems in the CDE:

- Maintain a list of all TPSPs
- Written agreements acknowledging TPSP responsibility for security
- Annual monitoring of TPSP PCI DSS compliance status
- Documentation of which PCI DSS requirements are managed by the TPSP vs the merchant

### DORA (Pillar 4 — ICT Third-Party Risk Management)

DORA imposes extensive ICT TPRM obligations on EU financial entities:
- Pre-engagement due diligence for all ICT providers
- Specific mandatory contractual clauses (detailed in DORA Articles 28–30)
- Concentration risk assessment
- Exit planning for all critical ICT providers
- Register of ICT contractual arrangements
- Critical ICT providers face direct supervisory oversight

### NIS2 (Supply Chain Security — Article 21(2)(d))

NIS2 requires essential and important entities to implement "supply chain security, including security-related aspects concerning the relationships between each entity and its direct suppliers or service providers." This creates a risk-proportionate obligation to assess and manage supplier security in critical infrastructure sectors.

---

## Building the TPRM Programme: Practical Steps

**Step 1: Secure executive sponsorship**
TPRM requires cooperation from Procurement, Legal, IT, and Business Units. Without executive sponsorship, each function optimises for its own objectives (Procurement for cost; IT for functionality; Legal for contract speed) rather than risk management.

**Step 2: Build the supplier inventory**
Start with the approved vendor list. Augment through shadow IT discovery, expense review, and business unit interviews. Target completeness — an inventory that misses 30% of suppliers has 30% of the risk unmanaged.

**Step 3: Tier the inventory**
Apply the tiering criteria consistently. Document the tier rationale for each supplier (particularly for Critical tier escalations or Standard tier downgrades that might be challenged).

**Step 4: Design the assessment programme**
Select or develop questionnaires for each tier. Determine which third-party certifications will be accepted as assurance (SOC 2 Type II; ISO 27001; PCI DSS AOC). Define assessment frequencies.

**Step 5: Embed TPRM in the procurement process**
TPRM controls must be engaged before contracts are signed — not after. The procurement process must include a security gate: security assessment before contract execution; DPA before any personal data is shared.

**Step 6: Develop the monitoring programme**
Define monitoring activities and frequencies by tier. Implement automated monitoring tools for Critical tier. Assign monitoring responsibilities to named individuals.

**Step 7: Integrate with incident response**
Ensure the incident response plan includes scenarios for supplier breaches. Define the process for receiving and acting on supplier breach notifications. Confirm DPA notification timelines are specified and realistic.

**Step 8: Manage exits**
Ensure every contract includes exit provisions. Build exit checklists. Maintain exit records.

---

## Common Mistakes and Failures

**1. No supplier inventory.**
TPRM without a complete supplier inventory is impossible. The most common TPRM failure is the 40% of suppliers nobody knows about.

**2. Tiering based on commercial value, not security risk.**
The £500K enterprise software supplier is treated as Critical (high commercial value) while the small managed security service provider with privileged access to all production systems is treated as Standard (low contract value). Tiering must be based on security risk, not contract size.

**3. Assessment at onboarding only.**
A thorough due diligence assessment at onboarding, never repeated. The supplier's security posture deteriorates; their sub-contractors change; a major breach occurs. The organisation has no current visibility.

**4. Contracts signed before security assessment.**
The commercial team signs the contract. The security team is asked to conduct the assessment afterwards. Findings that would have been deal-breakers or negotiating points are now post-contractual observations with no leverage.

**5. No DPA with processors.**
Processing personal data without a DPA is a GDPR violation. Many organisations have dozens of processors with no DPA in place — the GDPR compliance risk is significant and the remediation effort is substantial.

**6. Accepting questionnaire responses without corroboration.**
"Yes, we have ISO 27001 certification." → Verify: what's the certificate number? What CB issued it? Is it on the UKAS register? Is it in scope for the services we're purchasing? Self-reported questionnaire responses without corroboration are the weakest form of assurance.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- TPRM is assessed through Annex A controls A.5.19–A.5.22. Auditors request: supplier register (complete? tiered?); completed assessments; contract security clauses; monitoring evidence; incident notification records. Common finding: supplier register is incomplete; assessments only conducted at onboarding; no ongoing monitoring for critical suppliers.

**CISM:**
- Domain 3 (Security Programme) — TPRM is a core security programme component. CISMs must understand how to build and govern a supplier risk programme that satisfies regulatory requirements and provides genuine assurance.

**CRISC:**
- Domain 1 (IT Risk Identification) — supplier risk is a significant IT risk category. Domain 3 (Risk Response) — supplier assessment, contractual controls, and monitoring are risk treatment activities.

**CISSP:**
- Domain 1 (Security and Risk Management) — third-party risk management, supply chain security, and vendor assessment are examinable. Know the TPRM lifecycle and key regulatory requirements.

---

## GUARDIAN's Take

The SolarWinds attack was a watershed moment for TPRM — not because it revealed a new type of risk, but because it demonstrated the scale of that risk at a level that could no longer be dismissed.

The HVAC contractor whose credentials were used to access Target's network in 2013, the SolarWinds software update mechanism compromised in 2020, the MOVEit transfer tool exploited in 2023 affecting hundreds of organisations — these are not isolated incidents. They are examples of a consistent pattern: attackers find the weakest link in the supply chain, compromise it, and use that access to reach their real target.

The uncomfortable truth for GRC professionals: the organisation's security programme cannot be assessed in isolation from its supplier relationships. An organisation with a mature ISO 27001 ISMS, a zero-trust network architecture, and a world-class internal security team may still be comprehensively breached through a trusted supplier with access to its most critical systems.

TPRM is not optional. It is not a compliance exercise. It is a fundamental component of the organisation's security programme — and it requires the same rigour, the same investment, and the same continuous attention as every other component.

Know your suppliers. Tier them honestly. Assess them thoroughly. Monitor them continuously. And plan for the day one of them is compromised — because that day will come.

---
*Module: Module 11 — Third Party and Supply Chain | Guardian Curriculum*
