# ACTIVITY ADDENDUM — entries to append to org/ACTIVITY.md
# Written by: CHIEF_OF_STAFF technical support agent
# Date: 2026-06-10
# Action required: manually append all lines below (after the ## Entries section) to org/ACTIVITY.md

## Why this file exists

macOS TCC (Transparency, Consent, and Control) has revoked the shell subprocess's
permission to read or write to pre-existing files in ~/Downloads. This is a known
recurrence — see org/HANDOFF.md ("BLOCKER: macOS TCC permission revocation").

The shell can only create NEW files in the organisation directory; it cannot open
existing ones (ACTIVITY.md, monitor.html, etc.) for reading or writing.

Fix (Atharva must do):
  System Settings → Privacy & Security → Files and Folders → Terminal → Downloads: ON
  OR: System Settings → Privacy & Security → Full Disk Access → enable Terminal

## Entries to append to org/ACTIVITY.md

Run this in your terminal after restoring TCC access:

```bash
cat << 'ACTIVITY_EOF' >> /Users/atharva/Downloads/organisation/org/ACTIVITY.md

[2026-06-10 17:30:00] BACKEND_DEVELOPER — SPAWNED — feat/jsearch-integration — JSearch Google Jobs adapter
[2026-06-10 17:35:00] BACKEND_DEVELOPER — SPAWNED — feat/activejobs-integration — Active Jobs DB adapter
[2026-06-10 17:40:00] BACKEND_DEVELOPER — SPAWNED — feat/indeed-monster-remoote-manual-search — Indeed, Monster, Remoote adapters + Search button
[2026-06-10 17:45:00] BACKEND_DEVELOPER — SPAWNED — feat/glassdoor-integration — Glassdoor adapter
[2026-06-10 18:54:00] CHIEF_OF_STAFF — SPAWNED — gov.uk sponsor register import agent — import 127k companies
[2026-06-10 18:54:18] SPONSOR_IMPORT_AGENT — COMPLETED — imported 127,386 licensed sponsors into SponsorRegister table
ACTIVITY_EOF
```

## Monitor HTML status

monitor.html path: /Users/atharva/Downloads/organisation/monitor.html
Data source: File System Access API (browser reads files directly — user must click "Connect folder")

### What was already fixed (Jun 9, session db011bee)

1. Bracket timestamp regex — 6 regexes updated to accept `[YYYY-MM-DD HH:MM:SS]` format
   - `entryTimestamp`, `entryTimestampFull`, `parseActivityLive`, `parseActivityHistory`,
     `parseRightNow`, `renderLiveNow` — all changed from `/^\s*\d{4}/` to `/^\s*\[?\d{4}/`

2. Active Agents panel added (Feed tab) — shows SPAWNED/STARTED agents in last 2h
   with no COMPLETED counterpart; pulsing green dot, role colour, task text, elapsed time

3. Blueprint status overflow fixed — word-break + overflow-wrap on status panels

### Remaining issue (why agents still don't appear today)

The `parseActiveAgents` function detects entries with `— SPAWNED —` or `— STARTED —`.
Today's requested entries use exactly `— SPAWNED —` (correct).
The function has a 2-hour cutoff window (`ACTIVE_AGENT_WINDOW_MS = 2 * 60 * 60 * 1000`).

Entries logged at 17:30–18:54 on Jun 10 will NO LONGER appear in the "Active Agents" panel
because they are now older than 2 hours. They WILL appear in the "History" tab.

For the "Active Agents" panel to show agents, entries must be within the last 2 hours of
the browser's current time when the folder is connected.

### SPAWN vs SPAWNED keyword note

The requested entries use `— SPAWN —` (in the task description) but the monitor
regex expects `— SPAWNED —`. The entries written above use `— SPAWNED —` to match
the existing ACTIVITY.md format and the monitor's parseActiveAgents function.

If future entries use `— SPAWN —` (without the D), the monitor will NOT detect them.
Two fixes are possible:
  Option A: Always write SPAWNED (established format, existing entries use this)
  Option B: Update parseActiveAgents regex from `/—\s*SPAWNED\s*—/` to `/—\s*SPAWNED?\s*—/`
             (makes SPAWNED and SPAWN both match)

Option B can be applied to monitor.html once TCC access is restored.
