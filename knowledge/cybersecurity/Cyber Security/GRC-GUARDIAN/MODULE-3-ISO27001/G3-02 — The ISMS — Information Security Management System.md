---
tags: [guardian, grc, module-3, iso27001, isms, management-system, scope, pdca]
module: 3
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: beginner
date: 2026-04-17
guardian-refs: ["G3-01 — What is ISO 27001", "G3-03 — ISO 27001 Clause 4", "G3-04 — ISO 27001 Clause 5", "G3-05 — ISO 27001 Clause 6", "G3-11 — Statement of Applicability", "G3-13 — The Certification Journey"]
---

# G3-02 — The ISMS — Information Security Management System

> [!abstract] What This Note Covers
> By the end of this note, you will understand exactly what an Information Security Management System is — not as an abstract concept but as a concrete, operational reality — including its components, its boundaries, how it is scoped, what makes it function, and what distinguishes a genuine ISMS from a certificate-chasing compliance exercise.

---

## Why This Exists

In 2016, Tesco Bank suffered a cyberattack in which attackers exploited vulnerabilities in the bank's payment card system to steal approximately £2.26 million from 9,000 customer accounts over a single weekend. Tesco Bank was a subsidiary of one of the UK's largest retailers. It had dedicated security staff, security policies, and a range of technical controls.

What it apparently lacked was a *system* — an integrated, managed framework that connected its risk assessment to its control selection, its control selection to its monitoring, its monitoring to its incident response, and its incident response to its improvement cycle. The vulnerabilities exploited were, in several respects, known or knowable. The controls that should have caught the attack earlier were not operating as intended. The detection and response was slower than it should have been.

The FCA fined Tesco Bank £16.4 million and found that its controls were not adequate to protect against foreseeable fraud attacks. The word "foreseeable" is key. A functioning ISMS creates foreseeability — it forces organisations to think through what could go wrong, implement controls proportionate to those risks, monitor whether those controls are working, and improve when they are not.

The ISMS is not a policy document or a certificate. It is an operating system for information security — a continuously running, integrated programme of governance, risk management, control implementation, monitoring, and improvement.

---

## What an ISMS Is

An **Information Security Management System (ISMS)** is the totality of policies, processes, procedures, controls, organisational structures, and resources that an organisation uses to manage information security risks and achieve its information security objectives.

This definition is deliberately broad. An ISMS is not:
- Just a set of documents
- Just a technical control framework
- Just a risk register
- Just a compliance programme

It is the *integration* of all of these into a coherent, managed system. The key word is "system" — the ISMS works because its components are connected. Risk feeds into control selection. Control selection feeds into the SoA. The SoA feeds into implementation. Implementation feeds into monitoring. Monitoring feeds into improvement. Improvement feeds back into risk assessment. The cycle is continuous.

### The Components of an ISMS

A fully operational ISMS has the following components:

**1. Governance structure**
- Top management commitment and leadership (Clause 5)
- Defined roles and responsibilities
- Information security policy
- Security Committee or equivalent oversight body
- Risk ownership structure

**2. Context and scope**
- Understanding of the internal and external environment (Clause 4.1)
- Stakeholder requirements (Clause 4.2)
- Defined ISMS scope (Clause 4.3)
- Defined ISMS boundaries and interfaces

**3. Risk management process**
- Documented risk assessment methodology (Clause 6.1.2)
- Completed risk register (all assets in scope assessed)
- Risk treatment plan with named owners and deadlines (Clause 6.1.3)
- Statement of Applicability (Clause 6.1.3(d))
- Information security objectives (Clause 6.2)

**4. Policies, standards, and procedures**
- Information Security Policy (top-level)
- Supporting policies (access control, acceptable use, data classification, incident response, etc.)
- Technical standards and operating procedures
- Policy lifecycle process (review, approval, communication)

**5. Controls**
- Implemented Annex A controls (and additional controls identified through risk assessment)
- Evidence of control operation (logs, records, test results)
- Control effectiveness monitoring

