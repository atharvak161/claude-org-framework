# Mathematical Audit — Financial Dashboard Calculation Engine

**Auditor:** Dev Team Lead (Quantitative / CA review)
**Date:** 2026-06-01
**Scope:** `js/calc.js` and all page calculation call-sites (`dashboard`, `networth`, `income`, `debts`, `assets`, `tax`, `analytics`)
**Mode:** Audit only — no code changed. Fixes deferred to a separate pass.

---

## 0. Executive summary

| Severity | Count | Headline issues |
|----------|-------|-----------------|
| **Critical** | 7 | UK tax bands incomplete (no higher/additional rate, no PA taper); pension not salary-sacrificed before tax; ULIP/data key mismatch breaks net-worth chart; hardcoded ₹36L loan; `inrGbpRate=0` division; `taxTracker` vs `tax_tracker` key mismatch |
| **High** | 6 | NaN propagation from empty dates; missing imports (`ulipValueGBP`/`ulipPremiumGBP`) in networth.js crash the chart; rate fallback `125` vs `83` inconsistency; surplus double-count of pension |
| **Medium** | 8 | Negative-amortisation guard absent; `totalExpenses` assumes numeric; payoff-date month math; surplusTrajectory sign error; etc. |
| **Low** | 4 | Cosmetic / rounding-order, hardcoded magic numbers in fallbacks |

The single most damaging class of bug: **`calculateNetPay` is only correct for a basic-rate taxpayer with no taper.** Every salary scenario table on the income, networth and analytics pages (which test £55k, £65k, £80k) produces **materially wrong net pay** because higher-rate tax, additional-rate tax, the £100k personal-allowance taper, and the NI upper-earnings switch are all missing.

---

## A — Pure math correctness in `calc.js`

### A1. `calculateNetPay` — UK PAYE — **CRITICAL (multiple)**

```js
const incomeTax = Math.max(0, totalGross - taxFreeMonthly) * 0.20;
const niable    = Math.max(0, Math.min(totalGross, 4189) - 1048);
const ni        = niable * 0.08;
const pension   = baseMonthly * ((pensionEmployeeRate||0)/100);
```

**A1a — Only basic rate (20%) is ever applied. CRITICAL.**
There is no 40% higher-rate band and no 45% additional-rate band. Tax is computed as a flat 20% of everything above the monthly allowance. For any salary above £50,270 the result is **far too low**.

- Example: £80,000 salary. Correct annual income tax ≈ £19,432. This function returns ≈ (80,000 − 12,570) × 20% = **£13,486** — understated by ~£5,950/yr. The £80k scenario row in `analytics.js` is wrong.
- The salary scenario tables in `income.js`, `networth.js`, `analytics.js` all feed £55k/£65k/£80k into this function, so **every higher-salary projection is overstated on net pay and therefore on surplus, years-to-target, and the age-wealth trajectory.**

**Correct approach** — band-by-band on annualised income, then divide by 12:
```
PA = 12,570 (tapered: PA -= max(0, (adjustedNetIncome - 100,000)/2), floored at 0)
Basic:      20% on income between PA and 50,270
Higher:     40% on income between 50,271 and 125,140
Additional: 45% on income above 125,140
```

**A1b — Personal-allowance taper above £100k missing. CRITICAL.**
PA must reduce by £1 for every £2 over £100,000 adjusted net income (fully gone at £125,140). The £80k row is fine on PA but any future six-figure projection silently keeps the full £12,570 → understated tax. Compounds with A1a.

**A1c — Pension is NOT deducted before tax (salary sacrifice not modelled). CRITICAL.**
The brief specifies pension should be salary sacrifice (pre-tax). Here:
```
incomeTax = (totalGross - taxFreeMonthly) * 0.20   // pension NOT subtracted first
```
Pension is subtracted only at the very end from net (`netBase = baseMonthly - incomeTax - ni - pension - extraTax`). Under true salary sacrifice, pension reduces **taxable and NIable** pay, lowering both income tax and NI. As written, the employee overpays tax and NI in the model.
- At £28k, 5% pension = £1,400/yr sacrificed → tax saving £280, NI saving ~£112 not reflected.
- **Impact: net pay understated** for every salary that has a pension rate > 0.

