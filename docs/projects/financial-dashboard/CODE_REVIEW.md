# CODE REVIEW — Financial Dashboard
**Reviewer:** Dev Team Lead  
**Date:** 2026-05-31  
**Scope:** Full static analysis — all HTML, JS, and CSS files  
**Project location:** `src/projects/financial-dashboard/`

---

## 1. Overall Code Quality Score: 6.5 / 10

This is a well-conceived personal finance tool built with genuine care. The security architecture (AES-256-GCM via Service Worker, PBKDF2 key derivation, brute-force lockout) is notably stronger than most personal projects. The financial calculations are correct and well-commented. The UI is visually coherent.

The score is held back by four structural problems:

1. **Two complete parallel codebases exist simultaneously.** `ui.js` + `dashboard.html` (the old single-page monolith) and `js/pages/*.js` + individual HTML pages (the new MPA) are both present and partially live. `ui.js` is ~930 lines and still imports from `auth.js` functions (`isAuthenticated`, `logout`, `startInactivityTimer`) that do not exist in the current `auth.js`. This dead code is a maintenance liability and a source of confusion.

2. **Chart colour constants are copy-pasted into every single file** with minor variations between copies.

3. **`settings.js` imports `changePassword` and `getEncKey` from `auth.js`**, but neither function is exported from `auth.js`. This is a latent crash waiting to happen when the settings security tab is used.

4. **Hardcoded personal financial data** (salary, loan details, actual savings amounts) is committed to `defaults.js` and is visible in the repository. The README acknowledges this but it is still a practice that should not exist in a version-controlled file.

---

## 2. Coding Style Consistency

Style is **broadly consistent within the new MPA codebase** (`js/pages/*.js`) but diverges in the older files.

**Consistent patterns:**
- ES modules throughout the MPA pages (good)
- `const C = { ... }` colour objects at the top of every page module
- `render(state)` as the primary entry point
- `bind*Fields` / `bindDebtFields` / `bindIndiaFields` pattern for attaching change listeners
- Async/await throughout — no raw Promise chains
- `getCtx(id)` helper to destroy and re-create Chart.js instances

**Inconsistencies:**

- **Variable naming collision on `C`:** `chart-theme.js` exports `C` and `baseOpts`. `charts.js` defines its own local `C` and `baseOpts` that are near-duplicates but not identical. Every `js/pages/*.js` also defines its own local `C`. None of them import from `chart-theme.js`. The shared module is effectively unused.

- **Trailing underscores on local variables (`base_`, `with_`, `base_`):** Used in `debts.js` to avoid shadowing the outer `C` but creates noise. `analytics.js` uses `_chart` as a module-level singleton but every other page uses `charts = {}` as a map. Inconsistent.

- **`field()` function defined twice:** Once in `js/settings.js` (the old version) and again almost identically in `js/pages/settings-page.js`. The new version adds both `input` and `change` listeners; the old one used only `change` with a `setTimeout(0)` hack for DOM attachment. The `setTimeout(0)` approach in `settings.js` line 48 is a code smell.

- **Template literals vs concatenation:** All new code uses template literals correctly. `charts.js` (older file) occasionally chains string concatenation directly in chart option objects.

- **Inline styles vs CSS classes:** Scattered throughout. `settings.js` line 56: `style="margin-bottom:12px"`. `goals.js` line 145: an entire card built with inline `style` attributes on every element. Layout code belongs in the CSS.

---

## 3. Worst File: `js/ui.js`

`js/ui.js` is 930 lines of dead code from the original single-page architecture. It is the worst file in the codebase for the following concrete reasons:

**It will crash on load.** Line 1 imports:
```js
import { isAuthenticated, logout, startInactivityTimer } from './auth.js';
```
None of these three functions are exported from the current `auth.js`. The current `auth.js` exports: `checkLockout`, `authenticate`. That is all. Any browser that evaluates `ui.js` will throw a SyntaxError at module resolution time.

