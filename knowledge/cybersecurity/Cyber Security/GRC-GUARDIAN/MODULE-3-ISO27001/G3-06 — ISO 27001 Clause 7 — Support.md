---
tags: [guardian, grc, module-3, iso27001, clause-7, support, resources, competence, awareness, communication, documented-information]
module: 3
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G3-04 — ISO 27001 Clause 5", "G3-05 — ISO 27001 Clause 6", "G3-07 — ISO 27001 Clause 8", "G3-14 — Internal Audit", "G9-01 — Policy Hierarchy"]
---

# G3-06 — ISO 27001 Clause 7 — Support

> [!abstract] What This Note Covers
> By the end of this note, you will understand every requirement of ISO 27001 Clause 7 — resources, competence, awareness, communication, and documented information — including what auditors test, what common failures look like, and why this clause is where many organisations reveal the gap between their ISMS on paper and their ISMS in practice.

---

## Why This Exists

Clause 7 is often underestimated. It sits between the planning requirements of Clause 6 and the operational requirements of Clause 8, and it can appear to be a set of administrative requirements — document your training records, maintain version control on your policies, communicate security to staff.

But Clause 7 is where the ISMS gains its operational reality. Plans and risk assessments mean nothing if the organisation does not have the people with the right skills to execute them, if staff do not understand what they are supposed to do, if communication channels do not exist to get the right information to the right people, and if documented information is not managed in a way that keeps the ISMS coherent and current.

More practically: Clause 7 failures are among the most common findings in ISO 27001 audits — because they are easy to neglect in the rush to build the risk register and select controls, and because they are easy to treat as a box-ticking exercise rather than a genuine operational requirement.

A training completion record that exists only because the LMS generated it automatically, without anyone checking whether the training produced understanding — that is Clause 7.2 satisfied on paper and failed in practice. A documented information control procedure that nobody follows — Clause 7.5 documented and non-functional.

Clause 7 is the clause that connects the ISMS to the people who operate it.

---

## Clause 7 Overview: Five Requirements

| Sub-clause | Title | Core question |
|---|---|---|
| **7.1** | Resources | What resources does the ISMS need, and are they available? |
| **7.2** | Competence | Do the people operating the ISMS have the skills and knowledge they need? |
| **7.3** | Awareness | Do all relevant staff understand their role in information security? |
| **7.4** | Communication | What information must be communicated, to whom, when, and how? |
| **7.5** | Documented information | How is ISMS documentation created, controlled, and maintained? |

---

## Clause 7.1 — Resources

### The Requirement

> *"The organisation shall determine and provide the resources needed for the establishment, implementation, maintenance and continual improvement of the information security management system."*

### What Resources the ISMS Needs

Resources in the ISO 27001 context means everything the ISMS requires to function:

**People**: Staff with security responsibilities — the CISO, security analysts, risk managers, internal auditors, awareness trainers. Also: the time of business unit managers who are risk owners, and the time of all staff for security training and compliance activities.

**Budget**: Money to fund controls (tooling, subscriptions, infrastructure), testing (penetration testing, third-party audits), training (awareness programmes, certification study), and external expertise (consultancy, external audit, legal advice).

**Infrastructure**: Tools and technology needed to operate ISMS processes — GRC platforms, SIEM systems, vulnerability scanners, document management systems, communication channels.

**Time**: The ISMS requires ongoing time from CISO, risk owners, security team, internal auditors, and management. If time is not protected and allocated, the ISMS will be crowded out by operational priorities.

**External expertise**: Where internal capability is insufficient — for specialised assessments, gap analyses, certification body audits, or specific technical control design.

### What Auditors Test in Clause 7.1

Auditors assess whether resources are genuinely adequate — not just whether the CISO says they are. Tests include:

- Is the security team appropriately sized for the scope and complexity of the ISMS?
- Is the security budget commensurate with the risk profile and the organisation's size?
- Are treatment plans failing because of resource constraints — and if so, is this being escalated and addressed?
- Are risk owners able to fulfil their responsibilities, or is their security accountability crowded out by other priorities?

A CISO who manages an ISMS for a 500-person organisation single-handedly, with a security budget of £30,000 per year and no external expertise, is a resource allocation failure — regardless of how diligently that individual works.

---

