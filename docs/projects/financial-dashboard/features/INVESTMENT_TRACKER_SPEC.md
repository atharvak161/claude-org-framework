# Feature Specification — Investment Tracker: UK Wrappers & Indian Instruments
**Document type:** Feature Specification for Developer Implementation
**Author:** Requirements Analyst
**Date:** 2026-06-02
**Status:** APPROVED FOR IMPLEMENTATION
**Target file(s):** `defaults.js`, `assets.html`, `js/pages/assets.js`
**Input documents reviewed:**
- `js/defaults.js` — full DEFAULTS data structure
- `assets.html` — existing page scaffold
- `js/pages/assets.js` — existing render/chart logic
- `docs/finance/INVESTMENT_SECTION_REVIEW.md` — investment team review (2026-06-01)

---

## Context and Purpose

The financial dashboard currently tracks: one workplace pension, one cash savings account, and three ULIPs. For a UK-resident investor with Indian financial ties this is materially incomplete. The investment team review rated the investment section 5/10, identifying ISA, SIPP, LISA, NPS, ELSS, PPF, and SGBs as absent, with no Indian-side portfolio tracking at all.

This specification defines two new sections to be added to the assets page:

1. **UK Investment Wrappers** — ISA (Stocks & Shares, Cash, Lifetime), SIPP
2. **Indian Investment Instruments** — NPS, ELSS, PPF, SGBs

Both sections are read/write: the user enters values via inline form inputs and the dashboard computes derived metrics. This follows the existing `invField()` / `bindInvFields()` / `setPath()` / `saveSec()` pattern already in `assets.js`.

---

## Part 1 — UK Investment Wrappers (ISA, SIPP, LISA)

### 1.1 Data Model Changes — `defaults.js`

Add the following keys inside `fin_investments` in `DEFAULTS`. They must be placed after the existing `ulips` array and before the closing brace of `fin_investments`.

```js
isa: {
  stocksAndSharesISA: {
    provider: '',
    currentValueGBP: 0,
    annualContributionGBP: 0,
    yearToDateContributionGBP: 0,
  },
  cashISA: {
    provider: '',
    currentValueGBP: 0,
    annualContributionGBP: 0,
    yearToDateContributionGBP: 0,
  },
  lifetimeISA: {
    provider: '',
    currentValueGBP: 0,
    annualContributionGBP: 0,
    yearToDateContributionGBP: 0,
    bonusReceivedGBP: 0,
    firstHomePurpose: false,
  },
},
sipp: {
  provider: '',
  currentValueGBP: 0,
  annualContributionGBP: 0,
  yearToDateContributionGBP: 0,
  employerContributionGBP: 0,
},
```

**Field-level definitions:**

| Field | Type | Description |
|---|---|---|
| `isa.stocksAndSharesISA.provider` | string | Platform name (e.g. Vanguard, Hargreaves Lansdown) |
| `isa.stocksAndSharesISA.currentValueGBP` | number | Current portfolio value in GBP |
| `isa.stocksAndSharesISA.annualContributionGBP` | number | Total planned contribution this tax year |
| `isa.stocksAndSharesISA.yearToDateContributionGBP` | number | Amount actually contributed so far this tax year |
| `isa.cashISA.provider` | string | Bank/building society name |
| `isa.cashISA.currentValueGBP` | number | Current cash ISA balance |
| `isa.cashISA.annualContributionGBP` | number | Total planned contribution this tax year |
| `isa.cashISA.yearToDateContributionGBP` | number | Amount actually contributed so far this tax year |
| `isa.lifetimeISA.provider` | string | Platform name (e.g. Moneybox, AJ Bell) |
| `isa.lifetimeISA.currentValueGBP` | number | Current LISA value including bonuses |
| `isa.lifetimeISA.annualContributionGBP` | number | Planned contribution this tax year (max £4,000) |
| `isa.lifetimeISA.yearToDateContributionGBP` | number | Amount contributed so far this tax year |
| `isa.lifetimeISA.bonusReceivedGBP` | number | Total government bonus received to date (lifetime) |
| `isa.lifetimeISA.firstHomePurpose` | boolean | `true` = first home purchase; `false` = retirement |
| `sipp.provider` | string | SIPP platform name (e.g. Vanguard SIPP, HL SIPP) |
| `sipp.currentValueGBP` | number | Current SIPP pot value |
| `sipp.annualContributionGBP` | number | Planned total personal contribution this tax year |
| `sipp.yearToDateContributionGBP` | number | Personal contributions made so far this tax year |
| `sipp.employerContributionGBP` | number | Employer contributions made so far this tax year |

### 1.2 Derived Calculations

All calculations are performed in the render function in `assets.js`. No new `calc.js` functions are required for this section — the arithmetic is simple enough to be inline.

**ISA allowance tracking:**

