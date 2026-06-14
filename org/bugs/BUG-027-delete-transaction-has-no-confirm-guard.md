# BUG-027 — Single Transaction Delete Has No Confirmation Guard
**Severity:** Low
**File:** /Users/atharva/Downloads/organisation/src/projects/financial-dashboard/js/pages/transactions.js (lines 328–335)
**Symptom:** Clicking the ✕ button on a transaction row deletes it immediately and permanently with no confirmation dialog. A misclick or accidental tap destroys data with no recovery path.
**Root cause:** The delete click handler (line 329) directly filters `state.transactions.items` and calls `saveSec`. There is no `confirm()` call. By contrast, "Clear all" on line 339 does have a `confirm()` guard — the inconsistency is a UX gap rather than a design choice.
**Reproduction:** Click any ✕ button in the transaction log. The row disappears instantly. Refreshing the page confirms the deletion is persisted.
**Fix hint:** Add `if (!confirm('Delete this transaction?')) return;` as the first line of the delete click handler, consistent with the "Clear all" pattern already in the same file.
