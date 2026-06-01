---
tags: [guardian, grc, module-4, iso27002, physical-controls, secure-areas, equipment, physical-security, cctv]
module: 4
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G3-10 — Annex A Controls — Complete Reference 2022", "G4-01 — Organisational Controls", "G4-02 — People Controls", "G4-04 — Technological Controls", "G4-05 — Control Selection and Justification"]
---

# G4-03 — Physical Controls — Secure Areas, Equipment

> [!abstract] What This Note Covers
> By the end of this note, you will understand the 14 physical controls in ISO 27002:2022 Category 7 in depth — what each requires, how to implement them proportionately, what good evidence looks like, and why physical security is the most commonly underestimated category in ISMSs that focus heavily on technical controls.

---

## Why This Exists

Physical security is the category most frequently reduced to "we have an office and it has a door lock" — and the category that, when it fails, can produce the most immediate and irrecoverable consequences. A stolen laptop with an unencrypted drive containing customer records is a GDPR notifiable breach. A tailgated intruder who plants a keystroke logger on an unlocked server achieves what months of network-based attack could not. A fire in a data centre without adequate suppression destroys backups and production systems simultaneously.

Physical security controls are not just about protecting buildings. They are about protecting the physical embodiment of the organisation's digital assets — the servers that store the data, the laptops that access it, the cables that transmit it, and the people who interact with it. In the era of cloud computing and remote working, physical security has in some respects become more complex, not simpler — because the organisation's information assets are now physically located across dozens of environments (cloud data centres, employee homes, mobile devices) rather than one controlled office.

The 14 physical controls in ISO 27002:2022 Category 7 address this complexity — from the physical perimeter of a data centre to the screen of a laptop in a coffee shop.

---

## The 14 Physical Controls: Implementation Depth

### A.7.1 — Physical Security Perimeters

**Purpose**: To define and protect the physical boundaries of areas containing information and other associated assets, preventing unauthorised physical access.

**Perimeter definition:**
ISO 27002 defines a security perimeter as "any boundary between areas with different security requirements." In practice, this typically means:
- **Outer perimeter**: The building boundary (external walls, fence, reception/lobby)
- **Inner perimeter**: Secure areas within the building (IT room, server room, finance department, HR records storage)
- **High-security areas**: Areas with the most sensitive assets (primary data centre, media storage vault)

**Physical perimeter requirements (ISO 27002 guidance):**
- Perimeters must be clearly defined — there must be no ambiguity about where the secure area begins
- External walls of secure areas should be solid (floor-to-ceiling, not partial-height partitions that can be climbed)
- Doors and windows in secure areas must be locked and alarmed where appropriate
- All points of entry and exit must be monitored or controlled
- No visible indication from outside of what information processing equipment is inside (no window visibility of servers, no naming conventions that identify the server room)

**Proportionality**: The perimeter requirements must be proportionate to the risk. A small consultancy renting space in a shared serviced office building has different perimeter requirements than a financial services firm with its own dedicated data centre. The ISMS risk assessment should drive the perimeter protection level.

**What good evidence looks like:**
- Site security assessment documenting perimeter definition and controls
- Physical access control system records (who accessed secure areas and when)
- Alarm system documentation and testing records
- Physical security inspection records (are perimeter controls maintained?)

---

### A.7.2 — Physical Entry

**Purpose**: To ensure that only authorised individuals are permitted to enter secure areas, through appropriate entry controls.

**Entry control mechanisms (in increasing order of rigour):**
- **Locked doors with key access**: Adequate for low-sensitivity areas; risk of key duplication and loss
- **PIN/code access**: Better than keys; risk of code sharing
- **Proximity card/badge access**: Individual tokens; can be managed centrally; audit trail of access events
- **Biometric access**: Highest security; non-transferable; but requires careful data protection consideration (biometric data is special category under GDPR)
- **Man-traps/airlocks**: Two-door systems where the first door must close before the second opens; prevents tailgating; used for highest-security areas

**Visitor management:**
- All visitors must be identified before entry to secure areas
- Visitors must be logged (name, company, purpose, time in/out, host name)
- Visitors must be escorted at all times in secure areas
- Visitor badges must be clearly distinguishable from employee badges and must be collected on exit
- Visitor access rights must be limited to the areas their visit requires

**Tailgating prevention:**
- Staff must not hold doors open for individuals without valid access credentials — even if they appear to be colleagues
- Physical barriers (turnstiles, mantrap systems) for highest-security areas
- Security awareness training must cover the obligation not to allow tailgating

**What good evidence looks like:**
- Access control system records (who entered secure areas and when)
- Visitor log records (physical or electronic)
- Visitor escort policy
- Evidence of tailgating prevention training in security awareness programme

