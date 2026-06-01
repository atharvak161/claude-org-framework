# Investment Section Review — Financial Dashboard
**Reviewer:** Head of Investment Strategy (Specialist Finance Agent)
**Date:** 2026-06-01
**Files reviewed:** assets.js, assets.html, networth.js, networth.html, goals.js, calc.js (projectULIP, projectNetWorthTimeline)

---

## 1. ULIP Projection Methodology — Is It Sound?

### The mechanics

The `projectULIP()` function in calc.js implements a standard compound interest model with monthly compounding and a bifurcated premium regime:

- While within the pay term: `value = (value + monthlyPremium) * (1 + monthlyRate)`
- After the pay term ends (paid-up phase): `value = value * (1 + monthlyRate)`

This is the correct approach for a ULIP: premiums are added at the start of each month and then the whole balance compounds. The function correctly uses `payTermEndDate` to switch between regimes.

Projection points are recorded annually (`m % 12 === 0`) which is appropriate for the planning horizon.

### The three rate scenarios

The dashboard exposes `conservativeRatePercent`, `expectedRatePercent`, and `aggressiveRatePercent` as user-configurable fields per ULIP. This is sound design — the user sets their own assumptions. However, there is no guidance or guardrails on what reasonable values look like. Based on Indian equity-linked ULIP historical data:

| Scenario | Typical range | Assessment |
|---|---|---|
| Conservative | 6–8% | Reflects debt-heavy fund allocation |
| Expected | 10–12% | Aligns with large-cap equity ULIP long-run returns |
| Aggressive | 14–16% | Upper end; achievable in mid/small-cap years, not sustained |

**The methodology is sound. The assumptions are user-controlled and therefore only as reasonable as the user makes them.** The dashboard should display a tooltip or note indicating what these rates mean (gross fund return, before mortality charges and administration fees).

### Critical gap: charges are not modelled

This is the most significant flaw in the ULIP projection. ULIPs carry multiple charges that reduce the effective rate of return:

- **Premium Allocation Charge (PAC):** Typically 0–5% of each premium, deducted before investment. In early years this can be 5–7.5%.
- **Fund Management Charge (FMC):** 0.5–1.35% per year of the fund value, deducted continuously.
- **Policy Administration Charge (PAC):** Fixed monthly fee, typically ₹500–₹1,000/month.
- **Mortality Charge:** Deducted monthly based on age and sum assured. Increases with age.

The `projectULIP()` function applies the user-specified rate to the gross value without any deduction for these charges. If the user enters 12% as the "expected" rate and the actual fund charges 1.35% FMC plus administration charges, the net-of-charges return is closer to 10–10.5%. Over 20 years, this difference is material — potentially 15–20% lower terminal value than displayed.

**Recommendation:** Either (a) reduce each scenario rate by a standard charge drag (e.g., 1.5–2%) and label this as "net of charges estimated," or (b) add a "total annual charges %" field per ULIP and subtract it from the growth rate in the calculation.

### Projection horizon

The milestones shown are: Lock-in, Pay term, Year 10, Year 20. These are appropriate anchors. Lock-in is the regulatory 5-year lock-in under IRDAI rules. Pay term end marks when premiums stop. Year 20 is a common ULIP maturity horizon. The Year 10 milestone is useful for medium-term planning.

**Overall ULIP methodology assessment:** Structurally correct. The compound-interest engine is right. The three-scenario presentation is clear. The charge omission is a meaningful accuracy problem that should be addressed.

---

## 2. UK Investment Wrappers — What Is Missing?

The assets page currently tracks: workplace pension, cash savings account, and ULIPs. For a UK-resident investor, three major tax-advantaged wrappers are absent entirely.

### Stocks and Shares ISA

The ISA is the single most important UK investment wrapper for a wealth-building strategy at this income level. Key parameters that should be tracked:

- Annual ISA allowance used (£20,000/year for 2024/25)
- Remaining ISA allowance for the current tax year
- Current ISA portfolio value (split by provider if multiple)
- ISA growth rate assumption for projection
- ISA contributions by tax year (for tracking tax efficiency over time)

The ISA is completely absent from the dashboard. For someone targeting £4.76M in wealth, ISAs should be the primary savings vehicle outside the pension. An ISA balance will grow free of income tax and CGT in perpetuity. This is not a minor oversight.

### Cash ISA

Separately from Stocks and Shares ISA, the Cash ISA allowance (within the same £20,000 total) should be tracked if the user holds cash savings in an ISA rather than a standard savings account. The current cash account tracking (`cashAccounts`) makes no distinction between ISA and non-ISA cash.

### Self-Invested Personal Pension (SIPP)

The dashboard tracks only a workplace pension. A SIPP should be tracked separately because:

- The user controls investment selection (relevant for someone with Indian market knowledge)
- SIPP contributions benefit from pension tax relief at source (20% basic rate automatically, 40%+ claimable via Self Assessment)
- If salary sacrifice is not available, a SIPP is the alternative route to pension-boosted savings
- SIPP and workplace pension have the same £60,000 annual allowance (combined), making the total worth tracking

Fields needed: SIPP provider, current value, annual contribution, investment allocation (equity/bond/alternatives split).

### Lifetime ISA (LISA)

The LISA is particularly relevant for a young professional under 40 targeting a first property purchase or retirement:

- Contributions up to £4,000/year receive a 25% government bonus (max £1,000/year free money)
- Can be used penalty-free for first property purchase (up to £450,000) or from age 60
- The 25% bonus on £4,000 represents a guaranteed 25% return before any investment growth

A LISA tracker should include: current value, annual contributions, bonus received, intended use (property vs retirement), and property purchase price target.

---

## 3. Indian Instruments — What Should Be Tracked?

The dashboard is specifically designed for a UK-resident with Indian financial ties. The following Indian instruments are completely absent from the assets section.

### National Pension System (NPS)

NPS is a government-administered defined contribution pension scheme. Key tracking needs:
- Tier 1 corpus value (locked until 60, with annuity obligation at maturity)
- Tier 2 corpus value (liquid, no lock-in)
- Monthly contribution (own and employer if applicable)
- PRAN (Permanent Retirement Account Number) for reference
- Fund allocation (Active vs Auto, fund manager, equity/bonds split)
- GBP equivalent at current INR/GBP rate

NPS is relevant because contributions to Tier 1 give deduction under Section 80CCD(1) and 80CCD(1B) in India, and accumulated corpus affects Indian retirement planning even for an NRI/RNOR.

### ELSS SIP (Equity Linked Savings Scheme)

ELSS funds give Section 80C deduction in India (within the ₹1.5L 80C limit). They have a 3-year lock-in per installment. For someone making SIP investments:
- Total invested (₹)
- Current value (₹ and GBP equivalent)
- Lock-in schedule by tranche (each SIP installment has its own 3-year lock)
- Unrealised gain/loss
- LTCG tax implication (10% above ₹1L on gains after 1 year from lock-in end)

### Public Provident Fund (PPF)

PPF is a 15-year government-backed savings scheme with tax-free interest (currently 7.1% p.a.) and Section 80C deduction. If the user holds an active PPF account:
- Current corpus (₹)
- Annual contribution (₹)
- Maturity date
- Interest earned this year
- GBP equivalent

Note: Non-Resident Indians (NRIs) cannot open new PPF accounts but can continue existing ones until maturity. The residency status of the account holder affects access.

### Sovereign Gold Bonds (SGBs)

SGBs are issued by RBI as a substitute for physical gold:
- Denomination in grams of gold
- Issue price per gram (in ₹)
- Current market value (in ₹ and GBP equivalent)
- Maturity date (8 years from issue, exit window from year 5)
- 2.5% annual interest (taxable in India)
- CGT implications (tax-free in India at maturity; UK CGT may apply for UK residents)

### Employee Provident Fund (EPF)

If the user has ever worked in India formally, they likely have an EPF corpus:
- UAN (Universal Account Number)
- Current corpus (₹)
- Whether actively contributing or dormant
- GBP equivalent

### Summary table of Indian instruments missing

| Instrument | Section | Priority |
|---|---|---|
| NPS Tier 1 | Assets | High |
| NPS Tier 2 | Assets | Medium |
| ELSS SIP | Assets | High |
| PPF | Assets | Medium |
| SGBs | Assets | Medium |
| EPF | Assets | High (if ever employed in India) |

---

## 4. Net Worth Timeline Projection — Is the Methodology Appropriate?

### What was fixed and is now correct

The `projectNetWorthTimeline()` function was refactored to eliminate two significant double-counting bugs (documented in the code comments):

1. Cash savings was previously initialised to `totalAssets` (which included pension), then pension was added again — pension was double-counted. This is now correctly fixed by separating the three pools: `cashSavings`, `pensionVal`, `ulipVal`.

2. ULIPs previously sat as static cash. They now compound using `ulipGrowthRate` with the correct premium-during-pay-term / compound-only-after logic. This is the right approach.

### What is methodologically sound

- Separate growth rates for each asset class (pension at configurable rate, ULIPs at their average expected rate, cash savings linear from surplus)
- Debt amortisation is modelled month by month using the actual SBI EMI structure rather than assuming a constant payoff
- Career transition is modelled as a step-change in monthly saving, not as a change to the gross income (which would require recalculating tax) — this is a reasonable simplification for a 5-year projection
- The 5-year (60-month) projection window is appropriate for near-term planning

### What is methodologically weak

**Cash savings are linear, not compounded.** The `cashSavings` variable grows by `+= currentSaving` each month with no growth rate applied. If the cash savings account earns 5% AER (which is plausible in the 2024-26 rate environment), failing to compound this understates cash growth. At £10,000 cash compounding at 5% for 5 years, the omitted growth is approximately £2,750. Not catastrophic, but incorrect.

