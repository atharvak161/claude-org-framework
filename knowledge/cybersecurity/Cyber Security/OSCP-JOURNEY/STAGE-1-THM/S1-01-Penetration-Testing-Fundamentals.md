---
tags: [oscp-journey, spectre, stage-1, penetration-testing-fundamentals]
module: 1
cert-stage: thm
difficulty: beginner
date: 2026-04-08
phantom-refs: []
netgod-refs: []
---

# S1-01 — Penetration Testing Fundamentals

## What Is a Penetration Test?

A penetration test (pentest) is an authorised, simulated cyberattack against a system, network, or application. The goal is to find security weaknesses before a real attacker does — and prove they're exploitable, not just theoretical.

The key word is **authorised**. Without written permission, everything in this curriculum is illegal. With it, you are a professional doing a critical job.

A pentest is NOT:
- A vulnerability scan (automated tool running, no exploitation)
- A red team exercise (longer, more covert, full adversary simulation)
- A security audit (compliance-focused, not exploitation-focused)

A pentest IS:
- Time-boxed (usually 1–2 weeks for a real engagement)
- Scope-limited (specific IPs, domains, or applications)
- Evidence-based (you prove impact, not just flag potential issues)
- Reported (written deliverable to the client at the end)

---

## Black Box, Grey Box, White Box

These describe how much information you're given before you start.

| Box Type | What You Get | Real-World Analogy |
|----------|-------------|-------------------|
| **Black Box** | Nothing. Just an IP or domain. | Cold attacker with no insider knowledge |
| **Grey Box** | Some info: credentials, architecture diagrams, partial source | Insider threat or partner with limited access |
| **White Box** | Everything: full source code, admin creds, network diagrams | Full transparency — most thorough, most time-efficient |

**OSCP exam is grey/black box.** You get IPs, no hints about what's running.

**CPTS exam is black box.** You receive a brief like a real client engagement.

> [!tip] Which is "harder"?
> Black box takes longer because you spend more time in recon. White box finds more vulnerabilities because you can audit the code. For job interviews, knowing black box methodology is what matters — it's what you'll be tested on.

---

## The Legal Framework — UK (Computer Misuse Act 1990)

In the UK, hacking without authorisation violates the **Computer Misuse Act 1990 (CMA)**. This is the primary legislation you need to understand.

**Three core offences:**

1. **Section 1 — Unauthorised access** to computer material.
   - Simply logging in without permission. Up to 2 years.

2. **Section 2 — Unauthorised access with intent** to commit further offences.
   - Accessing a system with intent to steal data, commit fraud, etc. Up to 5 years.

3. **Section 3 — Unauthorised modification** of computer material.
   - Deleting files, installing malware, changing data without permission. Up to 10 years.

**Section 3ZA** (added 2015): Impairing access to data causing serious damage (critical infrastructure attacks). Up to 14 years or life if endangering life.

**What protects you as a pentester:**
- A signed **Statement of Work (SoW)** or **Rules of Engagement (RoE)** document
- Written authorisation from the system owner (not just a manager — the actual legal owner)
- Scope definition confirming exactly what you're allowed to test

> [!danger] The "I had permission" defence
> Verbal permission means nothing. If you're ever questioned, you need a signed document from someone with legal authority over the system. Always get it in writing before touching anything.

**Bug bounty programs** (HackerOne, Bugcrowd) provide public authorisation within their defined scope. HTB machines are on isolated infrastructure — you're not attacking the internet.

---

## Rules of Engagement (RoE) and Scope

Before any engagement begins, you establish Rules of Engagement. This is the contract between you and the client that defines:

**What's in scope:**
- IP ranges / CIDR blocks
- Specific domains and subdomains
- Applications (web apps, mobile, APIs)
- Test types allowed (external, internal, social engineering, physical)

**What's out of scope:**
- Third-party systems (cloud providers, payment processors like Stripe — they need their own authorisation)
- Production databases (sometimes — client may want read-only testing only)
- Denial of Service testing (almost always excluded)
- Specific business hours (some clients say "no testing during 9–5")

**What happens during testing:**
- Emergency contact: who to call if you break something
- Reporting cadence: daily updates? Only at end?
- Handling of discovered credentials: do you use them or just report?
- Data handling: what do you do with sensitive data you find?

> [!warning] Scope creep is a real risk
> You find a vulnerability that leads you to a system not in scope. Stop. Document it. Report it to the client and ask for scope expansion. Do NOT follow the attack path into out-of-scope systems — that's where legal protection ends.

---

## The 5 Phases of a Penetration Test

