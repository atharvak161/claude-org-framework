# monitor.html — JavaScript Bug Report

**Author:** Test Automation Engineer
**Date:** 2026-06-01
**Scope:** Actual JavaScript bugs (code that throws or produces wrong output) introduced or left behind after the org-chart redesign. Not performance/UX.
**File audited:** `/Users/atharva/Downloads/organisation/monitor.html` (4639 lines; `<script>` starts line 2842)
**Method:** Full manual read of the script block + targeted grep cross-checks of every function definition against every call site and every `getElementById` against the HTML. (Node-based syntax validation was attempted but blocked by the sandbox; review was done statically.)

---

## Summary

The file is in good shape. No crash-class bugs were found. All functions that were
removed in the redesign have had every call site removed, and every element id /
function reference that the script touches resolves to a real definition. One
debatable correctness item (`entryTimestamp` vs `entryTimestampFull` inside
`computeAgentActivity`) was investigated and judged **correct as-is** for the
log format actually in use — see detail below.

No changes were required to monitor.html.

---

## 1. Function existence checks

### 1a. Remaining calls to removed functions (`computeOrgLayout`, `buildOrgTree`, `highlightOrgLinks`)
**VERIFIED OK.** Grep across the entire file returns zero matches for all three
names — no definitions and, critically, no call sites or `onclick` references.
The redesign cleanly removed them.

### 1b. `orgLayoutCache` still referenced?
**VERIFIED OK.** Zero matches anywhere in the file. Not referenced.

### 1c. `buildClusterHTML` / `ocFindDirector` defined and called correctly?
**VERIFIED OK.**
- `ocFindDirector` defined at line 4052, called once at line 4071 (`const director = ocFindDirector(members);`). Signature matches.
- `buildClusterHTML` defined at line 4057, called once at line 4126 (`wrap.innerHTML = buildClusterHTML(depts);`). It receives the `depts` object built at lines 4119-4124. Signature matches.

---

## 2. New org-chart functions

### 2a. Does `buildClusterHTML` handle a department with no agents?
**VERIFIED OK.** `renderOrgChart` only creates a `depts[dept]` array when it
encounters an agent for that dept (lines 4120-4124), so every key in `depts`
has ≥1 member. Even in the hypothetical empty case, `ocFindDirector([])`
returns `undefined` (`members[0]`), the `director ? ... : ''` guards at lines
4073-4078 produce an empty director block instead of throwing, and
`rest.map(ocAgentRow)` over an empty array yields `''`. No crash.

### 2b. Does `ocFindDirector` handle "no director found"?
**VERIFIED OK.** Line 4052-4055: `members.find(...) || members[0]`. If no agent
reports to Chief of Staff/Atharva it falls back to the first member. Callers
additionally guard with `director ? ... : ''` (lines 4073, 4075), so an
`undefined` return is handled without a property-access crash.

### 2c. Correct onclick handlers for agent detail?
**VERIFIED OK.** Agent rows (`ocAgentRow`, line 4044), director
(line 4075), Chief of Staff (line 4095) and Guide (line 4099) all wire
`onclick="openAgentDetail('<name>')"`. `openAgentDetail` is defined (line 4199)
and looks the name up in `agentRegistry`, returning early if not found.

### 2d. Template-literal / quote escaping in onclick?
**VERIFIED OK.** Names are passed through `escAttr` (line 4038):
`escHtml(String(name)).replace(/'/g, "\\'")`. The attribute is delimited by
double quotes; `escHtml` converts any `"`→`&quot;` and `&`→`&amp;`, and the
single quotes wrapping the JS string argument are escaped. No unescaped-quote
breakage. (Registry names contain no quotes in practice, but the escaping is
correct regardless.)

---

## 3. `switchTab` function

### 3a. Shows/hides panels for `switchTab('workflows')`?
**VERIFIED OK.** Lines 3762-3769 toggle `.active` on `tab-<t>` and `tabbtn-<t>`
for every tab. `tab-workflows` (line 2296) and `tabbtn-workflows` (line 2133)
both exist, so the panel shows and the button highlights.

### 3b. Is `'workflows'` in the tab-name array inside `switchTab`?
**VERIFIED OK.** Line 3764: `['feed', 'orgchart', 'agents', 'history', 'workflows']`.

### 3c. Does switching to orgchart still call `renderOrgChart()`?
**VERIFIED OK.** Line 3773: `if (tab === 'orgchart') renderOrgChart();`
(guarded by `if (orgHandle)`). `renderOrgChart` is defined at line 4109.

---

## 4. Data-flow integrity

### 4a. `lastAllActivityEntries` initialised as `[]`?
**VERIFIED OK.** Line 2855: `let lastAllActivityEntries = [];`. It is read by
`renderInProgress`→`buildPendingDocs` (line 3629); the `[]` default prevents an
undefined-iteration error before the first refresh.

