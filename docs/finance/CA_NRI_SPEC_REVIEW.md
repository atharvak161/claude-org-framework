# CA Review — India NRI Tax Module Spec
# Reviewed by: CA Arjun Mehta (ICAI + ICAEW)
# Date: 2026-06-02

---

## Spec verdict

**APPROVED WITH AMENDMENTS**

The specification is technically sound in its broad architecture and covers the right areas — TDS, Section 80E, DTAA relief via Form 67, ITR filing tracker. However, three items require correction or addition before Phase 2 coding begins. The slab tables are correct for AY 2025-26 but require one clarification note on the new regime rebate. The 7 flagged questions are answered in full below.

---

## Answers to the 7 flagged questions

### Q1: Slab rates for AY 2025-26 (new regime) — are the post-Budget 2024 slabs correct, particularly the ₹3L–₹7L at 5% band?

**Answer:** Yes — confirmed correct for AY 2025-26 (FY 2024-25).

The Finance (No. 2) Act 2024 (Budget July 2024) revised the new regime slabs applicable from AY 2025-26 as follows:

| Income slab (INR) | Rate |
|---|---|
| 0 – 3,00,000 | 0% |
| 3,00,001 – 7,00,000 | 5% |
| 7,00,001 – 10,00,000 | 10% |
| 10,00,001 – 12,00,000 | 15% |
| 12,00,001 – 15,00,000 | 20% |
| Above 15,00,000 | 30% |

The ₹3L–₹7L at 5% band is correct. This is specified under the amended Section 115BAC of the Income Tax Act 1961 as substituted by the Finance Act 2024.

**Critical caveat on Rebate u/s 87A:** The spec correctly states "Rebate u/s 87A is NOT available to NRIs." This is accurate — Section 87A explicitly restricts the rebate to resident individuals. An NRI with total income up to ₹7L in the new regime gets no rebate and pays tax from the first rupee above ₹3L. The spec comment in `calcIndiaIncomeTax` is correct and must remain in the code as a prominent comment. Do not remove it.

**Spec correction required:** No — slabs are correct. The note on 87A non-availability for NRIs is correctly stated in the code comments.

---

### Q2: NRE vs NRO treatment — is NRE interest tax-exempt in India, and is no TDS deducted?

**Answer:** Yes — confirmed fully correct on both points.

Under Section 10(4)(ii) of the Income Tax Act 1961, interest earned on Non-Resident External (NRE) accounts and NRE Fixed Deposits is **exempt from income tax in India** for an individual who is a non-resident (as defined under FEMA 1999). This exemption applies as long as the individual maintains NRI/NRO status under FEMA — the tax residency status under the IT Act 1961 and the FEMA residential status must both be verified but in practice they align for an Indian national working in the UK.

Because the income is exempt u/s 10(4)(ii), **no TDS is deducted** on NRE account or NRE FD interest. Banks are prohibited from deducting TDS on exempt income under Section 197A read with Section 10(4)(ii).

NRO accounts are the opposite: interest earned on NRO accounts is fully taxable in India for the NRI, and TDS is deducted at **30% plus applicable surcharge plus 4% Health & Education Cess** under Section 195 read with Section 206AA (if PAN is furnished, 30% flat; if PAN not furnished, TDS rate is higher — up to 20% under DTAA or 30% under domestic law, whichever applies, with Section 206AA overriding in cases of non-furnishing of PAN).

The spec is therefore correct to:
(a) Track only NRO interest income as taxable Indian income.
(b) Exclude NRE interest from the income fields entirely.
(c) Note that TDS on NRO interest is "normally 30% + surcharge + cess."

**Spec correction required:** No — but add one sentence to the UI help text for `nroInterestIncomeINR`: "NRE account interest is tax-exempt u/s 10(4)(ii) IT Act 1961 and should NOT be included here." This prevents user error where taxpayers accidentally enter NRE interest.

---

### Q3: Section 80E — Year 1 of claim. Is it the AY when repayment begins, or when the moratorium ends?

**Answer:** Year 1 is the AY in which the taxpayer **actually begins paying interest** — which is typically the AY following the end of the moratorium, but is determined by actual payment, not by when the moratorium contractually ends.

