# Interconnectivity Audit — Finance Dashboard

**Auditor:** Full Stack Tester
**Date:** 2026-06-03
**Scope:** Emergency post-redesign audit. Element-ID integrity per page, calc.js
import resolution, CSS-class existence for querySelectorAll targets, and six
named data-flow interconnections.

---

## EXECUTIVE SUMMARY

**No page will throw a fatal "cannot set innerHTML of null" error on load.**
Every `getElementById('X')` that runs during initial render has a matching
element — either a static element in the page HTML, or one rendered into
`#content` / a known container *before* the lookup, or one guarded with `?.`
/ `if (!el) return`.

All 38 named imports from `calc.js` resolve to real exports. All
style-critical CSS classes exist.

**However, three genuine data-flow defects were found** (none of them blank the
page, but they corrupt or break specific numbers):

1. **FAIL — Debts original-principal field mismatch** (`debts.js`): reads/writes
   `principalINR`; the schema and `loanPaidToDate()` use `originalPrincipalINR`.
   Original-principal edits on the Debts page never persist to the field the
   rest of the app reads.
2. **FAIL — OT savings forecast does not write back to the India trip goal**
   (check 5): the forecast is display-only; `state.goals.indiaTrip.savedGBP` is
   never updated from it. By design today, but the interconnection the task
   asked to verify does **not** exist.
3. **WARN — Settings page has dead, unreachable tab renderers.** `renderProfile`,
   `renderIncome`, `renderExpenses`, `renderDebts`, `renderInvestments`,
   `renderGoals`, `renderProjections`, `renderTaxSettings` exist but the only
   tabs wired in `settings.html` are Display / Data / Charts. Not a crash, but a
   lot of "settings" the user cannot reach from this page (they are reachable on
   the dedicated section pages).

---

## PART 1 — PER-PAGE ELEMENT-ID TRACE

Legend: **[H]** = static element in the page HTML · **[D]** = element rendered
by the JS into a container before the lookup · **[G]** = lookup is guarded
(`?.` or `if(!el)`), so a miss cannot throw.

### income.html + js/pages/income.js — **PASS**
| getElementById | exists? | how |
|---|---|---|
| `content` | yes | [H] |
| `edit-btn` | yes | [D] rendered in read-only panel, then wired |
| `cancel-btn` | yes | [D] rendered in edit panel |
| `save-btn` | yes | [D] rendered in edit panel |

All lookups happen inside `attachEvents()` after `content.innerHTML` is set, and
each is `if (el)`-guarded. No throw.

### expenses.html + js/pages/expenses.js — **PASS**
| getElementById | exists? | how |
|---|---|---|
| `expenses-summary` | yes | [H] |
| `expenses-table-wrap` | yes | [H] |
| `scheduled-changes-list` | yes | [H] |
| `add-expense-btn` | yes | [H] |
| `add-sc-btn` | yes | [H] |

All five are static in `expenses.html`. No throw.

### debts.html + js/pages/debts.js — **PASS** (element IDs) / data bug noted in Part 4
| getElementById | exists? | how |
|---|---|---|
| `debt-summary` | yes | [H] |
| `debt-fields` | yes | [H] |
| `debt-edit-btn` | yes | [H] |
| `debt-cancel-btn` | yes | [D] rendered only in edit form |
| `debt-save-btn` | yes | [D] rendered only in edit form |

`debt-cancel-btn` / `debt-save-btn` are looked up only inside the `editing`
branch, immediately after the edit form is written to `debt-fields`. No throw.

### assets.html + js/pages/assets.js — **PASS**
| getElementById / selector | exists? | how |
|---|---|---|
| `assets-content` | yes | [H] |
| `#assets-tabs .tab-btn` | yes | [H] (5 tab buttons) |
| `ulip-add-btn` | yes | [D] + guarded `if (addBtn)` |
| `elss-add-btn` / `elss-save-btn` | yes | [D] (only in ELSS edit mode) + guarded |
| `sgb-add-btn` / `sgb-save-btn` | yes | [D] (only in SGB edit mode) + guarded |

