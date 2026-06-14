# Testing Strategy — JobScope

**Owner:** Director QA / Test Automation Engineer
**Project:** JobScope
**Date:** 2026-06-08
**Status:** Approved — derived from MEP and department proposal

---

## Overview

JobScope has four testing domains with specific, measurable accuracy requirements. This strategy defines what "done" means for QA — not just "tests pass" but "these accuracy thresholds are demonstrated on real data."

The four testing domains are:
1. **Fuzzy sponsor-name matching accuracy** — the most critical functional test
2. **LLM resume parsing correctness** — property-based, schema-contract, corpus-validated
3. **Job source API integration** — contract tests + degradation matrix
4. **SC/DV-clearance keyword detection** — recall and precision on a labeled corpus

A fifth domain runs from day 1 alongside all development:
5. **Security regression** — the jobsync anti-pattern test suite

---

## Domain 1: Fuzzy sponsor-name matching accuracy

### What is being tested

The pg_trgm fuzzy-matching pipeline that maps job-board company names to the gov.uk sponsor register. False positives (showing CONFIRMED/LIKELY for a non-sponsor) cause Atharva to waste time applying to companies that cannot sponsor him. False negatives (showing UNKNOWN for a real sponsor) cause him to miss eligible roles.

### Test set

- **500 labeled pairs**: (job_board_company_name, register_entry_or_null) with ground-truth label {CONFIRMED_MATCH / LIKELY_MATCH / NO_MATCH}
- Sampling strategy: 200 exact matches (known sponsors with identical name on register), 150 near-misses (typos, legal suffix variants, common abbreviations), 150 true negatives (companies confirmed not on register)
- Test set must be reviewed and signed off by Director QA before use — not generated automatically

### Acceptance thresholds

- **False positive rate: < 5%** — showing CONFIRMED or LIKELY for a company that is NOT on the register
- **False negative rate: < 2%** — showing UNKNOWN for a company that IS on the register with a match confidence that should clear the threshold

### Measurement

```
False positive rate = FP / (FP + TN) × 100
False negative rate = FN / (FN + TP) × 100
```

If either threshold is missed at Phase 5 gate: QA blocker raised, do not ship, VP Engineering reviews the matching algorithm. This is a hard gate — not advisory.

### Test automation

- Parameterised pytest test: reads the 500-pair CSV, runs each pair through the sponsor matcher service, compares output to ground-truth label
- Output: confusion matrix + FPR + FNR in the test report
- Run in CI: yes (uses a test-only PostgreSQL instance with pg_trgm loaded)

---

## Domain 2: LLM resume parsing correctness

### What is being tested

The Claude API structured-JSON extraction of resume data (skills, roles, certs, experience_years, education). The extraction must be stable (same resume → same output across runs), schema-correct (JSON output matches the defined schema), and accurate for known cybersecurity certifications.

### Testing approach

Two complementary methods:

#### 2a: Property-based contract validation

- Every Claude API call returns a JSON object validated against the defined Zod/JSON schema
- Required properties: `skills` (array of strings), `roles` (array of objects with title/company/dates), `certifications` (array from enum), `experience_years` (integer ≥ 0), `education` (array of objects)
- Test: 100% of API responses must be schema-valid — any schema violation is a P0 bug

#### 2b: Canonical corpus × 5 runs

