---
tags: [oscp-journey, spectre, stage-5, oscp, stuck, decision-tree, troubleshooting]
module: 5
cert-stage: oscp
difficulty: intermediate
date: 2026-04-08
phantom-refs: []
netgod-refs: []
---

# S5-04 — What To Do When Stuck (OSCP Decision Tree)

## The Psychology of Being Stuck

Being stuck on the OSCP exam is normal. Every candidate gets stuck. The difference between passing and failing is not whether you get stuck — it's how efficiently you recognise it and how methodically you respond.

The worst thing you can do when stuck is continue doing the same thing harder. The second worst is panicking and randomly trying things without structure. The correct response is systematic: stop, assess, enumerate what you haven't tried, try it methodically.

**The fundamental rule:** If you haven't found the attack path, you haven't finished enumerating.

---

## Signs You Are Stuck (vs Making Progress)

**You are STUCK when:**
- You've run the same tool with the same flags 3+ times
- You've been on the same attack vector for 25+ minutes with zero new information
- You're Googling increasingly specific phrases with no results
- You're modifying an exploit for the 5th time with the same error
- You feel frustrated and are making decisions based on that frustration

**You are NOT stuck (just slow) when:**
- You're waiting for a scan to complete
- You've confirmed one vector doesn't work and are moving to the next
- You're reading documentation to understand a tool better
- You've found new information but haven't exploited it yet

---

## The Master Decision Tree — No Foothold Yet

Work through this top to bottom. Don't skip steps.

### Branch 1 — Have You Actually Completed Enumeration?

```
□ Did you run nmap -p- (ALL 65535 ports)?
  NO → Run it now: nmap -p- -T4 --min-rate 5000 -Pn TARGET
  
□ Did you run a UDP scan?
  NO → Run: nmap -sU --top-ports 100 -Pn TARGET
  
□ For every HTTP/HTTPS port found — did you run gobuster?
  NO → Run gobuster on every web port, including non-standard (8080, 8443, 8888)
  
□ Did you try gobuster with raft-medium-words.txt (not just common.txt)?
  NO → Run the medium wordlist
  
□ Did you try all relevant extensions?
  NO → Add: -x php,aspx,jsp,html,txt,bak,zip,old,conf,config
  
□ Did you do vhost enumeration?
  NO → Run: ffuf -u http://TARGET -H "Host: FUZZ.domain.htb" -w subdomains-5000.txt -fs BASELINE
  
□ For every service found — did you searchsploit the EXACT version?
  NO → Run: searchsploit [service] [exact version number]
  
□ Did you try default credentials on EVERY service with a login?
  NO → Try admin:admin, admin:password, [service name]:[service name] etc.
```

### Branch 2 — Web Application Not Yielding

```
□ Have you viewed the source of EVERY page?
  NO → Ctrl+U on every page — look for comments, hidden inputs, paths

□ Have you read all JavaScript files?
  NO → grep -r "pass\|key\|token\|api\|endpoint" all JS files

□ Have you tested every input field?
  NO → Test each with: ' (SQLi), <script>alert(1)</script> (XSS), 
       ../../etc/passwd (traversal), ; id (CMDi)

□ Have you tested different HTTP methods?
  NO → curl -X OPTIONS, PUT, DELETE, PATCH on interesting endpoints

□ Have you checked robots.txt, .git/, .env, sitemap.xml?
  NO → curl http://TARGET/robots.txt etc.

□ Have you checked the SSL certificate for alternative hostnames?
  NO → echo | openssl s_client -connect TARGET:443 | openssl x509 -noout -text | grep DNS

□ Have you run Nikto?
  NO → nikto -h http://TARGET

□ Is there a login form you haven't tried to bypass?
  NO → Test: ' OR '1'='1 and ' OR 1=1-- in username field

□ Is there an API? Have you fuzzed its endpoints?
  NO → gobuster dir -u http://TARGET/api -w api-endpoints.txt
```

### Branch 3 — SMB Not Yielding

```
□ Did you try null session with smbmap AND smbclient AND enum4linux?
  NO → Run all three: smbmap -H TARGET; smbclient -L //TARGET -N; enum4linux-ng TARGET

□ Did you recursively download EVERYTHING from readable shares?
  NO → smbget -R smb://TARGET/SHARENAME --no-pass; download and search locally

□ Did you check SYSVOL for GPP passwords?
  NO → smbclient //TARGET/SYSVOL -N; search for Groups.xml, Services.xml

□ Did you check NETLOGON scripts for credentials?
  NO → smbclient //TARGET/NETLOGON -N; get all .bat, .vbs, .ps1 files

□ Did you run smb-vuln-* NSE scripts?
  NO → nmap --script "smb-vuln-*" -p445 TARGET
```

