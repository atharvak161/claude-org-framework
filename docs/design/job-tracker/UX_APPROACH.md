# UX Approach — JobScope

**Owner:** UX Designer / Creative Director
**Project:** JobScope
**Date:** 2026-06-08
**Status:** Approved — derived from MEP and department proposal

---

## Design principle

JobScope is a single-user productivity tool for a technically sophisticated user (Atharva is a cybersecurity professional, comfortable with dense information). The UX must surface maximum relevant information without clutter, make ineligibility signals impossible to miss, and be fast to scan. It is not a consumer product — it is a professional daily-use instrument.

---

## First 5 minutes — onboarding flow

The critical moment: Atharva opens JobScope for the first time. This must not feel like setup — it must feel like it's already working.

### Step 1: Upload CV

- Single prominent upload target (PDF or DOCX)
- Immediate validation feedback: file type, size, parseable or not
- Parsing begins immediately on upload — do not ask him to configure filters first

### Step 2: Auto-extract + confirm

- Parsed profile presented as editable fields: skills (chips), roles held (list), certifications (chips — CEH, OSCP, eJPT etc.), experience years, education
- User confirms or corrects extracted fields
- Profile does not activate until user clicks "Confirm profile" — this step is mandatory

### Step 3: Smart defaults applied as dismissible chips

- Filter defaults auto-set from profile: location from most recent role, salary min from typical range for detected seniority + sub-domain, sub-domain from most recent role type
- Defaults presented as dismissible chips: "London ✕", "£35k+ ✕", "Penetration Testing ✕"
- User removes or modifies any chip — or proceeds with all defaults
- Framing: "These defaults are based on your CV. Dismiss any you don't want." (Not: "Please configure your filters.")

### Step 4: Live fetch skeleton

- Results area shows skeleton loaders immediately — gives the impression of work in progress
- First results appear as they are processed (streaming feel, not a spinner that blocks everything)
- Estimated time shown: "Fetching from Reed, Adzuna, Jooble — typically 30–90 seconds for first batch"

### Step 5: Results ranked by sponsorship confidence

- Default sort: CONFIRMED → LIKELY → UNKNOWN (within each tier, most recent first)
- SC-required roles not shown in default view (hidden, not shown as red)
- Count shown: "47 eligible roles found (12 CONFIRMED sponsors, 28 LIKELY, 7 UNKNOWN)"

---

## Filter system

### Always-visible top bar (chips)

These three are present on every screen, never hidden in a drawer:

1. **Sponsorship toggle** — "Sponsorship: CONFIRMED + LIKELY / CONFIRMED only / Show all"
2. **Salary slider** — min/max range, displayed as "£35k – £60k"
3. **SC clearance toggle** — "Hide SC-required / Show with warning"

### Collapsed drawer (secondary filters)

Accessible via "More filters" button — opens an overlay/drawer, never a new page:

- Cybersecurity sub-domain (multi-select chips: SOC, Pentesting, GRC, AppSec, Cloud, VM, CTI, Infra)
- Seniority level (Junior / Mid / Senior — multi-select)
- Location (London / Remote / Hybrid / UK-wide — multi-select)
- Keywords (free text, applied as AND across title + description)

### Saved filter presets

- Visible as named tabs above results: "OSCP Track", "Immediate Pentest", "Backup SOC Route"
- Save current filters as a new preset: "Save preset" button
- Switching presets applies instantly — no page reload

---

## Sponsorship confidence display

The three-tier badge is the most important information signal in the product. It must be immediately legible at a glance.

### Badge design

- **Green badge: CONFIRMED** — company is on the gov.uk sponsor register AND job ad explicitly states sponsorship available
- **Amber badge: LIKELY** — company is on the register; no explicit ad mention but register confirms eligibility
- **Grey badge: UNKNOWN** — company not on register or match confidence below threshold

### Tooltip on hover/tap

