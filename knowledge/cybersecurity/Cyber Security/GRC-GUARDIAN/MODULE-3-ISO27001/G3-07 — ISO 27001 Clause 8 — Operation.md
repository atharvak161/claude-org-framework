---
tags: [guardian, grc, module-3, iso27001, clause-8, operation, risk-assessment, risk-treatment, operational-planning]
module: 3
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G3-05 — ISO 27001 Clause 6 — Planning", "G3-06 — ISO 27001 Clause 7 — Support", "G3-08 — ISO 27001 Clause 9 — Performance Evaluation", "G3-12 — Gap Assessment", "G2-05 — The Risk Register"]
---

# G3-07 — ISO 27001 Clause 8 — Operation

> [!abstract] What This Note Covers
> By the end of this note, you will understand every requirement of ISO 27001 Clause 8 — operational planning and control, operational risk assessment, and operational risk treatment — including how Clause 8 connects planning to execution, what auditors look for, and the common operational failures that undermine otherwise well-designed ISMSs.

---

## Why This Exists

Clause 8 is the "Do" in the Plan-Do-Check-Act cycle. Everything built in Clauses 4–7 — the context analysis, the risk assessment, the controls, the competence, the communication — culminates here in operational reality. Clause 8 is where the ISMS stops being a plan and becomes a programme.

It is also the clause where most of the evidence for ISO 27001 certification actually lives. When auditors conduct a Stage 2 audit, they are primarily asking: "Is the organisation actually doing what it said it would do?" The answer to that question is found in Clause 8 — in the evidence that risks have been assessed, that controls are implemented and operating, that the risk treatment plan is being executed, and that changes are managed in a controlled way.

Clause 8 is deceptively short — just three sub-clauses in the standard's text. But its scope is enormous: it encompasses everything the organisation actually *does* to manage information security operationally. The policies, processes, and controls defined in earlier clauses are operationalised here.

---

## Clause 8 Overview: Three Sub-Clauses

| Sub-clause | Title | Core question |
|---|---|---|
| **8.1** | Operational planning and control | Are we actually implementing and controlling the plans we made in Clause 6? |
| **8.2** | Information security risk assessment | Are we conducting risk assessments when required and retaining the results? |
| **8.3** | Information security risk treatment | Are we implementing the risk treatment plan and retaining evidence? |

---

## Clause 8.1 — Operational Planning and Control

### The Requirement

> *"The organisation shall plan, implement, control, monitor and review the processes needed to meet information security requirements, and to implement the actions determined in Clause 6.1. The organisation shall also implement the plans to achieve information security objectives determined in Clause 6.2. The organisation shall keep documented information to the extent necessary to have confidence that the processes have been carried out as planned. The organisation shall control planned changes and review the consequences of unintended changes, taking action to mitigate any adverse effects, as necessary. The organisation shall ensure that externally provided processes, products or services that are relevant to the information security management system are controlled."*

### Breaking Down Clause 8.1

**Plan, implement, control, monitor and review the processes needed:**

Clause 8.1 requires the organisation to take the plans made in Clause 6 and actually operate them — not just document them. For every ISMS process identified in Clause 6:
- Define how the process will operate (who does what, when, how)
- Implement it (train the people who will run it, provide the tools they need)
- Control it (ensure it operates consistently to the defined procedure)
- Monitor it (measure whether it is working as intended)
- Review it (assess whether it needs to change)

**Example**: The risk assessment process defined in Clause 6.1.2 must be operationalised in Clause 8. This means:
- Scheduling and conducting risk assessment workshops (implement)
- Following the documented methodology consistently (control)
- Tracking risk register currency (monitor)
- Reviewing whether the methodology is still producing consistent results (review)

**Keeping documented information to have confidence that processes have been carried out as planned:**

This is the evidence requirement. For each ISMS process, there must be records demonstrating that the process actually ran — not just that it is defined in a procedure.

