---
tags: [guardian, grc, module-2, risk-management, residual-risk, risk-acceptance, risk-appetite, documentation]
module: 2
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-15
guardian-refs: ["G2-02 — Risk Appetite and Risk Tolerance", "G2-05 — The Risk Register", "G2-06 — Risk Treatment", "G2-08 — Enterprise Risk Management", "G3-05 — ISO 27001 Clause 6 — Planning", "G3-11 — Statement of Applicability"]
---

# G2-07 — Residual Risk and Risk Acceptance

> [!abstract] What This Note Covers
> By the end of this note, you will understand what residual risk is, how it is calculated and documented, what genuine risk acceptance requires, how to structure formal risk acceptance decisions, and why the gap between stated and actual residual risk is the most dangerous blind spot in GRC programmes.

---

## Why This Exists

In 2019, Capital One suffered a breach affecting over 100 million individuals in the US and Canada. The attacker — a former AWS employee — exploited a misconfigured Web Application Firewall to access an S3 bucket containing customer data. Capital One had invested heavily in cloud security. They had controls. They had policies. They had a security team.

What they had not done was accurately assess the *residual* risk of their cloud configuration. The WAF misconfiguration was a known vulnerability class. The risk of server-side request forgery (SSRF) exploiting cloud metadata services was documented in AWS security guidance. But the residual risk — the risk *after* their controls were applied — was not accurately understood because the controls in place were not as effective as assumed.

Capital One accepted a level of residual risk based on a belief about their control environment that turned out to be wrong. The breach cost over $270 million in settlements, enforcement action from the OCC (US banking regulator), and a CISO departure.

Residual risk is not just a number in a spreadsheet. It is the organisation's *actual* exposure — the real level of danger once controls are accounted for. If the residual risk is miscalculated, every downstream decision — treatment choices, risk acceptance, board reporting, insurance limits — is built on a false foundation.

This note is about getting residual risk right, and about the formal, accountable process of accepting what remains.

---

## What Residual Risk Is

### Definition

**Residual risk** is the level of risk that remains *after* risk treatment measures have been applied. It is the risk the organisation has consciously chosen to live with — either because it falls within risk appetite, or because it has been formally accepted despite exceeding appetite.

ISO 27001 Clause 6.1.3(f) requires that the risk owner approves the risk treatment plan and accepts the residual risks. ISO/IEC 27005 defines residual risk as: *"risk remaining after risk treatment."*

The relationship between inherent risk, controls, and residual risk:

```
INHERENT RISK
(threat × vulnerability × impact, pre-control)
        │
        ▼
   CONTROLS APPLIED
   (preventive + detective + corrective)
        │
        ▼
RESIDUAL RISK
(remaining exposure after controls)
        │
        ▼
   Compare against RISK APPETITE
        │
   ┌────┴──────┐
Within appetite  Exceeds appetite
        │              │
   ACCEPT          TREAT FURTHER
   (document)      or ACCEPT
                   (with authority)
```

### Inherent vs Residual: The Full Picture

| Concept | Definition | When calculated | Purpose |
|---|---|---|---|
| **Inherent risk** | Risk before any controls | At initial assessment | Demonstrates the scale of the underlying threat; justifies investment in controls |
| **Current residual risk** | Risk after existing controls | At each review | Current exposure — what the organisation faces today |
| **Target residual risk** | Expected risk after planned treatment | During treatment planning | The goal — what the risk will look like once treatment is complete |
| **Accepted residual risk** | Risk formally approved for acceptance | At acceptance decision | Documented commitment — this is what we are choosing to live with |

All four should appear in a mature risk register. Organisations that only track one number (usually "residual risk" without specifying which) lose the nuance that makes risk management useful.

---

## Calculating Residual Risk

Residual risk is calculated using the same scoring methodology as inherent risk — the same likelihood and impact scales, applied to the risk *after* existing controls are factored in.

### The Two Components of Residual Calculation

**Residual likelihood**: How probable is the risk event now that controls are in place?
- Preventive controls reduce likelihood (MFA reduces likelihood of credential-based attacks; patching reduces likelihood of known vulnerability exploitation)
- Detective controls do not reduce likelihood — they reduce dwell time, which affects impact, not frequency

**Residual impact**: How severe would the impact be if the event occurred, given existing controls?
- Corrective controls reduce impact (backups reduce recovery cost; incident response plans reduce breach duration)
- Detective controls reduce impact by enabling faster response (SIEM alerts reduce mean time to detect/respond)

