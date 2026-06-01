---
tags: [oscp-journey, spectre, stage-1, nmap]
module: 1
cert-stage: thm
difficulty: beginner
date: 2026-04-08
phantom-refs: []
netgod-refs: ["Networking/Module-03-Protocols-Deep-Dive"]
---

# S1-05 — Nmap — Complete Reference

## What Nmap Is and How It Works at the Packet Level

Nmap (Network Mapper) is the industry-standard tool for network discovery and security auditing. It sends crafted packets to target hosts and analyses responses to determine:
- Which hosts are alive
- Which ports are open, closed, or filtered
- What services and versions are running
- What OS is running
- Whether known vulnerabilities exist (via NSE scripts)

Understanding **what packets Nmap actually sends** is what separates someone who can read a cheat sheet from someone who can troubleshoot when scans don't behave as expected.

---

## Scan Types — Every Flag, Every Packet

### -sS — SYN Scan (Half-Open Scan) — DEFAULT for root

```
Nmap → SYN  → Target
Nmap ← SYN-ACK ← Target    (port OPEN — Nmap sends RST, never completes handshake)
Nmap ← RST ← Target         (port CLOSED)
(no response)                (port FILTERED — firewall dropping)
```

**Why it's called half-open:** Nmap sends SYN, receives SYN-ACK, then immediately sends RST instead of completing the handshake. The connection is never fully established.

**Why this matters:**
- Faster than a full TCP connect scan (no three-way handshake)
- Stealthier — older systems/firewalls may not log half-open connections
- Requires root/administrator privileges (raw socket access needed)
- Default scan type when run as root

```bash
nmap -sS TARGET
```

---

### -sT — TCP Connect Scan — DEFAULT for non-root

```
Nmap → SYN → Target
Nmap ← SYN-ACK ← Target    (port OPEN)
Nmap → ACK → Target          (completes full handshake)
Nmap → RST → Target          (then tears it down)
```

**Full three-way handshake.** Uses the OS's `connect()` system call — no raw sockets needed. Works without root.

**Downside:** Slower, noisier — every connection is fully logged on the target.

```bash
nmap -sT TARGET              # Use when you don't have root
```

---

### -sU — UDP Scan

UDP has no handshake. Nmap sends a UDP packet to each port:
- **Open:** Service responds with UDP data
- **Closed:** ICMP "port unreachable" (type 3, code 3) received
- **Open|Filtered:** No response (could be open with no reply, or firewall dropping)

**Why UDP is slow:** ICMP rate limiting. The OS limits how many ICMP unreachable messages it generates per second. Nmap must wait between probes.

```bash
nmap -sU TARGET                        # Scan top 1000 UDP ports (very slow)
nmap -sU --top-ports 100 TARGET        # Top 100 — much faster, catches most common
nmap -sU -p 161,53,69,123 TARGET      # Targeted UDP scan for specific services
```

> [!warning] UDP scans require patience
> A full UDP scan (`-sU -p-`) can take hours. Always use `--top-ports 100` or target specific ports unless you have a specific reason to go deeper.

---

### -sA — ACK Scan

```
Nmap → ACK → Target
Nmap ← RST ← Target         (port UNFILTERED — firewall lets ACK through)
(no response)                (port FILTERED — firewall dropping ACK)
```

**Important:** ACK scan does NOT tell you if a port is open or closed. It tells you whether a **firewall** is filtering the port.

- `unfiltered` = firewall passes ACK packets (stateless firewall or no firewall)
- `filtered` = firewall drops ACK packets (stateful firewall blocking)

**Use case:** Map firewall rules. Determine which ports a stateful firewall is protecting vs which are open.

```bash
nmap -sA TARGET
```

---

### -sN — NULL Scan, -sF — FIN Scan, -sX — Xmas Scan

These are stealth scans that exploit a quirk in the RFC 793 TCP specification:

**RFC 793 says:** If a closed port receives a packet with no SYN/ACK/RST flags, it should respond with RST. If an **open** port receives such a packet, it should silently drop it.

