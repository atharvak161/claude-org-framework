# QA and Performance Review — Financial Dashboard
**Reviewer:** Full Stack Tester / Performance Tester
**Date:** 2026-05-31
**Project location:** `/Users/atharva/Downloads/organisation/src/projects/financial-dashboard/`

---

## 1. Is there any existing testing whatsoever?

**No. Zero tests exist anywhere in this codebase.**

A recursive search for `*.test.*`, `*.spec.*`, and `__tests__` directories returns nothing. There is no `package.json`, no test runner configuration (Jest, Vitest, Mocha), no test directory, no test files, no CI pipeline, and no browser automation scripts. The only quality gate that exists is manual inspection and runtime observation.

This is a complete testing blind spot across a codebase that:
- Performs real financial calculations used to make monetary decisions
- Manages encrypted personal financial data in localStorage
- Runs a custom PBKDF2 authentication flow in-browser
- Projects net worth, debt payoff dates, ULIP growth, and tax collection across 5–20 year horizons

There is not a single assertion anywhere in the code outside of UI conditionals.

---

## 2. Highest-risk areas with zero test coverage

Ranked by financial consequence of a silent failure:

### Risk 1 — `calculateNetPay` in `js/calc.js` (CRITICAL)
This function is called on every single page render and is the foundation for every downstream calculation: surplus, net worth projection, scenario tables, Sankey chart, and analytics KPIs. It uses a flat 20% income tax rate above the personal allowance with no higher-rate threshold, and a flat 8% NI rate capped at an upper earnings limit of £4,189/month. These are hardcoded constants. There is no test to verify the band logic, no test to verify the NI ceiling, and no test to verify the behaviour when `taxFreeAllowanceAnnual` is zero, negative, or larger than the gross.

**Failure mode:** A wrong value in `baseSalaryGBP` or `taxFreeAllowanceAnnual` propagates silently through every metric on every page without any validation error.

### Risk 2 — `generateAmortisation` in `js/calc.js` (CRITICAL)
The amortisation loop uses `Math.round()` on intermediate interest and principal values at every step, which causes floating-point drift over a 100+ month schedule. More critically, the loop has a hard cap at 600 months (50 years) but no assertion that the schedule actually converged before that cap. If `totalEMI <= interest` (i.e. the EMI is insufficient to cover monthly interest), the principal computed is zero or negative and the loop runs all 600 iterations producing a 50-year garbage schedule with no error.

**Failure mode:** If a user sets an EMI lower than the monthly interest, `generateAmortisation` returns 600 rows silently. `amortPayoffDate` will then report a payoff date 50 years in the future with no warning.

### Risk 3 — `store.js` encryption/decryption pipeline (CRITICAL)
`save()` calls `swEncrypt()` via the Service Worker, and `load()` calls `swDecrypt()`. If the SW has been terminated (browser background tab, device sleep), `_send()` throws "No active service worker". The `load()` function catches this and falls back to `DEFAULTS[key]`, which means **user data is silently replaced with demo defaults on decrypt failure**. `page-init.js` attempts SW key recovery from `sessionStorage`, but this only works if the key was stored there — the login flow stores the key in the SW but there is no test verifying that the `sessionStorage._ek` key is written after login, meaning the recovery path may silently fail.

**Failure mode:** After a browser suspends the SW, the user sees correct-looking default values instead of their actual data, makes decisions based on them, and the next save overwrites real data with defaults.

### Risk 4 — `projectNetWorthTimeline` in `js/calc.js` (HIGH)
This function produces the 5-year net worth forecast. It calculates `totalAssetsStart = startNetWorth + debtOutstandingINR / inrGbpRate`, then splits assets into `cashSavings`, `pensionVal`, and `ulipVal`. If `inrGbpRate` is 0 or undefined, this produces a division by zero resulting in `Infinity` or `NaN` propagating through all 61 monthly data points and rendering as a broken chart. There is no guard against `inrGbpRate <= 0`.

**Failure mode:** Setting INR/GBP rate to 0 in settings causes the entire net worth timeline to display `Infinity` or `NaN` values silently.

### Risk 5 — Auth lockout state in `js/auth.js` (HIGH)
`checkLockout()` reads `localStorage.auth_lockout_until` and compares it to `Date.now()`. The lockout duration escalates exponentially: `30_000 * Math.pow(2, count - 1)`. At count=20 this is 30 seconds × 2^19 = ~18 days of lockout from a corrupted `auth_lockout_count` value. There is no maximum cap on lockout duration and no test for the lockout escalation logic. A corrupted or manually-set `auth_lockout_count` in localStorage could permanently lock out the user.

**Failure mode:** A corrupt or attacker-set `auth_lockout_count` with a large integer causes a lockout duration measured in years with no recovery path except manually clearing localStorage.

