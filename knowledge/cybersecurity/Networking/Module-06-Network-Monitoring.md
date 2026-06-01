---
title: "Module 06 — Network Monitoring & Traffic Analysis"
tags: [networking, monitoring, wireshark, tcpdump, zeek, snort, suricata, netflow, siem, ids, ips, pentest, netgod]
module: 6
date: 2026-04-05
---

# Module 06 — Network Monitoring & Traffic Analysis

> [!info] Module Overview
> This module covers the full monitoring stack — from raw packet capture to enterprise SIEM. NetFlow/sFlow/IPFIX for flow telemetry, SNMP monitoring with real tool configs, syslog severity levels and forwarding, SIEM correlation logic, Wireshark capture and display filters in depth, tcpdump one-liners, Zeek log types and threat hunting, IDS vs IPS with Snort/Suricata rule writing, and performance baselining with iperf3/mtr. Every section includes the attacker's perspective — how to avoid detection and what blue teamers should look for.

---

## 1. NetFlow, sFlow, and IPFIX

### What Flow Telemetry Is

Flow telemetry provides **metadata about network conversations** without capturing the actual packet payload. A "flow" is a set of packets sharing the same 5-tuple: source IP, destination IP, source port, destination port, protocol.

Instead of storing every byte of traffic (impractical at scale), flow records tell you:
- Who talked to whom
- What protocol/port
- How much data was exchanged
- When and for how long

**Use cases**: Traffic baselining, anomaly detection, capacity planning, security investigation, billing.

### NetFlow (Cisco — Most Widely Used)

NetFlow was developed by Cisco and is supported by virtually all Cisco devices and most third-party network devices.

**How it works**:
```
Router/Switch → Caches flows in flow cache → Exports flow records to NetFlow Collector
                                              (every N packets or on flow expiry)
```

**NetFlow v5** (legacy, still widely deployed):
- Fixed 7-field key: src IP, dst IP, src port, dst port, protocol, ToS, input interface
- Exports: bytes, packets, start/end time, TCP flags, next-hop, AS info

**NetFlow v9** (flexible template-based):
- Template-based — exporter defines which fields to include
- Supports IPv6, MPLS, BGP, additional fields

**IPFIX** (RFC 7011 — the open standard based on NetFlow v9):
- Internet standard for flow export
- Supported by most modern devices including non-Cisco

**Cisco IOS NetFlow Configuration**:
```cisco
! Enable NetFlow on interface (v5 export)
interface GigabitEthernet0/0
 ip flow ingress      ! Capture inbound flows
 ip flow egress       ! Capture outbound flows

! Configure NetFlow export
ip flow-export version 9
ip flow-export destination 192.168.100.20 9995    ! Collector IP and UDP port
ip flow-export source GigabitEthernet0/1           ! Source interface for export packets

! Tune cache settings
ip flow-cache timeout active 1       ! Export active flows every 1 minute
ip flow-cache timeout inactive 15    ! Export inactive flows after 15 seconds

! Verify
show ip flow export                  ! Export configuration
show ip flow interface               ! Which interfaces are monitored
show ip cache flow                   ! Current flow cache contents
show ip cache verbose flow           ! Detailed flow cache
```

**Example flow cache output**:
```
SrcIf      SrcIPaddress    DstIf      DstIPaddress    Pr  SrcP  DstP  Pkts
Gi0/0      192.168.1.50    Gi0/1      93.184.216.34   06  D4E7  0050    12    (TCP, src port 54503, dst 80)
Gi0/0      192.168.1.51    Gi0/1      8.8.8.8         11  8BEF  0035     3    (UDP, src port 35823, dst 53)
```

**Flexible NetFlow** (modern Cisco — more granular):
```cisco
! Define a flow record (what fields to capture)
flow record CUSTOM_RECORD
 match ipv4 source address
 match ipv4 destination address
 match transport source-port
 match transport destination-port
 match ip protocol
 collect counter bytes
 collect counter packets
 collect timestamp sys-uptime first
 collect timestamp sys-uptime last

! Define exporter
flow exporter COLLECTOR
 destination 192.168.100.20
 transport udp 9995
 export-protocol netflow-v9

! Define monitor (combine record + exporter)
flow monitor TRAFFIC_MONITOR
 record CUSTOM_RECORD
 exporter COLLECTOR
 cache timeout active 60
 cache timeout inactive 15

! Apply to interface
interface GigabitEthernet0/0
 ip flow monitor TRAFFIC_MONITOR input
 ip flow monitor TRAFFIC_MONITOR output
```

### sFlow

sFlow is a sampling-based protocol — it captures a **statistical sample** of packets (e.g., every 1-in-1000 packets) rather than tracking all flows. This makes it extremely scalable on high-volume links.

- **RFC 3176** / **RFC 5101**
- **Port**: UDP 6343
- Supported natively by many switch vendors (Juniper, Arista, HP/Aruba, Brocade)
- Less accurate than NetFlow for small flows (sampling misses low-volume connections)
- Better for high-throughput environments (10+ Gbps links)

```bash
# hsflowd — sFlow host agent for Linux servers
apt install hsflowd
# /etc/hsflowd.conf:
# sflow {
#   collector { ip=192.168.100.20; udpport=6343; }
#   polling { interval=30; }
#   sampling { ingress; egress; header=128; rate=1024; }  # 1-in-1024 sampling
# }
```

### NetFlow Collectors and Analysers

```bash
# nfdump — CLI NetFlow collector and analyser
# ntopng — web-based flow analyser (also supports sFlow, IPFIX)
# Elasticsearch + Kibana + Logstash (ELK) with flow plugin
# Grafana + InfluxDB + pmacct — metrics and flow data

# Install nfdump (Debian/Ubuntu)
apt install nfdump nfcapd

# Start nfcapd — listens for NetFlow exports, writes to files
nfcapd -w -D -l /var/log/netflow -p 9995

# Analyse with nfdump
nfdump -r /var/log/netflow/nfcapd.current \
  -s record/bytes \           # Sort by bytes
  -n 20 \                     # Show top 20
  'proto tcp and dst port 80' # Filter expression

# Top talkers by bytes in last 10 minutes
nfdump -R /var/log/netflow -s record/bytes -n 10

# Find all connections to a specific host
nfdump -r /var/log/netflow/nfcapd.current 'dst ip 1.2.3.4'

# Detect port scan (many destinations from one source)
nfdump -r /var/log/netflow -A srcip,dstport 'proto tcp' | sort -k4 -rn | head -20
```

### Pentest Lens — NetFlow

**For attackers**: NetFlow reveals you. Even if your traffic is encrypted, flow metadata shows you connected to a C2 server, exfiltrated a large amount of data, or scanned many hosts. Blue teamers increasingly use NetFlow as a primary detection mechanism.

**What NetFlow reveals about an attack**:
- Port scan: one source IP connecting to many destination IPs/ports in short time
- C2 beaconing: periodic small connections to an unusual external IP on a consistent schedule
- Data exfiltration: large outbound data transfer to an unexpected external IP
- Lateral movement: internal host connecting to many other internal hosts (unusual for a workstation)

**Evasion**:
- Low-and-slow scanning — reduce scan rate to blend with background traffic
- Blend C2 with legitimate traffic — use domains/IPs that also appear in legitimate use
- Encrypted traffic — content hidden, but metadata still visible
- Legitimate service abuse — use cloud services (GitHub, Dropbox, OneDrive) as C2 channels; these appear in normal traffic

**Detection queries** (nfdump examples):
```bash
# Detect potential port scan: one src IP, many distinct dst ports in 1 minute
nfdump -r /var/log/netflow -A srcip,dstip 'proto tcp and flags S' | \
  awk '{print $1}' | sort | uniq -c | sort -rn | head

# Detect large outbound transfers (potential exfiltration)
nfdump -r /var/log/netflow 'bytes > 100000000 and dst net not 10.0.0.0/8'

# Detect beaconing (periodic connections — exact same byte count repeatedly)
nfdump -r /var/log/netflow -A srcip,dstip,dstport 'proto tcp' | \
  awk '{print $1, $2, $3, $5}' | sort | uniq -c | sort -rn
```

