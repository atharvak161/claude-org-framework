# COMPLIANCE REVIEW — Financial Dashboard
**Prepared by:** Compliance Auditor  
**Date:** 2026-05-31  
**Project path:** `/src/projects/financial-dashboard/`  
**Status:** DRAFT — requires legal review before use in production

---

## EXECUTIVE SUMMARY

The financial dashboard is a client-side personal finance management application. In its current form it is a **single-user, locally-deployed personal tool** — all data is stored encrypted in `localStorage` on the user's own device and never transmitted to a server. This architecture substantially limits the scope of certain data protection obligations. However, the application contains hardcoded default values that include what appear to be real personal financial data (salary, debt figures, pension values, tax codes, specific bank products and amounts), which creates specific and serious compliance risks if the codebase is published publicly or shared.

This review addresses the application's current state and what would apply if it were expanded into a multi-user product or integrated with live banking APIs.

---

## 1. GDPR OBLIGATIONS — PERSONAL FINANCIAL DATA

### Data being collected or stored

The application stores the following categories of data in encrypted `localStorage`:

| Key | Data Category | Sensitivity |
|-----|--------------|-------------|
| `fin_profile` | Name, age, target wealth, INR/GBP rate | Personal data |
| `fin_income` | Base salary (£28,000 default), overtime, tax code (`1034L`), pension rates, underpayment amounts | Special financial — highly sensitive |
| `fin_expenses` | All monthly outgoings by category and name | Personal financial |
| `fin_debts` | SBI Education Loan outstanding balance (₹2,752,000), interest rate, EMI | Special financial — highly sensitive |
| `fin_investments` | Pension provider (Standard Life), current value (£1,690), ULIP names, insurers, premiums and current values | Financial product data — highly sensitive |
| `fin_goals` | India trip savings plan, emergency fund target, wealth target age | Personal financial plans |
| `fin_monthly_log` | Monthly net income, savings, notes including payslip details | Payslip-level financial data |
| `fin_settings` | Display preferences, timeout, chart parameters | Preference data |
| `fin_tax_tracker` | Tax code, underpayment amount (£456), deduction schedule | HMRC tax data — highly sensitive |
| `fin_india_log` | Month-by-month trip savings | Personal financial |

**GDPR Classification:** All of the above constitutes "personal data" under Article 4(1) GDPR as it relates to an identified or identifiable natural person. Salary, tax, debt, pension, and insurance product data constitutes highly sensitive financial personal data. While not a "special category" under Article 9, financial data carries equivalent risk of harm (discrimination, fraud, identity theft, financial abuse) and triggers heightened obligations under Article 25 (data protection by design) and Article 32 (security of processing).

### Applicable GDPR Articles

**Article 4 — Definitions**  
The data stored clearly meets the definition of personal data. The "controller" is the individual running the application (currently a single user — the owner). If the app is offered to other users, the developer becomes the controller.

**Article 5 — Principles relating to processing**  
- **(a) Lawfulness, fairness, transparency:** Currently there is no privacy notice, no consent mechanism, and no information provided to the user about how their data is processed. If the current sole user is also the developer/controller, self-processing requires no consent, but the principle of transparency still applies if others are onboarded.  
- **(b) Purpose limitation:** The data is collected for personal financial tracking only. The export functionality (Excel/PDF/JSON) means data can leave the encrypted store to unprotected files on the user's local machine. This is technically still within purpose but creates a risk surface.  
- **(c) Data minimisation:** The `defaults.js` file contains what appear to be real personal values (specific salary of £28,000, real loan balance of ₹2,752,000, real tax code 1034L, named providers including Standard Life, SUD Life, PNB MetLife, Axis Max Life, specific ULIP values). These defaults are visible in plaintext in source code. If committed to a public repository, this would be a data breach under Article 33/34 GDPR. **This is the most urgent compliance finding in this review.**  
- **(d) Accuracy:** No mechanisms exist to validate or correct data; user is responsible. Acceptable for a personal tool.  
- **(e) Storage limitation:** There is no data retention policy, no automatic deletion, no expiry on `localStorage` keys. Data persists indefinitely until the user manually resets or clears browser storage. This does not comply with the storage limitation principle.  
- **(f) Integrity and confidentiality:** AES-256-GCM encryption via the Service Worker vault is implemented. See Section 6 for full assessment.

