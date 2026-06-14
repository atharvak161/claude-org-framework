# JobScope — Local Deployment

## Prerequisites
- Docker Desktop (Mac/Windows) or Docker Engine + Compose (Linux)
- API keys (see README.md)

## Start

```bash
cp .env.example .env   # fill in keys
docker-compose up      # builds app, starts PostgreSQL, runs migrations
```

Access at http://localhost:3000.

## Stop

```bash
docker-compose down          # stop containers
docker-compose down -v       # stop + delete database volume (full reset)
```

## Migration note

Migration 003 creates a GIN index with `CREATE INDEX CONCURRENTLY`. If `prisma migrate deploy` errors on this, run manually:

```bash
docker-compose exec db psql -U jobscope -d jobscope
# then:
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX CONCURRENTLY idx_jobs_title_trgm ON "Job" USING gin(title gin_trgm_ops);
CREATE INDEX CONCURRENTLY idx_jobs_company_trgm ON "Job" USING gin(company gin_trgm_ops);
```

## Rebuild after code changes

```bash
docker-compose up --build
```
