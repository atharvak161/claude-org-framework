# PERFORMANCE TEST REPORT — monitor.html
**Role:** Performance Tester  
**Date:** 2026-06-06  
**File audited:** /Users/atharva/Downloads/organisation/monitor.html  
**Method:** Static source-code analysis  

---

## Executive Summary

Seven performance concerns were identified through static analysis of monitor.html. Two are **high-risk** (overlapping refresh calls can cause data corruption and UI thrashing; unbounded `allFiles` rebuild on every refresh causes redundant full directory walks). Three are **medium-risk** (no deleted-file cleanup in `fileSnapshots` was already fixed; `listFilesRecursive` is dead code duplication; sequential `readFileMeta` in `renderHistoryDeliverables` serialises I/O). Two are **low-risk** (depth limit is adequate but undocumented; `allFiles` re-walk duplicates work already done by `scanForChanges`).

---

## Issue 1 — `scanForChanges` concurrency guard (PRESENT but incomplete)

**Lines:** 2839, 2859–2887  
**Risk:** Medium — just slow / potential stale-data  

### Finding
`isScanning` correctly prevents `scanForChanges` from overlapping itself:

```js
let isScanning = false;   // line 2839

async function scanForChanges() {
    if (!orgHandle || isScanning) return;  // line 2860
    isScanning = true;                     // line 2861
    …
    finally { isScanning = false; }        // line 2886
}
setInterval(scanForChanges, 1000);         // line 2892
```

The guard works correctly: if a scan takes longer than 1 second the next tick is dropped, not queued.

### Problem
The scan calls `refresh()` (line 2884) but `refresh()` has **no concurrency guard of its own**. A scan-triggered `refresh()` and a user-triggered `refresh()` (manual "Refresh now" button, line 1863) can run simultaneously. Both will issue `Promise.all` reads, walk the directory, and call all render functions concurrently. The render functions write `innerHTML` and update `renderHashes`. If two concurrent `refresh()` calls complete in different orders, the second write overwrites whatever the first rendered — producing a UI flash and potentially stale render hashes that suppress future correct renders.

### Recommended fix
Add `let isRefreshing = false;` alongside `isScanning` and guard `refresh()`:

```js
let isRefreshing = false;

async function refresh() {
    if (!orgHandle || isRefreshing) return;
    isRefreshing = true;
    try {
        …
    } finally {
        isRefreshing = false;
    }
}
```

---

## Issue 2 — `walkEntireDir` depth limit

**Lines:** 2842–2857  
**Depth limit:** `depth > 8` (line 2843)  
**Risk:** Low — currently safe; could become a problem if repo grows  

### Finding
```js
async function* walkEntireDir(dirHandle, prefix, depth) {
    if (depth > 8) return;   // line 2843
    …
}
```

A maximum depth of 8 levels is applied. This is **sufficient** for the current workspace structure (deepest known path is `src/projects/<repo>/src/components/…` which is 5 levels). However, the limit is a bare number with no named constant, making it easy to miss when reviewing.

### Risk assessment
No crash risk at current repo depth. If a submodule like `atharvak161-github-io` or `Excel-Project-Hub` is ever scanned (currently they are inside `src/projects/` and their `node_modules`/`.git` are skipped by `SKIP_DIR_NAMES`), pathological nesting could be reached in theory. At depth > 8 the generator silently returns, so the worst outcome is missing files — not a crash.

### Recommended fix
Extract to a named constant for clarity:

```js
const MAX_WALK_DEPTH = 8;  // near the top with other constants
…
if (depth > MAX_WALK_DEPTH) return;
```

No functional change needed; this is a readability improvement only.

---

## Issue 3 — `listFilesRecursive` vs `walkEntireDir` — duplication

**Lines:** 2983–3007 (`listFilesRecursive`), 2842–2857 (`walkEntireDir`)  
**Risk:** Medium — code bloat, divergence risk, hidden O(n²) in old code path  

### Finding
The codebase contains **two independent directory-walk implementations** that do the same thing:

| Function | Used where | Behaviour |
|---|---|---|
| `walkEntireDir` | `scanForChanges` (line 2866), `refresh` allFiles build (line 4475) | Async generator, yields `{path, handle}`, uses `SKIP_DIR_NAMES`, depth-limited |
| `listFilesRecursive` | Nowhere in current code | Returns `string[]`, navigates from root per recursion, skips `.git` and `.` names only |

