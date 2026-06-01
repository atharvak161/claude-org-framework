---
tags: [oscp-journey, spectre, stage-2, ejpt, exam-strategy]
module: 2
cert-stage: ejpt
difficulty: beginner
date: 2026-04-08
phantom-refs: []
netgod-refs: []
---

# S2-01 — eJPT Exam Format and Strategy

## What the eJPT Is

The eJPT (eLearnSecurity Junior Penetration Tester) is INE Security's entry-level penetration testing certification. It is a fully practical exam — you are given access to a real lab network and must answer questions by actually performing attacks. There are no multiple-choice theory questions that you can guess from a textbook.

**Why do eJPT before OSCP:**
- First certification validates foundational skills
- The exam environment builds confidence working in multi-host lab networks
- Pivoting concepts introduced here are expanded massively in PNPT and OSCP
- The pass rate is high for well-prepared candidates — good psychological foundation
- Employers recognise it as a genuine entry-level practical cert

---

## Exam Format — Everything You Need to Know

### Structure

| Component | Detail |
|-----------|--------|
| Format | Browser-based virtual lab |
| Duration | 48-hour window |
| Questions | 35 questions |
| Question type | Multiple choice — but require actual exploitation to answer correctly |
| Open notes | Yes |
| Open internet | Yes |
| Passing score | 70% (25/35 correct) |
| Attempts | 1 attempt included with purchase |
| Retake | Available for purchase |
| Certificate | Digital, shareable on LinkedIn |

### The Question Types

Questions are not theory — they're facts you can only discover by compromising the lab:

```
"What is the hostname of the machine at 192.168.1.15?"
→ You must compromise the machine and run hostname to answer

"What is the MD5 hash of /etc/passwd on the Linux target?"
→ You must get a shell and run: md5sum /etc/passwd

"What user is running the web application on target X?"
→ You must enumerate the service and find the running user

"What is the password of the user 'john' on the Windows machine?"
→ You must dump credentials and crack or find the password

"Which machine is the pivot point connecting the two subnets?"
→ You must enumerate both subnets and identify the dual-homed host
```

### What the Exam Network Looks Like

The eJPT lab simulates a small corporate environment:

```
Your Kali Machine
      │
      │ (VPN connection)
      │
[DMZ/External Network]
      │
   Router/Pivot Host
      │
[Internal Network]    ← Requires pivoting to reach
```

Key characteristics:
- Multiple machines across at least 2 subnets
- At least one machine acts as a pivot point between subnets
- Mix of Windows and Linux targets
- Services: HTTP, FTP, SSH, SMB, MySQL common
- One or more machines specifically require pivoting to reach

---

## The Pivoting Requirement — The Core eJPT Skill

The eJPT specifically tests whether you understand and can execute network pivoting. You will not be able to answer all questions without pivoting to the internal network.

**What pivoting means in the eJPT context:**

```
Your Kali → can reach → [External Network: 192.168.0.0/24]
Your Kali → CANNOT reach → [Internal Network: 10.10.10.0/24]

Pivot host = machine on BOTH networks (e.g., 192.168.0.15 AND 10.10.10.1)
You compromise the pivot host, then route traffic through it.
```

**The pivoting method that works best in the eJPT:**

```bash
# After compromising the pivot host:

# Method 1 — SSH Dynamic Forwarding (SOCKS proxy):
ssh -D 9050 -f -N user@PIVOT_HOST_IP
# Edit /etc/proxychains4.conf — ensure: socks5 127.0.0.1 9050
# Now use proxychains to reach internal network:
proxychains nmap -sT -Pn 10.10.10.0/24

# Method 2 — sshuttle (transparent proxy — no proxychains needed):
sshuttle -r user@PIVOT_HOST_IP 10.10.10.0/24
# After this, you can reach internal machines directly
```

Full pivoting methodology is covered in depth in S2-02 — this section is to make you aware the requirement exists so you don't get caught off-guard.

---

## Common eJPT Failures — What Trips People Up

### Failure 1 — Not Scanning All Hosts

The most common failure. Candidates scan the obvious machines and miss hosts that are only answerable by scanning the full subnet range.

**Solution:** Always run a full subnet sweep first:
```bash
nmap -sn 192.168.0.0/24           # Ping sweep — find all live hosts
nmap -sn 10.10.10.0/24            # After pivoting — sweep internal subnet
```

Never assume you know all the machines from the lab documentation. The lab may have more hosts than described.

### Failure 2 — Missing the Pivot Requirement

