---
tags: [guardian, grc, module-4, iso27002, people-controls, hr-security, awareness, training, screening, offboarding]
module: 4
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G3-06 — ISO 27001 Clause 7 — Support", "G3-10 — Annex A Controls — Complete Reference 2022", "G4-01 — Organisational Controls", "G4-03 — Physical Controls", "G4-04 — Technological Controls"]
---

# G4-02 — People Controls — HR Security, Awareness, Training

> [!abstract] What This Note Covers
> By the end of this note, you will understand the 8 people controls in ISO 27002:2022 Category 6 in depth — what each requires, how to implement them effectively, what good evidence looks like, and the human factors that make people controls the hardest category to get right in practice.

---

## Why This Exists

People are simultaneously the greatest asset and the greatest vulnerability in information security. Every technical control — every firewall, every encryption system, every access control — can be bypassed by a person who chooses to bypass it, is tricked into bypassing it, or has been inadequately prepared to support it. And many of the most damaging security incidents in history — from Edward Snowden to the NHS WannaCry impact — involved not technical control failures but failures of people management, awareness, or culture.

The 8 people controls in ISO 27002:2022 Category 6 address the entire human dimension of information security — from the moment a prospective employee is being considered for hire through to the moment they leave the organisation. They are not about treating people as threats (though insider threat is real). They are about creating the conditions in which people can be effective partners in security, rather than inadvertent or deliberate liabilities.

People controls are consistently the hardest category to implement well, because they require genuine culture change — not just policy compliance. A policy requiring security awareness training can be satisfied by an LMS completion record. Genuine security awareness that changes behaviour requires something much harder to manufacture: a security culture where people actually care.

---

## The 8 People Controls: Implementation Depth

### A.6.1 — Screening

**Purpose**: To ensure that individuals joining or changing roles in the organisation are suitable for the responsibilities they will undertake, by verifying that they are who they claim to be and do not have a history that creates unacceptable risk.

**What screening should cover:**

**Identity verification**: Confirming the candidate is who they claim to be. Minimum: passport or national ID verification. For high-security roles: more rigorous identity confirmation.

**Employment history verification**: Confirming that the candidate's stated employment history is accurate. Reference checks with previous employers (not just named referees — direct contact with HR departments where possible).

**Qualification verification**: Confirming that stated qualifications exist and were legitimately obtained. Particularly relevant for professional qualifications (legal, medical, financial, security certifications).

**Criminal record check (DBS in the UK)**: Required for roles involving vulnerable individuals (children, care settings). Discretionary for other roles — but advisable for roles with privileged system access, financial authority, or access to sensitive data.

**Credit check**: Relevant for roles with financial authority — a candidate under significant financial pressure may be at elevated insider threat risk. Subject to proportionality and data protection requirements.

**Right to work verification**: Legally required in the UK — employers must verify that employees have the right to work in the UK before employment begins.

**Proportionality requirement**: Screening must be proportionate to the role. A senior IT administrator with privileged access to all systems warrants more rigorous screening than a junior administrator with limited access. Over-screening can be discriminatory; under-screening creates risk.

**Ongoing screening**: For roles with particularly high trust (system administrators, financial controllers), periodic re-screening or continuous monitoring may be appropriate — particularly if there are indicators of elevated insider threat risk (financial distress, behavioural change, unusual access patterns).

**Legal constraints**: Screening activities are subject to employment law, GDPR (personal data processing), and anti-discrimination law. Screening must be justified, proportionate, and limited to relevant checks. Candidates must be informed of screening activities.

**What good evidence looks like:**
- HR policy specifying screening requirements by role category
- Completed screening records for each employee (type of check, date, outcome)
- Right-to-work check records
- Evidence of proportionality (more rigorous screening for higher-risk roles)

**Common failures:**
- Screening only at hire, not when roles change (a person promoted to a privileged role may never have been screened for that level of access)
- Screening of permanent staff but not contractors (contractors often have equivalent or greater access)
- No differentiated screening — same basic checks for all roles regardless of access level
- Records of screening not retained (GDPR requires personal data to be managed carefully, but retention of employment-related screening records is legitimate)

---

### A.6.2 — Terms and Conditions of Employment

**Purpose**: To ensure that employees and contractors formally acknowledge and accept their information security responsibilities as part of their engagement with the organisation.

**What employment terms must cover for information security:**

**Confidentiality obligations**: The employee must agree to keep organisational information confidential during and after employment. This should survive termination — particularly important for employees with access to trade secrets, client lists, or sensitive business information.

