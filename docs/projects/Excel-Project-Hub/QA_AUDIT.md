# QA Audit — Excel-Project-Hub
## Date: 2026-06-06
## Tester: Full Stack Tester

---

## API Test Results

| # | Endpoint | Payload / Scenario | HTTP Status | Pass/Fail | Notes |
|---|----------|--------------------|-------------|-----------|-------|
| 1 | POST /api/projects | Valid body: name, description, startDate, endDate | 201 | PASS | Returns full project object with id, createdAt, updatedAt |
| 2 | GET /api/projects | — | 200 | PASS | Returns array of all projects |
| 3 | POST /api/projects/{id}/phases | Valid body: name, color, orderIndex | 201 | PASS | Returns phase object |
| 4 | GET /api/projects/{id}/phases | — | 200 | PASS | Returns array of phases for project |
| 5 | POST /api/projects/{id}/tasks | phaseId, taskType, description | 201 | PASS | Returns full task with sortOrder=0, taskNumber=1 |
| 6 | POST /api/projects/{id}/tasks | Missing taskType and description | 400 | PASS | Correct Zod validation error returned |
| 7 | POST /api/projects/{id}/tasks | phaseId from a *different* project | 201 | **FAIL** | No cross-project phase ownership validation — task created with foreign phaseId. Task becomes invisible in the plan view (no matching phase in UI list) but inflates totalTasks in the summary. |
| 8 | POST /api/projects/{id}/tasks | parentTaskId set (subtask) | 201 | PASS | Subtask created correctly |
| 9 | PATCH /api/tasks/{id} | status, pctDone, notes | 200 | PASS | Partial update works; returns updated resource |
| 10 | DELETE /api/tasks/{id} | Valid task id | 204 | PASS | Task deleted; remaining tasks renumbered |
| 11 | GET /api/projects/{id}/summary | — | 200 | PASS | Returns totalTasks, pctComplete, phaseStats |
| 12 | POST /api/resources | name, role, email | 201 | PASS | Returns resource object |
| 13 | POST /api/holidays | `{"name":"...", "date":"...", "type":"..."}` | 400 | **FAIL** | API requires `startDate` and `endDate` fields, not `date`/`type`. Field names are not documented. Passing `date` instead of `startDate`/`endDate` gives a confusing "Required" Zod error. |
| 13b | POST /api/holidays | `{"name":"...", "startDate":"...", "endDate":"..."}` | 201 | PASS | Correct field names work |
| 14 | POST /api/projects/{id}/tasks | resourceId set to valid resource | 201 | PASS | `resourceName` correctly populated in response |
| 15 | POST /api/projects/{id}/tasks | sortOrder not provided | 201 | **FAIL (partial)** | sortOrder is assigned `maxNum` (max *taskNumber* in project), not `max(sortOrder)+1`. After any deletion, this produces **duplicate sortOrder values** (confirmed: tasks id=4 and id=5 both received sortOrder=3 after task id=2 was deleted). Duplicate sort orders cause non-deterministic task ordering. |

---

## UI Bug Findings (from code review)

### project-detail.tsx

