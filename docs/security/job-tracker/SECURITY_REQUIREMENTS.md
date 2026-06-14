# SECURITY_REQUIREMENTS.md — JobScope
**Version:** 1.0
**Date:** 2026-06-08
**Author:** Director Security
**Status:** Non-negotiable — v1 ship gate. All requirements must be met before Director Security sign-off is issued.

These are minimum bars, not aspirations. "Should" does not exist in this document. Every requirement is a gate.

---

## SR-01: Authentication

| ID | Requirement | Verification |
|----|------------|--------------|
| SR-01-01 | Session cookies MUST be set with `HttpOnly`, `Secure`, and `SameSite=Strict` flags. | Security Architect: verify NextAuth v5 configuration in code review. |
| SR-01-02 | Session storage MUST be Postgres-backed via the NextAuth adapter. In-memory or file-based sessions are prohibited. | Security Architect: verify Prisma adapter configured in NextAuth. |
| SR-01-03 | Session tokens MUST NOT be accessible from JavaScript. Client-side `document.cookie` access to the session token is a Critical finding. | Security Architect: SAST scan for `document.cookie` usage. |
| SR-01-04 | All API routes EXCEPT `/api/health` MUST be protected by NextAuth middleware. An unauthenticated request to any other endpoint MUST return HTTP 401, not a redirect or empty response. | QA: automated test — call each API endpoint without a session cookie; assert 401. |
| SR-01-05 | CSRF protection MUST be enabled on all mutation endpoints (POST, PATCH, PUT, DELETE). NextAuth v5 built-in CSRF token satisfies this requirement. | Security Architect: verify NextAuth CSRF configuration in code review. |
| SR-01-06 | Session lifetime MUST be configured. Maximum session duration: 30 days with sliding expiry. Idle sessions (no activity for 24 hours) MUST be invalidated. | Security Architect: verify NextAuth `maxAge` and `updateAge` settings. |
| SR-01-07 | Only Atharva's account is a valid account in v1. Account registration page MUST NOT exist. The account is seeded via DB migration only. | Security Architect: verify no `/api/auth/register` route exists. |

---

## SR-02: Authorisation and Ownership

| ID | Requirement | Verification |
|----|------------|--------------|
| SR-02-01 | Every database query that reads or writes a user-owned record (applications, user_profiles, raw_job_ingestion context) MUST include a `user_id` equality predicate in the WHERE clause. This applies at the service layer. | Security Architect: mandatory code review of ALL service files before merge. Flag any missing user_id as a Critical finding. |
| SR-02-02 | Ownership check MUST be at the service layer, NOT the route layer. Route-level checks alone are insufficient — they do not survive refactoring. | Security Architect: verify in code review. |
| SR-02-03 | Every resume file download MUST verify `file.userId === session.user.id` before generating a signed URL. The signed URL MUST NOT be generated if this check fails. | Security Architect: verify ownership check in the signed URL generation service. |
| SR-02-04 | Signed URLs for resume files MUST have a maximum TTL of 15 minutes. No permanent or long-lived presigned URLs are permitted. | Security Architect: verify TTL parameter in R2 signed URL generation call. |
| SR-02-05 | R2 bucket `jobscope-resumes` MUST be configured as private (no public access). Direct R2 URL access MUST return 403 for all objects. | Director DevOps: verify bucket policy in deployment checklist. Security Architect: verify in infrastructure review. |
| SR-02-06 | All IDs exposed in API responses and URLs MUST be UUIDs (v4). Sequential integer IDs MUST NOT appear in any external-facing identifier. | Security Architect: SAST scan for `autoincrement` or `serial` primary keys on user-owned tables. |

---

## SR-03: File Upload Security

