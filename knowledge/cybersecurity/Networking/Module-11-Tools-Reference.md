---
title: "Module 11 — Tools Reference (Comprehensive)"
tags: [networking, tools, nmap, wireshark, tcpdump, zeek, snort, suricata, aircrack, scapy, hping3, bettercap, responder, hydra, medusa, dns-tools, pentest, netgod]
module: 11
date: 2026-04-05
---

# Module 11 — Tools Reference (Comprehensive)

> [!info] Module Overview
> Every tool in this module is given full treatment: what it is, install command, all core flags and syntax, real usage examples, expected output explained, and a Pentest Lens. This is the reference you pull up mid-engagement when you need exact syntax. Organised by category: scanning, traffic analysis, monitoring, SIEM, IDS/IPS, wireless, DNS, firewall CLI, VPN, performance, MITM, auth attacks, and packet crafting.

---

## 1. Scanning Tools

### Nmap — All Scan Types + NSE

Nmap is the de-facto standard for network discovery and security auditing.

```bash
# Install
apt install nmap              # Debian/Ubuntu
yum install nmap              # RHEL/CentOS
brew install nmap             # macOS

# Version check
nmap --version
```

#### Host Discovery (Ping Sweep)

```bash
# Default ping sweep (ICMP echo + TCP SYN 443 + TCP ACK 80 + ICMP timestamp)
nmap -sn 192.168.1.0/24

# ICMP echo only
nmap -sn -PE 192.168.1.0/24

# ARP ping (most reliable on LAN — bypasses host firewalls)
nmap -sn -PR 192.168.1.0/24

# TCP SYN ping to specific port
nmap -sn -PS80,443,8080 192.168.1.0/24

# UDP ping
nmap -sn -PU53,161 192.168.1.0/24

# Disable ping (treat all hosts as up — useful when ICMP blocked)
nmap -Pn 192.168.1.0/24
```

#### Port Scanning Techniques

```bash
# SYN scan (half-open, stealthy, requires root/admin — default when root)
nmap -sS 192.168.1.10

# TCP connect scan (full 3-way, no root required — default without root)
nmap -sT 192.168.1.10

# UDP scan (slow — requires timeout for closed ports)
nmap -sU 192.168.1.10
nmap -sU -p 53,67,68,123,161,500 192.168.1.10  # Common UDP ports

# ACK scan (firewall rule mapping — does not find open ports)
# Open/closed = unfiltered (RST returned), no response = filtered
nmap -sA 192.168.1.10

# Window scan (like ACK but examines TCP window size)
nmap -sW 192.168.1.10

# FIN scan (RFC-compliant: closed ports return RST, open ports ignore)
nmap -sF 192.168.1.10

# NULL scan (no flags set)
nmap -sN 192.168.1.10

# Xmas scan (FIN+PSH+URG flags)
nmap -sX 192.168.1.10

# Maimon scan (FIN+ACK — some BSD systems respond differently)
nmap -sM 192.168.1.10

# SCTP INIT scan (for SCTP services — telecom)
nmap -sY 192.168.1.10

# IP protocol scan (which IP protocols are supported)
nmap -sO 192.168.1.10

# Combined TCP + UDP scan
nmap -sS -sU 192.168.1.10

# Idle scan (truly blind — uses zombie host's IP ID sequence)
# First find a zombie with predictable IP ID
nmap -sI zombie-host.com 192.168.1.10
```

#### Port Specification

```bash
# Single port
nmap -p 80 192.168.1.10

# Multiple ports
nmap -p 80,443,8080,8443 192.168.1.10

# Port range
nmap -p 1-1024 192.168.1.10

# All 65535 ports
nmap -p- 192.168.1.10
nmap -p 0-65535 192.168.1.10

# Top N most common ports
nmap --top-ports 100 192.168.1.10
nmap --top-ports 1000 192.168.1.10

# Specific protocol
nmap -p T:80,U:53 192.168.1.10    # TCP 80 and UDP 53
```

#### Service and Version Detection

```bash
# Version detection (probes open ports to determine service/version)
nmap -sV 192.168.1.10

# Intensity (0=light, 9=aggressive, default=7)
nmap -sV --version-intensity 9 192.168.1.10

# OS detection (requires root — sends probes to fingerprint OS)
nmap -O 192.168.1.10

# Combined: aggressive scan (OS + version + scripts + traceroute)
nmap -A 192.168.1.10

# Output format:
# PORT   STATE  SERVICE  VERSION
# 22/tcp open   ssh      OpenSSH 8.9p1 Ubuntu 22.04
# 80/tcp open   http     Apache httpd 2.4.52 (Ubuntu)
# 443/tcp open  ssl/http Apache httpd 2.4.52
```

#### NSE — Nmap Scripting Engine

NSE scripts extend Nmap with vulnerability detection, enumeration, and exploitation.

```bash
# Run default scripts (-sC equivalent to --script=default)
nmap -sC 192.168.1.10

# Run specific script
nmap --script http-title 192.168.1.10
nmap --script banner 192.168.1.10

# Run script category
nmap --script vuln 192.168.1.10         # All vulnerability scripts
nmap --script discovery 192.168.1.10   # All discovery scripts
nmap --script auth 192.168.1.10        # Authentication scripts
nmap --script brute 192.168.1.10       # Brute force scripts

# Multiple scripts
nmap --script "http-*" 192.168.1.10    # All http scripts
nmap --script "smb-vuln-*" 192.168.1.10  # All SMB vulnerability scripts

# Script with arguments
nmap --script http-brute --script-args userdb=users.txt,passdb=pass.txt 192.168.1.10

# Essential NSE scripts by category:

# VULNERABILITY DETECTION
nmap --script smb-vuln-ms17-010 -p 445 192.168.1.10     # EternalBlue
nmap --script smb-vuln-ms08-067 -p 445 192.168.1.10     # Conficker
nmap --script ssl-heartbleed -p 443 192.168.1.10        # Heartbleed
nmap --script ssl-poodle -p 443 192.168.1.10            # POODLE
nmap --script http-shellshock 192.168.1.10              # Shellshock
nmap --script rdp-vuln-ms12-020 -p 3389 192.168.1.10   # RDP DoS
nmap --script vuln -p 80,443,445,3389 192.168.1.10     # All vulns (slow)

# ENUMERATION
nmap --script smb-enum-shares -p 445 192.168.1.10       # SMB shares
nmap --script smb-enum-users -p 445 192.168.1.10        # SMB users
nmap --script smb-enum-groups -p 445 192.168.1.10       # SMB groups
nmap --script ldap-search -p 389 192.168.1.10           # LDAP
nmap --script dns-zone-transfer -p 53 192.168.1.10      # Zone transfer
nmap --script snmp-walk -p 161 192.168.1.10             # SNMP walk
nmap --script http-enum 192.168.1.10                    # Web directories
nmap --script http-robots.txt 192.168.1.10              # robots.txt
nmap --script ftp-anon -p 21 192.168.1.10              # Anonymous FTP
nmap --script telnet-ntlm-info -p 23 192.168.1.10      # Telnet banner
nmap --script ssh-hostkey -p 22 192.168.1.10           # SSH host key
nmap --script ssh2-enum-algos -p 22 192.168.1.10       # SSH algorithms
nmap --script ssl-enum-ciphers -p 443 192.168.1.10     # TLS ciphers
nmap --script rdp-enum-encryption -p 3389 192.168.1.10 # RDP encryption

# BRUTE FORCE (USE WITH CAUTION — ACCOUNT LOCKOUT RISK)
nmap --script ssh-brute -p 22 192.168.1.10
nmap --script ftp-brute -p 21 192.168.1.10
nmap --script http-brute -p 80 192.168.1.10
nmap --script smb-brute -p 445 192.168.1.10

# NETWORK DISCOVERY
nmap --script broadcast-dhcp-discover        # DHCP server discovery
nmap --script broadcast-dns-service-discovery  # mDNS services
nmap --script lltd-discovery                 # Windows LLTD
```

#### Output Formats

