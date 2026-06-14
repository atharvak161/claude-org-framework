# Phase 1 Task Decomposition — JobScope

**Project:** JobScope
**Phase:** 1 — Architecture
**Owner:** Senior Project Manager
**Date:** 2026-06-08
**MEP reference:** /Users/atharva/.claude/plans/mighty-enchanting-manatee.md

---

## Phase 1 objective

Establish the architectural foundation that all subsequent phases depend on. No backend or database work of any consequence begins until Phase 1 is complete.

Phase 1 runs three parallel streams:
- **Stream A:** Solution Architect — architecture document + ADRs + DB schema (gates Phase 2 entirely)
- **Stream B:** Infrastructure Engineer — GitHub repo + Railway project + CI/CD skeleton (parallel; gates deployment path)
- **Stream C:** Director Security — Threat model (parallel; gates security-aware implementation in Phase 2)

---

## Task 1 — Solution Architect: Architecture Document + 3 ADRs

**Owner:** Solution Architect
**Status:** NOT STARTED (as of 2026-06-08 — Infrastructure Engineer noted as already spawned at 22:29:30)
**Priority:** CRITICAL PATH — gates Phase 2 entirely

### Inputs

- Approved MEP: /Users/atharva/.claude/plans/mighty-enchanting-manatee.md
- Reference project (anti-pattern reference, not a fork): github.com/Gsync/jobsync
- WORKSPACE.md directory ownership rules

### Outputs

1. **`docs/architecture/JOBSCOPE_ARCHITECTURE.md`** — full system architecture covering:
   - Stack rationale (Next.js 15 + PostgreSQL + Prisma 6 + pg-boss + Claude API + Railway)
   - Data pipeline diagram (Adzuna/Reed/Jooble → ingestion → normalisation → sponsor matcher → clearance detector → eligibility scorer → user feed)
   - Resume parsing pipeline (upload → extraction → Claude API structured JSON → human review → user_profile)
   - Fuzzy sponsor-name matching algorithm (normalise → exact match → pg_trgm ≥0.85 → 0.60–0.84 manual queue → <0.60 UNKNOWN)
   - Security architecture: owner-scoped signed URLs, no user-controlled URL fetching, session-based auth
   - Component boundaries and ownership (which services own which data)

2. **`docs/adr/ADR-001-postgresql-over-sqlite.md`** — decision record: PostgreSQL chosen over SQLite
   - Must cover: concurrent ingestion workers, pg_trgm for fuzzy matching, migration story, jobsync's Docker volume write-failure issues with SQLite
   - Format: WORKSPACE.md ADR convention (ADR-NNN-kebab-title.md)

3. **`docs/adr/ADR-002-job-source-integration-approach.md`** — decision record: multi-source adapter pattern
   - Must cover: Adzuna (250 req/day), Reed (1000/day primary), Jooble (generous limits), RSS/JSON-LD for tracked ATS career pages
   - Must cover: why LinkedIn is explicitly excluded (hiQ Labs v. LinkedIn precedent — $500k judgment risk)
   - Must cover: rate-limit strategy, per-source workers, backoff, deduplication by content hash

4. **`docs/adr/ADR-003-resume-parsing-approach.md`** — decision record: pdfplumber/python-docx + Claude API
   - Must cover: why LLM-based extraction over regex/template parsing (handles messy layouts)
   - Must cover: structured-output mode for schema enforcement
   - Must cover: mandatory human review/correction step before profile activates matching engine
   - Must cover: expected cost at single-user scale, caching of parsed profiles

### Acceptance criteria

