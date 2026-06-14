# Code Review — Excel-Project-Hub
## Date: 2026-06-06
## Reviewer: Code Reviewer

---

## Backend Issues

**1. tasks.ts:126 | HIGH | sortOrder default is maxNum instead of maxNum+1**
When creating a task, `sortOrder` defaults to `maxNum` (the current highest value) rather than `maxNum + 1`. This means a new task gets the same sortOrder as the last existing task, producing a tie. When tasks are ordered by sortOrder ascending they will have an arbitrary relative position with the previous last task.
Recommended fix: `sortOrder: parsed.data.sortOrder ?? maxNum + 1`

**2. tasks.ts:95-136 | HIGH | Race condition — taskNumber assignment is not atomic**
`taskNumber` is computed by reading all tasks, finding the max, then inserting with `maxNum + 1`. Two concurrent POSTs against the same project will both read the same maxNum and produce duplicate taskNumbers. No database transaction or SELECT FOR UPDATE wraps the read+write.
Recommended fix: Use a database sequence per project, or wrap the select-max and insert inside a single `db.transaction()` block with serialisable isolation.

**3. tasks.ts:95-136 | HIGH | No phaseId ownership validation on task creation**
The POST `/projects/:projectId/tasks` endpoint accepts a user-supplied `phaseId` without verifying that phase belongs to the same project. A caller can pass a phaseId from a completely different project, cross-linking data across projects.
Recommended fix: After parsing the body, query `phasesTable` WHERE `id = parsed.data.phaseId AND projectId = params.data.projectId`. Return 400 if not found.

**4. tasks.ts:138-174 | HIGH | No phaseId/parentTaskId ownership validation on task update**
The PATCH `/tasks/:id` endpoint accepts updated `phaseId` and `parentTaskId` values without checking that the new phase or parent task belongs to the same project as the task being updated. The same cross-project injection applies.
Recommended fix: When `phaseId` is updated, query phases to confirm ownership. When `parentTaskId` is updated, query tasks to confirm it belongs to the same project.

**5. app.ts:28 | MEDIUM | CORS is wide open — any origin is allowed**
`app.use(cors())` with no options allows requests from any origin. In a production deployment this permits any web page to call the API with cookies or credentials.
Recommended fix: Restrict to the known frontend origin via an environment variable: `app.use(cors({ origin: process.env.ALLOWED_ORIGIN ?? "http://localhost:5173" }))`.

**6. All routes | MEDIUM | No try/catch — unhandled DB errors crash with a 500 and no JSON body**
Every async route handler executes database calls without a try/catch block. If the database is unreachable, or a constraint violation occurs, Express will call its default error handler, which returns an HTML error page (not JSON). The middlewares directory is empty — there is no global error-handling middleware registered.
Recommended fix: Add a global Express error handler in `app.ts` (`app.use((err, req, res, next) => res.status(500).json({ error: "Internal server error" }))`), and/or wrap each route body in try/catch passing errors to `next(err)`.

**7. tasks.ts:86-92, 193-195 | MEDIUM | N+1 updates without a transaction in renumber operations**
Both the `/renumber` endpoint and the delete handler loop over tasks and fire individual `UPDATE` statements. With many tasks this is slow and not atomic — a failure mid-loop leaves task numbers partially renumbered.
Recommended fix: Wrap the loop inside `db.transaction()`. Consider batching with a single CASE WHEN expression or using `sql` template literals to update all rows in one statement.

**8. tasks.ts:161 | LOW | Dead code — taskNumber is checked in PATCH handler but not in UpdateTaskBody schema**
`UpdateTaskBody` (in api-zod) does not define a `taskNumber` field, so `parsed.data.taskNumber` is always `undefined`. The `if (parsed.data.taskNumber !== undefined) updates.taskNumber = …` branch can never execute.
Recommended fix: Either remove the line if external taskNumber mutation is not intended (preferred), or add `taskNumber` to `UpdateTaskBody` if it should be settable.