```
NULL scan:  Nmap sends packet with NO flags set
FIN scan:   Nmap sends packet with only FIN flag
Xmas scan:  Nmap sends packet with FIN, PSH, URG flags ("lit up like a Christmas tree")

Open port:   (no response)
Closed port: RST-ACK received
Filtered:    (no response or ICMP unreachable)
```

**Limitation:** Windows does NOT follow this RFC behaviour. Windows responds with RST for both open and closed ports when receiving these abnormal packets. These scans only work against Unix/Linux targets.

**Use case:** Evade older stateless firewalls and some IDS that only log SYN packets.

```bash
nmap -sN TARGET    # NULL scan
nmap -sF TARGET    # FIN scan
nmap -sX TARGET    # Xmas scan
```

---

## Service and Version Detection — -sV

Without `-sV`, Nmap only knows a port is open. With `-sV`, Nmap sends protocol-specific probes to identify the service name and version.

```bash
nmap -sV TARGET                    # Default intensity (level 7)
nmap -sV --version-intensity 0 TARGET   # Lightest — only banner grab
nmap -sV --version-intensity 9 TARGET   # Most aggressive — tries everything
nmap -sV --version-light TARGET    # Equivalent to intensity 2 — faster
nmap -sV --version-all TARGET      # Equivalent to intensity 9 — slowest
```

**Intensity levels (0–9):**
- 0–2: Only grab the banner (whatever the service sends on connection)
- 3–5: Send common probes for the expected service
- 6–8: Try additional probes for less common services
- 9: Try every probe — catches unusual configurations but very slow

**What version detection tells you:**
```
22/tcp   open  ssh     OpenSSH 7.9p1 Debian 10+deb10u2 (protocol 2.0)
80/tcp   open  http    Apache httpd 2.4.38 ((Debian))
445/tcp  open  smb     Samba smbd 4.9.5-Debian
```

Now you know exactly what to searchsploit: `searchsploit OpenSSH 7.9`, `searchsploit Apache 2.4.38`, `searchsploit Samba 4.9`.

---

## OS Detection — -O

Nmap analyses TCP/IP stack behaviour (TTL values, TCP window sizes, specific quirks in how the OS implements RFC 793) to guess the operating system.

```bash
nmap -O TARGET
nmap -O --osscan-guess TARGET      # Be more aggressive — guess even with low confidence
```

> [!warning] OS detection is unreliable
> Firewalls, load balancers, and virtualisation can distort TCP/IP fingerprints. Nmap may say "Linux 3.x" on a Windows Server. Use OS detection as a hint, not a fact. Verify with service banners (SSH banner often shows `Ubuntu`, `Debian`; SMB shows Windows version).

---

## Timing Templates — -T0 through -T5

Timing templates control how fast Nmap scans — specifically, delays between probes and how many probes run in parallel.

| Template | Name | Delay | Use Case |
|----------|------|-------|---------|
| `-T0` | Paranoid | 5 minutes between probes | Maximum IDS evasion (impractically slow) |
| `-T1` | Sneaky | 15 seconds between probes | IDS evasion — still very slow |
| `-T2` | Polite | 0.4 seconds between probes | Reduce network load — slow |
| `-T3` | Normal | Nmap's default adaptive timing | Balanced — default when -T not specified |
| `-T4` | Aggressive | Assumes fast, reliable network | **OSCP standard — use this** |
| `-T5` | Insane | Maximum speed, may miss results | Labs only — unreliable on slow networks |

```bash
nmap -T4 TARGET                    # Standard for OSCP
nmap -T4 --min-rate 5000 TARGET    # T4 + force at least 5000 packets/sec
```

> [!tip] MUSCLE MEMORY — standard OSCP scan
> ```bash
> nmap -sC -sV -T4 --min-rate 5000 -oA initial TARGET
> ```
> This is your go-to first scan on every machine.

---

## Port Specification

