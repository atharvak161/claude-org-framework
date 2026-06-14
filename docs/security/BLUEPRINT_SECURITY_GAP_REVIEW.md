# Blueprint Security Gap Review

**Subject release:** Blueprint (formerly Excel-Project-Hub) — production deployment
**Live URL:** https://atharvak161.github.io/Blueprint/
**Commit:** d3f3c42
**Deploy:** GitHub Actions run 27093810882
**Review date:** 2026-06-07
**Reviewer:** Director Security
**Review type:** Post-hoc security sign-off gap audit (release already shipped)

---

## 1. Does a security sign-off exist for this release?

**No.**

Evidence:
- `review/SIGN_OFFS.md` contains exactly **one** entry for this release, dated
  2026-06-07, authored by **Director QA** ("Blueprint live regression pass").
  It covers functional regression only — app load, navigation, CRUD, exports,
  report tabs, localStorage persistence. It contains no security content and
  makes no security claim.
- There is no `DIRECTOR_SECURITY_SIGNOFF.md` anywhere under `docs/security/`.
- There is no `SECURITY_SIGNOFF.md` (the Security Architect's required
  pre-deployment artefact per their own CLAUDE.md) anywhere under `docs/security/`.
- `docs/security/` contains only: a 1-line `THREAT_MODEL.md` stub, an empty
  `findings/` directory, and an empty `compliance/evidence/` directory — none
  reference Blueprint or Excel-Project-Hub.
- `org/ACTIVITY.md` contains **zero** `DIRECTOR_SECURITY` entries and **zero**
  `SECURITY_ARCHITECT` entries for the entire Blueprint rename/bugfix/ship cycle
  (2026-06-07 14:03:30 → 20:53:24, commits through d3f3c42, deploy 27093810882).
  The only security-related `SECURITY_ARCHITECT` activity in the log at all is a
  single, unrelated entry from 2026-05-31 for a different project
  (`docs/projects/financial-dashboard/SECURITY_REVIEW.md`).
- `org/LIVE.md` shows zero `DIRECTOR_SECURITY` involvement during the Blueprint
  ship window.
- This Director Security agent (created 2026-06-01) had **zero logged actions**
  of any kind prior to this review — independently confirmed by HR Manager
  (`org/DECISIONS.md`, 2026-06-07 23:45:05) and by Guide & Explainer's
  counter-review.

**Conclusion: Blueprint shipped to a public production URL with no security
review of any kind, by any security-department agent, at any stage —
not pre-build, not pre-deploy, not post-deploy.** The release proceeded
through the Chief of Staff → Director QA → Atharva chain with the Security
department entirely absent from the review chain prescribed in this
organisation's own protocol (Review chain: *SAST/DAST Engineer + Penetration
Tester → Security Architect → Director Security → Chief of Staff*).

---

## 2. Gaps against my own review-gate checklist

My CLAUDE.md mandates six gate items before any security-related output
reaches the Chief of Staff. Walking each against the evidence:

| # | Gate item (per my CLAUDE.md) | Status | Evidence |
|---|---|---|---|
| 1 | Security Architect has completed the threat model (`THREAT_MODEL.md`) | **ABSENT** | `docs/security/THREAT_MODEL.md` is a single line: *"Threat model — Security Architect owns this."* No STRIDE analysis (spoofing/tampering/repudiation/information-disclosure/DoS/elevation-of-privilege) exists for Blueprint or any other project. No project-scoped threat model file exists anywhere under `docs/security/` or `docs/projects/blueprint/`. |
| 2 | Security requirements documented (`SECURITY_REQUIREMENTS.md`) | **ABSENT** | No file of this name exists anywhere in the repository (`find` returns nothing). No documented authentication/authorisation/encryption/secrets/audit-logging/rate-limiting/input-validation/dependency-CVE requirements exist for Blueprint. |
| 3 | All Critical/High SAST/DAST findings resolved or risk-accepted with written rationale | **ABSENT — not even attempted** | `docs/security/findings/` is an empty directory. No SAST or DAST scan of any kind has been logged or run against the Blueprint/Excel-Project-Hub codebase (`src/projects/Excel-Project-Hub`, now `src/projects/atharvak161-github-io` per the working tree). Nothing to "resolve or risk-accept" because nothing was ever scanned. |
| 4 | Penetration Tester has completed engagement report | **ABSENT** | No `PENTEST_REPORT.md` exists anywhere under `docs/security/`. No Penetration Tester activity is logged for Blueprint or for any project in the monitored period. |
| 5 | Compliance Auditor has reviewed for regulatory obligations | **ABSENT** | `docs/security/compliance/evidence/` is empty. No compliance review of Blueprint (e.g. data-handling, cookie/localStorage disclosure, accessibility/legal posture for a public site) has been logged or filed. |
| 6 | If all pass → produce `DIRECTOR_SECURITY_SIGNOFF.md`; if any fail → return to Security Architect with specific remediation instructions, do not pass to Chief of Staff until resolved | **GATE NEVER RUN** | All five upstream items are absent — the gate was never invoked at all, by me or by anyone in the Security department, before the Chief of Staff approved and Atharva's deploy went live. There is nothing to "return to the Security Architect" retroactively for a release that has already shipped; the correct action now is forward-looking remediation (Section 4) plus an honest record that this gate was bypassed (Section 3/this document). |

**Net result: 0 of 6 gate items satisfied. The gate was not run — not failed,
not partially run, not skipped-with-rationale. It simply never started.**

This is not a Blueprint-specific failure. It is a standing organisational gap:
the Security department (myself and Security Architect) has produced **one**
piece of security work in the entire monitored history —
`docs/projects/financial-dashboard/SECURITY_REVIEW.md` (2026-05-31, Security
Architect, a different project) — and has never been engaged for
Excel-Project-Hub/Blueprint at any point across its rename, bugfix, and
production ship.

---

## 3. Risk assessment — shipping a public static site with no logged security review

**Overall rating: MEDIUM, trending toward MEDIUM-HIGH if the current pattern continues.**

Reasoning, scoped honestly to what Blueprint actually is (a client-side React
SPA served as a static bundle from GitHub Pages, with no backend the
organisation operates):

**Why it is not CRITICAL/HIGH today:**
- There is no first-party backend, database, or authentication system in this
  deployment — GitHub Pages serves static assets only. That removes the
  highest-impact STRIDE categories (server-side injection, auth bypass,
  privilege escalation against our infrastructure, server-side data breach)
  *as currently architected*.
- Application data (per Director QA's regression report,
  `docs/projects/blueprint/QA_REGRESSION_REPORT.md`) is stored in browser
  `localStorage`, scoped per-origin/per-path on the client. There is no
  evidence of the app transmitting user data to a first-party server we
  control, which narrows — but does not eliminate — the information-disclosure
  surface.
- The deploy pipeline is GitHub's own Actions → Pages flow, which carries
  GitHub's baseline platform security (TLS termination, DDoS mitigation at the
  edge) regardless of our own review status.

**Why it is not LOW / why this still matters — concretely:**
- **Supply-chain / dependency risk is completely unassessed.** A React/Vite SPA
  pulls in dozens to hundunds of npm dependencies. Zero SAST/dependency-CVE
  scanning has ever been run against this codebase. A known-vulnerable
  transitive dependency shipped to a public URL is a real, common attack
  vector (e.g. malicious package, prototype pollution, XSS-enabling library
  bugs) — and we would not know, because nobody has looked.
- **Client-side code is fully visible to any visitor.** Anything
  hardcoded — API keys, tokens, internal URLs, comments revealing
  architecture — ships in the bundle to the public internet. Nobody has
  checked for this (Rule 8 in WORKSPACE.md — "no hardcoded secrets ever" — is
  an org-wide rule, but verifying compliance on a public artefact is precisely
  a security-gate function, and it was never performed here).
- **XSS / DOM-based injection risk in a data-entry SPA is unassessed.** Blueprint
  lets users create projects, enter plan/Gantt/dashboard/RAG data, and
  import/export — all classic surfaces for stored or DOM-based XSS if
  user-supplied strings are rendered without sanitisation. No DAST or manual
  review has tested this. A public site with an XSS hole is a direct,
  exploitable path to session/data compromise for any visitor, including Atharva.
