# Competitive Analysis — Finance Dashboard
**Date:** 2026-06-11
**Analyst:** Research Director
**Subject:** Wallos, Actual Budget, Firefly III vs. our JARVIS Finance Dashboard

---

## Our Dashboard — Baseline

- **Pages:** Dashboard (tabbed: Overview/Income/Expenses/Debts/Assets/Net Worth/Goals/OT Tracker/Tax/Analytics), standalone Income, Expenses, Debts, Assets, Goals, Net Worth, Analytics, Tax, Export, Settings
- **Charts:** Chart.js 4 — line, bar, doughnut, radar; custom Sankey SVG; canvas gauge
- **Design language:** Dark JARVIS/Grafana — deep navy, cyan accents, JetBrains Mono for metrics
- **Storage:** localStorage only, no server, no sync
- **Differentiator:** Dual UK+India NRI tax (PAYE/Self-Assessment + ELSS/PPF/ULIP/NPS/SGBs), INR/GBP dual-currency, ISA/SIPP/SGB/ULIP tracking

---

## Source 1: Wallos

**Repository:** https://github.com/ellite/Wallos
**Stars:** ~10 k+ | **License:** GPLv3 | **Stack:** PHP/Docker, self-hosted

### Features

- Subscription & recurring payment tracker (core focus — not a full finance tracker)
- Category management with custom categories
- Multi-currency support with live exchange rates via Fixer API
- Household/multi-user support — shared subscriptions across family
- Logo search to auto-brand subscription entries
- Notification channels: email, Discord, Pushover, Telegram, Gotify, webhooks
- AI-powered spend recommendations via ChatGPT, Gemini, or local Ollama
- OIDC/OAuth authentication (enterprise-grade auth for a personal app)
- Cron-based background jobs for exchange rate updates and notifications
- Multi-language localisation with community translations
- Calendar view of upcoming payment dates
- Statistical spend analysis by category and time period

### UI Patterns

- Light/dark theme toggle (both variants ship)
- Clean, minimal card layout — subscription list as the primary surface
- Calendar view for payment timeline (month grid with payment markers)
- Status indicators on subscription cards (active/paused/cancelled)
- Multiple sort perspectives on subscription list (name, amount, date, category)
- Mobile-optimised responsive layouts — touch-friendly, condensed hierarchy

### Visualizations

- Category breakdown charts (implied pie/bar from category management)
- Spending trend lines over time (statistics view)
- Calendar heatmap / payment schedule view

### Mobile UX

- Dedicated mobile layouts for dashboard and subscription list
- Touch-optimised tap targets
- Condensed sidebar navigation on small screens
- Full parity between desktop and mobile feature sets

### What we can borrow

- **Calendar view of payment/bill dates** — we have no scheduled payment calendar
- **Notification system** (email/webhook) for upcoming bills or budget thresholds being crossed
- **Multi-user/household support** — shared finances across partners
- **AI spend recommendations** — local LLM option via Ollama preserves privacy
- **Subscription tracking as a distinct module** — we lump it under Expenses
- **Light theme variant** — our JARVIS dark-only may be inaccessible in bright environments

---

## Source 2: Actual Budget

**Repository:** https://github.com/actualbudget/actual
**Stars:** ~18 k+ | **License:** MIT | **Stack:** TypeScript/Node, Electron + Web, Docker

### Features

- **Envelope budgeting** — assign every pound/dollar to a category before spending it
- **Tracking budget mode** — looser alternative for users who prefer retrospective tracking
- Account register with full transaction history
- Recurring transaction scheduling
- Transaction import (OFX, QIF, CSV from banks)
- Rule-based automatic transaction categorisation
- Payees management with deduplication
- Reports dashboard with visual financial summaries
- Cross-device sync via self-hosted server (local-first, no cloud lock-in)
- Backup and restore
- API access for external integrations
- Custom themes
- Migration tools from YNAB and other budgeting apps
- Desktop apps (Windows, Mac, Linux via Electron) + browser PWA
- Internationalization via Weblate

### UI Patterns

- Left sidebar navigation — persistent, icon + label style
- Tabbed account views within the main panel
- Progressive disclosure — sub-menus expand on demand, not overwhelming on first load
- Budget grid: rows = categories, columns = months, cells = budgeted/spent/remaining
- Transaction register: table view with inline editing
- Right-side contextual panels for detail views
- Search/filter bar across transactions covering merchant, amount, category

