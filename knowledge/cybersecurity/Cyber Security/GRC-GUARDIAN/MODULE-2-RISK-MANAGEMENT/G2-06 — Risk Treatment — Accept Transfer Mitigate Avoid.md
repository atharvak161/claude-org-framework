---
tags: [guardian, grc, module-2, risk-management, risk-treatment, mitigate, transfer, avoid, accept, controls]
module: 2
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-15
guardian-refs: ["G2-01 — What is Risk", "G2-02 — Risk Appetite and Risk Tolerance", "G2-04 — Qualitative vs Quantitative Risk Analysis", "G2-05 — The Risk Register", "G2-07 — Residual Risk and Risk Acceptance", "G3-05 — ISO 27001 Clause 6 — Planning"]
---

# G2-06 — Risk Treatment — Accept, Transfer, Mitigate, Avoid

> [!abstract] What This Note Covers
> By the end of this note, you will understand the four risk treatment options in depth — what each means, when to use it, what it looks like in practice, and what the common failures of each are — including the critical distinctions between genuine risk acceptance and negligent risk ignorance.

---

## Why This Exists

In 2017, the city of Atlanta was hit by the SamSam ransomware attack. The attackers demanded approximately $51,000 in Bitcoin. The city declined to pay — a reasonable decision in principle. But the aftermath revealed something damning: a 2016 audit had warned of over 2,000 vulnerabilities in the city's systems, including outdated software and poor security practices. These risks had been identified. They had not been treated.

Was this risk acceptance? No. Genuine risk acceptance requires a conscious, documented decision by someone with the authority to make it. What Atlanta experienced was risk *neglect* — risks identified, noted, and then ignored because treatment was inconvenient, expensive, or deprioritised in favour of other budget items.

The eventual cost of not treating those risks: over $2.6 million in emergency contracts, $9.5 million in remediation, and the permanent destruction of court data and years of police dashcam footage. The $51,000 ransom they declined to pay looks insignificant against those numbers.

Risk treatment is where risk management moves from analysis to action. Identifying and assessing risks has no value unless something is done with that information. This note is about the four things you can do — and how to do each one properly.

---

## What It Is

After a risk has been identified, assessed, and evaluated against the risk appetite, a **treatment decision** must be made. ISO 27001 Clause 6.1.3 and ISO 27005 both define the risk treatment process — selecting and implementing options for addressing risks that exceed the risk appetite.

There are four treatment options, remembered by various acronyms:

- **MATA**: Mitigate, Accept, Transfer, Avoid
- **TARA**: Transfer, Accept, Reduce (Mitigate), Avoid
- **ATMA**: Accept, Transfer, Mitigate, Avoid

All cover the same four options. This note uses: **Mitigate, Transfer, Avoid, Accept** — ordered by frequency of use in practice.

A critical principle before diving in: **treatment decisions must be made by the right person at the right level of authority.** A junior analyst cannot accept a Critical risk. A risk owner cannot transfer risk without board approval for a major insurance commitment. The treatment decision authority must be defined in the risk management framework and matched to the risk rating.

---

## Treatment Option 1: Mitigate (Reduce)

### What It Is

**Mitigation** means implementing controls to reduce the likelihood that the risk will materialise, reduce the impact if it does, or both. It is the most common treatment option and the one most people think of first when they hear "risk management."

Mitigation does not eliminate risk — it reduces it to a lower, more acceptable level. The goal is to bring residual risk within the organisation's risk appetite.

### Types of Mitigating Controls

Controls are categorised by their function:

**Preventive controls** — reduce the likelihood that a threat successfully exploits a vulnerability:
- Multi-factor authentication (reduces likelihood of credential-based attacks succeeding)
- Patch management (reduces likelihood of known vulnerability exploitation)
- Security awareness training (reduces likelihood of phishing attacks succeeding)
- Firewall rules (reduces likelihood of unauthorised network access)
- Encryption of data at rest (reduces likelihood that stolen data is usable)

**Detective controls** — do not prevent an incident but identify when one is occurring or has occurred:
- SIEM (Security Information and Event Management) — detects anomalous behaviour
- Intrusion Detection System (IDS) — detects network-level attack signatures
- File Integrity Monitoring (FIM) — detects unauthorised changes to files
- User and Entity Behaviour Analytics (UEBA) — detects insider threat patterns
- Audit logs — enables reconstruction of events after an incident

**Corrective controls** — reduce the impact of an incident and enable recovery:
- Offline / immutable backups — enable recovery from ransomware without paying
- Incident response plan — reduces mean time to respond and recover
- Disaster Recovery Site — enables business continuity during major outage
- Cyber insurance — financial recovery support (also a transfer mechanism)
- Data breach notification procedure — reduces regulatory and reputational impact of a breach

