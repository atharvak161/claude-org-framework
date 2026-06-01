# Architecture Review — Financial Dashboard
**Reviewed:** 2026-05-31  
**Reviewer:** Solution Architect  
**Project location:** `/Users/atharva/Downloads/organisation/src/projects/financial-dashboard/`  
**Codebase size:** 13 HTML pages, 14 core JS modules, 11 page-level JS modules, 3 CSS files, 1 service worker

---

## 1. Architectural Pattern in Use — Is It Appropriate?

### What pattern is being used

The project implements a **vanilla-JS multi-page application (MPA) with a service worker crypto vault**. Each route is a standalone `.html` file that loads its own `<script type="module">` entry point. Shared concerns — auth checking, state hydration, sidebar and topbar injection — are centralised in `js/page-init.js`, which every page module calls at the top via a top-level `await`:

```js
const state = await initPage('income');  // js/pages/income.js, line 13
render(state);
```

The pattern breaks down as follows:

| Concern | How handled |
|---|---|
| Routing | Native browser navigation (full page load per route) |
| Auth guard | `page-init.js` → `sw-client.js` CHECK_AUTH before any render |
| State | `store.js` reads all 10 `fin_*` localStorage keys via SW decrypt on every page load |
| Persistence | `localStorage` with AES-256-GCM ciphertext; key held in service worker memory |
| Rendering | Direct `innerHTML` assignment from template-literal strings |
| Charts | Chart.js 4.4.1 loaded from CDN, instantiated per-page |
| Layout | `shared-layout.js` injects sidebar and topbar HTML on every page |

There is no build tool, no bundler, no framework, and no npm dependency. All external libraries are CDN-loaded: Chart.js, SheetJS (XLSX), html2canvas, jsPDF.

### Is it appropriate for a personal finance dashboard?

**Yes, broadly.** For a single-user, local-only personal finance tracker without a backend, this architecture is defensible. The absence of a framework eliminates a large attack surface and dependency chain. The crypto design using a non-extractable-in-SW `CryptoKey` with PBKDF2 at 600,000 iterations is genuinely sophisticated for a personal project.

However, there are material architectural mismatches that are explained in section 6.

---

## 2. State Management — How It Works and the Risks

### Mechanism

State is not held in memory across pages. Every page navigation triggers a full reload, which re-runs `initPage()` in `page-init.js`, which calls `loadAll()` in `store.js`. This decrypts all 10 `fin_*` keys from `localStorage` in parallel via `Promise.allSettled`. The decrypted state object is passed to the page render function and then discarded when the page unloads.

Within a single page, state lives in a plain JS object (`const state = ...`) that is mutated directly. There is no reactive system. After a save, affected page sections re-render by calling `render(st)` again. This is a **shared mutable object** pattern with no immutability enforcement.

### Key-to-state duplication

`inrGbpRate` is stored in both `fin_profile` and `fin_settings`. When the user changes it in `settings-page.js` (line 80), both keys are updated simultaneously:
```js
v => { p.inrGbpRate=v; state.settings.inrGbpRate=v;
       autoSave('fin_profile',p); autoSave('fin_settings',state.settings); }
```
If either save fails or times out, the two values diverge silently. Pages that read `state.settings?.inrGbpRate` (most) and pages that fall back to `state.profile?.inrGbpRate` (overview) would show different exchange rates.

`wealthTargetGBP` is similarly duplicated in `fin_profile` and `fin_goals`.

### Decrypt-on-every-navigation overhead

Each page load issues 10 sequential `postMessage` calls through the MessageChannel to the service worker for decryption. At 600,000 PBKDF2 iterations the *key derivation* happens once at login; however, the symmetric decrypt of 10 blobs per page load adds measurable latency (estimate: 20–80ms on mid-range hardware). This is invisible on a fast device but becomes noticeable on mobile.

### Risks

1. **Race condition on concurrent saves.** Two `save()` calls issued concurrently (e.g. `autoSave('fin_profile', ...)` and `autoSave('fin_settings', ...)`) each encrypt asynchronously. If one completes and the other fails, `localStorage` is in a partially-updated state. There is no transaction mechanism.

2. **Silent decrypt fallback masks corruption.** In `store.js` line 27–28, a decrypt failure silently returns the default value. If `fin_income` becomes corrupt for any reason, the user will see default income data with no error, and any subsequent save will overwrite the corrupt entry with default data — unrecoverable data loss with no warning.

