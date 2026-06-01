---
tags: [oscp-journey, spectre, stage-1, authentication, password-cracking, hydra, hashcat, john]
module: 1
cert-stage: thm
difficulty: beginner
date: 2026-04-08
phantom-refs: []
netgod-refs: []
---

# S1-12 — Authentication Attacks and Password Cracking

## Why Authentication Attacks Matter on OSCP

Every OSCP machine has credentials somewhere. Sometimes you crack them from a hash. Sometimes you brute force a login. Sometimes you spray a known password across services. The ability to attack authentication is not optional — it's a core skill you'll use on nearly every machine.

This note covers:
- Online attacks (brute forcing live services)
- Offline attacks (cracking captured hashes)
- Username enumeration
- Default credentials
- Password spraying strategy

---

## Hydra — Online Brute Force Tool

Hydra is the standard tool for brute forcing network authentication services. It supports dozens of protocols and sends credentials directly to the live service.

### Installation

```bash
sudo apt install hydra    # Already on Kali
```

### Core Syntax

```bash
hydra -l USERNAME -p PASSWORD SERVICE://TARGET
hydra -l USERNAME -P WORDLIST SERVICE://TARGET
hydra -L USERLIST -p PASSWORD SERVICE://TARGET
hydra -L USERLIST -P WORDLIST SERVICE://TARGET
```

| Flag | Meaning |
|------|---------|
| `-l` | Single username (lowercase L) |
| `-L` | Username wordlist file |
| `-p` | Single password |
| `-P` | Password wordlist file |
| `-s PORT` | Non-default port |
| `-t N` | Threads per target (default: 16) |
| `-f` | Stop after first valid credential found |
| `-F` | Stop on first valid pair per host |
| `-v` | Verbose (show attempts) |
| `-V` | Very verbose (show every attempt) |
| `-o FILE` | Output results to file |
| `-e nsr` | Try `n`=null password, `s`=same as username, `r`=reversed username |
| `-w N` | Wait N seconds for response |
| `-x MIN:MAX:CHARS` | Generate passwords on the fly (brute force mode) |
| `-u` | Loop users first, not passwords (changes iteration order) |
| `-I` | Ignore resume file — start fresh |

### Protocol Modules — Every Important One

**SSH:**
```bash
hydra -l root -P /usr/share/wordlists/rockyou.txt ssh://TARGET
hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://TARGET -t 4 -f
# -t 4 = 4 threads (SSH rate limits — too many threads = connection refused)
```

**FTP:**
```bash
hydra -l admin -P /usr/share/wordlists/rockyou.txt ftp://TARGET
hydra -L users.txt -P /usr/share/wordlists/rockyou.txt ftp://TARGET -t 10
```

**RDP:**
```bash
hydra -l administrator -P /usr/share/wordlists/rockyou.txt rdp://TARGET
hydra -L users.txt -p 'Password1' rdp://TARGET -t 4
# RDP is rate-limited — keep threads low
```

**SMB:**
```bash
hydra -l administrator -P /usr/share/wordlists/rockyou.txt smb://TARGET
# Better: use CrackMapExec for SMB brute force (see below)
```

**MySQL:**
```bash
hydra -l root -P /usr/share/wordlists/rockyou.txt mysql://TARGET
```

**MSSQL:**
```bash
hydra -l sa -P /usr/share/wordlists/rockyou.txt mssql://TARGET
```

**SMTP:**
```bash
hydra -l user@domain.com -P /usr/share/wordlists/rockyou.txt smtp://TARGET
```

**POP3:**
```bash
hydra -l user -P /usr/share/wordlists/rockyou.txt pop3://TARGET
```

**VNC:**
```bash
hydra -P /usr/share/wordlists/rockyou.txt vnc://TARGET
# VNC has no username — only password
```

---

### Hydra HTTP Form — The Most Important and Most Confusing Module

HTTP POST form brute force is the most commonly needed but most syntax-confusing Hydra module.

**Syntax:**
```bash
hydra -l admin -P /usr/share/wordlists/rockyou.txt TARGET http-post-form "/path:params:FAIL_STRING"
```

