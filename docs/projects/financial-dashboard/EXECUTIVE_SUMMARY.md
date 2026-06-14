# Finance Dashboard — Executive Summary
# Reviewed by the full organisation
# Date: 2026-05-31

## What this project is

A personal finance dashboard built entirely in vanilla JavaScript with no framework, no backend, and no third-party data access — all financial data stays on your device, encrypted at rest using AES-256-GCM. It is purpose-built for your specific financial situation: a UK salary in GBP, an SBI education loan in INR, three ULIP insurance investments, an HMRC tax underpayment tracker, and cross-currency net worth projection from age 25 to 50. The tech stack is HTML/CSS/ES Modules with a Service Worker acting as an in-memory crypto vault and Chart.js for all visualisations.

---

## Overall health scores

Architecture:    6/10 — Defensible MPA design with a sophisticated SW crypto vault, but real key material sits in sessionStorage and personal financial data is hardcoded in the source.
Code quality:    6/10 — The financial calculation engine (calc.js) is excellent, but two codebases exist simultaneously, four confirmed runtime bugs, and chart constants are duplicated across 11 files.
Security:        4/10 — AES-256-GCM encryption is genuinely strong, but three critical findings collectively make the encryption bypassable: the raw key in sessionStorage, credential hashes in committed source, and lockout stored in localStorage.
Testing:         1/10 — Zero tests of any kind across the entire codebase; financial calculations used for real monetary decisions have no automated verification whatsoever.
DevOps/Deploy:   2/10 — No CI/CD, no hosting configuration, no security headers, no SRI on CDN scripts, no deployment process of any kind documented.
Product/UX:      6/10 — Outstanding depth for your specific situation (ULIP projections, amortisation simulator, tax tracker), but the onboarding is broken for any other user and key features like multiple debt support and transaction import are missing.
Compliance:      5/10 — Acceptable as a personal tool under the GDPR household exemption, but real personal financial data is hardcoded in defaults.js which constitutes a data breach if the repository is ever shared publicly.
Overall:         4/10

---

## What Atharva has built well

The financial calculation engine in `js/calc.js` is the standout file in the entire codebase. The amortisation schedule with overpayment simulation, the ULIP three-scenario projection, the two-phase wealth progress formula (with a documented comment explaining the exact bug it fixed), and the net pay calculator are all correct, well-commented, and structured as pure functions with no DOM dependencies — genuinely testable and well-designed.

The Service Worker crypto vault design is sophisticated for a personal project. PBKDF2 at 600,000 iterations, AES-256-GCM with random IVs per write, and using the SW as a key escrow that survives page navigations is a thoughtful architecture. The brute-force lockout with exponential backoff, and the timing-attack resistance (computing both username and password hashes in parallel before comparison) are details most personal projects never bother with.

The feature depth for your exact situation is exceptional. The SBI loan page — with full amortisation, overpayment slider, payoff comparison table, and the "Debt vs Assets Race" crossover chart — is the kind of analysis a financial advisor would charge for. The ULIP milestone projection with three rate scenarios per product, and the scheduled expense changes feature (where a future contract change automatically flows into projections) are features that no mainstream personal finance app provides.

The CSS architecture is clean. Three files with clear separation of concerns (`theme.css`, `layout.css`, `components.css`), a comprehensive custom property system, and consistent dark-theme execution across all 13 pages.

---

## The single most critical issue right now

**`js/defaults.js` contains your real personal financial data in plaintext, committed to the repository.**

This file contains your exact base salary (£28,000), your SBI education loan balance (₹2,752,000 at 9.9%), your pension provider and current value (Standard Life, £1,690), three ULIP policy names and current values (SUD Life, PNB MetLife, Axis Max Life), your Revolut savings balance, your HMRC tax code (1034L) and underpayment amount (£456), and month-by-month payslip notes. This data is not encrypted — it is in a plain JavaScript file in your source tree.

If you ever push this repository to GitHub, share it with anyone, or host it on a public URL, this constitutes a personal data breach under GDPR Article 33 regardless of the fact that it is a personal tool. It would also make the application's encryption meaningless for any attacker who simply reads the source.

**What to do:** Replace every real value in `defaults.js` with clearly fictional placeholders (salary: 0, loan: 0, pension: 0). Your real values are already stored in encrypted localStorage — the defaults file only matters for a first run on a new device, and even then you should enter your values fresh rather than having them embedded in source.

This is a two-hour fix. It needs to happen before you share this code with anyone.

---

## Top 10 improvements in priority order

1. **Replace real personal data in `js/defaults.js` with fictional zeros** — Data breach risk if repo is ever shared publicly; the actual values are in encrypted localStorage already so nothing breaks; two hours of find-and-replace work. See COMPLIANCE_REVIEW.md, ARCHITECTURE_REVIEW.md, SECURITY_REVIEW.md.

