---
tags: [guardian, grc, module-1, foundations, three-lines, governance, risk]
module: 1
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: beginner
date: 2026-04-15
guardian-refs: ["G1-02 — Governance Explained", "G1-03 — Risk Explained", "G1-04 — Compliance Explained", "G1-07 — Key Roles in GRC", "G2-05 — The Risk Register", "G10-01 — What is an Audit"]
---

# G1-05 — The Three Lines of Defence Model

> [!abstract] What This Note Covers
> By the end of this note, you will understand the Three Lines of Defence model — what it is, why it exists, how each line operates in practice, and how the model structures accountability for risk and control across an entire organisation.

---

## Why This Exists

Imagine a medieval castle. The designers did not rely on a single wall to keep enemies out. They built multiple layers of protection: a moat, an outer wall, a gatehouse, an inner wall, and finally the keep at the centre. Each layer was independent. If an attacker breached the outer wall, the inner wall still stood. If the gatehouse was compromised, the inner defences held.

This is the logic behind the **Three Lines of Defence** model. No single control, no single team, and no single process is enough to manage risk on its own. Organisations need *layered* accountability — multiple independent functions that each play a different role in identifying, managing, and assuring risk.

The model was originally developed in the financial services sector following a series of catastrophic failures where risk was either not identified, not escalated, or not independently verified. It has since been adopted across virtually every regulated sector and is formally embedded in frameworks including the UK Financial Reporting Council's Corporate Governance Code, the Basel Committee on Banking Supervision guidance, and ISO 31000.

In 2020, the Institute of Internal Auditors (IIA) updated the model — renaming it the **Three Lines Model** (dropping "of Defence") to better reflect that the lines are not just defensive but actively contribute to governance and value creation. However, the original "Three Lines of Defence" terminology remains widely used in practice and in exams, so both names are used interchangeably in this curriculum.

---

## What It Is

The Three Lines of Defence model divides risk management accountability across three distinct functions within an organisation, each with a different relationship to risk:

```
┌─────────────────────────────────────────────────────────────┐
│                    GOVERNING BODY (BOARD)                    │
│         Sets direction, risk appetite, oversees all lines    │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                  SENIOR MANAGEMENT (CEO/CISO)               │
│              Directs and supports all three lines            │
└────────┬──────────────────────┬──────────────────┬──────────┘
         │                      │                  │
    ┌────▼────┐            ┌────▼────┐        ┌────▼────┐
    │ FIRST   │            │ SECOND  │        │  THIRD  │
    │  LINE   │            │  LINE   │        │  LINE   │
    │         │            │         │        │         │
    │ Own and │            │ Oversee │        │Independent│
    │ manage  │            │ and     │        │ assurance │
    │  risk   │            │ advise  │        │           │
    └─────────┘            └─────────┘        └─────────┘
```

### The First Line: Own and Manage Risk

**Who they are:** Operational management and staff — the people who *do the work* every day. IT teams, HR, Finance, Sales, Operations, Development teams. Every business unit that handles information, processes transactions, or operates systems.

**What they do:** The first line owns and operates the controls that manage risk in their area. They are the ones who:
- Follow security policies and procedures
- Implement technical controls (access controls, patching, encryption)
- Report incidents through the correct channels
- Conduct self-assessments and monitor their own control effectiveness

**Their relationship to risk:** They create risk (by operating systems and handling data) and they manage it (through the controls they implement). They are closest to the risk — they see it first, and they are best placed to manage it day-to-day.

**Example:** The IT Operations team applies security patches to servers within the required 30-day window, maintains firewall rules, and monitors system logs for anomalies. This is first-line risk management.

---

### The Second Line: Oversee and Advise

**Who they are:** Risk management functions, compliance functions, information security teams (in many organisations), legal, and other oversight functions. The CISO's team often sits in the second line, as do the DPO, the Risk Manager, and the Compliance Officer.

**What they do:** The second line does *not* own or operate controls — that is the first line's job. Instead, the second line:
- Designs the risk management framework that the first line uses
- Sets policies and standards that define how the first line must behave
- Monitors the first line's performance against those standards
- Provides advice and guidance to the first line
- Aggregates risk information from across the organisation into a coherent picture for senior management
- Ensures compliance with regulatory requirements

**Their relationship to risk:** They provide oversight of risk without owning it. They are one step removed from operations — close enough to understand the risks, independent enough to challenge the first line.

**Example:** The Information Security team (second line) sets the patching policy that requires IT Operations (first line) to apply patches within 30 days. The Information Security team monitors compliance with this policy through vulnerability scanning reports and escalates exceptions to the CISO.