Every methodology — PTES, OSSTMM, OWASP Testing Guide — maps to roughly the same phases. Memorise these. The OSCP exam follows this exact flow.

### Phase 1 — Reconnaissance (Recon)
Gathering information about the target **without touching it** (passive) or **by interacting with it** (active).

- **Passive:** OSINT, DNS lookups, Shodan, LinkedIn, WHOIS, Google dorking
- **Active:** Nmap scans, banner grabbing, web spidering

Goal: understand the attack surface. What services are running? What software versions? What people work there? What subdomains exist?

### Phase 2 — Scanning and Enumeration
Deeper interaction with discovered services to find specific vulnerabilities.

- Port scanning (Nmap)
- Service version detection
- Web directory brute forcing (Gobuster, ffuf)
- Vulnerability scanning (Nessus, OpenVAS — not OSCP exam)
- Manual testing of each service

Goal: find specific weaknesses to exploit.

### Phase 3 — Exploitation
Actually exploiting a vulnerability to gain access.

- Running an exploit against a CVE
- Exploiting a web application vulnerability (SQLi, LFI, file upload)
- Brute forcing credentials
- Social engineering (phishing — outside OSCP scope)

Goal: get a foothold. First access is just the beginning.

### Phase 4 — Post-Exploitation
What you do after getting a shell.

- Privilege escalation (user → root/SYSTEM)
- Lateral movement (machine A → machine B)
- Data exfiltration (in real engagements — not in OSCP)
- Persistence (in real engagements — not required in OSCP)
- Pivoting to additional network segments

Goal: demonstrate full impact, reach the crown jewels.

### Phase 5 — Reporting
Documenting everything you found, how you found it, and how to fix it.

- Executive summary (non-technical, for management)
- Technical findings (CVE references, steps to reproduce, screenshots)
- Risk ratings (CVSS scores)
- Remediation recommendations

Goal: give the client something actionable.

> [!tip] OSCP mirrors this exactly
> The 24-hour exam is phases 1–4. The 24-hour report window is phase 5. The exam isn't just "get root" — the report is worth points too. No report = automatic fail regardless of machines rooted.

---

## The PTES Standard (Penetration Testing Execution Standard)

PTES is the industry-standard framework for structuring pentests. It expands the 5 phases into 7 formal sections:

1. **Pre-engagement Interactions** — Scoping, RoE, legal agreements
2. **Intelligence Gathering** — OSINT, passive recon
3. **Threat Modelling** — What's valuable to an attacker? What are realistic threats?
4. **Vulnerability Analysis** — Identifying weaknesses (scanning + manual)
5. **Exploitation** — Active exploitation of confirmed vulnerabilities
6. **Post Exploitation** — Privilege escalation, lateral movement, persistence
7. **Reporting** — Full written deliverable

The PTES website (pentest-standard.org) is the authoritative reference. OSCP, PNPT, and CPTS all implicitly follow PTES structure.

---

## CVE and CVSS 3.1

### CVE (Common Vulnerabilities and Exposures)

A CVE is a unique identifier assigned to a publicly disclosed vulnerability.

Format: `CVE-YEAR-NUMBER` — e.g., `CVE-2017-0144` (EternalBlue/MS17-010)

**Who assigns CVEs?** MITRE Corporation, with input from CNAs (CVE Numbering Authorities — includes vendors like Microsoft, Cisco, and Google).

**Where to look them up:**
- NVD (National Vulnerability Database): nvd.nist.gov — full detail, CVSS scores, references
- CVE Details: cvedetails.com — good for filtering by vendor/product
- Vendor advisories: Microsoft Security Response Center, etc.

**Reading a CVE entry — the important fields:**
- **Description:** What the vulnerability is and what it affects
- **CVSS Score:** Severity rating (see below)
- **References:** Links to patches, advisories, and often PoC exploits
- **CWE:** The underlying weakness category (e.g., CWE-89 = SQL Injection)
- **CPE:** Affected product versions

### CVSS 3.1 (Common Vulnerability Scoring System)

CVSS gives every vulnerability a score from 0.0 to 10.0. You'll use this in every pentest report.

**Score ranges:**
| Score | Rating |
|-------|--------|
| 0.0 | None |
| 0.1–3.9 | Low |
| 4.0–6.9 | Medium |
| 7.0–8.9 | High |
| 9.0–10.0 | Critical |

**The 8 base metrics (you need to understand these for reports):**