Candidates answer the external network questions, run out of things to do, and don't realise there's an entire second subnet they haven't reached.

**Solution:** After compromising your first machine, always check:
```bash
ip a                  # What interfaces does this machine have?
ip route              # What subnets can it reach?
cat /etc/hosts        # Does it know about other hosts?
arp -a                # What other machines has it talked to recently?
```

If a machine has two network interfaces on different subnets — that's your pivot point.

### Failure 3 — Not Taking Notes on Found Credentials

The eJPT has questions that require you to know credentials found during the assessment. Candidates find a username/password, use it to get a shell, then can't remember what it was when the question asks.

**Solution:** Maintain a credentials log:
```
CREDENTIALS FOUND:
- FTP: anonymous:anonymous on 192.168.0.10
- SSH: john:password123 on 192.168.0.15
- MySQL: root:[blank] on 10.10.10.20
- Web login: admin:admin on 192.168.0.10:8080
```

### Failure 4 — Wrong Tool Flags with Proxychains

Proxychains only supports TCP. Nmap with proxychains requires `-sT` (TCP connect scan) — the default SYN scan (`-sS`) uses raw sockets which don't work through proxychains.

```bash
# WRONG — will fail through proxychains:
proxychains nmap -sS 10.10.10.0/24

# CORRECT:
proxychains nmap -sT -Pn 10.10.10.0/24
# -sT = TCP connect scan (works through SOCKS proxy)
# -Pn = don't ping (ICMP doesn't work through SOCKS)
```

### Failure 5 — Not Reading Questions Carefully

Questions ask for specific values:
- "What is the hostname?" → exact hostname, case-sensitive
- "What is the MD5 hash?" → full 32-character hex string
- "What version is running?" → exact version string from banner

Read each question twice before answering.

---

## Time Management — 48 Hours

48 hours sounds like a lot. It isn't, if you waste it.

**Recommended schedule:**

**Day 1 — Hours 0–8: Full Enumeration**
```
Hour 0–1:  VPN connected, lab started
           Sweep all known subnets for live hosts
           Launch Nmap on all discovered hosts simultaneously
           
Hour 1–3:  Review Nmap results for all hosts
           Identify all open services
           Start web enumeration (gobuster) on any web services
           Note all service versions for CVE research

Hour 3–6:  Begin exploitation
           Easy/obvious footholds first
           Compromise pivot host — identify dual-homed network
           
Hour 6–8:  Set up pivoting
           Sweep internal subnet
           Begin answering questions that are now reachable
```

**Day 1 — Hours 8–16: Deep Exploitation**
```
Hour 8–12: Compromise internal network machines
           Harvest all credentials
           Answer questions as you go
           
Hour 12–16: Hard or remaining machines
            Review unanswered questions
            Re-check if you've missed any hosts
```

**Day 2 — Hours 24–36: Mop Up**
```
If you have unanswered questions:
- Re-read the question carefully
- Check if it requires a machine you haven't compromised yet
- Try alternative attack vectors
- Check if it requires pivoting you haven't set up

Hour 36–48: Final review
            Submit answers
            Don't rush — verify each answer
```

**Target: Finish exploitation in first 12 hours, spend remaining time on questions**

---

## Tools Available and Strategy

The eJPT is open-notes and open-internet. You have access to:
- All Kali tools
- Your OSCP Journey notes (use them)
- Google, exploit-db.com, hacktricks.xyz
- Metasploit (fully allowed — no restrictions unlike OSCP)

**Metasploit is fully allowed on eJPT.** Use it freely for exploitation. This is intentional — the eJPT tests whether you can compromise systems, not whether you can do it manually. Use Metasploit where it saves time.

**Core tool list for eJPT:**

```bash
# Host discovery:
nmap -sn SUBNET/24

# Port scanning:
nmap -sC -sV -T4 -oA scan TARGET

# Web enumeration:
gobuster dir -u http://TARGET -w /usr/share/seclists/Discovery/Web-Content/common.txt
nikto -h http://TARGET

# SMB:
smbclient -L //TARGET -N
enum4linux TARGET

# Exploitation:
msfconsole                    # Fully allowed
searchsploit SERVICE VERSION  # Manual exploits

# Pivoting:
ssh -D 9050 user@PIVOT        # SOCKS proxy
sshuttle -r user@PIVOT SUBNET # Transparent proxy

# Post-exploitation:
linpeas.sh                    # Linux enum
winpeas.exe                   # Windows enum
```

---

## The eJPT Exam Approach — Step by Step

