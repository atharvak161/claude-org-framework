# Backend Specification — Financial Dashboard
**Authored:** 2026-06-01
**Author:** Backend Developer
**Status:** Speculative — no backend exists; this document describes what one would look like
**Input sources:** `js/store.js`, `js/defaults.js`, `docs/projects/financial-dashboard/ARCHITECTURE_REVIEW.md`

---

## 1. When Would a Backend Be Needed?

The current architecture is entirely client-side: all data lives in `localStorage`, all computation runs in the browser, and the "auth" layer is a PBKDF2-derived AES key held in a service worker. This is sufficient for one person on one browser. A backend becomes necessary the moment any of the following become true.

### 1.1 Multi-device sync

If Atharva opens the dashboard on a phone, the data is missing — it lives in a different browser's `localStorage`. If he clears browser data, everything is gone. If his laptop dies, everything is gone. A backend transforms the authoritative data store from "one browser's localStorage" to "a server", and every device becomes a thin client that reads from and writes to that server.

**Trigger:** The user wants to see the same data on more than one device.

### 1.2 Sharing with a partner or accountant

The current model has no concept of users. There is one account, protected by a single master password. If a partner wants read access to see the India trip budget or current net worth, the only option is to share the master password, giving full write access to everything. A backend enables proper access control: user A has owner access, user B has read-only access to specific sections.

Similarly, if an accountant needs to review the tax tracker or India income log, the current model requires either handing over credentials or manually exporting data. A backend enables scoped API tokens or time-limited share links.

**Trigger:** More than one identity needs any form of access.

### 1.3 Multi-user SaaS product

If Atharva ever wants to offer this dashboard to others as a product, the entire auth and storage model needs a rewrite. The current password is hardcoded into the source files (`auth.js`). The defaults file (`defaults.js`) contains personal financial data committed to the codebase. A SaaS product requires:

- Per-user credential management (signup, email verification, password reset)
- Per-user isolated data storage
- Billing integration
- Audit logging and compliance (GDPR, depending on jurisdiction)

**Trigger:** Any second user who is not the owner.

---

## 2. Recommended Backend Stack

### 2.1 Runtime and framework

**Recommendation: Node.js with Hono**

- **Node.js** is the natural choice. The current codebase is vanilla JavaScript, and there is no build toolchain. The backend author and the frontend author would be the same person. Using a different runtime language (Go, Python, Rust) would introduce a context-switch cost for no material gain at this scale.
- **Hono** is a lightweight, TypeScript-native web framework that runs on Node.js, Cloudflare Workers, Bun, and Deno with zero code changes. This matters because the recommended deployment target (see section 5) is Cloudflare Workers. Hono has native middleware for JWT auth, CORS, and rate limiting. It compiles to a single file with no framework overhead.

**Why not Express:** Express is unmaintained (v4 went years without a release), has no native TypeScript support, and requires far more boilerplate middleware. Hono is strictly superior for new projects.

**Why not Fastify:** Fastify is excellent but is optimised for large plugin ecosystems. Overkill here, and does not run natively on Cloudflare Workers without adaptation.

### 2.2 Database

**Recommendation: PostgreSQL via Supabase (self-contained option) or Cloudflare D1 (edge-native option)**

The data model (see section 4) is a handful of JSONB documents per user — not a highly relational workload. Both a document-oriented database and a relational database work here.

| Option | Pros | Cons |
|---|---|---|
| **Cloudflare D1** (SQLite at the edge) | Zero cold start, zero ops, per-request billing, pairs naturally with Workers + Hono | SQLite has limited JSON operators vs Postgres; no real-time subscriptions |
| **Supabase (PostgreSQL)** | Full Postgres: JSONB, row-level security, real-time, auth built-in, generous free tier | Separate infrastructure from Workers; adds a network hop |
| **PlanetScale (MySQL)** | Branching, no foreign key pain | MySQL JSON support is inferior to Postgres; company had pricing instability |
| **MongoDB Atlas** | Native document store | Overkill; no joins needed; free tier is limited; vendor lock-in |

**For multi-device sync only:** Cloudflare D1 + Workers + Hono is the tightest stack, lowest cost, and zero ops.

**For sharing / SaaS:** Supabase adds row-level security, built-in auth, and real-time subscriptions out of the box, eliminating significant custom code.

