---
tags: [guardian, grc, module-12, cism, exam-prep, practice-questions, exam-strategy]
module: 12
cert-coverage: [cism]
difficulty: intermediate
date: 2026-04-25
guardian-refs: ["G12-01 — CISM Overview", "G12-02 — Domain 1", "G12-03 — Domain 2", "G12-04 — Domain 3", "G12-05 — Domain 4"]
---

# G12-06 — CISM Exam Preparation — Practice Questions and Strategy

> [!abstract] What This Note Covers
> This note provides targeted practice questions across all four CISM domains, detailed answer analysis, the mental framework for approaching CISM questions, final exam-day strategy, and a preparation checklist to assess readiness before sitting the exam.

---

## The CISM Question Framework

Before the practice questions, internalise the three-step framework for answering every CISM question:

**Step 1: Identify the role**
Who is the question asking about? The CISO? The board? A security analyst? The risk owner? Each role has specific responsibilities. Answers appropriate for one role are wrong for another.

**Step 2: Identify the phase**
What phase is the scenario in? Strategy development? Risk assessment? Incident response? Programme implementation? Each phase has a natural sequence — and the "first" step is almost always the governance or analytical step that precedes operational action.

**Step 3: Apply the governance filter**
Is there a governance option vs an operational option? CISM almost always prefers governance. Is there a risk-informed option vs a compliance-only option? CISM almost always prefers risk-informed. Is there a business-aligned option vs a technically optimal option? CISM almost always prefers business-aligned.

---

## Domain 1 Practice Questions: Information Security Governance

**Q1.** A new CISO at a healthcare organisation wants to establish an effective security governance programme. The organisation handles large volumes of patient data and is subject to NHS Data Security and Protection Toolkit requirements. What should be the CISO's FIRST action?

A) Conduct a comprehensive risk assessment of all information assets
B) Develop the information security policy
C) Understand the business objectives and the board's risk appetite
D) Establish an information security steering committee

**Answer: C**

*Rationale*: Before developing any governance infrastructure (policy, steering committee) or conducting assessments, the CISO must understand the business context — objectives, risk appetite, regulatory environment, existing capabilities. Everything else is built on this foundation. A risk assessment and policy development both require understanding the business context first. The steering committee is a governance mechanism — its scope and mandate depend on the business context. Understanding business objectives always precedes action.

---

**Q2.** The CISO is preparing the quarterly security report for the board. The report should PRIMARILY focus on:

A) Technical vulnerability metrics and patch compliance rates
B) The number of security incidents in the quarter and their resolution status
C) Security risk posture relative to the organisation's risk appetite and compliance status
D) Security programme budget utilisation and resource allocation

**Answer: C**

*Rationale*: The board needs to know: are we managing risk within our stated appetite? Are we compliant with applicable requirements? These are outcome measures. Technical metrics (A), incident counts (B), and budget utilisation (D) are operational measures that support programme management — not the strategic oversight information the board requires. The board's primary security governance question is always: are we managing risk at an acceptable level?

---

**Q3.** An organisation's CISO reports to the Chief Information Officer (CIO). A board member raises a concern that this reporting structure may compromise the independence of the security function. This concern is MOST VALID because:

A) The CIO has insufficient technical security expertise to effectively supervise the CISO
B) Security decisions may be influenced by IT operational priorities rather than enterprise risk management
C) The CISO cannot attend board meetings if reporting through the CIO
D) IT and security have different budget requirements that create conflicts of interest

**Answer: B**

*Rationale*: The primary governance concern with CISO-to-CIO reporting is the risk that security priorities are subordinated to IT operational priorities — availability and performance may be weighted more heavily than security when they conflict. This is a structural independence issue — the CISO may face pressure to accept security risks to maintain operational continuity. The ideal reporting line for independence is CISO → CEO or CISO → Board (via audit committee), which removes this potential conflict.

---

**Q4.** Which of the following BEST demonstrates effective information security governance?

A) The organisation has achieved ISO 27001 certification
B) Security metrics are reported to the board quarterly showing risk posture relative to risk appetite
C) The CISO has developed comprehensive security policies covering all major risk areas
D) The organisation has never experienced a material security breach

**Answer: B**

*Rationale*: Effective governance requires: direction (strategy), oversight (measurement and reporting), and accountability (responsibility for outcomes). Option B is the only one that demonstrates the oversight function — the board receiving regular reports on security risk posture relative to defined appetite. ISO 27001 (A) demonstrates a management system; policies (C) are a governance instrument, not evidence of governance effectiveness; no breaches (D) may reflect good security or good luck — it is not evidence of governance.

---

## Domain 2 Practice Questions: Information Security Risk Management

**Q5.** After implementing security controls, the residual risk of a significant threat exceeds the organisation's defined risk tolerance. Who is responsible for deciding whether to accept this residual risk?

