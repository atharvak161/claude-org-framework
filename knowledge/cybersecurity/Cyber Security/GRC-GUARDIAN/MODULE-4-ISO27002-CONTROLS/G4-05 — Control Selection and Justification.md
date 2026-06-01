---
tags: [guardian, grc, module-4, iso27002, control-selection, risk-based, soa, justification, proportionality]
module: 4
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G3-05 — ISO 27001 Clause 6 — Planning", "G3-10 — Annex A Controls — Complete Reference 2022", "G3-11 — Statement of Applicability", "G4-01 — Organisational Controls", "G4-05 — Control Selection and Justification", "G4-06 — Control Testing and Evidence Collection"]
---

# G4-05 — Control Selection and Justification

> [!abstract] What This Note Covers
> By the end of this note, you will understand the full process of risk-based control selection — how to move from a completed risk assessment to a coherent control set, how to justify every selection and exclusion, how to ensure proportionality, and how to build the traceability chain that auditors will follow.

---

## Why This Exists

Control selection is the step where risk management theory becomes security practice. The risk assessment has identified what could go wrong. The treatment decision has determined that mitigation is required. Now the organisation must decide: which specific controls will reduce this specific risk to within appetite?

This decision is frequently made badly — through one of two failure modes:

**Failure mode 1: Checklist compliance.** Controls are selected by working through Annex A and ticking boxes. The result is a control set that looks comprehensive on paper but is disconnected from actual risk. Controls are implemented because the standard lists them, not because they address identified threats to valued assets.

**Failure mode 2: Technical intuition.** The IT team selects controls based on their technical knowledge and experience — "we should have a SIEM," "we need EDR," "MFA is important." These may be the right controls, but without a risk-based justification connecting each control to a specific risk, the selection cannot be defended in an audit, and gaps in less-obvious areas (supplier security, physical controls, people controls) are systematically missed.

The correct approach — risk-based control selection with documented justification — produces a control set that is directly connected to the organisation's specific risk profile, defensible to auditors, proportionate to the risk, and comprehensive enough to ensure nothing important is missing.

---

## The Control Selection Process: End-to-End

### Step 1: Start with the Risk Register

Control selection begins with the risk register, not with Annex A. For each risk with a "Mitigate" treatment decision, the question is: which controls would reduce the likelihood or impact of this risk to within the risk appetite?

**For each risk to be mitigated:**
- What is the threat? What controls can reduce the likelihood of the threat successfully exploiting the vulnerability?
- What is the vulnerability? What controls can close or reduce the vulnerability?
- What is the asset? What controls can reduce the impact if the risk materialises?

This three-dimensional analysis produces a candidate control list for each risk. Controls may be preventive (reduce likelihood), detective (reduce dwell time and impact), or corrective (reduce recovery time and cost).

**Example: Risk RISK-017 — Ransomware via unpatched VPN gateway**

| Control dimension | Candidate controls | Annex A reference |
|---|---|---|
| Reduce likelihood (threat) | Web filtering to block C2 traffic | A.8.23 |
| Reduce likelihood (vulnerability) | Patch management — critical patches within 7 days for internet-facing systems | A.8.8 |
| Reduce likelihood (vulnerability) | VPN with MFA — credential compromise requires both factors | A.8.5 |
| Reduce likelihood (vulnerability) | Configuration hardening of VPN gateway | A.8.9 |
| Reduce detection time | SIEM alerting on VPN anomalies | A.8.15, A.8.16 |
| Reduce impact (recovery) | Immutable offsite backups tested quarterly | A.8.13 |
| Reduce impact (recovery) | Incident response plan with ransomware-specific playbook | A.5.24, A.5.26 |

This analysis produces 7 controls for one risk. Multiply across 40+ risks in a typical risk register and you have a substantial candidate control list.

### Step 2: Aggregate and Rationalise

Many controls will appear as candidates for multiple risks. For example, MFA (A.8.5) addresses credential-based attack risks across multiple risk register entries. Aggregate the control list to identify which controls address the highest number of risks and carry the greatest risk reduction value.

**Control value matrix:**

