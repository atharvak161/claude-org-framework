# BUG-031 — Calendar saveTimer Orphaned on Re-render (Double Save / Ghost Render)
**Severity:** High
**File:** js/pages/calendar.js (line 107–123)
**Symptom:** After editing a bill's due day, if the calendar re-renders before the 400ms debounce fires (e.g. user clicks Prev/Next month), the old timer cannot be cancelled — it fires, saves stale data, and triggers an additional unwanted `render()` call. On fast interactions this causes the calendar to re-render to the wrong month or duplicate saves.
**Root cause:** `let saveTimer` is declared as a local variable inside `render()`. Each invocation of `render()` creates a new closure with its own `saveTimer`. When the user triggers a second `render()` (via Prev/Next), the new scope has no reference to the previous `saveTimer`, so `clearTimeout(saveTimer)` in the new event listener operates on `undefined`. The old timer fires unimpeded.
**Reproduction:**
1. Have at least one expense item visible on the calendar.
2. Edit any "Due day" input in the Bill Schedule table.
3. Within 400ms, click "Prev" or "Next" to navigate months.
4. Observe: the save fires, `render()` is called, and the calendar jumps back to the previous month view.
**Fix hint:** Hoist `saveTimer` to module scope (outside `render()`), so all invocations of `render()` share the same reference and `clearTimeout` can reliably cancel the pending timer.
