---
tags: [guardian, grc, module-3, iso27001, clause-9, performance-evaluation, monitoring, internal-audit, management-review]
module: 3
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G3-07 — ISO 27001 Clause 8 — Operation", "G3-09 — ISO 27001 Clause 10 — Improvement", "G3-14 — Internal Audit", "G3-16 — Management Review", "G2-12 — CRISC Domain 4 — Risk and Control Monitoring", "G14-03 — Security Metrics and KPIs"]
---

# G3-08 — ISO 27001 Clause 9 — Performance Evaluation

> [!abstract] What This Note Covers
> By the end of this note, you will understand every requirement of ISO 27001 Clause 9 — monitoring and measurement, internal audit, and management review — including what good performance evaluation looks like, what the mandatory outputs of each activity are, and the common failures that undermine the Check phase of the PDCA cycle.

---

## Why This Exists

Clause 9 is the "Check" in the Plan-Do-Check-Act cycle. Without it, the organisation has no reliable way of knowing whether its ISMS is working — whether controls are effective, whether risks are being managed to within the risk appetite, whether objectives are being achieved, or whether the ISMS itself is functioning as designed.

The three activities in Clause 9 — monitoring and measurement, internal audit, and management review — together constitute the assurance infrastructure of the ISMS. They answer three distinct but related questions:

- **Monitoring and measurement (9.1)**: Are our controls working and are we meeting our objectives?
- **Internal audit (9.2)**: Is the ISMS conforming to ISO 27001 requirements and operating as planned?
- **Management review (9.3)**: Is the ISMS still appropriate, adequate, and effective given our current context?

None of these questions can be answered by the security team alone — they require independent input (internal audit), management engagement (management review), and systematic data collection (monitoring). This is why Clause 9 is the governance heartbeat of the ISMS: when it functions properly, leadership has reliable, current information about the security programme. When it fails, the ISMS drifts and leadership is managing in the dark.

---

## Clause 9 Overview: Three Requirements

| Sub-clause | Title | Core question |
|---|---|---|
| **9.1** | Monitoring, measurement, analysis and evaluation | What are we measuring, how, and what does the data tell us? |
| **9.2** | Internal audit | Does the ISMS conform to requirements and operate effectively? |
| **9.3** | Management review | Is the ISMS appropriate, adequate, and effective? |

---

## Clause 9.1 — Monitoring, Measurement, Analysis and Evaluation

### The Requirement

> *"The organisation shall determine: a) what needs to be monitored and measured, including information security processes and controls; b) the methods for monitoring, measurement, analysis and evaluation, as applicable, to ensure valid results; c) when the monitoring and measurement shall be performed; d) who shall monitor and measure; e) when the results from monitoring and measurement shall be analysed and evaluated; f) who shall analyse and evaluate these results. The organisation shall evaluate the information security performance and the effectiveness of the information security management system. The organisation shall retain appropriate documented information as evidence of the monitoring and measurement results."*

### What Must Be Monitored and Measured

Clause 9.1 does not specify what to monitor — it requires the organisation to *determine* what is relevant. In practice, effective ISMS monitoring covers:

**Control effectiveness monitoring**: Are the controls selected in the SoA actually working?
- MFA coverage rate (% users enrolled)
- Patch compliance rate (% critical CVEs patched within SLA)
- Phishing simulation click rate
- Access review completion rate
- Backup restoration success rate
- SIEM alert response rate within SLA

**Risk posture monitoring**: Are risks being managed to within the risk appetite?
- Number of Critical/High/Medium/Low risks by category
- Residual risk score trends (improving or deteriorating?)
- Risks exceeding the risk appetite threshold
- Treatment plan action completion rate (% on time)
- Open nonconformities from last audit

**ISMS process effectiveness**: Are ISMS processes operating as designed?
- Risk assessment currency (date of last assessment for each risk)
- Documented information review compliance (policies reviewed within schedule)
- Training completion rates by role
- Supplier assessment completion rates
- Incident response time metrics (MTTD, MTTR)

**Incident and near-miss tracking**:
- Incident count by category and severity
- Mean time to detect and respond
- Near-miss reporting rate (a positive indicator of security culture)
- Repeat incidents (same type occurring multiple times — indicates unresolved root cause)

**Objective progress**: Are information security objectives being achieved?
- Progress against each defined objective (Clause 6.2)
- On-track/off-track status with commentary

### Methods for Monitoring and Measurement

For each metric, the organisation must define the method — how data will be collected, by whom, and how frequently:

| Metric | Method | Frequency | Owner |
|---|---|---|---|
| Patch compliance rate | Automated vulnerability scanning | Weekly (continuous) | IT Operations |
| MFA coverage | Directory audit (Azure AD / Okta report) | Monthly | IT Operations |
| Phishing click rate | Simulated phishing campaign | Quarterly | Security Team |
| Training completion | LMS completion report | Monthly | HR / Security Team |
| Incident count and MTTD/MTTR | Incident log analysis | Monthly | SOC Lead |
| Risk register currency | Risk register review date tracking | Monthly | Risk Manager |
| Treatment plan action completion | Risk treatment tracker | Monthly | Risk Manager |
| Access review completion | Access review record audit | Quarterly | IT Operations / Risk Manager |

### Analysis and Evaluation

Collecting data is not sufficient — it must be analysed and evaluated. Analysis means: processing the raw data into meaningful metrics. Evaluation means: comparing those metrics against defined targets or benchmarks and drawing conclusions.

Example analysis and evaluation for patch compliance:
- **Data collected**: Vulnerability scan shows 47 critical CVEs affecting 312 servers; 8 are unpatched beyond 30 days (2.6% non-compliance)
- **Metric**: 97.4% patch compliance rate
- **Target**: >95%
- **Evaluation**: Within target. No escalation required. Monitor for trend.
- **Month-on-month trend**: Up from 94.1% last month. Improvement is sustained.
- **Action**: Continue current process. Review the 8 remaining exceptions next week.

Without this analytical layer, the data is noise. With it, it becomes decision-support information.

### Retained Evidence

Clause 9.1 requires retaining documented information as evidence of monitoring and measurement results. This means:
- Saving the outputs of monitoring activities (vulnerability scan reports, phishing simulation reports, training completion reports)
- Retaining analysis documents (monthly metrics dashboards, quarterly security reports)
- Recording evaluation conclusions and actions

These records serve as audit evidence (for both internal and external audits) and provide the historical data that enables trend analysis over time.

---

## Clause 9.2 — Internal Audit

### The Requirement

> *"The organisation shall conduct internal audits at planned intervals to provide information on whether the information security management system: a) conforms to: 1) the organisation's own requirements for its information security management system; 2) the requirements of this document [ISO 27001]; and b) is effectively implemented and maintained. The organisation shall: plan, establish, implement and maintain an audit programme(s) including the frequency, methods, responsibilities, planning requirements and reporting; define the audit criteria and scope for each audit; select auditors and conduct audits to ensure objectivity and the impartiality of the audit process; ensure that the results of the audits are reported to relevant management; retain documented information as evidence of the audit programme(s) and the audit results."*

### What Internal Audit Must Cover

Internal audit must assess conformance with two sets of requirements:

**1. ISO 27001 requirements**: Does the ISMS meet every "shall" requirement in Clauses 4–10? Does the ISMS documentation address all mandatory elements? Are the processes designed to satisfy the standard?

**2. The organisation's own requirements**: Does the ISMS operate as the organisation itself has defined? Are the organisation's own policies, procedures, and controls being followed? Are the risk treatment plans being executed?

Both dimensions are required. An internal audit that only checks "do you have a documented risk assessment methodology?" (ISO 27001 conformance) without also checking "is the risk assessment methodology actually being applied?" (effective implementation) satisfies neither requirement fully.

### The Internal Audit Programme

The organisation must establish an **audit programme** — a planned schedule of internal audit activities that covers the full scope of the ISMS over a defined period (typically 3 years for the certification cycle).

**Audit programme elements:**