```bash
# Default terminal output
nmap 192.168.1.10

# Normal output to file
nmap 192.168.1.10 -oN scan.txt

# XML output (parseable by other tools)
nmap 192.168.1.10 -oX scan.xml

# Grepable output (one line per host)
nmap 192.168.1.10 -oG scan.gnmap

# All three formats simultaneously
nmap 192.168.1.10 -oA scan   # Creates scan.nmap, scan.xml, scan.gnmap

# Script kiddie output (leet speak — fun, not useful)
nmap 192.168.1.10 -oS scan.sk

# Verbose and debug
nmap -v 192.168.1.10          # Verbose (show open ports as found)
nmap -vv 192.168.1.10         # Very verbose
nmap -d 192.168.1.10          # Debug
nmap -d5 192.168.1.10         # Maximum debug
```

#### Timing and Performance

```bash
# Timing templates (T0=paranoid to T5=insane)
nmap -T0 192.168.1.10    # Paranoid: 5 min between probes (IDS evasion)
nmap -T1 192.168.1.10    # Sneaky: 15 sec between probes
nmap -T2 192.168.1.10    # Polite: 0.4 sec between probes
nmap -T3 192.168.1.10    # Normal (default)
nmap -T4 192.168.1.10    # Aggressive: assumes fast, reliable network
nmap -T5 192.168.1.10    # Insane: very fast, may miss ports

# Fine-grained timing control
nmap --min-rate 1000 192.168.1.0/24       # At least 1000 packets/sec
nmap --max-rate 200 192.168.1.0/24        # No more than 200 packets/sec
nmap --scan-delay 1s 192.168.1.10         # 1 second between probes
nmap --max-retries 2 192.168.1.10         # Only retry 2 times (default 6)
nmap --host-timeout 5m 192.168.1.0/24    # Give up on host after 5 min
```

#### Evasion

```bash
# Fragment packets (bypass simple packet filters)
nmap -f 192.168.1.10           # 8-byte fragments
nmap -ff 192.168.1.10          # 16-byte fragments
nmap --mtu 24 192.168.1.10     # Custom MTU (must be multiple of 8)

# Decoy scan (hide real IP among fake IPs)
nmap -D 10.0.0.1,10.0.0.2,ME,10.0.0.3 192.168.1.10
nmap -D RND:10 192.168.1.10   # 10 random decoys

# Spoof source port
nmap --source-port 53 192.168.1.10    # Appear as DNS traffic
nmap -g 80 192.168.1.10               # Same

# Spoof source IP (replies won't reach you — use with idle scan)
nmap -S 10.0.0.99 -e eth0 192.168.1.10

# Randomise host scan order
nmap --randomize-hosts 192.168.1.0/24

# Append random data to packets
nmap --data-length 25 192.168.1.10    # Add 25 random bytes to packets

# Bad checksum (some firewalls forward invalid checksums)
nmap --badsum 192.168.1.10
```

#### Practical Nmap Workflows

```bash
# FAST INTERNAL DISCOVERY — identify live hosts and common ports
nmap -sn 192.168.1.0/24 -oG hosts.gnmap
grep "Up" hosts.gnmap | awk '{print $2}' > live-hosts.txt
nmap -sS -sV -p 22,80,443,445,3389,5985 -iL live-hosts.txt -oA internal-scan -T4

# FULL PORT SCAN (background — takes time)
nmap -p- -sS --min-rate 5000 -oA full-ports 192.168.1.10 &

# SERVICE VERSION + VULN SCRIPTS on discovered ports
nmap -sV -sC --script vuln -p 22,80,443,445 192.168.1.10 -oA detailed

# DOMAIN CONTROLLER DISCOVERY
nmap -p 88,389,445,636,3268 192.168.1.0/24 --open
# Open port 88 (Kerberos) + 389 (LDAP) = likely DC

# WEB SERVER ENUM
nmap -sV -p 80,443,8080,8443 --script "http-*" 192.168.1.10

# PARSE RESULTS
# Extract open ports from grepable output
grep -oP '\d+/open' scan.gnmap | cut -d'/' -f1 | sort -u > open-ports.txt

# xmllint to parse XML output
xmllint --xpath "//port[@state='open']" scan.xml
```

### Masscan — Fast Port Scanner

Masscan can scan the entire internet in ~6 minutes. Uses raw packets (like Nmap SYN scan) but at extremely high rates.

```bash
# Install
apt install masscan

# Basic scan (single port, single host)
masscan 192.168.1.0/24 -p 80

# Multiple ports
masscan 192.168.1.0/24 -p 80,443,22,445,3389

# Port range
masscan 192.168.1.0/24 -p 1-65535

# Rate control (CRITICAL — default is too high for most networks)
masscan 192.168.1.0/24 -p 1-65535 --rate 1000    # 1000 packets/sec (safe for internal)
masscan 10.0.0.0/8 -p 80,443 --rate 10000          # 10k/sec (fast internal)

# Wait time (how long to wait for responses — increase for slow networks)
masscan 192.168.1.0/24 -p 80 --rate 1000 --wait 5

# Output formats
masscan 192.168.1.0/24 -p 80 -oL scan.list         # List format
masscan 192.168.1.0/24 -p 80 -oJ scan.json         # JSON
masscan 192.168.1.0/24 -p 80 -oX scan.xml          # XML (Nmap-compatible)
masscan 192.168.1.0/24 -p 80 -oG scan.gnmap        # Grepable (Nmap-compatible)

# Continue interrupted scan
masscan 192.168.1.0/24 -p 1-65535 --rate 1000 --resume paused.conf

# Exclude targets from scan
masscan 0.0.0.0/0 -p 80 --exclude 192.168.0.0/16  # Exclude your own network

# Read targets from file
masscan -iL targets.txt -p 80,443 --rate 5000

# Combined with Nmap (masscan for speed, Nmap for detail)
masscan 192.168.1.0/24 -p 1-65535 --rate 5000 -oL masscan-results.txt
# Extract open ports per host
awk '/^open/ {print $4 " -p " $3}' masscan-results.txt | \
  while read args; do
    nmap -sV -sC $args
  done
```

### Netdiscover — ARP-Based Discovery

```bash
# Install
apt install netdiscover

# Passive mode (just listen to ARP traffic — no packets sent)
netdiscover -p -i eth0

# Active mode (send ARP requests to discover hosts)
netdiscover -r 192.168.1.0/24 -i eth0

# Scan specific range
netdiscover -r 192.168.1.0/24

# Output:
#  IP            At MAC Address     Count     Len  MAC Vendor / Hostname
# 192.168.1.1   aa:bb:cc:dd:ee:01      5     300  Cisco Systems
# 192.168.1.10  11:22:33:44:55:66      3     180  Dell Technologies

# Fast scan (no sleep between packets)
netdiscover -r 192.168.1.0/24 -f
```

### arp-scan — Layer 2 Host Discovery

```bash
# Install
apt install arp-scan

# Scan local network (auto-detects interface and subnet)
arp-scan --localnet

# Specify interface
arp-scan --localnet -I eth0

# Scan specific range
arp-scan 192.168.1.0/24

# Output:
# Interface: eth0, datalink type: EN10MB (Ethernet)
# 192.168.1.1     aa:bb:cc:dd:ee:01       Cisco Systems, Inc
# 192.168.1.10    11:22:33:44:55:66       Dell Inc.
# 192.168.1.20    ff:ee:dd:cc:bb:aa       Apple, Inc.

# Retry count (useful on noisy or unreliable networks)
arp-scan --localnet --retry 3

# Send from specific MAC (spoofing)
arp-scan --localnet --srcaddr=00:11:22:33:44:55

# Verbose output
arp-scan --localnet -v

# Output to file
arp-scan --localnet | tee arp-results.txt
```

---

## 2. Traffic Analysis Tools

### Wireshark

Covered in depth in Module 6. Key reference here:

```bash
# Install
apt install wireshark

# Run as non-root (add user to wireshark group)
usermod -aG wireshark $USER
newgrp wireshark

# CLI capture (Wireshark GUI)
wireshark -i eth0 -k -w /tmp/capture.pcap    # -k = start capture immediately

# Open existing capture
wireshark capture.pcap
```

