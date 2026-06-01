# CA Professional Review — Financial Dashboard
## Reviewed by: CA Arjun Mehta, FCA (ICAI), ACA (ICAEW)
## Dual-jurisdiction practitioner — UK & India, 25 years experience
## Review date: 2026-06-01
## Dashboard version reviewed: All pages (dashboard.html through export.html)
## Status: All data fields zeroed — structural and methodology review only

---

## Reviewer's Note

I have reviewed this dashboard in full, examining every HTML page, the complete
calculation engine (calc.js), and the data structure (defaults.js). All values
are currently zeroed out, which is correct for a fresh installation. My review
is therefore a structural and methodological assessment — I am evaluating whether
the right questions are being asked, whether the calculations behind those questions
are correct, and whether the overall framework is fit for purpose for a UK-based
Indian professional managing a dual-jurisdiction financial life.

My verdict at the outset: this is significantly more sophisticated than anything
I have seen a non-financial professional build for personal use. It is not a
spreadsheet with a few formulas. It is a proper financial planning instrument.
But there are gaps — some minor, some that a CA would consider material. I have
documented all of them below.

---

## Section 1: Overall Structure Assessment

### Framework diagnosis

The dashboard follows what I would call a **Cash Flow + Net Worth dual-axis framework**,
which is the correct primary lens for someone in early career with:
- Active debt (Indian education loan)
- A savings accumulation mandate
- Dual-jurisdiction complexity
- A defined near-term goal (India trip) sitting alongside longer-term wealth targets

The framework covers:
- Income decomposition (gross to net)
- Expense categorisation with scheduled changes
- Debt amortisation with overpayment simulation
- Investment tracking across multiple vehicles
- Goal tracking (emergency fund, trip, wealth target)
- Net worth projection (5-year + age 25-to-50)
- Tax collection tracking (specific to a HMRC underpayment situation)
- Analytics and ratio benchmarking
- Data export (Excel + JSON)

This is a comprehensive structure. The six pillars of personal financial planning
(income, spending, protection, investment, tax, planning) are all present in some
form. That is not a given — most personal dashboards cover only two or three.

### What is genuinely well done

1. **The amortisation engine** (generateAmortisation in calc.js) is correctly coded.
   The negative amortisation guard (EMI_TOO_LOW check) is a professional-grade
   safety mechanism that most consumer tools omit.

2. **The PAYE calculation** (calculateNetPay) handles the personal allowance taper
   above £100,000 correctly — most amateur implementations get this wrong. The
   salary sacrifice treatment (pension reduces both taxable AND NIable pay) is also
   correct.

3. **The two-phase wealth progress** (wealthProgress) — debt clearance phase followed
   by wealth accumulation phase — is sound conceptual design. It correctly prevents
   the absurd situation of showing 49% progress toward a wealth target when net worth
   is deeply negative.

4. **Separation of asset pools** in projectNetWorthTimeline — pension, ULIP, and cash
   are modelled separately with different growth rates. The comment in the code
   noting the historical double-counting bug and how it was fixed shows disciplined
   engineering.

5. **Scheduled expense changes** — the ability to pre-program future cost changes
   (e.g., a rent increase, a subscription cancellation) and see their impact on
   the surplus trajectory is a feature most financial advisers don't have in their
   own client tools.

### What is structurally missing

The following are gaps at the framework level — not cosmetic omissions:

- **No India income module.** If Atharva receives any income in India (family
  transfers, rental income from a family property, freelance, interest from NRE/NRO
  accounts), there is nowhere to capture it. This is not a minor omission for a
  dual-jurisdiction taxpayer.

- **No protection/insurance summary.** The ULIPs are tracked as investments, but
  their insurance component (sum assured, critical illness, premium waiver) is not
  separately assessed. There is no standalone protection review panel.

- **No foreign currency exposure tracker.** The INR/GBP rate is a single static
  field. There is no sensitivity analysis for exchange rate movement on the loan
  or ULIP values.

- **No annual cash flow view.** The dashboard is monthly. UK Self Assessment
  and Indian ITR filing both require annual figures. A rolling 12-month actual
  vs. planned view is absent.

---

## Section 2: Income Tracking

### What is present

The income page captures:
- Base annual salary (GBP)
- Hours per week
- Average overtime gross (GBP monthly)
- Pension employee contribution rate
- Pension employer contribution rate
- Tax-free allowance (defaulting to £12,570)
- Underpayment monthly deduction
- Underpayment clears date
- Tax code (shown as 1257L in defaults, 1034L referenced in tax.html subtitle)

The pay waterfall chart (gross → tax → NI → pension → underpayment → net) is
structurally sound. The career salary scenarios panel on income.html provides
forward-looking simulation, which is useful.

