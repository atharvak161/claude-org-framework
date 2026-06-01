# Tax Section Review — Financial Dashboard
**Reviewer:** Tax Accountant (Specialist Finance Agent)
**Date:** 2026-06-01
**Files reviewed:** tax.js, tax.html, income.js, income.html, calc.js (calculateNetPay)

---

## 1. UK PAYE Calculation — Is It Now Correct?

The recent fix to `calculateNetPay()` in `calc.js` is a substantial improvement over what was presumably a flat-rate approximation. Here is a full verification of the implementation against 2024/25 HMRC rules:

### What is correct

**Personal Allowance:** Standard PA of £12,570 is correctly defaulted. The taper above £100,000 is implemented correctly — £1 of PA lost for every £2 of income over £100k, flooring at zero. This is accurate per s.35 ITA 2007.

**Salary sacrifice pension treatment:** Pension contributions on the base salary are correctly subtracted from both taxable pay and NIable pay before band calculations. This is correct for a net-pay or salary sacrifice arrangement, which is how most workplace pensions operate.

**Income Tax bands (2024/25):**
- Basic rate: 20% from PA to £50,270 — correct
- Higher rate: 40% from £50,270 to £125,140 — correct
- Additional rate: 45% above £125,140 — correct
- The band widths are computed relative to the actual PA (`basicBandMax = 50270 - pa`), which is the right approach for non-standard tax codes

**National Insurance (employee):**
- 8% on £12,570–£50,270 — correct (post-January 2024 reduction from 12%)
- 2% above £50,270 — correct (upper earnings limit)
- NI thresholds are applied to `adjustedGross` (post-pension-sacrifice) — correct

### What is not fully correct or is missing

**The income.js waterfall hardcodes "Income Tax (20%)" as the label.** The display label on line 43 of income.js reads `Income Tax (20%)` regardless of what band the user falls into. If salary is £55,000 or £65,000 (both scenario-table values), the marginal rate is 40%, yet the label still says 20%. This is misleading and should be dynamic based on the actual effective rate computed.

**Overtime is included in the tax base inconsistently.** `annualGross` includes both base and overtime (`(baseMonthly + avgOvertimeMonthly) * 12`). However, `annualPension` is only calculated on `baseSalaryGBP`. This is correct IF the pension scheme excludes overtime from pensionable pay, which is the most common arrangement — but the dashboard has no field to indicate whether overtime is pensionable. If the employer's scheme includes overtime in pensionable pay, the calculation will understate the pension deduction and overstate taxable income.

**Scottish taxpayers:** The calculation uses rUK rates. If the taxpayer relocates to Scotland (a meaningful scenario for a young professional), Scottish bands (19%/20%/21%/42%/45%/48%) would apply. No flag exists in the settings for Scottish vs rUK tax residency.

**Tax code other than 1257L:** The `taxFreeAllowanceAnnual` field allows a custom allowance, which is good. However, if a user enters tax code 1034L (which is what is shown in the tracker — the underpayment code), the dashboard has no mechanism to parse the code format and derive the allowance automatically. The user must manually calculate £10,340 and enter it. A simple parser for numeric tax codes (`code * 10 = allowance`) would eliminate this manual step.

**Student Loan repayments:** No field exists for Plan 1, Plan 2, Plan 4, or Plan 5 student loan. These are statutory deductions that appear on every UK payslip for qualifying employees and can be material (9% of income above threshold). Their absence means the net take-home figure will be overstated for a large proportion of younger UK earners.

**Assessment of the fix overall:** The mathematical core is now correct for a standard 1257L taxpayer in England earning under £100,000. The previous flat-rate version would have been significantly wrong at higher salaries. The fix is sound. Rating the calculation engine itself: 8/10.

---

## 2. Tax Tracker — Is It Tracking the Right Things for HMRC Compliance?

The tax tracker is purpose-built around one specific situation: tax code 1034L resulting from a PAYE underpayment being collected via a reduced personal allowance. It does that one job adequately. However, reviewed against full HMRC compliance requirements, it is narrow.

### What it does well
- Tracks the specific underpayment total, monthly deduction, and time-to-clear correctly
- The `taxTrackerProgress()` function correctly calculates months elapsed, collected, and remaining
- The 12-month calendar grid with click-to-verify is a practical tool for payslip reconciliation
- Connecting the underpayment end date to the income section (`underpaymentClearsDate`) is a good cross-page link

### What it is missing for HMRC compliance

**No P60 / P45 tracking.** There is no section to record end-of-year P60 figures, which are the definitive HMRC record. A UK taxpayer should be comparing dashboard figures against their P60 each April.

