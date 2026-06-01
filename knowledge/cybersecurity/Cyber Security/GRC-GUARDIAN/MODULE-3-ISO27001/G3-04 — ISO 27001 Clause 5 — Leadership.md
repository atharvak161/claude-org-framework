---
tags: [guardian, grc, module-3, iso27001, clause-5, leadership, top-management, policy, roles-responsibilities]
module: 3
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G1-02 — Governance Explained", "G1-07 — Key Roles in GRC", "G3-02 — The ISMS", "G3-03 — ISO 27001 Clause 4", "G3-05 — ISO 27001 Clause 6", "G3-16 — Management Review"]
---

# G3-04 — ISO 27001 Clause 5 — Leadership

> [!abstract] What This Note Covers
> By the end of this note, you will understand every requirement of ISO 27001 Clause 5 — what top management must do to demonstrate genuine leadership and commitment to the ISMS, what the information security policy must contain, and how roles and responsibilities are defined and assigned — including what auditors look for and what genuine leadership looks like vs performative compliance.

---

## Why This Exists

Clause 5 is where ISO 27001 makes its most fundamental demand: that the people at the top of the organisation are genuinely engaged with information security management — not as a compliance exercise delegated to the IT department, but as a strategic priority that they actively lead, resource, and oversee.

This demand is not arbitrary. Decades of security research and incident analysis consistently show that the single strongest predictor of an organisation's security posture is the attitude of its leadership toward security. Organisations where the board and executive team visibly prioritise security — where the CISO has genuine authority, where security investment is protected in budget cycles, where security expectations are communicated from the top — consistently outperform organisations where security is seen as an IT problem.

The standard recognises this. Clause 5 cannot be satisfied by a signed policy document and a five-minute slot on the board agenda once a year. It requires evidence that top management genuinely leads the ISMS — through their actions, their decisions, their communications, and their engagement with risk.

Auditors know the difference. A Stage 2 audit that includes an interview with the CEO or CFO will quickly reveal whether leadership is genuinely engaged or whether the ISMS is running without executive support.

---

## Clause 5 Overview: Three Requirements

| Sub-clause | Title | Core question |
|---|---|---|
| **5.1** | Leadership and commitment | What must top management actively do to lead the ISMS? |
| **5.2** | Policy | What must the information security policy contain and do? |
| **5.3** | Organisational roles, responsibilities and authorities | Who is responsible for what, and how is this communicated? |

---

## Clause 5.1 — Leadership and Commitment

### The Requirement

Clause 5.1 lists specific actions that top management must take. The word "shall" applies throughout — these are mandatory requirements, not recommendations.

Top management shall demonstrate leadership and commitment with respect to the ISMS by:

**a) Ensuring the information security policy and objectives are established and are compatible with the strategic direction of the organisation**

The information security policy must not exist in a vacuum. It must reflect and support the organisation's business strategy. A technology company with a growth strategy of rapid market expansion has different security objectives to a regulated financial services firm with a strategy of operational stability and regulatory compliance. The policy and objectives must be calibrated to the actual strategic direction.

*What this looks like in practice*: The CISO presents the proposed information security objectives to the executive team and board. They discuss alignment with business strategy. The board approves the objectives. This is documented in management review minutes or a board resolution.

*What it does not look like*: A generic information security policy template approved by email, with security objectives that could apply to any company anywhere.

**b) Ensuring the integration of the ISMS requirements into the organisation's processes**

The ISMS must not run parallel to the business — it must be woven into how the business operates. Security considerations must be embedded in procurement decisions, project management, product development, HR processes, and change management.

*What this looks like in practice*: A project management methodology that requires security risk assessment at project initiation. A procurement process that includes supplier security assessment as a mandatory step. An HR onboarding process that includes security training before system access is granted.

*What it does not look like*: A security programme that runs alongside the business, consulted only after decisions are made, when it is too late to influence them.

**c) Ensuring that the resources needed for the ISMS are available**

Security requires investment — budget for tooling, staffing, training, testing, and consultancy. Top management must actively ensure these resources are available, not just theoretically approved.

