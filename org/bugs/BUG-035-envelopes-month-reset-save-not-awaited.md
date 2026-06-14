# BUG-035 — Envelopes Month-Reset Save Not Awaited — Data Loss on Fast Navigation
**Severity:** Medium
**File:** js/pages/envelopes.js (line 39)
**Symptom:** At the start of a new month, `spentGBP` values are reset to 0 in memory and a fire-and-forget `saveSec(...)` is called. If the user navigates away from the Envelopes page before the async save resolves, the reset is lost. On returning, the old month's spent values reappear — and because `state.envelopes.month` was never persisted, the reset triggers again, causing an infinite reset loop on every visit until a full save completes.
**Root cause:** Line 39: `saveSec('fin_envelopes', state.envelopes);` — no `await`. The surrounding code is at module top level inside an `if` block, which is not itself async. The ES module top-level `await` is available (the file uses `await initPage(...)` on line 11), so `await saveSec(...)` is valid here and simply was not used.
**Reproduction:**
1. Set a non-zero `spentGBP` on any envelope.
2. Manually set `state.envelopes.month` in DevTools storage to a prior month key (e.g. `'2026-05'`).
3. Reload the Envelopes page and immediately navigate to another page (e.g. click Dashboard) within ~50ms.
4. Return to Envelopes. Observe: spent values were not reset; month key was not updated.
**Fix hint:** Change line 39 to `await saveSec('fin_envelopes', state.envelopes);`. Top-level `await` is already in use in this module.
