# CTF Writeups — Career Impact Consultation
**Prepared for:** Atharva  
**Date:** 2026-06-02  
**Context:** 5 TryHackMe writeups about to be published on portfolio website; actively applying for junior pentester roles in the UK

---

## Bottom line up front

These 5 writeups are a net positive — do not second-guess publishing them. The risk is not having them, not having them. The work you need to do is in the *framing*, not the content. Done correctly, these writeups signal a specific and valuable thing to a UK hiring manager: you are self-directed, you write up your work, and you think technically. Done badly — just slapping "TryHackMe CTF" on a card — they read as a hobby. The line between those two outcomes is language and sequencing. This consultation tells you exactly where that line is.

---

## 1. How a UK hiring manager will react

**The realistic hiring manager in the UK junior pentester market is not a CISO. They are a technical lead, a senior consultant, or an internal security engineer.** They have seen hundreds of "I did TryHackMe" CVs and portfolios. Here is what actually happens when they open your portfolio:

**First 10 seconds:** They are scanning for signal — did this person actually understand what they did, or did they just follow a walkthrough? Writeups that survive this scan are ones where the *reasoning* is visible, not just the commands.

**What 5 TryHackMe writeups signal (positive read):**
- Consistent practice habit — not a one-off
- Ability to document technical work, which is a real job skill in consulting
- Coverage across web, binary exploitation, and Linux — breadth for a junior
- You ship things publicly — portfolio discipline matters to employers

**What they will flag (risk read):**
- All TryHackMe, all guided — no evidence of independent problem-solving on harder, unguided machines
- Easy difficulty rooms — if you apply to a role that asks for OSCP-level candidates, this signals you are at least 12 months short
- No real-world application framing — nothing connects the skill to an actual engagement context

**Net verdict:** For a graduate/junior role at a UK MSSP, security consultancy (Pen Test Partners, NCC Group, Praxis, Immersive Labs, etc.) or in-house red team support role, these writeups get you past the "does this person actually do anything?" filter. They do not, on their own, get you to interview stage at competitive shops. You need to frame them sharply and have a plan for what comes next.

---

## 2. Difficulty level perception — is "Easy" a problem?

**Yes, it is a problem if displayed carelessly. No, it is not a problem if handled correctly.**

The word "Easy" on a portfolio card does exactly one thing: it tells the hiring manager your ceiling. They do not know that Easy on TryHackMe still requires real knowledge of buffer overflows, format string vulnerabilities, or SQL injection. The label overrides the content in their mind.

**What to do:**

- **Do not display the difficulty label at all.** Remove it from every card. You do not walk into an interview and say "I fixed a minor bug." You say "I identified and resolved a memory safety issue in the authentication handler." Same rule applies here.
- **Instead, let the technical content communicate complexity.** A writeup that explains *why* a format string vulnerability allows arbitrary read/write, in precise terms, reads as intermediate-level work regardless of how TryHackMe categorises the room.
- **Add your own difficulty commentary in the body of the writeup if relevant** — something like "I extended this beyond the intended solution to explore whether ASLR bypass was possible in this environment" signals independent thinking. Even a failed attempt that you documented is worth more than a clean guided solve.
- **Frame by technique, not by platform tier.** "Exploited a format string vulnerability (CWE-134) to achieve arbitrary memory write and gain root access" says something real. "Easy room on TryHackMe" says nothing real.

---

## 3. Which writeup is the strongest career signal — and what order to publish

**Ranked by career signal strength:**

### Rank 1 — Flag Vault 2 (Format String) — FEATURE THIS FIRST
This is your strongest writeup by a significant margin. Format string vulnerabilities are not beginner knowledge. A format string exploit that achieves arbitrary memory write requires understanding of stack layout, printf internals, and controlled memory manipulation. Most junior applicants cannot explain this. If your writeup shows you understand *why* `%n` writes to a memory address and how you calculated the offset, this writeup separates you from 80% of the "I did TryHackMe" crowd. Feature it first on your portfolio. Give it the largest card. Make it the hero piece.

### Rank 2 — Flag Vault (Buffer Overflow)
A classic, but still valuable. Buffer overflow understanding is a stated requirement or implicit expectation in almost every UK pentesting JD at junior level. The writeup needs to show you understand stack frame structure, EIP/RIP control, and why the overflow works — not just that you ran a script. If it does that, it is a strong signal. Feature it second, paired with Flag Vault 2 as a "Binary Exploitation" grouping.

### Rank 3 — Capture! (Brute Force + Python Scripting)
The Python scripting component is what makes this one valuable. A writeup that shows you built a custom script to handle the challenge (rate limiting, token handling, dynamic feedback parsing) demonstrates engineering competence alongside security knowledge. UK employers — especially MSSPs and consultancies — want people who can automate. If your writeup shows the code and explains the decisions behind it, this lands well. If it just shows you ran Hydra, it is average.

### Rank 4 — Simple CTF (SQLi CVE + PrivEsc)
SQLi and Linux PrivEsc are table-stakes skills — every candidate claims them. What elevates this writeup is the CVE exploitation angle. If your writeup names the CVE, explains the vulnerability class, and shows how you identified the version fingerprint that led to CVE selection, it reads as methodology — which is what consulting firms actually care about. The PrivEsc component reinforces Linux fundamentals. Solid, not spectacular.

