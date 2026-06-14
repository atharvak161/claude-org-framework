# UX Improvement Plan — Finance Dashboard

**Audit date:** 2026-06-11  
**Stack:** Vanilla HTML/CSS/JS · Chart.js 4.4.1 · localStorage · No server  
**Design system:** JARVIS/Grafana dark — deep navy, cyan (#00bfff) accents  
**Pages audited:** dashboard.html, expenses.html, analytics.html, networth.html, goals.html, tax.html, settings.html, overtime.html

---

## Priority 1: High-impact, low-effort (implement first)

These require no architectural change — CSS additions and small JS tweaks only.

---

### 1.1 — Last-updated timestamp on every data section

**Problem:** No data freshness signal. User cannot tell if the displayed numbers reflect today's state or stale localStorage.

**What to change:**
- In `js/page-init.js` (wherever `saveSec` writes to localStorage), store a timestamp alongside every section key: `{ data: ..., updatedAt: Date.now() }`.
- In `css/components.css`, add:

```css
/* ── Last-updated tag ───────────────────────────────────── */
.last-updated {
  font-size: 10.5px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}
.last-updated::before {
  content: '';
  display: inline-block;
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--color-positive);
  box-shadow: 0 0 6px var(--glow-positive);
}
.last-updated.stale::before {
  background: var(--color-warning);
  box-shadow: 0 0 6px var(--glow-warning);
}
```

- Render `<span class="last-updated [stale?]">Updated 2m ago</span>` in the `.panel-header` right side on all data panels. Mark as `.stale` if >24 hours old.
- Files: `js/page-init.js`, `js/pages/dashboard.js` (all `panel()` helper calls), `css/components.css`

---

### 1.2 — Budget alert badges on metric cards

**Problem:** No visual warning when expense categories approach or exceed budget. The `--color-warning` and `--color-negative` tokens exist but are unused for budget signals.

**What to change:**
- In `js/pages/dashboard.js` — `renderExpenses()` and `renderAnalytics()`: compute per-category budget usage percentage against `st.settings?.chartParams?.budgetByCategory`.
- Extend the `metricCard()` helper to accept an optional `alertPct` argument:

```js
function metricCard(label, value, colorClass, sub, alertPct = null) {
  let alertBadge = '';
  if (alertPct !== null) {
    if (alertPct >= 100) alertBadge = `<span class="budget-alert budget-alert--over">OVER</span>`;
    else if (alertPct >= 85) alertBadge = `<span class="budget-alert budget-alert--warn">${alertPct.toFixed(0)}%</span>`;
  }
  // ... rest of template, add alertBadge inside .metric-card
}
```

- In `css/components.css`, add:

```css
/* ── Budget alert badges on metric cards ───────────────── */
.budget-alert {
  font-size: 9px; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase; font-family: var(--font-mono);
  padding: 1px 5px; border-radius: 3px;
  position: absolute; top: 10px; right: 10px;
}
.budget-alert--warn {
  background: rgba(255,145,0,0.18);
  color: var(--color-warning);
  border: 1px solid rgba(255,145,0,0.35);
}
.budget-alert--over {
  background: rgba(255,23,68,0.18);
  color: var(--color-negative);
  border: 1px solid rgba(255,23,68,0.4);
  animation: alertPulse 1.5s ease-in-out infinite;
}
@keyframes alertPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}
```

- Files: `js/pages/dashboard.js`, `css/components.css`

---

### 1.3 — Elevated empty states

**Problem:** `.empty-state` exists in `css/components.css` (line 399) but the SVG opacity is 0.3 and the text is just `color: var(--text-muted)` — nothing to guide the user to action.

**What to change:**
- Update `.empty-state` in `css/components.css`:

```css
.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.empty-state svg { opacity: 0.25; }
.empty-state-title {
  font-size: 14px; font-weight: 600;
  color: var(--text-secondary);
}
.empty-state-body {
  font-size: 13px;
  color: var(--text-muted);
  max-width: 280px;
  line-height: 1.6;
}
.empty-state .btn { margin-top: 4px; }
```

- In `expenses.js` (line 127): replace the plain `<p class="label-muted">` empty state with the structured empty state including a "+ Add change" CTA button.
- In `js/pages/dashboard.js` — `renderOT()` when no shifts: show structured empty state with CTA to log first shift.
- Files: `css/components.css`, `js/pages/expenses.js`, `js/pages/dashboard.js`

---

### 1.4 — Dash-tab horizontal scroll indicator on narrow viewports

**Problem:** `.dash-tabs` uses `overflow-x: auto` (components.css line 632) but there's no visual affordance that tabs are scrollable on 1024–1280px screens. The 10-tab strip clips silently.

**What to change:**
- In `css/components.css`, add a fade mask on the right edge of `.dash-tabs`:

```css
.dash-tabs-wrap {
  position: relative;
}
.dash-tabs-wrap::after {
  content: '';
  position: absolute;
  top: 0; right: 0;
  width: 48px; height: 100%;
  background: linear-gradient(to left, var(--bg-canvas) 0%, transparent 100%);
  pointer-events: none;
  z-index: 2;
}
```

- In `dashboard.html`, wrap `<div class="dash-tabs" id="dash-tabs">` in `<div class="dash-tabs-wrap">`.
- Files: `dashboard.html`, `css/components.css`

---

### 1.5 — Active nav item persistence across page loads

**Problem:** Navigation sidebar (`layout.css` `.nav-item.active`) correctly styles the active item, but there is no visible breadcrumb or page-level indicator showing which major section the user is in when they're on a standalone page (e.g., `expenses.html`).

**What to change:**
- In `css/layout.css`, enhance `.nav-item.active` with a more prominent left-border glow:

```css
.nav-item.active {
  /* existing styles preserved — append: */
  box-shadow:
    inset 3px 0 0 rgba(0,191,255,0.15),
    inset 0 0 20px rgba(0,191,255,0.04);
}
```

- Add a subtle page-level indicator badge next to the topbar title showing the current section name in `--color-info` at 10px uppercase mono. Implement in `js/topbar.js` (or whichever shared topbar init file exists).
- Files: `css/layout.css`, shared topbar init JS

---

## Priority 2: Medium-effort feature improvements

---

### 2.1 — Sparklines on summary metric cards

**Problem:** The 8 metric cards on `dashboard.html` Overview tab and per-page summaries show a static number with no trend. A 6-point sparkline would communicate direction without adding visual weight.

**Implementation approach:**
- Add a sparkline rendering utility in `js/components/sparkline.js` (new file):

```js
// Renders a mini SVG sparkline into a container element
export function renderSparkline(container, values, color = '#00bfff') {
  if (!values || values.length < 2) return;
  const W = 80, H = 28;
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * W;
    const y = H - ((v - min) / range) * H;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  container.innerHTML =
    `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${pts.split(' ').pop().split(',')[0]}" cy="${pts.split(' ').pop().split(',')[1]}" r="2.5" fill="${color}"/>
    </svg>`;
}
```

- In `css/components.css`, add a `.metric-card-sparkline` slot:

```css
.metric-card-sparkline {
  position: absolute;
  bottom: 14px; right: 14px;
  opacity: 0.6;
  pointer-events: none;
}
.metric-card:hover .metric-card-sparkline { opacity: 1; }
```

- Extend `metricCard()` in `dashboard.js` to accept a `sparklineData` argument. Render the sparkline div in the card HTML, then call `renderSparkline()` after `innerHTML` is set.
- Feed sparkline data from `st.monthlyLog` for net income and savings trends.
- Files: `js/components/sparkline.js` (new), `js/pages/dashboard.js`, `css/components.css`

---

### 2.2 — Floating Action Button (FAB) for quick-add

**Problem:** Adding an expense, logging an OT shift, or updating a goal requires navigating to the specific page. A FAB provides a universal shortcut to the most common write actions.

**Implementation approach:**
- In `css/components.css`, add FAB styles:

```css
/* ── Floating Action Button ─────────────────────────────── */
.fab {
  position: fixed;
  bottom: 28px; right: 28px;
  width: 52px; height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0050e6, #00bfff);
  border: none;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow:
    0 4px 20px rgba(0,191,255,0.5),
    0 0 40px rgba(0,191,255,0.2);
  z-index: 400;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.fab:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 30px rgba(0,191,255,0.7), 0 0 60px rgba(0,191,255,0.3);
}
.fab svg { width: 22px; height: 22px; color: #fff; }

/* FAB action menu */
.fab-menu {
  position: fixed;
  bottom: 90px; right: 28px;
  display: flex; flex-direction: column-reverse; gap: 10px;
  z-index: 399;
  pointer-events: none; opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fab-menu.open {
  pointer-events: auto; opacity: 1; transform: translateY(0);
}
.fab-action {
  display: flex; align-items: center; gap: 10px;
  background: var(--bg-panel);
  border: 1px solid var(--border-medium);
  border-radius: 24px;
  padding: 8px 16px 8px 12px;
  cursor: pointer;
  font-size: 13px; font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
  transition: background 0.15s ease, border-color 0.15s ease;
}
.fab-action:hover {
  background: var(--bg-panel-hover);
  border-color: var(--border-strong);
}
.fab-action svg { width: 16px; height: 16px; color: var(--color-info); flex-shrink: 0; }
```

- Create `js/components/fab.js` (new file) that injects the FAB into `document.body` and handles the three quick-add actions: Add Expense (opens inline modal), Log OT Shift, Update Goal. Wire it up in each page's init by calling `initFab(state)`.
- Files: `js/components/fab.js` (new), `css/components.css`, all page JS files (1-line import + init call)

---

### 2.3 — Progress bars with threshold warnings on goals

**Problem:** The `.progress-fill` classes (components.css lines 253–268) use colour to indicate health but don't animate or visually pulse when approaching a deadline.

**What to change:**
- In `goals.html` / `js/pages/goals.js`, replace plain gauge panels for India Trip and Emergency Fund with a richer progress card pattern:

```html
<!-- Pattern to implement in goals.js renderGoalCard() helper -->
<div class="goal-card">
  <div class="goal-card-header">
    <span class="goal-card-title">India Trip</span>
    <span class="badge badge-warning">42 days left</span>
  </div>
  <div class="goal-card-amounts">
    <span class="metric-sm text-positive">£1,240</span>
    <span class="label-muted"> of £3,000</span>
  </div>
  <div class="progress-wrap mt-12">
    <div class="progress-track">
      <div class="progress-fill warning progress-fill--animated" style="width:41%"></div>
    </div>
    <div class="progress-label"><span>41%</span><span>£1,760 to go</span></div>
  </div>
  <div class="goal-card-rate label-muted mt-8">Need £42/wk to hit target</div>
</div>
```

- In `css/components.css`, add:

```css
/* ── Goal card ──────────────────────────────────────────── */
.goal-card {
  background: linear-gradient(135deg, #141929 0%, #0f1628 100%);
  border: 1px solid rgba(0,191,255,0.12);
  border-radius: var(--radius-lg);
  padding: 20px;
  position: relative;
}
.goal-card-header {
  display: flex; align-items: center;
  justify-content: space-between; margin-bottom: 8px;
}
.goal-card-title {
  font-size: 11px; font-weight: 700;
  color: rgba(0,191,255,0.7);
  text-transform: uppercase; letter-spacing: 0.1em;
}
.goal-card-amounts { margin-bottom: 2px; }
.goal-card-rate { font-size: 12px; }

/* Animated progress fill */
.progress-fill--animated {
  position: relative; overflow: hidden;
}
.progress-fill--animated::after {
  content: '';
  position: absolute; top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  animation: shimmer 2s ease-in-out infinite;
}
@keyframes shimmer {
  to { left: 100%; }
}
```

- Files: `js/pages/goals.js`, `css/components.css`

---

### 2.4 — Expenses page: category filter and sort controls

**Problem:** `expenses.html` shows all expenses in a single unsorted table. With 10+ items, scanning is inefficient. No sort by amount, no filter by category.

**What to change:**
- In `expenses.js` `render()`, add a filter/sort bar above the table:

```html
<div class="table-controls">
  <div class="table-filter">
    <select class="form-select" id="exp-cat-filter" style="width:160px">
      <option value="">All categories</option>
      <!-- CATS options -->
    </select>
    <select class="form-select" id="exp-sort" style="width:140px">
      <option value="default">Default order</option>
      <option value="amount-desc">Highest first</option>
      <option value="amount-asc">Lowest first</option>
      <option value="name">Name A–Z</option>
    </select>
  </div>
  <span class="label-muted" id="exp-filter-count">12 items · £X,XXX/mo</span>
</div>
```

- In `css/components.css`, add:

```css
/* ── Table controls bar ─────────────────────────────────── */
.table-controls {
  display: flex; align-items: center;
  justify-content: space-between;
  flex-wrap: wrap; gap: 8px;
  margin-bottom: 12px;
}
.table-filter { display: flex; gap: 8px; flex-wrap: wrap; }
```

- Implement filter/sort logic in `expenses.js` using a `filteredItems()` function that reads the select values and applies before rendering the table rows.
- Files: `js/pages/expenses.js`, `css/components.css`

---

### 2.5 — Summary metric on the expenses page: show only one card, expand to three

**Problem:** `expenses.js` line 22–31 renders only a single metric card spanning `grid-3` — the other two columns are blank. There is already layout for three.

**What to change:**
- Fill the full `grid-3` with three cards: Monthly Total (existing), Largest Category (computed from `expensesByCategory()`), and Month-over-Month delta (from `st.monthlyLog` if available).
- This is a JS-only change in `js/pages/expenses.js` — no new CSS required.

---

### 2.6 — Analytics page: link KPI benchmarks to explanatory tooltips

**Problem:** KPI cards on `analytics.html` show "Benchmark 20%+" as a plain `.sub` string. Users don't know why 20% is the benchmark or what it means for their situation.

**What to change:**
- In `css/components.css`, add a tooltip pattern:

```css
/* ── Inline tooltip ─────────────────────────────────────── */
[data-tooltip] {
  position: relative; cursor: help;
}
[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 6px); left: 50%;
  transform: translateX(-50%);
  background: #0a0e1c;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 6px 10px;
  font-size: 11.5px;
  color: var(--text-secondary);
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease;
  z-index: 500;
  font-family: var(--font-body);
  box-shadow: 0 4px 16px rgba(0,0,0,0.5);
}
[data-tooltip]:hover::after { opacity: 1; }
```

- Add `data-tooltip="..."` attributes to benchmark `.sub` text in `js/pages/analytics.js` and the dashboard `renderAnalytics()` function.
- Files: `css/components.css`, `js/pages/analytics.js`, `js/pages/dashboard.js`

---

### 2.7 — Settings page: consolidate dense data input with section accordions

**Problem:** `settings.html` exposes three tabs (Display / Data / Charts) but the Data tab likely has dense form fields (income, investments, debts, goals) all visible at once, creating cognitive overload.

**What to change:**
- In `js/pages/settings-page.js`, wrap each logical data group in a collapsible accordion:

```html
<details class="settings-accordion" open>
  <summary class="settings-accordion-header">
    <span>Income</span>
    <svg class="accordion-chevron"><!-- chevron icon --></svg>
  </summary>
  <div class="settings-accordion-body">
    <!-- form fields -->
  </div>
</details>
```

- In `css/components.css`, add:

```css
/* ── Settings accordion ─────────────────────────────────── */
.settings-accordion {
  border: 1px solid var(--border-weak);
  border-radius: var(--radius-lg);
  margin-bottom: 10px;
  overflow: hidden;
}
.settings-accordion-header {
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  list-style: none;
  font-size: 13px; font-weight: 600;
  color: var(--text-primary);
  background: var(--bg-panel);
  user-select: none;
  transition: background 0.15s ease;
}
.settings-accordion-header:hover { background: var(--bg-panel-hover); }
.settings-accordion[open] .settings-accordion-header {
  border-bottom: 1px solid var(--border-weak);
  color: var(--color-info);
}
.settings-accordion-body {
  padding: 16px;
  background: var(--bg-surface);
}
.accordion-chevron {
  width: 14px; height: 14px;
  transition: transform 0.2s ease;
  color: var(--text-muted);
}
.settings-accordion[open] .accordion-chevron { transform: rotate(180deg); }
```

- Files: `js/pages/settings-page.js`, `css/components.css`

---

## Priority 3: Major restructuring (requires careful planning)

---

### 3.1 — Collapse dashboard from 10 tabs to 5 + overflow

**Problem:** 10 tabs (dashboard.html lines 28–37) overwhelm the tab bar, especially at 1280px. The cognitive load of choosing between "Overview / Income / Expenses / Debts / Assets / Net Worth / Goals / OT / Tax / Analytics" on a single hub page is high.

**Proposed restructuring:**
Group tabs into 5 primary + 2 secondary:

| Primary (always visible) | Secondary (in "More" dropdown) |
|---|---|
| Overview | OT Tracker |
| Money In/Out (Income + Expenses merged) | Tax |
| Assets & Debts | Analytics |
| Goals | — |
| Net Worth | — |

**Implementation approach:**
- Merge `renderIncome()` and `renderExpenses()` in `dashboard.js` into a single `renderMoneyFlow()` with an inner sub-tab toggle (not a full tab — a segmented control button group).
- Move OT, Tax, Analytics tabs into a `renderMore()` dispatcher accessible via a `···` / "More" dropdown button.

```css
/* ── Tab overflow menu ──────────────────────────────────── */
.dash-tab-more {
  position: relative;
}
.dash-tab-more-menu {
  position: absolute; top: calc(100% + 4px); right: 0;
  background: var(--bg-panel);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  min-width: 160px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  z-index: 200;
  display: none;
  padding: 4px 0;
}
.dash-tab-more-menu.open { display: block; }
.dash-tab-more-option {
  display: block; width: 100%;
  padding: 9px 16px;
  text-align: left;
  background: none; border: none;
  color: var(--text-secondary);
  font-size: 13px; cursor: pointer;
  transition: background 0.1s ease, color 0.1s ease;
}
.dash-tab-more-option:hover {
  background: rgba(0,191,255,0.07);
  color: var(--text-primary);
}
```

- Files: `dashboard.html`, `js/pages/dashboard.js`, `css/components.css`

---

### 3.2 — Replace custom SVG Sankey with Chart.js plugin

**Problem:** `analytics.html` line 45–49 uses a custom SVG Sankey rendered into `#sankey-container` at 480px height. This is brittle (manually calculating node/link positions), has no interactivity, and breaks on resize.

**Recommended replacement:** `chartjs-chart-sankey` (1.8kB gzip, compatible with Chart.js 4.x already loaded).

**Implementation approach:**
1. Add CDN script tag in `analytics.html`:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/chartjs-chart-sankey@0.12/dist/chartjs-chart-sankey.umd.min.js"></script>
   ```
2. Replace the `#sankey-container` SVG div with a `<canvas id="chart-sankey"></canvas>` inside a `.chart-wrap.chart-h-360`.
3. In `js/pages/analytics.js`, replace the SVG Sankey render function with:
   ```js
   new Chart(document.getElementById('chart-sankey'), {
     type: 'sankey',
     data: {
       datasets: [{
         label: 'Cash Flow',
         data: sankeyData, // [{from, to, flow}]
         colorFrom: C.info,
         colorTo: c => categoryColors[c.dataset.data[c.dataIndex].to] || C.info,
         borderWidth: 0,
       }]
     },
     options: { ... }
   });
   ```
4. The `sankeyData` array is already calculable from the existing income/expense data in `calc.js`.
- Files: `analytics.html`, `js/pages/analytics.js`

---

### 3.3 — overtime.html: build complete OT management UI

**Problem:** `overtime.html` is an empty shell (`<div class="content page-content" id="content"></div>`, line 18) with a script import but no scaffolded HTML structure. The JS in `js/pages/overtime.js` may exist but renders into a blank container.

**What needs to be built:**
The OT management standalone page should include:
1. **Shift log** — a table of all logged shifts with date, hours, gross pay, status (confirmed/pending). Use `.data-table`.
2. **Add shift modal** — a slide-in panel (`position: fixed; right: 0`) with date picker, hours worked, rate selector. Reuse `.form-group` / `.form-input`.
3. **Monthly summary cards** — grid-4 with This Month, 3-Month Avg, YTD, Predicted Net Pay.
4. **Chart panels** — reuse `renderOT()` logic from `dashboard.js` (the three charts: bar + rolling avg, stacked base/OT, savings forecast).

```html
<!-- Scaffold to add to overtime.html -->
<div class="section-header">
  <div>
    <div class="section-title">OT Tracker</div>
    <div class="section-subtitle">Overtime shifts · Monthly earnings · Savings forecast</div>
  </div>
  <button class="btn btn-primary btn-sm" id="add-shift-btn">+ Log Shift</button>
</div>
<div class="grid-4" id="ot-summary-cards"></div>
<div class="grid-2 mt-20" id="ot-charts"></div>
<div class="panel mt-20" id="ot-shift-log">
  <div class="panel-header">
    <span class="panel-title">Shift Log</span>
  </div>
  <div class="table-wrap" id="ot-table-wrap"></div>
</div>
```

- Files: `overtime.html`, `js/pages/overtime.js`

---

### 3.4 — Persistent "month log" quick-capture workflow

**Problem:** The analytics charts (`renderAnalytics()` in `dashboard.js` lines 912–940) depend on `st.monthlyLog` for savings rate trends and income/expense history, but there is no visible UI to enter monthly log data. If `monthlyLog` is empty, the charts render with no data or fall back to estimated flat lines.

**Solution:** Add a month-end "close out" prompt that appears once per month. It surfaces as a `banner-cta` component above the overview tab content:

```html
<!-- Inject in renderOverview() when last log entry is >28 days old -->
<div class="month-close-banner">
  <div class="month-close-banner-text">
    <strong>May 2026</strong> — Record your actuals to keep trends accurate.
  </div>
  <button class="btn btn-primary btn-sm" id="log-month-btn">Log May</button>
</div>
```

```css
/* ── Month-close banner ─────────────────────────────────── */
.month-close-banner {
  display: flex; align-items: center;
  justify-content: space-between; flex-wrap: wrap; gap: 12px;
  padding: 12px 16px;
  background: rgba(0,191,255,0.06);
  border: 1px solid rgba(0,191,255,0.2);
  border-radius: var(--radius-lg);
  margin-bottom: 20px;
  font-size: 13.5px;
}
.month-close-banner strong { color: var(--color-info); }
```

- Files: `js/pages/dashboard.js`, `css/components.css`

---

## Per-page audit

---

### dashboard.html

**Issues:**
1. 10 tabs create horizontal overflow at 1280px — see Priority 3.1.
2. `renderOverview()` builds 8 metric cards across two `grid-4` rows but no visual grouping separates "income/expense" cards from "goal/progress" cards. Add a lightweight `<div class="grid-section-label">FINANCES</div>` between the two rows.
3. The three gauge panels (`Debt Clearance / Emergency Fund / India Trip`) duplicate information already shown in the metric cards directly above. Either remove the gauges from Overview or remove the duplicate metric cards. Recommended: keep gauges, remove the `India Trip` and `Emergency Runway` metric cards (rows 210–213 in `dashboard.js`) and shift the surplus data into the India Trip gauge label.
4. Net Pay Trend chart (`ov-chart-trend`) falls back to "6 flat estimated months" when `monthlyLog` is empty — add an inline empty-state message: "Log monthly actuals in Settings to see real trends."
5. The `GBP/INR` live rate in the topbar has no loading state — `el.textContent` remains empty until the fetch resolves. Show a skeleton placeholder: `----` in mono.

**Quick-fix target file:** `js/pages/dashboard.js` (Overview section, lines 201–270)

---

### expenses.html

**Issues:**
1. Summary section renders only one metric card, leaving two-thirds of the `grid-3` empty (line 22 of `expenses.js`). Fix with Priority 2.5.
2. Expense table has no sort/filter — every user with >8 items scrolls through everything. Fix with Priority 2.4.
3. `Add expense` button at top of page (line 24 in `expenses.html`) creates a new expense with `name:'New Expense'` and `monthlyGBP:0`. The new row appears at the bottom of the table — easy to miss. After adding, scroll the new row into view and focus its name input. Add in `expenses.js` after `render(st)`:
   ```js
   const lastInput = document.querySelector('#exp-tbody tr:nth-last-child(2) .exp-name-input');
   lastInput?.focus(); lastInput?.select();
   ```
4. The `Scheduled Changes` table has a small `Note` column with `width:140px` inline style — on narrow screens this collapses the date column. Move widths to CSS classes instead of inline styles.
5. No confirmation prompt before delete (`exp-delete-btn`). A single mis-click destroys data with no undo. Add a `data-confirm` attribute check or use the browser's `confirm()` dialog as a stopgap until a proper toast+undo pattern is implemented.

**Target file:** `js/pages/expenses.js`

---

### analytics.html

**Issues:**
1. Custom SVG Sankey in `#sankey-container` — replace per Priority 3.2.
2. Analytics KPI cards (`#analytics-kpis`) are generated dynamically in `js/pages/analytics.js` but the `.grid-4` container is declared in the HTML as empty, making the initial page load show a blank row for ~100ms. Pre-populate with skeleton loading cards to eliminate flash:
   ```css
   .kpi-skeleton {
     background: linear-gradient(90deg, #141929 25%, #1a2236 50%, #141929 75%);
     background-size: 200% 100%;
     animation: skeletonShimmer 1.5s ease-in-out infinite;
     border-radius: var(--radius-lg);
     height: 100px;
   }
   @keyframes skeletonShimmer {
     0% { background-position: 200% 0; }
     100% { background-position: -200% 0; }
   }
   ```
3. Budget vs Actual radar chart (`chart-budget-radar`) uses `st.settings?.chartParams?.budgetByCategory` which defaults to actual spend when no budget is set — meaning the radar shows two identical overlapping polygons. When budgets equal actuals, show an info banner: "Set category budgets in Settings → Charts to enable budget comparison."
4. The Career Income Impact panel (`#analytics-career`) has no documented HTML structure in `analytics.html` — it's an empty `<div>` waiting for JS. Ensure the JS renders a structured comparison table, not a flat `innerHTML` dump.
5. Charts are stacked vertically with no visual grouping — 6 panels in sequence without section headers. Add `<div class="chart-section-heading">Spending</div>` dividers between logical groups.

**Target files:** `analytics.html`, `js/pages/analytics.js`, `css/components.css`

---

### networth.html

**Issues:**
1. `chart-nw-timeline` and `chart-age-trajectory` use inline `style="height:320px"` and `style="height:280px"` instead of the existing `.chart-h-300` / `.chart-h-260` utility classes. Inconsistency. Replace with `.chart-wrap.chart-h-300` wrapper pattern used elsewhere.
2. `#nw-settings-fields` and `#nw-scenarios` are empty divs — the JS populates them, but there's no accessible loading indicator. Same skeleton pattern from analytics applies.
3. Age-to-Wealth chart tooltip label is `£XXk` — for the long projection end-state (potential £1M+) this should be `£X.Xm`. Update the `callback` in `renderNetWorth()` line 618:
   ```js
   callback: v => v >= 1000000
     ? '£' + (v / 1000000).toFixed(1) + 'm'
     : '£' + Math.round(v / 1000) + 'k'
   ```
4. `Salary Scenarios` table (line 285–293 in `dashboard.js`) only includes 4 hardcoded salary points [28k, 40k, 55k, 65k]. At minimum, include the user's current salary dynamically, and label the row "Current" only when it matches exactly — otherwise it silently shows no "Current" highlight.

**Target files:** `networth.html`, `js/pages/networth.js`, `js/pages/dashboard.js`

---

### goals.html

**Issues:**
1. Three gauge panels dominate the layout but gauges are not ideal for goal tracking — the semicircle shape makes the percentage hard to read at a glance. Replace with the `.goal-card` pattern from Priority 2.3.
2. Edit panel is hidden behind a button (`#goals-edit-btn`) — the edit UI is an afterthought. On a page that exists specifically to track goals, editing should be a first-class action: always visible in a right-side panel (desktop) or collapsible section (mobile), not behind a button.
3. `goals.html` does not display a deadline countdown for the India Trip goal beyond the metric card. A visible "42 days left" countdown chip (badge) would make urgency concrete.
4. "Wealth Target" is the least actionable metric on this page — the gap between current net worth (likely negative or near zero) and the £4.76M target creates a 0% gauge with no motivational value. Replace with a "Years to target at current trajectory" calculation.

**Target files:** `js/pages/goals.js`, `goals.html`

---

### tax.html

**Issues:**
1. Tax page has two distinct jurisdictions (UK + India NRI) on one long scroll — the visual separator (`.jurisdiction-divider` with orange left border) is too subtle. Promote it: use a full-width section divider with a background shift.
2. `tax-calendar` (payslip verification calendar) uses a `grid-template-columns: repeat(6,1fr)` — 6 columns for 12 months is ambiguous. Either change to 12 columns (one per month) or 3×4, and label each cell with the month name not just a number.
3. DTAA Relief panel (`#india-dtaa-fields`) is near the bottom — functionally it's one of the most important (it reduces India tax liability). Promote it above the ITR Filing Status panel.
4. NRI banner (`india-banner.warning` and `india-banner.danger`) states appear conditionally but the banner IDs are scattered across `tax.html`. They should be consolidated into a single `#india-alert-banner` that shows the highest-severity message only.

**Target files:** `tax.html`, `js/pages/tax.js`

---

### settings.html

**Issues:**
1. Three tabs (Display / Data / Charts) — the Data tab is likely the most complex but receives no special treatment. Implement accordion groups per Priority 2.7.
2. No inline validation on numeric inputs. Users can type negative salaries or >100% for pension contributions — these silently corrupt calculations. Add `min`/`max` attributes and a lightweight validation pass that shows `.field-error` messages before saving.
3. No "Reset to defaults" action — if a user corrupts their data, recovery requires developer tools. Add a `btn-danger` "Reset all data" button in a dedicated "Danger Zone" section at the bottom of the Data tab.
4. No visual confirmation when Save is triggered — the button should show a transient "Saved ✓" state for 2 seconds. Currently save is silent.

```css
/* ── Save confirmation flash ────────────────────────────── */
.btn-save-confirm {
  background: rgba(0,230,118,0.15) !important;
  border-color: var(--color-positive) !important;
  color: var(--color-positive) !important;
}
```

**Target files:** `js/pages/settings-page.js`, `css/components.css`

---

### overtime.html (incomplete)

See Priority 3.3 — this page requires full implementation, not refinement.

The `js/pages/overtime.js` file should be reviewed to determine what is already implemented vs what is shell code before starting. The standalone page should be a full-featured OT management interface, not a partial mirror of the dashboard OT tab.

**Target files:** `overtime.html`, `js/pages/overtime.js`

---

## New components to add

---

### Sparkline (`.metric-card-sparkline`)
- New file: `js/components/sparkline.js`
- Pure SVG, no new dependencies
- Feeds from `st.monthlyLog` array

### Budget Alert Badge (`.budget-alert`)
- `css/components.css` addition
- 3 states: within budget (hidden), ≥85% (warning amber), ≥100% (danger red, pulsing)

### Floating Action Button (`.fab` / `.fab-menu`)
- New file: `js/components/fab.js`
- 3 actions: Add Expense, Log OT Shift, Quick-update Goal
- Auto-hides on scroll-down, re-appears on scroll-up

### Skeleton loading cards (`.kpi-skeleton`)
- `css/components.css` addition
- Used on: `analytics.html`, `networth.html` during initial JS render

### Month-close banner (`.month-close-banner`)
- Appears in `renderOverview()` when log is stale
- Triggers a minimal 3-field modal: net income, saved, notes

### Inline tooltip (`[data-tooltip]`)
- Pure CSS — no JS dependency
- Use on all benchmark labels across analytics and dashboard

### Goal card (`.goal-card`)
- Richer alternative to gauge for goals page
- Includes progress bar, deadline badge, required weekly rate

---

## Color & Typography refinements

---

### theme.css additions needed

**1. Semantic surface tokens** — the current palette has `--bg-canvas`, `--bg-surface`, `--bg-panel`, `--bg-panel-hover` but no `--bg-surface-accent` for the light highlight used inside expanded accordions. Add:
```css
--bg-surface-accent: #0f1726;
```

**2. Missing border token for focus rings inside panels** — focus rings use `var(--color-info)` outline which is too bright inside dark panels. Add:
```css
--focus-ring: rgba(0,191,255,0.5);
```
Then update `:focus-visible` in `theme.css` line 98–102 to use `var(--focus-ring)`.

**3. Typography: section labels need a dedicated class** — currently "FINANCES" / "INVESTMENTS" labels inside dashboard grids are written inline with `font-size:11px;text-transform:uppercase` styles. Extract to:
```css
.section-group-label {
  font-size: 10px; font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.12em;
  font-family: var(--font-mono);
  margin-bottom: 8px; margin-top: 4px;
}
```

**4. Panel-title contrast** — `.panel-title` (`components.css` line 29) is `color: rgba(0,191,255,0.7)` — 70% opacity cyan on a very dark background. WCAG AA requires 4.5:1 for small text. The current value is approximately 3.8:1 against `#141929`. Raise to 85%:
```css
.panel-title { color: rgba(0,191,255,0.85); }
```

**5. Metric card label contrast** — `.metric-card .label` (`components.css` line 54) is `color: rgba(0,191,255,0.6)` — 60% opacity. Same WCAG concern. Raise to 75%:
```css
.metric-card .label { color: rgba(0,191,255,0.75); }
```

**6. Mono font size on `.metric-card .sub`** — currently 12px mono which renders too small on high-DPI screens. Raise to 12.5px to match `.label-muted` for visual harmony.

**7. Chart tooltip background** — currently `rgba(9,12,20,0.96)` defined inline in `dashboard.js` line 22. Extract to a CSS custom property:
```css
--tooltip-bg: rgba(9,12,20,0.97);
--tooltip-border: rgba(0,191,255,0.25);
```
Update all inline chart tooltip configs across `dashboard.js`, `analytics.js`, `networth.js` to reference these tokens.

---

## Mobile improvements

---

### Current state
- `<1024px`: sidebar collapses to 56px icon rail — text labels hidden, icons remain.
- `<768px`: sidebar `display:none` replaced by a `position:fixed; left:-280px` drawer with hamburger toggle (`layout.css` lines 237–264).
- Grids collapse to single column at `<768px`.
- `input/select/textarea` font-size forced to 16px to prevent iOS zoom (correct).

### Gaps and fixes

**Gap 1: No bottom navigation on mobile**  
The sidebar drawer requires two taps (hamburger → nav item → close). On mobile, primary navigation should be a fixed bottom tab bar. Add to `layout.css`:

```css
@media (max-width: 767px) {
  .mobile-bottom-nav {
    display: flex;
    position: fixed; bottom: 0; left: 0; right: 0;
    background: var(--bg-surface);
    border-top: 1px solid var(--border-medium);
    z-index: 300;
    padding: 6px 0 env(safe-area-inset-bottom, 6px);
  }
  .mobile-bottom-nav-item {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; gap: 3px;
    padding: 6px 4px;
    color: var(--text-muted);
    font-size: 10px; cursor: pointer;
    background: none; border: none;
    transition: color 0.15s ease;
  }
  .mobile-bottom-nav-item.active { color: var(--color-info); }
  .mobile-bottom-nav-item svg { width: 20px; height: 20px; }

  /* Push content above bottom nav */
  .content { padding-bottom: calc(70px + env(safe-area-inset-bottom, 0px)); }
}
```

5 nav items for mobile: Overview, Expenses, Goals, OT, More (→ opens drawer for remaining pages).

**Gap 2: `grid-4` at 1024–1280px collapses to `grid-2`**  
`layout.css` line 182 collapses `.grid-4` to 2 columns at `<1280px`. The 8 metric cards then appear as a 2×4 grid which is workable but the cards themselves have `padding: 20px` which becomes crowded at ~480px per card. Reduce panel padding at `<1280px`:

```css
@media (max-width: 1279px) {
  .metric-card { padding: 14px 16px; }
  .metric-card .value { font-size: 24px; }
}
```

**Gap 3: Horizontal scrolling dash-tabs on mobile**  
See Priority 1.4 — the fade-mask is the minimal fix. On mobile, consider replacing the 10-tab scroll with the "5 tabs + More" pattern from Priority 3.1.

**Gap 4: Chart heights on mobile**  
`layout.css` line 199 reduces `.chart-h-300` to `240px` and `.chart-h-360` to `260px` at `<768px`. Missing: `.chart-h-260` still renders at 260px. Add:
```css
@media (max-width: 767px) {
  .chart-h-260 { height: 200px; }
  .chart-h-200 { height: 180px; }
}
```

**Gap 5: Touch targets**  
`.btn-icon` has `padding: 6px` — the touch target is approximately 28×28px. iOS and Android guidelines require 44×44px minimum. Fix:
```css
@media (max-width: 767px) {
  .btn-icon { padding: 10px; }
  .dash-tab { padding: 10px 14px; min-height: 44px; }
  .tab-btn  { padding: 12px 16px; min-height: 44px; }
}
```

**Gap 6: FAB z-index conflict with mobile overlay**  
When implementing the FAB (Priority 2.2), set `.fab { z-index: 401 }` to appear above `.mobile-overlay { z-index: 199 }` and `.sidebar { z-index: 200 }`. Document this in a z-index map comment in `css/components.css`:

```css
/*
  Z-INDEX MAP
  ─────────────────────────────
  50  — topbar (sticky)
  100 — sidebar
  199 — mobile overlay
  200 — mobile sidebar drawer
  300 — overlay (.overlay)
  399 — fab-menu
  400 — fab
  500 — tooltips
*/
```

---

## Implementation order summary

| # | Change | Effort | Files | Impact |
|---|---|---|---|---|
| 1 | Last-updated timestamp | 1h | `page-init.js`, `dashboard.js`, `components.css` | High |
| 2 | Budget alert badges | 2h | `dashboard.js`, `components.css` | High |
| 3 | Elevated empty states | 1h | `expenses.js`, `dashboard.js`, `components.css` | Medium |
| 4 | Dash-tab scroll indicator | 0.5h | `dashboard.html`, `components.css` | Low |
| 5 | Panel-title/label contrast fix | 0.5h | `components.css` | Medium (accessibility) |
| 6 | Expenses filter + sort | 3h | `expenses.js`, `components.css` | High |
| 7 | Expenses 3-card summary | 1h | `expenses.js` | Medium |
| 8 | Sparklines | 3h | `sparkline.js` (new), `dashboard.js`, `components.css` | High |
| 9 | Floating Action Button | 4h | `fab.js` (new), `components.css`, all page JS | High |
| 10 | Goal cards + progress | 3h | `goals.js`, `components.css` | Medium |
| 11 | Analytics tooltips | 1h | `analytics.js`, `dashboard.js`, `components.css` | Medium |
| 12 | Settings accordions | 3h | `settings-page.js`, `components.css` | Medium |
| 13 | Month-close banner | 2h | `dashboard.js`, `components.css` | Medium |
| 14 | Skeleton loading | 2h | `analytics.html`, `networth.html`, `components.css` | Medium |
| 15 | Mobile bottom nav | 4h | `layout.css`, shared JS | High |
| 16 | overtime.html complete build | 8h | `overtime.html`, `overtime.js` | High |
| 17 | Dashboard tab collapse (5+More) | 6h | `dashboard.html`, `dashboard.js`, `components.css` | High |
| 18 | Sankey replacement | 4h | `analytics.html`, `analytics.js` | Medium |
| 19 | Monthly log capture flow | 6h | `dashboard.js`, new modal JS, `components.css` | High |