Follow this exact sequence when the exam starts:

**Step 1 — Read the exam brief**
The lab brief will tell you:
- The IP range(s) to test
- The objectives
- Any specific credentials or starting information provided

Read it fully before touching anything.

**Step 2 — Map the network**
```bash
nmap -sn PROVIDED_SUBNET/24 --min-rate 5000    # Find all live hosts
# List every IP that's alive
```

**Step 3 — Scan everything simultaneously**
```bash
# Launch Nmap against all discovered hosts in background tabs:
nmap -sC -sV -T4 --min-rate 5000 -oA host1 IP1 &
nmap -sC -sV -T4 --min-rate 5000 -oA host2 IP2 &
nmap -sC -sV -T4 --min-rate 5000 -oA host3 IP3 &
```

**Step 4 — Read all 35 questions first**
Before you start exploiting, read every question. This tells you:
- What information you need to collect
- Which machines matter most
- Whether you need passwords, files, hashes, or hostnames

**Step 5 — Enumerate and exploit methodically**
For each host:
1. Check banner/version from Nmap
2. Test obvious vulnerabilities (anonymous FTP, default creds, known CVEs)
3. Run web enumeration if HTTP exists
4. Exploit and get a shell
5. Collect all data: hostname, running users, interesting files, credentials
6. Check for second network interface (pivot potential)

**Step 6 — Set up pivoting as soon as you find the pivot host**
Don't delay this. Once you find a dual-homed machine, compromise it and set up the pivot immediately. All subsequent work on internal machines depends on this.

**Step 7 — Answer questions as you go**
Every time you get new information, check if it answers any open questions. Don't wait until the end.

---

## Quick Reference — eJPT Specific Commands

```bash
# Network discovery:
nmap -sn 192.168.0.0/24 --min-rate 5000

# Identify pivot host (look for dual interfaces):
ip a                    # On each compromised machine
ip route                # Check routing table

# Set up SOCKS proxy through pivot:
ssh -D 9050 -N -f user@PIVOT_IP
echo "socks5 127.0.0.1 9050" | sudo tee -a /etc/proxychains4.conf

# Scan through proxy:
proxychains nmap -sT -Pn 10.10.10.0/24 --min-rate 1000

# sshuttle alternative:
sshuttle -r user@PIVOT_IP 10.10.10.0/24 --ssh-cmd "ssh -i id_rsa"

# Get hostname (for questions):
hostname
cat /etc/hostname

# Get file hash (for questions):
md5sum /etc/passwd
sha256sum /path/to/file

# Find specific files (for questions):
find / -name "flag.txt" 2>/dev/null
find / -name "*.txt" 2>/dev/null | xargs grep -l "flag\|secret" 2>/dev/null

# Check running user of a process:
ps aux | grep apache
ps aux | grep mysql
```

---

## Common Mistakes

> [!warning] Don't make these in the eJPT
> 1. **Not reading all questions before starting.** Questions tell you exactly what to look for. Reading them first shapes your entire approach.
> 2. **Stopping after the external network.** There's always an internal network. Find the pivot host and get there.
> 3. **Using nmap -sS through proxychains.** It silently fails. Always `-sT -Pn` when using proxychains.
> 4. **Not noting credentials as you find them.** Questions will ask for them later. Write down every credential immediately.
> 5. **Ignoring FTP and SMB anonymous access.** eJPT machines frequently have anonymous FTP or null session SMB with important files. Always test these first.
> 6. **Not checking /etc/hosts on compromised machines.** Internal hostnames are often mapped here — tells you what other machines exist.

---

## What the eJPT Prepares You For

Passing eJPT proves you can:
- Enumerate a multi-host network from scratch
- Identify and exploit common vulnerabilities
- Pivot through a compromised host to reach an internal network
- Work methodically under time pressure
- Operate in a realistic lab environment

These are the exact skills PNPT and OSCP build on. The eJPT is not just a cert — it's a skills checkpoint.

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| INE Free Starter Pass | Free access to the Penetration Testing Student course — this is the eJPT prep course |
| TryHackMe — "Jr Penetration Tester" path | All Stage 1 content applies directly |
| TryHackMe — "Lateral Movement and Pivoting" | Pivoting lab practice — critical for eJPT |
| HTB Starting Point | Free tier machines that mirror eJPT difficulty |
| TryHackMe — "Wreath" network | Multi-machine pivoting network — best single eJPT prep lab |
| TryHackMe — "Holo" network | More advanced multi-machine network |
