---
tags: [oscp-journey, spectre, stage-5, oscp, exam-format, rules]
module: 5
cert-stage: oscp
difficulty: intermediate
date: 2026-04-08
phantom-refs: []
netgod-refs: []
---

# S5-01 — OSCP Exam Format and Rules (Complete)

## The Exam Structure — 2024/2025 Format

The OSCP exam simulates a real penetration test engagement. You are given access to an isolated network via VPN and must compromise as many targets as possible within 23 hours 45 minutes, then write and submit a professional penetration testing report within 24 hours of the exam ending.

### Point Breakdown

| Target | Points | Notes |
|--------|--------|-------|
| Standalone Machine 1 (Easy) | 20 | 10 for user, 10 for root |
| Standalone Machine 2 (Medium) | 20 | 10 for user, 10 for root |
| Standalone Machine 3 (Hard) | 20 | 10 for user, 10 for root |
| AD Set (Client → Server → DC) | 40 | All-or-nothing — all 3 or 0 |
| **Total Available** | **100** | |
| **Pass Mark** | **70** | |

### Proof Files

Every machine has a `proof.txt` (or `local.txt` for user flag on Windows) file. You must submit these hashes through the exam control panel.

**Exact locations:**
```
Linux user:  /home/[username]/local.txt
Linux root:  /root/proof.txt
Windows user: C:\Users\[username]\Desktop\local.txt
Windows admin: C:\Users\Administrator\Desktop\proof.txt
```

> [!warning] Locations vary slightly between exam iterations
> OffSec occasionally updates file locations. The exam dashboard will confirm the exact paths for your specific exam. Always verify in the control panel.

### Partial Points

- Standalone machines: 10 points for low-priv shell (local.txt), 10 points for root/SYSTEM (proof.txt)
- AD set: **No partial points** — you need all three machines (Client, Server, DC) for any AD points

### Scoring Strategy

**Minimum to pass (70 points) — example combinations:**
```
Option A: All 3 standalones (60) + full AD set (40) = 100 — comfortable
Option B: 2 standalones (40) + full AD set (40) = 80 — passes
Option C: 3 standalones (60) + 1 low-priv on AD = 70 — exactly passes
Option D: 3 standalones (60) + partial AD machine = 60 + bonus points* = fails
```

**The strategic implication:** The AD set is worth 40 points all-or-nothing. If you're confident in AD, prioritise it early. If you're weaker in AD, securing all 3 standalones (60 points) and getting a user flag somewhere gives you a path to 70.

---

## Metasploit Rules — Memorise These Cold

This is the most important rule set. Getting it wrong — using Metasploit in a prohibited way — means those points are invalidated.

### What COUNTS as Your 1 Metasploit Use

| Action | Counts? |
|--------|---------|
| `use exploit/` module to exploit a vulnerability | ✅ YES — this is your 1 use |
| `use auxiliary/` module (scanner, brute forcer, etc.) | ✅ YES — counts |
| `use post/` module (hashdump, getsystem, etc.) | ✅ YES — counts |
| `search` within msfconsole | ❌ NO — just searching is fine |

### What Does NOT Count (Unlimited Use)

| Action | Counts? |
|--------|---------|
| `use exploit/multi/handler` | ❌ NO — catch-all listener, unlimited |
| `msfvenom` payload generation | ❌ NO — unlimited |
| Meterpreter sessions obtained from your 1 allowed exploit | ❌ NO — the session itself is fine |
| `autoroute` if obtained from your 1 exploit | ❌ NO — allowed |

### Post-Exploitation After Using Your 1 Exploit

If you used your 1 exploit on Machine A:
- `post/multi/recon/local_exploit_suggester` on Machine A: ✅ allowed (you used the exploit on this machine)
- `post/windows/gather/hashdump` on Machine A: ✅ allowed
- Running any module on Machine B (where you got a shell manually): ❌ NOT allowed

The Metasploit allowance is per-machine, tied to the machine where you used the exploit module.

### Optimal Metasploit Strategy

