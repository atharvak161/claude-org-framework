---
tags: [guardian, grc, module-7, framework-selection, decision-guide, iso27001, nist-csf, cobit, soc2, cyber-essentials, pci-dss]
module: 7
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-19
guardian-refs: ["G7-01 — COBIT", "G7-02 — NIST CSF 2.0", "G7-03 — NIST SP 800-53", "G7-04 — SOC 2", "G7-05 — Cyber Essentials", "G7-06 — ITIL", "G3-01 — What is ISO 27001", "G6-01 — What is PCI DSS"]
---

# G7-07 — Framework Decision Guide — Which Framework to Use When

> [!abstract] What This Note Covers
> By the end of this note, you will be able to confidently advise any organisation on which GRC frameworks to implement, in which order, and how to integrate them — based on the organisation's size, sector, market, regulatory obligations, and security maturity. This is the capstone note of Module 7.

---

## Why This Exists

The most common question GRC professionals are asked — by CISOs, by boards, by clients — is: "Which framework should we implement?"

It sounds like it should have a simple answer. It does not. The right framework (or combination of frameworks) depends on: who the organisation sells to, what regulations it operates under, what threats it faces, how mature its security programme is, how much resource it has, and what its business objectives are.

This note provides a structured decision framework — a set of questions that, when answered, produce a clear, defensible framework selection rationale. It also provides a landscape view of how the frameworks covered in Module 7 relate to each other, where they overlap, and how they are commonly combined.

---

## The Framework Landscape: A Map

Before selecting frameworks, understand what each does and does not do:

| Framework | Primary purpose | Output | Who requires it |
|---|---|---|---|
| **ISO 27001** | Information security management system | Certificate (3-year) | EU/UK enterprise customers; regulated sectors; government contracts globally |
| **NIST CSF 2.0** | Cybersecurity governance outcomes | Self-assessed profile (no cert) | US stakeholders; US federal contractors; all sectors voluntarily |
| **NIST SP 800-53** | Detailed security control catalogue | ATO (federal); compliance evidence | US federal agencies; US defence contractors (via 800-171/CMMC) |
| **SOC 2** | Independent assurance report for service organisations | Type I or Type II report | US enterprise customers; global SaaS market |
| **PCI DSS** | Payment card security standard | AOC / ROC | Any organisation accepting payment cards |
| **COBIT** | IT governance framework | Maturity assessment | Large enterprises; IT governance programmes; SOX compliance |
| **Cyber Essentials** | Basic UK cybersecurity controls | Certificate (annual) | UK government contracts; UK supply chain requirements |
| **ITIL** | IT service management best practice | Individual certifications (no org cert) | Any IT-enabled organisation (operational guidance) |

**Key insight**: Most mature organisations do not implement one framework — they implement a combination. The question is not "ISO 27001 OR NIST CSF" but "ISO 27001 AND NIST CSF — in which order, with what integration, and why?"

---

## The Decision Framework: Six Questions

### Question 1: What are the mandatory compliance obligations?

Start here — mandatory obligations are non-negotiable. Identify every regulatory, contractual, and legal obligation that requires specific frameworks or controls:

**UK government contracts**: Cyber Essentials (mandatory); Cyber Essentials Plus (often required for higher-sensitivity contracts); NCSC guidance frameworks.

**EU/UK financial services**: FCA SYSC operational resilience requirements; DORA (Digital Operational Resilience Act — applies to EU financial entities from January 2025, affects UK firms with EU operations); Bank of England/PRA operational resilience standards.

**Payment card processing**: PCI DSS — mandatory for all merchants and service providers processing Visa/Mastercard/Amex.

**US federal contracts (defence)**: CMMC Level 1 or 2 (based on 800-171) — mandatory for DoD contractors. FedRAMP — for cloud service providers selling to federal agencies.

**US federal agencies**: FISMA — requires implementation of SP 800-53 via the RMF.

**Healthcare (UK)**: NHS Data Security and Protection Toolkit — for organisations handling NHS patient data.

**Healthcare (US)**: HIPAA Security Rule — for covered entities and business associates.

**General data protection**: GDPR/UK GDPR — applies to any organisation processing EU/UK personal data. Not a security framework per se, but requires appropriate security measures (Article 32) and DPIAs for high-risk processing.

