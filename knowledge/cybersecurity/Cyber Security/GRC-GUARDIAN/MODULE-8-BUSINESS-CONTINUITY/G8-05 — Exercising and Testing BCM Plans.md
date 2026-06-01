---
tags: [guardian, grc, module-8, bcm-exercises, testing, tabletop, simulation, full-interruption, lessons-learned]
module: 8
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-19
guardian-refs: ["G8-01 — What is Business Continuity Management", "G8-03 — Recovery Strategies and BCPs", "G8-04 — ISO 22301", "G3-14 — Internal Audit"]
---

# G8-05 — Exercising and Testing BCM Plans

> [!abstract] What This Note Covers
> By the end of this note, you will understand the full spectrum of BCM exercise types, how to design and run an effective BCM exercise, what makes exercises realistic and valuable, how to capture and act on lessons learned, and how to build a progressive exercise programme that continuously strengthens organisational resilience.

---

## Why This Exists

An unexercised BCP is not a business continuity capability — it is a document. The plan may be beautifully written, comprehensively detailed, and meticulously maintained. None of that matters if it has never been tested under conditions that remotely resemble an actual disruption.

Exercises reveal what analysis cannot: the human decisions and failures that occur under pressure, the dependencies that were missed in the BIA, the contacts that are outdated, the systems that cannot be recovered within their stated RTO, the communication breakdowns between teams that seem coordinated on paper. Every significant gap found in an exercise is a gap that would have caused real harm in an actual disruption.

ISO 22301 Clause 8.5 requires an exercise programme — not a single annual test, but a systematic, planned programme of exercises that collectively validate the BCMS. This note covers how to build and run that programme.

---

## The Exercise Programme: What ISO 22301 Requires

ISO 22301 Clause 8.5 states:

> *"The organisation shall conduct exercises and tests to validate that its business continuity strategies, solutions, and plans are consistent with its business continuity objectives."*

And further:

> *"The organisation shall conduct exercises based on appropriate scenarios where the assumption is that the arrangements in the plans have been partially or completely disrupted."*

**What this means in practice:**
- Exercises must be planned in advance (exercise programme, not ad hoc)
- Exercises must test actual plans — not hypothetical scenarios disconnected from documented BCPs
- Exercises must be realistic — they must simulate conditions where plans would actually be needed
- Exercise outcomes must be documented
- Gaps identified must be addressed through corrective action
- The exercise programme itself must be reviewed and updated

**ISO 22301 does not mandate specific exercise types or frequencies** — it requires that exercises are appropriate and sufficient. The organisation defines what "appropriate" means based on its BCMS scope, the criticality of its functions, and the maturity of its BCM programme.

---

## The Exercise Spectrum

BCM exercises range from low-intensity discussion-based activities to full operational simulations. Effective exercise programmes use multiple types, increasing in intensity over time.

### Type 1: Document Review and Structured Walkthrough

**What it is**: The BCP owner and key team members review the BCP together, talking through each section, discussing what they would do, and identifying gaps or questions.

**Intensity level**: Very low. No simulation; no time pressure; no systems involvement.

**Duration**: 1–3 hours per plan.

**Who participates**: Plan owner, key staff named in the plan.

**What it tests**: Whether the plan is complete; whether contacts are current; whether procedures are understood; whether assumptions are still valid.

**Outputs**: List of gaps, outdated information, and questions to resolve. Updated BCP following the review.

**When to use**: For new BCPs (first test); for plans that have changed significantly; for minor plans that don't warrant a full simulation; annually as a minimum activity.

**Limitations**: Does not test decision-making under pressure; does not reveal coordination gaps; does not test technical recovery.

---

### Type 2: Tabletop Exercise

**What it is**: A structured facilitated discussion where participants work through a realistic scenario, making decisions as if the disruption were happening.

**Intensity level**: Low-medium. Discussion-based but with realistic scenario pressure.

**Duration**: 2–4 hours.

**Who participates**: BCP owners and key decision-makers for the functions being tested. Crisis Management Team members for major scenarios.