**6. Competence and awareness**
- Staff training and awareness programme
- Competence requirements for security roles
- Records of training completion

**7. Communication**
- Internal communication processes (how security information flows within the organisation)
- External communication processes (how the organisation communicates with regulators, customers, suppliers)

**8. Documented information (records)**
- All mandatory documented information required by the standard
- Supporting records that demonstrate the ISMS is operating
- Document control processes

**9. Operational management**
- Operational planning and control (Clause 8)
- Change management
- Outsourcing and supplier management
- Incident management

**10. Performance evaluation**
- Monitoring and measurement programme (Clause 9.1)
- Internal audit programme (Clause 9.2)
- Management review (Clause 9.3)

**11. Improvement**
- Nonconformity and corrective action process (Clause 10.1)
- Continual improvement activities (Clause 10.2)

---

## Defining the ISMS Scope

The **scope** is the boundary of the ISMS — the explicit definition of what is included and what is excluded. Defining scope correctly is one of the most important and most difficult decisions in building an ISMS.

### What the Scope Covers

The scope defines:
- **Which organisational units** are included (whole organisation, specific department, specific business unit)
- **Which locations** are included (all offices, specific sites, remote workers)
- **Which information assets** are in scope (all information assets within the organisational boundary defined above)
- **Which processes** are included (all processes that create, process, store, or transmit information assets in scope)
- **Which products/services** are included (useful for SaaS companies scoping by product rather than by org unit)

### Scope Interfaces and Dependencies

The scope must also document **interfaces** — connections between the ISMS scope and external entities or systems that are out of scope. For example:
- The ISMS covers the London headquarters, but staff access cloud services hosted outside the scope boundary. The interface is the access control mechanism and the cloud provider's contractual security obligations.
- The ISMS covers a specific product, but the product depends on a shared IT infrastructure. The interface must be documented and the security obligations of the shared infrastructure defined.

Interfaces are where auditors look for gaps — where risk could flow across the scope boundary without adequate control.

### Scope Statement

The scope must be documented (Clause 4.3 requires documented information on the ISMS scope). A well-written scope statement:

**Example:**
> "The ISMS covers the information assets, processes, and infrastructure used in the provision of cloud-based HR management services by [Organisation Name], including the development, delivery, and support of the [Product Name] platform, operating from our London headquarters (25 Victoria Street) and our remote development team (UK-based). Excluded from scope: the parent company's corporate IT infrastructure, finance systems, and non-product business functions. Interfaces with out-of-scope functions are managed through defined access controls and contractual security obligations."

### Scope and Certification Claims

The certification certificate specifies the scope. When an organisation says "we are ISO 27001 certified," the scope matters enormously. A certificate covering only the development team of a SaaS product does not mean the organisation's entire operation is certified. When customers ask about certification, they should be shown the scope statement, not just the certificate.

---

## The ISMS in Practice: What It Actually Looks Like

An abstract description of an ISMS can feel disconnected from operational reality. Here is what a functioning ISMS actually looks like in a 200-person technology company:

**The governance layer** (who is responsible):
- The CISO owns the ISMS programme
- The Security Committee meets quarterly: CISO, CFO, Head of Engineering, Head of Operations, DPO
- Every system and data asset has a named owner in the business
- The board receives a security risk summary annually (or quarterly for mature programmes)

**The risk layer** (what we know about our risks):
- An annual risk assessment is conducted using a documented methodology aligned with ISO 27005
- The risk register contains 47 entries, each with a risk statement, inherent/residual scores, controls, and a named risk owner
- 3 Critical and 8 High risks have active treatment plans with monthly progress reviews
- The risk register is updated when significant changes occur (new system, incident, threat intelligence)

**The control layer** (what we do about the risks):
- 78 of 93 Annex A controls are applicable and implemented (SoA documents all 93)
- Additional controls beyond Annex A have been implemented for cloud-specific risks
- Controls are documented in policies and procedures, implemented technically, and monitored continuously
- A vulnerability management programme runs weekly scans; patches are applied within defined SLAs

