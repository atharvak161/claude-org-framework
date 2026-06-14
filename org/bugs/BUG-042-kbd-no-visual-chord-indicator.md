# BUG-042 — No Visual Feedback When G Chord Is Active

**Severity:** Medium
**File:** /Users/atharva/Downloads/organisation/src/projects/financial-dashboard/js/shared-layout.js (line 184–188)
**Symptom:** After pressing G to start a chord, there is no on-screen indicator that the system is awaiting a second keystroke. The user has no way to know the 1-second chord window is open, leading to accidental navigation if they press any mapped key (D, E, I, A, T, N, X, C, V) for any reason within that second.
**Root cause:** `_gPressed = true` and the 1-second timer are set silently. No toast, status indicator, or UI change accompanies this state.
**Reproduction:**
1. Press G on any page.
2. Observe: no visible change anywhere on screen.
3. Press E within 1 second: navigates to expenses.html unexpectedly.
**Fix hint:** Show a dismissible micro-toast or status-bar hint (e.g. "G — ") when `_gPressed` becomes true; remove it when the timer fires or the chord resolves.