```
TOTAL_ISA_ALLOWANCE = 20000   // £20,000 for 2024/25 and 2025/26 tax year

isaYtdTotal = isa.stocksAndSharesISA.yearToDateContributionGBP
            + isa.cashISA.yearToDateContributionGBP
            + isa.lifetimeISA.yearToDateContributionGBP

isaAllowanceRemaining = TOTAL_ISA_ALLOWANCE - isaYtdTotal
isaAllowanceUsedPercent = (isaYtdTotal / TOTAL_ISA_ALLOWANCE) * 100
```

**LISA bonus:**

```
LISA_ANNUAL_LIMIT = 4000
LISA_BONUS_RATE   = 0.25
LISA_BONUS_CAP    = 1000   // per tax year

lisaBonusEarned = Math.min(isa.lifetimeISA.yearToDateContributionGBP * LISA_BONUS_RATE, LISA_BONUS_CAP)
lisaAllowanceRemaining = LISA_ANNUAL_LIMIT - isa.lifetimeISA.yearToDateContributionGBP
```

**SIPP tax relief:**

Tax relief is calculated using the marginal income tax rate sourced from `fin_income`. The marginal rate lookup logic:

```
grossSalaryGBP = st.income.baseSalaryGBP  // from fin_income
personalAllowance = 12570

if grossSalaryGBP <= personalAllowance:
  marginalRatePercent = 0
else if grossSalaryGBP <= 50270:
  marginalRatePercent = 20
else if grossSalaryGBP <= 125140:
  marginalRatePercent = 40
else:
  marginalRatePercent = 45

sippTaxReliefGBP = sipp.yearToDateContributionGBP * (marginalRatePercent / 100)
```

Note: This is an approximation — it applies the marginal rate to the full YTD contribution, which is correct only if all contributions fall within the same marginal band. Display it with a label "estimated tax relief." The actual relief claimed via Self Assessment may differ.

**Total UK tax-advantaged portfolio:**

```
totalUKTaxAdvantaged = isa.stocksAndSharesISA.currentValueGBP
                     + isa.cashISA.currentValueGBP
                     + isa.lifetimeISA.currentValueGBP
                     + sipp.currentValueGBP
                     + (existing pension valueGBP)
```

### 1.3 UI Specification — UK Wrappers Section

**Placement in `assets.html`:** Add a new `<div id="uk-wrappers-section" class="mt-20"></div>` after the existing `<div id="ulip-section">` and before the combined ULIP projection panel.

**Section header:**

```html
<div class="section-header" style="margin-top: 32px;">
  <div>
    <div class="section-title">UK Tax-Advantaged Wrappers</div>
    <div class="section-subtitle">ISA, LISA &amp; SIPP — 2025/26 tax year</div>
  </div>
</div>
```

---

#### Panel 1: ISA Allowance Tracker

A single full-width panel at the top of this section displaying the combined ISA allowance status.

**Visual layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│ ISA Allowance — 2025/26 Tax Year          [badge: On Track]     │
│                                                                 │
│  Used: £X,XXX        Remaining: £XX,XXX        Limit: £20,000  │
│                                                                 │
│  [════════════░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]  XX%          │
│   ████ Stocks & Shares ISA  ░░░░ Cash ISA  ▓▓▓▓ LISA           │
│                                                                 │
│  Stocks ISA YTD    £X,XXX   │  Cash ISA YTD     £X,XXX         │
│  LISA YTD          £X,XXX   │                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Progress bar colour rules:**
- `isaAllowanceUsedPercent < 80` → green (`var(--positive)` = `#00e676`)
- `isaAllowanceUsedPercent >= 80 AND < 100` → amber (`var(--warning)` = `#ff9100`)
- `isaAllowanceUsedPercent >= 100` → red (`#ff1744`). Badge changes to "Limit Reached" in red.

**Badge logic:**
- `< 80%` used → badge class `badge-positive` text "On Track"
- `>= 80%` → badge class `badge-warning` text "Near Limit"
- `>= 100%` → badge class `badge-danger` (add this CSS class: `background: #ff174422; color: #ff1744; border-color: #ff1744`) text "Limit Exceeded"

**Implementation note:** The progress bar is a single `<div>` with a coloured `<div>` child. Do not use a `<progress>` element. Use inline style `width: ${Math.min(isaAllowanceUsedPercent, 100)}%` to cap overflow at 100% visually.

---

#### Panel 2: Stocks & Shares ISA Card (in a 2-column grid with Cash ISA)

```
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│ Stocks & Shares ISA                  │  │ Cash ISA                             │
│                                      │  │                                      │
│ Provider        Vanguard             │  │ Provider        —                    │
│ Current value   £XX,XXX              │  │ Current value   £X,XXX               │
│ YTD contributed £X,XXX               │  │ YTD contributed £X,XXX               │
│ Planned annual  £X,XXX               │  │ Planned annual  £X,XXX               │
│                                      │  │                                      │
│ [Provider input field]               │  │ [Provider input field]               │
│ [Current value  input field]         │  │ [Current value  input field]         │
│ [YTD contrib    input field]         │  │ [YTD contrib    input field]         │
│ [Annual planned input field]         │  │ [Annual planned input field]         │
└──────────────────────────────────────┘  └──────────────────────────────────────┘
```