**Article 6 — Lawful basis**  
For a single-user personal tool where the data subject is the controller, Article 6(1)(b) (processing necessary for performance of a contract/self-interest) or Article 6(1)(f) (legitimate interest of the data subject) would apply. For a product offered to others, Article 6(1)(a) (consent) or 6(1)(b) (contract) would be required, with a full privacy notice.

**Article 13 — Information to be provided (data collected directly)**  
Currently no information notice exists. If deployed to other users, the controller must provide: identity and contact details, purposes and legal basis, retention periods, data subject rights, right to withdraw consent, right to lodge a complaint with the ICO.

**Article 25 — Data protection by design and by default**  
The encryption architecture (AES-256-GCM, PBKDF2 key derivation at 600,000 iterations) represents a meaningful implementation of privacy by design. The Service Worker crypto vault is a genuinely strong design choice. However, the key is stored in cleartext (as raw bytes) in `sessionStorage` under the key `_ek` — see `login.html` line 341 and `page-init.js`. This partially undermines the security model.

**Article 30 — Records of processing activities**  
Not applicable at present (single user, no organisation). Would be mandatory if deployed as a product to 250+ users or if high-risk processing occurs.

**Article 32 — Security of processing**  
Detailed in Section 6 below.

**Article 33/34 — Breach notification**  
Not applicable for a single-user personal tool. If deployed as a product, any breach affecting others' data must be reported to the ICO within 72 hours.

---

## 2. PRIVACY POLICY

### Current state
There is no privacy policy in any HTML file, no cookie notice, no consent banner, and no data processing notice anywhere in the application. A search across all HTML pages (`login.html`, `dashboard.html`, `settings.html`, `export.html`, and all section pages) confirms zero privacy-related UI elements.

### Is one required?
**For current use as a personal single-user tool:** A formal privacy policy is not legally required where the sole user is also the controller. GDPR's household exemption (Recital 18) applies when data processing is "purely personal or household activity."

**If offered to other users as a product:** A privacy policy becomes mandatory under Article 13 GDPR and, in the UK, under the UK GDPR as retained post-Brexit. It must contain:

1. **Identity and contact details of the controller** — name, address, email
2. **Contact details of a Data Protection Officer** — required if processing financial data at scale under Article 37
3. **Purposes and legal basis for each processing activity** — e.g., "We store your salary data to calculate take-home pay; legal basis: contract performance"
4. **Legitimate interests pursued** — if relying on Article 6(1)(f)
5. **Recipients or categories of recipients** — any third parties who receive data (CDN providers serving Chart.js, jsPDF, XLSX libraries — these currently load from `cdnjs.cloudflare.com` and `cdn.jsdelivr.net`)
6. **International transfers** — if CDN providers are US-based (Cloudflare is), this triggers Article 46 safeguards or Article 49 derogations
7. **Retention period or criteria for determining it**
8. **Data subject rights** — Articles 15–22 (access, rectification, erasure, restriction, portability, objection)
9. **Right to withdraw consent**
10. **Right to lodge a complaint with the ICO** (UK) or relevant supervisory authority
11. **Whether provision is a statutory/contractual requirement**
12. **Existence of automated decision-making or profiling** — the tax and net worth calculators perform automated financial assessments; whether these meet the Article 22 threshold depends on whether the output is used to make decisions that significantly affect the user

---

## 3. DATA RETENTION

### Current retention model
All financial data is written to `localStorage` with no expiry, no TTL, and no automatic deletion. The `store.js` module writes encrypted blobs under keys prefixed `fin_`. The `reEncryptAll()` function in `store.js` supports re-encrypting all keys (for a future password change feature) but there is no deletion logic for aged records.

**Monthly log entries** (`fin_monthly_log`) accumulate indefinitely. The `fin_india_log` similarly has no ceiling. Over time, detailed month-by-month income and savings records build an extensive financial history.

