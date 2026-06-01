---
tags: [guardian, grc, module-3, iso27001, certification, stage-1, stage-2, audit, certification-body]
module: 3
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G3-01 — What is ISO 27001", "G3-02 — The ISMS", "G3-11 — Statement of Applicability", "G3-12 — Gap Assessment", "G3-14 — Internal Audit", "G3-15 — Nonconformities", "G3-17 — Surveillance Audits and Recertification"]
---

# G3-13 — The Certification Journey — Stage 1 and Stage 2 Audits

> [!abstract] What This Note Covers
> By the end of this note, you will understand the complete ISO 27001 certification journey from selecting a certification body through to receiving the certificate — including what happens in Stage 1 and Stage 2 audits, how to prepare effectively, what auditors are looking for, and what to do when nonconformities are raised.

---

## Why This Exists

The certification audit is the culminating event of an ISO 27001 implementation — the moment when an independent third party assesses whether the ISMS is genuine, conforms to the standard, and is effectively implemented. Understanding how this process works is essential for anyone involved in building, maintaining, or auditing an ISMS.

Many organisations approach certification audits with a mixture of anxiety and misconception — treating auditors as adversaries to be managed rather than independent professionals providing valuable assurance. Others approach it with overconfidence — assuming that because their documentation is in order, the audit will be straightforward. Both approaches are wrong, and both can produce poor outcomes.

The certification audit is a professional, structured process with defined objectives, defined evidence requirements, and defined outcomes. Understanding it demystifies it — and makes effective preparation possible.

---

## The Certification Lifecycle Overview

ISO 27001 certification follows a three-year cycle:

```
GAP ASSESSMENT
        ↓
ISMS IMPLEMENTATION (typically 6–18 months)
        ↓
INTERNAL AUDIT (Clause 9.2)
        ↓
MANAGEMENT REVIEW (Clause 9.3)
        ↓
STAGE 1 AUDIT (documentation review — typically 1–2 days)
        ↓
STAGE 1 FINDINGS CLOSURE (typically 4–8 weeks)
        ↓
STAGE 2 AUDIT (on-site/remote assessment — typically 2–5 days)
        ↓
CERTIFICATE ISSUED (3-year validity)
        ↓
SURVEILLANCE AUDIT YEAR 1 (typically 1–2 days)
        ↓
SURVEILLANCE AUDIT YEAR 2 (typically 1–2 days)
        ↓
RECERTIFICATION AUDIT (full reassessment — similar to Stage 2)
        ↓
[repeat 3-year cycle]
```

---

## Step 1: Selecting a Certification Body

Before any audit activity, the organisation must select an accredited certification body (CB). Key considerations:

### Accreditation
The CB must be accredited by a national accreditation body. In the UK, this is **UKAS (United Kingdom Accreditation Service)**. In the US, **ANAB** or **ANSI**. Accreditation ensures the CB operates to ISO/IEC 17021 (requirements for bodies providing management system certification).

A certificate from a non-accredited CB has no standing with customers, regulators, or government bodies. Always verify UKAS accreditation for UK certificates.

### Market-Recognised CBs in the UK and Globally

