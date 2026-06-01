---
tags: [guardian, grc, module-8, bia, business-impact-analysis, rto, rpo, mtpd, critical-functions]
module: 8
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-19
guardian-refs: ["G8-01 — What is Business Continuity Management", "G8-03 — Recovery Strategies", "G8-04 — ISO 22301", "G2-03 — Risk Assessment Methodologies"]
---

# G8-02 — Business Impact Analysis — BIA

> [!abstract] What This Note Covers
> By the end of this note, you will understand what a Business Impact Analysis is, how to conduct one step by step, how to determine RTOs, RPOs, and MTPs, how to identify critical functions and their dependencies, and how BIA outputs drive continuity strategy selection.

---

## Why This Exists

The Business Impact Analysis is the analytical foundation of the entire BCM programme. Without a rigorous BIA, everything that follows — strategy selection, plan development, resource investment — is based on assumption rather than evidence. Organisations that invest in BCM without first conducting a BIA frequently discover, during an actual disruption, that they protected the wrong functions, set unachievable recovery objectives, or failed to identify critical dependencies.

The BIA is not a risk assessment (though they are related). Where a risk assessment asks "what could go wrong and how likely is it?", the BIA asks "if something goes wrong and a disruption occurs, what is the impact on the business, and how long can we survive without each function?" The BIA does not care about the cause of the disruption — it analyses the impact of disruption regardless of cause.

---

## What a Business Impact Analysis Is

**Business Impact Analysis (BIA)** is the process of:
1. Identifying the organisation's critical business functions and processes
2. Assessing the impact of disruption to each function over time
3. Determining the time limits within which each function must be recovered
4. Identifying the resources (people, premises, technology, data, suppliers) each function requires
5. Identifying dependencies between functions and with external parties

The BIA produces the core parameters that define recovery requirements:
- **Recovery Time Objective (RTO)**: Maximum acceptable time to restore the function
- **Recovery Point Objective (RPO)**: Maximum acceptable data loss
- **Maximum Tolerable Period of Disruption (MTPD)**: Point beyond which disruption causes unacceptable consequences
- **Minimum Business Continuity Objective (MBCO)**: The minimum level at which the function must operate during recovery

---

## The BIA Process: Step by Step

### Step 1: Define Scope and Secure Sponsorship

**Scope definition**: Which parts of the organisation are included in the BIA? For most organisations, the first BIA should cover all critical business functions — not just IT systems. The BIA looks at business processes, not technology.

**Executive sponsorship**: The BIA requires senior management cooperation. Business unit managers must participate in BIA workshops and provide honest assessments of their functions' criticality and impact. Without executive sponsorship, managers may be reluctant to participate or may understate dependencies.

**BIA team**: Typically led by the BCM Manager, with support from:
- Business unit managers (to describe their processes and dependencies)
- IT team (to provide system recovery capabilities and constraints)
- Finance (to quantify financial impacts)
- HR (workforce planning)
- Risk team (to coordinate with risk assessment)

### Step 2: Identify Business Functions and Processes

Map all the organisation's business functions and the processes that support them.

**Function vs process distinction**:
- A **function** is a high-level business area (e.g. Customer Service, Finance, Manufacturing, IT Operations)
- A **process** is a specific operational activity within a function (e.g. Invoice Processing within Finance; Order Fulfilment within Customer Service)

BIA is conducted at the process level — the granularity needed to determine recovery requirements. However, it is organised by function for management review.

**Process identification techniques**:
- Process maps and workflow diagrams (if they exist)
- Workshops with business unit managers
- Interviews with operational staff who understand day-to-day activities
- Review of service level agreements and contracts (these often identify time-critical obligations)

**Typical output at this stage**: A process inventory — a comprehensive list of all business processes, organised by function.

### Step 3: Assess Impact Over Time

For each process, assess the impact of disruption at increasing time intervals. The key insight of the BIA is that impact is not static — it increases over time as the disruption continues.

**Impact dimensions to assess**:

**Financial impact**: Lost revenue, contractual penalties, regulatory fines, cost of workarounds, cost of recovery.

**Operational impact**: Inability to deliver services, backlog accumulation, resource waste, capacity loss.