**9. phases.ts:50 | LOW | Misleading alias in phase count query**
`db.select({ count: phasesTable.id })` selects the phase `id` column aliased as `count`. This still works because `existing.length` is used (the row count), not `existing[0].count`. However the alias is confusing and could easily be misread as an aggregate.
Recommended fix: Rename the alias to `id: phasesTable.id` or use a proper SQL count: `db.select({ count: sql<number>`count(*)` })`.

**10. holidays.ts:57-67 | LOW | POST /holidays response bypasses ListHolidaysResponse validation**
The POST handler returns a manually constructed object without calling `ListHolidaysResponse` or a dedicated response schema to validate/parse the output. All other POST handlers use a typed response parse (e.g. `UpdateTaskResponse.parse(...)`). This inconsistency means the response shape can drift from the contract silently.
Recommended fix: Define and export a `CreateHolidayResponse` schema and call `.parse()` before returning.

**11. tasks.ts / api-zod | MEDIUM | No enum validation for taskType and status fields**
`taskType` and `status` are accepted as free-form `zod.string()` in both `CreateTaskBody` and `UpdateTaskBody`. The application has implicit valid values (`"task"`, `"subtask"`, `"milestone"` and `"Not Started"`, `"In Progress"`, `"Completed"`, `"Overdue"`, `"Blocked"`). Arbitrary strings can be stored and will silently break frontend status badge rendering and summary queries.
Recommended fix: Replace `zod.string()` with `zod.enum(["task","subtask","milestone"])` and `zod.enum(["Not Started","In Progress","Completed","Overdue","Blocked"])` respectively.

**12. api-zod / all routes | MEDIUM | No range validation on pctDone (0–100)**
`pctDone` is validated as `zod.number()` with no min/max. A caller can store -5 or 9999, corrupting progress percentages and chart rendering.
Recommended fix: Change to `zod.number().min(0).max(100)`.

**13. api-zod / resources | LOW | Email field accepts any string — no format validation**
`email` is typed as `zod.string().optional()` with no `.email()` constraint. Garbage values can be stored.
Recommended fix: Change to `zod.string().email().optional()`.

**14. api-zod / all date fields | LOW | No date format validation**
`plannedStart`, `plannedEnd`, `startDate`, `endDate` (all routes) accept any string. Storing "banana" in a date field will silently break Gantt rendering and the `new Date()` parsing in the frontend.
Recommended fix: Add `.regex(/^\d{4}-\d{2}-\d{2}$/)` or use `zod.string().date()` (Zod v3.23+) on all date fields.

**15. projects.ts:157 | MEDIUM | Inconsistent pctComplete formulas between project and phase**
Project-level `pctComplete` is computed as `sum(pctDone) / total` — the arithmetic average of pctDone values (0–100 range). Phase-level `pctComplete` (line 168) is computed as `(completedCount / phaseTotal) * 100` — binary completed/not-completed ratio. These represent fundamentally different metrics, but both are labelled `pctComplete` in the response and displayed the same way in the dashboard. A phase where all tasks are 50% done shows 0% in the phase breakdown but 50% in the overall progress bar.
Recommended fix: Pick one formula and apply it consistently, or rename the phase-level field to `completionRatio` to signal the difference.

---

## Frontend Issues

**1. project-detail.tsx:119-122 | HIGH | InlineStatusSelect mutation has no onError handler**
`updateTask.mutate(...)` inside `InlineStatusSelect.onValueChange` only defines `onSuccess`. If the PATCH request fails (network error, 500, validation error), the status selector will appear to have changed (optimistic local React state from the Select component) but the change will not be persisted, with no user-visible error.
Recommended fix: Add `onError: () => toast({ title: "Failed to update status", variant: "destructive" })` to the mutate call.

**2. project-detail.tsx:149-152 | HIGH | InlinePctEdit mutation has no onError handler**
`updateTask.mutate(...)` inside `InlinePctEdit.save()` has no `onError` callback. A failed save silently resets the editing state but the displayed % Done value may remain stale.
Recommended fix: Add an `onError` handler that restores `editing` state or shows a toast.