A mature control environment layers all three types. Preventive-only organisations are blind when something gets through. Detective-only organisations can see the problem but cannot stop it. Corrective-only organisations recover slowly and expensively.

### When to Choose Mitigation

Mitigation is appropriate when:
- The risk exceeds appetite but the activity generating the risk cannot be stopped (you cannot avoid it)
- The cost of implementing controls is proportionate to the risk reduction achieved
- Suitable controls exist and can be implemented within a reasonable timeframe

### Mitigation in Practice: A Worked Example

**Risk**: External attacker exploits absence of MFA on VPN gateway to access internal network.
**Current residual risk**: High (Likelihood: 4, Impact: 4, Score: 16)
**Risk appetite**: Medium or below (≤ Score 9)

**Mitigation plan:**
1. Implement MFA on all VPN access using Duo Security — reduces likelihood from 4 to 2
2. Implement network segmentation to limit lateral movement — reduces impact from 4 to 2
3. Deploy SIEM alerting on VPN anomalies — adds detection capability

**Projected residual risk post-treatment**: Medium (Likelihood: 2, Impact: 2, Score: 4) — within appetite.

**Treatment owner**: Head of IT Infrastructure
**Completion target**: 60 days
**Investment required**: £45,000 (licensing + implementation)

---

## Treatment Option 2: Transfer (Share)

### What It Is

**Risk transfer** means shifting the financial consequence of a risk to a third party. The risk itself does not go away — the threat and vulnerability still exist — but the financial impact of its materialisation is borne (in whole or in part) by someone else.

The most common form of risk transfer in information security is **cyber insurance**. Other forms include outsourcing a function to a managed security service provider (MSSP) who contractually accepts liability, or using a cloud provider whose terms include financial responsibility for certain breaches.

### Cyber Insurance: The Primary Transfer Mechanism

Cyber insurance policies typically cover:

| Coverage type | What it pays for |
|---|---|
| First-party (own losses) | Incident response costs, forensic investigation, business interruption, data restoration, ransom payments (some policies) |
| Third-party (liability) | Legal defence costs, regulatory fines (some jurisdictions), compensation to affected customers, notification costs |
| Crisis management | PR costs, reputational management, customer communication programmes |

**Key insurance concepts every GRC professional must understand:**

**Sublimits**: Many policies have sublimits for specific coverage types. "£5M cyber policy" may include only £500K for ransomware events. Read the policy, not just the headline limit.

**Exclusions**: Common exclusions include: nation-state attacks (war exclusion — highly contested post-NotPetya), failure to maintain minimum security standards, known vulnerabilities not remediated, acts of insiders. Exclusions are where claims get denied.

**Retroactive date**: Most cyber policies are "claims-made" — they cover incidents reported during the policy period that occurred after the retroactive date. An incident that began before the policy's retroactive date may not be covered even if discovered during the policy period.

**Sub-rogation**: After paying a claim, the insurer has the right to pursue third parties who contributed to the loss. If a supplier's negligence caused the breach, the insurer can sue the supplier.

**Underwriting requirements**: Insurers now conduct detailed security assessments before issuing coverage. Poor security posture = higher premiums or declined coverage. MFA, EDR, patching cadence, and backup testing are common underwriting requirements.

### Contractual Transfer

When outsourcing to an MSSP or cloud provider:
- The contract should clearly define security responsibilities (RACI for security controls)
- SLAs should include security-specific metrics (incident response time, uptime)
- The supplier should carry adequate professional indemnity and cyber liability insurance
- The organisation cannot fully transfer liability for regulatory compliance (GDPR holds the data controller responsible regardless of processor contractual arrangements)

**Critical point on transfer and GDPR**: Under GDPR, data controllers cannot transfer their compliance obligation to a data processor. If a cloud provider suffers a breach affecting personal data you entrusted to them, you remain responsible for notifying the ICO and affected data subjects. Transfer reduces financial exposure — it does not eliminate regulatory accountability.

### When to Choose Transfer

Transfer is appropriate when:
- The risk exceeds appetite but cannot practically be mitigated to within appetite
- The cost of full mitigation significantly exceeds the cost of insurance
- The risk involves low-frequency, high-impact events (tail risks) where insurance is the most efficient mechanism
- The organisation has already mitigated what it can and wants to cap remaining financial exposure

Transfer is rarely used *instead of* mitigation — it is typically used *alongside* it. Mitigate what you can; transfer what remains.

### Transfer Does Not Mean "Somebody Else's Problem"

