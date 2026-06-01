# Financial Dashboard — Fault Report
# Date: 2026-06-01
# Reviewed by: Dev Team Lead

## Summary

A comprehensive fix pass plus a deep fault-finding review was performed across
every JS and HTML file in `src/projects/financial-dashboard/`. The five known
issues were addressed, and the full codebase was read line-by-line for broken
imports, null references, missing function calls, dead code, hardcoded data,
chart errors, divide-by-zero logic, and new-store compatibility.

Two previously-unknown runtime faults were found and fixed (one HIGH, one
MEDIUM-HIGH) plus one malformed-markup bug. Remaining items are Low severity
and documented below.

---

## Fixes applied in this pass

### Fix 1 (CRITICAL) — Setup highlighting now works
- **page-init.js:12** — Hardened the `expenses` empty-data check.
  Was `state.expenses?.items?.every(...)` which returns `true` (vacuously)
  for an empty array and `undefined` if `items` is missing. Now:
  `() => !state.expenses?.items?.length || state.expenses.items.every(i => !i.monthlyGBP)`.
- Added `data-section` attributes to the main container on every page so
  `highlightEmptyData()`'s `querySelectorAll('[data-section="X"]')` actually
  matches something:
  - `income.html` — Income Settings panel → `data-section="income"`
  - `expenses.html` — All Expenses panel → `data-section="expenses"`
  - `debts.html` — Loan Details panel → `data-section="debts"`
  - `assets.html` — pension/cash grid → `data-section="investments"`
  - `goals.html` — emergency-runway card → `data-section="goals"`
  - `tax.html` — Underpayment Details panel → `data-section="tax"`
  - `settings.html` — `#settings-content` → `data-section="profile"`
  - `dashboard.html` — `#overview-cards` → `data-section="income"`,
    `#gauge-debt` → `data-section="debts"`,
    `#gauge-emergency` → `data-section="investments"`

### Fix 2 (HIGH) — Dead legacy files removed
- Deleted `js/ui.js` (47 KB, old monolithic UI) and `js/settings.js` (16 KB,
  old settings system).
- Verified first that **no HTML page** loads them via a `<script>` tag and
  **no active module** imports them. Confirmed safe; no script tags needed
  removing. (Files staged for deletion via `git add -A`.)

### Fix 3 (MEDIUM) — Non-functional password section
- **No change required.** Read `js/pages/settings-page.js` and `settings.html`
  in full. Auth was already fully stripped: there is **no** "Change Password"
  or "Security" tab/section rendered anywhere, and the settings tab list has no
  security tab. Nothing to hide. (`js/auth.js` and `js/sw-client.js` retain
  no-op stubs for API compatibility — harmless.)

### Fix 4 (MEDIUM) — gauge-val-wealth null reference
- **No literal `gauge-val-wealth` reference exists.** `dashboard.js` references
  `gauge-val-debt`, `gauge-val-emergency`, `gauge-val-india` — all of which DO
  exist in `dashboard.html`. To harden against the underlying class of bug
  (gauge text-setters assuming the element exists), wrapped all six gauge
  text updates in a null-safe `setText()` helper.
  - **dashboard.js:69-74** — replaced direct
    `document.getElementById('gauge-val-debt').textContent = ...`
    with `setText(id, value)` that checks `if (el)` first.

### Bug A (HIGH) — networth.js missing imports → broken chart  *(found in review)*
- **networth.js:212-213** — `renderNwChart()` calls `ulipValueGBP(u, rate)` and
  `ulipPremiumGBP(u, rate)` but neither was in the import block (lines 3-7).
  This threw `ReferenceError: ulipValueGBP is not defined` when `render()` ran,
  breaking the entire Net Worth Timeline chart (Assets/Liabilities/Net Worth).
- **Fix:** added `ulipValueGBP, ulipPremiumGBP` to the `../calc.js` import.

### Bug B (MEDIUM-HIGH) — expenses.js active toggle never saved  *(found in review)*
- **expenses.js:108** — In `bindExpenseEvents()`, the "Active" checkbox handler
  did `await save_;` — referencing the `save_` function **without calling it**.
  The expression evaluated to the function object and was discarded, so toggling
  an expense active/inactive updated the in-memory object but **never persisted
  to localStorage and never re-rendered**.
- **Fix:** changed to `await save_();`.
- Note: this is the "`save_()` vs `save_`" class of bug flagged in the brief.
  The name/category/amount inputs were already correct (`el.addEventListener('change', save_)`);
  only the active-checkbox handler had the defect.