| CB | Notes |
|---|---|
| **BSI (British Standards Institution)** | UK market leader; strong brand recognition; premium pricing |
| **Bureau Veritas** | Strong in engineering and industrial sectors |
| **DNV (Det Norske Veritas)** | Strong in maritime, energy, and manufacturing |
| **LRQA (formerly Lloyd's Register)** | Strong in UK and global enterprise |
| **SGS** | Broad global coverage |
| **Intertek** | Consumer goods and manufacturing focus |
| **TÜV SÜD / TÜV Rheinland** | Strong in Germany and European markets |

For technology companies seeking to demonstrate security maturity to UK enterprise customers and government, BSI and LRQA carry strong market recognition. For global certification, BSI and Bureau Veritas have broad international coverage.

### What to Request from Potential CBs

When obtaining quotes from CBs, request:
- **Auditor profile**: Confirm the assigned auditor has relevant sector experience (technology, financial services, healthcare — depending on your sector)
- **Audit duration estimate**: CBs calculate audit duration based on organisational size, scope complexity, and number of sites. Verify their estimate against typical benchmarks.
- **Certificate scope flexibility**: Confirm the CB can certify your specific scope as described
- **Surveillance audit terms**: Understand the frequency and duration of surveillance audits included in the certification fee
- **References**: Ask for references from similar organisations they have certified

### Audit Duration Guidance

ISO/IEC 27006 provides guidance on audit duration. Approximate benchmarks:

| Organisation size (staff) | Stage 1 (days) | Stage 2 (days) | Surveillance (days) |
|---|---|---|---|
| <10 | 0.5–1 | 1–2 | 0.5–1 |
| 10–50 | 1 | 2–3 | 1 |
| 50–250 | 1–2 | 3–4 | 1–2 |
| 250–1000 | 2 | 4–6 | 2 |
| >1000 | 2–3 | 6–10+ | 2–3 |

These are minimums — additional days may be required for multi-site audits, complex scope, or specific sector requirements.

---

## Step 2: Pre-Audit Preparation

Effective preparation is the difference between a smooth certification audit and a stressful one that produces unexpected findings.

### Internal Audit (Mandatory)
Clause 9.2 requires an internal audit before the Stage 2 audit. The internal audit should be conducted 2–3 months before Stage 2, giving time to address any findings before the external auditor arrives.

The internal audit must cover all ISMS requirements and produce a formal audit report. Certification body auditors will review the internal audit report as part of the Stage 1 audit — they want to see that the organisation is capable of self-identifying issues, not just that it has a documented internal audit procedure.

### Management Review (Mandatory)
Clause 9.3 requires management review. This must be conducted before Stage 2 and must cover all required inputs. The management review minutes are mandatory evidence reviewed by auditors.

### Documentation Readiness
All mandatory documented information must be in place, current, and approved before Stage 1. A pre-Stage 1 documentation checklist:

| Document | Required by | Status check |
|---|---|---|
| ISMS scope | Clause 4.3 | Current, approved, specific |
| Information security policy | Clause 5.2 | Signed by CEO/MD, current date |
| Risk assessment methodology | Clause 6.1.2 | Complete, documented |
| Risk register | Clause 8.2 | Current, all assets assessed, owners named |
| Risk treatment plan | Clause 6.1.3 | Current, actions tracked |
| Statement of Applicability | Clause 6.1.3(d) | All 93 controls addressed, traceability evident |
| Information security objectives | Clause 6.2 | Measurable, owned, tracked |
| Internal audit programme and report | Clause 9.2 | Conducted within 3 months of Stage 2 |
| Management review minutes | Clause 9.3 | Conducted, all inputs covered, decisions documented |
| Corrective action register | Clause 10.1 | Internal audit findings tracked |
| Competence and training records | Clause 7.2 | Complete for all ISMS roles |

### Evidence Organisation
Stage 2 auditors will request evidence for each applicable control. Having evidence organised and accessible reduces audit stress significantly.

Best practice: create an evidence folder structure mirroring the SoA — one folder per Annex A category, one sub-folder per applicable control, containing the relevant evidence documents. The evidence reference column in the SoA points directly to each folder.

### Staff Preparation
All staff who might be interviewed during Stage 2 should understand:
- What an ISO 27001 audit is and why it matters
- Their personal security responsibilities
- Where the information security policy is and what it says
- How to report a security incident
- What they should say if asked about specific processes they participate in

**Critical point**: Staff should be honest with auditors. Coaching staff to give scripted answers is counterproductive — auditors are experienced at detecting scripted responses, and inconsistency between staff accounts is a significant red flag. Staff should be prepared to describe what they actually do, not what the procedure says they should do.

---

## Stage 1 Audit: Documentation Review

### Purpose and Format

The Stage 1 audit (also called the initial documentation review or readiness review) assesses whether the organisation is ready to proceed to Stage 2. It is primarily a documentation review — the auditor is checking whether the ISMS has been designed and documented in a way that could meet ISO 27001 requirements, without yet testing whether it is operating in practice.

Stage 1 is typically conducted remotely (document submission) or as a short on-site/remote visit (0.5–2 days depending on scope).

### What Stage 1 Covers

**ISMS scope review:**
- Is the scope clearly defined?
- Is it appropriate given the context analysis and interested party requirements?
- Are interfaces with out-of-scope functions documented?

**Information security policy:**
- Is it current and signed by top management?
- Does it contain all required elements (Clause 5.2)?

**Risk assessment and treatment:**
- Is the methodology documented and appropriate?
- Has a risk assessment been conducted?
- Is the risk register complete and specific?
- Is the risk treatment plan current?

**Statement of Applicability:**
- Are all 93 controls addressed?
- Are inclusions justified with risk register references?
- Are exclusions credibly justified?
- Is implementation status documented?

**Internal audit:**
- Has an internal audit been conducted?
- Is the audit report complete and professional?
- Were findings addressed?

**Management review:**
- Has management review been conducted?
- Does the record demonstrate substantive engagement?

**Readiness for Stage 2:**
The Stage 1 auditor will determine whether the organisation is ready to proceed to Stage 2. If significant gaps are found (particularly if mandatory documents are missing, the risk assessment is not complete, or the SoA is not adequate), Stage 2 will not be scheduled until these are addressed.

### Stage 1 Outputs

The Stage 1 audit produces:
1. A Stage 1 audit report documenting the findings
2. A determination: is the organisation ready to proceed to Stage 2?
3. A list of any findings (items to be addressed before or during Stage 2)
4. A proposed Stage 2 audit plan

### Stage 1 Findings

Stage 1 findings are not classified as major/minor nonconformities — they are documentation gaps that must be addressed before Stage 2 can proceed. Common Stage 1 findings:

- Information security policy not signed by highest management level
- Risk assessment methodology not sufficiently documented
- SoA control exclusions not justified
- Internal audit not yet conducted (Stage 2 will be delayed until conducted)
- Management review not yet conducted (same)
- SoA not updated following recent significant change to scope

**Responding to Stage 1 findings**: Typically 4–8 weeks is available between Stage 1 and Stage 2. Each finding must be addressed with documented evidence provided to the CB before Stage 2 is scheduled.

---

## Stage 2 Audit: On-Site Assessment

### Purpose and Format

The Stage 2 audit is the full assessment of ISMS conformance and operational effectiveness. It tests whether the ISMS is actually working — not just whether it is documented. The auditor will:
- Interview management and staff
- Review ISMS documentation and records
- Observe processes in operation
- Test specific controls (sampling, configuration review)
- Trace the traceability chain from risk to control to evidence

Stage 2 is conducted on-site (or remotely with screen sharing and video) and typically takes 2–5 days depending on scope.

### The Stage 2 Audit Process

**Day 1 — Opening Meeting:**
The Stage 2 audit begins with a formal opening meeting. The auditor introduces themselves, explains the audit process, confirms the audit scope and criteria, and outlines the schedule. Key attendees: CISO, senior management representative, relevant process owners.

The opening meeting is an opportunity to:
- Confirm any scope clarifications
- Introduce the audit team and key contacts
- Agree on logistics (room availability, interview scheduling, evidence access)

**During the Audit — Evidence Gathering:**
The auditor works through the ISMS, gathering evidence across all clauses and applicable controls. Methods:

*Document review*: Reviewing ISMS documentation — policies, procedures, risk register, SoA, training records, audit reports, management review minutes, corrective action register.

*Interviews*: Structured conversations with:
- Senior management (CEO, CFO) — testing leadership commitment and engagement
- CISO — testing knowledge of risk posture, ISMS management, and improvement
- IT operations staff — testing knowledge of security procedures and control operation
- Business unit managers — testing risk owner understanding and engagement
- All-staff interviews (a sample) — testing security awareness

*Observations*: The auditor may observe processes in real time — physical security controls, access control demonstrations, system configurations displayed on screen.

*Sampling*: The auditor will select samples to test — for example:
- 20 random user accounts: verify MFA is enrolled for each
- 10 recent changes: verify security review was conducted for each
- 5 suppliers: verify security assessments were conducted and security clauses exist in contracts
- 3 recent incidents: verify incident was logged, investigated, and lessons learned documented
- Most recent vulnerability scan report: assess patch compliance rate

**During the Audit — Finding Collection:**
As evidence is gathered, the auditor identifies findings. Findings may be:
- **Conformance**: The requirement is met — no issue
- **Observation / Opportunity for Improvement**: Not a nonconformity but something could be better
- **Minor Nonconformity**: An isolated or partial failure to meet a requirement
- **Major Nonconformity**: A systemic failure or complete absence of a required element

Throughout the audit, findings are noted in audit working papers. The auditor does not typically share findings during the audit itself — they are presented at the closing meeting.

**Final Day — Closing Meeting:**
The Stage 2 audit concludes with a formal closing meeting. The auditor presents:
- A summary of audit findings (conformances, observations, nonconformities)
- The classification of any nonconformities (major or minor)
- The certification recommendation

If there are no major nonconformities (and minor NCs can be addressed within a defined timeframe), the auditor will recommend certification. The CB's certification decision is then made by an independent reviewer (not the auditor) — typically within a few weeks.

### Certification Outcomes

| Outcome | Condition | What happens next |
|---|---|---|
| **Recommend certification** | No major NCs; any minor NCs with acceptable corrective action plan | CB reviews and issues certificate (typically within 4–8 weeks) |
| **Conditional certification** | Minor NCs that require closure before certificate issued | Closure evidence submitted to CB; certificate issued on acceptance |
| **Further evidence required** | Insufficient evidence for certain requirements | Organisation provides additional evidence; CB makes decision |
| **Stage 2 not complete** | Significant gaps requiring further work | Organisation addresses gaps; Stage 2 re-scheduled (additional cost) |
| **Major NC raised** | Systemic failure of a required element | Corrective action plan submitted within 30–60 days; evidence reviewed; certificate only issued when NC closed |

---

## Responding to Nonconformities

### If a Major Nonconformity is Raised

A major nonconformity at Stage 2 is serious but not catastrophic. The process:

1. **Understand the finding**: Confirm you understand exactly what the major NC covers — which requirement, what specific evidence was missing or inadequate.

2. **Submit a corrective action plan**: Typically within 30 days, submit to the CB a corrective action plan that includes:
   - Root cause analysis (why did this NC occur?)
   - Specific corrective actions to address the root cause
   - Implementation timeline
   - How effectiveness will be verified

3. **Implement the corrective action**: Execute the plan within the agreed timeframe (typically 60–90 days).

4. **Submit closure evidence**: Provide documentary evidence that the corrective action has been implemented and is effective.

5. **CB reviews and decides**: The CB reviews the closure evidence. If accepted, the NC is closed and the certification decision is made. In some cases, a follow-up visit may be required.

### If Minor Nonconformities are Raised

Minor NCs are more common and less serious. Typical process:
1. Agree the corrective action plan with the auditor at or shortly after the closing meeting
2. Implement corrective actions (typically within 30–60 days for minor NCs)
3. Submit closure evidence to the CB
4. CB accepts closure and certifies (or schedule for review at surveillance audit)

---

## Receiving the Certificate

Once all NCs are closed and the CB's certification committee has reviewed and approved, the certificate is issued. The certificate specifies:
- The organisation's name
- The scope of the ISMS (exactly as defined in the ISMS scope document)
- The standard version (ISO/IEC 27001:2022)
- The issue date
- The expiry date (3 years from issue)
- The CB's name and accreditation body
- A unique certificate number (for verification purposes)

The certificate can be verified through the CB's public certificate database and through the UKAS register (for UK certificates).

### Using the Certificate

The organisation may publish the certificate and reference ISO 27001 certification in:
- Company websites and marketing materials
- Procurement responses and customer questionnaires
- Contract negotiations
- Regulatory submissions

Importantly: the certificate scope must be clearly stated when the certification is referenced. "We are ISO 27001 certified" without specifying scope can be misleading if the scope is narrow.

---

## The Details That Matter

### The Audit Trail: What Auditors Are Really Looking For

Throughout Stage 2, the auditor is assembling an answer to one fundamental question: *Is this ISMS real?*

The evidence trail that answers "yes" looks like this:

1. **Context is specific**: The context analysis reflects this organisation's actual environment, threats, and obligations — not a generic template
2. **Risks are genuine**: Risk register entries are specific, risk owners are named and know they are owners, residual risk scores reflect actual control effectiveness
3. **Controls are implemented**: Every "Yes" in the SoA is backed by evidence that the control is operating — not just that a policy exists
4. **People are engaged**: Staff can describe their security responsibilities; risk owners understand their risks; management can discuss the risk posture
5. **Improvement is real**: Nonconformities have been found and addressed; controls have improved over time; the ISMS looks different (and better) than it did at the last audit

The evidence trail that answers "no" — that the ISMS is cosmetic — looks like:

1. Risk register entries that could have been written for any company
2. SoA with generic justifications and no risk references
3. Controls "implemented" on paper but no evidence when requested
4. Staff who have never heard of the ISMS or cannot describe their security responsibilities
5. Management review minutes that are a template with the date changed

Auditors with experience see the second pattern immediately. The questions become harder. The samples become larger. The finding severity increases.

### Multi-Site Audits

When the ISMS scope covers multiple sites, the audit typically covers the central management site in full and visits satellite sites as a sample (typically 20–30% of sites, selected by the CB based on risk). Satellite site visits are shorter and focused on whether local implementation is consistent with the central ISMS.

For remote working staff (a significant consideration post-2020), the audit should include assessment of remote working controls and potentially interviews with remote staff.

### Remote Audits

Since 2020, CBs have developed robust remote audit methodologies — using video calls, screen sharing for system demonstrations, and document submission portals. Remote audits are now accepted for Stage 1 and, for many organisations, Stage 2. Some CBs require at least part of Stage 2 to be on-site. Agree the format with your CB during the pre-audit planning phase.

---

## Common Mistakes and Failures

**1. Underestimating Stage 2 interview depth.**
Many organisations prepare their CISO thoroughly for Stage 2 but neglect the wider organisation. An auditor who interviews the CEO and finds they cannot name the organisation's top three risks, or who interviews a developer and finds they are unaware of the secure coding policy, will question the depth of leadership engagement and staff awareness.

**2. Treating Stage 1 findings as minor.**
A Stage 1 finding means the evidence or documentation is not ready for Stage 2. Some organisations treat Stage 1 findings as minor observations and proceed to Stage 2 without fully addressing them. This invariably produces a more difficult Stage 2 audit.

**3. Evidence not organised for rapid retrieval.**
The Stage 2 audit operates to a time budget. An auditor who requests evidence and must wait 20 minutes while the CISO searches for it will either note the evidence as unavailable (a finding) or fall behind schedule and be unable to complete the audit fully. Evidence must be immediately accessible, well-organised, and clearly labelled.

**4. Scope claims that exceed scope reality.**
The scope says "all operations of [Organisation Name] including all UK sites." In practice, the ISMS has only been applied to the London headquarters. The Manchester office has no awareness of the ISMS, different IT infrastructure, and different controls. The auditor will find this within the first few hours of Stage 2. The scope will need to be narrowed or the audit will not pass.

**5. Internal audit conducted immediately before Stage 2 with no time for corrective action.**
An internal audit conducted two weeks before Stage 2 that finds significant nonconformities. There is no time to address them before the external audit. The certification body auditor finds the same nonconformities — now classified as nonconformities against ISO 27001, not just internal findings.

**6. Corrective action plans that are superficial.**
A major nonconformity is raised. The corrective action plan submitted addresses the symptom (creates the missing document) without identifying or addressing the root cause (the process that led to the document being missing). The CB rejects the corrective action plan as insufficient.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- The Lead Auditor qualification specifically prepares candidates to conduct Stage 1 and Stage 2 audits. Every aspect of the certification process is examinable.
- Key exam topics: audit planning, opening and closing meeting conduct, evidence sampling methodology, finding classification (major NC / minor NC / observation), corrective action response requirements, auditor independence.
- Exam scenario types:
  - "During Stage 2, the auditor finds that the risk treatment plan has 12 overdue actions. How should this be classified?" (Depends on severity — if any Critical/High risks have no treatment and no formal acceptance, this could be major NC; if all are Low/Medium with valid acceptance rationale, minor NC or observation)
  - "An organisation submits a corrective action plan that re-trains the responsible individual but does not address the process failure. Is this acceptable?" (No — root cause analysis must address the systemic cause, not just the individual instance)
  - "The Stage 2 auditor finds that the internal audit was conducted by the CISO, who is responsible for the ISMS. Is this a nonconformity?" (Potentially — Clause 9.2 requires objectivity and impartiality; the auditor must assess whether this compromises independence and whether compensating measures exist)

**CISM:**
- Domain 3 (Security Programme) includes the certification process as part of programme assurance. CISOs must understand what certification involves and how to manage the programme to maintain certification.

---

## GUARDIAN's Take

The certification audit is not an examination you can cram for. Unlike a professional certification where last-minute revision can close knowledge gaps, an ISO 27001 Stage 2 audit tests operational reality — and operational reality cannot be manufactured in the weeks before an audit.

The organisations that sail through Stage 2 with minimal findings are not the ones that prepared the most intensively in the final month. They are the ones that built a genuine ISMS over 6–18 months, ran it honestly, found their own problems through internal audit, fixed them through the corrective action process, and arrived at Stage 2 with an ISMS that was already working — not one that was hastily assembled to pass an audit.

The audit itself typically confirms what the organisation already knows. If the internal audit found the same things the Stage 2 auditor is likely to find, and if those things have been addressed, Stage 2 should be relatively smooth. If the organisation has never honestly tested its own ISMS, Stage 2 will surface problems that could have been found internally — and those problems will require corrective action plans, extended timelines, and additional costs.

My advice: invest in the internal audit as if it were the external audit. Conduct it with the same rigour, the same independence, and the same commitment to finding the truth rather than the comfortable picture. What the internal audit finds is a gift — it is the organisation's chance to fix things before a third party finds them.

Arrive at Stage 2 with no surprises. That is the preparation that matters.

---
*Module: Module 3 — ISO 27001 | Guardian Curriculum*
