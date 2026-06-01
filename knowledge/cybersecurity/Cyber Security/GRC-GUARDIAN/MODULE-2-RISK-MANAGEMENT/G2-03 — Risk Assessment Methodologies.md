---
tags: [guardian, grc, module-2, risk-management, risk-assessment, methodologies, iso27005, octave, fair, nist]
module: 2
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-15
guardian-refs: ["G2-01 — What is Risk", "G2-02 — Risk Appetite and Risk Tolerance", "G2-04 — Qualitative vs Quantitative Risk Analysis", "G2-05 — The Risk Register", "G2-06 — Risk Treatment", "G3-05 — ISO 27001 Clause 6 — Planning"]
---

# G2-03 — Risk Assessment Methodologies

> [!abstract] What This Note Covers
> By the end of this note, you will understand what a risk assessment methodology is, why having a documented methodology matters, and how the major methodologies — ISO 27005, OCTAVE, FAIR, NIST RMF, and CRAMM — work in practice. You will be able to select and justify the right methodology for a given organisational context.

---

## Why This Exists

Imagine two organisations, both conducting an annual risk assessment. Organisation A asks each department head to list the risks they are worried about, scores them on a 1–5 scale based on gut feel, and produces a risk register. Organisation B follows a documented methodology: it identifies assets first, then maps threats against each asset using a threat catalogue, assesses vulnerabilities through technical scanning and interviews, scores likelihood and impact against defined criteria, and produces a risk register with full audit trail.

Both organisations have a risk register. Only one has a *risk assessment*. The difference matters — not just because Organisation B's output is more reliable, but because it is *repeatable*, *defensible*, and *auditable*. When the ISO 27001 auditor asks "show me your risk assessment methodology," Organisation A is in trouble.

A **risk assessment methodology** is the documented, structured approach an organisation uses to systematically identify, analyse, and evaluate risks. It defines: what you assess, how you assess it, who does the assessing, what scales you use, and how you determine what to do with the results.

Without a methodology, risk assessments are opinion polls. With one, they are professional judgements that can be challenged, refined, and improved over time.

---

## What It Is

A risk assessment methodology is a *framework for making consistent, structured risk decisions*. It answers six questions:

| Question | What the methodology defines |
|---|---|
| **What** do we assess? | Scope — which assets, processes, systems, locations |
| **How** do we identify risks? | Risk identification approach — workshops, scans, interviews, threat catalogues |
| **How** do we analyse risks? | Scoring scales — likelihood and impact criteria, qualitative or quantitative |
| **How** do we evaluate risks?  | Comparison against risk appetite / acceptance criteria |
| **Who** does the assessment? | Roles — risk owner, assessor, reviewer, approver |
| **When** do we assess? | Triggers — annual cycle, change-driven, incident-driven |

The methodology must be documented. ISO 27001 Clause 6.1.2 explicitly requires a documented risk assessment process. An undocumented methodology — even if mentally consistent — cannot be audited, cannot be handed to a new team member, and cannot demonstrate consistency across assessment cycles.

---

## The Major Methodologies

### 1. ISO/IEC 27005 — Information Security Risk Management

**What it is:** The ISO standard specifically for information security risk management. ISO 27005 is the companion to ISO 27001 — where ISO 27001 requires a risk assessment, ISO 27005 provides the methodology for conducting one. Current version: ISO/IEC 27005:2022.

**Core process:**

```
Context establishment
        ↓
Risk identification
  ├── Asset identification
  ├── Threat identification
  ├── Control identification (existing)
  └── Vulnerability identification
        ↓
Risk analysis
  ├── Consequence / impact assessment
  └── Likelihood assessment
        ↓
Risk evaluation
  └── Compare against risk criteria (appetite / threshold)
        ↓
Risk treatment
        ↓
Risk acceptance
        ↓
Risk communication and consultation (continuous)
        ↓
Risk monitoring and review (continuous)
```

**Key features:**
- Asset-based: starts with identifying information assets and their owners
- Threat and vulnerability focused: explicitly maps threats against assets and identifies vulnerabilities that enable exploitation
- Flexible scoring: does not prescribe a specific scale — organisations define their own likelihood and impact criteria
- Aligned with ISO 31000: uses the same risk management principles as the broader ISO risk standard
- Iterative: designed to be repeated, with each cycle improving on the last

**Who uses it:** Organisations pursuing ISO 27001 certification, particularly in Europe. The most common methodology in UK and EU-based information security risk programmes.

**Strengths:** Internationally recognised. Directly aligned with ISO 27001. Comprehensive asset-to-risk coverage. Flexible enough for any sector or size.

**Weaknesses:** Can be resource-intensive for large, complex organisations. Does not provide quantitative output by default — organisations must define their own scoring approach. Requires significant judgement in threat and vulnerability identification.

---

### 2. OCTAVE — Operationally Critical Threat, Asset, and Vulnerability Evaluation

**What it is:** A risk assessment methodology developed by Carnegie Mellon University's Software Engineering Institute (SEI). OCTAVE focuses on identifying risks to critical assets from an organisational perspective — it emphasises the people, process, and technology dimensions of risk together. Three variants exist: OCTAVE (original, large enterprises), OCTAVE-S (small organisations), and OCTAVE Allegro (streamlined, information-focused).

