---
tags: [guardian, grc, module-10, audit-fieldwork, closing-meeting, audit-conduct, findings-presentation]
module: 10
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-25
guardian-refs: ["G10-01 — What is an Audit", "G10-02 — Audit Planning", "G10-03 — Audit Evidence", "G10-05 — Audit Findings", "G3-13 — The Certification Journey", "G3-15 — Nonconformities"]
---

# G10-04 — Conducting the Audit — Fieldwork to Closing Meeting

> [!abstract] What This Note Covers
> By the end of this note, you will understand how to conduct professional audit fieldwork — managing the audit's execution from the opening meeting through evidence collection, finding identification, and the closing meeting where findings are presented and discussed.

---

## Why This Exists

Planning creates the conditions for a good audit. Execution determines whether those conditions are realised. The most carefully planned audit can still produce poor results if fieldwork is poorly managed — if the auditor cannot control time effectively, cannot navigate the auditee's environment productively, cannot escalate concerns appropriately, and cannot communicate findings clearly in the closing meeting.

This note covers the practitioner skills that determine audit quality during fieldwork: managing the audit day, conducting effective system reviews and interviews, handling the unexpected, assembling findings from evidence, and communicating them professionally at the closing meeting.

---

## The Audit Day: Time Management and Focus

An audit day is a constrained resource. A typical two-day ISO 27001 internal audit of a process area has roughly 10–12 hours of productive working time. Allocated across: opening meeting (1 hour), document review (2–3 hours), system demonstrations (1–2 hours), interviews (2–3 hours), working paper completion (1–2 hours), finding consolidation (1 hour), closing meeting preparation (30 minutes), closing meeting (1 hour). Every hour wasted on waiting for access or evidence, repeating questions that were already answered, or reviewing low-risk documentation is an hour not spent on higher-value investigation.

**Time management disciplines:**

**Pre-position evidence requests**: Before the audit day, send the auditee a pre-audit evidence request list — the documents and records to have ready. A well-prepared auditee saves 2–4 hours of document hunting during fieldwork.

**Triage during document review**: Quickly assess each document's relevance and depth of review needed. A policy document that was clearly reviewed and updated recently needs less scrutiny than one with an overdue review date and inconsistencies with current practice. Allocate review depth proportionate to risk signals.

**Cut off unproductive lines**: If a particular line of investigation is not yielding useful evidence after reasonable effort, note it and move on. Return if there are remaining hours. An auditor who spends 3 hours investigating a minor issue while a critical area goes unexamined has misjudged priorities.

**Track the agenda**: The audit plan has a schedule. Deviations are inevitable but should be intentional — if extra time is being spent on a high-risk area because preliminary evidence suggests problems, that is a justified deviation. If time is being lost to logistics, reschedule lower-priority activities.

---

## Managing System Access During Fieldwork

For many security audits, direct system access is essential — reviewing configurations in situ, running queries against identity providers, checking log retention in the SIEM.

**Read-only access**: For most technical testing, read-only access to the relevant systems is sufficient and appropriate. The auditor should not need write access. Read-only access must be provided in advance — arriving at the audit with no system access is a common logistical failure.

**Auditor-generated vs auditee-provided evidence**: Where possible, the auditor should generate their own evidence (run their own query against the identity provider; navigate to the configuration themselves; export the log sample). Auditee-provided reports and screenshots are less reliable — they may be selectively prepared or may not accurately reflect the system's current state.

**Screen sharing for remote audits**: For remote audits (now common), the auditee shares their screen while the auditor directs the navigation. The auditor should direct the auditee to navigate to specific areas — not accept screenshots prepared before the session. Real-time screen sharing provides evidence closer to the "auditor-observed" reliability tier than screenshots sent separately.

**Documentation of technical evidence**: Screenshots must include: the date and time the screenshot was taken (system clock visible); the system URL or hostname; the user context (who is logged in). Screenshots without context are less reliable evidence.

---

## Handling the Unexpected During Fieldwork

Audits rarely go exactly as planned. Common unexpected situations and how to handle them:

### Finding a Significant Issue Not in the Planned Scope

During a review of patch compliance records, the auditor discovers that the backup verification procedure has not been executed for 6 months. Backup verification is not in the audit scope — but the finding is significant.

**Handling approach:**
1. Document the finding in working papers with the evidence observed
2. Note that it falls outside the current audit scope
3. Report it to the audit manager or CISO as an out-of-scope finding
4. Include in the audit report as an "observation" or "area requiring management attention" — not as a formal nonconformity (since it was not part of the criteria), but flagged for follow-up
5. Consider recommending a targeted audit of backup management in the next audit programme cycle