```bash
nmap -p 80 TARGET                  # Scan only port 80
nmap -p 80,443,8080 TARGET         # Scan specific ports
nmap -p 1-1024 TARGET              # Scan port range
nmap -p- TARGET                    # Scan ALL 65535 ports (critical — always do this)
nmap --top-ports 100 TARGET        # Top 100 most common ports
nmap --top-ports 1000 TARGET       # Top 1000 (default without -p)
nmap -p U:161,T:80,443 TARGET      # Mixed UDP/TCP port specification
```

> [!danger] Never skip the full port scan
> The default Nmap scan only checks the top 1000 ports. On OSCP machines, critical services intentionally run on non-standard ports (e.g., SSH on 2222, HTTP on 8888, a custom service on 31337). Always run `nmap -p-` on every target. Start it in the background while you work on results from the quick scan.

---

## Output Formats — -oN, -oX, -oG, -oA

Always save Nmap output. You will refer back to it constantly.

```bash
nmap -oN output.txt TARGET         # Normal output (human readable)
nmap -oX output.xml TARGET         # XML (importable into Metasploit, other tools)
nmap -oG output.gnmap TARGET       # Grepable format (for parsing with grep/awk)
nmap -oA output TARGET             # ALL THREE formats simultaneously — USE THIS
```

> [!tip] Always use -oA
> ```bash
> nmap -sC -sV -T4 -p- --min-rate 5000 -oA full_scan TARGET
> ```
> This creates `full_scan.nmap`, `full_scan.xml`, and `full_scan.gnmap`. The `.gnmap` file is especially useful for quick grepping:
> ```bash
> grep "open" full_scan.gnmap | grep -oP "\d+/open/tcp//\S+" | cut -d/ -f1 | sort -n
> ```

---

## NSE Scripts — Nmap Scripting Engine

NSE allows Nmap to run scripts against discovered services for deeper enumeration and vulnerability detection. Scripts are located at `/usr/share/nmap/scripts/`.

```bash
nmap -sC TARGET                    # Run default scripts (equivalent to --script=default)
nmap --script=vuln TARGET          # Run all vulnerability detection scripts
nmap --script=smb-vuln-ms17-010 TARGET   # Run a specific script
nmap --script=http-enum TARGET     # Web directory enumeration
nmap --script "smb-*" TARGET       # Run all SMB scripts
nmap --script-args scriptname.arg=value TARGET   # Pass arguments to scripts
nmap --script-help scriptname      # Show help for a specific script
```

**Script categories:**

| Category | What it does |
|----------|-------------|
| `default` | Safe, fast, useful — enabled with -sC |
| `safe` | Won't crash services or be intrusive |
| `vuln` | Check for known vulnerabilities |
| `auth` | Test authentication (default creds, anonymous access) |
| `brute` | Brute force credentials |
| `discovery` | Enumerate services and gather information |
| `exploit` | Actually exploit vulnerabilities (rarely used in Nmap) |
| `intrusive` | May crash services or trigger alerts |

**The most important NSE scripts for OSCP:**

```bash
# SMB vulnerability checks:
nmap --script smb-vuln-ms17-010 -p445 TARGET      # EternalBlue
nmap --script smb-vuln-ms08-067 -p445 TARGET      # MS08-067
nmap --script smb-vuln-cve2009-3103 -p445 TARGET
nmap --script "smb-vuln-*" -p445 TARGET            # All SMB vulns at once

# SMB enumeration:
nmap --script smb-enum-shares,smb-enum-users -p445 TARGET
nmap --script smb2-security-mode -p445 TARGET      # Check SMB signing (for relay attacks)

# HTTP enumeration:
nmap --script http-enum -p80,443 TARGET            # Find common directories
nmap --script http-methods -p80,443 TARGET         # What HTTP methods are allowed?
nmap --script http-title -p80,443,8080 TARGET      # Grab page titles
nmap --script http-auth-finder TARGET              # Find authentication mechanisms

# FTP:
nmap --script ftp-anon -p21 TARGET                 # Test anonymous login
nmap --script ftp-bounce -p21 TARGET               # Test for FTP bounce attack
nmap --script ftp-brute -p21 TARGET                # Brute force (slow)

# SSH:
nmap --script ssh-auth-methods -p22 TARGET         # What auth methods are supported?
nmap --script ssh-brute -p22 TARGET                # SSH brute force (slow)
nmap --script ssh2-enum-algos -p22 TARGET          # Supported encryption algorithms

# DNS:
nmap --script dns-zone-transfer --script-args dns-zone-transfer.domain=domain.local -p53 TARGET

# SNMP:
nmap --script snmp-info -sU -p161 TARGET
nmap --script snmp-brute -sU -p161 TARGET          # Brute force community strings

# MySQL:
nmap --script mysql-empty-password -p3306 TARGET   # Test blank root password
nmap --script mysql-info -p3306 TARGET

# MSSQL:
nmap --script ms-sql-info -p1433 TARGET
nmap --script ms-sql-empty-password -p1433 TARGET

# RDP:
nmap --script rdp-enum-encryption -p3389 TARGET
nmap --script rdp-vuln-ms12-020 -p3389 TARGET

# General vulnerability:
nmap --script vuln TARGET                          # Run all vuln scripts (noisy but thorough)
```