**Core process (OCTAVE Allegro):**

```
Phase 1: Establish risk measurement criteria
  └── Define impact scales for each impact area (reputation, financial, safety, etc.)

Phase 2: Develop an information asset profile
  └── Identify the critical information asset, its container (where it lives), and its owner

Phase 3: Identify information asset containers
  └── Map all locations where the asset exists: technical, physical, people

Phase 4: Identify areas of concern
  └── Brainstorm threats to the asset in each container

Phase 5: Identify threat scenarios
  └── Develop detailed threat scenarios: actor → means → outcome → impact

Phase 6: Identify risks
  └── Map scenarios to impact areas using the criteria from Phase 1

Phase 7: Analyse risks
  └── Score each risk's relative priority

Phase 8: Select a mitigation approach
  └── Determine treatment approach for each risk
```

**Key features:**
- Operationally focused: led by the business, not just the security team. Business units participate in identifying their own critical assets and the threats to them.
- Scenario-based: develops detailed threat scenarios rather than generic risk statements — produces richer, more realistic risk descriptions
- Information-centric: focuses on information assets (not all asset types) — good for organisations where data is the primary asset
- Workshop-driven: relies on structured workshops with asset owners and business stakeholders

**Who uses it:** Originally designed for US government and defence sectors. Used by organisations that want a business-led, participatory risk assessment approach. OCTAVE Allegro is popular with organisations wanting a lighter-weight version.

**Strengths:** Strong business engagement — asset owners feel ownership of the risks. Scenario richness produces better threat understanding. Flexible and adaptable.

**Weaknesses:** Workshop-intensive — requires significant time commitment from business stakeholders. Does not produce quantitative output. Less aligned with ISO 27001 than ISO 27005 — requires mapping to satisfy certification requirements.

---

### 3. FAIR — Factor Analysis of Information Risk

**What it is:** A quantitative risk analysis methodology developed by Jack Jones. FAIR is the dominant framework for organisations that want to express information security risk in financial terms — specifically, annualised loss expectancy (ALE). Unlike most other methodologies, FAIR produces a dollar/pound value for each risk.

**Core model:**

```
RISK = Loss Event Frequency × Loss Magnitude

Loss Event Frequency = Threat Event Frequency × Vulnerability
  where:
    Threat Event Frequency = Contact Frequency × Probability of Action
    Vulnerability = Capability of Threat Agent / Difficulty of Controls

Loss Magnitude = Primary Loss + Secondary Loss
  where:
    Primary Loss = productivity, response costs, replacement costs
    Secondary Loss = reputation, regulatory, legal
```

**Key features:**
- Quantitative: produces probability distributions of financial loss, not qualitative scores
- Probabilistic: uses Monte Carlo simulation to model uncertainty — rather than a single risk score, FAIR produces a range of probable outcomes
- Defensible: grounded in actuarial and statistical principles — can be audited and challenged mathematically
- Board-friendly: expressing risk in financial terms ($X million expected annual loss) resonates with boards who think in financial terms, not red/amber/green

**Who uses it:** Large enterprises and financial services organisations that want to make cost-benefit decisions about security investments using financial risk data. Required or referenced by COSO ERM. Growing adoption in critical infrastructure.

**Strengths:** Produces financial risk quantification that directly supports ROI analysis for security investments. Eliminates the subjectivity of qualitative scoring. Enables comparison of risks across categories (cyber risk vs operational risk vs credit risk).

**Weaknesses:** Data-intensive — requires historical loss data, threat intelligence data, and actuarial inputs that many organisations do not have. Steep learning curve. Not directly mapped to ISO 27001 — requires methodology bridge. Can give false precision if input data is poor.

**Covered in depth:** G2-04

---

### 4. NIST Risk Management Framework (RMF)

**What it is:** A US federal framework for managing risk to information systems, published by NIST as NIST SP 800-37. Mandatory for US federal agencies under FISMA (Federal Information Security Management Act). Widely adopted by US government contractors and defence industrial base organisations.

**Core steps:**

```
Step 1: PREPARE
  └── Establish risk management context, roles, strategy, and organisational risk appetite

Step 2: CATEGORIZE
  └── Categorise the information system and the data it processes using FIPS 199
      (Low / Moderate / High based on CIA impact)

Step 3: SELECT
  └── Select security controls from NIST SP 800-53 based on the system category

Step 4: IMPLEMENT
  └── Implement the selected controls; document the implementation

Step 5: ASSESS
  └── Assess whether the controls are implemented correctly and operating effectively

Step 6: AUTHORIZE
  └── Senior official (Authorizing Official) formally accepts the residual risk
      and authorises the system to operate (Authority to Operate — ATO)

Step 7: MONITOR
  └── Continuously monitor controls; report to authorizing official; respond to changes
```

**Key features:**
- System-centric: assesses risk at the level of individual information systems, not the organisation as a whole
- Prescriptive: FIPS 199 categorisation produces a mandatory control baseline (from SP 800-53) rather than requiring subjective control selection
- Formal authorisation: the ATO (Authority to Operate) is a formal, signed acceptance of residual risk by a senior official — creates clear accountability
- Continuous monitoring: NIST RMF is explicitly designed as an ongoing cycle, not a point-in-time assessment

