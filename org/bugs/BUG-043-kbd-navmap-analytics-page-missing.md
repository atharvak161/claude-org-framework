# BUG-043 — G+X Maps to analytics.html Which Does Not Exist in NAV

**Severity:** High
**File:** /Users/atharva/Downloads/organisation/src/projects/financial-dashboard/js/shared-layout.js (line 176)
**Symptom:** Pressing G+X attempts to navigate to `analytics.html`. That page is not listed in the NAV array and almost certainly does not exist, resulting in a 404 / blank page.
**Root cause:** `NAV_MAP` contains `x: 'analytics.html'` (line 176) but the NAV array (lines 6–20) has no corresponding entry for `analytics.html`. The nearest related page is `networth.html`. The keyboard shortcut help toast also advertises "G X → Analytics", reinforcing the broken path.
**Reproduction:**
1. Open any page.
2. Press G, then X within 1 second.
3. Browser navigates to analytics.html → 404 or blank page.
**Fix hint:** Either create analytics.html as a valid page, or correct the NAV_MAP entry for `x` to point to `networth.html` (and update the help toast label accordingly).
