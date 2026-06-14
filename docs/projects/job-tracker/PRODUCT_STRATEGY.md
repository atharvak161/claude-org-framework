# Product Strategy — JobScope

**Owner:** Product Manager
**Project:** JobScope
**Date:** 2026-06-08
**Status:** Approved — derived from MEP /Users/atharva/.claude/plans/mighty-enchanting-manatee.md

---

## Problem statement

Atharva is job-hunting in the UK cybersecurity market as a non-UK national who requires Skilled Worker visa sponsorship and cannot take SC/DV-clearance-gated roles. No existing job-search tool surfaces or filters on either signal. The current workflow is entirely manual: search boards, cross-check the gov.uk Register of Licensed Sponsors by hand, read every job description for clearance mentions. JobScope eliminates this manual process.

---

## MVP feature set — Must-Have (Phase 1–4)

These six features must ship before v1 can be declared done. All are non-negotiable.

### MVP-1: Resume upload + LLM parsing

- Upload PDF or DOCX resume
- Text extracted via pdfplumber (PDF) / python-docx (DOCX)
- Claude API with structured JSON schema extracts: skills[], roles[], experience_years, education[], certifications (CEH, OSCP, eJPT, MSc, Fortinet NSE auto-detected)
- Parsed profile presented to user for review and correction before it activates
- Human review/correction step is mandatory — profile does not activate the matching engine until user confirms it

### MVP-2: Live job fetching — multi-source

- **Reed.co.uk Jobseeker API** — primary volume source (~1000 req/day free)
- **Adzuna API** — UK cybersecurity supplement (~250 req/day free)
- **Jooble API** — aggregator, fills gaps from boards not covered by Reed/Adzuna
- Jobs content-hash deduped — same role from multiple sources appears once
- Stale postings soft-closed automatically
- Pipeline freshness SLO: new jobs appear in feed within 24 hours of posting
- LinkedIn is explicitly excluded (hiQ Labs v. LinkedIn legal precedent)

### MVP-3: UK gov.uk sponsor register cross-reference

- Downloads "Register of Worker and Temporary Worker Licensed Sponsors" CSV from gov.uk (OGL-licensed, updated ~every 48h)
- Scheduled diff-only processing: does not re-process the full 9.5MB on every run
- Company-name normalisation: strip legal suffixes → exact match → pg_trgm trigram similarity → confidence threshold
- Three-tier sponsorship confidence:
  - **CONFIRMED** (green) — on register + job ad explicitly states "sponsorship available"
  - **LIKELY** (amber) — on register, no explicit ad mention
  - **UNKNOWN** (grey) — not on register or match confidence below threshold
- Register suspension alerts: if a saved or applied-to company gets suspended, Atharva is notified immediately

### MVP-4: SC/DV-clearance detection and exclusion

- Keyword detection: `SC clearance`, `DV clearance`, `security cleared`, `must hold clearance`, `SC eligible`, `SC required`, `BPSS`, `baseline personnel security standard`, and variants
- Three signals: **REQUIRED** (hidden by default) / **PREFERRED** (shown but flagged) / **NONE DETECTED** (clear)
- Default view: SC-required roles are hidden; user can toggle to see them (clearly marked as ineligible)
- Conservative matching: ambiguous phrasing → REQUIRED rather than NONE DETECTED (false negatives waste time)

### MVP-5: Eligibility filter engine

- Salary range (min/max annually; hourly/daily converted)
- Seniority level (junior/mid/senior — detected from title and description)
- Location (London / Remote / Hybrid / UK-wide)
- Cybersecurity sub-domain: SOC/Threat Analyst, Penetration Testing, GRC/Compliance, AppSec, Cloud Security, Vulnerability Management, CTI, Infrastructure/Network Security
- Smart defaults loaded from parsed resume on first run
- Saved filter presets ("OSCP Track", "Immediate Pentest", "Backup SOC Route")

### MVP-6: Application tracker

