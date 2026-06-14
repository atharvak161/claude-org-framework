# Org Chart Redesign — Design Specification

Authors: Creative Director, Brand Designer (Design department)
Date: 2026-06-01
Status: Approved for implementation

## Problem with the current chart

The existing org chart is a pure top-down SVG tree rendered with `<foreignObject>`
HTML nodes. With 90 agents across 21 departments it sprawls horizontally,
forcing heavy horizontal scrolling. Node width is fixed at 120px and names are
truncated with `text-overflow: ellipsis`, so full agent names are not readable.
SVG + foreignObject is also fragile to lay out reliably at this node count.

## Design brief (from Atharva)

- More vertical layout (taller, narrower) — less horizontal scrolling.
- Full agent names must be readable, never truncated.
- Department clusters visually grouped with a background and border.
- Fits comfortably in a browser panel without excessive scrolling.
- Dark theme, consistent with the existing monitor design.

## Design decisions

### 1. Layout — department-clustered grid

Replace the single wide tree with a department-clustered layout:

```
            ┌──────────┐
            │ Atharva  │          (prominent, full-width centred)
            └────┬─────┘
            ┌────┴─────┐
            │  Chief   │          Guide & Explainer shown alongside
            │ of Staff │          (both report to Atharva)
            └────┬─────┘
   ┌─────────────┼─────────────┐
 cluster      cluster        cluster      ← 3-column grid of departments
 cluster      cluster        cluster
   ...           ...           ...
```

Departments flow top-to-bottom in a responsive 3-column grid. The user scrolls
vertically through departments instead of horizontally across a tree. Each
cluster is self-contained: department header, director at top, team below.

### 2. Node design

- Agent nodes: rectangular cards, comfortable padding, font 11px, full name on
  a single line (no ellipsis — cluster is wide enough; wraps only if needed).
- Director nodes: slightly larger/bolder (12px, weight 700), department-tinted.
- Atharva: full-width prominent node, accent gradient, 16px bold.
- Chief of Staff: prominent amber-bordered node directly below Atharva.
- Guide & Explainer: a peer node beside Chief of Staff (also reports to Atharva).

### 3. Department clusters

Each department is a card with:
- Background = department colour at ~6% opacity over the base surface.
- 1px border = department colour at ~30% opacity.
- Uppercase monospace header in the full-strength department colour.
- Director rendered first (department-tinted box), team members listed below.

Department colours reuse the existing `deptColor()` mapping verbatim so the chart
stays consistent with the rest of the monitor (tooltips, table, legend).

### 4. Connections

- A short vertical connector from Atharva down to the Chief of Staff row.
- No per-agent connector lines inside clusters — the visual grouping (header +
  director-on-top ordering) communicates hierarchy. Drawing 90 lines was the main
  source of clutter; the cluster card replaces them.

### 5. Status dots

Keep the existing four states driven by `agentStatusFor(name)`:
- working — amber, pulsing, glow.
- recent — green, glow.
- ready — teal, dimmed (registry Active but not yet active in activity log).
- idle — grey, faded.

A small dot sits to the left of every agent and director name.

### 6. Zoom

Keep the existing zoom buttons. Instead of re-rendering an SVG at a new size, the
zoom now applies a CSS `transform: scale()` to the `.oc-container`, with
`transform-origin: top center`, so zoom is instant and crisp.

## Technical direction

- Switch the org chart from SVG/foreignObject to plain HTML/CSS divs. Far more
  reliable and readable at 90 nodes, and names never truncate.
- New CSS uses `color-mix(in srgb, var(--dept-color) X%, ...)` per cluster via a
  `--dept-color` custom property set inline on each `.oc-cluster`.
- Remove `computeOrgLayout`, `buildOrgTree`, `highlightOrgLinks` (SVG-only).
- Keep and reuse `agentStatusFor`, `deptColor`, `roleToName`, `openAgentDetail`.

## Department ordering

Clusters render in a sensible top-to-bottom priority order, executive functions
first: Executive (Guide), HR, PM, Engineering, Security, QA, DevOps, Product,
Data, Design, Marketing, Sales, Finance, Legal, Support, Research, Operations,
PR, Strategy, Career. Executive (Chief of Staff / Guide) is hoisted into the top
row and not repeated as a grid cluster.

## Success criteria

- All 90 agents visible with full, untruncated names.
- 21 departments rendered as colour-coded clusters in a 3-column grid.
- Status dots reflect live activity for every agent.
- Clicking any agent or director opens the agent detail panel.
- No horizontal scrolling at default zoom in a standard browser panel.
- CSS fully self-contained in the existing `<style>` block; dark theme preserved.
