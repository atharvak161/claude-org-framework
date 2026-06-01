# Integration Roadmap — Financial Dashboard
**Author:** Integration Engineer
**Date:** 2026-06-01
**Project:** /Users/atharva/Downloads/organisation/src/projects/financial-dashboard/

---

## Executive Summary

The financial dashboard is a fully client-side, localStorage-backed single-page application with no backend, no server, and no authentication layer beyond an optional PIN. All data is entered manually. This constraint is the governing factor for every integration assessed below. Integrations that require a backend (OAuth token exchange, secret key storage, server-side API proxying) cannot be implemented safely in a pure client-side app without architectural changes. Those that can operate entirely in the browser — with appropriate caveats — are feasible within the current architecture.

---

## Integration 1: Open Banking (UK) — TrueLayer / Plaid / Yapily

### What bank data could be auto-imported?

The dashboard stores, in `fin_income` and `fin_expenses`, the following fields that Open Banking could populate or verify:

| Dashboard field | Open Banking equivalent |
|---|---|
| `baseSalaryGBP` | Recurring inbound credit from employer (salary credit detection) |
| `avgOvertimeGrossGBP` | Variable inbound credits above base salary |
| `fin_expenses.items[*].monthlyGBP` | Categorised outgoing transactions by merchant |
| `fin_investments.cashAccounts[*].balanceGBP` | Account balance from savings/current accounts |
| `fin_debts.sbi.emiINR` | Recurring outbound international transfers |
| `fin_monthly_log` | Full transaction history, month-by-month |

In practice, Open Banking AIS (Account Information Services) returns:
- Account balances (current and available)
- Transaction history (up to 90 days under PSD2 minimum; many providers support 12 months)
- Transaction metadata: amount, currency, description, merchant category code (MCC), date
- Direct debit mandates and standing orders (maps well to fixed monthly expenses)

### Regulatory requirements (UK)

**PSD2 / UK Open Banking Standard:**
- The application consuming bank data must be registered as an **AISP (Account Information Service Provider)** with the **FCA** (Financial Conduct Authority).
- FCA registration requires: company incorporation, fit-and-proper director assessment, PI/FCA application fee (~£1,500), ongoing compliance reporting, mandatory professional indemnity insurance.
- This is a **personal-use dashboard, not a regulated business**. Atharva cannot legally access Open Banking APIs directly as an AISP.

**The workaround — intermediary providers:**
TrueLayer, Plaid, and Yapily are themselves FCA-registered AISPs. They expose APIs that third-party developers can call. However, even their sandbox and production APIs require:
- Developer account registration (identity verification)
- Client ID and Client Secret stored server-side
- OAuth 2.0 PKCE flow: the browser redirects to the bank's authorisation page, the bank redirects back with an authorisation code, and that code must be exchanged for an access token — this exchange **must happen on a server** (the client secret cannot be exposed to the browser)

**What this means for a client-side-only app:**
Open Banking in its full form **is not feasible without a backend**. Even PKCE flow, while it avoids a client secret in the token request, still requires TrueLayer's server to issue tokens, and those tokens contain bearer credentials that would be stored unencrypted in localStorage — a significant security concern flagged in the existing SECURITY_REVIEW.md.

### Technical implementation if a backend were added

If a minimal backend (e.g., a Cloudflare Worker or lightweight Node.js endpoint) were introduced:

1. Browser initiates: `GET /auth/truelayer` — backend generates state + PKCE verifier, redirects to TrueLayer consent screen
2. Bank redirects back to `/auth/callback?code=xxx`
3. Backend exchanges code for access token (using stored client secret), stores token encrypted, returns a short-lived session token to browser
4. Browser calls `/api/transactions` — backend proxies to TrueLayer with stored access token, transforms response to dashboard schema, returns sanitised JSON
5. Browser merges returned data into `fin_expenses.items` and `fin_monthly_log`