**No tax year boundary awareness.** The UK tax year runs 6 April to 5 April. The tracker starts from a user-entered date with no awareness of tax year boundaries. If the underpayment straddles two tax years, the tracker cannot model this. The hardcoded start date default of `2026-04-06` does align with the new tax year — a good implicit assumption — but the system does not enforce or explain it.

**No Simple Assessment / P800 tracking.** HMRC issues P800 notices or Simple Assessments when they believe tax has been over or underpaid. The tracker has no field to log whether a P800 has been received, its amount, or whether it has been agreed or disputed.

**No benefits-in-kind tracking.** If the taxpayer receives any taxable benefits (company car, private medical, interest-free loans above £10,000), these affect the tax code and would not appear anywhere in the dashboard.

**No Marriage Allowance or Blind Person's Allowance fields.** These are common adjustments that change the PA and therefore the effective tax code.

---

## 3. What Is Missing for a UK Taxpayer Who Also Has Indian Income?

This is the most significant gap in the tax section. A UK-resident individual who also has income sources in India is in a more complex tax position than the dashboard currently contemplates.

### India-UK Double Taxation Agreement (DTA)

The UK-India DTA (1993, updated) determines which country has primary taxing rights and how credit for foreign tax paid is given. The dashboard has no concept of this.

**What is missing:**

**Foreign Income Declaration fields.** There is no place to record Indian income sources: salary from an Indian employer (while working remotely or on secondment), rental income from Indian property, dividend income from Indian equities or mutual funds, interest from NRE/NRO/FCNR accounts, or ULIP maturity proceeds deemed as income.

**Note on NRE/NRO interest:** NRE account interest is exempt from Indian tax but is taxable in the UK for UK residents. NRO interest is taxable in both countries (subject to DTA credit). The dashboard tracks ULIPs as assets but does not address their UK tax treatment.

**Foreign Tax Credit (FTC) section.** Where Indian TDS (Tax Deducted at Source) has been withheld on Indian income, the taxpayer can claim credit against their UK liability. This requires knowing the Indian TDS amounts, which the dashboard does not track.

**Remittance Basis:** If the taxpayer is a non-domiciled UK resident, the remittance basis of taxation may be available, affecting whether unremitted Indian income is taxable in the UK. The dashboard has no domicile/residency status field.

**DTAA Article 16 (employment income):** If any income is earned for work performed in India while UK-resident, the split between UK and India taxing rights needs to be determined. No fields exist for days-in-India or income attribution.

---

## 4. Self Assessment Fields That Should Be Added

The following Self Assessment (SA100 and supplementary pages) fields are missing and relevant to this taxpayer's profile:

**SA100 — Main return**
- Residency status (UK resident / non-domiciled / split year)
- Date of arrival in UK (relevant for split-year treatment)
- Student loan plan type and repayments

**SA102 — Employment (already partially covered but missing)**
- Employer PAYE reference (for cross-reference with HMRC records)
- P60 gross pay and tax deducted (for year-end reconciliation)
- Benefits in kind values (P11D)
- Lump sum payments / redundancy

**SA106 — Foreign income**
- Country of source (India)
- Foreign employment income
- Foreign pension income
- Foreign savings and investment income (NRO interest, dividends)
- Foreign tax paid (TDS amounts)
- DTAA relief claimed

**SA108 — Capital Gains**
- Disposal of Indian property
- Disposal of Indian shares/mutual funds (ELSS, equity funds)
- ULIP surrenders (if treated as investment bonds)
- Foreign capital gains and CGT annual exempt amount (£3,000 for 2024/25)

**SA109 — Residence, remittance basis, domicile**
- Days in UK
- Days in India
- Domicile status
- Remittance basis claim (if applicable)

---

## 5. Tax Section Rating

**Overall rating: 5/10**

**Strengths:**
- The PAYE calculation engine (calc.js) is now mathematically correct for standard UK employment income — the recent fix was material and correct
- The underpayment tracker is well-designed for its specific purpose
- The payslip verification calendar is a genuinely useful operational tool
- Cross-linking the underpayment end date to income projections shows good systems thinking

**Weaknesses:**
- Scope is too narrow for the taxpayer's actual situation: UK employment income only, no Indian income, no Self Assessment structure
- Missing: student loans, benefits in kind, P60 reconciliation, P800 tracking
- Missing: all cross-border tax fields (SA106, FTC, DTA awareness)
- The "Income Tax (20%)" hardcoded label is incorrect at higher salary scenarios
- No tax year boundary logic — the system does not know what a UK tax year is
- No Scottish taxpayer support
- For a taxpayer holding ULIPs (Indian insurance products), there is no guidance or field for the UK tax treatment of ULIP proceeds (likely taxed as chargeable event gains under s.507 ITTOIA 2005)

The core PAYE engine is now fit for purpose. The surrounding tax compliance infrastructure is not. This should be a priority area for the next development sprint.
