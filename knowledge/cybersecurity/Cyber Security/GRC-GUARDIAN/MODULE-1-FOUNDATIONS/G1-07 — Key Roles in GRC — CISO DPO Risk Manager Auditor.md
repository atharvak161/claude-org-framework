---
tags: [guardian, grc, module-1, foundations, roles, ciso, dpo, risk-manager, auditor]
module: 1
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: beginner
date: 2026-04-15
guardian-refs: ["G1-02 — Governance Explained", "G1-05 — The Three Lines of Defence Model", "G1-06 — Information Security vs Cybersecurity vs GRC", "G5-06 — The Role of the DPO", "G10-08 — The Auditor Mindset", "G14-07 — Career Pathways in GRC"]
---

# G1-07 — Key Roles in GRC — CISO, DPO, Risk Manager, Auditor

> [!abstract] What This Note Covers
> By the end of this note, you will understand the four most important roles in a GRC function — CISO, DPO, Risk Manager, and Internal Auditor — including what each role does, what authority and independence they need, how they relate to each other, and what good and bad looks like in each.

---

## Why This Exists

GRC is not a system or a framework — it is a set of human disciplines carried out by people with specific mandates, specific skills, and specific relationships to the rest of the organisation. The same framework implemented by the wrong person in the wrong reporting structure will fail. The same standard pursued by the right person with genuine board support will succeed.

Understanding who does what — and why — is foundational to building effective GRC programmes and to passing the management-level certifications that test these concepts. CISM, for example, is almost entirely about the CISO role: how to exercise it, how to position it, and how to make it effective.

More practically: if you are building a career in GRC, you need to understand how your role relates to the roles around you. Where does your mandate start and stop? Who do you report to, and why? Whose independence are you protecting, and whose are you dependent on?

---

## Role 1: The CISO — Chief Information Security Officer

### What the Role Is

The **CISO** is the most senior executive responsible for the organisation's information security programme. They are the person ultimately accountable — below the board — for the confidentiality, integrity, and availability of the organisation's information assets.

The CISO role has evolved dramatically. Twenty years ago, it was largely a technical role — the most senior person in IT security. Today, it is a strategic leadership role that requires as much board-room fluency as technical credibility.

A modern CISO operates across three planes simultaneously:

| Plane | Activities |
|---|---|
| **Strategic** | Setting the security vision and 3–5 year strategy; aligning security to business objectives; board and executive reporting; budget ownership |
| **Governance** | Owning the ISMS; setting risk appetite (in partnership with the board); overseeing compliance programmes; managing regulatory relationships |
| **Operational** | Overseeing incident response; reviewing major security decisions; directing the security team; managing third-party security assurance |

### Where the CISO Sits in the Organisation

This is one of the most debated questions in information security governance. Options and their implications:

| Reporting line | Implication |
|---|---|
| Reports to **CTO or CIO** | Common, but creates conflict of interest — security needs often slow technology delivery. Security may be deprioritised when budgets are tight. |
| Reports to **CEO** | Best practice for independence. Security has a direct voice at the executive table. Not dependent on technology leadership's priorities. |
| Reports to **CFO or COO** | Uncommon. Can work if the executive is genuinely engaged. Risk: security seen as a cost function rather than a strategic capability. |
| Reports to **General Counsel / Legal** | Increasingly common, especially in regulated sectors. Positions security as a risk and compliance function. Can limit technical credibility. |
| Reports directly to the **Board** | Rare outside financial services. Provides maximum independence. Used in highly regulated environments or post-incident remediation. |

Best practice, endorsed by CISM, CISSP, and regulators including the FCA: the CISO should have a direct reporting line to the CEO or board, with a dotted line to the CIO or CTO for operational coordination. The key is that the CISO can escalate concerns directly to the governing body without being filtered through a technology executive with competing priorities.

### What a CISO Actually Does Day-to-Day

- **Reporting to the board**: Translating technical risk into business language. "We have 47 unpatched critical vulnerabilities" becomes "We have identified critical weaknesses that, if exploited, could result in a data breach affecting 2 million customers and potential GDPR fines of up to £17 million. Here is our remediation plan and timeline."
- **Managing the security budget**: Making the case for investment, prioritising spend against risk, justifying the return on security investment
- **Stakeholder management**: Navigating the tension between security requirements and business speed; building relationships with legal, HR, finance, and operations so that security is seen as an enabler, not a blocker
- **Regulatory engagement**: Managing relationships with regulators (ICO, FCA, NIS authority), responding to enquiries, preparing for regulatory audits
- **Incident management**: Leading the organisation's response to significant security incidents; making real-time decisions under pressure; managing communications to board, regulators, customers, and press
- **Team leadership**: Building, developing, and retaining a security team; managing the balance between in-house capability and managed service providers