Data mapping on ingestion:
- Outgoing transactions grouped by MCC / merchant name → matched to existing expense `id` or create new item
- Salary credit detection: inbound > £1,000 labelled "salary" by bank → `baseSalaryGBP` candidate
- Balance → `cashAccounts[*].balanceGBP`

### Assessment

| Dimension | Rating |
|---|---|
| Feasibility (current architecture) | **Low** — requires backend for OAuth token exchange |
| Feasibility (with minimal backend) | **Medium** — technically achievable but adds significant complexity |
| Estimated effort | **Large** — FCA AISP compliance via provider, backend, OAuth flow, data mapping, conflict resolution |
| Value | **High** — eliminates all manual expense entry; provides real account balances |
| Recommended priority | **Phase 3** — pursue only after backend is established for another reason |

**Blocking requirement:** Backend server to handle OAuth token exchange. Cannot be done safely client-side.

---

## Integration 2: HMRC APIs — Income Tax and Self-Assessment

### What HMRC APIs exist for personal tax data?

HMRC exposes a suite of APIs under its **Making Tax Digital (MTD)** programme. The relevant APIs for a personal tax dashboard:

| API | What it provides |
|---|---|
| **Individual Tax** (`/individuals/income-tax/`) | Tax code, estimated liability, PAYE records |
| **Self Assessment** (`/self-assessment/`) | Filed returns, payments on account, balances owed |
| **Employment** (`/individuals/employment/`) | Employer PAYE reference, gross pay per employment |
| **Benefits and Credits** (`/individuals/benefits-and-credits/`) | Tax credits, child benefit |
| **National Insurance** (`/individuals/national-insurance/`) | NI contributions by tax year |

Authentication is via **HMRC OAuth 2.0** with Government Gateway credentials — the user must consent via their HMRC login.

### Could tax code and underpayment data be fetched automatically?

**Conceptually yes.** The dashboard currently stores:
- `fin_income.taxCode` — currently hardcoded to `'1257L'`; HMRC Individual Tax API returns the current tax code
- `fin_income.underpaymentMonthlyGBP` — derivable from HMRC debt balance / remaining months
- `fin_income.underpaymentClearsDate` — derivable from HMRC debt record end date
- `fin_tax_tracker.underpaymentTotal`, `.monthlyDeduction`, `.startDate`, `.endDate`

**The same OAuth backend problem applies.** HMRC OAuth requires:
- A registered application on HMRC Developer Hub
- Client ID + Client Secret exchanged server-side
- Scopes: `read:individuals-income-tax`, `read:self-assessment`
- The user authenticates via Government Gateway — this works fine in the browser redirect flow, but the token exchange requires a backend

**Additional complication:** HMRC Production API access requires an application to pass HMRC's production credentials assessment, which is straightforward for a personal tool but still requires registration.

**Sandbox:** HMRC provides a full sandbox environment with test users — this is immediately accessible with a free developer registration and could be used to build and test the integration before backend deployment.

### Assessment

| Dimension | Rating |
|---|---|
| Feasibility (current architecture) | **Low** — same OAuth backend dependency as Open Banking |
| Feasibility (with minimal backend) | **Medium** — HMRC APIs are well-documented and stable |
| Estimated effort | **Medium** — simpler than Open Banking (fewer data types, no bank-specific quirks) |
| Value | **High** — tax code and underpayment auto-fetch would eliminate a frequent source of error |
| Recommended priority | **Phase 3** — bundle with backend work; implement after Open Banking if backend exists |

**Quick win within current architecture:** Provide a link to `https://www.gov.uk/check-income-tax-current-year` so the user can read their tax code and manually confirm the dashboard value. Zero implementation effort, eliminates the lookup step.

---

## Integration 3: CSV Import — Manual Data Import

### Feasibility in current architecture

**Fully feasible with no backend required.** File reading via the `FileReader` API is a native browser capability. This is the highest-value, lowest-risk integration available today.

