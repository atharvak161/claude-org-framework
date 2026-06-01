---
tags: [guardian, grc, module-3, iso27001, isms, history, structure, certification]
module: 3
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: beginner
date: 2026-04-17
guardian-refs: ["G1-04 — Compliance Explained", "G1-08 — GRC Frameworks Overview", "G3-02 — The ISMS", "G3-03 — ISO 27001 Clause 4", "G3-10 — Annex A Controls", "G3-13 — The Certification Journey"]
---

# G3-01 — What is ISO 27001 — History, Purpose, Structure

> [!abstract] What This Note Covers
> By the end of this note, you will understand what ISO 27001 is, where it came from, why it exists, how it is structured, what it actually requires of organisations, and how it sits within the broader ISO 27000 family of standards.

---

## Why This Exists

In the early 1990s, a UK government initiative produced a code of practice for information security management — a document called PD 0003, later formalised as BS 7799. The British Standards Institution had recognised that organisations needed a common framework for managing information security, not just a collection of technical guidelines. The standard provided, for the first time, a structured approach to security management — policies, controls, risk assessment — in a single coherent document.

By 1995, BS 7799 Part 1 had been published as a code of practice. In 1998, Part 2 followed — the specification for an information security management system (ISMS), the part against which organisations could actually be certified. In 2000, Part 1 was adopted as an ISO standard: ISO/IEC 17799. And in 2005, Part 2 was adopted internationally as **ISO/IEC 27001:2005** — the first edition of what is now the world's most widely adopted information security management standard.

The 2005 edition was revised in **2013**, bringing structural alignment with other ISO management system standards. A further revision in **2022** updated the Annex A control set significantly, reducing from 114 controls across 14 domains to 93 controls across 4 categories, and adding 11 new controls reflecting the modern threat landscape.

Today, ISO/IEC 27001:2022 is the current version. Over 70,000 certificates have been issued globally across more than 150 countries. It is the dominant international standard for information security management — required for UK government contracts, expected by enterprise customers, and recognised by regulators as evidence of appropriate security measures under GDPR Article 32.

---

## What ISO 27001 Is

**ISO/IEC 27001** is an international standard that specifies the requirements for establishing, implementing, maintaining, and continually improving an **Information Security Management System (ISMS)**.

Let us break that definition down:

**International standard**: Published by the International Organization for Standardization (ISO) and the International Electrotechnical Commission (IEC). ISO standards represent international consensus — the combined expertise of standards bodies, industry, governments, and academia from member countries worldwide.

**Requirements**: The standard uses the word "shall" throughout its mandatory clauses. "Shall" means mandatory — it is a requirement, not a recommendation. Requirements in Clauses 4–10 are all mandatory for any organisation seeking certification.

**Establishing**: Building the ISMS from scratch — defining scope, conducting risk assessment, selecting controls.

**Implementing**: Putting the ISMS into operation — deploying controls, training staff, executing processes.

**Maintaining**: Keeping the ISMS current and effective — updating risks, reviewing controls, managing incidents.

**Continually improving**: Using audit findings, incidents, and management review to make the ISMS better over time — not static, always evolving.

**Information Security Management System (ISMS)**: A systematic framework for managing information security — governance structures, risk processes, policies, controls, and the people who operate them. Not a technical system — a management system. Think of it as the organisational infrastructure within which security decisions are made, implemented, and verified.

---

## What ISO 27001 Is NOT

Common misconceptions, cleared up:

**ISO 27001 is not a technical standard.** It does not specify which firewall to use, which encryption algorithm to deploy, or which SIEM to purchase. It specifies that you must assess your risks and implement appropriate controls — the specific controls are determined by your risk assessment.

**ISO 27001 certification does not mean you are secure.** It means you have a functioning ISMS — that you have assessed your risks, selected appropriate controls, and are maintaining and improving your security programme. A well-run ISMS produces genuinely improved security; a tick-box ISMS produces a certificate and little else.

**ISO 27001 is not just for technology companies.** It applies to any organisation — manufacturers, law firms, hospitals, retailers, government agencies, charities. If you handle information that matters (and every organisation does), ISO 27001 is applicable.

**ISO 27001 is not a checklist.** Unlike some frameworks (Cyber Essentials, PCI DSS) that specify exact controls that must be implemented, ISO 27001 requires a risk-based approach. You select controls based on your risk assessment — not from a fixed list. (Annex A provides a reference set, but organisations can add controls beyond it and justify exclusions from it.)

---

## The ISO 27000 Family

ISO 27001 does not stand alone. It is the centrepiece of a family of standards — the **ISO 27000 series** — that together provide comprehensive guidance on information security management.