### Rank 5 — Pickle Rick (Web/Recon)
This is your weakest career signal. It is a well-known beginner room, thematically light, and the techniques (basic web recon, directory traversal, command injection via web form) are entry-level. It reads as a starting point, not a demonstration of capability. **Do not feature it prominently.** Include it at the bottom of the CTF section or omit it from the main portfolio view entirely. If you keep it, the writeup itself needs to show unusually thorough methodology — enumerate every finding, explain each decision point — to compensate for the room's reputation.

---

## 4. Language to use on portfolio cards

The goal is to convert "hobby activity" into "professional credential." The mechanism is specificity and framing. Use the technique, the outcome, and the domain — not the platform and the difficulty.

**Do not write:**
- "TryHackMe CTF — Easy — Web/Brute Force"
- "Solved Pickle Rick room on TryHackMe"
- "Practised buffer overflow exploitation"

**Write like this instead:**

| Writeup | Portfolio card language |
|---|---|
| Flag Vault 2 | Exploited a format string vulnerability (CWE-134) to achieve arbitrary memory write and privilege escalation; documented offset calculation and GOT overwrite technique |
| Flag Vault | Demonstrated stack-based buffer overflow exploitation against a 32-bit binary; controlled EIP and redirected execution to shellcode |
| Capture! | Built a Python script to bypass a rate-limited login form using dynamic token extraction and adaptive request timing; achieved credential recovery via custom brute-force implementation |
| Simple CTF | Identified a vulnerable service version via enumeration, matched to a known CVE, exploited SQLi to extract credentials, and escalated to root via SUID binary abuse |
| Pickle Rick | Conducted web application reconnaissance and exploited command injection to enumerate and exfiltrate flags across permission boundaries |

**Three rules for every card:**
1. Name the vulnerability class or technique by its proper technical name
2. State what you achieved (access level, data exfiltrated, privilege gained)
3. Mention any methodology, scripting, or analytical step that shows thinking — not just execution

**Never use the word "Easy." Never mention the room difficulty. Never frame it as "practice" or "learning."** You did technical security research. Call it that.

---

## 5. What Atharva must add next — in priority order

You are actively applying. This means the gap between your current portfolio and what will actually convert to interviews needs to close in weeks, not months. Here is the prioritised path:

### Priority 1 — One HackTheBox machine (Medium difficulty, retired)
A single HTB Medium writeup outweighs all 5 TryHackMe Easy rooms combined in the eyes of a technical interviewer. HTB machines are unguided — there is no hint system by default — and Medium difficulty requires genuine enumeration, chaining of vulnerabilities, and independent reasoning. Pick a retired Linux machine from the HTB archives (retired = writeups allowed). Complete it. Write it up in professional report format. This single addition changes how your portfolio reads.

**Recommended starting machines:** Bashed, Nibbles, Shocker, Jerry — all retired, all Medium, all technically rich.

### Priority 2 — One writeup in professional vulnerability report format
Most of your writeups are likely structured as "what I did" narratives. Rewrite your strongest one (Flag Vault 2) in the format of an actual penetration test finding:

- Finding title
- Severity rating (CVSS score)
- Affected component
- Description
- Proof of concept (with evidence)
- Business impact
- Remediation recommendation

This format is what you will produce on the job. Showing you already know it — without being taught — is a strong differentiator. It signals professional readiness, not just technical capability.

### Priority 3 — One web application writeup with tool documentation
Web application testing is the highest-volume work in UK junior pentesting roles. A writeup that shows Burp Suite usage, manual parameter manipulation, and documented testing methodology (not just "I ran sqlmap") carries significant weight. The Simple CTF SQLi writeup can be upgraded to serve this purpose if you expand it.

### Priority 4 — eJPT certification (if budget allows)
The eLearnSecurity Junior Penetration Tester (eJPT) is the most credible entry-level certification in the UK market for someone at your stage. It is practical, not multiple choice, it is respected by hiring managers who know the market, and it provides a credential line on your CV that TryHackMe rooms cannot. It costs approximately £150. If you are serious about converting applications to interviews in the next 90 days, this is a high-ROI spend.

OSCP is the gold standard but it is £1,300+ and requires 3-6 months of dedicated prep. It is the right next step after eJPT, not before.

### Priority 5 — GitHub repository for your CTF scripts
Create a public GitHub repository containing the Python script from Capture! and any other scripts you wrote during CTF work. Link it from your portfolio. Hiring managers and technical interviewers look at GitHub. A repository with clean, commented scripts — even simple ones — shows professional habits. An empty or dormant GitHub profile undermines everything else you publish.

---

## Summary — action list before you hit publish

1. Remove all difficulty labels from every portfolio card
2. Rewrite all 5 card descriptions using the language in Section 4
3. Reorder the display: Flag Vault 2 first, Flag Vault second, Capture! third, Simple CTF fourth, Pickle Rick last (or omit)
4. Start one HTB Medium machine this week — add the writeup as soon as it is done
5. Rewrite the Flag Vault 2 writeup in professional pentest report format
6. Create a GitHub repo for your CTF scripts and link it from the portfolio
7. Research eJPT — if you can invest, prioritise it within the next 60 days

The 5 writeups are publishable today. The framing changes above take one afternoon. Do not wait — a portfolio that is 80% perfect and live is worth more than a portfolio that is 100% perfect and sitting in a draft.

---

*Consultation prepared by Career Coach agent. For further guidance on CV language, application strategy, or interview preparation, request a follow-up consultation.*
