# BUG-036 — Envelopes Summary Table Total Remaining Shows No Sign When Over Budget
**Severity:** Low
**File:** js/pages/envelopes.js (line 153)
**Symptom:** In the "Spent vs Budget" summary table, when total spent exceeds total budget, the "Remaining" cell in the total row shows a bare positive number (e.g. `£50.00`) instead of indicating it is negative (e.g. `−£50.00`). The cell also has no red colour class applied. Individual envelope rows correctly show `−£50.00` in red (line 145), but the total row does not.
**Root cause:** Line 153: `${fmtGBP(Math.abs(round2(totalTarget-totalSpent)))}` — `Math.abs` strips the sign unconditionally, and the colour class for the total remaining `<td>` uses `totalTarget-totalSpent < 0 ? 'roai-negative' : 'roai-positive'` (correct) but the displayed value never prepends a `-` character when negative, unlike line 145 which uses `${rem >= 0 ? '' : '-'}${fmtGBP(Math.abs(rem))}`.
**Reproduction:**
1. Create two envelopes: Budget £100 each.
2. Set Spent to £150 on one envelope.
3. View the summary table. Total Budget: £200, Total Spent: £150, Total Remaining: `£50.00` (correct here). Now set Spent to £250 on one envelope.
4. Total Remaining shows `£50.00` (no minus sign) in red — confusing, as the user cannot tell direction from the number alone.
**Fix hint:** Mirror the pattern from line 145: `${round2(totalTarget-totalSpent) >= 0 ? '' : '-'}${fmtGBP(Math.abs(round2(totalTarget-totalSpent)))}`.
