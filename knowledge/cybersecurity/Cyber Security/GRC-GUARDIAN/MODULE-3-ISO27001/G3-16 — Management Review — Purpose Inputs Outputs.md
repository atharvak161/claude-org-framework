---
tags: [guardian, grc, module-3, iso27001, management-review, clause-9, top-management, isms-improvement]
module: 3
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G3-04 — ISO 27001 Clause 5 — Leadership", "G3-08 — ISO 27001 Clause 9 — Performance Evaluation", "G3-09 — ISO 27001 Clause 10 — Improvement", "G3-14 — Internal Audit", "G3-15 — Nonconformities"]
---

# G3-16 — Management Review — Purpose, Inputs, Outputs

> [!abstract] What This Note Covers
> By the end of this note, you will understand what the management review is, why it is a governance requirement rather than a reporting exercise, exactly what inputs must be covered, what outputs are required, and how to conduct and document a management review that satisfies auditors and genuinely serves the ISMS.

---

## Why This Exists

Management review is the clause most frequently satisfied on paper and most frequently failed in substance. Every certified organisation produces management review minutes. Very few produce management reviews that genuinely serve the purpose the standard intends.

The purpose of management review is not to give the CISO an audience with the executive team. It is to give **top management** the opportunity to exercise **genuine oversight** of the ISMS — to understand the current risk posture, assess whether the ISMS is appropriate and effective, and make decisions that keep the ISMS aligned with business objectives and capable of managing the organisation's information security risks.

When it works, management review is the governance heartbeat of the ISMS. It is the meeting where the CEO asks why a Critical risk has been outstanding for six months without treatment. Where the CFO approves additional budget for a control the CISO has been requesting for a year. Where the board decides that the organisation's risk appetite for cloud adoption needs to be reassessed given a significant competitor breach.

When it fails — when it is 30 minutes, a prepared slide deck, one question from the CEO, and everyone signs the minutes — the ISMS loses its governance connection. The CISO makes decisions that should be made at board level. The board is not genuinely informed. The ISMS drifts.

This note teaches you what a genuine management review looks like, what it must produce, and how to make it work in practice.

---

## What Clause 9.3 Requires

The full text of Clause 9.3 establishes three things: the purpose, the required inputs, and the required outputs.

### Purpose

> *"Top management shall review the organisation's information security management system at planned intervals to ensure its continuing suitability, adequacy and effectiveness."*

Three dimensions of the ISMS are assessed:

**Suitability**: Is the ISMS appropriate for the organisation? Does it cover the right scope? Is it designed for the organisation's actual context, business model, and risk environment? As the organisation changes, does the ISMS change with it?

**Adequacy**: Is the ISMS complete? Does it address all relevant risks? Are the controls sufficient? Are the policies comprehensive? Is anything missing that should be there?

**Effectiveness**: Is the ISMS working? Are controls reducing risk as intended? Are objectives being achieved? Are incidents being managed effectively? Are improvements being made?

These three questions cannot be answered by the security team alone — they require the judgment of top management, who have visibility of the business objectives, strategic priorities, and resource allocation that determine whether the ISMS is fit for purpose.

### Required Inputs

Clause 9.3(a)–(f) lists the inputs that **must** be considered in every management review. These are not optional agenda items — they are mandatory:

**a) Status of actions from previous management reviews**
What was decided last time? What actions were agreed? Have they been completed? What is the current status of any outstanding actions?

This input creates accountability. If actions from the previous review are persistently outstanding, the management review is the forum to escalate and resolve.

**b) Changes in external and internal issues relevant to the ISMS (Clause 4.1)**
What has changed in the organisation's context since the last review?
- New regulatory obligations (DORA, NIS2 updates, new ICO guidance)
- Significant threat landscape changes (major breach in the sector, new attack techniques)
- Organisational changes (M&A, restructuring, new products, market entry/exit)
- Technology changes (cloud migration, new systems, end-of-life platforms)
- Changes in key personnel (new CISO, departure of key risk owners)

If significant changes have occurred and the management review does not discuss them, the review has failed its purpose.

**c) Feedback on information security performance, including trends in:**

*i) Nonconformities and corrective actions*: What nonconformities were identified (from internal audit, external audit, incidents)? What is the status of corrective actions? Are any persistently overdue?

*ii) Monitoring and measurement results*: Key security metrics — patch compliance, phishing click rates, incident counts, access review completion, training completion. Critically: **trends** not just snapshots. Is performance improving, stable, or deteriorating?

*iii) Audit results*: Summary of internal audit findings, including the most significant nonconformities and their corrective action status.

*iv) Fulfilment of information security objectives*: Progress against each objective defined in Clause 6.2. Which are on track? Which are behind? What needs to change?

