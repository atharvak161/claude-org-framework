---
tags: [guardian, grc, module-1, foundations, governance]
module: 1
cert-coverage: [iso27001-la, cism, cissp]
difficulty: beginner
date: 2026-04-15
guardian-refs: ["G1-01 — What is GRC and Why It Exists", "G1-03 — Risk Explained", "G1-05 — The Three Lines of Defence Model", "G1-07 — Key Roles in GRC", "G12-02 — CISM Domain 1 — Information Security Governance"]
---

# G1-02 — Governance Explained

> [!abstract] What This Note Covers
> By the end of this note, you will understand what governance means in an information security context, why it exists, how it is structured in real organisations, and what good and bad governance actually look like.

---

## Why This Exists

In 1995, Nick Leeson — a derivatives trader at Barings Bank, one of the oldest merchant banks in Britain — single-handedly caused the bank's collapse by hiding £827 million in trading losses in a secret account. He had authority to both execute trades *and* approve his own transactions — a catastrophic failure of segregation of duties. Nobody was checking his work. Nobody had the oversight mechanisms in place to see what he was doing until it was too late.

Barings Bank had been in operation for 233 years. It was destroyed in a matter of months by one person operating without proper governance.

Leeson's case is extreme, but the underlying failure is universal: *when nobody is watching, and nobody is accountable, bad things happen*. Governance is the answer to this problem. It is the set of structures, processes, and accountabilities that ensure an organisation is directed and controlled effectively — that decisions are made by the right people, that those people are accountable for those decisions, and that there is transparency into what is happening and why.

In the context of information security, governance answers the question: *who is responsible for security, what authority do they have, and how do we know things are working?*

---

## What It Is

**Governance** is the system by which an organisation is directed and controlled. In the information security context, **Information Security Governance** is specifically about ensuring that security decisions are made at the right level, aligned to business objectives, properly resourced, and subject to oversight.

It is not about technology. It is not about firewalls or antivirus software. It is about *people, structures, accountability, and direction*.

A simple way to think about it: governance answers three questions.

| Question | Governance Answer |
|---|---|
| Who is in charge? | Defined roles and responsibilities — board, CISO, risk owner, asset owner |
| What are we trying to achieve? | Strategy and policy — security objectives aligned to business goals |
| How do we know it's working? | Metrics, reporting, audit, management review |

Without governance, even the best security technology in the world is ineffective — because nobody has decided what it should protect, who is responsible for it, or how they will know if it fails.

---

## How It Works in Practice

### The Governance Hierarchy

Governance in most organisations operates in a layered hierarchy. Think of it like a chain of command:

**1. The Board of Directors**
The board sits at the top. They are ultimately accountable for everything the organisation does — including how it manages risk and information security. In practice, this means:
- Approving the organisation's risk appetite (how much risk they are willing to accept)
- Receiving regular reports on the security posture
- Ensuring that adequate resources are allocated to security

The board does not run day-to-day security. But they set the tone. If the board treats security as a cost to be minimised, that attitude will cascade down the organisation. If the board treats it as a strategic priority, resources and culture follow.

**2. Executive Management (C-Suite)**
The CEO, CFO, CTO, and especially the **CISO (Chief Information Security Officer)** translate board direction into operational reality. The CISO is typically responsible for:
- Developing and maintaining the Information Security Management System (ISMS)
- Leading the security programme
- Reporting risk posture to the board in terms they understand (business risk, not technical jargon)
- Owning the relationship with regulators and auditors

**3. Security Committees and Steering Groups**
Many organisations establish a **Security Committee** or **Information Security Steering Group** — a cross-functional body that includes representatives from IT, Legal, HR, Finance, and Operations. This committee:
- Reviews risk register updates
- Approves major security investments
- Ensures security decisions reflect business-wide priorities, not just IT priorities
- Provides a forum for escalating security issues that span departments

**4. Operational Management and Asset Owners**
Individual managers and team leaders are responsible for security within their own domains. The HR Director owns people-related risks. The Head of Finance owns financial data. The IT Manager owns technical infrastructure. These people are called **risk owners** or **asset owners** — they are accountable for specific risks and controls within their area.

