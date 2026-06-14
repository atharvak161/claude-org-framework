# ADR-001: PostgreSQL over SQLite

## Status: Accepted

## Date: 2026-06-08

## Context

JobScope requires a relational database to store job listings, application state, sponsor register data, and user profile data. The reference project (Gsync/jobsync, MIT-licensed) uses SQLite as its database.

**Forces at play:**

1. **Concurrent ingestion workers.** The data pipeline runs multiple background workers simultaneously — Adzuna, Reed, and Jooble adapters can overlap with the gov.uk CSV nightly diff and the sponsor-matcher. SQLite's write lock serialises all writes; under concurrent workers, this causes either write failures or worker serialisation that defeats the purpose of parallel ingestion.

2. **pg_trgm for fuzzy sponsor-name matching.** The sponsor-matching engine requires trigram similarity scoring against the entire sponsor register (~60,000 company names). PostgreSQL's `pg_trgm` extension provides a native `similarity()` function and a GIN trigram index that supports index-accelerated similarity queries. SQLite has no equivalent — a pure-application-layer Levenshtein or bigram approach would require loading all 60,000 rows into memory per query, would be slower, and would not benefit from incremental index updates when the register changes.

3. **Migration story.** PostgreSQL with Prisma Migrate provides versioned, rollback-capable migrations. SQLite's migration story (especially with Prisma) is more brittle; `prisma migrate dev` warns about data loss on SQLite for many schema changes.

4. **Documented failure mode in reference project.** Jobsync (the reference project) has a known Docker volume write-failure issue (#65) traceable to SQLite file-lock contention in containerised environments. This is a solved-in-advance problem by switching databases.

5. **Hosting environment.** Railway.app offers managed PostgreSQL as a native plugin at approximately £5/month additional. There is no managed SQLite offering; self-managed SQLite in a container on Railway carries the exact file-persistence failure mode documented in jobsync issue #65.

## Decision

Use **PostgreSQL 15+** as the sole database for JobScope, with **Prisma 6** as the ORM.

Enable the `pg_trgm` extension immediately on schema initialisation. Use Railway's managed PostgreSQL plugin for hosting.

## Rationale

PostgreSQL is the correct choice on all five dimensions listed in Context:

- It handles concurrent writes from multiple workers without lock contention.
- `pg_trgm` solves the fuzzy sponsor-name matching requirement natively, with index support, at the database layer.
- Prisma Migrate on PostgreSQL is a mature, reliable workflow with no data-loss edge cases on common schema operations.
- It eliminates the Docker volume write-failure failure mode by design.
- Railway's managed Postgres is straightforward to provision and removes operational overhead.

## Alternatives considered

### SQLite (rejected)

**Rejected** for the following reasons:
- Single-writer model conflicts with the concurrent ingestion pipeline. Three job-source adapters running simultaneously would serialise or fail on write contention.
- No `pg_trgm` or equivalent. Fuzzy sponsor matching would require a full table scan or an application-layer implementation with no index acceleration — unsuitable for 60,000+ rows queried on every ingestion batch.
- Documented write failure under Docker volume on Railway (jobsync issue #65). We have direct evidence this causes production failures in the exact deployment environment we target.
- Prisma's SQLite migration support is weaker; compound column changes frequently trigger shadow-database issues.

### PlanetScale MySQL (rejected)

**Rejected** because:
- PlanetScale's branching and schema-change model (no foreign keys by default, no `ALTER TABLE` in normal workflow) introduces significant operational complexity for what is a solo-developer project.
- MySQL lacks `pg_trgm`. Fuzzy matching would require `FULLTEXT` index with `MATCH ... AGAINST`, which is less flexible and less accurate for company-name similarity scoring.
- The free tier was eliminated by PlanetScale in 2024; minimum cost is now ~$39/month, which is disproportionate for a single-user tool.
- No compelling advantage over PostgreSQL for this use case.

### Neon (serverless PostgreSQL) (evaluated, not selected)

Neon provides serverless PostgreSQL with a generous free tier. It is a PostgreSQL-compatible option and would handle concurrent writes. Not selected as the primary choice because:
- Railway's managed Postgres is co-located with the application, reducing latency for the ingestion pipeline.
- Neon's cold-start latency is acceptable for API requests but less ideal for a high-frequency background worker.
- One less external dependency. Railway Postgres + app server on the same platform simplifies networking, secrets injection, and billing.

Neon remains a viable alternative if Railway Postgres proves problematic.

## Consequences

**Positive:**
- `pg_trgm` GIN index enables sub-millisecond similarity queries across the full sponsor register — the matching engine is fast by default, not fast-if-we-optimise-later.
- Concurrent ingestion workers are first-class citizens — no architectural contortion needed.
- Full Prisma Migrate workflow available from day one.
- Eliminates the documented Docker-volume write failure failure mode.
- Row-level security (RLS) available if multi-user is added in future — no schema migration required.

**Negative / trade-offs:**
- Slightly higher hosting cost (~£5/month for Railway managed Postgres vs. zero for SQLite).
- Slightly more complex local development setup (requires Docker or a local Postgres instance). Mitigated by providing a `docker-compose.yml` for local dev (DB Engineer responsibility).
- Postgres is a heavier process than SQLite. Irrelevant at single-user scale; relevant only if the tool were to run on a resource-constrained device (it is not — it runs on Railway).

## Review date

Reconsider if: (a) PostgreSQL on Railway incurs unexpected costs that make the project uneconomical, or (b) a requirement emerges that PostgreSQL cannot satisfy. No anticipated trigger.