Shows last-updated date and evidence source:
- CONFIRMED: "On gov.uk sponsor register. Job ad states: 'Visa sponsorship available.' Register last updated: 2026-06-06."
- LIKELY: "On gov.uk sponsor register (match confidence: 0.91). Register last updated: 2026-06-06. Ad does not mention sponsorship explicitly."
- UNKNOWN: "Not found on gov.uk sponsor register (best match confidence: 0.42). Employer may still sponsor — verify directly."

### Register staleness warning

If the gov.uk CSV has not been successfully ingested in >48h, a banner appears:
> "Sponsorship data may be stale (last updated: [date]). Confirm directly before applying to LIKELY-rated employers."

---

## Application tracker

### Dual view: table and kanban

- Table view: default for power users — sortable columns, dense information, sponsorship badge visible in every row
- Kanban view: pipeline stages as columns — for users who prefer the visual funnel
- View toggle persistent per user

### Table columns

- Company (with sponsorship badge inline)
- Role title
- Source (Reed / Adzuna / Jooble / Manual)
- Salary (as listed)
- Clearance flag (icon: green tick / amber exclamation / grey dash)
- OSCP-track star (if role mentions OSCP preferred)
- Status (pill: current pipeline stage)
- Applied date
- Last activity
- Notes (truncated, click to expand)

### Kanban columns

Match the full application status pipeline from the MEP:
Discovered → Saved → Applied → Application Acknowledged → Interview Scheduled → Interviewing → Offer → Accepted / Rejected / Ghosted

Ghosted is auto-populated after 21 days with no status update from Applied.

---

## Key design risks

### Risk 1: Register staleness kills trust

If the sponsorship confidence badges are stale (gov.uk CSV update delayed), Atharva applies to a company that has since been suspended from the register. This is the highest-stakes UX failure.

**Mitigation:** Staleness banner (see above). Tooltip shows explicit last-update date. CONFIRMED badge requires job ad mention of sponsorship — so even if register is slightly stale, the double-signal provides a buffer.

### Risk 2: Filter presumption feels intrusive

Auto-applying smart defaults from the CV could feel like the app has made assumptions Atharva didn't approve.

**Mitigation:** Defaults are shown as dismissible chips, not silently applied. The onboarding step explicitly frames them as "defaults based on your CV, remove any you don't want." Every filter chip shows its current value and has a visible remove button.

### Risk 3: Zero-result empty state destroys first impression

If the first fetch returns zero eligible roles (CONFIRMED + LIKELY, salary match, no SC-required), the product looks broken.

**Mitigation:**
- Empty state shows the filter state that produced zero results and offers one-click fixes: "Expand to LIKELY sponsors / Widen salary range / Add more sub-domains"
- The empty state is never just "No results found" — it always explains why and offers an action
- Show total job count before eligibility filtering: "3,200 jobs fetched. 0 match current filters." — so Atharva knows the pipeline is working

### Risk 4: Clearance detection false negatives

A job description says "SC beneficial but not required" and is displayed as eligible when it should be flagged PREFERRED at minimum.

**Mitigation:** Conservative matching: if phrasing is ambiguous → REQUIRED, not NONE DETECTED. UX shows PREFERRED as amber with text: "This role mentions security clearance as preferred. Verify with employer." Default view still shows PREFERRED roles — only REQUIRED are hidden.

---

## Accessibility

- All badges carry text labels, not colour alone (CONFIRMED / LIKELY / UNKNOWN)
- Salary slider is keyboard-accessible
- Kanban columns are navigable via keyboard
- Colour contrast: all text on badge backgrounds meets WCAG AA

---

## Responsive design

JobScope is a web application used primarily on desktop (job searching is a desktop-primary activity). Mobile is a secondary use case — application tracker review, not active searching.

- Desktop (≥1280px): full layout with filter top bar + results list side by side
- Tablet (768–1279px): full layout, filter drawer replaces side panel
- Mobile (<768px): application tracker only; full search deferred to a "view on desktop" nudge