---

## Firewall Evasion Techniques

```bash
# Fragment packets into 8-byte chunks:
nmap -f TARGET

# Custom MTU (must be multiple of 8):
nmap --mtu 16 TARGET
nmap --mtu 24 TARGET

# Decoy scan — your real IP hidden among fake sources:
nmap -D RND:5 TARGET               # 5 random decoys + your IP
nmap -D 10.0.0.1,10.0.0.2,ME,10.0.0.3 TARGET   # Specific decoys, ME = your real IP

# Spoof source port — some firewalls allow traffic from port 53/80/443:
nmap --source-port 53 TARGET
nmap -g 443 TARGET                 # -g is shorthand for --source-port

# Append random data to packets:
nmap --data-length 200 TARGET      # Add 200 random bytes to packets

# Spoof source IP (only useful if you don't need responses — for DoS mapping):
nmap -S SPOOFED_IP -e eth0 -Pn TARGET

# Slow timing to evade rate-based detection:
nmap -T1 TARGET

# Idle scan (completely covert — uses zombie host):
nmap -sI ZOMBIE_HOST TARGET        # ZOMBIE must have predictable IP ID sequence
```

---

## Host Discovery — Controlling How Nmap Finds Live Hosts

By default, Nmap pings hosts before scanning ports. This can cause missed hosts if ICMP is blocked.

```bash
# Disable host discovery — scan all ports regardless of ping response:
nmap -Pn TARGET                    # Treat all hosts as online (ALWAYS use on OSCP)

# Only do host discovery, no port scan:
nmap -sn 192.168.1.0/24           # Ping sweep

# Types of pings Nmap uses for discovery:
nmap -PS22,80,443 TARGET          # TCP SYN ping to specific ports
nmap -PA80 TARGET                 # TCP ACK ping
nmap -PU53 TARGET                 # UDP ping
nmap -PE TARGET                   # ICMP echo (standard ping)
nmap -PP TARGET                   # ICMP timestamp
nmap -PM TARGET                   # ICMP address mask

# Combine for maximum discovery:
nmap -PS22,80,443 -PE -PP -Pn TARGET
```

> [!tip] Always use -Pn on OSCP
> OSCP machines may not respond to ICMP. Without `-Pn`, Nmap assumes the host is down and skips port scanning. Always add `-Pn` to avoid missing machines.

---

## The OSCP Exam Scan Workflow

This is the exact sequence to run at the start of every OSCP machine. Run all three simultaneously in separate terminals.

**Terminal 1 — Quick scan (start enumerating results immediately):**
```bash
nmap -sC -sV -T4 --min-rate 5000 -Pn -oA quick TARGET
```

**Terminal 2 — Full port scan (runs in background, catches non-standard ports):**
```bash
nmap -p- -T4 --min-rate 5000 -Pn -oA full TARGET
```

**Terminal 3 — UDP scan (runs in background):**
```bash
nmap -sU --top-ports 100 -Pn -oA udp TARGET
```

