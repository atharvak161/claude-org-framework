---
tags: [guardian, grc, module-3, iso27001, annex-a, controls, organisational, people, physical, technological]
module: 3
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G3-01 — What is ISO 27001", "G3-05 — ISO 27001 Clause 6 — Planning", "G3-11 — Statement of Applicability", "G4-01 — Organisational Controls", "G4-02 — People Controls", "G4-03 — Physical Controls", "G4-04 — Technological Controls"]
---

# G3-10 — Annex A Controls — Complete Reference 2022

> [!abstract] What This Note Covers
> By the end of this note, you will have a complete reference to all 93 ISO 27001:2022 Annex A controls — their structure, what each control does, which controls are new in 2022, and how to think about the Annex A in the context of risk-based control selection, the Statement of Applicability, and audit evidence.

---

## Why This Exists

Annex A is the most referenced part of ISO 27001 — it is the control catalogue against which the SoA is built, the reference set every risk treatment plan is compared to (Clause 6.1.3(c)), and the foundation of most auditor testing during Stage 2. Every GRC professional working with ISO 27001 must know the Annex A: not necessarily every control by heart, but the structure, the categories, the new controls introduced in 2022, and which controls are most commonly assessed in audits and certification examinations.

The 2022 revision made significant changes to Annex A — reducing the control count from 114 (across 14 domains) to 93 (across 4 categories), consolidating overlapping controls, and adding 11 new controls reflecting the modern threat and technology landscape.

---

## The Structure of ISO 27001:2022 Annex A

Annex A:2022 organises controls into **4 categories** by control type:

| Category | Clause | Controls | Count |
|---|---|---|---|
| **Organisational** | 5 | Policies, roles, threat intelligence, classification, supplier security, incident management, business continuity, legal compliance | 37 |
| **People** | 6 | HR security, screening, terms of employment, awareness, training, disciplinary, termination | 8 |
| **Physical** | 7 | Physical perimeters, access control, office security, equipment, environmental, cabling, clear desk | 14 |
| **Technological** | 8 | Identity management, authentication, access control, cryptography, logging, vulnerability management, network security, secure development, cloud | 34 |
| **Total** | | | **93** |

### The Five Control Attributes (New in 2022)

Each Annex A:2022 control has five attributes that help organisations categorise controls and filter the Annex A for their specific context:

| Attribute | Options |
|---|---|
| **Control type** | Preventive / Detective / Corrective |
| **Information security properties** | Confidentiality / Integrity / Availability |
| **Cybersecurity concepts** | Identify / Protect / Detect / Respond / Recover (aligned with NIST CSF) |
| **Operational capabilities** | Governance / Asset management / Information protection / HR security / Physical security / System and network security / Application security / Secure configuration / Identity and access management / Threat and vulnerability management / Continuity / Supplier relationships security / Legal and compliance / Information security event management / Information security assurance |
| **Security domains** | Governance and ecosystem / Protection / Defence / Resilience |

These attributes enable organisations to filter the control set — for example, "show me all detective controls related to cybersecurity detection capability" — and to ensure comprehensive coverage across all security domains.

---

## The 11 New Controls in ISO 27001:2022

These controls did not exist in the 2013 version and represent the most important additions:

| Control | Title | Why it was added |
|---|---|---|
| **A.5.7** | Threat intelligence | Organisations need a formal process for collecting and acting on threat intelligence |
| **A.5.23** | Information security for use of cloud services | Cloud adoption requires explicit cloud-specific security controls |
| **A.5.30** | ICT readiness for business continuity | IT continuity needs specific, dedicated controls beyond generic BCP |
| **A.7.4** | Physical security monitoring | CCTV, access logging, and environmental monitoring need explicit treatment |
| **A.8.9** | Configuration management | Secure configuration baselines must be formally managed |
| **A.8.10** | Information deletion | Secure deletion and data lifecycle management requires explicit controls |
| **A.8.11** | Data masking | Sensitive data masking (de-identification, tokenisation, pseudonymisation) |
| **A.8.12** | Data leakage prevention | DLP tools and processes to prevent unauthorised data exfiltration |
| **A.8.16** | Monitoring activities | Formal monitoring of systems, networks, and user activities |
| **A.8.23** | Web filtering | URL/web content filtering to control web access |
| **A.8.28** | Secure coding | Formal secure development practices and coding standards |

