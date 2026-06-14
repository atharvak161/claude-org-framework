---
tags: [guardian, grc, module-14, iso27001, certification, gap-assessment, stage-1, stage-2, surveillance]
module: 14
cert-coverage: [iso27001-la, cism]
difficulty: advanced
date: 2026-04-28
guardian-refs: ["G3-01 — What is ISO 27001", "G3-13 — The Certification Journey", "G3-14 — Internal Audit", "G3-15 — Nonconformities", "G10-02 — Audit Planning", "G14-01 — Building a GRC Function"]
---

# G14-03 — Managing ISO 27001 Certification — From Gap Assessment to Certificate

> [!abstract] What This Note Covers
> By the end of this note, you will understand the complete ISO 27001 certification journey from a programme management perspective — scoping decisions, gap assessment, ISMS implementation, certification body selection, Stage 1 and Stage 2 audit preparation, managing findings, and maintaining the certificate through the 3-year cycle.

---

## Why This Exists

ISO 27001 certification is a goal for most organisations implementing a GRC programme — but the path from "we want certification" to "certificate received" is longer, more complex, and more resource-intensive than most organisations anticipate. Missteps in scope definition, gap assessment, or certification body selection can add months and significant cost to the journey.

This note provides the complete programme management view — what decisions to make, in what sequence, and how to avoid the most common certification pitfalls.

---

## Phase 1: Scope Definition — The Most Important Decision

**The scope is the single most consequential ISMS decision.** It determines: what must be implemented; how long implementation takes; how much the certification costs; and what the certificate covers.

### Scope Dimensions

**Organisational scope**: Which organisational units, departments, or legal entities are included? Options:
- Whole organisation (all departments, all locations)
- A specific business unit or product line
- A specific geographic location
- A specific service or product

**System scope**: Which IT systems, networks, and applications are included? Systems outside the scope boundary do not need to have controls implemented to ISO 27001 standard — but if excluded systems interact with in-scope systems, the interface must be carefully managed.

**Physical scope**: Which offices, data centres, or facilities are included?

### Scope Decision Factors

**Customer requirements**: If customers require ISO 27001 certification for a specific service, the scope must include the systems and processes that deliver that service.

**Regulatory requirements**: If regulatory compliance drives certification, the scope must cover the regulated activity.

**Practical achievability**: A scope that is too broad will take too long and cost too much to certify within a reasonable timeframe. A focused initial scope (e.g. one business unit or one product) enables earlier certification with a plan to expand in subsequent cycles.

**The scope exclusion pitfall**: Narrowing scope to make certification easier while presenting the certificate as evidence of organisation-wide security is misleading to customers. The certificate explicitly states its scope — customers who evaluate certificates carefully will notice if critical systems are excluded.

### Documenting the Scope

The ISMS scope must be documented (ISO 27001 Clause 4.3) and must include:
- Organisational context and interested parties relevant to the scope
- The interfaces and dependencies between what is in scope and what is not
- Justification for any exclusions (why excluded; how risks from the exclusion are managed)

The scope statement on the certificate is typically 2–4 sentences. It must be specific enough to be meaningful but not so detailed that it becomes obsolete with minor organisational changes.

**Example scope statement:**
"The design, development, delivery, and support of [Product X], including associated information processing facilities at [Location], in accordance with Statement of Applicability version [X.X]."

---

## Phase 2: Gap Assessment

A **gap assessment** measures the distance between the organisation's current state and ISO 27001 requirements. It is the analytical foundation of the implementation plan.

### Gap Assessment Methodology

**Document review**: Assess existing documentation against ISO 27001 clause requirements and Annex A controls.

**Interviews**: Understand current processes from those who operate them — not just what is documented but what is actually done.

**Technical review**: Assess the configuration of in-scope systems against control requirements (access management; logging; encryption; patching).

**Gap classification:**
- **Implemented**: Control is fully implemented and operating effectively
- **Partially implemented**: Control exists but has gaps (documented but not followed; partially covered)
- **Not implemented**: Control is absent

### Gap Assessment Output

**Control-by-control assessment**: A table showing all 93 Annex A controls with gap status for each. This becomes the basis for the Statement of Applicability and the risk treatment plan.

**Clause gap assessment**: Assessment of Clauses 4–10 requirements — scope documentation; risk assessment process; risk treatment plan; policies; roles and responsibilities; awareness programme; internal audit; management review; corrective action.