**Auth attempt tracking** (`auth_attempts`, `auth_lockout_until`, `auth_lockout_count`) persists in `localStorage` and is only cleared on successful login or a major migration event (`fd_v2_hardcoded_2026`).

### Is indefinite retention appropriate?
Under Article 5(1)(e) GDPR, data must be kept "no longer than is necessary." For a personal financial dashboard, retaining years of monthly logs is arguably within purpose — the user benefits from historical data for trend analysis. However:

- There is no mechanism for the user to delete individual records
- There is no data ageing or archiving strategy
- There is no indication given to the user of what is being retained

### Recommendations
- Implement a configurable retention window for `fin_monthly_log` and `fin_india_log` (e.g., configurable in Settings)
- Provide an explicit "delete all data" feature (the reset-to-defaults button in `export.html` partially satisfies this but it replaces data with defaults rather than deleting it)
- Document that `localStorage` data persists until explicitly cleared, and that clearing browser data also deletes financial records

---

## 4. DATA SUBJECT RIGHTS

### Article 15 — Right of Access
**Partially supported.** The user can view all their data through the dashboard UI. There is no formal "export all data about me" mechanism in the GDPR sense (a structured, machine-readable complete record of all stored personal data). The JSON export button in `export.html` exports the raw encrypted backup, not a plaintext record of all personal data. The Excel export (`export.js`) covers all categories in human-readable form and could serve as a Subject Access Request response for a single-user tool.

**Gap:** No formal SAR handling process. For a multi-user product, a defined process within 30 days (Article 12) would be mandatory.

### Article 16 — Right to Rectification
**Supported.** All data is editable through the Settings page. The settings UI allows modification of all stored fields.

### Article 17 — Right to Erasure ("Right to be Forgotten")
**Partially supported.** The "Reset to defaults" button in `export.html` wipes and replaces all `fin_` keys. The `initializeDefaults()` function in `store.js` is called on reset. However, this replaces with defaults rather than deleting the keys outright. The `reEncryptAll()` function iterates all `fin_` keys but there is no `deleteAll()` equivalent.

There is no per-record deletion (e.g., delete a single monthly log entry or a single expense item) exposed in the UI for all sections. Expenses appear to have delete capability; other sections need review.

**Gap for multi-user product:** Right to erasure must cover all storage locations including backups. Since this app uses only `localStorage`, complete erasure on reset is achievable but the current implementation leaves default values rather than null/empty state.

### Article 18 — Right to Restriction of Processing
**Not implemented.** No mechanism to restrict processing while data is disputed or pending verification. For a personal tool this is a non-issue. For a product, a "pause processing" flag would be needed.

### Article 20 — Right to Data Portability
**Partially supported.** The JSON export (`data-export-btn` in `export.html`) exports the raw encrypted store. The Excel export provides a complete, structured, human-readable export across all 10 data categories. However, the JSON export exports encrypted ciphertext, not portable plaintext JSON, which is not compliant with Article 20's requirement for data in "a commonly used and machine-readable format."

**Gap:** A plaintext JSON export of all user data (decrypted) should be available. The encrypted JSON backup is useful for application-level portability but does not satisfy GDPR Article 20.

### Article 21 — Right to Object
**Not applicable** for a single-user personal tool where legal basis is not legitimate interest of a third party. Relevant only for multi-user product processing based on Article 6(1)(f).

### Article 22 — Automated Decision-Making
The tax calculator, net worth projector, and amortisation schedule generator perform automated financial calculations. These do not constitute automated decision-making "which produces legal effects concerning him or her or similarly significantly affects him or her" in the Article 22 sense — they are informational displays. No formal Article 22 safeguards are currently required.

---

## 5. UK OPEN BANKING AND REGULATORY REQUIREMENTS

If this application were extended to connect to real banking data via Open Banking APIs, the following regulatory requirements would apply in the UK:

### FCA Authorisation
Under the Payment Services Regulations 2017 (implementing PSD2 in UK law), any entity providing **Account Information Services (AIS)** — which is exactly what this dashboard would be doing (aggregating account data to display to the user) — must be:

- **Registered** as an Account Information Service Provider (AISP) with the FCA, or
- **Authorised** as a Payment Institution if also providing payment initiation services