| Control | Risks addressed | Risk reduction per risk | Priority |
|---|---|---|---|
| MFA (A.8.5) | RISK-017, 019, 023, 031, 038 | High (reduces likelihood 3→1 for credential risks) | Very High |
| Patch management (A.8.8) | RISK-017, 021, 025, 029, 033 | High (closes exploitable vulnerabilities) | Very High |
| Security awareness (A.6.3) | RISK-019, 022, 026, 034, 041 | Medium (reduces human vulnerability) | High |
| Network segmentation (A.8.22) | RISK-017, 021, 025 | Medium (limits lateral movement) | Medium |
| Physical access control (A.7.2) | RISK-044, 046 | High (for those specific risks) | Medium overall |

This matrix prioritises controls by their overall programme value — not just their value for individual risks — enabling resource allocation decisions.

### Step 3: Compare Against Annex A

Once the risk-driven control candidate list is assembled, compare it against all 93 Annex A controls. This is the completeness check required by ISO 27001 Clause 6.1.3(c):

> *"compare the controls determined in b) above with those in Annex A 6.1.3 and verify that no necessary controls have been omitted."*

For each Annex A control not already in the candidate list:
- **Ask**: Is there a risk in the register that this control addresses? (If yes, add it to the selected controls and trace it to the risk.)
- **Ask**: Is there a regulatory or contractual obligation that this control satisfies? (If yes, add it and document the obligation.)
- **Ask**: Is there a business requirement that this control serves? (If yes, add it and document the requirement.)
- **If none of the above**: The control may be excluded — but the exclusion must be documented with justification.

This comparison ensures that the risk-based selection has not missed anything important — it is the safety net for the creative risk assessment process.

### Step 4: Finalise Selected Controls and Justifications

With the complete control set determined, document each control in the Statement of Applicability with:
- **Inclusion justification**: The specific risk(s), obligation(s), or business requirement(s) the control addresses
- **Implementation status**: Yes / Partially / No (with planned implementation date)
- **Evidence reference**: Where proof of implementation can be found

