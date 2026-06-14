# BUG-046 — Mobile Bottom Nav Missing Calendar and Envelopes Pages

**Severity:** Medium
**File:** /Users/atharva/Downloads/organisation/src/projects/financial-dashboard/js/shared-layout.js (line 237–268)
**Symptom:** On mobile, the bottom tab bar does not include Calendar or Envelopes. Users on mobile can only reach these pages via the hamburger sidebar, which requires an extra tap and is not intuitive for frequently-used pages.
**Root cause:** `MOBILE_NAV` (lines 237–268) was not updated when calendar.html and envelopes.html were added. The array still contains only the original five entries: overview, expenses, assets, goals, networth. Transactions is also absent from the mobile nav.
**Reproduction:**
1. Open the dashboard on a mobile viewport (or with dev tools mobile emulation).
2. Observe the bottom tab bar — no Calendar or Envelopes tab is visible.
3. The only way to reach those pages is via the sidebar overlay.
**Fix hint:** Decide which 5 items belong in the mobile bottom nav given the expanded page set (now 13+ pages), then update `MOBILE_NAV` accordingly. Consider a "More" overflow tab for the remainder.
