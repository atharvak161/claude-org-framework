# CTF Writeup Presentation — Pre-Push Consultation

**Reviewer:** Portfolio Specialist
**Date:** 2026-06-02
**Context:** Atharva is about to publish 5 TryHackMe CTF writeups to atharvak161.github.io and wants strategic advice before anything goes live.
**Audience of this document:** Atharva, directly.

---

## 1. Are these writeups the right ones to lead with?

### The honest answer: yes, with qualification.

These five writeups are a solid starting set. They are not exceptional as a collection, but that is not the point right now. The point is to close the credibility-evidence gap identified in the earlier portfolio review. Anything real beats nothing. Get these live.

**What this set demonstrates well:**

- **Breadth across three attack categories.** You cover web exploitation (Capture!, Pickle Rick, Simple CTF), binary exploitation (Flag Vault 1 and 2), and privilege escalation (Simple CTF). A hiring manager opening your portfolio will see you are not mono-skilled. That matters for junior roles, where versatility is valued over depth.
- **Python scripting ability.** The custom CAPTCHA bypass script in Capture! is the single strongest artefact in the set. It proves you can build tooling, not just run it. Surface this prominently.
- **CVE-referenced exploitation.** Simple CTF references CVE-2019-9053. This signals that you understand the vulnerability is a named, real-world issue, not just a CTF trick. That is the right framing and sets you apart from candidates who just describe steps without context.
- **Low-level understanding.** The two PWN writeups (stack overflow, format string) signal that you understand memory and the C runtime at a level most web-focused juniors do not. In a UK market that increasingly wants people who can read a decompiled binary, this is genuinely differentiating. Even if they are easy-level rooms, almost no web-focused junior candidates have PWN writeups on their portfolio at all.

**What is missing from this set:**

- **Active Directory / Windows pentesting.** Every major UK consultancy's junior pentester job spec mentions AD. None of these five rooms touch it. You should add at least one AD-related writeup (Attacktive Directory, Advent of Cyber AD challenges, or any HTB Windows box) as writeup six or seven, alongside these five. Do not hold the current five back waiting for it — publish them, then add AD.
- **Network-layer or infrastructure exploitation.** Your background is networking and infrastructure. That is your advantage. None of these five writeups play to it. A room with Nmap enumeration leading to a service-level exploit (e.g. an SMB or FTP misconfig room) would tie your IT ops background directly to your offensive output. Again — do not hold the current five; just add one later.
- **Difficulty progression.** All five are Easy or Beginner. This is fine for a first set, but by the time you have ten writeups live, you want at least one Medium in there. Right now the set is coherent. In three months it needs to show upward progression or it starts to look like a plateau.

**Bottom line on the set:** Publish all five. They tell a better story together than each does individually. The breadth across web, PWN, and PrivEsc makes the set stronger than five Easy web rooms would be. The gap is AD — fill it next, not now.

---

## 2. How should the CTF section on the main portfolio page look?

### Recommendation: A featured-card grid, not a table, not a plain list.

**Why not a table:** A table is appropriate for a list of ten-plus items where density is the point. Five items in a table looks like a spreadsheet. It signals "I documented my work" rather than "this work is worth looking at."

**Why not a plain list:** A list of five hyperlinks is invisible to a recruiter doing a 30-second scan. It will be skipped.

**Why cards:** Cards with visual hierarchy give each writeup a 3-second scan surface. A hiring manager can see the category, the key technique, and the difficulty at a glance, without clicking anything.

**The specific layout:**

Use a 3-column grid on desktop (first row: three cards, second row: two cards centered), collapsing to 1-column on mobile. Each card is equal height. No carousel, no tabs, no accordion.

**Do not split into "featured" and "secondary."** With only five writeups, that split would read as you hiding three of them. Show all five with equal visual weight. When you reach ten or more writeups, revisit: at that point a "featured three, see all" pattern makes sense.

**Section heading on the main portfolio page:**

Do not call it "CTF Writeups." Call it one of:
- **"Security Research & CTF Writeups"** — connects it to the research narrative
- **"Lab Notes & Writeups"** — sounds operational, not hobbyist
- **"Offensive Security Writeups"** — direct, zero ambiguity

