---
title: "Module 02 — Network Devices & Infrastructure"
tags: [networking, switching, routing, vlans, stp, ospf, eigrp, bgp, etherchannel, pentest, netgod]
module: 2
date: 2026-04-05
---

# Module 02 — Network Devices & Infrastructure

> [!info] Module Overview
> This module covers every physical and logical device in an enterprise network — from hubs to core routers — taken to full depth. You will understand exactly how a switch builds its CAM table, how STP prevents loops, how VLANs segment traffic at Layer 2, how routing protocols populate routing tables, and how attackers target every one of these mechanisms. All CLI examples are production-accurate Cisco IOS.

---

## 1. Hubs vs Switches vs Routers

Understanding the fundamental differences between these three devices is the foundation for everything that follows. They operate at different OSI layers, handle different addressing types, and have entirely different forwarding logic.

### Hubs — Layer 1

A hub is a purely physical device with no intelligence. It has multiple ports, and when it receives an electrical signal on any port, it **repeats that signal out of every other port simultaneously**. Every connected device receives every transmission.

```
[PC1] ──┐
[PC2] ──┤── HUB ── (broadcasts everything to everyone)
[PC3] ──┘
```

**Key characteristics**:
- Operates at Layer 1 — no MAC awareness, no IP awareness
- Single **collision domain**: only one device can transmit at a time. If two devices transmit simultaneously, the signals collide, both must back off and retransmit (CSMA/CD).
- Single **broadcast domain**: broadcasts go to everyone
- Half-duplex operation — devices cannot transmit and receive simultaneously
- No security — every device sees every other device's traffic

**In production**: Hubs are obsolete. Replaced entirely by switches. You will only find them in very old installations, cheap test labs, or in passive network taps designed to copy traffic.

**Pentest relevance**: In a hub-connected segment, any device in promiscuous mode captures all traffic. No ARP spoofing required — just run Wireshark and watch everything. This is why hub-based test environments are useful for traffic analysis training.

### Switches — Layer 2

A switch is an intelligent Layer 2 device. Unlike a hub, it learns which MAC addresses are reachable on each port and forwards frames **only to the port where the destination MAC is located**.

```
[PC1:MAC-A] ──port1──┐
[PC2:MAC-B] ──port2──┤── SWITCH ── Sends frame destined for MAC-B only to port2
[PC3:MAC-C]──port3──┘
```

**CAM Table (Content Addressable Memory)**:

The CAM table (also called the MAC address table) is the switch's forwarding database. It maps MAC addresses to port numbers.

```
MAC Address         VLAN    Port
AA:BB:CC:DD:EE:01    1      Gi0/1
AA:BB:CC:DD:EE:02    1      Gi0/2
AA:BB:CC:DD:EE:03    1      Gi0/3
```

**How the CAM table is built — MAC learning**:

1. **Frame arrives** on port Gi0/1 from PC1 (MAC: `AA:BB:CC:DD:EE:01`)
2. Switch reads the **source MAC** from the Ethernet frame header
3. Switch records: `AA:BB:CC:DD:EE:01` is reachable on port `Gi0/1` (with a timeout, typically 300 seconds)
4. Switch checks the **destination MAC** in its CAM table:
   - If found → forward the frame only to that specific port (**unicast forwarding**)
   - If NOT found → **flood** the frame out all ports except the one it arrived on (**unknown unicast flooding**)
5. Broadcasts (destination MAC: `FF:FF:FF:FF:FF:FF`) are always flooded to all ports in the VLAN

**Viewing the CAM table on Cisco IOS**:
```cisco
! Show all MAC addresses in the table
show mac address-table

! Filter by specific MAC
show mac address-table address AA:BB:CC:DD:EE:01

! Filter by interface
show mac address-table interface GigabitEthernet0/1

! Filter by VLAN
show mac address-table vlan 10

! Show table statistics
show mac address-table count

! Manually clear the table (forces relearning)
clear mac address-table dynamic
```

**Expected output**:
```
Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
   1    aabb.ccdd.ee01   DYNAMIC     Gi0/1
   1    aabb.ccdd.ee02   DYNAMIC     Gi0/2
  10    aabb.ccdd.ee03   STATIC      Gi0/3    ← Static entry (manually configured or sticky)
```

**Key characteristics**:
- Separate **collision domain** per port — full-duplex possible (no collisions)
- Single **broadcast domain** per VLAN (all ports in same VLAN share one broadcast domain)
- Forwarding is hardware-accelerated via ASIC (Application-Specific Integrated Circuit) — wire-speed forwarding

**Frame forwarding modes**:
| Mode | Behaviour | Latency | Error Checking |
|------|-----------|---------|---------------|
| Store-and-Forward | Receives entire frame, checks CRC, then forwards | Higher | Yes — drops corrupt frames |
| Cut-Through | Starts forwarding after reading destination MAC (first 6 bytes) | Lower | No — corrupt frames forwarded |
| Fragment-Free | Waits for first 64 bytes (minimum frame size catches most collisions) then forwards | Medium | Partial |

Modern enterprise switches use store-and-forward. Cut-through is used in ultra-low-latency environments (high-frequency trading).

### Routers — Layer 3

A router makes forwarding decisions based on **IP addresses**, moving packets between different networks. Where a switch keeps devices in the same network in communication, a router enables communication **between** networks.

```
[LAN: 192.168.1.0/24] ──eth0── ROUTER ──eth1── [LAN: 10.0.0.0/8]
                                  |
                                eth2
                                  |
                            [Internet: 203.0.113.0/24]
```

**Routing table**: The router's forwarding database. Contains network destinations and the next-hop IP (or outgoing interface) to reach them.

```cisco
! Show routing table
show ip route

! Example output:
Codes: C - connected, S - static, R - RIP, O - OSPF, B - BGP
       D - EIGRP, EX - EIGRP external, IA - OSPF inter area

Gateway of last resort is 203.0.113.1 to network 0.0.0.0

C     192.168.1.0/24 is directly connected, GigabitEthernet0/1
C     10.0.0.0/8 is directly connected, GigabitEthernet0/2
S     0.0.0.0/0 [1/0] via 203.0.113.1     ← Default route (gateway of last resort)
O     172.16.0.0/16 [110/20] via 10.0.0.1  ← OSPF-learned route
```

