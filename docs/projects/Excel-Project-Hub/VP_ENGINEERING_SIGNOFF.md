# VP Engineering Sign-Off — Excel-Project-Hub
## Date: 2026-06-06
## Author: VP Engineering

---

## Preamble

Both audit reports have been reviewed in full alongside the actual source. The
issues documented by QA and the code reviewer are confirmed and reproducible from
the source. This document is the authoritative implementation guide for the
developer pass. Do not deviate from the approach specified here without first
raising a concern — the risks of each fix have already been evaluated.

Seven issues are addressed below (C1–C7). All are either CRITICAL or HIGH
severity. MEDIUM and LOW issues are explicitly deferred; see the final section.

---

## Technical approach per fix

---

### C1 — SelectItem empty value crash

**File:** `artifacts/project-tracker/src/pages/project-detail.tsx`

**Location in file:** Line 754 (inside `TaskModal`, the Resource `<Select>`)

**Current code:**
```tsx
<SelectItem value="">Unassigned</SelectItem>
```
And the corresponding form default (line 658):
```tsx
resourceId: editTask?.resourceId ? String(editTask.resourceId) : "",
```
And the reset inside `useEffect` (line 673):
```tsx
resourceId: editTask?.resourceId ? String(editTask.resourceId) : "",
```

**Change to:**

Step 1 — Replace the SelectItem value with a sentinel:
```tsx
<SelectItem value="__none__">Unassigned</SelectItem>
```

Step 2 — Replace both occurrences of the form default (`""`) with the sentinel:
```tsx
resourceId: editTask?.resourceId ? String(editTask.resourceId) : "__none__",
```
(This applies to both the `useForm` defaultValues on line 658 AND the
`form.reset(...)` call inside the `useEffect` on line 673 — both must be
updated to keep them in sync.)

Step 3 — In `onSubmit` (line 688), change the resourceId conversion:
```tsx
// Current:
resourceId: data.resourceId ? parseInt(data.resourceId) : undefined,

// Change to:
resourceId: data.resourceId && data.resourceId !== "__none__"
  ? parseInt(data.resourceId)
  : undefined,
```

**Risk:** The `form.watch("resourceId")` value drives the `<Select value={...}>`.
If any code path sets `resourceId` to `""` after this change, the Select trigger
will display blank. Search the file for any other assignment to `resourceId` in
form state before declaring the fix complete. The sentinel `__none__` must be
used consistently everywhere; mixing `""` and `__none__` in different code paths
is the main failure mode.

**Test:**
1. Open "Add Task" when at least one resource exists — the modal must open
   without any console error or thrown exception.
2. Confirm the Resource dropdown shows "Unassigned" as the default selected item.
3. Select a resource, submit — confirm `resourceId` is sent as a number in the
   POST body.
4. Select "Unassigned" explicitly, submit — confirm `resourceId` is absent from
   (or `undefined` in) the POST body.
5. Edit an existing task that has no resource — confirm "Unassigned" is
   pre-selected and the modal opens cleanly.

---

### C2 — All mutations missing onError

**File:** `artifacts/project-tracker/src/pages/project-detail.tsx`

**Scope:** Every `.mutate(...)` call in the file. The code reviewer catalogued
12 call sites across the following components:
- `InlineStatusSelect` (line 119)
- `InlinePctEdit.save()` (line 149)
- `TaskRow.handleDescSave` (line 187)
- `TaskRow` delete AlertDialog action (line 227)
- `PhaseSection.toggleCollapse` (line 260)
- `PhaseSection.saveName` (line 268)
- `PhaseSection` delete (line 321)
- `TaskModal.onSubmit` updateTask (line 699)
- `TaskModal.onSubmit` createTask (line 701)
- `ProjectHeader` name save (line 807)
- `ProjectHeader` description save (line 815)
- `ProjectDetailPage.addPhase` (line 899)

**Setup required first:** The file does not currently import `useToast`. Add it
at the top of the file alongside the existing imports:
```tsx
import { useToast } from "@/hooks/use-toast";
```
Note: the hook lives at
`artifacts/project-tracker/src/hooks/use-toast.ts` and is exported as
`useToast`. It is NOT under `@/components/ui/use-toast` — confirm the path
resolves correctly before using it.

Each component that calls `.mutate()` must call `useToast()` at its top level:
```tsx
const { toast } = useToast();
```