The most dangerous misconception about risk transfer is treating it as a way to stop thinking about a risk. Insurance does not prevent an incident. It provides financial recovery after one. The operational disruption, reputational damage, regulatory attention, and management time consumed by a major incident are not covered by any policy.

Transfer is a financial instrument. It is not a security control.

---

## Treatment Option 3: Avoid

### What It Is

**Risk avoidance** means eliminating the risk entirely by stopping the activity that generates it. If you are not doing the thing that creates the risk, the risk ceases to exist.

This sounds simple. In practice, avoidance usually means giving something up — a business activity, a market, a technology, a supplier relationship. It is the most decisive treatment option and often the most expensive in terms of business impact.

### When Avoidance Is the Right Choice

Avoidance is appropriate when:
- The risk is so severe (likelihood × impact) that no level of mitigation or transfer can bring it within appetite
- The regulatory or legal exposure is existential — no control can adequately protect against the consequence of failure
- The business value of the activity is insufficient to justify the risk it creates
- A cost-benefit analysis shows that avoidance is cheaper than continuous mitigation

### Avoidance in Practice: Examples

**Technology avoidance:**
- Deciding not to deploy a new IoT device platform because the security maturity of IoT is insufficient and the regulatory exposure (patient data in a healthcare setting) is too high
- Discontinuing use of an end-of-life operating system that can no longer be patched
- Removing a legacy web application that cannot be secured rather than continuing to patch around its vulnerabilities

**Market/geography avoidance:**
- Deciding not to enter a specific market (e.g. China, Russia) due to data sovereignty laws that would require storage of customer data under conditions incompatible with GDPR
- Declining a contract that would require processing of special category personal data where the organisation lacks the capability to manage it safely

**Supplier avoidance:**
- Terminating a supplier relationship because the supplier cannot demonstrate adequate security controls and the data shared with them is too sensitive to accept the risk
- Deciding not to use a specific SaaS product because it cannot meet contractual security requirements

**Data avoidance:**
- Deciding not to collect certain categories of personal data (e.g. biometric, health data) because the regulatory requirements for processing it safely exceed the organisation's current capability — data minimisation as a risk treatment

### Avoidance vs Ignoring

Avoidance must be a *deliberate decision*. Stopping an activity because it creates unacceptable risk — and documenting that decision — is avoidance. Stopping an activity for unrelated reasons (budget, market, strategy) is just a business decision. Failing to start a risky activity without ever having assessed the risk is not avoidance — it is luck.

### When Avoidance Is Wrong

Avoidance is often the lazy answer to a hard mitigation problem. "We cannot mitigate this risk, so we should avoid the activity" — when the activity is central to the business strategy — is not a serious treatment recommendation. Before recommending avoidance, the risk manager must be able to demonstrate that mitigation and transfer have been genuinely evaluated and found insufficient.

---

## Treatment Option 4: Accept

### What It Is

**Risk acceptance** means making a *conscious, documented decision* to live with the risk at its current residual level, without further treatment. The organisation acknowledges the risk, understands its potential impact, and chooses not to invest in additional controls or transfer mechanisms.

Acceptance is a legitimate treatment option. It is not a sign of failure or negligence. Every organisation accepts some risks — because the cost of treatment exceeds the benefit, because the residual risk is already within appetite, or because the risk is genuinely unavoidable at any reasonable cost.

### What Makes Acceptance Legitimate vs Negligent

This is the most important distinction in risk treatment. Legitimate acceptance and negligent risk ignorance can look similar from the outside — neither results in additional controls being implemented. The difference is in the *process*:

| Legitimate Risk Acceptance | Negligent Risk Ignorance |
|---|---|
| Risk has been formally identified and assessed | Risk has not been assessed (or assessors looked away) |
| Residual risk is explicitly acknowledged | Nobody knows what the residual risk is |
| Decision is documented in the risk register | No record of any decision being made |
| Decision made by someone with appropriate authority | No decision-maker involved |
| Risk is monitored for changes | Risk is forgotten until something goes wrong |
| Risk owner is named and accountable | Nobody is accountable |
| Board aware of accepted risks above a threshold | Board has no visibility |

Atlanta's failure was not risk acceptance. No one formally decided to accept the vulnerability risks identified in the 2016 audit. The risks were noted, assigned to an IT team with insufficient budget, and then quietly forgotten. That is negligence — and it is the most common form of "risk management" in poorly run organisations.

### Risk Acceptance Authority Levels

Not everyone can accept every risk. The acceptance authority should be tiered to match the risk level:

| Risk Rating | Minimum Acceptance Authority |
|---|---|
| Low | Risk Owner (business unit manager) |
| Medium | Risk Owner + CISO review |
| High | CISO sign-off required |
| Critical | Board or Executive Committee formal sign-off required |

