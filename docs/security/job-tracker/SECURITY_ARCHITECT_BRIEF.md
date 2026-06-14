# SECURITY_ARCHITECT_BRIEF.md — JobScope Phase 1
**From:** Director Security
**To:** Security Architect
**Date:** 2026-06-08
**Project:** JobScope
**Priority:** Phase 1 — immediate engagement

---

## Context

JobScope is a new build starting Phase 1 today. It is a personalised job-search and application-tracker for a single user (Atharva Kulkarni). The reference project (Gsync/jobsync) had four documented security vulnerabilities — SSRF via user-controlled URL, IDOR on file download, systemic IDOR across all action endpoints, and auth weaknesses. The architecture has been designed to prevent all four. Your job is to verify that the implementation matches the design and that nothing new slips through.

This is the proactive security gate. Blueprint had none. JobScope has it from day one.

**Key documents to read before starting:**
- Architecture: `/Users/atharva/Downloads/organisation/docs/architecture/JOBSCOPE_ARCHITECTURE.md`
- MEP: `/Users/atharva/.claude/plans/mighty-enchanting-manatee.md`
- Threat model: `/Users/atharva/Downloads/organisation/docs/security/job-tracker/THREAT_MODEL.md`
- Security requirements: `/Users/atharva/Downloads/organisation/docs/security/job-tracker/SECURITY_REQUIREMENTS.md`

---

## Your tasks — in order

### Task 1 (immediate): Architecture security review

Read the architecture document at `docs/architecture/JOBSCOPE_ARCHITECTURE.md` and produce an architecture security review. Write it to:

```
docs/security/job-tracker/ARCHITECTURE_SECURITY_REVIEW.md
```

Review the following specifically:
1. **SSRF prevention** (section 6.1): verify the allowlist approach is structurally sound. Flag if any component description implies a user-URL-to-server-fetch path.
2. **IDOR prevention** (section 6.2): verify the service-layer ownership check pattern is described clearly enough that a developer cannot misunderstand it.
3. **File upload flow** (section 4): verify the file upload pipeline has no gaps (magic byte check, size limit before storage write, UUID key, private bucket).
4. **Auth configuration** (section 6.5): verify NextAuth v5 is configured with all required cookie flags. Flag if any session configuration concern exists.
5. **Background worker isolation**: verify the worker service has no route to accepting user-controlled input as a URL.
6. **Claude API integration** (section 4): verify the resume parsing pipeline does not log resume text, does not persist raw text outside user_profiles, and that the structured output schema enforcement is described.
7. **API surface** (section 5): verify every route that is not /api/health requires authentication. Verify no admin or debug routes are described.

Report findings as: CRITICAL / HIGH / MEDIUM / LOW. Any Critical or High finding must be resolved before Phase 2 begins.

---

### Task 2 (Phase 2 — next iteration): Code review of resume-upload and job-ingestion code

When the Backend Developer and Integration Engineer complete their work (Phase 2), you will perform a mandatory security review of the following code:

**Resume upload pipeline:**
- Upload handler: MIME validation, size limit, key construction, ownership check before signed URL generation
- Worker process: extracted text not persisted, Claude prompt structure, Zod schema validation with strip mode

**Job ingestion pipeline:**
- All adapter files: no hardcoded API keys, outbound requests only to allowlisted hosts, API key not in logs
- gov.uk CSV worker: schema validation logic, halt-on-unexpected-schema behaviour
- Normalisation worker: field truncation at 20,000 chars, no dangerouslySetInnerHTML usage downstream

For each file reviewed, use the finding format: FIND-NNN-short-title.md in docs/security/findings/.

Report completion to Director Security when done.

---

### Task 3 (ongoing): PR-level security reviewer

You are the mandatory security reviewer on all pull requests that touch:
- Any file in src/backend/services/ (ownership check verification)
- Any file in src/backend/routes/ (auth middleware verification)
- Any file in src/integrations/ (allowlist compliance, no secrets in logs)
- Any file in src/backend/ that handles file upload or download
- Any file in src/config/ (especially allowed-external-hosts.ts)
- Any Prisma schema change (verify no sequential IDs on user-owned tables)
- Any NextAuth configuration change

For PR reviews:
- Use GitHub PR review comments via gh CLI
- Findings format: label each comment CRITICAL / HIGH / MEDIUM / LOW
- Critical findings: block merge immediately, notify Director Security
- High findings: block merge until resolved
- Medium/Low findings: must be addressed or explicitly accepted before merge

---

## Acceptance criteria for Phase 1 deliverable

Phase 1 is complete when:
- docs/security/job-tracker/ARCHITECTURE_SECURITY_REVIEW.md is written
- All Critical and High architecture findings are resolved or escalated to Director Security
- You have confirmed engagement as PR reviewer for all security-sensitive files listed in Task 3
- You have logged task start and completion to org/ACTIVITY.md

---

## Escalation path

- Architecture finding you cannot resolve with VP Engineering: escalate to Director Security
- Developer repeatedly bypassing review comments: escalate to Director Security then HR Manager
- Something requiring a significant architecture redesign: escalate to Director Security and VP Engineering immediately

---

## Notes from Director Security

The four jobsync vulnerabilities are your primary test cases. If any of them could be reproduced in JobScope's implementation, that is a Critical finding and work stops on that component until fixed. The architecture describes mitigations — your job is to verify the implementation delivers them.

The Claude API resume PII transfer (threat I-10) is an accepted design decision per ADR-003. Verify the mitigations are present: consent is recorded, raw text is not logged, Compliance Auditor confirms Anthropic DPA. Do not reopen the architectural decision.

Compliance Auditor should be briefed on SR-06 requirements (Article 30 register, consent mechanism, international transfer assessment). They report to you — coordinate directly.

Start with Task 1. Report architecture review completion to Director Security.

---

*Director Security — 2026-06-08*
