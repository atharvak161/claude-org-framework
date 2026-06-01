---
tags: [guardian, grc, module-2, risk-management, crisc, risk-response, risk-mitigation, controls, treatment-plan]
module: 2
cert-coverage: [crisc, iso27001-la, cism, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G2-06 — Risk Treatment", "G2-07 — Residual Risk and Risk Acceptance", "G2-10 — CRISC Domain 2 — IT Risk Assessment", "G2-12 — CRISC Domain 4 — Risk and Control Monitoring", "G3-10 — Annex A Controls"]
---

# G2-11 — CRISC Domain 3 — Risk Response and Mitigation

> [!abstract] What This Note Covers
> By the end of this note, you will understand CRISC Domain 3 in full — how risk response options are selected and implemented, how control design and deployment works, how the risk treatment plan is structured and managed, and how CRISC frames mitigation within the broader context of enterprise risk response.

---

## Why This Exists

Assessment without response is an academic exercise. CRISC Domain 3 is where risk management produces tangible outcomes — where the organisation moves from understanding its risks to actually doing something about them.

The challenge domain 3 addresses is not simply "pick a treatment option." It is: given a portfolio of assessed risks, limited budget, limited staff, and competing business priorities, how does the risk professional design and implement a coherent response programme that maximises risk reduction, aligns with business objectives, and produces defensible, auditable decisions?

This is genuinely hard. It requires analytical rigour (cost-benefit analysis), governance skill (getting risk owners to commit to treatment), project management discipline (tracking treatment to completion), and communication ability (explaining why certain risks are accepted while others are treated aggressively).

CRISC Domain 3 tests all of these capabilities. This note covers every concept tested, with the depth required for both exam success and professional practice.

---

## CRISC Domain 3 Overview

**Domain weight in the CRISC exam**: approximately 32% of total marks — the largest domain by weight. This reflects the fact that risk response is where most of the practical work of IT risk management occurs.

**Core question the domain answers**: Given assessed IT risks, how does the risk professional select appropriate response options, design effective controls, build and manage a risk treatment plan, and ensure that residual risk is brought within the organisation's risk appetite?

**Domain 3 key topic areas (CRISC Review Manual):**

1. Risk response options — selection and rationale
2. Control design — types, attributes, and effectiveness
3. The risk treatment plan — structure and management
4. Control implementation — deployment, testing, and validation
5. Cost-benefit analysis of risk responses
6. Risk ownership in the response process
7. Residual risk after treatment
8. Risk response communication

---

## Concept 1: Risk Response Options — The CRISC Framework

CRISC defines four risk response options, consistent with ISO 27005 and NIST frameworks (see G2-06 for full treatment). The CRISC-specific framing emphasises the decision criteria for each:

### Accept

**CRISC definition**: The risk owner consciously decides to retain the risk and absorb any resulting loss without taking specific action to reduce the likelihood or impact.

**When CRISC says to accept**:
- Residual risk is already within the organisation's risk appetite/tolerance
- Cost of treatment demonstrably exceeds the expected loss (ALE × treatment period > cost of control)
- No feasible control exists to reduce the risk to within appetite
- The risk is inherent to a business activity the organisation cannot or will not stop

**CRISC-specific requirement**: Acceptance must be *documented and authorised*. The risk owner must explicitly sign off. The risk register must record the acceptance decision, the rationale, the authorising individual, and the review date. Undocumented acceptance = negligence, not governance.

**CRISC exam trap**: A scenario where management says "we'll accept this risk" without documentation or appropriate authority. The CRISC candidate should identify this as improper risk acceptance — not a valid treatment decision.

### Mitigate (Reduce)

**CRISC definition**: Actions taken to reduce the likelihood of the risk event occurring, reduce the magnitude of the loss if it does occur, or both.

**When CRISC says to mitigate**:
- The risk exceeds appetite but the activity cannot be avoided
- Controls exist that can bring residual risk within appetite at proportionate cost
- The cost-benefit analysis supports the investment (ALE reduction > cost of control)

**CRISC-specific emphasis**: Mitigation must address *both* likelihood and impact where possible. Controls that only reduce likelihood leave the organisation exposed if the event occurs anyway. Controls that only reduce impact do not prevent the event from occurring. A layered control strategy (preventive + detective + corrective) is more resilient than single-layer mitigation.

### Transfer (Share)

**CRISC definition**: Shifting the financial consequences of a risk to a third party — typically through insurance, outsourcing, or contractual arrangements.

**When CRISC says to transfer**:
- Residual risk exceeds appetite after mitigation
- The financial exposure from a low-frequency, high-impact event is better managed through insurance than continuous investment in controls
- Outsourcing a function that carries disproportionate risk is operationally and commercially viable

**CRISC-specific caution**: Transfer does not eliminate the risk or remove the organisation's responsibility. Under GDPR, the data controller cannot transfer regulatory accountability to a processor. Under PCI DSS, a merchant cannot transfer their compliance obligation to a payment processor. Transfer is a financial mechanism, not a security mechanism.

**Third-party risk in transfer**: When outsourcing creates transfer of financial risk, it simultaneously creates third-party risk — the risk that the third party will fail. CRISC candidates must recognise that transfer can introduce new risks that must themselves be assessed and managed.

### Avoid

**CRISC definition**: Eliminating the risk by not performing the activity that generates it.

**When CRISC says to avoid**:
- The risk exposure is so severe that no combination of mitigation and transfer can bring it within appetite
- The business value of the activity is insufficient to justify the risk
- Legal, regulatory, or ethical constraints make the activity untenable

**CRISC-specific framing**: Avoidance is a legitimate but costly option — it typically means forgoing a business opportunity or capability. The CRISC candidate must evaluate avoidance against the cost of the missed opportunity, not just the cost of the risk. Recommending avoidance without this analysis is incomplete.

### Risk Response Selection: The Decision Framework

CRISC tests the ability to select the *most appropriate* response given the scenario. The decision logic:

```
Is the residual risk within risk appetite?
    YES → Accept (document formally)
    NO → Continue...

Can the risk be eliminated by stopping the activity?
    YES → Is the business value of the activity worth the risk?
        NO → Avoid
        YES → Continue...

Can the risk be mitigated to within appetite at proportionate cost?
    YES → Mitigate (implement controls)
    NO → Continue...

Can the residual financial exposure be transferred?
    YES → Transfer (insurance / contractual)
    PARTIAL → Transfer + Accept residual
    NO → Escalate to board for formal risk acceptance at current level
```

---

## Concept 2: Control Design

CRISC Domain 3 goes deeper on control design than the other CRISC domains. Selecting a treatment option is only the first step — the risk professional must then design (or select from existing) controls that will actually work.

### Control Design Principles (CRISC Framework)

**1. Proportionality**
Controls must be proportionate to the risk they address. A £500,000 control for a risk with an expected annual loss of £50,000 fails the proportionality test. Cost-benefit analysis must precede control selection.

**2. Completeness**
Controls must address the full scope of the risk, not just part of it. A patching control that covers 90% of servers leaves 10% exposed — and attackers will find the unpatched 10%.

**3. Specificity**
Controls should be designed to address the specific threat-vulnerability combination identified in the risk assessment, not generic "best practice" controls that may not align with the actual risk. "Implement security awareness training" is generic. "Implement quarterly phishing simulation exercises targeting finance staff, with mandatory remedial training for repeat clickers" is specific and designed for an identified insider risk scenario.

**4. Resilience**
Where possible, controls should degrade gracefully — a single control failure should not leave the organisation fully exposed. Defence in depth: layer multiple controls so that a failure in one is compensated by others.

**5. Testability**
Controls must be designed with verification in mind. If the control cannot be tested — if you cannot verify whether it is working — it provides no assurance. Every control should have a defined testing approach and frequency.

**6. Business alignment**
Controls must be implementable without unacceptably disrupting business operations. A control that perfectly addresses the risk but makes the business unable to function will be bypassed or disabled by users. Controls must be designed with operational impact in mind.

### Control Attributes

Every control in the risk treatment plan should be documented with the following attributes:

| Attribute | Description |
|---|---|
| **Control ID** | Unique identifier, enabling cross-reference with the SoA and risk register |
| **Control name** | Descriptive name |
| **Control type** | Preventive / Detective / Corrective |
| **Control nature** | Manual / Automated / Compensating |
| **Risk(s) addressed** | Which risk register entries does this control mitigate? |
| **Control objective** | What specific threat or vulnerability does this control address? |
| **Implementation owner** | Who is responsible for implementing this control? |
| **Operating owner** | Who is responsible for maintaining and operating this control once implemented? |
| **Testing method** | How will the control be tested? (penetration test, audit, configuration check, etc.) |
| **Testing frequency** | How often will the control be tested? |
| **Evidence type** | What evidence will be collected to demonstrate the control is operating? |
| **Estimated cost** | Implementation cost + annual operating cost |
| **Target implementation date** | When will this control be fully operational? |
| **ISO 27001 Annex A mapping** | Which Annex A control(s) does this implement? (for ISO 27001 ISMS integration) |

### Compensating Controls

A **compensating control** is implemented when the primary control cannot be implemented due to technical, operational, or business constraints. It provides equivalent or near-equivalent risk reduction through a different mechanism.

**CRISC exam requirement**: Compensating controls must be documented as compensating (not primary). Their effectiveness must be assessed against the primary control they replace. If they provide significantly less risk reduction, the residual risk must be recalculated accordingly.

**Example**: PCI DSS requires strong cryptography for stored cardholder data. If a legacy system cannot implement the required encryption, a compensating control might be: complete network isolation of the system, enhanced access logging, and a commitment to decommission within 6 months. The compensating control must be documented with PCI DSS and reviewed by a QSA.

---

## Concept 3: Cost-Benefit Analysis of Risk Response

CRISC Domain 3 tests cost-benefit analysis as a foundational skill for risk response selection. The investment in a control must be justified against the risk reduction it produces.

### The Core Formula

```
Value of Control = ALE(before) − ALE(after) − ACS

where:
  ALE(before)  = Annualised Loss Expectancy before the control
  ALE(after)   = Annualised Loss Expectancy after the control
  ACS          = Annual Cost of Safeguard (all ongoing costs)
```

**If Value > 0**: Control is cost-effective — implement it.
**If Value < 0**: Control costs more than it saves — consider alternative controls, accept, or transfer.
**If Value = 0**: Break-even — implement only if non-financial factors (regulatory compliance, reputational protection) justify it.

### What Counts as ACS

A common exam error: counting only the purchase price of a control as ACS. ACS includes *all* ongoing costs:

| Cost component | Examples |
|---|---|
| Licensing / subscription | Annual software licence, SaaS subscription |
| Implementation | Professional services, internal staff time for deployment |
| Training | Staff training to use/operate the control |
| Maintenance | Ongoing configuration, updates, support contracts |
| Internal operational cost | Staff time to operate the control (e.g. reviewing SIEM alerts) |
| Testing cost | Annual penetration test cost attributable to this control |

### Beyond Financial: Non-Quantifiable Benefits

Cost-benefit analysis has limits — not all benefits are financial. CRISC candidates must acknowledge non-quantifiable factors:

- **Regulatory compliance**: A control required by GDPR or PCI DSS must be implemented regardless of cost-benefit calculation. Non-compliance cost is not just the fine — it is the loss of operating licence or right to process card payments.
- **Board and stakeholder confidence**: Certain controls signal security maturity to customers, partners, and investors in ways that cannot be monetised directly.
- **Insurance premium reduction**: Strong controls can reduce cyber insurance premiums — a quantifiable benefit that is sometimes overlooked in CBA calculations.
- **Deterrent effect**: Some controls deter attacks rather than preventing them — the deterrent value is difficult to quantify but real.

---

## Concept 4: The Risk Treatment Plan — CRISC Structure

The **risk treatment plan** is the formal document that records all risk response decisions and the actions required to implement them. CRISC Domain 3 tests both the content of the treatment plan and how it is managed through to completion.

### Treatment Plan Content (CRISC Requirements)

For each risk being treated, the treatment plan records:

**Risk identification**: Risk ID, risk title, risk owner, current residual risk rating.

**Response decision**: Selected option (mitigate/transfer/avoid/accept) with rationale. For Accept: documented authority sign-off. For Transfer: policy details and coverage confirmation. For Avoid: description of the activity being discontinued.

**Control actions** (for Mitigate): Each specific action required to implement the chosen controls. For each action:
- Action description
- Implementing owner (named individual)
- Target completion date
- Dependencies (what must happen first?)
- Resources required (budget, staff, tooling)
- Current status (Not Started / In Progress / Complete / Overdue)

**Target residual risk**: Expected residual risk rating after the treatment plan is fully implemented. Must be within risk appetite.

**Implementation timeline**: Phased if required — some controls are immediate (quick wins), others are long-term (architectural changes).

**Verification approach**: How will the organisation confirm that the treatment has achieved the expected risk reduction? (penetration test, internal audit, control effectiveness reassessment)

**Risk owner sign-off**: Formal confirmation by the risk owner that they accept the treatment plan and the target residual risk.

### Treatment Plan Management

Implementing a treatment plan is a project management challenge. CRISC Domain 3 tests management of the treatment plan as an ongoing programme:

**Progress tracking**: Regular status updates on each action. Weekly for overdue or critical actions; monthly for routine actions. The risk manager maintains the tracker and chases overdue items.

**Escalation**: Actions that are overdue by more than 30 days should be escalated to the risk owner's manager. Actions that will not be completed before the risk materialises should trigger immediate escalation to the CISO and potentially the board.

**Change management**: When the treatment plan changes (scope, timeline, resources), the change must be documented with rationale. Risk owners cannot unilaterally abandon agreed treatment plans without formal re-acceptance of the elevated residual risk.

**Completion verification**: When an action is marked complete, it must be verified — not self-certified. Evidence should be collected (configuration screenshot, test result, policy approval record) before the action is closed.

**Post-implementation review**: After all actions are complete, the residual risk is reassessed to confirm that the target residual has been achieved. If the target is not achieved, additional treatment is required or the gap is formally accepted.

---

## Concept 5: Control Implementation and Validation

Controls on paper are not controls in reality. CRISC Domain 3 explicitly tests the implementation and validation phase — converting treatment plan actions into operating, verified controls.

### Implementation Sequence

**1. Design**: Define the control in detail — what it will do, how it will work, what it will cover, and what evidence it will generate.

**2. Test in non-production**: Where possible, test the control in a staging environment before production deployment. Identifies unintended consequences.

**3. Deploy**: Implement the control in production. Document the deployment configuration.

**4. Train**: Ensure staff who interact with or operate the control are trained. A control operated incorrectly by untrained staff is not effective.

**5. Validate**: Independently verify that the control is working as intended. Penetration testing, configuration review, or internal audit review depending on the control type.

**6. Document**: Record the implementation details, configuration, testing evidence, and operating procedures.

**7. Integrate into monitoring**: Ensure the control is included in the ongoing monitoring programme (see G2-12 — CRISC Domain 4).

### Validation Methods by Control Type

| Control type | Validation method |
|---|---|
| Access control (MFA) | Account-level audit: sample 30 accounts, verify MFA is enrolled and enforced |
| Patching | Vulnerability scan: verify that previously identified CVEs are no longer present |
| Encryption | Configuration review: verify encryption algorithm, key length, key management process |
| Security awareness training | Phishing simulation: test whether trained staff can recognise and report phishing |
| Network segmentation | Penetration test: verify that access between segments is restricted as designed |
| SIEM / alerting | Alert testing: trigger known-bad activity and verify that alerts fire and are investigated |
| Incident response plan | Tabletop exercise or simulation: test whether the plan works under realistic conditions |
| Backup and recovery | Restoration test: restore from backup and verify data integrity and recovery time |

---

## Concept 6: Risk Ownership in the Response Process

CRISC Domain 3 reinforces a principle established in Domain 1: risk owners must be genuinely involved in the response process, not just informed of decisions made by the security team.

**Risk owner responsibilities in Domain 3:**
- Approving the risk treatment plan for their risks
- Committing to provide resources (budget, staff time) for treatment implementation
- Accepting the target residual risk
- Holding implementing teams accountable for treatment completion
- Formally accepting residual risk where treatment is incomplete or partially effective
- Escalating to the CISO/board if treatment cannot be completed within the agreed timeline

**The risk manager's role in Domain 3:**
- Facilitating the treatment planning process
- Maintaining the treatment plan tracker
- Escalating overdue actions to risk owners and their managers
- Reporting treatment progress to the Security Committee and CISO
- Validating that completed actions have achieved the expected risk reduction
- Updating the risk register to reflect post-treatment residual risk

**A critical CRISC boundary**: The risk manager must not make risk acceptance decisions on behalf of risk owners. If a risk owner is unavailable or unwilling to engage, the risk manager escalates — they do not accept the risk on the owner's behalf.

---

## Concept 7: Residual Risk After Treatment

Once treatment is complete, the risk must be reassessed. CRISC Domain 3 tests the post-treatment residual risk assessment — verifying that the treatment has achieved the intended outcome.

### Post-Treatment Assessment Steps

**1. Reassess likelihood**: Given the new controls, what is the current probability of the threat event occurring? Apply the same qualitative or quantitative scale used in the initial assessment.

**2. Reassess impact**: Have any corrective controls been implemented that would reduce impact? Reassess impact dimension scores.

**3. Calculate new residual risk score**: Likelihood (post-treatment) × Impact (post-treatment).

**4. Compare to target**: Did the treatment achieve the target residual risk? If yes: formally close the treatment actions and update the risk register. If no: additional treatment required or formal acceptance of the gap.

**5. Compare to appetite**: Is the new residual risk within the organisation's risk appetite? If yes: document as accepted. If no: initiate a further treatment cycle or escalate for board-level acceptance.

**6. Update the risk register**: Record the new residual risk score, the date of reassessment, the evidence of control effectiveness, and the updated risk status.

### When Treatment Fails to Achieve Target

Occasionally, treatment actions are completed but the target residual risk is not achieved. Common reasons:

- Controls were less effective than anticipated (overestimated effectiveness at the planning stage)
- The threat landscape evolved during the treatment period, increasing likelihood
- Implementation gaps — controls were deployed but not fully covering the intended scope
- New vulnerabilities emerged in the post-treatment period

When this occurs, the CRISC-appropriate response is:
1. Document the gap between target and achieved residual risk
2. Analyse the root cause of the underperformance
3. Either: design additional treatment actions to close the gap, OR escalate for formal risk acceptance of the higher-than-target residual risk
4. Do NOT simply update the target to match the achieved outcome without justification — this is target manipulation, not risk management

---

## Common Mistakes and Failures

**1. Treatment plan with no specific actions.**
"Improve security posture" as a treatment action. No named owner, no deadline, no success criteria. Nothing happens. Treatment plans must contain specific, bounded, owned actions.

**2. Risk owner not involved in treatment planning.**
The security team designs the treatment plan and presents it to the risk owner for rubber-stamp approval. The risk owner does not understand the actions, does not commit to the resources, and does not prioritise them. Implementation stalls.

**3. Controls selected from a generic checklist, not from the risk assessment.**
Controls implemented because "ISO 27001 says so" or "best practice recommends it" without tracing them to specific identified risks. Controls cannot be justified in cost-benefit terms because nobody knows what risk they address.

**4. Implementation verification skipped.**
Treatment actions marked complete based on self-certification. The risk register shows reduced residual risk. Nobody has tested whether the controls are actually working. The risk is the same as before — the register is just wrong.

**5. Transfer mistaken for full risk elimination.**
Cyber insurance purchased. Risk marked as treated. Board told the risk has been managed. Nobody acknowledges that the insurance may not cover all scenarios, that the operational disruption from an incident is not insured, or that the policy may be disputed at claim time.

**6. Treatment plans that are never updated.**
Treatment plans documented in January with March completion dates. March passes. June passes. September passes. The plan is never updated. Overdue actions are not escalated. The risk remains untreated. Nobody is held accountable.

---

## Exam Angle

**CRISC Domain 3 — specific exam guidance:**

Domain 3 is the highest-weighted domain (32%) and produces the most scenario-based questions. Question types:

**Response selection scenarios**: "An organisation has assessed a risk as Critical. The cost of full mitigation is £2M. The business cannot avoid the activity. Cyber insurance is available at £150K/year. What is the most appropriate response?" (Answer: Mitigate what is feasible at proportionate cost + Transfer the residual exposure via insurance + formally Accept the remaining residual with board sign-off.)

**Control design scenarios**: "A risk assessment identifies that phishing attacks are likely to succeed due to lack of staff training. Which control type most directly addresses this risk?" (Answer: Preventive — security awareness training reduces the vulnerability condition, reducing likelihood.)

**Cost-benefit scenarios**: "A control costs £200K to implement and £50K per year to operate. It is expected to reduce ALE from £800K to £150K. Is this control justified?" (Answer: ALE reduction = £650K/year. ACS = £50K/year (after implementation). Net value = £600K/year. Yes — highly justified.)

**Treatment plan management**: "A risk owner has failed to implement an agreed treatment action by the deadline. What should the risk manager do?" (Answer: Escalate to the risk owner's manager; assess whether the delay has elevated the actual residual risk beyond the documented level; update the risk register if so.)

**Residual risk verification**: "Treatment actions have been completed. What should happen next?" (Answer: Independent validation of control effectiveness; post-treatment risk reassessment; comparison to target residual risk; update risk register; formal acceptance of residual risk by risk owner.)

**Key terminology for Domain 3:**
Risk response options (accept, mitigate, transfer, avoid); control design principles (proportionality, completeness, specificity, resilience, testability); ACS (Annual Cost of Safeguard); ALE; cost-benefit analysis; compensating control; treatment plan; post-implementation review; residual risk verification.

---

## GUARDIAN's Take

Domain 3 is where risk management earns its keep — or fails to.

Every other domain — identification, assessment, monitoring — is preparation and oversight. Domain 3 is action. It is where the organisation actually changes its risk posture, or fails to.

The failure mode I see most often is not that organisations choose the wrong response option. It is that they choose the right option on paper and then do not execute it in practice. The treatment plan exists. The actions have owners. The deadlines have passed. And nothing has happened.

This is a governance failure at the risk owner level. Risk owners who do not implement their treatment plans — who treat them as suggestions rather than commitments — are accepting elevated risk on behalf of the organisation without the authority to do so. The risk manager's job in Domain 3 is not just to build the plan. It is to create the accountability structure that ensures the plan is executed.

That means: escalation processes with real teeth. Regular status reviews that are reported upward. Overdue actions that reach the CISO and, for High/Critical risks, the board. Risk owners who understand that failing to implement their treatment plan is a governance matter, not just an IT scheduling inconvenience.

Build the plan with precision. Manage it with discipline. Verify with independence. Report with honesty.

That is CRISC Domain 3 in practice — and it is also the difference between a risk management programme that actually reduces risk and one that simply documents it.

---
*Module: Module 2 — Risk Management | Guardian Curriculum*
