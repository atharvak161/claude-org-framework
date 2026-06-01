---
tags: [guardian, grc, module-14, grc-tooling, grc-platforms, automation, technology]
module: 14
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-28
guardian-refs: ["G14-01 — Building a GRC Function", "G14-03 — ISO 27001 Certification", "G2-08 — Risk Register", "G10-06 — Audit Report Writing", "G9-05 — Policy Lifecycle"]
---

# G14-04 — GRC Tooling — Platforms, Automation, and the Limits of Technology

> [!abstract] What This Note Covers
> By the end of this note, you will understand the landscape of GRC tooling — from dedicated GRC platforms to point solutions and automation capabilities — what technology can and cannot do for a GRC programme, how to evaluate and select tools, and the risks of over-relying on technology as a substitute for programme substance.

---

## Why This Exists

The GRC technology market has exploded. There are now dozens of platforms claiming to automate compliance, manage risk, and produce certification-ready evidence with minimal human effort. Some of these claims have merit. Many do not.

GRC professionals who select tooling without understanding the landscape risk: paying significant sums for platforms that don't match their needs; over-investing in technology before the programme has the maturity to use it effectively; or — most dangerously — mistaking technology adoption for programme maturity.

This note provides an honest assessment of what GRC tooling is, what it does well, what it does poorly, and how to make sensible tooling decisions.

---

## The GRC Tooling Landscape

### Category 1: Dedicated GRC Platforms (Enterprise)

Full-featured platforms that integrate risk management, compliance management, policy management, audit management, and reporting in a single system. Typically sold to large enterprises.

**Major players:**
- **ServiceNow GRC** — market leader for large enterprises already running ServiceNow ITSM; deep integration with IT operations; powerful workflow and reporting
- **RSA Archer** — one of the oldest dedicated GRC platforms; feature-rich; highly configurable; significant implementation effort
- **IBM OpenPages** — strong in financial services; deep regulatory content; AI-assisted risk identification
- **MetricStream** — broad GRC capability; widely used in regulated industries (financial services, healthcare)
- **SAI360** — policy management and compliance-focused; strong in ethics and compliance

**Strengths**: Comprehensive integrated capability; enterprise-grade reporting; workflow automation; scalable to complex organisations.

**Weaknesses**: Very expensive (£50K–500K+ annual licences); high implementation complexity (6–18 months typical implementation); require significant ongoing administration; often over-engineered for mid-market organisations.

**Appropriate for**: Large enterprises (500+ staff) with complex GRC requirements across multiple regulatory frameworks; organisations with existing ServiceNow or enterprise platform investments.

---

### Category 2: Compliance Automation Platforms (Mid-Market)

Platforms specifically designed to automate the collection of compliance evidence, manage audit preparation, and maintain continuous compliance with specific frameworks (ISO 27001, SOC 2, GDPR, PCI DSS).

**Major players:**
- **Vanta** — fastest-growing compliance automation platform; excellent for SOC 2 and ISO 27001; integrates with cloud providers, SaaS tools, and identity systems to collect evidence automatically; strong UI; popular with SaaS companies and scale-ups
- **Drata** — similar to Vanta; strong SOC 2 and ISO 27001 automation; evidence collection integrations; widely adopted in US SaaS market
- **Sprinto** — Vanta/Drata competitor with strong UK/EU market presence; ISO 27001 and GDPR focus; good for mid-market UK companies
- **Secureframe** — compliance automation with broad framework coverage; strong customer support
- **Tugboat Logic / OneTrust** — OneTrust has acquired several GRC platforms; now offers broader GRC and privacy management capability

**How they work**: These platforms integrate with your cloud providers (AWS, Azure, GCP), identity systems (Okta, Google Workspace, Azure AD), and SaaS tools (GitHub, Jira, Slack) through APIs. They automatically pull evidence of controls operating — access reviews, MFA status, patch records, backup completion — and present it in an audit-ready dashboard.

**Strengths**: Dramatically reduces evidence collection effort; always-on compliance monitoring; strong for SOC 2 and ISO 27001; good for organisations with cloud-native infrastructure; audit-ready evidence packs; integrations with CBs (Vanta and Drata have preferred CB relationships)

**Weaknesses**: Less useful for complex on-premise environments where API integrations are limited; evidence collection automation does not substitute for actually implementing controls; can create false confidence if organisations rely on the dashboard without understanding the underlying controls; typically weaker for risk management and policy governance than for compliance evidence.