**Change pattern — apply to every mutate call site:**
```tsx
// Current pattern (example from InlineStatusSelect):
updateTask.mutate(
  { id: task.id, data: { status: val } },
  { onSuccess: () => { ... } }
)

// Change to:
updateTask.mutate(
  { id: task.id, data: { status: val } },
  {
    onSuccess: () => { ... },
    onError: () => {
      toast({ title: "Failed to update status", variant: "destructive" });
    },
  }
)
```

**Specific onError messages to use per call site:**

| Component / call site | Toast title |
|---|---|
| InlineStatusSelect | "Failed to update status" |
| InlinePctEdit | "Failed to update progress" |
| TaskRow inline description save | "Failed to save description" |
| TaskRow delete | "Failed to delete task" |
| PhaseSection toggleCollapse | "Failed to update phase" |
| PhaseSection saveName | "Failed to rename phase" |
| PhaseSection delete | "Failed to delete phase" |
| TaskModal createTask | "Failed to create task" |
| TaskModal updateTask | "Failed to save task" |
| ProjectHeader name | "Failed to update project name" |
| ProjectHeader description | "Failed to update project description" |
| addPhase | "Failed to create phase" |

**InlinePctEdit additional requirement:** On top of the toast, also call
`setEditing(false)` inside onError so the input does not remain stuck in edit
mode:
```tsx
onError: () => {
  setEditing(false);
  toast({ title: "Failed to update progress", variant: "destructive" });
},
```

**Risk:** `useToast` must be called at the component function level (React hook
rules), not inside the callback. If a component is a plain function (not a React
component) that does not currently call any hooks, it cannot call `useToast`
directly — but all affected call sites in this file are inside React components,
so this is not an issue here. Double-check `renumberTasks` at line 56, which is
a plain `async function` — it cannot use hooks; its error handling is covered
separately in C7.

**Test:**
1. With the dev server running and the network tab open, throttle to offline.
2. Try updating a task status — a destructive toast must appear.
3. Try creating a task — a destructive toast must appear; the modal must stay
   open (do not call `onClose()` inside `onError`).
4. Try deleting a task — a destructive toast must appear.
5. Restore network, confirm normal operations succeed with no error toast.

---

### C3 — No React Error Boundary

**File:** `artifacts/project-tracker/src/App.tsx`

**Current code (lines 34–45):**
```tsx
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
```

**Change to:**

Step 1 — Create a new file `artifacts/project-tracker/src/components/ErrorBoundary.tsx`:
```tsx
import React from "react";

interface Props { children: React.ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
          <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
          <p className="text-muted-foreground text-sm mb-4">
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <button
            className="text-sm underline text-primary"
            onClick={() => this.setState({ hasError: false, error: undefined })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

Step 2 — Import and wrap `<Router />` in `App.tsx`:
```tsx
import { ErrorBoundary } from "@/components/ErrorBoundary";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
```

**Why the boundary wraps both `<WouterRouter>` and `<Toaster>`:** Placing the
boundary outside the router means any navigation-triggered render crash is
caught. `<Toaster>` sits outside the router intentionally, so it is included
inside the boundary to keep the tree contained. The boundary must be inside
`<QueryClientProvider>` and `<TooltipProvider>` so those providers remain
available if the boundary needs to render a recovery UI that uses them.

**Risk:** Error boundaries in React are class components — there is no hook
equivalent. The file must be a `.tsx` file (not `.ts`) because it returns JSX.
The `"Try again"` button resets `hasError` to false, which causes a re-render;
if the error is deterministic (e.g. bad data that always triggers the same
crash), the user will re-crash immediately. That is acceptable for now — fixing
the root crash (C1) is the priority. Do not add any `useEffect` or other hooks
inside `ErrorBoundary` — it is a pure class component.

**Test:**
1. Temporarily throw inside `ProjectDetailPage` on mount:
   `throw new Error("test boundary")`. Verify the fallback UI renders instead
   of a blank screen. Remove the throw afterward.
2. Open the Add Task modal with the C1 fix NOT applied on a copy — confirm the
   Radix crash is caught by the boundary and shows the fallback rather than
   white-screening.
3. Click "Try again" — confirm it re-renders the app.

---

### C4 — Phase selector onValueChange no-op

**File:** `artifacts/project-tracker/src/pages/project-detail.tsx`

**Location:** Lines 650–703 (`TaskModal` function body)

**Root cause:** The `<Select>` for Phase uses `defaultPhaseId` directly as its
value and `onValueChange={() => {}}` as a no-op. The `phaseId` is never tracked
in form state — it is a variable derived from props and frozen at modal-open
time.

**Change required:**

Step 1 — Add `phaseId` to the `TaskFormData` interface (line 51):
```tsx
// Current:
interface TaskFormData {
  description: string; taskType: string; plannedStart: string; plannedEnd: string;
  resourceId: string; pctDone: string; status: string; notes: string;
}

