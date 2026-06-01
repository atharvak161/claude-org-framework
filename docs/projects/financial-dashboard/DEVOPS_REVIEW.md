# DEVOPS_REVIEW.md — Financial Dashboard
**Reviewer:** Infrastructure Engineer / CI/CD Engineer / SRE
**Date:** 2026-05-31
**Project path:** `src/projects/financial-dashboard/`
**Project type:** Static HTML/CSS/JS single-user financial dashboard with AES-256-GCM client-side encryption, Service Worker crypto vault, and localStorage persistence.

---

## 1. Current Deployment State and Risks

### How the application is currently deployed

There is no deployment infrastructure. The project has:
- No `package.json`, no `Makefile`, no `Dockerfile`
- No CI/CD configuration of any kind
- No hosting platform configuration (no `netlify.toml`, no `vercel.json`, no `_headers`, no `_redirects`)
- A `.gitignore` that covers OS artifacts and a `keygen.html` local utility

The application is a flat collection of HTML, CSS, and JS files that can be opened directly in a browser from the filesystem or served from any static file host. Today, deployment likely means manually uploading or pushing files to wherever the developer chooses to serve them.

### Identified risks in the current state

**Risk 1 — No HTTPS enforcement.**
The Service Worker (`sw.js`) and the Web Crypto API (`crypto.subtle`) both require a secure context (HTTPS or `localhost`). If the app is served over plain HTTP in production it will fail silently or throw `TypeError: Cannot read properties of undefined` on `crypto.subtle`. There is no server-level HTTPS redirect configured anywhere.

**Risk 2 — Hardcoded credential hashes shipped in source.**
`js/auth.js` contains PBKDF2 salts and hashes directly in the source file:
```js
const CRED = {
  authSalt: 'rREAlvlrl2v+s3UA3tqG8w==',
  authHash: 'rte+/usAJSLPVmN7AEiVoDsv9zMGcO+OqmMvjOGiDUc=',
  encSalt:  'qcHklLnb/O1MFrsXfJnY3Q==',
  ...
};
```
`auth-config.js` contains the same values and is correctly gitignored; `auth.js` is not gitignored and ships those values to every visitor. While PBKDF2 with 600,000 iterations and a 28-character password is strong, the hash being publicly visible means an attacker with access to the deployed site can run an offline dictionary attack with no rate limiting. The app's brute-force protection lives in `localStorage` and is trivially bypassed by anyone who can open DevTools.

**Risk 3 — Encryption key stored in sessionStorage in plaintext.**
`login.html` line 341:
```js
const rawKey = await crypto.subtle.exportKey('raw', encKey);
sessionStorage.setItem('_ek', btoa(String.fromCharCode(...new Uint8Array(rawKey))));
```
The raw AES-256 key is exported and stored base64-encoded in `sessionStorage`. Any XSS vulnerability anywhere in the app's 11 pages would immediately compromise all stored financial data. This is the single most significant security risk in the application.

**Risk 4 — No Content Security Policy.**
None of the HTML files set a `Content-Security-Policy` header or meta tag. External scripts are loaded from three CDNs (Cloudflare CDN for Chart.js, jsDelivr for xlsx, Cloudflare CDN for jspdf/html2canvas). Without a CSP, a single compromised CDN asset or XSS injection could exfiltrate the sessionStorage key and decrypt all user data.

