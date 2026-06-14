---
tags: [guardian, grc, module-11, cloud-risk, saas-risk, cloud-security, shared-responsibility, csp-assessment]
module: 11
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-25
guardian-refs: ["G11-01 — Third-Party Risk Management Framework", "G11-02 — Due Diligence and Supplier Assessment", "G11-03 — Contractual Security Requirements", "G4-01 — A.5.23 Cloud Services", "G5-08 — International Data Transfers", "G7-04 — SOC 2"]
---

# G11-05 — Cloud Provider and SaaS Risk Management

> [!abstract] What This Note Covers
> By the end of this note, you will understand the specific risk dimensions of cloud and SaaS relationships — the shared responsibility model, how to assess cloud providers, what documentation and controls are specific to cloud environments, and how cloud provider risk management connects to ISO 27001, GDPR, and operational resilience frameworks.

---

## Why This Exists

Cloud and SaaS relationships are the dominant form of third-party technology dependency in modern organisations — and they present risk management challenges that differ materially from traditional on-premise supplier relationships.

The key differences: the organisation has no direct control over the infrastructure; the shared responsibility model creates ambiguity about who is responsible for what; the scale of cloud providers creates both resilience (redundancy, investment) and concentration risk (single point of failure for many organisations simultaneously); and the nature of cloud configuration means the most common cloud security failures are not vendor failures — they are customer configuration failures.

Understanding these distinctions enables effective cloud-specific risk management that goes beyond applying traditional TPRM questionnaires to a fundamentally different type of relationship.

---

## The Shared Responsibility Model

The most important concept in cloud security is the **shared responsibility model** — the explicit delineation of which security responsibilities belong to the cloud service provider (CSP) and which belong to the customer.

The division varies by service model:

### Infrastructure as a Service (IaaS)

**CSP responsible for:**
- Physical data centre security (power, cooling, physical access)
- Host hardware security (servers, storage, networking)
- Hypervisor security
- Network infrastructure security

**Customer responsible for:**
- Operating system security (patching, configuration hardening)
- Middleware and runtime security
- Application security
- Data security (encryption, access control)
- Identity and access management (IAM) — who can access what
- Network security controls (security groups, network ACLs)
- Logging and monitoring (which logs to enable and collect)

**Examples**: AWS EC2, Azure Virtual Machines, Google Compute Engine

### Platform as a Service (PaaS)

**CSP responsible for:**
- Everything in IaaS (physical, hardware, hypervisor)
- Operating system
- Middleware and runtime environment

**Customer responsible for:**
- Application code security
- Data security
- IAM for the application and platform
- Configuration of the PaaS service
- Logging and monitoring of application behaviour

**Examples**: AWS Lambda, Azure App Service, Google App Engine, Heroku

### Software as a Service (SaaS)

**CSP responsible for:**
- Everything in PaaS
- Application code and functionality
- Application-level security (authentication, authorisation, encryption)

**Customer responsible for:**
- Data entered into the service
- User access management (who has accounts; what permissions they have)
- Configuration of the SaaS service security settings (MFA enforcement, audit logging enabled, data sharing restrictions)
- Integration security (API keys, webhook security)

**Examples**: Microsoft 365, Google Workspace, Salesforce, ServiceNow, Workday

### The Critical Insight

**The CSP never bears responsibility for the customer's configuration choices.** If the customer creates a publicly accessible S3 bucket, that is a customer configuration failure — not an AWS failure. If the customer enables MFA as an option but does not enforce it, and a user's account is compromised through credential stuffing, that is a customer failure. If the customer grants an IAM role permissions far broader than needed, and that role is compromised, the blast radius is the customer's responsibility.

This is why the vast majority of cloud security breaches are not CSP failures — they are customer misconfiguration. Capital One (exposed S3 bucket, over-permissive IAM role), Twitch (misconfigured server), CodeSpaces (IAM compromise leading to data deletion) — all customer-side configuration failures in cloud environments.

**The risk management implication**: Cloud risk management must assess not just the CSP's security posture but the organisation's own cloud security posture — its configuration practices, IAM governance, logging and monitoring, and continuous compliance.

---

## Assessing Cloud Service Providers

### Tier 1 CSPs (AWS, Azure, GCP, Oracle Cloud)

The major cloud providers — AWS, Microsoft Azure, Google Cloud Platform — are the most scrutinised technology companies in the world from a security and compliance perspective. They maintain:

- ISO 27001 certification (broad scope; covers core infrastructure services)
- SOC 2 Type II reports (multiple reports covering different service groups)
- PCI DSS compliance (AWS, Azure, GCP are all QSA-assessed)
- FedRAMP authorisation (for US government workloads)
- ISO 27017 (cloud security controls)
- ISO 27018 (cloud privacy)
- Extensive published security documentation (whitepapers, compliance frameworks)

