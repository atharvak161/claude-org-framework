---
tags: [oscp-journey, spectre, stage-1, web-discovery, gobuster, ffuf, feroxbuster]
module: 1
cert-stage: thm
difficulty: beginner
date: 2026-04-08
phantom-refs: []
netgod-refs: []
---

# S1-06 — Gobuster, ffuf, and Feroxbuster — Web Discovery

## What Directory Brute Forcing Is and Why It Works

When a web server hosts files and directories, it doesn't advertise everything that exists. A site might have `/index.html` linked publicly, but also `/admin/`, `/backup/`, `/config.php`, `/upload/`, and dozens of other paths that are never linked from any page. These paths are only accessible if you know they exist.

**Directory brute forcing** works by making HTTP requests to a target web server for every word in a wordlist:

```
GET /admin HTTP/1.1         → 200 OK        → Found!
GET /backup HTTP/1.1        → 200 OK        → Found!
GET /login HTTP/1.1         → 302 Redirect  → Found (redirects to login page)
GET /secret HTTP/1.1        → 403 Forbidden → Found but access denied (still interesting!)
GET /nothing HTTP/1.1       → 404 Not Found → Doesn't exist
```

**Why it works:** Developers forget to unlink old files, create development/staging paths, use predictable naming conventions, and leave backup files around (e.g., `config.php.bak`, `index.html.old`).

**What you find:**
- Admin panels (`/admin/`, `/administrator/`, `/wp-admin/`)
- Backup files with credentials (`/backup.zip`, `/db.sql`, `/.env.bak`)
- Development/testing endpoints (`/test/`, `/dev/`, `/staging/`)
- Configuration files (`/config.php`, `/web.config`, `/.htaccess`)
- Hidden API endpoints (`/api/v1/users`, `/api/internal/`)
- Upload directories (`/uploads/`, `/files/`)

---

## Gobuster

Gobuster is a fast, multi-mode brute forcing tool written in Go. The three modes you need are `dir`, `dns`, and `vhost`.

### Installation

```bash
sudo apt install gobuster          # Kali — already installed
go install github.com/OJ/gobuster/v3@latest   # Install from source
```

---

### dir Mode — Directory and File Brute Forcing

```bash
gobuster dir -u http://TARGET -w WORDLIST [flags]
```

**Every flag explained:**

| Flag | Long Form | What it does |
|------|-----------|-------------|
| `-u` | `--url` | Target URL (required) |
| `-w` | `--wordlist` | Path to wordlist (required) |
| `-x` | `--extensions` | File extensions to append to each word |
| `-t` | `--threads` | Number of concurrent threads (default: 10) |
| `-o` | `--output` | Save output to file |
| `-r` | `--follow-redirect` | Follow redirects (default: off — show the redirect code) |
| `-k` | `--no-tls-validation` | Skip TLS certificate validation (for self-signed certs) |
| `-b` | `--negative-status-codes` | Blacklist these status codes (hide them) |
| `-s` | `--status-codes` | Only show these status codes |
| `--timeout` | | HTTP timeout per request |
| `-H` | `--headers` | Add custom HTTP headers (e.g., cookies, auth) |
| `-c` | `--cookies` | Add cookies |
| `-U` | `--username` | HTTP Basic Auth username |
| `-P` | `--password` | HTTP Basic Auth password |
| `--proxy` | | Route through proxy (e.g., Burp: `http://127.0.0.1:8080`) |
| `-q` | `--quiet` | Suppress banner (cleaner output) |
| `--wildcard` | | Force scan even if wildcard responses detected |
| `-n` | `--no-status` | Don't print status codes |
| `-e` | `--expanded` | Print full URLs instead of just paths |
| `-z` | `--no-progress` | Don't display progress |