**Scenario structure**: A facilitator presents the initial disruption scenario and then injects escalating complications (the "injects") that force the team to make decisions, allocate resources, and communicate under time pressure.

**Example scenario injects for a ransomware tabletop:**
- T+0: "You have been notified that multiple servers are encrypted. The IT team believes ransomware is active."
- T+30m: "The attack is spreading. IT confirms that the ERP system, email, and file server are affected. Estimated recovery time: unknown."
- T+2h: "A ransom note demands £500K in Bitcoin. The board is asking for a briefing in 30 minutes."
- T+4h: "A journalist has contacted the press office about reports of a cyber incident. How do you respond?"
- T+6h: "The payment processor has called — card transaction processing is offline. This triggers a regulatory reporting obligation."

**What it tests**: Decision-making process; communication between teams; awareness of BCM procedures; gaps in plans; regulatory obligations (who do we notify and when?).

**Outputs**: Facilitated debrief capturing: what worked, what didn't, what questions arose, what gaps were identified, what decisions were made and why.

**When to use**: Annually for all major BCPs; whenever a new crisis scenario type is identified; following a real incident (to process lessons learned through the plan framework).

**Limitations**: Discussions can be theoretical; under real pressure, people behave differently than they expect to; technical recovery is not tested.

---

### Type 3: Functional Exercise

**What it is**: A more operationally realistic exercise that tests specific aspects of the BCP in action — not just discussing what you would do, but actually doing it (in the exercise context).

**Intensity level**: Medium to high.

**Duration**: 4–8 hours (half to full day).

**Who participates**: The teams responsible for executing the specific functions being tested.

**Examples of functional exercises:**
- **Alternate workplace activation**: Staff actually relocate to the alternate workspace or activate remote working, and attempt to perform their normal duties using only the continuity environment.
- **IT failover test**: The IT DR team actually fails over specific systems to the DR environment and validates that recovery works within the stated RTO.
- **Crisis communication exercise**: The communications team actually drafts, approves, and "sends" (in the exercise context) communications to all relevant audiences — media, customers, regulators.
- **Supply chain disruption**: Procurement actually contacts alternate suppliers and goes through the qualification process.

**What it tests**: Whether the strategy and plans actually work when put into practice; whether the alternate workplace/systems/suppliers are viable; whether coordination between teams is effective under realistic conditions.

**Outputs**: Detailed exercise report including: what was attempted, what succeeded, what failed, what the recovery time actually was vs the RTO, gaps identified.

**When to use**: Annually for critical functions; after significant changes to recovery strategies; after a real incident that revealed strategy gaps.

**Limitations**: Requires more planning and resource than tabletop exercises; may have operational impact if not carefully controlled.

---

### Type 4: Full Interruption Test

**What it is**: The actual BCP is fully activated. Real systems are failed over. Real staff relocate. Real operations are conducted through the continuity environment for a defined period.

**Intensity level**: Maximum.

**Duration**: Hours to days (depending on scope).

**Who participates**: All staff involved in the affected functions; Crisis Management Team; IT DR team; facilities.

**What it tests**: Everything. Whether the plan actually works end-to-end; whether RTOs are achievable; whether the continuity environment can handle real operational load; whether staff can function effectively in recovery mode.

**Critical planning requirements:**
- Detailed exercise plan approved by senior management
- Communication to all participants and affected stakeholders before the exercise
- Clear "stop" criteria (conditions under which the exercise is terminated and normal operations restored)
- Back-out plan (how to return to normal operations if the exercise reveals fundamental failures)
- IT DR test as a component (fail specific systems, validate recovery, return to production)

**Example full interruption test scenario**: The organisation declares that its primary London office is unavailable and activates its BCPs. All London staff activate remote working or relocate to the alternate workspace. Critical systems are failed over to the DR environment. The organisation processes real transactions through the continuity environment for 4 hours, then validates recovery metrics (actual vs RTO; data integrity) before returning to normal operations.