**Action**: List every mandatory obligation. These frameworks must be implemented regardless of preference.

---

### Question 2: What markets does the organisation operate in, and what do customers expect?

Framework adoption is largely market-driven. What the customer expects determines what evidence the organisation must produce:

**UK enterprise customers**: Expect ISO 27001 certification. Many UK enterprise procurement programmes specifically request ISO 27001 as a vendor qualification requirement. Cyber Essentials is often a baseline prerequisite.

**EU enterprise customers**: Expect ISO 27001. Some sectors (financial services, healthcare, public sector) have additional sector-specific requirements.

**US enterprise customers**: Expect SOC 2 Type II. Some US enterprise customers also request ISO 27001 — particularly those with European parents or European operations.

**US federal government customers**: Expect NIST CSF alignment; SP 800-53 implementation for federal systems; FedRAMP for cloud services.

**Global customers (multiple markets)**: Typically require both ISO 27001 (for EU/UK stakeholders) and SOC 2 (for US stakeholders). Some also require NIST CSF alignment for US federal work.

**Action**: Map customer market to expected framework. This identifies what must be demonstrated to win and retain business.

---

### Question 3: What is the organisation's sector?

Sectors carry specific framework requirements and regulatory contexts:

**Financial services (UK/EU)**: ISO 27001 (widely adopted); DORA (mandatory for EU financial entities); FCA operational resilience; CBUAE/NYDFS for international operations.

**Financial services (US)**: SOC 2; NIST CSF (SEC expects CSF alignment); state regulators; FFIEC guidance.

**Healthcare (UK)**: DSP Toolkit; ISO 27001 (increasingly adopted); Cyber Essentials.

**Healthcare (US)**: HIPAA Security Rule; NIST CSF (recommended by HHS); SOC 2.

**Retail/e-commerce**: PCI DSS (mandatory if accepting cards); ISO 27001 (for enterprise customers); SOC 2 (if providing services to other organisations).

**Defence (UK)**: Cyber Essentials (mandatory for MOD supply chain); ISO 27001; NIST SP 800-171 (for US defence work).

**Defence (US)**: CMMC (mandatory for DoD contractors); SP 800-171; SP 800-53.

**Technology/SaaS**: SOC 2 (primary assurance mechanism for US customers); ISO 27001 (for EU/UK customers); NIST CSF (optional but widely referenced).

**Government (UK)**: Cyber Essentials; ISO 27001; NCSC guidance; Government Security Classifications (GSC) policy.

**Action**: Identify sector-specific requirements and expected frameworks.

---

### Question 4: What is the organisation's size and resource capacity?

The appropriate framework combination depends on what the organisation can realistically implement and sustain:

**Very small organisations (< 10 staff, low-risk, UK-only)**:
- Start with: Cyber Essentials
- Progress to: IASME Cyber Assurance
- Long-term: ISO 27001 Foundation as business grows
- Not appropriate (yet): COBIT, SP 800-53, SOC 2

**Small organisations (10–50 staff, UK market)**:
- Start with: Cyber Essentials → Cyber Essentials Plus
- Then: ISO 27001 (if selling to enterprise customers or public sector)
- If accepting cards: PCI DSS alongside ISO 27001
- ITIL Foundation for IT service management

**Medium organisations (50–500 staff, UK/EU market)**:
- Foundation: Cyber Essentials Plus
- Primary: ISO 27001 (essential for enterprise sales)
- If US market: Add SOC 2 Type II
- If payment processing: PCI DSS
- Governance: COBIT (selective objectives; not full implementation)
- ITIL practices for IT service management

**Large organisations (500+ staff, global market)**:
- UK/EU: ISO 27001
- US: SOC 2 + NIST CSF alignment
- Payments: PCI DSS
- Governance: COBIT 2019 (IT governance framework)
- US federal work: SP 800-53 / CMMC / FedRAMP
- ITIL practices for IT service management
- Potentially: ISO 22301 (business continuity), ISO 9001 (quality management)

**Action**: Assess resource capacity — budget, personnel, management time — and select the combination the organisation can realistically implement and sustain.

---

### Question 5: What is the current security maturity level?

Framework selection should match current maturity and drive the next step forward:

**Maturity Level 0–1 (No formal programme; ad hoc security):**
- Immediate priority: Cyber Essentials (UK) or NIST CSF Tier 1→2 self-assessment
- Focus: Getting the five foundational technical controls in place
- Not appropriate yet: ISO 27001 certification (requires management system infrastructure)

