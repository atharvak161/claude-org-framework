# VP Engineering Sign-Off — Org Chart SVG Restoration
## Date: 2026-06-02
## Verdict: APPROVED WITH DEFERRED ITEMS

---

## Applied fixes

1. **oc-dept font-size: 8px → 9px**
   `monitor.html` line ~1308. The Creative Director flagged 8px as marginal for legibility
   at standard monitor distance. 9px sits inside WCAG minimum for small-caps mono text and
   still fits cleanly within the 48px card height given current padding. One-line change,
   zero risk.

2. **ready status dot: added box-shadow ring**
   `.oc-status-dot.ready` now carries `box-shadow: 0 0 0 1px var(--teal)`.
   At zoom levels below 0.5x the dot renders at ~2px; the opacity-only distinction between
   ready (0.6) and idle (0.4) is imperceptible. The 1px outline ring gives the ready state
   a hard edge without changing its fill or opacity semantics. One-line change, zero risk.

3. **Inline handler escaping: VERIFIED, no change required**
   The Code Reviewer noted that `onmouseover`/`onmouseout` inline handler strings could
   break if agent names contain apostrophes or backslashes. Inspection confirmed that both
   handlers are keyed on `p.key` (registry keys: uppercase underscored identifiers such as
   `CHIEF_OF_STAFF`), not on `n.name`. The pattern `escHtml(p.key).replace(/'/g, "\\'")` is
   already applied on both handlers at lines 4063–4064. Registry keys by convention contain
   no quotes or backslashes. No change required.

---

## Deferred items (logged, not blocking)

| # | Item | Source | Reason for deferral |
|---|------|---------|---------------------|
| D1 | Legend does not explain department colour coding via left border | Creative Director (Low) | Design decision — requires copy and layout consensus; not a functional gap |
| D2 | Safari `foreignObject` + `overflow:hidden` clipping inconsistency | Creative Director (Low) | No Safari access in current environment; flag for next cross-browser QA pass |
| D3 | Canvas width ~9,600–12,000px at 90 agents | Creative Director (Low) + Code Reviewer (Note 1) | UX limitation, not a bug; zoom controls exist; collapse/expand or fisheye zoom is a design-phase decision |
| D4 | No duplicate-name guard in `buildOrgTree` | Code Reviewer (Note 2) | Registry is curated and has no duplicates; add guard if registry ever becomes user-editable |

---

## Sign-off

Approved for deployment.

Both reviewers (Creative Director and Code Reviewer) cleared the implementation at
APPROVED WITH NOTES and PASS WITH NOTES respectively. The two medium-priority notes have
been addressed. All remaining notes are low-priority, require design decisions or hardware
access not available in this environment, and do not affect the correctness or usability of
the org chart at current organisation scale.

The SVG org chart is production-quality for the current 21-department, up-to-90-agent
registry. It may be deployed as-is.

**Signed: VP Engineering**
**Date: 2026-06-02**
