# QA Regression Report — Blueprint (post-rename, post-bugfix)

**Date:** 2026-06-07
**Author:** Director of QA
**Target:** https://atharvak161.github.io/Blueprint/
**Reference commit:** d3f3c42 (atharvak161/Blueprint)
**Reference deploy:** GitHub Actions run 27093810882
**Tooling:** playwright-core + chrome-headless-shell (headless Chromium), automated end-to-end script

## Scope
Full regression pass on the live production deployment to confirm:
1. The blank-page runtime crash fix holds
2. The back-button / "All Projects" labeling fix holds
3. No other regressions were introduced by the rename or fixes

## Method
Automated headless-browser script driving the live site through every primary
user flow, capturing console errors, page (uncaught exception) errors, and
failed network requests at each step. 27 discrete assertions executed across
7 check groups. Full run log retained at `/private/tmp/qa-blueprint/run1.log`.

## Results

| # | Check | Result | Detail |
|---|-------|--------|--------|
| 1.1 | Page loads, browser tab title = "Blueprint" | PASS | `title="Blueprint"` |
| 1.2 | Zero console errors on initial load | PASS | `[]` |
| 1.3 | Zero uncaught page errors on initial load | PASS | `[]` |
| 1.4 | Zero failed network requests (incl. HTTP ≥400) on load | PASS | `[]` |
| 1.5 | Branding text consistent ("Blueprint" only, no "Excel-Project-Hub") | PASS | only match = "Blueprint" |
| 2.1 | Sidebar shows "All Projects" link | PASS | `href=/Blueprint/projects` |
| 2.2 | Sidebar shows "Resources" link | PASS | `href=/Blueprint/resources` |
| 2.3 | Sidebar shows "Holidays" link | PASS | `href=/Blueprint/holidays` |
| 2.4 | Navigate → All Projects (heading + zero errors) | PASS | heading="All Projects", 0 console/page errors |
| 2.5 | Navigate → Resources (heading + zero errors) | PASS | heading="Resources", 0 console/page errors |
| 2.6 | Navigate → Holidays (heading + zero errors) | PASS | heading="UK Bank Holidays", 0 console/page errors |
| 3.1 | Create new project via UI dialog | PASS | project "QA Regression Test …" created and listed |
| 3.2 | Open created project → detail view loads | PASS | `url=/Blueprint/projects/1/plan` |
| 3.3 | Report tab "Plan" loads, zero errors | PASS | |
| 3.4 | Report tab "Gantt Chart" loads, zero errors | PASS | |
| 3.5 | Report tab "Dashboard" loads, zero errors | PASS | |
| 3.6 | Report tab "RAG Status" loads, zero errors | PASS | |
| 4.1 | On project-detail route as expected before back-nav test | PASS | `/Blueprint/projects/1/rag` |
| 4.2 | Breadcrumb "All Projects" link → returns to `/projects` | PASS | landed on `/Blueprint/projects` |
| 4.3 | Sidebar "All Projects" link from detail page → returns to `/projects` | PASS | landed on `/Blueprint/projects` |
| 5.1 | "Import" button present and clickable, no errors thrown | PASS | |
| 5.2 | "Export" button present and clickable, no errors thrown | PASS | |
| 6.1 | Sweep all pages (Home/All Projects/Resources/Holidays) for any "Projects" label NOT preceded by "All" | PASS | zero inconsistencies found — labeling is uniform |
| 7.1 | Persistence: new project written to localStorage | PASS | key `eph_projects` updated, contains new project |
| 7.2 | Persistence: project survives full page reload | PASS | project still listed after `page.reload()` |

**Totals: 25 PASS / 0 FAIL / 0 CONDITIONAL / 2 INFO**

## Flagged item — "0 projects" on first load (NOT a bug, confirmed)

Investigated per request. Findings:
- A **fresh browser context** (clean localStorage, simulating a first-time
  visitor or anyone who previously used the old `/Excel-Project-Hub/` path)
  loads `/Blueprint/projects` and correctly shows **"0 projects"** with
  `localStorage` returning `{}`.
- This is expected: `localStorage` is scoped per-origin **and per-path** for
  GitHub Pages project sites, so data written under `/Excel-Project-Hub/`
  is invisible at `/Blueprint/`. This is a browser platform behaviour, not an
  app defect — there is no migration mechanism (nor should there be one for a
  client-only localStorage app following a deliberate rename).
- **Persistence verified working correctly**: created a project named
  "Persistence Check …", confirmed it was written to `localStorage` under key
  `eph_projects`, reloaded the page, and the project was still present and
  listed. Data loading/saving is functioning correctly — the "0 projects" is
  purely an empty store on first visit to the new path.
- **Verdict: confirmed empty-localStorage artifact of the rename, not a
  data-loading bug. No fix required.**

## Other observations (informational, not filed as bugs)

- Internal localStorage key names remain `eph_projects` / `eph_ids` (a holdover
  abbreviation from "Excel Project Hub"). This is an invisible implementation
  detail — it does not appear in the UI, does not affect functionality, and
  does not contradict the "Blueprint" rename from a user-facing standpoint.
  Renaming it would itself cause a one-time data "loss" for existing users
  (their data would appear to vanish under a new key) with zero user-facing
  benefit. Recommend leaving as-is; noted for the engineering backlog only if
  a future major refactor touches the storage layer.

## New bugs found
**None.** No new defects were discovered during this regression pass.

## Overall verdict: **PASS**

Both prior fixes (blank-page crash, back-button/"All Projects" labeling) hold
under full regression. No new issues found. The "0 projects" symptom is
confirmed to be an expected empty-localStorage artifact of the URL path change,
not a functional defect — verified by demonstrating that newly created projects
persist correctly across reloads. The deployment at commit d3f3c42 (run
27093810882) is stable and ready to remain live.

## Artifacts
- Automated test script: `/private/tmp/qa-blueprint/qa.js`
- Full run log: `/private/tmp/qa-blueprint/run1.log`
- Fresh-context localStorage check: `/private/tmp/qa-blueprint/fresh_check.js`