Use `class="grid-2"` (already defined in CSS) for the two-column layout. Each card is a `<div class="panel">`. Follow the `invField()` pattern for editable inputs. Provider is a text field, not a number — use `type="text"` with a separate text-field helper function (see Section 1.4 below).

---

#### Panel 3: Lifetime ISA Card (full-width)

```
┌─────────────────────────────────────────────────────────────────┐
│ Lifetime ISA (LISA)                         [badge: First Home] │
│                                                                 │
│ Provider              Moneybox                                  │
│ Current value         £X,XXX                                    │
│ YTD contributed       £X,XXX  of £4,000 limit                   │
│ LISA allowance left   £X,XXX                                    │
│ Bonus earned this yr  £XXX (est.)     Bonus cap: £1,000/yr      │
│ Bonus received (total) £XXX                                     │
│                                                                 │
│  [════════════████████░░░░░░░░░░░]  XX% of £4,000 used          │
│                                                                 │
│ [Provider]  [Current value]  [YTD contrib]  [Bonus received]   │
│ [Purpose toggle: First Home / Retirement]                       │
└─────────────────────────────────────────────────────────────────┘
```

**Purpose toggle:** Render as two buttons styled as a segmented control. When `firstHomePurpose === true`, "First Home" button has `badge-positive` styling and "Retirement" is muted. Clicking toggles the boolean and calls `saveSec`. The badge in the panel header reflects the current selection.

**LISA allowance progress bar:** Same colour rules as the ISA allowance bar (amber ≥ 80%, red ≥ 100%), applied to `(yearToDateContributionGBP / 4000) * 100`.

**Bonus note:** Display "est." beside the bonus earned figure. Add a small muted line: "Bonus is paid by HMRC approx 6–8 weeks after contribution."

---

#### Panel 4: SIPP Card (full-width)

```
┌─────────────────────────────────────────────────────────────────┐
│ SIPP — Self-Invested Personal Pension                           │
│                                                                 │
│ Provider              —                                         │
│ Current value         £XX,XXX                                   │
│                                                                 │
│ Contributions this year                                         │
│   Your contributions    £X,XXX                                  │
│   Employer contributions £X,XXX                                 │
│   Total                 £X,XXX                                  │
│                                                                 │
│ Estimated tax relief    £XXX  (at XX% marginal rate)            │
│ Effective contribution  £X,XXX  (after relief)                  │
│                                                                 │
│ [Provider]  [Current value]  [Your YTD]  [Employer YTD]        │
└─────────────────────────────────────────────────────────────────┘
```

**Tax relief note:** Display the marginal rate used: "at 20% marginal rate" (or 40%, dynamically derived). Add a muted note: "Basic rate relief applied at source. Higher rate claimable via Self Assessment."

**Effective contribution calculation:** `sipp.yearToDateContributionGBP + sippTaxReliefGBP + sipp.employerContributionGBP`. This is the true cost-effective pension contribution this year.

---

#### Panel 5: UK Tax-Advantaged Summary (full-width)

A summary panel at the bottom of the UK Wrappers section, showing total portfolio value across all UK wrappers.

```
┌─────────────────────────────────────────────────────────────────┐
│ UK Tax-Advantaged Portfolio                                     │
│                                                                 │
│  Stocks & Shares ISA    £XX,XXX                                 │
│  Cash ISA               £X,XXX                                  │
│  Lifetime ISA           £X,XXX                                  │
│  SIPP                   £XX,XXX                                 │
│  Workplace Pension      £XX,XXX                                 │
│  ─────────────────────────────                                  │
│  Total                  £XX,XXX                                 │
└─────────────────────────────────────────────────────────────────┘
```

Display as a `<table class="data-table">` with rows per wrapper and a bold total row. No chart is required for this panel.

### 1.4 New Helper Functions Required

Add to `assets.js`:

**`invFieldText(label, path, value)`** — identical to `invField()` but renders `type="text"` instead of `type="number"`. Used for provider name inputs.

```js
function invFieldText(label, path, value) {
  return `<div class="form-group">
    <label class="form-label">${label}</label>
    <input type="text" class="form-input inv-field-text" data-path="${path}" value="${value || ''}" />
  </div>`;
}
```

**`bindInvFieldsText(st)`** — mirrors `bindInvFields()` but for text fields. On `change`, calls `setPath` with the string value (not `parseFloat`) then `saveSec`.

**`progressBar(percent, colour)`** — returns the HTML string for a progress bar.

```js
function progressBar(percent, colour) {
  const capped = Math.min(percent, 100);
  return `<div style="background:rgba(255,255,255,0.07);border-radius:4px;height:8px;overflow:hidden;margin:10px 0">
    <div style="width:${capped}%;height:100%;background:${colour};border-radius:4px;transition:width 0.4s"></div>
  </div>`;
}
```

**`isaBarColour(percent)`** — returns the correct colour string:

```js
function isaBarColour(percent) {
  if (percent >= 100) return '#ff1744';
  if (percent >= 80)  return '#ff9100';
  return '#00e676';
}
```