**Information security responsibilities**: The employment contract or associated documents (employee handbook, code of conduct) must describe what the employee is responsible for from a security perspective — following policies, reporting incidents, not sharing credentials, etc.

**Data protection obligations**: Under GDPR, employees who process personal data must understand their obligations. This should be referenced in employment terms and covered in training.

**Consequences of non-compliance**: The employment terms must make clear that security policy violations can result in disciplinary action up to and including dismissal. This is the basis for the disciplinary process (A.6.4).

**Post-employment restrictions**: Where appropriate (for senior roles or those with access to critical IP), non-compete or non-solicitation clauses alongside continuing confidentiality obligations.

**Implementation approach:**
- Standard employment contract includes a security obligations clause
- Employee handbook or equivalent provides the detailed security requirements
- Separate NDA for particularly sensitive roles or projects
- All contractors and third parties with system access sign equivalent agreements

**What good evidence looks like:**
- Employment contract template with security obligations clause
- Evidence that all employees have signed contracts (HR records)
- Employee handbook or security responsibility document
- NDA records for high-sensitivity roles or contractors

**Common failure:** The contract mentions confidentiality but does not specify information security responsibilities. Staff do not know that their contract requires them to follow security policies — they think security compliance is optional.

---

### A.6.3 — Information Security Awareness, Education, and Training

**Purpose**: To ensure all personnel are aware of information security threats, understand their responsibilities, and have the skills needed to fulfil those responsibilities.

This is one of the most important people controls — and one of the most commonly implemented poorly. The gap between compliance (completion rate) and effectiveness (behaviour change) is enormous in most organisations.

**Three levels of security learning (per ISO 27002):**

**Awareness**: The broadest level — all staff. Goal: ensure everyone understands what security is relevant to their role, what the key threats are, and what to do when they encounter a security issue. Awareness is delivered through: annual training, regular communications, phishing simulations, visible security culture from leadership.

**Education**: Role-specific knowledge for those with security responsibilities. Goal: ensure security team members, IT staff, and risk owners have the deeper knowledge their roles require. Delivered through: professional certifications (CISM, CRISC, CEH, ISO 27001 LA), vendor training, professional development programmes.

**Training**: Skill development for specific security tasks. Goal: ensure staff can actually perform required security activities — not just know they should. Delivered through: hands-on exercises, simulation environments, secure coding training for developers, incident response tabletop exercises.

**Minimum awareness programme requirements:**
- Annual mandatory security awareness training for all staff
- Content must be current (reflecting current threat landscape — not a static video from 3 years ago)
- Content must cover: the information security policy, staff responsibilities, key threats (phishing, social engineering, password security, data handling), incident reporting process
- Assessment of understanding (not just completion tracking)
- Completion records maintained

**Effectiveness measurement (the critical element most programmes miss):**
- Phishing simulation results (click rate, reporting rate, trend over time)
- Assessment scores from training completion
- Incident reporting rate (a proxy for security culture — staff who understand security report more)
- Security-related helpdesk call frequency (decreasing over time as awareness improves)

**Role-specific training requirements:**
- **All staff**: Annual general awareness training
- **IT Operations**: Technical security training, patch management, access control procedures
- **Developers**: Secure coding (OWASP Top 10, language-specific secure coding), SAST/DAST tools
- **Finance staff**: Fraud awareness, business email compromise, payment authorisation procedures
- **HR staff**: Data protection (GDPR), handling of sensitive personal data, screening procedures
- **Senior management**: Board-level security awareness, fiduciary responsibilities, incident escalation
- **Customer-facing staff**: Social engineering awareness, data handling in customer interactions

**Phishing simulations — best practice:**
- Conduct quarterly (minimum); monthly for high-risk organisations
- Use realistic, current lures — not obviously fake phishing emails that any trained user would catch
- Track: click rate, credential submission rate, reporting rate (the most important metric — did staff report the phishing attempt?)
- Provide immediate feedback to clickers — the moment they click is a teaching moment
- Track repeat clickers and provide targeted remedial training
- Report results to management with trend data

**What genuinely good awareness evidence looks like:**
- Training completion records showing 100% completion (with records of chasing and remediating non-completers)
- Assessment score records (not just "completed" but "demonstrated understanding")
- Phishing simulation records showing declining click rate over time
- Reporting rate trending upward (staff are recognising and reporting phishing)
- Training content updated in the last 12 months to reflect current threats

