# Performance Report — monitor.html

**Auditor:** Performance Tester  
**Date:** 2026-06-01  
**File audited:** `/Users/atharva/Downloads/organisation/monitor.html` (4,639 lines)  
**Scope:** Refresh cycle, DOM rendering, memory growth, file system access patterns

---

## Executive Summary

The dashboard has three root causes for feeling "not live" or laggy:

1. Three sequential `listFilesRecursive()` calls run one-after-the-other inside every 5-second refresh tick, each making many async directory traversals. These block the rest of the render pipeline.
2. `renderHistoryDeliverables()` awaits `readFileMeta()` for every `.md` file in `docs/` on every refresh cycle when the History tab is active, ignoring the existing `deliverableFileMeta` cache for already-seen files.
3. Every innerHTML-producing render function rebuilds the entire DOM from scratch on every tick — no diffing, no incremental update.

---

## Findings

---

### CRITICAL — Sequential `listFilesRecursive()` calls block the refresh pipeline

**Lines:** 4362–4365

```js
const allFiles = [];
for (const dir of ['docs', 'org', 'review']) {
  await listFilesRecursive(orgHandle, dir, allFiles);
}
```

These three directory scans run **sequentially** inside a `for…of` loop with `await`. Each call traverses the full subtree of its directory before the next one starts. On a typical project with 30–60 files across three dirs, this means three back-to-back blocking traversals per 5-second tick.

**Fix:** Run all three scans in parallel with `Promise.all`:

```js
const [docFiles, orgFiles, reviewFiles] = await Promise.all([
  listFilesRecursive(orgHandle, 'docs'),
  listFilesRecursive(orgHandle, 'org'),
  listFilesRecursive(orgHandle, 'review'),
]);
const allFiles = [...docFiles, ...orgFiles, ...reviewFiles];
```

This alone will cut the file-scan phase to ~33% of its current duration when all three directories have similar sizes.

---

### CRITICAL — `renderDeliverables()` is called on every refresh even though its DOM target no longer exists

**Lines:** 4388

```js
await renderDeliverables(allFiles, activityEntries);
```

**Lines:** 3435–3437

```js
async function renderDeliverables(files, activityEntries) {
  const el = document.getElementById('deliverables-body');
  if (!el) return; // panel removed from Feed tab in the live/history redesign
```

`renderDeliverables()` immediately returns `null` because `deliverables-body` was removed from the HTML during the redesign — yet the call site still awaits it on every single refresh cycle, including its internal `Promise.all` with `readFileMeta()` calls for every project file. Even though it early-returns, the function is still entered, `getElementById` is called, and the `await` suspends execution. This is dead code that wastes every refresh tick.

**Fix:** Remove the `await renderDeliverables(allFiles, activityEntries)` call at line 4388 entirely. The function and its `deliverableFileMeta` cache path are now only reached from `renderHistoryDeliverables()`.

---

### CRITICAL — `renderHistoryDeliverables()` awaits metadata reads one-by-one via `Promise.all`, but skips the cache incorrectly

**Lines:** 3699–3716

```js
const rows = await Promise.all(completed.map(async ({ doc, path }) => {
  if (!deliverableFileMeta[path]) {
    const meta = await readFileMeta(orgHandle, path);
    if (meta) deliverableFileMeta[path] = meta;
  }
  // ...
}));
```

The cache check `if (!deliverableFileMeta[path])` only skips the file read if the cache already has an entry. On the first time the History tab is loaded, every file gets read. On subsequent refreshes with the History tab still active, **if any file's metadata has changed since it was cached, the cache will serve stale data forever** — and if it has not changed, the read is skipped correctly.

However, the more serious problem is that the cache **never invalidates**. A file that grows in size will continue showing the old size until the page is reloaded. Combine this with `renderHistoryDeliverables()` being called on every 5-second refresh when the History tab is active, and you get either unnecessary file reads or permanently stale metadata display.

**Fix — Option A (correct and cheap):** Re-read metadata on every refresh but compare `lastModified` to decide whether to update the display value:

```js
const rows = await Promise.all(completed.map(async ({ doc, path }) => {
  const cached = deliverableFileMeta[path];
  // Only hit disk if not cached yet
  if (!cached) {
    const meta = await readFileMeta(orgHandle, path);
    if (meta) deliverableFileMeta[path] = meta;
  }
  // Use cached value (which may now be present)
  const meta = deliverableFileMeta[path];
  // ...
}));
```

**Fix — Option B (correct for live data):** Always re-read metadata on History tab refresh to pick up size/time changes, but use `Promise.all` (already done) so reads are parallel, not sequential.

The `Promise.all` is already present so reads are parallel — the real issue is the never-invalidating cache. Use Option B: drop the cache guard and always re-read, but keep `Promise.all` to keep it parallel.

---

### HIGH — `AGENT_REGISTRY.md` is read on every refresh even when unchanged, but the comparison is correct

**Lines:** 4324–4333

```js
const [actContent, decContent, blkContent, stsContent, regContent] = await Promise.all([
  readFile(orgHandle, 'org/ACTIVITY.md'),
  readFile(orgHandle, 'org/DECISIONS.md'),
  readFile(orgHandle, 'org/BLOCKERS.md'),
  readFile(orgHandle, 'org/STATUS.md'),
  readFile(orgHandle, 'org/AGENT_REGISTRY.md'),
]);

if ((regContent || '') !== lastRegistryRaw) {
  lastRegistryRaw = regContent || '';
  agentRegistry = parseAgentRegistry(regContent);
}
```

The registry file is fetched and fully read from disk on every 5-second tick even when it has not changed. The string comparison `(regContent || '') !== lastRegistryRaw` only guards the re-parse — not the read itself. For a large registry the read and full text comparison run every tick regardless.

**Fix:** The File System Access API does not expose file modification times at the handle level without calling `getFile()`. The cheapest mitigation is to store only the file size (from `readFileMeta`) and skip the full read if size is unchanged:

```js
const regMeta = await readFileMeta(orgHandle, 'org/AGENT_REGISTRY.md');
let regContent = lastRegistryRaw;
if (!regMeta || regMeta.lastModified !== lastRegistryModified) {
  regContent = await readFile(orgHandle, 'org/AGENT_REGISTRY.md');
  lastRegistryModified = regMeta ? regMeta.lastModified : null;
  agentRegistry = parseAgentRegistry(regContent);
  lastRegistryRaw = regContent;
}
```

This requires adding `let lastRegistryModified = null` to the global state (next to `lastRegistryRaw`).

---

### HIGH — `STATUS.md` is read twice per refresh cycle

**Lines:** 4320–4326 (first read, inside `Promise.all`):

```js
readFile(orgHandle, 'org/STATUS.md'),
```

**Lines:** 4371–4372 (second read, metadata only):

```js
const stsMeta = await readFileMeta(orgHandle, 'org/STATUS.md');
renderFeedStatus(stsContent, stsMeta ? stsMeta.lastModified : null);
```

`STATUS.md` is fetched in full in the initial `Promise.all`, then its metadata is fetched again separately afterwards. This means two filesystem traversals to the same file per tick: one for content, one for `{size, lastModified}`.

**Fix:** Replace `readFile` for STATUS.md with a combined read that returns both content and metadata. Or, since `readFile` already calls `fileHandle.getFile()` internally, extend `readFile` to return `{text, size, lastModified}` for the files that need it, or simply combine both reads into the initial `Promise.all`:

```js
const [actContent, decContent, blkContent, stsCombined, regContent] = await Promise.all([
  readFile(orgHandle, 'org/ACTIVITY.md'),
  readFile(orgHandle, 'org/DECISIONS.md'),
  readFile(orgHandle, 'org/BLOCKERS.md'),
  readFileWithMeta(orgHandle, 'org/STATUS.md'),  // returns { text, lastModified }
  readFile(orgHandle, 'org/AGENT_REGISTRY.md'),
]);
const stsContent = stsCombined?.text ?? null;
const stsLastModified = stsCombined?.lastModified ?? null;
// ...
renderFeedStatus(stsContent, stsLastModified);
```

