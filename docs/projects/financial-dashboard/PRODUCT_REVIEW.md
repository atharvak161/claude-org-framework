# PRODUCT REVIEW — Finance Dashboard
**Reviewer:** Product Manager / UX Designer / Business Analyst
**Date:** 2026-05-31
**Project location:** /Users/atharva/Downloads/organisation/src/projects/financial-dashboard/
**Scope:** Full product, feature, UX, and market review to inform roadmap decisions

---

## Executive Summary

This is a highly capable, deeply personal financial dashboard that sits at a rare intersection: technically sophisticated yet purpose-built for one person's exact financial situation. The engineering quality is strong — encrypted local storage, service worker crypto vault, auto-save, scheduled expense changes, multi-chart visualisation, and a full export pipeline. The UX has clear intent but significant friction points. As a personal tool it is already excellent. As a product, it needs a fundamental rethink of how it handles the personal-to-general transition.

---

## 1. What Problem Does This Application Solve, and Does It Solve It Well?

### The Problem
A young professional in the UK — earning a salary in GBP, paying an Indian education loan in INR, holding Indian insurance-linked investments (ULIPs), saving for a specific trip, and dealing with an HMRC tax underpayment — has no single app that handles all of this coherently. Mainstream apps like Mint or Emma do not handle multi-currency asset tracking, ULIP projections, or Indian loan amortisation alongside UK tax calculations.

### How Well Does It Solve It?
**Very well for its intended user. Poorly for anyone else.**

The application solves the specific problem with exceptional depth:
- The SBI Education Loan is modelled with full amortisation, overpayment simulation, and the "Debt vs Assets Race" chart — this is the kind of analysis a financial advisor would charge hundreds of pounds to produce.
- The ULIP section (assets.html / assets.js) models three separate insurance-linked investment plans with conservative/expected/aggressive rate projections and a combined projection chart. This is genuinely rare functionality.
- The Tax Tracker (tax.html) models a specific HMRC tax code underpayment (1034L) with a 12-month payslip verification calendar. This is hyper-specific and extremely useful for someone with this exact situation.
- Scheduled expense changes (expenses.html) — the ability to note "EE contract ends October 2026, switches to £12 SIM-only" and have the system automatically reflect the future lower cost in projections — is thoughtful and practically valuable.
- The INR/GBP dual-currency awareness is consistent across every page.

**Where it falls short as a problem-solver:**
- The problem it solves is so specific that the defaults in defaults.js contain real financial data (salary of £28,000, SBI balance of ₹27,52,000, specific ULIP names and values, Revolut savings balance). A new user getting this code sees a stranger's finances until they manually overwrite every setting. There is no guided onboarding that collects user data before showing the dashboard.
- The monthly log (monthlyLog) is manually maintained with hardcoded estimates. There is no transaction import, bank connection, or CSV upload, which means the app is only as accurate as the user's diligence in keeping it updated.

**Verdict:** 8/10 for the specific user it was built for. 3/10 for any other user trying to adopt it.

---

## 2. Features Present and Critical Gaps

### Features Present (complete inventory)

**Income (income.html / income.js)**
- Base salary input (annual GBP)
- Average overtime (monthly gross)
- Hours per week
- Pension contribution rates (employee and employer)
- Tax-free allowance (annual, customisable for non-standard codes)
- Monthly underpayment deduction with clear date
- Live deductions waterfall showing gross → tax → NI → pension → underpay → net
- Pay waterfall chart (bar)
- Career salary scenario table (£28k, £40k, £55k, £65k) showing net/mo and surplus

**Expenses (expenses.html / expenses.js)**
- Full editable expense table (name, category, monthly amount, active toggle, delete)
- 10 preset categories: Housing, Debt, Insurance, Phone, Transport, Subscription, Food, Personal, Travel, Other
- Add expense button
- Scheduled changes (future-dated amendments with change date and note)
- 12-month expense heatmap (colour-coded by category, shows scheduled changes)
- Category split doughnut chart
- Current vs Post-Changes bar chart
- 12-Month Trajectory line chart