Evidence examples:
- Risk assessment: risk register with assessment date, scores, assessor names, risk owner signatures
- Access reviews: access review records showing who reviewed what, when, and what changes were made
- Patch management: vulnerability scan reports showing patch compliance rates and remediation evidence
- Security awareness training: training completion records, phishing simulation results
- Supplier assessments: completed assessment questionnaires, review dates, follow-up actions
- Incident management: incident logs, investigation records, post-incident review minutes

**Controlling planned changes:**

Planned changes to the ISMS must be managed in a controlled way (this connects to Clause 6.3). When the organisation decides to change a control, expand the scope, update the risk methodology, or modify a policy, that change must be:
- Planned with defined objectives and success criteria
- Approved by the appropriate authority
- Implemented in a controlled manner
- Reviewed post-implementation to confirm the intended outcome

**Reviewing consequences of unintended changes:**

Not all changes are planned. A system migration may unexpectedly change the network architecture. A new cloud service may be adopted by a business unit without IT involvement. Staff turnover may change the operational context. These unintended changes may affect the risk posture and must be identified, assessed, and managed.

This is the change management dimension of Clause 8.1 — requiring both proactive control of planned changes and reactive assessment of unintended ones.

**Controlling externally provided processes, products or services:**

Where the organisation outsources ISMS-relevant activities or relies on external suppliers for products or services that affect information security, those must be controlled. This does not mean the organisation certifies its suppliers — it means security requirements are defined, contractually embedded, and verified.

This connects directly to ISO 27001 Annex A controls on supplier relationships (A.5.19–A.5.22) and is a significant area of audit focus — particularly for cloud-heavy organisations where critical security controls may be operated by third parties.

### What Operational Control Looks Like

Operational control means having defined, documented procedures for key security processes and evidence that those procedures are being followed consistently.

Examples of operational controls and their evidence:

| ISMS process | Procedure exists? | Evidence of operation |
|---|---|---|
| User access provisioning | Access control policy + provisioning procedure | Provisioning records with approvals; access review records |
| Patch management | Patch management procedure | Vulnerability scan reports; patch deployment records; exception register |
| Incident management | Incident response plan | Incident log; investigation records; post-incident reviews |
| Backup management | Backup procedure | Backup logs; restoration test records |
| Physical access control | Physical security policy | Access logs; visitor records; CCTV retention records |
| Secure development | Secure coding policy + SDLC security gates | Code review records; SAST/DAST scan results; security sign-off records |
| Supplier management | Supplier security policy | Supplier assessments; contract review records; periodic reassessment records |

---

## Clause 8.2 — Information Security Risk Assessment

### The Requirement

> *"The organisation shall perform information security risk assessments at planned intervals or when significant changes are proposed or occur, taking account of the criteria established in 6.1.2(a). The organisation shall retain documented information of the results of the information security risk assessments."*

### What Clause 8.2 Requires

**Risk assessments at planned intervals**: The organisation must define and follow a schedule for risk assessments. The standard does not specify the interval — most organisations conduct a full assessment annually. The defined interval must be documented in the risk assessment methodology.

**Risk assessments when significant changes occur**: Out-of-cycle risk assessments must be triggered by significant changes. What constitutes a "significant change" must be defined (typically in the risk assessment methodology or a change management procedure):

| Significant change | Risk assessment trigger |
|---|---|
| New information system or significant system upgrade | Risk assessment for the new/changed system before deployment |
| New business process handling sensitive information | Risk assessment for the process before launch |
| Significant organisational change (restructuring, M&A) | Review of affected risk register entries |
| New regulatory obligation | Compliance risk assessment |
| Major security incident | Post-incident risk review to identify new or elevated risks |
| Significant change in threat landscape | Targeted risk review for affected risk areas |
| Material change in supplier arrangements | Third-party risk assessment update |
| New or significantly changed physical location | Physical security risk assessment |

**Retaining documented information of results**: The risk register (or equivalent) is the primary record. It must be retained with version history — not just the current state but the history of how risks have evolved over time.