---

### HIGH — `renderLiveNow()` rebuilds `innerHTML` from scratch on every refresh

**Lines:** 3549–3613

```js
function renderLiveNow(allEntries1h, allFiles) {
  const grid = document.getElementById('live-now-grid');
  // ...
  grid.innerHTML = order.map(role => { ... }).join('');
}
```

On every 5-second tick, the entire "Live Now" grid is destroyed and rebuilt from scratch via `innerHTML`. If there are 10 active agents this generates and parses ~100 DOM nodes per tick. While this is not catastrophically slow on its own, combined with the other full-rebuild patterns it contributes to the choppy/non-live feel because the grid visually resets and re-renders even when nothing changed.

**Fix:** Store the last rendered role-order and role-data as a string key. Skip the innerHTML rebuild when the data has not changed:

```js
let lastLiveNowKey = '';

function renderLiveNow(allEntries1h, allFiles) {
  const grid = document.getElementById('live-now-grid');
  if (!grid) return;
  const key = allEntries1h.slice(0, 20).join('|');
  if (key === lastLiveNowKey) return; // nothing changed
  lastLiveNowKey = key;
  // ... existing innerHTML rebuild ...
}
```

---

### HIGH — `updateAgentTable()` fully rebuilds a potentially large table on every refresh when the Agents tab is active

**Lines:** 4132–4174

```js
function updateAgentTable() {
  const body = document.getElementById('agents-table-body');
  // ...
  body.innerHTML = agentRegistry.map(a => { ... }).join('');
  // ...
  summary.innerHTML = `...`;
}
```

With 35+ agents in the registry, this rebuilds ~35 `<tr>` elements on every refresh tick the Agents tab is active. If a user keeps the Agents tab open for 5 minutes they will have triggered 60 full table rebuilds, each destroying and recreating 35 rows.

**Fix:** Guard the rebuild with a content hash — same pattern as `renderLiveNow`:

```js
let lastAgentTableKey = '';

function updateAgentTable() {
  const key = agentRegistry.map(a => a.name + agentStatusFor(a.name)).join('|');
  if (key === lastAgentTableKey) return;
  lastAgentTableKey = key;
  // ... existing rebuild ...
}
```

---

### HIGH — `renderOrgChart()` rebuilds the entire org chart DOM on every refresh when the Org Chart tab is active

**Lines:** 4104–4122

```js
function renderOrgChart() {
  const wrap = document.getElementById('oc-canvas-wrap');
  // ...
  wrap.innerHTML = buildClusterHTML(depts);
}
```

`buildClusterHTML()` generates a large HTML string for all agents grouped by department. This runs on every 5-second tick whenever the Org Chart tab is visible, including when there have been no status changes. The org chart is also called unconditionally inside `refresh()` at line 4384.

The current cache check for the registry (`lastRegistryRaw`) skips `parseAgentRegistry()` but does not skip `renderOrgChart()`. Even if the registry is unchanged, the chart is still fully rebuilt.

**Fix:** Add a render cache key that combines `lastRegistryRaw` with the current `agentActivityStats` fingerprint. Only rebuild if that key changes:

```js
let lastOrgChartKey = '';

function renderOrgChart() {
  const statusKey = agentRegistry.map(a => a.name + agentStatusFor(a.name)).join('|');
  const key = lastRegistryRaw.length + '|' + statusKey;
  if (key === lastOrgChartKey) return;
  lastOrgChartKey = key;
  // ... existing rebuild ...
}
```

---

### MEDIUM — `knownFiles` Set grows without bound

**Lines:** 2841, 3497–3543

```js
let knownFiles = new Set();
// ...
files.forEach(f => knownFiles.add(f));
```

`knownFiles` is a `Set` that accumulates every file path ever seen since the folder was connected. Files are added but **never removed**. If agents create and delete files rapidly over a long session, `knownFiles` will contain ghost entries for files that no longer exist. This causes `renderNewFiles()` to iterate over an ever-growing set and `Array.from(knownFiles).slice(-20).reverse()` to always re-slice from a set that keeps growing.