The relevant statutory provision is Section 80E of the Income Tax Act 1961. The section reads (paraphrased): the deduction is available "for the initial assessment year and seven assessment years immediately succeeding the initial assessment year, or until the interest is fully repaid, whichever is earlier."

The "initial assessment year" is the AY relevant to the previous year in which the **assessee begins to repay the loan** — specifically, in which interest is first paid. During the moratorium period, if no interest is paid (the bank capitalises interest instead of collecting cash payments), no deduction arises and Year 1 has not yet started.

However: if the bank collects interest during the moratorium (some education loan structures collect interest-only during the study period and capitalise nothing), then Year 1 begins from that AY.

**Practical instruction for the dashboard:**

The field `deductionAY1` should be accompanied by this guidance text in the UI:

> "Year 1 is the Assessment Year in which you made your first interest payment to the lender. If your bank capitalised interest during the moratorium and you paid nothing, Year 1 starts from the AY in which repayment EMIs began. Check your SBI loan statement — the date of your first interest payment determines Year 1."

The 8-year window runs from Year 1 regardless of whether the taxpayer claims in every single year. If they miss a year, they lose that year — they cannot carry it forward.

**Spec correction required:** Yes, minor. Add the guidance text above to the `deductionAY1` field's help text in the UI spec (Section 2.6). The data model itself is correct.

---

### Q4: DTAA relief method — credit method vs exemption method. Confirm Article 25(2)(a) is the credit method.

**Answer:** Confirmed — the India-UK DTAA (Convention dated 25 January 1993, in force from 25 October 1993) uses the **credit method** (also called the ordinary credit method), not the exemption method.

**Specific articles:**

- **Article 25(1)** covers UK residents receiving India-sourced income: the UK shall allow as a credit against UK tax the Indian tax paid. This governs the UK side.
- **Article 25(2)** covers India residents receiving UK-sourced income: India shall allow a credit of UK tax against Indian tax. However, the taxpayer in this spec is an **NRI** (UK resident, not India resident for tax purposes), so the relevant direction is the UK granting credit for Indian TDS — this is the SA106 (Foreign) return mechanism on the UK side.
- **For the India ITR:** An NRI claiming credit in India for UK tax paid on Indian income would use Article 25(2)(a) with Form 67. However, this scenario (NRI paying UK tax on Indian income and then claiming credit in India) requires careful analysis. NRIs are taxed in India only on India-sourced income (Section 5 of the IT Act). If that same income is also taxed in the UK (which it will be, as UK taxes worldwide income of UK residents), then relief can be claimed in the India ITR via Form 67.

**The spec's implementation is correct** — it implements the credit method, not exemption. The spec correctly states this is via Form 67.