### Example Calculation

**Risk**: Phishing attack compromising executive credentials and enabling business email compromise (BEC) fraud.

| | Likelihood | Impact | Score |
|---|---|---|---|
| **Inherent (no controls)** | 5 — Almost Certain | 4 — Significant | 20 — Critical |
| **Existing controls**: Security awareness training (annual), email filtering (basic), no MFA on email | Reduces to 4 — Likely | Reduces to 4 — Significant | 16 — High |
| **After planned treatment**: Advanced phishing training (quarterly), DMARC/DKIM/SPF, MFA on all email, anti-BEC email scanning | Target: 2 — Unlikely | Target: 2 — Minor | Target: 4 — Low |

The journey from inherent risk (20 — Critical) to current residual (16 — High) to target residual (4 — Low) tells a story the board can understand: "We have significant exposure today. Here is what we currently have in place. Here is what we are implementing. Here is the expected outcome."

### Control Effectiveness and Its Impact on Residual Risk

The accuracy of the residual risk calculation depends entirely on the accuracy of the control effectiveness assessment. This is where most risk registers fail.

**The common error**: Marking a control as "existing" and automatically reducing the likelihood or impact score without assessing whether the control is actually working.

**The right approach**: For each existing control, explicitly assess:

| Control Effectiveness Rating | Definition | Impact on Scoring |
|---|---|---|
| **Fully Effective** | Control is implemented, tested, and functioning as intended. Evidence available. | Full reduction applied to likelihood/impact |
| **Partially Effective** | Control exists but has gaps — incomplete coverage, inconsistent operation, or untested effectiveness | Partial reduction only (assessor judgment) |
| **Ineffective** | Control exists on paper but does not function in practice — misconfigured, bypassed, or untested | Minimal or no reduction |
| **Not Implemented** | Control is planned but not yet in place | No reduction — treat as inherent |
| **Not Tested** | Control exists but has never been verified — effectiveness unknown | Treat with significant uncertainty; flag for testing |

**This is where Capital One went wrong.** Their WAF was "Fully Effective" in their risk assessment. In practice, it was misconfigured in a way that bypassed its intended protection. The residual risk they believed they had was not the residual risk they actually had.

### Verifying Control Effectiveness

Effective GRC programmes do not rely on self-reported control effectiveness. They verify:

- **Penetration testing**: Tests whether technical controls are actually effective against attack (e.g. can an attacker bypass MFA? Can they exploit that "patched" vulnerability?)
- **Control testing / audit**: Internal audit samples and tests specific controls — e.g. selecting 20 user accounts and verifying MFA is enrolled for all of them
- **Continuous monitoring**: SIEM alerts, vulnerability scanning, configuration management tools that continuously verify control state
- **Red team exercises**: Adversarial simulation that tests the entire control environment, including detective and corrective controls

The frequency of verification should be proportionate to the risk: controls protecting against Critical/High risks should be verified at least quarterly; controls for Medium/Low risks at least annually.

---

## Risk Acceptance: The Formal Process

Once residual risk has been calculated and the treatment decision made, there will always be *some* residual risk remaining. For risks within appetite, this residual is routinely accepted. For risks at or above appetite thresholds, formal acceptance is required.

### What Formal Risk Acceptance Requires

A formal risk acceptance is not a checkbox or an informal conversation. It is a documented, authorised decision with specific components:

**1. Complete risk assessment on file**
The risk register entry must be current, complete, and formally reviewed before acceptance. An acceptance decision made on the basis of a stale or incomplete assessment is not valid.

**2. Clear statement of what is being accepted**
Not "we accept this risk" — but "we accept a residual risk of [rating/score] for [specific risk statement], with [existing controls] in place, which exposes the organisation to an estimated impact of [consequence] with a likelihood of [probability]."

**3. Rationale for acceptance**
Why is this risk being accepted rather than treated further? Options:
- Cost of further treatment is disproportionate to the risk level
- No feasible additional control exists
- Risk is being transferred (insurance in place)
- Risk is inherent to the business model and cannot be avoided
- Treatment is planned but temporarily delayed (time-limited acceptance)

**4. Named individual with appropriate authority**
The acceptor must have the authority to bear the consequences of the risk materialising. This is tiered by risk level (see G2-06). A Low risk can be accepted by the risk owner. A Critical risk requires board-level sign-off.