---

## Category 5: Organisational Controls (37 controls)

### A.5.1 — Policies for information security
**What it requires**: An information security policy and topic-specific policies (access control, cryptography, physical security, etc.) must be defined, approved by management, published, communicated, and reviewed at planned intervals.
**Audit evidence**: Policy documents with approval signatures, version history, review records, communication evidence (training records, intranet publication).
**Common failure**: Policy that has not been reviewed in 2+ years; policy communicated once at certification and never since.

### A.5.2 — Information security roles and responsibilities
**What it requires**: All information security responsibilities must be defined and allocated. This covers the CISO, risk owners, asset owners, and all staff with security responsibilities.
**Audit evidence**: Job descriptions, RACI matrices, role profiles, documented assignment of responsibilities.

### A.5.3 — Segregation of duties
**What it requires**: Conflicting duties and areas of responsibility must be separated to reduce opportunities for fraud, error, or unauthorised modification.
**Audit evidence**: Documentation of where SoD is applied; access control configuration preventing individuals from having conflicting access; compensating controls where full SoD is not feasible.

### A.5.4 — Management responsibilities
**What it requires**: Management must require all personnel to apply information security in accordance with the organisation's policies, procedures, and established ISMS.
**Audit evidence**: Evidence that management actively enforces security policies; disciplinary process for policy violations; management behaviour setting example.

### A.5.5 — Contact with authorities
**What it requires**: Appropriate contacts with relevant authorities (law enforcement, ICO, NCSC, FCA) must be maintained. The organisation must know who to contact and how, and must have procedures for notification.
**Audit evidence**: Documented contact list for relevant authorities; incident response plan referencing authority notification; evidence of prior regulatory contact (if applicable).

### A.5.6 — Contact with special interest groups
**What it requires**: Appropriate contacts with special interest groups (security forums, professional associations, ISACs) must be maintained to stay current on security developments.
**Audit evidence**: Membership records; threat intelligence subscriptions; participation evidence.

### A.5.7 — Threat intelligence *(NEW in 2022)*
**What it requires**: Information related to information security threats must be collected and analysed to produce threat intelligence. This intelligence must inform security decisions.
**Audit evidence**: Threat intelligence feed subscriptions; documented analysis outputs; evidence that intelligence informed risk assessment or control decisions.

### A.5.8 — Information security in project management
**What it requires**: Information security must be integrated into project management throughout all project phases. Projects must undergo security risk assessment.
**Audit evidence**: Project methodology documents including security review gates; security risk assessments for recent projects; security sign-off records.

### A.5.9 — Inventory of information and other associated assets
**What it requires**: An inventory of information assets (and associated assets: hardware, software, services) must be developed and maintained. Each asset must have an identified owner.
**Audit evidence**: Asset register/inventory with owners, classification, and location; evidence of regular updates; process for adding new assets.

### A.5.10 — Acceptable use of information and other associated assets
**What it requires**: Rules for acceptable use of information and associated assets must be identified, documented, and implemented.
**Audit evidence**: Acceptable Use Policy; evidence of staff acknowledgement; monitoring for compliance.

### A.5.11 — Return of assets
**What it requires**: Personnel and other interested party users must return all organisational assets upon termination of employment or contract.
**Audit evidence**: Off-boarding checklist including asset return confirmation; records of asset returns; process for tracking unreturned assets.

### A.5.12 — Classification of information
**What it requires**: Information must be classified according to legal requirements, value, criticality, and sensitivity.
**Audit evidence**: Data classification policy; classification scheme (e.g. Public / Internal / Confidential / Restricted); evidence of classification applied to information assets.

### A.5.13 — Labelling of information
**What it requires**: Appropriate procedures for labelling information must be developed and implemented in accordance with the classification scheme.
**Audit evidence**: Labelling standards; sample of labelled documents/data; automated classification/labelling tools.

### A.5.14 — Information transfer
**What it requires**: Information transfer rules, procedures, and controls must be in place for all types of transfer facilities (electronic, physical, verbal).
**Audit evidence**: Data transfer policy; encryption requirements for email/file transfer; DLP controls; records of approved secure transfer channels.

### A.5.15 — Access control
**What it requires**: Rules to control physical and logical access to information and other associated assets must be established and implemented based on business and security requirements.
**Audit evidence**: Access control policy; access provisioning/deprovisioning procedures; access review records; principle of least privilege documentation.

