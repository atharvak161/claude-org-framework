# Code Review — SVG Org Chart (monitor.html)

**Reviewer:** Code Reviewer
**Date:** 2026-06-02
**File:** /Users/atharva/Downloads/organisation/monitor.html
**Scope:** Org chart subsystem — buildOrgTree, computeOrgLayout, renderOrgChart, highlightOrgLinks, orgZoom, CSS, roleToName, orgLayoutCache

---

## Verdict: PASS WITH NOTES

The org chart subsystem is functionally correct. All six component functions work as intended. Three minor notes are raised below — none are bugs, all are design trade-offs or low-risk edge cases.

---

## 1. buildOrgTree()

**Lines:** 3972–3986

**Verdict: CORRECT**

- Correctly initialises a synthetic `__ATHARVA__` root node with `isRoot: true`.
- Iterates `agentRegistry` twice: first pass creates all nodes, second pass wires parent→child relationships.
- The two-pass approach avoids order-dependency (an agent whose parent appears later in the registry will still link correctly).
- `reportsTo` resolution logic is sound:
  - `/atharva/i` → root
  - `nodes[rt]` exists → parent is that registry entry
  - fallback → root (`__ATHARVA__`)
- The fallback correctly handles agents with unknown or missing `reportsTo` values — they attach to Atharva rather than floating disconnected.
- Empty string `reportsTo` also falls through to root correctly (`nodes['']` is undefined).
- No duplicate-name guard exists. If two registry entries share a name, the second will silently overwrite the first in `nodes`. Low risk for a curated registry file but worth noting.

---

## 2. computeOrgLayout()

**Lines:** 3988–4030

**Verdict: CORRECT**

**BFS depth assignment:**
- Standard BFS from `rootKey` with a `seen` Set — cycle-safe.
- Correctly assigns depth 0 to root, depth 1 to its direct reports, and so on.
- Works correctly for any tree depth and any number of nodes.

**Post-order X assignment (assignX):**
- Leaf nodes get sequential X positions: `nextLeafX * (NODE_W + H_GAP)`, then `nextLeafX++`.
- Parent nodes are centred over their children: `(min(childXs) + max(childXs)) / 2`.
- Recursive closure correctly shares `nextLeafX` across all recursive calls.
- Single-child case: parent X equals child X (centred over one child). Correct.

**Canvas sizing:**
- `width = maxX + NODE_W + PAD*2` — `maxX` is the leftmost edge of the rightmost leaf (unpadded), so `maxX + NODE_W` is its right edge; `PAD*2` adds ~32px left and ~32px right margin. Correct.
- `height = (maxDepth + 1) * (NODE_H + V_GAP) + PAD*2` — accommodates all depth levels with adequate top/bottom margin.
- PAD is added to `p.x` and `p.y` after layout, before storing in `posMap`. Both `positioned` array and `posMap` reference the same objects so coordinates are consistent everywhere.

**Width for 90 agents:**
- With ~80 leaf nodes: `width ≈ 79 * 160 + 140 + 64 ≈ 12,844 px`.
- At default zoom=1 this is very wide; the `oc-canvas-wrap` has `overflow: auto` so horizontal scrolling works correctly.
- The zoom control (−/reset/+) clamped to [0.3, 2.5] allows the user to zoom out; at zoom=0.3 the canvas is ~3,850px, still wider than a typical browser window. **This is a UX note, not a bug** — a horizontal scrollable chart is a reasonable design decision for a 90-node tree.

---

## 3. renderOrgChart()

**Lines:** 4032–4081

**Verdict: CORRECT**

**Bezier paths:**
- `x1, y1` = parent bottom-centre; `x2, y2` = child top-centre.
- `ymid = (y1 + y2) / 2` is the vertical midpoint.
- Bezier: `M x1,y1 C x1,ymid x2,ymid x2,y2` — both control points are at `ymid`, creating a smooth S-curve connector. Correct standard tree-edge pattern.
- `data-to` and `data-from` attributes on each path are set to the correct keys for `highlightOrgLinks` matching.

**ForeignObject nodes:**
- `x`, `y` from `posMap` are already PAD-adjusted. Dimensions use `NODE_W`/`NODE_H` constants, matching the `.oc-node` CSS (`width: 140px; height: 48px`). Consistent.
- `status` is resolved via `agentStatusFor(n.name)` which checks `agentActivityStats` (populated in the same refresh cycle). Correct.
- Root node gets `oc-root` class and no click handler, all others get `openAgentDetail`. Correct.

**viewBox + scaling:**
- `svgW = round(L.width * orgZoomLevel)`, `svgH = round(L.height * orgZoomLevel)`.
- `viewBox="0 0 {L.width} {L.height}"` stays fixed at the native layout dimensions.
- This means: at zoom=1 the SVG element is exactly the layout size (1:1); at zoom=0.5 the SVG element is half the pixel size but shows the full layout (nodes shrink proportionally). This is the correct viewBox zoom approach — no layout recomputation needed on zoom.

**Error handling:**
- `try/catch` wraps the full render — on exception, displays a red error message in the canvas. Correct defensive coding.

---

## 4. highlightOrgLinks()

**Lines:** 4083–4089

**Verdict: CORRECT**

- Queries all `.oc-link` elements and checks `data-to === key || data-from === key`.
- `classList.toggle('highlight', on)` correctly adds/removes the class.
- `.oc-link.highlight` CSS applies `opacity: 1; stroke-width: 2` — visible difference from the default `opacity: 0.5; stroke-width: 1.5`.
- Keys used in `data-to`/`data-from` match exactly those used in `onmouseover`/`onmouseout` handlers (both use `escHtml(p.key)`). No mismatch.
- **Minor note:** agent names containing apostrophes, double quotes, or backslashes would corrupt the inline `onmouseover` handler string. Registry names are expected to be plain text so this is not a real risk, but it is a latent XSS/injection surface if registry content ever becomes user-controlled.