**5. Documented signature (or equivalent)**
For significant acceptances, a formal signature (or digital equivalent) from the accepting authority. This creates accountability — the person cannot later claim they were unaware of the risk.

**6. Review date**
Every acceptance has a review date. At that date, the acceptance is reconsidered: has the risk changed? Have new controls become available? Is the rationale still valid? Acceptance is a time-bounded decision, not a permanent state.

**7. Conditions of acceptance**
Any conditions that, if changed, would trigger re-evaluation: "This acceptance is conditional on maintaining the existing cyber insurance policy with £5M coverage for ransomware events. If the policy lapses or coverage is reduced, this risk must be re-evaluated immediately."

### Risk Acceptance Authority Matrix

A sample authority matrix for a mid-sized organisation:

| Residual Risk Rating | Score Range | Acceptance Authority | Notification Required |
|---|---|---|---|
| Low | 1–4 | Risk Owner (business unit manager) | Risk Manager (information only) |
| Medium | 5–9 | Risk Owner + Risk Manager sign-off | CISO (information only) |
| High | 10–15 | CISO formal sign-off | Executive Committee |
| Critical | 16–25 | Board / Executive Committee formal resolution | Board minutes record |

This matrix must be defined in the organisation's risk management policy and referenced in every risk acceptance decision.

### Template: Formal Risk Acceptance Record

```
RISK ACCEPTANCE RECORD

Risk ID:            RISK-2024-023
Risk Title:         Legacy ERP — End of Life OS (Windows Server 2012 R2)
Date of Assessment: 2024-11-01
Assessor:           Sarah Thompson, Risk Manager

RISK SUMMARY
The ERP system runs on Windows Server 2012 R2, which reached end of extended
support in October 2023. Microsoft no longer releases security patches. The system
processes customer order data and financial transactions.

RESIDUAL RISK SUMMARY
Inherent Risk:      Critical (Likelihood: 5, Impact: 5, Score: 25)
Existing Controls:  Network isolation (VLAN segmentation); no internet-facing
                    exposure; application-layer monitoring; Extended Security Updates
                    (ESU) purchased for 12 months (expires October 2025)
Control Assessment: Partially Effective — ESU provides temporary patch coverage
                    but does not address all vulnerability classes; network isolation
                    reduces but does not eliminate lateral movement risk
Residual Risk:      High (Likelihood: 3, Impact: 5, Score: 15)

TREATMENT OPTIONS EVALUATED
1. Mitigate (OS upgrade): Full ERP platform upgrade required — 18-month project,
   estimated cost £1.8M. Approved for 2025 programme; cannot be completed before
   ESU expiry.
2. Transfer: Cyber insurance confirmed to cover legacy system risks with ESU in place.
   Coverage: £5M.
3. Avoid: Not feasible — ERP is core business system.

ACCEPTANCE RATIONALE
Treatment (OS upgrade) is in progress but cannot be completed before the 12-month
ESU period creates a temporary coverage gap. Acceptance is time-limited to the period
of the upgrade programme. Network isolation controls reduce external exposure to Low;
primary residual risk is internal lateral movement. Insurance provides financial
backstop. ESU provides continuing patch coverage until October 2025.

CONDITIONS OF ACCEPTANCE
1. Network isolation controls must remain in place and be verified quarterly.
2. ESU must remain current (auto-renew confirmed).
3. ERP upgrade project must maintain planned completion date of Q3 2025.
4. If any condition changes, this acceptance must be immediately re-evaluated.

REVIEW DATE: 2025-03-01 (quarterly, given High rating)
EXPIRY DATE: 2025-10-01 (ESU expiry — must be re-evaluated or upgrade completed)

ACCEPTED BY:
Name:  Michael Davies
Role:  Chief Information Security Officer
Date:  2024-11-20
Signature: [signed]

NOTED BY (Executive Committee):
Approved in Executive Committee meeting, 2024-11-25. Minutes reference: EC-2024-11-25-Item 7.
```

---

## The Gap Between Stated and Actual Residual Risk

This is the most dangerous concept in this entire note — and the one most commonly ignored.

**Stated residual risk** is what the risk register says after controls are applied.
**Actual residual risk** is what the true exposure is in the operational environment.

The gap between them represents the organisation's **unknown exposure** — risk they believe they have managed but have not.

Sources of the gap:

**1. Control drift**
Controls that were effective when implemented degrade over time. Firewall rules accumulate exceptions. MFA rollout is 95% complete but executive accounts were excluded. The patch cadence slips from 30 to 90 days. Nobody updates the risk register to reflect the degraded control state.

**2. Assumption-based scoring**
Controls scored as "Fully Effective" based on the assumption that they work as designed, without testing. The WAF that Capital One believed was protecting them. The backup that has never been restored to verify restorability.

**3. Environmental change**
The organisation has grown, changed technology stack, acquired a company, or moved to cloud. The risk register reflects the environment as it was 18 months ago, not as it is today.

**4. Shadow IT and unmanaged assets**
Systems and data stores that exist outside the formal asset inventory. These assets have no risk assessment, no controls, and no residual risk score — but they carry real risk.

**5. Third-party change**
A supplier who was fully compliant at the last assessment has since been acquired, undergone leadership change, or experienced their own incident. The risk the supplier represents has changed; the risk register has not.

### Closing the Gap: Continuous Control Assurance

The gap between stated and actual residual risk is closed through **continuous control assurance** — ongoing, active verification that controls are functioning as assumed.

This is different from periodic risk assessment. It is not an annual event — it is a continuous programme:

| Assurance activity | Frequency | What it verifies |
|---|---|---|
| Vulnerability scanning | Weekly/continuous | Patch status, exposed services |
| Configuration compliance scanning | Continuous | Deviation from security baseline |
| Penetration testing | Annual (minimum) | Exploitability of assumed-effective controls |
| Access review | Quarterly | Actual vs intended access rights |
| Backup restoration test | Quarterly | Actual vs assumed recovery capability |
| Control self-assessment | Annual | Business unit adherence to policies and procedures |
| Third-party security review | Annual (or on change) | Supplier control state vs last assessment |
| Internal audit | Annual (risk-based programme) | Systematic, independent control testing |

When assurance activities find a gap between stated and actual control effectiveness, the risk register must be updated immediately — not at the next annual review. The residual risk score, treatment plan, and (if necessary) the escalation chain must all be updated to reflect reality.

---

## The Details That Matter

### Residual Risk and the Statement of Applicability (SoA)

The SoA (see G3-11) records which ISO 27001 Annex A controls are implemented and why. When residual risk is calculated, the controls contributing to that calculation should be traceable to the SoA. This creates a closed loop:

```
Risk Register (residual risk scored against controls)
    ↕
SoA (controls listed as applicable and implemented)
    ↕
Control Evidence (proof that controls work as stated)
```

An auditor who finds risks with high residual scores despite controls listed as "implemented" in the SoA will immediately test those controls for effectiveness. If the controls are found to be ineffective, the auditor has evidence of a systematic failure — potentially a major nonconformity.

### Risk Acceptance and Legal/Regulatory Risk

Some risks cannot be formally accepted because regulatory obligations require them to be treated regardless of cost. Examples:

- **GDPR Article 32**: Requires "appropriate technical and organisational measures" to ensure security proportionate to risk. An organisation cannot formally "accept" a risk of inadequate personal data protection — it must implement appropriate measures. Acceptance of a known data protection control gap could be viewed as a deliberate violation.

- **FCA Rules**: UK financial services firms have regulatory obligations around operational resilience and risk management. Formal acceptance of material operational risks without regulatory notification may constitute a breach of supervisory obligations.

- **PCI DSS**: Certain controls are mandatory for any merchant or service provider in scope. There is no formal "accept" pathway for a PCI DSS requirement — compliance is required or card processing rights may be suspended.

GRC professionals must understand the regulatory constraints on acceptance decisions. Not all risks are candidates for acceptance — some must be treated regardless of cost.

### Residual Risk Over Time: The Trend Matters

A single residual risk score is a snapshot. The trend over time tells a richer story:

- **Improving trend**: Residual risk decreasing over successive assessments — controls are being implemented and working; the programme is maturing
- **Stable trend**: Residual risk unchanged — treatment is maintaining the current state; new threats are not outpacing controls
- **Deteriorating trend**: Residual risk increasing — controls are degrading, new threats are emerging, or the environment is changing faster than the programme can respond

Board risk reporting should include trend data, not just point-in-time scores. A risk rated High this quarter that was Critical last year is a success story. A risk rated Medium this quarter that was Low last year is a warning.

---

## Common Mistakes and Failures

**1. Residual risk calculated without assessing control effectiveness.**
Controls listed, residual score reduced automatically, without any assessment of whether controls are actually working. The residual risk is fictional.