### A.5.16 — Identity management
**What it requires**: The full lifecycle of identities must be managed — creation, maintenance, and removal.
**Audit evidence**: Identity management procedures; user account lifecycle records; evidence of prompt deprovisioning on departure; service account management.

### A.5.17 — Authentication information
**What it requires**: Allocation and management of authentication information (passwords, tokens, keys) must be controlled through a management process.
**Audit evidence**: Password policy; evidence of policy enforcement (password length/complexity requirements in systems); MFA configuration; key management procedures.

### A.5.18 — Access rights
**What it requires**: Access rights to information and other associated assets must be provisioned, reviewed, modified, and removed following the defined access control policy.
**Audit evidence**: Access provisioning records; quarterly/semi-annual access review records; evidence of access removal on role change or departure.

### A.5.19 — Information security in supplier relationships
**What it requires**: Processes and procedures to manage information security risks associated with use of supplier products or services must be defined and implemented.
**Audit evidence**: Supplier security policy; supplier assessment process; evidence of assessments conducted; risk register entries for supplier risks.

### A.5.20 — Addressing information security within supplier agreements
**What it requires**: Information security requirements must be established and agreed with each supplier based on the type of supplier relationship.
**Audit evidence**: Data Processing Agreements; security clauses in supplier contracts; contract review records showing security requirements included.

### A.5.21 — Managing information security in the ICT supply chain
**What it requires**: Processes and procedures must manage information security risks associated with the ICT products and services supply chain.
**Audit evidence**: ICT supplier risk assessments; software bill of materials (SBOM) where applicable; supply chain security requirements in contracts.

### A.5.22 — Monitoring, review and change management of supplier services
**What it requires**: The organisation must regularly monitor, review, and manage changes to supplier information security practices and service delivery.
**Audit evidence**: Annual supplier reassessment records; service review meeting minutes including security discussion; change notification procedures with suppliers.

### A.5.23 — Information security for use of cloud services *(NEW in 2022)*
**What it requires**: Processes for acquisition, use, management, and exit from cloud services must be established in accordance with the organisation's information security requirements.
**Audit evidence**: Cloud security policy; cloud service assessment records; cloud security configuration reviews; data residency and exit documentation.

### A.5.24 — Information security incident management planning and preparation
**What it requires**: Responsibilities and procedures for effective and orderly response to information security incidents must be established.
**Audit evidence**: Incident response plan; incident classification scheme; incident response team roles; evidence of incident response exercises/tests.

### A.5.25 — Assessment and decision on information security events
**What it requires**: Information security events must be assessed and decided whether to classify them as incidents.
**Audit evidence**: Event classification criteria; triage process; evidence of events assessed and decisions documented.

### A.5.26 — Response to information security incidents
**What it requires**: Information security incidents must be responded to in accordance with the documented procedures.
**Audit evidence**: Incident log; incident response records; post-incident review documentation; evidence of containment, eradication, and recovery activities.

### A.5.27 — Learning from information security incidents
**What it requires**: Knowledge gained from analysing and resolving security incidents must be used to reduce the likelihood or impact of future incidents.
**Audit evidence**: Post-incident review records; lessons learned documentation; evidence of controls or processes updated as a result of incident learning.

### A.5.28 — Collection of evidence
**What it requires**: Procedures for the identification, collection, acquisition, and preservation of evidence related to information security events must be established.
**Audit evidence**: Digital forensics procedure; chain of custody process; evidence that forensic tools are available and staff are trained.

### A.5.29 — Information security during disruption
**What it requires**: The organisation must plan how to maintain information security at an appropriate level during disruption.
**Audit evidence**: BCP/DR plan with security-specific components; evidence that security controls are maintained during failover; test records showing security during DR exercises.

### A.5.30 — ICT readiness for business continuity *(NEW in 2022)*
**What it requires**: ICT readiness must be planned, implemented, maintained, and tested based on business continuity objectives and ICT continuity requirements.
**Audit evidence**: ICT continuity plan; RTO/RPO definitions; DR test records; ICT continuity requirements documented.

### A.5.31 — Legal, statutory, regulatory and contractual requirements
**What it requires**: Legal, statutory, regulatory, and contractual requirements relevant to information security must be identified, documented, and kept up to date.
**Audit evidence**: Legal and regulatory register; evidence of regular review; process for tracking regulatory changes.