This is a minimum legal prerequisite. An individual cannot deploy an AISP service without FCA registration. The FCA registration process requires: safeguarding arrangements, security policies, business continuity plans, fit and proper assessment of directors, and capital requirements. **This application, in its current architecture, cannot be legally used with live Open Banking APIs without FCA registration.**

### Open Banking Standards (OBIE)
UK Open Banking is governed by the Open Banking Implementation Entity (OBIE) standards. AISPs must:

- Use OAuth 2.0 / OpenID Connect for customer authentication with the bank
- Use the standardised Open Banking API specifications (v3.1.x)
- Implement Strong Customer Authentication (SCA) per PSD2 Article 97
- Maintain a Qualified Website Authentication Certificate (QWAC) or equivalent
- Comply with OBIE's security profile (FAPI — Financial-grade API)

None of these are currently implemented. The application uses a local PBKDF2/AES-256 authentication system which is entirely separate from any bank-grade OAuth flow.

### PSD2 Obligations
Even post-Brexit, UK law retains PSD2 obligations via the PSRs 2017. Key requirements for an AISP:

- **PSR Regulation 67/68:** Customer must give explicit consent for each account access; consent must be revocable
- **PSR Regulation 69:** Access limited to data necessary for the service; no storage of payment credentials
- **PSR Regulation 70:** Data must only be used for purposes the customer has consented to
- **Regulation 71:** Mandatory security incident reporting to the FCA within 4 hours
- **Article 95 PSD2 (Regulation 98 PSRs):** Strong Customer Authentication — at minimum two independent authentication factors (inherence, possession, knowledge)

### GDPR — Enhanced Obligations for Financial Data
Open Banking data (account balances, transaction histories, regular payments) is not a special category under Article 9 GDPR but is treated as high-risk under Article 35. A **Data Protection Impact Assessment (DPIA)** would be **mandatory** before processing begins.

### FCA Consumer Duty (PS22/9, effective July 2023)
Any firm offering financial services products to retail consumers must comply with the Consumer Duty, which requires:

- Delivering good outcomes for retail customers
- Providing clear, helpful, fair information
- Providing products that meet customers' needs
- Providing adequate customer support

This would apply if the dashboard were offered as a consumer-facing product.

### Financial Promotions
Under Section 21 FSMA 2000, communicating a financial promotion requires FCA authorisation or approval by an authorised person. If the dashboard were marketed with projected returns (the ULIP projections showing conservative/expected/aggressive scenarios are visible in the UI and in exported Excel files), this could constitute a financial promotion.

---

## 6. COMPLIANCE GAPS FOR PRODUCT LAUNCH

The following gaps must be resolved before this application could be offered to other users as a product:

### Critical (blocker for launch)

**GAP-01 — Personal data hardcoded in defaults.js**  
`js/defaults.js` contains what appear to be real personal financial values: salary of £28,000, SBI loan balance of ₹2,752,000 at 9.9% interest, Standard Life pension value of £1,690, specific ULIP products and values, tax code 1034L, underpayment of £456, monthly log entries with specific dates and payslip notes. If this file is in a public repository or shared with any third party, it constitutes a personal data breach under Article 33 GDPR. **All real personal values must be replaced with clearly fictional placeholder values before the repository is shared publicly.**  
*Observed in:* `js/defaults.js` lines 5–193

**GAP-02 — Encryption key stored in sessionStorage as cleartext**  
After successful login, `login.html` exports the AES-256 key to raw bytes and stores it in `sessionStorage` under key `_ek` (line 341: `sessionStorage.setItem('_ek', btoa(...))`). The `page-init.js` `_recoverKey()` function then re-imports this on each page navigation. `sessionStorage` is accessible to all JavaScript running in the same origin tab and survives page navigations within the same tab. Any XSS vulnerability or malicious browser extension could extract this key and decrypt all stored financial data. This partially undermines the AES-256 encryption model.  
*Observed in:* `login.html` line 341, `js/page-init.js` lines 15–31

**GAP-03 — No privacy policy or information notice**  
There is no privacy notice, no data processing disclosure, and no cookie/localStorage consent notice anywhere in the application. For multi-user deployment, Article 13 GDPR requires this information to be provided at the point of data collection.