- **No threat model means no one has actually thought through "who would attack
  this and how."** Even a "low value" static site is a foothold: defacement,
  malicious redirect injection, or serving altered JS to visitors damages
  Atharva's public reputation (the URL is `atharvak161.github.io` — tied
  directly to his name/brand) regardless of whether there's a database behind it.
- **Precedent risk is the real long-tail problem.** This is not an isolated
  miss — it is the *first* production release since this Director Security role
  was created (2026-06-01), and the Security department was bypassed entirely,
  with zero escalation from any agent in the chain (Chief of Staff, VP
  Engineering, Director QA all signed off on functional/process grounds without
  ever routing through Security). If this pattern holds for the next release —
  and the next one touches a backend, real user data, or payment info — the
  exact same silent bypass produces a genuinely critical incident. The
  Blueprint gap is the cheap warning; the next one may not be cheap.

**Bottom line:** today's actual exposure is bounded by the site's simplicity
(no first-party backend = no server-side breach surface), so I am not invoking
my "Critical vulnerability in a live system → escalate to Chief of Staff
immediately" rule — there is no evidence of an actual exploited vulnerability,
only an absence of review. But "no evidence of a problem because no one
looked" is not the same as "no problem," and the *process* failure — a public
release shipping with the Security department's review chain entirely
unused — is itself the finding that needs to go to the Chief of Staff, which
this document does.

---

## 4. Remediation plan — owners and sequencing

This is corrective for Blueprint specifically, and structural for the
organisation so this does not recur on the next release (which may carry far
higher stakes).

### Phase 1 — Immediate (retroactive coverage for the live release), parallel where marked