**Primary recommendation: Supabase PostgreSQL** unless cost or latency is the dominant concern, in which case **Cloudflare D1**.

### 2.3 Why this over alternatives

| Alternative | Reason not recommended |
|---|---|
| Firebase / Firestore | Google vendor lock-in, proprietary query language, pricing surprises at scale, poor ergonomics for structured financial data |
| AWS Lambda + DynamoDB | Significant ops overhead for a personal project; DynamoDB is cost-efficient only at high throughput; complex IAM setup |
| Railway + any DB | Good developer experience but adds a persistent server cost (~$5-20/mo) vs serverless pay-per-use |
| Self-hosted VPS | Full control but requires patching, uptime monitoring, backup management — disproportionate for personal finance dashboard |

---

## 3. API Design

### 3.1 Authentication approach

Financial data is highly sensitive. The authentication approach must be robust from day one.

**Recommendation: Email + password with JWT (short-lived access token + refresh token rotation)**

- **Registration:** Email + bcrypt-hashed password (cost factor 12). Send email verification before allowing any data write.
- **Login:** Verify bcrypt hash. Issue a **JWT access token** (15-minute expiry, signed with RS256) and a **refresh token** (30-day expiry, stored as an `httpOnly`, `Secure`, `SameSite=Strict` cookie). The access token is sent in the `Authorization: Bearer` header. The refresh token is never accessible to JavaScript.
- **Token rotation:** On every refresh, invalidate the old refresh token and issue a new one. Store refresh token hashes in the database (not the tokens themselves) so that if the database is compromised, tokens cannot be replayed.
- **MFA:** For financial data, TOTP (Time-based One-Time Password, e.g. Google Authenticator) should be available as an optional second factor from v1. Do not make it mandatory for a personal-use MVP, but the database schema must accommodate it from the start.

**Why not OAuth / "Sign in with Google":** The user does not want to depend on a third-party identity provider for access to personal financial data. If Google terminates the OAuth app or changes its policies, access is interrupted. Password-based auth with email verification is appropriate here and keeps the credentials fully under the user's control.

**Why not session cookies for everything:** JWTs allow stateless verification at the edge (Cloudflare Workers can verify a JWT without a database round-trip). Stateful sessions require a centrally accessible session store, which adds infrastructure complexity.

### 3.2 Key endpoints

All routes are prefixed `/api/v1/`. All responses use `application/json`. All mutation endpoints require a valid JWT.

#### Auth

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Create account. Body: `{email, password}`. Returns 201 and triggers email verification. |
| `POST` | `/api/v1/auth/login` | Authenticate. Body: `{email, password, totp?}`. Returns JWT access token + sets refresh token cookie. |
| `POST` | `/api/v1/auth/refresh` | Rotate tokens. Reads refresh cookie, returns new access token. |
| `POST` | `/api/v1/auth/logout` | Invalidates the refresh token in the database. Clears cookie. |
| `POST` | `/api/v1/auth/verify-email` | Verifies email token from link. |
| `POST` | `/api/v1/auth/request-password-reset` | Sends reset email. |
| `POST` | `/api/v1/auth/reset-password` | Resets password via token from email. |
| `GET`  | `/api/v1/auth/me` | Returns authenticated user's ID, email, and MFA status. |

#### Data (full-document CRUD per section)

The current schema stores data in 10 named keys. The backend mirrors this with 10 logical sections. Each section is one row in the database — a user ID, a section name, and an encrypted JSON blob.

| Method | Path | Description |
|---|---|---|
| `GET`    | `/api/v1/data` | Return all sections for the authenticated user as a single JSON object (mirrors `loadAll()`). |
| `GET`    | `/api/v1/data/:section` | Return one section (e.g. `/data/income`). |
| `PUT`    | `/api/v1/data/:section` | Full replace of one section. Body is the raw section JSON. Returns 200 + updated timestamp. |
| `PATCH`  | `/api/v1/data/:section` | Partial update via JSON Merge Patch (RFC 7396). Useful for updating a single field without sending the full section. |
| `DELETE` | `/api/v1/data` | Wipe all data for the authenticated user. Requires password re-confirmation in the request body. |

**Valid `:section` values:** `profile`, `income`, `expenses`, `debts`, `investments`, `goals`, `monthly_log`, `settings`, `tax_tracker`, `india_log`