**Regulatory/legal impact**: Breach of legal or regulatory obligations, potential enforcement action, reporting obligations triggered.

**Reputational impact**: Customer trust loss, media attention, brand damage.

**Health, safety, and welfare impact**: Risk to staff, customers, or third parties (most relevant for healthcare, critical infrastructure, utilities).

**Time intervals for impact assessment**: Typically assessed at: 1 hour, 4 hours, 8 hours (1 business day), 24 hours, 48 hours, 1 week, 2 weeks, 1 month. The escalation of impact over time reveals the urgency of recovery.

**Impact scoring**: Typically scored on a 1–5 or 1–10 scale across each dimension:

| Score | Financial | Reputational |
|---|---|---|
| 1 | Negligible (<£1K) | Negligible internal concern |
| 2 | Minor (£1K–£10K) | Minor customer complaints |
| 3 | Significant (£10K–£100K) | Press enquiries; customer escalations |
| 4 | Severe (£100K–£1M) | Significant press coverage; major customer loss |
| 5 | Catastrophic (>£1M) | National press; regulatory enforcement; existential threat |

**The impact escalation table**: A standard BIA output is a table showing each process's impact score at each time interval:

| Process | 1hr | 4hr | 8hr | 24hr | 48hr | 1wk |
|---|---|---|---|---|---|---|
| Customer payment processing | 1 | 2 | 3 | 4 | 5 | 5 |
| Employee payroll | 1 | 1 | 1 | 1 | 3 | 5 |
| Regulatory reporting | 1 | 1 | 2 | 4 | 5 | 5 |
| Office Wi-Fi | 1 | 1 | 1 | 1 | 1 | 2 |

This table immediately reveals which processes are time-critical (impact escalates quickly) and which are more tolerant of disruption.

### Step 4: Determine Maximum Tolerable Period of Disruption (MTPD)

The **MTPD** is the point at which continued disruption would cause consequences that the organisation cannot recover from — permanent customer loss, irreversible reputational damage, financial insolvency, regulatory breach.

The MTPD is determined by asking: "At what point does the disruption of this process cause consequences that are unacceptable and potentially unrecoverable?"

**MTPD examples**:
- Customer payment processing: MTPD = 48 hours (beyond this, customers will go to competitors and not return)
- Payroll processing: MTPD = 2 weeks (beyond this, staff will leave or take legal action)
- Regulatory reporting: MTPD = 24 hours (regulatory deadline; missing triggers enforcement)
- Office Wi-Fi: MTPD = 2 weeks (staff can use mobile data as workaround)

The MTPD defines the outer boundary of the acceptable recovery window.

### Step 5: Determine Recovery Time Objective (RTO)

The **RTO** is the maximum acceptable time to restore the process after a disruption. The RTO must be:
- **Less than the MTPD**: The process must be restored before the MTPD is reached
- **Achievable**: The RTO must be achievable given the recovery infrastructure and strategy
- **Agreed**: The RTO must be agreed by both business (what we need) and IT/operations (what we can deliver)

**RTO derivation**:
- Start with the MTPD (outer boundary)
- Apply a safety margin: RTO should be significantly less than MTPD (if MTPD = 48 hours, RTO might be 24 hours — allowing time for the recovery to be confirmed working, data validated, and operations normalised before the MTPD is reached)
- Validate against recovery capability: can the recovery infrastructure actually restore the process within the RTO?

**RTO examples** (for the processes above):
- Customer payment processing: RTO = 4 hours (MTPD 48 hours, but earlier recovery prevents revenue loss and reduces backlog)
- Payroll processing: RTO = 24 hours (MTPD 2 weeks, but important to demonstrate control rapidly)
- Regulatory reporting: RTO = 2 hours (MTPD 24 hours; regulatory deadlines are fixed)
- Office Wi-Fi: RTO = 48 hours (MTPD 2 weeks; staff have mobile data workaround)

### Step 6: Determine Recovery Point Objective (RPO)

The **RPO** defines the maximum acceptable data loss — how far back in time the restored system can be from the point of disruption.

**RPO determination**: How frequently is data created or modified in this process? What is the impact of losing that data? What is the cost of the backup/replication technology needed to achieve a given RPO?