**3. project-detail.tsx:187 | HIGH | TaskRow inline description save has no onError handler**
`updateTask.mutate({ id: task.id, data: { description: val } }, { onSuccess: invalidate })` has no `onError`. A network failure leaves the displayed description out of sync.
Recommended fix: Add `onError` to show a toast and re-open the inline edit with the failed value.

**4. project-detail.tsx:227 | HIGH | Task delete mutation has no onError handler**
`deleteTask.mutate(...)` in the AlertDialog action callback only defines `onSuccess`. On failure, the row visually stays but the user receives no feedback.
Recommended fix: Add `onError` to display a toast.

**5. project-detail.tsx:260-263 | MEDIUM | Phase toggleCollapse mutation has no onError handler**
`updatePhase.mutate(...)` for toggling collapse state only has `onSuccess`. A failed toggle leaves the collapsed icon out of sync.
Recommended fix: Add `onError` handler.

**6. project-detail.tsx:268-271 | MEDIUM | Phase name save mutation has no onError handler**
`updatePhase.mutate(...)` for phase rename only has `onSuccess`. A failed rename leaves the name edit silently discarded.
Recommended fix: Add `onError` handler.

**7. project-detail.tsx:321 | HIGH | Phase delete mutation has no onError handler**
`deletePhase.mutate(...)` only defines `onSuccess`. If deletion fails, the user sees no feedback and the dialog closes, giving the impression the phase was deleted.
Recommended fix: Add `onError` to show a toast and keep the dialog open.

**8. project-detail.tsx:699, 701 | HIGH | TaskModal submit mutations (create and update) have no onError handler**
Both `updateTask.mutate(...)` and `createTask.mutate(...)` inside `onSubmit` only call `invalidate` on success. The modal closes on success but on error it just stays open with no message — the user does not know whether saving failed.
Recommended fix: Add `onError: () => toast({ title: "Failed to save task", variant: "destructive" })`.

**9. project-detail.tsx:807-810, 815-818 | MEDIUM | ProjectHeader save mutations have no onError handler**
`updateProject.mutate(...)` calls for name and description only define `onSuccess`. Failed saves are silent.
Recommended fix: Add `onError` handlers with a toast.

**10. project-detail.tsx:899-916 | MEDIUM | addPhase mutation has no onError handler**
`createPhase.mutate(...)` only defines `onSuccess`. A phase creation failure is silent.
Recommended fix: Add `onError` handler.

**11. project-detail.tsx:719 | HIGH | Phase selector in TaskModal is non-functional — onValueChange is a no-op**
`<Select value={String(defaultPhaseId ?? "")} onValueChange={() => {}>` renders a phase selector in the task form but the `onValueChange` callback is empty. The user can open the dropdown and click a different phase but it has no effect — the task is always created in the phase from which the modal was opened (`defaultPhaseId`). When a user opens "Add Task" from a phase button and then tries to reassign to a different phase in the form, their change is silently ignored.
Recommended fix: Add a controlled state value for phase selection in the form (e.g. via `react-hook-form` or a local `useState`) and wire `onValueChange` to update it. Pass the selected phase id to `payload.phaseId`.

**12. project-detail.tsx:719 | MEDIUM | Phase selector shows value="" when defaultPhaseId is undefined**
`String(defaultPhaseId ?? "")` evaluates to `""` when no phases exist and the user opens the task modal. Radix UI `Select` with `value=""` does not match any `SelectItem` and may render incorrectly or trigger a Radix warning (empty string is not a valid SelectItem value in some Radix versions).
Recommended fix: Guard against rendering the modal (or the form) when `phases.length === 0`, or show a disabled state with a message that a phase must exist first.

**13. project-detail.tsx:754 | MEDIUM | SelectItem value="" for Unassigned resource**
`<SelectItem value="">Unassigned</SelectItem>` uses an empty string as the value. Radix UI's Select component treats `""` as a falsy/invalid value in some versions, causing the trigger to display as blank or throw a console warning rather than showing "Unassigned".
Recommended fix: Use a sentinel string such as `value="__none__"` and convert it back to `undefined` on submit: `resourceId: data.resourceId === "__none__" ? undefined : parseInt(data.resourceId)`.

