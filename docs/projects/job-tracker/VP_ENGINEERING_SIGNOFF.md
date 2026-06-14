# VP Engineering Sign-Off — JobScope v1

**Reviewer:** VP Engineering
**Date:** 2026-06-09
**Project:** JobScope — UK cybersecurity job aggregator with Skilled Worker sponsorship matching and SC/DV clearance detection
**Scope:** Final pre-ship engineering review — architecture, code quality, security posture, QA coverage, engineering standards
**Verdict:** **CONDITIONAL PASS** (cleared to ship to private Railway staging; production-gated on conditions below)

---

## 1. Architecture Review

**Verdict: PASS**

The architecture (`docs/architecture/JOBSCOPE_ARCHITECTURE.md` v1.0) is sound, complete, and appropriately scoped for a single-user system that is structurally ready for multi-user without schema migration.

Strengths:
- **Security designed in, not bolted on.** SSRF and IDOR — the two documented failure classes in the jobsync reference project — are addressed structurally (§6.1, §6.2): compile-time host allowlist, owner-scoped storage keys, `WHERE id = :id AND user_id = :userId` enforced at the query layer, UUID v4 identifiers as defence-in-depth.
- **Pipeline durability is the right priority.** pg-boss (Postgres-backed queue) directly answers the highest operational risk — silent pipeline failure — by surviving worker crashes and retrying with backoff (§7.1).
- **Auditable eligibility decisions.** Every sponsor-match and clearance-flag carries a `matchReason` / `matchedKeywords` trace back to source data. This is correct for a system whose entire value is the trustworthiness of its two eligibility verdicts.
- **Conservative-by-design clearance rule** (§ clearance module): ambiguous phrasing must never resolve to NONE_DETECTED. The cost asymmetry (missed clearance = wasted application vs. false flag = one hidden listing) is correctly encoded.

The three ADRs are high quality. Each states context, decision, rationale, alternatives considered (with concrete rejection reasons), and consequences:
- **ADR-001 (PostgreSQL over SQLite):** Correct. `pg_trgm` for 60k-row fuzzy sponsor matching, concurrent-writer support, and avoidance of jobsync's documented Docker volume write-lock failure are all defensible, evidence-backed reasons.
- **ADR-002 (multi-source aggregation):** Correct. The LinkedIn exclusion on legal grounds (hiQ v. LinkedIn, CFAA exposure) is a mature engineering-meets-legal judgement, not a cost shortcut. Source resilience (degrades gracefully to Adzuna+Reed if Jooble drops) is properly reasoned.
- **ADR-003 (Claude API resume parsing):** Correct. Model-agnostic pipeline (text-extract → LLM → schema-validate) isolates the provider behind one function; the mandatory human-review step converts LLM non-determinism from a data-quality risk into a one-time user interaction.

**Architectural note (non-blocking):** ADR-003 and the architecture doc specify `claude-sonnet-4-5` for parsing; the implementation uses `claude-haiku-4-5-20251001`. Haiku is a reasonable cost/quality choice for structured extraction at single-user volume, but the ADR should be updated to reflect the as-built model. Documentation drift, not a defect. → V1.1 doc item.

---

## 2. Code Quality Assessment

**Verdict: PASS (with tracked bugs deferred to V1.1)**

I reviewed the six critical files. The matching logic — the heart of the product — is clean, pure, well-documented, and unit-test-friendly (no DB I/O in the scoring functions).

**`sponsor-matcher.ts`** — Clear resolution ladder (exact → fuzzy ≥0.85 → low-confidence → description-mention fallback). Confidence tiers and `matchReason` strings are precise and auditable. The DB layer is stubbed (`_exactMatch`/`_fuzzyMatch` return null) pending Prisma wiring — explicitly flagged in-file with the exact `$queryRaw` pg_trgm query to drop in. This is honest phase-gating, but it means the CONFIRMED path is not yet live or testable. → tracked.

**`clearance-detector.ts`** — Strong implementation. Conservative default, priority-ordered signal resolution (DV > SC > NSV > BPSS > GENERIC), and a demotion path for weak signals + preference qualifiers. The 100% REQUIRED-recall hard gate is met. One known bug: "sc advantageous" over-classifies to REQUIRED (BUG-001) — a *conservative* error (false flag, not a missed requirement), so it does not breach the hard gate.

**`eligibility-scorer.ts`** — Pure functions, sensible word-boundary anchoring for short keywords (avoids "ids" matching "candidates"). Two known bugs: senior/junior conflict not resolving to MID (BUG-002), and a GRC false positive on "administration" (BUG-003). Neither compromises the protective eligibility paths; both are P1 for V1.1.