**5. All Staff**
Every employee is a participant in governance. Policies apply to everyone. Security training is for everyone. Incident reporting is everyone's responsibility. Governance without staff engagement is governance on paper only.

---

### What Governance Produces

Good governance produces several concrete outputs:

**Policies**
Policies are formal statements of management's intent. An **Information Security Policy** says: "This organisation is committed to protecting the confidentiality, integrity, and availability of its information assets." It is signed by the CEO or board. It is not a technical document — it is a *governance* document, setting direction and establishing accountability.

**Roles and Responsibilities**
Governance defines who does what. A **RACI matrix** (Responsible, Accountable, Consulted, Informed) is a common tool. For example, for the risk assessment process:
- *Responsible*: Security Analyst (does the work)
- *Accountable*: CISO (owns the outcome)
- *Consulted*: IT Manager, Legal (provide input)
- *Informed*: Board (receives the results)

**Objectives and Strategy**
Governance produces a security strategy — a multi-year plan that defines where the organisation wants to be in terms of security maturity and how it will get there. This strategy is aligned to business objectives. Security exists to enable the business, not obstruct it.

**Reporting and Oversight**
Governance produces regular reporting upward — from operational teams to the CISO, from the CISO to the Security Committee, from the Security Committee to the board. These reports translate technical findings into business language: not "we had 4,000 failed login attempts" but "there is evidence of credential stuffing attacks targeting our customer portal; here is the residual risk and what we are doing about it."

---

## The Details That Matter

### Governance Frameworks

Several frameworks provide structure for how governance should be designed. The most important ones a GRC professional must know:

**ISO 27001 (Clause 5 — Leadership)**
ISO 27001 requires top management to demonstrate leadership and commitment to the ISMS. This means: approving the information security policy, ensuring security objectives are set, and ensuring the ISMS is integrated into business processes. The standard explicitly requires that governance exists and is visible — you cannot delegate governance away to a junior analyst.

**COBIT (Control Objectives for Information and Related Technologies)**
COBIT is a framework specifically for IT governance and management. It distinguishes between *governance* (evaluate, direct, monitor — what the board does) and *management* (plan, build, run, monitor — what executives and IT do). COBIT 2019 provides detailed guidance on governance structures, roles, and processes.

**NIST Cybersecurity Framework (CSF) 2.0**
The 2024 update to the NIST CSF added a sixth function: **Govern**. This explicitly elevated governance to be the foundation upon which all other security activities (Identify, Protect, Detect, Respond, Recover) depend. This is a significant development — it signals that the security community now formally recognises that technology controls are ineffective without governance foundations.

**King IV (South Africa) / UK Corporate Governance Code**
These are corporate governance codes that define how boards should operate. They apply to listed companies and set expectations for risk oversight, transparency, and accountability — including for information security risk.

### Security Strategy vs Security Policy vs Security Procedure

These three are often confused. Here is the distinction:

| Document | What it is | Who writes it | Who approves it | How long it lasts |
|---|---|---|---|---|
| **Security Strategy** | Where we are going and why (3–5 year direction) | CISO | Board | 3–5 years, reviewed annually |
| **Security Policy** | What we require and why (management intent) | CISO / Security team | Board / CEO | 1–3 years, annual review |
| **Security Standard** | Specific requirements that implement the policy | Security team | CISO | 1–2 years |
| **Security Procedure** | Step-by-step instructions for how to do something | Operational teams | IT Manager / CISO | Frequent updates |

All of these are governance artefacts — they document decisions made by people with authority and accountability.

### Segregation of Duties (SoD)

One of the most important governance controls. It means that no single individual should have end-to-end control over a critical process. If one person can both *initiate* and *approve* a transaction, there is nothing to stop fraud or error.

Examples:
- The person who requests a new user account should not be the same person who creates it
- The developer who writes code should not be the same person who deploys it to production
- The person who processes a payment should not be the same person who reconciles the accounts

This is what Barings Bank failed to do with Nick Leeson. Segregation of duties is a foundational governance control that appears in virtually every framework.

### The Principle of Accountability

Governance only works if someone is genuinely accountable for each risk and control — meaning they bear the consequences if it fails. This is different from being *responsible* (doing the work) or being *informed* (just knowing about it).

