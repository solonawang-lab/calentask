# CalenTask — PLAN (MVP)

## Goals (MVP)
- Single **Day view** showing **calendar events + scheduled tasks** together (8am–8pm).
- **Unscheduled tasks** list below.
- **Drag task → drop on time slot** to schedule (creates a scheduled block).
- Persist locally first (LocalStorage). Clean, minimal, mobile-responsive.

---

## Tech stack (Phase 1–2)
- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **@dnd-kit** for drag-and-drop (lightweight, accessible)
- **date-fns** for date/time utilities
- Storage (Phase 2.5): **LocalStorage** via a small `useLocalStorage` hook

## Tech stack (Phase 2.6–2.7, later)
- Google Calendar: **OAuth 2.0** + **Google Calendar API** (read events)
- Backend: **Supabase**
  - Auth (Google OAuth via Supabase or direct Google OAuth)
  - Postgres tables for tasks and calendar connections

---

## Data model
### Local (Phase 2: LocalStorage)
TypeScript types:
- `CalendarEvent` (read-only; later from Google)
  - `id`, `title`, `start`, `end`, `source: 'google'|'local'`
- `Task`
  - `id: string`
  - `title: string`
  - `notes?: string`
  - `estimatedMinutes?: number` (default 30)
  - `scheduledStart?: string` (ISO)
  - `scheduledEnd?: string` (ISO)
  - `completedAt?: string` (ISO)
  - `createdAt: string` (ISO)

LocalStorage keys:
- `calentask.tasks.v1`
- `calentask.ui.v1` (selected date, etc.)

### Supabase (Phase 2.7)
```sql
create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  title text not null,
  notes text,
  estimated_minutes int,
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table calendar_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  provider text not null check (provider in ('google')),
  access_token text,
  refresh_token text,
  expires_at timestamptz,
  scope text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```
RLS: tasks are user-owned.

---

## API routes needed
### Phase 2 (local-first)
None required.

### Phase 2.6 (Google Calendar read)
Using Next.js Route Handlers:
- `GET /api/google/auth/start` → redirect to Google OAuth consent
- `GET /api/google/auth/callback` → exchange code, store tokens (cookie or DB)
- `GET /api/google/events?date=YYYY-MM-DD` → fetch events for day

### Phase 2.7 (Supabase)
- `GET /api/tasks` (optional; can call Supabase directly from client)
- `POST /api/tasks`
- `PATCH /api/tasks/:id`

(Prefer direct Supabase client in Next.js for MVP; keep API routes minimal.)

---

## Component structure
App layout (single page MVP):
- `DayViewPage`
  - `Header` (Today + date picker)
  - `DayTimeline`
    - `TimeSlot` rows (8:00–20:00)
    - `EventBlock` (calendar events)
    - `TaskBlock` (scheduled tasks)
  - `UnscheduledTasks`
    - `TaskCard` (draggable)
  - `QuickAddTask` (input + estimated minutes)

DnD behavior:
- Draggable: `TaskCard` for unscheduled tasks
- Droppable: `TimeSlot` (each 30-min slot)
- On drop: set `scheduledStart` to slot time; `scheduledEnd = start + estimatedMinutes`

---

## File organization (Next.js App Router)
```
calentask/
  app/
    layout.tsx
    page.tsx
    globals.css
    api/ (later)
  components/
    DayTimeline.tsx
    TimeSlot.tsx
    TaskCard.tsx
    UnscheduledTasks.tsx
    Header.tsx
    QuickAddTask.tsx
  lib/
    dates.ts
    storage.ts
    types.ts
  public/
  README.md
```

---

## Milestones
1) Phase 1: scaffold + PLAN ✅
2) Phase 2.1: Next + Tailwind ✅
3) Phase 2.2–2.5: Day view + tasks + DnD + LocalStorage
4) Phase 2.6: Google OAuth + read events (merge into day view)
5) Phase 2.7: Supabase persistence for tasks
6) Phase 3: NLP parsing + auto-schedule
