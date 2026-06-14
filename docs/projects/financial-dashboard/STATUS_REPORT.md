# Financial Dashboard — Post-Refactor Status Report
**Date:** 2026-06-01
**Author:** Dev Team Lead
**Scope:** State of the dashboard after the auth-removal and defaults-zeroing refactor

---

## Executive Summary

The refactor successfully removed authentication and encrypted storage. The multi-page architecture (`js/pages/`) loads correctly via `page-init.js`. However, there are **three broken files** that were not updated (`ui.js`, the old `settings.js`, and partially `js/pages/settings-page.js`) and **two logic issues** (key-name mismatch and `initializeDefaults` signature) that will cause runtime errors in specific flows.

---

## Q1: Does the app load correctly without authentication?

**Yes — the happy path works.**

Trace:
1. `index.html` immediately redirects to `dashboard.html` via both `<meta http-equiv="refresh">` and `window.location.replace()`. No auth check. Clean.
2. `dashboard.html` loads `js/pages/dashboard.js` as an ES module.
3. `dashboard.js` calls `await initPage('overview')` from `page-init.js`.
4. `page-init.js` calls `await initSW()` (no-op stub in `sw-client.js`), then `await loadAll()` from `store.js`, then `renderSharedLayout()`.
5. `loadAll()` reads from `localStorage` with plain `JSON.parse`, falling back to `DEFAULTS` if a key is missing — no encryption, no auth gate.
6. `renderSharedLayout()` in `shared-layout.js` only imports `lock` from `sw-client.js` (which is a stub), renders sidebar/topbar, and hides the lock button (`lockBtn.style.display = 'none'`).
7. `highlightEmptyData(state)` runs and `initPage` returns state.

**All new-architecture page files** (`js/pages/dashboard.js`, `income.js`, `expenses.js`, etc.) follow this same path — they import only from `page-init.js`, `store.js`, and `calc.js`. None import from `auth.js` directly.

---

## Q2: Is `highlightEmptyData(state)` wired correctly?

**Mostly yes, with one logic issue and one DOM-targeting issue.**

### What it does correctly
- Runs 7 section checks using optional chaining — safe against null state.
- Injects a `.setup-banner` at the top of the first `main, .main-content, #main, .content, .page-content` element found.
- Adds `needs-data` class to elements matched by `[data-section="..."]` or `[data-page="..."]`.

### Issue 1 — `tax_tracker` key mismatch (logic bug)
`page-init.js` line 17 checks `state.tax_tracker`, but `store.js` `loadAll()` strips the `fin_` prefix and produces key `tax_tracker`:

```
'fin_tax_tracker' → shortKey = 'tax_tracker'   // store.js line 17
```

The key `tax_tracker` **does** match what `highlightEmptyData` uses (`state.tax_tracker`). This is correct — not a bug. Confirmed by tracing: `k.replace('fin_', '')` on `'fin_tax_tracker'` yields `'tax_tracker'`.

### Issue 2 — `data-section` / `data-page` attributes are absent from the HTML
The page HTML files (`dashboard.html`, `income.html`, etc.) do **not** use `data-section` or `data-page` attributes on any cards or panels. `querySelectorAll('[data-section="income"]')` will always return an empty NodeList. The `.needs-data` class will never be applied to any card. The banner still shows, but the card-level highlighting is dead.

### Issue 3 — `expenses` check uses `.every()` on potentially empty array
```js
expenses: () => state.expenses?.items?.every(i => !i.monthlyGBP)
```
`Array.prototype.every()` returns `true` on an empty array. If the DEFAULTS for expenses has `items: []`, this check will always trigger even after the user has set up their data (because items is empty, not because everything is zero). The check should be `!state.expenses?.items?.length || state.expenses.items.every(...)`.

---

## Q3: Are there broken imports referencing removed auth functions?

**Yes — three files have broken auth imports.**

### `js/ui.js` — Unused legacy file, but broken
`ui.js` imports `isAuthenticated`, `logout`, `startInactivityTimer` from `./auth.js`. These are stubs, so the import does not throw an error. However:
- Line 21: `if (!isAuthenticated())` — the stub returns `true` synchronously, but `isAuthenticated` is declared `async` in `auth.js`. Calling it without `await` means the condition is evaluated against a Promise object, which is always truthy. **The redirect to login would never fire.** This is moot because `ui.js` is not loaded by any page in the new architecture — it appears to be a leftover from the old single-file SPA and is not referenced from any HTML file. It poses no runtime risk but is dead code that should be removed.

### `js/settings.js` — Imported but not used by the new page architecture
`settings.js` imports `changePassword` and `getEncKey` from `./auth.js` (line 2), and `reEncryptAll` from `./store.js` (line 3). The stubs exist for all of these, so no import error is thrown. The Security tab UI still renders a "Change Password" form, which silently calls the no-op `changePassword()` stub — it will appear to succeed but does nothing. This is a UX issue, not a crash.

Additionally, `settings.js` line 294 calls:
```js
await initializeDefaults(getEncKey());
```
The current `initializeDefaults()` in `store.js` takes **zero parameters** — the `getEncKey()` argument is harmlessly ignored. No crash, but clearly stale code.

### `js/pages/settings-page.js` — The active settings file, clean
`settings-page.js` imports only from `../page-init.js` and `../store.js` — no auth imports. It is the file actually loaded by `settings.html`. It is clean.

**Summary table:**

| File | Auth import | Used by pages? | Risk |
|------|-------------|----------------|------|
| `js/ui.js` | Yes (stubs) | No (dead code) | None at runtime |
| `js/settings.js` | Yes (stubs) | No (dead code) | None at runtime |
| `js/pages/settings-page.js` | No | Yes | Clean |

---

## Q4: Does `store.js` correctly fall back to DEFAULTS?

