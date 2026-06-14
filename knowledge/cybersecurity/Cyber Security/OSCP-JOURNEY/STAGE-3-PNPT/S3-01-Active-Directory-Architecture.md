---
tags: [oscp-journey, spectre, stage-3, pnpt, active-directory, ad-fundamentals]
module: 3
cert-stage: pnpt
difficulty: intermediate
date: 2026-04-10
phantom-refs: ["PHANTOM/MODULE 4 — Active Directory/04.1 — AD Fundamentals"]
netgod-refs: []
---

# S3-01 — Active Directory Architecture (Foundation)

> [!info] Relationship to PHANTOM
> Full AD fundamentals exist in [[PHANTOM/MODULE 4 — Active Directory/04.1 — AD Fundamentals]]. This note adds PNPT and OSCP exam context, the attacker's mental model of AD, and the specific architectural knowledge you need before touching any AD attack tool.

---

## Why Active Directory Is the Primary OSCP and PNPT Target

Active Directory is Microsoft's centralised identity and access management system. It is deployed in virtually every enterprise environment with more than 50 machines. The OSCP exam allocates **40 points** to a single AD set (Client → Server → DC) — the largest single scoring block on the exam. The PNPT exam is built almost entirely around AD.

**The attacker's reason AD is valuable:**
One set of credentials (a Domain Admin account) gives you administrative access to every machine in the domain. There is no need to compromise each machine individually. A single credential compromise cascades to total domain control. This is why AD is the primary target in real-world attacks and why certifications test it so heavily.

---

## Core Concepts — What AD Actually Is

### Domain vs Workgroup

| | Workgroup | Domain |
|--|-----------|--------|
| Authentication | Local accounts on each machine | Centralised through Domain Controller |
| Management | Each machine managed individually | Centralised Group Policy |
| Scale | 2–15 machines | 15 to hundreds of thousands |
| Typical use | Home/small office | All enterprises |

In a workgroup, each machine has its own SAM database. You compromise one machine = access to that machine only. In a domain, the DC holds the database. Compromise the DC = access to everything.

### Forest, Tree, and Domain — The Hierarchy

```
Forest: contoso.com
├── Tree: contoso.com (root domain)
│   ├── Domain: contoso.com
│   │   ├── OU: Departments
│   │   │   ├── OU: IT
│   │   │   ├── OU: Finance
│   │   │   └── OU: HR
│   │   ├── Users, Groups, Computers
│   │   └── GPOs
│   └── Child Domain: uk.contoso.com
└── Tree: fabrikam.com (separate tree, same forest)
```

**Forest** — the top-level security boundary. All domains in a forest share the same schema (object definitions) and global catalog. Trust relationships within a forest are automatic and transitive.

**Tree** — one or more domains with contiguous DNS namespaces (e.g., `contoso.com` and `uk.contoso.com`).

**Domain** — the core administrative unit. Has its own domain controllers, users, groups, computers, and policies. The fundamental unit you'll attack.

**OU (Organisational Unit)** — a container within a domain for organising objects. GPOs are applied to OUs. OUs do not cross domain boundaries.

> [!info] Attacker perspective on forest vs domain
> The forest is a security boundary — by default, you cannot directly escalate from domain A to domain B even in the same forest. However, forest trusts have been abused historically (SID history attacks, trust ticket forging). For OSCP, focus on dominating a single domain. For CPTS, inter-domain and inter-forest attacks matter.

---

## The Domain Controller

The Domain Controller (DC) is the most critical machine in an AD environment. It runs Active Directory Domain Services (AD DS) and handles:

- **Authentication** — validates every login in the domain (Kerberos and NTLM)
- **Authorisation** — checks what a user is allowed to do
- **Directory services** — stores all AD objects (users, groups, computers, GPOs)
- **DNS** — AD-integrated DNS for domain name resolution
- **Replication** — in multi-DC environments, DCs sync with each other

**Critical ports on a Domain Controller:**

