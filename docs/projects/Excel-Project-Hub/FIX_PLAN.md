# Fix Plan — Excel-Project-Hub
## Prepared by: QA Director
## Date: 2026-06-06
## Source: QA_AUDIT.md + CODE_REVIEW.md

---

## Consolidation notes

Where QA and Code Review identified the same underlying issue, entries are merged under a single ID. The "Confirmed by" column records whether one or both sources flagged it. Issues unique to one source are noted accordingly.

---

## CRITICAL fixes (must ship — app is broken without these)

| ID | Description | File(s) | Effort | Type | Confirmed by |
|----|-------------|---------|--------|------|--------------|
| C-01 | Replace `<SelectItem value="">` (Radix crash) with a sentinel value `"__none__"` and convert back to `undefined` on submit — opening Add Task or Edit Task with any resources present will throw an unhandled exception and can white-screen the page. | `project-detail.tsx` line 754 | S | Breaking bug | QA + Code Review |

---

## HIGH fixes (significant bugs, ship in same pass)

| ID | Description | File(s) | Effort | Type | Confirmed by |
|----|-------------|---------|--------|------|--------------|
| H-01 | Add phaseId ownership validation on task create: query phases WHERE `id = phaseId AND projectId = :projectId` and return 400 if not found — currently a caller can cross-link tasks across projects. | `tasks.ts` lines 95–136 | S | Breaking bug (data integrity) | QA + Code Review |
| H-02 | Add phaseId and parentTaskId ownership validation on task update: verify both belong to the same project before applying the PATCH. | `tasks.ts` lines 138–174 | S | Breaking bug (data integrity) | Code Review |
| H-03 | Fix sortOrder default from `maxNum` to `maxNum + 1` — the current logic assigns the same sortOrder as the last existing task, producing duplicates after any deletion and non-deterministic ordering. | `tasks.ts` line 126 | S | Breaking bug | QA + Code Review |
| H-04 | Fix the race condition on taskNumber assignment: wrap the SELECT MAX + INSERT inside a `db.transaction()` to prevent duplicate taskNumbers under concurrent requests. | `tasks.ts` lines 95–136 | M | Breaking bug | Code Review |
| H-05 | Add a global Express error handler and try/catch to all async route handlers so that database errors return a JSON 500 instead of an HTML crash page. | `app.ts`, all route files | M | Breaking bug | Code Review |
| H-06 | Wire the Phase selector in TaskModal to controlled state: replace `onValueChange={() => {}}` with a state variable and pass the selected phaseId to the submit payload — currently selecting a different phase does nothing. | `project-detail.tsx` lines 719–725 | S | Breaking bug (UX) | QA + Code Review |
| H-07 | Add `onError` handlers to all frontend mutations that currently have only `onSuccess` — this covers: `InlineStatusSelect`, `InlinePctEdit`, `TaskRow` description save, `deleteTask`, `deletePhase`, `TaskModal` create and update. Silent failures give users no feedback and can leave the UI in an inconsistent state. | `project-detail.tsx` (multiple sites) | M | Breaking bug | QA + Code Review |
| H-08 | Add a React `ErrorBoundary` wrapping `<Router>` in `App.tsx` and individual boundaries around `GanttView`, `DashboardView`, and `TaskModal` — any unhandled render exception currently white-screens the entire app. | `App.tsx`, `project-detail.tsx` | M | Breaking bug | QA + Code Review |
| H-09 | Add a foreign key constraint on `parentTaskId` with `ON DELETE SET NULL` so that deleting a parent task does not leave orphaned subtasks with dangling references that never render. | Schema (`tasks` table) | S | Breaking bug (data integrity) | Code Review |
| H-10 | Replace free-form `zod.string()` with `zod.enum([...])` for `taskType` and `status` in both `CreateTaskBody` and `UpdateTaskBody` so that invalid values are rejected at the API boundary. | `api-zod` | S | Breaking bug (data integrity) | Code Review |
| H-11 | Add DB-level enum or CHECK constraint for `taskType` and `status` columns to enforce valid values even on direct database writes. | Schema (`tasks` table) | S | Breaking bug (data integrity) | Code Review |
| H-12 | Guard the TaskModal `onSubmit` against `defaultPhaseId` being undefined (non-null assertion `!` currently silently passes `undefined` to the server, returning a 400 with no user message). | `project-detail.tsx` line 682 | S | Breaking bug | Code Review |

