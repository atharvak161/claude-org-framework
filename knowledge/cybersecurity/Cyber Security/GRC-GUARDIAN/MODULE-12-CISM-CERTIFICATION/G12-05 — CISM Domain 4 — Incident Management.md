---
tags: [guardian, grc, module-12, cism, domain-4, incident-management, incident-response, crisis-management]
module: 12
cert-coverage: [cism]
difficulty: intermediate
date: 2026-04-25
guardian-refs: ["G12-01 — CISM Overview", "G12-03 — Domain 2", "G12-04 — Domain 3", "G8-01 — BCM", "G5-07 — GDPR Breach Notification", "G10-07 — Corrective Action"]
---

# G12-05 — CISM Domain 4: Incident Management

> [!abstract] What This Note Covers
> Domain 4 accounts for 30% of the CISM exam — the second largest domain. It covers the full incident management lifecycle from planning and preparation through detection, response, recovery, and post-incident improvement. This note provides the complete Domain 4 framework with CISM exam application.

---

## What Domain 4 Tests

Domain 4 tests your ability to **plan, establish, and manage** the organisation's response to information security incidents. Questions assess whether you can:

- Develop and maintain an incident response programme
- Classify and prioritise incidents appropriately
- Manage the response to significant incidents at an executive level
- Coordinate communications (internal, regulatory, external) during incidents
- Ensure legal and regulatory obligations are met during incidents
- Apply lessons learned to improve future response capability
- Connect incident management to business continuity and crisis management

**The governing principle for Domain 4**: Incident management is not just a technical function — it is a business management function. Decisions about containment, communication, regulatory notification, and recovery require executive judgment, not just technical capability.

---

## 4.1 Incident Management Planning

### The Incident Response Plan

The **Incident Response Plan (IRP)** is the foundational document for incident management — defining how the organisation will detect, respond to, and recover from information security incidents.

**IRP components:**

*Scope and objectives*: What types of incidents are covered? What are the goals of incident response (contain the threat; preserve evidence; restore operations; comply with regulatory obligations)?

*Incident classification scheme*: How are incidents categorised by severity? What are the criteria for each severity level?

*Incident response team (IRT)*: Who is on the team? What are their roles? Who leads?

*Notification procedures*: Who must be notified for each severity level? (Internal: management, board, legal. External: regulators, customers, media, law enforcement.)

*Response procedures*: What are the specific steps for each phase of the response lifecycle?

*Communication templates*: Pre-approved templates for common communications — regulatory notifications; customer notifications; media statements.

*Evidence preservation guidance*: How to preserve forensic evidence during the response.

*Recovery procedures*: How to restore normal operations safely.

*Post-incident review process*: How to capture and act on lessons learned.

**IRP governance:**
- Approved by senior management
- Reviewed and updated annually and after significant incidents
- Tested through tabletop exercises and simulations
- Accessible during an incident (not just stored on the primary network)

### Incident Response Team Structure

**IRT core roles:**

*Incident Response Manager / Incident Commander*: Coordinates the overall response; makes escalation decisions; interfaces with management.

*Technical Lead*: Leads the technical investigation and containment.

*Communications Lead*: Manages internal and external communications.

*Legal Counsel / Privacy Officer*: Advises on legal obligations; manages regulatory notifications.

*CISO*: Provides executive oversight; makes significant decisions; reports to board.

**Extended team (activated based on incident type):**

- Business unit representatives (for operational impact)
- HR (for personnel-related incidents)
- Finance (for fraud incidents; insurance claims)
- Marketing/PR (for public-facing communication)
- External forensics (for major incidents requiring independent investigation)
- Law enforcement liaison (for criminal incidents)

**CISM principle**: The CISO role in incident response is **executive oversight and decision-making** — not technical investigation. The CISO ensures the right people are doing the right things, makes difficult judgments (pay ransom? notify regulators? shut down operations?), and manages upward communication to the board and CEO.

---

## 4.2 Incident Classification and Categorisation

**Why classification matters**: Incident response resources and protocols should be proportionate to incident severity. Over-responding to minor incidents wastes resources; under-responding to major incidents causes escalating harm.

