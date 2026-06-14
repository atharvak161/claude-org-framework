# Full Stack Test Report — monitor.html
## Date: 2026-06-06
## Tester: Full Stack Tester

---

## Results

| Check | Status | Line | Notes |
|---|---|---|---|
| **FEED TAB** | | | |
| RIGHT NOW panel exists with id `right-now-body` | PASS | 2099 | `<div id="right-now-body"></div>` present in Feed tab |
| RIGHT NOW reads org/LIVE.md | PASS | 4434 | `readFile(orgHandle, 'org/LIVE.md')` in refresh(), passed to `renderRightNow(liveContent)` at 4480 |
| Live cards grid id `live-now-grid` exists | PASS | 2105 | `<div class="live-now-grid" id="live-now-grid">` present |
| Live feed driven by HH:MM:SS timestamp within 20 min | PASS | 3079 | regex `/^\s*\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/` filters to timed entries; LIVE_WINDOW_MS cutoff applied |
| Date-only entries go to History, never Feed | PASS | 3079–3082 | `hasTime` guard: if no HH:MM, `return false` from live parse; date-only entries pass `true` in history parse (line 3098) |
| Empty state message says "20 minutes" not "1 hour" or "15 minutes" | PASS | 3635 | `'No activity in the last 20 minutes — all agents idle.'` |
| **FILE WATCHER** | | | |
| `walkEntireDir` exists and is used by `scanForChanges` | PASS | 2842, 2866 | Function defined at 2842; called at 2866 inside `scanForChanges` |
| `scanForChanges` interval is 1000ms (1 second) | PASS | 2892 | `setInterval(scanForChanges, 1000)` |
| SKIP_DIR_NAMES includes: node_modules, .git, dist, .cache, .pnpm, build, coverage | PASS | 2832–2836 | All 7 required names present. Also includes: out, .turbo, __pycache__, .venv, .next, .nuxt, tmp, .tsbuildinfo |
| `allFiles` built from `walkEntireDir` from root (NOT 5 hardcoded dirs) | PASS | 4474–4476 | `for await (const { path } of walkEntireDir(orgHandle, '', 0))` — root walk, not hardcoded dirs |
| **REFRESH BUTTON** | | | |
| `onclick` calls `connectFolder()` when orgHandle is null | PASS | 1863 | `onclick="if(orgHandle){refresh();}else{connectFolder();}"` |
| `onclick` calls `refresh()` when connected | PASS | 1863 | Same expression; `refresh()` branch when `orgHandle` truthy |
| **HISTORY TAB** | | | |
| Shows entries older than 20 min | PASS | 3092–3101 | `parseActivityHistory` filters: timed entries with ts < cutoff (LIVE_WINDOW_MS = 20 min); date-only always included |
| Section label says "older than 20 minutes" | PASS | 2214 | `Activity history · older than 20 minutes` in section-label |
| Stale HTML comment "older than 1h" present | BUG (minor) | 2212 | HTML comment reads `<!-- Full activity log (older than 1h) -->` — stale, contradicts label; also stale code comment at 4449: `// older than 1h, newest-first` |
| Search/filter works on history entries | PASS | 3832–3836 | `filterHistory()` queries `#history-activity-feed .history-entry` elements; `oninput` wired at 2209 |
| **AGENT NAMES AND COLOURS** | | | |
| `QA_DIRECTOR` → "QA Director" in roleToName | PASS | 3924 | `QA_DIRECTOR: 'QA Director'` |
| `QA_DIRECTOR` → green colour in agentColor | PASS | 3170 | `QA_DIRECTOR` in green array |
| `CHIEF_OF_STAFF` → amber colour | PASS | 3167 | `CHIEF_OF_STAFF` in amber array |
| `FRONTEND_DEVELOPER` → blue colour | PASS | 3169 | `FRONTEND_DEVELOPER` in blue array |
| **PATH MATCHING (View files →)** | | | |
| Regex includes `src/` paths | PASS | 3266, 3312, 3675 | All three path regex sites: `(?:docs\|org\|src\|review)\/` — `src/` included |
| Regex allows paths without file extension | PASS | 3266, 3312, 3675 | Pattern ends `(?:\.[a-zA-Z0-9]+)?` — extension is optional |
| Applies to all 3 regex sites (renderActivityList, renderActivity, renderLiveNow) | PASS | 3266, 3312, 3675 | renderActivityList (3266), renderActivity (3312), renderLiveNow (3675) — all three sites use identical regex |
| 4th site in openAgentDetail also consistent | PASS | 4339 | Same regex also at 4339 in openAgentDetail; all 4 sites consistent |
| **TIMESTAMPS** | | | |
| `entryTimestampFull` parses HH:MM:SS (seconds) | PASS | 3041–3046 | Regex group 6 captures `(?::(\d{2}))?` — seconds captured into `ss`; `new Date(...ss)` used |
| Display regex captures seconds `(?::\d{2})?` | PASS | 3262 | `renderActivityList` display match: `/\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}(?::\d{2})?)?/` — seconds optional group present |
| Display regex in renderActivity does NOT capture seconds | BUG (low) | 3307 | `renderActivity` dateMatch: `/\d{4}-\d{2}-\d{2}/` — date only, no HH:MM:SS captured for display. Note: `renderActivity` is a dead-code function (its target element no longer exists per comment at 4455), but the regex is inconsistent with renderActivityList |
| `LIVE_WINDOW_MS = 20 * 60 * 1000` | PASS | 3073 | `const LIVE_WINDOW_MS = 20 * 60 * 1000;` |
| **ORG/LIVE.MD READING** | | | |
| `refresh()` reads org/LIVE.md | PASS | 4428–4434 | In the `Promise.all` array; `liveContent` bound to result |
| `parseRightNow()` function exists | PASS | 3564 | Defined at line 3564 |
| `renderRightNow()` function exists | PASS | 3595 | Defined at line 3595 |