3. **Mutable shared state.** Because all page modules mutate `state.*` directly, a subtle bug in any module (e.g. accidentally clearing `state.investments.ulips`) would persist to `localStorage` on the next `save()` call. There is no snapshot, undo, or dirty-checking mechanism.

4. **No cross-tab protection.** If the user opens two browser tabs, both tabs will hold decrypted state objects in memory that diverge as soon as either tab saves. The second save will silently overwrite the first.

---

## 3. Service Worker — Interaction and Caching Risks

### How the SW interacts with the application

`sw.js` is a **non-caching service worker** used exclusively as an in-memory crypto vault. It holds a single `_encKey` AES-256-GCM `CryptoKey` in memory and exposes a `MessageChannel`-based API:

- `SET_KEY` — stores the key after login
- `CHECK_AUTH` — returns whether `_encKey !== null`
- `ENCRYPT` / `DECRYPT` — performs symmetric operations
- `LOCK` — wipes `_encKey`

Crucially, the SW does **not** intercept fetch events, does not cache any resources, and does not implement background sync. It functions purely as a key escrow mechanism across page navigations.

The design rationale is sound: a `CryptoKey` stored in the SW survives page navigation but is cleared when the browser terminates all service worker clients — a natural session boundary. The fallback mechanism stores the raw key material in `sessionStorage._ek` (login.html, line 341) so that if the SW is terminated by the browser between navigations, `page-init.js` can re-import and re-send the key without requiring re-authentication.

### Caching risks with financial data

There are no SW-level caching risks with financial data because the SW never caches anything. However, there are adjacent risks:

1. **The `_ek` sessionStorage value is the raw AES-256 key in base64.** If an attacker can execute JS in the page origin (XSS), they can exfiltrate `sessionStorage._ek`, import it as a `CryptoKey`, and decrypt all `localStorage` data. This is the most significant security exposure. The non-extractable flag on the `CryptoKey` inside the SW is bypassed because the key is exported to raw bytes at login (auth is in `login.html`, line 340) for sessionStorage recovery.

2. **SW update race on deploy.** `sw.js` installs immediately with `self.skipWaiting()`. If a new version of `sw.js` is deployed that changes the key format or encryption algorithm, in-flight users will have the old page JS running against the new SW, potentially causing decrypt failures across all 10 data keys. There is no version handshake.

3. **SW termination window.** On some browsers (notably Safari), the SW can be terminated within seconds of inactivity. The recovery path works but introduces a round-trip: page-init waits up to 1 second for `controllerchange` before proceeding (page-init.js lines 43–50). If the SW starts up in that window, the auth check may fire before `SET_KEY` completes, triggering a spurious redirect to login.

4. **No fetch interception means no offline capability.** External CDN resources (Chart.js, XLSX, html2canvas, jsPDF) will fail in offline mode. The application is entirely non-functional without internet access despite having a service worker.

---

## 4. Multi-Page Architecture — Right Choice or SPA?

### Arguments for keeping MPA

- **Isolation.** Each page loads exactly the code it needs. A bug in `js/pages/debts.js` cannot corrupt the DOM of `js/pages/income.js`.
- **Simplicity.** No client-side router, no history API complexity, no hydration mismatch. Any developer who knows HTML and JS can read and understand it.
- **Fast initial paint.** Each page is a minimal HTML shell; there is no global JS bundle to parse.
- **Personal use.** The dataset is small. The 10-key decrypt overhead per navigation is acceptable.

### Arguments for SPA

- **State re-decrypt on every navigation is redundant.** The entire state object (`~5–20KB` of structured data) is decrypted from scratch on every page load. An SPA would decrypt once and cache in memory.
- **Sidebar and topbar are re-rendered on every navigation** via `renderSharedLayout()`. In an MPA, the browser destroys and recreates the entire DOM; any collapse state held in the sidebar must be persisted to localStorage and read back.
- **Chart.js is loaded from CDN on every page** (13 separate HTTP requests to `cdnjs.cloudflare.com`). With no caching SW, if CDN is slow, every navigation shows blank charts momentarily.
- **Code duplication.** Chart theme constants (`C`, `baseOpts`) are copy-pasted into `dashboard.js`, `analytics.js`, `expenses.js`, `debts.js`, `assets.js`, `networth.js`, `goals.js`, `tax.js` — 8 files — rather than consistently importing from `chart-theme.js` (which exists but is only used in some pages). The same `getCtx()` function is redefined in every page module.

### Verdict