---

## 2. SNMP Monitoring — Zabbix, PRTG, Nagios, LibreNMS

### What to Monitor Per Device Type

Good network monitoring answers: "Is it up? Is it healthy? Is it trending toward failure?"

**Switches and Routers**:
| Metric | SNMP OID | Alert Threshold |
|--------|---------|----------------|
| Interface status (up/down) | 1.3.6.1.2.1.2.2.1.8 | Any change |
| Interface input/output utilisation | 1.3.6.1.2.1.2.2.1.10/16 | > 80% for 5 min |
| Interface error rate | 1.3.6.1.2.1.2.2.1.14/20 | > 0.1% |
| CPU utilisation | 1.3.6.1.4.1.9.2.1.56 (Cisco) | > 70% |
| Memory utilisation | 1.3.6.1.4.1.9.9.48.1.1.1.5 (Cisco) | > 85% |
| BGP peer state | 1.3.6.1.2.1.15.3.1.2 | != established(6) |
| OSPF neighbour state | 1.3.6.1.2.1.14.10.1.6 | != full(8) |

**Servers (Linux/Windows)**:
| Metric | Method | Alert Threshold |
|--------|--------|----------------|
| CPU load | SNMP/agent | > 90% sustained |
| Memory used | SNMP/agent | > 90% |
| Disk space | SNMP/agent | > 85% |
| Process status | SNMP/agent | Required process not running |
| Network throughput | SNMP | Per-interface, alert on anomalies |

### Zabbix Setup (Production-Grade)

```bash
# Install Zabbix server (Debian/Ubuntu)
wget https://repo.zabbix.com/zabbix/6.4/ubuntu/pool/main/z/zabbix-release/zabbix-release_6.4-1+ubuntu22.04_all.deb
dpkg -i zabbix-release_6.4-1+ubuntu22.04_all.deb
apt update && apt install zabbix-server-mysql zabbix-frontend-php zabbix-apache-conf zabbix-sql-scripts zabbix-agent

# Configure database
mysql -uroot -p
> CREATE DATABASE zabbix CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
> CREATE USER 'zabbix'@'localhost' IDENTIFIED BY 'ZabbixPass123';
> GRANT ALL PRIVILEGES ON zabbix.* TO 'zabbix'@'localhost';

# Import schema
zcat /usr/share/zabbix-sql-scripts/mysql/server.sql.gz | mysql -uzabbix -p zabbix

# Edit /etc/zabbix/zabbix_server.conf
# DBPassword=ZabbixPass123

# Start services
systemctl start zabbix-server zabbix-agent apache2
systemctl enable zabbix-server zabbix-agent apache2
```

**Zabbix SNMP host configuration** (via web UI or API):
```
Host: Core-Switch-01
IP: 192.168.100.1
SNMP community: {$SNMP_COMMUNITY}  (macro = "public" or custom)
SNMP version: 2
Templates: Template Net Cisco IOS SNMPv2
           Template Net Cisco IOS SNMPv2 Interfaces
Triggers: Interface Down, High CPU, High Memory
```

### LibreNMS (SNMP-Based Auto-Discovery)

LibreNMS is a powerful open-source network monitoring platform that auto-discovers devices via SNMP, LLDP, and CDP.

```bash
# Install (follows official guide — complex, use Docker for quick setup)
docker run -d \
  --name librenms \
  -e DB_HOST=db \
  -e DB_USER=librenms \
  -e DB_PASS=secret \
  -e DB_NAME=librenms \
  -p 8080:8080 \
  librenms/librenms:latest

# Add device for monitoring via CLI
php artisan device:add 192.168.1.1 --v2c --community public

# Run discovery
php artisan discovery:poll 192.168.1.1
```

**What LibreNMS shows automatically**: Interface graphs, bandwidth utilisation, OSPF/BGP topology, device inventory, port errors, system health.

---

## 3. Syslog — Severity Levels, rsyslog, Log Forwarding

### Syslog Severity Levels (RFC 5424)

| Level | Numeric | Keyword | Meaning |
|-------|---------|---------|---------|
| Emergency | 0 | emerg | System unusable |
| Alert | 1 | alert | Immediate action required |
| Critical | 2 | crit | Critical condition |
| Error | 3 | err | Error condition |
| Warning | 4 | warning | Warning condition |
| Notice | 5 | notice | Normal but significant |
| Informational | 6 | info | Informational messages |
| Debug | 7 | debug | Debug-level messages |

**Facility codes** (what generated the log):
| Facility | Code | Source |
|----------|------|--------|
| kern | 0 | Kernel messages |
| auth/authpriv | 4/10 | Authentication, sudo, SSH |
| daemon | 3 | System daemons |
| cron | 9 | Cron scheduler |
| local0–local7 | 16–23 | Custom use (network devices) |

**Priority = (Facility × 8) + Severity**. Used in syslog packet headers.

### Syslog Message Format

```
<priority>version timestamp hostname app-name proc-id msg-id msg
Example:
<34>1 2026-04-05T10:00:00.000Z switch01 %LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to down
  ↑↑
  34 = facility 4 (auth), severity 2 (critical): 4×8+2=34
```

### rsyslog Configuration

rsyslog is the standard syslog daemon on most Linux distributions.

```bash
# /etc/rsyslog.conf — main configuration

# ─── MODULES ─────────────────────────────────────────────────────────────────
module(load="imudp")                    # Enable UDP syslog reception
input(type="imudp" port="514")          # Listen on UDP 514

module(load="imtcp")                    # Enable TCP syslog reception
input(type="imtcp" port="514")          # Listen on TCP 514

# ─── LOCAL LOGGING RULES ─────────────────────────────────────────────────────
# Format: facility.severity  destination
auth,authpriv.*                 /var/log/auth.log       # All auth messages
*.*;auth,authpriv.none          -/var/log/syslog        # Everything except auth
kern.*                          /var/log/kern.log
cron.*                          /var/log/cron.log
daemon.*                        /var/log/daemon.log
*.crit                          /var/log/critical.log   # All critical and above

# ─── FORWARD TO SIEM ─────────────────────────────────────────────────────────
# Forward all messages to remote SIEM (TCP for reliability)
*.* action(type="omfwd"
           target="192.168.100.50"      # SIEM server IP
           port="514"
           protocol="tcp"
           action.resumeRetryCount="100"
           queue.type="linkedList"
           queue.size="10000")          # Buffer 10000 messages if SIEM unreachable

# Forward only critical and above to a separate alerting system
*.crit action(type="omfwd" target="192.168.100.51" port="514" protocol="udp")

# ─── STRUCTURED LOGGING (JSON format for SIEM) ────────────────────────────────
template(name="json_syslog" type="list") {
    constant(value="{")
    property(name="timereported" dateFormat="rfc3339" format="jsonf" caseConversion="lower")
    constant(value=",")
    property(name="hostname" format="jsonf")
    constant(value=",")
    property(name="syslogtag" format="jsonf")
    constant(value=",")
    property(name="msg" format="jsonf")
    constant(value="}")
    constant(value="\n")
}

*.* action(type="omfwd" target="192.168.100.50" port="5140" protocol="tcp"
           template="json_syslog")
```

```bash
# Restart rsyslog after config changes
systemctl restart rsyslog

# Test syslog logging
logger -p auth.warning "Test authentication warning message"
logger -p kern.crit "Test kernel critical message"

# View logs
tail -f /var/log/syslog
tail -f /var/log/auth.log
journalctl -f                    # systemd journal (modern systems)
journalctl -p err                # Only error and above
journalctl -u ssh                # SSH service logs
```

### Cisco IOS Syslog Configuration