This is not a memory emergency (file paths are short strings) but it will degrade over very long sessions. The fix is to replace the set content on each refresh:

```js
// In renderNewFiles(), after computing newFiles:
const prevKnown = new Set(knownFiles);
knownFiles = new Set(files); // replace with current disk state
const newFiles = files.filter(f => firstLoadDone && !prevKnown.has(f));
```

---

### MEDIUM — `deliverableFileMeta` cache grows without bound and never invalidates

**Lines:** 2845, 3456–3458, 3700–3702

```js
let deliverableFileMeta = {}; // path -> { size, lastModified }
// ...
if (!deliverableFileMeta[found]) {
  const meta = await readFileMeta(orgHandle, found);
  if (meta) deliverableFileMeta[found] = meta;
}
```

The cache is keyed by path and entries are written once and never updated. A file that is modified will display stale size and "last modified" timestamps in the History deliverables list and the (now-dead) `renderDeliverables()` function. There is no TTL or eviction mechanism.

**Fix:** Store `lastModified` in the cache entry and invalidate when the file changes on disk:

```js
if (!deliverableFileMeta[path] || deliverableFileMeta[path].lastModified !== onDiskMeta.lastModified) {
  deliverableFileMeta[path] = onDiskMeta;
}
```

This requires reading metadata for every file on every refresh (to compare), which eliminates most of the cache benefit. For the history deliverables panel (where metadata accuracy matters) it is worth doing. For purely decorative size/time badges it is acceptable to use a TTL: invalidate cache entries older than 30 seconds.

---

### MEDIUM — `computeAgentActivity()` parses the full raw `ACTIVITY.md` content twice per refresh

**Lines:** 3974–4010

```js
function computeAgentActivity(entries48h, rawContent) {
  // ...
  // Walk entries48h (already parsed) for 48h stats
  entries48h.forEach(line => { ... });

  // Walk rawContent (raw string) again for "everLogged" detection
  (rawContent || '').split('\n').forEach(line => { ... });
}
```

The function receives already-parsed `entries48h` but then re-splits `rawContent` from scratch to find "everLogged" agents. This means the entire raw ACTIVITY.md string is split into lines, trimmed, and scanned a second time per refresh. On a large log file this is redundant CPU work.

**Fix:** Pass `parseActivityAll(rawContent)` as a third parameter instead of the raw string, or derive `everLogged` from the already-parsed all-entries list that `lastAllActivityEntries` already holds:

```js
// lastAllActivityEntries is already computed just above computeAgentActivity() call
computeAgentActivity(activityEntries, lastAllActivityEntries); // pass parsed, not raw
```

And inside `computeAgentActivity()` replace the `rawContent.split('\n')` loop with iteration over the passed array.

---

### MEDIUM — `renderActivityList()` and `renderActivity()` are near-duplicate functions doing full innerHTML rebuilds

**Lines:** 3234–3273, 3275–3327

Both functions rebuild the entire feed from an array of strings using `.map().join('')` and `innerHTML` assignment. The live feed (called from `refresh()` via `renderActivity()`) is passed `activityEntries` (48h, up to 30 entries). Anything changed will cause 30 DOM rows to be destroyed and recreated.

Since the feed is sorted newest-first and new entries only appear at the top, a prepend strategy (inserting only new entries at the top rather than rebuilding everything) would reduce DOM churn dramatically. There is no deduplication or diff today.

---

### LOW — `renderActivity()` targets `activity-feed` which no longer exists

**Lines:** 3275–3281

```js
function renderActivity(entries) {
  const feed = document.getElementById('activity-feed');
  if (!feed) {
    // Feed-tab activity feed removed in the live/history redesign; nothing to render.
    return;
  }
```

`renderActivity()` is called inside `refresh()` at line 4343 but immediately returns because the target element was removed during the redesign. This is dead code: the function is invoked, a DOM query fires, and it returns. Not a measurable performance issue but it adds confusion and a tiny per-tick overhead.