**Common failures:**
- Visitor log not maintained (or maintained inconsistently)
- Visitors unescorted in secure areas
- Staff routinely holding doors for unverified individuals (tailgating culture)
- Access cards not deactivated when employees leave

---

### A.7.3 — Securing Offices, Rooms, and Facilities

**Purpose**: To protect offices and facilities from unauthorised access, damage, and interference.

**Implementation requirements:**
- Office areas containing sensitive information must be locked when unoccupied
- Sensitive areas (HR, Finance, Legal) should have restricted access — not all staff need access to all areas
- Combination locks, card access, or key locks appropriate to the sensitivity of the area
- Windows and other access points in sensitive areas must be secured
- No sensitive information visible from outside (windows covered where overlooking is possible)
- External areas adjacent to buildings must not be accessible to unauthorised persons

**Special consideration for home offices (post-COVID):**
- Employees working from home with sensitive information must apply physical security to their home workspace
- Locking of home office or computer when unattended
- Secure storage of physical documents
- No sensitive screen content visible to household members or visitors

---

### A.7.4 — Physical Security Monitoring *(NEW in 2022)*

**Purpose**: To continuously monitor premises for unauthorised physical access, providing detection and deterrence.

**Monitoring mechanisms:**
- **CCTV systems**: Coverage of all entry/exit points, perimeter areas, and sensitive zones. Must be recorded and retained for an appropriate period (typically 30 days minimum; longer for high-security areas). Must comply with GDPR/DPA 2018 (signage, data minimisation, access controls on footage, retention limits).
- **Access control system logging**: Every badge or biometric access event is logged with timestamp, location, and individual identity. Logs must be reviewed — a log that generates entries but is never reviewed provides no security value.
- **Security personnel**: For higher-risk sites, physical security officers provide real-time monitoring and response.
- **Intruder alarms**: Motion detection and door/window contact sensors for out-of-hours monitoring. Must be tested regularly and connected to an alarm receiving centre or police response.
- **Environmental monitoring**: Temperature, humidity, power, and water level sensors for server rooms — detecting environmental threats before they cause damage.

**GDPR considerations for CCTV:**
- CCTV in the workplace is a significant data protection issue. Must have legal basis (legitimate interest is the typical basis — must document the legitimate interest assessment).
- Staff must be informed (signage, employee handbook reference)
- Footage access must be controlled — not everyone can review CCTV
- Retention period must be defined and enforced
- Subject access requests may require providing footage to individuals captured in it

**What good evidence looks like:**
- CCTV system documentation (camera locations, recording settings, retention period)
- Access control logs showing monitoring activity
- Evidence of log review (who reviews access logs, how frequently, what triggers follow-up)
- Intruder alarm test records
- GDPR legitimate interest assessment for CCTV

---

### A.7.5 — Protecting Against Physical and Environmental Threats

**Purpose**: To protect information processing facilities from physical and environmental hazards — fire, flood, earthquake, power failure, extreme temperature — that could damage or destroy assets.

**Threat categories and controls:**

**Fire:**
- Fire suppression systems (sprinklers — note that water suppression can damage electronic equipment; clean agent suppression is preferred for server rooms)
- Smoke detectors and fire alarms
- Fire extinguishers of appropriate type for electronic equipment
- Fire evacuation procedures
- Regular fire drills
- No storage of flammable materials in server rooms

**Water/flooding:**
- Water detection sensors under raised floors in server rooms
- Equipment not located at or below ground level where flooding risk exists
- Pipes not routed above server rooms where possible

**Power:**
- Uninterruptible Power Supply (UPS) — battery backup for planned outages and short outages
- Generators for extended outages (with regular testing under load)
- Multiple power feeds from different substations for highest-criticality facilities
- Power conditioning to protect against surges and spikes
- Regular testing of UPS and generator systems

**Temperature/humidity:**
- HVAC (air conditioning) specifically designed for server room environments
- Redundant cooling (if one HVAC unit fails, the other maintains temperature)
- Temperature and humidity monitoring with automated alerts
- Hot aisle/cold aisle containment for larger data centres

**Earthquake/structural:**
- Relevant for organisations in seismically active regions
- Equipment mounting requirements to prevent equipment falling

**What good evidence looks like:**
- Data centre/server room risk assessment covering environmental threats
- Environmental control maintenance records (UPS testing, generator testing, HVAC servicing)
- Environmental monitoring logs (temperature, humidity, power)
- Fire suppression system inspection records
- Evidence of response to environmental alerts

---

### A.7.6 — Working in Secure Areas