// Change to:
interface TaskFormData {
  description: string; taskType: string; plannedStart: string; plannedEnd: string;
  resourceId: string; pctDone: string; status: string; notes: string;
  phaseId: string;
}
```

Step 2 — Add `phaseId` to both the `useForm` `defaultValues` (line 652) and the
`form.reset(...)` inside `useEffect` (line 667). In both locations add:
```tsx
phaseId: String(defaultPhaseId ?? ""),
```

Step 3 — Wire the Phase `<Select>` to form state (lines 719–724):
```tsx
// Current:
<Select value={String(defaultPhaseId ?? "")} onValueChange={() => {}}>

// Change to:
<Select
  value={form.watch("phaseId")}
  onValueChange={(v) => form.setValue("phaseId", v)}
>
```

Step 4 — In `onSubmit` (line 680–692), replace the use of `defaultPhaseId!`
with the form value, and add a guard for missing phase:
```tsx
function onSubmit(data: TaskFormData) {
  const resolvedPhaseId = data.phaseId ? parseInt(data.phaseId) : undefined;
  if (!resolvedPhaseId) {
    toast({ title: "Please select a phase", variant: "destructive" });
    return;
  }
  const payload = {
    phaseId: resolvedPhaseId,
    taskType: data.taskType,
    description: data.description,
    parentTaskId: parentTaskId ?? editTask?.parentTaskId ?? undefined,
    plannedStart: data.plannedStart || undefined,
    plannedEnd: data.plannedEnd || undefined,
    resourceId: data.resourceId && data.resourceId !== "__none__"
      ? parseInt(data.resourceId)
      : undefined,
    pctDone: parseFloat(data.pctDone) || 0,
    status: data.status,
    notes: data.notes || undefined,
  };
  // ... rest of onSubmit unchanged
}
```

Note: `toast` must already be available via `useToast()` from the C2 fix. These
two fixes (C2 and C4) must be applied together, or `toast` will not be in scope.

**Also update the useEffect dependency array (line 678):**
The `useEffect` already has `[open, editTask]` as dependencies. The `phaseId`
prop (which feeds `defaultPhaseId`) should also be a dependency:
```tsx
}, [open, editTask, phaseId]);
```

**Risk:** The `defaultPhaseId` variable (line 650) is still computed from props
as a fallback. After this change it is only used to initialise the form, not to
drive the Select value directly. If the `phases` prop changes after the modal is
already open (e.g. a new phase is added in the background), the form's
`phaseId` field will hold a stale string ID. This is acceptable — the modal is
a point-in-time snapshot of phases at open time. Do not add a query invalidation
inside the modal.

**Test:**
1. Open "Add Task" from Phase A.
2. In the modal, open the Phase dropdown and select Phase B.
3. Submit — confirm the task is created under Phase B (visible in the plan view
   under Phase B's section, not Phase A).
4. Open "Edit Task" on an existing task in Phase A, change to Phase B, save —
   confirm the task moves to Phase B.
5. Open "Add Task" when only one phase exists — confirm the single phase is
   pre-selected and the form submits correctly.

---

### C5 — sortOrder default wrong in tasks.ts POST

**File:** `artifacts/api-server/src/routes/tasks.ts`

**Location:** Line 126

**Current code:**
```ts
sortOrder: parsed.data.sortOrder ?? maxNum,
```

**Change to:**
```ts
sortOrder: parsed.data.sortOrder ?? maxNum + 1,
```

**Context:** `maxNum` is computed on line 111 as the maximum `taskNumber` across
all tasks in the project (not max `sortOrder`). This is a separate pre-existing
issue (using taskNumber as a proxy for sortOrder) but the immediate fix is
strictly the `?? maxNum + 1` change as specified. The QA audit confirmed that
using `maxNum` produces duplicate sortOrder values after deletion, causing
non-deterministic ordering.

A complete fix would also query `MAX(sortOrder)` rather than `MAX(taskNumber)`.
That change is out of scope for this pass (see "Do NOT fix" section below) — but
note it for the next pass.

**Risk:** If `parsed.data.sortOrder` is explicitly provided by the caller (e.g.
a drag-and-drop reorder), this line is not reached (the `??` short-circuits).
The fix only affects the default path. No consumer currently provides an explicit
`sortOrder` in the payload, so this is safe.

**Test:**
1. Create three tasks in a project (T-001, T-002, T-003). Query
   `GET /api/projects/:id/tasks` and confirm `sortOrder` values are 1, 2, 3
   (or 0, 1, 2 for the first task — verify sequence is strictly ascending and
   has no ties).
2. Delete T-002. Create a new task. Confirm the new task's `sortOrder` is
   greater than T-003's `sortOrder`, not equal to it.
3. Confirm task list ordering remains deterministic after multiple
   create-and-delete cycles.

---

### C6 — No phaseId ownership check in tasks.ts POST

**File:** `artifacts/api-server/src/routes/tasks.ts`

**Location:** After line 105 (body parse success), before the `existingTasks`
query on line 107.

**Current code:** No ownership check exists. The `phaseId` from the request body
is inserted directly.

**Change required:**

Step 1 — Add `phasesTable` to the import at the top of the file (line 3):
```ts
// Current:
import { db, tasksTable, resourcesTable } from "@workspace/db";

