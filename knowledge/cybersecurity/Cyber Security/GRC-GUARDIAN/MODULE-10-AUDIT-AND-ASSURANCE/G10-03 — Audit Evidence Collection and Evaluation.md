---
tags: [guardian, grc, module-10, audit-evidence, evidence-collection, sampling, interviews, working-papers]
module: 10
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-25
guardian-refs: ["G10-01 — What is an Audit", "G10-02 — Audit Planning", "G10-04 — Conducting the Audit", "G10-05 — Audit Findings", "G4-06 — Control Testing and Evidence Collection"]
---

# G10-03 — Audit Evidence Collection and Evaluation

> [!abstract] What This Note Covers
> By the end of this note, you will understand how to collect audit evidence systematically — what types of evidence exist, what makes evidence sufficient and appropriate, how to conduct effective interviews, how to document evidence in working papers, and how to evaluate conflicting evidence to reach defensible conclusions.

---

## Why This Exists

The quality of an audit's findings depends entirely on the quality of its evidence. A finding without adequate evidence is an opinion. A finding with systematic, documented evidence is a professional conclusion that can withstand challenge.

Audit evidence collection is a skill — not a mechanical process of ticking boxes, but a structured investigative methodology that involves selecting the right evidence types for each control, collecting samples that are genuinely representative, conducting interviews that surface operational reality rather than rehearsed answers, and evaluating evidence honestly even when it points toward uncomfortable conclusions.

This note covers the evidence collection and evaluation methodology that distinguishes professional audit work from compliance theatre.

---

## The Evidence Quality Framework

ISO 19011 establishes three criteria for audit evidence quality:

### Criterion 1: Sufficiency

Sufficient evidence means there is enough evidence to support the audit conclusion with reasonable confidence.

**What drives sufficiency:**
- **Sample size**: A single example of a control operating correctly does not demonstrate consistent operation. A sample of 30 user accounts with MFA enrolled provides much stronger evidence than confirming that one account has MFA.
- **Coverage**: Evidence covers the full scope — not just the easy or well-documented areas.
- **Corroboration**: Where possible, multiple independent evidence sources confirm the same conclusion.

**The insufficiency trap**: An auditor who confirms one provisioning record was completed correctly and concludes "provisioning is working well" has not collected sufficient evidence. Provisioning quality must be assessed across a representative sample.

### Criterion 2: Appropriateness

Appropriate evidence means the evidence is relevant to the specific audit criteria being assessed.

**What relevance means:**
- Evidence of a policy document (the AUP is written and approved) is appropriate for assessing documentation compliance but not for assessing staff compliance with the policy.
- Evidence of one quarterly access review is appropriate for assessing the Q3 review but not for assessing annual compliance.
- Evidence from the production system configuration is appropriate for assessing production controls; evidence from the development environment is not appropriate for demonstrating production compliance.

**The inappropriate evidence trap**: Policies as evidence of operational compliance — "we have a patch management policy" does not demonstrate that patches are applied within the policy's defined SLAs. The policy is appropriate evidence for the existence of a policy requirement; scan reports and patch deployment logs are appropriate evidence for operational compliance.

### Criterion 3: Reliability

Reliable evidence means the evidence can be trusted as an accurate representation of reality.

**Reliability hierarchy (most to least reliable):**

1. **Auditor-observed / auditor-generated**: The auditor directly reviews a live system, runs a query, or observes a process. The most reliable — no intermediary between evidence and conclusion.

2. **System-generated records**: Automated reports from identity providers, SIEM systems, vulnerability scanners, change management tools. Reliable because they are not manually prepared and have implicit timestamps.

3. **Third-party documentation**: Documents produced by independent third parties (penetration test reports, certification body audit reports, SOC 2 reports).

4. **Original source documents**: Documents produced by the auditee but originating from business processes (signed approval emails, change records, incident tickets).