A comment at line 2979 notes a previous O(n²) fix applied to `listFilesRecursive`, but this function is **not called anywhere** in the current code. The `allFiles` array in `refresh()` is now built directly via `walkEntireDir` (line 4474–4476). `listFilesRecursive` is dead code.

### Risk
Dead code has no runtime cost, but it creates confusion about which walker to use, and the two implementations diverge: `listFilesRecursive` does not apply `SKIP_DIR_NAMES`, so if it were called it would crawl `node_modules` and `.git`. A future developer adding a feature might reach for `listFilesRecursive` and inadvertently scan unwanted directories.

### Recommended fix
Remove `listFilesRecursive` entirely (lines 2979–3007). All call sites should use `walkEntireDir`. Add a comment to `walkEntireDir` noting it is the single source of truth for directory traversal.

---

## Issue 4 — `refresh()` concurrency — no guard (CRITICAL)

**Lines:** 4405–4531  
**Risk:** High — UI data corruption, stale render-hash suppression, wasted I/O  

### Finding
`refresh()` is an `async` function with no re-entrancy guard:

```js
async function refresh() {
    if (!orgHandle) return;   // line 4406 — only checks handle, not in-progress flag
    …
}
```

`refresh()` can be called from **five independent paths** simultaneously:
1. `scanForChanges()` — up to once per second when files change (line 2884)
2. Manual "Refresh now" button (line 1863)
3. `connectFolder()` after folder selection (line 2918)
4. `reconnectFolder()` after permission grant (line 2938)
5. `switchTab()` when switching to History, OrgChart, or Agents tabs (lines 3851–3854)

If a scan detects a change at `t=0` and fires `refresh()`, and the user clicks "Refresh now" at `t=0.3s` before the first refresh finishes, both execute concurrently. They both:
- Walk the entire directory via `walkEntireDir` (duplicated I/O)
- Issue 6 `readFile` calls in `Promise.all` (12 total file reads in flight)
- Write to the same DOM elements (whichever finishes last wins — non-deterministic)
- Update `renderHashes` independently — the hash written by the slower call may be stale data, suppressing the next legitimate render

### Recommended fix
Identical to Issue 1 recommendation — a single `isRefreshing` flag with `try/finally` reset. This is the most important fix in this report.

---

## Issue 5 — `fileSnapshots` Map — deleted-file cleanup

**Lines:** 2877–2881  
**Risk:** Low — already implemented correctly  

### Finding
A specific concern was whether deleted files are cleaned up from `fileSnapshots`. They are:

```js
// Detect deleted files
for (const [path] of fileSnapshots) {    // line 2877
    if (!seen.has(path)) {
        fileSnapshots.delete(path);        // line 2879
        changed = true;
    }
}
```

The cleanup loop runs after every scan. Deleted files are removed from the Map and trigger a refresh. **No memory leak exists here.**

### Caveat
`fileSnapshots` can still grow large if the repository has many thousands of files — the Map stores one entry per file indefinitely while the folder is connected. For this workspace (hundreds of files) this is not a concern. If `src/projects/` submodules were fully scanned, it could reach 10,000+ entries, but `node_modules` and `.git` are excluded by `SKIP_DIR_NAMES`.

**No fix required.**

---

## Issue 6 — `allFiles` rebuilt on every `refresh()` call (HIGH IMPACT)

**Lines:** 4474–4476  
**Risk:** High — unnecessary I/O, adds latency to every refresh cycle  

### Finding
Inside every `refresh()` call, `allFiles` is rebuilt from scratch by walking the entire directory tree:

```js
// Line 4474–4476
const allFiles = [];
for await (const { path } of walkEntireDir(orgHandle, '', 0)) {
    allFiles.push(path);
}
```

This walk happens **on every refresh**, even when `scanForChanges` has not detected any file-system changes. For example, if `refresh()` is triggered by a file *modification* (not creation or deletion), the set of files has not changed — yet the full walk runs again to rebuild `allFiles`.