**2. Risk acceptance without authority.**
A risk manager accepting a High risk because "the CISO is on holiday." Acceptance authority cannot be delegated informally.

**3. Acceptance with no review date.**
"Accept indefinitely" — no time limit, no trigger for re-evaluation. The risk is forgotten. Three years later, the threat landscape has changed, the controls have degraded, and the original acceptance rationale no longer holds.

**4. Acceptance used as a treatment default.**
When treatment is difficult, complex, or expensive, the path of least resistance is acceptance. "We accept this risk" becomes the answer to every risk that requires hard work. The risk register becomes a list of accepted risks rather than a managed portfolio.

**5. Residual risk reported without confidence interval.**
A residual risk score of 9 (Medium) reported without acknowledging that the underlying control effectiveness has not been verified in 18 months. The number carries false precision. Report the uncertainty: "Residual risk is estimated at Medium, but this assessment has not been independently verified since Q1 2023. A control assurance review is planned for Q1 2025."

**6. No mechanism to escalate when residual risk deteriorates.**
Between annual assessments, a control fails or degrades. Nobody notices. The risk register still shows the old (lower) residual risk. There is no trigger to update it. The board continues to believe the risk is within appetite when it is not.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Clause 6.1.3(f): "The risk owner shall approve the risk treatment plan and accept residual risks." Auditors look for: documented risk treatment plans, named risk owners, evidence of their approval/sign-off, and the residual risk statement.
- Clause 8.2: Requires the organisation to perform risk assessments at planned intervals and when significant changes occur. Auditors test whether the risk register has been updated following significant changes — new systems, incidents, regulatory changes.
- Common major nonconformity: residual risk accepted by someone without appropriate authority (e.g., IT technician accepting a Critical risk that requires board sign-off under the organisation's own framework).

**CRISC:**
- Domain 3 (Risk Response and Mitigation) tests residual risk documentation and acceptance procedures.
- Domain 4 (Risk and Control Monitoring) tests how residual risk is tracked over time and how deterioration is detected and escalated.
- CRISC heavily tests the concept of residual risk vs accepted risk — know the distinction: residual risk is what remains after treatment; accepted risk is the formal acknowledgement of what is being lived with.

**CISM:**
- Domain 2 tests the CISO's role in overseeing risk acceptance decisions — including what requires their sign-off, what requires board-level sign-off, and how to document acceptance for regulatory purposes.
- Common CISM scenario: "A business unit manager wants to accept a High risk without CISO involvement. What should the CISO do?" — Refuse to allow acceptance below the appropriate authority level; document the request and the refusal.

**CISSP:**
- Domain 1 tests residual risk concepts at programme design level. Know: how residual risk is calculated, how it relates to risk appetite, and what constitutes appropriate documentation for acceptance decisions.
- CISSP also tests: the concept of total risk (inherent risk) and residual risk in the context of control selection — "controls reduce but cannot eliminate total risk."

---

## GUARDIAN's Take

Residual risk is where the rubber meets the road in risk management. Everything before it — identification, assessment, treatment selection, control implementation — is preparation. Residual risk is the answer to the question that matters: *after everything we have done, what are we actually exposed to?*

The honest answer to that question is uncomfortable in most organisations. Because the honest answer requires admitting that:
- Some controls are not as effective as assumed
- Some risks are higher than the risk register shows
- Some acceptance decisions were made without full information
- The board's view of the organisation's risk posture may not reflect reality

The GRC professionals who add the most value are the ones who are willing to have that uncomfortable conversation. Who will go back to the CISO and say: "Our penetration test found that the MFA control we listed as 'Fully Effective' can be bypassed using an MFA fatigue attack. Our residual risk score for credential compromise needs to be revised upward, and we need to implement MFA fatigue protection." Who will go to the board and say: "Our actual residual risk in the ransomware category is Higher than we reported last quarter, because a backup restoration test revealed our recovery time is 5 days, not 24 hours as assumed."

Those conversations are hard. They involve admitting imperfection. They invite questions that are difficult to answer. But they are the conversations that prevent incidents — because they surface the unknown exposure before an attacker finds it.

The goal of residual risk management is not a low number in a spreadsheet. It is an accurate understanding of what the organisation is actually exposed to — so that the board can make real decisions based on real information.

Accuracy over comfort. Always.

---
*Module: Module 2 — Risk Management | Guardian Curriculum*
