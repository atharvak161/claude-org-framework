---
tags: [guardian, grc, module-12, cism, domain-2, risk-management, risk-assessment, risk-treatment]
module: 12
cert-coverage: [cism]
difficulty: intermediate
date: 2026-04-25
guardian-refs: ["G12-01 — CISM Overview", "G12-02 — CISM Domain 1", "G2-01 through G2-12 — Risk Management Module", "G3-04 — ISO 27001 Risk Assessment"]
---

# G12-03 — CISM Domain 2: Information Security Risk Management

> [!abstract] What This Note Covers
> Domain 2 accounts for 20% of the CISM exam. It tests your ability to manage information security risk to an acceptable level — from identification and assessment through treatment, monitoring, and reporting. This note covers all key Domain 2 concepts with CISM exam application.

---

## What Domain 2 Tests

Domain 2 tests **risk management judgment** from a management perspective. Questions assess whether you can:

- Identify and assess information security risks systematically
- Make risk treatment decisions aligned to business risk appetite
- Communicate risk posture to management in business terms
- Build and maintain a risk management programme
- Use risk information to prioritise security programme decisions
- Monitor risk and adapt the programme as risk changes

**The governing principle for Domain 2**: Risk management exists to support informed business decisions — not to eliminate all risk (impossible) but to manage risk to within acceptable tolerances and ensure decision-makers have the information they need.

---

## 2.1 Risk Concepts: The Foundation

### The Risk Equation

**Risk = Threat × Vulnerability × Impact**

Or alternatively (in ISO 31000 terms):
**Risk = Likelihood × Consequence**

For CISM, understanding risk components is essential:

**Threat**: Any circumstance or event with the potential to cause harm. Threats are external to the organisation's control — cyberattacks, natural disasters, human error, regulatory changes.

**Vulnerability**: A weakness in a system, process, or control that can be exploited by a threat. Vulnerabilities are (partially) within the organisation's control — they can be mitigated through controls.

**Impact**: The consequence of a threat exploiting a vulnerability. Measured in financial loss, operational disruption, reputational damage, or regulatory exposure.