**Who uses it:** US federal agencies (mandatory). US Department of Defense contractors (mandatory via CMMC). Cloud providers seeking FedRAMP authorisation. Increasingly referenced by US state governments and critical infrastructure operators.

**Strengths:** Highly structured and prescriptive — reduces subjectivity. The ATO creates genuine accountability. Continuous monitoring is built into the framework. Comprehensive control library (SP 800-53 has 1,000+ controls).

**Weaknesses:** Heavyweight — designed for large, complex government systems. Not well-suited to smaller organisations or rapid-change environments. Primarily US-focused — less relevant for UK/EU organisations. Can become bureaucratic if not implemented thoughtfully.

---

### 5. CRAMM — CCTA Risk Analysis and Management Method

**What it is:** A UK government methodology developed by the Central Computer and Telecommunications Agency (CCTA) in the 1980s, subsequently maintained by Siemens and now less actively used. Historically significant — for many years the methodology of choice for UK government risk assessments.

**Core approach:**
- Asset identification and valuation (using a structured questionnaire)
- Threat and vulnerability assessment (from a built-in catalogue)
- Risk calculation (threat likelihood × vulnerability score × asset value = risk score)
- Control selection (from a built-in control library matched to risk scores)

**Who uses it:** Declining use — primarily UK public sector legacy programmes. Many organisations that previously used CRAMM have migrated to ISO 27005 or NIST-based approaches. Still seen in some UK government and defence contexts.

**Historical relevance:** CRAMM established many of the principles — asset-based, threat/vulnerability structured, control-to-risk mapping — that ISO 27005 and other modern methodologies refined and built upon. Understanding CRAMM is useful for context, less essential for practice.

---

### Choosing the Right Methodology: A Decision Guide

| Context | Recommended Methodology | Why |
|---|---|---|
| ISO 27001 certification (UK/EU) | ISO 27005 | Direct alignment; auditor familiarity; flexibility |
| US federal / DoD contractor | NIST RMF | Mandated by FISMA / CMMC |
| Organisation wanting financial risk quantification | FAIR | Only methodology designed for dollar-value output |
| Business-led, participatory assessment | OCTAVE Allegro | Workshop-driven; strong stakeholder engagement |
| Large enterprise with mature risk programme | FAIR + ISO 27005 | Qualitative foundation (ISO 27005) + quantitative validation (FAIR) |
| Small-to-medium UK business | ISO 27005 (simplified) or NCSC guidance | Proportionate; aligned to UK market expectations |

In practice, many mature GRC programmes use *hybrid* approaches — the structural rigour of ISO 27005 for the annual assessment, FAIR analysis for high-priority risks where financial quantification justifies the effort, and OCTAVE-style workshops for engaging business units.

---

## How a Risk Assessment Actually Runs: A Worked Example

To make this concrete, here is how an ISO 27005-aligned risk assessment might run for a 200-person UK SaaS company pursuing ISO 27001 certification:

**Phase 1: Context and Scope (Week 1)**
- Define the ISMS scope: all systems and processes involved in delivering the SaaS platform and supporting customer data
- Confirm risk assessment criteria: 5×5 likelihood/impact matrix; risk appetite thresholds (Low ≤6, Medium 7–12, High 13–18, Critical 19–25)
- Assign risk assessment team: CISO (lead), Head of IT, Head of Development, Legal/Compliance, HR representative

**Phase 2: Asset Identification (Week 2)**
- Workshop with each department to identify information assets in their area
- Output: asset register with 85 assets categorised and valued (Confidentiality, Integrity, Availability)
- Crown jewels identified: customer database, source code repository, authentication infrastructure

**Phase 3: Threat and Vulnerability Identification (Weeks 3–4)**
- Threat catalogue reviewed and customised to company context (using NCSC threat landscape for cloud/SaaS)
- Vulnerability assessment: technical scanning (Tenable/Qualys), configuration review, physical walkthrough, staff interviews
- Output: threat-vulnerability mapping against each asset

**Phase 4: Risk Analysis (Weeks 4–5)**
- For each threat-vulnerability-asset combination: score likelihood (1–5) and impact (1–5)
- Calculate risk score: likelihood × impact
- Document inherent risk (before controls) and residual risk (after existing controls)
- Output: 47 risks documented in the risk register

**Phase 5: Risk Evaluation (Week 6)**
- Compare each residual risk score against risk appetite thresholds
- 3 risks rated Critical → immediate escalation to CISO; board notification required
- 12 risks rated High → treatment plans required within 90 days
- 22 risks rated Medium → accepted or treated at CISO discretion
- 10 risks rated Low → accepted; monitored annually

**Phase 6: Risk Treatment Planning (Weeks 6–8)**
- For each Critical and High risk: treatment plan developed (mitigate / transfer / avoid / accept)
- Treatment plans assigned to risk owners with target dates
- Statement of Applicability (SoA) updated to reflect control selection
- Board review of Critical risks and formal risk acceptance documented