### Visualizations

- **Reports dashboard:** spending by category over time
- Bar charts for monthly income vs. expenses
- Line charts for net worth over time
- Pie/donut charts for spending breakdown by category
- Filterable date ranges on all charts (week/month/quarter/year/custom)

### Mobile UX

- Responsive PWA — works on mobile browser without native app
- Collapsed hamburger navigation on small screens
- Touch-friendly transaction entry
- Simplified budget grid view on mobile

### What we can borrow

- **Envelope budgeting module** — allocate income to buckets before spending; we only track actuals
- **Rule-based auto-categorisation** — auto-tag transactions on import
- **Transaction import (CSV/OFX)** — we have CSV export but not import
- **Filterable date ranges on all charts** — our charts use fixed periods
- **Budget grid view** — monthly category budget vs. actual, visualised as a table
- **Multi-month budget planning view** — forward-looking allocation
- **Net worth chart (time-series)** — we have a net worth page but no historical trend line

---

## Source 3: Firefly III

**Repository:** https://github.com/firefly-iii/firefly-iii
**Stars:** ~18 k+ | **License:** AGPL-3.0 | **Stack:** PHP/Laravel + Vue.js, Docker/Kubernetes

### Features

- **Double-entry bookkeeping** — every transaction has a source and destination account (the gold standard for accuracy)
- Recurring transaction management with flexible schedules
- **Rule-based transaction handling** — user-defined rules for auto-categorisation, tagging, and account assignment
- Budget management with budget limits per period
- Category and tag organisation (two separate taxonomies)
- **Piggy banks** — named savings goals with visual progress
- Multi-currency support (any currency, with exchange rate tracking)
- Income and expense reports with charts
- Financial report generation
- REST JSON API covering nearly every feature
- Two-factor authentication
- Data import via external importer tool (supports many bank formats)
- Dashboard with configurable widgets
- Bill tracking (recurring expected outflows)
- Account types: asset, liability, expense, revenue, cash
- Webhook support for external integrations
- Eco-system of third-party tools and mobile apps (Abacus, Waterfly for iOS/Android)

### UI Patterns

- Sidebar navigation with icon + label
- Dashboard with configurable widget panels
- Table-based transaction lists with column sorting and filtering
- Inline transaction editing
- Date range selectors on all report views
- Tag cloud / tag-based filtering
- Breadcrumb navigation on detail pages
- Modal dialogs for quick transaction entry
- Account balance sparklines in the account list

### Visualizations

- **Income vs. expenses bar chart** (monthly)
- **Account balance over time** line charts
- **Budget usage progress bars** (budget limit vs. spent)
- **Category spending** pie and bar charts
- **Income/expense reports** with comparative period views
- **Net worth over time** line chart
- **Piggy bank progress** bars (savings goal completion)
- **Bill payment calendar** (upcoming/overdue bills)

### Mobile UX

- Fully responsive — iPhone, iPad, and desktop layouts tested
- Third-party native mobile apps available (Abacus on Android, Waterfly on iOS/Android)
- Mobile-optimised transaction entry via companion apps

### What we can borrow

- **Double-entry bookkeeping** — increases accuracy, prevents phantom balances
- **Piggy banks / named savings pots** — more granular than our single Goals page
- **Bill tracker with calendar view** — separate module for expected recurring outflows
- **Tag system alongside categories** — two-dimensional transaction labelling
- **Account balance sparklines in list views** — quick visual without opening detail
- **Configurable dashboard widgets** — user can rearrange panels to suit their workflow
- **Period-comparative reports** — this month vs. last month vs. same month last year
- **Third-party mobile app companion** — our dashboard has no mobile-native path
- **Webhook/API** — enables automation (IFTTT, n8n, Home Assistant integrations)

---

## Source 4: Industry Research — UI/UX Best Practices 2025–2026

*Sources: eleken.co Fintech Design Guide, wildnetedge.com Fintech UX Best Practices, AdminLTE/TailAdmin dashboard template research, UXPin Dashboard Design Principles*

### Design Patterns Validated by Industry