**Cost**: £10K–50K annually depending on size and frameworks.

**Appropriate for**: SaaS companies and cloud-native organisations (50–500 staff) pursuing SOC 2 and/or ISO 27001 certification; organisations where the evidence collection burden is the primary pain point.

---

### Category 3: Risk Management Tools

Dedicated tools for risk register management, risk assessment, and risk reporting.

**Major players:**
- **LogicGate** — workflow-based risk management; highly configurable; popular in North America
- **Diligent** — board-level governance and risk reporting; strong on board communication
- **Riskonnect** — enterprise risk management platform; strong in insurance and complex enterprise
- **SimpleRisk** — open-source risk management; free tier available; good for smaller organisations
- **Risk Cloud (LogicGate)** — workflow-driven risk management

**The risk management tool reality**: Most organisations start their risk management programme in a spreadsheet (Excel or Google Sheets). This is not a failure — for organisations with fewer than 50 risks, a well-designed risk register spreadsheet is frequently more practical and maintainable than a dedicated risk management tool.

The case for a dedicated risk management tool emerges when:
- The risk register exceeds ~75 risks and becomes unwieldy in a spreadsheet
- Multiple people need concurrent access and edit rights
- Workflow automation (risk review notifications; treatment plan tracking) would save significant time
- Board-level reporting from the risk register needs automation

**Appropriate for**: Large organisations (300+ staff) with complex risk portfolios; organisations with multiple risk owners requiring workflow management.

---

### Category 4: Policy Management Tools

Tools for maintaining the policy library, managing approval workflows, tracking staff acknowledgement, and ensuring policy currency.

**Major players:**
- **PolicyTech / NAVEX** — market leader in policy management; strong workflow; used by large enterprises for compliance-driven policy programmes
- **ConvergePoint** — SharePoint-based policy management
- **Quantivate** — policy and compliance management combined
- **ManageEngine** — IT-focused policy management

**The policy management tool reality**: Like risk registers, most organisations start policy management in SharePoint or Confluence. A well-organised SharePoint library with version control, approval workflows (using Power Automate or similar), and tracked review dates is functional for organisations with a moderate policy portfolio.

The case for dedicated policy management tools emerges when:
- The policy library exceeds ~50 documents with complex approval hierarchies
- Staff acknowledgement tracking at scale is required (thousands of staff; mandatory acknowledgements with audit trail)
- Complex multi-language, multi-jurisdiction policy requirements

---

### Category 5: Audit Management Tools

Tools for managing the internal audit programme — scheduling audits, documenting fieldwork, tracking findings, and managing corrective actions.

**Major players:**
- **TeamMate+** — market leader in internal audit management; used by large enterprises and professional services firms
- **Diligent HighBond** — combined audit management and GRC platform
- **AuditBoard** — popular mid-market audit platform; strong for SOX and ISO 27001 internal audit
- **LogicManager** — combined risk and audit management

**The audit management tool reality**: Internal audit programmes for most organisations (fewer than 5 auditors; fewer than 20 audits annually) can be managed in spreadsheets and document management systems without dedicated tooling. The case for dedicated audit management emerges when:
- The internal audit team is large (5+ auditors)
- The audit programme is complex (SOX; ITGC; multiple frameworks)
- Corrective action tracking at scale is required

---

### Category 6: Continuous Controls Monitoring (CCM)

Tools that continuously monitor the operational status of security controls — providing real-time evidence of control effectiveness rather than point-in-time snapshots.

**Key tools:**
- **CSPM tools** (AWS Security Hub; Microsoft Defender for Cloud; Wiz; Orca; Prisma Cloud) — continuous monitoring of cloud configuration compliance; covered in Module 11
- **Vulnerability scanners** (Qualys; Tenable; Rapid7) — continuous vulnerability monitoring
- **Identity governance tools** (SailPoint; Saviynt; CyberArk) — continuous monitoring of identity and access compliance
- **Data discovery tools** (Varonis; BigID) — monitoring of data access and classification compliance

**Value proposition**: CCM tools convert point-in-time compliance assessments into continuous monitoring — detecting drift from compliant configuration in real time rather than discovering it at the next audit. This is the direction of travel for mature GRC programmes.

---

## The Evidence Collection Problem and What Automation Solves