5. **Copies and representations**: Photocopies, screenshots, and summaries provided by the auditee. Less reliable than originals — potentially modified.

6. **Oral representations**: What the auditee tells the auditor in interviews. Least reliable — cannot be independently verified; may be incomplete or inaccurate.

**Using oral evidence**: Oral evidence is valuable as a starting point for investigation (the auditee describes how a process works) and as corroboration for documentary evidence. It is not sufficient as standalone evidence for compliance conclusions.

---

## Evidence Types and Collection Methods

### Document Review

**What it is**: Systematic review of documented information — policies, standards, procedures, records, reports, and configurations — against the defined audit criteria.

**What to look for in each document type:**

*Policies and standards*: Currency (review date present and within schedule); approval evidence (approver named, date visible); appropriate scope (covers what it should); mandatory language ("must" not "should" where requirements are intended); absence of contradictions with other current documents.

*Procedures*: Step-by-step completeness; specificity of instructions; verification steps included; escalation path defined; system and tool references current.

*Records*: Date (within the audit period); completeness (all required fields present); signatures or approvals where required; authenticity indicators (system-generated vs manually prepared).

*Configuration files and reports*: Source system clearly identified; date of export; completeness (covers all in-scope systems); comparison against the relevant standard or baseline.

**Document review discipline**: Review documents actively, not passively. For each document, ask: does this demonstrate the criterion is met? If yes, record what specifically demonstrates it. If no, record what is missing or non-compliant. "Document reviewed" without a conclusion is not evidence.

---

### Interviews

**What they are**: Structured or semi-structured conversations with process owners, operational staff, and management to understand how processes actually work and to identify gaps between documented procedures and operational reality.

**Interview types:**

*Structured interviews*: Prepared questions asked in a defined order. Good for comparing responses across multiple interviewees (everyone answers the same questions, making comparison easier). Less flexible in following unexpected leads.

*Semi-structured interviews*: A prepared set of topics and key questions, but the interviewer adapts based on responses. Better for exploring unexpected findings and following leads. The standard approach for most audit interviews.

*Informal conversations*: Unscripted discussions during site visits, walkthroughs, or system demonstrations. Valuable for surface findings and understanding context. Not a substitute for formal interviews but a valuable complement.

**Interview preparation:**
- Review relevant documents before the interview (so you can ask informed follow-up questions)
- Prepare a question list covering the key audit objectives for this process area
- Know what evidence you expect to see and what you will ask for during the interview
- Know the role and responsibilities of the interviewee before the interview

**Effective interview technique:**

*Open questions first*: Start with open questions that require the interviewee to explain their process in their own words. "Walk me through what happens when a new employee joins. How is their access set up?" This surfaces both what they do and what they don't mention (omissions are as informative as responses).

*Follow-up deeply*: Never accept the first answer as complete. "Who reviews that access? How often? Show me the last review record." Follow-up questions are where the substance is.

*Non-leading questions*: Do not telegraph the expected answer. "I assume you use MFA for admin access, right?" → "Do you use MFA for admin access? If yes, can you show me?" The first question confirms what you expect; the second questions what you actually need evidence for.

*Clarify ambiguity*: When an answer is unclear ("we have a process for that"), ask for specifics: "Can you describe the process step by step?" "Who is responsible?" "How is it documented?"

*Request evidence during the interview*: When the interviewee describes a process, ask to see the evidence of that process operating: "You mentioned you conduct quarterly access reviews — can you show me the last one?"

*Note discrepancies but don't challenge immediately*: If an interviewee's answer contradicts a document you've reviewed, note the discrepancy for investigation — don't immediately challenge, which may make the interviewee defensive and less open. Investigate the discrepancy through other evidence; return to it if needed.

**Interview documentation**: Notes taken during the interview must capture: who was interviewed, when, what was asked, and what was answered. Verbatim quotes for particularly significant responses. Any evidence provided or requested during the interview.

---