**Maturity Level 2 (Basic controls in place; some documentation; inconsistent application):**
- Priority: ISO 27001 gap assessment → implementation → certification
- Concurrent: PCI DSS if applicable
- Framework reference: NIST CSF Tier 2→3 transition
- ITIL Foundation training for IT operations staff

**Maturity Level 3 (ISO 27001 certified; consistent processes; some measurement):**
- Expand: SOC 2 Type II if US market required
- Deepen: NIST CSF detailed implementation; measure against Target Profile
- Integrate: COBIT governance objectives for board-level IT governance
- Advance: ISO 22301 for business continuity

**Maturity Level 4 (Mature, measured, continuously improving):**
- Integrate: COBIT 2019 full governance framework
- Align: NIST SP 800-53 for US federal work
- Extend: Sector-specific frameworks (DORA, CMMC, FedRAMP)
- Demonstrate: Red team exercises, advanced threat intelligence integration

**Action**: Assess current maturity honestly. Select the framework that drives the next stage of development — not the most impressive-sounding framework regardless of readiness.

---

### Question 6: What specific business risks or concerns are driving the framework selection?

Sometimes a specific risk or business driver determines the framework priority:

**Responding to a security incident or breach**: ISO 27001 implementation provides the governance structure and control baseline; NIST CSF provides the incident response language for communication with stakeholders.

**Winning a US enterprise contract**: SOC 2 Type II is the immediate priority. NIST CSF alignment for US federal work.

**Winning UK government or NHS contracts**: Cyber Essentials / CE Plus immediately. ISO 27001 for larger contracts.

**Reducing cyber insurance premiums**: Cyber Essentials reduces premium in UK market. ISO 27001 is increasingly referenced by insurers as evidence of security maturity.

**Board asking for governance assurance**: COBIT provides the governance framework; ISO 27001 internal audit and management review provide the evidence.

**Supply chain customer requiring vendor security evidence**: Identify what evidence they need — SOC 2 report? ISO 27001 certificate? Cyber Essentials certificate? PCI DSS AOC? — and implement the appropriate framework.

**Processing payment cards**: PCI DSS is mandatory and the priority.

**Action**: Identify the specific business driver and select the framework that most directly addresses it.

---

## The Most Common Framework Combinations

### Combination 1: UK SME, Public Sector / Government Supply Chain

**Frameworks**: Cyber Essentials Plus → ISO 27001

**Rationale**: CE Plus satisfies mandatory UK government contract requirements and demonstrates baseline technical security. ISO 27001 provides comprehensive ISMS for more complex contracts and enterprise customers.

**Sequence**: CE Plus first (quick, low-cost, immediately addresses contractual requirements) → ISO 27001 gap assessment → 6–12 month implementation → certification.

**ITIL**: ITIL Foundation for IT operations team.

---

### Combination 2: UK Technology Company, UK/US Enterprise Market

**Frameworks**: Cyber Essentials Plus + ISO 27001 + SOC 2 Type II

**Rationale**: CE Plus satisfies UK government contracts. ISO 27001 satisfies UK and EU enterprise customers. SOC 2 Type II satisfies US enterprise customers.

**Sequence**: CE Plus → ISO 27001 → (after 12 months of operational ISMS) SOC 2 Type I → SOC 2 Type II.

**Integration**: ISO 27001 ISMS provides the control infrastructure. SOC 2 audit tests against Trust Services Criteria using the same control evidence. Integrated policy framework; shared risk assessment; single audit programme covering both.

**If accepting payments**: Add PCI DSS alongside ISO 27001.

---

### Combination 3: Financial Services Firm (UK/EU)

**Frameworks**: ISO 27001 + NIST CSF + PCI DSS (if applicable) + DORA (if EU-regulated)

**Rationale**: ISO 27001 is the primary information security standard widely expected in financial services. NIST CSF provides governance communication language and aligns with regulatory expectations. PCI DSS mandatory for card processing. DORA mandatory for EU financial entities from 2025.

**Sequence**: ISO 27001 foundation → PCI DSS (concurrent if already accepting cards) → NIST CSF alignment (Profile-based) → DORA compliance (if applicable).

