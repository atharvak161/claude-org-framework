# JobScope — Prisma Schema Draft

**Owner:** DB Engineer  
**Status:** Implemented — see `prisma/schema.prisma`  
**Date:** 2026-06-08  
**Implemented:** 2026-06-09 by DB Engineer  
**Author:** Solution Architect  

> This is a starting-point schema, not the final Prisma file. The DB Engineer owns the actual migration file. This document specifies the model shapes, relationships, and required indexes so the DB Engineer has a concrete starting point rather than working from a blank slate. Every model below should map directly to a Prisma model.

---

## Implementation Status

**Prisma schema:** `src/projects/jobscope/prisma/schema.prisma` — complete, `prisma generate` passes clean.

**Migration sequence implemented:**

| File | Description | Status |
|---|---|---|
| `prisma/migrations/001_initial_schema.sql` | `CREATE EXTENSION pgcrypto + pg_trgm`, all enums, all tables with FK constraints | Done |
| `prisma/migrations/002_indexes.sql` | B-tree indexes: contentHash, userId on Application, userId+status on Application, source+sourceId on Job, feed composite index, salary range, employer name indexes | Done |
| `prisma/migrations/003_trgm_index.sql` | `CREATE INDEX CONCURRENTLY idx_sponsor_name_normalised_trgm ON "SponsorRegister" USING GIN ("nameNormalised" gin_trgm_ops)` — raw SQL only, cannot be expressed in Prisma | Done |
| `prisma/migrations/004_seed_sponsor_register.sql` | Full gov.uk CSV load — Integration Engineer deliverable | Pending |

**Seed file:** `src/projects/jobscope/prisma/seed.ts` — 1 test user, 10 real sponsor register rows (NCC Group, Deloitte, KPMG, BT, Vodafone, HSBC, PwC, BAE Systems, Accenture, Lloyds Bank), 5 sample jobs covering all clearance/confidence badge states.

**Deviations from draft (all intentional):**
- Prisma 7.x installed (not 5/6) — uses `prisma-client` generator and `prisma.config.ts` datasource pattern; schema adapted accordingly
- `Job.source` + `Job.sourceId` index added (not in draft) — required by dedup reference lookup during ingestion
- `SponsorRegister.active` index added (not in draft) — all sponsor-matcher queries filter `WHERE active = true`

---

## 1. Required Postgres extensions

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- trigram fuzzy matching for sponsor names
```

Both must be added to the initial migration file (before any CREATE TABLE statements).

---

## 2. Schema overview

```
User
 └─ UserProfile (1:1 — one active profile per user)
 └─ Application (1:many — user tracks many job applications)