---

### The Third Line: Independent Assurance

**Who they are:** Internal audit. Sometimes also external auditors, regulators, and other independent assurance providers. The third line must be genuinely independent of both the first and second lines.

**What they do:** The third line provides *independent, objective assurance* to the board and senior management that the first and second lines are functioning effectively. They:
- Audit the first line's controls — are they actually working?
- Audit the second line's oversight — is it genuinely effective?
- Report directly to the audit committee or board (bypassing management, to preserve independence)
- Identify systemic weaknesses that neither the first nor second line has caught or disclosed

**Their relationship to risk:** They do not manage risk at all. They assess whether risk is being managed adequately by the first and second lines. Their value comes entirely from their independence — they have no stake in the outcome and no incentive to cover up problems.

**Example:** Internal Audit conducts an audit of the patching process. They discover that while IT Operations reports 95% compliance with the 30-day patching window, actual patch deployment records show 40% of critical servers are unpatched beyond 60 days. This is a failure the first and second lines did not catch — and it is exactly what the third line exists to find.

---

### The Governing Body: Above All Three Lines

The board and its committees (particularly the Audit Committee and Risk Committee) sit *above* the three lines. They:
- Set the risk appetite that frames all risk decisions
- Receive assurance from all three lines
- Hold senior management accountable
- Ensure the three lines are adequately resourced and genuinely independent

The governing body is not a "fourth line" — it is the ultimate accountability layer that the three lines report into.

---

## How It Works in Practice

### A Worked Example: A Data Breach Response

**Scenario:** A company's customer database is exfiltrated by an external attacker who exploited a SQL injection vulnerability in the company's web application.

**First Line response:**
- The IT Security Operations team (first line) detects anomalous database queries through their SIEM (Security Information and Event Management system)
- They isolate the affected system, preserve forensic evidence, and notify the incident response lead
- The Development team begins emergency patching of the SQL injection vulnerability