| Element | Description |
|---|---|
| **Audit schedule** | When each area of the ISMS will be audited (annual calendar or 3-year rolling programme) |
| **Audit scope** | What each audit covers (specific clauses, specific processes, specific controls) |
| **Audit methods** | Document review, interviews, observation, control testing, sampling |
| **Audit criteria** | The standards and requirements being audited against (ISO 27001 clauses, organisation's own policies) |
| **Auditor assignments** | Who will conduct each audit (with independence requirements — auditors must not audit their own work) |
| **Reporting requirements** | Who receives the audit report and in what timeframe |

A risk-based approach to audit programming is best practice: higher-risk areas and processes are audited more frequently than lower-risk ones. Processes with known weaknesses, recent incidents, or significant changes should be prioritised.

### Auditor Independence

The requirement that auditors "ensure objectivity and the impartiality of the audit process" is critical. Internal auditors must not audit activities they are responsible for or have recently worked in.

**Common independence failures:**
- The CISO auditing the ISMS programme they manage
- The IT Manager auditing the patch management process they operate
- A security analyst auditing the SIEM alerting process they configured

In smaller organisations where full independence is difficult to achieve, the organisation should:
- Rotate auditors so no one audits their own area
- Engage external support for specific audit activities where internal independence is not achievable
- Document the independence limitation and compensating measures

### Internal Audit Evidence

The internal audit must produce and retain:
- **Audit programme records**: The audit schedule and assignment records
- **Audit plan**: For each audit, the specific scope, criteria, methods, and timeline
- **Audit working papers**: Evidence collected during the audit (documents reviewed, interview notes, control test results, samples reviewed)
- **Audit report**: Findings, nonconformities, observations, opportunities for improvement, and conclusions
- **Corrective action records**: Actions agreed in response to findings, with owners and due dates (tracked into Clause 10.1)

The audit report must be provided to "relevant management" — at minimum, the CISO. For significant findings (particularly major nonconformities), escalation to the executive team or audit committee is appropriate.

### What a Good Internal Audit Finds

A common misconception: a clean internal audit (no nonconformities) is evidence of a mature ISMS. In reality, it is often evidence of an audit that did not look hard enough.

A mature ISMS regularly surfaces minor nonconformities and observations through internal audit — because it is looking honestly for weaknesses and because it is operating in a changing environment where gaps inevitably emerge. A programme that finds nothing significant year after year is either exceptionally mature or not conducting genuine audits.

Auditors during Stage 2 and surveillance audits will be skeptical of internal audit programmes with consistently clean results. They will probe: "What did your internal audit find last year?" and "What corrective actions resulted from the last internal audit?" If the answers are "nothing significant" and "we didn't need any," the external auditor will be looking very carefully.

---

## Clause 9.3 — Management Review

### The Requirement

> *"Top management shall review the organisation's information security management system at planned intervals to ensure its continuing suitability, adequacy and effectiveness. The management review shall include consideration of: a) the status of actions from previous management reviews; b) changes in external and internal issues that are relevant to the information security management system (4.1); c) feedback on the information security performance, including trends in: 1) nonconformities and corrective actions; 2) monitoring and measurement results; 3) audit results; 4) fulfilment of information security objectives; d) feedback from interested parties; e) results of risk assessment and the status of the risk treatment plan; f) opportunities for continual improvement. The outputs of the management review shall include decisions related to: continual improvement opportunities; any need for changes to the information security management system. The organisation shall retain documented information as evidence of the results of management reviews."*

### What Management Review Is

Management review is a formal meeting of senior leadership (top management) specifically to review the ISMS — its performance, its adequacy, and the decisions needed to keep it effective.

It is **not**:
- A security team update meeting
- A project status meeting
- A brief agenda item at a board meeting where no substantive discussion occurs
- A document that is approved without a meeting

It **is**:
- A meeting attended by top management (CEO, CISO, relevant executives) at defined intervals (typically annually, with some organisations doing quarterly)
- A structured review of all required inputs (listed in 9.3)
- A forum for making decisions about the ISMS — approving changes, allocating resources, setting improvement priorities
- A documented event with minutes recording inputs discussed, decisions made, and actions assigned

### The Required Inputs

Clause 9.3 specifies what must be considered in the management review. The CISO (or equivalent) must prepare and present all of these:

**a) Status of actions from previous reviews:**
What was decided last time? What actions were assigned? Have they been completed? What is the current status of outstanding actions?

**b) Changes in external and internal issues (Clause 4.1):**
What has changed in the organisation's context since the last review? New regulations? Changed threat landscape? Significant organisational changes? How have these changes affected the ISMS?

**c) Information security performance — specifically:**

*Nonconformities and corrective actions*: How many nonconformities were identified (from internal audit, external audit, incident investigation)? What corrective actions are open? What is their status?

*Monitoring and measurement results*: Key metrics from Clause 9.1 — patch compliance trends, phishing click rates, incident counts, access review completion, training completion. Are the trends positive or negative?

*Audit results*: Summary of internal audit findings since the last management review. Key nonconformities, observations, and opportunities for improvement.

*Fulfilment of information security objectives*: Progress against each objective defined in Clause 6.2. Which are on track? Which are behind? Why?

**d) Feedback from interested parties:**
What are customers saying about security (from sales and account management)? Have regulators issued any guidance or taken any enforcement action relevant to the organisation? What are suppliers reporting? Have there been any complaints or concerns?

