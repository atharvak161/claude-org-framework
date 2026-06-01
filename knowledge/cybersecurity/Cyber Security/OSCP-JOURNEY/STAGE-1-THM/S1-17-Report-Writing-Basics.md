---
tags: [oscp-journey, spectre, stage-1, report-writing, documentation]
module: 1
cert-stage: thm
difficulty: beginner
date: 2026-04-08
phantom-refs: ["PHANTOM/MODULE 8 — Reporting"]
netgod-refs: []
---

# S1-17 — Report Writing Basics

> [!info] Relationship to PHANTOM
> The full professional report template lives in [[PHANTOM/MODULE 8 — Reporting]]. This note covers OSCP-specific requirements, what markers look for, evidence standards, note-taking strategy during the exam, and available report templates.

---

## Why the Report Matters as Much as the Shells

On OSCP, you can root all five machines and still fail if your report is inadequate. The report is a mandatory deliverable — no submission means automatic failure regardless of machines compromised. OffSec evaluates whether you can communicate findings clearly and professionally, not just whether you can hack.

**The report proves three things:**
1. You compromised the machines (proof screenshots)
2. You understand what you exploited and why it works (technical explanation)
3. You can communicate findings to a client (professional writing)

All three are required. A report that just lists commands without explanation fails. A report with poor screenshots fails. A report submitted late fails.

---

## OSCP Exam Report — What OffSec Requires

### Deadlines

- **Exam window:** 23 hours 45 minutes of exploitation time
- **Report submission deadline:** 24 hours after your exam ends
- **Total from exam start to submission:** ~48 hours

Miss the submission deadline = automatic fail. OffSec does not accept late submissions.

### What to Submit

- A single PDF report
- Submitted via OffSec's exam submission portal
- Maximum file size: 200 MB (compress screenshots if needed)

### What OffSec Markers Look For

**For each compromised machine:**

1. **Machine IP address** — clearly identified in the finding
2. **Vulnerability/exploit used** — named and explained
3. **Proof screenshot** — must show hostname + whoami + flag contents in one image
4. **Steps to reproduce** — another person must be able to follow your steps and get the same shell
5. **Evidence at each step** — screenshots showing key commands and their output

**For the report overall:**
- Clear structure (executive summary + technical findings)
- Professional language (no slang, no "I hacked it")
- Accurate CVSS scores for findings where applicable
- Remediation recommendations for each finding

---

## The Proof Screenshot Requirement — Exact Standard

This is the most commonly failed requirement. Getting it wrong costs you points.

**Each proof screenshot MUST show ALL of the following in ONE image:**

```
┌─────────────────────────────────────────────────────────┐
│  $ hostname                                              │
│  victim-machine                                          │
│                                                          │
│  $ whoami                                                │
│  root                                                    │
│                                                          │
│  $ cat /root/root.txt                                    │
│  3a4b5c6d7e8f1a2b3c4d5e6f7a8b9c0d                      │
└─────────────────────────────────────────────────────────┘
```