### A.5.32 — Intellectual property rights
**What it requires**: Procedures to protect intellectual property rights must be implemented.
**Audit evidence**: Software licence management process; IP rights policy; evidence of licence compliance.

### A.5.33 — Protection of records
**What it requires**: Records must be protected from loss, destruction, falsification, unauthorised access, and unauthorised release in accordance with legal, regulatory, contractual, and business requirements.
**Audit evidence**: Records management policy; retention schedule; access controls on records; evidence of secure disposal.

### A.5.34 — Privacy and protection of PII
**What it requires**: Privacy and protection of personally identifiable information must be ensured as required by applicable legislation and regulation.
**Audit evidence**: Privacy policy; GDPR compliance documentation; Records of Processing Activities (RoPA); DPIAs where applicable.

### A.5.35 — Independent review of information security
**What it requires**: The organisation's approach to managing information security and its implementation must be reviewed independently at planned intervals.
**Audit evidence**: Internal audit records; external audit or penetration test records; management review records referencing independent assurance findings.

### A.5.36 — Compliance with policies, rules, and standards for information security
**What it requires**: Compliance with the organisation's information security policy, topic-specific policies, rules, and standards must be regularly reviewed.
**Audit evidence**: Compliance monitoring records; access review evidence; phishing simulation results; configuration compliance scan results.

### A.5.37 — Documented operating procedures
**What it requires**: Operating procedures for information processing facilities must be documented and made available to personnel who need them.
**Audit evidence**: Documented procedures for key IT operations (backup, patching, access management, incident response); evidence of accessibility and currency.

---

## Category 6: People Controls (8 controls)

### A.6.1 — Screening
**What it requires**: Background verification checks on all candidates for employment must be carried out prior to joining and on an ongoing basis where appropriate, in accordance with applicable laws, regulations, and ethics.
**Audit evidence**: HR policy specifying screening requirements; records of checks conducted (reference verification, DBS check, qualification verification); process for higher-risk roles.

### A.6.2 — Terms and conditions of employment
**What it requires**: The employment contractual agreements must state the personnel's and the organisation's responsibilities for information security.
**Audit evidence**: Employment contracts including security obligations clause; NDA/confidentiality agreement records; employee handbook including security responsibilities.

### A.6.3 — Information security awareness, education, and training
**What it requires**: Personnel and relevant interested parties must receive appropriate information security awareness, education, and training, and regular updates relevant to their role.
**Audit evidence**: Training completion records; phishing simulation results; role-specific training evidence (developers: secure coding; finance: fraud awareness); training content currency.

### A.6.4 — Disciplinary process
**What it requires**: A disciplinary process must be formalised and communicated to take action against personnel who have committed an information security policy violation.
**Audit evidence**: Disciplinary policy referencing security violations; evidence that staff are aware of consequences; records of disciplinary actions for security violations (anonymised).

### A.6.5 — Responsibilities after termination or change of employment
**What it requires**: Information security responsibilities and duties that remain valid after termination or change of employment must be defined, enforced, and communicated.
**Audit evidence**: Off-boarding procedure including security components; non-disclosure obligations in termination agreements; records of access removal on departure; exit interview records.

### A.6.6 — Confidentiality or non-disclosure agreements
**What it requires**: Requirements for confidentiality or non-disclosure agreements reflecting the organisation's needs for the protection of information must be identified, documented, regularly reviewed, and signed by personnel and other interested parties.
**Audit evidence**: NDA templates; records of NDAs signed by staff, contractors, and relevant third parties; NDA review process.

### A.6.7 — Remote working
**What it requires**: Security measures must be implemented when personnel are working remotely to protect information accessed, processed, or stored outside the organisation's premises.
**Audit evidence**: Remote working policy; VPN configuration; endpoint security requirements for remote devices; mobile device management (MDM) records.

### A.6.8 — Information security event reporting
**What it requires**: Personnel must be able to report observed or suspected information security events through appropriate channels in a timely manner.
**Audit evidence**: Incident reporting procedure; reporting channels documented and communicated; evidence of reports received; culture of reporting (near-miss reporting rate).

---

## Category 7: Physical Controls (14 controls)