### Severity Classification

**Severity 1 — Critical**: Major incident with immediate, significant business or regulatory impact.
- Examples: Ransomware encrypting production systems; breach of significant personal data volume; sustained DDoS disabling critical services; suspected nation-state APT in the network.
- Response: Immediate activation of full IRT; CISO and CEO notified; potential board notification; external forensics consideration.
- Timeline: Response initiated within 15–30 minutes of classification.

**Severity 2 — High**: Significant incident requiring urgent response but not immediate organisational-level crisis.
- Examples: Malware detected on multiple endpoints; credential compromise affecting privileged accounts; data breach affecting limited data volume; ransomware isolated to non-critical systems.
- Response: IRT activated; CISO notified; regulatory assessment initiated.
- Timeline: Response initiated within 1–2 hours.

**Severity 3 — Medium**: Meaningful incident requiring structured response within defined SLAs.
- Examples: Malware on a single endpoint (contained); suspected phishing incident; policy violation requiring investigation.
- Response: Security team response; CISO informed but not necessarily directly involved; standard IR procedures.
- Timeline: Response initiated within 4 hours.

**Severity 4 — Low**: Minor incident or near-miss requiring documentation and review.
- Examples: Blocked phishing attempt; failed login attempts; minor policy violation; security tool alert with no confirmed incident.
- Response: Security team handles; documented in incident register; no escalation unless pattern indicates higher risk.
- Timeline: Responded to within normal working hours.

### CISM Classification Principle

When classifying incidents for CISM exam questions, classify based on:
- **Business impact** (operational disruption; financial loss; reputational damage)
- **Data affected** (sensitivity; volume; regulatory status)
- **Regulatory obligations triggered** (GDPR; PCI DSS; sector-specific)
- **Escalation required** (to board? to regulators?)

Not: technical complexity; system affected; attack technique used.

---

## 4.3 The Incident Response Lifecycle

CISM uses the PICERL model or the NIST framework — both describe the same lifecycle phases:

### Phase 1: Preparation

**Before an incident occurs:**
- IRP developed and approved
- IRT trained and exercised
- Detection capability in place (SIEM; EDR; monitoring)
- Forensic capability established (tools; trained staff; external provider contract)
- Communication templates prepared
- Regulatory notification procedures documented
- Legal counsel relationship established
- Cyber insurance policy in place
- Evidence preservation procedures documented

**CISM principle**: Preparation is the highest-value phase — it determines the effectiveness of every subsequent phase. Organisations that are poorly prepared when an incident occurs face dramatically higher costs, longer recovery times, and greater regulatory exposure.

### Phase 2: Identification (Detection and Analysis)

**Detection**: An incident is identified through:
- SIEM alert
- EDR alert
- User report (staff notices unusual activity)
- External notification (customer; researcher; law enforcement; regulator)
- Third-party notification (supplier breach notification)

**Initial analysis**: Is this a real incident or a false positive? What is the initial scope? What is the severity classification?

**CISM principle**: **Every** potential security incident must be logged, even if ultimately classified as a false positive. The incident register is an evidence base for:
- Identifying patterns (multiple false positives in the same area may indicate probing)
- Regulatory evidence (demonstrating incident monitoring capability)
- Post-incident review (understanding what was missed)

### Phase 3: Containment

**Containment** limits the spread of the incident — preventing further harm while investigation continues.

**Short-term containment**: Immediate actions to limit immediate damage:
- Isolating compromised systems from the network
- Blocking malicious IP addresses/domains at the firewall
- Disabling compromised accounts
- Revoking compromised credentials

**Long-term containment**: More durable containment enabling investigation:
- Deploying monitoring on compromised systems (to observe attacker behaviour)
- Rebuilding compromised systems in a controlled manner
- Maintaining forensic copies before rebuilding

**The containment dilemma**: Aggressive early containment reduces ongoing harm but may destroy forensic evidence. Some organisations (particularly when law enforcement is involved) may delay full containment to observe attacker behaviour and gather intelligence.