| Port | Protocol | Service | Pentest Relevance |
|------|----------|---------|------------------|
| 53 | TCP/UDP | DNS | Zone transfers, hostname enumeration |
| 88 | TCP/UDP | Kerberos | AS-REP roasting, Kerberoasting, ticket attacks |
| 135 | TCP | MSRPC | DCSync, WMI |
| 139 | TCP | NetBIOS | SMB over NetBIOS |
| 389 | TCP | LDAP | Domain enumeration (users, groups, computers) |
| 445 | TCP | SMB | Null sessions, relay attacks, SYSVOL/NETLOGON |
| 464 | TCP/UDP | Kerberos password change | |
| 636 | TCP | LDAPS | Encrypted LDAP |
| 3268 | TCP | Global Catalog LDAP | Forest-wide user search |
| 3269 | TCP | Global Catalog LDAPS | Encrypted GC |
| 5985 | TCP | WinRM | Remote management (evil-winrm) |
| 9389 | TCP | AD Web Services | PowerShell AD module |

> [!tip] MUSCLE MEMORY — DC identification
> When you see ports 88 (Kerberos), 389 (LDAP), 3268 (Global Catalog), and 53 (DNS) all open on the same machine — that's your Domain Controller. Nmap `-sC` will also add the domain name to the output via LDAP banner.

---

## SYSVOL and NETLOGON — Why They Matter

Every domain member can read two SMB shares on the DC:

**SYSVOL** (`\\DC\SYSVOL`) — stores:
- Group Policy Objects (GPO files)
- Logon/logoff scripts
- **GPP (Group Policy Preferences) XML files** — historically stored encrypted passwords with a known static decryption key (MS14-025 patch, but old files persist)

**NETLOGON** (`\\DC\NETLOGON`) — stores:
- Logon scripts
- Sometimes contains batch files or scripts with hardcoded credentials

```bash
# Enumerate SYSVOL for GPP passwords:
smbclient //DC_IP/SYSVOL -U domain/user%pass
find . -name "Groups.xml"     # Inside smbclient

# Or with CrackMapExec:
crackmapexec smb DC_IP -u user -p pass -M gpp_password
crackmapexec smb DC_IP -u user -p pass -M gpp_autologin

# Decrypt a found cPassword:
gpp-decrypt "ENCRYPTED_cPassword_VALUE"
```

---

## AD Objects — Users, Groups, Computers, OUs, GPOs

### Users

Every person or service in the domain has a user object. Key attributes:
- `sAMAccountName` — the login name (e.g., `jsmith`)
- `userPrincipalName` — UPN format (e.g., `jsmith@contoso.com`)
- `memberOf` — which groups the user belongs to
- `servicePrincipalName` (SPN) — if set, marks the account as a service account → **Kerberoastable**
- `userAccountControl` — flags including whether pre-authentication is required → **AS-REP Roastable** if disabled

### Groups

Groups can contain users, computers, or other groups. Types:

| Type | Scope | Can contain | Used for |
|------|-------|------------|---------|
| Global | Domain-wide | Users from same domain | Organising users |
| Domain Local | Local to domain | Users from any domain | Assigning permissions |
| Universal | Forest-wide | Users from any domain | Cross-domain permissions |

**Critical built-in groups for attackers:**

| Group | What membership grants |
|-------|----------------------|
| **Domain Admins** | Full control of the domain — this is the target |
| **Enterprise Admins** | Control over entire forest — only in forest root domain |
| **Schema Admins** | Can modify the AD schema |
| **Administrators** | Local admin on the DC |
| **Account Operators** | Can create/modify most user accounts |
| **Backup Operators** | Can log on to DCs and back up files — potential DC access |
| **Server Operators** | Can start services and log on locally to DCs |
| **Group Policy Creator Owners** | Can create GPOs — can be used for lateral movement |
| **DNSAdmins** | Can load arbitrary DLL into DNS service → SYSTEM on DC |

### Computers

Every domain-joined machine has a computer account (ends with `$`, e.g., `WORKSTATION1$`). Computer accounts:
- Have passwords (auto-rotated every 30 days)
- Can authenticate to the domain like users
- Are targets for machine account attacks (RBCD, MachineAccountQuota)

### GPOs — Group Policy Objects

GPOs are policy configurations applied to OUs. They control:
- Password policies (length, complexity, lockout)
- Software deployment
- Startup/shutdown scripts
- Security settings
- **Writable GPO = code execution on all machines in the OU** — critical attack path (covered in S3-08)

