---
tags: [guardian, grc, module-2, risk-management, erm, coso, iso31000, enterprise-risk]
module: 2
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G1-02 — Governance Explained", "G1-03 — Risk Explained", "G2-02 — Risk Appetite and Risk Tolerance", "G2-03 — Risk Assessment Methodologies", "G2-05 — The Risk Register", "G7-01 — COBIT"]
---

# G2-08 — Enterprise Risk Management — ERM Frameworks

> [!abstract] What This Note Covers
> By the end of this note, you will understand what Enterprise Risk Management (ERM) is, how it differs from standalone information security risk management, and how the two major ERM frameworks — COSO ERM and ISO 31000 — work, relate to each other, and connect to ISO 27001.

---

## Why This Exists

In 2008, Lehman Brothers collapsed — triggering the worst global financial crisis since the Great Depression. The post-mortem identified numerous risk management failures. But perhaps the most instructive was this: Lehman's risk function focused almost exclusively on market and credit risk — the financial risks at the core of its business. The operational, reputational, liquidity, and interconnected systemic risks that ultimately destroyed the firm were managed in separate silos, if at all. Nobody had a view of the *whole* risk picture.

This is the problem that Enterprise Risk Management (ERM) was designed to solve.

Information security risk management — even when done well — is a silo. It manages IT and information risks. But the risks that destroy organisations are rarely isolated to one domain. A ransomware attack is an IT risk, yes. But it is also a business continuity risk, a regulatory risk (GDPR breach notification), a reputational risk, a supply chain risk, and potentially a strategic risk. ERM is the discipline of managing all organisational risks — financial, operational, strategic, reputational, IT, legal, environmental — within a single integrated framework, so that the board has a complete picture and risks are managed consistently across every domain.

For GRC professionals, ERM matters because:
1. Information security risks do not exist in isolation — they must be understood in enterprise context
2. The CISO's risk register feeds into the enterprise risk register
3. The board's risk appetite is an ERM construct that governs *all* risk decisions, including IS
4. The major ERM frameworks (COSO, ISO 31000) underpin the risk management methodologies used in ISO 27001

---

## What Enterprise Risk Management Is

**Enterprise Risk Management (ERM)** is a structured, organisation-wide approach to identifying, assessing, managing, and monitoring all categories of risk that could affect the organisation's ability to achieve its objectives.

The key distinctions from siloed risk management:

| Dimension | Siloed Risk Management | Enterprise Risk Management |
|---|---|---|
| **Scope** | One domain (IT, financial, operational) | All domains — integrated |
| **Ownership** | Single function (e.g. IT Security) | Distributed; governed at board level |
| **Reporting** | To the CISO / IT Director | To the Board / Executive Committee |
| **Methodology** | Often domain-specific | Common framework applied consistently |
| **Risk view** | Risks viewed in isolation | Risks aggregated into a portfolio view |
| **Correlation** | Not considered | Correlated risks identified and managed |
| **Risk appetite** | Set for one domain | Set at board level for the whole enterprise |

ERM does not replace information security risk management — it *incorporates* it. The IT/IS risk register is a component of the enterprise risk register. The CISO's risk reporting feeds into the enterprise risk dashboard. The board's ERM risk appetite applies to information security risk as one category among many.

---

## The Two Major ERM Frameworks

### COSO ERM 2017 — Committee of Sponsoring Organizations

**What it is**: The dominant ERM framework in the US and globally in financial services. Current version: *Enterprise Risk Management — Integrating with Strategy and Performance* (2017). COSO originally published its Internal Controls Framework in 1992 — the foundation for Sarbanes-Oxley (SOX) compliance. The ERM framework extends that model to encompass the full spectrum of enterprise risk.

**The Five Interrelated Components:**

**1. Governance and Culture**
Establishes the governance structures, oversight responsibilities, and risk culture that enable effective ERM. For information security: maps to CISO role design, board security reporting, security culture programmes, and the three lines of defence model.

