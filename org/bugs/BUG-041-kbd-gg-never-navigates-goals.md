# BUG-041 — G+G Chord Never Navigates to Goals

**Severity:** High
**File:** /Users/atharva/Downloads/organisation/src/projects/financial-dashboard/js/shared-layout.js (line 184–195)
**Symptom:** Pressing G then G does not navigate to goals.html, despite G being mapped in NAV_MAP as `g: 'goals.html'`.
**Root cause:** The `key === 'g'` check (line 184) is evaluated before the `if (_gPressed && NAV_MAP[key])` check (line 190). When the second G is pressed, the first branch fires, sets `_gPressed = true` again, and returns early — the chord-dispatch block is never reached. G is the only key in NAV_MAP that is also the chord initiator, creating an unreachable path.
**Reproduction:**
1. Open any page in the dashboard.
2. Press G, then press G again within 1 second.
3. Nothing happens. Expected: navigate to goals.html.
**Fix hint:** Move the `_gPressed && NAV_MAP[key]` check before the `key === 'g'` check, or exclude `'g'` from the early-return branch when `_gPressed` is already true.