### A.7.1 — Physical security perimeters
**What it requires**: Security perimeters must be defined and used to protect areas that contain information and other associated assets.
**Audit evidence**: Site security assessment; physical perimeter definition; access control systems (doors, barriers, CCTV); visitor log.

### A.7.2 — Physical entry
**What it requires**: Secure areas must be protected by appropriate entry controls to ensure only authorised personnel are allowed access.
**Audit evidence**: Access card/badge system; visitor management records; escorted visitor policy; tailgating prevention measures.

### A.7.3 — Securing offices, rooms, and facilities
**What it requires**: Physical security for offices, rooms, and facilities must be designed and implemented.
**Audit evidence**: Office security assessment; lockable filing cabinets for sensitive materials; server room access controls; evidence of physical security review.

### A.7.4 — Physical security monitoring *(NEW in 2022)*
**What it requires**: Premises must be continuously monitored for unauthorised physical access.
**Audit evidence**: CCTV installation and coverage; access log monitoring process; alarm system records; evidence of monitoring review.

### A.7.5 — Protecting against physical and environmental threats
**What it requires**: Protection against physical and environmental threats such as natural disasters, accidents, and other physical threats must be designed and implemented.
**Audit evidence**: Environmental risk assessment; fire suppression systems; flood protection; UPS/power backup; environmental monitoring (temperature, humidity) for server rooms.

### A.7.6 — Working in secure areas
**What it requires**: Security measures for working in secure areas must be designed and implemented.
**Audit evidence**: Secure area access policy; visitor escort procedures; prohibition on photography or recording in secure areas; clean desk requirements.

### A.7.7 — Clear desk and clear screen
**What it requires**: Clear desk rules for papers and removable storage media and clear screen rules for information processing facilities must be defined and appropriately enforced.
**Audit evidence**: Clear desk policy; evidence of compliance monitoring (spot checks, clean desk audits); screen lock requirements in system configuration.

### A.7.8 — Equipment siting and protection
**What it requires**: Equipment must be sited and protected to reduce risks from environmental threats and hazards, and opportunities for unauthorised access.
**Audit evidence**: Data centre/server room layout; equipment siting documentation; environmental controls.

### A.7.9 — Security of assets off-premises
**What it requires**: Off-site assets must be protected.
**Audit evidence**: Laptop/mobile device policy; encryption requirements for portable devices; tracking/registration of off-premise assets.

### A.7.10 — Storage media
**What it requires**: Storage media must be managed through their lifecycle of acquisition, use, transportation, and disposal/destruction in accordance with the organisation's classification scheme and handling requirements.
**Audit evidence**: Media handling policy; media register; evidence of secure disposal (certificate of destruction, degaussing records).

### A.7.11 — Supporting utilities
**What it requires**: Information processing facilities must be protected from power failures and other disruptions caused by failures in supporting utilities.
**Audit evidence**: UPS systems; generator backup; power failure testing records; utility failure recovery procedures.

### A.7.12 — Cabling security
**What it requires**: Cables carrying power, data, or supporting information services must be protected from interception, interference, or damage.
**Audit evidence**: Cabling standards; cable documentation/mapping; physical protection of cable runs; segregation of power and data cables.

### A.7.13 — Equipment maintenance
**What it requires**: Equipment must be maintained correctly to ensure availability and integrity.
**Audit evidence**: Maintenance schedule; maintenance records; vendor maintenance contracts; evidence of security considerations in maintenance procedures.

### A.7.14 — Secure disposal or re-use of equipment
**What it requires**: Items of equipment containing storage media must be verified to ensure that any sensitive data and licensed software have been removed or securely overwritten prior to disposal or re-use.
**Audit evidence**: Equipment disposal procedure; data wiping evidence (tool outputs); certificates of destruction for high-sensitivity equipment.

---

## Category 8: Technological Controls (34 controls)

### A.8.1 — User endpoint devices
**What it requires**: Information stored on, processed by, or accessible via user endpoint devices must be protected.
**Audit evidence**: Endpoint security policy; MDM/endpoint management evidence; AV/EDR deployment records; device encryption status.

### A.8.2 — Privileged access rights
**What it requires**: The allocation and use of privileged access rights must be restricted and managed.
**Audit evidence**: Privileged access management procedure; list of privileged accounts (minimised); evidence of privileged access reviews; PAM tool configuration.