### Risk 6 — `applyScheduledChanges` in `js/calc.js` (MEDIUM)
This function applies expense changes using string comparison (`change.changeDate <= today`). ISO 8601 date strings compare correctly as strings, but there is no validation that `changeDate` is a valid date string. An invalid date like `"not-a-date"` will compare falsely and be silently ignored. There is also no test for the edge case where multiple scheduled changes target the same expense — only the last match in `items.findIndex` order would apply since array mutation is used directly.

### Risk 7 — `loanPaidToDate` in `js/calc.js` (MEDIUM)
This function hardcodes the original sanctioned amount as `3600000` (₹36L). If the loan's actual original amount differs from this hardcoded figure, the "interest paid to date" and "principal paid to date" values shown on the Debts page will be wrong. There is no test and no configuration for this constant.

---

## 3. Specific unit tests that must be written immediately for `js/calc.js`

These are the test cases I would file as P0 bugs if this were in production:

### 3a — `calculateNetPay` boundary conditions
- Zero base salary: should return all zeros without throwing
- Tax-free allowance equal to gross: income tax should be zero
- Tax-free allowance greater than gross: income tax must clamp to zero, not go negative
- NI upper earnings limit: monthly gross of £5,000 should cap NI at `(4189 - 1048) * 0.08`, not compute on full £5,000
- Pension rate of 0: pension deduction should be exactly zero
- Overtime of 0: `netBase` and `netWithOT` should be equal
- Hourly rate: `baseSalaryGBP / 1950` — verify the 1950 divisor represents 37.5h/wk × 52wk

### 3b — `generateAmortisation` correctness and edge cases
- Standard case: ₹27,52,000 @ 9.9% with EMI ₹34,090 — schedule must not exceed 600 months and final closing balance must be 0 or very close to 0
- EMI equals interest: principal is 0 every month — loop must hit 600 and not crash
- EMI less than interest: same as above
- Zero outstanding: schedule must be empty array (length 0)
- `extraINR` larger than outstanding: must terminate in month 1
- Rounding drift: sum of all principals in schedule must equal original outstanding within ₹100 (acceptable rounding)

### 3c — `taxTrackerProgress` date arithmetic
- Start = end: edge case where the tax period is zero months
- Today before start: `monthsElapsed` must be 0, collected must be 0
- Today after end: `monthsElapsed` must not exceed the total period, collected must equal `underpaymentTotal`
- Monthly deduction × months > underpaymentTotal: collected must clamp to total (the `Math.min` guard)
- Missing fields: all returns must default to 0, never throw

### 3d — `wealthProgress` phase logic
- netWorth exactly 0: should be in 'wealth' phase at 0%, not 'debt' phase
- netWorth just below 0: should be in 'debt' phase
- totalDebtGBP of 0 with negative netWorth: division by zero guard needed in debt phase
- netWorth at exact target: pct must be 100

### 3e — `indiaTripProgress` edge cases
- Past deadline: `daysLeft` must be 0, not negative
- savedGBP > targetGBP: pct must clamp to 100
- targetGBP = 0: must not divide by zero

---

## 4. Integration tests needed for the auth flow

The auth flow spans four independent modules (`auth.js`, `sw-client.js`, `sw.js`, `page-init.js`) and sessionStorage. Integration tests must cover the full chain:

### Test 4a — Happy path login
1. Call `authenticate(username, password)` with correct credentials
2. Assert it resolves to a `CryptoKey` object
3. Call `setKey(cryptoKey)` to push key into SW
4. Call `isAuthenticated()` and assert returns `true`
5. Call `swEncrypt({ test: 1 })` and assert returns a string matching `base64:base64` format
6. Call `swDecrypt(encryptedString)` and assert returns `{ test: 1 }`

### Test 4b — Wrong credentials
1. Call `authenticate(username, 'wrongpassword')`
2. Assert it rejects with an error matching `/^invalid:/`
3. Assert `localStorage.auth_attempts` incremented to 1
4. Repeat twice more and assert the third failure triggers lockout
5. Assert `localStorage.auth_lockout_until` is set to a future timestamp
6. Assert subsequent `authenticate()` calls throw `/^locked:/` immediately without running PBKDF2

### Test 4c — Lockout escalation
1. Trigger first lockout (3 failed attempts)
2. Assert lockout duration is approximately 30 seconds (`auth_lockout_until - Date.now() ≈ 30000`)
3. Clear lockout manually (simulate expiry by setting `auth_lockout_until = 0`)
4. Trigger second lockout
5. Assert lockout duration is approximately 60 seconds
6. Assert `auth_lockout_count` = 2