Key principles: board oversight of risk; establishing operating structures; defining desired culture and core values; attracting, developing, and retaining capable individuals.

**2. Strategy and Objective-Setting**
Risk management is integrated into strategy-setting — risk is assessed in the context of the organisation's mission, vision, and strategic objectives *before* strategies are executed, not after.

Key principles: analysing the business context (equivalent to ISO 27001 Clause 4); defining risk appetite; evaluating alternative strategies through a risk lens; formulating business objectives with risk implications considered.

For IS: A digital transformation strategy creates new information risks; ERM ensures those risks are considered before execution, not discovered after a breach.

**3. Performance**
The operational core — identifying, assessing, prioritising, and responding to risks.

Key principles: identifying risks; assessing severity (likelihood × impact); prioritising against risk appetite and tolerance; implementing risk responses (equivalent to ISO 27001 Clause 6.1.3); developing a portfolio view of risk.

For IS: Information security risks enter the enterprise risk portfolio through this component. The IT risk register feeds the enterprise view.

**4. Review and Revision**
Continuous monitoring — ensuring ERM remains relevant, effective, and aligned to the changing risk landscape.

Key principles: assessing substantial change; reviewing risk and performance; pursuing improvement in ERM.

For IS: Aligns with ISO 27001 Clause 9 (performance evaluation) and Clause 10 (improvement). Management review and internal audit contribute here.

**5. Information, Communication, and Reporting**
Ensuring the right information is captured, communicated to the right people, and reported at appropriate frequency and detail.

Key principles: leveraging information and technology; communicating risk information; reporting on risk, culture, and performance.

For IS: CISO reporting to the board, security metrics and KPIs, and regulatory disclosures all fall within this component.

**COSO ERM Risk Categories — IS Relevance:**

| Category | IS-relevant examples |
|---|---|
| **Strategic** | Technology disruption, failed digital transformation, new digital competitors, AI risk |
| **Operational** | IT system failure, data breach, ransomware, process failure, supply chain disruption |
| **Financial** | Fraud enabled by system compromise, financial misstatement via error, regulatory fines |
| **Compliance** | GDPR non-compliance, PCI DSS failure, FCA regulatory breach, NIS2 violation |
| **Reputational** | Publicly disclosed data breach, negative press from security incident |

Information security risk straddles multiple categories — primarily Operational and Compliance, with potential Strategic and Reputational cascades.

---

### ISO 31000:2018 — Risk Management Guidelines

**What it is**: The international standard for risk management principles and guidelines, published by ISO. Sector-agnostic — applies to any type of organisation, any type of risk. Not certifiable. Provides principles and a framework for building effective risk management programmes.

**Three-Tier Structure:**

**Tier 1 — Eight Principles:**

| Principle | What it means in practice |
|---|---|
| **Integrated** | Risk management embedded in all organisational activities, not a standalone function |
| **Structured and comprehensive** | Systematic approach producing consistent, comparable results |
| **Customised** | Framework tailored to the organisation's specific context and objectives |
| **Inclusive** | Appropriate, timely involvement of stakeholders — risk owners are business leaders, not just IT staff |
| **Dynamic** | Risk management anticipates, detects, and responds to change — continuous monitoring |
| **Best available information** | Inputs are based on historical, current, and forward-looking information including threat intelligence |
| **Human and cultural factors** | Human behaviour and culture significantly influence both risk exposure and risk management effectiveness |
| **Continual improvement** | Experience and learning drives ongoing programme enhancement |

**Tier 2 — Framework (Plan-Do-Check-Act cycle):**

```
LEADERSHIP AND COMMITMENT
           ↓
       DESIGN
(scope, context, criteria; roles; process integration)
           ↓
     IMPLEMENTATION
(apply framework at all levels)
           ↓
     EVALUATION
(monitor effectiveness; measure performance; report to leadership)
           ↓
     IMPROVEMENT
(adapt and enhance; learn from experience)
           ↑_____________________________________________↩
```

