# QA Report — monitor.html Static Code Analysis
**Auditor:** Full Stack Tester  
**Date:** 2026-06-01  
**File:** /Users/atharva/Downloads/organisation/monitor.html (~4639 lines)  
**Method:** Full static code analysis — every function traced by hand  

---

## Executive Summary

The dashboard is fundamentally sound. The architecture is clean, the rendering pipeline is correct, and the refresh cycle is well-implemented. Four genuine bugs were found, three of which are medium severity. Twelve warnings were raised for edge cases or minor inconsistencies that will not crash the dashboard but could confuse users under specific conditions.

| Tab | Rating | Primary risk |
|-----|--------|-------------|
| Feed (Live Now) | 8/10 | `buildPendingDocs` path comparison is fragile |
| Org Chart | 8/10 | `ocFindDirector` heuristic may pick wrong agent in flat registries |
| Agents | 9/10 | `stColor` map is missing `ready` → no dot colour for Ready state |
| History | 9/10 | `parseActivityHistory` comment says "older than 1h" but logic is "not today" |
| Workflows | 10/10 | Fully static; no logic bugs |

---

## TAB 1: Feed (Live Now) — Rating: 8/10

### 1.1 `parseActivityLive()` — PASS

**Trace:**  
Lines 3049-3064. The function calls `activityLines(content)` (the shared cleaner at line 3031) to strip blanks, `#` headers, `Format:` lines, and `[DATE]` template examples. It then applies a two-branch filter:

- If the entry has an explicit time component (`YYYY-MM-DD HH:MM`), it calls `entryTimestampFull()` and requires `ts >= cutoff` (now minus 1 hour).
- If the entry is date-only (the standard log format), it extracts the leading `YYYY-MM-DD` and includes the entry only if it equals `todayStr` (today in local time via `new Date().toISOString().slice(0,10)`).

The `.reverse()` at line 3063 makes the result newest-first. This logic is correct and handles both log formats.

**WARNING:** `toISOString()` returns UTC. If the user is running the dashboard after midnight UTC but before midnight in their local timezone, `todayStr` will be "tomorrow" from the filesystem's perspective, and entries from the current local day (yesterday UTC) will be excluded from the live feed. This is an edge case that affects only users in UTC+0 or later timezones working very late at night.

---

### 1.2 `renderLiveNow()` — PASS

**Trace:**  
Lines 3549-3613. Empty state: if `allEntries1h.length === 0`, renders a `.live-empty-card` — correct. For non-empty: groups by role using a `byRole` map and an `order` array that preserves first-seen order (which, since input is newest-first, gives most-recently-active first). Each role gets one card with the correct status dot (`working` for top-5 roles, `recent` otherwise). XSS is escaped with `escHtml`. The `roleToName()` call provides a human-readable name.

**WARNING:** `extractRole()` is called on `line.split('—')[0]` — this splits on the em dash character `—` (U+2014). If an ACTIVITY.md entry uses a regular hyphen `-` as the separator instead (which would be a format inconsistency), no role will be extracted, the entry will be silently dropped from grouping, and the `role` will be `null`. The result is that the agent appears nowhere on the live feed. This is a data quality dependency, not a code bug.

---

### 1.3 `renderInProgress()` + `buildPendingDocs()` — FAIL (medium)

**`renderInProgress()` trace (lines 3617-3648):**  
The function calls `buildPendingDocs(allFiles, lastAllActivityEntries)` (note: it uses the module-level `lastAllActivityEntries`, NOT the `activityEntries` parameter it receives — this is intentional and correct, as you want all-time mentions, not just 48h).

**`buildPendingDocs()` trace (lines 3430-3433):**  
```javascript
function buildPendingDocs(allFiles, allActivityEntries) {
    const mentioned = extractActivityFilePaths(allActivityEntries);
    return mentioned.filter(p => !allFiles.some(f => f === p || f.endsWith('/' + p.split('/').pop())));
}
```