**Essential display filter reference**:
```
# Protocol
tcp / udp / icmp / arp / dns / http / tls / smb2 / rdp / ssh

# IP
ip.addr == 192.168.1.10
ip.src == 192.168.1.10
ip.dst == 192.168.1.0/24
!(ip.addr == 10.0.0.1)

# Port
tcp.port == 443
tcp.dport == 80
tcp.flags.syn==1 && tcp.flags.ack==0    # New TCP connections
tcp.flags.rst==1                         # Resets
tcp.analysis.retransmission             # Lost packets

# HTTP
http.request.method == "POST"
http.request.uri contains "login"
http.response.code == 200
http.cookie

# DNS
dns.qry.name contains "evil"
dns.flags.response == 0                 # Queries only

# Follow stream: right-click → Follow → TCP/UDP/TLS Stream
# Export objects: File → Export Objects → HTTP
```

### tshark — Wireshark CLI

```bash
# Install (part of wireshark package)
apt install tshark

# Capture to file
tshark -i eth0 -w capture.pcap

# Read and display
tshark -r capture.pcap

# Apply display filter while reading
tshark -r capture.pcap -Y "http.request.method == POST"

# Extract specific fields
tshark -r capture.pcap -Y "dns" -T fields -e ip.src -e dns.qry.name

# Follow TCP stream (stream 0)
tshark -r capture.pcap -z follow,tcp,ascii,0 -q

# Protocol statistics
tshark -r capture.pcap -q -z io,phs

# Conversation statistics
tshark -r capture.pcap -q -z conv,tcp | sort -k4 -rn | head 20

# Export HTTP objects
tshark -r capture.pcap --export-objects http,/tmp/exported/

# Live capture with display filter
tshark -i eth0 -Y "tcp.flags.syn==1 && tcp.flags.ack==0" -T fields \
  -e ip.src -e ip.dst -e tcp.dstport

# Capture ring buffer (rotate every 100MB, keep 5 files)
tshark -i eth0 -b filesize:102400 -b files:5 -w /tmp/capture.pcap
```

### tcpdump

Covered in Module 6. Expanded reference:

```bash
# Install
apt install tcpdump

# ─── CAPTURE ─────────────────────────────────────────────────────────────────
tcpdump -i eth0 -nn -s0 -w /tmp/cap.pcap           # Capture all, no resolution
tcpdump -i any -nn -s0 -w /tmp/cap.pcap            # All interfaces
tcpdump -i eth0 -nn port 443 -w /tmp/https.pcap   # Filter HTTPS
tcpdump -i eth0 -nn not port 22                    # Exclude SSH
tcpdump -i eth0 -nn 'host 192.168.1.10 and tcp'   # TCP to/from host

# ─── RING BUFFER ──────────────────────────────────────────────────────────────
tcpdump -i eth0 -w /tmp/cap%Y%m%d_%H%M%S.pcap -G 3600 -C 100
# -G 3600: rotate every 3600 seconds
# -C 100: rotate when file reaches 100MB

# ─── ANALYSIS ONE-LINERS ───────────────────────────────────────────────────
# Show HTTP POST bodies
tcpdump -r cap.pcap -A 'tcp dst port 80 and tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x504f5354'

# Extract HTTP passwords (basic cleartext)
tcpdump -r cap.pcap -A -nn port 80 | grep -i 'pass\|user\|login\|auth'

# Count connections per source IP
tcpdump -r cap.pcap -nn 'tcp[tcpflags] & tcp-syn != 0' | \
  awk '{print $3}' | cut -d. -f1-4 | sort | uniq -c | sort -rn | head

# Top talkers by bytes
tcpdump -r cap.pcap -nn -q | awk '{print $3, $5}' | \
  awk '{gsub(/\..+/,"",$1); print $1}' | sort | uniq -c | sort -rn | head
```

### NetworkMiner — Passive Network Forensics

```bash
# Download (Windows .exe or Mono on Linux)
# https://www.netresec.com/?page=NetworkMiner

# Run on Linux with Mono
mono NetworkMiner.exe

# Features:
# - Auto-extracts files transferred over HTTP, FTP, TFTP, SMB from pcap
# - Reconstructs sessions
# - Identifies OS from passive fingerprinting
# - Extracts credentials from cleartext protocols
# - Shows all hosts, sessions, DNS, images

# Open pcap: File → Open → select .pcap file
# Hosts tab: all hosts with OS fingerprint, open ports, sent/received bytes
# Files tab: all extracted files with MD5 hashes
# Credentials tab: extracted credentials from cleartext protocols
```

---

## 3. Monitoring Tools

### Zabbix — Enterprise Monitoring

Covered in Module 6. Key commands:

```bash
# Check agent connectivity
zabbix_get -s 192.168.1.10 -k system.hostname     # Get hostname via agent
zabbix_get -s 192.168.1.10 -k net.if.in[eth0]     # Interface bytes in
zabbix_get -s 192.168.1.10 -k proc.num[nginx]     # Process count

# Agent config (/etc/zabbix/zabbix_agentd.conf)
Server=192.168.100.20      # Zabbix server IP
ServerActive=192.168.100.20
Hostname=web01.corp.local
```

### Nagios — Open Source Monitoring

```bash
# Install Nagios Core (complex — use package manager)
apt install nagios4 nagios-plugins

# Key Nagios directories
/etc/nagios4/nagios.cfg          # Main config
/etc/nagios4/objects/            # Host, service, contact definitions
/var/log/nagios4/nagios.log      # Log file
/var/nagios4/rw/nagios.cmd       # Command pipe (send commands)

# Test plugin directly
/usr/lib/nagios/plugins/check_ping -H 192.168.1.10 -w 100,10% -c 200,20%
/usr/lib/nagios/plugins/check_ssh -H 192.168.1.10
/usr/lib/nagios/plugins/check_http -H 192.168.1.10 -p 80
/usr/lib/nagios/plugins/check_snmp -H 192.168.1.10 -C public -o sysDescr.0

# Host definition example
define host {
  host_name      web01
  address        192.168.1.10
  use            linux-server
  check_command  check-host-alive
}

# Service definition example
define service {
  host_name           web01
  service_description HTTP
  check_command       check_http
  use                 generic-service
}
```

### PRTG — Windows-Based Monitoring

PRTG is a commercial Windows monitoring tool. Key concepts:

```
Probes → Groups → Devices → Sensors

Probe: Monitoring engine (local or remote)
Group: Logical grouping of devices
Device: An IP host being monitored
Sensor: A specific metric (ping, SNMP OID, HTTP, bandwidth)

Auto-discovery: PRTG scans a subnet → auto-creates device and sensor objects
Each device gets: ping sensor, SNMP system info, interface bandwidth sensors
```

### LibreNMS

```bash
# Add device for monitoring
php artisan device:add 192.168.1.1 --v2c --community public

# Manual discovery/poll
php artisan discovery:poll 192.168.1.1
php artisan device:poll 192.168.1.1

# List all devices
php artisan device:list

# Show device info
php artisan device:show 192.168.1.1

# Alert rules (LibreNMS web UI → Alerts → Alert Rules)
# Example: Interface goes down
# Rule: %devices.status = 1 AND %ports.ifOperStatus = "down"
```

---

## 4. IDS/IPS — Snort and Suricata Rule Writing

Covered extensively in Module 6. Key rule patterns:

### Snort Rule Writing Reference