**Fix:** Remove the `renderActivity(activityEntries)` call at line 4343 and delete the `renderActivity()` function body (or the function entirely). The live view is now served by `renderLiveNow()` and the history view by `renderActivityList()`.

---

### LOW — Event listeners on inline `onclick` attributes in dynamically generated HTML are not cleaned up

Throughout the file, dynamic HTML is generated with inline `onclick="viewFile('...')"` and `onclick="openAgentDetail('...')"` strings injected directly into `innerHTML`. Because `innerHTML` assignment destroys and re-creates the DOM nodes on every refresh, the old nodes (and any attached event listeners) are discarded and new ones are created. There is no leak in the classic sense, but it means the browser must garbage-collect the old nodes on every tick. With 30+ activity entries + org chart nodes this is moderate GC pressure every 5 seconds.

This is not a fixable issue without a full virtual-DOM or diff approach. It is noted here as a lower-priority concern once the critical bottlenecks are resolved.

---

## Refresh Cycle — Operations in Order

On each 5-second `refresh()` call, the following async operations occur in sequence:

1. `orgHandle.queryPermission()` — one IPC call per tick to verify permission.
2. `Promise.all([readFile × 5])` — reads ACTIVITY.md, DECISIONS.md, BLOCKERS.md, STATUS.md, AGENT_REGISTRY.md in parallel. This is correctly parallelised.
3. Registry re-parse (conditional on content change) — CPU only.
4. Four parse passes over ACTIVITY.md: `parseActivityEntries()`, `parseActivityLive()`, `parseActivityHistory()`, `parseActivityAll()` — all CPU, all iterating the same string separately.
5. `computeAgentActivity()` — CPU, iterates entries48h + re-splits rawContent from scratch.
6. Five synchronous DOM render calls: `renderActivity()` (dead), `renderDecisions()`, `renderBlockers()`, `renderStatus()`, `updateLiveCounts()`.
7. **SEQUENTIAL** `listFilesRecursive()` × 3 — the biggest bottleneck, should be parallel.
8. `renderLiveNow()`, `renderInProgress()`, `renderFeedBlockers()` — DOM rebuilds.
9. **EXTRA FILE READ**: `readFileMeta(orgHandle, 'org/STATUS.md')` — second read of STATUS.md.
10. Conditional History tab renders: `renderActivityList()`, `renderHistoryDecisions()`, **`renderHistoryDeliverables()`** (N file reads for N `.md` files).
11. Conditional OrgChart/Agents renders — full DOM rebuilds.
12. `renderNewFiles()` — DOM rebuild.
13. **DEAD CODE**: `await renderDeliverables()` — enters and immediately returns.
14. `renderReviewFiles()` — DOM rebuild.
15. Conditional viewer refresh: `viewFile(currentViewPath, true)` — one more file read if viewer is open.

**Total filesystem operations per tick (worst case — History tab active, viewer open):**
- 5 org file reads (parallel)
- 3 directory tree scans (sequential — should be parallel)
- 1 extra STATUS.md metadata read
- N metadata reads for N `.md` files in docs/ (parallel via `Promise.all` but N can grow)
- 2 file reads for open viewer (content + metadata)

This is **9 + N** filesystem operations per 5-second tick, where N grows as more deliverables are created.

---

## Why It Doesn't Feel Live

### 1. The file scan phase stalls the entire render pipeline

The three sequential `listFilesRecursive()` calls at lines 4362–4365 are awaited one-after-another. All DOM updates that depend on `allFiles` — `renderLiveNow`, `renderInProgress`, `renderNewFiles`, `renderReviewFiles` — are blocked until all three scans complete. If any directory is slow to iterate (network filesystem, slow SSD, many files), the UI freeze is proportional to all three combined, not just the slowest one.

**Exact fix:** Change to `Promise.all` as shown in the CRITICAL finding above.

### 2. Every render function rebuilds from scratch, causing visible flash