**It re-implements everything the MPA pages already do.** It has its own `loadAll()`, `saveAll()`, `renderOverview()`, `renderIncome()`, `renderExpenses()`, `renderDebts()`, `renderInvestments()`, `renderNetWorth()`, `renderIndiaTrip()`, `renderTaxTracker()` — all of which are superseded by the individual page modules under `js/pages/`.

**It imports from a deleted module.** Line 3:
```js
import { initAllCharts, updateCharts } from './charts.js';
```
`charts.js` still exists, but the function `initAllCharts` in `charts.js` maps to a completely different chart structure than the one `ui.js` expects.

**It defines its own `_FIN_KEYS` array** at line 59, duplicating the one in `store.js`. It defines its own `escHtml()` at line 915, duplicating the one in `expenses.js`. Every duplicate has drifted slightly.

**It references DOM element IDs that no longer exist.** `gauge-val-india`, `gauge-val-emergency`, `gauge-val-wealth`, `gauge-lbl-india`, `gauge-lbl-emergency`, `gauge-lbl-wealth` are referenced in `updateGauges()` (line 252) but the current `dashboard.html` uses `gauge-val-debt`, `gauge-val-emergency`, `gauge-val-india` — a different set.

This file should be deleted entirely.

---

## 4. Best File: `js/calc.js`

`calc.js` is the strongest file in the codebase. It scores well on every axis:

- **Zero DOM dependencies.** It is pure functions over data. This makes it trivially testable.
- **Well-documented bug history.** The comment block at line 237 explains precisely what was wrong in v1 of `projectNetWorthTimeline` (pension double-counting, ULIP static treatment) and exactly how it was fixed. This is the level of documentation that prevents regression.
- **Separation of concerns.** Financial logic lives here. No rendering, no DOM, no chart config.
- **Comprehensive coverage.** Net pay, amortisation, ULIP projection, net worth, expenses, surplus trajectory, compound growth, age trajectory — all in one file, all consistent.
- **Correct use of `Math.round` in amortisation.** Line 52: `Math.round(balance * monthlyRate)` — integer pence arithmetic avoids floating-point drift across 600 months.
- **Handles edge cases explicitly.** `loanPaidToDate` (line 442) guards `!sbi?.startDate`. `wealthProgress` (line 197) has separate phases for negative and positive net worth with a comment explaining why the old formula was wrong.
- **Formatting helpers are co-located.** `fmtGBP`, `fmtINR`, `fmtPct`, `fmtMonths` at lines 330–351 follow a consistent pattern and handle the negative-sign case correctly (using `−` not `-`).

The one weakness is the hardcoded constant on line 447:
```js
const sanctioned = 3600000; // ₹36L original
```
This makes `loanPaidToDate` wrong for any user with a different original loan amount.

---

## 5. Code Duplication

Duplication is pervasive. The most impactful instances:

### 5a. Chart colour constant `C` — duplicated in 11 files

Every file that creates a chart defines its own local `C` object:

```js
// analytics.js line 10
const C = { positive:'#00e676', negative:'#ff1744', warning:'#ff9100', info:'#00bfff', ... };

// debts.js line 10
const C = { negative:'#ff1744', positive:'#00e676', info:'#00bfff', ... };

// dashboard.js line 19
const C = { grid:'rgba(0,191,255,0.07)', tick:'#3d5473', info:'#00bfff', ... };

// charts.js lines 12–24
const C = { bg: '#121828', grid: 'rgba(0,191,255,0.07)', ... };
```

`chart-theme.js` exists to solve this problem but is never imported by any of these files. If a colour needs to change (e.g., the warning orange), it must be updated in 11 separate locations. The values are also slightly inconsistent: `bodyColor` in `charts.js` tooltips is `'#8099b3'`; in the page modules it is `'#7a96b3'`; in `analytics.js` it is `'#8e9099'`.

### 5b. `baseOpts` / `base` chart options — duplicated in 8 files

