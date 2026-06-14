# Infrastructure Standards

**Owner:** Director DevOps
**Created:** 2026-06-09
**Status:** Active — organisation-wide standard
**Applies to:** ALL projects, ALL environments, ALL future releases

---

## 0. Why this document exists (read this first)

This standard was a **named gap surfaced by the Blueprint deployment-readiness
audit** (`docs/sre/BLUEPRINT_DEPLOYMENT_GAP_AUDIT.md`, 2026-06-07). Blueprint
shipped to production with zero of six deployment-gate checks ever run, no
rollback plan, no monitoring, and no written standard for downstream teams to
build against. The root cause was that `INFRASTRUCTURE_STANDARDS.md` — my own
mandated deliverable — did not exist, so Infrastructure Engineer, SRE,
Monitoring Engineer, and CI/CD Engineer were all operating without a written
bar to clear.

This document closes that gap. It is **not** JobScope-specific. Every clause
here applies to **every current and future project** in this organisation.
JobScope is simply the first release shipped under it. No release reaches the
Chief of Staff for go-ahead without conformance to this standard, evidenced by
a `DIRECTOR_DEVOPS` sign-off in `review/SIGN_OFFS.md` referencing the specific
commit and deploy target.

---

## 1. Deployment pipeline standards (CI/CD)

### 1.1 Required pipeline properties
Every project's deployment pipeline MUST:

1. **Be defined as code and version-controlled.** No manual console deploys.
   The deploy configuration (Railway `railway.toml` + `nixpacks.toml`, or a CI
   workflow file) lives in the repo and is reviewed like any other change.
2. **Build reproducibly.** Pin the runtime version explicitly (e.g. Node 20).
   Never rely on the platform default, which can change under you.
3. **Run the full build on every deploy**, including codegen steps. For any
   Prisma project the build command MUST include `prisma generate` so the
   client matches the committed schema. (JobScope satisfies this via a
   `postinstall: prisma generate` hook **and** an explicit build step — codegen
   must not depend solely on `postinstall`, which can be skipped with
   `--ignore-scripts`.)
4. **Fail closed.** A failed build, failed migration, or failed health check
   MUST abort the deploy and leave the previous version serving traffic. A
   pipeline that ships a broken build is worse than no pipeline.
5. **Be documented.** Every project has a deployment runbook (see §5) and an
   append-only deployment log. A pipeline nobody documented is a pipeline
   nobody can fix at 3am.

### 1.2 Health-check gate (mandatory)
A deploy is **not complete** until the platform confirms the application is
healthy:

- Every service MUST expose a health-check endpoint at **`/api/healthz`**
  (see §4).
- The deploy platform MUST be configured to poll that endpoint and **block
  promotion / hold the previous version** until it returns healthy.
- Health-check timeout: **300 seconds** maximum before the deploy is marked
  failed and rolled back.
- The health check MUST verify real dependencies (database connectivity at
  minimum), not just that the process is listening on a port. A process can be
  up and completely useless.

### 1.3 Build/test gate
- Lint and unit tests SHOULD run in CI before the deploy stage. A red test
  suite must not auto-promote to production.
- Dependency / supply-chain audit (`npm audit` or equivalent) is required at
  least once per release and its result logged. "No known vulnerabilities"
  means someone looked — not that nobody checked.

---

## 2. Environment variable & secrets management

### 2.1 Hard rules
1. **No secrets in code. Ever.** No API keys, database URLs, tokens, or
   passwords committed to the repository — not in source, not in config, not in
   `.env` files that are tracked. `.env` MUST be git-ignored; only `.env.example`
   (with placeholder values, no real secrets) is committed.
2. **Secrets live in the platform secrets manager.** On Railway, all secrets
   are set as Railway environment variables / shared variables — never baked
   into the image, never echoed into build logs.
3. **Least privilege.** Each secret is scoped to the service that needs it.
   Production and preview/staging environments use **separate** credentials.
4. **Rotation on exposure.** Any secret that touches a log, a screenshot, a PR,
   or a shared channel is considered compromised and MUST be rotated.