#### Sync

| Method | Path | Description |
|---|---|---|
| `GET`  | `/api/v1/sync/status` | Returns `last_modified` timestamp per section and a global `sync_version` counter. Used by the client to detect drift without downloading all data. |
| `POST` | `/api/v1/sync/push` | Body: `{ section, data, client_version }`. Server compares `client_version` against stored version. If equal, accepts write and increments version. If not equal, returns 409 Conflict with server's current version and data for the client to merge. |
| `GET`  | `/api/v1/sync/pull` | Returns all sections modified since a given `since` timestamp. Query param: `?since=ISO8601`. Used for initial sync on a new device. |

#### Admin / sharing (future, not MVP)

| Method | Path | Description |
|---|---|---|
| `POST`   | `/api/v1/shares` | Create a share token with specified permissions (read-only sections, expiry). |
| `GET`    | `/api/v1/shares` | List active share tokens. |
| `DELETE` | `/api/v1/shares/:id` | Revoke a share token. |

### 3.3 Data encryption approach

This is the most consequential design decision in the backend spec and requires a clear-eyed trade-off analysis.

**Option A: Server-side encryption (encryption at rest)**

The server stores data encrypted using a key it controls (e.g. AES-256-GCM with a key managed by the hosting provider's KMS — AWS KMS, Cloudflare Secrets, etc.). Data is decrypted by the server on each read and returned in plaintext over TLS to the authenticated client.

- **Pros:** Simple. Standard. Works with all database query features. Easy to implement backup and search. No client complexity.
- **Cons:** The server (or the hosting provider) can read the user's data. If the backend is compromised, all data is exposed. This is the model used by virtually all SaaS products (Monzo, YNAB, etc.).
- **Verdict for this project:** Acceptable for a personal tool or small sharing use case where the server operator is the data owner. Not appropriate for a multi-user SaaS where users do not trust the operator.

**Option B: Client-side encryption (end-to-end encryption, E2EE)**

The client derives a data encryption key (DEK) from the user's password (using PBKDF2 or Argon2id) before any data leaves the device. Only the encrypted ciphertext is sent to the backend. The server stores and returns ciphertext it cannot read.

- **Pros:** Zero-knowledge backend. Even a full server compromise exposes nothing plaintext. Aligns with the current architecture's philosophy (the service worker crypto vault).
- **Cons:** The server cannot read, search, or migrate data. Password reset is destructive (losing the password means losing the DEK, means losing all data — unless a recovery mechanism is designed). Sharing requires key exchange protocols (the owner must encrypt the DEK with the recipient's public key). Significantly more complex to implement correctly.
- **Verdict for this project:** The right long-term choice given the sensitivity of financial data and the existing crypto architecture. The current service worker AES key can be adapted: instead of the key living in SW memory, it lives in SW memory and is also used to encrypt data sent to the server.

**Recommendation: Client-side encryption (E2EE) from the start.**

Implementing server-side encryption now and switching later is harder than doing it right the first time. The existing crypto infrastructure in `sw.js` and `auth.js` provides the right primitives. The migration to a backend should preserve and extend this model, not weaken it.

**Key derivation scheme for E2EE:**

```
Master Password
    │
    ▼ PBKDF2-SHA256, 600,000 iterations, user-specific salt
Auth Key (used only to authenticate — never sent as password)
    │
    ├──► Server: verify Auth Key hash (bcrypt of Auth Key)
    │
    ▼ HKDF-SHA256 with domain separation label "fin_data_enc"
Data Encryption Key (DEK) — never sent to server
    │
    ▼ AES-256-GCM
Encrypted section data → stored on server
```

The auth key and the DEK are derived independently from the same master password using HKDF domain separation. The server only ever sees the auth key (or rather, its bcrypt hash). The DEK never leaves the client.

---

## 4. Data Model

### 4.1 Mapping the localStorage schema to a database schema

The current localStorage schema has 10 keys, each holding a JSON document of varying complexity:

| localStorage key | Content type | Approximate size |
|---|---|---|
| `fin_profile` | Small object (5 fields) | <1KB |
| `fin_income` | Medium object (9 fields) | <1KB |
| `fin_expenses` | Array of ~15 expense items + scheduledChanges | ~3KB |
| `fin_debts` | Object with one debt record | <1KB |
| `fin_investments` | Nested object with cashAccounts[], pensions[], ulips[] | ~5KB |
| `fin_goals` | Object with nested indiaTrip breakdown | ~2KB |
| `fin_monthly_log` | Array of monthly snapshots (grows over time) | Variable — grows ~1KB/month |
| `fin_settings` | Object with UI config and chart parameters | ~2KB |
| `fin_tax_tracker` | Object with verifiedMonths[] array | ~1KB growing |
| `fin_india_log` | Array of India income entries | Variable |

Total per-user footprint: approximately 15–25KB initially, growing by ~2–3KB per month as logs accumulate.

### 4.2 Proposed database schema

```sql
-- Users table
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       TEXT NOT NULL UNIQUE,
    auth_key_hash TEXT NOT NULL,         -- bcrypt hash of the derived auth key
    email_verified_at TIMESTAMPTZ,
    totp_secret  TEXT,                   -- encrypted TOTP secret, NULL if MFA not enabled
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Refresh tokens (for token rotation)
CREATE TABLE refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  TEXT NOT NULL UNIQUE,    -- SHA-256 hash of the actual token
    expires_at  TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    revoked_at  TIMESTAMPTZ             -- NULL = active
);

-- Per-user PBKDF2 salt (used for client-side key derivation)
-- The server stores the salt but can never derive the key without the password.
CREATE TABLE user_crypto (
    user_id     UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    pbkdf2_salt TEXT NOT NULL,          -- base64-encoded, 32 bytes
    kdf_iterations INT NOT NULL DEFAULT 600000
);

-- Financial data sections (one row per user per section)
CREATE TABLE financial_data (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    section     TEXT NOT NULL,          -- 'profile', 'income', 'expenses', etc.
    ciphertext  TEXT NOT NULL,          -- AES-256-GCM encrypted JSON, base64-encoded
    iv          TEXT NOT NULL,          -- AES-GCM initialisation vector, base64-encoded
    version     BIGINT NOT NULL DEFAULT 1,  -- monotonic counter for conflict detection
    last_modified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, section)
);

CREATE INDEX idx_financial_data_user ON financial_data(user_id);
CREATE INDEX idx_financial_data_modified ON financial_data(user_id, last_modified_at);

-- Audit log (optional but recommended for financial data)
CREATE TABLE audit_log (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action      TEXT NOT NULL,          -- 'login', 'data_write', 'data_delete', 'share_created'
    section     TEXT,                   -- NULL for non-data actions
    ip_address  TEXT,
    user_agent  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Share tokens (future feature, schema defined now)
CREATE TABLE share_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  TEXT NOT NULL UNIQUE,
    sections    TEXT[] NOT NULL,        -- which sections are accessible
    access_level TEXT NOT NULL CHECK (access_level IN ('read', 'comment')),
    expires_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    revoked_at  TIMESTAMPTZ
);
```

### 4.3 Section name mapping

| localStorage key | `section` column value | Notes |
|---|---|---|
| `fin_profile` | `profile` | Strip `fin_` prefix |
| `fin_income` | `income` | |
| `fin_expenses` | `expenses` | |
| `fin_debts` | `debts` | |
| `fin_investments` | `investments` | |
| `fin_goals` | `goals` | |
| `fin_monthly_log` | `monthly_log` | |
| `fin_settings` | `settings` | |
| `fin_tax_tracker` | `tax_tracker` | |
| `fin_india_log` | `india_log` | |

### 4.4 User isolation approach

Row-level security (RLS) is the enforcement mechanism, not just application-level filtering.

In Supabase / PostgreSQL:

```sql
ALTER TABLE financial_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own data"
    ON financial_data
    USING (user_id = auth.uid());
```

Every query to `financial_data` is automatically scoped to the authenticated user's `user_id`. Even if a bug in the application layer sends the wrong user ID, the database policy prevents the data from being returned.

The same policy applies to `user_crypto`, `refresh_tokens`, `audit_log`, and `share_tokens`.

---

## 5. Deployment Recommendation

### 5.1 Architecture options

Three viable options are evaluated for a small-scale deployment (<100 users):

#### Option A: Cloudflare Workers + D1 + R2

- **API runtime:** Cloudflare Workers (Hono)
- **Database:** Cloudflare D1 (SQLite at the edge)
- **Static frontend:** Cloudflare Pages
- **Key management:** Cloudflare Secrets (for JWT signing key)

**Pros:** Single-vendor deployment. Zero cold starts. CDN-served frontend. D1 is globally replicated with eventual consistency. Extremely low cost — D1 free tier is 100,000 reads/day and 100,000 writes/day, more than enough for 100 users. Workers free tier is 100,000 requests/day.

**Cons:** D1 is SQLite — some Postgres features (JSON operators, row-level security policies) are not available. Must implement RLS at the application layer rather than the database layer. Limited ecosystem compared to Postgres.

**Cost at 100 users:** ~$0–$5/month (likely free tier throughout early stages).

#### Option B: Supabase (PostgreSQL) + Cloudflare Pages + Workers

- **API runtime:** Cloudflare Workers (Hono) calling Supabase via the REST API or directly via Supabase's PostgreSQL connection string
- **Database:** Supabase PostgreSQL (hosted, managed)
- **Static frontend:** Cloudflare Pages
- **Auth:** Custom JWT implementation in Workers (do not use Supabase Auth — maintain control of the auth layer given the E2EE design)

**Pros:** Full Postgres features including native JSONB operators and row-level security. Real-time subscriptions available for future multi-device sync push. Supabase free tier is generous: 500MB database, 50,000 MAUs, no egress fees for the free tier.

**Cons:** Two vendors. Supabase free tier projects pause after 7 days of inactivity — set up a ping cron job or upgrade to Pro ($25/month) to avoid this.

**Cost at 100 users:** $0/month on free tier; $25/month on Pro (removes inactivity pausing).

#### Option C: Railway + PostgreSQL

- **API runtime:** Node.js Hono running as a persistent server on Railway
- **Database:** Railway PostgreSQL managed add-on

**Pros:** Simple. One vendor. Persistent server (good for WebSocket connections if real-time sync is needed). Railway's developer experience is excellent.

**Cons:** A persistent server costs money regardless of usage. Railway Hobby plan is $5/month; a server + database instance runs approximately $10–15/month.

**Cost at 100 users:** $10–$15/month.

### 5.2 Recommendation

**Primary recommendation: Supabase (PostgreSQL) + Cloudflare Workers (Hono) + Cloudflare Pages**

- Start on Supabase free tier. If the project stays personal or small, it costs nothing.
- Cloudflare Workers handles the API layer with zero cold start and global distribution.
- Cloudflare Pages serves the frontend, replacing the current local file serving.
- This gives full Postgres capabilities (RLS, JSONB, real-time) at near-zero cost.

**If ops simplicity is the only concern:** Cloudflare Workers + D1 is the most cohesive single-vendor option and is free at the scale of 1–100 users indefinitely.

### 5.3 Cost estimate (<100 users)

| Component | Provider | Cost |
|---|---|---|
| API server | Cloudflare Workers (free tier: 100k req/day) | $0 |
| Database | Supabase free tier (500MB, 50k MAUs) | $0 |
| Frontend hosting | Cloudflare Pages | $0 |
| Custom domain (optional) | Cloudflare Registrar | ~$10/year |
| SSL | Cloudflare (auto) | $0 |
| **Total** | | **$0–$10/year** |

At scale (1,000+ users or sustained DB usage over 500MB), Supabase Pro at $25/month is the expected upgrade path.

---

## 6. Migration Path

### 6.1 Overview

The migration must be non-destructive. The user's localStorage data must not be deleted until they have explicitly confirmed the backend sync is complete and verified correct. The localStorage version should remain the fallback until the user opts out of it.

### 6.2 Step-by-step migration flow

**Phase 1: Export from localStorage (client-side)**

1. User navigates to a new "Cloud Sync" settings panel.
2. The client calls `loadAll()` from `store.js` — exactly as it does today — to decrypt all 10 sections from localStorage.
3. The client serialises each section as JSON, then encrypts each section individually with the user's DEK (already derived from their password during login).
4. The encrypted blobs are staged in memory — nothing is deleted yet.

**Phase 2: Register backend account**

1. User enters their email address. They may optionally set a different cloud password or reuse the same master password.
2. The client derives the auth key (HKDF from master password) and the DEK.
3. The client sends the auth key (not the master password, not the DEK) to `POST /api/v1/auth/register`.
4. The server stores the bcrypt hash of the auth key and the PBKDF2 salt.
5. The user verifies their email.

**Phase 3: Push data to backend**

1. For each of the 10 sections, the client calls `PUT /api/v1/data/:section` with the encrypted ciphertext and IV.
2. The server stores the ciphertext without ever decrypting it.
3. On success (all 10 sections return 200), the client displays a "Migration complete" confirmation screen showing section names and their last-modified timestamps from the server response.

**Phase 4: Verification**

1. The client immediately calls `GET /api/v1/data` to pull all sections back.
2. Decrypts each section locally using the DEK.
3. Compares the decrypted data against the original in-memory copy from Phase 1.
4. If all 10 sections match byte-for-byte: migration is verified.
5. If any section mismatches: display a warning with the section name and abort — do not delete localStorage.

**Phase 5: localStorage cleanup (user-initiated)**

1. Only after Phase 4 passes does the UI show an "Enable cloud mode" button.
2. Clicking it switches `store.js` to use the backend API instead of `localStorage`.
3. After a configurable grace period (e.g. 30 days), a separate "Clear local data" button becomes available.
4. `clearAll()` is called only when the user explicitly clicks "Clear local data".

### 6.3 Conflict handling during migration

If the user makes changes on the old client while the migration is in progress, the version counter handles it:

- Phase 1 reads and snapshots the data at a point in time.
- Phase 3 uploads that snapshot with `version: 1` for all sections.
- If the user saved something in between, the `PUT` request's `client_version` will not match the server state (because the server has no prior state, it will accept the first write unconditionally).
- After migration, all subsequent writes include a `client_version` that must match the server's `version`. On conflict (409), the client presents a merge UI.

### 6.4 Code changes required in store.js

The migration requires `store.js` to be extended with a backend adapter that matches the existing async API:

```javascript
// store.js — extended with backend adapter
const BACKEND_URL = 'https://api.yourdomain.com/api/v1';

async function loadAll() {
  if (useBackend()) {
    return fetchAllFromBackend();  // GET /api/v1/data, decrypt locally
  }
  // existing localStorage path unchanged
  return loadAllFromLocalStorage();
}

async function save(key, data) {
  if (useBackend()) {
    return pushToBackend(key, data);  // PUT /api/v1/data/:section
  }
  // existing localStorage path unchanged
  return saveToLocalStorage(key, data);
}
```

The `useBackend()` flag is stored in `localStorage` as `fin_sync_mode: 'cloud'` after migration completes. All existing page modules require zero changes — they call `save()` and `loadAll()` as they do today.

---

## 7. Security Considerations Specific to the Backend

The Architecture Review identified critical vulnerabilities in the current client-side model. The backend introduction must not regress these, and the E2EE model resolves several of them.

| Current vulnerability | Backend impact |
|---|---|
| Raw AES key in `sessionStorage` | E2EE model means DEK is derived from password, never stored raw anywhere. `sessionStorage._ek` can be eliminated. |
| Personal financial data in `defaults.js` | Irrelevant to backend — but must still be cleaned up in the repo regardless. |
| Credential hashes in `auth.js` | Backend replaces the hardcoded credential check. `auth.js` hashes become unused and must be removed. |
| No cross-tab protection | Backend `version` counter means the second tab's write is rejected with 409 if the first tab already wrote. |
| Silent decrypt failure masks corruption | Backend stores encrypted blobs; corruption is detected at decryption time on the client. The client should surface this explicitly. |

**Additional backend-specific security requirements:**

- All API endpoints must be served over HTTPS only. No HTTP.
- Rate limiting on all auth endpoints: maximum 10 login attempts per IP per 15 minutes, with exponential backoff.
- CORS policy: only allow the specific frontend origin, not wildcard `*`.
- `Content-Security-Policy` header on all responses.
- The JWT signing key must be an RS256 key pair (asymmetric), not a symmetric HMAC secret. Store the private key in the environment secrets manager (Cloudflare Secrets / Supabase Vault), never in source code or version control.
- Database connection strings and API keys must never appear in the frontend JavaScript bundle.

---

*Spec based on full review of `js/store.js`, `js/defaults.js`, and `docs/projects/financial-dashboard/ARCHITECTURE_REVIEW.md` as of 2026-06-01.*