**Yes — the fallback logic is correct.**

Trace of `loadAll()`:
```js
const raw = localStorage.getItem(k);          // returns null if key absent
const shortKey = k.replace('fin_', '');
out[shortKey] = raw ? JSON.parse(raw) : (DEFAULTS[k] ?? null);
```

- If `localStorage` is empty (first load), `raw` is `null` → falsy → falls back to `DEFAULTS[k]`.
- If `JSON.parse` throws (corrupted data), the `catch` block also returns `DEFAULTS[k] ?? null`.
- `DEFAULTS` is keyed by the full `fin_xxx` name (`DEFAULTS['fin_income']` etc.), and `loadAll()` correctly looks up `DEFAULTS[k]` using the full key before stripping the prefix. This is correct.

**One concern:** `DEFAULTS` has all values zeroed. So a first-time load succeeds without crashing, but produces a state of all zeros — which is exactly what `highlightEmptyData` is designed to flag. The chain works as designed.

---

## Q5: Are there any files still referencing the deleted `login.html`?

**No.** A full search across all `.html`, `.js`, and `.css` files found zero references to `login.html`. The redirect in `index.html` correctly points to `dashboard.html`. Clean.

---

## Q6: Is the setup highlighting CSS correct?

**Yes — the CSS is correct and will work visually**, with the caveat that the `.needs-data` card highlighting won't fire (see Q2 Issue 2 above).

Analysis of the CSS in `components.css` lines 426–485:

- `.needs-data` adds a `3px solid #f59e0b` amber left border. The `!important` is needed to override the panel's existing `border: 1px solid rgba(0,191,255,0.12)` — this is correct usage.
- The `::after` pseudo-elements inject a pulsing "● enter data" badge after any `section-title`, `card-title`, `h3`, or `h4` inside a `.needs-data` element. The animation (`nd-pulse`, 2s opacity cycle) is defined and will render.
- `.setup-banner` is a flex row with amber styling — padding, border, background are all valid. The `margin-left: auto` on the `<a>` tag correctly pushes the "Go to Settings →" link to the right edge.
- `.setup-complete-banner` is `display: none` — never shown unless toggled by JS, which nothing currently does. Harmless.

The only visual limitation: because the page HTML does not have `data-section` attributes on cards, no cards will receive the amber border highlight — only the top banner will render. The banner itself will render correctly.

---

## Q7: Top 5 Issues to Fix

### Issue 1 — CRITICAL: `data-section` attributes missing from page HTML
**Impact:** `highlightEmptyData()` cannot highlight individual cards. The banner shows but no card-level amber highlighting fires.
**Fix:** Add `data-section="income"` etc. to the relevant `.panel` or `.metric-card` divs in each page HTML, or target by `id` instead of data attribute in `page-init.js`.

### Issue 2 — HIGH: `expenses` zero-check is wrong on empty array
**Impact:** `expenses` section is always reported as needing data even when the user has no expenses configured, because `[].every(fn)` is vacuously true.
**File:** `js/page-init.js` line 12
**Fix:**
```js
expenses: () => !state.expenses?.items?.length ||
                state.expenses.items.every(i => !i.monthlyGBP),
```

### Issue 3 — HIGH: Dead legacy files (`ui.js`, `settings.js`) pollute the codebase
**Impact:** Both files import from `auth.js` and contain old encryption-era logic. They are not loaded by any page but create maintenance confusion. `settings.js` also has stale `initializeDefaults(getEncKey())` calls.
**Fix:** Delete `js/ui.js` and `js/settings.js` (the active settings module is `js/pages/settings-page.js`).

### Issue 4 — MEDIUM: Security settings tab shows a non-functional "Change Password" form
**Impact:** The settings page still renders a Change Password section. Users who attempt to change their password will see a success message (the no-op stub returns without throwing) but nothing will actually happen.
**File:** `js/pages/settings-page.js` — security tab renderer
**Fix:** Remove or replace the security tab with a note that authentication is disabled, or remove the tab entirely from the settings UI.

### Issue 5 — MEDIUM: `inrGbpRate` default fallback inconsistency
**Impact:** `page-init.js` line 52 falls back to `83` for the INR/GBP rate; `js/ui.js` (legacy) falls back to `125`; `js/pages/dashboard.js` uses `125`; `renderDebts()` in `ui.js` also uses `125`. The DEFAULTS object value determines what actually loads, but if DEFAULTS sets a different value the CSS custom property `--inr-gbp-rate` may be set incorrectly on first load.
**Fix:** Audit DEFAULTS for `fin_settings.inrGbpRate` and standardize all fallback literals to one value (remove magic numbers, use a shared constant).

---

## Additional Observations

- **`sw.js` cache-only service worker:** The new `sw.js` is a cache-only worker. Any resource not pre-cached will silently fail to load from the network if the SW is active. Recommend verifying that all CSS, JS, and HTML files are in the pre-cache list, or switching to a network-first strategy for development.
- **`shared-layout.js` imports `lock` from `sw-client.js`** but never calls it (the lock button is hidden). The import is dead but harmless.
- **`js/pages/dashboard.js` line 257** references `document.getElementById('gauge-val-wealth')` but `dashboard.html` has no element with that id — it has `gauge-val-debt`, `gauge-val-emergency`, and `gauge-val-india`. This will throw a null-reference error silently in `updateGauges()`.

---

## Overall Assessment

The app will load and display the dashboard without authentication — the core goal of the refactor is achieved. The load path is correct. The main risks are card-level highlighting being invisible (missing data-section attributes), a minor logic flaw in the expenses empty-check, two dead legacy files that need cleanup, a non-functional security settings UI, and a gauge DOM id mismatch on the dashboard page.

None of the issues cause a hard crash on initial load. All are fixable in a single focused session.
