# JobScope — System Architecture Document

**Version:** 1.0  
**Date:** 2026-06-08  
**Author:** Solution Architect  
**Status:** Approved — Phase 1 baseline  
**MEP reference:** `/Users/atharva/.claude/plans/mighty-enchanting-manatee.md`

---

## 1. System Overview

JobScope is a continuously-updating, personalised job-search and application-tracker built for a single power user (Atharva Kulkarni) who needs to filter the UK cybersecurity job market against two hard eligibility constraints that no existing tool surfaces:

1. **Skilled Worker visa sponsorship** — only roles at employers currently on the UK gov.uk Register of Licensed Sponsors are viable. The register is authoritative; self-declaration in a job ad is insufficient signal.
2. **SC/DV-clearance exclusion** — Atharva cannot hold UK security clearance as a non-UK national; clearance-required roles are wasted applications.

The system ingests live job data from four free-tier APIs plus gov.uk CSV data, normalises and enriches every listing against both eligibility dimensions, and presents a filtered, ranked, tracked feed. A resume-parsing pipeline converts an uploaded CV into a structured profile that drives smart filter defaults.

### Architectural goals

| Goal | Rationale |
|---|---|
| Always-on, continuously-updating pipeline | Jobs stale within days; 24-hour freshness SLO |
| Single-user from the start — no multi-tenancy overhead | Keeps schema simple; security model is owner = user |
| Explicit IDOR and SSRF prevention | Jobsync reference project had both; we design them out structurally |
| Free-tier API budget preserved | Adzuna 250/day, Reed 1000/day, Jooble generous — schedule carefully |
| Portable, low-ops hosting | Railway.app managed Postgres + worker support at ~£5–20/month |
| Auditable decisions | Every sponsor-match and clearance-flag decision must be traceable to source data |

---