**Failures that get points deducted:**
- Three separate screenshots (one per command) — not accepted
- IP address not shown (use `ip a` or `ifconfig` if hostname isn't enough)
- whoami showing a non-privileged user for the root.txt screenshot
- Flag contents cut off or not readable
- Screenshot is blurry or too small to read

**How to take a clean proof screenshot:**

```bash
# Linux — run all three in sequence, scroll up to see them all, screenshot:
hostname
whoami
cat /root/root.txt

# Or in one command (output on consecutive lines):
printf "Hostname: $(hostname)\nUser: $(whoami)\nFlag: $(cat /root/root.txt)\n"

# For IP confirmation if hostname is ambiguous:
ip a; whoami; cat /root/root.txt
```

```cmd
REM Windows:
hostname && whoami && type C:\Users\Administrator\Desktop\root.txt
```

**Naming your screenshots:**
Use a consistent naming convention so you can find them when writing the report:
```
10.10.10.100_user.png    → user flag screenshot
10.10.10.100_root.png    → root/admin flag screenshot
10.10.10.100_exploit.png → key exploitation step
```

---

## Note-Taking During the Exam — CherryTree

CherryTree is the recommended note-taking tool. Set it up before your exam starts, not during.

**Install:**
```bash
sudo apt install cherrytree
```

**Pre-built OSCP exam template structure:**
```
OSCP Exam [DATE]
├── Exam Details
│   ├── VPN Connected: [tun0 IP]
│   ├── Exam Start Time:
│   └── Report Due:
│
├── Machine 1 — [IP] [Easy/Medium/Hard]
│   ├── Nmap Output
│   │   ├── Quick Scan
│   │   └── Full Port Scan
│   ├── Service Enumeration
│   │   ├── Port 80 — HTTP
│   │   ├── Port 445 — SMB
│   │   └── [other ports]
│   ├── Exploitation
│   │   ├── Vulnerability: [name + CVE]
│   │   ├── Commands:
│   │   └── Shell obtained as: [user]
│   ├── Post-Exploitation
│   │   ├── Credentials found:
│   │   └── Internal network info:
│   ├── Privilege Escalation
│   │   ├── Vector: [technique]
│   │   └── Commands:
│   └── PROOF
│       ├── user.txt: [hash]
│       ├── root.txt: [hash]
│       ├── Screenshot: machine1_user.png ✓
│       └── Screenshot: machine1_root.png ✓
│
├── Machine 2 — [IP]
│   └── [same structure]
│
├── Machine 3 — [IP]
│   └── [same structure]
│
├── AD Set
│   ├── Client — [IP]
│   ├── Server — [IP]
│   └── DC — [IP]
│       └── [same structure per machine]
│
└── Credentials Master List
    ├── user:password (found on Machine X)
    ├── user:NTLM_hash
    └── SSH key locations
```

**What to record for every exploitation step:**
- The exact command you ran (copy-paste it, don't paraphrase)
- The exact output showing success
- The screenshot filename

This ensures when you write the report, you have everything you need and don't need to go back to the machine.

---

## Report Structure — Every Required Section

### 1. Cover Page

```
Offensive Security OSCP Examination
Student Name: [Your Full Name]
OSCP Exam Date: [Date]
OSCP ID: [Your OS-XXXXX ID]
Report Version: 1.0
Classification: Confidential
```

### 2. Table of Contents

Auto-generate this in Word/LibreOffice after writing. Use heading styles so it updates automatically.

### 3. Executive Summary

**Audience:** Non-technical reader (CISO, manager). No technical jargon.

**Length:** 1–2 pages maximum.

**What to cover:**
- How many machines were compromised (out of how many)
- The severity of what was found (critical, high, etc.)
- Key findings in plain English
- Top 3 recommended actions

**Example executive summary paragraph:**
```
During the OSCP examination, penetration testing was conducted against five 
target systems. Four of the five systems were fully compromised, with administrative 
access obtained on each. The primary attack vectors included outdated software 
with publicly known vulnerabilities, misconfigured service accounts with 
excessive privileges, and weak authentication controls.

The most critical finding was the exploitation of an unpatched SMB vulnerability 
(MS17-010) on a Windows Server 2008 R2 system, which allowed unauthenticated 
remote code execution with SYSTEM-level privileges. Immediate patching of all 
identified vulnerabilities is strongly recommended.
```

### 4. Methodology Overview

Brief description of the approach taken:
- Phases used (recon, scanning, exploitation, post-exploitation)
- Tools used (Nmap, Gobuster, Burp Suite, etc.)
- Testing scope (the five exam machines)

### 5. Technical Findings — One Section Per Machine

This is the core of the report. For each compromised machine:

```
5.1 — Machine Name / IP Address: 10.10.10.100

  5.1.1 — Vulnerability Summary
    Name: EternalBlue (MS17-010)
    CVSS v3.1 Score: 9.8 (Critical)
    CVE: CVE-2017-0144
    Affected System: Windows 7 x64 / SMBv1
    Access Achieved: SYSTEM

  5.1.2 — Vulnerability Description
    [2–3 paragraphs explaining what the vulnerability is, why it exists,
     and what an attacker can do with it. Write for a technical reader.]

  5.1.3 — Steps to Reproduce
    1. Run Nmap: nmap -sC -sV -p445 10.10.10.100
       [Screenshot: nmap_output.png]
    
    2. Confirm EternalBlue vulnerability:
       nmap --script smb-vuln-ms17-010 -p445 10.10.10.100
       [Screenshot: vuln_confirm.png]
    
    3. Prepare exploit:
       python zzz_exploit.py 10.10.10.100
       [Screenshot: exploit_run.png]
    
    4. Receive reverse shell:
       [Screenshot: shell_received.png]
    
    5. Proof:
       [Screenshot: 10.10.10.100_root.png — hostname, whoami=SYSTEM, root.txt]

  5.1.4 — Remediation
    Apply Microsoft security patch MS17-010 immediately. Disable SMBv1 
    protocol across all systems. Implement network segmentation to restrict 
    SMB access to only required systems. Consider deploying an endpoint 
    detection and response (EDR) solution.
```

### 6. Risk Summary Table

A table at the beginning or end listing all findings:

| # | Machine | Vulnerability | CVSS | Risk |
|---|---------|--------------|------|------|
| 1 | 10.10.10.100 | EternalBlue MS17-010 | 9.8 | Critical |
| 2 | 10.10.10.101 | PHP File Upload → RCE | 8.8 | High |
| 3 | 10.10.10.102 | SeImpersonatePrivilege → PrintSpoofer | 7.8 | High |
| 4 | 10.10.10.103 (AD) | NTLM Relay → DCSync | 9.9 | Critical |

### 7. Appendix

- Full Nmap scan outputs
- Raw tool output referenced in findings
- Custom scripts or code used during the assessment
- Any additional supporting evidence

---

## Writing Quality — What Markers Want

### Language and Tone

**Professional tone — always:**
```
Bad:  "I then hacked into the machine using EternalBlue."
Good: "Exploitation of CVE-2017-0144 (EternalBlue) was performed against the 
       target system, resulting in unauthenticated remote code execution with 
       SYSTEM-level privileges."

Bad:  "The password was super weak lol"
Good: "The service account was configured with a weak password that was 
       successfully recovered via offline dictionary attack against the captured 
       NTLM hash."
```

### Technical Accuracy

- Name every CVE correctly (CVE-YEAR-NUMBER format)
- State exact versions affected
- Explain the root cause, not just the symptom
- Provide exact reproduction steps — not "run the exploit" but the exact command

### Evidence Requirements

Every claim needs evidence. Every exploitation step needs a screenshot.

**Required screenshots per machine:**
1. Initial Nmap scan showing the open port/service
2. Vulnerability confirmed (Nmap NSE output, version banner, or exploit check)
3. Exploit running successfully
4. Shell received / initial access as low-priv user
5. Privilege escalation technique executed
6. **Proof screenshot** (hostname + whoami + flag — all in one)

**Screenshots should be:**
- Clear and readable at normal zoom
- Showing the full terminal window (so context is visible)
- Named consistently and referenced in the report

---

## OSCP Report Templates

Use an established template rather than starting from scratch. You're under time pressure.

### Option 1 — OffSec Official Template

Available in the OSCP exam guide on the OffSec portal. Microsoft Word format. The safe choice — exactly what markers expect.

### Option 2 — noraj LaTeX Template (GitHub)

```
github.com/noraj/OSCP-Exam-Report-Template-Markdown
```

Markdown → Pandoc → PDF pipeline. Clean professional output. Requires Pandoc and LaTeX installed.

```bash
# Setup on Kali:
sudo apt install pandoc texlive-full

# Clone template:
git clone https://github.com/noraj/OSCP-Exam-Report-Template-Markdown

# Fill in your findings in the markdown files
# Generate PDF:
pandoc src/OSCP-exam-report.md -o output/OSCP-exam-report.pdf \
  --from markdown+yaml_metadata_block+raw_html \
  --template eisvogel --listings
```

### Option 3 — whoisflynn Word Template

```
github.com/whoisflynn/OSCP-Exam-Report-Template
```

Microsoft Word `.docx` format. Good structure, easy to edit.

### Option 4 — CherryTree → Word

Take notes in CherryTree during the exam, then compile into Word for the final report. Most flexible — you write naturally during the exam and format afterwards.

---

## Report Writing Timeline — Exam Day

```
Hour 0–24:   Exploitation window
             → Note every command in CherryTree
             → Take screenshots at every key step
             → Collect all proof screenshots before the exam ends

Hour 24–48:  Report window
             → First 2 hours: organise notes, verify all screenshots exist
             → Hours 2–10: write technical findings (longest part)
             → Hours 10–12: executive summary and methodology
             → Hours 12–14: proofread, format, check CVSSs
             → Hours 14–20: buffer for additional polish or fixing errors
             → Hour 20–24: final review and submit

DO NOT WAIT until the last hour to submit. Submit early.
```

---

## CVSS 3.1 Quick Reference for Report Scoring

You need to assign CVSS scores in your report. Use the NVD calculator for accuracy.

**Common OSCP findings and their approximate CVSS:**

| Finding | Approximate CVSS | Rating |
|---------|-----------------|--------|
| EternalBlue (MS17-010) unauthenticated | 8.1–9.8 | Critical |
| Apache RCE (CVE-2021-41773) | 9.8 | Critical |
| Weak SSH password → brute force | 6.5 | Medium |
| PHP file upload → RCE (authenticated) | 8.8 | High |
| SeImpersonatePrivilege local privesc | 7.8 | High |
| Unquoted service path local privesc | 7.8 | High |
| SQL injection → file write → RCE | 9.8 | Critical |
| LFI → log poisoning → RCE | 8.8 | High |
| Default credentials | 9.8 | Critical |
| Stored cleartext password | 6.5–8.8 | Medium–High |

**CVSS calculator:** `nvd.nist.gov/vuln-metrics/cvss/v3-calculator`

---

## Remediation — What to Write

Every finding needs a remediation. Write specific, actionable recommendations — not generic ones.

**Bad remediation:**
```
"Apply the latest patches."
```

**Good remediation:**
```
"Apply Microsoft security update MS17-010 (KB4012212 for Windows 7, KB4012215 
for Windows Server 2008 R2). If patching cannot be performed immediately, 
disable the SMBv1 protocol by running the following PowerShell command on 
affected systems: 

  Set-SmbServerConfiguration -EnableSMB1Protocol $false

Additionally, implement network-level controls to restrict SMB traffic (ports 
139 and 445) to only authorised hosts and network segments."
```

**Common remediations to memorise:**
- **Unpatched software:** "Apply vendor patch [MS ID or CVE], disable if patch unavailable"
- **Default credentials:** "Implement a password policy requiring minimum 12 characters, change all default credentials"
- **File upload vuln:** "Validate file type server-side using a whitelist. Store uploads outside the web root. Disable PHP execution in upload directories."
- **SQL injection:** "Use parameterised queries / prepared statements. Implement input validation."
- **Weak service permissions:** "Apply principle of least privilege. Configure service accounts with only required permissions."
- **SeImpersonatePrivilege:** "Run IIS application pools as Network Service or custom low-privilege accounts. Review service account privilege assignments."

---

## Quick Reference

| Item | Requirement |
|------|------------|
| Submission format | Single PDF |
| Submission deadline | 24 hours after exam window ends |
| Proof screenshot | hostname + whoami + flag in ONE image |
| Minimum screenshots per machine | 5–6 (recon, vuln confirm, exploit, shell, proof) |
| Executive summary length | 1–2 pages maximum |
| Steps to reproduce | Must be reproducible by another tester from scratch |
| CVSS version | 3.1 |
| Recommended note tool | CherryTree |
| Recommended report tool | OffSec template (Word) or noraj template (Markdown/PDF) |
| Late submission penalty | Automatic fail |

---

## Common Mistakes

> [!warning] Report mistakes that cost OSCP passes
> 1. **Proof screenshot missing hostname or whoami.** The single most common reason for point deduction. Every proof screenshot needs all three visible in one image.
> 2. **No steps to reproduce.** Listing the vulnerability without showing how you exploited it step by step is insufficient. Another tester must be able to follow your steps.
> 3. **Missing evidence for key steps.** If you say "I ran LinPEAS and found SeImpersonatePrivilege", show the screenshot of LinPEAS output showing it.
> 4. **Generic remediations.** "Patch the system" is not a remediation. Name the specific patch, the specific command, the specific configuration change.
> 5. **Submitting near the deadline.** Portal issues, upload failures, internet problems at hour 47.5 cost passes. Submit at hour 40 at the latest.
> 6. **Not taking notes during exploitation.** Trying to reconstruct commands from memory 6 hours later is unreliable. Write everything down as you go in CherryTree.
> 7. **Using screenshots that are too small.** OffSec markers need to read the flag value and command output. Full-size screenshots, not thumbnails.

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| OffSec Exam Guide | Read the report requirements section before your exam |
| noraj template (GitHub) | Set this up on Kali now — don't do it for the first time on exam day |
| TryHackMe — any room | Practice writing a mini-report for every machine you root |
| HTB writeups (after machine retires) | Read published writeups to see how professionals structure findings |
| TCM Security PNPT resources | PNPT requires a full pentest report — excellent OSCP report prep |
| [[PHANTOM/MODULE 8 — Reporting]] | Full professional report template in PHANTOM vault |

---

## Stage 1 Complete — What You Now Have

All 17 Stage 1 notes are written and saved to your vault:

| Note | Topic |
|------|-------|
| S1-01 | Penetration Testing Fundamentals |
| S1-02 | Linux Fundamentals for Pentesters |
| S1-03 | Windows Fundamentals for Pentesters |
| S1-04 | Networking for Pentesters |
| S1-05 | Nmap — Complete Reference |
| S1-06 | Gobuster, ffuf, Feroxbuster |
| S1-07 | Burp Suite — Complete |
| S1-08 | Shell Techniques |
| S1-09 | Vulnerability Research and Exploit Dev |
| S1-10 | Web Attacks — Injection Deep Dive |
| S1-11 | Web Attacks — File Uploads and LFI |
| S1-12 | Authentication Attacks and Password Cracking |
| S1-13 | Service Enumeration Deep Dive |
| S1-14 | Linux Privilege Escalation |
| S1-15 | Windows Privilege Escalation |
| S1-16 | Post-Exploitation Fundamentals |
| S1-17 | Report Writing Basics |

**What to do now:**
1. Start TryHackMe Jr Penetration Tester path — use these notes as your reference
2. Root your first 5 HTB Easy machines using the methodology in S4-01
3. Type `STAGE 2` when ready to move to eJPT prep notes