```cisco
! Enable logging to syslog server
logging host 192.168.100.50

! Set log severity level (0=emerg to 7=debug — logs this level AND ABOVE)
logging trap informational       ! Send levels 0-6 to syslog server

! Set log format with timestamps
service timestamps log datetime msec localtime show-timezone

! Set facility (local7 is common for network devices)
logging facility local7

! Buffer local logs
logging buffered 16384 informational

! Enable console logging (debug = all levels — careful on busy devices)
logging console warnings

! Verify
show logging
```

---

## 4. SIEM — Splunk, Graylog, ELK Stack

### What a SIEM Does

A SIEM (Security Information and Event Management) system:
1. **Collects** logs from all sources (syslog, Windows Event Log, NetFlow, firewall logs, application logs)
2. **Normalises** different log formats into a consistent schema
3. **Correlates** events across multiple sources to detect attack patterns
4. **Alerts** on rule matches (detection rules / correlation rules)
5. **Stores** logs for compliance and forensic investigation

### Log Sources to Feed to SIEM

| Source | What It Provides | Method |
|--------|----------------|--------|
| Domain Controllers | Logon events, account changes, Kerberos, GPO | WinRM/WEF, agent |
| Firewalls | Allowed/denied connections, NAT | Syslog |
| Switches/Routers | Interface changes, ACL hits | Syslog, SNMP traps |
| Web servers | HTTP requests, errors | Syslog, agent |
| DNS servers | Query logs | Syslog, Windows DNS debug log |
| Endpoints | Process creation, network connections | EDR agent |
| VPN | Connection/disconnection, failed auth | Syslog |
| NetFlow | Traffic metadata | NetFlow collector |

### Critical Windows Event IDs for SIEM

| Event ID | Description | Significance |
|---------|-------------|-------------|
| 4624 | Successful logon | Baseline — alert on unusual hours, new hosts |
| 4625 | Failed logon | Alert on high count (brute force) |
| 4648 | Logon with explicit credentials (runas) | Lateral movement indicator |
| 4672 | Special privileges assigned to logon | Admin-level access |
| 4688 | Process creation | New process — detect malware execution |
| 4697 | Service installed | Alert on new service installs |
| 4719 | System audit policy changed | Tampering with logging |
| 4720 | User account created | New account — may indicate persistence |
| 4728/4732 | User added to group | Privilege escalation |
| 4768 | Kerberos TGT requested | AD authentication — baseline |
| 4769 | Kerberos service ticket requested | Kerberoasting — many requests = alert |
| 4771 | Kerberos pre-auth failed | Failed AD logon |
| 4776 | NTLM authentication | Alert on NTLM (should use Kerberos) |
| 7045 | New service installed | Malware persistence mechanism |
| 1102 | Audit log cleared | Attacker covering tracks |

### Splunk — Core Search Language (SPL)

```splunk
# Basic search — all events in last 24h containing "failed"
index=windows "failed" earliest=-24h

# Search for failed logons (Event ID 4625) with count per source
index=windows EventCode=4625
| stats count by src_ip, user
| sort -count
| head 20

# Detect brute force: > 10 failed logons in 5 minutes from same source
index=windows EventCode=4625
| bin _time span=5m
| stats count by _time, src_ip, user
| where count > 10
| sort -count

# Kerberoasting detection: many 4769 events, RC4 encryption (etype=0x17)
index=windows EventCode=4769 Ticket_Encryption_Type=0x17
| stats count by Account_Name, Service_Name
| where count > 5
| sort -count

# Lateral movement: 4624 logon type 3 (network) from internal workstation to workstation
index=windows EventCode=4624 Logon_Type=3
| where NOT (match(src_ip, "^10\.0\.100\.") OR src_ip="192.168.1.1")
| stats count by src_ip, dest, user
| where count > 3

# New service installed
index=windows EventCode=7045
| table _time, host, Service_Name, Service_File_Name, Service_Type, Service_Account

# Correlate firewall + DNS: allowed connection to domain resolved by suspicious query
index=firewall action=allowed dest_port=443
| join dest_ip [search index=dns query_type=A
    | eval dest_ip=answer
    | where len(query) < 5 OR match(query, "^[a-z0-9]{20,}\.")  # Short or random domain
    | table dest_ip, query]
| table src_ip, dest_ip, query, bytes

# Top bandwidth consumers (from NetFlow data)
index=netflow
| stats sum(bytes) as total_bytes by src_ip
| eval MB=round(total_bytes/1024/1024,2)
| sort -MB
| head 20
```

### Graylog Setup (Docker — Quick Deploy)

```yaml
# docker-compose.yml for Graylog
version: '3'
services:
  mongodb:
    image: mongo:6.0
    volumes:
      - mongo_data:/data/db

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.10.2
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms1g -Xmx1g"
    volumes:
      - es_data:/usr/share/elasticsearch/data

  graylog:
    image: graylog/graylog:5.2
    environment:
      - GRAYLOG_PASSWORD_SECRET=YourSecretKey32CharsMin
      - GRAYLOG_ROOT_PASSWORD_SHA2=<sha256 of your password>
      - GRAYLOG_HTTP_EXTERNAL_URI=http://192.168.100.50:9000/
      - GRAYLOG_ELASTICSEARCH_HOSTS=http://elasticsearch:9200
      - GRAYLOG_MONGODB_URI=mongodb://mongodb/graylog
    ports:
      - 9000:9000    # Web UI
      - 514:514/udp  # Syslog UDP input
      - 514:514/tcp  # Syslog TCP input
      - 12201:12201/udp  # GELF UDP input
    depends_on:
      - mongodb
      - elasticsearch

volumes:
  mongo_data:
  es_data:
```

```bash
# Generate password hash for Graylog
echo -n "YourPassword" | sha256sum
```

### ELK Stack Overview (Elasticsearch + Logstash + Kibana)

```
Logs → Logstash (ingest/parse/enrich) → Elasticsearch (store/index) → Kibana (visualise/query)
     → Beats agents (lightweight forwarders)
```

```yaml
# /etc/logstash/conf.d/syslog.conf
input {
  syslog {
    port => 514
    type => "syslog"
  }
  beats {
    port => 5044        # Filebeat/Winlogbeat from endpoints
  }
}

filter {
  if [type] == "syslog" {
    grok {
      match => { "message" => "%{SYSLOGTIMESTAMP:timestamp} %{IPORHOST:hostname} %{DATA:program}: %{GREEDYDATA:message}" }
    }
    date {
      match => [ "timestamp", "MMM  d HH:mm:ss", "MMM dd HH:mm:ss" ]
    }
    geoip {
      source => "src_ip"    # Add geographic data for source IPs
    }
  }
}

output {
  elasticsearch {
    hosts => ["http://localhost:9200"]
    index => "syslog-%{+YYYY.MM.dd}"
  }
}
```

---

## 5. Wireshark — Capture and Display Filters, Following Streams, Spotting Attacks

### Capture Filters (BPF — Berkeley Packet Filter)

Capture filters are applied **before** packets are captured — only matching packets are stored. Use when you have a specific target to reduce file size.

```
# Syntax: BPF (same as tcpdump)

host 192.168.1.10              # Traffic to or from this host
src host 192.168.1.10          # Traffic FROM this host only
dst host 192.168.1.10          # Traffic TO this host only
net 192.168.1.0/24             # Entire subnet
src net 10.0.0.0/8             # FROM this network

port 80                        # TCP or UDP port 80
tcp port 443                   # Only TCP 443
not port 22                    # Exclude SSH (reduce noise)

tcp                            # All TCP traffic
udp                            # All UDP traffic
icmp                           # All ICMP

# Combinations
host 192.168.1.10 and port 80  # HTTP traffic to/from specific host
host 192.168.1.10 and not port 22  # All except SSH
tcp port 80 or tcp port 443    # HTTP and HTTPS
```

### Display Filters (Wireshark-specific)

Display filters are applied **after** capture — they filter what you see from the captured data. Much richer syntax than BPF.

