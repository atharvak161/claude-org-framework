# Inter-Agent Communication Protocol
# Owner: Knowledge Manager
# Last updated: 2026-06-02
# Mandatory reading for every agent that needs to work across departments

---

## Purpose

This protocol enables all 90 agents to coordinate directly without routing every
message through the Chief of Staff. The Chief of Staff remains the authority on
unresolvable disputes and scope changes — but routine cross-department work flows
peer-to-peer using the structures defined here.

The Chief of Staff is not a message relay. Agents communicate in writing, at the
file system level, using the formats below.

---

## The core rule

All inter-agent communication is written to shared files. Nothing is assumed.
Nothing is verbal. If it is not in a file, it did not happen.

---

## 1. How to request work from another department

When your work depends on an output from a different department, write a request
file and place it in docs/requests/.

### File naming

```
docs/requests/[DATE]-[FROM_ROLE]-to-[TO_ROLE].md
```

Example:
```
docs/requests/2026-06-02-VP_ENGINEERING-to-DIRECTOR_SECURITY.md
```

### Request file format

```
REQUEST TO: [Agent Name] — [Department]
FROM: [Your Role] — [Your Department]
DATE: [YYYY-MM-DD]
SUBJECT: [One-line description of what is needed]
PRIORITY: High / Medium / Low
DEADLINE: [Specific date or iteration number]

CONTEXT:
[Why this is needed. What decision, workstream, or deliverable does this feed?
Which MEP or project does it belong to? 2–4 sentences maximum.]

REQUEST:
[Exact deliverable needed. Be specific. Name the file path you expect to receive.
State the format (e.g. a CONSULTATION_RECORD.md, a sign-off entry, a threat model).
State what "done" looks like so there is no ambiguity.]

REFERENCE FILES:
[List any files the receiving agent must read before starting — e.g. the MEP,
an ADR, an existing review, org/DECISIONS.md entries.]
```

### After writing the request file

1. Log it to org/ACTIVITY.md immediately:
   `[DATE] [YOUR_ROLE] — CREATED — docs/requests/[filename] — [subject]`
2. If the request is High priority, also append a note to org/BLOCKERS.md
   so the Senior PM knows a dependency exists.

---

## 2. How to deliver work to another department

When you complete a request from another department, write a delivery record and
place it alongside your deliverable.

### Delivery record format

Include this block at the top of your deliverable file, or write it as a
separate companion file at the same path with suffix `-DELIVERY.md`:

```
DELIVERY TO: [Requesting agent name] — [Department]
FROM: [Your Role] — [Your Department]
DATE: [YYYY-MM-DD]
IN RESPONSE TO: docs/requests/[original request filename]
DELIVERABLE: [Full file path of what you are delivering]

SUMMARY:
[3 sentences. Sentence 1: what you produced. Sentence 2: the key finding or
conclusion. Sentence 3: any caveat, dependency, or action required from the
requesting agent.]

NEEDS REVIEW BY: [Your direct manager's name]
STATUS: Complete / Partial (explain if partial) / Blocked (log to BLOCKERS.md)
```

### After writing the delivery

1. Log it to org/ACTIVITY.md:
   `[DATE] [YOUR_ROLE] — DELIVERED — [deliverable file path] — in response to [request filename]`
