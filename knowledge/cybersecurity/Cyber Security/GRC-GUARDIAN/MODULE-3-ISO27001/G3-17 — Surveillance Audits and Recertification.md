---
tags: [guardian, grc, module-3, iso27001, surveillance-audit, recertification, certificate-maintenance]
module: 3
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G3-08 — ISO 27001 Clause 9 — Performance Evaluation", "G3-13 — The Certification Journey", "G3-14 — Internal Audit", "G3-15 — Nonconformities", "G3-16 — Management Review", "G3-18 — ISO 27001 Lead Auditor Exam"]
---

# G3-17 — Surveillance Audits and Recertification

> [!abstract] What This Note Covers
> By the end of this note, you will understand what surveillance audits and recertification audits are, how they differ from each other and from the initial certification audit, how to prepare for and manage them effectively, and what can happen to a certificate if surveillance audits find significant problems.

---

## Why This Exists

Many organisations treat ISO 27001 certification as a destination — something achieved once and then maintained with minimal effort. This misunderstanding leads to a pattern seen repeatedly: intensive effort to achieve certification, followed by gradual ISMS degradation, followed by a stressful scramble before the next audit, followed by findings that could have been avoided.

The three-year certification cycle — initial certification, Year 1 surveillance, Year 2 surveillance, Year 3 recertification — is not a sequence of hurdles to clear at intervals. It is a continuous programme of assessment designed to provide ongoing assurance that the ISMS remains suitable, adequate, and effective as the organisation and its environment change.

Understanding what surveillance and recertification audits cover, how they differ from the initial certification, and how to maintain genuine ISMS currency between audit dates is essential for any professional responsible for an ISO 27001-certified ISMS — and is examined in the Lead Auditor qualification.

---

## The Three-Year Certification Cycle

```
YEAR 0: Initial Certification
├── Stage 1 Audit (documentation review)
└── Stage 2 Audit (operational assessment)
        ↓ Certificate issued (3-year validity)

YEAR 1: First Surveillance Audit
└── Surveillance Audit (targeted assessment — 1–2 days typically)
        ↓ Certificate confirmed (or suspended/withdrawn if major NC)

YEAR 2: Second Surveillance Audit
└── Surveillance Audit (targeted assessment — 1–2 days typically)
        ↓ Certificate confirmed (or action required)

YEAR 3: Recertification
└── Recertification Audit (full reassessment — similar in scope to Stage 2)
        ↓ New 3-year certificate issued (or certificate expires if not recertified)
```

The certificate has a fixed 3-year validity from its issue date. It does not automatically renew — the organisation must complete the recertification process before expiry.

---

## Surveillance Audits

### Purpose

Surveillance audits provide ongoing assurance between the initial certification and recertification. Their purpose is to confirm that:
- The ISMS continues to conform to ISO 27001 requirements
- It remains effectively implemented and maintained
- Corrective actions from previous findings have been implemented
- The ISMS has adapted to changes in the organisation and its environment

Unlike the initial certification (which assesses whether the ISMS is ready to be certified), surveillance audits assess whether the ISMS has been maintained and continues to be effective in practice.

### Frequency

ISO 27001 requires at least one surveillance audit per year in the 3-year certification cycle. Most certification bodies schedule:
- **Year 1 surveillance**: Approximately 12 months after the certificate issue date
- **Year 2 surveillance**: Approximately 24 months after the certificate issue date
- **Year 3**: Recertification

Some CBs offer flexibility — annual surveillance can be scheduled at any point within the 12-month window. Organisations that want maximum time to prepare may schedule late in the window; those that want to demonstrate ongoing maturity may schedule earlier.

### Scope of Surveillance Audits

Surveillance audits are narrower in scope than the initial Stage 2 audit. They do not reassess the entire ISMS — they focus on:

**Mandatory surveillance scope elements** (required at every surveillance audit):

1. **Internal audit and management review**: Were these conducted? Are records adequate? Were findings from the internal audit addressed?