**Priority ranking**: Gaps ranked by risk — which gaps represent the highest risk and therefore the highest implementation priority.

**Implementation effort estimate**: For each gap, an estimate of the effort required to close it — enabling the programme plan to be resourced realistically.

**Typical gap assessment findings for an organisation without existing ISMS:**
- Major gaps: risk assessment not conducted; no risk register; SoA not produced; no internal audit; no management review
- Significant gaps: access reviews not conducted; no formal supplier assessments; patch management informal; logging incomplete
- Minor gaps: policies exist but not reviewed; training completed but not tracked; procedures exist but outdated

---

## Phase 3: ISMS Implementation

Implementation of the ISMS is the longest phase — typically 6–12 months for an organisation of moderate complexity starting from a low maturity baseline.

### Implementation Sequence

**Priority 1 — Management system foundation (Clauses 4–6):**
- Scope document
- Organisational context document
- Risk assessment methodology
- Risk assessment and risk register
- Statement of Applicability (SoA)
- Risk treatment plan
- Information security policy (board approval)
- Objectives

**Priority 2 — Key control areas (highest-risk Annex A controls):**
- Access control programme (A.5.15–A.5.18; A.8.2–A.8.5)
- Vulnerability management (A.8.8)
- Logging and monitoring (A.8.15–A.8.16)
- Supplier security (A.5.19–A.5.22)
- Incident management (A.5.24–A.5.27)

**Priority 3 — Remaining control areas:**
- All other applicable Annex A controls not yet implemented
- Supporting policies and procedures for each control area

**Priority 4 — Management system operations (Clauses 7–10):**
- Competence and awareness programme (Clause 7.2–7.3)
- Communication plan (Clause 7.4)
- Internal audit programme and first audit (Clause 9.2)
- Management review (Clause 9.3)
- Corrective action process (Clause 10.1)

**The minimum operational period**: ISO 27001 requires evidence that the ISMS has been operating — not just implemented. The Stage 2 audit requires operational evidence (audit records, management review records, corrective actions, access review records). Typically, 3–6 months of operation before Stage 2 is necessary to accumulate sufficient evidence.

### The Statement of Applicability (SoA)

The SoA is the key ISO 27001 document — listing all 93 Annex A controls with:
- Whether each control is applicable (yes/no)
- If not applicable: justification for exclusion
- If applicable: whether it is implemented and how (brief description)
- The reason for inclusion (reference to risk assessment finding or legal/regulatory requirement)