// Change to:
import { db, tasksTable, resourcesTable, phasesTable } from "@workspace/db";
```

`phasesTable` is confirmed to be exported from `@workspace/db` via the schema
index. It has a `projectId` column.

Step 2 — Insert the ownership check after the body parse block (after line 105),
before the `existingTasks` query:
```ts
// Verify phaseId belongs to this project
if (parsed.data.phaseId !== undefined) {
  const [phase] = await db
    .select({ id: phasesTable.id })
    .from(phasesTable)
    .where(
      eq(phasesTable.id, parsed.data.phaseId) &&
      eq(phasesTable.projectId, params.data.projectId)
    );
  if (!phase) {
    res.status(400).json({ error: "phaseId does not belong to this project" });
    return;
  }
}
```

**Important note on the Drizzle `where` clause:** Drizzle ORM requires `.where`
to receive a single SQL expression. To combine two conditions use `and()` from
`drizzle-orm`:
```ts
import { eq, asc, and } from "drizzle-orm";
// then:
.where(and(eq(phasesTable.id, parsed.data.phaseId), eq(phasesTable.projectId, params.data.projectId)))
```
Update the import on line 2 to include `and`.

**Risk:** This adds one extra DB round-trip per task creation. Under normal load
this is negligible. The existing code has no try/catch (a separate MEDIUM issue
not being fixed in this pass), so if the DB is unreachable this query will also
throw — that behaviour is unchanged from the current state.

`phaseId` is required by `CreateTaskBody` (it is not optional in the Zod schema),
so the `if (parsed.data.phaseId !== undefined)` guard is technically always true,
but it is kept as a defensive check in case the schema is later relaxed. Do not
remove it.

**Test:**
1. POST to `/api/projects/1/tasks` with a `phaseId` that belongs to project 2 —
   confirm a 400 response with the error message "phaseId does not belong to
   this project".
2. POST with a valid `phaseId` belonging to project 1 — confirm 201 and task
   created correctly.
3. POST with a non-existent `phaseId` — confirm 400.
4. Confirm QA test case #7 now returns 400 instead of 201.

---

### C7 — renumberTasks has no transaction and no error handling

**This fix has two parts: backend (tasks.ts) and frontend (project-detail.tsx).**

#### C7a — Backend: wrap renumber loop in a transaction

**File:** `artifacts/api-server/src/routes/tasks.ts`

**Location:** Lines 74–93 (the `/renumber` endpoint) and lines 188–195 (the
delete handler's inline renumber loop).

**Current code (renumber endpoint, lines 80–92):**
```ts
const allTasks = await db
  .select({ id: tasksTable.id })
  .from(tasksTable)
  .where(eq(tasksTable.projectId, projectId))
  .orderBy(asc(tasksTable.sortOrder), asc(tasksTable.id));