For audit purposes, the organisation should retain:
- The completed risk register at each assessment point (snapshot)
- Evidence of who conducted the assessment and when
- Evidence of risk owner review and approval of their risk entries
- Changes made since the previous assessment and the rationale for those changes

### The Common Clause 8.2 Failure: Annual Assessment, Never Updated

The most common Clause 8.2 finding: an annual risk assessment conducted in January, with the resulting risk register unchanged until the following January — despite multiple significant changes occurring throughout the year (new cloud migration, major phishing incident, new regulatory guidance, two new business units).

The risk register at the point of the surveillance audit reflects the organisation's risk profile from 10 months ago, not today. This is a Clause 8.2 nonconformity — the risk assessment has not been conducted "when significant changes are proposed or occur."

---

## Clause 8.3 — Information Security Risk Treatment

### The Requirement

> *"The organisation shall implement the information security risk treatment plan. The organisation shall retain documented information of the results of the information security risk treatment."*

### What Clause 8.3 Requires

**Implement the risk treatment plan**: The risk treatment plan created in Clause 6.1.3 must actually be executed. Controls must be deployed. Actions must be completed. Timelines must be met (or formally rescheduled with documented rationale).

This is where the rubber meets the road. A perfectly structured risk treatment plan that was never implemented is a Clause 8.3 failure — not a Clause 6 failure. The planning was done; the operation was not.

**Retain documented information of results**: Evidence must exist that:
- Treatment actions have been completed (or are in progress with current status)
- Controls have been implemented (configuration evidence, test results, policy approvals)
- The target residual risk has been verified post-implementation (control effectiveness testing)
- Risk owners have been informed of treatment progress

### Clause 8.3 Evidence Requirements

For each risk with an active treatment plan, the auditor will look for:

**Treatment action evidence:**
- Implementation records (who deployed the control, when, what configuration)
- For policy controls: approved policy document with effective date
- For technical controls: configuration screenshots, system outputs, scan results
- For training controls: completion records + assessment scores
- For organisational controls: RACI updates, role profile changes, meeting records

**Post-treatment verification:**
- Evidence that the implemented control is actually working (not just deployed)
- Penetration test or vulnerability scan confirming the vulnerability is closed
- Access review confirming access is restricted as intended
- Backup restoration test confirming recovery is possible

**Risk owner sign-off:**
- Documentation that the risk owner has reviewed the implemented treatment and accepted the residual risk

**Updated risk register:**
- Post-treatment residual risk scores reflecting the implemented controls
- Treatment plan status updated (actions marked complete with evidence references)

### The Common Clause 8.3 Failure: Plans Without Progress

A treatment plan with 15 actions. 12 are marked "In Progress" with completion dates that have passed. 3 are marked "Complete" with no evidence references. The risk register still shows pre-treatment residual risk scores.

This is a Clause 8.3 nonconformity — the treatment plan exists but is not being implemented. The risk remains at its pre-treatment level because the controls have not been deployed.

---

## The Relationship Between Clauses 6 and 8

Understanding how Clause 6 and Clause 8 relate is essential for both audit practice and exam performance.

| Clause 6 (Planning) | Clause 8 (Operation) |
|---|---|
| *Designs* the risk assessment process | *Runs* the risk assessment process |
| *Designs* the risk treatment plan | *Executes* the risk treatment plan |
| *Selects* which controls to implement | *Implements* those controls |
| *Sets* information security objectives | *Works toward* those objectives |
| *Defines* what should happen | *Makes* it happen |

A finding against Clause 6 means the plan is wrong or incomplete. A finding against Clause 8 means the plan exists but is not being executed. Both are nonconformities, but they have different root causes and different remediation approaches.

**Clause 6 finding**: "The risk assessment methodology does not define risk acceptance criteria."
Remediation: Update the methodology document.

**Clause 8 finding**: "The risk treatment plan action to implement MFA on the VPN was due 3 months ago and remains incomplete with no documented rationale for the delay."
Remediation: Implement the control and establish a treatment tracking process that prevents future slippage.