In practice, accountability means: if this risk materialises and causes harm, this named person must explain to the board what happened and why. That is why boards exist. That is why CISOs exist. That is why risk registers name risk owners.

Without real accountability, governance is decoration.

---

## Common Mistakes and Failures

**1. Governance by committee with no individual accountability.**
Security Committees that collectively own decisions but nobody is individually accountable. When something goes wrong, everyone points at the committee. Fix: every risk and every major control must have a named owner.

**2. Security policy that nobody has read.**
The Information Security Policy is approved by the board, printed, filed, and never seen again. Employees have never been trained on it. It was last updated in 2019. This is governance theatre. Fix: policies must be communicated, trained, accessible, and reviewed regularly.

**3. CISO reporting to the CTO or CIO.**
When the CISO reports to the technology function, there is an inherent conflict of interest — security needs are often at odds with technology speed and cost. Best practice is for the CISO to report directly to the CEO or board. This gives security a genuinely independent voice.

**4. Board treating security as purely a technology problem.**
"That's an IT matter" is one of the most dangerous phrases in corporate governance. Every board member needs to understand that information security risk is business risk — it affects reputation, revenue, regulatory standing, and operational continuity.

**5. Strategy without resource.**
A beautiful 5-year security strategy that was never funded. Governance must translate strategy into budget, headcount, and actual programme delivery. Strategy on paper with no resource is not governance — it is wishful thinking.

**6. No management review.**
ISO 27001 requires regular management review of the ISMS (see G3-16). Organisations skip this because it is inconvenient. The result is a governance structure that is never updated, never challenged, and drifts out of alignment with the organisation's actual risks.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Clause 5 of ISO 27001 is entirely about Leadership (governance). Auditors will look for evidence of top management commitment — not just a signed policy, but actual involvement. Can the CISO demonstrate that the board receives security reports? Is there a management review record? Who approved the information security objectives?
- Key terms: *top management*, *information security policy*, *roles and responsibilities*, *management review*, *security objectives*.
- Common finding: "The information security policy has not been communicated to all relevant personnel" — a Clause 5.2/7.4 nonconformity.

**CISM:**
- Domain 1 is Information Security Governance. CISM tests whether you can *build* and *manage* a governance framework, not just describe one.
- Expect scenario questions like: "A new CISO joins a company and finds no security strategy. What should they do first?" (Answer: understand the business context and objectives before drafting anything — governance must be aligned to business goals.)
- Key concepts: alignment with business objectives, board reporting, security strategy development, roles and responsibilities.

**CISSP:**
- Domain 1 (Security and Risk Management) covers governance concepts including due care vs due diligence, ethics, security governance principles, and organisational roles.
- *Due care* = doing what a reasonable person would do (having the policies and controls in place). *Due diligence* = actively verifying that those controls are working.

**CRISC:**
- Governance is the context for all risk management in CRISC. The risk framework, risk appetite, and risk tolerance are all governance outputs that CRISC candidates must understand deeply.

---

## GUARDIAN's Take

The single biggest governance failure I see, repeated across every sector and every size of organisation, is this: *governance exists on paper, but not in behaviour*.

The policy says "all systems must be patched within 30 days of a critical vulnerability." The board approved it. The CISO signed it. And yet, when you walk into an internal audit and pull the evidence, 40% of servers have not been patched in six months. Why? Because nobody with real authority is checking. Nobody is being held accountable. The governance structure exists, but it has no teeth.

Good governance is not about documents. Documents are just artefacts of decisions. Good governance is about *culture* — whether the people at the top genuinely behave as if security matters, and whether that behaviour cascades down through every layer of the organisation.

When a CEO says "I need to understand this breach because I am responsible" — that is governance working. When a CEO says "IT will handle it, keep me out of it" — that is governance failing.

Your job in GRC is not just to build the governance structures. It is to make them real. To put accountability where it belongs. To make sure the board is not just informed but genuinely engaged. To make sure policies are not just written but lived.

That is the difference between a GRC professional who is valuable and one who is just a document factory.

---
*Module: Module 1 — Foundations | Guardian Curriculum*