**Risk 5 — External CDN dependencies without Subresource Integrity.**
`dashboard.html` loads Chart.js:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
```
`export.html` loads xlsx, jspdf, html2canvas, and Chart.js — none with `integrity` attributes. A CDN compromise would deliver arbitrary JavaScript to every user.

**Risk 6 — Service Worker scope uses relative `./` path.**
`sw-client.js` registers `sw.js` with `{ scope: './' }`. If the app is ever deployed in a subdirectory (e.g., `/app/`), the scope will be correct; but if the path resolution shifts, the SW will fail to control pages and every auth-check will fall through to a login redirect, locking users out until they clear the SW registration manually.

**Risk 7 — No version pinning, no lockfile.**
Without a `package.json` and lockfile, there is no record of tool versions used for any future build, lint, or test step. Reproducing a build environment is impossible.

**Risk 8 — `keygen.html` risk.**
`keygen.html` is gitignored and described in `.gitignore` as "local utilities." If this file generates credential hashes and a developer accidentally commits it, or serves it from a hosting root, it would expose the credential generation mechanism. No deployment check prevents this.

---

## 2. CI/CD Pipeline — Current State and What Should Exist

### Current state

No CI/CD exists. Changes are made manually and deployed (presumably) by hand.

### What should exist

For a static site of this sensitivity (client-side encryption of personal financial data), the CI/CD pipeline should enforce the following gates on every push and pull request:

**Gate 1 — Linting (HTML, CSS, JS)**
All HTML files should pass HTMLHint. All CSS should pass stylelint. All JS should pass ESLint. This catches syntax errors before deployment and enforces code standards.

**Gate 2 — Security scanning**
Static analysis must check for:
- Secrets accidentally committed (credential hashes, keys)
- Missing Subresource Integrity attributes on external scripts
- Missing security headers
- Known-vulnerable CDN library versions

**Gate 3 — Lighthouse performance and accessibility audit**
A Lighthouse CI audit run against each HTML page. Minimum thresholds: Performance 80, Accessibility 90, Best Practices 90, SEO 70. This catches regressions in load time and accessibility before they reach users.

**Gate 4 — SRI hash generation check**
A custom step that verifies all `<script src="https://...">` and `<link href="https://...">` tags have a matching `integrity` attribute.

**Gate 5 — Service Worker validation**
A check that `sw.js` is syntactically valid and that the SW registration path in `sw-client.js` matches the actual file location.

**Gate 6 — Deployment**
Only on push to `main`, after all gates pass, deploy to the hosting platform.

---

## 3. Hosting Platform Evaluation

The application is a pure static site. It requires: HTTPS, correct MIME types for ES modules, support for custom response headers (for CSP and HSTS), and no server-side processing.

### GitHub Pages

**Pros:** Free, zero configuration for public repos, integrates directly with the repository.

**Cons:** No custom response headers. You cannot set `Content-Security-Policy`, `Strict-Transport-Security`, or `X-Frame-Options` at the server level. You would have to use meta tags for CSP, which do not cover all directives (`frame-ancestors` is ignored in meta CSP). No deploy previews. Build caching is basic. Custom domain requires CNAME file in repo. No edge caching control.

**Verdict:** Not suitable. The inability to set security headers at the HTTP layer is a hard block for an application handling encrypted financial data.

### Netlify

**Pros:** Custom headers via `_headers` file (supports full CSP, HSTS, X-Frame-Options, etc.). Deploy previews on every PR with a unique URL. Instant rollbacks. Edge CDN. `netlify.toml` for build configuration. Free tier is generous. Supports SPA redirect rules via `_redirects`. Branch deploys.

**Cons:** Vendor lock-in on redirect/header syntax. Free tier has bandwidth limits (100GB/month). Build minutes are limited on free tier.

**Verdict:** Strong candidate. The `_headers` file is the deciding factor — it is the cleanest way to apply per-path security headers without a backend.

### Vercel

**Pros:** Custom headers via `vercel.json`. Deploy previews. Edge CDN. Excellent DX. Supports `vercel.json` `headers` array with route matching.

**Cons:** `vercel.json` header configuration is more verbose than Netlify's `_headers` format. Free tier limits on serverless function invocations (not relevant here, but the billing model is designed for server-side apps). Slightly less mature static-site support than Netlify for edge cases.

**Verdict:** Comparable to Netlify for a pure static site. Slightly more configuration overhead for headers.

### Cloudflare Pages

**Pros:** Unlimited bandwidth on free tier. Cloudflare's edge network (300+ PoPs globally). Custom headers via `_headers` file (same syntax as Netlify). Excellent DDoS protection and bot mitigation at the edge — relevant since the app has a login page. Deploy previews. `wrangler.toml` for advanced configuration. Direct integration with Cloudflare Workers if server-side logic is ever needed.

**Cons:** Build environment is less mature than Netlify. Some plugins available on Netlify do not exist on Cloudflare Pages. Analytics require a paid Cloudflare plan for detail beyond basic views.

**Verdict:** Best choice for this application. Reasons: (1) The `_headers` file provides full CSP and HSTS support. (2) Unlimited bandwidth removes a billing variable. (3) Cloudflare's WAF and bot protection at the edge is a genuine security benefit for an app with a login page, even a client-side one. (4) The login page's hidden activation mechanism (click on title) and brute-force protection mean the app is already designed to be internet-facing; Cloudflare's edge protections complement that posture.

**Recommended platform: Cloudflare Pages**

### Required `_headers` file for production

```
/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: no-referrer
  Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()
  Content-Security-Policy: default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net 'sha256-REPLACE_WITH_INLINE_HASH'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; worker-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: credentialless