2. **Actions on opportunities for improvement**: What improvement actions were committed to at the last audit or management review? Were they completed?

3. **Handling of complaints**: Have any security complaints been received from customers, regulators, or other interested parties? How were they handled?

4. **Effectiveness of the ISMS with regard to achieving the certified organisation's objectives**: Is the ISMS delivering what it is supposed to deliver? Are objectives being achieved?

5. **Progress of planned activities aimed at continual improvement**: Is the improvement programme active and progressing?

6. **Continued operational control**: Are the controls that were assessed at Stage 2 still in place and operating?

7. **Any changes**: Have any significant changes occurred that affect the ISMS (scope, context, risk assessment, controls)?

8. **Sampling of Annex A controls**: The CB will sample a subset of Annex A controls to verify continued effective implementation. This sample changes between surveillance visits — the CB builds up coverage of the full Annex A control set across the surveillance cycle.

**Plus targeted focus areas** — the CB may focus on specific areas based on:
- Findings from the previous audit
- Known risks in the sector (e.g. a major industry breach that has occurred since the last audit)
- Changes the organisation has flagged
- Areas of concern identified from the previous audit's observations

### Preparing for Surveillance Audits

The best preparation for a surveillance audit is maintaining the ISMS properly between audits — conducting internal audits on schedule, holding management reviews, updating the risk register when changes occur, tracking treatment plan progress, and addressing corrective actions promptly.

Specific pre-surveillance preparation:

**Verify mandatory elements are in place:**
- Internal audit conducted within the scheduled programme period — report complete and corrective actions tracked
- Management review conducted — minutes complete, all inputs covered, decisions documented
- All corrective actions from previous CB audit closed with evidence

**Update all core ISMS documentation:**
- Risk register current — updated for any significant changes since last surveillance
- SoA current — especially if new controls have been implemented or the scope has changed
- Information security objectives — progress documented
- Policies reviewed within their defined review period

**Prepare evidence:**
- Have evidence organised and accessible for the controls the CB is likely to sample
- The CB will typically indicate their planned focus areas in advance
- Evidence from the full period since last audit — not just the most recent period

**Brief staff:**
- Staff who may be interviewed should be aware the audit is happening
- They should understand their responsibilities and be able to describe their actual practices honestly
- Key process owners (access management, patch management, incident management) should be prepared to demonstrate their processes

### What Happens During a Surveillance Audit

Surveillance audits follow the same structure as Stage 2 — opening meeting, fieldwork, closing meeting — but are shorter (typically 1–2 days for most organisations) and more targeted.

**Opening meeting**: The auditor confirms scope, reminds the organisation of the process, and outlines the planned approach for the day.

**Fieldwork**: The auditor works through their planned scope:
- Requests evidence of internal audit and management review
- Reviews corrective action status from previous audit
- Samples Annex A controls (requesting evidence of operation)
- Conducts interviews with selected staff
- Reviews documentation changes since last audit

**Closing meeting**: Findings presented — conformances, observations, and any nonconformities.

### Surveillance Audit Outcomes

| Finding | Effect on certificate |
|---|---|
| No findings / observations only | Certificate confirmed — no action required |
| Minor NCs | Certificate maintained; corrective action required; verification at next audit or via documentary review |
| Major NC | Certificate suspended; corrective action plan required within 30 days; certificate reinstated when major NC closed; if not closed within agreed period (typically 6 months), certificate withdrawn |
| Multiple major NCs or persistent pattern of minor NCs | Certificate withdrawn; recertification required from scratch |

### Certificate Suspension vs Withdrawal

**Suspension**: The certificate is temporarily invalid. The organisation cannot claim certification during the suspension period. Once the major NC is closed to the CB's satisfaction, the suspension is lifted and the certificate is reinstated.

**Withdrawal**: The certificate is permanently invalid. The organisation must complete a new Stage 1 + Stage 2 audit to achieve certification again. Withdrawal typically occurs when: corrective actions are not completed within the agreed timeframe; or the organisation itself requests withdrawal.