**A1d — NI band is hardcoded monthly and uses only the 8% rate. HIGH.**
```
niable = Math.max(0, Math.min(totalGross, 4189) - 1048) * 0.08
```
- The 8% rate and the £1,048 primary threshold / £4,189 upper earnings limit are the **2024/25** figures. The brief quotes 12% / 2% (older). At minimum this should be a named, dated constant, not a magic number, and should be reconciled against the tax year the rest of the app targets (`taxCode: 1257L`, `startDate 2026-04-06`). **Inconsistent tax-year basis between NI (24/25) and the rest of the app (26/27).**
- The 2% above-UEL band **is** implicitly handled (earnings above £4,189 contribute nothing extra → effectively 0%, not 2%). So for high earners NI on the slice above the UEL is **0% instead of 2%** → NI understated for anyone over ~£50k/yr. CRITICAL-adjacent; rated HIGH because it only bites high earners.

**A1e — Tax computed on `totalGross` (base + OT) but allowance/bands are monthly slices. MEDIUM.**
Monthly-slice PAYE is an approximation of the annualised cumulative system. For a stable monthly salary it's acceptable, but OT that varies month to month will not reconcile to an annual return. Acceptable for a dashboard estimate; flag as a known approximation.

**A1f — `taxFreeAllowanceAnnual` is taken as an input but the tax-code string (`1257L`) is never parsed. MEDIUM.**
The brief asks whether the tax code is applied. It is **not**; the code relies on the separately-entered `taxFreeAllowanceAnnual` field. If a user changes `taxCode` to `1034L` (the underpayment code referenced in the UI) the allowance does not follow. The `1034L` label is even hardcoded in `income.js` line 46 and `calc.js` line 426 while the allowance stays 12,570. **Display says 1034L, math uses 1257L allowance → inconsistent.**

**A1g — `hourlyRate = baseSalaryGBP / 1950`. LOW.**
1950 = 37.5 h × 52 wk. Hardcoded; ignores the `hoursPerWeek` input that is collected on the same form. Should be `baseSalaryGBP / (hoursPerWeek * 52)`. Wrong if hoursPerWeek ≠ 37.5.

**Edge cases:**
- `salary = 0`: returns all zeros cleanly (Math.max guards hold). OK.
- OT pushing into higher band: **silently taxed at 20%** (see A1a) — wrong.

---

### A2. `generateAmortisation` — SBI loan (INR) — **MEDIUM / HIGH**

```js
const monthlyRate = ratePercent / 12 / 100;
while (balance > 0.01 && month < 600) {
  const interest  = Math.round(balance * monthlyRate);
  const principal = Math.min(Math.round(totalEMI - interest), Math.round(balance));
  balance         = Math.max(0, Math.round(balance - principal));
}
```

**A2a — EMI is taken as an input, never derived/validated. MEDIUM.**
The standard EMI formula `P·r(1+r)^n / ((1+r)^n − 1)` is **not** present. The function trusts the user-supplied `emiINR`. If the EMI is too low relative to rate, see A2b.

**A2b — Negative-amortisation / silent infinite-balance. HIGH.**
If `totalEMI < interest`, then `principal` is negative, `balance` **increases** each month, never crosses 0, and the loop runs the full 600 months producing a 600-row schedule with a growing balance. There is no explicit guard. It won't infinite-loop (the `month < 600` cap saves it) but it **silently produces a 50-year, ever-growing schedule** and a nonsense payoff date. The UI (`debts.js`) would render 600 rows. Should detect `EMI <= interest` and surface an error.

**A2c — Loop bound 600 is a real cap, not just safety. MEDIUM.**
A genuinely long loan (or A2b) is truncated at 600 months with `balance` still > 0. Downstream `amortPayoffDate` then reports a false payoff 600 months out. The truncation is silent.

**A2d — Rounding each month. LOW.**
`Math.round` on interest and principal every month accumulates small drift vs. a precise schedule. Acceptable for INR display (paise irrelevant) but means `totalInterest` is approximate.

**A2e — Overpayment correctly reduces principal.** `totalEMI = emi + extra`, extra flows straight into principal. **Correct.** Good.

---

### A3. `projectULIP` — **MEDIUM**

```js
const monthlyRate = ratePercent / 12 / 100;
for (let m = 1; m <= totalTermYears*12; m++) {
  if (date <= payEnd) value = (value + monthlyPremium) * (1 + monthlyRate);
  else                value = value * (1 + monthlyRate);
```