---

## Trusts — One-Way, Two-Way, Transitive, Forest

Trust relationships allow users from one domain to authenticate to resources in another.

**One-way trust:**
```
Domain A → trusts → Domain B
Users in B can access resources in A
Users in A CANNOT access resources in B
```

**Two-way trust:**
```
Domain A ↔ Domain B
Both directions — users from either domain can access resources in the other
```

**Transitive trust:**
If A trusts B, and B trusts C → A implicitly trusts C. All trusts within a forest are transitive.

**Forest trust:**
Explicitly created between two forests. Not automatic. Can be one-way or two-way. Enables cross-forest resource access.

> [!info] Trust attacks (CPTS territory)
> If you compromise Domain A in a forest, and there's a forest trust to Domain B, SID history injection or trust ticket forging can sometimes escalate to Domain B. For OSCP, focus on dominating a single domain — trust attacks are CPTS-level content.

---

## Authentication Protocols — NTLM vs Kerberos

Understanding these at a conceptual level is mandatory. Every attack in AD exploits one of these protocols.

### NTLM Authentication

Used when Kerberos fails (no DC available, IP address used instead of hostname, legacy systems).

**The challenge-response flow:**
```
1. Client → Server:  "I want to authenticate as user X"
2. Server → Client:  "Here is a random challenge value (nonce)"
3. Client → Server:  "Here is the challenge encrypted with NTLM hash of X's password"
4. Server → DC:      "Verify this authentication"
5. DC → Server:      "Valid" or "Invalid"
```

**What attackers capture:** Step 3 — the encrypted challenge+response (NTLMv2 hash). This is what Responder captures and what you crack with hashcat `-m 5600`.

**What attackers relay:** Instead of cracking, forward step 3 to a different server to authenticate as the victim. This is the SMB relay attack.

**NTLM weaknesses exploited:**
- Captured NTLMv2 hash → hashcat crack → cleartext password
- Relay captured NTLMv2 to other services → authenticate without cracking
- Pass-the-Hash: reuse NTLM hash directly (no cleartext needed)

### Kerberos Authentication

The default protocol for domain-joined machines communicating with AD resources. Port 88.

**The ticket-based flow:**
```
1. Client → DC (AS-REQ):  "Give me a TGT" (with timestamp encrypted with user's hash)
2. DC → Client (AS-REP):  "Here is your TGT" (encrypted with krbtgt hash)
3. Client → DC (TGS-REQ): "I need a ticket for Service X" (presents TGT)
4. DC → Client (TGS-REP): "Here is your Service Ticket" (encrypted with service account hash)
5. Client → Service:       Presents service ticket to access the resource
```

**Key Kerberos objects:**
- **TGT (Ticket Granting Ticket)** — proof you authenticated. Valid for 10 hours by default. Issued by the Authentication Server (AS). Encrypted with the **krbtgt** account's hash.
- **TGS (Ticket Granting Service) / Service Ticket** — allows access to a specific service. Encrypted with the **service account's** NTLM hash.
- **krbtgt** — a special domain account whose hash encrypts all TGTs. Compromise this hash = Golden Ticket = permanent domain access.

**Kerberos weaknesses exploited:**
- **AS-REP Roasting:** If pre-auth is disabled, request a TGT for a user without knowing their password → crack the encrypted portion offline
- **Kerberoasting:** Request a TGS for any SPN → get service ticket encrypted with service account hash → crack offline
- **Pass-the-Ticket:** Steal a valid TGT or TGS → present it to authenticate as the victim
- **Golden Ticket:** Forge a TGT using the krbtgt hash → authenticate as any user to any service, forever
- **Silver Ticket:** Forge a TGS using a service account hash → access a specific service without touching the DC (stealthy)
- **Overpass-the-Hash:** Convert an NTLM hash into a Kerberos TGT

---

## Why AD Is Attacked — The Attacker's Mental Model

