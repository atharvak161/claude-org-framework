---
tags: [guardian, grc, module-14, grc-in-practice, grc-function, programme-build, ciso]
module: 14
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: advanced
date: 2026-04-28
guardian-refs: ["G1-01 — What is GRC", "G3-01 — What is ISO 27001", "G9-01 — Policy Hierarchy", "G12-02 — CISM Domain 1", "G10-02 — Audit Planning"]
---

# G14-01 — Building a GRC Function from Scratch

> [!abstract] What This Note Covers
> By the end of this note, you will understand how to build a GRC function where none exists — from securing sponsorship through establishing the governance infrastructure, risk programme, compliance framework, and reporting mechanisms that make the function operationally credible.

---

## Why This Exists

Many GRC professionals will face this situation: arriving at an organisation with no formal GRC function, no documented risk register, no structured compliance programme, and an information security policy that was last updated in 2017 and nobody follows. The technical knowledge from this curriculum tells you what good looks like. This note tells you how to get there from nothing.

Building a GRC function is a change management challenge as much as a technical one. The technical elements (policies, risk registers, control frameworks) are the easier part. The harder part is getting the organisation to take GRC seriously — securing genuine executive sponsorship, building cross-functional relationships, and establishing the credibility that makes policies enforceable and risk decisions meaningful.

---

## Phase 1: Understand Before You Build (Weeks 1–4)

### The Discovery Mandate

Before building anything, understand what exists, what matters, and what the organisation actually needs. This phase is entirely investigative — no deliverables, no frameworks, no policies. Just listening and learning.

**Understanding the business:**
- What does the organisation do? What are its revenue drivers? What are its strategic priorities for the next 3 years?
- Who are the key customers and what do they require? (Enterprise customers requiring ISO 27001? US customers requiring SOC 2? Government contracts requiring Cyber Essentials?)
- What regulatory environment applies? (GDPR? PCI DSS? FCA? NHS DSP Toolkit? Sector-specific requirements?)
- What is the organisation's risk appetite? Has this ever been articulated to the board?

**Understanding the existing state:**
- What security and GRC activities already exist (even informally)?
- What incidents have occurred in the past 2–3 years?
- What audit findings have been raised (internal or external)?
- What compliance obligations exist and how are they currently managed?
- What is the IT environment? (Cloud-first? Legacy on-premise? Hybrid?) What systems are most critical?