```
# IP addressing
ip.addr == 192.168.1.10                    # Any IP match (src or dst)
ip.src == 192.168.1.10                     # Source IP
ip.dst == 192.168.1.10                     # Destination IP
ip.addr == 192.168.1.0/24                  # Entire subnet
!(ip.addr == 192.168.1.1)                  # Exclude IP

# Protocols
tcp                                         # All TCP
udp                                         # All UDP
icmp                                        # All ICMP
http                                        # HTTP (port 80 unencrypted only)
tls                                         # TLS handshakes
dns                                         # DNS queries/responses
arp                                         # ARP (all)
smb                                         # SMB traffic
smb2                                        # SMB2/3

# TCP flags
tcp.flags.syn == 1                          # SYN packets
tcp.flags.syn == 1 && tcp.flags.ack == 0   # SYN only (new connections)
tcp.flags.rst == 1                          # RST (aborted connections)
tcp.flags.fin == 1                          # FIN (graceful close)

# Ports
tcp.port == 80                              # TCP port 80 either direction
tcp.dport == 443                            # Destination port 443
tcp.sport == 54321                          # Source port
udp.port == 53                              # UDP 53 (DNS)

# Content matching
http.request.uri contains "login"          # HTTP URLs containing "login"
http.request.method == "POST"              # POST requests (form submissions, logins)
http.response.code == 200                  # HTTP 200 responses
http.cookie contains "session"             # Requests with session cookies
dns.qry.name contains "evil"               # DNS queries for domains containing "evil"
dns.flags.response == 0                    # DNS queries only (not responses)

# TCP analysis
tcp.analysis.retransmission               # Retransmitted segments (packet loss)
tcp.analysis.duplicate_ack               # Duplicate ACKs (congestion)
tcp.window_size == 0                     # Zero-window (flow control stall)
tcp.analysis.out_of_order               # Out-of-order segments

# Frame analysis
frame.len > 1400                         # Large frames (near MTU)
frame.time_delta > 1                     # Gaps > 1 second between packets

# ARP
arp.opcode == 1                          # ARP requests
arp.opcode == 2                          # ARP replies
arp.duplicate-address-detected           # Duplicate IP (potential ARP spoofing)

# ICMP
icmp.type == 8                           # Ping requests
icmp.type == 3                           # Destination unreachable
icmp.type == 11                          # TTL exceeded (traceroute)

# Stream following
tcp.stream == 5                          # Show only stream number 5
udp.stream == 2                          # UDP stream 2
```

### Following Streams

```
Right-click any packet → Follow → TCP Stream (or UDP Stream, TLS Stream)
```

This reconstructs the conversation as a readable text exchange. For plaintext protocols (HTTP, FTP, Telnet, SMTP), you see the actual content. For HTTPS, you see encrypted data unless you have the TLS session key.

**TLS decryption in Wireshark**:
```
Edit → Preferences → Protocols → TLS → (Pre)-Master Secret log file
Point to the SSLKEYLOGFILE path.

# On Linux/Mac — set environment variable before starting browser:
export SSLKEYLOGFILE=~/ssl-keys.log
google-chrome    # or firefox

# Chrome/Firefox write session keys to this file — Wireshark uses them to decrypt
# This works for ECDHE-based cipher suites (TLS 1.2 and 1.3)
```

### Exporting Objects

```
File → Export Objects → HTTP
```

Extracts files transferred over HTTP (images, downloads, HTML pages) from the capture. Very useful for capturing malware downloads, credentials in POST bodies, or sensitive documents transferred unencrypted.

### Spotting Attacks in pcap

**ARP Spoofing**:
```
Filter: arp
Look for: Same IP address appearing with two different MAC addresses
          Gratuitous ARPs (unsolicited ARP replies) — may be legitimate (HSRP) or malicious
Filter: arp.duplicate-address-detected
Also: arp.opcode == 2 and count unusually high ARP reply rate from single MAC
```

**Port Scan (Nmap SYN scan)**:
```
Filter: tcp.flags.syn == 1 && tcp.flags.ack == 0
Look for: Single source IP sending SYN to many destination ports in rapid succession
Many RST responses from target (closed ports)
No RST from open ports (waiting for connection completion)
Statistics → Endpoints → TCP tab shows connection count per IP
```

**LLMNR/NBT-NS Poisoning in Progress**:
```
Filter: llmnr or nbns
Look for: LLMNR query for a hostname → suspiciously fast response (attacker's machine)
If two responses: legitimate server + attacker's response (race condition)
Filter: smb2 → after poisoning, authentication attempt visible
```

**DNS Tunnelling**:
```
Filter: dns
Look for:
  - DNS queries with very long names (> 50 chars) — data encoded in subdomain
  - High query rate to single authoritative server
  - TXT record responses with large base64-encoded payloads
  - CNAME responses pointing to random-looking domains
Statistics → DNS → look for unusual query distribution
```

**Credential Capture (FTP/Telnet/HTTP)**:
```
# FTP
Filter: ftp
Follow TCP stream → Look for USER and PASS commands in cleartext

# Telnet
Filter: telnet
Follow TCP stream → Complete terminal session including credentials

# HTTP Basic Auth
Filter: http.authorization
Or: http.request.method == "POST" and follow stream — look for form data
```

**Slowloris DoS**:
```
Filter: http
Look for: Many TCP connections from same source, each with partial HTTP request
tcp.analysis → Many open connections in SYN_RECEIVED or ESTABLISHED with no data
Statistics → Conversations → TCP — shows unusually many connections from one IP
```

### Wireshark Command Line — tshark

```bash
# tshark — Wireshark's CLI equivalent

# Capture to file
tshark -i eth0 -w capture.pcap

# Capture with filter
tshark -i eth0 -f "tcp port 80" -w http_capture.pcap

# Read from file and apply display filter
tshark -r capture.pcap -Y "http.request.method == POST"

# Extract specific fields (credentials from HTTP POST)
tshark -r capture.pcap -Y "http.request.method == POST" \
  -T fields -e ip.src -e http.request.uri -e http.file_data

# Follow TCP stream (stream 0)
tshark -r capture.pcap -z follow,tcp,ascii,0

# Export HTTP objects
tshark -r capture.pcap --export-objects http,/tmp/exported_files/

# Statistics — protocol hierarchy
tshark -r capture.pcap -q -z io,phs

# Top conversations by bytes
tshark -r capture.pcap -q -z conv,tcp | sort -k4 -rn | head 20

# DNS query summary
tshark -r capture.pcap -Y dns -T fields -e dns.qry.name -e dns.a | sort | uniq -c | sort -rn
```

---

## 6. tcpdump — Syntax, Capture, and One-Liners

tcpdump is the standard CLI packet capture tool on Linux/Unix. Uses BPF filter syntax (same as Wireshark capture filters).

### Core Syntax

```bash
tcpdump [options] [filter expression]

# Key options:
# -i <interface>   Specify interface (-i any = all interfaces)
# -w <file>        Write raw packets to pcap file
# -r <file>        Read from pcap file
# -n               Don't resolve hostnames (faster, cleaner output)
# -nn              Don't resolve hostnames OR port names
# -v               Verbose (more header detail)
# -vv              More verbose (even more detail)
# -vvv             Maximum verbosity
# -A               Print ASCII content (cleartext protocols)
# -X               Print hex AND ASCII
# -c <count>       Capture N packets then stop
# -s <snaplen>     Capture N bytes per packet (0 = full packet, default 65535)
# -e               Print Layer 2 (Ethernet) header
# -t               Don't print timestamp
# -q               Quiet output (brief)
# -S               Print absolute sequence numbers
# -Z <user>        Drop privileges to user after opening interfaces
```

### Essential tcpdump One-Liners

