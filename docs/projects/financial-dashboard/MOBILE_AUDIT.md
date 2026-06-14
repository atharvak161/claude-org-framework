# Mobile Responsiveness Audit — Financial Dashboard
**Auditor:** Mobile Developer  
**Date:** 2026-06-01  
**Scope:** All pages in `/src/projects/financial-dashboard/`  
**Target range:** 320px – 768px (mobile), 769px – 1023px (tablet)

---

## 1. Audit Findings

### 1.1 Viewport Meta Tag

**Status: PASS on 11/12 pages, FAIL on 1/12**

All application pages have the correct viewport meta tag:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Missing:** `index.html` — this is the redirect entry point and has no viewport meta tag. While it immediately redirects via `<meta http-equiv="refresh">` and JS to `dashboard.html`, a slow connection or a bot could render it without the viewport directive, causing a zoomed-out flash.

---

### 1.2 Media Queries — Breakpoints Present

All three breakpoints are defined in `css/layout.css`:

| Breakpoint | Target | What it does |
|---|---|---|
| `max-width: 1279px` | Large desktop → mid | `grid-3` → 2 cols, `grid-4` → 2 cols |
| `max-width: 1023px` | Tablet | Sidebar collapses to icon-only (56px rail) |
| `max-width: 767px` | Mobile | Sidebar `display:none`, grids → 1 col, content padding reduced, 2 chart heights reduced |

**Gap identified:** There is no breakpoint between 768px and 1023px for portrait tablet (768px is exactly excluded from the mobile block — the mobile rule is `max-width: 767px`). A device at exactly 768px falls into the 1023px tablet rule, which collapses the sidebar to icons but does NOT hide it, does NOT reflow the grids to 1 column, and does NOT reduce padding. A standard iPad portrait (768px) gets a squeezed layout, not a mobile layout.

**No breakpoints exist in `css/theme.css` or `css/components.css`** — all responsive rules live exclusively in `css/layout.css`.

---

### 1.3 Sidebar Navigation on Mobile (320px–768px)

**Status: BROKEN**

At `max-width: 767px`, the sidebar is set to `display: none`. There is no replacement navigation — no hamburger menu, no bottom nav bar, no off-canvas drawer. The 10-item navigation (Overview, Income, Expenses, Debts, Assets, Net Worth, Goals, Tax Tracker, Analytics, Export, Settings) becomes completely inaccessible on any screen narrower than 768px.

The topbar renders with only a page title and a PDF export button. There is no way for a mobile user to navigate between pages.

Additionally, `shared-layout.js` only renders the sidebar and has no mobile navigation fallback. The `sidebar-toggle` button (hamburger icon) is inside the sidebar itself — it cannot be used to open the sidebar once the sidebar is hidden.

---

### 1.4 Canvas / Chart Responsiveness

**Status: PARTIAL — functional but some charts have fixed-height issues**

Canvas elements are wrapped in `.chart-wrap` divs with explicit height classes (`.chart-h-160`, `.chart-h-200`, `.chart-h-260`, `.chart-h-300`, `.chart-h-360`). The CSS rule:

```css
.chart-wrap canvas { position:absolute; top:0; left:0; width:100%!important; height:100%!important }
```

This makes the canvas fill its container in both axes, which is correct. Chart.js will re-render to fill the container width responsively.

**Issues found:**

1. `.chart-h-300` and `.chart-h-360` are partially fixed at mobile — the 767px breakpoint reduces them to `240px` and `260px` respectively, but `.chart-h-160`, `.chart-h-200`, and `.chart-h-260` are never reduced. On a 320px screen, a 260px-tall chart consumes 81% of the viewport height, forcing excessive scrolling.

2. The Sankey diagram in `analytics.html` is hardcoded inline: `style="width:100%;height:480px;overflow:hidden"`. The height is fixed at 480px with `overflow:hidden` — this means on mobile the content inside will be clipped, not scrollable, and the chart will be partially invisible.

3. The gauge containers have a fixed-width size: `.gauge-chart-container { width:160px; height:90px }`. These do not scale on mobile. On a 320px screen with 16px content padding, available width is 288px. Three gauge panels stack to 1 column (correct), but the gauge canvas is fixed at 160px wide — it will not expand to fill the panel, leaving it looking small and off-centre without centring CSS.

---