```snort
# ─── RULE ANATOMY ─────────────────────────────────────────────────────────────
# action proto src_ip src_port direction dst_ip dst_port (options)

# Action: alert, log, pass, drop (IPS), reject, sdrop
# Proto: tcp, udp, icmp, ip
# Direction: -> (one-way), <> (bidirectional)

# ─── CONTENT MATCHING ─────────────────────────────────────────────────────────
content:"GET";                   # Match literal string
content:"|47 45 54|";           # Match hex bytes (same as "GET")
content:"User-Agent:"; nocase;  # Case insensitive
content:"cmd.exe"; depth:100;   # Only search first 100 bytes
content:"SELECT"; offset:20;    # Start searching at byte 20
content:"FROM"; distance:0;     # After previous content match (anywhere after)
content:"WHERE"; within:10;     # Within 10 bytes of previous content match

# ─── PCRE (PERL COMPATIBLE REGEX) ─────────────────────────────────────────────
pcre:"/SELECT\s+.+FROM/i";      # SQL injection pattern
pcre:"/\.\.\/\.\.\/etc\/passwd/";  # Directory traversal
pcre:"/^POST\s+\/upload/i";    # File upload

# ─── FLOW MATCHING ────────────────────────────────────────────────────────────
flow:to_server,established;      # Client to server, in established connection
flow:to_client,established;      # Server to client
flow:stateless;                  # Don't track state
flow:only_stream;                # Reassembled stream only
flow:no_stream;                  # Single packets only

# ─── TCP FLAG MATCHING ────────────────────────────────────────────────────────
flags:S;         # SYN only
flags:SA;        # SYN + ACK
flags:R;         # RST
flags:FPU;       # FIN + PSH + URG (Xmas)
flags:0;         # No flags (NULL scan)

# ─── BYTE MATCHING ────────────────────────────────────────────────────────────
dsize:>1000;                     # Payload > 1000 bytes
dsize:<100;                      # Payload < 100 bytes
dsize:100<>200;                  # Payload between 100 and 200

# ─── THRESHOLD ────────────────────────────────────────────────────────────────
threshold:type limit,track by_src,count 1,seconds 60;     # Alert max 1x/minute/src
threshold:type threshold,track by_src,count 10,seconds 5; # Alert after 10 hits in 5s
threshold:type both,track by_src,count 10,seconds 5;     # Both: 10 hits to trigger, then limit

# ─── DETECTION FILTER ────────────────────────────────────────────────────────
detection_filter:track by_src,count 5,seconds 10;   # Only alert after 5 hits in 10s

# ─── CLASSTYPE ────────────────────────────────────────────────────────────────
classtype:attempted-recon;
classtype:web-application-attack;
classtype:trojan-activity;
classtype:policy-violation;
classtype:attempted-admin;
```

### Suricata-Specific Keywords

```suricata
# Protocol identification (not port-based)
alert http ...     # HTTP on ANY port
alert ssh ...      # SSH on ANY port
alert tls ...      # TLS on ANY port
alert dns ...      # DNS on ANY port

# HTTP-specific keywords
http.method; content:"POST";          # HTTP method
http.uri; content:"/admin";           # URI path
http.host; content:"evil.com";        # Host header
http.user_agent; content:"curl";      # User-Agent
http.stat_code; content:"200";        # Response status
http.request_body; content:"SELECT"; # POST body

# TLS keywords
tls.sni; content:"malware.com";      # Server Name Indication
tls.cert.subject; content:"evil";    # Certificate subject
tls.version; content:"769";          # TLS 1.0 (hex 0x0301 = 769 decimal)

# JA3 fingerprint (TLS client fingerprint)
ja3.hash; content:"51c64c77e60f3980eea90869b68c58a8";

# File keywords
filemagic:"PE32 executable";         # Executable by magic bytes
filename; content:".exe";            # Filename
filestore;                           # Extract and store file
filemd5:"d41d8cd98f00b204e9800998ecf8427e";  # Match specific MD5

# DNS keywords
dns.query; content:"evil.com";       # DNS query name

# SSH keywords
ssh.protoversion; content:"2.0";     # SSH version
ssh.softwareversion; content:"OpenSSH";  # Software version
```

---

## 5. Wireless Tools

### airmon-ng / airodump-ng / aireplay-ng / aircrack-ng

Covered in full in Module 8. Quick reference:

```bash
# Setup
airmon-ng check kill
airmon-ng start wlan0             # → wlan0mon

# Discover targets
airodump-ng wlan0mon
airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:01 -w /tmp/cap wlan0mon

# Capture handshake
aireplay-ng --deauth 5 -a AA:BB:CC:DD:EE:01 -c 11:22:33:44:55:66 wlan0mon

# Convert and crack
hcxpcapngtool -o cap.hc22000 /tmp/cap-01.cap
hashcat -m 22000 cap.hc22000 rockyou.txt

# WPS attack
wash -i wlan0mon                                    # Find WPS APs
reaver -i wlan0mon -b <BSSID> -c 6 -K 1 -vv      # Pixie Dust
```

### hcxdumptool — PMKID Capture

```bash
# Install
apt install hcxtools
git clone https://github.com/ZerBea/hcxdumptool
cd hcxdumptool && make && make install

# Capture PMKIDs from all nearby APs
hcxdumptool -i wlan0mon -o pmkid.pcapng --enable_status=1

# Target specific AP
echo "AABBCCDDEEFF" > target.txt    # BSSID without colons
hcxdumptool -i wlan0mon -o pmkid.pcapng \
  --filterlist_ap=target.txt \
  --filtermode=2 \
  --enable_status=1

# Convert to hashcat format
hcxpcapngtool -o pmkid.hc22000 pmkid.pcapng

# Show what was captured
hcxpcapngtool pmkid.pcapng          # Summary of capture contents

# Crack
hashcat -m 22000 pmkid.hc22000 /usr/share/wordlists/rockyou.txt
```

### Kismet — Wireless Network Detector

```bash
# Install
apt install kismet

# Start with web UI
kismet -c wlan0mon
# Browse: http://localhost:2501 (default password: kismet)

# Headless capture
kismet -c wlan0mon --no-ncurses --log-prefix /tmp/kismet

# Multiple interfaces
kismet -c wlan0mon,wlan1mon

# GPS integration (with gpsd)
kismet -c wlan0mon --gps-host=localhost:2947

# Output files generated:
# *.kismet     — SQLite database with all collected data
# *.pcapng     — Full packet capture

# Query SQLite database
sqlite3 /tmp/kismet.kismet "SELECT devmac, ssid FROM devices WHERE type='Wi-Fi AP';"
sqlite3 /tmp/kismet.kismet "SELECT devmac, ssid, strongest_signal FROM devices ORDER BY strongest_signal DESC LIMIT 20;"

# Key Kismet features:
# Passive AP and client discovery (no active probes)
# Deauth detection
# Evil twin detection (same SSID, different BSSID)
# WPS detection
# Probe request logging (client history)
# Manufacturer lookup from OUI
```

---

## 6. DNS Tools

### dig

```bash
# Install
apt install dnsutils       # Debian/Ubuntu
yum install bind-utils     # RHEL/CentOS

# Basic lookups
dig example.com                          # A record (default)
dig example.com A                        # Explicit A record
dig example.com AAAA                     # IPv6
dig example.com MX                       # Mail servers
dig example.com NS                       # Name servers
dig example.com TXT                      # TXT records (SPF, DKIM)
dig example.com SOA                      # Zone authority
dig example.com ANY                      # All records (often blocked)
dig -x 93.184.216.34                     # Reverse DNS (PTR lookup)

# Query specific DNS server
dig @8.8.8.8 example.com
dig @192.168.1.10 corp.local

# Short output (answer only)
dig example.com +short

# Trace delegation (follow referrals from root)
dig example.com +trace

# Check DNSSEC
dig example.com +dnssec

# Zone transfer attempt
dig axfr @ns1.example.com example.com
dig axfr corp.local @192.168.1.10

# Query with no recursion (ask server's own zone only)
dig example.com +norecurse

# Multiple queries in one
dig example.com A example.com MX example.com NS

# Batch queries from file
dig -f queries.txt

# TCP (force TCP instead of UDP)
dig example.com +tcp

# Timing information
dig example.com +stats

# All records + timing
dig example.com +answer +stats +nocmd
```

### nslookup

```bash
# Basic
nslookup example.com
nslookup example.com 8.8.8.8          # Use specific DNS server

# Record types
nslookup -type=MX example.com
nslookup -type=NS example.com
nslookup -type=TXT example.com
nslookup -type=SRV _ldap._tcp.corp.local
nslookup -type=ANY example.com

# Reverse lookup
nslookup 93.184.216.34

# Zone transfer
nslookup
> server ns1.example.com
> ls -d example.com          # Attempt zone transfer (legacy syntax)

# Interactive mode
nslookup
> set type=MX
> example.com
> set type=NS
> example.com
> exit
```

### host

```bash
# Simple DNS lookups
host example.com
host -t MX example.com
host -t NS example.com
host -t TXT example.com
host 93.184.216.34             # Reverse lookup

# Zone transfer
host -l example.com ns1.example.com

# Verbose
host -v example.com

# Use specific DNS
host example.com 8.8.8.8
```