---

## The Details That Matter

### Operational Planning for Specific ISMS Processes

Clause 8.1 covers all ISMS processes. The following are the most audited:

**Access Management Operations:**
- User provisioning and deprovisioning procedures (on-boarding and off-boarding)
- Privileged access management (how are admin accounts managed?)
- Access review process (quarterly/semi-annual reviews, evidence of completion)
- Separation of duties enforcement

**Vulnerability Management Operations:**
- Scanning frequency and coverage (which systems are scanned? how often?)
- Patch prioritisation criteria (how are critical/high CVEs prioritised?)
- Patch deployment SLAs (30 days for critical? 90 days for medium?)
- Exception management (what happens when patching is not feasible?)

**Incident Management Operations:**
- Incident detection and reporting process (how do incidents reach the security team?)
- Classification criteria (what makes an incident P1 vs P2?)
- Response procedures (step-by-step response for common incident types)
- Post-incident review process (what is reviewed? when? what records are kept?)

**Supplier Management Operations:**
- Supplier onboarding security assessment (when is it required? what does it cover?)
- Ongoing supplier monitoring (how are suppliers re-assessed? how often?)
- Supplier contract security requirements (what security clauses are in contracts?)
- Supplier incident management (what happens when a supplier has an incident?)

**Physical Security Operations:**
- Visitor management (how are visitors logged, supervised, and departed?)
- Clean desk and clear screen enforcement (how is this monitored?)
- Physical access control (how are access cards managed? how is access reviewed?)
- Equipment disposal (how is sensitive equipment decommissioned?)

### Change Management: A Critical Operational Control

Clause 8.1 requires controlling planned changes and reviewing unintended changes. In practice, this means an operational change management process that flags security implications:

Every significant IT or operational change must include:
1. Security risk assessment of the proposed change
2. ISMS impact assessment (does this change affect the scope, risk register, SoA, or any ISMS procedure?)
3. Security approval (CISO or security team sign-off for changes above a defined threshold)
4. Post-change security verification (confirm the change did not introduce new vulnerabilities or break existing controls)

A common audit finding: a significant cloud migration was completed, the risk register was not updated, the SoA was not reviewed, and no security risk assessment was conducted before migration. This is a Clause 8.1 change management failure and a Clause 8.2 risk assessment trigger failure simultaneously.

### Outsourced Processes and Third-Party Control

Clause 8.1's requirement to control "externally provided processes, products or services" is increasingly significant as organisations rely on cloud services, managed service providers, and outsourced security functions.

**What control of outsourced processes means:**
- Defining the security requirements for the outsourced activity (in the supplier contract)
- Assessing whether the supplier meets those requirements (due diligence and ongoing monitoring)
- Maintaining visibility of the security controls the supplier operates on the organisation's behalf
- Knowing what the supplier's security incident notification process is

**What it does NOT mean:**
- Certifying the supplier against ISO 27001
- Conducting penetration tests on supplier systems without their knowledge
- Assuming that a supplier's ISO 27001 certificate means all security requirements are automatically satisfied

A supplier's ISO 27001 certificate covers their ISMS scope — which may or may not include the specific service they provide to your organisation. Always verify scope alignment.

---

## Common Mistakes and Failures

**1. Treatment plan actions never completed.**
The risk treatment plan contains 20 actions. 14 are overdue. The CISO is unaware because there is no tracking mechanism. The risk register shows residual risk scores that assume the actions have been completed. The actual risk posture is significantly worse than documented.

**2. Risk assessments not triggered by significant changes.**
A major cloud migration moved 80% of the organisation's infrastructure to AWS. No risk assessment was conducted. The risks of the new environment (misconfiguration, shared responsibility model, cloud-specific threats) are unassessed. The risk register reflects the old on-premise environment.