**GAP-04 — No GDPR-compliant plaintext data export (Article 20)**  
The JSON export function exports encrypted ciphertext. It does not satisfy the right to data portability. A decrypted, human-readable JSON export must be provided.

**GAP-05 — Third-party CDN dependencies without user notice**  
All external libraries (Chart.js from `cdnjs.cloudflare.com`, jsPDF from `cdnjs.cloudflare.com`, html2canvas from `cdnjs.cloudflare.com`, XLSX from `cdn.jsdelivr.net`) are loaded from US-based CDNs. These CDN requests expose the user's IP address and browser fingerprint to third-party processors. Under GDPR, these are third-party processors requiring either consent or a legitimate interest assessment. No data processing agreements (DPAs) with CDN providers are documented. No Subprocessor Registry exists.

### High Priority (must resolve before any user testing with real data)

**GAP-06 — No data retention policy**  
`fin_monthly_log` and `fin_india_log` accumulate indefinitely. No TTL, no archiving, no user-facing retention controls exist. Article 5(1)(e) requires data to be kept no longer than necessary.

**GAP-07 — Auth lockout state stored in localStorage**  
`auth_attempts`, `auth_lockout_until`, and `auth_lockout_count` are stored in `localStorage`. On a shared device, a different user could inspect or manipulate these values using browser developer tools, bypassing the lockout mechanism. `sessionStorage` would be preferable, though it would reset the counter on each tab close.

**GAP-08 — No DPIA for financial data processing**  
Financial data processing (income, debts, investments, tax underpayments) is high-risk personal data. Article 35 GDPR and the ICO's guidance on high-risk processing require a Data Protection Impact Assessment before processing begins in any context other than a purely personal household use case.

**GAP-09 — No Content Security Policy (CSP)**  
None of the HTML pages define a `Content-Security-Policy` header or meta tag. For an application holding encrypted financial keys and sensitive data in memory, a strict CSP is essential to prevent XSS exfiltration of the session key from `sessionStorage`.

**GAP-10 — Service Worker scope and cache**  
The Service Worker (`sw.js`) currently handles only the crypto vault (no fetch interception). However, `skipWaiting()` and `clients.claim()` are called on install/activate. If a future update adds fetch handling or caching, financial data could inadvertently be stored in the SW cache. A documented SW update and cache policy is needed.

### Medium Priority (required for ongoing compliance)

**GAP-11 — No incident response plan**  
There is no documented procedure for responding to a data breach, XSS incident, or key compromise. For a product, Article 33 GDPR requires a 72-hour breach notification to the ICO.

**GAP-12 — No Terms of Service**  
There are no terms of service. For a financial tool, this creates liability exposure around projection accuracy, data accuracy reliance, and export file use.

**GAP-13 — Export files are unprotected**  
Excel exports (`FinanceDashboard_YYYY-MM-DD.xlsx`) and PDF exports contain complete plaintext financial data and are saved to the user's download folder with no password protection. These files are outside the application's AES encryption perimeter. Users should be warned that exported files contain sensitive unprotected data.

**GAP-14 — No logout confirmation or idle session warning**  
The inactivity timer (60 minutes minimum, `page-init.js` line 78) is configurable but defaults to 60 minutes. For a financial application this is very long. A 15-minute default with a user-facing warning before lockout would be appropriate best practice (though not a strict legal requirement).

---

## 7. COOKIE AND LOCALSTORAGE CONSENT

### Current state
The application uses `localStorage` extensively for both functional data (encrypted financial records) and authentication state (lockout counters, auth version flag). No cookie consent banner or localStorage consent mechanism is present.

### Legal requirements
Under the UK Privacy and Electronic Communications Regulations 2003 (PECR), "cookies or similar technologies" that store or access information on a user's device require:

1. Clear and comprehensive information about the purpose of the storage
2. User consent before the storage takes place (except for strictly necessary storage)

**Strictly necessary exemption:** `localStorage` used to provide a service the user has explicitly requested (i.e., the financial dashboard itself) may fall under the strictly necessary exemption. The encrypted financial data storage (`fin_*` keys) is arguably strictly necessary for the service to function. The auth lockout state is also functional.