**Assessment approach for Tier 1 CSPs:**

Given the extensive published compliance evidence and the impracticality of individual due diligence assessment (AWS will not complete your custom questionnaire), the assessment approach for major CSPs focuses on:

*Review published compliance documentation*: AWS Artifact, Azure Compliance Manager, GCP Compliance Reports Center provide access to SOC 2 reports, ISO 27001 certificates, and other compliance documentation.

*Evaluate their shared responsibility documentation*: Verify that the CSP clearly documents what they are responsible for and what the customer is responsible for.

*Assess their security incident history*: Known outages and security incidents; how they were handled; disclosure quality.

*Evaluate sub-processor transparency*: Does the CSP maintain a current list of sub-processors? Is it publicly accessible? Are changes notified?

*GDPR data processing documentation*: Major CSPs provide DPA documentation that satisfies GDPR Article 28. Review and execute the CSP's DPA as part of the relationship.

*Data location and transfer controls*: Where is data stored? Can you specify regions? What controls prevent data from leaving the specified region?

### Tier 2 SaaS Providers

SaaS providers (Salesforce, ServiceNow, Workday, Slack, etc.) present a different assessment challenge — they are larger and more standardised than many traditional suppliers, but they handle more sensitive data and have deeper integration into business processes than typical Tier 2 suppliers.

**Assessment approach for SaaS:**

*SOC 2 Type II report*: The primary assurance document. Request and critically evaluate (as described in G11-02 and G7-04).

*ISO 27001 certification*: Increasingly common for enterprise SaaS providers. Verify scope covers the services you are using.

*Security questionnaire*: Many SaaS providers maintain pre-completed questionnaires (SIG, CAIQ, or custom) through Vendor Security Alliance or directly on their security pages. Review and validate key responses.

*Data sub-processor list*: Request the current sub-processor list. Major SaaS providers maintain this publicly (Salesforce, Slack, Notion, etc.). Assess whether sub-processors handling sensitive data have appropriate security posture.

*Penetration test results*: Some SaaS providers share summaries of annual penetration test results or disclose them through HackerOne/Bugcrowd programmes. Evidence of regular, rigorous external testing is a positive indicator.

*CUECs review*: SOC 2 reports specify Complementary User Entity Controls — controls the customer must implement. Verify your organisation implements all applicable CUECs.

*Data residency options*: Does the SaaS provider offer data residency options (EU-only, UK-only)? For GDPR compliance with data transfers, this may be relevant.

### Niche / Less-Established SaaS Providers

Smaller SaaS providers — early-stage, niche tools, point solutions — often have limited formal security documentation and may not have completed SOC 2 Type II audits. These providers frequently appear in shadow IT — adopted by business units outside central procurement.

**Assessment approach:**

*Security questionnaire*: Custom questionnaire focused on key risk areas: data encryption; access control; breach notification; sub-processors; data deletion on termination.

*Documented evidence requests*: Request specific evidence for critical controls — penetration test report (even if summary only); encryption configuration documentation; backup and DR capability.

*Data minimisation*: Consider whether the tool actually needs access to sensitive data or whether the risk can be reduced by limiting the data provided.

*Risk-based acceptance or rejection*: For tools with limited assurance, consider: is the business value sufficient to justify the risk? Can the data provided be restricted? Is a more mature alternative available?

---

## Cloud Security Posture Management (CSPM)

**The customer misconfiguration problem** is the dominant cloud security failure mode. Organisations with hundreds or thousands of cloud resources frequently have misconfigured resources they don't know about — public S3 buckets, overly permissive IAM roles, security groups allowing broad internet access, logging disabled on sensitive services.

**Cloud Security Posture Management (CSPM)** tools continuously scan cloud environments for misconfiguration against security benchmarks (CIS AWS Foundations Benchmark; CIS Azure Foundations Benchmark; NIST) and compliance frameworks (PCI DSS; ISO 27001; GDPR).

**Leading CSPM tools:**
- AWS Security Hub (native AWS; free tier covers CIS benchmarks)
- Microsoft Defender for Cloud (native Azure; multi-cloud support)
- GCP Security Command Center (native GCP)
- Wiz (commercial; leading multi-cloud CSPM; deep graph analysis)
- Orca Security (commercial; agentless cloud security platform)
- Prisma Cloud (Palo Alto Networks; enterprise multi-cloud)
- Lacework (commercial; anomaly detection and compliance)

**What CSPM provides:**
- Continuous inventory of all cloud resources
- Continuous compliance assessment against defined benchmarks
- Real-time alerting on misconfigurations (new publicly accessible storage; IAM role with excessive permissions)
- Drift detection (identifying when resources deviate from their intended configuration)
- Compliance reporting for ISO 27001, PCI DSS, SOC 2 frameworks