```
Save your 1 use for:
  → The Hard standalone (most likely to need it)
  → OR the AD Client if everything else fails
  → NOT the Easy machine you could exploit manually in 30 minutes

Before using Metasploit:
  → Have you tried manual exploitation?
  → Have you tried all searchsploit options?
  → Are you genuinely stuck after 45+ minutes?
  → Is there another machine you should try first?
```

> [!danger] Using auxiliary modules costs your 1 use
> Many candidates forget that `use auxiliary/scanner/smb/smb_ms17_010` counts as their 1 Metasploit use. Use `nmap --script smb-vuln-ms17-010` instead for vulnerability scanning. NEVER use Metasploit auxiliary modules for scanning on OSCP.

---

## Prohibited Tools — The Explicit List

These tools are **banned for the duration of the exam**:

| Tool | Why Banned |
|------|-----------|
| `sqlmap` | Automated SQL injection exploitation |
| Commercial exploitation tools (Canvas, Core Impact) | Beyond Burp Suite Pro |
| AI assistants (ChatGPT, Claude, Copilot) | External intelligence assistance |
| Exploitation frameworks beyond MSF (1 use) | Mass automation |

**Posting to forums/Discord/Reddit during the exam:** Strictly prohibited. Asking for hints or guidance externally is an immediate fail and potential ban.

### What IS Allowed

```
✅ All manual exploitation
✅ All Kali Linux tools (used manually)
✅ Burp Suite Community or Professional
✅ Your own custom scripts and exploits
✅ Internet access for your own notes and research
✅ msfvenom (unlimited)
✅ multi/handler (unlimited)
✅ Impacket tools (psexec, secretsdump, GetUserSPNs, etc.)
✅ CrackMapExec / NetExec
✅ BloodHound and SharpHound
✅ PowerView, PowerUp, WinPEAS, LinPEAS
✅ Chisel, ligolo-ng, sshuttle
✅ Responder, ntlmrelayx
✅ Hydra, hashcat, John the Ripper
✅ Gobuster, ffuf, feroxbuster
✅ Nikto
✅ evil-winrm, Rubeus, mimikatz
✅ searchsploit (manual exploit research)
✅ Your Obsidian notes (offline)
```

---

## Exam Environment Setup

### VPN and Network

```bash
# Connect via provided .ovpn file:
sudo openvpn exam.ovpn &

# Verify connection:
ip a show tun0
# Should show your exam IP (e.g., 192.168.X.X or 10.X.X.X)

# Test connectivity to exam machines:
ping MACHINE_IP

# Your LHOST for all payloads = tun0 IP:
ip a show tun0 | grep "inet " | awk '{print $2}' | cut -d/ -f1
```

### Terminal Setup

Before the exam starts — have these open:

```
Terminal Layout (5 terminals minimum):
Tab 1: Main working terminal
Tab 2: Nmap scans running
Tab 3: Listener (nc -lvnp PORT)
Tab 4: Additional scans / web enumeration
Tab 5: Notes review / reference
```

### Note-Taking Tool

```bash
# Start CherryTree:
sudo apt install cherrytree
cherrytree &

# Pre-built template: (see S1-17 for full structure)
# Create nodes for each machine IP before exam starts
```

### Tools Verification Checklist

Before exam starts, verify these work:

```bash
# Confirm all tools are available:
which nmap gobuster ffuf burpsuite metasploit msfvenom impacket-psexec
which evil-winrm crackmapexec bloodhound-python responder
which john hashcat hydra searchsploit

# Verify wordlists exist:
ls /usr/share/wordlists/rockyou.txt
ls /usr/share/seclists/Discovery/Web-Content/common.txt
ls /usr/share/seclists/Discovery/Web-Content/raft-medium-words.txt

# Confirm SecLists installed:
ls /usr/share/seclists/

# Confirm impacket tools work:
impacket-secretsdump --help | head -3
impacket-GetUserSPNs --help | head -3

# Verify peass scripts:
ls /usr/share/peass/

# Start a test HTTP server:
python3 -m http.server 80 &
curl http://127.0.0.1/
kill %1

# Confirm BloodHound/Neo4j:
sudo neo4j status

# Verify tun0 gets an IP when connecting:
# (do this during a trial VPN connection before exam day)
```