This is explicitly iterative — a continuous improvement cycle. Identical logic to ISO 27001's ISMS (Plan-Do-Check-Act underpins both).

**Tier 3 — Process (operational steps for specific risks):**

```
COMMUNICATION AND CONSULTATION ←→ (runs throughout)
           │
     SCOPE, CONTEXT, CRITERIA
           │
      RISK ASSESSMENT
           ├── Risk Identification
           ├── Risk Analysis (likelihood × impact)
           └── Risk Evaluation (compare to criteria / appetite)
           │
      RISK TREATMENT
           │
     MONITORING AND REVIEW
           │
   RECORDING AND REPORTING ←→ (runs throughout)
```

This process is directly reflected in ISO 27001's risk requirements (Clause 6.1) and ISO 27005. The alignment is intentional — ISO 27005 is an application of ISO 31000 principles to information security.

---

## COSO ERM vs ISO 31000: Key Differences

| Dimension | COSO ERM 2017 | ISO 31000:2018 |
|---|---|---|
| **Origin** | US accounting/governance community | International standards body (ISO) |
| **Primary audience** | Large enterprises, financial services, SOX-regulated companies | Any organisation, any sector, any size |
| **Certifiable?** | No | No |
| **Prescriptiveness** | Relatively prescriptive — specific components and principles | Principles-based; flexible implementation |
| **Strategy integration** | Strong emphasis — risk integrated into strategy-setting | Present but less central |
| **Cultural emphasis** | Moderate | Strong — explicitly named as a principle |
| **IS alignment** | Through COSO Internal Controls (SOX/PCI DSS) | Through ISO 27001/27005 (built on ISO 31000 principles) |
| **Most common in** | US, financial services globally | Europe, Asia-Pacific, regulated sectors globally |

Many large organisations reference both — COSO for US-facing regulatory requirements; ISO 31000 as the underlying principles framework for all risk management, including ISO 27001.

---

## How ERM Connects to Information Security Risk Management

### The Risk Escalation Chain

```
OPERATIONAL LEVEL
IT/Security team identifies risk → Documents in IS risk register →
CISO reviews → Classifies as Low/Medium/High/Critical

TACTICAL LEVEL
CISO reports High/Critical risks to Security Committee →
Security Committee escalates material risks to enterprise risk register

STRATEGIC LEVEL
Enterprise Risk Manager aggregates IS risks with all other risk domains →
Presents enterprise risk portfolio to Board Risk Committee →
Board reviews against enterprise risk appetite
```

### The Portfolio View of Risk

The board manages a *portfolio* of risks — not individual risks in isolation. Portfolio-level analysis assesses:

- **Aggregate exposure**: Total risk carried across all domains simultaneously
- **Concentration**: Risks clustered in one area (e.g. single cloud provider dependency)
- **Correlation**: Risks that materialise together (ransomware simultaneously triggering operational, reputational, regulatory, and financial risks)
- **Velocity**: How quickly a risk could materialise and cause harm
- **Interdependency**: Does managing one risk create or increase another?

For IS: A ransomware risk rated "High" in isolation may be "Critical" in the enterprise portfolio when its correlation with business continuity, supply chain, and regulatory risk is factored in.

### Risk Escalation Criteria: IS Register to Enterprise Register

| IS Risk Level | Enterprise Register? | Board Visibility? |
|---|---|---|
| Low | No | No |
| Medium | Only if crossing domain boundaries | No |
| High | Yes — summarised in enterprise register | Risk Committee level |
| Critical | Yes — prominent in enterprise register | Full board visibility |
| Any risk with regulatory consequence | Yes — regardless of internal rating | Board and external stakeholders |

### The Risk Appetite Cascade

In a well-designed ERM programme, the board's overall risk appetite cascades into domain-specific appetites:

```
BOARD ENTERPRISE RISK APPETITE
("low appetite for risks that could affect customer trust or regulatory standing")
        │
        ├── Financial Risk Appetite (set with CFO)
        ├── Strategic Risk Appetite (set with CEO)
        ├── Operational Risk Appetite (set with COO)
        └── Information Security Risk Appetite (set by CISO)
                    │
                    ├── Data protection risk appetite
                    ├── Availability / BCP risk appetite
                    ├── Third-party / supply chain risk appetite
                    └── Insider threat risk appetite
```

The CISO does not set risk appetite unilaterally — they translate the board's enterprise appetite into IS-specific terms. This is why CISO risk appetite statements must reference business objectives and regulatory obligations, not just technical risk scores.

---

## The Details That Matter

### ERM Maturity Model

| Level | Characteristics |
|---|---|
| **1 — Initial** | Risk managed in silos; no enterprise view; no consistent methodology; board reporting ad hoc or absent |
| **2 — Developing** | Basic risk registers in key domains; some cross-domain communication; appetite defined but not operationalised |
| **3 — Defined** | Consistent methodology across domains; enterprise register maintained; regular board reporting; appetite used in decisions |
| **4 — Managed** | Quantitative analysis for major risks; continuous monitoring; risk-adjusted performance metrics; ERM integrated into strategy |
| **5 — Optimising** | Predictive risk analytics; risk-aware culture embedded; ERM is a genuine competitive advantage |

Most organisations seeking ISO 27001 certification operate at Level 2–3. ISO 27001's requirements push toward Level 3. Reaching Level 4–5 requires significant investment in data, tooling, and cultural change.

### The CISO in the ERM Structure

**Best case**: The CISO and Chief Risk Officer (CRO) or Enterprise Risk Manager have a strong working relationship. IS risks are integrated into the enterprise framework using consistent methodology, scoring, and terminology. IS risks appear in board risk reporting alongside financial, operational, and strategic risks.

**Common failure**: The CISO runs an independent IS risk programme with its own methodology. The ERM function runs a separate process. Neither feeds the other. Cross-domain risk correlations are invisible to the board.

The GRC professional's job: align the IS risk methodology with the enterprise methodology; ensure consistent risk appetite application; ensure IS risk information flows into the enterprise risk picture.

### ERM and the Three Lines of Defence

ERM does not replace the three lines model — it frames it at enterprise level:

- **First line**: Business units own and manage risk in their domain, including IS risks within their area
- **Second line**: Risk management and compliance functions (including the CISO) provide oversight and aggregation — the ERM function consolidates the enterprise-wide view
- **Third line**: Internal audit provides independent assurance that the ERM framework is functioning — including assessment of the IS risk programme within it

### ISO 31000 and ISO 27001: The Formal Relationship

