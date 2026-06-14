---
tags: [guardian, grc, module-6, pci-dss, cde, scope, cardholder-data-environment, network-segmentation]
module: 6
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G6-01 — What is PCI DSS and Who Must Comply", "G6-02 — The 12 PCI DSS Requirements", "G6-03 — Merchant Levels and SAQ Types", "G6-05 — Network Segmentation and Scope Reduction"]
---

# G6-04 — Cardholder Data Environment — CDE Scoping

> [!abstract] What This Note Covers
> By the end of this note, you will understand what the Cardholder Data Environment is, how PCI DSS scope is determined, what makes systems in-scope versus out-of-scope, and why scope management is the most strategically important activity in a PCI DSS compliance programme.

---

## Why This Exists

In 2013, Target Corporation suffered one of the most damaging payment card breaches in US retail history. Attackers gained initial access through a compromised HVAC vendor — a refrigeration contractor with remote access to Target's network for billing and project management purposes. From that entry point, attackers moved laterally through Target's network until they reached the point-of-sale systems, where they deployed RAM-scraping malware that captured card data from 40 million payment cards during the 2013 holiday shopping season.

The HVAC contractor was not directly connected to Target's payment systems. But because Target's network was insufficiently segmented, systems connected to the HVAC vendor's remote access could communicate with the payment environment. The contractor's systems were therefore in scope for PCI DSS — but nobody had recognised this. The compliance programme did not adequately map the scope. The HVAC vendor's access was a scope gap. And that gap was the entry point for one of the most consequential breaches in retail history.

CDE scoping is not an administrative activity. It is the foundation of the entire PCI DSS compliance programme. Get it wrong, and your compliance programme has holes you don't know about. Get it right, and you create a defensible, manageable, continuously improvable compliance environment.

---

## What the Cardholder Data Environment Is

The **Cardholder Data Environment (CDE)** is the people, processes, and technology that store, process, or transmit cardholder data (CHD) or sensitive authentication data (SAD) — AND any system components that are connected to or could impact the security of those systems.

This is a broader definition than many organisations initially assume. The CDE is not just the payment terminals and the payment database. It is everything that touches cardholder data AND everything connected to those systems.

### The Three Categories of In-Scope Systems

PCI DSS v4.0 organises in-scope systems into three categories:

**Category 1: Systems that store, process, or transmit CHD/SAD**
The direct CDE systems — the payment terminals, the payment processing servers, the databases storing PAN, the systems transmitting card data to processors.

Examples:
- Point-of-sale terminals
- Payment gateways
- Databases containing PANs
- E-commerce payment pages
- Servers running payment applications
- Backup systems containing encrypted card data
- Log systems capturing payment-related events

**Category 2: Systems that do not store, process, or transmit CHD/SAD but could impact the security of the CDE**
Systems that, if compromised, could allow an attacker to access or affect Category 1 systems.

Examples:
- Authentication systems (Active Directory, LDAP) used to authenticate access to CDE systems
- Management servers (SCCM, Puppet, Ansible) that push configuration to CDE systems
- Log management systems (SIEM) that aggregate CDE logs
- Monitoring systems (Nagios, Zabbix) with agents on CDE systems
- Backup systems that back up CDE systems
- Network devices (firewalls, routers, switches) that control or route traffic to/from CDE
- Jump servers used to administer CDE systems
- Vulnerability scanners that scan CDE systems
- Security appliances (IDS, WAF) protecting CDE systems

**Category 3: Systems on a segmented network with no connectivity to the CDE**
Systems that are completely isolated from the CDE — neither directly handling card data nor connected in any way to systems that do. These systems are **out of scope** for PCI DSS.

The key question for every system in the organisation: is it in Category 1, 2, or 3?

---

## The Scoping Process: How to Determine CDE Scope

### Step 1: Identify and Document All Cardholder Data Flows

The starting point is always the data — where does cardholder data flow through the organisation?

Map every point where cardholder data:
- Enters the organisation (customer payment at a terminal, online checkout, telephone order)
- Flows through internal systems (from terminal to payment application, from application to processor)
- Is stored (databases, logs, backups, paper records)
- Leaves the organisation (to payment processor, acquirer, card brand)