No render function diffs its previous output. Every 5 seconds, every visible panel is assigned a new `innerHTML`. This destroys existing DOM nodes, triggers browser layout/paint for the entire panel, and recreates all interactive elements. The user sees a subtle but real "blink" on each refresh cycle — especially noticeable in the Live Now grid and the History feed.

**Exact fix:** Add content-hash guards before each `innerHTML` assignment (shown in HIGH findings above). Only update the DOM when data has actually changed.

### 3. Activity parsing runs four separate passes over the same string

`ACTIVITY.md` is parsed four times per tick: `parseActivityEntries`, `parseActivityLive`, `parseActivityHistory`, `parseActivityAll`. All four functions call `activityLines(content)` which splits and filters the same string. On a 1,000-line activity log this is 4,000 line-splits per tick.

**Exact fix:** Parse the raw content once into a canonical sorted array, then derive the four views by filtering that single array:

```js
const allLines = activityLines(actContent);
const now = Date.now();
const cutoff48h = now - 48 * 60 * 60 * 1000;
const cutoff1h  = now - 60 * 60 * 1000;
const todayStr  = new Date().toISOString().slice(0, 10);

const activityEntries = allLines.filter(/* 48h filter */).slice(-30).reverse();
const liveEntries     = allLines.filter(/* 1h filter */).reverse();
const historyEntries  = allLines.filter(/* older than 1h */).reverse();
const lastAllActivityEntries = [...allLines].reverse();
```

### 4. STATUS.md is read twice — once for content, once for metadata

Every tick, STATUS.md is fetched in full (line 4325) and then its `{size, lastModified}` is fetched again as metadata (line 4371). This is two filesystem operations for the same file. Combining them into a single `readFileWithMeta()` call eliminates one redundant traversal per tick.

### 5. Dead code still runs on every tick

`renderActivity()` (targets a removed element) and `renderDeliverables()` (also targets a removed element) are both called inside `refresh()` and both return immediately — but they still execute, query the DOM, and contribute to the async execution graph. Removing these calls removes two function invocations and two `getElementById` calls per tick. Minor individually, but combined with the other issues they add up.

### 6. The viewer refresh re-reads the open file on every tick

When a file is open in the viewer, `viewFile(currentViewPath, true)` is called at line 4401 on every refresh. This reads the full file content + metadata every 5 seconds regardless of whether the file has changed. For large files (e.g. a full ACTIVITY.md or DELIVERY_SUMMARY.md) this is a guaranteed extra read per tick.

**Exact fix:** Cache the file's `lastModified` when it is first opened, then on refresh read only the metadata first. Only do the full content re-read if `lastModified` changed:

```js
if (currentViewPath) {
  const freshMeta = await getFileMeta(orgHandle, currentViewPath);
  if (freshMeta && freshMeta.lastModified !== lastViewedFileModified) {
    lastViewedFileModified = freshMeta.lastModified;
    viewFile(currentViewPath, true);
  }
}
```

---

## Priority Fix Order

| Priority | Finding | Estimated improvement |
|---|---|---|
| 1 | Parallelise `listFilesRecursive()` × 3 | ~60% reduction in file-scan wall time |
| 2 | Remove dead `renderDeliverables()` call | Eliminates unnecessary await per tick |
| 3 | Combine STATUS.md reads into one | Saves 1 filesystem op per tick |
| 4 | Add content-hash guards to `renderLiveNow`, `renderOrgChart`, `updateAgentTable` | Eliminates most DOM churn when data unchanged |
| 5 | Cache-guard the viewer auto-refresh | Saves 2 filesystem ops per tick when viewer open |
| 6 | Merge four `ACTIVITY.md` parse passes into one | Saves CPU on large log files |
| 7 | Replace `knownFiles` accumulation with snapshot replacement | Prevents ghost entries over long sessions |
| 8 | Add `lastModified`-based invalidation to `deliverableFileMeta` | Fixes stale size/time display |
| 9 | Remove `renderActivity()` dead call | Micro-cleanup |