For excluded controls:
- **Exclusion justification**: Why the control is not applicable (no relevant risk, activity doesn't exist, fully addressed by other means)

### Step 5: Document the Risk Treatment Plan

For each risk above the acceptance threshold, document the specific actions required to implement the selected controls:
- Control name and Annex A reference
- Implementing owner (named individual)
- Target implementation date
- Resources required (budget, tooling, personnel)
- Expected residual risk after implementation

---

## Control Selection Principles

### Principle 1: Proportionality

Controls must be proportionate to the risk they address. This cuts in two directions:

**Under-control**: A Critical risk with a single preventive control and no detective or corrective controls. The preventive control may fail; there is nothing to catch the failure or limit its impact.

**Over-control**: A Low risk with an elaborate control suite costing more than the potential loss it prevents. Resources spent on over-controlled low risks are unavailable for under-controlled high risks.

**The proportionality test**: For each proposed control, ask:
1. What is the expected reduction in ALE (Annualised Loss Expectancy)?
2. What is the Annual Cost of Safeguard (ACS)?
3. Is the ALE reduction greater than the ACS? (If not, the control is not cost-effective — consider alternatives)

For the most important controls, this formal cost-benefit analysis produces a defensible investment justification. For lower-value controls, a qualitative proportionality judgment is sufficient.

### Principle 2: Defence in Depth

No single control is 100% effective. Controls fail, degrade, or are bypassed. Defence in depth means layering multiple controls across preventive, detective, and corrective categories, so that a failure in one layer does not result in complete compromise.

**For each significant risk, aim for:**
- At least one preventive control (reduce likelihood)
- At least one detective control (identify when prevention fails)
- At least one corrective control (recover when an incident occurs)

A risk with only preventive controls has no recovery capability when prevention fails. A risk with only corrective controls relies entirely on recovery after harm — no prevention, no detection.

### Principle 3: Risk Coverage

The selected control set must demonstrably address all risks above the acceptance threshold. A risk with no corresponding controls is an open risk with no treatment — regardless of what the risk register says about the treatment decision.

Test: For every "Mitigate" risk above appetite, trace at least one control in the SoA to that risk. If no trace exists, either the control is missing from the SoA or the risk treatment plan needs revision.

### Principle 4: Regulatory Completeness

Some controls are required not by the risk assessment but by regulatory obligation. These must be included regardless of whether the internal risk assessment would independently select them.

Examples:
- GDPR Article 32 requires "appropriate technical and organisational measures" — the risk assessment drives what "appropriate" means, but certain controls (breach notification, DPO appointment, DPIA process) are required independently of internal risk assessment
- PCI DSS requires specific controls for organisations processing card data — some may not be independently selected by a risk assessment but are contractually mandated
- FCA SYSC rules require specific operational resilience controls for regulated firms

These regulatory requirements should be captured in the "inclusion justification" column of the SoA as regulatory obligations, not just internal risk drivers.

### Principle 5: Control Lifecycle Awareness

Control selection is not a one-time decision. Controls must be reviewed when:
- Risks change (new threats, changed vulnerabilities, changed assets)
- Controls degrade (effectiveness decreases over time without maintenance)
- Technology changes (a control designed for on-premise infrastructure may not translate to cloud)
- Standards change (new Annex A controls introduced in the 2022 revision)
- Regulatory requirements change (new guidance, new legislation)

Build control review into the ISMS calendar — at minimum annually as part of the risk assessment cycle, and triggered by significant changes.

---

## Control Justification: What Good Looks Like

The justification for each control in the SoA is the most scrutinised element of the document during audit. A good justification:

**Is specific**: Names the risk(s) by ID, or names the specific regulatory obligation. Does not use generic language like "best practice" or "industry standard."

**Traces to the risk register**: The risk register entry and the SoA control entry are explicitly linked. An auditor can move from the SoA control to the risk register entry and understand why the control was selected.

**Explains the control's role**: Not just "required for RISK-017" but "required to reduce the likelihood of credential-based attacks exploiting the absence of strong authentication on internet-facing systems (RISK-017). MFA reduces likelihood from 4 (Likely) to 2 (Unlikely) in the risk assessment."

**Is honest about implementation status**: A partially implemented control is not fully implemented. Claiming full implementation when the control covers 80% of users understates the residual risk and misrepresents the ISMS state.

### Justification Templates

**For risk-driven inclusions:**
> "Control A.8.5 (Secure authentication) is applicable to address risks RISK-017, RISK-019, and RISK-023, all of which identify credential-based attack as the primary threat vector for internet-facing systems. Implementation of MFA is expected to reduce the likelihood score for these risks from 4 (Likely) to 2 (Unlikely). Additionally, MFA is required for PCI DSS Requirement 8.4 (multi-factor authentication for all access into the cardholder data environment)."

**For regulatory obligation inclusions:**
> "Control A.5.7 (Threat intelligence) is applicable to satisfy the organisation's obligation under NIS Regulations to take 'appropriate and proportionate technical and organisational measures to manage the risks posed to the security of network and information systems.' Threat intelligence enables informed, proactive risk management that demonstrates active engagement with the threat landscape."

**For exclusions:**
> "Control A.8.25 (Secure development life cycle) is not applicable. The organisation does not develop software internally or outsource software development. All applications are procured as commercial off-the-shelf (COTS) products from established vendors. Vendor security practices are assessed through the supplier security programme (A.5.19). This exclusion will be reviewed annually and if software development activities begin, the control will be added as applicable."

---

## Control Selection for Different Organisational Contexts

### Small Organisation (< 50 staff)

**Focus on:**
- The controls that address the highest-impact risks for the business (typically: credential-based attacks, phishing, ransomware, data breaches)
- Baseline coverage across all four categories — something organisational, something people, something physical, something technological
- Proportionate evidence — a small organisation does not need a full-scale SIEM; a managed detection service or cloud-native security tooling may be sufficient

**Common exclusions (justified):**
- A.8.25 (Secure development) — no software development
- A.8.9 (Configuration management) — limited infrastructure; simplified baseline configuration documented
- A.8.22 (Network segmentation) — simple network; flat network with compensating controls documented

### Medium Organisation (50–500 staff)

**Focus on:**
- Comprehensive coverage across all four Annex A categories
- Growing control maturity — moving from basic to intermediate controls
- Third-party and supply chain security — growing supplier base creates supply chain risk
- Cloud security — most organisations in this range are cloud-first or hybrid

**Key controls for this tier:**
- A.8.5 (MFA) — mandatory
- A.8.8 (Vulnerability management) — formal programme with SLAs
- A.8.15 (Logging) + A.8.16 (Monitoring) — at minimum, cloud-native security logging
- A.5.19–A.5.22 (Supplier security) — formal programme for critical suppliers
- A.5.23 (Cloud services) — cloud security assessment and configuration programme

### Large Organisation (500+ staff)

**Focus on:**
- Mature implementation across all controls
- Integration of controls into the enterprise risk management framework
- Formal PAM (Privileged Access Management)
- Mature SIEM with 24/7 SOC (internal or MSSP)
- Comprehensive third-party risk programme with tiered assessment

**Key controls for this tier:**
- A.8.2 (Privileged access) — formal PAM solution
- A.8.15/A.8.16 — SIEM with UEBA; formal alert review process
- A.8.12 (DLP) — email and endpoint DLP
- A.8.9 (Configuration management) — automated compliance scanning
- A.5.7 (Threat intelligence) — formal threat intelligence programme

---

## Control Exclusion: The Difficult Cases

### Case 1: A.7.1 (Physical security perimeters) — Cloud-only organisation

**Situation**: The organisation has no physical premises of its own — all staff work remotely; cloud infrastructure; registered office is a virtual office service.

**Valid exclusion?**: Partially. The physical perimeter control for the organisation's own premises may be excluded if there are genuinely no relevant premises. However:
- Cloud infrastructure is hosted in data centres with physical perimeters — but the cloud provider's physical security, not the organisation's, protects this. The organisation should assess the cloud provider's physical security (ISO 27001 certificate, SOC 2 report).
- Remote workers' homes have physical security implications — the remote working control (A.6.7) addresses this.
- Any physical offices used (co-working spaces, client sites) may require consideration.

**Exclusion justification**: "A.7.1 (Physical security perimeters) is not applicable to organisation-owned premises, as the organisation operates entirely remotely with no organisation-owned physical facilities. Cloud infrastructure is hosted by [provider], whose physical security is covered by their ISO 27001 certification (certificate number X, valid to Y). Remote worker physical security is addressed through A.6.7."

### Case 2: A.8.28 (Secure coding) — No internal development

**Situation**: The organisation uses only commercial software; no in-house development.

**Valid exclusion?**: Yes, if truly no development. But consider:
- Do staff write scripts, macros, or automation that could be considered "development"?
- Has the organisation outsourced any development? (A.8.30 addresses outsourced development)
- Does the organisation use low-code/no-code platforms that allow custom logic?

If any of the above applies, A.8.28 may still be partially applicable.

**Exclusion justification**: "A.8.28 (Secure coding) is not applicable as the organisation does not conduct software development activities internally. All applications are procured from established vendors (COTS). Vendor development security practices are assessed through the supplier security programme (A.5.19). A.8.30 (Outsourced development) is similarly not applicable for the same reason."

### Case 3: A.8.11 (Data masking) — No sensitive data in test environments

**Situation**: The organisation has a test environment but claims it never contains sensitive data.

**Valid exclusion?**: Possibly — but the claim must be verified. Common experience: organisations believe their test environments don't contain production data but they actually do (a developer copied a production database "just for this one test"). The exclusion is valid if there are technical controls preventing production data from reaching test environments, or if the architecture genuinely separates them completely.

**Exclusion justification (if genuinely valid)**: "A.8.11 (Data masking) is not applicable as the organisation does not use production data in test or development environments. Test environments are populated exclusively with synthetic test data. This is controlled through [describe the technical control or process that enforces this]."

---

## The Traceability Chain: Putting It All Together

The complete traceability chain that auditors will follow:

```
CONTEXT (Clause 4)
[What are the internal/external issues? Who are the interested parties?]
        ↓
RISK ASSESSMENT (Clause 6.1.2)
[What are the risks? What is their likelihood and impact?]
        ↓
TREATMENT DECISION (Clause 6.1.3)
[Which risks require mitigation? Which controls address them?]
        ↓
STATEMENT OF APPLICABILITY (Clause 6.1.3(d))
[Which Annex A controls are applicable? Why? Implementation status?]
        ↓
RISK TREATMENT PLAN (Clause 6.1.3(e))
[What actions implement the selected controls? Who? By when?]
        ↓
CONTROL IMPLEMENTATION (Clause 8)
[Are controls deployed and operating?]
        ↓
EVIDENCE (Clause 8.1, 8.3)
[What proves controls are working?]
        ↓
MONITORING (Clause 9.1)
[Are controls remaining effective? Are risks within appetite?]
        ↓
INTERNAL AUDIT (Clause 9.2)
[Independent verification of the above chain]
        ↓
MANAGEMENT REVIEW (Clause 9.3)
[Board-level confirmation that the chain is working]
        ↓
IMPROVEMENT (Clause 10)
[Where the chain breaks, fix it]
```

Every step in this chain must be traceable to every other step. An auditor at any point in the chain should be able to trace backward to the risk that justified the control, and forward to the evidence that demonstrates it is working.

---

## Common Mistakes and Failures

**1. Controls selected from Annex A without risk register references.**
The SoA lists 78 applicable controls. When auditors ask "which risk does A.8.20 address?" the answer is "network security is important." This is not a justification. Every control must trace to a risk, an obligation, or a business requirement.

**2. Control justification added after the fact.**
The control set was assembled first; the risk register was built to match the controls. The justifications in the SoA were written to create the appearance of a risk-driven selection that was actually a checklist exercise. Auditors recognise this pattern — the language is generic, the risk register entries are vague, and there is no specificity in the justification.

**3. Controls selected without implementation capability.**
A control is in the SoA as applicable and "planned for implementation" — but no budget has been approved, no owner has been assigned, and no timeline has been set. The control is aspirational, not planned. The risk it was supposed to address has no treatment.

**4. Proportionality failures in both directions.**
A Critical risk with a single control and no detective capability. Or a Low risk with an expensive, elaborate control suite. Both represent failure to apply the proportionality principle.

**5. Exclusions without justification.**
Controls excluded from the SoA with no documented reason. Auditors will challenge every exclusion — the absence of justification is itself a finding.

**6. Control selection that ignores people and physical controls.**
Technical practitioners naturally gravitate toward technical controls. ISMSs designed by IT teams without broader business input consistently under-represent organisational, people, and physical controls. The risk assessment should reveal these gaps — but only if the risk assessment workshops include non-technical business participants.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Control selection and justification is one of the most frequently tested areas. The auditor must assess whether the SoA reflects a genuine risk-based selection or a compliance checklist.
- Key audit questions: "Show me how this control was selected. Which risk does it address? Where is that risk in the register?" "Why is A.5.7 excluded from your SoA? What risk assessment finding supports that exclusion?"
- Classification of control selection failures:
  - No justification for inclusions → minor NC (Clause 6.1.3(d) — SoA must include justification for inclusions)
  - Controls included with no corresponding risk → observation or minor NC (traceability gap)
  - Controls excluded with no justification → minor NC (Clause 6.1.3(d) — SoA must include justification for exclusions)
  - Risk treatment plan with controls not in SoA → minor NC (traceability break)

**CISM:**
- Domain 3 (Security Programme) covers control selection and programme design at the CISO level
- CISM tests whether candidates can align control selection to business objectives and risk appetite — not just to the standard's checklist

**CRISC:**
- Domain 3 (Risk Response and Mitigation) is directly about control selection — choosing controls that address specific identified risks at proportionate cost

---

## GUARDIAN's Take

Control selection is the most intellectually demanding activity in the ISMS build — and the activity where the GRC professional's value is most visible.

Anyone can work through the Annex A list and tick 78 boxes. What requires real expertise is starting from the organisation's specific risk profile — its specific assets, its specific threats, its specific context — and building a control set that is genuinely fit for purpose. That produces something the checklist never can: a control set where the CISO can explain, for any control, exactly which risk it addresses, how much it reduces that risk, and why that investment is proportionate to the exposure.

This is also where the CISO's relationship with the board becomes real. When you can say "we spent £120,000 on immutable backup this year because ransomware risk against our ERP database had an expected annual loss of £900,000 and the backup reduces that exposure by 85%" — that is a conversation the CFO and CEO can engage with. It justifies the investment. It connects security to business value. It demonstrates that the security programme is managed, not just operational.

Control selection done well is the foundation of the business case for security. Not "we need these controls because ISO 27001 says so" — but "we need these controls because they address these specific risks to these specific assets, and the cost of the control is substantially less than the cost of the risk materialising without it."

That is the standard. Build to it.

---
*Module: Module 4 — ISO 27002 Controls | Guardian Curriculum*
