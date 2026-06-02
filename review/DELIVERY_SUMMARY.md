# Session Recap — What Your Organisation Did Today
# Written by: Guide and Explainer
# Date: 2026-06-01

---

## What happened in one paragraph

Your organisation ran 12 parallel workstreams today covering your financial dashboard, your career, and your org chart. The engineering team found and fixed critical calculation bugs in the dashboard, stripped out all personal data so it is safe to share publicly, and pushed it to GitHub. Three specialist finance reviewers — a CA, a tax accountant, and an investment strategist — then assessed every section of the dashboard for accuracy and completeness. Separately, a career team of four specialists reviewed your portfolio website, your CV, your LinkedIn profile, and the UK job market and produced rewritten content you can use immediately. Finally, your org chart was redesigned from a broken SVG tree into a clean HTML layout showing all 90 agents with their names in full.

---

## The financial dashboard — what we found and fixed

### What was fixed (code)

- **UK income tax calculation was wrong.** It was applying only the 20% basic rate regardless of salary. It now correctly applies all three UK income tax bands (20%, 40%, 45%) with the correct boundaries.
- **Personal allowance taper above £100,000 was missing.** Now implemented correctly — your allowance reduces by £1 for every £2 earned over £100k.
- **Pension salary sacrifice was not reducing NI.** Fixed — your pension contribution now correctly reduces both your taxable pay and your National Insurance-able pay, as HMRC requires.
- **National Insurance above £50,270 was missing the 2% rate.** Fixed — it was only applying the 8% rate, ignoring the 2% rate on income above the upper earnings limit.
- **Net worth timeline chart was broken.** Missing imports meant the ULIP values were not feeding into the chart. Fixed.
- **Expense toggle did not save.** A missing function call meant switching an expense on or off did not persist. Fixed.
- **Dashboard debt gauge was hardcoded to Rs 36 lakh.** This meant anyone with a different loan amount saw the wrong gauge. Partially fixed — now reads from your actual loan data. One remaining instance in dashboard.js still needs fixing.
- **Store key mismatch.** Three data sections (tax tracker, monthly log, India log) were being stored under the wrong internal names, meaning they would silently fail to load. Fixed.
- **A latent bug found by the code reviewer in the load() function.** Would have returned empty data for any future page using camelCase key names. Fixed the same day.
- **All personal financial data removed from the source code.** The dashboard is now safe to share on GitHub with all fields zeroed out.
- **Dead legacy files deleted.** Two unused JavaScript files (charts.js, export.js) that served no function were removed.

---

### What CA Arjun Mehta said (the CA's verdict)

CA Arjun Mehta, a dual-qualified FCA with 25 years of UK and India practice, reviewed the entire dashboard and scored it **7 out of 10** — a strong result for a self-built tool. He specifically praised the PAYE calculation (especially the salary sacrifice treatment and personal allowance taper) as more accurate than most consumer software, and called the amortisation engine "professionally coded." His three most important findings: first, there is no India NRI tax module — for a dual-jurisdiction taxpayer this is a material gap, not a cosmetic one; second, there is no ISA, SIPP, or Lifetime ISA tracking, which means the most important UK tax-advantaged investment vehicles are entirely absent; third, the ULIP projections do not deduct fund management charges, mortality charges, or allocation charges, which means the projected values are likely overstated by 15–20% over a 20-year term.

---

### What the finance specialists found

**Tax Accountant — overall rating 5/10.** The PAYE calculation engine is now correct for standard UK employment, which is a genuine improvement. However, the tax section is too narrow for your actual situation. The biggest gaps: no fields for Indian income (NRE/NRO interest, any Indian rental income), no UK Self Assessment structure (no January/July payment-on-account calendar), no India ITR module, and no double tax relief tracker. The "Income Tax (20%)" label on the income waterfall chart also remains hardcoded — it shows 20% even when your salary would push you into the 40% band, which is misleading.