**COBIT**: COBIT 2019 IT governance objectives for board-level oversight, particularly EDM03 (risk optimisation) and MEA01 (performance monitoring).

---

### Combination 4: US DoD Contractor

**Frameworks**: NIST SP 800-171 (→ CMMC Level 2) + NIST CSF

**Rationale**: CMMC is contractually mandatory for DoD contractors. SP 800-171 (110 requirements) is the basis for CMMC Level 2. NIST CSF provides the governance framework and communication language.

**Sequence**: NIST CSF self-assessment to identify current state → SP 800-171 gap assessment → System Security Plan (SSP) implementation → CMMC Level 2 assessment.

**If EU/UK operations**: Add ISO 27001 for European operations.

---

### Combination 5: Global SaaS Provider

**Frameworks**: ISO 27001 + SOC 2 Type II + NIST CSF + Cyber Essentials Plus (if UK) + PCI DSS (if applicable)

**Rationale**: Global SaaS companies must satisfy enterprise customers in multiple markets simultaneously. ISO 27001 for EU/UK. SOC 2 for US. NIST CSF for US federal-adjacent work. CE Plus for UK government supply chain.

**Integration strategy**: Single integrated security programme. ISO 27001 ISMS as the management system. SOC 2 Trust Services Criteria and NIST CSF mapped to ISO 27001 Annex A controls. Single risk assessment. Single policy framework. Single audit programme. Evidence produced once; used for multiple frameworks.

---

## Framework Integration: The Layered Model

The most efficient approach to multi-framework compliance is a layered model:

```
LAYER 1: MANAGEMENT SYSTEM FOUNDATION
    ISO 27001 ISMS
    (Risk assessment, policy framework, management review,
     internal audit, corrective action, continual improvement)
    
    ↕ Integration ↕
    
LAYER 2: CONTROL CATALOGUE AND REQUIREMENTS
    ISO 27001 Annex A — 93 controls (primary)
    PCI DSS requirements (if applicable — adds payment-specific controls)
    SP 800-53 controls (if applicable — adds US federal depth)
    SOC 2 Trust Services Criteria (maps to Annex A controls)
    
    ↕ Integration ↕
    
LAYER 3: GOVERNANCE FRAMEWORK
    COBIT 2019 (IT governance structure)
    NIST CSF 2.0 (governance language and reporting)
    
    ↕ Integration ↕
    
LAYER 4: BASELINE CERTIFICATIONS
    Cyber Essentials Plus (UK technical baseline)
    SOC 2 Type II (US assurance report)
    ISO 27001 Certificate (global management system certification)
    PCI DSS AOC (payment card compliance)
    
    ↕ Supporting ↕
    
LAYER 5: OPERATIONAL PRACTICES
    ITIL (IT service management)
    DevSecOps (secure software delivery)
    ISO 22301 (business continuity management)
```

The foundation is the management system (ISO 27001). Everything else builds on it:
- Control requirements from different frameworks are satisfied by implementing controls within the ISMS
- Governance frameworks provide communication language and reporting structures
- Certifications and reports are produced from the same underlying programme
- Operational practices implement the controls the management system defines

---

## The "Start Here" Decision Tree

For any organisation that has not yet started a formal GRC programme:

```
START: Does the organisation process payment cards?
    YES → Immediately implement PCI DSS (mandatory; contractual)
    NO → Continue
    
Does the organisation have UK government contracts?
    YES → Immediately implement Cyber Essentials (mandatory)
    Then → Proceed to next question
    
Is the organisation UK or EU-based and selling to enterprise customers?
    YES → ISO 27001 is the priority framework
    
Does the organisation also sell to US enterprise customers?
    YES → Add SOC 2 Type II after ISO 27001 is operational
    
Does the organisation have US federal government customers or DoD contracts?
    YES → Add NIST SP 800-171/CMMC or FedRAMP as applicable
    
Does the organisation need board-level IT governance structure?
    YES → Add COBIT 2019 (selective objectives)
    
Is the organisation >500 staff with complex IT governance needs?
    YES → Add NIST CSF for governance communication and self-assessment
```

---

## The Most Common Mistakes in Framework Selection

**1. Selecting the most impressive-sounding framework, not the most appropriate one.**
A 10-person UK software company pursuing ISO 27001 and COBIT when Cyber Essentials Plus and a basic ISMS would serve their needs. The resources spent on an over-engineered compliance programme could have been invested in actual security improvements.