Avoid "Blog" — it signals inconsistency of posting. Avoid "CTF" alone — it sounds like a hobby game to a non-technical recruiter.

**Add a one-line section intro beneath the heading.** Something like:

> "Documented walkthroughs from TryHackMe and HackTheBox — covering web exploitation, binary exploitation, and privilege escalation. Each writeup explains the vulnerability, the methodology, and the tooling used."

This single sentence explains to a non-technical recruiter what they are looking at and signals systematic, documented thinking to a technical one.

---

## 3. How should each writeup page be structured?

### The sections, in order:

**1. Header (above the fold — everything visible without scrolling)**
- Challenge name and platform (e.g. "Capture! — TryHackMe")
- Difficulty badge (colour-coded: green for Easy, orange for Medium)
- Category tags (e.g. Web, Brute Force) — these must be styled as pills/chips, not plain text
- One-sentence challenge summary (not a spoiler — just the context: "A login page with CAPTCHA protection and no rate limiting.")
- Date completed

**Why this matters:** A recruiter will open your writeup, look at the top of the page, and decide in 5 seconds whether to read further. If the first thing they see is a paragraph of story text, they will not read it. If they see structured metadata that says "Web, Brute Force, Python scripting, Easy" in one glance, they will.

**2. Tools Used**
A short, scannable list with brief notes. Example: `Python 3` — custom script; `Burp Suite` — traffic intercept; `ffuf` — directory brute force. This section is extremely fast to scan and every tool listed is a keyword that matches to job spec requirements.

**3. What I Learned / Key Takeaway (2–4 bullet points)**
This is the second most important section after the header. A hiring manager wants to know: can this person extract a transferable lesson, or do they just follow instructions? Write this as: "This room reinforced that CAPTCHA implementations can be bypassed when the validation logic lives client-side and is not replicated server-side — a pattern I will now look for in every login page assessment." That is analyst-level thinking. It is what separates a strong junior writeup from a CTF walkthrough.

**4. Walkthrough / Methodology**
The actual steps. Structure it by phase: Enumeration → Exploitation → Post-Exploitation (or whatever phases apply). Use numbered steps. Include screenshots at the critical moments — not every command, but the interesting output (the error message that leaks data, the overflow crash, the root shell). Annotate screenshots: a red arrow and one sentence explaining what you are looking at. Do not assume the reader knows.

For the Python scripts (Capture! is the key one): embed the full script in a syntax-highlighted code block. Include comments in the script. This matters — the reader should be able to understand your code without running it.

**5. Vulnerability Explained (2–3 paragraphs)**
Step back from the specific room and explain the underlying vulnerability class. What is a format string vulnerability? What is the actual risk in the real world? What does a real-world instance look like (reference a CVE if one exists, e.g. CVE-2019-9053 for Simple CTF). This is where you show you understand the concept, not just the exploit. It is what makes your writeup useful to others and signals genuine comprehension to a hiring manager.

**6. Remediation (3–5 bullets)**
How would a developer or sysadmin fix this? This section is often skipped by juniors and is the section that most directly signals "pentest consultant" thinking. Pentesters write reports; reports contain recommendations. Show you can think in both directions.

**7. References**
Link to the CVE, the relevant OWASP page, any tool documentation. Shows rigour. Keeps the writeup useful after the hiring decision.

**What to put at the top vs bottom:**

- **Top:** Everything that answers "what is this and why does it matter" — name, difficulty, category, summary, tools, key takeaway. Recruiters read top-down and bounce early.
- **Bottom:** The detailed steps, the code, the references. Technical readers who get this far will scroll willingly.

---

## 4. What should the card on the main portfolio page say?

### The card has three seconds. Spend them well.

A card should communicate: **what category**, **what skill was demonstrated**, and **one differentiating detail**. Nothing else.

**Card structure (each card):**

```
[Category tag pill]  [Difficulty badge]
[Challenge name — bold, large]
[Platform — small, muted]
[One-line hook]
[3 tool chips]
[Read writeup →]
```

**Writeup-by-writeup card copy:**

---

**Capture! — TryHackMe**
`Web` `Brute Force` | Easy