**Head of Investment Strategy — overall rating 5/10.** The ULIP projection engine is mechanically sound, and the fix to the net worth timeline (eliminating a pension double-count and adding ULIP compound growth) is a real improvement. But the investment section is missing the entire UK side of your portfolio: no ISA tracker, no SIPP, no Lifetime ISA. On the Indian side: no NPS, no ELSS, no PPF, no EPF, no Sovereign Gold Bonds. There is also no asset allocation analysis anywhere — no breakdown by equity/cash/fixed income, no UK vs India geographic split, no liquidity waterfall showing when each asset becomes accessible.

---

### What the engineers found

**Mobile audit.** The dashboard currently does not work on a phone. The sidebar navigation is hidden on screens narrower than 768px and there is no replacement — no hamburger menu, no bottom navigation bar. This means the entire 10-page app is unnavigable on any mobile device. This is the single most urgent fix. Additionally, every button, input, and form element is below Apple and Google's 44px minimum touch target, and iOS will auto-zoom the page whenever you tap an input field (a known iOS behaviour triggered by font sizes below 16px). The engineer provided specific CSS fixes for all 16 identified issues, ranging from trivial (one line of HTML) to one day of work for the navigation.

**Integration roadmap.** Two integrations are feasible immediately without any backend changes: a live GBP/INR exchange rate fetch using Frankfurter (a free ECB-sourced API — about one day of work, roughly 80 lines of code), and a CSV import for UK bank statements from Revolut, Monzo, Barclays, and Starling (about 5–7 days of work). Open Banking and HMRC API integrations are not feasible in a browser-only app — they require a backend to handle OAuth securely. The recommendation is to do the FX rate and CSV import first, and revisit the backend question only if those do not cover 90% of the practical need.

**Backend specification.** The backend architect produced a full spec for a cloud-sync backend in case you ever want multi-device access or the ability to share the dashboard with an accountant. The recommended stack is Hono (Node.js framework) + Supabase PostgreSQL + Cloudflare Workers, with end-to-end encryption so the server never sees your financial data in plaintext. Estimated cost: £0–£10 per year at personal-use scale. This is speculative — no backend exists yet, and the spec is there if and when you decide you need it.

---

## Your career — what the team found

### Your portfolio website

The portfolio is well above average in design and craft — the dark terminal aesthetic is on-brand for offensive security, it is technically sophisticated (JSON-LD schema, accessibility attributes, a print stylesheet), and the narrative connecting your infrastructure background to offensive security is coherent and differentiated. The two problems that matter: your headline calls you a "Junior Penetration Tester," which is a title you do not yet hold, and a UK hiring manager will notice the mismatch with your experience section within 10 seconds. The single most important content change is to add 2–3 real CTF or HackTheBox writeups and one sanitised pentest report — this converts "claims to do offensive security" into "demonstrably does offensive security," which is what actually gets junior pentesters hired.

### Your CV

The CV is UK-compliant, two pages, well-quantified on the IT side (the 35% query resolution, 80% fewer escalations, and 250+ devices numbers are strong), and ATS-decent. The biggest gaps on the offensive side: the professional summary buries your credentials (GCHQ MSc and CEH should hit first, not last), the skills section is missing named tools that ATS systems explicitly filter for (Nmap, Metasploit, Wireshark, Nessus, Kali, PowerShell), and the portfolio URL is not on the CV at all. The CV Specialist rewrote the professional summary leading with your GCHQ MSc and CEH, restructured the skills block into four ATS-safe groups (Offensive, Tools, Infrastructure, Programming), and rewrote the key bullet points for each role with the security content leading rather than the support tasks.

### Career strategy

The recommended path is a two-track job search: apply simultaneously to Security Analyst and SOC Analyst roles (high success probability — your AD and endpoint background directly qualifies you) and Junior Penetration Tester roles (competitive stretch, but your MSc and CEH genuinely qualify you to apply). Take the first credible security-titled offer, because any security title removes the "transitioning" hedge from every future application. Complete eJPT in the next 4–8 weeks (it is already in progress and costs nothing more), then treat OSCP as the year's flagship goal — it is the single certification that most changes hireability for pentest roles in the UK and typically unlocks a £10,000–£20,000 salary increase at the next role. Near-term salary target: £30,000–£42,000 in London; £40,000–£55,000 within 12–18 months post-OSCP.

