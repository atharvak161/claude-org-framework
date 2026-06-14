---
tags: [oscp-journey, spectre, stage-5, oscp, time-management, exam-strategy]
module: 5
cert-stage: oscp
difficulty: intermediate
date: 2026-04-08
phantom-refs: []
netgod-refs: []
---

# S5-02 — OSCP Exam Time Management

## Why Time Management Is the Differentiator

Technical skill gets you to 60 points. Time management gets you to 70.

The most common failure mode among technically capable OSCP candidates is not inability to exploit machines — it's spending 4 hours on a rabbit hole while the easy machine sits untouched, or running out of time to write the report after successfully rooting everything.

The exam is 23 hours 45 minutes. That sounds like a lot. It isn't, once you account for:
- Time lost to rabbit holes (average 2–4 hours for unprepared candidates)
- Tool setup and VPN issues (30–60 minutes)
- Breaks, meals, bathroom (2–3 hours minimum if you're human)
- Report writing (4–6 hours minimum for a passing report)
- Sleep (if you choose to — recommended after 70 points)

**Effective exploitation time: roughly 14–18 hours.**

---

## The Core Time Allocation Framework

### Hour 0 — Setup (Non-Negotiable)

```
00:00 → 00:05: VPN connected, tun0 IP confirmed, exam dashboard read
00:05 → 00:15: All Nmap scans launched simultaneously on ALL targets
00:15 → 00:30: Read first scan results, launch web enumeration on HTTP ports
                CherryTree nodes created for every machine
```

**Never spend more than 30 minutes on setup.** If a tool isn't working at minute 20, skip it and use an alternative — don't debug tools during the exam.

---

### Hours 0–4 — AD Set (Highest Priority, All-or-Nothing)

The AD set is 40 points. It is the single most valuable target. Attempt it first when you're sharpest.

**Target timeline:**
```
Hour 0–1:   AD Client enumeration and foothold
Hour 1–2:   AD Client → local admin → credential harvest
Hour 2–3:   Lateral movement to Server, enumeration
Hour 3–4:   Server → DA path → DC → proof
```

**Decision gate at Hour 2:**

```
Have you compromised AD Client?
  YES → Continue to Server
  NO  → Switch to Easy standalone, return to AD after
```

**Decision gate at Hour 3:**

```
Do you have a clear path to DC?
  YES → Push to completion (max 1 more hour)
  NO  → Park AD, move to standalones, return at hour 12 with fresh approach
```

**Why park AD and come back:**
The AD set requires all 3 machines. Spending 8 hours on AD and getting Client + Server but not DC = 0 points. Spending 4 hours, getting stuck, doing 2 standalones (40 pts), then returning with fresh eyes = better odds of passing.

---

### Hours 4–10 — Standalone Machines

Work standalones in difficulty order: Easy → Medium → Hard.

**Easy Standalone — Target: 90 minutes**
```
Hour 4–4:30:  Nmap results reviewed, web enumeration running
Hour 4:30–5:  Foothold identified and achieved (user shell)
Hour 5–5:30:  PrivEsc (sudo -l / SeImpersonate / SUID)
Hour 5:30–6:  Root/SYSTEM + proof screenshot collected
```

If no foothold by Hour 5:30 → trigger the 25-minute rule → move to Medium.

**Medium Standalone — Target: 2.5 hours**
```
Hour 6–6:30:  Service enumeration (deeper than Easy)
Hour 6:30–7:  Identify the attack chain (often 2-3 steps)
Hour 7–8:     Execute foothold chain
Hour 8–8:30:  PrivEsc
Hour 8:30–9:  Root + proof
```

If no foothold by Hour 8:30 → move to Hard, return to Medium after.

**Hard Standalone — Target: 3 hours**
```
Hour 9–9:30:  Full enumeration (all services, all ports confirmed)
Hour 9:30–11: Identify and attempt the exploitation path
Hour 11–12:   PrivEsc (often multi-step on Hard)
Hour 12:      Root + proof
```

---

### Hours 10–16 — Push / Mop Up / Return to Stuck Machines

By hour 10 you should have:
- Best case: 70+ points secured (AD set + 2 standalones)
- Good case: 60 points (3 standalones) — need 10 more from AD or a missed flag
- Minimum case: 40–50 points — need to push harder on remaining machines

**At hour 12 — the triage decision:**

```
Count your current points:
  ≥ 70 points: Begin report writing. Continue machine attempts in parallel.
  60–69 points: Identify the fastest path to 10 more points.
                - Any machine with user flag but no root yet?
                - AD Client accessible but Server not?
  < 60 points: You're behind. Don't panic. Methodical enumeration.
               Go back to first principles on stuck machines.
```

---

### Hours 16–20 — Report Writing (Mandatory)

Even if you haven't reached 70 points yet, begin report writing at Hour 16. The report takes longer than you expect, and missing the submission deadline is an automatic fail.

**Report writing blocks:**
```
Hour 16–18: Executive summary + methodology
Hour 18–20: Technical findings (one section per compromised machine)
Hour 20–22: Screenshots, evidence, remediation
Hour 22–23: Proofread, format, export to PDF
Hour 23:    SUBMIT — do not wait for hour 23:45
```

**If you're still finding machines at hour 16:**
- Write report in parallel: one terminal exploiting, one writing
- Prioritise report for machines you've already rooted
- A fully documented finding is worth full points; an undocumented one is not

---

## The 25-Minute Rule — How to Apply It

The 25-minute rule is not "give up after 25 minutes." It is "change approach after 25 minutes of zero progress."

**Zero progress means:**
- No new information discovered
- No measurable step closer to a shell/credential/file
- Running the same commands repeatedly with the same results

**Not zero progress:**
- You confirmed a service is NOT vulnerable (eliminated a vector — that's progress)
- You found a new endpoint (even if you don't know how to exploit it yet)
- You cracked part of an attack chain (e.g., discovered username but not password)

**When 25 minutes triggers — the protocol:**
```
1. Write in CherryTree: "25-min rule triggered on [vector]. Tried: [list commands]"
2. Note what you know: "Port 80 Apache 2.4.49 — CVE-41773 failed (mod_cgi not enabled)"
3. List remaining vectors you haven't tried
4. Move to the next vector OR move to a different machine
5. Set a mental flag: "Return to this with fresh eyes in 1 hour"
```

---

## Machine Time Budgets — The Hard Limits

These are maximum times before you MUST move to the next machine:

| Machine | Foothold Budget | PrivEsc Budget | Total Max |
|---------|----------------|----------------|-----------|
| Easy | 60 min | 30 min | 90 min |
| Medium | 90 min | 45 min | 135 min |
| Hard | 120 min | 60 min | 180 min |
| AD Client | 90 min | 45 min | — |
| AD Server (via Client) | 60 min | 30 min | — |
| AD full set | — | — | 240 min |

**Applying the budgets:**
- If you haven't found a foothold within the foothold budget → move to next machine
- If you have a foothold but can't PrivEsc within the PrivEsc budget → take the user flag, move on, return later
- User flags are 10 points — don't leave them on the table even if you can't root

---

## Parallel Work — Never Wait Idle

The single biggest time multiplier: while any automated scan or tool is running, you should be working something else manually.

**Parallel work examples:**

| Running in background | Working in foreground |
|----------------------|----------------------|
| Nmap full port scan | Manually enumerate quick scan results |
| Gobuster medium wordlist | Read quick gobuster results, test web app manually |
| hashcat cracking | Enumerate another service |
| LinPEAS running | Check sudo -l, SUID manually |
| BloodHound collecting | Check SMB shares manually |

**Setup:**
```bash
# Split terminal: tmux or multiple terminal tabs
# Terminal 1: Main working shell (active exploitation)
# Terminal 2: Background scans (nmap full, gobuster)
# Terminal 3: Listener (nc -lvnp PORT — always running)
# Terminal 4: Note-taking reference (CherryTree)
```

---

## Sleep Strategy

23h 45m is too long to operate at peak cognitive performance without sleep. Fatigue causes:
- Missing obvious vulnerabilities
- Making errors in exploit modification
- Poor decision-making on time allocation
- Mistakes in report writing

**Recommended sleep block:**
```
After securing 70+ points OR at hour 14, whichever comes first:
→ Sleep 4–5 hours
→ Set alarm
→ Wake up and verify flags are still submitted
→ Attempt remaining machines with fresh eyes
→ Write/finish report
```

**If you can't sleep (anxiety is normal):**
- Take a 30-minute walk
- Do something completely non-exam for 20 minutes
- Eat a proper meal
- The mental reset is worth the time

---

## The Comeback Pattern — From 50 Points at Hour 16

This is recoverable. Here's how:

```
Hour 16: You have 50 points (Easy + Medium rooted, AD and Hard stuck)

Step 1: Review your notes on stuck machines
  - What have you actually tried?
  - What haven't you tried?
  - Is there a port you dismissed as "probably nothing"?

Step 2: Re-read every service banner from your Nmap output
  - Version number you haven't searchsploited?
  - Service on an unusual port you haven't fully enumerated?

Step 3: Try 1 fresh approach on the AD set
  - Did you try AS-REP roasting without credentials?
  - Did you spray passwords against discovered usernames?
  - Is the web app on the Client machine fully enumerated?

Step 4: Attempt Easy machine privesc again
  - Run LinPEAS fresh and read it fully
  - Check capabilities: getcap -r / 2>/dev/null
  - Check pspy64 output for 5 minutes

Step 5: Write excellent report for 50 points you have
  - 50 well-documented points = higher chance of partial credit
  - Report quality can make the difference on borderline cases
```

---

## Energy Management

**Food and hydration:**
```
Pre-exam: Full meal 1 hour before
Hour 4: Light snack, coffee/tea if needed
Hour 8: Full meal (don't skip)
Hour 14: Snack
Hour 20: Light meal before finishing report
```

**Avoid:**
- Energy drinks in the first 4 hours (crash mid-exam)
- Heavy meals during intense work phases (blood sugar crash)
- Skipping meals entirely (cognitive degradation)
- Caffeine after hour 16 if you plan to sleep

---

## The Report Countdown Timer

Start a visible countdown at exam hour 23h45m → exam end. Then at report start → 24h deadline.

```bash
# Countdown timer in terminal (hours:minutes):
# Install: sudo apt install termdown
termdown 23h45m    # Exam countdown

# After exam ends:
termdown 24h       # Report deadline countdown
```

Alternatively, set phone alarms at:
- Hour 12: "Triage — count your points"
- Hour 16: "Begin report writing"
- Hour 20: "Report should be complete"
- Hour 22: "Final review"
- Hour 23: "Submit report NOW"

---

## Quick Reference — Time Allocation Summary

```
Hour 0–0:30    Setup and all scans launched simultaneously
Hour 0–4       AD Set (40 points — all or nothing)
Hour 4–6       Easy standalone
Hour 6–9       Medium standalone  
Hour 9–12      Hard standalone OR return to AD if stuck
Hour 12        Triage: count points, identify fastest path to 70
Hour 12–16     Mop up remaining machines
Hour 16        BEGIN REPORT (non-negotiable start time)
Hour 16–22     Report writing (concurrent with any remaining attempts)
Hour 22–23     Final report review
Hour 23        SUBMIT — do not wait for the deadline
```

---

## Common Time Management Mistakes

> [!warning] Time management mistakes that fail OSCP candidates
> 1. **Not launching all Nmap scans simultaneously at hour 0.** Candidates who scan sequentially waste 30–60 minutes waiting for scans. Launch all machines in parallel immediately.
> 2. **Spending 5+ hours on the AD set when stuck.** The AD set is all-or-nothing. If you're not making progress, park it and take standalone points. Return with fresh eyes.
> 3. **Not taking user flags before moving on.** If you have a low-priv shell, collect the user flag (10 points) before spending hours on PrivEsc. 10 points is 10 points.
> 4. **Starting report writing at hour 20.** 4 hours is not enough for a complete report. Start at hour 16 or earlier.
> 5. **Not sleeping.** Cognitive performance after 18 hours of continuous work drops dramatically. The machines that seemed impossible at hour 18 often yield at hour 4 after sleep.
> 6. **Not applying the 25-minute rule.** Candidates who ignore the rule routinely spend 3–4 hours on a single rabbit hole. Apply it without exception.

---

## Practice Resources

| Resource | What to Do |
|----------|-----------|
| HTB Pro Labs — Dante | Practice the full time allocation on a real multi-machine network |
| OSCP Practice Exam (OffSec) | Take it exactly as the real exam — strict time limits, no hints |
| Mock exam (self-imposed) | Pick 5 HTB machines (1 Easy, 1 Medium, 1 Hard, 2 AD), set 24-hour timer |
| TJ Null's OSCP list | Work through machines with self-imposed time limits to build speed |
