# BUG-013 — SGB: cost=0 produces invested=null, hiding valid rows from totals
**Severity:** Medium
**File:** js/pages/assets.js (line 822)
**Symptom:** If an SGB entry has `purchasePriceINR = 0` (or `gramsHeld = 0`), `cost = 0`, and `cost || null` evaluates to `null`. The row is excluded from `invRows` and the total invested/gain calculation. Additionally `valueGBP = cost = 0`, so the row contributes nothing to total portfolio value either. A real holding with missing price data silently disappears from all summaries.
**Root cause:** `cost || null` is a falsy-coercion shortcut. Zero is falsy in JavaScript, so a legitimately zero-cost or partially-entered SGB silently converts to `null` rather than surfacing as a data-entry issue.
**Reproduction:** Add an SGB with `gramsHeld = 4` but leave `purchasePriceINR` blank/0. The row appears in the table with £0 value, no invested amount, no gain — and is excluded from total invested.
**Fix hint:** Use an explicit null check: `invested: (x.purchasePriceINR != null && x.gramsHeld) ? cost : null`. Separately, surface a UI warning when `gramsHeld > 0` but `purchasePriceINR` is missing.
