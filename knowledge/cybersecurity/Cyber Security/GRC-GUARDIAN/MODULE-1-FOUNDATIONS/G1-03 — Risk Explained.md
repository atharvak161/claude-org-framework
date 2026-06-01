---
tags: [guardian, grc, module-1, foundations, risk]
module: 1
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: beginner
date: 2026-04-15
guardian-refs: ["G1-01 — What is GRC and Why It Exists", "G1-02 — Governance Explained", "G1-04 — Compliance Explained", "G2-01 — What is Risk", "G2-02 — Risk Appetite and Risk Tolerance", "G2-06 — Risk Treatment"]
---

# G1-03 — Risk Explained

> [!abstract] What This Note Covers
> By the end of this note, you will understand what risk means in an information security context, how it is composed (threat, vulnerability, asset, likelihood, impact), and how risk management works as a discipline — from identification through to treatment.

---

## Why This Exists

In August 2016, a hacker group called Shadow Brokers publicly released a set of powerful cyberattack tools that had been developed by the NSA (the United States National Security Agency). Among them was a tool called **EternalBlue**, which exploited a vulnerability in Microsoft's Windows operating system.

Microsoft had already released a patch for this vulnerability in March 2017. Most organisations should have applied it within weeks. Many did not.

In May 2017, a ransomware attack called **WannaCry** used EternalBlue to infect over 230,000 computers in 150 countries in a single day. The UK's National Health Service was devastated — thousands of appointments cancelled, ambulances diverted, operations postponed. The estimated global cost was $4–8 billion.

Here is what makes this tragedy so instructive: the risk was known. The vulnerability was identified. The patch was available. The threat was foreseeable. What was missing was a functioning **risk management process** — a systematic way of identifying, assessing, prioritising, and treating risks before attackers could exploit them.

WannaCry was not a failure of technology. It was a failure of risk management. And it cost lives.

Risk management exists because the world is uncertain, threats are real, and doing nothing about risk is itself a decision — usually the worst one.

---

## What It Is

**Risk**, in the information security context, is defined formally as:

> *The potential for loss or harm related to technical infrastructure or the use of technology within an organisation.*

More practically, risk is the combination of:

1. **The likelihood that something bad will happen**
2. **The impact it would have if it did**

If something is very likely but causes no harm — not much of a risk. If something is catastrophic but essentially impossible — not much of a risk either. Risk lives in the intersection of likelihood and impact.

The standard formula is:

```
Risk = Likelihood × Impact
```

But to understand risk properly, you need to understand its components.

---

### The Four Components of Risk

**1. Asset**
An asset is anything of value to the organisation that needs protecting. Assets are not just technology — they include:

| Asset Type | Examples |
|---|---|
| Information assets | Customer databases, financial records, intellectual property, employee data |
| Physical assets | Servers, laptops, network equipment, buildings |
| Software assets | Operating systems, applications, source code |
| Human assets | Staff, contractors, knowledge held by key individuals |
| Service assets | Cloud services, utilities, supplier relationships |

Every risk is ultimately a risk *to* an asset. You cannot assess risk without first knowing what you are trying to protect.

**2. Threat**
A threat is anything that has the potential to cause harm to an asset. Threats are external to the asset itself — they are forces or actors that *could* exploit a weakness.

| Threat Category | Examples |
|---|---|
| Malicious external actors | Hackers, cybercriminal gangs, nation-state attackers, script kiddies |
| Malicious internal actors | Disgruntled employees, insider threat, corporate espionage |
| Accidental internal | Staff errors, misconfiguration, accidental data deletion |
| Environmental | Fire, flood, power failure, extreme weather |
| Technical failure | Hardware failure, software bugs, system crashes |
| Supply chain | Compromised third-party software, vendor breaches |

A useful mental model: a threat is like bad weather. It exists regardless of what you do. You cannot prevent rain from existing. What you can do is make sure your roof (your controls) is good enough to keep it out.