```bash
# ─── CAPTURE ─────────────────────────────────────────────────────────────────

# Capture all traffic on eth0 to file (always use -w for later analysis)
tcpdump -i eth0 -w /tmp/capture.pcap

# Capture on any interface, no DNS resolution, full packets
tcpdump -i any -nn -s0 -w /tmp/capture.pcap

# Capture only traffic to/from specific host
tcpdump -i eth0 -nn host 192.168.1.10 -w /tmp/host_capture.pcap

# Capture HTTP traffic
tcpdump -i eth0 -nn port 80 -w /tmp/http.pcap

# Capture DNS queries
tcpdump -i eth0 -nn udp port 53

# Capture and print HTTP content (cleartext)
tcpdump -i eth0 -A -nn port 80

# Capture HTTPS handshakes (port 443, first 200 bytes only — just headers)
tcpdump -i eth0 -nn -s 200 port 443

# Capture everything except SSH (avoid capturing your own session)
tcpdump -i eth0 -nn not port 22 -w /tmp/capture.pcap

# Rotate captures — new file every 100MB or 1 hour
tcpdump -i eth0 -nn -w /tmp/capture_%Y%m%d_%H%M%S.pcap -G 3600 -C 100

# ─── ANALYSIS ────────────────────────────────────────────────────────────────

# Read pcap and filter
tcpdump -r capture.pcap -nn host 192.168.1.10

# Show TCP SYN packets (connection attempts)
tcpdump -r capture.pcap -nn 'tcp[tcpflags] & tcp-syn != 0 and tcp[tcpflags] & tcp-ack == 0'

# Show TCP RST packets
tcpdump -r capture.pcap -nn 'tcp[tcpflags] & tcp-rst != 0'

# Show all HTTP POST requests (show content)
tcpdump -r capture.pcap -A -nn 'tcp port 80 and tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x504f5354'
# 0x504f5354 = "POST" in hex

# Show ICMP traffic
tcpdump -r capture.pcap -nn icmp

# Show ARP traffic
tcpdump -r capture.pcap -nn arp

# Show UDP DNS queries only (not responses)
tcpdump -r capture.pcap -nn 'udp port 53 and udp[10] & 0x80 = 0'

# Show packets between two specific hosts
tcpdump -r capture.pcap -nn 'host 192.168.1.10 and host 192.168.1.20'

# Show packets to specific subnet
tcpdump -r capture.pcap -nn 'dst net 10.0.0.0/8'

# ─── USEFUL ONE-LINERS ────────────────────────────────────────────────────────

# Monitor DHCP traffic
tcpdump -i eth0 -nn port 67 or port 68

# Capture FTP credentials
tcpdump -i eth0 -A -nn port 21 | grep -E 'USER|PASS'

# Capture Telnet session
tcpdump -i eth0 -A -nn port 23

# Monitor OSPF (protocol 89)
tcpdump -i eth0 -nn proto 89

# Monitor BGP (TCP 179)
tcpdump -i eth0 -nn tcp port 179

# Watch for SYN floods (count SYN packets per second)
tcpdump -i eth0 -nn 'tcp[tcpflags] & tcp-syn != 0' | pv -l -r > /dev/null

# Capture and immediately grep for passwords
tcpdump -i eth0 -A -nn -l | grep -i 'pass\|password\|login\|credential'

# Show HTTP host headers
tcpdump -i eth0 -A -nn port 80 | grep "Host:"

# Top talkers (read pcap — requires tcpdump + awk)
tcpdump -r capture.pcap -nn | awk '{print $3}' | sort | uniq -c | sort -rn | head 20

# Extract all unique IPs from capture
tcpdump -r capture.pcap -nn | grep -oE '([0-9]{1,3}\.){3}[0-9]{1,3}' | sort -u
```

### Raw Bit-Level Filters

tcpdump allows matching specific byte positions in packet headers using `proto[offset:size]`:

```bash
# Match TCP packets with SYN flag set (byte 13 of TCP header, bit 1)
tcpdump 'tcp[13] & 2 != 0'

# Match ICMP echo request (type=8, code=0)
tcpdump 'icmp[0] = 8 and icmp[1] = 0'

# Match IP fragments
tcpdump 'ip[6] & 0x20 != 0'    # More Fragments bit set
tcpdump 'ip[6:2] & 0x1fff != 0'  # Fragment Offset != 0

# Match TCP with PSH+ACK flags (data being pushed)
tcpdump 'tcp[13] = 24'    # PSH(8) + ACK(16) = 24
```

---

## 7. Zeek — Log Types and Threat Hunting

### What Zeek Is

Zeek (formerly Bro) is a network analysis framework that passively monitors traffic and produces **structured, enriched log files** from network conversations. Unlike an IDS that generates alerts, Zeek creates detailed logs of all activity — you query these logs to hunt for threats.

### Installation and Basic Setup

```bash
# Install Zeek (Debian/Ubuntu)
echo 'deb http://download.opensuse.org/repositories/security:/zeek/xUbuntu_22.04/ /' \
  | tee /etc/apt/sources.list.d/security:zeek.list
curl -fsSL https://download.opensuse.org/repositories/security:/zeek/xUbuntu_22.04/Release.key \
  | gpg --dearmor | tee /etc/apt/trusted.gpg.d/security_zeek.gpg > /dev/null
apt update && apt install zeek

# Configure monitored interface
# /usr/local/zeek/etc/node.cfg
[zeek]
type=standalone
host=localhost
interface=eth0

# Start Zeek
zeekctl deploy
zeekctl status

# Logs written to /usr/local/zeek/logs/current/
```

### Zeek Log Types

Each log is a tab-separated file (or JSON if configured). Each row is one event.

| Log File | Contents | Key Fields |
|----------|---------|-----------|
| `conn.log` | Every network connection | src/dst IP, port, proto, duration, bytes, conn_state |
| `dns.log` | All DNS queries and responses | query, qtype, answer, rtt |
| `http.log` | HTTP requests and responses | host, uri, method, status_code, user_agent, resp_mime |
| `ssl.log` | TLS connections | server_name (SNI), version, cipher, cert_chain_fuids |
| `x509.log` | Certificate details | subject, issuer, not_valid_before/after, san |
| `files.log` | Files transferred | filename, mime_type, md5, sha1, sha256 |
| `smtp.log` | Email transactions | from, to, subject, mailfrom, rcptto |
| `ssh.log` | SSH connections | auth_success, auth_attempts, version, client, server |
| `rdp.log` | RDP connections | cookie, result, security_protocol |
| `kerberos.log` | Kerberos tickets | request_type, client, service, success, error_msg |
| `ntlm.log` | NTLM authentication | username, hostname, domainname, success |
| `smb_files.log` | SMB file access | name, action, size, times |
| `notice.log` | Zeek-generated alerts | note, msg, src, dst |
| `weird.log` | Protocol anomalies | name, msg — unusual or malformed traffic |

### Zeek Log Analysis with zeek-cut

```bash
# zeek-cut — extract specific columns from Zeek logs
# All Zeek logs have a header line starting with #fields

# Extract src/dst IPs and ports from conn.log
zeek-cut id.orig_h id.orig_p id.resp_h id.resp_p proto service < conn.log

# Top destination IPs by connection count
zeek-cut id.resp_h < conn.log | sort | uniq -c | sort -rn | head 20

# DNS queries — find all unique queried domains
zeek-cut query < dns.log | sort | uniq -c | sort -rn | head 50

# HTTP requests — find all POSTs
cat http.log | zeek-cut method host uri | awk '$1=="POST"' | head 20

# Find large file transfers (potential exfiltration)
zeek-cut id.orig_h id.resp_h orig_bytes resp_bytes < conn.log | \
  awk '$3 > 10000000' | sort -k3 -rn | head 20
# $3 = orig_bytes > 10MB

# SSL — find connections with self-signed or expired certs
zeek-cut id.orig_h id.resp_h server_name validation_status < ssl.log | \
  awk '$4 != "ok"'

# SSH — failed authentication attempts
zeek-cut id.orig_h id.resp_h auth_success auth_attempts < ssh.log | \
  awk '$3 == "F"' | sort | uniq -c | sort -rn
```

### Threat Hunting with Zeek