---

## Part 2 — Indian Investment Instruments (NPS, ELSS, PPF, SGBs)

### 2.1 Data Model Changes — `defaults.js`

Add the following keys inside `fin_investments`, after the `sipp` block added in Part 1.

```js
nps: {
  tier1ValueINR: 0,
  tier1MonthlyINR: 0,
  tier2ValueINR: 0,
  equityAllocationPercent: 75,
},
elss: [
  { fund: '', currentValueINR: 0, monthlyINR: 0, lockInDate: '' },
],
ppf: {
  currentValueINR: 0,
  annualContributionINR: 0,
  maturityYear: 0,
},
sgbs: [
  { series: '', gramsHeld: 0, purchasePriceINR: 0, interestRatePercent: 2.5, maturityDate: '' },
],
```

**Field-level definitions:**

| Field | Type | Description |
|---|---|---|
| `nps.tier1ValueINR` | number | Current NPS Tier 1 corpus in INR |
| `nps.tier1MonthlyINR` | number | Monthly contribution to Tier 1 in INR |
| `nps.tier2ValueINR` | number | Current NPS Tier 2 corpus in INR (liquid) |
| `nps.equityAllocationPercent` | number | Equity allocation % (0–75 for Tier 1 under Active choice) |
| `elss[]` | array | One entry per ELSS fund held |
| `elss[].fund` | string | Fund name (e.g. Mirae Asset ELSS Tax Saver) |
| `elss[].currentValueINR` | number | Current market value in INR |
| `elss[].monthlyINR` | number | Monthly SIP amount in INR |
| `elss[].lockInDate` | string | ISO date string — date the most recent SIP tranche unlocks. See note below. |
| `ppf.currentValueINR` | number | Current PPF balance in INR |
| `ppf.annualContributionINR` | number | Annual contribution to PPF in INR (max ₹1,50,000) |
| `ppf.maturityYear` | number | Calendar year of PPF maturity (15-year tenure from account opening) |
| `sgbs[]` | array | One entry per SGB series held |
| `sgbs[].series` | string | RBI series name (e.g. SGB 2020-21 Series VIII) |
| `sgbs[].gramsHeld` | number | Number of grams of gold held |
| `sgbs[].purchasePriceINR` | number | Purchase price per gram in INR at time of subscription |
| `sgbs[].interestRatePercent` | number | Annual interest rate — default 2.5% (fixed by RBI at issuance) |
| `sgbs[].maturityDate` | string | ISO date string of 8-year maturity date |

**ELSS lock-in note:** Each SIP instalment has its own 3-year lock-in from the date of investment. Tracking individual tranches per instalment is too complex for a personal dashboard. The `lockInDate` field represents the earliest date on which any portion of the fund becomes unlocked, OR the date of the most recent SIP (whichever the user finds most useful to track). The developer must display this with a label that makes the approximation clear (see UI spec below).

### 2.2 Derived Calculations

**NPS values in GBP:**

```
npsGBP = (nps.tier1ValueINR + nps.tier2ValueINR) / inrGbpRate
```

**NPS equity/bond split:**

```
equityValueINR = nps.tier1ValueINR * (nps.equityAllocationPercent / 100)
bondValueINR   = nps.tier1ValueINR * (1 - nps.equityAllocationPercent / 100)
```

**ELSS total value and GBP equivalent:**

```
elssTotalINR = elss.reduce((sum, e) => sum + e.currentValueINR, 0)
elssGBP      = elssTotalINR / inrGbpRate
```

**ELSS lock-in status per fund:**

```
// For each ELSS entry:
today = new Date()
lockInDate = new Date(e.lockInDate)
isLocked = lockInDate > today
daysRemaining = Math.ceil((lockInDate - today) / (1000 * 60 * 60 * 24))
```

**PPF maturity countdown:**

```
today = new Date()
currentYear = today.getFullYear()
yearsToMaturity = ppf.maturityYear - currentYear
ppfGBP = ppf.currentValueINR / inrGbpRate
```

**PPF current year interest (informational display only, not editable):**

```
PPF_INTEREST_RATE = 0.071   // 7.1% p.a. — current government-set rate
ppfInterestThisYearINR = ppf.currentValueINR * PPF_INTEREST_RATE
```

Display with note: "Rate set by Government of India quarterly. Current rate: 7.1% p.a."

**SGBs — gold price and annualised return:**

The dashboard does not fetch live gold prices. Use the purchase price as the cost basis. Current market value requires the user to enter it (no live price feed). However, the interest income is calculable:

```
// For each SGB:
sgbInterestAnnualINR = e.gramsHeld * e.purchasePriceINR * (e.interestRatePercent / 100)
sgbTotalCostINR      = e.gramsHeld * e.purchasePriceINR
```

For total SGB portfolio:

```
sgbTotalCostINR = sgbs.reduce((sum, s) => sum + s.gramsHeld * s.purchasePriceINR, 0)
sgbTotalGramsHeld = sgbs.reduce((sum, s) => sum + s.gramsHeld, 0)
sgbTotalInterestAnnualINR = sgbs.reduce((sum, s) => sum + s.gramsHeld * s.purchasePriceINR * (s.interestRatePercent / 100), 0)
sgbGBP = sgbTotalCostINR / inrGbpRate   // cost basis in GBP; no live price
```

**Total India portfolio in GBP:**

```
totalIndiaGBP = npsGBP + elssGBP + ppfGBP + sgbGBP
```

**80C deduction utilisation:**

```
LIMIT_80C = 150000   // ₹1,50,000 annual limit

elss80C = elss.reduce((sum, e) => sum + e.monthlyINR * 12, 0)
          // cap at LIMIT_80C across all 80C instruments
ppf80C  = Math.min(ppf.annualContributionINR, LIMIT_80C)

total80C = elss80C + ppf80C
total80C = Math.min(total80C, LIMIT_80C)   // overall cap

remaining80C = LIMIT_80C - total80C
```

**NPS 80CCD(1B) deduction:**

```
LIMIT_80CCD1B = 50000   // ₹50,000 above and beyond 80C

nps80CCD1B = Math.min(nps.tier1MonthlyINR * 12, LIMIT_80CCD1B)
```

**Total Indian tax deductions (informational):**

```
totalIndianDeductions = total80C + nps80CCD1B
```

Note: These deductions are from Indian taxable income. They are displayed as informational only — the dashboard does not currently model Indian income tax. The developer should label these clearly as "Section 80C / 80CCD(1B) eligible deductions — applicable to Indian tax filings only."

### 2.3 UI Specification — Indian Investments Section

**Placement in `assets.html`:** Add `<div id="india-investments-section" class="mt-20"></div>` immediately after `<div id="uk-wrappers-section">`.

**Section header:**

```html
<div class="section-header" style="margin-top: 32px;">
  <div>
    <div class="section-title">Indian Investments</div>
    <div class="section-subtitle">NPS · ELSS · PPF · Sovereign Gold Bonds</div>
  </div>
</div>
```

---

#### Panel 1: NPS — National Pension System (full-width)

```
┌─────────────────────────────────────────────────────────────────┐
│ NPS — National Pension System                                   │
│                                                                 │
│  Tier 1 corpus    ₹XX,XX,XXX   (£XX,XXX equiv)   [LOCKED]      │
│  Tier 2 corpus    ₹X,XX,XXX    (£X,XXX equiv)    [LIQUID]      │
│  Monthly SIP      ₹XX,XXX                                       │
│                                                                 │
│  Equity / Bonds allocation                                      │
│  [████████████████████░░░░░░] 75% Equity  25% Bonds            │
│   Equity ₹XX,XX,XXX  │  Bonds ₹XX,XX,XXX                       │
│                                                                 │
│  [Tier 1 value]  [Monthly SIP]  [Tier 2 value]  [Equity %]     │
└─────────────────────────────────────────────────────────────────┘
```

**Equity/bond bar:** Two-segment progress bar. Equity segment uses `var(--info)` (`#00bfff`), bond segment uses `var(--purple)` (`#d500f9`). Width proportional to `equityAllocationPercent`.

**LOCKED / LIQUID badges:** "LOCKED" uses `badge-warning` styling for Tier 1. "LIQUID" uses `badge-positive` for Tier 2. Add tooltip text (via `title` attribute): Tier 1 = "Locked until age 60. Partial withdrawal permitted after 3 years for specific purposes." Tier 2 = "Freely withdrawable anytime. No tax benefit."

**Equity % input:** `type="number"` with `min="0" max="75" step="5"`. Add inline note: "Max 75% equity under Active Choice (Tier 1)."

**80CCD(1B) display:** Below the input fields, show: "80CCD(1B) eligible: ₹XX,XXX (of ₹50,000 limit)" using the calculation from 2.2.

---

#### Panel 2: ELSS — Equity Linked Savings Scheme (full-width)

Each ELSS entry renders as a row in a table. The user can add/remove entries. Adding: a static "+ Add Fund" button appends a blank object to `inv.elss` and re-renders. Removing: a "×" button on each row splices the entry and re-renders.