### dnsx — Fast DNS Resolver

```bash
# Install
go install github.com/projectdiscovery/dnsx/cmd/dnsx@latest

# Resolve a list of domains
cat domains.txt | dnsx

# Resolve with specific record type
cat domains.txt | dnsx -resp -a      # A records with response
cat domains.txt | dnsx -resp -mx     # MX records
cat domains.txt | dnsx -resp -ns     # NS records
cat domains.txt | dnsx -resp -cname  # CNAME records

# Brute force subdomains
dnsx -d example.com -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -resp

# Use specific DNS resolvers
dnsx -d example.com -r resolvers.txt

# Filter by response code
cat domains.txt | dnsx -resp -rc NOERROR    # Only successful resolutions

# JSON output
cat domains.txt | dnsx -json
```

### dnsrecon — DNS Enumeration

```bash
# Install
apt install dnsrecon
pip3 install dnsrecon

# Standard enumeration (A, NS, SOA, MX, TXT records)
dnsrecon -d example.com -t std

# Zone transfer attempt
dnsrecon -d example.com -t axfr

# Subdomain brute force
dnsrecon -d example.com -t brt -D /usr/share/dnsrecon/namelist.txt

# Google cache
dnsrecon -d example.com -t goo

# PTR records for IP range
dnsrecon -r 192.168.1.0/24 -t rvl

# Bing enumeration (uses Bing to find subdomains)
dnsrecon -d example.com -t bing

# All enumeration methods
dnsrecon -d example.com -t all

# Save output
dnsrecon -d example.com -t std --xml output.xml
dnsrecon -d example.com -t std -j output.json

# Custom DNS server
dnsrecon -d example.com -n 8.8.8.8

# Output example:
# [*] Performing General Enumeration of Domain: example.com
# [-]  DNSSEC is not configured for example.com
# [*]  SOA ns1.example.com 93.184.216.34
# [*]  NS ns1.example.com 93.184.216.34
# [*]  MX mail.example.com 93.184.216.35
# [*]  A www.example.com 93.184.216.34
# [*]  TXT "v=spf1 -all"
```

### fierce — DNS Scanner

```bash
# Install
pip3 install fierce

# Basic domain scan
fierce --domain example.com

# With custom wordlist
fierce --domain example.com --wordlist /usr/share/seclists/Discovery/DNS/fierce-hostlist.txt

# DNS server
fierce --domain example.com --dns-servers 8.8.8.8

# Subdomain brute force only
fierce --domain example.com --subdomains admin,mail,vpn,remote,dev,test,staging

# Output example:
# NS: ns1.example.com. => 93.184.216.34
# SOA: ns1.example.com. => 93.184.216.34
# Zone: failure
# Trying zone transfer against 93.184.216.34
# Unsuccessful in zone transfer (it was worth a shot)
# Wildcard: 192.0.2.1
# Found: mail.example.com. (93.184.216.35)
# Found: www.example.com. (93.184.216.34)
```

---

## 7. Firewall CLI Tools

### Linux iptables Quick Reference

```bash
# List rules
iptables -L -v -n --line-numbers        # Filter table
iptables -t nat -L -v -n                # NAT table

# Add rules
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -I INPUT 1 -s 1.2.3.4 -j DROP    # Insert at position 1 (top)

# Delete rules
iptables -D INPUT 3                    # Delete by line number
iptables -D INPUT -p tcp --dport 22 -j ACCEPT  # Delete by spec

# Default policies
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Flush
iptables -F                            # Flush filter table
iptables -t nat -F                     # Flush NAT table

# Save/restore
iptables-save > /etc/iptables/rules.v4
iptables-restore < /etc/iptables/rules.v4

# Common rules
iptables -A INPUT -i lo -j ACCEPT                                      # Loopback
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT # State
iptables -A INPUT -m conntrack --ctstate INVALID -j DROP               # Invalid
iptables -A INPUT -p tcp --dport 22 -s 10.0.100.0/24 -j ACCEPT       # SSH from mgmt
```

### Linux nftables Quick Reference

```bash
# Show ruleset
nft list ruleset

# Flush
nft flush ruleset

# Load from file
nft -f /etc/nftables.conf

# Add rule interactively
nft add rule inet filter input tcp dport 22 accept
nft add rule inet filter input ip saddr 1.2.3.4 drop

# Add to named set
nft add element inet filter blocked_ips { 1.2.3.4 }
nft delete element inet filter blocked_ips { 1.2.3.4 }

# Enable at boot
systemctl enable nftables
```

### Windows Firewall (PowerShell / netsh)

```powershell
# View rules
Get-NetFirewallRule | Where-Object Enabled -eq True | Format-Table Name, Direction, Action

# Create rules
New-NetFirewallRule -DisplayName "Allow SSH" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 22
New-NetFirewallRule -DisplayName "Block IP" -Direction Inbound -Action Block -RemoteAddress 1.2.3.4

# Modify rules
Set-NetFirewallRule -DisplayName "Allow SSH" -Enabled False
Enable-NetFirewallRule -DisplayName "Allow SSH"
Disable-NetFirewallRule -DisplayName "Allow SSH"

# Delete rules
Remove-NetFirewallRule -DisplayName "Allow SSH"

# Default policy
Set-NetFirewallProfile -Profile Domain,Private,Public -DefaultInboundAction Block

# View profile settings
Get-NetFirewallProfile
```

```cmd
:: netsh legacy commands
netsh advfirewall show allprofiles
netsh advfirewall firewall show rule name=all
netsh advfirewall firewall add rule name="Allow RDP" protocol=TCP dir=in localport=3389 action=allow
netsh advfirewall firewall delete rule name="Allow RDP"
netsh advfirewall set allprofiles state on
```

---

## 8. Performance Tools

### iperf3 — Bandwidth Testing

```bash
# Install
apt install iperf3

# Server
iperf3 -s                      # Listen on 5201
iperf3 -s -p 9999              # Custom port
iperf3 -s -D                   # Daemonise

# Client — TCP
iperf3 -c 192.168.1.10                     # Basic 10-second test
iperf3 -c 192.168.1.10 -t 30              # 30 seconds
iperf3 -c 192.168.1.10 -P 4              # 4 parallel streams
iperf3 -c 192.168.1.10 -R                 # Reverse (server→client)
iperf3 -c 192.168.1.10 --bidir           # Bidirectional
iperf3 -c 192.168.1.10 -n 1G             # Transfer 1 GB exactly
iperf3 -c 192.168.1.10 -Z                # Use sendfile (zero-copy)
iperf3 -c 192.168.1.10 -J                # JSON output

# Client — UDP (VoIP simulation)
iperf3 -c 192.168.1.10 -u -b 10M         # UDP at 10 Mbps
iperf3 -c 192.168.1.10 -u -b 10M -l 160 # 160-byte packets (G.711)

# Interpret output:
# [  5]   0.00-10.00 sec  1.12 GBytes  961 Mbits/sec    0    sender
# [  5]   0.00-10.04 sec  1.12 GBytes  958 Mbits/sec         receiver
# 961 Mbps on 1GbE = near wire rate (good)
# For UDP: also shows jitter and packet loss
```

### mtr — My TraceRoute

```bash
# Install
apt install mtr

# Interactive (real-time updates)
mtr 8.8.8.8
mtr -n 8.8.8.8              # No DNS resolution

# Report mode (run N cycles then exit)
mtr --report --report-cycles 100 8.8.8.8
mtr -rn -c 100 8.8.8.8

# TCP mode (bypass ICMP blocking)
mtr --tcp --port 443 google.com

# UDP mode
mtr --udp 8.8.8.8

# Wide format (more columns)
mtr -w 8.8.8.8

# Reading output:
# Host: hop IP/hostname
# Loss%: packet loss at this hop
# Snt: packets sent
# Last/Avg/Best/Wrst: latency in ms
# StDev: standard deviation (high = unstable)
# *** means hop doesn't respond to TTL-exceeded (not necessarily a problem)
```

### hping3 — Packet Crafting and Testing