**d) Feedback from interested parties**
What are customers, regulators, suppliers, and other stakeholders saying about security?
- Customer security questionnaire scores or feedback
- Regulatory communications (FCA supervisory review, ICO correspondence)
- Supplier security assessments and their outcomes
- Industry peer feedback or benchmarking data

**e) Results of risk assessment and status of risk treatment plan**
Current risk posture:
- How many Critical/High/Medium/Low risks?
- Are risks within appetite?
- Any new significant risks since the last review?
- Status of risk treatment plan — actions on track or overdue?
- Any risks requiring formal acceptance or escalation?

This is the most critical input for genuine governance. The board must understand the current risk posture — not just that risks are being managed, but whether the residual risk is within the stated appetite and whether the treatment programme is making progress.

**f) Opportunities for continual improvement**
What improvement opportunities have been identified? What should be prioritised? What resources are needed?

### Required Outputs

Clause 9.3 requires documented information (minutes) that record decisions relating to:

**Continual improvement opportunities**: Which improvement opportunities will be pursued? Who is responsible? By when? What resources are approved?

**Any need for changes to the ISMS**: Does the ISMS need to change — scope adjustments, policy updates, control additions, process improvements, risk appetite revisions, resource changes?

These outputs must be captured in the minutes as specific, actioned decisions — not as vague aspirations. "We will improve security awareness" is not a decision. "We will implement quarterly phishing simulations from Q3 2026, funded from the existing security budget, with results reported at each quarterly Security Committee meeting" is a decision.

---

## What Top Management Means

Clause 9.3 requires that **top management** conducts the review — not the CISO, not the Security Committee, not the IT Director.

Top management for ISO 27001 purposes is the person or group of people who directs and controls the organisation at the highest level. In most organisations this is:
- CEO or Managing Director
- Executive Committee / C-suite
- Board (in some governance structures)

The CISO is not top management in most organisations — they are a senior executive who manages the ISMS on behalf of top management. The CISO prepares and presents; top management reviews and decides.

**Practical minimum**: The review should be attended by the CISO and at least one of: CEO, CFO, COO, or equivalent. For larger organisations, the Security Committee (which includes C-suite representation) can conduct the management review, provided it is genuinely attended and engaged by appropriate seniority.

**What does NOT satisfy top management attendance:**
- The CISO conducting the review with their own team
- The IT Director (without C-suite involvement) reviewing the ISMS
- A prepared report distributed to the board without a discussion
- Board noting the report "for information" without active engagement

Auditors will check who attended management reviews. If the attendee list does not include individuals with top management authority, the review does not satisfy Clause 9.3.

---

## Management Review Frequency

Clause 9.3 requires review "at planned intervals" — the organisation defines the frequency. The frequency must be documented (in a management review procedure or the ISMS scope document).

**Minimum**: Annual. Most organisations conduct at least an annual comprehensive management review.

**Best practice**: Quarterly Security Committee meetings that collectively cover all required inputs (with clear documentation that each input has been addressed) plus an annual comprehensive review.

**Trigger-based**: Additional management reviews may be triggered by significant events (major incident, material regulatory change, significant breach in the sector) that require top management engagement outside the normal cycle.

**Audit check**: The auditor will verify that management reviews were conducted within the stated interval. If the organisation states "annual" and the last review was 14 months ago, this is a minor NC. If the last review was 3 years ago, this is a major NC.

---

## Structuring a Genuine Management Review

### The Agenda Structure

A management review agenda should cover all required inputs in a logical sequence:

```
MANAGEMENT REVIEW AGENDA
Meeting: ISMS Management Review
Date: [Date]
Attendees: CEO, CFO, CISO, Head of IT Operations, DPO

1. Welcome and apologies
2. Previous management review — action status [Input (a)]
3. Changes in context since last review [Input (b)]
   - External changes (regulatory, threat landscape)
   - Internal changes (organisational, technology)
4. ISMS performance [Input (c)]
   - Security metrics and trends
   - Audit findings and corrective action status
   - Progress against information security objectives
5. Interested party feedback [Input (d)]
   - Customer security assessments and feedback
   - Regulatory communications
   - Supplier security assessment outcomes
6. Risk posture update [Input (e)]
   - Current risk register summary
   - Risks exceeding appetite — escalation items
   - Risk treatment plan progress
7. Improvement opportunities [Input (f)]
   - CISO recommendations
   - Team suggestions
   - Industry benchmarking
8. Decisions required
   - Resource approvals
   - Risk appetite adjustments
   - ISMS changes
   - Improvement priorities
9. Action list confirmation and close
```

### Making the Review Genuine