**Bug:** `extractActivityFilePaths` (lines 3413-3425) extracts paths from the THIRD segment of a `—`-split line (i.e., `parts[2]`). The standard ACTIVITY.md format is:
```
DATE ROLE — ACTION — file/path — reason
```
After splitting on `—`, parts[0] is "DATE ROLE", parts[1] is "ACTION", parts[2] is "file/path". This is correct. However, the candidate check at line 3419 requires:
- `candidate.includes('/')` — correct
- `/\.\w+$/.test(candidate)` — correct for files with extensions
- `!candidate.includes(' ')` — **this will silently discard paths if there is any trailing whitespace**. Since `.split('—').map(p => p.trim())` trims the result, this should be safe — but if an agent writes a path with embedded spaces (rare but possible), it drops silently with no warning.

**Bigger bug (line 3432):**  
```javascript
return mentioned.filter(p => !allFiles.some(f => f === p || f.endsWith('/' + p.split('/').pop())));
```
The "file exists on disk" check uses `f.endsWith('/' + p.split('/').pop())`. This extracts only the filename (last path component). If an agent creates `docs/projects/alpha/REPORT.md` and a completely different file `docs/projects/beta/REPORT.md` also exists, the beta file's existence will satisfy the check and alpha will be incorrectly marked as "done" rather than pending. This is a false-negative: a file the agent promised will not appear in the pending list even though it was never created.

**Fix:** Change to `f === p` only, or implement a more precise suffix match:
```javascript
return mentioned.filter(p => !allFiles.some(f => f === p || f === p.replace(/^\//, '') || f.endsWith(p)));
```

---

### 1.4 `renderFeedBlockers()` — PASS

**Trace (lines 3651-3666):**  
Gets `feed-blockers-section` element. If `real.length === 0`, sets `section.style.display = 'none'` — correctly hides the entire section. If blockers exist, sets `display = ''` (inherited/default, which is `block` from CSS). Badge and body are populated. No issues.

---

### 1.5 `renderFeedStatus()` — PASS (with minor note)

**Trace (lines 3669-3681):**  
```javascript
const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('#')).slice(-3);
```
Correctly shows the last 3 non-blank, non-header lines of STATUS.md. The `lastModified` timestamp is passed from `readFileMeta` and displayed as a relative time. This is correct.

**WARNING:** If STATUS.md contains only header lines (`#`), all lines will be filtered and the display will show "No status updates yet" even though the file is not empty. This could confuse users but is benign.

---

## TAB 2: Org Chart — Rating: 8/10

### 2.1 `renderOrgChart()` + `buildClusterHTML()` — PASS

**Trace (lines 4104-4122):**  
`renderOrgChart()` groups `agentRegistry` by `a.dept`, skipping agents whose `dept.toLowerCase() === 'executive'` (those are hoisted to the top row). It calls `buildClusterHTML(depts)`.

**`buildClusterHTML()` (lines 4052-4102):**  
- Sorts departments per `OC_DEPT_ORDER` array, appending unknowns alphabetically.
- For each dept, calls `resolveColor(deptColor(dept))` to convert CSS vars to concrete hex for `color-mix()`.
- Calls `ocFindDirector(members)` for the director node.
- Renders director as `.oc-cluster-director` and remaining agents as `.oc-agent-node`.
- Wraps everything in the correct `.oc-container`, `.oc-top-row`, `.oc-exec-row`, `.oc-dept-grid` HTML structure that matches the CSS.

The function exists and is correctly wired. No missing tags or broken structure found.

---

### 2.2 `ocFindDirector()` — PASS (with warning)

**Trace (lines 4047-4050):**  
```javascript
function ocFindDirector(members) {
    return members.find(a => /chief of staff|atharva/i.test(a.reportsTo || ''))
        || members[0];
}
```

**Logic:** Finds the agent whose `reportsTo` field contains "Chief of Staff" or "Atharva" — this identifies the department director since they report up to the executive layer. Falls back to `members[0]` if no match.

**WARNING:** If all department members report to someone other than Chief of Staff or Atharva (e.g., they all report to "VP Engineering" and the VP Engineering entry is in a separate row), `ocFindDirector` will silently fall back to `members[0]` — the first agent in the registry table, which may not be the director. The sidebar roster HTML has departments like "Engineering" that contain "DEV_TEAM_LEAD" as an agent but the actual director might be "VP Engineering" (who may be in a different registry row). The fallback `members[0]` makes this degraded rather than broken.