All dynamic add/save buttons are rendered before lookup and guarded. No throw.

### goals.html + js/pages/goals.js — **PASS**
| getElementById | exists? | how |
|---|---|---|
| `goals-summary-cards` | yes | [H] |
| `goals-wealth-card` | yes | [H] |
| `goals-edit-body` | yes | [H] |
| `goals-edit-btn` | yes | [H] |
| `ef-edit-target/wealth/retage` | yes | [D] edit panel |
| `trip-edit-target/saved/deadline/flights` | yes | [D] edit panel |
| `bd-add-btn`, `goals-cancel-btn`, `goals-save-btn` | yes | [D] edit panel |

The `ef-*`/`trip-*`/`bd-*` lookups run only inside `renderEditPanel` after the
edit body is written. No throw.

### networth.html + js/pages/networth.js — **PASS**
| getElementById | exists? | how |
|---|---|---|
| `nw-settings-fields` | yes | [H] |
| `nw-scenarios` | yes | [H] |
| `age-traj-controls` | yes | [H] |
| `chart-age-trajectory` | yes | [H] (canvas) + [G] `?.getContext` |
| `chart-nw-timeline` | yes | [H] (canvas) + [G] `?.getContext` |

`nw-summary-card` exists in HTML but is never referenced by the JS (harmless).
No throw.

### overtime.html + js/pages/overtime.js — **PASS**
| getElementById | exists? | how |
|---|---|---|
| `content` | yes | [H] |
| `ot-date/amount/note/confirmed/add-btn` | yes | [D] shift-logger, written before `attachEvents()` |
| `ot-whatif`, `ot-whatif-label` | yes | [D] forecast panel | 

All `ot-*` IDs are produced by the render template that runs before
`attachEvents()`; the slider/label lookups are `if`-guarded. No throw.
Note: `overtime.js` calls `render()` twice (line 410 and again inside the
module) — harmless idempotent re-render, not a bug.

### tax.html + js/pages/tax.js — **PASS**
| getElementById | exists? | how |
|---|---|---|
| `tax-fields`, `tax-progress`, `tax-calendar` | yes | [H] |
| `chart-tax-line` | yes | [H] (canvas) + [G] |
| `india-income-fields` | yes | [H] — also the guard: `renderIndia` returns early if absent |
| `india-tds/80e/dtaa/itr-fields` | yes | [H] |
| `india-80e-panel`, `india-itr-status`, `india-summary-cards` | yes | [H] |
| `india-ay-label`, `india-surcharge-banner` | yes | [H] + [G] |

`renderIndia()` opens with `if (!document.getElementById('india-income-fields')) return;`
so even a partial page cannot throw. No throw.

### dashboard.html + js/pages/dashboard.js — **PASS**
| getElementById / selector | exists? | how |
|---|---|---|
| `dash-content` | yes | [H] + [G] `if (!host) return` |
| `.dash-tab` (10 buttons) | yes | [H] |
| `topbar-rate`, `-value`, `-time`, `-refresh` | yes | rendered by `renderSharedLayout` into `#topbar`; all guarded (`if (!container) return`, `?.`) |
| `ast-chart-ulip` | yes | [D] in `renderAssets` + [G] |

Topbar rate elements are injected by `shared-layout.js` during
`initPage('overview')`, before `updateTopbarRate()` runs. All guarded. No throw.

### settings.html + js/pages/settings-page.js — **PASS** (element IDs) / dead-code WARN in Part 4
| getElementById / selector | exists? | how |
|---|---|---|
| `settings-content` | yes | [H] |
| `#settings-tabs .tab-btn` (3) | yes | [H] |
| `data-export-btn` / `data-import-btn` / `data-import-file` / `data-reset-btn` | yes | [D] — only rendered inside the **Data** tab (`renderData`), looked up immediately after innerHTML in the same function |
| `settings-save-btn` | yes | [D] + [G] via `_attachSaveButton` `if (!btn) return` |

Default tab is `display`; the `data-*` lookups only run when the Data tab is
rendered, and they run synchronously right after the markup is written. No throw.