**A3a — Compound growth formula is correct** (premium added then grown; growth-only after pay term). Three scenarios are computed independently from the same `currentValue`. **Good.**

**A3b — `payTermEndDate` empty → `new Date('')` = Invalid Date. HIGH (NaN).**
With zeroed defaults `payTermEndDate: ''`. `date <= payEnd` becomes `date <= Invalid Date` which is **always false**, so premiums are **never added** — the projection silently models a paid-up policy from day 1. Premiums entered by the user are ignored until they also set a valid pay-term date. Needs a validity guard.

**A3c — Sum assured is never used in the projection. MEDIUM.**
`sumAssuredGBP` is displayed but plays no role in the value projection. For a ULIP the maturity value is `max(fund value, sum assured)` in many product structures (and death benefit = max(fund, SA)). The projection ignores the floor. For a pure savings illustration this may be acceptable, but it is mathematically incomplete vs. a real ULIP. Flag.

**A3d — Lock-in date not enforced. MEDIUM.**
`lockInDate` is displayed and converted to a year offset in `assets.js`, but the projection allows no withdrawal modelling, so lock-in has no effect on the maths. Currently cosmetic; note for correctness.

**A3e — `totalTermYears * 12` with `totalTermYears` possibly 0.** Defaults set it to 20, so OK, but if a user blanks it the loop body never runs and only the year-0 point exists — graceful, LOW.

---

### A4. `projectNetWorthTimeline` — **CRITICAL / HIGH**

```js
const totalAssetsStart = startNetWorth + debtOutstandingINR / inrGbpRate;
...
const debtGBP = round2(debtBalance / inrGbpRate);
```

**A4a — Division by `inrGbpRate` with no zero guard. CRITICAL.**
If `inrGbpRate = 0` (possible — it is a free-form numeric settings field), `debtOutstandingINR / 0 = Infinity`, poisoning `totalAssetsStart`, `cashSavings`, every `debtGBP`, and the whole chart → `Infinity`/`NaN` line. No guard anywhere. Same risk in `calculateNetWorth`, `ulipValueGBP`, `ulipPremiumGBP`, `loanPaidToDate` consumers, and every page that does `/ rate`.

**A4b — Cross-currency conversion is internally consistent here.** Both the opening `debtOutstandingINR / inrGbpRate` and per-month `debtBalance / inrGbpRate` use the same rate. **Good** (subject to A4a).

**A4c — Net-worth composition is correct after the documented v1 fix.** cash + pension + ulip − debt, no double-count. Pension and ULIP grown separately. **Good** — but see A4d.

**A4d — Surplus already nets ULIP premiums, then ULIP premiums are added back as asset growth — relies on an unstated invariant. HIGH (modelling).**
The comment claims ULIP premiums are in `monthlySaving` as expenses and added back on the asset side. That is only true if (i) the ULIP expense line items in `fin_expenses` exactly equal `ulipMonthlyPremGBP`, and (ii) currency conversion of those expense lines matches `ulipPremiumGBP`. The expense items (`sud`, `pnb`, `axis`) are entered in **GBP** in `fin_expenses`, while two of the ULIPs are **INR** premiums converted by rate. If the user's GBP expense figure ≠ converted INR premium, the add-back is **inconsistent** and net worth drifts. No reconciliation enforced. CRITICAL-adjacent; rated HIGH.

**A4e — Career-transition boost: `(newSalary − currentSalary)/12 * 0.4`. MEDIUM.**
The 0.4 "keep 40% of the gross raise as extra saving" factor is an arbitrary magic number with no tax basis. A gross raise does not convert to net surplus at a flat 40% across all bands. Approximation only — should ideally route the new salary through `calculateNetPay`. (Note `surplusTrajectoryEvents` *does* route through `calculateNetPay`, so the two surplus models **disagree** — see A11.)

**A4f — Age-to-year mapping** in this function is month-indexed (0..60), labelled by real calendar dates. Correct. The *age* mapping lives in `ageWealthTrajectory` — that is correct too (`currentAge + y`).

---

### A5. `wealthProgress` — **MEDIUM**

```js
if (netWorth < 0) { original = Math.max(totalDebt, |netWorth|); cleared = original - |netWorth|; pct = cleared/original ... }
else pct = min(100, netWorth/targetGBP * 100)
```