*What this looks like in practice*: An annual security budget that is protected (not automatically cut in difficult financial periods), justified against risk appetite, and reviewed by the board. Staff roles with security responsibilities that are appropriately resourced. External expertise engaged when internal capability is insufficient.

*What it does not look like*: A CISO who must justify every security expenditure from scratch in competition with business priorities. A security team of one person trying to manage all ISMS processes while also handling IT support tickets.

**d) Communicating the importance of effective information security management and of conforming to the ISMS requirements**

Security culture is built from the top. When senior leaders visibly take security seriously — when the CEO references security in all-staff communications, when the CFO asks security questions in investment reviews, when the board receives and acts on security risk reports — the message cascades down the organisation.

*What this looks like in practice*: The CEO's annual all-staff communication includes a section on security awareness. Security is mentioned in town halls. Leaders are seen to follow security policies themselves (not exempting themselves from MFA or data handling requirements). The board references security in strategic planning discussions.

*What it does not look like*: A "security awareness week" poster campaign while senior leaders routinely share passwords, bypass MFA, or access systems on unmanaged personal devices.

**e) Ensuring the ISMS achieves its intended outcomes**

Top management is accountable for whether the ISMS actually works — whether it achieves its objectives, manages risks to within the risk appetite, and delivers the security outcomes the organisation needs.

*What this looks like in practice*: Regular management review meetings (see Clause 9.3, G3-16) where security metrics are reviewed, risk posture is assessed, and performance against objectives is evaluated. Executive decisions to invest in additional controls when the ISMS is not achieving its intended outcomes.

*What it does not look like*: A management review that is a rubber-stamp exercise, where a pre-prepared slide deck is presented and the CEO signs the minutes without meaningful engagement.

**f) Directing persons to contribute to the effectiveness of the ISMS**

Leadership must actively direct staff to participate in and support the ISMS — not just mandate compliance on paper, but actively engage staff in security.

*What this looks like in practice*: Senior leaders participating in security training themselves, not just mandating it for staff. Risk owners being held accountable for their treatment plans. Security KPIs included in performance reviews. Leaders visibly championing the ISMS.

**g) Promoting continual improvement**

The ISMS must improve over time. Top management must actively promote this improvement — not just accept it when the security team proposes it, but champion it as a strategic priority.

**h) Supporting other relevant management roles to demonstrate their leadership as it applies to their areas of responsibility**

Security is not solely the CISO's responsibility. The HR Director must lead security in HR processes. The Head of Engineering must lead security in development. The CFO must lead security in financial processes. Top management must enable and expect this distributed security leadership.

### What Auditors Look for in Clause 5.1

Auditors test Clause 5.1 through:

**Management interviews**: A Stage 2 audit typically includes interviews with senior leadership — the CEO, CFO, or relevant executive. Questions probe whether they understand the ISMS, whether they are genuinely engaged, and whether they can articulate the security objectives and risk posture.

**Budget evidence**: Evidence that security budget has been allocated, approved, and is appropriate for the organisation's risk profile.

**Management review records**: Minutes from management review meetings (Clause 9.3) demonstrating active engagement, not just attendance.

**Policy approval records**: Evidence that the information security policy was approved by top management (not just the CISO), reviewed at defined intervals, and remains current.

**Integration evidence**: Evidence that security requirements are embedded in business processes — project methodologies, procurement procedures, HR onboarding processes.

---

## Clause 5.2 — Policy

### The Requirement

> *"Top management shall establish an information security policy that: a) is appropriate to the purpose of the organisation; b) includes information security objectives (see 6.2) or provides a framework for setting information security objectives; c) includes a commitment to satisfy applicable requirements related to information security; d) includes a commitment to continual improvement of the ISMS; and that: e) is available as documented information; f) is communicated within the organisation; g) is available to interested parties, as appropriate; h) is reviewed at defined intervals and when significant changes occur."*

### What the Information Security Policy Must Contain