### Test 4d — SW key recovery after termination
1. Authenticate and store key in SW
2. Simulate SW termination by setting `_encKey = null` directly (or LOCK message)
3. Verify `isAuthenticated()` returns `false`
4. Assert that `_recoverKey()` in `page-init.js` reads `sessionStorage._ek`, reconstructs the `CryptoKey`, and restores auth
5. Verify `isAuthenticated()` returns `true` after recovery

### Test 4e — SW timeout
1. Mock `navigator.serviceWorker.controller` to never respond on the MessageChannel port
2. Call `swEncrypt(data)` and assert it rejects with "SW timeout" after 8 seconds
3. Assert the rejection does not crash the calling code

### Test 4f — Decrypt fallback to DEFAULTS
1. Set `localStorage.fin_income` to a garbage string (not `base64:base64` format)
2. Call `load('fin_income')`
3. Assert it returns `DEFAULTS.fin_income` (the default income object), not `null` and not throwing
4. Assert no unhandled promise rejection fires

---

## 5. Performance risks in `js/charts.js` and `js/store.js`

### `js/charts.js` — Performance risks

**Risk 1: Full chart recreation on every render**
`updateCharts()` calls all `init*Charts()` functions which each call `destroyChart(id)` and re-create every chart from scratch. On the Overview section alone, this creates 5 charts (doughnut, monthly bar, 3 gauges) every time any data changes. With `renderOverview()` calling `updateCharts(state)` at the end, and `updateCharts` being called from `attachAutoSave` on every field change, a single keypress in any income field triggers complete reconstruction of all visible charts.

**Risk 2: `projectULIP` called 6 times per ULIP per render**
In `initInvestmentCharts()`, for each ULIP, `projectULIP()` is called 3 times (conservative, expected, aggressive) to generate per-ULIP charts, then called again 3 times inside the `combined` reduce. For 3 ULIPs this is 18 `projectULIP` calls per chart render. Each call iterates `totalTermYears * 12` months (up to 20 × 12 = 240 iterations). This is synchronous CPU work done on the main thread.

**Risk 3: `initAllCharts` is called at boot AND on every `renderSection`**
`boot()` calls `await initAllCharts(state)` on startup, and `renderSection` calls `updateCharts(state)` on every section switch. The networth and investment charts run `projectNetWorthTimeline` (61 months) and multiple `projectULIP` calls on every navigation, not just when data changes.

**Risk 4: `generateAmortisation` in debt charts called twice per render**
`initDebtCharts` generates two full amortisation schedules (base and extra EMI). For a ₹27.5L loan at ₹34,090 EMI this produces approximately 111 months of data, twice. This is called on every chart update, including when non-debt data changes (e.g., updating income triggers `updateCharts` which calls `initDebtCharts`).

**Risk 5: `getCtx` always destroys and recreates the Chart.js instance**
The `destroyChart(id)` pattern used in every `getCtx()` call means Chart.js runs its full teardown-and-reinitialise cycle (including canvas context reset and animation setup) on every single render. There is no dirty-check to skip recreation when the underlying data has not changed.

### `js/store.js` — Performance risks

**Risk 1: Every save is a round-trip to the Service Worker**
`save(key, data)` serialises the data to JSON, sends it via `postMessage` with a `MessageChannel`, waits for the SW to AES-GCM encrypt it with a fresh random IV, and then stores the ciphertext in localStorage. This is inherently asynchronous and serial. `saveAll()` calls `Promise.all` with 10 separate SW messages. On a slow SW startup this can take 200–500ms for a `saveAll()`.

**Risk 2: `load()` and `loadAll()` are async on every page navigation**
Every page module does `const state = await initPage()` which calls `loadAll()`, which sends 10 `DECRYPT` messages to the SW in parallel. If the SW is freshly started after being terminated, it must be waited for via `serviceWorker.ready` before any decryption can happen. There is no caching layer; every page navigation re-decrypts all 10 keys.

**Risk 3: SW 8-second timeout on encrypted operations**
`_send()` has a hard 8-second timeout. On slow devices or after browser backgrounding, this timeout can fire during normal `save()` operations with no retry logic. The calling code in store.js does not handle the "SW timeout" rejection, meaning a timed-out save silently loses data.

**Risk 4: `reEncryptAll` iterates all localStorage keys synchronously in a loop**
`reEncryptAll()` in `store.js` iterates every `fin_` key in a `for...of` loop with `await` inside, meaning re-encryption is fully sequential (not parallelised). With 10 keys, each requiring a decrypt + encrypt SW round-trip, this could take several seconds if the SW is slow.

---

## 6. Application performance with large datasets in localStorage

This application stores all data in localStorage, which has a 5–10MB limit per origin (browser-dependent). Current default data is approximately 3–4KB unencrypted. The main areas where localStorage growth can become a problem are:

**`fin_monthly_log`:** The monthly log array grows by one entry per month. At 12 entries/year over 25 years this reaches 300 entries. Each entry is approximately 100 bytes, so the array itself stays under 30KB — not a storage concern. However, `initOverviewCharts` maps over the entire log array on every render to generate the monthly bar chart labels and values. At 300 entries this is trivial.

**`fin_india_log`:** Similar growth pattern. No performance concern at realistic scale.

**The AES-GCM ciphertext overhead:** Each `save()` call stores `base64(12-byte IV) + ':' + base64(ciphertext)`. Base64 encoding adds ~33% overhead. For a 10KB `fin_investments` object (3 ULIPs with full projection data), the ciphertext is approximately 13.5KB. Total storage for all 10 keys is under 100KB — far below the 5MB limit.

**The real localStorage risk is not size but write frequency.** On the Income page, every `change` event on any input calls `save('fin_income', state.income)` which encrypts and stores. This is fine for single inputs. However, `settings-page.js` field handlers call `autoSave()` which calls `save()` and then `renderTab()`. If a user pastes a value or uses keyboard auto-repeat, each character fires the `input` event which mutates state, but `change` (not `input`) fires the save. This is correct — but worth noting that the `input`/`change` split is inconsistent across pages. `expenses.js` uses `input` to mutate and `change` to save; `settings-page.js` uses `input` to both mutate and trigger `onChange` which triggers `autoSave`. One fast-typing user on Settings can queue multiple sequential SW encrypt operations.

**Performance with the amortisation table shown in full:** The "Show all" toggle in `js/pages/debts.js` renders the full `sch` array as HTML. For the default ₹27.5L loan at ₹34,090 EMI this is approximately 111 rows — fast. However, if a user enters a very low EMI (near the interest amount), `generateAmortisation` can return up to 600 rows, and "Show all" would render 600 table rows synchronously via innerHTML, which causes a measurable layout reflow but is not catastrophic.

---

## 7. Complete test plan for this application

### Phase 1 — Unit tests for `js/calc.js` (Pure functions, no DOM, runnable in Node.js with Jest)

Priority order:

| Function | Test scenarios |
|---|---|
| `round2` | Positive, negative, already rounded, 3+ decimal places |
| `calculateNetPay` | Zero salary, normal salary, high salary above higher rate, zero tax allowance, NI ceiling, zero pension, no overtime |
| `generateAmortisation` | Normal, zero outstanding, EMI too low, extra payment exceeds balance, 600-month cap |
| `amortPayoffDate` | Empty schedule, 1-month schedule, 111-month schedule |
| `amortInterestSaved` | Identical schedules (0 saved), schedule2 longer than schedule1 (negative), typical case |
| `projectULIP` | Zero current value, zero monthly premium, pay term in the past, term = 1 year |
| `calculateNetWorth` | Empty investments, INR rate of 0 (guard test), all zeros |
| `applyScheduledChanges` | No changes, past change (should apply), future change (should not apply), invalid date |
| `totalExpenses` | Empty, all inactive, mix of active/inactive |
| `expensesByCategory` | Empty, all same category, multiple categories |
| `calculateSurplus` | Positive, negative (deficit), zero |
| `indiaTripProgress` | No trip data, past deadline, saved > target, zero target |
| `emergencyFundProgress` | Zero cash, zero target (guard), at 100% |
| `taxTrackerProgress` | Missing fields, today before start, today after end, at exact total |
| `wealthProgress` | Both phases, exact zero netWorth, totalDebtGBP of 0 |
| `projectNetWorthTimeline` | Normal 60 months, INR rate of 0 (must not produce Infinity), zero debt |
| `compoundGrowthProjection` | Zero rate, zero monthly amount, 1 year |
| `ageWealthTrajectory` | currentAge > targetAge (empty result), no career transition |
| `emergencyRunwayMonths` | Zero expenses (guard), zero cash |
| `surplusTrajectoryEvents` | No scheduled changes, with scheduled changes, with tax normalisation |
| `loanPaidToDate` | No start date, normal case, monthsIn = 0 |
| `fmtGBP` | Negative, zero, large number, decimals |
| `fmtINR` | Indian lakh/crore formatting, negative |

### Phase 2 — Unit tests for `js/auth.js` (requires SubtleCrypto mock or real browser/jsdom)

| Function | Test scenarios |
|---|---|
| `checkLockout` | No lockout data, active lockout, expired lockout |
| `_recordFail` (via authenticate) | 1st fail, 2nd fail, 3rd fail triggers lockout, lockout duration escalation |
| `_clearAttempts` (via successful auth) | Clears attempts and lockout after success |
| `authenticate` | Correct creds return CryptoKey, wrong password, wrong username, both wrong, locked state |

### Phase 3 — Integration tests for store.js + sw-client.js + sw.js

Requires a browser-like environment (Playwright or a real browser test with `window.crypto.subtle`):

