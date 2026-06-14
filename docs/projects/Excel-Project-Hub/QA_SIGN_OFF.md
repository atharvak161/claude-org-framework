# QA Sign-Off — Excel-Project-Hub
## Date: 2026-06-06
## Tester: Full Stack Tester
## Developer commit verified: 7f5b89e

| Fix | Status | Evidence |
|-----|--------|----------|
| C1 — SelectItem crash | ✅ PASS | `<SelectItem value="__none__">Unassigned</SelectItem>` confirmed on line 811. Default form value is `"__none__"` (line 699, reset on line 714). `onSubmit` guard: `data.resourceId && data.resourceId !== "__none__"` before parseInt (line 736). No `value=""` remains on any SelectItem. |
| C2 — onError handlers | ✅ PASS | All 9 mutation call sites have both `onSuccess` AND `onError`: `updateTask` in InlineStatusSelect (line 125–130), `updateTask` in InlinePctEdit (line 159–165), `updateTask` in handleDescSave (line 201–206), `updateTask` in TaskModal (line 747–750), `createTask` in TaskModal (line 752–755), `updatePhase` toggleCollapse (line 292–295), `updatePhase` saveName (line 302–308), `deletePhase` (line 358–362), `createPhase` addPhase (line 976–981). |
| C3 — Error Boundary | ✅ PASS | `artifacts/project-tracker/src/components/ErrorBoundary.tsx` exists as a proper React class component with `getDerivedStateFromError`, `componentDidCatch`, and a recovery UI. `App.tsx` imports it and wraps `<WouterRouter>` within `<ErrorBoundary>` (lines 39–42). |
| C4 — Phase selector | ✅ PASS | `phaseId: string` is present in `TaskFormData` interface (line 55). Phase Select uses `onValueChange={(v) => form.setValue("phaseId", v)}` (line 775) — not a no-op. `onSubmit` reads `data.phaseId` via `const resolvedPhaseId = data.phaseId ? parseInt(data.phaseId) : undefined` (line 724) — not the old `defaultPhaseId!`. All three criteria met. |
| C5 — sortOrder fix | ✅ PASS | `tasks.ts` line 142: `sortOrder: parsed.data.sortOrder ?? maxNum + 1` — uses `maxNum + 1`. API test confirmed: Task 1 returned `sortOrder:1`, Task 2 returned `sortOrder:2` — distinct values, no collision. |
| C6 — Ownership check | ✅ PASS | API test: created P1 (id=4) with PH1 (id=4), created P2 (id=5), attempted to create a task in P2 using PH1. API returned HTTP 400 `{"error":"phaseId does not belong to this project"}`. Cross-project contamination is blocked. |
| C7 — Transaction wrap | ✅ PASS | `tasks.ts` renumber endpoint (line 81): wraps all updates in `await db.transaction(async (tx) => { ... })`. DELETE handler (line 203): also wraps renumber loop in `await db.transaction(async (tx) => { ... })`. Frontend `renumberTasks()` (line 60–62): checks `if (!res.ok) { throw new Error(...) }`. Delete `onSuccess` (lines 248–254): wraps `await renumberTasks(projectId)` in `try/catch` with `toast(...)` on failure. All four criteria met. |

## Overall verdict
APPROVED FOR USE

## Remaining known issues
The following findings from `QA_AUDIT.md` were NOT addressed in this fix pass and remain open:

| ID | Severity | Description |
|----|----------|-------------|
| Audit #6 | MEDIUM | `InlineDescEdit` silently ignores empty/unchanged saves with no user feedback — UX confusion only, no data loss. |
| Audit #7 | MEDIUM | `GanttView` parses date-only strings with `new Date("YYYY-MM-DD")` — Gantt bars shift left by one day for users in UTC− timezones. |
| Audit #8 | MEDIUM | `PhaseSection` collapse toggle fires on both chevron click and phase name click — potential double API call. |
| Audit #9 | LOW | `DashboardView` returns `null` silently if summary is unexpectedly absent after load. |
| Audit #10 | LOW | No global `onError` handler on QueryClient — failed queries silently drop after one retry. |
| Holiday API | LOW | `POST /api/holidays` requires `startDate`/`endDate` fields but field names are undocumented (discovered during audit). Non-blocking. |

None of the above are blockers for use. All CRITICAL and HIGH issues have been resolved.

## Sign-off
QA Director sign-off: APPROVED