This tiering ensures that high-stakes acceptance decisions receive appropriate scrutiny and that the board is aware of significant risks it has chosen not to treat.

### Risk Acceptance in ISO 27001

ISO 27001 Clause 6.1.3(e) requires that the organisation retains documented information about the risk treatment process. For accepted risks, this means:

- The risk register entry (with full assessment)
- The acceptance decision, documented and dated
- The name and role of the person who accepted the risk
- The rationale for acceptance
- The planned review date (when will the acceptance decision be revisited?)

Auditors will look for all of these. An acceptance decision that is not documented is indistinguishable from a risk that was never addressed — and both are potential nonconformities.

### Temporary vs Permanent Acceptance

Risk acceptance can be:

**Temporary (time-limited)**: "We accept this risk for 90 days while the mitigation solution is procured and implemented." The acceptance has an expiry — after 90 days, the risk must be treated or re-accepted with documented justification.

**Permanent**: "We accept this risk indefinitely because the cost of treatment consistently exceeds the potential impact." This requires higher authority sign-off and must be reviewed at least annually.

### When to Choose Acceptance

Acceptance is appropriate when:
- The residual risk is already within the risk appetite (acceptance is the default outcome for low risks)
- The cost of further treatment significantly and demonstrably exceeds the potential impact
- The risk cannot be mitigated, transferred, or avoided at any reasonable cost
- The risk is inherent to the business model and cannot be eliminated without fundamentally changing what the organisation does

---

## The Risk Treatment Plan

Whichever treatment option is chosen, the decision must be captured in a **risk treatment plan**. ISO 27001 Clause 6.1.3 explicitly requires a documented risk treatment plan.

A risk treatment plan is not the same as the risk register — it is the action-oriented document that translates the treatment decision into specific steps, owners, timelines, and resources.

**Minimum content of a risk treatment plan entry:**

| Field | Example |
|---|---|
| Risk ID | RISK-2024-017 |
| Treatment decision | Mitigate |
| Rationale | Residual risk (High, Score 15) exceeds appetite (Medium, ≤9); activity cannot be avoided; insurance alone insufficient |
| Actions | 1. Implement MFA (Duo) — 30 days — James Chen |
| | 2. Network segmentation — 60 days — James Chen |
| | 3. SIEM alert tuning for VPN anomalies — 45 days — SOC team |
| Resources required | £45,000 budget — approved by CFO 2024-11-20 |
| Target residual risk | Medium (Likelihood: 2, Impact: 2, Score: 4) |
| Treatment owner | James Chen, Head of IT Infrastructure |
| Review date | 2025-02-15 (post-implementation verification) |
| Status | In Progress |

The risk treatment plan is reviewed regularly (monthly for high-priority treatments) and updated as actions are completed.

---

## Combining Treatment Options

In practice, a single risk often warrants multiple treatment options applied in combination:

**Example: Ransomware risk on production systems**

- **Mitigate**: Implement immutable backups, enforce patching cadence, deploy EDR
- **Transfer**: Increase cyber insurance coverage to include ransomware events explicitly
- **Accept (residual)**: After mitigation and transfer, a small residual risk remains — this is formally accepted by the CISO

This is the typical mature approach: mitigate to reduce likelihood and impact as far as is cost-effective; transfer to cap the financial exposure of what remains; formally accept the residual.

---

## The Details That Matter

### The Cost of Treatment vs the Cost of the Risk

Every treatment decision should be informed by a cost-benefit analysis:

```
Is treatment justified?

Cost of Treatment > ALE (Annualised Loss Expectancy)?
    → Consider Accept or Transfer instead

Cost of Treatment < ALE?
    → Mitigate (the control pays for itself)

ALE too uncertain to calculate?
    → Use qualitative comparison: is treatment "proportionate"?
```

ISO 27001 uses the language of "proportionality" — controls must be proportionate to the risk they address. A £500K technical control for a risk with an estimated £50K annual exposure is disproportionate. A £50K control for a risk with an estimated £2M annual exposure is highly proportionate.

### Treatment and the Statement of Applicability

For ISO 27001, every control selected as part of risk treatment must appear in the **Statement of Applicability (SoA)**. The SoA is the document that maps selected controls to the ISO 27001 Annex A control set, records whether each control is applicable and implemented, and provides justification for exclusions.

The link is: Risk Register → Treatment Decision → Control Selection → SoA → Evidence of Implementation

If a control is selected to treat a risk but does not appear in the SoA — or appears in the SoA without being linked to a risk — there is a traceability gap that auditors will flag.