### 1.5 Forms and Input Touch Targets

**Status: FAILS minimum touch target standard**

Apple HIG and Google Material both specify 44×44px minimum touch targets. The following components fall short:

| Component | Defined padding | Approximate tap height | Compliant? |
|---|---|---|---|
| `.btn` (standard) | `7px 16px` | ~34px (7+7+font) | No — ~10px short |
| `.btn-sm` | `4px 10px` | ~27px | No — ~17px short |
| `.btn-icon` | `6px` | ~27px (6+6+15px icon) | No |
| `.form-input` / `.form-select` | `7px 11px` | ~34px | No — ~10px short |
| `.nav-item` (collapsed) | `9px` all sides | ~34px (9+9+16px icon) | No — borderline |
| `.range-slider` thumb | 16×16px | 16px tap target | No — 28px short |
| `.tab-btn` | `9px 18px` | ~35px | No — ~9px short |
| `.cal-cell` | `min-height:52px` | 52px | Yes |

The range slider thumb (`16px × 16px`) is the most critical failure — it is nearly impossible to tap accurately on a touchscreen without a larger invisible hit area.

---

### 1.6 Text Readability Without Zooming

**Status: MOSTLY PASS, with specific concerns**

Base font size is `15px` on `html, body` — acceptable for mobile (16px is the gold standard; 15px is borderline but readable).

**Concerns:**

- `.panel-title` is `11px` uppercase with `letter-spacing: 0.1em`. At 11px, uppercase text with tight tracking is difficult to read on mobile without zooming, particularly for users with any vision impairment.
- `.data-table` font size is `13.5px` — acceptable.
- `.data-table th` is `10.5px` uppercase — too small on mobile.
- `.badge` is `11px` — readable but small.
- `.label-muted` is `12.5px` — acceptable.
- `.metric-card .label` is `11px` uppercase — borderline.
- `.metric-card .value` is `30px` mono — good.
- `.metric-lg` is `34px` — good.

No `font-size` adjustments exist in the mobile breakpoint (`max-width: 767px`), so all small text sizes remain unchanged at mobile widths.

---

### 1.7 Table Overflow on Small Screens

**Status: PASS — wrapper exists; RISK — not consistently applied**

The `.table-wrap` class applies `overflow-x: auto`, which is the correct pattern for horizontal table scroll on mobile. The `data-table` class sets `width: 100%` which will trigger overflow correctly.

**Issues found:**

1. `.compare-table` (used in debts page for overpayment comparison) has no `.table-wrap` parent in the HTML — it is rendered programmatically by JS. If the JS does not wrap it in `.table-wrap`, it will overflow its container on mobile without scroll.

2. The `expense-heatmap` div in `expenses.html` has `overflow-x:auto` applied inline, which is correct — but the heatmap is a 12-column CSS grid (`.calendar-grid` uses `repeat(6,1fr)`) — at 320px, 6 equal columns at 288px available width gives ~48px per cell. The `cal-cell` has `min-height: 52px` which may force height but 48px width is workable. However, the heatmap for 12 months rendered as a grid inside a scrollable container needs verification — if the grid renders as a single scrollable row wider than the viewport, it will scroll horizontally correctly; if it wraps, cells will be too small.

3. The amortisation table on the debts page is wrapped in `.table-wrap` in the HTML — this is correct.

---

## 2. Prioritised Fix List

---

### P0 — Breaks on Mobile (Fix Immediately)

#### P0-1: No mobile navigation — sidebar is hidden with no replacement

**Impact:** On any screen ≤767px, the entire 10-page navigation is inaccessible. The app is effectively non-navigable on mobile.

**Specific CSS fix — add a mobile bottom navigation bar:**

Add to `css/layout.css`:
```css
/* ── Mobile nav bar ──────────────────────────────────── */
.mobile-nav {
  display: none;
}

@media (max-width: 767px) {
  .mobile-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 200;
    background: linear-gradient(180deg, #090d1c 0%, #080b18 100%);
    border-top: 1px solid rgba(0, 191, 255, 0.12);
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
    justify-content: space-around;
    align-items: center;
    padding: 6px 0 max(6px, env(safe-area-inset-bottom));
    height: 60px;
  }

  .mobile-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    min-width: 44px;
    min-height: 44px;
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 10px;
    font-family: var(--font-body);
    border-radius: var(--radius);
    padding: 4px 6px;
    transition: color var(--transition);
  }

  .mobile-nav-item.active {
    color: var(--color-info);
  }

  .mobile-nav-item svg {
    width: 20px;
    height: 20px;
  }

  /* Push page content above the fixed bottom nav */
  .content {
    padding-bottom: calc(60px + 16px);
  }
}
```