---

## Proof Submission Protocol

Every time you get a shell, collect proof immediately — before doing anything else.

### Proof Screenshot Requirements

**All three must be in ONE screenshot:**
```
hostname
whoami (or id on Linux)
cat /root/proof.txt (or type C:\Users\Administrator\Desktop\proof.txt)
```

**Taking the screenshot:**
```bash
# Linux — stack all three in sequence:
hostname; id; cat /root/proof.txt

# Windows:
hostname && whoami && type C:\Users\Administrator\Desktop\proof.txt
```

**Screenshot naming convention:**
```
[IP]_user.png    → low-priv shell proof
[IP]_root.png    → root/SYSTEM proof
[IP]_[step].png  → important exploitation steps for report
```

### Submitting Flags

1. In the OSCP exam control panel (dashboard)
2. Enter the hash content from proof.txt
3. Mark the machine as compromised
4. **Do this immediately when you get each flag** — don't wait

> [!danger] Submit flags immediately when obtained
> If your VPN drops or the exam portal has issues near the end, you want all flags already submitted. Submit every flag the moment you capture it.

---

## Common Exam Failure Modes — What Costs Passes

### Technical Failures

**1. Wrong LHOST in payloads:**
```bash
# Always use tun0 — verify before every payload:
ip a show tun0 | grep inet
# Then hardcode that IP in msfvenom/shells
```

**2. Missing the full port scan:**
```bash
# Always run -p- in parallel with quick scan
# The vulnerable service is OFTEN on a non-standard port
```

**3. Skipping the AD set entirely:**
The AD set is 40 points. Even if you find it hard, spend at least 3 hours on it. Getting the Client machine alone (10 points) plus a partial path is valuable time.

**4. Not upgrading the shell:**
Working in a dumb netcat shell is slow and painful. Upgrade within 60 seconds of every Linux shell.

**5. SeImpersonatePrivilege not checked immediately:**
On every Windows shell — `whoami /priv` is the first command. PrintSpoofer/GodPotato from SeImpersonate is a 30-second SYSTEM escalation.

### Strategic Failures

**1. Spending too long on one machine:**
The 25-minute rule applies strictly on the exam. If you're stuck, move. Fresh eyes after working on other machines often reveal the answer.

**2. Not starting the report until after the exam:**
24 hours is not enough time to root machines AND write a report from scratch. Take notes during exploitation. The report should be 80% written by the time the exam ends.

**3. Not sleeping:**
23h 45m is a long time. Don't try to do it all without sleep. A 4-6 hour sleep block mid-exam (after securing 70 points) is better than 24 hours of diminishing returns.

**4. Missing the report deadline:**
The report is due 24 hours after the exam ends. Missing it by 1 minute = automatic fail. Submit at hour 20 of the report window at the latest.

---

## Exam Day Timeline — The Optimal Schedule

### Pre-Exam (Day Before)

```
□ Kali fully updated: sudo apt update && sudo apt upgrade -y
□ All tools verified (see checklist above)
□ Obsidian notes accessible offline (sync if cloud-based)
□ CherryTree template ready
□ Wordlists confirmed present
□ Good sleep (8 hours)
□ Meal prep — don't waste exam time cooking
□ VPN tested and working
□ Screen recording software ready (optional but recommended)
```

### Hour 0 — Exam Start

