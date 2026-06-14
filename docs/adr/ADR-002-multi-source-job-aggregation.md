# ADR-002: Multi-Source Job Aggregation — Adzuna + Reed + Jooble + RSS/JSON-LD

## Status: Accepted

## Date: 2026-06-08

## Context

JobScope needs a continuous supply of live UK cybersecurity job listings. The critical requirements are:

1. **UK market coverage** — Atharva is job-hunting in the UK; US-heavy aggregators are low signal.
2. **Free tier sufficient for solo use** — this is a single-user personal tool; paid aggregator costs at even modest volume are disproportionate.
3. **Legal compliance** — any data source must be used within its terms of service. This is not optional; legal exposure from ToS violations could result in civil liability that would make the tool unusable or legally actionable.
4. **No dependency on a single source** — if one API goes down or rate-limits, the feed must continue from remaining sources.
5. **Freshness** — 24-hour SLO for new jobs to appear in feed requires APIs that provide recently-posted listings, not just cached/stale data.

**Reference project context:** Gsync/jobsync uses JSearch via RapidAPI as its sole job source. This is a paid API (RapidAPI marketplace pricing), not free. It covers US and UK listings but is not UK-primary.

## Decision

Use the following sources:

| Source | Type | Rate limit | Primary use |
|---|---|---|---|
| **Adzuna API** | REST API (free, API key required) | ~250 req/day | UK-primary, well-known UK job board, good cybersecurity category |
| **Reed.co.uk Jobseeker API** | REST API (free, API key required) | ~1000 req/day | Primary volume source; Reed is the largest UK-native job board |
| **Jooble API** | REST API (free, API key required) | Generous / undocumented | Aggregator; fills gaps by pulling from boards not otherwise covered |
| **RSS / JSON-LD structured data** | ATS career page scraping (Greenhouse, Lever, Workable) | N/A (per-company, respectful rate) | Tracked companies (NCC Group, Pen Test Partners, KPMG, Deloitte, HSBC, BT, Vodafone etc.) |

**LinkedIn is explicitly excluded.** See rationale below.

**Combined effective daily capacity:** ~1,000–1,300 API calls/day across three sources, spread across scheduled runs throughout the day (not burst calls at midnight).

## Rationale

### Adzuna

Adzuna provides a documented, free public API with API key registration. Its UK coverage for IT/cybersecurity roles is strong — it aggregates from multiple UK job boards. The 250 req/day free-tier limit is sufficient to fetch current cybersecurity listings across all UK locations within the day budget when spread across 6 scheduled runs.

### Reed

Reed.co.uk is the UK's largest native job board. Its Jobseeker API is genuinely free (not a trial), well-documented, and provides 1,000 calls/day — the most generous free tier of any UK-native board. Reed listings skew heavily UK-based, which is exactly the signal needed for Atharva's search.

### Jooble

Jooble is an international job aggregator with a free API and a generous undocumented limit. Its key role here is gap-filling: it aggregates from boards and sources that Adzuna and Reed do not independently index. Used as a supplementary source rather than a primary one. If Jooble reduces its free tier, the pipeline degrades gracefully (Adzuna + Reed continue alone).

### RSS / JSON-LD

Major ATS platforms (Greenhouse, Lever, Workable) expose structured `JobPosting` data on company career pages. For companies Atharva specifically wants to monitor (NCC Group, Pen Test Partners, KPMG, Deloitte, HSBC, BT, Vodafone — as listed in the MEP), polling the career page RSS or parsing the JSON-LD structured data gives timely, direct listings without depending on whether the company paid to post on a board. This requires respectful rate limiting (one poll per company per 6 hours maximum).

## Alternatives considered

### LinkedIn (rejected — legal risk)

**Rejected explicitly and non-negotiably.**

