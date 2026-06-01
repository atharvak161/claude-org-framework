---
tags: [guardian, grc, module-4, iso27002, organisational-controls, policies, roles, responsibilities, threat-intelligence, classification]
module: 4
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G3-10 — Annex A Controls — Complete Reference 2022", "G3-11 — Statement of Applicability", "G4-02 — People Controls", "G4-03 — Physical Controls", "G4-04 — Technological Controls", "G4-05 — Control Selection and Justification"]
---

# G4-01 — Organisational Controls — Policies, Roles, Responsibilities

> [!abstract] What This Note Covers
> By the end of this note, you will understand the 37 organisational controls in ISO 27002:2022 Category 5 in depth — what each requires in practice, how to implement them effectively, what good evidence looks like, and where organisations most commonly fail.

---

## Why This Exists

ISO 27001 Annex A tells you *what* controls exist. ISO 27002:2022 tells you *how* to implement them. For Category 5 — Organisational Controls — ISO 27002 provides implementation guidance for the 37 controls that govern the policies, structures, processes, and relationships that underpin the entire ISMS.

Organisational controls are not technical. They are the human and management infrastructure within which technical controls operate. A perfect firewall is worthless if no policy defines what it should protect. Perfect encryption is irrelevant if no policy defines what data requires it. Perfect access control is meaningless if no process reviews whether access rights remain appropriate.

The 37 organisational controls are the governance layer of information security — and they are where most ISMS failures originate.

This note goes beyond the brief Annex A descriptions to give you the implementation depth that ISO 27002 provides, organised by the most audited and most commonly failed controls.

---

## ISO 27002:2022 — The Companion to ISO 27001

ISO 27002:2022 (full title: *ISO/IEC 27002:2022 — Information security, cybersecurity and privacy protection — Information security controls*) is the companion standard to ISO 27001. Where ISO 27001 Annex A *names* the 93 controls, ISO 27002 provides:
- A **purpose** statement for each control (why it exists)
- **Implementation guidance** (how to implement it)
- **Other information** (additional context, related standards)

ISO 27002 is *informative* — organisations are not certified against it. But its implementation guidance is the authoritative reference for how Annex A controls should be operationalised. Auditors familiar with ISO 27002 will expect implementations that align with its guidance, even if they do not require it explicitly.

---

## The 37 Organisational Controls: Implementation Depth

### A.5.1 — Policies for Information Security

**Purpose**: To maintain management's direction and support for information security in accordance with business requirements, applicable laws, and regulations.

**Two-tier policy structure required:**
1. **Overarching information security policy**: Top-level statement of management intent. Typically 2–4 pages. Signed by CEO/MD. Sets direction and commits to ISO 27001. Does NOT contain detailed requirements.

2. **Topic-specific policies**: Detailed policies for specific areas. ISO 27002 suggests topic-specific policies should cover at least:
   - Access control
   - Physical and environmental security
   - Asset management
   - Information transfer
   - Secure configuration and handling of endpoint devices
   - Network security
   - Incident management
   - Backup
   - Cryptography and key management
   - Information classification and handling
   - Management of technical vulnerabilities
   - Secure development

**Implementation requirements for all policies:**
- Approved by an appropriate level of management (top-level policy by CEO; topic policies by CISO or equivalent)
- Published, communicated, and accessible to all relevant staff
- Reviewed at defined intervals (typically annually) and when significant changes occur
- Version-controlled with approval and review records

**What good evidence looks like:**
- Policy documents with version history, approval signatures, review dates
- Communication records (intranet publication, email notifications, training references)
- Review calendar showing next scheduled review date
- Evidence that the review actually occurred (meeting minutes, updated version)

**Common failures:**
- Policies exist but staff cannot find or access them
- Policies last reviewed 2+ years ago
- Topic-specific policies missing for key areas (particularly cryptography, secure development, incident management)
- Information security policy signed by the IT Director rather than the CEO

---

### A.5.2 — Information Security Roles and Responsibilities

**Purpose**: To establish a defined, approved, and understood structure for information security roles and responsibilities across the organisation.

**What must be defined:**
- The overall accountable for information security (CISO or equivalent)
- Asset owners — who is accountable for each information asset
- Risk owners — who is accountable for specific risks in each business area
- Process owners — who is responsible for key ISMS processes (access management, incident response, vulnerability management)
- General staff responsibilities — what every employee is responsible for