```bash
# Install
apt install hping3

# Basic ping (ICMP)
hping3 -1 192.168.1.10         # ICMP echo
hping3 --icmp 192.168.1.10     # Same

# TCP SYN (like ping for firewalled hosts)
hping3 -S -p 80 192.168.1.10  # SYN to port 80
hping3 -S -p 443 192.168.1.10 # SYN to port 443

# UDP
hping3 -2 -p 53 192.168.1.10  # UDP to port 53

# Traceroute (TCP)
hping3 --traceroute -S -p 80 192.168.1.10

# Flood (DoS testing — lab only)
hping3 -S --flood -V -p 80 192.168.1.10      # SYN flood
hping3 --icmp --flood 192.168.1.10           # ICMP flood
hping3 -2 --flood -p 80 192.168.1.10         # UDP flood

# Spoofed source IP
hping3 -S -p 80 --spoof 10.0.0.99 192.168.1.10

# Random source IP
hping3 -S -p 80 --rand-source 192.168.1.10

# Fragment packets
hping3 -f -p 80 192.168.1.10   # Fragment

# Custom TTL (manual traceroute)
hping3 -S -p 80 --ttl 5 192.168.1.10

# Control rate
hping3 -S -p 80 --faster 192.168.1.10        # As fast as possible (< flood)
hping3 -S -p 80 -i u10000 192.168.1.10      # 1 packet every 10ms

# Banner grab (connect and wait for response)
hping3 -S -p 22 192.168.1.10 -c 1           # SYN and wait

# Interpret output:
# len=44 ip=192.168.1.10 ttl=64 id=0 sport=22 flags=SA seq=0 win=65535 rtt=1.2 ms
# flags=SA = SYN+ACK → port is open
# flags=RA = RST+ACK → port is closed
# No response = filtered
```

---

## 9. MITM Tools

### Bettercap

```bash
# Install
apt install bettercap
# Or from source:
go install github.com/bettercap/bettercap@latest

# Start (requires root)
bettercap -iface eth0

# ─── INTERACTIVE COMMANDS ────────────────────────────────────────────────────

# Probe/discover hosts
net.probe on

# Show discovered hosts
net.show

# ARP spoofing (MITM)
set arp.spoof.targets 192.168.1.10,192.168.1.20   # Specific targets
set arp.spoof.targets 192.168.1.0/24              # Entire subnet
arp.spoof on

# Sniff traffic
net.sniff on
set net.sniff.verbose true                         # Show captured data

# DNS spoofing
set dns.spoof.domains example.com,www.example.com
set dns.spoof.address 192.168.1.99                # Redirect to attacker
dns.spoof on

# SSL stripping
set https.proxy.sslstrip true
https.proxy on

# HTTP proxy (intercept and modify)
http.proxy on
set http.proxy.script /tmp/inject.js              # Inject JS into HTTP responses

# Credential sniffer (watches for credentials in plaintext)
# Automatically captures: HTTP basic auth, FTP, Telnet, SNMP

# WiFi evil twin
set wifi.interface wlan1
wifi.recon on                    # Scan for APs
set wifi.ap.ssid TargetNetwork
set wifi.ap.bssid AA:BB:CC:DD:EE:FF
wifi.ap on

# ─── SCRIPT / CAPLET MODE ────────────────────────────────────────────────────
# Save commands to a .cap file (caplet)
cat > /tmp/mitm.cap << 'EOF'
net.probe on
sleep 3
set arp.spoof.targets 192.168.1.0/24
arp.spoof on
net.sniff on
EOF

bettercap -iface eth0 -caplet /tmp/mitm.cap

# ─── API MODE (automation) ────────────────────────────────────────────────────
bettercap -iface eth0 -eval "api.rest on"   # REST API on port 8083
curl -u user:pass http://localhost:8083/api/session -H "Content-Type: application/json" \
  -d '{"cmd":"net.probe on"}'
```

### Responder — LLMNR/NBT-NS Poisoner

```bash
# Install
apt install responder
# Or:
git clone https://github.com/lgandx/Responder

# Basic run — poison LLMNR, NBT-NS, mDNS
responder -I eth0

# Verbose mode (show all requests)
responder -I eth0 -v

# Analyse mode (listen but DON'T poison — for detection testing)
responder -I eth0 -A

# Wpad proxy (captures browser proxy auth)
responder -I eth0 -w

# Force WPAD auth
responder -I eth0 -w -F

# Capture file location
ls /usr/share/responder/logs/
# Contains: SMB-NTLMv2-SSP-<IP>.txt, HTTP-NTLMv2-<IP>.txt etc.

# Output when hash captured:
# [SMB] NTLMv2-SSP Client   : 192.168.1.50
# [SMB] NTLMv2-SSP Username : CORP\jsmith
# [SMB] NTLMv2-SSP Hash     : jsmith::CORP:aabbccddeeff0011:...

# Crack captured hashes
hashcat -m 5600 /usr/share/responder/logs/SMB-NTLMv2-*.txt rockyou.txt

# ─── NTLM RELAY (Responder + ntlmrelayx) ─────────────────────────────────────
# Step 1: Disable SMB and HTTP in Responder (we relay, not capture)
# Edit /usr/share/responder/Responder.conf:
# SMB = Off
# HTTP = Off

# Step 2: Run Responder (poisoning only)
responder -I eth0 -v

# Step 3: Run ntlmrelayx (relay to targets)
ntlmrelayx.py -tf targets.txt -smb2support
ntlmrelayx.py -tf targets.txt -smb2support -i     # Interactive shell
ntlmrelayx.py -tf targets.txt -smb2support -c "whoami > C:\\out.txt"  # Command
ntlmrelayx.py -tf targets.txt -smb2support --dump-lm    # Dump hashes

# targets.txt: list of hosts without SMB signing (from CrackMapExec)
crackmapexec smb 192.168.1.0/24 --gen-relay-list targets.txt
```

### Ettercap — Network MITM Tool

```bash
# Install
apt install ettercap-graphical ettercap-common

# Terminal (text UI)
ettercap -T -q -M arp:remote /192.168.1.1// /192.168.1.50//
# -T = text only, -q = quiet, -M = MITM method
# /192.168.1.1// = gateway
# /192.168.1.50// = target
# arp:remote = ARP poisoning (remote = poison both sides)

# Sniff all hosts on subnet
ettercap -T -q -M arp:remote /192.168.1.1// //

# With SSL stripping plugin
ettercap -T -q -M arp:remote -P sslstrip /192.168.1.1// //

# MITM with plugin
ettercap -T -q -M arp:remote -P dos_attack /192.168.1.1// /192.168.1.50//

# DNS spoofing (with etter.dns config file)
ettercap -T -q -P dns_spoof -M arp:remote /192.168.1.1// //

# Graphical UI
ettercap -G
# Sniff → Unified Sniffing → Select interface
# Hosts → Scan for Hosts
# Add to Target 1 (gateway), Target 2 (victim)
# Mitm → ARP poisoning → OK
# Start → Start Sniffing

# arpspoof (simpler alternative — from dsniff package)
apt install dsniff
echo 1 > /proc/sys/net/ipv4/ip_forward
arpspoof -i eth0 -t 192.168.1.50 192.168.1.1   # Tell victim: GW = me
arpspoof -i eth0 -t 192.168.1.1 192.168.1.50   # Tell GW: victim = me
```

---

## 10. Authentication Attack Tools

### Hydra — Network Login Brute Force