For this project's scope, the MPA is acceptable and arguably correct given the single-user, no-backend constraint. However, the architecture would benefit from a **hybrid approach**: keep MPA routing but move to a **SW-cached asset layer** so that Chart.js and fonts are served locally, and implement a **shared in-memory state module** that survives soft navigations within a session via `sessionStorage` or a BroadcastChannel.

Converting to a full SPA (React, Vue, etc.) would be over-engineering for a personal tool. Converting to a build-tooled vanilla MPA with a proper asset cache SW would be the practical upgrade.

---

## 5. Recommended Architecture If Starting Fresh

### Recommended approach: Build-tooled Vanilla MPA with SW asset cache

```
financial-dashboard/
├── src/
│   ├── pages/           # One entry point per route (Vite MPA mode)
│   ├── lib/
│   │   ├── store.ts     # Typed state store with Zod validation
│   │   ├── crypto.ts    # Auth + encryption (unchanged logic, better types)
│   │   ├── calc.ts      # Pure functions (already well-designed, add types)
│   │   └── charts.ts    # Single chart factory, no duplication
│   └── components/
│       ├── Sidebar.ts   # Web Component (Shadow DOM = isolated CSS)
│       └── Topbar.ts    # Web Component
├── sw.ts                # Workbox-based: asset cache + crypto vault
└── vite.config.ts       # MPA entry points + TypeScript
```

**Key architectural changes:**

1. **TypeScript throughout.** The current codebase uses entirely untyped JavaScript. `state.investments.ulips[0].currentValue` is `any`. A type error in a path traversal (e.g. `attachInvAutoSave()` in `ui.js` lines 640–661) would be caught at compile time rather than silently producing `NaN`.

2. **Zod or similar schema validation on load.** Rather than silently falling back to defaults on decrypt failure, validate the decrypted payload against a schema. Log what failed. Make the fallback explicit rather than invisible.

3. **Eliminate state duplication.** `inrGbpRate` and `wealthTargetGBP` should exist in exactly one store key. Derived values should be computed, not stored.

4. **Workbox for SW asset caching.** Cache all JS, CSS, and fonts at install time. This eliminates CDN dependency for runtime operation and enables offline use.

5. **A single chart utilities module.** `getCtx`, the `C` colour object, and `baseOpts` should exist once, imported by all page modules. `chart-theme.js` was created for this purpose but is inconsistently adopted.

6. **Immutable state updates.** On any save, produce a new state snapshot rather than mutating in place. Store a last-known-good state in memory for undo on save failure.

7. **Separate `auth-config.js` from the repo.** Currently `auth.js` embeds the PBKDF2 salts and hashes directly in the source file. `auth-config.js` (which is `.gitignore`-d) duplicates them. The credential data should live in a single file that is git-ignored, not duplicated.

---

## 6. Top 5 Architectural Weaknesses (in order of severity)

### Weakness 1 — Raw key material in sessionStorage (CRITICAL)

**File:** `login.html` lines 339–342; `page-init.js` lines 15–30

The AES-256-GCM key is exported to raw bytes and stored as base64 in `sessionStorage._ek`. Any successful XSS on `localhost` or whatever origin hosts this can exfiltrate the key and decrypt all localStorage data offline. The design comment in `auth.js` line 59 acknowledges this as a necessary trade-off (`extractable: needed for sessionStorage recovery`), but the consequence is severe: the non-extractable key in the SW is a security theatre if the extractable raw bytes sit in sessionStorage.

**Recommended fix:** Use a `CryptoKey` that is `extractable: false` and implement SW recovery via a re-authentication prompt rather than sessionStorage persistence. Alternatively, use an IndexedDB-backed keystore (though this has its own attack surface). At minimum, add a CSP header that prevents inline script and restricts `script-src` to self.

### Weakness 2 — Credential hashes hardcoded in source file (HIGH)

**File:** `auth.js` lines 6–11; `auth-config.js` lines 5–11

The PBKDF2 salts and hashes appear in `auth.js` which is committed to the repository. While `auth-config.js` is `.gitignore`-d (the file comment states "NEVER COMMIT"), the comment at the top of `auth.js` contains no such warning — it merely notes the credentials are hashed. The git log of the repository therefore permanently contains these credential hashes. While PBKDF2 at 600,000 iterations with SHA-256 makes offline cracking expensive, anyone with access to the repo history can attempt it indefinitely against a known hash. The credential data should be in exactly one `.gitignore`-d file only.

### Weakness 3 — Personal financial data as source-code defaults (HIGH)

**File:** `defaults.js`