### Bank CSV formats to support

The following UK banks are relevant to the user's profile (Revolut appears in `fin_investments.cashAccounts`; TFL, EE, and other UK expenses indicate UK banking):

#### Revolut
```
Date,Description,Amount,Fee,Currency,State,Balance
2024-01-15,Salary,3200.00,0.00,GBP,COMPLETED,4500.00
2024-01-16,Tesco,-45.23,0.00,GBP,COMPLETED,4454.77
```
- Date format: `YYYY-MM-DD`
- Amount: positive = credit, negative = debit (single column)
- Currency: explicit column

#### Monzo
```
Transaction ID,Date,Time,Type,Name,Emoji,Category,Amount,Currency,Local amount,Local currency,Notes and #tags,Address,Receipt,Description,Category split,Money Out,Money In
txn_123,15/01/2024,09:00:00,PAY/POS,Tesco,,,,-45.23,GBP,-45.23,GBP,,,Tesco Express,,,45.23,
```
- Date format: `DD/MM/YYYY`
- `Money Out` and `Money In` are separate columns (not a single signed amount)
- `Category` is Monzo's own category label

#### Barclays
```
Number,Date,Account,Amount,Subcategory,Memo
,,Current Account,3200.00,Direct Credit,EMPLOYER NAME SALARY
,,Current Account,-45.23,Payment,TESCO
```
- Date format: `DD/MM/YYYY`
- Amount: positive = credit, negative = debit
- No transaction ID
- Memo is a raw bank reference string

#### Starling Bank
```
Date,Counter Party,Reference,Type,Amount (GBP),Balance (GBP),Spending Category,
15/01/2024,TESCO,Card payment,FASTER_PAYMENT,-45.23,4454.77,GROCERIES,
```
- Date format: `DD/MM/YYYY`
- Amount: negative = debit, positive = credit (single column)
- `Spending Category` is Starling's category label (maps well to dashboard categories)

### Field mapping specification

#### Target stores

**`fin_expenses.items`** — for recurring/categorised outgoings:
```
{ id, name, category, monthlyGBP, active }
```

**`fin_monthly_log`** — for transaction history:
```
{ month: 'YYYY-MM', totalIncome, totalExpenses, surplus, note }
```

**`fin_income`** (derived, not direct):
- Detect salary credits (configurable: amount > threshold, description matches "SALARY" / employer name)
- Suggest `baseSalaryGBP` update if detected salary differs from stored value

#### Category mapping

The dashboard uses these categories: `Housing`, `Debt`, `Insurance`, `Phone`, `Transport`, `Subscription`, `Food`, `Personal`, `Travel`, `Other`.

Mapping from bank categories:

| Bank | Bank category | Dashboard category |
|---|---|---|
| Starling | `GROCERIES` | `Food` |
| Starling | `EATING_OUT` | `Food` |
| Starling | `TRANSPORT` | `Transport` |
| Starling | `BILLS` | `Housing` |
| Starling | `ENTERTAINMENT` | `Subscription` |
| Starling | `PERSONAL_CARE` | `Personal` |
| Starling | `HOLIDAY` | `Travel` |
| Monzo | `groceries` | `Food` |
| Monzo | `eating_out` | `Food` |
| Monzo | `transport` | `Transport` |
| Monzo | `bills` | `Housing` |
| Monzo | `entertainment` | `Subscription` |
| Monzo | `personal_care` | `Personal` |
| Revolut | (none — uses Description) | Map by keyword |
| Barclays | (Subcategory is vague) | Map by keyword |

Keyword-based fallback mapping (applied to Description/Memo field):

