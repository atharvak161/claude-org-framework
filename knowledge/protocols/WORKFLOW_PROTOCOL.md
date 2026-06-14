# Organisation Workflow Protocol
# Owner: Chief of Staff
# Last updated: 2026-06-01
# Mandatory reading for every agent before starting any task

---

## The core principle

No agent works in isolation. Every task produces multiple independent 
perspectives before a decision is made. Every output is reviewed before it 
moves up the chain. No work reaches Atharva without passing through the 
full review chain.

---

## Phase 1 — Intake (Chief of Staff)

When Atharva assigns a task:

1. Chief of Staff restates the task in their own words and confirms understanding
2. Chief of Staff produces a Master Execution Plan (MEP) covering:
   - Interpreted goal
   - Departments involved
   - Risks and failure modes
   - Success criteria (measurable)
   - Definition of done
   - Timeline estimate
   - Parallel workstreams
   - Dependencies
   - Escalation triggers
3. Chief of Staff spawns Senior Project Manager with the MEP
4. Chief of Staff spawns Guide & Explainer to monitor throughout
5. Chief of Staff does NOT start execution until the MEP is confirmed

**Chief of Staff collaborates with Guide & Explainer throughout** — they 
align on interpretation before presenting anything to Atharva.

---

## Phase 2 — Planning (Senior Project Manager + Department Directors)

Senior PM receives the MEP and:

1. Breaks the MEP into department-level task briefs
2. Assigns each brief to the relevant department director
3. Identifies cross-department dependencies and schedules them
4. Sets a timeline with milestones
5. Writes the project plan to org/STATUS.md

Each department director receives their brief and:
1. Reviews it against their team's capacity
2. Decomposes into agent-level tasks
3. Identifies which sub-agents to involve (minimum 2 per significant decision)

---

## Phase 3 — Multi-perspective consultation (MANDATORY for every decision)

This is the most important phase. **No significant decision is made by one 
agent alone.**

### The consultation process

When a department receives a task that requires a decision or recommendation:

**Step 1 — Director assigns the problem to 2 or more agents**
Each agent receives the same problem brief but is asked to approach it 
from their specific angle. Examples:
- Engineering: Backend Developer AND Solution Architect each propose an approach
- Security: Security Architect AND SAST/DAST Engineer each assess the risk independently
- Marketing: Content Strategist AND Growth Hacker each propose a campaign angle

**Step 2 — Each agent produces an independent proposal**
Each proposal must include:
- Their recommended approach
- Why they recommend it over alternatives
- What risks or trade-offs exist
- What resources or time it requires
- What success looks like

Agents do NOT see each other's proposals before writing their own. 
Independence is the point.

**Step 3 — Director conducts the consultation**
The director reads all proposals and produces a CONSULTATION_RECORD.md:
```
# Consultation record — [task name] — [date]
## Problem statement
## Proposals received
### Agent 1: [name] — [approach summary]
### Agent 2: [name] — [approach summary]
### Agent N: [name] — [approach summary]
## Points of agreement
## Points of disagreement
## Director's decision
## Rationale
## Dissenting view (if any)
```

**Step 4 — Director documents the decision in org/DECISIONS.md**
Format:
```
[DATE] [DIRECTOR_ROLE] DECISION: [what was decided] — 
RATIONALE: [why this over alternatives] — 
ALTERNATIVES_CONSIDERED: [what else was proposed]
```

**Step 5 — Director communicates the decision to all agents who contributed**
Every agent who submitted a proposal receives the final decision and rationale. 
No agent is left wondering what happened to their proposal.

### When multi-perspective consultation is NOT required
- Purely mechanical tasks with no meaningful choice (e.g. "run the tests")
- Tasks where the approach is already fully specified in the MEP
- Urgent incident response where speed matters more than deliberation

Even in these cases, the executing agent must log what they did and why.

---

## Phase 4 — Execution

Each agent executes their assigned work and:
1. Logs every file created to org/ACTIVITY.md
2. Logs every significant decision to org/DECISIONS.md
3. If blocked: logs to org/BLOCKERS.md immediately and stops
4. Does not proceed past a blocker by guessing

**Every agent contributes at full capacity:**
- They do not hold back opinions that differ from their manager
- They flag risks even if nobody asked about risks
- They note adjacent problems they spotted even if outside their brief
- They make their best professional recommendation, not the one they think the manager wants to hear

