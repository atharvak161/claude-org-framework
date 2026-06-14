# Monitor Dashboard — Fix Summary
Date: 2026-05-31
Author: FRONTEND_DEVELOPER

## Bugs fixed

### 1. parseDecisionEntries — filter robustness
- Now accepts both `DECISION:` (with colon) and `DECISION` (without colon) in lines.
- Filters out format-example lines starting with `Format:`, `[DATE]`, or `[ROLE]`.
- The `renderDecisions` function also updated to extract the decision text correctly for both colon and no-colon formats.

### 2. parseBlockerEntries — robust header/format filtering
- Added explicit filters for lines starting with `Format:`, `[DATE]`, `[ROLE]`.
- Secondary pass removes any line still containing `[DATE]` or `[ROLE]` template tokens.
- These patterns match the actual BLOCKERS.md header format observed in the file.

### 3. parseActivityEntries — format line filtering
- Added filters for `Format:`, `[DATE]` template lines to match actual ACTIVITY.md header format.

### 4. renderNewFiles — first-load behaviour corrected
- On first load, all existing files are silently added to `knownFiles` without the "new" badge.
- Only files that appear in refreshes after the first load are marked "new".
- Added `firstLoadDone` flag to track this. On first load, shows a count of existing files found.
- This was the core bug: previously every file got the "new" badge on first load, and then genuinely new files would never appear in the list with a badge.

### 5. listFilesRecursive — O(n) traversal (was O(n²))
- Function signature changed to accept `_alreadyAtHandle` boolean flag.
- When recursing into subdirectories, the already-obtained `subHandle` is passed directly.
- Root-to-path navigation now only happens once at the top level, not on every recursive call.
- Also added filter for hidden directories (`.` prefix) in addition to `.git`.

### 6. Permission loss — Re-connect button
- `refresh()` now calls `orgHandle.queryPermission({ mode: 'read' })` at the start of each cycle.
- If permission is not 'granted', the LIVE badge switches to amber "PAUSED" and a Re-connect button appears in the header.
- `reconnectFolder()` function added: tries `requestPermission` on the existing handle first, then falls back to a fresh `connectFolder()` call.
- Re-connect button also shown on any refresh error.

### 7. Agent status dots — now dynamic
- `updateAgentStatuses(entries)` fully implemented (was a stub).
- All agent `<div class="agent-status">` elements given `id="dot-ROLE_NAME"` attributes in the HTML.
- All agent `<div class="agent-item">` elements given `data-role="ROLE_NAME"` attributes.
- Agents seen in the most recent 10 activity entries get amber "working" dot.
- Chief of Staff and Guide/Guide Explainer get green "active" dot if seen anywhere in the log.
- All dots reset to grey on every refresh before re-applying statuses.
- `INFRA_ENGINEER` dot renamed to `INFRASTRUCTURE_ENGINEER` to match the actual role name used in ACTIVITY.md.

### 8. renderDeliverables — running vs pending
- Function is now `async` and accepts `activityEntries` as a second parameter.
- If there are any entries in the recent 10 activity lines, missing files show as "running" (amber pulsing icon) rather than "pending" (grey).
- Removed incorrect early-return when `projectFiles.length === 0` (was hiding the deliverables list when no project files existed yet; now all 8 expected docs always render).

### 9. feed-body max-height increased
- Changed from `max-height: 320px` to `max-height: 520px` to show more entries.
- `feed.scrollTop = 0` added after each render so newest entries (at top) are always visible.

### 10. stat-agents replaced with stat-files
- Hardcoded "35 agents" stat replaced with live "Files found" counter that reads the actual count of files across `docs/`, `org/`, `review/` on every refresh.
- Status bar updated to "35 agents configured (static)" to be honest about the static value.

## Improvements added

### 1. File size and last-modified for deliverables
- `readFileMeta(dirHandle, path)` function added — returns `{ size, lastModified }` from the File object.
- `formatBytes(bytes)` helper added — formats as B, KB, MB.
- `relativeTime(ms)` helper added — returns "just now", "Xs ago", "Xm ago", "Xh ago", "Xd ago".
- Each completed deliverable row now shows its size and relative last-modified time.
- Metadata is cached in `deliverableFileMeta` to avoid re-reading on every 5-second refresh.

### 2. Relative "last refreshed" timer
- Header now shows "Last refreshed Xs ago" updating every second.
- Replaced the countdown timer entirely (it was counting down 5→0 and triggering refresh, now `setInterval(5000)` handles the refresh directly — cleaner and no drift).
- `lastRefreshTime` variable set on each successful refresh.

### 3. Connection status indicator
- Status bar item "Not connected" turns to "Connected: [folder name]" (green dot) when connected.
- `org-path-display` banner updated to show "Connected to: [name] — auto-refreshing every 5s".

### 4. Decisions parser — colon optional
- `parseDecisionEntries` and `renderDecisions` both updated to match `DECISION` with or without trailing colon, using a case-insensitive regex.

### 5. Re-connect button
- Hidden amber button in header; shown when `queryPermission` returns non-granted or on refresh error.

### 6. renderNewFiles path display
- Replaced emoji path prefixes with clean text prefixes: `[project]`, `[docs]`, `[org]`, `[review]`.
- Avoids potential font-rendering issues with emoji in the monospace feed.

### 7. Live badge recovery
- After an ERROR or PAUSED state, the next successful refresh resets the badge back to green LIVE.

### 8. Agent dot IDs
- Every agent item in the HTML has `id="dot-ROLE_NAME"` on its status dot, enabling JS to find and update it by role name from ACTIVITY.md.