### What the calculation engine does correctly

- Salary sacrifice on pension is applied to base salary only, not overtime — correct.
- Personal allowance taper above £100,000 is implemented — correct.
- NI at 8% (£12,570–£50,270) and 2% above £50,270 reflects the correct 2024/25
  employee rates — correct.
- The underpayment monthly deduction is correctly subtracted after tax and NI — correct.

### What is missing for a UK-based Indian professional

**Critical omissions:**

1. **Bonus and annual uplift.** There is an "average overtime" field but no
   dedicated bonus field with a separate tax treatment track. Bonuses in the UK
   hit a single month's payslip and frequently push individuals into a higher
   rate band for that month (though HMRC corrects this via the annual
   self-assessment or P800 reconciliation). The dashboard has no model for this.

2. **Self-assessment income.** If Atharva files a UK Self Assessment (which is
   mandatory for NRIs with foreign income, or anyone with income > £100,000, or
   anyone claiming additional pension relief), the SA tax liability and payment
   on account schedule (31 January and 31 July) are entirely absent.

3. **NRE/NRO account interest income.** Interest earned on Indian bank accounts
   by a UK resident is taxable in the UK as foreign income. There is no field to
   capture this. Even small balances in NRO accounts can generate a foreign income
   disclosure requirement.

4. **Gift aid and personal pension contributions.** If Atharva makes any cash
   donations under Gift Aid, or contributes to a personal pension (outside of
   the employer scheme), these extend the basic rate band and reduce the effective
   tax rate. Not captured.

5. **Student loan repayment.** The SBI loan EMI is treated as an expense, which
   is correct. However, if Atharva has any UK student loan (Plan 1, 2, or
   Postgraduate), that repayment is deducted from gross pay before net is received
   and should appear in the deductions waterfall. Currently absent.

6. **Directors' fee / consultancy income.** Not applicable now, but the
   architecture has no provision for this as career evolves.

**Recommendation to Tax Accountant:** The absence of a Self Assessment income and
payment on account module is the single most material income-side gap for this
client profile. Please follow up on whether Atharva is filing SA returns and, if
so, model the January and July payment schedule as a cash flow event.

---

## Section 3: Expense Tracking

### What is present

The expenses page is well structured. Default expense line items include:
- Rent (Housing)
- SBI Education Loan EMI (Debt)
- Three ULIPs: SUD Life, PNB MetLife, Axis Max Life (Insurance)
- EE Phone (Phone)
- TFL Transport (Transport)
- Apple/iTunes, TryHackMe, Claude Pro, Yonder Membership (Subscriptions)
- Groceries (Food)
- Eating out / social (Food)
- Hair — listed as "amortised" which shows intelligent thinking about
  irregular expenses (Personal)
- India trip — also amortised (Travel)

The 12-month expense heatmap, category doughnut, current vs. post-changes bar
chart, and trajectory line chart collectively provide a strong visualisation suite.

The scheduled changes feature is particularly well designed — it allows pre-programming
future cost changes and seeing the trajectory impact, which is precisely what a
financial planner would build for a client.

### What is missing

**Material omissions for a dual-jurisdiction professional:**

1. **Council Tax.** For any UK resident who is the sole adult in a property or
   shares with non-exempt adults, this is typically £100–£200/month. Absent from
   default categories.

2. **Utilities.** Electricity, gas, broadband are not in the defaults. If included
   in rent, that should be flagged. If not, this is a material under-count of
   Housing costs.

3. **Contents insurance.** A UK resident should have contents insurance. Not present.

4. **NHS prescriptions / dental / optical.** Modest but real annual costs for
   someone not exempt. Not modelled.

5. **India remittance / family support.** For an Indian professional in the UK,
   monthly or irregular remittances to family in India are often the second or
   third largest outgoing. The dashboard has no dedicated remittance tracking line.
   This is a significant omission — it affects disposable income, has potential
   FEMA implications above ₹10 lakh/year, and is a recurring item for this
   demographic.

6. **Annual expenses amortisation.** The "hair (amortised)" entry shows the
   developer understands this concept. But it is applied to only one item. Annual
   expenses such as flights to India, professional membership fees, passport
   renewal, car insurance (if applicable), HMRC registration fees, and professional
   development should all be amortised monthly. There is no systematic
   "annual expenses" section — each has to be manually entered and amortised.

7. **Professional development / certifications.** For someone with TryHackMe
   in their expense list, professional certifications (CISSP, AWS, Azure, etc.)
   are clearly anticipated costs. These are typically annual or one-off and
   should have their own tracking category.