**RPO examples**:
- Customer payment processing: RPO = 0 (real-time replication; no transaction data loss acceptable — financial and regulatory implications)
- Payroll processing: RPO = 24 hours (daily payroll data; losing one day's updates is manageable)
- CRM records: RPO = 4 hours (updates several times per day; losing 4 hours is manageable)
- Archive email: RPO = 24 hours (historical data; low volatility)

**RPO and backup frequency**: RPO determines the required backup frequency. An RPO of 4 hours requires backups (or replication) at least every 4 hours. An RPO of 24 hours requires daily backups. An RPO of 0 (no data loss) requires real-time replication or journaling.

### Step 7: Identify Resource Requirements

For each critical process, identify the minimum resources needed to resume operations during a disruption — the resources that form the basis of the continuity strategy:

**People**: Who must be available to operate this process? What skills are required? What is the minimum staffing level (MBCO)? Who are the named alternates if primary staff are unavailable?

**Premises**: Where must the process operate? Can it operate remotely? Is an alternate site needed? What physical space is required?

**Technology**: Which systems, applications, and data are required? What is the minimum technology configuration needed (not the full production stack — the minimum viable technology for the MBCO)?

**Data**: Which data must be available? In what format? Where is it stored? What is the backup/restoration process?

**Suppliers and third parties**: Which external suppliers or partners are essential to this process? What is the dependency? What is the supplier's own recovery capability?

**Vital records**: Which records (paper or electronic) are essential and must be protected or replicated?

**Minimum Business Continuity Objective (MBCO)**: The minimum level of service that must be maintained. For example:
- Customer payment processing MBCO: Process emergency refunds and new orders; defer reporting and reconciliation
- Payroll processing MBCO: Process salary payments; defer expense claims and bonuses
- IT operations MBCO: Maintain security monitoring, email, and critical applications; defer development and non-critical services

### Step 8: Identify Dependencies and Single Points of Failure

A critical element of BIA is mapping the dependencies between processes and with external parties:

**Internal dependencies**: Which other business processes does this process depend on? A disruption to the dependent process will affect this process even if this process is otherwise unaffected.

Example: Customer payment processing depends on:
- Authentication system (login to payment platform)
- Network connectivity (to payment processor)
- Financial reconciliation process (downstream)
- Customer database (to verify accounts)

**External dependencies**: Which third-party suppliers, utilities, or services does this process depend on? Cloud providers, payment processors, internet connectivity, electricity, water, logistics.

**Single Points of Failure (SPOFs)**: A single point of failure is a component or dependency where failure would cause complete process failure, and where no alternative exists. SPOFs are the highest-priority BCM risk items.

Examples of SPOFs:
- A single payment processing integration with no fallback processor
- A single data centre with no replication to a second site
- A single expert employee with unique critical knowledge
- A single supplier for a critical component with no alternative source

SPOFs identified in the BIA should be addressed in the continuity strategy — through redundancy, alternative sourcing, cross-training, or other mitigations.

---

## BIA Output Documentation

A well-structured BIA produces the following documented outputs:

**Process Criticality Register**: All business processes ranked by criticality (determined by impact escalation speed and MTPD).

**RTO/RPO Table**: For each critical process:
- Process name and function
- MTPD
- RTO
- RPO
- MBCO

**Resource Requirements Matrix**: For each critical process:
- Minimum personnel requirements (numbers and roles)
- Technology requirements (systems, connectivity)
- Premises requirements (space, location)
- Data requirements (datasets, backup sources)
- Third-party dependencies

**Dependency Map**: Visual map showing dependencies between processes and with external parties.

**Single Points of Failure Register**: SPOFs identified with their risk rating and proposed mitigation.

---

## BIA and IT Disaster Recovery

The BIA drives IT disaster recovery requirements — specifically the RTO and RPO for each IT system:

| Business process RTO | IT system RTO | Implication |
|---|---|---|
| 4 hours | System A: 4-hour RTO | Must be recovered within 4 hours of declaration |
| 4 hours | System B (dependency): 2-hour RTO | Dependency must be recovered first — within 2 hours |
| 24 hours | System C: 24-hour RTO | Standard backup-restore acceptable |
| No RTO (non-critical) | System D: No DR required | System excluded from DR scope |

This mapping tells the IT team which systems require investment in DR capabilities (hot standby, warm standby, backup and restore) and at what recovery speed.

**Hot standby**: Near-real-time replication; fail-over in minutes. Required for processes with RTOs of minutes to hours.

**Warm standby**: Near-current replica; fail-over in hours. Required for processes with RTOs of hours.

**Cold standby**: Backup-restore from stored backups; recovery in hours to days. Acceptable for processes with RTOs of 24–72 hours.

**No DR**: Processes with long RTOs or low criticality that can tolerate extended outages.

---

## Common Mistakes and Failures

**1. BIA conducted as an IT exercise.**
The IT team conducts the BIA, mapping systems rather than business processes. RTOs are set based on what IT can deliver rather than what the business needs. Business impact dimensions (regulatory, reputational, operational) are not assessed — only IT recovery time.

**2. Business managers setting RTOs without IT validation.**
Business managers declare RTOs of "1 hour" for all processes because they want everything restored quickly. IT cannot achieve 1-hour RTOs for systems that require 8 hours to restore from backup. Unachievable RTOs create false assurance and are never invested in.

**3. Dependencies not mapped.**
A process is assessed in isolation. Its dependency on a shared authentication system, a central database, or a third-party API is not captured. The BCP restores the process but the dependency is unavailable — the restored process cannot function.

**4. MTPD not distinguished from RTO.**
The RTO is set equal to the MTPD — leaving no margin. When recovery takes longer than expected (which it typically does during a real disruption), the MTPD is breached before recovery is complete.

**5. BIA conducted once and never reviewed.**
The organisation has changed significantly — new products, new systems, new suppliers, office relocations — but the BIA from three years ago has never been updated. RTOs, resource requirements, and criticality assessments are all based on an organisational reality that no longer exists.

**6. MBCO not defined.**
RTOs are defined but the MBCO — what "operational" actually means during recovery — is not. When the BCP is activated, teams argue about whether the process is "recovered" at 30% capacity, 50%, or 100%. Define the minimum viable operational state upfront.

---

## Exam Angle

**CISM:**
- Domain 4 (Incident Management) — BIA is the foundation of business continuity planning, which is a core component of incident management. CISM candidates must understand the BIA methodology, RTO/RPO/MTPD definitions, and how BIA outputs drive continuity strategy selection.

**CRISC:**
- Domain 2 (IT Risk Assessment) — the BIA is a specialised form of impact assessment for operational disruption risks. The relationship between BIA findings and risk assessment — and how they inform risk treatment decisions — is relevant to CRISC.

**CISSP:**
- Domain 7 (Security Operations) includes BIA as a core component of BCM. Know the definitions (RTO, RPO, MTPD, MBCO), the BIA process, and how BIA outputs drive DR planning.

**ISO 27001 Lead Auditor:**
- ISO 27001 A.5.29–A.5.30 require ICT continuity planning. An auditor assessing these controls should ask: has a BIA been conducted? Are RTOs and RPOs defined for critical systems? Are these based on business requirements (BIA) or IT assumptions?

---

## GUARDIAN's Take

The BIA is where BCM theory meets operational reality — and where most BCM programmes reveal their weaknesses.

The most common BIA failure is the absence of genuine business engagement. When the BCM Manager conducts the BIA in isolation — using IT system inventories and generic business process descriptions — the resulting RTOs, RPOs, and resource requirements are approximations at best, fiction at worst. The BIA must be a collaborative process, with business managers actively engaged in assessing the impact of disruption to their functions over time.

The most valuable insight the BIA produces is usually the one that surprises everyone: the discovery that a process everyone assumed was low-criticality is actually business-critical because of a regulatory deadline nobody mentioned; or that a system everyone assumed was recoverable in 2 hours actually takes 18 hours because of a dependency that was never mapped.

These surprises are the BIA's return on investment. They are the things that would have caused catastrophic failure during a real disruption — discovered in a workshop, before the disruption, when they can still be addressed.

Invest in the BIA properly. Engage the business. Map the dependencies. Challenge the assumptions. The surprises you find in a BIA workshop are the crises you will not face in an actual disruption.

---
*Module: Module 8 — Business Continuity | Guardian Curriculum*