The information security policy is the top-level governance document for the ISMS. It is signed by the highest level of management and sets the direction for the entire programme. It must contain:

**Appropriateness to the organisation's purpose**: The policy must reflect what the organisation actually does and what it is actually trying to protect. Not a generic template — a policy written for this specific organisation.

**Information security objectives or a framework for setting them**: The policy either states the high-level security objectives directly ("we will achieve ISO 27001 certification and maintain it by [date]"; "we will ensure that all customer data is protected in accordance with GDPR") or provides the framework within which specific objectives will be set (Clause 6.2).

**Commitment to satisfy applicable requirements**: A formal commitment to comply with all relevant legal, regulatory, and contractual information security requirements. This is the governance anchor for the compliance programme.

**Commitment to continual improvement**: A formal commitment to the PDCA cycle — that the ISMS will be continually improved, not maintained at a static level.

### What the Policy Must Do

**Be available as documented information**: The policy must exist as a formal document, version-controlled, with an approval record.

**Be communicated within the organisation**: Every employee who is affected by the policy must know it exists and understand what it requires of them. Communication does not mean emailing the policy to all staff — it means ensuring staff understand it, typically through training and awareness programmes (Clause 7.3).

**Be available to interested parties as appropriate**: External stakeholders — customers, regulators, certification bodies — may need to see or be informed of the policy. Most organisations make a summary or the full policy publicly available on their website.

**Be reviewed at defined intervals and when significant changes occur**: The policy must be a living document. Define the review interval (annually is standard) and the trigger conditions for interim review (significant organisational change, significant incident, change in regulatory environment).

### What Makes a Good Information Security Policy

A good policy is:
- **Concise**: 2–4 pages maximum for the top-level policy. It sets direction — it does not prescribe every control.
- **Signed**: By the CEO or Managing Director, not the CISO or IT Director.
- **Current**: Reviewed within the last 12 months (or the defined review period).
- **Specific enough to be meaningful**: Not just "we are committed to information security" but "we are committed to protecting the confidentiality, integrity, and availability of our information assets in accordance with ISO 27001 and our obligations under UK GDPR."
- **Accessible**: Staff can find it easily. It is not buried in a SharePoint folder that nobody knows exists.

### A Common Failure: The Policy That Nobody Has Read

The information security policy is approved by the CEO, filed in the ISMS documentation folder, and never seen again by anyone. Staff do not know it exists. When auditors ask staff "have you seen the information security policy?" the answer is blank stares.

This satisfies the letter of Clause 5.2(e) (available as documented information) but fails Clause 5.2(f) (communicated within the organisation) and undermines the entire purpose of the policy as a governance anchor.

---

## Clause 5.3 — Organisational Roles, Responsibilities and Authorities

### The Requirement

> *"Top management shall ensure that the responsibilities and authorities for roles relevant to information security are assigned and communicated within the organisation. Top management shall assign the responsibility and authority for: a) ensuring the information security management system conforms to the requirements of this document; b) reporting on the performance of the information security management system to top management."*

### What Clause 5.3 Requires

**Clear role definitions**: Every role with information security responsibilities must have those responsibilities explicitly defined. This does not mean a new job title for every function — it means that existing roles have security responsibilities clearly documented.

**Communication of roles**: Staff must know what their security responsibilities are. A risk owner who does not know they are a risk owner cannot fulfil their accountability.

**ISMS conformance responsibility**: Someone must be formally assigned responsibility for ensuring the ISMS meets ISO 27001 requirements. In most organisations, this is the CISO — but in smaller organisations it may be an IT Manager, a Compliance Officer, or even the CEO.

**ISMS performance reporting responsibility**: Someone must be formally responsible for reporting on ISMS performance to top management. Again, typically the CISO. The reporting must actually reach top management — not be produced and filed without being reviewed.

### Key Roles in an ISO 27001 ISMS

**Top management**: Accountable for the ISMS overall. Sets policy and objectives. Approves resources. Reviews performance.

**CISO / Information Security Manager**: Responsible for day-to-day ISMS management. Develops and maintains the ISMS. Reports performance to top management.