### Observation

**What it is**: Directly observing processes, systems, or physical environments in operation — not reviewing documentation about them, but watching them happen.

**Where observation is most valuable:**

*Physical security*: Walk through the building noting: who holds doors open for whom; whether secure areas are properly secured during working hours; whether clear desk compliance is maintained; whether visitor management procedures are followed.

*System demonstrations*: Ask the auditee to demonstrate a process in a live system (not a test system). Watching account provisioning happen in the actual Azure AD console confirms both that the process works and that the system is configured as described.

*Process adherence*: Is the documented procedure actually being followed? Watch a change being submitted in the change management system — is the security review field completed? Is the business justification specific?

**Observation limitations**: People behave differently when observed. Staff who are aware an audit is in progress may be more careful than usual. Observation provides evidence of how things work under observation conditions; it does not guarantee this reflects normal operation. This is why observation is combined with record review (how things worked over a longer period) and interviews (how things usually work).

---

### Technical Testing

**What it is**: Direct technical examination of systems, configurations, and logs — either through the auditor's own technical access or through technical specialists.

**Forms of technical testing:**

*Configuration review*: Direct examination of system configuration settings against the secure configuration standard or baseline. Examples: reviewing firewall rules in the management console; checking Group Policy settings in AD; reviewing S3 bucket ACLs in the AWS console.

*Account status verification*: Querying the identity provider directly for account attributes — is MFA enrolled? What groups is the account in? When was the account last logged into? When was the password last changed?

*Log review and sampling*: Reviewing audit logs from the relevant system for the audit period — looking for anomalies, verifying that expected events are being logged, confirming log retention meets requirements.

*Vulnerability scan review*: Examining the output of vulnerability scans — not just the summary report, but the raw findings — to verify that critical vulnerabilities are being identified and tracked.

**Technical testing independence**: The auditor should, where possible, conduct technical testing with their own access to the system (read-only access provided by the auditee is appropriate) rather than relying entirely on evidence the auditee has prepared. An auditor who runs their own query against the identity provider produces more reliable evidence than an auditor who reviews a report the IT team prepared before the audit.

---

### Sampling

**What it is**: Testing a representative subset of a population (user accounts, change records, access reviews, invoices, training completions) to draw conclusions about the population as a whole.

**Sample selection principles:**

*Define the population clearly*: Before sampling, define exactly what the population is. "All user accounts" — as of what date? Including service accounts? Including disabled accounts? The population definition must match the control being assessed.

*Random selection*: Samples must be selected randomly or systematically (every nth item) — not hand-picked by the auditor or selected by the auditee. Random selection prevents bias and ensures the sample is representative.

*Expanded sampling on anomaly discovery*: When the initial sample reveals anomalies (exceptions to expected control operation), expand the sample. One exception in a sample of 20 may be isolated — but the finding statement must reflect this: "1 of 20 sampled accounts (5%) was found without MFA. This sample was expanded to 40 accounts; the exception rate in the expanded sample was 4 of 40 (10%), suggesting a more systemic issue."

*Document the sampling methodology*: Record: population definition; total population size; sample size; selection method; items selected (or sufficient description to reproduce the selection); any exceptions found.

**Sampling conclusion discipline**: A sample finding is a finding about the sample, not certainty about the entire population. The conclusion is probabilistic: "Based on a sample of 30 accounts, 3 exceptions were found, suggesting that a meaningful proportion of the population may not meet the MFA requirement. This finding warrants further investigation or escalation."

---

## Working Papers: The Audit Record

Working papers are the auditor's record of everything that happened during the audit — the evidence reviewed, the conclusions drawn, the basis for each finding. They are the link between evidence and finding.

