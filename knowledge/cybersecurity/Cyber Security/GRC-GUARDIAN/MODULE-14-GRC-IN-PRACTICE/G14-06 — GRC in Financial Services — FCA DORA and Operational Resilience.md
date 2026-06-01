---
tags: [guardian, grc, module-14, financial-services, fca, dora, operational-resilience, uk-regulation]
module: 14
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: advanced
date: 2026-04-28
guardian-refs: ["G8-06 — Operational Resilience and Regulatory Expectations", "G11-03 — Contractual Security Requirements", "G7-02 — NIST CSF 2.0", "G5-02 — GDPR", "G14-02 — Communicating Risk to the Board"]
---

# G14-06 — GRC in Financial Services — FCA, DORA, and Operational Resilience

> [!abstract] What This Note Covers
> By the end of this note, you will understand the GRC landscape specific to UK and EU financial services — the FCA/PRA operational resilience framework, DORA requirements and their UK impact, SYSC obligations, the Senior Managers and Certification Regime (SM&CR), and how these requirements shape the GRC function in financial services organisations.

---

## Why Financial Services GRC Is Different

Financial services is the most heavily regulated sector for information security and operational resilience. A GRC professional working in UK or EU financial services must satisfy not just the generic requirements (ISO 27001; GDPR) but a dense and specific regulatory framework:

- FCA SYSC (Systems and Controls rules)
- PRA Supervisory Statements on operational resilience
- Bank of England operational resilience policy
- DORA (Digital Operational Resilience Act — EU, with UK impact)
- FCA/PRA SM&CR (Senior Managers and Certification Regime)
- Sector-specific data requirements (client money; market data; financial records)
- Payment services regulation (PSR; PSD2/PSR2)

Understanding this regulatory landscape — what each requirement demands, how they interact, and how they connect to the core GRC frameworks — is essential for any GRC professional entering financial services.

---

## The UK Operational Resilience Framework

### Background and Timeline

In March 2021, the Bank of England, PRA, and FCA jointly published operational resilience policy — coming into force 31 March 2022. The transition period for full self-assessment to impact tolerances ran to **31 March 2025**.

**As of April 2026**, the transition period has ended. Firms must now:
- Have identified Important Business Services (IBS)
- Have set Impact Tolerances for each IBS
- Be able to demonstrate they can remain within those tolerances in severe but plausible disruption scenarios
- Have submitted self-assessments to their supervisor (PRA/FCA)

Firms that cannot meet their own impact tolerances must have credible, funded remediation plans.

### Important Business Services (IBS)

An IBS is a service provided to external end-users (retail customers, institutional clients, the market) whose disruption could cause intolerable harm to consumers, market integrity, or financial stability.

**Determining IBS**:
- Services that if disrupted for any duration would cause harm — access to money; payment processing; custody of assets; market making
- The test is harm to the recipient, not importance to the firm
- Typically 5–15 IBS for large firms; 2–8 for smaller firms

**IBS examples by firm type**:

*Retail bank*: Current account access; payment processing; mortgage arrears management; fraud management; savings account access.

*Asset manager*: Portfolio management; order execution; fund NAV calculation; investor reporting; custody instruction processing.

*Insurance firm*: Claims processing; policy administration; underwriting; premium collection.

*Payments firm*: Payment initiation; payment clearing; account maintenance.

### Impact Tolerances

**Definition**: The maximum tolerable level of disruption to each IBS — expressed as a time threshold beyond which the disruption would cause intolerable harm.

**Setting impact tolerances**:
- What harm occurs if the IBS is unavailable for 1 hour? 4 hours? 24 hours? 72 hours?
- At what point does the harm become intolerable — to consumers, to markets, to financial stability?
- Consider: cumulative effect (many firms simultaneously); consumer vulnerability; regulatory deadlines; market settlement cycles

**Impact tolerance level**: Firms must set tolerances that reflect the maximum harm they can tolerate — not what their current systems can achieve. If current systems can recover in 8 hours but the actual tolerable disruption is 4 hours, the tolerance is 4 hours and the gap must be remediated.

**Regulatory scrutiny of tolerances**: Supervisors have challenged firms where tolerances appear to be set to match current capability rather than actual harm thresholds. The FCA expects tolerances that are genuinely challenging — not ones that are already achieved.