8. **Emergency / irregular spend bucket.** There is no catch-all irregular
   expense provision. A CA would always advise a monthly buffer for the unexpected
   (e.g., £50–£100/month). Not present as a concept.

**Recommendation to Tax Accountant:** Please check whether any of the ULIP
premiums qualify for UK tax relief. INR-denominated ULIPs (PNB MetLife, Axis Max
Life) are life insurance policies written in India on the life of a UK resident.
They are unlikely to qualify for UK insurance premium relief, but the question
must be answered formally.

---

## Section 4: Debt Management (SBI Loan Section)

### What is present

The debts page and its underlying calculation engine are the strongest section
of this dashboard, technically. The data structure captures:

- Original principal (INR)
- Outstanding balance (INR)
- Interest rate (%)
- EMI (INR)
- Start date
- Co-applicant name
- Extra monthly payment (INR)

The calculation engine provides:
- Full amortisation schedule (month by month)
- Interest vs. principal paid to date (loanPaidToDate — with the correct note
  that historical reconstruction requires the original principal)
- Overpayment simulator (comparing base EMI vs. EMI + extra payment)
- Interest saved and months saved calculations
- Payoff date calculation
- Debt vs. Assets race chart
- Annual interest vs. principal stacked chart
- Balance over time line chart

The negative amortisation guard is professionally coded. The EMI_TOO_LOW error
case is handled gracefully.

### Nuances that are missing for an Indian education loan in GBP context

**Material gaps:**

1. **Interest rate type.** SBI education loans are typically linked to MCLR
   (Marginal Cost of Funds based Lending Rate). The rate field is a single static
   number. There is no mechanism to:
   - Flag whether the rate is fixed or floating
   - Record the rate reset dates (typically annual for MCLR-linked loans)
   - Model rate change scenarios (what if MCLR rises 50bps? what if it falls?)

   This is not cosmetic. SBI MCLR-linked education loans have seen rates move
   from 8.5% to 11.15% and back in recent years. A one-percentage-point change
   on a significant loan balance changes the payoff timeline materially.

2. **INR/GBP exchange rate risk on the debt.** The loan is in INR. The borrower
   earns in GBP. The dashboard converts the outstanding balance using a single
   static INR/GBP rate. There is no sensitivity panel showing: "if the pound
   weakens by 10% against the rupee, your loan in GBP terms increases by X."
   This is a material risk for financial planning.

3. **Section 80E tax deduction (India).** Interest paid on an Indian education
   loan qualifies for deduction under Section 80E of the Income Tax Act (India)
   for up to 8 years from the first EMI. This deduction is available regardless
   of whether the borrower is an NRI. The dashboard has no mechanism to:
   - Calculate the annual interest component from the amortisation schedule
   - Present this as a Section 80E deduction claim amount
   - Integrate this with the India tax module (which does not exist — see Section 6)

4. **Prepayment penalty.** Some SBI education loans carry a prepayment penalty
   for lump-sum overpayments. The overpayment simulator does not flag or calculate
   any penalty. A user simulating a large lump-sum prepayment would not see the
   true net saving.

5. **Co-applicant tracking.** The co-applicant field captures a name only. There
   is no section for the co-applicant's financial exposure — their CIBIL impact,
   their joint liability in the event of default, or any co-applicant insurance
   (life cover on the loan). For a serious financial planning tool, the
   co-applicant section is inadequate.

6. **Moratorium period tracking.** Many Indian education loans have a moratorium
   period (course duration + 12 months) during which no EMI is due. If this loan
   is still within or recently exited the moratorium, the start date and the
   moratorium end date are not captured separately, which makes historical
   interest reconstruction (loanPaidToDate) unreliable.

**Note to Tax Accountant and Head of Investment Strategy:** The Section 80E
deduction on SBI loan interest is potentially significant. Please establish:
(a) whether Atharva is filing an Indian ITR as an NRI, (b) whether the Section
80E claim has been made in prior years, and (c) the total interest paid to date
from the amortisation schedule. This should be actioned before the next Indian
ITR filing deadline (31 July for non-audit cases, though NRI extensions apply).

---

## Section 5: Investment Tracking

### What is present

The assets page tracks three vehicle types:

**Cash accounts:**
- Revolut Savings Vault (GBP balance, AER %)

**Pensions:**
- Standard Life pension (value GBP, monthly contribution GBP, status, note)

**ULIPs (three policies):**
- SUD Life International Wealth Creator (GIFT City, GBP-denominated)
- PNB MetLife Smart Goal Ensuring Multiplier (INR-denominated)
- Axis Max Life Online Savings Plan (INR-denominated)

Each ULIP captures: insurer, currency, monthly premium, current value, lock-in
date, pay term end date, total term years, sum assured, and three rate scenarios
(conservative 8%, expected 12%, aggressive 16%).

