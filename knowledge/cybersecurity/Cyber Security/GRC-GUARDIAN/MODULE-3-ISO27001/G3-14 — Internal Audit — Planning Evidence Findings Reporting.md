---
tags: [guardian, grc, module-3, iso27001, internal-audit, audit-planning, audit-evidence, audit-findings, audit-reporting]
module: 3
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G3-08 — ISO 27001 Clause 9 — Performance Evaluation", "G3-09 — ISO 27001 Clause 10 — Improvement", "G3-13 — The Certification Journey", "G3-15 — Nonconformities", "G10-01 — What is an Audit", "G10-08 — The Auditor Mindset"]
---

# G3-14 — Internal Audit — Planning, Evidence, Findings, Reporting

> [!abstract] What This Note Covers
> By the end of this note, you will understand how to plan and execute a professional ISO 27001 internal audit — from building the audit programme to conducting fieldwork, classifying findings, writing the audit report, and managing findings through to closure.

---

## Why This Exists

The internal audit is the most powerful tool the ISMS has for continuous improvement — and the most commonly misused. When done well, it surfaces genuine gaps before they become incidents or external audit findings, provides management with honest assurance that the ISMS is working, and drives meaningful improvement through the corrective action process. When done poorly, it produces clean reports that mislead management, gives false confidence ahead of external audits, and does nothing to improve the security posture.

The gap between these two outcomes is almost entirely explained by two factors: independence and rigour. Independent auditors ask uncomfortable questions. Rigorous auditors test whether controls actually work, not just whether they exist on paper.

This note covers everything needed to conduct a genuinely useful internal audit — one that the organisation can rely on and that will withstand scrutiny from external auditors.

---

## The Role of Internal Audit in ISO 27001

### What Clause 9.2 Requires

Clause 9.2 requires the organisation to conduct internal audits at planned intervals to determine whether the ISMS:
- Conforms to the organisation's own requirements for the ISMS
- Conforms to the requirements of ISO 27001
- Is effectively implemented and maintained

This is a dual requirement: conformance (does the ISMS meet the requirements?) and effectiveness (is it actually working?). Many internal audit programmes address conformance but not effectiveness — they check whether documents exist and processes are defined, without testing whether those processes are operating and producing the intended outcomes.

### The Audit Programme

The organisation must establish an **audit programme** — a planned schedule of internal audit activities that, over time, covers the full scope of the ISMS. Key decisions:

**Coverage cycle**: How long does it take to audit the full ISMS? Most organisations use a rolling 3-year programme aligned with the certification cycle, with higher-risk areas audited annually.

**Risk-based prioritisation**: Not all ISMS areas carry equal risk. Access control, vulnerability management, incident management, and supplier security typically warrant more frequent auditing than lower-risk areas like clear desk policy.

**Audit methods**: Different areas warrant different audit methods — document review, interviews, control testing, observation, sampling. The programme should specify the method for each scheduled audit activity.

**Resource plan**: Who will conduct each audit? What qualifications are required? How much time is allocated?

The audit programme is maintained as documented information and is reviewed by external auditors during Stage 1 and surveillance audits.

---

## Step 1: Audit Planning

### Defining Audit Scope and Criteria

For each internal audit, define:

**Scope**: What will be assessed in this audit? Options:
- Full ISMS audit (all clauses 4–10 and all applicable Annex A controls) — typically annual
- Clause-specific audit (e.g. Clauses 8 and 9 only) — targeted between full audits
- Control-category audit (e.g. all technological controls from Annex A Category 8) — themed audits
- Process-specific audit (e.g. incident management process, supplier management process) — deep-dive audits

**Criteria**: The standards and requirements against which the audit will assess. For an ISO 27001 internal audit, criteria include:
- ISO/IEC 27001:2022 (all "shall" requirements in Clauses 4–10)
- The organisation's own ISMS documentation (policies, procedures, the SoA)
- Applicable regulatory requirements (GDPR, PCI DSS, FCA rules) where relevant to the audit scope

**Audit objectives**: What specific questions should the audit answer?
- "Is our access control process operating as designed, with appropriate evidence?"
- "Are the 5 High-risk risks in the register being treated according to their treatment plans?"
- "Is our supplier security assessment process covering all critical suppliers within the required frequency?"

### Auditor Selection and Independence

The auditor must not audit their own work. Clause 9.2 requires objectivity and impartiality.

