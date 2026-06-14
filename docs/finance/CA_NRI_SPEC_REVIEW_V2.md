# CA Review v2 — India NRI Tax Module Spec
# Date: 2026-06-02

Reviewer: CA Arjun Mehta
Spec version reviewed: v1.1 (2026-06-02)
Previous review: docs/finance/CA_NRI_SPEC_REVIEW.md

---

## Blocking fixes — verification

### Fix 1 (Rental income s.24(a)): VERIFIED

The fix is correctly applied in all three locations where it needed to appear:

- `calcNetIndiaTax`: computes `rentalStdDeductionINR = rentalGross × 0.30` and `taxableRentalIncomeINR = rentalGross × 0.70`. Only `taxableRentalIncomeINR` is passed to the slab calculator. The gross rental figure is retained separately for display purposes only. This is the correct treatment.
- `calc80EDeduction`: the marginal rate estimator now uses `(rentalIncomeINR × 0.70)` when building `grossIndiaIncome` for slab band estimation. Consistent with the fix above.
- Section 1.2 field comment and Section 2.4 UI help text: both now document the 30% standard deduction applied automatically. Field is correctly labelled as "gross rental received."

The previous error (passing gross rental to the slab calculator, overstating taxable income by up to 30% of rental) is resolved.

### Fix 2 (Dividend s.115A): VERIFIED

The fix is correctly applied across all required locations:

- `calcDividendTax()` exists as a standalone exported function. Returns `(dividendIncomeINR || 0) × 0.208`. Rate comment is correct: 20% flat + 4% cess = 20.8% effective. Function signature and JSDoc are clear.
- `calcNetIndiaTax`: bifurcation is correctly implemented. `dividendIncome` is extracted from the state object but explicitly excluded from `slabTaxableIncomeINR`. Dividend tax is computed separately via `calcDividendTax(dividendIncome)` and then summed with `slabTaxINR` to produce `totalTaxBeforeCreditINR`. Dividend income does not enter `calcIndiaIncomeTax()` at any point.
- `calcIndiaIncomeTax`: JSDoc now carries an explicit warning — "Do NOT pass dividend income to this function" — with a reference to `calcNetIndiaTax()` for correct usage. This is good defensive documentation.
- Section 1.2 `dividendIncomeINR` field comment and Section 2.4 UI help text both now document s.115A flat rate treatment.

The previous error (dividend income entering progressive slab rates, materially understating tax for NRIs with dividend income) is resolved.

---

## Minor amendments — verification

**Amendment 3 — 80E Year 1 guidance (Section 2.6):** VERIFIED. The `deductionAY1` field now carries complete help text: Year 1 is the AY of first interest payment to the lender; moratorium capitalisation does not start the clock; SBI loan statement is the source document. This is the correct guidance.

**Amendment 4 — Form 67 timing correction (Section 2.7):** VERIFIED. Warning banner now reads "on or before the ITR filing due date (31 July for non-audit cases)" rather than the vague "before submitting your ITR." The distinction between filing Form 67 before the due date versus before the ITR date is legally significant and is now correctly stated.

**Amendment 5 — Surcharge warning banner (Sections 2.7 and 3.2):** VERIFIED. Section 2.7 now shows a surcharge warning banner when total Indian income exceeds ₹50,00,000. `calcNetIndiaTax` includes a `surchargeWarning` boolean in its return shape and a `console.warn` when the threshold is breached. The threshold (₹50L) is correct for the 10% surcharge band applicable to AY 2025-26.

**Amendment 6 — NRE interest UI guidance (Section 2.4):** VERIFIED. The `nroInterestIncomeINR` field in both Section 1.2 and the Section 2.4 UI table now explicitly states that NRE account interest is tax-exempt u/s 10(4)(ii) of the IT Act 1961 and must not be included. This is correct and important — it prevents double-counting and erroneous tax overstatement.

**Amendment 7 — Form 67 RBI rate date rule (Section 2.7):** VERIFIED. The `dtaa.rbiRateUsed` field now documents Rule 128(3) of the IT Rules 1962: the applicable date is the last day of the month preceding the month in which the UK tax was paid. SBI historical treasury rates is cited as the mandated source. The instruction to not use `fin_settings` exchange rate is retained. This is precise and correct.

All 5 minor amendments are present and correctly applied in the spec text.

---

## Additional observations (non-blocking)

Two further corrections from my first review have also been applied cleanly:

- The "HMRC Notice Received?" label in Section 2.8 is corrected to "Income Tax Notice Received (India)?" with help text referencing s.143(1) intimation and s.143(2) scrutiny notices. This is correct.
- `calcNetIndiaTax` now includes a code comment confirming 80TTA and 80TTB are intentionally excluded for NRIs on NRO interest income. This is correct — NRIs are not eligible for 80TTA/80TTB relief.

The manual test cases in Section 5 have been updated to reflect the corrected formulas. I have spot-checked three of the seven cases:

- Rental ₹2,00,000 gross, no other income: taxable rental = ₹1,40,000, below ₹2.5L exemption, netPayable = ₹0. Correct.
- Dividend ₹5,00,000, no other income: slabTax = ₹0, dividendTax = ₹1,04,000. Correct.
- Mixed case (NRO ₹4L + rental ₹2L gross + dividend ₹1L): taxable rental = ₹1,40,000, slabTaxable = ₹5,40,000, slabTax = ₹14,500, cess = ₹580, slabTotal = ₹15,080, dividendTax = ₹20,800, totalTax = ₹35,880. Correct.

---

## Final verdict

APPROVED — implementation may begin.

Both blocking issues are resolved correctly and completely. All 5 minor amendments are applied. The calculations are mathematically sound. The spec is consistent across data fields, function logic, UI help text, and test cases. No further changes required before Phase 2 coding starts.

Phase 2 coding is cleared to begin immediately on the basis of this spec.

Phase 3 (cross-page integration) still requires a CA review of the final implementation before the feature is considered production-ready, as noted in Section 5 of the spec.

---

## Phase 1 can start: Yes

Phase 1 (data structure and static display) was already unblocked. Phase 2 (calculations) is now also unblocked.

---

Signed: CA Arjun Mehta
Date: 2026-06-02