---

## MEDIUM fixes (quality issues, include if time allows)

| ID | Description | File(s) | Effort | Type | Confirmed by |
|----|-------------|---------|--------|------|--------------|
| M-01 | Restrict CORS from wildcard to a configured `ALLOWED_ORIGIN` environment variable before any public deployment. | `app.ts` line 28 | S | Quality / security | Code Review |
| M-02 | Add `onError` handlers to the remaining phase mutations that have only `onSuccess`: `toggleCollapse`, phase rename (`updatePhase`), `addPhase` (createPhase), and `updateProject` name/description saves. | `project-detail.tsx` (multiple sites) | S | Quality | Code Review |
| M-03 | Add `zod.number().min(0).max(100)` validation on `pctDone` in both `CreateTaskBody` and `UpdateTaskBody`. | `api-zod` | S | Quality | Code Review |
| M-04 | Add a DB-level CHECK constraint on `pctDone` (`>= 0 AND <= 100`) to enforce the range independently of the application layer. | Schema (`tasks` table) | S | Quality | Code Review |
| M-05 | Fix inconsistent `pctComplete` formulas: project level uses arithmetic mean of pctDone (0–100); phase level uses binary completion ratio — both are labelled `pctComplete` but represent different metrics. Either unify the formula or rename the phase field to `completionRatio`. | `projects.ts` lines 157, 168 | M | Quality / data accuracy | Code Review |
| M-06 | Wrap the `renumberTasks` N+1 UPDATE loop in a `db.transaction()` and consider batching into a single SQL statement to make the operation atomic and performant. | `tasks.ts` lines 86–92, 193–195 | M | Quality | Code Review |
| M-07 | Normalise date strings to local noon (`T12:00:00`) before `new Date()` in GanttView to prevent Gantt bars shifting one day left for users in UTC− timezones. | `project-detail.tsx` lines 394, 433–434 | S | Breaking bug (timezone) | QA |
| M-08 | Fix the double-firing collapse toggle on `PhaseSection`: clicking the phase name fires the toggle twice (once on the span, once on the parent button via bubbling), causing two PATCH requests and no visible change. | `project-detail.tsx` lines 280, 296 | S | Breaking bug (UX) | QA |
| M-09 | Add enum validation for the holiday `type` field in the Zod schema; also document the correct request body for POST /api/holidays (`startDate`/`endDate`, not `date`/`type`) — the current mismatch produced a confusing "Required" error during testing. | `api-zod`, `holidays.ts` | S | Quality / DX | QA |
| M-10 | Add a `useEffect` dependency on `parentTaskId` in the TaskModal reset effect to prevent stale form state when `parentTaskId` changes while the modal is open. | `project-detail.tsx` lines 665–678 | S | Quality | Code Review |
| M-11 | Check `response.ok` in `renumberTasks` and throw on failure so the calling delete-success callback can surface an error toast instead of silently leaving task numbers inconsistent. | `project-detail.tsx` lines 56–58 | S | Quality | Code Review |
| M-12 | Guard the Phase selector against rendering with `value=""` when no phases exist — show a disabled message instead of passing an empty string to Radix Select. | `project-detail.tsx` line 719 | S | Quality | Code Review |
| M-13 | Add an `updatedAt` Postgres trigger (or document the ORM-only `$onUpdate` limitation) so that direct SQL writes do not leave `updatedAt` stale. | Schema (`tasks` table) | M | Quality | Code Review |
| M-14 | Add a global React Query `onError` handler on `QueryClient` so that failed queries surface a user-visible notification rather than being silently swallowed after one retry. | `App.tsx` lines 13–15 | S | Quality | QA |

---

## LOW fixes (nice to have)