**e) Risk assessment results and status of risk treatment plan:**
Current risk posture summary — how many Critical/High/Medium/Low risks? Are risks within appetite? What is the status of the risk treatment plan — actions on track or overdue? Any new significant risks identified since the last review?

**f) Opportunities for continual improvement:**
What opportunities exist to improve the ISMS — whether identified through internal audit, monitoring data, incident review, or CISO judgment?

### The Required Outputs

Management review must produce documented decisions on:

**Continual improvement opportunities**: Which improvement opportunities will be pursued? Who is responsible? What resources are required? What is the timeline?

**Any need for changes to the ISMS**: Does the ISMS need to change — scope adjustments, policy updates, control changes, process improvements, resource changes?

These outputs must be captured in the management review minutes and turned into action items with named owners and due dates.

### Management Review Frequency

The standard requires review "at planned intervals" — it does not specify the frequency. Most organisations conduct management review annually. Organisations with rapidly changing environments, recent significant incidents, or high regulatory exposure should consider semi-annual or quarterly reviews.

Auditors will check:
- Has the management review been conducted within the defined interval?
- Were all required inputs actually discussed (or is the minutes a template that was auto-populated)?
- Did the review produce meaningful outputs — decisions, actions, resource commitments?
- Were actions from the previous review completed before the current review?

### Management Review vs Security Committee

Many organisations have a Security Committee that meets quarterly — is this the management review?

It can be, if:
- It is attended by top management (CEO or equivalent, not just the CISO and IT Director)
- It covers all the required inputs from Clause 9.3
- It produces the required outputs (decisions on improvement opportunities and ISMS changes)
- Minutes are retained as evidence

Quarterly Security Committee meetings that cover all required inputs can collectively satisfy the management review requirement, with the annual meeting serving as the formal, comprehensive review.

---

## The Details That Matter

### Metrics: What Good Looks Like

The security metrics programme supporting Clause 9.1 should follow these principles:

**SMART metrics**: Specific, Measurable, Achievable, Relevant, Time-bound. "Security is improving" is not a metric. "Phishing click rate decreased from 18% to 7% over 12 months" is.

**Leading and lagging indicators**: Lagging indicators (incident count, breach cost) tell you what happened. Leading indicators (vulnerability density, training completion, near-miss reporting rate) tell you where risk is heading. Balance both.

**Trend over snapshot**: A single metric reading is a data point. Three consecutive readings show a pattern. Twelve show a trend. Always present metrics in context of their historical trend.

**Executive-appropriate format**: The CISO's security metrics dashboard and the board's security report should look very different. The board needs: are we within risk appetite? are objectives being achieved? what investment is required? The security team needs: which controls need attention? where are the gaps?

**Calibration to risk appetite**: Metrics should be explicitly connected to the risk appetite. "Patch compliance: 93% (target: 95% — Amber)" tells the reader exactly what the metric means and what action it implies.

### Internal Audit vs External Audit: The Relationship

| Dimension | Internal Audit | External Audit (Certification Body) |
|---|---|---|
| Frequency | Risk-based programme (annual/rolling 3-year) | Stage 1 + Stage 2 (certification); annual surveillance; triennial recertification |
| Independence | Independent of audited functions; employed by organisation | Fully independent; third-party accredited body |
| Scope | Full ISMS (all clauses over the programme cycle) | Full ISMS (certification); targeted (surveillance) |
| Output | Internal audit report; corrective action log | Audit report; certificate (or finding of nonconformity) |
| Purpose | Continuous improvement and internal assurance | Certification and external assurance |

Internal audit findings should inform the external audit — the certification body auditor will review internal audit results as part of the Stage 2 audit. A robust internal audit programme that has already identified and addressed weaknesses significantly reduces the risk of major nonconformities at the external audit.

The best preparation for an external audit is a genuine, rigorous internal audit conducted 2–3 months before the external audit date. Find the gaps yourself; fix them; demonstrate the fix. Do not leave it to the external auditor to find what the internal auditor should have found.

---

## Common Mistakes and Failures

**1. Monitoring metrics that are collected but not evaluated.**
A dashboard full of security metrics. Nobody reviews them between management review meetings. When a metric goes Amber, no action is triggered. The monitoring data exists but is not driving decisions. Clause 9.1 requires evaluation and action — not just data collection.

**2. Internal audit that audits only documentation, not operation.**
The internal auditor reviews the risk register, the SoA, the policies — and confirms they are complete and current. They do not test whether any controls are actually working. This satisfies Clause 9.2(a)(1) (conformance to standard) but not Clause 9.2(a)(2) (effective implementation).

