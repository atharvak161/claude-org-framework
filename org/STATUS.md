# Project status — Senior Project Manager updates after every task.

---

## Active project: JobScope

**Status:** v1 COMPLETE — Phases 1–5 delivered (CONDITIONAL gates passed for single-user staging)
**Last updated:** 2026-06-09 SENIOR_PROJECT_MANAGER
**MEP:** /Users/atharva/.claude/plans/mighty-enchanting-manatee.md
**GitHub repo:** atharvak161/jobscope — 13 commits on origin/main, PRs #4 and #6 merged
**Deployment model:** Docker-first (Dockerfile + docker-compose.yml; all Railway references removed)
**Zero-key job source:** RemoteOK adapter (src/lib/integrations/remoteok.ts) — works with no API key; other adapters degrade gracefully when keys absent

---

### Phase summary

| Phase | Description | Status |
|---|---|---|
| 1 — Architecture | Solution Architect (architecture + ADRs + DB schema); Infrastructure Engineer (repo + Docker + CI/CD); Director Security (threat model) | COMPLETE — 2026-06-09 |
| 2 — Core pipeline | DB Engineer (Prisma schema); Integration Engineer (job-source adapters incl. RemoteOK zero-key); Backend Developer (queue + matching engine) | COMPLETE — 2026-06-09 |
| 3 — Resume parsing | Backend Developer (upload + LLM extraction + profile storage) | COMPLETE — 2026-06-09 |
| 4 — Frontend | Frontend Developer (job feed, filter UI, confidence badges, application tracker) | COMPLETE — 2026-06-09 |
| 5 — Security + QA gates | Director Security sign-off; Director QA sign-off (accuracy test suites) | COMPLETE — 2026-06-09 (CONDITIONAL) |
| 6 — DevOps + deploy | Director DevOps sign-off; runbook; live deploy | DevOps sign-off PASS; live multi-user deploy gated on v1.1 production blockers |

**Sign-offs received (all 2026-06-09):**
- VP Engineering — CONDITIONAL PASS (cleared for private single-user staging; 2 production P0 blockers)
- Director Security — CONDITIONAL (no critical exploitable vulns in single-user v1; 5 conditions C-01..C-05)
- Director QA — CONDITIONAL (87/92 tests pass; SC REQUIRED recall 100% hard gate MET)
- Director DevOps — PASS (Docker deployment config meets all mandatory gate items)

**v1 ships to:** private single-user staging only. Production / multi-user / public traffic blocked until v1.1 production conditions are met (auth stub → real NextAuth v5; external-host allowlist + DNS-rebinding protection).

---

### Phase 1 tasks

| Task | Owner | Status | Unblocks |
|---|---|---|---|
| Architecture doc (ARCHITECTURE.md) + 3 ADRs | Solution Architect | NOT STARTED | Phase 2 entirely |
| DB schema design (Prisma — User, Job, SponsorRegister, Application, UserProfile) | DB Engineer | NOT STARTED — starts only after Solution Architect ADRs complete | Integration Engineer, Backend Developer |
| Create GitHub repo atharvak161/jobscope + Railway project + CI/CD skeleton | Infrastructure Engineer | NOT STARTED — parallel with Solution Architect | Phase 2 deployment path |
| Threat model (THREAT_MODEL.md) | Director Security | NOT STARTED — parallel with Solution Architect | Phase 2 security-aware implementation |

**Phase 1 parallel streams:**
- Stream A: Solution Architect → ARCHITECTURE.md + ADR-001 (database choice) + ADR-002 (job-source integration) + ADR-003 (resume parsing)
- Stream B (parallel with A): Infrastructure Engineer → GitHub repo + Railway project + CI/CD skeleton
- Stream C (parallel with A): Director Security → THREAT_MODEL.md

Phase 2 cannot begin until Stream A completes.

---

### Key dependencies (non-negotiable)

1. Solution Architect architecture doc + ADRs + DB schema **must exist before any significant backend or DB work begins**
2. DB schema must be finalised before Integration Engineer or Backend Developer start meaningful work
3. Security Architect must review all file-upload and external-data-ingestion code before it merges
4. API contracts (OpenAPI spec) must be defined before Frontend Developer starts
5. All three gate sign-offs (Director Security, Director DevOps, Director QA) required before v1 ships

---

### Key risks flagged

| Risk | Severity | Status |
|---|---|---|
| Fuzzy company-name matching false positives | High | Mitigated by 3-tier confidence system; tested against 200+ company ground-truth set in QA gate |
| SC-clearance keyword inference misses non-standard phrasing | High | Conservative keyword list + "clearance status unverified" fallback; user override available |
| IDOR on resume file download (jobsync's exact failure) | Critical | Architecture mandates owner-scoped signed URLs; will be an explicit QA + Security test case |
| SSRF via user-controlled input | Critical | No server-side URL fetching from user input; allowlisted domains only — enforced in Phase 2 |
| Silent pipeline failure (fetching stops unnoticed) | High | Monitoring SLO: alert if any source hasn't fetched in >25h — covered in Infrastructure Proposal |
| gov.uk CSV schema changes silently | Medium | Schema validation on every download; alert + halt if schema unexpected |
| Adzuna 250 req/day free tier | Medium | Reed (1000/day) as primary volume source; Adzuna + Jooble as supplements |

---

### Success criteria (measurable — from MEP)

1. ≥20 sponsor-confirmed, clearance-free, salary-appropriate roles within 24h of first setup
2. Sponsor-register matching: ≥95% precision, ≥90% recall (200+ company ground-truth set)
3. Zero SC-clearance-required roles shown as "eligible" in default view (hard requirement)
4. New jobs appear in feed within 24h of posting (pipeline freshness SLO)
5. All four org gates satisfied before v1 ships: Director Security ✓, Director DevOps ✓, Director QA ✓, VP Engineering ✓

---

### Previous project: Blueprint

**Status:** DELIVERED — live at https://atharvak161.github.io/Blueprint/
**Retrospective gaps logged:** Blueprint shipped without Security or DevOps gate sign-offs; remediation plans filed in docs/security/BLUEPRINT_SECURITY_GAP_REVIEW.md and docs/sre/BLUEPRINT_DEPLOYMENT_GAP_AUDIT.md. JobScope will not repeat this pattern — all gates are mandatory before v1 ships (standing decision, org/DECISIONS.md 2026-06-07 23:48:00).

---

### Standing quality gates — JobScope (non-negotiable)

- DIRECTOR_SECURITY_SIGNOFF.md required before v1
- DIRECTOR_DEVOPS_SIGNOFF.md required before v1
- DIRECTOR_QA_SIGNOFF.md required before v1
- VP_ENGINEERING_SIGNOFF.md required before v1
- Live verification (URL, real browser, no console errors) required — not just code-complete (org/DECISIONS.md 2026-06-07 23:20:42)
