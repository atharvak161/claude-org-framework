# BUG-026 — No Deduplication on Import — Same File Can Be Imported Multiple Times
**Severity:** Medium
**File:** /Users/atharva/Downloads/organisation/src/projects/financial-dashboard/js/pages/transactions.js (lines 181–186)
**Symptom:** Importing the same CSV or SMS batch twice silently doubles all transactions. Total debits and credits double accordingly. There is no warning, no duplicate indicator, and no way to tell duplicates apart after the fact (each gets a unique `txn_` ID via `Date.now() + random`).
**Root cause:** `importTransactions` (line 184) blindly prepends the new array to `state.transactions.items` with no check for existing records sharing the same date + description + amount combination. Transaction IDs are generated fresh on each import so they never collide.
**Reproduction:** Upload a 20-row CSV and click Import. Re-upload the same file and click Import again. The log now shows 40 rows — all duplicates — and summary totals are doubled.
**Fix hint:** Before inserting, filter `newItems` against `state.transactions.items` using a composite key of `(date, description, amount, currency)`. Items that match an existing record should be skipped (or flagged for user review). Alternatively, generate the transaction ID deterministically from those four fields so duplicate IDs are rejected naturally.