| Metric | Abbreviation | What it measures |
|--------|-------------|-----------------|
| Attack Vector | AV | Network (N), Adjacent (A), Local (L), Physical (P) |
| Attack Complexity | AC | Low (L) or High (H) |
| Privileges Required | PR | None (N), Low (L), High (H) |
| User Interaction | UI | None (N) or Required (R) |
| Scope | S | Unchanged (U) or Changed (C) |
| Confidentiality | C | None (N), Low (L), High (H) |
| Integrity | I | None (N), Low (L), High (H) |
| Availability | A | None (N), Low (L), High (H) |

**Example — EternalBlue (CVE-2017-0144):**
- AV:N (exploitable over network remotely)
- AC:H (requires specific conditions — SMBv1 enabled)
- PR:N (no authentication needed)
- UI:N (no user interaction needed)
- S:U (stays within the system)
- C:H / I:H / A:H (full compromise)
- **CVSS Score: 8.1 (High)**

> [!tip] CVSS calculator
> Use the NVD CVSS calculator at nvd.nist.gov/vuln-metrics/cvss/v3-calculator to compute scores for your reports. You don't need to memorise the formula, but you need to understand what each metric means so your scores are defensible.

---

## Report Structure Overview

A professional pentest report has two audiences: the CEO (who doesn't understand TCP) and the sysadmin (who needs exact reproduction steps). You write for both simultaneously.

**Standard structure:**

1. **Cover Page** — Client name, engagement dates, your name/company, classification (Confidential)
2. **Table of Contents**
3. **Executive Summary** — 1 page, no jargon, answers: "Were we compromised? How badly? What do we do first?"
4. **Scope and Methodology** — What was tested, what tools were used, what was excluded
5. **Risk Summary** — Table of all findings with severity, so management sees the big picture
6. **Technical Findings** — One section per vulnerability:
   - Finding name
   - Severity (CVSS score)
   - Affected systems
   - Description (what it is, why it's dangerous)
   - Evidence (screenshots, command output)
   - Steps to reproduce
   - Remediation recommendation
7. **Appendix** — Raw tool output, full scan results, custom scripts used

> [!info] OSCP report specifics
> The OSCP report follows this structure but focuses only on successful exploitation paths. You document: machine IP, vulnerability exploited, steps to reproduce from scratch (another person must be able to replicate it), and proof screenshot (IP + whoami + cat flag.txt all visible in one image). Every failed attempt is NOT in the report — only successful exploitation chains.

---

## How the OSCP Exam Mirrors a Real Engagement

The OSCP exam is intentionally designed to simulate a real external penetration test with internal access.

| Real Engagement Phase | OSCP Exam Equivalent |
|----------------------|---------------------|
| Scope definition | You receive a list of IPs and an RoE document |
| Recon and enumeration | Hours 0–2: nmap everything simultaneously |
| Exploitation | Hours 2–18: exploit machines, get flags |
| Post-exploitation | Privilege escalation after each foothold |
| Lateral movement | The AD set: Client → Server → DC |
| Reporting | 24-hour report window after exam ends |

The exam simulates a client who has five machines (3 standalone + 1 AD set of 3). Your job is to compromise as many as possible and prove it with evidence. The report proves you can communicate findings professionally.

> [!success] What passing OSCP proves
> You can independently find and exploit vulnerabilities on a variety of systems, escalate privileges, and document your work clearly. This is exactly what a junior pentester is hired to do on day one.

---

## Quick Reference

| Concept | Key Detail |
|---------|-----------|
| CMA 1990 | UK law governing unauthorised access — always get written permission |
| Black box | No prior info given |
| Grey box | Partial info (credentials, architecture) |
| White box | Full info (source code, admin access) |
| PTES phases | Pre-engagement → Intel → Threat model → Vuln analysis → Exploitation → Post-exploitation → Report |
| CVE format | CVE-YEAR-NUMBER |
| CVSS Critical | 9.0–10.0 |
| CVSS High | 7.0–8.9 |
| OSCP pass mark | 70/100 points |
| OSCP Metasploit rule | 1 exploit module per exam, unlimited multi/handler and msfvenom |
| OSCP report deadline | 24 hours after exam ends — missing this = automatic fail |

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| TryHackMe — "Jr Penetration Tester" path | Start here — this note is your foundation for everything in that path |
| TryHackMe — "Pentesting Fundamentals" room | Free room, covers legality and methodology in interactive form |
| PTES Standard | Read pentest-standard.org sections 1–3 to see the full framework |
| NVD | Look up CVE-2017-0144 and read the full entry — practice reading CVEs |
| OSCP Exam Guide | Read the OffSec exam guide once before starting lab work — know the rules cold |
