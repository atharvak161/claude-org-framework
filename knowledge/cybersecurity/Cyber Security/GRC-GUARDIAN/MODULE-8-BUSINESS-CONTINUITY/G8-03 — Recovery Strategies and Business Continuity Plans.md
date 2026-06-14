---
tags: [guardian, grc, module-8, recovery-strategies, bcp, business-continuity-plan, crisis-management, dr]
module: 8
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-19
guardian-refs: ["G8-01 — What is Business Continuity Management", "G8-02 — Business Impact Analysis", "G8-04 — ISO 22301", "G8-05 — Exercising and Testing BCM"]
---

# G8-03 — Recovery Strategies and Business Continuity Plans

> [!abstract] What This Note Covers
> By the end of this note, you will understand how to select recovery strategies based on BIA outputs, what the key recovery strategy options are for each resource type, and how to write effective Business Continuity Plans — including what they must contain and how to structure them for operational use.

---

## Why This Exists

The BIA tells you what must be recovered and how quickly. The recovery strategy tells you how. The Business Continuity Plan tells you exactly what to do when a disruption occurs.

These three elements — analysis, strategy, plan — are the operational core of BCM. Many organisations stop at analysis, or select strategies without documenting them in actionable plans, or produce plans that are so generic they provide no guidance during an actual disruption. This note provides the framework for moving from BIA outputs to working plans.

---

## Recovery Strategy Selection

Recovery strategies define how the organisation will maintain or restore critical business functions following a disruption. Strategies must be:

**Aligned to RTO/RPO**: A strategy that delivers recovery in 12 hours does not satisfy a 4-hour RTO. The strategy must be capable of achieving the recovery objectives defined in the BIA.

**Proportionate to criticality**: High-criticality functions with short RTOs require more investment in recovery infrastructure. Low-criticality functions with long RTOs may be adequately served by basic backup-and-restore.

**Tested and validated**: A strategy is only credible if it has been tested and confirmed to achieve the stated RTO/RPO. Untested strategies provide false assurance.

**Cost-justified**: The cost of the recovery strategy must be justified against the cost of disruption. A £500K annual investment in hot standby infrastructure may be justified for a process with a £2M/day disruption cost; it may not be justified for a process with a £5K/day disruption cost.

---

## Recovery Strategies by Resource Type

### People Strategies

**The problem**: Critical processes require people with specific skills. Those people may be unavailable due to illness, location unavailability, transport disruption, or pandemic-scale absence.

**Strategy options:**

**Cross-training**: Multiple employees trained to perform each critical role. No single person holds unique critical knowledge. Cost: training time and ongoing practice. Benefit: resilience to individual absence.

**Documented procedures**: Detailed step-by-step procedures that allow competent but untrained staff to perform critical activities. Reduces reliance on institutional knowledge held by individuals.

**Split team working**: Critical team members distributed across locations, ensuring that a single-site incident (fire, flood, local transport disruption) cannot incapacitate the entire team.

**Succession planning**: Defined succession hierarchy for key management roles — who makes decisions when the primary decision-maker is unavailable.

**Agency/temporary staffing arrangements**: Pre-negotiated contracts with staffing agencies for rapid deployment of temporary staff to support critical functions during sustained disruptions.

**Mutual aid agreements**: Agreements with peer organisations (or within a group) to share staff during disruptions — reciprocal arrangements where Organisation A supports Organisation B during a B-specific incident, and vice versa.

**Remote working capability**: Critical staff can work from home or alternate locations, with the technology and access required to perform their roles remotely. COVID-19 demonstrated both the value and the limitations of this approach at scale.

### Premises Strategies

**The problem**: Primary premises may be unavailable due to fire, flood, denial of access, or structural damage.

**Strategy options:**

**Working from home / distributed working**: Staff work remotely. Depends on technology availability (laptops, VPN, secure remote access) and the nature of the work (can it be done remotely?). The most cost-effective alternate work strategy for knowledge workers.

**Alternate office space (owned)**: A secondary office owned or leased by the organisation. High cost; always available; no dependency on third parties.

**Alternate office space (reciprocal arrangement)**: Agreement with another organisation to use their premises during a disruption. Lower cost; may have limitations on timing and availability.

**Managed recovery workspace**: Third-party recovery workspace providers (Sungard, Regus, etc.) offer contracted recovery workspace — guaranteed availability of equipped workspace within a defined time period, at a contracted cost. The organisation pays a retainer for guaranteed access; the provider maintains the workspace. Most common approach for organisations that cannot justify a dedicated alternate site.

**Hot desk/shared space**: Critical staff use hot desks in other company locations. Requires the parent organisation or group to have excess capacity in other locations.

**Mobile solutions**: Mobile command centres or units for operations that cannot be conducted remotely (field-based operations, specialist equipment).