### A.8.3 — Information access restriction
**What it requires**: Access to information and application system functions must be restricted in accordance with the access control policy.
**Audit evidence**: Role-based access control implementation; access review records; least privilege evidence; segregation of duties in system access.

### A.8.4 — Access to source code
**What it requires**: Read and write access to source code, development tools, and software libraries must be appropriately managed.
**Audit evidence**: Source code repository access controls; developer access reviews; evidence of separation between development and production environments.

### A.8.5 — Secure authentication
**What it requires**: Secure authentication technologies and procedures must be implemented based on information access restrictions.
**Audit evidence**: MFA implementation records; password policy enforcement; authentication logs; MFA coverage rate (% users enrolled).

### A.8.6 — Capacity management
**What it requires**: The use of resources must be monitored and adjusted, and projections of future capacity requirements must be made.
**Audit evidence**: Capacity monitoring dashboards; resource utilisation reports; capacity planning documentation; alerting for capacity thresholds.

### A.8.7 — Protection against malware
**What it requires**: Protection against malware must be implemented and supported by appropriate user awareness.
**Audit evidence**: AV/EDR deployment records; malware scan results; update/signature frequency; user awareness on malware.

### A.8.8 — Management of technical vulnerabilities
**What it requires**: Information about technical vulnerabilities of information systems in use must be obtained in a timely fashion, the organisation's exposure to such vulnerabilities evaluated, and appropriate measures taken.
**Audit evidence**: Vulnerability scanning reports; CVE tracking process; patch management records; penetration test reports; vulnerability register.

### A.8.9 — Configuration management *(NEW in 2022)*
**What it requires**: Configurations, including security configurations, of hardware, software, services, and networks must be established, documented, implemented, monitored, and reviewed.
**Audit evidence**: Security baseline configurations; CIS Benchmark or equivalent; configuration compliance scan results; change management records for configuration changes.

### A.8.10 — Information deletion *(NEW in 2022)*
**What it requires**: Information stored in information systems, devices, or any other storage media must be deleted when no longer required.
**Audit evidence**: Data retention and deletion policy; retention schedule; evidence of deletion processes (automated deletion, manual review); deletion logs.

### A.8.11 — Data masking *(NEW in 2022)*
**What it requires**: Data masking must be used in accordance with the organisation's topic-specific policy on access control and other related policies, and business requirements, taking applicable legislation into consideration.
**Audit evidence**: Data masking policy; evidence of masking applied to sensitive data in non-production environments; tokenisation/pseudonymisation implementations.

### A.8.12 — Data leakage prevention *(NEW in 2022)*
**What it requires**: Data leakage prevention measures must be applied to systems, networks, and any other devices that process, store, or transmit sensitive information.
**Audit evidence**: DLP tool deployment; DLP policy configuration; DLP alert and incident records; evidence of email and endpoint DLP controls.

### A.8.13 — Information backup
**What it requires**: Backup copies of information, software, and systems must be maintained and regularly tested in accordance with the agreed topic-specific policy on backup.
**Audit evidence**: Backup policy; backup schedule and retention periods; backup completion logs; restoration test records (frequency and results).

### A.8.14 — Redundancy of information processing facilities
**What it requires**: Information processing facilities must be implemented with sufficient redundancy to meet availability requirements.
**Audit evidence**: Architecture documentation showing redundancy; failover configuration; HA testing records; RTO/RPO definitions and evidence of testing.

### A.8.15 — Logging
**What it requires**: Logs that record activities, exceptions, faults, and other relevant events must be produced, stored, protected, and analysed.
**Audit evidence**: Logging policy; SIEM configuration; log retention period; evidence of log review; log integrity protection.

### A.8.16 — Monitoring activities *(NEW in 2022)*
**What it requires**: Networks, systems, and applications must be monitored for anomalous behaviour and appropriate actions taken to evaluate potential information security incidents.
**Audit evidence**: Monitoring tool configuration; SIEM use cases/alert rules; monitoring review records; evidence of anomalies investigated.

### A.8.17 — Clock synchronisation
**What it requires**: The clocks of information processing systems used by the organisation must be synchronised to approved time sources.
**Audit evidence**: NTP configuration; evidence of clock synchronisation across systems; log correlation accuracy.