`walkEntireDir` is also run inside `scanForChanges` itself (line 2866). So when a change is detected, the directory is walked **twice in quick succession**: once in `scanForChanges` to detect the change, and immediately again inside `refresh()` to rebuild `allFiles`. These two walks are completely independent and redundant.

### Impact
On a workspace with several hundred files, each walk involves async I/O for every entry (directory listings + file handle resolution). On a slow disk or large project this adds noticeable latency to every refresh cycle.

### Recommended fix
Cache `allFiles` as a module-level variable and only rebuild it when `scanForChanges` detects a structural change (file added or deleted — not just modified):

```js
let cachedAllFiles = [];
let allFilesDirty = true; // set true on add/delete, false on modify-only

// In scanForChanges, track change type:
let structuralChange = false;
// … on new file: structuralChange = true;
// … on deleted file: structuralChange = true;
if (structuralChange) allFilesDirty = true;

// In refresh():
if (allFilesDirty) {
    cachedAllFiles = [];
    for await (const { path } of walkEntireDir(orgHandle, '', 0)) {
        cachedAllFiles.push(path);
    }
    allFilesDirty = false;
}
const allFiles = cachedAllFiles;
```

This reduces full-walk frequency from "every refresh" to "only when files are added or deleted."

---

## Issue 7 — `renderHistoryDeliverables` sequential-within-parallel reads

**Lines:** 3767–3800  
**Risk:** Medium — latency on History tab open  

### Finding
`renderHistoryDeliverables` correctly uses `Promise.all` to parallelise metadata reads across all completed deliverable files:

```js
const rows = await Promise.all(completed.map(async ({ doc, path }) => {    // line 3781
    const cached = deliverableFileMeta[path];
    if (!cached || (Date.now() - cached.cachedAt) > METADATA_TTL) {
        const meta = await readFileMeta(orgHandle, path);    // async within map fn
        if (meta) deliverableFileMeta[path] = { ...meta, cachedAt: Date.now() };
    }
    …
}));
```

This is **correctly parallelised** — `Promise.all` fires all `readFileMeta` calls concurrently. The 5-minute TTL cache (`METADATA_TTL = 5 * 60 * 1000`, line 2812) further reduces redundant reads.

### Remaining concern
`readFileMeta` (line 2963) navigates the directory handle chain (`getDirectoryHandle` per path segment) for every file individually. There is no handle caching — if 20 files share the prefix `docs/projects/financial-dashboard/`, the `docs/` and `projects/` directory handles are re-acquired 20 times each. This is not a crash risk, but it is wasted work.

### Recommended fix (optional)
Cache resolved directory handles at each path level in a `Map<string, DirectoryHandle>`. This is a moderate refactor and only materially helps when the History tab has many deliverables in the same directories.

---

## Summary table

| # | Issue | Lines | Risk | Status |
|---|---|---|---|---|
| 1 | `scanForChanges` guard present, but `refresh()` has no guard | 2859, 4405 | Medium (scan), High (refresh) | Needs fix |
| 2 | `walkEntireDir` depth limit of 8 — adequate, unnamed constant | 2843 | Low | Refactor only |
| 3 | `listFilesRecursive` is dead code — diverges from `walkEntireDir` | 2983–3007 | Medium | Remove |
| 4 | `refresh()` has no re-entrancy guard — concurrent calls corrupt DOM | 4405 | **HIGH** | Fix urgently |
| 5 | `fileSnapshots` deleted-file cleanup — correctly implemented | 2877–2881 | None | No action |
| 6 | `allFiles` rebuilt on every refresh — double-walks directory | 4474–4476 | **HIGH** | Fix |
| 7 | Directory handle re-traversal per file in History tab | 2963–2977 | Medium | Optional optimise |

---

## Priority action list

1. **[CRITICAL]** Add `isRefreshing` guard to `refresh()` — prevents concurrent refresh calls from corrupting DOM and render hashes.
2. **[HIGH]** Cache `allFiles` and only rebuild on structural file-system changes — eliminates the double directory walk per refresh cycle.
3. **[MEDIUM]** Delete `listFilesRecursive` — dead code that could mislead future developers.
4. **[LOW]** Name the depth constant (`MAX_WALK_DEPTH = 8`).
5. **[OPTIONAL]** Directory handle caching in `readFileMeta` for History tab performance.