## Clause 7.2 — Competence

### The Requirement

> *"The organisation shall: a) determine the necessary competence of person(s) doing work under its control that affects its information security performance; b) ensure that these persons are competent on the basis of appropriate education, training, or experience; c) where applicable, take actions to acquire the necessary competence, and evaluate the effectiveness of the actions taken; d) retain appropriate documented information as evidence of competence."*

### What Competence Means in ISO 27001

Competence is not just having completed a training course. It is the demonstrated ability to apply knowledge and skills effectively in the role. Clause 7.2 requires the organisation to:

**Identify who needs to be competent**: This covers every person whose work affects information security performance — from the CISO and security analysts to IT administrators, developers, and HR staff with access to sensitive data. It also includes external parties working under the organisation's control (contractors, outsourced service providers).

**Define the competence requirements**: For each role with security responsibilities, what knowledge, skills, and experience are required? This should be documented in role profiles or competence frameworks.

**Ensure competence exists**: Through a combination of:
- *Education* — formal qualifications (degree, professional qualification)
- *Training* — specific courses, workshops, certification programmes (CISM, CRISC, ISO 27001 LA, CEH)
- *Experience* — demonstrated track record in relevant roles

**Address competence gaps**: Where a person does not yet meet the competence requirements for their role, take action to close the gap — training, mentoring, role redesign, or hiring.

**Evaluate training effectiveness**: A training record is not evidence of competence — it is evidence that training was delivered. Clause 7.2 requires evaluation of whether the training produced the required competence. This might be through: assessments at the end of training, practical demonstration of skills, supervisor evaluation, or phishing simulations to test awareness training effectiveness.

**Retain records**: Documented evidence of competence — certificates, training records, qualification records, role-specific assessment results.

### Practical Competence Framework

For a typical ISO 27001 ISMS, a competence framework might look like:

| Role | Required competence | How demonstrated |
|---|---|---|
| CISO | ISMS management, risk assessment, control design, audit management, board communication | CISM or ISO 27001 LA certification; 5+ years IS management experience |
| Risk Manager | Risk methodology, risk register management, stakeholder facilitation | CRISC certification; ISO 31000 training; demonstrated risk assessment experience |
| Internal Auditor | ISO 27001 requirements, audit methodology, evidence assessment, reporting | ISO 27001 LA certification; ISO 19011 training; audit experience |
| IT Security Analyst | Vulnerability management, SIEM operation, incident response | CEH or equivalent; vendor certifications; demonstrated operational experience |
| All staff (security awareness) | Understanding of key security policies and their personal responsibilities | Annual awareness training completion + assessment; phishing simulation results |
| Developers | Secure coding practices, OWASP Top 10, security testing | SAST/DAST tooling training; secure coding courses; code review participation |
| HR Manager (as risk owner) | Understanding of people-related security risks and HR security controls | Risk owner training; security awareness training; briefing on specific HR-related risks |

### The Training Record vs Evidence of Competence Distinction

Auditors probe this distinction specifically. A training record proves attendance. Evidence of competence proves learning and application.

**What is NOT sufficient as evidence of competence:**
- "Attended security awareness training" with no assessment
- A certificate from an online course with no evidence of application
- A phishing simulation record with a 30% click rate (training clearly not effective)

**What IS sufficient:**
- Training record + post-training assessment with passing score
- Certification (CISM, CRISC, ISO 27001 LA) — demonstrates tested competence to an external standard
- Phishing simulation click rate trending below 5% — evidence that awareness training is producing behaviour change
- Practical demonstration in audit exercises or incident response drills

---

## Clause 7.3 — Awareness

### The Requirement

> *"Persons doing work under the organisation's control shall be aware of: a) the information security policy; b) their contribution to the effectiveness of the information security management system, including the benefits of improved information security performance; c) the implications of not conforming with the information security management system requirements."*

### The Three Elements of Security Awareness

**Policy awareness**: Staff must know the information security policy exists, understand its purpose, and know where to find it. They do not need to memorise it — but they must know what it commits the organisation to and what it expects of them.

**Personal contribution awareness**: Staff must understand how their individual actions contribute to (or undermine) the ISMS. This is broader than "don't click phishing links." It includes: data handling, access control behaviour, incident reporting, physical security (clear desk, visitor management), and use of personal devices.

