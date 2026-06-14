# BUG-012 — SGB: current value set to purchase cost, not market value
**Severity:** High
**File:** js/pages/assets.js (line 822)
**Symptom:** Sovereign Gold Bonds always show £0 gain/loss and 0% ROAI regardless of how much the gold price has moved since purchase. The ROAI section is effectively useless for SGBs.
**Root cause:** `valueGBP` is set to `cost` (i.e. `purchasePriceINR * gramsHeld / rate`), which is the purchase cost basis. The same variable is used as both the current portfolio value and the invested basis: `rows.push({ ..., valueGBP: cost, invested: cost || null })`. Since `valueGBP === invested`, gain is always `cost - cost = 0`. SGBs should use a current gold price (e.g. `currentPriceINR` per gram) for `valueGBP`, while `invested` remains the original purchase cost.
**Reproduction:** Add an SGB with `purchasePriceINR = 5000`, `gramsHeld = 4`. The row shows Value = £X, Invested = £X, Gain = £0, ROAI = 0.0% — even if gold has risen 30%.
**Fix hint:** Add a `currentPriceINR` (or equivalent) field to the SGB data schema and use it to compute `valueGBP = currentPriceINR * gramsHeld / rate`. Keep `invested = purchasePriceINR * gramsHeld / rate`. Until a live price field exists, document that ROAI for SGBs is always 0 by design and consider showing N/A instead.
