"use client";

import { buildSlots, fmtTime, minutesBetween } from "@/lib/dates";
import type { CalendarEvent, Task } from "@/lib/types";
import { TimeSlot } from "@/components/TimeSlot";

function Block({ title, meta, tone }: { title: string; meta?: string; tone: "event" | "task" }) {
  const base =
    tone === "event"
      ? "border-blue-200 bg-blue-50 text-blue-950"
      : "border-zinc-200 bg-zinc-50 text-zinc-900";
  return (
    <div className={"w-full rounded-md border px-3 py-2 text-sm " + base}>
      <div className="truncate font-medium">{title}</div>
      {meta ? <div className="mt-0.5 text-xs opacity-70">{meta}</div> : null}
    </div>
  );
}

export function DayTimeline({
  selectedDate,
  events,
  scheduledTasks,
}: {
  selectedDate: Date;
  events: CalendarEvent[];
  scheduledTasks: Task[];
}) {
  const slots = buildSlots(selectedDate, 8, 20, 30);

  // Only render items that start exactly at a slot boundary (keeps MVP simple)
  const itemsBySlot: Record<string, Array<{ kind: "event" | "task"; id: string }>> = {};

  for (const ev of events) {
    const start = new Date(ev.start);
    const key = start.toISOString();
    itemsBySlot[key] ||= [];
    itemsBySlot[key].push({ kind: "event", id: ev.id });
  }
  for (const t of scheduledTasks) {
    if (!t.scheduledStart) continue;
    const start = new Date(t.scheduledStart);
    const key = start.toISOString();
    itemsBySlot[key] ||= [];
    itemsBySlot[key].push({ kind: "task", id: t.id });
  }

  const eventById = Object.fromEntries(events.map((e) => [e.id, e] as const));
  const taskById = Object.fromEntries(scheduledTasks.map((t) => [t.id, t] as const));

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-800">
        Day
      </div>
      <div>
        {slots.map((slot) => {
          const slotId = slot.toISOString();
          const items = itemsBySlot[slotId] || [];
          return (
            <TimeSlot key={slotId} id={slotId} label={fmtTime(slot)}>
              <div className="flex flex-col gap-2">
                {items.map((it) => {
                  if (it.kind === "event") {
                    const ev = eventById[it.id];
                    const mins = minutesBetween(ev.start, ev.end);
                    return <Block key={it.id} title={"▓▓ " + ev.title} meta={`${mins}m • ${ev.source}`} tone="event" />;
                  }
                  const t = taskById[it.id];
                  const mins = t.scheduledStart && t.scheduledEnd ? minutesBetween(t.scheduledStart, t.scheduledEnd) : t.estimatedMinutes;
                  return <Block key={it.id} title={"▓▓ " + t.title} meta={`${mins}m • task`} tone="task" />;
                })}
                {items.length === 0 ? (
                  <div className="text-xs text-zinc-400">░░ free (drop task here)</div>
                ) : null}
              </div>
            </TimeSlot>
          );
        })}
      </div>
    </div>
  );
}
