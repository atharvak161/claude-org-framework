# CODE REVIEW — monitor.html — All Recent Changes
**Reviewer:** CODE_REVIEWER  
**Date:** 2026-06-06 23:53:07  
**File:** monitor.html (4721 lines)  
**Scope:** All 7 focus areas as specified

---

## VERDICT: PASS WITH ONE BUG (LOW SEVERITY)

Overall quality is good. Six of seven focus areas pass cleanly. One bug found in the `isRefreshing` guard.

---

## 1. `updateAgentStatuses` — 3-parameter version

**Status: PASS**

- **Signature:** `function updateAgentStatuses(liveEntries, liveRolesFromLiveMd, allHistoryEntries)` — correct (line 3203).
- **48-hour cutoff:** Uses `entryTimestampFull(l)` (line 3219), which parses `YYYY-MM-DD HH:MM:SS` with sub-day precision. This is correct; it does NOT fall back to date-only string matching.
- **`workingRoles` set:** Built as a union of `liveEntries.slice(0, 10)` mapped through `extractRole` and `liveRolesFromLiveMd` (lines 3210–3213). Correct.
- **`activeRoles` set:** Built from `allHistoryEntries` filtered by `ts >= cutoff48h` (lines 3217–3222). Correct.
- **Dot class assignment:**
  - `working` → `'agent-status working'` (line 3236) — correct
  - `active` → `'agent-status active'` (line 3237) — correct
  - else → `'agent-status'` (line 3238) — correct
- **Called from `refresh()`:** Line 4432: `updateAgentStatuses(liveEntries, liveRolesFromLiveMd, lastAllActivityEntries)` — three arguments, all correct.

**Minor note:** Executive roles (CHIEF_OF_STAFF, GUIDE_EXPLAINER, GUIDE) are forced to `active` (green) even when they would qualify as `working` (amber). This is intentional by design per the comment on line 3228.