| ID | Description | File(s) | Effort |
|----|-------------|---------|--------|
| L-01 | Add explicit empty-state message in `DashboardView` when `summary` is null/undefined after a successful load, rather than rendering blank. | `project-detail.tsx` lines 477–478 | S |
| L-02 | Add NaN guard after `parseInt(params.id)` and redirect to `/` if the result is NaN so invalid URL slugs do not produce an infinite loading state. | `project-detail.tsx` line 875 | S |
| L-03 | Add a comment to `PHASE_COLORS` noting that its length must be ≥ the expected maximum phase count for the modulo cycling to behave correctly. | `project-detail.tsx` | S |
| L-04 | Remove dead code branch `if (parsed.data.taskNumber !== undefined)` in the PATCH handler — `UpdateTaskBody` does not define `taskNumber` so the branch can never execute. | `tasks.ts` line 161 | S |
| L-05 | Fix the misleading alias `{ count: phasesTable.id }` in the phase count query — rename to `id` or use a proper SQL `count(*)` aggregate. | `phases.ts` line 50 | S |
| L-06 | Define and use a `CreateHolidayResponse` schema in the POST /holidays handler to match the response-validation pattern used by all other POST handlers. | `holidays.ts` lines 57–67 | S |
| L-07 | Add `.email()` constraint to the resource `email` field in the Zod schema to reject obviously invalid values. | `api-zod` / `resources` | S |
| L-08 | Add date format validation (`.regex(/^\d{4}-\d{2}-\d{2}$/)` or `zod.string().date()`) to all date fields across all schemas. | `api-zod` (all routes) | S |
| L-09 | Add `updatedAt` column to `phasesTable` for audit trail on rename, recolour, and reorder operations. | Schema (`phases` table) | S |
| L-10 | Change date columns (`startDate`, `endDate`, `plannedStart`, `plannedEnd`) from `text` to a Postgres `date` type in a migration to enable database-level date ordering and comparisons. | Schema (all tables) | L |
| L-11 | Add `.unique()` constraint to `resourcesTable.email` to prevent duplicate resource registrations. | Schema (`resources` table) | S |
| L-12 | Add `InlineDescEdit` user feedback (tooltip or transient message) when a save is silently ignored due to empty input or unchanged value. | `project-detail.tsx` lines 74–77 | S |

---

## Fix batches (logical grouping for developer)

### Batch 1 — Error Handling (do first — unlocks visibility into all other bugs)
C-01 (partial: sentinel value), H-05, H-07, H-08, M-02, M-11, M-14

### Batch 2 — Data Integrity / Ownership Validation
H-01, H-02, H-09, H-10, H-11

### Batch 3 — Sorting and Numbering
H-03, H-04, M-06

### Batch 4 — Schema / Validation
M-03, M-04, M-09, L-07, L-08, L-09, L-10, L-11

### Batch 5 — Task and Phase Form UX (broken UI controls)
C-01 (full), H-06, H-12, M-08, M-10, M-12

### Batch 6 — Metrics Consistency
M-05

### Batch 7 — Backend Quality
M-01, M-13, L-04, L-05, L-06

### Batch 8 — Frontend Quality / Polish
M-07, L-01, L-02, L-03, L-12

### Batch 9 — Database Constraints
H-09, H-11, M-04, M-13, L-09, L-10, L-11

---

## Recommended ship order

1. **Batch 1 (Error Handling)** — must go first; silent failures mask every other bug
2. **Batch 5 (Form UX — broken controls)** — user-visible crashes and deceptive UI; ship immediately after error handling
3. **Batch 2 (Ownership Validation)** — data integrity; exploitable via the API today
4. **Batch 3 (Sorting/Numbering)** — produces corrupt data under normal use
5. **Batch 6 (Metrics Consistency)** — wrong numbers shown in dashboard
6. **Batches 4, 7, 8 (Schema, Backend Quality, Frontend Polish)** — quality pass; schedule as time allows
7. **Batch 9 (DB Constraints)** — requires migrations; schedule as a dedicated migration sprint

---

## Total issue count

| Severity | Count |
|----------|-------|
| Critical | 1 |
| High | 12 |
| Medium | 14 |
| Low | 12 |
| **Total** | **39** |

### Breakdown: breaking bugs vs quality improvements

| Category | Count |
|----------|-------|
| Breaking bugs (user-visible, data-corrupting, or crash-causing) | 20 |
| Quality improvements (robustness, DX, audit trail) | 19 |

### Source coverage

| Source | Unique findings | Shared findings |
|--------|----------------|-----------------|
| QA_AUDIT.md only | 4 (M-07, M-08, M-09, M-14) | — |
| CODE_REVIEW.md only | 20 | — |
| Both sources agree | 15 | C-01, H-01, H-03, H-06, H-07, H-08, H-10 (partial), H-12, M-02 (partial), M-10, M-11, M-12, L-01, L-02, L-03 |
