# CA Phase 3 Sign-Off — India NRI Tax Module
**Reviewer:** CA Arjun Mehta, ICAI + ICAEW
**Date:** 2026-06-02
**Module:** India NRI Tax (fin_india_tax)
**Spec version reviewed:** v1.1 (INDIA_NRI_TAX_MODULE_SPEC.md, amended 2026-06-02)
**Files reviewed:**
- `src/projects/financial-dashboard/js/calc.js` (lines 523–892)
- `src/projects/financial-dashboard/js/pages/tax.js` (full file)
- `src/projects/financial-dashboard/tax.html`

---

## Verdict

**APPROVED WITH MINOR NOTES**

The implementation is substantively correct. All blocking tax law issues from Phase 1 and Phase 2 reviews have been resolved. The calculations are legally sound for the stated scope (NRI, FY 2024-25 / AY 2025-26, income below ₹50L surcharge threshold). Two minor issues and two spec test case errors are noted below. Neither minor issue produces incorrect tax output for the user; both are cosmetic or defensive concerns.

---

## Checklist Results

### 1. Dividend bifurcation — PASS

`calcNetIndiaTax` (calc.js lines 637–731) correctly bifurcates dividend income from slab income.

- Dividend income is passed exclusively to `calcDividendTax()` which applies the flat 20% + 4% cess = 20.8% rate per s.115A ITA 1961.
- Dividend income is explicitly excluded from `slabTaxableIncomeINR` (line 657–660).
- The basic exemption limit does not apply to the dividend component, which is correct for NRI dividend taxation under s.115A.
- `calcDividendTax()` (line 598–601): returns `round2((dividendIncomeINR || 0) * 0.208)` — correctly implements 20% × 1.04 = 20.8%.

**Finding:** Correct. Bifurcation is complete and legally accurate.

---

### 2. Rental income standard deduction — PASS

`calcNetIndiaTax` (calc.js lines 646–647):
```js
const rentalStdDeductionINR  = round2(rentalGross * 0.30);
const taxableRentalIncomeINR = round2(rentalGross * 0.70);
```
The 30% standard deduction u/s 24(a) is applied correctly before slab entry. `taxableRentalIncomeINR` (not the gross) is what flows into `slabTaxableIncomeINR` at line 659.

`calc80EDeduction` (line 561–563) also correctly uses `rentalIncomeINR × 0.70` for marginal rate estimation, ensuring internal consistency between the two functions.

The UI help text on the rental income field correctly states: "A 30% standard deduction u/s 24(a) is applied automatically before slab calculation."

**Finding:** Correct. Matches both s.24(a) ITA 1961 and the v1.1 spec amendment.

---

### 3. Tax slabs — PASS

**Old regime (calc.js lines 773–778):**
```
0 – 2,50,000:      0%
2,50,001 – 5,00,000:  5%
5,00,001 – 10,00,000: 20%
Above 10,00,000:   30%
```
Matches AY 2025-26 NRI old regime rates. Correct.

**New regime (calc.js lines 763–771):**
```
0 – 3,00,000:      0%
3,00,001 – 7,00,000:  5%
7,00,001 – 10,00,000: 10%
10,00,001 – 12,00,000: 15%
12,00,001 – 15,00,000: 20%
Above 15,00,000:   30%
```
Matches post-Budget 2024 new regime slabs for AY 2025-26. Correct. The JSDoc note that rebate u/s 87A is not available to NRIs is appropriately included.

`calcSlabTax` (lines 787–797): the generic slab engine is mathematically correct. The `Math.min(income, slab.upTo) - prev` pattern handles all band boundaries accurately.

**Finding:** Correct. All thresholds and rates match AY 2025-26 statutory rates.

---

### 4. Section 80E — PASS

**Regime gate (calc.js lines 547–552):**
```js
if (
  indiaTax.taxRegime !== 'old' ||
  !sec80E.claimingDeduction ||
  (sec80E.deductionYearsUsed || 0) >= 8
) {
  return { deductionINR: 0, taxSavingINR: 0, marginalRatePct: 0 };
}
```
Three-way guard: new regime → zero; not claiming → zero; window exhausted (>= 8 years used) → zero. All three cases tested and confirmed correct.

**8-year window:** The `>= 8` gate (not `> 8`) is correct. After 8 years of deduction the window is exhausted, regardless of whether the user has entered exactly 8 or more.

**Old regime only gate in UI (tax.js lines 237–245):** `newRegime` is correctly computed as `(it.taxRegime || 'old') !== 'old'`. The panel receives `panel-disabled` CSS class and a warning banner when new regime is active. When old regime is restored, the panel is re-enabled on the next `renderIndia()` call.