**SoA common mistakes:**
- Marking controls as "not applicable" without adequate justification (certification bodies scrutinise N/A decisions closely)
- Marking controls as "implemented" when they are not (the Stage 2 audit will verify implementation)
- Not linking the SoA to the risk assessment (the SoA should reference specific risk register items that justify each control's inclusion)

---

## Phase 4: Certification Body Selection

### Selection Criteria

**Accreditation**: The CB must be accredited by an IAF-recognised national accreditation body (UKAS in the UK; DAkkS in Germany; COFRAC in France; ANAB in the US). Certificates from non-accredited CBs have no standing in customer procurement or regulatory contexts.

**Sector expertise**: Some CBs have specific expertise in particular sectors (financial services; healthcare; technology). A CB with experience in your sector understands the relevant regulatory context and can provide more meaningful audit insight.

**Geographic coverage**: If you have multiple locations, the CB must be able to audit all in-scope locations.

**Auditor assignment**: Who specifically will conduct the audit? Request information on the assigned auditor's background. An auditor with 20 years of financial services GRC experience auditing a fintech startup adds more value than a generalist.

**Cost**: Stage 1 and Stage 2 audit costs; annual surveillance audit costs; recertification costs. Costs vary significantly — get quotes from 2–3 CBs. Typically:
- Stage 1: £1,500–3,000
- Stage 2: £3,000–8,000 (depending on size and complexity)
- Annual surveillance: £2,500–5,000
- Full programme (3 years): £10,000–20,000 for a medium-sized organisation

**Commercial relationship**: What is the CB's approach to findings? Are they genuinely independent? Do they work collaboratively (explaining requirements) or adversarially (issuing findings without context)? References from other clients can clarify this.

---

## Phase 5: Stage 1 Audit Preparation and Execution

### What Stage 1 Tests

Stage 1 is a **documentation review** — the auditor assesses whether the ISMS documentation is sufficient to proceed to Stage 2. The auditor is not yet testing whether controls are implemented or operating; they are assessing whether the management system is designed and documented.

**Stage 1 scope:**
- Is the scope document complete and appropriate?
- Is the risk assessment methodology documented and applied?
- Is the risk register complete and current?
- Is the SoA complete — all 93 controls addressed with justification?
- Is the risk treatment plan linked to the risk register?
- Are the key policies in place and approved?
- Has an internal audit been planned or conducted?
- Is management review planned?

### Stage 1 Preparation

**Evidence package**: Prepare a structured evidence package aligned to the Stage 1 scope:
- ISMS scope document
- Organisational context document
- Risk assessment methodology and risk register
- SoA (current version)
- Risk treatment plan
- Information security policy and key topic-specific policies
- Internal audit plan (or records if conducted)
- Management review schedule or records

**Pre-Stage 1 internal review**: Review the evidence package against the checklist of Stage 1 requirements. Ask: "If I were the auditor, would I be satisfied with this documentation?" Fill any gaps before the formal audit.

**Common Stage 1 findings:**
- Incomplete SoA (not all 93 controls addressed)
- Risk assessment not linked to Annex A control selection
- Risk register not current or incomplete scope
- No evidence that internal audit has been planned
- Key policies missing (topic-specific policies not produced)

### Stage 1 Outcomes

**Confirmed for Stage 2**: Documentation is sufficient; Stage 2 audit is scheduled.

**Stage 1 findings**: Issues identified that must be addressed before Stage 2 can proceed. Stage 1 findings are typically observations or minor nonconformities — they delay Stage 2 until addressed.

**Stage 2 focus areas**: The Stage 1 report identifies areas the auditor will particularly focus on during Stage 2 — giving the organisation advance notice of where to ensure strong operational evidence.

---

## Phase 6: Stage 2 Audit Preparation and Execution

### What Stage 2 Tests

Stage 2 is a **full assessment** — the auditor tests whether the ISMS is implemented and operating effectively. This is where operational evidence is examined, processes are observed, and interviews are conducted with staff across the organisation.

**Stage 2 scope:**
- Are policies communicated to and understood by relevant staff?
- Is the risk assessment current and reviewed as required?
- Are Annex A controls actually implemented as described in the SoA?
- Is there operational evidence of control operation (access reviews completed; patches applied; incidents managed)?
- Has an internal audit been conducted with findings addressed?
- Has a management review been conducted?
- Are corrective actions being addressed?

### Stage 2 Preparation

**Evidence organisation**: Prepare evidence for each Annex A control — organised to match the SoA. For each control marked as implemented:
- What is the policy or standard that defines the requirement?
- What is the procedure that describes how it is implemented?
- What is the operational evidence that it is being followed?

**Key evidence to prepare:**
- Access review records (completed reviews for in-scope systems)
- Vulnerability scan reports and patch records
- Incident log (incidents in the ISMS period)
- Training completion records
- Supplier assessment records
- Internal audit report and corrective action register
- Management review minutes
- Change management records

**Staff preparation**: Inform all staff that the audit is happening. Prepare staff who will be interviewed:
- What their role is in the ISMS
- What they do to follow relevant policies and procedures
- Where to find relevant documentation
- What to do if asked something they cannot answer (say so; don't guess)

**Do not coach scripted answers** — as noted in G10-02, experienced auditors recognise scripted responses and probe harder. Brief staff on being honest and natural, not on giving specific answers.

### Managing Stage 2 Findings

**Major nonconformities**: Must be closed before the certificate is issued. The organisation submits a corrective action plan; the CB reviews and accepts it; the certificate is issued once the CAP is accepted (evidence review at Stage 2 or a follow-up visit).

**Minor nonconformities**: Must be addressed within the defined surveillance audit cycle (typically 12 months). The certificate is issued with the minor NC noted.

**The CB's closing meeting**: The Stage 2 audit concludes with a closing meeting where findings are presented. Apply the audit conduct principles from Module 10 — engage professionally; provide new evidence if findings are inaccurate; do not capitulate without evidence; note legitimate disagreements.

**Certificate issue timeline**: Following Stage 2, assuming no major NCs (or all major NCs addressed), the certificate is typically issued within 4–6 weeks.

---

## Phase 7: Maintaining the Certificate — The 3-Year Cycle

Certification is not a one-time event — it is a 3-year cycle that requires ongoing investment in ISMS operation.

### The Surveillance Audit (Annual)

Annual surveillance audits verify that the ISMS is being maintained and continuously improved. They are lighter than Stage 2 — typically 1–2 days — and focus on:
- Progress against corrective actions from previous audits
- Internal audit results since last surveillance
- Management review since last surveillance
- Risk register currency
- Specific areas of focus based on the CB's risk assessment (areas that had findings; areas of high risk; areas that have changed)

**Surveillance audit preparation:**
- Ensure all corrective actions from the last audit are closed or on track
- Complete the annual internal audit programme before the surveillance audit (so there is fresh evidence of ISMS operation)
- Conduct management review before the surveillance audit
- Update the risk register if significant changes have occurred
- Prepare evidence of key control operation in the period since the last audit

### The Recertification Audit (Year 3)

The recertification audit is a full reassessment — similar in scope to Stage 2 — confirming that the ISMS continues to meet ISO 27001 requirements and is worthy of a new 3-year certificate.

**Recertification preparation** is similar to Stage 2 preparation but with additional focus on:
- Demonstrating continual improvement over the 3-year cycle
- Addressing any accumulated minor NCs from surveillance audits
- Updating the SoA and risk assessment to reflect changes in the environment
- Evidence of the complete 3-year internal audit programme

### Continual Improvement

ISO 27001 Clause 10.2 requires continual improvement. Evidence of improvement is what distinguishes a mature ISMS (improving certificate) from a static one (compliance-only certificate). Improvement evidence includes:

- Year-on-year reduction in risk posture metrics (fewer high/critical risks; lower MTTD; better patch compliance)
- Corrective actions from audits and incidents producing lasting improvements
- New controls implemented in response to new risks
- Policy and procedure updates reflecting evolving best practices
- Expanded scope covering more of the organisation or a wider range of controls

**The improvement narrative**: At recertification, the CISO should be able to tell a clear story of how the ISMS has improved over 3 years — what the maturity was at initial certification, what has changed, and what the current posture is. This narrative demonstrates that the ISMS is a living programme, not a certification trophy.

---

## Common ISO 27001 Certification Mistakes

**1. Scope too broad for the timeline.**
Attempting to certify the entire organisation in 12 months when the complexity warrants 24. The programme stalls; the deadline slips; credibility with executive sponsors is damaged. Define a achievable scope; expand later.

**2. SoA produced without linking to risk assessment.**
The SoA lists controls as applicable without explaining which risks they address. Stage 1 or Stage 2 auditors will identify this gap — the SoA must be traceable to the risk assessment.

**3. No operational period before Stage 2.**
Scheduling Stage 2 immediately after implementation, before 3–6 months of operational evidence has accumulated. The auditor asks for 6 months of access review records — there are none. Operational evidence takes time to accumulate.

**4. Internal audit conducted by the security team on their own work.**
The internal auditor cannot audit their own work. If the security team built the access controls, they cannot audit the access controls. Ensure auditor independence.

**5. Treating certification as the goal rather than security improvement.**
An ISMS implemented to get the certificate, not to improve security, produces a compliant programme that provides minimal actual risk reduction. Certification is the external validation of a genuine programme — not a substitute for one.

**6. Certificate obtained; programme abandoned.**
After certification, the ISMS is neglected — policies become outdated; internal audits are skipped; the risk register is not updated. At the first surveillance audit, there is no evidence of ongoing operation. The certificate is at risk.

---

## GUARDIAN's Take

ISO 27001 certification is the most significant GRC milestone most organisations will achieve — and the most frequently mismanaged. The organisations that do it well approach it as a genuine improvement programme where certification is the external validation of internal investment. The organisations that do it badly approach it as a compliance exercise where the goal is the certificate, not the security.

The difference is visible in the audit. An auditor interviewing staff who genuinely understand the policies they follow, who can describe how they handle security incidents, and who point to operational evidence without prompting — that is a genuine ISMS. An auditor interviewing staff who are clearly reciting coached answers, who cannot find the relevant documentation, and whose "evidence" was clearly prepared immediately before the audit — that is compliance theatre.

Build the programme, then get the certificate. In that order. The programme is the purpose; the certificate is the recognition.

The certification journey from gap assessment to certificate typically takes 12–18 months. The surveillance and recertification cycle is 3 years. The ISMS programme that emerges — with its risk register, control framework, audit evidence, and continual improvement culture — is the lasting asset. The certificate is renewed every 3 years because the programme keeps earning it.

---
*Module: Module 14 — GRC in Practice | Guardian Curriculum*