- Status pipeline: Discovered → Saved → Applied → Application Acknowledged → Interview Scheduled → Interviewing → Offer → Accepted / Rejected / Ghosted
- Per-application fields: sponsor confidence at time of application, clearance status, salary offered, recruiter/agency contact, date applied, notes
- Ghosting auto-detection: Applied with no status update after 21 days → auto-flag as likely no-response

---

## v1.1 feature set — Enhanced

These features ship after v1 is live and stable. They deepen functionality without changing the core data model significantly.

### v1.1-A: OSCP/certification relevance filter

- Surface roles listing OSCP, CEH, eJPT, GCHQ-accredited MSc, or Fortinet NSE as relevant
- "OSCP-unlockable" tag: roles where OSCP is preferred-but-not-required — the door one certification opens
- Subset view: "Roles matching my certifications exactly"

### v1.1-B: Role-gap analysis

- Parsed resume vs. aggregated JD requirements across saved searches
- Weekly insight: top 3 skills/certifications appearing in roles Atharva doesn't yet qualify for
- Actionable: each gap links to a suggested resource (TryHackMe path, certification, HackTheBox module)
- Example output: "OSCP would unlock 34 more roles in your saved search. Azure Security Engineer cert would unlock 18 more."

### v1.1-C: Sponsorship confidence tiers (full implementation)

- MVP has binary visible badge; v1.1 adds hover/tap evidence: "On register since 2019 — 12 Skilled Worker sponsorships in last 12 months"
- Register suspension history visible in badge tooltip
- Detailed confidence evidence shown in application tracker per-application record

### v1.1-D: Application velocity dashboard

- Weekly applications filed vs. configurable target (default: 10 qualified applications/week)
- Funnel stats: applied → interview conversion rate, interview → offer conversion rate
- Source attribution: which job board generates applications that reach interview stage
- "Best day to apply" insight based on observed response patterns

### v1.1-E: Salary intelligence layer

- For every role in search history (applied or not), log salary range
- Personal market-data view: median salary for SOC Tier 1 in London, Junior Pentester, GRC Analyst — based on actually-seen listings
- Pre-populates negotiation prep: "You negotiated £34k; market median in your saved search is £37k"

---

## v2+ features — Future

Logged here for roadmap awareness; do not plan or implement until v1.1 is complete and stable.

- Company intelligence layer (sponsor history, size, growth signals, Glassdoor-equivalent sentiment, suspension history)
- Email/calendar integration (auto-detect confirmation emails, auto-update tracker, add interviews to calendar)
- Recruiter/agency tracker (patterns, bait-and-switch detection, priority-response markers)
- Interview-prep module (AI-generated questions tailored to company stack + role, OWASP/HTB scenarios)
- Browser extension (one-click "save this job" from any job board page)
- Composite "apply now" confidence score (sponsor confidence + eligibility match + clearance risk + recency = single 0–100 signal)
- Clearance-route watchlist (SC-required roles saved for when Atharva becomes clearance-eligible)

---

## Success metrics

### Week 1 (post-launch)

- Atharva sees ≥20 sponsor-confirmed, clearance-free, salary-appropriate cybersecurity roles within 24 hours of first setup

### Week 4

- ≥3 qualified applications filed per week via JobScope (defined as: sponsor confidence CONFIRMED or LIKELY, clearance flag NONE DETECTED, salary within target range)
- Zero SC-clearance-required roles appearing in default eligible view (hard requirement — any miss is a P0 bug)

### Week 6

- First interview invitation for a role discovered via JobScope

### Technical success criteria (gates for v1 ship)

- Sponsor-register matching: ≥95% precision, ≥90% recall (tested against 200+ company ground-truth set — not estimated)
- New jobs appear in feed within 24h of posting (pipeline freshness SLO — tested by Director DevOps/Monitoring)
- All four org gates satisfied: Director Security ✓, Director DevOps ✓, Director QA ✓, VP Engineering ✓

---

## Out of scope (v1)

- LinkedIn integration (legally off-limits — permanent)
- Browser extension
- Email/calendar integration
- Company intelligence layer
- Multi-user / team features
- Public API
- Native mobile app