### export.html + js/pages/export-page.js — **PASS**
| getElementById | exists? | how |
|---|---|---|
| `export-excel-btn` | yes | [H] |
| `data-export-btn` / `data-import-btn` / `data-import-file` / `data-reset-btn` | yes | [H] |
| `csv-import-file` / `csv-detect-msg` / `csv-preview-wrap` / `csv-preview-table` | yes | [H] |
| `csv-review-btn` / `csv-review-wrap` / `csv-review-summary` / `csv-review-table` | yes | [H] |
| `csv-confirm-btn` / `csv-cancel-btn` / `csv-result-msg` | yes | [H] |

All export/CSV IDs are static in `export.html`. The JSON buttons use `?.`
(double-defined here and on the Settings Data tab — harmless). `export-excel-btn`
is **not** guarded but the element exists, so OK.
External dependency note: relies on global `XLSX` being loaded by the page; if
the SheetJS `<script>` is missing the Excel button throws on click (not on load).

---

## PART 2 — calc.js IMPORT RESOLUTION — **PASS (all 38 resolve)**

Every named import of `calc.js` across all pages matches an `export function`
in `calc.js`. Verified programmatically (set difference of imports − exports is
empty). Imports verified:

`ageWealthTrajectory, amortPayoffDate, applyScheduledChanges, calc80EDeduction,
calcCrossBorderPosition, calcITRDeadline, calcNetIndiaTax, calculateNetPay,
calculateNetWorth, calculateSurplus, emergencyFundProgress,
emergencyRunwayMonths, expensesByCategory, fmtGBP, fmtINR, fmtMonths, fmtPct,
generateAmortisation, indiaTripProgress, loanPaidToDate, projectNetWorthTimeline,
projectULIP, round2, surplusTrajectoryEvents, taxTrackerProgress, totalExpenses,
ulipPremiumGBP, ulipValueGBP, wealthProgress`.

No missing export. No broken import.

---

## PART 3 — querySelectorAll('.class') / CSS — **PASS**

All `.class` selectors used in page JS target elements the same JS renders
(data-bound rows/inputs, e.g. `.income-field`, `.sc-input`, `.bd-row`,
`.india-field`, `.dash-tab`). `querySelectorAll` never throws on a missing
class, so none of these can blank a page.

Style-critical classes were spot-checked against `components.css` / `layout.css`
and all exist: `dash-tab, tab-btn, needs-data, setup-banner, metric-card, panel,
section-header, grid-2/3/4, stat-row, chart-wrap, gauge-wrap, data-table, tabs,
dash-tabs, topbar-rate`. No missing style class found.

---

## PART 4 — DATA-FLOW AUDIT (6 named checks)

### 1. India trip dashboard graph — **PASS**
- `dashboard.js` reads `goals.indiaTrip?.savedGBP` (renderOverview/renderGoals)
  and feeds `indiaTripProgress(goals)`.
- `goals.js` save path: `st.goals.indiaTrip.savedGBP = parseFloat(#trip-edit-saved)`
  then `saveSec('fin_goals', st.goals)`.
- `store.js` maps `fin_goals` → `state.goals` (no camel remap needed; key is
  single-word after stripping `fin_`). Read back as `state.goals.indiaTrip.savedGBP`.
- **Trace is correct end-to-end.** No fix needed.

### 2. OT shifts → Income prediction — **PASS**
- `overtime.js` pushes shifts and `saveSec('fin_ot_shifts', state.otShifts)`.
- `store.js` camelMap: `ot_shifts` → `otShifts`; reverseMap: `otShifts` →
  `fin_ot_shifts`. Round-trips correctly.
- Dashboard Income tab (`renderIncome`) and OT tab (`renderOT`) read
  `st.otShifts` and recompute YTD/monthly OT, then `calculateNetPay({...inc,
  avgOvertimeGrossGBP: otGross})`. **Correct.** No fix needed.

### 3. Expenses → Surplus calculation — **PASS**
- Call signature on dashboard: `totalExpenses(applyScheduledChanges(state.expenses))`.
- `applyScheduledChanges(expenses)` takes the whole expenses object and returns
  an **items array** (applying any scheduledChange whose `changeDate <= today`).
