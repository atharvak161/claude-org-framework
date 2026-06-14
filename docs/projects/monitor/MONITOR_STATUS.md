# Monitor Status Report
Date: 2026-06-06
Author: FRONTEND_DEVELOPER
Scope: Verification and fix of monitor.html following Chief of Staff changes

## What was verified as working

### 1. Full directory watcher
- `walkEntireDir` starts from the organisation root (`orgHandle, '', 0`) with depth limit 8
- Walks ALL subdirectories, skipping only known noise dirs (`node_modules`, `.git`, `dist`, etc.)
- This means `org/`, `docs/`, `src/`, `review/`, `knowledge/`, `agents/`, `ci/`, `infra/`, `tests/` are all watched
- `scanForChanges` is called every 1000ms via `setInterval(scanForChanges, 1000)`
- The scan is metadata-only (lastModified timestamps) — no file content is read during the watch cycle
- Any created, modified, or deleted file triggers an immediate `refresh()` call
- VERIFIED CORRECT

### 2. Live feed — 20 minutes, HH:MM:SS required, date-only to History
- `LIVE_WINDOW_MS = 20 * 60 * 1000` (20 minutes)
- `parseActivityLive` regex: `/^\s*\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/` — requires at minimum HH:MM (accepts HH:MM:SS)
- `entryTimestampFull` parses `YYYY-MM-DD HH:MM:SS` accurately to milliseconds
- `parseActivityHistory` returns lines without time OR lines older than 20 minutes
- Date-only entries (e.g. `2026-06-01 AGENT — action`) match no time, `hasTime = false`, go directly to History
- VERIFIED CORRECT

### 3. Refresh button when disconnected
- Button HTML: `onclick="if(orgHandle){refresh();}else{connectFolder();}"`
- When `orgHandle` is null (not connected), clicking Refresh calls `connectFolder()`
- When connected, clicking Refresh calls `refresh()`
- Re-connect button (`#reconnect-btn`) handles re-requesting permission on an existing handle
- VERIFIED CORRECT

### 4. QA_DIRECTOR in roleToName and agentColor
- `agentColor`: `QA_DIRECTOR` included in `['FULL_STACK_TESTER', ..., 'QA_DIRECTOR', 'DIRECTOR_QA']` → `var(--green)`
- `roleToName`: `QA_DIRECTOR: 'QA Director'` and `DIRECTOR_QA: 'Director QA'` both present
- VERIFIED CORRECT

### 5. Path regex includes src/ paths
- All three path-matching regexes in the file use `(?:docs|org|src|review)\/`
- This covers `renderActivityList`, `renderActivity`, and `renderLiveNow`
- File viewer opens correctly for `src/` paths
- VERIFIED CORRECT

## What was fixed

### 1. Stale label — stat card "Actions (1h)" → "Actions (20m)"
- The live window is 20 minutes (`LIVE_WINDOW_MS = 20 * 60 * 1000`)
- The stat card label read "Actions (1h)" which was incorrect
- Fixed to "Actions (20m)" to match actual behaviour

### 2. Stale UI label — "Live now · active in last hour" → "Live now · active in last 20 minutes"
- Feed tab section header described a 1-hour window but the code uses 20 minutes
- Fixed to "Live now · active in last 20 minutes"

### 3. Stale code comments — "last 15 min" / "last 1h" references
- `parseActivityLive` function comment said "last 15 minutes" (stale from earlier design)
- Code comment in `refresh()` said "last 1h" in two places
- All updated to accurately say "last 20 minutes" / "last 20m"

### 4. allFiles — added src/ and knowledge/ directory scans
- `allFiles` previously only collected from `docs/`, `org/`, and `review/`
- Per the watcher specification, the system monitors `org, docs, src, review, knowledge`
- Added `listFilesRecursive(orgHandle, 'src', [])` and `listFilesRecursive(orgHandle, 'knowledge', [])`
- This ensures `buildPendingDocs` correctly detects when activity-log-mentioned `src/` files exist on disk
- Parallel Promise.all pattern maintained (3 → 5 concurrent scans)

## Current state of the monitor

The monitor is fully operational with the following confirmed capabilities:

| Feature | Status |
|---------|--------|
| Full directory watcher (all dirs, 1s interval) | Working |
| Live feed — 20 min window, HH:MM:SS required | Working |
| Date-only entries routed to History | Working |
| Refresh button calls connectFolder when disconnected | Working |
| QA_DIRECTOR in roleToName | Working |
| QA_DIRECTOR in agentColor | Working |
| Path regex matches src/ paths | Working |
| allFiles includes src/ and knowledge/ | Fixed + Working |
| Stat card label matches 20m live window | Fixed + Working |
| UI section label matches 20m live window | Fixed + Working |

No regressions introduced. All changes are additive label/comment corrections and one directory expansion.
