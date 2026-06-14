# Infrastructure Proposal — JobScope

**Owner:** Director DevOps / Infrastructure Engineer / SRE
**Project:** JobScope
**Date:** 2026-06-08
**Status:** Proposal — Infrastructure Engineer executes from this brief in Phase 1

---

## Hosting decision: Railway

**Chosen:** Railway.app
**Rationale:** Managed PostgreSQL (no DBA overhead), background worker support (separate services, not just cron), git-push-to-deploy workflow (no Kubernetes complexity for a solo project), ~$5–20/month operating cost, built-in environment variable management, rollback via deploy history.

**Alternatives considered and rejected:**
- Render.com: comparable pricing but poorer background worker isolation
- Fly.io: more complex networking model for a first deployment; overkill for single-user app
- AWS EC2/ECS: significant operational overhead; $50–100+/month minimum with managed RDS
- Heroku: price increase (2022) makes it significantly more expensive than Railway for equivalent capability
- Vercel (for Next.js): no persistent background worker support — would require a separate service for the job-fetching pipeline anyway, negating the convenience

---

## Service architecture on Railway

**Critical constraint:** The scheduler/background worker is a **separate Railway service** — not co-located with the HTTP server. Running background jobs inside the HTTP server process creates:
- Risk of job execution blocking request handling under load
- No independent scaling of the fetcher vs. the web server
- Loss of all in-flight jobs if the web process restarts (HTTP process restarts are expected and routine)
- No clean separation of concerns for monitoring and alerting

### Service 1: Web (Next.js HTTP server)

- Handles: all user-facing HTTP requests, API routes, authentication
- Railway service type: web service
- Deployment: triggered by push to `main` via GitHub Actions → Railway deploy hook
- Start command: `npm run start`
- Health check: `GET /healthz` (see monitoring section)

### Service 2: Worker (background job processor)

- Handles: job fetching workers (Adzuna, Reed, Jooble, gov.uk CSV), sponsor register diff, clearance detection pipeline, ghosting auto-detection, staleness alerts
- Railway service type: worker (no public port)
- Deployment: same repo, separate Railway service, same deploy trigger as web service
- Start command: `npm run worker`
- Queue: pg-boss (Postgres-backed job queue) — durable, survives worker process restarts, no additional Redis service needed

### Service 3: PostgreSQL

- Railway managed PostgreSQL (not self-managed)
- Version: PostgreSQL 16 (pg_trgm extension available by default on Railway managed Postgres)
- DATABASE_URL injected by Railway into both web and worker services — never in any file

---

## Per-source worker schedules and rate limits

Each job source has a dedicated pg-boss worker job type with its own schedule, independent retry state, and independent staleness tracking.

| Source | Schedule | Rate limit | Notes |
|---|---|---|---|
| Reed.co.uk | Every 90 seconds | ~1000 req/day | Primary volume source — highest frequency |
| Adzuna | Every 6 minutes | ~250 req/day | 250/day ÷ 240 runs/day = ~1 req/run — use for targeted queries, not broad sweeps |
| Jooble | Every 10 minutes | Generous (undocumented) | Fill-in source — run less frequently than Reed |
| gov.uk sponsor register CSV | Every 48 hours (diff-only) | No stated limit | Diff-only: download, compare to last known hash, process only changed rows |

### Timing note on gov.uk CSV

The gov.uk sponsor register CSV is updated by the Home Office approximately every 48 hours. Running the diff worker on the same 48h cycle means there will be slight lag (up to 48h) between a register update and JobScope reflecting it. This is explicitly accepted and disclosed in the UX (last-update date shown in sponsorship confidence tooltips).

If faster register refresh is needed in future: increase diff worker frequency to 24h. The diff logic ensures this is low cost (skip processing if CSV hash unchanged).

---

## Retry policy

All job-source workers follow a consistent retry policy:

```
Attempt 1 → wait 30 seconds → Attempt 2 → wait 60 seconds → Attempt 3 → wait 120 seconds → FAILED
```

On FAILED state:
- Source is suspended (no further attempts) until the next scheduled window
- Suspension is logged to the job queue (pg-boss failed jobs table)
- /healthz reflects the source as DEGRADED with last_successful_fetch timestamp

**Special case: HTTP 429 (rate-limited):**
- Source is suspended for **1 hour** from the time of the 429 response
- Suspension is independent of the normal retry cycle — the 3-retry counter resets after the 1h window
- pg-boss delay feature handles this: `jobs.schedule('adzuna-fetch', { startAfter: Date.now() + 3600000 })`