```bash
# Install
apt install hydra

# ─── SYNTAX ──────────────────────────────────────────────────────────────────
# hydra -l user -p pass protocol://target
# hydra -L users.txt -P passwords.txt protocol://target

# ─── SSH ─────────────────────────────────────────────────────────────────────
hydra -l root -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.10
hydra -L users.txt -P passwords.txt ssh://192.168.1.10 -t 4 -V
# -t 4: 4 threads (low to avoid lockout), -V: verbose

# ─── FTP ─────────────────────────────────────────────────────────────────────
hydra -l admin -P passwords.txt ftp://192.168.1.10

# ─── HTTP FORM ────────────────────────────────────────────────────────────────
hydra -l admin -P passwords.txt 192.168.1.10 http-post-form \
  "/login.php:username=^USER^&password=^PASS^:Invalid credentials"
# Format: "URL:POST-data:failure-string"

# HTTP GET form
hydra -l admin -P passwords.txt 192.168.1.10 http-get-form \
  "/login:username=^USER^&password=^PASS^:F=Login failed"
# F= failure string, S= success string

# HTTPS
hydra -l admin -P passwords.txt https-post-form://192.168.1.10 \
  "/login:user=^USER^&pass=^PASS^:Invalid"

# HTTP Basic Auth
hydra -l admin -P passwords.txt http-get://192.168.1.10/admin/

# ─── RDP ─────────────────────────────────────────────────────────────────────
hydra -l Administrator -P passwords.txt rdp://192.168.1.10
# Slow and noisy — use with care

# ─── SMB ─────────────────────────────────────────────────────────────────────
hydra -l administrator -P passwords.txt smb://192.168.1.10

# ─── SMTP ────────────────────────────────────────────────────────────────────
hydra -l user@example.com -P passwords.txt smtp://mail.example.com

# ─── IMAP ────────────────────────────────────────────────────────────────────
hydra -l user -P passwords.txt imap://192.168.1.10

# ─── SNMP ────────────────────────────────────────────────────────────────────
hydra -P community-strings.txt snmp://192.168.1.10

# ─── MySQL ────────────────────────────────────────────────────────────────────
hydra -l root -P passwords.txt mysql://192.168.1.10

# ─── MSSQL ────────────────────────────────────────────────────────────────────
hydra -l sa -P passwords.txt mssql://192.168.1.10

# ─── VNC ─────────────────────────────────────────────────────────────────────
hydra -P passwords.txt vnc://192.168.1.10

# ─── GLOBAL OPTIONS ──────────────────────────────────────────────────────────
-t 4           # Threads (default 16 — reduce to avoid lockout)
-w 30          # Wait 30s between tries (rate limiting)
-f             # Stop after first valid password found
-F             # Stop after first valid password PER HOST
-V             # Verbose (show each attempt)
-v             # Slightly less verbose
-R             # Restore interrupted session
-o output.txt  # Save found passwords to file
-e nsr         # Also try: n=null password, s=username as password, r=reversed username
```

### Medusa — Parallel Network Login Brute Force

```bash
# Install
apt install medusa

# Syntax: medusa -h host -u user -P passlist -M module

# SSH
medusa -h 192.168.1.10 -u root -P passwords.txt -M ssh
medusa -H hosts.txt -u root -P passwords.txt -M ssh -t 2   # -t threads per host

# FTP
medusa -h 192.168.1.10 -u admin -P passwords.txt -M ftp

# HTTP basic auth
medusa -h 192.168.1.10 -u admin -P passwords.txt -M http -m DIR:/admin

# HTTP form
medusa -h 192.168.1.10 -u admin -P passwords.txt -M web-form \
  -m FORM:"POST /login.php" -m DENY-SIGNAL:"Login failed" \
  -m CUSTOM-HEADER:"Content-Type: application/x-www-form-urlencoded" \
  -m FORM-DATA:"POST?username=&password="

# RDP
medusa -h 192.168.1.10 -u Administrator -P passwords.txt -M rdp

# SMB
medusa -h 192.168.1.10 -u administrator -P passwords.txt -M smbnt

# SNMP community strings
medusa -h 192.168.1.10 -P community-strings.txt -M snmp

# List available modules
medusa -d

# Options
-f    # Stop after first success
-F    # Stop after first success on any host
-t 3  # Threads
-T 5  # Total simultaneous connections
-v 6  # Verbosity (0-6)
-w 30 # Wait 30 seconds between retries
-r 3  # Number of retries
```

---

## 11. Packet Crafting

### Scapy — Python Packet Crafting

```bash
# Install
pip3 install scapy
apt install python3-scapy

# Launch interactive shell
scapy
# Or in Python script:
from scapy.all import *
```

#### Scapy Core Concepts

```python
# ─── BUILDING PACKETS ─────────────────────────────────────────────────────────
from scapy.all import *

# Craft a packet (layers separated by /)
pkt = Ether() / IP(dst="192.168.1.10") / TCP(dport=80, flags="S")

# View packet structure
pkt.show()
pkt.show2()          # Decoded values

# View in hex
hexdump(pkt)
ls(pkt)              # List all fields

# ─── SEND AND RECEIVE ─────────────────────────────────────────────────────────
# Layer 2 send (Ethernet) — requires root
sendp(pkt, iface="eth0")

# Layer 3 send (IP) — handles routing automatically
send(pkt)

# Send and receive one response (layer 3)
response = sr1(pkt, timeout=2)

# Send and receive multiple responses (layer 3)
ans, unans = sr(pkt, timeout=2)

# Send and receive at layer 2
ans, unans = srp(pkt, iface="eth0", timeout=2)

# ─── COMMON PACKET RECIPES ────────────────────────────────────────────────────

# ICMP ping
ping = IP(dst="192.168.1.10") / ICMP()
response = sr1(ping, timeout=2)
if response:
    print(f"Host is up: {response[IP].src}")

# TCP SYN (port scan)
syn = IP(dst="192.168.1.10") / TCP(dport=80, flags="S")
response = sr1(syn, timeout=2, verbose=0)
if response and response.haslayer(TCP):
    if response[TCP].flags == "SA":
        print("Port 80 is OPEN")
    elif response[TCP].flags == "RA":
        print("Port 80 is CLOSED")

# Send RST to close connection (after SYN-ACK received)
rst = IP(dst="192.168.1.10") / TCP(dport=80, flags="R", seq=response[TCP].ack)
send(rst)

# TCP port scan (multiple ports)
for port in [22, 80, 443, 445, 3389]:
    syn = IP(dst="192.168.1.10") / TCP(dport=port, flags="S")
    resp = sr1(syn, timeout=0.5, verbose=0)
    state = "open" if resp and resp.haslayer(TCP) and resp[TCP].flags & 0x12 else "closed/filtered"
    print(f"Port {port}: {state}")
    if resp and resp.haslayer(TCP) and resp[TCP].flags & 0x12:
        rst = IP(dst="192.168.1.10") / TCP(dport=port, flags="R", seq=resp[TCP].ack)
        send(rst, verbose=0)

# ARP request
arp = ARP(pdst="192.168.1.10")
ether = Ether(dst="ff:ff:ff:ff:ff:ff")
packet = ether / arp
result = srp(packet, iface="eth0", timeout=3, verbose=0)
for sent, received in result:
    print(f"{received.psrc} is at {received.hwsrc}")

# ARP sweep
def arp_sweep(network):
    arp = ARP(pdst=network)
    ether = Ether(dst="ff:ff:ff:ff:ff:ff")
    ans, _ = srp(ether/arp, iface="eth0", timeout=3, verbose=0)
    return [(r.psrc, r.hwsrc) for _, r in ans]

hosts = arp_sweep("192.168.1.0/24")
for ip, mac in hosts:
    print(f"{ip} → {mac}")

# Craft custom ICMP (with payload)
icmp_with_data = IP(dst="192.168.1.10") / ICMP() / Raw(load=b"AAAABBBBCCCC")
send(icmp_with_data)

# DNS query
dns_req = IP(dst="8.8.8.8") / UDP(dport=53) / \
          DNS(rd=1, qd=DNSQR(qname="example.com", qtype="A"))
response = sr1(dns_req, timeout=2, verbose=0)
if response and response.haslayer(DNS):
    print(response[DNS].an.rdata)

# Fragmented IP packet
frag1 = IP(dst="192.168.1.10", flags="MF", frag=0) / Raw(b"A" * 8)   # MF = More Fragments
frag2 = IP(dst="192.168.1.10", frag=1) / Raw(b"B" * 8)                # Last fragment
send(frag1)
send(frag2)

# VXLAN-encapsulated frame
from scapy.contrib.vxlan import VXLAN
inner = Ether(src="AA:BB:CC:DD:EE:FF", dst="11:22:33:44:55:66") / \
        IP(src="10.100.1.99", dst="10.100.1.10") / ICMP()
vxlan = IP(src="1.1.1.1", dst="2.2.2.2") / UDP(dport=4789) / VXLAN(vni=10100) / inner
send(vxlan)

# 802.1Q double-tagged (VLAN hopping)
double_tagged = Ether() / Dot1Q(vlan=1) / Dot1Q(vlan=20) / IP(dst="192.168.20.10") / ICMP()
sendp(double_tagged, iface="eth0")

# TCP session hijacking (inject data into established session — need correct seq/ack)
hijack = IP(src="192.168.1.50", dst="192.168.1.10") / \
         TCP(sport=54321, dport=80, flags="PA",
             seq=1001,          # Must match next expected seq
             ack=5001) / \
         Raw(load=b"GET /evil HTTP/1.1\r\nHost: evil.com\r\n\r\n")
send(hijack)

# ─── CAPTURE AND ANALYSE ──────────────────────────────────────────────────────
# Capture 10 packets
pkts = sniff(count=10, iface="eth0")

# Capture with filter
pkts = sniff(filter="tcp port 80", iface="eth0", timeout=30)

# Capture and process with callback
def packet_handler(pkt):
    if pkt.haslayer(TCP) and pkt.haslayer(Raw):
        print(f"Data: {pkt[Raw].load}")

sniff(filter="tcp", prn=packet_handler, iface="eth0", timeout=60)

# Write to pcap
wrpcap("/tmp/scapy_capture.pcap", pkts)

# Read from pcap
pkts = rdpcap("/tmp/capture.pcap")
for pkt in pkts:
    if pkt.haslayer(IP):
        print(f"{pkt[IP].src} → {pkt[IP].dst}")

# ─── USEFUL SCAPY FUNCTIONS ───────────────────────────────────────────────────
ls()               # List all supported protocols
ls(TCP)            # List TCP fields
lsc()              # List scapy commands
conf.iface         # Current default interface
conf.iface = "eth0"  # Set default interface
```