**Data flow mapping tools**: Process flow diagrams, network diagrams annotated with data flows, data dictionaries identifying which systems hold which data. The PCI SSC's scoping guidance recommends using data flow diagrams that show all CHD flows, the systems involved, and the interfaces between them.

**Common places cardholder data hides that organisations miss:**
- Error logs and debugging logs (applications that log card data for troubleshooting)
- Email systems (staff who email card details to colleagues or processors)
- Spreadsheets and flat files (impromptu storage of card data outside approved systems)
- Development and test environments (test data copied from production)
- Backup systems (backups of production systems containing unmasked PANs)
- Analytical and reporting systems (business intelligence platforms fed from payment databases)

### Step 2: Identify All Systems in the CDE (Category 1)

From the data flow map, identify every system that stores, processes, or transmits CHD or SAD. These are definitively in scope — there is no argument or judgment to be made about whether they are in scope. If a system touches card data, it is in scope.

### Step 3: Identify Connected Systems (Category 2)

For every Category 1 system, identify all systems that connect to it. The connection can be in either direction — does System X communicate with any CDE system? Does any CDE system communicate with System X?

**Types of connections that create Category 2 scope:**
- Network connectivity (systems on the same network segment, systems with firewall rules permitting communication with CDE systems)
- Administrative access (jump servers, management platforms with agents on CDE systems)
- Authentication integration (identity providers, directory services used by CDE systems)
- Data feeds (ETL processes pulling from or pushing to CDE systems)
- Monitoring (agents installed on CDE systems that report to central monitoring)
- Backup (backup agents on CDE systems, backup media that connects to CDE systems)

The challenge: identifying all connections requires an accurate, current network diagram and an understanding of all administrative and data flows. Many organisations discover mid-assessment that systems they assumed were out of scope actually have connections to CDE systems.

### Step 4: Assess Segmentation

**Network segmentation** is the primary mechanism for reducing scope — physically or logically isolating CDE systems from non-CDE systems to ensure that non-CDE systems cannot communicate with CDE systems. Properly segmented systems that have no connectivity to the CDE are out of scope (Category 3).

If there is adequate segmentation:
- Non-CDE systems cannot communicate with CDE systems
- Systems on non-CDE networks are out of scope (Category 3)
- The CDE scope is limited to the segmented CDE zone and its direct connections

If there is insufficient segmentation (flat network):
- All systems on the same network as CDE systems are potentially in scope
- Category 2 scope expands dramatically
- The compliance programme covers the entire network

The strategic implication: network segmentation is the single most effective scope reduction strategy. The investment in segmentation is repaid many times over in reduced compliance burden, reduced risk surface, and more manageable scope.

### Step 5: Document and Validate the Scope

The scope must be documented — in a scope statement, a network diagram, and supporting data flow diagrams. The scope documentation must:
- Identify all in-scope systems by category (1, 2, or 3 where applicable)
- Show all data flows involving CHD
- Show the network segmentation that isolates the CDE
- Be validated at least annually (PCI DSS v4.0 Requirement 12.5)

**PAN discovery scans**: Requirement 12.5.2 (v4.0) requires targeted PAN discovery scans to be performed at least quarterly to confirm that PAN is not stored outside the CDE and is not transmitted in clear text. PAN discovery tools scan file systems, databases, and network traffic to identify unexpected locations where card data may be present.

---

## What Makes a System Out of Scope

For a system to be out of scope for PCI DSS, it must meet all of the following conditions:

1. **It does not store, process, or transmit CHD or SAD** — not directly, not in backups, not in logs
2. **It is not connected to any CDE system** — no network path, no administrative access, no data feed, no authentication integration
3. **It cannot impact the security of the CDE** — a compromise of this system would not enable access to the CDE or compromise the security of CDE systems

If any of these three conditions is not fully met, the system has at least some in-scope components and must be assessed accordingly.

### The "Could Impact Security" Catch

The phrase "could impact the security of the CDE" is intentionally broad. It captures any system that, if compromised, would give an attacker a path to the CDE. This includes:

- A management workstation used to administer a CDE firewall — it could impact firewall configuration, so it is in scope
- An Active Directory server that authenticates CDE access — a compromise enables impersonating CDE users, so it is in scope
- A vulnerability scanner that scans CDE systems — it has network-level access to CDE systems, so it is in scope
- A SIEM that collects CDE logs — logs may contain CHD; it has agent access to CDE systems, so it is in scope

This broad "could impact security" scope means that many more systems are in scope than organisations initially expect — and is one of the primary motivations for investing in network segmentation to limit which systems have connectivity to the CDE.

---

## Connected Versus Non-Connected: The Network Diagram

The network diagram is the cornerstone of CDE scoping. It must show:
- All network segments
- The segmentation controls (firewalls, VLANs, network isolation)
- Which segments contain CDE systems
- All connections between CDE segments and non-CDE segments (including what protocols and ports are permitted)
- All external connections (internet, payment processor links, vendor remote access)

The network diagram is reviewed by QSAs and ASVs as primary scope evidence. An inaccurate or outdated network diagram creates scope gaps — and is a frequent finding in PCI DSS assessments.

**Keeping the diagram current**: Network changes that affect scope (new systems added to CDE segments, new connections between segments, new external access points) must be reflected in the diagram promptly. A change management process that includes network diagram updates is a compliance requirement.

---

## Scope Reduction Strategies

The primary strategic objective of CDE scoping is to **minimise the scope** — reducing the number of systems, networks, and people in scope to make compliance more manageable and the attack surface smaller.

### Strategy 1: Network Segmentation

The most impactful strategy. By physically or logically isolating CDE systems in a dedicated network segment (DMZ, VLAN, or physical network separation), non-CDE systems on other segments become out of scope.

**Before segmentation**: All systems on the corporate network are in scope because they share network access with payment systems.

**After segmentation**: Only systems in the CDE segment and those with controlled connections to it are in scope. Corporate workstations, email servers, HR systems — all out of scope.

The firewall between the CDE segment and the rest of the network is itself in scope (it controls CDE access), but the systems behind it on non-CDE segments are not.

### Strategy 2: Tokenisation

**Tokenisation** replaces the PAN with a non-sensitive substitute token. The token has no mathematical relationship to the PAN and cannot be reverse-engineered. The actual PAN is stored only in a secure tokenisation vault (operated by a PCI-compliant tokenisation service provider).

With tokenisation:
- Merchant systems store tokens, not PANs
- Only the tokenisation vault stores the actual PANs
- If the merchant's systems are breached, only tokens are exposed — worthless to attackers
- The merchant's scope is dramatically reduced because most systems only see tokens, not CHD

The tokenisation service provider's systems are in scope (they store PANs). The merchant's systems that only handle tokens are out of scope for the PAN storage requirement.

### Strategy 3: Point-to-Point Encryption (P2PE)

**P2PE** encrypts cardholder data at the point of capture (the card terminal) and keeps it encrypted until it reaches the processor's decryption environment. Within the merchant's environment, the card data is always encrypted with a key the merchant does not hold.

With a validated P2PE solution:
- The merchant cannot decrypt cardholder data
- The scope of merchant systems is dramatically reduced
- Merchant qualifies for SAQ P2PE with its minimal requirements

### Strategy 4: Outsourcing Cardholder Data Handling

Redirect all payment processing to a PCI-compliant third party. The merchant's website sends customers to the third party's payment page; the merchant never receives or processes CHD.

With fully outsourced payment processing:
- Merchant qualifies for SAQ A
- Merchant's systems are largely out of scope (only applicable Requirement 12 provisions apply)
- The compliance burden shifts primarily to the payment service provider

### Strategy 5: Reducing Stored Data

The minimum data that must be stored post-authorisation:
- PAN (may be needed for refunds, chargebacks — but consider truncation or tokenisation)
- Cardholder name (may be needed for receipts)
- Expiration date (may be needed for transactions)
- Service code (rarely stored)

Reducing stored data reduces scope. A merchant who stores full PANs has a more complex scope (and higher risk) than one who stores only the last 4 digits of the PAN.