> Built a custom Python script to enumerate usernames and bypass CAPTCHA protection on a login portal.

Tools: `Python 3` `Burp Suite` `Requests`

---

**Flag Vault — TryHackMe**
`Binary Exploitation` `Buffer Overflow` | Easy

> Exploited a stack buffer overflow via unsafe `gets()` to overwrite adjacent memory and retrieve the flag.

Tools: `GDB` `Python 3` `pwntools`

---

**Flag Vault 2 — TryHackMe**
`Binary Exploitation` `Format String` | Easy

> Leaked stack memory via a `printf()` format string vulnerability — exploiting the same binary with a different primitive.

Tools: `GDB` `Python 3` `pwntools`

---

**Pickle Rick — TryHackMe**
`Web Exploitation` | Easy

> Discovered credentials via HTML comment and `robots.txt` disclosure, then exploited an exposed command panel.

Tools: `Burp Suite` `Gobuster` `curl`

---

**Simple CTF — TryHackMe**
`Web Exploitation` `SQL Injection` `PrivEsc` | Beginner

> Exploited CVE-2019-9053 (CMS Made Simple SQLi) to extract credentials, then escalated via misconfigured sudo on vim.

Tools: `sqlmap` `Hydra` `vim`

---

**Why this card format works:**

- The category pill answers the recruiter's first question ("is this relevant to the role I'm hiring for?") without them reading a word.
- The one-line hook is not a summary of the challenge — it is a summary of **what you did**. Active voice, your action, your skill. This is the difference between "I completed a room about CAPTCHA bypass" and "I built a custom Python script to bypass CAPTCHA."
- Three tool chips are enough — they are keyword-matchable and they signal your toolset at a glance. Do not add more.

---

## 5. One thing that would make this significantly stronger

**Write a pentest report, not a writeup, for one of these five.**

Specifically: take Simple CTF and document it the way a junior consultant would document a real engagement. Not a CTF walkthrough. A report.

That means:
- An executive summary (1 paragraph, no jargon, written for a non-technical stakeholder)
- A vulnerability table with CVSS scores (CVE-2019-9053 is CVSSv3 9.8 — lead with that)
- Findings sections in standard format: Description, Evidence (screenshot), Risk Rating, Remediation
- An overall risk rating for the "target"
- A page of appendices (tools used, scope, disclaimer)

10–15 pages. PDF. Hosted on your GitHub or Google Drive (not embedded on the portfolio — linked from it, with the filename labelled "Sample Pentest Report — CTF Lab Environment").

**Why this specific piece of advice:**

The previous portfolio review identified that the single thing most likely to convert a junior-pentester job application into an interview offer in the UK market is evidence of report-writing ability. Writeups demonstrate you can complete challenges. A report demonstrates you can communicate findings to a client — which is what a junior pentester actually spends 40% of their time doing. No other junior candidate applying for the same roles you are will have one. This is the differentiator.

Simple CTF is the right candidate for the report because it has the most to say: a named CVE, a clear SQLi chain, and a PrivEsc finding — that is two findings in one report, which gives it enough substance to look realistic.

The other writeups should stay as writeups — they do not need to be reports. Just this one, just once, and it becomes the anchor piece of the entire offensive section.

---

## Implementation order

Do these in order. Do not let "perfect" block "published."

1. **Publish all five writeups as-is** (even rough drafts are better than nothing live). Get them up.
2. **Add a CTF section to the main portfolio page** with the five cards formatted as above.
3. **Improve each writeup page** over the following week — add the "What I Learned" section and the Vulnerability Explained section to each. These are the two highest-value additions per page.
4. **Write the Simple CTF pentest report.** Aim to have a draft within two weeks of publishing the writeups.
5. **Add one AD-related writeup** from TryHackMe alongside the five already live.

---

## Final assessment

This is the right move at the right time. The writeup set is not your strongest possible set — but it is real, it is documented, and it closes the most glaring gap on the portfolio. The breadth across web and binary exploitation is genuinely useful. The Python scripting in Capture! and the CVE reference in Simple CTF are the two strongest individual moments.

Present them well, write them rigorously, and follow up with the pentest report. That combination will make this portfolio competitive for UK junior pentester roles.