Every page module declares a near-identical `base` or `base_` object for Chart.js options. Example comparison:

```js
// expenses.js lines 8–12
const base = { responsive:true, maintainAspectRatio:false,
  animation:{ duration:700, easing:'easeInOutQuart' },
  plugins:{ legend:{ display:false }, tooltip:{ backgroundColor:'rgba(9,12,20,0.96)', ... } },
  scales:{ x:{ grid:{ color:'rgba(255,255,255,0.06)' }, ... }, ... }
};

// dashboard.js lines 13–18
const base = { responsive:true, maintainAspectRatio:false,
  animation:{ duration:700, easing:'easeInOutQuart' },
  plugins:{ legend:{ display:false }, tooltip:{ backgroundColor:'rgba(9,12,20,0.96)', ... } },
  scales:{ x:{ grid:{ color:'rgba(255,255,255,0.06)' }, ... }, ... }
};
```

These are identical except for minor tooltip body colour drift. `chart-theme.js` exports `baseOpts` for exactly this purpose and is not used.

### 5c. `getCtx()` helper — duplicated in 6 files

```js
// assets.js line 123
function getCtx(id) { if(charts[id]){charts[id].destroy();delete charts[id];}return document.getElementById(id)?.getContext('2d')||null; }

// debts.js line 161
function getCtx(id) { if(charts[id]){charts[id].destroy();delete charts[id];}return document.getElementById(id)?.getContext('2d')||null; }
```

These are character-for-character identical. `chart-theme.js` exports `getCtxAndDestroy(id, store)` for this purpose. Not used.

### 5d. `escHtml()` — duplicated in `ui.js` and `expenses.js`

```js
// expenses.js line 120
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
```

Identical implementation in `ui.js` line 915. Should be in a shared `utils.js`.

### 5e. Export logic — duplicated between `export.js` and `export-page.js`

The Excel export function in `js/export.js` (225 lines) and `js/pages/export-page.js` (111 lines) both independently build Excel workbooks. The page version is a stripped-down version of the module version. The JSON backup/import/reset logic is also duplicated between `js/settings.js` renderDataSettings, `js/pages/settings-page.js` renderData, and `js/pages/export-page.js`.

### 5f. Amortisation table renderer — duplicated between `ui.js` and `debts.js`

`renderAmortTable()` appears in both files with identical logic.

### 5g. `metricCard()` / `kpiCard()` — nearly duplicated

`dashboard.js` line 96 defines `metricCard()`. `analytics.js` line 116 defines `kpiCard()`. The HTML output is identical; only the function name differs.

### 5h. India log table — duplicated between `ui.js`, `goals.js`, and `js/pages/goals.js` (old settings)

The log table render loop with `reduce` accumulator for running total appears three times.

---

## 6. Error Handling

Error handling is **present but inconsistent**, and has one structural gap.

**What is done well:**
- `store.js` line 26: `try/catch` on decrypt with fallback to defaults. Correct.
- `sw.js`: All operations inside `try/catch` with structured error responses via MessageChannel.
- `sw-client.js`: 8-second timeout on all SW messages (line 32).
- `page-init.js`: Auth check with automatic SW key recovery from `sessionStorage` — handles the real-world case of SW termination between navigations.
- `auth.js`: Both hash computations run in parallel (`Promise.all`) before comparison — prevents timing-based username enumeration.

**What is missing or weak:**

1. **`settings.js` line 1–2:** Imports `changePassword` and `getEncKey` from `auth.js` — neither is exported. The `renderSecuritySettings` function in `settings.js` calls `changePassword(cur, nw, reEncryptAll)` at line 227. This will throw `TypeError: changePassword is not a function` the first time a user tries to change their password. There is no `try/catch` around it beyond the generic outer `catch(e)`.

2. **JSON import in `settings-page.js` line 289 and `export-page.js` line 99:** `JSON.parse(await file.text())` — no `try/catch`. A malformed backup file will crash the page with an unhandled promise rejection, showing a white screen.