**Minor note:** Only the first 10 `liveEntries` are used for `workingRoles` (the `slice(0, 10)`). If >10 unique roles are active in the last 20 minutes, some roles from ACTIVITY.md may not be in `workingRoles`. However, `liveRolesFromLiveMd` (built from all of LIVE.md's 20-min window) compensates — this is acceptable.

---

## 2. `isRefreshing` guard

**Status: PASS WITH BUG**

- **Module-level declaration:** `let isRefreshing = false;` — line 2840. Correct.
- **Guard at entry:** `if (!orgHandle || isRefreshing) return;` — line 4350. Correct.
- **Set to true at entry:** `isRefreshing = true;` — line 4351, immediately after the guard. Correct.
- **`finally` block:** `isRefreshing = false;` — lines 4498–4500. Correct.

**BUG FOUND (LOW SEVERITY):** There is an early `return` inside the permission check at line 4366:

```javascript
async function refresh() {
  if (!orgHandle || isRefreshing) return;
  isRefreshing = true;
  try {                               // ← OUTER try
    try {
      const perm = await orgHandle.queryPermission({ mode: 'read' });
      if (perm !== 'granted') {
        ...
        return;                       // ← line 4366 — inside outer try
      }
    } catch(e) { ... }
    ...
  } finally {
    isRefreshing = false;             // ← runs even on inner return
  }
}
```

**Assessment:** The `return` on line 4366 is inside the **outer** `try` block. JavaScript `finally` blocks always execute when exiting a `try` block, including via `return`. Therefore `isRefreshing` IS correctly reset to `false` in this case. The guard is safe.

**However**, this is fragile and non-obvious. A developer who misreads the nesting might think the `return` bypasses the `finally`. The code is correct but the nesting makes it harder to reason about. This is a readability concern, not a functional bug.

**Recommendation:** Add a comment at line 4366 noting that the outer `finally` still fires: `return; // finally block at end still resets isRefreshing`

---

## 3. `allFiles` caching

**Status: PASS**

- **Module-level declarations:** `let cachedAllFiles = [];` (line 2841) and `let allFilesNeedsRebuild = true;` (line 2842) — both declared at module scope. Correct.
- **`allFilesNeedsRebuild = true` in `scanForChanges`:** Line 2888, inside `if (changed)`. Correct — set only when a structural change is detected (file added, modified, or deleted).
- **`refresh()` rebuild guard:** Lines 4435–4441:
  ```javascript
  if (allFilesNeedsRebuild) {
    cachedAllFiles = [];
    for await (const { path } of walkEntireDir(orgHandle, '', 0)) {
      cachedAllFiles.push(path);
    }
    allFilesNeedsRebuild = false;
  }
  const allFiles = cachedAllFiles;
  ```
  Correct — rebuilds only when flagged, then clears the flag.

---

## 4. `RIGHT_NOW_WINDOW_MS`

**Status: PASS**

- **Declared separately from `LIVE_WINDOW_MS`:**
  ```javascript
  const LIVE_WINDOW_MS = 20 * 60 * 1000;               // line 3053
  const RIGHT_NOW_WINDOW_MS = 2 * 60 * 1000;           // line 3054
  ```
  Distinct constants, not aliases of each other. Correct.

- **`parseRightNow` uses `RIGHT_NOW_WINDOW_MS`:** Line 3510: `const cutoff = Date.now() - RIGHT_NOW_WINDOW_MS;` — correct.

- **`liveRolesFromLiveMd` in `refresh()` uses `LIVE_WINDOW_MS`:** Line 4427: `return ts && (Date.now() - ts) < LIVE_WINDOW_MS;` — correct, not RIGHT_NOW_WINDOW_MS.

---

## 5. `listFilesRecursive` and `renderActivity` deleted

**Status: PASS**

- `grep listFilesRecursive` → 0 results. Completely absent.
- `grep renderActivity` → 1 result (line 4401), which is a comment: `// renderActivity() removed — target element (activity-feed) no longer exists post-redesign`. No orphaned call.
- `renderDeliverables()` is also referenced only in a comment on line 4466: `// renderDeliverables() removed — ...`. No orphaned call.
- `renderActivityList` is a different function (renders to a target element by id) and is correctly retained; it has no relation to the deleted `renderActivity`.

---

## 6. `parseRightNow` and `renderRightNow` wiring

**Status: PASS**

Wiring chain in `refresh()`:
1. `liveContent` is read from `org/LIVE.md` via `readFile(orgHandle, 'org/LIVE.md')` (line 4380).
2. `renderRightNow(liveContent)` is called on line 4445.
3. `renderRightNow` reads `right-now-body` element (line 3540), calls `parseRightNow(liveContent)` (line 3542), and renders the agents' per-file actions to that element.
4. The HTML element `<div id="right-now-body"></div>` exists at line 2099.

Complete chain: LIVE.md → `liveContent` → `renderRightNow` → `right-now-body`. Correct.

---

## 7. `scanForChanges` sets `allFilesNeedsRebuild` — race condition analysis

**Status: ACCEPTABLE — no stale data risk**

The concern: `scanForChanges` sets `allFilesNeedsRebuild = true` and then calls `refresh()`. If `refresh()` is already running (guarded by `isRefreshing`), the call returns immediately without rebuilding `allFiles`. The flag stays `true`, so the **next** `refresh()` call (from the 5-second fallback timer or a subsequent `scanForChanges`) will rebuild `allFiles` then.

**No stale data risk.** The sequence is:

1. `scanForChanges` detects change → sets `allFilesNeedsRebuild = true` → calls `refresh()`
2. If `refresh()` is running: early return (isRefreshing guard fires). Flag stays `true`.
3. Next `refresh()` invocation sees `allFilesNeedsRebuild === true` → rebuilds `cachedAllFiles` → sets flag to `false`.

The only consequence is a one-cycle delay (≤5 seconds) before `allFiles` is rebuilt. This is acceptable for a monitoring dashboard. There is no scenario where `allFiles` is permanently stale because the flag is write-once-per-change and only cleared after a successful rebuild.

**One sub-issue:** If `refresh()` fails mid-execution (error thrown, caught in the inner `catch` on line 4486), the rebuild path at lines 4435–4441 is skipped, but `allFilesNeedsRebuild` was already set to `false` inside that same block. Wait — the `allFilesNeedsRebuild = false` (line 4440) is **inside** the inner `try` block, so if an error is thrown **after** the rebuild but before `allFilesNeedsRebuild = false`, the flag would remain `true` and trigger a re-walk next cycle. That is correct behaviour. If the error is thrown **before** reaching line 4435, the flag remains `true` from `scanForChanges`. Also correct. No issue here.

---

## Summary Table

| # | Focus Area | Status | Severity |
|---|-----------|--------|----------|
| 1 | `updateAgentStatuses` signature, cutoff, sets, dot classes, call site | PASS | — |
| 2 | `isRefreshing` guard — declaration, entry, finally reset | PASS WITH NOTE | LOW |
| 3 | `allFiles` caching — declarations, flag set, rebuild guard, flag clear | PASS | — |
| 4 | `RIGHT_NOW_WINDOW_MS` vs `LIVE_WINDOW_MS` separation | PASS | — |
| 5 | `listFilesRecursive` and `renderActivity` deleted, no orphaned calls | PASS | — |
| 6 | `parseRightNow` / `renderRightNow` wired to LIVE.md → right-now-body | PASS | — |
| 7 | `scanForChanges` → `allFilesNeedsRebuild` → `refresh()` race analysis | PASS | — |

---

## Findings

### FINDING-001 (LOW) — `isRefreshing` readability risk at early return
**File:** monitor.html  
**Line:** 4366  
**Description:** `return` statement inside the outer `try` block when permission is lost. The outer `finally` (line 4498) correctly resets `isRefreshing`. Code is functionally correct but the nesting is non-obvious and a future developer editing this code could introduce a real bug if they miss the try/finally scope.  
**Recommendation:** Add an inline comment: `return; // outer finally still resets isRefreshing`  
**Do not block release on this.**

---

## No other findings. Code is production-ready.