Job (centralised normalised job record)
 └─ JobSponsorMatch (1:many — one job can have multiple match attempts; at most one per sponsor)
 └─ Application (1:many — a job can be in many users' trackers)

SponsorRegister (the gov.uk register, one row per licensed sponsor company)
 └─ JobSponsorMatch (1:many — one sponsor can match many jobs)

RawJobIngestion (pre-normalisation staging table — content-hash dedup happens here)
```

---

## 3. Prisma model definitions

### User

```prisma
model User {
  id            String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email         String       @unique
  emailVerified DateTime?
  name          String?
  image         String?
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  // NextAuth
  accounts      Account[]
  sessions      Session[]

  // JobScope
  profile       UserProfile?
  applications  Application[]
}
```

**Notes:** Standard NextAuth User model. UUIDs throughout — not sequential integers.

---

### UserProfile

```prisma
model UserProfile {
  id                  String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId              String    @unique @db.Uuid
  user                User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Resume storage
  resumeStorageKey    String?   // R2 object key: {userId}/{uuid}/{filename}
  resumeUploadedAt    DateTime?
  parseStatus         ParseStatus @default(PENDING)
                                  // PENDING | PROCESSING | PENDING_REVIEW | ACTIVE | FAILED

  // Parsed data (JSON — written by resume-parser worker, confirmed by user)
  skills              String[]  // ["penetration testing", "OSCP", "Python", ...]
  certifications      String[]  // ["CEH", "eJPT", "CompTIA Security+", ...]
  subDomains          String[]  // ["Penetration Testing", "GRC", "SOC", ...]
  experienceYears     Int?
  seniorityInferred   Seniority?  // JUNIOR | MID | SENIOR
  rolesJson           Json?     // [{title, employer, start, end}] — too variable for typed columns
  educationJson       Json?     // [{degree, institution, year}]

  // Filter defaults (loaded from parsed profile, editable by user)
  salaryMin           Int?      // Annual GBP
  salaryMax           Int?
  locationPrefs       String[]  // ["London", "Remote", "Hybrid"]
  seniorityPrefs      Seniority[]

  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt

  @@index([userId])
}

enum ParseStatus {
  PENDING
  PROCESSING
  PENDING_REVIEW
  ACTIVE
  FAILED
}

enum Seniority {
  JUNIOR
  MID
  SENIOR
}
```

**Notes:**
- `resumeStorageKey` is stored — never a URL. Signed URLs are generated on demand by the API layer with ownership check before signing.
- `skills`, `certifications`, `subDomains` as `String[]` (Postgres arrays) — simple to query, sufficient for single-user.

---

### Job

```prisma
model Job {
  id                  String          @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  
  // Source tracking
  source              JobSource       // ADZUNA | REED | JOOBLE | RSS_JSONLD | GOV_UK
  sourceId            String?         // source's own job ID (for dedup reference)
  sourceUrl           String?         // original job listing URL

  // Core fields
  title               String
  employer            String          // raw employer name from source
  employerNormalised  String          // after legal-suffix stripping + lowercase
  description         String          @db.Text
  salary              String?         // raw salary string from source
  salaryMinGbp        Int?            // normalised to annual GBP
  salaryMaxGbp        Int?
  location            String?         // raw location string
  locationNormalised  LocationType    // LONDON | REMOTE | HYBRID | UK_OTHER | UNKNOWN
  postedAt            DateTime?       // when the job was posted (from source)
  closedAt            DateTime?       // soft-closed when no longer appearing in source

  // Eligibility enrichment
  clearanceStatus     ClearanceStatus @default(NONE_DETECTED)
  seniority           Seniority?
  subDomain           String?         // classified cybersecurity sub-domain

  // Feed control
  feedVisible         Boolean         @default(true)
  isActive            Boolean         @default(true)   // false when stale-closed

  createdAt           DateTime        @default(now())
  updatedAt           DateTime        @updatedAt

  // Relations
  sponsorMatches      JobSponsorMatch[]
  applications        Application[]

  @@index([employer])
  @@index([employerNormalised])
  @@index([postedAt])
  @@index([clearanceStatus])
  @@index([feedVisible, isActive, postedAt(sort: Desc)])   // primary feed query index
  @@index([salaryMinGbp, salaryMaxGbp])
}

enum JobSource {
  ADZUNA
  REED
  JOOBLE
  RSS_JSONLD
  GOV_UK
}

enum ClearanceStatus {
  REQUIRED
  PREFERRED
  NONE_DETECTED
}

enum LocationType {
  LONDON
  REMOTE
  HYBRID
  UK_OTHER
  UNKNOWN
}
```

---

### Application

```prisma
model Application {
  id                  String              @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId              String              @db.Uuid
  user                User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  jobId               String              @db.Uuid
  job                 Job                 @relation(fields: [jobId], references: [id])

  status              ApplicationStatus   @default(SAVED)
  
  // Snapshot at time of application (values may change on the job record later)
  sponsorConfidenceAtApply  SponsorConfidence?
  clearanceStatusAtApply    ClearanceStatus?
  salaryOffered       Int?                // Annual GBP, if known
  
  // Tracking fields
  appliedAt           DateTime?
  recruiterName       String?
  recruiterEmail      String?
  recruiterAgency     String?
  notes               String?             @db.Text
  ghostingFlaggedAt   DateTime?           // set when >21 days at Applied with no update
  
  createdAt           DateTime            @default(now())
  updatedAt           DateTime            @updatedAt

  @@unique([userId, jobId])               // one application record per user per job
  @@index([userId, status])
  @@index([userId, appliedAt])
  @@index([status, appliedAt])            // ghosting detector query
}

enum ApplicationStatus {
  SAVED
  APPLIED
  APPLICATION_ACKNOWLEDGED
  INTERVIEW_SCHEDULED
  INTERVIEWING
  OFFER
  ACCEPTED
  REJECTED
  GHOSTED
  WITHDRAWN
}

enum SponsorConfidence {
  CONFIRMED
  LIKELY
  LOW_CONFIDENCE
  UNKNOWN
}
```

---

### SponsorRegister

```prisma
model SponsorRegister {
  id                  String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  
  // Raw fields from gov.uk CSV
  name                String    // as appears on the register
  townCity            String?
  county              String?
  typeRating          String?   // e.g. "Worker", "Temporary Worker"
  route               String[]  // Skilled Worker, Intra-company Transfer, etc.

  // Normalised for matching
  nameNormalised      String    // lowercase, no legal suffixes, no punctuation
  
  // Register metadata
  active              Boolean   @default(true)   // false if removed from latest CSV
  lastSeenAt          DateTime                   // last time this row appeared in CSV
  suspendedAt         DateTime?                  // if suspended by Home Office
  lastUpdated         DateTime  @updatedAt

  // Relations
  jobMatches          JobSponsorMatch[]

  @@index([nameNormalised])
  // pg_trgm GIN index — must be added as raw SQL in migration, not via Prisma:
  // CREATE INDEX idx_sponsor_name_trgm ON "SponsorRegister" USING GIN (name_normalised gin_trgm_ops);
}
```

**DB Engineer note:** The `pg_trgm` GIN index on `nameNormalised` cannot be expressed in Prisma schema syntax. It must be added as a raw SQL statement in the migration file:
```sql
CREATE INDEX idx_sponsor_name_normalised_trgm 
ON "SponsorRegister" 
USING GIN ("nameNormalised" gin_trgm_ops);
```
This index is critical — the sponsor-matching engine's fuzzy query (`similarity("nameNormalised", $1) >= 0.60`) must use it. Without it, every ingestion batch runs a full sequential scan of ~60,000 rows.

---

### JobSponsorMatch

```prisma
model JobSponsorMatch {
  id                  String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  jobId               String            @db.Uuid
  job                 Job               @relation(fields: [jobId], references: [id], onDelete: Cascade)
  sponsorId           String            @db.Uuid
  sponsor             SponsorRegister   @relation(fields: [sponsorId], references: [id])

  confidenceTier      SponsorConfidence
  matchReason         String            // e.g. "exact_match", "trgm_0.92", "jd_explicit"
  similarityScore     Float?            // pg_trgm similarity score if applicable
  
  createdAt           DateTime          @default(now())

  @@unique([jobId, sponsorId])          // one match record per job-sponsor pair
  @@index([jobId, confidenceTier])
  @@index([sponsorId])
}
```

---

### RawJobIngestion

```prisma
model RawJobIngestion {
  id                  String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  source              JobSource
  contentHash         String    @unique  // SHA-256 dedup key
  rawJson             Json                // full raw API response payload
  processedJobId      String?   @db.Uuid // populated once normalised to jobs table
  ingestedAt          DateTime  @default(now())

  @@index([source, ingestedAt])
  @@index([contentHash])               // unique constraint implies index; explicit for clarity
}
```

**Notes on `contentHash`:**
- Hash input: `SHA-256(title + employer + location + description[:200])`
- The UNIQUE constraint on `contentHash` is the deduplication mechanism. INSERT with `ON CONFLICT (content_hash) DO NOTHING` — no application-layer dedup logic needed.
- `processedJobId` is null until the normalisation worker picks up this row and creates the `Job` record.

---

## 4. NextAuth adapter models

Standard NextAuth v5 Prisma adapter models. Do not modify these — use the official `@auth/prisma-adapter` package which generates them.

```
Account
Session
VerificationToken
```

These will be generated by the NextAuth adapter. DB Engineer should install `@auth/prisma-adapter` and run `prisma migrate dev` to include them.

---

## 5. Required migration sequence

1. `001_extensions.sql` — `CREATE EXTENSION pgcrypto; CREATE EXTENSION pg_trgm;`
2. `002_initial_schema.sql` (generated by Prisma from above models)
3. `003_trgm_index.sql` — add GIN trigram index on `SponsorRegister.nameNormalised` (raw SQL, cannot be expressed in Prisma schema)
4. `004_seed_sponsor_register.sql` (Integration Engineer will provide first gov.uk CSV load)

---

## 6. Key design decisions captured here

| Decision | Rationale |
|---|---|
| UUID v4 IDs everywhere (not sequential int) | IDOR prevention — guessing IDs is structurally infeasible |
| `contentHash` UNIQUE on `RawJobIngestion` | Dedup is enforced at DB constraint level, not application logic |
| `nameNormalised` column on `SponsorRegister` | Separate normalised column enables GIN index; original name preserved for display |
| `pg_trgm` GIN index (raw SQL migration) | Must be done in raw SQL — Prisma cannot express GIN indexes with `gin_trgm_ops` |
| `sponsorConfidenceAtApply` snapshot on `Application` | Register changes shouldn't mutate historical application records; snapshot at application time |
| `@@unique([userId, jobId])` on `Application` | Prevents duplicate tracker entries; one application record per user per job |
| `rolesJson` and `educationJson` as `Json` columns on `UserProfile` | Too variable in structure to type as fixed columns; validated by Zod before insert |
| `feedVisible` + `isActive` composite index on `Job` | Primary feed query (`WHERE feedVisible = true AND isActive = true ORDER BY postedAt DESC`) needs this index |
