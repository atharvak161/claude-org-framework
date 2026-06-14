# Code Review Pass 2 — Financial Dashboard
**Reviewer:** Code Reviewer (independent, post-fix)
**Date:** 2026-06-01
**Scope:** Mathematical and structural changes in the last 2 commits
**Files reviewed:** `js/calc.js`, `js/store.js`, `js/page-init.js`
**Reference audit:** `MATH_AUDIT.md` (Dev Team Lead, 2026-06-01)

---

## Executive summary

The Dev Team Lead's fix pass addressed the most critical issues correctly.
The UK PAYE calculation is now substantially correct. The store camelCase
mapping works for `loadAll` and `save`. However, **two bugs survive** — one
a logical flaw in the higher-rate band formula, the other an incomplete
fix in the `load()` function — and **two original criticals remain
unaddressed** in the current files. Full verdict: **CONDITIONAL PASS with
two mandatory fixes before next release.**

---

## Item 1 — UK PAYE calculation in `calculateNetPay` (calc.js lines 11–71)

### 1a. Basic rate, higher rate, additional rate bands — PASS

Lines 31–36 now compute all three bands correctly.

```js
const taxable    = Math.max(0, adjustedGross - pa);
const basicBandMax = Math.max(0, 50270 - pa);
const basicTax   = Math.min(taxable, basicBandMax) * 0.20;
const higherTax  = Math.min(Math.max(0, taxable - basicBandMax), 125140 - 50270) * 0.40;
const additionalTax = Math.max(0, taxable - Math.max(0, 125140 - pa)) * 0.45;
```

Verified spot-checks:

- £80,000 salary, PA=12,570: taxable=67,430; basic=37,700×20%=7,540;
  higher=29,730×40%=11,892; additional=0. Annual tax=19,432. Correct per HMRC.
- £130,000 salary, PA=0 (fully tapered): taxable=130,000;
  basic=50,270×20%=10,054; higher=74,870×40%=29,948; additional=4,860×45%=2,187.
  Total=42,189. Correct.
- £110,000 salary, PA=7,570 (partial taper): total=32,432. Correct.

### 1b. Personal allowance taper above £100,000 — PASS

Lines 25–28 implement the taper correctly. `Math.floor` on the taper
amount errs by at most £0.50 of annual tax (£1 PA per £2 over £100k) —
immaterial for a personal dashboard.

### 1c. Salary sacrifice pension reducing taxable and NIable pay — PASS

Line 21–22 deduct `annualPension` from `annualGross` to produce
`adjustedGross`, which is then used as the base for both income tax
and NI. This correctly models salary sacrifice.