| Standard | Title | What it covers |
|---|---|---|
| **ISO 27000** | Overview and vocabulary | Definitions and terminology used across the family |
| **ISO 27001** | Requirements | The ISMS specification — the certifiable standard |
| **ISO 27002** | Code of practice for information security controls | Implementation guidance for Annex A controls |
| **ISO 27003** | Guidance | Implementation guidance for ISO 27001 |
| **ISO 27004** | Monitoring, measurement, analysis and evaluation | Metrics and measurement for the ISMS |
| **ISO 27005** | Information security risk management | Risk assessment and treatment methodology |
| **ISO 27006** | Requirements for bodies providing ISMS certification | Accreditation requirements for certification bodies |
| **ISO 27007** | Guidelines for ISMS auditing | How to audit against ISO 27001 |
| **ISO 27008** | Guidelines for assessors of IS controls | How to assess control implementation |
| **ISO 27017** | Code of practice — cloud services | Cloud-specific control guidance |
| **ISO 27018** | Protection of PII in public clouds | Privacy controls for cloud environments |
| **ISO 27019** | Information security for energy utilities | Sector-specific extension |
| **ISO 27035** | Incident management | Information security incident management |
| **ISO 27701** | Privacy Information Management System | GDPR/privacy extension to ISO 27001 |

For the Lead Auditor qualification, ISO 27001 and ISO 27002 are the primary standards. ISO 27005 (risk management) and ISO 19011 (audit guidelines) are also heavily relevant.

---

## The Structure of ISO 27001:2022

ISO 27001 follows the **High Level Structure (HLS)** — also called Annex SL — which provides a common structure for all ISO management system standards (ISO 9001 for quality, ISO 14001 for environment, ISO 22301 for business continuity). This means the clause numbering and structural logic are consistent across standards, making integrated management systems (implementing multiple ISO standards simultaneously) significantly easier.

### The Ten Clauses

**Clauses 1–3: Introduction (not requirements)**

- **Clause 1 — Scope**: Defines what the standard covers and to whom it applies. All types of organisations, all sizes, all sectors.
- **Clause 2 — Normative references**: References ISO 27000 as the normative vocabulary standard. The only normative reference.
- **Clause 3 — Terms and definitions**: Directs the reader to ISO 27000 for terminology. No standalone definitions in the main standard.

**Clauses 4–10: Requirements (mandatory for certification)**

All "shall" statements in Clauses 4–10 are mandatory. Every certified organisation must satisfy all of them.

| Clause | Title | What it requires |
|---|---|---|
| **4** | Context of the organisation | Understanding the internal and external context; identifying stakeholders and their requirements; defining the ISMS scope |
| **5** | Leadership | Top management commitment; information security policy; roles, responsibilities, and authorities |
| **6** | Planning | Risk assessment and treatment; information security objectives; planning for change |
| **7** | Support | Resources; competence; awareness; communication; documented information |
| **8** | Operation | Implementing and controlling the risk assessment and treatment processes; operational planning |
| **9** | Performance evaluation | Monitoring, measurement, analysis and evaluation; internal audit; management review |
| **10** | Improvement | Nonconformity and corrective action; continual improvement |

**Annex A: Reference control objectives and controls**

Annex A is informative (not mandatory in itself) — but Clause 6.1.3 *requires* organisations to compare their selected controls against Annex A to confirm that no necessary controls have been overlooked.

In ISO 27001:2022, Annex A contains **93 controls** across **4 categories**:

| Category | Controls | Count |
|---|---|---|
| 5 — Organisational controls | Policies, roles, threat intelligence, information classification, supplier security, incident management, business continuity | 37 |
| 6 — People controls | Screening, terms of employment, security awareness, training, disciplinary process | 8 |
| 7 — Physical controls | Physical security perimeters, access controls, securing offices, equipment, clear desk | 14 |
| 8 — Technological controls | Endpoint protection, access control, cryptography, logging, vulnerability management, network security, secure development | 34 |

The 2022 revision added 11 new controls that were not in the 2013 version:

| New control | What it covers |
|---|---|
| A.5.7 — Threat intelligence | Formal collection and analysis of threat information |
| A.5.23 — Information security for use of cloud services | Cloud-specific security requirements |
| A.5.30 — ICT readiness for business continuity | IT continuity planning |
| A.7.4 — Physical security monitoring | Surveillance of physical facilities |
| A.8.9 — Configuration management | Baseline configuration management |
| A.8.10 — Information deletion | Secure deletion of information |
| A.8.11 — Data masking | Masking of sensitive data |
| A.8.12 — Data leakage prevention | DLP controls |
| A.8.16 — Monitoring activities | Monitoring of systems and networks |
| A.8.23 — Web filtering | Filtering of web access |
| A.8.28 — Secure coding | Secure development practices |

---

## The PDCA Cycle: The Logic of ISO 27001

