# Org Chart SVG Design Review
**Reviewer:** Creative Director
**Date:** 2026-06-02
**File reviewed:** /Users/atharva/Downloads/organisation/monitor.html — SVG org chart section
**Verdict:** APPROVED WITH NOTES

---

## Summary

The restored SVG org chart implementation is structurally sound and visually consistent with the overall dark-theme monitor. It will render a readable hierarchy for up to 90 agents. The notes below are targeted improvements — none of them block deployment, but two of them (text sizing and connection path contrast) should be addressed in the next iteration to hold the quality bar at scale.

---

## Assessment by Criterion

### 1. Node styles — 140×48px card with coloured left border, status dot, name + dept label

**Verdict: APPROVED**

The 140×48px card is well-proportioned for a dense hierarchy view. The left border (`border-left: 3px solid <dept-color>`) resolves to the department colour at render time via `resolveColor(deptColor(n.dept))`, giving each department a visually distinct stripe without heavy background fills. The card uses `--surface2` background with `--border2` border, which sits comfortably in the dark canvas (`#0d0d14`). The root node (`oc-root`) correctly breaks out with a 2px `--accent` full border and heavier font weight, creating the necessary visual apex.

The `foreignObject` wrapper for HTML nodes inside the SVG is the right approach here — it preserves CSS text-overflow ellipsis on `oc-name` and `oc-dept`, which will become critical at 90 nodes where names like "Test Automation Engineer" need to truncate cleanly.

One concern: `padding: 5px 9px` with `margin-top: 4px` on `.oc-name` means the name starts at approximately y=9px inside the 48px card. The status dot sits at `top: 5px, right: 6px`. At 48px total height this is tight but workable. It would fail at any font-scaling above 1.0 system setting — flag for accessibility pass.

### 2. Bezier curve connections — `M x1,y1 C x1,ymid x2,ymid x2,y2`

**Verdict: APPROVED**

The cubic bezier `M x1,y1 C x1,ymid x2,ymid x2,y2` is the correct form for a top-to-bottom hierarchy connector. Both control points share the midpoint Y, which produces a smooth vertical-to-horizontal-to-vertical S-curve. The parent anchor exits from the bottom-centre of the node (`p.x + NODE_W/2, p.y + NODE_H`) and enters at the top-centre of the child (`c.x + NODE_W/2, c.y`). This is geometrically correct.

At deep hierarchies (depth 4+, which will occur with 90 agents), the curves may visually cross in congested columns. This is a layout concern, not a path formula concern. The path formula itself is correct.

### 3. Colour scheme — dark theme consistency

**Verdict: APPROVED**

The canvas background `#0d0d14` is a slightly darker variant of `--bg: #0a0a0f`, creating a deliberate inset/canvas feel separate from the panel surface. Nodes use `--surface2: #1a1a24` background and `--border2: #3a3a4e` border, which is the same pair used throughout the dashboard for secondary cards. This is consistent.

The department colour palette (amber for Executive, red for Security, blue for Engineering, green for QA, accent/purple for DevOps, cyan for Product, pink for HR, teal for PM) matches the sidebar department dots and the existing `agentColor()` mapping. No department has been assigned a colour that collides visually with the dark background — all values have sufficient contrast ratio for the left-border stripe.

The `oc-link` paths use `stroke-opacity: 0.5` at rest and `1.0` on highlight. The stroke is the child node's department colour. This creates a colour-coded connection tree which is the right design choice for distinguishing 21 departments.

### 4. Status dot placement — top-right, 6×6px

**Verdict: APPROVED WITH NOTES**

The dot position (`top: 5px, right: 6px`, 6×6px) is clear and does not overlap the name text (which has `margin-top: 4px` and starts at approximately x=9px from the left edge). The dot is inset enough to avoid clipping on the card's `border-radius: 8px` corner.

**Note:** The status dot has four states — `working` (amber, pulsing, full opacity), `recent` (green, glowing, full opacity), `ready` (teal, 0.6 opacity), `idle` (--text3, 0.4 opacity). The ready/idle distinction relies solely on opacity at the same teal/grey colour. In the dark canvas environment this is subtle — at small zoom levels (0.3x) the dot will be approximately 2px rendered and the opacity difference will be imperceptible. Recommend adding a border `ring` to the ready dot (e.g. `box-shadow: 0 0 0 1px var(--teal)`) to distinguish it from idle without relying only on opacity.

