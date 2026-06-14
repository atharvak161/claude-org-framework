# MONITOR_AUDIT.md
**Auditor:** Full Stack Tester / Performance Tester
**Date:** 2026-06-02
**File audited:** /Users/atharva/Downloads/organisation/monitor.html

---

## CHECK 1 — All 5 tabs exist and switchTab handles them

**PASS**

All 5 tab panel `<div>` elements are present:
- `id="tab-feed"` — line 2137
- `id="tab-orgchart"` — line 2189
- `id="tab-agents"` — line 2214
- `id="tab-history"` — line 2241
- `id="tab-workflows"` — line 2296

All 5 `<button>` elements call `switchTab()` — lines 2129–2133.

`switchTab()` function at line 3760 uses the array:
```js
['feed', 'orgchart', 'agents', 'history', 'workflows'].forEach(t => { ... });
```
`'workflows'` is confirmed present in the array (line 3762).

---

## CHECK 2 — Org chart is HTML/CSS cluster layout (not SVG tree)

**PASS**

- `buildClusterHTML` function exists — line 4055
- `ocFindDirector` function exists — line 4050
- `renderOrgChart` function exists — line 4107
- CSS class `.oc-dept-grid` defined — line 1326
- CSS class `.oc-cluster` defined — line 1334

`computeOrgLayout` — NOT found (correctly removed).
`buildOrgTree` — NOT found (correctly removed).
`highlightOrgLinks` — NOT found (correctly removed).

Redesign is confirmed: pure HTML/CSS cluster layout, no legacy SVG tree functions remain.

---

## CHECK 3 — Performance fixes landed

**PASS (with note)**

**Parallel directory scan confirmed.** Lines 4373–4380:
```js
// Run all 3 directory scans in parallel — was sequential (blocked render pipeline)
const [d, o, r] = await Promise.all([
  listFilesRecursive(orgHandle, 'docs', []),
  listFilesRecursive(orgHandle, 'org', []),
  listFilesRecursive(orgHandle, 'review', []),
]);
```
No `for...await` sequential loop for directory scanning.

**renderDeliverables removed from refresh().** Line 4403:
```js
// renderDeliverables() removed — target element no longer exists in the Feed tab redesign
```
`renderDeliverables` is not called in `refresh()`.

**renderHashes guard is present** — line 2850: `let renderHashes = {};`
Used at lines 3552–3553 and 4142–4143 to skip redundant re-renders.

Note: The `renderDeliverables` function body still exists (line 3432) as dead code but is not called. This is not a functional issue — it is an acceptable cleanup opportunity but does not constitute a failure.

---

## CHECK 4 — roleToName has all 90 agents

**PASS (spot-check)**

All five required spot-check keys are present in the special cases map:
- `CHIEF_OF_STAFF` — line 3810
- `HR_MANAGER` — line 3814
- `COO` — line 3909
- `CA_ARJUN_MEHTA` — line 3878 (note: key is `CA_ARJUN_MEHTA`, not `CA_ARJUN`)
- `PORTFOLIO_SPECIALIST` — line 3923

Full 90-agent count was not enumerated (outside scope of spot-check instruction), but all five mandatory sentinel keys are confirmed present.

---

## CHECK 5 — Live feed date fix

**PASS**

`parseActivityLive()` at line 3047 uses:
```js
const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD local time
```
This is the correct local-date fix.

**WARNING:** `parseActivityHistory()` at line 3070 still uses:
```js
const todayStr = new Date().toISOString().slice(0, 10);
```
`toISOString()` returns UTC time, which can cause a date-boundary mismatch for users in UTC+N timezones late at night (e.g., at 23:30 local, `toISOString` may return the next UTC day). The live feed function is correctly fixed; the history function has a residual inconsistency.

This is a WARNING, not a FAIL, because the history function is filtering for "not today" — the failure mode only affects which entries appear in history vs live at timezone boundaries.

---

## CHECK 6 — agentStatusFor returns ready not idle for registry agents

**PASS**

`agentStatusFor()` at lines 4015–4024:
```js
function agentStatusFor(name) {
  const s = agentActivityStats[name];
  if (!s) {
    const inReg = agentRegistry.find(a => a.name === name);
    return (inReg && inReg.status !== 'Inactive') ? 'ready' : 'idle';
  }
  return s.status || 'ready';
}
```
- Registry agents with status !== 'Inactive' → `'ready'` (line 4021)
- Agents completely unknown to the system → `'idle'` (line 4021)
- Agents with activity stats → returns their actual status or falls back to `'ready'` (line 4023)

Behaviour is correct.

---

## CHECK 7 — wf-arrow-green marker exists in workflows SVG

**PASS**

- Marker **defined** at line 2316:
  ```xml
  <marker id="wf-arrow-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
  ```
- Marker **used** at line 2459:
  ```xml
  <line x1="600" y1="618" x2="600" y2="654" stroke="#22c55e" stroke-width="2" marker-end="url(#wf-arrow-green)"/>
  ```

Both definition and usage are present.

---

## CHECK 8 — Dead function calls removed

**PASS (with note)**

- `renderActivity()` function body still exists (line 3270) but its call site is commented out at line 4354:
  ```js
  // renderActivity() removed — target element (activity-feed) no longer exists post-redesign
  ```
- `await renderDeliverables` is NOT called in `refresh()` — the call site is replaced by a comment at line 4403.

No live dead calls in the refresh pipeline. The function bodies themselves remain as dead code but are not invoked.

---

## CHECK 9 — ACTIVITY.md single parse

**PASS**

Single parse is implemented at lines 4345–4349:
```js
const actLines = activityLines(actContent);
const activityEntries = parseActivityEntries(null, actLines);   // 48h, for Agents/OrgChart
const liveEntries    = parseActivityLive(null, actLines);       // last 1h, newest-first
const historyEntries = parseActivityHistory(null, actLines);    // older than 1h, newest-first
lastAllActivityEntries = parseActivityAll(null, actLines);      // all-time, for dynamic pending detection
```
`activityLines(actContent)` is called once; the result `actLines` is passed as `preLines` to all four parse functions. Each function uses `preLines || activityLines(content)` — so `activityLines()` is only called once per refresh cycle.

---

## Summary

| Check | Result | Notes |
|-------|--------|-------|
| 1 — All 5 tabs + switchTab | PASS | All tabs present; workflows in array |
| 2 — HTML/CSS cluster org chart | PASS | buildClusterHTML, ocFindDirector present; old SVG tree functions removed |
| 3 — Performance fixes | PASS | Promise.all parallel scan; renderDeliverables not called in refresh() |
| 4 — roleToName 90 agents | PASS | All 5 spot-check keys confirmed |
| 5 — Live feed date fix | PASS + WARNING | parseActivityLive uses toLocaleDateString (correct); parseActivityHistory still uses toISOString (residual inconsistency at line 3070) |
| 6 — agentStatusFor ready/idle | PASS | Registry agents → ready; unknown agents → idle |
| 7 — wf-arrow-green marker | PASS | Defined line 2316, used line 2459 |
| 8 — Dead function calls removed | PASS | renderActivity and renderDeliverables not called in refresh pipeline |
| 9 — ACTIVITY.md single parse | PASS | actLines parsed once, passed as preLines to all 4 parse functions |

**Overall: 9/9 PASS (1 WARNING)**

**Warning detail:** `parseActivityHistory()` at line 3070 uses `toISOString().slice(0, 10)` instead of `toLocaleDateString('en-CA')`. This is a timezone-boundary inconsistency. Recommend aligning with the fix applied in `parseActivityLive()`.
