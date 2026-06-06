# Interconnection Audit — FINAL

**Auditor:** Full Stack Tester
**Date:** 2026-06-04
**Scope:** For every sidebar page, verify the chain input field → save → localStorage → dashboard chart updates.

## Architecture summary

- **`js/store.js`** — Defines 13 `fin_*` localStorage keys. `loadAll()` strips the
  `fin_` prefix and maps multi-word snake_case keys to camelCase via `camelMap`
  (e.g. `fin_ot_shifts` → `state.otShifts`, `fin_tax_tracker` → `state.taxTracker`,
  `fin_monthly_log` → `state.monthlyLog`, `fin_india_tax` → `state.indiaTax`).
  `save(key, data)` routes camelCase keys back through `reverseMap`, and accepts
  either a camelCase key or a `fin_`-prefixed key. Both forms resolve to the same
  localStorage entry — so `saveSec('fin_income', …)` and `loadAll()`→`state.income`
  are consistent.
- **`js/page-init.js`** — `initPage()` runs SW init, `loadAll()`, layout render,
  sets the `--inr-gbp-rate` CSS var from `state.settings.inrGbpRate`, and highlights
  empty sections. `saveSec(key, data)` calls `save()` then re-highlights. All saves
  go through here and persist immediately.
- **`js/pages/dashboard.js`** — 10 tab renderers, each reading from the correct
  `state.*` keys. Charts are destroyed before re-render (registry pattern). All
  expense reads pass through `applyScheduledChanges()` before `totalExpenses()`.

---

## SECTION 1 — Income page → Overview + Income tab — **PASS**

- A. Renders safely. `#content` guarded; render wrapped in try/catch with on-page
  error fallback. No unguarded getElementById in render path.
- B. `onSave()` re-reads every `.income-field` and calls
  `saveSec('fin_income', state.income)`. Correct key.
- C. Dashboard `renderOverview` reads `st.income` → `calculateNetPay(inc)`.
  `renderIncome` reads `st.income` and builds the waterfall from the same `pay`
  object plus `inc.avgOvertimeGrossGBP`. Correct.
- D. N/A transform; net pay computed centrally in `calculateNetPay`.
- E. All 9 fields present in `renderEditForm` and saved (baseSalaryGBP,
  avgOvertimeGrossGBP, hoursPerWeek, pensionEmployeeRate, pensionEmployerRate,
  taxCode, taxFreeAllowanceAnnual, underpaymentMonthlyGBP, underpaymentClearsDate).
  Save loops over all `.income-field` elements — none omitted.

## SECTION 2 — Expenses page → Expenses tab + Surplus — **PASS**

- A. Renders safely; mutates known container IDs that exist in expenses.html.
- B. Every mutation (add/edit/delete item, add/edit/delete scheduled change)
  calls `saveSec('fin_expenses', st.expenses)`. Saves both `items` and
  `scheduledChanges`.
- C/D. Dashboard Expenses tab calls `applyScheduledChanges(st.expenses)` then
  `totalExpenses(effItems)`. Overview surplus uses the same pattern
  (`effItems = applyScheduledChanges(...)`, `totalExp = totalExpenses(effItems)`,
  `calculateSurplus(pay.netWithOT, totalExp)`). Correct order.
- E. Scheduled changes (e.g. rent drop, EE ends) are applied by
  `applyScheduledChanges()` whenever `changeDate <= today`, so they flow into
  surplus on/after their effective date. The Expenses tab's month-by-month chart
  also re-applies changes per future month. Correct.

## SECTION 3 — Debts page → Debts tab + Net Worth — **PASS**

- A. Renders safely; container IDs (`debt-summary`, `debt-fields`, `debt-edit-btn`)
  exist on debts.html.
- B. Save does `Object.assign(st.debts.sbi, draft)` then
  `saveSec('fin_debts', st.debts)`. Draft includes outstandingINR,
  originalPrincipalINR, ratePercent, emiINR, extraMonthlyINR, startDate,
  coApplicant — all saved.