### A.8.18 — Use of privileged utility programs
**What it requires**: The use of utility programs that might be capable of overriding system and application controls must be restricted and tightly controlled.
**Audit evidence**: Approved privileged tool list; controls on installation of unapproved utilities; monitoring of privileged tool usage.

### A.8.19 — Installation of software on operational systems
**What it requires**: Procedures and measures must be implemented to securely manage software installation on operational systems.
**Audit evidence**: Software installation policy; approved software list; whitelisting or application control configuration; evidence of unauthorised software detected and removed.

### A.8.20 — Networks security
**What it requires**: Networks and network devices must be secured, managed, and controlled to protect information in systems and applications.
**Audit evidence**: Network architecture documentation; firewall rule sets; network segmentation evidence; network monitoring records.

### A.8.21 — Security of network services
**What it requires**: Security mechanisms, service levels, and service requirements of all network services must be identified, implemented, and monitored.
**Audit evidence**: Network service inventory; security requirements for each service; SLA monitoring; network service provider security assessments.

### A.8.22 — Segregation of networks
**What it requires**: Groups of information services, users, and information systems must be segregated in the organisation's networks.
**Audit evidence**: Network segmentation architecture; VLAN configuration; firewall rules between segments; evidence that sensitive systems are isolated.

### A.8.23 — Web filtering *(NEW in 2022)*
**What it requires**: Access to external websites must be managed to reduce exposure to malicious content.
**Audit evidence**: Web filtering tool deployment; category filtering configuration; URL allow/block lists; web filtering logs.

### A.8.24 — Use of cryptography
**What it requires**: Rules for the effective use of cryptography, including cryptographic key management, must be defined and implemented.
**Audit evidence**: Cryptography policy; encryption standards (algorithm, key length); encryption implementation evidence (TLS configuration, disk encryption); key management procedures.

### A.8.25 — Secure development life cycle
**What it requires**: Rules for the secure development of software and systems must be established and applied.
**Audit evidence**: Secure SDLC policy; security requirements in development process; evidence of security reviews at development milestones; developer security training.

### A.8.26 — Application security requirements
**What it requires**: Information security requirements must be identified, specified, and approved when developing or acquiring applications.
**Audit evidence**: Security requirements in application development specifications; security acceptance criteria; threat modelling records; security testing before deployment.

### A.8.27 — Secure system architecture and engineering principles
**What it requires**: Principles for engineering secure systems must be established, documented, maintained, and applied to any information system implementation efforts.
**Audit evidence**: Security architecture principles (defence in depth, least privilege, fail-safe defaults); evidence applied in system designs; architecture review records.

### A.8.28 — Secure coding *(NEW in 2022)*
**What it requires**: Secure coding principles must be applied to software development.
**Audit evidence**: Secure coding standards (OWASP, language-specific); SAST tool deployment; code review records; evidence of secure coding training for developers.

### A.8.29 — Security testing in development and acceptance
**What it requires**: Security testing processes must be defined and implemented in the development life cycle.
**Audit evidence**: Security testing policy; SAST/DAST scan records; penetration test records for new applications; security acceptance criteria.

### A.8.30 — Outsourced development
**What it requires**: The organisation must direct, monitor, and review the activities related to outsourced system development.
**Audit evidence**: Outsourced development security requirements in contracts; security review of outsourced code; supplier code review or audit records.

### A.8.31 — Separation of development, test, and production environments
**What it requires**: Development, testing, and production environments must be separated and secured.
**Audit evidence**: Environment separation architecture; access control differentiation between environments; data masking for production data used in test; evidence that production credentials are not used in development.

### A.8.32 — Change management
**What it requires**: Changes to information processing facilities and information systems must be subject to change management procedures.
**Audit evidence**: Change management policy and procedure; change request records; change approval evidence; rollback procedures; post-change security review.

### A.8.33 — Test information
**What it requires**: Test information must be appropriately selected, protected, and managed.
**Audit evidence**: Test data policy; evidence that production PII is not used in testing without masking; test data lifecycle management.

### A.8.34 — Protection of information systems during audit testing
**What it requires**: Audit tests and other assurance activities involving assessment of operational systems must be planned and agreed between the tester and appropriate management to minimise disruptions to business processes.
**Audit evidence**: Penetration testing authorisation process; scope agreement records; rules of engagement documentation; evidence of coordination with IT operations.

---

## How Annex A Controls Are Used in Practice