### Branch 4 — FTP Not Yielding

```
□ Did you test anonymous login?
  NO → ftp TARGET → user: anonymous → pass: (blank or anonymous)

□ Did you recursively download EVERYTHING from FTP?
  NO → wget -m ftp://anonymous:@TARGET

□ Did you check FTP for write access?
  NO → ftp TARGET → try: put testfile.txt

□ Did you searchsploit the exact FTP service version?
  NO → check banner: nc TARGET 21; then searchsploit [service version]
```

### Branch 5 — Have Valid Credentials But No Shell

```
□ Did you try the credentials on ALL services (SSH, FTP, RDP, WinRM, SMB)?
  NO → Try each: ssh user@TARGET; evil-winrm -i TARGET -u user -p pass;
       crackmapexec smb TARGET -u user -p pass

□ Did you try the password as the username (and vice versa)?
  NO → Try both combinations

□ Did you try the credentials on all other discovered machines?
  NO → crackmapexec smb SUBNET/24 -u user -p pass --continue-on-success

□ Did you try the credentials against web app logins?
  NO → Try logging into every web application found

□ Did you try the password with common variations?
  NO → Try: Password1!, password!, [password]123, [Password]2024
```

### Branch 6 — Have Shell But Can't Find PrivEsc

Jump to the PrivEsc decision tree below.

---

## The PrivEsc Decision Tree — Linux

You have a shell. You can't find the PrivEsc vector.

```
□ Have you run sudo -l?
  → Every binary: look up on GTFOBins → sudo section

□ Have you found ALL SUID binaries?
  → find / -perm -4000 -type f 2>/dev/null
  → Every result: look up on GTFOBins → SUID section

□ Have you run LinPEAS AND read EVERY red/yellow line?
  → Not skimmed — actually read each one
  → /tmp/lp.sh 2>/dev/null | tee /tmp/out.txt; less -r /tmp/out.txt

□ Have you run pspy64 for at least 5 minutes?
  → Watch for UID=0 processes running on a schedule

□ Have you checked capabilities?
  → getcap -r / 2>/dev/null
  → cap_setuid + python/perl = instant root

□ Have you checked /etc/crontab AND /etc/cron.d/* AND user crontabs?
  → cat /etc/crontab; ls /etc/cron.d/; crontab -l

□ Have you checked NFS exports?
  → cat /etc/exports; showmount -e TARGET (from Kali)
  → Look for no_root_squash

□ Have you checked your group memberships?
  → id → docker? lxd? disk? adm?
  → Docker group = instant root

□ Have you looked at ALL config files for credentials?
  → find /var/www -name "*.php" | xargs grep -l "password" 2>/dev/null
  → find / -name ".env" 2>/dev/null | xargs cat 2>/dev/null

□ Have you checked bash history for all users you can read?
  → cat /home/*/.bash_history 2>/dev/null

□ Have you checked for writable /etc/passwd?
  → ls -la /etc/passwd → world-writable? → add root user

□ Have you checked internal services?
  → ss -tulpn | grep 127.0.0.1 → port forward each to Kali

□ Is the kernel version old?
  → uname -r → searchsploit linux kernel [version] local privilege
  → LAST resort — crashes systems
```

---

## The PrivEsc Decision Tree — Windows

You have a shell. You can't find the PrivEsc vector.