```
00:00 — Connect VPN, confirm tun0 IP
00:02 — Note all 5 machine IPs from exam dashboard
00:03 — Read entire exam guide/RoE one more time
00:05 — Launch ALL nmap scans simultaneously:
         nmap -sC -sV -T4 --min-rate 5000 -Pn -oA quick1 IP1 &
         nmap -sC -sV -T4 --min-rate 5000 -Pn -oA quick2 IP2 &
         nmap -sC -sV -T4 --min-rate 5000 -Pn -oA quick3 IP3 &
         nmap -sC -sV -T4 --min-rate 5000 -Pn -oA quick_client AD_CLIENT_IP &
         nmap -p- --min-rate 5000 -Pn -oA full1 IP1 &
         nmap -p- --min-rate 5000 -Pn -oA full2 IP2 &
         (continue for all machines)
00:10 — Start reading first Nmap results as they come in
00:15 — Begin web enumeration on any HTTP ports discovered
```

### Hours 0–4 — AD Set (Priority)

```
00:00–01:00 — Enumerate AD Client machine
01:00–02:00 — Exploit AD Client, begin Server enumeration
02:00–03:30 — Exploit Server, enumerate DC path
03:30–04:00 — Compromise DC, collect all AD proof
```

If you're not on the DC by hour 4, switch strategy:

```
OPTION A (ahead of schedule): Continue AD → SYSTEM on DC
OPTION B (behind schedule): Park AD, move to Easy standalone
Return to AD after getting Easy machine
```

### Hours 4–12 — Standalone Machines

```
04:00–06:00 — Easy standalone (target: <2 hours)
06:00–08:00 — Medium standalone (target: <3 hours)
08:00–12:00 — Hard standalone OR return to AD if needed
```

### Hours 12–20 — Exploitation Complete / Buffer

```
12:00 — Verify you have 70+ points submitted
12:00 — Begin writing report from CherryTree notes
16:00 — Report 50% complete — continue if more machines available
20:00 — Report 80% complete — focus on completing report
```

### Hours 20–23:45 — Exam Ends

```
20:00–22:00 — Final report polish
22:00 — Report reviewed and ready to submit
22:30 — SUBMIT report (don't wait for 23:45)
```

### Report Window (24 hours after exam)

```
Hour 0 of report window — convert notes to final report format
Hour 4 — First draft complete
Hour 8 — Proofread and add screenshots
Hour 16 — Final review
Hour 20 — SUBMIT (maximum — not hour 23:59)
```

---

## The Mental Game

**On getting stuck:** Stuck ≠ impossible. It means you haven't found the right vector yet. Step back, re-enumerate, look at what you haven't tried.

**On rabbit holes:** Every experienced OSCP candidate has spent 2+ hours on a rabbit hole. The exam is designed to test whether you can recognise and exit them. The 25-minute rule saves you.

**On missing 70 points:** If you hit hour 18 with 60 points, don't panic. One low-priv shell on an AD machine or one more flag on a standalone gets you there. Methodical enumeration, not speed, is what finds that last 10 points.

**On the report:** The report is worth as much as getting the flag. A machine rooted but poorly documented is worth fewer points than one fully documented with reproduction steps. Write as you go.

---

## Quick Reference — Exam Rules Summary

| Rule | Detail |
|------|--------|
| Exam duration | 23 hours 45 minutes |
| Report deadline | 24 hours after exam ends |
| Pass mark | 70/100 |
| AD set scoring | All-or-nothing (40 pts) |
| Metasploit | 1 exploit/auxiliary/post module — choose wisely |
| multi/handler | Unlimited |
| msfvenom | Unlimited |
| Banned tools | sqlmap, AI assistants, commercial exploitation tools |
| LHOST | Always tun0 IP — verify before every payload |
| Proof format | hostname + whoami + cat proof.txt in ONE screenshot |
| Partial credit | Yes for standalones (10 user + 10 root), No for AD |

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| OffSec PEN-200 course | The official OSCP prep course — complete all modules |
| OffSec practice labs | 6 practice machines included — treat each as a mini-exam |
| HTB Pro Labs — Dante | Best single OSCP prep lab (75+ machines, AD) |
| TJ Null's OSCP list | github.com/tjnull/OSCP-Stuff — curated HTB/VulnHub list |
| OSCP exam guide | Read it 3 times — know the rules cold before exam day |
| noraj report template | github.com/noraj/OSCP-Exam-Report-Template-Markdown |