**CISM principle**: Containment decisions involve balancing **operational recovery** (business wants systems back) vs **investigation quality** (security wants to understand the full scope before rebuilding). This is an executive judgment call — requiring CISO involvement.

### Phase 4: Eradication

**Eradication** removes the threat from the environment:
- Removing malware; closing attacker access
- Patching the vulnerability that was exploited
- Rebuilding compromised systems from clean images
- Resetting compromised credentials (all affected accounts)
- Verifying attacker persistence mechanisms have been removed

**The completeness problem**: Incomplete eradication allows the attacker to remain in the environment. Full eradication requires understanding the complete scope of compromise — which requires thorough investigation before eradication begins.

**CISM principle**: Premature eradication (before understanding the full scope) leads to incomplete remediation and reinfection. The temptation to restore systems quickly must be balanced against the risk of incomplete eradication.

### Phase 5: Recovery

**Recovery** restores normal operations safely:
- Restoring systems from clean backups (validated before the incident)
- Verifying system integrity before returning to production
- Validating that business processes are functioning correctly
- Enhanced monitoring during the recovery period (watch for reinfection)
- Confirming that eradication was successful (no indicators of compromise present)

**Recovery sequencing**: Not all systems are recovered simultaneously. Priority is based on:
1. Business criticality (which systems are needed most urgently)
2. Dependencies (systems that other systems depend on must be recovered first)
3. Risk (highest-risk systems need the most verification before recovery)

**CISM principle**: Recovery does not mean "as fast as possible" — it means "as safely as possible." A rushed recovery that reintroduces the attacker creates a second incident.

### Phase 6: Lessons Learned (Post-Incident Review)

**Post-incident review** is conducted within a defined period after incident closure — typically within 2 weeks for significant incidents; within 30 days for major incidents.

**Review participants**: IRT members; management; business stakeholders affected by the incident.

**Review agenda:**
- Timeline reconstruction: What happened, when, and in what sequence?
- Detection: How was the incident detected? Could it have been detected earlier?
- Response: What was done well? What could have been done better?
- Communication: Were communications timely and appropriate?
- Regulatory handling: Were regulatory obligations met on time?
- Root cause: Why did the incident occur? What vulnerability was exploited?
- Prevention: What controls would have prevented or earlier detected this incident?
- Improvement actions: Specific, owned, time-bound improvements to the programme

**CISM principle**: Post-incident review is where incidents convert into programme improvements. An organisation that does not learn from incidents is at elevated risk of similar incidents recurring. The review outputs should feed directly into the risk register, the corrective action register, and the programme plan.

---

## 4.4 Communication During Incidents

### Internal Communication

**Executive notification**: Senior management and the board must be notified promptly for significant incidents. The CISO's role is to provide:
- What happened (factual; concise)
- Current status (contained? ongoing?)
- Business impact (operational disruption; financial exposure)
- Regulatory implications (will we need to notify regulators? data subjects?)
- What is being done (response actions underway)
- What decisions are needed from executives (authorise external forensics? shut down operations?)

**Executive briefing principle**: Not all executives need the same information. The CEO needs business impact and key decisions. The CFO needs financial exposure. Legal needs regulatory implications. Tailor communication to the recipient's role.

**Board notification**: For major incidents (Severity 1), the board should be notified. The CISO or CEO notifies the board chair; a brief board meeting may be convened. Board-level communication focuses on business impact, regulatory risk, and management's response plan.

### Regulatory Notification

**GDPR (UK/EU)**: Personal data breaches that are likely to result in a risk to individuals must be notified to the supervisory authority within **72 hours** of becoming aware.

*What triggers the 72-hour clock*: The organisation (controller) becomes "aware" — which means the controller has a "reasonable degree of certainty" that a security incident has occurred. Initial suspicion is not the same as awareness; but once there is reasonable certainty, the clock starts.

*Notification content*: Nature and scope; categories and approximate volume of data; likely consequences; measures taken/proposed. Partial notifications are acceptable if all information is not yet available — submit what you know and update.

