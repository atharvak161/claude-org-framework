---
tags: [guardian, grc, module-10, audit-report, report-writing, findings-summary, executive-summary]
module: 10
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-25
guardian-refs: ["G10-04 — Conducting the Audit", "G10-05 — Audit Findings", "G10-07 — Corrective Action and Follow-Up", "G3-14 — Internal Audit"]
---

# G10-06 — Audit Report Writing

> [!abstract] What This Note Covers
> By the end of this note, you will understand how to structure and write a professional audit report — from executive summary through detailed findings — that is accurate, readable, appropriately pitched for its audience, and actionable for management.

---

## Why This Exists

The audit report is the primary deliverable of the audit engagement. Everything that happened during planning, fieldwork, and evidence collection exists to produce this document. A report that is poorly structured, too long, poorly written, or pitched at the wrong audience fails to deliver the value of the audit work it contains.

Most audit reports in practice fall into one of two failure modes: too long and too technical (impenetrable to management; buried findings; no clear priorities) or too short and too vague (no specific evidence; no actionable findings; no management value). Professional audit report writing occupies the space between — specific and evidenced, but readable; comprehensive, but prioritised.

---

## The Audit Report's Audience and Purpose

Before writing a word, understand who will read the report and what they need from it.

**Primary audience — the auditee's management:**
They need to know: What did the audit find? How serious is it? What must be done, by whom, and by when? What is the overall ISMS health? What should the board know?

**Secondary audience — the audit committee / board:**
They need to know: What is the overall compliance and security posture? Are there critical risks requiring board attention? Is management responding effectively to findings?

**Tertiary audience — future auditors and regulators:**
They need to see: A professional, evidence-based record of the audit. Evidence that findings were identified and managed. Traceability between evidence and conclusions.

**The report must serve all three audiences**, which requires a layered structure: an executive summary that answers the management questions; a detailed findings section that provides the technical specifics; and documented evidence references that satisfy the professional record requirements.

---

## The Audit Report Structure

### Section 1: Report Header and Distribution

**Contents:**
- Report title and reference number
- Audit type (ISO 27001 internal audit; PCI DSS compliance audit; etc.)
- Audit scope
- Audit period (dates of fieldwork)
- Report date
- Prepared by (lead auditor name, role, qualifications)
- Reviewed by (audit manager or CISO)
- Distribution list (who receives this report; confidentiality classification)
- Version (v1.0 Draft; v1.1 Final following closing meeting; etc.)

**Confidentiality**: Most audit reports are classified as Confidential or Restricted — they contain specific vulnerability details and compliance gaps that could be exploited if disclosed. The distribution list must be limited and the document classified appropriately.

---

### Section 2: Executive Summary

The executive summary is read by management and board members who may not read the full report. It must be:
- **Self-contained**: A reader who reads only the executive summary has the key information
- **Brief**: 1–2 pages maximum
- **Non-technical**: Written in business language, not security jargon
- **Prioritised**: The most important findings and risks are prominent, not buried

**Executive summary components:**

**Overall audit conclusion** (1 paragraph):
A clear, direct statement of the overall compliance and effectiveness assessment.

*Examples:*
"The ISMS demonstrates broad conformance with ISO 27001:2022 requirements. The risk assessment and treatment programme is fundamentally sound. However, two areas require management attention: the risk register has not been updated following three significant environmental changes, creating gaps in the organisation's risk coverage; and access review completion is inconsistent, with two systems not reviewed for over 6 months."

"The access management controls were found to be substantially effective and well-documented. One minor nonconformity was identified; the access review process for two specific systems has fallen behind the required quarterly cadence."

**Finding summary** (table):
A clear table showing all findings at a glance:

| Finding ID | Area | Classification | Priority |
|---|---|---|---|
| INT-2026-001 | Risk assessment — no update post-infrastructure changes | Major NC | Critical |
| INT-2026-003 | Access review — two systems overdue | Minor NC | High |
| INT-2026-005 | Security awareness — outdated training content | Observation | Medium |
| INT-2026-007 | Supplier security — missing DPA with cloud analytics provider | Minor NC | High |
| INT-2026-008 | Supplier security management programme | Positive Finding | — |

**Key risks requiring management attention** (bullet points):
The 2–3 most important findings that require management decision or resource:
- "The unreviewed risk register creates risk of managing assets and controls against a threat model that no longer reflects the environment. Management should prioritise the risk assessment update as an immediate corrective action."
- "The missing DPA with [provider] creates regulatory exposure under UK GDPR Article 28. This should be treated as a legal risk requiring urgent resolution."

**Positive observations** (brief):
What is working well — 2–3 sentences on genuine strengths.

---

### Section 3: Audit Background and Methodology