**Purpose**: To ensure that work conducted in secure areas does not create additional security risks through the behaviour or activities of those present.

**Requirements for working in secure areas:**
- Access is restricted to authorised personnel only — no unnecessary presence in secure areas
- No photography, recording, or broadcasting from secure areas unless specifically authorised
- No personal mobile devices in highest-security areas (e.g. primary data centre) unless a policy permits it with controls
- Unoccupied secure areas must be locked and secured
- Only the activities necessary for the authorised purpose may be conducted in secure areas
- Third-party maintenance personnel in secure areas must be supervised and logged

**Practical implementation:**
- Clear signage at entrance to secure areas explaining restrictions
- Induction for new employees covering secure area rules
- Visitor escort policy enforced without exception
- Mobile device policy for secure areas (pockets before entry or devices in secure storage)

---

### A.7.7 — Clear Desk and Clear Screen

**Purpose**: To reduce the risk of unauthorised access to, loss of, or damage to information by ensuring that information is not left accessible when not in use.

**Clear desk requirements:**
- All papers and removable storage media (USB drives, external hard drives) must be removed from desks and secured when the desk is unoccupied
- Sensitive information must not be left visible at any time — including during temporary absence (coffee break, meeting)
- Confidential documents must be stored in locked drawers or filing cabinets
- Whiteboards must be cleared of sensitive information after meetings
- Printers must be attended — don't print sensitive documents to an unattended printer

**Clear screen requirements:**
- Screen lock must activate automatically after a defined period of inactivity (typically 5–15 minutes)
- Users must manually lock screens when leaving workstations temporarily (Win+L on Windows; equivalent on other platforms)
- Laptop screens must not display sensitive information in public spaces where they can be overlooked
- Privacy screens are recommended for mobile workers who frequently work in public spaces

**Enforcement:**
- Clear desk policy must be communicated in security awareness training
- Management must visibly model compliance
- Periodic spot checks (scheduled or random) — auditors reviewing clear desk compliance will conduct desk walkthroughs
- Non-compliance addressed through the normal disciplinary process (A.6.4)

**What good evidence looks like:**
- Clear desk and screen policy
- Evidence of training covering the policy
- Spot check records (dates, areas checked, findings)
- Screen lock configuration settings (from IT/MDM system — showing timeout values)

**Common failures:**
- Policy exists but compliance monitoring is absent
- Screen lock timeout too long (15+ minutes is excessive for sensitive environments)
- Users aware of the policy but not following it — no enforcement mechanism
- Remote workers not applying clear desk/screen to their home workspace

---

### A.7.8 — Equipment Siting and Protection

**Purpose**: To reduce the risks to equipment from environmental threats and opportunities for unauthorised access by positioning equipment appropriately.

**Siting principles:**
- Equipment should not be positioned where it can be easily seen from outside the building or from public areas (screens visible from windows; equipment visible to visitors in reception)
- Equipment should not be positioned adjacent to areas with high risk of accidental damage (e.g. next to water coolers, kitchen areas, high-traffic corridors)
- Critical equipment should be physically secured (locked server cabinets, cable locks for laptops in shared spaces)
- Equipment should have adequate ventilation — don't position equipment in enclosed spaces without airflow
- Monitor positions should prevent shoulder surfing in office environments

---

### A.7.9 — Security of Assets Off-Premises

**Purpose**: To protect information assets that are used outside the organisation's premises from loss, theft, or unauthorised access.

**Off-premises assets:**
- Laptops and mobile devices used by remote workers and travelling staff
- Portable storage media (USB drives, external hard drives) taken offsite
- Physical documents taken home or to client sites
- Equipment sent for maintenance or repair

**Protection requirements for off-premises assets:**
- All laptops and mobile devices must have full disk encryption (BitLocker, FileVault, or equivalent) — non-negotiable. An unencrypted laptop is a data breach waiting to happen.
- Laptops and mobile devices must not be left unattended in vehicles (in the UK, a laptop left in a visible car is a trivial theft target)
- Strong password/PIN required plus MFA for remote access
- Secure, tracked courier required for physical media in transit
- Remote wipe capability must be enabled (via MDM) — if a device is lost, it can be remotely wiped before data is accessed
- Equipment sent for repair must have data removed or the drive must be retained by the organisation

**GDPR intersection**: A laptop or device containing personal data that is lost or stolen is a data breach under GDPR if the data was not encrypted. If it was encrypted with a strong key, it may not be notifiable (the data is not accessible). Full disk encryption is therefore both a technical control and a GDPR compliance measure.