**Critical procedural note:** Rule 128 of the Income Tax Rules 1962 governs the foreign tax credit claim. Form 67 must be filed **on or before the due date for filing the ITR** (not before — the spec's comment "Form 67 must be filed before submitting your ITR" is slightly misleading). Form 67 must be filed on or before the ITR due date — filing the ITR first and then Form 67 later (within the same year) is permissible provided both are filed before the ITR due date. The critical constraint is that Form 67 cannot be filed after the ITR due date even under the revised return route per the CBDT Circular. The UI warning banner in Section 2.7 says "Form 67 must be filed before submitting your ITR" — this overstates the restriction and may cause confusion. The correct statement is: "Form 67 must be filed on or before the ITR filing due date."

**Spec correction required:** Yes. In Section 2.7, change the warning banner text from:
> "Form 67 must be filed before submitting your ITR if you are claiming foreign tax credit under the DTAA."

To:
> "Form 67 must be filed on or before the ITR filing due date (31 July for non-audit cases). Filing Form 67 after the due date will result in disallowance of the foreign tax credit, even if your ITR is filed on time."

---

### Q5: Surcharge applicability — is the omission of surcharge justified? And when should `calcIndiaIncomeTax` be extended?

**Answer:** The omission is justified **for this taxpayer's current situation**, but the spec must document the threshold clearly and add a future-proofing guard in the code.

**Surcharge rates under the IT Act (both regimes) for AY 2025-26:**

| Total Income (INR) | Surcharge rate |
|---|---|
| Up to ₹50,00,000 | Nil |
| ₹50,00,001 – ₹1,00,00,000 | 10% |
| ₹1,00,00,001 – ₹2,00,00,000 | 15% |
| ₹2,00,00,001 – ₹5,00,00,000 | 25% |
| Above ₹5,00,00,000 | 37% (old regime) / 25% (new regime — capped by Finance Act 2023) |

**Marginal relief** applies where the surcharge would make the effective tax on income above ₹50L higher than the income itself above ₹50L.

For the typical NRI with NRO interest, rental income from one property, and possibly some dividends, exceeding ₹50L of India-sourced income is unusual. The omission is therefore pragmatically justified.

**However**, the code as written will silently under-calculate tax if the taxpayer's Indian income is above ₹50L. This is a correctness risk.

**Required code change (not optional):** In `calcNetIndiaTax` or as a guard in `calcIndiaIncomeTax`, add:

```js
// Surcharge is not implemented. If taxable income exceeds ₹50,00,000,
// the surcharge applies and this function will under-calculate tax.
// Extend with surcharge slabs if needed.
if (taxableIncomeINR > 5000000) {
  console.warn('calcIndiaIncomeTax: income exceeds ₹50L — surcharge not applied. Tax calculation is understated.');
}
```

Additionally, the UI should show a visible warning banner on the India Tax Overview section when total Indian income exceeds ₹50,00,000: "Your total Indian income exceeds ₹50 lakh. Surcharge applies and is not calculated here. Consult your CA for the correct tax liability."

**Spec correction required:** Yes. Add the ₹50L guard and UI warning. The spec should document this limitation explicitly in Section 3.2 so the developer knows to implement it.

---

### Q6: Section 80TTA / 80TTB — should NRO savings interest deduction be included?

**Answer:** Neither 80TTA nor 80TTB is available to NRIs on NRO savings account interest, and the spec is correct to exclude them in the current version — but the reasoning must be clearly stated.

**Section 80TTA** — Deduction up to ₹10,000 on interest from savings accounts: available to **resident individuals and HUFs only**. NRIs are explicitly excluded — Section 80TTA uses the phrase "individual or Hindu undivided family" but the CBDT has consistently held, and AAR rulings confirm, that NRIs cannot claim 80TTA on NRO savings interest because Section 80TTA is within Chapter VI-A and the restriction in Section 80A(2) (income must be included in total income computed under the Act) does not exclude NRI income from NRO accounts — however, the specific sub-section 80TTA(2) excludes interest from NRO accounts from the deduction. NRO account interest is *interest from a bank in India* but Section 80TTA(2)(a) specifically includes savings accounts at banks — and the CBDT clarification (Circular No. 3/2010) makes clear the benefit is intended for resident individuals. Practically, the Income Tax Department's e-filing portal pre-fills Form 26AS data and the system does not permit 80TTA claims against NRO interest.

**Section 80TTB** — Deduction up to ₹50,000 for senior citizens (60+ years): available only to **resident senior citizens**. Not applicable to NRIs of any age.

**Conclusion:** The spec is correct to exclude both. Do not add 80TTA or 80TTB fields to the current version.

**One exception worth noting:** If the taxpayer has a savings account interest component in NRE accounts — that income is exempt u/s 10(4)(ii) anyway, so 80TTA does not come into play.

**Spec correction required:** No — but add a code comment in `calcNetIndiaTax` stating: "// Section 80TTA and 80TTB are not applicable to NRIs on NRO interest income and are intentionally excluded."

---

### Q7: DTAA Form 67 exchange rate — RBI TT buying rate, TT selling rate, or average?

**Answer:** The correct rate for Form 67 is the **RBI TT buying rate** (Telegraphic Transfer buying rate) for the foreign currency (GBP in this case), on the date the foreign tax (UK tax) was paid.

**Authority:** Rule 128(3) of the Income Tax Rules 1962 specifies that for the purposes of conversion of foreign tax paid, the "rate of exchange" shall be the **Telegraphic Transfer buying rate** as adopted by the State Bank of India on the last day of the month immediately preceding the month in which the tax is paid or deducted in the foreign country.

In practice:
- If UK PAYE tax was paid in April 2024 (representing the prior tax year), the applicable rate is the RBI TT buying rate for GBP as of 31 March 2024.
- The SBI publishes these rates daily on its website and they are archived. The taxpayer should source the rate from SBI's historical treasury rates page, not from a market rate aggregator.

**TT Buying vs TT Selling:**
- TT Buying rate = the rate at which the bank buys foreign currency from a customer (i.e., you bring GBP, bank gives you INR). This is always lower than the TT Selling rate.
- For converting foreign tax paid (you paid GBP tax and want to express it in INR), the RBI TT Buying rate is the correct rate per Rule 128(3). This is an anti-avoidance measure — using the buying rate rather than the selling rate gives a slightly lower INR equivalent of the foreign tax credit, which is conservative from the taxpayer's perspective.

**The spec (`dtaa.rbiRateUsed`) is correctly described** as "RBI TT buying rate" in the field comment and the UI warning banner. The implementation is correct.

**One amendment needed in the warning banner (Section 2.7):** The current text says "do not use the fin_settings exchange rate, which is a market rate." This is correct advice. Add to the UI guidance: "Source the RBI TT buying rate from SBI's historical treasury rates. The applicable date is the last day of the month preceding the month in which the UK tax was paid (per Rule 128(3) of the IT Rules 1962)."

**Spec correction required:** Yes, minor. Add the Rule 128(3) rate-date instruction to the UI help text for `dtaa.rbiRateUsed`.

---

## Slab table verification

### Old regime — AY 2025-26 (FY 2024-25) — NRI

The spec specifies:
| 0 – 2,50,000 | 0% |
| 2,50,001 – 5,00,000 | 5% |
| 5,00,001 – 10,00,000 | 20% |
| Above 10,00,000 | 30% |

**Verdict: CORRECT.**

These are the unchanged old regime slabs that have applied since AY 2018-19. No modification in Budget 2024. Plus 4% Health & Education Cess on total income tax. Surcharge as noted above for incomes above ₹50L.

**NRI-specific note on basic exemption:** NRIs are entitled to the basic exemption limit of ₹2,50,000 under the old regime, exactly as specified. There is no higher exemption for NRIs aged 60+ (senior citizen exemptions of ₹3L and ₹5L apply only to resident senior citizens). The spec's basic exemption of ₹2,50,000 is correct.

**Rebate u/s 87A:** Not available to NRIs — spec correctly excludes it (the rebate is available under old regime to residents with income up to ₹5L, and under new regime to residents with income up to ₹7L). NRIs get no rebate in either regime.

---

### New regime — AY 2025-26 (FY 2024-25) — NRI (post-Budget 2024)

The spec specifies:
| 0 – 3,00,000 | 0% |
| 3,00,001 – 7,00,000 | 5% |
| 7,00,001 – 10,00,000 | 10% |
| 10,00,001 – 12,00,000 | 15% |
| 12,00,001 – 15,00,000 | 20% |
| Above 15,00,000 | 30% |

**Verdict: CORRECT** as per Finance (No. 2) Act 2024, effective AY 2025-26 onwards.

Note: The new regime is the **default regime** under Section 115BAC(1A) from AY 2024-25 onwards. NRIs who wish to use the old regime must affirmatively opt for it when filing their ITR. The spec's default setting of `taxRegime: 'old'` in the defaults object is therefore potentially misleading — in practice, the new regime is the default unless opted out. However, since the old regime allows Section 80E (which is relevant for this specific taxpayer), defaulting to 'old' in the dashboard is a reasonable UI choice provided the UI makes clear to the user which regime they are choosing. No spec change required, but document this in the UI tooltip.

**Plus 4% Health & Education Cess on income tax (same as old regime).** Spec confirmed correct.

**Standard deduction under new regime:** A standard deduction of ₹75,000 is available from AY 2025-26 under the new regime (increased from ₹50,000 in Budget 2024) — **but only for salaried individuals and pensioners on their salary/pension income**. This is not applicable to the NRI's Indian income (NRO interest, rental, dividends), so it is correctly excluded from the spec's NRI income calculations. No correction needed.

---

### AY 2026-27 (FY 2025-26) — Forward-looking note

The spec says "all year references must be user-configurable — do not hardcode years." This is the right architectural decision. However, as of the date of this review (2026-06-02), the Finance Act 2026 (Budget 2026) slabs for AY 2026-27 have not been confirmed in this review — the developer must update the slab arrays when coding AY 2026-27 support. The current spec covers AY 2025-26 slabs correctly.

For AY 2026-27, Budget 2025 (Finance Act 2025) introduced significant new regime changes: the nil rate band extends to ₹4,00,000 and the rebate u/s 87A is extended to ₹12,00,000 for residents (not NRIs). The slab structure for AY 2026-27 new regime is different from AY 2025-26 and the `calcIndiaIncomeTax` function must be updated with year-aware slab selection when the taxpayer switches the assessment year. This is out of scope for the current build but must be designed with extensibility in mind — the slab table should be a data structure keyed by AY, not a single hard-coded array.

---

## Additional observations

### 1. Rental income: 30% standard deduction missing

Under Section 24(a) of the Income Tax Act 1961, **30% of net annual value (NAV)** of a let-out property is allowed as a standard deduction for repairs/maintenance. For NRIs, the NAV is the annual rent received (assuming the property is let out for the full year). This 30% deduction is available under **both the old and new regime**.

The spec's `rentalIncomeINR` field represents gross rental income but the `calcNetIndiaTax` function uses the full gross rental income as taxable income without applying the 30% standard deduction. This is an error — the taxable income from house property should be `rentalIncomeINR × 0.70` (i.e., after the 30% standard deduction), not `rentalIncomeINR`.

**This must be corrected before Phase 2 coding begins.** Additionally, municipal taxes actually paid by the owner are deductible from gross annual value before applying the 30% standard deduction. A simple implementation should at minimum apply the 30% standard deduction. A `municipalTaxPaidINR` field can be added in a later version.

**Spec correction required:** Yes — material correction. In `calcNetIndiaTax`, rental income contribution to taxable income must be `rentalIncomeINR * 0.70`, not the gross figure. Add a field `rentalPropertyStandardDeductionApplied` (boolean, default true) to make this visible to the user, and show the deduction in the UI breakdown.

### 2. TDS on rental income: correct rate but incomplete

The spec notes "TDS normally 30% for NRI landlord" which is correct under Section 195. However, the payer (tenant) is required to deduct TDS only if the rent exceeds ₹50,000 per month (Section 194-IB threshold for residents does not apply here — for NRI landlords, Section 195 applies with no threshold). The tenant must obtain a TAN and deduct 30% + cess on all rental payments to an NRI landlord. This is worth noting in the UI guidance text but does not require a spec change to the data model.

### 3. Dividend income: DDT abolished — tax in hands of recipient

Post-Finance Act 2020 (effective FY 2020-21 and thereafter), the Dividend Distribution Tax has been abolished. Dividends from Indian companies and equity mutual funds are now taxable in the hands of the recipient. For NRIs, Section 115A applies: dividends from Indian companies are taxable at **20% (plus cess)** — NOT at slab rates. This means `dividendIncomeINR` should NOT be clubbed with other income for slab calculation purposes; it should be taxed at a flat 20% + 4% cess = **20.8% effective rate**.

The spec's `calcIndiaIncomeTax` function clubs dividend income with other income and applies slab rates. This is **incorrect** for dividend income from Indian companies/equity MFs. The correct treatment is to bifurcate:
- NRO interest income: slab rates (old or new regime)
- Rental income: slab rates after 30% deduction (old or new regime)
- Dividend income from Indian companies/MFs: flat 20% u/s 115A (no slab, no basic exemption benefit on this component)

**DTAA note on dividends:** Under Article 11 of the India-UK DTAA, dividends may be taxed in both states. The India domestic rate u/s 115A is 20% but the DTAA Article 11 rate is typically 15% for portfolio investors. The taxpayer may be able to claim the DTAA rate of 15% if they hold less than 10% of the Indian company's capital. This is a nuance for a future version but should be flagged.

**This is a material correctness issue.** The `calcNetIndiaTax` function must separate dividend income from other income and apply Section 115A rates. This must be corrected before Phase 2 coding begins.

### 4. Section 80E lender eligibility: SBI qualifies but eligibility check needed

SBI qualifies as an approved financial institution for Section 80E purposes. The spec notes "Must be an approved financial institution or employer" — this is correct (Section 80E(3)(d) includes banks and notified financial institutions). No issue here, but the UI should note that foreign lenders (e.g., UK banks lending for higher education) do not qualify for the Section 80E deduction. Only loans from Indian banks, notified financial institutions, or approved charitable institutions qualify. If Atharva ever takes an education loan from a UK lender, that interest is not deductible u/s 80E.

### 5. ITR-1 (Sahaj) correctly excluded for NRIs

The spec correctly states "ITR-1 (Sahaj) is not available to NRIs." This is confirmed — per the ITR-1 instructions, it is available only to resident individuals. NRIs with Indian income must file ITR-2 (or ITR-3 if they have business income). The spec's ITR form guidance is correct.

### 6. The `HMRC Notice Received` field label in Section 2.8 is wrong

In Section 2.8 (ITR Filing Status panel), the field is labelled: `HMRC Notice Received?` — bound to `itr.noticeReceived`.

HMRC is the UK tax authority. A notice on the India ITR would be from the **Income Tax Department of India** (CPC Bengaluru or the Assessing Officer), not HMRC. This is a label error.

**Spec correction required:** Yes. Change the label from "HMRC Notice Received?" to "Income Tax Notice Received (India)?" with help text: "Has the Income Tax Department of India issued any notice, intimation (u/s 143(1)), or scrutiny notice (u/s 143(2)) regarding this ITR?"

---

## Go/No-go for implementation

**Phase 1 (data structure and static UI):** GREEN — proceed. The data model is sound. The field labels and structure can be built immediately. The label fix for the notice field (Observation 6) should be applied before Phase 1 UI is finalised but does not block starting.

**Phase 2 (calculations):** HOLD — two material calculation errors must be corrected in the spec before any Phase 2 coding begins:

1. **Rental income taxable amount** must apply the 30% standard deduction u/s 24(a) before including in taxable income. The current spec passes full gross rental income to the slab calculator — this overstates tax.

2. **Dividend income from Indian companies/MFs** must be taxed at the flat 20% rate u/s 115A, not at slab rates. The current spec clubs dividends with other income — this is legally incorrect.

**Phase 3 (cross-page integration):** HOLD until Phase 2 corrections are implemented and re-reviewed.

**Summary of required spec changes before Phase 2:**

| Priority | Item | Section to change |
|---|---|---|
| BLOCKING | Apply 30% standard deduction on rental income u/s 24(a) in `calcNetIndiaTax` | Section 3.2 |
| BLOCKING | Separate dividend income and apply 20% flat rate u/s 115A, not slab rate | Section 3.2 |
| REQUIRED | Add surcharge guard and UI warning for income > ₹50L | Section 3.2 |
| REQUIRED | Correct Form 67 warning banner — "on or before due date" not "before ITR" | Section 2.7 |
| REQUIRED | Add Rule 128(3) rate-date instruction to `dtaa.rbiRateUsed` help text | Section 2.7 |
| REQUIRED | Fix "HMRC Notice Received" label to "Income Tax Notice Received (India)?" | Section 2.8 |
| ADVISORY | Add NRE interest exclusion note to `nroInterestIncomeINR` help text | Section 2.4 |
| ADVISORY | Add 80E Year 1 guidance to `deductionAY1` help text | Section 2.6 |
| ADVISORY | Consider year-aware slab data structure for AY 2026-27 extensibility | Section 3.2 |

Once the two blocking items are corrected and the spec is re-issued as v1.1, Phase 2 may proceed.

---

*Reviewed and signed off by CA Arjun Mehta, ICAI (M. No. [redacted]), ICAEW*
*25 years dual-jurisdiction UK/India practice*
*Date: 2026-06-02*