for (let i = 0; i < allTasks.length; i++) {
  await db
    .update(tasksTable)
    .set({ taskNumber: i + 1 })
    .where(eq(tasksTable.id, allTasks[i].id));
}
res.json({ renumbered: allTasks.length });
```

**Change to (renumber endpoint):**
```ts
let renumbered = 0;
await db.transaction(async (tx) => {
  const allTasks = await tx
    .select({ id: tasksTable.id })
    .from(tasksTable)
    .where(eq(tasksTable.projectId, projectId))
    .orderBy(asc(tasksTable.sortOrder), asc(tasksTable.id));

  for (let i = 0; i < allTasks.length; i++) {
    await tx
      .update(tasksTable)
      .set({ taskNumber: i + 1 })
      .where(eq(tasksTable.id, allTasks[i].id));
  }
  renumbered = allTasks.length;
});
res.json({ renumbered });
```

**Current code (delete handler renumber, lines 188–195):**
```ts
const remaining = await db
  .select({ id: tasksTable.id })
  .from(tasksTable)
  .where(eq(tasksTable.projectId, deleted.projectId))
  .orderBy(asc(tasksTable.sortOrder), asc(tasksTable.id));
for (let i = 0; i < remaining.length; i++) {
  await db.update(tasksTable).set({ taskNumber: i + 1 }).where(eq(tasksTable.id, remaining[i].id));
}
```

**Change to (delete handler):**
```ts
await db.transaction(async (tx) => {
  const remaining = await tx
    .select({ id: tasksTable.id })
    .from(tasksTable)
    .where(eq(tasksTable.projectId, deleted.projectId))
    .orderBy(asc(tasksTable.sortOrder), asc(tasksTable.id));
  for (let i = 0; i < remaining.length; i++) {
    await tx
      .update(tasksTable)
      .set({ taskNumber: i + 1 })
      .where(eq(tasksTable.id, remaining[i].id));
  }
});
```

Note: `db.transaction(async (tx) => { ... })` is the Drizzle ORM transaction
API. The `tx` object has the same `.select`, `.update`, `.insert` methods as
`db`. Drizzle will automatically roll back if the callback throws.

#### C7b — Frontend: check response.ok in renumberTasks

**File:** `artifacts/project-tracker/src/pages/project-detail.tsx`

**Location:** Lines 56–58

**Current code:**
```ts
async function renumberTasks(projectId: number) {
  await fetch(`/api/projects/${projectId}/tasks/renumber`, { method: "POST" });
}
```

**Change to:**
```ts
async function renumberTasks(projectId: number): Promise<void> {
  const res = await fetch(`/api/projects/${projectId}/tasks/renumber`, { method: "POST" });
  if (!res.ok) {
    throw new Error(`Renumber failed: ${res.status}`);
  }
}
```

The calling site (line 227, the delete `onSuccess` callback) must catch this
throw. Update it:
```tsx
// Current:
onClick={() => deleteTask.mutate({ id: task.id }, {
  onSuccess: async () => { await renumberTasks(projectId); invalidate(); }
})}