```
Foothold on any domain machine
         ↓
Enumerate AD — find attack paths (BloodHound)
         ↓
┌────────────────────────────────────┐
│  Path 1: Credential attacks        │
│  - Password spray → valid user     │
│  - AS-REP roast → crack hash       │
│  - Kerberoast → crack hash         │
│  - LLMNR/NBT-NS → capture NTLMv2  │
│  - Relay NTLMv2 → shell            │
└────────────────────────────────────┘
         ↓
Escalate to high-value user or DA
         ↓
┌────────────────────────────────────┐
│  Domain Dominance                  │
│  - DCSync → all hashes             │
│  - Golden Ticket → permanent DA    │
│  - NTDS.dit dump → offline crack   │
└────────────────────────────────────┘
         ↓
Lateral movement to every machine in the domain
(Pass-the-Hash, Pass-the-Ticket, WMI, PSExec)
```

The key insight: **you don't need to break every machine individually**. Find the path to Domain Admin, achieve it once, and the entire domain is yours.

---

## The OSCP AD Set — 40 Points, All-or-Nothing

The OSCP AD set consists of three machines:
1. **Client** — externally reachable, initial foothold machine
2. **Server** — internal, reached after compromising Client
3. **Domain Controller** — the final target

**Critical rule:** The AD set is scored all-or-nothing. You receive 40 points only if you compromise all three machines and submit valid proof from each. Partial credit (e.g., compromising just Client and Server) = 0 AD points.

**This means:**
- The AD set should be your first priority
- 40 points is the difference between pass and fail
- Time box: if you have 2 hours on the AD set and haven't found a foothold, stop and do standalones, then return

**Typical OSCP AD kill chain:**
```
1. Enumerate Client (Nmap, web services, SMB)
2. Exploit Client service → foothold as low-priv user
3. PrivEsc on Client → local admin or SYSTEM
4. Enumerate domain (BloodHound, PowerView, CME)
5. Find attack path (spray, AS-REP roast, Kerberoast, ACL abuse)
6. Escalate to domain user with path to DA
7. Follow BloodHound path to Domain Admin
8. DCSync or PTH to Server and DC
9. Collect proof from all three machines
```

---

## Quick Reference

| Concept | Key Detail |
|---------|-----------|
| DC ports | 53, 88, 135, 389, 445, 636, 3268, 5985 |
| Domain Admin group | Target of every AD attack |
| NTLM capture | Responder + hashcat -m 5600 |
| Kerberos TGT | Encrypted with krbtgt hash |
| Kerberos TGS | Encrypted with service account hash |
| krbtgt hash | Enables Golden Ticket (permanent domain access) |
| SYSVOL | Check for GPP passwords (gpp-decrypt) |
| NETLOGON | Check for scripts with hardcoded creds |
| SPN set on user | Kerberoastable |
| Pre-auth disabled | AS-REP Roastable |
| OSCP AD points | 40 — all-or-nothing |

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| TryHackMe — "Active Directory Basics" | Interactive AD architecture introduction |
| TryHackMe — "Attacktive Directory" | First full AD attack chain lab |
| HTB — Forest | AS-REP roasting → DCSync → full domain |
| HTB — Active | Kerberoasting → DA → full domain |
| HTB — Resolute | Password spraying → winrm → DnsAdmins → SYSTEM |
| TCM Security — Practical Ethical Hacking | AD section is the foundation for PNPT |
| BloodHound documentation | Understanding attack paths before you need to find them |
| [[PHANTOM/MODULE 4 — Active Directory/04.1 — AD Fundamentals]] | Full technical depth in PHANTOM vault |
---
tags: [oscp-journey, spectre, stage-3, pnpt, active-directory, ad-fundamentals]
module: 3
cert-stage: pnpt
difficulty: intermediate
date: 2026-04-08
phantom-refs: ["PHANTOM/MODULE 4 — Active Directory/04.1 — AD Fundamentals"]
netgod-refs: []
---

# S3-01 — Active Directory Architecture (Foundation)

> [!info] Relationship to PHANTOM
> Full AD fundamentals exist in [[PHANTOM/MODULE 4 — Active Directory/04.1 — AD Fundamentals]]. This note adds the PNPT and OSCP exam context — what you need to understand to execute the full AD kill chain, what's tested in each cert, and how the architecture maps to attack paths.

---

## What Active Directory Is and Why Every Enterprise Uses It