---

## Scope Validation: PCI DSS v4.0 Requirements

PCI DSS v4.0 has introduced explicit requirements for scope validation:

**Requirement 12.5.1**: Scope of the CDE must be documented and confirmed at least annually and upon significant changes to the environment.

**Requirement 12.5.2**: All applicable PCI DSS requirements are confirmed to be in place within the defined scope at least annually.

**Requirement 12.5.2.1** (for service providers only): PCI DSS scope is documented and confirmed at least every 6 months.

These requirements formalise the scope validation that good practice already demanded — organisations must now document and annually reconfirm that their scope definition is accurate and complete.

---

## Common Scoping Mistakes and Failures

**1. Assuming payment terminals are the only in-scope systems.**
Payment terminals are Category 1. But the network they connect to, the server they report to, the management platform that updates their firmware, the SIEM that collects their logs — all Category 2 and in scope.

**2. Not discovering hidden cardholder data.**
Card data that was stored in error — in log files, in development environments, in email archives, in reporting databases — that nobody knew was there. Quarterly PAN discovery scans (v4.0 Requirement 12.5.2) are intended to catch this.

**3. Inadequate segmentation claims.**
"We have a VLAN for payment systems." A VLAN alone may not constitute adequate segmentation if the inter-VLAN firewall rules permit broad access between the payment VLAN and other VLANs. Segmentation must be tested (penetration test) to confirm it is effective, not just assumed.

**4. Scope not updated after changes.**
A new system is connected to the CDE without updating the scope documentation. A new remote access connection is created for a vendor without adding it to the scope. The next annual assessment finds scope is broader than documented — a finding that suggests controls may not have been applied to all in-scope systems.

**5. Third-party scope not managed.**
Vendors, managed service providers, and outsourced IT functions with access to CDE systems must be managed as in-scope third parties. The Target breach stemmed from inadequate management of a third party's scope — the vendor had access but no security requirements commensurate with that access.

**6. Development and test environments overlooked.**
Test environments that use production card data are in scope. Development environments that connect to production CDE systems are in scope. These are frequently overlooked because they are managed by development teams who don't think of themselves as being in the compliance programme.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- CDE scoping has direct parallels to ISMS scope definition (Clause 4.3) and the identification of interfaces with out-of-scope functions. The same principles — clearly define what is in scope, document what connects to in-scope systems, manage the boundaries — apply to both frameworks.

**CISM:**
- Domain 3 (Security Programme) — scope management is a programme governance activity. CISOs at merchant organisations must ensure that the CDE scope is accurately defined, annually validated, and reflected in the security programme.

**CRISC:**
- Scope management failures create compliance and security risks. CRISC candidates must understand that an inaccurate or incomplete CDE scope means the compliance programme has unaddressed gaps — uncontrolled risk to the CDE from systems that should be in scope but are not managed as such.

---

## GUARDIAN's Take

CDE scoping is the most consequential activity in the entire PCI DSS programme — and the one most frequently done poorly.

The organisations that do it well treat scope as a security decision, not a compliance decision. They ask: "What do we actually need to protect? How do we reduce the attack surface while maintaining business functionality?" They invest in segmentation, tokenisation, and P2PE not because they reduce the compliance burden (though they do) but because they reduce the risk.

The organisations that do it poorly treat scope as a minimisation exercise. They look for ways to exclude systems from scope to reduce the compliance effort. They draw tight scope boundaries around what they are already doing well and hope nobody looks too closely at the edges. They don't do PAN discovery scans because they don't want to find card data where it shouldn't be.

The Target breach is the most vivid demonstration of what scope management failure looks like in practice. The HVAC vendor's access to Target's network was a scope connection that was never recognised, never assessed, never controlled. An attacker found the gap before the compliance programme did.

Know your scope. Map every data flow. Map every connection. Validate it annually. And when you find that your scope is larger than you thought — because you have, for instance, discovered that card data has been inadvertently logged in your application logs — don't minimise the finding. Address it. That discovery, and the remediation that follows, is the value of rigorous scoping.

---
*Module: Module 6 — PCI DSS | Guardian Curriculum*