**Never ignore significant findings because they are out of scope.** The professional obligation is to report what is found — scope limitations affect formal classification, not the obligation to disclose.

### The Auditee Cannot Provide Evidence

"I'm sorry, the person who handles access reviews is on leave and I can't access that system."

**Handling approach:**
1. Document the request and the response in working papers
2. Assess whether the missing evidence is material to the audit objectives
3. Agree an alternative — can a colleague provide access? Can evidence be emailed after the audit?
4. Set a clear deadline for providing the evidence
5. If evidence is not provided by the deadline: note in the working papers and audit report that evidence was requested and not provided. This is not automatically a finding, but depending on the control being assessed, it may be — if the evidence should exist and the auditee cannot produce it, this is a potential sign that the control is not operating.

**The absence of evidence is evidence of absence** (in some circumstances). If MFA is claimed to be enabled for all accounts and the auditee cannot produce the MFA status report, the absence of evidence for a claim they made is significant.

### The Auditee Challenges a Preliminary Finding

During fieldwork, the lead auditor mentions a potential finding. The auditee immediately challenges it, saying the auditor has misunderstood the process.

**Handling approach:**
1. Listen to the challenge without defensiveness
2. Ask the auditee to explain or demonstrate what the auditor may have misunderstood
3. If the auditee provides clarifying evidence that changes the assessment: acknowledge it, update working papers, revise the preliminary finding
4. If the challenge does not change the evidence base: note the challenge in working papers but maintain the finding
5. Do not pre-empt the formal process: preliminary findings are not binding; the closing meeting is the appropriate forum for formal discussion

**The professional obligation**: An auditor is obligated to find and report accurately. Maintaining a finding when presented with new evidence is wrong; maintaining a finding despite the auditee's discomfort (without new evidence) is right.

### Finding Evidence of a Serious Issue

During a review of privilege escalation logs, the auditor finds evidence that an account with standard user privileges has been repeatedly attempting to access files outside its authorised scope — a pattern consistent with an insider threat or compromised credential.

**Handling approach:**
1. Document the specific evidence carefully — exactly what was found, the system and time range
2. Do not immediately confront the auditee or share specifics of what was found
3. Escalate immediately to the CISO or audit sponsor (privately, outside the normal audit reporting channel)
4. Continue the audit but do not alert anyone who may be involved
5. The CISO / audit sponsor decides how to handle the potential security issue — the audit finding feeds into the security incident process, not just the audit report

**Serious findings during an audit create tension between audit transparency and security investigation confidentiality.** Auditors must recognise when a finding has crossed from "control gap" to "active security incident" and escalate appropriately.

---

## Finding Assembly: From Evidence to Conclusion

As fieldwork progresses, the auditor assembles evidence from multiple sources into coherent finding conclusions. This assembly process is the core intellectual work of the audit.

**The finding assembly process:**

**Step 1: Identify the gap**. What specific criterion is not being met? The gap must be expressed as a deviation from a stated requirement: "The MFA Standard requires MFA enrollment within 48 hours of account creation. Two accounts were found without MFA enrolled at days 15 and 23 respectively."

**Step 2: Gather corroborating evidence**. Can the gap be confirmed from multiple sources? One data source may be wrong; two independent sources pointing to the same gap provide stronger evidence. The MFA enrollment report (documentary) plus the interview response acknowledging a procedural gap (oral) plus a system demonstration showing the account without MFA (auditor-observed) are three independent sources of the same finding.

**Step 3: Assess scope — isolated vs systemic**. Is this a single instance or a pattern? One account without MFA in 300 is isolated (2 of 312 = 0.6%). Fifteen accounts without MFA in 300 is systemic (5%). The classification (major vs minor) depends on whether the failure is isolated or systemic.

**Step 4: Identify root cause (preliminary)**. Why did this happen? The provisioning procedure has no verification step for MFA enrollment. This is the preliminary root cause — the formal root cause analysis is the auditee's responsibility in the corrective action process, but auditors identify the likely cause to make the finding actionable.

**Step 5: Draft the finding statement**. Specific, factual, evidence-referenced. (See G10-05 for detailed finding statement guidance.)

---

## Closing Meeting: Structure and Conduct

The closing meeting is the formal conclusion of fieldwork — the forum where the auditor presents findings to the auditee and confirms the next steps.

### Purpose of the Closing Meeting

