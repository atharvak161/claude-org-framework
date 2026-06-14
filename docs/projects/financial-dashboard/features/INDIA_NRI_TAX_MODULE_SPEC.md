# India NRI Tax Module — Developer Specification
**Document type:** Developer-ready feature specification
**Author:** Tax Accountant (UK/India dual-jurisdiction specialist)
**Date:** 2026-06-02
**Review required from:** CA Arjun Mehta before implementation begins
**Status:** DRAFT — pending CA sign-off

---

## 0. Context and purpose

The taxpayer is an Indian national resident in the UK who holds:
- An SBI education loan with interest being repaid monthly (Section 80E eligible)
- NRO bank accounts (interest is taxable in India at 30% TDS for NRIs)
- Indian ULIP policies (SUD Life, PNB MetLife, Axis Max Life)
- A UK salary with PAYE deductions

The dashboard currently tracks UK tax only (tax code underpayment, PAYE). It has no concept of the taxpayer's Indian tax obligations, the India-UK Double Taxation Avoidance Agreement (DTAA), TDS deducted in India, or Section 80E deductions. This module adds all of that.

The specification is written for the UK 2024/25 tax year and the Indian AY 2025-26 (FY 2024-25) as the baseline, but all year references must be user-configurable — do not hardcode years.

---

## 1. New data fields in defaults.js

### 1.1 Location

Add a new top-level key `fin_india_tax` to the `DEFAULTS` object in `defaults.js`. This is a separate key from the existing `fin_tax_tracker` (which is UK-only) to maintain a clean separation of jurisdictions.

Also add `fin_india_tax` to the `KEYS` array in `store.js` and add the camelCase mapping `india_tax: 'indiaTax'` to `camelMap` and `indiaTax: 'fin_india_tax'` to `reverseMap`.

### 1.2 Full default object

```js
fin_india_tax: {

  // ── Assessment year configuration ─────────────────────────
  assessmentYear: 'AY 2025-26',     // string, e.g. 'AY 2025-26'. Financial year = 'FY 2024-25'.
  taxRegime: 'old',                 // 'old' | 'new'. Old regime allows 80E; new regime does not.

  // ── Indian income sources (NRI-relevant) ──────────────────
  nroInterestIncomeINR: 0,          // Annual NRO savings/FD interest received (INR). Subject to TDS.
                                    // UI note: NRE account interest is tax-exempt u/s 10(4)(ii) IT Act 1961
                                    // and should NOT be included here.
  rentalIncomeINR: 0,               // Annual gross rental income from Indian property (INR).
                                    // Gross rental received — 30% standard deduction u/s 24(a) applied
                                    // automatically before slab calculation. Taxable amount = rentalIncomeINR × 0.70.
  dividendIncomeINR: 0,             // Annual dividend income from Indian equities/MFs (INR).
                                    // s.115A — NRI dividend income taxed at flat 20% + 4% cess,
                                    // NOT at progressive slab rates. Handled separately in calcDividendTax().
  otherIndiaIncomeINR: 0,           // Any other Indian-sourced income not listed above (INR).
  otherIndiaIncomeNote: '',         // Free text description of otherIndiaIncomeINR.

  // ── TDS deducted in India ─────────────────────────────────
  tdsOnNroInterestINR: 0,           // TDS deducted by bank on NRO interest (normally 30% + surcharge + cess).
  tdsOnRentalINR: 0,                // TDS deducted by tenant on rental income (normally 30% for NRI landlord).
  tdsOnDividendINR: 0,              // TDS deducted by company/fund on dividends.
  tdsOtherINR: 0,                   // Any other TDS deducted (INR).

  // ── Section 80E — Education loan interest deduction ───────
  // Only available under the old tax regime. Deductible for up to 8 consecutive AYs.
  sec80E: {
    claimingDeduction: false,       // boolean. True = taxpayer is claiming 80E in this AY.
    loanHolder: 'self',             // 'self' | 'spouse' | 'child' | 'student_for_whom_legal_guardian'
    lenderName: 'SBI',              // string. Free text. Must be approved financial institution.
    annualInterestPaidINR: 0,       // Annual interest paid on the education loan during this FY (INR).
                                    // Source: SBI annual interest certificate / statement.
    deductionAY1: 'AY 2023-24',     // string. AY in which 80E was first claimed (year 1 of 8).
    deductionYearsUsed: 0,          // integer 0–8. How many AYs the 80E deduction has been used.
    deductionYearsRemaining: 8,     // integer. Auto-calculated: 8 - deductionYearsUsed. Read-only.
  },

  // ── ITR filing status ─────────────────────────────────────
  itr: {
    filingStatus: 'not_filed',      // 'not_filed' | 'filed' | 'not_required'
    itrFormNumber: 'ITR-2',         // 'ITR-1' | 'ITR-2' | 'ITR-3' | 'ITR-4'. NRIs typically file ITR-2.
    filingDate: '',                 // ISO date string (YYYY-MM-DD). Date ITR was submitted.
    acknowledgementNumber: '',      // string. 15-digit ITR acknowledgement number from CPC.
    filingMode: 'online',           // 'online' | 'paper'. NRIs must file online.
    isAuditCase: false,             // boolean. If true, deadline is 31 Oct; otherwise 31 Jul.
    assessmentYear: 'AY 2025-26',   // string. AY the ITR covers (should mirror top-level assessmentYear).
    refundDue: false,               // boolean. Whether a refund is expected.
    refundAmountINR: 0,             // number (INR). Expected refund, if any.
    refundReceivedDate: '',         // ISO date string. Date refund credited to bank.
    noticeReceived: false,          // boolean. Whether any notice/scrutiny has been received.
    noticeDetails: '',              // Free text. Nature of notice if received.
  },

  // ── DTAA relief ───────────────────────────────────────────
  // India-UK DTAA (signed 1993). Relief can be claimed in India ITR via DTAA Article 25 (relief method).
  dtaa: {
    dtaaReliefClaimed: false,       // boolean. Is DTAA foreign tax credit being claimed in Indian ITR?
    ukTaxPaidOnIndiaIncomeGBP: 0,   // GBP. UK income tax paid that relates to Indian-sourced income.
                                    // Used to claim credit in India ITR (convert to INR at RBI rate on relevant date).
    dtaaReliefClaimedINR: 0,        // INR. Actual amount of DTAA credit claimed in the ITR (from Form 67).
    form67Filed: false,             // boolean. Form 67 (foreign tax credit claim) must be filed before ITR.
    form67FilingDate: '',           // ISO date string. Date Form 67 was filed.
    rbiRateUsed: 0,                 // number. INR/GBP exchange rate used for conversion in Form 67 (RBI TT buying rate).
  },

  // ── Cross-border double tax tracker ──────────────────────
  // Tracks the net tax position across both jurisdictions on Indian-sourced income.
  crossBorder: {
    ukTaxOnIndiaIncomeGBP: 0,       // GBP. UK income tax attributable to Indian income sources (from SA106 working).
    indiaTaxAfterReliefINR: 0,      // INR. Net India tax payable after TDS credit and DTAA relief (auto-calculated).
    netDoubleTaxPositionGBP: 0,     // GBP. Net total tax paid on Indian income in both countries (auto-calculated).
  },
},
```

