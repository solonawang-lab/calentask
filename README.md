# CalenTask (MVP)

Calendar + tasks in one day view, with drag-to-schedule.

## Structure
- `PLAN.md` — planning doc
- `web/` — Next.js + Tailwind MVP

## Run locally
```bash
cd web
npm install
npm run dev
```
Then open <http://localhost:3000>.

## What works (current MVP)
- Day timeline (8:00–20:00, 30-min slots)
- Unscheduled tasks list
- Drag task → drop onto a time slot to schedule it
- LocalStorage persistence for tasks

## Next steps
- Google Calendar OAuth + read events (replace sample events)
- Supabase persistence + auth
- Natural language parsing + auto-schedule