| Keyword pattern | Dashboard category |
|---|---|
| `TFL`, `UBER`, `TRAINLINE`, `NATIONAL RAIL` | `Transport` |
| `TESCO`, `SAINSBURY`, `ALDI`, `LIDL`, `ASDA`, `MORRISONS`, `WAITROSE` | `Food` |
| `RENT`, `LANDLORD` | `Housing` |
| `EE`, `VODAFONE`, `O2`, `THREE` | `Phone` |
| `NETFLIX`, `SPOTIFY`, `APPLE`, `CLAUDE`, `AMAZON PRIME`, `TRYHACKME` | `Subscription` |
| `SBI`, `EMI`, `LOAN` | `Debt` |
| `SUD LIFE`, `PNB METLIFE`, `AXIS MAX LIFE`, `ULIP` | `Insurance` |
| `SALON`, `HAIRCUT`, `BARBER` | `Personal` |
| `FLIGHT`, `HOTEL`, `AIRBNB`, `BOOKING` | `Travel` |
| (default) | `Other` |

#### Import flow specification

**Step 1 — File selection:**
- UI: modal dialog with bank selector dropdown + file input (`accept=".csv"`)
- Supported banks: Revolut, Monzo, Barclays, Starling (+ generic fallback)
- Bank selection sets the parser configuration (date format, column names, signed-amount vs separate debit/credit columns)

**Step 2 — Parsing:**
```javascript
// Parser config per bank
const PARSERS = {
  revolut:  { dateCol: 'Date',        dateFormat: 'ISO',    amountCol: 'Amount',      creditCol: null,     debitCol: null,     descCol: 'Description', categoryCol: null },
  monzo:    { dateCol: 'Date',        dateFormat: 'DD/MM/YYYY', amountCol: null,    creditCol: 'Money In', debitCol: 'Money Out', descCol: 'Name',     categoryCol: 'Category' },
  barclays: { dateCol: 'Date',        dateFormat: 'DD/MM/YYYY', amountCol: 'Amount', creditCol: null,     debitCol: null,     descCol: 'Memo',        categoryCol: null },
  starling: { dateCol: 'Date',        dateFormat: 'DD/MM/YYYY', amountCol: 'Amount (GBP)', creditCol: null, debitCol: null,   descCol: 'Counter Party', categoryCol: 'Spending Category' },
};
```

**Step 3 — Deduplication:**
- Each transaction is fingerprinted: `hash(date + description + amount)`
- Before writing, check `fin_monthly_log` for existing entries with same fingerprint
- Duplicate transactions are skipped with a count displayed to the user

**Step 4 — Review screen:**
- Show parsed transactions in a preview table: Date | Description | Amount | Detected Category | Action
- User can override category per row via inline dropdown
- Salary detections shown prominently: "Detected salary credit of £X — update income record?"
- Checkbox to include/exclude each row

**Step 5 — Merge:**
- Debits: aggregate by category per month → update `fin_monthly_log` entries
- Existing expense items (`fin_expenses.items`): if a recurring merchant is detected (appears ≥ 2 months), suggest updating `monthlyGBP` for that item
- New merchants: offer to add as new expense item
- Write final state to `fin_monthly_log` and optionally to `fin_expenses.items`

**Step 6 — Summary:**
- "Imported 143 transactions. 12 duplicates skipped. 3 new expense items suggested. 1 salary update suggested."

### Assessment

| Dimension | Rating |
|---|---|
| Feasibility (current architecture) | **High** — fully browser-native, no backend required |
| Estimated effort | **Medium** — parser per bank format, mapping logic, review UI, deduplication |
| Value | **High** — eliminates the biggest friction point: manual expense entry |
| Recommended priority | **Phase 1 — implement first** |

---

## Integration 4: Exchange Rate APIs — GBP/INR Live Rate

### Current state

The GBP/INR rate is stored in two places:
- `fin_profile.inrGbpRate` (default: `83`)
- `fin_settings.inrGbpRate` (default: `83`)

It is manually entered via Settings. The rate drifts — GBP/INR has moved between 94 and 110 over the past two years. A stale rate produces incorrect INR conversions across the entire dashboard (debt display, ULIP valuations, India trip budget).