### 1.3 Field validation rules

| Field | Type | Min | Max | Required | Notes |
|---|---|---|---|---|---|
| assessmentYear | string | — | — | Yes | Must match pattern `AY YYYY-YY` |
| taxRegime | enum | — | — | Yes | Must be 'old' or 'new' |
| nroInterestIncomeINR | number | 0 | — | No | Cannot be negative |
| rentalIncomeINR | number | 0 | — | No | Cannot be negative |
| dividendIncomeINR | number | 0 | — | No | Cannot be negative |
| otherIndiaIncomeINR | number | 0 | — | No | Cannot be negative |
| tdsOnNroInterestINR | number | 0 | nroInterestIncomeINR | No | Cannot exceed gross income |
| tdsOnRentalINR | number | 0 | rentalIncomeINR | No | Cannot exceed gross income |
| tdsOnDividendINR | number | 0 | dividendIncomeINR | No | Cannot exceed gross income |
| sec80E.annualInterestPaidINR | number | 0 | — | No | Only shown when claimingDeduction = true |
| sec80E.deductionYearsUsed | integer | 0 | 8 | No | Disables claim if = 8 |
| itr.filingDate | date | — | today | No | Cannot be future date |
| itr.acknowledgementNumber | string | 15 chars | 15 chars | No | Numeric digits only |
| dtaa.rbiRateUsed | number | 1 | 200 | No | Sanity check on FX rate |
| dtaa.dtaaReliefClaimedINR | number | 0 | — | No | Cannot exceed Indian tax liability |

---

## 2. New page section — UI specification

### 2.1 Placement decision

Add a **new section to the existing `tax.html` page**, not a new HTML file. Rationale: the taxpayer has one tax page and one mental model for tax. Splitting across two files would fragment the experience and complicate navigation. The India section appears below the existing UK tax sections, separated by a clear visual divider with a heading.

The structure of `tax.html` after this change:

```
tax.html
  ├── Section: UK Tax Tracker (existing — unchanged)
  ├── Section: UK Monthly Payslip Verification (existing — unchanged)
  ├── Section: UK Cumulative Collection Chart (existing — unchanged)
  ├── [divider: "India NRI Tax — AY 2025-26"]
  ├── Section: India Tax Overview (new — summary cards)
  ├── Section: India Income Sources (new — input grid)
  ├── Section: TDS Deducted in India (new — input grid)
  ├── Section: Section 80E — Education Loan Interest (new — conditional panel)
  ├── Section: DTAA Relief & Cross-Border Position (new — input + calculated)
  └── Section: ITR Filing Status (new — status tracker)
```

### 2.2 Jurisdiction divider

```html
<div class="jurisdiction-divider mt-20">
  <div class="jurisdiction-label">India NRI Tax — <span id="india-ay-label">AY 2025-26</span></div>
</div>
```

Style the divider with a left border in a distinct accent colour (suggested: amber `#ff9100` to differentiate from the UK blue `#00bfff`). Use CSS class `jurisdiction-divider` with `border-left: 3px solid #ff9100; padding-left: 12px; margin: 24px 0 16px 0;`.

### 2.3 India Tax Overview — summary cards

A `grid-4` (four-column on desktop, two-column on mobile) of stat cards immediately below the divider. These are read-only calculated outputs that update as the user fills in the inputs below.