**Consequence awareness**: Staff must understand what happens when they do not comply — both the consequences for the organisation (data breach, regulatory fine, reputational damage) and the potential personal consequences (disciplinary action, legal liability in serious cases).

### What Security Awareness Looks Like in Practice

A genuine security awareness programme:

**Annual mandatory training**: Completed by all staff, including management and executives (who frequently exempt themselves). Content is relevant, current, and engaging — not a static PowerPoint from 2019.

**Regular communications**: Monthly security tips, incident-relevant alerts, phishing advisories. Security awareness is not a once-a-year event.

**Phishing simulations**: Regular (quarterly) simulated phishing campaigns. Click rates measured and tracked. Repeat clickers receive targeted remedial training. Trend data reported to management.

**Role-specific training**: Developers receive secure coding training. Finance staff receive fraud awareness training. HR staff receive data protection training. One-size-fits-all awareness programmes miss the specific risks of specific roles.

**New starter induction**: Security awareness training before or immediately upon system access. Not months after joining.

**Visible management behaviour**: Senior leaders visibly following security policies reinforces the message more powerfully than any training programme.

### What "Awareness" Is Not

A security awareness poster on the wall of the kitchen. An email with a PDF attachment of the security policy. A video that staff are required to watch but not assessed on. An annual mandatory training module with a 100% completion rate because the answers are pre-filled.

These activities satisfy the checkbox of "conducted awareness training" without producing genuine awareness. Auditors will probe whether the training is producing the intended outcome — behavioural change — not just whether it was delivered.

---

## Clause 7.4 — Communication

### The Requirement

> *"The organisation shall determine the need for internal and external communications relevant to the information security management system including: a) on what it will communicate; b) when to communicate; c) with whom to communicate; d) how to communicate."*

### Internal Communication

The ISMS requires information to flow reliably within the organisation:

**Upward communication**: From operational teams to management — incident reports, risk updates, control failures, monitoring results. This must be timely and unfiltered. A culture where bad news is suppressed before reaching management is a governance failure.

**Downward communication**: From management to staff — policy updates, security objectives, threat alerts, changes to procedures. Must reach all relevant staff in a timely manner.

**Horizontal communication**: Between departments — between the security team and IT operations, between the DPO and the security team, between risk owners and the risk manager. Cross-functional security decisions require effective horizontal communication.

**Escalation paths**: Clearly defined channels for staff to report security incidents, near-misses, and concerns. If staff do not know how to report, incidents go unreported. The reporting channel must be known, accessible, and safe to use (no fear of blame for honest reporting).

### External Communication

The ISMS must also manage communication with external parties:

**Regulatory bodies**: How and when will the organisation communicate with the ICO, FCA, or other regulators? Breach notification procedures must define this explicitly — 72 hours to the ICO under GDPR.

**Customers and partners**: How will security incidents affecting customers be communicated? What security information is shared with partners?

**Certification bodies**: Communication with the certification body regarding the ISMS — audit scheduling, nonconformity responses, scope changes.

**Media and public**: If a significant incident occurs, how will external communications be managed? (This overlaps with incident response and crisis communication planning.)

**Suppliers**: Security requirements communicated to suppliers through contracts and due diligence processes.

### Communication Plans vs Communication Reality

A common Clause 7.4 failure: a communication plan that documents all the right channels and processes, but in practice, critical information does not flow. Risk owners are not informed when their risks change. Staff do not receive timely security alerts. Incidents are not escalated promptly.

Auditors test communication not through the plan but through evidence of actual communication — incident report timestamps, management notification records, staff awareness of recent security communications.

---

## Clause 7.5 — Documented Information

### The Requirement

ISO 27001 requires the organisation to include documented information required by the standard itself and *additionally* whatever documented information the organisation determines is necessary for the effectiveness of the ISMS.

The standard specifies documented information (DI) requirements throughout Clauses 4–10. All mandatory DI must be created, maintained, and controlled.

The requirements for documented information control:

**Creating and updating**: DI must have appropriate identification (title, version, date), format, and review/approval process.

**Control of documented information**: DI must be:
- Available and suitable for use where and when it is needed
- Adequately protected (from loss, unauthorised access, or improper use)
- Controlled for distribution, access, use, storage, and preservation
- Retained for defined periods
- Disposed of securely when no longer needed