**Phase 7: Ongoing Monitoring**
- Monthly: risk register reviewed by CISO; new risks from incidents or threat intelligence added
- Quarterly: High and Critical risks reviewed with risk owners; treatment progress tracked
- Annually: full risk assessment repeated; methodology reviewed and refined

---

## The Details That Matter

### Risk Assessment vs Risk Analysis vs Risk Evaluation

These three terms are often used interchangeably but have precise meanings in ISO 31000 and ISO 27005:

| Term | Definition | Output |
|---|---|---|
| **Risk identification** | Finding, recognising, and describing risks | List of risks (asset + threat + vulnerability + impact) |
| **Risk analysis** | Understanding the nature of risk and determining risk level | Risk scores (likelihood × impact; inherent and residual) |
| **Risk evaluation** | Comparing risk analysis results against risk criteria to determine treatment priority | Prioritised list; treatment decisions |
| **Risk assessment** | The overall process encompassing identification, analysis, and evaluation | Completed risk register ready for treatment planning |

Auditors will test whether organisations understand these distinctions. "We do risk analysis" is not the same as "we do risk assessment."

### Consistency is More Important Than Perfection

A common trap: organisations spend months debating the perfect methodology before assessing a single risk. The perfect methodology does not exist. What matters is that the methodology you choose is:
- Documented
- Applied consistently across all risks
- Reviewed and improved over time
- Defensible to an auditor

A simple, consistently applied 5×5 qualitative methodology is more valuable than an elaborate quantitative framework applied inconsistently.

### Asset-Based vs Scenario-Based Approaches

ISO 27005 and NIST RMF are primarily asset-based — they start with what you are protecting. OCTAVE Allegro and FAIR are more scenario-based — they start with plausible threat scenarios and work backward to affected assets.

Both approaches have merit. Mature programmes often combine them: asset-based for comprehensive coverage, scenario-based for deep analysis of the highest-priority risks.

---

## Common Mistakes and Failures

**1. No documented methodology.**
The most common gap. The organisation does risk assessments — but when the auditor asks "show me your methodology," the answer is "we use a spreadsheet and expert judgement." This fails ISO 27001 Clause 6.1.2. Document the methodology before conducting the assessment.

**2. Changing methodology between assessment cycles.**
Year 1: 5×4 matrix. Year 2: 5×5 matrix. Year 3: qualitative labels only. Scores are not comparable across cycles, trends cannot be tracked, and the audit trail is inconsistent. Choose a methodology and apply it consistently. Evolve it deliberately with documented rationale.

**3. Risk assessment conducted by security team in isolation.**
The security team assesses all risks without engaging business units. The result: technical risks are well-covered; business process risks, people risks, and supplier risks are missed entirely. Risk assessment must be a collaborative process.

**4. Treating the methodology as a form to fill in.**
Going through the motions — completing every field in the risk register template without genuine thought about whether the threats are realistic, the vulnerabilities are accurate, or the impact scores are calibrated. The output looks complete but is analytically empty.

**5. No re-assessment trigger process.**
The annual cycle runs on schedule. But between cycles: a major cloud migration happens, a key supplier is acquired, a new product is launched in a new jurisdiction. None of these trigger a risk re-assessment because there is no documented trigger process. Material changes to the threat landscape should always trigger at least a partial risk assessment.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Clause 6.1.2 is the primary exam reference. Know what it requires: a documented process, defined risk acceptance criteria, consistent application, and documented results.
- Auditors will ask to see the methodology document and will trace it through to the risk register — checking that the methodology was actually followed, not just documented.
- Common major nonconformity: no documented risk assessment methodology (missing a mandatory Clause 6.1.2 requirement).

**CRISC:**
- CRISC Domain 2 (IT Risk Assessment) covers risk assessment methodologies in detail. Candidates must know: the purpose of a methodology, what makes one suitable for a given context, and the difference between qualitative and quantitative approaches.
- CRISC specifically tests knowledge of how risk assessment results feed into the risk register and how they are used to prioritise treatment.

**CISM:**
- CISM Domain 2 requires candidates to design and oversee risk management programmes. Understanding methodologies at a strategic level — which to select, how to ensure consistency, how to evolve the approach — is directly tested.

**CISSP:**
- Domain 1 covers risk assessment as a security management concept. CISSP tests understanding of major methodologies (particularly NIST RMF, given its US-government orientation) and when to apply them.
- CISSP also tests *threat modelling* as a sub-discipline of risk assessment — STRIDE, PASTA, and DREAD are methodologies worth knowing.

---

## GUARDIAN's Take

Here is the thing about risk assessment methodologies that nobody tells you upfront: *the methodology matters less than the discipline of following it.*

I have seen organisations with beautifully documented FAIR implementations that produced meaningless results because the input data was fabricated to hit the numbers the CISO wanted. I have seen organisations with a simple 5×5 matrix — nothing fancy — that produced genuinely useful risk registers because the assessors were rigorous, the business was engaged, and the results were challenged before they were accepted.

The methodology is a scaffold. It gives you a structure to hang your thinking on. But the quality of the thinking — the honesty of the threat assessment, the rigour of the vulnerability analysis, the realism of the impact estimates — is what determines whether the output is useful.

My advice on methodology selection:

**Start simple.** For most organisations, a well-executed ISO 27005-aligned qualitative methodology is sufficient. Do not pursue FAIR before you have the data quality and analytical maturity to use it properly — it will give you false precision based on guessed inputs.

**Evolve deliberately.** As your risk programme matures, you will identify where the current methodology has gaps — perhaps you need better quantification for certain risk categories, or better threat scenario coverage. Evolve the methodology in response to those gaps, not in response to what looks impressive in a presentation.

**Always ask: does this output drive better decisions?** If the risk register your methodology produces is not actually influencing treatment decisions, budget allocations, and board behaviour — it is not working, regardless of how technically rigorous it is.

The goal is never a perfect risk register. The goal is an organisation that makes better decisions about risk because of the work you have done.

---
*Module: Module 2 — Risk Management | Guardian Curriculum*
---
tags: [guardian, grc, module-2, risk-management, risk-assessment, methodologies, iso27005, octave, fair, tara]
module: 2
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-15
guardian-refs: ["G2-01 — What is Risk", "G2-02 — Risk Appetite and Risk Tolerance", "G2-04 — Qualitative vs Quantitative Risk Analysis", "G2-05 — The Risk Register", "G3-05 — ISO 27001 Clause 6 — Planning"]
---

# G2-03 — Risk Assessment Methodologies

> [!abstract] What This Note Covers
> By the end of this note, you will understand what a risk assessment methodology is, why having a documented one is mandatory under ISO 27001, and how the major methodologies — ISO 27005, OCTAVE, FAIR, and asset-based vs scenario-based approaches — work in practice.

---

## Why This Exists

In 2014, Sony Pictures Entertainment was devastated by a cyberattack attributed to North Korean state actors. Terabytes of data were exfiltrated — unreleased films, executive salary information, personal employee data, internal communications. The attack was not, by the standards of the threat landscape, technically sophisticated. It used spear-phishing to gain initial access and then moved laterally through the network.

What emerged from the subsequent investigation was that Sony had conducted risk assessments — they had identified threats and vulnerabilities. But the assessments had not been conducted systematically or consistently. Different teams assessed risk differently. The results were not aggregated into a coherent organisational picture. Treatment decisions were made ad hoc. Nobody had assessed the residual risk of a sophisticated nation-state adversary targeting their specific assets with their specific exposure profile.

A risk assessment is only as useful as the methodology behind it. Without a defined, consistent, repeatable methodology, you are not doing risk management — you are doing risk guessing. Different people will assess the same risk differently. Results cannot be compared or aggregated. Decisions cannot be justified. And the exercise provides false assurance — it looks like risk management while failing to function as it.

A risk assessment methodology is the documented, agreed-upon process by which risks are identified, analysed, and evaluated. It is the engine of the risk management programme.

---

## What It Is

A **risk assessment methodology** is a structured, repeatable process for identifying, analysing, and evaluating information security risks. It defines:

- **What** is assessed (scope — assets, systems, processes, the whole organisation)
- **How** risks are identified (methods — workshops, interviews, scanning, threat intelligence)
- **How** likelihood and impact are scored (scales, criteria, qualitative vs quantitative)
- **What** the output looks like (risk register format, risk statement structure)
- **Who** is involved (risk owners, subject matter experts, facilitators)
- **When** it is conducted (trigger-based, periodic, or continuous)

ISO 27001 Clause 6.1.2 does not prescribe a specific methodology — but it does require that the organisation *has* one, that it is documented, and that it produces consistent, comparable, and reproducible results. The methodology must also define risk acceptance criteria (the operationalisation of risk appetite covered in G2-02).

This means you cannot simply conduct a risk assessment however feels right on the day. You must have a defined process that will produce comparable results whether conducted this year or in three years, whether conducted by the current risk manager or their successor.

---

## The Two Fundamental Approaches

Before examining specific methodologies, understand the two foundational approaches to risk assessment — all methodologies fall into one or both categories:

### Asset-Based (Bottom-Up) Approach

Start with assets. For each asset, identify the threats that could affect it and the vulnerabilities that could be exploited. Assess the likelihood and impact of each threat-vulnerability combination.

```
ASSET → What threats target this asset?
              → What vulnerabilities could be exploited?
                    → What is the likelihood?
                          → What is the impact?
                                → What is the risk score?
```

**Strengths:** Comprehensive — every asset is considered. Good for ensuring no asset is overlooked. Well-suited to ISO 27001 requirements.

**Weaknesses:** Can be very time-consuming for large asset inventories. Risk of "analysis paralysis" — getting lost in the detail. Can miss systemic or cross-asset risks that only become visible at a higher level.

**Best for:** Organisations with well-defined asset inventories, particularly where assets have varied classification levels and the risk profile differs significantly between them.

### Scenario-Based (Top-Down) Approach

Start with risk scenarios — realistic narratives of how harm could occur — rather than individual assets. A scenario might be "ransomware attack resulting in encryption of all production systems" or "insider exfiltration of customer database." For each scenario, assess the likelihood and impact.

```
SCENARIO → What is the likelihood this scenario occurs?
                → What is the impact if it does?
                      → What controls exist?
                            → What is the residual risk?
```

