---
title: "Module 00 — Foundations & Mental Models"
tags: [networking, foundations, osi, tcp-ip, encapsulation, pentest, netgod]
module: 0
date: 2026-04-05
---

# Module 00 — Foundations & Mental Models

> [!info] Module Overview
> This module builds the bedrock mental models every network engineer and penetration tester needs. You will understand what a network is at a conceptual and physical level, how data moves through layers, and how attackers think about each of those layers. Nothing here is skipped — every concept is taken to depth.

---

## 1. What Is a Network?

At its most fundamental level, a network is a collection of **nodes** connected by **links** that enables the exchange of data.

- **Node**: Any device that can send, receive, or forward data. This includes computers, servers, routers, switches, printers, IoT devices, smartphones, and any other addressable device.
- **Link**: The communication path between nodes. Links can be physical (copper cable, fibre optic) or logical (Wi-Fi, VPN tunnel, VLAN).
- **Topology**: The arrangement of nodes and links — both physically (how cables run) and logically (how data flows).

### Why Networks Exist
Networks exist to share resources. Before networks, every computer was isolated — data had to be physically transported (floppy disks, tapes). Networks enabled:
- **Resource sharing**: printers, storage, internet connections
- **Communication**: email, messaging, VoIP
- **Centralised management**: Active Directory, patch management, monitoring
- **Distributed computing**: databases, cloud services, microservices

### Nodes, Links, and Topology — The Three Primitives
Every network, regardless of size or complexity, can be described using only these three primitives. When you walk into an unknown network as a pentester or an engineer, your first job is always to map the topology — to answer: *what nodes exist, how are they linked, and how does traffic actually flow?*

---

## 2. Network Types

### LAN — Local Area Network
A LAN is a network confined to a **small geographic area** — typically a single building, floor, or office. LANs are privately owned and managed.

- **Speed**: 100 Mbps to 10 Gbps (modern Ethernet)
- **Media**: Cat5e, Cat6, Cat6a twisted pair copper; multimode fibre for backbone runs
- **Devices**: Switches, access points, endpoints
- **Real-world example**: The office network at Company's London office — all the servers & workstations connected via switches in the server room, communicating over 1 Gbps Ethernet

**Key characteristics**:
- Low latency (sub-millisecond between devices on the same switch)
- High bandwidth relative to WAN
- Managed by the organisation — full control over the infrastructure
- Single broadcast domain unless VLANs are implemented

### WAN — Wide Area Network
A WAN connects multiple geographically dispersed LANs. WANs span cities, countries, or continents.

- **Speed**: Typically much slower than LAN — 10 Mbps to multi-Gbps depending on the circuit
- **Media**: Leased lines, MPLS circuits, Metro Ethernet, fibre provided by ISPs, or over internet (VPN)
- **Devices**: Routers, WAN edge devices, MPLS PE routers
- **Real-world example**: A retail chain with stores across the UK — each store has a LAN, all stores connect back to head office via MPLS or SD-WAN. The inter-store connectivity is the WAN.

**Key characteristics**:
- Higher latency than LAN (20–150 ms depending on distance and circuit type)
- Managed by ISP or telco — organisation only controls the edge devices
- More expensive per Mbps than LAN
- Subject to packet loss and jitter if the circuit is poor quality

### MAN — Metropolitan Area Network
A MAN covers a city or metropolitan area. Less common as a distinct category today — Metro Ethernet circuits from ISPs are technically MANs.

- **Real-world example**: A university campus spread across multiple buildings in a city connected via dark fibre or Metro Ethernet — too large for a single LAN, too small to call a WAN.
- **Speed**: Typically 1–100 Gbps over fibre

### PAN — Personal Area Network
A PAN covers an individual person's space — typically within 10 metres.

- **Technologies**: Bluetooth, USB tethering, Near Field Communication (NFC), Zigbee
- **Real-world example**: Your phone connected to a Bluetooth headset, or your laptop connected to your phone's mobile hotspot via Bluetooth

### WLAN — Wireless LAN
A WLAN is a LAN that uses wireless radio transmission instead of (or in addition to) wired Ethernet.

- **Standard**: IEEE 802.11 (Wi-Fi)
- **Frequencies**: 2.4 GHz, 5 GHz, 6 GHz
- **Real-world example**: The Wi-Fi network in an office — same IP range and VLAN as wired, but accessed via Access Points instead of switch ports

> [!warning] WLAN Security Note
> Wireless traffic travels through the air and can be captured by anyone within range. This fundamentally changes the threat model — you don't need physical access to the cable to intercept wireless traffic. This is why WPA2-Enterprise and WPA3 exist.

### VLAN — Virtual LAN
A VLAN is a **logical segmentation** of a physical LAN. VLANs allow a single physical switch to behave as multiple isolated switches.

- **Standard**: IEEE 802.1Q
- **Purpose**: Segment traffic for security, performance, and management without requiring separate physical switches
- **Real-world example**: A retail store with a single switch stack — VLAN 10 for tills (EPOS), VLAN 20 for staff workstations, VLAN 30 for IP cameras, VLAN 40 for guest Wi-Fi. All run on the same physical infrastructure but are isolated from each other.

VLANs are critically important for both network engineers and pentesters. We'll cover them in full depth in Module 2.

---

## 3. Network Topologies

A topology describes how nodes are physically or logically connected. Understanding topology is essential — it determines redundancy, failure modes, and attack paths.

### Bus Topology
All nodes connect to a single shared cable (the "bus"). Data sent by any node travels the entire length of the cable and is received by all nodes.

```
[PC1]---[PC2]---[PC3]---[PC4]---[PC5]
              (shared bus)
```

- **Pros**: Simple, cheap to implement
- **Cons**: Single point of failure (if the cable breaks, the whole network fails), collision domain is the entire network, performance degrades badly as nodes are added
- **In production**: Virtually obsolete. Was used in early Ethernet (10BASE2 coaxial). You will only see this in legacy environments or textbooks.
- **Pentest relevance**: In a bus topology, any node can passively capture all traffic — promiscuous mode on any NIC sees everything. No need for ARP spoofing.

### Star Topology
All nodes connect to a central device — a switch or hub. All traffic passes through the central device.