### Available free/cheap APIs

| Provider | Free tier | Rate limit | CORS support | Notes |
|---|---|---|---|---|
| **ExchangeRate-API** | 1,500 req/month | ~50/day | Yes | `https://open.er-api.com/v6/latest/GBP` — no API key required for open endpoint |
| **Fixer.io** | 100 req/month (free plan) | 100/month | No (HTTPS only) | Requires API key; free plan is HTTP-only (security risk); EUR base only on free tier |
| **Open Exchange Rates** | 1,000 req/month | ~33/day | Yes | Requires API key; USD base on free plan; GBP/INR derivable |
| **Frankfurter** | Unlimited | Reasonable | Yes | `https://api.frankfurter.app/latest?from=GBP&to=INR` — ECB data, no key, updated weekdays |
| **CurrencyAPI** | 300 req/month | 10/day | Yes | Requires API key |

**Recommendation: Frankfurter** (primary) with **ExchangeRate-API open endpoint** as fallback.

- Frankfurter: `GET https://api.frankfurter.app/latest?from=GBP&to=INR`
  - Response: `{ "amount": 1, "base": "GBP", "date": "2026-05-30", "rates": { "INR": 107.23 } }`
  - No API key. No registration. ECB sourced. Updated every weekday.
  - CORS enabled — direct browser `fetch()` works.

- ExchangeRate-API open endpoint: `GET https://open.er-api.com/v6/latest/GBP`
  - Response: `{ "result": "success", "base_code": "GBP", "rates": { "INR": 107.45, ... } }`
  - No API key. CORS enabled.

### Implementation — no backend required

```javascript
// js/fx-rate.js

const FX_CACHE_KEY = 'fin_fx_gbp_inr';
const FX_CACHE_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours

export async function fetchGbpInrRate() {
  // 1. Check cache
  const cached = localStorage.getItem(FX_CACHE_KEY);
  if (cached) {
    const { rate, fetchedAt } = JSON.parse(cached);
    if (Date.now() - fetchedAt < FX_CACHE_TTL_MS) return rate;
  }

  // 2. Try Frankfurter (primary)
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=GBP&to=INR');
    if (res.ok) {
      const data = await res.json();
      const rate = data.rates.INR;
      localStorage.setItem(FX_CACHE_KEY, JSON.stringify({ rate, fetchedAt: Date.now() }));
      return rate;
    }
  } catch {}

  // 3. Fallback: ExchangeRate-API open endpoint
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/GBP');
    if (res.ok) {
      const data = await res.json();
      const rate = data.rates.INR;
      localStorage.setItem(FX_CACHE_KEY, JSON.stringify({ rate, fetchedAt: Date.now() }));
      return rate;
    }
  } catch {}

  // 4. Return null — caller uses stored manual rate
  return null;
}
```

**Integration point in Settings page:**
- On load: call `fetchGbpInrRate()`
- If a live rate is returned: display alongside the manual rate field — "Live rate: 107.23 (as of 30 May 2026, ECB) — Use this?"
- Button: "Apply live rate" — writes to both `fin_profile.inrGbpRate` and `fin_settings.inrGbpRate`
- Manual override is always preserved as the source of truth; live rate is a suggestion, not an automatic override
- Show "Last updated" timestamp so user knows if the cached rate is fresh

**Auto-refresh cadence:**
- 4-hour cache (both Frankfurter and ExchangeRate-API update once per weekday anyway)
- Do not auto-apply — always present as a user-confirmed update
- ECB/Frankfurter data is T+1 (previous business day close); adequate for a personal dashboard

**Weekend / market closure handling:**
- Frankfurter returns the last available weekday rate with the date in the response — display this date to the user so they know the rate age

### Assessment