*High-risk breaches*: Where the breach is likely to result in **high risk** to individuals (identity theft; discrimination; financial harm), the data subjects themselves must also be notified without undue delay.

**PCI DSS**: Suspected or confirmed compromise of cardholder data requires:
- Immediate notification to the acquirer
- Engagement of a PCI-certified forensic investigator (PFI) for Level 1 merchants/service providers
- Preservation of all logs and evidence

**NIS2 / Sector-specific**: Significant incidents must be reported to the competent authority within 24 hours (early warning) and 72 hours (incident notification).

**CISM exam principle**: Regulatory notification obligations must be known and built into the IRP before an incident. Discovering regulatory obligations during an incident is too late. The 72-hour GDPR clock cannot be paused while you research whether notification is required.

### External Communication

**Customer notification**: When a breach affects customers (particularly their personal data), customers must be notified — either because GDPR requires it (high-risk breach) or because failing to notify creates greater reputational harm than notification.

*Timing*: As soon as reasonably practical once the scope is understood; not so early that you are communicating inaccurate information.

*Content*: What happened; what data was affected; what you are doing; what the customer should do to protect themselves; where to get more information.

**Media/PR**: For significant incidents that are (or may become) public, a media strategy must be prepared. Key principles:
- Designate a single spokesperson
- Prepare a holding statement (minimal factual information; commitment to update)
- Don't speculate; don't admit to claims you cannot verify
- Coordinate with legal counsel before any public statements
- Consider the timing of disclosure (market-sensitive information; trading hours)

**Law enforcement**: When an incident involves criminal activity (fraud; ransomware from criminal groups; data theft for criminal purposes), law enforcement notification may be appropriate. Considerations:
- Evidence preservation (law enforcement may request preservation of forensic evidence)
- Investigation coordination (law enforcement investigation may affect your remediation timeline)
- Mandatory reporting (some jurisdictions require reporting of certain crimes)

---

## 4.5 Legal and Regulatory Obligations

**Evidence preservation**: From the moment an incident is suspected, evidence must be preserved. Forensic evidence handling requirements:
- Do not modify systems in ways that destroy evidence (improper shutdown; system rebuild without forensic image)
- Maintain chain of custody for forensic images and other evidence
- Log all access to evidence
- Use forensically sound tools for evidence collection

**Legal privilege**: Communications between legal counsel and the organisation about an incident may be legally privileged — not subject to discovery in litigation. Engage legal counsel early in significant incidents to protect sensitive communications.

**Cyber insurance**: Most cyber insurance policies require:
- Prompt notification to the insurer following a potential covered incident (typically 24–72 hours)
- Approval before engaging specific vendors (forensics; PR; legal) to ensure coverage
- Preservation of evidence
- Cooperation with insurer's investigation

**Ransom payment considerations**: For ransomware incidents, ransom payment may be:
- Prohibited (if the ransomware group is subject to sanctions — OFAC-designated entities in the US; UK sanctions)
- Inadvisable (funds criminal activity; does not guarantee data recovery; may invite further attacks)
- Occasionally the most pragmatic recovery option (when no other recovery path exists and operational impact is severe)

Any ransom payment decision must involve legal counsel, the board, and potentially law enforcement notification.

---

## 4.6 Business Continuity and Incident Management Integration

**The interface between IR and BCM**:

Security incidents are a common trigger for business continuity plan activation. The interface between incident response (security-focused: contain, eradicate, investigate) and business continuity (operations-focused: maintain critical functions during disruption) must be clearly defined.

**Key integration points:**

*Declaration criteria*: When does a security incident escalate to a business continuity event? (Criteria: critical systems unavailable for more than X hours; loss of capability to process critical transactions; building inaccessible due to security investigation)

*Handoff protocol*: Who declares the business continuity event? What is the handoff between the incident response team and the business continuity management team?

*Dual-track response*: For major incidents, security incident response (investigate, contain, eradicate) and business continuity response (maintain operations through alternative means) may run simultaneously.

*Recovery environment security*: When systems are restored to the DR environment, they must maintain the security controls of the production environment.