**Strengths:** Produces risk outputs that are immediately understandable to business stakeholders and boards — scenarios are intuitive in a way that lists of asset-threat-vulnerability combinations are not. Faster for organisations without comprehensive asset inventories. Good for identifying cross-cutting risks.

**Weaknesses:** May miss specific asset-level risks if scenarios are not sufficiently granular. Scenario selection itself introduces bias — if you do not think of the scenario, you do not assess it.

**Best for:** Executive-level risk discussions, board reporting, and organisations in early maturity stages of their risk programme.

Most mature organisations use a hybrid: scenario-based for executive-level risk appetite and reporting, asset-based for the detailed technical risk register that feeds control selection.

---

## Major Methodologies

### ISO 27005 — Information Security Risk Management

**What it is:** The ISO standard specifically for information security risk management, designed as the implementation guidance for the risk management requirements of ISO 27001. Current version: ISO/IEC 27005:2022.

**How it works:**

ISO 27005 follows the ISO 31000 risk management process model (establish context → identify → analyse → evaluate → treat → monitor) adapted for information security. The 2022 revision introduced a significant shift — moving away from the traditional asset-threat-vulnerability model toward an event-based approach that is more scenario-friendly.

**Key steps in the ISO 27005 process:**

1. **Define context and scope**: What is within scope? What are the organisation's objectives, constraints, and legal obligations? Who are the stakeholders?

2. **Risk identification**: Identify risks using either asset-based or scenario-based approaches (or both). Document risk owners. Produce risk statements in the format: event → consequence.

3. **Risk analysis**: For each identified risk, assess:
   - *Likelihood*: How probable is the risk event, given existing controls?
   - *Consequence*: What would the impact be if the event occurred?
   - Both are assessed on a defined scale (qualitative, semi-quantitative, or quantitative)

4. **Risk evaluation**: Compare the analysed risk against risk criteria (the operationalised appetite). Determine which risks require treatment and which may be accepted.

5. **Risk treatment**: Select treatment options (see G2-06). Develop the risk treatment plan. Implement controls. Reassess residual risk.

6. **Monitoring and review**: Continuously monitor the risk environment for changes. Review the risk assessment when significant changes occur.

**ISO 27005 in practice:**
Most ISO 27001 implementations use ISO 27005 — or a process directly derived from it — as their assessment methodology. Auditors for ISO 27001 certification will review the methodology documentation and verify it aligns with the standard's requirements.

**Strengths:** Directly aligned with ISO 27001. International consensus. Well-documented. Flexible — can be applied qualitatively or quantitatively.

**Weaknesses:** High-level guidance — organisations must still design their own scales, scoring criteria, and risk register formats. The 2022 version is a significant departure from the earlier version; organisations must update their methodology documentation.

---

### OCTAVE — Operationally Critical Threat, Asset, and Vulnerability Evaluation

**What it is:** A risk assessment framework developed by Carnegie Mellon University's Software Engineering Institute (SEI). Originally developed for large organisations; OCTAVE Allegro (2007) is a streamlined version for smaller teams; OCTAVE-S was designed for small organisations.

**How it works:**

OCTAVE takes an asset-centric, workshop-driven approach. It is distinctive in that it emphasises the organisation's own knowledge — the people who understand the business and its risks conduct the assessment, rather than it being a purely top-down or external process.

**Three phases of OCTAVE Allegro:**

**Phase 1 — Establish risk measurement criteria**: Define impact scales across multiple areas (reputation, financial, productivity, safety, legal). This becomes the scoring framework for the entire assessment. The organisation decides what "catastrophic" means for them before assessing any risks.

**Phase 2 — Develop an information asset profile**: Identify critical information assets. For each, document: what it is, where it is stored/transmitted/processed, what security requirements apply (CIA), and who owns it.

**Phase 3 — Identify and analyse risks**: For each critical asset, identify containers (where the asset lives — technical, physical, people), threats to those containers, and the impact if the threats materialise. Score each risk scenario against the criteria defined in Phase 1.

**OCTAVE in practice:**
OCTAVE is particularly well-suited to organisations that want to conduct risk assessments using internal resources (business unit managers, IT staff) rather than external consultants. The workshop-based approach builds organisational risk literacy as a byproduct. It works well for medium-sized organisations that want a structured but practical methodology.

**Strengths:** Builds internal capability. Business-unit-oriented — risk owners participate directly. Produces outputs that business stakeholders understand and own. Well-documented and freely available.

**Weaknesses:** Time-intensive. Requires skilled facilitation to keep workshops productive. Less suited to very large organisations with thousands of assets.

---

### FAIR — Factor Analysis of Information Risk

**What it is:** A quantitative risk analysis model developed by Jack Jones, now maintained by the FAIR Institute. FAIR is the leading methodology for *quantitative* information security risk assessment — expressing risk in financial terms rather than colour-coded matrices.

**How it works:**

FAIR decomposes risk into a hierarchical model of factors, each of which can be estimated and combined to produce a probabilistic financial risk estimate. The two top-level components are:

- **Loss Event Frequency (LEF)**: How often, over a given period, will a loss event occur?
  - Threat Event Frequency (TEF): How often does the threat actor attempt an action?
  - Vulnerability (Vuln): What proportion of threat events result in a successful loss event?