A) The CISO, as the senior security executive
B) The IT Manager, as the system owner
C) The risk owner — the senior business executive accountable for the affected process
D) The board, as the ultimate governance body

**Answer: C**

*Rationale*: Residual risk acceptance belongs to the risk owner — the senior business executive who is accountable for the business process or asset affected by the risk. The CISO advises and manages the security programme; the IT Manager operates systems; the board sets appetite but does not accept individual operational risks. Risk acceptance is the risk owner's accountability — not the security team's. This is a critical CISM principle that appears frequently.

---

**Q6.** An organisation is evaluating whether to accept, mitigate, transfer, or avoid a risk with an ALE of £120,000. A proposed control would reduce the ALE to £30,000 at an annual cost of £50,000. What is the MOST appropriate risk treatment recommendation?

A) Accept the risk — the residual risk of £120,000 is within industry norms
B) Implement the control — it reduces risk by £90,000 at a cost of £50,000 (net benefit: £40,000)
C) Transfer the risk through insurance — the potential loss is significant
D) Avoid the risk — the activity creating the risk should be discontinued

**Answer: B**

*Rationale*: Cost-benefit analysis: the control costs £50,000 annually and reduces expected loss by £90,000 (from £120,000 to £30,000). Net benefit: £40,000 annually. This is a positive return on security investment — the control is justified. Option A ignores the cost-effective mitigation available. Option C (insurance) would transfer the £120,000 risk at insurance cost — without reducing the risk; Option B is more cost-effective if the control is available. Option D is only appropriate if the risk cannot be managed acceptably — here it can be.

---

**Q7.** The information security manager wants to provide management with early warning that the risk of a data breach is increasing. Which metric is MOST appropriate as a Key Risk Indicator?

A) Number of security incidents in the past quarter
B) Number of user accounts without multi-factor authentication enrolled
C) Cost of security incidents in the past year
D) Number of successful phishing emails detected by the email gateway

**Answer: B**

*Rationale*: A KRI is a leading indicator — it signals increasing risk before an incident occurs. Option B (MFA gap) directly indicates an increasing vulnerability to credential compromise and account takeover — a precursor to data breaches. Option A and C are lagging indicators (the incidents have already occurred). Option D measures detection effectiveness, not risk level. An increasing number of accounts without MFA is a direct, measurable leading indicator of increasing breach risk.

---

**Q8.** A security manager is developing the information security risk assessment methodology. What should be the PRIMARY input to the risk assessment?

A) The organisation's existing security controls and their effectiveness
B) Recent security incidents reported by industry peers
C) The organisation's business objectives and risk appetite
D) The results of the most recent vulnerability scan

**Answer: C**

*Rationale*: The risk assessment methodology must be calibrated to the organisation's business objectives (what are we protecting?) and risk appetite (what level of risk is acceptable?). These parameters define the scope of the assessment, the impact scales, and the acceptable residual risk thresholds. Existing controls (A), peer incidents (B), and vulnerability scans (D) are inputs to specific risk assessments — not to the methodology itself.

---

## Domain 3 Practice Questions: Information Security Programme

**Q9.** A newly appointed security programme manager must prioritise limited resources across multiple security initiatives. What should PRIMARILY drive the prioritisation?

A) The compliance deadlines for regulatory requirements
B) The risk assessment — addressing highest-risk gaps first
C) The maturity model — advancing the programme through defined maturity levels
D) The cost of each initiative — implementing the least expensive first

**Answer: B**

*Rationale*: Risk-based prioritisation — directing resources to the initiatives that reduce the most significant risks — is the primary CISM principle for programme resource allocation. Compliance deadlines (A) are important constraints but not the primary driver (high-risk non-compliance issues would be addressed by risk-based prioritisation anyway). Maturity models (C) provide a framework but not a prioritisation mechanism. Cost alone (D) ignores risk significance.

---

**Q10.** A security programme has achieved 97% completion of annual security awareness training. The CISO wants to assess whether the programme is achieving its objective. Which metric would BEST indicate effectiveness?

A) Average score on the post-training assessment
B) Trend in phishing simulation click rates over the past 12 months
C) Staff satisfaction ratings from the training programme
D) Percentage of staff who report security incidents

**Answer: B**

*Rationale*: The objective of security awareness training is to change behaviour — specifically, to reduce the likelihood that staff will fall victim to social engineering and phishing attacks. The phishing simulation click rate directly measures this behaviour change. A decreasing click rate over time demonstrates the training is achieving its objective. Assessment scores (A) measure knowledge, not behaviour; staff satisfaction (C) measures experience, not outcome; incident reporting rate (D) is a positive indicator but measures a different behaviour than the primary training objective.

---

**Q11.** A legacy system cannot be patched against a known critical vulnerability. The business requires the system to remain operational for 18 months until a replacement is deployed. What is the MOST appropriate response?