- **20-resume canonical corpus**: 20 synthetic resumes covering the full range of layouts (table format, plain text, two-column PDF, DOCX template, scanned-then-OCR'd) and content (junior, mid, senior; SOC, pentesting, GRC, cloud security; UK and non-UK education systems)
- Each resume run **5 times** through the parsing pipeline
- Acceptance criteria:
  - Certification extraction: 100% recall on CEH, OSCP, eJPT, GCHQ-accredited MSc, Fortinet NSE when present (zero missed certs)
  - Core skills extraction: ≥90% consistency across 5 runs for the same resume
  - No hallucinated certifications: zero cases of a certification appearing in output that does not appear in the input text

### Test automation

- Canonical corpus stored in `tests/fixtures/resumes/` (20 files)
- Pytest parameterised test: for each resume, runs the full parsing pipeline 5 times, compares outputs for consistency, checks certification recall and zero-hallucination
- Schema validation runs on every response via Zod in the application code — test confirms validation is active

---

## Domain 3: Job source API integration

### What is being tested

The three job-board API adapters (Adzuna, Reed, Jooble) and the gov.uk CSV downloader. Both the happy path and degraded states must be tested.

### 3a: Pact contract tests

- For each API source (Adzuna, Reed, Jooble), define a Pact consumer contract specifying:
  - Expected request shape (endpoint, params, auth headers)
  - Expected response shape (required fields, types, pagination format)
- Contract tests run against WireMock stubs in CI — no real API calls in automated tests
- If an API provider changes their response shape, the Pact test fails before the integration breaks in production

### 3b: WireMock stubs

- Stubs defined for: normal response, empty results, rate-limited (HTTP 429), service unavailable (HTTP 503), malformed JSON, unexpected schema
- All adapter code tested against all stub scenarios

### 3c: Degradation matrix (8 combinations)

Test all single-source and multi-source up/down scenarios:

| Scenario | Adzuna | Reed | Jooble | Expected behaviour |
|---|---|---|---|---|
| All up | ✓ | ✓ | ✓ | Normal — full results |
| Adzuna down | ✗ | ✓ | ✓ | Reed + Jooble serve results; Adzuna retried per schedule; /healthz shows Adzuna DEGRADED |
| Reed down | ✓ | ✗ | ✓ | Adzuna + Jooble serve results; Reed retried; /healthz shows Reed DEGRADED |
| Jooble down | ✓ | ✓ | ✗ | Adzuna + Reed serve results; Jooble retried |
| Adzuna 429 | 429 | ✓ | ✓ | Adzuna suspended for 1h per retry policy; resumes after suspension window |
| Reed 429 | ✓ | 429 | ✓ | Reed suspended for 1h |
| Two sources down | ✗ | ✗ | ✓ | Jooble alone serves results; staleness alert if last-fetched-at > 2× expected interval |
| All down | ✗ | ✗ | ✗ | /healthz returns 503 with staleness detail; user sees banner in UI |

### 3d: gov.uk CSV schema validation

- Separate test: download the live gov.uk CSV in a sandboxed test environment
- Validate against the expected schema (column names, order, types)
- If schema differs from expected: test fails — this is the early-warning trigger for the "silent format change" risk

---

## Domain 4: SC/DV-clearance keyword detection

### What is being tested

The clearance detection pipeline that scans job titles and descriptions for SC/DV/BPSS requirement signals. False negatives (labelling a clearance-required role as NONE DETECTED) are the most dangerous outcome — Atharva would apply to an ineligible role.

### Labeled corpus

- **200 job descriptions**: 80 REQUIRED (explicitly require SC/DV), 50 PREFERRED (mention clearance as beneficial), 70 NONE_DETECTED (no clearance mention)
- Corpus must include non-standard phrasing variants: "SC eligible", "active clearance required", "must be eligible for SC", "clearance to DV level desirable", "security vetting required", "BPSS as minimum"
- Corpus reviewed by Director QA and Director Security together before use

### Acceptance thresholds

- **Recall ≥ 95%**: of all 130 clearance-mentioning JDs (REQUIRED + PREFERRED), ≥95% correctly identified as clearance-mentioning (not labelled NONE_DETECTED)
- **Precision ≥ 85%**: of all JDs labelled as clearance-mentioning by the system, ≥85% actually are clearance-mentioning (no phantom clearance flags on unrelated security-related JDs like "information security" or "security software")

These are soft thresholds for PREFERRED detection. For REQUIRED detection specifically: **recall must be 100%** — zero cases of a "SC clearance required" role being shown as eligible in the default view. This is a hard gate.

### Test automation

- Parameterised pytest test: reads 200-JD corpus, runs each through clearance detector, compares output label to ground-truth
- Generates: recall, precision, confusion matrix
- Hard gate check: any REQUIRED-labelled JD outputting NONE_DETECTED → immediate test failure

---

## Domain 5: Security regression (day 1, runs in every CI build)

### What is being tested

The four jobsync anti-pattern classes that the MEP explicitly calls out as known failure modes. These are not "nice to have" tests — they are mandatory regression tests that run from the first line of backend code written.

### SSRF payloads

Test that the server cannot be induced to make HTTP requests to attacker-controlled URLs:
- Attempts via resume upload filename field
- Attempts via any URL-accepting parameter
- Attempts via job description HTML if rendered server-side
- Expected: all rejected with 400; no outbound HTTP request made to non-allowlisted domain

### Path traversal

Test file upload endpoints reject traversal attempts:
- Filenames containing `../`, `..%2F`, null bytes, absolute paths
- Expected: all rejected at validation; no file written outside intended storage directory

### IDOR: cross-user access on every resource endpoint

For every endpoint that returns user-owned data (resume download, application records, profile, job feed):
- Test: authenticated as User A, attempt to access User B's resource via direct URL/ID manipulation
- Expected: 403 on all attempts — not 404, not 200 with empty data, but explicit 403
- This test suite must be written before Phase 2 code merges — not added after

### Auth bypass

- Test: accessing protected endpoints without authentication → 401
- Test: accessing protected endpoints with expired session → 401
- Test: CSRF on state-changing endpoints (POST, PUT, DELETE) → reject missing/invalid CSRF token

### When this runs

- In CI: every push to any branch
- Blocked merge to `main` if any security regression test fails
- Director Security reviews and approves the security test suite before it is committed

---

## Quality gate — Phase 5

Director QA sign-off (DIRECTOR_QA_SIGNOFF.md) requires all of the following:

- [ ] Domain 1 (fuzzy match): FPR < 5%, FNR < 2% demonstrated on 500-pair labeled set
- [ ] Domain 2 (LLM parsing): all 20-resume corpus × 5 runs pass schema validation; certification recall 100%
- [ ] Domain 3 (API integration): all 8 degradation scenarios tested; Pact contracts defined and passing
- [ ] Domain 4 (clearance detection): recall ≥ 95%, precision ≥ 85% on 200-JD corpus; hard gate (REQUIRED recall = 100%) satisfied
- [ ] Domain 5 (security regression): SSRF, path traversal, IDOR, auth bypass test suites all passing in CI
- [ ] All P0 and P1 bugs from QA testing resolved
- [ ] Performance: job feed page loads within 2 seconds for 1000 jobs in database

---

## Test artefacts ownership

| Artefact | Location | Owner |
|---|---|---|
| Fuzzy-match labeled set (500 pairs) | tests/fixtures/sponsor_match_corpus.csv | Director QA |
| Resume canonical corpus (20 files) | tests/fixtures/resumes/ | Director QA |
| Clearance-detection corpus (200 JDs) | tests/fixtures/clearance_corpus.csv | Director QA + Director Security |
| Pact contracts | tests/contracts/ | Test Automation Engineer |
| WireMock stubs | tests/stubs/ | Test Automation Engineer |
| Security regression tests | tests/security/ | SAST/DAST Engineer + Penetration Tester |
| Test reports | docs/projects/job-tracker/qa/ | Director QA |