**What it tests and typically reveals**: VPN capacity insufficient for all-staff remote access; some critical applications only work on desktop (not laptop); DR database is 2 hours behind production (RPO exceeded); the alternate workspace printer doesn't work; the crisis communications template refers to an obsolete regulatory body.

**Outputs**: Comprehensive exercise report with evidence of actual RTOs achieved, data integrity verification, operational capability assessment, and full gap analysis.

**When to use**: Every 2–3 years for major BCPs; after significant strategic changes; after a real major disruption (to validate that improvements were effective).

**Limitations**: Highest risk; most resource-intensive; requires significant planning and stakeholder management; may be disruptive even when carefully planned.

---

## Designing an Effective BCM Exercise

### The Exercise Planning Process

**Step 1: Define objectives**
What must the exercise achieve? What specific aspects of the BCP are being tested? What questions must the exercise answer?

**Example objectives for a tabletop exercise:**
- Test the Crisis Management Team's decision-making during a cyber incident
- Identify gaps in the regulatory notification procedures
- Test the communication protocols between IT, security, and senior management
- Validate that the crisis communications plan is fit for purpose

**Step 2: Select scenario**
Choose a realistic, plausible scenario relevant to the organisation's risk profile:
- Cyber incident (ransomware, DDoS, data breach)
- Premises unavailability (fire, flood, denial of access)
- Pandemic or mass staff absence
- Supply chain failure
- Technology failure (cloud provider outage, ERP failure)
- Combination scenario (multiple simultaneous disruptions — the most realistic and most revealing)

**Step 3: Design the scenario and injects**
For tabletop and functional exercises, develop:
- Initial situation description
- Sequence of injects (escalating complications)
- Expected decisions at each stage
- "Golden thread" answers (what the ideal response would be — used for debrief comparison)

**Step 4: Identify participants**
Who must participate? Who should observe? Who will facilitate?

**Facilitator role**: The exercise facilitator must be experienced enough to manage group dynamics, probe decisions, inject complications at the right pace, and keep the exercise on track — while not guiding the outcome.

**Observer role**: Observers (senior management, auditors, regulators in some contexts) watch the exercise without participating — valuable for honest assessment without influencing results.

**Step 5: Brief participants**
What do participants need to know in advance? (Typically: the scenario context; their role; what is and is not in scope for the exercise.) Participants should NOT know the specific injects in advance — realistic decision-making under uncertainty is the point.

**Step 6: Conduct the exercise**
- Opening: Facilitator sets the scene, confirms ground rules
- Exercise proper: Injects delivered; decisions made; actions taken
- Stopping conditions: Exercise is paused if a safety issue, a "golden answer" is provided by the facilitator, or the objective has been achieved

**Step 7: Hot debrief (immediately after)**
Within 30 minutes of the exercise ending, while events are fresh:
- What happened? (Factual reconstruction of decisions made)
- What went well?
- What didn't go well?
- What surprised people?
- What questions arose that the plan didn't answer?

**Step 8: Cold debrief (written report)**
Within 2 weeks, a formal exercise report documenting:
- Exercise objectives and scenario
- Key decisions made and their rationale
- Findings (gaps, successes, questions)
- Corrective actions required (specific, owned, with due dates)
- Recommendations for BCP improvements

---

## Capturing and Acting on Lessons Learned

The exercise is only valuable if its findings drive improvement. The lessons learned process:

**Immediate corrective actions (within 2 weeks):**
- Update contacts that were found to be outdated
- Add missing steps to procedures
- Correct obvious errors in the plan

**Short-term improvement actions (within 3 months):**
- Address strategy gaps (e.g. VPN capacity insufficient — initiate procurement of additional capacity)
- Update the BIA for dependencies that were found but not mapped
- Revise RTOs that were found to be unachievable

**Long-term programme improvements (within 12 months):**
- Investment decisions informed by exercise findings (alternate workspace contract; IT DR infrastructure upgrade)
- Changes to the exercise programme (more frequent IT DR tests; different scenario types)
- Training and awareness programme updates

**Tracking corrective actions**: All exercise findings must be tracked through the corrective action process (ISO 22301 Clause 10.1). Each finding: named owner, due date, status tracking. Corrective actions are reviewed at the next management review and at the next exercise.