```bash
# ─── HUNT 1: DNS TUNNELLING ──────────────────────────────────────────────────
# Look for unusually long DNS queries (data encoded in subdomain)
zeek-cut query < dns.log | awk 'length($1) > 50' | sort | uniq -c | sort -rn

# High DNS query rate from single host (> 100 queries per minute)
zeek-cut ts id.orig_h query < dns.log | \
  awk '{print int($1/60), $2}' | sort | uniq -c | awk '$1 > 100'

# DNS queries to rarely seen domains
zeek-cut query < dns.log | sort | uniq -c | awk '$1 == 1' | head 50
# Single-occurrence domains — could be DGA (domain generation algorithm) C2

# ─── HUNT 2: BEACONING (C2 CHECK-INS) ────────────────────────────────────────
# Regular periodic connections to same external IP
# Look for many connections to same dst with similar intervals
zeek-cut ts id.orig_h id.resp_h < conn.log | \
  awk '{print $2, $3}' | sort | uniq -c | awk '$1 > 50' | \
  grep -v "192\.168\." | sort -rn | head 20
# High connection count to same non-RFC1918 IP = potential beaconing

# ─── HUNT 3: LATERAL MOVEMENT ────────────────────────────────────────────────
# Internal host connecting to many other internal hosts (unusual for workstation)
zeek-cut id.orig_h id.resp_h id.resp_p service < conn.log | \
  awk '$1 ~ /^192\.168\.1\.[0-9]+$/ && $2 ~ /^192\.168\.1\./' | \
  awk '{print $1}' | sort | uniq -c | awk '$1 > 20' | sort -rn

# SMB connections from workstations to many targets
zeek-cut id.orig_h id.resp_h < smb_files.log | \
  awk '{print $1}' | sort | uniq -c | awk '$1 > 10' | sort -rn

# ─── HUNT 4: CREDENTIAL THEFT ────────────────────────────────────────────────
# NTLM authentication from unexpected hosts
zeek-cut id.orig_h username domainname success < ntlm.log | \
  awk '$4 == "F"' | sort | uniq -c | sort -rn | head 20
# High count of failed NTLM = brute force or hash spray

# Kerberoasting detection — many TGS requests (type=TGS) in short time
zeek-cut ts id.orig_h client service request_type < kerberos.log | \
  awk '$5 == "TGS"' | awk '{print int($1/60), $2}' | \
  sort | uniq -c | awk '$1 > 20'

# ─── HUNT 5: DATA EXFILTRATION ───────────────────────────────────────────────
# Large outbound transfers to internet
zeek-cut id.orig_h id.resp_h orig_bytes < conn.log | \
  awk '$3 > 50000000' | \
  grep -v "192\.168\.\|10\.\|172\.1[6-9]\.\|172\.2[0-9]\.\|172\.3[0-1]\." | \
  sort -k3 -rn | head 20

# Files with unusual MIME types going outbound
zeek-cut id.orig_h id.resp_h filename mime_type tx_hosts < files.log | \
  awk '$4 == "application/x-dosexec"'    # Executable files
```

---

## 8. IDS vs IPS — Snort and Suricata

### IDS vs IPS

| Feature | IDS (Intrusion Detection) | IPS (Intrusion Prevention) |
|---------|--------------------------|---------------------------|
| Position | Passive — mirror/SPAN port | Inline — traffic passes through |
| Action on match | Alert only | Alert + Drop/Reject/Block |
| Effect on traffic | None | Adds latency |
| Risk | Missing attacks, false negatives | False positives block legitimate traffic |
| Deployment | Easy (no inline risk) | Requires careful tuning first |

**Passive IDS (SPAN port)**:
```
[Switch] ──SPAN──> [IDS] (monitoring port — receives copy of traffic)
[Switch] ──────────────> [Router/Firewall] (traffic flows unimpeded)
```

**Inline IPS**:
```
[Switch] ──────> [IPS] ──────> [Router/Firewall] (all traffic passes through IPS)
```

### Snort — Rule Syntax

Snort is one of the most widely used open-source IDS/IPS engines.

**Snort rule structure**:
```
action protocol src_ip src_port direction dst_ip dst_port (rule options)

action:   alert, log, pass, drop (IPS mode), reject (IPS — sends RST/ICMP unreachable)
protocol: tcp, udp, icmp, ip
direction: -> (unidirectional), <> (bidirectional)
```

**Rule options** (between parentheses, separated by semicolons):
| Option | Purpose | Example |
|--------|---------|---------|
| `msg` | Alert message | `msg:"SQL Injection Attempt";` |
| `sid` | Signature ID (unique) | `sid:1000001;` |
| `rev` | Revision number | `rev:1;` |
| `content` | Match byte string in payload | `content:"SELECT";` |
| `nocase` | Case-insensitive content match | `content:"select"; nocase;` |
| `pcre` | Perl-Compatible Regular Expression | `pcre:"/SELECT.+FROM/i";` |
| `flow` | Match connection direction/state | `flow:to_server,established;` |
| `flags` | TCP flags to match | `flags:S;` (SYN only) |
| `threshold` | Limit alert frequency | `threshold:type limit,track by_src,count 5,seconds 60;` |
| `priority` | Alert priority 1–10 | `priority:1;` |
| `classtype` | Attack category | `classtype:web-application-attack;` |
| `detection_filter` | Trigger after N matches | `detection_filter:track by_src,count 10,seconds 5;` |

### Snort Rule Examples

```snort
# ─── PORT SCAN DETECTION ─────────────────────────────────────────────────────
# Alert on SYN scan (SYN-only packets to many ports)
alert tcp any any -> $HOME_NET any (
  msg:"Possible TCP SYN Scan";
  flags:S;
  flow:stateless;
  threshold:type threshold,track by_src,count 20,seconds 5;
  sid:1000001; rev:1;
  classtype:attempted-recon;
  priority:2;
)

# ─── NMAP DETECTION ──────────────────────────────────────────────────────────
# Nmap NULL scan (no flags set)
alert tcp any any -> $HOME_NET any (
  msg:"Possible Nmap NULL Scan";
  flags:0;
  flow:stateless;
  sid:1000002; rev:1;
  classtype:attempted-recon;
)

# Nmap Xmas scan (FIN+PSH+URG)
alert tcp any any -> $HOME_NET any (
  msg:"Possible Nmap XMAS Scan";
  flags:FPU;
  flow:stateless;
  sid:1000003; rev:1;
  classtype:attempted-recon;
)

# ─── CREDENTIAL THEFT ────────────────────────────────────────────────────────
# FTP login in cleartext
alert tcp any any -> $HOME_NET 21 (
  msg:"FTP Login Attempt - Credentials in Cleartext";
  flow:to_server,established;
  content:"PASS ";
  nocase;
  sid:1000004; rev:1;
  classtype:policy-violation;
  priority:2;
)

# Telnet password
alert tcp any any -> $HOME_NET 23 (
  msg:"Telnet Password Transmission";
  flow:to_server,established;
  content:"Password:";
  nocase;
  sid:1000005; rev:1;
  classtype:policy-violation;
)

# ─── WEB APPLICATION ATTACKS ─────────────────────────────────────────────────
# SQL injection attempt
alert tcp any any -> $HTTP_SERVERS $HTTP_PORTS (
  msg:"SQL Injection Attempt - UNION SELECT";
  flow:to_server,established;
  content:"UNION";
  nocase;
  content:"SELECT";
  nocase;
  distance:0;
  pcre:"/UNION\s+(?:ALL\s+)?SELECT/i";
  sid:1000006; rev:1;
  classtype:web-application-attack;
  priority:1;
)

# Directory traversal
alert tcp any any -> $HTTP_SERVERS $HTTP_PORTS (
  msg:"Directory Traversal Attempt";
  flow:to_server,established;
  content:"../";
  sid:1000007; rev:1;
  classtype:web-application-attack;
)

# ─── MALWARE / C2 DETECTION ──────────────────────────────────────────────────
# HTTP-based C2 beaconing (custom user agent)
alert tcp $HOME_NET any -> any $HTTP_PORTS (
  msg:"Suspicious User-Agent - Possible Malware";
  flow:to_server,established;
  content:"User-Agent|3a 20|curl/";
  nocase;
  pcre:"/User-Agent:\s*curl\/[0-9]/i";
  threshold:type limit,track by_src,count 1,seconds 60;
  sid:1000008; rev:1;
  classtype:trojan-activity;
)

# ICMP tunnel (large ICMP payload)
alert icmp any any -> $HOME_NET any (
  msg:"Possible ICMP Tunnel - Large Payload";
  itype:8;
  dsize:>200;
  sid:1000009; rev:1;
  classtype:policy-violation;
  priority:2;
)

# DNS tunnelling (long subdomain)
alert udp $HOME_NET any -> any 53 (
  msg:"Possible DNS Tunnel - Long Query";
  content:"|01 00|";   # Standard DNS query flags
  offset:2;
  depth:2;
  pcre:"/[a-zA-Z0-9+\/=]{50,}\./";    # Base64-like string > 50 chars before dot
  threshold:type threshold,track by_src,count 10,seconds 60;
  sid:1000010; rev:1;
  classtype:policy-violation;
)

# ─── LLMNR POISONING DETECTION ───────────────────────────────────────────────
alert udp any any -> 224.0.0.252 5355 (
  msg:"LLMNR Query Detected - Potential for Poisoning";
  sid:1000011; rev:1;
  classtype:policy-violation;
)
```