The ULIP projection engine (projectULIP) correctly:
- Applies compound growth month by month
- Stops adding premiums after pay term end date
- Continues compounding on accumulated value through the total term

The combined ULIP projection chart shows aggregate trajectory at the expected rate.

The net worth calculation (calculateNetWorth) correctly aggregates all three
pools in GBP, converting INR-denominated ULIPs using the configured rate.

### Projection methodology assessment

The ULIP projection methodology is arithmetically sound but financially optimistic
in one respect: **it uses a fixed annual growth rate throughout the entire term.**
ULIPs in practice have:
- Fund management charges (typically 1.35% p.a.)
- Policy administration charges (typically £50–₹500/month in early years)
- Mortality charges (increasing with age)
- Allocation charges in early years (some products allocate only 90% of premium
  in years 1–3)

None of these are modelled. The effective net return rate on a ULIP is
substantially lower than the gross fund return. A 12% gross return easily becomes
9–10% net after charges. On a 20-year term, the compounding difference is very
large.

### What UK instruments are missing

This is a significant gap for a UK tax resident:

1. **Stocks and Shares ISA.** The £20,000 annual ISA allowance is the single
   most tax-efficient investment vehicle available to a UK resident. There is no
   ISA tracking anywhere in this dashboard. This is a major omission for someone
   who is building long-term wealth in the UK. ISA gains and income are exempt
   from UK tax entirely — unlike pension, there is no tax on withdrawal.

2. **Cash ISA.** A simpler instrument but highly relevant for the emergency fund
   portion. Cash ISAs currently offer competitive rates (4%+) with full FSCS
   protection and zero tax on interest.

3. **SIPP (Self-Invested Personal Pension).** The dashboard tracks the employer
   Standard Life pension. But it has no mechanism for a personal SIPP contribution,
   which would be relevant if:
   - Atharva switches jobs and rolls over pensions
   - Atharva wants to make additional pension contributions for higher-rate tax
     relief
   - Atharva becomes self-employed in any capacity

4. **Premium Bonds.** HMRC-exempt, FSCS-equivalent security, up to £50,000
   holding. Not present. Popular for UK-based savers who want liquidity with
   no tax exposure.

5. **Lifetime ISA (LISA).** For anyone under 40, the LISA offers a 25%
   government bonus on up to £4,000/year, usable for a first home purchase
   or at age 60+. Not present. If Atharva is considering property purchase,
   this is a time-sensitive vehicle.

6. **General Investment Account (GIA).** For investments beyond the ISA
   allowance. Not present as a category.

### What Indian instruments are missing

1. **PPF (Public Provident Fund).** An NRI cannot open a new PPF account, but
   can maintain one opened before becoming an NRI. If a PPF account exists,
   its balance and maturity date belong in the investment tracker.

2. **NPS (National Pension System).** NRIs can contribute to NPS Tier I and
   Tier II. Contributions to Tier I qualify for Section 80CCD deduction. Not
   present.

3. **Fixed Deposits (NRE/NRO).** NRE FDs are repatriable and interest is
   tax-free in India (though taxable in UK as foreign income). NRO FDs are
   taxable in India. Neither is tracked.

4. **Mutual Funds (India).** If Atharva holds Indian mutual funds (SIPs or
   lump sum), these are not tracked. Note that UK HMRC considers Indian mutual
   funds as Offshore Funds and the tax treatment is punitive (income tax on
   gains rather than CGT). This is an important advisory point.

5. **Sovereign Gold Bonds (SGBs).** An instrument many NRI families hold.
   Not present.

**Note to Head of Investment Strategy:** The absence of ISA, SIPP, and LISA
tracking represents the single largest gap in this dashboard from a UK wealth
optimisation standpoint. For a young professional in the UK, the ISA allowance
utilisation rate is the most important annual financial decision outside of
pension contribution level. I would ask the developers to add ISA (Cash + S&S),
SIPP personal contribution, and LISA as first-class tracked instruments alongside
the existing pension and ULIP entries. Please also prepare a note on the UK tax
treatment of Indian mutual funds if any are held — this is a commonly misunderstood
area with significant penalty risk.

---

## Section 6: Tax Tracker

### What is present

The tax tracker page is designed around a specific, known situation: a tax
underpayment being collected via an adjusted PAYE tax code (1034L is referenced
in the page subtitle, while the settings default shows 1257L). This is a very
targeted feature for a very specific circumstance.

The tracker captures:
- Tax code (1034L / 1257L)
- Total underpayment amount
- Monthly deduction amount
- Start date and end date
- Verified months (calendar-style payslip verification)