### Demonstrating Tolerance Compliance

Firms must be able to demonstrate — to themselves and their supervisor — that they can remain within their impact tolerances through:

**Mapping**: For each IBS, map the complete end-to-end service delivery — all people, processes, technology, and third parties involved. Identify vulnerabilities (single points of failure; concentration risks; untested dependencies).

**Scenario testing**: Test the ability to remain within tolerances using severe but plausible scenarios:
- Cyberattack causing system unavailability
- Loss of a critical third-party provider
- Mass staff absence (pandemic-like)
- Loss of a critical office location
- Loss of a critical data centre

**Self-assessment**: A formal documented self-assessment of the firm's ability to remain within each tolerance, identifying gaps and remediation plans.

**Supervisory submission**: Firms submit self-assessments to supervisors (PRA/FCA) on request. The regulators review these for credibility and challenge where tolerances or scenario testing appear inadequate.

---

## SYSC (Systems and Controls)

**SYSC (Systems and Controls)** is the FCA's core operational requirements sourcebook. It sets the overarching organisational and operational requirements for FCA-regulated firms.

### Key SYSC Requirements for GRC

**SYSC 4 (General organisational requirements)**:
- Firms must have robust governance arrangements including clear organisational structures, effective processes for managing risks, adequate internal control mechanisms, and sound administrative and accounting procedures.
- Senior management responsibility for all systems and controls.

**SYSC 7 (Risk control)**:
- Firms must establish, implement, and maintain adequate risk management policies and procedures.
- Risk management must be independent of business units taking risk.
- Regular stress testing and scenario analysis.

**SYSC 13 (Operational risk)**:
- Firms must maintain appropriate IT systems with adequate business continuity plans.
- Operational risk management processes must be documented and tested.
- The SYSC 13 operational risk requirements effectively require what ISO 22301 and ISO 27001 together provide — though certification is not mandatory.

**SYSC 15A (Operational resilience)**:
- The specific rules implementing the joint PRA/FCA operational resilience policy.
- IBS identification; impact tolerance setting; scenario testing; self-assessment; remediation of gaps.

### How SYSC Interacts with ISO 27001

ISO 27001 certification satisfies many SYSC information security requirements — but not all:

**ISO 27001 satisfies**:
- Information security risk management
- Security controls framework
- Incident management
- Policy framework
- Internal audit and management review

**SYSC/operational resilience requirements beyond ISO 27001**:
- IBS identification and impact tolerance setting (ISO 27001 does not require this level of granularity)
- End-to-end service mapping (ISO 27001 does not require business service mapping)
- Regulatory self-assessment and supervisory submission
- Critical third-party regime (CTP) engagement obligations

**The integrated programme approach**: Firms that have implemented ISO 27001 have a strong foundation for SYSC compliance. The additional investment is primarily in:
- Operational resilience programme (IBS; tolerances; scenario testing)
- Regulatory engagement capability
- Board-level governance at the depth regulators expect

---

## SM&CR: Senior Managers and Certification Regime

**SM&CR** (Senior Managers and Certification Regime) is the FCA/PRA framework for individual accountability in financial services. It replaced the APER (Approved Persons) regime from 2016 (banks) and 2019 (all FCA firms).

### Relevance to GRC