ISO 27001 is built on the **Plan-Do-Check-Act (PDCA)** cycle — also called the Deming Cycle — which is the foundational logic of all management system standards.

```
        PLAN (Clauses 4, 5, 6, 7)
   ┌────────────────────────────────┐
   │ Establish ISMS scope           │
   │ Understand context             │
   │ Assess risks                   │
   │ Select controls                │
   │ Set objectives                 │
   └────────────────────────────────┘
           │                  ↑
           ▼                  │
        DO (Clause 8)         │
   ┌────────────────────────────────┐
   │ Implement controls             │
   │ Operate ISMS processes         │
   │ Manage risks                   │
   └────────────────────────────────┘
           │                  │
           ▼                  │
     CHECK (Clause 9)         │
   ┌────────────────────────────────┐
   │ Monitor and measure            │
   │ Internal audit                 │
   │ Management review              │
   └────────────────────────────────┘
           │                  │
           ▼                  │
      ACT (Clause 10)         │
   ┌────────────────────────────────┐
   │ Address nonconformities        │
   │ Implement corrective actions   │
   │ Continual improvement          │
   └──────────────────────────────── ┘
```

This cycle is continuous — there is no "done." After each Act phase, the Plan phase begins again with improved understanding, updated risks, and refined controls. Certification is a recognition that the cycle is operating effectively — not that it is complete.

---

## Why Organisations Pursue ISO 27001

### Business drivers

**Customer and market requirement**: Major enterprise customers, government bodies, and regulated sector purchasers increasingly require ISO 27001 certification as a condition of contract. "Do you have ISO 27001?" is a standard procurement question.

**Competitive differentiation**: Certification signals security maturity to prospective customers and partners. In competitive procurement situations, certification can be a differentiator.

**GDPR compliance evidence**: GDPR Article 32 requires "appropriate technical and organisational measures" to ensure security of personal data. ISO 27001 certification is widely accepted as strong evidence of compliance with this requirement.

**Structured security improvement**: The ISMS framework forces organisations to think systematically about security — assets, risks, controls, objectives — in a way that most organisations have never done before. The process of building an ISMS typically produces significant, measurable security improvement.

**Risk reduction**: Mature ISMS programmes demonstrably reduce both the frequency and impact of security incidents. Lower incident rates translate to lower costs, lower insurance premiums, and better operational resilience.

**Insurance benefits**: Many cyber insurers now offer premium discounts or enhanced coverage terms for ISO 27001-certified organisations, recognising the correlation with lower claim rates.

### What certification involves

1. Defining the ISMS scope (which systems, locations, processes are in scope)
2. Conducting a context and stakeholder analysis (Clause 4)
3. Getting top management commitment (Clause 5)
4. Conducting a risk assessment and selecting controls (Clause 6)
5. Implementing those controls (Clause 8)
6. Monitoring effectiveness and conducting internal audits (Clause 9)
7. Stage 1 audit by an accredited certification body (documentation review)
8. Stage 2 audit (on-site/remote assessment of ISMS operation)
9. Certificate issued (3-year validity)
10. Annual surveillance audits (Years 1 and 2)
11. Recertification audit (Year 3)

---

## The Details That Matter

### Scope: The Most Important Decision in an ISO 27001 Programme

Before any other work begins, the organisation must define the **scope** of its ISMS — what is included, what is excluded, and why. The scope determines:
- Which assets, systems, processes, and locations are covered
- Which risks must be assessed
- Which controls must be implemented
- What the certification covers (and what it does not)

Scope can be the entire organisation, a specific department, a specific product or service, a specific geographic location, or any combination. A software-as-a-service company might scope only the development and delivery of its core product. A financial services firm might scope its entire UK operations.

**Scope creep** is a major risk: as the organisation changes, systems and processes may move in or out of scope without the ISMS being updated. This creates audit gaps and potential nonconformities.

**Inadequate scope** is also a risk: scoping too narrowly to make certification easier may exclude systems that carry significant risk, giving customers and regulators false assurance about coverage.

### The Statement of Applicability (SoA)

The **Statement of Applicability** is one of the most important documents in any ISMS. It lists all 93 Annex A controls and for each records:
- Whether the control is applicable to the organisation
- Whether it is currently implemented
- The justification for inclusion or exclusion

The SoA is mandatory (required by Clause 6.1.3(d)) and is reviewed by auditors as primary evidence of the risk treatment process. It creates traceability: Risk → Treatment decision → Control selection → SoA → Evidence of implementation.

Controls can be excluded from the SoA only if there is a documented justification — typically that no risk exists that would require the control (e.g. excluding physical media controls if the organisation operates entirely in the cloud with no physical media). Exclusions are not automatically accepted by auditors — they must be justified.