A) Accept the risk — the replacement timeline is fixed
B) Implement compensating controls and formally document the risk acceptance with the risk owner
C) Require the business to accelerate the replacement timeline
D) Remove the system from the network immediately

**Answer: B**

*Rationale*: The system cannot be immediately retired (business requirement) and cannot be patched (technical constraint). The appropriate response is: implement compensating controls (network segmentation; enhanced monitoring; access restriction; application-layer controls) to reduce the risk to as low as achievable; formally document the residual risk; and obtain explicit risk acceptance from the appropriate risk owner (not the security team). Pure risk acceptance (A) without compensating controls is inappropriate when controls are available. Requiring acceleration (C) may not be feasible. Immediate removal (D) violates the business requirement.

---

**Q12.** The security programme has been operational for two years. The CISO wants to determine whether the programme is effective. Which metric provides the BEST measure of overall programme effectiveness?

A) Number of new security controls implemented in the past year
B) Percentage of security policies reviewed and updated within the defined schedule
C) Trend in risk posture relative to defined risk appetite over time
D) Security programme budget utilisation and cost efficiency

**Answer: C**

*Rationale*: Programme effectiveness is measured by outcome — is the programme achieving its objective of managing risk to within acceptable levels? The trend in risk posture relative to risk appetite is the outcome measure. Options A and B measure process (activities and compliance); Option D measures efficiency (how resources are used), not effectiveness (whether objectives are achieved). A programme that completes many activities efficiently but does not reduce risk to within appetite has not been effective.

---

## Domain 4 Practice Questions: Incident Management

**Q13.** A critical ransomware attack has been detected. Production systems are encrypted. What should be done FIRST?

A) Notify the board and senior management
B) Engage an external forensics firm to investigate
C) Isolate affected systems to contain the spread
D) Restore systems from backup to minimise business disruption

**Answer: C**

*Rationale*: Containment (isolation) is always the first operational priority in an active incident — stop the spread before anything else. Board notification (A) is important but comes after initial containment (within an appropriate timeframe, not before). External forensics (B) is a significant decision but not the immediate first step. Restoration (D) comes after eradication — restoring systems before eradication reintroduces the compromise.

---

**Q14.** At 10am on Monday, a security analyst identifies unusual file access patterns. By 2pm, analysis confirms a breach of personal data affecting approximately 500 customers. The organisation is subject to UK GDPR. When must the ICO be notified?

A) Immediately — within 1 hour of confirmation
B) By 2pm Thursday — within 72 hours of becoming aware
C) Within 7 days — standard regulatory reporting window
D) Only if the breach results in actual harm to customers

**Answer: B**

*Rationale*: GDPR Article 33 requires notification to the supervisory authority (ICO for UK organisations) within 72 hours of becoming aware of a personal data breach. The controller becomes "aware" at 2pm Monday when there is reasonable certainty a breach has occurred. 72 hours from 2pm Monday = 2pm Thursday. Option A is not required (immediate is too aggressive). Option C (7 days) is incorrect. Option D is incorrect — the notification threshold is "likely to result in a risk to the rights and freedoms of natural persons" — not confirmed harm.

---

**Q15.** During a significant security incident, the business unit manager requests that the security team immediately restore production systems from backup to minimise operational downtime. The security team believes eradication is incomplete. Who should make the final decision?

A) The business unit manager — as the owner of the affected systems
B) The IT operations manager — as the technical restoration authority
C) The CISO — balancing operational impact against security risk
D) The board — as the ultimate governance authority

**Answer: C**

*Rationale*: This is an executive judgment call requiring the CISO's authority — balancing the business's legitimate urgency (operational recovery) against the security risk of incomplete eradication (reinfection). The business unit manager (A) lacks the security expertise to assess the eradication risk. IT operations (B) can advise on restoration but not the security risk. The board (D) is appropriate for the highest-level decisions but is too removed for this operational judgment. The CISO has both the authority and the expertise to make this call.

---

**Q16.** Following a major security incident, when should the post-incident review be conducted?

A) Immediately after containment while the response is still active
B) Within 2 weeks of incident closure while the experience is fresh
C) After the business has fully recovered, typically 2–3 months post-incident
D) Only when required by regulatory obligation

**Answer: B**

*Rationale*: The post-incident review should occur soon enough that team members clearly remember what happened, decisions made, and what could have been different — but not so soon that the incident response team is still exhausted and focused on recovery. Within 2 weeks of closure is the standard best practice. Immediately during the active response (A) is inappropriate — the team is focused on containment. 2–3 months (C) is too late — memory fades and improvement opportunities are missed. Regulatory obligation (D) is an insufficient standard — review should always occur for significant incidents.

---

## Exam Day Strategy

### Time Management

