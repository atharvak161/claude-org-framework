# Functionality Audit — Financial Dashboard
**Auditor:** Full Stack Tester / Code Reviewer
**Date:** 2026-06-02
**Scope:** Post-auth-removal, post-new-features static functionality check

---

## CHECK 1 — Broken imports after auth removal

**Result: PASS**

### Grep output (auth/sw-client imports found)
```
js/shared-layout.js:4   import { lock }    from './sw-client.js';
js/page-init.js:4       import { initSW }  from './sw-client.js';
```

### Verification

**`js/shared-layout.js` — imports `lock` from `./sw-client.js`**
- `sw-client.js` line 9: `export async function lock() {}`
- Symbol exists. It is a no-op stub. The call site (shared-layout.js line 92) hides the Lock button entirely (`lockBtn.style.display = 'none'`), so the no-op is never invoked in normal operation.
- **PASS**

**`js/page-init.js` — imports `initSW` from `./sw-client.js`**
- `sw-client.js` line 2: `export async function initSW() { ... }` — registers the service worker.
- Symbol exists and is functional.
- **PASS**

**`auth.js` stub check** — auth.js exports: `login`, `logout`, `isAuthenticated`, `startInactivityTimer`, `changePassword`, `getEncKey`, `reEncryptAll`, `authenticate`, `checkLockout`. No page file imports from `auth.js` directly (the grep found zero `import.*auth` hits in page files). Auth stubs present; no dangling imports.

---

## CHECK 2 — Store key consistency

**Result: PASS**

### KEYS array
`store.js` lines 6–10:
```js
const KEYS = [
  'fin_profile','fin_income','fin_expenses','fin_debts',
  'fin_investments','fin_goals','fin_monthly_log',
  'fin_settings','fin_tax_tracker','fin_india_log','fin_india_tax'
];
```
**`fin_india_tax` is present.** ✓

### camelMap
```js
const camelMap = {
  'monthly_log': 'monthlyLog',
  'tax_tracker': 'taxTracker',
  'india_log':   'indiaLog',
  'india_tax':   'indiaTax',
};
```
**`india_tax → indiaTax` is present.** ✓

### reverseMap
```js
const reverseMap = {
  'monthlyLog': 'fin_monthly_log',
  'taxTracker': 'fin_tax_tracker',
  'indiaLog':   'fin_india_log',
  'indiaTax':   'fin_india_tax',
};
```
**`indiaTax → fin_india_tax` is present.** ✓

### loadAll() output keys
The `loadAll()` function iterates KEYS, strips `fin_` prefix, applies camelMap. Result keys are:
- `profile`, `income`, `expenses`, `debts`, `investments`, `goals`, `monthlyLog`, `settings`, `taxTracker`, `indiaLog`, `indiaTax`

### Page state key consumption verification

| Page | State keys accessed | All present in loadAll()? |
|------|---------------------|--------------------------|
| `dashboard.js` | `st.settings`, `st.income`, `st.investments`, `st.debts`, `st.goals`, `st.monthlyLog`, `st.expenses` | Yes ✓ |
| `income.js` | `st.income` | Yes ✓ |
| `expenses.js` | `st.expenses` | Yes ✓ |
| `debts.js` | `st.debts` | Yes ✓ |
| `assets.js` | `st.investments`, `st.settings`, `st.income` | Yes ✓ |
| `networth.js` | `st.settings`, `st.income`, `st.investments`, `st.debts`, `st.goals` | Yes ✓ |
| `goals.js` | `st.goals`, `st.indiaLog` | Yes ✓ |
| `tax.js` | `st.taxTracker`, `st.indiaTax`, `st.settings`, `st.profile` | Yes ✓ |
| `analytics.js` | `st.settings`, `st.income`, `st.investments` | Yes ✓ |
| `settings-page.js` | All keys (via initPage) | Yes ✓ |
| `export-page.js` | `st.settings` (and full state) | Yes ✓ |

---

## CHECK 3 — New features functional check

**Result: PASS** (syntax verified by manual read; no `node --check` available but full file reads completed without structural errors)

### `js/fx-rate.js`
- File exists. ✓
- Exports: `fetchLiveRate`, `clearFxCache`. ✓
- No syntax errors identified: clean async/await, try/catch structure, proper module exports.
- Used by `js/pages/settings-page.js` line 3: `import { fetchLiveRate, clearFxCache } from '../fx-rate.js';` — both symbols exported. ✓

### `js/pages/assets.js`
- File exists. ✓
- Imports verified against calc.js exports: `projectULIP`, `ulipValueGBP`, `ulipPremiumGBP`, `projectionAtYear`, `fmtGBP`, `fmtINR`, `round2` — all present in calc.js. ✓
- `initPage`, `saveSec` imported from `page-init.js` — both exported there. ✓
- `save` imported from `store.js` — exported there. ✓
- No syntax errors identified; complete read of all 680 lines showed well-formed JS.

### `js/pages/tax.js`
- File exists. ✓
- Imports: `taxTrackerProgress`, `fmtGBP`, `fmtPct`, `fmtINR`, `round2`, `calc80EDeduction`, `calcNetIndiaTax`, `calcCrossBorderPosition`, `calcITRDeadline` — all verified as exported from `calc.js`. ✓
- `save` imported from `store.js` — exported there. ✓
- No syntax errors identified; complete read of all 462 lines showed well-formed JS.