### Technology and Data Strategies

**The problem**: Critical systems may be unavailable due to hardware failure, cyber incident, software failure, or loss of the primary data centre.

**Strategy options:**

**Hot standby (Active-Active)**: Two fully operational systems running simultaneously. Traffic is load-balanced between them. If one fails, the other continues without interruption. RTO: near-zero. Cost: highest (double the infrastructure). Required for processes where even minutes of unavailability are unacceptable (payment processing, trading systems, critical national infrastructure).

**Warm standby (Active-Passive)**: Primary system running; secondary system kept current (near-real-time replication or frequent synchronisation) but in standby. Failover requires manual or automated switchover. RTO: minutes to hours. Cost: moderate to high. Common for critical business applications.

**Cold standby (Backup-Restore)**: Primary system running; data backed up to a secondary location. Recovery requires restoring backups to a standby or rebuilt system. RTO: hours to days. RPO: determined by backup frequency. Cost: lower. Appropriate for less time-critical systems.

**Cloud-based DR**: Recovery environment hosted in a cloud provider. Cloud infrastructure can be provisioned rapidly on demand. "Pay for what you use" — the DR environment costs little when unused, scales when needed. RTO depends on provisioning time and data transfer time.

**Geographic redundancy**: Primary and DR sites in different geographic locations (different cities, different regions). Protects against regional disasters (flood, storm, power grid failure). Most DR implementations use geographic separation.

**Data replication**: Continuous or near-continuous replication of data from primary to DR systems. Technology options: database replication (Oracle DataGuard, SQL Server Always On), storage replication (SAN replication), application-level replication. RPO is determined by the replication lag.

**Backup and recovery**: Traditional backup approach — full, incremental, or differential backups at defined frequencies, stored at a secondary location. The 3-2-1 rule: 3 copies, 2 different media types, 1 offsite. Restoration time (RTO) depends on backup size, restoration process, and available bandwidth.

**Cloud native resilience**: For cloud-based systems, cloud-native resilience features: multi-AZ deployment (across multiple availability zones), multi-region deployment, auto-scaling groups, managed database services with automated failover. These features can achieve very low RTOs with appropriate configuration and cost.

### Supplier and Third-Party Strategies

**The problem**: Critical suppliers may be unavailable due to their own business disruption.

**Strategy options:**

**Multiple suppliers**: Using two or more suppliers for critical goods or services, so that a single supplier failure does not cause complete disruption. Requires careful contract management to ensure both suppliers remain viable.

**Pre-qualified alternate suppliers**: Maintaining a list of pre-qualified backup suppliers who can be activated rapidly in the event of primary supplier failure. Requires periodic qualification of alternates to ensure they remain viable.

**Strategic stock**: Maintaining a buffer of critical supplies to provide time to activate alternate supplier arrangements.

**Supplier BCM assessment**: Assessing critical suppliers' own BCM capabilities — what is their RTO? Do they have alternate production facilities? Have they tested their own BCPs? A supplier with inadequate BCM creates supply chain risk.

**Contractual BCM requirements**: Including BCM requirements in supplier contracts — requiring suppliers to maintain BCPs, conduct regular exercises, and provide notification of disruptions.

---

## The Business Continuity Plan: What It Must Contain

A Business Continuity Plan (BCP) is a documented set of procedures and information that enables an organisation to respond to and recover from a disruptive event affecting a specific business function.

### BCP Structure

A well-structured BCP contains the following sections:

**1. Purpose and Scope**
- What function/process does this plan cover?
- What types of disruption does this plan address?
- Who is responsible for activating and executing this plan?

**2. Plan Activation Criteria**
- What conditions trigger BCP activation?
- Who has authority to declare a continuity event?
- How are staff notified that the BCP has been activated?

**The activation criteria must be specific**: Not "if a disruption occurs" but "if the primary system is unavailable for more than [RTO trigger threshold]" or "if the primary office is inaccessible and expected to remain inaccessible for more than [threshold]."

**3. Key Contacts and Escalation**
Named individuals with contact details:
- Business Continuity Manager (overall coordinator)
- Function Lead (responsible for this BCP execution)
- Key staff for this function (named alternates included)
- IT recovery team contact
- Crisis management team contact
- External contacts (suppliers, utilities, regulators if required)

**Critical requirement**: Contact details must be maintained outside the primary IT systems — if IT is unavailable, staff must be able to access contact information. Phone tree; wallet card; home-accessible document.

**4. Immediate Response Actions**
What happens in the first 30 minutes after a disruption is declared?

- Confirm the nature and scope of the disruption
- Notify the Business Continuity Manager / Crisis Management team
- Account for all staff
- Assess whether BCP activation is required
- Notify key stakeholders of the situation (without unnecessary alarm)