- C. Dashboard Debts tab reads `st.debts.sbi` for the amortisation/balance chart
  via `generateAmortisation(sbi.outstandingINR, …)`.
- D. Net Worth subtracts debt via `calculateNetWorth(inv, st.debts, rate)` →
  `sbiGBP = outstandingINR / safeRate`. Correct.
- E. **`originalPrincipalINR` confirmed fixed.** Present in `defaults.js` (line 50),
  rendered as an editable field, saved via the draft Object.assign, and consumed by
  Overview's debt-clearance gauge (`dbt.sbi?.originalPrincipalINR`). Chain intact.

## SECTION 4 — Assets page → Assets tab + Net Worth + Goals — **FIXED**

- A. Renders safely across all 5 tabs (cash/pension/ulips/uk/india).
- B/E. Saves `cashAccounts`, `pensions`, `ulips`, `isa` (S&S / cash / lifetime),
  `sipp`, `nps`, `elss[]`, `ppf`, `sgbs[]` — all via `saveSec('fin_investments', …)`.
- C. Dashboard Assets tab reads all of these from `st.investments`.
- D. `calculateNetWorth` includes cash + pension + ulip + isa + sipp + nps + elss +
  ppf + sgbs. Confirmed (calc.js lines 160–195).
- Goals/Overview: `cashAccounts.balanceGBP` is added to India-trip saved in both
  Overview and Goals tabs, and emergency fund uses the cash balance
  (`emergencyFundProgress`). Correct.

### FAIL found and FIXED — ULIP edits were silently lost

**File:** `js/pages/assets.js`
**Symptom:** Editing an existing ULIP and clicking Save persisted no changes.
**Root cause:** The ULIP edit fields are built with `fld()`, which emits inputs
carrying a random `id` but **no `data-key` attribute**. The save handler called
`collectUlipDraft(card, …)`, which did `card.querySelectorAll('[data-key]')` —
matching zero elements — and therefore returned the unchanged existing values.
`Object.assign(inv().ulips[i], {…unchanged})` wrote back the original object, so
every edit was discarded. (Add ULIP and Remove ULIP worked; only field edits failed.)

**Fix applied:**
1. Store each in-progress edit draft in a module-level `_ulipDrafts` map keyed by
   index (`_ulipDrafts[i] = draft`), matching the existing `_ukDrafts` / `_indiaDrafts`
   pattern. `fld()` already mutates that draft object via closure on input/change.
2. Save handler now reads `Object.assign(inv().ulips[i], _ulipDrafts[i] || {})`
   then clears the entry.
3. Deleted the dead, broken `collectUlipDraft()` function.

ULIP edits now persist to `fin_investments` and flow into the dashboard Assets tab
ULIP projection, Net Worth timeline ULIP growth, and `calculateNetWorth` ulipTotal.
`node --check js/pages/assets.js` passes.

## SECTION 5 — Goals page → Goals tab + Overview gauges — **PASS**

- A. Renders safely; container IDs exist on goals.html.
- B/E. Save writes emergencyFundTargetGBP, wealthTargetGBP, targetAge, and
  `indiaTrip` (targetGBP, savedGBP, deadline, flightsPaid, breakdown[]) via
  `saveSec('fin_goals', st.goals)`. All fields captured.
- C. Dashboard Goals tab reads `st.goals.indiaTrip.savedGBP` plus the cash balance
  (`goalIndiaTotalSaved = savedGBP + cashBalance`).
- D. Overview uses the identical India-trip calculation (savedGBP + cashBalance).
- `indiaTripProgress` defaults `target` to 3000 when `targetGBP` is falsy, so a
  zero/empty target does not divide by zero. Correct.

## SECTION 6 — Net Worth page → Net Worth tab — **PASS**