```
        [PC1]
          |
[PC3]---[Switch]---[PC2]
          |
        [PC4]
```

- **Pros**: Single node failure doesn't affect the rest of the network; easy to add/remove nodes; easy to troubleshoot (isolate the central device)
- **Cons**: Central device is a single point of failure; cable cost increases with nodes
- **In production**: The dominant LAN topology today. Every office, every data centre uses star topology with switches at the centre.
- **Pentest relevance**: Modern switches are not hubs — they learn MAC addresses and only send frames to the intended destination port. Passive sniffing no longer works. ARP spoofing/poisoning is required to intercept traffic in a switched star network.

### Ring Topology
Nodes connect in a closed loop. Data travels around the ring in one (or both) directions until it reaches the destination.

```
[PC1]---[PC2]
  |           |
[PC4]---[PC3]
```

- **Pros**: Predictable performance; no collisions in token ring implementations
- **Cons**: Single break in the ring breaks the entire network (unless dual-ring); slower than star
- **In production**: Physical ring is largely obsolete. However, logical ring concepts persist in **SONET/SDH** (optical transport networks used by telcos) and some industrial control networks.
- **Pentest relevance**: In a token ring, only the node holding the "token" transmits. Capturing a token can allow injection of frames.

### Mesh Topology
Every node connects directly to every other node (full mesh) or to multiple other nodes (partial mesh).

```
[R1]---[R2]
 | \  / |
 |  \/  |
 |  /\  |
 | /  \ |
[R4]---[R3]
```

- **Full mesh**: Every node has a direct link to every other. For n nodes: n(n-1)/2 links required. Extremely expensive but maximally redundant.
- **Partial mesh**: Some nodes have multiple paths, others have one. Real-world compromise between cost and redundancy.
- **In production**: Used in WAN and core network design — ISP backbone routers, data centre spine-leaf. Not practical for end devices (a company with 500 workstations cannot afford 124,750 cables).
- **Pentest relevance**: Mesh networks with multiple paths mean traffic can take different routes. Disrupting one link may not stop communication — relevant when planning network disruption during a red team engagement.

### Hybrid Topology
Real production networks always use hybrid topologies — combining star, mesh, and ring elements at different layers.

```
[Core Mesh]
     |
[Distribution Star]
     |
[Access Star]
     |
[End Devices]
```

The classic enterprise three-tier network is a hybrid: star topology at the access layer (devices connect to access switches), partial mesh at the distribution layer, full or partial mesh at the core.

---

## 4. The OSI Model

The OSI (Open Systems Interconnection) model is a **conceptual framework** that standardises how different network systems communicate. It divides networking functions into 7 layers, each with a specific responsibility.

> [!info] Why OSI Matters
> OSI is not what networks actually use — TCP/IP is what runs the internet. But OSI is the universal language for discussing networking problems, protocols, and attacks. When a vendor says "Layer 4 load balancer" or a pentester says "Layer 2 attack," they're referencing OSI. You must know this cold.

The model is read **top-down** when sending data (encapsulation) and **bottom-up** when receiving data (de-encapsulation).

### Layer 7 — Application Layer

**What it does**: Provides network services directly to end-user applications. This is where the user's application interacts with the network.

**What it is NOT**: This is not the application itself (Chrome, Outlook). It's the interface that allows the application to use network services.

**Protocols at this layer**:
| Protocol | Port | Purpose |
|----------|------|---------|
| HTTP | 80 | Web traffic (unencrypted) |
| HTTPS | 443 | Web traffic (TLS encrypted) |
| FTP | 20/21 | File transfer |
| SFTP | 22 | Secure file transfer (over SSH) |
| SSH | 22 | Secure remote shell |
| Telnet | 23 | Unsecured remote shell (legacy) |
| SMTP | 25/587 | Email sending |
| POP3 | 110 | Email retrieval |
| IMAP | 143 | Email retrieval (with sync) |
| DNS | 53 | Name resolution |
| DHCP | 67/68 | IP address assignment |
| SNMP | 161/162 | Network device management |
| LDAP | 389 | Directory services |
| RDP | 3389 | Remote desktop |
| Kerberos | 88 | Authentication |
| NTP | 123 | Time synchronisation |

**PDU (Protocol Data Unit)**: Data (or Message)

**Devices at this layer**: Application servers, web servers, mail servers, DNS servers

**Attacks targeting Layer 7**:
- SQL injection (targeting web applications)
- Cross-Site Scripting (XSS)
- Credential brute-force (HTTP Basic Auth, login forms)
- Application-layer DDoS (HTTP floods, Slowloris)
- DNS poisoning / spoofing
- LDAP injection

### Layer 6 — Presentation Layer

**What it does**: Responsible for **data translation, encryption/decryption, and compression**. It ensures that data from the application layer of one system can be read by the application layer of another system, regardless of differences in data representation.

**Key functions**:
- **Translation**: Converting data formats — e.g., ASCII to EBCDIC, or encoding characters correctly for different systems
- **Encryption/Decryption**: TLS operates at this layer (in the OSI model). When HTTPS encrypts data, that's Layer 6.
- **Compression**: Reducing data size before transmission (gzip, deflate)
- **Serialisation**: Converting data structures (objects, structs) into a transmittable format — JSON, XML, protobuf

**Protocols/standards at this layer**:
- TLS/SSL (encryption)
- JPEG, PNG, GIF (image encoding)
- MPEG, H.264 (video encoding)
- ASCII, Unicode, EBCDIC (character encoding)
- JSON, XML (data serialisation)

**PDU**: Data

> [!tip] Practical Reality
> In TCP/IP implementations, Layers 5, 6, and 7 are collapsed into a single "Application" layer. The Presentation and Session layers are theoretical constructs in OSI — real protocols handle their functions within the application layer. TLS for example lives inside the application as a library (OpenSSL, SChannel), not as a separate network layer.

**Attacks targeting Layer 6**:
- SSL stripping (forcing downgrade from HTTPS to HTTP)
- Weak cipher negotiation attacks
- Certificate spoofing / invalid certificate acceptance
- POODLE, BEAST, CRIME attacks (exploiting TLS/compression vulnerabilities)

### Layer 5 — Session Layer