- **Loss Magnitude (LM)**: How much will each loss event cost?
  - Primary Loss: Direct financial impact (response costs, fines, replacement)
  - Secondary Loss: Indirect impact (reputation, legal liability, competitive loss)

FAIR uses Monte Carlo simulation — running thousands of scenarios with probabilistic inputs — to produce a range of possible outcomes: "There is a 10% chance this risk will result in losses exceeding £5 million in the next 12 months; the most likely outcome is £800K–£2.4M."

**FAIR in practice:**
FAIR is the gold standard for organisations that need to communicate risk to boards and CFOs in financial terms. "This risk has a 15% probability of causing losses exceeding £10M in the next year" is a fundamentally different (and more actionable) statement than "this risk is rated Red on our heat map."

**Strengths:** Produces financially meaningful risk estimates. Enables cost-benefit analysis of control investments ("spending £200K on this control reduces expected annual loss by £1.2M — clear ROI"). Board-friendly outputs. Removes the false precision of qualitative scoring.

**Weaknesses:** Requires good data to produce meaningful estimates — organisations without historical incident data or threat intelligence struggle with the inputs. Requires trained practitioners. Overkill for organisations at early risk management maturity. Not directly aligned with ISO 27001's requirements (though compatible).

**Best for:** Large enterprises, financial services, and organisations where security investment decisions require quantitative justification at board or CFO level.

---

### NIST SP 800-30 — Guide for Conducting Risk Assessments

**What it is:** The US NIST guidance for conducting information security risk assessments, designed for US federal agencies but widely adopted. Part of the NIST Risk Management Framework (RMF).

**How it works:**

NIST SP 800-30 follows a three-step process: Prepare → Conduct → Communicate and Maintain.

The **Conduct** step involves:
1. Identify threat sources and threat events
2. Identify vulnerabilities and predisposing conditions
3. Determine likelihood of exploitation (considering controls)
4. Determine magnitude of impact
5. Determine risk (combining likelihood and impact)

NIST 800-30 uses multi-level threat categorisation (adversarial vs non-adversarial vs accidental vs structural vs environmental) and detailed impact scales across multiple consequence types.

**Best for:** US government contractors and organisations aligning to the NIST RMF. Provides very detailed taxonomies of threat sources and vulnerability types that are useful reference material even when not using the full methodology.

---

### Choosing a Methodology

| Organisation type | Recommended methodology |
|---|---|
| ISO 27001 certification target (any size) | ISO 27005 (asset-based or scenario-based variant) |
| Mid-size, internal capability focus | OCTAVE Allegro |
| Large enterprise, quantitative ROI focus | FAIR |
| US government contractor / FedRAMP | NIST SP 800-30 / RMF |
| Early maturity, quick start | Scenario-based approach with simple qualitative scoring |
| Complex OT/ICS environments | ISA/IEC 62443 risk assessment approach |

In practice, most mature GRC programmes blend elements from multiple methodologies — using ISO 27005's process structure, FAIR's financial quantification for high-priority risks, and OCTAVE's workshop approach for business unit engagement.

---

## How to Run a Risk Assessment in Practice

Regardless of methodology, most risk assessments follow this practical sequence:

**Step 1 — Scope definition**
Define what is included (systems, processes, locations, third parties) and what is excluded and why. Document it. For ISO 27001, scope must align with the ISMS scope.

**Step 2 — Asset identification**
Enumerate the assets within scope. Assign owners. Classify assets by sensitivity/criticality. This becomes the foundation for asset-based assessment.

**Step 3 — Threat identification**
For each asset (or for each scenario in scenario-based approaches), identify realistic threats. Use threat intelligence, historical incidents, and industry threat landscapes — not just imagination.

**Step 4 — Vulnerability identification**
Identify weaknesses that the identified threats could exploit. Sources: vulnerability scan results, penetration test findings, audit findings, gap assessments, industry advisories.

**Step 5 — Likelihood and impact scoring**
Score each risk using the organisation's defined scales. Apply both *before* controls (inherent risk) and *after* current controls (residual risk). Document the rationale for scoring decisions.

**Step 6 — Risk evaluation**
Compare residual risk scores against the risk appetite and thresholds. Identify which risks require treatment.

**Step 7 — Prioritisation**
Order risks by residual score and business priority. Not all Critical risks are equally urgent — factor in treatment cost, strategic importance, and regulatory exposure.

**Step 8 — Document in the risk register**
Record all risks in the risk register with full details: risk statement, inherent score, current controls, residual score, risk owner, treatment decision, treatment plan, target residual score, and review date.

**Step 9 — Report to stakeholders**
Produce a risk assessment report for the CISO and, for high-level risks, the board. Include: methodology used, risks identified, top risks summary, treatment recommendations, and resource requirements.

---

## The Details That Matter

### Consistency and Repeatability: Why They Matter for ISO 27001

ISO 27001 Clause 6.1.2 requires that the risk assessment methodology produces "consistent, valid and comparable results." This means:

- **Consistent**: The same risk assessed by different people using the same methodology should produce similar scores
- **Valid**: The scores accurately reflect the real level of risk (not systematically over- or under-stated)
- **Comparable**: Risks can be compared against each other and against the same risks assessed in prior years