**Segregation of duties** is a key implementation requirement: no single individual should control an entire critical process end-to-end (create AND approve; develop AND deploy; initiate AND authorise a financial transaction).

**What good evidence looks like:**
- Documented role descriptions including security responsibilities
- RACI matrix for key ISMS processes
- Named individuals in each key role (not just "the IT team")
- Evidence that role holders know and have accepted their responsibilities (confirmation email, signed role descriptions)

**Common failures:**
- Security responsibilities listed in job descriptions but never communicated to post-holders
- Asset ownership defined for IT assets only; business information assets unowned
- Risk ownership entirely with the security team rather than with business unit managers
- No segregation of duties for critical processes (same person provisions AND reviews access)

---

### A.5.3 — Segregation of Duties

**Purpose**: To reduce the risk of fraud, error, or the circumvention of information security controls by ensuring that no single individual controls all aspects of a critical process.

**Implementation areas:**
- Financial authorisation: the person initiating a payment should not be the same person authorising it
- Access management: the person requesting access should not be the same person granting it
- Change management: the developer should not be the person who promotes code to production
- Audit: the person responsible for a process should not audit that process
- Key management: no single person should control the entire cryptographic key lifecycle

**Compensating controls when full SoD is not feasible:**
In small organisations, full SoD may not be achievable due to staffing constraints. Compensating controls include:
- Enhanced monitoring and logging of single-person processes
- Supervisory review of completed actions
- Periodic management review of high-risk transactions
- External oversight (board review, external auditor review)

**Documentation requirement**: Where SoD is not implemented, the reason must be documented alongside the compensating controls in place.

---

### A.5.4 — Management Responsibilities

**Purpose**: To ensure that management actively requires all personnel to apply information security in accordance with established policies, procedures, and security requirements.

**Key implementation requirements:**
- Management must actively communicate security expectations — not just approve policies
- Staff must understand that non-compliance has consequences
- Managers must model security behaviour themselves
- Security requirements must be embedded in performance objectives where appropriate
- Security non-compliance must be addressed through the disciplinary process (connected to A.6.4)

**What this looks like in practice:**
- Senior leaders visibly following security policies (using MFA, clearing their desk, not bypassing security controls)
- Security topics discussed in team meetings, not just at annual training
- Security performance included in employee appraisals for roles with security responsibilities
- Managers holding their teams accountable for security policy compliance

---

### A.5.5 — Contact with Authorities

**Purpose**: To ensure the organisation has appropriate contacts with relevant authorities so that information security incidents can be reported, advice obtained, and regulatory requirements understood.

**Minimum requirements:**
- Documented contacts for: law enforcement (Action Fraud, NCSC, local police cyber unit), regulatory bodies (ICO for GDPR breaches, FCA for financial services firms, sector-specific regulators), national cybersecurity authorities (NCSC in the UK)
- A defined process for when each contact should be used
- Procedures for mandatory breach notification (72 hours to ICO under GDPR; specific timelines for FCA-regulated firms)

**Implementation tip**: Create a single "incident response contact card" that lists all regulatory and law enforcement contacts with the relevant notification timelines. This should be in the incident response plan AND accessible offline (in case the incident affects IT systems).

---

### A.5.6 — Contact with Special Interest Groups

**Purpose**: To ensure the organisation maintains current threat intelligence and best practice information by engaging with relevant security communities and professional bodies.

**Examples of relevant groups:**
- **NCSC Early Warning**: Free UK government threat intelligence service — subscribe at ncsc.gov.uk
- **CISP** (Cyber Information Sharing Partnership): UK government-led threat intelligence sharing platform for UK organisations
- **FS-ISAC** (Financial Services ISAC): Sector-specific threat intelligence for financial services
- **UK Cyber Security Council**: Professional body for UK cybersecurity professionals
- **ISACA, ISC2, CISA**: Professional associations with threat intelligence and best practice resources
- **Vendor security advisories**: CISA, Microsoft, cloud providers — subscribe to security advisory feeds for all critical vendors

**What good evidence looks like:**
- Subscription confirmations for threat intelligence services
- Records of intelligence reviewed and acted upon
- Membership records for relevant professional associations
- Examples of intelligence informing risk assessment or control decisions

---

### A.5.7 — Threat Intelligence *(NEW in 2022)*

**Purpose**: To ensure information about threats is collected, analysed, and used to inform risk decisions and control improvements.