**3. Evidence of control operation not retained.**
Controls are described in the SoA as "implemented." But when auditors request evidence of operation, the organisation cannot produce it — no access review records, no vulnerability scan reports, no patch deployment logs. "We do this but we don't document it" is a Clause 8.1 failure.

**4. Operational procedures exist but are not followed.**
The patch management procedure requires critical patches within 30 days. Vulnerability scan reports show 40% of critical servers have patches older than 90 days. The procedure is well-written and approved. It is not being followed. Clause 8.1 requires not just that procedures exist but that processes operate as planned.

**5. Externally provided services not controlled.**
A critical business application is hosted by a SaaS provider. No security assessment was conducted before adoption. No security requirements are in the contract. The provider has no obligation to notify the organisation of security incidents affecting their data. Clause 8.1 requires external providers to be controlled — not just chosen.

**6. Incident records insufficient for post-incident review.**
Incidents are "handled" — the immediate problem is resolved — but no records are kept. When an auditor asks "what was your most significant security incident in the last 12 months and what was the outcome?", the CISO cannot answer because there are no records. Clause 8.1 requires documented evidence that processes have been carried out.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Clause 8 is the primary source of evidence in a Stage 2 audit. The auditor's core activity is testing whether the organisation is doing what it said it would do.
- Key audit tests for Clause 8:
  - Sample and test specific controls: "Show me the access review records for the last quarter."
  - Trace treatment plan actions: "This action was due 60 days ago. Show me evidence it was completed, or explain why it was not."
  - Verify risk assessment currency: "Your last formal risk assessment was 14 months ago. Was there a significant change in the intervening period that should have triggered an out-of-cycle assessment?"
  - Test change management: "Tell me about the three most significant IT changes in the last 12 months. Was a security risk assessment conducted for each?"
- Common nonconformities:
  - Clause 8.1: processes defined but not followed (access reviews not completed, patch SLAs not met)
  - Clause 8.2: risk assessment not updated following significant change
  - Clause 8.3: treatment plan actions overdue with no documented rationale

**CISM:**
- Domain 3 (Information Security Programme) covers the operational management of the IS programme — directly mapping to Clause 8. CISM candidates must understand how to manage an IS programme operationally, not just design it.

**CRISC:**
- Clause 8.2 and 8.3 directly implement CRISC's risk response and monitoring domains. The operational risk assessment process and risk treatment implementation are CRISC Domain 3 and 4 activities.

**CISSP:**
- Domain 1 includes operational security management concepts. Understanding that security is an ongoing operational discipline — not a one-time implementation — is foundational to CISSP thinking.

---

## GUARDIAN's Take

Clause 8 is where ISMSs live or die. Everything built in the earlier clauses is only valuable if it is operational — if controls are running, risk assessments are current, and treatment plans are progressing.

The most common failure I encounter in surveillance audits is not that organisations have failed to design good processes. Most have. The failure is that the processes are not being operated consistently. The patch management SLA exists in the procedure but is not being met. The risk assessment trigger for significant changes is defined in the methodology but was not applied when the organisation migrated to cloud. The treatment plan actions were assigned and agreed but nobody has been tracking progress.

These operational failures have a common root cause: the ISMS was treated as a project, and projects end. The certification was achieved, the team celebrated, and then the programme quietly wound down as everyone went back to their day jobs. Security awareness training was delivered once for the certification audit and has not been repeated. The risk register has not been touched since the certification date. Treatment plan actions are outstanding but nobody is chasing them.

Clause 8 requires that the ISMS is a programme, not a project. It requires ongoing operational discipline — the willingness to run the processes month after month, year after year, even when there is no audit imminent and no certificate at stake.

The organisations that achieve this are the ones where the CISO has genuine authority, where management reviews are substantive, where risk owners are held accountable, and where the ISMS is embedded in how the organisation operates rather than running alongside it.

Building that operational discipline is harder than building the ISMS. But it is the difference between a certificate and a genuinely safer organisation.

---
*Module: Module 3 — ISO 27001 | Guardian Curriculum*