### Mandatory Documented Information: The Complete List

| Documented information | Required by |
|---|---|
| ISMS scope | 4.3 |
| Information security policy | 5.2 |
| Risk assessment process | 6.1.2 |
| Risk treatment process | 6.1.3 |
| Statement of Applicability | 6.1.3(d) |
| Information security objectives | 6.2 |
| Evidence of competence | 7.2 |
| Results of monitoring and measurement | 9.1 |
| Internal audit programme and results | 9.2 |
| Management review results | 9.3 |
| Nature of nonconformities and corrective actions | 10.1 |
| Risk assessment results | 8.2 |
| Risk treatment plan results | 8.3 |

Plus: any additional documented information the organisation determines is necessary for the effectiveness of the ISMS. Most organisations will have significantly more documented information than the mandatory minimum — supporting policies, procedures, work instructions, control evidence, training records, etc.

### Document Control: What It Requires

**Version control**: Every ISMS document must have a version number, effective date, and revision history. When a policy is updated, the old version is superseded and the new version is clearly identified.

**Approval**: Documents must be approved before they are put into use. The approval authority should be appropriate to the document type — top-level policy approved by CEO; technical procedure approved by CISO or IT Manager.

**Review cycles**: Defined review frequency for each document type. Policies: annually. Procedures: annually or when the process changes. Risk register: as defined in the risk assessment methodology.

**Accessibility**: Documents must be available to the people who need them — searchable, findable, in a location staff actually use. A policy buried in a SharePoint folder that nobody knows how to navigate is not accessible.

**Protection**: Documents must be protected against loss and unauthorised modification. Version control history provides audit trail. Access controls prevent unauthorised changes.

**Retention**: Records (evidence of ISMS operation) must be retained for defined periods. For ISO 27001 certification purposes, records should be retained for at least the current certification period (3 years) plus any surveillance audit period.

**Disposal**: Documents and records that are no longer needed must be disposed of appropriately — physically destroyed or digitally deleted in a controlled manner, with a record of disposal.

### The Document Control Procedure

Clause 7.5 itself requires a process for controlling documented information. This process is typically documented as a Document Control Procedure or a Documented Information Management Procedure. It defines: what documents are controlled, how versions are managed, who approves different document types, where documents are stored, and how obsolete documents are managed.

This is a supporting ISMS document — and it must itself be controlled.

---

## The Details That Matter

### Retained Information vs Maintained Information

ISO 27001 uses two terms with distinct meanings:

**Documented information to be maintained**: Policies, processes, procedures — living documents that describe *how things should be done*. Created, updated, approved, and controlled on an ongoing basis.

**Documented information to be retained**: Records — evidence that ISMS activities *actually happened*. Training records, audit reports, management review minutes, risk register snapshots, incident records. Retained as evidence; not routinely updated after creation.

This distinction matters for document control: the controls for maintained documents (version history, approval, review cycles) differ from the controls for retained records (retention period, access control, disposal).

### External Documents in the ISMS

Some documented information used by the ISMS is not created by the organisation — standards (ISO 27001:2022, ISO 27002:2022), regulatory guidance (ICO guidance, NCSC advice), supplier documentation. These external documents must also be controlled:

- Identified and version-controlled (which version of the standard are we working to?)
- Reviewed when updated externally (when ISO 27001:2022 superseded 2013, was the ISMS updated?)
- Accessible to relevant staff
- Not modified (external documents are used as reference, not edited)

### Documented Information and GDPR

Some ISMS documented information contains personal data and is therefore subject to GDPR as well as ISO 27001 requirements. Examples:
- Training records (name, completion date, assessment score) — personal data
- Incident records (names of involved individuals) — potentially special category data
- Competence records (qualifications, experience) — personal data

The intersection of ISO 27001 documented information requirements and GDPR data minimisation and retention requirements must be managed. Retain records long enough for audit purposes, but not longer than necessary under GDPR.

---

## Common Mistakes and Failures

**1. Awareness training with 100% completion but zero effectiveness.**
Everyone completed the online module. The phishing simulation click rate is still 40%. The training is not producing behaviour change. Clause 7.3 is nominally satisfied but actually failing. Fix: supplement completion tracking with effectiveness metrics (assessment scores, simulation results, incident reporting rates).