- [ ] ARCHITECTURE.md covers all 5 sections listed above with no gaps
- [ ] All 3 ADRs follow WORKSPACE.md naming convention (ADR-NNN-kebab-title.md)
- [ ] Each ADR includes: Context, Decision, Rationale, Alternatives considered, Consequences
- [ ] Architecture explicitly addresses the 4 jobsync security anti-patterns (SSRF, IDOR on file download, systemic IDOR, auth weaknesses) with structural mitigations
- [ ] pg_trgm confidence thresholds (0.85 CONFIRMED, 0.60-0.84 LOW, <0.60 UNKNOWN) are specified
- [ ] Architecture doc does not contain any actual code — diagrams and prose only
- [ ] Director Security can begin threat model from the architecture doc without needing clarification

### Dependencies

- None — this is the root task for Stream A

### Unblocks

- Task 2 (DB Engineer): cannot start until ADRs 1, 2, 3 are complete
- Integration Engineer (Phase 2): cannot start adapter implementation until ADR-002 is complete
- Backend Developer (Phase 2): cannot start queue + matching engine until architecture doc is complete
- Frontend Developer (Phase 4): cannot start until API contracts are defined (derived from architecture doc)

---

## Task 2 — DB Engineer: Initial Prisma Schema

**Owner:** DB Engineer
**Status:** BLOCKED — starts only after Task 1 (Solution Architect) completes
**Priority:** HIGH — gates Phase 2 Integration Engineer and Backend Developer work

### Dependency gate

**Do not start until:** Solution Architect delivers ARCHITECTURE.md + all 3 ADRs (Task 1 complete). DB Engineer reads architecture doc in full before writing a single line of schema.

### Inputs

- docs/architecture/JOBSCOPE_ARCHITECTURE.md (Task 1 output)
- docs/adr/ADR-001-postgresql-over-sqlite.md (Task 1 output)
- Approved MEP (data model section)

### Outputs

1. **`docs/data/JOBSCOPE_SCHEMA.md`** — schema design document covering:
   - Entity-relationship diagram (text-based Mermaid or table format)
   - All 5 core tables with full field list, types, and constraints
   - Index strategy: pg_trgm index on normalised company name, composite indexes on job feed queries
   - Reasoning for nullable vs. required fields per entity

2. **`src/db/migrations/001_initial_schema.sql`** — Prisma migration file covering:
   - `User` table (id UUID opaque, email, created_at)
   - `Job` table (id, source, external_id, title, company_name, company_name_normalised, description_hash for dedup, salary_min, salary_max, location, seniority_detected, clearance_flag ENUM {REQUIRED/PREFERRED/NONE_DETECTED}, sponsor_confidence ENUM {CONFIRMED/LIKELY/UNKNOWN}, sponsor_match_score FLOAT, posted_at, fetched_at, soft_closed BOOL)
   - `SponsorRegister` table (id, company_name, company_name_normalised, tier, suspended_at, added_at, last_updated)
   - `Application` table (id, user_id FK, job_id FK, status ENUM full pipeline, sponsor_confidence_at_apply, clearance_status_at_apply, salary_offered, recruiter_contact, applied_at, notes, ghosted_auto_flagged)
   - `UserProfile` table (id, user_id FK, resume_raw_storage_key, skills JSON, roles JSON, certs JSON, experience_years INT, education JSON, activated BOOL, created_at, updated_at)
   - pg_trgm extension enablement
   - GIN index on company_name_normalised for trigram similarity queries
   - All FK constraints and ON DELETE rules

### Acceptance criteria

- [ ] All 5 tables present with field types, nullability, defaults, and FK constraints
- [ ] pg_trgm extension enabled and GIN index on normalised company name columns
- [ ] No sequential or guessable IDs exposed — all PKs are UUIDs (opaque)
- [ ] clearance_flag and sponsor_confidence use ENUMs not magic strings
- [ ] Application status pipeline matches MEP exactly (Discovered → Saved → Applied → Application Acknowledged → Interview Scheduled → Interviewing → Offer → Accepted/Rejected/Ghosted)
- [ ] Schema doc (JOBSCOPE_SCHEMA.md) is complete and readable without the migration file
- [ ] Migration file follows WORKSPACE.md naming: 001_initial_schema.sql