## 2. Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              JOBSCOPE SYSTEM                                │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        NEXT.JS APP SERVER                           │  │
│  │  (App Router, React 19, TypeScript, NextAuth v5, shadcn/ui)        │  │
│  │                                                                      │  │
│  │  Pages / Routes:                                                     │  │
│  │    /                     — job feed (filterable, sortable)          │  │
│  │    /tracker              — application lifecycle tracker            │  │
│  │    /profile              — resume upload + parsed profile editor    │  │
│  │    /settings             — filter presets, notification prefs       │  │
│  │    /api/jobs             — job feed API (internal)                  │  │
│  │    /api/applications     — application CRUD (internal)              │  │
│  │    /api/resume           — upload + parse endpoint (internal)       │  │
│  │    /api/profile          — user profile CRUD (internal)             │  │
│  │    /api/healthz          — health check (public)                    │  │
│  └──────────────┬───────────────────────────────────────────┬──────────┘  │
│                 │ Prisma ORM                                 │ NextAuth     │
│                 ▼                                            ▼             │
│  ┌──────────────────────────┐                  ┌────────────────────────┐ │
│  │     POSTGRESQL (primary) │                  │   SESSION STORE        │ │
│  │                          │                  │   (Postgres-backed,    │ │
│  │  Tables:                 │                  │    NextAuth adapter)   │ │
│  │    users                 │                  └────────────────────────┘ │
│  │    jobs                  │                                             │
│  │    applications          │                                             │
│  │    user_profiles         │                                             │
│  │    sponsor_register      │                                             │
│  │    job_sponsor_matches   │                                             │
│  │    raw_job_ingestion     │                                             │
│  │                          │                                             │
│  │  Extensions:             │                                             │
│  │    pg_trgm (fuzzy match) │                                             │
│  └──────────────────────────┘                                             │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    BACKGROUND WORKER SERVICE                        │  │
│  │  (docker-compose worker loop — POSTs /api/ingest on a 6h interval)  │  │
│  │                                                                      │  │
│  │  Workers:                                                            │  │
│  │    adzuna-adapter         — scheduled, rate-limited (250/day)       │  │
│  │    reed-adapter           — scheduled, rate-limited (1000/day)      │  │
│  │    jooble-adapter         — scheduled, rate-limited                 │  │
│  │    remoteok-adapter       — zero-auth API, always enabled           │  │
│  │    govuk-csv-worker       — nightly diff, gov.uk register CSV       │  │
│  │    sponsor-matcher        — runs after ingestion batch              │  │
│  │    clearance-detector     — runs after normalisation                │  │
│  │    resume-parser          — triggered on upload event               │  │
│  │    stale-job-closer       — daily sweep for expired postings        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                  OBJECT STORAGE (Cloudflare R2)                     │  │
│  │                                                                      │  │
│  │  Buckets:                                                            │  │
│  │    jobscope-resumes       — uploaded PDF/DOCX files                 │  │
│  │    jobscope-exports       — any generated reports (future)          │  │
│  │                                                                      │  │
│  │  Access model:  ALL access via signed URLs — no public bucket URLs  │  │
│  │  Key format:    {userId}/{uuid}/{filename}  — owner-scoped          │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                  JOB-BOARD API ADAPTERS                             │  │
│  │                                                                      │  │
│  │  Adzuna API      api.adzuna.com/v1/api/jobs/gb/search               │  │
│  │    Rate:  250 req/day   — spread across 6 scheduled runs/day        │  │
│  │    Filter: category=it-jobs, location=uk                            │  │
│  │                                                                      │  │
│  │  Reed Jobseeker API  www.reed.co.uk/api/1.0/search                  │  │
│  │    Rate:  1000 req/day — primary volume source                      │  │
│  │    Filter: keywords=cybersecurity, locationName=United Kingdom      │  │
│  │                                                                      │  │
│  │  Jooble API      jooble.org/api/{apiKey}                            │  │
│  │    Rate:  generous free tier — gap-filler, aggregator               │  │
│  │    Filter: keywords=cybersecurity, location=United Kingdom          │  │
│  │                                                                      │  │
│  │  RemoteOK API   remoteok.com/api                                    │  │
│  │    Rate:  zero-auth free API — no key required, always enabled      │  │
│  │    Filter: returns remote roles; first array element is metadata    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                  SPONSOR-MATCHING ENGINE                            │  │
│  │                                                                      │  │
│  │  Input:  normalised_employer_name from job listing                  │  │
│  │  Input:  sponsor_register table (gov.uk CSV, updated nightly)       │  │
│  │                                                                      │  │
│  │  Pipeline:                                                           │  │
│  │    1. Strip legal suffixes (Ltd/Limited/plc/LLP/Inc/Corp)           │  │
│  │    2. Lowercase, strip punctuation, collapse whitespace             │  │
│  │    3. Exact match → CONFIRMED                                       │  │
│  │    4. pg_trgm similarity ≥ 0.85 → LIKELY                           │  │
│  │    5. pg_trgm similarity 0.60–0.84 → LOW_CONFIDENCE (review queue) │  │
│  │    6. < 0.60 + no explicit ad mention → UNKNOWN                    │  │
│  │    7. Explicit "sponsorship available" in JD → upgrade to CONFIRMED │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                  CLEARANCE-DETECTION MODULE                         │  │
│  │                                                                      │  │
│  │  Input:  job title + full description text                          │  │
│  │                                                                      │  │
│  │  Keyword sets (conservative — false negative is worse than FP):     │  │
│  │    REQUIRED:  sc clearance, dv clearance, security cleared,         │  │
│  │               must hold clearance, sc required, sc eligible,        │  │
│  │               sc/esc/dv, baseline personnel security standard,      │  │
│  │               bpss required, active clearance required              │  │
│  │    PREFERRED: clearance preferred, clearance desirable,             │  │
│  │               sc clearance preferred, security clearance an asset   │  │
│  │                                                                      │  │
│  │  Output tiers:                                                       │  │
│  │    REQUIRED  — default-hidden in user feed                          │  │
│  │    PREFERRED — shown but flagged amber                              │  │
│  │    NONE_DETECTED — shown (clear)                                    │  │
│  │                                                                      │  │
│  │  Rule: ambiguous phrasing → REQUIRED (never NONE_DETECTED)         │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                  CLAUDE API (external)                              │  │
│  │                                                                      │  │
│  │  Used for: resume text → structured JSON profile extraction         │  │
│  │  Mode:     structured JSON output (schema-enforced)                 │  │
│  │  Schema:   skills[], roles[], certifications[], experience_years,   │  │
│  │            education[], sub_domains[]                               │  │
│  │  Trigger:  resume-parser worker job (async, not in request path)    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Flow — Job Ingestion Pipeline