**Three levels of threat intelligence (ISO 27002):**
1. **Strategic**: High-level information about the threat landscape — which sectors are being targeted, which threat actor groups are active, which geopolitical factors are relevant. Informs board-level risk appetite and strategic investment decisions.
2. **Tactical**: Information about attack techniques, tools, and procedures (TTPs) used by threat actors relevant to the organisation's sector. Informs defensive architecture and control selection.
3. **Operational**: Specific, actionable intelligence about current attack campaigns — indicators of compromise (IoCs), specific vulnerabilities being actively exploited, targeted phishing campaigns. Informs immediate operational response.

**Minimum implementation:**
- Subscribe to at least one threat intelligence feed appropriate to the organisation's size and sector (NCSC early warning is free and appropriate for all UK organisations)
- Define a process for reviewing and acting on intelligence
- Document how intelligence has informed at least one risk assessment or control decision per year

**Strong implementation:**
- Multiple intelligence feeds (strategic + tactical + operational)
- Formal weekly threat intelligence review by the security team
- Threat intelligence summary in monthly Security Committee reports
- Evidence that specific intelligence triggered specific risk assessment updates or control changes

---

### A.5.8 — Information Security in Project Management

**Purpose**: To ensure information security risks are identified and addressed throughout project lifecycles, before they are embedded into operational systems.

**Implementation requirements:**
- Every project that affects information security (new systems, significant changes, vendor implementations) must include a security risk assessment
- Security requirements must be defined at project initiation
- Security testing must occur before go-live
- Security sign-off must be required before project closure

**What this looks like in practice:**
- A security review gate in the project methodology (e.g. "security assessment required before any new system receives sign-off to proceed to development or procurement")
- A security requirements template used for all projects above a defined threshold
- Evidence that the security team was consulted before, not after, major IT decisions

**Common failure**: Security is consulted at go-live, when the architecture has been finalised and changing it is prohibitively expensive. Security in project management means at the beginning, not at the end.

---

### A.5.9 — Inventory of Information and Other Associated Assets

**Purpose**: To identify the organisation's assets and define appropriate ownership and responsibility for protection.

**Asset register requirements:**
- All information assets, hardware assets, software assets, and service assets within the ISMS scope must be inventoried
- Each asset must have a named owner
- Each asset should be classified (by sensitivity/criticality)
- The register must be kept current

**Asset owner responsibilities (per ISO 27002):**
- Ensuring assets are appropriately classified and labelled
- Defining and periodically reviewing access restrictions
- Ensuring appropriate protection is maintained
- Informing relevant parties when assets are removed from scope or destroyed

**Common failures:**
- Shadow IT not inventoried (cloud services adopted without IT knowledge)
- Asset register last updated 18 months ago
- Assets without named owners ("IT team" is not an owner)
- Software assets missing (only hardware inventoried)

---

### A.5.10 — Acceptable Use of Information and Other Associated Assets

**Purpose**: To ensure that information and associated assets are used appropriately, protecting the organisation from misuse.

**Acceptable Use Policy (AUP) requirements:**
- Must cover: permitted and prohibited uses of information and IT systems
- Must address: personal use of organisational systems, social media, removable media, remote access
- Must be communicated to all staff and contractors
- Staff must acknowledge receipt and understanding (signed or acknowledged electronically)
- Must be reviewed annually

**Key areas to address in the AUP:**
- Email and internet use (personal use limitations, prohibited content categories)
- Removable media (permitted or prohibited; encryption requirements if permitted)
- Personal devices (BYOD policy — what is permitted, what security is required)
- Social media (what may not be shared, reputational standards)
- Software installation (approved/prohibited software lists)
- Information handling (what may be stored on personal devices, cloud services)
- Remote working (security requirements when working outside the office)
- Incident reporting (obligation to report suspected incidents)

---

### A.5.11 — Return of Assets

**Purpose**: To ensure that all organisational assets are returned on termination of employment or contract, protecting the organisation from data loss and unauthorised access.

**Off-boarding requirements:**
- All physical assets returned (laptops, mobile devices, access cards, keys, printed materials)
- All virtual assets decommissioned (removal of access to personal cloud storage accounts set up for work purposes)
- Confirmation that no organisational data has been retained on personal devices
- NDA and confidentiality obligations reminded and confirmed in exit documentation

**What good evidence looks like:**
- Off-boarding checklist with asset return confirmation
- Signed asset return acknowledgement
- Access deprovisioning records linked to departure date
- Exit interview records covering data and asset obligations

---

### A.5.12 — Classification of Information

