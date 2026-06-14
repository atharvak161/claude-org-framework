# BUG-032 — Calendar Day Cap at 28 Silently Moves Bills Without Warning
**Severity:** Medium
**File:** js/pages/calendar.js (lines 34, 111) and calendar.html (line 78)
**Symptom:** Any bill with `dayOfMonth` set to 29, 30, or 31 is silently rendered on day 28. The user sees no error. A bill they expect on the 30th appears on the 28th, with no indication it was clamped.
**Root cause:** `Math.min(Math.max(parseInt(item.dayOfMonth) || 1, 1), 28)` caps all days at 28. The summary table input also has `max="28"`. While February legitimately has at most 28 days (29 in leap years), months with 30 or 31 days can validly host bills on those dates. The cap is applied uniformly regardless of the current view month, so it is always wrong for months with more than 28 days.
**Reproduction:**
1. Create an expense with `dayOfMonth` = 30 (e.g. by editing the raw state or via a future import feature).
2. View the Bill Calendar in any month with 31 days (January, March, May, etc.).
3. Observe: the bill appears on day 28, not day 30. Day 29, 30, 31 cells are empty for that bill.
**Fix hint:** Cap should be `daysInMonth` for the currently rendered month, not a hard 28. Calculate `daysInMonth` per item based on `viewYear`/`viewMonth`, or raise the storage cap to 31 and clamp at render time to the actual month length with a visible tooltip/warning.