**5. Recovery Actions (Detailed Procedures)**
Step-by-step procedures for continuing operations during the disruption:

- What manual workarounds are in place?
- How do staff access the alternate work location?
- How do they access critical data?
- What systems/tools are available in the recovery environment?
- What reduced service level applies (MBCO)?
- What must be deferred or suspended?
- What communications must go to customers/partners?

**The operational detail test**: A member of staff who has never executed this plan before should be able to follow it and successfully continue critical operations. If the plan requires undocumented knowledge, it is incomplete.

**6. Communication Plan**
- Internal communications: How are staff kept informed during the disruption?
- Customer communications: What messages go to customers, and who sends them?
- Regulatory communications: Are regulators required to be notified?
- Media communications: If press enquiries arise, who handles them?
- Pre-approved message templates for common scenarios

**7. IT Recovery Requirements**
Which specific IT systems are required for this function?

- System name, RTO, RPO
- Recovery location (DR site, cloud, alternate office)
- Who requests and confirms IT recovery
- Access credentials/methods for recovery environment

**8. Resource Requirements**
Minimum resources needed to operate at MBCO:

- Personnel: Number of staff, roles, skills
- Premises: Where will operations take place?
- Equipment: Laptops, phones, specialist equipment
- Data: Which datasets are required? How are they accessed?
- External dependencies: Third parties that must be contacted/activated

**9. Normalisation and Return to Normal Operations**
How does the organisation transition from continuity mode back to normal operations?

- Criteria for declaring the disruption resolved
- Steps for returning to primary location/systems
- Data reconciliation (ensuring data from continuity period is properly integrated)
- Lessons learned process

**10. Plan Maintenance**
- Review frequency (minimum annual)
- Owner responsible for keeping the plan current
- Exercise schedule (what exercises will test this plan?)
- Version control and distribution

---

## The Crisis Management Plan

Above individual BCPs sits the **Crisis Management Plan (CMP)** — the overarching plan that coordinates the organisation's response to a major disruption affecting multiple functions or the whole organisation.

**Crisis Management Team (CMT)**: A defined group of senior managers who are activated during a crisis to make strategic decisions, coordinate BCP execution, and manage external communications.

Typical CMT members:
- Chief Executive / Managing Director (or deputy)
- Operations Director
- Finance Director
- IT Director / CISO
- Head of Communications / PR
- HR Director
- Legal Counsel (or advisor)
- BCM Manager (coordinator)

**CMT responsibilities:**
- Assess the overall situation and scope of the crisis
- Declare a crisis and activate relevant BCPs
- Make strategic decisions (Is this a reputational crisis? Do we need to brief the board? Do we need external assistance?)
- Manage external communications (media, regulators, key customers)
- Coordinate across multiple BCPs
- Resource allocation and escalation decisions
- Document the crisis response for post-incident review

**The War Room / Crisis Command Centre**: A physical or virtual location where the CMT coordinates during a crisis. Should be accessible even if the primary office is unavailable — an alternate location, a virtual meeting platform (with access outside the primary network).

---

## IT Disaster Recovery Plans

The **IT Disaster Recovery Plan (DRP)** is a specific subset of business continuity planning — focused on recovering IT systems and data.

**DRP structure:**

**Scope and criticality tier**: Which systems are covered, in what priority order (based on BIA RTOs).

**Tier definitions (example):**
| Tier | RTO | DR Strategy |
|---|---|---|
| Tier 0 — Mission Critical | < 1 hour | Hot standby / Active-Active |
| Tier 1 — Critical | 1–4 hours | Warm standby |
| Tier 2 — Important | 4–24 hours | Backup-restore |
| Tier 3 — Standard | 24–72 hours | Standard backup |
| Tier 4 — Non-critical | > 72 hours | No DR required |

**Recovery procedures for each system tier:**
- Pre-recovery checks
- Failover/recovery steps (specific, numbered)
- Post-recovery validation (how do you confirm the system is working correctly?)
- Backout procedures (how do you reverse the recovery if it fails?)

**Dependencies and sequence**: Which systems must be recovered first because other systems depend on them? (Active Directory before application servers; database server before application server; network before everything.)

**Testing schedule**: When was the last DR test? What was the outcome? When is the next test scheduled?

---

## BCP Testing Approaches

BCPs must be tested. The four main testing approaches, in order of increasing realism and rigour:

**1. Document Review (Walkthrough)**
The BCP is reviewed by the team responsible for executing it. They discuss the plan, identify gaps, ask questions. No simulation; no systems tested.

**Benefit**: Identifies obvious gaps in documentation; familiarises team with the plan.
**Limitation**: Does not test whether the plan actually works.