```
□ Have you checked whoami /priv for SeImpersonatePrivilege?
  → SeImpersonatePrivilege = PrintSpoofer or GodPotato → SYSTEM in 30 seconds

□ Have you run WinPEAS AND read every red finding?
  → C:\Temp\wp.exe 2>&1 | findstr /i "[+]"

□ Have you checked AlwaysInstallElevated?
  → reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
  → reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
  → Both 0x1? → msfvenom MSI → SYSTEM

□ Have you checked cmdkey /list for saved credentials?
  → cmdkey /list → runas /savecred /user:MACHINE\Administrator cmd

□ Have you checked unquoted service paths?
  → wmic service get name,pathname,startmode | findstr /i auto | findstr /i /v "C:\Windows\\"

□ Have you checked service binary permissions?
  → accesschk.exe /accepteula -uwcqv "Authenticated Users" *
  → icacls "C:\path\to\service.exe"

□ Have you read PowerShell history?
  → type $env:APPDATA\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt

□ Have you searched the registry for passwords?
  → reg query HKLM /f password /t REG_SZ /s
  → reg query "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon"

□ Have you searched files for passwords?
  → findstr /si password C:\Users\*.txt C:\Users\*.xml C:\inetpub\*.config

□ Have you checked Unattend.xml files?
  → type C:\Windows\Panther\Unattend.xml 2>nul
  → type C:\Windows\sysprep\sysprep.xml 2>nul

□ Have you checked scheduled tasks?
  → schtasks /query /fo LIST /v | findstr /i "task name\|run as\|task to run"

□ Is the OS old with missing patches?
  → systeminfo → wmic qfe list → searchsploit [Windows version] local
  → MS16-032, MS15-051, etc.
```

---

## The AD Decision Tree — Stuck on the AD Set

```
NO INITIAL CREDENTIALS:
□ Did you kerbrute userenum with a good wordlist?
□ Did you AS-REP roast the discovered usernames?
□ Did you try null session SMB / LDAP anonymous?
□ Did you check SYSVOL for GPP passwords?
□ Did you check for a web application on port 80/8080?
□ Did you check DNS zone transfer?
□ Did you try password spray with Password1/Welcome1?

HAVE CREDENTIALS, STUCK ON PATH:
□ Did you run BloodHound and mark your user as Owned?
□ Did you run "Shortest Paths from Owned Principals to DA"?
□ Did you Kerberoast all service accounts?
□ Did you check all SMB shares recursively?
□ Did you check SYSVOL for GPP passwords with these creds?
□ Did you check every BloodHound edge's Abuse Info panel?
□ Did you check ACLs with Invoke-ACLScanner?

STUCK ON LATERAL MOVEMENT:
□ Did you dump credentials from current machine (secretsdump/mimikatz)?
□ Did you try PTH with ALL dumped hashes against ALL machines?
□ Did you try the cracked passwords on ALL machines?
□ Did you check which machines your current user has sessions on?
□ (BloodHound: "Find Computers where X has Sessions")
```

---

## The "Fresh Eyes" Reset Protocol

When you've been on a machine for 60+ minutes with no progress, do this:

**Step 1 — Stop all active work on that machine.**
Close the terminals. Don't look at the output.

**Step 2 — Write a 5-line summary:**
```
Machine: 10.10.10.X
Services found: [list every port/service]
Tried: [list every attack vector attempted]
Results: [what each attempt showed — not "failed" but specific output]
Haven't tried yet: [honest list]
```

**Step 3 — Review the summary with fresh eyes.**
Often, writing "haven't tried yet" reveals an obvious gap.

**Step 4 — Switch to a different machine for 30 minutes.**
Work on something else. Come back.

**Step 5 — When you return:**
- Re-read your Nmap output from scratch
- Look at every port as if you've never seen it
- Ask: "What would happen if I connected to port X manually?"

---

## Specific Error Messages — What They Mean

### Reverse Shell Received Then Immediately Dropped

```
Problem: Shell connects, shows one line, then dies
Causes:
  1. Payload architecture mismatch (32-bit payload on 64-bit target)
     Fix: use windows/x64/shell_reverse_tcp instead of windows/shell_reverse_tcp
  
  2. Staged payload with nc listener (nc can't handle staged payloads)
     Fix: use stageless (shell_reverse_tcp not shell/reverse_tcp)
     OR use multi/handler instead of nc

  3. AV killed the payload
     Fix: try different encoding or different payload type
```

### exploit/multi/handler — No Session Created

```
Problem: Payload executes, handler shows nothing
Causes:
  1. LHOST set to wrong IP (eth0 instead of tun0)
     Fix: set LHOST tun0

  2. Firewall blocking inbound on your port
     Fix: try port 443 or 80

  3. Payload format wrong for target
     Fix: verify 32/64-bit match

  4. nc competing with multi/handler on same port
     Fix: kill nc first, then run multi/handler
```

### SSH "Permission denied (publickey)"

```
Problem: SSH rejects password auth
Causes:
  1. Password auth disabled on server
     Check: nmap --script ssh-auth-methods -p22 TARGET
     Fix: Find the private key — it's the only way in

  2. Wrong password
     Fix: try other found credentials

  3. Username wrong
     Fix: check /etc/passwd for valid users with login shells
```

