---
tags: [guardian, grc, module-2, risk-management, crisc, it-risk-identification, risk-scenarios, threat-modelling]
module: 2
cert-coverage: [crisc, iso27001-la, cism, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G2-01 — What is Risk", "G2-03 — Risk Assessment Methodologies", "G2-05 — The Risk Register", "G2-08 — Enterprise Risk Management", "G2-10 — CRISC Domain 2 — IT Risk Assessment"]
---

# G2-09 — CRISC Domain 1 — IT Risk Identification

> [!abstract] What This Note Covers
> By the end of this note, you will understand CRISC Domain 1 in full — what IT risk identification means at the CRISC level, the key concepts tested, how IT risk is identified in the context of enterprise objectives, and how to think like a CRISC candidate when approaching risk identification scenarios.

---

## Why This Exists

CRISC — Certified in Risk and Information Systems Control — is ISACA's flagship certification for IT risk professionals. It is one of the most respected GRC certifications in the world, held by risk managers, IT auditors, compliance professionals, and CISOs. Unlike CISM (which tests security governance at a strategic level) or CISSP (which tests security knowledge across all domains), CRISC is intensely focused on one discipline: IT risk management.

Domain 1 of CRISC — IT Risk Identification — is the foundation. Before you can assess, treat, or monitor risk, you must be able to identify it comprehensively, systematically, and in the right organisational context. The exam tests not just whether you know what risk identification is, but whether you understand *why* it is done, *how* it connects to enterprise objectives, and *what* a mature identification programme looks like in practice.

This note maps CRISC Domain 1 fully — both as an exam preparation resource and as a practical guide to building enterprise-grade IT risk identification capability.

---

## CRISC Domain 1 Overview

**Domain weight in the CRISC exam**: approximately 26% of total marks (the largest single domain).

**Core question the domain answers**: How do IT risk professionals systematically identify all relevant IT risks, in the context of the organisation's objectives and risk environment, and document them in a way that enables assessment, treatment, and monitoring?

**Domain 1 key topic areas (CRISC Review Manual):**

1. IT risk capacity, appetite, and tolerance
2. Business and IT alignment
3. IT risk universe and risk scenarios
4. Risk factors and risk environment
5. Risk identification methods and techniques
6. Risk ownership and accountability
7. Risk culture and risk awareness
8. Emerging risks and threat intelligence

---

## Concept 1: IT Risk in the Context of Enterprise Objectives

The single most important CRISC Domain 1 concept: **IT risk does not exist in isolation. It exists in the context of enterprise objectives.**

A CRISC candidate must always ask: "What business objective is threatened by this IT risk?" Risk identification is not a purely technical exercise — it starts with understanding what the organisation is trying to achieve and what IT risks could prevent, delay, or degrade that achievement.

ISACA's definition of IT risk: *"The business risk associated with the use, ownership, operation, involvement, influence, and adoption of IT within an enterprise."*

Note the emphasis on *business risk*. An unpatched server is not a risk statement. The risk is: "Failure to patch internet-facing servers creates a business risk of successful exploitation by ransomware operators, which could disrupt order fulfilment operations for an estimated 5–10 days, causing breach of customer SLA commitments and loss of an estimated £1.2M in revenue."

**Three categories of IT risk (CRISC framework):**

| Category | Definition | Examples |
|---|---|---|
| **IT benefit/value enablement risk** | Risk that IT will fail to deliver the expected business value | Failed ERP implementation; cloud migration that reduces rather than improves agility |
| **IT programme and project delivery risk** | Risk that IT projects will fail to deliver on time, on budget, or to specification | System integration failures; scope creep; vendor dependency |
| **IT operations and service delivery risk** | Risk that IT will fail to maintain reliable, secure services | Ransomware; data breach; unplanned downtime; third-party failure |

Most information security risk sits in category 3. But CRISC candidates must understand all three — particularly category 1, which is often neglected by security-focused professionals. The risk that a poor technology decision destroys value is just as real as the risk that an attacker destroys data.

---

## Concept 2: Risk Capacity, Appetite, and Tolerance (CRISC Definitions)

CRISC applies precise definitions to these three concepts (see also G2-02). From the CRISC perspective, all three must be explicitly defined *before* risk identification begins — they form the criteria against which identified risks are evaluated.

**Risk capacity**: The maximum amount of risk the enterprise can absorb while still meeting its objectives. Determined by financial strength, regulatory constraints, operational resilience, and reputational buffer. Risk capacity is set externally by the environment — it is not a choice, it is a constraint.

**Risk appetite**: The amount and type of risk the enterprise is willing to accept in pursuit of its objectives. Set by the board. Risk appetite is a *choice* made within the boundaries of risk capacity.

**Risk tolerance**: The acceptable variation around the risk appetite — the operational boundaries within which management makes risk decisions. Risk tolerance is more granular than appetite: it defines specific thresholds for specific risk categories.

**CRISC exam application**: When a scenario describes a board that has set a risk appetite but the IT organisation is accepting risks significantly above it, the CRISC candidate identifies this as a risk tolerance breach requiring escalation — not a reason to modify the appetite.

---

## Concept 3: The IT Risk Universe

The **IT risk universe** is the complete set of potential IT risks relevant to a given organisation. It is the starting point for risk identification — the landscape within which specific risks are found.

CRISC describes the IT risk universe as comprising:

**Risk domains**: Broad categories of IT risk that any organisation may face:
- Information security and cybersecurity
- IT operations and availability
- IT programme and project delivery
- Data management and privacy
- IT governance and compliance
- Third-party and supply chain
- Emerging technology (AI, cloud, IoT)

**Risk scenarios**: Specific, plausible narratives of how risk events could unfold within each domain. Risk scenarios are the primary tool for identifying and documenting IT risk at the CRISC level.

---

## Concept 4: Risk Scenarios — The Core Tool

A **risk scenario** is a description of a plausible risk event — including its cause, the IT asset or process affected, and the business consequence. Risk scenarios are more detailed than simple risk statements — they describe *how* a risk could unfold, not just *what* could happen.

CRISC uses risk scenarios as the primary risk identification and communication tool because:
- They are accessible to business stakeholders (not just technical specialists)
- They bridge IT risk and business impact
- They enable realistic likelihood and impact assessment
- They facilitate risk-based control selection

**ISACA/CRISC Risk Scenario Structure:**

| Component | Description |
|---|---|
| **Actor** | Who or what initiates the event (internal actor, external actor, natural event, technical failure) |
| **Threat type** | Malicious, accidental, or failure event |
| **Event** | What happens (disclosure, modification, theft, destruction, interruption) |
| **Asset / Resource** | What IT asset or business process is affected |
| **Time** | Duration and timing implications |
| **Business consequence** | The impact on business objectives |

**Example risk scenario (full CRISC format):**

*"An external cybercriminal (actor) uses a phishing campaign to obtain valid credentials (threat type: malicious) and deploys ransomware that encrypts (event) the organisation's ERP database and file servers (asset). The encryption renders core business systems unavailable for an estimated 5–7 days (time), causing inability to process customer orders, breach of SLA commitments with three major clients, and potential regulatory notification under GDPR if customer data is confirmed exfiltrated (business consequence)."*

This is fundamentally different from "ransomware risk — High." It is specific enough to assess, treat, and communicate to the board.

**CRISC risk scenario categories:**

ISACA provides a generic risk scenario catalogue as a reference — not an exhaustive list, but a starting point for identification workshops. Categories include:

| Scenario category | Examples |
|---|---|
| Malicious code / software | Ransomware, trojans, spyware, worms |
| Hacking / intrusion | Credential theft, SQL injection, API exploitation |
| Denial of service | DDoS, resource exhaustion |
| Insider abuse | Data theft, sabotage, fraud |
| Social engineering | Phishing, vishing, pretexting |
| Third-party failure | Supplier breach, cloud outage, SLA failure |
| System or software failure | Hardware failure, software bug, configuration error |
| Natural disaster | Flood, fire, power failure, extreme weather |
| Data privacy violation | Unauthorised disclosure, data subject rights failures |
| IT project failure | Failed implementation, cost overrun, delayed delivery |

---

## Concept 5: Risk Factors

**Risk factors** are conditions that influence the likelihood and/or impact of a risk event. CRISC candidates must be able to identify risk factors as part of the risk identification process — they are the environmental context that modulates raw risk levels.

**Two categories of risk factor:**

**Vulnerability-related risk factors** (affect likelihood):
- Complexity of the IT environment (more complex = more attack surface)
- Technology currency (older/unsupported systems = higher vulnerability)
- Security control maturity (immature controls = higher exploitability)
- Staff security awareness levels
- Supplier security posture
- Network connectivity and exposure

**Threat-related risk factors** (affect likelihood):
- Geopolitical environment (nation-state threat level for the organisation's sector/geography)
- Industry threat landscape (is the sector actively targeted?)
- Adversary capability and motivation (financially motivated criminals vs state actors)
- Recent threat intelligence (active exploitation of specific technologies in use)

**Impact-related risk factors** (affect impact magnitude):
- Asset criticality (crown jewels vs peripheral systems)
- Data sensitivity (personal data, financial data, IP)
- Business dependency on affected systems
- Regulatory exposure (is this asset in scope for GDPR, PCI DSS?)
- Recovery capability (backup maturity, DR readiness)
- Contractual obligations (SLA breach exposure)

**CRISC exam application**: Scenario questions will describe an environment and ask what risk factors should be considered. Candidates must identify both vulnerability/threat factors (affecting likelihood) and impact factors (affecting consequence) — not just technical vulnerabilities.

---

## Concept 6: Risk Identification Methods

CRISC Domain 1 tests knowledge of multiple risk identification techniques. A mature risk identification programme uses several in combination:

**1. Risk Assessment Workshops**
Facilitated sessions with business unit leaders, IT managers, process owners, and subject matter experts. The most important technique — it surfaces organisational knowledge that no scan or framework can capture. Key skills: facilitation, asking the right questions, translating technical concerns into business risk language.

**2. IT Risk Scenario Analysis**
Using the CRISC risk scenario catalogue (or equivalent) as a structured prompt to identify whether each generic scenario is relevant to the organisation. Ensures comprehensive coverage — gaps are less likely when working from a structured catalogue.

**3. Threat Intelligence Review**
Analysing current threat intelligence (NCSC advisories, sector-specific ISACs, commercial feeds) to identify active threats targeting the organisation's technology, sector, or geography. Grounds risk identification in realistic rather than hypothetical threats.

**4. Vulnerability Assessment and Penetration Testing**
Technical identification of exploitable weaknesses. Feeds specific vulnerability data into risk scenarios — elevating generic scenario risks to confirmed, specific risks.

**5. Process Analysis and Walk-Throughs**
Walking through key business processes to identify IT dependencies, control gaps, and failure points. Particularly valuable for identifying IT programme and project delivery risks and IT benefit/value risks.

**6. Incident Review**
Analysing historical incidents (internal and industry) to identify recurring risk patterns. Incidents reveal risks that the theoretical identification process may have missed. "What actually happened last year?" is often more instructive than "what could happen?"

**7. Audit Findings**
Internal and external audit findings represent confirmed control gaps — actual vulnerabilities that have been independently verified. All significant audit findings should be captured as risks in the risk register.

**8. Control Self-Assessment (CSA)**
Business units assess the effectiveness of their own controls against a defined standard. Surfaces risks that the central IS function may not be aware of. Builds risk ownership at the first line.

**9. Regulatory and Legal Review**
New regulations, court decisions, and regulatory guidance create new compliance risks. Regular review of the regulatory horizon is essential for comprehensive risk identification.

**10. Emerging Technology Review**
As the organisation adopts new technologies (AI, IoT, cloud, quantum computing), new risk categories emerge that may not appear in existing risk catalogues. Regular horizon-scanning for technology-driven risks.

---

## Concept 7: Risk Ownership and Accountability

CRISC Domain 1 emphasises that risk identification must produce *owned* risks — not a list of unattributed hazards that the security team alone is responsible for.

**Risk owner**: The individual or entity accountable for managing a specific IT risk within acceptable levels. Typically a business process owner or senior manager — the person whose business objectives are threatened by the risk.

**Key CRISC principle**: Risk owners must be at the appropriate level of authority to make risk decisions. The risk owner for a Critical risk threatening core business operations should be a C-level executive or business unit director — not a middle manager or IT staff member.

**Responsibilities of the risk owner (CRISC framework):**
- Understanding the risks in their domain
- Approving risk assessment results for their risks
- Making risk treatment decisions (within their authority level)
- Accepting residual risk (within their authority)
- Ensuring treatment actions are implemented
- Monitoring the risk for changes

**The risk manager vs the risk owner distinction** (critical for CRISC exam):
- The **risk manager** (often CISO or Enterprise Risk Manager) facilitates the process, maintains the register, and provides oversight
- The **risk owner** is accountable for the risk itself and the treatment decisions
- These must not be the same person — the risk manager cannot own the risks they are facilitating and overseeing

---

## Concept 8: Risk Culture and Risk Awareness

CRISC Domain 1 includes risk culture as an identification-enabling concept — because risk identification only works if the organisation has a culture where people feel safe to identify and report risks.

**Risk culture** (ISACA definition): The set of shared values, beliefs, and behaviours regarding risk within an enterprise. A positive risk culture means people proactively identify and report risks rather than hiding them, and risk information flows freely upward to decision-makers.

**Indicators of a strong risk culture:**
- Staff report near-misses and control failures without fear of blame
- Risk identification is not seen as "the security team's job" but as everyone's responsibility
- Management visibly uses risk information in decisions
- Risk reporting does not get sanitised or filtered before reaching the board
- Leaders model risk-aware behaviour (following security policies even when inconvenient)

**Indicators of a weak risk culture:**
- Risks are identified by the security team only — business units do not engage
- Near-misses go unreported because reporting creates accountability
- Risk registers are completed for audit purposes, not for management decision-making
- Leaders bypass security controls when they create friction
- Risk information is filtered or softened before reaching the board

**CRISC exam application**: Scenarios describing a weak risk culture require the candidate to identify cultural change interventions — not just technical or process improvements. A technically perfect risk identification process will fail if the culture does not support honest risk reporting.

---

## Concept 9: Emerging Risks and Threat Intelligence

CRISC Domain 1 explicitly tests candidates on how to identify *emerging* risks — risks that are not yet in the risk register but are developing on the horizon.

**Sources of emerging risk intelligence:**
- NCSC (National Cyber Security Centre) annual threat reports and advisories
- ISACA and FAIR Institute publications
- Industry ISAC (Information Sharing and Analysis Centre) alerts
- Commercial threat intelligence platforms (CrowdStrike, Recorded Future, Mandiant)
- Regulatory publications and consultation papers
- Academic research on emerging attack techniques
- Peer networks and professional associations

**Categories of emerging IT risk:**

| Emerging risk area | Current relevance |
|---|---|
| **AI and machine learning** | Adversarial AI attacks on ML models; AI-generated deepfake fraud; AI-assisted phishing; misuse of AI in business processes creating new data governance risks |
| **Quantum computing** | Long-term threat to current cryptographic algorithms; "harvest now, decrypt later" attacks on current encrypted data |
| **Supply chain attacks** | Increasingly sophisticated attacks on software supply chains (SolarWinds model); open source library compromise (Log4Shell model) |
| **Operational Technology (OT) convergence** | IT/OT network convergence increasing cyber exposure of industrial control systems |
| **Regulatory evolution** | New data protection laws (DORA, NIS2, AI Act, state-level US laws); new regulatory obligations creating compliance risk |
| **Cloud concentration risk** | Dependence on a small number of hyperscale cloud providers; single points of failure at industry scale |

**CRISC exam application**: Candidates must demonstrate that risk identification is not a static, backward-looking exercise. The risk register must reflect the current and anticipated future threat environment — not just historical risks.

---

## The IT Risk Identification Process: End-to-End

Combining all Domain 1 concepts, here is the complete IT risk identification process a CRISC professional designs and oversees:

**Step 1 — Establish context**
Define the IT risk identification scope (systems, processes, locations, third parties). Understand enterprise objectives and the IT risks that could threaten them. Review the current risk capacity, appetite, and tolerance. Confirm the risk scenario framework to be used.

**Step 2 — Identify threats and vulnerabilities**
Use multiple identification methods: workshops, threat intelligence, vulnerability assessments, incident review, audit findings. Map threats to the organisation's specific technology environment and sector.

**Step 3 — Construct risk scenarios**
Translate identified threats and vulnerabilities into formally structured risk scenarios using the CRISC format: actor → threat type → event → asset → time → business consequence.

**Step 4 — Identify risk factors**
For each scenario, identify the risk factors that modulate likelihood and impact: environmental factors, technology factors, threat factors, control factors.

**Step 5 — Assign risk ownership**
For each identified risk, assign a named risk owner at the appropriate level of authority. Ensure ownership is accepted — risk owners must understand and agree to their accountability.

**Step 6 — Document in the risk register**
Capture all identified risks in the risk register with full scenario detail, risk factors, and risk owner. Flag risks requiring immediate escalation (any risk that appears to exceed appetite based on preliminary assessment).

**Step 7 — Validate and review**
Review identified risks with risk owners and subject matter experts. Challenge gaps — are there business processes or technology areas not covered? Is the threat landscape current? Are emerging risks represented?

**Step 8 — Report to stakeholders**
Communicate the results of the identification exercise to the CISO, Security Committee, and (for significant new risks) the board. Include a summary of methodology, coverage, and any immediately escalating risks.

---

## Common Mistakes and Failures

**1. Risk identification driven only by the security team.**
The security team identifies all risks from a technical perspective. Business unit risks, process risks, and IT value/delivery risks are missed entirely. The risk register reflects IT security concerns, not enterprise IT risk.

**2. Using only one identification method.**
Relying on vulnerability scans alone, or on workshops alone. No single method captures all risk categories. Technical methods miss people/process risks; workshops miss technical vulnerabilities; threat intelligence misses internal risk factors.

**3. Identifying risks without connecting to business objectives.**
A list of vulnerabilities — CVEs, misconfigured systems, missing patches — that cannot be connected to business impact. The CISO cannot prioritise treatment because the business impact of each risk is unclear.

**4. Treating the risk universe as static.**
The risk register from last year's assessment is treated as complete. New systems, new suppliers, new regulatory obligations, and new threats are not reflected because nobody has triggered an out-of-cycle identification exercise.

**5. Risk identification without ownership assignment.**
Comprehensive list of risks produced — all owned by "IT Security" or by nobody at all. The list cannot drive accountability or treatment because there is no defined risk owner to approve treatment plans and accept residual risk.

**6. Filtering emerging risks as "too uncertain."**
Risk managers excluding emerging risks (AI risk, quantum risk) because they cannot be precisely assessed. CRISC explicitly requires that emerging risks be identified and tracked, even if assessment is qualitative and uncertain. Document them; flag them for horizon monitoring; do not ignore them because they are uncomfortable.

---

## Exam Angle

**CRISC Domain 1 — specific exam guidance:**

The CRISC exam is scenario-based. Questions present realistic IT risk situations and ask what the candidate should do next, or what the primary concern is. Domain 1 questions test:

- **Risk scenario construction**: Given a description of a threat and environment, can you construct a complete risk scenario?
- **Risk factor identification**: Given a scenario, what risk factors increase or decrease likelihood and impact?
- **Risk owner assignment**: Who should own this risk? (Answer: the business process owner whose objectives are threatened — not the IT team)
- **Identification method selection**: Which identification method is most appropriate for this situation?
- **Emerging risk recognition**: Given a description of a new technology or regulatory development, what IT risks does this create?
- **Risk culture assessment**: Given a scenario describing risk reporting behaviour, does this indicate a strong or weak risk culture? What should be done?

**Key CRISC Domain 1 terminology to know cold:**
- IT risk universe, risk scenario, risk factor, risk capacity, risk appetite, risk tolerance
- Threat actor, threat event, vulnerability, risk event
- IT benefit risk, IT programme risk, IT operations risk
- Risk owner vs risk manager
- Control self-assessment, risk scenario analysis, threat intelligence

**CRISC vs CISM distinction on risk identification:**
- CRISC: granular, process-level; tests how to *do* IT risk identification
- CISM: strategic level; tests how to *design and oversee* a risk identification programme

---

## GUARDIAN's Take

CRISC Domain 1 is where the theoretical understanding of risk meets the practical reality of organisations. And the gap between theory and practice in risk identification is enormous.

The theory: conduct structured workshops, use threat intelligence, build comprehensive risk scenarios, assign clear ownership, document everything, validate with business owners, report to the board.

The reality in most organisations I have worked with: the security analyst runs a vulnerability scan, imports the results into a spreadsheet, and calls it the risk register. Business unit managers do not know they are risk owners. The risk register has no risk scenarios — just lists of CVEs and misconfigured systems. The board has never seen it.

CRISC Domain 1 is essentially a prescription for closing that gap. It tells you not just what risk identification produces, but *how* it should be done to produce results that are useful for business decision-making — not just compliance.

The most important skill the domain tests — one that is genuinely difficult to demonstrate in a multiple-choice format but critical in practice — is the ability to translate IT risk into business language. "SQL injection vulnerability in the customer portal" is not a risk communication. "Failure to address a critical web application vulnerability creates a business risk of customer data exfiltration, with an estimated GDPR fine exposure of £1.2M and significant reputational consequences" is.

That translation — from technical finding to business risk statement — is the core competency of a CRISC practitioner. Master it, and Domain 1 becomes intuitive. Fail to master it, and even a technically correct risk register will fail to drive the organisational decisions it exists to support.

---
*Module: Module 2 — Risk Management | Guardian Curriculum*