### Treatment Options in ISO/IEC 27005:2022

The 2022 revision of ISO 27005 uses slightly different language for treatment options:
- **Modifying risk** (equivalent to Mitigate/Reduce)
- **Retaining risk** (equivalent to Accept)
- **Avoiding risk** (equivalent to Avoid)
- **Sharing risk** (equivalent to Transfer)

Know both terminology sets — exams may use either.

---

## Common Mistakes and Failures

**1. Acceptance without documentation.**
The most common failure. A risk is assessed, nobody wants to implement expensive controls, and the risk is quietly marked as "accepted" with no formal decision, no authority sign-off, and no monitoring. This is negligence masquerading as governance.

**2. Treating transfer as a substitute for mitigation.**
Buying cyber insurance and considering the risk managed. The insurer will not prevent the incident. They may dispute the claim. They will not restore your reputation or compensate for operational disruption beyond policy limits. Transfer is a complement to mitigation, not a replacement.

**3. Avoidance as the default response to hard problems.**
"We can't mitigate this risk, so we should stop doing the activity." When the activity is business-critical, this recommendation will be ignored — and rightly so. The risk manager must do the harder work of finding the mitigation or transfer approach that makes the activity acceptable.

**4. Mitigation plans that are never implemented.**
Treatment plans documented, treatment actions assigned, resources approved — and then nothing happens. Regular treatment tracking (see G2-05) is the only way to prevent this.

**5. Controls selected without reference to the risk.**
Controls implemented because "best practice" says so, not because they address a specific identified risk. These controls may provide genuine security value but they cannot be justified in the risk treatment plan or traced to the SoA, creating ISO 27001 compliance gaps.

**6. Risk acceptance without a review date.**
Risk accepted "indefinitely" with no commitment to review. Circumstances change — the threat landscape evolves, the organisation changes, new controls become available. Risk acceptance must be time-limited and revisited.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Clause 6.1.3 is the treatment clause. Know what it requires: a risk treatment plan, selection of treatment options, identification of controls, comparison with Annex A, production of a Statement of Applicability, and retention of documented information.
- Auditors test traceability: can every control in the SoA be traced to a risk in the register? Can every high/critical risk be traced to a treatment decision?
- Common finding: "The organisation cannot demonstrate how risk treatment decisions were made" — no documented rationale in the risk register or treatment plan.

**CRISC:**
- Domain 3 (Risk Response and Mitigation) is dedicated to risk treatment. Know all four options, their applicability criteria, and their limitations.
- CRISC tests: when each treatment option is appropriate, what a treatment plan should contain, how to monitor treatment effectiveness.

**CISM:**
- Domain 2 tests the CISO's ability to design and oversee a risk treatment programme. Scenarios often test prioritisation: "With limited budget, which treatment approach maximises risk reduction?"
- CISM also tests: how to communicate treatment decisions to the board (in terms of residual risk posture and business impact, not technical detail).

**CISSP:**
- Domain 1 covers risk treatment concepts. Know the four options and their formal definitions.
- CISSP adds the concept of **risk rejection** — refusing to acknowledge a risk exists. This is not a legitimate treatment option; it is a governance failure. Know why.

---

## GUARDIAN's Take

After two decades of watching organisations make risk treatment decisions, the pattern I see most often is this: mitigation for the risks that make good slides, and quiet acceptance (without documentation) for the risks that are too expensive, too complex, or too inconvenient to address.

The risks that destroy organisations are almost never the ones that surprised anyone. They are the ones that were known, assessed, and quietly filed away because doing something about them would have required a difficult conversation, a budget battle, or an admission that the organisation was not as secure as it claimed to be.

The job of a GRC professional is to make that quiet filing impossible. The risk register exists precisely to make risk visible and accountable. The treatment plan exists to make the decision and its consequences traceable. The escalation thresholds exist to make sure that Critical risks cannot be accepted by someone who lacks the authority to bear the consequences.

There is one rule I apply to every risk treatment decision: **could I defend this decision to a regulator, a board, or a journalist after a major incident?**

If the answer is "we consciously accepted this risk because the cost of treatment exceeded the risk, it was reviewed quarterly, it was signed off by the board, and we had transfer mechanisms in place to cap the financial exposure" — that is defensible. It may not be perfect, but it is honest and accountable.

If the answer is "we knew about it but didn't get around to fixing it" — that is not a treatment decision. That is negligence. And the only thing worse than experiencing the incident is being unable to demonstrate that you tried to prevent it.

Document everything. Escalate properly. Make sure someone with authority owns every decision. That is the standard.

---
*Module: Module 2 — Risk Management | Guardian Curriculum*