**Chief Risk Officer (CRO) and CISO roles**: Under SM&CR, certain roles (including Chief Risk Officer for banks and insurers) are designated as **Senior Management Functions (SMFs)** — requiring individual FCA/PRA approval. The CISO may be an SMF or may be a **Certified Function** (requiring the firm to certify the individual's fitness and propriety annually).

**Conduct Rules**: SM&CR imposes conduct rules on all staff, including security and GRC professionals:
- Rule 1: Act with integrity
- Rule 2: Act with due skill, care, and diligence
- Rule 3: Be open and cooperative with the FCA, PRA, and other regulators
- Rule 4: Pay due regard to customers' interests
- Rule 5: Observe proper standards of market conduct

For GRC professionals, Rules 1, 2, and 3 are directly relevant — including the obligation to be open and cooperative with regulators (which includes timely, accurate regulatory notifications following incidents).

**Responsibility mapping**: Under SM&CR, senior managers must have clear, documented responsibilities. For the CISO or Head of GRC, these responsibilities must be documented in Statements of Responsibilities and Responsibilities Maps. These documents cannot be vague — regulators hold senior managers personally accountable.

**Regulatory investigation exposure**: When things go wrong in a regulated firm, SM&CR enables regulators to hold individual senior managers accountable — not just the firm. A CISO who failed to implement adequate controls, failed to escalate significant risks, or failed to make required regulatory notifications can face personal enforcement action.

**GRC implication**: In financial services, the CISO and Head of GRC roles carry personal regulatory accountability that does not exist in unregulated sectors. The professional standards, documentation discipline, and regulatory communication practices are not just good practice — they are personal professional obligations.

---

## DORA: Digital Operational Resilience Act

**DORA** (EU Regulation 2022/2554) applies from **17 January 2025** to financial entities in the EU and their ICT third-party service providers. Module 8 (G8-06) covers DORA in depth; this section focuses on the GRC programme implications.

### Who DORA Affects in the UK

DORA is EU law — it does not directly apply to UK-only entities. However:

**UK firms with EU operations**: Any UK firm operating in EU member states (through a branch, subsidiary, or FCA-authorised EU entity) must comply with DORA for its EU operations.

**UK ICT service providers with EU financial clients**: If a UK-based cloud provider, managed service provider, or SaaS vendor provides services to EU financial entities, DORA may designate them as critical ICT third-party service providers (CTPPs) subject to direct EU supervisory oversight.

**UK regulatory convergence**: The FCA and PRA are expected to introduce UK-equivalent DORA provisions — the FCA's critical third-party (CTP) regime and operational resilience framework are already moving in the same direction.

### DORA's Five Pillars in Practice

**GRC programme implications for each pillar:**

**Pillar 1 (ICT Risk Management)**: The DORA ICT risk management framework requires a documented ICT risk management framework approved by the management body. This goes beyond ISO 27001 in requiring:
- A complete ICT asset register
- Classification of ICT assets by criticality
- Regular testing of ICT risk controls
- Board-level accountability for ICT risk management

*GRC action*: Produce a DORA-compliant ICT risk management framework document; link to ISO 27001 ISMS where controls overlap; add DORA-specific requirements where they exceed ISO 27001.

**Pillar 2 (Incident Management)**: DORA requires a formal ICT incident management process with specific classification criteria and reporting timelines (4h/72h/1m). 

*GRC action*: Review existing incident response plans for DORA classification criteria; implement DORA reporting timelines; establish the operational reporting mechanism to competent authorities.

**Pillar 3 (Testing)**: DORA requires annual basic testing and TLPT (Threat-Led Penetration Testing) every 3 years for significant entities.

*GRC action*: Map existing testing programme against DORA requirements; assess whether TLPT designation applies; plan TLPT engagement if required.

**Pillar 4 (Third-Party Risk)**: DORA imposes extensive TPRM requirements — due diligence; mandatory contract clauses; concentration risk assessment; exit planning; ICT TPSP register.

*GRC action*: Review all ICT provider contracts for DORA-mandatory clauses; build the ICT TPSP register; assess concentration risk; develop exit strategies for critical ICT providers.

**Pillar 5 (Information Sharing)**: Voluntary — encourage participation in threat intelligence sharing with peers and supervisors. No mandatory GRC programme action but good practice to join relevant ISACs.

---

## The Financial Services GRC Programme: Integrated View

A GRC programme in a UK financial services firm must integrate all of the following in a coherent framework:

```
BOARD-LEVEL GOVERNANCE
├── SM&CR responsibilities mapping (personal accountability)
├── Operational resilience governance (IBS; tolerances; self-assessment)
├── FCA/PRA regulatory engagement
└── ISO 27001 management review

RISK MANAGEMENT
├── Enterprise risk (SYSC 7)
├── Operational risk (SYSC 13)
├── ICT risk (DORA Pillar 1)
├── Information security risk (ISO 27001)
└── Third-party/concentration risk

COMPLIANCE
├── SYSC compliance (FCA)
├── Operational resilience (FCA/PRA)
├── DORA (EU operations)
├── GDPR/UK GDPR (data protection)
├── PCI DSS (if payment processing)
└── ISO 27001 (certification)

INCIDENT MANAGEMENT
├── DORA reporting (4h/72h/1m for EU operations)
├── GDPR breach notification (72h ICO; data subject notification)
├── FCA/PRA material incident notification
└── Internal incident management

THIRD-PARTY RISK
├── DORA ICT TPSP management (EU)
├── FCA CTP regime (UK)
├── ISO 27001 A.5.19-22 (supplier security)
└── GDPR Article 28 DPA
```

**The integration challenge**: These frameworks are not identical. DORA incident reporting timelines (4h initial notification) are different from GDPR (72h breach notification) and FCA/PRA material notification requirements. A significant ICT incident may trigger all three simultaneously — requiring coordinated notifications to three different regulators within different timeframes.

The GRC programme must map these overlapping obligations and build a single incident notification process that satisfies all of them — rather than managing three separate processes that may produce inconsistent regulatory communications.

---

## Regulatory Relationship Management

A unique feature of financial services GRC is the ongoing relationship with prudential and conduct regulators (FCA; PRA; Bank of England).

**Supervisory engagement principles:**

*Proactive disclosure*: Regulators expect firms to proactively notify them of significant events — not wait to be discovered. A firm that discloses a significant ICT incident before the regulator discovers it through other means is treated more favourably than one that is reactive.

*Accuracy over speed*: Better to submit an initial notification with accurate but incomplete information (and supplement it) than to rush a complete notification with inaccurate information. The regulatory 72-hour clock permits partial submissions.

*Cooperation*: SM&CR Conduct Rule 3 requires open cooperation with regulators. GRC professionals who manage regulatory relationships must be transparent, accurate, and responsive — even when the information is uncomfortable.

*Regulatory visits and assessments*: Regulators conduct operational resilience assessments — desk-based reviews of self-assessments; deep-dive assessments of specific IBS; stress scenario discussions. GRC teams must be prepared to present the evidence of operational resilience capability credibly and in depth.

**The GRC team's regulatory liaison role**: In larger firms, the GRC team typically manages the regulatory liaison function for operational resilience and cybersecurity matters — coordinating regulatory notifications, preparing for supervisory visits, and maintaining the self-assessment documentation that regulators review.

---

## Common Financial Services GRC Mistakes

**1. Treating ISO 27001 as sufficient for all regulatory obligations.**
ISO 27001 is a strong foundation — but SYSC, DORA, and the operational resilience framework all impose requirements beyond ISO 27001. The GRC programme must address all layers.

**2. Impact tolerances set to match current capability.**
Setting tolerances of "72 hours" when the actual tolerable disruption for a retail current account service is "4 hours" — because 72 hours is what the current infrastructure can achieve. Regulators challenge this as inadequate.

**3. SM&CR responsibility mapping not current.**
The Responsibilities Map and Statements of Responsibilities are regulatory documents. When the CISO changes, when responsibilities shift, or when the firm's activities change — these documents must be updated. An outdated map creates regulatory risk.

**4. DORA contract compliance not completed.**
ICT provider contracts signed before January 2025 may not contain DORA-mandatory clauses. Firms must review and update all material ICT provider contracts for DORA compliance — a significant contractual programme.

**5. Regulatory notifications not coordinated.**
An ICT incident triggers DORA notification, GDPR notification, and FCA/PRA notification — handled by three separate teams who produce inconsistent regulatory submissions. Regulators compare submissions across regulatory bodies; inconsistencies create credibility problems.

---

## GUARDIAN's Take

Financial services GRC is the most demanding GRC environment — not because the frameworks are more complex than in other sectors, but because the consequences of failure are more severe. SM&CR creates personal regulatory accountability. Operational resilience requirements are validated by external supervisors. DORA imposes cross-border obligations that require EU-level regulatory coordination.

The reward is equivalent: financial services GRC roles are among the best-compensated and most professionally demanding GRC positions available. The discipline of building and maintaining GRC programmes that satisfy both internal governance expectations and external regulatory scrutiny — and that can withstand supervisor review — is the professional achievement that defines senior financial services GRC careers.

For a GRC professional building toward this sector: the GUARDIAN curriculum gives you the frameworks. Financial services regulatory expertise comes from direct exposure — reading FCA/PRA publications; attending regulatory briefings; working with experienced practitioners. Layer the regulatory expertise onto the framework foundation this curriculum has built.

---
*Module: Module 14 — GRC in Practice | Guardian Curriculum*