**Options for achieving independence:**
- Rotate internal auditors (the IT Manager audits HR processes; the Risk Manager audits IT processes)
- Use staff from a different business unit (finance auditing the security team's processes)
- Engage external support (outsource specific audit activities to an independent consultant)
- For the CISO's own programme: engage internal audit function (third line) or external consultant

**Auditor qualifications**: Internal auditors for ISO 27001 should have:
- Knowledge of ISO 27001 requirements (ideally ISO 27001 LA certification)
- Understanding of audit principles and methodology (ISO 19011 is the audit guideline standard)
- Familiarity with the organisation and its ISMS (but not responsibility for what is being audited)

### Audit Plan

For each internal audit, produce an audit plan that includes:
- Audit dates, duration, and location
- Auditor names and roles
- Scope and criteria
- Audit methods to be used
- Areas to be audited and tentative schedule
- Documents and records to be reviewed
- Interviews to be conducted (names/roles, not necessarily specific names in advance)

The audit plan is shared with the auditee team in advance — auditors should not arrive with a hidden agenda. The auditee should know what will be tested, what evidence to have ready, and who will be interviewed.

---

## Step 2: Audit Evidence Collection

### Types of Audit Evidence

ISO 19011 defines audit evidence as records, statements of fact, or other information relevant to the audit criteria that is verifiable. Evidence must be:

**Sufficient**: Enough evidence to support the audit conclusion with confidence. One example is usually not enough; a sample is required.

**Appropriate**: Evidence that is relevant to the audit criteria being tested. A training record does not demonstrate that a control is implemented; it demonstrates that training was delivered.

**Reliable**: Evidence that can be verified and trusted. Self-reported data without corroborating documentation is less reliable than objective records.

### Document Review

The starting point for most internal audits. Review:
- ISMS core documentation (scope, policy, risk register, SoA, treatment plan)
- Supporting policies and procedures
- Records of process operation (access review logs, patch reports, backup logs, incident records)
- Training records and competence evidence
- Previous audit reports and corrective action status
- Management review minutes

**What to look for in document review:**
- Are documents current (reviewed within the defined interval)?
- Are documents version-controlled and approved by the right authority?
- Do documents align with each other (the SoA matches the risk register; the risk treatment plan matches the risk register residual scores)?
- Are records complete (training records show all staff; patch reports cover all in-scope systems)?

### Interviews

Interviews are the most powerful audit evidence method — and the one most commonly under-used by novice auditors.

**Interview objectives:**
- Understand how processes actually operate (not just how they are documented)
- Test staff awareness of their security responsibilities
- Identify gaps between documented process and actual practice
- Corroborate (or challenge) documentary evidence

**Effective interview technique:**
- Use open questions: "Walk me through what happens when a new employee joins. How is their access set up?" — not "Do you have an access provisioning process?"
- Follow up: "And who reviews that access after it is set up? How often? Show me the last review record."
- Be conversational: Interviews should feel like a professional discussion, not an interrogation. Staff will share more when they feel at ease.
- Don't lead: Don't telegraph the expected answer. "I assume you encrypt all laptops, right?" prompts agreement regardless of reality. "What security controls apply to laptops?" produces more genuine information.

**Interview subjects:**
- Senior management (CEO, CFO): leadership commitment and engagement
- CISO / ISMS Manager: ISMS management, risk posture knowledge, improvement activities
- IT operations staff: technical control operation (patching, access management, monitoring)
- Business unit managers (risk owners): risk awareness and treatment plan engagement
- HR Manager: employee lifecycle security (screening, onboarding, offboarding)
- Developer(s): secure coding practices, security testing in development
- Random staff sample: general security awareness

### Observation

The auditor observes processes operating in real time:
- Physical security: walking through the premises, testing access controls, observing clean desk compliance
- System demonstrations: watching the access provisioning process being executed, observing vulnerability scan operation
- Physical evidence: checking server room access controls, equipment disposal procedures

### Sampling

For populations of evidence (user accounts, changes, suppliers, incidents), the auditor selects a sample rather than reviewing everything. Sampling principles:

**Sample size**: For most internal audit purposes, a sample of 20–30 is statistically meaningful for populations of up to a few hundred. For larger populations (hundreds of users, thousands of changes), larger samples may be needed.

**Sample selection**: Random sampling is preferred — avoids cherry-picking easy examples. For risk-based auditing, bias the sample toward higher-risk items (privileged users, external-facing systems, critical suppliers).

**What to do with the sample**: For each sampled item, check whether the control operated correctly. Count exceptions. If exceptions exceed a threshold (e.g. >10% of sampled accounts have missing MFA), this is evidence of a systemic control failure — a nonconformity.

**Sample examples:**

| Control | Sample | Exception test |
|---|---|---|
| MFA for all users | 30 random user accounts | No MFA enrolled |
| Patching within 30 days | 20 critical CVEs from last 3 months | Not patched within 30 days |
| Supplier security clauses in contracts | 10 critical suppliers | No security clause in contract |
| Access review completion | Last 4 quarterly access reviews | Not completed within the scheduled quarter |
| New staff received security training | 15 staff who joined in the last 12 months | No training record |

---

## Step 3: Classifying Audit Findings

### Finding Categories

Internal audit findings are classified into four categories:

**Conformance**: The requirement is met with adequate evidence. No finding raised.

**Opportunity for Improvement (OFI)**: The requirement is met but something could be better. Not a nonconformity — does not require a formal corrective action. Documented as a recommendation.
- *Example*: "Security awareness training is conducted annually and completion records are maintained. An opportunity for improvement would be to implement post-training assessments to evaluate the effectiveness of training, rather than tracking completion alone."

**Minor Nonconformity**: An isolated, limited, or partial failure to fulfil a requirement. Does not fundamentally undermine the ISMS's ability to achieve its intended outcomes.
- *Example*: "The access review for the Finance system was not conducted in Q3 2025 as required by the access review procedure. All other quarterly access reviews were completed on schedule. Evidence: access review records for Q1, Q2, and Q4 provided; Q3 record not found."

**Major Nonconformity**: A systemic failure, complete absence of a required element, or multiple related minor NCs that together constitute a significant failure.
- *Example*: "No risk assessment has been conducted since the initial certification audit in 2023. The organisation underwent a significant cloud migration in Q2 2024 and hired 150 staff in 2024, neither of which triggered a risk assessment update as required by the organisation's own risk assessment methodology and ISO 27001 Clause 8.2."

### The NC Classification Test

When uncertain whether to classify a finding as major or minor, apply these tests:

**Systemic vs isolated**: Does this finding reflect a pattern across multiple instances (systemic → major) or is it a single instance (isolated → minor)?

**Absence vs deficiency**: Is the required element entirely absent (absence → major) or present but deficient (deficiency → minor)?

**ISMS impact**: Does this finding fundamentally undermine the ISMS's ability to achieve its intended outcomes (major) or is it a limited, manageable gap (minor)?

**Multiple related findings**: Several minor NCs in the same area that collectively indicate a systemic failure should be elevated to a major NC.

---

## Step 4: Writing the Audit Report

### Audit Report Structure

A professional internal audit report contains:

**1. Audit Details**
- Audit reference number and date
- Auditor(s) name(s) and qualification
- Audit scope and criteria
- Audit period (dates of fieldwork)
- Auditee (ISMS owner/CISO)

**2. Executive Summary** (1 page)
- Overall audit conclusion: does the ISMS conform to requirements and is it effectively implemented?
- Summary of findings: number of major NCs, minor NCs, OFIs
- Key strengths: areas where the ISMS is working well
- Areas for attention: highest-priority findings

**3. Detailed Findings** (main body)
For each finding, a structured entry:

```
FINDING REFERENCE: [INT-2026-007]
CLAUSE / CONTROL: [ISO 27001 Clause 8.2 / Annex A.8.8]
CATEGORY: [Minor Nonconformity]

STATEMENT OF FINDING:
The vulnerability management process requires critical CVEs (CVSS 9.0+) to be 
patched within 30 days of publication. Of 20 critical CVEs published between 
October 2025 and January 2026 sampled during this audit, 6 (30%) were not patched 
within 30 days. The longest outstanding patch was 67 days (CVE-2025-XXXXX on the 
customer-facing web server).

EVIDENCE REVIEWED:
- Vulnerability scan report dated 2026-01-15 (showing 6 outstanding critical CVEs 
  beyond 30-day threshold)
- Patch management procedure v2.1 (defining 30-day SLA for critical patches)
- IT Operations patch tracking spreadsheet (showing patch dates)

ROOT CAUSE (PRELIMINARY):
The current patch approval process requires CISO sign-off for production server 
patches, creating a bottleneck during CISO absence periods. This approval 
requirement is not reflected in the patch management procedure.

REQUIRED ACTION:
Corrective action required. Root cause analysis and corrective action plan due 
within 30 days.
```

**4. Positive Observations**
Good practice findings that the audit identified. These are important — audit reports that contain only negative findings do not give management a balanced picture and can discourage honest engagement with the audit process.

**5. Audit Conclusion**
An overall conclusion on ISMS conformance and effectiveness, including:
- Is the ISMS suitable for the organisation's purpose?
- Is it adequately designed to meet the requirements?
- Is it effectively implemented and maintained?
- What is the overall risk to the certification if findings are not addressed?

**6. Recommended Actions**
For each major and minor NC: recommended corrective actions (not prescriptive — the auditee decides how to address the finding; the auditor identifies what needs to be addressed).

**7. Distribution List and Approvals**
The audit report must be provided to relevant management (Clause 9.2). At minimum: CISO. For major NCs: executive team or audit committee.

### Audit Report Language

The audit report must be factual, specific, and evidence-based. Every finding must be:
- **Specific**: Not "controls are inadequate" but "6 of 20 sampled critical CVEs were not patched within the required 30-day window"
- **Evidence-based**: Reference the specific evidence that supports each finding
- **Objective**: Not "the security team is doing a poor job" but "the patching SLA was not met for 30% of sampled critical CVEs"
- **Actionable**: The auditee must be able to understand what needs to change

Avoid:
- Vague language: "could be improved," "appears to be," "may not be"
- Subjective judgments: "the team seems disorganised," "the documentation looks rushed"
- Technical jargon that non-technical management will not understand

---

## Step 5: Closing Meeting and Finding Communication

The internal audit closes with a brief closing meeting where the auditor presents findings to the auditee and management. The meeting:

- Summarises findings (major NCs, minor NCs, OFIs, positive observations)
- Confirms the auditee agrees with the factual basis of each finding (findings are based on evidence, not opinion)
- Discusses the process for corrective action
- Agrees the timeline for corrective action plan submission

If the auditee disputes a finding, the auditor should:
1. Listen to the challenge
2. Review whether additional evidence presented changes the finding
3. If the finding is factually correct and the evidence supports it, maintain the finding
4. If new evidence changes the assessment, revise the finding accordingly
5. Document any disagreements in the audit report

The auditor is not required to reach agreement with the auditee — they are required to report what the evidence shows.

---

## Step 6: Corrective Action Follow-Up

Internal audit findings feed directly into the Clause 10.1 corrective action process:

1. **Corrective action plan**: Auditee submits corrective action plan within agreed timeframe (typically 30 days for major NCs, 60 days for minor NCs)
2. **Corrective action implementation**: Actions implemented within agreed timeline
3. **Closure evidence submission**: Auditee submits evidence that corrective actions are complete and effective
4. **Auditor verification**: The auditor (or a designated reviewer) verifies that the evidence is adequate and the finding is closed
5. **Corrective action register update**: Finding status updated to "closed" with closure date and evidence reference

Follow-up audits may be required for major NCs or for persistent minor NCs — specifically targeted at verifying that the corrective action has been effective.

---

## The Details That Matter

### Internal Audit Frequency and Timing

ISO 27001 requires audits at "planned intervals" — the frequency is determined by the organisation. Best practice:

**Full ISMS audit**: Annually, timed to allow corrective actions to be addressed before the external audit. If the surveillance audit is in October, conduct the internal audit in June.

**Targeted audits**: Additional focused audits for high-risk areas (e.g. quarterly access review audits if access management has been a historical weakness).

**Triggered audits**: Conducted when a significant incident occurs, a major change is implemented, or a concern is identified. These are out-of-cycle but necessary.

### The Audit Programme as Evidence

The external auditor will review the internal audit programme and its outputs during Stage 1 and surveillance audits. They look for:

- Has the programme covered all ISMS requirements over the defined cycle?
- Are auditors demonstrably independent?
- Do findings reflect honest assessment (some findings expected — a consistently clean programme is suspicious)?
- Have findings been addressed through corrective action?
- Is the programme risk-based — with higher-risk areas audited more frequently?

A comprehensive, honest internal audit programme is one of the strongest signals that the ISMS is genuinely managed — not just documented.

### Audit Working Papers

Behind every finding in the audit report lies working papers — the detailed notes, samples, and evidence collected during fieldwork. Working papers must be:
- Retained as documented information (evidence that the audit was conducted)
- Referenced in the audit report (findings reference the evidence in the working papers)
- Protected (they may contain sensitive information about control gaps)

Working papers are not typically shared with external auditors, but their existence demonstrates that the audit conclusions are based on substantive evidence rather than impressions.

---

## Common Mistakes and Failures

**1. Auditor auditing their own work.**
The CISO conducting the internal audit of the ISMS they manage. Independence is compromised. External auditors will challenge this as a Clause 9.2 nonconformity if the independence issue is clear.

**2. Document-only audit.**
The internal auditor reviews policies and procedures without testing whether they are being followed. The audit concludes conformance because the documentation is complete, while operational reality is significantly different.

**3. No sampling — evidence from auditor's choice.**
The auditor reviews only the examples the auditee provides, without selecting their own sample. The auditee naturally provides the best examples. The audit misses the systemic failures visible in a random sample.

**4. Findings not evidenced.**
"Access reviews are not being conducted" — without referencing the evidence that demonstrates this (or the absence of evidence that should exist). Unevidenced findings are challenged by auditees and rejected as subjective.

**5. Clean internal audit report.**
An internal audit covering the full ISMS that finds no major NCs, two minor NCs, and three OFIs — every year, year after year. Either the ISMS is extraordinarily well-managed (possible but unusual) or the auditor is not looking hard enough. External auditors will be more, not less, skeptical when they see consistently clean internal audits.

**6. Findings documented but never closed.**
Internal audit findings sit in the corrective action register indefinitely. At the next internal audit, the same findings are raised again. Clause 10.1 requires that corrective actions are implemented and their effectiveness verified — not that they are documented and left open.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Internal audit is the primary domain of the Lead Auditor qualification. The exam tests: audit planning (how to design an audit programme), fieldwork (how to collect evidence), finding classification (major/minor/OFI), report writing (structure and language), and corrective action management.
- The Lead Auditor exam includes practical exercises — often case study scenarios where candidates classify findings, write finding statements, and determine audit conclusions.
- Key principles tested: auditor independence (ISO 19011), audit evidence criteria (sufficiency, appropriateness, reliability), finding classification logic (systemic vs isolated; absence vs deficiency).

**Exam scenario examples:**
- "The internal auditor finds that the CISO is the only person qualified to conduct internal audits. The CISO also manages the ISMS. Is this a nonconformity?" (Yes — independence requirement cannot be met; compensating measure required)
- "Of 15 sampled user accounts, 2 do not have MFA enabled. How should this be classified?" (Minor NC — isolated failure affecting 13% of the sample, not systemic)
- "The risk register has not been updated in 18 months, despite two significant changes to the IT environment. How should this be classified?" (Major NC — Clause 8.2 requires risk assessment when significant changes occur; this is a systemic failure)
- "Write a finding statement for the finding that the patch management SLA was exceeded for 4 of 20 sampled critical CVEs." (Must be specific, factual, evidenced — see the template in this note)

---

## GUARDIAN's Take

The internal audit is where the ISMS proves its maturity — or reveals its limitations. And the most consistent measure of internal audit quality is this: what does it find?

An ISMS that never produces significant internal audit findings is not a mature ISMS — it is an ISMS with an inadequate internal audit programme. Information security is an ongoing battle against a changing threat landscape, evolving technology, and human fallibility. Controls degrade. Processes drift. People forget. In that context, a fully conforming, fully effective ISMS is theoretically possible but practically vanishingly rare. A genuinely rigorous internal audit will almost always find something worth improving.

The organisations I trust most — the ones where I would confidently recommend to customers that they are well-managed — are the ones with honest internal audit programmes. Where the corrective action register is active and growing (because genuine problems are being found and addressed). Where the CISO can describe the most significant finding from the last internal audit without hesitation. Where management reviews discuss internal audit findings substantively.

The organisations I am most concerned about — regardless of certificate vintage — are the ones with clean internal audits and no corrective actions. They are not managing a genuinely low-risk ISMS. They are failing to look honestly at the one they have.

Conduct internal audits that look for the truth. Write findings that describe it accurately. Build a corrective action process that addresses it genuinely. That is the internal audit programme that makes the ISMS better — and that makes the organisation safer.

---
*Module: Module 3 — ISO 27001 | Guardian Curriculum*