**2. Table-Top Exercise**
A structured discussion exercise where the team works through a realistic scenario, discussing what they would do at each stage. A facilitator presents the scenario and injects complications.

**Benefit**: Tests decision-making; identifies coordination gaps; more engaging than document review.
**Limitation**: Still discussion-based; does not test technical recovery or actual execution.

**3. Simulation Exercise**
A more realistic exercise where teams respond to a scenario as if it were real — making decisions, drafting communications, contacting (simulated) third parties, activating (some) recovery procedures.

**Benefit**: Tests the response process more realistically; exposes operational gaps.
**Limitation**: Some elements are still simulated; may not test actual system recovery.

**4. Full Interruption Test**
The actual BCP is fully activated — systems are failed over to the DR environment, staff relocate to the alternate workplace, operations are conducted through the continuity environment for a defined period.

**Benefit**: The only test that validates the plan fully; proves the recovery works in practice.
**Limitation**: Highest risk (if the test fails, real operations may be affected); most resource-intensive; requires careful change management and stakeholder communication.

**Best practice testing programme:**
- Annual full table-top exercise (at minimum)
- Annual IT DR test (failing specific systems over to DR and validating recovery)
- 3-yearly (or more frequent) full interruption test for critical BCPs
- Post-incident review when a real disruption occurs (real activations are the most valuable tests)

---

## Common Mistakes and Failures

**1. Plans stored only on the primary IT systems.**
The BCP for a data centre outage is stored on a share drive in the data centre. When the data centre goes down, nobody can access the BCP. Plans must be accessible outside primary systems — printed copies in a secure location, cloud storage accessible from personal devices, wallet cards with key contacts.

**2. Plans that name specific individuals with no alternates.**
"Contact James Chen" — but James left the company six months ago. Every named role in a BCP must have a named alternate and a process for the alternate to engage.

**3. Strategies that have never been tested.**
"In the event of office unavailability, staff will work from home." Has anyone actually tested that all staff can access all critical systems from home? Can they access the systems at full capacity? Is the VPN capacity sufficient for all staff simultaneously?

**4. Plans written for the plan writers.**
BCPs written by the IT team describe technical recovery procedures that only IT staff can execute. BCPs written for the finance team describe financial procedures that finance staff understand. Both need to be accessible to whoever may need to execute them during the disruption — including people who weren't involved in writing them.

**5. No MBCO defined.**
The plan restores a system but doesn't say what operations should be conducted at what level while the system is in recovery mode. Teams improvise. Some try to run full operations through the continuity environment (overloading it); others do nothing (underutilising the available capability).

**6. Recovery strategies not cost-justified.**
Hot standby infrastructure for a low-criticality process that could tolerate a 48-hour RTO. Or no DR investment for a genuinely critical process that cannot tolerate more than 2 hours of unavailability. Recovery strategy investment must be proportionate to the criticality of the function.

---

## Exam Angle

**CISM:**
- Domain 4 (Incident Management) — recovery strategies and BCP development are core components. CISM candidates should understand the strategy options for each resource type, the structure of a BCP, and the crisis management planning process.

**CRISC:**
- Domain 3 (Risk Response) — recovery strategies are risk treatment options for operational disruption risks. The cost-benefit analysis of recovery strategy selection is a CRISC competency.

**CISSP:**
- Domain 7 (Security Operations) — BCPs and DRPs are specifically tested. Know the four testing approaches, the DRP tier structure, the BCP content requirements, and the crisis management planning concept.

**ISO 27001 Lead Auditor:**
- A.5.29–A.5.30 require documented ICT continuity procedures. Auditors should assess: do BCPs/DRPs exist for critical systems? Do they address the RTOs/RPOs defined in the BIA? Have they been tested? Are they stored in a location accessible during the disruption they address?

---

## GUARDIAN's Take

A Business Continuity Plan is only as good as its worst section. A plan with a brilliant crisis management structure and a vague "restore from backup" instruction for a critical system provides false assurance. The testing has to be as rigorous as the planning.

The organisations I have seen execute effective continuity responses during real disruptions share two characteristics: they exercised their plans, and they exercised them realistically. Not a document review — an actual exercise where someone says "the building is inaccessible, you have the BCP, go." And then the team discovers that the BCP references a website hosted on servers inside the building. Or that two key people share the same home location and both are affected by the flooding that made the building inaccessible. Or that the remote access VPN handles 50 concurrent connections and they have 150 people trying to connect simultaneously.

Those are things you discover in an exercise, not in a crisis. In a crisis, you execute. You do not have time to discover that your plan has fundamental gaps.

Write specific plans. Test them realistically. Update them after every test and every real event. That is the BCM programme that works.

---
*Module: Module 8 — Business Continuity | Guardian Curriculum*