The `DEFAULTS` constant in `defaults.js` contains specific values: `baseSalaryGBP: 28000`, `outstandingINR: 2752000`, pension providers, ULIP policy details, SBI loan terms, bank account names (Revolut), subscription services (TryHackMe, Claude Pro, Yonder), India trip budget breakdown, and 6 months of actual/estimated payslip data. This file is committed to the repository. Any collaborator or anyone with repo access has a precise financial snapshot of the owner. This data should be replaced with anonymised placeholder values in the repo, with the real values populated at runtime from an encrypted source or entered manually on first use.

### Weakness 4 — No error boundary or data integrity guarantee (MEDIUM)

**Files:** `store.js` lines 25–29; `page-init.js` lines 56–65; `ui.js` lines 68–76

The decrypt-fail-silently pattern in `store.js` means any `fin_*` key that becomes corrupted (bit-rot, partial write, browser storage pressure) will be silently replaced with the default. The user will see correct-looking data that is wrong, with no indication anything happened. In `ui.js` lines 68–76, if any key fails, all `fin_*` keys are wiped and defaults are written — a data-loss response to a single corrupt key. A proper integrity check (HMAC or authenticated tag verification with explicit error surfacing) is needed.

### Weakness 5 — Chart logic and colour constants duplicated across 8 files (LOW-MEDIUM)

**Files:** `dashboard.js`, `analytics.js`, `expenses.js`, `assets.js`, `debts.js`, `goals.js`, `tax.js`, `networth.js`

Every page module that renders charts redefines:
- The `C` colour palette object (identical in all 8 files)
- A local `getCtx(id)` function (identical destroy-and-recreate pattern)
- Chart `baseOpts` (near-identical, minor variations)

`chart-theme.js` exists and exports `C`, `baseOpts`, and `getCtxAndDestroy` but is not imported by any of the page-level modules — only `charts.js` (which is a legacy module left from an earlier architecture and is no longer imported anywhere). This means a colour change requires editing 8 files. It also means `charts.js` is dead code that adds confusion about which code is actually executing.

---

## 7. Technical Debt Level and Remediation Timeline

### Debt assessment: MODERATE-HIGH

The core logic in `calc.js` is clean, well-structured, and well-commented. The crypto design in `sw.js` and `auth.js` is competent. The CSS system is organised. The project is not a mess — it was clearly built with intent.

However, the accumulated debt falls into four categories:

**Security debt (HIGH urgency)**
- Raw key in sessionStorage
- Personal financial data in committed defaults
- Credential hashes in committed source

**Structural debt (MEDIUM urgency)**
- 8-way duplication of chart constants and utilities
- `charts.js` is dead code
- `ui.js` is a 930-line monolith from an older architecture (single-page mode), now co-existing with the per-page modules — the `auth.js` import at the top of `ui.js` references functions (`isAuthenticated`, `logout`, `startInactivityTimer`, `getEncKey`, `changePassword`) that no longer exist in the current `auth.js`
- `settings.js` is similarly a legacy module

**Type safety debt (MEDIUM urgency)**
- Entire codebase is untyped JavaScript
- Path traversal in `attachInvAutoSave()` (`ui.js` lines 640–661) would silently fail on unexpected data shapes

**Test debt (HIGH urgency)**
- Zero test files exist
- Financial calculations in `calc.js` (amortisation, net pay, ULIP projection, net worth) are used for real financial decisions with no automated validation

### Remediation timeline estimate

| Track | Effort | Duration |
|---|---|---|
| Security: move personal data out of defaults.js | 2 hours | Same day |
| Security: move credential hashes to single gitignored file | 1 hour | Same day |
| Structural: delete `charts.js` and `ui.js`, fix dead imports | 4 hours | 1 day |
| Structural: centralise chart utilities via `chart-theme.js` imports | 3 hours | 1 day |
| Security: address sessionStorage key exposure (design decision required) | 1–2 days | 1 sprint |
| Type safety: add JSDoc types or migrate to TypeScript | 3–5 days | 1 sprint |
| Test coverage: calc.js unit tests | 2 days | 1 sprint |
| SW asset caching (offline capability) | 2 days | 1 sprint |
| State deduplication (inrGbpRate, wealthTargetGBP) | 4 hours | 1 sprint |

**Total to address critical and structural debt: 3–5 days of focused work.**  
**Total to reach a production-quality architecture: 2–3 sprints (4–6 weeks at part-time pace).**

The highest-priority action is moving personal financial data out of `defaults.js` and the credential hashes into a single gitignored file. These are day-one fixes that require no architectural change and eliminate the most significant data exposure in the current state.

---

*Review based on full read of all source files as of 2026-05-31.*