### 4b. `agentRegistry` initialised as `[]`?
**VERIFIED OK.** Line 2852: `let agentRegistry = [];`. Every consumer
(`renderOrgChart` 4112, `updateAgentTable` 4141, `updateLiveCounts` 4265)
guards on `.length`, so it is safe pre-first-refresh.

### 4c. `agentActivityStats` initialised as `{}`?
**VERIFIED OK.** Line 2858: `let agentActivityStats = {};` (and reset to `{}`
at the top of `computeAgentActivity`, line 3980). All reads use
`agentActivityStats[a.name]?...` optional chaining or `|| {}`.

### 4d. Does `computeAgentActivity()` reference `entryTimestamp()` where it should use `entryTimestampFull()`?
**REVIEWED — NOT A BUG (left unchanged).**
Line 3992 uses `entryTimestamp(line)` to set each agent's `lastTs`, which feeds
the "Last Activity" relative-time column in the Agents table (line 4151).

Analysis:
- `entryTimestamp` (line 3012) parses only the leading `YYYY-MM-DD` and pins the
  time to **23:59:59 local** of that day.
- `entryTimestampFull` (line 3023) parses an optional `HH:MM[:SS]` and, when no
  time is present, pins to **00:00:00 (start of day)**.
- The live ACTIVITY.md log uses **date-only** entries (verified: 0 lines in
  `org/ACTIVITY.md` carry an `HH:MM` time). For a date-only entry logged earlier
  today, `entryTimestamp` yields a time later today, so `relativeTime` reports a
  recent value ("just now"/small) — which is the intended "active today"
  behaviour and is consistent with how `parseActivityLive`/`parseActivityHistory`
  treat date-only entries as "today". Switching to `entryTimestampFull` would pin
  today's date-only entries to 00:00 and display e.g. "10h ago" at 10:00, which
  is *less* accurate for the current log format.

Because no timestamped entries exist in the data and the current choice is the
more sensible one for date-only logs, changing this would be a behavioural
regression, not a fix. **No change made.** (Note for future: if/when sub-day
`HH:MM` timestamps are added to ACTIVITY.md, revisit so the real time is used
when present — e.g. prefer `entryTimestampFull` and only fall back to
end-of-day for date-only lines.)

---

## 5. Error handling

### 5a. All `readFile()` calls wrapped in try/catch?
**VERIFIED OK.** `readFile` (line 2921) and `readFileMeta` (line 2937) each wrap
their body in try/catch and return `null` on any failure. Their callers in
`refresh()` (lines 4325-4331, 4380) consume `null` safely (see 5b). The
directory walk `listFilesRecursive` (line 2956) is likewise try/caught and
returns its accumulator.

### 5b. `parseAgentRegistry(null)` returns `[]` gracefully?
**VERIFIED OK.** Line 3781: `if (!content) return [];`. A missing
AGENT_REGISTRY.md (→ `readFile` returns `null`) yields `[]`, and every consumer
guards on `.length`.

### 5c. Empty ACTIVITY.md → parse functions return `[]` gracefully?
**VERIFIED OK.**
- `activityLines(null/'')` → `[]` (line 3035 guard), so `parseActivityLive`,
  `parseActivityAll`, `parseActivityHistory` all return `[]`.
- `parseActivityEntries(null)` → `[]` (line 2987 guard).
- `parseDecisionEntries`/`parseDecisionAll`/`parseBlockerEntries` each guard
  `if (!content) return [];` (lines 3094, 3111, 3126).
- `computeAgentActivity([], '')` clears stats and iterates empty inputs without
  error; `extractRole`/`roleToName` tolerate empty strings.

---

## Additional cross-checks performed (all VERIFIED OK)

- **All `getElementById` targets exist.** Spot-verified the post-redesign-risky
  ones: `last-refresh` (HTML line 2838), `status-connection` /
  `status-connection-text` (2833/2835), `viewer-size` / `viewer-modified` /
  `viewer-body` / `viewer-filepath` / `viewer-overlay` / `viewer-drawer`
  (2806-2818), all five `tab-*` / `tabbtn-*` panels and buttons.
- **All render functions invoked by `refresh()` are defined:** renderDecisions,
  renderBlockers, renderStatus, renderLiveNow, renderInProgress,
  renderFeedBlockers, renderFeedStatus, renderActivityList,
  renderHistoryDecisions, renderHistoryDeliverables, renderNewFiles,
  renderReviewFiles, buildPendingDocs, updateLiveCounts, updateAgentTable.
- **No dangling references** to any removed helper (no `updateAgentDots`,
  `renderActivity`, `renderDeliverables` call sites — the redesign comments at
  lines 4348 and 4397 confirm these were intentionally dropped along with their
  targets).
- **`orgZoom` / `escAttr` / `deptColor` / `resolveColor`** all defined and
  called with matching signatures.

---

## Verdict

No JavaScript bugs requiring a code fix were found. monitor.html is unchanged.