| Dimension | Rating |
|---|---|
| Feasibility (current architecture) | **High** — direct browser fetch, no backend, no API key |
| Estimated effort | **Small** — ~80 lines of JS + Settings UI update |
| Value | **High** — GBP/INR moves significantly; stale rate causes incorrect debt and ULIP valuations |
| Recommended priority | **Phase 1 — implement alongside CSV import** |

---

## Consolidated Recommendation Matrix

| Integration | Feasibility | Effort | Value | Priority | Phase |
|---|---|---|---|---|---|
| **CSV Import** (Revolut, Monzo, Barclays, Starling) | High | Medium | High | 1 | Phase 1 |
| **Live FX Rate** (Frankfurter / ExchangeRate-API) | High | Small | High | 2 | Phase 1 |
| **HMRC APIs** (tax code, underpayment) | Low (now) / Medium (with backend) | Medium | High | 3 | Phase 3 |
| **Open Banking** (TrueLayer / Plaid / Yapily) | Low (now) / Medium (with backend) | Large | High | 4 | Phase 3 |

---

## Phased Delivery Plan

### Phase 1 — Immediate (no architecture change required)
**Timeline: 1–2 sprints**

1. **Live FX Rate fetch** (`js/fx-rate.js`)
   - Implement `fetchGbpInrRate()` with Frankfurter primary + ExchangeRate-API fallback
   - 4-hour localStorage cache
   - Settings page: display live rate alongside manual field, "Apply" button
   - Effort: Small (~1 day)

2. **CSV Import** (`js/csv-import.js` + modal UI)
   - Parser configurations for Revolut, Monzo, Barclays, Starling
   - Category keyword-mapping engine
   - Deduplication fingerprint logic
   - Review/preview modal
   - Merge into `fin_monthly_log` and `fin_expenses.items`
   - Effort: Medium (~5–7 days)

### Phase 2 — Deferred (awaiting backend decision)
**No work starts until backend architecture is decided.**

3. **Minimal backend scaffold** (if the decision is made to add one)
   - Cloudflare Worker or lightweight Node.js service
   - Handles OAuth token exchange only
   - No database required initially (tokens held in encrypted cookie)

### Phase 3 — Backend-dependent integrations
**Timeline: after Phase 2 backend exists**

4. **HMRC API integration**
   - OAuth flow via Government Gateway
   - Fetch: tax code, underpayment balance, employment gross pay
   - Map to `fin_income.taxCode`, `fin_income.underpaymentMonthlyGBP`, `fin_tax_tracker.*`
   - Effort: Medium

5. **Open Banking integration** (TrueLayer recommended — best UK coverage)
   - OAuth/PKCE flow via TrueLayer
   - Fetch: balances, 90-day transactions
   - Map to `fin_investments.cashAccounts`, `fin_expenses.items`, `fin_monthly_log`
   - Effort: Large

---

## Architectural Constraint Note

Every Phase 3 integration requires a backend to handle OAuth token exchange. Before committing to Phase 3, a formal architecture decision must be made on:
1. Whether to introduce a backend at all (currently this is a zero-server personal tool)
2. If yes, which platform (Cloudflare Workers, Vercel Edge Functions, lightweight Node.js)
3. Where to store OAuth client secrets (environment variables, not localStorage)
4. Whether to add user authentication to the backend (to protect bank data at rest)

This decision should be driven by whether Phase 1 (CSV import) meets the user's practical needs. If manual CSV import covers 90% of the value, Phase 3 may not be worth the complexity.

---

## Security Notes Specific to Integrations

- **CSV files:** Parsed entirely in-browser via `FileReader`. No data leaves the device. This is safe.
- **FX rate API calls:** Two outbound requests to third-party APIs with no user data included. Safe. The requested URLs contain no identifying information.
- **Open Banking tokens:** If ever implemented, access tokens must never be stored in localStorage unencrypted. Use HttpOnly cookies on the backend or encrypt with a key derived from a user passphrase.
- **HMRC tokens:** Same constraint as Open Banking. Government Gateway tokens are high-value credentials.