---

### 2.3 Agent status dots in org chart — PASS

**Trace:**  
`ocAgentRow()` (line 4037) calls `agentStatusFor(a.name)` and applies the result as a CSS class on `.oc-agent-dot`. `buildClusterHTML()` does the same for the director node (line 4068). `agentStatusFor()` returns `'working'`, `'recent'`, `'ready'`, or `'idle'`. CSS classes `.oc-agent-dot.working`, `.oc-agent-dot.recent`, `.oc-agent-dot.ready`, `.oc-agent-dot.idle` are all defined at lines 1379-1382. The wiring is complete.

---

### 2.4 Clicking nodes calls `openAgentDetail()` — PASS

**Trace:**  
- `.oc-agent-node` elements: `onclick="openAgentDetail('${escAttr(a.name)}')"` — line 4039
- Director nodes: `onclick="openAgentDetail('${escAttr(director.name)}')"` — line 4070
- Chief of Staff: `onclick="openAgentDetail('Chief of Staff')"` — line 4090
- Guide: `onclick="openAgentDetail('Guide and Explainer')"` — line 4094

All nodes correctly call `openAgentDetail()`. The `escAttr()` helper (line 4033) HTML-escapes and also escapes single quotes, preventing attribute injection. Correct.

---

### 2.5 Zoom buttons — PASS

**Trace (lines 4124-4129):**  
```javascript
function orgZoom(delta) {
    if (delta === 0) orgZoomLevel = 1;
    else orgZoomLevel = Math.min(2.5, Math.max(0.3, orgZoomLevel + delta));
    const c = document.getElementById('oc-container');
    if (c) c.style.transform = `scale(${orgZoomLevel})`;
}
```

HTML buttons at lines 2200-2203 call `orgZoom(-0.15)`, `orgZoom(0)`, `orgZoom(0.15)`. The function clamps between 0.3 and 2.5, resets on 0. Targets `oc-container` (which is rendered inside `oc-canvas-wrap` by `buildClusterHTML()`). The guard `if (c)` prevents errors when org chart hasn't been rendered yet (before folder connection). Correct.

---

## TAB 3: Agents — Rating: 9/10

### 3.1 `updateAgentTable()` — PASS

**Trace (lines 4132-4174):**  
Iterates `agentRegistry` (populated by `parseAgentRegistry` from AGENT_REGISTRY.md). For each agent, calls `agentStatusFor(a.name)`, `agentActivityStats[a.name]`, `deptColor(a.dept)`. Produces a `<tr>` with all 6 columns. Empty state shows "No agents found" when registry is empty. The summary section counts active, ready, and worked counts. No issues.

---

### 3.2 `statusLabel` map includes `ready` — PASS

**Line 4141:**  
```javascript
const statusLabel = { working: 'Working', recent: 'Active', ready: 'Ready', idle: 'Unknown' };
```
All four statuses are present including `'ready'`. The CSS class `.at-status.ready` is defined at line 1475. Correct.

---

### 3.3 `agentStatusFor()` returns `'ready'` for registered agents with no activity — PASS