**CSPM as evidence for ISO 27001 A.8.9** (Configuration management) and **A.5.23** (Cloud services): CSPM reports provide continuous evidence of configuration compliance — replacing point-in-time manual reviews with continuous automated monitoring.

---

## ISO 27001 Control A.5.23: Information Security for Use of Cloud Services

ISO 27001:2022 Annex A.5.23 (new in 2022) specifically addresses cloud services:

> "Processes for acquisition, use, management and exit from cloud services shall be defined in accordance with the organisation's information security requirements."

**What A.5.23 requires in practice:**

*Acquisition:* Security requirements must be defined and assessed before adopting cloud services. This means:
- Cloud services must go through the TPRM process before adoption
- The shared responsibility model must be documented for each cloud service
- Security requirements (encryption, logging, access control) must be confirmed as supportable before the service is adopted

*Use:* Cloud services must be configured securely:
- Configuration must align with the organisation's security requirements and relevant baselines (CIS Benchmarks)
- IAM must be managed (least privilege; MFA enforced; regular access reviews)
- Logging must be enabled and logs collected into central monitoring
- Data classification and handling must be applied (sensitive data encrypted; access restricted)

*Management:* Ongoing monitoring and governance:
- CSPM for continuous configuration monitoring
- Access reviews for cloud IAM (users, roles, service accounts)
- Periodic reassessment of the cloud provider's security posture
- Monitoring for changes in the cloud provider's data sub-processors or data processing terms

*Exit:* Exit planning must be in place before adoption:
- How will data be exported from the cloud service?
- What is the format and timeline for data export?
- How will data be deleted at contract termination?
- What is the migration path to an alternative service?
- Has the exit been tested (or at least walked through)?

---

## GDPR and Cloud Services

**Data processing in the cloud creates GDPR obligations:**

