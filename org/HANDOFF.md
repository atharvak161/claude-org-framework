# Chief of Staff Handoff — Finance Dashboard Betterment
**Written:** 2026-06-13 16:10:03
**Reason:** macOS TCC revoked Downloads folder access mid-session. src/projects/ unreadable until terminal permissions are restored.
**Next session:** Read this file first, then proceed to "Immediate next action" below.

---

## Context

Atharva asked for a competitive analysis of the finance dashboard vs Wallos and similar apps, with UI improvements implemented across multiple waves. Session ended mid-wave-3 due to macOS TCC permission failure blocking all access to `src/projects/`.

---

## Project locations

- **Dashboard repo (submodule):** `/Users/atharva/Downloads/organisation/src/projects/financial-dashboard/`
- **GitHub remote:** `https://github.com/atharvak161/finance-dashboard.git`
- **Parent org repo:** `/Users/atharva/Downloads/organisation/`

---

## DONE and PUSHED to GitHub

### Wave 1 — commit `18e6d9a`
- Sparklines on 5 dashboard KPI cards (green/red/cyan trend)
- Metric card left accent bar (colour by trend), hover micro-lift
- Budget utilization bar on Expenses (green→amber→red + category chips)
- Analytics KPI cards: status dot glow, benchmark label, status text
- OT Tracker full build — add-shift form, 4 summary cards, shifts table, bar + doughnut charts
- Mobile bottom navigation bar — fixed 5-tab bar <768px

### Wave 2 — commit `4afe54d`
- Delta badges on all 5 KPI cards (`▲ £340 vs last month`, green/red)
- Monthly Commitments widget on dashboard — ranked recurring expenses + SBI EMI, top 8
- Spending Category × Month heat map on analytics — cyan intensity, CSS tooltip

### Research docs (in parent org repo)
- `docs/design/financial-dashboard/COMPETITIVE_ANALYSIS.md` — Wallos, Actual Budget, Firefly III
- `docs/design/financial-dashboard/UX_IMPROVEMENT_PLAN.md` — 19 improvements, 4 bugs
- `docs/design/financial-dashboard/EXTENDED_COMPETITIVE_ANALYSIS.md` — 10 more repos (Ghostfolio, Ocular, Hisabi, BeeCount, ezBookkeeping, etc.)

---

## DONE but NOT COMMITTED (wave 3 — on disk only)

These files are written and correct but not yet committed. Confirmed via `git diff --stat` before TCC failure.

```
analytics.html            |   9 +++
assets.html               |   2 +
css/components.css        |  50 +++
css/layout.css            |  16 +++
js/defaults.js            |   1 +
js/pages/analytics.js     | 151 +++
js/pages/settings-page.js |  16 +++
js/shared-layout.js       |  29 +++
js/page-init.js           |  25 +++
```

What each delivers:
- **YoY Budget Comparison Chart** — grouped bar, this FY vs last FY, income + expenses, toggle, fiscal-year-aware
- **Custom April–April Fiscal Year** — Settings dropdown "Financial year starts", default April, controls all YoY calcs
- **Privacy Mode** — eye icon in topbar, one click blurs all £ values with cyan glow, sessionStorage
- **Inline Expression Evaluation** — type `900+50` in any numeric input, Tab/blur → `950`. Safe parser only.
- **ROAI CSS + HTML placeholder** — `.roai-summary-grid`, `.roai-table`, badge classes, `<div id="roai-section">` in assets.html

---

## IMMEDIATE NEXT ACTION — one task remaining

### Write `renderROAI(st)` in `js/pages/assets.js`

This is the only thing missing. Two agents stalled trying to read the 726-line file. Once access is restored, spawn a focused agent or handle directly.

**What to build** (CSS and HTML placeholder already done):

**Section A — 4 summary metric cards (`.roai-summary-grid`)**
1. Portfolio Value — sum of all investments converted to GBP
2. Est. Invested — sum of estimated invested amounts
3. Total Gain — Value − Invested (`.roai-positive` if +, `.roai-negative` if -)
4. Overall ROAI % — `.roai-badge-green` ≥10%, `.roai-badge-amber` 0–10%, `.roai-badge-red` <0%, `.roai-badge-na` if no data

**Section B — per-investment table (`.roai-table`)**
Columns: Investment | Type | Value (GBP) | Est. Invested | Gain/Loss | ROAI %

Data from `st.investments`, rate = `st.profile?.inrGbpRate || 83`:
- `pensions[]` → `valueGBP`, invested = N/A ("—")
- `ulips[]` → `currentValue` (÷rate if `currency==='INR'`), invested = `monthlyPremium × monthsElapsed`
- `isa.stocksAndSharesISA` → `currentValueGBP`, invested = `annualContributionGBP * 3`
- `sipp` → `currentValueGBP`, invested = `annualContributionGBP * 3`
- `nps` → `(tier1ValueINR + tier2ValueINR) / rate`, invested = N/A
- `elss[]` → `currentValueINR / rate`, invested = `monthlyINR × monthsSinceLockIn`
- `ppf` → `currentValueINR / rate`, invested = N/A
- `sgbs[]` → `purchasePriceINR × gramsHeld / rate`, invested = same (no gain unless interest accrued)

Add `.alert-info` note below table: "Invested amounts are estimates — actual ROAI may differ."

**Wire-up:** call `renderROAI(st)` as the first call in the page render/init so it appears above the tabs.

---

## After ROAI is done — commit sequence

```bash
# 1. Commit wave 3 in submodule
cd /Users/atharva/Downloads/organisation/src/projects/financial-dashboard
git add analytics.html assets.html css/components.css css/layout.css \
  js/defaults.js js/pages/analytics.js js/pages/assets.js \
  js/pages/settings-page.js js/shared-layout.js js/page-init.js
git commit -m "Dashboard wave 3: YoY chart, fiscal year, privacy mode, inline eval, ROAI metrics"
git push origin main

# 2. Update parent org repo
cd /Users/atharva/Downloads/organisation
git add src/projects/financial-dashboard org/HANDOFF.md org/ACTIVITY.md
git commit -m "Finance dashboard wave 3: complete"
```

---

## Wave 4 — next features queued (not started)

| # | Feature | Source | Notes |
|---|---|---|---|
| 1 | SMS transaction parser (India UPI) | Hisabi | Auto-detect bank SMS → categorise. Huge for NRI workflow |
| 2 | CSV import from bank statements | Actual Budget | Revolut/Monzo CSV → map to expenses. Export exists, import does not |
| 3 | Cashflow indicator KPI | ExpenseOwl | Single headline income vs expenses, colour-coded |
| 4 | Bill/subscription calendar view | Wallos | Monthly grid showing when recurring payments fall due |
| 5 | Period-comparative reports | Firefly III | This month vs last month vs same month last year |
| 6 | OLED dark mode | BeeCount | Pure #000000 background toggle option |
| 7 | Keyboard shortcuts | Ocular | G+D = Dashboard, G+E = Expenses, N = New entry |
| 8 | Envelope budgeting module | Actual Budget | Allocate income to buckets before spending |

---

## Pending from Atharva

- Payslip + Revolut statement + credit card statement — offered but not yet shared. Once shared:
  1. Map actual income structure to dashboard Settings fields
  2. Extract real expense categories
  3. Produce a Settings data brief (exact numbers to paste in)

---

## macOS fix required before resuming

TCC revoked Downloads access. Fix:
1. System Preferences → Privacy & Security → Files & Folders
2. Find Terminal / iTerm2 / Claude Code app
3. Toggle Downloads access off → on
4. Restart terminal / Claude Code session