**The compliance evidence burden**: ISO 27001, SOC 2, and PCI DSS all require ongoing evidence that controls are operating. For a mid-market organisation:
- Monthly access reviews across 15 systems
- Weekly vulnerability scan reports
- Annual training completion records for 200 staff
- Quarterly supplier assessment records
- Patch records for 500 endpoints
- Incident log maintenance
- Firewall rule change records

Collecting, organising, and maintaining all of this evidence manually is a significant burden — estimated at 20–40 hours per month for a 200-person organisation pursuing ISO 27001.

**What compliance automation platforms solve**: Vanta, Drata, and Sprinto automate evidence collection from integrated systems — pulling MFA status from the identity provider; backup completion from the backup system; open source vulnerability status from GitHub; patch compliance from the MDM. This can reduce the evidence collection burden by 60–80%.

**What they do NOT solve:**
- The controls still need to actually work — if MFA is not enrolled, Vanta will show it is not enrolled (correct behaviour); it does not enroll MFA for you
- Risk assessment — the risk register must be maintained by humans with business context; no tool can substitute for the risk judgment required
- Policy content — policies must be written by people who understand the business and the requirements; tools manage the lifecycle, not the content
- Cultural change — awareness; accountability; management engagement — these are human change management challenges

---

## Evaluating and Selecting GRC Tools

### The Selection Framework

**Step 1: Define the problem you are solving**

The worst GRC tool selections start with "which GRC platform should we buy?" They should start with "what specific problem are we trying to solve?"

Common specific problems:
- "We spend 30 hours per month collecting evidence for our SOC 2 audit. We want to reduce this." → Compliance automation platform (Vanta/Drata)
- "Our policy library is in a SharePoint folder; nobody can find anything; review dates are missed." → Policy management tool or better SharePoint organisation
- "We have 120 risks in a spreadsheet that three people edit simultaneously and we have version conflict problems." → Dedicated risk management tool
- "We need to demonstrate continuous compliance to enterprise customers." → CCM tools + compliance automation platform

**Step 2: Define your requirements**

Before evaluating tools, define what the tool must do:
- Which frameworks must it support? (ISO 27001; SOC 2; PCI DSS; GDPR)
- Which integrations are essential? (AWS; Azure; Okta; Jira; GitHub)
- How many users will need access?
- What reporting outputs are required?
- What is the implementation timeline?
- What is the budget?

**Step 3: Shortlist based on requirements**

Identify 3–4 tools that meet the requirements. Do not evaluate 10 tools — the decision process becomes unmanageable.

**Step 4: Proof of concept**

For platforms above £10K annually, request a trial or POC. Evaluate:
- Does it actually do what the vendor claims?
- How intuitive is the interface for the people who will use it daily?
- How well do the integrations work in your specific environment?
- How responsive is support?

**Step 5: Reference check**

Speak to 2–3 customers of similar size and profile. Ask: what did you expect and what did you get? What were the implementation surprises? How long did it actually take to get value?

**Step 6: Implementation planning**

Before purchasing, understand what implementation requires:
- Internal effort (who will configure it; how long will it take?)
- Vendor/partner support (is implementation assistance included or billed separately?)
- Integration effort (are your specific systems supported by the integrations; what is the setup time?)
- Ongoing administration (how much time will it require to maintain?)

---

## The Limits of GRC Technology

### Technology Cannot Substitute for Programme Maturity

The most dangerous use of GRC technology is as a substitute for programme substance. A compliance dashboard that shows all controls green is only as valuable as the programme that made those controls green. If controls were implemented specifically to make the dashboard green — rather than to manage genuine risks — the dashboard provides false assurance.

**The compliance theatre risk**: Platforms like Vanta and Drata are occasionally used to produce the appearance of compliance without the substance. The organisation purchases the platform, completes the required controls to achieve a "passing" state on the dashboard, and produces a SOC 2 report — without meaningfully improving security. The report satisfies customer questionnaires; the security programme remains superficial.

This works until something goes wrong — an actual breach, a sophisticated customer audit, or a regulator that looks behind the dashboard. At that point, the gap between compliance appearance and security reality becomes very visible.

### Technology Cannot Replace Risk Judgment

No GRC platform can tell you what your organisation's risk appetite is. No tool can decide whether to accept, mitigate, transfer, or avoid a specific risk. No algorithm can assess whether a supplier's security posture is adequate for the sensitivity of the data they will handle.

