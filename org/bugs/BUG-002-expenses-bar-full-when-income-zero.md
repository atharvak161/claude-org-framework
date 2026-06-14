# BUG-002 — Expenses Bar Shows 100% Full When Income Is Zero

**Severity:** Medium
**File:** js/pages/dashboard.js (line 359)
**Symptom:** When `pay.netWithOT` is 0 (e.g. on first load with no income data entered, or with an income of £0), the expenses progress bar renders at 100% width with the red/warning fill colour, even if there are also zero expenses. The UI looks like a full deficit when there is actually nothing at all.
**Root cause:** The width expression is `Math.min(pay.netWithOT > 0 ? round2((totalExp/pay.netWithOT)*100) : 100, 100)`. The fallback value hardcodes `100` (100%) whenever income is zero, regardless of whether expenses are also zero. Both-zero is a legitimate initial state (empty profile), but the bar presents it as "expenses = 100% of income".
**Reproduction:** Open the dashboard with a fresh/empty data file (or set `baseSalaryGBP` to 0 and clear all expenses). The orange/red expenses bar renders fully filled.
**Fix hint:** Change the fallback to distinguish the two zero cases: use `(totalExp > 0 ? 100 : 0)` as the fallback when `pay.netWithOT === 0`, so an empty profile shows a 0%-width bar rather than a 100%-width bar.