**Debts (debts.html / debts.js)**
- Single loan (SBI Education Loan) with: outstanding balance, interest rate, EMI, start date, extra payment, co-applicant
- Current metrics: outstanding in GBP, monthly interest/principal split, remaining months, payoff date, total interest remaining
- Overpayment slider simulator (₹0 to ₹50,000, real-time recalculation)
- Overpayment comparison table (₹0 / ₹10k / ₹20k / ₹35k extra per month)
- Full amortisation schedule (24-row preview with "Show all" toggle)
- Annual interest vs principal stacked bar chart
- Balance over time line chart (base EMI vs with extra)
- Interest vs principal paid to date doughnut
- Debt vs Assets Race chart (finds crossover point)

**Assets (assets.html / assets.js)**
- Standard Life pension: current value, monthly contribution, editable
- Revolut Savings Vault: balance, AER, editable
- Three ULIP cards (SUD Life / PNB MetLife / Axis Max Life): current value, premium, lock-in date, pay term end, sum assured
- ULIP milestone projection table per product (lock-in / pay term / year 10 / year 20) at conservative / expected / aggressive rates
- Individual ULIP projection charts (3 scenarios each)
- Combined ULIP projection chart (expected rate)

**Net Worth (networth.html / networth.js)**
- Projection settings: pension growth rate, career transition date and new salary
- Wealth target scenarios table by salary level (years to target)
- Assets vs Liabilities vs Net Worth 5-year timeline chart
- Wealth Trajectory — Age 25 to 50 (configurable: current age, target age, growth rate, career transition age, post-transition surplus)

**Goals (goals.html / goals.js)**
- Emergency Fund Runway metric card (months of coverage with colour-coded status)
- Compound Growth Projector (configurable: monthly amount, annual rate, years)
- India Trip tracker: target, saved, deadline, remaining, days left, needed per month
- India Trip budget breakdown table (item / currency / INR amount / GBP amount / paid status)
- India Trip monthly savings log (planned vs actual, running total, notes, delete)
- Running total line chart and monthly saved bar chart
- India trip gauge

**Tax (tax.html / tax.js)**
- Tax code, underpayment total, monthly deduction, start/end date
- Progress: collected, remaining, percentage, months elapsed/remaining, days until clear
- 12-month payslip verification calendar (click to mark verified/unverified)
- Cumulative collection line chart

**Analytics (analytics.html / analytics.js)**
- KPI cards: Savings Rate, Housing Ratio, Investment Rate, Cash Runway (vs benchmarks)
- Spending Ratios vs Benchmarks bar chart (savings %, housing %, invest %, debt/income %)
- Career Income Impact table
- Key Financial Metrics table (income, net worth, monthly cash flow)
- Monthly Cash Flow Sankey diagram (SVG, custom implementation)
- Savings Rate Trend line chart (vs 20% benchmark)
- Surplus Trajectory stepped line chart (shows impact of scheduled expense changes)
- Budget vs Actual radar chart

**Overview / Dashboard (dashboard.html / dashboard.js)**
- Net Worth KPI card
- Take-Home (with OT) KPI card
- Monthly Surplus KPI card
- SBI Outstanding KPI card
- Emergency Runway KPI card
- Expense Breakdown doughnut
- Monthly Summary bar chart (net income vs saved, from monthly log)
- Debt Clearance gauge
- Emergency Fund gauge
- India Trip gauge

**Export (export.html / export-page.js)**
- Excel workbook export (10 sheets, full data)
- JSON backup export / import
- Data reset to defaults

**Settings (settings.html / settings-page.js)**
- 11 tabs: Profile, Income, Expenses, Debts, Investments, Goals, Projections, Tax, Display, Data, Charts
- All settings auto-save on change