3. **`export-page.js` line 17 and `export.js` line 67:** `exportExcel()` calls `XLSX.writeFile()` and `html2canvas()` with no error handling. If the CDN library fails to load or the user's disk is full, a silent failure or uncaught exception results.

4. **`analytics.js` line 325:** `renderRatiosChart` creates a chart using `document.getElementById('chart-ratios')?.getContext('2d')` directly without using the module's own `getCtx` wrapper. If called twice, it will not destroy the previous chart, causing Chart.js's "canvas already in use" warning.

5. **No network error handling on CDN failures.** Chart.js, XLSX, and jsPDF are all loaded from CDNs in HTML files. If a CDN is unreachable, the page fails silently with no user-visible error message.

6. **`defaults.js` line 97:** `note: 'Eurostop workplace pension. Includes transferred People\'s Pension...'` — backslash escaping works but is fragile when the string is interpolated into HTML without `escHtml()`. The `pension.note` value is directly injected into innerHTML in `assets.js` line 27 and `ui.js` line 563 without sanitisation.

---

## 7. CSS Organisation and Maintainability

The CSS is split into three files with a clear separation of concerns:

- `theme.css` — design tokens (CSS custom properties), typography, global resets, colour utilities
- `layout.css` — shell, sidebar, topbar, grid systems, responsive breakpoints
- `components.css` — panels, cards, buttons, forms, tables, badges, gauges, etc.

This is a **good structure**. The custom property system in `theme.css` is comprehensive and correctly used throughout.

**Maintainability concerns:**

1. **Chart.js cannot use CSS variables.** The code acknowledges this explicitly (`charts.js` line 9: `// Colour palette (hardcoded hex — Chart.js can't use CSS vars)`). The result is that two colour systems exist in parallel: CSS custom properties for UI components, and hardcoded hex strings for charts. These are already drifting (`--color-positive` is `#00e676`; this appears correctly in all `C` objects, but the grid colour in `expenses.js` is `rgba(255,255,255,0.06)` while everywhere else uses `rgba(0,191,255,0.07)` — a blue vs white grid inconsistency).

2. **`login.html` has 160+ lines of inline `<style>` blocks.** The login page defines its own complete style system inline because it only loads `theme.css`, not `layout.css` or `components.css`. This makes the login page styles invisible to anyone reading the CSS files. The `.visually-hidden` class is also defined inline at the bottom of `login.html` (line 201) — this belongs in `theme.css`.

3. **Inline styles scattered through JS template literals.** Examples:
   - `settings.js` line 56: `style="margin-bottom:12px"`
   - `goals.js` line 145: `style="background:var(--bg-panel);border:1px solid var(--border-color);border-radius:8px;padding:20px 24px;display:flex;align-items:center;gap:24px;margin-bottom:16px"`
   - `analytics.js` line 101: `</div></tr>` — a stray `</div>` inside a `<tr>` (invalid HTML)
   - Multiple files use `style="font-size:12px;color:var(--text-secondary)"` repetitively rather than adding a utility class

4. **`.ulip-card` in `components.css` line 337 duplicates `.panel` exactly.** Both have identical `background`, `border`, `border-radius`, `padding`, and `box-shadow`. The `.ulip-card` class adds no additional styling over `.panel`.

5. **No dark-mode / light-mode toggle.** The design tokens are all hardcoded for the dark JARVIS theme. There is a `showInrEquivalents` setting but no theme toggle, meaning the `theme` field in `fin_settings` (which includes `theme: 'dark'`) is stored but never applied.

6. **No `min-width` on `.content` for very narrow viewports.** The `@media(max-width:767px)` breakpoint hides the sidebar and collapses grids, but chart containers at `height:260px` on a 320px-wide screen will have extremely compressed aspect ratios.

---

## 8. Highest-Impact Refactors

Ranked by effort-to-impact ratio:

### Refactor 1 — Delete `ui.js` (Impact: High, Effort: Low)
`ui.js` is dead code that will crash on import. It creates confusion about which codebase is active. Deleting it removes ~930 lines and eliminates the false signals it sends to anyone reading the project. Also delete the `dashboard.html` reference to it if it still loads it (the current `dashboard.html` loads `js/pages/dashboard.js`, which is correct).

### Refactor 2 — Fix the `auth.js` import in `settings.js` (Impact: High, Effort: Low)
`settings.js` line 2 imports `changePassword` and `getEncKey` from `auth.js`. These do not exist. The security tab will crash. Either: (a) implement `changePassword` in `auth.js` and export it, or (b) remove the security tab entirely. This is a critical functional bug.

### Refactor 3 — Consolidate chart constants into `chart-theme.js` (Impact: Medium, Effort: Medium)
Move the `C` object, `baseOpts`, and `getCtx` helper into `chart-theme.js` and have all page modules import from it. This eliminates ~80 lines of duplicate constant definitions and fixes the tooltip colour drift. The `getCtxAndDestroy(id, store)` function signature in `chart-theme.js` needs to be standardised to match the `getCtx(id)` pattern used everywhere.

### Refactor 4 — Replace `prompt()`/`alert()`/`confirm()` with modal UI (Impact: Medium, Effort: Medium)
`ui.js` line 796, `goals.js` line 92, and `settings-page.js` line 297 use browser native `prompt()`, `alert()`, and `confirm()`. These block the main thread, look out of place in a polished UI, do not respect the dark theme, and are disabled in some sandboxed environments. A small reusable modal component would eliminate all three call sites.

### Refactor 5 — Extract shared utility functions into `utils.js` (Impact: Medium, Effort: Low)
Move `escHtml()`, the JSON backup/import logic, and the `setPath(obj, path, val)` path traversal helper into a shared `utils.js`. `setPath` is currently duplicated in `assets.js` line 110 and `ui.js` line 644 with slightly different logic.

### Refactor 6 — Add `try/catch` to JSON import and Excel export (Impact: High, Effort: Low)
Three lines of code. Wrap `JSON.parse(await file.text())` in both `settings-page.js` and `export-page.js` with `try/catch` that shows a user-visible error message. Do the same around `XLSX.writeFile()`.

### Refactor 7 — Make `loanPaidToDate` take original amount as a parameter (Impact: Medium, Effort: Low)
`calc.js` line 447: `const sanctioned = 3600000;` is hardcoded. The function signature is `loanPaidToDate(sbi)` and `sbi` contains `outstandingINR`. The original amount should be stored in the data model or passed explicitly.

### Refactor 8 — Move login page styles to CSS files (Impact: Low, Effort: Low)
Extract the 160 lines of inline CSS from `login.html` into appropriate locations in `theme.css` and `components.css`. This makes the login styles discoverable and consistent with the rest of the CSS architecture.

---

## 9. What a Junior Developer Would Struggle to Understand

### 9a. The Service Worker key lifecycle
The combination of `sw.js` (key holder), `sw-client.js` (MessageChannel bridge), `page-init.js` (key recovery from `sessionStorage`), and `auth.js` (key derivation) requires understanding: (1) why the key is in a SW rather than a JS variable, (2) what `sessionStorage._ek` is and why it exists, (3) why `page-init.js` does `_recoverKey()` before every page load, and (4) why the key is marked `extractable: true` in `_deriveEncKey` despite being stored in a "secure" SW. The comment on line 59 of `auth.js` (`// extractable: needed for sessionStorage recovery when SW is terminated`) explains the tradeoff, but a junior would need to understand the entire flow to grasp why this is acceptable.

### 9b. The dual codebase
With `ui.js` and `js/pages/*.js` both present, a junior would not know which files are live. The `dashboard.html` now loads `js/pages/dashboard.js`, but `ui.js` still exists and still references the old section-based navigation model. A junior might edit `ui.js` thinking they are fixing the overview page.