**`api/applications/[id]/route.ts`** — **IDOR fix confirmed PRESENT and CORRECT.** All three handlers (GET/PATCH/DELETE) carry `userId: session.id` in the `findFirst` ownership check, AND the final `update` calls now use `where: { id, userId: session.id }` — not the bare `where: { id }` flagged as C-01 in the security review. Prisma 7.8.0 supports non-unique filters in `update`'s extended `where`, so this is valid and enforces ownership on the write itself, not merely a decoupled pre-check. **Security condition C-01 is resolved in code.** Input validation is thorough: status enum-checked, salary integer/non-negative-checked, 404-not-403 on ownership mismatch (correct enumeration defence).

**`resume/parse.ts`** — Prompt-injection defence is *stronger* than the spec required: UNTRUSTED-INPUT system prompt, `<resume>` delimiting, and forced `tool_choice: { type: 'any' }`. Unknown fields are stripped by construction (only known keys mapped). Gap: no formal Zod schema and no FAILED-status path on schema deviation — missing fields silently default. Functionally safe; hardening deferred to V1.1 (C-02).

**`auth.ts` / `auth-config.ts`** — `auth.ts` is a thin session adapter; `auth-config.ts` is NextAuth v5 wired with a Credentials provider whose `authorize()` accepts any email/password and returns a hardcoded `dev-user-id`. This is a development stub. Acceptable for private single-user Railway staging; a hard blocker for production (C-03).

Code style across all files is consistent: typed throughout, no `any` leakage beyond justified NextAuth interop, defensive guards (inverted-range, null-bound salary handling), and genuinely useful comments that explain *why*, not *what*.

---

## 3. Security Posture Assessment

**Basis:** Director Security gate (`docs/security/job-tracker/SECURITY_GATE_REVIEW.md`) — verdict CONDITIONAL.

The three Critical requirements are satisfied:
- **File-download IDOR:** PASS — `verifyFileOwnership` throws on key-prefix mismatch before signing; 15-min TTL.
- **SSRF:** PASS — all adapter base URLs are compile-time constants; no user-controlled hostnames; query params are properly URL-encoded.
- **Prompt injection:** PASS — exceeds requirement (forced tool_use).

Conditions from the security gate and their status at this review:
| ID | Sev | Status at VP review |
|----|-----|---------------------|
| C-01 IDOR on write path | HIGH | **RESOLVED** — `update` now scopes `where: { id, userId }` (verified in code) |
| C-02 No Zod + no FAILED path | LOW | Open — V1.1 |
| C-03 Auth stub | CRITICAL (prod) | Open — **production blocker**, accepted for private staging |
| C-04 Allowlist file + DNS rebinding absent | MEDIUM | Open — production hardening |
| C-05 Description truncation unverified | LOW | Open — verify in pipeline |

**Assessment:** No critical exploitable vulnerability in the single-user staging context. The security posture is appropriate to ship to private staging. C-03 and C-04 are mandatory before any production or multi-user exposure.

---

## 4. QA Coverage Assessment

**Basis:** Director QA gate (`docs/qa/job-tracker/QA_GATE_REVIEW.md`) — verdict CONDITIONAL. 87 pass / 5 fail / 92 total.

Hard gates:
- **SC REQUIRED recall = 100%** — MET (16/16 REQUIRED-path tests; zero REQUIRED→NONE_DETECTED). This is the single most important correctness property in the product. Met.
- **IDOR prevention** — implementation MET (verified by code inspection on all three methods); automated regression test absent (V1.1).
- **Sponsor LIKELY/UNKNOWN** — MET; **CONFIRMED** untested (DB unstubbed).

Coverage by domain: clearance detection and security regression (path traversal) are well-covered. Resume parsing (Domain 2) and job-source API integration (Domain 3) have **zero tests** — both require infrastructure (Claude key, Prisma DB, WireMock) not yet wired into CI. This is phase-gating, not negligence, and is registered as mandatory V1.1 backlog.

5 failing tests = 4 real P1 bugs (BUG-001..004) + 1 test-expectation mismatch. None touch the protective eligibility/clearance paths.

**Assessment:** QA coverage is acceptable for a conditional v1 ship. The critical correctness gate (clearance recall) is met. The test-coverage debt is well-documented and prioritised.

---

## 5. Engineering Standards Compliance

**Verdict: PASS**