**Infrastructure**
- Encrypted local storage (AES-GCM via Web Crypto API, key managed in Service Worker)
- Username + password authentication with lockout (3 attempts, timed lockout)
- Session-based key storage (sessionStorage for page navigation)
- Inactivity timeout (configurable, default 60 minutes)
- PDF export from any page
- Collapsible sidebar (state persisted)
- Dark theme (dark cyan/blue on black, monospace font)

---

### Critical Missing Features

**For personal finance completeness:**

1. **Transaction entry / import** — There is no way to record actual transactions. The monthly log requires manual summary entries. Without actual spending tracking, the expenses page is a budget model, not a ledger. A CSV import (from Monzo, Revolut, Starling, or any bank) would transform the app from a projection tool into an actuals tracker.

2. **Multiple debt support** — The Debts page is hard-coded to a single `sbi` object. The subtitle on debts.html reads "SBI Education Loan" not "Your Debts." Anyone with a credit card, overdraft, or additional loan cannot use this section. The data structure in defaults.js (`fin_debts: { sbi: {...} }`) would need redesigning to support an array of debts.

3. **Multiple savings accounts** — The investments section supports only one cash account (`cashAccounts[0]`). Someone with a Monzo pot, an ISA, and a Revolut vault cannot track them properly.

4. **Income history / payslip log** — There is a `fin_monthly_log` but it requires manual entry. There is no mechanism to upload or log actual payslips, nor to automatically compare actual vs estimated net pay month-on-month.

5. **Budget vs Actuals tracking** — The Budget vs Actual radar chart on the Analytics page compares current expense configuration vs a manually-set budget, not actual spending vs budget. Without transaction data, this chart is comparing two estimates.

6. **Recurring transaction reconciliation** — The expenses are modelled as recurring monthly amounts. There is no way to note "I skipped gym this month" or "I paid £30 extra for a haircut." One-off variances are invisible.

7. **Multiple currencies beyond GBP/INR** — The dual-currency awareness is good for this user's specific situation, but anyone with EUR savings, USD investments, or other currencies is not supported.

8. **Notifications and alerts** — There are no alerts for: surplus dropping below a threshold, emergency fund falling below 3 months, debt payment missed, goal deadline approaching. A notification system (even browser notifications) would add significant value.

9. **Password change** — The `reEncryptAll` function exists in store.js suggesting this was planned, but there is no UI for changing the password in settings-page.js. This is a security gap for a local-only encrypted store.

10. **Shared / multi-user access** — For a couple managing finances together, there is no concept of shared access, multiple users, or household view.

---

## 3. Navigation Structure Analysis

### Structure
The navigation is a left sidebar containing 10 items in this order:
Overview, Income, Expenses, Debts, Assets, Net Worth, Goals, Tax Tracker, Analytics, Export

Settings is in the sidebar footer (below all nav items) alongside a Lock button and avatar.

### What Works
- The left sidebar with icon + label is a standard, well-understood pattern. No learning curve.
- Collapsible sidebar (icon-only mode) is well-implemented with state persistence.
- Active state highlighting is clear.
- The Lock button placement in the footer is logical — it's destructive (signs you out) so it should not be in the main flow.
- Topbar shows page title + date + PDF export consistently on every page.
- Settings is separated from the main nav but accessible.

### Navigation Problems

**Problem 1: Ordering logic is unclear.**
The sequence Overview → Income → Expenses → Debts → Assets → Net Worth → Goals → Tax → Analytics → Export follows no obvious pattern. It is not ordered by frequency of use, nor by a user journey, nor alphabetically. A new user landing on this would not know where to start. Suggested ordering by usage frequency: Overview → Analytics → Expenses → Income → Goals → Assets → Debts → Net Worth → Tax → Export.

**Problem 2: "Assets" and "Net Worth" are conceptually merged but split into separate pages.**
Net Worth is a derived view of Assets minus Debts. Having them as separate navigation items forces users to jump between pages to understand a single concept. The Assets page shows current values; Net Worth shows projections. This split is not immediately obvious from the nav labels.