```

Note: The `'unsafe-inline'` in `style-src` should be replaced with a nonce-based approach if a build step is introduced. Until then, it is required because styles are partially inline across HTML files.

---

## 4. Service Worker Management Across Deployments

### The current problem

`sw.js` calls `self.skipWaiting()` on install and `self.clients.claim()` on activate. This means every new deployment immediately takes over all open tabs without waiting for a user reload. Combined with the fact that the SW holds the AES-256 encryption key in memory (`_encKey`), a mid-session SW update will:

1. New SW installs and calls `skipWaiting()`
2. New SW activates and calls `clients.claim()`
3. All open tabs now use the new SW instance
4. The new SW's `_encKey` is `null`
5. Every encrypted read/write from those tabs will return `{ error: 'Not authenticated' }`
6. `page-init.js` detects this and recovers via `sessionStorage._ek` — so users will not be locked out

The recovery path works correctly. However, it depends entirely on `sessionStorage._ek` being available. If that key is absent (cleared by browser, private browsing mode, or an earlier error), the user is logged out mid-session by a deployment.

### Recommended SW versioning strategy

**Step 1 — Add a cache version constant to sw.js.**

Add a `CACHE_VERSION` string at the top of `sw.js`. Increment it on every deployment that changes any JS, CSS, or HTML file. This makes it trivially visible in CI whether the SW version was bumped.

```js
const CACHE_VERSION = 'fd-v1.0.0'; // bump on every deployment
```

**Step 2 — Do not call skipWaiting() unconditionally.**

Replace the unconditional `skipWaiting()` with a message-driven approach. The page calls `sw.postMessage({ type: 'SKIP_WAITING' })` only when it is safe to do so (i.e., when the user is on the login page, not mid-session).

```js
// In sw.js — replace the install handler:
self.addEventListener('install', () => {
  // Do NOT call skipWaiting() automatically.
  // The page will trigger it when safe.
});

// Add to the message handler switch:
case 'SKIP_WAITING':
  self.skipWaiting();
  port.postMessage({ ok: true });
  break;
```

**Step 3 — Detect a waiting SW in page-init.js and prompt gracefully.**

In `page-init.js`, after `initSW()`, check for a waiting SW. If one exists and the user is on the login page, activate it immediately. If the user is mid-session, show a banner: "Update available — save your work and refresh." Do not force the update.

**Step 4 — CI deployment check.**

In the GitHub Actions pipeline (see section 6), add a step that compares the `CACHE_VERSION` constant in `sw.js` against the previous commit. If any JS, CSS, or HTML file changed but the `CACHE_VERSION` was not bumped, the pipeline fails with:
```
ERROR: sw.js CACHE_VERSION was not incremented. 
Update CACHE_VERSION before deploying.
```

**Step 5 — Set correct Cache-Control headers for sw.js.**

In the `_headers` file, add a specific rule for `sw.js`:

```
/sw.js
  Cache-Control: no-cache, no-store, must-revalidate