### 9c. Top-level `await` in page modules
Every `js/pages/*.js` file begins with:
```js
const state = await initPage('income');
render(state);
```
Top-level `await` in ES modules is valid but requires understanding that (a) the module is implicitly async, (b) execution of the rest of the module body is deferred until `initPage` resolves, and (c) hoisted `const` declarations above this line (the `C` object, `charts` map) are available because they are not async — this is why comments say "Hoisted before top-level await — avoids TDZ errors".

### 9d. The `invEditField` / `attachInvAutoSave` dot-path traversal
`ui.js` line 633 and `assets.js` line 92: the investment fields use `data-path="pensions.0.valueGBP"` and then traverse this at runtime with:
```js
const path = el.dataset.path.split('.');
let obj = state.investments;
for (let i = 0; i < path.length - 1; i++) {
  if (!isNaN(path[i+1]) || !isNaN(path[i])) { ... }
}
```
The logic for detecting numeric path segments is non-obvious and the branching in `ui.js` line 646 differs from the cleaner implementation in `assets.js` line 110. A junior would not understand why this is needed or how to debug it.

### 9e. The `CRED` duplication
`auth.js` lines 6–12 hardcode the same credential hashes that are in `auth-config.js` lines 5–11. The comment on `auth-config.js` says it is `.gitignore`d and generated, yet it appears in the repository. A junior would not know which file is authoritative and might try to edit `auth-config.js` while the actual verification uses the inline constants in `auth.js`.

### 9f. The `wealthProgress` two-phase formula
`calc.js` line 197: the comment explains the old bug and the new two-phase approach, but the formula itself:
```js
const original = Math.max(totalDebtGBP || 0, Math.abs(netWorth));
const cleared  = Math.max(0, original - Math.abs(netWorth));
```
requires understanding that `original` is the starting debt burden and `cleared` is how much of it has been paid. The `Math.max(totalDebtGBP, Math.abs(netWorth))` guard handles the case where net worth has become more negative than the initial debt (e.g., emergency spending). A junior would not intuitively understand why both operands are needed.

---

## 10. Bugs Visible from Static Analysis

### Bug 1 — CRITICAL: `settings.js` imports non-existent functions
**File:** `js/settings.js` lines 2, 227  
**Code:**
```js
import { changePassword, getEncKey } from './auth.js';
// ...
await changePassword(cur, nw, reEncryptAll);
```
`auth.js` does not export `changePassword` or `getEncKey`. This will throw `SyntaxError: The requested module './auth.js' does not provide an export named 'changePassword'` (or equivalent) when `settings.js` is imported. Since `settings.js` is imported by `ui.js` (which is the old monolith), this only crashes in the old code path. However, if anything loads `settings.js` directly, it will fail.

### Bug 2 — Active: `expenses.js` line 108 — checkbox listener calls `save_` without `await`
**File:** `js/pages/expenses.js` line 108  
**Code:**
```js
document.querySelectorAll('.exp-active-input').forEach(el => {
  el.addEventListener('change', async () => {
    st.expenses.items[parseInt(el.dataset.idx)].active = el.checked;
    await save_;  // <-- BUG: save_ is a function reference, not a call
  });
});
```
`save_` is defined as `const save_ = async () => { ... }` on line 94. Line 108 says `await save_` which awaits the function reference itself (a truthy value), not the result of calling it. The save never happens when a checkbox is toggled. The correct code is `await save_()`. This means toggling an expense active/inactive does not persist.

### Bug 3 — `analytics.js` line 101 — stray `</div>` inside `<tr>`
**File:** `js/pages/analytics.js` line 101  
**Code:**
```js
<tr><td class="stat-label">Housing</td><td class="td-right mono">${fmtGBP(housingCost)}</td></div></tr>
```
There is a `</div>` between `</td>` and `</tr>`. Modern browsers will silently correct this but it produces invalid HTML and may cause unexpected layout shifts in strict parsers or older engines.