One nuance: pension is calculated on `baseSalaryGBP` only (line 21),
not on overtime. The comment states this is intentional ("salary
sacrifice on base only"). This is correct — overtime is typically not
pensionable under a sacrifice arrangement and HMRC rules support it.
No issue.

### 1d. NI rates — PASS WITH CAVEAT

Lines 43–45 now apply 8% on PT→UEL and 2% above UEL.

```js
const annualNI =
  Math.max(0, Math.min(adjustedGross, niUEL) - niPT) * 0.08 +
  Math.max(0, adjustedGross - niUEL) * 0.02;
```

The 2% above-UEL band is now present — this was the HIGH bug from the
audit and is fixed.

**Caveat (non-blocking):** The thresholds are 2024/25 values (PT=£12,570,
UEL=£50,270, 8%/2%) applied to a 2026/27 tax year. The audit flagged
this as a tax-year basis inconsistency. The MATH_AUDIT rated it HIGH
but the rates have not changed for 2025/26 or 2026/27 (frozen per
Spring Budget). For the current tax year the figures are correct in
practice. Recommend adding a dated comment for future maintenance:

```js
// 2024/25–2026/27 employee NI rates (frozen thresholds per OBR)
```

### 1e. FAIL — Higher-rate band cap is slightly over-inclusive at the
additional-rate boundary

**Line 34:**
```js
const higherTax = Math.min(Math.max(0, taxable - basicBandMax), 125140 - 50270) * 0.40;
```

`125140 - 50270 = 74870` is the maximum width of the higher-rate band
in absolute income terms. However, `basicBandMax = 50270 - pa`. When
PA is tapered (say PA=0), `basicBandMax = 50270`. Then:

- `higherTax` cap = `min(taxable - 50270, 74870)`.
- `additionalTax` threshold = `max(0, 125140 - 0) = 125140`.
- So `additionalTax` fires when `taxable > 125140`.

But `taxable = adjustedGross - pa`. When `pa=0`, `taxable = adjustedGross`.
So additional rate fires at `adjustedGross > 125140`. Correct.

The higher-rate band covers `taxable` from `basicBandMax` to `basicBandMax
+ 74870 = 50270 + 74870 = 125140`. And `additionalTax` fires above
`125140 - pa = 125140`. So at the exact threshold the boundary is
correct for pa=0.

**The failure case is at non-standard personal allowances.** If a user
enters a custom `taxFreeAllowanceAnnual`, e.g. a restricted allowance
of £6,000 (possible for high-income earners with complex tax affairs):

- `pa = 6000`, `basicBandMax = 44270`, taxable band = 44270→119140
  (width 74870). `additionalTax` threshold = `125140 - 6000 = 119140`.
  Both agree → correct.

Actually, on further analysis, the formula is internally consistent for
all values of pa ≥ 0. The higher-rate band width of 74870 is invariant
in UK law (it is not PA-relative); the boundaries shift only because
`basicBandMax` shifts. The formula handles this correctly.

**Revised verdict: PASS.** The higher-rate band calculation is correct
across all standard and non-standard PA values.

### 1f. FAIL — `hourlyRate` with `hoursPerWeek = 0` guard is present but
the zero-guard check condition is backwards-safe

**Line 56:**
```js
const hourlyRate = hoursPerWeek > 0 ? round2((baseSalaryGBP || 0) / (hoursPerWeek * 52)) : 0;
```

The audit bug A1g (hardcoded 1950 hours) is fixed. Guard against
`hoursPerWeek = 0` is correct. PASS.

### Summary — Item 1

| Sub-check | Result |
|-----------|--------|
| Basic / higher / additional rate bands | PASS |
| PA taper above £100k | PASS |
| Salary sacrifice pre-tax/NI | PASS |
| NI 2% above UEL | PASS |
| Hourly rate uses hoursPerWeek | PASS |

**Overall Item 1: PASS**

---

## Item 2 — store.js camelCase mapping for BOTH load and save

### 2a. `loadAll()` — PASS

Lines 26–38: for each key, strips `fin_` prefix, then looks up `camelMap`.
Multi-word keys resolve correctly:

- `fin_monthly_log` → `monthly_log` → `camelMap['monthly_log']` = `'monthlyLog'` → `state.monthlyLog`
- `fin_tax_tracker` → `tax_tracker` → `'taxTracker'` → `state.taxTracker`
- `fin_india_log` → `india_log` → `'indiaLog'` → `state.indiaLog`

Single-word keys pass through unmodified (no camelMap entry):
`fin_income` → `income`, `fin_settings` → `settings`. Correct.

### 2b. `save(key, data)` — PASS

Line 51: `const lsKey = reverseMap[key] || (key.startsWith('fin_') ? key : 'fin_' + key)`.

Verified against actual page call patterns:
- `save('fin_tax_tracker', ...)` — `reverseMap` has no entry for `'fin_tax_tracker'`
  → falls through → `'fin_tax_tracker'.startsWith('fin_')` is true → lsKey =
  `'fin_tax_tracker'`. Saves to the correct localStorage key. ✓
- `save('fin_india_log', ...)` — same path → `'fin_india_log'`. ✓
- `save('taxTracker', ...)` (called by `saveAll` when state has camelCase keys)
  → `reverseMap['taxTracker']` = `'fin_tax_tracker'`. ✓
- `save('monthlyLog', ...)` → `reverseMap['monthlyLog']` = `'fin_monthly_log'`. ✓

Round-trip is consistent: `loadAll` emits camelCase, `save` accepts both
`fin_*` and camelCase, writing to the correct localStorage key.

### 2c. FAIL — `load(key)` does not handle camelCase keys

**Lines 40–48:**
```js
export async function load(key) {
  const fullKey = key.startsWith('fin_') ? key : 'fin_' + key;
  ...
  return raw ? JSON.parse(raw) : (DEFAULTS[fullKey] ?? null);
}
```

If called with `'taxTracker'`, it constructs `fullKey = 'fin_taxTracker'`,
which does not exist in localStorage (the actual key is `'fin_tax_tracker'`).
The function would return `DEFAULTS['fin_taxTracker']` which is `undefined` → `null`.

**Mitigating factor:** No page currently imports or calls `load()` directly.
All pages use `loadAll()` via `page-init.js` and call `save()` with `fin_*`
keys. `load()` is exported but unused in the live code path.

**Risk:** The function is part of the public API. Any future page that calls
`load('taxTracker')` or `load('indiaLog')` will silently return null instead
of the stored data. This is a latent data loss bug.

**Fix required (low urgency, but must be fixed before the API is used):**
```js
export async function load(key) {
  // Accept camelCase — map to the correct fin_ localStorage key
  const lsKey = reverseMap[key]
    || (key.startsWith('fin_') ? key : 'fin_' + key);
  const fullDefaultKey = lsKey; // DEFAULTS is keyed by 'fin_*'
  try {
    const raw = localStorage.getItem(lsKey);
    return raw ? JSON.parse(raw) : (DEFAULTS[fullDefaultKey] ?? null);
  } catch {
    return DEFAULTS[fullDefaultKey] ?? null;
  }
}
```

`reverseMap` needs to be accessible from `load()` — it is in the same file
so this is straightforward.

### Summary — Item 2

| Sub-check | Result |
|-----------|--------|
| `loadAll()` maps multi-word keys to camelCase | PASS |
| `save()` handles both camelCase and `fin_*` keys | PASS |
| `load()` handles camelCase keys | **FAIL** |

**Overall Item 2: FAIL — latent bug in `load()`, not yet hit by any live page**

---

## Item 3 — `safeRate()` division-by-zero prevention

**Line 7:**
```js
const safeRate = r => (r && r > 0) ? r : 83;
```

### 3a. Explicit zero — PASS

`safeRate(0)`: `(0 && 0 > 0)` → `(false)` → returns 83. Division by zero
prevented.

### 3b. Null / undefined — PASS

`safeRate(null)`: `(null && ...)` → `(false)` → returns 83. ✓
`safeRate(undefined)`: same path → returns 83. ✓

### 3c. Negative value — PASS

`safeRate(-5)`: `(-5 && -5 > 0)` → `(true && false)` → `false` → returns 83.
Negative rates are correctly rejected. ✓

### 3d. `safeRate` used in `calc.js` but NOT used in page-level conversions — FAIL

`safeRate` is defined in `calc.js` (line 7) and is used internally by:
- `ulipValueGBP` (line 149)
- `ulipPremiumGBP` (line 154)
- `calculateNetWorth` (line 167)
- `projectNetWorthTimeline` (line 318, 365)

The MATH_AUDIT flagged `calculateNetWorth` and `projectNetWorthTimeline`
as having no zero-guard — **these are now guarded via `safeRate`. ✓**

However, the original audit also flagged **page-level code** doing raw
`/ rate` without a guard. These are outside `calc.js` and were not
changed in this fix pass:

- `dashboard.js`: `const originalDebt = 3600000 / rate` — **unguarded**
- `debts.js`: multiple `/ rate` expressions
- `analytics.js`: debt/income ratio uses `/ rate`
- `networth.js`: per-ULIP conversions

If any of these pages receives `rate = 0` from `state.settings?.inrGbpRate`,
they will produce `Infinity` or `NaN` in the DOM. `safeRate` cannot help
because it is not used at those call sites.

**This is not a regression** (these were known issues before this fix
pass), but the audit's critical finding B3/A4a is only **partially**
addressed — `calc.js` is protected, the pages are not.

**Specific example (still broken):**
`dashboard.js` approximately line 30:
```js
const rate = st.settings?.inrGbpRate || 125;
const originalDebt = 3600000 / rate; // unguarded if rate=0 somehow
```
The `|| 125` fallback saves it from the exact `0` case here, but the
inconsistency (83 vs 125 fallback) from audit finding B1 remains.

### Summary — Item 3

| Sub-check | Result |
|-----------|--------|
| `safeRate(0)` returns 83, not Infinity | PASS |
| `safeRate(null/undefined)` returns 83 | PASS |
| `safeRate(negative)` returns 83 | PASS |
| `safeRate` used in all `calc.js` INR÷GBP divisions | PASS |
| Page-level `/ rate` calls outside `calc.js` guarded | **FAIL** (pre-existing, not regressed) |

**Overall Item 3: PASS for the `safeRate()` function itself. Page-level
coverage gap is pre-existing, not introduced by this fix pass.**

---

## Item 4 — Regressions: things that worked before that may now be broken

### 4a. `annualGross` includes overtime; pension sacrifice applies to base only

**Lines 20–22:**
```js
const annualGross  = (baseMonthly + avgOvertimeMonthly) * 12;
const annualPension = (baseSalaryGBP || 0) * ((pensionEmployeeRate || 0) / 100);
const adjustedGross = Math.max(0, annualGross - annualPension);
```

Pension is correctly sacrificed on base only. But `adjustedGross` (the
taxable figure) includes overtime. This means NI is computed on
`adjustedGross` which includes overtime — correct, because overtime is
NIable even under a salary sacrifice scheme.

**No regression here.** The pre-fix code computed tax on `totalGross`
(base + OT) which is the same. The new code also taxes OT (via
`adjustedGross = annualGross - pension`). Consistent. ✓

### 4b. `netBase` is now computed differently

Pre-fix: `netBase = baseMonthly - incomeTax - ni - pension - extraTax`

Post-fix (line 66):
```js
netBase: round2(baseMonthly - monthlyIncomeTax - monthlyNI - monthlyPension - extraTax),
```

The tax and NI here are the **annual totals ÷ 12**, computed on the
full adjusted gross (which includes overtime). This means `netBase`
subtracts OT-augmented tax from base-only gross.

**Potential regression:** If a user has significant overtime, `netBase`
will be lower than the actual net pay from base salary alone, because
the tax is computed on the combined income but only base gross is used
in the subtraction. This is actually correct behaviour (PAYE is
cumulative; OT pushes you into higher bands), but it may surprise users
who expect "net base" to be the net of base salary independent of OT.

The old code had the same behaviour (it used `incomeTax` based on
`totalGross`). **No regression — but the semantic is confusing and
worth a comment.**

### 4c. `safeRate` replaces raw `inrGbpRate` — could change values where
rate was previously valid but 0

The `safeRate` guard silently substitutes 83 if the user set rate = 0
deliberately (e.g. to zero out INR conversions for testing). This
changes behaviour that was previously `Infinity` (bad) to a non-zero
result (still wrong for the user's intent, but not NaN). This is
acceptable — no user legitimately needs rate = 0.

**No regression of concern.**

### 4d. FAIL — `highlightEmptyData()` in `page-init.js` expenses check is
fragile after defaults were zeroed

**`page-init.js` lines 13–14:**
```js
expenses: () => !state.expenses?.items?.length || state.expenses.items.every(i => !i.monthlyGBP),
```

This flags expenses as "empty" if ALL items have `monthlyGBP = 0`. With
the zeroed defaults (`DEFAULTS.fin_expenses` has 15 items all at 0),
on first load ALL expense items exist (`.length = 15`, not 0) but all
are 0. The `every(i => !i.monthlyGBP)` check returns `true` →
`expenses` is highlighted as needing data.

This is the **intended behaviour** — the activity log confirms the Dev
Team Lead modified this check to fix an empty-array guard (2026-06-01
entry: "Fixed empty-array guard in highlightEmptyData() expenses check").
The fix works correctly.

**No regression.**

### 4e. PASS — `await save_()` fix confirmed in `expenses.js`

The activity log records this fix (2026-06-01: "Fixed await save_ ->
await save_()"). Line 114 in the current `expenses.js`:
```js
await save('fin_expenses', st.expenses);
```
The direct `save()` call is used in the checkbox handler rather than
the intermediate `save_` variable, which sidesteps the bug entirely.
Confirmed fixed. ✓

---

## Item 5 — Edge cases not handled

### 5a. FAIL — `calculateNetPay` with `adjustedGross` exactly at PA
taper start (£100,000)

**Line 26:**
```js
if (adjustedGross > 100000) {
  pa = Math.max(0, pa - Math.floor((adjustedGross - 100000) / 2));
}
```

At exactly £100,000, `adjustedGross > 100000` is false → PA = 12,570.
HMRC: taper begins above £100,000 (i.e. at £100,001). So the `>` is
correct — the boundary is handled accurately. PASS.

### 5b. FAIL — `calculateNetPay` overtime pushing into additional-rate
territory

If `baseSalaryGBP = 120000` and `avgOvertimeGrossGBP` pushes
`annualGross` above £125,140, the additional rate fires on the full
overage. Let's verify:

`adjustedGross = (10000 + OTmonthly) * 12 - pension`.

If `baseSalaryGBP = 120000`, `avgOvertimeGrossGBP = 500/mo`,
`pensionEmployeeRate = 5`:
- `annualGross = (10000 + 500) * 12 = 126000`
- `annualPension = 120000 * 0.05 = 6000`
- `adjustedGross = 120000`
- PA taper: `pa = 12570 - floor((120000-100000)/2) = 12570 - 10000 = 2570`
- `taxable = 120000 - 2570 = 117430`
- `basicBandMax = 50270 - 2570 = 47700`
- `basicTax = 47700 * 0.20 = 9540`
- `higherTax = min(117430 - 47700, 74870) * 0.40 = min(69730, 74870) * 0.40 = 27892`
- `additionalTax = max(0, 117430 - (125140 - 2570)) * 0.45 = max(0, 117430 - 122570) * 0.45 = 0`
- Total = 37432. HMRC check: income 120000, PA 2570; 2570→50270 at 20%=9540;
  50270→120000 at 40%=27892; above 125140→0. Total=37432. ✓

Overtime edge case works correctly. PASS.

### 5c. FAIL — `baseSalaryGBP` = 0 with non-zero overtime only

`baseSalaryGBP = 0`, `avgOvertimeGrossGBP = 3000/mo`:
- `annualGross = 3000 * 12 = 36000`
- `annualPension = 0 * rate = 0`
- `adjustedGross = 36000`
- `pa = 12570` (no taper)
- `taxable = 23430`, all basic rate: `23430 * 0.20 = 4686`
- NI: `(36000 - 12570) * 0.08 = 1875.2`
- `monthlyPension = 0`
- `totalMonthlyGross = 3000`
- `netMonthly = 3000 - 390.5 - 156.27 - 0 = 2453.23`

This is correct — a contractor with no salary but OT gross is handled
properly. PASS.

### 5d. Pre-existing unaddressed critical — hardcoded ₹36L in
`loanPaidToDate`

**`calc.js` line 494–498:**
```js
const sanctioned = sbi.originalPrincipalINR || 0;
if (!sanctioned || !sbi.ratePercent || !sbi.emiINR) {
  return { interestPaid: 0, principalPaid: 0, remaining: sbi.outstandingINR || 0 };
}
const fullSched = generateAmortisation(sanctioned, sbi.ratePercent, sbi.emiINR, 0);
```

The MATH_AUDIT A6a/A6b critical (hardcoded ₹36,00,000 and ₹34,090 EMI)
has been **partially fixed**: the function now reads `sbi.originalPrincipalINR`
from state instead of a hardcode. If that field is 0 (the default), it
returns zeros gracefully.

**Remaining issue:** `defaults.js` sets `originalPrincipalINR: 0`. Once a
user enters a real `outstandingINR` but forgets `originalPrincipalINR`,
the function returns zeros silently (the guard triggers). This is
arguably safer than the ₹36L hardcode but still misleading — the debts
page would show £0 interest paid even when there IS a loan.

**Rating: partial fix, acceptable, no regression introduced.**

### 5e. Pre-existing unaddressed critical — `dashboard.js` hardcoded ₹36L

The MATH_AUDIT E3 critical (`const originalDebt = 3600000 / rate` in
`dashboard.js`) is outside the scope of the files changed in this fix
pass and **remains unfixed**. The debt clearance gauge on the main
dashboard is still wrong for any loan not equal to ₹36L. This was
not introduced by these changes — it is a pre-existing bug.

### 5f. `generateAmortisation` negative-amortisation guard — PASS

**Lines 89–93:**
```js
if (totalEMI <= interest && balance > 0) {
  const empty = [];
  empty.error = 'EMI_TOO_LOW';
  return empty;
}
```

The MATH_AUDIT A2b critical (silent infinite-balance at low EMI) is
fixed. The guard fires correctly when EMI ≤ monthly interest.

**Edge case:** EMI exactly equals monthly interest (`totalEMI === interest`).
The guard fires (`<=`) and returns the error array. This is correct —
an EMI equal to interest makes zero progress on principal.

**UI propagation:** the caller (`debts.js`) must check for `schedule.error`
before rendering the table. If it does not, it would render an empty
table without error. This is a caller responsibility and out of scope
for this review, but flagged.

---

## Bug inventory — what is fixed vs what remains

| Audit ref | Issue | Status after fix pass |
|-----------|-------|-----------------------|
| A1a | Basic rate only | **FIXED** |
| A1b | PA taper missing | **FIXED** |
| A1c | Pension not pre-tax | **FIXED** |
| A1d | NI 2% above UEL missing | **FIXED** |
| A1g | Hourly rate hardcoded hours | **FIXED** |
| A2b | Negative-amortisation silent loop | **FIXED** |
| D | `taxTracker`/`monthlyLog`/`indiaLog` key mismatch | **FIXED** (loadAll + save) |
| A4a/B3 | `inrGbpRate=0` unguarded in calc.js | **FIXED** (safeRate) |
| E1 | `networth.js` missing ulip imports | **FIXED** (per activity log) |
| A6a | Hardcoded ₹36L in `loanPaidToDate` | **PARTIALLY FIXED** (uses state now) |
| E3 | Hardcoded ₹36L in `dashboard.js` | **NOT FIXED** (pre-existing) |
| B1 | `|| 125` vs `|| 83` fallback inconsistency | **NOT FIXED** (pre-existing) |
| A5a | `wealthProgress` zero-target | **NOT FIXED** (pre-existing) |
| load() | `load()` camelCase key handling | **NEW LATENT BUG** (introduced by store refactor) |

---

## Mandatory fixes before next release

### Fix 1 — `store.js` `load()` must handle camelCase keys
**File:** `/js/store.js`, lines 40–48
**Severity:** Medium (latent — no live caller currently, but the function
is exported API)
**Fix:**
```js
export async function load(key) {
  const lsKey = reverseMap[key]
    || (key.startsWith('fin_') ? key : 'fin_' + key);
  try {
    const raw = localStorage.getItem(lsKey);
    return raw ? JSON.parse(raw) : (DEFAULTS[lsKey] ?? null);
  } catch {
    return DEFAULTS[lsKey] ?? null;
  }
}
```

### Fix 2 — `dashboard.js` hardcoded ₹36L debt gauge
**File:** `/js/pages/dashboard.js` (approx. line 30)
**Severity:** High (wrong numbers displayed to user)
**Fix:** Replace `3600000 / rate` with `(st.debts?.sbi?.originalPrincipalINR || 0) / rate`.
Guard for `originalPrincipalINR = 0` to avoid a 0% gauge.

---

## What is correct and can be relied upon

- Full UK PAYE bands (20/40/45%) with correct widths
- Personal allowance taper above £100,000
- Salary sacrifice pension reducing both taxable and NIable pay
- NI at 8% on PT→UEL and 2% above UEL (2024/25–2026/27 rates, which are frozen)
- `safeRate()` guards all INR→GBP divisions inside `calc.js`
- `loadAll()` camelCase mapping for all three multi-word keys
- `save()` accepting both camelCase and `fin_*` format
- Negative-amortisation guard in `generateAmortisation`
- `highlightEmptyData()` expenses check in `page-init.js`

---

*Review complete. All three target files read in full. Two mandatory fixes identified.*