The third argument has three colon-separated fields:
1. **`/path`** — URL path of the login form endpoint
2. **`params`** — POST body with `^USER^` and `^PASS^` as placeholders
3. **`FAIL_STRING`** — a string that appears in the response on **failed** login

**Full example — standard login form:**
```bash
hydra -l admin -P /usr/share/wordlists/rockyou.txt 10.10.10.100 http-post-form \
  "/login:username=^USER^&password=^PASS^:Invalid credentials"
```

**Breaking it down:**
- `/login` = the action URL the form POSTs to (check form's `action=` attribute)
- `username=^USER^&password=^PASS^` = POST body (match the form field `name=` attributes)
- `Invalid credentials` = text that appears in the response when login **fails**

**Finding the correct values:**
1. Open Burp Suite → Intercept the login request → note the URL path and POST body
2. Try a wrong password → note what text appears in the response (this is your fail string)

**Example with a session cookie (for forms requiring cookies):**
```bash
hydra -l admin -P /usr/share/wordlists/rockyou.txt TARGET http-post-form \
  "/login:username=^USER^&password=^PASS^&csrf_token=TOKENVALUE:F=Invalid" \
  -H "Cookie: session=abc123"
```

**HTTP GET form:**
```bash
hydra -l admin -P /usr/share/wordlists/rockyou.txt TARGET http-get-form \
  "/login:username=^USER^&password=^PASS^:Invalid"
```

**HTTP Basic Auth:**
```bash
hydra -l admin -P /usr/share/wordlists/rockyou.txt TARGET http-get /admin/
# http-get sends Basic Auth header automatically
```

> [!warning] Hydra http-post-form common failures
> 1. Wrong fail string — if your fail string doesn't appear in the response, Hydra marks everything as success. Verify in Burp first.
> 2. Wrong POST body — the field names must exactly match the form's `name=` attributes. Check with Burp.
> 3. CSRF token — if the form has a CSRF token, you need to fetch it first and include it. Use ffuf or a custom script for CSRF-protected forms.
> 4. Port not specified for HTTPS — use `https-post-form` instead of `http-post-form`.

---

## Medusa — Alternative to Hydra

Medusa is similar to Hydra. Use it when Hydra fails or for specific protocols.

```bash
medusa -h TARGET -u admin -P /usr/share/wordlists/rockyou.txt -M ssh
medusa -h TARGET -U users.txt -P passwords.txt -M ftp -t 10

# Flags:
# -h TARGET    = host
# -u USER      = single username
# -U FILE      = username file
# -p PASS      = single password
# -P FILE      = password file
# -M MODULE    = protocol module
# -t N         = threads
# -f           = stop on first success
```

---

## CrackMapExec (CME/NetExec) — SMB and WinRM Attacks

CrackMapExec (now called **netexec** or `nxc` on newer Kali) is the standard tool for attacking Windows services at scale. It's faster and more feature-rich than Hydra for SMB/WinRM.

```bash
# CME is installed as crackmapexec or cme:
crackmapexec smb TARGET -u admin -p password
# Or newer alias:
netexec smb TARGET -u admin -p password
nxc smb TARGET -u admin -p password
```

**SMB brute force:**
```bash
crackmapexec smb TARGET -u users.txt -p passwords.txt
crackmapexec smb TARGET -u admin -p /usr/share/wordlists/rockyou.txt
crackmapexec smb 192.168.1.0/24 -u admin -p 'Password1' --continue-on-success
```

**WinRM brute force:**
```bash
crackmapexec winrm TARGET -u admin -p /usr/share/wordlists/rockyou.txt
```

**Reading output:**
```
SMB    10.10.10.100  445  DC01  [+] domain\admin:Password1 (Pwn3d!)
# [+] = valid credentials
# (Pwn3d!) = you have admin access on this host
```

```
SMB    10.10.10.100  445  DC01  [-] domain\admin:wrongpass STATUS_LOGON_FAILURE
# [-] = invalid credentials
# STATUS_ACCOUNT_LOCKED_OUT = account is locked (stop immediately)
```

> [!danger] STATUS_ACCOUNT_LOCKED_OUT
> If you see this, stop the brute force immediately. The account is now locked and you've potentially alerted defenders. Hydra's `-f` flag and CME's `--continue-on-success` help, but always check the password policy before brute forcing AD accounts.

---

## Username Enumeration

Before you can brute force, you need usernames. Several techniques reveal valid usernames without credentials.

### Error Message Enumeration

Some applications give different error messages for invalid username vs invalid password:
- `"Username not found"` — username is wrong
- `"Invalid password"` — username is valid, password is wrong

This directly reveals valid usernames. Test by submitting known-invalid usernames vs plausible ones.

### Timing Attack Enumeration

Some applications take slightly longer to process a valid username (because they look up the user then check the password) vs an invalid one (rejected immediately). Measure response times to enumerate valid usernames.

Burp Intruder + timing analysis, or use ffuf with response time filtering.

### SMTP VRFY and EXPN

SMTP servers can reveal valid email addresses/usernames:

```bash
# VRFY — verify if an address exists:
nc -nv TARGET 25
EHLO test
VRFY admin@domain.com
VRFY root
# 252 = user exists (may be forwarded)
# 550 = user does not exist

# EXPN — expand a mailing list:
EXPN admins
```

**smtp-user-enum tool:**
```bash
smtp-user-enum -M VRFY -U /usr/share/seclists/Usernames/top-usernames-shortlist.txt -t TARGET
smtp-user-enum -M RCPT -U users.txt -t TARGET -p 25
```

### Kerbrute — Username Enumeration via Kerberos (AD)

Active Directory Kerberos pre-authentication reveals whether a username exists — it returns a different error for invalid usernames vs invalid passwords. No credentials needed.

```bash
kerbrute userenum --dc DC_IP -d domain.local /usr/share/seclists/Usernames/xato-net-10-million-usernames.txt
kerbrute userenum --dc DC_IP -d domain.local users.txt -o valid_users.txt
```

---

## Default Credentials

Before brute forcing, always try default credentials. A shocking number of services are deployed with defaults never changed.

**Common default credentials by service:**

| Service | Common Defaults |
|---------|----------------|
| Tomcat Manager | `admin:admin`, `tomcat:tomcat`, `admin:s3cret`, `tomcat:s3cret`, `admin:tomcat` |
| Jenkins | `admin:admin`, `admin:password`, (sometimes no auth) |
| JBoss/WildFly | `admin:admin`, `admin:password` |
| phpMyAdmin | `root:` (blank), `root:root`, `root:password` |
| MySQL | `root:` (blank), `root:root` |
| MSSQL | `sa:` (blank), `sa:sa`, `sa:password` |
| Oracle DB | `sys:change_on_install`, `system:manager`, `scott:tiger` |
| Redis | No auth (connect directly) |
| MongoDB | No auth (connect directly on older versions) |
| Elasticsearch | No auth on port 9200 |
| VNC | Often blank password |
| Printers/network devices | `admin:admin`, `admin:password`, `admin:1234` |
| Router admin panels | `admin:admin`, `admin:password`, `root:root` |
| Cisco IOS | `cisco:cisco`, `admin:cisco` |
| VMware vCenter | `administrator@vsphere.local:vmware` |

**Resource:** DefaultCreds-cheat-sheet on GitHub — a comprehensive list searchable by vendor/product:
```bash
# Search locally after cloning:
cat DefaultCreds-Cheat-Sheet.csv | grep -i "tomcat"
```

**Online resource:** `https://github.com/ihebski/DefaultCreds-cheat-sheet`

> [!tip] MUSCLE MEMORY — always try defaults first
> Before spinning up Hydra, spend 2 minutes trying the most common defaults manually. Getting in with `admin:admin` in 30 seconds beats 10 minutes of brute force.

---

## Password Spraying vs Brute Force

| Technique | What it does | When to use |
|-----------|-------------|------------|
| **Brute force** | Try many passwords against one account | Offline hash cracking, or online when no lockout policy |
| **Password spraying** | Try ONE password against many accounts | Active Directory — avoids lockout thresholds |

**Why spray instead of brute force AD?**
Active Directory locks accounts after a set number of failed attempts (typically 5). If you brute force `Administrator` with rockyou.txt, you lock the account after 5 tries. Password spraying tries `Password1` against 1000 accounts — each account only gets 1 failed attempt, so none lock.

**Getting the password policy before spraying:**
```bash
crackmapexec smb DC_IP -u validuser -p validpass --pass-pol
# Shows: lockout threshold, lockout duration, observation window

# Or from a domain-joined machine:
net accounts /domain
```

**What to spray:**
- `Password1` — meets most complexity requirements
- `Welcome1` — common corporate default
- `CompanyName+Year` (e.g., `Eurostop2024`)
- `Season+Year` (e.g., `Summer2024`, `Winter2023`)
- `Monday1`, `January1` — day/month based
- The domain name with numbers (e.g., `Domain123!`)

**Spraying with Kerbrute (AD):**
```bash
kerbrute passwordspray --dc DC_IP -d domain.local valid_users.txt 'Password1'
```

**Spraying with CrackMapExec:**
```bash
crackmapexec smb DC_IP -u valid_users.txt -p 'Password1' --continue-on-success
crackmapexec smb 192.168.1.0/24 -u valid_users.txt -p 'Password1' --continue-on-success
```

> [!danger] Spray once, then wait
> Check the observation window in the password policy (typically 30 minutes). Spray once, wait the full observation window, then spray again with a different password. Two sprays within the window = lockouts. On OSCP, spray once with 2-3 passwords max and move on.

---

## John the Ripper — Offline Hash Cracking

John the Ripper (john) cracks password hashes offline. It supports hundreds of hash formats and has a flexible rule engine.

### Basic Usage

```bash
john hashfile.txt                              # Auto-detect format, use default wordlist
john hashfile.txt --wordlist=/usr/share/wordlists/rockyou.txt   # Specify wordlist
john hashfile.txt --format=nt                  # Force specific format
john hashfile.txt --show                       # Show already-cracked hashes
john --list=formats                            # List all supported hash formats
```

### Hash Format Detection

```bash
# John usually auto-detects, but if it doesn't:
john hashfile.txt --format=nt          # NTLM (Windows)
john hashfile.txt --format=md5crypt    # Linux MD5 ($1$)
john hashfile.txt --format=sha512crypt # Linux SHA-512 ($6$)
john hashfile.txt --format=bcrypt      # bcrypt ($2a$, $2b$)
john hashfile.txt --format=raw-sha256  # Raw SHA-256
john hashfile.txt --format=raw-md5     # Raw MD5

# List all formats containing "sha":
john --list=formats | grep sha
```

### Cracking /etc/shadow (Linux)

```bash
# Combine passwd and shadow:
unshadow /etc/passwd /etc/shadow > combined.txt

# Crack:
john combined.txt --wordlist=/usr/share/wordlists/rockyou.txt
john combined.txt --format=sha512crypt --wordlist=/usr/share/wordlists/rockyou.txt
```

### Cracking Specific File Types with john2john Scripts

John comes with helper scripts that convert various file types into crackable hash format:

```bash
# SSH private key with passphrase:
ssh2john id_rsa > id_rsa.hash
john id_rsa.hash --wordlist=/usr/share/wordlists/rockyou.txt

# ZIP file password:
zip2john archive.zip > zip.hash
john zip.hash --wordlist=/usr/share/wordlists/rockyou.txt

# RAR file:
rar2john archive.rar > rar.hash
john rar.hash --wordlist=/usr/share/wordlists/rockyou.txt

# PDF password:
pdf2john document.pdf > pdf.hash
john pdf.hash --wordlist=/usr/share/wordlists/rockyou.txt

# KeePass database:
keepass2john database.kdbx > kp.hash
john kp.hash --wordlist=/usr/share/wordlists/rockyou.txt

# 7-zip:
7z2john archive.7z > 7z.hash
john 7z.hash --wordlist=/usr/share/wordlists/rockyou.txt

# NTLM (Windows SAM dump):
john ntlm.hash --format=nt --wordlist=/usr/share/wordlists/rockyou.txt
```

### John Rules — Wordlist Mutation

Rules transform wordlist entries to create variations:

```bash
# Built-in rule sets:
john hashfile.txt --wordlist=rockyou.txt --rules=best64         # 64 common rules
john hashfile.txt --wordlist=rockyou.txt --rules=jumbo          # Large rule set
john hashfile.txt --wordlist=rockyou.txt --rules=OneRuleToRuleThemAll  # Community mega-rule

# Incremental mode (pure brute force — very slow):
john hashfile.txt --incremental=alpha      # Alphabetic only
john hashfile.txt --incremental=digits     # Digits only
john hashfile.txt --incremental=alnum      # Alphanumeric
```

### Checking Cracked Results

```bash
john --show hashfile.txt
john --show --format=nt hashfile.txt    # Show NTLM results
```

---

## hashcat — GPU-Accelerated Hash Cracking

hashcat is significantly faster than John for most hash types because it uses the GPU. On Kali, if you have a GPU passthrough set up, hashcat is your go-to for serious cracking.

### Core Syntax

```bash
hashcat -m HASH_TYPE -a ATTACK_MODE hashfile.txt [wordlist/mask]
```

### Attack Modes (-a)

| Mode | Name | What it does |
|------|------|-------------|
| `-a 0` | Dictionary | Wordlist attack — try every word |
| `-a 1` | Combination | Combine two wordlists |
| `-a 3` | Brute force/Mask | Try all combinations matching a pattern |
| `-a 6` | Hybrid wordlist+mask | Dictionary word + mask appended |
| `-a 7` | Hybrid mask+wordlist | Mask prepended + dictionary word |

### Hash Type Values (-m) — The Most Important Ones

| Hash Type | -m Value | Example Hash |
|-----------|---------|-------------|
| MD5 | `0` | `5f4dcc3b5aa765d61d8327deb882cf99` |
| SHA-1 | `100` | `5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8` |
| SHA-256 | `1400` | `5e884898da28047151d0e56f8dc62...` |
| SHA-512 | `1700` | `b109f3bbbc244eb82441917ed...` |
| NTLM | `1000` | `8846f7eaee8fb117ad06bdd830b7586c` |
| NTLMv2 | `5600` | `admin::DOMAIN:...` (full NTLMv2 response) |
| NetNTLMv1 | `5500` | |
| bcrypt | `3200` | `$2a$05$...` |
| MD5crypt (Linux $1$) | `500` | `$1$salt$hash` |
| SHA-256crypt ($5$) | `7400` | `$5$salt$hash` |
| SHA-512crypt ($6$) | `1800` | `$6$salt$hash` |
| WPA/WPA2 | `22000` | (capture file) |
| Kerberos AS-REP ($krb5asrep$) | `18200` | `$krb5asrep$23$user@domain:...` |
| Kerberos TGS ($krb5tgs$) | `13100` | `$krb5tgs$23$*service@domain*:...` |
| DPAPI masterkey | `15900` | |
| MS-Cache v2 (DCC2) | `2100` | `$DCC2$...` |

```bash
# List all hash types:
hashcat --help | grep -i "hash modes" -A 5
hashcat --example-hashes | less
```

### Dictionary Attack (-a 0)

```bash
hashcat -m 1000 ntlm_hashes.txt /usr/share/wordlists/rockyou.txt
hashcat -m 0 md5_hashes.txt /usr/share/wordlists/rockyou.txt
hashcat -m 18200 asrep_hashes.txt /usr/share/wordlists/rockyou.txt   # AS-REP Roasting
hashcat -m 13100 tgs_hashes.txt /usr/share/wordlists/rockyou.txt     # Kerberoasting
hashcat -m 5600 ntlmv2_hashes.txt /usr/share/wordlists/rockyou.txt   # Responder captures
```

### Rules — Wordlist Mutation

```bash
# Apply rules to a wordlist:
hashcat -m 1000 hashes.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule
hashcat -m 1000 hashes.txt rockyou.txt -r /usr/share/hashcat/rules/rockyou-30000.rule

# OneRuleToRuleThemAll (download separately):
hashcat -m 1000 hashes.txt rockyou.txt -r OneRule.rule

# Chain multiple rules:
hashcat -m 1000 hashes.txt rockyou.txt -r best64.rule -r toggles1.rule
```

### Mask Attack (-a 3) — Brute Force with Patterns

Masks define the character set for each position:

| Mask | Character Set |
|------|--------------|
| `?l` | Lowercase letters (a-z) |
| `?u` | Uppercase letters (A-Z) |
| `?d` | Digits (0-9) |
| `?s` | Special characters |
| `?a` | All printable ASCII |
| `?b` | All bytes (0x00-0xff) |

```bash
# 8-character all-lowercase:
hashcat -m 1000 hashes.txt -a 3 ?l?l?l?l?l?l?l?l

# Password pattern: Capital + 6 lowercase + digit (e.g., Password1):
hashcat -m 1000 hashes.txt -a 3 ?u?l?l?l?l?l?l?d

# 4-digit PIN:
hashcat -m 1000 hashes.txt -a 3 ?d?d?d?d

# Common corporate pattern: Word + 4 digits:
hashcat -m 1000 hashes.txt -a 6 rockyou.txt ?d?d?d?d
```

### Hybrid Attack (-a 6 and -a 7)

```bash
# Wordlist + mask appended (Password + 2023):
hashcat -m 1000 hashes.txt -a 6 rockyou.txt ?d?d?d?d

# Mask prepended + wordlist:
hashcat -m 1000 hashes.txt -a 7 ?d?d?d?d rockyou.txt
```

### Useful hashcat Flags

```bash
--show                   # Show already-cracked hashes
--username               # Hash file includes username:hash format
-O                       # Optimised kernels (faster, slightly less coverage)
--status                 # Show status during cracking
--status-timer=10        # Update status every 10 seconds
--potfile-disable        # Don't use the .potfile (re-crack everything)
-w 3                     # Workload profile: 1=low, 2=default, 3=high, 4=nightmare
--force                  # Ignore warnings (use in VMs where GPU passthrough not available)
```

> [!warning] --force in VMs
> hashcat uses GPU by default. In a VM without GPU passthrough, use `--force` to run on CPU. It's much slower but works. On OSCP exam machines, you're in a VM — use `--force` or rely on John.

---

## Hash Identification

Before cracking, you need to know the hash type.

### hashid (Kali tool)

```bash
hashid '$6$rounds=656000$xyz$hash...'    # SHA-512crypt
hashid '5f4dcc3b5aa765d61d8327deb882cf99'  # MD5
hashid -m '5f4dcc3b5aa765d61d8327deb882cf99'  # -m shows hashcat -m value
```

### hash-identifier

```bash
hash-identifier
# Paste hash at prompt
```

### haiti (more modern, handles more types)

```bash
haiti '5f4dcc3b5aa765d61d8327deb882cf99'
```

### Manual Identification by Format

| Pattern | Type |
|---------|------|
| 32 hex chars | MD5 |
| 40 hex chars | SHA-1 |
| 64 hex chars | SHA-256 |
| 128 hex chars | SHA-512 |
| `$1$` prefix | MD5crypt (Linux) |
| `$5$` prefix | SHA-256crypt (Linux) |
| `$6$` prefix | SHA-512crypt (Linux) |
| `$2a$` or `$2b$` prefix | bcrypt |
| `$y$` prefix | yescrypt (modern Linux) |
| 32 hex, uppercase, from Windows | NTLM |
| `admin::DOMAIN:...` long string | NTLMv2 (from Responder) |
| `$krb5asrep$23$` | AS-REP hash (Kerberos) |
| `$krb5tgs$23$` | TGS hash (Kerberoasting) |

---

## Rainbow Tables — Concept and Why Salting Defeats Them

**Rainbow table attack:** Pre-compute all possible password → hash mappings for a given hash algorithm. Store them in a compressed table. Cracking becomes a lookup operation — instant results.

**Why rainbow tables are powerful:** MD5(`password`) is always `5f4dcc3b5aa765d61d8327deb882cf99`. If the database stores unsalted MD5 hashes, a rainbow table instantly reveals every common password.

**Why salting defeats rainbow tables:**
A salt is a random string prepended/appended to the password before hashing:
```
hash = MD5(salt + password)
hash = MD5("x9kQ" + "password") = completely different hash
```

Now the rainbow table doesn't work — the attacker would need a separate table for every possible salt. Modern systems (Linux `$6$`, bcrypt, etc.) always salt hashes. This is why `hashcat` and `john` use wordlist + rules attacks (not rainbow tables) against modern hashes.

**What this means for you:** If you capture NTLM hashes from Windows, they are unsalted — rainbow table databases like `crackstation.net` can crack common passwords instantly online. For salted Linux hashes, you need hashcat/john with a wordlist.

---

## Wordlists — The Right One for Each Scenario

| Wordlist | Location | When to Use |
|----------|----------|------------|
| `rockyou.txt` | `/usr/share/wordlists/rockyou.txt` | Default for everything — 14M passwords from real breach |
| `best64.rule` (john rule) | Built-in | Apply mutations to rockyou — covers most real passwords |
| `rockyou-30000.rule` (hashcat) | `/usr/share/hashcat/rules/` | 30,000 rules — aggressive mutation |
| `OneRuleToRuleThemAll` | GitHub download | Community mega-rule — highest coverage |
| `darkweb2017-top10000.txt` | SecLists | Top passwords from dark web leaks |
| `cewl` (custom wordlist) | Generated | Spider target website, create wordlist from content |
| Common corporate wordlist | Build manually | Company name + variations + years |

**CeWL — Custom Wordlist from Target Website:**
```bash
# Spider website, extract words, build wordlist:
cewl http://TARGET -d 3 -m 5 -w custom_wordlist.txt
# -d 3 = crawl depth
# -m 5 = minimum word length 5 characters
# -w   = output file

# Combine with mutations:
john custom_wordlist.txt --rules --stdout > mutated_wordlist.txt
hashcat -m 1000 hashes.txt custom_wordlist.txt -r best64.rule
```

---

## Password Mutation Strategies

When rockyou.txt fails, think about what the password might be and build targeted wordlists.

**Common patterns real people use:**

| Pattern | Example |
|---------|---------|
| Word + year | `password2023`, `summer2024` |
| Word + ! | `password!`, `letmein!` |
| Capital + word + number | `Password1`, `Welcome2024` |
| Company name | `Eurostop1`, `Eurostop!`, `EurostopLtd` |
| Leetspeak | `p4ssw0rd`, `s3cur1ty` |
| Season + year | `Summer2024!`, `Winter2023` |
| Month + year | `January2024`, `Jan2024!` |
| Name + birthday | `john1990`, `sarah@1985` |

**Generating targeted wordlists with CUPP:**
```bash
# Interactive — enter target details (name, birthdate, company, etc.):
cupp -i
# Generates highly targeted wordlist based on the information

# Install if not present:
pip3 install cupp
```

---

## Cracking Specific Hash Types

**NTLM (from SAM dump or secretsdump):**
```bash
# Format: hash or username:SID:LM:NTLM:::
# Extract just NTLM hash (field 4):
cat secretsdump.txt | cut -d: -f4 > ntlm_hashes.txt
hashcat -m 1000 ntlm_hashes.txt /usr/share/wordlists/rockyou.txt
```

**NTLMv2 (from Responder capture):**
```bash
# Full NTLMv2 response from Responder logs:
cat /usr/share/responder/logs/*.txt | grep 'NTLMv2'
hashcat -m 5600 ntlmv2.txt /usr/share/wordlists/rockyou.txt
```

**AS-REP (Kerberos — from GetNPUsers.py):**
```bash
hashcat -m 18200 asrep.txt /usr/share/wordlists/rockyou.txt
john asrep.txt --wordlist=/usr/share/wordlists/rockyou.txt
```

**TGS (Kerberoasting — from GetUserSPNs.py):**
```bash
hashcat -m 13100 tgs.txt /usr/share/wordlists/rockyou.txt
john tgs.txt --wordlist=/usr/share/wordlists/rockyou.txt
```

**bcrypt ($2a$, $2b$):**
```bash
hashcat -m 3200 bcrypt.txt /usr/share/wordlists/rockyou.txt
# bcrypt is intentionally slow — expect hours even with rockyou.txt
# Use a small targeted wordlist rather than full rockyou
```

**SHA-512crypt ($6$ — Linux shadow):**
```bash
hashcat -m 1800 sha512crypt.txt /usr/share/wordlists/rockyou.txt
john sha512crypt.txt --wordlist=/usr/share/wordlists/rockyou.txt
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Hydra SSH | `hydra -l user -P rockyou.txt ssh://TARGET -t 4` |
| Hydra FTP | `hydra -l admin -P rockyou.txt ftp://TARGET` |
| Hydra HTTP POST | `hydra -l admin -P rockyou.txt TARGET http-post-form "/login:user=^USER^&pass=^PASS^:Failed"` |
| Hydra RDP | `hydra -l admin -P rockyou.txt rdp://TARGET -t 4` |
| CME SMB spray | `crackmapexec smb TARGET -u users.txt -p 'Password1' --continue-on-success` |
| CME WinRM | `crackmapexec winrm TARGET -u admin -p rockyou.txt` |
| Kerbrute user enum | `kerbrute userenum --dc DC_IP -d domain.local users.txt` |
| Kerbrute spray | `kerbrute passwordspray --dc DC_IP -d domain.local users.txt 'Password1'` |
| SMTP user enum | `smtp-user-enum -M VRFY -U users.txt -t TARGET` |
| Identify hash | `hashid 'HASHSTRING' -m` |
| John basic | `john hash.txt --wordlist=rockyou.txt` |
| John SSH key | `ssh2john id_rsa > hash.txt && john hash.txt --wordlist=rockyou.txt` |
| John unshadow | `unshadow passwd shadow > combined.txt && john combined.txt` |
| hashcat NTLM | `hashcat -m 1000 hashes.txt rockyou.txt` |
| hashcat NTLMv2 | `hashcat -m 5600 hashes.txt rockyou.txt` |
| hashcat AS-REP | `hashcat -m 18200 hashes.txt rockyou.txt` |
| hashcat TGS | `hashcat -m 13100 hashes.txt rockyou.txt` |
| hashcat with rules | `hashcat -m 1000 hashes.txt rockyou.txt -r best64.rule` |
| hashcat mask | `hashcat -m 1000 hashes.txt -a 3 ?u?l?l?l?l?l?l?d` |
| hashcat show cracked | `hashcat -m 1000 hashes.txt --show` |
| CeWL custom wordlist | `cewl http://TARGET -d 3 -m 5 -w custom.txt` |
| Crack ZIP password | `zip2john file.zip > hash.txt && john hash.txt --wordlist=rockyou.txt` |

---

## Common Mistakes

> [!warning] These waste time or break things
> 1. **Brute forcing AD without checking lockout policy.** Always get the password policy first (`crackmapexec smb DC --pass-pol`). Brute forcing with lockout = account lockouts = incident response called.
> 2. **Using too many Hydra threads on SSH.** SSH rate-limits connections. `-t 16` (default) will get you blacklisted or cause connection errors. Use `-t 4` for SSH and RDP.
> 3. **Wrong fail string in Hydra http-post-form.** If the fail string doesn't appear in every failed login response, Hydra reports everything as success. Verify the fail string in Burp first.
> 4. **Not trying hashid before hashcat.** Specifying the wrong `-m` value wastes time cracking the wrong hash type. Always identify the hash first.
> 5. **Starting with rockyou.txt + no rules.** For NTLM hashes, add `-r best64.rule` from the start. Common passwords with capital letters and numbers are in rockyou but won't match without mutation rules.
> 6. **Forgetting `--force` in VM.** hashcat needs `--force` when running without GPU. Otherwise it errors out.
> 7. **Not checking online crackers first.** For NTLM hashes, paste them into `crackstation.net` before spinning up hashcat. Pre-computed tables crack unsalted hashes instantly.

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| TryHackMe — "John The Ripper" room | All john techniques with guided labs |
| TryHackMe — "Hydra" room | Hydra SSH and HTTP brute force labs |
| TryHackMe — "Crack the Hash" | Identify and crack 20 different hash types |
| TryHackMe — "Crack the Hash 2" | Advanced hash cracking challenges |
| CrackStation.net | Online NTLM and MD5 rainbow table lookup — use for quick checks |
| Hashes.com | Online hash cracker with large database |
| HTB — Jerry | Tomcat default creds → WAR deploy |
| HTB — Networked | PHP web app with weak password |
| HTB — Sau | Password found in config, reuse across services |
| PortSwigger — Authentication Labs | Brute force and username enumeration labs |