**Standard usage:**
```bash
# Basic directory scan:
gobuster dir -u http://TARGET -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt

# With common extensions:
gobuster dir -u http://TARGET -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,html,txt,bak,zip

# Faster with more threads:
gobuster dir -u http://TARGET -w /usr/share/seclists/Discovery/Web-Content/common.txt -t 50 -x php,html,txt

# HTTPS with self-signed cert:
gobuster dir -u https://TARGET -w /usr/share/seclists/Discovery/Web-Content/common.txt -k

# Save output and follow redirects:
gobuster dir -u http://TARGET -w WORDLIST -o gobuster_results.txt -r

# Authenticated scan (with cookie):
gobuster dir -u http://TARGET/admin/ -w WORDLIST -c "session=abc123def456"

# Through Burp Suite proxy:
gobuster dir -u http://TARGET -w WORDLIST --proxy http://127.0.0.1:8080

# Hide 404 and 403, only show interesting results:
gobuster dir -u http://TARGET -w WORDLIST -b 404,403

# Scan for specific file types only:
gobuster dir -u http://TARGET -w /usr/share/seclists/Discovery/Web-Content/common.txt -x php,aspx,jsp -b 404
```

---

### dns Mode — Subdomain Enumeration

DNS mode brute forces subdomains by querying DNS for `WORD.TARGET_DOMAIN` for each word in the wordlist.

```bash
gobuster dns -d TARGET_DOMAIN -w WORDLIST [flags]
```