**Working paper requirements:**
- **Completeness**: Every evidence item reviewed is documented; every conclusion has a corresponding evidence reference.
- **Clarity**: Someone who was not present during the fieldwork can read the working papers and understand what was done, what was found, and how each finding was reached.
- **Specificity**: Evidence references are specific (document title, version, date; system query description; interviewee name and role; date of observation).
- **Security**: Working papers may contain sensitive information (vulnerability details, personal data, privileged configuration settings). They must be protected appropriately.

**Working paper structure (for each audit area):**

```
AUDIT WORKING PAPER
Area: Access Management — MFA Compliance
Auditor: [Name]
Date: [Date]
Criteria: ISO 27001 A.8.5; MFA Standard v1.4; PCI DSS Req. 8.4.2

EVIDENCE REVIEWED:
1. MFA Standard v1.4 (effective 2025-01-15) — reviewed document for 
   requirements on MFA scope and enrollment timeline
   Finding: Standard requires MFA for all accounts accessing CDE 
   within 48 hours of account creation.

2. Azure AD MFA Status Report — generated by auditor using read-only 
   admin access, 2026-04-14, covering all 312 active user accounts
   Finding: 7 accounts (2.2%) show MFA enrollment status = Not Enrolled.
   Account IDs: [list].

3. Account creation dates for the 7 non-enrolled accounts — queried 
   from Azure AD audit log
   Finding: 5 of 7 accounts were created within the last 48 hours 
   (within the enrollment window — not yet a violation).
   2 of 7 accounts were created 15 and 23 days ago respectively — 
   both exceed the 48-hour requirement.

4. Interview: IT Operations Manager (K. Sharma, 2026-04-14)
   Q: "How do you ensure MFA is enrolled within 48 hours of account 
   creation?"
   A: "It's part of the provisioning checklist. But sometimes the 
   ticket goes through and the engineer forgets to trigger the 
   enrollment email."
   — Confirms an existing process gap; corroborates the documentary 
   finding.

CONCLUSION:
Two active accounts were found without MFA enrolled, both beyond the 
48-hour enrollment requirement in the MFA Standard. This indicates 
that the provisioning procedure does not reliably enforce MFA enrollment.

FINDING CLASSIFICATION: Minor Nonconformity
CRITERIA: ISO 27001 A.8.5; MFA Standard v1.4 Section 2.4

FINDING STATEMENT DRAFT:
"Two of 312 user accounts (Account IDs [X] and [Y], created [date] 
and [date] respectively) were found without MFA enrolled at the time 
of audit (2026-04-14), exceeding the 48-hour enrollment requirement 
in the MFA Standard v1.4 Section 2.4. The provisioning procedure does 
not currently include a verification step confirming MFA enrollment 
before the provisioning ticket is closed."
```

---

## Evaluating Conflicting Evidence

Complex audits frequently produce conflicting evidence — where one source suggests compliance and another suggests non-compliance. Handling conflicting evidence correctly is one of the most important audit skills.

**Common sources of conflict:**

*Policy says one thing; records show another*: The patch management standard requires critical patches within 14 days. The IT Manager says all critical patches are applied within 14 days. The patch tracking spreadsheet shows 3 critical patches applied at days 21, 35, and 48. → The records are more reliable than oral representation; the finding is based on the records.

*Different interviewees give different accounts*: The IT Manager says MFA is enforced for all admin accounts. A system administrator says they sometimes use their standard account for admin tasks when their admin account MFA is unavailable. → Interview a third person; review the logs; check actual account usage patterns.

*Documentation is current but records are old*: The access review procedure was updated 6 months ago to require quarterly reviews. The most recent completed access review on file is from 15 months ago. → The procedure is current but evidence of operation is missing. Either the reviews are being conducted and not documented, or they are not being conducted. Both are findings.

**Resolution approach:**
1. Identify the conflict explicitly (note it in working papers)
2. Seek additional evidence to resolve the conflict
3. Apply the reliability hierarchy — more reliable evidence takes precedence over less reliable
4. If the conflict cannot be resolved, document both pieces of evidence and the conflict; the finding should note the conflict and its implications