---

## Bugs found

### BUG-001 — Stale comments: "older than 1h" should read "older than 20 minutes"
- **Severity:** Low (cosmetic — no functional impact)
- **Lines:** 2212 (HTML comment), 4449 (JS code comment)
- **Detail:** The HTML comment at line 2212 reads `<!-- Full activity log (older than 1h) -->` and the JS comment at line 4449 reads `// older than 1h, newest-first`. Both are stale — the actual cutoff is LIVE_WINDOW_MS = 20 minutes. The user-visible section label at line 2214 correctly says "older than 20 minutes", so there is no end-user impact. Misleading for developers maintaining the codebase.
- **Fix:** Update both comments to "older than 20 minutes".

### BUG-002 — `renderActivity` display regex does not capture seconds
- **Severity:** Low (function is dead code — its target element no longer exists)
- **Line:** 3307
- **Detail:** `renderActivity()` uses `dateMatch = (parts[0] || '').match(/\d{4}-\d{2}-\d{2}/)` — captures date only. `renderActivityList()` (the live equivalent) at line 3262 correctly captures HH:MM:SS. `renderActivity` is dead code (the `activity-feed` target element was removed in the live/history redesign, confirmed by comment at 4455). No user impact, but inconsistency could confuse future maintainers if the function is ever revived.
- **Fix:** Either delete `renderActivity()` entirely (it is unreachable) or update its dateMatch regex to `/\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}(?::\d{2})?)?/` for consistency.

---

## Summary of passing areas
- All Feed tab structural elements present and correctly wired (id: `right-now-body`, `live-now-grid`)
- org/LIVE.md read path complete and end-to-end: `readFile` → `parseRightNow` → `renderRightNow`
- File watcher: `walkEntireDir` used from root, 1000ms interval, all 7 required SKIP_DIR_NAMES present
- Refresh button logic correct for both connected and disconnected states
- History tab: correct cutoff (20 min), section label correct, search/filter wired
- All agent colour mappings correct: QA_DIRECTOR=green, CHIEF_OF_STAFF=amber, FRONTEND_DEVELOPER=blue
- Path regex includes `src/`, allows extensionless paths, applied consistently at all 3 required sites (plus a 4th site in openAgentDetail)
- `entryTimestampFull` correctly parses HH:MM:SS with second-level precision
- Display timestamp in `renderActivityList` correctly captures seconds
- LIVE_WINDOW_MS = 20 * 60 * 1000 (correct)

---

## Overall verdict: PASS

**Rationale:** All functional requirements are met. Two bugs were found — both are low severity and have no user-facing impact. BUG-001 is stale developer comments. BUG-002 is in a dead-code function that cannot be reached at runtime. The monitor.html is functionally correct as audited.