**Prepare substantive materials**: Each agenda item should be supported by real data — not narratives, but metrics, trends, and specific findings. The risk posture section should include actual risk ratings and treatment plan completion percentages. The metrics section should show trend charts.

**Allow adequate time**: A management review covering all required inputs cannot be done in 30 minutes. For most organisations, 90 minutes to 2 hours is appropriate. For large or complex ISMSs, half a day may be warranted annually.

**Encourage challenge**: The CISO should present honestly, including bad news. Top management should feel free to question, challenge, and probe — not just receive. The management review is not a presentation to be endured; it is a governance discussion.

**Focus on decisions, not just updates**: Every management review should end with specific decisions and actions. If no decisions are made, the meeting has not fulfilled its purpose. Decisions might include:
- Approving additional budget for a security control
- Formally accepting a specific risk above normal tolerance
- Commissioning a penetration test
- Updating the risk appetite statement
- Revising the ISMS scope
- Approving a new policy

**Document specifically**: Minutes must record: who attended, what was discussed (not in exhaustive detail, but sufficient to demonstrate each input was covered), what decisions were made, and what actions were assigned (named owner, due date).

---

## The Management Review Record

Clause 9.3 requires retained documented information (minutes) as evidence. The minutes must demonstrate:

**Who attended**: Named individuals with titles. The auditor checks this list against the definition of "top management" for the organisation.

**Coverage of all required inputs**: The minutes must show that each of the six required inputs was discussed — even if briefly. An auditor reviewing minutes will check each input against the agenda and discussion notes.

**Decisions made**: Specific decisions, not aspirations. "The committee agreed to approve £45,000 for a SIEM upgrade to be completed by Q3 2026, assigned to CISO" — not "the committee recognised the importance of improving monitoring capability."

**Actions assigned**: Named individual, specific action, due date. Not "IT team" but "James Chen, Head of IT Operations."

**A note on minutes length**: Management review minutes do not need to be verbatim transcripts. They should be substantive enough to demonstrate genuine engagement — typically 3–8 pages for a well-run review. Single-page minutes that list agenda items as "discussed and noted" without recording discussion content or decisions are inadequate.

### A Sample Management Review Action Extract

```
ACTIONS FROM ISMS MANAGEMENT REVIEW — April 2026

1. ACTION: Implement immutable offsite backup solution
   OWNER: James Chen, Head of IT Infrastructure
   BACKGROUND: Risk register RISK-2024-017 (ransomware — ERP database) 
   residual risk currently High (score 15), exceeding appetite threshold. 
   Primary treatment action is immutable backup. Budget of £120,000/year 
   approved by CFO in this meeting.
   DUE: 30 September 2026
   REVIEW: Next management review (October 2026)

2. ACTION: Update risk appetite statement to reflect increased appetite 
   for digital innovation risks
   OWNER: CISO (Sarah Thompson) in consultation with CEO
   BACKGROUND: Board has agreed strategy to accelerate digital product 
   development. Current risk appetite (Low for technology adoption risks) 
   is impeding approved strategy. Board agreed Medium appetite for 
   technology adoption risks is appropriate, subject to enhanced monitoring.
   DUE: 30 May 2026
   REVIEW: Security Committee (June 2026)

3. ACTION: Commission external penetration test of customer portal
   OWNER: CISO (Sarah Thompson)
   BACKGROUND: Internal audit finding INT-2026-003 (minor NC) identified 
   that the customer portal has not been penetration tested since Q1 2024. 
   Annual external test required per vulnerability management procedure.
   BUDGET: Approved from existing security testing budget line
   DUE: 30 June 2026
   REVIEW: Results to Security Committee (July 2026)
```

---

## The Details That Matter

### Management Review vs Security Committee

Many organisations have a quarterly Security Committee — does this satisfy management review?

**It can, if:**
- The Security Committee includes top management attendance (CEO or equivalent, not just CISO and IT Director)
- Meeting records demonstrate that all required inputs were covered across the quarterly cycle
- Decisions and actions are formally recorded
- The committee explicitly reviews the ISMS (not just general security topics)

**It cannot, if:**
- The Security Committee is attended only by the CISO and IT Director (insufficient seniority)
- The quarterly meetings cover some but not all required inputs, with no annual comprehensive review
- The meeting records do not demonstrate coverage of all required inputs

Best practice: Quarterly Security Committee meetings as the operational governance mechanism, with an annual comprehensive management review attended by top management that explicitly covers all required inputs and produces formal decisions.

### What Changes Between Reviews

Management review should always begin by noting what has changed since the last review — in context (Clause 4.1 inputs), in performance, and in risk posture. If the review shows no changes, no new findings, no new risks, and no new decisions — the review has not done its job. Organisations and their risk environments are never static.

### Management Review and Surveillance Audits