**Purpose**: To ensure information receives an appropriate level of protection based on its value and sensitivity.

**Classification scheme requirements:**
- Defined classification levels with clear definitions (typically 3–4 levels: Public / Internal / Confidential / Restricted)
- Criteria for classification decisions (what makes something Confidential vs Internal?)
- Owner responsibilities for classification decisions
- Handling requirements for each classification level

**Example classification scheme:**

| Level | Definition | Handling requirements |
|---|---|---|
| **Public** | Information intended for public release | No restrictions; may be shared externally |
| **Internal** | Information for internal use only | Do not share externally without approval; standard access controls |
| **Confidential** | Sensitive business, personal, or financial information | Encryption in transit; access restricted to need-to-know; NDA required for external sharing |
| **Restricted** | Highest sensitivity — trade secrets, regulated data, board-level information | Encryption at rest and in transit; strict access controls; paper copies must be shredded; no personal device access |

**Common failure**: Classification scheme defined but never applied — documents are not classified, staff don't know what classification to apply, and the scheme exists only in the policy document.

---

### A.5.13 — Labelling of Information

**Purpose**: To ensure information is labelled consistently so that protection requirements are clear to all users.

**Labelling approaches:**
- **Digital labelling**: Classification labels in document metadata, email subject lines ("CONFIDENTIAL:"), file naming conventions, Microsoft Information Protection (MIP) sensitivity labels
- **Physical labelling**: Stamps, headers/footers on printed documents, labels on physical media
- **System labelling**: Sensitivity indicators in application interfaces

**Implementation challenge**: Automated labelling (using tools like Microsoft Purview or equivalent) significantly reduces the burden and improves consistency. Manual labelling relies on staff judgment and is consistently less reliable.

---

### A.5.14 — Information Transfer

**Purpose**: To maintain the security of information transferred within the organisation and with external parties.

**Transfer rules must cover:**
- **Electronic transfer**: Email (encryption requirements for sensitive data, prohibition on unencrypted personal data in email), secure file transfer platforms, approved cloud sharing services
- **Physical transfer**: Requirements for transferring physical documents or media (courier requirements, encryption of portable media)
- **Verbal transfer**: Requirements for discussing sensitive information (no sensitive discussions in public places, conference call security)
- **Third-party transfers**: DPAs and data sharing agreements must be in place before personal data is transferred to third parties

**Technical controls supporting transfer security:**
- Email encryption (S/MIME, TLS enforcement)
- Secure file sharing platforms (SharePoint, secure file transfer services)
- DLP rules preventing unencrypted personal data in outbound email
- Prohibition on personal email for work data

---

### A.5.15 — Access Control

**Purpose**: To ensure that access to information and systems is appropriately restricted based on business and security requirements.

**Access control policy requirements:**
- Define the principles for access decisions (least privilege, need-to-know, role-based access)
- Define the process for requesting, granting, reviewing, and revoking access
- Define requirements for privileged access (stricter controls than standard user access)
- Define requirements for remote and third-party access
- Define review frequency for access rights

**Least privilege principle**: Every user should have the minimum access necessary to perform their role. Access should be granted by exception (default deny), not by default (grant all, restrict selectively).

---

### A.5.16 — Identity Management

**Purpose**: To ensure that identities are uniquely assigned, managed through their lifecycle, and deprovisioned promptly when no longer required.

**Identity lifecycle stages:**
1. **Creation**: Unique identity per person; no shared accounts; approval process before creation
2. **Provisioning**: Role-based access assigned at creation; documented and approved
3. **Modification**: Role changes trigger access review and modification
4. **Suspension**: Temporary deactivation for extended absence
5. **Removal**: Immediate deprovisioning on departure (same-day for high-risk departures; within 24 hours as standard)

**Service account management** (a common weakness):
- Service accounts must be inventoried
- Service accounts must have named owners
- Service account passwords must be managed (not embedded in scripts or configuration files)
- Service accounts must follow the same review process as user accounts

---

### A.5.17 — Authentication Information

**Purpose**: To ensure the allocation and management of authentication credentials is controlled to prevent unauthorised access.

**Password management requirements:**
- Minimum complexity (length is more important than complexity — passphrases are encouraged by NCSC)
- No sharing of credentials
- No default/vendor credentials in production
- Secure storage of passwords (password manager, not written down or in spreadsheets)
- Breach detection — checking credentials against known-compromised password lists (Have I Been Pwned API or equivalent)

