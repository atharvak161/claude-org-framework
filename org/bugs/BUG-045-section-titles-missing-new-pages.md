# BUG-045 — SECTION_TITLES Missing Entries for transactions, calendar, envelopes

**Severity:** Low
**File:** /Users/atharva/Downloads/organisation/src/projects/financial-dashboard/js/shared-layout.js (line 22–34)
**Symptom:** On the Transactions, Bill Calendar, and Envelopes pages, the topbar title renders as the raw lowercase nav ID (`"transactions"`, `"calendar"`, `"envelopes"`) instead of a properly formatted title like "Transactions", "Bill Calendar", or "Envelopes".
**Root cause:** `SECTION_TITLES` (lines 22–34) was not updated when the three new pages were added. The topbar code falls back to `activeNav` when the key is absent: `SECTION_TITLES[activeNav] || activeNav` (line 103). The `activeNav` values are lowercase IDs, not display strings.
**Reproduction:**
1. Navigate to transactions.html, calendar.html, or envelopes.html.
2. Observe the topbar title — it shows "transactions", "calendar", or "envelopes" in lowercase.
**Fix hint:** Add `transactions: 'Transactions'`, `calendar: 'Bill Calendar'`, and `envelopes: 'Envelopes'` to the `SECTION_TITLES` object.