### Bug C (MEDIUM) — malformed markup in analytics.js  *(found in review)*
- **analytics.js:101** — Stray closing `</div>` inside a table cell:
  `...${fmtGBP(housingCost)}</td></div></tr>`. Removed the spurious `</div>`.

---

## Remaining known issues

### Low — Topbar "PDF" button is a no-op on every page
- **shared-layout.js:114** — The topbar PDF button calls
  `window._exportCurrentPagePDF()`, but that global is **never assigned**
  anywhere in the live codebase. (Only `window._exportSectionPDF` is set, and
  only inside the dead `export.js`/`ui.js`.) The call is guarded by
  `if (window._exportCurrentPagePDF)`, so it fails **silently** — no console
  error, the button simply does nothing.
- **Not fixed:** wiring a real per-page PDF export (html2canvas + jsPDF) is a
  new feature, >5 lines, and out of scope for a fix pass. Recommend a follow-up
  task to either implement it or remove the button.

### Low — `js/charts.js` and `js/export.js` are dead code
- `charts.js` (25 KB) is the old monolithic chart system. **Confirmed dead:**
  no HTML loads it, no module imports it. The brief asked only to confirm this
  (not delete it), so it was left in place.
- `export.js` (the `initExport`/per-section-PDF module) is **also dead**:
  `export.html` loads `js/pages/export-page.js`, not `js/export.js`. Nothing
  imports `export.js`.
- **Not deleted:** outside the explicit Fix-2 scope (ui.js/settings.js only).
  Recommend removing both in a cleanup task to cut ~30 KB of dead source.

### Low — Stale "encrypted" wording in UI/exports
- `settings-page.js:257` ("Export all your encrypted data as JSON") and
  `export.html:45` ("Export all encrypted data") still say *encrypted*, but
  encryption was removed — data is plain-text JSON. Cosmetic/misleading only.
- The JSON export filters also still include `auth_`/`enc_` localStorage
  prefixes (`export-page.js:84`, `settings-page.js:274`, `export.js:84`) — a
  harmless legacy no-op since those keys no longer exist.
- **Not fixed:** purely cosmetic; low value, defer to docs/UX cleanup.

---

## Items explicitly verified clean

- **Broken imports:** all page modules import only symbols that exist in
  `calc.js` / `store.js` / `page-init.js` (after Bug A fix). No imports of the
  removed `auth.js`/old `store.js` functions remain in live modules.
- **Store compatibility:** every page accesses the new short-key state shape
  correctly — `state.income`, `state.expenses`, `state.debts`,
  `state.investments`, `state.goals`, `state.taxTracker`, `state.indiaLog`,
  `state.monthlyLog`, `state.settings`, `state.profile`. `store.js.loadAll()`
  strips the `fin_` prefix, and all readers use the stripped keys.
- **Divide-by-zero with all-zero defaults:** `indiaTripProgress`,
  `emergencyFundProgress`, `taxTrackerProgress`, `wealthProgress`,
  `emergencyRunwayMonths`, and the analytics ratio calcs all guard their
  denominators (`!target`, `> 0`, `netMonthly > 0`, etc.). No division faults.
- **Chart system:** all live pages use their own inline Chart.js render code;
  none import the dead `charts.js`. No chart references the old system.
- **Hardcoded personal data:** `defaults.js` is fully zeroed (names blank, all
  GBP/INR/age values 0). Some non-personal display fallbacks remain in page
  code (e.g. `|| 3000` for India target, `|| 34090` EMI, `|| 125` FX rate,
  `|| 28000` salary in scenario tables) — these are calculation/illustration
  defaults, not leaked personal data.

---

## Dashboard health after fixes

**Good.** The two functional faults that would actually break pages at runtime
are resolved:
- The **Net Worth Timeline** page no longer throws a `ReferenceError` and now
  renders its projection chart (Bug A — HIGH).
- The **Expenses** active-toggle now persists and re-renders (Bug B).
- The **setup-highlighting** feature is now wired end-to-end (data-section
  attributes + corrected empty-array guard), so new users see the "needs your
  data" banner and highlighted empty sections.

The remaining issues are all Low severity and non-breaking (silent no-op PDF
button, dead source files, cosmetic "encrypted" labels). They do not affect
correctness of any displayed figure or the save/load cycle. Recommended
follow-ups: implement-or-remove the PDF button, and delete `charts.js`/`export.js`.