The calculation engine (taxTrackerProgress) correctly:
- Computes months elapsed since start date
- Multiplies by monthly deduction to get collected amount
- Shows remaining balance and days to end date

The cumulative collection line chart and monthly payslip verification calendar
are thoughtful features.

### Assessment of the underpayment mechanism

The mechanism is arithmetically correct for HMRC's standard approach: they
reduce the tax-free allowance by an amount that, at 20% basic rate, collects
the underpayment over the tax year. However:

1. **The tax code explanation is missing.** A tax code of 1034L means a
   tax-free allowance of £10,340 (1034 × £10). The difference from the standard
   £12,570 (1257L) is £2,230 — and 20% of £2,230 = £446/year = ~£37/month.
   The dashboard should display this working clearly so the user can verify
   HMRC's arithmetic independently. Currently it does not.

2. **No P800 / Simple Assessment integration.** The underpayment was presumably
   raised via a P800 or Simple Assessment letter. The original assessment document
   amount, the tax year it relates to, and HMRC's reference number are not captured.
   If HMRC's figure is incorrect, the user has no reference to challenge it.

3. **No Self Assessment section.** This is the most material gap in the tax page.
   For a UK-based NRI:
   - Foreign income (including NRE/NRO interest, India rental income, ULIP
     maturity proceeds in India) must be declared on the SA100 / SA106
   - Capital gains from Indian investments must be declared on SA108
   - The arising basis vs. remittance basis election must be made
   - Payment on account (31 January and 31 July) must be managed as cash flow events

   None of this is present. The tax page addresses only one narrow HMRC mechanism.

4. **No India tax module.** If Atharva is an NRI under FEMA (i.e., resident
   outside India for more than 182 days in a financial year), they must still
   file an Indian ITR if:
   - Income from Indian sources exceeds ₹2.5 lakh (basic exemption limit under
     old regime) or ₹3 lakh (under new regime)
   - They have Indian bank accounts, investments, or receive income from family property

   There is no India tax tracker anywhere in this dashboard. For a professional
   CA managing an NRI client, this is a material gap.

5. **No double taxation relief tracker.** The UK-India Double Taxation Agreement
   (DTA) allows relief from double taxation. Tracking foreign tax credits (FTC)
   claimed against UK tax liability requires knowing both the India tax paid
   and the UK tax due on the same income. There is no mechanism for this.

**Instruction to Tax Accountant:** This section requires the most significant
expansion of any page in the dashboard. Priority actions:
(a) Add an India ITR filing section (NRI status, income from Indian sources,
    Section 80E deduction, total India tax liability, DTA relief claimed)
(b) Add a UK Self Assessment section (filing obligation check, 31 Jan / 31 Jul
    payment on account calendar)
(c) Add a DTR (Double Tax Relief) tracker
(d) Add the arithmetic breakdown of the current tax code so the client can
    independently verify HMRC's calculation

---

## Section 7: Net Worth and Goals

### Net worth methodology

The net worth calculation (calculateNetWorth) is sound:
- Cash accounts + pensions + ULIPs (GBP) = total assets
- SBI outstanding balance converted at current rate = liabilities
- Net worth = assets - liabilities

The two-phase wealth progress tracker (debt clearance → wealth accumulation)
is conceptually correct and prevents misleading progress indicators when net
worth is negative.

The 5-year projection (projectNetWorthTimeline) correctly:
- Separates three asset pools (cash, pension, ULIP)
- Models pension with compound growth + monthly contribution
- Models ULIP with compound growth + premium during pay term
- Amortises the SBI debt month by month
- Applies a career transition salary uplift
- Converts INR debt to GBP at the configured rate throughout

**The age 25-to-50 wealth trajectory** (ageWealthTrajectory) is a useful long-
range planning tool. It models a single growth rate with an optional career
transition inflection point. This is appropriate for a high-level projection.

### What is missing in net worth

1. **Exchange rate scenarios.** The INR/GBP rate is static. A 5-year projection
   with a static rate materially misrepresents the risk profile. The pound has
   moved from ~105 INR in 2014 to ~83 INR in 2024. A sensitivity panel
   (bull: 90, base: 83, bear: 75) would be both useful and more honest.

2. **Property.** If Atharva purchases property in the UK or India during the
   5-year window, the net worth trajectory changes significantly. There is no
   property asset class in the tracker.

3. **Inheritance / family assets.** Not present and arguably not appropriate
   for a personal dashboard — noted for completeness only.

### Goals assessment

The goals page covers three items:
- Emergency fund (with runway metric)
- India trip (October 2026 — with breakdown, savings log, and progress gauge)
- Compound growth projector

**What is well done:**
- The India trip breakdown (Work, Vacation, Family/shopping, Flights) with
  per-item paid/unpaid tracking is excellent detail.