### Suricata — Differences and Setup

Suricata is a modern IDS/IPS that supports:
- **Multi-threading**: Utilises all CPU cores (Snort is single-threaded)
- **Snort rule compatibility**: Most Snort rules work in Suricata
- **Protocol identification**: Identifies protocols regardless of port (like NGFW App-ID, but for IDS)
- **File extraction**: Automatically extracts files from HTTP/FTP/SMTP for analysis
- **Lua scripting**: Custom detection logic in Lua

```bash
# Install Suricata (Debian/Ubuntu)
apt install suricata

# Configure interface in /etc/suricata/suricata.yaml
# af-packet:
#   - interface: eth0

# Update rules (uses Emerging Threats ruleset)
suricata-update

# Run in IDS mode (passive)
suricata -c /etc/suricata/suricata.yaml -i eth0

# Run against pcap file
suricata -r /tmp/capture.pcap -l /tmp/suricata-output/

# IPS mode (inline via NFQUEUE)
iptables -I FORWARD -j NFQUEUE --queue-num 0
suricata -c /etc/suricata/suricata.yaml -q 0   # -q = NFQUEUE mode

# View alerts
tail -f /var/log/suricata/fast.log             # Fast log (one line per alert)
cat /var/log/suricata/eve.json | jq '.'        # JSON event log (full detail)
cat /var/log/suricata/eve.json | jq 'select(.event_type=="alert")' | head
```

**Suricata-specific rule keywords**:
```suricata
# Protocol identification (not just port-based)
alert http any any -> any any (msg:"HTTP traffic on non-standard port"; sid:2000001;)
alert ssh any any -> any !22 (msg:"SSH on non-standard port"; sid:2000002;)
alert tls any any -> any !443 (msg:"TLS on non-standard port"; sid:2000003;)

# File extraction rule
alert http any any -> $HOME_NET any (
  msg:"Executable Downloaded";
  filemagic:"PE32 executable";    # Match file type by magic bytes
  filestore;                       # Store the extracted file
  sid:2000004;
)

# JA3 TLS fingerprint (identify client by TLS fingerprint — C2 detection)
alert tls any any -> any any (
  msg:"Known Cobalt Strike TLS Fingerprint";
  ja3.hash; content:"72a589da586844d7f0818ce684948eea";   # CS default JA3
  sid:2000005;
)
```

---

## 9. Performance Baselining — iperf3, mtr, pathping

### iperf3 — Bandwidth Testing

iperf3 measures achievable bandwidth between two points. Essential for baselining links, identifying bottlenecks, and verifying QoS.

```bash
# ─── SERVER SIDE ─────────────────────────────────────────────────────────────
iperf3 -s                        # Listen on default port 5201
iperf3 -s -p 9999                # Custom port
iperf3 -s -D                     # Daemonise (background)
iperf3 -s -1                     # Accept single connection then exit

# ─── CLIENT SIDE ─────────────────────────────────────────────────────────────
iperf3 -c 192.168.1.10                      # Basic TCP test (default 10 seconds)
iperf3 -c 192.168.1.10 -t 30               # 30-second test
iperf3 -c 192.168.1.10 -P 4               # 4 parallel streams (test bonded links)
iperf3 -c 192.168.1.10 -u -b 100M         # UDP test at 100 Mbps target rate
iperf3 -c 192.168.1.10 -R                  # Reverse mode (server sends, client receives)
iperf3 -c 192.168.1.10 --bidir            # Bidirectional simultaneous test
iperf3 -c 192.168.1.10 -n 1G              # Transfer exactly 1 GB
iperf3 -c 192.168.1.10 -J                  # JSON output (for scripting/monitoring)
iperf3 -c 192.168.1.10 -Z                  # Use sendfile() (kernel bypass — less CPU)

# ─── INTERPRETING OUTPUT ─────────────────────────────────────────────────────
# [  5]   0.00-10.00  sec  1.12 GBytes   961 Mbits/sec   0   sender
# [  5]   0.00-10.04  sec  1.12 GBytes   958 Mbits/sec        receiver
#
# 961 Mbps sender / 958 Mbps receiver on a 1 GbE link = near wire rate (good)
# If actual << theoretical: cable issue, duplex mismatch, congestion, QoS shaping

# ─── VoIP QUALITY TEST (UDP — jitter, packet loss) ───────────────────────────
iperf3 -c 192.168.1.10 -u -b 10M -l 160 -t 30
# -u = UDP, -b 10M = 10Mbps target, -l 160 = 160-byte packets (G.711 frame size)
# Output includes: jitter (should be < 20ms for VoIP), packet loss (should be < 1%)
```

### mtr — Traceroute + Ping Combined

mtr (My TraceRoute) continuously sends packets and shows per-hop latency and packet loss in real time.

```bash
# Interactive mode (updates every second)
mtr 8.8.8.8
mtr google.com

# Non-interactive report (run 100 cycles, then show report)
mtr --report --report-cycles 100 8.8.8.8
mtr -rn -c 100 8.8.8.8              # -n = no DNS resolution

# TCP mode (bypass ICMP blocking)
mtr --tcp --port 443 google.com     # Probe via TCP port 443

# UDP mode
mtr --udp 8.8.8.8

# Reading mtr output:
# HOST: Hostname/IP of each hop     Loss%  Snt  Last  Avg  Best  Wrst  StDev
# 1. 192.168.1.1 (gateway)          0.0%   100  1.2   1.1  0.8   2.3   0.3
# 2. 10.10.1.1 (ISP router)         0.0%   100  8.4   8.2  7.9   9.1   0.2
# 3. *** (no response)              100.%  100  ---   ---  ---   ---   ---
# 4. 142.250.200.4                   0.0%   100  12.3  12.1 11.8  13.2  0.2
#
# *** at hop 3 doesn't mean packet loss — that router blocks ICMP TTL-exceeded
# Look at the NEXT hop — if it responds with 0% loss, hop 3 is fine
# Actual loss: if a hop AND all subsequent hops show high loss → problem is at that hop

# Interpreting latency:
# < 5ms within LAN — normal
# < 20ms within same country — normal
# < 100ms transatlantic — normal
# Sudden jump at a specific hop → congestion or suboptimal routing there
```

### pathping (Windows Equivalent)

```cmd
pathping 8.8.8.8 -n          :: -n = no DNS resolution
pathping 8.8.8.8 -p 500      :: Probe interval 500ms
pathping 8.8.8.8 -q 50       :: 50 queries per hop

:: Output (after initial traceroute phase — 25 second analysis per hop):
:: Hop  RTT  Source to Here  This Node/Link
::   0  192.168.1.50
::                               0/100 = 0% loss  [link 0-1]
::   1    1ms  192.168.1.1
::                               0/100 = 0% loss  [link 1-2]
::   2   10ms  10.10.1.1

:: pathping shows loss at each HOP and each LINK separately
:: Loss at a hop = that router is dropping some packets
:: Loss at a link = the link between two hops has packet loss
```

