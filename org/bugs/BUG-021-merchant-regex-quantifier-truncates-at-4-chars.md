# BUG-021 — Merchant Regex Quantifier Truncates at 4 Characters
**Severity:** High
**File:** /Users/atharva/Downloads/organisation/src/projects/financial-dashboard/js/pages/transactions.js (lines 66–69)
**Symptom:** Merchant/description extracted from SMS is cut off after 4 characters (e.g. "Swig" instead of "Swiggy Food Delivery"), causing near-useless descriptions for most transactions and poor category guessing.
**Root cause:** The character-class quantifier is written as `{2,40?}` — in JavaScript regex, this parses as `{2,4}` (match 2 to 4 characters) followed by a literal `0?` (optional zero). The intended meaning was `{2,40}?` (non-greedy match of 2–40 characters), where the `?` must appear AFTER the closing `}`. All four merchant patterns on lines 66–69 share this bug.
**Reproduction:** Paste an SMS containing "at Swiggy Food" — the extracted description will be "Swi" or "Swig" (≤4 chars), not the full merchant name.
**Fix hint:** Move the `?` outside the quantifier brace on all four patterns: change `{2,40?}` to `{2,40}?`.