### 2.2 Required environment inventory
Every project documents its full env var inventory in `.env.example` and in the
deployment runbook, marking each as **secret** or **config**. For JobScope the
inventory is: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`,
`ANTHROPIC_API_KEY`, `R2_BUCKET`, `R2_ACCESS_KEY`, `R2_SECRET_KEY`,
`ADZUNA_APP_ID`, `ADZUNA_API_KEY`, `REED_API_KEY`, `JOOBLE_API_KEY`. All of the
above except `NEXTAUTH_URL` and `R2_BUCKET` are **secret**.

### 2.3 Validation
- `NEXTAUTH_SECRET` MUST be ≥32 characters.
- The application SHOULD fail fast on boot if a required env var is missing,
  rather than failing on first request in front of a user.

---

## 3. Database migration standards

### 3.1 Migration discipline
1. **Every schema change is a reviewed, version-controlled migration.** No
   ad-hoc `ALTER TABLE` against production. JobScope migrations live in
   `prisma/migrations/` and are reviewed before merge.
2. **Migrations are forward-only and additive by default.** Prefer adding
   columns/tables over renaming or dropping. Renames and drops are
   destructive and require the §3.2 procedure.
3. **Migrations run as a deploy step, before the new app version serves
   traffic**, and a failed migration MUST abort the deploy.

### 3.2 Destructive migrations (drop/rename/type-change/data-deletion)
A destructive migration MUST NOT run without:
1. A **verified, restorable backup** taken immediately before the migration,
   with the backup ID recorded in the deployment log.
2. **Director DevOps + DB owner sign-off** explicitly approving the destructive
   step.
3. A **documented rollback path** (restore-from-backup or compensating
   migration) written before the migration runs.
4. For column drops/renames on live tables: use the **expand/contract** pattern
   (add new → backfill → switch reads/writes → drop old in a later release)
   rather than a single breaking change.

### 3.3 Large indexes
- Any index created on a large or high-traffic table MUST use
  **`CREATE INDEX CONCURRENTLY`** to avoid taking a table-level write lock that
  blocks the application. (Note: `CONCURRENTLY` cannot run inside a transaction
  block — sequence it accordingly outside the wrapping migration transaction.)
- JobScope's `002_indexes.sql` and `003_trgm_index.sql` (pg_trgm GIN index) are
  reviewed against this rule; the trigram index in particular MUST be created
  concurrently in any environment where the table already holds data.

### 3.4 Backups
- Production database has automated daily backups with a minimum **7-day
  retention**.
- Restore is tested — an untested backup is a hope, not a backup.

---

## 4. Monitoring & alerting requirements

### 4.1 Health-check endpoint (mandatory for every service)
- Path: **`/api/healthz`**.
- Returns **200** when healthy; **503** when degraded or unhealthy.
- MUST verify database connectivity (not just process liveness).
- For JobScope, the endpoint additionally reports **job-source pipeline
  freshness** per source (Adzuna, Reed, Jooble) and returns **503 if any
  source is stale** — i.e. the ingestion pipeline has not produced fresh data
  in **>25 hours**. (Verified present at
  `src/projects/jobscope/src/app/api/healthz/route.ts`.)

### 4.2 SLOs and alerting
| Signal | SLO / threshold | Alert action |
|---|---|---|
| Uptime (health check 200) | ≥ 99.5% monthly | Page on sustained 503 / unreachable |
| `/api/healthz` returns 503 | 0 sustained | Alert immediately |
| **Pipeline freshness** | Data fetched within 25h | **Alert if pipeline has not run in >25h** (health check goes 503) |
| Deploy health check | Pass within 300s | Auto-rollback + alert on failure |
| Error rate (5xx) | < 1% of requests | Alert on sustained breach |

- An external uptime monitor (e.g. UptimeRobot) MUST poll `/api/healthz` on a
  ≤5-minute interval and alert on two consecutive failures or any 503.
- Alerts MUST route to a human. An alert nobody receives is decoration.

### 4.3 Logging
- Application and deploy logs are retained and queryable. Secrets MUST NOT
  appear in logs (see §2.1.4).

---

## 5. Rollback procedures

### 5.1 Every release has a rollback plan before it ships
No release is signed off without a documented, mechanically-verified rollback
path in its runbook. "We can probably figure it out" is not a rollback plan.

### 5.2 Standard rollback (Railway)
1. **Detect:** health check 503, alert fires, or error-rate breach.
2. **Decide:** if the new version is the cause, roll back immediately —
   diagnose after service is restored, not during the outage.
3. **Roll back:** redeploy the **previous known-good deployment** from
   Railway's deployment history (one-click redeploy of the prior image), OR
   revert the offending commit on `main` and let the pipeline redeploy.
4. **Database:** if the bad release included a schema migration, roll back code
   to a version compatible with the **current** schema. Because migrations are
   additive by default (§3.2), the previous app version remains
   schema-compatible; this is exactly why we forbid casual destructive
   migrations. If a destructive migration was involved, restore from the
   pre-migration backup recorded in the deploy log.
5. **Verify:** confirm `/api/healthz` returns 200 and the live site is
   functional — verify the **actual running site**, not just the pipeline
   status (the Blueprint blank-page incident shipped green and was only caught
   by checking the live page).
6. **Record:** log the rollback, root cause, and follow-up in the deployment
   log and, if user-facing, open an incident in `docs/sre/INCIDENT_LOG.md`.

### 5.3 Rollback SLO
- Time-to-rollback target: **< 15 minutes** from detection to restored service
  for a code-only rollback.

---

## 6. Deployment gate (the bar every release clears)

Before any release reaches the Chief of Staff for go-ahead, Director DevOps
confirms:

1. Infrastructure Engineer has reviewed the deployment config.
2. Pipeline builds reproducibly with pinned runtime and required codegen
   (`prisma generate`).
3. `/api/healthz` exists, is wired as the platform health check, and verifies
   real dependencies.
4. Secrets are in the platform secrets manager, none in code.
5. Migrations are reviewed; any destructive migration meets §3.2.
6. Monitoring/alerting is in place, including the >25h pipeline-freshness alert.
7. A rollback plan is documented and mechanically verified.
8. `DIRECTOR_DEVOPS` sign-off filed in `review/SIGN_OFFS.md` referencing the
   commit/deploy target.

A gate that exists on paper but does not run is not a gate. This one runs.

---

## 7. Scope statement (non-negotiable)

This standard applies to **all future projects** without exception. Any project
seeking a DevOps sign-off is measured against this document. Deviations require
an explicit, logged waiver from Director DevOps with a remediation deadline —
never a silent skip.