**Second Line response:**
- The Information Security team (second line) activates the Incident Response Plan
- The DPO (second line) assesses whether GDPR breach notification is required (likely yes — 72-hour clock starts)
- The Risk Manager updates the risk register to reflect the materialised risk
- The Compliance Officer notifies the ICO (Information Commissioner's Office)

**Third Line response:**
- Internal Audit is notified of the breach
- They initiate an emergency audit to determine: Was the vulnerability known? Was it in the risk register? Were appropriate controls in place? Did the first and second lines perform their roles effectively?
- Their findings go directly to the Audit Committee — including any failings in the second line's oversight

**Governing Body:**
- The board is briefed by the CISO on the incident, its impact, and the response
- The Audit Committee receives the internal audit's emergency findings
- The board holds the CISO accountable for the remediation programme and asks why the risk was not identified earlier

---

### Where Security Teams Sit

The placement of the information security function within this model varies between organisations and is a topic of genuine debate:

**Option 1: Security team as second line**
The CISO and security team set policy, provide oversight, and monitor the first line. They do not operate controls themselves. IT Operations (first line) implements and runs the controls. This is the cleanest model for large, mature organisations.

**Option 2: Security team split across first and second line**
Security Operations (SOC, patching, access management) sits in the first line. The CISO and risk/compliance functions sit in the second line. Common in medium-sized organisations.

**Option 3: Security team in the first line**
The security team both sets the policy *and* operates the controls. This creates a conflict — the second line is meant to oversee the first line, but if they are the same team, that independence is lost. This is common in smaller organisations out of necessity, but it is a governance weakness that auditors will flag.

There is no single correct answer — but the organisation must be honest about where it sits and manage the independence implications accordingly.

---

## The Details That Matter

### The 2020 IIA Update: Three Lines Model

The IIA's 2020 update made several important changes to the model:

1. **Dropped "of Defence"** — emphasising that the model is about creating value and enabling governance, not just defending against risk
2. **Elevated the role of the governing body** — explicitly naming the board as a participant in the model, not just a passive recipient of reports
3. **Recognised that lines can overlap** — in practice, the boundaries between first and second line are not always clean, especially in smaller organisations
4. **Added "internal audit as trusted advisor"** — the third line can provide consulting services alongside assurance, as long as independence is maintained

For exam purposes: know both names (Three Lines of Defence and Three Lines Model). Most exams still use the older terminology.

### Independence: Why It Matters So Much

The value of the second and third lines depends entirely on their *independence* from the functions they oversee.

- If the second line (compliance) reports to the same executive as the first line (operations), there is pressure to downplay findings
- If the third line (internal audit) is staffed by people who previously ran the processes they audit, objectivity is compromised
- If the third line's budget is controlled by the CISO they are auditing, their findings may be influenced by the funding relationship

Best practice:
- Second line (CISO, Risk, Compliance) reports to the CEO or directly to the board — independent of operational business units
- Third line (Internal Audit) reports to the Audit Committee of the board — independent of all management
- Internal auditors rotate out of areas they have previously worked in (cooling-off periods)

### Common Variations

| Organisation type | Typical structure |
|---|---|
| Large enterprise | Clearly defined separate teams for all three lines, with dedicated Risk and Compliance functions in the second line |
| Mid-size company | Second line combined (CISO covers both security operations and risk oversight); third line via outsourced internal audit |
| Small company | First and second line often merged; third line via external auditor or periodic consultant review |
| Financial services | Highly regulated — FCA expects clearly defined, documented three-lines structure with evidence of independence |

---

## Common Mistakes and Failures

**1. Collapsing the first and second lines into one.**
When the security team both operates controls *and* oversees them, there is no genuine second-line check. The team marks its own homework. Auditors will identify this as a governance gap.

**2. Internal audit that is not genuinely independent.**
Internal audit that reports to the CFO rather than the Audit Committee. Internal audit whose budget is controlled by the CISO they audit. Internal auditors who audit their own previous work. All of these undermine the model.

**3. Third line used as a substitute for the second line.**
Some organisations skip building proper risk and compliance functions (second line) and just rely on internal audit (third line) to find problems. This is backwards — audit is assurance, not risk management. By the time audit finds a problem, it has usually already caused harm.

**4. Lines that do not communicate.**
The three lines should collaborate and share information — while maintaining independence. Risk identified by internal audit should inform the second line's risk framework. Second-line monitoring results should inform the first line's priorities. Silos between the lines are a governance failure.

**5. First line that does not understand it is the first line.**
IT Operations teams that think "security is the security team's job." Every member of the first line is a risk manager. If they do not understand this, controls will be bypassed, incidents will not be reported, and the entire model breaks down at its foundation.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- The three lines model underpins how ISO 27001 assigns responsibility: Clause 5 (Leadership/Governance — above the lines), Clause 6/8 (Operation — first line), Clause 9 (Performance Evaluation — second and third line activity).
- Internal audit (Clause 9.2) is a third-line activity. Management review (Clause 9.3) is a governing body activity.
- Auditors often ask: "Who monitors the effectiveness of your controls?" A strong answer describes genuine second-line oversight and third-line audit — not just "we check ourselves."

**CISM:**
- The three lines model is directly relevant to Domain 1 (Information Security Governance). CISM tests whether candidates understand the governance structure within which the CISO operates and how to position the security function effectively.
- Common scenario: "Where should the CISO report in the organisation structure?" — the answer reflects the independence principle of the three lines model.

**CRISC:**
- CRISC Domain 4 (Risk and Control Monitoring) maps to second-line activity. Understanding the three lines helps CRISC candidates explain *who* does the monitoring and *why*.

**CISSP:**
- Domain 1 covers organisational roles and governance structures. The three lines model provides the framework for understanding how CISOs, risk managers, and auditors relate to each other and to the board.
- *Due care* (first line — implementing controls) vs *due diligence* (second and third line — verifying controls work) is a related CISSP concept.

---

## GUARDIAN's Take

I have been called in to help organisations after serious incidents more times than I care to count. And in almost every case, when I ask "how did this happen?", the answer traces back to a failure of the three lines model — usually one of three patterns:

**Pattern 1: No second line.** A small or mid-sized company where the security team is the first line *and* the second line. There is nobody watching the watchers. Problems fester undetected.

**Pattern 2: A second line with no teeth.** The compliance function exists, produces reports, raises findings — and is ignored by the first line because there is no governance consequence for ignoring them. The board never sees the findings. Nobody is held accountable. The second line becomes a document factory.

**Pattern 3: A third line that audits what it is told to audit.** Internal audit whose scope and programme is determined by the executive — meaning they never audit the things the executive does not want audited. Independence is a fiction.

The three lines model only works when three conditions are met:
1. Each line genuinely understands its role and does not try to do the other lines' jobs
2. Each line has genuine independence from the lines it oversees
3. The governing body actively uses the information it receives — and acts on it

When those conditions are met, the model is genuinely powerful. Risks get caught at multiple layers. Failures in one line get caught by another. The board has real assurance, not manufactured comfort.

Build the model properly. Fight to preserve independence. And make sure the board is not just receiving reports — but reading them, challenging them, and demanding action.

---
*Module: Module 1 — Foundations | Guardian Curriculum*