*Controller-processor relationship:* Cloud providers acting as processors (processing personal data on the organisation's behalf) require a DPA. Major cloud providers (AWS, Azure, GCP) provide DPA documentation — execute it as part of the service onboarding process.

*International data transfers:* Cloud providers host data in data centres globally. Understanding where data is stored (and whether it is processed in non-UK/EU jurisdictions) is essential for GDPR compliance. Major CSPs provide region selection and data residency guarantees. Execute SCCs or IDTA where data may be processed in jurisdictions without adequacy.

*Sub-processor transparency:* Cloud providers use sub-processors. The DPA must cover sub-processor oversight. Major CSPs publish their sub-processor lists and provide notification of changes.

*Data subject rights:* When an organisation uses cloud services to process personal data, it must be able to fulfil data subject rights (access, erasure, portability). Ensure the cloud service enables these — exporting data for SARs; deleting data in response to erasure requests.

---

## Cloud Concentration Risk

Cloud concentration risk — over-reliance on a single cloud provider — has emerged as a systemic risk concern for both individual organisations and the broader economy.

**Individual organisation risk:**
- If AWS, Azure, or GCP experiences a significant regional or global outage, the organisation's operations are affected proportionately to its cloud dependency
- Single-cloud architecture with no multi-cloud fallback creates a single point of failure

**Systemic risk:**
- When thousands of organisations depend on the same cloud provider, a provider outage simultaneously affects them all
- This is the concern driving UK FCA/PRA operational resilience requirements and the CTP (Critical Third Party) designation regime
- DORA specifically requires concentration risk assessment for ICT service providers

**Mitigation approaches:**

*Multi-cloud architecture*: Distributing workloads across multiple cloud providers — AWS for primary; Azure as DR target; GCP for specific workloads. More complex to manage; reduces single-provider dependency.

*Cloud-agnostic architecture*: Using abstraction layers (Kubernetes, Terraform) that allow workloads to run on any cloud provider — enabling migration without re-architecture in a failover scenario.

*On-premise fallback*: For the most critical workloads, maintaining an on-premise or co-location alternative that can operate if the cloud is unavailable.

*Exit strategy documentation*: DORA and FCA/PRA both require documented exit strategies for critical ICT providers — a practical plan for migrating to an alternative provider if the relationship must end or if the provider is unavailable.

---

## SaaS-Specific Risk Management Considerations

### Shadow SaaS

**The problem**: Business units adopt SaaS tools outside central procurement — marketing using Notion, finance using Airtable, developers using Postman, HR using a niche HRIS. These tools often handle sensitive data (customer data, financial data, HR data) without any due diligence, DPA, or security assessment.

**Discovery approaches:**
- CASB (Cloud Access Security Broker) tools that inspect outbound traffic and identify SaaS services in use
- SSO integration review (if the organisation uses Okta, Azure AD, or Google Workspace SSO, SSO-integrated apps are visible)
- Expense and card transaction reviews for software subscriptions
- Business unit surveys

**Response to shadow SaaS:**
- Fast-track assessment for high-risk shadow SaaS (those handling sensitive data)
- Enforce procurement controls: new SaaS tools must be approved through IT/security before adoption
- Consider implementing SSO for all SaaS tools — creating visibility of adoption and enabling centralised access management

### API Keys and Integration Security

SaaS integrations typically use API keys or OAuth tokens. These credentials provide direct access to the SaaS service's data and functionality — equivalent to a user account.

**API security requirements:**
- API keys must be stored securely (secret management tools — AWS Secrets Manager, HashiCorp Vault, Azure Key Vault) — never in code, configuration files, or source repositories
- API keys must have the minimum permissions needed (read-only where write access is not required)
- API keys must be rotated regularly and immediately when a person with access departs
- Unused API keys must be revoked
- Audit logs of API key usage must be monitored

**The leaked API key problem**: API keys committed to source code repositories (GitHub, GitLab) are a frequent source of data breaches. Automated secrets scanning tools (GitLeaks, TruffleHog, GitHub Secret Scanning) can detect secrets in commits and alert before they are published.

---

## Common Mistakes and Failures

**1. Assuming shared responsibility means the CSP is responsible for everything.**
"It's in the cloud — the provider handles security." The shared responsibility model is explicit: the customer is responsible for IAM, configuration, data encryption, logging, and access management in IaaS and SaaS environments. Misconfiguration is the leading cause of cloud data breaches.

**2. No CSPM — configuration drift goes undetected.**
An S3 bucket that was private at deployment is made public six months later by a developer who needed to share a file quickly and didn't understand the implications. Without CSPM, this remains undetected until a breach or a researcher discovers it.

**3. No DPA with SaaS providers.**
Many organisations adopt SaaS tools that process personal data without executing a DPA. The major providers (Microsoft, Google, Salesforce) provide standard DPAs — but the organisation must actively agree to them, not just use the service.

**4. API keys in source code.**
A developer commits an AWS access key to a GitHub repository. The repository is public (or is made public accidentally). The key is discovered by automated scanners within hours and used to access AWS resources. This is the leading cause of cloud credential compromise.

**5. No exit strategy.**
"We'll figure it out if we need to leave." For SaaS platforms where the provider stores significant amounts of business data, the absence of a practical exit strategy creates both commercial risk (vendor lock-in) and resilience risk (unable to operate if the SaaS platform is unavailable).

**6. Treating all cloud providers as equivalent risk.**
AWS, Azure, and GCP have security programmes that most organisations cannot match. A niche SaaS start-up handling sensitive data is a fundamentally different risk profile. Tier cloud providers appropriately — don't apply the same reduced-scrutiny approach to a start-up SaaS as to AWS.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- A.5.23 (Cloud services) is a new 2022 control. Auditors should assess: does the organisation have a process for cloud service adoption that includes security assessment? Is the shared responsibility model documented for critical cloud services? Is CSPM in place? Are DPAs executed with cloud providers?
- Common finding: no formal cloud adoption process; shadow SaaS without any assessment; DPAs not executed with SaaS providers processing personal data.

**CISM:**
- Domain 3 (Security Programme) — cloud security is a major programme component. CISMs must understand the shared responsibility model, cloud-specific security controls, and CSPM.

**CRISC:**
- Domain 1 (IT Risk Identification) — cloud concentration risk, misconfiguration risk, and shadow SaaS risk are significant IT risk categories.

**CISSP:**
- Domain 3 (Security Architecture and Engineering) — cloud security architecture, shared responsibility model, and cloud provider assessment are examinable.

---

## GUARDIAN's Take

The cloud is not inherently more or less secure than on-premise. It is different — and the differences require different security practices.

The three cloud-specific failures that account for the majority of cloud security breaches are: misconfiguration (publicly accessible storage; over-permissive IAM); credential compromise (API keys in source code; no MFA on cloud management consoles); and shadow IT (unsanctioned SaaS tools processing sensitive data without any assessment or controls).

None of these failures are the cloud provider's fault. They are all customer-side control failures. And none of them are addressed by the traditional TPRM controls — questionnaires, ISO 27001 certificates, and contractual security clauses — that govern on-premise supplier relationships.

The control set that actually addresses cloud security risk is: CSPM for continuous misconfiguration detection; IAM governance for identity and access control; secrets management for credential protection; shadow IT discovery for visibility; and exit planning for resilience.

These controls are not complicated. They are increasingly well-supported by native cloud tooling (AWS Security Hub, Microsoft Defender for Cloud). The barrier is not technology — it is the organisational understanding that cloud adoption transferred security responsibilities to the customer, and that the customer must invest in exercising those responsibilities.

The shared responsibility model is only as effective as the organisation's commitment to fulfilling its side of it.

---
*Module: Module 11 — Third Party and Supply Chain | Guardian Curriculum*