**3. Vulnerability**
A vulnerability is a weakness in an asset that a threat can exploit. It is the gap between where you are and where you need to be.

Examples:
- An unpatched operating system (the WannaCry example) — a technical vulnerability
- A staff member who has never received phishing awareness training — a human vulnerability
- A server room with no fire suppression system — a physical vulnerability
- A supplier contract with no security requirements — a process vulnerability

The relationship between threat and vulnerability is critical: **a threat without a vulnerability causes no harm**. Rain (threat) does not matter if your roof (controls/no vulnerabilities) is watertight. EternalBlue (threat) could not cause harm to a patched system (no vulnerability).

**4. Impact**
Impact is what happens when a threat successfully exploits a vulnerability. It is the consequence — the actual harm caused.

Impact is measured across multiple dimensions:

| Impact Dimension | What it means |
|---|---|
| Financial | Direct costs (fines, recovery, legal fees) and indirect costs (lost revenue, customer churn) |
| Reputational | Damage to brand, loss of customer trust, negative press coverage |
| Operational | Disruption to services, downtime, inability to operate normally |
| Legal/Regulatory | Fines, enforcement action, prosecution, loss of operating licence |
| Safety | Physical harm to people (critical infrastructure, healthcare) |

Impact is not just about money. The WannaCry impact on the NHS was measured in patient harm, not just pounds sterling.

---

### Putting It Together: A Risk Statement

A well-formed risk statement combines all four elements. Here is a template:

> *"There is a risk that [threat] will exploit [vulnerability] in/of [asset], resulting in [impact]."*

Example:
> *"There is a risk that an external attacker will exploit the absence of multi-factor authentication on the remote access VPN to gain unauthorised access to internal systems, resulting in a data breach of customer records, regulatory fines under GDPR, and significant reputational damage."*

This is how risks should be documented in a **risk register** — not vaguely ("cybersecurity risk") but specifically, with named components and named consequences.

---

## How It Works in Practice

### The Risk Management Lifecycle

Risk management is not a one-time event. It is a continuous cycle. ISO 31000 (the international standard for risk management) describes it as:

```
Establish Context
       ↓
  Identify Risks
       ↓
  Analyse Risks
       ↓
  Evaluate Risks
       ↓
  Treat Risks
       ↓
Monitor and Review
       ↑___________↩
```

**Step 1 — Establish Context**
Before you can assess risks, you need to understand the organisation's objectives, its environment, its assets, and its stakeholders. What is the organisation trying to achieve? What would threaten that? This is why ISO 27001 Clause 4 (Context of the Organisation) comes before Clause 6 (Risk Planning) — you cannot assess risk without understanding context.

**Step 2 — Identify Risks**
Systematically discover what could go wrong. Methods include:
- Workshops with business units
- Review of historical incidents (internally and in the wider industry)
- Threat intelligence feeds
- Vulnerability scanning results
- Review of audit findings
- Supply chain review

The goal is a comprehensive list of risks — the **risk register**. Nothing should be left off the list at this stage, even if it seems unlikely.

**Step 3 — Analyse Risks**
For each identified risk, assess:
- **Likelihood**: How probable is it that this risk will materialise? (1–5 scale, or Low/Medium/High/Critical)
- **Impact**: If it does materialise, how bad is it? (same scale)
- **Inherent risk**: The risk level *before* any controls are applied
- **Control effectiveness**: What controls exist? How well do they work?
- **Residual risk**: The risk level *after* controls are applied

**Step 4 — Evaluate Risks**
Compare residual risks against the organisation's **risk appetite** (covered in detail in G2-02). Some risks will be acceptable — the organisation is comfortable with the residual level. Others will exceed the risk appetite and require treatment.

**Step 5 — Treat Risks**
For risks that exceed appetite, choose a treatment option:

| Treatment | What it means | Example |
|---|---|---|
| **Mitigate** (Reduce) | Implement controls to reduce likelihood or impact | Apply the patch, add MFA, train staff |
| **Transfer** | Shift the financial consequence to a third party | Buy cyber insurance, outsource to an MSSP |
| **Avoid** | Stop doing the activity that creates the risk | Discontinue a product line, exit a market |
| **Accept** | Consciously decide to live with the risk | Document the decision, get sign-off from risk owner |

Note: *Accept* is a legitimate treatment option — but it must be a *conscious, documented decision* made by someone with the authority to make it. Ignoring a risk is not acceptance. Acceptance means: "We know this risk exists, we have assessed it, and we have decided the cost of treatment exceeds the benefit."

**Step 6 — Monitor and Review**
Risks change. New threats emerge. Controls become ineffective. The business changes. The risk register must be a living document — reviewed regularly (at minimum annually, ideally quarterly for high risks) and updated when circumstances change.

---

## The Details That Matter

### Inherent vs Residual Risk

This distinction is fundamental and appears constantly in audits and exams.

- **Inherent risk**: The level of risk *before* any controls are applied. What would the risk be if we did nothing?
- **Residual risk**: The level of risk *after* controls are applied. What risk remains despite our controls?

The goal of risk management is not to eliminate residual risk (impossible) but to reduce it to a level within the organisation's risk appetite.

If residual risk still exceeds risk appetite, the organisation must either:
a) Add more controls (further reduce likelihood or impact)
b) Transfer the risk (insurance)
c) Avoid the risk entirely
d) Formally accept the elevated risk (with documented senior sign-off)

### Likelihood Assessment

Likelihood can be assessed qualitatively (using descriptive labels) or quantitatively (using probabilities and historical data).

**Qualitative example:**

| Score | Label | Description |
|---|---|---|
| 1 | Rare | Could happen but very unlikely — less than once in 10 years |
| 2 | Unlikely | Might happen occasionally — once in 5–10 years |
| 3 | Possible | Could happen at some point — once in 1–5 years |
| 4 | Likely | Will probably happen — could occur in any given year |
| 5 | Almost certain | Expected to happen — multiple times per year |

**Quantitative example:**
Using historical data and threat intelligence: "Phishing campaigns targeting financial services firms occur at a rate of approximately 3 per year; our current controls have a 70% success rate at blocking them; therefore the annualised probability of a successful phishing attack is approximately 0.9 per year."

Quantitative is more precise but requires data. Most organisations start with qualitative and mature toward quantitative over time.

### The Risk Matrix (Heat Map)

The risk matrix — also called a heat map — is the visual tool most commonly used to display risks. It maps likelihood against impact on a grid, with colour coding to show severity.

```
         IMPACT
         Low  Med  High  Crit
    ┌─────┬────┬─────┬──────┐
 5  │  M  │ H  │  C  │  C   │  Almost Certain
    ├─────┼────┼─────┼──────┤
 4  │  L  │ M  │  H  │  C   │  Likely
    ├─────┼────┼─────┼──────┤
 3  │  L  │ M  │  H  │  H   │  Possible
    ├─────┼────┼─────┼──────┤
 2  │  L  │ L  │  M  │  H   │  Unlikely
    ├─────┼────┼─────┼──────┤
 1  │  L  │ L  │  L  │  M   │  Rare
    └─────┴────┴─────┴──────┘
        L = Low | M = Medium | H = High | C = Critical
```

Risks in the top-right (Critical) quadrant demand immediate treatment. Risks in the bottom-left (Low) may be accepted. Everything in between requires a judgment call based on risk appetite.

### Risk Appetite vs Risk Tolerance vs Risk Threshold

Three related but distinct concepts (covered fully in G2-02):

- **Risk appetite**: The overall amount and type of risk the organisation is *willing to pursue or accept* in order to achieve its objectives. Set by the board. Strategic.
- **Risk tolerance**: The acceptable variation around the risk appetite. The practical boundaries within which management operates.
- **Risk threshold**: The point at which a risk must be escalated or treated. A hard line.

Example: "We have an appetite for moderate cybersecurity risk in pursuit of digital innovation. Our tolerance allows residual risks rated up to High on our 5×5 matrix. Any risk rated Critical must be escalated to the board within 48 hours."