- `totalExpenses(items)` takes that items array and sums `active` items.
- Signatures match; scheduled changes that are due are reflected.
- One **accuracy limitation** (not a defect in signature): `applyScheduledChanges`
  only ever uses *today's* date. The OT tracker correctly works around this with
  its own per-month `getExpensesForMonth(ym)`; the dashboard's
  month-by-month expense chart also re-implements per-month logic. The headline
  surplus uses today — which is the intended "current surplus". **No fix needed.**

### 4. Investments → Net worth — **PASS**
- `calculateNetWorth(investments, debts, inrGbpRate)` includes:
  cash, pensions, ULIPs, **ISA** (S&S + cash + LISA), **SIPP**, **NPS**
  (tier1+tier2 INR ÷ rate), **ELSS** (INR ÷ rate), **PPF** (INR ÷ rate),
  **SGBs** (gramsHeld × purchasePriceINR ÷ rate). (calc.js lines 167–181.)
- Dashboard `renderAssets` / `renderNetWorth` / goals.js / networth.js all call
  it with the live `state.investments`. **All new-schema assets are counted.**
  No fix needed.
- Minor modelling note (not a bug): SGBs are valued at *cost basis*
  (purchase price), not current gold price — consistent with how the Assets
  page labels it ("Cost basis").

### 5. OT savings forecast → India trip — **FAIL (interconnection absent)**
- `overtime.js` `renderSavingsForecast()` computes a running projected balance
  starting from `START_BALANCE = state.goals?.indiaTrip?.savedGBP || 600`. It
  **reads** the goal but **never writes** the projected/updated saved amount
  back to `state.goals.indiaTrip.savedGBP`. There is no `saveSec('fin_goals',…)`
  anywhere in `overtime.js`.
- Consequence: confirming OT months and watching the forecast climb does **not**
  update the India-trip "Saved" figure shown on the Goals page or the dashboard
  India gauge. The two are linked only one-way (goal → forecast start balance).
- **Fix (choose one):**
  - **(Preferred, explicit)** When a month is confirmed in `overtime.js`
    (`ot-confirm-save` handler), also update the goal:
    `state.goals.indiaTrip.savedGBP = round2((state.goals.indiaTrip.savedGBP||0) + actualSavedThatMonth);`
    then `await saveSec('fin_goals', state.goals);` — where `actualSavedThatMonth`
    is the row's `saved` value for that month. This makes confirmed months
    flow into the real goal while estimates stay display-only.
  - **(Alternative)** Add a "Sync forecast to goal" button that writes the
    current `running` end-balance to `state.goals.indiaTrip.savedGBP` and saves.
  - Do **not** auto-write on every render (it would double-count START_BALANCE
    which is itself read from the goal).

### 6. Tax tracker → dashboard Tax tab — **PASS**
- `tax.js` saves UK tracker via `saveSec('fin_tax_tracker', st.taxTracker)` and
  India module via `saveSec('fin_india_tax', it)`.
- `store.js` camelMap: `tax_tracker`→`taxTracker`, `india_tax`→`indiaTax`.
- Dashboard `renderTax` reads `st.taxTracker` (UK cards + chart via
  `taxTrackerProgress`) and `st.indiaTax` (India cards via `calcNetIndiaTax` /
  `calc80EDeduction`, shown when any India income field is non-zero).
- **Round-trips correctly both jurisdictions.** No fix needed.

---

## PART 5 — ADDITIONAL DEFECTS FOUND (outside the 6 named checks)

### A. Debts original-principal field name mismatch — **FAIL (data)**
- **Where:** `js/pages/debts.js` read-only view (line ~56) and edit form
  (line ~72) use key **`principalINR`**:
  `${fmtINR(sbi.principalINR||0)}` and `dField('Original principal (₹)', 'principalINR', …)`.