### The SoA Construction Process

When building the SoA, the organisation works through all 93 controls systematically:

1. **Read each control**: Understand what it requires
2. **Assess applicability**: Does any identified risk require this control? Does any regulatory or contractual obligation require it?
3. **Document the decision**: If applicable — justification and implementation status. If not applicable — justification for exclusion.
4. **Trace to risk register**: Every applicable control should link to at least one risk register entry.
5. **Plan implementation**: For controls not yet implemented, record the planned implementation date.

### Controls Audit Focus

Auditors do not test all 93 controls in equal depth. They prioritise based on:
- **Risk register linkage**: Controls protecting against Critical/High risks receive deepest scrutiny
- **Organisational context**: A software company will be tested harder on A.8.25–A.8.28 (secure development) than a manufacturing company
- **Previous findings**: Controls where nonconformities were previously found are re-tested
- **Commonly failed controls**: A.5.1 (policies — review evidence), A.5.9 (asset inventory — completeness), A.6.3 (awareness — effectiveness), A.8.8 (vulnerability management — patch compliance), A.8.13 (backup — restoration test), A.5.20 (supplier agreements — security clauses)

---

## Common Mistakes and Failures

**1. Including all 93 controls as "applicable" without genuine assessment.**
A common shortcut: mark everything as applicable to avoid the work of justifying exclusions. The SoA then does not reflect a genuine risk-based assessment.

**2. Controls marked "implemented" with no evidence.**
The SoA says A.8.5 (Secure authentication) is implemented. Auditors request evidence — MFA enrolment records, authentication configuration — and cannot be provided. "Implemented" must mean verifiable.

**3. Annex A used as a checklist rather than as a reference.**
Controls selected by working through the Annex A list rather than by identifying risks and then comparing to Annex A. The risk-based approach is reversed, and controls end up being implemented without a clear risk justification.

**4. New 2022 controls ignored in transition.**
Organisations that transitioned from ISO 27001:2013 updated their SoA to align with the 2022 control structure but did not genuinely implement the 11 new controls. A.5.7 (threat intelligence), A.8.9 (configuration management), and A.8.12 (DLP) are particularly commonly missing in substance.

**5. Exclusion justifications that are not credible.**
A.5.7 (Threat intelligence) excluded with justification "we don't have sophisticated threats" — not credible for any externally facing organisation. Auditors probe exclusions aggressively when they appear to be convenient rather than genuine.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Know the 4 categories and which types of control fall in each
- Know all 11 new controls introduced in 2022 — these are frequently tested
- Understand the control attributes framework and how it enables filtering
- Be able to trace a control to a risk (the SoA traceability requirement)
- Know the most commonly audited controls and what evidence is required for each

**CISM:** Domain 3 (Security Programme) requires knowledge of control frameworks; Annex A is the primary ISO 27001 control reference

**CISSP:** Domain 3 (Security Architecture) and Domain 7 (Security Operations) cover many of the technological controls in Category 8; Domain 1 covers organisational and governance controls

---

## GUARDIAN's Take

Annex A is a checklist that must never be treated as a checklist. That sounds contradictory, but it captures the central tension of ISO 27001 control selection.

The Annex A is a comprehensive reference set — the collective wisdom of the international information security community about what controls effective ISMSs implement. It is extraordinarily useful as a reference: when you have completed your risk assessment and identified your treatment options, comparing your selected controls against Annex A is a safety net that catches gaps your risk assessment may have missed.

But using Annex A as a starting point — "what controls does ISO 27001 require?" — inverts the process. The standard requires risk-based control selection, not Annex A compliance. A small cloud-native startup with no physical premises should not implement A.7.2 (Physical entry controls) — that would be absurd. But if they process payment card data, A.8.12 (Data leakage prevention) is almost certainly applicable regardless of whether any specific risk assessment entry explicitly identified it.

The professional approach: start with the risk assessment, select controls that address identified risks, then compare against Annex A as a completeness check, justify exclusions where they are genuinely not applicable, and document everything with sufficient clarity that an auditor can trace every control to a risk and every exclusion to a credible justification.

That is the Annex A working as designed. Not as a checkbox list, not as a compliance mandate, but as an expert reference that supports and validates a genuine risk-based programme.

---
*Module: Module 3 — ISO 27001 | Guardian Curriculum*