**Also requires:** `shared-layout.js` to inject a `.mobile-nav` element with the primary 5–6 nav items (Overview, Income, Expenses, Debts, Assets, More). The full 10-item nav should live in a "More" overlay or a hamburger drawer.

---

#### P0-2: Sankey chart clipped and non-scrollable on mobile

**Impact:** The Monthly Cash Flow panel in `analytics.html` has `height:480px; overflow:hidden` hardcoded inline. On mobile the chart is clipped — content is invisible and cannot be scrolled to.

**Specific CSS fix — add to `css/layout.css`:**
```css
@media (max-width: 767px) {
  #sankey-container {
    height: 300px !important;
    overflow-x: auto !important;
    overflow-y: hidden !important;
  }
}
```

---

#### P0-3: Viewport meta tag missing on `index.html`

**Impact:** The redirect entry point renders without a viewport directive. On a slow mobile connection, the browser may display a zoomed-out page before the redirect fires.

**Specific HTML fix — add to `index.html` `<head>`:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

### P1 — Poor Mobile Experience (Fix in Next Sprint)

#### P1-1: Touch targets below 44px minimum on buttons and inputs

**Impact:** Buttons are ~27–34px tall — miss-taps are frequent on mobile. The range slider thumb at 16px is nearly untappable.

**Specific CSS fix — add to `css/layout.css` inside `@media (max-width: 767px)`:**
```css
@media (max-width: 767px) {
  /* Buttons — meet 44px minimum tap height */
  .btn {
    padding: 11px 16px;
    min-height: 44px;
  }

  .btn-sm {
    padding: 8px 12px;
    min-height: 36px; /* relaxed — sm buttons used in panel headers where space is constrained */
  }

  .btn-icon {
    padding: 10px;
    min-width: 44px;
    min-height: 44px;
  }

  /* Form inputs — meet 44px tap height */
  .form-input,
  .form-select {
    padding: 12px 11px;
    min-height: 44px;
    font-size: 16px; /* prevents iOS auto-zoom on focus (iOS zooms when font-size < 16px) */
  }

  /* Tab buttons */
  .tab-btn {
    padding: 12px 18px;
    min-height: 44px;
  }

  /* Range slider — larger invisible tap area */
  .range-slider {
    height: 20px; /* increases tap area; visual track uses background */
    cursor: pointer;
  }

  .range-slider::-webkit-slider-thumb {
    width: 28px;
    height: 28px;
  }

  .range-slider::-moz-range-thumb {
    width: 28px;
    height: 28px;
  }
}
```

---

#### P1-2: iOS auto-zoom on form input focus

**Impact:** `form-input` and `form-select` use `font-size: 14px`. iOS Safari automatically zooms the viewport when an input with `font-size < 16px` receives focus. This locks users into a zoomed state after tapping any input field and is a well-known mobile UX failure mode.

**Specific CSS fix — part of the fix above, but called out separately as it applies to ALL input variants:**
```css
@media (max-width: 767px) {
  .form-input,
  .form-select,
  .form-input-inline,
  textarea.form-input {
    font-size: 16px;
  }
}
```

---

#### P1-3: Small panel/table header text unreadable at mobile sizes

**Impact:** `.panel-title` at 11px uppercase, `.data-table th` at 10.5px uppercase, and `.metric-card .label` at 11px uppercase are all below the comfortable reading threshold on a phone held at arm's length.

**Specific CSS fix — add to `css/layout.css` inside `@media (max-width: 767px)`:**
```css
@media (max-width: 767px) {
  .panel-title {
    font-size: 13px;
  }

  .data-table th {
    font-size: 12px;
  }

  .metric-card .label {
    font-size: 12px;
  }

  .label-muted {
    font-size: 13px;
  }
}
```

---

#### P1-4: Gauge chart containers are fixed-width and do not fill panels on mobile

**Impact:** `.gauge-chart-container` is fixed at `width: 160px; height: 90px`. In a full-width stacked column at 320px, the gauge canvas will be 160px wide in a 288px panel — it will not expand to use available space and looks misaligned.