- Full save/load round-trip
- Load with corrupt localStorage value returns default
- loadAll parallel decryption
- SW termination and key recovery
- SW timeout behaviour
- reEncryptAll round-trip

### Phase 4 — Auth flow integration tests

As described in Section 4 above.

### Phase 5 — Page-level smoke tests (Playwright)

For each of the 13 HTML pages:
- Page loads without JavaScript errors
- Navigation links are functional
- All metric cards render with numeric values
- All charts render (canvas elements are non-empty)
- Form inputs trigger save without error
- Lock button redirects to login page

### Phase 6 — Performance regression tests

- Chart render time for Overview section < 200ms
- `loadAll()` total time < 500ms on first load
- `saveAll()` total time < 500ms
- `generateAmortisation` for 600-month schedule < 10ms
- `projectNetWorthTimeline` for 60 months < 5ms

### Phase 7 — Security tests

- Confirm no plaintext financial data in localStorage (all `fin_` keys must have `:` separating IV and ciphertext)
- Confirm correct credentials do not appear in `defaults.js`, `CLAUDE.md`, README, or any committed file
- Confirm auth hash in `auth.js` does not match default credentials if hardcoded CRED object is in source
- Confirm lockout cannot be bypassed by clearing `auth_lockout_until` without resetting `auth_lockout_count`
- Confirm the JSON import feature does not allow injection of arbitrary `fin_` keys that bypass encryption

---

## 8. Five actual test cases (runnable JavaScript)

The following test code uses Jest syntax. Since `calc.js` uses ES module exports, run with `--experimental-vm-modules` or add `"type": "module"` to a test `package.json`. These test the most critical untested paths identified above.