**The charitable interpretation principle**: Where evidence is genuinely ambiguous and could support either compliance or non-compliance, good auditors give the auditee the opportunity to provide clarifying evidence before concluding non-compliance. "We found X — can you provide evidence that addresses this?" If the auditee provides adequate evidence, the finding is withdrawn. If they cannot, the finding stands.

---

## Common Mistakes and Failures

**1. Treating documentation as evidence of compliance.**
The access control policy exists → access controls are working. The patch management standard exists → patches are applied on time. Policies and standards are evidence of documented requirements, not of operational compliance.

**2. Accepting auditee-selected samples.**
"Here are our 5 most recent access reviews" — provided by the auditee after being asked for a sample. The auditor accepts them without verifying there are no other reviews that were not provided. The 5 examples are the best 5; the 4 incomplete or overdue reviews are invisible.

**3. No working papers.**
The auditor reviews documents, conducts interviews, and writes a report — but produces no working papers connecting evidence to findings. When a finding is challenged ("we are compliant; the auditor missed our evidence"), there is no record of what was reviewed and what was found.

**4. Interviews without follow-up.**
"Yes, we conduct quarterly access reviews." → Moving on without asking to see the evidence. Every interview claim about control operation should be followed by "can you show me the evidence of that?"

**5. Conclusions based on single data points.**
One access review was conducted correctly → access reviews are compliant. One correctly provisioned account → provisioning is compliant. Single examples are illustrations, not evidence of consistent operation.

**6. Conflicting evidence unresolved.**
The policy says one thing; the records show another. The auditor notes both in the report without resolution, leaving the reader to determine which is authoritative. The auditor must investigate to resolve the conflict or explicitly state that the conflict could not be resolved and explain the implications.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Evidence collection is a core Lead Auditor exam topic. The exam tests: evidence types and their relative reliability; sufficiency and appropriateness; interview technique (open vs closed questions; handling discrepant responses); sampling methodology; working paper standards.
- Exam scenario: "The auditee provides the auditor with a list of user accounts to sample. Should the auditor use this list?" Answer: No — the auditor should generate their own sample from the full population to prevent auditee selection bias.
- "The IT Manager says all patches are applied within 14 days. The vulnerability scan shows several critical CVEs more than 14 days old. How should the auditor proceed?" Answer: The documentary evidence (scan report) is more reliable than oral representation; the scan findings are the basis for a finding; the auditor may ask the IT Manager to explain the discrepancy.

**CISM:**
- Domain 3 (Security Programme) — evidence collection supports both internal audit effectiveness and response to external audit inquiries. CISMs must understand what constitutes adequate evidence for compliance demonstrations.

**CISSP:**
- Domain 6 (Security Assessment and Testing) — evidence collection methodology, types of tests (examination, interview, observation, testing), and working paper documentation are examinable.

---

## GUARDIAN's Take

The difference between a good audit and a mediocre one is almost entirely in the evidence collection. A good auditor builds a factual picture — specific, referenced, documented — that their findings describe with precision. A mediocre auditor builds an impression and writes findings that reflect that impression.

The interview is the most undervalued evidence collection method and the one that most consistently reveals what documentary review misses. Documents tell you what should happen. Interviews tell you what does happen. And the gap between the two — documented process vs operational reality — is often where the most important findings live.

The question "can you show me?" is the most powerful instrument in an auditor's toolkit. Not "do you do X?" but "can you show me the evidence of X?" Every credible operational assertion should produce evidence. The operational assertions that cannot produce evidence are the ones that need the most scrutiny.

Document everything. Record evidence references precisely. Resolve conflicting evidence before concluding. And build working papers that could be read by any competent auditor as a complete record of what was done and found.

That is the evidence standard that makes findings defensible, conclusions credible, and the audit professionally valuable.

---
*Module: Module 10 — Audit and Assurance | Guardian Curriculum*
