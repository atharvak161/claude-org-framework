# BUG-047 — Mobile Nav "Analytics" Tab Links to networth.html (Label Mismatch)

**Severity:** Low
**File:** /Users/atharva/Downloads/organisation/src/projects/financial-dashboard/js/shared-layout.js (line 263–267)
**Symptom:** The fifth tab in the mobile bottom nav is labelled "Analytics" but navigates to `networth.html`. The sidebar shows this same page as "Net Worth". The inconsistent label confuses users who expect "Net Worth" and cannot find an "Analytics" page.
**Root cause:** The MOBILE_NAV entry at lines 263–267 has `id: 'networth'`, `label: 'Analytics'`, `href: 'networth.html'`. The label was not synchronised with the page's actual title. The desktop NAV array correctly labels the same entry as "Net Worth".
**Reproduction:**
1. Open the dashboard on a mobile viewport.
2. Observe the bottom nav — fifth tab reads "Analytics".
3. Tap it — lands on Net Worth page, not an analytics page.
4. Sidebar labels the same page "Net Worth".
**Fix hint:** Change `label: 'Analytics'` to `label: 'Net Worth'` in the MOBILE_NAV entry, or wire it to a genuinely separate analytics page if one is planned.