### Dependencies

- Task 1 (Solution Architect) complete

### Unblocks

- Integration Engineer (Phase 2): can begin adapter implementation
- Backend Developer (Phase 2): can begin queue, deduplication, sponsor matcher, clearance detector

---

## Task 3 — Infrastructure Engineer: GitHub Repo + Railway + CI/CD Skeleton

**Owner:** Infrastructure Engineer
**Status:** IN PROGRESS (spawned 2026-06-08 22:29:30 per LIVE.md)
**Priority:** HIGH — parallel with Stream A; gates deployment path for Phase 2

### Inputs

- Approved MEP (repo name, tech stack, hosting decision)
- WORKSPACE.md

### Outputs

1. **GitHub repository `atharvak161/jobscope`** — public, with:
   - MIT license
   - Initial README (project name, purpose, "Scope" name rationale, tech stack, status: Phase 1 in progress)
   - Branch protection on `main` (require PR review before merge, no direct push to main)
   - `.gitignore` appropriate for Next.js + Node.js + Python

2. **`.env.example`** — template showing all expected environment variable names (no values — see Rule 8 WORKSPACE.md):
   - DATABASE_URL
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL
   - ADZUNA_APP_ID / ADZUNA_APP_KEY
   - REED_API_KEY
   - JOOBLE_API_KEY
   - ANTHROPIC_API_KEY
   - S3_BUCKET / S3_ENDPOINT / S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY (for R2/S3 resume storage)
   - RAILWAY_* (as needed)

3. **Railway project** — provisioned with:
   - Managed PostgreSQL service created
   - Environment variables structure set up (no real values in files)
   - Background worker service defined (separate from HTTP server — per Infrastructure Proposal)
   - GitHub → Railway deploy hook configured

4. **CI/CD skeleton** — `.github/workflows/ci.yml`:
   - Trigger: push to any branch + pull_request to main
   - Steps: install dependencies → typecheck → lint → unit tests (empty, passes)
   - Does NOT deploy (deployment is Railway-driven); CI skeleton just validates PRs
   - Secret references use GitHub Actions secrets, no hardcoded values

5. **`docs/sre/JOBSCOPE_REPO_SETUP.md`** — record of what was created, Railway project ID, repo URL, how to get started locally

### Acceptance criteria

- [ ] `atharvak161/jobscope` exists on GitHub and is public
- [ ] Branch protection on `main` is active (no direct push)
- [ ] `.env.example` lists all environment variables; no real secrets anywhere in repo
- [ ] Railway PostgreSQL service exists and DATABASE_URL is in Railway environment (not in any file)
- [ ] CI skeleton runs and passes on an empty push
- [ ] Background worker service is defined as a separate Railway service (not co-located with HTTP server)
- [ ] JOBSCOPE_REPO_SETUP.md filed to docs/sre/ with repo URL and Railway project details

### Dependencies

- None — parallel with Task 1 and Task 3

### Unblocks

- All Phase 2 development work (developers need a repo to push to)
- Director DevOps deployment gate (needs Railway project to be set up)

---

## Task 4 — Director Security: Threat Model

**Owner:** Director Security
**Status:** NOT STARTED — parallel with Stream A
**Priority:** HIGH — informs Phase 2 security-aware implementation; must not be an afterthought

### Note on timing

Director Security begins immediately, parallel with Solution Architect. The threat model should be drafted from the MEP's known architecture (see MEP section "Technical architecture"). Once ARCHITECTURE.md is complete, Director Security updates the threat model with any architecture-level refinements. The threat model does not block Phase 1 completion but must be complete before any Phase 2 security-sensitive code merges.

### Inputs

