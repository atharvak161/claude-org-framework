# BUG-014 — S&S ISA and SIPP: invested estimate hardcoded to 3 years regardless of tenure
**Severity:** Medium
**File:** js/pages/assets.js (lines 774, 785)
**Symptom:** The ROAI table shows an "Est. Invested" for S&S ISA and SIPP that is always exactly 3× the annual contribution, regardless of how long the account has been open. A SIPP open for 10 years shows the same invested figure as one open for 1 year.
**Root cause:** 
- S&S ISA: `invested: ssISA.annualContributionGBP * 3`
- SIPP: `invested: annual * 3` (where `annual = ytdContribution + employerContribution`)
Both are hardcoded multipliers with no reference to an account start date or tenure field. The figure is arbitrary and misleads the ROAI % calculation.
**Reproduction:** Add an S&S ISA with `annualContributionGBP = 10000`. Invested shows £30,000 regardless of whether the ISA is 1 year or 15 years old.
**Fix hint:** Add an optional `startYear` (or `startDate`) field to the ISA and SIPP schemas. Compute invested as `annualContribution * yearsSinceStart`. Fall back to `null` (N/A) if no start date is provided, rather than silently showing a fabricated number.