```
SOURCES
  Adzuna API ─────────┐
  Reed API ────────────┤
  Jooble API ──────────┤──► [per-source adapter worker]
  RemoteOK API ────────┘         │
                                 │ raw JSON payload + source identifier
                                 ▼
                    ┌────────────────────────┐
                    │  CONTENT-HASH DEDUP    │
                    │  SHA-256(title + employer + location + description[:200])
                    │  → INSERT INTO raw_job_ingestion ON CONFLICT (content_hash) DO NOTHING
                    └────────────┬───────────┘
                                 │ new records only
                                 ▼
                    ┌────────────────────────┐
                    │  NORMALISATION         │
                    │  · employer name normalised (strip legal suffixes)
                    │  · salary extracted + converted to annual GBP range
                    │  · seniority inferred from title keywords
                    │  · sub-domain classified (SOC/Pentest/GRC/AppSec/Cloud/etc.)
                    │  · location normalised (London / Remote / Hybrid / UK)
                    │  INSERT INTO jobs
                    └────────────┬───────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  SPONSOR MATCHER        │
                    │  (see §2 component)     │
                    │  → INSERT INTO job_sponsor_matches
                    │    (job_id, sponsor_id, confidence_tier, match_reason)
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  CLEARANCE DETECTOR     │
                    │  (see §2 component)     │
                    │  → UPDATE jobs SET clearance_status = {REQUIRED|PREFERRED|NONE_DETECTED}
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  ELIGIBILITY SCORER     │
                    │  · salary within user range?
                    │  · seniority matches user profile?
                    │  · sub-domain in user prefs?
                    │  · clearance_status != REQUIRED (default)
                    │  · sponsor confidence != UNKNOWN (default)
                    │  → UPDATE jobs SET eligibility_score, feed_visible
                    └────────────┬────────────┘
                                 │
                                 ▼
                    USER JOB FEED — filtered view
                    (Next.js /api/jobs returns only feed_visible=true
                     records for the authenticated user,
                     ordered by eligibility_score DESC, posted_at DESC)


GOV.UK SPONSOR REGISTER PIPELINE (separate, nightly):

  gov.uk CSV download ─► schema validation ─► diff against current sponsor_register
       │ schema unexpected                        │
       ▼                                          ▼
  HALT + alert (Monitoring Engineer SLO)    INSERT/UPDATE/soft-delete rows
                                            → triggers sponsor_matcher re-run
                                              for affected employer names
```

---

## 4. Data Flow — Resume Parsing Pipeline