### The 2022 vs 2013 Transition

Organisations certified against ISO 27001:2013 had until **31 October 2025** to transition to the 2022 version. By that date, all certificates should reference ISO 27001:2022. Key changes:

| Area | 2013 | 2022 |
|---|---|---|
| Control count | 114 controls | 93 controls (consolidated + 11 new) |
| Control categories | 14 domains | 4 categories (Organisational, People, Physical, Technological) |
| Control attributes | None | Each control has 5 attributes (type, InfoSec properties, concepts, capabilities, domains) |
| New controls | — | 11 new controls including threat intelligence, cloud, DLP, secure coding |
| Clause 6.3 | Not present | New: Planning of changes (must manage ISMS changes in controlled manner) |

---

## Common Mistakes and Failures

**1. Scoping too narrowly to make certification easier.**
Excluding business-critical systems to reduce the audit scope. The certificate covers a small, well-controlled corner of the organisation while the real risks sit outside scope. Customers are misled about actual coverage.

**2. Treating the SoA as a tick-box exercise.**
Marking all 93 controls as "applicable and implemented" without genuine assessment of which controls address which risks. Auditors will probe the justification for each implementation claim.

**3. No genuine top management involvement.**
The ISMS is built by the security team, rubber-stamped by the CEO, and then ignored by leadership. The information security policy is approved but never referenced in any business decision. Auditors will probe whether management is genuinely engaged.

**4. Risk assessment conducted once, never updated.**
The risk register from the initial certification is never revisited. Two years later, the organisation has launched new products, adopted new cloud services, and hired 100 staff — none of which appear in the risk register.

**5. Internal audit that finds nothing.**
An internal audit programme that raises only minor observations, never identifies nonconformities, and never challenges the ISMS's effectiveness. Auditors will view a clean internal audit history with suspicion — a mature programme finds problems because it looks for them honestly.

**6. Certification as the destination, not the journey.**
The organisation works intensely to achieve certification and then coasts. Surveillance audits find a programme that has not evolved. The ISMS that existed on certification day is largely unchanged two years later, despite a dramatically changed threat landscape.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- The Lead Auditor qualification is entirely focused on assessing compliance with ISO 27001. Every clause is examinable, with particular depth on Clauses 4–10.
- The exam tests: knowledge of requirements (what "shall" statements mean), understanding of audit principles and processes, and application to realistic audit scenarios.
- Know the structure cold: 10 clauses, Clauses 4–10 mandatory, Annex A informative but referenced by Clause 6.1.3, 93 controls in 4 categories.
- Know the SoA inside out — it is the centrepiece of the audit evidence trail.
- Know the difference between a major nonconformity (systematic failure or absence of a required element) and a minor nonconformity (isolated failure or partial absence).

**CISM:**
- CISM Domain 3 (Information Security Programme) covers the design and management of IS programmes, of which ISO 27001 is the most common framework. Candidates must understand the standard's purpose, structure, and certification process.

**CRISC:**
- ISO 27001's risk assessment and treatment requirements (Clause 6.1) directly align with CRISC's risk management framework. Candidates should understand how ISO 27001 implements risk-based control selection.

**CISSP:**
- Domain 1 includes standards and frameworks. Know ISO 27001's purpose, the ISMS concept, and how it relates to risk management and governance.

---

## GUARDIAN's Take

ISO 27001 is the most important standard in the information security GRC landscape. Not because it is technically perfect — it is not. Not because compliance with it guarantees security — it does not. But because it provides, for the first time, a shared language and a shared framework within which organisations can have meaningful conversations about information security management.

Before ISO 27001, every organisation built its security programme differently — with different terminology, different risk methodologies, different control frameworks, different audit approaches. Assessing the security posture of a supplier, a partner, or an acquisition target was enormously difficult. With ISO 27001 as a common baseline, those conversations became structured and comparable.

The standard's greatest strength is also its greatest weakness: it is principles-based rather than prescriptive. You determine your own controls based on your own risk assessment. This means a genuinely risk-based programme can be built on ISO 27001 foundations. It also means a programme built purely to satisfy auditors — with generic controls selected from a template rather than from actual risk analysis — can achieve certification without delivering real security improvement.

The Lead Auditor's job is to find the difference between these two organisations. The questions that reveal it are not "do you have a patching policy?" (every certified organisation does) but "show me how the controls you selected address the specific risks you identified for your highest-value assets" — and then following the thread.

When the answer to that question is coherent, traceable, and evidenced, you are looking at a genuine ISMS. When the answer is a blank look followed by a document that was clearly produced for the audit, you are looking at a certificate without substance.

Know the difference. Build the genuine article. And when you audit, find the truth.

---
*Module: Module 3 — ISO 27001 | Guardian Curriculum*