Certificate withdrawal is rare in practice — most organisations with a genuine commitment to maintaining their ISMS address major NCs within the required timeframe. However, the mechanism exists and auditors should understand it.

---

## Recertification Audit

### Purpose

The recertification audit is a full reassessment of the ISMS at the end of the 3-year certification cycle. Its purpose is to confirm that the ISMS remains suitable, adequate, and effective for a further 3-year period. A new 3-year certificate is issued if the audit is successful.

### How Recertification Differs from Surveillance

| Dimension | Surveillance Audit | Recertification Audit |
|---|---|---|
| Scope | Targeted — specific areas, sample of controls | Full — all clauses and comprehensive control sampling |
| Duration | 1–2 days typically | Similar to Stage 2 (2–5 days for most organisations) |
| Focus | Maintenance and continuation | Full reassessment of ISMS fitness |
| Documentation review | Update to previous Stage 1 | Full documentation review (similar to Stage 1) |
| Annex A coverage | Sample (builds up across surveillance cycle) | Comprehensive sampling |
| Corrective actions | Previous surveillance findings | Stage 2 + all surveillance findings across the cycle |

The recertification audit is, in effect, a repeat of the Stage 2 audit — but with the benefit of 3 years of ISMS operational history that the initial Stage 2 did not have. The auditor can now ask not just "is the ISMS in place?" but "has the ISMS been maintained, improved, and adapted over 3 years?"

### What the Recertification Audit Assesses

**Has the ISMS been maintained?**
- Are all required activities (internal audit, management review, monitoring) being conducted on schedule?
- Has the risk register been kept current?
- Are corrective actions being addressed promptly?

**Has the ISMS been improved?**
- Is the ISMS measurably better than at the initial certification?
- Are control effectiveness metrics trending in the right direction?
- Has the programme grown in maturity?

**Is the ISMS still appropriate?**
- Has the ISMS adapted to significant changes in the organisation and its environment?
- Is the scope still relevant?
- Is the risk assessment current?

**Are the results of surveillance being acted on?**
- Have findings from Year 1 and Year 2 surveillance been addressed?
- Has the improvement cycle (Clause 10) been operating effectively?

### Preparing for Recertification

**Start early**: Recertification preparation should begin 6–9 months before the certificate expiry date. This allows time to address any significant gaps identified in a pre-recertification internal audit.

**Conduct a comprehensive internal audit**: A full internal audit covering all clauses and a representative sample of Annex A controls — conducted 3–4 months before the recertification audit. This is the most effective preparation activity.

**Review the full 3-year ISMS evolution**: Prepare a narrative of how the ISMS has evolved over the certification period — what changed, what improved, what was challenging, how the programme has matured. This demonstrates the continual improvement that Clause 10 requires.

**Address all outstanding findings**: All minor NCs from Year 1 and Year 2 surveillance should be closed before recertification. Any open findings significantly increase recertification risk.

**Update all documentation**: Policies reviewed, risk register current, SoA current, objectives updated, scope statement accurate.

**Management review**: Conduct a comprehensive management review in the months before recertification — this provides both required evidence and the governance assurance that the ISMS is being actively managed.

---

## Managing the Certificate Between Audits

### The Between-Audit Trap

The most common ISMS failure pattern:
1. Intensive effort → certification achieved
2. Relief → ISMS activities deprioritised
3. Gradual degradation → risk register stale, corrective actions outstanding, training overdue
4. Pre-audit panic → frantic last-minute remediation
5. Surveillance audit → findings that could have been avoided

This pattern is extremely common and entirely preventable. The solution is treating the ISMS as a continuous programme, not a periodic audit preparation exercise.

### The Between-Audit Maintenance Calendar