**Problem 3: "Tax Tracker" is a contextual tool, not a primary section.**
The Tax Tracker is a niche feature tracking a specific HMRC underpayment. Giving it a permanent top-level nav item (above Analytics) elevates it above its actual importance. It belongs either under Settings or as a sub-section of Income.

**Problem 4: No breadcrumbs or in-page navigation.**
The Goals page contains Emergency Fund, Compound Growth Projector, India Trip, and Monthly Savings Log — four distinct functional areas stacked vertically. On a longer page, there is no anchor navigation to jump between sections.

**Problem 5: No search or quick-navigate.**
With 10+ pages and multiple settings tabs, there is no search, no keyboard navigation shortcut (beyond the keyboard-required login), and no "quick actions" bar. Power users have no way to jump directly to a specific figure.

**Problem 6: Export is a top-level nav item.**
Export is not a page a user visits regularly. It should be a button (already partially there in the topbar PDF button) rather than a dedicated navigation destination taking a slot alongside core financial pages.

### Navigation Verdict
Functional but not optimal. The order and grouping reflect the order in which features were built rather than a deliberate user journey. For a personal tool, the user learns it once and adapts. For a product, this ordering would cause confusion for new users.

---

## 4. Onboarding Experience for a New User

### First-Time Journey (honest walkthrough)

**Step 1: index.html → login.html**
The user sees a black screen with "Finance Dashboard" in faint cyan text. Nothing else. There is no sign-up, no "get started," no description of what this app does. The auth form is hidden until the user clicks the title text. This is a deliberate design choice (clean, minimal, slightly theatrical) but it has no discoverability. A first-time user who has not been told to "click the title to log in" will sit confused.

**Step 2: The login form**
The auth form is a hidden terminal-style prompt. It requires a pre-existing username and password — there is no registration flow. The credentials are hardcoded in auth-config.js (a local file, gitignored). This works for one user who set up the system. It is completely broken for multi-user or new-user scenarios. A new person receiving this codebase cannot log in without reading the source code or the setup instructions (which do not exist in the README — the README is empty).

**Step 3: First view after login — dashboard.html**
The user lands on the Overview page which immediately shows populated KPI cards, charts, and gauges — all populated with the owner's real financial data from defaults.js. The user sees net worth, take-home pay, SBI loan outstanding, India Trip progress — none of which is their data. There is no prompt saying "this is example data, go to Settings to personalise."

**Step 4: Attempting personalisation**
To replace the pre-loaded data, the user must visit Settings and navigate 11 tabs to find every relevant field. The settings tabs are: Profile, Income, Expenses, Debts, Investments, Goals, Projections, Tax, Display, Data, Charts. Each mirrors the main nav pages. This means settings and pages have overlapping data entry — for example, expense items can be edited both on expenses.html directly and in the Settings > Expenses tab. This duplication is confusing.

**Step 5: What "done" means**
There is no completion indicator showing which sections have been configured. A user cannot tell if they have missed filling in a section. There is no "setup wizard" or checklist.

### Onboarding Verdict
This is the weakest area of the product. The onboarding experience is designed for exactly one user (the author) who already knows the system. For any other user, the experience is: confused by the login mechanism, immediately shown someone else's financial data, left to figure out where to enter their own data with no guidance.

**Severity: Critical if this were to become a product. Acceptable for a personal tool.**

---

## 5. Top 5 UX Improvements by Impact

### #1 — Onboarding Wizard (Impact: Transformational)
Replace the immediate-data-on-first-login pattern with a setup flow. On first login, detect that no user data exists beyond defaults and show a 5-step wizard:
1. Profile: name, age, target age, INR/GBP rate
2. Income: salary, pension rate, tax code
3. Expenses: guided expense entry (or import from CSV)
4. Assets and debts: cash balance, pension value, any loan details
5. Goals: emergency fund target, any specific savings goals