Auditors test this by: reviewing the methodology documentation, examining multiple risk register entries to check that scoring criteria are applied consistently, and checking that the methodology has been applied to the full scope (not selectively).

### Risk Assessment Triggers

A risk assessment should not only be conducted on a scheduled basis. Define triggers for out-of-cycle assessments:

| Trigger | Example |
|---|---|
| New asset or system | Deploying a new cloud platform |
| Significant change | Office relocation, M&A activity, new market entry |
| New regulation | DORA coming into force for a financial services firm |
| Significant incident | A breach or near-miss that reveals an unassessed vulnerability |
| Threat intelligence | NCSC advisory about active exploitation of a technology in your stack |
| Audit finding | Internal or external audit identifies a control gap |
| Supplier change | Critical supplier changes ownership or suffers a breach |

---

## Common Mistakes and Failures

**1. The methodology is undocumented.**
The risk assessment is conducted informally, without a written methodology. Auditors cannot verify consistency. New staff cannot repeat the process. Results cannot be defended or challenged.

**2. Likelihood and impact scales are undefined.**
Scores of 1–5 with no definition of what each number means. One risk owner scores a 3 for "moderately likely"; another scores a 4 for exactly the same likelihood. Results are inconsistent and misleading.

**3. Inherent risk is never calculated.**
Organisations jump straight to residual risk without assessing inherent risk. They cannot demonstrate the value of their controls (the delta between inherent and residual) and cannot identify risks where existing controls are providing little benefit.

**4. Risk assessment conducted only in IT.**
The methodology is sound but only applied to technical systems. HR risks, supplier risks, and physical security risks are unassessed. The risk register is IT-centric and misses half the organisation's real risk landscape.

**5. Assessment not updated after significant changes.**
The annual risk assessment was completed in January. A major cloud migration was completed in March. Nobody updated the risk register. The ISMS is now materially out of date.

**6. Assessment by committee with no individual accountability.**
Risk scores are produced by group consensus in workshops with no individual sign-off. Risk owners do not formally own their risk entries. When a risk materialises, nobody is accountable for the assessment that missed it.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Know Clause 6.1.2 in detail: the methodology must be documented, must produce consistent/valid/comparable results, must define risk acceptance criteria, and must be applied within the ISMS scope.
- Auditors will examine: the methodology document, the risk register, and the treatment plan — looking for evidence of consistent application and appropriate risk owner involvement.
- Common major nonconformity: no documented methodology (not just missing documentation — actually no defined approach).
- Common minor nonconformity: methodology defined but evidence of inconsistent application across the risk register.

**CRISC:**
- CRISC Domain 1 (IT Risk Identification) and Domain 2 (IT Risk Assessment) cover risk assessment methodology in depth.
- Know the distinction between qualitative, semi-quantitative, and quantitative approaches — CRISC tests when each is appropriate.
- CRISC also tests: risk scenario analysis, risk factor identification, and the role of threat intelligence in shaping assessment.

**CISM:**
- Domain 2 tests the CISO's ability to design and oversee an appropriate risk assessment programme — including methodology selection for the organisation's maturity, culture, and regulatory context.
- CISM scenario: "A newly appointed CISO finds no documented risk assessment methodology. What is the first step?" — Answer: establish the methodology before conducting any assessments, ensuring alignment with business objectives and risk appetite.

**CISSP:**
- Domain 1 covers risk assessment methodologies including qualitative, quantitative, and hybrid approaches. Know FAIR (quantitative) and ISO 27005/OCTAVE (qualitative/semi-quantitative) as examples.
- CISSP also tests threat modelling methodologies — STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, DoS, Elevation of Privilege), PASTA, TRIKE — as risk assessment tools for system design.

---

## GUARDIAN's Take

The most useful thing I can tell you about risk assessment methodologies is this: the best methodology is one that the organisation will actually use consistently — not the most theoretically rigorous one.

I have seen organisations implement FAIR with full Monte Carlo simulation, producing beautifully precise financial risk estimates that nobody reads because they are too complex. I have seen OCTAVE workshops that generate genuine insights and risk ownership because the process brings the right people into the room. I have seen simple qualitative spreadsheet-based approaches that, because they are consistently applied and genuinely maintained, produce better risk management outcomes than elaborate frameworks that were abandoned after the first implementation.

Methodology selection should be driven by three questions:

**1. What maturity level are we at?** A first-year ISO 27001 implementation with no existing risk programme should start simple — a well-designed qualitative approach will serve them far better than attempting quantitative analysis without the data to support it.

**2. What decisions does the output need to support?** If the output feeds a board-level investment decision, financial quantification (FAIR) is valuable. If it feeds a day-to-day patching prioritisation process, a simple residual risk score is sufficient.

**3. Will our people actually use it?** A methodology that requires a PhD in statistics will not survive contact with a business unit manager. It needs to be understandable by the risk owners — the people who need to assess, own, and act on the risks in their domain.

Start simple. Apply it consistently. Build on it as maturity grows. The worst risk assessment is a perfect methodology nobody uses. The best is an imperfect one that everyone does, all the time, with genuine ownership.

---
*Module: Module 2 — Risk Management | Guardian Curriculum*