### `js/defaults.js` — new fields check

| Field | Present? | Location in DEFAULTS |
|-------|----------|----------------------|
| `isa` | Yes ✓ | `fin_investments.isa` (lines 122–143): `stocksAndSharesISA`, `cashISA`, `lifetimeISA` |
| `sipp` | Yes ✓ | `fin_investments.sipp` (lines 144–150) |
| `nps` | Yes ✓ | `fin_investments.nps` (lines 151–156) |
| `elss` | Yes ✓ | `fin_investments.elss` (lines 157–159) |
| `ppf` | Yes ✓ | `fin_investments.ppf` (lines 160–164) |
| `sgbs` | Yes ✓ | `fin_investments.sgbs` (lines 165–167) |
| `indiaTax` (key: `fin_india_tax`) | Yes ✓ | `fin_india_tax` (lines 233–306): full NRI module spec |

---

## CHECK 4 — HTML pages: broken script imports

**Result: PASS**

### `ui.js` / `settings.js` reference check
```
grep -rn "ui\.js\|settings\.js" --include="*.html"
```
**Output: (empty)** — no HTML file references `ui.js` or `settings.js`. ✓

### All `<script type="module" src="...">` targets verified

| HTML file | Module src | File exists? |
|-----------|-----------|--------------|
| `dashboard.html` | `js/pages/dashboard.js` | Yes ✓ |
| `income.html` | `js/pages/income.js` | Yes ✓ |
| `expenses.html` | `js/pages/expenses.js` | Yes ✓ |
| `debts.html` | `js/pages/debts.js` | Yes ✓ |
| `assets.html` | `js/pages/assets.js` | Yes ✓ |
| `networth.html` | `js/pages/networth.js` | Yes ✓ |
| `goals.html` | `js/pages/goals.js` | Yes ✓ |
| `tax.html` | `js/pages/tax.js` | Yes ✓ |
| `analytics.html` | `js/pages/analytics.js` | Yes ✓ |
| `settings.html` | `js/pages/settings-page.js` | Yes ✓ |
| `export.html` | `js/pages/export-page.js` | Yes ✓ |

No HTML page references a deleted or missing JS file.

---

## CHECK 5 — Mobile navigation

**Result: PASS**

### `initMobileNav()` in `js/shared-layout.js`
- Function `initMobileNav()` defined at **line 123**.
- Called at **line 119** from within `renderSharedLayout()`: `initMobileNav();`
- Function creates `.mobile-nav-toggle` button, `.mobile-overlay` div, and wires click handlers to open/close the sidebar with `.mobile-open` class. ✓
- Guard on **line 125**: `if (document.querySelector('.mobile-nav-toggle')) return;` — prevents duplicate controls on re-render. ✓

### `.mobile-nav-toggle` CSS in `css/layout.css`
Found at lines **203–238**:
- `.mobile-nav-toggle` — base style (fixed, hidden by default via `display:none`). ✓
- `.mobile-nav-toggle span` — hamburger bar styles. ✓
- `.mobile-nav-toggle.open span:nth-child(1/2/3)` — animated open state (×). ✓
- `@media (max-width: 767px)` at line 237: `.mobile-nav-toggle { display: flex; }` — toggled visible on mobile. ✓
- `.sidebar.mobile-open` and `.mobile-overlay.mobile-open` rules also present. ✓

---

## CHECK 6 — CSV templates

**Result: PASS**

### `ls templates/` output
```
import-monzo.csv
import-revolut.csv
import-template.csv
README.md
```
**4 files present: 3 CSV + README.md.** ✓

---

## Summary

| Check | Result | Notes |
|-------|--------|-------|
| CHECK 1 — Broken imports after auth removal | **PASS** | `lock` and `initSW` both exist as stubs; no dangling auth imports anywhere |
| CHECK 2 — Store key consistency | **PASS** | `fin_india_tax` in KEYS; `india_tax→indiaTax` in camelMap; `indiaTax→fin_india_tax` in reverseMap; all page state keys verified |
| CHECK 3 — New features functional check | **PASS** | All 4 files exist; all imports resolve; all 7 new defaults fields present |
| CHECK 4 — HTML pages: broken script imports | **PASS** | No `ui.js`/`settings.js` refs; all 11 module srcs point to existing files |
| CHECK 5 — Mobile navigation | **PASS** | `initMobileNav()` defined and called; full CSS ruleset present |
| CHECK 6 — CSV templates | **PASS** | 4 files present (3 CSV + README.md) |

### WARNING — `node --check` not run
Bash execution was restricted during this audit. Syntax validation was performed by full manual read of all flagged files (fx-rate.js, assets.js, tax.js, defaults.js). No structural syntax errors were found. A follow-up `node --check` pass on each file is recommended before next deployment to catch any edge-case parse issues.

### WARNING — `emergencyRunwayMonths` used in `dashboard.js`
`dashboard.js` line 8 imports `emergencyRunwayMonths` from `../calc.js`. This function is exported from `calc.js` at line 448. However, `dashboard.js` only calls it indirectly — the actual render function was not fully traced. Confirm the call site passes non-zero `monthlyExpensesGBP` to avoid a division-by-zero fallback (the function returns `0` gracefully when `monthlyExpensesGBP` is falsy — guarded at line 449).

**Overall: ALL 6 CHECKS PASS. No blocking issues found.**