```
USER ACTION: upload PDF or DOCX via /profile page
       │
       ▼
┌─────────────────────────────────────────────────────┐
│  FILE VALIDATION (server-side)                      │
│  · MIME type check (application/pdf, .docx only)    │
│  · File size limit: 10MB                           │
│  · Filename sanitisation (strip path traversal)    │
│  · Virus scan (ClamAV — future; initially skip)    │
└──────────────────┬──────────────────────────────────┘
                   │ validated file buffer
                   ▼
┌─────────────────────────────────────────────────────┐
│  OBJECT STORAGE UPLOAD                              │
│  · Key: {userId}/{uuid}/{sanitised_filename}        │
│  · Bucket: jobscope-resumes (private)               │
│  · Returns: storage key (NOT a public URL)          │
│  · DB: INSERT INTO user_profiles (resume_storage_key, status='PENDING')
└──────────────────┬──────────────────────────────────┘
                   │ trigger resume-parser (async, not in request path)
                   ▼
┌─────────────────────────────────────────────────────┐
│  TEXT EXTRACTION (worker process, not request path) │
│  PDF  → pdf-parse (Node-native, no Python dependency)
│  DOCX → mammoth (Node-native)                       │
│  Output: plain text string                         │
└──────────────────┬──────────────────────────────────┘
                   │ extracted text
                   ▼
┌─────────────────────────────────────────────────────┐
│  CLAUDE API — STRUCTURED JSON EXTRACTION            │
│  Model: claude-haiku-4-5-20251001 (cost-efficient)  │
│  Mode: structured output (JSON schema enforced)     │
│  Schema:                                            │
│    {                                                │
│      skills: string[],                              │
│      roles: [{title, employer, start, end}],        │
│      certifications: string[],                      │
│      experience_years: number,                      │
│      education: [{degree, institution, year}],      │
│      sub_domains: string[],                         │
│      seniority_inferred: "junior"|"mid"|"senior"   │
│    }                                                │
│  On parse failure: retry once, then mark FAILED     │
└──────────────────┬──────────────────────────────────┘
                   │ structured JSON
                   ▼
┌─────────────────────────────────────────────────────┐
│  SCHEMA VALIDATION                                  │
│  · Zod schema validates Claude output               │
│  · Rejects structurally invalid output before save  │
└──────────────────┬──────────────────────────────────┘
                   │ validated profile data
                   ▼
┌─────────────────────────────────────────────────────┐
│  HUMAN REVIEW STEP (mandatory before activation)    │
│  · UPDATE user_profiles SET status='PENDING_REVIEW',│
│    parsed_data = {json}                             │
│  · User sees parsed profile in editor               │
│  · User corrects/confirms                           │
│  · On confirm: status='ACTIVE'                      │
│  · Eligibility filter defaults loaded from ACTIVE   │
│    profile into user session                        │
└─────────────────────────────────────────────────────┘
```

---

## 5. API Design Overview

Full OpenAPI 3.0 spec will be delivered separately to `docs/api/jobscope-api.yaml`. The following is the endpoint surface sufficient for the Frontend Developer to begin UI work.

All endpoints require an authenticated session (NextAuth v5) unless marked [public].

### Job feed

| Method | Path | Description |
|---|---|---|
| GET | `/api/jobs` | Paginated job feed. Query params: `page`, `limit`, `sponsor_confidence[]`, `clearance_status[]`, `salary_min`, `salary_max`, `seniority[]`, `sub_domain[]`, `location[]`, `keyword`, `sort` |
| GET | `/api/jobs/:id` | Single job detail |
| POST | `/api/jobs/:id/save` | Save job to tracker (creates Application record at Saved status) |
| GET | `/api/jobs/stats` | Aggregate counts by confidence tier / clearance status for dashboard widgets |

### Application tracker

| Method | Path | Description |
|---|---|---|
| GET | `/api/applications` | List all applications (paginated, filterable by status) |
| POST | `/api/applications` | Create application (body: `job_id`, `status`, optional fields) |
| GET | `/api/applications/:id` | Single application detail |
| PATCH | `/api/applications/:id` | Update status, notes, salary_offered, contact |
| DELETE | `/api/applications/:id` | Soft-delete application |

### Resume and profile

| Method | Path | Description |
|---|---|---|
| POST | `/api/resume` | Upload resume file. Returns `{ upload_id, status: 'PROCESSING' }` |
| GET | `/api/resume/:upload_id/status` | Poll parse status: `PENDING` / `PENDING_REVIEW` / `ACTIVE` / `FAILED` |
| GET | `/api/profile` | Get current active user profile (parsed + human-reviewed) |
| PATCH | `/api/profile` | Update user profile fields (human corrections to parsed data) |
| POST | `/api/profile/confirm` | Activate a PENDING_REVIEW profile |

### User and preferences

| Method | Path | Description |
|---|---|---|
| GET | `/api/preferences` | Get saved filter presets, notification settings |
| PUT | `/api/preferences` | Update filter presets |

### System

| Method | Path | Description |
|---|---|---|
| GET | `/api/healthz` | [public] Returns `{ status: 'ok', sources: [{ source, ageHours, stale }], timestamp: ISO-timestamp }` |

---

## 6. Security Architecture

### 6.1 SSRF prevention