**Risk Owner**: Accountable for specific risks in their business domain. Approves risk treatment plans. Accepts residual risk. Ensures treatment actions are implemented.

**Asset Owner**: Responsible for the security of specific information assets. Classifies assets. Ensures appropriate controls are applied. Typically a first-line business role.

**Information Security Officer / Team**: Executes ISMS processes — risk assessment, control monitoring, awareness training, incident response. Supports risk owners and asset owners.

**Internal Auditor**: Independently audits ISMS conformance. Reports to audit committee or CISO (with appropriate independence). Third-line assurance function.

**All staff**: Responsible for following security policies and procedures. Reporting incidents and near-misses. Completing required security training.

### The RACI Model for Security Roles

A **RACI matrix** (Responsible, Accountable, Consulted, Informed) is a common tool for documenting security roles and responsibilities in an ISO 27001 context:

| Activity | CISO | Risk Owner | IT Operations | All Staff | Internal Audit |
|---|---|---|---|---|---|
| Risk assessment | R | C | C | — | I |
| Risk treatment plan approval | A | R | C | — | I |
| Control implementation | A | I | R | — | I |
| Security training delivery | R | I | I | I (receives) | I |
| Incident reporting | A | I | R | R | I |
| Internal audit | I | C | C | C | R/A |
| Management review | R | I | I | — | I |

(R = Responsible; A = Accountable; C = Consulted; I = Informed)

### Segregation of Duties in ISMS Roles

A critical governance principle: the person responsible for ISMS conformance (typically the CISO) should not be the same person responsible for internal audit of the ISMS (third-line assurance). If the CISO audits their own programme, independence is compromised.

In smaller organisations where this full separation is not feasible, the organisation should acknowledge the limitation and compensate — for example, by engaging an external consultant for certain audit activities.

---

## The Details That Matter

### Evidence of Top Management Commitment: What Auditors Actually Look For

Auditors are experienced at distinguishing genuine top management commitment from performed compliance. The evidence they look for:

**Quantitative evidence:**
- Security budget as a percentage of IT budget or revenue (benchmarked against sector)
- Number and seniority of staff dedicated to ISMS roles
- Frequency and attendance records of Security Committee or equivalent
- Management review records (frequency, attendance, outputs, action completion)

**Qualitative evidence (from interviews):**
- Can the CEO describe the organisation's top three information security risks?
- Can the CFO explain the rationale for the security budget level?
- Can the Head of HR describe what security responsibilities their team has?
- Can a business unit manager name the risk owner for their team's risks?

**Behavioural evidence:**
- Are senior leaders seen to follow security policies themselves?
- Are security concerns raised promptly in management meetings?
- Are security incidents reported to top management without delay?
- Are security recommendations implemented, or routinely deprioritised?

### The Information Security Policy vs Supporting Policies

The information security policy (Clause 5.2) is the *top-level* policy — typically 2–4 pages, signed by the CEO, setting direction. It is supported by a set of more detailed policies that implement specific aspects of the ISMS:

| Top-level policy | Supporting policies |
|---|---|
| Information Security Policy | Access Control Policy |
| | Acceptable Use Policy |
| | Data Classification Policy |
| | Incident Response Policy |
| | Business Continuity Policy |
| | Remote Working Policy |
| | Mobile Device Policy |
| | Supplier Security Policy |
| | Cryptography Policy |
| | Clear Desk and Screen Policy |

Each supporting policy has a defined owner, review cycle, approval authority, and version history. The supporting policies are mandatory documented information (Clause 7.5) and must be maintained in a controlled manner.

---

## Common Mistakes and Failures

**1. Information security policy signed by the CISO, not the CEO.**
The policy's authority comes from who approves it. A policy signed by the CISO signals that security is the CISO's programme — not the organisation's programme. The policy must be signed by the highest level of management (CEO or MD).

**2. Policy that has not been reviewed in over a year.**
An unchanged policy in a changed regulatory and threat environment. The 2022 update to ISO 27001 introduced new controls; GDPR enforcement has evolved; the threat landscape has changed dramatically since 2019. If the policy has not been reviewed, it has not been maintained.