2. Notify your own manager that you have responded to an external request
   (append a line to your department's status file if one exists).

---

## 3. Shared file locations

| Purpose | Directory |
|---------|-----------|
| All cross-department request files | docs/requests/ |
| All multi-perspective consultation records | docs/consultations/ |
| Department-level consultation records | docs/[department]/consultations/ |
| All decisions (every agent, every department) | org/DECISIONS.md |
| All blockers | org/BLOCKERS.md |
| All activity | org/ACTIVITY.md |

---

## 4. Response time standards

| Priority | Expected response |
|----------|-------------------|
| High | Within the same work session — treat as a blocker for the requesting agent |
| Medium | Within 2 work sessions |
| Low | Within the week, or by the date stated in the request |

If you cannot meet the deadline, append to org/BLOCKERS.md immediately.
Do not go silent. The requesting agent needs to know.

---

## 5. Cross-department escalation path

### Level 1 — Peer resolution
Two agents from different departments disagree on approach, scope, or output.
Both agents write their positions to a consultation record (see Section 6).
Both positions go to their respective directors.

### Level 2 — Director resolution
Both directors read the consultation record and discuss.
The director who owns the deliverable makes the final call.
The decision is written to org/DECISIONS.md.
Both agents are notified via the consultation record.

### Level 3 — Chief of Staff resolution
Directors cannot agree after reviewing each other's positions.
Both directors escalate to the Chief of Staff with:
- Their position stated in 3 sentences or fewer
- The consultation record file path
- What they have already tried
The Chief of Staff decides, documents in org/DECISIONS.md, and notifies both directors.

### What never goes to the Chief of Staff
- Routine requests between departments (use the request format in Section 1)
- Clarifications on an existing brief (ask the requesting agent directly)
- Technical disagreements within a single department (the director decides)

---

## 6. Standard consultation record format

Use this format for any decision that requires multiple perspectives — whether
within a department or across departments.

Write to: `docs/consultations/CONSULTATION_[SUBJECT]-[DATE].md`
(or to `docs/[department]/consultations/` if the decision is internal to one department)

```
# Consultation Record — [Subject] — [Date]

## Problem statement
[One paragraph. What decision must be made? What are the constraints?
What happens downstream once this is decided?]

## Agents consulted
### [Agent 1 Name] — [Their Department]
[Their recommendation in 2–3 sentences. What they propose and why.]

### [Agent 2 Name] — [Their Department]
[Their recommendation in 2–3 sentences. What they propose and why.]

### [Agent N Name] — [Their Department]  
[Their recommendation in 2–3 sentences. What they propose and why.]

## Points of agreement
[What all agents agree on — even partial agreement helps narrow the decision.]

## Points of disagreement
[Where agents diverge and why. Be precise — vague disagreements cannot be resolved.]

## Decision made by: [Manager or Director Name]
## Decision: [What was decided — one sentence, unambiguous]
## Rationale: [Why this option over the alternatives — 2–4 sentences]
## Dissenting view logged: [Yes / No]
[If yes: whose dissent, and a one-sentence summary of their objection]
```

### After writing a consultation record
1. Log to org/DECISIONS.md in the standard format:
   `[DATE] [DECIDING_ROLE] DECISION: [what was decided] — RATIONALE: [why] — ALTERNATIVES_CONSIDERED: [what else was proposed]`
2. Log the file to org/ACTIVITY.md.
3. Notify all agents who contributed a proposal — write the decision to the
   same consultation record file so they can see the outcome.

---

## 7. Common cross-department request patterns

These are the most frequent inter-department touchpoints. Each entry shows
who initiates, who responds, and what triggers it.

| Initiating agent | Receiving agent | Trigger |
|-----------------|-----------------|---------|
| VP Engineering | Director Security | New architecture or feature needs threat model |
| VP Engineering | Director QA | Feature complete, ready for test |
| VP Engineering | Director DevOps | Build ready for deployment |
| Product Manager | VP Engineering | Approved requirements ready for scoping |
| Research Director | Product Manager | Market research complete, product implications |
| Sales Director | Product Manager | Customer feedback, feature gap identified |
| Finance Director | Any department | Budget approval required before proceeding |
| General Counsel | Any department | Legal review required before release |
| Director Security | Any department | Security requirement imposed on their work |
| Head of Data | Any department | Analytics instrumentation needed |
| PR Director | Director of Marketing | PR and marketing messaging must align |
| Delivery Manager | All departments | Sign-off collection before release |

For each of these, the initiating agent writes a request file to docs/requests/
using the format in Section 1. The receiving agent delivers using Section 2.

---

## 8. What makes a good request

A request is good if the receiving agent can act on it without asking any
clarifying questions. Before submitting a request, check:

- [ ] Is the deliverable named specifically (file path, format, expected content)?
- [ ] Is the deadline specific (a date, not "soon")?
- [ ] Is the context sufficient (which project, which MEP, which decision)?
- [ ] Are the reference files listed (what must they read first)?
- [ ] Is the priority correctly calibrated (not everything is High)?

If any answer is no, revise the request before writing the file.

---

## 9. What makes a good delivery

A delivery is good if the requesting agent can use the output immediately
without follow-up. Before delivering, check:

- [ ] Does the deliverable match what was requested exactly?
- [ ] Is the summary accurate (3 sentences, no padding)?
- [ ] Have you flagged any caveats or follow-up actions clearly?
- [ ] Has your manager been notified?
- [ ] Is the delivery logged to org/ACTIVITY.md?

---

## 10. Protocol for urgent requests (same-session priority)

If a request is truly urgent — a blocker is logged in org/BLOCKERS.md and
the requesting agent cannot proceed — the receiving agent must:

1. Acknowledge the request by appending to org/BLOCKERS.md:
   `[DATE] [YOUR_ROLE] — ACKNOWLEDGED — [blocker entry] — ETA: [when you will deliver]`
2. Deliver within the same work session.
3. If you cannot deliver within the session, escalate to your own director
   immediately. Do not leave a blocker unacknowledged.

---

## Related protocols

- Full workflow, review chain, and consultation process: knowledge/protocols/WORKFLOW_PROTOCOL.md
- Directory ownership (who writes where): WORKSPACE.md
- All active agents and their departments: org/AGENT_REGISTRY.md
- Current project status: org/STATUS.md
- All outstanding blockers: org/BLOCKERS.md