**14. project-detail.tsx | HIGH | No React Error Boundary anywhere in the component tree**
`App.tsx` mounts `<Router>` inside `<QueryClientProvider>` and `<TooltipProvider>` but there is no `ErrorBoundary` component wrapping any route. If any component throws during render (e.g. unexpected null from a query, missing property on a task object, Recharts receiving bad data), React will unmount the entire tree and the user sees a blank white screen with no message.
Recommended fix: Wrap the `<Switch>` (or individual `<Route>` components) in a `ErrorBoundary` component that renders a fallback UI.

**15. project-detail.tsx:665-678 | MEDIUM | useEffect in TaskModal has incomplete dependency array**
The `useEffect` that calls `form.reset(...)` on modal open has `[open, editTask]` as dependencies, but references `parentTaskId` inside the reset (`parentTaskId ? "subtask" : "task"`). If `parentTaskId` changes while the modal is already open, the form will not re-initialise to the new value because `parentTaskId` is not listed in the dependency array.
Recommended fix: Add `parentTaskId` to the dependency array: `}, [open, editTask, parentTaskId])`.

**16. project-detail.tsx:56-58 | MEDIUM | renumberTasks fires a raw fetch with no error handling**
```ts
async function renumberTasks(projectId: number) {
  await fetch(`/api/projects/${projectId}/tasks/renumber`, { method: "POST" });
}
```
The fetch result is not checked. If the renumber call fails (network error, 500), task numbers will be in an inconsistent state with no user feedback and no retry mechanism.
Recommended fix: Check `response.ok`, throw on failure, and catch in the calling site (delete onSuccess callback) to show an error toast.

**17. project-detail.tsx:682 | MEDIUM | defaultPhaseId uses the non-null assertion operator without a guard**
`phaseId: defaultPhaseId!` will silently pass `undefined` as a number if `defaultPhaseId` is undefined (e.g., when the project has no phases). TypeScript permits the `!` but at runtime the payload will have `phaseId: undefined`, which will fail Zod validation on the server and return a 400 — again with no user-visible error message.
Recommended fix: Guard submission in `onSubmit`: `if (!defaultPhaseId) { toast({ title: "Select a phase first" }); return; }`.

**18. project-detail.tsx:875-876 | LOW | projectId is parsed from URL without NaN guard for routing**
`const projectId = parseInt(params.id, 10)` — if `params.id` is not a numeric string (e.g. a user types `/projects/abc/plan`), `projectId` becomes `NaN`. All queries that depend on it have `enabled: !!projectId`, so `NaN` is falsy and queries are disabled — but the page renders with empty data and a loading state that never resolves, giving no error to the user.
Recommended fix: Add `if (isNaN(projectId)) return <Redirect to="/" />;` immediately after parsing.

**19. project-detail.tsx | LOW | PHASE_COLORS is a hardcoded array with no overflow documented**
`PHASE_COLORS` is a 12-element array and is accessed via `phases.length % PHASE_COLORS.length`, which correctly cycles. This is fine but the array is an anonymous constant with no comment. If the array is ever shortened without updating usages, the modulo boundary changes silently.
Recommended fix: Minor — add a comment noting that the array length is intentionally ≥ typical project phase count.

---

## Schema Issues

**1. tasks — parentTaskId | HIGH | No foreign key constraint on parentTaskId**
`parentTaskId integer("parent_task_id")` has no `.references()` call. This means a task can reference a non-existent parent task ID, or a parent task can be deleted without cascading to or nullifying its children, leaving orphaned child tasks with invalid parentTaskIds that will never render in the tree.
Recommended fix: Add `.references(() => tasksTable.id, { onDelete: "set null" })` to `parentTaskId`.

**2. tasks — taskType, status | HIGH | No database-level enum constraints**
Both `taskType` and `status` are plain `text` columns with no CHECK constraint or Postgres enum type. The only validation is the Zod schema at the API layer. Direct database writes (migrations, admin tools, future services) can insert arbitrary values.
Recommended fix: Either use Drizzle's `pgEnum` to define a Postgres enum, or add a CHECK constraint via `sql` in the column definition.