| ID | Requirement | Verification |
|----|------------|--------------|
| SR-03-01 | MIME type MUST be validated server-side using magic bytes (file header inspection), not file extension alone. Accepted types: `application/pdf` and `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (DOCX) only. Any other MIME type MUST be rejected with HTTP 415. | Security Architect: verify magic byte validation in upload handler code review. |
| SR-03-02 | Maximum file size MUST be enforced at 10MB BEFORE streaming to R2. The server MUST reject the upload before any bytes are written to storage if the limit is exceeded. | Security Architect: verify size check precedes storage write in upload handler. |
| SR-03-03 | The storage key for uploaded files MUST be derived as `{userId}/{uuid}/{sanitised_filename}`. The original client-supplied filename MUST NOT be used directly as the storage key. | Security Architect: verify key construction in upload service code review. |
| SR-03-04 | Filename sanitisation MUST strip path traversal characters (`../`, `./`, absolute path prefixes). A UUID prefix MUST be present in the storage key regardless of filename content. | Security Architect: verify sanitisation function in code review. |
| SR-03-05 | Files MUST be served via download-only signed URLs. The Content-Disposition header MUST be `attachment`. Files MUST NOT be served with an executable MIME type (e.g. `text/html`, `application/javascript`, `image/svg+xml`). | Security Architect: verify signed URL parameters include correct Content-Type and Content-Disposition. |
| SR-03-06 | [v1.1 gap] Virus/malware scanning (ClamAV) is deferred. This gap is documented and accepted for v1. Atharva is the only user — risk is self-inflicted. Virus scanning MUST be added before any multi-user expansion. | Director Security: accepted risk, documented. |

---

## SR-04: PII Handling

| ID | Requirement | Verification |
|----|------------|--------------|
| SR-04-01 | Resume files (PDF/DOCX) MUST be stored in the private R2 bucket only. Resume files MUST NOT be stored on local filesystem, in the database, or in any logging system. | Security Architect: verify upload flow in code review. |
| SR-04-02 | Parsed profile data stored in `user_profiles` MUST be encrypted at rest. Railway managed Postgres provides AES-256 encryption at rest by default — this MUST be verified in the Railway configuration. | Director DevOps: confirm Railway Postgres encryption-at-rest setting. |
| SR-04-03 | Extracted resume text (plain text from pdfplumber/python-docx) MUST NOT be persisted anywhere. It exists in memory only for the duration of the Claude API call. The worker process MUST NOT write it to DB, logs, filesystem, or queue payload. | Security Architect: verify worker code in code review. |
| SR-04-04 | Email addresses MUST NOT appear in application logs. User IDs (UUID) may appear in logs. All other PII (name, phone, address, salary, job titles, employer names from resume) MUST NOT appear in logs. | Security Architect: SAST scan for PII patterns in log statements; verify logging library redaction config. |
| SR-04-05 | Resume files MUST be deletable by the user on demand. The delete operation MUST: (1) delete the file from R2, (2) delete `user_profiles` rows associated with that upload, (3) confirm deletion before returning success. | QA: integration test for right-to-erasure flow. Security Architect: verify cascading delete logic. |
| SR-04-06 | Parsed profile data MUST be deletable by the user on demand (right-to-erasure requirement, see SR-06). Deletion MUST remove all `user_profiles` rows for the user. | QA: verify erasure endpoint removes all user profile data. |
| SR-04-07 | Data retention: resume files and parsed profile data MUST NOT be retained beyond 12 months from last activity OR user account deletion (whichever is earlier). An automated deletion job MUST enforce this. This is a hard DPA 2018 requirement. Implementation: stale-cleanup worker with configurable retention window. | Director Security: flag if automated deletion is not implemented before v1. |

---

## SR-05: API Security and Secrets Management

| ID | Requirement | Verification |
|----|------------|--------------|
| SR-05-01 | ALL API keys (Adzuna, Reed, Jooble, Cloudflare R2 access key and secret, Claude API key) MUST be stored in Railway's secret manager as environment variables. No exceptions. | Security Architect: SAST scan for hardcoded credentials. Director DevOps: verify Railway environment variable configuration. |
| SR-05-02 | No API key or secret MUST appear in any source file, config file, `.env` file committed to git, or log output. A `.gitignore` entry for `.env` is required. `.env.example` MAY be committed with placeholder values only. | Security Architect: `git grep` for known key patterns (uuid-length strings, `sk-ant-`, `Bearer `) as part of SAST pass. |
| SR-05-03 | API keys MUST NOT be included in client-side JavaScript bundles. Next.js `NEXT_PUBLIC_` prefix MUST NOT be used for any secret. All external API calls MUST originate from server-side code or background workers. | Security Architect: SAST scan for `NEXT_PUBLIC_` environment variable usage with sensitive keys. |
| SR-05-04 | If user-provided API keys are introduced in future (v2+ features), they MUST be envelope-encrypted before storage: wrap with a server-held master key, store only the ciphertext in DB. Plaintext user keys MUST NOT appear in the database. | Director Security: this requirement is prospective — flag to Product if any feature accepting user API keys is scoped. |
| SR-05-05 | Secret rotation runbook MUST exist before v1 ship. The runbook MUST specify: how to rotate each key, expected downtime (if any), verification steps. Owner: Director DevOps. | Director DevOps: deliver rotation runbook before v1 sign-off. |

---

## SR-06: UK GDPR / DPA 2018 Compliance

| ID | Requirement | Verification |
|----|------------|--------------|
| SR-06-01 | Explicit informed consent MUST be obtained from Atharva before his resume is processed by the Claude API. The consent mechanism MUST: (a) name Anthropic as the third-party processor, (b) describe what data is sent (resume text), (c) describe the purpose (structured profile extraction), (d) be recorded with a timestamp in the `users` or `consents` table. | Compliance Auditor: design consent flow and verify consent is recorded before resume parsing begins. |
| SR-06-02 | A right-to-erasure endpoint MUST exist: `DELETE /api/account` or equivalent. It MUST delete: (1) all resume files from R2, (2) all `user_profiles` rows, (3) all `applications` rows, (4) the `users` row and associated NextAuth session/account rows. Deletion MUST be confirmed before HTTP 200 is returned. | QA: integration test verifying complete account data deletion. Security Architect: verify cascading deletes. |
| SR-06-03 | An Article 30 processing register entry MUST be created for JobScope's personal data processing activities. This is a DPA 2018 obligation. Assign to Compliance Auditor. Processing activities to document: resume parsing (Claude API), application tracking, job search personalisation. | Compliance Auditor: produce Article 30 register entry. Director Security: flag to Chief of Staff if not delivered before v1. |
| SR-06-04 | Legal basis for processing MUST be documented. Proposed basis: Legitimate interests (Atharva is processing his own data for his own job search). Compliance Auditor to confirm this is sufficient and whether a Legitimate Interests Assessment (LIA) is required. | Compliance Auditor: confirm legal basis and whether LIA is required. |
| SR-06-05 | If Claude API resume processing constitutes a transfer of personal data to a third country (USA), this MUST be assessed against UK GDPR Chapter V (international transfers). Compliance Auditor to assess whether Anthropic's DPA/SCCs are sufficient. | Compliance Auditor: assess international transfer position and Anthropic's data processing agreement. |
| SR-06-06 | Job application data MUST NOT be shared with any third party. The system is for Atharva's sole use; no data sale, no analytics sharing, no third-party integrations that receive personal data. | Director Security: verify no third-party tracking (analytics SDKs, telemetry) in the frontend code. Security Architect: code review. |

---

## SR-07: SSRF Prevention

| ID | Requirement | Verification |
|----|------------|--------------|
| SR-07-01 | The application server MUST NOT fetch any URL provided in user input or derived from job listing content. No feature may accept a user-supplied URL for server-side fetching. This is a design constraint, not a runtime check. | Security Architect: verify in architecture review and code review. Any code path that fetches a user-provided URL is a Critical finding. |
| SR-07-02 | All outbound HTTP requests from background workers MUST be restricted to the compile-time allowlist in `src/config/allowed-external-hosts.ts`. Any request to a hostname not in this list MUST be rejected before the connection is made. | Security Architect: verify allowlist enforcement in HTTP client configuration. Code review of all adapter files. |
| SR-07-03 | DNS rebinding protection MUST be implemented: the HTTP client MUST validate that the resolved IP address is not RFC-1918 private space (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), loopback (127.0.0.0/8), or link-local (169.254.0.0/16) before making the connection. | Security Architect: verify DNS validation logic in custom HTTP agent. |
| SR-07-04 | Adding a new allowed external hostname MUST require a code change to `allowed-external-hosts.ts` and a PR review. It MUST NOT be achievable via environment variable or runtime configuration change. | Director Security: verify this is enforced by the allowlist implementation. |

---

## SR-08: Input Validation and Output Encoding

| ID | Requirement | Verification |
|----|------------|--------------|
| SR-08-01 | All job listing fields (title, description, employer_name, location) MUST be treated as untrusted input and HTML-encoded on output. React JSX escaping satisfies this for components that do not use `dangerouslySetInnerHTML`. | Security Architect: SAST scan for any usage of `dangerouslySetInnerHTML` with job data. Any such usage is a High finding. |
| SR-08-02 | `dangerouslySetInnerHTML` MUST NOT be used with any data derived from external job APIs, the gov.uk CSV, or user-uploaded content. | Security Architect: verify in code review. |
| SR-08-03 | Gov.uk sponsor register CSV MUST be validated against a strict schema before any DB write. Validation MUST check: expected column count, expected column headers, data type constraints on key fields (organisation_name as string, rating as enum). Schema validation failure MUST halt ingestion and fire an alert. | Security Architect: verify validation logic in govuk-csv-worker code review. |
| SR-08-04 | Claude API prompts that include job listing content (if any future feature uses this) MUST treat that content as untrusted data using delimited prompts: content inside `<untrusted_content>` XML tags in the user turn, with the system prompt explicitly stating the boundary. | Security Architect: verify prompt construction for any job-content-to-LLM pipeline. |
| SR-08-05 | Claude API prompts for resume parsing MUST delimit the resume text as untrusted: resume text placed inside `<resume_text>` tags in the user turn. System prompt MUST state that content within those tags is data to be parsed, not instructions. | Security Architect: verify prompt construction in resume-parser worker code review. |
| SR-08-06 | Zod schema validation MUST be applied to the Claude API response before any field is written to the database. `z.strip()` mode MUST be used (not `z.passthrough()`) to discard unexpected fields. Schema validation failure MUST mark the parse job as FAILED without a DB write. | Security Architect: verify Zod schema and strip mode in resume-parser worker code review. |
| SR-08-07 | Job description text stored in the `jobs` table MUST be truncated to a maximum of 20,000 characters at ingestion time, before DB write. This prevents oversized payloads from affecting downstream workers. | Security Architect: verify truncation in normalisation worker code review. |

---

## SR-09: Transport Security

| ID | Requirement | Verification |
|----|------------|--------------|
| SR-09-01 | The application MUST be served over HTTPS only. HTTP requests MUST be redirected to HTTPS. This is enforced at the Railway/Cloudflare layer. | Director DevOps: verify HTTPS-only configuration. |
| SR-09-02 | HTTP Strict Transport Security (HSTS) header MUST be set: `Strict-Transport-Security: max-age=31536000; includeSubDomains`. This MUST be present on all responses from the Next.js app. | Security Architect: verify HSTS header in Next.js `next.config.ts` headers configuration. |
| SR-09-03 | Content Security Policy (CSP) header MUST be configured. Minimum policy: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'`. Adjust for shadcn/ui/Tailwind requirements as needed, but `unsafe-eval` is prohibited. | Security Architect: verify CSP header in Next.js middleware or `next.config.ts`. |
| SR-09-04 | `X-Frame-Options: DENY` MUST be set (or CSP `frame-ancestors 'none'` as above). | Security Architect: verify in header configuration. |
| SR-09-05 | `X-Content-Type-Options: nosniff` MUST be set on all responses. | Security Architect: verify in header configuration. |