This would reduce setup time from "30 minutes of hunting through settings tabs" to "10 minutes of guided questions." Completion progress shown as a percentage on the dashboard until setup is 100%.

### #2 — Add a Monthly Actuals Entry Flow (Impact: High)
Currently the monthly log (`fin_monthly_log`) requires manually noting netGBP and savedGBP. Adding a simple "Log this month" modal that pulls calculated net pay from income settings and asks the user to confirm/override actual take-home, then asks what they actually saved, would make the savings rate trend on Analytics far more accurate. This is a 2-minute monthly task that would transform the analytics from projections to actuals-vs-projections.

### #3 — Multiple Debt Support (Impact: High)
The Debts page being locked to SBI is a fundamental architectural limitation that prevents the app being used by anyone without exactly this loan, or by the same user when they take out a different credit product. Refactoring `fin_debts.sbi` into `fin_debts.items: []` (mirroring the expenses structure) and updating debts.js to render an array of debt cards would unlock this page for general use. The amortisation and overpayment simulator are genuinely excellent — they should be available for any loan.

### #4 — Contextual Benchmarks and Explanations (Impact: Medium-High)
The Analytics page shows benchmarks (savings rate should be 20%+, housing ratio under 30%) but provides no context for why these numbers matter or what to do when you fail a benchmark. A user who sees "Savings Rate: 8.9%" and "Benchmark: 20%" does not know whether this is catastrophic or acceptable for their life stage. Adding a small tooltip or expandable explanation panel per KPI card (1-2 sentences of context) would make the analytics page genuinely educational rather than just data display.