| Flag | What it does |
|------|-------------|
| `-d` | Target domain (required) |
| `-w` | Wordlist (required) |
| `-i` | Show IP addresses of found subdomains |
| `-r` | Custom DNS resolver (e.g., use target's own DNS: `--resolver TARGET_DNS_IP`) |
| `--timeout` | DNS query timeout |

```bash
# Standard subdomain brute force:
gobuster dns -d target.com -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -i

# Use target's internal DNS server (for internal engagements):
gobuster dns -d domain.local -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -r INTERNAL_DNS_IP -i
```

---

### vhost Mode — Virtual Host Discovery

Virtual hosting allows multiple websites to run on the same IP/port, distinguished by the `Host:` header. A server hosting `site.com` might also have `admin.site.com`, `dev.site.com`, `internal.site.com` — all pointing to the same IP but serving different content.

```bash
gobuster vhost -u http://TARGET -w WORDLIST [flags]
```

| Flag | What it does |
|------|-------------|
| `-u` | Target URL (IP or base domain) |
| `-w` | Wordlist of subdomains to try |
| `--append-domain` | Append the base domain to each word (e.g., `admin` → `admin.target.com`) |

```bash
# Virtual host discovery:
gobuster vhost -u http://TARGET_IP -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt --append-domain

# If the domain is known:
gobuster vhost -u http://target.com -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt
```

**Why vhost matters:** On OSCP machines, you'll often find an IP serving a basic site on port 80 but with a virtual host like `dev.target.htb` or `admin.target.htb` that serves a completely different (and vulnerable) application. Without vhost enumeration you'd miss it entirely.

---

## ffuf — Fuzz Faster U Fool

ffuf is more flexible than Gobuster because it uses a `FUZZ` keyword that you can place anywhere in a request — URL, headers, body, or parameters. This makes it a universal fuzzer, not just a directory scanner.

### Installation

```bash
sudo apt install ffuf              # Kali — already installed
go install github.com/ffuf/ffuf/v2@latest   # From source
```

### Core Concept — The FUZZ Keyword

Place `FUZZ` anywhere in your command where you want the wordlist values substituted:

```bash
ffuf -u http://TARGET/FUZZ -w WORDLIST              # Directory fuzzing
ffuf -u http://TARGET -H "Host: FUZZ.target.com" -w WORDLIST  # VHost fuzzing
ffuf -u http://TARGET/page?param=FUZZ -w WORDLIST   # Parameter fuzzing
ffuf -u http://TARGET/login -X POST -d "user=FUZZ&pass=password" -w WORDLIST  # POST fuzzing
```

### All Flags Explained

**Input options:**
| Flag | What it does |
|------|-------------|
| `-u` | Target URL with FUZZ keyword |
| `-w` | Wordlist path (use `WORDLIST:FUZZ_KEYWORD` for multiple wordlists) |
| `-X` | HTTP method (GET, POST, PUT, etc.) |
| `-d` | POST data body |
| `-H` | Custom header (can use multiple times) |
| `-b` | Cookie string |
| `-r` | Follow redirects |
| `-x` | Proxy URL |
| `--timeout` | Request timeout in seconds |

**Filtering options — these are critical for removing noise:**
| Flag | What it does |
|------|-------------|
| `-fc` | Filter by HTTP status code (hide these codes) |
| `-fs` | Filter by response size in bytes (hide responses of this size) |
| `-fw` | Filter by number of words in response |
| `-fl` | Filter by number of lines in response |
| `-fr` | Filter by regex pattern in response |
| `-mc` | Match only these status codes (whitelist) |
| `-ms` | Match only responses of this size |
| `-mw` | Match only responses with this word count |
| `-ml` | Match only responses with this line count |
| `-mr` | Match responses containing this regex |

**Output options:**
| Flag | What it does |
|------|-------------|
| `-o` | Output file |
| `-of` | Output format: `json`, `ejson`, `html`, `md`, `csv`, `all` |
| `-v` | Verbose — show full URL in output |
| `-s` | Silent — suppress progress bar |

**Performance options:**
| Flag | What it does |
|------|-------------|
| `-t` | Threads (default: 40) |
| `-p` | Delay between requests (e.g., `0.1` = 100ms) |
| `-rate` | Max requests per second |

**Recursion:**
| Flag | What it does |
|------|-------------|
| `-recursion` | Enable recursive scanning |
| `-recursion-depth` | Max recursion depth (default: 0 = unlimited) |
| `-recursion-strategy` | `default` or `greedy` |

---

### ffuf Usage Examples

**Basic directory discovery:**
```bash
ffuf -u http://TARGET/FUZZ -w /usr/share/seclists/Discovery/Web-Content/common.txt
```

**With extension fuzzing:**
```bash
ffuf -u http://TARGET/FUZZ -w /usr/share/seclists/Discovery/Web-Content/raft-medium-words.txt -e .php,.html,.txt,.bak,.zip
```

**Filtering out 404s (and other noise):**
```bash
# If all 404 responses are the same size (e.g., 1234 bytes), filter by size:
ffuf -u http://TARGET/FUZZ -w WORDLIST -fs 1234

# Filter by status code:
ffuf -u http://TARGET/FUZZ -w WORDLIST -fc 404,403

# Only show 200 responses:
ffuf -u http://TARGET/FUZZ -w WORDLIST -mc 200
```

**Virtual host fuzzing:**
```bash
# First, do a test request to get the baseline response size for unknown vhosts:
curl -s -o /dev/null -w "%{size_download}" -H "Host: nonexistent.target.com" http://TARGET_IP

# Then filter out that baseline size:
ffuf -u http://TARGET_IP -H "Host: FUZZ.target.com" -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -fs BASELINE_SIZE
```

**Parameter discovery (GET):**
```bash
# Find hidden GET parameters:
ffuf -u http://TARGET/page.php?FUZZ=value -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt -fs BASELINE_SIZE
```

**Parameter value fuzzing:**
```bash
# Fuzz values for a known parameter:
ffuf -u "http://TARGET/page.php?id=FUZZ" -w /usr/share/seclists/Fuzzing/integers.txt
```

**POST body fuzzing (login forms):**
```bash
# Fuzz the password field:
ffuf -u http://TARGET/login -X POST -d "username=admin&password=FUZZ" -w /usr/share/wordlists/rockyou.txt -fc 200 -mc 302
# Here we look for 302 redirects (successful login redirect) and filter out 200s (failed login)
```

**Recursive scanning:**
```bash
ffuf -u http://TARGET/FUZZ -w /usr/share/seclists/Discovery/Web-Content/common.txt -recursion -recursion-depth 3 -e .php,.html
```

**Multiple wordlists (two FUZZ keywords):**
```bash
# Use W1 and W2 as keyword names for two separate wordlists:
ffuf -u http://TARGET/W1/W2 -w wordlist1.txt:W1 -w wordlist2.txt:W2
```

**Rate limiting to be polite:**
```bash
ffuf -u http://TARGET/FUZZ -w WORDLIST -rate 50    # Max 50 requests/second
ffuf -u http://TARGET/FUZZ -w WORDLIST -p 0.2      # 200ms delay between requests
```

---

### Dealing with False Positives in ffuf

The biggest challenge with ffuf is tuning filters to eliminate false positives. The workflow:

1. **Run without filters first**, note the response size/lines/words for a non-existent path
2. **Apply `-fs SIZE`** to filter that baseline
3. **Review remaining results** — check each manually in a browser or with `curl`

```bash
# Step 1 — get baseline:
curl -s http://TARGET/definitelynotapath12345 | wc -c    # Character count
curl -s http://TARGET/definitelynotapath12345 | wc -l    # Line count
curl -s http://TARGET/definitelynotapath12345 | wc -w    # Word count

# Step 2 — filter:
ffuf -u http://TARGET/FUZZ -w WORDLIST -fs 1234 -fl 42
```

---

## Feroxbuster

Feroxbuster is similar to Gobuster's `dir` mode but with one critical difference: **it recurses automatically**. When it finds a directory, it immediately scans inside it. This means it can find `/admin/`, then automatically scan `/admin/users/`, `/admin/config/`, etc.

### Installation

```bash
sudo apt install feroxbuster       # Kali
cargo install feroxbuster          # From source (Rust)
```

### Key Flags

| Flag | What it does |
|------|-------------|
| `-u` | Target URL |
| `-w` | Wordlist |
| `-x` | File extensions |
| `-t` | Threads (default: 50) |
| `-d` | Max recursion depth (default: 4) |
| `--no-recursion` | Disable recursion |
| `-o` | Output file |
| `-C` | Filter by status code (hide these) |
| `-S` | Filter by response size |
| `-W` | Filter by word count |
| `-L` | Filter by line count |
| `--proxy` | Proxy URL |
| `-k` | Disable TLS validation |
| `-H` | Custom header |
| `-b` | Cookies |
| `-r` | Follow redirects |
| `--smart` | Smart filter (auto-detect and filter wildcard responses) |
| `--silent` | Suppress progress output |
| `--json` | Output as JSON |

```bash
# Standard recursive scan:
feroxbuster -u http://TARGET -w /usr/share/seclists/Discovery/Web-Content/common.txt

# With extensions and depth limit:
feroxbuster -u http://TARGET -w /usr/share/seclists/Discovery/Web-Content/raft-medium-words.txt -x php,html,txt -d 3

# Filter noise and auto-detect wildcards:
feroxbuster -u http://TARGET -w WORDLIST --smart

# HTTPS with self-signed cert:
feroxbuster -u https://TARGET -w WORDLIST -k

# Through Burp:
feroxbuster -u http://TARGET -w WORDLIST --proxy http://127.0.0.1:8080
```

---

## Wordlist Selection — Which Wordlist for Which Scenario

The right wordlist is as important as the right tool. All wordlists referenced are from **SecLists** — the standard collection.

```bash
# Install SecLists:
sudo apt install seclists
# Location: /usr/share/seclists/
```

**Web Content Discovery wordlists:**

| Wordlist | Size | When to Use |
|----------|------|------------|
| `Discovery/Web-Content/common.txt` | ~4,600 words | First scan — fast, catches most common paths |
| `Discovery/Web-Content/raft-medium-words.txt` | ~63,000 words | Thorough scan after quick scan |
| `Discovery/Web-Content/raft-large-words.txt` | ~119,000 words | Deep scan when medium didn't find anything |
| `Discovery/Web-Content/directory-list-2.3-medium.txt` | ~220,000 words | DirbBuster medium — very thorough, slow |
| `Discovery/Web-Content/directory-list-2.3-big.txt` | ~1,273,000 words | Last resort only |
| `Discovery/Web-Content/burp-parameter-names.txt` | ~6,700 words | Parameter discovery |
| `Discovery/Web-Content/api/api-endpoints.txt` | Various | API endpoint discovery |

**DNS/Subdomain wordlists:**

| Wordlist | Size | When to Use |
|----------|------|------------|
| `Discovery/DNS/subdomains-top1million-5000.txt` | 5,000 words | Quick subdomain scan |
| `Discovery/DNS/subdomains-top1million-20000.txt` | 20,000 words | Standard subdomain scan |
| `Discovery/DNS/subdomains-top1million-110000.txt` | 110,000 words | Thorough subdomain scan |

**Technology-specific wordlists:**
```bash
/usr/share/seclists/Discovery/Web-Content/CMS/
    wordpress.fuzz.txt          # WordPress paths
    joomla.txt                  # Joomla paths
    drupal.txt                  # Drupal paths

/usr/share/seclists/Discovery/Web-Content/
    spring-boot.txt             # Spring Boot actuator endpoints
    swagger.txt                 # Swagger/OpenAPI discovery
    graphql.txt                 # GraphQL endpoint discovery
```

> [!tip] Wordlist strategy for OSCP
> 1. Start with `common.txt` — fast, catches 80% of findings
> 2. If nothing interesting: switch to `raft-medium-words.txt`
> 3. Add extensions relevant to the tech stack: `-x php` for PHP sites, `-x aspx` for IIS, `-x jsp` for Tomcat
> 4. Never start with a 1M+ word list — it takes too long and rarely finds things the medium list misses

---

## Extension Brute Forcing — Which Extensions to Try

Knowing what tech stack the target runs tells you what extensions to try.

| Server/CMS | Extensions to try |
|-----------|-----------------|
| Apache (generic) | `.php`, `.html`, `.txt`, `.bak`, `.old`, `.zip`, `.tar.gz` |
| IIS / Windows | `.aspx`, `.asp`, `.html`, `.txt`, `.config`, `.bak` |
| Tomcat / Java | `.jsp`, `.jspx`, `.java`, `.class`, `.war` |
| Nginx (generic) | `.php`, `.html`, `.txt` (same as Apache) |
| WordPress | `.php` primarily — but wp-admin, wp-login, wp-config |
| Django/Flask | No extensions typically — focus on paths |

**Always include:** `.bak`, `.old`, `.zip`, `.gz`, `.tar`, `.swp` (vim swap files), `.DS_Store` (macOS), `.git`

```bash
# Universal extension set for initial scan:
gobuster dir -u http://TARGET -w WORDLIST -x php,aspx,jsp,html,txt,bak,zip,old
```

---

## Virtual Host Discovery — When and Why It Matters

**When to do vhost enumeration:**
- You find an IP with a web server but the response looks like a default page or "Welcome to nginx"
- You see a domain referenced in SSL certificates but it resolves to the same IP
- The box has a `.htb` or custom domain convention (add to `/etc/hosts` first)

**The workflow:**

```bash
# Step 1 — Add base domain to /etc/hosts:
echo "TARGET_IP target.htb" >> /etc/hosts

# Step 2 — Get baseline response size for unknown vhosts:
curl -s -o /dev/null -w "%{size_download}" -H "Host: nonexistent12345.target.htb" http://TARGET_IP

# Step 3 — Fuzz for vhosts, filtering the baseline size:
ffuf -u http://TARGET_IP -H "Host: FUZZ.target.htb" \
  -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt \
  -fs BASELINE_SIZE

# Step 4 — Add discovered vhost to /etc/hosts:
echo "TARGET_IP dev.target.htb" >> /etc/hosts

# Step 5 — Browse the discovered vhost:
gobuster dir -u http://dev.target.htb -w WORDLIST
```

---

## What Response Codes Tell You

| Code | Meaning | Pentest Action |
|------|---------|---------------|
| `200 OK` | Page exists and is accessible | Investigate immediately |
| `301 Moved Permanently` | Permanent redirect | Follow the redirect — real content is there |
| `302 Found` | Temporary redirect | Often login redirect — the destination is interesting |
| `401 Unauthorized` | Authentication required | Try default creds, credential stuffing |
| `403 Forbidden` | Path exists, access denied | Still interesting — try path traversal, different methods |
| `404 Not Found` | Page doesn't exist | Ignore (unless custom 404 — check size) |
| `405 Method Not Allowed` | Path exists, wrong HTTP method | Try PUT, PATCH, DELETE |
| `500 Internal Server Error` | Path exists, server error | May indicate SQL injection or other vulnerability |

> [!tip] 403 is not the end
> A 403 means the path **exists** but you're denied. This is still valuable — you've confirmed something is there. Next steps: try different HTTP methods (`OPTIONS`, `PUT`, `TRACE`), try path traversal tricks (`/admin/./`, `/admin%2f`), look for misconfigured file permissions, or add the path to your notes for after you get credentials.

---

## OSCP Exam — Web Discovery Protocol

> [!danger] Never skip web directory brute force
> On OSCP, if a machine has a web service on ANY port (80, 443, 8080, 8443, 8888, etc.), you **must** run directory brute force. Even if you've found a vulnerability and popped the box, run it anyway — there may be additional services or credentials that help with other machines.

**Exam workflow for every web service:**

```bash
# As soon as you see port 80/443/8080 in Nmap output:

# 1 — Quick scan while Nmap continues:
gobuster dir -u http://TARGET -w /usr/share/seclists/Discovery/Web-Content/common.txt -x php,html,txt -t 50 -o gobuster_quick.txt

# 2 — Manual browse: view source, check /robots.txt, /sitemap.xml, /.git, /.env
curl http://TARGET/robots.txt
curl http://TARGET/.git/HEAD
curl http://TARGET/.env

# 3 — Identify tech stack (Wappalyzer browser extension or whatweb):
whatweb http://TARGET

# 4 — Deeper scan with appropriate extensions:
gobuster dir -u http://TARGET -w /usr/share/seclists/Discovery/Web-Content/raft-medium-words.txt -x php,html,txt,bak -o gobuster_medium.txt

# 5 — Check for vhosts if applicable:
ffuf -u http://TARGET -H "Host: FUZZ.target.htb" -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -fs BASELINE

# 6 — If Tomcat/Java detected on port 8080:
gobuster dir -u http://TARGET:8080 -w /usr/share/seclists/Discovery/Web-Content/common.txt -x jsp,war,do,action
```

---

## Quick Reference

| Task | Tool | Command |
|------|------|---------|
| Quick dir scan | gobuster | `gobuster dir -u URL -w common.txt -x php,html,txt -t 50` |
| Medium dir scan | gobuster | `gobuster dir -u URL -w raft-medium-words.txt -x php,html,txt,bak` |
| Subdomain brute | gobuster | `gobuster dns -d domain.com -w subdomains-top1million-5000.txt -i` |
| VHost fuzz | ffuf | `ffuf -u http://IP -H "Host: FUZZ.domain.htb" -w subdomains-5000.txt -fs SIZE` |
| Recursive scan | feroxbuster | `feroxbuster -u URL -w common.txt -x php,html -d 3` |
| Parameter fuzz | ffuf | `ffuf -u URL?FUZZ=val -w burp-parameter-names.txt -fs SIZE` |
| POST fuzz | ffuf | `ffuf -u URL -X POST -d "user=admin&pass=FUZZ" -w rockyou.txt -fc 200` |
| Through Burp | any | add `--proxy http://127.0.0.1:8080` |
| Skip TLS check | any | add `-k` (gobuster/feroxbuster) or nothing (ffuf ignores by default) |

---

## Common Mistakes

> [!warning] Common mistakes — beginners get these wrong
> 1. **Running only one wordlist.** `common.txt` misses things `raft-medium` catches. Always escalate wordlist size if initial results are thin.
> 2. **Forgetting extensions.** A PHP app that hides `/admin` might expose `/admin.php`. Always specify `-x php` for PHP targets.
> 3. **Ignoring 403 responses.** They confirm a path exists — never throw them away.
> 4. **Not doing vhost enumeration.** A plain IP often has multiple virtual hosts. This is a very common OSCP rabbit hole — you stare at the default nginx page for 30 minutes when there's a full app behind `admin.target.htb`.
> 5. **Only scanning port 80.** If Nmap found 8080, 8443, 8888, or any other port — run a separate gobuster against each one.
> 6. **Not checking robots.txt.** `curl http://TARGET/robots.txt` takes 2 seconds and sometimes directly reveals admin paths.

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| TryHackMe — "Content Discovery" room | Covers all three tools with guided labs |
| TryHackMe — "Walking An Application" | Manual web enumeration to complement tool use |
| PortSwigger Web Academy — Information Disclosure | Labs on finding hidden content |
| HTB — Nibbles | WordPress path discovery with gobuster |
| HTB — Blocky | Hidden `.jar` file via directory brute force |
| HTB — Bashed | Finding `/phpbash.php` via directory scan |
| SecLists GitHub | Browse what wordlists exist and what they target |