1. **Security Architect** — produce `docs/security/THREAT_MODEL.md` (project-scoped,
   STRIDE-based) and `docs/security/SECURITY_REQUIREMENTS.md` for Blueprint as it
   exists today (static SPA, GitHub Pages, localStorage persistence, no backend).
   *This is explicitly Security Architect's gate item, not mine — I identify
   the gap and assign it; I do not write the threat model myself.*
   — **Owner: Security Architect. Start: immediately. [Can run in parallel with #2]**

2. **SAST/DAST Engineer** (reporting through Security Architect) — run a
   dependency/SAST scan against `src/projects/Excel-Project-Hub` (the Blueprint
   source tree) for known-CVE dependencies and common SPA vulnerability
   patterns (XSS sinks, unsafe `dangerouslySetInnerHTML` usage, hardcoded
   secrets per Rule 8), and a basic DAST pass against the live URL
   (https://atharvak161.github.io/Blueprint/) for client-side injection and
   information disclosure. File results to `docs/security/findings/` using the
   `FIND-NNN-short-title.md` convention.
   — **Owner: SAST/DAST Engineer (via Security Architect). Start: immediately. [Parallel with #1]**

3. **Compliance Auditor** (reporting through Security Architect) — confirm
   whether a public site that persists user-entered project data in browser
   storage carries any regulatory/compliance obligations worth flagging (data
   handling disclosure, accessibility) — likely a short, low-finding review
   given the site's nature, but it must be *done and logged*, not assumed.
   — **Owner: Compliance Auditor (via Security Architect). Start: immediately. [Parallel with #1, #2]**

4. **Penetration Tester** — scoped engagement against the live Blueprint URL,
   informed by the threat model from #1 and findings from #2. This sits after
   #1/#2 produce a baseline so the test is targeted, not blind.
   — **Owner: Penetration Tester (via Security Architect). Start: after #1 and #2 land (sequenced).**

5. **Security Architect** — once #1–#4 are complete and any Critical/High
   findings are resolved or formally risk-accepted (with written rationale to
   `org/DECISIONS.md`), issue `docs/security/SECURITY_SIGNOFF.md` and append
   the `SECURITY_ARCHITECT SIGN-OFF: [GRANTED/WITHHELD]` line to
   `review/SIGN_OFFS.md` per their own CLAUDE.md.
   — **Owner: Security Architect. Sequenced: last in this phase, after #1–#4.**

6. **Director Security (me)** — run the full six-point gate against the
   completed package from #1–#5, and if it passes, produce
   `docs/security/DIRECTOR_SECURITY_SIGNOFF.md` and append my own line to
   `review/SIGN_OFFS.md`. If it fails on any point, return to Security
   Architect with specific remediation instructions per my own CLAUDE.md
   (no fabricated pass — that is the entire point of this exercise).
   — **Owner: Director Security. Sequenced: final gate, after #5.**

### Phase 2 — Structural fix (prevents recurrence on the next, higher-stakes release)

7. **Chief of Staff** — formally add "Security Architect threat model +
   sign-off" as a hard blocking gate in the release/MEP workflow for *every*
   project that produces a publicly reachable artefact, not just
   backend/data-bearing ones — closing the exact loophole that let Blueprint
   (perceived as "just a static site, low risk") skip the chain entirely. This
   mirrors the Definition-of-Done correction the Chief of Staff already made
   for live verification (`org/DECISIONS.md`, 2026-06-07 23:20:42) — same
   class of fix: make the previously-implicit gate explicit and mandatory.
   — **Owner: Chief of Staff. Sequenced: can start immediately, in parallel with Phase 1 — it governs the *next* release, not this one.**

8. **HR Manager** — fold "Director Security / Security Architect must be
   spawned and must log activity for every release with a public-facing
   artefact" into the onboarding/operational-readiness criteria already being
   built for this department (per the smoke-test plan in
   `docs/projects/hr_pipeline_backfill/DIRECTOR_SMOKE_TEST_PLAN.md`), so the
   next "zero logged actions in N days while a release ships" condition is
   caught by HR's own audit cadence rather than by a commissioned smoke test.
   — **Owner: HR Manager. Sequenced: in parallel with Phase 1, informs the next operational-readiness review.**

### Sequencing summary

```
Phase 1:  [Security Architect: threat model] ─┐
          [SAST/DAST: scan]                    ├─→ [Pentest] ─→ [Security Architect: sign-off] ─→ [Director Security: gate + sign-off]
          [Compliance Auditor: review]        ─┘

Phase 2:  [Chief of Staff: hard gate in MEP workflow]   (parallel, governs future releases)
          [HR Manager: fold into readiness criteria]    (parallel, governs future audits)
```

### Escalation trigger I am setting on this remediation

If Phase 1 items #1–#3 are not started within **2 working iterations** of this
report landing, I escalate to the Chief of Staff per my own CLAUDE.md
escalation rule ("A department is consistently bypassing security review →
escalate to Chief of Staff + HR Manager") — and in this instance the
"department" bypassing review has, to date, included my own reporting line
(Security Architect) as well as every department that approved this release
without routing through us. That is named here so it is not buried.

---

## Summary for the record

- **Sign-off exists?** No. One QA sign-off exists; zero security sign-offs exist.
- **Gate score:** 0 / 6 of my own mandatory review-gate items satisfied — the
  gate was never invoked, by anyone, at any stage of the Blueprint ship cycle.
- **Risk:** MEDIUM today (bounded by the site's static, backend-less
  architecture), with a clear path to HIGH if the next release — which may
  carry real user data or a backend — follows the same pattern of bypassing
  Security entirely.
- **Fix:** A scoped, sequenced Phase 1 closes the gap retroactively for
  Blueprint (owners: Security Architect → SAST/DAST Engineer → Compliance
  Auditor → Penetration Tester → Security Architect sign-off → Director
  Security gate). A structural Phase 2 (Chief of Staff + HR Manager) prevents
  this from recurring on the next, likely higher-stakes, release.
- **What I am explicitly not doing:** writing the threat model or security
  requirements myself (that is Security Architect's deliverable per their
  CLAUDE.md and the org's division of labour), and not fabricating a sign-off
  that does not exist. The honest gap, named precisely and assigned correctly,
  is the deliverable.