### #5 — Dashboard Personalisation / Widget Order (Impact: Medium)
The Overview page hardcodes four KPI cards and three gauges. The gauges are: Debt Clearance, Emergency Fund, India Trip. The India Trip gauge is extremely specific to the current user. Any other user would want to show different goals in these gauge slots. Making the three gauges configurable (from the user's active goals list) and allowing the KPI card set to be customised (e.g., add "Net Savings Rate" or hide the SBI card once debt is cleared) would significantly improve the post-setup experience.

---

## 6. Additional Pages / Features for Significant Value

### 6a. Transaction Log Page (high value)
A simple table-based page where the user manually logs transactions (or imports CSV). Each entry: date, amount, category, merchant, note. Would enable: actual vs budget comparison, spending trend charts per category, monthly variance analysis. This is the single largest gap between this app and a mainstream personal finance tool.

### 6b. Investment Returns Tracker (high value)
A page for tracking actual returns on invested assets. Currently the app projects ULIP and pension growth using assumed rates but never records actual performance. A returns tracker would log actual value at each period, calculate real CAGR, compare to projected scenarios, and show whether the aggressive/expected/conservative models are holding true.

### 6c. Net Worth History (medium-high value)
Currently `fin_monthly_log` tracks income and savings but not net worth snapshots. Adding a "record net worth snapshot" button that saves the calculated net worth at a point in time, then charts the actual historical trajectory vs the projection, would be powerful. The networth.html page is entirely projection-based; this would add the actuals line.

### 6d. Calendar / Upcoming Payments View (medium value)
A monthly calendar view showing: scheduled expense changes, loan EMI dates, tax events, goal deadlines, ULIP lock-in/pay-term dates. This makes the financial timeline tangible and helps with cash flow planning. The data to build this already exists across settings; it just needs a calendar renderer.

### 6e. Financial Health Score (medium value)
A single composite score (e.g., 0–100) calculated from: savings rate vs benchmark, housing ratio, debt-to-income, emergency fund coverage, investment rate. Show it prominently on the Overview page. It provides a quick pulse check without reading multiple charts. The underlying benchmark calculations already exist in analytics.js.

### 6f. Reminders / Milestone Celebrations (lower priority but high delight)
Browser notifications or in-app banners for: "You've paid off 50% of your loan", "Your emergency fund just hit 3 months", "You're on track for your India trip." These moments of positive reinforcement significantly improve user engagement in personal finance apps. YNAB and Emma both use this well.

---

## 7. Comparison Against YNAB, Mint, and Emma

### YNAB (You Need A Budget)
**YNAB's strength:** Zero-based budgeting methodology, every pound assigned to a job, real-time transaction entry, excellent mobile app, shared budgets for couples.
**YNAB's weakness:** No investment tracking, no debt amortisation modelling, no net worth projection, expensive ($14.99/month or $99/year).

**This app vs YNAB:**
- This app wins on: investment/asset tracking, debt modelling, net worth projection, ULIP support, multi-currency, cost (free).
- This app loses on: transaction tracking, budgeting methodology, mobile access, bank connectivity, multi-user.
- YNAB has a genuine behavioural framework (assign money before spending it). This app has no methodology — it is data display, not behaviour change.

### Mint (now discontinued, but Emma replaces it in this context)
**Mint's strength:** Bank connection, automatic transaction categorisation, credit score, free.
**Mint's weakness:** Data sold to advertisers, poor security reputation, no investment depth.

**This app vs Mint:**
- This app wins on: no data monetisation (fully local), investment depth, encryption, no advertising.
- This app loses on: bank connectivity, automation, credit score integration, no manual transaction entry.

### Emma (UK-focused)
**Emma's strength:** Open Banking (connects to Monzo, Revolut, Starling, Barclays etc.), automatic transaction categorisation, spending insights, multi-currency basics, free tier.
**Emma's weakness:** No investment projection, no loan amortisation, no ULIP support, limited planning tools, subscription for advanced features.

**This app vs Emma:**
- This app wins on: depth of financial modelling (amortisation, ULIP projections, net worth trajectory), no bank dependency, complete privacy, custom tax tracking, compound growth projector.
- This app loses on: all automation, transaction tracking, bank connectivity, credit score, mobile app, discovery/sharing features.

### Honest Gap Assessment

| Feature | This App | YNAB | Emma |
|---|---|---|---|
| Transaction tracking | None | Yes | Yes (via Open Banking) |
| Bank connectivity | None | Yes | Yes |
| Investment depth | Excellent | None | Basic |
| Loan modelling | Excellent | None | None |
| Net worth projection | Excellent | None | Basic |
| ULIP / Indian instruments | Excellent | None | None |
| Multi-currency (GBP/INR) | Good | No | Basic |
| Mobile app | None | Excellent | Excellent |
| Multi-user | None | Yes | No |
| Privacy | Excellent | Poor | Poor |
| Cost | Free | £99/year | Freemium |
| Onboarding | Poor | Good | Good |
| Behavioural nudges | None | Excellent | Good |

### Genuine Strengths of This App vs Competitors
1. The amortisation and overpayment simulator is more detailed than anything available in consumer finance apps.
2. ULIP-specific projection with three scenarios is unique — no mainstream app handles this.
3. The Sankey diagram for monthly cash flow is a genuinely sophisticated visualisation that Mint and Emma do not offer.
4. The scheduled expense changes feature (EE contract ends → cost drops automatically) is a subtle but powerful planning tool that no competitor offers.
5. Full local encryption means no data ever leaves the device. This is a genuine competitive differentiator for privacy-conscious users.
6. The Tax Tracker for HMRC underpayment resolution is niche but extremely valuable for UK workers with non-standard tax codes.

---

## 8. Monetisation Potential

### Prerequisite
Before monetisation is viable, the app would need to solve the onboarding problem (question 4), support multiple debt types (question 2), and allow multiple savings accounts. Without these, the addressable market is too small.

### Model 1: Freemium SaaS (most viable)
**Free tier:**
- All pages as currently built
- Manual data entry only
- Local encrypted storage
- Limited to 3 saved goals and 1 debt

**Paid tier (£5-8/month):**
- CSV import from banks
- Multiple debts
- Multiple savings accounts
- Unlimited goals
- Cloud backup (encrypted)
- iOS/Android mobile app (read-only view)
- Priority email support

**Market:** UK young professionals with cross-border finances (international students who moved to UK, or UK workers with India/EU family financial ties). Estimated 2-3M people in the UK fit this profile loosely.

**Realistic ARR at modest scale:** 5,000 paid users × £6/month = £360,000/year. Niche but profitable with low infrastructure cost given local-first architecture.

### Model 2: One-time purchase
A one-time payment of £29-49 for the full app with cloud sync. Lower recurring revenue but lower churn risk. Works well for a personal finance tool because users are privacy-conscious and resistant to ongoing subscription fees for financial data.

### Model 3: Professional / Accountant Tier
A white-label or multi-client version where a financial advisor or accountant manages dashboards for multiple clients. Each client's data is fully isolated and encrypted. Advisor can add comments, set benchmarks, flag goals. Pricing: £99-199/month per advisor.

### Model 4: Data Insights (most complex, highest risk)
Aggregate, anonymised benchmarks sold to financial services firms: "young professionals aged 25-30 in London earning £26-35k save X% and hold Y% of wealth in pension vs cash." This requires scale (10,000+ users) and extremely careful handling of GDPR consent. Not recommended as a primary model for a privacy-first product — it would undermine the core value proposition.

### Model 5: Integration Partnerships
Revenue sharing with financial products: referrals to SIPP providers when a user's pension is below target, referrals to ISA products when cash savings are high, referrals to debt consolidation products when loan cost is above market. Commission-based, non-exclusive. This is how Emma monetises. Risk: users trust this app precisely because it does not sell their data; this model erodes that trust.

### Recommended Path
Start with Model 1 (Freemium SaaS). The free tier preserves the current architecture (local-first, encrypted). The paid tier adds CSV import and cloud backup — both technically achievable extensions of the existing store.js encryption model. The total development investment to reach a shippable paid product is approximately 3-4 months of focused engineering (cloud sync, bank CSV parsers, mobile web optimisation, multi-debt support).

**Revenue ceiling without mobile app:** Low. Personal finance tools without mobile access will not achieve significant adoption in 2026. A mobile-responsive web view is achievable in the current architecture without a native app.

---

## Summary Scorecard

| Dimension | Score | Notes |
|---|---|---|
| Technical quality | 9/10 | Encryption, SW crypto vault, auto-save, modular JS — excellent |
| Feature depth (current user) | 9/10 | Outstanding for the specific use case |
| Feature completeness (general user) | 4/10 | Missing transactions, multiple debts, multiple accounts |
| Navigation UX | 6/10 | Functional but poorly ordered, no onboarding flow |
| Onboarding experience | 2/10 | Does not exist for anyone but the author |
| Visual design | 8/10 | Distinctive, consistent dark theme; good data-ink ratio |
| Analytics depth | 8/10 | Sankey, radar, trajectory, benchmarks — better than most paid tools |
| Market differentiation | 7/10 | ULIP + UK tax + amortisation is genuinely unique |
| Monetisation readiness | 3/10 | Needs onboarding, multi-user, and transactions before viable |

**Overall: 6.2/10 as a product. 8.5/10 as a personal finance tool.**

---

## Recommended Roadmap Priorities (in order)

1. **Guided onboarding wizard** — blocks all new users today
2. **Multi-debt support** — structural refactor of fin_debts
3. **Password change UI** — security gap, reEncryptAll function already exists
4. **Monthly actuals log UI improvement** — remove the prompt() dialogs, replace with a proper modal
5. **Mobile responsive layout** — currently sidebar-first desktop layout
6. **CSV transaction import** — unlocks actuals vs budget tracking
7. **Multiple savings accounts** — low effort, high impact for general users
8. **Financial Health Score** — analytics already exist, just needs a composite renderer
9. **Goal-configurable Overview gauges** — makes the dashboard personal for non-India-trip users
10. **Notifications / milestone banners** — engagement and delight
