# BUG-001 — stat-label / stat-value Render Unstyled in Cash Flow Panel

**Severity:** Medium
**File:** js/pages/dashboard.js (lines 350, 351, 363, 364)
**Symptom:** The "Income", "Expenses", and "Net cash flow:" labels in the Cash Flow Status panel render with no applied colour or font styling — they appear as plain unstyled text instead of the intended secondary-colour label style.
**Root cause:** The CSS rules `.stat-row .stat-label` and `.stat-row .stat-value` are scoped as descendant selectors that only apply when these classes appear inside a `.stat-row` parent (components.css line 393–394). In the Cash Flow panel the elements are used as bare `<span class="stat-label">` and `<span class="stat-value mono ...">` with no `.stat-row` ancestor, so neither rule matches and the styles are silently dropped.
**Reproduction:** Load the Overview tab with any valid data. Inspect the "Income £X / Expenses £X" line and the "Net cash flow:" label in the Cash Flow Status panel — font weight, colour, and mono-font are absent.
**Fix hint:** Either (a) add standalone `.stat-label` and `.stat-value` rules to theme.css that define the base style, or (b) wrap the Income/Expenses row and the Net cash flow row in a `<div class="stat-row">` container, or (c) replace the `stat-label`/`stat-value` class references in the Cash Flow panel with `label-muted` / `mono` classes that are already defined globally.