**A5a — Zero target not guarded in the wealth phase. HIGH (NaN).**
When `netWorth >= 0` and `targetGBP = 0` (the zeroed default `wealthTargetGBP: 0`), `netWorth/0 = Infinity`, `min(100, Infinity) = 100`. So it clamps to 100% — *not* NaN, but **misleading**: a £0 target shows 100% complete. Borderline; the debt phase *is* guarded (`original > 0 ? ... : 0`) but the wealth phase is not. Rated HIGH for the inconsistency.

**A5b — Debt-phase logic is reasonable** but `original = max(totalDebt, |netWorth|)` means if `totalDebtGBP` is passed as 0 but net worth is negative (e.g. negative cash), `original = |netWorth|`, `cleared = 0`, pct = 0. Edge but coherent. OK.

**Note:** `wealthProgress` is **defined but not called** by any page currently (dashboard computes its own `debtPct` inline). Dead-ish code, but the inline dashboard version has its own hardcode — see B/Hardcodes.

---

### A6. `loanPaidToDate` — **CRITICAL (hardcode)**

```js
const sanctioned = 3600000; // ₹36L original
const fullSched  = generateAmortisation(sanctioned, sbi.ratePercent || 9.9, sbi.emiINR || 34090, 0);
```

**A6a — Hardcoded ₹36,00,000 sanctioned amount. CRITICAL.**
Previously flagged and **still present.** `interestPaid`/`principalPaid` are computed against a fixed ₹36L original principal regardless of the user's actual loan. For any user whose loan ≠ ₹36L, the interest-paid and principal-paid figures on the debts page donut are **simply wrong**. With zeroed defaults (`outstandingINR: 0`) the guard `if (!sbi.outstandingINR) return zeros` masks it — but the moment a real outstanding balance is entered, the ₹36L assumption activates.

**A6b — Hardcoded EMI fallback ₹34,090 and rate 9.9%.** Same pattern, repeated across `debts.js` and `networth.js`. Magic numbers that should come from state.

**A6c — `remaining` returns `sbi.outstandingINR` (actual) while interest/principal use the synthetic ₹36L schedule.** Mixing the actual outstanding with a synthetic historical schedule means **interestPaid + principalPaid + remaining will not reconcile to ₹36L** unless the user's loan happens to be exactly ₹36L started exactly on schedule. Internally inconsistent.

**Fix direction:** derive sanctioned principal from state (store original loan amount), or compute paid-to-date by replaying from the actual start balance, not a constant.

---

### A7. `taxTrackerProgress` — **MEDIUM**

```js
collected = Math.min(total, monthsElapsed * monthly);
monthsElapsed = max(0, (today.y - start.y)*12 + (today.m - start.m));
```

**A7a — Monthly deduction × months elapsed is correct** and capped at `total`. Good.

**A7b — Tax-year-ended edge case partly handled.** After `endDate`, `daysLeft` and `monthsLeft` floor at 0, but `monthsElapsed` keeps growing past the end date — harmless because `collected` is capped at `total`. OK, but `monthsElapsed` shown in the UI (`tax.js`) will read e.g. "14 months" for a 12-month plan. MEDIUM cosmetic.

**A7c — `monthsElapsed` counts calendar-month boundaries, not whole elapsed months.** On 2026-06-01 vs start 2026-04-06, this yields 2 (Jun−Apr) even though only ~1.85 months elapsed and the April deduction may not have run yet depending on payroll date. Off-by-one risk in `collected`. MEDIUM.

**A7d — Division `collected/total` guarded** by the early-return when `!underpaymentTotal`. OK.

---

### A8. `applyScheduledChanges` — **OK / LOW**

```js
const items = expenses.items.map(item => ({...item}));   // shallow copy
if (change.changeDate <= today) items[idx].monthlyGBP = change.newMonthlyGBP;
```

**A8a — Returns a new array of shallow-cloned items; does NOT mutate state.** Correct and good.
**A8b — String date comparison `change.changeDate <= today`** works because both are ISO `YYYY-MM-DD` (lexicographic = chronological). Correct, **provided** `changeDate` is well-formed ISO. No validation. LOW.
**A8c —** If `expenses.items` is undefined the `.map` throws; call-sites pass a default `{items:[]}` so OK in practice.

---

### A9. `totalExpenses` — **LOW / MEDIUM**

```js
return round2(items.filter(i => i.active).reduce((s, i) => s + i.monthlyGBP, 0));
```