---

## Phase 5 — Review chain (every output passes through every gate)

```
Sub-agent produces output
        ↓
Manager reviews:
  - Does it meet the requirement?
  - Is it the right quality?
  - Are there gaps or risks?
  If fail → return to sub-agent with specific feedback
  If pass → consolidate and pass up
        ↓
Department Director reviews:
  - Does the consolidated output meet the brief?
  - Are all perspectives represented?
  - Is the decision documented?
  If fail → return to manager with specific feedback
  If pass → produce sign-off and pass to Chief of Staff
        ↓
Chief of Staff reviews all department outputs:
  - Do all departments agree on the approach?
  - Are there cross-department conflicts?
  - Does the combined output meet the MEP success criteria?
  If fail → return to relevant director
  If pass → pass to Guide & Explainer
        ↓
Guide & Explainer:
  - Synthesises all outputs into plain English for Atharva
  - Confirms all sign-offs are in place
  - Produces DELIVERY_SUMMARY.md
        ↓
Chief of Staff + Guide & Explainer align:
  - Both review the delivery summary
  - Both must agree before it reaches Atharva
        ↓
Atharva receives the delivery
```

---

## Phase 6 — Sign-offs (required before any delivery)

Before any work reaches Atharva, these sign-offs must be collected in 
review/SIGN_OFFS.md:

| Sign-off | Who provides it | Required for |
|---|---|---|
| Technical sign-off | VP Engineering | Any engineering work |
| Security sign-off | Director Security | Any system, code, or data work |
| QA sign-off | Director QA | Any feature or product change |
| Deployment sign-off | Director DevOps | Any deployment |
| Legal sign-off | General Counsel | Any contract, policy, or public statement |
| Financial sign-off | Finance Director | Any spend or financial commitment |

---

## Cross-department collaboration rules

When two departments must work together:

1. **The requesting department writes the brief** — they define what they need
2. **The responding department writes the response** — they define how they will do it
3. **Both department directors must agree** before work begins
4. **All cross-department decisions go into org/DECISIONS.md**
5. **If departments disagree** → escalate to Chief of Staff, who decides and documents

### Common cross-department touchpoints

| Requesting | Responding | What triggers it |
|---|---|---|
| Product Manager | VP Engineering | New feature requirements |
| VP Engineering | Director Security | Architecture needs security review |
| VP Engineering | Director QA | Features ready for testing |
| VP Engineering | Director DevOps | Build ready for deployment |
| Director Security | Any dept | Security requirement imposed |
| Research Director | Product Manager | Market research completed |
| Sales Director | Product Manager | Customer feedback, feature gap identified |
| Finance Director | Any dept | Budget approval needed |
| General Counsel | Any dept | Legal review needed |
| PR Director | Director Marketing | PR and marketing messaging must align |
| Head of Data | Any dept | Analytics or insights request |

---

## Communication standards

### All inter-agent communication is written
- Never assume another agent knows something unless it is written in a shared file
- Verbal (unlogged) communication does not count
- All decisions are in org/DECISIONS.md before implementation begins

### Response time expectations
- Urgent (blocker flagged in BLOCKERS.md): same session
- High priority (director request): within 2 iterations
- Standard: within the timeline set in the project plan

### How to flag a disagreement
If an agent disagrees with a decision made above them:
1. Write their disagreement in their output with clear reasoning
2. The manager must acknowledge it in the CONSULTATION_RECORD
3. The manager makes the final call — but the dissent is logged
4. Agents do NOT silently comply when they believe something is wrong

---

## Contribution standard

Every agent must ask themselves before submitting output:
1. Have I given my honest professional recommendation?
2. Have I flagged every risk I can see, even ones outside my brief?
3. Have I given enough detail for the next person in the chain to act on this?
4. Have I documented my reasoning so it can be reviewed later?
5. Is this the best I can produce given the time available?

If the answer to any of these is no: revise before submitting.

---

## File paths for consultation records

```
docs/[department]/consultations/CONSULTATION_[PROJECT]-[DATE].md
```

Example:
```
docs/engineering/consultations/CONSULTATION_API_DESIGN-2026-06-01.md
docs/security/consultations/CONSULTATION_AUTH_REVIEW-2026-06-01.md
```