---

## Common Mistakes and Failures

**1. Risk assessment as an annual event.**
Risk is not static. Threats change monthly. Vulnerabilities are discovered daily. An annual risk assessment that sits unchanged for 12 months is not risk management — it is a compliance exercise. High and critical risks should be reviewed at least quarterly.

**2. Vague risk statements.**
"Cybersecurity risk" is not a risk statement. "There is a risk that ransomware will encrypt our production database, causing operational downtime and financial loss" is. Vague risks cannot be assessed, cannot be treated, and cannot be tracked.

**3. Confusing threat with risk.**
"Ransomware is a risk" — no, ransomware is a threat. The risk is: ransomware exploiting an unpatched vulnerability in our RDP configuration, resulting in encryption of our file servers and an estimated 5-day operational outage.

**4. Ignoring residual risk.**
Implementing a control and assuming the risk is gone. Controls reduce risk; they rarely eliminate it entirely. The residual risk must still be tracked and managed.

**5. Risk register owned by one person.**
When the risk register belongs only to the security team, risks in HR, Finance, and Operations go unidentified. Risk ownership must be distributed across the business, with business unit managers owning the risks in their domain.

**6. Accepting risk without authority.**
A junior analyst deciding to "accept" a Critical risk without escalating to the CISO or board. Risk acceptance decisions must be made at the appropriate level of authority, matched to the level of risk.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- ISO 27001 Clause 6.1 requires a formal information security risk assessment process. Auditors will ask: How do you identify risks? How do you assess likelihood and impact? How do you decide what to treat? What is your risk acceptance criteria?
- The standard does not prescribe a specific methodology — but there must be *a* methodology, consistently applied and documented.
- Key terms: *risk owner*, *risk assessment*, *risk treatment plan*, *residual risk*, *risk acceptance criteria*, *Statement of Applicability*.

**CRISC:**
- CRISC is entirely dedicated to IT risk management. Domains 1 and 2 cover identification and assessment respectively.
- Key distinction CRISC tests: *threat* vs *vulnerability* vs *risk*. Many candidates confuse these. Nail the components.
- CRISC also heavily tests the concept of **risk ownership** — who is accountable for a risk vs who manages the controls.

**CISM:**
- Domain 2 (Information Risk Management) tests how a senior manager approaches risk — setting risk appetite, designing risk frameworks, reporting risk posture to leadership.
- CISM scenarios often test: "Given this situation, what should the CISO do *first*?" — the answer is almost always "assess the risk" before taking action.

**CISSP:**
- Domain 1 covers risk management concepts including threat modelling, qualitative vs quantitative analysis, risk frameworks (NIST, ISO 31000), and risk treatment options.
- CISSP at the "manager of managers" level — you are expected to evaluate risk management programmes, not just execute them.

---

## GUARDIAN's Take

Risk management is the intellectual heart of GRC. Governance provides the structure. Compliance provides the accountability. But risk is where the *thinking* happens — where you sit down and ask "what could actually go wrong, and what are we going to do about it?"

The organisations I have seen handle incidents best are not the ones with the most controls. They are the ones who had genuinely thought about their risks beforehand. They had run the scenarios. They had identified their crown jewels. They knew which risks they had accepted and which they had treated. When something happened, they were not starting from scratch — they already had a map.

The organisations that struggled? They had risk registers that were templates downloaded from the internet, filled in once, never updated, and owned by nobody. When the incident happened, there was no map. Just chaos.

There is one principle I want you to carry through this entire curriculum:

**Risk management is a conversation, not a document.**

The risk register is a record of that conversation. But the real value is in the thinking — in sitting with your business units and asking "what keeps you up at night?" — in challenging assumptions, in testing controls, in asking whether the residual risk is truly acceptable or just convenient.

Documents can be faked. Thinking cannot.

---
*Module: Module 1 — Foundations | Guardian Curriculum*