**Table layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│ ELSS Funds — Equity Linked Savings Scheme               [80C]   │
│                                                                 │
│ Fund Name       │ Value (₹)  │ Monthly  │ Lock-in Date  │Status │
│─────────────────┼────────────┼──────────┼───────────────┼───────│
│ [text input]    │ [num]      │ [num]    │ [date input]  │LOCKED │
│ [text input]    │ [num]      │ [num]    │ [date input]  │OPEN   │
│                 │            │          │               │   [×] │
│─────────────────┴────────────┴──────────┴───────────────┴───────│
│ Total           │ ₹XX,XX,XXX │ ₹XX,XXX  │                       │
│                 │ (£XX,XXX)  │                                   │
│                                                                 │
│  [+ Add Fund]                                                   │
│                                                                 │
│  80C utilised (ELSS): ₹XX,XXX/yr                                │
│  Note: Lock-in date shown is earliest unlock date for the fund. │
│  Individual SIP tranches each carry a 3-year lock from their    │
│  investment date.                                               │
└─────────────────────────────────────────────────────────────────┘
```

**Lock-in status badge:**
- `isLocked === true` → `<span class="badge badge-warning">LOCKED</span>` with `title="Unlocks on ${lockInDate}"` showing days remaining in small muted text below.
- `isLocked === false` → `<span class="badge badge-positive">OPEN</span>`

**Date input:** Use `type="date"`. The value in the data store remains an ISO string. Parse with `new Date(e.lockInDate)` for comparison.

**Add Fund logic:**

```js
document.getElementById('elss-add-btn').addEventListener('click', () => {
  st.investments.elss.push({ fund: '', currentValueINR: 0, monthlyINR: 0, lockInDate: '' });
  saveSec('fin_investments', st.investments);
  render(st);
});
```

**Remove Fund logic:** Each row has a `data-elss-index` attribute on its "×" button. On click, splice `st.investments.elss` at that index, save, re-render.

**80C contribution from ELSS:** The annual ELSS SIP total is shown below the table as the 80C-eligible amount (annualised monthly × 12), capped at ₹1,50,000.

---

#### Panel 3: PPF — Public Provident Fund (half-width, in grid-2 with SGBs summary)

```
┌──────────────────────────────────────┐
│ PPF — Public Provident Fund   [80C]  │
│                                      │
│ Current balance     ₹XX,XX,XXX       │
│                     £XX,XXX equiv    │
│ Annual contribution ₹X,XX,XXX        │
│ Maturity year       20XX             │
│ Years to maturity   XX years         │
│ Interest this yr    ₹XX,XXX (est.)   │
│                     @ 7.1% p.a.      │
│                                      │
│ [Current balance]  [Annual contrib]  │
│ [Maturity year]                      │
│                                      │
│ 80C utilised (PPF): ₹X,XX,XXX/yr     │
│                                      │
│ Note: NRIs cannot open new PPF       │
│ accounts. Existing accounts may      │
│ continue until maturity.             │
└──────────────────────────────────────┘
```

**Maturity countdown display:**
- `yearsToMaturity > 0` → show "X years remaining"
- `yearsToMaturity <= 0` → show badge `badge-positive` "Matured" and note "Eligible for full withdrawal or 5-year extension."
- `yearsToMaturity === 1` → show badge `badge-warning` "Matures this year"

**80C eligibility:** Show "80C utilised (PPF): ₹X,XX,XXX/yr" capped at ₹1,50,000 minus ELSS usage. If total 80C is already at limit from ELSS, show "80C limit reached via ELSS — PPF contributions still grow tax-free."

---

#### Panel 4: SGBs — Sovereign Gold Bonds (half-width, in grid-2 with PPF)

```
┌──────────────────────────────────────┐
│ Sovereign Gold Bonds                 │
│                                      │
│ Total grams held     XX.X g          │
│ Cost basis (₹)       ₹XX,XX,XXX      │
│ Cost basis (£)       £XX,XXX equiv   │
│ Annual interest      ₹X,XXX (2.5%)   │
│                                      │
│ Series breakdown:                    │
│ ─────────────────────────────────── │
│ SGB 2021-22 S.IV  │  5g  │ ₹4,500/g │
│   Matures: 2029-10-22   │  2.5%     │
│                                      │
│ [+ Add Series]                       │
│                                      │
│ Note: Capital gain at maturity is    │
│ tax-free in India. UK CGT may apply  │
│ for UK residents. Early exit from    │
│ Year 5 available at market price.    │
└──────────────────────────────────────┘
```

**Series rows:** Each SGB entry renders as a mini sub-card (not a full table row) since there are typically few series. Fields: Series name (text), Grams held (number), Purchase price/gram (number), Maturity date (date). Interest rate is display-only at 2.5% unless user overrides it (some series were issued at different rates — allow the field to be editable).

**Maturity indicator:** Show days/years to maturity. If within 1 year, show `badge-warning` "Matures soon." If matured, show `badge-positive` "Matured."

**Add Series logic:** Same pattern as ELSS add/remove. Appends blank SGB object to `st.investments.sgbs`, saves, re-renders.

**Gold price note:** Display a muted note: "Current market value not tracked — shows cost basis only. Update values manually after checking NSE/BSE gold rates."

---

#### Panel 5: India 80C / 80CCD(1B) Deduction Tracker (full-width)

A summary panel at the bottom of the India section showing total Section 80 utilisation.

```
┌─────────────────────────────────────────────────────────────────┐
│ Indian Tax Deductions — Estimated Annual Utilisation            │
│ (Applicable to Indian income tax filings only)                  │
│                                                                 │
│  Section 80C breakdown                       Limit: ₹1,50,000   │
│  ─────────────────────────────────────────────────────────────  │
│  ELSS SIP (annualised)      ₹XX,XXX                             │
│  PPF contribution           ₹XX,XXX                             │
│  Total 80C utilised         ₹XX,XXX  of ₹1,50,000               │
│  [══════════════════░░░░░░░░░░░░░░░░░░]  XX%                    │
│  Remaining 80C headroom     ₹XX,XXX                             │
│                                                                 │
│  Section 80CCD(1B) — NPS additional deduction                   │
│  ─────────────────────────────────────────────────────────────  │
│  NPS Tier 1 (annualised)    ₹XX,XXX  of ₹50,000 limit           │
│  [══════════████░░░░░░░░░░░░░░░░░░░░]  XX%                      │
│                                                                 │
│  Total deductions available ₹XX,XXX  (80C + 80CCD1B combined)  │
└─────────────────────────────────────────────────────────────────┘
```

**Progress bar colour rules (same as ISA):**
- `< 80%` used → green
- `>= 80%` → amber
- `>= 100%` → red, show "Limit Reached" badge

**Section label:** Add muted subtitle: "These are Indian tax deductions on Indian income. They do not affect UK PAYE or Self Assessment calculations."

---

#### Panel 6: India Portfolio Summary (full-width)

```
┌─────────────────────────────────────────────────────────────────┐
│ India Investment Portfolio                                      │
│                                                                 │
│  NPS Tier 1             ₹XX,XX,XXX   £XX,XXX                   │
│  NPS Tier 2             ₹X,XX,XXX    £X,XXX                    │
│  ELSS Funds             ₹XX,XX,XXX   £XX,XXX                   │
│  PPF                    ₹XX,XX,XXX   £XX,XXX                   │
│  SGBs (cost basis)      ₹X,XX,XXX    £X,XXX                    │
│  ─────────────────────────────────────────────────────────────  │
│  Total (GBP equiv)                   £XX,XXX                   │
│                                                                 │
│  Exchange rate used: 1 GBP = ₹XX (from Settings)              │
└─────────────────────────────────────────────────────────────────┘
```

Display as a `<table class="data-table">`. Final row is bold total. Exchange rate note is a muted `<div>` below the table. The rate is read from `st.settings.inrGbpRate` (same source the rest of the app uses).

---

## Part 3 — Integration with Existing Net Worth Calculation

The net worth page (`networth.js`) currently sums: pension + cash + ULIPs. The developer must also update the net worth snapshot to include the new assets.

**Add to the net worth total:**

```js
// UK Wrappers
const isaTotal = (inv.isa?.stocksAndSharesISA?.currentValueGBP || 0)
               + (inv.isa?.cashISA?.currentValueGBP || 0)
               + (inv.isa?.lifetimeISA?.currentValueGBP || 0);