**The monitoring layer** (how we know it's working):
- Monthly security metrics reported to CISO: patch compliance, phishing click rate, access review completion, incident count
- Quarterly phishing simulations with click rate tracking
- Annual penetration test (external); semi-annual internal penetration test
- Internal audit covers all ISMS requirements over a 3-year rolling programme

**The improvement layer** (how we get better):
- Nonconformities (from internal audit, external audit, incidents) are tracked in a corrective action log
- The management review (annual) receives: audit results, metrics trends, incident summary, risk posture update, resource requirements
- Improvement actions are assigned, tracked, and reviewed at the next management review
- Lessons from security incidents feed back into risk assessment and control improvement

This is an ISMS. Not a document. Not a certificate. A functioning, integrated programme.

---

## What Makes an ISMS "Genuine" vs "Cosmetic"

This is the most important practical distinction in ISO 27001. Both types of organisation can hold an ISO 27001 certificate. The differences are:

### The Genuine ISMS

- Risk assessment actually reflects the organisation's specific assets and threats — not a generic template
- Controls are selected because they address specific identified risks — traceable from risk to control
- Staff at all levels know what the ISMS requires of them and why
- The CISO regularly discusses risk posture with the board, not just at certification time
- Internal audit finds real issues because it looks honestly
- Incidents are investigated, root causes are identified, and controls are improved
- The ISMS evolves as the organisation and threat landscape change
- Management review is a genuine strategic conversation, not a rubber-stamp exercise

### The Cosmetic ISMS

- Risk register is a template downloaded from the internet, populated with generic risks
- Controls are selected to match Annex A checkboxes, not linked to specific risks
- Staff were trained once for the certification audit; training has not been repeated
- The information security policy was approved by the CEO but has never been read by staff
- Internal audit raises only minor observations because it does not want to jeopardise certification
- Incidents are logged but not investigated beyond immediate remediation
- The ISMS looks identical 18 months after certification to how it looked on certification day
- Management review is a 30-minute meeting where the CISO presents a prepared deck and everyone signs the minutes

A certification body auditor conducting a surveillance audit may not always be able to distinguish between these two. But an experienced lead auditor asking the right questions — "show me how control A.8.5 addresses risk RISK-023," "walk me through how you conducted the risk assessment for your new cloud deployment," "what changed in your ISMS after the phishing incident in Q2?" — will find the difference quickly.

---

## Mandatory Documented Information

ISO 27001 requires specific documented information (policies, procedures, records) to be maintained. The standard specifies both documents the organisation must create and records it must retain as evidence that the ISMS is operating.

### Mandatory Documents (create and maintain)

| Document | Required by |
|---|---|
| ISMS scope | Clause 4.3 |
| Information security policy | Clause 5.2 |
| Risk assessment methodology | Clause 6.1.2 |
| Risk treatment process | Clause 6.1.3 |
| Information security objectives | Clause 6.2 |
| Statement of Applicability | Clause 6.1.3(d) |
| Competence evidence | Clause 7.2 |
| Documented information determined as necessary | Clause 7.5 |

### Mandatory Records (retain as evidence)

| Record | Required by |
|---|---|
| Risk assessment results | Clause 8.2 |
| Risk treatment results | Clause 8.3 |
| Monitoring and measurement results | Clause 9.1 |
| Internal audit programme and results | Clause 9.2 |
| Management review results | Clause 9.3 |
| Evidence of corrective actions | Clause 10.1 |

**Plus**: Records of training, competence, and awareness activities; records of supplier assessments; incident records; and any other records needed to demonstrate that ISMS processes are operating as planned.

### Document Control

All documented information must be controlled — meaning the organisation must have a process for: creating and updating documents (version control, approval, format), distributing documents (who needs them and how they access them), storing and protecting documents (preventing loss, unauthorised access), and disposing of obsolete documents (preventing use of outdated versions).

A common audit finding: policies that have not been reviewed in 3+ years, with no evidence of any review since the original certification. Document control processes must be operating, not just documented.

---

## Common Mistakes and Failures

**1. Building an ISMS for the auditor, not for the business.**
Every decision about the ISMS is made through the lens of "will this satisfy the certification body?" rather than "will this actually improve our security?" The resulting ISMS satisfies the auditor and does nothing for the organisation.

**2. Scope that excludes the crown jewels.**
The ISMS scope is defined to exclude the systems that are most difficult to secure — the legacy ERP, the unmanaged cloud storage, the shadow IT. The certificate covers the easy stuff. The real risks sit outside scope.

**3. No management review that is actually reviewed.**
Management review minutes exist. They are populated with the standard agenda items. Nobody at the meeting actually engaged with the content. The CISO presented; the CEO asked one question; the minutes were signed. This satisfies the letter of Clause 9.3 but not its intent.

**4. Corrective actions that are never completed.**
Nonconformities are raised by the internal audit. Corrective actions are agreed. The next audit finds the same nonconformities — the corrective actions were never implemented. This is a systemic failure of the improvement process and a major audit concern.

**5. The ISMS lives in a folder.**
The ISMS documentation is stored in a SharePoint folder that nobody accesses between audits. Staff do not know the policies exist. Risk owners have never seen their risk register entries. Controls are implemented by IT without reference to the ISMS. The ISMS is a documentation exercise, not a management system.

**6. Risk assessment never updated.**
The initial certification risk assessment is treated as permanent. New systems, new services, new staff, new threats — none of these trigger a risk assessment update. The ISMS is managing the risks of a two-year-old organisation, not the current one.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- The Lead Auditor must deeply understand what an ISMS is and how it should function. Audit questions probe whether the ISMS is genuine: "How does your risk assessment connect to your control selection?" "Show me the link between RISK-014 and control A.8.5 in your SoA."
- Key audit tests: traceability (risk → SoA → control → evidence); integration (is the ISMS embedded in business processes or running alongside them?); operation (is the ISMS actually being used, or is it aspirational documentation?).
- Clause 4.3 (scope) is frequently examined: is the scope appropriate? Are interfaces documented? Does the scope reflect the actual organisational boundary?

**CISM:**
- Domain 3 (Information Security Programme) tests the design and management of IS programmes. The ISMS concept is central — CISM candidates must understand how to build, operate, and mature an ISMS aligned with business objectives.

**CISSP:**
- Domain 1 includes management system concepts. Understanding that an ISMS is a management system (not just a policy set or a technical framework) is a foundational CISSP concept.

---

## GUARDIAN's Take

The word "system" in ISMS is doing enormous work. A system is not a collection of parts — it is a set of parts that work together, where each part's function connects to and depends on the others.

The most common ISMS failure I see is not the absence of any component — most organisations have policies, some have risk registers, most have some technical controls. The failure is the *absence of connection* between the components. The risk register does not connect to the control selection. The controls are not monitored. The monitoring results do not feed back into the risk register. The management review does not actually review anything. The audit findings produce corrective action plans that are filed and forgotten.

Each component exists, but they do not form a system. They form a collection of governance artefacts that individually appear sound and collectively produce very little.

Building a genuine ISMS means building the connections: the feedback loops, the escalation paths, the update triggers, the review cycles. It means designing the system so that information flows through it — from the operational environment, through monitoring, into assessment, through treatment, back into control implementation, and around again.

When those connections exist and function, the ISMS is alive. It responds to changes in the threat landscape. It catches control degradation before it becomes an incident. It surfaces new risks before they materialise. It gives the board accurate information rather than comfortable fiction.

That is what you are building when you build an ISMS. Not a document set. Not a compliance programme. A living system that keeps the organisation safer, year on year, in a world that keeps changing.

Build it to last. Build it to be used. Build it to be honest.

---
*Module: Module 3 — ISO 27001 | Guardian Curriculum*