---

## 10. Pentest Lens — Network Monitoring

### Pentest Lens

**Attacker's view**: Network monitoring is your adversary. NetFlow exposes your scanning and lateral movement. IDS signatures alert on your exploit traffic. Zeek logs your every connection. Understanding what defenders see — and how they see it — is essential for operating stealthily.

**What generates IDS/SIEM alerts during a pentest**:
```
Port scanning:           Many SYN packets to many ports in short time
Service enumeration:     Banner grabbing, version probes
Exploit attempts:        Payload content matches signatures
LLMNR poisoning:         Responder generates detectable patterns
Password spraying:       Many failed logons to same account in AD
Kerberoasting:           Many TGS-REQ events (4769) for different SPNs
NTLM relay:              Auth attempts from unexpected sources
Lateral movement:        SMB connections from workstation to workstation
C2 beaconing:            Regular periodic connections to external IP
DNS tunnelling:          Long DNS queries, high query volume
```

**Evasion techniques**:
```bash
# ─── SCAN EVASION ────────────────────────────────────────────────────────────
# Slow scan — below IDS timing thresholds
nmap -T1 --scan-delay 5s 192.168.1.0/24
nmap -T2 -p 22,80,443,3389 192.168.1.0/24    # Fewer ports, slower

# Fragmented packets — bypass simple signature matching
nmap -f --mtu 8 192.168.1.1

# Decoy scan — hide in list of fake sources
nmap -D RND:10 192.168.1.1    # 10 random decoys

# Source port manipulation
nmap --source-port 53 192.168.1.1    # Appear as DNS traffic

# ─── C2 EVASION ──────────────────────────────────────────────────────────────
# Use legitimate-looking domains (DGA alternatives)
# Register domains that look like CDN or cloud providers
# Use cloud provider IPs that appear in legitimate traffic (Azure, AWS, Cloudflare)

# HTTP/S C2 with valid TLS certificate
# Use Let's Encrypt cert — valid cert, trusted by browsers
# Mimics legitimate HTTPS traffic

# Sleep with jitter — avoid regular interval beaconing
# Instead of beacon every 60s: beacon every 60±30s (random jitter)

# ─── LOG EVASION ─────────────────────────────────────────────────────────────
# On Windows: clear event logs (will generate event 1102 — itself logged)
wevtutil cl Security
wevtutil cl System
# Instead: selectively delete specific event IDs rather than clear all
# Or: use techniques that don't generate logs (LSASS dump via direct syscalls)

# AMSI bypass — avoid PowerShell script block logging detection
# Various techniques: reflection, obfuscation, patching AMSI in memory
# These are frequently updated — check github.com/S3cur3Th1sSh1t/Amsi-Bypass-Powershell

# ─── STAYING UNDER THRESHOLD ──────────────────────────────────────────────────
# Kerberoasting: request tickets one at a time, spaced out
# Don't request 50 SPNs in 30 seconds — this triggers immediate alerts
# Request 1 per 5-10 minutes if operational security is critical

# NTLM relay: target one host at a time
# Don't relay to all hosts simultaneously — lateral movement velocity is a detection signal

# Lateral movement: move sequentially, not in parallel
# Compromise host A → enumerate → move to host B → enumerate → move to C
# NOT: compromise A, immediately scan entire /24 for open SMB
```

**Testing your own monitoring** (blue team / purple team):
```bash
# Verify IDS alerts fire correctly
# Use known-bad signatures against your own infrastructure:

# Nmap scan your network — does IDS alert?
nmap -sS 192.168.1.0/24

# Start Responder against your own network — does SIEM alert on LLMNR?
responder -I eth0 -A    # -A = analyse mode (no actual poisoning)

# Check if DNS tunnelling traffic is detected
# Use iodine in test mode against your own infrastructure

# Verify NetFlow is collecting correctly
nfdump -r /var/log/netflow -s record/bytes -n 10
# Should show your test traffic

# Check Zeek dns.log during a test for long queries
echo -n "AAAA" | base64 | sed 's/=//g' | tr '+/' '-_'
dig $(cat /dev/urandom | tr -dc 'a-z0-9' | head -c 50).test.internal @your-dns-server
# Should appear in dns.log with long query — verify Zeek alert fires
```

---

## Quick Reference — Module 6

### NetFlow Export Ports
| Protocol | Port | Transport |
|----------|------|-----------|
| NetFlow v5/v9 | 9995 (configurable) | UDP |
| IPFIX | 4739 | UDP/TCP |
| sFlow | 6343 | UDP |

### Syslog Severity Levels
| Level | Number | Keyword |
|-------|--------|---------|
| Emergency | 0 | emerg |
| Alert | 1 | alert |
| Critical | 2 | crit |
| Error | 3 | err |
| Warning | 4 | warning |
| Notice | 5 | notice |
| Info | 6 | info |
| Debug | 7 | debug |

### Wireshark Quick Filters
```
tcp.flags.syn==1 && tcp.flags.ack==0    # New connections
http.request.method=="POST"              # Form submissions
arp.duplicate-address-detected           # ARP spoofing
dns.qry.name contains "."               # DNS queries
tcp.analysis.retransmission             # Packet loss indicator
ip.addr == 192.168.1.10                 # Traffic to/from host
tls.handshake.type == 1                 # TLS ClientHello
```

### tcpdump One-Liners
```bash
tcpdump -i eth0 -nn -s0 -w out.pcap            # Capture everything
tcpdump -i eth0 -A -nn port 80                  # HTTP cleartext
tcpdump -i eth0 -nn 'tcp[13] & 2 != 0'         # SYN packets
tcpdump -r file.pcap -nn host 1.2.3.4          # Filter from file
tcpdump -i eth0 -A port 21 | grep -E 'USER|PASS'  # FTP creds
```

### Zeek Key Log Files
| Log | What to Hunt |
|-----|-------------|
| conn.log | Large transfers, beaconing, scan patterns |
| dns.log | Long queries (tunnelling), DGA domains |
| http.log | Malicious URIs, unusual user agents |
| ssl.log | Self-signed certs, unusual SNI, JA3 hashes |
| ntlm.log | Failed auth (spray), NTLM where Kerberos expected |
| kerberos.log | Many TGS-REQ (Kerberoasting), RC4 downgrade |
| smb_files.log | Mass file access (ransomware), unusual SMB paths |

### Snort Rule Template
```snort
alert [proto] [src] [sport] -> [dst] [dport] (
  msg:"Description";
  content:"match string"; nocase;
  flow:to_server,established;
  threshold:type limit,track by_src,count 1,seconds 60;
  classtype:web-application-attack;
  sid:1000001; rev:1;
)
```

### iperf3 Quick Reference
```bash
iperf3 -s                           # Start server
iperf3 -c <server>                  # Basic TCP test
iperf3 -c <server> -u -b 100M      # UDP at 100 Mbps
iperf3 -c <server> -P 4            # 4 parallel streams
iperf3 -c <server> -R              # Reverse direction
iperf3 -c <server> --bidir         # Bidirectional
```

---

## Related Notes
- [[Module-04-Network-Security]] — CIA Triad, attack categories that monitoring detects
- [[Module-05-Firewall-Configuration]] — Firewall logs fed to SIEM
- [[Module-03-Protocols-Deep-Dive]] — Protocol knowledge needed to interpret Zeek/Wireshark
- [[Module-07-Windows-Server-Networking]] — Critical Windows Event IDs for SIEM
- [[Module-11-Tools-Reference]] — Nmap, Wireshark, tcpdump full tool reference
- [[Module-12-Pentest-Perspective]] — Evasion of monitoring during engagements