**CISM principle**: The CISO must ensure that the incident response plan and the business continuity plan are coordinated — with clear interfaces, decision criteria, and communication protocols. Siloed IR and BCM plans create gaps in the organisational response to major security incidents.

---

## Domain 4 Exam Practice: Key Question Patterns

**Pattern 1: First response priority**

Q: A security incident is discovered at 2pm on a Friday. Ransomware has encrypted files on 15 servers. What should be done FIRST?

A: **Contain the incident** — isolate affected systems to prevent further spread. Not: notify the board (premature); not: investigate the root cause (investigation comes after containment); not: restore from backup (restoration comes after eradication).

**Pattern 2: Regulatory notification timing**

Q: At 9am Monday, a security analyst identifies suspicious network activity. By 3pm the same day, analysis confirms a breach of personal data has occurred. When does the GDPR 72-hour notification clock start?

A: **3pm Monday** — when the organisation (through its security team, acting on behalf of the controller) has a reasonable degree of certainty that a personal data breach has occurred. The notification is due by **3pm Thursday**.

**Pattern 3: Evidence preservation vs recovery**

Q: During a ransomware incident, the business is demanding immediate restoration of production systems. The security team wants to preserve forensic evidence before rebuilding. Who should make this decision and based on what criteria?

A: **The CISO (or equivalent executive)** should make this decision, balancing: business impact of continued downtime vs the value of forensic evidence for understanding the breach, regulatory compliance, insurance claims, and potential litigation. This is an executive judgment — not a technical decision.

**Pattern 4: Post-incident review timing**

Q: Following the successful remediation of a major security incident, when should the post-incident review be conducted?

A: **As soon as practical after containment** — typically within 2 weeks while the incident is still fresh. Not immediately during the active response (team is focused on containment); not deferred for months (memory fades; improvement opportunities are lost).

**Pattern 5: Incident response vs incident handling**

Q: What is the PRIMARY purpose of the post-incident review?

A: **Improve future incident response capability** — identify what went well, what failed, and what improvements will reduce the risk and impact of future incidents. Not: assign blame; not: satisfy regulatory requirements; not: document the incident.

---

## Common Mistakes in Domain 4

**1. Treating incident response as purely a technical function.**
Domain 4 tests executive judgment in incident management — communication, regulatory compliance, resource decisions, and business impact management. Technical investigation is important but is only one component.

**2. Notification too early or too late.**
Early notification (before scope is confirmed) spreads inaccurate information. Late notification (after the 72-hour GDPR window) creates regulatory liability. CISM answers on notification timing balance these considerations.

**3. Forgetting regulatory obligations.**
GDPR, PCI DSS, and sector-specific reporting obligations must be known before the incident and built into the IRP. CISM questions frequently test whether candidates know when regulatory notification is required.

**4. Confusing eradication with recovery.**
Eradication (removing the threat) must be complete before recovery (restoring systems). Premature recovery before complete eradication leads to reinfection.

**5. Post-incident review deprioritised.**
Under time pressure (team is exhausted; business wants to return to normal), post-incident reviews are deferred or cancelled. CISM consistently emphasises that the post-incident review is essential — not optional — for programme improvement.

---

## GUARDIAN's Take

Domain 4 tests something that is genuinely difficult to learn from a textbook alone: the judgment to manage a crisis under pressure. The decisions that arise during a significant security incident — whether to shut down operations; whether to pay a ransom; when to notify regulators and what to say; how to communicate to the board at midnight — are not answerable from checklists alone.

What the CISM exam tests is whether you understand the framework within which those decisions are made: the priorities (contain before eradicate; eradicate before recover); the obligations (regulatory notification windows; evidence preservation); the stakeholders (who needs what information when); and the governance (who makes which decisions at which severity level).

The CISO who walks into a major incident with a well-prepared IRT, a practised communication protocol, a clear regulatory notification process, and a rehearsed decision-making framework has a fundamentally different experience than one who improvises. Domain 4 rewards the preparation that makes that difference.

Prepare before the incident. Govern during it. Learn from it after.

---
*Module: Module 12 — CISM Certification | Guardian Curriculum*