// Change to:
onClick={() => deleteTask.mutate({ id: task.id }, {
  onSuccess: async () => {
    try {
      await renumberTasks(projectId);
    } catch {
      toast({ title: "Task deleted but renumbering failed — refresh to see correct numbers", variant: "destructive" });
    }
    invalidate();
  },
  onError: () => {
    toast({ title: "Failed to delete task", variant: "destructive" });
  },
})}
```

Note: `invalidate()` is called regardless of whether renumber succeeds. The task
is already deleted; the query cache must be refreshed so the UI is not stale even
if renumbering partially failed. The toast in the catch block informs the user
they may see stale task numbers.

`toast` must be in scope via `useToast()` — this is already set up by the C2
fix. C2 and C7b must be applied together.

**Risk (both C7a and C7b):** Drizzle's `db.transaction()` wraps operations in a
single Postgres transaction with the default isolation level (read committed). A
partial renumber mid-loop will be rolled back on failure, which is the desired
behaviour. However, if many tasks exist (e.g. 500+), the loop-per-row approach
is still slow inside a transaction. This is acceptable for now — a batch UPDATE
optimisation is a future improvement and is out of scope for this pass.

**Test:**
1. Create five tasks. Delete task 3. Confirm all remaining tasks are renumbered
   T-001 through T-004 with no gaps. Confirm via `GET /api/projects/:id/tasks`
   that `taskNumber` values are sequential.
2. Simulate a DB failure mid-renumber (e.g. by temporarily killing the DB
   connection) and confirm task numbers are not left in a partially-renumbered
   state after the transaction rolls back.
3. On the frontend: intercept the `/renumber` POST to return a 500. Confirm the
   toast warning appears and the task list still refreshes (the deleted task is
   gone from the UI).

---

## Implementation order

The developer must implement fixes in this exact order to avoid conflicts:

1. **C3 first** — Create `ErrorBoundary.tsx` and wrap App.tsx. This is a net-new
   file with no dependencies on other fixes. Getting this in place first means
   any mistake during subsequent fixes is caught by the boundary rather than
   white-screening.

2. **C1** — Fix the SelectItem sentinel value. This is isolated to TaskModal and
   has no dependencies on other fixes. It eliminates the crash that would
   otherwise sabotage testing of C4.

3. **C2** — Add `useToast` import and `onError` handlers across all mutations.
   Do this before C4 and C7b because those fixes require `toast` to be in scope
   in `TaskModal` and `TaskRow` respectively.

4. **C4** — Fix the Phase selector. Depends on C2 (needs `toast` in
   `TaskModal.onSubmit`). Update `TaskFormData`, form defaults, the Select wire,
   and the `onSubmit` guard in one atomic edit.

5. **C5** — Fix `sortOrder` default in `tasks.ts`. Single-line change, no
   dependencies. Do it before C6 since both touch the POST handler and the
   developer should minimise the number of times they re-open the same function.

6. **C6** — Add phaseId ownership check in `tasks.ts`. Depends on C5 being
   applied first (so the developer is already in the POST handler). Requires
   updating the import line to add `phasesTable` and `and`.

7. **C7** — Add transactions to renumber loops (backend) and fix
   `renumberTasks` error handling (frontend). C7b depends on C2 (needs `toast`).
   Apply C7a (backend transactions) and C7b (frontend error handling) together.

---

## Do NOT fix in this pass

The following issues were identified in the audit reports but are explicitly
deferred. They either carry higher implementation risk, require schema migrations,
or are best addressed in a dedicated follow-up pass after the critical fixes are
verified stable.

| Issue | Reason for deferral |
|---|---|
| Race condition on taskNumber (tasks.ts:95–136) | Requires DB transaction + isolation level change. High-risk; needs its own pass with load testing. |
| Replace `MAX(taskNumber)` with `MAX(sortOrder)` for sortOrder default | Needs a separate query. Deferring to avoid over-expanding the POST handler scope in this pass. Flag for next pass. |
| phaseId ownership check in PATCH /tasks/:id | Same pattern as C6 but on the update path. Deferred to avoid scope creep; not yet confirmed exploited in practice. |
| Global Express error handler (no try/catch) | Medium-risk refactor across all route files. Deserves its own engineering pass with integration tests. |
| Enum validation for taskType and status (Zod + DB) | Requires schema migration and Zod schema changes; coordinate with DB migration pass. |
| pctDone range validation (0–100) in Zod | Minor; add in the same pass as enum validation. |
| CORS restriction | Config change; requires knowing the production origin. Needs DevOps input. |
| Schema migrations (FK on parentTaskId, date column types, DB-level enums) | All require coordinated migration files. Do not touch schema in this pass. |
| MEDIUM and LOW UI issues (Gantt timezone, double-fire toggle, InlineDescEdit feedback, etc.) | UX polish; not blocking correctness. Schedule separately. |
| Phase selector empty value when no phases exist (Code Review #12) | Edge case; add a `phases.length === 0` guard in a UX polish pass. |
| NaN guard for projectId URL param (Code Review #18) | Low risk; add in UX pass. |
| useEffect dependency array missing `parentTaskId` (Code Review #15) | Low-risk edge case; add `parentTaskId` to the dep array in the UX pass. |

---

## Sign-off

**VP Engineering sign-off: APPROVED — proceed to developer pass**

The seven fixes described above are technically sound, scoped tightly, and have
been cross-checked against the actual source files. Each fix is self-contained
or explicitly ordered to resolve dependencies. The implementation order is
mandatory — do not re-sequence without sign-off.

No fix in this pass touches the database schema or requires a migration. All
backend changes are confined to `tasks.ts`. All frontend changes are confined to
`project-detail.tsx` and `App.tsx`, plus one new file (`ErrorBoundary.tsx`).

A follow-up engineering pass must be scheduled for the deferred items — in
particular the taskNumber race condition and the global Express error handler,
which remain live risks in any concurrent or production deployment.