| Activity | Frequency | Responsible |
|---|---|---|
| Security metrics review | Monthly | CISO / Risk Manager |
| Risk register review (High/Critical risks) | Monthly | Risk Manager + Risk Owners |
| Vulnerability scan | Weekly/continuous | IT Operations |
| Phishing simulation | Quarterly | Security Team |
| Access review | Quarterly | IT Operations + Business units |
| Backup restoration test | Quarterly | IT Operations |
| Risk register full review | Quarterly | Risk Manager |
| Internal audit (targeted) | Quarterly (for high-risk areas) | Internal Auditor |
| Management review (Security Committee) | Quarterly | CISO + Senior Management |
| Security awareness training renewal | Annual | HR / Security Team |
| Full risk assessment | Annual | Risk Manager + Business units |
| Full ISMS internal audit | Annual | Internal Auditor (independent) |
| Comprehensive management review | Annual | CISO + Top Management |
| SoA review and update | Annual (or when scope/risk changes) | CISO |
| Policy review cycle | Annual | Policy owners |
| Supplier security reassessment | Annual (for critical suppliers) | Risk Manager / Procurement |

### Tracking ISMS Health Between Audits

Organisations that maintain genuine ISMS health between audits typically use a dashboard or tracker that monitors:

**Green/Amber/Red status for:**
- Internal audit programme: on schedule / behind schedule / significantly overdue
- Management review: conducted within interval / approaching due / overdue
- Risk register currency: all risks reviewed within schedule / some overdue / significantly stale
- Treatment plan progress: on track / some slippage / significant overdue actions
- Training completion: at target / below target / significantly below
- Corrective actions: all closed / some open within SLA / overdue actions outstanding

When any indicator goes Red, it should trigger escalation and remediation — not be left until the next audit reveals it.

---

## The Details That Matter

### Certificate Transfer Between CBs

Organisations sometimes want to change certification bodies — because of cost, service quality, auditor experience, or business requirements. Certificate transfer is possible:

1. The new CB conducts a review of the existing certificate and audit history
2. They assess whether to accept the previous CB's work or require additional audit activities
3. If accepted, they issue a new certificate (typically maintaining the original expiry date or adjusting based on their assessment)
4. The old CB's certificate is surrendered

Certificate transfer does not restart the 3-year clock — it transfers the certificate with its existing history. Some CBs require a full reassessment before issuing their own certificate; this is their prerogative.

### Multi-Site Certificates and Surveillance

For organisations with multiple sites in scope, surveillance audits typically cover:
- The main/head site (always included)
- A rotating sample of satellite sites (typically 1–2 per surveillance visit)
- Over the 3-year cycle, all sites should be visited at least once

If a satellite site is found to have significant nonconformities during a surveillance visit, the CB may require additional surveillance at other satellite sites to verify whether the issue is site-specific or systemic.

### Scope Changes During the Certification Period

Changes to the ISMS scope during the certification period must be reported to the CB. Scope changes may require:
- A supplementary audit if the scope expansion is significant (new sites, new products, new business processes)
- An updated certificate reflecting the new scope
- Reassessment of certain Annex A controls if the scope change introduces new risk areas

Organisations that expand scope significantly without notifying the CB risk having their certificate invalidated — the certificate covers the scope it was originally issued for, not an expanded scope that has never been assessed.

### Using the Certificate Commercially

During the certification period, the organisation can:
- Reference ISO 27001 certification in marketing materials, tenders, and contracts
- Display the certificate on its website and in sales collateral
- Include the CB's certification mark (subject to the CB's usage rules)

The organisation must not:
- Claim certification for activities outside the scope
- Use the certificate after it has expired or been suspended/withdrawn
- Imply the certificate covers the entire organisation if the scope is limited

Misuse of the certificate may result in the CB withdrawing the certificate and potentially legal consequences if the misuse is material.

---

## Common Mistakes and Failures

**1. ISMS effectively dormant between audits.**
No internal audits conducted. Risk register not updated. Management reviews nominal rather than substantive. The ISMS exists only as documentation — operational reality has drifted completely. At the surveillance audit, the auditor finds an ISMS that looks identical to the one certified 12 months ago, despite the organisation having changed significantly. Multiple findings result.