**However:** The `auth_version` key (`fd_v2_hardcoded_2026`) is a migration marker that persists across sessions without being strictly necessary for current functionality. Any analytics or tracking storage would require explicit consent.

For a multi-user product: a PECR-compliant notice explaining what is stored in `localStorage`, why, and for how long must be provided, even if consent for strictly necessary storage is not required.

---

## 8. DATA MINIMISATION AND PURPOSE LIMITATION

### Data minimisation (Article 5(1)(c))
The application collects detailed financial data at granular levels (individual expense line items, per-ULIP values, monthly payslip notes). For a personal finance tool, this level of detail is the purpose — the granularity is the feature, not over-collection. Data minimisation is generally satisfied for the application's stated purpose.

**Exception:** The `fin_profile` key stores `name` and `age` primarily for display purposes (sidebar profile name in `shared-layout.js`). The age is used in projection calculations. The name is used only as a display label (`'Sir'` in defaults). A user identifier in a personal tool is not excess data.

### Purpose limitation (Article 5(1)(b))
All data collected is used within the application for financial tracking and projection. The export functionality allows data to leave the controlled environment:

- **Excel export:** Plaintext financial data written to disk. Once exported, the data is outside the application's control. Users should be clearly warned.
- **PDF export:** Section-by-section screenshots. Same risk as Excel.
- **JSON backup:** Exports the encrypted ciphertext. This is within purpose limitation as it is a backup/restore mechanism and the data remains encrypted.

No data is transmitted to any server. No telemetry, no analytics, no third-party data sharing. Purpose limitation is substantially satisfied within the application boundary.

---

## 9. SECURITY OF PROCESSING (ARTICLE 32 ASSESSMENT)

Article 32 requires "appropriate technical and organisational measures" considering the "nature, scope, context and purposes of processing."

### Strengths observed in the code

| Control | Implementation | Assessment |
|---------|---------------|------------|
| Encryption at rest | AES-256-GCM via Service Worker crypto vault | Strong — industry standard |
| Key derivation | PBKDF2-SHA256, 600,000 iterations, separate salts for auth and encryption | Strong — meets NIST SP 800-132 guidance |
| Credential storage | PBKDF2 hashes only; no plaintext username or password stored anywhere | Strong |
| Brute force protection | Exponential lockout (30s, 60s, 120s...) after 3 failed attempts | Adequate |
| Session management | Inactivity timeout via SW lock + sessionStorage wipe | Adequate |
| Timing attack resistance | Both username and password hashes computed in parallel; unified failure message never revealing which field failed | Good |
| Transport security | Service Worker requires HTTPS (`sw-client.js` line 8 error message confirms) | Adequate |

### Weaknesses requiring remediation

| Weakness | Location | Risk |
|---------|----------|------|
| Encryption key in sessionStorage | `login.html:341`, `page-init.js:16` | Key extraction via XSS or browser extension |
| No Content Security Policy | All HTML files | XSS risk — could lead to key extraction |
| Third-party scripts from CDN | `export.html`, `dashboard.html`, others | Supply chain risk; XSS via compromised CDN |
| Hardcoded auth salts and hashes in JS | `auth.js` lines 6–12, `auth-config.js` | The comment "this file is in .gitignore" is only as safe as the .gitignore — if auth.js is committed (it appears to be, as it contains the CRED object directly), the salts are public, enabling offline PBKDF2 attacks |
| No Subresource Integrity (SRI) on CDN scripts | `export.html`, `dashboard.html` | Compromised CDN could serve malicious JS |

**Note on auth.js vs auth-config.js:** Both files contain identical `CRED` objects with the same salts and hashes. `auth-config.js` has a comment stating it is generated and in `.gitignore`, but `auth.js` contains the same hardcoded values without that protection. If `auth.js` is in the public repository, the PBKDF2 salts are public knowledge, enabling targeted offline password brute-force attacks on exported data.

---

## 10. DATA PROTECTION IMPACT ASSESSMENT (DPIA) REQUIREMENT