**A9a — Filters `active` correctly.** Good. All-zero expenses → 0. Good.
**A9b — No numeric coercion of `monthlyGBP`.** If any item's `monthlyGBP` is `undefined`/`null`/`''`, `s + undefined = NaN` and poisons the total → every surplus, savings rate, runway becomes NaN. The fields are bound via `parseFloat(...)||0` so saved data is numeric, but an item added without `monthlyGBP` would break it. MEDIUM (defensive).

---

## B — Cross-currency logic

**B1 — Fallback rate inconsistency: `|| 125` vs `|| 83`. HIGH.**
`defaults.js` and `page-init.js` use **83**. Every page (`dashboard`, `networth`, `debts`, `assets`, `analytics`, `export`) uses `st.settings?.inrGbpRate || 125`. Because `fin_settings.inrGbpRate` defaults to 83, the `|| 125` only fires if settings is missing/0 — but if it ever does fire, **debt GBP and ULIP GBP are converted at a different rate than the CSS `--inr-gbp-rate` variable and the documented default.** Two sources of truth (83 and 125) for the same constant. Should be one named constant.

**B2 — Conversion direction is consistent: INR ÷ rate = GBP** everywhere (`calculateNetWorth`, `ulipValueGBP/PremiumGBP`, `projectNetWorthTimeline`, `loanPaidToDate` consumers, `debts.js`, `analytics.js`). No place multiplies where it should divide. **Good.**

**B3 — `inrGbpRate = 0` → division by zero across all conversions. CRITICAL.** See A4a; it is a settings-editable field with no floor.

**B4 — ULIP premium currency mismatch vs expense line items. HIGH.** See A4d — the GBP expense lines for INR ULIPs are not reconciled to the converted INR premiums.

**B5 — `analytics.js` debt/income ratio** (line 34): `(dbt.sbi.emiINR||0)/rate / (pay.grossBase/12)`. EMI is monthly INR → GBP/month, divided by monthly gross GBP. Units are consistent. OK, though the nested ternary is convoluted and `pay.grossBase` is already monthly (so `/12` makes it *per-year-twelfth-of-a-month* — **wrong**: `pay.grossBase` is monthly gross, dividing by 12 again gives a tiny denominator → **debt/income ratio ~12× too high**). **MEDIUM/HIGH bug:** `pay.grossBase` is the monthly figure (`round2(baseMonthly)`), so `pay.grossBase/12` is wrong; should be just `pay.grossBase`.

---

## C — Division-by-zero / NaN inventory

Every division and its guard status (with zeroed defaults):

| Location | Expression | Guard? | Result when divisor 0 |
|----------|-----------|--------|-----------------------|
| `calculateNetPay` | `baseSalaryGBP/12`, `/1950` | constants | safe |
| `calculateNetWorth` | `outstandingINR / inrGbpRate` | **none** | Infinity if rate 0 — **CRITICAL** |
| `ulipValueGBP/PremiumGBP` | `currentValue / inrGbpRate` | **none** | Infinity if rate 0 |
| `generateAmortisation` | `ratePercent/12/100` | rate 0 → 0 interest, fine | safe (but EMI 0 → see A2b) |
| `projectULIP` | `ratePercent/12/100` | safe | safe |
| `projectNetWorthTimeline` | `debtOutstandingINR / inrGbpRate` (×2) | **none** | Infinity/NaN — **CRITICAL** |
| `indiaTripProgress` | `savedGBP / targetGBP` | `if (!trip.targetGBP) return…` | **guarded** |
| `emergencyFundProgress` | `savings / target` | `target` defaults to 3000 if falsy | guarded |
| `wealthProgress` (wealth phase) | `netWorth / targetGBP` | **none** | Infinity→clamped 100% — **HIGH** |
| `wealthProgress` (debt phase) | `cleared / original` | `original>0 ? : 0` | guarded |
| `taxTrackerProgress` | `collected / total` | early-return if !total | guarded |
| `emergencyRunwayMonths` | `cash / monthlyExpenses` | `if(!monthlyExpenses) return 0` | **guarded** |
| `loanPaidToDate` | (none direct) | n/a | n/a |
| `analytics.js` savingsRate | `surplus/netMonthly` | `netMonthly>0 ? : 0` | guarded |
| `analytics.js` housingRatio | `housingCost/netMonthly` | guarded | guarded |
| `analytics.js` debtIncome | `/(pay.grossBase/12)` | `grossBase/12>0 ? : 0` | guarded but **wrong units** (B5) |
| `networth.js` years-to-target | `(target-nw)/(s2*12)` | `s2>0 ? : '∞'` | guarded |
| `dashboard.js` debtPct | `(orig-total)/orig` | `originalDebt` from 3600000/rate | rate 0 → NaN; **and hardcoded ₹36L** |