2. **Remove the raw AES key from `sessionStorage`** — `login.html` line 341 stores the raw AES-256 key as base64 in `sessionStorage._ek`; any XSS or browser extension with site access can call `sessionStorage.getItem('_ek')` and decrypt all your financial data in 60 seconds without knowing your password; fix: set `extractable: false` on the derived key and accept a re-authentication prompt when the SW is terminated instead. See SECURITY_REVIEW.md (F-02), ARCHITECTURE_REVIEW.md (Weakness 1).

3. **Fix the four confirmed runtime bugs before they cause data loss** — (a) `expenses.js` line 108: `await save_` should be `await save_()` — expense active/inactive toggles silently do not save; (b) `networth.js` lines 211-215: `ulipValueGBP` and `ulipPremiumGBP` are called but not imported — the net worth projection crashes for any user with ULIP investments; (c) `settings.js` lines 2/227: imports `changePassword` and `getEncKey` from `auth.js` where neither is exported — password change will throw a silent crash; (d) `analytics.js` line 325: chart created without the `getCtx` destroy-wrapper, causing "canvas already in use" errors on repeated navigation. See CODE_REVIEW.md (Bugs 1-4).

4. **Move credential hashes out of committed source** — `auth.js` lines 6-12 contains the PBKDF2 salts and hashes that ship to every visitor; an attacker can run an offline dictionary attack with no rate limiting or lockout; `auth-config.js` is gitignored but contains duplicates; the solution is one gitignored file only, and in `auth.js` load it dynamically rather than hardcoding; medium effort (1 day) but important before any hosting. See SECURITY_REVIEW.md (F-01), ARCHITECTURE_REVIEW.md (Weakness 2).

5. **Add Subresource Integrity (SRI) and a Content Security Policy (CSP)** — four CDN scripts (Chart.js, XLSX, jsPDF, html2canvas) load without `integrity` attributes, meaning a CDN compromise would execute in the same origin as your session key; there is no CSP on any of the 13 HTML pages; adding SRI hashes and a `Content-Security-Policy` meta tag with `connect-src 'none'` would prevent XSS from phoning home; two to four hours of work. See SECURITY_REVIEW.md (F-04, F-05), DEVOPS_REVIEW.md.

6. **Delete `js/ui.js` and `js/charts.js` (dead code)** — `ui.js` is 930 lines of the old single-page architecture that will crash on import (it imports `isAuthenticated`, `logout`, `startInactivityTimer` from `auth.js` — none of which are exported); `charts.js` is similarly superseded; their presence creates confusion about which code is live and wastes maintenance effort; deleting them removes the confusion at zero functional cost. See CODE_REVIEW.md (Section 3, Refactor 1).

7. **Consolidate chart constants into `chart-theme.js`** — the `C` colour object, `baseOpts`, and `getCtx()` helper are copy-pasted across 11 files with minor inconsistencies (tooltip colour `#8099b3` vs `#7a96b3` vs `#8e9099`); `chart-theme.js` already exists for exactly this purpose but is imported by nothing; wiring up the imports eliminates ~80 lines of duplicate constant definitions and means colour changes are made in one place; three to four hours. See CODE_REVIEW.md (Section 5).

8. **Write unit tests for `js/calc.js`** — this file drives every financial metric on every page, is used for real monetary decisions, and has zero tests; the QA review identified eight high-risk calculation paths including a division-by-zero on `inrGbpRate=0` that produces `Infinity` across the entire net worth timeline, and a hardcoded ₹36L loan constant in `loanPaidToDate` that is wrong for any other loan amount; the QA review includes complete runnable Jest test cases ready to copy in; setup time is under 30 minutes. See QA_REVIEW.md (Sections 2, 3, 8).

9. **Set up CI/CD on Cloudflare Pages** — there is no deployment infrastructure, no security headers, no linting gate, no hosting configuration; the DevOps review includes a complete, runnable GitHub Actions workflow with HTML/CSS/JS linting, SRI checking, Lighthouse audits, and Cloudflare Pages deployment; adding the `_headers` file with CSP and HSTS and creating `.github/workflows/ci-cd.yml` takes one focused day and makes every future change auditable. See DEVOPS_REVIEW.md (Sections 3, 6).