**3. Roles and responsibilities defined but never communicated.**
RACI matrices and role descriptions exist in ISMS documentation but staff are unaware of their responsibilities. Risk owners do not know they are risk owners. Asset owners have never been told they own anything. Clause 5.3 requires *communication*, not just documentation.

**4. Top management who cannot engage in the audit interview.**
When auditors interview senior leaders and find they cannot describe the risk posture, have not seen the last management review outputs, and are unaware of current High/Critical risks, this is a significant finding. The CISO has been running the ISMS in isolation; leadership has not been engaged.

**5. Security objectives that are aspirational but unmeasurable.**
"We will maintain excellent information security" — this is not an objective. An objective must be measurable, with a defined target, a timeline, and an owner. "Achieve and maintain ISO 27001 certification by Q3 2026, with zero major nonconformities at each surveillance audit" is an objective.

**6. Policy communicating that is "send to all staff" once.**
Emailing the policy to all staff once at the start of the ISMS programme and assuming communication is satisfied forever. Policy communication must be ongoing — through awareness training, induction processes, periodic reminders, and accessible storage.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Clause 5 is assessed throughout the Stage 2 audit, primarily through management interviews and review of documented information (policy, management review records, role definitions).
- A key auditor skill: assessing whether top management commitment is genuine or performed. Interview questions must probe actual knowledge and engagement, not just confirm that documents exist.
- Common nonconformities: policy not reviewed within the defined interval (minor); no evidence that roles and responsibilities have been communicated (minor); top management unable to demonstrate knowledge of ISMS performance in audit interview (potentially major if systemic).

**CISM:**
- Domain 1 (Information Security Governance) is almost entirely about the requirements of Clause 5. CISM tests whether candidates can design and operate the governance structure that Clause 5 requires.
- Key CISM principle: the CISO reports to the CEO or board — not to the CTO or CIO — to preserve independence and ensure security has a direct voice at the strategic level.

**CISSP:**
- Domain 1 includes governance concepts: due care, due diligence, and management commitment to security. Clause 5 maps directly to these concepts.
- CISSP distinction: *due care* (implementing appropriate security measures — controls, policies) vs *due diligence* (verifying those measures are working — audit, monitoring, management review). Both are present in Clause 5.

---

## GUARDIAN's Take

Of all the clauses in ISO 27001, Clause 5 is the one that most clearly separates the organisations that understand what an ISMS is from those that are pursuing a certificate.

Every organisation that seeks certification produces an information security policy and documents roles and responsibilities. That is table stakes. What Clause 5 actually demands — and what the auditor is actually looking for — is evidence that the people at the top of the organisation have made a *genuine* commitment to information security management. That they have invested resources. That they are engaged with the risk posture. That they are visibly leading the programme.

I have sat in hundreds of management review meetings as both a CISO and as an auditor. The difference between a genuine management review and a performed one is palpable within the first ten minutes. In a genuine review, the executives are engaged — they challenge the risk assessments, they push back on metrics they do not understand, they ask hard questions about why a treatment plan is overdue, they debate whether the current risk appetite is appropriate given recent threat intelligence. In a performed review, the CISO presents a prepared deck, one or two questions are asked, everyone signs the minutes, and the meeting ends in 25 minutes.

The outputs of these two types of meeting look identical on paper. But they produce entirely different ISMS cultures. In the first, the board is genuinely informed, security investment is justified, and the ISMS improves because real issues are raised and addressed. In the second, the certificate is maintained and nothing changes.

When you are implementing an ISMS, your first priority after scope and context is leadership engagement. Get the CEO to understand what the ISMS is and why it matters. Get the board to own the risk appetite. Get business unit leaders to understand that they own their risks. Without that engagement, you can build a perfect ISMS on paper and watch it be ignored in practice.

With it, you can build something that actually makes the organisation safer.

---
*Module: Module 3 — ISO 27001 | Guardian Curriculum*