---

## 12. CrackMapExec — Windows Network Enumeration

```bash
# Install
pip3 install crackmapexec
# Or: apt install crackmapexec (may be outdated)

# ─── SMB ─────────────────────────────────────────────────────────────────────
# Host discovery + SMB info
crackmapexec smb 192.168.1.0/24

# Authentication test
crackmapexec smb 192.168.1.10 -u jsmith -p Password123

# Enumerate shares
crackmapexec smb 192.168.1.10 -u jsmith -p Password123 --shares

# List files in share
crackmapexec smb 192.168.1.10 -u jsmith -p Password123 -M spider_plus

# Enumerate users
crackmapexec smb 192.168.1.0/24 -u jsmith -p Password123 --users

# Enumerate groups
crackmapexec smb 192.168.1.0/24 -u jsmith -p Password123 --groups

# Enumerate domain
crackmapexec smb 192.168.1.10 -u jsmith -p Password123 --domain

# Password spray (one password against many users)
crackmapexec smb 192.168.1.0/24 -u users.txt -p 'Winter2026!' --continue-on-success

# Pass-the-Hash
crackmapexec smb 192.168.1.0/24 -u Administrator -H AABBCCDDEEFF00112233445566778899

# Execute command
crackmapexec smb 192.168.1.10 -u Administrator -p Password123 -x 'whoami'

# Execute PowerShell
crackmapexec smb 192.168.1.10 -u Administrator -p Password123 \
  -X 'Get-LocalUser | Select-Object Name,Enabled'

# SAM dump (local accounts)
crackmapexec smb 192.168.1.10 -u Administrator -p Password123 --sam

# LSA dump (cached credentials)
crackmapexec smb 192.168.1.10 -u Administrator -p Password123 --lsa

# NTDS dump (domain hash dump — requires DC)
crackmapexec smb 192.168.1.10 -u Administrator -p Password123 --ntds

# Generate relay target list (hosts without SMB signing)
crackmapexec smb 192.168.1.0/24 --gen-relay-list relay-targets.txt

# ─── WINRM ────────────────────────────────────────────────────────────────────
crackmapexec winrm 192.168.1.0/24 -u jsmith -p Password123

# ─── LDAP ────────────────────────────────────────────────────────────────────
crackmapexec ldap 192.168.1.0/24 -u jsmith -p Password123

# Kerberoasting via LDAP
crackmapexec ldap 192.168.1.10 -u jsmith -p Password123 --kerberoasting kerberoast.txt

# AS-REP roasting
crackmapexec ldap 192.168.1.10 -u jsmith -p Password123 --asreproast asrep.txt

# ─── MSSQL ────────────────────────────────────────────────────────────────────
crackmapexec mssql 192.168.1.10 -u sa -p Password123 -q "SELECT name FROM sys.databases"

# ─── OUTPUT ───────────────────────────────────────────────────────────────────
# Results stored in ~/.cme/logs/
# [+] = success, [-] = failure, [*] = info

# Database query for past results
cmedb
> hosts                    # Show all hosts
> credentials              # Show all found credentials
> hosts (domain_admins)    # Hosts where domain admin creds worked
```

---

## Quick Reference — Module 11

### Nmap Scan Type Reference
| Scan | Flag | Requires Root | Notes |
|------|------|--------------|-------|
| SYN | -sS | Yes | Stealthy, fast |
| Connect | -sT | No | Full 3-way, detectable |
| UDP | -sU | Yes | Slow |
| ACK | -sA | Yes | Firewall mapping |
| FIN | -sF | Yes | RFC bypass |
| NULL | -sN | Yes | RFC bypass |
| Xmas | -sX | Yes | RFC bypass |
| Idle | -sI | Yes | Truly blind |

### Tool Category Reference
| Category | Primary Tools |
|----------|--------------|
| Host discovery | nmap -sn, arp-scan, netdiscover, masscan |
| Port scanning | nmap, masscan |
| Traffic capture | tcpdump, tshark, Wireshark |
| Traffic analysis | Wireshark, NetworkMiner, Zeek |
| MITM | Bettercap, Responder, arpspoof, Ettercap |
| NTLM relay | Responder + ntlmrelayx.py |
| Auth brute force | Hydra, Medusa |
| Windows enum | CrackMapExec, BloodHound, ldapdomaindump |
| DNS enum | dig, dnsrecon, fierce, dnsx |
| Wireless attack | aircrack-ng, hcxdumptool, Kismet |
| Packet crafting | Scapy, hping3 |
| Bandwidth test | iperf3, mtr |
| Vuln scan | nmap --script vuln, Nessus, OpenVAS |

### Hydra Protocol Reference
```bash
hydra -L users -P pass ssh://target
hydra -L users -P pass ftp://target
hydra -L users -P pass rdp://target
hydra -L users -P pass smb://target
hydra -L users -P pass snmp://target
hydra -L users -P pass smtp://target
hydra -L users -P pass imap://target
hydra -L users -P pass mysql://target
hydra -L users -P pass vnc://target
hydra -l user -P pass target http-post-form "/login:user=^USER^&pass=^PASS^:failed"
```

### Scapy Quick Packet Reference
```python
# TCP SYN
IP(dst="host")/TCP(dport=80, flags="S")

# ICMP ping
IP(dst="host")/ICMP()

# DNS query
IP(dst="8.8.8.8")/UDP(dport=53)/DNS(rd=1, qd=DNSQR(qname="example.com"))

# ARP request
Ether(dst="ff:ff:ff:ff:ff:ff")/ARP(pdst="192.168.1.0/24")

# Double-tagged VLAN
Ether()/Dot1Q(vlan=1)/Dot1Q(vlan=20)/IP()/ICMP()

# VXLAN
IP()/UDP(dport=4789)/VXLAN(vni=10100)/Ether()/IP()/ICMP()
```

---

## Related Notes
- [[Module-00-Foundations]] — OSI model context for all tools
- [[Module-03-Protocols-Deep-Dive]] — Protocol knowledge needed to interpret tool output
- [[Module-06-Network-Monitoring]] — Wireshark, tcpdump, Zeek, Snort/Suricata in monitoring context
- [[Module-08-Wireless-Networking]] — aircrack-ng, Kismet, hcxdumptool in wireless context
- [[Module-12-Pentest-Perspective]] — All tools combined in full engagement workflow

### Netcat Listener Reference
```bash
# TCP listener
nc -lvnp 4444

# UDP listener
nc -u -lvnp 4444
```