**Specific CSS fix — add to `css/components.css` inside a new mobile media query:**
```css
@media (max-width: 767px) {
  .gauge-chart-container {
    width: 100%;
    max-width: 220px;
    height: 110px;
  }

  .gauge-wrap {
    align-items: center; /* ensure centering within full-width panel */
  }
}
```

---

#### P1-5: Tall chart containers cause excessive scroll on mobile

**Impact:** `.chart-h-260` (260px) is never reduced at mobile. Charts like the expense doughnut, pay waterfall, and debt charts remain 260px tall. On a 667px tall iPhone (SE), two such charts consume the full viewport height, requiring heavy scrolling through every page.

**Specific CSS fix — add to `css/layout.css` inside `@media (max-width: 767px)`:**
```css
@media (max-width: 767px) {
  .chart-h-160 { height: 140px; }
  .chart-h-200 { height: 170px; }
  .chart-h-260 { height: 200px; }
  /* chart-h-300 and chart-h-360 already handled */
}
```

---

#### P1-6: Settings page tab bar does not scroll on mobile — tabs overflow viewport

**Impact:** `settings.html` has 11 tab buttons (Profile, Income, Expenses, Debts, Investments, Goals, Projections, Tax, Display, Data, Charts). The `.tabs` container has `overflow-x: auto` which is correct in principle, but tab buttons have `white-space: nowrap` which means they will not wrap. On a 320px screen the combined tab bar width is approximately 700px+ — it will scroll horizontally, but there is no visual indicator that tabs exist beyond the visible edge (no fade, no scroll hint).

**Specific CSS fix — add to `css/layout.css`:**
```css
@media (max-width: 767px) {
  .tabs {
    /* Ensure horizontal scroll is enabled and styled */
    overflow-x: auto;
    scrollbar-width: none; /* hide scrollbar on mobile — swipe is natural */
    -ms-overflow-style: none;
    /* Fade edge hint that more tabs exist */
    -webkit-mask-image: linear-gradient(to right, black 80%, transparent 100%);
    mask-image: linear-gradient(to right, black 80%, transparent 100%);
    padding-bottom: 2px; /* prevent focus outline clip */
  }

  .tabs::-webkit-scrollbar {
    display: none;
  }

  .tab-btn {
    flex-shrink: 0; /* prevent tabs from being compressed */
    padding: 10px 14px;
  }
}
```

---

#### P1-7: Topbar action area cramped on mobile — PDF button visible but non-functional feel

**Impact:** The topbar has a title on the left and a PDF export button on the right. On 320px, the title for pages like "Assets & Investments" or "Net Worth Timeline" (from `SECTION_TITLES`) may overflow or squeeze the button. There is no `overflow:hidden` or `text-overflow:ellipsis` on `.topbar-title`.

**Specific CSS fix:**
```css
@media (max-width: 767px) {
  .topbar {
    padding: 8px 12px;
    gap: 8px;
  }

  .topbar-title {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: calc(100vw - 120px); /* leave room for action button */
  }

  /* Hide PDF export button on mobile — PDF generation from a phone is not a valid use case */
  #export-pdf-btn {
    display: none;
  }
}
```

---

### P2 — Nice to Have (Backlog)

#### P2-1: No safe-area-inset support for iPhone notch / Dynamic Island

The app does not use `env(safe-area-inset-*)` CSS variables. On iPhones with notches or the Dynamic Island (iPhone X through 16 Pro), content can be obscured by the notch at the top and the home indicator at the bottom. The topbar (sticky, `z-index:50`) is particularly at risk if the browser chrome does not compensate.

**Fix:** Add `padding-top: env(safe-area-inset-top)` to `.topbar` and `padding-bottom: env(safe-area-inset-bottom)` to `.content` (or the mobile nav bar when added).

---

#### P2-2: `grid-auto` class not handled in mobile breakpoint

`.grid-auto` uses `minmax(240px, 1fr)`. On a 320px screen with 32px total padding, the available width is 288px — which is above 240px, so it renders as a single column correctly without a media query override. However, on narrower viewport edge cases (e.g. 280px Android devices), `240px` minmax could cause 2-column rendering if the container is slightly wider. Add an explicit 1-column override for safety:

```css
@media (max-width: 480px) {
  .grid-auto {
    grid-template-columns: 1fr;
  }
}
```

---

#### P2-3: Hover states on metric cards use `translateY` — problematic on touch

`.metric-card:hover` applies `transform: translateY(-3px)` and a box-shadow. On touch devices, hover states are triggered on first tap and persist, giving a sticky lifted appearance until the user taps elsewhere. Wrap the hover rule in a pointer media query:

```css
@media (hover: hover) and (pointer: fine) {
  .metric-card:hover {
    transform: translateY(-3px);
    border-color: rgba(0, 191, 255, 0.3);
    box-shadow: 0 12px 40px rgba(0,0,0,0.6), 0 0 30px rgba(0,191,255,0.12), inset 0 1px 0 rgba(255,255,255,0.04);
  }
}
```

---

#### P2-4: Compare table lacks a `.table-wrap` wrapper in JS-generated output

The compare table in debts.html is generated by `debts.js` and injected into `#debt-compare-wrap`. If the JS generates a raw `<table>` without wrapping it in a `<div class="table-wrap">`, the table will overflow horizontally on mobile without scroll. This needs to be verified and fixed in `js/pages/debts.js`.

---

#### P2-5: Calendar grid column count should adapt on very small screens

`.calendar-grid` is `repeat(6, 1fr)`. On mobile in the tax page, 6 columns at 288px available width = 48px per cell. `min-height: 52px` makes cells taller than wide, which is functional but not ideal. Consider:

```css
@media (max-width: 480px) {
  .calendar-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

#### P2-6: `font-size: 15px` on `body` should be 16px to match mobile conventions

The base font is 15px — 1px below the iOS/Android default of 16px. Not a critical problem, but bumping the base to 16px on mobile ensures text sizes inherited from `em`-based sizes will scale correctly and aligns with browser defaults:

```css
@media (max-width: 767px) {
  html, body {
    font-size: 16px;
  }
}
```

---

## 3. Summary Table

| ID | Issue | Priority | Effort |
|---|---|---|---|
| P0-1 | No mobile navigation (sidebar hidden, no replacement) | P0 | High — requires JS changes in shared-layout.js |
| P0-2 | Sankey chart clipped with overflow:hidden on mobile | P0 | Low — CSS override |
| P0-3 | Viewport meta missing on index.html | P0 | Trivial — 1 line of HTML |
| P1-1 | Touch targets below 44px (buttons, inputs, slider) | P1 | Low — CSS only |
| P1-2 | iOS auto-zoom on inputs with font-size < 16px | P1 | Trivial — CSS font-size override |
| P1-3 | Panel/table header text too small (10.5–11px) on mobile | P1 | Low — CSS only |
| P1-4 | Gauge containers fixed-width, don't fill panels on mobile | P1 | Low — CSS only |
| P1-5 | Chart heights too tall on mobile, forcing excessive scroll | P1 | Low — CSS only |
| P1-6 | Settings tab bar overflows with no scroll hint on mobile | P1 | Low — CSS only |
| P1-7 | Topbar title overflows, PDF button visible but useless on mobile | P1 | Low — CSS only |
| P2-1 | No safe-area-inset support for iPhone notch | P2 | Low |
| P2-2 | grid-auto not protected against sub-320px viewports | P2 | Trivial |
| P2-3 | Hover transforms persist on touch (sticky card lift) | P2 | Low |
| P2-4 | Compare table may lack table-wrap in JS output | P2 | Low — JS change |
| P2-5 | Calendar grid too dense on mobile (6 cols at 48px each) | P2 | Low |
| P2-6 | Base font-size 15px should be 16px on mobile | P2 | Trivial |

---

## 4. Critical Path Recommendation

The single most damaging issue is **P0-1: no mobile navigation**. Until a hamburger menu, bottom nav bar, or off-canvas drawer is implemented in `shared-layout.js`, the entire application is a dead-end for any user on a phone. All P1 CSS fixes can be batched into a single sprint alongside the navigation fix. The P0 CSS fixes (P0-2, P0-3) can be shipped immediately as they are trivial 1–2 line changes.

Estimated remediation time: P0 CSS fixes — 30 minutes. P1 CSS fixes — 2 hours. P0-1 navigation — 1 day (design decision on drawer vs bottom bar, plus JS implementation in shared-layout.js).