**3. tasks — pctDone | MEDIUM | No database-level range constraint (0–100)**
`pctDone real("pct_done")` has no CHECK constraint. A direct DB write could set it to -10 or 200.
Recommended fix: Add a Drizzle `check` constraint: `.check("pct_done_range", sql`pct_done >= 0 AND pct_done <= 100`)`.

**4. tasks — updatedAt | MEDIUM | updatedAt uses application-layer trigger, not database trigger**
`.$onUpdate(() => new Date())` is a Drizzle ORM hook — it fires only when Drizzle performs an update. Direct SQL updates via migrations or psql bypass this hook and leave `updatedAt` stale.
Recommended fix: Add a Postgres trigger function (`UPDATE SET updated_at = NOW()`) via a migration, or at minimum document this limitation.

**5. phases — missing updatedAt | LOW | phases table has no updatedAt column**
`phasesTable` has `createdAt` but no `updatedAt`. There is no audit trail for when a phase was last renamed, recoloured, or reordered.
Recommended fix: Add `updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date())`.

**6. tasks — sortOrder default 0 | LOW | sortOrder default is 0 for all new tasks without explicit value**
The schema sets `sortOrder` default to `0`. At the insertion point in tasks.ts the default is `maxNum` (which is also wrong per issue BE-1). This means brand-new projects inserting their first task will have `sortOrder = 0` from both the schema default and the route logic — harmless, but combined with the race condition on maxNum it can produce duplicate sort keys at scale.
Recommended fix: Address with the fix for BE-1; the schema default of `0` is acceptable as a fallback if the application always provides the value.

**7. resources — email | LOW | No unique constraint on email**
`resourcesTable.email` has no unique index. Two resources can share an email address, which would cause confusion when displaying or filtering by resource.
Recommended fix: Add `.unique()` to the email column, or add a unique index in the migration.

**8. projects — startDate/endDate | LOW | Date columns are plain text, not date type**
`startDate` and `endDate` in `projectsTable` are `text` columns, not Postgres `date`. The same applies to `tasks.plannedStart`, `tasks.plannedEnd`, `holidays.startDate`, `holidays.endDate`. Using text loses all database-level date ordering and comparison semantics.
Recommended fix: Change these columns to `date` type in a migration, or at minimum add a CHECK constraint enforcing ISO 8601 format.

---

## Summary

| Severity | Backend | Frontend | Schema | Total |
|----------|---------|----------|--------|-------|
| HIGH     | 4       | 9        | 2      | 15    |
| MEDIUM   | 7       | 7        | 3      | 17    |
| LOW      | 4       | 3        | 3      | 10    |
| **Total**| **15**  | **19**   | **8**  | **42**|

### Overall Assessment

The codebase is functional for single-user local development but has serious deficiencies for any production or multi-user scenario.

**Critical structural gaps:**
- Zero try/catch coverage across all six route files means any database error returns an unstructured 500 HTML response.
- CORS is fully open — this must be restricted before any public deployment.
- The taskNumber race condition will produce duplicate IDs under any concurrent load.
- Every single mutation in the frontend (12 out of 12 mutation call sites) is missing an `onError` handler, meaning users receive no feedback on any failure.
- There is no React Error Boundary; a single render throw = blank screen for the user.

**Data integrity gaps:**
- `parentTaskId` has no FK constraint — orphaned subtasks are possible.
- `taskType` and `status` have no enum enforcement at the DB layer.
- Phase ownership is never verified when assigning tasks — cross-project data leakage is possible via the API.

**Recommended priority order:**
1. Add global Express error handler + try/catch wrapper (unblocks all error visibility)
2. Fix race condition on taskNumber (DB transaction)
3. Add phaseId ownership check on task create/update
4. Add `onError` handlers to all frontend mutations
5. Add React Error Boundary
6. Restrict CORS
7. Add FK on parentTaskId
8. Add enum validation (Zod + DB CHECK) for taskType and status
9. Fix Phase selector in TaskModal (non-functional onValueChange)
10. Fix sortOrder default (maxNum → maxNum+1)