---

## 5. orgZoom()

**Lines:** 4091–4095

**Verdict: CORRECT**

- `delta === 0` → reset to 1.0.
- Otherwise clamp `orgZoomLevel + delta` to `[0.3, 2.5]`. Range is reasonable.
- `if (orgLayoutCache) renderOrgChart()` — correctly guards against calling render before any registry is loaded. Zoom buttons before the org chart is rendered do nothing.
- `orgLayoutCache` is **not** cleared on zoom, which is correct: zoom changes the rendered pixel size of the SVG element but not the computed node positions.

**Cache invalidation:**
- `orgLayoutCache` is set to `null` at module level (line 2807) — properly scoped as a module-level variable.
- Set to `null` in `refresh()` when `regContent !== lastRegistryRaw` (line 4305) — correct invalidation on registry change.
- Repopulated lazily in `renderOrgChart()` at line 4040.
- The pattern is consistent and correct.

---

## 6. CSS

**Verdict: CORRECT — all required classes present and styled correctly**

| Class | Present | Styling |
|---|---|---|
| `.oc-link` | Yes | `fill:none; stroke-width:1.5; opacity:0.5; transition` |
| `.oc-link.highlight` | Yes | `opacity:1; stroke-width:2` |
| `.oc-node` | Yes | `width:140px; height:48px; border-radius:8px; cursor:pointer` |
| `.oc-root` | Yes | `border:2px solid var(--accent); font-weight:700` |
| `.oc-name` | Yes | `font-size:10px; font-weight:600; text-overflow:ellipsis` |
| `.oc-dept` | Yes | `font-size:8px; monospace; uppercase; text-overflow:ellipsis` |
| `.oc-status-dot` | Yes | `6x6px; top:5px; right:6px; border-radius:50%; background:var(--teal); opacity:0.6` |
| `.oc-status-dot.working` | Yes | `var(--amber); pulse animation; box-shadow` |
| `.oc-status-dot.recent` | Yes | `var(--green); box-shadow; opacity:1` |
| `.oc-status-dot.ready` | Yes | `var(--teal); opacity:0.6` |
| `.oc-status-dot.idle` | Yes | `var(--text3); opacity:0.4` |
| `.oc-canvas-wrap` | Yes | `overflow:auto; max-height:640px; width:100%` |

Node dimensions in CSS (140×48px) match the `NODE_W`/`NODE_H` constants in `computeOrgLayout`. This is a critical dependency — they are consistent.

---

## 7. roleToName()

**Lines:** 3751–3883

**Verdict: CORRECT — 97 special-case keys confirmed**

A `node` count of the `special` object yields 97 keys, covering well over 90 agents (some roles have aliases, e.g. `GUIDE` and `GUIDE_EXPLAINER` both map to the same name).

**Spot checks:**

| KEY | Mapped to | Result |
|---|---|---|
| `CHIEF_OF_STAFF` | `'Chief of Staff'` | PASS |
| `CA_ARJUN_MEHTA` | `'CA Arjun Mehta'` | PASS |
| `COO` | `'COO'` | PASS |
| `DIRECTOR_QA` | `'Director QA'` | PASS |
| `GUIDE` | `'Guide and Explainer'` | PASS (alias) |
| `GUIDE_EXPLAINER` | `'Guide and Explainer'` | PASS |
| `SRE` | `'SRE'` | PASS |
| `SDR` | `'Sales Development Representative'` | PASS (alias) |
| `CSO` | `'Chief Strategy Officer'` | PASS (alias) |

**Fuzzy fallback:**
- After the `special` lookup, a registry fuzzy-match normalises both strings and finds registry entries. This means future agents added to the registry work automatically in `renderLiveNow` and `openAgentDetail` without requiring a new special case.
- Final fallback: naive title-case conversion (`SOME_ROLE` → `Some Role`).

The three-tier fallback is robust.

---

## 8. orgLayoutCache — Module-level declaration and invalidation

**Verdict: CORRECT**

- Declared at line 2807: `let orgLayoutCache = null;` — module-level, visible to all functions.
- Invalidated at line 4305 inside `refresh()` when registry text changes.
- Lazily populated at line 4040 inside `renderOrgChart()`.
- NOT cleared on zoom (correct — zoom doesn't affect layout geometry).
- NOT cleared on tab switch (correct — the layout data is still valid).

---

## Notes Summary

1. **UX — wide canvas at 90 agents.** At zoom=1 the canvas is ~12,000–14,000px wide. Users will need to use the zoom controls to get a usable view. Consider defaulting `orgZoomLevel` to `0.5` or auto-fitting to canvas width on first render. Not a bug — just a UX improvement opportunity.

2. **No duplicate-name guard in buildOrgTree.** If two rows in `AGENT_REGISTRY.md` have identical names, the second overwrites the first silently. Low practical risk for a curated file.

3. **Inline event handler string escaping.** `onmouseover`/`onclick` strings use `escHtml(...).replace(/'/g, "\\'")`. This works for normal registry names. If a name ever contains a backslash or double-quote, the generated HTML attribute would break. Not a risk under current registry content but is a latent issue if the registry format ever changes.

---

## Final Verdict

**PASS WITH NOTES**

The restored SVG org chart is structurally sound. The hierarchy build, BFS depth assignment, post-order X centering, bezier connector paths, viewBox zoom, highlight matching, CSS classes, roleToName mappings, and cache invalidation are all implemented correctly. The three notes above are low-severity observations and do not block use.