**Common failures:**
- Annual video training with a multiple-choice quiz where answers can be guessed
- 100% completion rate but 25% phishing click rate (completion ≠ effectiveness)
- Training content that has not been updated in 2+ years
- Senior management exempted from mandatory training
- Phishing simulations conducted but results never actioned (frequent clickers not given remedial training)
- Training covering what threats exist but not how to respond (staff know about phishing but don't know how to report it)

---

### A.6.4 — Disciplinary Process

**Purpose**: To ensure violations of information security policies and procedures are addressed through a consistent, proportionate formal process, creating a meaningful deterrent and ensuring accountability.

**What the disciplinary process must address:**
- Security policy violations (sharing credentials, bypassing controls, accessing unauthorised systems)
- Data protection failures (mishandling personal data, breaching data subject privacy)
- Acceptable use violations (accessing prohibited content, misusing systems)
- Reporting failures (failure to report known incidents or security concerns)
- Malicious acts (deliberate data theft, sabotage, fraud)

**Proportionality**: The disciplinary response must be proportionate to the violation. A first-time inadvertent violation warrants a verbal warning and remedial training. A deliberate, malicious act may warrant immediate termination. The policy must define the range of responses.

**Connection to employment law**: Disciplinary processes must follow applicable employment law. In the UK, this means following the ACAS Code of Practice on disciplinary procedures — investigation, formal meeting, right to appeal. Failure to follow correct procedure can make dismissal unfair even if the underlying violation is genuine.

**Documentation requirements:**
- Written disciplinary policy referencing security violations
- Evidence that staff are aware of the policy and consequences
- Records of disciplinary actions for security violations (anonymised in aggregate; detailed in personnel records)

**What good evidence looks like:**
- Disciplinary policy with specific reference to security violations and consequences
- Evidence of communication (staff acknowledgement, induction training reference)
- At least one example of disciplinary action for a security violation (proves the process is real, not theoretical)

**Common failure**: The disciplinary policy exists but security violations are never actually actioned through it. The policy is a deterrent only if violations are actually treated as violations. An organisation that allows repeated security policy violations without consequence has an ineffective disciplinary process regardless of what the policy says.

---

### A.6.5 — Responsibilities After Termination or Change of Employment

**Purpose**: To protect the organisation's information and assets after an employee or contractor departs, ensuring security obligations continue to be honoured and access is appropriately removed.

**Two dimensions:**

**Continuing obligations**: Security responsibilities that survive the employment relationship:
- Confidentiality obligations (typically survive indefinitely)
- Non-disclosure of intellectual property
- Non-solicitation of clients or colleagues (where contractually agreed)
- Obligation to return all assets
- Obligation not to retain or use organisational data

These must be embedded in employment contracts and NDAs, and must be specifically reminded at termination.

**Immediate access deprovisioning**: On termination, all access must be removed promptly:
- Logical access: IT system accounts, email, VPN, cloud services — disabled or deleted on departure date (same day for high-risk departures; within 24 hours as standard)
- Physical access: Access cards, keys, CCTV access, physical media — collected and deactivated
- Third-party access: Any accounts created with suppliers or partners using organisational credentials
- Personal device access: Remote wipe or access removal from personal devices enrolled in MDM

**The timing question**: For planned departures (resignation), access should be removed at the end of the last working day. For involuntary departures (dismissal, particularly those involving potential hostility), access should be removed simultaneously with or immediately before notification. An employee notified of dismissal who still has 30 minutes of system access before being escorted out is a significant insider threat risk.

**What good evidence looks like:**
- Off-boarding procedure and checklist covering both continuing obligations and access removal
- Signed exit acknowledgement confirming obligations understood
- Access deprovisioning records linked to departure dates (the gap between departure date and account deletion is auditable)
- Evidence that reminders of ongoing obligations are given at exit interview

**Common failures:**
- Accounts not deprovisioned promptly — former employees retaining access for weeks
- No formal exit interview or reminders of continuing obligations
- Physical access (door cards) returned but system access not deprovisioned
- Cloud service access overlooked (personal Microsoft accounts used for work data; SaaS tools accessed with work email but not centrally managed)

---

### A.6.6 — Confidentiality or Non-Disclosure Agreements

**Purpose**: To protect the organisation's confidential information through legally binding commitments from all individuals with access to it.

**Who needs NDAs:**
- All permanent employees (covered in employment contract)
- All contractors and temporary staff (separate NDA before access is granted)
- All third-party personnel with access to sensitive systems or data
- Visitors who may be exposed to sensitive information in secure areas
- Business partners who receive confidential business information

**NDA elements:**
- Definition of confidential information (broad enough to capture all relevant information)
- Obligations of the receiving party
- Exceptions (information that is publicly available, independently developed, or required to be disclosed by law)
- Duration of confidentiality obligation (often "indefinitely" for trade secrets and personal data)
- Remedies for breach
- Jurisdiction and governing law

**NDA review cycle**: NDAs should be reviewed periodically to ensure they remain legally appropriate, particularly following changes in applicable law (post-Brexit UK law changes; GDPR requirements).

**What good evidence looks like:**
- NDA template that is legally reviewed and current
- Records of NDAs signed by all relevant parties (staff, contractors, third parties)
- Process for NDA renewal when individuals change roles or extend engagement

---

### A.6.7 — Remote Working

**Purpose**: To protect information accessed, processed, or stored outside the organisation's physical premises, ensuring that remote working does not create unacceptable security risks.

**Remote working security requirements:**

**Device security**:
- Approved devices only (organisation-managed devices preferred; BYOD with MDM enrollment if permitted)
- Full disk encryption mandatory
- Endpoint protection (AV/EDR) installed and current
- Screen lock with short timeout
- No unattended access to logged-in sessions in public places

**Network security**:
- VPN required for access to sensitive systems (not just for convenience)
- Public Wi-Fi usage restricted or prohibited for sensitive work — or VPN mandatory when on public Wi-Fi
- Home network security guidance (router security, separation from IoT devices)

**Physical security**:
- No shoulder surfing — privacy screens for work in public
- Sensitive documents must not be left unattended
- Clear desk requirement applies to home working environment
- Printing of sensitive documents at home — only if secure disposal is available

**Access controls**:
- MFA mandatory for remote access (all remote access, not just VPN)
- Session timeouts for remote sessions

**Data handling**:
- No sensitive data on personal cloud storage (personal Dropbox, iCloud, Google Drive)
- No printing of sensitive documents unless absolutely necessary
- Secure disposal of any printed materials

**What good evidence looks like:**
- Remote working policy covering all the above areas
- MDM enrolment records (devices enrolled in management)
- VPN usage logs confirming remote workers are using VPN
- Evidence of device encryption (MDM compliance reports or equivalent)

**Common failures (particularly post-2020 hybrid working explosion):**
- Remote working policy written for pre-COVID occasional remote working, never updated for widespread hybrid
- Employees using personal devices for work without any security requirements
- VPN optional rather than mandatory
- No visibility of remote worker device security status

---

### A.6.8 — Information Security Event Reporting

**Purpose**: To ensure information security events and weaknesses are identified and reported promptly, enabling rapid response and preventing escalation.

**What must be reported:**
- Any suspected security incident (phishing email received, suspicious system behaviour, unusual access requests)
- Any actual security incident (data breach, ransomware infection, successful phishing)
- Any observed security weakness (unpatched system, unlocked sensitive area, clear desk violation)
- Any near-miss (a situation where a security incident almost occurred but was prevented)

**Reporting channels:**
- Easy to use — if reporting is complex, staff won't do it. A single email address, a helpdesk ticket category, a dedicated app, or a phone line.
- Well-communicated — staff must know how to report (part of awareness training)
- Available 24/7 for critical incidents — not just business hours

**Creating a reporting culture:**
- No blame for honest reporting — staff who report incidents should be thanked, not punished
- Demonstrate that reports lead to action — if staff see their reports are investigated and acted on, they report more
- Include near-miss reporting — incidents that didn't happen but almost did are valuable intelligence
- Leadership modelling — when leaders report incidents they encounter, it signals that reporting is expected and valued

**Incident response connection**: Reports from staff are the primary input to the incident management process (A.5.24–A.5.26). The quality of the response to those reports determines whether staff continue to report.

**What good evidence looks like:**
- Documented reporting channel (email address, helpdesk category, etc.)
- Evidence that the channel is communicated in training
- Incident log showing reports received and actioned
- Near-miss reporting records (evidence that near-misses are reported and acted on)
- Evidence of response to staff reports (even if "investigated and found to be non-incident")

**Common failures:**
- Reporting channel exists but is not well-communicated — staff don't know how to report
- Staff who report incidents are questioned or blamed, deterring future reporting
- Reports received but not consistently actioned — staff lose confidence in the process
- No near-miss reporting (only actual incidents logged)

---

## People Controls and Insider Threat

The 8 people controls together form the primary defence against insider threat — both the unintentional insider (the employee who clicks a phishing link, loses a laptop, or accidentally emails the wrong person) and the malicious insider (the disgruntled employee, the recruited spy, or the financially compromised contractor).

**The insider threat risk profile:**
- Most insider incidents are unintentional — inadequate training, unclear policies, rushed decisions
- Malicious insider incidents are rarer but significantly more damaging
- Indicators of elevated insider threat: financial distress, unusual access patterns, conflict with management, recent disciplinary action, access to sensitive information combined with upcoming departure

**People controls as the primary insider threat mitigation:**

| Insider threat risk | Primary mitigating control |
|---|---|
| Unintentional data loss | A.6.3 (awareness training), A.6.2 (clear obligations) |
| Phishing success | A.6.3 (phishing simulations), A.6.8 (reporting culture) |
| Credential sharing | A.6.3 (awareness), A.6.2 (obligations), A.6.4 (disciplinary consequences) |
| Data theft before departure | A.6.5 (termination procedures), A.6.1 (screening — pre-employment character check) |
| Rogue admin activity | A.5.3 (segregation of duties), A.8.2 (privileged access controls) + A.6.1 screening |
| Post-departure access misuse | A.6.5 (prompt deprovisioning), A.6.2 and A.6.6 (ongoing obligations) |

People controls do not eliminate insider threat — but they significantly reduce both unintentional incidents (through awareness and clear expectations) and malicious incidents (through screening, ongoing obligations, and prompt access removal).

---

## The Security Culture Dimension

People controls in ISO 27002 are necessary but insufficient on their own. The controls provide structure — but structure without culture is brittle. Staff who comply with security policies only because they fear punishment (or audit) are not genuinely secure: they will find workarounds, fail to report incidents, and treat security as an obstacle to be minimised.

Genuine security culture requires something that no policy or control can mandate: **leadership behaviour**. When the CEO uses MFA, clears their desk, and reports phishing attempts — when they make it visible that they personally follow the security policies — the message to the entire organisation is clear and powerful. When senior leaders exempt themselves from security requirements or visibly treat security as an inconvenience, that message is equally powerful — and enormously destructive.

The CISO's hardest job in people controls is not writing the awareness training or maintaining the off-boarding checklist. It is shaping the security culture through influence on leadership behaviour, consistent communication of expectations, and building a reporting environment where honesty about security failures is rewarded rather than punished.

No checklist in ISO 27002 addresses this directly. But every one of the 8 people controls works better — or worse — depending on the culture in which it operates.

---

## Common Audit Findings in Category 6

| Control | Most common finding |
|---|---|
| A.6.1 | Screening not differentiated by role risk; contractors not screened |
| A.6.2 | Employment contracts reference confidentiality but not specific security responsibilities |
| A.6.3 | Training completion tracked but no effectiveness measurement; content outdated; senior management exempted |
| A.6.4 | Disciplinary policy exists but has never been applied to a security violation |
| A.6.5 | Access deprovisioning delayed (>24 hours gap between departure and account deletion) |
| A.6.6 | Contractors working without NDAs; NDAs not reviewed in 3+ years |
| A.6.7 | Remote working policy not updated since pre-COVID hybrid working rollout |
| A.6.8 | Reporting channel not communicated in training; no near-miss reporting |

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Category 6 controls are tested through staff interviews — the best evidence of people control effectiveness comes not from documentation but from asking staff: "What would you do if you received a suspicious email?" "How do you report a security incident?" "What does your employment contract say about security?"
- A.6.3 (awareness) is almost always sampled in Stage 2 — auditors will request training records AND phishing simulation results (not just one)
- A.6.5 (termination) is tested by requesting access deprovisioning records and comparing departure dates to account deletion dates

**CISM:**
- Domain 3 (Security Programme) covers the design and management of security awareness programmes
- Domain 4 (Incident Management) covers the reporting culture aspects of A.6.8

**CISSP:**
- Domain 1 (Security and Risk Management) covers security awareness and training requirements
- Domain 2 (Asset Security) covers data handling requirements that people controls support

---

## GUARDIAN's Take

People controls occupy a unique position in information security — they are simultaneously the most important and the most neglected category of control. Technical controls are visible, measurable, and deployable by the security team. People controls require the cooperation of HR, line managers, executive sponsors, and ultimately every individual in the organisation. They cannot be deployed — they must be cultivated.

The organisations I have seen with the strongest security postures share one characteristic that goes beyond their technical controls: they have a genuine reporting culture. Staff report incidents and near-misses without fear. Near-misses are thanked and investigated, not punished. The incident log captures the near-miss that prevented a real breach — not just the actual breaches that happened anyway.

This reporting culture does not emerge from a policy. It emerges from leadership behaviour over time — from a CISO who thanks the junior analyst who reported the suspicious email, from a CEO who forwards the phishing email to IT rather than clicking it and stays quiet about it, from a management team that reviews incident reports without searching for someone to blame.

Build the culture. The controls will follow. Without the culture, the controls will be satisfied on paper and undermined in practice.

---
*Module: Module 4 — ISO 27002 Controls | Guardian Curriculum*