| Standard | Status |
|----------|--------|
| Architecture document exists, current, approved | YES — JOBSCOPE_ARCHITECTURE.md v1.0 |
| ADRs exist for non-obvious decisions | YES — ADR-001/002/003, all high quality |
| Critical paths tested | PARTIAL — clearance recall + path traversal yes; CONFIRMED sponsor, IDOR-automated, parsing, API integration no (V1.1) |
| Security gate completed and signed | YES — Director Security CONDITIONAL |
| QA gate completed and signed | YES — Director QA CONDITIONAL |
| Code typed, linted, consistent | YES |
| Secrets externalised | YES — env vars; no committed secrets observed in reviewed files |
| Documentation traces decisions to source | YES — auditable matchReason / matchedKeywords |

Documentation drift to correct in V1.1: ADR-003 model name (sonnet vs as-built haiku); architecture doc references `claude-sonnet-4-5`.

---

## 6. Overall Verdict

# CONDITIONAL PASS

JobScope v1 is **cleared to ship to private, single-user Railway staging.** The architecture is sound, the security-critical paths (IDOR, SSRF, prompt injection, clearance recall) are correct, the code quality of the core matching engine is high, and engineering process (ADRs, architecture doc, two signed department gates) is fully observed.

It is **NOT cleared for production or any non-Atharva / public traffic** until the production conditions below are met.

---

## 7. P0 Blockers Before v1 Ships (to private staging)

**None.** No P0 blocker prevents the private single-user staging ship. The IDOR write-path issue (former C-01) is already resolved in code.

## 7a. Production Gate (P0 before any production / multi-user / public traffic)

These are hard blockers for production, not for staging:
- **PROD-1 (was C-03, CRITICAL):** Replace the auth stub. `auth-config.ts authorize()` accepts any credentials and returns a hardcoded `dev-user-id`. Wire real NextAuth v5 credential verification (DB-backed user lookup, password hashing) before any session that is not Atharva's on a private network.
- **PROD-2 (was C-04, MEDIUM→raised to production-blocking):** Create `src/config/allowed-external-hosts.ts` centralised allowlist and add DNS-rebinding (RFC-1918) protection to the adapter HTTP client. Hardcoded base URLs are adequate for staging; the centralised control + DNS check are required before exposing the pipeline to production.

---

## 8. V1.1 Backlog

**Bugs (P1 — fix before V1.1 release):**
- BUG-001: clearance-detector — "sc advantageous" → PREFERRED (currently REQUIRED).
- BUG-002: scoreSeniority — senior+junior conflict → MID (currently SENIOR).
- BUG-003: detectSubDomain — GRC false positive on "administration"-type text.
- BUG-004: normaliseCompanyName — multi-suffix stripping too aggressive ("UK International Holdings Ltd" → "").

**Test coverage (mandatory V1.1):**
- Wire Prisma; enable + test the CONFIRMED sponsor path (GAP-001).
- 500-pair labelled sponsor-name corpus + parameterised accuracy test (GAP-002).
- LLM resume-parsing tests: 20-resume corpus, schema-contract, 5-run consistency, cert recall (GAP-003).
- Job-source API integration: Pact contracts, WireMock stubs, 8-scenario degradation matrix (GAP-004).
- 200-JD clearance corpus with precision/recall thresholds (GAP-005).
- Automated IDOR test suite — cross-user GET/PATCH/DELETE + resume download (GAP-006).
- SSRF test suite (GAP-007); auth-bypass test suite (GAP-008).

**Hardening / hygiene:**
- C-02: Zod `.strip()` schema on Claude tool output + FAILED status path on deviation.
- C-05: confirm 20,000-char description truncation in `src/lib/pipeline/process-job.ts`.
- Verify magic-byte MIME validation (SR-03-01) in the upload route handler.
- Compliance Auditor GDPR/DPA deliverables (SR-06).
- Transport security headers in `next.config.ts` (SR-09); `npm audit` + Dependabot (SR-10).
- Update ADR-003 and architecture doc to reflect as-built model (`claude-haiku-4-5-20251001`).

---

**VP_ENGINEERING SIGN-OFF — CONDITIONAL PASS — 2026-06-09 — JobScope v1**

Cleared to private Railway staging. Production gated on PROD-1 (NextAuth) and PROD-2 (SSRF allowlist + DNS rebinding). Core architecture, security-critical paths, and clearance-recall hard gate all verified. Test-coverage and hardening debt documented and prioritised for V1.1.

*VP Engineering*