**Purpose, scope, and criteria** (as defined in the audit plan):
- What was audited
- Against what criteria
- During what period

**Audit methods used:**
- Document review
- Interviews (list of interviewees by role, not name unless the auditee's policy requires named references)
- Technical testing (description of systems accessed and methods used)
- Sampling (populations and sample sizes)

**Audit limitations:**
Any factors that limited the scope or depth of the audit:
- "The disaster recovery test records for Q3 2025 were not available at the time of audit — the IT Operations Manager indicated these are stored on a server being migrated. This area was therefore excluded from the DR controls review."
- "Remote audit methodology was used for this engagement; physical security controls were assessed through screen sharing and documented evidence rather than on-site inspection."

**Standard disclaimer** (for internal audits):
"This report reflects the state of controls at the time of the audit and within the scope defined above. It does not represent a comprehensive assessment of all information security risks or controls, and should not be relied upon as such."

---

### Section 4: Detailed Findings

This is the substantive body of the report. Each finding is presented in the standard finding statement format (from G10-05), with:
- Finding reference
- Classification
- Criterion
- Statement (specific, factual, evidence-referenced)
- Evidence list
- Classification rationale

Findings are typically ordered by priority: Major NCs first; then Minor NCs; then Observations; then Positive Findings.

**Each finding section should be self-contained**: A reader who goes directly to a finding they care about should not have to read other sections to understand it.

---

### Section 5: Summary of Corrective Actions Required

For each nonconformity (major and minor), the report should include a corrective action tracking table — not the full corrective action plan (the auditee produces that) but a structured summary of what is required:

| Finding ID | Finding summary | Required corrective action | Owner | Due date | Priority |
|---|---|---|---|---|---|
| INT-2026-001 | Risk register not updated | Update risk register for all 3 environmental changes; review SoA for affected controls | CISO | 30 days | Critical |
| INT-2026-003 | Access reviews overdue (2 systems) | Complete overdue reviews; add systems to quarterly review schedule | IT Operations Manager | 14 days | High |
| INT-2026-007 | Missing DPA with analytics provider | Execute DPA or identify alternative compliant processing arrangement | DPO | 30 days | High |

**Note**: The due dates and owners in the summary table are the auditor's recommendations — the auditee confirms them in the corrective action plan. The report sets the expectation; the corrective action plan sets the commitment.

---

### Section 6: Positive Findings

A dedicated section summarising what is working well — specific, evidenced, acknowledging genuine strengths. This section:
- Recognises effective controls
- Provides reference points for management ("what good looks like in our organisation")
- Balances the report's overall picture
- Maintains the audit's credibility (a report with only findings, no acknowledgement of what works, is not fair representation)

---

### Section 7: Recommendations for Programme Improvement

Beyond the specific corrective actions, recommendations for the broader GRC programme:
- Audit programme recommendations ("consider adding a focused cloud security audit to address the gaps identified in this assessment")
- Policy and standards recommendations ("the access control policy should be updated to specifically address cloud service access reviews, which are not currently covered")
- Training and awareness recommendations
- Risk management process recommendations

---

### Section 8: Appendices

- **Appendix A: Evidence register** — a list of all documents reviewed, system queries run, and interviews conducted
- **Appendix B: Corrective action register** — the formal tracking register for findings (may be maintained separately)
- **Appendix C: Audit team qualifications** (for external reports)
- **Appendix D: Standards and criteria reference** — the specific standard text for each criterion referenced

---

## Writing Style Guidance

### Pitch for the Primary Reader

If the primary audience is management (not security professionals):
- Explain technical terms in parentheses or footnotes
- Focus on business impact, not technical detail
- Use the executive summary to lead with significance; technical detail follows in the main body

If the primary audience is security/IT professionals:
- Technical terminology is appropriate
- Less need to explain concepts
- Focus on specific technical evidence and implications

**For most internal audit reports**: Write at a management level in the executive summary; technical detail is acceptable in the detailed findings section.

### Language Discipline

**Active voice**: "MFA is not enforced for CDE access" not "Multi-factor authentication has not been implemented across the cardholder data environment in a manner consistent with the requirements."

**Specific numbers**: "2 of 312 accounts" not "some accounts" or "a small percentage."

**Present tense for findings**: "The access review for the project management platform has not been completed within the required quarterly interval." Not "was not completed" (which implies it has since been fixed).

**No editorial opinion**: "The IT team has neglected access reviews" → remove. "Access reviews for the project management platform have not been conducted since July 2025" → keep.

**No hedging**: "It appears that MFA may not have been enrolled" → replace with the factual finding or investigate further to confirm.

### Length

**Executive summary**: 1–2 pages

**Per finding**: 0.5–1.5 pages (depending on complexity)

**Full report**: For a focused 2-day audit of a single process area: 8–15 pages. For a full-scope ISMS audit: 20–40 pages.

**The length principle**: The report should be as long as needed to accurately document findings and as short as possible to remain readable. Every paragraph that doesn't add information the reader needs should be removed.

---

## Timing and Delivery

**Draft report**: Issued within 5–10 business days of the closing meeting. Contains all findings; may note that specific facts are "subject to confirmation." Provides the auditee an opportunity to flag any factual errors before final issue.

**Auditee response period**: Typically 5–10 business days to review the draft and flag any factual concerns. This is not a negotiation period for finding classification — it is a fact-checking period.

**Final report**: Issued within 5 business days of receiving auditee factual responses. Updated to reflect any confirmed factual corrections; finding classifications maintained unless supported by new evidence.

**Report retention**: Audit reports must be retained for an appropriate period — typically for the duration of the ISMS certification cycle plus the retention period required by the organisation's records retention schedule (commonly 3–7 years). Working papers are retained for the same period.

---

## The Corrective Action Plan

The corrective action plan (CAP) is not part of the audit report — it is produced by the auditee in response to the audit report. However, the audit report sets the expectations that the CAP must meet.

For each major or minor nonconformity, the CAP should contain:
- The finding reference from the audit report
- Root cause analysis (why did this gap occur?)
- Proposed corrective action (what will be done to address the root cause?)
- Implementation timeline (specific milestones and due dates)
- Evidence of closure (what will the auditee submit to demonstrate the finding has been resolved?)
- Owner (named individual responsible for the corrective action)

**Auditor review of the CAP**: After the CAP is submitted, the auditor reviews it for:
- Does the root cause analysis identify the actual root cause (not just the symptom)?
- Are the proposed corrective actions sufficient to address the root cause?
- Is the timeline realistic?
- Is the closure evidence appropriate?

For major NCs (particularly in external certification audits), the CB reviews and approves the CAP before issuing the certificate or lifting suspension.

---

## Common Mistakes and Failures

**1. Executive summary that requires reading the full report to understand.**
The executive summary lists finding IDs without explaining what they mean. A manager reading only the executive summary cannot assess whether management attention is required or at what urgency.

**2. Report issued weeks after the closing meeting.**
By the time the report arrives, the initial urgency has dissipated. Corrective action owners have moved on to other priorities. The value of the audit's momentum is lost. Issue draft reports promptly.

**3. Findings that include corrective actions.**
"The access review for the project management platform has not been completed. The IT team must immediately review all accounts." → The finding describes the gap; the corrective action is not the auditor's to prescribe. Remove the instruction from the finding; include it (as a recommendation) in the corrective actions section.

**4. No executive summary — just findings.**
Management cannot quickly assess the overall compliance picture. Every audit report requires an executive summary that provides the overall assessment and highlights the most significant findings.

**5. Findings buried in a long narrative.**
A 40-page report where the four findings are scattered throughout paragraphs of background and context. Findings must be clearly labelled and visually distinct — a reader should be able to scan the report and immediately identify every finding.

**6. Different language standards in different sections.**
The executive summary uses "the organisation is largely compliant" — which contradicts the detailed findings section listing two major NCs. Consistency in language and assessment across the report is critical.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Report writing is examined in the Lead Auditor qualification — both the structure and content of effective audit reports. Candidates must understand what belongs in an executive summary, what belongs in the detailed findings section, and how to write findings that are specific, factual, and classified correctly.

**CISM:**
- Domain 3 (Security Programme) — the audit report is the primary output of the internal audit programme. CISMs must understand what a good audit report looks like and how to use it effectively in management reporting.

**CISSP:**
- Domain 6 (Security Assessment and Testing) — reporting of assessment results is a testable competency. Know the components of an effective security assessment report.

---

## GUARDIAN's Take

The audit report is the auditor's professional signature. Everything the auditor did over the course of the engagement — the planning rigour, the evidence quality, the independence of conclusions — is visible (or not) in the report.

A report that is vague is not a professional product. A report that is accurate but incomprehensible to its audience is not useful. A report that is readable but unsupported by documented evidence is not defensible.

The standard I hold audit reports to: the executive summary should give a management reader a clear understanding of the overall compliance picture in 5 minutes. The detailed findings should give a technical reader everything they need to understand the specific gap, its evidence basis, and what must change. The corrective action summary should give the people who must act a clear assignment — what, who, when.

If the report satisfies those three tests, it has done its job. The audit work is complete when the report is delivered and the corrective actions begin. Everything before — the planning, the fieldwork, the closing meeting — was preparation for this moment.

Write it well. It is your professional record.

---
*Module: Module 10 — Audit and Assurance | Guardian Curriculum*