- The emergency fund runway metric (months of expenses covered) is the correct
  way to think about emergency funds — absolute amount is less meaningful than
  months of coverage.
- The compound growth projector allows testing monthly investment amounts at
  different rates over different horizons — useful for goal-setting.

**What is missing:**
1. **Pension access target.** When does the pension become accessible? What is
   the projected value at 57 (current UK minimum pension access age)? This
   should be a goal marker.

2. **Property purchase goal.** If a property purchase is contemplated, it requires
   a stamp duty budget, a deposit accumulation tracker, and a mortgage affordability
   estimate. None of this is present.

3. **Loan payoff as a goal.** The debt section has an excellent overpayment
   simulator. But "become debt-free by [date]" is not a named goal with a progress
   tracker in the goals section. The two sections are siloed.

4. **FIRE number / financial independence target.** The dashboard has a "wealth
   target" field but no structured FIRE calculation. A FIRE number is typically
   25× annual expenses (4% rule) or 33× (3% rule). The dashboard could calculate
   this automatically from the expenses data.

---

## Section 8: Analytics

### What is present

The analytics page is substantive:
- 4 KPI cards (likely: savings rate, debt-to-income ratio, expense ratio, and
  emergency fund coverage)
- Spending ratios vs. benchmarks (radar/bar chart)
- Career income impact panel
- Key financial metrics table
- Monthly cash flow Sankey diagram
- Savings rate trend
- Surplus trajectory
- Budget vs. actual radar chart

### What is most valuable

The **Sankey diagram** for monthly cash flow is the most powerful single
visualisation in the dashboard. For a CA reviewing a client's finances, seeing
gross income → deductions → net income → expenses → surplus in one diagram
is worth more than any table. This is excellent.

The **spending ratios vs. benchmarks** panel is also valuable — comparing actual
spending ratios to standard benchmarks (e.g., housing < 30% of gross, debt
payments < 15% of net, savings rate > 20%) gives immediate health indicators.

The **surplus trajectory** (showing future surplus changes from scheduled
expense changes, tax code normalisation, and career transition) is a
sophisticated planning feature.

### What is missing

1. **Savings rate by destination.** The savings rate metric (assuming it shows
   saved / net income) does not differentiate between:
   - Pension contributions (illiquid until 57)
   - ULIP premiums (illiquid, locked in for 5 years minimum)
   - Liquid savings (accessible emergency fund)
   - Invested but accessible (ISA — if it existed in the dashboard)
   
   A CA would want to see the liquid savings rate separately from total savings
   rate. Illiquid savings cannot be used in an emergency.

2. **Debt-to-income ratio tracking over time.** A single current ratio is present,
   but no trend chart showing how this ratio is improving month by month.

3. **Interest expense as % of income.** The fraction of gross or net income
   going to debt interest (not principal — interest only) is a key affordability
   metric. Not visible.

4. **Currency exposure summary.** What percentage of total assets are in GBP?
   What percentage in INR? What is the effective FX exposure of the net worth?
   This is entirely absent.

5. **Tax efficiency score.** What percentage of available tax-advantaged allowances
   (ISA, pension annual allowance, personal allowance) are being utilised?
   A "tax efficiency" gauge would be a distinctive CA-grade feature.

6. **Cash flow calendar.** Large fixed payments in specific months (ULIP annual
   premium reviews, India trip in October, any annual insurance renewals) should
   appear on a 12-month cash flow calendar view. Not present.

---

## Section 9: CA's Wish List — Five Features to Add Immediately

These are the five features I would formally request from the development team
as a CA advising this client. I have ranked them by financial impact.

### Feature 1: India NRI Tax Module (Priority: Critical)

A dedicated page or section covering:
- FEMA residential status determination
- Indian income from all sources (bank interest, family property, dividends)
- Section 80E deduction calculator (pulling interest data from the amortisation schedule)
- Indian ITR filing obligation check and deadline tracker
- DTA relief calculator (UK tax credit for India taxes paid)
- Form 15CA/15CB requirement tracker for remittances above threshold

**Why critical:** Without this, the dashboard is structurally incomplete for
a dual-jurisdiction taxpayer. Any professional CA advising an NRI client would
consider the India tax module as fundamental as the UK income tax section.

### Feature 2: UK Tax-Advantaged Allowance Utilisation Tracker (Priority: High)

A dashboard section showing:
- ISA allowance utilised vs. £20,000 annual limit (and current ISA balance)
- Annual pension allowance utilised (employee + employer contributions vs. £60,000
  limit, or lower of £60,000 and earned income)
