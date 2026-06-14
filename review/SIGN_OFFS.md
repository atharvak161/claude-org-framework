# Sign-offs — all department sign-offs collected here before any release.

## 2026-06-09 — VP Engineering — JobScope v1 Engineering Sign-Off

**VP_ENGINEERING SIGN-OFF — CONDITIONAL PASS — 2026-06-09 — JobScope v1**

Cleared to ship to private single-user Railway staging. NOT cleared for production / multi-user / public traffic until the two production conditions below are met.

Key strengths: (1) security designed in structurally — SSRF, file-download IDOR, and prompt injection (forced tool_use, stronger than spec) all verified PASS; (2) the SC/DV clearance-recall hard gate is met at 100% (16/16 REQUIRED-path tests, zero REQUIRED→NONE_DETECTED) — the single most important correctness property; (3) clean, pure, auditable matching engine with traceable match-reason strings, plus full engineering process (3 high-quality ADRs, current architecture doc, two signed department gates).

Notable finding: the IDOR write-path issue raised as Security C-01 is ALREADY RESOLVED in code — PATCH/DELETE `update` calls now scope `where: { id, userId: session.id }` (valid under Prisma 7.8.0 extended where). No P0 blocker for the staging ship.

Production blockers (P0 before any production / non-Atharva traffic):
- PROD-1 (CRITICAL): replace auth stub — `auth-config.ts authorize()` accepts any credentials and returns a hardcoded dev-user-id. Wire real NextAuth v5 DB-backed credential verification.
- PROD-2 (MEDIUM, raised to prod-blocking): add `src/config/allowed-external-hosts.ts` centralised allowlist + DNS-rebinding (RFC-1918) protection on the adapter HTTP client.

V1.1 backlog: 4 P1 bugs (BUG-001..004), CONFIRMED sponsor path + Prisma wiring, automated IDOR/SSRF/auth-bypass suites, LLM-parsing and API-integration test scaffolds, Zod-strip + FAILED path on Claude output, GDPR deliverables, ADR/arch doc model-name correction (haiku as-built vs sonnet documented).

Full report: docs/projects/job-tracker/VP_ENGINEERING_SIGNOFF.md

---

## 2026-06-09 — Director Security — JobScope v1 Pre-Ship Security Gate Review

**DIRECTOR_SECURITY SIGN-OFF — CONDITIONAL — 2026-06-09 — JobScope v1**

Gate verdict: CONDITIONAL — no critical exploitable vulnerabilities in current single-user v1 staging context. Three Critical requirements verified as PASS (file download IDOR, SSRF prevention, prompt injection defence). Auth stub is a known, documented, accepted gap for private Railway staging.

Five conditions issued:
- C-01 HIGH: PATCH/DELETE final `update` in `api/applications/[id]/route.ts` missing `userId` scope in WHERE clause. Not exploitable in v1 (single user). Hard blocker before multi-user.
- C-02 LOW: No Zod schema on Claude tool response. Manual field stripping is functionally equivalent. Add formal Zod + FAILED status path before v1.1.
- C-03 CRITICAL (prod blocker): `src/lib/auth.ts` is a dev stub (X-Dev-User-Id header). Must be replaced with NextAuth v5 before any production deployment or public traffic.
- C-04 MEDIUM: `src/config/allowed-external-hosts.ts` allowlist file absent. DNS rebinding protection absent. Hardcoded base URLs provide practical SSRF prevention. Allowlist and DNS check must be added before production.
- C-05 LOW: Description truncation (SR-08-07) not confirmed in ingestion worker. Must verify in `process-job.ts`.

Full v1 Director Security sign-off is withheld pending: C-01 and C-04 resolution, NextAuth v5 implementation, Compliance Auditor GDPR deliverables, and remaining gate item verification (Section 6 of full report).

Full review: docs/security/job-tracker/SECURITY_GATE_REVIEW.md

---

## 2026-06-09 — Director of QA — JobScope v1 QA Gate Review

**DIRECTOR_QA SIGN-OFF — CONDITIONAL — 2026-06-09 — JobScope v1**

Test results: 87 pass / 5 fail / 92 total across 4 suites.

Domain verdicts:
- Domain 1 (Fuzzy sponsor matching): PARTIAL — LIKELY/UNKNOWN tiers tested and passing; CONFIRMED not yet testable (DB unstubbed); 500-pair corpus absent; 2 normalisation bugs failing.
- Domain 2 (LLM resume parsing): FAIL — no tests exist; corpus and schema contract tests are v1.1 mandatory items.
- Domain 3 (Job API integration): FAIL — no tests exist; Pact contracts and degradation matrix are v1.1 mandatory items.
- Domain 4 (Clearance detection): PARTIAL — hard gate MET (100% REQUIRED recall, 16/16 REQUIRED-path tests pass); 200-JD corpus test absent; 1 PREFERRED classification bug (over-classifies "sc advantageous" as REQUIRED).
- Domain 5 (Security regression): PARTIAL — path traversal prevention tested (all 4 tests pass); IDOR implementation verified by code inspection (ownership enforced at DB query level on all application routes); SSRF and auth-bypass suites absent.

Critical paths (hard gates): SC REQUIRED recall = 100% MET. IDOR implementation verified. Sponsor LIKELY/UNKNOWN MET.