### Is a DPIA required?

**For current single-user personal use:** No. GDPR Article 35 applies to controllers processing data "likely to result in a high risk to the rights and freedoms of natural persons." The household exemption (Recital 18) means personal-use processing by an individual for personal purposes falls outside GDPR's controller obligations entirely.

**For a multi-user product:** Yes — a DPIA would be mandatory before launch for the following reasons:

1. **Large-scale financial data processing** — the ICO's high-risk processing criteria includes "large scale" processing of financial data. Once multi-user, scale increases.
2. **Sensitive financial categories** — salary, debts, pensions, tax underpayments, insurance products. While not Article 9 special category data, ICO guidance identifies financial data as warranting a DPIA.
3. **Automated financial assessments** — tax calculations, net worth projections, and debt payoff timelines are automated assessments of individuals' financial situations.
4. **Open Banking integration (if added)** — accessing bank account data is explicitly listed by the ICO as triggering DPIA requirements.

### What the DPIA must cover
- Description of the processing operations and their purposes
- Assessment of the necessity and proportionality of the processing
- Assessment of the risks to the rights and freedoms of data subjects
- Measures to address those risks
- Consultation with the ICO if the residual risk remains high after mitigation

---

## 11. SUMMARY FINDINGS TABLE

| Finding | Severity | GDPR Article / Regulation | Immediate Action Required |
|---------|----------|--------------------------|--------------------------|
| Real personal data in defaults.js visible in source | CRITICAL | Art. 5(1)(a), Art. 33 | Replace with fictional values before any public sharing |
| Encryption key in sessionStorage (cleartext) | HIGH | Art. 32 | Evaluate alternative — SW-only key lifecycle without sessionStorage fallback |
| No privacy policy or Article 13 notice | HIGH | Art. 13 | Required before any multi-user deployment |
| No GDPR Article 20 plaintext data export | HIGH | Art. 20 | Add decrypted JSON export |
| No Subresource Integrity on CDN scripts | HIGH | Art. 32 | Add integrity= attributes to all CDN script tags |
| No Content Security Policy | HIGH | Art. 32 | Add strict CSP meta tag or HTTP header |
| No data retention controls | MEDIUM | Art. 5(1)(e) | Add configurable retention for log entries |
| No DPIA documented | MEDIUM | Art. 35 | Required before multi-user product launch |
| Auth hashes in public JS (auth.js) | MEDIUM | Art. 32 | Ensure auth.js is .gitignored; use auth-config.js exclusively |
| Exported files unprotected | MEDIUM | Art. 32 | Warn users; consider optional export encryption |
| No PECR localStorage notice | LOW | PECR 2003 | Required for multi-user deployment |
| 60-minute inactivity default | LOW | Art. 32 (best practice) | Reduce default to 15 minutes |
| Lockout state in localStorage (manipulable) | LOW | Art. 32 | Move to sessionStorage |
| No Terms of Service | LOW | Consumer protection | Needed for any product offering |

---

## 12. CONCLUSION

In its current state as a single-user personal finance tool deployed on the owner's own device, the Financial Dashboard operates largely outside formal GDPR obligations (household exemption, Recital 18) and cannot be considered non-compliant in its use. The technical security architecture — AES-256-GCM, PBKDF2 at 600k iterations, Service Worker crypto vault, brute-force lockout — is genuinely strong for a client-side tool.

**The single most urgent issue is GAP-01:** the `js/defaults.js` file contains what appear to be real personal financial data (salary, debt balances, tax codes, pension and ULIP product values with specific amounts). If this file is committed to a public repository or shared, it constitutes a personal data breach regardless of the single-user status of the application. This must be resolved before any code sharing.

**For transition to a product offered to other users**, the gaps identified above (particularly GAP-01 through GAP-10) must be resolved in full. The most architecturally significant change would be moving from client-side-only local storage to a server-side model with proper access controls, a GDPR-compliant backend, and FCA AISP registration if Open Banking integration is intended.

---

*This review was conducted based on static analysis of the source code only. It does not constitute legal advice. Formal legal review by a qualified UK data protection solicitor and FCA regulatory counsel is required before any product launch.*
