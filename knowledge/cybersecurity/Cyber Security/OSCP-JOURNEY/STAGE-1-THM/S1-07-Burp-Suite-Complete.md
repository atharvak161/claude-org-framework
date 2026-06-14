---
tags: [oscp-journey, spectre, stage-1, burp-suite, web-testing]
module: 1
cert-stage: thm
difficulty: beginner
date: 2026-04-08
phantom-refs: []
netgod-refs: []
---

# S1-07 — Burp Suite — Complete Beginner to Intermediate

## What a Proxy Does and Why It Intercepts

Burp Suite is an intercepting proxy. It sits between your browser and the target web server and captures every HTTP/HTTPS request and response that flows through it.

**Normal web request (no proxy):**
```
Browser → HTTP Request → Web Server
Browser ← HTTP Response ← Web Server
```

**With Burp proxy:**
```
Browser → HTTP Request → Burp Suite → (holds it) → Web Server
Browser ← HTTP Response ← Burp Suite ← (holds it) ← Web Server
```

While Burp holds the request, you can read it, modify any part of it (headers, parameters, body, cookies, method), and then forward it. This is the foundation of all manual web application testing — you can manipulate every byte of every request.

**Why this matters:**
- Web apps trust data sent by the browser. Burp lets you send data the browser would never normally send.
- Client-side controls (JavaScript validation, hidden fields, disabled form elements) are completely bypassed — you're working at the HTTP level, not the DOM level.
- You can replay, modify, and fuzz requests without touching the browser.

---

## Installation and Setup

### Burp Suite Community vs Pro

| Feature | Community (Free) | Professional (£399/yr) |
|---------|-----------------|----------------------|
| Proxy | ✓ | ✓ |
| Repeater | ✓ | ✓ |
| Decoder | ✓ | ✓ |
| Comparer | ✓ | ✓ |
| Intruder | ✓ (throttled to ~1 req/sec) | ✓ (full speed) |
| Active Scanner | ✗ | ✓ |
| Collaborator | ✗ | ✓ |
| Extensions (BApp) | Limited | Full |

**For OSCP:** Community is sufficient for the exam. Pro speeds up Intruder attacks significantly.

### Installation on Kali

```bash
# Already installed on Kali:
burpsuite

# If not installed:
sudo apt install burpsuite

# Or download from portswigger.net/burp/releases
```

### CA Certificate Setup — CRITICAL

Without installing Burp's CA certificate, your browser will reject HTTPS interception with SSL errors.