**Career transition salary uplift assumption (40% net of tax).** The model applies 40% of the gross salary increment as additional monthly saving: `(newSalaryGBP - currentSalaryGBP) / 12 * 0.4`. This 40% is a hardcoded assumption about the net-of-tax uplift. At the salary ranges in the scenario table (£28k to £65k), marginal rates vary significantly. A move from £28k to £55k would see most of the increment taxed at 20% (plus 8% NI = 28% deducted), so the actual net uplift is approximately 72%, not 40%. The 40% assumption is conservative and unexplained. It should either call `calculateNetPay()` for the new salary and compute the actual surplus change, or at minimum the 40% should be user-configurable.

**No inflation adjustment.** All projections are in nominal GBP. Over 5 years at 2.5% inflation, the real value of the projected figures is meaningfully lower. The dashboard should either display a real-terms figure or include an explicit "all figures are nominal" disclaimer.

**No scenario branching.** The timeline shows one path. A three-scenario approach (base/optimistic/stress) similar to the ULIP projection would be more useful for decision-making.

**The age-trajectory chart in networth.js** runs from the current age to age 50 and applies a single monthly surplus (with one career transition step-change). This is a very long projection (potentially 25 years) with very few modelling parameters. Returns are applied as a single average rate to the entire net worth, without distinguishing between asset classes. Over a 25-year horizon, this is too simplistic to be informative and could give false precision.

---

## 5. Asset Allocation Analysis — What Is Missing?

The dashboard has no asset allocation analysis whatsoever. This is a significant gap for an investment-strategy tool.

### Missing allocation views

**UK vs India split.** The dashboard tracks assets in both currencies but never shows what percentage is UK-domiciled vs India-domiciled. This matters for currency risk, tax jurisdiction, and repatriation planning.

**Equity / Fixed Income / Cash / Property / Insurance split.** Current categorisation is: Pension (opaque), Cash, ULIP (equity-linked insurance). The actual underlying allocation within the pension and within ULIP funds (equity vs debt vs balanced) is not captured.

**Liquidity analysis.** Different asset classes have different access windows:
- Cash: immediate
- ISA: immediate (if it existed in the dashboard)
- Pension: accessible from age 57 (rising to 57 from 2028)
- ULIP Tier 1: locked until lock-in date, then partial withdrawals permitted
- NPS Tier 1: locked until age 60

There is no liquidity waterfall showing when assets become accessible.

**Target vs actual allocation.** The user has a wealth target of £4.76M. There is no recommended or target asset allocation to achieve this, and no comparison of current allocation against a glide path appropriate to their age and timeline.

**Currency risk exposure.** Approximately [X]% of assets are in INR. With GBP/INR historically volatile (range: 85–110 over the past decade), unhedged INR exposure represents meaningful currency risk that is not quantified anywhere in the dashboard.

### Specific missing panels

1. **Asset allocation donut chart** — equity/fixed income/cash/gold/property split across all assets
2. **Geographic allocation** — UK/India/global breakdown
3. **Liquidity waterfall** — amount accessible immediately, 1yr, 5yr, retirement
4. **Currency exposure** — GBP vs INR vs other as % of total portfolio
5. **Correlation and diversification score** — qualitative at minimum

---

## 6. Investment Section Rating

**Overall rating: 5/10**

**Strengths:**
- ULIP projection engine is structurally correct and the three-scenario approach is best practice
- The recent fix eliminating pension double-counting and adding ULIP compound growth is a meaningful accuracy improvement
- The combined ULIP projection chart is a useful at-a-glance view
- The debt amortisation model is correctly integrated into the net worth timeline
- The career transition step-change in the timeline projection is a thoughtful planning feature

**Weaknesses:**
- ISA tracking is completely absent — this is the primary UK wealth-building vehicle and should be the first addition
- SIPP tracking is absent — relevant for self-directed retirement planning
- LISA is absent — free 25% government bonus that is being left unmonitored
- NPS, ELSS, PPF, SGBs, and EPF are all absent — the India side of the portfolio is not tracked at all
- No asset allocation analysis: no equity/fixed income/cash split, no UK/India geographic split, no liquidity analysis
- ULIP charges (FMC, PAC, mortality) are not deducted from projected returns — overstating terminal value
- Net worth timeline: cash savings are not compounded, career transition net uplift hardcoded at 40% (incorrect), no inflation adjustment
- Age trajectory over 25 years with one average growth rate is too simplistic to be useful as a planning tool

The dashboard works as a basic snapshot tracker. It does not yet function as a serious investment strategy platform. The gap between what it shows and what a UK-resident investor with Indian financial ties actually needs to monitor is significant. Priority additions, in order: ISA tracker, Indian instrument tracker (NPS/ELSS/PPF), asset allocation panel, ULIP charge modelling.