**No monetary cap:** The deduction equals `sec80E.annualInterestPaidINR` in full — correct, s.80E ITA 1961 has no upper limit on the deduction amount.

**Tax saving formula:** `deductionINR × (marginalRatePct / 100) × 1.04` — correctly includes 4% Health & Education Cess.

**Finding:** Correct. All three guards, the 8-year window, the no-cap rule, and cess treatment are properly implemented.

---

### 5. ITR deadline — PASS

`calcITRDeadline` (calc.js lines 865–892):

- `deadlineMonth = itr.isAuditCase ? 9 : 6` — month index 6 = July, month index 9 = October. Correct.
- `new Date(ayYear, 6, 31)` constructs 31 July locally. Verified: `getDate()` returns 31, `getMonth()` returns 6 (July). Correct.
- `new Date(ayYear, 9, 31)` constructs 31 October. Correct.
- AY year parsing: `'AY 2025-26'.match(/AY\s+(\d{4})/)` extracts 2025. Correct.
- Alert state thresholds: `< 0` → overdue, `0–30` → warning, `> 30` → ok. Correct.
- Null guard `itr = itr || {}` added in calc.js (not in spec version) — correct defensive improvement.

**Minor issue (latent, non-user-facing):** `deadlineISO` is computed via `deadline.toISOString().slice(0, 10)`. Because `new Date(2025, 6, 31)` is midnight in the local timezone (BST = UTC+1 in summer), `toISOString()` returns a UTC time that falls on 30 July. The returned `deadlineISO` therefore reads `'2025-07-30'` instead of `'2025-07-31'`. However, `deadlineISO` is not rendered anywhere in `tax.js` — only `deadlineLabel` (which correctly reads "31 July 2025") and `daysToDeadline` (which uses the local `Date` object, not the ISO string) are used in the UI. This is a latent bug. It will only matter if `deadlineISO` is consumed by future code.

**Finding:** Functionally correct for all user-facing outputs. `deadlineISO` has a latent timezone bug — noted as Minor Note 1 below.

---

### 6. UI panels — PASS

All required panels are present and correctly rendered:

| Panel | HTML anchor | Rendered by | Verdict |
|---|---|---|---|
| Income inputs | `#india-income-fields` | `renderIndiaIncome()` | PASS |
| TDS inputs | `#india-tds-fields` | `renderIndiaTds()` | PASS |
| 80E panel | `#india-80e-panel` / `#india-80e-fields` | `renderIndia80E()` | PASS |
| DTAA panel | `#india-dtaa-fields` | `renderIndiaDtaa()` | PASS |
| ITR status | `#india-itr-fields` + `#india-itr-status` | `renderIndiaItr()` | PASS |
| Summary cards | `#india-summary-cards` | `renderIndiaSummaryCards()` | PASS |

**80E panel gating:** `panel-disabled` CSS class toggled on `#india-80e-panel`, plus inline warning banner — correctly implemented per spec.

**TDS validation:** Inline error messages rendered for TDS > corresponding income (via `validateTds()`). Correctly implemented.

**Form 67 late-filing warning:** `form67Late` flag correctly computed and a red danger banner displayed when `form67FilingDate > itr.filingDate`.

**ITR status badge:** States `filed` (green), `not_required` (grey), `overdue` (red), and catch-all `amber` for ok/warning correctly map to the spec's badge requirements. `aria-label` attribute present.

**Summary cards:** Implementation renders 5 cards (Gross Income, TDS, 80E, Net Tax Payable, ITR Deadline). Spec specified 4 cards in the grid table but the 5th (ITR Deadline) is a useful addition that does not conflict with the spec. Not a defect.

**Finding:** All specified panels, inputs, and conditional logic correctly implemented.

---

### 7. State key — PASS

- `fin_india_tax` is registered in `store.js` `KEYS` array (confirmed).
- `camelMap` maps `'india_tax'` → `'indiaTax'` (confirmed).
- `reverseMap` maps `'indiaTax'` → `'fin_india_tax'` (confirmed).
- `tax.js` accesses state as `st.indiaTax` (via `itState(st)`).
- All India field saves use `await saveSec('fin_india_tax', it)` (tax.js line 455).
- `defaults.js` contains `fin_india_tax` default object (confirmed at line 233).
- `saveSec` is correctly exported from `page-init.js` and wraps `save()` with re-highlighting.

**Finding:** State wiring is complete and correct.

---

### 8. Null guards — PASS

All fields are defensively accessed:

- `itState(st)` (tax.js lines 130–137): initialises `it.sec80E`, `it.itr`, `it.dtaa`, `it.crossBorder` with `|| {}` if missing.
- `calcNetIndiaTax`: `indiaTax = indiaTax || {}` at line 638 (calc.js) — extra null guard beyond spec.
- `calcITRDeadline`: `itr = itr || {}` at line 866 (calc.js) — extra null guard.
- All income and TDS field reads use `|| 0` pattern throughout.
- Optional chaining `?.` used consistently for nested paths (`indiaTax.dtaa?.dtaaReliefClaimed`, `it.itr?.filingDate`, etc.).

**Finding:** Null safety is thorough and exceeds the spec's requirements.

---

## Minor Notes

### Minor Note 1 — `deadlineISO` timezone bug (latent)
**File:** `src/projects/financial-dashboard/js/calc.js`, line 880
**Issue:** `deadline.toISOString().slice(0, 10)` returns the UTC date, which in BST (UTC+1) is one day earlier than the local deadline date. For AY 2025-26, `deadlineISO` returns `'2025-07-30'` instead of `'2025-07-31'`.
**Impact:** Currently zero — `deadlineISO` is not consumed by any rendering code in `tax.js`. Future consumers of this value could display or compare the wrong date.
**Correct implementation:**
```js
const deadlineISO = [
  deadline.getFullYear(),
  String(deadline.getMonth() + 1).padStart(2, '0'),
  String(deadline.getDate()).padStart(2, '0'),
].join('-');
```
This constructs the ISO string from local date components, not UTC, and is timezone-safe.

---

### Minor Note 2 — Hardcoded `|| 83` fallback in rendering layer
**File:** `src/projects/financial-dashboard/js/pages/tax.js`, line 281
**Issue:** `const rate = st.settings?.inrGbpRate || st.profile?.inrGbpRate || 83;`
The spec (Section 4.3) states: "must NOT hardcode 83 as a rate anywhere in the rendering logic." The fallback `|| 83` in the render function technically violates this constraint.
**Impact:** Low. The fallback is only reached if `fin_settings` has never been configured. The calc layer's `safeRate()` helper also uses 83 as an internal fallback; this note is specifically about the rendering layer.
**Recommended fix:** Remove the `|| 83` final fallback in the rendering layer, or replace it with a visible warning that the exchange rate has not been configured:
```js
const rate = st.settings?.inrGbpRate || st.profile?.inrGbpRate || 0;
// If rate is 0, calcCrossBorderPosition uses safeRate(0) = 83 internally — acceptable.
```
Alternatively, surface a "Set exchange rate in Settings" nudge when rate is absent.

---

## Spec Test Case Errors (for developer awareness — not code defects)

These are errors in the spec's own test case narrative. The implementation is correct; the spec prose is wrong.

**TC7** (spec Section 5, Phase 2 test cases):
- Scenario: NRO ₹4L + Rental ₹2L gross + Dividend ₹1L, old regime.
- Spec claims: `slabTax = (540000-250000)×5%+(40000×0%) = ₹14,500`
- **Correct calculation:** Slab income = 540,000. Tax = (500,000 - 250,000) × 5% + (540,000 - 500,000) × 20% = ₹12,500 + ₹8,000 = **₹20,500**. The spec formula omitted the 20% band on the top ₹40,000.
- **The implementation correctly produces ₹20,500.** The spec test case narrative is wrong.

**TC8** (spec Section 5, Phase 2 test cases):
- Scenario: AY 2026-27, non-audit, today = 2026-06-02.
- Spec claims: `daysToDeadline ≈ 59 → alertState = 'warning'`
- **Correct per spec's own definitions:** `warning` = 1–30 days. 59 days > 30 → `alertState = 'ok'`.
- **The implementation correctly returns `'ok'`.** The spec test case label is inconsistent with the spec's own alert state definitions.

---

## Summary

| Check | Result |
|---|---|
| Dividend bifurcation (s.115A) | PASS |
| Rental deduction u/s 24(a) | PASS |
| Old regime slabs AY 2025-26 | PASS |
| New regime slabs AY 2025-26 | PASS |
| Section 80E regime gate | PASS |
| Section 80E 8-year window | PASS |
| ITR deadline July/October | PASS |
| UI panels all present | PASS |
| State key wiring | PASS |
| Null guards | PASS |
| `deadlineISO` timezone (latent) | MINOR NOTE 1 |
| `|| 83` in render layer | MINOR NOTE 2 |

The two minor notes do not affect the correctness of any calculation or any value displayed to the user in the current implementation. They are pre-emptive hardening recommendations.

**This module is approved for production use.**

---

*CA Arjun Mehta, ICAI (Membership No. [redacted]), ICAEW*
*Dual-jurisdiction UK/India tax practice*
*2026-06-02*