---

## SR-10: Dependency Security

| ID | Requirement | Verification |
|----|------------|--------------|
| SR-10-01 | No known Critical or High CVE MAY exist in production dependencies at the time of v1 ship. Run `npm audit` (or `pnpm audit`) as part of CI. Build fails on Critical CVEs. | CI/CD Engineer: add `npm audit --audit-level=critical` to CI pipeline. |
| SR-10-02 | Dependabot or Renovate MUST be configured on the GitHub repository to alert on new CVEs in dependencies. | Infrastructure Engineer: verify Dependabot configuration in repo settings. |
| SR-10-03 | `package-lock.json` or `pnpm-lock.yaml` MUST be committed and used to pin exact versions. `npm install` without lockfile in production is prohibited. | Security Architect: verify lockfile is committed and CI uses `npm ci` not `npm install`. |

---

## Acceptance criteria summary

Before Director Security issues sign-off, ALL of the following must be confirmed:

- [ ] SR-01: All authentication requirements met — cookie flags verified, middleware coverage verified
- [ ] SR-02: All ownership checks present on every service-layer read/write — Security Architect code review complete
- [ ] SR-03: File upload security: magic byte validation, size limit, path traversal prevention, signed URL parameters
- [ ] SR-04: PII handling: extracted text not persisted, resume deletable, 12-month retention automation exists
- [ ] SR-05: No secrets in source or logs — SAST scan clean — rotation runbook exists
- [ ] SR-06: UK GDPR / DPA 2018: consent recorded, right-to-erasure endpoint working, Article 30 register entry delivered by Compliance Auditor
- [ ] SR-07: SSRF prevention: allowlist enforced, DNS rebinding protection verified
- [ ] SR-08: Input validation: no dangerouslySetInnerHTML with job data, gov.uk CSV schema validated, Claude prompts delimited, Zod strip mode
- [ ] SR-09: Transport: HTTPS-only, HSTS, CSP, X-Frame-Options, X-Content-Type-Options
- [ ] SR-10: No Critical CVEs in production dependencies at ship time

---

*SECURITY_REQUIREMENTS.md v1.0 — Director Security. Authoritative gate document for v1 ship.*