**Understanding the people:**
- Who are the key stakeholders? Who cares about GRC and who doesn't?
- Who currently owns security informally (even if the role doesn't formally exist)?
- What is the organisational culture toward security — engaged? resistant? indifferent?
- Who has the CISO's/GRC lead's trust with the CEO, CFO, and board?

**Output of Phase 1**: A discovery report (internal working document) that describes: current state; business context; regulatory obligations; key stakeholder map; top 5 risks identified in discovery; and the recommended approach for Phase 2.

---

## Phase 2: Secure the Foundation (Weeks 4–8)

### Executive Sponsorship

The single most important Phase 2 activity. Without genuine executive sponsorship — a senior leader who actively supports the GRC function, provides resources, and holds the organisation accountable — the GRC function will be a paper exercise.

**Securing sponsorship:**

Present the discovery report to the CEO or CFO with a clear framing:
- What the organisation currently lacks (and what that means in terms of risk and regulatory exposure)
- What is required (the programme and its resource requirements)
- What the organisation gains (risk reduction; regulatory compliance; customer confidence; insurance terms)
- What happens if nothing changes (regulatory risk; likely breach scenarios; competitive disadvantage)

**The sponsorship test**: The sponsor must be willing to: approve the budget required; send communications to the organisation confirming their support; participate in governance meetings; and — most critically — enforce GRC requirements when business units push back.

### Establishing the Governance Structure

**Information Security Steering Committee**: Establish within the first 8 weeks. Membership: CISO/GRC lead; CEO representative (or CEO directly); CFO; CITO/CTO; Head of Legal; Head of HR; 1–2 business unit representatives. Meeting frequency: quarterly minimum.

**Reporting line**: Confirm the CISO/GRC lead's reporting line — ideally direct to CEO or a board-level committee, not buried in IT.

**RACI for security decisions**: Define who is Responsible, Accountable, Consulted, and Informed for key security decisions (policy approval; risk acceptance; incident declaration; audit findings).

### The Minimum Viable Policy Set

Don't write 30 policies in month 1. Write the 4–5 policies that provide the governance foundation everything else builds on:

1. **Information Security Policy** (overarching — board approval)
2. **Acceptable Use Policy** (all staff; immediate communication required)
3. **Data Classification Policy** (enables all subsequent data handling)
4. **Incident Management Policy** (enables incident response before the formal programme is built)
5. **Access Control Policy** (addresses the highest-risk area in most organisations)

Everything else can follow in the programme build phase.

---

## Phase 3: Build the Risk Programme (Months 2–4)

### Risk Assessment Methodology

Before conducting a risk assessment, establish the methodology. The methodology document defines:
- Likelihood scale (1–5 with definitions)
- Impact scale (1–5 with definitions across multiple impact dimensions: financial, operational, reputational, regulatory)
- Risk rating matrix (likelihood × impact)
- Risk appetite statement (initially drafted; approved by steering committee)
- Risk treatment thresholds (which risk ratings require what treatment)
- Risk register structure and review frequency

**Sequence**: Methodology approved first; risk assessment conducted second. A risk assessment conducted without an approved methodology produces results that can be challenged ("why is this a 4 rather than a 3?"). A methodology-driven assessment is defensible.

### The First Risk Assessment

**Scope**: Cover the entire organisation in the first pass — broad strokes. Depth can be added in subsequent cycles.

**Method for the first assessment**: Workshops with business unit heads to identify:
- Critical assets (what are the most important information assets?)
- Key threats (what are the most significant threats to those assets?)
- Existing controls (what controls currently mitigate those threats?)
- Impact of failure (what would the business impact be if this risk materialised?)

**Output**: Risk register v1.0 with 20–40 risks across all critical areas. Each risk: description; asset; threat; likelihood; impact; residual risk; treatment decision; owner; action.

**Communicate the risk register**: Present to the steering committee. Identify the top 5 risks. Get acknowledgement. This is the beginning of genuine risk governance.

---

## Phase 4: Build the Control Framework (Months 3–6)

### Framework Selection

Based on the business context (customer requirements; regulatory obligations; maturity target), select the primary control framework:
- UK/EU enterprise customers → ISO 27001 as the management system; ISO 27002 as the control catalogue
- US enterprise customers → Add SOC 2 as a parallel assurance mechanism
- Government contracts → Add Cyber Essentials/Plus
- Payment processing → Add PCI DSS controls

**Start with ISO 27001 as the foundation**: Even if full certification is 18 months away, implementing ISO 27001's management system from the start creates the right infrastructure.

### Control Gap Assessment

Using the selected framework as the criterion, assess the current control environment:
- For each applicable Annex A control: is it implemented? How well? What is the gap?
- Output: Gap assessment report showing: implemented (green), partially implemented (amber), not implemented (red) for each control.

**Prioritise the gaps**: Sort by risk — close the highest-risk gaps first. A gap in access management (A.5.15–A.5.18) is higher risk than a gap in physical visitor management (A.7.2).

### Standards and Procedures

For each prioritised control gap, develop:
- The standard that defines the specific measurable requirement
- The procedure(s) that describe how to implement it
- The monitoring mechanism that verifies ongoing compliance

Build the documentation proportionate to priority — write the access management standard before the secure printing procedure.

---

## Phase 5: Establish the Audit Programme (Months 5–8)

**Why internal audit early**: The ISO 27001 internal audit requirement (Clause 9.2) requires audits of the management system. But beyond compliance, internal audit creates the evidence culture that makes GRC real — moving from "we have a policy" to "here is the evidence we follow it."

**Internal audit approach for a new function:**

*Year 1 audit programme*: Focus on the highest-risk areas. One or two focused audits (process-level) rather than attempting a full ISMS audit.

*Auditor independence*: The GRC team cannot audit their own work. For a small team, this may mean: cross-training (IT audit colleagues audit security; security audits IT); external specialist for first-year audits; or a co-sourced approach where an external auditor leads and internal staff participate.

*First audit topic recommendation*: Access management — universally high risk; typically has significant gaps in organisations without mature GRC; produces findings that demonstrate the value of the GRC programme immediately.

---

## Phase 6: Deliver First Wins and Build Credibility (Months 3–9 Ongoing)

**GRC functions fail when they are seen as bureaucratic overhead.** The phase 3–9 period is as much about demonstrating value as building programme infrastructure.

**First win categories:**

*Risk visibility*: "Before the GRC function, management had no consolidated view of security risk. Now the board sees a quarterly risk dashboard. Two risks that were unknown are now being actively managed."

*Compliance efficiency*: "The organisation was responding to 15 separate customer security questionnaires per month with inconsistent answers. The GRC function has built a response library that reduced this to 2 hours per questionnaire."

*Incident improvement*: "The organisation had no formal incident response procedure. When an incident occurred last month, the new procedure was followed — regulatory notification was made within the GDPR window and management was properly informed."

*Certification progress*: "Cyber Essentials certification was achieved in month 4, satisfying the government contract requirement that had been blocking the £X revenue opportunity."

**Communicate wins**: Send a quarterly GRC programme update to the steering committee. Brief format: progress against plan; current risk posture; top risks; key wins; upcoming activities. Keep it to one page — management will read a one-page update; they will not read a 20-page report.

---

## Phase 7: Target Certification (Months 12–24)

**ISO 27001 certification** is typically achievable within 12–24 months of starting a programme from scratch, depending on:
- Organisational complexity and size
- Starting maturity level
- Resource availability
- Scope definition

**The certification path:**
1. Scope definition and ISMS documentation (policy framework, risk assessment, SoA, risk treatment plan) — complete by month 12
2. ISMS operational period: 3–6 months of operation before Stage 2 audit (collecting evidence)
3. Stage 1 audit (documentation review): Month 15–18
4. Stage 2 audit (operational evidence): Month 18–24
5. Certificate issued (assuming successful Stage 2): Month 18–24

**Pre-certification readiness assessment**: 2–3 months before the Stage 1 audit, conduct a readiness assessment (internal or external) to identify gaps. Address findings before the formal audit.

---

## Common Failures in GRC Function Build

**1. Building documentation before securing sponsorship.**
50 policies with no executive enforcement mechanism. Nobody reads them. Nobody follows them. The GRC function spends months writing documents that have no governance weight. Sponsorship first; documentation second.

**2. Starting with a scope that is too broad.**
Attempting to implement ISO 27001 across the entire organisation simultaneously — all systems, all locations, all processes. The scope is unmanageable; the programme stalls; nothing is completed. Start with a defensible, achievable scope; expand in subsequent certification cycles.

**3. Not communicating the risk register outputs.**
A risk register that sits in a SharePoint folder and is never presented to management is not risk governance — it is risk theatre. Present risks to the steering committee. Get treatment decisions on record. Make risk management visible.

**4. Over-engineering the policy framework.**
30 policies, 50 standards, 100 procedures — all in month 1. None are implemented; all are outdated by month 6. Build the minimum viable policy set first; add depth based on risk priorities.

**5. No quick wins.**
A GRC function that takes 18 months to produce its first visible output will lose executive support, budget, and organisational credibility. Plan for quick wins — certification milestones; risk register presented to board; compliance gap closed — within the first 6 months.

---

## The GRC Professional as Change Agent

The most important skill for building a GRC function is not technical knowledge — it is the ability to create change. GRC is not a back-office function; it is a business transformation function that changes how the organisation thinks about and manages risk.

**Change agent disciplines:**
- Lead with business language, not security language
- Make the risk personal for each stakeholder (the CEO's risk is reputational; the CFO's is financial; the CTO's is operational disruption)
- Find allies in unexpected places — the Legal team (regulatory risk), Finance (insurance and financial exposure), Customer Success (customer security requirements)
- Celebrate and publicise every win
- Acknowledge setbacks honestly and learn from them
- Be patient — cultural change takes 2–3 years minimum

**The GUARDIAN curriculum in practice**: Everything in this 105-note curriculum is the knowledge foundation. Building a GRC function is the application — and it requires every module: governance structure (Module 1), risk methodology (Module 2), ISO 27001 implementation (Modules 3–4), GDPR compliance (Module 5), PCI DSS if applicable (Module 6), framework selection (Module 7), BCM (Module 8), policies (Module 9), audit (Module 10), TPRM (Module 11).

The curriculum gives you the knowledge to know what good looks like. Building the function requires the judgment to know where to start, the communication skills to secure buy-in, and the persistence to see it through.

---
*Module: Module 14 — GRC in Practice | Guardian Curriculum*