**What good evidence looks like:**
- Mobile device policy covering encryption, access controls, and loss reporting
- MDM records showing encryption status for all enrolled devices
- Remote wipe capability testing records
- Policy prohibiting unattended equipment in vehicles
- Asset tracking records for off-premises equipment

---

### A.7.10 — Storage Media

**Purpose**: To ensure that storage media is managed through its entire lifecycle — acquisition, use, storage, transportation, and destruction — in accordance with the organisation's classification and handling requirements.

**Media lifecycle management:**

**Acquisition**: Only organisation-approved media used; personal USB drives not permitted (significant malware vector).

**Use**: Classified information stored on encrypted media only; media labelled with classification.

**Storage**: Physical security appropriate to classification (standard media in lockable storage; high-classification media in secure storage).

**Transportation**: Encrypted portable media; secure courier for physical media shipments; audit trail for media in transit.

**Destruction**: Secure deletion from electronic media (NIST SP 800-88 compliant wiping, or physical destruction); paper shredding (cross-cut minimum for confidential; micro-cut for top-secret); certificates of destruction from approved vendors.

**Media register**: An inventory of all significant removable media — USB drives, external hard drives, backup tapes — with assigned owner and location tracking.

**Common failures:**
- Personal USB drives used for work data (unencrypted, uncontrolled, frequently lost)
- Hard drives removed from decommissioned equipment but not securely wiped (sold on or disposed of with data intact)
- No certificates of destruction for media disposed of externally
- Backup tapes not encrypted, transported unsecured

---

### A.7.11 — Supporting Utilities

**Purpose**: To protect information processing facilities from failure of supporting utilities — power, water, heating/cooling — that could cause system unavailability.

Already covered in depth under A.7.5. Key additions:
- All supporting utilities must be inspected and maintained regularly
- Failures must be reported and tracked (utility failure log)
- Emergency procedures must be defined for utility failures
- Critical utility infrastructure must be redundant where feasible

---

### A.7.12 — Cabling Security

**Purpose**: To prevent interception, damage, or interference with power and telecommunications cabling.

**Cabling security requirements:**
- Network and telecommunications cables must be protected from interception (physical access to cables enables network tapping)
- Cable routing should avoid areas of public access
- Power cables and network cables should be separated to prevent interference
- Cable trays and conduits should be used in secure areas
- Patch panels and connection points must be in secure, access-controlled locations
- Unused network ports in public areas should be disabled (a connected laptop in a meeting room with an active network port is a significant access risk)

**Practical implementation:**
- Cable documentation/map — know where all cables run
- Physical security of telecommunications rooms (MDF, IDF, patch panels)
- Network port disabling for ports in public areas (managed switches with port disable capability)
- Regular cable inspection as part of physical security review

---

### A.7.13 — Equipment Maintenance

**Purpose**: To ensure that equipment is maintained correctly to preserve its availability, integrity, and prevent unauthorised disclosure of information during maintenance activities.

**Maintenance security requirements:**
- Equipment must be maintained according to manufacturer specifications and applicable standards
- Only authorised personnel may carry out maintenance (internal IT staff or approved external vendors)
- Records must be kept of all maintenance (dates, activities, personnel)
- Sensitive information must be removed from equipment before external maintenance (or equipment must not leave the secure area)
- Third-party maintenance personnel must be supervised in secure areas
- Equipment returned from maintenance must be inspected before returning to service

**Data protection during maintenance**: This is the most commonly overlooked aspect. When a server goes for warranty repair, does it contain sensitive data? If so, has the drive been removed and retained, or has the data been encrypted? Many organisations answer "we didn't think about that" — which is a significant risk.

---

### A.7.14 — Secure Disposal or Re-use of Equipment

**Purpose**: To ensure that information is not accessible to unauthorised persons when equipment is disposed of or re-used, preventing data recovery from discarded or repurposed equipment.

**The risk**: Modern storage media retains data even after "deletion." Simply deleting files or formatting a drive does not prevent data recovery using forensic tools. Equipment disposed of without proper data sanitisation is a significant data breach risk.

**Data sanitisation methods:**

| Method | Suitability | Standard |
|---|---|---|
| **Cryptographic erasure** | Encrypted drives only — destroying the encryption key renders data irrecoverable | NIST SP 800-88 |
| **Overwriting** | Spinning hard drives — overwrite all sectors with random data (1–7 passes depending on sensitivity) | NIST SP 800-88, HMG IS5 |
| **Degaussing** | Spinning hard drives — magnetic erasure; destroys the drive in the process | For highly sensitive data |
| **Physical destruction** | SSDs (where overwriting is less reliable), highly sensitive data — shredding, crushing, or incineration | For highest-security disposal |