**2. Implementing frameworks sequentially rather than integrally.**
Achieving ISO 27001, then starting SOC 2 as a separate project, then starting PCI DSS as another separate project — each with its own risk assessment, policies, audit programme, and team. The correct approach: integrate from the start, using ISO 27001 as the management system foundation and building other frameworks on top.

**3. Not understanding what customers actually require.**
Assuming UK enterprise customers want SOC 2 (they don't — they want ISO 27001). Assuming US enterprise customers want ISO 27001 (they often want SOC 2). Verify what evidence customers require before investing in a specific framework.

**4. Treating framework certification as the security objective.**
"We're ISO 27001 certified — we're secure." Certification demonstrates that a management system is in place. It does not guarantee effective security. The security objective is protecting information; certification is a mechanism for demonstrating that the programme to achieve that objective meets an external standard.

**5. Ignoring the operational delivery frameworks (ITIL).**
Building a beautiful ISMS and PCI DSS programme on paper, but failing to integrate security requirements into the IT service management processes (change management, incident management, problem management) that govern how IT actually operates. Security governance disconnected from IT operations is ineffective governance.

---

## A Final Decision Framework: The Five Questions Summary

When asked "which framework should we implement?", answer these five questions in order:

1. **What is mandatory?** (Contractual, regulatory, legal obligations) → These are non-negotiable starting points.

2. **What do customers require?** (Market expectations) → These are business-critical priorities.

3. **What sector are we in?** (Sector-specific frameworks) → These add requirements to the mandatory and customer-driven list.

4. **What can we realistically sustain?** (Size and resource) → These define the realistic scope of implementation.

5. **What maturity level are we at, and what is the next step?** (Current vs target state) → These determine sequencing and prioritisation.

The answer to these five questions produces a clear, defensible framework selection rationale — one that can be presented to the board, to customers, and to regulators.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Auditors must understand how ISO 27001 relates to other frameworks — both to advise organisations on integration opportunities and to understand what additional requirements (PCI DSS, Cyber Essentials, NIST CSF) may apply alongside ISO 27001. The Lead Auditor exam tests understanding of the ISO 27001 ecosystem, not ISO 27001 in isolation.

**CISM:**
- Domain 1 (Governance) — selecting the right governance framework for the organisation's context is a fundamental CISM governance capability. CISM candidates should be able to justify framework selection based on business drivers, regulatory requirements, and security maturity.

**CRISC:**
- Domain 1 (IT Risk Identification) — framework selection is a risk management decision. The right framework reduces compliance risk, satisfies regulatory obligations, and provides credible assurance to stakeholders. CRISC candidates should understand how frameworks support risk management across different regulatory contexts.

**CISSP:**
- Domain 1 (Security and Risk Management) — CISSP tests candidates on a broad range of frameworks and their appropriate application. Know the primary frameworks, their purposes, and their relationships.

---

## GUARDIAN's Take

The framework landscape is complex, overlapping, and — to anyone encountering it for the first time — genuinely confusing. But beneath the complexity, the logic is simple: frameworks exist to provide structure for achieving security outcomes. The right framework is the one that helps the organisation achieve the outcomes its stakeholders need, at the maturity level it can sustain, for the regulatory context it operates in.

The professionals who navigate the framework landscape most effectively are those who have genuinely understood what each framework does — not just its name and acronym, but its underlying philosophy, its governance structure, its assurance output, and its limitations. They can look at an organisation's situation and say: "You're a UK SaaS company selling to NHS trusts. You need Cyber Essentials Plus immediately for the NHS contract, ISO 27001 within 18 months to grow into larger contracts, and SOC 2 Type II in year 3 when you're ready to expand into the US market. And here's how we build those three programmes on a single, integrated ISMS so we're not doing the work three times."

That integrated, sequenced, commercially grounded advice is what separates a GRC professional from a framework expert. The frameworks are the vocabulary. Understanding how to use them in combination, in the right order, for the right organisation, at the right time — that is the expertise.

Build the vocabulary through this curriculum. Apply the expertise through engagement with real organisations and real decisions. The curriculum gives you the what; the work gives you the how.

---
*Module: Module 7 — Governance Frameworks | Guardian Curriculum*