const sippTotal = inv.sipp?.currentValueGBP || 0;

// India (converted to GBP)
const inrRate = st.settings?.inrGbpRate || 83;
const npsTotal  = ((inv.nps?.tier1ValueINR || 0) + (inv.nps?.tier2ValueINR || 0)) / inrRate;
const elssTotal = (inv.elss || []).reduce((s, e) => s + (e.currentValueINR || 0), 0) / inrRate;
const ppfTotal  = (inv.ppf?.currentValueINR || 0) / inrRate;
const sgbTotal  = (inv.sgbs || []).reduce((s, s_) => s + (s_.gramsHeld || 0) * (s_.purchasePriceINR || 0), 0) / inrRate;

totalAssets += isaTotal + sippTotal + npsTotal + elssTotal + ppfTotal + sgbTotal;
```

This update is in the net worth page scope, not the assets page scope. The developer should apply it to whichever function in `networth.js` aggregates `totalAssets`. Optional null-safety guards (`|| 0`, `|| []`) are mandatory since users upgrading from the old data structure will not have these keys until their first save.

---

## Part 4 — Settings Page Addition (Out of Scope for This Spec)

The Indian instruments require the `inrGbpRate` to be accurate. This rate is already stored in `fin_settings.inrGbpRate` and displayed in `assets.js` via `st.settings.inrGbpRate`. No change required. The user updates this via the Settings page (existing functionality).

---

## Part 5 — Data Persistence

The existing save mechanism (`saveSec('fin_investments', st.investments)`) will persist all new fields automatically because they live inside the `fin_investments` object. No new `saveSec` keys are needed.

**Default/upgrade safety:** On first load, if `inv.isa` is `undefined` (user has old saved data that pre-dates this feature), all calculations must guard with `|| {}` or `|| 0` or `|| []`. The developer must apply defensive access throughout the render function for the new fields.

Example defensive pattern:

```js
const isa   = inv.isa || { stocksAndSharesISA: {}, cashISA: {}, lifetimeISA: {} };
const ssISA = isa.stocksAndSharesISA || {};
const cISA  = isa.cashISA || {};
const lISA  = isa.lifetimeISA || {};
const sipp  = inv.sipp || {};
const nps   = inv.nps || {};
const elss  = inv.elss || [];
const ppf   = inv.ppf || {};
const sgbs  = inv.sgbs || [];
```

This must be the very first thing in the render function before any derived calculation.

---

## Part 6 — CSS Requirements

The following CSS additions are needed. They should be placed in `css/components.css` (existing stylesheet):

```css
/* LISA / ISA purpose toggle */
.purpose-toggle {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}
.purpose-btn {
  flex: 1;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}