### What Good Looks Like

A good CISO is credible in both directions: upward (to the board, speaking business risk language) and downward (to the technical team, understanding what is actually happening in the environment). They have genuine authority — not just a title — and they use it to make things happen, not just to produce reports. They are visible to the organisation. They are trusted by the business, not feared or avoided.

### What Bad Looks Like

A CISO who produces beautiful slide decks but whose team is firefighting daily without strategic direction. A CISO who is technically brilliant but loses the board's confidence because they cannot communicate risk in business terms. A CISO who is a political appointment with no real authority and whose recommendations are routinely ignored. A CISO who has "CISO" in their title but whose actual role is IT Manager with an inflated job title — not uncommon in smaller organisations.

---

## Role 2: The DPO — Data Protection Officer

### What the Role Is

The **DPO (Data Protection Officer)** is a formally designated role required under GDPR for certain categories of organisation. Their function is to ensure the organisation processes personal data lawfully, transparently, and in accordance with data subjects' rights.

Unlike the CISO, the DPO's independence is legally mandated. Article 38 of GDPR states that the DPO must not receive instructions regarding the exercise of their tasks — they report directly to the highest management level and cannot be dismissed or penalised for performing their role. This independence is structural, not optional.

### Who Must Have a DPO

Under GDPR (Article 37), a DPO is mandatory for:
1. Public authorities and bodies (regardless of data volume)
2. Organisations that carry out large-scale, regular, and systematic monitoring of individuals (e.g. behavioural advertising, large-scale CCTV)
3. Organisations that process special category data (health, biometric, criminal records) on a large scale

Even organisations not legally required to appoint a DPO often do so voluntarily — as a signal of data protection maturity and because regulators look favourably upon it.

### What the DPO Does

| Activity | Description |
|---|---|
| **Advising** | Advising the organisation and its staff on data protection obligations |
| **Monitoring compliance** | Monitoring compliance with GDPR and the organisation's own data protection policies |
| **DPIA oversight** | Advising on Data Protection Impact Assessments (DPIAs) for high-risk processing activities |
| **Regulatory liaison** | Acting as the primary point of contact with the supervisory authority (ICO in the UK) |
| **Training** | Ensuring staff receive appropriate data protection training |
| **Data subject requests** | Overseeing the handling of data subject requests (right of access, erasure, etc.) |

### Key Distinction: Advisor, Not Decision-Maker

The DPO does not make data protection decisions — they advise on them. The decision-maker is the data controller (the organisation). If the organisation chooses to proceed with a processing activity that the DPO has advised carries GDPR risk, the DPO must document their advice and the organisation's decision. This distinction matters enormously — the DPO is not personally liable for the organisation's compliance failures, provided they discharged their advisory function properly.

### The DPO and the CISO: How They Interact

Both roles care about protecting personal data, but from different angles:

- The **CISO** focuses on *security* of personal data — confidentiality, integrity, availability, technical and organisational controls
- The **DPO** focuses on *lawfulness* of personal data processing — legal basis, data minimisation, retention, data subject rights, accountability

They must work closely together — a data breach, for example, requires both roles: the CISO to manage the technical response and the DPO to manage the regulatory notification and data subject communication. But they should not be the same person in organisations with significant data processing activities, as the roles carry different (and sometimes conflicting) priorities.

---

## Role 3: The Risk Manager

### What the Role Is

The **Risk Manager** (sometimes called the Information Security Risk Manager, IT Risk Manager, or Enterprise Risk Manager depending on scope) is responsible for designing, operating, and maintaining the organisation's risk management framework. In the three lines model, the Risk Manager typically sits in the **second line** — providing oversight and challenge without owning the risks directly.

### What the Risk Manager Does

| Activity | Description |
|---|---|
| **Framework design** | Designing the risk methodology — how risks are identified, scored, treated, and escalated |
| **Risk register management** | Maintaining the risk register as a live, accurate reflection of the organisation's risk landscape |
| **Risk facilitation** | Running risk assessment workshops with business units; helping first-line risk owners articulate and assess their risks |
| **Aggregation and reporting** | Consolidating individual risk entries into an organisation-wide risk picture; reporting to the CISO, Security Committee, and board |
| **Risk appetite monitoring** | Tracking whether residual risks are within the agreed risk appetite; escalating breaches |
| **Risk treatment oversight** | Monitoring the progress of risk treatment plans; chasing overdue actions |
| **Emerging risk identification** | Scanning the external environment for new threats and regulatory changes that create new risks |

### The Risk Manager vs the Risk Owner

This distinction confuses many candidates. They are not the same:

- The **Risk Owner** is the business unit manager accountable for a specific risk — typically a first-line role. They own the risk, own the treatment plan, and are accountable for residual risk within their area.
- The **Risk Manager** designs the system within which risk owners operate, facilitates the process, and provides oversight. They do not own individual risks.