These are human judgments — requiring business context, organisational knowledge, regulatory understanding, and professional experience. GRC tools assist with the information management, workflow, and evidence presentation that surround these decisions. They do not and cannot replace the decisions themselves.

### Technology Changes Faster Than Tools

The GRC technology landscape changes rapidly — platforms are acquired, new competitors emerge, integrations break, pricing changes. A platform that is the market leader today may be significantly worse (or unavailable) in 3 years. Over-investing in any single platform creates lock-in risk.

**Practical implication**: Design your GRC programme so it is platform-agnostic where possible. Policies, risk registers, and evidence should be exportable and portable. Don't build your entire programme into the proprietary structure of a single platform.

---

## Pragmatic Tooling Approach by Maturity Stage

**Stage 1 — Programme just starting (Year 1):**
- Risk register: Excel or Google Sheets
- Policy management: SharePoint or Confluence with version control
- Evidence management: SharePoint folder structure
- Audit management: Spreadsheet
- Total tooling spend: £0–2K

Rationale: At this stage, the programme needs to be built, not automated. Invest in people and process, not tools. Tools add value when there is a programme to manage.

**Stage 2 — Programme established, pursuing certification (Year 1–2):**
- Consider compliance automation platform (Vanta, Drata, Sprinto) if cloud-native
- Risk register: Still manageable in spreadsheet unless >75 risks
- Policy management: Enhanced SharePoint or Confluence
- Audit management: Spreadsheet or lightweight tool
- Total tooling spend: £10K–30K

Rationale: The evidence collection burden for certification justifies automation investment. The risk and policy management is still small enough to manage without dedicated tools.

**Stage 3 — Certified, scaling (Year 2–4):**
- Compliance automation: Established and integrated
- Risk management: Consider dedicated tool if risk portfolio has grown significantly
- Policy management: Consider dedicated tool if policy library is large and compliance requirements are complex
- Audit management: Consider dedicated tool if audit team has grown
- Total tooling spend: £20K–60K

Rationale: The programme has matured to the point where dedicated tooling delivers genuine efficiency. Multiple simultaneous frameworks (ISO 27001 + SOC 2 + PCI DSS) justify integrated platform investment.

**Stage 4 — Enterprise, multiple frameworks, complex requirements:**
- Enterprise GRC platform or best-of-breed integrated stack
- Total tooling spend: £50K–250K+

---

## Common Tooling Mistakes

**1. Buying the platform before building the programme.**
A GRC platform with no risk register data, no policies, and no evidence to manage is an expensive empty container. Build the programme; then automate it.

**2. Letting the vendor define the programme.**
Some compliance automation platforms present a framework-specific list of controls to implement. Following this list is a starting point — not a substitute for a risk-based assessment of which controls are most important for your organisation.

**3. Not accounting for implementation effort.**
"The platform will be live in 2 weeks." Realistic implementation timelines are 2–4 months for compliance automation platforms and 6–18 months for enterprise GRC platforms. Budget the internal effort, not just the licence cost.

**4. Evaluating on feature count rather than fit.**
The platform with 200 features is not better than the platform with 50 features if those 50 features are the 50 you actually need. Evaluate on fit to requirements.

**5. Ignoring integration compatibility.**
The platform's integrations look great in the demo — AWS, Azure, Okta, GitHub. But your environment uses GCP, JumpCloud, and Bitbucket. The integrations may not exist. Verify integration compatibility for your specific tech stack before purchasing.

---

## GUARDIAN's Take

GRC tooling is an accelerant for a mature programme and a distraction for an immature one. The organisations that get the most value from compliance automation platforms (Vanta, Drata, Sprinto) are those that already have strong control implementation and just need the evidence management burden reduced. The organisations that get the least value are those that buy the platform hoping it will build the programme for them.

The truth is that GRC tooling automates what can be automated — evidence collection, dashboard presentation, workflow notifications — and leaves what cannot be automated: risk judgment, governance decisions, cultural change, and the professional expertise to understand what good looks like.

This curriculum has given you that expertise. Tools support the work of an expert; they do not create expertise. Know what good looks like; use tools to manage the programme efficiently; don't mistake the dashboard for the programme.

---
*Module: Module 14 — GRC in Practice | Guardian Curriculum*