**Dead-letter table:**
- Failed jobs that exhaust all retries are moved to a dead-letter table (pg-boss's built-in `failed_jobs` table)
- Director DevOps reviews dead-letter table weekly in standard runbook check
- Any source with >3 failures in 1 hour: alert fires (see monitoring section)

---

## Monitoring MVP

This is the minimum viable monitoring setup for v1. It must be live before Director DevOps signs off.

### /healthz endpoint

The web service exposes `GET /healthz` returning JSON:

```json
{
  "status": "ok" | "degraded" | "unhealthy",
  "timestamp": "ISO8601",
  "sources": {
    "reed": {
      "status": "ok" | "degraded" | "stale",
      "last_fetched_at": "ISO8601",
      "last_job_count": 42,
      "consecutive_failures": 0
    },
    "adzuna": { ... },
    "jooble": { ... },
    "gov_uk_register": {
      "status": "ok" | "stale",
      "last_fetched_at": "ISO8601",
      "last_diff_count": 12
    }
  },
  "database": {
    "status": "ok" | "unreachable",
    "response_ms": 4
  }
}
```

### Staleness rule

A source is considered **stale** and returns status `"degraded"` if:

```
current_time - last_fetched_at > 2 × expected_interval
```

Examples:
- Reed (90s schedule): stale if not fetched in >3 minutes
- Adzuna (6min schedule): stale if not fetched in >12 minutes
- Jooble (10min schedule): stale if not fetched in >20 minutes
- gov.uk register (48h schedule): stale if not fetched in >96 hours

When any source is stale: overall `/healthz` returns `"degraded"` with HTTP status 200 (not 503, to avoid Railway health-check restarting the web process unnecessarily).

When the database is unreachable: `/healthz` returns `"unhealthy"` with HTTP 503.

### UptimeRobot (free tier)

- Monitor: `GET /healthz` every 5 minutes
- Alert condition: response is non-2xx OR response body contains `"status": "unhealthy"`
- Alert channel: email to atharvak161@gmail.com

### Failure alert rule

A more sensitive alert for sustained source failures (beyond staleness):

- Condition: any single source has ≥3 consecutive failures in a 1-hour window
- Implementation: pg-boss job failure hooks write to a `source_alerts` table; a separate alert-checker job queries this table every 10 minutes
- Alert channel: email (same UptimeRobot integration or a direct SMTP send from the worker)

This alert fires before UptimeRobot would (UptimeRobot checks overall healthz every 5 minutes; this fires on the 3rd consecutive failure within 1h, which could be within the first 6-12 minutes of an incident).

---

## Deployment gate — Director DevOps sign-off requirements

Director DevOps sign-off (DIRECTOR_DEVOPS_SIGNOFF.md) requires all of the following before v1 ships:

- [ ] **INFRASTRUCTURE_STANDARDS.md** filed to `docs/sre/` — defines what "production-ready" means for infrastructure on this project (not already created for Blueprint — this is the first clean-slate version)
- [ ] **RUNBOOK.md** filed to `docs/runbooks/job-tracker/` — covering: how to deploy, how to roll back, what to do when a source goes down, what to do when the database is unreachable, how to run a manual sponsor register refresh
- [ ] **`/healthz` verified** — endpoint exists, returns correct JSON shape, staleness rule triggers correctly (tested by temporarily suspending a source in the worker)
- [ ] **Staleness alert verified end-to-end** — UptimeRobot alert configured, a test degraded state was triggered, and the email arrived at atharvak161@gmail.com
- [ ] **CI/CD tested** — push to `main` triggers Railway deploy; deploy completes successfully; rollback tested (redeploy previous Railway build)
- [ ] **Railway rollback tested** — a redeploy to the previous build version was executed and verified working
- [ ] **Dead-letter table confirmed** — pg-boss failed_jobs table exists; a test failed job was observed in it
- [ ] **DIRECTOR_DEVOPS_SIGNOFF.md** filed by Director DevOps — referencing the specific commit hash and Railway deploy ID being signed off

---

## Cost estimate

| Service | Monthly cost |
|---|---|
| Railway PostgreSQL (1GB) | ~$5 |
| Railway web service | ~$5 |
| Railway worker service | ~$5 |
| Cloudflare R2 (resume storage, <1GB for single-user) | Free tier |
| UptimeRobot | Free tier |
| **Total estimate** | **~$15/month** |

All three job-board APIs (Reed, Adzuna, Jooble) and the gov.uk CSV are free at the usage levels required for a single-user tool.

Claude API (resume parsing): ~$0.01–0.05 per resume parse at current pricing. Estimated monthly cost: near-zero for a single user uploading/updating a resume occasionally.

---

## Lessons from Blueprint (do not repeat)

Blueprint deployed to production with:
- No infrastructure plan reviewed by Director DevOps
- No monitoring or alerting configured
- No SRE runbook
- No rollback documented or tested
- CI/CD pipeline working but undocumented

Full gap audit: docs/sre/BLUEPRINT_DEPLOYMENT_GAP_AUDIT.md

For JobScope, every item in the deployment gate above is a hard requirement. The DIRECTOR_DEVOPS_SIGNOFF.md must exist and must reference the exact commit hash and Railway deploy ID before v1 ships. No sign-off file = no ship.