**3. Management review that is a presentation, not a review.**
The CISO presents a 30-slide deck. Management listens. Two questions are asked. The minutes are signed. The CISO leaves. This may satisfy the letter of Clause 9.3 (a meeting occurred, minutes exist) but not its intent (top management engaged in genuine review and decision-making).

**4. Management review actions that are never completed.**
Previous management review identified 8 actions. The next management review agenda includes "status of actions from previous review" but reveals that 6 of the 8 are still open, 18 months later. This is a recurring finding in surveillance audits and is often a minor nonconformity.

**5. Internal audit programme not risk-based.**
Every clause is audited in the same depth every year, regardless of risk profile. High-risk areas (access control, patch management) receive the same attention as low-risk areas (clear desk policy). Audit resources are misallocated, and high-risk areas do not receive the scrutiny they warrant.

**6. Monitoring metrics not connected to objectives.**
Information security objectives are set in Clause 6.2. The monitoring programme collects metrics in Clause 9.1. But the metrics do not correspond to the objectives — there is no metric that tells management whether each objective is being achieved. The ISMS cannot demonstrate progress against its own goals.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Clause 9 is heavily tested in both Stage 1 and Stage 2 audits.
- Stage 1 (documentation): Is the internal audit programme documented? Is the management review process defined? Are monitoring metrics defined with methods and frequency?
- Stage 2 (operation): Has the internal audit been conducted? Are management review minutes complete and evidencing all required inputs? Are monitoring metrics being collected and evaluated? Are outputs from management review being actioned?

**Key auditor questions for Clause 9:**
- "Show me the last three internal audit reports. What were the key findings? What corrective actions resulted?"
- "Show me the management review minutes from the last review. What inputs were discussed? What decisions were made? What actions were assigned?"
- "What security metrics are you tracking? How are the trends? What metrics triggered management attention in the last 12 months?"
- "Show me evidence that a monitoring metric triggered an action in the last quarter."
- "Your audit programme shows Clause 8 was last audited 26 months ago. Why has this high-risk area not been audited more recently?"

**Common nonconformities:**
- 9.1: Monitoring results not retained (no saved outputs); metrics defined but not actually collected
- 9.2: Internal audit not conducted within the defined interval; auditor lack of independence; no corrective actions from audit findings
- 9.3: Management review not at top management level; required inputs not all covered; no documented outputs/decisions; previous actions not followed up

**CISM:**
- Domain 3 (Security Programme) includes the monitoring and reporting components of the ISMS. CISM candidates must understand how to design and operate a metrics programme that gives management meaningful visibility.
- Domain 1 (Governance) includes management review — the mechanism by which top management exercises oversight of the security programme.

**CRISC:**
- CRISC Domain 4 (Risk and Control Monitoring) maps directly to Clause 9.1. KRIs, KCIs, and control testing are the operational tools that produce the monitoring data Clause 9.1 requires.

---

## GUARDIAN's Take

Clause 9 is where the ISMS becomes self-aware — where the organisation develops the ability to see itself clearly and adjust based on what it finds.

The organisations that do Clause 9 well are the ones where management review is a substantive, engaged, sometimes uncomfortable conversation. Where the CISO presents metrics that show genuine weaknesses, not just the comfortable numbers. Where internal audit findings include things management did not want to hear. Where treatment plan slippage is escalated and addressed, not quietly tolerated.

The organisations that do it poorly treat Clause 9 as a compliance box. The internal audit is scheduled, conducted by someone without real independence, and produces findings that are carefully worded to sound actionable while being uncontroversial. The management review is a presentation where the CISO shows improvement on the easy metrics and carefully avoids the difficult ones. The minutes record that the review happened; they do not record that anything meaningful was discussed.

The external auditor will see through the second approach in a surveillance audit. The questions are not difficult: "Show me the three most significant findings from your last internal audit." "Walk me through the management review discussion about the risk posture." "What monitoring metric concerned you most in the last 12 months, and what did you do about it?"

These questions have one purpose: to find out whether Clause 9 is producing genuine organisational intelligence or comfortable fiction.

Build the genuine article. Make the internal audit find real things. Make the management review discuss them honestly. Make the monitoring data actually drive decisions. When Clause 9 works properly, the ISMS becomes something the organisation can actually trust — a reliable picture of reality that leadership uses to make better decisions.

That is the point of it all.

---
*Module: Module 3 — ISO 27001 | Guardian Curriculum*