- Approved MEP (threat identification section + feature list)
- docs/security/job-tracker/THREAT_MODEL_PROPOSAL.md (department proposal — already filed)
- docs/security/BLUEPRINT_SECURITY_GAP_REVIEW.md (lessons learned — what jobsync got wrong)
- docs/architecture/JOBSCOPE_ARCHITECTURE.md (Task 1 output — incorporate when available)

### Outputs

1. **`docs/security/job-tracker/THREAT_MODEL.md`** — full threat model covering:
   - Asset inventory (resume files = High Sensitivity PII, job data, user credentials, application history)
   - STRIDE analysis per component (ingestion workers, resume upload endpoint, sponsor matcher, user-facing API)
   - Explicitly addressed jobsync anti-patterns: SSRF, IDOR on file download, systemic IDOR, auth weaknesses
   - UK GDPR / DPA 2018 data classification for resume data (Article 9(2)(a) consent, 12-month retention, right-to-erasure endpoint)
   - Attack surface boundaries
   - Risk ratings per threat

2. **`docs/security/job-tracker/SECURITY_REQUIREMENTS.md`** — actionable requirements for developers:
   - No user-controlled URLs anywhere in the server-side code
   - Owner-scoped signed URLs for all file access (no sequential/guessable file IDs)
   - Service-layer ownership check on every DB query that touches user-owned data
   - httpOnly session tokens; no localStorage JWTs
   - Envelope encryption for resume data at rest (DEK + master key, key never in DB)
   - All job description fields HTML-encoded before display
   - AI prompts must wrap job content in delimited blocks (prompt injection prevention)
   - CSV (gov.uk sponsor register) parsed in background worker with schema validation
   - Explicit consent flow required before resume storage activates

### Acceptance criteria

- [ ] All 4 jobsync anti-patterns are explicitly modelled with mitigations
- [ ] Resume data classified High Sensitivity; GDPR obligations (consent, retention, erasure) specified
- [ ] STRIDE analysis covers all 4 major components (ingestion, upload, matcher, API)
- [ ] SECURITY_REQUIREMENTS.md is actionable — each requirement is a testable pass/fail, not vague guidance
- [ ] Risk ratings assigned (Critical/High/Medium/Low) per threat
- [ ] Threat model does not contain implementation code — it specifies requirements, not solutions

### Dependencies

- MEP (available now)
- Incorporates ARCHITECTURE.md when Task 1 completes (non-blocking — start from MEP, update from architecture doc)

### Unblocks

- Phase 2: Backend Developer and Integration Engineer security-aware implementation
- Phase 5: Director Security sign-off (the gate check is against this threat model)

---

## Phase 1 completion criteria

Phase 1 is complete when ALL of the following are satisfied:

- [ ] Task 1: ARCHITECTURE.md + ADR-001 + ADR-002 + ADR-003 filed and reviewed by Senior PM
- [ ] Task 2: JOBSCOPE_SCHEMA.md + 001_initial_schema.sql filed and reviewed by Senior PM
- [ ] Task 3: GitHub repo exists, Railway provisioned, CI/CD passes, JOBSCOPE_REPO_SETUP.md filed
- [ ] Task 4: THREAT_MODEL.md + SECURITY_REQUIREMENTS.md filed and reviewed by Senior PM
- [ ] Senior PM updates org/STATUS.md: Phase 1 COMPLETE, Phase 2 UNBLOCKED
- [ ] Senior PM updates org/BLOCKERS.md: BLOCKER-001 closed

**Phase 2 kickoff:** DB Engineer, Integration Engineer, and Backend Developer are spawned simultaneously the moment Phase 1 is marked complete.

---

## Timeline estimate

Phase 1 is estimated at 1 iteration. Parallel streams mean all three groups (SA, Infra, Security) deliver simultaneously — not sequentially.

Critical path: Task 1 (Solution Architect) → Task 2 (DB Engineer, starts immediately after Task 1)

If Solution Architect or DB Engineer takes >2x expected time: Senior PM escalates to Chief of Staff per MEP escalation rules.