### SMB "STATUS_ACCESS_DENIED"

```
Problem: Valid credentials but can't access shares
Causes:
  1. Local account filtered by Remote UAC
     Fix: add --local-auth flag in CME; or target the RID-500 Administrator

  2. Share permissions restrict this user
     Fix: enumerate other shares; try different users

  3. SMB signing required and you're trying to relay
     Fix: signing required = can't relay; target different machine
```

### "Module not found" / Import Errors in Python Exploits

```
Problem: Python exploit fails with import error
Causes:
  1. Missing dependency
     Fix: pip3 install [module_name]

  2. Python 2 script being run with Python 3
     Fix: python2 exploit.py (check shebang line: #!/usr/bin/python)

  3. Impacket not installed for current Python
     Fix: pip3 install impacket
```

### hashcat "Token length exception"

```
Problem: hashcat errors on the hash
Causes:
  1. Wrong hash mode (-m)
     Fix: hashid HASH -m → use correct mode number

  2. Hash contains username (e.g., "user::DOMAIN:hash")
     Fix: add --username flag to hashcat

  3. Hash file has Windows line endings
     Fix: dos2unix hashes.txt
```

---

## The "Nothing Works" Protocol — Last 2 Hours

You have 2 hours left. You need 10 more points. Do this exactly:

```
Step 1: List every machine with its current state
  Machine A: Rooted (30 pts)
  Machine B: User shell (10 pts), no root yet
  Machine C: No access (0 pts)
  AD Client: No access (0 pts)

Step 2: Find the fastest 10 points
  Option A: Root Machine B (10 pts)
    → What PrivEsc vectors haven't been tried?
    → Run WinPEAS/LinPEAS fresh, read it fully
    
  Option B: User shell on Machine C (10 pts)
    → What service haven't you exploited?
    → Default credentials on the web app?
    
  Option C: AD Client user shell (10 pts)
    → Is there a web app on the client machine?
    → Password spray one more time with different password?

Step 3: Execute the fastest option with maximum focus
  → 25-minute rule in effect — strict

Step 4: If no progress after 45 minutes
  → Stop machine attempts
  → Focus entirely on report quality
  → A well-written 60-point report passes with bonus points for methodology
```

---

## Quick Reference — Stuck Checklist

```
NO FOOTHOLD:
□ nmap -p- completed? (all 65535 ports)
□ UDP scanned?
□ gobuster with raft-medium-words.txt?
□ vhost enumeration done?
□ All service versions searchsploited?
□ Default credentials tried on every login?
□ Every web page source viewed?
□ All JavaScript files read?
□ robots.txt, .git/, .env checked?
□ SMB: null session, all shares explored recursively?
□ FTP: anonymous login, recursive download?
□ Found credentials tried on ALL services?

LINUX PRIVESC STUCK:
□ sudo -l → GTFOBins?
□ SUID: find / -perm -4000 → GTFOBins?
□ LinPEAS read fully (not skimmed)?
□ pspy64 run for 5+ minutes?
□ Capabilities: getcap -r /?
□ Crontab and /etc/cron.d/* checked?
□ Config files searched for passwords?
□ Internal services (ss -tulpn | grep 127)?
□ Group memberships (docker, lxd, disk)?
□ /etc/passwd writable?

WINDOWS PRIVESC STUCK:
□ whoami /priv → SeImpersonatePrivilege?
□ AlwaysInstallElevated (2 reg queries)?
□ WinPEAS read fully?
□ cmdkey /list?
□ Unquoted service paths?
□ Service binary permissions?
□ PowerShell history?
□ Registry password search?
□ Scheduled task scripts writable?
□ Unattend.xml files?
```

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| HTB — any machine you're stuck on | Apply this decision tree systematically before looking at hints |
| TryHackMe — "Windows PrivEsc Arena" / "Linux PrivEsc Arena" | Dedicated stuck-practice — limited hints available |
| HackTricks (book.hacktricks.xyz) | The most comprehensive "what to try next" reference available |
| GTFOBins (gtfobins.github.io) | Every binary exploitable via sudo/SUID — open this before anything else |
| LOLBAS (lolbas-project.github.io) | Windows equivalent of GTFOBins |
| PayloadsAllTheThings (GitHub) | Comprehensive payloads and techniques for every vulnerability class |