```javascript
// FILE: tests/calc.test.js
// Run: npx jest tests/calc.test.js
// Requires: jest, and calc.js must be accessible at ../../src/projects/financial-dashboard/js/calc.js

import {
  calculateNetPay,
  generateAmortisation,
  taxTrackerProgress,
  wealthProgress,
  indiaTripProgress,
  applyScheduledChanges,
  totalExpenses,
  calculateNetWorth,
  round2,
} from '../../src/projects/financial-dashboard/js/calc.js';

// ══════════════════════════════════════════════════════════════
// TEST CASE 1: calculateNetPay — boundary and correctness
// ══════════════════════════════════════════════════════════════

describe('calculateNetPay', () => {

  test('standard £28k salary with overtime produces correct net pay', () => {
    const result = calculateNetPay({
      baseSalaryGBP: 28000,
      avgOvertimeGrossGBP: 275,
      pensionEmployeeRate: 3,
      pensionEmployerRate: 3,
      taxFreeAllowanceAnnual: 12570,
      underpaymentMonthlyGBP: 38,
    });

    // grossBase = 28000/12 = 2333.33 → round2 → 2333.33
    expect(result.grossBase).toBeCloseTo(2333.33, 1);

    // grossWithOT = 2333.33 + 275 = 2608.33
    expect(result.grossWithOT).toBeCloseTo(2608.33, 1);

    // taxFreeMonthly = 12570/12 = 1047.50
    // incomeTax = (2608.33 - 1047.50) * 0.20 = 312.17
    expect(result.incomeTax).toBeGreaterThan(0);
    expect(result.incomeTax).toBeLessThan(result.grossWithOT);

    // NI: niable = min(2608.33, 4189) - 1048 = 1560.33; ni = 1560.33 * 0.08 = 124.83
    expect(result.ni).toBeGreaterThan(0);
    expect(result.ni).toBeLessThan(200);

    // pension = 2333.33 * 0.03 = 70
    expect(result.pension).toBeCloseTo(70, 0);

    // employerPension = 2333.33 * 0.03 = 70
    expect(result.employerPension).toBeCloseTo(70, 0);

    // extraTax = 38
    expect(result.extraTax).toBe(38);

    // Net must be positive and less than gross
    expect(result.netWithOT).toBeGreaterThan(0);
    expect(result.netWithOT).toBeLessThan(result.grossWithOT);

    // totalDeductions = incomeTax + ni + pension + extraTax
    expect(result.totalDeductions).toBeCloseTo(
      result.incomeTax + result.ni + result.pension + result.extraTax, 1
    );

    // netWithOT = grossWithOT - incomeTax - ni - pension - extraTax
    expect(result.netWithOT).toBeCloseTo(
      result.grossWithOT - result.totalDeductions, 1
    );
  });

  test('income tax clamps to zero when gross is below tax-free allowance', () => {
    const result = calculateNetPay({
      baseSalaryGBP: 10000,          // monthly gross = £833.33
      avgOvertimeGrossGBP: 0,
      pensionEmployeeRate: 0,
      pensionEmployerRate: 0,
      taxFreeAllowanceAnnual: 12570, // monthly tax-free = £1047.50 > gross
      underpaymentMonthlyGBP: 0,
    });

    // Gross (£833) < tax-free monthly (£1047.50) → incomeTax must be 0
    expect(result.incomeTax).toBe(0);
    expect(result.netBase).toBeGreaterThan(0);
  });

  test('NI does not exceed upper earnings limit ceiling', () => {
    // Monthly gross of £6,000 — above £4,189 NI ceiling
    const result = calculateNetPay({
      baseSalaryGBP: 72000,   // £6,000/month
      avgOvertimeGrossGBP: 0,
      pensionEmployeeRate: 0,
      pensionEmployerRate: 0,
      taxFreeAllowanceAnnual: 12570,
      underpaymentMonthlyGBP: 0,
    });

    // NI must be capped: niable = min(6000, 4189) - 1048 = 3141; ni = 3141 * 0.08 = 251.28
    const expectedMaxNI = round2((4189 - 1048) * 0.08);
    expect(result.ni).toBeCloseTo(expectedMaxNI, 1);
    expect(result.ni).toBeLessThanOrEqual(expectedMaxNI + 1); // allow £1 rounding
  });

  test('zero salary returns all zeros without throwing', () => {
    const result = calculateNetPay({
      baseSalaryGBP: 0,
      avgOvertimeGrossGBP: 0,
      pensionEmployeeRate: 0,
      pensionEmployerRate: 0,
      taxFreeAllowanceAnnual: 12570,
      underpaymentMonthlyGBP: 0,
    });

    expect(result.grossBase).toBe(0);
    expect(result.grossWithOT).toBe(0);
    expect(result.incomeTax).toBe(0);
    expect(result.ni).toBe(0);
    expect(result.pension).toBe(0);
    expect(result.netBase).toBe(0);
    expect(result.netWithOT).toBe(0);
  });

  test('hourly rate is calculated as baseSalaryGBP / 1950', () => {
    const result = calculateNetPay({
      baseSalaryGBP: 28000,
      avgOvertimeGrossGBP: 0,
      pensionEmployeeRate: 0,
      pensionEmployerRate: 0,
      taxFreeAllowanceAnnual: 12570,
      underpaymentMonthlyGBP: 0,
    });
    expect(result.hourlyRate).toBeCloseTo(28000 / 1950, 2);
  });
});


// ══════════════════════════════════════════════════════════════
// TEST CASE 2: generateAmortisation — correctness and edge cases
// ══════════════════════════════════════════════════════════════

describe('generateAmortisation', () => {

  test('produces a convergent schedule for the default SBI loan', () => {
    const schedule = generateAmortisation(2752000, 9.9, 34090, 0);

    // Schedule must not be empty
    expect(schedule.length).toBeGreaterThan(0);

    // Schedule must not hit the 600-month cap for a normal loan
    expect(schedule.length).toBeLessThan(600);

    // Final closing balance must be 0 (fully paid off)
    const last = schedule[schedule.length - 1];
    expect(last.closing).toBe(0);

    // Month numbers must be sequential
    expect(schedule[0].month).toBe(1);
    expect(schedule[schedule.length - 1].month).toBe(schedule.length);

    // Total principal paid must approximately equal original outstanding (within ₹100)
    const totalPrincipal = last.totalPrincipal;
    expect(Math.abs(totalPrincipal - 2752000)).toBeLessThanOrEqual(100);
  });

  test('returns empty schedule when outstanding is 0', () => {
    const schedule = generateAmortisation(0, 9.9, 34090, 0);
    expect(schedule).toHaveLength(0);
  });

  test('accelerated payoff with extra payment reduces schedule length', () => {
    const base    = generateAmortisation(2752000, 9.9, 34090, 0);
    const extra   = generateAmortisation(2752000, 9.9, 34090, 10000);
    expect(extra.length).toBeLessThan(base.length);
  });

  test('EMI lower than monthly interest hits 600-month cap without crashing', () => {
    // Monthly interest on ₹27.5L at 9.9% = ~₹22,693. EMI of ₹5,000 is below this.
    const schedule = generateAmortisation(2750000, 9.9, 5000, 0);
    // Must not throw and must return exactly 600 rows (the hard cap)
    expect(schedule).toHaveLength(600);
    // Balance in last row must be greater than 0 (not paid off)
    expect(schedule[599].closing).toBeGreaterThan(0);
  });

  test('extra payment larger than balance clears debt in month 1', () => {
    const schedule = generateAmortisation(100000, 9.9, 5000, 200000);
    expect(schedule).toHaveLength(1);
    expect(schedule[0].closing).toBe(0);
  });
});


// ══════════════════════════════════════════════════════════════
// TEST CASE 3: taxTrackerProgress — date arithmetic correctness
// ══════════════════════════════════════════════════════════════

describe('taxTrackerProgress', () => {

  test('returns all zeros when tracker fields are missing', () => {
    const result = taxTrackerProgress({});
    expect(result.collected).toBe(0);
    expect(result.remaining).toBe(0);
    expect(result.pct).toBe(0);
    expect(result.monthsElapsed).toBe(0);
  });

  test('collected clamps to underpaymentTotal, not beyond', () => {
    // Set start 20 months ago, with monthly deduction of £50, total = £456
    // 20 months × £50 = £1000, but must clamp to £456
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth() - 20, 1);
    const end   = new Date(today.getFullYear(), today.getMonth() + 4,  1);

    const result = taxTrackerProgress({
      startDate: start.toISOString().slice(0, 10),
      endDate:   end.toISOString().slice(0, 10),
      underpaymentTotal: 456,
      monthlyDeduction:  50,
    });

    expect(result.collected).toBe(456);
    expect(result.remaining).toBe(0);
    expect(result.pct).toBe(100);
  });

  test('collected is 0 when today is before the start date', () => {
    const today  = new Date();
    const future = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const end    = new Date(today.getFullYear(), today.getMonth() + 12, 1);

    const result = taxTrackerProgress({
      startDate: future.toISOString().slice(0, 10),
      endDate:   end.toISOString().slice(0, 10),
      underpaymentTotal: 456,
      monthlyDeduction:  38,
    });

    expect(result.collected).toBe(0);
    expect(result.monthsElapsed).toBe(0);
    expect(result.remaining).toBe(456);
  });

  test('daysLeft is never negative when end date is in the past', () => {
    const today = new Date();
    const past  = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const start = new Date(today.getFullYear(), today.getMonth() - 14, 1);

    const result = taxTrackerProgress({
      startDate: start.toISOString().slice(0, 10),
      endDate:   past.toISOString().slice(0, 10),
      underpaymentTotal: 456,
      monthlyDeduction:  38,
    });

    expect(result.daysLeft).toBe(0);
    expect(result.monthsLeft).toBe(0);
  });
});


// ══════════════════════════════════════════════════════════════
// TEST CASE 4: wealthProgress — two-phase logic
// ══════════════════════════════════════════════════════════════

describe('wealthProgress', () => {

  test('returns debt phase when netWorth is negative', () => {
    const result = wealthProgress(-10000, 4760000, 22000);
    expect(result.phase).toBe('debt');
    expect(result.pct).toBeGreaterThanOrEqual(0);
    expect(result.pct).toBeLessThanOrEqual(100);
  });

  test('returns wealth phase when netWorth is zero', () => {
    const result = wealthProgress(0, 4760000, 0);
    expect(result.phase).toBe('wealth');
    expect(result.pct).toBe(0);
  });

  test('returns wealth phase when netWorth is positive', () => {
    const result = wealthProgress(100000, 4760000, 0);
    expect(result.phase).toBe('wealth');
    expect(result.pct).toBeGreaterThan(0);
    expect(result.pct).toBeLessThan(100);
  });

  test('pct clamps to 100 when netWorth reaches target', () => {
    const result = wealthProgress(4760000, 4760000, 0);
    expect(result.pct).toBe(100);
  });

  test('pct clamps to 100 when netWorth exceeds target', () => {
    const result = wealthProgress(6000000, 4760000, 0);
    expect(result.pct).toBe(100);
  });

  test('debt phase: totalDebtGBP of 0 with negative netWorth does not divide by zero', () => {
    // original = Math.max(0, Math.abs(-5000)) = 5000
    // cleared = Math.max(0, 5000 - 5000) = 0
    // pct = 0 / 5000 = 0
    expect(() => wealthProgress(-5000, 4760000, 0)).not.toThrow();
    const result = wealthProgress(-5000, 4760000, 0);
    expect(result.pct).toBe(0);
  });

  test('debt phase: pct reflects proportion of debt cleared', () => {
    // Total debt was £22,000, now netWorth = -£11,000 → 50% cleared
    const result = wealthProgress(-11000, 4760000, 22000);
    expect(result.phase).toBe('debt');
    expect(result.pct).toBeCloseTo(50, 0);
  });
});


// ══════════════════════════════════════════════════════════════
// TEST CASE 5: applyScheduledChanges + totalExpenses integration
// ══════════════════════════════════════════════════════════════

describe('applyScheduledChanges + totalExpenses', () => {
  const baseExpenses = {
    items: [
      { id: 'rent',    name: 'Rent',   category: 'Housing', monthlyGBP: 700, active: true },
      { id: 'phone',   name: 'Phone',  category: 'Phone',   monthlyGBP: 74,  active: true },
      { id: 'grocery', name: 'Groceries', category: 'Food', monthlyGBP: 15,  active: false }, // inactive
    ],
    scheduledChanges: [
      { expenseId: 'rent',  changeDate: '2026-08-01', newMonthlyGBP: 600 },
      { expenseId: 'phone', changeDate: '2099-12-01', newMonthlyGBP: 12  }, // far future — should NOT apply
    ],
  };

  test('past scheduled change is applied, future change is not', () => {
    // changeDate '2026-08-01' is in the past relative to today (2026-05-31)
    // Wait — actually 2026-08-01 is in the FUTURE from today (2026-05-31).
    // So neither change should apply at the time of writing.
    // We test this with a fixed past date:
    const expenses = {
      items: [
        { id: 'rent', name: 'Rent', category: 'Housing', monthlyGBP: 700, active: true },
      ],
      scheduledChanges: [
        { expenseId: 'rent', changeDate: '2020-01-01', newMonthlyGBP: 500 }, // past
      ],
    };
    const result = applyScheduledChanges(expenses);
    const rentItem = result.find(i => i.id === 'rent');
    expect(rentItem.monthlyGBP).toBe(500); // past change applied
  });

  test('future scheduled change is not applied', () => {
    const expenses = {
      items: [
        { id: 'rent', name: 'Rent', category: 'Housing', monthlyGBP: 700, active: true },
      ],
      scheduledChanges: [
        { expenseId: 'rent', changeDate: '2099-01-01', newMonthlyGBP: 100 }, // far future
      ],
    };
    const result = applyScheduledChanges(expenses);
    const rentItem = result.find(i => i.id === 'rent');
    expect(rentItem.monthlyGBP).toBe(700); // future change NOT applied
  });

  test('totalExpenses excludes inactive items', () => {
    const items = [
      { id: 'rent',  monthlyGBP: 700, active: true  },
      { id: 'inact', monthlyGBP: 999, active: false },
    ];
    const total = totalExpenses(items);
    expect(total).toBe(700); // inactive item excluded
  });

  test('totalExpenses returns 0 for empty list', () => {
    expect(totalExpenses([])).toBe(0);
  });

  test('totalExpenses returns 0 when all items inactive', () => {
    const items = [
      { id: 'a', monthlyGBP: 100, active: false },
      { id: 'b', monthlyGBP: 200, active: false },
    ];
    expect(totalExpenses(items)).toBe(0);
  });

  test('applyScheduledChanges does not mutate the original items array', () => {
    const expenses = {
      items: [
        { id: 'rent', name: 'Rent', category: 'Housing', monthlyGBP: 700, active: true },
      ],
      scheduledChanges: [
        { expenseId: 'rent', changeDate: '2020-01-01', newMonthlyGBP: 500 },
      ],
    };
    const originalGBP = expenses.items[0].monthlyGBP;
    applyScheduledChanges(expenses);
    // Original must not be mutated
    expect(expenses.items[0].monthlyGBP).toBe(originalGBP);
  });
});
```

