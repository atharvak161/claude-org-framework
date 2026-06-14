# BUG-015 — Period Comparison: delta shows nothing when previous logged value is exactly £0
**Severity:** Low
**File:** js/pages/analytics.js (line 638)
**Symptom:** In the Period Comparison table, if a monthly log entry has `netGBP = 0`, `savedGBP = 0`, or computed expenses of £0, the "vs Last Mo" and "vs Last Yr" delta columns show nothing at all — no arrow, no value, no "—". The cell is blank, which looks like missing data rather than a meaningful comparison against a zero baseline.
**Root cause:** `delta(curr, prev)` returns `''` early when `prev === null || prev === 0`. The intent was presumably to skip comparison when there is no prior data (`null`), but `prev === 0` is a valid logged value and should still produce a delta. For example, if last month's net pay was £0 (e.g. on leave with no pay), and this month is £2,000, the delta should show `▲ £2,000`.
**Reproduction:** Create a monthly log entry with `netGBP: 0, savedGBP: 0`. Navigate to Analytics → Period Comparison. The "vs Last Mo" column for Net Pay, Expenses, and Savings is blank.
**Fix hint:** Change the early-return guard in `delta` and `pctDelta` to check only `prev === null`, not `prev === 0`. Zero is a valid baseline for comparison.