- Present findings (nonconformities, observations, positive findings) formally
- Confirm the factual accuracy of findings with the auditee (not seek agreement that they are findings — just that the facts are accurately stated)
- Clarify the classification (major NC, minor NC, observation) and its implications
- Confirm next steps (corrective action timelines, reporting schedule)
- Maintain the professional relationship for the corrective action phase

### Closing Meeting Preparation

Before the closing meeting, the auditor must:
- Complete working papers and confirm all findings are documented with evidence
- Finalise finding classifications (major/minor/observation)
- Prepare a brief presentation or summary of findings
- Ensure all findings are expressed factually, without editorial commentary
- Confirm the report delivery timeline

### Closing Meeting Structure

**1. Opening summary** (5 minutes):
Restate the audit objectives, scope, and criteria. Acknowledge the auditee's cooperation and access. Set the tone: "The purpose of this meeting is to present the findings from the audit. I will describe each finding, explain its basis, and discuss the classification. I want to confirm that the factual basis of each finding is accurate — but I'm not looking for agreement that they are findings."

**2. Positive findings** (5–10 minutes):
Begin with what is working well. Auditors who only report failures produce defensiveness and disengagement. Positive findings — controls that are genuinely well-implemented, processes that exceed requirements — are as valid and important as negative ones. "The access review process for the finance system was found to be comprehensively documented, consistently executed on schedule across all four quarters reviewed, and effectively followed up — with evidence of access modifications made within 48 hours of review conclusions."

**3. Findings presentation** (majority of time):
For each finding, present:
- The criterion it relates to (specific clause, standard, control)
- The evidence that demonstrates the gap
- The classification (major NC / minor NC / observation)
- The reason for the classification

Present findings factually. No emotional language. No judgments about the auditee's competence or effort. The finding is a deviation from a criterion evidenced by specific data — nothing more.

**4. Auditee response** (after each finding or at the end):
Allow the auditee to respond. Two types of legitimate response:
- **New evidence that changes the finding**: "Actually, those two accounts were service accounts under a different identity governance policy. Here is the documentation." → If the evidence is sufficient, the finding is withdrawn or revised.
- **Factual correction**: "The number is 2 of 310 active accounts, not 2 of 312 — the other 2 are service accounts excluded from MFA requirements." → Correct the finding if the fact is wrong; the classification may or may not change.

What is NOT a legitimate basis for withdrawing a finding:
- The auditee disagrees that the requirement is reasonable
- The auditee says they intend to fix it
- The auditee is upset about the finding

**5. Classifications confirmed**:
Confirm the final classification of each finding after any revisions based on new evidence.

**6. Next steps** (10 minutes):
- When will the audit report be issued? (Typically 5–10 business days after the closing meeting)
- What is the corrective action process? (For internal audits: corrective action plan required within [X] days; for external audits: CB process as agreed)
- Who receives the report?
- What is the follow-up process for corrective actions?

**7. Close**:
Thank the auditee and participants. Confirm the report timeline. Close professionally.

---

## Handling Disagreement at the Closing Meeting

The closing meeting is occasionally contentious — particularly when significant findings are raised. Professional handling of disagreement is a key auditor skill.

**When the auditee disagrees with a finding:**

"We think you've misunderstood our process. We do conduct access reviews — just not in the way you were looking for them."

Response: "I'd welcome the opportunity to understand that. Can you walk me through how they are conducted and share the relevant documentation? If there is evidence I haven't seen that changes the picture, I'll revise the finding."

If evidence is provided and it does change the picture: revise. If the auditee describes a process that does not match the criteria (e.g. "we do it informally, not in a formal review") and the criteria require formal review: maintain the finding, acknowledge the disagreement, note it in the report.

**When the auditee disputes the classification:**

"We don't think this is a major nonconformity — it's only two accounts."

Response: "I understand your view. The classification is based on [specific criteria: systemic failure indicator / absence of required element]. Two accounts may seem isolated in volume, but the underlying cause — an unresolved procedural gap — indicates a systemic issue rather than an isolated exception. For this reason, the classification remains major. You're welcome to note your disagreement in the corrective action plan, and I'll note that disagreement in the report."

**The auditor's final authority on findings**: In an internal audit, the auditee's management may have authority over the auditor in the organisational structure — but not over audit findings. An auditor who changes a finding because of organisational pressure (not new evidence) has violated the independence principle.

**Documenting disputes**: Any significant disagreements about findings must be noted in the audit report: "The finding was disputed by the auditee's management on the basis that [X]. After consideration, the finding was maintained because [Y]."

---

## Post-Fieldwork: Completing the Audit Record

After the closing meeting, the fieldwork phase is complete. Before writing the report:

**Complete all working papers**: Every evidence item reviewed, every interview conducted, every technical test performed should be documented. Working papers completed promptly after fieldwork while details are fresh are more complete and accurate than working papers assembled days later.

**Confirm evidence references**: Every finding in the report must trace to specific working paper entries. Check that every finding has documented evidence.

**Finalise finding classifications**: Confirm the final classification for every finding — accounting for any revisions made at the closing meeting based on new evidence.

**Brief the audit manager/CISO** (where applicable): Before the formal report, a brief verbal summary of findings allows management to begin preparing corrective actions without waiting for the written report.

---

## Remote Audit Conduct

Post-COVID, remote audits are common — certification bodies, QSAs, and internal auditors all conduct remote fieldwork using video calls and screen sharing. Remote audit considerations:

**Screen sharing is the remote equivalent of on-site observation**: The auditor should direct the auditee to navigate to specific areas in real time — not accept screenshots prepared before the session. Request screen sharing rather than evidence submissions where direct observation adds value.

**Interview fatigue is higher in remote sessions**: Schedule 15-minute breaks between interview blocks; keep individual sessions to no more than 90 minutes; avoid back-to-back all-day video sessions.

**Evidence security**: In remote audits, evidence is typically transmitted electronically (shared folders, email, upload portals). Ensure evidence is shared through secure channels and that access is revoked after the audit.

**Technology contingency**: Have a backup plan if the primary video platform fails (different platform; phone call). Technical failures should not halt the audit — they should trigger a brief delay and resumption.

---

## Common Mistakes and Failures

**1. Not completing working papers before the closing meeting.**
The auditor presents findings at the closing meeting based on memory and rough notes. The auditee challenges a finding. The auditor cannot immediately reference the specific evidence. The discussion becomes unproductive; the auditor's credibility is damaged.

**2. Presenting opinions as findings.**
"The security culture seems weak." → Opinion. "Staff in 3 of 5 departments visited during the physical walkthrough were observed tailgating through secure doors during the audit period (2026-04-14)." → Finding. Findings must be factual.

**3. Allowing the auditee to dominate the closing meeting.**
An auditee who argues about every finding, provides extensive context for why each gap exists, and requests re-examination of every piece of evidence can extend the closing meeting by hours and exhaust the auditor's energy for defending findings. Manage the meeting professionally — acknowledge every response, investigate legitimate new evidence, but maintain control of the structure and timelines.

**4. Capitulating to pressure without new evidence.**
A finding is maintained through the closing meeting. After the meeting, the auditee's CISO contacts the internal audit manager and requests the finding be "softened." Without new evidence, the finding must be maintained — changing findings in response to management pressure without new evidence violates the independence and integrity principles.

**5. Closing meeting without confirming next steps.**
The findings are presented; both parties leave the meeting without clarity on: who receives the report; what the corrective action timeline is; who owns each corrective action. The report arrives and corrective actions stall because nobody knows what is expected of them.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Closing meeting conduct is specifically examined — what to include; how to handle disagreements; the basis for maintaining vs revising findings; note-taking and documentation requirements.
- The exam tests the auditor's obligation to maintain findings under pressure vs obligation to revise findings when presented with new evidence — the distinction is based on whether evidence changes, not whether the auditee is unhappy.

**CISM:**
- Domain 3 (Security Programme) — understanding audit conduct from both the auditor and auditee perspective; managing the internal audit function; responding to audit findings professionally.

**CISSP:**
- Domain 6 (Security Assessment and Testing) — audit conduct principles; handling findings and disagreements; the role of audit in the security programme.

---

## GUARDIAN's Take

The closing meeting is where the auditor's character is most visible. It is easy to conduct an audit when everything is compliant and the findings are positive. The closing meeting that tests professional quality is the one where findings are significant, the auditee is defensive, and the pressure to soften or withdraw findings is real.

I have sat in closing meetings where auditors have withdrawn correct findings because a senior manager expressed displeasure — and watched the subsequent audit report produce false assurance that later contributed to a real security failure. And I have sat in closing meetings where auditors have maintained correct findings under significant pressure, defended each finding with specific evidence, and produced an audit report that was genuinely uncomfortable but genuinely useful — driving improvements that would not otherwise have happened.

The closing meeting is not a negotiation. Findings are not positions to be bargained. They are professional conclusions drawn from evidence, subject to revision when new evidence is provided and only then. Hold that standard at every closing meeting, regardless of the seniority of the person expressing displeasure.

The auditor's job is to find the truth and report it accurately. Everything else in the closing meeting follows from that.

---
*Module: Module 10 — Audit and Assurance | Guardian Curriculum*