- Personal savings allowance (£500 for higher rate taxpayers, £1,000 for basic
  rate) and interest earned vs. allowance
- Trading allowance / property allowance (£1,000 each) if applicable
- Capital gains annual exempt amount (£3,000 from April 2024) used vs. available

**Why high priority:** These allowances are use-it-or-lose-it at the end of each
tax year (5 April). A client without a tracker routinely forgets to utilise them.
I see this every year in practice. The ISA allowance alone is worth £20,000 of
tax-free investment capacity annually — a basic rate taxpayer saving at 4%
in an ISA saves £800/year in tax compared to a savings account. Over 20 years,
the compounding effect of this tax saving is very large.

### Feature 3: Exchange Rate Sensitivity Panel (Priority: High)

A panel on either the debts or analytics page showing:
- Current SBI loan in GBP at configured rate
- Same loan at rate +10% (pound weakens — loan costs more in GBP)
- Same loan at rate -10% (pound strengthens — loan costs less)
- ULIP India values (PNB MetLife, Axis Max Life) at the same three rate scenarios
- Net worth impact of each scenario

**Why high priority:** Atharva's financial position has a structural long GBP /
short INR character — income is GBP, debt is INR. Exchange rate movement is not
background noise; it is a first-order financial variable. A 10% strengthening
of the pound relative to the rupee reduces the GBP cost of the SBI loan by 10%
— on a large education loan balance, this could represent thousands of pounds.
This needs to be visible and tracked.

### Feature 4: Amortised Annual Expense Planner (Priority: Medium-High)

A structured section (could be a tab within expenses) for:
- Annual expenses (flights to India, professional certifications, passport renewal,
  car insurance if applicable, contents insurance)
- Per-item: annual amount, payment month, amortised monthly equivalent
- Auto-adds the amortised monthly amount to the main expense total
- Shows "upcoming large payments" calendar for the next 12 months

**Why medium-high:** The current dashboard has one or two manually amortised items
(hair, India trip). But the concept is not systematically applied. A CA reviewing
monthly cash flow needs to know that the client has a £1,200 flight bill coming
in October even if nothing appears in October's regular expenses. The amortisation
approach makes the monthly surplus figure accurate; the lump-sum view prevents
cash flow surprises.

### Feature 5: Protection / Insurance Review Panel (Priority: Medium)

A page or section covering:
- Life cover summary (sum assured across all ULIPs + any standalone term policies)
- Life cover adequacy check (typically 10× annual income minimum; the dashboard
  could calculate this automatically from the income data)
- Income protection / critical illness cover status
- Nomination records (who is the nominee on each policy, in India and UK)
- Policy maturity dates and premium review dates

**Why medium:** The ULIPs have a sum assured field but it is buried in the
investment tracking section and is never surfaced as a protection assessment.
For a young professional with an active education loan and a co-applicant on
that loan, the protection adequacy question is not academic — if Atharva were
unable to work, the loan becomes the co-applicant's problem immediately. A CA
doing a full financial review would flag this as a planning gap that needs to
be addressed before it becomes an estate issue.

---

## Section 10: Dashboard Health Score

### Section-by-section ratings

| Section | Page(s) | Score | Rationale |
|---|---|---|---|
| Income tracking | income.html | 7/10 | PAYE calculation is technically correct and complete; missing bonus model, SA obligation, and NRE/NRO interest |
| Expense tracking | expenses.html | 7/10 | Good category structure, excellent scheduled changes feature; missing council tax, utilities, remittances, systematic annual amortisation |
| Debt management | debts.html | 8/10 | Best technically executed section; missing rate-type flag, FX sensitivity, Section 80E, prepayment penalty |
| Investment tracking | assets.html | 6/10 | Good for what it covers; critically missing ISA, SIPP personal, LISA, Indian instruments; ULIP charge modelling absent |
| Tax tracker | tax.html | 5/10 | Correctly handles the specific HMRC underpayment scenario; entirely absent for SA, India ITR, and DTA relief |
| Net worth | networth.html | 7/10 | Sound methodology, good 5-year projection, correct two-phase tracker; missing FX sensitivity, property class |
| Goals | goals.html | 7/10 | India trip tracker is excellent detail; missing structured debt payoff goal, pension access target, FIRE calculation |
| Analytics | analytics.html | 7/10 | Sankey diagram is best-in-class for a personal dashboard; missing liquid vs. illiquid savings split, tax efficiency score |
| Dashboard overview | dashboard.html | 8/10 | Clean summary with expense doughnut, monthly summary bar, three gauges; functional and well prioritised |
| Settings / Export | settings.html / export.html | 8/10 | Comprehensive settings coverage; Excel + JSON export is professional-grade |

### Overall financial completeness score: **7.0 / 10**