**MFA requirements:**
- MFA should be mandatory for all remote access, privileged access, and access to sensitive systems
- MFA type should be appropriate to risk — SMS-based MFA is less secure than authenticator app or hardware token

**Temporary credential management:**
- Temporary passwords must be unique per user and changed on first use
- Temporary access credentials must expire automatically

---

### A.5.18 — Access Rights

**Purpose**: To ensure access rights to information and systems are provisioned, reviewed, modified, and removed in a controlled manner.

**Access review requirements:**
- Access rights must be reviewed at defined intervals (typically quarterly for privileged access; annually for standard access)
- Reviews must involve business owners (not just IT) — business owners know whether a person still needs access; IT only knows whether they have it
- Review outcomes must be documented and actioned promptly
- Access that cannot be justified is revoked

**What good access review evidence looks like:**
- Access review report showing all accounts reviewed, with confirmation or change decisions for each
- Evidence of changes made following review (deprovisioning records, access change records)
- Business owner sign-off on review outcomes
- Completed reviews within the defined schedule

---

### A.5.19–A.5.22 — Supplier Security Controls

These four controls together form the supplier security framework:

**A.5.19 — Information security in supplier relationships**: Define the process for assessing and managing supplier security risk before, during, and after the supplier relationship.

**A.5.20 — Addressing information security within supplier agreements**: Ensure security requirements are in all supplier contracts — particularly Data Processing Agreements (DPAs) for GDPR, and security clauses in all contracts where the supplier has access to sensitive information.

**A.5.21 — Managing information security in the ICT supply chain**: Address supply chain-specific risks — compromised software updates (SolarWinds-type attacks), vulnerable libraries, insecure APIs from third-party components.

**A.5.22 — Monitoring, review and change management of supplier services**: Conduct periodic reassessments of critical suppliers; manage supplier changes (ownership changes, subcontractor changes, security incidents at the supplier).

**Minimum implementation for all four:**
- Supplier inventory with risk classification (critical / high / standard)
- Risk-proportionate due diligence before supplier onboarding
- Security clauses in all contracts (minimum: confidentiality, incident notification, access controls, data return/destruction on contract end)
- Annual reassessment for critical and high-risk suppliers
- Process for responding to supplier security incidents

---

### A.5.23 — Information Security for Use of Cloud Services *(NEW in 2022)*

**Purpose**: To ensure cloud services are acquired, used, managed, and exited securely.

**Key implementation areas:**
- **Selection and onboarding**: Assess cloud providers against security requirements before adoption; review their security certifications (ISO 27001, SOC 2, CSA STAR)
- **Configuration**: Ensure cloud environments are configured securely (principle of least privilege in IAM, no public S3 buckets, encryption enabled, logging enabled)
- **Shared responsibility model**: Document which security responsibilities belong to the cloud provider and which belong to the organisation
- **Data residency**: Confirm where data is stored and whether it meets regulatory requirements (GDPR data transfer restrictions)
- **Exit planning**: Define how data will be extracted and deleted at contract termination; test exit before you need it

**Common failure**: Cloud services adopted by business units without IT/security involvement (shadow IT). By the time IT discovers the service, significant data may already be in it without appropriate controls.

---

### A.5.24–A.5.28 — Incident Management Controls

Five controls covering the complete incident management lifecycle:

**A.5.24 — Planning and preparation**: Establish the incident response plan, define roles (Incident Commander, Technical Lead, Communications Lead, Legal/DPO), define classification criteria, establish the incident reporting process.

**A.5.25 — Assessment and decision**: Triage all reported events — determine which are security incidents requiring response and which are false positives or non-security events.

**A.5.26 — Response**: Execute the incident response plan — contain, eradicate, recover, and document. The response process must be documented in advance; improvising during an incident is significantly less effective.

**A.5.27 — Learning from incidents**: Conduct post-incident reviews for all significant incidents; document lessons learned; implement control improvements. This is the link between incident management and ISMS improvement (Clause 10).

**A.5.28 — Collection of evidence**: Maintain forensic capability — know how to preserve evidence in a forensically sound manner; maintain chain of custody; understand what is needed for legal proceedings or regulatory investigations.

**Minimum implementation:**
- Documented incident response plan tested at least annually (tabletop exercise)
- Incident classification criteria (what is a P1 vs P2 vs P3 incident?)
- Incident log maintained for all reported events
- Post-incident review records for P1 and P2 incidents
- Communication procedures for significant incidents (who is notified and when — including regulatory notification obligations)