**SSD-specific consideration**: Traditional overwriting is less reliable for SSDs due to wear levelling and overprovisioning (data may persist in areas the overwrite process didn't reach). Cryptographic erasure or physical destruction is preferred for SSDs.

**Certificates of destruction**: For sensitive equipment disposed of externally, require a certificate of destruction from the vendor confirming secure data sanitisation. This is both a control evidence requirement and a due diligence requirement under GDPR.

**Re-use**: Equipment being repurposed within the organisation must have all previous data securely removed and be reconfigured from scratch before deployment in a new role.

**What good evidence looks like:**
- Equipment disposal policy
- Media sanitisation records (type of method used, date, person performing, equipment identifier)
- Certificates of destruction from external disposal vendors
- Asset register updates showing decommissioned equipment removed from inventory

---

## Physical Security and the Modern Organisation

Physical controls were designed for an era when an organisation's information assets were in one building. The modern organisation presents new physical security challenges:

**Cloud infrastructure**: The organisation's primary servers are now in a cloud provider's data centre. The organisation controls the logical environment (access, configuration, encryption) but the physical environment is the cloud provider's responsibility. The shared responsibility model defines this explicitly — auditors should verify that the organisation has assessed the cloud provider's physical security (typically via their ISO 27001 certificate, SOC 2 report, or equivalent).

**Hybrid working**: Employees work from home, coffee shops, trains, airports. The organisation's physical security perimeter has dissolved. The compensating controls — encrypted devices, MFA, VPN, remote wipe — must be robust because the physical environment cannot be controlled.

**Serviced offices / co-working spaces**: Many organisations rent space in shared buildings where they do not control the building security. The organisation must assess the building security controls provided by the landlord and identify any gaps.

**Bring Your Own Device (BYOD)**: Personal devices accessing work information are in a personal physical environment. Physical security requirements for BYOD must be defined in the remote working and acceptable use policies.

---

## Common Audit Findings in Category 7

| Control | Most common finding |
|---|---|
| A.7.1 | Secure area boundary not clearly defined; partial-height walls that can be climbed |
| A.7.2 | Visitor log not maintained; tailgating observed during site walkthrough |
| A.7.4 | CCTV installed but footage not reviewed; no GDPR documentation for CCTV |
| A.7.7 | Clear desk policy not followed (sensitive documents visible on desks during walkthrough) |
| A.7.9 | Laptops without encryption; personal devices used for work without MDM |
| A.7.10 | Personal USB drives in use; no media disposal records |
| A.7.14 | Decommissioned equipment disposed of without documented data sanitisation |

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Physical security is assessed through site walkthrough during Stage 2 — the auditor will physically inspect secure areas, test doors, observe tailgating behaviour, check clear desk compliance, and review physical access logs
- Common audit question: "Show me the access log for the server room for the last 30 days" — the auditor is checking that access is restricted to authorised individuals and that the log is being maintained and reviewed
- A.7.14 (secure disposal) is frequently tested by requesting disposal records — many organisations cannot demonstrate that decommissioned equipment has been securely wiped

**CISM:**
- Domain 3 (Security Programme) covers physical security controls as part of the overall IS programme

**CISSP:**
- Domain 3 (Security Architecture and Engineering) covers physical security in depth — site selection, physical barriers, detection systems, and environmental controls

---

## GUARDIAN's Take

Physical security is the category that technical security professionals most often underestimate — and regulators and auditors most often find wanting.

There is a tendency to think that physical security is solved — that because organisations have door locks and CCTV, physical security is "done." But physical security is only solved when it is systematically managed: when access logs are reviewed, when visitor records are maintained, when equipment disposal is documented, when environmental monitoring is operational and tested, when clear desk compliance is enforced.

The most dramatic physical security failure I witnessed involved a decommissioned server sold on eBay — with 8 years of customer records on an unwiped drive. The drive cost £15 in a second-hand sale. The data breach cost the organisation £400,000 in regulatory fines and remediation. The fix would have been a £50 disk wiping tool and a procedure that took 20 minutes to write.

Secure disposal is the most commonly neglected physical control — and one of the most consequential when it fails. Every time a device leaves your control — for maintenance, for disposal, for re-use — you need to know with certainty what happened to the data on it. Certificates of destruction. Sanitisation records. A media register that tracks devices from acquisition to destruction.

Build this discipline into your ISMS. Not because ISO 27002 requires it, but because the alternative — a decommissioned server with customer data appearing on a second-hand auction site — is entirely preventable and entirely unforgivable.

---
*Module: Module 4 — ISO 27002 Controls | Guardian Curriculum*