### LinkedIn

The most important single change is the headline. Option A, recommended for maximum search hits right now: "Junior Penetration Tester | CEH Certified | MSc Applied Cyber Security (GCHQ) | Web App Security | Active Directory | TryHackMe | Targeting Red Team | Open to Work." The LinkedIn Specialist also wrote a complete About section, identified the 20 most search-relevant skills in priority order (Penetration Testing and Vulnerability Assessment should be first and second), and produced a 30-day content calendar with 12 specific post hooks — each designed to establish credibility without looking like a student posting study notes.

### The UK job market

The current realistic salary range for your profile is £28,000–£38,000 for a first security-titled role in London, with the GCHQ MSc and CEH justifying the upper half of that band. The top three companies to target right now, based on profile fit and realistic hiring probability, are: KPMG UK Cyber Security (strong academic profile fit, graduate programme, apply now), NCC Group (one of the UK's largest security consultancies with a genuine junior development programme), and BAE Systems Applied Intelligence (GCHQ accreditation is explicitly valued, they sponsor SC clearance — the sooner you apply, the sooner that clock starts). BT Group is also a strong target given your Concentrix/BT background. Deloitte Cyber is worth applying to now for their analyst intake.

---

## The org chart — redesigned

The org chart in your monitoring dashboard was rebuilt from scratch, replacing an SVG tree that was unreadable at 90 agents (names were truncated and the layout required heavy horizontal scrolling) with a plain HTML/CSS layout. All 90 agents now display with their full names, grouped into 21 colour-coded department clusters in a 3-column vertical grid. The VP Engineering reviewed the implementation against all five acceptance criteria and approved it for release.

---

## What needs your decision now

1. **Mobile navigation for the financial dashboard.** The app is currently unusable on a phone. The engineer has the fix ready — the design decision is whether to implement a bottom navigation bar or a hamburger drawer. This is the top priority.

2. **Live FX rate fetch.** About one day of work, no backend needed. Would keep your GBP/INR rate automatically current rather than requiring manual updates. The full implementation spec is ready to go.

3. **CSV bank statement import.** The highest-value integration available without a backend — eliminates most manual expense entry. About 5–7 days of work. Supports Revolut, Monzo, Barclays, Starling. Do you want this in the next sprint?

4. **India NRI tax module — urgency flag.** CA Arjun Mehta flagged the 31 July Indian ITR deadline. Before the dashboard build is complete, do you want the Tax Accountant to advise on your India filing obligations separately — specifically the Section 80E deduction on your SBI loan interest, which may be claimable for prior years?

5. **ISA allowance check.** The CA flagged this as use-it-or-lose-it at 5 April. Confirm whether you have used any of the current year's £20,000 ISA allowance. If not, the Head of Investment Strategy needs to advise before the tax year ends.

---

## What the team will do next (awaiting your go-ahead)

1. Implement mobile navigation for the financial dashboard (the app is unusable on phones without this).
2. Implement the live GBP/INR exchange rate fetch (one day, no backend, full spec already written).
3. Implement CSV bank statement import (5–7 days, eliminates manual expense entry).
4. Fix the two remaining known code issues: the dashboard.js hardcoded Rs 36 lakh debt gauge, and the fallback rate inconsistency (83 vs 125) across page files.
5. Apply the CV rewrite, skills restructure, and portfolio URL addition to your live CV file.
6. Update your LinkedIn headline and About section using the drafted copy.
7. Publish 2–3 CTF/HTB writeups to the portfolio — the single highest-ROI career action.
8. Begin designing the India NRI tax module for the dashboard (Section 80E calculator, ITR filing obligation tracker, double tax relief tracker).

---

## One thing you should do today

**Finish the eJPT.** It is already in progress, it costs nothing more, and completing it removes the "theory-only" perception that is the main objection to your offensive security applications right now. Every week it stays in progress rather than on your CV is a week your applications are weaker than they need to be. Everything else — the writeups, the OSCP, the job applications — is easier and more credible once that first practical certification is done.