The hiQ Labs v. LinkedIn litigation established that automated scraping of LinkedIn data in violation of LinkedIn's ToS carries real legal exposure. LinkedIn has pursued and obtained a $500,000 default judgment against hiQ Labs (Northern District of California, 2022). LinkedIn's ToS explicitly prohibit automated data collection without express written consent. Using LinkedIn data would expose this project to CFAA and LinkedIn ToS enforcement action.

Additionally, LinkedIn's official Jobs API is restricted to approved LinkedIn partners only and is not available to individual developers. There is no legitimate free path to LinkedIn job data.

**This is a hard exclusion — not a cost trade-off, a legal one.**

### JSearch via RapidAPI (jobsync's choice — rejected, not free)

JSearch is the job aggregation API used by the reference project (jobsync). It is accessed via RapidAPI's marketplace and is a paid service. The free tier is extremely limited (10 requests/month as of 2024). At useful volume, RapidAPI charges apply. For a solo personal tool, paying for job data that is available for free from direct sources is not justified. Rejected on cost grounds.

### Paid aggregators (Adzuna Premium, Broadbean, Vacancy Soft) — rejected

Paid commercial aggregators provide higher volume, better data quality guarantees, and richer structured data. Broadbean and similar services cost hundreds to thousands of pounds per month, far exceeding the budget for a solo personal tool. Even Adzuna's paid tiers start at pricing inappropriate for a personal project. Rejected on cost grounds.

### Gov.uk Find a Job API — evaluated, not selected as primary source

Gov.uk runs its own job board (Find a Job, formerly Universal Jobmatch). Its API is available but is primarily oriented toward social welfare claimants and entry-level roles; cybersecurity-specific coverage is sparse. Not suitable as a primary source but gov.uk's **sponsor register CSV** is used as a critical reference data source (this is separate from the job listings API).

### IndeedPublisher / Indeed Sponsored Jobs API — rejected

Indeed's official API is restricted to approved hiring partners (those posting sponsored listings). Individual developer access to search results is not available. The unofficial/undocumented endpoints used by some open-source scrapers violate Indeed's ToS and face the same legal exposure as LinkedIn. Rejected.

## Consequences

**Positive:**
- ~1,000–1,300 free API calls/day provides sufficient volume to maintain a live, fresh feed for a solo job-seeker — a new cybersecurity listing should not take more than a few hours to appear in the feed after posting.
- Strong UK market bias matches the target market. Reed especially skews UK-native.
- Three independent sources provide resilience: if one source degrades or rate-limits unexpectedly, the pipeline continues at reduced volume rather than failing completely.
- All three APIs are free with API key registration only — no payment required for the expected use pattern.
- Legal compliance: all three APIs are used within their documented terms of service.

**Negative / trade-offs:**
- ~1,000–1,300 calls/day is much less than LinkedIn's breadth. Some listings exclusively posted on LinkedIn will be missed. **This is an acceptable trade-off given the legal risk of the alternative.**
- Jooble's rate limit is undocumented. If they enforce a limit that materialises, the pipeline degrades to Adzuna + Reed only (still functional, reduced coverage). Monitoring alert will surface this.
- Reed and Adzuna both skew toward jobs that companies actively pay to post. Direct-hire roles posted only on company career pages are covered via the RSS/JSON-LD adapter for tracked companies, but not for the broader market.
- API key management: three separate API keys to rotate and manage. Mitigated by secrets management in Railway (one secrets store, documented rotation runbook).

**UK-heavy bias (feature, not bug):** The geographic and market bias of Reed + Adzuna + Jooble is UK-heavy. For Atharva's specific use case (UK Skilled Worker visa sponsorship, London/UK cybersecurity market), this is correct behaviour.

## Review date

Reconsider if:
- Any source reduces its free tier to below useful volume (defined as < 100 calls/day). Escalate to VP Engineering for alternative source evaluation.
- A new UK-native free-tier job board API becomes available — evaluate adding as a fourth source.
- Atharva's job search scope changes to include non-UK markets.