**1. [CRITICAL] Radix UI `<SelectItem value="">` — known crash bug**
- File: `project-detail.tsx`, line 754
- The Resource `<Select>` in `TaskModal` contains `<SelectItem value="">Unassigned</SelectItem>`.
- Radix UI `SelectItem` crashes (throws) when `value` is an empty string `""`. The component internally uses the value as a key and treats empty string as falsy, causing a runtime exception: `"A <Select.Item /> must have a value prop that is not an empty string"`.
- **Impact:** Opening "Add Task" or "Edit Task" modal while the resource list is non-empty will crash the dialog with an unhandled exception. Because there is no error boundary (see bug #5), this crash propagates up and can white-screen the entire page.
- **Fix:** Use a sentinel value such as `value="__none__"` and convert back to `undefined`/`null` on submit.

**2. [HIGH] Phase selector in TaskModal is non-functional / display-only**
- File: `project-detail.tsx`, lines 719–725
- The "Phase" `<Select>` in `TaskModal` has `onValueChange={() => {}}` — an intentional no-op. The displayed phase cannot be changed by the user. The actual `phaseId` used on submit is `defaultPhaseId`, which is fixed at modal-open time.
- **Impact:** The phase dropdown appears interactive (it opens and shows items) but selecting a different phase does nothing. Users will be confused and may create tasks in the wrong phase with no feedback.
- **Fix:** Wire `onValueChange` to update a controlled state variable for `phaseId`, and use that variable in `onSubmit`.

**3. [HIGH] No `onError` callbacks on any mutation in project-detail.tsx**
- Mutations `createTask`, `updateTask`, `deleteTask`, `createPhase`, `updatePhase`, `deletePhase`, `updateProject` are called throughout the file with only `onSuccess` callbacks — none have `onError` handlers.
- **Impact:** If the API returns a 4xx or 5xx, the user receives zero feedback: no toast, no error message, no visible state change. The operation silently fails. For example, if a task save fails due to a network error, the UI closes the modal and appears to succeed.
- **Fix:** Add `onError` callbacks to all mutations that display a user-facing error toast or inline message.

**4. [HIGH] `InlinePctEdit` has no `onError` handler on `updateTask.mutate`**
- File: `project-detail.tsx`, lines 148–153
- The inline % Done editor calls `updateTask.mutate(...)` with only `onSuccess`. If the PATCH fails, `setEditing(false)` is never called — the input stays in edit mode with no explanation, and the displayed value reverts to the stale UI state inconsistently.
- **Fix:** Add `onError: () => setEditing(false)` (and an error toast) to the mutate call.

**5. [HIGH] No error boundary anywhere in the component tree**
- File: `App.tsx` — no `ErrorBoundary` wrapping `<Router />` or individual route components.
- File: `project-detail.tsx` — no try/catch or error boundary around the heavy data-driven sections (GanttView, DashboardView, RAGView, PhaseSection, TaskModal).
- **Impact:** Any unhandled runtime exception (e.g. the Radix `SelectItem` crash in bug #1, a malformed API response that breaks `.map()`, or a Recharts render error) will white-screen the entire application with no recovery path for the user.
- **Fix:** Wrap `<Router />` in a top-level `ErrorBoundary` in `App.tsx`. Add per-section boundaries around GanttView, DashboardView, and TaskModal.

**6. [MEDIUM] `InlineDescEdit` silently ignores empty saves and unchanged saves, with no feedback**
- File: `project-detail.tsx`, lines 74–77
- If the user clears the description field and presses Enter/blurs, `save()` does nothing (empty string is rejected). If the value is unchanged it also does nothing. Neither case shows any message.
- **Impact:** If a user accidentally clears a description and presses Enter, nothing happens — but the input reverts to the original value. This is correct but confusing with no visible feedback. Low regression risk but poor UX.

**7. [MEDIUM] `GanttView` uses `new Date(t.plannedStart!)` without timezone normalization**
- File: `project-detail.tsx`, lines 394, 433–434
- Date strings from the API are date-only (e.g. `"2026-06-01"`). Parsing these with `new Date("2026-06-01")` in JavaScript creates a UTC midnight date, which when displayed in a negative UTC offset timezone (e.g. US/Eastern) will show as the previous day.
- **Impact:** Gantt bars will shift left by one day for users in UTC− timezones.
- **Fix:** Append `T00:00:00` or parse with `new Date(date + "T12:00:00")` to anchor to local noon.

**8. [MEDIUM] `PhaseSection` collapse toggle fires on phase name click AND on the chevron — double-firing**
- File: `project-detail.tsx`, lines 280 and 296
- Both the `<button onClick={toggleCollapse}>` (chevron) and the `<span onClick={toggleCollapse}>` (name) call `toggleCollapse`. Clicking on the name text fires two events if event bubbling is not stopped, immediately toggling the phase open then closed again (net: no change, with two API calls).
- **Impact:** Clicking the phase name may appear to do nothing while triggering two PATCH requests unnecessarily.
- **Fix:** Use a single onClick on a wrapper element, or `e.stopPropagation()` on the inner span.

**9. [LOW] `DashboardView` returns `null` silently if summary is not yet loaded**
- File: `project-detail.tsx`, lines 477–478
- `if (!summary) return null;` after checking `isLoading`. If the query succeeds but returns an unexpected empty/null body, the dashboard tab renders blank with no message.
- **Fix:** Add an explicit empty-state message, or confirm the API never returns null on success.

**10. [LOW] `App.tsx` — no global error state or toast for query failures**
- File: `App.tsx`, lines 13–15
- `QueryClient` is configured with `retry: 1` and `staleTime: 30000`. There is no `onError` global handler configured on the QueryClient. Failed queries are silently retried once and then dropped with no user notification.
- **Fix:** Add a global query error handler via `queryClient.setDefaultOptions({ queries: { onError: ... } })` or use React Query's error boundary integration.

---

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 1 |
| HIGH | 4 |
| MEDIUM | 3 |
| LOW | 2 |
| **Total** | **10** |

### API Issues
| Severity | Count |
|----------|-------|
| FAIL (security/data integrity) | 1 — cross-project phaseId not validated |
| FAIL (sortOrder logic bug) | 1 — duplicate sortOrders after deletion |
| FAIL (undocumented field names) | 1 — holiday API uses startDate/endDate, not date/type |
| PASS | 12 |

### Key Action Items (priority order)
1. **Fix Radix SelectItem crash** (empty string value) — CRITICAL, will crash the add-task dialog
2. **Add onError handlers to all mutations** — HIGH, silent failures are a data integrity risk
3. **Fix Phase selector in TaskModal** — HIGH, the control is deceptive/broken
4. **Wrap app in ErrorBoundary** — HIGH, one crash white-screens everything
5. **Add phaseId cross-project ownership validation in POST /api/projects/:id/tasks** — blocks data corruption
6. **Fix sortOrder assignment** — use `MAX(sortOrder)+1` not `MAX(taskNumber)`