**Assessment:**

This is a 7 out of 10, and I want to be clear that is a strong score for a
self-built personal finance dashboard. In my 25 years advising clients, I have
reviewed commercial financial planning software that scores lower. The PAYE
calculation accuracy alone puts this above most consumer tools. The amortisation
engine is correctly coded. The two-phase wealth progress logic shows genuine
financial sophistication.

The 3-point gap from a 10 is attributable to four structural absences:

1. No India tax module (this alone accounts for ~1.5 points)
2. No UK tax-advantaged allowance tracking (ISA, SIPP personal, LISA) (~0.7 points)
3. No exchange rate sensitivity modelling (~0.5 points)
4. No ULIP charge modelling in the projection engine (~0.3 points)

If those four gaps are addressed, this dashboard would score 9 out of 10 and
would be, without qualification, the most comprehensive personal financial
planning tool I have seen built outside of a professional wealth management firm.

---

## Inter-Agency Coordination Notes

### For the Tax Accountant

Priority items requiring your attention:

1. Confirm whether Atharva is filing UK Self Assessment returns. If so, model
   the 31 January and 31 July payment on account schedule as cash flow events.
2. Confirm NRI status under FEMA and Indian ITR filing obligation.
3. Calculate Section 80E deduction claimable for current and prior tax years
   using the amortisation schedule interest data.
4. Review whether any of the three ULIP premiums qualify for UK relief —
   I suspect none do, but this must be confirmed.
5. Confirm the Indian mutual fund position (if any) and advise on the Offshore
   Funds regime UK tax treatment.
6. Verify the arithmetic on HMRC tax code 1034L — confirm the underpayment
   total, monthly collection rate, and end date match the HMRC P800 or Simple
   Assessment letter.

### For the Head of Investment Strategy

Priority items requiring your attention:

1. **ISA strategy is the immediate priority.** Confirm whether any ISA subscriptions
   have been made in the current tax year. If not, and if there is surplus cash,
   a Stocks and Shares ISA or Cash ISA subscription before 5 April should be
   considered urgently.
2. Review the ULIP portfolio collectively. Three ULIPs (SUD Life, PNB MetLife,
   Axis Max Life) represent a concentrated insurance-linked investment position.
   Prepare a net-return analysis for each, after all charges, vs. a comparable
   equity investment in an ISA.
3. Assess the India ULIP lock-in periods (lockInDate fields) and advise on
   whether surrender or continued premium payment is optimal for PNB MetLife
   and Axis Max Life.
4. Model the exchange rate scenarios (bull/base/bear) for the INR-denominated
   positions (SBI loan, PNB MetLife ULIP, Axis Max Life ULIP) and present a
   net currency exposure statement.
5. Assess SIPP personal contribution opportunity — if Atharva is a basic rate
   taxpayer, additional SIPP contributions attract 20% tax relief at source.
   If there is any risk of approaching higher rate threshold due to overtime or
   bonus, the marginal relief rate is 40%.

---

## Summary for Chief of Staff

This dashboard is ready for real data entry. It is structurally sound and
the core calculations are correct. I would not advise Atharva to use commercial
software instead — the bespoke nature of this tool, tuned to his specific
financial situation (UK PAYE, SBI education loan, three Indian ULIPs, dual-
jurisdiction tax life), gives it advantages that generic tools cannot match.

My recommendations in priority order:

1. **Immediate (before next India ITR deadline, 31 July):** Engage the Tax
   Accountant to address the India tax module gap. The Section 80E claim is
   potentially the most tangible near-term financial gain available.

2. **This tax year (before 5 April):** Engage the Head of Investment Strategy
   on ISA allowance utilisation. This is a use-it-or-lose-it annual deadline.

3. **Q3 development sprint:** Add the five features from Section 9 in priority
   order. The India NRI tax module and UK allowance tracker are the most
   financially material.

4. **Ongoing:** Establish a monthly data entry discipline. The dashboard's
   value is proportional to the accuracy and freshness of the data entered.
   A monthly review of 30 minutes would make this a genuinely powerful
   planning instrument.

The developer should be commended for the quality of the calculation engine.
The negative amortisation guard, the salary sacrifice treatment, the personal
allowance taper, and the two-phase wealth progress logic all reflect an unusually
rigorous approach to financial mathematics for a non-specialist.

---

*CA Arjun Mehta, FCA (ICAI), ACA (ICAEW)*
*Dual-jurisdiction practice: United Kingdom and India*
*This review is provided as professional opinion based on structural analysis
of the dashboard code and data model. It is not a financial advice document
for specific investment decisions. All recommendations regarding specific
instruments should be confirmed with the qualified advisers in each jurisdiction.*
