---
tags: [guardian, grc, module-6, pci-dss, network-segmentation, scope-reduction, firewall, vlan, zero-trust]
module: 6
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G6-04 — Cardholder Data Environment — CDE Scoping", "G6-02 — The 12 PCI DSS Requirements", "G6-06 — The QSA", "G4-04 — Technological Controls — A.8.22 Segregation of Networks"]
---

# G6-05 — Network Segmentation and Scope Reduction

> [!abstract] What This Note Covers
> By the end of this note, you will understand how network segmentation reduces PCI DSS scope, what constitutes adequate segmentation in PCI DSS terms, how to design and validate a segmented CDE network, and the alternative scope reduction strategies that can complement or substitute for segmentation.

---

## Why This Exists

An organisation's network is not inherently secure just because it has a firewall at the perimeter. The vast majority of major payment card breaches — Target, TJX, Heartland Payment Systems, Home Depot — shared a common characteristic: once attackers gained a foothold somewhere in the network, they could move laterally to reach the payment systems. The network was "flat" — or inadequately segmented — so the CDE was reachable from practically anywhere.

Network segmentation addresses this by creating isolated zones. If the CDE is in a properly segmented zone, an attacker who compromises a system outside that zone (the corporate network, an HR workstation, a vendor's remote access) cannot reach the payment systems without passing through controlled access points that require authentication and authorisation.

Segmentation serves two simultaneous purposes: it reduces PCI DSS compliance scope (systems outside the CDE segment are out of scope) and it reduces security risk (the blast radius of a breach outside the CDE is contained).

Understanding how to design, implement, and validate segmentation — and how to test whether segmentation is effective — is a core competency for any GRC professional working with PCI DSS.

---

## What Adequate Segmentation Means in PCI DSS

PCI DSS v4.0 defines network segmentation in its glossary as: *"Achieved through a combination of physical or logical controls, such as network access control technologies (firewalls, access control lists), VLANs, and other technology solutions, or physical separation of specific network components, to restrict access to cardholder data."*

**Adequate segmentation means**: CDE systems cannot be accessed from out-of-scope systems through any means — network-level, application-level, or management access — except through explicitly defined and controlled paths.

**Adequate segmentation requires**:
1. Out-of-scope systems cannot initiate communications with CDE systems (except through controlled interfaces)
2. CDE systems cannot initiate communications with out-of-scope systems that are not required for business purposes
3. The segmentation is enforced by technical controls that cannot be bypassed
4. The segmentation is validated by penetration testing (Requirement 11.4.5)

**What segmentation is NOT**:
- A VLAN without inter-VLAN firewall rules is not segmentation — VLANs provide logical separation but do not prevent traffic if the switch allows VLAN hopping or if the router/Layer 3 switch allows all inter-VLAN traffic
- A firewall with overly permissive rules (allow all from internal to CDE) is not effective segmentation
- A firewall that has been configured correctly but whose rules have drifted over time may no longer provide adequate segmentation

---

## Segmentation Architecture Designs

### Design 1: Dedicated CDE Network Segment (Firewall-Isolated)

The most common approach. The CDE systems (payment terminals, payment servers, databases) are placed on a dedicated network segment. A firewall enforces access controls between the CDE segment and all other segments.

```
INTERNET
    │
    ▼
[Perimeter Firewall]
    │           │
    ▼           ▼
[DMZ]     [Internal Firewall]
              │           │
              ▼           ▼
    [CDE Segment]   [Corporate Network]
    Payment servers  Workstations, email,
    POS systems      HR, Finance systems
    Card database
    
    ← CDE ←    ← Corporate ←    ← DMZ ←
    No access from Corporate to CDE except controlled ports
    No access from CDE to Corporate except authorised returns
```

**Firewall rules for CDE segment:**
- Inbound: Only allow specific ports/protocols required for payment processing (e.g. HTTPS from corporate to payment portal; specific ports from payment processor IP addresses)
- Outbound: Only allow specific required outbound connections (to payment processor, to update servers with specific IPs, to authorised monitoring systems)
- Default deny on all other traffic
- Log all permitted and denied traffic

**What stays in the CDE segment**: Payment terminals (where network-connected), payment servers, cardholder databases, backup systems for CDE data.

**What is out of scope** (with adequate segmentation): Corporate workstations, email servers, HR systems, file servers, Wi-Fi access points used only by employees for general business purposes, guest networks.

### Design 2: Dual-Network Architecture (Physical Separation)

For organisations with very high security requirements, physical separation of the CDE from the rest of the network. CDE systems are connected to a physically separate network infrastructure (dedicated switches, dedicated cables, dedicated ISP connection for payment processing).

This is the most secure approach — there is no logical path between the CDE and the corporate network because there is no physical connection. However, it is expensive and operationally complex.

**Who uses this**: Large retailers with high-volume payment processing, financial institutions processing sensitive payment data, organisations in high-risk sectors (casinos, etc.).

### Design 3: Cloud-Based CDE Isolation

For organisations whose CDE is in the cloud, segmentation is implemented using cloud-native network controls:

- **Virtual Private Cloud (VPC)**: The CDE is in a dedicated VPC with no public internet access except through controlled paths
- **Security Groups / Network ACLs**: Cloud-native firewall controls restrict traffic to/from the CDE VPC
- **VPC Peering with restrictions**: If the corporate cloud environment (also in a VPC) needs to communicate with the CDE VPC, VPC peering with restrictive routing tables and security group rules provides controlled connectivity
- **PrivateLink**: AWS PrivateLink and equivalent services provide private connectivity to managed services without traversing the internet

**Cloud segmentation challenge**: Cloud environments are dynamic — resources can be created that inadvertently create public exposure or cross-VPC connections. Cloud Security Posture Management (CSPM) tools continuously monitor for configuration drift that could compromise segmentation.

### Design 4: Zero Trust Network Architecture (ZTNA)

Modern alternative to traditional network segmentation. Instead of trusting anything on the internal network, every access request is authenticated and authorised regardless of network location.

In a Zero Trust model:
- No implicit trust based on network segment membership
- Every user, device, and application must authenticate and prove authorisation for each resource access
- Micro-segmentation isolates individual workloads, not just network segments
- Access policies are identity-based, not network-topology-based

**PCI DSS and Zero Trust**: ZTNA can satisfy PCI DSS segmentation requirements — PCI DSS v4.0 explicitly acknowledges Zero Trust architectures as an acceptable approach. The key is that the technical controls (identity-based access, continuous authentication, least privilege access to CDE resources) must be demonstrably effective and must be tested.

---

## Segmentation Testing: Penetration Testing Requirement 11.4.5

PCI DSS v4.0 Requirement 11.4.5 mandates:

> *"If segmentation is used to isolate the CDE from other networks, penetration testing is performed on segmentation controls at least once every 12 months and after any changes to segmentation controls/methods to verify that the segmentation methods are operational and effective, and isolate all out-of-scope systems from systems in the CDE."*

**What segmentation testing involves:**

The penetration tester attempts to breach the segmentation controls from out-of-scope systems to reach CDE systems. This is adversarial testing — the tester tries every available technique to cross the segmentation boundary.

**Testing scope for segmentation:**
- Attempt connections from all out-of-scope network segments to all CDE systems
- Test all protocols and ports that should be blocked
- Attempt VLAN hopping attacks (where applicable)
- Test all segmentation controls (not just the primary firewall)
- Attempt to reach the CDE through alternate paths (management interfaces, out-of-band networks, Wi-Fi, etc.)

**Pass/fail criteria:**
- The tester cannot successfully communicate with any CDE system from any out-of-scope location except through the defined, controlled paths
- Any successful breach of segmentation is a finding that must be remediated before the next assessment

**Frequency**: Annual and after any significant changes to segmentation architecture. Changes include: new network segments added, firewall rules modified, new systems added to or removed from CDE segment, network topology changes.

---

## Validating Firewall Rules: Requirement 1.3

PCI DSS Requirement 1.3 requires that all connections to and from the CDE are controlled. This means:
- All inbound connections to the CDE are explicitly permitted — no default allow
- All outbound connections from the CDE are explicitly permitted — no unrestricted outbound
- All permitted rules are justified for business purposes
- Rules are reviewed at least every 6 months

**The firewall rule review process:**

1. Export all current firewall rules (inbound and outbound) for CDE interfaces
2. For each rule: document the business justification for the rule
3. Identify any rules that are overly broad (allow any to any, allow large IP ranges)
4. Identify any rules for which there is no current business justification (orphaned rules from systems that no longer exist)
5. Remove or tighten rules that are too broad or unjustified
6. Document the review, findings, and actions taken

**Evidence of compliance**: Firewall rule review records showing: the date of the review, the rules reviewed, the business justification confirmed or identified for each rule, any rules removed or modified, and sign-off from the appropriate authority.

**A common finding**: Firewall rule reviews that find "no changes required" every time. In a dynamic environment, this is suspicious — either the environment is genuinely static (unusual) or the review is not being conducted rigorously.

---

## Wireless Networks and Segmentation

Wireless networks create particular scope challenges. Any wireless network that carries cardholder data — or is connected to a network that carries cardholder data — is in scope.

**PCI DSS wireless requirements (Requirements 1, 2, 11):**

- Wireless access points (WAPs) that connect to the CDE are in scope
- Wireless networks used to transmit cardholder data must use WPA3 (or WPA2 with appropriate configuration as a minimum) — no WEP, no WPA1
- Wireless networks in the CDE must be isolated from wireless networks used for general corporate or guest purposes
- All WAPs in the CDE environment must be inventoried
- Quarterly wireless scans must detect unauthorised WAPs (Requirement 11.2)

**Wireless segmentation:**
- A corporate Wi-Fi network that is on the same VLAN as payment systems is in scope
- A guest Wi-Fi network that is completely isolated from the corporate network and has no path to the CDE is out of scope
- A retail store Wi-Fi network used by POS tablets is in scope

**The rogue access point threat**: Attackers sometimes plant unauthorised wireless access points in retail environments to create a wireless entry point into the payment network. Quarterly wireless scans are required to detect such devices.

---

## Alternative and Complementary Scope Reduction Strategies

Network segmentation is the primary scope reduction strategy, but several alternatives or complements are available:

### Tokenisation (Scope Reduction for Stored Data)

**How it reduces scope**: Replaces PAN with tokens in all merchant systems. Merchant systems never store, process, or transmit actual PANs — only tokens. Systems that only handle tokens (not PANs) are generally out of scope for the cardholder data storage requirements.

**Implementation**: The tokenisation system (vault) stores the PAN-to-token mapping. All merchant systems interact only with tokens. Only the tokenisation vault (typically operated by a PCI-compliant third party) stores PANs.

**Scope impact**: Systems that only see tokens are out of scope for Requirement 3 (protect stored data). If the token is designed so that it cannot be reverse-engineered into the PAN without access to the vault, systems handling only tokens are significantly reduced in scope.

**Not a complete solution**: Systems that still handle PANs (the tokenisation vault itself, and systems that process the initial card capture before tokenisation) remain in scope.

### Point-to-Point Encryption (P2PE) — Scope Reduction for In-Flight Data

**How it reduces scope**: CHD is encrypted at the POI device using keys controlled by the P2PE solution operator (not the merchant). Within the merchant's environment, only encrypted data flows — the merchant cannot decrypt it. The P2PE solution operator's systems are in scope; the merchant's systems are dramatically reduced in scope.

**Validated vs non-validated P2PE**: Only PCI SSC-listed, validated P2PE solutions provide the full scope reduction benefit. Custom or non-validated encryption approaches do not qualify — even if technically equivalent, they have not been independently assessed to the PCI P2PE standard.

**Scope impact**: Merchants using validated P2PE qualify for SAQ P2PE — approximately 35 sub-requirements versus the full SAQ D scope. The merchant's networks are not in scope for most requirements because card data in the merchant environment is always encrypted.

### Outsourcing Payment Processing

**How it reduces scope**: Redirect customers to a fully PCI-compliant third-party payment page (e.g. Stripe Checkout, PayPal, Sage Pay hosted pages). The merchant's systems never touch CHD.

**Scope impact**: Merchant qualifies for SAQ A — minimal requirements. The PCI compliance burden shifts to the payment service provider, who is responsible for maintaining their own Level 1 compliance and providing evidence to merchants and acquirers.

**Risk of scope creep**: The merchant must verify that the third-party solution is genuinely PCI-compliant (request their compliance certificate/AOC) and must ensure their own systems and processes don't inadvertently handle CHD (e.g. staff who write down card numbers, email systems used to transmit card data).

---

## Documenting Segmentation for Assessments

For QSA assessments (Level 1) and ASV scans, segmentation must be documented:

**Network diagrams**: Complete, current network diagrams showing:
- All network segments
- The CDE boundary (which segments are in scope)
- All connections between CDE and non-CDE segments (including which protocols and ports are permitted)
- All external connections
- Wireless networks

**Segmentation testing results**: Penetration test report explicitly addressing segmentation controls — confirming that out-of-scope systems cannot reach CDE systems.

**Firewall rule documentation**: Current firewall rules for all CDE interfaces, with business justification for each rule, and evidence of 6-monthly review.

**Change management records**: Evidence that changes to segmentation (new connections, firewall rule changes, network changes) went through a defined change management process with security review.

---

## Common Mistakes and Failures

**1. VLANs without inter-VLAN firewall controls.**
"We put the payment systems on a separate VLAN." Without firewall rules controlling inter-VLAN traffic at the routing layer, VLANs provide logical separation but not security isolation. A misconfigured Layer 3 switch that allows all inter-VLAN routing defeats VLAN-based segmentation.

**2. Firewall rules that are "allow any" for specific segments.**
"Allow all traffic from Management VLAN to CDE." The management VLAN then has unrestricted access to the CDE — any system on the management VLAN can reach CDE systems. This is not segmentation; it is controlled access for one segment with unrestricted capability.

**3. Segmentation not tested annually.**
Segmentation assumed to be in place because it was implemented two years ago and no changes have been made to the firewall. But configurations drift — rules get added, software changes how traffic is routed, VLANs get misconfigured. Annual testing is not optional; it is the only way to verify that assumed segmentation is still actually in place.

**4. Undocumented connections creating unrecognised scope.**
A management server outside the CDE has an agent deployed on a CDE server for monitoring. This creates a management connection from outside the CDE to inside the CDE — the management server is now in scope (Category 2). If this connection was set up without a scope assessment, it may be creating a compliance gap.

**5. Wireless networks assumed to be out of scope.**
Store Wi-Fi used for general employee use assumed to be out of scope. But the POS tablets that process card transactions also connect to the same Wi-Fi network. That Wi-Fi network is in scope.

**6. Guest Wi-Fi not truly isolated.**
A guest Wi-Fi network with a path to the corporate network (via a misconfigured firewall rule or a misconfigured access point) may have a path to the CDE. Guest networks must be verified to have no connectivity to in-scope systems.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Network segmentation maps directly to ISO 27001 Annex A control A.8.22 (Segregation of networks). Auditors assessing organisations with PCI DSS obligations will look for evidence that segmentation is in place, documented, and tested — particularly for organisations where cardholder data is processed.

**CISM:**
- Domain 3 (Security Programme) — network segmentation is a technical control that serves both security and compliance objectives. CISOs at payment organisations must ensure segmentation is adequately designed, implemented, and periodically validated.

**CRISC:**
- Network segmentation is a key risk mitigation control for cardholder data risks. CRISC candidates must understand how segmentation reduces both the likelihood of breach (by containing lateral movement) and the impact (by limiting the systems accessible from a compromised entry point).

**CISSP:**
- Domain 4 (Communication and Network Security) covers network segmentation architectures. Domain 3 (Security Architecture and Engineering) covers defence-in-depth including segmentation. Know the difference between VLANs, firewalls, and physical separation as segmentation mechanisms and their relative security strengths.

---

## GUARDIAN's Take

Network segmentation is one of the most powerful security investments an organisation can make — and one of the most underinvested in, because the benefit is in what doesn't happen.

The organisations that invest in robust segmentation benefit from: a dramatically smaller PCI DSS compliance scope (which reduces assessment costs, reduces the controls they must implement, and reduces the complexity of their compliance programme); a significantly smaller attack surface for adversaries; and a containment boundary that limits the blast radius of any breach that does occur.

The organisations that rely on flat networks or inadequate segmentation face: a compliance programme that must cover their entire IT estate (enormously costly); a network architecture where any compromised system is a potential entry point to the CDE; and the same attack path that was exploited at Target, Home Depot, and dozens of other major retail breaches.

The strategic message is straightforward: invest in segmentation before you need to, not after a breach reveals why you should have. The cost of implementing proper CDE isolation is a fraction of the cost of a major breach — and it makes every other security and compliance activity more manageable.

Design the segmentation for security first. The compliance benefits follow automatically from a well-designed security architecture. But if you design for compliance first — drawing the minimum scope boundary that satisfies the QSA — you may find that the resulting architecture is technically compliant but does not actually contain attackers who have found ways around the specific controls you implemented.

Segment for security. Document for compliance. Test to verify.

---
*Module: Module 6 — PCI DSS | Guardian Curriculum*