**Trace (lines 4012-4021):**  
```javascript
function agentStatusFor(name) {
    const s = agentActivityStats[name];
    if (!s) {
        const inReg = agentRegistry.find(a => a.name === name);
        return (inReg && inReg.status !== 'Inactive') ? 'ready' : 'idle';
    }
    return s.status || 'ready';
}
```
If the agent has no entry in `agentActivityStats` (never logged), it checks the registry. If the agent exists and is not 'Inactive', it returns `'ready'`. This correctly distinguishes "configured but not yet assigned" from "completely unknown". The fallback `s.status || 'ready'` on line 4020 is a safety net in case `computeAgentActivity` leaves `status` undefined (which it shouldn't, but defensive coding).

---

### 3.4 `openAgentDetail()` — PASS (with warning)

**Trace (lines 4194-4256):**  
- Finds the agent in `agentRegistry`. If not found, returns early (safe).
- Reuses the viewer drawer/overlay — sets `currentViewPath = null` to prevent auto-refresh from re-reading a file while agent detail is displayed.
- Builds reporting chain via `reportingChain()` (lines 4177-4192), which walks `reportsTo` up to Atharva with a guard against infinite loops (20 iterations max).
- Filters `lastActivityRaw` for lines where `roleToName(extractRole(...)) === name`.
- Shows files created (lines containing `CREATED` with a path).

**WARNING:** The status dot colour at line 4205:
```javascript
const stColor = { working: 'var(--amber)', recent: 'var(--green)', idle: 'var(--text3)' }[st];
```
The `'ready'` status is absent from this map. When `st === 'ready'`, `stColor` will be `undefined`. Line 4207 then renders:
```html
<span style="background:undefined;...">
```
The dot will have no background colour and appear invisible. This is a visual bug for the most common state (agents that are configured but not yet active).

**Fix (line 4205):**
```javascript
const stColor = { working: 'var(--amber)', recent: 'var(--green)', ready: 'var(--teal)', idle: 'var(--text3)' }[st];
```

---

### 3.5 Idle-agents summary section — PASS (with note)

**Trace (lines 4159-4173):**  
- `activeCount` = agents with `count48h > 0` (active in last 48h)
- `idleAgents` = agents where `!agentActivityStats[a.name]?.everLogged` (never logged anything)
- `readyCount` = `idleAgents.length`
- `workedCount` = total minus readyCount

The labels are semantically correct: "ready" means "never been assigned a task" (not "idle since last task"), and "have logged activity" means "have ever worked". The naming is intentional and accurate.

---

## TAB 4: History — Rating: 9/10

### 4.1 `parseActivityHistory()` — PASS (with warning)

**Trace (lines 3072-3088):**  
For time-stamped entries: excludes those where `ts < cutoff` (older than 1 hour) — wait, the logic is:
```javascript
if (hasTime) {
    const ts = entryTimestampFull(line);
    return ts === null ? true : ts < cutoff;
}
```
This keeps entries where `ts < cutoff` (i.e., older than 1 hour). For date-only entries: keeps those where `dateMatch[1] !== todayStr` (not today).

**WARNING:** There is a deliberate asymmetry between the two branches:
- Time-stamped entries: cutoff is 1 hour ago
- Date-only entries: cutoff is "not today" (potentially up to 23h 59m ago)

This means a date-only entry from this morning (e.g., `2026-06-01 CHIEF_OF_STAFF — ...`) will appear in History, not in Live Now, even though it may be more recent than the 1-hour window. This is by design (as documented in the code comment), but the section label in the HTML at line 2251 says "Activity history · older than 1 hour", which is only accurate for time-stamped entries. Users may see today's date-only entries in History which looks inconsistent. This is a UX labelling issue, not a code bug.

---

### 4.2 `parseActivityAll()` — PASS

**Trace (lines 3067-3069):**  
```javascript
function parseActivityAll(content) {
    return activityLines(content).reverse();
}
```
Calls the shared `activityLines()` cleaner (strips blanks, headers, format examples) and reverses for newest-first. No date filter is applied. This correctly returns all entries for use as `lastAllActivityEntries` (pending doc detection) and the History tab "All decisions" rendering. Correct.

---

### 4.3 `renderHistoryDeliverables()` — PASS

**Trace (lines 3685-3716):**  
```javascript
const completed = allFiles
    .filter(f => f.includes('docs/') && f.endsWith('.md'))
    .map(f => ({ doc: f.split('/').pop(), path: f }))
    .sort((a, b) => a.doc.localeCompare(b.doc));
```
This dynamically scans all `.md` files under `docs/` — no hardcoded filenames. `allFiles` is built by `listFilesRecursive` which recursively traverses the entire `docs/` tree. The sort is alphabetical by filename. Metadata (size, last modified) is fetched and cached in `deliverableFileMeta`. Each file is clickable and opens the viewer. Fully dynamic — no hardcoding.

---

### 4.4 Search / filter function — PASS

**Trace (lines 3749-3754):**  
```javascript
function filterHistory(query) {
    const q = (query || '').toLowerCase();
    document.querySelectorAll('#history-activity-feed .history-entry').forEach(el => {
        el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
}
```
The input has `oninput="filterHistory(this.value)"` at line 2246. The selector `#history-activity-feed .history-entry` targets elements with the class `history-entry`, which is applied by `renderActivityList()` at line 3264 (`class="feed-entry history-entry"`). The empty-string query (`q === ''`) correctly shows everything since every string includes `''`. Correct.

**WARNING:** The filter only operates on entries already rendered at the time the user types. If the user types a query, then the data refreshes (every 5 seconds), `renderActivityList` will re-render all rows visible (ignoring current filter), and the filter is only re-applied if `hs.value` is truthy at line 4380. This re-application at line 4380 (`if (hs && hs.value) filterHistory(hs.value)`) IS present and correct — the filter will be reapplied after each refresh. Pass.

---

### 4.5 `renderHistoryDecisions()` — PASS

**Trace (lines 3720-3746):**  
Reads from `history-decisions-body` element (line 2285). Called with `parseDecisionAll(decContent)` which returns all DECISION lines without slicing. The decision extraction logic handles both `DECISION:` and `DECISION ` (no colon) formats. Text is truncated at 400 chars for the history view (vs 160 chars in the sidebar). Correct.

---

## TAB 5: Workflows — Rating: 10/10

### 5.1 SVG flowchart — PASS

Full SVG trace (lines 2302-2527):
- All `<defs>` markers are properly closed.
- `<marker>` elements: `wf-arrow`, `wf-arrow-accent`, `wf-arrow-amber`, `wf-arrow-teal` — all properly closed with `</marker>`.
- `<linearGradient>` elements: `grad-amber`, `grad-accent`, `grad-green` — all properly closed.
- `<pattern id="wf-grid">` — properly closed.
- All `<rect>`, `<line>`, `<text>`, `<path>` elements are self-closing or properly closed.
- The `</svg>` tag is present at line 2527.
- `&amp;` is used correctly for `&` in text content (e.g., "Guide &amp; Explainer" at line 2488).

**One note:** Line 2456 uses `marker-end="url(#wf-arrow-green)"` but `wf-arrow-green` is NOT defined in the `<defs>` block (lines 2303-2328). Only `wf-arrow`, `wf-arrow-accent`, `wf-arrow-amber`, and `wf-arrow-teal` are defined. The arrow at line 2456 (`600,618 → 600,654`) will have no arrowhead. The line will still render, just without the expected arrow tip. This is a minor visual defect, not a crash.

**Fix:** Add to the `<defs>` block:
```xml
<marker id="wf-arrow-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
  <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e"/>
</marker>
```

---

### 5.2 Communication matrix table — PASS

**Trace (lines 2540-2677):**  
The table has 4 columns: From, To, Dir, What they exchange. The header says "21 channels mapped" (line 2537). Counting the `<tr>` rows in `<tbody>`: 21 rows are present (lines 2550-2675). The count is accurate. All `<td>` cells are closed. All `<tr>` elements are closed. Table structure is valid.

---

### 5.3 Decision protocol card — PASS

**Trace (lines 2683-2719):**  
The `.wf-protocol-card` contains a `.wf-protocol-title`, an `<ol class="wf-protocol-steps">` with 6 `<li>` elements, and a `.wf-protocol-note`. All tags are properly opened and closed. The `<code>` tag inside step 5 (line 2708) uses correct inline CSS. No issues.

---

## Global Issues

### G.1 `refresh()` auto-call every 5 seconds — PASS

**Trace (lines 2860-2862):**  
```javascript
setInterval(() => {
    if (orgHandle) refresh();
}, 5000);
```
Correctly guarded by `if (orgHandle)` — no refresh before folder connection. `refresh()` is a proper `async` function (line 4297). The setInterval call is at the top level (module scope), executes immediately at page load. Correct.

**Countdown:** The "last refreshed X ago" counter runs every 1 second (lines 2865-2870) and displays `secs + 's'`. This is accurate enough for a 5-second cycle. Pass.

---

### G.2 `connectFolder()` — PASS

**Trace (lines 2874-2894):**  
- Calls `window.showDirectoryPicker({ mode: 'read' })`.
- Resets `firstLoadDone = false` and clears `knownFiles`.
- Hides `connect-section`, `setup-banner`.
- Shows `org-path-display` with the folder name.
- Updates status bar connection dot to green.
- Calls `await refresh()` immediately.
- Handles `AbortError` silently (user cancelled the picker), other errors via `alert()`.

All state is correctly initialised. Correct.

---

### G.3 `viewFile()` — PASS

**Trace (lines 4555-4607):**  
- Guards against `!relativePath`.
- Shows loading state only on fresh opens (not background refreshes).
- Reads content and metadata in parallel via `Promise.all`.
- Handles `content === null` (file deleted/missing) with an error message.
- Renders markdown via `renderMarkdown()`.
- Preserves scroll position on background refresh using `prevScroll`.
- Handles exceptions with a visible error message.

`currentViewPath` is set to `null` when the agent detail drawer is opened (line 4199), preventing the auto-refresh from trying to re-read a file when the drawer is showing agent detail. This is correct.

---

### G.4 `roleToName()` — PASS (with warning)

**Coverage check (lines 3804-3935):**  
The `special` map covers:
- Executive: 2 roles
- HR: 4 roles
- PM: 4 roles (+ aliases)
- Engineering: 10 roles (+ aliases)
- Security: 5 roles
- QA: 4 roles
- DevOps: 6 roles (+ alias)
- Product: 4 roles
- Marketing: 6 roles
- Sales: 5 roles
- Finance: 10 roles (multiple specific names)
- Legal: 3 roles
- Data: 4 roles
- Design: 3 roles
- Support: 3 roles
- Research: 3 roles
- Operations: 3 roles
- PR: 3 roles
- Strategy: 3 roles
- Career: 5 roles

Total named entries: approximately 91 explicit mappings. A fuzzy fallback (line 3928-3931) catches any not in the map by normalising and matching against the live `agentRegistry`. A final title-case fallback exists for completely unknown roles.

**WARNING:** The fuzzy fallback normalises by stripping all non-alphanumeric characters (`norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '')`). This means `CHIEF_OF_STAFF` becomes `chiefofstaff` and `Chief of Staff` also becomes `chiefofstaff` — they match. However, two agents with very similar names that differ only in punctuation (e.g., "Co-Founder" vs "Cofounder") would produce the same normalised key, causing the wrong agent to match. This is low-risk but worth noting.

---

### G.5 `deptColor()` — PASS

**Coverage check (lines 3938-3961):**  
The function covers 20 named departments:
executive/owner, hr, pm/project, engineering, security, qa, devops, product, marketing, sales, finance, legal, data, design, support, research, operations, pr, strategy, career.

Falls back to `'var(--text2)'` for unknown departments. The comment at line 3937 says "covers all 21 departments." Counting the named branches: 20 (if you count `pm || includes('project')` as one). The 21st is the fallback. This is accurate if you count the fallback as the 21st case.

No departments in `OC_DEPT_ORDER` (line 4027-4031) are missing from `deptColor()`. Pass.

---

### G.6 JavaScript syntax — PASS

No unclosed brackets, missing semicolons in critical paths, or obvious syntax errors detected. The file opens at line 2839 with `<script>` and closes at line 4636 with `</script>`. All function definitions are complete. All `async` functions have matching `await` calls. All `try/catch` blocks are properly paired.

---

### G.7 `lastAllActivityEntries` population — PASS

**Trace (line 4338):**  
```javascript
lastAllActivityEntries = parseActivityAll(actContent);
```
This is set during every `refresh()` call before `renderInProgress()` is called at line 4369. `renderInProgress()` uses `lastAllActivityEntries` (the module-level variable) rather than the parameter. This is intentional — the in-progress panel should reflect ALL-TIME mentioned files, not just the last 48h. The module-level variable is correctly populated before use. Correct.

---

### G.8 `entryTimestampFull()` — PASS

**Trace (lines 3020-3028):**  
```javascript
function entryTimestampFull(line) {
    const m = (line || '').match(/^\s*(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/);
    if (!m) return null;
    const hh = m[4] !== undefined ? Number(m[4]) : 0;
    const mm = m[5] !== undefined ? Number(m[5]) : 0;
    const ss = m[6] !== undefined ? Number(m[6]) : 0;
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), hh, mm, ss);
    return d.getTime();
}
```

The regex handles:
- Date only: `2026-06-01` → hh=0, mm=0, ss=0 (start of day in local time)
- Date + time: `2026-06-01 14:30` → hh=14, mm=30, ss=0
- Date + time + seconds: `2026-06-01 14:30:45` → hh=14, mm=30, ss=45
- `T` separator: `2026-06-01T14:30:00` → same as above

The `new Date(year, month-1, day, hh, mm, ss)` constructor uses LOCAL time, which is correct for comparing against `Date.now()` (also local). Correct.

Note: The companion function `entryTimestamp()` (lines 3009-3015) uses `23:59:59` as the time component for date-only entries (conservative "still active at end of day"), while `entryTimestampFull()` uses `00:00:00`. These two functions are used for different purposes: `entryTimestamp` for the 48h cutoff (where being conservative keeps entries visible longer), `entryTimestampFull` for the 1h live window. This intentional difference is correct.

---

## Bug Summary

| # | Severity | Location | Description | Fix |
|---|----------|----------|-------------|-----|
| B-1 | Medium | `buildPendingDocs()` line 3432 | Filename-only matching causes false negatives: a file with the same name in a different directory marks an unrelated file as "done" | Change to exact path comparison: `f === p` or `f.endsWith(p)` |
| B-2 | Low-Visual | `openAgentDetail()` line 4205 | `stColor` map missing `'ready'` key → status dot is invisible for Ready agents in detail drawer | Add `ready: 'var(--teal)'` to the map |
| B-3 | Low-Visual | SVG at line 2456 | `marker-end="url(#wf-arrow-green)"` references undefined marker — arrow at "output passes up chain" has no arrowhead | Add `wf-arrow-green` marker to SVG `<defs>` |
| B-4 | Data-edge | `parseActivityLive()` line 3052 | UTC vs local timezone mismatch in `toISOString().slice(0,10)` — affects users after midnight UTC | Use local date string: `new Date().toLocaleDateString('en-CA')` instead of `toISOString().slice(0,10)` |

---

## Warning Summary

| # | Severity | Function | Condition | Risk |
|---|----------|----------|-----------|------|
| W-1 | Low | `parseActivityLive` | Em-dash vs regular-hyphen separator in ACTIVITY.md | Agents silently dropped from live feed |
| W-2 | Low | `renderFeedStatus` | STATUS.md contains only `#` header lines | Shows "No status updates" for non-empty file |
| W-3 | Low | `parseActivityHistory` | Section label says "older than 1h" but date-only entries use "not today" boundary | Date-only entries from this morning appear in History, not Feed |
| W-4 | Low | `ocFindDirector` | Flat registry with no direct-to-CoS reporters | Fallback `members[0]` may not be the director |
| W-5 | Low | `roleToName` fuzzy fallback | Two agents whose names normalise to same string | Wrong agent may match |
| W-6 | Low | `extractActivityFilePaths` | Path with embedded spaces (unusual) | File path silently discarded from pending check |

---

## Overall Assessment

The dashboard is production-ready for its purpose. The rendering pipeline, refresh cycle, tab system, file viewer, and org chart architecture are all correctly implemented. The four bugs are minor-to-medium and none will crash the dashboard or corrupt data. Bug B-1 (`buildPendingDocs` false negatives) is the most impactful in practice and should be addressed first, as it causes the "In Progress" panel to silently mark files as done when they are not.

**Recommended action order:**
1. Fix B-1 (path comparison in `buildPendingDocs`)
2. Fix B-2 (add `ready` to `stColor` map)
3. Fix B-3 (add `wf-arrow-green` SVG marker)
4. Fix B-4 (UTC/local date string, low priority)