- A. Renders safely; chart contexts null-guarded.
- B/C. `bindNwFields` writes nwProjection (pensionGrowthRate, careerTransitionDate,
  newSalaryGBP) into `st.settings.nwProjection` and persists with
  `save('fin_settings', st.settings)` on change.
- D. Dashboard Net Worth tab reads `st.settings.nwProjection` and passes all
  required params to `projectNetWorthTimeline` (start net worth, monthly saving,
  pension value/monthly/growth, ULIP totals/premium/months/rate, debt INR/EMI/rate,
  rate, career transition date, new salary, current salary). The networth page chart
  builds the same param set. Correct.

## SECTION 7 — OT Tracker page → OT tab + Income predictions + India trip — **PASS**

- A. Renders safely; `#content` populated, all events attached after render.
- B. Adding/deleting a shift calls `saveSec('fin_ot_shifts', state.otShifts)`.
  Month confirm calls `saveSec('fin_ot_monthly_summary', …)`.
- C. Dashboard OT tab reads `st.otShifts` and `st.otMonthlySummary`.
- D. Income tab YTD uses `st.otShifts` filtered on year 2026. Correct.
- Month confirm: computes `monthlySaved = actual − expenses + indiaRedirect` and,
  when positive, increments `state.goals.indiaTrip.savedGBP` and calls
  `saveSec('fin_goals', state.goals)`. India trip stays in sync.
- `predictMonth` passes the actual month OT gross as `avgOvertimeGrossGBP` into
  `calculateNetPay({ ...state.income, avgOvertimeGrossGBP: otGross })`, and uses a
  per-month expense helper that applies scheduled changes at the correct month.
  Correct.

## SECTION 8 — Tax page → Tax tab — **PASS**

- A. Renders safely; India section render short-circuits if `india-income-fields`
  is absent.
- B. UK tracker fields save to `fin_tax_tracker` (taxCode, underpaymentTotal,
  monthlyDeduction, startDate, endDate); calendar cells save `verifiedMonths`.
  India NRI fields save to `fin_india_tax` via dotted-path `setPath` binder.
- C. Dashboard Tax tab reads `st.taxTracker` (`taxTrackerProgress`) and `st.indiaTax`
  (`calcNetIndiaTax`, `calc80EDeduction`). Correct.
- D. UK underpayment surfaces on the Income page through the separate
  `underpaymentMonthlyGBP` income field feeding `pay.extraTax` in the waterfall.
  (Note: the Income page's `underpaymentMonthlyGBP` and the Tax tracker's
  `monthlyDeduction`/`underpaymentTotal` are independent stores by design — both are
  user-entered; no auto-sync between them, which matches the current product intent.)

## SECTION 9 — Preferences page → all sections — **PASS**

- A. Renders safely; the live tab set is display/data/charts.
- B. The Display tab's INR/GBP rate writes to **both** `state.settings.inrGbpRate`
  and `state.profile.inrGbpRate`, and Save persists `fin_settings` + `fin_profile`.
- C. `initPage()` sets `--inr-gbp-rate` from `state.settings.inrGbpRate` on every
  page load, so a saved rate change immediately affects all INR→GBP conversions
  (every dashboard read uses `st.settings?.inrGbpRate || 83` → `safeRate`). The
  top-bar rate display fetches the live market rate independently
  (`fetchLiveRate`), which is by design separate from the stored conversion rate.

---

## Summary

| Section | Result |
|---|---|
| 1 — Income | PASS |
| 2 — Expenses | PASS |
| 3 — Debts | PASS |
| 4 — Assets | **FIXED** (ULIP edits were silently lost) |
| 5 — Goals | PASS |
| 6 — Net Worth | PASS |
| 7 — OT Tracker | PASS |
| 8 — Tax | PASS |
| 9 — Preferences | PASS |

**1 defect found and fixed:** ULIP field edits in `assets.js` did not persist
because the save path read non-existent `data-key` attributes. Rewired to the
`_ulipDrafts` closure-draft pattern; dead `collectUlipDraft()` removed.
All audited files pass `node --check`.