**Net:** the three **unguarded** divisions by `inrGbpRate` (`calculateNetWorth`, `ulipValueGBP/PremiumGBP`, `projectNetWorthTimeline`) are the live NaN/Infinity risk. A single zero in the rate field corrupts net worth, the timeline chart, the analytics net-worth table, and the debts GBP figures simultaneously.

**Invalid-date NaN sources (separate from division):**
- `projectULIP` with empty `payTermEndDate` → premiums silently dropped (A3b).
- `assets.js` `lockInYr`/`payTermYr` = `(new Date('') - new Date())/...` = **NaN**, then `Math.ceil(NaN)=NaN`, used as a `.find(p=>p.year===NaN)` → always `null` → milestone rows show 0. HIGH cosmetic.
- `amortPayoffDate`/tax calendar use `new Date(start)` with fallbacks, mostly safe.

---

## D — Data-structure compatibility (store keys) — **CRITICAL**

`store.loadAll()` strips only the `fin_` prefix, **preserving the underscore**:

```
fin_monthly_log  → state.monthly_log
fin_tax_tracker  → state.tax_tracker
fin_india_log    → state.india_log
```

But the page code and `calc.js` read **camelCase**:

| File | Reads | Store actually provides | Result |
|------|-------|------------------------|--------|
| `dashboard.js:38` | `st.monthlyLog` | `st.monthly_log` | **undefined → `[]`** monthly bar chart never renders |
| `analytics.js:243` | `st.monthlyLog` | `st.monthly_log` | savings-rate trend always empty |
| `tax.js:15,62,84,87` | `st.taxTracker` | `st.tax_tracker` | **tax tracker reads/writes a phantom key** |
| `calc.js:397` (`surplusTrajectoryEvents`) | `state.taxTracker` | `state.tax_tracker` | tax-code-normalises event never fires |
| `goals.js:19,85,97` | `st.indiaLog` | `st.india_log` | India log always empty; writes go to `taxTracker`-style phantom |
| `export-page.js:75` | `st.monthlyLog` | `st.monthly_log` | export omits monthly log |
| `settings-page.js:192` | `state.taxTracker` | `state.tax_tracker` | settings tax fields edit a phantom object |

`page-init.js:17` correctly uses `state.tax_tracker` — proving the **store emits snake_case** and the page layer is the side that's wrong.

**Severity CRITICAL for `taxTracker`:** in `tax.js` the render reads `st.taxTracker || {}` (always `{}` → progress all zeros), and on edit `st.taxTracker[key] = …` **creates a brand-new `taxTracker` property** that is then saved to `fin_tax_tracker`. On reload, `loadAll` reads `fin_tax_tracker` back into `state.tax_tracker`, but the page reads `state.taxTracker` again → **the user's tax data appears to never persist.** Same vicious cycle for `indiaLog`/`monthlyLog`.

Keys that **are** correct (single-word, no underscore): `profile`, `income`, `expenses`, `debts`, `investments`, `goals`, `settings`. These match (`fin_income → income`). Only the three multi-word keys are broken.

**Fix direction (audit note, not applied):** either (a) have the store emit camelCase (`monthlyLog`/`taxTracker`/`indiaLog`), or (b) change all consumers to snake_case. Option (a) is fewer edits and matches the page layer's existing convention. Whichever is chosen must be applied to **store + page-init + every consumer** atomically.

---

## E — Additional findings outside the brief's enumerated functions

### E1. `networth.js` — missing imports → **HIGH (ReferenceError, chart crash)**
`renderNwChart` calls `ulipValueGBP(u, rate)` and `ulipPremiumGBP(u, rate)` (lines 212–213) but the import block (lines 3–7) imports neither. These are **not** in scope → `ReferenceError: ulipValueGBP is not defined` the moment the net-worth timeline chart renders with any ULIP present. The net-worth page's main chart is broken. (Contrast `assets.js`, which *does* import them.)