ISO 27005 (the IS risk management standard that implements ISO 27001's risk requirements) is explicitly built on ISO 31000 principles. The relationship:

```
ISO 31000 (generic risk management principles and process)
        └── ISO 27005 (application to information security)
                    └── ISO 27001 Clause 6 (risk requirements in the ISMS)
```

An organisation that adopts ISO 31000 enterprise-wide and applies it consistently to information security through ISO 27005 has a coherent, traceable risk management architecture. Auditors — both internal and external — find this significantly easier to assess than an IS risk programme built in isolation with its own bespoke methodology.

---

## Common Mistakes and Failures

**1. IS risk management entirely disconnected from ERM.**
The CISO runs an excellent ISO 27001 programme. The ERM function runs a COSO programme. They never interact. The board sees IS risks in the CISO's slides and enterprise risks in the CRO's slides — and nobody integrates them. Cross-domain risk correlations are invisible.

**2. ERM programme that excludes information security.**
Enterprise risk registers dominated by financial, strategic, and operational risks. IS risk is absent or represented by a single generic entry ("cyber risk — Medium"). The board does not receive meaningful IS risk information through the ERM channel.

**3. Risk appetite set at enterprise level but never translated to IS.**
The board approves an enterprise risk appetite. The CISO's programme uses a completely different (and inconsistent) appetite. IS treatment decisions are not aligned with the board's intent.

**4. ERM used to dilute IS risk urgency.**
IS risks rated Critical in the IS register are "moderated" when entered into the enterprise register — reframed as Medium to avoid alarm. The enterprise view provides false comfort while the technical reality is severe.

**5. ERM as a reporting exercise, not a decision-making tool.**
Beautiful enterprise risk dashboards presented quarterly, with no mechanism to connect risk information to strategic or investment decisions. The board reads the dashboard, notes the risks, and moves on. Risk does not influence resource allocation.

**6. Treating IS risk as purely technical in the ERM context.**
Presenting IS risks to the enterprise risk function in technical language — CVE scores, vulnerability counts, CVSS ratings. The ERM function and board need business impact language: revenue at risk, regulatory exposure, operational disruption. Technical details belong in the IS risk register; business impact belongs in the enterprise risk report.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- ISO 27001 does not mandate COSO ERM or ISO 31000 adoption — but Clauses 4.1 and 4.2 (context of the organisation, stakeholder needs) require understanding of the broader risk context within which the ISMS operates.
- Auditors assess whether the IS risk appetite is aligned with organisational risk appetite, and whether significant IS risks are escalated appropriately within the governance structure.
- ISO 27005:2022 explicitly references ISO 31000 — auditors familiar with IS risk management standards will expect alignment.

**CRISC:**
- CRISC explicitly positions IT risk management within the enterprise risk context. It is one of the few certifications that requires knowledge of ERM frameworks (COSO, ISO 31000) alongside IS-specific risk management.
- Domain 1 (IT Risk Identification) requires candidates to understand how IT risks are identified in relation to enterprise objectives and the broader risk landscape.
- Domain 4 (Risk and Control Monitoring) includes how IT risk reporting integrates with enterprise risk reporting to the board.

**CISM:**
- Domain 1 (Information Security Governance) requires the CISO to align the IS programme with enterprise risk management.
- CISM scenario questions test: how does the CISO ensure IS risks are visible at board level? How does the IS risk appetite relate to the enterprise risk appetite? How does the CISO engage with the CRO?

**CISSP:**
- Domain 1 (Security and Risk Management) includes enterprise risk management concepts. Candidates must understand how security risk integrates into the broader organisational risk framework.
- Key concept: risk aggregation — the combined effect of multiple moderate risks can produce a critical enterprise-level exposure that neither would create in isolation.

---

## GUARDIAN's Take

ERM is where information security risk management becomes genuinely strategic — and where the CISO transitions from a technical leader to a business leader.

The CISOs who have the most influence in their organisations are not the ones with the deepest technical knowledge. They are the ones who have successfully integrated information security risk into the enterprise risk conversation. Who sit at the table when strategic decisions are made. Who can say — before a new market is entered, before a new product is launched, before an acquisition closes: "Here is what this creates in terms of information risk, and here is what it will cost to manage it." And who are listened to because they speak the language of business risk, not just technical risk.

That integration requires deliberate work. It requires building a relationship with the CRO and CFO. Using the same risk taxonomy and scoring methodology as the enterprise framework. Presenting IS risk in terms of business impact — revenue at risk, regulatory exposure, strategic consequences — not technical severity scores.

When that integration is achieved, something important shifts. Security investment becomes a strategic conversation, not a budget negotiation. Risk appetite becomes a board-level commitment, not a CISO policy document. The information security programme is no longer a cost centre — it is part of the organisation's risk intelligence.

That is the highest ambition of the GRC function. Not just to manage risk, but to make the organisation smarter about risk. Build toward it from day one.

---
*Module: Module 2 — Risk Management | Guardian Curriculum*