**2. Competence records that exist only on paper.**
Training records show all staff completed security training. But the training was a 5-minute video with no assessment, delivered 18 months ago, and the content has not been updated since 2021. There is no evidence of competence — only evidence of exposure to training.

**3. Communication channels that exist in the procedure but not in practice.**
The ISMS communication plan defines how incidents should be reported. But when an incident occurs, staff do not know the reporting channel, information reaches the CISO hours after it should have, and management is not notified. The channel exists on paper; it does not work in practice.

**4. Documents that have never been reviewed.**
The Acceptable Use Policy was written for the initial certification in 2022 and has not been reviewed since. Remote working expanded dramatically in 2023. The policy still references only office-based working. Outdated policies are a common audit finding — and a genuine security gap.

**5. Version control in name only.**
Documents have version numbers, but v1.0 and v1.1 are identical (the version number was incremented without any content change). Or v2.3 is in circulation alongside v2.2 because distribution was not controlled. Version control that is not enforced is decoration.

**6. Resources allocated on paper but not in practice.**
The ISMS budget line exists. But every security expenditure requires a separate business case approval. The CISO spends 30% of their time justifying routine security investments rather than managing the programme. Resources are nominally available but practically inaccessible.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Clause 7 is tested throughout Stage 2. Auditors will:
  - Request training records and competence evidence for key security roles
  - Interview staff (not just security team) on awareness of security policies and their responsibilities
  - Test awareness: "What would you do if you received a suspicious email?"
  - Review document control evidence: version history, approval records, review dates
  - Check that mandatory documented information exists and is current
  - Look at communication records: how were staff notified of recent policy changes? What is the incident reporting process?

- Common nonconformities in Clause 7:
  - Clause 7.2: no evidence of competence evaluation (training records without assessments)
  - Clause 7.3: awareness training not covering all three required elements (policy, contribution, consequences)
  - Clause 7.4: no defined process for external communication (particularly breach notification)
  - Clause 7.5: documents without version control or approval records; mandatory DI missing

**CISM:**
- Domain 3 (Information Security Programme) includes awareness and training programme design and management. Clause 7.3 maps directly to the CISM requirement for an effective security awareness programme.

**CRISC:**
- Clause 7 requirements appear in CRISC's risk response domain — specifically, the need for staff awareness of risk management responsibilities and the importance of documented information in risk monitoring.

---

## GUARDIAN's Take

Clause 7 is where I see the most consistent gap between what organisations say they do and what they actually do. It is also, paradoxically, one of the cheapest clauses to get right — because most of it is about people, process, and documentation rather than expensive technology.

The fundamental problem is this: organisations invest enormous effort in their risk registers, their Annex A control selection, and their Statement of Applicability. These are intellectually demanding activities that produce visible artefacts. Then they rush through Clause 7 — a quick training module here, a document control procedure there — because it feels like administrative overhead compared to the "real" ISMS work.

The consequence is an ISMS where the plans are excellent and the execution is poor. The risk treatment plan is beautifully structured. But the people responsible for implementing it have no idea they have that responsibility. The controls are well-designed. But the staff who operate them were trained once, two years ago, on content that is now outdated. The documented information is version-controlled in the procedure. But in practice, old versions continue to circulate because distribution was never controlled.

These are Clause 7 failures. And they undermine everything else the ISMS has built.

Getting Clause 7 right requires the same discipline as getting Clause 6 right — genuine engagement, honest assessment, and willingness to invest in the less glamorous aspects of the programme.

It means: actually evaluating whether training produces competence, not just whether it was delivered. Actually testing communication channels, not just documenting them. Actually enforcing document control, not just writing the procedure. Actually measuring awareness effectiveness, not just recording completion.

The organisations that take Clause 7 seriously have ISMSs where staff know their responsibilities, where information flows reliably, where documents are trusted to be current and accurate, and where the security programme is something the whole organisation participates in — not something that happens in the CISO's office.

That is the standard. It is achievable. It requires attention, discipline, and the willingness to treat these "administrative" requirements with the same seriousness as the technical ones.

---
*Module: Module 3 — ISO 27001 | Guardian Curriculum*