**Threat:** Server-side request forgery via user-controlled URL input (jobsync's documented Ollama URL vulnerability — exact class of bug we prevent by design).

**Controls:**
- The application server **never** fetches a URL provided by user input. Full stop.
- All external HTTP requests originate from background workers to a **compile-time allowlist** of domains: `api.adzuna.com`, `www.reed.co.uk`, `jooble.org`, `assets.publishing.service.gov.uk` (gov.uk CSV), and specific ATS career page hostnames.
- Allowlist lives in `src/config/allowed-external-hosts.ts` — any deviation requires a code change + PR review, not a config toggle.
- DNS rebinding protection: all HTTP client calls use `node-fetch` with a custom agent that validates the resolved IP is not RFC-1918 (private) or localhost before connecting.
- No user-facing feature accepts a URL that the server then fetches.

### 6.2 IDOR prevention

**Threat:** Insecure direct object reference — user A accesses user B's resources by guessing IDs (jobsync's documented sequential-ID file download vulnerability).

**Controls:**
- **File access:** All resume files retrieved via **time-limited signed URLs** generated server-side. The generation call validates `file.userId === session.user.id` before signing. The S3/R2 key itself contains `{userId}/` as the first path segment — a second layer.
- **Database records:** Every service-layer function that queries by ID includes an ownership check: `WHERE id = :id AND user_id = :userId`. This is enforced at the service layer (not just the route layer) so it survives refactoring.
- **IDs:** Postgres UUIDs (v4) throughout — not sequential integers. Unpredictability is defence-in-depth; the ownership check is the real control.
- **Applications, profiles:** Same pattern — every read/write call includes user_id in the WHERE clause.
- **Admin routes:** None in v1 — single-user app, no admin surface to protect.

### 6.3 PII handling