- **Card-based layouts** with interactive mini-graphs inside cards for at-a-glance trends — we partially do this but cards lack embedded sparklines
- **Four core surfaces rule:** balance/net-worth KPIs → cash flow view → transactions feed → budgets/goals — our tab structure matches but the hierarchy on the dashboard overview could be sharper
- **Top banner:** total balance + daily/monthly delta — we have KPI cards but no delta indicator
- **Purposeful colour coding:** green = gain, red = loss, amber = warning — we use cyan universally, which loses signal value
- **Pie charts capped at 4 segments** — more than 4 becomes noise; our category donuts sometimes exceed this
- **Anti-patterns to avoid:** 3D chart effects, dual-axis charts, purely decorative visualisations — we are clean here
- **Progressive disclosure** — hiding secondary data until requested, not dumping everything on first render
- **44×44 px minimum touch targets** for mobile
- **WCAG 2.1 AA** compliance — colour-independent meaning, keyboard navigation
- **Gamification:** progress bars, milestone celebrations for savings goals
- **Heat maps** for spending pattern analysis (day-of-week × week-of-month)
- **Conversational AI interface** — natural language queries ("show expenses above £500 this month")
- **Biometric / passwordless auth** — we have no auth at all currently
- **PWA / offline-first** — we use localStorage which is a partial implementation; full PWA with service worker would complete this
- **Omnichannel consistency** — seamless desktop-to-mobile experience

---

## Top 20 Features We Should Add or Improve

Prioritised by impact-to-effort ratio for a single-dev localStorage-first dashboard.

| # | Feature | Why | Effort | Source |
|---|---------|-----|--------|--------|
| 1 | **Transaction CSV import** | Currently export-only. Closes the loop — users can import bank statements and stop manual entry. Highest friction point for any finance tracker. | Medium | Actual Budget |
| 2 | **Budget envelope module** | Allocate income to category buckets before spending. "Zero-based" budgeting is the most effective behaviour-change pattern in personal finance. We track actuals; this adds forward planning. | Medium | Actual Budget |
| 3 | **Bill / subscription calendar** | Dedicated view showing upcoming payments on a monthly calendar. Wallos is built entirely around this. We lump subscriptions into Expenses with no upcoming-payment awareness. | Medium | Wallos + Firefly III |
| 4 | **Net worth time-series chart** | Our Net Worth page shows a snapshot. A 12-month or all-time line chart turns it into a trend story. Emotionally this is the most motivating chart in personal finance. | Low | Firefly III + Industry |
| 5 | **Delta indicators on KPI cards** | Show +/- vs. last month on every top-level metric (income, expenses, net worth, savings rate). Currently cards show static values only. | Low | Industry best practice |
| 6 | **Rule-based auto-categorisation** | User defines rules ("if description contains 'Tesco' → Groceries"). Applied on import. Eliminates manual re-categorisation. | Medium | Actual Budget + Firefly III |
| 7 | **Piggy banks / named savings pots** | Break the Goals page into named sub-pots (Emergency Fund, Japan Trip, Car). Each has a target, a deadline, and a visual fill progress. More granular than a single Goals array. | Low–Medium | Firefly III |
| 8 | **Spending heat map** | Calendar heat map (GitHub-contribution style) showing spend intensity by day. Instantly reveals patterns (weekend splurges, payday spikes). | Low | Industry 2026 |
| 9 | **Period-comparative charts** | "This month vs. last month vs. same month last year" toggle on income/expenses charts. Critical for spotting drift. | Medium | Firefly III + Industry |
| 10 | **Account balance sparklines in lists** | Tiny inline line charts next to each account/asset row showing 30-day trend without navigating away. | Low | Firefly III |
| 11 | **Tag system alongside categories** | Add a free-form tag field to transactions (e.g. "holiday", "one-off", "reimbursable"). Enables cross-category filtering that categories alone cannot do. | Low | Firefly III |
| 12 | **Notification / alert system** | Browser notifications or email (via mailto: link) when: a bill is due in 3 days, monthly spend in a category exceeds budget, net worth drops below threshold. | Medium | Wallos |
| 13 | **Savings rate tracking** | Single headline metric: (income − expenses) / income × 100. Displayed prominently on dashboard. The one number that summarises financial health. Not currently present. | Low | Industry |
| 14 | **Upcoming payments widget** | Dashboard widget listing next 7 days of scheduled outflows (rent, subscriptions, loan EMIs). Pull from recurring entries already in Debts/Expenses. | Low | Wallos + Firefly III |
| 15 | **Light theme variant** | JARVIS dark works at a desk; it's inaccessible in sunlight. A neutral light theme (toggle) expands usability. Wallos ships both. | Medium | Wallos + Industry |
| 16 | **Printable / PDF export** | Export any chart or summary as PDF for sharing with an accountant or CA. Currently only CSV export. | Low–Medium | General need |
| 17 | **Double-entry mode (optional)** | Optional toggle for power users who want to see source → destination on every transaction (e.g. "Salary: HDFC → Current Account"). Adds audit integrity. | High | Firefly III |
| 18 | **AI spend insights (local)** | Integrate a local prompt-based suggestion system: summarise last month's spending, flag anomalies, suggest savings opportunities. Use Ollama or OpenAI API key (user-provided). | High | Wallos + Industry |
| 19 | **PWA full offline support + install** | We have `sw.js` already. Complete the service worker with proper caching strategy + Add-to-Home-Screen manifest so it installs as a native-feeling app. | Low | Industry |
| 20 | **Keyboard shortcuts** | Power-user navigation (e.g. `G D` → Dashboard, `G E` → Expenses, `N` → New transaction). Industry standard for data-heavy apps. None currently exist. | Low | Industry best practice |

