# BUG-034 — Envelopes wireEvents saveTimer Stale Closure Causes Cascading Re-renders
**Severity:** High
**File:** js/pages/envelopes.js (lines 163–171)
**Symptom:** Editing a budget or spent value rapidly triggers multiple `render()` → `wireEvents()` cycles. Because `saveTimer` is scoped inside `wireEvents()`, each `render()` call creates a fresh timer scope. A timer from a previous `wireEvents()` invocation cannot be cleared by a subsequent one. Result: multiple saves fire in overlapping succession, and `render()` is called more times than intended — causing visible flicker and potential race conditions where an older save overwrites a newer one if `saveSec` resolves out of order.
**Root cause:** `let saveTimer` on line 164 is local to `wireEvents()`. `wireEvents()` is called at the end of every `render()` (line 160). `schedSave()` on a 500ms debounce calls `render()` when it fires, which calls `wireEvents()` again with a new, disconnected `saveTimer`. Any pending old timer is now invisible to the new scope and cannot be cancelled.
**Reproduction:**
1. Have 2+ envelopes created.
2. Rapidly change the Budget or Spent field of one envelope multiple times within 500ms intervals.
3. Observe: more than one save and re-render occur (visible as UI flicker or network/storage calls in DevTools).
**Fix hint:** Hoist `saveTimer` to module scope (outside `wireEvents()` and `render()`), so all event handler generations share the same reference. This matches the standard debounce pattern.