.purpose-btn.active {
  background: rgba(0,230,118,0.12);
  border-color: #00e676;
  color: #00e676;
}

/* Badge danger (new — for ISA limit exceeded) */
.badge-danger {
  background: rgba(255, 23, 68, 0.13);
  color: #ff1744;
  border: 1px solid #ff1744;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Two-segment equity/bond bar */
.split-bar {
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin: 10px 0;
}
.split-bar-equity { background: #00bfff; }
.split-bar-bond   { background: #d500f9; }
```

No other new CSS classes are needed — all other visual elements use existing classes (`panel`, `stat-row`, `stat-label`, `stat-value`, `mono`, `badge`, `badge-positive`, `badge-warning`, `data-table`, `form-group`, `form-label`, `form-input`, `grid-2`, `mt-20`).

---

## Part 7 — Acceptance Criteria

The developer must satisfy all of the following before marking implementation complete:

### UK Wrappers
- [ ] `fin_investments.isa` and `fin_investments.sipp` keys exist in `DEFAULTS` with the exact structure defined in 1.1
- [ ] ISA allowance tracker displays combined YTD total, remaining allowance, and percentage used
- [ ] Progress bar turns amber at ≥ 80% and red at ≥ 100%; badge text changes accordingly
- [ ] LISA section displays £4,000 sub-limit, estimated bonus earned (capped at £1,000), and purpose badge
- [ ] SIPP section displays employee/employer split and estimated tax relief at correct marginal rate sourced from `fin_income.baseSalaryGBP`
- [ ] UK summary panel shows all five wrappers (3× ISA + SIPP + workplace pension) with a total row
- [ ] All input fields save on `change` event and trigger a re-render (matching existing `invField` behaviour)
- [ ] Provider name fields use `type="text"` (not `type="number"`)
- [ ] Defensive access guards prevent crashes when `inv.isa` is undefined (old data)

### Indian Instruments
- [ ] `fin_investments.nps`, `.elss`, `.ppf`, `.sgbs` keys exist in `DEFAULTS` with the exact structure defined in 2.1
- [ ] NPS panel shows Tier 1 and Tier 2 values in INR and GBP equivalent, with equity/bond split bar
- [ ] ELSS table renders all entries with lock-in status badge (LOCKED / OPEN)
- [ ] ELSS add and remove buttons work correctly; remove uses index splice; both trigger save + re-render
- [ ] PPF panel shows maturity year, years remaining, and estimated interest at 7.1%
- [ ] PPF shows "Matured" badge if `maturityYear <= currentYear`
- [ ] SGB panel shows total grams, cost basis in INR and GBP, annual interest per series, maturity date
- [ ] SGB add and remove buttons work identically to ELSS
- [ ] 80C tracker shows ELSS + PPF utilisation with progress bar and headroom
- [ ] 80CCD(1B) tracker shows NPS Tier 1 utilisation against ₹50,000 limit
- [ ] India portfolio summary converts all INR values to GBP using `st.settings.inrGbpRate`
- [ ] Exchange rate source is displayed in the summary panel

### Integration
- [ ] Net worth total in `networth.js` includes all new asset values
- [ ] Null guards applied throughout (`|| 0`, `|| []`, `|| {}`)
- [ ] No console errors on load with empty/default data
- [ ] No console errors on load with pre-existing saved data that lacks the new fields

---

## Appendix A — Regulatory Reference Data (as at 2025/26 tax year)

| Item | Value | Notes |
|---|---|---|
| ISA annual allowance | £20,000 | Combined across all ISA types |
| LISA annual limit | £4,000 | Subset of the £20,000 ISA allowance |
| LISA government bonus | 25% of contribution | Capped at £1,000/yr; paid monthly by HMRC |
| LISA eligible property price | ≤ £450,000 | For first home use |
| LISA age limit to open | Under 40 | Cannot open after 40th birthday |
| Pension annual allowance | £60,000 | Combined SIPP + workplace; tapered above £200k income |
| UK basic rate income tax | 20% | £12,571–£50,270 |
| UK higher rate income tax | 40% | £50,271–£125,140 |
| UK additional rate | 45% | Above £125,140 |
| UK personal allowance | £12,570 | Standard; tapered above £100k |
| Section 80C limit (India) | ₹1,50,000 | Aggregate across ELSS, PPF, LIC, principal repayment etc. |
| Section 80CCD(1B) limit | ₹50,000 | NPS Tier 1 only; additional to 80C |
| PPF interest rate | 7.1% p.a. | Set quarterly by GoI; current as of Q1 2025 |
| SGB interest rate | 2.5% p.a. | Fixed at issuance; paid semi-annually on face value |
| ELSS lock-in | 3 years per tranche | Per SIP instalment from date of investment |
| NPS equity cap (Active) | 75% (to age 50) | Reduces by 2.5%/yr from age 51 to 60 |