| Card title | Key | Format | Colour rule |
|---|---|---|---|
| Total India Gross Income | Sum of all four income sources | fmtINR() | neutral |
| Total TDS Deducted | Sum of all TDS fields | fmtINR() | text-positive (it's money back) |
| Section 80E Deduction | sec80E.annualInterestPaidINR (if claimingDeduction, else ₹0) | fmtINR() | text-positive |
| Net India Tax Payable | After TDS and DTAA relief | fmtINR() | text-warning if > 0, text-positive if 0 |

```html
<div class="grid-4 mt-16" id="india-summary-cards">
  <!-- Rendered by JS -->
</div>
```

### 2.4 India Income Sources — input panel

Panel title: "India Income Sources (NRI)"
Layout: 2-column input grid

| Label | Input type | data-key | Placeholder | Help text below field |
|---|---|---|---|---|
| Assessment Year | text | assessmentYear | AY 2025-26 | Financial year runs Apr–Mar |
| Tax Regime | select | taxRegime | — | Old regime: 80E available. New regime: flat slabs, no deductions |
| NRO Interest Income (₹) | number | nroInterestIncomeINR | 0 | Annual interest credited in NRO accounts. NRE account interest is tax-exempt u/s 10(4)(ii) IT Act 1961 and should NOT be included here. |
| Rental Income — India (₹) | number | rentalIncomeINR | 0 | Gross annual rent received from Indian property. A 30% standard deduction u/s 24(a) is applied automatically before slab calculation. |
| Dividend Income — India (₹) | number | dividendIncomeINR | 0 | From Indian equities or mutual funds. Taxed at flat 20% + 4% cess u/s 115A — not at slab rates. Calculated separately. |
| Other India Income (₹) | number | otherIndiaIncomeINR | 0 | Specify below |
| Description of other income | text | otherIndiaIncomeNote | e.g. commission, royalty | Only shown if otherIndiaIncomeINR > 0 |

The `taxRegime` select must have options `<option value="old">Old Regime (with deductions)</option>` and `<option value="new">New Regime (flat slabs)</option>`.

When `taxRegime` changes to `new`, the Section 80E panel must visually grey out and show a warning banner: "Section 80E deduction is not available under the New Tax Regime."

### 2.5 TDS Deducted in India — input panel

Panel title: "TDS Deducted in India"
Subtitle: "Tax Deducted at Source — usually 30% for NRIs on NRO income"
Layout: 2-column input grid

| Label | Input type | data-key | Validation note |
|---|---|---|---|
| TDS on NRO Interest (₹) | number | tdsOnNroInterestINR | Cannot exceed NRO interest income |
| TDS on Rental Income (₹) | number | tdsOnRentalINR | Cannot exceed rental income |
| TDS on Dividends (₹) | number | tdsOnDividendINR | Cannot exceed dividend income |
| Other TDS Deducted (₹) | number | tdsOtherINR | Any other TDS from Form 26AS |

Below the inputs, render an inline note in small text:
> "Verify TDS amounts against your Form 26AS / AIS on the Income Tax portal. The 30% TDS rate applicable to NRIs is higher than the 10% rate for residents."

Add a stat row below the form:
- **Total TDS Deducted:** sum of all four TDS fields — rendered as `fmtINR()` in `text-positive`

### 2.6 Section 80E panel — education loan interest

Panel title: "Section 80E — Education Loan Interest Deduction"
This panel is conditionally highlighted when `taxRegime === 'old'`.

**Toggle control:** A checkbox at the top of the panel with label "I am claiming Section 80E deduction this year." Bound to `sec80E.claimingDeduction`. When unchecked, all inputs below are disabled (greyed out) and deduction shows as ₹0.

**Input fields when claimingDeduction = true:**

| Label | Input type | data-key | Notes |
|---|---|---|---|
| Lender Name | text | sec80E.lenderName | Pre-filled: "SBI". Must be an approved financial institution or employer |
| Loan Holder | select | sec80E.loanHolder | Options: Self / Spouse / Child / Student (legal guardian) |
| Annual Interest Paid (₹) | number | sec80E.annualInterestPaidINR | From SBI annual interest certificate |
| First AY of claim | text | sec80E.deductionAY1 | e.g. AY 2023-24 — Help text: "Year 1 is the Assessment Year in which you made your first interest payment to the lender. If your bank capitalised interest during the moratorium and you paid nothing, Year 1 starts from the AY in which repayment EMIs began. Check your SBI loan statement — the date of your first interest payment determines Year 1." |
| Years of deduction used | number | sec80E.deductionYearsUsed | Integer 0–8 |

**Calculated outputs (read-only):**

| Label | Value | Notes |
|---|---|---|
| Years remaining | 8 - deductionYearsUsed | Show warning badge if 0 or 1 |
| Deduction claimed this AY | annualInterestPaidINR (full interest, no cap) | 80E has no monetary cap |
| Tax saving (old regime) | See Section 3 for formula | Displayed in INR |

**Important note to render below this panel:**
> "Section 80E allows deduction of the full interest paid on an education loan taken from an approved lender for higher education of self, spouse, child, or a student for whom you are the legal guardian. There is no cap on the deduction amount. The deduction is available for a maximum of 8 consecutive Assessment Years beginning from the year you start repaying interest. The principal EMI is not deductible."

When `deductionYearsUsed >= 8`, show a red warning banner: "The 8-year Section 80E deduction window has been exhausted. This deduction cannot be claimed for this AY."

### 2.7 DTAA Relief and Cross-Border Position — panel

Panel title: "DTAA Relief & Cross-Border Tax Position"
Subtitle: "India-UK Double Tax Avoidance Agreement (1993)"

**Input fields:**

| Label | Input type | data-key | Notes |
|---|---|---|---|
| Claiming DTAA relief in India ITR? | checkbox | dtaa.dtaaReliefClaimed | Unhide below fields when checked |
| UK Tax Paid on India Income (£) | number | dtaa.ukTaxPaidOnIndiaIncomeGBP | From SA106 working — portion of UK tax on Indian income |
| DTAA Relief Claimed in ITR (₹) | number | dtaa.dtaaReliefClaimedINR | As per Form 67 filed with ITR |
| RBI Rate Used (₹/£) | number | dtaa.rbiRateUsed | RBI TT buying rate on date of payment. Source this from SBI's historical treasury rates. The applicable date is the last day of the month preceding the month in which the UK tax was paid (per Rule 128(3) of the IT Rules 1962). Do not use the fin_settings exchange rate, which is a market rate. |
| Form 67 Filed? | checkbox | dtaa.form67Filed | Mandatory before ITR if claiming FTC |
| Form 67 Filing Date | date | dtaa.form67FilingDate | Must be before or same as ITR filing date |

**Calculated outputs:**

| Label | Value | Notes |
|---|---|---|
| UK Tax on India Income (₹ equiv) | ukTaxPaidOnIndiaIncomeGBP × rbiRateUsed | For cross-reference with Form 67 |
| Net India Tax Position | netIndiaTaxPayable (see Section 3) | After all credits |
| Cross-Border Net Tax (£) | (netIndiaTaxPayable / inrGbpRate) + ukTaxOnIndiaIncomeGBP | Total tax paid across both jurisdictions in GBP |

**Warning banner** (always visible):
> "Form 67 must be filed on or before the ITR filing due date (31 July for non-audit cases). Filing Form 67 after the due date will result in disallowance of the foreign tax credit, even if your ITR is filed on time. Verify the RBI TT buying rate applicable to the date the UK tax was paid — do not use the fin_settings exchange rate, which is a market rate."

**Surcharge warning banner** (shown when total Indian income exceeds ₹50,00,000):
> "Your total Indian income exceeds ₹50 lakh. Surcharge applies and is not calculated here. Consult your CA for the correct tax liability."

### 2.8 ITR Filing Status — tracker panel

Panel title: "ITR Filing Status"
Layout: Split — left side has inputs; right side has a status indicator and deadline countdown.

**Input fields:**

| Label | Input type | data-key | Notes |
|---|---|---|---|
| Filing Status | select | itr.filingStatus | Options: Not filed / Filed / Not required |
| ITR Form | select | itr.itrFormNumber | Options: ITR-1, ITR-2, ITR-3, ITR-4. NRI note below |
| Filing Date | date | itr.filingDate | Only shown when filingStatus = 'filed' |
| Acknowledgement Number | text | itr.acknowledgementNumber | 15 digits. Only shown when filingStatus = 'filed' |
| Is this an audit case? | checkbox | itr.isAuditCase | Changes deadline to 31 Oct |
| Refund expected? | checkbox | itr.refundDue | Unhide refund fields when checked |
| Refund Amount (₹) | number | itr.refundAmountINR | Only shown when refundDue = true |
| Refund Received Date | date | itr.refundReceivedDate | Only shown when refundDue = true |
| Income Tax Notice Received (India)? | checkbox | itr.noticeReceived | Unhide details field. Help text: "Has the Income Tax Department of India issued any notice, intimation (u/s 143(1)), or scrutiny notice (u/s 143(2)) regarding this ITR?" |
| Notice Details | textarea | itr.noticeDetails | Only shown when noticeReceived = true |

**Right-side status indicator:**

Render a large status badge:
- `not_filed` + deadline not passed: AMBER badge "NOT YET FILED — [N] days to deadline"
- `not_filed` + deadline passed: RED badge "OVERDUE — deadline was [date]"
- `filed`: GREEN badge "FILED — [filingDate]"
- `not_required`: GREY badge "NOT REQUIRED"

Below the badge, render the deadline logic output (see Section 3.4 for calculation).

**Inline note below ITR Form selector:**
> "NRIs with Indian income from sources other than salary and one house property must file ITR-2. If you have business income from India, use ITR-3. ITR-1 (Sahaj) is not available to NRIs."

---

## 3. Calculations to implement

All calculations belong in `calc.js` as pure functions. They have zero DOM dependencies. The page (`india-tax` section in `tax.js`) calls them and renders the results. Add all the following functions to the bottom of `calc.js`, grouped under a `// ── India NRI Tax ──` comment block.

### 3.1 Section 80E deduction and tax saving

```js
/**
 * Calculates the Section 80E deduction and the resulting tax saving.
 *
 * Rules:
 * - Only available under the old tax regime.
 * - Deduction = full interest paid (no monetary cap per s.80E ITA 1961).
 * - The deduction reduces total Indian taxable income.
 * - Tax saving is estimated at the marginal rate applicable to the taxpayer's
 *   Indian taxable income slab (NRI, old regime).
 * - 8-year window: if deductionYearsUsed >= 8, deduction is zero.
 *
 * @param {object} indiaTax  - the fin_india_tax state object
 * @returns {{ deductionINR: number, taxSavingINR: number, marginalRatePct: number }}
 */
export function calc80EDeduction(indiaTax) {
  const sec80E = indiaTax.sec80E || {};

  // Guard: new regime, not claiming, or window exhausted
  if (
    indiaTax.taxRegime !== 'old' ||
    !sec80E.claimingDeduction ||
    (sec80E.deductionYearsUsed || 0) >= 8
  ) {
    return { deductionINR: 0, taxSavingINR: 0, marginalRatePct: 0 };
  }

  const deductionINR = sec80E.annualInterestPaidINR || 0;

  // Slab-taxable income for marginal rate estimation (before 80E).
  // Rental income uses taxable amount after 30% standard deduction u/s 24(a).
  // Dividend income excluded — it is taxed at flat rate u/s 115A, not slab rates.
  const grossIndiaIncome =
    (indiaTax.nroInterestIncomeINR || 0) +
    ((indiaTax.rentalIncomeINR || 0) * 0.70) +
    (indiaTax.otherIndiaIncomeINR || 0);

  // NRI old regime slabs (AY 2025-26, i.e. FY 2024-25):
  // No basic exemption limit for NRIs on NRO interest (NRO interest is not exempt).
  // However, NRIs do get the basic exemption of ₹2,50,000 against total Indian income.
  // Slabs (old regime):
  //   0 – 2,50,000:      0%
  //   2,50,001 – 5,00,000: 5%
  //   5,00,001 – 10,00,000: 20%
  //   Above 10,00,000:   30%
  // Surcharge applies above ₹50L (out of scope for most NRIs with small Indian income).
  // Health & Education Cess: 4% on income tax.

  const marginalRatePct = indiaMarginalRate(grossIndiaIncome);

  // Tax saving = deduction × marginal rate × (1 + cess rate)
  // Cess is 4%.
  const taxSavingINR = round2(deductionINR * (marginalRatePct / 100) * 1.04);

  return { deductionINR, taxSavingINR, marginalRatePct };
}

/**
 * Returns the marginal Income Tax rate (%) under India old regime for NRIs.
 * Does not include cess.
 * @param {number} totalIncomeINR
 * @returns {number} rate as percentage, e.g. 20
 */
export function indiaMarginalRate(totalIncomeINR) {
  if (totalIncomeINR <= 250000)  return 0;
  if (totalIncomeINR <= 500000)  return 5;
  if (totalIncomeINR <= 1000000) return 20;
  return 30;
}
```

### 3.2 Net India tax liability

```js
/**
 * Calculates India income tax on dividend income from Indian companies / equity MFs.
 *
 * s.115A — NRI dividend income taxed at flat 20% + 4% cess, not at progressive slab rates.
 * Dividend income is bifurcated from other income and taxed separately at this flat rate.
 * The basic exemption limit does NOT apply to this component.
 *
 * Effective combined rate: 20% × 1.04 = 20.8%.
 *
 * @param {number} dividendIncomeINR  - gross dividend income from Indian equities/MFs
 * @returns {number} tax in INR (inclusive of cess)
 */
export function calcDividendTax(dividendIncomeINR) {
  // s.115A — NRI dividend income taxed at flat 20% + 4% cess, not at progressive slab rates.
  return round2((dividendIncomeINR || 0) * 0.208); // 20% flat + 4% cess = 20.8%
}

/**
 * Calculates the net India income tax liability for an NRI
 * after applying TDS credit and DTAA foreign tax credit.
 *
 * Income bifurcation (BLOCKING FIX — CA review 2026-06-02):
 *   - NRO interest + (rental × 0.70) + other income → progressive slab rates via calcIndiaIncomeTax()
 *   - Dividend income → flat 20% + 4% cess via calcDividendTax() (s.115A)
 *   - Rental income: 30% standard deduction u/s 24(a) applied before slab entry.
 *     Taxable rental = rentalIncomeINR × 0.70.
 *
 * Formula:
 *   slabIncomeINR   = nroInterest + (rental × 0.70) + otherIncome - sec80EDeduction
 *   slabTaxINR      = calcIndiaIncomeTax(slabIncomeINR, regime) × 1.04  (incl. cess)
 *   dividendTaxINR  = calcDividendTax(dividendIncomeINR)                 (incl. cess)
 *   totalTaxINR     = slabTaxINR + dividendTaxINR
 *   afterTdsINR     = totalTaxINR - totalTdsINR
 *   netPayableINR   = afterTdsINR - dtaaReliefClaimedINR
 *   (floor at 0 — cannot be negative; excess TDS becomes a refund)
 *
 * Surcharge note: surcharge is not implemented. If total taxable income exceeds
 * ₹50,00,000, surcharge applies and this function will under-calculate tax.
 *
 * @param {object} indiaTax  - the fin_india_tax state object
 * @returns {{
 *   grossIndiaIncomeINR: number,
 *   rentalStdDeductionINR: number,
 *   taxableRentalIncomeINR: number,
 *   sec80EDeductionINR: number,
 *   slabTaxableIncomeINR: number,
 *   slabTaxINR: number,
 *   dividendTaxINR: number,
 *   grossTaxINR: number,
 *   cessINR: number,
 *   totalTaxBeforeCreditINR: number,
 *   totalTdsINR: number,
 *   afterTdsINR: number,
 *   dtaaReliefINR: number,
 *   netPayableINR: number,
 *   refundDueINR: number,
 *   effectiveRatePct: number,
 *   surchargeWarning: boolean
 * }}
 */
export function calcNetIndiaTax(indiaTax) {
  const nroInterest   = indiaTax.nroInterestIncomeINR || 0;
  const rentalGross   = indiaTax.rentalIncomeINR      || 0;
  const dividendIncome = indiaTax.dividendIncomeINR   || 0;
  const otherIncome   = indiaTax.otherIndiaIncomeINR  || 0;

  // Apply 30% standard deduction u/s 24(a) on rental income before slab entry.
  // Taxable rental income = gross rental × 0.70.
  const rentalStdDeductionINR  = round2(rentalGross * 0.30);
  const taxableRentalIncomeINR = round2(rentalGross * 0.70);

  // Gross income for display (uses gross rental — deduction shown separately)
  const grossIndiaIncomeINR = nroInterest + rentalGross + dividendIncome + otherIncome;

  // Section 80E (old regime only) — applied against slab income only (not dividends)
  const { deductionINR: sec80EDeductionINR } = calc80EDeduction(indiaTax);

  // Slab-taxable income: NRO interest + taxable rental (after 30% deduction) + other - 80E
  // Dividend income is bifurcated out and handled by calcDividendTax() below.
  const slabTaxableIncomeINR = Math.max(
    0,
    nroInterest + taxableRentalIncomeINR + otherIncome - sec80EDeductionINR
  );

  // Surcharge guard: surcharge is not implemented; warn if income exceeds ₹50L.
  // Extend calcIndiaIncomeTax with surcharge slabs if this threshold is breached.
  const surchargeWarning = (slabTaxableIncomeINR + dividendIncome) > 5000000;
  if (surchargeWarning) {
    console.warn(
      'calcNetIndiaTax: total taxable income exceeds ₹50L — surcharge not applied. Tax calculation is understated.'
    );
  }

  // Slab tax on (NRO interest + taxable rental + other income) — before cess
  const slabTaxBeforeCessINR = calcIndiaIncomeTax(slabTaxableIncomeINR, indiaTax.taxRegime || 'old');
  const slabCessINR          = round2(slabTaxBeforeCessINR * 0.04);
  const slabTaxINR           = round2(slabTaxBeforeCessINR + slabCessINR);

  // s.115A — NRI dividend income taxed at flat 20% + 4% cess, not at progressive slab rates.
  const dividendTaxINR = calcDividendTax(dividendIncome);

  // Combined tax (slab component + dividend flat rate component)
  // cessINR is embedded within both slabTaxINR and dividendTaxINR for clarity in the breakdown.
  const totalTaxBeforeCreditINR = round2(slabTaxINR + dividendTaxINR);

  // For backward-compatible return shape, expose grossTaxINR (pre-cess total) and cessINR separately.
  const grossTaxINR = round2(slabTaxBeforeCessINR + (dividendIncome * 0.20));
  const cessINR     = round2(totalTaxBeforeCreditINR - grossTaxINR);

  // Total TDS already deducted
  const totalTdsINR =
    (indiaTax.tdsOnNroInterestINR || 0) +
    (indiaTax.tdsOnRentalINR      || 0) +
    (indiaTax.tdsOnDividendINR    || 0) +
    (indiaTax.tdsOtherINR         || 0);

  // After TDS credit
  const afterTdsINR = round2(totalTaxBeforeCreditINR - totalTdsINR);

  // DTAA foreign tax credit (only if Form 67 filed and relief claimed)
  const dtaaReliefINR = (indiaTax.dtaa?.dtaaReliefClaimed && indiaTax.dtaa?.form67Filed)
    ? (indiaTax.dtaa?.dtaaReliefClaimedINR || 0)
    : 0;

  // Net payable (floor at 0; negative means refund)
  const rawNet = round2(afterTdsINR - dtaaReliefINR);
  const netPayableINR = Math.max(0, rawNet);
  const refundDueINR  = rawNet < 0 ? Math.abs(rawNet) : 0;

  // Effective rate on gross income
  const effectiveRatePct = grossIndiaIncomeINR > 0
    ? round2((totalTaxBeforeCreditINR / grossIndiaIncomeINR) * 100)
    : 0;

  // Section 80TTA and 80TTB are not applicable to NRIs on NRO interest income and are intentionally excluded.

  return {
    grossIndiaIncomeINR,
    rentalStdDeductionINR,
    taxableRentalIncomeINR,
    sec80EDeductionINR,
    slabTaxableIncomeINR,
    slabTaxINR,
    dividendTaxINR,
    grossTaxINR,
    cessINR,
    totalTaxBeforeCreditINR,
    totalTdsINR,
    afterTdsINR,
    dtaaReliefINR,
    netPayableINR,
    refundDueINR,
    effectiveRatePct,
    surchargeWarning,
  };
}

/**
 * Computes India income tax on a given slab-taxable income under the specified regime.
 * NRI slab rates — FY 2024-25 (AY 2025-26).
 * Does NOT include cess.
 *
 * IMPORTANT: Do NOT pass dividend income to this function.
 * Dividend income from Indian companies/MFs is taxed at a flat 20% u/s 115A (not slab rates)
 * and must be processed via calcDividendTax() separately. See calcNetIndiaTax() for the
 * correct bifurcation logic.
 *
 * Old regime slabs:
 *   0 – 2,50,000: 0%
 *   2,50,001 – 5,00,000: 5%
 *   5,00,001 – 10,00,000: 20%
 *   Above 10,00,000: 30%
 *
 * New regime slabs (NRI, FY 2024-25 post-Budget):
 *   0 – 3,00,000: 0%
 *   3,00,001 – 7,00,000: 5%
 *   7,00,001 – 10,00,000: 10%
 *   10,00,001 – 12,00,000: 15%
 *   12,00,001 – 15,00,000: 20%
 *   Above 15,00,000: 30%
 * Note: Rebate u/s 87A is NOT available to NRIs.
 *
 * @param {number} taxableIncomeINR
 * @param {'old'|'new'} regime
 * @returns {number} tax in INR (before cess)
 */
export function calcIndiaIncomeTax(taxableIncomeINR, regime) {
  if (regime === 'new') {
    return calcSlabTax(taxableIncomeINR, [
      { upTo: 300000,  rate: 0   },
      { upTo: 700000,  rate: 0.05 },
      { upTo: 1000000, rate: 0.10 },
      { upTo: 1200000, rate: 0.15 },
      { upTo: 1500000, rate: 0.20 },
      { upTo: Infinity,rate: 0.30 },
    ]);
  }
  // Old regime (default)
  return calcSlabTax(taxableIncomeINR, [
    { upTo: 250000,  rate: 0    },
    { upTo: 500000,  rate: 0.05 },
    { upTo: 1000000, rate: 0.20 },
    { upTo: Infinity,rate: 0.30 },
  ]);
}

/**
 * Generic slab tax calculator.
 * @param {number} income
 * @param {{ upTo: number, rate: number }[]} slabs - ordered ascending by upTo
 * @returns {number} tax
 */
export function calcSlabTax(income, slabs) {
  let tax = 0;
  let prev = 0;
  for (const slab of slabs) {
    if (income <= prev) break;
    const taxable = Math.min(income, slab.upTo) - prev;
    tax += taxable * slab.rate;
    prev = slab.upTo;
  }
  return round2(tax);
}
```

### 3.3 Total cross-border tax position

```js
/**
 * Calculates the total tax paid on Indian-sourced income across both jurisdictions.
 *
 * Formula:
 *   indiaTaxGBP   = netPayableINR / inrGbpRate
 *   totalCrossBorderGBP = ukTaxOnIndiaIncomeGBP + indiaTaxGBP
 *
 * This represents the combined tax cost of earning Indian income, in GBP.
 * The DTAA is designed to prevent double taxation; this figure shows
 * what the actual combined burden is after all reliefs.
 *
 * @param {object} indiaTax       - fin_india_tax state
 * @param {number} inrGbpRate     - from fin_settings.inrGbpRate
 * @returns {{
 *   netIndiaTaxGBP: number,
 *   ukTaxOnIndiaIncomeGBP: number,
 *   totalCrossBorderGBP: number,
 *   crossBorderEffectiveRatePct: number
 * }}
 */
export function calcCrossBorderPosition(indiaTax, inrGbpRate) {
  const rate = (inrGbpRate && inrGbpRate > 0) ? inrGbpRate : 83;
  const { netPayableINR, grossIndiaIncomeINR } = calcNetIndiaTax(indiaTax);

  const netIndiaTaxGBP = round2(netPayableINR / rate);
  const ukTaxOnIndiaIncomeGBP = indiaTax.dtaa?.ukTaxPaidOnIndiaIncomeGBP || 0;
  const totalCrossBorderGBP = round2(netIndiaTaxGBP + ukTaxOnIndiaIncomeGBP);

  const grossIndiaIncomeGBP = round2(grossIndiaIncomeINR / rate);
  const crossBorderEffectiveRatePct = grossIndiaIncomeGBP > 0
    ? round2((totalCrossBorderGBP / grossIndiaIncomeGBP) * 100)
    : 0;

  return {
    netIndiaTaxGBP,
    ukTaxOnIndiaIncomeGBP,
    totalCrossBorderGBP,
    crossBorderEffectiveRatePct,
  };
}
```

### 3.4 ITR deadline alert logic

```js
/**
 * Returns the ITR filing deadline and alert state for the current AY.
 *
 * Rules (India Income Tax Act):
 * - Normal (non-audit) deadline: 31 July of the AY
 *   e.g. AY 2025-26 → 31 July 2025
 * - Audit case deadline: 31 October of the AY
 * - "AY YYYY-YY" format: the first YYYY is the AY calendar year.
 *   e.g. AY 2025-26 → year = 2025
 *
 * Alert states:
 *   'filed'        — ITR already filed (green)
 *   'not_required' — not required (grey)
 *   'ok'           — not filed, deadline > 30 days away (neutral)
 *   'warning'      — not filed, 1–30 days to deadline (amber)
 *   'overdue'      — not filed, deadline passed (red)
 *
 * @param {object} itr        - indiaTax.itr
 * @param {string} today      - ISO date string YYYY-MM-DD
 * @returns {{
 *   deadline: Date,
 *   deadlineISO: string,
 *   daysToDeadline: number,
 *   alertState: 'filed'|'not_required'|'ok'|'warning'|'overdue',
 *   deadlineLabel: string
 * }}
 */
export function calcITRDeadline(itr, today) {
  if (itr.filingStatus === 'filed') {
    return { deadline: null, deadlineISO: '', daysToDeadline: 0, alertState: 'filed', deadlineLabel: 'Filed' };
  }
  if (itr.filingStatus === 'not_required') {
    return { deadline: null, deadlineISO: '', daysToDeadline: 0, alertState: 'not_required', deadlineLabel: 'Not required' };
  }

  // Parse AY year from assessmentYear string e.g. 'AY 2025-26' → 2025
  const ayMatch = (itr.assessmentYear || '').match(/AY\s+(\d{4})/);
  const ayYear = ayMatch ? parseInt(ayMatch[1], 10) : new Date().getFullYear();

  const deadlineMonth = itr.isAuditCase ? 9 : 6; // October = 9, July = 6 (0-indexed)
  const deadline = new Date(ayYear, deadlineMonth, 31);
  const deadlineISO = deadline.toISOString().slice(0, 10);
  const todayDate = new Date(today);
  const daysToDeadline = Math.round((deadline - todayDate) / 86400000);

  let alertState;
  if (daysToDeadline < 0)  alertState = 'overdue';
  else if (daysToDeadline <= 30) alertState = 'warning';
  else alertState = 'ok';

  const deadlineLabel = deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return { deadline, deadlineISO, daysToDeadline, alertState, deadlineLabel };
}
```

---

## 4. Data flow

### 4.1 State key

The new state key is `indiaTax`. It is loaded by `initPage('tax')` alongside all other keys in `loadAll()`. No new page-init file is needed — the existing `tax.js` page receives it as `state.indiaTax`.

The `initPage` function in `page-init.js` calls `loadAll()`, which already loads all keys in the `KEYS` array. Adding `fin_india_tax` to that array is the only change needed in `store.js` and `page-init.js`.

In `tax.js`, access the new data as:
```js
const it = st.indiaTax || {};
```

Save changes with:
```js
await saveSec('fin_india_tax', st.indiaTax);
```

### 4.2 Cross-page references

The following pages should reference `indiaTax` data after this module is built:

**Net Worth page (`networth.html` / `networth.js`):**
- Add a "India Tax Liability" liability line below the SBI loan: `netPayableINR / inrGbpRate` converted to GBP. Label it "India Tax Payable (est.)". Only show if `netPayableINR > 0`.
- This prevents the net worth from being overstated by not accounting for a pending Indian tax payment.

**Analytics page (`analytics.html` / `analytics.js`):**
- Add an "India Tax Position" summary card to the analytics overview: shows gross India income (GBP equiv), total tax paid (both jurisdictions, GBP), and effective cross-border rate.
- Optionally include a donut chart showing the split of the cross-border tax burden (India portion vs UK portion).

**Dashboard / summary page (if it exists):**
- If there is an ITR deadline within 60 days, surface an alert banner on the main dashboard. Use `calcITRDeadline()` to determine whether to show it.

### 4.3 Exchange rate source

The India tax module must use `state.settings.inrGbpRate` (from `fin_settings`) for all INR/GBP conversions displayed to the user on screen. It must NOT hardcode 83 as a rate anywhere in the rendering logic.

The DTAA section uses a separate `dtaa.rbiRateUsed` field for Form 67 calculations only, because the RBI TT buying rate on the date of payment is the legally mandated rate for foreign tax credit claims, and it will differ from the current dashboard rate.

---

## 5. Implementation order

### Phase 1 — Data and static display (build this first)

**Goal:** Get the data structure in place and render inputs with no calculations yet.

1. Add `fin_india_tax` default object to `defaults.js` exactly as specified in Section 1.2.
2. Add `fin_india_tax` to `KEYS`, `camelMap`, and `reverseMap` in `store.js`.
3. Add the jurisdiction divider and all four input panels to `tax.html` (the HTML skeleton only — `<div id="india-income-fields"></div>` etc.).
4. In `tax.js`, after the existing `render()` call, add `renderIndia(state)`.
5. Implement `renderIndia(st)` to render all input fields with `bindIndiaFields()` (mirror the pattern of `bindTaxFields()` in the existing code).
6. Implement `bindIndiaFields()` to save changes via `saveSec('fin_india_tax', st.indiaTax)` on every `change` event.
7. Verify: entering values in all fields persists correctly through a page reload.

**Acceptance test for Phase 1:** All fields are editable. Data survives page reload. No calculations yet.

### Phase 2 — Calculations and summary cards (build second)

**Goal:** All formulas produce correct output.

1. Add the calculation functions to `calc.js` in the order listed in Section 3: `calc80EDeduction`, `indiaMarginalRate`, `calcDividendTax`, `calcNetIndiaTax`, `calcIndiaIncomeTax`, `calcSlabTax`, `calcCrossBorderPosition`, `calcITRDeadline`.
2. Import them into `tax.js`.
3. Implement the four summary cards (Section 2.3) by calling the calc functions and passing results to `renderIndiaSummaryCards()`.
4. Implement the Section 80E calculated outputs panel (deduction amount, tax saving, years remaining).
5. Implement the DTAA calculated outputs (UK tax in INR equiv, net India tax, cross-border net).
6. Implement the ITR deadline status badge and countdown.
7. Write manual test cases (see below) and verify each formula.

**Manual test cases for Phase 2:**

| Scenario | Input | Expected output |
|---|---|---|
| NRO interest ₹50,000, TDS ₹15,000, old regime, no 80E | grossIncome=50000, tdsNro=15000 | grossTax = ₹0 (below exemption limit 2.5L). netPayable = ₹0. Refund = ₹15,000 |
| NRO interest ₹3,00,000, old regime, no 80E, no DTAA | nroInterest=300000, rental=0, dividend=0 | slabTaxableIncome=300000. slab: (3L-2.5L)×5% = ₹2,500. cess = ₹100. total = ₹2,600 |
| Same as above but 80E interest paid ₹80,000 | deduction=80000, slabTaxableIncome=220000 | slabTaxableIncome < 2.5L → slabTax = ₹0. taxSaving = ₹2,600 (saving the entire tax) |
| NRO interest ₹6,00,000, old regime, 80E ₹1,00,000, TDS ₹1,80,000 | rental=0, dividend=0 | slabTaxable = 5L. slabTax = ₹12,500. cess = ₹500. total = ₹13,000. afterTds = 13,000-1,80,000 = negative → refund ₹1,67,000 |
| Rental ₹2,00,000 gross, old regime, no other income, no TDS | rentalGross=200000, nroInterest=0 | taxableRental = 200000×0.70 = 140000. slabTaxable=140000 < 2.5L → slabTax=₹0. netPayable=₹0 |
| Dividend ₹5,00,000, old regime, no other income, no TDS | dividendIncome=500000, nroInterest=0, rental=0 | slabTax=₹0 (no slab income). dividendTax=500000×0.208=₹1,04,000. netPayable=₹1,04,000 |
| NRO interest ₹4,00,000 + rental ₹2,00,000 gross + dividend ₹1,00,000, old regime | — | taxableRental=140000. slabTaxable=400000+140000=540000. slabTax=(540000-250000)×5%+(40000×0%)=₹14,500. slabCess=₹580. slabTotal=₹15,080. dividendTax=100000×0.208=₹20,800. totalTax=₹35,880 |
| ITR deadline: AY 2025-26, non-audit, today = 2026-06-02 | isAuditCase=false | deadline = 31 Jul 2025. daysToDeadline = negative → alertState = 'overdue' |
| ITR deadline: AY 2026-27, non-audit, today = 2026-06-02 | isAuditCase=false | deadline = 31 Jul 2026. daysToDeadline ≈ 59 → alertState = 'warning' |

### Phase 3 — Cross-page integration and polish (build last)

**Goal:** India tax data is visible across the dashboard and UX is production-quality.

1. Net Worth page: add "India Tax Payable (est.)" liability line when `netPayableINR > 0`.
2. Analytics page: add India tax summary card.
3. Dashboard ITR deadline alert banner (if deadline is within 60 days).
4. Regime toggle behaviour: when taxRegime switches to 'new', grey out the 80E panel and show the warning banner. Confirm re-enabling 'old' restores the panel.
5. TDS validation: add inline error message if TDS field value exceeds the corresponding income field.
6. `deductionYearsRemaining` auto-calculation: recompute and update display whenever `deductionYearsUsed` changes.
7. Form 67 date validation: warn if `form67FilingDate` is after `itr.filingDate`.
8. Accessibility: all input fields must have matching `<label for="">` attributes. All status badges must have `aria-label`.
9. Mobile layout: the `grid-4` summary cards collapse to `grid-2` on screens below 600px. Input grids collapse to single-column.
10. CA Arjun Mehta review: share the Phase 3 implementation for final review before the feature is considered done. CA must confirm slab rates, cess treatment, 80E rules, and Form 67 requirements are correctly implemented.

---

## 6. Constraints and notes for CA Arjun Mehta's review

The following items require CA confirmation before implementation proceeds:

1. **Slab rates for AY 2025-26 (new regime):** The specification uses the post-Budget 2024 new regime slabs. CA must confirm these are the correct slabs effective for AY 2025-26, particularly the ₹3L–₹7L at 5% band.

2. **NRE vs NRO treatment:** The specification only tracks NRO interest income. NRE account interest is excluded because it is tax-exempt in India for NRIs. CA should confirm this is still the correct treatment and that no TDS is deducted on NRE interest.

3. **80E first year of claim:** The dashboard shows `deductionAY1` as user-entered. CA should advise on how to determine Year 1: is it the AY in which the loan repayment begins, or the AY in which the moratorium ends?

4. **DTAA relief method vs exemption method:** The India-UK DTAA uses the credit method (Article 25(2)(a)). The specification implements a credit (not exemption) approach. CA to confirm.

5. **Surcharge applicability:** The specification omits surcharge (15% on tax if income > ₹50L, 25% if > ₹1Cr) on the grounds that the taxpayer's Indian income is likely below ₹50L. If this assumption is wrong, `calcIndiaIncomeTax` must be extended with surcharge slabs. CA to advise.

6. **Section 80TTA / 80TTB:** NRO savings account interest may be eligible for deduction u/s 80TTA (up to ₹10,000) under the old regime. CA to advise whether this should be included as an additional deduction field in a future version.

7. **DTAA Form 67 exchange rate:** The specification uses `dtaa.rbiRateUsed` as user-entered. CA to advise whether the correct rate is the RBI TT buying rate, TT selling rate, or the average of the two for Form 67 purposes.

---

## 7. Files to create or modify

| Action | File | Change |
|---|---|---|
| MODIFY | `src/projects/financial-dashboard/js/defaults.js` | Add `fin_india_tax` object (Section 1.2) |
| MODIFY | `src/projects/financial-dashboard/js/store.js` | Add to KEYS, camelMap, reverseMap |
| MODIFY | `src/projects/financial-dashboard/tax.html` | Add India section HTML (Section 2) |
| MODIFY | `src/projects/financial-dashboard/js/pages/tax.js` | Add renderIndia(), bindIndiaFields() |
| MODIFY | `src/projects/financial-dashboard/js/calc.js` | Add 7 new pure functions (Section 3) |
| MODIFY | `src/projects/financial-dashboard/js/pages/networth.js` | Add India tax liability line (Phase 3) |
| MODIFY | `src/projects/financial-dashboard/js/pages/analytics.js` | Add India tax card (Phase 3) |
| CREATE | None | No new files needed |

---

*This specification is complete as of 2026-06-02. It is ready for CA Arjun Mehta's review. The developer should not begin Phase 2 or Phase 3 until CA sign-off is received on the items listed in Section 6.*

---

## 8. Amendment log

### v1.1 — 2026-06-02 — CA Review Amendments (Tax Accountant)

**Amended by:** Tax Accountant, following CA Arjun Mehta's review (CA_NRI_SPEC_REVIEW.md, 2026-06-02).

**Blocking fixes (Phase 2 was on HOLD pending these):**

1. **BLOCKING FIX — Rental income 30% standard deduction u/s 24(a):**
   - `calcNetIndiaTax` now computes taxable rental income as `rentalIncomeINR × 0.70` before passing to slab calculator. Previously, gross rental was passed directly — this overstated tax.
   - `rentalIncomeINR` field in Section 1 now documented as "Gross rental received — 30% standard deduction u/s 24(a) applied automatically before slab calculation."
   - `calc80EDeduction` marginal rate estimator also updated to use `rentalIncomeINR × 0.70` for consistency.
   - Section 2.4 UI help text updated to note the 30% deduction.

2. **BLOCKING FIX — Dividend income flat rate u/s 115A:**
   - New function `calcDividendTax(dividendIncomeINR)` added to Section 3.2. Returns `dividendIncomeINR × 0.208` (flat 20% + 4% cess). Function comment explains: "s.115A — NRI dividend income taxed at flat 20% + 4% cess, not at progressive slab rates."
   - `calcNetIndiaTax` now bifurcates: slab rates applied only to (NRO interest + taxable rental + other income); flat rate applied only to dividend income via `calcDividendTax()`; both components summed for total tax.
   - `calcIndiaIncomeTax` JSDoc updated with explicit warning not to pass dividend income to this function.
   - Section 1 `dividendIncomeINR` field comment updated to document s.115A treatment.
   - Section 2.4 UI help text for dividend field updated to note flat 20% rate.
   - Return shape of `calcNetIndiaTax` extended with `rentalStdDeductionINR`, `taxableRentalIncomeINR`, `slabTaxableIncomeINR`, `slabTaxINR`, `dividendTaxINR`, `surchargeWarning`.

**Minor amendments from CA review (all required):**

3. **Q3 — 80E Year 1 guidance (Section 2.6):** `deductionAY1` field now carries full guidance text explaining that Year 1 is the AY of first interest payment, not moratorium end date. Sourced from SBI loan statement.

4. **Q4 — Form 67 timing correction (Section 2.7):** Warning banner text corrected from "before submitting your ITR" to "on or before the ITR filing due date (31 July for non-audit cases)." The distinction matters: filing Form 67 and ITR on the same day (both before due date) is permissible; filing Form 67 after the due date is not.

5. **Q5 — Surcharge warning banner (Sections 2.7 and 3.2):** Surcharge warning banner added to Section 2.7 (shown when total Indian income > ₹50L). `calcNetIndiaTax` now includes `surchargeWarning` boolean and `console.warn` guard when income exceeds ₹50,00,000, as required by CA.

6. **Q2 — NRE interest UI guidance (Section 2.4):** `nroInterestIncomeINR` field in Section 1 and Section 2.4 UI table now explicitly states that NRE account interest is tax-exempt u/s 10(4)(ii) IT Act 1961 and must not be included.

7. **Q7 — Form 67 RBI rate date rule (Section 2.7):** `dtaa.rbiRateUsed` field description in Section 2.7 input table now documents Rule 128(3) of the IT Rules 1962: applicable date is the last day of the month preceding the month in which UK tax was paid. SBI historical treasury rates is the mandated source.

**Additional corrections applied from CA observations:**

8. **Observation 6 — HMRC Notice label corrected (Section 2.8):** Field label changed from "HMRC Notice Received?" to "Income Tax Notice Received (India)?" with help text referencing s.143(1) intimation and s.143(2) scrutiny notices. HMRC is a UK authority and had no place in the India ITR filing tracker.

9. **80TTA/80TTB exclusion comment (Section 3.2):** Added code comment in `calcNetIndiaTax` confirming 80TTA and 80TTB are intentionally excluded for NRIs.

10. **Manual test cases updated (Section 5):** Phase 2 test cases revised to reflect corrected formulas — rental now tested with 30% deduction applied, dividend now tested as flat-rate component. Three new test cases added.

**Status after v1.1:** Both blocking issues resolved. Spec ready for CA second review. Phase 2 coding may proceed upon CA sign-off.