10. **Add an onboarding wizard for first-time setup** — the current first-run experience shows your personal financial data to any new user; there is no registration flow, no guided setup, and no way for a new person to know what to fill in; a five-step wizard (profile, income, expenses, assets, goals) would reduce setup from "30 minutes hunting through 11 settings tabs" to "10 minutes of guided questions" and would be the prerequisite for sharing the tool with anyone else. See PRODUCT_REVIEW.md (Section 4, Improvement #1).

---

## If you do nothing else, do these three things

**1. Zero out `js/defaults.js` today.** Your salary, your SBI loan balance, your pension, your tax code — all of it is sitting in plaintext in a file that ships with the code. Two hours of work. The risk is not theoretical: if you ever share this repo, that data is public. Your real values are already safe in encrypted localStorage on your device; the defaults file is just a convenience for first run that does not need your real numbers.

**2. Fix the `expenses.js` checkbox bug (`await save_` → `await save_()`).** This is a one-character fix that is actively losing your data right now. Every time you toggle an expense as active or inactive, the change renders on screen but does not persist — the next page load will revert it. This has probably already caused confusion. Find line 108 of `js/pages/expenses.js` and add the missing parentheses.

**3. Fix the `networth.js` missing imports before you next open that page.** `ulipValueGBP` and `ulipPremiumGBP` are called but not imported. The next time you navigate to the Net Worth page, the projection will crash with a `TypeError` if you have ULIP investments (which you do). Add the missing imports to the import statement at the top of `js/pages/networth.js`.

These three items together take under two hours and address real data exposure, silent data loss, and a page crash.

---

## What this could become

The financial modelling capability here — amortisation with overpayment simulation, ULIP projection with three rate scenarios, cross-currency net worth trajectory, scheduled expense changes — is genuinely better than anything available in mainstream personal finance apps. YNAB does not do investment depth. Emma does not do loan modelling. No consumer app handles ULIPs or Indian instruments. The Sankey cash flow diagram and the Debt vs Assets Race chart are sophisticated visualisations that paid tools do not offer.

To become a product used by others, four things would need to happen:

First, the personal data (defaults.js) and credential hashes (auth.js) need to come out of source and the onboarding needs to work for a stranger. Currently someone receiving this code sees your finances and cannot log in without reading the source.

Second, the Debts page needs to support multiple debts. The entire page is hardcoded to a single `sbi` object. Anyone without exactly this loan gets nothing from the Debts page.

Third, there needs to be some form of transaction tracking or CSV import. Right now the app is a projection tool, not a ledger. The budget vs actuals chart on the Analytics page compares two estimates because there are no actuals.

Fourth, a mobile-responsive layout. The sidebar-first desktop layout does not work on a phone, and personal finance is primarily a mobile behaviour.

With those four things addressed — which represents roughly three months of focused engineering — this becomes a niche but genuinely differentiated product for UK professionals with cross-border finances: international students who moved to the UK, UK workers with Indian family financial ties, anyone holding ULIPs alongside a UK salary. That is a real market with no good existing solution.

Monetisation path: freemium at £5-8/month for CSV import, multiple debts, and cloud backup. The local-first, no-data-selling model is the core differentiator and must be preserved — it is precisely why the product is trustworthy for financial data.

---

## Estimated total effort to reach production quality

**Quick wins (under 2 hours each):**
- Zero out `js/defaults.js` with fictional placeholders
- Fix `expenses.js` checkbox save bug (`await save_` → `await save_()`)
- Fix `networth.js` missing ULIP function imports
- Fix `settings.js` broken `changePassword` import
- Delete `js/ui.js` and `js/charts.js` (dead code)
- Add `try/catch` around JSON import and Excel export
- Move `auth-config.js` deletion and consolidate credential hashes to one gitignored file
- Add SRI hashes to the four CDN script tags (run through srihash.org)

**Medium work (1–3 days each):**
- Remove raw AES key from `sessionStorage` — redesign the SW recovery path (1-2 days, needs design decision)
- Add CSP meta tags to all 13 HTML pages (1 day)
- Consolidate chart constants into `chart-theme.js` (1 day)
- Write `calc.js` unit tests — the QA review includes ready-to-run Jest test cases (1 day)
- Set up Cloudflare Pages with `_headers` and GitHub Actions CI/CD pipeline — full YAML is in DEVOPS_REVIEW.md (1-2 days)
- Add JSDoc type annotations to `calc.js` and `store.js` (2-3 days)
- Fix `inrGbpRate` and `wealthTargetGBP` duplication in `fin_profile` / `fin_settings` (half day)
- Lockout escalation cap in `auth.js` to prevent permanent lockout from corrupted counter (half day)

**Major work (1+ week each):**
- Refactor Debts page from single `sbi` object to `items: []` array supporting multiple debts (1 week)
- Build onboarding wizard for first-time users (1-2 weeks)
- CSV transaction import and actuals vs budget tracking (2-3 weeks)
- TypeScript migration for full type safety (2-3 weeks)
- Mobile-responsive layout (1-2 weeks)
- Cloud backup with server-side encrypted sync (3-4 weeks)

**Total honest estimate:** The critical security and bug fixes are 1-2 focused days of work. Reaching a clean, well-tested, deployable personal tool (your use only, no backend) is 2-3 weeks of part-time work. Reaching a product ready to share with other users is 3-4 months of engineering.