**Routing table fields**:
- Code letter: how the route was learned (C=connected, S=static, O=OSPF, etc.)
- Network/prefix
- `[AD/metric]`: Administrative Distance / metric — `[110/20]` means OSPF (AD 110), metric 20
- `via x.x.x.x`: next-hop IP address
- Outgoing interface

**Collision domains**: Each router interface is its own collision domain AND its own broadcast domain. Routers do not forward broadcasts.

**Key differences summary**:
| Feature | Hub | Switch | Router |
|---------|-----|--------|--------|
| OSI Layer | 1 | 2 | 3 |
| Addressing | None | MAC | IP |
| Collision domains | 1 (shared) | 1 per port | 1 per interface |
| Broadcast domains | 1 | 1 per VLAN | 1 per interface |
| Forwards broadcasts | Yes | Yes (within VLAN) | No |
| Forwarding decision | None (floods all) | MAC table | Routing table |
| Duplex | Half | Full | Full |

---

## 2. Switches — Deep Dive

### Switch Port Configuration (Cisco IOS)

```cisco
! Enter interface configuration
interface GigabitEthernet0/1
 description "Workstation - PC01"
 duplex full
 speed 1000
 no shutdown

! Show interface status
show interfaces GigabitEthernet0/1
show interfaces status              ! Summary of all ports

! Show interface counters (errors, drops)
show interfaces GigabitEthernet0/1 counters
```

**Understanding `show interfaces` output**:
```
GigabitEthernet0/1 is up, line protocol is up
  Hardware is Gigabit Ethernet, address is aabb.ccdd.0001
  Internet address is 192.168.1.1/24
  MTU 1500 bytes, BW 1000000 Kbit/sec, DLY 10 usec
  Full-duplex, 1000Mb/s, media type is T
  Input queue: 0/2000/0/0 (size/max/drops/flushes)
  5 minute input rate 15000 bits/sec, 12 packets/sec
  5 minute output rate 8000 bits/sec, 7 packets/sec
     1234567 packets input, 987654321 bytes
     0 input errors, 0 CRC, 0 frame, 0 overrun, 0 ignored
     987654 packets output, 123456789 bytes
     0 output errors, 0 collisions, 0 late collision
```

**Key fields**:
- `up, line protocol is up`: Physical link + Layer 2 protocol both operational
- `up, line protocol is down`: Cable connected but no Layer 2 (misconfiguration, other end down)
- `down, line protocol is down`: No cable or cable fault
- `administratively down`: Port shut down with `shutdown` command
- CRC errors: Corrupt frames — bad cable, duplex mismatch, or NIC fault
- Late collisions: Always indicates a duplex mismatch or cable > 100m

### Port Security

Port security limits which MAC addresses can connect on an access port, preventing unauthorised devices.

```cisco
interface GigabitEthernet0/1
 switchport mode access
 switchport access vlan 10
 switchport port-security                        ! Enable port security
 switchport port-security maximum 2              ! Allow max 2 MAC addresses
 switchport port-security mac-address sticky     ! Auto-learn and save MACs
 switchport port-security violation restrict     ! Action on violation: restrict (drop + log)
 ! Other violation modes: protect (drop silently), shutdown (err-disable the port)

! View port security status
show port-security interface GigabitEthernet0/1
show port-security address
```

**Violation modes**:
| Mode | Drops Frames | Sends SNMP Trap | Increments Counter | Disables Port |
|------|-------------|-----------------|-------------------|--------------|
| Protect | Yes | No | No | No |
| Restrict | Yes | Yes | Yes | No |
| Shutdown | Yes | Yes | Yes | Yes (err-disable) |

### Dynamic ARP Inspection (DAI)

DAI validates ARP packets against the DHCP snooping binding table. If an ARP reply claims a MAC-to-IP mapping that doesn't exist in the binding table, DAI drops it — defeating ARP spoofing attacks.

```cisco
! Requires DHCP snooping to be configured first
ip dhcp snooping
ip dhcp snooping vlan 10

! Enable DAI on VLAN 10
ip arp inspection vlan 10

! Mark uplinks as trusted (bypass DAI checking)
interface GigabitEthernet0/24
 ip arp inspection trust

! Verify
show ip arp inspection vlan 10
show ip arp inspection statistics
```

---

## 3. STP — Spanning Tree Protocol (IEEE 802.1D)

### The Problem STP Solves

In a redundant switched network, loops can exist:

```
        [Switch A]
        /         \
  [Switch B] --- [Switch C]
```

Without STP, a broadcast frame entering Switch A would be forwarded to B and C. B would forward it to C (and A), C would forward it to B (and A) — infinite loop. Within seconds, the network is saturated and all switches crash. This is called a **broadcast storm**.

STP detects loops and **logically blocks** one or more ports to eliminate the loop while maintaining a loop-free topology. If a link fails, STP recalculates and unblocks an alternate path.

### STP Operation — Step by Step

**Step 1: Elect a Root Bridge**

All switches participate in a Root Bridge election. The switch with the **lowest Bridge ID** wins.

Bridge ID = Priority (16-bit) + MAC Address (48-bit)
Default priority = 32768

```
Switch A: Priority 32768, MAC 00:11:22:33:44:01 → Bridge ID: 32768.001122334401
Switch B: Priority 32768, MAC 00:11:22:33:44:02 → Bridge ID: 32768.001122334402
Switch C: Priority 32768, MAC 00:11:22:33:44:03 → Bridge ID: 32768.001122334403

Lowest MAC with equal priority → Switch A wins Root Bridge election
```

**Step 2: Elect Root Ports**

On every non-root switch, the port with the **lowest path cost to the Root Bridge** becomes the Root Port (RP). One Root Port per non-root switch.

**STP port cost values**:
| Link Speed | STP Cost (802.1D) | RSTP Cost (802.1w) |
|-----------|-------------------|-------------------|
| 10 Mbps | 100 | 2,000,000 |
| 100 Mbps | 19 | 200,000 |
| 1 Gbps | 4 | 20,000 |
| 10 Gbps | 2 | 2,000 |

**Step 3: Elect Designated Ports**

On every network segment, the switch with the **lowest cost path to the Root Bridge** has its port elected as the Designated Port (DP). The Designated Port forwards traffic for that segment.

**Step 4: Block Remaining Ports**

Any port that is neither a Root Port nor a Designated Port is placed in **Blocking** state. This breaks the loop.