---

### A.5.29–A.5.30 — Business Continuity Controls

**A.5.29 — Information security during disruption**: Security controls must continue to operate during disruptions — not just when systems are running normally. BCP/DR plans must include security considerations (maintaining access controls during failover, secure use of backup systems, maintaining logging during incidents).

**A.5.30 — ICT readiness for business continuity** *(NEW in 2022)*: ICT continuity requirements must be defined (RTOs and RPOs for critical systems), implemented (DR sites, backup systems, failover configurations), and tested (DR exercises, recovery tests).

---

### A.5.31–A.5.37 — Compliance and Operational Controls

**A.5.31 — Legal, statutory, regulatory and contractual requirements**: Maintain a register of all applicable legal and regulatory obligations; review it annually and when regulations change; track compliance with each obligation.

**A.5.32 — Intellectual property rights**: Manage software licences (no unlicensed software); protect organisational IP; document IP ownership in contracts.

**A.5.33 — Protection of records**: Define retention periods for all record types; implement technical controls to protect records from loss, modification, or unauthorised access; implement secure disposal at end of retention.

**A.5.34 — Privacy and protection of PII**: GDPR and data protection obligations — Records of Processing Activities (RoPA), data minimisation, consent management, data subject rights processes.

**A.5.35 — Independent review of information security**: Obtain independent assurance at defined intervals — internal audit (third-line assurance), external penetration testing, external ISMS review.

**A.5.36 — Compliance with policies, rules and standards for information security**: Monitor and verify that staff are following security policies — through access reviews, phishing simulations, configuration compliance scanning, and internal audit.

**A.5.37 — Documented operating procedures**: Document key IT operational processes — change management, backup and recovery, access management, incident response, patch management. These procedures must be accessible to the staff who need them and kept current.

---

## Common Audit Findings in Category 5

The most frequently found nonconformities in Annex A Category 5:

| Control | Most common finding |
|---|---|
| A.5.1 | Topic-specific policies missing or not reviewed within defined interval |
| A.5.9 | Asset register incomplete or outdated; assets without named owners |
| A.5.12 | Classification scheme defined but not applied in practice |
| A.5.18 | Access reviews not conducted on schedule; business owners not involved |
| A.5.20 | Supplier contracts without security clauses; DPAs missing |
| A.5.24 | Incident response plan not tested; classification criteria not defined |
| A.5.31 | Legal/regulatory register not maintained or reviewed |
| A.5.37 | Operating procedures not documented or significantly outdated |

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Category 5 controls are heavily tested — particularly A.5.1 (policies), A.5.9 (asset inventory), A.5.12 (classification), A.5.18 (access rights review), and A.5.24–A.5.27 (incident management)
- Auditors must know what evidence demonstrates implementation of each control — not just that the control is "in place"
- New 2022 controls (A.5.7 threat intelligence, A.5.23 cloud services, A.5.30 ICT continuity) are tested specifically in the context of the 2022 revision

**CISM:** Domain 3 covers many Category 5 controls from the programme management perspective

**CRISC:** Supplier security (A.5.19–A.5.22), access control (A.5.15–A.5.18), and incident management (A.5.24–A.5.27) are all relevant to CRISC risk response and monitoring domains

---

## GUARDIAN's Take

Organisational controls are where the ISMS lives or dies. Every technical control in Category 8 depends on Category 5 controls working properly. MFA (A.8.5) is ineffective without a policy requiring it (A.5.1). Vulnerability scanning (A.8.8) is pointless without an asset inventory to know what to scan (A.5.9). Access control (A.8.3) is meaningless without access reviews (A.5.18).

The organisations that have genuine information security — not just certified ISMSs — are the ones where the Category 5 controls are real. Where the classification scheme is actually applied. Where access reviews happen on time and produce real changes. Where suppliers are actually assessed. Where incidents are actually learned from.

Building these organisational controls properly is harder than deploying technical controls, because they require behaviour change, management engagement, and sustained operational discipline rather than a one-time technical deployment.

But they are also more durable. A well-designed organisational control, properly embedded in how the organisation operates, continues to provide security value even when specific technologies change. The access review process that worked for on-premise Active Directory will still work for Azure AD, for the next cloud platform, and for whatever comes after that.

Invest in the organisational controls. They are the foundation everything else rests on.

---
*Module: Module 4 — ISO 27002 Controls | Guardian Curriculum*