At every surveillance audit, the external auditor will review management review records. They will:
- Verify that reviews were conducted within the stated interval
- Check that all required inputs were covered
- Verify that decisions and actions were made and (if prior review actions are due) that they were completed
- Look for evidence that management review actually influenced the ISMS (were improvement decisions implemented? were approved resources applied?)

A management review that consistently produces no actions and no decisions is a red flag. Auditors will probe whether the review is genuine or performative.

---

## Common Mistakes and Failures

**1. Management review conducted without top management.**
The CISO holds a management review meeting with the security team. Minutes are produced. Auditor interviews the CEO: "Can you tell me what was discussed at the last management review?" The CEO has no idea. This is not a management review — it is a security team meeting with misleading documentation.

**2. All required inputs are listed but none are substantively discussed.**
The minutes show agenda items for each required input, with "discussed and noted" as the entry for each. No data, no trends, no decisions. The review satisfies the letter of Clause 9.3 but not its purpose.

**3. No decisions or actions produced.**
A 90-minute meeting with substantive discussion, all required inputs covered — but the minutes record no decisions and no actions. "Management noted the risk posture and expressed satisfaction with ISMS performance." What changed? What improved? Nothing. The review was passive, not active governance.

**4. Management review held only when the external audit is approaching.**
The organisation conducts management review every 14 months — in the weeks before the surveillance audit. The review is conducted specifically to satisfy the auditor, not to provide ongoing governance. A review that only happens when an audit is imminent is compliance theatre.

**5. Actions from previous review never closed.**
The management review minutes from October 2025 list 6 actions. The management review in April 2026 opens with "status of actions from previous review" — and all 6 are still outstanding, now 6 months overdue. This indicates the management review process has no accountability mechanism and produces actions that are aspirational, not committed.

**6. Risk posture not genuinely communicated.**
The CISO presents a risk posture summary that sanitises the picture — showing only that risks are "being managed" without presenting specific Critical/High risks, treatment plan status, or risks exceeding appetite. Management leaves the review believing the risk posture is satisfactory when it is not. This is a governance failure — and a personal risk for the CISO if an incident occurs that was obscured from the board.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Management review is examined through documentation review (Stage 1 — are records adequate?) and through management interviews (Stage 2 — did top management genuinely engage?).
- Key audit questions:
  - "Show me the management review minutes from the last review. Walk me through the risk posture update section."
  - "What were the decisions made at the last management review? What actions resulted?"
  - "Who attended the management review? [Check list against definition of top management]"
  - "Were all required inputs covered? Show me where each input appears in the minutes."
- Classification of management review failures:
  - Review conducted but not by top management → minor or major NC depending on degree (CISO-only = major NC; IT Director-only without C-suite = likely major NC)
  - Review conducted but missing required inputs → minor NC per missing input; major NC if multiple systemic omissions
  - Review not conducted within the defined interval → minor NC (small overrun); major NC (significantly overdue or never conducted)
  - No decisions or actions produced → observation or minor NC depending on pattern

**CISM:** Domain 1 (Governance) — management review is the governance mechanism by which top management exercises oversight; CISM candidates must understand how to design and conduct a management review that satisfies both the standard and genuine governance needs

**CRISC:** Domain 4 (Monitoring) — management review is the senior governance layer that receives risk monitoring information and makes decisions based on it

---

## GUARDIAN's Take

Management review is the test of whether information security is genuinely on the board's agenda — or whether it is something that happens "down in IT" and is managed by the CISO without real executive involvement.

In every management review I have conducted or observed, the quality of the meeting is determined almost entirely by one factor: how much the senior leaders in the room actually care about the risk posture, and how honestly they are being informed about it.

When the CEO opens by asking "what is our biggest information security exposure right now?" — that is a management review working as it should. When the CEO asks "are we compliant?" and the CISO says "yes, everything is under control" and the meeting moves on — that is a management review that is protecting nobody.

The CISO's job in the management review is not to reassure management. It is to inform them accurately and give them what they need to make good decisions. That means presenting the uncomfortable metrics alongside the positive ones. It means escalating risks that exceed appetite even when the treatment plan is expensive. It means saying "this risk is higher than we reported last year because our control has not been as effective as we thought" — not papering over the gap.

And the board's job is to engage. To ask the hard questions. To approve the investment when it is warranted. To formally accept risks when the cost of treatment is genuinely disproportionate. To hold the CISO accountable for delivery.

When both sides of that relationship function properly, the management review becomes the most valuable meeting in the ISMS calendar. It is the place where security stops being the CISO's problem and becomes the organisation's commitment.

Build the meeting that makes that happen. Everything else in the ISMS depends on it.

---
*Module: Module 3 — ISO 27001 | Guardian Curriculum*