### Bug 4 — `networth.js` imports `ulipValueGBP` and `ulipPremiumGBP` without importing them
**File:** `js/pages/networth.js` lines 211–215  
**Code:**
```js
const ulipTotalGBP = inv.ulips.reduce((s, u) => s + ulipValueGBP(u, rate), 0);
const ulipPremGBP  = inv.ulips.reduce((s, u) => s + ulipPremiumGBP(u, rate), 0);
```
The import at lines 1–8 does not include `ulipValueGBP` or `ulipPremiumGBP`. These will be `undefined` at runtime, causing `TypeError: ulipValueGBP is not a function`. The net worth timeline projection will crash for any user with ULIP investments.

### Bug 5 — `charts.js` line 358 — unused variable `divBy`
**File:** `js/charts.js` line 358  
**Code:**
```js
const divBy = u.currency==='INR' ? 1 : 1;
```
Both branches evaluate to `1`. The variable `divBy` is never used after this line. This is likely a leftover from a planned INR-to-GBP conversion that was later implemented differently. Dead code.

### Bug 6 — `auth-config.js` is committed despite claiming to be in `.gitignore`
**File:** `js/auth-config.js` lines 1–3  
**Code:**
```js
// ⚠️  GENERATED — DO NOT COMMIT
// Run keygen.html locally to regenerate after a credential change.
// This file is in .gitignore — never appears in the repository.
```
The file exists in the repository. It contains the same credential hashes as those hardcoded in `auth.js`. The `.gitignore` either does not exclude this file or was bypassed. Since these are one-way PBKDF2 hashes (not passwords), the immediate security risk is low, but this is a process failure that should be corrected.

### Bug 7 — `calc.js` line 447 — hardcoded original loan amount
**File:** `js/calc.js` line 447  
**Code:**
```js
const sanctioned = 3600000; // ₹36L original
```
`loanPaidToDate()` will return incorrect values for any user whose original loan was not exactly ₹36,00,000. If a different user adopted this dashboard, the "Interest paid to date" chart in `debts.js` would silently show wrong numbers.

### Bug 8 — `page-init.js` line 43 — SW controller wait has a race condition
**File:** `js/page-init.js` lines 43–50  
**Code:**
```js
if (!navigator.serviceWorker.controller) {
  await Promise.race([
    new Promise(resolve =>
      navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true })
    ),
    new Promise(resolve => setTimeout(resolve, 1000)),
  ]);
}
```
If the SW takes longer than 1 second to take control (possible on a slow device or first install), the timeout wins, the controller is still null, `_recoverKey()` will fail because `setKey` in `sw-client.js` will throw "No active service worker", and the user gets redirected to login. This is a rare but real edge case on slow hardware.

---

## Summary Table

| Category | Finding | Severity |
|---|---|---|
| Dead code | `ui.js` entire file | High |
| Bug | `settings.js` imports non-existent functions | High |
| Bug | `expenses.js` checkbox `await save_` vs `await save_()` | High |
| Bug | `networth.js` missing imports for `ulipValueGBP`, `ulipPremiumGBP` | High |
| Design | Chart colour constants duplicated 11 times | Medium |
| Design | `baseOpts`/`base` duplicated 8 times | Medium |
| Design | `getCtx()` duplicated 6 times | Medium |
| Design | `field()` helper duplicated between old and new settings | Medium |
| Bug | `analytics.js` stray `</div>` in table row | Low |
| Bug | `charts.js` unused `divBy` variable | Low |
| Bug | `auth-config.js` committed despite gitignore claim | Low |
| Bug | `calc.js` hardcoded ₹36L original loan amount | Low |
| Security | Defaults contain actual personal financial data | Low |
| CSS | Login page has 160+ lines of inline styles | Low |
| CSS | `ulip-card` duplicates `.panel` exactly | Low |
| Architecture | SW controller wait has 1-second race condition | Low |

---

*Review complete. All files read. No assumptions made from partial analysis.*