If the Risk Manager owns all the risks, the first line has been bypassed and the second line has collapsed into the first. This is a governance failure.

### What Good Looks Like

A Risk Manager who is trusted by business units — seen as a partner in thinking through risk, not a compliance police officer. One who translates technical risks into business language and business risks into assessable, manageable entries. One who keeps the risk register genuinely current and challenges risk owners who are not taking treatment seriously. One who gives the board a risk picture they can actually use to make decisions.

### What Bad Looks Like

A Risk Register that is a static document updated annually and owned by one person in IT security. Risks described in technical jargon that business owners cannot understand. Treatment plans that are perennially "in progress" with no real accountability. A risk reporting process that sanitises bad news before it reaches the board.

---

## Role 4: The Internal Auditor (Information Security)

### What the Role Is

The **Internal Auditor** provides independent, objective assurance to the board that the organisation's risk management, control, and governance processes are operating effectively. In the three lines model, internal audit is the **third line** — it must be genuinely independent of the first and second lines to have value.

In information security, the internal auditor assesses whether:
- Security controls exist and are operating as intended
- The risk management framework is functioning effectively
- The organisation is complying with applicable standards, regulations, and policies
- The second line (CISO, Risk Manager, Compliance) is providing genuine oversight

### Reporting Structure

Internal audit must report to the **Audit Committee** of the board — not to the CISO, not to the CEO, not to the CFO. This independence is the source of its value. An internal audit function that reports to the CISO it is auditing is structurally compromised.

The Chief Audit Executive (CAE) has a direct line to the Audit Committee Chair and can escalate concerns — including concerns about the CISO — without going through management. This is a feature, not a bug.

### What the Internal Auditor Does

| Activity | Description |
|---|---|
| **Audit planning** | Developing a risk-based annual audit plan that prioritises the highest-risk areas |
| **Audit execution** | Conducting fieldwork — interviewing staff, reviewing documentation, testing controls, examining evidence |
| **Finding classification** | Categorising issues as observations, minor nonconformities, or major nonconformities |
| **Report writing** | Producing audit reports with findings, root cause analysis, and recommendations |
| **Follow-up** | Tracking whether management has implemented agreed corrective actions |
| **Advisory work** | Providing consulting input on new projects, system implementations, or policy development — without compromising independence |

### The Auditor Mindset

The internal auditor approaches their work with **professional scepticism** — they do not assume controls are working because management says they are. They verify through evidence. They ask "how do you know?" and "can you show me?" rather than accepting assertions.

This does not mean the auditor is adversarial. The best internal auditors are trusted advisors who are genuinely trying to help the organisation improve. But their credibility depends on their willingness to report what they find, regardless of whether it is convenient for management.

### Internal vs External Auditor: Key Distinction

| Dimension | Internal Auditor | External Auditor / Certification Body |
|---|---|---|
| Employed by | The organisation | Independent third party |
| Reports to | Audit Committee (board) | Client organisation + standard body |
| Purpose | Continuous improvement and assurance | Certification / regulatory compliance |
| Frequency | Ongoing (risk-based programme) | Annual / surveillance cycle |
| Output | Internal audit reports, management letter | Certificate, audit opinion, report to regulator |
| Independence | Independent of management, employed by organisation | Fully independent of the organisation |

For ISO 27001: the organisation must conduct **internal audits** (third line activity) before the external certification body conducts its Stage 2 audit. Internal audit findings should be addressed before the external audit. Finding that internal audit missed something is a more serious failure than finding it yourself first.

---

## How the Four Roles Interact

In a well-functioning GRC structure, these four roles work as a system:

```
BOARD / AUDIT COMMITTEE
        ↑ receives assurance from all four roles
        │
CISO ←──→ DPO ←──→ RISK MANAGER
  │         │           │
  └────── coordinate on privacy, risk, and security
          │
    INTERNAL AUDITOR
  (audits all three of the above)
```

- The **CISO** and **DPO** collaborate on data breach response, DPIA review, and vendor assessment — but maintain distinct mandates
- The **CISO** and **Risk Manager** work together on the risk register — the CISO providing security expertise, the Risk Manager providing framework rigour
- The **Internal Auditor** audits the CISO's programme, the DPO's compliance activities, and the Risk Manager's framework — reporting findings to the board that management cannot suppress
- The **Board** holds all four accountable and acts on what it hears

When this system works, problems are found and fixed before they cause harm. When it breaks down — through role confusion, independence failures, or board disengagement — incidents happen that could have been prevented.

---

## The Details That Matter

### Conflicts of Interest to Watch For