- **Resume files:** Stored in private R2 bucket. Never accessible via a public URL. Accessed only via short-lived signed URLs (15-minute TTL).
- **Parsed profile data:** Stored in `user_profiles` table, encrypted at rest by Railway's managed Postgres (AES-256). Never exposed in API responses without authentication.
- **Job application data:** UK GDPR Article 6(1)(b) — processing necessary for performance of a contract (or, more precisely, for Atharva's legitimate interest in managing his own job search). No third-party data sharing.
- **Logs:** No PII in application logs. User ID (UUID) may appear; email never logged.
- **Data retention:** Resume files deletable by user on demand. Profile data deletable. No retention beyond user account existence.

### 6.4 Secrets management

- All API keys (Adzuna, Reed, Jooble, Cloudflare R2, Claude API) injected as environment variables via Railway's secret management.
- No secrets in source files, config files, or committed `.env`.
- `.env.example` committed with placeholder values only.
- Secret rotation: documented in runbook (DevOps responsibility).

### 6.5 Authentication

- NextAuth v5 with email/OAuth provider. Session stored in Postgres (NextAuth adapter).
- Single-user app — only Atharva's account is valid. Registration page is absent; account is seeded via migration.
- Session cookies: `HttpOnly`, `Secure`, `SameSite=Strict`.
- CSRF: handled by NextAuth's built-in CSRF token on mutation endpoints.

### 6.6 File upload security

- MIME type validated server-side (magic bytes, not just extension).
- File size limit: 10MB hard limit enforced before streaming to storage.
- Filename sanitised before use as storage key (strip path traversal characters, UUID-prefix enforced).
- Files never served back with an executable MIME type — download-only signed URLs.

---

## 7. Scalability Considerations

This is a single-user system at v1. The scalability decisions here are about **pipeline reliability and correctness**, not horizontal scale.

### 7.1 Job queue durability

Ingestion is driven by an idempotent `/api/ingest` trigger invoked by a docker-compose worker loop on a 6-hour interval. The trigger is safe to retry: content-hash deduplication (see §7.3) means a re-run after a crash re-processes only genuinely new listings, never double-inserting. The worker container restarts automatically (`restart: unless-stopped`) so a crashed loop resumes on the next interval. This is the direct answer to silent pipeline failure, which is the highest operational risk (see MEP risk register).

### 7.2 Rate-limit budget management

| Source | Daily limit | Calls per 6-hour window | Worker schedule |
|---|---|---|---|
| Adzuna | 250 | ~40 | Every 6h, max 40 calls per run |
| Reed | 1000 | ~160 | Every 3h, max 160 calls per run |
| Jooble | generous | ~200 | Every 6h, max 200 calls per run |
| RemoteOK | zero-auth | 1 | Every 6h, single fetch (no key) |

- All adapters implement exponential backoff on 429 responses.
- Remaining-budget counter tracked in a Postgres table; workers check budget before calling.

### 7.3 Content-hash deduplication

`raw_job_ingestion.content_hash` carries a UNIQUE constraint. Duplicate jobs from multiple sources are structurally impossible to double-insert. This keeps the `jobs` table clean regardless of how many sources report the same listing.

### 7.4 Gov.uk CSV diff strategy

The full sponsor register CSV is ~9.5MB. Rather than processing the full file nightly:
1. Download CSV, compute row-level hash.
2. Compare against `sponsor_register.last_seen_hash` per row.
3. INSERT new rows, UPDATE changed rows, soft-delete absent rows (set `active = false`).
4. Only trigger sponsor-matcher re-runs for jobs whose employer name matched a changed row.

### 7.5 Future multi-user path

When/if multi-user is added: the `user_id` foreign key is on every relevant table from day one. Row-level security (Postgres RLS) can be activated as a layer without schema migration. The single-user assumption is not baked into the schema — it is only a product decision.

---

## 8. Technology Decisions Summary

| Component | Choice | ADR reference |
|---|---|---|
| Database | PostgreSQL | ADR-001 |
| Job sources | Adzuna + Reed + Jooble + RemoteOK | ADR-002 |
| Resume parsing | Claude API (structured JSON output) | ADR-003 |
| ORM | Prisma 7.8.0 | (no ADR — follows reference project, mature choice) |
| Ingestion trigger | `/api/ingest` + docker-compose worker loop | (no ADR — idempotent trigger + content-hash dedup, no Redis or queue dependency) |
| File storage | Cloudflare R2 | (no ADR — S3-compatible, free egress, owner-scoped signed URLs close IDOR) |
| Auth | NextAuth v5 | (no ADR — standard Next.js stack, session-in-Postgres aligns with single DB) |
| Hosting | Railway.app | (no ADR — managed Postgres + worker support, ~£5–20/month for solo) |
| Frontend | Next.js 16.2.7 + React 19 + shadcn/ui + Tailwind | (no ADR — matches jobsync reference, team familiarity) |

---

## 9. Deployment Architecture

```
GitHub (atharvak161/jobscope)
       │
       │ push to main
       ▼
GitHub Actions CI
  · typecheck
  · lint
  · unit tests
  · build
       │
       │ on success
       ▼
Railway.app deployment
  ├── Web service (Next.js app server)
  ├── Worker service (ingestion loop — POSTs /api/ingest on a 6h interval)
  └── Managed PostgreSQL (Railway Postgres plugin)

Cloudflare R2 (external — object storage, not Railway-managed)
Claude API (external — resume parsing only)
```

---

## 10. Monitoring and Observability

Owner: Director DevOps / Monitoring Engineer (separate deliverable).

Architecture-level requirements (must be satisfied before Director DevOps sign-off):

1. **Pipeline freshness alert:** If any job source has not successfully completed an ingestion run in >25 hours, fire an alert. This is the primary operational SLO.
2. **Health endpoint:** `/api/healthz` returns per-source ingestion freshness (age in hours, stale flag) and returns 503 if any source is stale. Uptime monitor polls this.
3. **Ingestion freshness monitoring:** `/api/healthz` flags any source not refreshed within 25h (indicates worker crash or rate-limit exhaustion). Alert on a 503 response.
4. **Sponsor register staleness alert:** If gov.uk CSV has not been successfully processed in >49 hours, alert.
5. **Error rate monitoring:** 5xx rate > 1% over 5-minute window → alert.

---

*Architecture document v1.0. DB Engineer, Backend Developer, and Integration Engineer may proceed. Frontend Developer may begin UI scaffolding against the API overview in §5. Full OpenAPI 3.0 spec (docs/api/jobscope-api.yaml) to follow after backend API routes are drafted.*