- **Schema / consumers use `originalPrincipalINR`:** `defaults.js`
  (`fin_debts.sbi.originalPrincipalINR`), `calc.js loanPaidToDate()`
  (`sbi.originalPrincipalINR`), and `dashboard.js renderOverview`
  (`dbt.sbi?.originalPrincipalINR`).
- **Consequence:** Editing "Original principal" on the Debts page writes
  `sbi.principalINR`, which nothing else reads. `loanPaidToDate()` therefore
  keeps seeing `originalPrincipalINR = 0` and returns zero interest/principal
  paid; the dashboard debt-clearance gauge cannot compute a real % cleared.
  The read-only view also always shows ₹0 for original principal.
- **Fix:** In `debts.js`, rename both occurrences of the key from
  `principalINR` to `originalPrincipalINR`:
  - read-only row: `${fmtINR(sbi.originalPrincipalINR||0)}`
  - edit field: `dField('Original principal (₹)', 'originalPrincipalINR', draft.originalPrincipalINR)`
  (The Settings → Debts tab does not expose this field at all, so the Debts page
  is the only edit path; fixing the key here restores the whole chain.)

### B. Settings page — unreachable tab renderers — **WARN (dead code / missing UX)**
- **Where:** `js/pages/settings-page.js`. `renderTab()` switch handles only
  `display`, `data`, `charts`. Functions `renderProfile`, `renderIncome`,
  `renderExpenses`, `renderDebts`, `renderInvestments`, `renderGoals`,
  `renderProjections`, `renderTaxSettings` are defined but never called; the
  `settings.html` tab bar only declares Display / Data / Charts.
- **Consequence:** Not a crash. These settings are reachable on their dedicated
  section pages (Income, Debts, Assets, Goals, Net Worth, Tax), so functionality
  is not lost — but a user expecting them under "Settings" will not find them,
  and the dead functions are maintenance risk.
- **Fix (pick one):**
  - If the section pages are the intended single source of truth, **delete** the
    unused renderers to remove confusion; or
  - If Settings is meant to host them, **add** the missing `<button class="tab-btn"
    data-tab="…">` entries to `settings.html` and the matching `case` lines in
    `renderTab()`.

### C. export-page.js depends on global `XLSX` — **WARN (external dep)**
- `exportExcel()` calls `XLSX.utils…`. If `export.html` does not include the
  SheetJS script, clicking "Export to Excel" throws `XLSX is not defined`
  (on click, not on load). Confirm the `<script>` tag is present in `export.html`.

---

## VERDICT

| Check | Result |
|---|---|
| 11 pages — element-ID load safety | **PASS (0 fatal)** |
| calc.js imports resolve | **PASS (38/38)** |
| CSS classes for querySelectorAll | **PASS** |
| DF1 India trip graph save path | **PASS** |
| DF2 OT shifts → income prediction | **PASS** |
| DF3 Expenses → surplus signature | **PASS** |
| DF4 Investments → net worth (full schema) | **PASS** |
| DF5 OT forecast → India trip write-back | **FAIL** |
| DF6 Tax tracker → dashboard | **PASS** |
| Extra-A Debts originalPrincipalINR key | **FAIL** |
| Extra-B Settings dead tab renderers | **WARN** |
| Extra-C export XLSX global dep | **WARN** |

**Blank-page risk: none found.** The "multiple pages are blank" symptom is NOT
explained by element-ID/import mismatches in the current code — every page's
render path is sound. If pages are still rendering blank in the browser, the
cause is almost certainly **runtime/load-order**, not missing IDs. Recommend
checking, in order:
1. The browser console for an early thrown error in `initPage` /
   `renderSharedLayout` (a throw there aborts the whole module before any page
   render runs — would blank *every* page identically).
2. That Chart.js / SheetJS `<script>` tags load before the page module and that
   the page `<script type="module">` path is correct.
3. localStorage holding malformed JSON for a `fin_*` key (store.js catches
   parse errors per-key and falls back to defaults, so this is unlikely to blank
   a page, but worth confirming).

The two **FAIL** items (DF5 write-back, Debts key) are real and should be fixed,
but they degrade specific numbers — they do not blank pages.