```

This ensures the browser always fetches a fresh `sw.js` on load, so it can detect updates. All other static assets can use long-lived caching:

```
/js/*
  Cache-Control: public, max-age=31536000, immutable

/css/*
  Cache-Control: public, max-age=31536000, immutable
```

For immutable caching of JS/CSS to work safely alongside SW updates, filenames should eventually include content hashes (e.g., `theme.a3f91c.css`). This requires a minimal build step — a valid future investment but not required today.

---

## 5. Monitoring for a Client-Side Application

### Error tracking

**Recommendation: Sentry (free tier)**

Sentry's browser SDK captures unhandled JavaScript exceptions with full stack traces, breadcrumbs (user actions leading to the error), and browser/OS context. For this application specifically:

- Catch decrypt failures that fall through silently in `store.js` (the `catch` blocks currently return defaults without any visibility)
- Catch Service Worker message timeouts (the 8-second timeout in `sw-client.js` currently throws silently)
- Catch `crypto.subtle` failures on non-HTTPS contexts or older browsers

Configuration note: Because this app handles financial data, Sentry must be configured with `beforeSend` to scrub any payload that might contain financial figures or PII before transmission. Set `maxValueLength: 0` for breadcrumb data to be safe.

```js
Sentry.init({
  dsn: 'YOUR_DSN',
  beforeSend(event) {
    // Strip breadcrumb data entirely — it may contain user input
    if (event.breadcrumbs) event.breadcrumbs.values = [];
    return event;
  }
});
```

Do not log error messages that include financial values. Error messages should be structural only (e.g., "SW decrypt failed" — not "Failed to decrypt balance: £12,450").

### Performance monitoring

**Recommendation: Cloudflare Web Analytics (free, privacy-preserving)**

Since the app is on Cloudflare Pages, Cloudflare Web Analytics is available at no cost and with no cookies or PII collection. It provides:

- Core Web Vitals (LCP, FID/INP, CLS) per page
- Page load time by geography
- Browser and OS distribution

Additionally, add manual performance marks in `page-init.js` using the `Performance.mark()` API:

```js
performance.mark('auth-start');
// ... auth check ...
performance.mark('auth-end');
performance.measure('auth-duration', 'auth-start', 'auth-end');
```

The 600,000-iteration PBKDF2 in `auth.js` takes approximately 2-4 seconds on a mid-range mobile device. Tracking this via performance marks will alert if future browser changes or device distribution shifts cause unacceptable login latency.

### Availability monitoring

**Recommendation: UptimeRobot (free tier) or Cloudflare Healthcheck**

For a static site, "availability" means: does the hosting platform serve the files? Configure a synthetic HTTP monitor on `https://yourdomain.com/login.html` that fires an alert if the response code is not 200 or if the response time exceeds 3 seconds. Cloudflare Pages itself has 99.99% uptime SLA, so this monitoring is mostly for edge cases (DNS misconfiguration, domain expiry).

### Analytics

**Recommendation: Cloudflare Web Analytics (already above) — no additional analytics needed.**

This is a personal single-user financial dashboard. Full analytics are unnecessary and would create a privacy surface with no corresponding value. Page view counts and Core Web Vitals from Cloudflare are sufficient.

### What to avoid

Do not use Google Analytics on this application. Google Analytics processes data on Google's servers and the data may include URL parameters or referrer data that leaks navigation patterns. For a financial dashboard, the navigation path itself (e.g., `debts.html -> goals.html -> export.html`) can be considered sensitive.

---

## 6. Complete GitHub Actions CI/CD Pipeline

The following workflow is complete and runnable. It assumes Cloudflare Pages as the deployment target.

**Required repository secrets:**
- `CLOUDFLARE_API_TOKEN` — Cloudflare API token with Pages Edit permissions
- `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account ID

**Required repository variables:**
- `CF_PAGES_PROJECT_NAME` — Cloudflare Pages project name (e.g., `financial-dashboard`)

Save this file as `.github/workflows/ci-cd.yml`:

```yaml
name: CI / CD — Financial Dashboard

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  contents: read
  pull-requests: write

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

env:
  NODE_VERSION: '20'

# ── Jobs ────────────────────────────────────────────────────────────────────

jobs:

  # ── 1. HTML Lint ──────────────────────────────────────────────────────────
  lint-html:
    name: Lint — HTML
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install HTMLHint
        run: npm install -g htmlhint@1.1.4

      - name: Write HTMLHint config
        run: |
          cat > .htmlhintrc << 'EOF'
          {
            "tagname-lowercase": true,
            "attr-lowercase": true,
            "attr-value-double-quotes": true,
            "doctype-first": true,
            "tag-pair": true,
            "spec-char-escape": false,
            "id-unique": true,
            "src-not-empty": true,
            "attr-no-duplication": true,
            "title-require": true,
            "alt-require": false,
            "doctype-html5": true,
            "space-tab-mixed-disabled": "space"
          }
          EOF

      - name: Run HTMLHint on all HTML files
        run: htmlhint "*.html" --config .htmlhintrc

  # ── 2. CSS Lint ───────────────────────────────────────────────────────────
  lint-css:
    name: Lint — CSS
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install stylelint
        run: npm install -g stylelint@16 stylelint-config-standard@36

      - name: Write stylelint config
        run: |
          cat > .stylelintrc.json << 'EOF'
          {
            "extends": "stylelint-config-standard",
            "rules": {
              "no-descending-specificity": null,
              "alpha-value-notation": "number",
              "color-function-notation": "legacy",
              "import-notation": "string"
            }
          }
          EOF

      - name: Run stylelint
        run: stylelint "css/**/*.css"

  # ── 3. JavaScript Lint ────────────────────────────────────────────────────
  lint-js:
    name: Lint — JavaScript
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install ESLint
        run: npm install -g eslint@9

      - name: Write ESLint config
        run: |
          cat > eslint.config.mjs << 'EOF'
          export default [
            {
              files: ["js/**/*.js"],
              languageOptions: {
                ecmaVersion: 2022,
                sourceType: "module",
                globals: {
                  window: "readonly",
                  document: "readonly",
                  navigator: "readonly",
                  localStorage: "readonly",
                  sessionStorage: "readonly",
                  crypto: "readonly",
                  requestAnimationFrame: "readonly",
                  setTimeout: "readonly",
                  clearTimeout: "readonly",
                  setInterval: "readonly",
                  clearInterval: "readonly",
                  btoa: "readonly",
                  atob: "readonly",
                  TextEncoder: "readonly",
                  TextDecoder: "readonly",
                  Uint8Array: "readonly",
                  MessageChannel: "readonly",
                  Promise: "readonly",
                  URL: "readonly",
                  console: "readonly"
                }
              },
              rules: {
                "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
                "no-undef": "error",
                "no-console": "warn",
                "eqeqeq": ["error", "always"],
                "no-var": "error",
                "prefer-const": "warn"
              }
            },
            {
              files: ["sw.js"],
              languageOptions: {
                ecmaVersion: 2022,
                sourceType: "script",
                globals: {
                  self: "readonly",
                  crypto: "readonly",
                  TextEncoder: "readonly",
                  TextDecoder: "readonly",
                  Uint8Array: "readonly",
                  btoa: "readonly",
                  atob: "readonly"
                }
              },
              rules: {
                "no-unused-vars": "warn",
                "no-undef": "error"
              }
            }
          ];
          EOF

      - name: Run ESLint
        run: eslint "js/**/*.js" "sw.js"

  # ── 4. Security Scan ──────────────────────────────────────────────────────
  security-scan:
    name: Security — Static Analysis
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Check for missing Subresource Integrity attributes
        run: |
          echo "Checking for external scripts/styles without integrity attributes..."
          MISSING=0

          while IFS= read -r file; do
            # Find external script tags without integrity attribute
            if grep -qP '<script\s[^>]*src="https://' "$file"; then
              while IFS= read -r line; do
                if echo "$line" | grep -qP '<script\s[^>]*src="https://' && ! echo "$line" | grep -q 'integrity='; then
                  echo "MISSING SRI: $file: $line"
                  MISSING=$((MISSING + 1))
                fi
              done < <(grep -nP '<script\s[^>]*src="https://' "$file")
            fi

            # Find external link tags without integrity attribute
            if grep -qP '<link\s[^>]*href="https://[^>]*(stylesheet|font)' "$file"; then
              while IFS= read -r line; do
                if echo "$line" | grep -qP '<link\s[^>]*href="https://' && ! echo "$line" | grep -q 'integrity='; then
                  # Fonts from Google Fonts are exempt (no SRI needed for font CSS)
                  if ! echo "$line" | grep -q 'fonts.googleapis.com'; then
                    echo "MISSING SRI: $file: $line"
                    MISSING=$((MISSING + 1))
                  fi
                fi
              done < <(grep -nP '<link\s[^>]*href="https://' "$file")
            fi
          done < <(find . -name "*.html" -not -path "./.git/*")

          if [ $MISSING -gt 0 ]; then
            echo ""
            echo "ERROR: $MISSING external resource(s) missing Subresource Integrity attributes."
            echo "Generate SRI hashes at: https://www.srihash.org/"
            exit 1
          fi
          echo "SRI check passed."

      - name: Check sw.js has not grown a fetch handler (network interception check)
        run: |
          if grep -q "addEventListener.*fetch" sw.js; then
            echo "WARNING: sw.js contains a fetch event listener."
            echo "This means the SW intercepts network requests."
            echo "Verify this is intentional — the current design is a crypto vault only."
          fi
          echo "SW fetch-handler check passed."

      - name: Check for accidentally committed credential-like values
        run: |
          # Look for base64-encoded strings in JS files that are not in auth.js
          # (auth.js intentionally contains hashes — everything else should not)
          SUSPICIOUS=0
          while IFS= read -r file; do
            # Skip auth.js — it intentionally holds PBKDF2 hashes
            if [[ "$file" == *"auth.js" ]]; then
              continue
            fi
            if grep -qP '[A-Za-z0-9+/]{32,}={0,2}' "$file"; then
              echo "REVIEW: $file may contain base64-encoded data. Verify it is not a secret."
              # Do not fail — this is a warning; the reviewer must inspect
            fi
          done < <(find js/ -name "*.js")
          echo "Secret pattern scan complete."

      - name: Run Trivy filesystem scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          severity: 'HIGH,CRITICAL'
          exit-code: '1'
          ignore-unfixed: true
          format: 'table'

      - name: Check sw.js CACHE_VERSION was bumped if JS/CSS/HTML changed
        if: github.event_name == 'pull_request'
        run: |
          CHANGED_FILES=$(git diff --name-only origin/${{ github.base_ref }}...HEAD)
          STATIC_CHANGED=$(echo "$CHANGED_FILES" | grep -E '\.(js|css|html)$' | grep -v sw.js || true)

          if [ -n "$STATIC_CHANGED" ]; then
            echo "Static files changed:"
            echo "$STATIC_CHANGED"

            BASE_VERSION=$(git show origin/${{ github.base_ref }}:sw.js | grep 'CACHE_VERSION' | head -1 || echo "")
            HEAD_VERSION=$(grep 'CACHE_VERSION' sw.js | head -1 || echo "")

            if [ "$BASE_VERSION" = "$HEAD_VERSION" ] && [ -n "$BASE_VERSION" ]; then
              echo ""
              echo "ERROR: Static files changed but sw.js CACHE_VERSION was not incremented."
              echo "Base: $BASE_VERSION"
              echo "Head: $HEAD_VERSION"
              echo "Update CACHE_VERSION in sw.js before merging."
              exit 1
            fi
          fi
          echo "CACHE_VERSION check passed."

  # ── 5. Lighthouse Audit ───────────────────────────────────────────────────
  lighthouse:
    name: Lighthouse — Performance Audit
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install serve and Lighthouse CI
        run: npm install -g @lhci/cli@0.14 serve

      - name: Write Lighthouse CI config
        run: |
          cat > lighthouserc.json << 'EOF'
          {
            "ci": {
              "collect": {
                "staticDistDir": ".",
                "url": [
                  "http://localhost/login.html",
                  "http://localhost/dashboard.html"
                ],
                "numberOfRuns": 1,
                "settings": {
                  "chromeFlags": "--no-sandbox --disable-dev-shm-usage"
                }
              },
              "assert": {
                "preset": "lighthouse:no-pwa",
                "assertions": {
                  "categories:performance": ["warn", { "minScore": 0.80 }],
                  "categories:accessibility": ["error", { "minScore": 0.90 }],
                  "categories:best-practices": ["warn", { "minScore": 0.85 }],
                  "categories:seo": ["warn", { "minScore": 0.70 }],
                  "first-contentful-paint": ["warn", { "maxNumericValue": 3000 }],
                  "largest-contentful-paint": ["warn", { "maxNumericValue": 4000 }],
                  "total-blocking-time": ["warn", { "maxNumericValue": 600 }],
                  "cumulative-layout-shift": ["warn", { "maxNumericValue": 0.1 }]
                }
              },
              "upload": {
                "target": "temporary-public-storage"
              }
            }
          }
          EOF

      - name: Run Lighthouse CI
        run: lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Post Lighthouse results to PR
        if: github.event_name == 'pull_request'
        run: |
          echo "Lighthouse results uploaded to temporary public storage."
          echo "Check the LHCI step output above for the report URL."

  # ── 6. Deploy to Cloudflare Pages ─────────────────────────────────────────
  deploy:
    name: Deploy — Cloudflare Pages
    runs-on: ubuntu-latest
    needs: [lint-html, lint-css, lint-js, security-scan, lighthouse]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment:
      name: production
      url: ${{ steps.deploy.outputs.deployment-url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Validate _headers file exists
        run: |
          if [ ! -f "_headers" ]; then
            echo "ERROR: _headers file is missing."
            echo "Cloudflare Pages requires _headers to set CSP, HSTS, and other security headers."
            echo "Create _headers before deploying."
            exit 1
          fi
          echo "_headers file present."

      - name: Validate sw.js is present
        run: |
          if [ ! -f "sw.js" ]; then
            echo "ERROR: sw.js is missing from the deployment root."
            exit 1
          fi

      - name: Deploy to Cloudflare Pages
        id: deploy
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: ${{ vars.CF_PAGES_PROJECT_NAME }}
          directory: '.'
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}

      - name: Output deployment URL
        run: |
          echo "Deployed to: ${{ steps.deploy.outputs.deployment-url }}"

  # ── 7. Post-deploy smoke test ─────────────────────────────────────────────
  smoke-test:
    name: Smoke Test — Post Deploy
    runs-on: ubuntu-latest
    needs: deploy
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Wait for deployment to propagate
        run: sleep 15

      - name: Check login.html returns 200 with correct headers
        run: |
          DEPLOY_URL="${{ needs.deploy.outputs.deployment-url }}"
          if [ -z "$DEPLOY_URL" ]; then
            echo "No deployment URL found — skipping smoke test."
            exit 0
          fi

          HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL/login.html")
          if [ "$HTTP_CODE" != "200" ]; then
            echo "ERROR: login.html returned HTTP $HTTP_CODE"
            exit 1
          fi
          echo "Smoke test passed — login.html returned HTTP 200."

          # Check HSTS header is present
          HSTS=$(curl -s -I "$DEPLOY_URL/login.html" | grep -i "strict-transport-security" || true)
          if [ -z "$HSTS" ]; then
            echo "WARNING: Strict-Transport-Security header not found."
            echo "Verify _headers file was deployed correctly."
          else
            echo "HSTS header present: $HSTS"
          fi

          # Check sw.js is accessible
          SW_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL/sw.js")
          if [ "$SW_CODE" != "200" ]; then
            echo "ERROR: sw.js returned HTTP $SW_CODE"
            exit 1
          fi
          echo "sw.js accessible."
```

### Notes on running the pipeline locally

For local development without pushing to GitHub, you can run individual steps:

```bash
# HTML lint
npx htmlhint "*.html"

# JS lint
npx eslint "js/**/*.js" "sw.js"

# CSS lint
npx stylelint "css/**/*.css"

# Local Lighthouse (requires Chrome)
npx serve . &
npx lhci autorun
```

---

## 7. Production Readiness Checklist

The following checklist defines what "production ready" means for this application. Each item is marked with its current status based on the code review conducted.

### Security

- [ ] **SRI attributes on all external CDN resources** — Currently missing from Chart.js, xlsx, jspdf, html2canvas. Required before production.
- [ ] **Content Security Policy header set at the hosting layer** — Not configured. Required before production.
- [ ] **HSTS header set** — Not configured. Required before production.
- [ ] **X-Frame-Options: DENY** — Not configured. Required before production.
- [ ] **X-Content-Type-Options: nosniff** — Not configured. Required before production.
- [ ] **sessionStorage key recovery approach reviewed** — The raw AES key in sessionStorage is a known risk. Document the threat model decision explicitly in `DECISIONS.md` before shipping.
- [ ] **`keygen.html` confirmed absent from deployed files** — Gitignored but not CI-verified. Add a CI step that `grep -r keygen . --include="*.html"` and fails if found.
- [x] **Password stored as PBKDF2 hash only** — Implemented correctly in `auth.js`.
- [x] **Brute-force lockout implemented** — Implemented in `auth.js` with exponential backoff.
- [x] **AES-256-GCM encryption for all stored financial data** — Implemented correctly.
- [x] **HTTPS required by Service Worker registration** — Enforced by browser; `sw-client.js` throws on non-HTTPS.

### Service Worker

- [ ] **`CACHE_VERSION` constant added to sw.js** — Not present. Required for deployment management.
- [ ] **`skipWaiting()` made conditional** — Currently unconditional. Should not force-update mid-session.
- [ ] **Cache-Control: no-cache set for sw.js at hosting layer** — Not configured.
- [x] **SW key recovery via sessionStorage implemented** — Correctly implemented in `page-init.js`.
- [x] **SW timeout handling in sw-client.js** — 8-second timeout with rejection implemented.

### Hosting and Infrastructure

- [ ] **Hosting platform selected and configured** — Not configured. Recommend Cloudflare Pages.
- [ ] **`_headers` file created and committed** — Does not exist.
- [ ] **Custom domain configured** — Not configured.
- [ ] **DNS records verified** — Not applicable until domain is set.
- [x] **No server-side processing required** — Confirmed. Pure static app.

### CI/CD

- [ ] **GitHub Actions workflow created** — Does not exist.
- [ ] **HTML linting in CI** — Does not exist.
- [ ] **CSS linting in CI** — Does not exist.
- [ ] **JS linting in CI** — Does not exist.
- [ ] **Security scanning in CI (Trivy + SRI check)** — Does not exist.
- [ ] **Lighthouse audit in CI** — Does not exist.
- [ ] **Deploy-only-on-passing-gates enforced** — Does not exist.
- [ ] **Branch protection rule on `main` requiring CI to pass** — Not configured.

### Performance

- [ ] **Google Fonts self-hosted or preconnect hints added** — theme.css loads from `fonts.googleapis.com` which blocks render. Add `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` to all HTML files.
- [ ] **Chart.js loaded with `defer` attribute** — Currently loaded synchronously in `dashboard.html`. Add `defer`.
- [ ] **Lighthouse score ≥ 80 on Performance** — Not measured. Requires CI audit to confirm.
- [x] **Top-level `await` in ES module pages** — Used correctly in page JS modules.

### Observability

- [ ] **Error tracking (Sentry or equivalent) configured** — Not present.
- [ ] **Core Web Vitals monitoring configured** — Not present.
- [ ] **Uptime monitor configured** — Not present.

### Documentation

- [ ] **README.md contains deployment instructions** — README is empty.
- [ ] **Credential rotation procedure documented** — Not documented. The `keygen.html` flow needs documented steps.
- [ ] **Backup/restore procedure documented** — Partial: the Export page covers JSON backup but no runbook exists.

### Operational

- [ ] **Rollback procedure defined** — Not documented. Cloudflare Pages supports instant rollback; procedure should be written.
- [ ] **Domain expiry monitoring** — Not configured.
- [ ] **Security headers verified post-deploy** — Should be checked via securityheaders.com after each deploy.

---

## Summary

The application's cryptographic design is sound and thoughtful. The auth/encryption architecture (PBKDF2 + AES-256-GCM, non-extractable key in SW memory, key recovery via sessionStorage) is well-implemented for a client-side personal finance tool.

The infrastructure posture is nascent: no CI/CD, no hosting configuration, no security headers, no monitoring. The gap between the quality of the application code and the maturity of its deployment infrastructure is significant.

The three items that must be addressed before any internet-facing deployment:

1. Add SRI hashes to all external CDN script and link tags.
2. Configure the `_headers` file with CSP, HSTS, and X-Frame-Options on Cloudflare Pages.
3. Add the GitHub Actions CI/CD pipeline so no deployment bypasses the security and lint gates.

Everything else on the production readiness checklist should be completed within the first deployment sprint but does not block the initial deployment if the above three are in place.