**Verification**: Before the next exercise, verify that corrective actions from the previous exercise have been completed. At the next exercise, confirm that the improvements actually work.

---

## The Progressive Exercise Programme

An effective exercise programme builds progressively over time — not repeating the same exercise type annually, but developing from simpler to more complex exercises as BCM maturity grows.

**Year 1 (New BCM programme):**
- Walkthrough reviews of all BCPs (identify obvious gaps)
- Tabletop exercise for 1–2 major BCPs
- IT DR test (recover specific systems; validate backup restoration)
- Debrief and corrective action cycle

**Year 2 (Developing programme):**
- Annual tabletop exercises for all major BCPs
- Functional exercise for highest-criticality function (alternate workplace activation or IT full failover)
- Include Crisis Management Team in a major scenario
- Expanded scenario complexity (multi-function; include third-party dependencies)

**Year 3 (Maturing programme):**
- Full interruption test for one critical function
- Tabletop exercises for all other major BCPs
- Supply chain disruption scenario (involving actual suppliers)
- Regulatory notification exercise (practice the 72-hour GDPR notification process)
- Unannounced exercise element (partial surprise to test real-time decision-making)

**Year 4+ (Mature programme):**
- 3-yearly full interruption tests with broader scope
- Multi-scenario exercises (concurrent disruptions)
- Unannounced exercises for specific elements
- External stakeholder participation (regulators, major customers, key suppliers)
- Red team / adversarial simulation for cyber scenarios

---

## Special Exercise Types for Specific Scenarios

### Cyber Incident Exercises

Cyber incidents — particularly ransomware — are among the most likely and most impactful disruptions organisations face. Cyber-specific exercises:

**Ransomware tabletop**: Walk through the full ransomware response — detection, containment, decision (pay or restore), communication, notification obligations, media response, restoration, return to normal.

**Breach response simulation**: Practice the GDPR breach notification process — assembling the facts, writing the ICO notification, deciding on data subject notification, managing internal and external communication.

**Cyber IR + BCM integration exercise**: Test whether the security incident response process and the BCM process are properly coordinated — who declares a continuity event, when, and how does the BCM response complement (not conflict with) the security incident response.

### Pandemic / Mass Absence Exercises

COVID-19 demonstrated that mass staff absence is a realistic and devastating disruption scenario. Exercise elements:

- What happens if 50% of staff are unavailable simultaneously?
- Can critical functions operate with half the normal workforce?
- Do remote working arrangements scale to all staff simultaneously?
- Is the VPN/remote access infrastructure sized for full-staff remote working?

### Supply Chain Disruption Exercises

- Simulate the failure of a critical IT supplier (cloud provider outage, SaaS platform unavailability)
- Practice the alternate supplier activation process
- Test whether alternate suppliers can actually deliver at the required quality and speed
- Exercise the communication with affected customers during supplier-caused disruption

### Unannounced Exercises

Partial or complete unannounced exercises test real-time response — not the response that staff provide when they have had time to prepare:

- Unannounced notification to the Crisis Management Team ("we have a situation — report to the war room in 15 minutes")
- Unannounced activation of the alternate workspace (staff told on the day that the primary office is unavailable)
- Unannounced IT DR test (IT team notified with 30 minutes' warning that a specific system failover test will start)

Unannounced exercises reveal gaps that announced exercises conceal.

---

## Common Mistakes and Failures

**1. Exercises that are too comfortable.**
The facilitator guides participants toward the right answers; difficult decisions are sidestepped; complications are not injected. The exercise produces a feel-good outcome that reveals nothing. Good exercises create realistic discomfort — not enough to be unfair, but enough to reveal how people actually behave under pressure.

**2. Same scenario repeated every year.**
A tabletop on ransomware, run in the same way with the same team, for the third consecutive year. The team knows what to expect; the gaps from last year have been fixed; no new gaps are found. Exercises must evolve — new scenarios, more complex injects, broader participation, different exercise types.

**3. No follow-through on corrective actions.**
Exercise reports are written. Corrective action lists are created. Nobody owns the actions. A year later, the next exercise repeats the same findings. Exercises without corrective action follow-through are expensive documentation exercises.

**4. Key staff not participating.**
The exercise involves BCP owners and deputies — but not the Crisis Management Team. The CMT has never practised together; their first coordinated response is a real crisis. The most important participants to include are the senior leaders who must make decisions under pressure — not just the operational teams who execute plans.

**5. Not testing assumptions.**
The BCP assumes that remote working is possible for all staff. The exercise never tests this. In reality, 30% of staff don't have adequate home internet connectivity; the VPN handles 60% capacity before dropping connections; three critical applications only work on desktop PCs. The assumption was never tested — and it fails catastrophically during the real event.

**6. Over-engineering the exercise.**
Exercises so complex and elaborate that they require months of preparation and produce minimal incremental insight beyond a simpler exercise would have provided. Exercise design should be proportionate to the objective — a tabletop can be immensely valuable with 3 days of preparation; not every exercise needs to be a full-day simulation with external participants and specialist facilitators.

---

## Exercise Report Structure

Every exercise must produce a formal written report:

**Section 1: Exercise Overview**
- Exercise name and date
- Exercise type (tabletop, functional, full interruption)
- Objectives
- Participants
- Scenario summary

**Section 2: Exercise Conduct**
- Summary of how the exercise unfolded
- Key decisions made at each stage
- Timeline (for functional exercises and full interruptions)

**Section 3: Findings**
For each finding:
- Finding description
- Classification (strength / improvement required / gap)
- Evidence (what happened that supports this finding)
- Impact (what would this mean in a real event?)

**Section 4: Corrective Actions**
For each gap or improvement required:
- Action description
- Owner (named individual)
- Due date
- Priority (critical / high / medium / low)

**Section 5: Recommendations**
Broader recommendations for the BCM programme — exercise programme changes, BIA updates, strategy reviews, resource investments.

**Section 6: Approval**
BCM Manager sign-off; senior management review.

---

## Exam Angle

**CISM:**
- Domain 4 (Incident Management) — BCM exercises are specifically tested. Know the four exercise types, the exercise planning process, and the lessons learned requirement.

**CRISC:**
- Domain 4 (Risk and Control Monitoring) — BCM exercises are a form of control testing. The exercise programme validates that continuity controls are effective. Exercise findings feed back into the risk register and treatment plan.

**CISSP:**
- Domain 7 (Security Operations) — BCM exercises are tested in depth. Know the four types (walkthrough, tabletop, simulation, full interruption) and their relative strengths and limitations.

**ISO 27001 Lead Auditor:**
- ISO 27001 A.5.29 requires that information security continuity plans are exercised. Auditors should assess: have BCPs been exercised? How recently? What type of exercise? Were findings documented and acted upon? Was the exercise sufficient to test the plan's effectiveness?

---

## GUARDIAN's Take

The most powerful sentence a BCM professional can say to their board is: "We found these gaps in our last exercise, and here is what we did about them."

That sentence demonstrates three things simultaneously: that the programme is honest (we found real gaps, not a perfect result); that it is improving (we addressed what we found); and that it is operating (we actually ran an exercise and acted on the results).

The boards that worry me are not the ones whose BCM programmes found gaps in exercises. The boards that worry me are the ones whose BCM programmes produce clean exercise reports every year. Because in my experience, no realistic exercise of a real organisation produces a clean result. If the exercise always succeeds without friction, without unexpected decisions, without any gaps — the exercise is not realistic enough.

The goal of the exercise programme is not to pass a test. It is to find the problems before they find you. Every gap identified in an exercise is a crisis prevented. Every corrective action implemented is a capability strengthened. Every exercise conducted is an investment in the organisation's ability to survive the disruptions that will inevitably come.

Exercise honestly. Document what you find. Fix what you find. That is the exercise programme that creates genuine resilience.

---
*Module: Module 8 — Business Continuity | Guardian Curriculum*