---

## Top 10 UI/UX Improvements

Specific, implementable changes to the existing interface.

| # | Improvement | Implementation detail |
|---|-------------|----------------------|
| 1 | **Add delta badges to KPI cards** | Below each metric value, render `▲ £340 vs last month` in green or `▼ £120` in red. Pull prior-period value from localStorage on page load. One additional calculation per card. |
| 2 | **Replace universal cyan with a semantic colour system** | Cyan = neutral/highlight. Green (`#22c55e`) = income/gain. Red (`#ef4444`) = expense/loss. Amber (`#f59e0b`) = warning/approaching limit. Apply consistently across all charts and badges. |
| 3 | **Cap doughnut chart segments at 5; add "Other" bucket** | Any category representing less than 5% of total gets rolled into an "Other" slice. Prevents unreadable 10-slice donuts. Add a tooltip on "Other" that lists the constituent categories. |
| 4 | **Add inline sparklines to asset/account rows** | In the Assets and Debts tables, render a 60px × 24px SVG sparkline in a new "Trend" column using the last 6 months of stored values. Zero DOM overhead, high information density. |
| 5 | **Sticky section header with live net worth** | Replace the static page title in the topbar with a live `Net Worth: £X,XXX` figure that updates as the user edits values on any page. Keeps the anchor number always visible. |
| 6 | **Progressive dashboard loading** | Skeleton screens (CSS shimmer placeholders) while chart data is being computed from localStorage. Currently the page flickers blank before rendering. Instant perceived performance improvement. |
| 7 | **Contextual tooltips on tax fields** | The Tax page has NRI-specific fields (DTAA relief, RNOR status, NPS Tier 2) that are opaque without explanation. Add an `ⓘ` icon with a plain-English tooltip next to each. |
| 8 | **Unified "Add Transaction" modal** | Floating `+` button (bottom-right, always visible) that opens a single modal for adding income, expense, or transfer with a type toggle at the top. Eliminates the need to navigate to the correct page before adding. |
| 9 | **Chart date-range filter bar** | A persistent "Last 3M / 6M / 1Y / All / Custom" pill-button bar above every chart section. Currently charts default to fixed periods with no user control. |
| 10 | **Empty-state illustrations with CTAs** | When a page has no data (new user, or category with no transactions), show a minimal line illustration and a clear call-to-action button ("Add your first expense"). Currently shows blank/broken chart containers. |

---

## Summary Assessment

Our dashboard is technically ahead of all three competitors on NRI-specific features (dual currency, dual tax system, ULIP/ELSS/SGBs/NPS). It is behind on:

1. **Import** — no inbound data path
2. **Budget planning** — tracks actuals, doesn't plan forward
3. **Scheduling/calendar** — no awareness of future payments
4. **UI polish** — semantic colours, delta indicators, sparklines, empty states
5. **Mobile** — no install path, no touch optimisation

The highest ROI changes are items 1–6 in the features list and items 1–3 in UI/UX — all achievable without a backend.