**After full scan completes — targeted script scan on all discovered ports:**
```bash
# Extract ports from full scan:
ports=$(grep "open" full.gnmap | grep -oP "\d+/open" | cut -d/ -f1 | tr '\n' ',' | sed 's/,$//')

# Run targeted scripts:
nmap -sC -sV -p$ports -Pn -oA targeted TARGET
```

---

## Reading Nmap Output — What Each Line Means

```
Nmap scan report for 10.10.10.100
Host is up (0.042s latency).       ← RTT to host

PORT     STATE    SERVICE    VERSION
22/tcp   open     ssh        OpenSSH 7.9p1 Debian
80/tcp   open     http       Apache httpd 2.4.38
139/tcp  open     netbios-ssn Samba smbd 3.X - 4.X
443/tcp  closed   https                                ← RST received, nothing listening
8080/tcp filtered http-proxy                           ← No response, firewall dropping
```

**Port state meanings:**
- `open` — SYN-ACK received. Service is listening. Investigate this.
- `closed` — RST received. Port not listening, but host is up. Not useful now, but note for OS detection and firewall rule analysis.
- `filtered` — No response. Firewall dropping packets. Could be open behind firewall.
- `open|filtered` — Can't distinguish (common with UDP or stealth scans). Try harder probes.
- `unfiltered` — Port is accessible but Nmap can't determine if open or closed (ACK scan result).

---

## Common Failure Modes and Fixes

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| All ports show `filtered` | ICMP blocking — host marked as down | Add `-Pn` flag |
| Scan extremely slow | Default timing, many ports | Add `-T4 --min-rate 5000` |
| Version detection shows nothing | Service not responding to probes | Try `--version-intensity 9` |
| UDP scan shows all `open\|filtered` | Firewall dropping or service not replying | Increase timing, try targeted probes |
| NSE scripts fail or timeout | Network latency or filtered | Add `--script-timeout 60s` |
| "You requested a scan type which requires root privileges" | Running -sS without sudo | Use `sudo nmap` or switch to `-sT` |
| Missing services found by other tools | Top 1000 port scan missed non-standard ports | Always run `nmap -p-` |

---

## Quick Reference Table

| Task | Command |
|------|---------|
| Quick scan with scripts | `nmap -sC -sV -T4 -Pn -oA quick TARGET` |
| Full port scan | `nmap -p- -T4 --min-rate 5000 -Pn -oA full TARGET` |
| UDP top 100 | `nmap -sU --top-ports 100 -Pn -oA udp TARGET` |
| All SMB vuln scripts | `nmap --script "smb-vuln-*" -p445 TARGET` |
| HTTP enumeration | `nmap --script http-enum -p80,443 TARGET` |
| FTP anonymous test | `nmap --script ftp-anon -p21 TARGET` |
| Run all vuln scripts | `nmap --script vuln -Pn TARGET` |
| Fragmented packets | `nmap -f TARGET` |
| Decoy scan | `nmap -D RND:10 TARGET` |
| Source port spoof | `nmap --source-port 53 TARGET` |
| Ping sweep subnet | `nmap -sn 192.168.1.0/24` |
| OS detection | `nmap -O --osscan-guess TARGET` |
| SYN scan | `nmap -sS TARGET` (requires root) |
| Connect scan | `nmap -sT TARGET` (no root needed) |
| ACK scan (firewall map) | `nmap -sA TARGET` |
| NULL/FIN/Xmas (Unix only) | `nmap -sN / -sF / -sX TARGET` |

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| TryHackMe — "Nmap" room | Interactive Nmap lab — covers every scan type |
| TryHackMe — "Nmap Advanced Port Scans" | NSE scripts and advanced techniques |
| HTB — any machine | Run the full OSCP scan workflow on every machine |
| HackTheBox — Starting Point machines | Practice the recon workflow from scratch |
| `man nmap` / `nmap --help` | The definitive reference — Nmap's own documentation |
| nmap.org/nsedoc | Full NSE script documentation with examples |