| Conflict | Risk | Resolution |
|---|---|---|
| CISO also acts as DPO | GDPR Article 38 may be violated; security priorities may override data protection requirements | Separate the roles or use an external DPO |
| Risk Manager also owns first-line controls | Second-line independence is lost; Risk Manager marks their own homework | Separate operational control ownership from risk oversight |
| Internal Auditor reports to CISO | Third-line independence is lost; audit findings may be suppressed | Audit Committee reporting line is non-negotiable |
| DPO also manages compliance | Can work if carefully structured; risk that compliance obligations crowd out data protection advisory role | Define clear role boundaries in writing |

### Qualifications by Role

| Role | Common qualifications |
|---|---|
| CISO | CISM, CISSP, ISO 27001 LA, MBA (security-focused), CEH (older generation) |
| DPO | CIPP/E, BCS Certificate in Data Protection, CIPM, legal qualifications |
| Risk Manager | CRISC, ISO 31000 practitioner, Prince2/MSP (project risk), IRM qualifications |
| Internal Auditor | CISA (Certified Information Systems Auditor), CIA (Certified Internal Auditor), ISO 27001 LA |

---

## Common Mistakes and Failures

**1. One person wearing too many hats.**
In small organisations, one person may be CISO, DPO, Risk Manager, and internal auditor simultaneously. This is structurally broken — the third line cannot audit the second line if they are the same person. Acknowledge the limitation, document it, and compensate with external assurance.

**2. CISO without budget authority.**
A CISO who must beg the IT Director for budget on a case-by-case basis is not a CISO — they are a senior analyst with a senior title. Real authority requires budget ownership and the ability to prioritise spend.

**3. DPO who is just a records keeper.**
DPOs who spend all their time managing data subject access requests and maintaining Records of Processing Activities (RoPA), with no involvement in new processing decisions, DPIAs, or regulatory engagement. This is compliance theatre — the role exists in name only.

**4. Risk Manager who cannot say no.**
Risk Managers who accept every risk owner's self-assessment without challenge. If every risk in the register is rated Low, either the organisation has no significant risks (unlikely) or the Risk Manager is not doing their job.

**5. Internal audit with a rubber stamp reputation.**
An audit function that finds nothing material, raises only minor observations, and is known internally to be toothless. This is worse than no audit function — it provides false assurance to the board.

---

## Exam Angle

**CISM:**
- The entire qualification is structured around the CISO role. Domain 1 (Governance), Domain 2 (Risk Management), Domain 3 (Security Programme), and Domain 4 (Incident Management) all test CISO-level thinking.
- Key CISM principle: the CISO's primary accountability is to align security with business objectives. Security for its own sake is not the goal.

**ISO 27001 Lead Auditor:**
- The auditor role is examined in depth. Candidates must understand: audit principles (integrity, independence, confidentiality, objectivity), audit evidence, audit criteria, audit findings, and how to conduct interviews and document reviews.
- The distinction between internal and external audit is examinable. Understand when each applies and what each produces.

**CRISC:**
- The Risk Manager role maps directly to CRISC's domains. Domain 1 (IT Risk Identification) and Domain 2 (IT Risk Assessment) describe the Risk Manager's core activities.
- CRISC heavily tests the risk ownership concept — the Risk Manager facilitates; business unit owners are accountable.

**CISSP:**
- Domain 1 covers roles and responsibilities, governance structures, and the concept of due care vs due diligence.
- Understanding the CISO's strategic role and reporting structure is tested in scenario-format questions.

---

## GUARDIAN's Take

After building and inhabiting all of these roles at various points in my career, here is what I know to be true about each:

**The CISO role is fundamentally a communication role.** The best CISOs I have seen are not necessarily the best technologists — they are the best translators. They can take the reality of a threat landscape and make a board genuinely understand why it matters to them personally, as directors. Without that translation, all the technical excellence in the world gets no budget and no authority.

**The DPO role is the loneliest role in GRC.** Legally independent, which means organisationally isolated. Often advising against things the business wants to do, which makes them unpopular. The best DPOs I have worked with combine legal precision with genuine commercial pragmatism — they find ways to enable the business to do what it wants, within the law, rather than just saying no.

**The Risk Manager lives or dies by the quality of their relationships.** A Risk Manager who is seen as the person who fills in spreadsheets gets ignored. A Risk Manager who is genuinely trusted by business unit leaders — who sits down with them, understands their world, and helps them think through their risks — gets listened to when it matters.

**The Internal Auditor's greatest asset is their reputation for independence.** The moment the organisation believes that internal audit can be managed, delayed, or softened, its value evaporates. Guard that independence ferociously. Report what you find. Recommend what is right. Let the politics be someone else's problem — your job is to give the board an accurate picture, and everything else follows from that.

---
*Module: Module 1 — Foundations | Guardian Curriculum*