**What it does**: Manages **sessions** — establishing, maintaining, and terminating communication sessions between applications.

**Key functions**:
- **Session establishment**: Negotiating and establishing a communication session (authentication, authorisation checks at session level)
- **Session maintenance**: Keeping the session alive, managing dialogue (who speaks when — simplex, half-duplex, full-duplex)
- **Session termination**: Orderly end to a session
- **Session recovery**: Re-establishing a session if interrupted (e.g., NetBIOS sessions, RPC sessions)
- **Synchronisation**: Placing checkpoints in data streams so interrupted transfers can resume from the last checkpoint

**Protocols at this layer**:
- NetBIOS (Network Basic Input/Output System) — session establishment for Windows file sharing
- RPC (Remote Procedure Call) — used extensively in Windows (SMB, DCOM, WMI)
- PPTP (Point-to-Point Tunnelling Protocol) — VPN session management
- SIP (Session Initiation Protocol) — VoIP call setup/teardown

**PDU**: Data

**Attacks targeting Layer 5**:
- Session hijacking (stealing an established session token)
- Session fixation (forcing a user to use an attacker-controlled session ID)
- NTLM relay attacks (abusing Windows session negotiation)

### Layer 4 — Transport Layer

**What it does**: Provides **end-to-end communication** between applications running on different hosts. This layer is responsible for segmentation, reassembly, flow control, error control, and multiplexing.

This is one of the two most important layers for network engineering and pentesting (alongside Layer 3).

**Key functions**:
- **Segmentation**: Breaking large data from Layer 7 into smaller **segments** (TCP) or **datagrams** (UDP)
- **Reassembly**: Putting segments back together in the correct order at the destination
- **Port numbering**: Identifies which application on a host should receive the data. A host can run multiple services simultaneously — ports distinguish them.
- **Flow control**: Prevents a fast sender from overwhelming a slow receiver (TCP sliding window)
- **Error control**: Detecting and retransmitting lost or corrupted segments (TCP only)
- **Multiplexing/Demultiplexing**: Multiple applications can share a single IP address by using different port numbers

**The two protocols**:

**TCP (Transmission Control Protocol)**:
- Connection-oriented — requires a 3-way handshake before data transfer
- Reliable — guarantees delivery, ordering, and error correction
- Flow control — sliding window mechanism
- Higher overhead than UDP
- Used for: HTTP/S, SSH, FTP, SMTP, IMAP, RDP — anything where data integrity matters

**UDP (User Datagram Protocol)**:
- Connectionless — no handshake, no guaranteed delivery
- Unreliable — packets may arrive out of order, be duplicated, or be lost
- Much lower overhead than TCP
- Used for: DNS queries, DHCP, SNMP, VoIP (SIP/RTP), video streaming, TFTP — anything where speed matters more than guaranteed delivery, or where the application handles its own reliability

**Port ranges**:
| Range | Name | Description |
|-------|------|-------------|
| 0–1023 | Well-Known Ports | Assigned by IANA for standard services. Requires root/admin to bind. |
| 1024–49151 | Registered Ports | Registered with IANA but not restricted. |
| 49152–65535 | Dynamic/Ephemeral Ports | Assigned temporarily by the OS for client-side connections. |

**PDU**: Segment (TCP) / Datagram (UDP)

**Devices at this layer**: Load balancers (Layer 4 load balancers operate on port numbers), firewalls (stateful inspection uses Layer 4 state)

**Attacks targeting Layer 4**:
- SYN flood (overwhelming TCP handshake state tables)
- UDP flood
- Port scanning (determining which ports are open)
- TCP session hijacking (predicting sequence numbers to inject data into an established session)
- Firewall bypass via allowed ports (e.g., tunnelling arbitrary data over TCP/443)

### Layer 3 — Network Layer

**What it does**: Responsible for **logical addressing and routing** — determining how data gets from one network to another. While Layer 2 handles delivery within a single network, Layer 3 handles delivery across multiple networks (internetworking).

**Key functions**:
- **Logical addressing**: IP addresses identify source and destination hosts across networks
- **Routing**: Determining the best path for a packet through multiple networks
- **Fragmentation**: Breaking packets into smaller units if they exceed a link's MTU (Maximum Transmission Unit)
- **Packet forwarding**: Moving packets hop-by-hop toward the destination

**Protocols at this layer**:
| Protocol | Purpose |
|----------|---------|
| IPv4 | Primary internetworking protocol, 32-bit addressing |
| IPv6 | Next-generation IP, 128-bit addressing |
| ICMP | Error reporting and diagnostics (ping, traceroute) |
| OSPF | Dynamic routing protocol |
| EIGRP | Cisco proprietary routing protocol |
| BGP | Inter-AS routing (the routing protocol of the internet) |
| IPsec | Network-layer encryption (VPNs) |

**PDU**: Packet

**Devices at this layer**: Routers, Layer 3 switches, firewalls

**Key concept — Routing vs Switching**:
- A **switch** (Layer 2) forwards frames based on MAC addresses *within* a single network
- A **router** (Layer 3) forwards packets based on IP addresses *between* networks

**Attacks targeting Layer 3**:
- IP spoofing (forging source IP addresses)
- ICMP attacks (ping of death, ICMP redirect, Smurf attack)
- Routing protocol attacks (OSPF route injection, BGP hijacking)
- Fragmentation attacks (overlapping fragments to evade IDS)
- TTL manipulation

### Layer 2 — Data Link Layer

**What it does**: Responsible for **node-to-node delivery** — getting a frame from one device to the next device on the same network segment. Layer 2 handles physical addressing (MAC addresses) and media access control.

Layer 2 is divided into two sublayers:
- **LLC (Logical Link Control)**: Interface between the network layer and the MAC sublayer. Handles flow control and error notification at this layer.
- **MAC (Media Access Control)**: Controls how devices on a shared medium access the network. Contains the MAC address.

**Key functions**:
- **Physical addressing**: MAC addresses (48-bit / 6-byte addresses, e.g., `AA:BB:CC:DD:EE:FF`) identify devices on a local network
- **Frame delimiting**: Defines the start and end of each frame
- **Error detection**: CRC (Cyclic Redundancy Check) in the frame trailer detects corruption in transit
- **Media access control**: Defines who can transmit and when (CSMA/CD for Ethernet, CSMA/CA for Wi-Fi)
- **Frame switching**: Switches operate at Layer 2, using MAC address tables (CAM tables) to forward frames

