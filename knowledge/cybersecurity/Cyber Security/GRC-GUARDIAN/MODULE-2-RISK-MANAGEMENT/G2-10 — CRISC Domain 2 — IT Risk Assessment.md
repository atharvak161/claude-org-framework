---
tags: [guardian, grc, module-2, risk-management, crisc, it-risk-assessment, likelihood, impact, risk-matrix]
module: 2
cert-coverage: [crisc, iso27001-la, cism, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G2-01 — What is Risk", "G2-04 — Qualitative vs Quantitative Risk Analysis", "G2-05 — The Risk Register", "G2-09 — CRISC Domain 1 — IT Risk Identification", "G2-11 — CRISC Domain 3 — Risk Response and Mitigation"]
---

# G2-10 — CRISC Domain 2 — IT Risk Assessment

> [!abstract] What This Note Covers
> By the end of this note, you will understand CRISC Domain 2 in full — how IT risks are assessed once identified, including likelihood and impact analysis, risk aggregation, control assessment, the relationship between inherent and residual risk, and how to produce a risk profile that supports business decision-making.

---

## Why This Exists

Identifying risks is the starting point. Assessment is where those risks are given meaning — where the organisation moves from "here is a list of things that could go wrong" to "here is how bad each of them could be, and here is how urgently we need to act."

Risk assessment is the analytical engine of the entire risk management programme. Done well, it produces a prioritised, credible picture of IT risk that enables the board to make informed decisions about where to invest limited security resources. Done poorly — with inconsistent scoring, unclear criteria, and no connection to business impact — it produces a colour-coded spreadsheet that satisfies an auditor and changes nothing.

CRISC Domain 2 is the most analytically demanding domain in the qualification. It tests whether candidates can assess risk systematically, consistently, and in a way that connects technical findings to business consequences. This note covers every concept the domain tests, with sufficient depth for both exam performance and professional practice.

---

## CRISC Domain 2 Overview

**Domain weight in the CRISC exam**: approximately 20% of total marks.

**Core question the domain answers**: Given an identified IT risk, how does the risk professional systematically assess its likelihood and potential impact, factor in existing controls, and produce a residual risk rating that enables prioritised treatment decisions?

**Domain 2 key topic areas (CRISC Review Manual):**

1. Risk assessment concepts and terminology
2. Likelihood assessment methods
3. Impact assessment — dimensions and measurement
4. Control assessment and control effectiveness
5. Inherent vs residual risk
6. Risk aggregation and the risk profile
7. Risk ranking and prioritisation
8. Risk assessment documentation
9. Communicating risk assessment results

---

## Concept 1: The Risk Assessment Process in CRISC Context

CRISC defines risk assessment as the overall process of:

1. **Risk identification** (Domain 1) — discovering all relevant risks
2. **Risk analysis** — determining the likelihood and impact of each risk
3. **Risk evaluation** — comparing the analysed risk to risk criteria (appetite/tolerance) to determine which risks require treatment

The assessment process must be:
- **Systematic**: Following a defined, documented methodology — not ad hoc
- **Repeatable**: Producing comparable results when applied by different assessors or at different points in time
- **Documented**: Generating an auditable record of how each risk was assessed and why
- **Business-connected**: Expressed in terms of business impact, not just technical severity

These are the same requirements as ISO 27001 Clause 6.1.2 — the standards are aligned because both draw on ISO 31000 principles.

---

## Concept 2: Likelihood Assessment

**Likelihood** is the probability that a risk event will occur within a defined time period (usually one year). CRISC assesses likelihood by analysing two components:

### Threat Event Frequency (TEF)

How often does the threat actor attempt the action? This is driven by:
- Threat actor motivation (financial, political, personal)
- Threat actor capability (tools, skills, resources)
- Opportunity (is the target exposed? is it attractive?)
- Industry and sector targeting patterns
- Historical incident data (internal and industry-wide)
- Current threat intelligence

### Vulnerability Condition

Given that the threat actor attempts the action, what is the probability that they succeed? This is driven by:
- Existing control strength (how effective are current preventive controls?)
- Technical vulnerability severity (CVSS score, exploitability, patch availability)
- Compensating controls (network segmentation, detection capability)
- Adversary sophistication relative to the organisation's defences

**Combined likelihood**:

```
Likelihood = f(Threat Event Frequency × Vulnerability Condition)

High TEF + High Vulnerability = High Likelihood
High TEF + Low Vulnerability = Medium Likelihood
Low TEF + High Vulnerability = Medium Likelihood
Low TEF + Low Vulnerability = Low Likelihood
```

### Likelihood Assessment Scales

CRISC supports both qualitative and quantitative likelihood assessment (see G2-04 for depth). For the exam, candidates must know both approaches and when each is appropriate.

**Qualitative scale (5-point):**

| Score | Label | Meaning |
|---|---|---|
| 5 | Almost Certain | Expected to occur — >70% probability per year |
| 4 | Likely | Will probably occur — 40–70% probability per year |
| 3 | Possible | Might occur — 10–40% probability per year |
| 2 | Unlikely | Could occur but not expected — 3–10% probability per year |
| 1 | Rare | Exceptional circumstances only — <3% probability per year |

**Quantitative (ARO-based):**
Expressed as Annualised Rate of Occurrence (ARO). An ARO of 0.3 = 30% probability per year = once every 3.3 years on average. Used when historical data exists to support precise estimation.

### CRISC Exam Application on Likelihood

A common CRISC scenario: "A threat intelligence report indicates that ransomware operators are actively targeting organisations in your sector, and your organisation has 23 unpatched critical vulnerabilities on internet-facing systems. How does this affect your likelihood assessment?"

Answer framework:
- The threat intelligence increases TEF (active targeting = more frequent attempts)
- The unpatched vulnerabilities increase vulnerability condition (higher probability of success per attempt)
- Combined effect: likelihood score should increase significantly — this is a near-term, high-probability risk requiring urgent treatment, not routine scheduling

---

## Concept 3: Impact Assessment

**Impact** is the magnitude of harm that would result if the risk event occurred. CRISC requires impact to be assessed across multiple dimensions — not just financial — because different stakeholders experience different types of harm.

### The Five Impact Dimensions (CRISC Framework)

**1. Strategic impact**
Harm to the organisation's ability to achieve its long-term objectives. Loss of competitive advantage (IP theft), strategic decision-making based on corrupted data, reputational damage that limits market access.

**2. Operational impact**
Disruption to day-to-day business operations. System downtime, inability to process transactions, supply chain disruption, staff inability to work. Often measured in hours or days of disruption and the associated cost.

**3. Financial impact**
Direct financial loss. Regulatory fines, legal costs, incident response costs, ransom payments, business interruption losses, customer compensation, insurance premium increases.

**4. Compliance / regulatory impact**
Failure to meet legal or regulatory obligations. GDPR fines, FCA enforcement, PCI DSS loss of card processing rights, contractual breach, loss of certifications or licences.

**5. Reputational impact**
Damage to brand, customer trust, and stakeholder relationships. Often the hardest to quantify but potentially the most enduring. A major, publicly disclosed breach can damage customer acquisition and retention for years.

### Impact Assessment Scales

**Qualitative impact scale (5-point, multi-dimensional):**

| Score | Financial | Operational | Reputational | Compliance |
|---|---|---|---|---|
| 5 — Catastrophic | >£10M or existential | Weeks of disruption | Permanent brand damage | Criminal prosecution / loss of licence |
| 4 — Major | £1M–£10M | Days–weeks disruption | Major media coverage, customer loss | Large regulatory fine, enforcement action |
| 3 — Moderate | £100K–£1M | Hours–days disruption | Negative press, localised customer impact | Regulatory investigation, minor fine |
| 2 — Minor | £10K–£100K | Hours of disruption | Limited external awareness | Regulatory notification required |
| 1 — Negligible | <£10K | No material disruption | Internal only | No regulatory consequence |

**Quantitative impact:**
Single Loss Expectancy (SLE) = Asset Value × Exposure Factor. Used for financial impact quantification. See G2-04 for full treatment.

### The Highest Impact Dimension Rules

When multiple impact dimensions are assessed for a single risk, the **highest dimension score** typically drives the overall impact rating — not the average. A risk with negligible financial impact but catastrophic reputational impact is a catastrophic-impact risk.

This prevents underestimation of risks that are financially small but strategically or reputationally devastating.

---

## Concept 4: Control Assessment

Before calculating residual risk, existing controls must be assessed. CRISC Domain 2 tests control assessment in depth because the accuracy of the residual risk calculation depends entirely on the accuracy of the control effectiveness assessment.

### Control Types (CRISC Framework)

**By function:**
- **Preventive**: Reduce the likelihood that a threat successfully exploits a vulnerability (firewalls, MFA, patching, security training)
- **Detective**: Identify when a risk event is occurring or has occurred (SIEM, IDS, audit logs, anomaly detection)
- **Corrective**: Reduce impact and restore normal operations after an event (backups, incident response plan, DR site)

**By nature:**
- **Manual**: Performed by people (access reviews, physical security checks, manual approval processes)
- **Automated**: Performed by technology (automated patching, SIEM alerting, automated access provisioning/deprovisioning)
- **Compensating**: Controls that substitute for a missing or inadequate primary control (network segmentation compensating for an unpatched server)

### Control Effectiveness Assessment

For each existing control, CRISC requires an effectiveness rating. The effectiveness rating determines how much the control reduces the likelihood and/or impact of the risk.

**Control effectiveness levels:**

| Effectiveness | Definition | Risk score reduction |
|---|---|---|
| **Highly Effective** | Control is fully implemented, regularly tested, and functioning as designed. Evidence available and current. | Significant reduction in likelihood and/or impact |
| **Partially Effective** | Control exists but has gaps — incomplete coverage, inconsistent operation, or infrequently tested. | Moderate reduction |
| **Marginally Effective** | Control exists on paper but is rarely enforced, poorly designed, or untested. | Minimal reduction |
| **Ineffective** | Control is present but demonstrably not working — bypassed, misconfigured, or obsolete. | No reduction |
| **Not Implemented** | Control is planned or documented but not yet in place. | No reduction — treat as inherent |

**Critical CRISC principle**: Control effectiveness must be *verified*, not assumed. Self-reported effectiveness from business units must be corroborated by independent testing (penetration testing, internal audit, configuration review). The gap between stated and actual control effectiveness is one of the most dangerous blind spots in IT risk management.

### Control Gaps

A **control gap** exists when:
- A required control is absent (no MFA where MFA is required by policy)
- A control is present but not adequately covering all assets in scope (MFA deployed for staff but not for service accounts)
- A control's effectiveness has degraded without remediation (IDS signatures not updated for 18 months)
- A compensating control is less effective than the primary control it replaces

Control gaps identified during assessment must be captured in the risk register as risk factors that elevate residual risk — and as candidates for risk treatment actions.

---

## Concept 5: Inherent vs Residual Risk in CRISC

CRISC defines and tests both concepts with precision.

**Inherent risk**: The level of risk existing *before* any controls are applied. The "raw" risk level — what the exposure would be if the organisation did nothing.

**Residual risk**: The level of risk remaining *after* controls are applied. The actual exposure the organisation carries today, given its current control environment.

**The calculation:**

```
Inherent Risk = Likelihood (no controls) × Impact (no controls)

Residual Risk = Likelihood (post-control) × Impact (post-control)

where:
  Likelihood (post-control) = Likelihood (no controls) × [1 - Control Effectiveness on Likelihood]
  Impact (post-control) = Impact (no controls) × [1 - Control Effectiveness on Impact]
```

In qualitative terms:

| Inherent Likelihood | Control Effectiveness | Residual Likelihood |
|---|---|---|
| 5 (Almost Certain) | Highly Effective preventive | 2–3 (Unlikely to Possible) |
| 5 (Almost Certain) | Partially Effective | 3–4 (Possible to Likely) |
| 5 (Almost Certain) | Ineffective | 5 (Almost Certain — unchanged) |

**CRISC exam key point**: Only *preventive* controls reduce residual likelihood. *Detective* and *corrective* controls reduce residual impact (by enabling faster response and better recovery) — they do not reduce the probability that the threat event occurs.

This distinction drives treatment selection: if the goal is to reduce likelihood, invest in preventive controls. If the goal is to reduce impact, invest in detective and corrective controls. Most mature programmes invest in all three layers.

---

## Concept 6: Risk Aggregation and the IT Risk Profile

Individual risk assessments produce individual risk scores. Aggregation combines these into an organisational picture — the **IT risk profile**.

### What Aggregation Reveals

**Total exposure**: The sum of all residual risk scores gives an indication of total IT risk exposure. Trends over time (is total exposure increasing or decreasing?) indicate whether the risk programme is improving.

**Risk concentration**: Aggregation reveals whether certain assets, systems, domains, or business units carry disproportionate risk. A single legacy system appearing in 12 separate risk register entries is a concentration risk.

**Correlated risks**: Risks that would materialise simultaneously from a single triggering event. A ransomware attack might trigger: operational disruption risk, data breach risk, regulatory notification risk, reputational risk, and business continuity risk — all at once. Aggregated, these correlated risks represent far more than their individual scores suggest.

**Velocity**: How quickly could a risk materialise and cause harm? A slow-developing risk (gradual IP theft by an insider) has different urgency than a fast-velocity risk (ransomware that encrypts systems within hours of compromise).

**Risk profile changes over time**: Comparing current aggregate risk profile to prior periods reveals whether the programme is reducing overall exposure. Mature risk programmes track risk profile trends and report them to the board.

### Presenting the Risk Profile

The IT risk profile is typically presented as:

**1. A risk heat map (matrix)**
All risks plotted on a likelihood × impact matrix. Provides visual overview of concentration. Critical and High risks are immediately visible. Useful for operational teams and Security Committee.

**2. A top-risks dashboard**
The 10–15 highest-priority risks summarised in business language, with current status, risk owner, and treatment plan summary. Board-friendly format.

**3. A risk trend chart**
Total number of Critical/High/Medium/Low risks over time (monthly or quarterly). Shows whether the programme is improving the overall risk posture.

**4. A risk-by-domain breakdown**
Residual risk distribution across risk categories (data protection, availability, insider threat, third party, etc.). Identifies domains requiring disproportionate attention.

---

## Concept 7: Risk Ranking and Prioritisation

Once assessed, risks must be prioritised for treatment. Ranking enables the CISO and risk manager to direct limited resources toward the risks that matter most.

### Risk Ranking Criteria

Simple ranking by residual risk score is a starting point but insufficient. CRISC Domain 2 tests more nuanced prioritisation criteria:

**Residual risk score**: Primary ranking criterion — higher score = higher priority.

**Risk appetite breach**: Risks exceeding the appetite threshold must be treated regardless of their absolute score. A Medium-rated risk that exceeds the organisation's "Low" appetite threshold is more urgent than a Medium-rated risk within a "Medium" appetite threshold.

**Velocity**: How quickly could this risk materialise and cause irreversible harm? A risk with a 3-month remediation window but a 1-month probability of materialisation is more urgent than its static score suggests.

**Treatability**: How feasible is it to reduce this risk? A High risk that can be mitigated quickly and cheaply should be prioritised over a High risk where treatment is complex and long-term.

**Regulatory exposure**: Risks carrying regulatory consequence (GDPR, FCA, PCI DSS) should be prioritised — regulatory consequences often outpace the direct risk impact.

**Business criticality of affected asset**: A Medium risk to a mission-critical system may warrant higher priority than a High risk to a peripheral system.

**Treatment dependency**: Risks that cannot be treated until a predecessor action is complete (e.g. a risk dependent on a new system being deployed). These require tracking on the treatment roadmap even if not immediately actionable.

### The Risk Prioritisation Matrix

A practical prioritisation tool combines residual risk score with velocity and treatability:

| Priority | Residual Score | Velocity | Treatability | Action |
|---|---|---|---|---|
| Immediate | High/Critical | Fast | Any | Emergency treatment; escalate to board if Critical |
| Short-term | High/Critical | Medium | Feasible | Treatment plan required within 30 days |
| Medium-term | Medium-High | Any | Feasible | Treatment plan required within 90 days |
| Planned | Medium | Slow | Complex | Include in annual treatment roadmap |
| Monitor | Low/Medium | Slow | N/A | Accept with monitoring; review quarterly |

---

## Concept 8: Risk Assessment Documentation

CRISC Domain 2 requires candidates to know what documentation a complete risk assessment produces. Documentation is not just an audit artefact — it is the mechanism by which risk decisions are made accountable and traceable.

**Required documentation (CRISC framework):**

**Risk assessment methodology document**: The documented approach used. Defines scope, scales, scoring criteria, assessment process, and review triggers. Must exist *before* any assessment is conducted.

**Risk register entries**: For each risk: full risk scenario, inherent assessment, control assessment (controls listed with effectiveness ratings), residual assessment, risk owner, risk appetite status.

**Control effectiveness evidence**: For each control listed as "effective" — evidence that it was verified, not just assumed. Penetration test reports, audit findings, configuration review outputs, access review records.

**Risk assessment report**: Summary document produced at the conclusion of the assessment exercise. Includes: methodology used, scope, key findings, top risks, risks exceeding appetite, treatment recommendations, and resource requirements.

**Risk treatment plan**: Documented treatment decisions for all risks requiring treatment (see Domain 3, G2-11).

**Risk acceptance records**: Documented, authorised acceptance decisions for risks being accepted above the normal threshold (see G2-07).

---

## Concept 9: Communicating Risk Assessment Results

CRISC Domain 2 explicitly tests communication of risk assessment results — recognising that even a perfect assessment is worthless if the results are not communicated effectively to decision-makers.

### Audience-Appropriate Communication

| Audience | What they need | Format |
|---|---|---|
| **Board** | Business risk picture; total exposure vs appetite; investment required | Top-risks summary in business language; risk posture vs appetite; trend chart |
| **Executive Committee / CISO** | Detailed risk portfolio; treatment priorities; resource requirements | Full risk register summary; top 10 risks; treatment roadmap |
| **Security Committee** | All High/Critical risks; treatment status; new risks; overdue actions | Risk register extract; treatment action tracker |
| **Risk Owners** | Their specific risks; treatment obligations; deadlines | Individual risk register entries; treatment plan |
| **IT Operations / First Line** | Technical risks in their domain; control requirements | Domain-specific risk summary; specific control requirements |

### Translating Technical Risk to Business Language

The most tested CRISC communication skill: translating technical assessment results into language that non-technical executives understand and can act on.

**Technical language (not board-appropriate)**:
> "We have identified 47 CVEs rated CVSS 9.0+ on internet-facing infrastructure, including CVE-2024-12345 affecting our web application framework. Exploitation could enable RCE."

**Business language (board-appropriate)**:
> "Our assessment has identified critical vulnerabilities in our customer-facing web systems. These vulnerabilities could be exploited by external attackers to access customer data, resulting in an estimated regulatory fine exposure of £1.8M under GDPR and potential operational disruption of 3–7 days. Remediation requires £85,000 in emergency patching and security tooling investment. Without remediation, we estimate a 40% probability of exploitation within 6 months."

The second statement answers the questions a board member actually asks: How bad? How likely? How soon? How much to fix?

---

## Common Mistakes and Failures

**1. Assessing likelihood without factoring in current controls.**
Scoring inherent likelihood and presenting it as residual likelihood. This overstates risk and produces unnecessarily alarming results — but only if controls are genuinely effective. If controls are not assessed, the inherent score may actually understate real exposure.

**2. Impact assessed only financially.**
Risks with low financial impact but catastrophic reputational or regulatory impact are rated Low. They receive no treatment priority. Then they materialise and cause disproportionate damage.

**3. Control effectiveness assumed rather than verified.**
Controls rated Highly Effective based on the fact that they exist in policy documents. No testing. No evidence. The residual risk score reflects a fantasy control environment.

**4. Risk assessment producing identical results every year.**
The same risks at the same scores with the same treatment plans. No change. This is either evidence of extraordinary stability (unlikely) or evidence that the assessment is being copy-pasted from year to year (common). A valid assessment reflects the changing threat landscape and evolving control environment.

**5. Residual risk presented without confidence levels.**
A residual score of Medium (6) presented with the same confidence as a score derived from extensive testing and verified controls. The uncertainty in the assessment should be reflected in how results are communicated.

**6. Risk profile presented without trend data.**
The board sees a snapshot: 3 Critical, 7 High, 14 Medium risks. With no comparison to prior periods, they cannot assess whether the programme is improving. Always provide trend context.

---

## Exam Angle

**CRISC Domain 2 — specific exam guidance:**

Domain 2 questions are heavily scenario-based and test analytical judgment, not just recall. Common question types:

- **Scenario with incomplete information**: "Given the following environment, what additional information do you need before completing the risk assessment?" (Tests understanding of what inputs are required for a valid assessment)
- **Control effectiveness**: "A control is listed as 'implemented' but has not been tested in 18 months. How should this affect the residual risk score?" (Answer: treat as Partially Effective or Not Tested; do not apply full risk reduction)
- **Impact dimension**: "A risk has negligible financial impact but could result in loss of PCI DSS certification. How should impact be rated?" (Answer: Catastrophic — loss of ability to process card payments is existential for many businesses)
- **Prioritisation**: "Given limited resources, which of these four risks should be treated first?" (Answer: not always the highest score — velocity, regulatory exposure, and treatability all factor in)
- **Communication**: "The CISO needs to present this risk to the board. How should the risk be expressed?" (Answer: business impact language, not technical detail)

**Key CRISC Domain 2 terminology:**
- Threat event frequency (TEF), vulnerability condition, likelihood
- Single Loss Expectancy (SLE), Annualised Rate of Occurrence (ARO), Annualised Loss Expectancy (ALE)
- Inherent risk, residual risk, risk profile
- Control effectiveness, compensating control, control gap
- Risk aggregation, risk concentration, correlated risk, risk velocity

---

## GUARDIAN's Take

CRISC Domain 2 is where the intellectual rigour of risk management is most clearly visible — and where most organisations fall shortest.

The assessment process described in this note — systematic, multi-dimensional, control-verified, business-connected — is the ideal. The reality in most organisations is something considerably less disciplined. Controls are assumed effective because they exist in policy. Impact is assessed by the security team alone without business unit input. Likelihood scores are chosen by gut feel rather than threat intelligence. Residual risk scores are accepted without challenge because everyone just wants to finish the spreadsheet and move on.

The consequence: a risk register that is internally consistent, methodologically tidy, and fundamentally wrong. It tells you the risk landscape as people *believe* it to be, not as it actually *is*.

Closing that gap — between the assessed risk and the real risk — is the highest-value activity a risk professional can perform. It requires:

- Independent verification of control effectiveness (not just asking "do you have this control?")
- Honest engagement with threat intelligence (not just listing threats from a template)
- Genuine multi-dimensional impact assessment (not just what the security team thinks the financial exposure is)
- Willingness to deliver uncomfortable assessments to decision-makers who would prefer comfortable ones

CRISC Domain 2 tests whether you understand the process. Professional practice tests whether you have the courage to execute it honestly. Both matter. Master the process first — then build the courage through experience.

---
*Module: Module 2 — Risk Management | Guardian Curriculum*