### 5. Node text sizing — 10px bold name, 8px mono dept

**Verdict: APPROVED WITH NOTES**

The typography hierarchy is correct: `oc-name` at 10px/600-weight Space Grotesk for the display name, `oc-dept` at 8px/400-weight JetBrains Mono uppercase for the department label. This creates a clear primary/secondary hierarchy within the 48px card.

**Note:** 8px is at the boundary of legibility for most monitors and is below the WCAG 2.1 minimum for regular text. At 1x zoom the dept label will read acceptably on a high-DPI display but will be marginal on a 1080p 24" screen viewed from normal distance. Recommend bumping `oc-dept` to 9px. This will still fit within the 48px card height given the current padding.

Additionally, `.oc-name` has `white-space: nowrap` and `text-overflow: ellipsis`, which is correct. However, the `overflow: hidden` on `.oc-node` combined with `foreignObject` requires that the browser correctly clips the HTML inside the SVG foreign object — this is a known cross-browser inconsistency in Safari. Test specifically in Safari before marking as fully production-ready.

### 6. Legend readability and positioning

**Verdict: APPROVED**

The legend is positioned in the `.orgchart-toolbar` flexbox alongside the title and zoom controls, separated by `justify-content: space-between`. The three legend items (Working/amber, Active/green, Ready/teal) use 7×7px circle indicators with 9px JetBrains Mono labels in `--text3`. This is compact, readable, and correctly describes the three visible status states.

The legend does not include an "Idle" entry — this is correct, since idle nodes show a near-invisible grey dot that should not be called out as a meaningful state. The legend only describes actionable states.

One gap: the legend does not explain the coloured left border (department colour coding), which is the primary visual encoding in the chart. A small note such as "border = department" with a reference to the left sidebar department key would close this gap for first-time viewers.

### 7. Scalability for 90 agents

**Verdict: APPROVED WITH NOTES**

The layout algorithm is a BFS tree with leaf-counting for X positioning. At 90 agents the SVG canvas width will be determined by `nextLeafX * (NODE_W + H_GAP)`. Assuming roughly 60–70 leaf nodes (agents with no direct reports), the canvas will be approximately `60 * 160 = 9600px` wide. The `.oc-canvas-wrap` has `overflow: auto` and a `max-height: 640px`, so horizontal scrolling will handle the width. This is functional but will require significant horizontal scrolling.

**Specific issues at scale:**

1. The horizontal extent at 90 agents may make the chart impractical to read in a single viewport. The zoom controls (0.3x minimum, 2.5x maximum, 0.15 step) partially address this — at 0.3x a 9600px canvas compresses to ~2880px, still wider than most center panels.

2. The `computeOrgLayout` function runs synchronously in the render thread. At 90 nodes this is acceptable; at 200+ it would need to move to a Web Worker.

3. The `orgLayoutCache` is invalidated only when the registry text changes (`lastRegistryRaw`). This is correct and prevents unnecessary re-layout on every 5-second poll.

4. Highlight on hover (`highlightOrgLinks`) queries all `.oc-link` elements on each mouseover. At 90+ links this is O(n) DOM query on every mouse event — acceptable for now.

---

## Issues Requiring Action (Prioritised)

| Priority | Issue | Recommendation |
|----------|-------|----------------|
| Medium | `oc-dept` font at 8px is marginal for legibility at standard monitor distance | Increase to 9px |
| Medium | Ready/idle status dot distinction relies only on opacity | Add `box-shadow: 0 0 0 1px var(--teal)` ring to ready state |
| Low | Legend does not explain department colour coding via left border | Add "border = dept" note to legend or link to sidebar |
| Low | Safari `foreignObject` + `overflow:hidden` clipping inconsistency | Test in Safari; add `-webkit-` prefix to relevant clip properties if needed |
| Low | At 90 agents the chart is ~9600px wide even at 1x zoom | Consider a collapse/expand behaviour for departments, or a fisheye zoom |

---

## Verdict

**APPROVED WITH NOTES**

The core implementation is correct, consistent with the dark theme, and will render a meaningful live hierarchy for up to 90 agents. The bezier connector formula is mathematically correct. The card dimensions, colour scheme, and status dot states are all production-quality.

The two medium-priority notes (8px dept label and ready/idle opacity-only distinction) should be resolved before this chart becomes the primary view for a 90-agent organisation. They do not block the current deployment given the chart is one tab among five and the zoom controls compensate for scale issues.

No changes required before release of the current scope.