Active Directory (AD) is Microsoft's directory service — a centralised system for managing users, computers, groups, policies, and authentication across a Windows network. It was introduced in Windows 2000 and is present in virtually every organisation with more than a handful of Windows machines.

**Why enterprises use it:**
- Single sign-on: one username/password works across all company resources
- Centralised management: IT can push policies to thousands of machines simultaneously
- Access control: fine-grained control over who can access what
- Authentication: Kerberos-based authentication built in

**Why attackers love it:**
- One compromised admin account = full control of every machine in the domain
- The authentication system (NTLM, Kerberos) has well-documented weaknesses
- Default configurations leave significant attack surface
- Lateral movement is trivial once inside — credentials work everywhere
- The OSCP AD set is 40 points — the single highest-value target on the exam

---

## Core Terminology — You Must Know These Cold

### Domain

A domain is the fundamental organisational unit of Active Directory. It has:
- A name (e.g., `eurostop.local`, `corp.company.com`)
- A Domain Controller that manages it
- All users, computers, and groups that belong to it

Every object in a domain is identified by a Distinguished Name (DN):
```
CN=John Smith,OU=Users,DC=eurostop,DC=local
```
- `CN` = Common Name (the object's name)
- `OU` = Organisational Unit (folder/container)
- `DC` = Domain Component (each part of the domain name)

### Domain Controller (DC)

The server running Active Directory Domain Services (AD DS). It is the authority for the domain — it stores the directory database (`NTDS.dit`), handles authentication, enforces Group Policy, and replicates changes to other DCs.

**Attack relevance:** The DC is the crown jewel. Compromising the DC means:
- You have every domain user's credentials (NTDS.dit contains all hashes)
- You can forge authentication tickets (Golden Ticket with krbtgt hash)
- You control every machine in the domain

### Workgroup vs Domain

| Workgroup | Domain |
|-----------|--------|
| Each machine manages its own accounts | Central DC manages all accounts |
| No single sign-on | SSO across all domain machines |
| Max ~10–20 machines practical | Scales to tens of thousands |
| Peer-to-peer | Centralised |

OSCP standalone Windows machines are often in workgroups. The AD set is always a domain.

### Forest

A forest is a collection of one or more domains that share a common schema, configuration, and Global Catalog. The first domain created is the **forest root domain**.

```
forest: company.com
├── company.com (forest root)
├── europe.company.com
└── asia.company.com
```

All domains in a forest trust each other (two-way transitive trust by default).

### Tree

A tree is a hierarchy of domains sharing a contiguous namespace:
```
company.com
├── europe.company.com
└── asia.company.com
    └── japan.asia.company.com
```

### Organisational Units (OUs)

OUs are containers within a domain used to organise objects (users, computers, groups). They're used to:
- Apply Group Policy to a specific subset of users/computers
- Delegate administrative control for a department
- Organise objects logically

OUs do NOT grant permissions — they're just containers for organisation.

### Trusts

Trusts allow users in one domain to authenticate to resources in another domain.

| Trust Type | Direction | Transitive? | What it Means |
|-----------|-----------|------------|---------------|
| Parent-child | Two-way | Yes | Automatic within a tree |
| Tree-root | Two-way | Yes | Between tree roots in a forest |
| Forest | Two-way or one-way | Yes/No | Between forests |
| External | One-way or two-way | No | To domains outside the forest |
| Shortcut | One-way or two-way | Yes | Optimise authentication paths |

**Attack relevance:** A trust between two domains means credentials from Domain A may work in Domain B. If you compromise Domain A, try to leverage trust to move to Domain B.

---

## Key Ports — Memorise These

When you Nmap a domain controller, these ports will be open:

| Port | Protocol | Service | Purpose |
|------|----------|---------|---------|
| 53 | TCP/UDP | DNS | AD relies on DNS for service discovery |
| 88 | TCP/UDP | Kerberos | Authentication — the beating heart of AD |
| 135 | TCP | RPC | Windows RPC endpoint mapper |
| 139 | TCP | NetBIOS | Legacy SMB |
| 389 | TCP/UDP | LDAP | Directory queries (unencrypted) |
| 445 | TCP | SMB | File sharing, authentication |
| 464 | TCP/UDP | Kpasswd | Kerberos password change |
| 636 | TCP | LDAPS | LDAP over TLS |
| 593 | TCP | RPC over HTTP | RPC endpoint mapper over HTTP |
| 3268 | TCP | Global Catalog | LDAP queries to GC (forest-wide search) |
| 3269 | TCP | Global Catalog TLS | LDAP to GC over TLS |
| 5985 | TCP | WinRM | Remote PowerShell management |
| 9389 | TCP | AD Web Services | AD Administrative Center |
| 3389 | TCP | RDP | Remote Desktop |

**Identifying a DC from Nmap output:** Port 88 (Kerberos) and port 389 (LDAP) running together = almost certainly a Domain Controller.

---

## Key Shares — SYSVOL and NETLOGON

Every DC exposes two critical SMB shares:

**SYSVOL (`\\DC\SYSVOL`):**
- Contains Group Policy Objects (GPOs) and scripts
- Replicated to ALL domain controllers
- Readable by all authenticated domain users
- **Attack relevance:** GPP passwords stored here (pre-MS14-025), startup scripts with hardcoded credentials, policy files revealing domain configuration

**NETLOGON (`\\DC\NETLOGON`):**
- Contains logon scripts
- Readable by all authenticated domain users
- **Attack relevance:** Logon scripts sometimes contain hardcoded credentials or UNC paths revealing network topology

```bash
# Enumerate both shares:
smbclient //DC_IP/SYSVOL -U domain/user%pass
smbclient //DC_IP/NETLOGON -U domain/user%pass

# With CrackMapExec:
crackmapexec smb DC_IP -u user -p pass --shares
crackmapexec smb DC_IP -u user -p pass -M spider_plus --share SYSVOL
```

---

## AD Objects — Users, Groups, Computers, GPOs

### Users

User objects represent people (and service accounts). Key attributes:
- `sAMAccountName` — the username used for login (e.g., `jsmith`)
- `UserPrincipalName` (UPN) — email-format login (e.g., `jsmith@eurostop.local`)
- `memberOf` — what groups the user belongs to
- `servicePrincipalName` (SPN) — set on service accounts → Kerberoastable
- `userAccountControl` — flags including: disabled, password never expires, don't require preauth (→ AS-REP Roastable)

### Groups

Two types matter for security:

**Security Groups** — used for access control (file permissions, resource access):
- `Domain Admins` — full control of the domain
- `Enterprise Admins` — full control of the forest
- `Schema Admins` — can modify the AD schema
- `Backup Operators` — can log on to DCs, read all files
- `Server Operators` — can manage DC services
- `Account Operators` — can manage most user and group accounts
- `Domain Users` — all domain users (default group)
- `Domain Computers` — all domain-joined machines

**Distribution Groups** — for email distribution only (no security relevance)

**Attack relevance:** Check every user's group memberships. A user in `Backup Operators` can dump the DC's SAM database. A user in `Account Operators` can add members to many groups.

### Computers

Computer objects represent domain-joined machines. Every computer has:
- A machine account: `MACHINENAME$` (note the `$`)
- A machine account password (auto-rotated every 30 days)
- Group memberships

**Attack relevance:** Machine accounts sometimes have excessive privileges. Compromising a machine account can enable Kerberos attacks.

### Group Policy Objects (GPOs)

GPOs are sets of configuration rules applied to OUs, sites, or the entire domain. They enforce:
- Password policies (minimum length, complexity, lockout threshold)
- Software deployments
- Security settings (firewall rules, drive encryption)
- Startup/logon scripts

**Attack relevance:**
- GPP passwords (pre-MS14-025): credentials stored in SYSVOL GPP XML files
- Misconfigured GPOs with writable script paths
- GPOs that apply to DCs with insecure settings

---

## Authentication Protocols — NTLM vs Kerberos

Understanding both is essential for understanding the attacks in S3-02 through S3-09.

### NTLM Authentication

NTLM (NT LAN Manager) is the older, challenge-response authentication protocol. Still used for:
- Authentication to IP addresses (not hostnames)
- Authentication when Kerberos fails
- Workgroup authentication
- Cross-forest authentication to non-Kerberos services

**NTLM flow:**
```
1. Client → Server: NEGOTIATE (I want to authenticate)
2. Server → Client: CHALLENGE (here's a random nonce: XXXX)
3. Client → Server: AUTHENTICATE (here's my username + NTLM_HASH(password + XXXX))
```

The NTLM hash is derived from the user's password. The server sends it to the DC to verify.

**Attack relevance:**
- NTLM hashes can be captured (Responder, network capture)
- Captured hashes can be cracked (hashcat -m 5600 for NTLMv2)
- Captured hashes can be relayed (SMB Relay attack — no cracking needed)
- NTLM hashes can be used for Pass-the-Hash directly

### Kerberos Authentication

Kerberos is the default authentication protocol in AD. It uses tickets instead of passwords.

**Key components:**
- **KDC (Key Distribution Centre)** — runs on the DC, issues tickets
- **TGT (Ticket Granting Ticket)** — proves your identity, encrypted with krbtgt hash
- **TGS (Ticket Granting Service)** — authorises access to a specific service, encrypted with service account's hash
- **SPN (Service Principal Name)** — identifier for a service instance (e.g., `HTTP/webserver.domain.local`)

**Kerberos flow (simplified):**
```
1. User → KDC: AS-REQ (send me a TGT, my username is jsmith)
2. KDC → User: AS-REP (here's your TGT, encrypted with krbtgt hash)
   → If pre-authentication is disabled: KDC sends TGT without verifying identity
   → AS-REP Roasting exploits this

3. User → KDC: TGS-REQ (send me a TGS for HTTP/webserver, here's my TGT)
4. KDC → User: TGS-REP (here's your TGS, encrypted with webserver service account's hash)
   → Kerberoasting: request TGS for any SPN, crack the service account hash offline

5. User → Service: AP-REQ (here's my TGS for you)
6. Service → User: Access granted (or denied)
```

**Attack relevance:**
- **AS-REP Roasting:** accounts with pre-auth disabled → get encrypted TGT → crack offline → no credentials needed
- **Kerberoasting:** any authenticated user can request TGS for any SPN → crack service account hash offline
- **Pass-the-Ticket:** steal a TGT/TGS → use it without knowing the password
- **Golden Ticket:** forge a TGT using the krbtgt hash → unlimited access forever
- **Silver Ticket:** forge a TGS using a service account hash → access specific service without DC contact

---

## The AD Kill Chain — How Attacks Flow

This is the full attack path from zero credentials to Domain Admin. Each step in this chain is covered in its own note (S3-02 through S3-09).

```
Step 1 — Initial Access (no credentials)
├── LLMNR/NBT-NS Poisoning → capture NTLMv2 hash → crack → credentials
├── SMB Relay → relay NTLMv2 → instant access without cracking
├── IPv6 + DHCPv6 attack → DNS takeover → credential capture
└── Web application exploitation → shell as service account

Step 2 — Enumeration (with any domain user credentials)
├── BloodHound collection → attack path visualisation
├── PowerView enumeration → users, groups, SPNs, ACLs
└── LDAP queries → full directory dump

Step 3 — Privilege Attacks (with any domain user credentials)
├── AS-REP Roasting → accounts without pre-auth → hash → crack
├── Kerberoasting → service account TGS → hash → crack
├── Password spraying → low-lockout brute force across all accounts
└── ACL abuse → GenericAll/GenericWrite/WriteDACL exploitation

Step 4 — Lateral Movement (with gained credentials)
├── Pass-the-Hash → use NTLM hash to authenticate
├── Pass-the-Ticket → use stolen Kerberos ticket
└── Credential reuse → try found passwords on all services/machines

Step 5 — Domain Dominance (with Domain Admin or equivalent)
├── DCSync → secretsdump → all domain hashes
├── Golden Ticket → forge TGT with krbtgt hash → permanent access
└── Silver Ticket → forge TGS for specific service
```

---

## OSCP AD Set — How It Mirrors the Kill Chain

The OSCP AD set consists of three machines worth 40 points total (all-or-nothing — you need all three or you get none):

```
[Client Machine]         → Get foothold via web or service vulnerability
        ↓
[Windows Server]         → Lateral move using credentials from Client
        ↓
[Domain Controller]      → PrivEsc to DA, collect proof
```

**The 40 points are all-or-nothing:** If you root the Client and Server but not the DC, you get 0 points for the AD set. This changes your time strategy significantly — the AD set requires complete compromise or it's worthless.

**OSCP AD typical attack path:**
1. Compromise Client via web vulnerability or credential reuse
2. Enumerate domain from Client (BloodHound, PowerView)
3. Find attack path to Server (Kerberoasting or ACL abuse is common)
4. Compromise Server → find DA credentials or path
5. DCSync or psexec → root the DC

---

## DNS — How AD Uses It

Active Directory depends entirely on DNS for service discovery. The DC registers SRV records so clients can find services:

```
_ldap._tcp.dc._msdcs.domain.local     → Domain Controllers
_kerberos._tcp.domain.local           → Kerberos servers
_kerberos._udp.domain.local           → Kerberos servers (UDP)
_gc._tcp.domain.local                 → Global Catalog servers
```

**Attack relevance:**
- DNS zone transfers reveal all hostnames in the domain
- Manipulating DNS (mitm6) enables credential capture
- DNS SRV records reveal DC addresses when you only know the domain name

```bash
# Find DCs via DNS:
nslookup -type=SRV _ldap._tcp.dc._msdcs.domain.local DC_IP
dig SRV _ldap._tcp.dc._msdcs.domain.local @DC_IP

# Zone transfer attempt:
dig axfr @DC_IP domain.local
```

---

## Quick Reference — AD Architecture

| Concept | Key Detail |
|---------|-----------|
| Domain | Organisational unit, has one or more DCs |
| Forest | Collection of domains sharing schema |
| DC | Server running AD DS — contains NTDS.dit |
| NTDS.dit | Active Directory database — all user hashes |
| OU | Container for organising objects — not a security boundary |
| GPO | Policy applied to domain/OU — check SYSVOL for credentials |
| SYSVOL | Share on DC readable by all domain users |
| krbtgt | Special account — its hash creates Golden Tickets |
| SPN | Service Principal Name — set on service accounts → Kerberoastable |
| TGT | Ticket Granting Ticket — proves identity, encrypted by krbtgt |
| TGS | Ticket Granting Service — authorises service access |
| DC ports | 53, 88, 135, 389, 445, 636, 3268, 3269, 5985 |
| Domain Admin | Full domain control — the target of the kill chain |

---

## Common Mistakes

> [!warning] AD architecture misunderstandings that lead to wrong attacks
> 1. **Confusing OUs with security boundaries.** OUs are organisational containers — users in one OU can still access resources in another OU. Security is controlled by ACLs and group memberships, not OU placement.
> 2. **Thinking Domain Admin = highest privilege.** Enterprise Admin (forest-wide) is higher. Also, SYSTEM on any machine bypasses domain admin for local actions.
> 3. **Not checking both HKLM and HKCU for AlwaysInstallElevated.** Both must be set — checking only one gives a false negative.
> 4. **Ignoring trust relationships.** If two domains trust each other and you compromise one, the other may be accessible. BloodHound shows cross-domain trust attack paths.
> 5. **Not adding hostnames to /etc/hosts.** Kerberos authentication requires you to address machines by hostname (not IP). If you can only reach the DC by IP, Kerberos attacks will fail. Always add: `DC_IP dc01.domain.local domain.local` to `/etc/hosts`.

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| TryHackMe — "Active Directory Basics" room | Interactive AD architecture fundamentals |
| TryHackMe — "Attacktive Directory" | Full AD attack chain guided lab |
| HTB — Forest | Full AD exploitation — AS-REP roasting → DCSync |
| HTB — Active | Kerberoasting → DA in a clean AD environment |
| HTB — Sauna | AS-REP → DCSync chain |
| TCM Security — Practical Ethical Hacking course | The PNPT prep course — AD modules are excellent |
| BloodHound documentation | Understanding attack paths before you try them |
| [[PHANTOM/MODULE 4 — Active Directory/04.1 — AD Fundamentals]] | Full technical depth in PHANTOM vault |