**Step 1 — Start Burp and configure browser proxy:**
1. Open Burp Suite → Proxy tab → Proxy settings
2. Default listener: `127.0.0.1:8080` (confirm it's running)
3. In Firefox: Settings → Network Settings → Manual proxy → HTTP Proxy: `127.0.0.1`, Port: `8080`
   - Check "Also use this proxy for HTTPS"

**Step 2 — Download the CA certificate:**
1. With proxy configured and Burp running, navigate in Firefox to: `http://burpsuite`
   - Or: `http://127.0.0.1:8080`
2. Click "CA Certificate" → download `cacert.der`

**Step 3 — Install in Firefox:**
1. Firefox → Settings → search "certificates" → View Certificates
2. Authorities tab → Import → select `cacert.der`
3. Check: "Trust this CA to identify websites" → OK

**Step 4 — Verify:**
Navigate to any HTTPS site — no SSL warning should appear.

**Installing system-wide (for tools that use system trust store):**
```bash
sudo cp cacert.der /usr/local/share/ca-certificates/burp.crt
sudo update-ca-certificates
```

**FoxyProxy extension (recommended over manual Firefox proxy settings):**
FoxyProxy lets you quickly toggle proxy on/off without diving into Firefox settings. Install from Firefox Add-ons, add a profile pointing to `127.0.0.1:8080`, and toggle with one click.

---

## The Proxy Tab

The Proxy tab is where all traffic flows through. It's your main workspace.

### Intercept On vs Off

**Intercept ON:** Every request is held by Burp and shown to you before being sent. You must manually forward or drop each request. Use this when you want to inspect or modify a specific request.

**Intercept OFF:** Requests flow through Burp transparently — you can still see them in HTTP History, but they aren't held up. This is the normal browsing mode. Use this 95% of the time and only turn intercept on for specific requests.

### Proxy → HTTP History

Every request that flows through Burp (intercept on or off) is logged here. This is your audit trail.

**Columns:** Method, URL, Params (has parameters?), Edited (did you modify it?), Status, Length, MIME type, Extension, Title, Comment, SSL, IP, Cookies

**Right-click any request in history:**
- **Send to Repeater** — most used action, sends for manual replay/modification
- **Send to Intruder** — for automated fuzzing/brute force
- **Send to Decoder** — for encoding/decoding the request or response
- **Save item** — export request/response
- **Copy URL** — copy the full URL

### Editing Requests Live (Intercept ON)

When a request is held:
1. Modify any field directly in the Raw view — method, URL path, headers, body
2. **Forward** — send the (modified) request to the server
3. **Drop** — discard the request (browser will see a connection error)
4. **Action** → Send to Repeater/Intruder

---

## The Target Tab

### Site Map

Burp builds a site map of every URL it sees traffic for. As you browse the application, it populates automatically.

Use it to:
- Get a complete picture of all endpoints you've visited
- Identify areas you haven't explored yet
- Find parameters and forms you might have missed

### Scope Definition — DO THIS FIRST

Setting scope tells Burp what to care about. Out-of-scope traffic (third-party analytics, CDNs, etc.) clutters your history and wastes time.

**Setting scope:**
1. Target tab → right-click the target host in Site Map → "Add to scope"
2. Or: Target → Scope settings → Add → enter the base URL

**Filtering history to show only in-scope traffic:**
- Proxy → HTTP History → Filter bar → "Show only in-scope items"

> [!danger] Set scope before spidering or scanning
> If you run active scanning or spidering without setting scope, Burp may make requests to third-party services you don't have permission to test. On a real engagement this is a scope violation. On the OSCP exam, stay within scope always.

---

## The Repeater Tab

Repeater lets you manually send HTTP requests and see responses, as many times as you want, modifying the request each time. It's your main tool for manual vulnerability testing.

**Workflow:**
1. Find a request in Proxy → HTTP History
2. Right-click → Send to Repeater
3. Switch to Repeater tab — the request is loaded
4. Modify the request (add payloads, change parameters, test injection)
5. Click **Send** — see the response on the right
6. Modify again, send again — iterate as many times as needed

**Repeater tips:**
- Use the **Inspector panel** (right side) to view parameters, cookies, and headers in a structured format — easier than editing raw text
- Use **Ctrl+Space** for inline autocomplete in the request editor
- Right-click response → "Show response in browser" — renders the HTML in your browser for complex pages
- Use **+** to open multiple Repeater tabs (name them for different vulnerabilities)
- Press **Ctrl+R** from HTTP History to quickly send to Repeater

**What to test in Repeater:**
- SQL injection: modify a parameter value to `'`, `''`, `' OR 1=1--`, `' UNION SELECT NULL--`
- Command injection: modify a value to `;id`, `$(id)`, `` `id` ``
- Path traversal: modify a filename parameter to `../../../etc/passwd`
- IDOR: change an ID value from your user's ID to another user's ID
- Authentication bypass: modify session tokens, remove auth headers, change roles in JWT

---

## The Intruder Tab

Intruder automates sending large numbers of requests with varying payloads. It's Burp's fuzzing engine — used for brute force, parameter fuzzing, and injection testing.

> [!warning] Community Edition throttle
> Intruder in Community Edition is intentionally throttled to approximately 1 request per second. For heavy brute forcing (e.g., rockyou.txt against a login), use ffuf or Hydra instead. Intruder Community is still useful for smaller targeted attacks (under a few hundred payloads).

### The Four Attack Types

**Understanding payload positions first:**
After sending a request to Intruder, you mark **payload positions** using `§` markers. Intruder replaces the content between `§` markers with payloads.

Example — marking a parameter for fuzzing:
```
POST /login HTTP/1.1
...
username=admin&password=§PASSWORD§
```

**Attack Type 1 — Sniper**
- One payload set, one position
- Iterates through each payload, placing it in the marked position
- If multiple positions marked: cycles through them one at a time, leaving others unchanged
- **Use case:** Testing a single parameter with a wordlist (password brute force, SQLi payloads)

**Attack Type 2 — Battering Ram**
- One payload set, multiple positions
- Puts the same payload into ALL marked positions simultaneously
- **Use case:** When you want the same value everywhere (e.g., testing if username=SAME&email=SAME triggers something)

**Attack Type 3 — Pitchfork**
- Multiple payload sets (one per position), stepped through in parallel
- Payload set 1 item 1 goes to position 1, payload set 2 item 1 goes to position 2 — simultaneously
- Both lists must be the same length — they zip together
- **Use case:** Credential stuffing (username list + corresponding password list)

**Attack Type 4 — Cluster Bomb**
- Multiple payload sets, tries every combination
- Position 1 gets every payload from set 1, position 2 gets every payload from set 2 — all combinations
- Request count = len(set1) × len(set2) × ...
- **Use case:** Brute force with separate username and password wordlists

### Intruder Workflow Example — Login Brute Force

```
1. Log in attempt with wrong creds, capture in Proxy → History
2. Right-click → Send to Intruder
3. Intruder → Positions tab:
   - Click "Clear §" to remove auto-detected positions
   - Highlight the password value, click "Add §"
   - Result: username=admin&password=§wrongpassword§
4. Attack Type: Sniper
5. Payloads tab:
   - Payload type: Simple list
   - Load → select wordlist (or paste values)
6. Options tab:
   - "Grep - Match": add the success indicator (e.g., "Welcome" or "Dashboard")
   - "Grep - Extract": can extract specific text from responses
7. Click "Start attack"
8. In results: sort by Length or Status — successful login will have different response
```

### Payload Types

| Type | What it does |
|------|-------------|
| Simple list | Plain list of strings — most common |
| Runtime file | Load from file during attack |
| Custom iterator | Build payloads from multiple lists with separators |
| Character substitution | Apply leetspeak-style substitutions to a wordlist |
| Case modification | Uppercase, lowercase, toggle case variants |
| Numbers | Numeric ranges with steps |
| Dates | Date format iteration |
| Brute forcer | Character set + length range |
| Null payloads | Send the request N times with no change (useful for race condition testing) |
| Username generator | Generate variations from a name |

---

## The Decoder Tab

Decoder lets you encode and decode strings in various formats. Useful when you need to:
- Decode a Base64 cookie to read its contents
- URL-encode a payload before inserting it
- Convert hex output from a tool to readable text

**Encoding/decoding options:**
- URL encoding (`%20` ↔ space)
- HTML entities (`&lt;` ↔ `<`)
- Base64
- ASCII hex
- Hex
- Octal
- Binary
- Gzip (compress/decompress)
- Hash (MD5, SHA-1, SHA-256 of input)

**Workflow:**
1. Paste your string in the top box
2. Select "Decode as" or "Encode as" from the dropdown
3. Result appears below — you can chain multiple operations

**Common use cases:**
```
JWT token (3 parts separated by .) → Base64 decode each part → read the JSON payload
URL-encoded payload → URL decode → read the actual characters
Cookie value looks like Base64 → decode → see if it's a serialised object
Need to inject <script> in a context that filters < → HTML encode → &#60;script&#62;
```

---

## The Comparer Tab

Comparer diffs two HTTP requests or responses side by side. Useful for:
- Comparing responses between a valid login and an invalid login (to understand what changes)
- Comparing two similar requests to find what parameter causes a different behaviour
- Identifying what changes between an authenticated and unauthenticated response

**Workflow:**
1. In Proxy History or Repeater: right-click → Send to Comparer (request OR response)
2. Do the same for a second item
3. Comparer tab → select both items → "Words" (compare word by word) or "Bytes" (byte-level diff)
4. Differences highlighted — modified, deleted, inserted

---

## The Sequencer Tab

Sequencer analyses the randomness (entropy) of tokens — session IDs, CSRF tokens, password reset tokens. If tokens are predictable, they can be forged or brute forced.

**Workflow:**
1. Find a response containing a token (e.g., session cookie, CSRF token)
2. Send to Sequencer
3. Define the token location (which cookie, which response field)
4. Run the analysis — Burp captures hundreds of tokens and calculates entropy
5. Result: FIPS 140-2 test results and a visual entropy graph

**What low entropy means:** The tokens are predictable. An attacker could enumerate session IDs or predict password reset tokens.

---

## Essential BApp Store Extensions

BApp Store is Burp's extension marketplace. Accessible via Extensions → BApp Store tab.

**Must-install for OSCP prep:**

| Extension | What it does | Why you need it |
|-----------|-------------|----------------|
| **Autorize** | Automatically tests every request with another user's cookie | IDOR and broken access control testing — massive time saver |
| **Active Scan++** | Adds additional checks to the active scanner | More vulnerability patterns detected (Pro) |
| **Param Miner** | Discovers hidden/undocumented HTTP parameters | Often finds parameters developers forgot to remove |
| **JS Beauty** | Prettifies minified JavaScript | Makes JS source readable for manual analysis |
| **JSON Beautifier** | Formats JSON responses | Easier to read API responses |
| **Turbo Intruder** | High-speed Intruder replacement | Bypasses Community throttle — Python scriptable |
| **Logger++** | Enhanced request logging with filtering | More powerful than default HTTP History |
| **Retire.js** | Identifies vulnerable JavaScript libraries | Passive discovery of known-vulnerable front-end libs |
| **Upload Scanner** | Tests file upload endpoints | Automates file upload bypass testing |

**Installing an extension:**
1. Extensions → BApp Store → find extension → Install
2. Or: Extensions → Extensions tab → Add → load a `.jar` file manually

**Turbo Intruder** — specifically for bypassing Community throttle:
```python
# Example Turbo Intruder script for password brute force:
def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint=target.endpoint,
                           concurrentConnections=5,
                           requestsPerConnection=100,
                           pipeline=False)
    for word in open('/usr/share/wordlists/rockyou.txt'):
        engine.queue(target.req, word.rstrip())

def handleResponse(req, interesting):
    if 'Welcome' in req.response:
        table.add(req)
```

---

## Burp's Proxy Intercept — Useful Keyboard Shortcuts

| Action | Shortcut |
|--------|---------|
| Forward request | `Ctrl+F` (or Forward button) |
| Drop request | `Ctrl+D` (or Drop button) |
| Send to Repeater | `Ctrl+R` |
| Send to Intruder | `Ctrl+I` |
| Toggle intercept | `Ctrl+T` |
| Search in request/response | `Ctrl+F` |
| New Repeater tab | `+` button in Repeater |

---

## Practical Testing Workflows in Burp

### Testing for SQL Injection Manually

```
1. Find a parameter (search box, login form, URL parameter)
2. Send the request to Repeater
3. Modify the parameter value to: '
4. Send → look for SQL error in response
5. If error: try ' OR 1=1-- and ' OR 1=1#
6. If no error but behaviour changes: try time-based: ' OR SLEEP(5)--
7. Document the injection point and method
```

### Testing for XSS Manually

```
1. Find any input that reflects in the response
2. Send to Repeater
3. Try: <script>alert(1)</script>
4. If filtered: try variations: <img src=x onerror=alert(1)>, <svg onload=alert(1)>
5. URL encode if needed: %3Cscript%3Ealert(1)%3C/script%3E
6. Check the response — does your payload appear unescaped?
```

### Testing for IDOR (Insecure Direct Object Reference)

```
1. Find a request that uses an ID: GET /api/user/1337/profile
2. Send to Repeater
3. Change 1337 to other IDs: 1, 2, 100, 9999
4. Compare responses — do you get other users' data?
5. Install Autorize extension for automated IDOR testing across all requests
```

### Bypassing Client-Side Controls

```
Scenario: Form has a hidden field <input type="hidden" name="role" value="user">
1. Submit the form normally, capture in Burp
2. In Proxy intercept or Repeater: change role=user to role=admin
3. Forward/send — server may trust this value without validation

Scenario: JavaScript validates file extension before upload
1. Upload a .jpg file normally, capture in Burp
2. In Intercept: change the filename in Content-Disposition from shell.jpg to shell.php
3. Forward — server receives shell.php even though JS said "only jpg allowed"
```

---

## Community vs Pro Limitations — What This Means for OSCP

| Limitation | Impact | Workaround |
|-----------|--------|-----------|
| Intruder throttled ~1 req/s | Password brute force takes forever | Use Hydra or ffuf for large wordlists; Turbo Intruder extension for medium lists |
| No active scanner | Can't auto-scan for vulnerabilities | Manual testing + NSE scripts in Nmap |
| No Collaborator | Can't do out-of-band testing (SSRF, blind XXE) | Use interactsh (`https://interactsh.com`) as free alternative |
| Limited BApp extensions | Some extensions require Pro | Core extensions (Param Miner, Autorize) are free |

**OSCP exam allows Burp Suite Community or Professional.** Either works — Pro speeds things up.

---

## Quick Reference

| Task | Location | Steps |
|------|----------|-------|
| Install CA cert | Proxy → Proxy settings → Import/Export CA | Visit http://burpsuite, download, install in Firefox |
| Set scope | Target → Scope settings | Add target URL, filter history to in-scope |
| Capture request | Proxy → Intercept ON | Browse target, request appears in Intercept |
| Replay/modify request | Repeater | Right-click request → Send to Repeater → modify → Send |
| Brute force (small list) | Intruder | Send to Intruder → mark position → load wordlist → Start attack |
| Brute force (large list) | Turbo Intruder / ffuf/hydra | Install Turbo Intruder or use CLI tools |
| Decode Base64 | Decoder | Paste → Decode as Base64 |
| Diff two responses | Comparer | Send both to Comparer → Words diff |
| Find hidden params | Param Miner | Right-click request → Extensions → Param Miner → Guess params |
| Test IDOR | Autorize | Install Autorize, set low-priv cookie, browse as high-priv |

---

## Common Mistakes

> [!warning] Beginners get these wrong
> 1. **Not installing the CA cert.** Every HTTPS site shows an SSL error and you can't intercept. Install the cert before doing anything else.
> 2. **Leaving intercept ON while browsing.** You'll be constantly forwarding requests and the browser will feel frozen. Keep intercept OFF by default, turn it ON for specific requests.
> 3. **Not setting scope.** Your HTTP History fills with Google Analytics, CDN requests, and noise. Set scope first, filter to in-scope only.
> 4. **Using Intruder with rockyou.txt in Community.** At 1 req/sec, 14M passwords = 162 days. Use Hydra for big wordlists.
> 5. **Forgetting to check the response.** After sending in Repeater, actually read the response — both headers and body. The interesting thing might be in a header you're not looking at.
> 6. **Not using the Inspector panel.** Editing raw HTTP is error-prone. The Inspector panel in Repeater shows parameters, cookies, and headers in a structured tree — much easier.

---

## Practice Resources

| Resource | What to do |
|----------|-----------|
| TryHackMe — "Burp Suite: The Basics" | Proxy, Repeater, Decoder setup |
| TryHackMe — "Burp Suite: Repeater" | Deep dive on Repeater usage |
| TryHackMe — "Burp Suite: Intruder" | All four attack types with labs |
| TryHackMe — "Burp Suite: Other Modules" | Decoder, Comparer, Sequencer |
| PortSwigger Web Academy | All labs designed to be solved with Burp — the definitive practice resource |
| HTB — any web machine | Every web machine on HTB requires Burp for manual testing |
| OWASP Juice Shop | Deliberately vulnerable web app — install locally and practice all techniques |