**Notes for the senior engineer:**

1. **Test setup required:** Create `package.json` in the project root with `"type": "module"` and `"jest": { "transform": {} }`, then `npm install --save-dev jest @jest/globals`. The test file imports calc.js directly as an ES module.

2. **SubtleCrypto tests (auth.js):** These require a browser-like environment. Use `jest-environment-jsdom` with a polyfill for `crypto.subtle`, or use Playwright's `page.evaluate()` to run auth tests in a real Chromium context.

3. **Store.js tests:** Must mock `navigator.serviceWorker` and `MessageChannel`, or run in Playwright against the actual running application.

4. **Test case 1 (line `expect(result.incomeTax).toBe(0)`):** Verify the exact tax-free allowance used in your environment. The `calculateNetPay` function uses `taxFreeAllowanceAnnual / 12` as the monthly threshold. Ensure test inputs are consistent with the function's logic.

5. **The amortisation rounding drift test** (total principal ≈ outstanding within ₹100) is an important regression guard. The current `Math.round()` on each step means the final total can differ from the opening balance. If this tolerance is exceeded after any future changes to the rounding strategy, the test will catch it immediately.

---

## Summary of immediate actions required

1. **Create `package.json` and set up Jest** — the calc.js tests above can be running within 30 minutes.
2. **Add a guard in `generateAmortisation`** for EMI ≤ monthly interest: throw an error or return an empty array with a message, do not silently run 600 iterations.
3. **Add a guard in `projectNetWorthTimeline`** for `inrGbpRate <= 0`.
4. **Add a maximum cap on lockout duration** in `auth.js` — suggest 24 hours.
5. **Add SW timeout retry logic** in `store.js` — on SW timeout, attempt one retry after 500ms before failing.
6. **Write the 5 test cases above** and add them to CI before the next feature commit.