```
         [Switch A] ← Root Bridge
         /    DP  DP \
        RP          RP
    [Switch B] --- [Switch C]
              DP  BLK
                 ↑
         This port is blocked — loop broken
```

### STP Port States (802.1D)

| State | Forwards Frames | Learns MACs | Duration |
|-------|---------------|------------|---------|
| Blocking | No | No | 20 seconds (Max Age) |
| Listening | No | No | 15 seconds (Forward Delay) |
| Learning | No | Yes | 15 seconds (Forward Delay) |
| Forwarding | Yes | Yes | Stable |
| Disabled | No | No | Administratively shutdown |

**Total convergence time for 802.1D**: Up to **50 seconds** (20 blocking + 15 listening + 15 learning). This is why RSTP was developed.

### BPDU — Bridge Protocol Data Unit

STP switches communicate using BPDUs — special frames exchanged between switches to share topology information.

**Key BPDU fields**:
- Root Bridge ID (who the current Root Bridge is)
- Root Path Cost (sender's cost to reach the Root Bridge)
- Sender Bridge ID
- Port ID
- Timers: Hello (2s), Max Age (20s), Forward Delay (15s)

BPDUs are sent every 2 seconds (Hello timer) by the Root Bridge. Non-root switches relay BPDUs downstream. If a switch stops receiving BPDUs on a port for Max Age (20s), it assumes the upstream path has failed and begins recalculating.

```cisco
! View BPDUs being sent/received (Cisco IOS)
debug spanning-tree bpdu

! Show STP status
show spanning-tree
show spanning-tree vlan 10
show spanning-tree summary
```

**Show spanning-tree output**:
```
VLAN0010
  Spanning tree enabled protocol ieee
  Root ID    Priority    32778
             Address     aabb.ccdd.0001
             This bridge is the root
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec

  Bridge ID  Priority    32778  (priority 32768 sys-id-ext 10)
             Address     aabb.ccdd.0001
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec

Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- ----
Gi0/1               Desg FWD 4         128.1    P2p
Gi0/2               Desg FWD 4         128.2    P2p
Gi0/3               Root FWD 4         128.3    P2p
```

### Configuring STP (Cisco IOS)

```cisco
! Set this switch as primary root for VLAN 10
spanning-tree vlan 10 root primary
! This sets priority to 24576 (below default 32768)

! Or manually set priority (must be a multiple of 4096)
spanning-tree vlan 10 priority 4096

! Set secondary root (priority 28672)
spanning-tree vlan 10 root secondary

! Manually set port cost
interface GigabitEthernet0/1
 spanning-tree cost 10

! Manually set port priority (lower = preferred)
interface GigabitEthernet0/1
 spanning-tree port-priority 64
```

### PortFast and BPDU Guard

**PortFast**: Bypasses Listening and Learning states for access ports connected to end devices (PCs, servers). Port goes directly to Forwarding. Safe to use on ports that will never connect to another switch.

```cisco
interface GigabitEthernet0/1
 spanning-tree portfast
! Or globally for all access ports:
spanning-tree portfast default
```

**BPDU Guard**: Shuts down a PortFast-enabled port if it receives a BPDU. Prevents someone from connecting a rogue switch to an access port.

```cisco
interface GigabitEthernet0/1
 spanning-tree portfast
 spanning-tree bpduguard enable
! Or globally:
spanning-tree portfast bpduguard default

! If port goes err-disabled due to BPDU Guard:
! 1. Remove the rogue switch
! 2. Manually bring port back up:
interface GigabitEthernet0/1
 shutdown
 no shutdown
! Or configure auto-recovery:
errdisable recovery cause bpduguard
errdisable recovery interval 30
```

### RSTP — Rapid Spanning Tree Protocol (IEEE 802.1w)

RSTP dramatically reduces convergence time — from 50 seconds to **1–2 seconds** — by using active negotiation between switches rather than waiting for timers.

**Key improvements over 802.1D**:
- New port roles: Alternate Port (backup to Root Port), Backup Port (backup to Designated Port)
- Edge ports (equivalent to PortFast) transition immediately to Forwarding
- Proposal/Agreement mechanism: switches negotiate directly to activate ports faster
- No Listening state — ports go directly from Discarding to Learning to Forwarding

**RSTP port states** (simplified from 802.1D's 5 to 3):
| RSTP State | 802.1D Equivalent | Forwards? | Learns? |
|-----------|------------------|----------|--------|
| Discarding | Blocking + Listening | No | No |
| Learning | Learning | No | Yes |
| Forwarding | Forwarding | Yes | Yes |

```cisco
! Enable RSTP (Cisco calls it rapid-pvst+)
spanning-tree mode rapid-pvst

! Verify
show spanning-tree | include Mode
```

### PVST+ and Rapid PVST+

Cisco's default STP implementation is **PVST+** (Per-VLAN Spanning Tree Plus) — a separate STP instance runs for each VLAN. This allows load balancing: VLAN 10 has Switch A as root, VLAN 20 has Switch B as root.

**Rapid PVST+** = RSTP per VLAN. Cisco's recommended mode.

**MSTP (IEEE 802.1s)** — Multiple Spanning Tree: groups multiple VLANs into instances to reduce the number of STP processes. Used in large deployments with many VLANs.

---

## 4. VLANs — Virtual Local Area Networks

### What Is a VLAN?

A VLAN is a **logical segmentation** of a switch. Ports assigned to different VLANs cannot communicate at Layer 2, even if they're on the same physical switch. From each VLAN's perspective, it's on its own dedicated switch.

**Why VLANs**:
- **Security**: Separate sensitive systems (servers, EPOS tills, finance workstations) from general-purpose segments
- **Performance**: Reduce broadcast domain size — smaller VLANs = fewer devices receive each broadcast
- **Management**: Group devices logically by function rather than physical location
- **Compliance**: PCI DSS requires cardholder data systems to be network-segmented

### IEEE 802.1Q — VLAN Tagging

802.1Q is the standard for VLAN tagging. A 4-byte **802.1Q tag** is inserted into the Ethernet frame header to carry VLAN information across trunk links.

**Standard Ethernet frame**:
```
| Dst MAC (6) | Src MAC (6) | EtherType (2) | Payload | FCS (4) |
```

**802.1Q tagged frame**:
```
| Dst MAC (6) | Src MAC (6) | 802.1Q Tag (4) | EtherType (2) | Payload | FCS (4) |
                                    ↑
                    ┌───────────────────────────────┐
                    │ TPID: 0x8100 (2 bytes)        │ ← Identifies this as a tagged frame
                    │ PCP: 3 bits (priority/QoS)    │
                    │ DEI: 1 bit (drop eligible)    │
                    │ VID: 12 bits (VLAN ID 1-4094) │
                    └───────────────────────────────┘
```

The VLAN ID (VID) field is 12 bits → supports VLANs 1–4094 (0 and 4095 are reserved).

### Access Ports vs Trunk Ports

**Access Port**: Connects to an end device (PC, server, printer, IP phone). Belongs to a single VLAN. Frames sent to/from the device are **untagged** — the device has no knowledge of VLANs.

```cisco
interface GigabitEthernet0/1
 switchport mode access
 switchport access vlan 10
 description "PC - VLAN 10 Staff"
```

**Trunk Port**: Connects switch-to-switch or switch-to-router. Carries traffic for **multiple VLANs simultaneously**. Frames are **tagged** with the VLAN ID (except the native VLAN).

```cisco
interface GigabitEthernet0/24
 switchport mode trunk
 switchport trunk encapsulation dot1q        ! Required on some older platforms
 switchport trunk allowed vlan 10,20,30,40  ! Only allow specific VLANs
 switchport trunk native vlan 99            ! Set native VLAN (untagged VLAN on trunk)
 description "Uplink to Distribution Switch"
```

**Native VLAN**: The one VLAN on a trunk whose frames are sent **untagged**. By default this is VLAN 1. This is a critical security consideration — see Pentest Lens.

```cisco
! Verify trunk configuration
show interfaces GigabitEthernet0/24 trunk

! Output shows:
! Port   Mode    Encapsulation  Status    Native vlan
! Gi0/24 on      802.1q         trunking  99

! Also shows allowed VLANs, VLANs in STP forwarding state
```

### VLAN Database

```cisco
! Create VLANs
vlan 10
 name STAFF_PCS
vlan 20
 name SERVERS
vlan 30
 name EPOS_TILLS
vlan 40
 name MANAGEMENT
vlan 99
 name NATIVE_TRUNK

! Verify
show vlan brief
show vlan id 10
```

### Inter-VLAN Routing

VLANs are isolated at Layer 2. For devices in different VLANs to communicate, traffic must pass through a Layer 3 device (router or Layer 3 switch).

**Option 1 — Router-on-a-Stick (ROAS)**:
One physical router interface, multiple sub-interfaces — one per VLAN.

```cisco
! Router configuration
interface GigabitEthernet0/0
 no ip address
 no shutdown

interface GigabitEthernet0/0.10
 encapsulation dot1q 10
 ip address 192.168.10.1 255.255.255.0
 description "Gateway for VLAN 10"

interface GigabitEthernet0/0.20
 encapsulation dot1q 20
 ip address 192.168.20.1 255.255.255.0
 description "Gateway for VLAN 20"

interface GigabitEthernet0/0.99
 encapsulation dot1q 99 native
 description "Native VLAN"
```

**Option 2 — Layer 3 Switch with SVIs (Switched Virtual Interfaces)**:
More common in enterprise — no separate router needed.

```cisco
! Enable IP routing on L3 switch
ip routing

! Create SVI (virtual interface for each VLAN)
interface Vlan10
 ip address 192.168.10.1 255.255.255.0
 no shutdown
 description "Gateway for VLAN 10"

interface Vlan20
 ip address 192.168.20.1 255.255.255.0
 no shutdown
 description "Gateway for VLAN 20"

! Verify SVIs
show interfaces vlan 10
show ip interface brief
```

### VTP — VLAN Trunking Protocol

VTP propagates VLAN database changes from a VTP Server switch to all VTP Client switches automatically — no need to create VLANs on every switch.

> [!danger] VTP Risk
> VTP is dangerous. A new switch added to the network with a higher VTP revision number can overwrite the VLAN database on all other switches — deleting all VLANs and bringing down the network. Always reset VTP revision number on new switches before connecting them. Or disable VTP entirely (transparent mode) and manage VLANs manually.

```cisco
! VTP modes
vtp mode server       ! Can create/modify/delete VLANs, propagates changes
vtp mode client       ! Cannot modify VLANs locally, receives from server
vtp mode transparent  ! Doesn't participate, passes VTP frames but doesn't apply them

! Set VTP domain and password
vtp domain CORP
vtp password SecureVTPPass

! Check VTP status
show vtp status
```

---

## 5. Routers — Deep Dive

### Routing Table and Administrative Distance

When a router learns about the same destination network from multiple sources, it uses **Administrative Distance (AD)** to decide which source to trust. Lower AD = more trusted = wins.

| Routing Source | Default AD |
|---------------|-----------|
| Directly Connected | 0 |
| Static Route | 1 |
| EIGRP Summary | 5 |
| External BGP (eBGP) | 20 |
| EIGRP Internal | 90 |
| OSPF | 110 |
| IS-IS | 115 |
| RIP | 120 |
| EIGRP External | 170 |
| Internal BGP (iBGP) | 200 |
| Unknown / Unreachable | 255 |

**Floating static routes**: A static route with a manually set higher AD, used as a backup if a dynamic route disappears.

```cisco
! Normal static route (AD 1)
ip route 192.168.10.0 255.255.255.0 10.0.0.2

! Floating static (AD 150) — only used if OSPF (AD 110) route disappears
ip route 192.168.10.0 255.255.255.0 10.0.0.3 150
```

### Static Routes

```cisco
! Static route: reach 10.10.10.0/24 via next-hop 192.168.1.1
ip route 10.10.10.0 255.255.255.0 192.168.1.1

! Default route (send all unknown traffic to 203.0.113.1)
ip route 0.0.0.0 0.0.0.0 203.0.113.1

! Static route with outgoing interface (rather than next-hop IP)
ip route 10.10.10.0 255.255.255.0 GigabitEthernet0/0

! Verify
show ip route static
show ip route 10.10.10.0
```

---

## 6. Routing Protocols

### RIPv2 — Routing Information Protocol version 2

RIP is a **distance-vector** protocol — routers share their entire routing table with directly connected neighbours. Routes are measured in **hop count** (max 15 hops; 16 = unreachable). Simple but slow to converge and unsuitable for large networks.

```cisco
router rip
 version 2
 network 192.168.1.0
 network 10.0.0.0
 no auto-summary          ! Disable classful auto-summarisation
 passive-interface GigabitEthernet0/1   ! Don't send RIP updates out this interface
```

**RIP timers**:
- Update: 30s (send full routing table to neighbours)
- Invalid: 180s (route marked invalid if no update received)
- Holddown: 180s (ignore updates for an invalid route — prevents routing loops)
- Flush: 240s (remove route from table)

**RIPv2 improvements over v1**:
- Supports VLSM (sends subnet mask with each route)
- Supports authentication (MD5)
- Uses multicast 224.0.0.9 instead of broadcast

### OSPF — Open Shortest Path First (Full Depth)

OSPF is a **link-state** routing protocol — the industry standard for enterprise interior routing. Unlike RIP, each router builds a complete map of the network topology (the LSDB — Link State Database) and independently calculates the shortest path using Dijkstra's algorithm.

#### OSPF Key Concepts

**Link-state vs distance-vector**:
- Distance-vector (RIP): Share routing table. "I know how to get there, trust me." — Routers don't know the full topology.
- Link-state (OSPF): Share information about directly connected links. Every router builds a full topology map and calculates paths independently.

**Metric**: OSPF uses **cost** = 10⁸ / interface bandwidth (in bps). Lower cost = preferred path.
- 100 Mbps interface: cost = 10⁸ / 100,000,000 = **1**
- 1 Gbps interface: cost = 10⁸ / 1,000,000,000 = **0.1** → rounds to 1 (Cisco default)
- To differentiate GbE from 10GbE, increase the reference bandwidth: `auto-cost reference-bandwidth 10000` (sets reference to 10 Gbps)

#### OSPF Neighbour Establishment — Step by Step

Two OSPF routers on the same link go through these states to become full neighbours:

```
Down → Init → 2-Way → ExStart → Exchange → Loading → Full
```

1. **Down**: No OSPF packets received from this neighbour yet
2. **Init**: Hello packet received — I see the neighbour, but neighbour hasn't listed me in their Hello yet
3. **2-Way**: Neighbour has listed my Router ID in their Hello. On point-to-point links, jump to ExStart. On multi-access networks, DR/BDR election happens here.
4. **ExStart**: Master/Slave election for the DD (Database Description) exchange. Router with higher Router ID becomes Master.
5. **Exchange**: Routers exchange DD packets — summaries of their LSDB. Each router identifies which LSAs it's missing.
6. **Loading**: Routers send LSR (Link State Request) packets to request full copies of missing LSAs. Replies are LSU (Link State Update) packets.
7. **Full**: LSDBs are synchronised. Routers are fully adjacent.

> [!info] Router ID
> OSPF uses a 32-bit Router ID (RID) to uniquely identify each router. Selection order: (1) manually configured (`router-id x.x.x.x`), (2) highest IP on a loopback interface, (3) highest IP on any active interface. Always manually set the RID — automatic selection causes instability if interfaces go up/down.

#### DR and BDR Election (Multi-Access Networks)

On Ethernet segments (multi-access), OSPF forms full adjacency with every other router — O(n²) relationships. With 10 routers, that's 45 adjacencies. This doesn't scale.

OSPF solves this with **DR (Designated Router)** and **BDR (Backup Designated Router)**. Other routers (DROthers) form full adjacency only with the DR and BDR, not with each other.

**DR/BDR election**:
1. Highest OSPF priority wins DR (default priority = 1, range 0–255, 0 = never becomes DR)
2. Tie → highest Router ID wins
3. BDR = second highest priority/RID

```cisco
! Set OSPF priority on an interface (higher = more likely to be DR)
interface GigabitEthernet0/0
 ip ospf priority 200    ! Make this router preferred for DR

! Priority 0 = never become DR or BDR
interface GigabitEthernet0/1
 ip ospf priority 0
```

> [!warning] DR Election is Non-Preemptive
> Once a DR is elected, it stays DR even if a router with higher priority joins later. The new router becomes BDR. DR changes only occur when the current DR fails. **Always set priorities before bringing up OSPF on a segment** to ensure the right router becomes DR.

#### OSPF LSA Types

LSAs (Link State Advertisements) are the packets that carry topology information between OSPF routers. Understanding LSA types is critical for advanced OSPF troubleshooting and for understanding what information is visible where.

| LSA Type | Name | Generated By | Describes | Flooded To |
|----------|------|-------------|-----------|-----------|
| Type 1 | Router LSA | Every router | Router's links and costs | Within the originating area |
| Type 2 | Network LSA | DR on multi-access | All routers on segment | Within the area |
| Type 3 | Summary LSA | ABR (Area Border Router) | Routes between areas | Other areas |
| Type 4 | ASBR Summary LSA | ABR | Location of ASBR | Other areas |
| Type 5 | AS External LSA | ASBR | External routes (redistribution) | Entire OSPF domain |
| Type 7 | NSSA External LSA | ASBR in NSSA | External routes in NSSA | NSSA area only |

#### OSPF Areas

OSPF uses **areas** to limit LSA flooding and LSDB size. All areas must connect to **Area 0 (the backbone area)**.

```
[Area 1] --- [ABR] --- [Area 0 Backbone] --- [ABR] --- [Area 2]
                              |
                            [ASBR]
                              |
                         [External Network / Internet]
```

- **ABR (Area Border Router)**: Connects two OSPF areas. Has an interface in Area 0 and at least one other area.
- **ASBR (AS Boundary Router)**: Redistributes routes from external routing domains (e.g., BGP, EIGRP, static) into OSPF.

**OSPF area types**:
| Area Type | Type 3 LSAs | Type 5 LSAs | Type 7 LSAs | Use Case |
|-----------|------------|------------|------------|---------|
| Standard | Yes | Yes | No | Default |
| Stub | Yes (default route only) | No | No | No external routes needed |
| Totally Stubby | Default route only | No | No | Minimal routing table |
| NSSA | Yes | No | Yes | Allow redistribution without Type 5 |
| Totally NSSA | Default only | No | Yes | Most restrictive, with redistribution |

#### OSPF Configuration (Full)

```cisco
! Enable OSPF, process ID 1 (local significance only)
router ospf 1

! Set router ID manually (always do this)
 router-id 1.1.1.1

! Advertise networks into OSPF
! network <network> <wildcard> area <area-number>
 network 192.168.1.0 0.0.0.255 area 0
 network 10.0.0.0 0.0.0.3 area 0
 network 172.16.0.0 0.0.255.255 area 1

! Set reference bandwidth to 10 Gbps (fixes cost calculation for GbE/10GbE)
 auto-cost reference-bandwidth 10000

! Passive interface — advertise network but don't send Hello packets
 passive-interface GigabitEthernet0/2

! Default route redistribution — advertise a default route to all OSPF routers
 default-information originate always    ! 'always' = advertise even without a default route ourselves

! Configure OSPF authentication (MD5) on an interface
interface GigabitEthernet0/0
 ip ospf authentication message-digest
 ip ospf message-digest-key 1 md5 OSPFSecretPass

! Set OSPF timers on interface (hello/dead intervals)
interface GigabitEthernet0/0
 ip ospf hello-interval 5      ! Default 10s on broadcast, 30s on NBMA
 ip ospf dead-interval 20      ! Default: 4x hello interval
```

**OSPF verification commands**:
```cisco
! Show OSPF neighbours and their states
show ip ospf neighbor

! Expected output:
! Neighbor ID  Pri  State    Dead Time  Address      Interface
! 2.2.2.2       1   FULL/DR  00:00:38   10.0.0.2     Gi0/0
! 3.3.3.3       1   FULL/BDR 00:00:34   10.0.0.3     Gi0/0

! Show OSPF routing table entries
show ip route ospf

! Show OSPF LSDB
show ip ospf database
show ip ospf database router           ! Type 1 LSAs
show ip ospf database network          ! Type 2 LSAs
show ip ospf database summary          ! Type 3 LSAs
show ip ospf database external         ! Type 5 LSAs

! Show OSPF interface detail (timers, cost, DR/BDR)
show ip ospf interface GigabitEthernet0/0

! Show OSPF process information
show ip ospf
```

### EIGRP — Enhanced Interior Gateway Routing Protocol

EIGRP is a Cisco-proprietary (now open standard, RFC 7868) **advanced distance-vector** protocol. It uses the **DUAL (Diffusing Update Algorithm)** to guarantee loop-free paths and provides very fast convergence.

**Key EIGRP concepts**:
- **Successor**: The best path to a destination (installed in the routing table)
- **Feasible Successor**: A backup path that is pre-computed and guaranteed loop-free. If the Successor fails, the Feasible Successor is immediately used — no recalculation needed (sub-second convergence)
- **Metric**: Composite — Bandwidth + Delay (by default). Can also include load, reliability, MTU.
- **EIGRP uses Reliable Transport Protocol (RTP)** for guaranteed delivery of routing updates

```cisco
! Configure EIGRP AS 100
router eigrp 100
 network 192.168.1.0 0.0.0.255
 network 10.0.0.0 0.0.0.3
 no auto-summary
 eigrp router-id 1.1.1.1

! Show EIGRP neighbours
show ip eigrp neighbors

! Show EIGRP topology table (all routes including feasible successors)
show ip eigrp topology

! Show EIGRP routing table entries
show ip route eigrp
```

### BGP — Border Gateway Protocol (Overview)

BGP is the routing protocol of the internet. It is an **exterior gateway protocol** — designed to exchange routing information between different Autonomous Systems (AS). Every ISP, cloud provider, and large organisation has an AS number.

**Key concepts**:
- **AS (Autonomous System)**: A collection of networks under a single administrative domain. Identified by an AS Number (ASN).
- **eBGP (external BGP)**: Between routers in different ASes (e.g., your organisation's router and your ISP's router)
- **iBGP (internal BGP)**: Between routers within the same AS
- BGP is path-vector — it tracks the full AS path a route has traversed (loop prevention)
- BGP is extremely slow to converge by design — stability is prioritised over speed on the internet

```cisco
! Basic BGP configuration — connect to ISP (AS 65001) from our AS (65000)
router bgp 65000
 bgp router-id 203.0.113.2
 neighbor 203.0.113.1 remote-as 65001    ! ISP's router
 network 203.0.113.0 mask 255.255.255.0  ! Advertise our prefix to ISP
 
! Verify
show ip bgp summary
show ip bgp
show ip bgp neighbors 203.0.113.1
```

---

## 7. EtherChannel — LACP and PAgP

EtherChannel bundles multiple physical links into a single logical link, providing both increased bandwidth and redundancy.

```
[Switch A] ====== [Switch B]   (4x 1GbE = logical 4GbE link, redundant)
            (4 cables)
```

**Protocols**:
- **LACP (Link Aggregation Control Protocol)** — IEEE 802.3ad standard. Preferred — interoperable between vendors.
- **PAgP (Port Aggregation Protocol)** — Cisco proprietary. Only between Cisco devices.
- **Static (on/on)** — No negotiation protocol. Both sides manually set to channel-group mode on.

```cisco
! Configure LACP EtherChannel — both switches must match
interface range GigabitEthernet0/1 - 4
 channel-protocol lacp
 channel-group 1 mode active    ! active = initiate LACP / passive = wait for LACP

! Configure the Port-Channel logical interface
interface Port-Channel1
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30

! Verify
show etherchannel summary
show etherchannel 1 detail
show interfaces port-channel 1
```

**LACP modes**:
| Mode | Behaviour |
|------|-----------|
| Active | Actively sends LACP packets — initiates negotiation |
| Passive | Responds to LACP, won't initiate |
| On | Static — no protocol, must match on both ends |

> [!warning] EtherChannel Misconfiguration
> All ports in an EtherChannel must have matching configuration (speed, duplex, VLAN assignments, trunk settings). Mismatched ports cause the channel to fail and often trigger STP loops. Always verify with `show etherchannel summary` — look for "P" (in port-channel) not "D" (down) or "s" (suspended).

---

## 8. STP Attacks — Full Detail

### Attack 1: BPDU Spoofing / Root Bridge Takeover

An attacker connected to the network sends crafted BPDUs claiming a superior Bridge ID (priority 0). All switches accept this as the new Root Bridge. The attacker's machine becomes the root, and STP recalculates — forcing traffic paths through the attacker's device. This creates a man-in-the-middle position for all Layer 2 traffic on affected VLANs.

```
Before attack:
[Switch A - Root] → [Switch B] → [Switch C]

After BPDU spoofing:
[Attacker - Fake Root] → [Switch A] → [Switch B] → [Switch C]
Traffic from B to C now goes via Attacker's machine
```

**Tool: Yersinia**
```bash
# Install
apt install yersinia

# Interactive mode — STP attack
yersinia -I
# Select STP → Claiming Root Role attack
# This sends BPDUs with priority 0 and the attacker's MAC

# Or command line
yersinia stp -attack 4    # Attack 4 = Claiming Root Role
```

**What the attacker gains**: A MITM position for all traffic on that segment. Can capture credentials, inject traffic, or simply monitor. Note: this is a Layer 2 attack — only effective within the same broadcast domain (same VLAN, same physical segment or trunk).

### Attack 2: MAC Flooding (CAM Table Overflow)

Send thousands of frames with different spoofed source MAC addresses. The switch's CAM table fills up — it can no longer learn new legitimate MAC addresses. When the CAM table is full, the switch **falls back to hub behaviour** — flooding all frames out all ports. All traffic is now visible to the attacker in promiscuous mode.

```bash
# macof — MAC flooding tool (from dsniff package)
apt install dsniff
macof -i eth0            # Flood with random MACs on eth0
macof -i eth0 -n 10000  # Send 10000 frames
```

**Defender's counter**:
```cisco
! Port security — limit MACs per port
interface GigabitEthernet0/1
 switchport port-security maximum 3
 switchport port-security violation restrict
```

### Mitigation for STP Attacks

```cisco
! BPDU Guard — shut down port if BPDU received (for access ports)
interface GigabitEthernet0/1
 spanning-tree portfast
 spanning-tree bpduguard enable

! BPDU Filter — suppress sending and receiving BPDUs (use carefully)
interface GigabitEthernet0/1
 spanning-tree bpdufilter enable

! Root Guard — prevents connected switches from becoming Root Bridge
! Apply on ports facing downward (non-uplink ports)
interface GigabitEthernet0/2
 spanning-tree guard root

! Loop Guard — prevents blocked port from transitioning to forwarding
! if BPDUs stop (prevents unidirectional link failures causing loops)
interface GigabitEthernet0/24
 spanning-tree guard loop
```

---

## 9. VLAN Hopping Attacks

VLAN hopping allows an attacker on one VLAN to access traffic on a different VLAN — bypassing the logical segmentation that VLANs provide.

### Attack 1: Switch Spoofing

An attacker's system sends DTP (Dynamic Trunking Protocol) frames to convince the switch that it's another switch. The switch negotiates a trunk link with the attacker. The attacker now has access to all VLANs on that trunk.

**Why this works**: Switch ports default to `dynamic auto` or `dynamic desirable` — they'll negotiate a trunk with anything that asks.

```bash
# Tool: Yersinia — DTP attack
yersinia dtp -attack 1    ! Send DTP frames to negotiate trunk

# Or: use a custom Python script with Scapy to craft DTP frames
```

**Mitigation**:
```cisco
! Explicitly set access ports to access mode — never auto-negotiate
interface GigabitEthernet0/1
 switchport mode access          ! Hard-code as access, disables DTP
 switchport nonegotiate          ! Disable DTP entirely
 switchport access vlan 10
```

### Attack 2: Double Tagging

The attacker sends a frame with **two 802.1Q VLAN tags**:
1. Outer tag: Native VLAN (e.g., VLAN 1 — untagged on trunk)
2. Inner tag: Target VLAN (e.g., VLAN 20 — victim's VLAN)

**How it works**:
1. Frame arrives at the first switch — outer tag is VLAN 1 (native VLAN, untagged). Switch strips this tag and forwards on the trunk.
2. Second switch receives the frame — now the inner tag (VLAN 20) is the outermost tag. Switch forwards to VLAN 20.

**Limitations**: This is a **one-way attack** — the attacker can send traffic into VLAN 20 but cannot receive replies (replies would be tagged VLAN 20 and would not be forwarded back to the attacker's native VLAN port).

**Use case**: Sending crafted packets (DoS, exploitation attempts) to hosts on a target VLAN without having to receive responses.

```bash
# scapy — craft double-tagged frame
from scapy.all import *

frame = Ether(dst="FF:FF:FF:FF:FF:FF") / \
        Dot1Q(vlan=1) / \         # Outer tag — native VLAN
        Dot1Q(vlan=20) / \        # Inner tag — target VLAN
        IP(dst="192.168.20.100") / \
        ICMP()

sendp(frame, iface="eth0")
```

**Mitigation**:
```cisco
! Change native VLAN from default VLAN 1 to an unused VLAN
interface GigabitEthernet0/24
 switchport trunk native vlan 999    ! VLAN 999 used for nothing else

! Tag the native VLAN (forces all frames to be tagged)
vlan dot1q tag native    ! Global command on some platforms

! Prune VLANs from trunks — only allow VLANs that are actually needed
interface GigabitEthernet0/24
 switchport trunk allowed vlan 10,20,30    ! Not VLAN 1 or 999
```

---

## 10. Pentest Lens — Network Devices & Infrastructure

### Pentest Lens

**Attacker's view**: Network infrastructure devices are high-value targets. Compromise a switch or router and you control traffic flow, can MITM everything on the segment, reconfigure VLANs to reach isolated networks, or pivot to management networks. Even without compromise, misconfigurations at this layer create a massive attack surface.

**Enumeration — Network Device Discovery**:
```bash
# Discover network devices with Nmap
nmap -sU -p 161 192.168.1.0/24           # SNMP — switches/routers respond on UDP 161
nmap -p 22,23,80,443,8080 192.168.1.0/24 # SSH, Telnet, HTTP management

# Identify device type from banner / fingerprint
nmap -sV -p 22,23 <switch-IP>           # Banner grab
nmap --script banner <switch-IP>

# CDP/LLDP enumeration — discovers neighbours, device types, IOS version
# If you're on a Cisco switch CLI (post-compromise):
show cdp neighbors detail
show lldp neighbors detail

# From a connected Linux host using Wireshark/tcpdump
tcpdump -i eth0 -e -v 'ether proto 0x88cc'   # Capture LLDP frames
# LLDP/CDP frames reveal: device name, OS version, IP address, port info
```

**SNMP Enumeration**:
```bash
# SNMP community string brute force
onesixtyone -c /usr/share/doc/onesixtyone/dict.txt <target-IP>

# If community string found (commonly 'public', 'private', 'community'):
snmpwalk -v2c -c public <target-IP>               # Walk entire MIB
snmpwalk -v2c -c public <target-IP> 1.3.6.1.2.1.1  # System info
snmpwalk -v2c -c public <target-IP> 1.3.6.1.2.1.2  # Interface table
snmpwalk -v2c -c public <target-IP> 1.3.6.1.2.1.4.20  # IP address table

# Retrieve ARP table via SNMP (reveals all hosts the device knows about)
snmpwalk -v2c -c public <target-IP> 1.3.6.1.2.1.4.22

# Get routing table via SNMP
snmpwalk -v2c -c public <target-IP> 1.3.6.1.2.1.4.21
```

**Post-Compromise — On a Switch or Router**:
```cisco
! What VLANs exist?
show vlan brief

! What trunks exist? (reveals network topology)
show interfaces trunk

! Full topology via CDP
show cdp neighbors detail   ! Every connected device, IP, platform, IOS version

! Routing table — what networks are reachable?
show ip route

! ARP table — what hosts are currently active?
show ip arp

! MAC address table — what devices are on each port?
show mac address-table

! Who is logged in to this device right now?
show users

! Check for access lists (ACLs)
show access-lists
show ip interface | include access list
```

**VLAN Hopping — Practical Attack Flow**:
```bash
# Step 1: Check if the switch port is in dynamic mode (will negotiate trunk)
# Look for DTP frames in Wireshark — filter: dtp

# Step 2: If dynamic mode confirmed, attempt trunk negotiation
yersinia dtp -attack 1 -interface eth0

# Step 3: If trunk established, configure sub-interfaces for each VLAN
# Linux: create 802.1Q sub-interfaces
modprobe 8021q
ip link add link eth0 name eth0.20 type vlan id 20
ip addr add 192.168.20.99/24 dev eth0.20
ip link set eth0.20 up

# Step 4: You now have access to VLAN 20 — scan it
nmap -sn 192.168.20.0/24
```

**Targeting Routing Protocols**:
```bash
# OSPF — inject a false route (requires being on the same segment)
# Tool: Loki (routing protocol attack tool)
# Or: Scapy to craft OSPF LSA packets

# More commonly: exploit OSPF authentication being disabled
# If OSPF neighbour is discovered (show ip ospf neighbor shows your attacker box)
# You can advertise routes → traffic redirection

# Check if OSPF authentication is in use via Wireshark
# Filter: ospf → look for Auth Type field (0 = none, 1 = simple, 2 = MD5)
```

**Misconfigurations to look for**:
- Telnet enabled on switches/routers instead of SSH → credentials transmitted in cleartext
- Default SNMP community strings (`public`, `private`) → full device enumeration
- DTP in dynamic mode on access ports → switch spoofing VLAN hop
- Native VLAN = VLAN 1 → double-tag VLAN hop possible
- No BPDU Guard on access ports → STP root bridge takeover
- No port security → MAC flooding possible
- CDP/LLDP enabled on access ports → leaks device inventory to any connected host
- No VTP password → VTP injection possible

**Detection evasion**:
- CDP/LLDP enumeration is passive — just listen to frames already being broadcast
- SNMP v2c queries look like normal network monitoring traffic
- DTP negotiation happens quickly — brief window before it might trigger anomaly detection
- On a compromised device, use existing management protocols for pivoting to avoid firewall triggers

**Defender's counter**:
- Disable Telnet: `no service telnet`, `transport input ssh` on all VTY lines
- SNMPv3 with auth+privacy: `snmp-server group SECURE v3 priv`
- Disable CDP on access ports: `no cdp enable` per interface
- Disable DTP: `switchport mode access` + `switchport nonegotiate`
- Change native VLAN: `switchport trunk native vlan 999` (unused VLAN)
- BPDU Guard on all access ports
- Port security with sticky MAC and violation shutdown
- OSPF/EIGRP authentication enabled
- Management traffic on a dedicated out-of-band management VLAN, accessible only from jump servers

---

## Quick Reference — Module 2

### STP Port States
| State | Forwards? | Learns? | Duration |
|-------|----------|--------|---------|
| Blocking | No | No | 20s |
| Listening | No | No | 15s |
| Learning | No | Yes | 15s |
| Forwarding | Yes | Yes | Stable |

### Administrative Distance
| Protocol | AD |
|----------|----|
| Connected | 0 |
| Static | 1 |
| eBGP | 20 |
| EIGRP Internal | 90 |
| OSPF | 110 |
| RIP | 120 |

### Key Show Commands
```cisco
show mac address-table           ! Switch CAM table
show spanning-tree vlan 10       ! STP state per VLAN
show interfaces trunk            ! Trunk ports and allowed VLANs
show vlan brief                  ! All VLANs and port assignments
show ip route                    ! Router routing table
show ip ospf neighbor            ! OSPF adjacencies
show ip arp                      ! ARP table
show cdp neighbors detail        ! Connected devices (topology)
show etherchannel summary        ! EtherChannel status
```

### VLAN Hopping Mitigations
```cisco
switchport mode access           ! Disable DTP
switchport nonegotiate           ! Belt and braces — no DTP frames sent
switchport trunk native vlan 999 ! Change native VLAN
vlan dot1q tag native            ! Tag native VLAN on trunk
spanning-tree portfast           ! Access ports only
spanning-tree bpduguard enable   ! Block rogue switch
spanning-tree guard root         ! Prevent root bridge takeover on non-uplinks
```

### OSPF LSA Types
| Type | Name | Flooded To |
|------|------|-----------|
| 1 | Router | Within area |
| 2 | Network | Within area |
| 3 | Summary | Other areas |
| 5 | AS External | Entire domain |
| 7 | NSSA External | NSSA area only |

---

## Related Notes
- [[Module-01-IP-Addressing]] — Subnetting, VLSM used in VLAN and routing design
- [[Module-03-Protocols-Deep-Dive]] — ARP, STP BPDUs, OSPF packets at wire level
- [[Module-04-Network-Security]] — Firewall zones, Layer 2 hardening
- [[Module-05-Firewall-Configuration]] — ACLs applied to router interfaces
- [[Module-07-Windows-Server-Networking]] — AD-integrated routing, Windows clients in VLANs
- [[Module-12-Pentest-Perspective]] — VLAN hopping, SNMP enumeration in full engagement context