**Protocols at this layer**:
| Protocol | Purpose |
|----------|---------|
| Ethernet (IEEE 802.3) | Wired LAN framing and MAC addressing |
| Wi-Fi (IEEE 802.11) | Wireless LAN |
| ARP | Resolves IP addresses to MAC addresses |
| STP (IEEE 802.1D) | Prevents switching loops |
| VLAN (IEEE 802.1Q) | Virtual LAN tagging |
| PPP | Point-to-Point Protocol (WAN links) |
| LLDP / CDP | Link-layer discovery protocols |

**PDU**: Frame

**Devices at this layer**: Switches, bridges, NICs, Access Points (the Layer 2 component)

**MAC Address Structure**:
```
AA:BB:CC:DD:EE:FF
|------| |------|
  OUI     Device ID

OUI (Organizationally Unique Identifier): First 3 bytes, assigned to the manufacturer
Device ID: Last 3 bytes, assigned by the manufacturer to the specific device
```

**Attacks targeting Layer 2**:
- ARP poisoning / ARP spoofing (sending fake ARP replies to redirect traffic)
- MAC flooding (overflowing the switch CAM table, causing it to broadcast all frames — effectively turning the switch into a hub)
- VLAN hopping (double tagging or switch spoofing to access other VLANs)
- STP attacks (BPDU spoofing to become the root bridge and intercept traffic)
- MAC address spoofing (changing your NIC's MAC to impersonate another device)
- Rogue DHCP / DHCP starvation
- 802.1X bypass

### Layer 1 — Physical Layer

**What it does**: Responsible for the **transmission and reception of raw bit streams** over a physical medium. Layer 1 defines the electrical, optical, or radio signals that represent binary 0s and 1s, plus the physical connectors and media.

**Key functions**:
- **Bit transmission**: Converting digital data to signals appropriate for the medium (electrical pulses on copper, light pulses on fibre, radio waves in Wi-Fi)
- **Signal encoding**: How bits are represented — Manchester encoding, NRZ, 4B/5B, etc.
- **Physical topology**: How cables are physically run
- **Timing and synchronisation**: Ensuring sender and receiver are synchronised
- **Duplexing**: Half-duplex (transmit or receive, not both simultaneously) vs full-duplex

**Physical media**:
| Medium | Max Distance | Speed | Use Case |
|--------|-------------|-------|---------|
| Cat5e UTP | 100m | 1 Gbps | Office workstation connections |
| Cat6 UTP | 100m (55m for 10GbE) | 10 Gbps | Patch cables, workstations |
| Cat6a UTP | 100m | 10 Gbps | Server connections, structured cabling |
| Multimode Fibre (OM3/OM4) | 300m–400m | 10–40 Gbps | Building backbone, server room |
| Single-mode Fibre | 80km+ | 100 Gbps+ | WAN, campus between buildings |
| Wi-Fi 802.11ac | ~35m indoor | 3.5 Gbps theoretical | Wireless clients |

**Connectors**:
- **RJ-45**: Standard 8-pin connector for Ethernet copper cabling
- **SFP (Small Form-factor Pluggable)**: Hot-swappable transceiver for fibre or copper on switches/routers. SFP = 1 Gbps, SFP+ = 10 Gbps, QSFP = 40/100 Gbps
- **LC**: Small fibre connector used with SFP modules
- **SC**: Older square fibre connector

**PDU**: Bit

**Devices at this layer**: Hubs, repeaters, cables, connectors, NICs (the physical component), fibre patch panels

**Attacks targeting Layer 1**:
- Physical access (cutting cables, unplugging devices)
- Cable tapping (attaching a passive tap to copper to capture all traffic)
- Jamming (radio frequency interference to disrupt Wi-Fi or other wireless)
- Rogue access points (physically plugging in an AP to extend attacker access)
- Hardware implants (planting a network tap or rogue device inline on a cable)

> [!danger] Physical Layer Security
> Physical layer attacks require physical access — which means your physical security controls (locked comms rooms, locked rack cabinets, CCTV, badge access, cable management) are your Layer 1 security controls. A pentester who can get physical access to a comms room can tap cables, plug in rogue devices, or simply unplug critical infrastructure.

---

## 5. OSI Model — Complete Summary Table

| Layer | Number | Name | PDU | Devices | Key Protocols | Attack Category |
|-------|--------|------|-----|---------|--------------|----------------|
| Application | 7 | Application | Data | App servers | HTTP, DNS, SMTP, SSH, RDP | App attacks, credential theft, DDoS |
| Presentation | 6 | Presentation | Data | — | TLS, JPEG, ASCII | SSL stripping, weak ciphers |
| Session | 5 | Session | Data | — | NetBIOS, RPC, SIP | Session hijacking, NTLM relay |
| Transport | 4 | Transport | Segment/Datagram | Load balancers | TCP, UDP | SYN flood, port scan, session hijack |
| Network | 3 | Network | Packet | Routers, L3 switches | IP, ICMP, OSPF, BGP | IP spoofing, routing attacks |
| Data Link | 2 | Data Link | Frame | Switches, APs | Ethernet, ARP, 802.1Q | ARP poison, MAC flood, VLAN hop |
| Physical | 1 | Physical | Bit | Hubs, cables, NICs | Ethernet physical, 802.11 RF | Cable tap, jamming, physical access |

**Memory Aid — Layers 7 to 1 (top to bottom)**:
> **A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing
> Application, Presentation, Session, Transport, Network, Data Link, Physical

**Memory Aid — Layers 1 to 7 (bottom to top)**:
> **P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way
> Physical, Data Link, Network, Transport, Session, Presentation, Application


---

## 6. TCP/IP Model vs OSI Model

The TCP/IP model (also called the Internet model or DoD model) is the actual model that the internet and virtually all modern networks run on. It has **4 layers** (or 5 in some representations) and maps to the OSI model as follows:

```
OSI Model              TCP/IP Model (4-layer)    TCP/IP Model (5-layer)
┌─────────────────┐    ┌─────────────────────┐   ┌─────────────────────┐
│ 7. Application  │    │                     │   │                     │
├─────────────────┤    │    Application      │   │    Application      │
│ 6. Presentation │    │                     │   │                     │
├─────────────────┤    │                     │   │                     │
│ 5. Session      │    │                     │   │                     │
├─────────────────┤    ├─────────────────────┤   ├─────────────────────┤
│ 4. Transport    │    │     Transport       │   │     Transport       │
├─────────────────┤    ├─────────────────────┤   ├─────────────────────┤
│ 3. Network      │    │     Internet        │   │     Internet        │
├─────────────────┤    ├─────────────────────┤   ├─────────────────────┤
│ 2. Data Link    │    │                     │   │     Data Link       │
├─────────────────┤    │   Network Access    │   ├─────────────────────┤
│ 1. Physical     │    │                     │   │     Physical        │
└─────────────────┘    └─────────────────────┘   └─────────────────────┘
```

### The Four TCP/IP Layers

**Application Layer (maps to OSI 5/6/7)**:
- Combines Session, Presentation, and Application
- Where application protocols live: HTTP, DNS, SMTP, SSH, FTP, RDP
- Data format, encryption (TLS), session management all happen within this layer in TCP/IP

**Transport Layer (maps to OSI 4)**:
- TCP and UDP
- Port numbers, segmentation, reliability, flow control
- Identical in function to OSI Layer 4

**Internet Layer (maps to OSI 3)**:
- IP (v4 and v6) — logical addressing and routing
- ICMP — diagnostics and error reporting
- IPsec — encryption at the IP layer (used in VPNs)
- Routing protocols (OSPF, BGP, EIGRP) enable routers to populate their routing tables

**Network Access Layer / Link Layer (maps to OSI 1/2)**:
- Ethernet, Wi-Fi — physical and data link combined
- ARP — resolving IP to MAC (sits at the boundary of Layer 2/3 — technically it's used by Layer 3 but operates at Layer 2)
- Physical media, NIC drivers

### Why Both Models Matter

- **OSI**: The conceptual framework used for troubleshooting, vendor documentation, certification exams, and discussing where an attack or problem occurs. "This is a Layer 2 issue" means it's a MAC/switching problem. "Layer 7 attack" means an application-level attack.
- **TCP/IP**: What actually runs. Real implementations don't separate Session and Presentation from Application — it's all one layer in practice.

> [!tip] Pentester Context
> When a pentester says "I'm attacking Layer 2," they mean ARP spoofing, MAC flooding, VLAN hopping — attacks against the Ethernet/switching layer. When they say "Layer 3 attack," they mean IP-level manipulation. The OSI model gives everyone a shared vocabulary for communicating precisely about where in the stack an attack or defence operates.

---

## 7. Data Encapsulation and De-encapsulation

Encapsulation is the process of **wrapping data with the headers (and sometimes trailers) required at each layer** as data travels from the application down to the physical medium. De-encapsulation is the reverse — stripping headers as data travels up the stack at the receiving end.

This is one of the most important concepts in networking. Every packet you capture in Wireshark is a nested set of encapsulated headers.

### Encapsulation — Sending Data (Top to Bottom)

**Step 1 — Application Layer (Layer 7)**
The application generates data. Example: Your browser wants to load `http://example.com`. It creates an HTTP GET request:
```
GET / HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
```
This is just text — raw application data. At this stage there is no addressing, no port, no routing information.

**Step 2 — Transport Layer (Layer 4)**
The OS takes the HTTP data and wraps it in a **TCP segment**. The TCP header is prepended:
```
┌──────────────────────────────────────────────┐
│ TCP Header                                   │
│  Source Port: 54231 (ephemeral)              │
│  Destination Port: 80 (HTTP)                 │
│  Sequence Number: 1000                       │
│  Acknowledgement Number: 0                   │
│  Flags: SYN (during handshake) / PSH,ACK     │
│  Window Size: 65535                          │
│  Checksum: [calculated]                      │
├──────────────────────────────────────────────┤
│ HTTP Data (GET / HTTP/1.1...)                │
└──────────────────────────────────────────────┘
```
This unit is called a **Segment**.

**Step 3 — Network Layer (Layer 3)**
The OS takes the TCP segment and wraps it in an **IP packet**. The IP header is prepended:
```
┌──────────────────────────────────────────────┐
│ IP Header                                    │
│  Version: 4                                  │
│  Header Length: 20 bytes                     │
│  TTL: 64                                     │
│  Protocol: 6 (TCP)                           │
│  Source IP: 192.168.1.50                     │
│  Destination IP: 93.184.216.34               │
├──────────────────────────────────────────────┤
│ TCP Segment (TCP Header + HTTP Data)         │
└──────────────────────────────────────────────┘
```
This unit is called a **Packet**.

**Step 4 — Data Link Layer (Layer 2)**
The NIC driver takes the IP packet and wraps it in an **Ethernet frame**. Note: the destination MAC is the next-hop MAC (the router's MAC), not the final destination's MAC.
```
┌─────────────────────────────────────────────────┐
│ Ethernet Header                                  │
│  Destination MAC: AA:BB:CC:DD:EE:FF (router)    │
│  Source MAC: 11:22:33:44:55:66 (my NIC)         │
│  EtherType: 0x0800 (IPv4)                       │
├─────────────────────────────────────────────────┤
│ IP Packet (IP Header + TCP Segment + HTTP Data) │
├─────────────────────────────────────────────────┤
│ Ethernet Trailer (FCS/CRC: 4 bytes)             │
└─────────────────────────────────────────────────┘
```
This unit is called a **Frame**. The FCS (Frame Check Sequence) is a CRC checksum used to detect corruption.

**Step 5 — Physical Layer (Layer 1)**
The NIC converts the frame into electrical signals (copper) or light pulses (fibre) or radio waves (Wi-Fi) and transmits them onto the physical medium.

### De-encapsulation — Receiving Data (Bottom to Top)

At the destination (or each intermediate router), the process reverses:

1. **Physical**: Receives raw signals, converts them to bits
2. **Data Link**: Reads the Ethernet frame, checks the FCS for errors, checks the destination MAC (if it's mine, process it; if not, discard). Strips the Ethernet header and trailer and passes the IP packet up.
3. **Network**: Reads the IP header, checks the destination IP (if it's mine, process it; if not, route it). Strips the IP header and passes the TCP segment up.
4. **Transport**: Reads the TCP header — checks port number to identify which application should receive this data, verifies the checksum, manages sequence/acknowledgement. Strips the TCP header and passes HTTP data up.
5. **Application**: The web server process (listening on port 80) receives the HTTP request and processes it.

### The Importance of Understanding Encapsulation for Pentesters

When you capture a packet in Wireshark, you're seeing all these layers nested inside each other. When you craft a raw packet with Scapy or hping3, you're manually building each of these headers. Understanding encapsulation means you can:
- Craft packets that bypass naive firewalls (e.g., put malicious payload inside an allowed protocol)
- Understand what each field in a packet capture means
- Modify headers at will for spoofing, evasion, and injection

**Wireshark example — reading a captured HTTP request**:
```
Frame 1: 74 bytes on wire
  Ethernet II:
    Destination: Cisco_aa:bb:cc (router)
    Source: Dell_11:22:33 (my NIC)
    Type: IPv4 (0x0800)
  Internet Protocol Version 4:
    Source Address: 192.168.1.50
    Destination Address: 93.184.216.34
    Protocol: TCP (6)
    TTL: 64
  Transmission Control Protocol:
    Source Port: 54231
    Destination Port: 80
    Sequence Number: 1
    Flags: PSH, ACK
  Hypertext Transfer Protocol:
    GET / HTTP/1.1\r\n
    Host: example.com\r\n
```

Reading top-to-bottom, outer-to-inner: Ethernet frame → IP packet → TCP segment → HTTP data.

---

## 8. Binary, Hexadecimal, and Decimal Conversion

This is a prerequisite for subnetting (Module 1), understanding MAC addresses, reading raw packet bytes in Wireshark, and shellcode/exploit development.

### Why Three Number Systems?

- **Decimal (base 10)**: What humans use — digits 0-9. IP addresses are written in decimal for human readability (192.168.1.1)
- **Binary (base 2)**: What computers use — digits 0 and 1. IP addresses are binary at the hardware level. Subnetting requires binary understanding.
- **Hexadecimal (base 16)**: Compact representation of binary. MAC addresses, memory addresses, and protocol values are written in hex. One hex digit = 4 binary bits = half a byte (nibble).

### Decimal to Binary Conversion

Method: **Repeated division by 2**, recording remainders from bottom to top.

Example: Convert 192 to binary
```
192 ÷ 2 = 96  remainder 0
96  ÷ 2 = 48  remainder 0
48  ÷ 2 = 24  remainder 0
24  ÷ 2 = 12  remainder 0
12  ÷ 2 = 6   remainder 0
6   ÷ 2 = 3   remainder 0
3   ÷ 2 = 1   remainder 1
1   ÷ 2 = 0   remainder 1

Reading remainders bottom-to-top: 11000000

192 = 11000000 in binary
```

Alternatively, use the **position value method** (easier for subnetting):
```
Position: 128  64  32  16   8   4   2   1
Value:      1   1   0   0   0   0   0   0
            128+64 = 192 ✓
```

For each octet in an IP address, you have 8 bit positions with values 128, 64, 32, 16, 8, 4, 2, 1. Simply determine which positions you need to sum to reach your number.

**Common octets memorised for subnetting**:
| Decimal | Binary |
|---------|--------|
| 0 | 00000000 |
| 128 | 10000000 |
| 192 | 11000000 |
| 224 | 11100000 |
| 240 | 11110000 |
| 248 | 11111000 |
| 252 | 11111100 |
| 254 | 11111110 |
| 255 | 11111111 |

### Binary to Decimal Conversion

Sum the position values wherever there is a 1.

Example: 10101100
```
Position: 128  64  32  16   8   4   2   1
Bit:        1   0   1   0   1   1   0   0
Value:    128 + 0 + 32 + 0 + 8 + 4 + 0 + 0 = 172
```

### Decimal to Hexadecimal

Method: Repeated division by 16, using A=10, B=11, C=12, D=13, E=14, F=15 for remainders.

Example: Convert 255 to hex
```
255 ÷ 16 = 15  remainder 15 (F)
15  ÷ 16 = 0   remainder 15 (F)

Reading bottom-to-top: FF

255 = 0xFF
```

Example: Convert 192 to hex
```
192 ÷ 16 = 12  remainder 0
12  ÷ 16 = 0   remainder 12 (C)

Reading bottom-to-top: C0

192 = 0xC0
```

### Hex to Binary (Critical for reading packet captures)

Each hex digit maps directly to exactly 4 binary bits:
| Hex | Binary | Decimal |
|-----|--------|---------|
| 0 | 0000 | 0 |
| 1 | 0001 | 1 |
| 2 | 0010 | 2 |
| 3 | 0011 | 3 |
| 4 | 0100 | 4 |
| 5 | 0101 | 5 |
| 6 | 0110 | 6 |
| 7 | 0111 | 7 |
| 8 | 1000 | 8 |
| 9 | 1001 | 9 |
| A | 1010 | 10 |
| B | 1011 | 11 |
| C | 1100 | 12 |
| D | 1101 | 13 |
| E | 1110 | 14 |
| F | 1111 | 15 |

Example: MAC address `AA:BB:CC:DD:EE:FF` in binary:
```
AA = 1010 1010
BB = 1011 1011
CC = 1100 1100
DD = 1101 1101
EE = 1110 1110
FF = 1111 1111
```

Example: EtherType `0x0800` (IPv4) — this appears in Ethernet frame headers in hex. As a pentester reading raw Wireshark bytes, seeing `08 00` tells you the payload is IPv4.

### Quick Conversion Tool (Linux/Windows)

```bash
# Linux: Convert decimal to hex and binary
printf '%x\n' 192      # Output: c0
printf '%d\n' 0xc0     # Output: 192
python3 -c "print(bin(192))"   # Output: 0b11000000
python3 -c "print(hex(192))"   # Output: 0xc0

# Windows PowerShell
[Convert]::ToString(192, 2)    # Decimal to binary: 11000000
[Convert]::ToString(192, 16)   # Decimal to hex: c0
[Convert]::ToInt32("11000000", 2)  # Binary to decimal: 192
```

---

## 9. Physical Media and Hardware

### Network Interface Cards (NICs)

A NIC is the hardware component that connects a device to a network. Every device that communicates on a network has at least one NIC.

**Functions of a NIC**:
- Converts digital data (bits) to the appropriate physical signal for the medium (electrical for copper, light for fibre)
- Contains a hardware-assigned MAC address (burned into firmware — though this can be overridden in software, which is called MAC spoofing)
- Handles the physical layer encoding/decoding
- Operates in **promiscuous mode** when told to by the OS — this causes the NIC to accept all frames on the segment, not just frames addressed to its own MAC. Used by Wireshark and network monitoring tools (and attackers).

**Key NIC specifications**:
- Speed: 100 Mbps / 1 Gbps / 10 Gbps / 25 Gbps / 40 Gbps / 100 Gbps
- Interface: RJ-45 (copper), SFP/SFP+/QSFP (fibre or copper DAC)
- Offloading capabilities: TCP/IP checksum offload, Large Send Offload (LSO), RSS (Receive Side Scaling)

### Copper Cabling (UTP)

UTP (Unshielded Twisted Pair) is the dominant cabling type in enterprise LANs.

**Why twisted?** The twisting of wire pairs cancels out electromagnetic interference (EMI). Pairs with more twists per metre have better noise rejection. This is why Cat6a (tighter twists, sometimes shielded) handles 10 GbE better than Cat5e.

| Category | Max Speed | Max Distance | Use Case |
|----------|-----------|-------------|---------|
| Cat5e | 1 Gbps | 100m | Existing office cabling, acceptable for most workstations |
| Cat6 | 10 Gbps | 55m (at 10G) / 100m (at 1G) | New installations, patch cables |
| Cat6a | 10 Gbps | 100m | Preferred for 10G runs, PoE++ devices, new structured cabling |
| Cat7 | 10 Gbps | 100m | Shielded, rarely used in practice |
| Cat8 | 25–40 Gbps | 30m | Data centre ToR (Top of Rack) short runs |

**Connector**: RJ-45 (8-pin modular). The pinout standard is T568B (or T568A — both are valid, just must be consistent on both ends of a cable).

**Straight-through vs Crossover**:
- Straight-through: Same pinout on both ends. Used between different device types (PC to switch, switch to router).
- Crossover: Transmit and receive pairs swapped. Used between same device types (PC to PC, switch to switch). Modern devices have Auto-MDIX which detects and corrects this automatically.

### Fibre Optic Cabling

Fibre transmits data as light pulses rather than electrical signals. No electromagnetic interference. Immune to wiretapping via inductive taps.

**Multimode Fibre (MMF)**:
- Larger core (50μm or 62.5μm) allows multiple light paths (modes) to travel simultaneously
- Uses LEDs or VCSELs as light source (cheaper)
- Limited to shorter distances due to modal dispersion (modes arrive at slightly different times)
- OM3 (aqua): up to 300m at 10 Gbps; OM4 (aqua): up to 400m at 10 Gbps; OM5 (lime green): up to 150m at 40 Gbps
- Used for: within buildings, server room to MDF/IDF runs

**Single-mode Fibre (SMF)**:
- Tiny core (9μm) — only one light path, no modal dispersion
- Uses lasers as light source (more expensive)
- Capable of very long distances: 10–80 km without amplification, further with amplifiers
- OS1/OS2 types
- Used for: campus backbone, WAN connections, dark fibre

**Fibre connectors**:
| Connector | Description | Use |
|-----------|-------------|-----|
| LC | Small form, latch mechanism | Most common for SFP modules |
| SC | Square, push-pull | Older installations, some patch panels |
| ST | Bayonet (twist-lock) | Legacy |
| MPO/MTP | Multi-fibre, parallel 12+ fibres | High-density data centre |

### SFP Transceivers

SFP (Small Form-factor Pluggable) modules are hot-swappable hardware components that plug into switch/router ports, enabling fibre or copper connectivity.

**Common SFP types**:
| Module | Speed | Media | Distance |
|--------|-------|-------|---------|
| SFP 1000BASE-SX | 1 Gbps | MMF | 550m |
| SFP 1000BASE-LX | 1 Gbps | SMF | 10 km |
| SFP+ 10GBASE-SR | 10 Gbps | MMF | 300m (OM3) |
| SFP+ 10GBASE-LR | 10 Gbps | SMF | 10 km |
| SFP+ DAC | 10 Gbps | Copper (twinax) | 1–5m (rack-level) |
| QSFP28 | 100 Gbps | SMF/MMF | varies |

> [!warning] Compatibility Warning
> Cisco and other vendors implement "SFP lock" — the switch firmware checks if the SFP module is from an approved vendor. Third-party SFP modules may be rejected. In some cases, a CLI command (`service unsupported-transceiver`) can override this, but it voids support. This is a common gotcha when speccing hardware.

### PoE — Power over Ethernet

PoE allows a switch to deliver DC power to connected devices over the Ethernet cable, eliminating the need for a separate power supply.

| Standard | Max Power | Use Case |
|----------|-----------|---------|
| 802.3af (PoE) | 15.4W | IP phones, basic cameras |
| 802.3at (PoE+) | 30W | PTZ cameras, wireless APs |
| 802.3bt (PoE++) | 60–100W | Video conferencing, digital signage |

Common PoE-powered devices: VoIP phones, Wi-Fi access points, IP cameras, door access control panels.

---

## 10. Pentest Lens — Foundations

### Pentest Lens

**Attacker's view**: The foundational knowledge in this module directly informs how a pentester thinks about enumeration and attack planning. Understanding OSI layers helps you precisely identify where your attack sits and what defences you need to bypass at each layer. Understanding topology tells you where to position yourself for maximum visibility or impact.

**Enumeration — What does a network look like from outside?**

Before touching a target, you gather open-source intelligence (OSINT) about their network:

```bash
# Passive recon — identify ASN, IP ranges, BGP data
whois <target-domain>
whois <target-IP>

# Find all IP ranges registered to an organisation
curl https://whois.arin.net/rest/org/<org-handle>/nets

# BGP route enumeration (find all their prefixes)
# bgp.he.net — browse via browser for AS number details

# Identify what's on their internet-facing network
host <target-domain>            # DNS A records
nslookup -type=MX <domain>     # Mail servers
nslookup -type=NS <domain>     # Name servers

# Certificate transparency — enumerate subdomains
curl "https://crt.sh/?q=%.example.com&output=json" | python3 -m json.tool
```

**What physical topology tells an attacker**:
- Star topology with a central switch: if you can ARP poison one device, you're between the gateway and all targets on that segment
- Mesh core: disrupting one link may not isolate anything — harder to cause network disruption
- Single firewall DMZ: compromise a DMZ host, and you're one hop from the internal network

**Layer-by-layer attack selection**:
| Layer | Attacker's First Question | Common Attack |
|-------|--------------------------|--------------|
| 7 | What applications are running? What versions? | CVE exploitation, SQLi, XSS |
| 6 | Is TLS configured correctly? What ciphers? | SSL stripping, POODLE, weak cipher negotiation |
| 5 | Can I hijack an established session? | NTLM relay, session token theft |
| 4 | What ports are open? What service is behind each? | Port scan, SYN flood, protocol confusion |
| 3 | What subnets exist? Can I reach internal ranges? | IP spoofing, ICMP redirect, route injection |
| 2 | What devices are on this segment? Can I intercept traffic? | ARP spoof, MAC flood, VLAN hop |
| 1 | Can I get physical access? | Cable tap, rogue AP, hardware implant |

**Misconfigurations that create attack surface at the foundation level**:
- Network not segmented by function — all devices in a flat /16 network (common in small businesses). An attacker on the guest Wi-Fi or a compromised till can ARP-scan and reach servers directly.
- Unencrypted management protocols in use (Telnet instead of SSH, HTTP instead of HTTPS for switch management)
- Physical comms room accessible without authentication — APs in unlocked hallway cupboards, switches accessible from public areas
- No network documentation — engineers don't know what's on the network, so they can't detect anomalies

**Detection evasion at the foundation level**:
- Passive reconnaissance generates zero packets to the target — cannot be detected
- When moving to active enumeration, use TTLs and timing to blend with normal traffic
- In a flat network, an attacker can move freely once inside — without segmentation, lateral movement looks like normal LAN traffic

**Defender's counter**:
- Network segmentation: VLANs by function (servers, workstations, EPOS, guest), with firewalling between segments
- Physical security: locked comms rooms, cable trays secured, rogue device detection (NAC, 802.1X)
- Encrypted management: SSH for all switches and routers, HTTPS for management UIs, disable Telnet and HTTP management
- Layer 2 hardening: DHCP snooping, Dynamic ARP Inspection (DAI), port security
- Network baseline documentation: know your normal, detect anomalies

---

## Quick Reference — Module 0

### OSI Layers Summary
| Layer | # | PDU | Protocol Examples | Attack Type |
|-------|---|-----|-----------------|------------|
| Application | 7 | Data | HTTP, DNS, SSH, SMTP | App attacks |
| Presentation | 6 | Data | TLS, JPEG | SSL stripping |
| Session | 5 | Data | NetBIOS, RPC | Session hijack |
| Transport | 4 | Segment/Datagram | TCP, UDP | SYN flood, scan |
| Network | 3 | Packet | IP, ICMP, OSPF | IP spoof |
| Data Link | 2 | Frame | Ethernet, ARP | ARP poison |
| Physical | 1 | Bit | Cat6, 802.11 RF | Cable tap |

### Network Types
| Type | Scope | Speed | Example |
|------|-------|-------|---------|
| PAN | <10m | Varies | Bluetooth |
| LAN | Building | 1–10 Gbps | Office network |
| WLAN | Building | Up to 3.5 Gbps | Wi-Fi |
| MAN | City | 1–100 Gbps | Campus fibre |
| WAN | Country/Global | 10 Mbps–100 Gbps | MPLS, internet |

### Topology Comparison
| Topology | Redundancy | Failure Mode | Used In |
|----------|-----------|-------------|---------|
| Bus | None | Cable break = total failure | Legacy only |
| Star | Partial | Central device failure | LAN access layer |
| Ring | Partial | Break stops traffic | Telco optical |
| Full Mesh | High | No SPOF | WAN backbone |
| Partial Mesh | Medium | Depends on links | Distribution/Core |

### Key Port Numbers (Application Layer)
| Port | Protocol | Service |
|------|----------|---------|
| 20/21 | TCP | FTP data/control |
| 22 | TCP | SSH / SFTP |
| 23 | TCP | Telnet |
| 25 | TCP | SMTP |
| 53 | TCP/UDP | DNS |
| 67/68 | UDP | DHCP |
| 80 | TCP | HTTP |
| 88 | TCP/UDP | Kerberos |
| 110 | TCP | POP3 |
| 123 | UDP | NTP |
| 143 | TCP | IMAP |
| 161/162 | UDP | SNMP |
| 389 | TCP/UDP | LDAP |
| 443 | TCP | HTTPS |
| 445 | TCP | SMB |
| 3389 | TCP | RDP |

### Linux Conversion Commands
```bash
python3 -c "print(bin(192))"       # Decimal → Binary
python3 -c "print(hex(192))"       # Decimal → Hex
python3 -c "print(int('c0',16))"   # Hex → Decimal
python3 -c "print(int('11000000',2))"  # Binary → Decimal
```

---

## Related Notes
- [[Module-01-IP-Addressing]] — Subnetting, NAT, DHCP, DNS build on this foundation
- [[Module-02-Devices-Infrastructure]] — Switches, routers, VLANs expand Layer 2/3 concepts
- [[Module-03-Protocols-Deep-Dive]] — Every protocol from the Application Layer table, taken to packet level
- [[Module-04-Network-Security]] — CIA triad, attack categories, and security zones use OSI framing
- [[Module-12-Pentest-Perspective]] — All pentest techniques reference the OSI model