### E2. `surplusTrajectoryEvents` — surplus diff sign. MEDIUM.
```js
const diff = round2((item?.monthlyGBP||0) - c.newMonthlyGBP);   // old - new
running = round2(running + diff);
```
If an expense **falls** (new < old), `diff > 0`, surplus rises — correct. But the label hardcodes `+£${diff}` (line 418) which prints a negative as `+£-50`. And the tax bump (line 423) assumes the deduction *adds* to surplus when it clears (correct), but uses fallback `38` and label `1034L` — magic constants. Also reads `state.taxTracker` (broken key, E/D) so the tax event **never fires** in practice.

### E3. `dashboard.js` debt gauge — hardcoded ₹36L again. CRITICAL (consistency).
```js
const originalDebt = 3600000 / rate;   // sanctioned ₹36L
const debtPct = ((originalDebt - totalDebt)/originalDebt)*100;
```
Same hardcode as `loanPaidToDate` (A6). If the user's loan isn't ₹36L the debt-clearance gauge is wrong. `wealthProgress` exists to do this properly but is unused.

### E4. `dashboard.js` india gauge fallback target `3000`, networth target fallback `4760000`, ageTrajectory defaults (age 25/50, surplus 860). LOW. Personal magic numbers left in code as fallbacks despite zeroed defaults.

### E5. `assets.js` milestone-year lookup uses `Math.ceil(payTermYr)` to index `projectionAtYear`, but the projection only stores integer-year points; if the rounded year exceeds `totalTermYears` the lookup returns `null → 0`. With empty dates (NaN) → 0. MEDIUM cosmetic.

### E6. `analytics.js` line 101 has a stray `</div>` inside a `<td>` (`...</td></div></tr>`). Cosmetic HTML, LOW — not math, but will mis-nest the DOM.

---

## F — Severity-ordered fix queue (for the next pass)

**Critical (wrong money / broken persistence):**
1. `calculateNetPay`: implement full band tax (20/40/45), PA taper >£100k, salary-sacrifice pension (pre-tax/NI), and correct NI (2% above UEL). (A1a–d)
2. Data-key mismatch `taxTracker`/`monthlyLog`/`indiaLog` ↔ `tax_tracker`/`monthly_log`/`india_log` — fixes persistence. (D)
3. `loanPaidToDate` + `dashboard.js` + `networth.js` hardcoded ₹36L / ₹34,090 / 9.9% → derive from state. (A6, E3, A6b)
4. `inrGbpRate = 0` guards on all INR↔GBP divisions. (A4a, B3, C)

**High:**
5. `networth.js` missing `ulipValueGBP`/`ulipPremiumGBP` imports. (E1)
6. NI tax-year basis + 2%-above-UEL. (A1d)
7. `wealthProgress` zero-target guard. (A5a)
8. `projectULIP` invalid `payTermEndDate` guard (premiums silently dropped). (A3b)
9. Fallback-rate `125` vs `83` single-source-of-truth. (B1)
10. ULIP premium ↔ expense-line reconciliation in timeline. (A4d)
11. `analytics.js` debt/income `grossBase/12` unit error. (B5)

**Medium:** A2b/c negative-amortisation guard, A7b/c month-count, A4e career 0.4 factor, A9b numeric coercion, E2/E5 cosmetic-math, tax-code parsing (A1f), hourlyRate uses hoursPerWeek (A1g).

**Low:** rounding drift (A2d), magic-number fallbacks (E4), stray `</div>` (E6).

---

## G — What is correct (verified good)

- `applyScheduledChanges`: immutable, correct date comparison. (A8)
- `totalExpenses`/`expensesByCategory`: correct `active` filter. (A9, modulo coercion)
- `generateAmortisation`: overpayment → principal is correct; 600-month cap prevents infinite loop. (A2e)
- `projectULIP`: compound formula and three independent scenarios correct. (A3a)
- `projectNetWorthTimeline`: no pension/ULIP double-count after v1 fix; consistent rate use. (A4b/c)
- `taxTrackerProgress`: collected = months×monthly, capped. (A7a)
- Conversion direction (INR ÷ rate) consistent everywhere. (B2)
- `emergencyRunwayMonths`, `indiaTripProgress`, `emergencyFundProgress`: properly guarded against zero divisors. (C)

---

*End of audit. No source files modified.*