4 P1 bugs identified in failing tests (BUG-001 to BUG-004) — must be resolved in v1.1.
5 mandatory v1.1 test domains registered as backlog items (GAP-001 to GAP-010).

Conditional on v1.1 delivery of: BUG-001–004 fixed, IDOR automated test suite, SSRF test suite, Domain 2 and Domain 3 test scaffolds.

Full report: docs/qa/job-tracker/QA_GATE_REVIEW.md

---

## 2026-06-07 — Director of QA — Blueprint live regression pass (post-rename, post-bugfix)
What was signed off: Full regression pass of the live Blueprint deployment
(https://atharvak161.github.io/Blueprint/, commit d3f3c42, GitHub Actions run
27093810882) covering: clean app load (no console/page/network errors), sidebar
nav (All Projects/Resources/Holidays), project creation + all 4 report tabs
(Plan, Gantt Chart, Dashboard, RAG Status), back-navigation via breadcrumb and
sidebar from project detail, Import/Export buttons, "All Projects" naming
consistency sweep across every page, and localStorage persistence across reload.
27 automated checks executed: 25 PASS, 0 FAIL, 0 CONDITIONAL, 2 INFO.
Also confirmed the reported "0 projects" symptom is an expected empty
localStorage artifact of the URL path change (per-path scoping on GitHub Pages),
NOT a data-loading bug — verified by creating a project and confirming it
persists correctly across a page reload.
No new bugs found.
Verdict: PASS
Full report: docs/projects/blueprint/QA_REGRESSION_REPORT.md

---

## 2026-06-09 — Director DevOps — JobScope v1 Infrastructure Sign-Off

**DIRECTOR_DEVOPS SIGN-OFF — PASS — 2026-06-09 — JobScope v1**

Scope: Railway deployment configuration for JobScope (Next.js 16 / React 19,
Prisma 7 + PostgreSQL, Cloudflare R2, Anthropic Claude API). Reviewed against
the new organisation-wide Infrastructure Standards
(docs/sre/INFRASTRUCTURE_STANDARDS.md), authored as part of this work to close
the gap surfaced by the Blueprint deployment-readiness audit.

Artefacts reviewed:
- src/projects/jobscope/railway.toml
- src/projects/jobscope/nixpacks.toml
- src/projects/jobscope/src/app/api/healthz/route.ts
- src/projects/jobscope/prisma/migrations/ (001, 002, 003)
- docs/sre/job-tracker/RAILWAY_DEPLOY.md

Gate items checked:
| # | Gate item | Result | Evidence |
|---|---|---|---|
| 1 | Build runs `prisma generate` | PASS | railway.toml buildCommand `npm install && npx prisma generate && npm run build`; nixpacks.toml build phase runs `npx prisma generate` then `npm run build`. Codegen is explicit in the build, not reliant on postinstall alone. |
| 2 | Health check path `/api/healthz` | PASS | railway.toml `healthcheckPath = "/api/healthz"`. Endpoint verifies real DB connectivity (`SELECT 1`) and returns 503 if any job source is stale >25h — satisfies Standards §4.1 and the pipeline-freshness SLO. |
| 3 | Restart policy on failure | PASS | railway.toml `restartPolicyType = "ON_FAILURE"`, `restartPolicyMaxRetries = 3`. |
| 4 | Node 20 pinned | PASS | nixpacks.toml `nixPkgs = ["nodejs_20"]`. Runtime explicitly pinned, not platform default. |
| 5 | Secrets management | PASS | No secrets in repo; .env git-ignored, .env.example placeholder-only. Full env inventory documented in RAILWAY_DEPLOY.md §3; DATABASE_URL auto-injected by Railway. |
| 6 | Migration discipline (incl. CONCURRENTLY) | PASS | Migrations reviewed and version-controlled. 003_trgm_index.sql uses CREATE INDEX CONCURRENTLY; runbook §4 correctly documents running it outside Prisma's transaction wrapper and resolving via `prisma migrate resolve`. Aligns with Standards §3.3. |
| 7 | Rollback plan documented | PASS | RAILWAY_DEPLOY.md §7 documents Railway deployment-history rollback; additive-migration default keeps prior app version schema-compatible (Standards §5.2). |

Non-blocking observations (advisory, do not affect verdict):
- A1: `healthcheckTimeout = 30` (railway.toml) is well within the Standards §1.2
  max of 300s, but the healthz endpoint performs DB connectivity plus three
  per-source freshness queries. On a cold container start 30s is adequate but
  tight; if cold-start health-check flaps are observed post-launch, raise to
  60s. Tracked, not blocking.
- A2: External uptime monitor (UptimeRobot or equivalent) polling /api/healthz
  on a ≤5-min interval per Standards §4.2 is a launch follow-up to be confirmed
  by Monitoring Engineer once the public URL is live. The endpoint is built to
  support it; the external monitor wiring is the remaining step.
- A3: Migration 003 requires the documented manual step — release operator MUST
  follow RAILWAY_DEPLOY.md §4 for the pg_trgm GIN indexes; automated
  `prisma migrate deploy` will fail on the CONCURRENTLY statement by design.

Verdict: PASS. Deployment configuration meets all mandatory gate items. The
three advisory items are launch-time follow-ups, not blockers — JobScope v1 is
cleared for deployment to Railway.

Full standards: docs/sre/INFRASTRUCTURE_STANDARDS.md
Deployment runbook: docs/sre/job-tracker/RAILWAY_DEPLOY.md