**2. Corrective actions from surveillance not closed before next surveillance.**
Year 1 surveillance raises 3 minor NCs. No corrective actions are completed before Year 2 surveillance. Year 2 auditor finds the same 3 minor NCs still open — plus they have now accumulated 12 months of additional evidence of non-compliance. What were minor NCs in Year 1 are now potentially elevated to major NCs in Year 2. Certificate is at risk.

**3. Scope drift — organisational changes not reflected in scope.**
The organisation acquired a subsidiary in Year 2. The subsidiary has access to in-scope systems and handles in-scope data. But the ISMS scope was never updated to include the subsidiary, and no risk assessment was conducted for the subsidiary's contribution to the risk environment. The surveillance auditor discovers the scope discrepancy and raises a major NC.

**4. Recertification treated as a new certification effort.**
All ISMS documentation is redone from scratch for recertification. The 3-year history of the ISMS is effectively erased and replaced with fresh documentation. The auditor, expecting to assess a mature, evolved ISMS, instead sees a newly reconstructed one with no evidence of improvement over the certification period. This is both inefficient and counterproductive.

**5. No continuity planning for key ISMS personnel.**
The CISO who built the ISMS leaves 18 months into the certification period. Their replacement has no handover, no understanding of the ISMS architecture, and no relationship with the CB. The ISMS effectively stalls for 6 months while the new CISO gets up to speed. Multiple surveillance findings result from the operational gap. Single-person dependency is an ISMS risk — and a risk that should have been assessed and managed.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Surveillance and recertification audits are examined in the Lead Auditor qualification, including: what mandatory elements must be assessed at every surveillance audit; how to plan a surveillance audit; how to handle findings of scope drift or persistent non-compliance; when a certificate should be suspended vs withdrawn.
- Key exam scenarios:
  - "A surveillance audit finds that the organisation has not conducted a management review in 18 months. How should this be classified?" (Major NC — systemic absence of a required element)
  - "A surveillance audit finds that all minor NCs from the Year 1 audit are still open with no corrective action progress. What should the auditor do?" (Consider whether the collective failure represents a major NC; discuss with the CB; potentially recommend certificate suspension)
  - "The organisation expanded its scope to include two new offices after certification. No additional audit was conducted. How should the auditor respond?" (Document the scope discrepancy; conduct limited assessment of the new offices within the current surveillance; raise findings if the new offices have not been brought into ISMS management; recommend supplementary audit if scope expansion is significant)

**CISM:**
- Domain 3 (Security Programme) — maintaining certification over time is part of programme management; understanding the surveillance cycle and what it requires of programme management is relevant to CISM

---

## GUARDIAN's Take

The surveillance audit is where the difference between a genuine ISMS and a certification-chase ISMS becomes undeniable.

An organisation with a genuine ISMS arrives at Year 1 surveillance with 12 months of internal audit records, management review minutes showing active governance decisions, a risk register that has been updated 3 times following significant changes, corrective actions all closed, and metrics trending in the right direction. The surveillance auditor spends their time confirming that everything they certified 12 months ago is still in place and improving. It is a relatively comfortable 1.5-day visit.

An organisation with a certification-chase ISMS arrives at Year 1 surveillance with 12 months of ISMS inactivity — a risk register untouched since the Stage 2 audit, no internal audit conducted, a management review minute that was produced two weeks before the surveillance visit, and evidence files that haven't been added to since the initial certification. The surveillance auditor spends 1.5 days finding findings, raising nonconformities, and documenting an ISMS that is nominally certified but operationally dormant.

The surveillance audit is not the enemy of an organisation with a genuine ISMS. It is confirmation that the investment in building the ISMS was worthwhile. It is the external validation that the programme is working.

For organisations with cosmetic ISMSs, the surveillance audit is an uncomfortable revelation — and a justified one.

The solution is not to prepare better for surveillance. The solution is to run the ISMS properly throughout the year so that the surveillance auditor finds exactly what you would want them to find: a living, maintained, improving ISMS that is genuinely managing the organisation's information security risk.

That is what the certificate is supposed to represent. Make sure it does.

---
*Module: Module 3 — ISO 27001 | Guardian Curriculum*