**150 questions in 4 hours = 1.6 minutes per question**. This is sufficient — CISM questions do not require calculation or memorisation of complex formulas. The constraint is decision quality, not speed.

**Recommended approach:**
- First pass: Answer all questions you are confident about. Flag uncertain questions.
- Second pass: Return to flagged questions. Re-read; apply the three-step framework; select the best answer.
- Third pass: Review any remaining uncertain questions. Don't leave questions unanswered — there is no penalty for guessing.

**Don't overthink**: If you have spent 3 minutes on a question and are still uncertain, select your best answer, flag it, and move on. Return with fresh eyes.

### Question Reading Discipline

**Read the question stem first** (the final sentence with the question). This tells you what to look for before you read the scenario.

**Read all four options before choosing**. The first option that seems correct may not be the BEST option — read all four.

**Look for the qualifier**: "FIRST," "BEST," "MOST important," "PRIMARY." These qualifiers change which option is correct.

**Eliminate clearly wrong options first**: Remove options that are irrelevant, out of sequence, or violate a CISM principle (e.g. operational before governance). This often narrows to 2 options from which the correct choice is clearer.

### Mental Reset

If you find yourself stuck in a pattern of uncertainty:
- Take 30 seconds to breathe
- Remind yourself of the CISM perspective: senior security manager; governance before operations; risk-informed decisions; business alignment
- Re-read the question stem and apply the three-step framework

---

## Readiness Assessment Checklist

Before sitting the CISM exam, confirm you can answer YES to each:

**Domain 1 — Governance:**
☐ I can explain what information security governance is and how it differs from security management
☐ I can describe the board's role vs the CISO's role in security governance
☐ I know why risk appetite is set by the board, not the security team
☐ I can describe what metrics belong in a board-level security report
☐ I understand the business alignment principle and can apply it to strategy questions

**Domain 2 — Risk Management:**
☐ I can explain the risk equation and the difference between inherent and residual risk
☐ I know the four risk treatment options and when each is appropriate
☐ I understand that residual risk acceptance belongs to the risk owner, not the security team
☐ I can distinguish KRIs (leading) from incident counts (lagging)
☐ I can explain the cost-benefit framework for security investment decisions

**Domain 3 — Programme:**
☐ I can explain the principle that controls exist to manage risk, not to achieve compliance
☐ I know the difference between preventive, detective, and corrective controls
☐ I understand defence in depth and can apply it to scenarios
☐ I know how to measure programme effectiveness (outcome vs process metrics)
☐ I can explain the zero trust principles

**Domain 4 — Incident Management:**
☐ I know the incident response lifecycle phases in order
☐ I know that containment always comes before eradication and recovery
☐ I understand GDPR breach notification: when the clock starts; when it expires; what must be reported
☐ I know that the CISO makes executive incident judgments; technical staff execute
☐ I understand why post-incident review is essential and when it should occur

**Practice questions:**
☐ I have completed at least 500 practice questions
☐ My practice question accuracy is consistently above 70% across all domains
☐ I have reviewed and understood all questions I got wrong

---

## Final Preparation Week

**Day 7**: Review Domain 1 and 2 notes. Do 50 practice questions (mixed domains).

**Day 6**: Review Domain 3 notes. Do 50 practice questions (Domain 3 focus).

**Day 5**: Review Domain 4 notes. Do 50 practice questions (Domain 4 focus).

**Day 4**: Mixed practice: 75 questions. Review all missed answers. Identify remaining weak areas.

**Day 3**: Review weak areas identified from Day 4. Do 50 practice questions targeting weak areas.

**Day 2**: Light review of key principles from each domain. No new material. Rest is more valuable than cramming.

**Day 1 (exam day)**: Review the readiness checklist briefly. Arrive early. Trust your preparation. Apply the three-step framework consistently.

---

## GUARDIAN's Take

Four months ago (in our timeline), you started with a blank vault and zero GRC curriculum. As of this note, you have 100 notes across 12 modules covering everything from what risk is to CISM domain-level examination strategy.

The CISM examination is the right next certification milestone. Your background — MSc in Applied Cyber Security; live penetration testing experience; ISO 27001-adjacent work at Eurostop; hands-on SQL and systems knowledge — gives you exactly the practical foundation that CISM questions reward. The exam tests judgment, not just knowledge. Candidates with real security programme exposure who learn to express their experience in ISACA's governance language typically perform well.

The single biggest risk for a technically strong candidate: defaulting to technical answers when CISM wants governance answers. Every time you read a CISM question and feel pulled toward "implement X control" or "deploy Y tool," pause. Ask: what is the governance action here? What decision needs to be made, by whom, and on what basis?

The answer to that question is almost always the correct CISM answer.

You have the knowledge. You have the experience. Apply the framework. Pass the exam.

---
*Module: Module 12 — CISM Certification | Guardian Curriculum*