**The risk management insight**: Threats cannot usually be eliminated (you can't stop threat actors from existing). Vulnerabilities can be reduced (through controls). Impact can be reduced (through resilience planning). Risk management focuses on reducing vulnerability and impact — not eliminating threats.

### Risk Appetite, Tolerance, and Capacity

These three concepts are frequently confused and frequently tested on CISM:

**Risk capacity**: The maximum risk an organisation can absorb without threatening its fundamental objectives or viability. An absolute limit — beyond this, the organisation cannot function.

**Risk appetite**: The amount and type of risk the organisation is prepared to accept in pursuit of its objectives. A strategic statement of what risk is acceptable. "We are willing to accept moderate cyber risk in order to achieve our digital transformation objectives."

**Risk tolerance**: The acceptable deviation from the risk appetite. If the appetite is "moderate cyber risk," the tolerance defines what "moderate" means operationally — specific metrics and thresholds.

**CISM exam application**:
- Risk appetite is set by the board
- Risk tolerance defines operational thresholds for the security programme
- Risk capacity is an absolute limit that cannot be exceeded regardless of business pressure
- When asked who sets risk appetite: the board (not the CISO, not IT)

### Residual Risk vs Inherent Risk

**Inherent risk**: The risk level before any controls are applied. The raw, unmitigated risk.

**Residual risk**: The risk level after controls have been applied. The risk that remains after the organisation's mitigation efforts.

**CISM principle**: Organisations accept residual risk — not inherent risk. The security programme's job is to reduce inherent risk to an acceptable residual risk level through controls. Residual risk must be explicitly accepted by the risk owner (not the security team).

---

## 2.2 Risk Identification

### Asset Identification

Risk assessment begins with understanding what must be protected:

**Information assets**: The data, information, and knowledge the organisation depends on — customer data, financial records, IP, employee data.

**Systems and infrastructure**: The technical systems that process, store, or transmit information — servers, networks, applications, cloud services.

**Business processes**: The processes that depend on information systems — customer onboarding, payment processing, HR management.

**People**: Staff with knowledge or access that is critical to operations.

**Third parties**: Suppliers and partners with access to systems or data.

### Threat Identification

**Threat landscape assessment**: What threats are most relevant to the organisation's industry, geography, and technology environment?

**Sources for threat identification:**
- Industry threat intelligence (ISAC reports; NCSC annual threat review)
- Internal incident history (what threats have we experienced?)
- Regulatory guidance (what threats do regulators most frequently address?)
- Peer organisation experience (what threats affect similar organisations?)
- MITRE ATT&CK (structured threat actor tactics and techniques)

**Threat categories for CISM:**
- Malicious external actors (cybercriminals, nation-states, hacktivists)
- Malicious insiders (disgruntled employees, compromised credentials)
- Unintentional insiders (human error, accidental disclosure)
- Natural events (flooding, earthquake, fire)
- System failures (hardware failure, software bugs)
- Supply chain threats (compromised suppliers, software vulnerabilities)

### Vulnerability Identification

**Vulnerability assessment methods:**
- Vulnerability scanning (automated scanning for known technical vulnerabilities)
- Penetration testing (skilled adversarial testing of controls)
- Security assessments (review of controls against standards)
- Audit findings (gaps identified in internal and external audits)
- Process reviews (identification of procedural weaknesses)

---

## 2.3 Risk Assessment Methodologies

### Qualitative Risk Assessment

Assessments expressed in descriptive scales — Low, Medium, High, Critical — rather than numerical values.

**Advantages**: Faster; accessible to non-quantitative stakeholders; appropriate when data for quantification is insufficient.

**Disadvantages**: Subjective; difficult to compare across different assessors; limited precision for prioritisation.

**Typical output**: Risk heat map showing threats/vulnerabilities mapped to likelihood × impact quadrants.

### Quantitative Risk Assessment

Assessments expressed in numerical values — typically financial (£ of expected loss).

**Key metrics:**
- **Asset Value (AV)**: The financial value of the asset being assessed
- **Exposure Factor (EF)**: The percentage of the asset value that would be lost if the risk materialised
- **Single Loss Expectancy (SLE)**: AV × EF = the expected loss from a single incident
- **Annual Rate of Occurrence (ARO)**: How often the threat is expected to occur per year
- **Annual Loss Expectancy (ALE)**: SLE × ARO = the expected annual loss from the risk

**Example**: 
- Server containing customer database: AV = £500,000
- Ransomware encrypts 80% of data: EF = 0.8
- SLE = £500,000 × 0.8 = £400,000
- ARO = 0.2 (estimated once every 5 years)
- ALE = £400,000 × 0.2 = £80,000 per year

**Advantages**: Precise; enables cost-benefit analysis of controls (control cost < ALE reduction = justified investment); communicates risk in financial terms.

**Disadvantages**: Requires data that is often unavailable; false precision from uncertain inputs; time-consuming.

### Semi-Quantitative Assessment

Combines qualitative categories with numerical scoring to enable ranking and prioritisation. Most practical organisations use a semi-quantitative approach — defining categories (1–5 for likelihood; 1–5 for impact) and multiplying to produce risk scores for comparison.

**CISM exam principle**: For presenting risk to the board, quantitative (financial) risk framing is most effective. For internal prioritisation, semi-quantitative approaches are most practical. For initial assessments of emerging risks, qualitative approaches are fastest.

---

## 2.4 Risk Treatment

### The Four Treatment Options

**Accept (Risk Acceptance)**: The risk is within appetite; no additional controls are required. The organisation is aware of the risk and has consciously decided to accept it.

*When appropriate*: Residual risk is within risk tolerance after existing controls are considered.

*Key requirement*: Acceptance must be explicit and documented — signed by the risk owner (not the security team).

**Mitigate (Risk Reduction)**: Implement controls to reduce the likelihood or impact of the risk. The most common treatment option.

*When appropriate*: Controls can reduce the risk to within appetite at a cost justified by the risk reduction.

*Cost-benefit test*: Control cost should not exceed the expected risk reduction (ALE reduction for quantitative assessments).

**Transfer (Risk Transfer/Sharing)**: Move the financial consequences of the risk to a third party — typically through insurance or contractual transfer.

*When appropriate*: The risk cannot be sufficiently mitigated internally; the financial exposure justifies insurance cost.

*Limitation*: Insurance transfers financial consequences; it does not reduce the likelihood of the risk occurring, and it does not address reputational or regulatory consequences.

**Avoid (Risk Avoidance)**: Cease the activity that creates the risk. Exit the business line; stop processing certain data types; discontinue the technology.

*When appropriate*: The risk cannot be managed to within appetite and the activity creating the risk is not sufficiently valuable to justify the exposure.

*CISM principle*: Avoidance is sometimes the most appropriate treatment — when a business activity creates risk that cannot be adequately mitigated and the activity's value does not justify the risk.

### Risk Treatment Decision Framework

1. **Assess the risk** (likelihood × impact) and determine current residual risk
2. **Compare to risk appetite** — is the residual risk within appetite?
3. **If not**: Identify treatment options and their cost/effectiveness
4. **Apply the most cost-effective treatment** that brings risk within appetite
5. **Document the treatment decision** and obtain risk owner sign-off
6. **Reassess residual risk** after treatment and confirm it is within appetite
7. **Accept the final residual risk** explicitly

---

## 2.5 Risk Register

The **risk register** is the operational tool for risk management — the living document that captures all identified risks, their assessments, treatment decisions, and current status.

**Risk register components:**

| Field | Content |
|---|---|
| Risk ID | Unique identifier |
| Risk description | What is the risk? (threat + vulnerability + impact) |
| Asset/process affected | What is at risk? |
| Inherent risk | Likelihood and impact before controls |
| Existing controls | What controls currently mitigate this risk? |
| Residual risk | Likelihood and impact after existing controls |
| Risk treatment decision | Accept / Mitigate / Transfer / Avoid |
| Treatment actions | Specific actions to address the risk |
| Risk owner | Named individual accountable for the risk |
| Review date | Next scheduled risk review |
| Status | Open / In treatment / Accepted / Closed |

**Risk register governance:**
- Reviewed at defined intervals (quarterly for high risks; annually for low risks)
- Updated when significant changes occur (new threats; new vulnerabilities; control changes)
- Presented to management/board as a summary risk report
- Used to prioritise security programme investment

---

## 2.6 Key Risk Indicators (KRIs)

**KRIs** are metrics that provide early warning signals that risk is increasing before an incident occurs. They are leading indicators — they measure conditions that precede risk materialisation.

**Effective KRIs:**
- Directly related to a specific identified risk
- Measurable and trackable over time
- Actionable — when a KRI threshold is breached, a defined response is triggered
- Timely — reported frequently enough to enable intervention before the risk materialises

**Example KRI mapping:**

| Risk | KRI | Threshold | Response |
|---|---|---|---|
| Credential compromise | Number of privileged accounts without MFA | >5 | Security alert; immediate MFA enrollment |
| Ransomware | Unpatched critical vulnerabilities (age >14 days) | >10 | Escalation to CISO; expedited patch process |
| Phishing compromise | Phishing simulation click rate | >10% | Increased awareness training; targeted interventions |
| Insider threat | Number of accounts not reviewed in >90 days | >20 | Immediate access review |
| Third-party breach | Days since last critical supplier assessment | >365 | Trigger assessment |

**CISM exam principle**: When asked how the CISO provides management with early warning of increasing risk, the answer involves KRIs — not incident counts (lagging indicators) and not control status reports (compliance measures).

---

## 2.7 Risk Communication and Reporting

**Translating risk for management**: Risk reports for management and the board must translate technical risk findings into business terms.

**Not**: "We have 47 unpatched critical vulnerabilities in our network infrastructure."

**Yes**: "Our current vulnerability posture creates an estimated 30% annual probability of a significant breach. The estimated financial exposure is £2.3M (direct costs) + potential ICO fine exposure. The investment required to reduce this probability to 10% is £X."

**Risk reporting components for management:**

*Overall risk posture*: Are we within risk appetite? Trending better or worse?

*Top risks*: The 3–5 highest-priority risks — what they are, their status, and what is being done.

*KRI status*: Are any KRIs in amber or red?

*Treatment progress*: Are planned risk treatments being implemented on schedule?

*New risks*: Any newly identified risks since the last report.

*Risk decisions required*: Any risks where management input or decision is needed.

---

## 2.8 Integration with Enterprise Risk Management (ERM)

**Why integration matters**: Information security risk is one category of enterprise risk — alongside financial risk, operational risk, regulatory risk, strategic risk, and reputational risk. A security programme that manages security risk in isolation creates:

- Duplicated processes (separate risk assessments for security, finance, operations)
- Inconsistent risk language (security uses different scales than ERM)
- Missed correlations (a security risk may also be a regulatory risk and a financial risk)
- Governance gaps (the board sees consolidated enterprise risk but security risk is separately managed)

**Integration requirements:**

*Common risk language*: Security risk assessments should use the same likelihood and impact scales as the enterprise risk framework.

*Escalation paths*: Security risks above defined thresholds should automatically be escalated to the enterprise risk register for board visibility.

*Common risk owner structure*: Security risk owners should be the same business owners as enterprise risk owners (not security staff).

*Consistent reporting*: Security risk reports should feed into and be consistent with enterprise risk reports.

---

## Domain 2 Exam Practice: Key Question Patterns

**Pattern 1: Risk treatment decision**

Q: A risk assessment identifies a critical vulnerability in a legacy system that cannot be patched. The cost of replacement is £500K. The estimated annual loss expectancy is £80K. What is the MOST appropriate risk treatment?

A: The cost of replacement (£500K) significantly exceeds the ALE (£80K). **Accept the risk** with documented compensating controls (network segmentation, enhanced monitoring), or explore whether risk transfer (insurance) is available. Pure mitigation at £500K is not cost-justified.

**Pattern 2: Risk appetite ownership**

Q: An information security manager has identified a high-risk vulnerability that would cost £200K to remediate. The business unit argues that the risk should be accepted because the remediation cost is too high. What should the manager do?

A: Ensure the risk is **documented and escalated to the appropriate risk owner** for formal acceptance. The risk acceptance decision is not the security manager's to make — it belongs to the risk owner (typically a senior business executive). The security manager's role is to ensure the decision is informed and documented.

**Pattern 3: KRI selection**

Q: Which metric BEST provides early warning that the risk of a ransomware attack is increasing?

A: **Number of unpatched critical vulnerabilities** — this is a leading indicator (vulnerability exists before exploitation). Incident count is a lagging indicator (ransomware has already occurred).

**Pattern 4: Residual risk acceptance**

Q: After implementing controls, the residual risk of a specific threat is still above the organisation's risk tolerance. Who should accept this residual risk?

A: **The risk owner** — the senior business executive accountable for the asset or process at risk. Not the CISO; not the security team; not the IT department.

**Pattern 5: Risk assessment approach**

Q: The CISO needs to present security risk to the board in a way that enables resource allocation decisions. Which approach is MOST appropriate?

A: **Quantitative assessment** expressing risk in financial terms (£ of expected loss) — enabling cost-benefit analysis and comparison of investment options. Qualitative heat maps are less useful for resource allocation decisions.

---

## Common Mistakes in Domain 2

**1. Treating risk acceptance as a default when controls are too expensive.**
Risk acceptance must be explicit, documented, and signed by the risk owner. "We can't afford to fix it, so we'll accept it" without formal documentation is not risk management.

**2. Confusing risk appetite (board-level) with risk tolerance (operational thresholds).**
The board sets appetite; management operationalises it through tolerance thresholds. CISM questions that ask who sets risk appetite: always the board.

**3. Using lagging indicators as KRIs.**
Incident counts measure what has already happened — they are not early warning indicators. KRIs must be leading indicators that signal increasing risk before incidents occur.

**4. Missing the ERM integration question.**
Domain 2 regularly tests ERM integration. The CISO should not manage security risk in isolation — it must be integrated with enterprise risk management to provide a complete organisational risk picture.

**5. Recommending expensive controls for low-residual-risk scenarios.**
When residual risk (after existing controls) is within risk tolerance, recommending additional costly controls is incorrect. Accept the residual risk. Only recommend additional controls when residual risk exceeds tolerance.

---

## GUARDIAN's Take

Domain 2 is where CISM connects security programme management to the language of business leadership. Risk is how the board understands the security posture. Risk appetite is how the board communicates what it is willing to accept. The security manager who can translate technical vulnerabilities into financial exposure, and who can articulate the cost-benefit of security investment in risk reduction terms, is the security manager who gets resources and earns board credibility.

The risk acceptance principle is the one that most confuses candidates who come from a technical background. The instinct is to say: "If there's a high risk, we should fix it." The CISM answer is: "High risk relative to risk appetite requires treatment. The treatment decision — whether to mitigate, transfer, avoid, or accept — belongs to the risk owner, not the security team. The security team's role is to provide the information needed to make that decision, document the decision, and ensure residual risk is within appetite."

That distinction — between informing the decision and making the decision — is fundamental to the governance mindset that CISM validates.

---
*Module: Module 12 — CISM Certification | Guardian Curriculum*
